import {ReelContainer} from "../../reels/ReelsContainer.ts";
import {WeightedSpinGenerator} from "../engine/WeightedSpinGenerator.ts";
import {WalletManager} from "../wallet/WalletManager.ts";
import {BetManager} from "../bet/BetManager.ts";

export class SpinManager {
    private isAutoSpinActive: boolean = false;
    private isCheckingWin: boolean = false;

    private reelsContainer: ReelContainer;
    private spinGenerator: WeightedSpinGenerator;
    private onSpinStart?: () => void;
    private onSpinEnd?: () => void;
    private wallet: WalletManager;
    private betManager: BetManager;
    private onWinCheck: (matrix: string[][]) => void;
    private onBalanceUpdate: () => void;

    constructor(
        reelsContainer: ReelContainer,
        spinGenerator: WeightedSpinGenerator,
        wallet: WalletManager,
        betManager: BetManager,
        onWinCheck: (matrix: string[][]) => void,
        onBalanceUpdate: () => void,
    ) {
        this.reelsContainer = reelsContainer;
        this.spinGenerator = spinGenerator;
        this.wallet = wallet;
        this.betManager = betManager;
        this.onWinCheck = onWinCheck;
        this.onBalanceUpdate = onBalanceUpdate;
    }

    async executeSpin(): Promise<void> {
        if (this.reelsContainer.isAnySpinning()) return;
        if (!this.wallet.canSpin()) {
            this.stopAutoSpin();
            return;
        }
        if (this.isCheckingWin) return;

        this.betManager.setSpinning(true);

        this.wallet.spendBet();
        this.onBalanceUpdate();

        const matrix = this.spinGenerator.generateMatrix();
        this.reelsContainer.setSpinResult(matrix);

        this.onSpinStart?.();

        await this.reelsContainer.spinAll(() => {
            if (this.reelsContainer.isAnySpinning()) return;

            this.isCheckingWin = true;

            const realMatrix = this.reelsContainer.getSymbolMatrix();
            this.onWinCheck(realMatrix);

            this.isCheckingWin = false;
            this.betManager.setSpinning(false);
            this.onSpinEnd?.();

            if (this.isAutoSpinActive) {
                setTimeout(() => this.executeSpin(), 500);
            }
        });
    }

    toggleAutoSpin(): void {
        this.isAutoSpinActive = !this.isAutoSpinActive;
        if (this.isAutoSpinActive) {
            this.executeSpin();
        }
    }

    stopAutoSpin(): void {
        this.isAutoSpinActive = false;
    }

    public setSpinCallbacks(onStart: () => void, onEnd: () => void): void {
        this.onSpinStart = onStart;
        this.onSpinEnd = onEnd;
    }
}