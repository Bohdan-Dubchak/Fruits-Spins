export class ResolutionManager {
    private static readonly MAX_RESOLUTION: number = 2;
    private static readonly MIN_RESOLUTION: number = 1;

    static getOptimalResolution(): number {
        const dpr = window.devicePixelRatio || 1;

        return Math.max(this.MIN_RESOLUTION, Math.min(dpr, this.MAX_RESOLUTION));
    }

    static getResolutionByQuality(quality: 'low' | 'medium' | 'high' | 'ultra'): number {
        const dpr = window.devicePixelRatio || 1;

        switch (quality) {
            case 'low':
                return this.MIN_RESOLUTION;
            case 'medium':
                return Math.min(dpr, 1.5);
            case 'high':
                return Math.min(dpr, this.MAX_RESOLUTION);
            case 'ultra':
                return Math.min(dpr, 3);
            default:
                return this.getOptimalResolution();
        }
    }

    static isHighDPI(): boolean {
        return (window.devicePixelRatio || 1) > 1;
    }

    static getAdaptiveResolution(): number {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixels = width * height;

        if (pixels < 500000) {
            return Math.min(dpr, 3);
        } else if (pixels < 2000000) {
            return Math.min(dpr, 2);
        } else {
            return Math.min(dpr, 1.5);
        }
    }

}