import {Assets, Container, Sprite} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {PlayButton} from "../ui/button/playButton.ts";

export class MenuScene extends Container {
    constructor(startCallback: () => void) {
        super();

        const texture = Assets.get('MenuFon');
        const bg = new Sprite(texture);

        bg.setSize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        bg.position.set(0, 0);

        const playBtn = new PlayButton(startCallback);
        playBtn.setSize(270, 87)
        playBtn.position.set(533, 183);

        this.addChild(bg, playBtn);
    }
}