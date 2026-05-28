import {Assets, Container, Rectangle, Sprite, TextStyle, Text} from "pixi.js";
import {gsap} from "gsap";
import {LanguageManager} from "../../managers/LanguageManager.ts";
import type {Language} from "../../managers/translations.ts";
import {SoundManager} from "../../audio/SoundManager.ts";

export class SettingsBtn extends Container {
    private readonly originalScaleX: number;
    private readonly originalScaleY: number;
    private bg: Sprite;
    private buttonText: Text;
    private buttonContainer: Container;
    private isAnimating: boolean = false;
    private readonly onClick: () => void;
    private soundManager: SoundManager;

    private languageChangeCallback: (language: Language) => void;

    constructor(onClick: () => void, soundManager: SoundManager) {
        super();

        this.soundManager = soundManager;

        this.onClick = onClick;
        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.buttonContainer = new Container();

        const texture = Assets.get('settingsBtn');
        this.bg = new Sprite(texture);

        this.bg.anchor.set(0.5);
        this.bg.setSize(270, 87);

        const textStyle = new TextStyle({
            fontFamily: 'Viga',
            fontSize: 25,
            fontWeight: 'bold',
            fill: '#f8c035',
        });

        this.buttonText = new Text({
            text: LanguageManager.t('settings'),
            style: textStyle
        })

        this.buttonText.anchor.set(0.5);
        this.buttonText.position.set(0, -3)

        this.buttonContainer.addChild(this.bg);
        this.buttonContainer.addChild(this.buttonText);

        this.originalScaleY = this.buttonContainer.scale.y;
        this.originalScaleX = this.buttonContainer.scale.x;

        this.addChild(this.buttonContainer);

        this.updateHitArea();

        this.on('pointerdown', () => this.handleDown());
        this.on('pointerup', () => this.handleUp());
        this.on('pointerupoutside', () => this.handleUpOutside());

        this.languageChangeCallback = () => this.updateText();
        LanguageManager.addListener(this.languageChangeCallback);
    }

    private updateText(): void {
        this.buttonText.text = LanguageManager.t('settings');
    }

    private handleDown(): void {
        this.soundManager.play('button');
        if (this.isAnimating) return;

        gsap.killTweensOf(this.buttonContainer.scale);

        gsap.to(this.buttonContainer.scale, {
            x: this.originalScaleX * 0.95,
            y: this.originalScaleY * 0.95,
            duration: 0.08,
            ease: "power2.out"
        });
    }

    private handleUp(): void {
        if (this.isAnimating) return;

        this.isAnimating = true;
        gsap.killTweensOf(this.buttonContainer.scale);

        gsap.to(this.buttonContainer.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)",
            onComplete: () => {
                this.isAnimating = false;
                this.onClick();
            }
        });
    }

    private handleUpOutside(): void {
        gsap.killTweensOf(this.buttonContainer.scale);

        gsap.to(this.buttonContainer.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)",
            onComplete: () => {
                this.isAnimating = false;
            }
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
        LanguageManager.removeListener(this.languageChangeCallback);
        super.destroy();
    }
}