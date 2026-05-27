import {Assets, Container, Sprite} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {PlayButton} from "../ui/button/playButton.ts";
import {SettingsBtn} from "../ui/button/settingsButton.ts";
import {ExitBtn} from "../ui/button/exitButton.ts";
import {SoundManager} from "../audio/SoundManager.ts";

export class MenuScene extends Container {
    private playBtn: PlayButton;
    private settingsBtn: SettingsBtn;
    private exitBtn: ExitBtn;
    private soundManager: SoundManager;

    constructor(startCallback: () => void, onSettingsClick: () => void, soundManager: SoundManager) {
        super();
        // soundManager.play('music');
        this.soundManager = soundManager;

        const texture = Assets.get('MenuFon');
        const bg = new Sprite(texture);
        bg.setSize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        bg.position.set(0, 0);

        this.playBtn = new PlayButton(startCallback, this.soundManager);
        this.playBtn.setSize(270, 87);
        this.playBtn.position.set(533, 183);

        this.settingsBtn = new SettingsBtn(onSettingsClick, this.soundManager);
        this.settingsBtn.position.set(533, 290);


        this.exitBtn = new ExitBtn(this.soundManager);
        this.exitBtn.position.set(533, 387);


        this.addChild(bg, this.playBtn, this.settingsBtn, this.exitBtn);
    }
}