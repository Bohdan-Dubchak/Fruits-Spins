import {Sprite} from "pixi.js";
import {WalletManager} from "../wallet/WalletManager.ts";
import {WinText} from "../../ui/display/WinText.ts";
import {HUD} from "../../ui/display/HUD.ts";
import {WinCalculator} from "../calculator/WinCalculator.ts";
import {payLines, payTable} from "../../constants/paylines.ts";
import {WinTextAnimation} from "../../animations/WinAnimations.ts";
import {ReelContainer} from "../../reels/ReelsContainer.ts";
import {animationSymbols} from "../../animations/ReelSymbolAnimation.ts";


export class WinHandler {
    private wallet: WalletManager;
    private winText: WinText;
    private hud: HUD;
    private reelsContainer: ReelContainer

    constructor(wallet: WalletManager, winText: WinText, hud: HUD, reelsContainer: ReelContainer) {
        this.wallet = wallet;
        this.winText = winText;
        this.hud = hud;
        this.reelsContainer = reelsContainer;
    }

    handleWin(matrix: string[][], bet: number): void {
        const result = WinCalculator.calculate(
            matrix,
            bet,
            payLines,
            payTable
        );

        if (result.totalWin > 0) {
            this.logWins(result.wins);

            // Анімація виграшних символів
            const winningSprites: Sprite[] = [];

            result.wins.forEach(win => {

                // Використовуємо готові positions
                win.positions?.forEach(pos => {
                    const sprite = this.reelsContainer.getSymbolSprite(
                        pos.reel,
                        pos.row
                    );

                    if (sprite && !winningSprites.includes(sprite)) {
                        winningSprites.push(sprite);
                    }
                });
            });

            // Викликаємо анімацію
            if (winningSprites.length > 0) {
                animationSymbols(winningSprites);
            }

            this.wallet.addWin(result.totalWin);
            this.hud.updateBalance(this.wallet.getBalance());

            this.winText.setAmount(result.totalWin);
            WinTextAnimation.play(this.winText);
        }
    }

    private logWins(wins: any[]): void {
        wins.forEach((win) => {
            console.log(
                `🎉 Line ${win.lineIndex + 1}`,
                `Symbol: ${win.symbol}`,
                `Count: ${win.count}`,
                `Win: ${win.amount}`
            );
        });
    }
}