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
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface BugScenario {
  id: string;
  titleRo: string;
  titleEn: string;
  badCode: string;
  whyInfiniteRo: string;
  whyInfiniteEn: string;
  questionRo: string;
  questionEn: string;
  options: {
    labelRo: string;
    labelEn: string;
    isCorrect: boolean;
    explanationRo: string;
    explanationEn: string;
  }[];
  fixedCode: string;
}

const BUG_SCENARIOS: BugScenario[] = [
  {
    id: 'b1',
    titleRo: 'Uitarea Instrucțiunii de Pas (Lipsa lui i++)',
    titleEn: 'Missing the Step Instruction (Missing i++)',
    badCode: 'int i = 1;\nwhile (i <= 10) {\n    cout << i << " ";\n    // Lipseste incrementarea!\n}',
    whyInfiniteRo: 'i rămâne mereu 1! Condiția 1 <= 10 este etern adevărată, iar bucla va afișa „1 1 1 1...” la infinit.',
    whyInfiniteEn: 'i stays 1 forever! 1 <= 10 remains perpetually true, and the loop prints "1 1 1 1..." infinitely.',
    questionRo: 'De ce această buclă devine infinită și blochează procesorul?',
    questionEn: 'Why does this loop become infinite and lock the CPU?',
    options: [
      {
        labelRo: 'Variabila i nu este modificată niciodată în interiorul acoladelor, rămânând mereu 1 <= 10.',
        labelEn: 'Variable i is never updated inside the braces, always remaining 1 <= 10.',
        isCorrect: true,
        explanationRo: 'Corect! Pentru ca o buclă să se oprească, variabila testată în condiție trebuie să se apropie de valoarea de oprire la fiecare pas (ex: i++).',
        explanationEn: 'Correct! For a loop to stop, the variable tested in the condition must approach the exit condition at each step (e.g., i++).'
      },
      {
        labelRo: 'C++ nu suportă numere până la 10 în bucle.',
        labelEn: 'C++ does not support numbers up to 10 in loops.',
        isCorrect: false,
        explanationRo: 'Fals, C++ poate număra până la miliarde.',
        explanationEn: 'False, C++ can count up to billions.'
      },
      {
        labelRo: 'Trebuia folosit operatorul == în loc de <=.',
        labelEn: 'The == operator should have been used instead of <=.',
        isCorrect: false,
        explanationRo: 'Operatorul <= este corect pentru parcurgerea unui interval, problema este lipsa pasului.',
        explanationEn: '<= is appropriate for traversing an interval; the issue is the lack of a step.'
      }
    ],
    fixedCode: 'int i = 1;\nwhile (i <= 10) {\n    cout << i << " ";\n    i++; // Pasul care apropie i de 10!\n}'
  },
  {
    id: 'b2',
    titleRo: 'Sensul Greșit de Deplasare (Scădere în loc de Adunare)',
    titleEn: 'Wrong Direction of Movement (Decrement instead of Increment)',
    badCode: 'int i = 1;\nwhile (i < 100) {\n    cout << i << " ";\n    i--; // In loc sa creasca spre 100, i scade!\n}',
    whyInfiniteRo: 'i devine 0, -1, -2, -3... îndepărtându-se la infinit de 100! Condiția i < 100 va fi MEREU adevărată.',
    whyInfiniteEn: 'i becomes 0, -1, -2, -3... moving infinitely away from 100! i < 100 will ALWAYS be true.',
    questionRo: 'Ce eroare logică gravă a comis programatorul?',
    questionEn: 'What serious logical error did the programmer make?',
    options: [
      {
        labelRo: 'A scris i-- în loc de i++. Variabila scade în valori negative și nu va ajunge niciodată la 100!',
        labelEn: 'They wrote i-- instead of i++. The variable decreases into negatives and will never reach 100!',
        isCorrect: true,
        explanationRo: 'Exact! Când căutăm o limită superioară (i < 100), contorul trebuie să crească (i++), nu să scadă.',
        explanationEn: 'Exactly! When targeting an upper boundary (i < 100), the counter must increment (i++), not decrement.'
      },
      {
        labelRo: 'Numărul 100 este prea mare pentru o buclă.',
        labelEn: 'The number 100 is too large for a loop.',
        isCorrect: false,
        explanationRo: 'Numărul 100 este foarte mic pentru un procesor modern.',
        explanationEn: '100 is trivial for modern processors.'
      },
      {
        labelRo: 'Lipsesc ghilimelele din jurul condiției.',
        labelEn: 'Quotes are missing around the condition.',
        isCorrect: false,
        explanationRo: 'Condițiile nu se pun niciodată între ghilimele.',
        explanationEn: 'Conditions are never enclosed in quotation marks.'
      }
    ],
    fixedCode: 'int i = 1;\nwhile (i < 100) {\n    cout << i << " ";\n    i++; // Creste corect spre 100\n}'
  },
  {
    id: 'b3',
    titleRo: 'Tăierea cifrelor: Uitarea lui n = n / 10',
    titleEn: 'Digit Truncation: Missing n = n / 10',
    badCode: 'int n = 458;\nwhile (n > 0) {\n    int u = n % 10;\n    cout << u << " ";\n    // Am uitat sa taiem ultima cifra!\n}',
    whyInfiniteRo: 'Fără n = n / 10, numărul rămâne mereu 458, afișând ultima cifră 8 la infinit!',
    whyInfiniteEn: 'Without n = n / 10, the number remains 458 forever, outputting the last digit 8 infinitely!',
    questionRo: 'Care este instrucțiunea indispensabilă care reduce numărul la fiecare pas?',
    questionEn: 'What is the indispensable instruction that reduces the number at each step?',
    options: [
      {
        labelRo: 'n = n / 10; (care taie ultima cifră și transformă 458 -> 45 -> 4 -> 0).',
        labelEn: 'n = n / 10; (which chops the last digit and transforms 458 -> 45 -> 4 -> 0).',
        isCorrect: true,
        explanationRo: 'Bravo! Fără împărțirea întreagă la 10, numărul n nu va ajunge niciodată la 0, iar bucla nu se va opri.',
        explanationEn: 'Bravo! Without integer division by 10, number n will never reach 0, and the loop will never stop.'
      },
      {
        labelRo: 'n = n % 10;',
        labelEn: 'n = n % 10;',
        isCorrect: false,
        explanationRo: 'Aceasta extrage cifra unităților, dar nu reduce numărul întreg.',
        explanationEn: 'This extracts the units digit, but does not truncate the whole number.'
      },
      {
        labelRo: 'n = 0;',
        labelEn: 'n = 0;',
        isCorrect: false,
        explanationRo: 'Dacă punem direct n = 0, bucla se oprește după o singură cifră fără a le prelucra pe celelalte.',
        explanationEn: 'If we assign n = 0 directly, the loop halts after just one digit without processing the others.'
      }
    ],
    fixedCode: 'int n = 458;\nwhile (n > 0) {\n    int u = n % 10;\n    cout << u << " ";\n    n = n / 10; // Taie ultima cifra!\n}'
  }
];

export const LoopLevel2_InfiniteLoopTrap: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
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
    setSimOutput([lang === 'ro' ? '[START EXECUȚIE PROIECT FĂRĂ INSTRUCȚIUNE DE PAS]' : '[START PROJECT EXECUTION WITHOUT STEP STATEMENT]']);
  };

  const handleEmergencyStop = () => {
    sounds.playSuccess();
    setIsSimulatingLoop(false);
    setCpuTemp(42);
    setSimOutput(prev => [
      ...prev,
      lang === 'ro' ? '>>> SEMNAL TRANSMIS: Ctrl + C <<<' : '>>> SIGNAL SENT: Ctrl + C <<<',
      lang === 'ro' ? '[PROCES OPRIT DE URGENȚĂ. CPU RĂCIT.]' : '[EMERGENCY PROCESS HALTED. CPU COOLED.]'
    ]);
  };

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const opt = currentScenario.options[idx];
    const explanation = lang === 'ro' ? opt.explanationRo : opt.explanationEn;
    if (opt.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 35);
      setFeedback({
        isCorrect: true,
        text: `${lang === 'ro' ? 'Excelent observat!' : 'Great catch!'} ${explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `${lang === 'ro' ? 'Atenție!' : 'Careful!'} ${explanation}`
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
              {lang === 'ro' ? 'Nivelul 2 din 7 • Modulul 4D' : 'Level 2 of 7 • Module 4D'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Manual Art Klett pag. 81' : 'Art Klett Textbook p. 81'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-red-400 animate-pulse" />
            <span>{lang === 'ro' ? 'Capcana Buclei Infinite (Infinite Loop Trap)' : 'Infinite Loop Trap'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'ro'
              ? 'Cea mai periculoasă capcană la structurile repetitive: Dacă uiți să apropii contorul de condiția de oprire, programul rulează la nesfârșit și îngheață calculatorul!'
              : 'The most dangerous loop pitfall: if you forget to advance the counter toward the exit condition, the program spins forever and freezes the computer!'}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">{lang === 'ro' ? 'Scor Nivel 2:' : 'Level 2 Score:'}</span>
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
                {lang === 'ro'
                  ? 'Simulator de Încălzire Procesor (100% CPU Consumption)'
                  : 'CPU Thermal Simulator (100% CPU Consumption)'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ro'
                  ? 'Testează ce se întâmplă când pornești o buclă fără condiție de oprire și folosește scurtătura salvatoare Ctrl + C!'
                  : 'See what happens when running a loop with no stopping progress and trigger the emergency Ctrl + C shortcut!'}
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
                <span>{lang === 'ro' ? 'Simulează Bucla Infinită!' : 'Simulate Infinite Loop!'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEmergencyStop}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/40 animate-bounce"
              >
                <Power className="w-4 h-4" />
                <span>{lang === 'ro' ? 'APASĂ Ctrl + C (OPREȘTE FORȚAT!)' : 'PRESS Ctrl + C (FORCE STOP!)'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Thermal Meter */}
          <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> {lang === 'ro' ? 'Temperatură Nucleu CPU:' : 'CPU Core Temperature:'}
              </span>
              <span className={`text-base font-black ${
                cpuTemp >= 80 ? 'text-red-400 animate-pulse' : cpuTemp >= 60 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {cpuTemp}&deg;C {cpuTemp >= 90 ? (lang === 'ro' ? '🔥 CRITIC!' : '🔥 CRITICAL!') : ''}
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
              💡 <strong>{lang === 'ro' ? 'Regula de Aur din Manual:' : 'Golden Rule from Textbook:'}</strong>{' '}
              {lang === 'ro'
                ? 'Orice buclă while trebuie să conțină o instrucțiune care modifică variabila testată, garantând atingerea condiției de oprire!'
                : 'Every while loop must contain a statement modifying the tested variable, ensuring the exit condition is eventually met!'}
            </div>
          </div>

          {/* Console Output Dump */}
          <div className="md:col-span-7 bg-black p-3.5 rounded-2xl border border-slate-800 font-mono text-[11px] h-32 overflow-y-auto flex flex-col justify-end">
            <div className="text-slate-600 mb-1">{lang === 'ro' ? '// Monitor ieșire ecran:' : '// Screen output monitor:'}</div>
            {simOutput.length === 0 ? (
              <div className="text-slate-600 italic">
                {lang === 'ro' ? 'Sistem în stare de repaus normală (idle).' : 'System is idle.'}
              </div>
            ) : (
              simOutput.map((line, i) => (
                <div key={i} className={line.includes('OPRIT') || line.includes('HALTED') ? 'text-emerald-400 font-bold' : line.includes('START') ? 'text-amber-400' : 'text-red-400'}>
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
                {lang === 'ro'
                  ? `Detectorul de Bucle Infinite ${currentIdx + 1}/${BUG_SCENARIOS.length}: ${currentScenario.titleRo}`
                  : `Infinite Loop Detector ${currentIdx + 1}/${BUG_SCENARIOS.length}: ${currentScenario.titleEn}`}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro' ? `Cazul ${currentIdx + 1}/${BUG_SCENARIOS.length}` : `Case ${currentIdx + 1}/${BUG_SCENARIOS.length}`}
            </span>
          </div>

          {/* Bad Code Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/40 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between text-[11px] text-red-400 mb-2">
              <span className="flex items-center gap-1 font-bold">
                <Bug className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Cod greșit cu risc de buclă infinită:' : 'Buggy code risking infinite loop:'}
              </span>
            </div>
            <pre className="text-red-200 overflow-x-auto">
              {currentScenario.badCode}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            {lang === 'ro' ? currentScenario.questionRo : currentScenario.questionEn}
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
                    {lang === 'ro' ? opt.labelRo : opt.labelEn}
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
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />{' '}
                    {lang === 'ro' ? 'Soluția corectă (fără buclă infinită):' : 'Correct solution (no infinite loop):'}
                  </div>
                  <pre className="text-emerald-300 text-xs">{currentScenario.fixedCode}</pre>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md self-end sm:self-auto font-sans"
                >
                  <span>{lang === 'ro' ? 'Continuă' : 'Continue'}</span>
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
              {lang === 'ro' ? 'Protecție Împotriva Buclelor Infinite Asigurată!' : 'Infinite Loop Protection Secured!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              {lang === 'ro'
                ? 'Ai învățat să identifici lipsa instrucțiunilor de pas, să alegi sensul corect de parcurgere și să asiguri oprirea algoritmilor!'
                : 'You have learned how to spot missing step instructions, select the right direction, and ensure algorithms always terminate!'}
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-red-400 font-mono font-bold text-sm">
            {lang === 'ro' ? `Scor obținut: +${score} XP` : `Earned Score: +${score} XP`}
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>
              {lang === 'ro'
                ? 'Treci la Nivelul 3: Mecanismul de Aur (Extragere n % 10 & Tăiere n / 10)'
                : 'Proceed to Level 3: Golden Mechanism (Extract n % 10 & Truncate n / 10)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
