import React, { useState } from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Binary,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A4Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface BinaryStepLog {
  step: number;
  st: number;
  dr: number;
  mij: number;
  valMij: number;
  decision: string;
}

export const A4Level6_SelectionSortAndBinarySearch: React.FC<A4Level6Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Sorted array for Binary Search
  const sortedArray = [3, 7, 12, 18, 25, 31, 42, 56, 64, 73, 81, 95];
  const [targetX, setTargetX] = useState<number>(42);
  const [binaryLogs, setBinaryLogs] = useState<BinaryStepLog[]>([]);
  const [activeMij, setActiveMij] = useState<number | null>(null);
  const [activeInterval, setActiveInterval] = useState<[number, number] | null>(null);
  const [searchFound, setSearchFound] = useState<boolean | null>(null);
  const [hasRunSearch, setHasRunSearch] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const runBinarySearch = () => {
    sounds.playClick();
    setBinaryLogs([]);
    setActiveMij(null);
    setActiveInterval(null);
    setSearchFound(null);

    let st = 0;
    let dr = sortedArray.length - 1;
    const logs: BinaryStepLog[] = [];
    let step = 1;
    let found = false;

    while (st <= dr) {
      const mij = Math.floor((st + dr) / 2);
      const valMij = sortedArray[mij];

      if (valMij === targetX) {
        logs.push({
          step,
          st,
          dr,
          mij,
          valMij,
          decision: `EGALITATE! v[mij] == ${targetX}. Elementul a fost găsit pe indexul [${mij}]!`
        });
        found = true;
        break;
      } else if (valMij < targetX) {
        logs.push({
          step,
          st,
          dr,
          mij,
          valMij,
          decision: `${valMij} < ${targetX} &rarr; Căutăm în jumătatea DREAPTĂ: st devine ${mij + 1}`
        });
        st = mij + 1;
      } else {
        logs.push({
          step,
          st,
          dr,
          mij,
          valMij,
          decision: `${valMij} > ${targetX} &rarr; Căutăm în jumătatea STÂNGĂ: dr devine ${mij - 1}`
        });
        dr = mij - 1;
      }
      step++;
    }

    if (!found) {
      logs.push({
        step,
        st,
        dr,
        mij: -1,
        valMij: -1,
        decision: `Interval epuizat (st > dr). Elementul ${targetX} NU se află în vector!`
      });
    }

    setBinaryLogs(logs);
    if (logs.length > 0 && logs[logs.length - 1].mij !== -1) {
      setActiveMij(logs[logs.length - 1].mij);
    }
    setSearchFound(found);
    setHasRunSearch(true);

    if (found) {
      sounds.playLevelComplete();
    } else {
      sounds.playWrong();
    }
  };

  const isLevelCompleted =
    hasRunSearch &&
    searchFound !== null &&
    q1Answer === 'b' &&
    q2Answer === 'a';

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
      <div className="bg-gradient-to-r from-teal-950 via-cyan-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-teal-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-400/30 text-teal-300">
              <Binary className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  Modulul 3D • Nivelul 6 din 7
                </span>
                <span className="text-xs text-teal-300">Manual Art Klett pag. 82–83</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Căutarea Binară (Binary Search) pe Tablouri Sortate
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-teal-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 6: Căutare Binară</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-teal-100/90 leading-relaxed max-w-3xl">
          Pe un vector deja ordonat crescător, nu mai este nevoie să căutăm element cu element! Prin <strong>Căutarea Binară</strong> comparăm cheia căutată direct cu elementul din mijloc (<code className="bg-teal-950 px-1 rounded text-cyan-300 font-mono">mij = (st + dr) / 2</code>) și eliminăm dintr-o singură lovitură jumătate din elementele rămase. Este cel mai rapid algoritm de căutare din programa de gimnaziu!
        </p>
      </div>

      {/* Simulator: Interactive Binary Search */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            Simulator Vizual de Înjumătățire a Intervalului [st, dr]
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Valoare de căutat (X):</span>
            <input
              type="number"
              value={targetX}
              onChange={(e) => {
                setTargetX(Number(e.target.value));
                setHasRunSearch(false);
              }}
              className="w-20 bg-slate-950 border border-slate-700 rounded p-1 font-mono text-cyan-300 text-center text-xs"
            />
            <button
              onClick={runBinarySearch}
              className="px-4 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Execută Căutarea Binară
            </button>
          </div>
        </div>

        {/* Sorted Vector Display */}
        <div className="space-y-2 pt-2">
          <span className="text-xs text-slate-400 block font-mono">Vector Sortat Crescător (12 elemente):</span>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {sortedArray.map((val, idx) => {
              const isFoundMatch = searchFound && val === targetX;

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isFoundMatch
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/30 scale-105'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] text-slate-500 font-mono">[{idx}]</div>
                  <div className="text-base font-bold font-mono">{val}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step-by-step Log of Binary Decisions */}
        {hasRunSearch && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
            <span className="text-slate-400 font-sans font-semibold block text-xs">
              Traseul Deciziilor Algoritmice (Număr Pași: {binaryLogs.length}):
            </span>
            <div className="space-y-1.5">
              {binaryLogs.map((log) => (
                <div
                  key={log.step}
                  className={`p-2 rounded border flex flex-wrap items-center justify-between gap-2 ${
                    log.decision.startsWith('EGALITATE')
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>
                    Pasul #{log.step}: Interval [{log.st} ... {log.dr}] &rarr; mij = {log.mij} (valoare: {log.valMij})
                  </span>
                  <span className="text-[11px] font-sans font-medium text-cyan-300">{log.decision}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Verificare Regulamentară C++ (Manual pag. 82–83)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              Care este condiția preliminară <strong>obligatorie</strong> pentru a putea aplica algoritmul de Căutare Binară pe un vector?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Elementele vectorului trebuie să fie toate numere pare' },
                { id: 'b', label: 'Vectorul trebuie să fie ordonat (sortat crescător sau descrescător)' },
                { id: 'c', label: 'Vectorul trebuie să aibă cel puțin 1000 de elemente' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'b') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {q1Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 2:</span>
            <p className="text-xs text-slate-300">
              Câte comparații face cel mult căutarea binară într-un tablou sortat de 1024 de elemente?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Doar aproximativ 10 sau 11 comparații (deoarece 2^10 = 1024) — viteză excepțională!' },
                { id: 'b', label: '1024 de comparații' },
                { id: 'c', label: '512 comparații' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'a') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'a'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {q2Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
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
              ? 'Excelent! Ai explorat căutarea binară și eficiența logaritmică a înjumătățirii intervalului.'
              : 'Rulează o căutare binară în simulator și răspunde corect la cele 2 întrebări.'}
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
          <span>Următorul Nivel: Examenul Sumativ Modulul 3D</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
