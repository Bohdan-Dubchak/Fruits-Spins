import {translations, type Language, type Translations} from './translations';

type LanguageChangeCallback = (language: Language) => void;

export class LanguageManager {
    private static flagNames = ['USA', 'Germany', 'Ukrainian'];
    private static languageCodes: Language[] = ['en', 'de', 'ua'];
    private static currentIndex = 0;
    private static listeners: LanguageChangeCallback[] = [];

    public static getCurrentFlag(): string {
        return this.flagNames[this.currentIndex];
    }

    public static getCurrentLanguage(): Language {
        return this.languageCodes[this.currentIndex];
    }

    public static switchLanguage(): string {
        this.currentIndex++;

        if (this.currentIndex >= this.flagNames.length) {
            this.currentIndex = 0;
        }

        const newLanguage = this.languageCodes[this.currentIndex];

        this.notifyListeners(newLanguage);

        return this.flagNames[this.currentIndex];
    }

    public static t(key: keyof Translations): string {
        const currentLanguage = this.getCurrentLanguage();
        return translations[currentLanguage][key];
    }

    public static addListener(callback: LanguageChangeCallback): void {
        this.listeners.push(callback);
    }

    public static removeListener(callback: LanguageChangeCallback): void {
        const index = this.listeners.indexOf(callback);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    private static notifyListeners(language: Language): void {
        this.listeners.forEach(callback => callback(language));
    }

    public static clearListeners(): void {
        this.listeners = [];
    }
}