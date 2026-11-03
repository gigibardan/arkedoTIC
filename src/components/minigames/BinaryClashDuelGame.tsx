import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Binary,
  Zap,
  Flame,
  Swords,
  Trophy,
  RotateCcw,
  Sparkles,
  Bot,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';

interface BinaryChallenge {
  targetDec: number;
  hintRo: string;
  hintEn: string;
}

const TARGET_CHALLENGES: BinaryChallenge[] = [
  { targetDec: 5, hintRo: '4 + 1', hintEn: '4 + 1' },
  { targetDec: 13, hintRo: '8 + 4 + 1', hintEn: '8 + 4 + 1' },
  { targetDec: 42, hintRo: '32 + 8 + 2', hintEn: '32 + 8 + 2' },
  { targetDec: 77, hintRo: '64 + 8 + 4 + 1', hintEn: '64 + 8 + 4 + 1' },
  { targetDec: 105, hintRo: '64 + 32 + 8 + 1', hintEn: '64 + 32 + 8 + 1' },
  { targetDec: 170, hintRo: '128 + 32 + 8 + 2 (Model alternativ 10101010)', hintEn: '128 + 32 + 8 + 2 (Alternating 10101010)' },
  { targetDec: 219, hintRo: '128 + 64 + 16 + 8 + 2 + 1', hintEn: '128 + 64 + 16 + 8 + 2 + 1' },
  { targetDec: 255, hintRo: 'Toți cei 8 biți activi (11111111)', hintEn: 'All 8 bits active (11111111)' },
];

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1] as const;

interface BinaryClashDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, isWinner: boolean) => void;
  onBack?: () => void;
}

export const BinaryClashDuelGame: React.FC<BinaryClashDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Campion TIC',
  studentAvatar = '⚡',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();

  // 8-bit switch state: boolean array representing bits 128 -> 1
  const [bits, setBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hasFinishedLocal, setHasFinishedLocal] = useState(false);
  const [matchedAnimation, setMatchedAnimation] = useState(false);
  const [powerUpCooldown, setPowerUpCooldown] = useState<Record<string, number>>({});

  // Practice Bot opponent state (used if roomData is null)
  const [botProgress, setBotProgress] = useState(0);
  const [botScore, setBotScore] = useState(0);

  const currentChallenge = TARGET_CHALLENGES[challengeIndex % TARGET_CHALLENGES.length];
  const currentSum = bits.reduce((acc, bit, idx) => acc + (bit ? BIT_VALUES[idx] : 0), 0);
  const progressPercent = Math.min(100, Math.round((challengeIndex / TARGET_CHALLENGES.length) * 100));

  // Determine me and opponent
  const me: DuelPlayer | null = isHost ? roomData?.host || null : (roomData?.guest || null);
  const opponent: DuelPlayer | null = isHost ? roomData?.guest || null : (roomData?.host || null);

  const opponentProgress = roomData ? (opponent?.progress || 0) : botProgress;
  const opponentScore = roomData ? (opponent?.score || 0) : botScore;
  const opponentName = roomData ? (opponent?.name || (lang === 'en' ? 'Opponent' : 'Oponent')) : (lang === 'en' ? 'Cadet Bot 🤖' : 'Robot Antrenament 🤖');

  // Handle Toggle Bit
  const toggleBit = useCallback((idx: number) => {
    if (hasFinishedLocal) return;
    sounds.playClick();
    setBits((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, [hasFinishedLocal]);

  // Check sum vs target
  useEffect(() => {
    if (hasFinishedLocal) return;

    if (currentSum === currentChallenge.targetDec) {
      sounds.playCorrect();
      setMatchedAnimation(true);
      const points = 100 + streak * 25;
      const nextScore = score + points;
      const nextIndex = challengeIndex + 1;
      const nextStreak = streak + 1;

      setScore(nextScore);
      setStreak(nextStreak);

      // Check win condition
      if (nextIndex >= TARGET_CHALLENGES.length) {
        setHasFinishedLocal(true);
        sounds.playFanfare();

        if (roomData?.roomCode) {
          updateDuelProgress(
            roomData.roomCode,
            isHost,
            { progress: 100, score: nextScore, finishedAt: Date.now() },
            isHost ? roomData.host.id : roomData.guest?.id,
            isHost ? roomData.host.name : (roomData.guest?.name || 'Elev')
          );
        }

        recordStudentDuelResult(true, 'binary_clash', nextScore);
        onFinish?.(nextScore, true);
      } else {
        // Sync progress
        const newProg = Math.round((nextIndex / TARGET_CHALLENGES.length) * 100);
        if (roomData?.roomCode) {
          updateDuelProgress(
            roomData.roomCode,
            isHost,
            { progress: newProg, score: nextScore, currentStageIndex: nextIndex }
          );
        }

        setTimeout(() => {
          setBits([false, false, false, false, false, false, false, false]);
          setChallengeIndex(nextIndex);
          setMatchedAnimation(false);
        }, 400);
      }
    }
  }, [currentSum, currentChallenge, challengeIndex, streak, score, hasFinishedLocal, roomData, isHost, onFinish]);

  // Bot simulation if playing solo
  useEffect(() => {
    if (roomData || hasFinishedLocal) return;

    const botInterval = setInterval(() => {
      setBotProgress((prev) => {
        if (prev >= 100) {
          clearInterval(botInterval);
          return 100;
        }
        const delta = Math.floor(Math.random() * 8) + 6;
        const next = Math.min(100, prev + delta);
        setBotScore((s) => s + 85);
        if (next >= 100 && !hasFinishedLocal) {
          setHasFinishedLocal(true);
          sounds.playWrong();
          onFinish?.(score, false);
        }
        return next;
      });
    }, 3200);

    return () => clearInterval(botInterval);
  }, [roomData, hasFinishedLocal, score, onFinish]);

  // Power-up: NOT Gate (Invert all bits)
  const handleInvertAll = () => {
    if (powerUpCooldown.invert && Date.now() < powerUpCooldown.invert) return;
    sounds.playPowerup();
    setBits((prev) => prev.map((b) => !b));
    setPowerUpCooldown((prev) => ({ ...prev, invert: Date.now() + 5000 }));
  };

  // Power-up: Clear Byte
  const handleClearAll = () => {
    sounds.playClick();
    setBits([false, false, false, false, false, false, false, false]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none font-sans">
      {/* Top Match HUD Bar */}
      <div className="bg-slate-900/95 border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Player 1 (Me) */}
          <div className="sm:col-span-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg ring-2 ring-cyan-400/40 shrink-0">
              {studentAvatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-black text-white text-sm truncate">{studentName} (Tu)</span>
                <span className="font-mono text-xs font-bold text-cyan-300">{score} XP</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {lang === 'en' ? `Byte ${challengeIndex + 1} of ${TARGET_CHALLENGES.length}` : `Octet ${challengeIndex + 1} din ${TARGET_CHALLENGES.length}`}
              </span>
            </div>
          </div>

          {/* Versus Center Badge */}
          <div className="sm:col-span-2 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-black text-xs shadow-inner">
              VS
            </div>
            {streak > 1 && (
              <span className="text-[11px] font-black text-amber-400 flex items-center gap-1 mt-1 animate-bounce font-mono">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {streak}x Combo!
              </span>
            )}
          </div>

          {/* Player 2 (Opponent) */}
          <div className="sm:col-span-5 flex items-center gap-3">
            <div className="min-w-0 flex-1 text-right">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-xs font-bold text-rose-300">{opponentScore} XP</span>
                <span className="font-black text-white text-sm truncate">{opponentName}</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                <div
                  className="h-full bg-gradient-to-l from-rose-500 to-amber-400 transition-all duration-300 rounded-full float-right"
                  style={{ width: `${opponentProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {opponentProgress}% finalizat
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg ring-2 ring-rose-400/40 shrink-0">
              {roomData?.guest ? roomData.guest.avatar : '🤖'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Binary Control Deck */}
      <div className={`bg-slate-900/90 border-2 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
        matchedAnimation ? 'border-emerald-400 shadow-emerald-500/30 scale-[1.01]' : 'border-slate-800'
      }`}>
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Target Decimal Display */}
        <div className="text-center mb-8 relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            {lang === 'en' ? 'Target Decimal Value' : 'Număr Țintă de Format în Binar'}
          </span>
          <div className="flex items-center justify-center gap-3 my-2">
            <span className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-200 font-mono tracking-tight">
              {currentChallenge.targetDec}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono border border-slate-700">
              (Baza 10)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            💡 {lang === 'en' ? 'Hint:' : 'Indiciu matematic:'} <span className="font-mono text-cyan-300 font-bold">{lang === 'en' ? currentChallenge.hintEn : currentChallenge.hintRo}</span>
          </p>
        </div>

        {/* 8-Bit Interactive Switch Board */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3 mb-6 relative z-10">
          {BIT_VALUES.map((val, idx) => {
            const isActive = bits[idx];
            return (
              <button
                key={val}
                type="button"
                onClick={() => toggleBit(idx)}
                className={`flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer active:scale-95 shadow-lg ${
                  isActive
                    ? 'bg-gradient-to-b from-emerald-500/30 to-emerald-950/80 border-emerald-400 text-emerald-200 shadow-emerald-500/20 ring-2 ring-emerald-400/20'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Weight value (2^n) */}
                <span className="text-[11px] sm:text-xs font-mono font-bold opacity-75">
                  +{val}
                </span>

                {/* State: 1 or 0 */}
                <span className={`text-2xl sm:text-3xl font-black my-1 font-mono ${
                  isActive ? 'text-emerald-300 scale-110 animate-pulse' : 'text-slate-600'
                }`}>
                  {isActive ? '1' : '0'}
                </span>

                {/* Switch indicator bulb */}
                <div className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  isActive
                    ? 'bg-emerald-400 border-white shadow-md shadow-emerald-400'
                    : 'bg-slate-800 border-slate-700'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Current Sum Realtime Calculation */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                {lang === 'en' ? 'Current Sum:' : 'Suma Biților Activi:'}
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black font-mono ${
                  currentSum === currentChallenge.targetDec
                    ? 'text-emerald-400'
                    : currentSum > currentChallenge.targetDec
                    ? 'text-rose-400'
                    : 'text-amber-300'
                }`}>
                  {currentSum}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  / {currentChallenge.targetDec}
                </span>
                {currentSum > currentChallenge.targetDec && (
                  <span className="text-[10px] text-rose-400 font-bold">
                    ({lang === 'en' ? 'Too high!' : 'Prea mare!'})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Special Tactical Quick Boosters */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInvertAll}
              disabled={Boolean(powerUpCooldown.invert && Date.now() < powerUpCooldown.invert)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Poarta NOT: Inversează toți biții (0 devine 1, 1 devine 0)"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'en' ? 'NOT (Invert)' : 'NOT (Inversează)'}</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Resetează toți biții la 0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'en' ? 'Clear' : 'Șterge Tot'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Win Banner / Completion Overlay */}
      {hasFinishedLocal && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border-2 border-emerald-500/60 rounded-3xl p-6 text-center shadow-2xl">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce" />
          <h3 className="text-xl font-black text-white font-heading">
            {lang === 'en' ? 'Binary Duel Completed!' : 'Cursa Biților a Fost Câștigată! 🚀'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {lang === 'en'
              ? `You mastered binary conversions with a final score of ${score} XP!`
              : `Ai convertit toți octeții cu succes și ai obținut ${score} XP!`}
          </p>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              {lang === 'en' ? 'Return to Lobby' : 'Înapoi în Arenă'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
