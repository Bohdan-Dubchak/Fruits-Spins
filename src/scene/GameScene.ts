import { Assets, Container, Sprite } from "pixi.js";
import { ReelContainer } from "../reels/ReelsContainer.ts";
import { SpinButton } from "../ui/spinButton.ts";
import { GAME_CONFIG } from "../config/constants.ts";
import { payLines, payTable } from "../config/paylines.ts";
import { WinCalculator } from "../game/engine/WinCalculator.ts";
import { AutoSpin } from "../ui/autoSpinBtn.ts";
import { PlusBet } from "../ui/plusButton.ts";
import { HUD } from "../ui/HUD.ts";
import { MinusButton } from "../ui/minusButton.ts";
import { WalletManager } from "../game/engine/WalletManager.ts";

export class GameScene extends Container {
    private reelsContainer!: ReelContainer;
    private hud!: HUD;

    private wallet = new WalletManager();

    private payTable: Record<string, Record<number, number>> = payTable;

    private isAutoSpun: boolean = false;
    private isCheckingWin: boolean = false;

    constructor() {
        super();
        this.init();
    }

    private async init(): Promise<void> {
        this.createBackgroundImage();
        this.createReels();

        this.hud = new HUD(
            this.wallet.getBalance(),
            this.wallet.getBet()
        );

        this.addChild(this.hud);

        this.createUI();
    }

    private createBackgroundImage(): void {
        const texture = Assets.get("/assets/Fons/backFon.png");
        const sprite = new Sprite(texture);

        sprite.width = GAME_CONFIG.WIDTH;
        sprite.height = GAME_CONFIG.HEIGHT;

        this.addChild(sprite);
    }

    private createReels(): void {
        this.reelsContainer = new ReelContainer(5);
        this.reelsContainer.position.set(165, 80);

        this.addChild(this.reelsContainer);
    }

    //  Spin logic
    private startSpin(): void {
        if (this.reelsContainer.isAnySpinning()) return;

        if (!this.wallet.canSpin()) {
            this.isAutoSpun = false;
            return;
        }

        if (this.isCheckingWin) return;

        this.wallet.spendBet();

        this.hud.updateBalance(this.wallet.getBalance());
        this.hud.updateBet(this.wallet.getBet());

        this.reelsContainer.spinAll(() => {
            if (this.reelsContainer.isAnySpinning()) return;

            this.isCheckingWin = true;

            this.checkWin();

            this.isCheckingWin = false;

            // Auto spin loop
            if (this.isAutoSpun) {
                setTimeout(() => {
                    this.startSpin();
                }, 500);
            }
        });
    }

    private createUI(): void {
        let interval: ReturnType<typeof setInterval> | null = null;

        const stop = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        //  Spin
        const spinButton = new SpinButton(() => {
            this.startSpin();
        });

        // Auto spin
        const autoSpin = new AutoSpin(() => {
            this.isAutoSpun = !this.isAutoSpun;

            if (this.isAutoSpun) {
                this.startSpin();
            }
        });

        const plusButton = new PlusBet(() => {
            this.wallet.increaseBet();
            this.hud.updateBet(this.wallet.getBet());
        });

        plusButton.on("pointerdown", () => {
            stop();

            interval = setInterval(() => {
                this.wallet.increaseBet();
                this.hud.updateBet(this.wallet.getBet());
            }, 190);
        });

        plusButton.on("pointerup", stop);
        plusButton.on("pointerupoutside", stop);

        const minusButton = new MinusButton(() => {
            this.wallet.decreaseBet();
            this.hud.updateBet(this.wallet.getBet());
        });

        minusButton.on("pointerdown", () => {
            stop();

            interval = setInterval(() => {
                this.wallet.decreaseBet();
                this.hud.updateBet(this.wallet.getBet());
            }, 190);
        });

        minusButton.on("pointerup", stop);
        minusButton.on("pointerupoutside", stop);

        this.addChild(spinButton, autoSpin, plusButton, minusButton);
    }

    private checkWin(): void {
        const reels = this.reelsContainer.getReels();

        const matrix = reels.map((reel) => {
            return reel.getVisibleSymbolsSprites().map(sprite => {
                return (sprite as any).symbolId;
            });
        });

        const result = WinCalculator.calculate(matrix, payLines, this.payTable);

        result.wins.forEach(win => {
            console.log(
                `🎉 Line ${win.lineIndex + 1}`,
                `Symbol: ${win.symbol}`,
                `Count: ${win.count}`,
                `Win: ${win.amount}`
            );
        });

        console.log("💰 TOTAL:", result.totalWin);

        if (result.totalWin > 0) {
            this.wallet.addWin(result.totalWin);

            this.hud.updateBalance(this.wallet.getBalance());
        }
    }
}