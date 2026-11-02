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

interface A5Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A5Level2_ParameterPassingLab: React.FC<A5Level2Props> = ({
  onCompletePage,
  onComplete
}) => {
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
    // In pass-by-value: copy is swapped inside function, but x and y in caller remain 10 and 20!
    setActualX(valX);
    setActualY(valY);
    setTestedMode('value');
    setTestedBoth((prev) => ({ ...prev, value: true }));

    setLogMessages([
      `1. main(): x = ${valX}, y = ${valY}`,
      `2. Apel: swapPrinValoare(x, y) &rarr; s-au creat COPII locale: a = ${valX}, b = ${valY}`,
      `3. În funcție: a și b au fost interschimbate (a devine ${valY}, b devine ${valX})`,
      `4. Ieșire din funcție: copiile locale a și b sunt ȘTERSE din memorie!`,
      `5. Rezultat în main(): x = ${valX}, y = ${valY} (NESCHIMBATE! swap-ul a eșuat în main)`
    ]);
    sounds.playWrong();
  };

  const handleTestPassByReference = () => {
    sounds.playClick();
    // In pass-by-reference: caller's x and y are actually swapped!
    const swappedX = valY;
    const swappedY = valX;
    setActualX(swappedX);
    setActualY(swappedY);
    setTestedMode('reference');
    setTestedBoth((prev) => ({ ...prev, reference: true }));

    setLogMessages([
      `1. main(): x = ${valX}, y = ${valY}`,
      `2. Apel: swapPrinReferinta(int &a, int &b) &rarr; NU s-au creat copii!`,
      `3. Parametrii &a și &b sunt ALIASURI (referințe directe) la adresele lui x și y din main!`,
      `4. În funcție: valorile de la adresele originale au fost inversate`,
      `5. Rezultat în main(): x = ${swappedX}, y = ${swappedY} (SUCCES! Interschimbare realizată)`
    ]);
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
                  Modulul 3E • Nivelul 2 din 7
                </span>
                <span className="text-xs text-purple-300">Manual Art Klett pag. 86</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Transmiterea Parametrilor: Prin Valoare (Copie) vs Prin Referință (&)
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-purple-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 2: Parametri & Referințe</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-purple-100/90 leading-relaxed max-w-3xl">
          Cea mai frecventă capcană la funcții în C++: dacă transmiți o variabilă simplă fără caracterul <code className="bg-purple-950 px-1 rounded text-cyan-300 font-mono">&</code>, funcția primește o <strong>copie</strong> a valorii! Pentru ca modificările dintr-o funcție să se întoarcă în programul principal (de ex. la o funcție de swap sau de citire), este obligatorie transmiterea <strong>prin referință</strong> (<code className="bg-purple-950 px-1 rounded text-amber-300 font-mono">&</code>).
        </p>
      </div>

      {/* Simulator: Head-to-Head Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Control */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Variabilele din funcția main()
            </h3>
            <button
              onClick={handleReset}
              className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">x inițial:</label>
              <input
                type="number"
                value={valX}
                onChange={(e) => setValX(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-cyan-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">y inițial:</label>
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
                <span>1. Testează Transmitere PRIN VALOARE (fără &)</span>
              </span>
              <span className="font-mono text-[10px] text-rose-400">swap(x, y)</span>
            </button>

            <button
              onClick={handleTestPassByReference}
              className="w-full p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-medium flex items-center justify-between shadow-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-amber-300" />
                <span>2. Testează Transmitere PRIN REFERINȚĂ (cu &)</span>
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
              <span>Testat Prin Valoare</span>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                testedBoth.reference
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Testat Prin Referință</span>
            </div>
          </div>
        </div>

        {/* Right: State in RAM & Trace */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Starea Variabilelor în main() după Apel
            </span>
            {testedMode && (
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                  testedMode === 'reference'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}
              >
                Mod: {testedMode === 'reference' ? 'PRIN REFERINȚĂ (&)' : 'PRIN VALOARE'}
              </span>
            )}
          </h3>

          {/* Current Values Display */}
          <div className="grid grid-cols-2 gap-4 font-mono text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">x în main():</span>
              <span className="text-2xl font-bold text-cyan-300">{actualX}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">y în main():</span>
              <span className="text-2xl font-bold text-amber-300">{actualY}</span>
            </div>
          </div>

          {/* Trace Logs */}
          <div className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 min-h-[140px] max-h-[180px] overflow-y-auto">
            <div className="text-slate-500 text-[11px]">// Jurnal pas-cu-pas al memoriei:</div>
            {logMessages.length === 0 ? (
              <span className="text-slate-600 italic font-sans">
                Apasă butoanele din stânga pentru a simula cele două moduri de transmitere...
              </span>
            ) : (
              logMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.includes('SUCCES')
                      ? 'text-emerald-400 font-bold'
                      : msg.includes('NESCHIMBATE')
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
          Verificare Regulamentară C++ (Manual pag. 86)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              De ce o funcție <code className="text-rose-400 font-mono">void swapGresit(int a, int b)</code> scrisă fără caracterul <code className="text-amber-300 font-mono">&</code> nu reușește să inverseze valorile din apelant?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Pentru că variabilele a și b sunt simple copii temporare; la încheierea funcției copiile dispar, iar valorile originale rămân neatinse' },
                { id: 'b', label: 'Pentru că funcția swap este interzisă în C++' },
                { id: 'c', label: 'Pentru că procesorul inversează doar numere negative' }
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
                  <span>{opt.label}</span>
                  {q1Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 2:</span>
            <p className="text-xs text-slate-300">
              Cum trebuie să arate antetul unei funcții care citește de la tastatură dimensiunea <code className="text-cyan-300 font-mono">n</code> a unui tablou astfel încât noul <code className="text-cyan-300 font-mono">n</code> să fie cunoscut și în <code className="text-amber-300 font-mono">main()</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'void citire(int n)' },
                { id: 'b', label: 'int citire(void)' },
                { id: 'c', label: 'void citire(int &n) (cu transmitere prin referință folosind &)' }
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
                  <span>{opt.label}</span>
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
              ? 'Excelent! Ai explorat diferența critică dintre transmiterea prin valoare și prin referință.'
              : 'Testează ambele metode de transmitere în simulator și răspunde corect la cele două întrebări.'}
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
          <span>Următorul Nivel: Vectori Transmiși în Funcții</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
