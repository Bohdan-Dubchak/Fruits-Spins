import {Text, TextStyle} from "pixi.js";
import {LanguageManager} from "../../managers/LanguageManager.ts";
import type {Language} from "../../managers/translations.ts";

export class WinText extends Text {
    private currentAmount: number = 0;
    private languageChangeCallback: (language: Language) => void;

    constructor() {
        super({
            text: "",
            style: new TextStyle({
                fontFamily: "Arial",
                fontSize: 100,
                fill: "#fff200",
                fontWeight: "bold",
                stroke: "#000000",
                align: "center",
            }),
        });

        this.visible = false;
        this.anchor.set(0.5);

        this.languageChangeCallback = () => this.updateText();
        LanguageManager.addListener(this.languageChangeCallback);
    }

    public setAmount(amount: number): void {
        this.currentAmount = amount;
        this.updateText();
    }

    private updateText(): void {
        this.text = `${LanguageManager.t('winMessage')} +${this.currentAmount}`;
    }

    public destroy(): void {
        LanguageManager.removeListener(this.languageChangeCallback);
        super.destroy();
    }

}
