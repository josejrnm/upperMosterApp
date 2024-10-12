import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import ptTranslation from './locales/pt/translation.json';
import jaTranslation from './locales/jp/translation.json';
import itTranslation from './locales/it/translation.json';
import deTranslation from './locales/de/translation.json';
import koTranslation from './locales/kr/translation.json';
import ruTranslation from './locales/ru/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            es: { translation: esTranslation },
            fr: { translation: frTranslation },
            pt: { translation: ptTranslation },
            jp: { translation: jaTranslation },
            it: { translation: itTranslation },
            de: { translation: deTranslation },
            kr: { translation: koTranslation },
            ru: { translation: ruTranslation },
        },
        lng: 'en', // Idioma por defecto
        fallbackLng: 'en', // Idioma de reserva
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
