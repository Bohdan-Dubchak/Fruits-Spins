import {Container, Graphics} from "pixi.js";

export class SpinButton extends Container {
    constructor(onClick: () => void) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const grap = new Graphics();
        grap.rect(50,50,50,50);
        grap.fill('red');

        this.addChild(grap);


        this.on('pointerdown', () => {
            onClick();
        })
    }
}