import {Container, Text, TextStyle} from "pixi.js";
import gsap from "gsap";

export class HUD extends Container {

    private balanceValue!: Text;
    private betValue!: Text;

    constructor(balance: number, bet: number) {
        super();

        this.create(balance, bet);
    }

    private create(balance: number, bet: number): void {

        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 40,
            fill: "#ffffff",
            fontWeight: "bold",
        });

        this.balanceValue = new Text({
            text: `${balance}`,
            style
        });

        this.betValue = new Text({
            text: `${bet}`,
            style
        });

        this.balanceValue.anchor.set(0.5);
        this.betValue.anchor.set(0.5);

        this.balanceValue.position.set(171, 551);
        this.betValue.position.set(515, 541);

        this.addChild(this.balanceValue, this.betValue);
    }

    public updateBalance(balance: number): void {

        const obj = {
            value: Number(this.balanceValue.text)
        };

        gsap.to(obj, {
            value: balance,
            duration: 0.4,
            onUpdate: () => {
                this.balanceValue.text = Math.floor(obj.value).toString();
            }
        });
    }

    public updateBet(bet: number): void {
        this.betValue.text = `${bet}`;
    }
}