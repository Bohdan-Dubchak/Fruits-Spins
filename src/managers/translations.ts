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
    balance: string;
    winMessage: string;
};

export const translations: Record<Language, Translations> = {

    ua: {
        settings: 'НАЛАШТУВАННЯ',
        language: 'Мова',
        screen: 'Екран',
        sound: 'Музика',
        close: 'ЗАКРИТИ',
        exit: 'ЗАКРИТИ',
        menuSettings: 'НАЛАШТУВАННЯ',
        info: 'ІНФОРМАЦІЯ',
        bet: 'Ставка:',
        win: 'Останній виграш:',
        balance: `Баланс: `,

        winMessage: 'ВИГРАШ'
    },

    en: {
        settings: 'SETTINGS',
        language: 'Language',
        screen: 'Screen',
        sound: 'Music',
        close: 'CLOSE',
        exit: 'EXIT',
        menuSettings: 'SETTINGS',
        info: 'Information',
        bet: 'Bet:',
        win: 'Last win:',
        balance: `Balance: `,

        winMessage: 'WIN'
    },

    de: {
        settings: 'EINSTELLUNGEN',
        language: 'Sprache',
        screen: 'Childbirths',
        sound: 'Musik',
        close: 'LIESCHEN',
        exit: 'LIESCHEN',
        menuSettings: 'EINSTELLUNGEN',
        info: 'Information',
        bet: 'Wetten:',
        win: 'Letzter Sieg:',
        balance: 'Gleichgewicht: ',

        winMessage: 'GEWINN',
    }
};