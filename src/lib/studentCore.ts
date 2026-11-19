import {
  ArcadeScores,
  LessonMissionState,
  LessonsProgress,
  StudentProfile
} from '../types';
import {
  ALL_ARCADE_SCORE_KEYS,
  ARCADE_REGISTRY,
  computeNormalizedArcadeXP,
  createDefaultArcadeScores
} from '../data/arcadeRegistry';
import { ALL_LESSON_PROGRESS_KEYS, CARNET_MISSIONS } from '../data/missionsRegistry';

export const STUDENTS_COLLECTION = 'elevi';
export const RECORDS_COLLECTION = 'recorduri_jocuri';
export const GLOBAL_RECORDS_DOC = 'arcade_records';
export const LOCAL_PROFILE_KEY = 'arkedo_active_student_profile';
export const LOCAL_RECORDS_CACHE_KEY = 'arkedo_cached_game_records';
export const LOCAL_CLASS_GRADE_KEY = 'arkedo_student_class_grade';
export const LOCAL_DAILY_STREAK_KEY = 'arkedo_daily_streak';
export const LOCAL_DAILY_QUESTS_KEY = 'arkedo_daily_quests';
export const LOCAL_BADGES_KEY = 'arkedo_unlocked_badges';
export const LOCAL_SANDBOX_SOLVED_KEY = 'arkedo_sandbox_solved_ids';
export const LOCAL_SANDBOX_SNIPPETS_KEY = 'arkedo_sandbox_snippets';
export const LOCAL_QUICK_EVAL_HISTORY_KEY = 'arkedo_quick_eval_history';
export const RECORDS_CACHE_TTL_MS = 60000; // 60 seconds TTL

export interface GameRecord {
  gameKey: string;
  bestScore: number;
  holderName: string;
  holderAvatar: string;
}

// Shared quota guard & in-memory records cache accessors
let studentAuthQuotaExhausted = false;
let inMemoryRecordsCache: Record<string, GameRecord> | null = null;
let lastRecordsFetchTimestamp = 0;

export function isQuotaExhausted(): boolean {
  return studentAuthQuotaExhausted;
}

export function markQuotaExhausted(): void {
  studentAuthQuotaExhausted = true;
}

export function getInMemoryRecordsCache(): Record<string, GameRecord> | null {
  return inMemoryRecordsCache;
}

export function setInMemoryRecordsCache(cache: Record<string, GameRecord> | null, timestamp?: number): void {
  inMemoryRecordsCache = cache;
  if (typeof timestamp === 'number') {
    lastRecordsFetchTimestamp = timestamp;
  }
}

export function getLastRecordsFetchTimestamp(): number {
  return lastRecordsFetchTimestamp;
}

export const ARCADE_GAME_KEYS = ALL_ARCADE_SCORE_KEYS;

export const DEFAULT_ARCADE_SCORES: ArcadeScores = createDefaultArcadeScores();

export function createDefaultLessonsProgress(): LessonsProgress {
  const map: Record<string, LessonMissionState | number> = { totalLessonScore: 0 };
  for (const key of ALL_LESSON_PROGRESS_KEYS) {
    map[key] = { completed: false, level: 1, score: 0, elapsedSeconds: 0 };
  }
  return map as unknown as LessonsProgress;
}

export const DEFAULT_LESSONS_PROGRESS: LessonsProgress = createDefaultLessonsProgress();

export function computeTotalArcade(scores: Partial<ArcadeScores>): number {
  return computeNormalizedArcadeXP(scores);
}

// Base score 400 per completed lesson, plus bonus for steady reading time (90s–600s)
export function computeLessonXP(lesson: { completed?: boolean; score?: number; elapsedSeconds?: number }): number {
  if (!lesson || !lesson.completed) {
    return Math.min(lesson?.score || 0, 150);
  }
  const base = Math.max(lesson.score || 0, 400);
  const sec = lesson.elapsedSeconds || 0;

  let timeBonus = 0;
  if (sec >= 90 && sec <= 600) {
    timeBonus = 100;
  } else if (sec > 40 && sec < 90) {
    timeBonus = 50;
  }

  return base + timeBonus;
}

export function computeTotalLessons(lessons: Partial<LessonsProgress>): number {
  let total = 0;
  for (const key of ALL_LESSON_PROGRESS_KEYS) {
    const entry = (lessons as Record<string, LessonMissionState | undefined>)[key];
    total += computeLessonXP(entry || {});
  }
  return total;
}

export function computeTotalXP(arcadeTotal: number, lessonsTotal: number): number {
  return arcadeTotal + lessonsTotal;
}

export function getActiveStudent(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveActiveStudentLocally(profile: StudentProfile | null): void {
  try {
    if (!profile) {
      localStorage.removeItem(LOCAL_PROFILE_KEY);
      localStorage.removeItem('arkedo_student_name');
      localStorage.removeItem('arkedo_student_avatar');
    } else {
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem('arkedo_student_name', profile.username);
      localStorage.setItem('arkedo_student_avatar', profile.avatar || '🎓');
    }
  } catch {
    // Ignore storage quota issues
  }
}

export function logoutStudent(): void {
  saveActiveStudentLocally(null);
  try {
    localStorage.removeItem('arkedo_student_classroom_meta');
  } catch {}
}

export function syncProfileToLocalStorage(profile: StudentProfile): void {
  try {
    localStorage.setItem('arkedo_student_name', profile.username);
    localStorage.setItem('arkedo_student_avatar', profile.avatar || '🎓');

    // Sync all 28 Arcade scores generically from ARCADE_REGISTRY
    if (profile.arcadeScores) {
      const scoresRecord = profile.arcadeScores as unknown as Record<string, number | undefined>;
      for (const game of ARCADE_REGISTRY) {
        const val = scoresRecord[game.scoreKey];
        if (val) {
          localStorage.setItem(game.localStorageKey, String(val));
        }
      }
    }

    // Sync all 44 curriculum missions + legacy graphics1/graphics2 from CARNET_MISSIONS
    if (profile.lessonsProgress) {
      const lpRecord = profile.lessonsProgress as unknown as Record<string, LessonMissionState | undefined>;
      for (const meta of CARNET_MISSIONS) {
        const entry = lpRecord[meta.lessonsKey];
        if (!entry) continue;
        localStorage.setItem(`arkedo_${meta.localPrefix}_level`, String(entry.level || 1));
        localStorage.setItem(`arkedo_${meta.localPrefix}_score`, String(entry.score || 0));
        localStorage.setItem(`arkedo_${meta.localPrefix}_elapsed`, String(entry.elapsedSeconds || 0));
        if (meta.legacyLocalPrefix) {
          localStorage.setItem(`arkedo_${meta.legacyLocalPrefix}_level`, String(entry.level || 1));
          localStorage.setItem(`arkedo_${meta.legacyLocalPrefix}_score`, String(entry.score || 0));
          localStorage.setItem(`arkedo_${meta.legacyLocalPrefix}_elapsed`, String(entry.elapsedSeconds || 0));
        }
        if (entry.completed) {
          localStorage.setItem(`arkedo_completed_${meta.id}`, 'true');
        }
      }

      for (const legacyKey of ['graphics1', 'graphics2'] as const) {
        const entry = lpRecord[legacyKey];
        if (entry) {
          localStorage.setItem(`arkedo_${legacyKey}_level`, String(entry.level || 1));
          localStorage.setItem(`arkedo_${legacyKey}_score`, String(entry.score || 0));
          localStorage.setItem(`arkedo_${legacyKey}_elapsed`, String(entry.elapsedSeconds || 0));
        }
      }
    }

    // Byte-Coins, Inventory, Equipped Items, Diplomas & Carnet sync
    const coins = profile.byteCoins ?? 100;
    localStorage.setItem('arkedo_student_coins', String(coins));
    localStorage.setItem('arkedo_byte_coins', String(coins));
    if (profile.inventory) {
      localStorage.setItem('arkedo_student_inventory', JSON.stringify(profile.inventory));
    }
    if (profile.equipped) {
      localStorage.setItem('arkedo_equipped_items', JSON.stringify(profile.equipped));
    }
    if (profile.diplomas) {
      localStorage.setItem('arkedo_student_diplomas', JSON.stringify(profile.diplomas));
    }
    if (profile.classGrade) {
      localStorage.setItem(LOCAL_CLASS_GRADE_KEY, profile.classGrade);
    }
    if (profile.classId && profile.classCode && profile.className) {
      localStorage.setItem(
        'arkedo_student_classroom_meta',
        JSON.stringify({
          classId: profile.classId,
          classCode: profile.classCode,
          className: profile.className,
          schoolId: profile.schoolId || 'scoala_pilot_01',
          gradeNum: Number((profile.classGrade || '').match(/[5-8]/)?.[0]) || 5,
        })
      );
    }
    if (profile.dailyStreak) {
      localStorage.setItem(LOCAL_DAILY_STREAK_KEY, JSON.stringify(profile.dailyStreak));
    }
    if (profile.dailyQuests) {
      localStorage.setItem(LOCAL_DAILY_QUESTS_KEY, JSON.stringify(profile.dailyQuests));
    }
    if (profile.unlockedBadgeIds) {
      localStorage.setItem(LOCAL_BADGES_KEY, JSON.stringify(profile.unlockedBadgeIds));
    }
    if (profile.sandboxProgress) {
      localStorage.setItem(LOCAL_SANDBOX_SOLVED_KEY, JSON.stringify(profile.sandboxProgress.solvedIds || []));
      localStorage.setItem(LOCAL_SANDBOX_SNIPPETS_KEY, JSON.stringify(profile.sandboxProgress.snippets || {}));
    }
    if (profile.quickEvalHistory) {
      localStorage.setItem(LOCAL_QUICK_EVAL_HISTORY_KEY, JSON.stringify(profile.quickEvalHistory));
    }
  } catch (err) {
    console.warn('Sync localstorage:', err);
  }
}

export function getTodayDateString(): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Bucharest',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    if (y && m && d) return `${y}-${m}-${d}`;
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

export function getPreviousDateString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

export function getLocalClassGrade(): string {
  const active = getActiveStudent();
  if (active?.classGrade) return active.classGrade;
  try {
    return localStorage.getItem(LOCAL_CLASS_GRADE_KEY) || '';
  } catch {
    return '';
  }
}
