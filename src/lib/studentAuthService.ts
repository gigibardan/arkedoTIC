import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isCloudConnected } from './firebase';
import { StudentProfile, ArcadeScores, LessonsProgress } from '../types';
export type { StudentProfile, ArcadeScores, LessonsProgress };

const STUDENTS_COLLECTION = 'elevi';
const LOCAL_PROFILE_KEY = 'arkedo_active_student_profile';

// Standard 11 games IDs
export const ARCADE_GAME_KEYS = [
  'typing',
  'mouse',
  'game2048',
  'pcbuilder',
  'detective',
  'files',
  'binary_factory',
  'maze',
  'firewall',
  'rgb_pixel',
  'byte_slider',
  'file_drop',
  'virus_sweeper',
  'cyber_dino'
] as const;

export const DEFAULT_ARCADE_SCORES: ArcadeScores = {
  typing: 0,
  mouse: 0,
  game2048: 0,
  pcbuilder: 0,
  detective: 0,
  files: 0,
  binary_factory: 0,
  maze: 0,
  firewall: 0,
  rgb_pixel: 0,
  byte_slider: 0,
  file_drop: 0,
  virus_sweeper: 0,
  cyber_dino: 0,
  totalArcade: 0
};

export const DEFAULT_LESSONS_PROGRESS: LessonsProgress = {
  hardware: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  files: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  internet1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  internet2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  totalLessonScore: 0
};

// Simple yet reliable SHA-256 hash in browser
export async function hashPassword(plainText: string): Promise<string> {
  const trimmed = plainText.trim();
  if (!window.crypto?.subtle) {
    // Fallback hash for environments lacking crypto.subtle
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

// Calculate total arcade score safely & equitably
export function computeTotalArcade(scores: Partial<ArcadeScores>): number {
  // Normalize typing WPM to fair competitive arcade points (1 WPM = 25 pts, e.g. 60 WPM = 1,500 pts)
  const rawTyping = scores.typing || 0;
  const typingPoints = rawTyping <= 250 ? rawTyping * 25 : rawTyping;

  // Normalize 2048 to prevent standard tile merge score inflation (scales ~20,000 raw down to ~2,000 pts)
  const raw2048 = scores.game2048 || 0;
  const game2048Points = raw2048 > 3000 ? Math.round(raw2048 / 10) : raw2048;

  return (
    typingPoints +
    (scores.mouse || 0) +
    game2048Points +
    (scores.pcbuilder || 0) +
    (scores.detective || 0) +
    (scores.files || 0) +
    (scores.binary_factory || 0) +
    (scores.maze || 0) +
    (scores.firewall || 0) +
    (scores.rgb_pixel || 0) +
    (scores.byte_slider || 0) +
    (scores.file_drop || 0) +
    (scores.virus_sweeper || 0) +
    (scores.cyber_dino || 0)
  );
}

// Calculate smart lesson score
// Base score 400 per completed lesson, plus bonus for real reading time (minimum 90s to maximum 600s)
export function computeLessonXP(lesson: { completed?: boolean; score?: number; elapsedSeconds?: number }): number {
  if (!lesson || !lesson.completed) {
    return Math.min(lesson?.score || 0, 150); // Partial credit up to 150 for in-progress
  }
  const base = Math.max(lesson.score || 0, 400);
  const sec = lesson.elapsedSeconds || 0;
  
  // Anti-speedrun check: if completed with steady, reflective reading pace
  let timeBonus = 0;
  if (sec >= 90 && sec <= 600) {
    // Steady, reflective reading pace: bonus 100 pts
    timeBonus = 100;
  } else if (sec > 40 && sec < 90) {
    // Quick pace: bonus 50 pts
    timeBonus = 50;
  }

  return base + timeBonus;
}

export function computeTotalLessons(lessons: Partial<LessonsProgress>): number {
  const hw = computeLessonXP(lessons.hardware || {});
  const fl = computeLessonXP(lessons.files || {});
  const i1 = computeLessonXP(lessons.internet1 || {});
  const i2 = computeLessonXP(lessons.internet2 || {});
  return hw + fl + i1 + i2;
}

export function computeTotalXP(arcadeTotal: number, lessonsTotal: number): number {
  return arcadeTotal + lessonsTotal;
}

// Active local profile helper
export function getActiveStudent(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveActiveStudentLocally(profile: StudentProfile | null) {
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
    // Ignore
  }
}

// REGISTER NEW STUDENT
export async function registerStudent(
  username: string, 
  passwordPlain: string, 
  avatar: string = '🎓'
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

  // Check if username already exists in Firestore
  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION));
      const snap = await getDocs(q);
      const exists = snap.docs.some((d) => {
        const data = d.data();
        return data.usernameLower === usernameLower;
      });
      if (exists) {
        return { success: false, error: `Numele "${cleanUsername}" este deja folosit. Alege alt nume sau conectează-te!` };
      }
    } catch (err) {
      console.warn('Eroare verificare username Firestore:', err);
    }
  }

  // Load existing local highscores as starting point
  const currentArcadeScores: ArcadeScores = {
    typing: Number(localStorage.getItem('arkedo_highscore_typing') || '0'),
    mouse: Number(localStorage.getItem('arkedo_highscore_mouse') || '0'),
    game2048: Number(localStorage.getItem('arkedo_highscore_2048') || '0'),
    pcbuilder: Number(localStorage.getItem('arkedo_highscore_pcbuilder') || '0'),
    detective: Number(localStorage.getItem('arkedo_highscore_cyber') || '0'),
    files: Number(localStorage.getItem('arkedo_highscore_files') || '0'),
    binary_factory: Number(localStorage.getItem('arkedo_highscore_binary_factory') || '0'),
    maze: Number(localStorage.getItem('arkedo_highscore_maze') || '0'),
    firewall: Number(localStorage.getItem('arkedo_highscore_firewall') || '0'),
    rgb_pixel: Number(localStorage.getItem('arkedo_highscore_rgb_pixels') || '0'),
    byte_slider: Number(localStorage.getItem('arkedo_highscore_byte_slider') || '0'),
    file_drop: Number(localStorage.getItem('arkedo_highscore_file_drop') || '0'),
    virus_sweeper: Number(localStorage.getItem('arkedo_highscore_virus_sweeper') || '0'),
    totalArcade: 0
  };
  currentArcadeScores.totalArcade = computeTotalArcade(currentArcadeScores);

  const currentLessons: LessonsProgress = {
    hardware: {
      completed: Number(localStorage.getItem('arkedo_hw_level') || '1') >= 6,
      level: Number(localStorage.getItem('arkedo_hw_level') || '1'),
      score: Number(localStorage.getItem('arkedo_hw_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_hw_elapsed') || '0')
    },
    files: {
      completed: Number(localStorage.getItem('arkedo_files_level') || '1') >= 8,
      level: Number(localStorage.getItem('arkedo_files_level') || '1'),
      score: Number(localStorage.getItem('arkedo_files_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_files_elapsed') || '0')
    },
    internet1: {
      completed: Number(localStorage.getItem('arkedo_internet1_level') || '1') >= 7,
      level: Number(localStorage.getItem('arkedo_internet1_level') || '1'),
      score: Number(localStorage.getItem('arkedo_internet1_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_internet1_elapsed') || '0')
    },
    internet2: {
      completed: Number(localStorage.getItem('arkedo_internet2_level') || '1') >= 7,
      level: Number(localStorage.getItem('arkedo_internet2_level') || '1'),
      score: Number(localStorage.getItem('arkedo_internet2_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_internet2_elapsed') || '0')
    },
    totalLessonScore: 0
  };
  currentLessons.totalLessonScore = computeTotalLessons(currentLessons);

  const totalXP = computeTotalXP(currentArcadeScores.totalArcade, currentLessons.totalLessonScore);

  const docId = `elev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newProfile: StudentProfile = {
    id: docId,
    username: cleanUsername,
    usernameLower,
    passwordHash,
    avatar,
    arcadeScores: currentArcadeScores,
    lessonsProgress: currentLessons,
    totalXP,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  };

  // Save to Firestore
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

  // Query Firestore
  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION));
      const snap = await getDocs(q);
      const studentDoc = snap.docs.find((d) => {
        const data = d.data();
        return data.usernameLower === usernameLower || data.username?.toLowerCase() === usernameLower;
      });

      if (!studentDoc) {
        return { success: false, error: `Nu am găsit niciun cont cu numele "${cleanUsername}". Verifică scrierea sau înregistrează-te!` };
      }

      const data = studentDoc.data() as StudentProfile;
      if (data.passwordHash !== passwordHash) {
        return { success: false, error: 'Parolă incorectă! Dacă ai uitat-o, roagă profesorul să o reseteze din panoul admin.' };
      }

      // Update last active
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, studentDoc.id), {
          lastActiveAt: new Date().toISOString()
        });
      } catch {
        // Ignore
      }

      const fullProfile: StudentProfile = {
        ...data,
        id: studentDoc.id
      };

      // Sync cloud data into local storage so current PC has all high scores & progress
      syncProfileToLocalStorage(fullProfile);
      saveActiveStudentLocally(fullProfile);

      return { success: true, profile: fullProfile };
    } catch (err) {
      console.warn('Eroare login Firestore:', err);
    }
  }

  // Fallback check if offline or local
  const currentLocal = getActiveStudent();
  if (currentLocal && currentLocal.usernameLower === usernameLower) {
    if (currentLocal.passwordHash === passwordHash) {
      return { success: true, profile: currentLocal };
    }
    return { success: false, error: 'Parolă incorectă!' };
  }

  return { success: false, error: 'Nu s-a putut realiza autentificarea. Verifică conexiunea la internet!' };
}

// SYNC PROFILE INTO LOCALSTORAGE SO ARCADE & MISSIONS REFLECT THE LOGGED IN STUDENT
export function syncProfileToLocalStorage(profile: StudentProfile) {
  try {
    localStorage.setItem('arkedo_student_name', profile.username);
    localStorage.setItem('arkedo_student_avatar', profile.avatar || '🎓');

    // Arcade scores
    if (profile.arcadeScores) {
      if (profile.arcadeScores.typing) localStorage.setItem('arkedo_highscore_typing', String(profile.arcadeScores.typing));
      if (profile.arcadeScores.mouse) localStorage.setItem('arkedo_highscore_mouse', String(profile.arcadeScores.mouse));
      if (profile.arcadeScores.game2048) localStorage.setItem('arkedo_highscore_2048', String(profile.arcadeScores.game2048));
      if (profile.arcadeScores.pcbuilder) localStorage.setItem('arkedo_highscore_pcbuilder', String(profile.arcadeScores.pcbuilder));
      if (profile.arcadeScores.detective) localStorage.setItem('arkedo_highscore_cyber', String(profile.arcadeScores.detective));
      if (profile.arcadeScores.files) localStorage.setItem('arkedo_highscore_files', String(profile.arcadeScores.files));
      if (profile.arcadeScores.binary_factory) localStorage.setItem('arkedo_highscore_binary_factory', String(profile.arcadeScores.binary_factory));
      if (profile.arcadeScores.maze) localStorage.setItem('arkedo_highscore_maze', String(profile.arcadeScores.maze));
      if (profile.arcadeScores.firewall) localStorage.setItem('arkedo_highscore_firewall', String(profile.arcadeScores.firewall));
      if (profile.arcadeScores.rgb_pixel) localStorage.setItem('arkedo_highscore_rgb_pixels', String(profile.arcadeScores.rgb_pixel));
      if (profile.arcadeScores.byte_slider) localStorage.setItem('arkedo_highscore_byte_slider', String(profile.arcadeScores.byte_slider));
      if (profile.arcadeScores.file_drop) localStorage.setItem('arkedo_highscore_file_drop', String(profile.arcadeScores.file_drop));
      if (profile.arcadeScores.virus_sweeper) localStorage.setItem('arkedo_highscore_virus_sweeper', String(profile.arcadeScores.virus_sweeper));
    }

    // Lessons progress
    if (profile.lessonsProgress) {
      const hw = profile.lessonsProgress.hardware;
      if (hw) {
        localStorage.setItem('arkedo_hw_level', String(hw.level || 1));
        localStorage.setItem('arkedo_hw_score', String(hw.score || 0));
        localStorage.setItem('arkedo_hw_elapsed', String(hw.elapsedSeconds || 0));
      }
      const fl = profile.lessonsProgress.files;
      if (fl) {
        localStorage.setItem('arkedo_files_level', String(fl.level || 1));
        localStorage.setItem('arkedo_files_score', String(fl.score || 0));
        localStorage.setItem('arkedo_files_elapsed', String(fl.elapsedSeconds || 0));
      }
      const i1 = profile.lessonsProgress.internet1;
      if (i1) {
        localStorage.setItem('arkedo_internet1_level', String(i1.level || 1));
        localStorage.setItem('arkedo_internet1_score', String(i1.score || 0));
        localStorage.setItem('arkedo_internet1_elapsed', String(i1.elapsedSeconds || 0));
      }
      const i2 = profile.lessonsProgress.internet2;
      if (i2) {
        localStorage.setItem('arkedo_internet2_level', String(i2.level || 1));
        localStorage.setItem('arkedo_internet2_score', String(i2.score || 0));
        localStorage.setItem('arkedo_internet2_elapsed', String(i2.elapsedSeconds || 0));
      }
    }
  } catch (err) {
    console.warn('Sync localstorage:', err);
  }
}

// LOGOUT STUDENT
export function logoutStudent() {
  saveActiveStudentLocally(null);
}

// UPDATE ARCADE SCORE FOR LOGGED STUDENT (AND CLOUD)
export async function updateStudentArcadeScore(
  gameKey: keyof Omit<ArcadeScores, 'totalArcade'>, 
  newScore: number
): Promise<void> {
  const current = getActiveStudent();
  if (!current) return;

  const currentBest = current.arcadeScores?.[gameKey] || 0;
  if (newScore <= currentBest) return; // Only save new personal records

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

  if (isCloudConnected && db && current.id) {
    try {
      await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
        [`arcadeScores.${gameKey}`]: newScore,
        'arcadeScores.totalArcade': updatedArcade.totalArcade,
        totalXP,
        lastActiveAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Eroare update score Firestore:', err);
    }
  }
}

export const updateActiveArcadeScore = updateStudentArcadeScore;

// UPDATE LESSON PROGRESS FOR LOGGED STUDENT
export async function updateStudentLessonProgress(
  missionKey: 'hardware' | 'files' | 'internet1' | 'internet2',
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

  // Keep highest score & elapsed time
  const updatedMission = {
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
  missionKey: 'hardware' | 'files' | 'internet1' | 'internet2',
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

// UPDATE USERNAME BY STUDENT OR TEACHER
export async function updateStudentUsername(
  studentId: string, 
  newUsername: string
): Promise<{ success: boolean; error?: string }> {
  const clean = newUsername.trim();
  if (clean.length < 2) {
    return { success: false, error: 'Numele trebuie să aibă minim 2 caractere!' };
  }
  const cleanLower = clean.toLowerCase();

  // Check unique
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

  // Update active local if it's the current user
  const current = getActiveStudent();
  if (current && current.id === studentId) {
    current.username = clean;
    current.usernameLower = cleanLower;
    saveActiveStudentLocally(current);
  }

  return { success: true };
}

// UPDATE AVATAR BY STUDENT
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
    } catch {
      // Ignore
    }
  }

  return { success: true };
}

export const updateStudentUsernameByTeacher = updateStudentUsername;

// RESET PASSWORD BY TEACHER (OR STUDENT IF ALLOWED)
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

// RECORD DUEL RESULT & STATS
export async function recordStudentDuelResult(
  isWinner: boolean,
  mode: string,
  pointsEarned: number
): Promise<void> {
  const current = getActiveStudent();
  if (!current) return;

  const prevStats = current.duelStats || {
    wins: 0,
    losses: 0,
    matchesPlayed: 0,
    duelPoints: 0,
    cyberSprintWins: 0,
    quizBlitzWins: 0,
    cyberShieldWins: 0,
    pcRushWins: 0
  };

  const updatedStats = {
    wins: prevStats.wins + (isWinner ? 1 : 0),
    losses: prevStats.losses + (isWinner ? 0 : 1),
    matchesPlayed: prevStats.matchesPlayed + 1,
    duelPoints: Math.max(0, (prevStats.duelPoints || 0) + (isWinner ? pointsEarned : Math.round(pointsEarned / 4))),
    cyberSprintWins: (prevStats.cyberSprintWins || 0) + (isWinner && mode === 'cyber_sprint' ? 1 : 0),
    quizBlitzWins: (prevStats.quizBlitzWins || 0) + (isWinner && mode === 'quiz_blitz' ? 1 : 0),
    cyberShieldWins: (prevStats.cyberShieldWins || 0) + (isWinner && mode === 'cyber_shield' ? 1 : 0),
    pcRushWins: (prevStats.pcRushWins || 0) + (isWinner && mode === 'pc_rush' ? 1 : 0)
  };

  const totalXP = (current.totalXP || 0) + (isWinner ? pointsEarned : Math.round(pointsEarned / 4));

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

// GET ALL STUDENTS FOR LEADERBOARD & TEACHER
export async function getAllStudents(): Promise<StudentProfile[]> {
  if (isCloudConnected && db) {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION));
      const snap = await getDocs(q);
      const list: StudentProfile[] = [];
      snap.forEach((d) => {
        const item = d.data() as StudentProfile;
        list.push({ ...item, id: d.id });
      });
      return list;
    } catch (err) {
      console.warn('Eroare citire elevi Firestore:', err);
    }
  }

  // Fallback to active local profile if offline
  const local = getActiveStudent();
  return local ? [local] : [];
}

// DELETE STUDENT ACCOUNT (TEACHER ACTION)
export async function deleteStudentAccount(studentId: string): Promise<boolean> {
  if (isCloudConnected && db) {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
      
      const current = getActiveStudent();
      if (current && current.id === studentId) {
        logoutStudent();
      }
      return true;
    } catch (err) {
      console.warn('Eroare stergere elev Firestore:', err);
      return false;
    }
  }
  return false;
}
