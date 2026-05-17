type WinResult = {
    lineIndex: number;
    symbol: string;
    count: number;
    amount: number;
    startPosition: number;
    isVertical?: boolean;
    positions?: { reel: number; row: number }[];
};

export class WinCalculator {

    public static calculate(matrix: string[][], bet: number, payLines: number[][], payTable: Record<string, Record<number, number>>): {
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
                    (payTable[win.symbol]?.[win.count] || 0) * bet;

                if (amount > 0) {
                    const positions = [];
                    for (let i = 0; i < win.count; i++) {
                        const reelIndex = win.startPosition + i;
                        positions.push({
                            reel: reelIndex,
                            row: line[reelIndex]
                        });
                    }
                    totalWin += amount;

                    wins.push({
                        lineIndex,
                        symbol: win.symbol,
                        count: win.count,
                        amount,
                        startPosition: win.startPosition,
                        isVertical: false,
                        positions,
                    });
                }
            });
        });

        // Вертикальний виграш
        matrix.forEach((reel, reelIndex) => {
            const verticalWins = this.checkLine(reel);

            verticalWins.forEach(win => {
                const amount = (payTable[win.symbol]?.[win.count] || 0) * bet;

                if (amount > 0) {
                    const positions = [];
                    for (let i = 0; i < win.count; i++) {
                        positions.push({
                            reel: reelIndex,
                            row: win.startPosition + i
                        });
                    }
                    totalWin += amount;

                    wins.push({
                        lineIndex: reelIndex,
                        symbol: win.symbol,
                        count: win.count,
                        amount,
                        startPosition: win.startPosition,
                        isVertical: true,
                        positions
                    })
                }
            })
        })

        return {
            totalWin,
            wins,
        };
    }

    private static checkLine(symbols: string[]): { symbol: string, count: number, startPosition: number }[] {

        const results: { symbol: string, count: number, startPosition: number }[] = [];

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
                results.push({symbol, count, startPosition: s});
                break;
            }
        }

        return results;
    }
}