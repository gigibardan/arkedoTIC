import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Repeat,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { useQuestionCooldowns, computeGradeDetails, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level7Props {
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ScratchAlgo1_Level7_DiplomaAndExam: React.FC<Level7Props> = ({
  onCompletePage,
  studentName = 'Elev Programator Scratch',
  onRestartMission,
  onReturnToCatalog
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [showPreviewDiploma, setShowPreviewDiploma] = useState<boolean>(false);

  const handleQ1 = (val: string) => {
    if (isLocked('q1') || q1 === 'inversion') return;
    setQ1(val);
    if (val === 'inversion') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (val: string) => {
    if (isLocked('q2') || q2 === 'infinite') return;
    setQ2(val);
    if (val === 'infinite') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (val: string) => {
    if (isLocked('q3') || q3 === 'and') return;
    setQ3(val);
    if (val === 'and') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1 === 'inversion';
  const isQ2Correct = q2 === 'infinite';
  const isQ3Correct = q3 === 'and';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const allAnswered = !!(q1 && q2 && q3);

  const earnedScore = Math.min(100, correctCount * 30 + (allAnswered ? 10 : 0));
  const gradeDetails = computeGradeDetails(earnedScore, 100);

  const handleFinalize = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    onCompletePage(earnedScore);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/60 via-purple-950/40 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                {isEn ? 'Grade 6 • Unit 4A • Final Exam & Diploma' : 'Clasa a VI-a • Unitatea 4A • Examenul de Brevet & Diplomă'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Manual pag. 62–75</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
              <span>{isEn ? 'Scratch Loops Master Diploma' : 'Examenul de Brevet: Bucle Condiționate Scratch'}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Answer the 3 comprehensive synthesis questions correctly to earn your Grade 6 Official Scratch Algorithm Certificate!'
                : 'Răspunde la cele 3 întrebări de sinteză didactică din manual pentru a debloca Brevetul Oficial de Programator în Bucle Condiționate Scratch!'}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-amber-400/80">RECOMPENSĂ</span>
            <span className="text-xl font-black text-amber-300 font-mono">100 XP</span>
          </div>
        </div>
      </div>

      {/* 3 Synthesis Questions */}
      <div className="space-y-4">
        {/* Q1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? '1. What is the fundamental logical difference between "cât timp" (While) and "repetă până când" (Repeat Until)?'
                : '1. Care este diferența fundamentală dintre „cât timp” (pseudocod) și „repetă până când” (Scratch)?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              {
                id: 'inversion',
                label: '„Cât timp” rulează când condiția e ADEVĂRATĂ, iar „repetă până când” rulează când condiția e FALSĂ și se oprește când devine ADEVĂRATĂ',
                isCorrect: true
              },
              {
                id: 'no_diff',
                label: 'Nu există nicio diferență, ambele funcționează absolut identic',
                isCorrect: false
              },
              {
                id: 'scratch_forever',
                label: '„Repetă până când” este o buclă care nu se poate opri niciodată',
                isCorrect: false
              }
            ].map((opt) => {
              const isSelected = q1 === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q1) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q1') || isQ1Correct}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt.label}</span>
                  {q1 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q1 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q1} />
          ) : null}

          {q1 && (
            <AnswerExplanation
              isCorrect={q1 === 'inversion'}
              explanation="Corect! Aceasta este inversarea logică cheie din programa de clasa a VI-a: bucla Scratch se oprește când condiția din hexagon devine ADEVĂRATĂ!"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? '2. What happens if a script executes "repetă până când <scor = 10>", but score increases by 3 (0, 3, 6, 9, 12...)?'
                : '2. Ce se întâmplă dacă scrii „repetă până când <scor = 10>”, dar scorul crește din 3 în 3 (0, 3, 6, 9, 12...)?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              {
                id: 'infinite',
                label: 'Scorul sare peste 10 (9 -> 12), condiția nu devine niciodată egală cu 10 și se creează o buclă infinită care blochează jocul!',
                isCorrect: true
              },
              {
                id: 'auto_stop',
                label: 'Scratch ghicește intenția ta și oprește automat bucla la 12',
                isCorrect: false
              },
              {
                id: 'error_msg',
                label: 'Calculatorul dă o eroare de sintaxă înainte de pornire',
                isCorrect: false
              }
            ].map((opt) => {
              const isSelected = q2 === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q2) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q2') || isQ2Correct}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt.label}</span>
                  {q2 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q2 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q2} />
          ) : null}

          {q2 && (
            <AnswerExplanation
              isCorrect={q2 === 'infinite'}
              explanation="Exact! De aceea programatorii inteligenți folosesc inegalitatea: „repetă până când <scor > 9>” pentru a nu cădea în capcana valorilor ratate!"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? '3. Which Boolean operator ensures victory ONLY IF score > 100 AND time < 60 seconds?'
                : '3. Ce operator logic folosești pentru condiția de victorie: Scorul > 100 ȘI Timpul < 60 de secunde?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {[
              { id: 'and', label: '< [ ] și [ ] > (AND)', isCorrect: true },
              { id: 'or', label: '< [ ] sau [ ] > (OR)', isCorrect: false },
              { id: 'not', label: '< nu [ ] > (NOT)', isCorrect: false }
            ].map((opt) => {
              const isSelected = q3 === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q3) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q3') || isQ3Correct}
                  onClick={() => handleQ3(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt.label}</span>
                  {q3 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q3 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q3} />
          ) : null}

          {q3 && (
            <AnswerExplanation
              isCorrect={q3 === 'and'}
              explanation="Perfect! Operatorul logic „ȘI” cere ca ambele condiții să fie simultan ADEVĂRATE pentru ca întreaga expresie să fie validată."
            />
          )}
        </div>
      </div>

      {/* Synthesis Evaluation Card */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🏆
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isEn ? 'Evaluation Completed' : 'Evaluare Finală Modulul 4A'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {isEn
              ? 'Your score and grade are calculated based on your pedagogical results.'
              : 'Punctajul și calificativul sunt calculate dinamic în baza răspunsurilor tale din manual.'}
          </p>
        </div>

        {/* Dynamic Score & Grade Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-amber-500/50 shadow-lg">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
            Punctaj: {earnedScore} / 100 Puncte
          </span>
          <span className="text-slate-500 font-bold">•</span>
          <span className="text-sm sm:text-base font-bold text-emerald-300">
            {isEn ? gradeDetails.calificativEn : gradeDetails.calificativRo}
          </span>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleFinalize}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 cursor-pointer transition transform active:scale-95 flex items-center gap-2.5"
          >
            <Trophy className="w-5 h-5" />
            <span>{isEn ? 'Finalize Mission & Claim Official Diploma!' : 'Finalizează Misiunea 4A & Revendică Marea Diplomă!'}</span>
          </button>

        </div>
      </div>
    </div>
  );
};
