import {Assets, Container, Graphics, Text, type Texture, Sprite} from "pixi.js";
import {ScreenManager} from "../../managers/ScreenManager.ts";
import {LanguageManager} from "../../managers/LanguageManager.ts";
import {gsap} from "gsap";

export class SettingPanel extends Container {
    private backdrop: Graphics;
    private panel: Container;
    private flagIcon!: Sprite;
    private closeCallback?: () => void;

    constructor(gameWidth: number, gameHeight: number) {
        super();

        this.backdrop = new Graphics();
        this.backdrop.rect(0, 0, gameWidth, gameHeight);
        this.backdrop.fill({
            color: 0x000000,
            alpha: 0.7
        });

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

        const title = new Text({
            text: "НАЛАШТУВАННЯ",
            style: {
                fontFamily: "Arial",
                fontSize: 32,
                fill: 0xffd700,
                fontWeight: "bold",
            }
        });

        title.anchor.set(0.5);
        title.position.set(0, -130);

        this.panel.addChild(title);

        const languageText = new Text({
            text: "Мова",
            style: {
                fontFamily: "Arial",
                fontSize: 25,
                fill: 0xffd700,
                fontWeight: "bold",
            }
        })

        languageText.anchor.set(0.5);
        languageText.position.set(-230,-53);

        const countryFlag = this.createFlagButton(
            Assets.get(LanguageManager.getCurrentFlag()),
            () => {
                const nextFlag = LanguageManager.switchLanguage();
                this.flagIcon.texture = Assets.get(nextFlag);
            }
        );

        this.panel.addChild(languageText, countryFlag);


        const windowText = new Text({
            text: 'Екран',
            style: {
                fontFamily: "Arial",
                fontSize: 25,
                fill: 0xffd700,
                fontWeight: "bold",
            }
        })

        windowText.anchor.set(0.5);
        windowText.position.set(-227, 9);

        const fullscreenBtn = this.createOptionButton(Assets.get('monitor'), () => {
            ScreenManager.toggleFullscreen();
        });

        this.panel.addChild(windowText, fullscreenBtn);


        const soundText = new Text({
            text: 'Звук',
            style: {
                fontFamily: "Arial",
                fontSize: 25,
                fill: 0xffd700,
                fontWeight: "bold",
            }
        });

        soundText.anchor.set(0.5);
        soundText.position.set(-234, 71);

        this.panel.addChild(soundText);

        const closeBtn = this.createCloseButton();
        this.panel.addChild(closeBtn);

        // Початкова анімація
        this.alpha = 0;
        this.panel.scale.set(0.5);
        this.animateIn();
    }

    private createFlagButton(
        texture: Texture,
        callback: () => void
    ): Container {

        const btn = new Container();

        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        this.flagIcon = new Sprite(texture);

        this.flagIcon.anchor.set(0.5);
        this.flagIcon.position.set(0, -54);
        this.flagIcon.setSize(40, 40);

        btn.addChild(this.flagIcon);

        btn.on('pointertap', callback);

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


        btn.on('pointertap', callback);
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

        const text = new Text({
            text: "ЗАКРИТИ",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: 0xffffff,
                fontWeight: "bold",
            }
        });
        text.anchor.set(0.5);
        btn.addChild(text);

        btn.on('pointerdown', () => {
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
}