export class LanguageManager {

    private static languages = [
        'Ukrainian',
        'USA',
        'Germany'
    ];

    private static currentIndex = 0;

    public static getCurrentFlag(): string {
        return this.languages[this.currentIndex];
    }

    public static switchLanguage(): string {

        this.currentIndex++;

        if (this.currentIndex >= this.languages.length) {
            this.currentIndex = 0;
        }

        return this.languages[this.currentIndex];
    }
}