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

    // Створення барабана
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

    public isAnySpinning(): boolean {
        return this.reels.some(reel => reel.getIsSpinning());
    }

    // Запуск всіх барабанів
    public spinAll(callback: () => void) {
        let stoppedCount = 0;

        this.reels.forEach((reel, index) => {
            reel.spin();

            setTimeout(() => {
                reel.stop();
                stoppedCount++;

                if (stoppedCount === this.reels.length) {
                    setTimeout(() => {
                        callback();
                    }, 300);
                }
            }, 1500 + index * 500);
        });
    }

    // Повертає масив усіх барабанів
    public getReels(): Reel[] {
    return this.reels;
    }
}