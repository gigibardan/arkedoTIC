import { doc, updateDoc } from 'firebase/firestore';
import { db, isCloudConnected } from './firebase';
import {
  DailyQuestState,
  DailyStreakInfo,
  QuickEvalAttempt,
  SandboxProgress,
  SandboxSnippet,
  StudentProfile
} from '../types';
import {
  getActiveStudent,
  getLocalClassGrade,
  getPreviousDateString,
  getTodayDateString,
  isQuotaExhausted,
  LOCAL_BADGES_KEY,
  LOCAL_CLASS_GRADE_KEY,
  LOCAL_DAILY_QUESTS_KEY,
  LOCAL_DAILY_STREAK_KEY,
  LOCAL_QUICK_EVAL_HISTORY_KEY,
  LOCAL_SANDBOX_SNIPPETS_KEY,
  LOCAL_SANDBOX_SOLVED_KEY,
  saveActiveStudentLocally,
  STUDENTS_COLLECTION
} from './studentCore';

export { getLocalClassGrade };

let lastStreakSyncDate = '';

export async function updateStudentClassGrade(classGrade: string): Promise<boolean> {
  const clean = classGrade.trim();
  try {
    if (clean) {
      localStorage.setItem(LOCAL_CLASS_GRADE_KEY, clean);
    } else {
      localStorage.removeItem(LOCAL_CLASS_GRADE_KEY);
    }
  } catch {}

  const current = getActiveStudent();
  if (current) {
    const updated: StudentProfile = {
      ...current,
      classGrade: clean,
      carnetUpdatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updated);

    if (isCloudConnected && db && current.id && !isQuotaExhausted()) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          classGrade: clean,
          carnetUpdatedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        });
        return true;
      } catch (err) {
        console.warn('Eroare actualizare clasa in Firestore:', err);
        return false;
      }
    }
  }
  return true;
}

export function getStoredDailyStreak(): DailyStreakInfo {
  const current = getActiveStudent();
  if (current?.dailyStreak) {
    return current.dailyStreak;
  }
  try {
    const raw = localStorage.getItem(LOCAL_DAILY_STREAK_KEY);
    if (raw) return JSON.parse(raw) as DailyStreakInfo;
  } catch {}
  return { current: 0, best: 0, lastActiveDate: '', activeDays: [] };
}

export function getStoredDailyQuests(): DailyQuestState {
  const today = getTodayDateString();
  const current = getActiveStudent();
  if (current?.dailyQuests && current.dailyQuests.date === today) {
    return current.dailyQuests;
  }
  try {
    const raw = localStorage.getItem(LOCAL_DAILY_QUESTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyQuestState;
      if (parsed.date === today) return parsed;
    }
  } catch {}
  return {
    date: today,
    claimedIds: [],
    completedLessonToday: false,
    playedArcadeToday: false,
    visitedCarnetToday: false
  };
}

export function markDailyQuestFlag(
  flag: 'completedLessonToday' | 'playedArcadeToday' | 'visitedCarnetToday'
): DailyQuestState {
  const today = getTodayDateString();
  const existing = getStoredDailyQuests();
  const next: DailyQuestState =
    existing.date === today
      ? { ...existing, [flag]: true }
      : {
          date: today,
          claimedIds: [],
          completedLessonToday: flag === 'completedLessonToday',
          playedArcadeToday: flag === 'playedArcadeToday',
          visitedCarnetToday: flag === 'visitedCarnetToday'
        };

  try {
    localStorage.setItem(LOCAL_DAILY_QUESTS_KEY, JSON.stringify(next));
  } catch {}

  const current = getActiveStudent();
  if (current) {
    saveActiveStudentLocally({
      ...current,
      dailyQuests: next
    });
  }
  return next;
}

export async function recordDailyActivityAndStreak(options?: {
  markCarnetVisited?: boolean;
}): Promise<{ streak: DailyStreakInfo; quests: DailyQuestState; isNewDay: boolean }> {
  const today = getTodayDateString();
  const yesterday = getPreviousDateString(today);

  const prevStreak = getStoredDailyStreak();
  const isNewDay = prevStreak.lastActiveDate !== today;

  let nextStreak: DailyStreakInfo = prevStreak;
  if (isNewDay) {
    const nextCurrent = prevStreak.lastActiveDate === yesterday ? prevStreak.current + 1 : 1;
    const nextBest = Math.max(prevStreak.best || 0, nextCurrent);
    const activeDaysSet = new Set([...(prevStreak.activeDays || []), today]);
    const activeDays = Array.from(activeDaysSet).sort().slice(-30);
    nextStreak = {
      current: nextCurrent,
      best: nextBest,
      lastActiveDate: today,
      activeDays
    };
    try {
      localStorage.setItem(LOCAL_DAILY_STREAK_KEY, JSON.stringify(nextStreak));
    } catch {}
  }

  let nextQuests = getStoredDailyQuests();
  if (options?.markCarnetVisited && !nextQuests.visitedCarnetToday) {
    nextQuests = markDailyQuestFlag('visitedCarnetToday');
  } else {
    try {
      localStorage.setItem(LOCAL_DAILY_QUESTS_KEY, JSON.stringify(nextQuests));
    } catch {}
  }

  const current = getActiveStudent();
  if (current) {
    const updated: StudentProfile = {
      ...current,
      dailyStreak: nextStreak,
      dailyQuests: nextQuests,
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updated);

    if ((isNewDay || lastStreakSyncDate !== today) && isCloudConnected && db && current.id && !isQuotaExhausted()) {
      lastStreakSyncDate = today;
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          dailyStreak: nextStreak,
          dailyQuests: nextQuests,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare sincronizare streak Firestore:', err);
      }
    }
  }

  return { streak: nextStreak, quests: nextQuests, isNewDay };
}

export async function claimDailyQuestReward(
  questId: string,
  rewardCoins: number
): Promise<{ success: boolean; newCoins: number; quests: DailyQuestState }> {
  const today = getTodayDateString();
  const currentQuests = getStoredDailyQuests();
  const normalizedQuests: DailyQuestState =
    currentQuests.date === today
      ? currentQuests
      : { date: today, claimedIds: [] };

  const storedCoins = Number(
    localStorage.getItem('arkedo_student_coins') ??
      localStorage.getItem('arkedo_byte_coins') ??
      getActiveStudent()?.byteCoins ??
      0
  );

  if (normalizedQuests.claimedIds.includes(questId)) {
    return {
      success: false,
      newCoins: storedCoins,
      quests: normalizedQuests
    };
  }

  const updatedQuests: DailyQuestState = {
    ...normalizedQuests,
    claimedIds: [...normalizedQuests.claimedIds, questId]
  };

  try {
    localStorage.setItem(LOCAL_DAILY_QUESTS_KEY, JSON.stringify(updatedQuests));
  } catch {}

  const current = getActiveStudent();
  const prevCoins = current?.byteCoins ?? storedCoins;
  const newCoins = prevCoins + rewardCoins;

  try {
    localStorage.setItem('arkedo_byte_coins', String(newCoins));
    localStorage.setItem('arkedo_student_coins', String(newCoins));
  } catch {}

  if (current) {
    const updatedProfile: StudentProfile = {
      ...current,
      byteCoins: newCoins,
      dailyQuests: updatedQuests,
      carnetUpdatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updatedProfile);

    if (isCloudConnected && db && current.id && !isQuotaExhausted()) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          byteCoins: newCoins,
          dailyQuests: updatedQuests,
          carnetUpdatedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare salvare daily quest in Firestore:', err);
      }
    }
  }

  return { success: true, newCoins, quests: updatedQuests };
}

export async function syncStudentBadges(badgeIds: string[]): Promise<void> {
  const uniqueIds = Array.from(new Set(badgeIds));
  try {
    localStorage.setItem(LOCAL_BADGES_KEY, JSON.stringify(uniqueIds));
  } catch {}

  const current = getActiveStudent();
  if (!current) return;

  const prevSet = new Set(current.unlockedBadgeIds || []);
  const hasNew = uniqueIds.some((id) => !prevSet.has(id));
  if (!hasNew && (current.unlockedBadgeIds?.length || 0) === uniqueIds.length) return;

  const merged = Array.from(new Set([...(current.unlockedBadgeIds || []), ...uniqueIds]));
  saveActiveStudentLocally({
    ...current,
    unlockedBadgeIds: merged,
    carnetUpdatedAt: new Date().toISOString()
  });

  if (isCloudConnected && db && current.id && !isQuotaExhausted()) {
    try {
      await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
        unlockedBadgeIds: merged,
        carnetUpdatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Eroare sincronizare insigne Firestore:', err);
    }
  }
}

export function getStoredSandboxProgress(): SandboxProgress {
  let localSolved: string[] = [];
  let localSnippets: Record<string, SandboxSnippet> = {};
  try {
    const rawIds = localStorage.getItem(LOCAL_SANDBOX_SOLVED_KEY);
    if (rawIds) {
      const parsed = JSON.parse(rawIds);
      if (Array.isArray(parsed)) localSolved = parsed.filter((x): x is string => typeof x === 'string');
    }
    const rawSnip = localStorage.getItem(LOCAL_SANDBOX_SNIPPETS_KEY);
    if (rawSnip) {
      const parsed = JSON.parse(rawSnip);
      if (parsed && typeof parsed === 'object') localSnippets = parsed;
    }
  } catch {}

  const current = getActiveStudent();
  const solvedIds = Array.from(
    new Set([...localSolved, ...(current?.sandboxProgress?.solvedIds || [])])
  );
  const snippets: Record<string, SandboxSnippet> = {
    ...localSnippets,
    ...(current?.sandboxProgress?.snippets || {})
  };
  return {
    solvedIds,
    snippets,
    updatedAt: current?.sandboxProgress?.updatedAt
  };
}

export async function saveSandboxChallengeSolved(challengeId: string): Promise<string[]> {
  const prev = getStoredSandboxProgress();
  const nextSolved = Array.from(new Set([...prev.solvedIds, challengeId]));

  try {
    localStorage.setItem(LOCAL_SANDBOX_SOLVED_KEY, JSON.stringify(nextSolved));
  } catch {}

  const nextProgress: SandboxProgress = {
    solvedIds: nextSolved,
    snippets: prev.snippets,
    updatedAt: new Date().toISOString()
  };

  const current = getActiveStudent();
  if (current) {
    saveActiveStudentLocally({
      ...current,
      sandboxProgress: nextProgress,
      lastActiveAt: new Date().toISOString()
    });

    if (isCloudConnected && db && current.id && !isQuotaExhausted()) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          sandboxProgress: nextProgress,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare salvare Sandbox solved in Firestore:', err);
      }
    }
  }

  return nextSolved;
}

export async function saveSandboxSnippet(
  workspaceKey: string,
  code: string,
  css?: string,
  stdin?: string,
  syncCloud: boolean = true
): Promise<SandboxProgress> {
  const prev = getStoredSandboxProgress();
  const nextSnippet: SandboxSnippet = {
    code,
    ...(css !== undefined ? { css } : {}),
    ...(stdin !== undefined ? { stdin } : {}),
    updatedAt: new Date().toISOString()
  };

  const nextSnippets: Record<string, SandboxSnippet> = {
    ...prev.snippets,
    [workspaceKey]: nextSnippet
  };

  try {
    localStorage.setItem(LOCAL_SANDBOX_SNIPPETS_KEY, JSON.stringify(nextSnippets));
  } catch {}

  const nextProgress: SandboxProgress = {
    solvedIds: prev.solvedIds,
    snippets: nextSnippets,
    updatedAt: new Date().toISOString()
  };

  const current = getActiveStudent();
  if (current) {
    saveActiveStudentLocally({
      ...current,
      sandboxProgress: nextProgress,
      lastActiveAt: new Date().toISOString()
    });

    if (syncCloud && isCloudConnected && db && current.id && !isQuotaExhausted()) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          sandboxProgress: nextProgress,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare salvare snippet Sandbox in Firestore:', err);
      }
    }
  }

  return nextProgress;
}

export function getStoredQuickEvalHistory(): QuickEvalAttempt[] {
  let localList: QuickEvalAttempt[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_QUICK_EVAL_HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) localList = parsed;
    }
  } catch {}

  const current = getActiveStudent();
  const map = new Map<string, QuickEvalAttempt>();
  for (const item of [...localList, ...(current?.quickEvalHistory || [])]) {
    if (item && item.id) map.set(item.id, item);
  }
  return Array.from(map.values())
    .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
    .slice(0, 40);
}

export async function saveQuickEvalAttempt(attempt: QuickEvalAttempt): Promise<QuickEvalAttempt[]> {
  const existing = getStoredQuickEvalHistory();
  const nextHistory = [attempt, ...existing.filter((x) => x.id !== attempt.id)].slice(0, 40);

  try {
    localStorage.setItem(LOCAL_QUICK_EVAL_HISTORY_KEY, JSON.stringify(nextHistory));
  } catch {}

  markDailyQuestFlag('completedLessonToday');

  const current = getActiveStudent();
  if (current) {
    const earnedXP = Math.round(attempt.score * 0.5);
    const nextXP = (current.totalXP || 0) + earnedXP;
    saveActiveStudentLocally({
      ...current,
      quickEvalHistory: nextHistory,
      totalXP: nextXP,
      lastActiveAt: new Date().toISOString()
    });

    if (isCloudConnected && db && current.id && !isQuotaExhausted()) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          quickEvalHistory: nextHistory,
          totalXP: nextXP,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare salvare QuickEval in Firestore:', err);
      }
    }
  }

  return nextHistory;
}
