import {Assets, Container,  Sprite, Texture, Ticker, Graphics} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {RNG} from "../game/engine/RNG.ts";
import {ReelAnimations} from "../animations/ReelAnimations.ts";

type SymbolDate = {
    id: string;
    texture: Texture;
    scale?: number;
}

interface SymbolSprite extends  Sprite{
    symbolId: string;
}

export class Reel extends Container {
    private symbols: SymbolSprite[] = [];
    private symbolMap: SymbolDate[] = [];

    private symbolSize = GAME_CONFIG.SYMBOL_SIZE;
    private reelHeight = GAME_CONFIG.REEL_HEIGHT;

    private symbolsContainer: Container;

    private speed = 0;
    private targetSpeed = 0;
    private isSpinning = false;

    private rng: RNG;
    private resultSymbols: string[] = [];

    private animations!: ReelAnimations;

    constructor(rng: RNG) {
        super();
        this.rng = rng;

        this.symbolsContainer = new Container();
        this.addChild(this.symbolsContainer);

    }

    public init(): void {
        this.loadTextures();
        this.createSymbols();
        this.createMask();
        this.animations = new ReelAnimations(this, this.symbolsContainer, this.symbolSize, this.reelHeight);

        Ticker.shared.add(this.update, this);
    }

    private createMask(): void {
        const mask = new Graphics();
        mask.rect(0, 0, this.symbolSize, this.reelHeight);
        mask.fill(0xffffff);

        this.addChild(mask);
        this.symbolsContainer.mask = mask;
    }

    /**
     * Завантажує текстури всіх символів з Assets
     * @private
     */
    private loadTextures(): void {
        this.symbolMap = [
            {id: 'bell', texture: Assets.get("bell")},
            {id: 'cherry', texture: Assets.get("cherry"), scale: 1.2},
            {id: 'grapes', texture: Assets.get("grapes")},
            {id: 'lemon', texture: Assets.get("lemon"), scale: 1.5},
            {id: 'orange', texture: Assets.get("orange")},
            {id: 'plum', texture: Assets.get("plum")},
            {id: 'seven', texture: Assets.get("seven")},
        ]
    }

    // @ts-ignore
    private getTexture(id: string): Texture {
        const texture = Assets.get(id);

        if (!texture) {
            throw new Error(`Texture id ${id} not found`);
        }

        return texture as Texture;
    }


    private getRandomSymbol(): SymbolDate {
        const index = Math.floor(this.rng.next() * this.symbolMap.length);

        return this.symbolMap[index];
    }

    // Створює початковий набір з 5 символів для барабана
    // 5 символів потрібно для безперервної прокрутки (3 видимі + 2 буферні)
    private createSymbols(): void {
        for (let i = 0; i < 5; i++) {
            const {id, texture} = this.getRandomSymbol()

            const sprite = new Sprite(texture) as SymbolSprite;

            sprite.width = this.symbolSize;
            sprite.height = this.symbolSize;
            sprite.y = i * this.symbolSize;

            sprite.symbolId = id;

            this.symbols.push(sprite);
            this.symbolsContainer.addChild(sprite);
        }
    }

    public setResult(symbols: string[]): void {
        if (!symbols?.length) {
            console.warn("Empty resultSymbols passed to Reel");
            return;
        }

        this.resultSymbols = symbols;
    }

    // Встановлює цільову швидкість для плавного старту, запуск
    public spin(): void {
        if (this.isSpinning) return

        this.isSpinning = true;
        this.speed = 0;
        this.targetSpeed = 30;
    }

    // Зупиняє барабан
    public stop(): void {
        this.targetSpeed = 0;
    }

    // Перевіряємо чи барабан крутиться
    public getIsSpinning(): boolean {
        return this.isSpinning;
    }


    // Цикл анімації швидкості
    private update(): void {
        this.animations.update(this.speed, this.targetSpeed);

        if (this.speed < this.targetSpeed) {
            this.speed += 0.5;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= 0.5;
        }

        for (const symbol of this.symbols) {
            symbol.y += this.speed;

            if (symbol.y >= this.symbolSize * this.symbols.length) {
                symbol.y -= this.symbolSize * this.symbols.length;


                let symbolId: string;
                if (this.isSpinning && this.speed > 5) {
                    // Під час швидкого обертання - випадкові символи
                    symbolId = this.getRandomSymbol().id;
                } else {
                    // При уповільненні - результат з матриці
                    const visibleIndex = Math.round(symbol.y / this.symbolSize);
                    const resultIndex = visibleIndex % this.resultSymbols.length;
                    symbolId = this.resultSymbols[resultIndex];
                }

                const texture = this.getTexture(symbolId);
                symbol.texture = texture;
                symbol.symbolId = symbolId;
            }
        }

        if (this.targetSpeed === 0 && this.speed < 0.5) {
            this.snapToGrid();
            this.speed = 0;
            this.isSpinning = false;
        }
    }

    // Вирівнює всі символи по сітці після зупинки
    private snapToGrid(): void {
        for (const symbol of this.symbols) {
            const remainder = symbol.y % this.symbolSize;

            symbol.y -= remainder;

            if (remainder > this.symbolSize / 2) {
                symbol.y += this.symbolSize;
            }
        }
    }

    //  Повертає ID середнього видимого символа (row 1)
    public getMiddleSymbol(): string {
        const targetY = this.symbolSize;

        let closest = this.symbols[0];
        let minDiff = Infinity;

        for (const symbol of this.symbols) {
            const diff = Math.abs(symbol.y - targetY);

            if (diff < minDiff) {
                minDiff = diff;
                closest = symbol;
            }
        }

        return closest.symbolId;
    }
// Повертає масив Sprite об'єктів всіх 3 видимих символів
    public getVisibleSymbolsSprites(): SymbolSprite[] {
        // Повертає три спрайти по центру (видимий ряд)
        const result: SymbolSprite[] = [];
        for (let row = 0; row < 3; row++) {
            const targetY = row * this.symbolSize;
            let closest = this.symbols[0];
            let minDiff = Infinity;

            for (const symbol of this.symbols) {
                const diff = Math.abs(symbol.y - targetY);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = symbol;
                }
            }

            result.push(closest);

        }

        return result;
    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        super.destroy();
    }
}