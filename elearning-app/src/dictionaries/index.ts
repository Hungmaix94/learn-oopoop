import 'server-only';

const dictionaries = {
    en: () => import('./en.json').then((module) => module.default),
    vi: () => import('./vi.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
    // Fallback to English if the locale doesn't exist
    if (!dictionaries[locale]) {
        return dictionaries.en();
    }
    return dictionaries[locale]();
};
