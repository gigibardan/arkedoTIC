import React from 'react';
import { Flag, AlertTriangle, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useReportIssue } from '../context/ReportIssueContext';
import { IssueCategory } from '../lib/contactReportService';
import { sounds } from '../utils/audio';

export type ReportIssueButtonVariant =
  | 'header'
  | 'mission'
  | 'inline'
  | 'card'
  | 'drawer'
  | 'footer';

export interface ReportIssueButtonProps {
  variant?: ReportIssueButtonVariant;
  contextLabel?: string;
  missionId?: string | null;
  level?: number | null;
  score?: number | null;
  defaultCategory?: IssueCategory;
  className?: string;
  labelRo?: string;
  labelEn?: string;
  onAfterClick?: () => void;
}

export const ReportIssueButton: React.FC<ReportIssueButtonProps> = ({
  variant = 'inline',
  contextLabel,
  missionId,
  level,
  score,
  defaultCategory,
  className = '',
  labelRo,
  labelEn,
  onAfterClick,
}) => {
  const { lang } = useLanguage();
  const { openReportModal } = useReportIssue();

  const handleClick = () => {
    sounds.playClick();
    openReportModal({
      contextLabel,
      missionId,
      level,
      score,
      defaultCategory,
    });
    onAfterClick?.();
  };

  const defaultText = lang === 'en' ? labelEn || 'Report an issue' : labelRo || 'Raportează o problemă';

  if (variant === 'header') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/35 text-xs font-bold transition cursor-pointer min-h-[36px] touch-manipulation active:scale-95 shrink-0 whitespace-nowrap ${className}`}
        title={
          lang === 'en'
            ? 'Report an issue on this page (URL attached automatically)'
            : 'Raportează o problemă de pe această pagină (URL-ul se atașează automat)'
        }
        aria-label={defaultText}
      >
        <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="hidden xl:inline">{lang === 'en' ? 'Report' : 'Raportează'}</span>
      </button>
    );
  }

  if (variant === 'mission') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/12 hover:bg-amber-500/22 text-amber-200 hover:text-white border border-amber-500/35 text-xs font-bold transition cursor-pointer min-h-[38px] touch-manipulation active:scale-95 shrink-0 whitespace-nowrap ${className}`}
        title={
          lang === 'en'
            ? 'Report a bug or mistake in this mission'
            : 'Raportează o eroare sau o greșeală în această misiune'
        }
      >
        <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{defaultText}</span>
      </button>
    );
  }

  if (variant === 'drawer') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full p-3 rounded-xl bg-amber-500/12 hover:bg-amber-500/20 border border-amber-500/35 text-amber-200 font-bold text-xs flex items-center justify-between gap-2.5 transition text-left cursor-pointer min-h-[48px] ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Flag className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="font-bold truncate">{defaultText}</div>
            <div className="text-[10px] text-amber-200/80 truncate">
              {lang === 'en'
                ? 'Sends directly with current page URL'
                : 'Trimite direct pe email cu linkul paginii curente'}
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-300 shrink-0" />
      </button>
    );
  }

  if (variant === 'footer') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full py-2 min-h-[38px] px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${className}`}
      >
        <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{defaultText}</span>
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`rounded-2xl bg-slate-900/85 border border-slate-800 hover:border-amber-500/40 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${className}`}
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'en'
                ? 'Spotted a bug, typo or broken task on this page?'
                : 'Ai observat o eroare, o greșeală sau un element care nu funcționează?'}
            </p>
            <p className="text-[11px] text-slate-400">
              {lang === 'en'
                ? 'Send a quick report — this page URL and context are linked automatically.'
                : 'Trimite un raport rapid — URL-ul exact al paginii și contextul se atașează automat.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition cursor-pointer shrink-0 whitespace-nowrap shadow-sm active:scale-95"
        >
          <Flag className="w-3.5 h-3.5 shrink-0" />
          <span>{defaultText}</span>
        </button>
      </div>
    );
  }

  // Default: 'inline'
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl bg-slate-800/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-700 hover:border-amber-500/40 text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${className}`}
    >
      <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>{defaultText}</span>
    </button>
  );
};
