import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowDown, ArrowUp, Play, RotateCcw, AlertTriangle, Layers, Cpu, Database } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface CodeLineItem {
  id: string;
  code: string;
  category: 'decl' | 'read' | 'calc' | 'write';
  labelRo: string;
  labelEn: string;
  correctStep: number; // 1 to 4
  explanationRo: string;
  explanationEn: string;
}

const INITIAL_SHUFFLED_LINES: CodeLineItem[] = [
  {
    id: 'l3',
    code: 'suma = a + b;',
    category: 'calc',
    labelRo: 'Pasul 3: Prelucrare / Calcul',
    labelEn: 'Step 3: Processing / Computation',
    correctStep: 3,
    explanationRo: 'Calculul se poate efectua DOAR DUPĂ ce variabilele a și b au primit valori valide de la tastatură.',
    explanationEn: 'Computation can ONLY occur AFTER variables a and b have received valid values from keyboard input.'
  },
  {
    id: 'l1',
    code: 'int a, b, suma;',
    category: 'decl',
    labelRo: 'Pasul 1: Declarare Variabile',
    labelEn: 'Step 1: Variable Declaration',
    correctStep: 1,
    explanationRo: 'Înainte de orice, compilatorul trebuie să aloce memorie în RAM pentru variabilele pe care le vom folosi.',
    explanationEn: 'Before anything else, compiler must reserve RAM memory slots for variables that will be used.'
  },
  {
    id: 'l4',
    code: 'cout << "Suma = " << suma << endl;',
    category: 'write',
    labelRo: 'Pasul 4: Afișare Rezultat',
    labelEn: 'Step 4: Output Result',
    correctStep: 4,
    explanationRo: 'Afișăm rezultatul final pe ecran numai DUPĂ ce suma a fost calculată corect.',
    explanationEn: 'We display the final result on screen only AFTER the sum has been correctly computed.'
  },
  {
    id: 'l2',
    code: 'cin >> a >> b;',
    category: 'read',
    labelRo: 'Pasul 2: Citire Date de Intrare',
    labelEn: 'Step 2: Read Input Data',
    correctStep: 2,
    explanationRo: 'Preluăm datele de la utilizator de la tastatură și le memorăm în variabilele deja declarate.',
    explanationEn: 'We capture keyboard input from user and store values into already declared variables.'
  }
];

export const CP2Level2_LinearExecutionOrder: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [lines, setLines] = useState<CodeLineItem[]>(INITIAL_SHUFFLED_LINES);
  const [executionStep, setExecutionStep] = useState<number>(-1); // -1: not started, 0..3: running
  const [ramA, setRamA] = useState<number | string>(lang === 'ro' ? '? (Nedefinit)' : '? (Undefined)');
  const [ramB, setRamB] = useState<number | string>(lang === 'ro' ? '? (Nedefinit)' : '? (Undefined)');
  const [ramSuma, setRamSuma] = useState<number | string>(lang === 'ro' ? '? (Nedefinit)' : '? (Undefined)');
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
    setRamA(lang === 'ro' ? '? (Nedefinit)' : '? (Undefined)');
    setRamB(lang === 'ro' ? '? (Nedefinit)' : '? (Undefined)');
    setRamSuma(lang === 'ro' ? '? (Nedefinit)' : '? (Undefined)');
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
      setOrderFeedback(
        lang === 'ro'
          ? 'Ordinea este perfectă! Declarare (1) -> Citire (2) -> Calcul (3) -> Afișare (4). Apasă "Execută Pas cu Pas" pentru a rula algoritmul pe procesor.'
          : 'Order is perfect! Declare (1) -> Read (2) -> Calculate (3) -> Display (4). Click "Start Step-by-Step Execution" to run instructions on CPU.'
      );
    } else {
      sounds.playError();
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].correctStep !== i + 1) {
          setOrderFeedback(
            lang === 'ro'
              ? `Atenție la linia ${i + 1} (${lines[i].code}). ${lines[i].explanationRo}`
              : `Watch out for line ${i + 1} (${lines[i].code}). ${lines[i].explanationEn}`
          );
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
      setConsoleLog(prev => [
        ...prev,
        lang === 'ro'
          ? '[RAM] Alocat 3 spații de memorie int (4 octeți fiecare).'
          : '[RAM] Allocated 3 integer memory slots (4 bytes each).'
      ]);
    } else if (currentLine.category === 'read') {
      setRamA(15);
      setRamB(27);
      setConsoleLog(prev => [
        ...prev,
        lang === 'ro'
          ? '[cin] Utilizatorul a tastat: 15 și 27. Valori stocate în a și b.'
          : '[cin] User typed: 15 and 27. Values stored in a and b.'
      ]);
    } else if (currentLine.category === 'calc') {
      if (typeof ramA === 'number' && typeof ramB === 'number') {
        const sum = ramA + ramB;
        setRamSuma(sum);
        setConsoleLog(prev => [
          ...prev,
          lang === 'ro'
            ? `[ALU/Calcul] suma = ${ramA} + ${ramB} => ${sum} memorat în suma.`
            : `[ALU/Compute] suma = ${ramA} + ${ramB} => ${sum} stored in suma.`
        ]);
      } else {
        setRamSuma(lang === 'ro' ? 'Eroare: Valoare Coruptă!' : 'Error: Corrupt Value!');
        setConsoleLog(prev => [
          ...prev,
          lang === 'ro'
            ? '[EROARE CRITICĂ] S-a calculat suma înainte de citirea valorilor! Rezultatul este nedefinit (garbage value).'
            : '[CRITICAL ERROR] Sum computed before input was read! Result is undefined garbage value.'
        ]);
      }
    } else if (currentLine.category === 'write') {
      setConsoleLog(prev => [
        ...prev,
        lang === 'ro'
          ? `[cout / Consolă] Suma = ${ramSuma}`
          : `[cout / Console] Sum = ${ramSuma}`
      ]);
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
              <span>
                {lang === 'ro'
                  ? 'Nivelul 2 • Clasa a VII-a • Manual Art Klett pag. 74'
                  : 'Level 2 • 7th Grade • Art Klett Textbook p. 74'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'ro'
                ? 'Structura Liniară & Secvențialitatea Instrucțiunilor'
                : 'Linear Structure & Instruction Sequentiality'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {lang === 'ro' ? (
                <>
                  Un algoritm liniar execută instrucțiunile <strong>strict pas cu pas, de sus în jos</strong>, o singură dată. Ordinea pașilor este sfântă: Declarare &rarr; Citire &rarr; Prelucrare &rarr; Afișare!
                </>
              ) : (
                <>
                  A linear algorithm executes instructions <strong>strictly step-by-step, top to bottom</strong>, exactly once. The sequence is vital: Declaration &rarr; Read &rarr; Computation &rarr; Output!
                </>
              )}
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-blue-500/20">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Concept Cheie' : 'Key Concept'}
            </span>
            <span className="text-sm font-bold text-blue-300 font-mono">
              {lang === 'ro' ? 'Secvențialitate Strictă' : 'Strict Sequentiality'}
            </span>
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
                <span>{lang === 'ro' ? 'Ordonează Instrucțiunile Algoritmului' : 'Order Algorithm Instructions'}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {lang === 'ro' ? 'Folosește butoanele ▲ / ▼' : 'Use buttons ▲ / ▼'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              {lang === 'ro'
                ? 'Instrucțiunile de mai jos sunt amestecate. Rearanjează-le în ordinea logică pentru a calcula corect suma a două numere.'
                : 'The instructions below are shuffled. Rearrange them in logical order to correctly compute the sum of two numbers.'}
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
                        <div className="text-[11px] text-slate-400 font-sans">
                          {lang === 'ro' ? line.labelRo : line.labelEn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0 || executionStep !== -1}
                        className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition border border-slate-700"
                        title={lang === 'ro' ? 'Mută mai sus' : 'Move up'}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === lines.length - 1 || executionStep !== -1}
                        className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition border border-slate-700"
                        title={lang === 'ro' ? 'Mută mai jos' : 'Move down'}
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
              {lang === 'ro' ? 'Verifică Ordinea' : 'Check Order'}
            </button>

            {isOrderValid && executionStep === -1 && (
              <button
                type="button"
                onClick={handleStepExecution}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 animate-pulse"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{lang === 'ro' ? 'Pornește Execuția Pas cu Pas' : 'Start Step-by-Step Execution'}</span>
              </button>
            )}

            {executionStep >= 0 && executionStep < lines.length - 1 && (
              <button
                type="button"
                onClick={handleStepExecution}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {lang === 'ro'
                    ? `Următorul Pas (${executionStep + 2} / ${lines.length})`
                    : `Next Step (${executionStep + 2} / ${lines.length})`}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={resetSimulation}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-medium transition cursor-pointer border border-slate-700 ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Resetează' : 'Reset'}</span>
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
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ro' ? 'Memorie RAM (4 octeți / int)' : 'RAM Memory (4 bytes / int)'}</span>
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">Live Hardware State</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">
                  {lang === 'ro' ? 'Variabila ' : 'Variable '}
                  <strong className="text-amber-300">int a</strong>:
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${typeof ramA === 'number' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-900 text-slate-500'}`}>
                  {ramA}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">
                  {lang === 'ro' ? 'Variabila ' : 'Variable '}
                  <strong className="text-amber-300">int b</strong>:
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${typeof ramB === 'number' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-900 text-slate-500'}`}>
                  {ramB}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">
                  {lang === 'ro' ? 'Variabila ' : 'Variable '}
                  <strong className="text-amber-300">int suma</strong>:
                </span>
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
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{lang === 'ro' ? 'Tabela de Urmărire (Trace Log)' : 'Trace Table (Execution Log)'}</span>
                </span>
                <span className="text-[10px] text-slate-600 font-mono">
                  {lang === 'ro' ? 'Consolă Execuție' : 'Execution Console'}
                </span>
              </div>

              <div className="font-mono text-xs space-y-1.5 min-h-[120px] max-h-[160px] overflow-y-auto pr-1">
                {consoleLog.length === 0 ? (
                  <span className="text-slate-600 italic">
                    {lang === 'ro'
                      ? 'Apasă pe "Verifică Ordinea" și apoi "Execută Pas cu Pas" pentru a vedea cum rulează procesorul instrucțiunile...'
                      : 'Click "Check Order" and then "Start Step-by-Step Execution" to see how the CPU runs instructions...'}
                  </span>
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
                  <span>
                    {lang === 'ro'
                      ? 'Bravo! Mergi la Nivelul 3: Operatori & Modulo'
                      : 'Well Done! Advance to Level 3: Operators & Modulo'}
                  </span>
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
