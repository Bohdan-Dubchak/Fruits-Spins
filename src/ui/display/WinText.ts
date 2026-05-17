import {Text, TextStyle} from "pixi.js";

export class WinText extends Text {
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
    }

    public setAmount(amount: number): void {
        this.text = `WIN +${amount}`;
    }

}
