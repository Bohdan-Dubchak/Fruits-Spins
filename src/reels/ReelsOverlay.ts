import {Container, Graphics, BlurFilter} from "pixi.js";

interface ReelsOverlayConfig {
    width: number;
    height: number;
    topShadowHeight?: number;
    bottomShadowHeight?: number;
    color?: number;
    alpha?: number;
    blurStrength?: number;
}

export class ReelsOverlay extends Container {

    private readonly DEFAULT_CONFIG = {
        topShadowHeight: 30,
        bottomShadowHeight: 30,
        color: 0x3d2817,
        alpha: 0.5,
        blurStrength: 12
    }

    constructor(config: ReelsOverlayConfig) {
        super();

        const finalConfig = {...this.DEFAULT_CONFIG, ...config};
        this.createGradient(finalConfig);
    }

    private createGradient(config: Required<ReelsOverlayConfig>): void {
        const gradient = new Graphics();

        gradient.rect(0, 0, config.width, config.topShadowHeight);
        gradient.fill({
            color: config.color,
            alpha: config.alpha });

        gradient.rect(
            0,
            config.height - config.bottomShadowHeight,
            config.width,
            config.bottomShadowHeight
        );

        gradient.fill({
            color: config.color,
            alpha: config.alpha });

        gradient.filters = [new BlurFilter({
            strength: config.blurStrength })];

        this.addChild(gradient);
    }
}