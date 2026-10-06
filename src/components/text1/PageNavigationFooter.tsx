import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useHints } from '../../context/HintContext';

interface PageNavigationFooterProps {
  score?: number;
  totalPoints?: number;
  correctCount?: number;
  totalQuestions?: number;
  canProceed?: boolean;
  onProceed?: () => void;
  onRetry?: () => void;
  isLastPage?: boolean;
  currentPage?: number;
  totalPages?: number;
  earnedScore?: number;
  isCompleted?: boolean;
  onNextPage?: () => void;
  nextButtonLabelRo?: string;
  nextButtonLabelEn?: string;
}

export const PageNavigationFooter: React.FC<PageNavigationFooterProps> = ({
  score,
  totalPoints = 100,
  correctCount,
  totalQuestions,
  canProceed,
  onProceed,
  onRetry,
  isLastPage = false,
  currentPage,
  totalPages,
  earnedScore,
  isCompleted,
  onNextPage,
  nextButtonLabelRo,
  nextButtonLabelEn,
}) => {
  const { lang } = useLanguage();
  const { hintsCount } = useHints();

  const finalScore = score !== undefined ? score : (earnedScore !== undefined ? earnedScore : 0);
  const isAllowedToProceed = canProceed !== undefined 
    ? canProceed 
    : isCompleted !== undefined 
    ? isCompleted 
    : true;

  const handleAdvance = () => {
    if (onProceed) {
      onProceed();
    } else if (onNextPage) {
      onNextPage();
    }
  };

  const finalIsLast = isLastPage || (currentPage !== undefined && totalPages !== undefined && currentPage >= totalPages);

  const hasQuestions = totalQuestions !== undefined && totalQuestions > 0;
  const cCount = correctCount !== undefined ? correctCount : (isAllowedToProceed ? 1 : 0);
  const qCount = hasQuestions ? totalQuestions : 1;
  const percent = hasQuestions ? Math.round((cCount / qCount) * 100) : (isAllowedToProceed ? 100 : (finalScore > 0 ? 100 : 0));
  const isPerfect = isAllowedToProceed && (!hasQuestions || cCount === qCount);
  const hasMistakes = !isAllowedToProceed || (hasQuestions && cCount < qCount);

  let buttonText = finalIsLast
    ? (lang === 'en' ? 'Complete Mission 🏆' : 'Finalizează Misiunea 🏆')
    : (lang === 'en' ? 'Next Page' : 'Pagina Următoare');

  if (lang === 'en' && nextButtonLabelEn) {
    buttonText = nextButtonLabelEn;
  } else if (lang === 'ro' && nextButtonLabelRo) {
    buttonText = nextButtonLabelRo;
  }

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
                {hasQuestions ? (
                  <span className={isPerfect ? 'text-emerald-400' : hasMistakes ? 'text-amber-400' : 'text-slate-300'}>
                    {cCount} / {qCount} {lang === 'en' ? 'correct' : 'corecte'} ({percent}%)
                  </span>
                ) : (
                  <span className={isAllowedToProceed ? 'text-emerald-400' : 'text-amber-400'}>
                    {isAllowedToProceed
                      ? (lang === 'en' ? 'Activity Completed' : 'Activitate Finalizată')
                      : (lang === 'en' ? 'In Progress' : 'În Curs de Rezolvare')}
                  </span>
                )}
                <span className="text-slate-500 text-xs ml-2">
                  • +{finalScore} / {totalPoints} {lang === 'en' ? 'pts' : 'pct'}
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
                ? (lang === 'en' ? '0 hints used' : '0 indicii folosite')
                : (lang === 'en'
                    ? `Used ${hintsCount} hint${hintsCount === 1 ? '' : 's'}`
                    : `Ai folosit ${hintsCount} indici${hintsCount === 1 ? 'u' : 'i'}`)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <div className="text-xs text-slate-400">
          {!isAllowedToProceed ? (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              ⚠️ {lang === 'en' ? 'Complete the interactive activity or answer the questions to advance!' : 'Completează activitatea practică sau răspunde la întrebări pentru a debloca pagina următoare!'}
            </span>
          ) : hasMistakes ? (
            <span className="text-amber-300/90 font-medium">
              💡 {lang === 'en' ? 'Learning by doing: you can advance or retry anytime!' : 'Învățăm practic: poți trece mai departe sau reîncerca oricând!'}
            </span>
          ) : (
            <span className="text-emerald-400 font-medium">
              🌟 {lang === 'en' ? 'Great skill demonstrated! Keep going!' : 'Excelentă stăpânire a noțiunilor! Continuă!'}
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
            disabled={!isAllowedToProceed}
            onClick={handleAdvance}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg cursor-pointer ${
              isAllowedToProceed
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black shadow-blue-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
