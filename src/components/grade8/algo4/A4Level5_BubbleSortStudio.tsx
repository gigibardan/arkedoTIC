import React, { useState } from 'react';
import {
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Zap,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A4Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A4Level5_BubbleSortStudio: React.FC<A4Level5Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();

  const [arrayData, setArrayData] = useState<number[]>([45, 12, 89, 34, 7, 23]);
  const [activePair, setActivePair] = useState<[number, number] | null>(null);
  const [passCount, setPassCount] = useState<number>(0);
  const [swapCount, setSwapCount] = useState<number>(0);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const resetArray = () => {
    setArrayData([45, 12, 89, 34, 7, 23]);
    setActivePair(null);
    setPassCount(0);
    setSwapCount(0);
    setIsSorted(false);
    setIsSorting(false);
    sounds.playClick();
  };

  const runBubbleSort = async () => {
    sounds.playClick();
    setIsSorting(true);
    let arr = [...arrayData];
    let n = arr.length;
    let passes = 0;
    let totalSwaps = 0;
    let sorted = false;

    while (!sorted) {
      sorted = true;
      passes++;
      setPassCount(passes);

      for (let i = 0; i < n - 1; i++) {
        setActivePair([i, i + 1]);
        await new Promise((r) => setTimeout(r, 350));

        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          sorted = false;
          totalSwaps++;
          setSwapCount(totalSwaps);
          setArrayData([...arr]);
          sounds.playClick();
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }

    setActivePair(null);
    setIsSorted(true);
    setIsSorting(false);
    sounds.playLevelComplete();
  };

  const isLevelCompleted =
    isSorted &&
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
      <div className="bg-gradient-to-r from-amber-950 via-orange-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-amber-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-400/30 text-amber-300">
              <ArrowUpDown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/30 text-amber-200 border border-amber-400/30">
                  {lang === 'ro' ? 'Modulul 3D • Nivelul 5 din 7' : 'Module 3D • Level 5 of 7'}
                </span>
                <span className="text-xs text-amber-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 81–82' : 'Art Klett Textbook pp. 81–82'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Algoritmul de Sortare prin Metoda Bulelor (Bubble Sort)'
                  : 'Bubble Sort Algorithm'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-amber-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 5: Bubble Sort' : 'Level 5: Bubble Sort'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-amber-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              <strong>Metoda Bulelor</strong> compară elemente vecine două câte două: dacă elementul din stânga este mai mare decât cel din dreapta, valorile sunt interschimbate (<code className="text-cyan-300 font-mono">swap</code>). La fiecare trecere, cele mai mari valori „urcă la suprafață” spre capătul vectorului, exact ca bulele de aer în apă!
            </>
          ) : (
            <>
              <strong>Bubble Sort</strong> compares adjacent elements pairwise: if the left element is greater than the right one, values are swapped (<code className="text-cyan-300 font-mono">swap</code>). With each pass, the largest remaining values "bubble up" to the end of the array, just like air bubbles in water!
            </>
          )}
        </p>
      </div>

      {/* Simulator: Interactive Bubble Sort Animation */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            {lang === 'ro' ? 'Simulator Vizual Bubble Sort' : 'Bubble Sort Visual Simulator'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={resetArray}
              disabled={isSorting}
              className="p-1.5 px-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-950 text-slate-300 rounded text-xs border border-slate-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === 'ro' ? 'Resetare' : 'Reset'}
            </button>
            <button
              onClick={runBubbleSort}
              disabled={isSorting || isSorted}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {lang === 'ro' ? 'Pornește Bubble Sort' : 'Start Bubble Sort'}
            </button>
          </div>
        </div>

        {/* Visual Columns of the Vector */}
        <div className="pt-2">
          <div className="grid grid-cols-6 gap-3 items-end h-44 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {arrayData.map((val, idx) => {
              const isComparing = activePair && (activePair[0] === idx || activePair[1] === idx);
              const heightPercent = Math.max(15, Math.min(100, (val / 95) * 100));

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end">
                  <span className="text-xs font-mono font-bold text-slate-300 mb-1">{val}</span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all flex items-end justify-center pb-1 ${
                      isSorted
                        ? 'bg-emerald-500'
                        : isComparing
                        ? 'bg-amber-400 ring-2 ring-amber-300 shadow-lg shadow-amber-500/40'
                        : 'bg-indigo-600/70'
                    }`}
                  >
                    {isComparing && (
                      <span className="text-[10px] font-bold text-slate-950 font-sans">
                        {activePair[0] === idx ? 'L' : 'R'}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-1 ${
                      isComparing ? 'text-amber-300 font-bold' : 'text-slate-500'
                    }`}
                  >
                    v[{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">
              {lang === 'ro' ? 'Trecerea curentă (Pass):' : 'Current Pass:'}
            </span>
            <span className="font-mono font-bold text-cyan-300 text-sm">#{passCount}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">
              {lang === 'ro' ? 'Interschimbări (Swaps):' : 'Swaps:'}
            </span>
            <span className="font-mono font-bold text-amber-400 text-sm">{swapCount}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">
              {lang === 'ro' ? 'Stare vector:' : 'Array status:'}
            </span>
            <span
              className={`font-sans font-bold text-sm ${
                isSorted ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {isSorted
                ? lang === 'ro'
                  ? 'SORTAT CRESCĂTOR ✓'
                  : 'SORTED ASCENDING ✓'
                : isSorting
                ? lang === 'ro'
                  ? 'În curs de sortare...'
                  : 'Sorting in progress...'
                : lang === 'ro'
                ? 'Nesortat'
                : 'Unsorted'}
            </span>
          </div>
        </div>
      </div>

      {/* Code Window */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-3 font-mono text-xs">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 font-sans border-b border-slate-800 pb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          {lang === 'ro'
            ? 'Implementare Canonică C++ cu Flag de Optimizare (Manual pag. 82)'
            : 'Canonical C++ Implementation with Optimization Flag (Textbook p. 82)'}
        </h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-slate-300">
          <div><span className="text-indigo-400">bool</span> sortat;</div>
          <div><span className="text-pink-400 font-semibold">do</span> &#123;</div>
          <div className="pl-4 text-slate-400">
            sortat = <span className="text-emerald-400">true</span>; <span className="text-slate-500">
              {lang === 'ro' ? '// presupunem ordonat' : '// assume sorted'}
            </span>
          </div>
          <div className="pl-4">
            <span className="text-pink-400">for</span> (<span className="text-indigo-400">int</span> i = <span className="text-amber-300">0</span>; i &lt; n - <span className="text-amber-300">1</span>; i++) &#123;
          </div>
          <div className="pl-8">
            <span className="text-pink-400">if</span> (v[i] &gt; v[i + <span className="text-amber-300">1</span>]) &#123;
          </div>
          <div className="pl-12 text-amber-300">swap(v[i], v[i + 1]);</div>
          <div className="pl-12 text-rose-300">
            sortat = <span className="text-rose-400">false</span>; <span className="text-slate-500">
              {lang === 'ro' ? '// s-a produs o inversiune' : '// an inversion occurred'}
            </span>
          </div>
          <div className="pl-8">&#125;</div>
          <div className="pl-4">&#125;</div>
          <div>&#125; <span className="text-pink-400 font-semibold">while</span> (!sortat);</div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 81–82)' : 'Official C++ Checkpoint (Textbook pp. 81–82)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro'
                ? 'Ce se întâmplă la fiecare trecere completă a buclei interioare prin vector în algoritmul Bubble Sort?'
                : 'What occurs after every full pass of the inner loop across the array in Bubble Sort?'}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Cel mai mare element încă neordonat ajunge garantat pe poziția sa finală la sfârșitul vectorului',
                  labelEn: 'The largest unsorted element is guaranteed to reach its final position at the end of the array'
                },
                {
                  id: 'b',
                  labelRo: 'Toate elementele se dublează ca valoare',
                  labelEn: 'All elements double in value'
                },
                {
                  id: 'c',
                  labelRo: 'Vectorul se împarte în două jumătăți',
                  labelEn: 'The array splits into two halves'
                }
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
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q1Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 2:' : 'Question 2:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro'
                ? 'Cum ajută variabila indicator bool sortat la optimizarea algoritmului?'
                : 'How does the bool sortat flag optimize the algorithm?'}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Transformă numerele în șiruri de caractere',
                  labelEn: 'Transforms numbers into strings'
                },
                {
                  id: 'b',
                  labelRo: 'Dacă la o trecere nu s-a făcut nicio interschimbare, oprește bucla imediat, evitând treceri inutile pe un vector deja ordonat',
                  labelEn: 'If no swap happened during a pass, stops the loop immediately, avoiding useless passes on already sorted arrays'
                },
                {
                  id: 'c',
                  labelRo: 'Nu are niciun efect util',
                  labelEn: 'Has no beneficial effect'
                }
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
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
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
              ? lang === 'ro'
                ? 'Excelent! Ai explorat sortarea prin metoda bulelor și optimizarea cu indicator boolean.'
                : 'Excellent! You mastered bubble sort and the boolean flag early exit optimization.'
              : lang === 'ro'
              ? 'Rulează sortarea Bubble Sort și răspunde corect la cele 2 întrebări.'
              : 'Run Bubble Sort and correctly answer both questions.'}
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
          <span>{lang === 'ro' ? 'Următorul Nivel: Căutarea Binară' : 'Next Level: Binary Search'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
