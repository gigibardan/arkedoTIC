import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ArrowRight, RotateCcw, Play, Flame, HelpCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

export const CP2Level4_DirectAssignmentTrap: React.FC<Props> = ({ onPass }) => {
  const [step, setStep] = useState<number>(0); // 0: init, 1: after a=b, 2: after b=a
  const [valA, setValA] = useState<number>(5);
  const [valB, setValB] = useState<number>(9);
  const [logHistory, setLogHistory] = useState<string[]>([
    'Stare inițială: a = 5, b = 9 în memoria RAM.'
  ]);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const handleNextStep = () => {
    sounds.playClick();
    if (step === 0) {
      // Execute a = b;
      setValA(9);
      setLogHistory(prev => [
        ...prev,
        '⚡ Executat: a = b; -> Valoarea lui b (9) a fost copiată în a. Valoarea inițială (5) a lui a a fost SUPRASCRISE și pierdută definitiv!'
      ]);
      setStep(1);
    } else if (step === 1) {
      // Execute b = a;
      setValB(9);
      setLogHistory(prev => [
        ...prev,
        '❌ Executat: b = a; -> Deoarece a este acum 9, b primește tot 9! Ambele variabile au acum valoarea 9. Swap eșuat!'
      ]);
      setStep(2);
      sounds.playError();
    }
  };

  const handleReset = () => {
    sounds.playClick();
    setStep(0);
    setValA(5);
    setValB(9);
    setLogHistory(['Stare inițială: a = 5, b = 9 în memoria RAM.']);
  };

  const handleSelectQuiz = (ans: string) => {
    sounds.playClick();
    setQuizAnswer(ans);
    if (ans === 'destroy') {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
  };

  const handleFinish = () => {
    sounds.playLevelUp();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 border border-rose-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Nivelul 4 • Clasa a VII-a • Manual Art Klett pag. 76</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Misterul Inversării: <span className="text-rose-400 font-mono">Capcana Atribuirii Directe</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Cea mai frecventă greșeală a începătorilor: să creadă că instrucțiunile <code className="text-rose-300 font-mono">a = b; b = a;</code> vor schimba valorile între ele. Hai să vedem de ce această logică distruge datele în RAM!
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-rose-500/20">
            <span className="text-xs text-rose-400 font-mono">Avertisment Critic</span>
            <span className="text-sm font-bold text-rose-300 font-mono">Pierdere de Date</span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Memory Cell Visualization (7 cols) */}
        <div className="md:col-span-7 bg-slate-900/95 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-white font-bold text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Simulare RAM a Codului Eronat</span>
              </span>
              <span className="text-xs font-mono text-slate-400">Pasul {step} din 2</span>
            </div>

            {/* RAM Containers */}
            <div className="grid grid-cols-2 gap-4 my-6">
              {/* Variable A Box */}
              <div className={`p-5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center min-h-[140px] ${
                step === 0
                  ? 'bg-amber-950/30 border-amber-500/50'
                  : 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/30'
              }`}>
                <span className="text-xs font-mono text-slate-400 mb-1">Variabila [a] în RAM:</span>
                <span className="text-4xl font-mono font-black text-amber-300 my-1">{valA}</span>
                <span className="text-[11px] font-mono mt-1">
                  {step === 0 ? (
                    <span className="text-emerald-400">Valoare originală (5)</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold">
                      <Flame className="w-3 h-3 text-rose-500" /> Suprascris cu 9! (5 a dispărut)
                    </span>
                  )}
                </span>
              </div>

              {/* Variable B Box */}
              <div className="p-5 rounded-2xl border bg-indigo-950/30 border-indigo-500/50 text-center flex flex-col items-center justify-center min-h-[140px]">
                <span className="text-xs font-mono text-slate-400 mb-1">Variabila [b] în RAM:</span>
                <span className="text-4xl font-mono font-black text-indigo-300 my-1">{valB}</span>
                <span className="text-[11px] font-mono mt-1 text-slate-400">
                  {step === 2 ? 'A rămas 9' : 'Valoare originală (9)'}
                </span>
              </div>
            </div>

            {/* Code Line Indicator */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-slate-500 text-[11px] border-b border-slate-900 pb-1 mb-2">Instrucțiuni executate:</div>
              <div className={`p-2 rounded-lg flex items-center justify-between ${step === 1 ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300' : 'text-slate-400'}`}>
                <span>a = b;</span>
                <span className="text-[10px]">{step >= 1 ? '✓ Executat' : 'În așteptare'}</span>
              </div>
              <div className={`p-2 rounded-lg flex items-center justify-between ${step === 2 ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300' : 'text-slate-400'}`}>
                <span>b = a;</span>
                <span className="text-[10px]">{step >= 2 ? '✓ Executat' : 'În așteptare'}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            {step < 2 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/30 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execută {step === 0 ? 'a = b;' : 'b = a;'}</span>
              </button>
            ) : (
              <div className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Catastrofă: a = 9 și b = 9!</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reia Simularea</span>
            </button>
          </div>
        </div>

        {/* Right: Log & Reflection Quiz (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/95 rounded-3xl border border-slate-800 p-5 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-300">Ce s-a întâmplat în memorie?</span>
                <span className="text-[10px] font-mono text-slate-500">Jurnal Hardware</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {logHistory.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {step === 2 && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <p className="text-xs text-white font-bold mb-2">Concluzie Didactică: De ce a eșuat inversarea?</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSelectQuiz('syntax')}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                      quizAnswer === 'syntax'
                        ? 'bg-rose-950 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    A apărut o eroare de compilare deoarece variabilele au același tip.
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectQuiz('destroy')}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                      quizAnswer === 'destroy'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    Atribuirea <code>a = b</code> a suprascris și șters valoarea inițială a lui <code>a</code> înainte ca ea să poată fi salvată în <code>b</code>!
                  </button>
                </div>

                {quizAnswer === 'destroy' && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                    >
                      <span>Descoperă Soluția: Regula celor 3 Pahare!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
