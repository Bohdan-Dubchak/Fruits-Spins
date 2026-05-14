import {Assets, Container, Rectangle, Sprite} from "pixi.js";
import {gsap} from "gsap";

export class PlusBet extends Container {
    private readonly originalScaleX: number;
    private readonly originalScaleY: number;

    constructor(onClick: () => void ) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const texture = Assets.get('plus');
        const bg = new Sprite(texture);

        {
            bg.anchor.set(0.5);
            bg.position.set(655, 540);
            bg.width = 44;
            bg.height = 47;

            this.originalScaleX = bg.scale.x;
            this.originalScaleY = bg.scale.y;

            this.addChild(bg);
        }

        {
            this.hitArea = new Rectangle(
                bg.x - bg.width / 2,
                bg.y - bg.height / 2,
                bg.width,
                bg.height
            );
        }

            this.on('pointerdown', () => {
                gsap.killTweensOf(bg.scale);
                gsap.to(bg.scale, {
                    x: this.originalScaleX * 0.95,
                    y: this.originalScaleY * 0.95,
                    duration: 0.08,
                    ease: "power2.out"
                });
                onClick();
            })

            this.on('pointerup', () => {
                gsap.killTweensOf(bg.scale);
                gsap.to(bg.scale, {
                    x: this.originalScaleX,
                    y: this.originalScaleY,
                    duration: 0.2,
                    ease: "back.out(4)"
                });
            });

            this.on('pointerout', () => {
                gsap.killTweensOf(bg.scale);
                gsap.to(bg.scale, {
                    x: this.originalScaleX,
                    y: this.originalScaleY,
                    duration: 0.2
                });
            });
        }
}