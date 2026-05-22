export type Language = 'ua' | 'en' | 'de';

export type Translations = {
    settings: string;
    language: string;
    screen: string;
    sound: string;
    close: string;
    exit: string;
    menuSettings: string;
    info: string;
    bet: string;
    win: string;
};

export const translations: Record<Language, Translations> = {

    ua: {
        settings: 'НАЛАШТУВАННЯ',
        language: 'Мова',
        screen: 'Екран',
        sound: 'Звук',
        close: 'ЗАКРИТИ',
        exit: 'ЗАКРИТИ',
        menuSettings: 'НАЛАШТУВАННЯ',
        info: 'ІНФОРМАЦІЯ',
        bet: 'Ставка',
        win: 'Останній виграш'
    },

    en: {
        settings: 'SETTINGS',
        language: 'Language',
        screen: 'Screen',
        sound: 'Sound',
        close: 'CLOSE',
        exit: 'EXIT',
        menuSettings: 'SETTINGS',
        info: 'Information',
        bet: 'bet',
        win: 'Last win'
    },

    de: {
        settings: 'EINSTELLUNGEN',
        language: 'Sprache',
        screen: 'Childbirths',
        sound: 'Ton',
        close: 'LIESCHEN',
        exit: 'LIESCHEN',
        menuSettings: 'EINSTELLUNGEN',
        info: 'Information',
        bet: 'Wetten',
        win: 'Letzter Sieg'
    }
};