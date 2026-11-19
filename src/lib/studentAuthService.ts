import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db, isCloudConnected } from './firebase';
import {
  ArcadeScores,
  DailyQuestState,
  DailyStreakInfo,
  EquippedItems,
  LessonMissionState,
  LessonsProgress,
  QuickEvalAttempt,
  SandboxSnippet,
  ShopCategory,
  ShopItem,
  StudentDiploma,
  StudentInventory,
  StudentProfile
} from '../types';
import { DEFAULT_EQUIPPED, DEFAULT_INVENTORY } from './shopCatalog';
import { ARCADE_REGISTRY } from '../data/arcadeRegistry';
import { CARNET_MISSIONS } from '../data/missionsRegistry';
import {
  ARCADE_GAME_KEYS,
  computeLessonXP,
  computeTotalArcade,
  computeTotalLessons,
  computeTotalXP,
  DEFAULT_ARCADE_SCORES,
  DEFAULT_LESSONS_PROGRESS,
  GameRecord,
  getActiveStudent,
  getInMemoryRecordsCache,
  getLocalClassGrade,
  getTodayDateString,
  GLOBAL_RECORDS_DOC,
  isQuotaExhausted,
  LOCAL_CLASS_GRADE_KEY,
  LOCAL_QUICK_EVAL_HISTORY_KEY,
  LOCAL_RECORDS_CACHE_KEY,
  LOCAL_SANDBOX_SNIPPETS_KEY,
  LOCAL_SANDBOX_SOLVED_KEY,
  logoutStudent,
  markQuotaExhausted,
  RECORDS_COLLECTION,
  saveActiveStudentLocally,
  STUDENTS_COLLECTION,
  syncProfileToLocalStorage
} from './studentCore';
import { markDailyQuestFlag } from './studentGamificationService';

export type {
  StudentProfile,
  StudentDiploma,
  ArcadeScores,
  LessonsProgress,
  ShopCategory,
  ShopItem,
  StudentInventory,
  EquippedItems,
  DailyStreakInfo,
  DailyQuestState,
  QuickEvalAttempt,
  GameRecord
};

export type { SandboxProgress, SandboxSnippet } from '../types';

export {
  ARCADE_GAME_KEYS,
  DEFAULT_ARCADE_SCORES,
  DEFAULT_LESSONS_PROGRESS,
  computeTotalArcade,
  computeLessonXP,
  computeTotalLessons,
  computeTotalXP,
  getActiveStudent,
  saveActiveStudentLocally,
  syncProfileToLocalStorage,
  logoutStudent,
  getLocalClassGrade
};

export {
  getByteCoins,
  addByteCoins,
  getStudentInventory,
  getEquippedItems,
  buyShopItem,
  equipShopItem,
  openMysteryChest,
  awardTeacherCoins
} from './studentEconomyService';

export {
  updateStudentClassGrade,
  getStoredDailyStreak,
  getStoredDailyQuests,
  markDailyQuestFlag,
  recordDailyActivityAndStreak,
  claimDailyQuestReward,
  syncStudentBadges,
  getStoredSandboxProgress,
  saveSandboxChallengeSolved,
  saveSandboxSnippet,
  getStoredQuickEvalHistory,
  saveQuickEvalAttempt
} from './studentGamificationService';

export {
  getAllStudents,
  getGameAllTimeRecords,
  deleteStudentAccount,
  updateStudentFullProfileByTeacher,
  updateStudentScoresByTeacher,
  resetStudentArcadeScores,
  resetStudentLessonProgress,
  applyCheatingPenalty,
  awardTeacherBonusXP,
  recalculateStudentXP
} from './studentTeacherAdminService';

// Simple yet reliable SHA-256 hash in browser
export async function hashPassword(plainText: string): Promise<string> {
  const trimmed = plainText.trim();
  if (!window.crypto?.subtle) {
    let hash = 0;
    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `simple_${Math.abs(hash)}`;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(trimmed);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// REGISTER NEW STUDENT (collects all 28 Arcade games + all 44 Curriculum missions from localStorage)
export async function registerStudent(
  username: string,
  passwordPlain: string,
  avatar: string = '🎓',
  schoolId: string = 'scoala_pilot_01'
): Promise<{ success: boolean; profile?: StudentProfile; error?: string }> {
  const cleanUsername = username.trim();
  if (cleanUsername.length < 2) {
    return { success: false, error: 'Numele trebuie să aibă cel puțin 2 caractere!' };
  }
  if (passwordPlain.trim().length < 3) {
    return { success: false, error: 'Parola trebuie să aibă cel puțin 3 caractere!' };
  }

  const usernameLower = cleanUsername.toLowerCase();
  const passwordHash = await hashPassword(passwordPlain);

  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION));
      const snap = await getDocs(q);
      const exists = snap.docs.some((d) => d.data().usernameLower === usernameLower);
      if (exists) {
        return {
          success: false,
          error: `Numele "${cleanUsername}" este deja folosit. Alege alt nume sau conectează-te!`
        };
      }
    } catch (err) {
      console.warn('Eroare verificare username Firestore:', err);
    }
  }

  const currentArcadeScores: ArcadeScores = { ...DEFAULT_ARCADE_SCORES };
  const arcadeRecord = currentArcadeScores as unknown as Record<string, number>;
  for (const game of ARCADE_REGISTRY) {
    try {
      arcadeRecord[game.scoreKey] = Number(localStorage.getItem(game.localStorageKey) || '0') || 0;
    } catch {
      arcadeRecord[game.scoreKey] = 0;
    }
  }
  currentArcadeScores.totalArcade = computeTotalArcade(currentArcadeScores);

  const currentLessons: LessonsProgress = { ...DEFAULT_LESSONS_PROGRESS };
  const lpRecord = currentLessons as unknown as Record<string, LessonMissionState>;
  for (const meta of CARNET_MISSIONS) {
    try {
      const rawLevel =
        localStorage.getItem(`arkedo_${meta.localPrefix}_level`) ??
        (meta.legacyLocalPrefix ? localStorage.getItem(`arkedo_${meta.legacyLocalPrefix}_level`) : null);
      const rawScore =
        localStorage.getItem(`arkedo_${meta.localPrefix}_score`) ??
        (meta.legacyLocalPrefix ? localStorage.getItem(`arkedo_${meta.legacyLocalPrefix}_score`) : null);
      const rawElapsed =
        localStorage.getItem(`arkedo_${meta.localPrefix}_elapsed`) ??
        (meta.legacyLocalPrefix ? localStorage.getItem(`arkedo_${meta.legacyLocalPrefix}_elapsed`) : null);
      const level = Number(rawLevel || '1') || 1;
      const score = Number(rawScore || '0') || 0;
      const elapsedSeconds = Number(rawElapsed || '0') || 0;
      const completedFlag = localStorage.getItem(`arkedo_completed_${meta.id}`) === 'true';
      lpRecord[meta.lessonsKey] = {
        completed: completedFlag || level > meta.maxLevels,
        level,
        score,
        elapsedSeconds
      };
    } catch {}
  }

  for (const legacyKey of ['graphics1', 'graphics2'] as const) {
    try {
      const level = Number(localStorage.getItem(`arkedo_${legacyKey}_level`) || '1') || 1;
      const score = Number(localStorage.getItem(`arkedo_${legacyKey}_score`) || '0') || 0;
      const elapsedSeconds = Number(localStorage.getItem(`arkedo_${legacyKey}_elapsed`) || '0') || 0;
      lpRecord[legacyKey] = {
        completed: level >= 7,
        level,
        score,
        elapsedSeconds
      };
    } catch {}
  }
  currentLessons.totalLessonScore = computeTotalLessons(currentLessons);

  const totalXP = computeTotalXP(currentArcadeScores.totalArcade, currentLessons.totalLessonScore);
  const docId = `elev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newProfile: StudentProfile = {
    id: docId,
    username: cleanUsername,
    usernameLower,
    passwordHash,
    avatar,
    schoolId: schoolId || 'scoala_pilot_01',
    arcadeScores: currentArcadeScores,
    lessonsProgress: currentLessons,
    byteCoins: 100,
    inventory: DEFAULT_INVENTORY,
    equipped: DEFAULT_EQUIPPED,
    totalXP,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  };

  if (isCloudConnected && db) {
    try {
      await setDoc(doc(db, STUDENTS_COLLECTION, docId), {
        ...newProfile,
        serverTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('Salvare Firestore la înregistrare:', err);
    }
  }

  saveActiveStudentLocally(newProfile);
  return { success: true, profile: newProfile };
}

// LOGIN STUDENT
export async function loginStudent(
  username: string,
  passwordPlain: string
): Promise<{ success: boolean; profile?: StudentProfile; error?: string }> {
  const cleanUsername = username.trim();
  const usernameLower = cleanUsername.toLowerCase();
  const passwordHash = await hashPassword(passwordPlain);

  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION));
      const snap = await getDocs(q);
      const studentDoc = snap.docs.find((d) => {
        const data = d.data();
        return data.usernameLower === usernameLower || data.username?.toLowerCase() === usernameLower;
      });

      if (!studentDoc) {
        return {
          success: false,
          error: `Nu am găsit niciun cont cu numele "${cleanUsername}". Verifică scrierea sau înregistrează-te!`
        };
      }

      const data = studentDoc.data() as StudentProfile;
      if (data.passwordHash !== passwordHash) {
        return {
          success: false,
          error: 'Parolă incorectă! Dacă ai uitat-o, roagă profesorul să o reseteze din panoul admin.'
        };
      }

      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, studentDoc.id), {
          lastActiveAt: new Date().toISOString()
        });
      } catch {}

      const fullProfile: StudentProfile = {
        ...data,
        id: studentDoc.id,
        schoolId: data.schoolId || 'scoala_pilot_01'
      };

      syncProfileToLocalStorage(fullProfile);
      saveActiveStudentLocally(fullProfile);

      return { success: true, profile: fullProfile };
    } catch (err) {
      console.warn('Eroare login Firestore:', err);
    }
  }

  const currentLocal = getActiveStudent();
  if (currentLocal && currentLocal.usernameLower === usernameLower) {
    if (currentLocal.passwordHash === passwordHash) {
      return { success: true, profile: currentLocal };
    }
    return { success: false, error: 'Parolă incorectă!' };
  }

  return { success: false, error: 'Nu s-a putut realiza autentificarea. Verifică conexiunea la internet!' };
}

// Debounced Arcade score writes to protect Spark free tier quota
const pendingScoreWrites = new Map<string, ReturnType<typeof setTimeout>>();

export async function updateStudentArcadeScore(
  gameKey: keyof Omit<ArcadeScores, 'totalArcade'>,
  newScore: number
): Promise<void> {
  const current = getActiveStudent();
  if (!current) return;

  const currentBest = current.arcadeScores?.[gameKey] || 0;
  if (newScore <= currentBest) return;

  const updatedArcade: ArcadeScores = {
    ...DEFAULT_ARCADE_SCORES,
    ...current.arcadeScores,
    [gameKey]: newScore
  };
  updatedArcade.totalArcade = computeTotalArcade(updatedArcade);

  const lessonsTotal = current.lessonsProgress?.totalLessonScore || 0;
  const totalXP = computeTotalXP(updatedArcade.totalArcade, lessonsTotal);

  const updatedProfile: StudentProfile = {
    ...current,
    arcadeScores: updatedArcade,
    totalXP,
    lastActiveAt: new Date().toISOString()
  };

  saveActiveStudentLocally(updatedProfile);
  markDailyQuestFlag('playedArcadeToday');

  if (isCloudConnected && db && current.id && !isQuotaExhausted()) {
    const studentId = current.id;
    const writeKey = `${studentId}_${gameKey}`;

    if (pendingScoreWrites.has(writeKey)) {
      clearTimeout(pendingScoreWrites.get(writeKey));
    }

    const timer = setTimeout(async () => {
      pendingScoreWrites.delete(writeKey);
      if (isQuotaExhausted() || !db) return;

      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, studentId), {
          [`arcadeScores.${gameKey}`]: newScore,
          'arcadeScores.totalArcade': updatedArcade.totalArcade,
          totalXP,
          lastActiveAt: new Date().toISOString()
        });

        const recordsCache = getInMemoryRecordsCache();
        const currentGlobalRecord = recordsCache?.[gameKey]?.bestScore || 0;
        if (newScore > currentGlobalRecord) {
          const newRecord: GameRecord = {
            gameKey,
            bestScore: newScore,
            holderName: current.username,
            holderAvatar: current.avatar || '🎓'
          };

          if (recordsCache) {
            recordsCache[gameKey] = newRecord;
            if (gameKey === 'game2048') recordsCache['2048'] = newRecord;
            if (gameKey === 'detective') recordsCache['cyber'] = newRecord;
            if (gameKey === 'rgb_pixel') recordsCache['rgb_pixels'] = newRecord;
          }

          try {
            localStorage.setItem(
              LOCAL_RECORDS_CACHE_KEY,
              JSON.stringify(recordsCache || { [gameKey]: newRecord })
            );
          } catch {}

          await setDoc(
            doc(db, RECORDS_COLLECTION, GLOBAL_RECORDS_DOC),
            {
              records: {
                [gameKey]: newRecord
              },
              lastUpdated: new Date().toISOString()
            },
            { merge: true }
          );
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        if (err?.code === 'resource-exhausted' || errMsg.includes('quota') || errMsg.includes('Quota exceeded')) {
          markQuotaExhausted();
          console.warn(
            '⚠️ [StudentAuth Quota Guard] Cota zilnică Firebase Spark a fost atinsă. Scorurile rămân salvate local în siguranță.'
          );
        } else {
          console.warn('Eroare update score Firestore:', err);
        }
      }
    }, 2500);

    pendingScoreWrites.set(writeKey, timer);
  }
}

export const updateActiveArcadeScore = updateStudentArcadeScore;

export async function updateStudentLessonProgress(
  missionKey: keyof Omit<LessonsProgress, 'totalLessonScore'>,
  progressData: {
    level: number;
    score: number;
    elapsedSeconds: number;
    completed?: boolean;
  }
): Promise<void> {
  const current = getActiveStudent();
  if (!current) return;

  const currentLessons: LessonsProgress = {
    ...DEFAULT_LESSONS_PROGRESS,
    ...current.lessonsProgress
  };

  const existingMission = currentLessons[missionKey] || {
    completed: false,
    level: 1,
    score: 0,
    elapsedSeconds: 0
  };

  const updatedMission: LessonMissionState = {
    level: Math.max(existingMission.level, progressData.level),
    score: Math.max(existingMission.score, progressData.score),
    elapsedSeconds: Math.max(existingMission.elapsedSeconds, progressData.elapsedSeconds),
    completed: existingMission.completed || progressData.completed || false
  };

  currentLessons[missionKey] = updatedMission;
  currentLessons.totalLessonScore = computeTotalLessons(currentLessons);

  const arcadeTotal = current.arcadeScores?.totalArcade || 0;
  const totalXP = computeTotalXP(arcadeTotal, currentLessons.totalLessonScore);

  const updatedProfile: StudentProfile = {
    ...current,
    lessonsProgress: currentLessons,
    totalXP,
    lastActiveAt: new Date().toISOString()
  };

  saveActiveStudentLocally(updatedProfile);
  if (progressData.completed) {
    markDailyQuestFlag('completedLessonToday');
  }

  if (isCloudConnected && db && current.id) {
    try {
      await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
        [`lessonsProgress.${missionKey}`]: updatedMission,
        'lessonsProgress.totalLessonScore': currentLessons.totalLessonScore,
        totalXP,
        lastActiveAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Eroare update lesson Firestore:', err);
    }
  }
}

export function updateActiveLessonProgress(
  missionKey: keyof Omit<LessonsProgress, 'totalLessonScore'>,
  completed: boolean,
  level: number,
  score: number,
  elapsedSeconds: number
) {
  return updateStudentLessonProgress(missionKey, {
    completed,
    level,
    score,
    elapsedSeconds
  });
}

export async function saveStudentDiploma(diploma: StudentDiploma): Promise<boolean> {
  const current = getActiveStudent();
  const studentId = current?.id;

  if (current) {
    const updatedDiplomas = {
      ...(current.diplomas || {}),
      [diploma.courseId]: diploma
    };
    saveActiveStudentLocally({
      ...current,
      diplomas: updatedDiplomas,
      lastActiveAt: new Date().toISOString()
    });
  }

  try {
    const raw = localStorage.getItem('arkedo_student_diplomas');
    const existing = raw ? JSON.parse(raw) : {};
    existing[diploma.courseId] = diploma;
    localStorage.setItem('arkedo_student_diplomas', JSON.stringify(existing));
  } catch (err) {
    console.warn('Eroare salvare diploma in cache local:', err);
  }

  if (isCloudConnected && db && studentId) {
    try {
      await updateDoc(doc(db, STUDENTS_COLLECTION, studentId), {
        [`diplomas.${diploma.courseId}`]: diploma,
        lastActiveAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn('Eroare sincronizare diploma in Firestore:', err);
    }
  }

  return true;
}

export function getStudentDiplomas(): Record<string, StudentDiploma> {
  const current = getActiveStudent();
  if (current?.diplomas && Object.keys(current.diplomas).length > 0) {
    return current.diplomas;
  }
  try {
    const raw = localStorage.getItem('arkedo_student_diplomas');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function updateStudentUsername(
  studentId: string,
  newUsername: string
): Promise<{ success: boolean; error?: string }> {
  const clean = newUsername.trim();
  if (clean.length < 2) {
    return { success: false, error: 'Numele trebuie să aibă minim 2 caractere!' };
  }
  const cleanLower = clean.toLowerCase();

  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION));
      const snap = await getDocs(q);
      const exists = snap.docs.some((d) => d.id !== studentId && d.data().usernameLower === cleanLower);
      if (exists) {
        return { success: false, error: `Numele "${clean}" este deja folosit!` };
      }

      await updateDoc(doc(db, STUDENTS_COLLECTION, studentId), {
        username: clean,
        usernameLower: cleanLower,
        lastActiveAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Eroare update username Firestore:', err);
      return { success: false, error: 'Eroare la salvarea în baza de date.' };
    }
  }

  const current = getActiveStudent();
  if (current && current.id === studentId) {
    current.username = clean;
    current.usernameLower = cleanLower;
    saveActiveStudentLocally(current);
  }

  return { success: true };
}

export async function updateStudentAvatar(
  studentId: string | undefined,
  avatar: string
): Promise<{ success: boolean; error?: string }> {
  if (isCloudConnected && db && studentId) {
    try {
      await updateDoc(doc(db, STUDENTS_COLLECTION, studentId), {
        avatar,
        lastActiveAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Eroare update avatar Firestore:', err);
    }
  }

  const current = getActiveStudent();
  if (current && (!studentId || current.id === studentId)) {
    current.avatar = avatar;
    saveActiveStudentLocally(current);
  } else {
    try {
      localStorage.setItem('arkedo_student_avatar', avatar);
    } catch {}
  }

  return { success: true };
}

export const updateStudentUsernameByTeacher = updateStudentUsername;

export async function resetStudentPassword(
  studentId: string,
  newPasswordPlain: string
): Promise<{ success: boolean; error?: string }> {
  if (newPasswordPlain.trim().length < 3) {
    return { success: false, error: 'Parola nouă trebuie să aibă minim 3 caractere!' };
  }
  const passwordHash = await hashPassword(newPasswordPlain);

  if (isCloudConnected && db) {
    try {
      await updateDoc(doc(db, STUDENTS_COLLECTION, studentId), {
        passwordHash,
        lastActiveAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Eroare resetare parolă Firestore:', err);
      return { success: false, error: 'Eroare la actualizarea parolei în baza de date.' };
    }
  }

  const current = getActiveStudent();
  if (current && current.id === studentId) {
    current.passwordHash = passwordHash;
    saveActiveStudentLocally(current);
  }

  return { success: true };
}

export async function recordStudentDuelResult(
  isWinnerOrObj: boolean | { mode: string; won: boolean; score: number },
  modeParam?: string,
  pointsEarnedParam?: number
): Promise<void> {
  const current = getActiveStudent();
  if (!current) return;

  let isWinner = false;
  let mode = 'cyber_sprint';
  let pointsEarned = 0;

  if (typeof isWinnerOrObj === 'object') {
    isWinner = isWinnerOrObj.won;
    mode = isWinnerOrObj.mode;
    pointsEarned = isWinnerOrObj.score || 0;
  } else {
    isWinner = isWinnerOrObj;
    mode = modeParam || 'cyber_sprint';
    pointsEarned = pointsEarnedParam || 0;
  }

  const cappedPoints = Math.min(1000, Math.max(0, pointsEarned));
  const awardAmount = isWinner ? cappedPoints : Math.round(cappedPoints / 4);

  const prevStats = current.duelStats || {
    wins: 0,
    losses: 0,
    matchesPlayed: 0,
    duelPoints: 0,
    cyberSprintWins: 0,
    blockCodingWins: 0,
    speedCraftingWins: 0,
    quizBlitzWins: 0,
    cyberShieldWins: 0,
    pcRushWins: 0,
    mouseDuelWins: 0
  };

  const updatedStats = {
    wins: prevStats.wins + (isWinner ? 1 : 0),
    losses: prevStats.losses + (isWinner ? 0 : 1),
    matchesPlayed: prevStats.matchesPlayed + 1,
    duelPoints: Math.max(0, (prevStats.duelPoints || 0) + awardAmount),
    cyberSprintWins: (prevStats.cyberSprintWins || 0) + (isWinner && mode === 'cyber_sprint' ? 1 : 0),
    blockCodingWins: (prevStats.blockCodingWins || 0) + (isWinner && mode === 'block_coding' ? 1 : 0),
    speedCraftingWins: (prevStats.speedCraftingWins || 0) + (isWinner && mode === 'speed_crafting' ? 1 : 0),
    quizBlitzWins: (prevStats.quizBlitzWins || 0) + (isWinner && mode === 'quiz_blitz' ? 1 : 0),
    cyberShieldWins: (prevStats.cyberShieldWins || 0) + (isWinner && mode === 'cyber_shield' ? 1 : 0),
    pcRushWins: (prevStats.pcRushWins || 0) + (isWinner && mode === 'pc_rush' ? 1 : 0),
    mouseDuelWins: (prevStats.mouseDuelWins || 0) + (isWinner && mode === 'mouse_duel' ? 1 : 0),
    hackerDefenseWins: (prevStats.hackerDefenseWins || 0) + (isWinner && mode === 'hacker_defense' ? 1 : 0),
    cyberClashWins: (prevStats.cyberClashWins || 0) + (isWinner && mode === 'cyber_clash' ? 1 : 0),
    systemSabotageWins: (prevStats.systemSabotageWins || 0) + (isWinner && mode === 'system_sabotage' ? 1 : 0),
    fileDropAttackWins: (prevStats.fileDropAttackWins || 0) + (isWinner && mode === 'file_drop_attack' ? 1 : 0),
    cyberBattleshipWins: (prevStats.cyberBattleshipWins || 0) + (isWinner && mode === 'cyber_battleship' ? 1 : 0)
  };

  const totalXP = (current.totalXP || 0) + awardAmount;

  const updatedProfile: StudentProfile = {
    ...current,
    duelStats: updatedStats,
    totalXP,
    lastActiveAt: new Date().toISOString()
  };

  saveActiveStudentLocally(updatedProfile);

  if (isCloudConnected && db && current.id) {
    try {
      await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
        duelStats: updatedStats,
        totalXP,
        lastActiveAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Eroare update duel stats Firestore:', err);
    }
  }
}

export async function refreshActiveStudentFromCloud(): Promise<{
  profile: StudentProfile | null;
  source: 'cloud' | 'local';
  error?: string;
}> {
  const localProfile = getActiveStudent();
  if (!localProfile || !localProfile.id) {
    return { profile: localProfile, source: 'local' };
  }

  if (!isCloudConnected || !db || isQuotaExhausted()) {
    return { profile: localProfile, source: 'local' };
  }

  try {
    const snap = await getDoc(doc(db, STUDENTS_COLLECTION, localProfile.id));
    if (!snap.exists()) {
      return { profile: localProfile, source: 'local' };
    }

    const cloudData = snap.data() as Partial<StudentProfile>;

    const mergedLessons: LessonsProgress = {
      ...DEFAULT_LESSONS_PROGRESS,
      ...(localProfile.lessonsProgress || {})
    };
    const cloudLessons = cloudData.lessonsProgress || {};
    const allLessonKeys = new Set([
      ...Object.keys(DEFAULT_LESSONS_PROGRESS),
      ...Object.keys(localProfile.lessonsProgress || {}),
      ...Object.keys(cloudLessons)
    ]);
    for (const k of allLessonKeys) {
      if (k === 'totalLessonScore') continue;
      const locVal = (mergedLessons as unknown as Record<string, LessonMissionState | undefined>)[k];
      const cldVal = (cloudLessons as unknown as Record<string, LessonMissionState | undefined>)[k];
      if (locVal || cldVal) {
        (mergedLessons as unknown as Record<string, LessonMissionState>)[k] = {
          completed: Boolean(locVal?.completed || cldVal?.completed),
          level: Math.max(locVal?.level || 1, cldVal?.level || 1),
          score: Math.max(locVal?.score || 0, cldVal?.score || 0),
          elapsedSeconds: Math.max(locVal?.elapsedSeconds || 0, cldVal?.elapsedSeconds || 0)
        };
      }
    }
    mergedLessons.totalLessonScore = computeTotalLessons(mergedLessons);

    const mergedArcade: ArcadeScores = {
      ...DEFAULT_ARCADE_SCORES,
      ...(localProfile.arcadeScores || {})
    };
    const cloudArcade = cloudData.arcadeScores || {};
    const mergedArcadeRec = mergedArcade as unknown as Record<string, number>;
    const localArcadeRec = (localProfile.arcadeScores || {}) as unknown as Record<string, number>;
    const cloudArcadeRec = cloudArcade as unknown as Record<string, number>;
    for (const k of Object.keys(DEFAULT_ARCADE_SCORES)) {
      if (k === 'totalArcade') continue;
      mergedArcadeRec[k] = Math.max(Number(localArcadeRec[k] || 0), Number(cloudArcadeRec[k] || 0));
    }
    mergedArcade.totalArcade = computeTotalArcade(mergedArcade);

    let localCacheDiplomas: Record<string, StudentDiploma> = {};
    try {
      const raw = localStorage.getItem('arkedo_student_diplomas');
      if (raw) localCacheDiplomas = JSON.parse(raw);
    } catch {}
    const mergedDiplomas: Record<string, StudentDiploma> = {
      ...localCacheDiplomas,
      ...(localProfile.diplomas || {}),
      ...(cloudData.diplomas || {})
    };
    try {
      localStorage.setItem('arkedo_student_diplomas', JSON.stringify(mergedDiplomas));
    } catch {}

    const mergedOwned = Array.from(
      new Set([
        ...(localProfile.inventory?.ownedItemIds || DEFAULT_INVENTORY.ownedItemIds),
        ...(cloudData.inventory?.ownedItemIds || [])
      ])
    );

    const cloudDuel = cloudData.duelStats;
    const localDuel = localProfile.duelStats;
    const mergedDuel =
      cloudDuel || localDuel
        ? {
            ...(localDuel || {}),
            ...(cloudDuel || {}),
            wins: Math.max(localDuel?.wins || 0, cloudDuel?.wins || 0),
            losses: Math.max(localDuel?.losses || 0, cloudDuel?.losses || 0),
            matchesPlayed: Math.max(localDuel?.matchesPlayed || 0, cloudDuel?.matchesPlayed || 0),
            duelPoints: Math.max(localDuel?.duelPoints || 0, cloudDuel?.duelPoints || 0)
          }
        : undefined;

    const mergedBadges = Array.from(
      new Set([...(localProfile.unlockedBadgeIds || []), ...(cloudData.unlockedBadgeIds || [])])
    );

    const cloudStreak = cloudData.dailyStreak;
    const localStreak = localProfile.dailyStreak;
    const mergedStreak: DailyStreakInfo | undefined =
      cloudStreak || localStreak
        ? {
            current:
              (cloudStreak?.lastActiveDate || '') >= (localStreak?.lastActiveDate || '')
                ? cloudStreak?.current || localStreak?.current || 0
                : localStreak?.current || 0,
            best: Math.max(cloudStreak?.best || 0, localStreak?.best || 0),
            lastActiveDate:
              (cloudStreak?.lastActiveDate || '') >= (localStreak?.lastActiveDate || '')
                ? cloudStreak?.lastActiveDate || ''
                : localStreak?.lastActiveDate || '',
            activeDays: Array.from(
              new Set([...(localStreak?.activeDays || []), ...(cloudStreak?.activeDays || [])])
            )
              .sort()
              .slice(-30)
          }
        : undefined;

    const today = getTodayDateString();
    const cQuests = cloudData.dailyQuests?.date === today ? cloudData.dailyQuests : undefined;
    const lQuests = localProfile.dailyQuests?.date === today ? localProfile.dailyQuests : undefined;
    const mergedQuests: DailyQuestState | undefined =
      cQuests || lQuests
        ? {
            date: today,
            claimedIds: Array.from(new Set([...(lQuests?.claimedIds || []), ...(cQuests?.claimedIds || [])])),
            completedLessonToday: Boolean(lQuests?.completedLessonToday || cQuests?.completedLessonToday),
            playedArcadeToday: Boolean(lQuests?.playedArcadeToday || cQuests?.playedArcadeToday),
            visitedCarnetToday: Boolean(lQuests?.visitedCarnetToday || cQuests?.visitedCarnetToday)
          }
        : undefined;

    let localSolvedIds: string[] = [];
    let localSnippets: Record<string, SandboxSnippet> = {};
    try {
      const rawIds = localStorage.getItem(LOCAL_SANDBOX_SOLVED_KEY);
      if (rawIds) localSolvedIds = JSON.parse(rawIds);
      const rawSnip = localStorage.getItem(LOCAL_SANDBOX_SNIPPETS_KEY);
      if (rawSnip) localSnippets = JSON.parse(rawSnip);
    } catch {}

    const mergedSolvedIds = Array.from(
      new Set([
        ...(Array.isArray(localSolvedIds) ? localSolvedIds : []),
        ...(localProfile.sandboxProgress?.solvedIds || []),
        ...(cloudData.sandboxProgress?.solvedIds || [])
      ])
    );

    const mergedSnippets: Record<string, SandboxSnippet> = {
      ...(localSnippets || {}),
      ...(localProfile.sandboxProgress?.snippets || {})
    };
    for (const [key, cldSnip] of Object.entries(cloudData.sandboxProgress?.snippets || {})) {
      const existingSnip = mergedSnippets[key];
      if (!existingSnip || (cldSnip.updatedAt || '') > (existingSnip.updatedAt || '')) {
        mergedSnippets[key] = cldSnip;
      }
    }

    try {
      localStorage.setItem(LOCAL_SANDBOX_SOLVED_KEY, JSON.stringify(mergedSolvedIds));
      localStorage.setItem(LOCAL_SANDBOX_SNIPPETS_KEY, JSON.stringify(mergedSnippets));
    } catch {}

    let localEvalHistory: QuickEvalAttempt[] = [];
    try {
      const rawEval = localStorage.getItem(LOCAL_QUICK_EVAL_HISTORY_KEY);
      if (rawEval) localEvalHistory = JSON.parse(rawEval);
    } catch {}
    const evalMap = new Map<string, QuickEvalAttempt>();
    for (const item of [
      ...(Array.isArray(localEvalHistory) ? localEvalHistory : []),
      ...(localProfile.quickEvalHistory || []),
      ...(cloudData.quickEvalHistory || [])
    ]) {
      if (item && item.id) evalMap.set(item.id, item);
    }
    const mergedEvalHistory = Array.from(evalMap.values())
      .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
      .slice(0, 40);
    try {
      localStorage.setItem(LOCAL_QUICK_EVAL_HISTORY_KEY, JSON.stringify(mergedEvalHistory));
    } catch {}

    const computedXP =
      computeTotalXP(mergedArcade.totalArcade, mergedLessons.totalLessonScore) +
      (mergedDuel?.duelPoints || 0);
    const mergedTotalXP = Math.max(
      Number(cloudData.totalXP || 0),
      Number(localProfile.totalXP || 0),
      computedXP
    );

    const mergedProfile: StudentProfile = {
      ...localProfile,
      ...cloudData,
      id: snap.id,
      arcadeScores: mergedArcade,
      lessonsProgress: mergedLessons,
      diplomas: mergedDiplomas,
      duelStats: mergedDuel,
      inventory: {
        ...(localProfile.inventory || DEFAULT_INVENTORY),
        ...(cloudData.inventory || {}),
        ownedItemIds: mergedOwned
      },
      equipped: cloudData.equipped || localProfile.equipped || DEFAULT_EQUIPPED,
      classGrade: cloudData.classGrade || localProfile.classGrade || getLocalClassGrade() || '',
      dailyStreak: mergedStreak,
      dailyQuests: mergedQuests,
      unlockedBadgeIds: mergedBadges,
      sandboxProgress: {
        solvedIds: mergedSolvedIds,
        snippets: mergedSnippets,
        updatedAt: new Date().toISOString()
      },
      quickEvalHistory: mergedEvalHistory,
      totalXP: mergedTotalXP
    };

    if (mergedProfile.classGrade) {
      try {
        localStorage.setItem(LOCAL_CLASS_GRADE_KEY, mergedProfile.classGrade);
      } catch {}
    }
    if (typeof mergedProfile.byteCoins === 'number') {
      try {
        localStorage.setItem('arkedo_byte_coins', String(mergedProfile.byteCoins));
        localStorage.setItem('arkedo_student_coins', String(mergedProfile.byteCoins));
      } catch {}
    }

    saveActiveStudentLocally(mergedProfile);
    return { profile: mergedProfile, source: 'cloud' };
  } catch (err: any) {
    console.warn('Eroare refreshActiveStudentFromCloud:', err);
    return {
      profile: localProfile,
      source: 'local',
      error: err?.message || 'Eroare la sincronizarea cu Cloud'
    };
  }
}
