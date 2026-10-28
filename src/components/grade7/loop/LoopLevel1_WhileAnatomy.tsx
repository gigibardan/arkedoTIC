import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Repeat,
  Play,
  Lightbulb,
  Check,
  ChevronRight,
  Layers
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface StepperState {
  step: number;
  i: number;
  conditionMet: boolean;
  outputList: string[];
  isDone: boolean;
}

const CHALLENGES = [
  {
    id: 'c1',
    title: 'Numărare crescătoare 1 la 5',
    codeSnippet: 'int i = 1;\nwhile (i <= 5) {\n    cout << i << " ";\n    i = i + 1;\n}',
    initialI: 1,
    limit: 5,
    operator: '<=',
    stepIncrement: 1,
    expectedSteps: 5,
    finalOutput: '1 2 3 4 5 ',
    question: 'De câte ori se execută corpul buclei?',
    options: ['5 ori (pentru i = 1, 2, 3, 4, 5)', '6 ori', '4 ori', 'O singură dată'],
    correctOptionIdx: 0,
    explanation: 'Bucla rulează pentru i = 1, 2, 3, 4, 5. Când i devine 6, condiția 6 <= 5 este falsă, iar bucla se oprește.'
  },
  {
    id: 'c2',
    title: 'Testul inițial fals (Execuție zero)',
    codeSnippet: 'int i = 10;\nwhile (i < 5) {\n    cout << "Salut!";\n    i++;\n}',
    initialI: 10,
    limit: 5,
    operator: '<',
    stepIncrement: 1,
    expectedSteps: 0,
    finalOutput: '',
    question: 'Ce se va afișa pe ecran?',
    options: [
      'Nimic! Corpul buclei nu se execută nici măcar o singură dată!',
      'Textul "Salut!" o singură dată.',
      'Textul "Salut!" de 10 ori.',
      'Eroare de compilare.'
    ],
    correctOptionIdx: 0,
    explanation: 'La intrarea în buclă se testează direct 10 < 5, care este FALS. Deoarece while verifică condiția înainte (test inițial), corpul este sărit complet!'
  },
  {
    id: 'c3',
    title: 'Numărătoare inversă: Lansare Rachetă',
    codeSnippet: 'int secunde = 3;\nwhile (secunde > 0) {\n    cout << secunde << "... ";\n    secunde--;\n}\ncout << "START!";',
    initialI: 3,
    limit: 0,
    operator: '>',
    stepIncrement: -1,
    expectedSteps: 3,
    finalOutput: '3... 2... 1... START!',
    question: 'Care este valoarea variabilei secunde imediat după oprirea buclei?',
    options: [
      '0 (la 0 condiția 0 > 0 este falsă și se iese din buclă)',
      '1',
      '-1',
      '3'
    ],
    correctOptionIdx: 0,
    explanation: 'Bucla se oprește exact în momentul în care secunde ajunge la 0, deoarece 0 > 0 este fals.'
  }
];

export const LoopLevel1_WhileAnatomy: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);
  const [showTheoryTips, setShowTheoryTips] = useState(false);

  // Interactive Live Stepper State
  const [stepperState, setStepperState] = useState<StepperState>({
    step: 0,
    i: 1,
    conditionMet: true,
    outputList: [],
    isDone: false
  });

  const currentChallenge = CHALLENGES[currentIdx];
  const isFinished = currentIdx >= CHALLENGES.length;

  const handleNextStep = () => {
    sounds.playClick();
    if (stepperState.isDone) return;

    const currentI = stepperState.i;
    let condMet = false;
    if (currentChallenge.operator === '<=') condMet = currentI <= currentChallenge.limit;
    if (currentChallenge.operator === '<') condMet = currentI < currentChallenge.limit;
    if (currentChallenge.operator === '>') condMet = currentI > currentChallenge.limit;

    if (condMet) {
      const newOutput = currentChallenge.operator === '>'
        ? `${currentI}... `
        : `${currentI} `;
      const nextI = currentI + currentChallenge.stepIncrement;
      
      let nextCondMet = false;
      if (currentChallenge.operator === '<=') nextCondMet = nextI <= currentChallenge.limit;
      if (currentChallenge.operator === '<') nextCondMet = nextI < currentChallenge.limit;
      if (currentChallenge.operator === '>') nextCondMet = nextI > currentChallenge.limit;

      setStepperState(prev => ({
        step: prev.step + 1,
        i: nextI,
        conditionMet: nextCondMet,
        outputList: [...prev.outputList, newOutput],
        isDone: !nextCondMet
      }));
    } else {
      setStepperState(prev => ({ ...prev, isDone: true, conditionMet: false }));
    }
  };

  const handleResetStepper = () => {
    sounds.playClick();
    const condInitial = currentChallenge.operator === '<='
      ? currentChallenge.initialI <= currentChallenge.limit
      : currentChallenge.operator === '<'
      ? currentChallenge.initialI < currentChallenge.limit
      : currentChallenge.initialI > currentChallenge.limit;

    setStepperState({
      step: 0,
      i: currentChallenge.initialI,
      conditionMet: condInitial,
      outputList: [],
      isDone: !condInitial
    });
  };

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const isCorrect = idx === currentChallenge.correctOptionIdx;
    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 35);
      setFeedback({
        isCorrect: true,
        text: `Excelent! ${currentChallenge.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Nu chiar. Analizează trace-table-ul pas cu pas! ${currentChallenge.explanation}`
      });
    }
  };

  const handleNextChallenge = () => {
    sounds.playClick();
    setSelectedOptIdx(null);
    setFeedback(null);
    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);

    if (nextIdx < CHALLENGES.length) {
      const nextC = CHALLENGES[nextIdx];
      const condInit = nextC.operator === '<='
        ? nextC.initialI <= nextC.limit
        : nextC.operator === '<'
        ? nextC.initialI < nextC.limit
        : nextC.initialI > nextC.limit;

      setStepperState({
        step: 0,
        i: nextC.initialI,
        conditionMet: condInit,
        outputList: [],
        isDone: !condInit
      });
    }
  };

  const handleFinishLevel = () => {
    sounds.playLevelUp();
    onPass(Math.min(score, 100));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/70 via-slate-900 to-red-950/60 p-5 sm:p-6 rounded-3xl border-2 border-orange-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 1 din 7 • Modulul 4D
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 81–82</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Repeat className="w-6 h-6 text-orange-400" />
            <span>Anatomia Buclei while &amp; Schema Logică cu Test Inițial</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Descoperă structura repetitivă cu număr necunoscut de pași! Învață cum se evaluează condiția de oprire la fiecare iterație și cum funcționează testul inițial.
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 1:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-orange-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Step-by-Step Loop Stepper Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              🔄
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Simulator Interactiv: Execuție Pas cu Pas (Trace Table Live)
              </h3>
              <p className="text-xs text-slate-400">
                Apasă pe butonul de rulare pas cu pas pentru a urmări cum se modifică variabila și condiția logică la fiecare iterație:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetStepper}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetează</span>
            </button>
            <button
              type="button"
              disabled={stepperState.isDone}
              onClick={handleNextStep}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                stepperState.isDone
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-400 text-slate-950 active:scale-95'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{stepperState.step === 0 ? 'Pornește Pasul 1' : 'Următorul Pas (Next)'}</span>
            </button>
          </div>
        </div>

        {/* Code Snippet & Stepper Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Code Snippet */}
          <div className="lg:col-span-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <div className="text-slate-500 text-[11px] mb-2">// Cod C++ în execuție:</div>
            <pre className="text-slate-200 leading-relaxed overflow-x-auto">
              {currentChallenge.codeSnippet}
            </pre>
            <div className="mt-4 pt-3 border-t border-slate-800 text-slate-400 text-xs">
              <div>Condiție testată la fiecare intrare:</div>
              <div className="text-amber-300 font-bold mt-1">
                {`while (${stepperState.i} ${currentChallenge.operator} ${currentChallenge.limit})`} &rarr;{' '}
                <span className={stepperState.conditionMet ? 'text-emerald-400' : 'text-rose-400'}>
                  {stepperState.conditionMet ? 'ADEVĂRAT (true) &bull; continuă bucla' : 'FALS (false) &bull; STOP buclă!'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Live Monitor & Console */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Variables Gauge */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Iterația (Pasul)</div>
                <div className="text-xl font-black text-white mt-1">{stepperState.step}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-orange-500/40">
                <div className="text-orange-400 text-[10px] uppercase font-bold">Variabila i</div>
                <div className="text-xl font-black text-orange-300 mt-1">{stepperState.i}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Stare Buclă</div>
                <div className={`text-xs font-bold mt-2 ${stepperState.isDone ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {stepperState.isDone ? 'OPRITĂ (EXIT)' : 'ACTIVĂ'}
                </div>
              </div>
            </div>

            {/* Simulated Console Screen */}
            <div className="bg-black p-4 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col min-h-[120px]">
              <div className="text-slate-500 text-[10px] uppercase border-b border-slate-900 pb-1 mb-2">
                Ecran Consolă (Ieșire cout)
              </div>
              <div className="text-emerald-400 text-sm font-bold flex-1 flex items-center">
                {stepperState.outputList.length > 0 ? (
                  <span>{stepperState.outputList.join('')}</span>
                ) : (
                  <span className="text-slate-600 italic">[niciun caracter afișat încă]</span>
                )}
              </div>
              {stepperState.isDone && (
                <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-900">
                  Bucla s-a încheiat. Execuția trece la instrucțiunile următoare din afara acoladelor.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question & Evaluation Challenge */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs font-mono">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Provocarea {currentIdx + 1} din {CHALLENGES.length}: {currentChallenge.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Întrebarea {currentIdx + 1}/{CHALLENGES.length}
            </span>
          </div>

          <div className="text-sm font-bold text-white">
            {currentChallenge.question}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left font-mono transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? idx === currentChallenge.correctOptionIdx
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : selectedOptIdx !== null && idx === currentChallenge.correctOptionIdx
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? idx === currentChallenge.correctOptionIdx
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-xs sm:text-sm leading-relaxed font-sans">
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Continue */}
          {feedback && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium leading-relaxed font-sans">
                  {feedback.text}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextChallenge}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md font-sans"
              >
                <span>Următoarea Provocare</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-orange-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            🔄
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Nivelul 1 Finalizat cu Succes!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Ai înțeles perfect modul de funcționare al buclei <code className="text-orange-400 font-bold">while</code>, evaluarea condiției la intrare și urmărirea valorilor variabilelor la fiecare pas!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-orange-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 2: Capcana Buclei Infinite (Infinite Loop Trap)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
