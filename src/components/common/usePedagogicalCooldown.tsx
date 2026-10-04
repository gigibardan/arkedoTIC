import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';

export interface UsePedagogicalCooldownOptions {
  cooldownSeconds?: number;
  maxXP?: number;
  onCooldownEnd?: () => void;
}

export interface UsePedagogicalCooldownReturn {
  cooldown: number;
  isLocked: boolean;
  attempts: number;
  isResolved: boolean;
  earnedXP: number;
  startCooldown: (customSecs?: number) => void;
  resetCooldown: () => void;
  handleWrongAnswer: () => void;
  handleCorrectAnswer: () => number;
  recordAttempt: () => number;
  calculateXP: (attemptsCount?: number) => number;
  resetAll: () => void;
}

/**
 * Standard Pedagogical Hook to prevent speed spam-clicking in lessons
 * Enforces a 5-second reflection timer buffer upon incorrect attempts
 * Calculates degraded XP for multiple tries (1st try = 100%, 2nd = 60%, 3rd+ = 30%)
 */
export function usePedagogicalCooldown({
  cooldownSeconds = 5,
  maxXP = 100,
  onCooldownEnd,
}: UsePedagogicalCooldownOptions = {}): UsePedagogicalCooldownReturn {
  const [cooldown, setCooldown] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const calculateXP = (attemptsCount?: number): number => {
    const att = attemptsCount ?? attempts;
    if (att <= 1) return maxXP;
    if (att === 2) return Math.round(maxXP * 0.6);
    return Math.round(maxXP * 0.3);
  };

  const startCooldown = (customSecs?: number) => {
    const secs = customSecs ?? cooldownSeconds;
    if (timerRef.current) clearInterval(timerRef.current);
    setCooldown(secs);

    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onCooldownEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetCooldown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCooldown(0);
  };

  const handleWrongAnswer = () => {
    sounds.playWrong();
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    startCooldown(cooldownSeconds);
  };

  const handleCorrectAnswer = (): number => {
    sounds.playCorrect();
    const nextAttempts = attempts === 0 ? 1 : attempts;
    setAttempts(nextAttempts);
    setIsResolved(true);
    resetCooldown();
    return calculateXP(nextAttempts);
  };

  const recordAttempt = (): number => {
    const next = attempts + 1;
    setAttempts(next);
    return next;
  };

  const resetAll = () => {
    resetCooldown();
    setAttempts(0);
    setIsResolved(false);
  };

  const earnedXP = isResolved ? calculateXP(attempts) : 0;

  return {
    cooldown,
    isLocked: cooldown > 0,
    attempts,
    isResolved,
    earnedXP,
    startCooldown,
    resetCooldown,
    handleWrongAnswer,
    handleCorrectAnswer,
    recordAttempt,
    calculateXP,
    resetAll,
  };
}

export interface PedagogicalReflectionBannerProps {
  cooldown: number;
  totalSeconds?: number;
  customMessageRo?: string;
  customMessageEn?: string;
  className?: string;
}

/**
 * Visual countdown bar and educational notice during wrong answer lockout
 */
export const PedagogicalReflectionBanner: React.FC<PedagogicalReflectionBannerProps> = ({
  cooldown,
  totalSeconds = 5,
  customMessageRo,
  customMessageEn,
  className = '',
}) => {
  const { lang } = useLanguage();

  if (cooldown <= 0) return null;

  return (
    <div
      className={`p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 shadow-lg shadow-rose-950/40 flex flex-col gap-2.5 animate-fadeIn ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
          <Clock className="w-4 h-4 text-rose-400 animate-spin" />
          <span>
            {lang === 'en'
              ? `Reflection Buffer: Retry available in ${cooldown}s`
              : `Timp de reflecție: Reîncercare disponibilă în ${cooldown} secunde`}
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-black border border-rose-500/40 shrink-0">
          ⏳ {cooldown}s
        </span>
      </div>

      <div className="flex items-start gap-2 text-[11px] sm:text-xs text-rose-200/90 leading-tight">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          {customMessageRo && customMessageEn
            ? lang === 'en'
              ? customMessageEn
              : customMessageRo
            : lang === 'en'
            ? 'Please take 5 seconds to read the explanation below before picking another answer!'
            : 'Te rugăm să acorzi 5 secunde pentru a citi explicația de mai jos înainte de a alege alt răspuns!'}
        </p>
      </div>

      {/* Progress animation bar */}
      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 transition-all duration-1000 ease-linear"
          style={{ width: `${Math.min(100, Math.max(0, (cooldown / totalSeconds) * 100))}%` }}
        />
      </div>
    </div>
  );
};
