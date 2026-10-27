import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, RotateCcw, Play, GlassWater, Droplets, HelpCircle, Lightbulb, Check } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

type LiquidType = 'orange' | 'cyan' | 'empty';

export const CP2Level5_ThreeGlassesSwapVisualizer: React.FC<Props> = ({ onPass }) => {
  // Step in swap:
  // 0: Initial state (A=Orange/42, B=Cyan/88, AUX=Empty/0)
  // 1: After aux = a; (AUX gets Orange/42, A retains 42 in RAM copy, but conceptually "available")
  // 2: After a = b; (A gets Cyan/88)
  // 3: After b = aux; (B gets Orange/42) -> SWAP COMPLETE!
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSuccessfully, setCompletedSuccessfully] = useState<boolean>(false);
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Values in memory
  const [valA, setValA] = useState<number>(42);
  const [valB, setValB] = useState<number>(88);
  const [valAux, setValAux] = useState<number | null>(null);

  // Liquids in glasses
  const [liquidA, setLiquidA] = useState<LiquidType>('orange');
  const [liquidB, setLiquidB] = useState<LiquidType>('cyan');
  const [liquidAux, setLiquidAux] = useState<LiquidType>('empty');

  const executeInstruction = (instruction: string) => {
    sounds.playClick();
    setErrorMsg(null);
    setSelectedInstruction(instruction);

    if (currentStep === 0) {
      if (instruction === 'aux = a;') {
        sounds.playSuccess();
        setValAux(valA);
        setLiquidAux('orange');
        setCurrentStep(1);
      } else {
        sounds.playError();
        setErrorMsg('Greșit! Primul pas trebuie să fie salvarea valorii lui a în paharul auxiliar: aux = a;');
      }
    } else if (currentStep === 1) {
      if (instruction === 'a = b;') {
        sounds.playSuccess();
        setValA(valB);
        setLiquidA('cyan');
        setCurrentStep(2);
      } else {
        sounds.playError();
        setErrorMsg('Greșit! Paharul A poate primi acum valoarea lui B: a = b;');
      }
    } else if (currentStep === 2) {
      if (instruction === 'b = aux;') {
        sounds.playLevelUp();
        setValB(valAux!);
        setLiquidB('orange');
        setCurrentStep(3);
        setCompletedSuccessfully(true);
      } else {
        sounds.playError();
        setErrorMsg('Greșit! Ultimul pas este transferarea valorii salvate în aux în paharul b: b = aux;');
      }
    }
  };

  const handleReset = () => {
    sounds.playClick();
    setCurrentStep(0);
    setValA(42);
    setValB(88);
    setValAux(null);
    setLiquidA('orange');
    setLiquidB('cyan');
    setLiquidAux('empty');
    setCompletedSuccessfully(false);
    setSelectedInstruction(null);
    setErrorMsg(null);
  };

  const handleFinish = () => {
    sounds.playLevelUp();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Nivelul 5 • Clasa a VII-a • Manual Art Klett pag. 76</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Regula celor 3 Pahare: <span className="text-teal-400 font-mono">Algoritmul de Interschimbare (Swap)</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Cum schimbi sucul din două pahare pline fără să verși nicio picătură? Folosești un <strong>al treilea pahar gol</strong> (<code className="text-teal-300 font-mono">aux</code>)! În C++, această tehnică este cel mai celebru algoritm de bază.
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-teal-500/20">
            <span className="text-xs text-teal-400 font-mono">Stare Swap</span>
            <span className="text-sm font-bold text-teal-300 font-mono">
              {currentStep === 3 ? 'Completat 100%' : `Pasul ${currentStep + 1} / 3`}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Glasses Visual Simulation Arena */}
      <div className="bg-slate-900/95 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <GlassWater className="w-4 h-4 text-teal-400" />
            <span>Laboratorul celor 3 Pahare (Simulare Fluidă de Memorie)</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetează Paharele</span>
          </button>
        </div>

        {/* The 3 Glasses Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 items-end">
          {/* Glass A */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-mono font-bold text-amber-300 mb-2 flex items-center gap-1">
              <span>Paharul [a]</span>
              <span className="text-slate-500 font-normal">(Variabilă int)</span>
            </div>

            {/* Glass Container */}
            <div className="relative w-36 h-48 border-4 border-t-0 border-slate-600 rounded-b-3xl bg-slate-950/80 overflow-hidden flex flex-col justify-end p-2 shadow-2xl">
              {/* Measurement marks */}
              <div className="absolute right-2 top-4 w-2 h-0.5 bg-slate-700" />
              <div className="absolute right-2 top-14 w-3 h-0.5 bg-slate-700" />
              <div className="absolute right-2 top-24 w-2 h-0.5 bg-slate-700" />
              <div className="absolute right-2 top-34 w-3 h-0.5 bg-slate-700" />

              {/* Liquid inside */}
              {liquidA !== 'empty' && (
                <div
                  className={`w-full h-3/4 rounded-b-2xl transition-all duration-700 flex flex-col items-center justify-center font-mono font-black text-2xl text-slate-950 shadow-inner ${
                    liquidA === 'orange'
                      ? 'bg-gradient-to-t from-amber-600 to-orange-400'
                      : 'bg-gradient-to-t from-cyan-600 to-sky-400'
                  }`}
                >
                  <Droplets className="w-5 h-5 text-slate-950/40 mb-1 animate-pulse" />
                  <span>{valA}</span>
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                Valoare curentă: <strong className="text-amber-300">{valA}</strong>
              </span>
            </div>
          </div>

          {/* Glass AUX (Middle) */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-mono font-bold text-teal-300 mb-2 flex items-center gap-1">
              <span>Paharul [aux]</span>
              <span className="text-teal-500 font-normal">(Variabilă Auxiliară)</span>
            </div>

            {/* Glass Container */}
            <div className="relative w-36 h-48 border-4 border-t-0 border-teal-500/50 rounded-b-3xl bg-slate-950/80 overflow-hidden flex flex-col justify-end p-2 shadow-2xl">
              {/* Liquid inside */}
              {liquidAux !== 'empty' ? (
                <div
                  className="w-full h-3/4 rounded-b-2xl transition-all duration-700 flex flex-col items-center justify-center font-mono font-black text-2xl text-slate-950 shadow-inner bg-gradient-to-t from-amber-600 to-orange-400"
                >
                  <Droplets className="w-5 h-5 text-slate-950/40 mb-1 animate-pulse" />
                  <span>{valAux}</span>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-600 font-mono italic">
                  [Pahar Gol de Rezervă]
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                Valoare aux: <strong className="text-teal-300">{valAux !== null ? valAux : 'gol (0)'}</strong>
              </span>
            </div>
          </div>

          {/* Glass B */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-mono font-bold text-sky-300 mb-2 flex items-center gap-1">
              <span>Paharul [b]</span>
              <span className="text-slate-500 font-normal">(Variabilă int)</span>
            </div>

            {/* Glass Container */}
            <div className="relative w-36 h-48 border-4 border-t-0 border-slate-600 rounded-b-3xl bg-slate-950/80 overflow-hidden flex flex-col justify-end p-2 shadow-2xl">
              {/* Liquid inside */}
              {liquidB !== 'empty' && (
                <div
                  className={`w-full h-3/4 rounded-b-2xl transition-all duration-700 flex flex-col items-center justify-center font-mono font-black text-2xl text-slate-950 shadow-inner ${
                    liquidB === 'cyan'
                      ? 'bg-gradient-to-t from-cyan-600 to-sky-400'
                      : 'bg-gradient-to-t from-amber-600 to-orange-400'
                  }`}
                >
                  <Droplets className="w-5 h-5 text-slate-950/40 mb-1 animate-pulse" />
                  <span>{valB}</span>
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                Valoare curentă: <strong className="text-sky-300">{valB}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Code Instructions Selector */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <label className="block text-xs font-mono text-slate-400 mb-3">
            {completedSuccessfully
              ? '🎉 Swap Reușit! Cele 3 instrucțiuni au fost executate în ordinea perfectă:'
              : `Selectează instrucțiunea pe care vrei să o execuți pentru Pasul ${currentStep + 1}:`}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => executeInstruction('aux = a;')}
              disabled={completedSuccessfully || currentStep !== 0}
              className={`p-4 rounded-2xl border text-center font-mono text-base font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                currentStep > 0
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 opacity-80'
                  : currentStep === 0
                  ? 'bg-teal-950/80 hover:bg-teal-900 border-teal-500 text-teal-200 ring-2 ring-teal-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-500 opacity-40'
              }`}
            >
              <span>aux = a;</span>
              <span className="text-[11px] font-sans font-normal text-slate-400">Pasul 1: Salvează a în aux</span>
            </button>

            <button
              type="button"
              onClick={() => executeInstruction('a = b;')}
              disabled={completedSuccessfully || currentStep !== 1}
              className={`p-4 rounded-2xl border text-center font-mono text-base font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                currentStep > 1
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 opacity-80'
                  : currentStep === 1
                  ? 'bg-teal-950/80 hover:bg-teal-900 border-teal-500 text-teal-200 ring-2 ring-teal-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-500 opacity-40'
              }`}
            >
              <span>a = b;</span>
              <span className="text-[11px] font-sans font-normal text-slate-400">Pasul 2: Copiază b în a</span>
            </button>

            <button
              type="button"
              onClick={() => executeInstruction('b = aux;')}
              disabled={completedSuccessfully || currentStep !== 2}
              className={`p-4 rounded-2xl border text-center font-mono text-base font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                completedSuccessfully
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 opacity-80'
                  : currentStep === 2
                  ? 'bg-teal-950/80 hover:bg-teal-900 border-teal-500 text-teal-200 ring-2 ring-teal-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-500 opacity-40'
              }`}
            >
              <span>b = aux;</span>
              <span className="text-[11px] font-sans font-normal text-slate-400">Pasul 3: Pune aux în b</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {completedSuccessfully && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-xs sm:text-sm text-emerald-200">
                  <span className="font-bold">Succes Absolut!</span> Valoarea inițială a lui <code className="text-white font-mono">a (42)</code> este acum în <code className="text-white font-mono">b</code>, iar valoarea inițială a lui <code className="text-white font-mono">b (88)</code> este acum în <code className="text-white font-mono">a</code>!
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Treci la Nivelul 6: Laborator Code::Blocks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
