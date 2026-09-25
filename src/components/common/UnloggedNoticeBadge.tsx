import React, { useState, useEffect } from 'react';
import { AlertCircle, X, LogIn, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getActiveStudent } from '../../lib/studentAuthService';

interface UnloggedNoticeBadgeProps {
  studentName?: string;
  onNavigateToAuth?: () => void;
  className?: string;
}

export const UnloggedNoticeBadge: React.FC<UnloggedNoticeBadgeProps> = ({
  studentName,
  onNavigateToAuth,
  className = '',
}) => {
  const { lang } = useLanguage();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('arkedo_unlogged_badge_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [isLogged, setIsLogged] = useState<boolean>(() => {
    const student = getActiveStudent();
    return !!(student && student.id);
  });

  useEffect(() => {
    const student = getActiveStudent();
    setIsLogged(!!(student && student.id));
  }, [studentName]);

  // If user is logged in with an account, do not display
  if (isLogged) return null;

  // If dismissed in this session, do not display
  if (dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem('arkedo_unlogged_badge_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative z-40 flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-amber-950/90 border border-amber-500/50 shadow-lg text-amber-200 text-xs backdrop-blur animate-fade-in ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
          <AlertCircle className="w-3.5 h-3.5" />
        </div>
        <div className="leading-snug">
          <span className="font-bold text-amber-100 mr-1.5">
            {lang === 'en' ? 'Guest session:' : 'Mod Vizitator:'}
          </span>
          <span className="text-amber-200/90">
            {lang === 'en'
              ? 'Scores and XP are saved in the ranking only if you are signed in!'
              : 'Punctajele se salvează în clasament doar dacă ești logat cu un cont!'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {onNavigateToAuth && (
          <button
            type="button"
            onClick={onNavigateToAuth}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition cursor-pointer flex items-center gap-1"
          >
            <LogIn className="w-3 h-3" />
            <span>{lang === 'en' ? 'Log in' : 'Loghează-te'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-md text-amber-400 hover:text-white hover:bg-amber-800/50 transition cursor-pointer"
          title={lang === 'en' ? 'Dismiss' : 'Închide'}
          aria-label={lang === 'en' ? 'Dismiss warning' : 'Închide notificarea'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
