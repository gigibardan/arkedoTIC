import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  MousePointer,
  RotateCcw,
  Trophy,
  Flame,
  Zap,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Folder,
  Trash2,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface MouseAgilityGameProps {
  onBack: () => void;
  studentName?: string;
}

type TargetType = 'click' | 'double_click' | 'right_click' | 'drag';

interface TargetItem {
  id: number;
  type: TargetType;
  x: number; // percentage 5% to 85%
  y: number; // percentage 10% to 80%
  labelRo: string;
  labelEn: string;
  icon: string;
  spawnTime: number;
  clicksCount?: number;
  lastClickTime?: number;
}

export const MouseAgilityGame: React.FC<MouseAgilityGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [hitsCount, setHitsCount] = useState<number>(0);
  const [missesCount, setMissesCount] = useState<number>(0);

  // Targets currently on arena
  const [currentTarget, setCurrentTarget] = useState<TargetItem | null>(null);

  // Drag item position if in drag mode
  const [dragState, setDragState] = useState<{ isDragging: boolean; x: number; y: number } | null>(null);
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_mouse') || '0');
    } catch {
      return 0;
    }
  });

  const arenaRef = useRef<HTMLDivElement>(null);

  // Spawn next target
  const spawnTarget = () => {
    const types: TargetType[] = ['click', 'double_click', 'right_click', 'drag'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    const posX = Math.floor(Math.random() * 70) + 10;
    const posY = Math.floor(Math.random() * 65) + 15;

    let labelRo = 'Click Stânga!';
    let labelEn = 'Left Click!';
    let icon = '🖱️';

    if (chosenType === 'double_click') {
      labelRo = 'Dublu-Click Rapid!';
      labelEn = 'Quick Double Click!';
      icon = '⚡⚡';
    } else if (chosenType === 'right_click') {
      labelRo = 'Click Dreapta!';
      labelEn = 'Right Click!';
      icon = '🖱️👆';
    } else if (chosenType === 'drag') {
      labelRo = 'Trage fișierul în Folder!';
      labelEn = 'Drag file into Folder!';
      icon = '📁📄';
    }

    const newTarget: TargetItem = {
      id: Date.now(),
      type: chosenType,
      x: posX,
      y: posY,
      labelRo,
      labelEn,
      icon,
      spawnTime: Date.now(),
      clicksCount: 0,
      lastClickTime: 0,
    };

    setCurrentTarget(newTarget);
    setDragState(null);
    setIsFileSelected(false);
  };

  const startGame = () => {
    sounds.playClick();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitsCount(0);
    setMissesCount(0);
    setTimeLeft(45);
    setGameState('playing');
    arky.triggerIdle();
    spawnTarget();
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('finished');
      sounds.playVictory();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // High score check at game end
  useEffect(() => {
    if (gameState === 'finished') {
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem('arkedo_highscore_mouse', String(score));
        } catch {
          // Ignore
        }
      }
      updateActiveArcadeScore('mouse', score);

      if (score >= 1200) {
        arky.triggerSuccess(
          lang === 'en'
            ? `Spectacular! ${score} points! True Mouse Master! 🖱️⚡`
            : `Spectaculos! ${score} puncte! Ești un adevărat Maestru al Mouse-ului! 🖱️⚡`
        );
      } else {
        arky.triggerSuccess(
          lang === 'en'
            ? `Good reflexes! You hit ${hitsCount} targets with precision! 🎯`
            : `Reflexe excelente! Ai nimerit ${hitsCount} ținte cu precizie! 🎯`
        );
      }
    }
  }, [gameState]);

  // Handle Target Clicks
  const handleTargetLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTarget || gameState !== 'playing') return;

    if (currentTarget.type === 'click') {
      // Normal single click target
      sounds.playClick();
      registerSuccess(100);
    } else if (currentTarget.type === 'double_click') {
      // Check double click timing
      const now = Date.now();
      const last = currentTarget.lastClickTime || 0;
      if (now - last < 450) {
        // Successful double click!
        sounds.playCorrect();
        registerSuccess(200);
      } else {
        sounds.playClick();
        setCurrentTarget({
          ...currentTarget,
          lastClickTime: now,
          clicksCount: 1,
        });
      }
    } else if (currentTarget.type === 'right_click') {
      // Wrong click type! They did left click instead of right click
      sounds.playWrong();
      registerMiss();
    }
  };

  const handleTargetRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent browser context menu
    e.stopPropagation();
    if (!currentTarget || gameState !== 'playing') return;

    if (currentTarget.type === 'right_click') {
      sounds.playCorrect();
      registerSuccess(150);
    } else {
      sounds.playWrong();
      registerMiss();
    }
  };

  // Drag & Drop Handling
  const handleDragStart = (e: React.DragEvent) => {
    if (!currentTarget || currentTarget.type !== 'drag') return;
    e.dataTransfer.setData('text/plain', 'source_file');
    sounds.playClick();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnFolder = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentTarget?.type === 'drag') {
      sounds.playCorrect();
      registerSuccess(250);
    }
  };

  // Arena miss click (clicked empty space)
  const handleArenaClick = (e: React.MouseEvent) => {
    if (gameState !== 'playing') return;
    sounds.playWrong();
    registerMiss();
  };

  const registerSuccess = (basePts: number) => {
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    const bonus = Math.min(newCombo * 10, 100);
    setScore((prev) => prev + basePts + bonus);
    setHitsCount((prev) => prev + 1);

    spawnTarget();
  };

  const registerMiss = () => {
    setCombo(0);
    setMissesCount((prev) => prev + 1);
  };

  const accuracy =
    hitsCount + missesCount > 0
      ? Math.round((hitsCount / (hitsCount + missesCount)) * 100)
      : 100;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 select-none">
      {/* Top Header / Back Navigation */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-xl">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="order-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Arcade' : 'Înapoi'}</span>
        </button>

        <div className="order-3 sm:order-2 w-full sm:w-auto flex items-center gap-2 text-left sm:text-center justify-start sm:justify-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
            <MousePointer className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'Mouse Agility & Precision' : 'Maestrul Mouse-ului & Reflexe'}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-mono">
              {lang === 'en' ? 'Master Left, Right, Double-Click and Drag & Drop' : 'Click Stânga, Dreapta, Dublu-Click și Glisare'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="order-2 sm:order-3 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shrink-0">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{highScore} pts</span>
        </div>
      </div>

      {/* Main Arena Container */}
      <div className="bg-slate-900/95 border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-5">
        {/* Ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Scor</div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{score}</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Combo</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {combo} <span className="text-xs text-amber-500">🔥</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Precizie</div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{accuracy}%</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Timp Rămas</div>
              <div className={`text-xl sm:text-2xl font-black font-mono ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Ready State */}
        {gameState === 'ready' && (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-5 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/20 animate-bounce">
              🖱️
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                {lang === 'en' ? 'Train Your Mouse Reflexes' : 'Antrenează-ți Reflexele cu Mouse-ul'}
              </h2>
              <p className="text-slate-300 text-sm max-w-md mt-2 leading-relaxed">
                {lang === 'en'
                  ? 'Follow the prompt on each appearing target: Click, Double-Click, Right-Click, or Drag into the folder!'
                  : 'Fii atent la instrucțiunea de pe fiecare țintă: Click Simplu, Dublu-Click Rapid, Click Dreapta sau Glisează în dosar!'}
              </p>
            </div>

            {/* Quick Tutorial Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl w-full text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center">
                <span className="text-xl mb-1">🖱️</span>
                <span className="font-bold text-slate-200">Click Stânga</span>
                <span className="text-[10px] text-slate-400">Selectează</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center">
                <span className="text-xl mb-1">⚡⚡</span>
                <span className="font-bold text-slate-200">Dublu-Click</span>
                <span className="text-[10px] text-slate-400">Deschide</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center">
                <span className="text-xl mb-1">🖱️👆</span>
                <span className="font-bold text-slate-200">Click Dreapta</span>
                <span className="text-[10px] text-slate-400">Meniu Context</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center">
                <span className="text-xl mb-1">📁📄</span>
                <span className="font-bold text-slate-200">Drag & Drop</span>
                <span className="text-[10px] text-slate-400">Mută fișiere</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{lang === 'en' ? 'START CHALLENGE (45s)' : 'START PROVOCARE (45s)'}</span>
            </button>
          </div>
        )}

        {/* Playing State: Desktop Arena */}
        {gameState === 'playing' && (
          <div
            ref={arenaRef}
            onClick={handleArenaClick}
            onContextMenu={(e) => e.preventDefault()} // Disable default context menu in the entire arena
            className="w-full h-[340px] sm:h-[420px] bg-slate-950/90 border-2 border-slate-800 rounded-2xl relative overflow-hidden cursor-crosshair shadow-inner"
          >
            {/* Grid Lines Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 pointer-events-none"></div>

            {/* Target rendering */}
            {currentTarget && (
              <>
                {currentTarget.type === 'drag' ? (
                  /* Drag and Drop special interaction with touch tap-to-select fallback */
                  <>
                    {/* Draggable File Source */}
                    <div
                      draggable
                      onDragStart={handleDragStart}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFileSelected(true);
                        sounds.playClick();
                      }}
                      className={`absolute z-20 cursor-grab active:cursor-grabbing p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 border-2 shadow-xl flex flex-col items-center justify-center text-center text-white transition-all hover:scale-110 active:scale-95 ${
                        isFileSelected
                          ? 'border-amber-400 ring-4 ring-amber-400/50 scale-105 animate-pulse shadow-amber-500/40'
                          : 'border-cyan-300 animate-pulse'
                      }`}
                      style={{
                        left: `${currentTarget.x}%`,
                        top: `${currentTarget.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-200" />
                      <span className="text-[10px] sm:text-[11px] font-bold mt-1 max-w-[90px] sm:max-w-[100px] truncate">
                        Document.docx
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-mono bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 mt-0.5">
                        {isFileSelected
                          ? (lang === 'en' ? 'Tap folder ➔' : 'Atinge folderul ➔')
                          : (lang === 'en' ? 'Drag / Tap' : 'Trage / Atinge')}
                      </span>
                    </div>

                    {/* Target Folder Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDropOnFolder}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFileSelected || currentTarget?.type === 'drag') {
                          sounds.playCorrect();
                          registerSuccess(250);
                          setIsFileSelected(false);
                        }
                      }}
                      className={`absolute z-10 p-3 sm:p-4 rounded-3xl bg-amber-500/20 border-2 border-dashed shadow-2xl flex flex-col items-center justify-center text-amber-300 text-center cursor-pointer transition-all ${
                        isFileSelected
                          ? 'border-amber-300 bg-amber-500/30 scale-110 animate-bounce ring-4 ring-amber-400/40'
                          : 'border-amber-400 animate-bounce'
                      }`}
                      style={{
                        right: '10%',
                        bottom: '12%',
                      }}
                    >
                      <Folder className="w-9 h-9 sm:w-12 sm:h-12 text-amber-400 fill-amber-400/40" />
                      <span className="text-[10px] sm:text-xs font-bold mt-1">Dosar TIC 📁</span>
                      <span className="text-[9px] sm:text-[10px] text-amber-200 font-mono">
                        {isFileSelected
                          ? (lang === 'en' ? 'Tap to Drop!' : 'Atinge pt plasare!')
                          : (lang === 'en' ? 'Drop here!' : 'Plasează aici!')}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Click / Double-Click / Right-Click Target */
                  <div
                    onClick={handleTargetLeftClick}
                    onContextMenu={handleTargetRightClick}
                    className={`absolute z-20 p-2.5 sm:p-4 rounded-2xl border-2 shadow-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                      currentTarget.type === 'double_click'
                        ? 'bg-gradient-to-br from-amber-600 to-orange-700 border-amber-300 text-white'
                        : currentTarget.type === 'right_click'
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-300 text-white'
                        : 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-300 text-white'
                    }`}
                    style={{
                      left: `${currentTarget.x}%`,
                      top: `${currentTarget.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="text-xl sm:text-3xl drop-shadow">{currentTarget.icon}</div>
                    <div className="text-[11px] sm:text-sm font-black mt-1 uppercase tracking-wide">
                      {lang === 'en' ? currentTarget.labelEn : currentTarget.labelRo}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-mono opacity-90 mt-0.5">
                      {currentTarget.type === 'double_click' &&
                        (currentTarget.clicksCount === 1 ? 'Încă 1 click rapid! ⚡' : '2 x Click!')}
                      {currentTarget.type === 'right_click' && (lang === 'en' ? 'Right Click' : 'Click Dreapta')}
                      {currentTarget.type === 'click' && (lang === 'en' ? 'Left Click' : 'Click Stânga')}
                    </div>
                    {currentTarget.type === 'right_click' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playCorrect();
                          registerSuccess(150);
                        }}
                        className="mt-1 px-2 py-0.5 rounded-lg bg-purple-900/90 hover:bg-purple-800 text-[9px] font-mono font-bold text-white border border-purple-300 shadow-md active:scale-90"
                      >
                        {lang === 'en' ? 'Right-Click 🖱️' : 'Click Dreapta 🖱️'}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* In-arena Helper Tip */}
            <div className="absolute bottom-2 left-3 text-[11px] font-mono text-slate-500 pointer-events-none">
              💡 {lang === 'en' ? 'Do not click on empty space to avoid misses!' : 'Nu apăsa pe spațiul gol ca să nu pierzi acuratețea!'}
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/20">
              🏆
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                {lang === 'en' ? 'Challenge Complete!' : 'Provocare Finalizată!'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-2">
                {studentName ? `${studentName}, ` : ''}
                {score >= 1200
                  ? (lang === 'en' ? 'Master of the Mouse! 🖱️⚡' : 'Maestru al Mouse-ului! 🖱️⚡')
                  : score >= 700
                  ? (lang === 'en' ? 'Sharpshooter Cadet! 🎯' : 'Cadet cu Țintă Precisă! 🎯')
                  : (lang === 'en' ? 'Good Start! Keep Practicing! 👏' : 'Start Bun! Continuă antrenamentul! 👏')}
              </h2>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl w-full">
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Scor Final</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                  {score}
                </span>
                <span className="text-[11px] text-slate-500">puncte</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Ținte Atinse</span>
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mt-1">
                  {hitsCount}
                </span>
                <span className="text-[11px] text-slate-500">comenzi reușite</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Acuratețe</span>
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1">
                  {accuracy}%
                </span>
                <span className="text-[11px] text-slate-500">{missesCount} ratări</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Max Combo</span>
                <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono mt-1">
                  {maxCombo}
                </span>
                <span className="text-[11px] text-slate-500">la rând fără greșeală</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'en' ? 'Play Again' : 'Joacă din Nou'}</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onBack();
                }}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm transition border border-slate-700 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
