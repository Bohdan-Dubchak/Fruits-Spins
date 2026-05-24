export class ResolutionManager {
    private static readonly MAX_RESOLUTION: number = 2;
    private static readonly MIN_RESOLUTION: number = 1;

    // * Отримати оптимальну роздільну здатність для гри
    static getOptimalResolution(): number {
        const dpr = window.devicePixelRatio || 1;

        // Обмежуємо максимальну роздільність для продуктивності
        return Math.max(this.MIN_RESOLUTION, Math.min(dpr, this.MAX_RESOLUTION));
    }

    // Отримати роздільність з урахуванням налаштувань якості
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

    // Перевірити чи пристрій підтримує високу роздільність
    static isHighDPI(): boolean {
        return (window.devicePixelRatio || 1) > 1;
    }

    // Отримати роздільність з урахуванням розміру екрана
    static getAdaptiveResolution(): number {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixels = width * height;

        // На малих екранах можна дозволити більшу роздільність
        if (pixels < 500000) {
            return Math.min(dpr, 3);
        } else if (pixels < 2000000) {
            return Math.min(dpr, 2);
        } else {
            return Math.min(dpr, 1.5);
        }
    }

}