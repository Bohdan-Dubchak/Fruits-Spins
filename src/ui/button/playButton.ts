import { Assets, Container, Sprite, Rectangle } from "pixi.js";
import {SoundManager} from "../../audio/SoundManager.ts";
import { gsap } from "gsap";

export class PlayButton extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private bg: Sprite;
    private soundManager: SoundManager;

    private handleKeyDownBound: (e: KeyboardEvent) => void;

    constructor(onClick: () => void, soundManager: SoundManager) {
        super();

        this.soundManager = soundManager;

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const texture = Assets.get("play");
        this.bg = new Sprite(texture);

        this.bg.anchor.set(0.5);

        this.originalScaleX = this.bg.scale.x;
        this.originalScaleY = this.bg.scale.y;

        this.addChild(this.bg);

        this.updateHitArea();

        this.on('pointerdown', () => this.handleClick(onClick));

        this.handleKeyDownBound = (e: KeyboardEvent) => {
            if (e.code === 'Enter' && !e.repeat) {
                this.handleClick(onClick);
            }
        };

        window.addEventListener('keydown', this.handleKeyDownBound);
    }

    private handleClick(onClick: () => void): void {
        this.soundManager.play('button');
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
        window.removeEventListener('keydown', this.handleKeyDownBound);
        this.removeAllListeners();
        super.destroy();
    }
}