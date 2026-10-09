import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, HardDrive } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { lang } = useLanguage();
  const [showReconnected, setShowReconnected] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setHasBeenOffline(true);
    } else if (hasBeenOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, hasBeenOffline]);

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white shadow-xl shadow-emerald-950/40 border border-emerald-400/40 animate-in slide-in-from-bottom-3 duration-300">
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>
          {lang === 'en'
            ? 'Back online! Syncing progress...'
            : 'Conexiune restabilită! Sincronizare progres...'}
        </span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <aside 
      aria-label="Offline status banner"
      className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center justify-between sm:justify-start gap-3 rounded-2xl bg-slate-900/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-slate-100 shadow-2xl border border-amber-500/50 shadow-amber-950/30 animate-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Offline Mode' : 'Mod Offline Laborator'}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-slate-300 text-[11px] sm:border-l sm:border-slate-700 sm:pl-3">
        <HardDrive className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="truncate max-w-[220px] sm:max-w-none">
          {lang === 'en'
            ? 'All lessons & games running from local cache.'
            : 'Toate lecțiile și arcade-ul rulează din memoria locală.'}
        </span>
      </div>
    </aside>
  );
};
