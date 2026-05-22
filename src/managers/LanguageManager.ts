import { translations, type Language, type Translations } from './translations';

type LanguageChangeCallback = (language: Language) => void;

export class LanguageManager {
    // Прапори для Assets (назви текстур)
    private static flagNames = ['Ukrainian', 'USA', 'Germany'];
    // Коди мов для перекладів
    private static languageCodes: Language[] = ['ua', 'en', 'de'];
    private static currentIndex = 0;
    private static listeners: LanguageChangeCallback[] = [];


     // Отримати назву поточного прапора (для Assets)
    public static getCurrentFlag(): string {
        return this.flagNames[this.currentIndex];
    }

     // Отримати поточну мову
    public static getCurrentLanguage(): Language {
        return this.languageCodes[this.currentIndex];
    }


     // Перемкнути на наступну мову
    public static switchLanguage(): string {
        this.currentIndex++;

        if (this.currentIndex >= this.flagNames.length) {
            this.currentIndex = 0;
        }

        const newLanguage = this.languageCodes[this.currentIndex];

        // Сповістити всіх слухачів про зміну мови
        this.notifyListeners(newLanguage);

        return this.flagNames[this.currentIndex];
    }

     // Отримати переклад для ключа
    public static t(key: keyof Translations): string {
        const currentLanguage = this.getCurrentLanguage();
        return translations[currentLanguage][key];
    }

     // Підписатися на зміни мови
    public static addListener(callback: LanguageChangeCallback): void {
        this.listeners.push(callback);
    }

     // Відписатися від змін мови
    public static removeListener(callback: LanguageChangeCallback): void {
        const index = this.listeners.indexOf(callback);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

     // Сповістити всіх слухачів про зміну мови
    private static notifyListeners(language: Language): void {
        this.listeners.forEach(callback => callback(language));
    }

     // Очистити всіх слухачів (для cleanup)
    public static clearListeners(): void {
        this.listeners = [];
    }
}