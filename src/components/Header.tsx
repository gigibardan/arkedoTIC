import React from 'react';
import { Volume2, VolumeX, Sparkles, Star, Download, School } from 'lucide-react';

interface HeaderProps {
  score: number;
  maxScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  maxScore,
  soundEnabled,
  onToggleSound,
  onOpenExportModal,
}) => {
  return (
    <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700/80 sticky top-0 z-40 px-4 py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & School Badge */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30 animate-pulse">
            🌳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                <School className="w-3 h-3" /> Școala ARKEDO
              </span>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                Informatică • Clasa a V-a
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-wide font-heading">
              Misiunea Arborele Secret
            </h1>
          </div>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Star & Score Pill */}
          <div className="bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-2 shadow-inner">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow" />
            <div className="flex items-baseline gap-1">
              <span className="font-black text-amber-300 text-lg sm:text-xl font-heading">
                {score}
              </span>
              <span className="text-slate-400 text-xs font-medium">/{maxScore} pct</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white transition border border-slate-600/50 shadow-sm"
            title={soundEnabled ? 'Oprește sunetul' : 'Pornește sunetul'}
            aria-label="Comutator sunet"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Export standalone index.html button for Teacher */}
          <button
            onClick={onOpenExportModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-teal-200 border border-teal-500/30 text-xs font-bold transition shadow-sm"
            title="Descarcă fișierul autonom index.html pentru clasa ta"
          >
            <Download className="w-3.5 h-3.5" />
            <span>index.html Offline</span>
          </button>
        </div>
      </div>
    </header>
  );
};
