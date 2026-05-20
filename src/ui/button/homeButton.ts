import { Assets, Container, Rectangle, Sprite } from "pixi.js";
import { gsap } from "gsap";

export class HomeBtn extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private bg: Sprite;

    constructor(onClick: () => void) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const texture = Assets.get('homeButton');
        this.bg = new Sprite(texture);

        this.bg.anchor.set(0.5);
        this.bg.position.set(27, 30);

        const scale = 50 / texture.width;
        this.bg.scale.set(scale);
        this.bg.roundPixels = true;

        this.originalScaleX = this.bg.scale.x;
        this.originalScaleY = this.bg.scale.y;

        this.addChild(this.bg);

        this.updateHitArea();

        this.on('pointerdown', () => this.handleDown(onClick));
        this.on('pointerup', () => this.handleUp());
        this.on('pointerout', () => this.handleUp());
    }

    private handleDown(onClick: () => void): void {
        gsap.killTweensOf(this.bg.scale);

        gsap.to(this.bg.scale, {
            x: this.originalScaleX * 0.95,
            y: this.originalScaleY * 0.95,
            duration: 0.08,
            ease: "power2.out"
        });

        onClick();
    }

    private handleUp(): void {
        gsap.killTweensOf(this.bg.scale);

        gsap.to(this.bg.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)"
        });
    }

    private updateHitArea(): void {
        this.hitArea = new Rectangle(
            this.bg.x - this.bg.width / 2,
            this.bg.y - this.bg.height / 2,
            this.bg.width,
            this.bg.height
        );
    }

    public override destroy(options?: any): void {
        gsap.killTweensOf(this.bg.scale);
        this.removeAllListeners();
        super.destroy(options);
    }
}