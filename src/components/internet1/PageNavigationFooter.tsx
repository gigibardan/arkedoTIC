import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useHints } from '../../context/HintContext';

interface PageNavigationFooterProps {
  score: number;
  totalPoints: number;
  correctCount: number;
  totalQuestions: number;
  canProceed?: boolean;
  onProceed: () => void;
  onRetry?: () => void;
  isLastPage?: boolean;
}

export const PageNavigationFooter: React.FC<PageNavigationFooterProps> = ({
  score,
  totalPoints,
  correctCount,
  totalQuestions,
  canProceed = true,
  onProceed,
  onRetry,
  isLastPage = false,
}) => {
  const { lang } = useLanguage();
  const { hintsCount } = useHints();
  const percent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
  const isPerfect = correctCount === totalQuestions && totalQuestions > 0;
  const hasMistakes = correctCount < totalQuestions && totalQuestions > 0;

  return (
    <div className="mt-8 pt-5 border-t border-slate-700/80 flex flex-col gap-3 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
      {/* Upper info row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        {/* Live score feedback badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            {isPerfect ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {lang === 'en' ? 'Page Evaluation:' : 'Evaluare Pagină Curentă:'}
              </div>
              <div className="text-sm font-bold font-mono">
                <span className={isPerfect ? 'text-emerald-400' : hasMistakes ? 'text-amber-400' : 'text-slate-300'}>
                  {correctCount} / {totalQuestions} {lang === 'en' ? 'correct' : 'corecte'} ({percent}%)
                </span>
                <span className="text-slate-500 text-xs ml-2">
                  • +{score} / {totalPoints} {lang === 'en' ? 'pts' : 'pct'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hint Tracking Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold border ${
              hintsCount === 0
                ? 'bg-slate-900 text-slate-400 border-slate-700'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <Lightbulb className={`w-3.5 h-3.5 ${hintsCount > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>
              {hintsCount === 0
                ? (lang === 'en' ? '0 hints used so far' : '0 indicii folosite până acum')
                : (lang === 'en'
                    ? `Ai folosit ${hintsCount} indici${hintsCount === 1 ? 'u' : 'i'}`
                    : `Ai folosit ${hintsCount} indici${hintsCount === 1 ? 'u' : 'i'}`)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <div className="text-xs text-slate-400">
          {hasMistakes ? (
            <span className="text-amber-300/90 font-medium">
              💡 {lang === 'en' ? 'Learning by playing: you can advance or retry anytime!' : 'Învățăm jucându-ne: poți trece mai departe sau reîncerca oricând!'}
            </span>
          ) : (
            <span className="text-emerald-400 font-medium">
              🌟 {lang === 'en' ? 'Great progress! Keep going!' : 'Excelent progres! Continuă explorarea!'}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {onRetry && hasMistakes && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'en' ? 'Reset Page' : 'Resetează Pagina'}</span>
            </button>
          )}

          <button
            type="button"
            disabled={!canProceed}
            onClick={onProceed}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg cursor-pointer ${
              canProceed
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black shadow-teal-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>
              {isLastPage
                ? (lang === 'en' ? 'Complete Mission 3A 🏆' : 'Finalizează Misiunea 3A 🏆')
                : (lang === 'en' ? 'Next Page' : 'Pagina Următoare')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

