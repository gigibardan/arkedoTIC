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
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      studentName: studentName.trim() || 'Elev Anonim',
      courseTitle,
      score,
      maxScore,
      elapsedSeconds,
      completedAt: serverTimestamp(),
      dateFormatted: new Date().toLocaleString('ro-RO', {
        timeZone: 'Europe/Bucharest',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error logging student result to Firestore:', error);
    return null;
  }
}

/**
 * Fetch all results for teacher portal
 */
export async function getStudentResults(): Promise<StudentResult[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('completedAt', 'desc'),
      limit(200)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<StudentResult, 'id'>),
    }));
  } catch (error) {
    console.error('Error fetching student results:', error);
    // Fallback if index on completedAt is still indexing or errors: simple query
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const results = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<StudentResult, 'id'>),
      }));
      return results.sort((a, b) => {
        const timeA = a.completedAt?.toMillis?.() || 0;
        const timeB = b.completedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
      return [];
    }
  }
}

/**
 * Delete a result document
 */
export async function deleteStudentResult(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (err) {
    console.error('Error deleting result:', err);
    return false;
  }
}
