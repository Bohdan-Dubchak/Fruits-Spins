import {Assets, Container, Sprite, Text, TextStyle} from "pixi.js";
import {ReelContainer} from "../reels/ReelsContainer.ts";
import {SpinButton} from "../ui/spinButton.ts";
import {GAME_CONFIG} from "../config/constants.ts";
import {payLines, payTable} from "../config/paylines.ts";
import {WinCalculator} from "../game/engine/WinCalculator.ts";
import {AutoSpin} from "../ui/autoSpinBtn.ts";
import {gsap} from "gsap";

export class GameScene extends Container {
    private reelsContainer!: ReelContainer;
    private payTable:  Record<string, Record<number, number>> = payTable;
    // private uiContainer = new Container();

    private balance: number = 1000;
    private bet: number = 500;

    private balanceLabel!: Text;
    private balanceValue!: Text;

    private betLabel!: Text;
    private betValue!: Text;

    constructor() {
        super();

        this.init();
    }

    private async init(): Promise<void> {

        this.createBackgroundImage();

        this.createReels();
        this.createUI();
        this.createHUD();
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


            this.balance -= this.bet
            this.updateHUD();

            this.reelsContainer.spinAll(() => {
                // callback після завершення spin
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

    private createHUD(): void {
        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 40,
            fill: '#ffffff',
            fontWeight: "bold",
        })

        this.balanceLabel = new Text({
            text: '',
            style: style
        });
        this.balanceValue = new Text({
            text: ` ${this.balance}`,
            style: style
        });

        this.balanceLabel.anchor.set(0.5);
        this.balanceValue.anchor.set(0.5);

        this.balanceLabel.position.set(158, 551);
        this.balanceValue.position.set(158, 551);

        this.betLabel = new Text({
            text: '',
            style: style
        });

        this.betValue = new Text({
            text: ` ${this.bet}`,
            style: style
        });

        this.betLabel.anchor.set(0.5);
        this.betValue.anchor.set(0.5);

        this.betLabel.position.set(128, 493);
        this.betValue.position.set(500, 538);

        this.addChild(this.balanceLabel, this.balanceValue, this.betLabel, this.betValue);
    }

    private updateHUD(): void {
        const obj = {value: Number(this.balanceValue.text)};

        gsap.to(obj, {
            value: this.balance,
            duration: 0.4,
            onUpdate: () => {
                this.balanceValue.text = Math.floor(obj.value).toString();
            }
        });

        this.betValue.text = `${this.bet}`;
    }
}