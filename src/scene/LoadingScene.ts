import {Assets, Container, Graphics, Sprite, Text} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";

export class LoadingScene extends Container {
    private progressBar: Graphics;
    private progressText: Text;
    private readonly barWidth: number = 400;

    constructor() {
        super();

        const texture = Assets.get('loading');
        const bg = new Sprite(texture);

        bg.anchor.set(0.5);
        bg.setSize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        bg.position.set(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2);

        const barBg = new Graphics();
        barBg.roundRect(
            GAME_CONFIG.WIDTH / 2 - this.barWidth / 2,
            570, this.barWidth,
            20, 10
        );

        barBg.fill({color: 0x333333});
        this.addChild(bg)
        this.addChild(barBg);

        this.progressBar = new Graphics();
        this.addChild(this.progressBar);

        this.progressText = new Text({
            text: '0%',
            style: {
                fontFamily: "Viga",
                fontSize: 24,
                fill: 0xffd700,
            }
        });

        this.progressText.anchor.set(0.5);
        this.progressText.position.set(GAME_CONFIG.WIDTH / 2, 585 - 30);
        this.addChild(this.progressText);

        this.updateProgress(0);
    }

    public updateProgress(progress: number): void {
        const percent = Math.round(progress * 100);
        this.progressText.text = `${percent}%`;

        this.progressBar.clear();
        this.progressBar.roundRect(
            GAME_CONFIG.WIDTH / 2 - this.barWidth / 2,
            570,
            this.barWidth * progress, 20, 10
        );
        this.progressBar.fill({color: 0xffd700});
    }
}