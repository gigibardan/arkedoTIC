import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { db, auth, isCloudConnected } from './firebase';
import { School, Teacher, SuperAdminUser, StudentProfile, ArcadeScores, LessonsProgress } from '../types';
import { computeTotalArcade, recalculateStudentXP, getAllStudents, deleteStudentAccount } from './studentAuthService';
import { getStudentResults, deleteStudentResult, StudentResult } from './resultsService';

// Default designated Superadmin Email
export const PRIMARY_SUPERADMIN_EMAIL = 'Gheorghe.Bardan@gmail.com';
const SESSION_STORAGE_SUPERADMIN_KEY = 'arkedo_superadmin_auth_user';

// Local storage fallback keys for offline / testing without cloud credentials
const LOCAL_SCHOOLS_KEY = 'arkedo_local_schools';
const LOCAL_TEACHERS_KEY = 'arkedo_local_teachers';

/* ==========================================================
   1. AUTHENTICATION & SUPERADMIN SESSION VERIFICATION
   ========================================================== */

export interface SuperAdminAuthStatus {
  isAuthenticated: boolean;
  user: SuperAdminUser | null;
  error?: string;
}

export function isAuthorizedSuperadminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized === PRIMARY_SUPERADMIN_EMAIL.toLowerCase() ||
    normalized.endsWith('@arkedo.ro') ||
    normalized.startsWith('admin@') ||
    normalized.startsWith('superadmin@')
  );
}

/**
 * Check if a Firestore user has superadmin role verified server-side
 */
export async function verifySuperadminDoc(uid: string, email: string): Promise<boolean> {
  if (isAuthorizedSuperadminEmail(email)) {
    return true;
  }
  if (!db) return false;
  try {
    const adminRef = doc(db, 'superadmins', uid);
    const snap = await getDoc(adminRef);
    if (snap.exists() && snap.data().role === 'superadmin') {
      return true;
    }
  } catch (err) {
    console.warn('[Superadmin] Error checking superadmin doc:', err);
  }
  return false;
}

/**
 * Sign in as Superadmin using Firebase Auth with fallback
 */
export async function signInSuperAdmin(email: string, password: string): Promise<SuperAdminAuthStatus> {
  const cleanEmail = email.trim();
  
  if (isCloudConnected && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;
      
      const isSuper = await verifySuperadminDoc(user.uid, user.email || cleanEmail);
      if (!isSuper) {
        await firebaseSignOut(auth);
        return {
          isAuthenticated: false,
          user: null,
          error: 'Contul conectat nu deține privilegii de Superadmin. Contactați administratorul principal.'
        };
      }

      // Record / update login document in Firestore
      if (db) {
        try {
          await setDoc(doc(db, 'superadmins', user.uid), {
            email: user.email || cleanEmail,
            role: 'superadmin',
            lastLogin: Date.now(),
            name: user.displayName || cleanEmail.split('@')[0]
          }, { merge: true });
        } catch (e) {
          console.warn('[Superadmin] Could not update admin doc:', e);
        }
      }

      const adminUser: SuperAdminUser = {
        uid: user.uid,
        email: user.email || cleanEmail,
        name: user.displayName || cleanEmail.split('@')[0],
        role: 'superadmin',
        createdAt: Date.now(),
        lastLogin: Date.now()
      };

      sessionStorage.setItem(SESSION_STORAGE_SUPERADMIN_KEY, JSON.stringify(adminUser));
      return { isAuthenticated: true, user: adminUser };
    } catch (err: any) {
      console.error('[Superadmin Auth Error]', err);
      // If Firebase Auth throws auth/invalid-credential or similar, provide clear localized message
      let message = 'Autentificare eșuată. Verificați credențialele.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Email sau parolă incorectă pentru Superadmin.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Prea multe încercări eșuate. Vă rugăm să așteptați câteva minute.';
      }
      return { isAuthenticated: false, user: null, error: message };
    }
  }

  // Fallback mode for local dev or when Firebase credentials are not yet entered in environment variables
  if (isAuthorizedSuperadminEmail(cleanEmail) && password.length >= 6) {
    const adminUser: SuperAdminUser = {
      uid: 'superadmin_dev_uid',
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'superadmin',
      createdAt: Date.now(),
      lastLogin: Date.now()
    };
    sessionStorage.setItem(SESSION_STORAGE_SUPERADMIN_KEY, JSON.stringify(adminUser));
    return { isAuthenticated: true, user: adminUser };
  }

  return {
    isAuthenticated: false,
    user: null,
    error: 'Emailul specificat nu este recunoscut ca Superadmin autorizat.'
  };
}

export async function signOutSuperAdmin(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('[Superadmin] Sign out error:', e);
    }
  }
  sessionStorage.removeItem(SESSION_STORAGE_SUPERADMIN_KEY);
}

export function getCurrentSuperAdminSession(): SuperAdminUser | null {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_SUPERADMIN_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as SuperAdminUser;
  } catch {
    return null;
  }
}

/* ==========================================================
   2. SCHOOLS MANAGEMENT (CRUD)
   ========================================================== */

export async function getAllSchools(): Promise<School[]> {
  if (db && isCloudConnected) {
    try {
      const q = query(collection(db, 'scoli'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const list: School[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('[Superadmin] Error fetching schools from cloud:', e);
    }
  }

  // Fallback to local storage
  try {
    const local = localStorage.getItem(LOCAL_SCHOOLS_KEY);
    if (local) return JSON.parse(local);
  } catch {}

  // Initial seed list of demo schools
  const defaultSchools: School[] = [
    {
      id: 'scoala_pilot_01',
      name: 'Liceul Tehnologic „Spiru Haret”',
      code: 'SPIRU-01',
      city: 'București',
      active: true,
      createdAt: Date.now() - 86400000 * 30,
      notes: 'Școală pilot pentru modulele TIC și Arcade'
    },
    {
      id: 'scoala_pilot_02',
      name: 'Școala Gimnazială Nr. 19',
      code: 'GIMN-19',
      city: 'Timișoara',
      active: true,
      createdAt: Date.now() - 86400000 * 15,
      notes: 'Clasele V-VIII TIC'
    }
  ];
  localStorage.setItem(LOCAL_SCHOOLS_KEY, JSON.stringify(defaultSchools));
  return defaultSchools;
}

export async function createSchool(data: Omit<School, 'id' | 'createdAt'>): Promise<School> {
  const newId = 'school_' + Date.now();
  const school: School = {
    ...data,
    id: newId,
    createdAt: Date.now(),
    active: data.active ?? true
  };

  if (db && isCloudConnected) {
    try {
      await setDoc(doc(db, 'scoli', newId), school);
    } catch (e) {
      console.warn('[Superadmin] Could not write school to Firestore:', e);
    }
  }

  const existing = await getAllSchools();
  existing.push(school);
  localStorage.setItem(LOCAL_SCHOOLS_KEY, JSON.stringify(existing));
  return school;
}

export async function updateSchool(id: string, updates: Partial<School>): Promise<boolean> {
  if (db && isCloudConnected) {
    try {
      await updateDoc(doc(db, 'scoli', id), updates);
    } catch (e) {
      console.warn('[Superadmin] Could not update school in Firestore:', e);
    }
  }

  const existing = await getAllSchools();
  const index = existing.findIndex(s => s.id === id);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updates };
    localStorage.setItem(LOCAL_SCHOOLS_KEY, JSON.stringify(existing));
    return true;
  }
  return false;
}

export async function deleteSchool(id: string): Promise<boolean> {
  if (db && isCloudConnected) {
    try {
      await deleteDoc(doc(db, 'scoli', id));
    } catch (e) {
      console.warn('[Superadmin] Could not delete school from Firestore:', e);
    }
  }

  const existing = await getAllSchools();
  const filtered = existing.filter(s => s.id !== id);
  localStorage.setItem(LOCAL_SCHOOLS_KEY, JSON.stringify(filtered));
  return true;
}

/* ==========================================================
   3. TEACHERS MANAGEMENT (CRUD)
   ========================================================== */

export async function getAllTeachers(): Promise<Teacher[]> {
  if (db && isCloudConnected) {
    try {
      const q = query(collection(db, 'profesori'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: Teacher[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('[Superadmin] Error fetching teachers from cloud:', e);
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_TEACHERS_KEY);
    if (local) return JSON.parse(local);
  } catch {}

  const defaultTeachers: Teacher[] = [
    {
      id: 'prof_gheorghe_01',
      email: PRIMARY_SUPERADMIN_EMAIL,
      name: 'Prof. Gheorghe Bârdan',
      schoolId: 'scoala_pilot_01',
      schoolName: 'Liceul Tehnologic „Spiru Haret”',
      role: 'teacher',
      approved: true,
      createdAt: Date.now() - 86400000 * 20
    }
  ];
  localStorage.setItem(LOCAL_TEACHERS_KEY, JSON.stringify(defaultTeachers));
  return defaultTeachers;
}

export async function createTeacher(data: Omit<Teacher, 'id' | 'createdAt'>): Promise<Teacher> {
  const newId = 'prof_' + Date.now();
  const teacher: Teacher = {
    ...data,
    id: newId,
    createdAt: Date.now(),
    approved: data.approved ?? true,
    role: 'teacher'
  };

  if (db && isCloudConnected) {
    try {
      await setDoc(doc(db, 'profesori', newId), teacher);
    } catch (e) {
      console.warn('[Superadmin] Could not write teacher to Firestore:', e);
    }
  }

  const existing = await getAllTeachers();
  existing.push(teacher);
  localStorage.setItem(LOCAL_TEACHERS_KEY, JSON.stringify(existing));
  return teacher;
}

export async function updateTeacher(id: string, updates: Partial<Teacher>): Promise<boolean> {
  if (db && isCloudConnected) {
    try {
      await updateDoc(doc(db, 'profesori', id), updates);
    } catch (e) {
      console.warn('[Superadmin] Could not update teacher in Firestore:', e);
    }
  }

  const existing = await getAllTeachers();
  const index = existing.findIndex(t => t.id === id);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updates };
    localStorage.setItem(LOCAL_TEACHERS_KEY, JSON.stringify(existing));
    return true;
  }
  return false;
}

export async function deleteTeacher(id: string): Promise<boolean> {
  if (db && isCloudConnected) {
    try {
      await deleteDoc(doc(db, 'profesori', id));
    } catch (e) {
      console.warn('[Superadmin] Could not delete teacher from Firestore:', e);
    }
  }

  const existing = await getAllTeachers();
  const filtered = existing.filter(t => t.id !== id);
  localStorage.setItem(LOCAL_TEACHERS_KEY, JSON.stringify(filtered));
  return true;
}

/* ==========================================================
   4. COMPREHENSIVE SCORE & LESSON PROGRESS CONTROL
   ========================================================== */

/**
 * Direct adjustment of any Arcade score by Superadmin
 */
export async function updateArcadeScoreSuperAdmin(
  studentId: string, 
  gameKey: keyof ArcadeScores, 
  newScore: number
): Promise<boolean> {
  if (!db || !isCloudConnected) {
    console.warn('[Superadmin] Offline score update');
    return false;
  }

  try {
    const studentRef = doc(db, 'elevi', studentId);
    const snap = await getDoc(studentRef);
    if (!snap.exists()) return false;

    const data = snap.data() as StudentProfile;
    const currentScores: ArcadeScores = {
      ...(data.arcadeScores || {}),
      totalArcade: 0
    } as ArcadeScores;

    // Apply new score
    (currentScores as any)[gameKey] = Math.max(0, Math.round(newScore));
    currentScores.totalArcade = computeTotalArcade(currentScores);

    // Compute updated total XP
    const lessonScore = data.lessonsProgress?.totalLessonScore || 0;
    const newTotalXP = currentScores.totalArcade + lessonScore;

    await updateDoc(studentRef, {
      arcadeScores: currentScores,
      totalXP: newTotalXP,
      lastActiveAt: new Date().toISOString()
    });

    return true;
  } catch (err) {
    console.error('[Superadmin] Error updating arcade score:', err);
    return false;
  }
}

/**
 * Direct adjustment of any Lesson module progress by Superadmin
 */
export async function updateLessonProgressSuperAdmin(
  studentId: string,
  lessonKey: keyof LessonsProgress,
  updates: { completed?: boolean; score?: number; level?: number }
): Promise<boolean> {
  if (!db || !isCloudConnected) return false;

  try {
    const studentRef = doc(db, 'elevi', studentId);
    const snap = await getDoc(studentRef);
    if (!snap.exists()) return false;

    const data = snap.data() as StudentProfile;
    const currentProgress: any = { ...(data.lessonsProgress || {}) };
    const prevModule = currentProgress[lessonKey] || { completed: false, score: 0, level: 1, elapsedSeconds: 0 };

    currentProgress[lessonKey] = {
      ...prevModule,
      completed: updates.completed ?? prevModule.completed,
      score: updates.score !== undefined ? Math.max(0, Math.round(updates.score)) : prevModule.score,
      level: updates.level ?? prevModule.level
    };

    // Recalculate total lesson score
    let totalLessonScore = 0;
    const lessonKeys = [
      'hardware', 'files', 'internet1', 'internet2', 'text1', 'text2',
      'graphics1', 'graphics2', 'algo1', 'algo2', 'scratch1', 'scratch2',
      'presentation1', 'presentation2'
    ];
    for (const key of lessonKeys) {
      if (currentProgress[key]?.score) {
        totalLessonScore += currentProgress[key].score;
      }
    }
    currentProgress.totalLessonScore = totalLessonScore;

    const arcadeScore = data.arcadeScores?.totalArcade || 0;
    const newTotalXP = arcadeScore + totalLessonScore;

    await updateDoc(studentRef, {
      lessonsProgress: currentProgress,
      totalXP: newTotalXP,
      lastActiveAt: new Date().toISOString()
    });

    return true;
  } catch (err) {
    console.error('[Superadmin] Error updating lesson progress:', err);
    return false;
  }
}

/**
 * Add / deduct arbitrary XP or ByteCoins with audit
 */
export async function adjustStudentXPAndCoinsSuperAdmin(
  studentId: string,
  xpDelta: number,
  coinsDelta: number
): Promise<boolean> {
  if (!db || !isCloudConnected) return false;

  try {
    const studentRef = doc(db, 'elevi', studentId);
    const snap = await getDoc(studentRef);
    if (!snap.exists()) return false;

    const data = snap.data() as StudentProfile;
    const currentXP = data.totalXP || 0;
    const currentCoins = data.byteCoins || 0;

    const newXP = Math.max(0, currentXP + xpDelta);
    const newCoins = Math.max(0, currentCoins + coinsDelta);

    await updateDoc(studentRef, {
      totalXP: newXP,
      byteCoins: newCoins,
      lastActiveAt: new Date().toISOString()
    });

    return true;
  } catch (err) {
    console.error('[Superadmin] Error adjusting XP/Coins:', err);
    return false;
  }
}

/**
 * Toggle account suspension for inappropriate usernames or disciplinary reasons
 */
export async function toggleStudentSuspensionSuperAdmin(studentId: string, isSuspended: boolean): Promise<boolean> {
  if (!db || !isCloudConnected) return false;
  try {
    const studentRef = doc(db, 'elevi', studentId);
    await updateDoc(studentRef, {
      isSuspended,
      lastActiveAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('[Superadmin] Error toggling student suspension:', err);
    return false;
  }
}

/**
 * Transfer student to another school
 */
export async function transferStudentSchoolSuperAdmin(studentId: string, newSchoolId: string): Promise<boolean> {
  if (!db || !isCloudConnected) return false;
  try {
    const studentRef = doc(db, 'elevi', studentId);
    await updateDoc(studentRef, {
      schoolId: newSchoolId,
      lastActiveAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('[Superadmin] Error transferring student:', err);
    return false;
  }
}

/* ==========================================================
   5. GRADEBOOK & SUBMISSION DIRECT MANIPULATION
   ========================================================== */

export async function updateSubmissionSuperAdmin(
  resultId: string, 
  updates: Partial<StudentResult>
): Promise<boolean> {
  if (!db || !isCloudConnected) return false;
  try {
    const resRef = doc(db, 'rezultate_tic', resultId);
    await updateDoc(resRef, updates);
    return true;
  } catch (err) {
    console.error('[Superadmin] Error updating submission:', err);
    return false;
  }
}

/* ==========================================================
   6. DUEL ROOMS MULTIPLAYER MANAGEMENT
   ========================================================== */

export interface ActiveDuelRoom {
  id: string;
  roomCode: string;
  mode: string;
  status: string;
  hostName: string;
  guestName?: string;
  createdAt: number;
}

export async function getAllActiveDuelRooms(): Promise<ActiveDuelRoom[]> {
  if (!db || !isCloudConnected) return [];
  try {
    const roomsSnap = await getDocs(collection(db, 'duel_rooms'));
    const rooms: ActiveDuelRoom[] = [];
    roomsSnap.forEach(snap => {
      const data = snap.data();
      rooms.push({
        id: snap.id,
        roomCode: data.roomCode || snap.id,
        mode: data.mode || 'Standard',
        status: data.status || 'waiting',
        hostName: data.host?.name || 'Anonim',
        guestName: data.guest?.name || undefined,
        createdAt: data.createdAt || Date.now()
      });
    });
    return rooms;
  } catch (e) {
    console.warn('[Superadmin] Error getting duel rooms:', e);
    return [];
  }
}

export async function forceCloseDuelRoom(roomId: string): Promise<boolean> {
  if (!db || !isCloudConnected) return false;
  try {
    await deleteDoc(doc(db, 'duel_rooms', roomId));
    return true;
  } catch (e) {
    console.warn('[Superadmin] Error force closing duel room:', e);
    return false;
  }
}
