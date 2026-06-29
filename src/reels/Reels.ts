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

    private onStop?: () => void
    private isSnapping = false;

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

    private loadTextures(): void {
        this.symbolMap = [
            {id: 'bell', texture: Assets.get("bell"), scale: 1},
            {id: 'cherry', texture: Assets.get("cherry"), scale: 1},
            {id: 'grapes', texture: Assets.get("grapes"), scale: 1},
            {id: 'lemon', texture: Assets.get("lemon"), scale: 1.05},
            {id: 'orange', texture: Assets.get("orange"), scale: 1},
            {id: 'plum', texture: Assets.get("plum"), scale: 0.9},
            {id: 'seven', texture: Assets.get("seven"), scale: 1},
        ]
    }

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

    public spin(): void {
        if (this.isSpinning) return

        this.isSpinning = true;
        this.speed = 0;
        this.targetSpeed = 30;
    }

    public stop(): void {
        this.targetSpeed = 0;
    }

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }

    private update(): void {
        this.animations.update(this.speed, this.targetSpeed);

        const deltaMS = Ticker.shared.deltaMS / 1000;
        const easingFactor = 5;
        this.speed += (this.targetSpeed - this.speed) * (1 - Math.exp(-easingFactor * deltaMS));

        for (const symbol of this.symbols) {
            symbol.y += this.speed;

            if (symbol.y >= this.symbolSize * this.symbols.length) {
                symbol.y -= this.symbolSize * this.symbols.length;


                let symbolId: string;
                if (this.isSpinning && this.speed > 5) {
                    symbolId = this.getRandomSymbol().id;
                } else {
                    const visibleIndex = Math.round(symbol.y / this.symbolSize);
                    const resultIndex = visibleIndex % this.resultSymbols.length;
                    symbolId = this.resultSymbols[resultIndex];
                }

                const texture = this.getTexture(symbolId);
                symbol.texture = texture;
                symbol.symbolId = symbolId;
            }
        }

        if (this.targetSpeed === 0 && this.speed < 0.5 && this.isSpinning) {
            this.isSnapping = true;
            this.speed = 0;
        }

        if (this.isSnapping) {
            let allAligned = true;
            const totalHeight = this.symbolSize * this.symbols.length;

            for (const symbol of this.symbols) {

                if (symbol.y < 0) symbol.y += totalHeight;
                if (symbol.y >= totalHeight) symbol.y -= totalHeight;

                const nearest = Math.round(symbol.y / this.symbolSize) * this.symbolSize;
                const snapFactor = 15;
                symbol.y += (nearest - symbol.y) * (1 - Math.exp(-snapFactor * deltaMS));

                if (Math.abs(symbol.y - nearest) > 0.5) {
                    allAligned = false;
                }
            }

            if (allAligned) {
                for (const symbol of this.symbols) {
                    symbol.y = Math.round(symbol.y / this.symbolSize) * this.symbolSize;
                }
                this.isSnapping = false;
                this.isSpinning = false;
                this.onStop?.();
            }
            return
        }
    }

    public setOnStop(callback: () => void): void {
        this.onStop = callback;
    }

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

    public getVisibleSymbolsSprites(): SymbolSprite[] {
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