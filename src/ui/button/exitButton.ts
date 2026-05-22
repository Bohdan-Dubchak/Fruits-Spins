import {Assets, Container, Rectangle, Sprite, Text, TextStyle} from "pixi.js";
import {gsap} from "gsap";

export class ExitBtn extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private buttonText: Text;
    private buttonContainer: Container;
    private bg: Sprite;

    constructor() {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.buttonContainer = new Container();

        const texture = Assets.get('exiBtn');
        this.bg = new Sprite(texture);

        this.bg.anchor.set(0.5);
        this.bg.setSize(270, 80);

        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 25,
            fill: '#f8c035',
            fontWeight: 'bold',
        });

        this.buttonText = new Text({
            text: 'Вихід',
            style: textStyle,
        })

        this.buttonText.anchor.set(0.5);
        this.buttonText.position.set(0, 0)

        this.buttonContainer.addChild(this.bg);
        this.buttonContainer.addChild(this.buttonText);

        this.originalScaleY = this.buttonContainer.scale.y;
        this.originalScaleX = this.buttonContainer.scale.x;

        this.addChild(this.buttonContainer);

        this.updateHitArea();

        this.on('pointerdown', () => this.handleDown());
        this.on('pointerup', () => this.handleUp());
        this.on('pointerupoutside', () => this.handleUpOutside());
    }

    private handleDown(): void {
        gsap.killTweensOf(this.buttonContainer.scale);

        gsap.to(this.buttonContainer.scale, {
            x: this.originalScaleX * 0.95,
            y: this.originalScaleY * 0.95,
            duration: 0.08,
            ease: "power2.out"
        });
    }

    private handleUp(): void {
        gsap.killTweensOf(this.buttonContainer.scale);

        gsap.to(this.buttonContainer.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)",
        });
    }

    private handleUpOutside(): void {
        gsap.killTweensOf(this.buttonContainer.scale);

        gsap.to(this.buttonContainer.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)",
        });
    }

    private updateHitArea(): void {
        this.hitArea = new Rectangle(
            -this.bg.width / 2,
            -this.bg.height / 2,
            this.bg.width,
            this.bg.height
        );
    }

    public destroy(): void {
        gsap.killTweensOf(this.buttonContainer.scale);
        this.removeAllListeners();
        super.destroy();
    }
}