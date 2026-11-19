import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db, isCloudConnected } from './firebase';
import {
  ArcadeScores,
  LessonsProgress,
  StudentProfile
} from '../types';
import { ARCADE_REGISTRY } from '../data/arcadeRegistry';
import {
  ARCADE_GAME_KEYS,
  computeTotalArcade,
  computeTotalLessons,
  DEFAULT_ARCADE_SCORES,
  DEFAULT_LESSONS_PROGRESS,
  GameRecord,
  getActiveStudent,
  getInMemoryRecordsCache,
  getLastRecordsFetchTimestamp,
  GLOBAL_RECORDS_DOC,
  LOCAL_RECORDS_CACHE_KEY,
  logoutStudent,
  RECORDS_CACHE_TTL_MS,
  RECORDS_COLLECTION,
  saveActiveStudentLocally,
  setInMemoryRecordsCache,
  STUDENTS_COLLECTION
} from './studentCore';

export async function getAllStudents(): Promise<StudentProfile[]> {
  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION));
      const snap = await getDocs(q);
      const list: StudentProfile[] = [];
      snap.forEach((d) => {
        const item = d.data() as StudentProfile;
        list.push({ ...item, id: d.id, schoolId: item.schoolId || 'scoala_pilot_01' });
      });
      return list;
    } catch (err) {
      console.warn('Eroare citire elevi Firestore:', err);
    }
  }

  const local = getActiveStudent();
  return local ? [local] : [];
}

// Optimized: 1 single Firestore document read + multi-tier cache across all 28 arcade games
export async function getGameAllTimeRecords(): Promise<Record<string, GameRecord>> {
  const now = Date.now();
  const cached = getInMemoryRecordsCache();
  if (cached && now - getLastRecordsFetchTimestamp() < RECORDS_CACHE_TTL_MS) {
    return cached;
  }

  let records: Record<string, GameRecord> = {};
  try {
    const saved = localStorage.getItem(LOCAL_RECORDS_CACHE_KEY);
    if (saved) {
      records = JSON.parse(saved);
    }
  } catch {}

  const current = getActiveStudent();

  if (isCloudConnected && db) {
    try {
      const recordsDocRef = doc(db, RECORDS_COLLECTION, GLOBAL_RECORDS_DOC);
      const recordsSnap = await getDoc(recordsDocRef);

      if (recordsSnap.exists()) {
        const cloudData = recordsSnap.data();
        const cloudRecords = (cloudData?.records || {}) as Record<string, GameRecord>;
        records = { ...records, ...cloudRecords };
      } else {
        const all = await getAllStudents();
        for (const game of ARCADE_REGISTRY) {
          let topScore = 0;
          let topHolder = '';
          let topAvatar = '🎓';

          for (const s of all) {
            const sScores = s.arcadeScores as unknown as Record<string, number> | undefined;
            let score = sScores?.[game.scoreKey] || 0;
            if (!score && game.legacyAliases) {
              for (const alias of game.legacyAliases) {
                if (sScores?.[alias]) {
                  score = sScores[alias];
                  break;
                }
              }
            }
            if (score > topScore) {
              topScore = score;
              topHolder = s.username;
              topAvatar = s.avatar || '🎓';
            }
          }

          if (topScore > 0) {
            records[game.scoreKey] = {
              gameKey: game.scoreKey,
              bestScore: topScore,
              holderName: topHolder,
              holderAvatar: topAvatar
            };
          }
        }

        await setDoc(recordsDocRef, {
          records,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('⚠️ Eroare la încărcarea tabelului de recorduri:', err);
    }
  }

  // Merge active player local storage highscores & propagate legacy aliases
  for (const game of ARCADE_REGISTRY) {
    try {
      const localScore = Number(localStorage.getItem(game.localStorageKey) || '0');
      const currentRecord = records[game.scoreKey]?.bestScore || 0;
      if (localScore > currentRecord) {
        records[game.scoreKey] = {
          gameKey: game.scoreKey,
          bestScore: localScore,
          holderName: current?.username || localStorage.getItem('arkedo_student_name') || 'Campion Local',
          holderAvatar: current?.avatar || localStorage.getItem('arkedo_student_avatar') || '🎓'
        };
      }
    } catch {}

    if (records[game.scoreKey] && game.legacyAliases) {
      for (const alias of game.legacyAliases) {
        records[alias] = records[game.scoreKey];
      }
    }
  }

  setInMemoryRecordsCache(records, now);
  try {
    localStorage.setItem(LOCAL_RECORDS_CACHE_KEY, JSON.stringify(records));
  } catch {}

  return records;
}

export async function deleteStudentAccount(studentId: string, username?: string): Promise<boolean> {
  const current = getActiveStudent();
  const cleanUser = (username || current?.username || '').trim().toLowerCase();

  if (current && (current.id === studentId || (cleanUser && current.username.trim().toLowerCase() === cleanUser))) {
    logoutStudent();
  }

  try {
    const savedLocalName = (localStorage.getItem('arkedo_student_name') || '').trim().toLowerCase();
    if (cleanUser && savedLocalName === cleanUser) {
      localStorage.removeItem('arkedo_student_name');
    }
  } catch {}

  if (cleanUser) {
    try {
      const { deleteAllResultsByStudentName } = await import('./resultsService');
      await deleteAllResultsByStudentName(cleanUser);
    } catch (e) {
      console.warn('Eroare stergere rezultate asociate elevului:', e);
    }
  }

  if (isCloudConnected && db) {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
      return true;
    } catch (err) {
      console.warn('Eroare stergere elev Firestore:', err);
      return false;
    }
  }
  return true;
}

async function fetchStudentByIdOrActive(studentId: string): Promise<StudentProfile | null> {
  if (isCloudConnected && db) {
    const snap = await getDoc(doc(db, STUDENTS_COLLECTION, studentId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as StudentProfile;
    }
  }
  const current = getActiveStudent();
  if (current && current.id === studentId) {
    return current;
  }
  return null;
}

export async function updateStudentFullProfileByTeacher(
  studentId: string,
  updates: Partial<StudentProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      ...updates,
      lastActiveAt: new Date().toISOString()
    };

    const current = getActiveStudent();
    if (current && current.id === studentId) {
      saveActiveStudentLocally({
        ...current,
        ...payload
      });
    }

    if (isCloudConnected && db) {
      await updateDoc(doc(db, STUDENTS_COLLECTION, studentId), payload);
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error updating student profile by teacher:', err);
    return { success: false, error: err?.message || 'Eroare la actualizarea profilului' };
  }
}

export async function updateStudentScoresByTeacher(
  studentId: string,
  scoresData: {
    arcadeScores?: Partial<ArcadeScores>;
    lessonsProgress?: Partial<LessonsProgress>;
    duelStats?: Partial<StudentProfile['duelStats']>;
    customXP?: number;
  }
): Promise<{ success: boolean; newTotalXP: number; error?: string }> {
  try {
    const student = await fetchStudentByIdOrActive(studentId);
    if (!student) {
      return { success: false, newTotalXP: 0, error: 'Elevul nu a fost găsit în baza de date' };
    }

    const newArcade: ArcadeScores = {
      ...DEFAULT_ARCADE_SCORES,
      ...(student.arcadeScores || {})
    };
    if (scoresData.arcadeScores) {
      const incoming = scoresData.arcadeScores as Record<string, unknown>;
      const target = newArcade as unknown as Record<string, number>;
      for (const k of ARCADE_GAME_KEYS) {
        if (k in incoming) {
          target[k] = Math.max(0, Number(incoming[k]) || 0);
        }
      }
    }
    newArcade.totalArcade = computeTotalArcade(newArcade);

    const newLessons: LessonsProgress = {
      ...DEFAULT_LESSONS_PROGRESS,
      ...(student.lessonsProgress || {}),
      ...(scoresData.lessonsProgress || {})
    };
    newLessons.totalLessonScore = computeTotalLessons(newLessons);

    const newDuelStats = {
      wins: 0,
      losses: 0,
      matchesPlayed: 0,
      duelPoints: 0,
      ...(student.duelStats || {}),
      ...(scoresData.duelStats || {})
    };

    const calculatedXP =
      scoresData.customXP !== undefined
        ? Math.max(0, scoresData.customXP)
        : newLessons.totalLessonScore + newArcade.totalArcade + (newDuelStats.duelPoints || 0);

    const res = await updateStudentFullProfileByTeacher(studentId, {
      arcadeScores: newArcade,
      lessonsProgress: newLessons,
      duelStats: newDuelStats,
      totalXP: calculatedXP,
      lastActiveAt: new Date().toISOString()
    });
    return { success: res.success, newTotalXP: calculatedXP, error: res.error };
  } catch (err: any) {
    console.error('Error updating scores by teacher:', err);
    return { success: false, newTotalXP: 0, error: err?.message || 'Eroare la salvarea scorurilor' };
  }
}

export async function resetStudentArcadeScores(
  studentId: string,
  gameKey?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const student = await fetchStudentByIdOrActive(studentId);
    if (!student) return { success: false, error: 'Elevul nu a fost găsit' };

    let updatedArcade: ArcadeScores = {
      ...DEFAULT_ARCADE_SCORES,
      ...(student.arcadeScores || {})
    };

    if (gameKey && gameKey in updatedArcade) {
      (updatedArcade as unknown as Record<string, number>)[gameKey] = 0;
    } else {
      updatedArcade = { ...DEFAULT_ARCADE_SCORES };
    }
    updatedArcade.totalArcade = computeTotalArcade(updatedArcade);

    const totalLessons = computeTotalLessons(student.lessonsProgress || {});
    const duelPts = student.duelStats?.duelPoints || 0;
    const newXP = totalLessons + updatedArcade.totalArcade + duelPts;

    return await updateStudentFullProfileByTeacher(studentId, {
      arcadeScores: updatedArcade,
      totalXP: newXP
    });
  } catch (err: any) {
    return { success: false, error: err?.message || 'Eroare la resetarea jocurilor' };
  }
}

export async function resetStudentLessonProgress(
  studentId: string,
  missionKey?: keyof Omit<LessonsProgress, 'totalLessonScore'> | 'all'
): Promise<{ success: boolean; error?: string }> {
  try {
    const student = await fetchStudentByIdOrActive(studentId);
    if (!student) return { success: false, error: 'Elevul nu a fost găsit' };

    let updatedLessons: LessonsProgress = {
      ...DEFAULT_LESSONS_PROGRESS,
      ...(student.lessonsProgress || {})
    };

    if (missionKey && missionKey !== 'all') {
      updatedLessons[missionKey] = { completed: false, level: 1, score: 0, elapsedSeconds: 0 };
    } else {
      updatedLessons = { ...DEFAULT_LESSONS_PROGRESS };
    }
    updatedLessons.totalLessonScore = computeTotalLessons(updatedLessons);

    const totalArcade = computeTotalArcade(student.arcadeScores || {});
    const duelPts = student.duelStats?.duelPoints || 0;
    const newXP = updatedLessons.totalLessonScore + totalArcade + duelPts;

    return await updateStudentFullProfileByTeacher(studentId, {
      lessonsProgress: updatedLessons,
      totalXP: newXP
    });
  } catch (err: any) {
    return { success: false, error: err?.message || 'Eroare la resetarea progresului' };
  }
}

export async function applyCheatingPenalty(
  studentId: string,
  penaltyXP: number,
  _reason: string
): Promise<{ success: boolean; newTotalXP: number; error?: string }> {
  try {
    const student = await fetchStudentByIdOrActive(studentId);
    if (!student) return { success: false, newTotalXP: 0, error: 'Elevul nu a fost găsit' };

    const newXP = Math.max(0, (student.totalXP || 0) - penaltyXP);
    const res = await updateStudentFullProfileByTeacher(studentId, { totalXP: newXP });
    return { success: res.success, newTotalXP: newXP, error: res.error };
  } catch (err: any) {
    return { success: false, newTotalXP: 0, error: err?.message || 'Eroare la aplicarea penalizării' };
  }
}

export async function awardTeacherBonusXP(
  studentId: string,
  bonusXP: number,
  _reason: string
): Promise<{ success: boolean; newTotalXP: number; error?: string }> {
  try {
    const student = await fetchStudentByIdOrActive(studentId);
    if (!student) return { success: false, newTotalXP: 0, error: 'Elevul nu a fost găsit' };

    const newXP = (student.totalXP || 0) + bonusXP;
    const res = await updateStudentFullProfileByTeacher(studentId, { totalXP: newXP });
    return { success: res.success, newTotalXP: newXP, error: res.error };
  } catch (err: any) {
    return { success: false, newTotalXP: 0, error: err?.message || 'Eroare la adăugarea bonusului' };
  }
}

export async function recalculateStudentXP(
  studentId: string
): Promise<{ success: boolean; newTotalXP: number; error?: string }> {
  try {
    const student = await fetchStudentByIdOrActive(studentId);
    if (!student) return { success: false, newTotalXP: 0, error: 'Elevul nu a fost găsit' };

    const fairArcade = computeTotalArcade(student.arcadeScores || {});
    const fairLessons = computeTotalLessons(student.lessonsProgress || {});
    const duelPoints = student.duelStats?.duelPoints || 0;
    const fairTotalXP = fairArcade + fairLessons + duelPoints;

    const res = await updateStudentFullProfileByTeacher(studentId, {
      totalXP: fairTotalXP,
      arcadeScores: {
        ...DEFAULT_ARCADE_SCORES,
        ...(student.arcadeScores || {}),
        totalArcade: fairArcade
      },
      lessonsProgress: {
        ...DEFAULT_LESSONS_PROGRESS,
        ...(student.lessonsProgress || {}),
        totalLessonScore: fairLessons
      }
    });

    return { success: res.success, newTotalXP: fairTotalXP, error: res.error };
  } catch (err: any) {
    return { success: false, newTotalXP: 0, error: err?.message || 'Eroare la recalcularea XP-ului' };
  }
}
