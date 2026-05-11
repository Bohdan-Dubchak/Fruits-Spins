import {Assets, Container,  Sprite, Texture, Ticker, Graphics} from "pixi.js";
import {RNG} from "./RNG.ts";

type SymbolDate = {
    id: string;
    texture: Texture;
}

export class Reel extends Container {
    private symbols: Sprite[] = [];
    private symbolMap: SymbolDate[] = [];

    private symbolSize = 117;
    private reelHeight = 352;

    private symbolsContainer: Container;

    private speed = 0;
    private targetSpeed = 0;
    private isSpinning = false;

    private rng: RNG;

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

        Ticker.shared.add(this.update, this);
    }

    private createMask(): void {
        const mask = new Graphics();
        mask.rect(0, 0, this.symbolSize, this.reelHeight);
        mask.fill(0xffffff);

        this.addChild(mask);
        this.symbolsContainer.mask = mask;
    }

    // Завантажує текстури всіх символів з Assets
    private loadTextures(): void {
        this.symbolMap = [
            {id: 'bell', texture: Assets.get("bell")},
            {id: 'cherry', texture: Assets.get("cherry")},
            {id: 'grapes', texture: Assets.get("grapes")},
            {id: 'lemon', texture: Assets.get("lemon")},
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

            const sprite = new Sprite(texture);

            sprite.width = this.symbolSize;
            sprite.height = this.symbolSize;
            sprite.y = i * this.symbolSize;

            (sprite as any).symbolId = id;

            this.symbols.push(sprite);
            this.symbolsContainer.addChild(sprite);
        }
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

        if (this.speed < this.targetSpeed) {
            this.speed += 0.5;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= 0.5;
        }

        for (const symbol of this.symbols) {
            symbol.y += this.speed;

            if (symbol.y >= this.symbolSize * this.symbols.length) {
                symbol.y -= this.symbolSize * this.symbols.length;

                const {id, texture} = this.getRandomSymbol();
                symbol.texture = texture;
                (symbol as any).symbolId = id;
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

        return (closest as any).symbolId;
    }
// Повертає масив Sprite об'єктів всіх 3 видимих символів
    public getVisibleSymbolsSprites(): Sprite[] {
        // Повертає три спрайти по центру (видимий ряд)
        const result: Sprite[] = [];
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


}