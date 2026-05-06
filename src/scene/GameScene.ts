import {Assets, Container, Sprite} from "pixi.js";
import {ReelContainer} from "../reels/ReelsContainer.ts";
import {SpinButton} from "../ui/spinButton.ts";
import {GAME_CONFIG} from "../config/constants.ts";
import {payLines, payTable} from "../config/paylines.ts";
import {WinCalculator} from "../game/engine/WinCalculator.ts";
import {AutoSpin} from "../ui/autoSpinBtn.ts";
import {HUD} from '../ui/HUD.ts';

export class GameScene extends Container {
    private reelsContainer!: ReelContainer;
    private payTable:  Record<string, Record<number, number>> = payTable;
    // private uiContainer = new Container();

    private balance: number = 1000;
    private bet: number = 500;

    private hud!: HUD;

    constructor() {
        super();

        this.init();
    }

    private async init(): Promise<void> {

        this.createBackgroundImage();

        this.createReels();
        this.createUI();

        this.hud = new HUD(this.balance, this.bet);

        this.addChild(this.hud);
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

    private createUI(): void {
        // Spin
        const spinButton = new SpinButton(() => {
            if (this.reelsContainer.isAnySpinning()) return;
            if (this.balance < this.bet) return;

            this.balance -= this.bet;

            this.hud.updateBalance(this.balance);

            this.reelsContainer.spinAll(() => {
                this.checkWin();
            });
        });

        // AutoSpin
        const autoSpin = new AutoSpin(() => {

        })

        // this.addChild(autoSpin);
        this.addChild(spinButton, autoSpin);
    }

    // Виграш
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
    }

}