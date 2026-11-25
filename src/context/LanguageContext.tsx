import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { translations, TranslationKeys } from '../i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationKeys;
  isAutoDetected: boolean;
}

const STORAGE_KEY = 'arkedo_lang';
const OVERRIDE_KEY = 'arkedo_lang_manual_override';
const TIMESTAMP_KEY = 'arkedo_lang_timestamp';

/**
 * Strict URL-based language detection (SEO-first, zero browser/navigator sniffing):
 * 1. Explicit English routes (/en/, /blog/en/, /glosar/en/, /fise/en/, /sandbox/en/, /leonida/en/, /laborator-ai/en/, /laborator-algoritmi/en/, etc.) -> 'en'
 * 2. Legacy explicit query param (?lang=ro or ?lang=en) for backward-compatible deep links
 * 3. Default strictly to 'ro' on https://www.arkyedu.com/ and all non-/en/ routes
 */
export function detectLanguageFromLocation(): Language | null {
  if (typeof window === 'undefined') return null;
  const { pathname, search } = window.location;

  if (
    /^\/en(\/|$)/i.test(pathname) ||
    /^\/(blog|glosar|fise|sandbox|leonida|laborator-ai|laborator-algoritmi|arcade|duel|oras|profesor|city)\/en(\/|$)/i.test(pathname) ||
    /^\/(arcade\/vice-leonida-gta6|duel\/vice-leonida-1v1)\/en(\/|$)/i.test(pathname)
  ) {
    return 'en';
  }

  try {
    const params = new URLSearchParams(search);
    const urlLang = params.get('lang')?.toLowerCase();
    if (urlLang === 'en') return 'en';
    if (urlLang === 'ro') return 'ro';
  } catch {
    // Ignore malformed query strings
  }

  if (
    pathname === '/' ||
    pathname === '/index.html' ||
    /^\/(blog|glosar|fise|sandbox|leonida|laborator-ai|laborator-algoritmi|arcade|duel|oras|profesor|city)(\/|$)/i.test(pathname)
  ) {
    return 'ro';
  }

  return null;
}

function detectInitialLanguage(): { lang: Language; isAuto: boolean } {
  const fromUrl = detectLanguageFromLocation();
  if (fromUrl) {
    return { lang: fromUrl, isAuto: false };
  }
  return { lang: 'ro', isAuto: false };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initial] = useState(() => detectInitialLanguage());
  const [lang, setLangState] = useState<Language>(initial.lang);
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);

  // Sync HTML root element lang attribute for SEO and accessibility
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Keep React language aligned when the user navigates Back/Forward via browser history
  useEffect(() => {
    const syncWithBrowserLocation = () => {
      const detected = detectLanguageFromLocation();
      if (detected) {
        setLangState(detected);
        setIsAutoDetected(false);
      }
    };
    window.addEventListener('popstate', syncWithBrowserLocation);
    return () => window.removeEventListener('popstate', syncWithBrowserLocation);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    setIsAutoDetected(false);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      localStorage.setItem(OVERRIDE_KEY, 'true');
      localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleLang = useCallback(() => {
    const nextLang = lang === 'ro' ? 'en' : 'ro';
    setLang(nextLang);
  }, [lang, setLang]);

  const t = translations[lang] as unknown as TranslationKeys;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isAutoDetected }}>
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
