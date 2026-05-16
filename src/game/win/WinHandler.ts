import { WalletManager } from "../wallet/WalletManager.ts";
import { WinText } from "../../ui/display/WinText.ts";
import { HUD } from "../../ui/display/HUD.ts";
import { WinCalculator } from "../calculator/WinCalculator.ts";
import { payLines, payTable } from "../../constants/paylines.ts";
import { WinTextAnimation } from "../../animations/WinAnimations.ts";

export class WinHandler {
    private wallet: WalletManager;
    private winText: WinText;
    private hud: HUD;

    constructor(wallet: WalletManager, winText: WinText, hud: HUD) {
        this.wallet = wallet;
        this.winText = winText;
        this.hud = hud;
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

            this.wallet.addWin(result.totalWin);
            this.hud.updateBalance(this.wallet.getBalance());

            this.winText.setAmount(result.totalWin);
            WinTextAnimation.play(this.winText);
        }
    }

    private logWins(wins: any[]): void {
        wins.forEach(win => {
            console.log(
                `🎉 Line ${win.lineIndex + 1}`,
                `Symbol: ${win.symbol}`,
                `Count: ${win.count}`,
                `Win: ${win.amount}`
            );
        });
    }
}