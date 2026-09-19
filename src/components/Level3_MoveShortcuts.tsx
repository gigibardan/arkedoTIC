import React, { useState } from 'react';
import { Scissors, Clipboard, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { TeacherTip } from './TeacherTip';
import { sounds } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { useArky } from '../context/ArkyContext';
import { AnswerExplanation } from './common/AnswerExplanation';
import { QuestionHint } from './common/QuestionHint';

interface Level3Props {
  onComplete: () => void;
}

export const Level3_MoveShortcuts: React.FC<Level3Props> = ({ onComplete }) => {
  const { t, lang } = useLanguage();
  const arky = useArky();
  const [isCut, setIsCut] = useState<boolean>(false);
  const [isMoved, setIsMoved] = useState<boolean>(false);
  const [forbiddenQuiz, setForbiddenQuiz] = useState<string | null>(null);

  const handleCut = () => {
    sounds.playClick();
    setIsCut(true);
  };

  const handlePaste = () => {
    if (!isCut) return;
    sounds.playCorrect();
    setIsMoved(true);
    arky.triggerSuccess();
  };

  const handleQuizAnswer = (ans: string) => {
    setForbiddenQuiz(ans);
    if (ans === 'valid_name') {
      sounds.playCorrect();
      arky.triggerSuccess();
    } else {
      sounds.playWrong();
      arky.triggerError();
    }
  };

  const isLevelCompleted = isMoved && forbiddenQuiz === 'valid_name';

  const handleFinish = () => {
    sounds.playLevelUp();
    onComplete();
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Title & Mission Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-5">
        <div>
          <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs uppercase tracking-wider border border-cyan-500/30">
            {t.l3Tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
            {t.l3Title}
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            {t.l3Desc}
          </p>
        </div>
        <div className="hidden sm:flex text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-cyan-400">
          ⚡️
        </div>
      </div>

      {/* Teacher Tip from Textbook (p. 28 & 30) */}
      <TeacherTip
        title={t.l3TipTitle}
        tip={t.l3TipText}
        bookPage={lang === 'en' ? '28 & 30' : '28 și 30'}
        extraAdvice={t.l3TipExtra}
      />

      {/* Simulator: Interactive Cut and Paste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Source: Desktop */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {t.l3SourceTitle}
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">{t.l3OneElement}</span>
            </div>

            {!isMoved ? (
              <div
                className={`p-4 rounded-xl border transition flex items-center justify-between ${
                  isCut
                    ? 'bg-slate-800/40 border-dashed border-cyan-500/50 opacity-60'
                    : 'bg-slate-800 border-cyan-500/40 shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-2xl border border-cyan-500/30">
                    🎮
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      super_mario.exe
                      {isCut && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                          {t.l3InClipboard}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {lang === 'en' ? 'Size: 15.4 MB • Application' : 'Dimensiune: 15.4 MB • Aplicație'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                {t.l3CutSuccess}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={handleCut}
              disabled={isCut || isMoved}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-2 cursor-pointer ${
                isCut || isMoved
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/50 shadow hover:border-cyan-400'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>{isCut ? t.l3BtnCutDone : t.l3BtnCut}</span>
            </button>
          </div>
        </div>

        {/* Destination: Jocuri Folder */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {t.l3DestTitle}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                {isMoved ? t.l3OneElement : t.l3EmptyFolder}
              </span>
            </div>

            {isMoved ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/80 shadow-lg flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-2xl border border-emerald-500/40">
                    🎮
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      super_mario.exe
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-emerald-300/80">
                      {lang === 'en' ? '/Secret Base/Games/' : '/Baza Secreta/Jocuri/'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                {t.l3PasteWait}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={handlePaste}
              disabled={!isCut || isMoved}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-2 ${
                !isCut || isMoved
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 cursor-pointer animate-pulse'
              }`}
            >
              <Clipboard className="w-4 h-4" />
              <span>{isMoved ? t.l3BtnPasteDone : t.l3BtnPaste}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Page 30 Exercise 3: Forbidden Characters Quiz */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2 font-heading">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          {t.l3QuizTitle}
        </h3>
        <p className="text-xs text-slate-300 mb-2">
          {t.l3QuizQuestion}
        </p>

        <div className="mb-3">
          <QuestionHint
            id="q-l3-forbidden"
            hintRo="Semnele < > (paranteze unghiulare) și * (steluță) sunt strict interzise în denumirile de fișiere din Windows. Cratima (-) și cifrele sunt permise!"
            hintEn="Angle brackets < > and asterisk * are strictly prohibited in Windows file names. Hyphens (-) and numbers are allowed!"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleQuizAnswer('invalid_brackets')}
            className={`p-3 rounded-xl border text-xs font-mono text-left transition cursor-pointer ${
              forbiddenQuiz === 'invalid_brackets'
                ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <div className="font-bold text-white mb-1">{t.l3QuizOptA}</div>
            <div className="text-[11px] text-slate-400">{t.l3QuizOptASub}</div>
          </button>

          <button
            onClick={() => handleQuizAnswer('valid_name')}
            className={`p-3 rounded-xl border text-xs font-mono text-left transition cursor-pointer ${
              forbiddenQuiz === 'valid_name'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <div className="font-bold text-white mb-1">{t.l3QuizOptB}</div>
            <div className="text-[11px] text-emerald-400">
              {forbiddenQuiz === 'valid_name' ? t.l3QuizOptBSub : t.l3QuizOptBSubDef}
            </div>
          </button>

          <button
            onClick={() => handleQuizAnswer('invalid_star')}
            className={`p-3 rounded-xl border text-xs font-mono text-left transition cursor-pointer ${
              forbiddenQuiz === 'invalid_star'
                ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <div className="font-bold text-white mb-1">{t.l3QuizOptC}</div>
            <div className="text-[11px] text-slate-400">{t.l3QuizOptCSub}</div>
          </button>
        </div>

        {forbiddenQuiz && (
          <div className="mt-3">
            <AnswerExplanation
              isCorrect={forbiddenQuiz === 'valid_name'}
              explanationRo={
                forbiddenQuiz === 'valid_name'
                  ? 'Corect! Denumirea nu conține niciun caracter interzis, folosind doar litere, cratimă și extensia corespunzătoare (Manual pag. 30).'
                  : 'Incorect! Caracterele < > și * fac parte din cele 9 caractere rezervate de sistem și nu pot fi folosite în denumiri.'
              }
              explanationEn={
                forbiddenQuiz === 'valid_name'
                  ? 'Correct! The file name contains only allowed characters, hyphens, and a valid extension (p. 30).'
                  : 'Incorrect! Symbols < > and * are among the 9 reserved system characters and cannot be used.'
              }
            />
          </div>
        )}
      </div>

      {/* Complete Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400">
          {t.l3RewardText}
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`px-7 py-3 rounded-2xl font-bold font-heading text-sm transition transform flex items-center gap-2 shadow-lg ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 hover:scale-105 cursor-pointer shadow-cyan-500/25'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{t.l3FinishBtn}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

