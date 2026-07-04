import React, { createContext, useContext, useMemo, useState } from 'react';
import en from './locales/en.json';
import te from './locales/te.json';
import { LocaleKey } from './types';

const translations = { en, te };

interface I18nContextType {
  lang: LocaleKey;
  setLang: (lang: LocaleKey) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LocaleKey>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('preferencehub-language') as LocaleKey) ?? 'en';
    }
    return 'en';
  });

  const value = useMemo(
    () => ({
      lang,
      setLang: (newLang: LocaleKey) => {
        setLang(newLang);
        localStorage.setItem('preferencehub-language', newLang);
      },
      t: (key: string, replacements: Record<string, string | number> = {}) => {
        const value = (translations[lang] as Record<string, string>)[key] ?? key;
        return Object.entries(replacements).reduce(
          (text, [placeholder, replacement]) => text.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(replacement)),
          value,
        );
      },
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
