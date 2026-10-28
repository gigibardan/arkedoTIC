import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Bug,
  ShieldCheck,
  Check,
  Terminal,
  Cpu,
  Power,
  RotateCcw
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface BugScenario {
  id: string;
  title: string;
  badCode: string;
  whyInfinite: string;
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  fixedCode: string;
}

const BUG_SCENARIOS: BugScenario[] = [
  {
    id: 'b1',
    title: 'Uitarea Instrucțiunii de Pas (Lipsa lui i++)',
    badCode: 'int i = 1;\nwhile (i <= 10) {\n    cout << i << " ";\n    // Lipseste incrementarea!\n}',
    whyInfinite: 'i rămâne mereu 1! Condiția 1 <= 10 este etern adevărată, iar bucla va afișa „1 1 1 1...” la infinit.',
    question: 'De ce această buclă devine infinită și blochează procesorul?',
    options: [
      {
        label: 'Variabila i nu este modificată niciodată în interiorul acoladelor, rămânând mereu 1 <= 10.',
        isCorrect: true,
        explanation: 'Corect! Pentru ca o buclă să se oprească, variabila testată în condiție trebuie să se apropie de valoarea de oprire la fiecare pas (ex: i++).'
      },
      {
        label: 'C++ nu suportă numere până la 10 în bucle.',
        isCorrect: false,
        explanation: 'Fals, C++ poate număra până la miliarde.'
      },
      {
        label: 'Trebuia folosit operatorul == în loc de <=.',
        isCorrect: false,
        explanation: 'Operatorul <= este corect pentru parcurgerea unui interval, problema este lipsa pasului.'
      }
    ],
    fixedCode: 'int i = 1;\nwhile (i <= 10) {\n    cout << i << " ";\n    i++; // Pasul care apropie i de 10!\n}'
  },
  {
    id: 'b2',
    title: 'Sensul Greșit de Deplasare (Scădere în loc de Adunare)',
    badCode: 'int i = 1;\nwhile (i < 100) {\n    cout << i << " ";\n    i--; // In loc sa creasca spre 100, i scade!\n}',
    whyInfinite: 'i devine 0, -1, -2, -3... îndepărtându-se la infinit de 100! Condiția i < 100 va fi MEREU adevărată.',
    question: 'Ce eroare logică gravă a comis programatorul?',
    options: [
      {
        label: 'A scris i-- în loc de i++. Variabila scade în valori negative și nu va ajunge niciodată la 100!',
        isCorrect: true,
        explanation: 'Exact! Când căutăm o limită superioară (i < 100), contorul trebuie să crească (i++), nu să scadă.'
      },
      {
        label: 'Numărul 100 este prea mare pentru o buclă.',
        isCorrect: false,
        explanation: 'Numărul 100 este foarte mic pentru un procesor modern.'
      },
      {
        label: 'Lipsesc ghilimelele din jurul condiției.',
        isCorrect: false,
        explanation: 'Condițiile nu se pun niciodată între ghilimele.'
      }
    ],
    fixedCode: 'int i = 1;\nwhile (i < 100) {\n    cout << i << " ";\n    i++; // Creste corect spre 100\n}'
  },
  {
    id: 'b3',
    title: 'Tăierea cifrelor: Uitarea lui n = n / 10',
    badCode: 'int n = 458;\nwhile (n > 0) {\n    int u = n % 10;\n    cout << u << " ";\n    // Am uitat sa taiem ultima cifra!\n}',
    whyInfinite: 'Fără n = n / 10, numărul rămâne mereu 458, afișând ultima cifră 8 la infinit!',
    question: 'Care este instrucțiunea indispensabilă care reduce numărul la fiecare pas?',
    options: [
      {
        label: 'n = n / 10; (care taie ultima cifră și transformă 458 -> 45 -> 4 -> 0).',
        isCorrect: true,
        explanation: 'Bravo! Fără împărțirea întreagă la 10, numărul n nu va ajunge niciodată la 0, iar bucla nu se va opri.'
      },
      {
        label: 'n = n % 10;',
        isCorrect: false,
        explanation: 'Aceasta extrage cifra unităților, dar nu reduce numărul întreg.'
      },
      {
        label: 'n = 0;',
        isCorrect: false,
        explanation: 'Dacă punem direct n = 0, bucla se oprește după o singură cifră fără a le prelucra pe celelalte.'
      }
    ],
    fixedCode: 'int n = 458;\nwhile (n > 0) {\n    int u = n % 10;\n    cout << u << " ";\n    n = n / 10; // Taie ultima cifra!\n}'
  }
];

export const LoopLevel2_InfiniteLoopTrap: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Simulated CPU Overheating & Infinite Loop Simulator
  const [isSimulatingLoop, setIsSimulatingLoop] = useState<boolean>(false);
  const [cpuTemp, setCpuTemp] = useState<number>(45);
  const [simOutput, setSimOutput] = useState<string[]>([]);

  const currentScenario = BUG_SCENARIOS[currentIdx];
  const isFinished = currentIdx >= BUG_SCENARIOS.length;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSimulatingLoop) {
      timer = setInterval(() => {
        setCpuTemp(prev => Math.min(100, prev + 5));
        setSimOutput(prev => [...prev.slice(-15), '1 1 1 1 1 1 1 1 1 1...']);
      }, 150);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSimulatingLoop]);

  const handleStartInfiniteSimulation = () => {
    sounds.playWrong();
    setIsSimulatingLoop(true);
    setSimOutput(['[START EXECUȚIE PROIECT FĂRĂ INSTRUCȚIUNE DE PAS]']);
  };

  const handleEmergencyStop = () => {
    sounds.playSuccess();
    setIsSimulatingLoop(false);
    setCpuTemp(42);
    setSimOutput(prev => [
      ...prev,
      '>>> SEMNAL TRANSMIS: Ctrl + C <<<',
      '[PROCES OPRIT DE URGENȚĂ. CPU RĂCIT.]'
    ]);
  };

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const opt = currentScenario.options[idx];
    if (opt.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 35);
      setFeedback({
        isCorrect: true,
        text: `Excelent observat! ${opt.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Atenție! ${opt.explanation}`
      });
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setSelectedOptIdx(null);
    setFeedback(null);
    setIsSimulatingLoop(false);
    setCpuTemp(45);
    setSimOutput([]);
    setCurrentIdx(i => i + 1);
  };

  const handleFinishLevel = () => {
    sounds.playLevelUp();
    onPass(Math.min(score, 100));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-orange-950/70 p-5 sm:p-6 rounded-3xl border-2 border-red-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 2 din 7 • Modulul 4D
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 81</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-red-400 animate-pulse" />
            <span>Capcana Buclei Infinite (Infinite Loop Trap)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Cea mai periculoasă capcană la structurile repetitive: Dacă uiți să apropii contorul de condiția de oprire, programul rulează la nesfârșit și îngheață calculatorul!
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 2:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-red-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Simulated Thermal CPU Gauge & Emergency Ctrl+C Sandbox */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              🌡️
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Simulator de Încălzire Procesor (100% CPU Consumption)
              </h3>
              <p className="text-xs text-slate-400">
                Testează ce se întâmplă când pornești o buclă fără condiție de oprire și folosește scurtătura salvatoare <code className="text-amber-300 font-bold">Ctrl + C</code>!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSimulatingLoop ? (
              <button
                type="button"
                onClick={handleStartInfiniteSimulation}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/30"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Simulează Bucla Infinită!</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEmergencyStop}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/40 animate-bounce"
              >
                <Power className="w-4 h-4" />
                <span>APASĂ Ctrl + C (OPREȘTE FORȚAT!)</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Thermal Meter */}
          <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Temperatură Nucleu CPU:
              </span>
              <span className={`text-base font-black ${
                cpuTemp >= 80 ? 'text-red-400 animate-pulse' : cpuTemp >= 60 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {cpuTemp}&deg;C {cpuTemp >= 90 ? '🔥 CRITIC!' : ''}
              </span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  cpuTemp >= 80
                    ? 'bg-gradient-to-r from-amber-500 to-red-600'
                    : cpuTemp >= 60
                    ? 'bg-gradient-to-r from-teal-500 to-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${cpuTemp}%` }}
              ></div>
            </div>

            <div className="text-[11px] text-slate-400 leading-snug">
              💡 <strong>Regula de Aur din Manual:</strong> Orice buclă <code className="text-orange-400">while</code> trebuie să conțină o instrucțiune care modifică variabila testată, garantând atingerea condiției de oprire!
            </div>
          </div>

          {/* Console Output Dump */}
          <div className="md:col-span-7 bg-black p-3.5 rounded-2xl border border-slate-800 font-mono text-[11px] h-32 overflow-y-auto flex flex-col justify-end">
            <div className="text-slate-600 mb-1">// Monitor ieșire ecran:</div>
            {simOutput.length === 0 ? (
              <div className="text-slate-600 italic">Sistem în stare de repaus normală (idle).</div>
            ) : (
              simOutput.map((line, i) => (
                <div key={i} className={line.includes('OPRIT') ? 'text-emerald-400 font-bold' : line.includes('START') ? 'text-amber-400' : 'text-red-400'}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs font-mono">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Detectorul de Bucle Infinite {currentIdx + 1}/{BUG_SCENARIOS.length}: {currentScenario.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Cazul {currentIdx + 1}/{BUG_SCENARIOS.length}
            </span>
          </div>

          {/* Bad Code Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/40 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between text-[11px] text-red-400 mb-2">
              <span className="flex items-center gap-1 font-bold">
                <Bug className="w-3.5 h-3.5" /> Cod greșit cu risc de buclă infinită:
              </span>
            </div>
            <pre className="text-red-200 overflow-x-auto">
              {currentScenario.badCode}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            {currentScenario.question}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentScenario.options.map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : selectedOptIdx !== null && opt.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-xs sm:text-sm leading-relaxed font-sans">
                    {opt.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Correct Code */}
          {feedback && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <div className={`p-4 rounded-2xl border flex items-center gap-2.5 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
              }`}>
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium leading-relaxed font-sans">
                  {feedback.text}
                </span>
              </div>

              {/* Fixed Code Preview */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-emerald-500/40 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Soluția corectă (fără buclă infinită):
                  </div>
                  <pre className="text-emerald-300 text-xs">{currentScenario.fixedCode}</pre>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md self-end sm:self-auto font-sans"
                >
                  <span>Continuă</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-red-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            🛡️
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Protecție Împotriva Buclelor Infinite Asigurată!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Ai învățat să identifici lipsa instrucțiunilor de pas, să alegi sensul corect de parcurgere și să asiguri oprirea algoritmilor!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-red-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 3: Mecanismul de Aur (Extragere n % 10 &amp; Tăiere n / 10)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
