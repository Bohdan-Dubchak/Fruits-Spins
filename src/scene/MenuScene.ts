import {Assets, Container, Sprite} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {PlayButton} from "../ui/button/playButton.ts";
import {SettingsBtn} from "../ui/button/settingsButton.ts";

export class MenuScene extends Container {
    private playBtn: PlayButton;
    private settingsBtn: SettingsBtn;

    constructor(startCallback: () => void, onSettingsClick: () => void) {
        super();

        const texture = Assets.get('MenuFon');
        const bg = new Sprite(texture);
        bg.setSize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        bg.position.set(0, 0);

        this.playBtn = new PlayButton(startCallback);
        this.playBtn.setSize(270, 87);
        this.playBtn.position.set(533, 183);

        this.settingsBtn = new SettingsBtn(onSettingsClick);
        this.settingsBtn.position.set(533, 290);

        this.addChild(bg, this.playBtn, this.settingsBtn);
    }
}