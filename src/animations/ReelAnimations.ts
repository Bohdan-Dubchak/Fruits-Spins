import {Assets, BlurFilter, Container, Sprite} from "pixi.js";

export class ReelAnimations {

    private parent: Container;
    private symbolsContainer: Container;
    private symbolSize: number;
    private reelHeight: number;

    private blurFilter!: BlurFilter;
    private topFade!: Sprite;
    private bottomFade!: Sprite;
    private fadeContainer!: Container;

    constructor(parent: Container, symbolsContainer: Container, symbolSize: number, reelHeight: number) {

        this.parent = parent;
        this.symbolsContainer = symbolsContainer;
        this.symbolSize = symbolSize;
        this.reelHeight = reelHeight;

        this.createMotionBlurEffect();
    }

    private createMotionBlurEffect(): void {
        // Blur Filter
        this.blurFilter = new BlurFilter();
        this.blurFilter.strengthX = 0;
        this.blurFilter.strengthY = 10;
        this.blurFilter.quality = 4;
        this.symbolsContainer.filters = [this.blurFilter];

        // Fade Container
        this.fadeContainer = new Container();
        this.parent.addChild(this.fadeContainer);

        // Top Fade (PNG маска)
        this.topFade = new Sprite(Assets.get("fade-top"));
        this.topFade.width = this.symbolSize;
        this.topFade.height = 60;
        this.topFade.y = 0;
        this.topFade.alpha = 0;
        this.fadeContainer.addChild(this.topFade);

        // Bottom Fade (PNG маска)
        this.bottomFade = new Sprite(Assets.get("fade-bottom"));
        this.bottomFade.width = this.symbolSize;
        this.bottomFade.height = 60;
        this.bottomFade.y = this.reelHeight - 60;
        this.bottomFade.alpha = 0;

        this.fadeContainer.addChild(this.bottomFade);
    }

    public update(speed: number, targetSpeed: number): void {
        // Обчислюємо інтенсивність blur на основі швидкості
        const normalizedSpeed =
            targetSpeed > 0 ? Math.min(speed / targetSpeed, 1) : 0;

        // Максимальна швидкість
        if (speed > 20) {
            // Максимальна швидкість
            this.blurFilter.strengthY = 10;
            this.topFade.alpha = 0.3;
            this.bottomFade.alpha = 0.3;

        } else if (speed > 10) {
            // Висока швидкість
            this.blurFilter.strengthY = speed * 1.2;
            this.topFade.alpha = normalizedSpeed * 0.8;
            this.bottomFade.alpha = normalizedSpeed * 0.8;

        } else if (speed > 3) {
            // середня швидкість
            this.blurFilter.strengthY = speed * 0.8;
            this.topFade.alpha = normalizedSpeed * 0.3;
            this.bottomFade.alpha = normalizedSpeed * 0.3;

        } else {
            // Зупинка
            this.blurFilter.strengthY = 0;
            this.topFade.alpha = 0;
            this.bottomFade.alpha = 0;
        }

        this.blurFilter.strengthX = 0;
    }
}