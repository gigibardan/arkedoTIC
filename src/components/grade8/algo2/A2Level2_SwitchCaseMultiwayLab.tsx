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
  ToggleLeft,
  ToggleRight,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A2Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A2Level2_SwitchCaseMultiwayLab: React.FC<A2Level2Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Day of week selector
  const [selectedDay, setSelectedDay] = useState<number>(3);
  const [hasBreak, setHasBreak] = useState<boolean>(true);
  const [executionOutput, setExecutionOutput] = useState<string[]>([]);
  const [testedBothBreakStates, setTestedBothBreakStates] = useState<{ withBreak: boolean; withoutBreak: boolean }>({
    withBreak: false,
    withoutBreak: false
  });

  // Quiz questions
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [calculatorOp, setCalculatorOp] = useState<string>('+');
  const [calcA, setCalcA] = useState<number>(12);
  const [calcB, setCalcB] = useState<number>(4);

  const runSwitchSimulation = () => {
    sounds.playClick();
    const logs: string[] = [];

    if (hasBreak) {
      switch (selectedDay) {
        case 1:
          logs.push('Luni: Curs de Informatică & Algoritmi');
          break;
        case 2:
          logs.push('Marți: Laborator de Fizică Aplicată');
          break;
        case 3:
          logs.push('Miercuri: Matematică & Geometrie');
          break;
        case 4:
          logs.push('Joi: Educație Tehnologică');
          break;
        case 5:
          logs.push('Vineri: Proiecte TIC & Robotică');
          break;
        case 6:
        case 7:
          logs.push('Weekend: Odihnă & Activități în aer liber');
          break;
        default:
          logs.push('Eroare: Zi invalidă! Alege un număr între 1 și 7.');
      }
      setTestedBothBreakStates((prev) => ({ ...prev, withBreak: true }));
    } else {
      // Fall-through simulation!
      logs.push('⚠️ ATENȚIE: Instrucțiunea BREAK a fost dezactivată! Se produce fenomenul FALL-THROUGH:');
      let fall = false;
      if (selectedDay === 1 || fall) {
        logs.push('[Case 1 executat] Luni: Curs de Informatică & Algoritmi');
        fall = true;
      }
      if (selectedDay === 2 || fall) {
        logs.push('[Case 2 executat] Marți: Laborator de Fizică Aplicată');
        fall = true;
      }
      if (selectedDay === 3 || fall) {
        logs.push('[Case 3 executat] Miercuri: Matematică & Geometrie');
        fall = true;
      }
      if (selectedDay === 4 || fall) {
        logs.push('[Case 4 executat] Joi: Educație Tehnologică');
        fall = true;
      }
      if (selectedDay === 5 || fall) {
        logs.push('[Case 5 executat] Vineri: Proiecte TIC & Robotică');
        fall = true;
      }
      if (selectedDay === 6 || selectedDay === 7 || fall) {
        logs.push('[Case 6/7 executat] Weekend: Odihnă & Activități');
        fall = true;
      }
      if (selectedDay < 1 || selectedDay > 7 || fall) {
        logs.push('[Default executat] Zi invalidă!');
      }
      setTestedBothBreakStates((prev) => ({ ...prev, withoutBreak: true }));
    }

    setExecutionOutput(logs);
    sounds.playCorrect();
  };

  const getCalcResult = () => {
    switch (calculatorOp) {
      case '+':
        return calcA + calcB;
      case '-':
        return calcA - calcB;
      case '*':
        return calcA * calcB;
      case '/':
        return calcB !== 0 ? Math.floor(calcA / calcB) : 'Eroare: Împărțire la 0!';
      case '%':
        return calcB !== 0 ? calcA % calcB : 'Eroare: Modulo 0!';
      default:
        return 'Operator invalid';
    }
  };

  const isLevelCompleted =
    testedBothBreakStates.withBreak &&
    testedBothBreakStates.withoutBreak &&
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
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-950 rounded-2xl p-6 text-white shadow-xl border border-blue-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30 text-blue-300">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Modulul 3B • Nivelul 2 din 7
                </span>
                <span className="text-xs text-blue-300">Manual Art Klett pag. 66–67</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Structura de Selecție Multiplă: switch / case & Efectul break
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 2: Selecție Multiplă</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-3xl">
          Când o variabilă poate lua mai multe valori discrete (de exemplu meniu de opțiuni, zilele săptămânii, operații matematice), o cascadă lungă de <code className="bg-blue-950 px-1 rounded text-cyan-300">if ... else if ... else if</code> devine greu de citit. Structura <code className="bg-blue-950 px-1 rounded text-cyan-300">switch (expresie)</code> oferă o ramificare elegantă și rapidă!
        </p>
      </div>

      {/* Simulator: Day of Week & The Break Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Configurare Execuție switch
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex justify-between">
              <span>Selectează Ziua Săptămânii (<code className="text-amber-300">zi</code>):</span>
              <span className="font-bold text-cyan-400 font-mono">zi = {selectedDay}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { val: 1, label: '1: Luni' },
                { val: 2, label: '2: Marți' },
                { val: 3, label: '3: Miercuri' },
                { val: 4, label: '4: Joi' },
                { val: 5, label: '5: Vineri' },
                { val: 6, label: '6: Sâmbătă' },
                { val: 7, label: '7: Duminică' },
                { val: 99, label: '99: Invalid' }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => {
                    setSelectedDay(item.val);
                    setExecutionOutput([]);
                  }}
                  className={`p-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                    selectedDay === item.val
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle break */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                Include instrucțiunea <code className="text-pink-400 font-mono">break;</code>
              </span>
              <button
                onClick={() => {
                  setHasBreak(!hasBreak);
                  setExecutionOutput([]);
                }}
                className="flex items-center text-xs font-medium gap-1 text-slate-300 hover:text-white"
              >
                {hasBreak ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-rose-400" />
                )}
                <span className={hasBreak ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {hasBreak ? 'ACTIV (Normal)' : 'DEZACTIVAT (Fall-through)'}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {hasBreak
                ? 'Cu break: execuția părăsește switch-ul imediat ce a executat cazul selectat.'
                : 'Fără break: execuția "cade" prin toate instrucțiunile cazurilor următoare (fall-through)!'}
            </p>
          </div>

          <button
            onClick={runSwitchSimulation}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Execută switch(zi) în Consola C++
          </button>

          {/* Progress badges for both tests */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                testedBothBreakStates.withBreak
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Testat CU break</span>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                testedBothBreakStates.withoutBreak
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Testat FĂRĂ break</span>
            </div>
          </div>
        </div>

        {/* Right: Code Inspector & Virtual Console */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Vizualizator Cod Sursă & Terminal
            </h3>
            <span className="text-xs text-slate-400 font-mono">switch(zi)</span>
          </div>

          {/* C++ Code Display */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
            <div><span className="text-pink-400 font-semibold">switch</span> (zi) &#123;</div>
            <div className={`pl-4 ${selectedDay === 1 ? 'bg-blue-950/70 text-cyan-300 font-bold' : ''}`}>
              <span className="text-pink-400">case</span> 1: cout &lt;&lt; <span className="text-amber-200">"Luni"</span>; {hasBreak ? <span className="text-purple-300">break;</span> : <span className="text-rose-400">// break lipsa!</span>}
            </div>
            <div className={`pl-4 ${selectedDay === 2 ? 'bg-blue-950/70 text-cyan-300 font-bold' : ''}`}>
              <span className="text-pink-400">case</span> 2: cout &lt;&lt; <span className="text-amber-200">"Marti"</span>; {hasBreak ? <span className="text-purple-300">break;</span> : <span className="text-rose-400">// break lipsa!</span>}
            </div>
            <div className={`pl-4 ${selectedDay === 3 ? 'bg-blue-950/70 text-cyan-300 font-bold' : ''}`}>
              <span className="text-pink-400">case</span> 3: cout &lt;&lt; <span className="text-amber-200">"Miercuri"</span>; {hasBreak ? <span className="text-purple-300">break;</span> : <span className="text-rose-400">// break lipsa!</span>}
            </div>
            <div className={`pl-4 ${selectedDay === 4 ? 'bg-blue-950/70 text-cyan-300 font-bold' : ''}`}>
              <span className="text-pink-400">case</span> 4: cout &lt;&lt; <span className="text-amber-200">"Joi"</span>; {hasBreak ? <span className="text-purple-300">break;</span> : <span className="text-rose-400">// break lipsa!</span>}
            </div>
            <div className={`pl-4 ${selectedDay === 5 ? 'bg-blue-950/70 text-cyan-300 font-bold' : ''}`}>
              <span className="text-pink-400">case</span> 5: cout &lt;&lt; <span className="text-amber-200">"Vineri"</span>; {hasBreak ? <span className="text-purple-300">break;</span> : <span className="text-rose-400">// break lipsa!</span>}
            </div>
            <div className={`pl-4 ${selectedDay === 6 || selectedDay === 7 ? 'bg-blue-950/70 text-cyan-300 font-bold' : ''}`}>
              <span className="text-pink-400">case</span> 6: <span className="text-pink-400">case</span> 7: cout &lt;&lt; <span className="text-amber-200">"Weekend"</span>; {hasBreak ? <span className="text-purple-300">break;</span> : <span className="text-rose-400">// break lipsa!</span>}
            </div>
            <div className={`pl-4 ${selectedDay < 1 || selectedDay > 7 ? 'bg-blue-950/70 text-cyan-300 font-bold' : ''}`}>
              <span className="text-pink-400">default</span>: cout &lt;&lt; <span className="text-amber-200">"Zi invalida!"</span>;
            </div>
            <div>&#125;</div>
          </div>

          {/* Console Output */}
          <div className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 min-h-[100px]">
            <div className="text-slate-500 text-[11px]">// Ieșire consolă (Standard Output):</div>
            {executionOutput.length === 0 ? (
              <span className="text-slate-600 italic">Apasă „Execută switch(zi)” pentru a vedea ieșirea în consolă...</span>
            ) : (
              executionOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('⚠️')
                      ? 'text-amber-400 font-bold'
                      : line.startsWith('[Default')
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Real-life Application: Mini Calculator with switch(op) */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          Aplicație Practică: Calculator Aritmetic bazat pe <code className="text-purple-300 font-mono">switch(op)</code> (Manual pag. 67)
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">a:</span>
            <input
              type="number"
              value={calcA}
              onChange={(e) => setCalcA(Number(e.target.value))}
              className="w-16 bg-slate-950 border border-slate-700 rounded p-1 text-center font-mono text-xs text-cyan-300"
            />
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-xs text-slate-400">op:</span>
            {['+', '-', '*', '/', '%'].map((op) => (
              <button
                key={op}
                onClick={() => {
                  setCalculatorOp(op);
                  sounds.playClick();
                }}
                className={`w-8 h-8 rounded font-mono font-bold text-xs transition-colors ${
                  calculatorOp === op
                    ? 'bg-purple-600 text-white border border-purple-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">b:</span>
            <input
              type="number"
              value={calcB}
              onChange={(e) => setCalcB(Number(e.target.value))}
              className="w-16 bg-slate-950 border border-slate-700 rounded p-1 text-center font-mono text-xs text-cyan-300"
            />
          </div>

          <div className="flex items-center space-x-2 pl-2">
            <span className="text-xs text-slate-400">=</span>
            <span className="px-3 py-1 bg-purple-950 border border-purple-500/50 rounded font-mono font-bold text-purple-300 text-sm">
              {getCalcResult()}
            </span>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Verificare Regulamentară C++ (Manual pag. 66–67)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              Ce tipuri de date poate evalua expresia dintr-o instrucțiune <code className="text-pink-400 font-mono">switch(expresie)</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Orice tip de date, inclusiv numere reale cu virgulă (double, float)' },
                { id: 'b', label: 'Doar texte de tip șir de caractere (string)' },
                { id: 'c', label: 'Doar tipuri întregi ordinale (int, char, bool) — NU permite tipuri reale!' }
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
                  <span>{opt.label}</span>
                  {q1Answer === opt.id && opt.id === 'c' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 2:</span>
            <p className="text-xs text-slate-300">
              Care este rolul clauzei opționale <code className="text-pink-400 font-mono">default:</code> într-un bloc switch?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Este obligatorie și se execută mereu prima' },
                { id: 'b', label: 'Se execută doar când valoarea expresiei nu se potrivește cu niciunul dintre cazurile case definite' },
                { id: 'c', label: 'Oprește calculatorul în caz de eroare critică' }
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
              ? 'Excelent! Ai explorat selecția multiplă și ai înțeles efectul break vs fall-through.'
              : 'Testează simulatorul atât CU break cât și FĂRĂ break și răspunde corect la cele două întrebări.'}
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
          <span>Următorul Nivel: Min/Max & Triunghiuri</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
