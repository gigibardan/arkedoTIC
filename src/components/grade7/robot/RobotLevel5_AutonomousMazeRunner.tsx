import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Lightbulb,
  Check,
  ChevronRight,
  HelpCircle,
  Compass,
  Navigation,
  ShieldAlert,
  Flag,
  FastForward
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

// 7x7 Grid Labirint
// 0 = Cale liberă, 1 = Zid, 2 = Punct Start, 3 = Ieșire (Target)
const MAZE_GRID: number[][] = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 3, 1],
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1]
];

// Direcții: 0: Nord (sus), 1: Est (dreapta), 2: Sud (jos), 3: Vest (stânga)
const DIR_DELTAS = [
  { r: -1, c: 0, name: 'Nord (▲)', angle: 0 },
  { r: 0, c: 1, name: 'Est (▶)', angle: 90 },
  { r: 1, c: 0, name: 'Sud (▼)', angle: 180 },
  { r: 0, c: -1, name: 'Vest (◀)', angle: 270 }
];

export const RobotLevel5_AutonomousMazeRunner: React.FC<Props> = ({ onPass }) => {
  // Starea robotului în labirint
  const [robotPos, setRobotPos] = useState<{ r: number; c: number }>({ r: 1, c: 1 });
  const [robotDir, setRobotDir] = useState<number>(1); // începe orientat spre Est
  const [visitedCells, setVisitedCells] = useState<string[]>(['1,1']);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);
  const [logMessages, setLogMessages] = useState<string[]>([
    'Robot inițializat la coordonatele (1, 1), orientare Est.',
    'Senzor ultrasonic activ: detectează obstacole la distanța de 1 bloc.'
  ]);

  // Challenge State
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  // Verifică starea celulei în fața robotului
  const getCellAhead = (pos: { r: number; c: number }, dir: number) => {
    const delta = DIR_DELTAS[dir];
    const nr = pos.r + delta.r;
    const nc = pos.c + delta.c;
    if (nr < 0 || nr >= 7 || nc < 0 || nc >= 7) return 1; // Zid exterior
    return MAZE_GRID[nr][nc];
  };

  // Verifică starea celulei din dreapta robotului (pentru Regula Mâinii Drepte)
  const getCellRight = (pos: { r: number; c: number }, dir: number) => {
    const rightDir = (dir + 1) % 4;
    return getCellAhead(pos, rightDir);
  };

  // Execută un pas conform Algoritmului Wall-Follower (Regula Mâinii Drepte)
  const executeStep = () => {
    if (isFinished) return;

    setStepCount(prev => prev + 1);

    // Verifică dacă robotul a atins ținta (3)
    if (MAZE_GRID[robotPos.r][robotPos.c] === 3) {
      setIsFinished(true);
      setIsRunning(false);
      sounds.playSuccess();
      setLogMessages(prev => [
        `🎉 SUCCES! Robotul a atins ieșirea din labirint în ${stepCount + 1} pași!`,
        ...prev.slice(0, 5)
      ]);
      return;
    }

    const rightDir = (robotDir + 1) % 4;
    const cellRight = getCellRight(robotPos, robotDir);
    const cellAhead = getCellAhead(robotPos, robotDir);

    // 1. Poate vira la dreapta? (Regula mâinii drepte prioritară)
    if (cellRight !== 1) {
      // Dreapta este liberă -> virează la dreapta și avansează
      const delta = DIR_DELTAS[rightDir];
      const newPos = { r: robotPos.r + delta.r, c: robotPos.c + delta.c };
      setRobotDir(rightDir);
      setRobotPos(newPos);
      setVisitedCells(prev => [...prev, `${newPos.r},${newPos.c}`]);
      setLogMessages(prev => [
        `[Pas ${stepCount + 1}] Cale liberă la dreapta! Viraj 90° dreapta și avans spre (${newPos.r}, ${newPos.c}).`,
        ...prev.slice(0, 5)
      ]);
      sounds.playClick();
      if (MAZE_GRID[newPos.r][newPos.c] === 3) {
        setIsFinished(true);
        setIsRunning(false);
        sounds.playSuccess();
      }
      return;
    }

    // 2. Poate merge înainte?
    if (cellAhead !== 1) {
      const delta = DIR_DELTAS[robotDir];
      const newPos = { r: robotPos.r + delta.r, c: robotPos.c + delta.c };
      setRobotPos(newPos);
      setVisitedCells(prev => [...prev, `${newPos.r},${newPos.c}`]);
      setLogMessages(prev => [
        `[Pas ${stepCount + 1}] Dreapta ocupată de perete. Înainte liber -> avans spre (${newPos.r}, ${newPos.c}).`,
        ...prev.slice(0, 5)
      ]);
      sounds.playClick();
      if (MAZE_GRID[newPos.r][newPos.c] === 3) {
        setIsFinished(true);
        setIsRunning(false);
        sounds.playSuccess();
      }
      return;
    }

    // 3. Este blocat în față și la dreapta -> virează la stânga (ocolire zid frontal)
    const leftDir = (robotDir + 3) % 4;
    setRobotDir(leftDir);
    setLogMessages(prev => [
      `[Pas ${stepCount + 1}] Obstacol frontal detectat (< 20 cm) și zid la dreapta! Viraj 90° la stânga.`,
      ...prev.slice(0, 5)
    ]);
    sounds.playClick();
  };

  // Timer pentru rulare automată
  useEffect(() => {
    let timer: any = null;
    if (isRunning && !isFinished) {
      timer = setTimeout(() => {
        executeStep();
      }, 550);
    }
    return () => clearTimeout(timer);
  }, [isRunning, isFinished, robotPos, robotDir, stepCount]);

  const resetMaze = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRobotPos({ r: 1, c: 1 });
    setRobotDir(1);
    setVisitedCells(['1,1']);
    setStepCount(0);
    setLogMessages([
      'Simulare resetată. Robot reamplasat la Start (1, 1).',
      'Algoritm pregătit: Wall Follower (Regula Mâinii Drepte).'
    ]);
    sounds.playClick();
  };

  // Întrebări interactive
  const QUIZ = [
    {
      q: 'Ce principiu fundamental utilizează algoritmul "Regula Mâinii Drepte" (Wall Follower)?',
      options: [
        'Alege direcțiile complet aleatoriu prin generarea unui număr random.',
        'Menține permanent contactul "imaginar" cu peretele din dreapta sa până când găsește ieșirea.',
        'Se deplasează mereu doar pe diagonale cu viteza maximă a motoarelor.',
        'Se oprește definitiv la primul obstacol detectat de senzorul ultrasonic.'
      ],
      correct: 1,
      explanation: 'Corect! Într-un labirint simplu conex, urmărirea neîntreruptă a peretelui drept garantează atingerea ieșirii fără blocare în bucle infinite.'
    },
    {
      q: 'Dacă senzorul ultrasonic frontal raportează o distanță de 12 cm, iar pragul de siguranță este 20 cm, ce acțiune trebuie să decidă microcontrolerul?',
      options: [
        'Să accelereze motoarele înainte pentru a sparge obstacolul mecanic.',
        'Să ignore valoarea deoarece este sub 50 cm.',
        'Să oprească avansul imediat și să execute o manevră de viraj de evitare (ex: viraj stânga/dreapta).',
        'Să inverseze polaritatea bateriei și să stingă senzorii.'
      ],
      correct: 2,
      explanation: 'Corect! Distanța sub pragul critic impune oprirea de urgență și schimbarea cursului prin rotirea robotului pe loc.'
    },
    {
      q: 'Cum verifică robotul dacă există o fundătură (cul-de-sac) în fața sa?',
      options: [
        'Dacă atât calea înainte, cât și cea din dreapta și din stânga sunt blocate de ziduri (obstacole < 20 cm), robotul execută o rotație de 180° (întoarcere din fundătură).',
        'Robotul emite un semnal Wi-Fi prin satelit.',
        'Robotul mărește tensiunea la 24V pe șasiu.',
        'Fundăturile sunt imposibil de detectat fără o cameră video HD.'
      ],
      correct: 0,
      explanation: 'Corect! Când toate cele trei direcții de avans sunt blocate, robotul se rotește 180° și revine la intersecția anterioară.'
    }
  ];

  const handleSelectAnswer = (idx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [challengeStep]: idx }));
    const isCorrect = idx === QUIZ[challengeStep].correct;
    if (isCorrect) {
      sounds.playSuccess();
      setChallengeFeedback(QUIZ[challengeStep].explanation);
    } else {
      sounds.playError();
      setChallengeFeedback('Răspuns incorect. Recitește principiul evitării obstacolelor și încearcă din nou!');
    }
  };

  const handleNextQuestion = () => {
    if (challengeStep < QUIZ.length - 1) {
      setChallengeStep(prev => prev + 1);
      setChallengeFeedback(null);
      sounds.playClick();
    } else {
      setCompletedChallenge(true);
      sounds.playLevelUp();
    }
  };

  const isCurrentAnswered = selectedAnswers[challengeStep] !== undefined;
  const isCurrentCorrect = selectedAnswers[challengeStep] === QUIZ[challengeStep].correct;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Navigation className="w-36 h-36 text-indigo-400" />
        </div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>Nivelul 5 • Robotică Autonomă &amp; Algoritmi de Navigație (Manual pag. 106–107)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Navigație Autonomă în Labirint &amp; Evitarea Obstacolelor
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Un robot autonom nu primește comenzi prin telecomandă: el <strong className="text-indigo-300">ia decizii în timp real</strong>{' '}
          pe baza senzorilor. Algoritmul <span className="text-amber-300 font-mono font-semibold">Wall Follower (Regula Mâinii Drepte)</span>{' '}
          permite parcurgerea oricărui labirint conex menținând peretele pe latura dreaptă și evitând coliziunile frontale.
        </p>
      </div>

      {/* Simulator Interactiv de Labirint 2D */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Harta Labirintului */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Labirintul Virtual 7×7</h2>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              Pași: <span className="text-indigo-400 font-bold">{stepCount}</span> | Orientare:{' '}
              <span className="text-amber-400 font-bold">{DIR_DELTAS[robotDir].name}</span>
            </div>
          </div>

          {/* Grilă 7x7 */}
          <div className="bg-slate-950 p-3 rounded-2xl border-2 border-indigo-900/60 shadow-inner inline-block">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {MAZE_GRID.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const isRobotHere = robotPos.r === rIdx && robotPos.c === cIdx;
                  const isVisited = visitedCells.includes(`${rIdx},${cIdx}`);
                  const isWall = cell === 1;
                  const isExit = cell === 3;
                  const isStart = cell === 2;

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono text-xs transition-all relative ${
                        isWall
                          ? 'bg-slate-800 border border-slate-700 shadow-md'
                          : isExit
                          ? 'bg-emerald-950/80 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20'
                          : isStart && !isRobotHere
                          ? 'bg-indigo-950/60 border border-indigo-700/60'
                          : isVisited
                          ? 'bg-indigo-950/40 border border-indigo-900/40'
                          : 'bg-slate-900/90 border border-slate-800/80'
                      }`}
                    >
                      {/* Zid */}
                      {isWall && (
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-700 to-slate-850 flex items-center justify-center opacity-70">
                          <span className="text-slate-500 text-[10px]">■</span>
                        </div>
                      )}

                      {/* Ieșire */}
                      {isExit && !isRobotHere && (
                        <div className="flex flex-col items-center">
                          <Flag className="w-5 h-5 text-emerald-400 animate-bounce" />
                          <span className="text-[8px] text-emerald-300 font-bold uppercase">Ieșire</span>
                        </div>
                      )}

                      {/* Robotul */}
                      {isRobotHere && (
                        <div
                          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 shadow-lg shadow-indigo-500/40 border-2 border-white transition-transform duration-300"
                          style={{
                            transform: `rotate(${DIR_DELTAS[robotDir].angle}deg)`
                          }}
                        >
                          {/* Săgeată orientare */}
                          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-white -mt-1.5" />
                          {/* Ochi sonar */}
                          <div className="absolute -top-1 w-2 h-1 bg-amber-300 rounded-full animate-ping" />
                        </div>
                      )}

                      {/* Traseu parcurs (urmă) */}
                      {!isRobotHere && isVisited && !isWall && !isExit && (
                        <div className="w-2 h-2 rounded-full bg-indigo-400/40" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Comenzi de control */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 w-full">
            <button
              type="button"
              onClick={executeStep}
              disabled={isRunning || isFinished}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <FastForward className="w-4 h-4 text-indigo-400" />
              <span>Pas cu Pas (F7)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isFinished) resetMaze();
                setIsRunning(!isRunning);
                sounds.playClick();
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pauză Autonomă</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{isFinished ? 'Rulează Din Nou' : 'Rulează Automat'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetMaze}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Panou Telemetrie & Logică Decizională */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Card Decizie Curentă */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Evaluare Condiții &amp; Senzori</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Senzor Dreapta (Perete?):</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded ${
                    getCellRight(robotPos, robotDir) === 1
                      ? 'text-rose-400 bg-rose-950/60 border border-rose-900'
                      : 'text-emerald-400 bg-emerald-950/60 border border-emerald-900'
                  }`}
                >
                  {getCellRight(robotPos, robotDir) === 1 ? 'ZID DETECTAT' : 'LIBER (Prioritate)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Senzor Frontal (Înainte?):</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded ${
                    getCellAhead(robotPos, robotDir) === 1
                      ? 'text-rose-400 bg-rose-950/60 border border-rose-900'
                      : 'text-cyan-400 bg-cyan-950/60 border border-cyan-900'
                  }`}
                >
                  {getCellAhead(robotPos, robotDir) === 1 ? 'OBSTACOL (< 20 cm)' : 'CALE LIBERĂ'}
                </span>
              </div>
            </div>

            {/* Pseudocod C++ aplicat */}
            <div className="mt-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
              <div className="text-slate-500">// Algoritmul Wall-Follower (Manual pag. 106)</div>
              <div className="text-indigo-300">if (!senzorDreapta()) &#123;</div>
              <div className="pl-3 text-emerald-300">vireazaDreapta(90); inainte(1);</div>
              <div className="text-indigo-300">&#125; else if (!senzorFata()) &#123;</div>
              <div className="pl-3 text-cyan-300">inainte(1);</div>
              <div className="text-indigo-300">&#125; else &#123;</div>
              <div className="pl-3 text-amber-300">vireazaStanga(90);</div>
              <div className="text-indigo-300">&#125;</div>
            </div>
          </div>

          {/* Jurnal Telemetrie în timp real */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex-1 flex flex-col">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Jurnal Acțiuni Robot (Real-Time Log)</span>
            </h3>

            <div className="space-y-1.5 font-mono text-[11px] overflow-y-auto max-h-48 flex-1 pr-1">
              {logMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border leading-tight ${
                    i === 0
                      ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400'
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Provocare Algoritmică & Verificare */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">
              Provocare de Înțelegere: Algoritmi de Robotică Autonomă
            </h2>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
            Întrebarea {challengeStep + 1} din {QUIZ.length}
          </span>
        </div>

        <p className="text-sm text-slate-300 mb-4 font-medium">{QUIZ[challengeStep].q}</p>

        <div className="space-y-2.5">
          {QUIZ[challengeStep].options.map((opt, idx) => {
            const isSelected = selectedAnswers[challengeStep] === idx;
            const isCorrect = idx === QUIZ[challengeStep].correct;

            let btnStyle =
              'border-slate-800 bg-slate-950/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300';
            if (isCurrentAnswered) {
              if (isSelected && isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-md';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-200';
              } else if (isCorrect) {
                btnStyle = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isCurrentAnswered && isCurrentCorrect}
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                {isCurrentAnswered && isSelected && (
                  <span>
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {challengeFeedback && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
              isCurrentCorrect
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
            }`}
          >
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
            <span>{challengeFeedback}</span>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          {isCurrentCorrect && !completedChallenge && (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <span>Următoarea Întrebare</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {completedChallenge && (
            <button
              type="button"
              onClick={() => {
                sounds.playSuccess();
                onPass(100);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold transition flex items-center gap-2 shadow-xl shadow-emerald-600/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nivelul 5 Finalizat! Mergi la Laboratorul Code::Blocks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
