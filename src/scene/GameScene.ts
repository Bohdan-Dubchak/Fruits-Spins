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
import {WalletManager} from "../game/engine/WalletManager.ts";

export class GameScene extends Container {
    private reelsContainer!: ReelContainer;

    private payTable: Record<string, Record<number, number>> = payTable;

    private hud!: HUD;

    constructor() {
        super();

        this.init();
    }

    private async init(): Promise<void> {
        this.createBackgroundImage();

        this.createReels();

        // HUD створюємо ДО createUI
        this.hud = new HUD(this.wallet.getBalance(), this.wallet.getBet());
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

        this.reelsContainer.position.set(140, 80);

        this.addChild(this.reelsContainer);
    }

    private wallet = new WalletManager();

    private createUI(): void {
        let interval: ReturnType<typeof setInterval> | null = null;

        const stop = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        // Spin
        const spinButton = new SpinButton(() => {
            if (this.reelsContainer.isAnySpinning()) return;

            if (!this.wallet.canSpin()) return;

            this.wallet.spendBet();

            this.hud.updateBalance(
                this.wallet.getBalance()
            );

            this.hud.updateBalance( this.wallet.getBalance());
            this.hud.updateBet( this.wallet.getBet());

            this.reelsContainer.spinAll(() => {
                this.checkWin();
            });
        });

        // AutoSpin
        const autoSpin = new AutoSpin(() => {

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

        // Додаємо виграш до балансу
        if (result.totalWin > 0) {

            this.wallet.addWin(result.totalWin);
        }
    }
}