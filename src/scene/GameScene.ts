import { Assets, Container, Sprite } from "pixi.js";
import { ReelContainer } from "../reels/ReelsContainer.ts";
import { SpinButton } from "../ui/button/SpinBtn/spinButton.ts";
import {HomeBtn} from "../ui/button/homeButton.ts";
import {SoundButton} from "../ui/button/soundButton.ts";
import { GAME_CONFIG } from "../config/game.ts";
import { payLines, payTable } from "../constants/paylines.ts";
import { WinCalculator } from "../game/calculator/WinCalculator.ts";
import { AutoSpin } from "../ui/button/SpinBtn/autoSpinBtn.ts";
import { PlusBet } from "../ui/button/plusButton.ts";
import { HUD } from "../ui/display/HUD.ts";
import { MinusButton } from "../ui/button/minusButton.ts";
import { WalletManager } from "../game/wallet/WalletManager.ts";
import {WinText} from "../ui/display/WinText.ts";
import {WinTextAnimation} from "../animations/WinAnimations.ts";
import {RNG} from "../game/engine/RNG.ts";
import {WeightedSpinGenerator} from "../game/engine/WeightedSpinGenerator.ts";

export class GameScene extends Container {
    private reelsContainer!: ReelContainer;
    private hud!: HUD;

    private wallet = new WalletManager();

    private isAutoSpun: boolean = false;
    private isCheckingWin: boolean = false;

    private winText!: WinText;

    private rng: RNG;
    private spinGenerator: WeightedSpinGenerator;

    constructor(rng: RNG) {
        super();
        this.rng = rng;
        this.spinGenerator = new WeightedSpinGenerator(this.rng);
        this.init();
    }

    private async init(): Promise<void> {
        this.createBackgroundImage();
        this.createReels();

        this.hud = new HUD(
            this.wallet.getBalance(),
            this.wallet.getBet()
        );

        this.addChild(this.hud);

        this.winText = new WinText();
        this.winText.position.set(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2);
        this.addChild(this.winText);

        this.createUI();
    }

    private createBackgroundImage(): void {
        const texture = Assets.get("/assets/Fons/backFon.png");
        const sprite = new Sprite(texture);

        sprite.width = GAME_CONFIG.WIDTH;
        sprite.height = GAME_CONFIG.HEIGHT;

        this.addChild(sprite);
    }

    private createReels(): void {
        this.reelsContainer = new ReelContainer(5, this.rng);
        this.reelsContainer.position.set(165, 80);

        this.addChild(this.reelsContainer);
    }

    //  Spin logic
    private async startSpin(): Promise<void> {
        if (this.reelsContainer.isAnySpinning()) return;

        if (!this.wallet.canSpin()) {
            this.isAutoSpun = false;
            return;
        }

        if (this.isCheckingWin) return;

        this.wallet.spendBet();

        this.hud.updateBalance(this.wallet.getBalance());
        this.hud.updateBet(this.wallet.getBet());

        const matrix = this.spinGenerator.generateMatrix();
        this.reelsContainer.setSpinResult(matrix);
        console.log(matrix);

        await this.reelsContainer.spinAll(() => {
            if (this.reelsContainer.isAnySpinning()) return;

            this.isCheckingWin = true;

            this.checkWin();

            this.isCheckingWin = false;
            // this.isSpinning = false;

            // Auto spin loop
            if (this.isAutoSpun) {
                setTimeout(() => {
                    this.startSpin();
                }, 500);
            }
        });
    }

    private createUI(): void {
        let interval: ReturnType<typeof setInterval> | null = null;

        const stop = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        //  Spin
        const spinButton = new SpinButton(() => {
            this.startSpin();
        });

        // Auto spin
        const autoSpin = new AutoSpin(() => {
            this.isAutoSpun = !this.isAutoSpun;

            if (this.isAutoSpun) {
                this.startSpin();
            }
        });

        const plusButton = new PlusBet(() => {
            this.wallet.increaseBet();
            this.hud.updateBet(this.wallet.getBet());
        });

        plusButton.on("pointerdown", () => {
            stop();

            interval = setInterval(() => {
                this.wallet.increaseBet();
                this.hud.updateBet(this.wallet.getBet());
            }, 190);
        });

        plusButton.on("pointerup", stop);
        plusButton.on("pointerupoutside", stop);

        const minusButton = new MinusButton(() => {
            this.wallet.decreaseBet();
            this.hud.updateBet(this.wallet.getBet());
        });

        minusButton.on("pointerdown", () => {
            stop();

            interval = setInterval(() => {
                this.wallet.decreaseBet();
                this.hud.updateBet(this.wallet.getBet());
            }, 190);
        });

        minusButton.on("pointerup", stop);
        minusButton.on("pointerupoutside", stop);


        const homeBtn = new HomeBtn(() => {

        });

        const soundBtn = new SoundButton(() => {

        });

        this.addChild(spinButton, autoSpin, plusButton, minusButton, homeBtn, soundBtn);
    }

    private checkWin(): void {
        const reels = this.reelsContainer.getReels();

        const matrix = reels.map((reel) => {
            return reel.getVisibleSymbolsSprites().map(sprite => {
                return (sprite as any).symbolId;
            });
        });

        const result = WinCalculator.calculate(matrix, this.wallet.getBet(), payLines, payTable);

        result.wins.forEach(win => {
            console.log(
                `🎉 Line ${win.lineIndex + 1}`,
                `Symbol: ${win.symbol}`,
                `Count: ${win.count}`,
                `Win: ${win.amount}`
            );
        });

        console.log("💰 TOTAL:", result.totalWin);

        if (result.totalWin > 0) {
            this.wallet.addWin(result.totalWin);

            this.hud.updateBalance(this.wallet.getBalance());

            this.winText.setAmount(result.totalWin);
            WinTextAnimation.play(this.winText);
        }
    }
}