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
import { useLanguage } from '../../../context/LanguageContext';

interface A2Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A2Level2_SwitchCaseMultiwayLab: React.FC<A2Level2Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

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
      if (lang === 'ro') {
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
      } else {
        switch (selectedDay) {
          case 1:
            logs.push('Monday: Computer Science & Algorithms Lecture');
            break;
          case 2:
            logs.push('Tuesday: Applied Physics Lab');
            break;
          case 3:
            logs.push('Wednesday: Mathematics & Geometry');
            break;
          case 4:
            logs.push('Thursday: Technological Education');
            break;
          case 5:
            logs.push('Friday: ICT & Robotics Projects');
            break;
          case 6:
          case 7:
            logs.push('Weekend: Rest & Outdoor Recreation');
            break;
          default:
            logs.push('Error: Invalid day! Select an integer between 1 and 7.');
        }
      }
      setTestedBothBreakStates((prev) => ({ ...prev, withBreak: true }));
    } else {
      // Fall-through simulation!
      logs.push(
        lang === 'ro'
          ? '⚠️ ATENȚIE: Instrucțiunea BREAK a fost dezactivată! Se produce fenomenul FALL-THROUGH:'
          : '⚠️ WARNING: BREAK statements are disabled! FALL-THROUGH cascade in progress:'
      );
      let fall = false;
      if (selectedDay === 1 || fall) {
        logs.push(lang === 'ro' ? '[Case 1 executat] Luni: Curs de Informatică & Algoritmi' : '[Case 1 executed] Monday: CS & Algorithms');
        fall = true;
      }
      if (selectedDay === 2 || fall) {
        logs.push(lang === 'ro' ? '[Case 2 executat] Marți: Laborator de Fizică Aplicată' : '[Case 2 executed] Tuesday: Applied Physics');
        fall = true;
      }
      if (selectedDay === 3 || fall) {
        logs.push(lang === 'ro' ? '[Case 3 executat] Miercuri: Matematică & Geometrie' : '[Case 3 executed] Wednesday: Math & Geometry');
        fall = true;
      }
      if (selectedDay === 4 || fall) {
        logs.push(lang === 'ro' ? '[Case 4 executat] Joi: Educație Tehnologică' : '[Case 4 executed] Thursday: Tech Education');
        fall = true;
      }
      if (selectedDay === 5 || fall) {
        logs.push(lang === 'ro' ? '[Case 5 executat] Vineri: Proiecte TIC & Robotică' : '[Case 5 executed] Friday: ICT & Robotics');
        fall = true;
      }
      if (selectedDay === 6 || selectedDay === 7 || fall) {
        logs.push(lang === 'ro' ? '[Case 6/7 executat] Weekend: Odihnă & Activități' : '[Case 6/7 executed] Weekend: Rest & Recreation');
        fall = true;
      }
      if (selectedDay < 1 || selectedDay > 7 || fall) {
        logs.push(lang === 'ro' ? '[Default executat] Zi invalidă!' : '[Default executed] Invalid day!');
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
        return calcB !== 0
          ? Math.floor(calcA / calcB)
          : (lang === 'ro' ? 'Eroare: Împărțire la 0!' : 'Error: Division by 0!');
      case '%':
        return calcB !== 0
          ? calcA % calcB
          : (lang === 'ro' ? 'Eroare: Modulo 0!' : 'Error: Modulo by 0!');
      default:
        return lang === 'ro' ? 'Operator invalid' : 'Invalid operator';
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
                  {lang === 'ro' ? 'Modulul 3B • Nivelul 2 din 7' : 'Module 3B • Level 2 of 7'}
                </span>
                <span className="text-xs text-blue-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 66–67' : 'Art Klett Textbook pp. 66–67'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Structura de Selecție Multiplă: switch / case & Efectul break'
                  : 'Multiway Selection Structure: switch / case & the break Effect'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 2: Selecție Multiplă' : 'Level 2: Multiway Selection'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'Când o variabilă poate lua mai multe valori discrete (de exemplu meniu de opțiuni, zilele săptămânii, operații matematice), o cascadă lungă de if ... else if ... else if devine greu de citit. Structura switch (expresie) oferă o ramificare elegantă și rapidă!'
            : 'When a variable can evaluate to several discrete integral values (e.g., interactive menus, days of the week, arithmetic operators), a long cascade of if ... else if ... else if becomes cumbersome. The switch (expression) statement provides clean, highly readable, multi-branch routing!'}
        </p>
      </div>

      {/* Simulator: Day of Week & The Break Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code2 className="w-4 h-4 text-cyan-400" />
            {lang === 'ro' ? 'Configurare Execuție switch' : 'Configure switch Execution'}
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex justify-between">
              <span>{lang === 'ro' ? 'Selectează Ziua Săptămânii (zi):' : 'Select Day of Week (day):'}</span>
              <span className="font-bold text-cyan-400 font-mono">zi = {selectedDay}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { val: 1, labelRo: '1: Luni', labelEn: '1: Mon' },
                { val: 2, labelRo: '2: Marți', labelEn: '2: Tue' },
                { val: 3, labelRo: '3: Miercuri', labelEn: '3: Wed' },
                { val: 4, labelRo: '4: Joi', labelEn: '4: Thu' },
                { val: 5, labelRo: '5: Vineri', labelEn: '5: Fri' },
                { val: 6, labelRo: '6: Sâmbătă', labelEn: '6: Sat' },
                { val: 7, labelRo: '7: Duminică', labelEn: '7: Sun' },
                { val: 99, labelRo: '99: Invalid', labelEn: '99: Invalid' }
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
                  {lang === 'ro' ? item.labelRo : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle break */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                {lang === 'ro' ? 'Include instrucțiunea' : 'Include statement'} <code className="text-pink-400 font-mono">break;</code>
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
                  {hasBreak
                    ? (lang === 'ro' ? 'ACTIV (Normal)' : 'ACTIVE (Standard)')
                    : (lang === 'ro' ? 'DEZACTIVAT (Fall-through)' : 'DISABLED (Fall-through)')}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {hasBreak
                ? (lang === 'ro'
                  ? 'Cu break: execuția părăsește switch-ul imediat ce a executat cazul selectat.'
                  : 'With break: execution exits the switch structure immediately upon finishing matching case.')
                : (lang === 'ro'
                  ? 'Fără break: execuția "cade" prin toate instrucțiunile cazurilor următoare (fall-through)!'
                  : 'Without break: execution cascades into subsequent cases unconditionally (fall-through)!')}
            </p>
          </div>

          <button
            onClick={runSwitchSimulation}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            {lang === 'ro' ? 'Execută switch(zi) în Consola C++' : 'Execute switch(day) in C++ Console'}
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
              <span>{lang === 'ro' ? 'Testat CU break' : 'Tested WITH break'}</span>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                testedBothBreakStates.withoutBreak
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Testat FĂRĂ break' : 'Tested WITHOUT break'}</span>
            </div>
          </div>
        </div>

        {/* Right: Code Inspector & Virtual Console */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              {lang === 'ro' ? 'Vizualizator Cod Sursă & Terminal' : 'Source Code Inspector & Terminal'}
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
            <div className="text-slate-500 text-[11px]">
              {lang === 'ro' ? '// Ieșire consolă (Standard Output):' : '// Console Standard Output:'}
            </div>
            {executionOutput.length === 0 ? (
              <span className="text-slate-600 italic">
                {lang === 'ro' ? 'Apasă „Execută switch(zi)” pentru a vedea ieșirea în consolă...' : 'Press "Execute switch(day)" to inspect terminal output...'}
              </span>
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
          {lang === 'ro' ? (
            <>Aplicație Practică: Calculator Aritmetic bazat pe <code className="text-purple-300 font-mono">switch(op)</code> (Manual pag. 67)</>
          ) : (
            <>Practical Application: Arithmetic Calculator based on <code className="text-purple-300 font-mono">switch(op)</code> (Textbook p. 67)</>
          )}
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
          {lang === 'ro'
            ? 'Verificare Regulamentară C++ (Manual pag. 66–67)'
            : 'Regulatory C++ Check (Textbook pp. 66–67)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Ce tipuri de date poate evalua expresia dintr-o instrucțiune <code className="text-pink-400 font-mono">switch(expresie)</code>?</>
              ) : (
                <>What data types can be evaluated by the expression inside a <code className="text-pink-400 font-mono">switch(expr)</code> statement?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Orice tip de date, inclusiv numere reale cu virgulă (double, float)',
                  labelEn: 'Any type including floating-point reals (double, float)'
                },
                {
                  id: 'b',
                  labelRo: 'Doar texte de tip șir de caractere (string)',
                  labelEn: 'Only string literals and text objects'
                },
                {
                  id: 'c',
                  labelRo: 'Doar tipuri întregi ordinale (int, char, bool) — NU permite tipuri reale!',
                  labelEn: 'Only integral/ordinal types (int, char, bool) — floating-point reals are prohibited!'
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
              {lang === 'ro' ? (
                <>Care este rolul clauzei opționale <code className="text-pink-400 font-mono">default:</code> într-un bloc switch?</>
              ) : (
                <>What is the role of the optional <code className="text-pink-400 font-mono">default:</code> clause in a switch block?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Este obligatorie și se execută mereu prima',
                  labelEn: 'It is mandatory and always executes first'
                },
                {
                  id: 'b',
                  labelRo: 'Se execută doar când valoarea expresiei nu se potrivește cu niciunul dintre cazurile case definite',
                  labelEn: 'Executes solely when the evaluated expression matches none of the defined case constants'
                },
                {
                  id: 'c',
                  labelRo: 'Oprește calculatorul în caz de eroare critică',
                  labelEn: 'Shuts down program upon critical runtime failure'
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
              ? (lang === 'ro'
                ? 'Excelent! Ai explorat selecția multiplă și ai înțeles efectul break vs fall-through.'
                : 'Excellent! You explored multiway selection and mastered break vs fall-through behavior.')
              : (lang === 'ro'
                ? 'Testează simulatorul atât CU break cât și FĂRĂ break și răspunde corect la cele două întrebări.'
                : 'Test simulator both WITH break and WITHOUT break and answer both questions correctly.')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="py-2 px-4 rounded-lg font-medium text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
            >
              {lang === 'ro' ? 'Înapoi' : 'Back'}
            </button>
          )}
          <button
            onClick={handleFinish}
            disabled={!isLevelCompleted}
            className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
              isLevelCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>{lang === 'ro' ? 'Următorul Nivel: Min/Max & Triunghiuri' : 'Next Level: Min/Max & Triangles'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
