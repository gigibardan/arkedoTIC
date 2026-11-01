import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  TrendingUp,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A4Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A4Level2_VectorTraversalAndStats: React.FC<A4Level2Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Vector data
  const [arrayData, setArrayData] = useState<number[]>([15, 42, 8, 93, 27, 4, 61, 38]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [hasRunStats, setHasRunStats] = useState<boolean>(false);

  // Computed properties
  const n = arrayData.length;
  const sum = arrayData.reduce((acc, val) => acc + val, 0);
  const average = (sum / n).toFixed(2);
  const evenCount = arrayData.filter((val) => val % 2 === 0).length;
  const oddCount = n - evenCount;

  let maxVal = arrayData[0];
  let maxIdx = 0;
  let minVal = arrayData[0];
  let minIdx = 0;

  for (let i = 1; i < n; i++) {
    if (arrayData[i] > maxVal) {
      maxVal = arrayData[i];
      maxIdx = i;
    }
    if (arrayData[i] < minVal) {
      minVal = arrayData[i];
      minIdx = i;
    }
  }

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const runTraversalAnimation = () => {
    sounds.playClick();
    setCurrentIdx(0);
    setHasRunStats(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < n) {
        setCurrentIdx(step);
        sounds.playClick();
      } else {
        clearInterval(interval);
        sounds.playCorrect();
      }
    }, 250);
  };

  const handleShuffle = () => {
    const randomArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 95) + 5);
    setArrayData(randomArray);
    setCurrentIdx(-1);
    setHasRunStats(false);
    sounds.playClick();
  };

  const isLevelCompleted =
    hasRunStats &&
    q1Answer === 'a' &&
    q2Answer === 'b';

  const handleFinish = () => {
    if (isLevelCompleted) {
      sounds.playCorrect();
      if (onCompletePage) onCompletePage(100);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-emerald-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-teal-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-400/30 text-teal-300">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  Modulul 3D • Nivelul 2 din 7
                </span>
                <span className="text-xs text-teal-300">Manual Art Klett pag. 78–79</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Parcurgerea Vectorilor: Sumă, Medie, Numărare & Min / Max
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-teal-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 2: Statistici Vector</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-teal-100/90 leading-relaxed max-w-3xl">
          Parcurgerea element cu element a unui vector este nucleul algoritmilor de analiză a datelor. Folosind o buclă <code className="bg-teal-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono">for (int i = 0; i &lt; n; i++)</code>, putem calcula suma, media reală, elementele pare și identifica poziția valorii maxime și minime!
        </p>
      </div>

      {/* Visual Vector Bars & Controls */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Simulator Vizual de Parcurgere Pas-cu-Pas
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleShuffle}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium flex items-center gap-1 border border-slate-700"
            >
              <RotateCcw className="w-3 h-3" />
              Generează Vector Nou
            </button>
            <button
              onClick={runTraversalAnimation}
              className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded text-xs font-medium flex items-center gap-1.5 shadow"
            >
              <Play className="w-3 h-3 fill-white" />
              Parcurge Vectorul
            </button>
          </div>
        </div>

        {/* Visual Columns */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-8 gap-2 items-end h-40 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {arrayData.map((val, idx) => {
              const isCurrent = currentIdx === idx;
              const isMax = val === maxVal;
              const isMin = val === minVal;
              const heightPercent = Math.max(15, Math.min(100, (val / 100) * 100));

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-300 mb-1">{val}</span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all flex items-end justify-center pb-1 ${
                      isCurrent
                        ? 'bg-cyan-400 ring-2 ring-cyan-300 shadow-lg shadow-cyan-500/50'
                        : isMax
                        ? 'bg-emerald-500'
                        : isMin
                        ? 'bg-rose-500'
                        : 'bg-indigo-600/60'
                    }`}
                  >
                    {isMax && <span className="text-[9px] font-bold text-slate-950 font-sans">MAX</span>}
                    {isMin && <span className="text-[9px] font-bold text-white font-sans">MIN</span>}
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-1 font-semibold ${
                      isCurrent ? 'text-cyan-300 underline font-bold' : 'text-slate-500'
                    }`}
                  >
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistical Summary Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-0.5">
            <span className="text-slate-400 text-[11px] block">Suma Elementelor:</span>
            <div className="text-lg font-bold font-mono text-cyan-300">{sum}</div>
            <div className="text-[10px] text-slate-500 font-mono">sum += v[i]</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-0.5">
            <span className="text-slate-400 text-[11px] block">Media Aritmetică:</span>
            <div className="text-lg font-bold font-mono text-purple-300">{average}</div>
            <div className="text-[10px] text-slate-500 font-mono">(double)sum / n</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/30 space-y-0.5">
            <span className="text-emerald-400 text-[11px] block font-semibold">Element Maxim:</span>
            <div className="text-lg font-bold font-mono text-emerald-300">
              {maxVal} <span className="text-xs text-slate-400">(la v[{maxIdx}])</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">poz_max = {maxIdx}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-rose-500/30 space-y-0.5">
            <span className="text-rose-400 text-[11px] block font-semibold">Element Minim:</span>
            <div className="text-lg font-bold font-mono text-rose-300">
              {minVal} <span className="text-xs text-slate-400">(la v[{minIdx}])</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">poz_min = {minIdx}</div>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Verificare Regulamentară C++ (Manual pag. 78–79)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              De ce este necesară conversia explicită <code className="text-purple-300 font-mono">(double)sum / n</code> la calculul mediei elementelor întregi?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Pentru a preveni împărțirea întreagă din C++, care ar tăia partea zecimală a mediei' },
                { id: 'b', label: 'Pentru că funcția cout nu știe să afișeze numere întregi' },
                { id: 'c', label: 'Este o comandă decorativă opțională' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'a') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'a'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {q1Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 2:</span>
            <p className="text-xs text-slate-300">
              Cum inițializăm corect variabila <code className="text-emerald-400 font-mono">maxim</code> înainte de a parcurge vectorul pentru a găsi cel mai mare număr?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'maxim = 0 (greșit dacă vectorul conține doar numere negative!)' },
                { id: 'b', label: 'maxim = v[0] (primul element al vectorului este asumat inițial ca maxim, parcurgând apoi de la i = 1)' },
                { id: 'c', label: 'maxim = 100000' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'b') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {q2Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion & Navigation Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isLevelCompleted ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' : 'bg-slate-600'
            }`}
          />
          <span className="text-xs text-slate-300">
            {isLevelCompleted
              ? 'Excelent! Ai explorat statisticile complete și algoritmul canonic de parcurgere a vectorilor.'
              : 'Rulează parcurgerea vectorului și răspunde corect la cele 2 întrebări.'}
          </span>
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>Următorul Nivel: Căutarea Liniară</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
