import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  applyPendingAppUpdate,
  dismissPendingAppUpdateForNow,
  subscribeAppUpdate,
} from '../../utils/appUpdater';

export const UpdateToast: React.FC = () => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const [pendingVersion, setPendingVersion] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    return subscribeAppUpdate((version) => {
      setPendingVersion(version);
    });
  }, []);

  if (!pendingVersion) return null;

  const handleUpdateNow = async () => {
    setIsUpdating(true);
    await applyPendingAppUpdate();
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label={isEn ? 'App update available' : 'Actualizare aplicație disponibilă'}
      className="fixed bottom-20 md:bottom-5 left-3 right-3 sm:left-5 sm:right-auto sm:max-w-sm z-50 rounded-xl bg-slate-900 border border-emerald-500/50 shadow-2xl p-3.5 text-slate-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-bold text-emerald-300">
            {isEn ? 'New ArkyEdu version ready' : 'Versiune nouă ArkyEdu disponibilă'}
          </p>
          <p className="text-xs text-slate-300 leading-snug">
            {isEn
              ? 'Update when you finish your current exercise to load the latest lessons and fixes.'
              : 'Actualizează după ce termini exercițiul curent pentru a încărca ultimele lecții și îmbunătățiri.'}
          </p>
        </div>
        <button
          type="button"
          onClick={dismissPendingAppUpdateForNow}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          aria-label={isEn ? 'Dismiss update notice' : 'Ascunde notificarea de actualizare'}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={dismissPendingAppUpdateForNow}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isEn ? 'Later' : 'Mai târziu'}
        </button>
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => {
            void handleUpdateNow();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>{isUpdating ? (isEn ? 'Updating...' : 'Se actualizează...') : (isEn ? 'Update now' : 'Actualizează acum')}</span>
        </button>
      </div>
    </aside>
  );
};
