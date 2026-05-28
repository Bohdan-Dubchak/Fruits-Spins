import {RNG} from "./RNG.ts";
import {SYMBOL_WEIGHTS} from "../../constants/symbolWeights.ts";

export class WeightedSpinGenerator {
    private rng: RNG;
    private symbols: string[];
    private weights: number[];
    private totalWeight: number;

    constructor(rng: RNG) {
        this.rng = rng;

        this.symbols = Object.keys(SYMBOL_WEIGHTS);
        this.weights = Object.values(SYMBOL_WEIGHTS);
        this.totalWeight = this.weights.reduce((a, b) => a + b, 0);
    }

    private getWeightedSymbol(): string {
        const random = this.rng.next() * this.totalWeight;

        let sum = 0;

        for (let i = 0; i < this.symbols.length; i++) {
            sum += this.weights[i];
            if (random < sum) {
                return this.symbols[i];
            }
        }

        return this.symbols[0];
    }

    public generateMatrix(): string[][] {
        const matrix: string[][] = [];

        for (let reel = 0; reel < 5; reel++) {
            const column: string[] = [];

            for (let row = 0; row < 3; row++) {
                let symbol = this.getWeightedSymbol();

                // Якщо останні 2 символи однакові - спробувати інший
                if (row >= 2 && column[row-1] === column[row-2] && column[row-1] === symbol) {
                    // Спробуємо ще раз (макс 3 спроби)
                    for (let attempt = 0; attempt < 3; attempt++) {
                        symbol = this.getWeightedSymbol();
                        if (symbol !== column[row-1]) break;
                    }
                }

                column.push(symbol);
            }

            matrix.push(column);
        }

        return matrix;
    }
}