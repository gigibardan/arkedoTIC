import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, TranslationKeys } from '../i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('arkedo_lang');
    return saved === 'en' ? 'en' : 'ro';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('arkedo_lang', newLang);
  };

  const toggleLang = () => {
    const nextLang = lang === 'ro' ? 'en' : 'ro';
    setLang(nextLang);
  };

  const t = translations[lang] as unknown as TranslationKeys;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
