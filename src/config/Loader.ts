import {Assets} from "pixi.js";

export class Loader {
    public static async load(onProgress?: (progress: number) => void): Promise<void> {
        const assets: string[] = [
            '/public/assets/symbols/bell.png',
            '/public/assets/symbols/cherry.png',
            '/public/assets/symbols/grapes.png',
            '/public/assets/symbols/lemon.png',
            '/public/assets/symbols/orange.png',
            '/public/assets/symbols/plum.png',
            '/public/assets/symbols/seven.png',
        ];

        let loaded: number = 0;

        for (const asset of assets) {
            try {
                await Assets.load(asset);

                loaded++;

                const progress = loaded / asset.length;

                await new Promise(res => setTimeout(res, 200));

                onProgress?.(progress);
            } catch (err) {
                console.warn(`Failed to load asset: ${asset}`, err);
            }
        }
    }
}