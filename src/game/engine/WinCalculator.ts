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

        for (let i = 0; i < symbols.length; i++) {

            let count = 1;

            for (let j = i + 1; j < symbols.length; j++) {

                if (symbols[j] === symbols[i]) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 3) {

                results.push({
                    symbol: symbols[i],
                    count,
                });
            }
        }

        return results;
    }
}