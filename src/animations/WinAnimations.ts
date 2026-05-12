import {Text, TextStyle, Ticker} from "pixi.js";

export class WinTextAnimation extends Text {
    private animationTicker: Ticker | null = null;
    private hideTimeout: any;

    constructor() {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: '14px',
            fill: 'black',
            fontWeight: 'bold',
            align: "center"
        });

        super({
            text: '',
            style: style,
        });

        this.visible = false;
    }

    show(amount: number): void {
        this.clear();

        this.text = `WIN +${amount}`;
        this.visible = true;
        this.alpha = 0;
        this.scale.set(0.5);

        let step = 0;
        const duration = 15;

        this.animationTicker = new Ticker();
        this.animationTicker.add(() => {
            step++;

            this.alpha = Math.min(1, step / duration);
            const scale = 0.5 + (step / duration) * 0.5;
            this.scale.set(scale);

            if (step >= duration) {
                this.stopAnimation();

                this.hideTimeout = setTimeout(() => {
                    this.visible = false;
                }, 1500);
            }
        });

        this.animationTicker.start();
    }

    // Очищає всі таймери та анімації
    private clear(): void {
        this.stopAnimation();

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
    };

    // Зупиняє поточну анімацію
    private stopAnimation(): void {
        if (this.animationTicker) {
            this.animationTicker.stop();
            this.animationTicker.destroy();
            this.animationTicker = null;
        }
    }

    // Викликається при знищенні об'єкта
    destroy(options?: any): void {
        this.clear();
        super.destroy(options);
    }
}