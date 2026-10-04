import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  Sparkles,
  HelpCircle,
  Lock,
  Award,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';

export interface QuizOption {
  id: string;
  labelRo: string;
  labelEn: string;
  isCorrect: boolean;
  explanationRo: string;
  explanationEn: string;
  icon?: string | React.ReactNode;
}

export interface PedagogicalQuizCardProps {
  questionRo: string;
  questionEn: string;
  options: QuizOption[];
  questionNumber?: number;
  totalQuestions?: number;
  cooldownSeconds?: number; // Default: 5 seconds
  maxXP?: number; // Default: 100 XP
  bookPage?: string;
  teacherTipRo?: string;
  teacherTipEn?: string;
  hintRo?: string;
  hintEn?: string;
  categoryLabelRo?: string;
  categoryLabelEn?: string;
  onAnswerSelected?: (isCorrect: boolean, optionId: string, earnedXP: number, attemptsCount: number) => void;
  disabled?: boolean;
  initialSelectedId?: string;
  className?: string;
}

export const PedagogicalQuizCard: React.FC<PedagogicalQuizCardProps> = ({
  questionRo,
  questionEn,
  options,
  questionNumber,
  totalQuestions,
  cooldownSeconds = 5,
  maxXP = 100,
  bookPage,
  teacherTipRo,
  teacherTipEn,
  hintRo,
  hintEn,
  categoryLabelRo,
  categoryLabelEn,
  onAnswerSelected,
  disabled = false,
  initialSelectedId,
  className = '',
}) => {
  const { lang } = useLanguage();

  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId || null);
  const [attempts, setAttempts] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from props if answered before
  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId);
      const opt = options.find((o) => o.id === initialSelectedId);
      if (opt?.isCorrect) {
        setIsResolved(true);
      }
    }
  }, [initialSelectedId, options]);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = (secs: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCooldown(secs);

    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const calculateXP = (attemptsCount: number): number => {
    if (attemptsCount === 1) return maxXP;
    if (attemptsCount === 2) return Math.round(maxXP * 0.6);
    return Math.round(maxXP * 0.3);
  };

  const handleOptionClick = (option: QuizOption) => {
    if (disabled || isResolved || cooldown > 0) return;

    sounds.playClick();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSelectedId(option.id);

    if (option.isCorrect) {
      setIsResolved(true);
      sounds.playCorrect();
      const earned = calculateXP(newAttempts);
      onAnswerSelected?.(true, option.id, earned, newAttempts);
    } else {
      sounds.playWrong();
      startCooldown(cooldownSeconds);
      onAnswerSelected?.(false, option.id, 0, newAttempts);
    }
  };

  const selectedOption = options.find((o) => o.id === selectedId);
  const earnedXP = isResolved ? calculateXP(attempts) : 0;

  return (
    <div
      className={`bg-slate-900/90 border-2 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300 ${
        isResolved
          ? 'border-emerald-500/60 shadow-emerald-950/20'
          : cooldown > 0
          ? 'border-rose-500/50 shadow-rose-950/20'
          : 'border-slate-700/80 hover:border-slate-600'
      } ${className}`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {questionNumber !== undefined && (
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-mono font-bold border border-teal-500/40">
              {lang === 'en'
                ? `Question ${questionNumber}${totalQuestions ? ` of ${totalQuestions}` : ''}`
                : `Întrebarea ${questionNumber}${totalQuestions ? ` din ${totalQuestions}` : ''}`}
            </span>
          )}

          {categoryLabelRo && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
              {lang === 'en' ? categoryLabelEn || categoryLabelRo : categoryLabelRo}
            </span>
          )}

          {bookPage && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{lang === 'en' ? `Textbook p. ${bookPage}` : `Manual pag. ${bookPage}`}</span>
            </span>
          )}
        </div>

        {/* Accuracy Score Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isResolved ? (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 animate-bounce">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>+{earnedXP} XP</span>
              {attempts === 1 && (
                <span className="hidden sm:inline text-[10px] text-amber-300 font-bold ml-1">
                  ⭐ {lang === 'en' ? 'PERFECT' : 'FĂRĂ GREȘEALĂ'}
                </span>
              )}
            </div>
          ) : (
            <div className="text-[11px] font-mono text-slate-400">
              <span>{lang === 'en' ? 'Max:' : 'Valoare:'}</span>{' '}
              <span className="font-bold text-amber-300">{maxXP} XP</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Prompt */}
      <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-snug mb-4">
        {lang === 'en' ? questionEn : questionRo}
      </h3>

      {/* Optional Hint Button */}
      {(hintRo || hintEn) && !isResolved && (
        <div className="mb-3.5">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowHint(!showHint);
            }}
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition font-medium cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? (lang === 'en' ? 'Hide hint' : 'Ascunde indiciul') : (lang === 'en' ? 'Need a hint?' : 'Ai nevoie de un indiciu?')}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 leading-relaxed animate-fadeIn">
              💡 {lang === 'en' ? hintEn || hintRo : hintRo}
            </div>
          )}
        </div>
      )}

      {/* Cooldown Reflection Banner (Lockout Buffer) */}
      {cooldown > 0 && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex flex-col gap-2 animate-fadeIn shadow-lg shadow-rose-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
              <Clock className="w-4 h-4 animate-spin" />
              <span>
                {lang === 'en'
                  ? `Reflection Buffer: Available in ${cooldown}s`
                  : `Timp de reflecție: Deblocare în ${cooldown} secunde`}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-black border border-rose-500/40">
              ⏳ {cooldown}s
            </span>
          </div>

          <p className="text-[11px] text-rose-200/90 leading-tight">
            {lang === 'en'
              ? '⚠️ Please read the explanation below to understand why this option is incorrect before trying again!'
              : '⚠️ Citește cu atenție explicația de mai jos pentru a înțelege de ce varianta aleasă nu este corectă!'}
          </p>

          {/* Progress Bar of Cooldown */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(cooldown / cooldownSeconds) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((option, idx) => {
          const isSelected = selectedId === option.id;
          const showCorrectState = isResolved && option.isCorrect;
          const showWrongState = isSelected && !option.isCorrect;
          const isLocked = cooldown > 0 || disabled || (isResolved && !option.isCorrect);

          let buttonClasses = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-teal-500/50 hover:bg-slate-800/80';
          if (showCorrectState) {
            buttonClasses = 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400';
          } else if (showWrongState) {
            buttonClasses = 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-400';
          } else if (isLocked) {
            buttonClasses = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60 cursor-not-allowed';
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isLocked || isResolved}
              onClick={() => handleOptionClick(option)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-start justify-between gap-3 group relative cursor-pointer disabled:cursor-not-allowed ${buttonClasses}`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0 group-hover:border-teal-400">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-snug break-words">
                  {lang === 'en' ? option.labelEn : option.labelRo}
                </span>
              </div>

              {/* Status Icons */}
              <div className="shrink-0 mt-0.5">
                {showCorrectState ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-scaleUp" />
                ) : showWrongState ? (
                  <XCircle className="w-5 h-5 text-rose-400 animate-shake" />
                ) : isLocked && cooldown > 0 ? (
                  <Lock className="w-4 h-4 text-slate-500" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pedagogical Explanation Box */}
      {selectedOption && (
        <div
          className={`mt-4 p-4 rounded-2xl border transition-all duration-300 animate-fadeIn ${
            selectedOption.isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {selectedOption.isCorrect ? (
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-sm">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 text-xs leading-relaxed">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    selectedOption.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {selectedOption.isCorrect ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      {lang === 'en' ? 'Correct Concept!' : 'Explicație & De ce este corect:'}
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                      {lang === 'en' ? 'Why this is incorrect:' : 'De ce nu este corect:'}
                    </>
                  )}
                </span>

                <span className="text-[11px] text-slate-400 italic">
                  {lang === 'en'
                    ? `(Selected: ${selectedOption.labelEn})`
                    : `(Opțiune aleasă: ${selectedOption.labelRo})`}
                </span>
              </div>

              <p className="text-slate-200 text-xs sm:text-[13px] font-medium leading-relaxed">
                {lang === 'en' ? selectedOption.explanationEn : selectedOption.explanationRo}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Tip component (if provided) */}
      {(teacherTipRo || teacherTipEn) && isResolved && (
        <div className="mt-3 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong className="text-indigo-300 font-semibold">{lang === 'en' ? 'Teacher Tip: ' : 'Sfatul Profesorului: '}</strong>
            {lang === 'en' ? teacherTipEn || teacherTipRo : teacherTipRo}
          </span>
        </div>
      )}
    </div>
  );
};
