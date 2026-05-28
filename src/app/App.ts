import {Assets, Application, type Renderer} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {Loader} from "../config/Loader.ts";
import {RNG} from "../game/engine/RNG.ts";
import {SceneManager} from "../managers/SceneManager.ts";
import {MenuScene} from "../scene/MenuScene.ts";
import {GameScene} from "../scene/GameScene.ts";
import {SettingPanelManager} from "../managers/settingPanelManager.ts";
import {ResolutionManager} from "../config/resolution.ts";
import {SoundManager} from "../audio/SoundManager.ts";
import {LoadingScene} from "../scene/LoadingScene.ts";

export class App {

    private app: Application<Renderer>;
    private sceneManager: SceneManager | null = null;
    private settingPanelManager: SettingPanelManager | null = null;
    private soundManager: SoundManager = new SoundManager();

    constructor() {
        this.app = new Application();
    }

    async init(): Promise<void> {

        try {
            await this.app.init({
                width: GAME_CONFIG.WIDTH,
                height: GAME_CONFIG.HEIGHT,
                resolution: ResolutionManager.getOptimalResolution(),
                autoDensity: true,
                backgroundColor: '#000000',
            });

            this.app.canvas.style.borderRadius = '20px'

            document.body.appendChild(this.app.canvas);

            await Assets.load({alias: 'loading', src: '/assets/Fon/Loading.webp'});

            const loadingScene = new LoadingScene();
            this.app.stage.addChild(loadingScene);

            await Loader.load((progress) => {
                loadingScene.updateProgress(progress);
            });

            await this.loadFonts();

            this.app.stage.removeChild(loadingScene);
            loadingScene.destroy();

            this.sceneManager = new SceneManager(this.app.stage)

            this.settingPanelManager = new SettingPanelManager(
                GAME_CONFIG.WIDTH,
                GAME_CONFIG.HEIGHT,
                this.app.stage,
                this.soundManager
            );

            this.showMenu();

        } catch (err) {
            console.error('Failed to initialize game:', err);
        }

    }

    private async loadFonts() {
        await document.fonts.load('150px "Bebas"');
    }

    public async showMenu() {
        const menu = new MenuScene(
            () => this.startGame(),
            () => this.showSettings(),
            this.soundManager
        );

        if (!this.sceneManager) return;

        await this.sceneManager.changeScene(menu);
    }

    public async startGame() {
        const rng = new RNG(Date.now());
            const game = new GameScene(rng, () => this.showMenu(), this.soundManager);

        if (!this.sceneManager) return;

        await this.sceneManager.changeScene(game);
    }

    private showSettings(): void {
        if (this.settingPanelManager) {
            this.settingPanelManager.show();
        }
    }
}