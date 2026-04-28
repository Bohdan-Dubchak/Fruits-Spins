import {Container} from "pixi.js";
import {ReelContainer} from "../reels/ReelsContainer.ts";

export class GameScene extends Container {
    private reelsContainer = new Container();
    // private uiContainer = new Container();

    constructor() {
        super();

        this.init();
    }

    private async init(): Promise<void> {

        this.createReels();
    }

    private createReels(): void {
        this.reelsContainer = new ReelContainer(3);
        this.reelsContainer.position.set(200, 50);

        this.addChild(this.reelsContainer);
    }
}