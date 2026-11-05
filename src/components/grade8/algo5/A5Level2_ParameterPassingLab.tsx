import React, { useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Copy,
  Link2,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A5Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A5Level2_ParameterPassingLab: React.FC<A5Level2Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();

  const [valX, setValX] = useState<number>(10);
  const [valY, setValY] = useState<number>(20);

  // States after execution
  const [actualX, setActualX] = useState<number>(10);
  const [actualY, setActualY] = useState<number>(20);
  const [testedMode, setTestedMode] = useState<'value' | 'reference' | null>(null);
  const [testedBoth, setTestedBoth] = useState<{ value: boolean; reference: boolean }>({
    value: false,
    reference: false
  });
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleTestPassByValue = () => {
    sounds.playClick();
    setActualX(valX);
    setActualY(valY);
    setTestedMode('value');
    setTestedBoth((prev) => ({ ...prev, value: true }));

    if (lang === 'ro') {
      setLogMessages([
        `1. main(): x = ${valX}, y = ${valY}`,
        `2. Apel: swapPrinValoare(x, y) → s-au creat COPII locale: a = ${valX}, b = ${valY}`,
        `3. În funcție: a și b au fost interschimbate (a devine ${valY}, b devine ${valX})`,
        `4. Ieșire din funcție: copiile locale a și b sunt ȘTERSE din memorie!`,
        `5. Rezultat în main(): x = ${valX}, y = ${valY} (NESCHIMBATE! swap-ul a eșuat în main)`
      ]);
    } else {
      setLogMessages([
        `1. main(): x = ${valX}, y = ${valY}`,
        `2. Call: swapByValue(x, y) → local COPIES created: a = ${valX}, b = ${valY}`,
        `3. Inside function: a and b were swapped (a becomes ${valY}, b becomes ${valX})`,
        `4. Function exit: local copies a and b are DELETED from stack memory!`,
        `5. Result in main(): x = ${valX}, y = ${valY} (UNCHANGED! swap failed to affect main)`
      ]);
    }
    sounds.playWrong();
  };

  const handleTestPassByReference = () => {
    sounds.playClick();
    const swappedX = valY;
    const swappedY = valX;
    setActualX(swappedX);
    setActualY(swappedY);
    setTestedMode('reference');
    setTestedBoth((prev) => ({ ...prev, reference: true }));

    if (lang === 'ro') {
      setLogMessages([
        `1. main(): x = ${valX}, y = ${valY}`,
        `2. Apel: swapPrinReferinta(int &a, int &b) → NU s-au creat copii!`,
        `3. Parametrii &a și &b sunt ALIASURI (referințe directe) la adresele lui x și y din main!`,
        `4. În funcție: valorile de la adresele originale au fost inversate`,
        `5. Rezultat în main(): x = ${swappedX}, y = ${swappedY} (SUCCES! Interschimbare realizată)`
      ]);
    } else {
      setLogMessages([
        `1. main(): x = ${valX}, y = ${valY}`,
        `2. Call: swapByReference(int &a, int &b) → NO copies were created!`,
        `3. Parameters &a and &b are ALIASES (direct references) to memory addresses of x and y in main!`,
        `4. Inside function: values at original addresses were swapped`,
        `5. Result in main(): x = ${swappedX}, y = ${swappedY} (SUCCESS! In-place swap completed)`
      ]);
    }
    sounds.playCorrect();
  };

  const handleReset = () => {
    setValX(10);
    setValY(20);
    setActualX(10);
    setActualY(20);
    setTestedMode(null);
    setLogMessages([]);
    sounds.playClick();
  };

  const isLevelCompleted =
    testedBoth.value &&
    testedBoth.reference &&
    q1Answer === 'a' &&
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
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-purple-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-400/30 text-purple-300">
              <ArrowLeftRight className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  {lang === 'ro' ? 'Modulul 3E • Nivelul 2 din 7' : 'Module 3E • Level 2 of 7'}
                </span>
                <span className="text-xs text-purple-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 86' : 'Art Klett Textbook p. 86'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Transmiterea Parametrilor: Prin Valoare (Copie) vs Prin Referință (&)'
                  : 'Parameter Passing: Pass-by-Value (Copy) vs Pass-by-Reference (&)'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-purple-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 2: Parametri & Referințe' : 'Level 2: Parameters & References'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-purple-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Cea mai frecventă capcană la funcții în C++: dacă transmiți o variabilă simplă fără caracterul <code className="bg-purple-950 px-1 rounded text-cyan-300 font-mono">&</code>, funcția primește o <strong>copie</strong> a valorii! Pentru ca modificările dintr-o funcție să se întoarcă în programul principal (de ex. la o funcție de swap sau de citire), este obligatorie transmiterea <strong>prin referință</strong> (<code className="bg-purple-950 px-1 rounded text-amber-300 font-mono">&</code>).
            </>
          ) : (
            <>
              The most common trap with functions in C++: if you pass a simple variable without the <code className="bg-purple-950 px-1 rounded text-cyan-300 font-mono">&</code> character, the function receives a local <strong>copy</strong> of the value! For function modifications to persist back in the calling program (e.g. for swap or input functions), passing <strong>by reference</strong> (<code className="bg-purple-950 px-1 rounded text-amber-300 font-mono">&</code>) is mandatory.
            </>
          )}
        </p>
      </div>

      {/* Simulator: Head-to-Head Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Control */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              {lang === 'ro' ? 'Variabilele din funcția main()' : 'Variables in main() function'}
            </h3>
            <button
              onClick={handleReset}
              className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {lang === 'ro' ? 'Reset' : 'Reset'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {lang === 'ro' ? 'x inițial:' : 'initial x:'}
              </label>
              <input
                type="number"
                value={valX}
                onChange={(e) => setValX(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-cyan-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {lang === 'ro' ? 'y inițial:' : 'initial y:'}
              </label>
              <input
                type="number"
                value={valY}
                onChange={(e) => setValY(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-cyan-300 text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleTestPassByValue}
              className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-between border border-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-rose-400" />
                <span>{lang === 'ro' ? '1. Testează Transmitere PRIN VALOARE (fără &)' : '1. Test Pass-by-Value (without &)'}</span>
              </span>
              <span className="font-mono text-[10px] text-rose-400">swap(x, y)</span>
            </button>

            <button
              onClick={handleTestPassByReference}
              className="w-full p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-medium flex items-center justify-between shadow-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ro' ? '2. Testează Transmitere PRIN REFERINȚĂ (cu &)' : '2. Test Pass-by-Reference (with &)'}</span>
              </span>
              <span className="font-mono text-[10px] text-amber-200">swap(&a, &b)</span>
            </button>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                testedBoth.value
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{lang === 'ro' ? 'Testat Prin Valoare' : 'Pass-by-Value Tested'}</span>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                testedBoth.reference
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{lang === 'ro' ? 'Testat Prin Referință' : 'Pass-by-Ref Tested'}</span>
            </div>
          </div>
        </div>

        {/* Right: State in RAM & Trace */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              {lang === 'ro' ? 'Starea Variabilelor în main() după Apel' : 'Variables in main() after Invocation'}
            </span>
            {testedMode && (
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                  testedMode === 'reference'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}
              >
                {lang === 'ro'
                  ? `Mod: ${testedMode === 'reference' ? 'PRIN REFERINȚĂ (&)' : 'PRIN VALOARE'}`
                  : `Mode: ${testedMode === 'reference' ? 'PASS-BY-REFERENCE (&)' : 'PASS-BY-VALUE'}`}
              </span>
            )}
          </h3>

          {/* Current Values Display */}
          <div className="grid grid-cols-2 gap-4 font-mono text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">
                {lang === 'ro' ? 'x în main():' : 'x in main():'}
              </span>
              <span className="text-2xl font-bold text-cyan-300">{actualX}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">
                {lang === 'ro' ? 'y în main():' : 'y in main():'}
              </span>
              <span className="text-2xl font-bold text-amber-300">{actualY}</span>
            </div>
          </div>

          {/* Trace Logs */}
          <div className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 min-h-[140px] max-h-[180px] overflow-y-auto">
            <div className="text-slate-500 text-[11px]">
              {lang === 'ro' ? '// Jurnal pas-cu-pas al memoriei:' : '// Step-by-step memory trace:'}
            </div>
            {logMessages.length === 0 ? (
              <span className="text-slate-600 italic font-sans">
                {lang === 'ro'
                  ? 'Apasă butoanele din stânga pentru a simula cele două moduri de transmitere...'
                  : 'Click the buttons on the left to simulate both passing modes...'}
              </span>
            ) : (
              logMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.includes('SUCCES') || msg.includes('SUCCESS')
                      ? 'text-emerald-400 font-bold'
                      : msg.includes('NESCHIMBATE') || msg.includes('UNCHANGED')
                      ? 'text-rose-400 font-bold'
                      : 'text-slate-300'
                  }
                >
                  {msg}
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
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 86)' : 'Official C++ Checkpoint (Textbook p. 86)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro'
                ? 'De ce o funcție void swapGresit(int a, int b) scrisă fără caracterul & nu reușește să inverseze valorile din apelant?'
                : 'Why does a function void swapWrong(int a, int b) written without & fail to invert caller values?'}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Pentru că variabilele a și b sunt simple copii temporare; la încheierea funcției copiile dispar, iar valorile originale rămân neatinse',
                  labelEn: 'Because variables a and b are temporary copies; on function exit copies are destroyed, leaving originals untouched'
                },
                {
                  id: 'b',
                  labelRo: 'Pentru că funcția swap este interzisă în C++',
                  labelEn: 'Because swap functions are forbidden in C++'
                },
                {
                  id: 'c',
                  labelRo: 'Pentru că procesorul inversează doar numere negative',
                  labelEn: 'Because the CPU only inverts negative numbers'
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
                ? 'Cum trebuie să arate antetul unei funcții care citește de la tastatură dimensiunea n a unui tablou astfel încât noul n să fie cunoscut și în main()?'
                : 'How must the header of a function look that reads array dimension n from keyboard so that updated n is known in main()?'}
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', labelRo: 'void citire(int n)', labelEn: 'void read(int n)' },
                { id: 'b', labelRo: 'int citire(void)', labelEn: 'int read(void)' },
                {
                  id: 'c',
                  labelRo: 'void citire(int &n) (cu transmitere prin referință folosind &)',
                  labelEn: 'void read(int &n) (pass-by-reference using &)'
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
                ? 'Excelent! Ai explorat diferența critică dintre transmiterea prin valoare și prin referință.'
                : 'Excellent! You mastered the critical difference between pass-by-value and pass-by-reference.'
              : lang === 'ro'
              ? 'Testează ambele metode de transmitere în simulator și răspunde corect la cele două întrebări.'
              : 'Test both passing methods in the simulator and correctly answer both questions.'}
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
          <span>{lang === 'ro' ? 'Următorul Nivel: Vectori Transmiși în Funcții' : 'Next Level: Arrays in Functions'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
