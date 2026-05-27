import {Container} from "pixi.js";
import {BetManager} from "../game/bet/BetManager.ts";
import {SpinButton} from "./SpinBtn/spinButton.ts";
import {AutoSpin} from "./SpinBtn/autoSpinBtn.ts";
import {PlusBet} from "./button/plusButton.ts";
import {MinusButton} from "./button/minusButton.ts";
import {SoundButton} from "./button/soundButton.ts";
import {InfoBtn} from "./button/infoButton.ts";
import {SoundManager} from "../audio/SoundManager.ts";

export class UIFactory {
    private soundManager: SoundManager;

    constructor(soundManager: SoundManager) {
        this.soundManager = soundManager;
    }

    createGameUI(onSpin: () => void,
                 onAutoSpin: () => void,
                 betManager: BetManager,
                 onInfo: () => void): { elements: Container[], spinButton: SpinButton, autoSpin: AutoSpin } {

        const spinButton = new SpinButton(onSpin, this.soundManager);
        const autoSpin = new AutoSpin(onAutoSpin, this.soundManager);

        const plusButton = new PlusBet(() => betManager.increaseBetOnce(), this.soundManager);
        this.setupBetButton(plusButton,
            () => betManager.startIncreasing(),
            () => betManager.stop()
        );

        const minusButton = new MinusButton(() => betManager.decreaseBetOnce(), this.soundManager);
        this.setupBetButton(minusButton,
            () => betManager.startDecreasing(),
            () => betManager.stop()
        );

        const soundBtn = new SoundButton(() => {});
        const infoBtn = new InfoBtn(onInfo, this.soundManager);

        return {
            elements: [spinButton, autoSpin, plusButton, minusButton, soundBtn, infoBtn],
            spinButton,
            autoSpin
        };
    }

    private setupBetButton(button: any, onHold: () => void, onRelease: () => void): void {
        button.on("pointerdown", onHold);
        button.on("pointerup", onRelease);
        button.on("pointerupoutside", onRelease);
    }
}