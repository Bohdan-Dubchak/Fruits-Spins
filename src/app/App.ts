import {Application, type Renderer} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {Loader} from "../config/Loader.ts";
import {RNG} from "../game/engine/RNG.ts";
import {SceneManager} from "../animations/Transitioning.ts";
import {MenuScene} from "../scene/MenuScene.ts";
import {GameScene} from "../scene/GameScene.ts";

export class App {

    private app: Application<Renderer>;
    private sceneManager: SceneManager | null = null;

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

        this.sceneManager = new SceneManager(this.app.stage);

        this.showMenu();
    }

    public async showMenu() {
        const menu = new MenuScene(() => this.startGame());
        if (!this.sceneManager) return;

        await this.sceneManager.changeScene(menu);
    }

    public async startGame() {
        const rng = new RNG(Date.now());
        const game = new GameScene(rng);

        if (!this.sceneManager) return;

        await this.sceneManager.changeScene(game);
    }
}