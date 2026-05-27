import {Assets, Container, Graphics, Text, type Texture, Sprite} from "pixi.js";
import {ScreenManager} from "../../managers/ScreenManager.ts";
import {LanguageManager} from "../../managers/LanguageManager.ts";
import {gsap} from "gsap";
import type {Language} from "../../managers/translations.ts";
import {SoundManager} from "../../audio/SoundManager.ts";

export class SettingPanel extends Container {
    private backdrop: Graphics;
    private panel: Container;
    private flagIcon!: Sprite;
    private closeCallback?: () => void;

    // Текстові елементи які потрібно оновлювати
    private titleText!: Text;
    private languageText!: Text;
    private windowText!: Text;
    private musicText!: Text;
    private closeButtonText!: Text;
    private soundManager: SoundManager;

    private languageChangeCallback: (language: Language) => void;

    constructor(gameWidth: number, gameHeight: number, soundManager: SoundManager) {
        super();

        this.backdrop = new Graphics();
        this.backdrop.rect(0, 0, gameWidth, gameHeight);
        this.backdrop.fill({
            color: 0x000000,
            alpha: 0.7
        });

        this.soundManager = soundManager

        this.backdrop.eventMode = 'static';

        this.addChild(this.backdrop);

        this.panel = new Container();
        this.panel.position.set(gameWidth / 2, gameHeight / 2);

        // Зупиняємо propagation кліків з панелі
        this.panel.eventMode = 'static';
        this.panel.on('pointerdown', (e) => e.stopPropagation());

        this.addChild(this.panel);

        const panelBg = new Graphics();
        panelBg.roundRect(-300, -180, 600, 400, 20);
        panelBg.fill({ color: 0x2a2a2a });
        panelBg.stroke({
            color: 0xffd700,
            width: 3
        });

        this.panel.addChild(panelBg);

        // Заголовок з перекладом
        this.titleText = new Text({
            text: LanguageManager.t('settings'),
            style: {
                fontFamily: "Viga",
                fontSize: 32,
                fill: 0xffd700,
                fontWeight: "bold",
            }
        });

        this.titleText.anchor.set(0.5);
        this.titleText.position.set(0, -130);

        this.panel.addChild(this.titleText);

        // Текст "Мова" з перекладом
        this.languageText = new Text({
            text: LanguageManager.t('language'),
            style: {
                fontFamily: "Viga",
                fontSize: 25,
                fill: 0xffd700,
                fontWeight: "bold",
            }
        })

        this.languageText.anchor.set(0.5);
        this.languageText.position.set(-230,-53);

        const countryFlag = this.createFlagButton(
            Assets.get(LanguageManager.getCurrentFlag()),
            () => {
                const nextFlag = LanguageManager.switchLanguage();
                this.flagIcon.texture = Assets.get(nextFlag);
            }
        );

        this.panel.addChild(this.languageText, countryFlag);

        // Текст "Екран" з перекладом
        this.windowText = new Text({
            text: LanguageManager.t('screen'),
            style: {
                fontFamily: "Viga",
                fontSize: 25,
                fill: 0xffd700,
                fontWeight: "bold",
            }
        })

        this.windowText.anchor.set(0.5);
        this.windowText.position.set(-227, 9);

        const fullscreenBtn = this.createOptionButton(Assets.get('monitor'), () => {
            ScreenManager.toggleFullscreen();
        });

        this.panel.addChild(this.windowText, fullscreenBtn);

        this.musicText = new Text({
            text: LanguageManager.t('sound'),
            style: {
                fontFamily: "Viga",
                fontSize: 25,
                fill: 0xffd700,
                fontWeight: "bold",
            }
        });

        this.musicText.anchor.set(0.5);
        this.musicText.position.set(-225, 71);

        this.panel.addChild(this.musicText);

        const closeBtn = this.createCloseButton();
        this.panel.addChild(closeBtn);

        // Підписуємося на зміни мови
        this.languageChangeCallback = () => this.updateTexts();
        LanguageManager.addListener(this.languageChangeCallback);

        // Початкова анімація
        this.alpha = 0;
        this.panel.scale.set(0.5);
        this.animateIn();
    }

     // Оновити всі тексти при зміні мови
    private updateTexts(): void {
        this.titleText.text = LanguageManager.t('settings');
        this.languageText.text = LanguageManager.t('language');
        this.windowText.text = LanguageManager.t('screen');
        this.musicText.text = LanguageManager.t('sound');
        this.closeButtonText.text = LanguageManager.t('close');
    }

    private createFlagButton(texture: Texture, callback: () => void): Container {

        const btn = new Container();

        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        this.flagIcon = new Sprite(texture);

        this.flagIcon.anchor.set(0.5);
        this.flagIcon.position.set(0, -54);
        this.flagIcon.setSize(40, 40);

        btn.addChild(this.flagIcon);

        btn.on('pointertap', () => {
            this.soundManager.play('button');
            callback();
        });

        return btn;
    }

    private createOptionButton(label: Texture, callback: () => void): Container {

        const btn = new Container();

        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        const bg = new Graphics();
        bg.roundRect(-30, -10, 60, 40, 10);
        bg.fill({ color: 0x444444 });

        btn.addChild(bg);

        const icon = new Sprite(label);

        icon.anchor.set(0.5);
        icon.position.set(0, 11);
        icon.setSize(40, 40);

        btn.addChild(icon);


        btn.on('pointertap', () => {
            this.soundManager.play('button');
                callback();
        });
        btn.on('pointerover', () => {
            bg.tint = 0x666666;
        });

        btn.on('pointerout', () => {
            bg.tint = 0xffffff;
        });

        return btn;
    }

    private createCloseButton(): Container {
        const btn = new Container();
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.position.set(0, 180);

        const bg = new Graphics();
        bg.roundRect(-60, -20, 120, 40, 10);
        bg.fill({ color: 0xff4444 });
        btn.addChild(bg);

        // Зберігаємо посилання на текст кнопки
        this.closeButtonText = new Text({
            text: LanguageManager.t('close'),
            style: {
                fontFamily: "Viga",
                fontSize: 20,
                fill: 0xffffff,
                fontWeight: "bold",
            }
        });
        this.closeButtonText.anchor.set(0.5);
        btn.addChild(this.closeButtonText);

        btn.on('pointerdown', () => {
            this.soundManager.play('closed')
            gsap.to(btn.scale, {
                x: 0.95,
                y: 0.95,
                duration: 0.1
            });
        });

        btn.on('pointerup', () => {
            gsap.to(btn.scale, {
                x: 1,
                y: 1,
                duration: 0.1,
                onComplete: () => this.close()
            });
        });

        btn.on('pointerupoutside', () => {
            gsap.to(btn.scale, {
                x: 1,
                y: 1,
                duration: 0.1
            });
        });

        return btn;
    }

    private animateIn(): void {
        gsap.to(this, {
            alpha: 1,
            duration: 0.3,
            ease: "power2.out"
        });

        gsap.to(this.panel.scale, {
            x: 1,
            y: 1,
            duration: 0.4,
            ease: "back.out(2)"
        });
    }

    public close(): void {
        // Вимикаємо інтерактивність під час закриття
        this.backdrop.eventMode = 'none';
        this.panel.eventMode = 'none';

        gsap.to(this, {
            alpha: 0,
            duration: 0.2,
            ease: "power2.in"
        });

        gsap.to(this.panel.scale, {
            x: 0.5,
            y: 0.5,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                this.closeCallback?.();
                this.destroy();
            }
        });
    }

    public onClose(callback: () => void): void {
        this.closeCallback = callback;
    }

    public destroy(): void {
        // Відписуємося від змін мови перед знищенням
        LanguageManager.removeListener(this.languageChangeCallback);
        super.destroy();
    }
}