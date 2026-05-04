import {Container, Assets, Sprite} from "pixi.js";

export class SpinButton extends Container {
    constructor(onClick: () => void) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const texture = Assets.get('spinButton');
        const bg = new Sprite(texture);

        bg.width = 100;
        bg.height = 50;

        this.addChild(bg);



        this.on('pointerdown', () => {
            onClick();
        })
    }
}