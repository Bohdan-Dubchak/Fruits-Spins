import {Application, type Renderer} from "pixi.js";
import {GAME_CONFIG} from "../config/constants.ts";
import {Loader} from "../config/Loader.ts";

export class App {
    private app: Application<Renderer>;
    constructor() {
        this.app = new Application();
    }

    async init(): Promise<void> {
        await this.app.init({
            width: GAME_CONFIG.WIDTH,
            height: GAME_CONFIG.HEIGHT,
            backgroundColor: '#0c0c1e'
        });


        await Loader.load(() => {

        })

        document.body.appendChild(this.app.canvas);
    }

    get stage() {
        return this.app.stage;
    }
}