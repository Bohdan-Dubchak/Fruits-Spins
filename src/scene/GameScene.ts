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
import { ReelsOverlay } from "../reels/ReelsOverlay.ts";
import {InfoPanelManager} from "../managers/InfoPanelManager.ts";
import {HomeBtn} from "../ui/button/homeButton.ts";
import {SoundManager} from "../audio/SoundManager.ts";

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
    private infoPanelManager: InfoPanelManager;
    private soundManager: SoundManager;

    private homeBtn: HomeBtn;

    constructor(rng: RNG, onHomeClick: () => void, soundManager: SoundManager) {
        super();
        this.rng = rng;
        this.spinGenerator = new WeightedSpinGenerator(this.rng);

        this.soundManager = soundManager;

        this.createBackgroundImage();
        this.reelsContainer = this.createReels();
        this.createReelsOverlay();
        this.hud = this.createHUD();
        this.winText = this.createWinText();

        this.betManager = this.createBetManager();
        this.winHandler = this.createWinHandler();
        this.spinManager = this.createSpinManager();
        this.reelsContainer.setOnReelStop(() => this.soundManager.play('reelStop'));
        this.infoPanelManager = this.createInfoPanelManager();

        this.homeBtn = new HomeBtn(onHomeClick, this.soundManager);
        this.addChild(this.homeBtn);

        this.createUI();
    }

    private createBackgroundImage(): void {
        const texture = Assets.get("/assets/Fon/backFon.webp");
        const sprite = new Sprite(texture);

        sprite.width = GAME_CONFIG.WIDTH;
        sprite.height = GAME_CONFIG.HEIGHT;

        this.addChild(sprite);
    }

    private createReels(): ReelContainer {
        const reelsContainer = new ReelContainer(GAME_CONFIG.REELS_COUNT, this.rng);
        reelsContainer.position.set(162, 79);
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
        winText.position.set(GAME_CONFIG.WIDTH / 2, 65);
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
            this.hud,
            this.reelsContainer
        );
    }

    private createSpinManager(): SpinManager {
        return new SpinManager(
            this.reelsContainer,
            this.spinGenerator,
            this.wallet,
            this.betManager,
            (matrix) => {
                const winAmount = this.winHandler.handleWin(matrix, this.wallet.getBet());
                this.infoPanelManager.updateLastWin(winAmount);

                if (winAmount > 0) {
                   this.soundManager.play('win');
                   if (winAmount > 500) {
                       this.soundManager.play('bigWin');
                   }
                   return winAmount;
                }
            },
            () => { this.hud.updateBalance(this.wallet.getBalance()); },
        );
    }

    private createInfoPanelManager(): InfoPanelManager {
        return new InfoPanelManager(
            this.wallet,
            this,
            GAME_CONFIG.WIDTH,
            GAME_CONFIG.HEIGHT,
            this.soundManager
        );
    }

    private createUI(): void {
        const uiFactory = new UIFactory(this.soundManager);

        const { elements, spinButton } = uiFactory.createGameUI(
            () => {
                this.spinManager.executeSpin();
                this.hud.updateBalance(this.wallet.getBalance());
            },
            () => this.spinManager.toggleAutoSpin(),
            this.betManager,
            () => this.infoPanelManager.show()
        );

        this.spinManager.setSpinCallbacks(
            () => {
                spinButton.setDisabled(true);
            },
            () => {
                spinButton.setDisabled(false);
            }
        );

        this.addChild(...elements);
    }

    public override destroy(options?: any): void {
        this.betManager.destroy();
        this.infoPanelManager.destroy();

        this.reelsContainer.destroy();
        this.removeChildren();
        super.destroy(options);
    }
}