import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Lightbulb,
  Check,
  ChevronRight,
  Calculator,
  HelpCircle,
  Binary
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

export const StemLevel3_DivisorsAndPrimes: React.FC<Props> = ({ onPass }) => {
  // Divisor Scanner State
  const [testNumber, setTestNumber] = useState<number>(28);
  const [divisors, setDivisors] = useState<number[]>([1, 2, 4, 7, 14, 28]);
  const [properDivisors, setProperDivisors] = useState<number[]>([1, 2, 4, 7, 14]);
  const [isPrime, setIsPrime] = useState<boolean>(false);
  const [isPerfect, setIsPerfect] = useState<boolean>(true);
  const [customInput, setCustomInput] = useState<string>('28');

  // Challenge State
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  const calculateDivisors = (n: number) => {
    if (n < 1) return;
    const allDivs: number[] = [];
    const propDivs: number[] = [];
    let sumProp = 0;

    for (let d = 1; d <= n; d++) {
      if (n % d === 0) {
        allDivs.push(d);
        if (d < n) {
          propDivs.push(d);
          sumProp += d;
        }
      }
    }

    const prime = n > 1 && allDivs.length === 2; // only 1 and n
    const perfect = n > 1 && sumProp === n;

    setDivisors(allDivs);
    setProperDivisors(propDivs);
    setIsPrime(prime);
    setIsPerfect(perfect);
    setTestNumber(n);
  };

  const handleCustomScan = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val >= 1 && val <= 1000) {
      sounds.playClick();
      calculateDivisors(val);
      if (val > 1 && divisors.length === 2) sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handlePresetSelect = (val: number) => {
    sounds.playClick();
    setCustomInput(String(val));
    calculateDivisors(val);
  };

  const CHALLENGES = [
    {
      question: 'Până la ce limită este suficient să căutăm divizorii proprii ai unui număr n într-o buclă for?',
      code: 'for (int d = 2; d <= ???; d++) {\n    if (n % d == 0) cout << d << " ";\n}',
      options: [
        { label: 'Până la n / 2 (deoarece niciun divizor propriu nu poate depăși jumătatea numărului)', correct: true },
        { label: 'Până la n + 1', correct: false },
        { label: 'Până la n * 2', correct: false },
        { label: 'Nu putem optimiza, trebuie căutat până la 1.000.000', correct: false }
      ],
      explanation: 'Cel mai mare divizor propriu al unui număr par n este n/2 (ex: pentru 20 este 10). Dincolo de jumătate nu poate exista niciun divizor în afară de n însuși!'
    },
    {
      question: 'Câți divizori are un număr PRIM (cum ar fi 13 sau 29)?',
      code: null,
      options: [
        { label: 'Exact 2 divizori: 1 și el însuși', correct: true },
        { label: 'Doar 1 singur divizor', correct: false },
        { label: '0 divizori', correct: false },
        { label: 'Un număr par de divizori mai mare decât 4', correct: false }
      ],
      explanation: 'Prin definiție matematică, un număr natural p > 1 este prim dacă are exact 2 divizori: 1 și p.'
    },
    {
      question: 'Ce este un „Număr Perfect” (studiat la pag. 89 în manual)?',
      code: '// Exemplu: n = 6 -> divizorii mai mici ca 6 sunt 1, 2, 3\n// 1 + 2 + 3 = 6 (Număr Perfect!)',
      options: [
        { label: 'Un număr egal cu suma divizorilor săi proprii (inclusiv 1, dar excluzând numărul însuși)', correct: true },
        { label: 'Un număr care are numai cifre de 9', correct: false },
        { label: 'Un număr divizibil atât cu 2 cât și cu 5', correct: false },
        { label: 'Un număr care se termină cu 00', correct: false }
      ],
      explanation: 'Un număr perfect este egal cu suma divizorilor săi stricți (fără el însuși). Exemple celebre: 6 (1+2+3=6) și 28 (1+2+4+7+14=28)!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const isCorrect = CHALLENGES[qIdx].options[optIdx].correct;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback('Corect! ' + CHALLENGES[qIdx].explanation);
    } else {
      sounds.playWrong();
      setChallengeFeedback('Incorect. ' + CHALLENGES[qIdx].explanation);
    }
  };

  const handleNextChallenge = () => {
    sounds.playClick();
    setChallengeFeedback(null);
    if (challengeStep < CHALLENGES.length - 1) {
      setChallengeStep(prev => prev + 1);
    } else {
      setCompletedChallenge(true);
      sounds.playSuccess();
    }
  };

  const handleFinishLevel = () => {
    sounds.playSuccess();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/80 via-orange-900/80 to-slate-900 p-6 rounded-3xl border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 mb-2">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>Nivelul 3 din 7 • Modulul 4E</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Algoritmul Divizorilor, Numere Prime &amp; Numere Perfecte (pag. 88–90)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Aplică bucla <span className="text-amber-300 font-mono font-bold">for</span> pentru a detecta toți divizorii unui număr, a testa primalitatea și a descoperi proprietatea fascinantă a numerelor perfecte.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+15 XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Educational Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-amber-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Algoritmul C++ de Determinare a Divizorilor</span>
        </div>

        {/* C++ Code Blueprint */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 font-mono text-xs text-slate-200">
          <div className="text-slate-500 mb-1">// Testarea divizorilor și a numărului prim cu optimizarea d &lt;= n / 2</div>
          <div><span className="text-purple-400 font-bold">int</span> nr_divizori = 0;</div>
          <div><span className="text-purple-400 font-bold">for</span> (<span className="text-purple-400 font-bold">int</span> d = 2; d &lt;= n / 2; d++) &#123;</div>
          <div className="pl-4 text-amber-300">
            <span className="text-purple-400 font-bold">if</span> (n % d == 0) &#123; <span className="text-slate-400">// d divide exact pe n</span>
          </div>
          <div className="pl-8 text-emerald-300">cout &lt;&lt; d &lt;&lt; " ";</div>
          <div className="pl-8 text-cyan-300">nr_divizori++;</div>
          <div className="pl-4">&#125;</div>
          <div>&#125;</div>
          <div className="mt-1 text-slate-400">
            <span className="text-purple-400 font-bold">if</span> (nr_divizori == 0 && n &gt; 1) cout &lt;&lt; <span className="text-emerald-300">"Numar prim!"</span>;
          </div>
        </div>

        {/* Interactive Divisor Radar Scanner */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Binary className="w-4 h-4 text-amber-400" />
                <span>Scanner Interactiv de Divizori &amp; Numere Prime</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Introdu un număr sau alege dintre exemplele din manual (6, 17, 28, 47, 60, 100).
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[6, 17, 28, 47, 60].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePresetSelect(num)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    testNumber === num
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCustomScan} className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex-1 min-w-[200px]">
              <input
                type="number"
                min="1"
                max="1000"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Tastează un număr natural (1–1000)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm font-mono transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-600/20 active:scale-95"
            >
              <span>Scanează Divizorii</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Scanner Results Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Număr Analizat</span>
              <span className="text-2xl font-black font-mono text-white mt-0.5">{testNumber}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">
                {testNumber % 2 === 0 ? 'Număr par' : 'Număr impar'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Diagnostic Primalitate</span>
              <span className={`text-lg font-black font-mono mt-0.5 ${isPrime ? 'text-emerald-400' : 'text-amber-300'}`}>
                {isPrime ? 'NUMĂR PRIM' : 'NUMĂR COMPUS'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                {isPrime ? 'Are exact 2 divizori (1 și el însuși)' : `${divisors.length} divizori totali`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Număr Perfect?</span>
              <span className={`text-lg font-black font-mono mt-0.5 ${isPerfect ? 'text-cyan-300' : 'text-slate-400'}`}>
                {isPerfect ? 'DA! PERFECT' : 'NU'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                {isPerfect ? `Suma divizorilor proprii = ${testNumber}` : 'Suma divizorilor nu e egală cu n'}
              </span>
            </div>
          </div>

          {/* Divisor Pills Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs font-mono text-slate-400 block mb-2 font-bold uppercase tracking-wider">
              Divizorii lui {testNumber} ({divisors.length} divizori):
            </span>
            <div className="flex flex-wrap gap-2">
              {divisors.map((d) => {
                const isTrivial = d === 1 || d === testNumber;
                return (
                  <span
                    key={d}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition ${
                      isTrivial
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    }`}
                  >
                    {d} {isTrivial && <span className="text-[10px] text-slate-500 font-normal">({d === 1 ? 'impropriu' : 'impropriu'})</span>}
                  </span>
                );
              })}
            </div>

            {properDivisors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-300">
                Suma divizorilor proprii (excluzând {testNumber}):{' '}
                <span className="text-amber-300 font-bold">
                  {properDivisors.join(' + ')} = {properDivisors.reduce((a, b) => a + b, 0)}
                </span>
                {isPerfect && (
                  <span className="ml-2 text-cyan-300 font-bold">
                    (Egal cu {testNumber} -&gt; Număr Perfect conform manual pag. 89!)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Verificare Înțelegere: Divizori &amp; Primalitate ({challengeStep + 1} din {CHALLENGES.length})</span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {CHALLENGES[challengeStep].question}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-amber-300 whitespace-pre">
                  {CHALLENGES[challengeStep].code}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {CHALLENGES[challengeStep].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[challengeStep] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(challengeStep, oIdx)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? opt.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        opt.correct ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {challengeFeedback && (
                <div className={`p-3 rounded-xl text-xs border ${challengeFeedback.startsWith('Corect') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                  {challengeFeedback}
                </div>
              )}

              {selectedAnswers[challengeStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="self-end py-2 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{challengeStep < CHALLENGES.length - 1 ? 'Următoarea Întrebare' : 'Finalizează Nivelul 3'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">Nivelul 3 Finalizat cu Succes!</h4>
              <p className="text-xs text-slate-300 max-w-md">
                Stăpânești algoritmul optim de căutare a divizorilor până la n/2, noțiunea de număr prim și proprietatea numerelor perfecte.
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>Treci la Nivelul 4: Bucle Îmbricate &amp; Modele Grafice ASCII</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
