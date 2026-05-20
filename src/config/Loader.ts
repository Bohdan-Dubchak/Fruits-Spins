import {Assets} from "pixi.js";

export class Loader {
    public static async load(onProgress?: (progress: number) => void): Promise<void> {
        const assets = [
            {alias: 'bell', src: '/assets/symbols/bell.png'},
            {alias: 'cherry', src: '/assets/symbols/cherry.png'},
            {alias: 'grapes', src: '/assets/symbols/grapes.png'},
            {alias: 'lemon', src: '/assets/symbols/lemon.png'},
            {alias: 'orange', src: '/assets/symbols/orange.png'},
            {alias: 'plum', src: '/assets/symbols/plum.png'},
            {alias: 'seven', src: '/assets/symbols/seven.png'},
            {alias: 'backFon', src: '/assets/Fons/backFon.png'},
            {alias: 'spinButton', src: '/assets/button/spinButton.png'},
            {alias: 'autoSpin', src: '/assets/button/autoSpin.png'},
            {alias: 'plus', src: '/assets/button/plus.png'},
            {alias: 'minus', src: '/assets/button/minus.png'},
            {alias: 'fade-bottom', src: '/assets/effects/fade-bottom.png'},
            {alias: 'fade-top', src: '/assets/effects/fade-top.png'},
            {alias: 'homeButton', src: '/assets/button/homeBtn.png'},
            {alias: 'offSoundButton', src: '/assets/button/offSoundBtn.png'},
            {alias: 'onSoundButton', src: '/assets/button/onSoundBtn.png'},
            {alias: 'info', src: '/assets/button/info.png'},
            {alias: 'MenuFon', src: '/assets/Fons/MenuFon.png'},
            {alias: 'play', src: '/assets/button/play.png'},
            {alias: 'settingsBtn', src: '/assets/button/settingsButton.png'},
            {alias: 'exitBtn', src: '/assets/button/exitButton.png'},
        ];

        Assets.add(assets);

        let loaded: number = 0;

        for (const asset of assets) {
            try {
                await Assets.load(asset.alias);

                loaded++;

                const progress = loaded / assets.length;

                await new Promise(res => setTimeout(res, 200));

                onProgress?.(progress);
            } catch (err) {
                console.warn(`Failed to load asset: ${asset}`, err);
            }
        }
    }
}