import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Terminal,
  HelpCircle,
  Cpu,
  Layers,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A5Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A5Level1_FunctionStructureAndPrototypes: React.FC<A5Level1Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();

  const [paramA, setParamA] = useState<number>(14);
  const [paramB, setParamB] = useState<number>(28);
  const [hasCalledFunction, setHasCalledFunction] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string[]>([]);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleExecuteFunction = () => {
    sounds.playClick();
    const logs: string[] = [];
    const result = Math.max(paramA, paramB);

    if (lang === 'ro') {
      logs.push(`1. Programul începe execuția în int main().`);
      logs.push(`2. Se apelează subprogramul: maxim(${paramA}, ${paramB});`);
      logs.push(`3. Procesorul transferă controlul către funcția int maxim(int a, int b).`);
      logs.push(`4. Se alocă parametrii formali: a = ${paramA}, b = ${paramB}.`);
      logs.push(`5. Funcția evaluează condiția (a > b) și execută return ${result};`);
      logs.push(`6. Controlul revine în main(), valoarea returnată ${result} este salvată în variabila rez.`);
      logs.push(`7. cout afișează pe monitor: Maximul este ${result}.`);
    } else {
      logs.push(`1. Program starts execution in int main().`);
      logs.push(`2. Subprogram is invoked: maxim(${paramA}, ${paramB});`);
      logs.push(`3. CPU transfers control to function int maxim(int a, int b).`);
      logs.push(`4. Formal parameters are allocated: a = ${paramA}, b = ${paramB}.`);
      logs.push(`5. Function evaluates condition (a > b) and executes return ${result};`);
      logs.push(`6. Control returns to main(), returned value ${result} is saved in variable res.`);
      logs.push(`7. cout prints to console: Maximum is ${result}.`);
    }

    setExecutionOutput(logs);
    setHasCalledFunction(true);
    sounds.playCorrect();
  };

  const isLevelCompleted =
    hasCalledFunction &&
    q1Answer === 'b' &&
    q2Answer === 'c';

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
      <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {lang === 'ro' ? 'Modulul 3E • Nivelul 1 din 7' : 'Module 3E • Level 1 of 7'}
                </span>
                <span className="text-xs text-indigo-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 85–86' : 'Art Klett Textbook pp. 85–86'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Subprograme (Funcții) în C++: Structură, Antet & Apel'
                  : 'Subprograms (Functions) in C++: Structure, Header & Invocation'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 1: Structura Funcțiilor' : 'Level 1: Function Structure'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-indigo-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Pe măsură ce programele devin mai complexe, scrierea întregului cod într-un singur bloc <code className="bg-indigo-950 px-1 rounded text-cyan-300 font-mono">int main()</code> devine ineficientă și greu de depanat. <strong>Subprogramele (funcțiile)</strong> permit modularizarea: împărțirea unei probleme în module independente, clare și reutilizabile!
            </>
          ) : (
            <>
              As programs grow in complexity, writing all logic inside a single <code className="bg-indigo-950 px-1 rounded text-cyan-300 font-mono">int main()</code> block becomes inefficient and hard to debug. <strong>Subprograms (functions)</strong> enable modularity: dividing a problem into independent, clean, and reusable components!
            </>
          )}
        </p>
      </div>

      {/* Function Anatomy */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          {lang === 'ro'
            ? 'Anatomia Canonică a unei Funcții în C++ (Manual pag. 85)'
            : 'Canonical Anatomy of a C++ Function (Textbook p. 85)'}
        </h3>

        {/* Visual Anatomy Breakdown */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs md:text-sm text-slate-300 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 bg-purple-950 border border-purple-500/40 rounded text-purple-300 font-bold">
              int
            </span>
            <span className="px-2 py-1 bg-cyan-950 border border-cyan-500/40 rounded text-cyan-300 font-bold">
              maxim
            </span>
            <span className="px-2 py-1 bg-amber-950 border border-amber-500/40 rounded text-amber-300 font-bold">
              (int a, int b)
            </span>
            <span>&#123;</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-sans pt-1">
            <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded text-purple-200">
              <strong>{lang === 'ro' ? '1. Tipul Returnat:' : '1. Return Type:'}</strong>{' '}
              {lang === 'ro'
                ? 'Specifică ce fel de date produce funcția (de ex: int, double, bool sau void dacă nu returnează nimic).'
                : 'Specifies the data type produced by the function (e.g., int, double, bool, or void if nothing is returned).'}
            </div>
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-200">
              <strong>{lang === 'ro' ? '2. Numele Funcției:' : '2. Function Name:'}</strong>{' '}
              {lang === 'ro'
                ? 'Identificator sugestiv prin care subprogramul este recunoscut și apelat din alte părți ale codului.'
                : 'Descriptive identifier through which the subprogram is recognized and called throughout code.'}
            </div>
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded text-amber-200">
              <strong>{lang === 'ro' ? '3. Parametrii Formali:' : '3. Formal Parameters:'}</strong>{' '}
              {lang === 'ro'
                ? 'Variabilele temporare în care funcția recepționează datele de intrare transmise la apel.'
                : 'Temporary variables in which the function receives caller input arguments.'}
            </div>
          </div>

          <div className="pl-4 text-slate-300 space-y-1 pt-2">
            <div><span className="text-pink-400">if</span> (a &gt; b)</div>
            <div className="pl-4 text-emerald-400 font-bold"><span className="text-pink-400">return</span> a;</div>
            <div><span className="text-pink-400">else</span></div>
            <div className="pl-4 text-emerald-400 font-bold"><span className="text-pink-400">return</span> b;</div>
          </div>
          <div>&#125;</div>
        </div>
      </div>

      {/* Interactive Simulator: Function Invocation & Call Stack Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input parameters */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-emerald-400" />
            {lang === 'ro' ? 'Configurare Apel din main()' : 'Call Configuration from main()'}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 flex justify-between">
                <span>{lang === 'ro' ? 'Argumentul 1 ' : 'Argument 1 '}(<code className="text-amber-300">paramA</code>):</span>
                <span className="font-mono text-cyan-300 font-bold">{paramA}</span>
              </label>
              <input
                type="number"
                value={paramA}
                onChange={(e) => {
                  setParamA(Number(e.target.value));
                  setHasCalledFunction(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 flex justify-between">
                <span>{lang === 'ro' ? 'Argumentul 2 ' : 'Argument 2 '}(<code className="text-amber-300">paramB</code>):</span>
                <span className="font-mono text-cyan-300 font-bold">{paramB}</span>
              </label>
              <input
                type="number"
                value={paramB}
                onChange={(e) => {
                  setParamB(Number(e.target.value));
                  setHasCalledFunction(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm mt-1"
              />
            </div>
          </div>

          <button
            onClick={handleExecuteFunction}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            {lang === 'ro' ? `Apelează Funcția: maxim(${paramA}, ${paramB})` : `Call Function: maxim(${paramA}, ${paramB})`}
          </button>

          {hasCalledFunction && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                {lang === 'ro' ? 'Valoarea returnată: ' : 'Returned value: '}
                <strong>{Math.max(paramA, paramB)}</strong>. {lang === 'ro' ? 'Execuția subprogramului s-a finalizat cu succes!' : 'Subprogram executed successfully!'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Call Stack Trace */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-cyan-400" />
            {lang === 'ro' ? 'Jurnalul Apelului pe Stiva de Execuție (Call Stack)' : 'Call Stack Execution Log'}
          </h3>

          <div className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5 min-h-[160px] max-h-[220px] overflow-y-auto">
            <div className="text-slate-500 text-[11px]">
              {lang === 'ro' ? '// Fluxul instrucțiunilor între main() și funcție:' : '// Instruction flow between main() and function:'}
            </div>
            {executionOutput.length === 0 ? (
              <span className="text-slate-600 italic font-sans">
                {lang === 'ro'
                  ? 'Apasă butonul „Apelează Funcția” pentru a urmări transferul controlului pe stiva de memorie...'
                  : 'Click "Call Function" to trace execution stack control transfer...'}
              </span>
            ) : (
              executionOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('5.')
                      ? 'text-emerald-400 font-bold'
                      : line.startsWith('2.') || line.startsWith('3.')
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 85–86)' : 'Official C++ Checkpoint (Textbook pp. 85–86)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro'
                ? 'Ce tip de date returnat trebuie specificat în antetul unei funcții care doar execută o afișare și NU returnează nicio valoare numerică?'
                : 'What return type must be specified in the header of a function that only performs output and returns NO numerical value?'}
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', labelRo: 'int', labelEn: 'int' },
                {
                  id: 'b',
                  labelRo: 'void (reprezintă tipul vid/nul, specificând că funcția nu folosește return cu valoare)',
                  labelEn: 'void (represents null/empty type, specifying that the function does not use return with a value)'
                },
                { id: 'c', labelRo: 'double', labelEn: 'double' }
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
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q1Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
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
                ? 'Ce este un prototip de funcție în C++ și de ce se plasează înainte de funcția main()?'
                : 'What is a function prototype in C++ and why is it placed before main()?'}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Un comentariu opțional care nu ajută la nimic',
                  labelEn: 'An optional comment that serves no real purpose'
                },
                {
                  id: 'b',
                  labelRo: 'O copie a întregului sistem de operare',
                  labelEn: 'A copy of the entire operating system'
                },
                {
                  id: 'c',
                  labelRo: 'Antetul funcției urmat de punct și virgulă (;), care informează compilatorul despre existența funcției înainte de a fi apelată în main()',
                  labelEn: 'The function header followed by semicolon (;), informing the compiler of function existence before its call in main()'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'c') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'c'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q2Answer === opt.id && opt.id === 'c' && <Check className="w-4 h-4 text-emerald-400" />}
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
                ? 'Excelent! Ai înțeles structura unei funcții, antetul și transferul controlului pe stivă.'
                : 'Excellent! You understood function structure, signature headers, and call stack control transfer.'
              : lang === 'ro'
              ? 'Apelează funcția în simulator și răspunde corect la cele 2 întrebări.'
              : 'Call the function in the simulator and correctly answer both questions.'}
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
          <span>{lang === 'ro' ? 'Următorul Nivel: Transmiterea Parametrilor (&)' : 'Next Level: Parameter Passing (&)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
