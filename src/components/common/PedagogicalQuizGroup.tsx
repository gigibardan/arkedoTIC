import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  Trophy,
  Star,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { PedagogicalQuizCard, QuizOption } from './PedagogicalQuizCard';

export interface PedagogicalQuestionData {
  id: string;
  questionRo: string;
  questionEn: string;
  options: QuizOption[];
  maxXP?: number;
  bookPage?: string;
  teacherTipRo?: string;
  teacherTipEn?: string;
  hintRo?: string;
  hintEn?: string;
  categoryLabelRo?: string;
  categoryLabelEn?: string;
}

export interface PedagogicalQuizGroupProps {
  titleRo?: string;
  titleEn?: string;
  descriptionRo?: string;
  descriptionEn?: string;
  questions: PedagogicalQuestionData[];
  cooldownSeconds?: number;
  onCompleteGroup: (totalEarnedXP: number, maxPossibleXP: number, perfectAnswersCount: number) => void;
  className?: string;
  allowInstantNavigation?: boolean;
}

interface AnswerStateItem {
  isCorrect: boolean;
  selectedOptionId: string;
  earnedXP: number;
  attemptsCount: number;
}

export const PedagogicalQuizGroup: React.FC<PedagogicalQuizGroupProps> = ({
  titleRo = 'Test de Verificare a Înțelegerii',
  titleEn = 'Knowledge & Comprehension Check',
  descriptionRo = 'Răspunde atent. Fiecare răspuns greșit activează 5 secunde de reflecție pentru a înțelege conceptul!',
  descriptionEn = 'Answer carefully. Incorrect answers activate a 5-second reflection timer to ensure concept comprehension!',
  questions,
  cooldownSeconds = 5,
  onCompleteGroup,
  className = '',
  allowInstantNavigation = false,
}) => {
  const { lang } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answersState, setAnswersState] = useState<Record<string, AnswerStateItem>>({});
  const [isGroupFinished, setIsGroupFinished] = useState<boolean>(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const answerValues: AnswerStateItem[] = Object.values(answersState);
  const totalMaxXP: number = questions.reduce((sum: number, q) => sum + (q.maxXP || 100), 0);
  const totalEarnedXP: number = answerValues.reduce((sum: number, a: AnswerStateItem) => sum + a.earnedXP, 0);
  const resolvedCount: number = answerValues.filter((a: AnswerStateItem) => a.isCorrect).length;
  const perfectCount: number = answerValues.filter((a: AnswerStateItem) => a.isCorrect && a.attemptsCount === 1).length;

  const handleAnswerSelected = (
    questionId: string,
    isCorrect: boolean,
    optionId: string,
    earnedXP: number,
    attemptsCount: number
  ) => {
    setAnswersState((prev) => ({
      ...prev,
      [questionId]: {
        isCorrect,
        selectedOptionId: optionId,
        earnedXP,
        attemptsCount,
      },
    }));
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsGroupFinished(true);
      sounds.playVictory();
      onCompleteGroup(totalEarnedXP, totalMaxXP, perfectCount);
    }
  };

  const handlePrevQuestion = () => {
    sounds.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleResetGroup = () => {
    sounds.playClick();
    setAnswersState({});
    setCurrentIndex(0);
    setIsGroupFinished(false);
  };

  const currentAnswer = answersState[currentQuestion?.id];
  const isCurrentResolved = currentAnswer?.isCorrect === true;

  if (questions.length === 0) {
    return null;
  }

  // Finished Results View
  if (isGroupFinished) {
    const accuracyPercent = Math.round((totalEarnedXP / (totalMaxXP || 1)) * 100);
    const isMastery = accuracyPercent >= 85;

    return (
      <div
        className={`bg-slate-900/95 border-2 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden animate-fadeIn ${
          isMastery ? 'border-emerald-500/60 shadow-emerald-950/40' : 'border-amber-500/50 shadow-amber-950/40'
        } ${className}`}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-teal-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-3xl mb-4 shadow-inner">
          {isMastery ? '🏆' : '⭐'}
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white font-heading mb-2">
          {lang === 'en' ? 'Check Complete!' : 'Verificare Finalizată cu Succes!'}
        </h3>

        <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
          {isMastery
            ? lang === 'en'
              ? 'Outstanding performance! You grasped the concepts thoroughly.'
              : 'Excelent! Ai demonstrat o înțelegere profundă a conceptelor din manual.'
            : lang === 'en'
              ? 'Good work! Review the questions where you needed extra reflection.'
              : 'Felicitări pentru efort! Conceptele au fost consolidate prin reflecție.'}
        </p>

        {/* Score and Stats Pill Matrix */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6 text-left">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Score' : 'Scor Total'}</div>
            <div className="text-lg font-mono font-black text-amber-300">
              {totalEarnedXP} <span className="text-xs text-slate-400 font-normal">/ {totalMaxXP} XP</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Accuracy' : 'Acuratețe'}</div>
            <div className="text-lg font-mono font-black text-teal-300">{accuracyPercent}%</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'First Try' : 'Fără greșeală'}</div>
            <div className="text-lg font-mono font-black text-emerald-300">
              {perfectCount} <span className="text-xs text-slate-400 font-normal">/ {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleResetGroup}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-600 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Try Again for 100%' : 'Reia Testul pentru 100%'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Coordinator Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white font-heading">
              {lang === 'en' ? titleEn : titleRo}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {lang === 'en' ? descriptionEn : descriptionRo}
          </p>
        </div>

        {/* Progress Matrix */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Progress:' : 'Progres:'}
            </span>
            <span className="text-xs font-mono font-bold text-teal-300">
              {resolvedCount}/{totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono font-bold">{totalEarnedXP} XP</span>
          </div>
        </div>
      </div>

      {/* Question Indicators Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const ans = answersState[q.id];
          const isResolved = ans?.isCorrect === true;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              type="button"
              disabled={!allowInstantNavigation && !isResolved && idx > resolvedCount}
              onClick={() => {
                sounds.playClick();
                setCurrentIndex(idx);
              }}
              className={`flex-1 min-w-[36px] py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed ${
                isCurrent
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 ring-2 ring-teal-400/40'
                  : isResolved
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-70'
              }`}
            >
              <span>{idx + 1}</span>
              {isResolved && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Current Active Quiz Card */}
      {currentQuestion && (
        <PedagogicalQuizCard
          key={currentQuestion.id}
          questionRo={currentQuestion.questionRo}
          questionEn={currentQuestion.questionEn}
          options={currentQuestion.options}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          cooldownSeconds={cooldownSeconds}
          maxXP={currentQuestion.maxXP || 100}
          bookPage={currentQuestion.bookPage}
          teacherTipRo={currentQuestion.teacherTipRo}
          teacherTipEn={currentQuestion.teacherTipEn}
          hintRo={currentQuestion.hintRo}
          hintEn={currentQuestion.hintEn}
          categoryLabelRo={currentQuestion.categoryLabelRo}
          categoryLabelEn={currentQuestion.categoryLabelEn}
          initialSelectedId={currentAnswer?.selectedOptionId}
          onAnswerSelected={(isCorrect, optionId, earnedXP, attemptsCount) =>
            handleAnswerSelected(currentQuestion.id, isCorrect, optionId, earnedXP, attemptsCount)
          }
        />
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={handlePrevQuestion}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          {lang === 'en' ? '← Previous' : '← Înapoi'}
        </button>

        <button
          type="button"
          disabled={!isCurrentResolved}
          onClick={handleNextQuestion}
          className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-teal-950/40 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>
            {currentIndex + 1 === totalQuestions
              ? lang === 'en'
                ? 'Finish Quiz 🎉'
                : 'Finalizează Testul 🎉'
              : lang === 'en'
              ? 'Next Question →'
              : 'Următoarea Întrebare →'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
