import React from 'react';
import { Lightbulb, BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TeacherTipProps {
  title: string;
  tip: string;
  bookPage?: string;
  extraAdvice?: string;
}

export const TeacherTip: React.FC<TeacherTipProps> = ({
  title,
  tip,
  bookPage,
  extraAdvice,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-cyan-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-5 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold shadow-sm">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            {t.teacherTipBadge}
          </span>
        </div>
        {bookPage && (
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.bookPagePrefix} {bookPage}</span>
          </div>
        )}
      </div>

      <h4 className="text-sm sm:text-base font-black text-white font-heading tracking-wide">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed">
        {tip}
      </p>

      {extraAdvice && (
        <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-start gap-2 text-xs text-emerald-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>{t.rememberLabel}</strong> {extraAdvice}
          </span>
        </div>
      )}
    </div>
  );
};

