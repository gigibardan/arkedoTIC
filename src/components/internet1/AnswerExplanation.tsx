import React from 'react';
import { CheckCircle2, Lightbulb, Sparkles, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface AnswerExplanationProps {
  isCorrect: boolean | null;
  explanationRo: string;
  explanationEn: string;
  selectedLabelRo?: string;
  selectedLabelEn?: string;
  customBadgeRo?: string;
  customBadgeEn?: string;
  className?: string;
}

export const AnswerExplanation: React.FC<AnswerExplanationProps> = ({
  isCorrect,
  explanationRo,
  explanationEn,
  selectedLabelRo,
  selectedLabelEn,
  customBadgeRo,
  customBadgeEn,
  className = '',
}) => {
  const { lang } = useLanguage();

  if (isCorrect === null || isCorrect === undefined) {
    return null;
  }

  return (
    <div
      className={`mt-3 p-3.5 rounded-2xl border transition-all duration-300 animate-fadeIn ${
        isCorrect
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
      } ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5">
          {isCorrect ? (
            <div className="w-6 h-6 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-sm">
              <Lightbulb className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 text-xs leading-relaxed">
          {/* Pill Badge */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {isCorrect ? (
                <>
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {customBadgeRo && customBadgeEn
                    ? (lang === 'en' ? customBadgeEn : customBadgeRo)
                    : (lang === 'en' ? 'Spot on!' : 'Explicație & De ce e corect:')}
                </>
              ) : (
                <>
                  <HelpCircle className="w-3 h-3 text-amber-400" />
                  {customBadgeRo && customBadgeEn
                    ? (lang === 'en' ? customBadgeEn : customBadgeRo)
                    : (lang === 'en' ? 'Learning Pill:' : 'Pilulă educativă:')}
                </>
              )}
            </span>

            {selectedLabelRo && (
              <span className="text-[11px] text-slate-400 italic">
                {lang === 'en' ? `(Selected: ${selectedLabelEn || selectedLabelRo})` : `(Opțiune aleasă: ${selectedLabelRo})`}
              </span>
            )}
          </div>

          {/* Explanation Text */}
          <p className="text-slate-200 text-xs sm:text-[13px] font-medium leading-relaxed">
            {lang === 'en' ? explanationEn : explanationRo}
          </p>
        </div>
      </div>
    </div>
  );
};
