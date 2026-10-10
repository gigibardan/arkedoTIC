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
 * Detects language:
 * 1. Checks URL query param: ?lang=ro or ?lang=en (useful for direct shared links)
 * 2. Checks localStorage for a previously saved choice (manual switch or cached session)
 * 3. Inspects browser preferred languages (navigator.languages / navigator.language):
 *    - If Romanian ('ro', 'ro-RO', 'ro-MD') is present -> defaults to 'ro'
 *    - If anything else (English, French, German, Spanish, etc.) -> defaults to 'en'
 */
function detectInitialLanguage(): { lang: Language; isAuto: boolean } {
  // 1. URL search param has top priority (?lang=ro or ?lang=en)
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang')?.toLowerCase();
      if (urlLang === 'ro' || urlLang === 'en') {
        localStorage.setItem(STORAGE_KEY, urlLang);
        localStorage.setItem(OVERRIDE_KEY, 'true');
        localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
        return { lang: urlLang, isAuto: false };
      }
    } catch {
      // Ignore
    }
  }

  // 2. Saved preference in localStorage (respects any past manual selection)
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ro' || saved === 'en') {
        return { lang: saved, isAuto: false };
      }
    } catch {
      // Ignore
    }
  }

  // 3. Browser Language Detection (navigator.languages / navigator.language)
  if (typeof navigator !== 'undefined') {
    const list: string[] = [];
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      list.push(...navigator.languages);
    }
    if (navigator.language) {
      list.push(navigator.language);
    }
    if ((navigator as any).userLanguage) {
      list.push((navigator as any).userLanguage);
    }

    // Check if Romanian is in the user's preferred browser languages
    const hasRomanian = list.some((item) => {
      if (!item) return false;
      const lower = item.toLowerCase();
      return lower === 'ro' || lower.startsWith('ro-') || lower.startsWith('ro_');
    });

    if (hasRomanian) {
      try {
        localStorage.setItem(STORAGE_KEY, 'ro');
        localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
      } catch {}
      return { lang: 'ro', isAuto: true };
    } else {
      // Anything other than Romanian defaults automatically to English ('en')
      try {
        localStorage.setItem(STORAGE_KEY, 'en');
        localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
      } catch {}
      return { lang: 'en', isAuto: true };
    }
  }

  return { lang: 'ro', isAuto: false };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initial] = useState(() => detectInitialLanguage());
  const [lang, setLangState] = useState<Language>(initial.lang);
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(initial.isAuto);

  // Sync HTML root element lang attribute for SEO and accessibility
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Handle multi-tab storage synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'ro' || e.newValue === 'en')) {
        setLangState(e.newValue);
        setIsAutoDetected(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    setIsAutoDetected(false);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      localStorage.setItem(OVERRIDE_KEY, 'true'); // Marks that user explicitly chose this language
      localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
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
