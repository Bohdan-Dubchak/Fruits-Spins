import {Container} from "pixi.js";
import {Reel} from "./Reels.ts";

export class ReelContainer extends Container {
    private reels: Reel[] = [];
    private REEL_GAP: number = 150;

    private reelCount: number;

    constructor(reelCount: number) {
        super();
        this.reelCount = reelCount;

        this.createReel()
    }

    private createReel(): void {
        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel();

            reel.init();

            reel.x = i * this.REEL_GAP;
            reel.y = 50;
            this.reels.push(reel);

            this.addChild(reel);

        }
    }
}