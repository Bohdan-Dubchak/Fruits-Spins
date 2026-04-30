import {Container} from "pixi.js";
import {ReelContainer} from "../reels/ReelsContainer.ts";
import {SpinButton} from "../ui/spinButton.ts";

export class GameScene extends Container {
    private reelsContainer!: ReelContainer;
    // private uiContainer = new Container();

    constructor() {
        super();

        this.init();
    }

    private async init(): Promise<void> {

        this.createReels();
        this.createUI();
    }

    private createReels(): void {
        this.reelsContainer = new ReelContainer(5);
        this.reelsContainer.position.set(150, 50);

        this.addChild(this.reelsContainer);
    }

    private createUI(): void {
        const spinButton = new SpinButton(() => {
            if (this.reelsContainer.isAnySpinning()) return;

            this.reelsContainer.spinAll(() => {
                // callback після завершення spin
            });
        });

        spinButton.position.set(50, 50);
        this.addChild(spinButton);
    }
}