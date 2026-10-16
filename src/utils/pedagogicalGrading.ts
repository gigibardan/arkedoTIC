import { useState, useEffect, useRef } from 'react';

export interface GradeDetails {
  percentage: number;
  grade: number;
  calificativRo: string;
  calificativEn: string;
  badgeRo: string;
  badgeEn: string;
}

/**
 * Computes official Romanian educational grades (Note de la 1 la 10 și calificative)
 * based on the student's real earned score.
 */
export function computeGradeDetails(score: number, maxScore: number = 100): GradeDetails {
  const safeMax = maxScore > 0 ? maxScore : 100;
  const percentage = Math.max(0, Math.min(100, Math.round((score / safeMax) * 100)));

  if (percentage >= 95) {
    return {
      percentage,
      grade: 10,
      calificativRo: 'Nota 10 • Calificativ Excelent (FB)',
      calificativEn: 'Grade 10 • Excellent (A+)',
      badgeRo: 'Excelent (FB)',
      badgeEn: 'Excellent (A+)',
    };
  }
  if (percentage >= 85) {
    return {
      percentage,
      grade: 9,
      calificativRo: 'Nota 9 • Calificativ Foarte Bine',
      calificativEn: 'Grade 9 • Very Good (A)',
      badgeRo: 'Foarte Bine',
      badgeEn: 'Very Good',
    };
  }
  if (percentage >= 75) {
    return {
      percentage,
      grade: 8,
      calificativRo: 'Nota 8 • Calificativ Bine',
      calificativEn: 'Grade 8 • Good (B)',
      badgeRo: 'Bine',
      badgeEn: 'Good',
    };
  }
  if (percentage >= 65) {
    return {
      percentage,
      grade: 7,
      calificativRo: 'Nota 7 • Calificativ Bine',
      calificativEn: 'Grade 7 • Satisfactory (C)',
      badgeRo: 'Bine',
      badgeEn: 'Satisfactory',
    };
  }
  if (percentage >= 50) {
    return {
      percentage,
      grade: 6,
      calificativRo: 'Nota 6 • Calificativ Suficient',
      calificativEn: 'Grade 6 • Pass (D)',
      badgeRo: 'Suficient',
      badgeEn: 'Pass',
    };
  }
  if (percentage >= 40) {
    return {
      percentage,
      grade: 5,
      calificativRo: 'Nota 5 • Calificativ Suficient',
      calificativEn: 'Grade 5 • Pass (E)',
      badgeRo: 'Suficient',
      badgeEn: 'Pass',
    };
  }
  return {
    percentage,
    grade: Math.max(1, Math.round((percentage / 40) * 4)),
    calificativRo: 'Nota 4 • Reevaluare Necesară',
    calificativEn: 'Grade 4 • Needs Improvement',
    badgeRo: 'Reevaluare',
    badgeEn: 'Needs Improvement',
  };
}

/**
 * Reusable pedagogical cooldown hook for question sets.
 * Starts a 5-second countdown on wrong answers that ticks down every second:
 * 5s -> 4s -> 3s -> 2s -> 1s -> 0s.
 * Unlocks automatically upon reaching 0s.
 */
export function useQuestionCooldowns(defaultCooldownSeconds = 5) {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const triggerCooldown = (questionKey: string, customSeconds?: number) => {
    const secs = customSeconds ?? defaultCooldownSeconds;
    setCooldowns((prev) => ({ ...prev, [questionKey]: secs }));

    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setCooldowns((prev) => {
          let hasRemaining = false;
          const next: Record<string, number> = {};
          for (const [key, val] of Object.entries(prev)) {
            const numVal = Number(val);
            if (numVal > 1) {
              next[key] = numVal - 1;
              hasRemaining = true;
            } else {
              next[key] = 0;
            }
          }
          if (!hasRemaining) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
          }
          return next;
        });
      }, 1000);
    }
  };

  const isLocked = (questionKey: string) => {
    return (cooldowns[questionKey] || 0) > 0;
  };

  const resetCooldown = (questionKey: string) => {
    setCooldowns((prev) => ({ ...prev, [questionKey]: 0 }));
  };

  return {
    cooldowns,
    setCooldowns,
    triggerCooldown,
    isLocked,
    resetCooldown,
  };
}

export { PedagogicalReflectionBanner } from '../components/common/usePedagogicalCooldown';
