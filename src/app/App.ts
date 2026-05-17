import {Application, Container, type Renderer} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {Loader} from "../config/Loader.ts";
import {GameScene} from "../scene/GameScene.ts";
import {RNG} from "../game/engine/RNG.ts";

export class App {
    private app: Application<Renderer>;
    private currentScene: Container | null = null;

    constructor() {
        this.app = new Application();
    }

    async init(): Promise<void> {
        await this.app.init({
            width: GAME_CONFIG.WIDTH,
            height: GAME_CONFIG.HEIGHT,
            backgroundColor: '#000000',
        });

        this.app.canvas.style.borderRadius = '20px'

        document.body.appendChild(this.app.canvas);

        await Loader.load();

        this.startGame();
    }

    private startGame(): void {
        this.clearScene();

        const rng = new RNG(Date.now());
        const gameScene = new GameScene(rng);

        this.currentScene = gameScene;
        this.app.stage.addChild(gameScene);
    }

    private clearScene(): void {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
        }
    }

    get stage() {
        return this.app.stage;
    }
}