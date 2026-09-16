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
  elapsedSeconds: number
): Promise<string | null> {
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
    studentName: studentName.trim() || 'Elev Anonim',
    courseTitle,
    score,
    maxScore,
    elapsedSeconds,
    dateFormatted,
  };

  // Always save to local backup
  const currentLocal = getLocalResults();
  saveLocalResults([localEntry, ...currentLocal]);

  // If Firestore is connected, log to Cloud
  if (db) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        studentName: studentName.trim() || 'Elev Anonim',
        courseTitle,
        score,
        maxScore,
        elapsedSeconds,
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
    return localList;
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('completedAt', 'desc'),
      limit(200)
    );
    const snapshot = await getDocs(q);
    const cloudResults = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<StudentResult, 'id'>),
    }));

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
      const results = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<StudentResult, 'id'>),
      }));
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
      return localList;
    }
  }
}

/**
 * Delete a result document
 */
export async function deleteStudentResult(id: string): Promise<boolean> {
  // Remove from local storage
  const currentLocal = getLocalResults();
  saveLocalResults(currentLocal.filter((r) => r.id !== id));

  if (db && !id.startsWith('local_')) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (err) {
      console.error('Error deleting result from Firestore:', err);
      return false;
    }
  }
  return true;
}
