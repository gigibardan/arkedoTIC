import React from 'react';
import { CheckCircle2, Lightbulb, Sparkles, HelpCircle, Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface AnswerExplanationProps {
  isCorrect: boolean | null;
  explanationRo?: string;
  explanationEn?: string;
  explanation?: string; // Fallback single explanation
  ruleReference?: string;
  selectedLabelRo?: string;
  selectedLabelEn?: string;
  customBadgeRo?: string;
  customBadgeEn?: string;
  cooldown?: number; // Optional cooldown timer in seconds
  cooldownMaxSeconds?: number;
  className?: string;
}

export const AnswerExplanation: React.FC<AnswerExplanationProps> = ({
  isCorrect,
  explanationRo,
  explanationEn,
  explanation,
  ruleReference,
  selectedLabelRo,
  selectedLabelEn,
  customBadgeRo,
  customBadgeEn,
  cooldown = 0,
  cooldownMaxSeconds = 5,
  className = '',
}) => {
  const { lang } = useLanguage();

  if (isCorrect === null || isCorrect === undefined) {
    return null;
  }

  const finalExplanation =
    lang === 'en'
      ? explanationEn || explanation || explanationRo || ''
      : explanationRo || explanation || explanationEn || '';

  return (
    <div
      className={`mt-3 p-3.5 rounded-2xl border transition-all duration-300 animate-fadeIn ${
        isCorrect
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
      } ${className}`}
    >
      {/* Optional Cooldown Banner if wrong answer and cooldown > 0 */}
      {!isCorrect && cooldown > 0 && (
        <div className="mb-2.5 pb-2.5 border-b border-rose-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold">
            <Clock className="w-3.5 h-3.5 text-rose-400 animate-spin" />
            <span>
              {lang === 'en'
                ? `Reflection Buffer: Retry in ${cooldown}s`
                : `Timp de reflecție: Reîncercare în ${cooldown}s`}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/40">
            ⏳ {cooldown}s
          </span>
        </div>
      )}

      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5">
          {isCorrect ? (
            <div className="w-6 h-6 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-sm">
              <AlertTriangle className="w-4 h-4" />
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
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
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
                  <HelpCircle className="w-3 h-3 text-rose-400" />
                  {customBadgeRo && customBadgeEn
                    ? (lang === 'en' ? customBadgeEn : customBadgeRo)
                    : (lang === 'en' ? 'Why this is incorrect:' : 'De ce nu este corect:')}
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
            {finalExplanation}
          </p>

          {/* Optional Rule Reference */}
          {ruleReference && (
            <p className="text-[11px] text-indigo-300/90 font-mono mt-1 flex items-center gap-1">
              <span>📖</span>
              <span>{ruleReference}</span>
            </p>
          )}

          {/* Cooldown Progress Bar */}
          {!isCorrect && cooldown > 0 && (
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-1000 ease-linear"
                style={{ width: `${Math.min(100, Math.max(0, (cooldown / cooldownMaxSeconds) * 100))}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
