import {Assets, Container, Rectangle, Sprite, Texture} from "pixi.js";
import {gsap} from "gsap";

export class SoundButton extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private bg: Sprite;

    private isMuted = false;

    private soundOnTexture: Texture;
    private soundOffTexture: Texture;

    constructor(onClick: (muted: boolean) => void) {
        super();

        this.eventMode = "static";
        this.cursor = "pointer";

        this.soundOnTexture = Assets.get("onSoundButton");
        this.soundOffTexture = Assets.get("offSoundButton");

        this.bg = new Sprite(this.soundOnTexture);

        this.bg.anchor.set(0.5);
        this.bg.position.set(1032, 32);

        const scale = 60 / this.soundOnTexture.width;
        this.bg.scale.set(scale);

        this.originalScaleX = this.bg.scale.x;
        this.originalScaleY = this.bg.scale.y;

        this.updateHitArea();

        this.addChild(this.bg);

        this.on("pointerdown", () => this.handleDown(onClick));
        this.on("pointerup", () => this.handleUp());
    }

    private handleDown(onClick: (muted: boolean) => void): void {
        gsap.killTweensOf(this.bg.scale);

        gsap.to(this.bg.scale, {
            x: this.originalScaleX * 0.95,
            y: this.originalScaleY * 0.95,
            duration: 0.08,
            ease: "power2.out",
        });

        this.isMuted = !this.isMuted;

        this.bg.texture = this.isMuted ? this.soundOffTexture : this.soundOnTexture;

        onClick(this.isMuted);
    }

    private handleUp(): void {
        gsap.killTweensOf(this.bg.scale);

        gsap.to(this.bg.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)",
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

    public destroy(): void {
        gsap.killTweensOf(this.bg.scale);
        this.removeAllListeners();
        super.destroy();
    }
}