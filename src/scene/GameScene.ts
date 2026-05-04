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
    private payTable: Record<string, number> = {
        bell: 2,
        cherry: 2,
        grapes: 2,
        lemon: 2,
        orange: 2,
        plum: 2,
        seven: 2,
    };

    // Виграш
    private checkWin(): void {

        const reels = this.reelsContainer.getReels();

        // Матриця спрайтів
        const matrix = reels.map((reel) => reel.getVisibleSymbolsSprites());

        const payLines = [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2],
        ];

        let totalWin = 0;

        payLines.forEach((line, lineIndex) => {

            // Отримуємо symbolType замість Sprite
            const symbols = line.map((row, reelIndex) => {

                const sprite = matrix[reelIndex][row];

                return (sprite as any).symbolId;
            });

            console.log(`Лінія ${lineIndex + 1}:`, symbols);

            // Всі символи однакові?
            const isWin = symbols.every(symbol => symbol === symbols[0]);

            if (isWin) {

                const multiplier = this.payTable[symbols[0]] || 0;

                totalWin += multiplier;

                console.log(
                    `🎉 Виграш на лінії ${lineIndex + 1}!`,
                    `Символ: ${symbols[0]}`,
                    `Виграш: ${multiplier}`
                );
            }
        });

        console.log("Загальний виграш:", totalWin);
    }
}