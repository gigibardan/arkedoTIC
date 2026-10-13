import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  Printer,
  RotateCcw,
  Star,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Code2,
  Repeat
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';

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

  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);

  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const handleQ1 = (val: string) => {
    if (q1) return;
    setQ1(val);
    if (val === 'inversion') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleQ2 = (val: string) => {
    if (q2) return;
    setQ2(val);
    if (val === 'infinite') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleQ3 = (val: string) => {
    if (q3) return;
    setQ3(val);
    if (val === 'and') sounds.playCorrect();
    else sounds.playWrong();
  };

  const isExamPassed = q1 === 'inversion' && q2 === 'infinite' && q3 === 'and';

  const triggerCelebration = () => {
    if (hasCelebrated) return;
    setHasCelebrated(true);
    sounds.playFanfare();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    onCompletePage(20);
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
                : 'Răspunde corect la cele 3 întrebări de sinteză didactică pentru a debloca Brevetul Oficial de Programator în Bucle Condiționate Scratch!'}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-amber-400/80">REWARD</span>
            <span className="text-xl font-black text-amber-300 font-mono">+20 XP</span>
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
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt.label}</span>
                  {q1 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q1 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

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
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt.label}</span>
                  {q2 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q2 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

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
                  onClick={() => handleQ3(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs text-left transition cursor-pointer flex items-center justify-between ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {q3 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {q3 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {q3 && (
            <AnswerExplanation
              isCorrect={q3 === 'and'}
              explanation="Perfect! Operatorul ȘI (AND) impune ca ambele cerințe să fie simultan îndeplinite pentru acordarea victoriei!"
            />
          )}
        </div>
      </div>

      {/* Diploma Unlock Section */}
      {isExamPassed && (
        <div className="space-y-6 animate-scaleUp pt-4">
          {!hasCelebrated && (
            <div className="text-center p-6 bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 text-3xl animate-bounce">
                🌟
              </div>
              <h3 className="text-xl font-black text-white mb-2">
                Ai trecut Examenul cu Scor Maxim (100%)!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
                Felicitări! Ai demonstrat stăpânirea deplină a algoritmilor și buclelor condiționate din programa de clasa a VI-a.
              </p>
              <button
                onClick={triggerCelebration}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm shadow-xl shadow-amber-500/30 transition cursor-pointer"
              >
                🎓 Dezvăluie Marea Diplomă Oficială!
              </button>
            </div>
          )}

          {hasCelebrated && (
            <div className="space-y-6">
              {/* Printable Certificate Card */}
              <div className="bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-4 border-amber-500/60 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-center gap-3 mb-4">
                  <Repeat className="w-10 h-10 text-amber-400" />
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full bg-amber-500/10">
                    CERTIFICAT OFICIAL ARKEDO TIC • CLASA A VI-A
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
                  DIPLOMĂ DE MERIT DIDACTIC
                </h2>
                <div className="text-xs sm:text-sm font-mono text-amber-300/80 mb-6">
                  PROGRAMATOR DE BUCLE CONDIȚIONATE & ALGORITMI SCRATCH
                </div>

                <div className="text-slate-300 text-xs sm:text-sm mb-4">Se acordă cu onoare elevului:</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-heading tracking-wide border-b-2 border-amber-500/40 pb-2 max-w-md mx-auto mb-6">
                  {studentName}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
                  Pentru absolvirea strălucită a Modulului 4A conform Programei Naționale OMEN 3393/2017: înțelegerea inversării logice „Cât timp” vs „Repetă până când”, evaluarea operatorilor booleeni compuși, evitarea buclelor infinite și construirea algoritmilor inteligenți cu senzori.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
                  <div className="text-left font-mono">
                    <div>Data: {new Date().toLocaleDateString('ro-RO')}</div>
                    <div>Cod Brevet: ARK-G6-ALGO-LOOP-2026</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <span className="font-bold text-white font-mono">Verificat & Validat Arkedo</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Printează Diploma</span>
                </button>

                {onRestartMission && (
                  <button
                    onClick={onRestartMission}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reia Misiunea</span>
                  </button>
                )}

                {onReturnToCatalog && (
                  <button
                    onClick={onReturnToCatalog}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-600/30"
                  >
                    <span>Înapoi la Catalogul Cursurilor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
