import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowDown, ArrowUp, Play, RotateCcw, AlertTriangle, Layers, Cpu, Database, Eye } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface CodeLineItem {
  id: string;
  code: string;
  category: 'decl' | 'read' | 'calc' | 'write';
  label: string;
  correctStep: number; // 1 to 4
  explanation: string;
}

const INITIAL_SHUFFLED_LINES: CodeLineItem[] = [
  {
    id: 'l3',
    code: 'suma = a + b;',
    category: 'calc',
    label: 'Pasul 3: Prelucrare / Calcul',
    correctStep: 3,
    explanation: 'Calculul se poate efectua DOAR DUPĂ ce variabilele a și b au primit valori valide de la tastatură.'
  },
  {
    id: 'l1',
    code: 'int a, b, suma;',
    category: 'decl',
    label: 'Pasul 1: Declarare Variabile',
    correctStep: 1,
    explanation: 'Înainte de orice, compilatorul trebuie să aloce memorie în RAM pentru variabilele pe care le vom folosi.'
  },
  {
    id: 'l4',
    code: 'cout << "Suma = " << suma << endl;',
    category: 'write',
    label: 'Pasul 4: Afișare Rezultat',
    correctStep: 4,
    explanation: 'Afișăm rezultatul final pe ecran numai DUPĂ ce suma a fost calculată corect.'
  },
  {
    id: 'l2',
    code: 'cin >> a >> b;',
    category: 'read',
    label: 'Pasul 2: Citire Date de Intrare',
    correctStep: 2,
    explanation: 'Preluăm datele de la utilizator de la tastatură și le memorăm în variabilele deja declarate.'
  }
];

export const CP2Level2_LinearExecutionOrder: React.FC<Props> = ({ onPass }) => {
  const [lines, setLines] = useState<CodeLineItem[]>(INITIAL_SHUFFLED_LINES);
  const [executionStep, setExecutionStep] = useState<number>(-1); // -1: not started, 0..3: running
  const [ramA, setRamA] = useState<number | string>('? (Nedefinit)');
  const [ramB, setRamB] = useState<number | string>('? (Nedefinit)');
  const [ramSuma, setRamSuma] = useState<number | string>('? (Nedefinit)');
  const [consoleLog, setConsoleLog] = useState<string[]>([]);
  const [isOrderValid, setIsOrderValid] = useState<boolean | null>(null);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    sounds.playClick();
    const updated = [...lines];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setLines(updated);
    resetSimulation();
  };

  const moveDown = (index: number) => {
    if (index === lines.length - 1) return;
    sounds.playClick();
    const updated = [...lines];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setLines(updated);
    resetSimulation();
  };

  const resetSimulation = () => {
    setExecutionStep(-1);
    setRamA('? (Nedefinit)');
    setRamB('? (Nedefinit)');
    setRamSuma('? (Nedefinit)');
    setConsoleLog([]);
    setIsOrderValid(null);
    setOrderFeedback(null);
  };

  const checkOrder = () => {
    sounds.playClick();
    const isCorrect = lines.every((item, idx) => item.correctStep === idx + 1);
    setIsOrderValid(isCorrect);

    if (isCorrect) {
      sounds.playSuccess();
      setOrderFeedback('Ordinea este perfectă! Declarare (1) -> Citire (2) -> Calcul (3) -> Afișare (4). Apasă "Execută Pas cu Pas" pentru a rula algoritmul pe procesor.');
    } else {
      sounds.playError();
      // Find first mistake
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].correctStep !== i + 1) {
          setOrderFeedback(`Atenție la linia ${i + 1} (${lines[i].code}). ${lines[i].explanation}`);
          break;
        }
      }
    }
  };

  const handleStepExecution = () => {
    sounds.playClick();
    const nextStep = executionStep + 1;

    if (nextStep >= lines.length) {
      return;
    }

    setExecutionStep(nextStep);
    const currentLine = lines[nextStep];

    if (currentLine.category === 'decl') {
      setRamA('0x?? (Garbage RAM)');
      setRamB('0x?? (Garbage RAM)');
      setRamSuma('0x?? (Garbage RAM)');
      setConsoleLog(prev => [...prev, '[RAM] Alocat 3 spații de memorie int (4 octeți fiecare).']);
    } else if (currentLine.category === 'read') {
      setRamA(15);
      setRamB(27);
      setConsoleLog(prev => [...prev, '[cin] Utilizatorul a tastat: 15 și 27. Valori stocate în a și b.']);
    } else if (currentLine.category === 'calc') {
      if (typeof ramA === 'number' && typeof ramB === 'number') {
        const sum = ramA + ramB;
        setRamSuma(sum);
        setConsoleLog(prev => [...prev, `[ALU/Calcul] suma = ${ramA} + ${ramB} => ${sum} memorat în suma.`]);
      } else {
        setRamSuma('Eroare: Valoare Coruptă!');
        setConsoleLog(prev => [...prev, '[EROARE CRITICĂ] S-a calculat suma înainte de citirea valorilor! Rezultatul este nedefinit (garbage value).']);
      }
    } else if (currentLine.category === 'write') {
      setConsoleLog(prev => [...prev, `[cout / Consolă] Suma = ${ramSuma}`]);
    }
  };

  const handlePassLevel = () => {
    sounds.playLevelUp();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Nivelul 2 • Clasa a VII-a • Manual Art Klett pag. 74</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Structura Liniară &amp; Secvențialitatea Instrucțiunilor
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Un algoritm liniar execută instrucțiunile <strong>strict pas cu pas, de sus în jos</strong>, o singură dată. Ordinea pașilor este sfântă: Declarare &rarr; Citire &rarr; Prelucrare &rarr; Afișare!
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-blue-500/20">
            <span className="text-xs text-slate-400 font-mono">Concept Cheie</span>
            <span className="text-sm font-bold text-blue-300 font-mono">Secvențialitate Strictă</span>
          </div>
        </div>
      </div>

      {/* Interactive Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Code Order Builder (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/95 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Ordonează Instrucțiunile Algoritmului</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Folosește butoanele ▲ / ▼</span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Instrucțiunile de mai jos sunt amestecate. Rearanjează-le în ordinea logică pentru a calcula corect suma a două numere.
            </p>

            <div className="space-y-3">
              {lines.map((line, idx) => {
                const isCurrentActive = executionStep === idx;
                return (
                  <div
                    key={line.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrentActive
                        ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-mono text-sm font-bold text-emerald-300">{line.code}</div>
                        <div className="text-[11px] text-slate-400 font-sans">{line.label}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0 || executionStep !== -1}
                        className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition border border-slate-700"
                        title="Mută mai sus"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === lines.length - 1 || executionStep !== -1}
                        className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition border border-slate-700"
                        title="Mută mai jos"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={checkOrder}
              disabled={executionStep !== -1}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-blue-600/20"
            >
              Verifică Ordinea
            </button>

            {isOrderValid && executionStep === -1 && (
              <button
                type="button"
                onClick={handleStepExecution}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 animate-pulse"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Pornește Execuția Pas cu Pas</span>
              </button>
            )}

            {executionStep >= 0 && executionStep < lines.length - 1 && (
              <button
                type="button"
                onClick={handleStepExecution}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Următorul Pas ({executionStep + 2} / {lines.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetSimulation}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-medium transition cursor-pointer border border-slate-700 ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetează</span>
            </button>
          </div>

          {orderFeedback && (
            <div className={`mt-4 p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2 ${
              isOrderValid ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
            }`}>
              {isOrderValid ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
              <span>{orderFeedback}</span>
            </div>
          )}
        </div>

        {/* Right Col: Hardware Architecture & Trace Table Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Virtual RAM Cells */}
          <div className="bg-slate-900/95 rounded-3xl border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" /> Memorie RAM (4 octeți / int)
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">Live Hardware State</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Variabila <strong className="text-amber-300">int a</strong>:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${typeof ramA === 'number' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-900 text-slate-500'}`}>
                  {ramA}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Variabila <strong className="text-amber-300">int b</strong>:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${typeof ramB === 'number' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-900 text-slate-500'}`}>
                  {ramB}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Variabila <strong className="text-amber-300">int suma</strong>:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${typeof ramSuma === 'number' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-900 text-slate-500'}`}>
                  {ramSuma}
                </span>
              </div>
            </div>
          </div>

          {/* Trace Execution Log / Terminal */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Tabela de Urmărire (Trace Log)
                </span>
                <span className="text-[10px] text-slate-600 font-mono">Consolă Execuție</span>
              </div>

              <div className="font-mono text-xs space-y-1.5 min-h-[120px] max-h-[160px] overflow-y-auto pr-1">
                {consoleLog.length === 0 ? (
                  <span className="text-slate-600 italic">Apasă pe "Verifică Ordinea" și apoi "Execută Pas cu Pas" pentru a vedea cum rulează procesorul instrucțiunile...</span>
                ) : (
                  consoleLog.map((log, lIdx) => (
                    <div key={lIdx} className="text-slate-300 border-l-2 border-indigo-500 pl-2 py-0.5">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {executionStep === lines.length - 1 && isOrderValid && (
              <div className="mt-4 pt-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={handlePassLevel}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <span>Bravo! Mergi la Nivelul 3: Operatori &amp; Modulo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
