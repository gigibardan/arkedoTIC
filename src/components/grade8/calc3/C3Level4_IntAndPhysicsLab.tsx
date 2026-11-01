import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Divide,
  Activity,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C3Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C3Level4_IntAndPhysicsLab: React.FC<C3Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Physics Lab State (Manual pag. 27: v = d / t)
  const [distance, setDistance] = useState<number>(250); // meters
  const [time, setTime] = useState<number>(18); // seconds

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const exactSpeed = time > 0 ? (distance / time) : 0;
  const intSpeed = Math.floor(exactSpeed);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'truncateDown') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'slashDiv') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'nine') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'truncateDown';
  const isQ2Correct = q2Answer === 'slashDiv';
  const isQ3Correct = q3Answer === 'nine';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-emerald-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 27 (Aplicație Fizică)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Compass className="w-8 h-8 text-teal-400" />
              Nivelul 4: Funcția =INT() & Aplicația de Fizică (v = d / t)
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Cum calculează un cercetător viteza medie a unui vehicul sau submarin și cum extragem partea întreagă a unui număr zecimal cu funcția INT?
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Modulul 1C</div>
            <div className="text-2xl font-black text-teal-400">4 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Physics & INT Lab */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Laborator Interdisciplinar: Fizică în Calcul Tabelar</h2>
              <p className="text-xs text-slate-400">
                Calculează viteza v = d / t și aplică funcția <code>=INT(A2/B2)</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { d: 150, t: 15, label: 'Exemplul 1 (150m, 15s)' },
              { d: 245, t: 18, label: 'Exemplul 2 (245m, 18s)' },
              { d: 500, t: 37, label: 'Exemplul 3 (500m, 37s)' },
            ].map(ex => (
              <button
                key={ex.label}
                type="button"
                onClick={() => { sounds.playClick(); setDistance(ex.d); setTime(ex.t); }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-300 text-xs font-mono cursor-pointer"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-sans">Distanța parcursă (d în metri) — Celula A2:</span>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Math.max(1, Number(e.target.value) || 1))}
              className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 text-white font-bold text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-sans">Timpul scurs (t în secunde) — Celula B2:</span>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Math.max(1, Number(e.target.value) || 1))}
              className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 text-white font-bold text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Live Worksheet Rendering */}
        <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-950 font-mono text-xs shadow-inner">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                <th className="p-2 border-r border-slate-800 w-12 bg-slate-850">◢</th>
                <th className="p-2 border-r border-slate-800">A: Distanță (m)</th>
                <th className="p-2 border-r border-slate-800">B: Timp (s)</th>
                <th className="p-2 border-r border-slate-800">C: Viteză Exactă (=A2/B2)</th>
                <th className="p-2 bg-emerald-950/40 text-emerald-300">D: Partea Întreagă (=INT(A2/B2))</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-850 bg-slate-900/50">
                <td className="p-3 border-r border-slate-850 bg-slate-900 text-slate-400 font-bold">2</td>
                <td className="p-3 border-r border-slate-850 text-white font-bold">{distance} m</td>
                <td className="p-3 border-r border-slate-850 text-white font-bold">{time} s</td>
                <td className="p-3 border-r border-slate-850 font-bold text-cyan-300">
                  {exactSpeed.toFixed(4)} m/s
                </td>
                <td className="p-3 font-black text-emerald-400 text-base bg-emerald-500/10">
                  {intSpeed} m/s
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Cum funcționează funcția =INT() (Manual pag. 27):</strong>
          <p className="mt-1">
            Sintaxa este <code>=INT(numar)</code>. Spre deosebire de rotunjirea uzuală, funcția INT extrage partea întreagă fără a ține cont de zecimale. Astfel, <code>=INT(9.85)</code> va rezulta în <strong>9</strong> (și NU 10!).
          </p>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificare Pedagogică: Funcția INT & Probleme de Fizică</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări din manual pentru a debloca Nivelul 5</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Ce rezultat returnează funcția =INT() aplicată unui număr real pozitiv?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'truncateDown', text: 'Partea întreagă a numărului, eliminând zecimalele (rotunjire în jos)' },
              { id: 'roundUpAlways', text: 'Rotunjire în sus la cel mai mare număr întreg' },
              { id: 'sqrtValue', text: 'Rădăcina pătrată' },
              { id: 'oppositeSign', text: 'Numărul opus cu semn minus' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'truncateDown'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Numele vine de la 'Integer' (Număr Întreg)." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Funcția =INT() taie zecimalele unui număr pozitiv, returnând partea întreagă a valorii."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Dacă distanța parcursă se află în celula A2 și timpul în B2, cum se scrie formula vitezei conform manualului?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'slashDiv', text: '=A2/B2 (distanța împărțită la timp folosind bara oblică)' },
              { id: 'multiply', text: '=A2*B2 (distanța înmulțită cu timpul)' },
              { id: 'addTogether', text: '=A2+B2' },
              { id: 'colonRange', text: '=A2:B2' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'slashDiv'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Viteza din fizică este v = d / t." />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! Operatorul de împărțire în Excel este bara oblică (/), formula corectă fiind =A2/B2."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Ce rezultat va afișa formula =INT(9.85) conform manualului (pag. 27)?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'nine', text: '9 (deoarece doar taie zecimalele, fără rotunjire clasică)' },
              { id: 'ten', text: '10' },
              { id: 'nineEight', text: '9.8' },
              { id: 'errorRef', text: '#REF!' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'nine'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Funcția INT nu rotunjește la cel mai apropiat număr, ci elimină zecimalele existente." />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! =INT(9.85) returnează 9. Pentru a obține 10 prin rotunjire matematică clasică, s-ar fi folosit funcția =ROUND(9.85, 0)."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={4}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
