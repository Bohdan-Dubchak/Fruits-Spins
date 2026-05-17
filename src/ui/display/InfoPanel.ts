import { Container, Graphics, Text } from "pixi.js";
import { gsap } from "gsap";

export class InfoPanel extends Container {
    private backdrop: Graphics;
    private panel: Container;
    private closeCallback?: () => void;

    constructor(
        bet: number,
        winAmount: number,
        balance: number,
        gameWidth: number,
        gameHeight: number
    ) {
        super();

        // Напівпрозорий фон
        this.backdrop = new Graphics();
        this.backdrop.rect(0, 0, gameWidth, gameHeight);
        this.backdrop.fill({
            color: 0x000000,
            alpha: 0.7
        });

        this.backdrop.eventMode = 'static';

        this.addChild(this.backdrop);

        // Основна панель
        this.panel = new Container();
        this.panel.position.set(gameWidth / 2, gameHeight / 2);
        this.addChild(this.panel);

        // Фон панелі
        const panelBg = new Graphics();
        panelBg.roundRect(-200, -180, 400, 360, 20);
        panelBg.fill({ color: 0x2a2a2a });
        panelBg.stroke({
            color: 0xffd700,
            width: 3
        });

        this.panel.addChild(panelBg);


        const title = new Text({
            text: "ІНФОРМАЦІЯ",
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

        const balanceText = new Text({
            text: `Баланс: ${balance.toFixed(2)} ₴`,
            style: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xffffff,
            }
        });

        balanceText.anchor.set(0.5);
        balanceText.position.set(0, -60);

        this.panel.addChild(balanceText);

        const betText = new Text({
            text: `Ставка: ${bet.toFixed(2)} ₴`,
            style: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xffffff,
            }
        });

        betText.anchor.set(0.5);
        betText.position.set(0, 0);

        this.panel.addChild(betText);

        const winText = new Text({
            text: `Останній виграш: ${winAmount.toFixed(2)} ₴`,
            style: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: winAmount > 0 ? 0x00ff00 : 0xffffff,
            }
        });

        winText.anchor.set(0.5);
        winText.position.set(0, 60);

        this.panel.addChild(winText);


        const closeBtn = this.createCloseButton();
        this.panel.addChild(closeBtn);

        // Початкова анімація
        this.alpha = 0;
        this.panel.scale.set(0.5);
        this.animateIn();
    }

    private createCloseButton(): Container {
        const btn = new Container();
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.position.set(0, 130);

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