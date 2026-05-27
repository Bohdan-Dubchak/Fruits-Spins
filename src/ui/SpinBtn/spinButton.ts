import {Container, Assets, Sprite, Rectangle} from "pixi.js";
import {SoundManager} from "../../audio/SoundManager.ts";
import { gsap } from "gsap";

export class SpinButton extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private bg: Sprite;
    private soundManager: SoundManager;

    constructor(onClick: () => void, soundManager: SoundManager) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.soundManager = soundManager;

        const texture = Assets.get('spinButton');
        this.bg = new Sprite(texture);

        this.bg.anchor.set(0.5);
        this.bg.setSize(230, 80);
        this.bg.position.set(883, 541);

        this.originalScaleX = this.bg.scale.x;
        this.originalScaleY = this.bg.scale.y;

        this.addChild(this.bg);

        this.updateHitArea();

        this.on('pointerdown', () => this.handleDown(onClick));
        this.on('pointerup', () => this.handleUp());
        this.on('pointerout', () => this.handleUp());

        window.addEventListener('keydown', (e) => {
            if((e.code === 'Space') && !e.repeat) {
                this.handleDown(onClick);
            }
        })
    }

    private handleDown(onClick: () => void): void {
        this.soundManager.play('spin')
        gsap.killTweensOf(this.bg.scale);

        const tl = gsap.timeline();

        tl.to(this.bg.scale, {
            x: this.originalScaleX * 0.95,
            y: this.originalScaleY * 0.95,
            duration: 0.08,
            ease: "power2.out"
        });

        tl.to(this.bg.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.12,
            ease: "back.out(4)"
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
            this.width,
            this.height,
        )
    }

    public setDisabled(value: boolean): void {
        this.eventMode = value ? 'none' : 'static';
        this.bg.alpha = value ? 0.5 : 1;
    }
}