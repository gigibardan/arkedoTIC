import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Cpu,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A4Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A4Level1_VectorDeclarationAndMemory: React.FC<A4Level1Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Vector size and initial values
  const [vectorSize, setVectorSize] = useState<number>(5);
  const [elements, setElements] = useState<number[]>([14, 28, 7, 42, 9]);
  const [selectedCellIdx, setSelectedCellIdx] = useState<number | null>(null);
  const [hasInspectedCells, setHasInspectedCells] = useState<boolean>(false);

  // Base RAM address simulation (e.g. 0x1000)
  const baseAddress = 0x2000;
  const bytesPerElement = 4; // sizeof(int) = 4 bytes

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleCellClick = (idx: number) => {
    setSelectedCellIdx(idx);
    setHasInspectedCells(true);
    sounds.playClick();
  };

  const handleUpdateElement = (idx: number, newVal: number) => {
    const updated = [...elements];
    updated[idx] = newVal;
    setElements(updated);
    sounds.playClick();
  };

  const isLevelCompleted =
    hasInspectedCells &&
    selectedCellIdx !== null &&
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
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-blue-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30 text-blue-300">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Modulul 3D • Nivelul 1 din 7
                </span>
                <span className="text-xs text-blue-300">Manual Art Klett pag. 77–78</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Tablouri Unidimensionale (Vectori): Declarare, Indexare & Memoria RAM
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 1: Declarare & RAM</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-3xl">
          Până acum am lucrat cu variabile individuale (o variabilă = o singură valoare). Un <strong>tablou unidimensional (vector)</strong> este o colecție ordonată de variabile de același tip, memorate în locații succesive și contigue de memorie RAM, accesibile printr-un nume comun și un indice (<code className="bg-blue-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono">v[i]</code>).
        </p>
      </div>

      {/* Simulator: Interactive RAM Memory Visualizer */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Vizualizator Interactiv: Alocarea Continuă în Memoria RAM (Manual pag. 78)
          </h3>
          <span className="text-xs text-slate-400 font-mono">int v[100]; // 4 octeți per element</span>
        </div>

        {/* The Vector Cells Representation */}
        <div className="space-y-3">
          <span className="text-xs text-slate-300 font-medium block">
            Fă click pe oricare celulă de mai jos pentru a inspecta adresa de memorie și valoarea din RAM:
          </span>

          <div className="grid grid-cols-5 gap-3">
            {elements.map((val, idx) => {
              const address = `0x${(baseAddress + idx * bytesPerElement).toString(16).toUpperCase()}`;
              const isSelected = selectedCellIdx === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-center space-y-1 ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 shadow-lg shadow-blue-500/20 scale-105'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    {address}
                  </div>
                  <div className="text-lg font-bold font-mono text-cyan-300">{val}</div>
                  <div className="text-xs font-semibold text-indigo-400 font-mono">
                    v[{idx}]
                  </div>
                  <div className="text-[9px] text-slate-500">4 Octeți</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected cell inspector */}
        {selectedCellIdx !== null ? (
          <div className="p-4 bg-slate-950 rounded-xl border border-blue-500/30 space-y-2 text-xs">
            <div className="flex justify-between items-center text-cyan-300 font-bold">
              <span>Element Selectat: <code className="text-amber-300 font-mono">v[{selectedCellIdx}]</code></span>
              <span className="text-[11px] font-mono text-slate-400">
                Adresă Fizică RAM: 0x{(baseAddress + selectedCellIdx * bytesPerElement).toString(16).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-300">Modifică valoarea din celulă:</span>
              <input
                type="number"
                value={elements[selectedCellIdx]}
                onChange={(e) => handleUpdateElement(selectedCellIdx, Number(e.target.value))}
                className="w-24 bg-slate-900 border border-slate-700 rounded p-1 font-mono text-cyan-300 text-center"
              />
              <span className="text-[11px] text-slate-500">
                Instrucțiunea C++ corespunzătoare: <code className="text-cyan-300 font-mono">v[{selectedCellIdx}] = {elements[selectedCellIdx]};</code>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-500 italic text-center">
            Apasă pe oricare dintre cele 5 celule de memorie pentru a vizualiza detaliile tehnice.
          </div>
        )}
      </div>

      {/* Code Snippet: Canonical Input and Output */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Sintaxa Canonică de Citire și Afișare a unui Vector (Manual pag. 78)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Read loop */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-sans font-bold text-xs block mb-1">1. Citirea vectorului de la tastatură:</span>
            <div className="text-slate-400">// n reprezintă numărul efectiv de elemente</div>
            <div className="text-slate-300"><span className="text-indigo-400">int</span> n, v[<span className="text-amber-300">100</span>];</div>
            <div className="text-slate-300">cin &gt;&gt; n;</div>
            <div className="text-slate-300">
              <span className="text-pink-400">for</span> (<span className="text-indigo-400">int</span> i = <span className="text-amber-300">0</span>; i &lt; n; i++) &#123;
            </div>
            <div className="pl-4 text-emerald-300">cin &gt;&gt; v[i];</div>
            <div className="text-slate-300">&#125;</div>
          </div>

          {/* Print loop */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-purple-400 font-sans font-bold text-xs block mb-1">2. Afișarea vectorului pe ecran:</span>
            <div className="text-slate-400">// Se parcurg indicii de la 0 la n - 1</div>
            <div className="text-slate-300">
              <span className="text-pink-400">for</span> (<span className="text-indigo-400">int</span> i = <span className="text-amber-300">0</span>; i &lt; n; i++) &#123;
            </div>
            <div className="pl-4 text-purple-300">cout &lt;&lt; v[i] &lt;&lt; <span className="text-amber-200">" "</span>;</div>
            <div className="text-slate-300">&#125;</div>
            <div className="text-slate-300">cout &lt;&lt; endl;</div>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Verificare Regulamentară C++ (Manual pag. 77–78)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              Dacă declarăm vectorul <code className="text-amber-300 font-mono">int v[10];</code>, care sunt indicii valizi pentru elementele acestui tablou în limbajul C++?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'De la 1 la 10' },
                { id: 'b', label: 'De la 0 la 9 (indexarea începe întotdeauna de la 0, iar ultimul element este la dimensiune - 1)' },
                { id: 'c', label: 'De la -5 la +5' }
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
              Ce se întâmplă dacă un program încearcă să citească sau să modifice <code className="text-rose-400 font-mono">v[10]</code> într-un vector declarat de 10 elemente (<code className="text-amber-300 font-mono">int v[10];</code>)?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Depășire de tablou (Out of Bounds / Segment Violations) — acces la o zonă de memorie nealocată, provocând erori imprevizibile sau blocarea programului' },
                { id: 'b', label: 'Vectorul se extinde automat la 11 elemente' },
                { id: 'c', label: 'Valoarea se salvează automat pe desktop' }
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
              ? 'Excelent! Ai înțeles declararea vectorilor, indexarea de la 0 și alocarea în memoria RAM.'
              : 'Inspectează cel puțin o celulă din memoria RAM și răspunde corect la cele 2 întrebări.'}
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
          <span>Următorul Nivel: Parcurgere, Sumă & Min/Max</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
