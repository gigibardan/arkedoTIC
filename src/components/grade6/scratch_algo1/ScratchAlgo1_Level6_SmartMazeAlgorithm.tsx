import React, { useState, useEffect } from 'react';
import {
  Compass,
  Play,
  RotateCcw,
  Flag,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Zap,
  Code,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

// 6x6 Maze Grid representation: 0 = Path, 1 = Wall, 2 = Goal
const MAZE_GRID = [
  [0, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 1],
  [1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 2] // Goal at (5, 5)
];

// Pre-calculated navigation path for the simulated loop
const SOLVED_PATH = [
  { r: 0, c: 0 },
  { r: 1, c: 0 },
  { r: 1, c: 1 },
  { r: 1, c: 2 },
  { r: 2, c: 2 },
  { r: 3, c: 2 },
  { r: 3, c: 3 },
  { r: 3, c: 4 },
  { r: 4, c: 4 },
  { r: 4, c: 5 },
  { r: 5, c: 5 } // Goal
];

export const ScratchAlgo1_Level6_SmartMazeAlgorithm: React.FC<Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Coding Blocks Builder State
  const [hasLoopBlock, setHasLoopBlock] = useState<boolean>(false);
  const [hasMoveBlock, setHasMoveBlock] = useState<boolean>(false);
  const [hasWallCondition, setHasWallCondition] = useState<boolean>(false);

  // Simulation execution state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasReachedGoal, setHasReachedGoal] = useState<boolean>(false);
  const [stepLogs, setStepLogs] = useState<string[]>([]);

  // 5s Cooldown Quiz
  const [qMaze, setQMaze] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleQMaze = (val: string) => {
    if (isLocked('qMaze') || qMaze === 'flag') return;
    setQMaze(val);
    if (val === 'flag') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qMaze', 5);
    }
  };

  const isScriptComplete = hasLoopBlock && hasMoveBlock && hasWallCondition;

  const runMazeAlgorithm = () => {
    if (isRunning || !isScriptComplete) return;
    setIsRunning(true);
    setCurrentStepIndex(0);
    setHasReachedGoal(false);
    sounds.playClick();

    let step = 0;
    const logs: string[] = ['▶️ Algoritm pornit: [repetă până când <atinge Steag Verde>]'];
    setStepLogs([...logs]);

    const interval = setInterval(() => {
      step++;
      if (step < SOLVED_PATH.length) {
        setCurrentStepIndex(step);
        sounds.playPop();
        const curPos = SOLVED_PATH[step];
        logs.push(`Pas ${step}: Deplasare la poziția (${curPos.r}, ${curPos.c})`);
        setStepLogs([...logs]);

        if (step === SOLVED_PATH.length - 1) {
          // Reached the goal!
          clearInterval(interval);
          setIsRunning(false);
          setHasReachedGoal(true);
          sounds.playFanfare();
          logs.push('⛳ Condiție îndeplinită: Atinge Steag Verde! Buclă oprită cu succes!');
          setStepLogs([...logs]);
        }
      }
    }, 280);
  };

  const resetMaze = () => {
    setCurrentStepIndex(0);
    setIsRunning(false);
    setHasReachedGoal(false);
    setStepLogs([]);
    sounds.playClick();
  };

  const currentCoords = SOLVED_PATH[currentStepIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-950/40 to-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                {isEn ? 'Grade 6 • Unit 4A • Level 6 of 7' : 'Clasa a VI-a • Unitatea 4A • Nivelul 6 din 7'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Manual pag. 74–75</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <Compass className="w-8 h-8 text-purple-400" />
              <span>{isEn ? 'The Autonomous Maze Runner Algorithm' : 'Algoritmul Autonom: Evadarea din Labirint'}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Combine conditional loops, obstacle sensing, and automated path-finding to guide Arky to the Green Flag!'
                : 'Asamblează bucla condiționată completă, senzorul de perete și ghidajul autonom pentru a-l conduce pe Arky la Steagul Verde!'}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-purple-400/80">REWARD</span>
            <span className="text-xl font-black text-purple-300 font-mono">+15 XP</span>
          </div>
        </div>
      </div>

      {/* Main Lab Arena */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block Construction Sandbox */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">
              {isEn ? 'Assemble the Scratch Script' : '1. Asamblează Scriptul Scratch'}
            </h3>
          </div>

          <p className="text-xs text-slate-300">
            {isEn
              ? 'Click each necessary block to build the autonomous runner script:'
              : 'Dă clic pe fiecare bloc obligatoriu pentru a construi algoritmul corect:'}
          </p>

          <div className="space-y-2.5">
            {/* Block 1 */}
            <button
              onClick={() => {
                setHasLoopBlock(!hasLoopBlock);
                sounds.playPop();
              }}
              className={`w-full p-3.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                hasLoopBlock
                  ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <span>repetă până când &lt;atinge [Steag Verde]&gt;</span>
              {hasLoopBlock ? <CheckCircle2 className="w-4 h-4 text-amber-400" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
            </button>

            {/* Block 2 */}
            <button
              onClick={() => {
                setHasMoveBlock(!hasMoveBlock);
                sounds.playPop();
              }}
              className={`w-full p-3.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                hasMoveBlock
                  ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <span className="ml-4">mergi 10 pași</span>
              {hasMoveBlock ? <CheckCircle2 className="w-4 h-4 text-indigo-400" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
            </button>

            {/* Block 3 */}
            <button
              onClick={() => {
                setHasWallCondition(!hasWallCondition);
                sounds.playPop();
              }}
              className={`w-full p-3.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                hasWallCondition
                  ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="ml-4 space-y-1">
                <div>dacă &lt;atinge [Perete]&gt; atunci:</div>
                <div className="ml-4 text-cyan-400">mergi -10 pași & rotește 90 grade</div>
              </div>
              {hasWallCondition ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
            </button>
          </div>

          {/* Action Trigger */}
          <div className="pt-3">
            <button
              onClick={runMazeAlgorithm}
              disabled={!isScriptComplete || isRunning}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {isRunning
                  ? 'Algoritmul rulează în buclă...'
                  : hasReachedGoal
                  ? 'Algoritm finalizat cu succes! 🎉'
                  : 'Rulează Algoritmul în Labirint'}
              </span>
            </button>
          </div>
        </div>

        {/* 2D Maze Visual Arena */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Harta Labirintului 2D
              </span>
              <button
                onClick={resetMaze}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* The 6x6 Maze Grid */}
            <div className="grid grid-cols-6 gap-1 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 max-w-[280px] mx-auto">
              {MAZE_GRID.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const isPlayerHere = currentCoords.r === rIdx && currentCoords.c === cIdx;
                  const isWall = cell === 1;
                  const isGoal = cell === 2;

                  let cellStyle = 'bg-slate-900 border-slate-800';
                  if (isWall) cellStyle = 'bg-slate-800 border-slate-700';
                  if (isGoal) cellStyle = 'bg-emerald-950/80 border-emerald-500/60';

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`h-10 rounded-lg border flex items-center justify-center relative transition duration-150 ${cellStyle}`}
                    >
                      {isPlayerHere ? (
                        <div className="text-xl animate-bounce">🤖</div>
                      ) : isGoal ? (
                        <div className="text-lg">⛳</div>
                      ) : isWall ? (
                        <div className="w-3 h-3 rounded bg-slate-700/60" />
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Live Step Logs */}
          <div className="mt-4 bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-24 overflow-y-auto space-y-1">
            {stepLogs.length > 0 ? (
              stepLogs.map((l, i) => <div key={i}>{l}</div>)
            ) : (
              <span className="text-slate-500 italic">
                Selectează blocurile și apasă „Rulează Algoritmul” pentru a vedea execuția autonomă.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conceptual Question with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? 'What stop condition keeps the autonomous maze algorithm safely running until arrival?'
                : 'Ce condiție de oprire este verificată continuu de buclă pentru a garanta sosirea autonomă?'}
            </h3>
          </div>
          <QuestionHint
            hint={
              isEn
                ? 'The loop checks whether Arky has made contact with the Green Flag (atinge [Steag Verde])!'
                : 'Gândește-te la senzorul de atingere a țintei finale: atinge [Steag Verde]!'
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { id: 'flag', label: 'atinge [Steag Verde]', isCorrect: true },
            { id: 'space', label: 'tasta [spațiu] este apăsată', isCorrect: false },
            { id: 'timer', label: 'cronometrul atinge 100 de secunde', isCorrect: false }
          ].map((opt) => {
            const isSelected = qMaze === opt.id;
            let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
            if (qMaze) {
              if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
              else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
            }

            return (
              <button
                key={opt.id}
                disabled={isLocked('qMaze') || qMaze === 'flag'}
                onClick={() => handleQMaze(opt.id)}
                className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
              >
                <span className="font-mono">{opt.label}</span>
                {qMaze && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {qMaze && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {cooldowns.qMaze && cooldowns.qMaze > 0 ? (
          <PedagogicalReflectionBanner
            cooldown={cooldowns.qMaze}
            totalSeconds={5}
            customMessageRo="Timp de reflecție: Bucla 'repetă până când' evaluează atingerea Steagului Verde la fiecare iterație!"
            customMessageEn="Reflection buffer: The 'repeat until' loop evaluates touching the Green Flag on each iteration!"
          />
        ) : null}

        {qMaze && (
          <AnswerExplanation
            isCorrect={qMaze === 'flag'}
            explanation={
              isEn
                ? 'Correct! The condition <atinge [Steag Verde]> halts the repeat-until loop precisely upon arrival at the destination.'
                : 'Corect! Condiția <atinge [Steag Verde]> oprește bucla „repetă până când” exact în momentul în care robotul ajunge la destinația finală!'
            }
          />
        )}
      </div>

      <QuestionHint
        hint={
          isEn
            ? 'The Repeat Until block ensures Arky keeps moving and turning until the destination flag is touched.'
            : 'Blocul „repetă până când” este motorul algoritmului: Arky avansează și se rotește la fiecare coliziune până când atinge steagul verde!'
        }
      />

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={hasReachedGoal && qMaze === 'flag'}
        onNext={() => onCompletePage(15)}
        nextLabel={isEn ? 'Level 7: Exam & Official Diploma' : 'Nivelul 7: Examenul de Brevet & Marea Diplomă'}
      />
    </div>
  );
};
