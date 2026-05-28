import {Container, type Sprite} from "pixi.js";
import {Reel} from "./Reels.ts";
import {RNG} from "../game/engine/RNG.ts";

export class ReelContainer extends Container {
    private reels: Reel[] = [];
    private REEL_GAP: number = 150;
    private reelCount: number;
    private rng: RNG;

    constructor(reelCount: number, rng: RNG) {
        super();
        this.reelCount = reelCount;
        this.rng = rng;
        this.createReel()
    }

    private createReel(): void {
        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel(this.rng);
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

        this.reels.forEach(reel => reel.spin());

        for (let i = 0; i < this.reels.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1500 + i * 300));
            this.reels[i].stop();

        }

        await this.waitForAllReelsToStop();

        callback();
    }

    private async waitForAllReelsToStop(): Promise<void> {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (!this.isAnySpinning()) {
                    clearInterval(checkInterval);
                    setTimeout(() => resolve(), 100);
                }
            }, 50); // Перевіряємо кожні 50ms
        });
    }

    public setOnReelStop(callback: () => void): void {
        this.reels.forEach(reel => reel.setOnStop(callback));
    }

    public getReels(): Reel[] {
        return this.reels;
    }

    public setSpinResult(matrix: string[][]): void {
        this.reels.forEach((reel, index) => {
            reel.setResult(matrix[index]);
        });
    }

    public getSymbolMatrix(): string[][] {
        return this.reels.map((reel) => {
            return reel.getVisibleSymbolsSprites().map(sprite => {
                return sprite.symbolId;
            });
        });
    }

    public getSymbolSprite(reelIndex: number, row: number): Sprite | null {
        if (reelIndex < 0 || reelIndex >= this.reels.length) return null;

        const visibleSprites = this.reels[reelIndex].getVisibleSymbolsSprites();
        return visibleSprites[row] || null;
    }

    public destroy(): void {
        this.reels.forEach(r => r.destroy());
        super.destroy();
    }
}