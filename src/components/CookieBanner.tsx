import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface CookieBannerProps {
  onOpenCookiePolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenCookiePolicy }) => {
  const { lang, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('arkyedu_cookie_consent');
      if (!consent) {
        // Small delay to prevent layout pop
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleAcceptAll = () => {
    sounds.playClick();
    try {
      localStorage.setItem('arkyedu_cookie_consent', 'all');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    } catch (e) {
      console.warn(e);
    }
    setIsVisible(false);
  };

  const handleOnlyEssential = () => {
    sounds.playClick();
    try {
      localStorage.setItem('arkyedu_cookie_consent', 'essential');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    } catch (e) {
      console.warn(e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Notificare privind modulele cookie"
      className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-xl z-40 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/60 text-slate-100 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                {t.cookieBannerTitle || 'Respectăm Confidențialitatea Elevilor și Profesorilor'}
              </h4>
              <span className="text-[10px] text-emerald-400 font-medium">
                100% Gratuit • Fără Reclame • Non-Profit
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              handleOnlyEssential();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Închide și acceptă doar esențiale"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-xs leading-relaxed">
          {t.cookieBannerDesc ||
            'ArkyEdu este un proiect educațional 100% gratuit creat din pasiune. Nu stocăm date personale sensibile, nu vindem date și nu difuzăm reclame. Folosim doar memorie locală tehnică pentru progres și statistici anonime Google Analytics pentru îmbunătățirea lecțiilor.'}
        </p>

        {/* Buttons row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCookiePolicy();
            }}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold underline decoration-teal-500/40 flex items-center gap-1 py-1"
          >
            <SlidersHorizontal className="w-3 h-3" />
            {t.cookiePreferences || 'Personalizează'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOnlyEssential}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              {t.cookieOnlyEssential || 'Doar Esențiale'}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20 cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              {t.cookieAcceptAll || 'Acceptă Toate'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
