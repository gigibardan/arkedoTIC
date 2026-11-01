import React, { useState } from 'react';
import {
  Binary,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Hash,
  HelpCircle,
  Cpu,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A2Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A2Level4_DigitDecompositionLab: React.FC<A2Level4Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Input number
  const [numInput, setNumInput] = useState<number>(383);
  const [hasDissected, setHasDissected] = useState<boolean>(false);

  // Palindrome exploration
  const [testedPalindrome, setTestedPalindrome] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Decomposition for 3-digit number
  const n = Math.abs(numInput);
  const c1 = Math.floor(n / 100) % 10; // sute
  const c2 = Math.floor(n / 10) % 10; // zeci
  const c3 = n % 10; // unități

  const sumDigits = c1 + c2 + c3;
  const maxDigit = Math.max(c1, c2, c3);
  const mirroredNumber = c3 * 100 + c2 * 10 + c1;
  const isPalindrome = c1 === c3 && n >= 100 && n <= 999;

  const evenCount = (c1 % 2 === 0 ? 1 : 0) + (c2 % 2 === 0 ? 1 : 0) + (c3 % 2 === 0 ? 1 : 0);
  const oddCount = 3 - evenCount;

  const handleDissect = () => {
    sounds.playClick();
    setHasDissected(true);
    if (isPalindrome) {
      setTestedPalindrome(true);
    }
    sounds.playCorrect();
  };

  const isLevelCompleted =
    hasDissected &&
    testedPalindrome &&
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
      <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-violet-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-violet-500/20 rounded-xl border border-violet-400/30 text-violet-300">
              <Binary className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/30 text-violet-200 border border-violet-400/30">
                  Modulul 3B • Nivelul 4 din 7
                </span>
                <span className="text-xs text-violet-300">Manual Art Klett pag. 68–69</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Laborator de Prelucrare a Cifrelor: Descompunere, Palindrom & Statistici
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-violet-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 4: Cifre & Palindroame</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-violet-100/90 leading-relaxed max-w-3xl">
          În problemele de informatică de clasa a VIII-a și olimpiade, izolarea cifrelor folosind operatorii <code className="bg-violet-950 px-1 rounded text-cyan-300 font-mono">% 10</code> (ultima cifră) și <code className="bg-violet-950 px-1 rounded text-cyan-300 font-mono">/ 10</code> (tăierea ultimei cifre) este fundamentul analizei numerice!
        </p>
      </div>

      {/* Dissector Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Presets */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Hash className="w-4 h-4 text-cyan-400" />
            Configurare Număr de 3 Cifre
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 flex justify-between">
              <span>Introdu un număr natural <code className="text-amber-300">n</code> (100–999):</span>
              <span className="font-mono text-cyan-300 font-bold">{numInput}</span>
            </label>
            <input
              type="number"
              min="100"
              max="999"
              value={numInput}
              onChange={(e) => {
                setNumInput(Number(e.target.value));
                setHasDissected(false);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-cyan-300 text-base"
            />
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Numere Sugerate:</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => {
                  setNumInput(121);
                  setHasDissected(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                121 (Palindrom)
              </button>
              <button
                onClick={() => {
                  setNumInput(472);
                  setHasDissected(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                472 (Oarecare)
              </button>
              <button
                onClick={() => {
                  setNumInput(808);
                  setHasDissected(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                808 (Palindrom)
              </button>
            </div>
          </div>

          <button
            onClick={handleDissect}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Rulează Descompunerea & Verificarea Palindromului
          </button>

          {/* Palindrome badge */}
          <div
            className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              testedPalindrome
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              {testedPalindrome
                ? 'Ai testat cu succes un număr Palindrom (c1 == c3)!'
                : 'Cerință: Testează cel puțin o dată un număr palindrom (ex: 121, 383, 808).'}
            </span>
          </div>
        </div>

        {/* Right: Architectural Breakdown */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Arhitectura C++ a Descompunerii (Manual pag. 68)
          </h3>

          {/* The three digits cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 block">Cifra Sutelor (<code className="text-cyan-300">c1</code>)</span>
              <div className="text-xl font-mono font-bold text-cyan-400">{c1}</div>
              <div className="text-[10px] text-slate-500 font-mono">n / 100</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 block">Cifra Zecilor (<code className="text-purple-300">c2</code>)</span>
              <div className="text-xl font-mono font-bold text-purple-400">{c2}</div>
              <div className="text-[10px] text-slate-500 font-mono">(n / 10) % 10</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 block">Cifra Unităților (<code className="text-amber-300">c3</code>)</span>
              <div className="text-xl font-mono font-bold text-amber-400">{c3}</div>
              <div className="text-[10px] text-slate-500 font-mono">n % 10</div>
            </div>
          </div>

          {/* Computed Analysis */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans">1. Număr Oglindit (Inversat):</span>
              <span className="text-cyan-300 font-bold">{c3} &times; 100 + {c2} &times; 10 + {c1} = {mirroredNumber}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans">2. Verificare Palindrom:</span>
              <span className={isPalindrome ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {isPalindrome ? `DA! (${c1} == ${c3}) &bull; n == oglindit` : `NU (${c1} != ${c3})`}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans">3. Suma Cifrelor:</span>
              <span className="text-purple-300 font-bold">{c1} + {c2} + {c3} = {sumDigits}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans">4. Paritatea Cifrelor:</span>
              <span className="text-amber-300 font-bold">{evenCount} cifre pare, {oddCount} cifre impare</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans">5. Cifra Maximă:</span>
              <span className="text-emerald-400 font-bold">max({c1}, {c2}, {c3}) = {maxDigit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Verificare Regulamentară (Manual pag. 68–69)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              Cum obținem cifra zecilor a unui număr de 3 cifre <code className="text-amber-300 font-mono">n</code> în C++?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'n % 10' },
                { id: 'b', label: '(n / 10) % 10' },
                { id: 'c', label: 'n / 10' }
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
              Care dintre următoarele numere este un <strong>palindrom</strong>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: '737 (deoarece prima cifră este egală cu ultima cifră)' },
                { id: 'b', label: '732' },
                { id: 'c', label: '100' }
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
              ? 'Excelent! Ai stăpânit descompunerea cifrelor și verificarea palindroamelor.'
              : 'Rulează descompunerea numărului, testează cel puțin un număr palindrom și rezolvă întrebările.'}
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
          <span>Următorul Nivel: Decizii Imbricate & Aplicații Reale</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
