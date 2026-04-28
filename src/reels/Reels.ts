import {Assets, Container,  Sprite, Texture} from "pixi.js";

type SymbolDate = {
    id: string;
    texture: Texture;
}

export class Reel extends Container {
    private symbols: Sprite[] = [];
    private symbolMap: SymbolDate[] = [];

    private symbolSize = 110;
    // private reelHeight = 330;

    private symbolsContainer: Container;

    constructor() {
        super();

        this.symbolsContainer = new Container();
        this.addChild(this.symbolsContainer);

        this.loadTextures();
        this.createSymbols();
    }

    // Завантажує текстури всіх символів з Assets
    private loadTextures(): void {
        this.symbolMap = [
            {id: 'bell', texture: Assets.get("bell")},
            {id: 'cherry', texture: Assets.get("cherry")},
            {id: 'grapes', texture: Assets.get("grapes")},

            // {id: 'lemon', texture: Assets.get("lemon")},
            // {id: 'orange', texture: Assets.get("orange")},
            // {id: 'plum', texture: Assets.get("plum")},
            // {id: 'seven', texture: Assets.get("seven")},

        ]
    }


    // Повертає випадковий символ з доступних
    private getRandomSymbol(): SymbolDate {
        const index = Math.floor(Math.random() * this.symbolMap.length);
        return this.symbolMap[index];
    }

    // Створює початковий набір з 5 символів для барабана
    // 5 символів потрібно для безперервної прокрутки (3 видимі + 2 буферні)
    private createSymbols(): void {
        for (let i = 0; i < 3; i++) {
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

}

/**
 * нам треба вивисти 3 смволи
 * правильно відтворити
 */