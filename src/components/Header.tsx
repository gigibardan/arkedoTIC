import React from 'react';
import { Volume2, VolumeX, Star, Download, School, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

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
  const { lang, setLang, t } = useLanguage();

  const handleLanguageChange = (newLang: 'ro' | 'en') => {
    sounds.playClick();
    setLang(newLang);
  };

  return (
    <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700/80 sticky top-0 z-40 px-3 sm:px-4 py-2.5 sm:py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo & School Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30 animate-pulse shrink-0">
            🌳
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                <School className="w-3 h-3" /> {t.schoolName}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold hidden sm:inline">
                {t.subjectGrade}
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-black text-white tracking-wide font-heading truncate">
              {t.appTitle}
            </h1>
          </div>
        </div>

        {/* Score, Language Switch & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900/95 p-1 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              onClick={() => handleLanguageChange('ro')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                lang === 'ro'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Română"
            >
              <span>🇷🇴</span>
              <span className="hidden xs:inline">RO</span>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span className="hidden xs:inline">EN</span>
            </button>
          </div>

          {/* Star & Score Pill */}
          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-1.5 sm:gap-2 shadow-inner">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 drop-shadow" />
            <div className="flex items-baseline gap-1">
              <span className="font-black text-amber-300 text-base sm:text-xl font-heading">
                {score}
              </span>
              <span className="text-slate-400 text-[10px] sm:text-xs font-medium">/{maxScore} {t.pts}</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white transition border border-slate-600/50 shadow-sm cursor-pointer"
            title={soundEnabled ? t.soundOn : t.soundOff}
            aria-label={t.soundLabel}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Export standalone index.html button for Teacher */}
          <button
            onClick={onOpenExportModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-teal-200 border border-teal-500/30 text-xs font-bold transition shadow-sm cursor-pointer"
            title="Descarcă / Download standalone index.html"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.offlineBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

