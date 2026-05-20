import {Container} from "pixi.js";
import {BetManager} from "../game/bet/BetManager.ts";
import {SpinButton} from "./SpinBtn/spinButton.ts";
import {AutoSpin} from "./SpinBtn/autoSpinBtn.ts";
import {PlusBet} from "./button/plusButton.ts";
import {MinusButton} from "./button/minusButton.ts";
import {SoundButton} from "./button/soundButton.ts";
import {InfoBtn} from "./button/infoButton.ts";

export class UIFactory {

    createGameUI(onSpin: () => void, onAutoSpin: () => void, betManager: BetManager, onInfo: () => void): Container[] {

        const spinButton = new SpinButton(onSpin);
        const autoSpin = new AutoSpin(onAutoSpin);

        const plusButton = new PlusBet(() => betManager.increaseBetOnce());
        this.setupBetButton(
            plusButton,
            () => betManager.startIncreasing(),
            () => betManager.stop()
        );

        const minusButton = new MinusButton(() => betManager.decreaseBetOnce());
        this.setupBetButton(minusButton,
            () => betManager.startDecreasing(),
            () => betManager.stop()
        );

        const soundBtn = new SoundButton(() => {});

        const infoBtn = new InfoBtn(onInfo);

        return [spinButton, autoSpin, plusButton, minusButton, soundBtn, infoBtn];
    }

    private setupBetButton(button: any, onHold: () => void, onRelease: () => void): void {

        button.on("pointerdown", onHold);
        button.on("pointerup", onRelease);
        button.on("pointerupoutside", onRelease);
    }
}