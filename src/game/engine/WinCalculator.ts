type WinResult = {
    lineIndex: number;
    symbol: string;
    count: number;
    amount: number;
};

export class WinCalculator {

    public static calculate(matrix: string[][], payLines: number[][], payTable: Record<string, Record<number, number>>): {
        totalWin: number;
        wins: WinResult[];
    } {

        const wins: WinResult[] = [];

        let totalWin = 0;

        payLines.forEach((line, lineIndex) => {

            const symbols = line.map((row, reelIndex) => {
                return matrix[reelIndex][row];
            });

            const lineWins = this.checkLine(symbols);

            lineWins.forEach(win => {

                const amount =
                    payTable[win.symbol]?.[win.count] || 0;

                if (amount > 0) {

                    totalWin += amount;

                    wins.push({
                        lineIndex,
                        symbol: win.symbol,
                        count: win.count,
                        amount,
                    });
                }
            });
        });

        return {
            totalWin,
            wins,
        };
    }

    private static checkLine(symbols: string[]): { symbol: string, count: number }[] {

        const results: { symbol: string, count: number }[] = [];

        // Перевіряємо з кожної позиції
        for (let s = 0; s <= symbols.length - 3; s++) {
            const symbol = symbols[s];
            let count = 1;

            // Рахуємо послідовні однакові символи
            for (let i = s + 1; i < symbols.length; i++) {
                if (symbols[i] === symbol) {
                    count++;
                } else {
                    break;
                }
            }

            // Якщо знайшли 3 або більше - додаємо
            if (count >= 3) {
                results.push({symbol, count});
                break; // Беремо першу знайдену комбінацію
            }
        }

        return results;
    }
}