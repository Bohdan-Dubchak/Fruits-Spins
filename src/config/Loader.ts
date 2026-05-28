import {Assets} from "pixi.js";

export class LoaderError extends Error {
    public assetName: string;

    constructor(assetName: string, message: string) {
        super(message);

        this.assetName = assetName;
        this.name = 'LoaderError';
    }
}

export class Loader {
    private static criticalAssets = [
        'bell', 'cherry', 'grapes', 'lemon',
        'orange', 'plum', 'seven', 'backFon'
    ];

    public static async load(onProgress?: (progress: number) => void): Promise<void> {
        const assets = [
            {alias: 'bell', src: '/assets/symbols/bell.webp'},
            {alias: 'cherry', src: '/assets/symbols/cherry.webp'},
            {alias: 'grapes', src: '/assets/symbols/grapes.webp'},
            {alias: 'lemon', src: '/assets/symbols/lemon.webp'},
            {alias: 'orange', src: '/assets/symbols/orange.webp'},
            {alias: 'plum', src: '/assets/symbols/plum.webp'},
            {alias: 'seven', src: '/assets/symbols/seven.webp'},
            {alias: 'backFon', src: '/assets/Fon/backFon.webp'},
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
            {alias: 'MenuFon', src: '/assets/Fon/MenuFon.webp'},
            {alias: 'play', src: '/assets/button/play.webp'},
            {alias: 'settingsBtn', src: '/assets/button/settingsButton.webp'},
            {alias: 'exiBtn', src: '/assets/button/exitButton.webp'},
            {alias: 'monitor', src: '/assets/icon/monitor.png'},
            {alias: 'Ukrainian', src: '/assets/icon/UkrainianFlag.png'},
            {alias: 'USA', src: '/assets/icon/FlagUSA.png'},
            {alias: 'Germany', src: '/assets/icon/FlagGermany.png'},
        ];

        Assets.add(assets);

        const failedAssets: String[] = [];
        let loaded: number = 0;

        for (const asset of assets) {
            try {
                await Assets.load(asset.alias);

                loaded++;
                onProgress?.(loaded / assets.length);
            } catch (err) {
                console.error(`Failed to load asset: ${asset.alias}`, err);

                if (this.criticalAssets.includes(asset.alias)) {
                    failedAssets.push(asset.alias);
                }
            }
        }

        if (failedAssets.length > 0) {
            throw new LoaderError(
                failedAssets.join(', '),
                `Failed to load critical assets: ${failedAssets.join(', ')}`
            );
        }
    }
}