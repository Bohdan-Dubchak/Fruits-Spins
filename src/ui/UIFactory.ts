import {Container} from "pixi.js";
import {BetManager} from "../game/bet/BetManager.ts";
import {SpinButton} from "./SpinBtn/spinButton.ts";
import {AutoSpin} from "./SpinBtn/autoSpinBtn.ts";
import {PlusBet} from "./button/plusButton.ts";
import {MinusButton} from "./button/minusButton.ts";
import {HomeBtn} from "./button/homeButton.ts";
import {SoundButton} from "./button/soundButton.ts";

export class UIFactory {

    createGameUI(onSpin: () => void, onAutoSpin: () => void, betManager: BetManager): Container[] {

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

        const homeBtn = new HomeBtn(() => {});
        const soundBtn = new SoundButton(() => {});

        return [spinButton, autoSpin, plusButton, minusButton, homeBtn, soundBtn];
    }

    private setupBetButton(button: any, onHold: () => void, onRelease: () => void): void {

        button.on("pointerdown", onHold);
        button.on("pointerup", onRelease);
        button.on("pointerupoutside", onRelease);
    }
}