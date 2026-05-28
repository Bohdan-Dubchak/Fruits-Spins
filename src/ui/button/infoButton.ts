import {Assets, Container, Rectangle, Sprite} from "pixi.js"
import type {SoundManager} from "../../audio/SoundManager.ts";
import {gsap} from "gsap";

export class InfoBtn extends Container {

    private originalScaleX: number;
    private originalScaleY: number;
    private bg: Sprite;
    private soundManager: SoundManager;

    constructor(onClick: () => void, soundManager: SoundManager) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.soundManager = soundManager;

        const texture = Assets.get("info");
        this.bg = new Sprite(texture);

        this.bg.anchor.set(0.5);
        this.bg.position.set(96, 288);

        const scale = 50 / texture.width;
        this.bg.scale.set(scale);

        this.originalScaleX = this.bg.scale.x;
        this.originalScaleY = this.bg.scale.y;

        this.addChild(this.bg);

        this.updateHitArea();

        this.on('pointerdown', () => this.handleDown(onClick));
        this.on('pointerup', () => this.handleUp());
        this.on('pointerout', () => this.handleUp());
    }

    private handleDown(onClick: () => void): void {
        this.soundManager.play('button');
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
        })
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