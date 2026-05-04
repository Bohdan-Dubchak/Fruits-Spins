import {Assets, Container, Sprite} from "pixi.js";
import {ReelContainer} from "../reels/ReelsContainer.ts";
import {SpinButton} from "../ui/spinButton.ts";
import {GAME_CONFIG} from "../config/constants.ts";

export class GameScene extends Container {
    private reelsContainer!: ReelContainer;
    // private uiContainer = new Container();

    constructor() {
        super();

        this.init();
    }

    private async init(): Promise<void> {

        this.createBackgroundImage();

        this.createReels();
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

    private createUI(): void {
        // Spin
        const spinButton = new SpinButton(() => {
            if (this.reelsContainer.isAnySpinning()) return;

            this.reelsContainer.spinAll(() => {
                // callback після завершення spin
                this.checkWin();
            });
        });

        spinButton.position.set(50, 50);
        this.addChild(spinButton);
    }

    // Опис відповідностей
    private payTable:  Record<string, Record<number, number>> = {
        bell:   { 3: 7, 4: 25, 5: 100 },
        cherry: { 3: 5, 4: 20, 5: 40 },
        grapes: { 3: 25, 4: 50, 5: 100 },
        lemon:  { 3: 5, 4: 20, 5: 40 },
        orange: { 3: 5, 4: 25, 5: 50 },
        plum:   { 3: 15, 4: 25, 5: 50 },
        seven:  { 3: 200, 4: 500, 5: 2500 },
    };

    // Виграш
    private checkWin(): void {

        const reels = this.reelsContainer.getReels();
        const matrix = reels.map((reel) => reel.getVisibleSymbolsSprites());

        const payLines = [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2],
        ];

        let totalWin = 0;

        payLines.forEach((line, lineIndex) => {

            const symbols = line.map((row, reelIndex) => {
                const sprite = matrix[reelIndex][row];
                return (sprite as any).symbolId;
            });

            console.log(`Лінія ${lineIndex + 1}:`, symbols);

            const wins = this.checkLine(symbols);

            wins.forEach(win => {

                const winAmount = this.payTable[win.symbol]?.[win.count] || 0;

                totalWin += winAmount;

                console.log(
                    `🎉 Виграш!`,
                    `Символ: ${win.symbol}`,
                    `Довжина: ${win.count}`,
                    `Сума: ${winAmount}`
                );
            });
        });

        console.log("💰 Загальний виграш:", totalWin);
    }

    private checkLine(symbols: string[]): { symbol: string, count: number }[] {

        const results: { symbol: string, count: number }[] = [];

        let current = symbols[0];
        let count = 1;

        for (let i = 1; i < symbols.length; i++) {

            if (symbols[i] === current) {
                count++;
            } else {

                if (count >= 3) {
                    results.push({ symbol: current, count });
                }

                current = symbols[i];
                count = 1;
            }
        }

        // остання група
        if (count >= 3) {
            results.push({ symbol: current, count });
        }

        return results;
    }
}