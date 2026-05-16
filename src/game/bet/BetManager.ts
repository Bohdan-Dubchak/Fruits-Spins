import { WalletManager } from "../wallet/WalletManager.ts";

export class BetManager {
    private interval: ReturnType<typeof setInterval> | null = null;

    private readonly INTERVAL_DELAY: number = 190;

    private wallet: WalletManager;
    private onBetChange: (bet: number) => void;

    constructor(
        wallet: WalletManager,
        onBetChange: (bet: number) => void
    ) {
        this.wallet = wallet;
        this.onBetChange = onBetChange;
    }

    startIncreasing(): void {
        this.stop();

        this.interval = setInterval(() => {
            this.wallet.increaseBet();
            this.onBetChange(this.wallet.getBet());
        }, this.INTERVAL_DELAY);
    }

    startDecreasing(): void {
        this.stop();

        this.interval = setInterval(() => {
            this.wallet.decreaseBet();
            this.onBetChange(this.wallet.getBet());
        }, this.INTERVAL_DELAY);
    }

    increaseBetOnce(): void {
        this.wallet.increaseBet();
        this.onBetChange(this.wallet.getBet());
    }

    decreaseBetOnce(): void {
        this.wallet.decreaseBet();
        this.onBetChange(this.wallet.getBet());
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    destroy(): void {
        this.stop();
    }
}