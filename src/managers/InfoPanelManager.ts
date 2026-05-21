import {Container} from "pixi.js";
import {InfoPanel} from "../ui/display/InfoPanel.ts";
import {WalletManager} from "../game/wallet/WalletManager.ts";

export class InfoPanelManager {
    private currentPanel: InfoPanel | null = null;
    private lastWinAmount: number = 0;
    private readonly wallet: WalletManager;
    private readonly container: Container;
    private readonly gameWidth: number;
    private readonly gameHeight: number;

    constructor(wallet: WalletManager, container: Container, gameWidth: number, gameHeight: number) {
        this.wallet = wallet;
        this.container = container;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    public show(): void {
        if (this.currentPanel) return;

        const currentBet = this.wallet.getBet();
        const currentBalance = this.wallet.getBalance();

        this.currentPanel = new InfoPanel(
            currentBet,
            this.lastWinAmount,
            currentBalance,
            this.gameWidth,
            this.gameHeight
        );

        this.currentPanel.onClose(() => {
            this.currentPanel = null;
        });

        this.container.addChild(this.currentPanel);
    }

    public updateLastWin(amount: number): void {
        this.lastWinAmount = amount;
    }

    public destroy(): void {
        this.currentPanel?.destroy();
        this.currentPanel = null;
    }
}