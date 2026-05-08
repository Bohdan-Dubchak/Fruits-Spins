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

    public isAnySpinning(): boolean {
        return this.reels.some(reel => reel.getIsSpinning());
    }

    public async spinAll(callback: () => void): Promise<void> {
        // Запускаємо всі барабани
        this.reels.forEach(reel => reel.spin());

        // Зупиняємо по черзі з затримкою
        for (let i = 0; i < this.reels.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1500 + i));
            this.reels[i].stop();
        }

        // Чекаємо поки всі точно зупиняться
        await this.waitForAllReelsToStop();

        // Викликаємо callback
        callback();
    }

    // Чекає поки всі барабани зупиняться
    private async waitForAllReelsToStop(): Promise<void> {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (!this.isAnySpinning()) {
                    clearInterval(checkInterval);
                    // Додаткова затримка для стабільності
                    setTimeout(() => resolve(), 100);
                }
            }, 50); // Перевіряємо кожні 50ms
        });
    }

    public getReels(): Reel[] {
        return this.reels;
    }
}