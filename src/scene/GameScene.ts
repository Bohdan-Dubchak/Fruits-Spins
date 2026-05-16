import {Assets, Container, Sprite} from "pixi.js";
import { ReelContainer } from "../reels/ReelsContainer.ts";
import { HUD } from "../ui/display/HUD.ts";
import { WinText } from "../ui/display/WinText.ts";
import { WalletManager } from "../game/wallet/WalletManager.ts";
import { SpinManager } from "../game/spin/SpinManager.ts";
import { BetManager } from "../game/bet/BetManager.ts";
import { WinHandler } from "../game/win/WinHandler.ts";
import { RNG } from "../game/engine/RNG.ts";
import { WeightedSpinGenerator } from "../game/engine/WeightedSpinGenerator.ts";
import { GAME_CONFIG } from "../config/game.ts";
import { UIFactory } from "../ui/UIFactory.ts";
import {ReelsOverlay} from "../reels/ReelsOverlay.ts";

export class GameScene extends Container {
    private reelsContainer: ReelContainer;
    private hud: HUD;
    private winText: WinText;

    private readonly wallet = new WalletManager();
    private readonly rng: RNG;
    private readonly spinGenerator: WeightedSpinGenerator;

    private spinManager: SpinManager;
    private betManager: BetManager;
    private winHandler: WinHandler;

    constructor(rng: RNG) {
        super();
        this.rng = rng;
        this.spinGenerator = new WeightedSpinGenerator(this.rng);

        this.createBackgroundImage();
        this.reelsContainer = this.createReels();
        this.createReelsOverlay();
        this.hud = this.createHUD();
        this.winText = this.createWinText();

        this.betManager = this.createBetManager();
        this.winHandler = this.createWinHandler();
        this.spinManager = this.createSpinManager();

        this.createUI();
    }

    private createBackgroundImage(): void {
        const texture = Assets.get("/assets/Fons/backFon.png");
        const sprite = new Sprite(texture);

        sprite.width = GAME_CONFIG.WIDTH;
        sprite.height = GAME_CONFIG.HEIGHT;

        this.addChild(sprite);
    }

    private createReels(): ReelContainer {
        const reelsContainer = new ReelContainer(5, this.rng);
        reelsContainer.position.set(165, 80);
        this.addChild(reelsContainer);
        return reelsContainer;
    }

    private createReelsOverlay(): void {
        const overlay = new ReelsOverlay({
            width: 117 * 6.2,
            height: 351,
            topShadowHeight: 15,
            bottomShadowHeight: 15,
            color: 0x3d2817,
            alpha: 0.5,
            blurStrength: 12
        });

        overlay.position.set(155, 129);
        this.addChild(overlay);
    }

    private createHUD(): HUD {
        const hud = new HUD(
            this.wallet.getBalance(),
            this.wallet.getBet()
        );
        this.addChild(hud);
        return hud;
    }

    private createWinText(): WinText {
        const winText = new WinText();
        winText.position.set(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2);
        this.addChild(winText);
        return winText;
    }

    private createBetManager(): BetManager {
        return new BetManager(
            this.wallet,
            (bet) => this.hud.updateBet(bet)
        );
    }

    private createWinHandler(): WinHandler {
        return new WinHandler(
            this.wallet,
            this.winText,
            this.hud
        );
    }

    private createSpinManager(): SpinManager {
        return new SpinManager(
            this.reelsContainer,
            this.spinGenerator,
            this.wallet,
            (matrix) => {
                this.winHandler.handleWin(matrix, this.wallet.getBet());
            },
            () => {
                this.hud.updateBalance(this.wallet.getBalance());
            }
        );
    }

    private createUI(): void {
        const uiFactory = new UIFactory();
        const uiElements = uiFactory.createGameUI(
            () => {
                this.spinManager.executeSpin();
                // Оновити HUD після запуску обертання
                this.hud.updateBalance(this.wallet.getBalance());
            },
            () => this.spinManager.toggleAutoSpin(),
            this.betManager
        );

        this.addChild(...uiElements);
    }

    public override destroy(options?: any): void {
        this.betManager.destroy();
        super.destroy(options);
    }
}