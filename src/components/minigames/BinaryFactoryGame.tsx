import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  Binary,
  Zap,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Trophy,
  Flame,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';

interface BinaryFactoryGameProps {
  onBack: () => void;
  studentName?: string;
}

// 8-bit weights (Powers of 2: 2^7 down to 2^0)
const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

interface Challenge {
  target: number;
  level: 'easy' | 'medium' | 'hard';
  activeBitsCount: number; // 4 bits for easy, 8 bits for medium/hard
}

export const BinaryFactoryGame: React.FC<BinaryFactoryGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Mode: 4-bits (nibble, 0-15) for Easy, 8-bits (byte, 0-255) for Medium/Advanced
  const [difficulty, setDifficulty] = useState<'easy' | 'byte'>('easy');
  const [round, setRound] = useState<number>(1);
  const totalRounds = 10;

  // Active bits representation: array of boolean [128, 64, 32, 16, 8, 4, 2, 1] or [8, 4, 2, 1]
  const currentWeights = difficulty === 'easy' ? [8, 4, 2, 1] : BIT_WEIGHTS;
  const [bits, setBits] = useState<boolean[]>(new Array(currentWeights.length).fill(false));

  const [targetNumber, setTargetNumber] = useState<number>(5);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showHelper, setShowHelper] = useState<boolean>(false);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_binary_factory') || '0');
    } catch {
      return 0;
    }
  });

  // Calculate current decimal sum from turned-on bits
  const currentSum = bits.reduce((acc, active, idx) => {
    return active ? acc + currentWeights[idx] : acc;
  }, 0);

  // Generate random target number
  const generateNewTarget = (diff: 'easy' | 'byte', currentRound: number) => {
    if (diff === 'easy') {
      // 1 to 15
      const available = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const rand = available[Math.floor(Math.random() * available.length)];
      setTargetNumber(rand);
    } else {
      // Byte mode: 1 to 255
      // Progressive difficulty
      const maxVal = currentRound <= 3 ? 31 : currentRound <= 7 ? 127 : 255;
      const minVal = currentRound <= 3 ? 1 : 16;
      const rand = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      setTargetNumber(rand);
    }
    setBits(new Array(diff === 'easy' ? 4 : 8).fill(false));
  };

  // Init challenge on mount or difficulty change
  useEffect(() => {
    generateNewTarget(difficulty, 1);
  }, [difficulty]);

  const toggleBit = (index: number) => {
    sounds.playClick();
    setBits((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleCheckAnswer = () => {
    if (currentSum === targetNumber) {
      sounds.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const points = (difficulty === 'easy' ? 100 : 200) + Math.min(newCombo * 20, 100);
      setScore((prev) => prev + points);

      arky.triggerSuccess(
        lang === 'en'
          ? `Correct conversion! ${currentSum} in decimal = ${bits.map((b) => (b ? '1' : '0')).join('')} in binary!`
          : `Conversie exactă! ${currentSum} în zecimal = ${bits.map((b) => (b ? '1' : '0')).join('')} în cod binar! ⚡💡`
      );

      if (round < totalRounds) {
        setRound((prev) => prev + 1);
        generateNewTarget(difficulty, round + 1);
      } else {
        setIsCompleted(true);
        sounds.playVictory();
        const finalScore = score + points;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          try {
            localStorage.setItem('arkedo_highscore_binary_factory', String(finalScore));
            updateActiveArcadeScore('binary_factory', finalScore);
          } catch {
            // ignore
          }
        }
        arky.triggerFinished(
          lang === 'en'
            ? `Binary Factory Certified! Final Score: ${finalScore} pts!`
            : `Certificat în Decodare Binară! Scor Final: ${finalScore} puncte! Ai stăpânit biții 0 și 1! 🧠⚡`
        );
      }
    } else {
      sounds.playWrong();
      setCombo(0);
      arky.triggerIdle();
    }
  };

  const resetAllBits = () => {
    sounds.playClick();
    setBits(new Array(currentWeights.length).fill(false));
  };

  const handleRestart = () => {
    sounds.playClick();
    setRound(1);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setIsCompleted(false);
    generateNewTarget(difficulty, 1);
    arky.triggerIdle();
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 select-none">
      {/* Top Header */}
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
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Binary className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'Binary Bit Factory' : 'Decodorul Binar (Fabrica de Biți)'}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-amber-400 font-mono">
              {lang === 'en' ? 'Convert Numbers between Decimal & Binary Switches' : 'Comută Biții 0 și 1 pentru a Obține Numărul Zecimal'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="order-2 sm:order-3 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shrink-0">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{highScore} pts</span>
        </div>
      </div>

      {/* Main Game Screen */}
      {!isCompleted ? (
        <div className="bg-slate-900/95 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-6 relative">
          {/* Top Controls: Difficulty Tabs & Round/Score */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            {/* Difficulty Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  sounds.playClick();
                  setDifficulty('easy');
                  setRound(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  difficulty === 'easy'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? '4 Bits (0 - 15)' : 'Mod Ușor: 4 Biți (0 - 15)'}
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setDifficulty('byte');
                  setRound(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  difficulty === 'byte'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? '8 Bits (1 Byte: 0 - 255)' : 'Mod Avansat: 1 Byte (0 - 255)'}
              </button>
            </div>

            {/* Round, Combo & Score */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300">
                {lang === 'en' ? 'Challenge' : 'Provocarea'} {round} / {totalRounds}
              </span>
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 font-mono">{combo}x</span>
              </div>
              <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-black text-white font-mono">{score} pts</span>
              </div>
            </div>
          </div>

          {/* Central Target Display */}
          <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 sm:p-7 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Target Number */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                {lang === 'en' ? 'Target Decimal Number:' : 'Numărul Zecimal Țintă:'}
              </span>
              <div className="text-4xl sm:text-6xl font-black text-white font-mono mt-1 tracking-tight flex items-baseline gap-2">
                <span>{targetNumber}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-500 font-mono">(baza 10)</span>
              </div>
            </div>

            {/* Live Calculation Meter */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                {lang === 'en' ? 'Current Sum (Your Switches):' : 'Suma Curentă a Becurilor:'}
              </span>
              <div
                className={`text-3xl sm:text-5xl font-black font-mono mt-1 transition-colors ${
                  currentSum === targetNumber
                    ? 'text-emerald-400 scale-105'
                    : currentSum > targetNumber
                    ? 'text-rose-400'
                    : 'text-amber-300'
                }`}
              >
                {currentSum}
                <span className="text-xs sm:text-sm font-bold text-slate-500 font-mono ml-2">
                  {currentSum === targetNumber ? '✅ MATCH!' : currentSum > targetNumber ? '⚠️ PREA MARE' : 'mai adaugă'}
                </span>
              </div>
            </div>
          </div>

          {/* Binary Switches Grid (The Bulbs and Weights) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                {lang === 'en' ? 'Click switches to turn on/off powers of 2:' : 'Apasă pe comutatoare pentru a aprinde/stinge puterile lui 2:'}
              </span>
              <button
                onClick={() => setShowHelper((prev) => !prev)}
                className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer"
              >
                {showHelper ? (lang === 'en' ? 'Hide Help' : 'Ascunde Ajutorul') : (lang === 'en' ? 'How it works? 💡' : 'Cum funcționează? 💡')}
              </button>
            </div>

            {/* Explanation card if toggled */}
            {showHelper && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 animate-fadeIn leading-relaxed">
                <strong className="text-amber-300 block mb-1">
                  {lang === 'en' ? 'Binary Logic Rule:' : 'Regula Codului Binar:'}
                </strong>
                {lang === 'en'
                  ? 'Computers only understand 0 (OFF) and 1 (ON). Each bit from right to left doubles in value: 1, 2, 4, 8, 16, 32, 64, 128. Add together the values of the active (ON) bits to form the decimal target!'
                  : 'Calculatoarele folosesc doar 0 (Stins) și 1 (Aprins). Fiecare bit de la dreapta la stânga își dublează valoarea: 1, 2, 4, 8, 16, 32, 64, 128. Suma puterilor corespunzătoare becurilor aprinse (1) formează numărul zecimal!'}
              </div>
            )}

            {/* The Interactive Bulbs Row */}
            <div className={`grid gap-1.5 sm:gap-3 ${difficulty === 'easy' ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-8'}`}>
              {currentWeights.map((weight, idx) => {
                const isActive = bits[idx];
                return (
                  <button
                    key={weight}
                    onClick={() => toggleBit(idx)}
                    className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-between gap-1.5 sm:gap-3 transition-all transform active:scale-95 cursor-pointer shadow-md sm:shadow-lg ${
                      isActive
                        ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/30 border-amber-400 shadow-amber-500/20 ring-2 ring-amber-400/40'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-500'
                    }`}
                  >
                    {/* Weight Label (Power of 2) */}
                    <div className="flex flex-col items-center">
                      <span className={`text-sm sm:text-xl font-black font-mono ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                        +{weight}
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-mono text-slate-500">2^{currentWeights.length - 1 - idx}</span>
                    </div>

                    {/* Bulb Visual Icon */}
                    <div
                      className={`w-7 h-7 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/50 scale-105 sm:scale-110 animate-pulse'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}
                    >
                      <Lightbulb className={`w-3.5 h-3.5 sm:w-6 sm:h-6 ${isActive ? 'fill-current' : ''}`} />
                    </div>

                    {/* Binary Digit (0 or 1) */}
                    <div
                      className={`px-1.5 sm:px-3 py-0.5 rounded-full font-mono text-[9px] sm:text-xs font-black border ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {isActive ? '1' : '0'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Binary String Representation */}
            <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-slate-400">{lang === 'en' ? 'Binary Result:' : 'Valoare Binară:'}</span>
              <span className="text-xs sm:text-sm font-black text-amber-400 tracking-widest bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                {bits.map((b) => (b ? '1' : '0')).join('')}
                <span className="text-[10px] text-slate-500 ml-1.5">(baza 2)</span>
              </span>
            </div>
          </div>

          {/* Action Row: Reset & Validate */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={resetAllBits}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition border border-slate-700 cursor-pointer active:scale-95 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-1.5 text-slate-400 shrink-0" />
              <span>{lang === 'en' ? 'Clear All Bits' : 'Resetează Biții (0000)'}</span>
            </button>

            <button
              onClick={handleCheckAnswer}
              disabled={currentSum !== targetNumber}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base transition shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                currentSum === targetNumber
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/30 animate-bounce'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{lang === 'en' ? 'Validate Binary ➔' : 'Validează Conversia ➔'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-slate-900/95 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 ring-4 ring-amber-500/20 animate-bounce">
            ⚡
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase tracking-wider">
              {lang === 'en' ? 'Course Complete!' : 'Laborator Binar Completat!'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-2">
              {studentName ? `${studentName}, ` : ''}
              {score >= 1500
                ? (lang === 'en' ? 'Byte Architecture Genius! 🧠⚡' : 'Geniu al Arhitecturii Binare! 🧠⚡')
                : score >= 900
                ? (lang === 'en' ? 'Master of Powers of 2! 💡' : 'Stăpân al Puterilor lui 2! 💡')
                : (lang === 'en' ? 'Binary Apprentice! 🔰' : 'Ucenic Binar Promițător! 🔰')}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-xl w-full">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Scor Total</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1">
                {score}
              </span>
              <span className="text-[11px] text-slate-500">puncte</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Provocări Binar</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                {totalRounds} / {totalRounds}
              </span>
              <span className="text-[11px] text-slate-500">rezolvate cu succes</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Max Combo</span>
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mt-1">
                {maxCombo}x
              </span>
              <span className="text-[11px] text-slate-500">consecutive</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95"
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
  );
};
