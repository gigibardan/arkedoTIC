import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';

export interface StudentResult {
  id?: string;
  studentName: string;
  courseTitle: string;
  score: number;
  maxScore: number;
  elapsedSeconds: number;
  completedAt?: any;
  dateFormatted?: string;
  schoolId?: string;
  schoolName?: string;
}

const COLLECTION_NAME = 'rezultate_tic';
const LOCAL_STORAGE_KEY = 'arkedo_tic_rezultate_backup';

function getLocalResults(): StudentResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalResults(results: StudentResult[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results.slice(0, 200)));
  } catch {
    // ignore
  }
}

/**
 * Log student results when finishing a test/mission
 */
export async function logStudentResult(
  studentName: string,
  courseTitle: string,
  score: number,
  maxScore: number,
  elapsedSeconds: number,
  schoolId?: string,
  schoolName?: string
): Promise<string | null> {
  const cleanName = (studentName || '').trim();
  // Prevent logging only if student name is empty
  if (!cleanName) {
    console.warn('Submisiune invalidă (nume elev lipsă).');
    return null;
  }

  // Resolve schoolId and schoolName if not explicitly provided
  let resolvedSchoolId = schoolId;
  let resolvedSchoolName = schoolName;
  if (!resolvedSchoolId) {
    try {
      const activeRaw = localStorage.getItem('arkedo_active_student_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (parsed.schoolId) resolvedSchoolId = parsed.schoolId;
      }
    } catch {}
  }
  if (!resolvedSchoolId) {
    resolvedSchoolId = 'scoala_pilot_01';
  }

  const localId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const dateFormatted = new Date().toLocaleString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const localEntry: StudentResult = {
    id: localId,
    studentName: cleanName,
    courseTitle,
    score,
    maxScore,
    elapsedSeconds: Math.max(0, elapsedSeconds),
    dateFormatted,
    schoolId: resolvedSchoolId,
    schoolName: resolvedSchoolName,
  };

  // Always save to local backup
  const currentLocal = getLocalResults();
  saveLocalResults([localEntry, ...currentLocal]);

  // If Firestore is connected, log to Cloud
  if (db) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        studentName: cleanName,
        courseTitle,
        score,
        maxScore,
        elapsedSeconds: Math.max(0, elapsedSeconds),
        schoolId: resolvedSchoolId,
        schoolName: resolvedSchoolName,
        completedAt: serverTimestamp(),
        dateFormatted,
      });
      return docRef.id;
    } catch (error) {
      console.warn('Nu s-a putut salva în Firestore (salvat local în cache):', error);
      return localId;
    }
  }

  return localId;
}

/**
 * Fetch all results for teacher portal
 */
export async function getStudentResults(): Promise<StudentResult[]> {
  const localList = getLocalResults();

  if (!db) {
    return localList.filter((r) => (r.studentName || '').trim().length > 0);
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('completedAt', 'desc'),
      limit(200)
    );
    const snapshot = await getDocs(q);
    const cloudResults: StudentResult[] = [];

    for (const d of snapshot.docs) {
      const data = d.data();
      cloudResults.push({
        ...(data as Omit<StudentResult, 'id'>),
        id: d.id, // Ensure Firestore doc ID is preserved
      });
    }

    // Cache to local storage
    if (cloudResults.length > 0) {
      saveLocalResults(cloudResults);
      return cloudResults;
    }
    return localList;
  } catch (error) {
    console.warn('Interogarea cu index a eșuat, se încearcă fără index:', error);
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const results: StudentResult[] = [];

      for (const d of snapshot.docs) {
        const data = d.data();
        results.push({
          ...(data as Omit<StudentResult, 'id'>),
          id: d.id,
        });
      }

      const sorted = results.sort((a, b) => {
        const timeA = a.completedAt?.toMillis?.() || 0;
        const timeB = b.completedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      if (sorted.length > 0) {
        saveLocalResults(sorted);
        return sorted;
      }
      return localList;
    } catch (fallbackError) {
      console.warn('Interogarea Firestore a eșuat, se utilizează catalogul local:', fallbackError);
      return localList.filter((r) => (r.studentName || '').trim().length > 0);
    }
  }
}

/**
 * Clear local results cache completely
 */
export function clearLocalResultsCache(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Purge all 0-second ghost results and PRO test entries from both Firestore and Local Storage
 */
export async function purgeZeroSecondGhostResults(): Promise<{ success: boolean; count: number }> {
  let count = 0;
  // 1. Clean local storage
  const currentLocal = getLocalResults();
  const cleanedLocal = currentLocal.filter((r) => {
    const sName = (r.studentName || '').trim().toUpperCase();
    const isGhost = (!r.elapsedSeconds || r.elapsedSeconds <= 0) || sName === 'PRO';
    return !isGhost;
  });
  saveLocalResults(cleanedLocal);

  // 2. Clean Firestore
  if (db) {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      for (const d of snapshot.docs) {
        const data = d.data();
        const sName = (data.studentName || '').trim().toUpperCase();
        const isGhost = (!data.elapsedSeconds || data.elapsedSeconds <= 0) || sName === 'PRO' || sName === 'TEST' || sName === 'GHOST';
        if (isGhost) {
          await deleteDoc(doc(db, COLLECTION_NAME, d.id));
          count++;
        }
      }
      return { success: true, count };
    } catch (err) {
      console.error('Eroare curățare ghost results Firestore:', err);
      return { success: false, count };
    }
  }

  return { success: true, count: currentLocal.length - cleanedLocal.length };
}

/**
 * Delete ALL submissions/results belonging to a student name (from both Firestore & Local Cache)
 */
export async function deleteAllResultsByStudentName(studentName: string): Promise<{ success: boolean; count: number }> {
  const cleanName = (studentName || '').trim().toLowerCase();
  if (!cleanName) return { success: false, count: 0 };

  // 1. Purge from local storage cache
  const currentLocal = getLocalResults();
  const filteredLocal = currentLocal.filter(
    (r) => (r.studentName || '').trim().toLowerCase() !== cleanName
  );
  saveLocalResults(filteredLocal);

  let deletedCount = 0;
  // 2. Purge from Firestore
  if (db) {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      for (const d of snapshot.docs) {
        const data = d.data();
        const docStudent = (data.studentName || '').trim().toLowerCase();
        if (docStudent === cleanName || docStudent.includes(cleanName)) {
          await deleteDoc(doc(db, COLLECTION_NAME, d.id));
          deletedCount++;
        }
      }
      return { success: true, count: deletedCount };
    } catch (err) {
      console.error('Error deleting student results by name:', err);
      return { success: false, count: deletedCount };
    }
  }

  return { success: true, count: currentLocal.length - filteredLocal.length };
}

/**
 * Delete a result document
 */
export async function deleteStudentResult(id: string): Promise<boolean> {
  // Remove from local storage
  const currentLocal = getLocalResults();
  saveLocalResults(currentLocal.filter((r) => r.id !== id));

  if (db) {
    try {
      if (!id.startsWith('local_')) {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
      } else {
        // If it was a local ID, scan if a matching doc exists in Firestore with this id field
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        for (const d of snapshot.docs) {
          const data = d.data();
          if (data.id === id || d.id === id) {
            await deleteDoc(doc(db, COLLECTION_NAME, d.id));
          }
        }
      }
      return true;
    } catch (err) {
      console.error('Error deleting result from Firestore:', err);
      return false;
    }
  }
  return true;
}

/**
 * Update/Edit a result document (Teacher action to fix or adjust grades/cheating)
 */
export async function updateStudentResult(
  id: string,
  updates: Partial<Omit<StudentResult, 'id'>>
): Promise<boolean> {
  // Update local storage
  const currentLocal = getLocalResults();
  const updatedLocal = currentLocal.map((r) => (r.id === id ? { ...r, ...updates } : r));
  saveLocalResults(updatedLocal);

  if (db && !id.startsWith('local_')) {
    try {
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, COLLECTION_NAME, id), updates);
      return true;
    } catch (err) {
      console.error('Error updating result in Firestore:', err);
      return false;
    }
  }
  return true;
}
