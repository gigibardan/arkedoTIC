import React, { useState } from 'react';
import { Trash2, RotateCcw, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { TeacherTip } from './TeacherTip';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { AnswerExplanation } from './common/AnswerExplanation';
import { QuestionHint } from './common/QuestionHint';

interface Level5Props {
  onComplete: () => void;
}

export const Level5_RecycleBin: React.FC<Level5Props> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [binOpen, setBinOpen] = useState<boolean>(false);
  const [hasRestored, setHasRestored] = useState<boolean>(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const handleOpenBin = () => {
    sounds.playClick();
    setBinOpen(!binOpen);
  };

  const handleRestore = () => {
    sounds.playCorrect();
    setHasRestored(true);
    setBinOpen(false);
  };

  const handleQuiz = (ans: string) => {
    setQuizAnswer(ans);
    if (ans === 'yes_recycle_bin') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isLevelCompleted = hasRestored && quizAnswer === 'yes_recycle_bin';

  const handleFinish = () => {
    sounds.playVictory();
    onComplete();
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Title & Mission Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-5">
        <div>
          <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-wider border border-rose-500/30">
            {t.l5Tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
            {t.l5Title}
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {t.l5Desc}
          </p>
        </div>
        <div className="hidden sm:flex text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-rose-400">
          🛡️
        </div>
      </div>

      {/* Teacher Tip from Textbook (p. 29) */}
      <TeacherTip
        title={t.l5TipTitle}
        tip={t.l5TipText}
        bookPage="29"
        extraAdvice={t.l5TipExtra}
      />

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recycle Bin & Desktop Simulator (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              {t.l5DesktopTitle}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              {hasRestored ? t.l5StateSafe : t.l5StateWarn}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Recycle Bin Icon */}
            <div
              onClick={handleOpenBin}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition select-none ${
                !hasRestored
                  ? 'bg-rose-950/30 border-rose-500/70 hover:bg-rose-950/50 shadow-lg animate-pulse'
                  : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-5xl mb-2">🗑️</div>
              <div className="font-bold text-sm text-white font-mono">{t.l5BinName}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {!hasRestored ? t.l5BinHasItem : t.l5BinEmpty}
              </div>
            </div>

            {/* Desktop Restored folder destination */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-center min-h-[140px]">
              {hasRestored ? (
                <div className="animate-fadeIn flex flex-col items-center">
                  <div className="text-5xl mb-2">📁✨</div>
                  <div className="font-bold text-sm text-emerald-300 font-mono">
                    Proiect_Final_ARKEDO
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.l5RestoredSuccess}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  {t.l5RestoreWait}
                </div>
              )}
            </div>
          </div>

          {/* Virtual Window of Recycle Bin */}
          {binOpen && (
            <div className="mt-4 bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono flex items-center gap-1.5 text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" /> {t.l5WindowHeader}
                </span>
                <button
                  onClick={() => setBinOpen(false)}
                  className="text-slate-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
                >
                  {t.l5WindowClose}
                </button>
              </div>

              <div className="p-4">
                {!hasRestored ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📁</span>
                      <div>
                        <div className="font-mono text-xs font-bold text-white">
                          Proiect_Final_ARKEDO
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {t.l5InitialLocation}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRestore}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.l5BtnRestore}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs font-mono">
                    {t.l5WindowEmpty}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quiz from manual page 29 (1 col) */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-heading">
              <HelpCircle className="w-4 h-4" />
              {t.l5QuizTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mb-2 leading-relaxed">
              {t.l5QuizQuestion}
            </p>

            <div className="mb-3">
              <QuestionHint
                id="q-l5-recycle"
                hintRo="Coșul de reciclare (Recycle Bin) stochează temporar fișierele șterse de pe hard disk, permițând restaurarea lor în locația inițială cu comanda 'Restore'."
                hintEn="Recycle Bin temporarily holds deleted files from the hard drive, allowing you to restore them to their original spot via 'Restore'."
              />
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleQuiz('yes_recycle_bin')}
                className={`w-full p-3 rounded-xl border text-xs text-left transition cursor-pointer ${
                  quizAnswer === 'yes_recycle_bin'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-white mb-0.5">
                  {t.l5QuizOptA}
                </div>
                <div className="text-[11px] text-slate-400">
                  {t.l5QuizOptASub}
                </div>
              </button>

              <button
                onClick={() => handleQuiz('no_never')}
                className={`w-full p-3 rounded-xl border text-xs text-left transition cursor-pointer ${
                  quizAnswer === 'no_never'
                    ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-white mb-0.5">{t.l5QuizOptB}</div>
                <div className="text-[11px] text-slate-400">
                  {t.l5QuizOptBSub}
                </div>
              </button>
            </div>

            {quizAnswer && (
              <div className="mt-3">
                <AnswerExplanation
                  isCorrect={quizAnswer === 'yes_recycle_bin'}
                  explanationRo={
                    quizAnswer === 'yes_recycle_bin'
                      ? 'Corect! Fișierele șterse de pe hard disk ajung în Recycle Bin și pot fi recuperate oricând până la golirea coșului (Manual pag. 29).'
                      : 'Incorect! Doar dacă golești Recycle Bin sau ștergi de pe stick USB fișierul este eliminat definitiv.'
                  }
                  explanationEn={
                    quizAnswer === 'yes_recycle_bin'
                      ? 'Correct! Files deleted from hard drives are kept in the Recycle Bin and can be restored at any time until emptied (p. 29).'
                      : 'Incorrect! Files are only permanently lost if you empty the Recycle Bin or delete from removable drives.'
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            {quizAnswer === 'yes_recycle_bin' && hasRestored && (
              <span className="text-emerald-400 font-bold">
                {t.l5AllDoneNote}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400">
          {t.l5RewardText}
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`px-7 py-3 rounded-2xl font-bold font-heading text-sm transition transform flex items-center gap-2 shadow-lg ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 hover:scale-105 cursor-pointer shadow-emerald-500/25'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{t.l5FinishBtn}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

