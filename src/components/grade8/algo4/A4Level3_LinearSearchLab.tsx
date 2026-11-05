import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A4Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A4Level3_LinearSearchLab: React.FC<A4Level3Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();

  const [arrayElements, setArrayElements] = useState<number[]>([18, 45, 9, 27, 45, 63, 12, 84]);
  const [targetX, setTargetX] = useState<number>(45);
  const [scannedIdx, setScannedIdx] = useState<number>(-1);
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasCompletedSearch, setHasCompletedSearch] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const runLinearSearch = () => {
    sounds.playClick();
    setIsSearching(true);
    setFoundIndices([]);
    setScannedIdx(0);
    setHasCompletedSearch(false);

    let idx = 0;
    const matches: number[] = [];

    const interval = setInterval(() => {
      if (idx < arrayElements.length) {
        setScannedIdx(idx);
        if (arrayElements[idx] === targetX) {
          matches.push(idx);
          setFoundIndices([...matches]);
          sounds.playCorrect();
        } else {
          sounds.playClick();
        }
        idx++;
      } else {
        clearInterval(interval);
        setIsSearching(false);
        setHasCompletedSearch(true);
        if (matches.length > 0) {
          sounds.playLevelComplete();
        } else {
          sounds.playWrong();
        }
      }
    }, 350);
  };

  const isLevelCompleted =
    hasCompletedSearch &&
    q1Answer === 'c' &&
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
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {lang === 'ro' ? 'Modulul 3D • Nivelul 3 din 7' : 'Module 3D • Level 3 of 7'}
                </span>
                <span className="text-xs text-indigo-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 79–80' : 'Art Klett Textbook pp. 79–80'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Algoritmul de Căutare Secvențială (Liniară) în Tablouri'
                  : 'Sequential (Linear) Search Algorithm in Arrays'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 3: Căutare Liniară' : 'Level 3: Linear Search'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-indigo-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Căutarea secvențială (liniară) examinează elementele vectorului pe rând, de la primul până la ultimul, comparând fiecare valoare <code className="bg-indigo-950 px-1 rounded text-cyan-300 font-mono">v[i]</code> cu cheia căutată <code className="bg-indigo-950 px-1 rounded text-amber-300 font-mono">X</code>. Funcționează pe orice tablou, indiferent dacă este sortat sau nu!
            </>
          ) : (
            <>
              Sequential (linear) search examines array elements one by one, from first to last, comparing each value <code className="bg-indigo-950 px-1 rounded text-cyan-300 font-mono">v[i]</code> with search key <code className="bg-indigo-950 px-1 rounded text-amber-300 font-mono">X</code>. It works on any array, whether sorted or unsorted!
            </>
          )}
        </p>
      </div>

      {/* Simulator: Interactive Linear Scanner */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            {lang === 'ro' ? 'Scaner Liniar Vizual în Timp Real' : 'Real-Time Visual Linear Scanner'}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">
              {lang === 'ro' ? 'Valoare căutată (X):' : 'Search target (X):'}
            </span>
            <input
              type="number"
              value={targetX}
              onChange={(e) => {
                setTargetX(Number(e.target.value));
                setHasCompletedSearch(false);
                setFoundIndices([]);
                setScannedIdx(-1);
              }}
              className="w-20 bg-slate-950 border border-slate-700 rounded p-1 font-mono text-cyan-300 text-center text-xs"
            />
            <button
              onClick={runLinearSearch}
              disabled={isSearching}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {lang === 'ro' ? 'Pornește Căutarea' : 'Start Search'}
            </button>
          </div>
        </div>

        {/* Vector Display Cells */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {arrayElements.map((val, idx) => {
              const isBeingScanned = scannedIdx === idx;
              const isMatch = foundIndices.includes(idx);
              const isAlreadyScanned = scannedIdx > idx && !isMatch;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isMatch
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 scale-105'
                      : isBeingScanned
                      ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-400 animate-pulse'
                      : isAlreadyScanned
                      ? 'bg-slate-950/40 border-slate-800 text-slate-600'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="text-[10px] text-slate-500 font-mono mb-1">v[{idx}]</div>
                  <div className="text-lg font-bold font-mono">{val}</div>
                  <div className="text-[10px] mt-1 font-semibold">
                    {isMatch
                      ? lang === 'ro'
                        ? 'GĂSIT! ✓'
                        : 'FOUND! ✓'
                      : isBeingScanned
                      ? lang === 'ro'
                        ? 'Testare...'
                        : 'Testing...'
                      : isAlreadyScanned
                      ? '!= X'
                      : lang === 'ro'
                      ? 'În așteptare'
                      : 'Waiting'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Results Summary */}
        {hasCompletedSearch && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              foundIndices.length > 0
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                {foundIndices.length > 0 ? (
                  lang === 'ro' ? (
                    <>
                      Valoarea <strong>X = {targetX}</strong> a fost găsită de{' '}
                      <strong className="text-cyan-300">{foundIndices.length} ori</strong>, la indicii:{' '}
                      <span className="font-mono font-bold">[{foundIndices.join(', ')}]</span>.
                    </>
                  ) : (
                    <>
                      Value <strong>X = {targetX}</strong> was found{' '}
                      <strong className="text-cyan-300">{foundIndices.length} time(s)</strong> at indices:{' '}
                      <span className="font-mono font-bold">[{foundIndices.join(', ')}]</span>.
                    </>
                  )
                ) : lang === 'ro' ? (
                  <>Valoarea <strong>X = {targetX}</strong> NU a fost găsită în vector după 8 comparații.</>
                ) : (
                  <>Value <strong>X = {targetX}</strong> was NOT found in the array after 8 comparisons.</>
                )}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {lang === 'ro' ? 'Comparații efectuate: ' : 'Comparisons performed: '}
              {arrayElements.length}
            </span>
          </div>
        )}
      </div>

      {/* Code Snippet */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-3 font-mono text-xs">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 font-sans border-b border-slate-800 pb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          {lang === 'ro'
            ? 'Implementare C++ cu Indicator Boolean & Ieșire Rapidă (Manual pag. 80)'
            : 'C++ Implementation with Boolean Flag & Early Exit (Textbook p. 80)'}
        </h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-slate-300">
          <div><span className="text-indigo-400">bool</span> gasit = <span className="text-pink-400">false</span>;</div>
          <div><span className="text-indigo-400">int</span> pozitie = -<span className="text-amber-300">1</span>;</div>
          <div>
            <span className="text-pink-400 font-semibold">for</span> (<span className="text-indigo-400">int</span> i = <span className="text-amber-300">0</span>; i &lt; n; i++) &#123;
          </div>
          <div className="pl-4">
            <span className="text-pink-400">if</span> (v[i] == X) &#123;
          </div>
          <div className="pl-8 text-emerald-300">gasit = true; pozitie = i;</div>
          <div className="pl-8 text-purple-300">
            break; <span className="text-slate-500">
              {lang === 'ro' ? '// oprim bucla dacă căutăm doar prima apariție!' : '// stop loop if searching for first occurrence!'}
            </span>
          </div>
          <div className="pl-4">&#125;</div>
          <div>&#125;</div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 79–80)' : 'Official C++ Checkpoint (Textbook pp. 79–80)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro'
                ? 'Care este numărul maxim de comparații efectuate de algoritmul de căutare liniară într-un vector cu n elemente?'
                : 'What is the maximum number of comparisons performed by linear search in an array with n elements?'}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: '1 comparație',
                  labelEn: '1 comparison'
                },
                {
                  id: 'b',
                  labelRo: 'Exact n / 2 comparații mereu',
                  labelEn: 'Always exactly n / 2 comparisons'
                },
                {
                  id: 'c',
                  labelRo: 'n comparații (în cel mai defavorabil caz, când elementul este pe ultima poziție sau nu există deloc)',
                  labelEn: 'n comparisons (in the worst case, when element is in the last position or absent)'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'c') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'c'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q1Answer === opt.id && opt.id === 'c' && <Check className="w-4 h-4 text-emerald-400" />}
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
                ? 'Ce rol are instrucțiunea break; plasată în interiorul condiției if (v[i] == X)?'
                : 'What is the role of the break; statement placed inside the condition if (v[i] == X)?'}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Șterge elementul din memorie',
                  labelEn: 'Deletes the element from memory'
                },
                {
                  id: 'b',
                  labelRo: 'Oprește imediat parcurgerea buclei de îndată ce am găsit prima apariție a lui X, economisind timp de execuție',
                  labelEn: 'Immediately stops loop traversal once first occurrence of X is found, saving execution time'
                },
                {
                  id: 'c',
                  labelRo: 'Inversează ordinea elementelor din tablou',
                  labelEn: 'Reverses the order of elements in the array'
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
                ? 'Excelent! Ai explorat algoritmul de căutare secvențială și optimizarea cu break.'
                : 'Excellent! You mastered sequential search and break optimization.'
              : lang === 'ro'
              ? 'Rulează căutarea liniară și răspunde corect la cele două întrebări.'
              : 'Run linear search and correctly answer both questions.'}
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
          <span>{lang === 'ro' ? 'Următorul Nivel: Inserare & Ștergere' : 'Next Level: Insertion & Deletion'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
