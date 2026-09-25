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
  'cyber_dino',
  'redstone_lab',
  'voxel_architect',
  'roblox_clicker'
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
  redstone_lab: 0,
  voxel_architect: 0,
  roblox_clicker: 0,
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

// Calculate total arcade score safely & equitably across all minigames
export function computeTotalArcade(scores: Partial<ArcadeScores>): number {
  // Normalize typing WPM to fair competitive arcade points (1 WPM = 25 pts, e.g. 60 WPM = 1,500 pts, max cap 2,500 pts)
  const rawTyping = scores.typing || 0;
  const typingPoints = Math.min(2500, rawTyping <= 250 ? rawTyping * 25 : rawTyping);

  // 2048 Bitwise: Reaching 2048 awards up to 2,500 XP (normalized so 20,000+ raw tile merge scores don't skew student XP)
  const raw2048 = scores.game2048 || 0;
  const game2048Points = raw2048 > 2500 ? Math.min(2500, Math.round(raw2048 / 10)) : raw2048;

  // Mouse Agility (45s reflex mini-game): balanced, capped at fair max 1,000 pts
  const mousePoints = Math.min(1000, scores.mouse || 0);

  // Roblox Clicker (Duel & Clicker): 5,000 Blox converted 5:1 to max 1,000 XP
  const rawRoblox = scores.roblox_clicker || 0;
  const robloxPoints = rawRoblox > 1000 ? Math.min(1000, Math.round(rawRoblox / 5)) : rawRoblox;

  // Virus Sweeper (Cyber-Safe Minesweeper): capped at fair 1,800 XP
  const virusSweeperPoints = Math.min(1800, scores.virus_sweeper || 0);

  // File-Drop (Tetris): capped at fair 1,800 XP
  const fileDropPoints = Math.min(1800, scores.file_drop || 0);

  // File Organizer (45s sprint): capped at fair 1,200 XP
  const filesPoints = Math.min(1200, scores.files || 0);

  // Firewall Defender (45s packet inspection): capped at fair 1,500 XP
  const firewallPoints = Math.min(1500, scores.firewall || 0);

  // Cyber Dino Runner: capped at fair 1,800 XP
  const cyberDinoPoints = Math.min(1800, scores.cyber_dino || 0);

  // Complex educational games retain earned values up to sensible safety caps
  const pcBuilderPoints = Math.min(2500, scores.pcbuilder || 0);
  const detectivePoints = Math.min(1500, scores.detective || 0);
  const binaryFactoryPoints = Math.min(1500, scores.binary_factory || 0);
  const mazePoints = Math.min(2500, scores.maze || 0);
  const rgbPoints = Math.min(2000, scores.rgb_pixel || 0);
  const byteSliderPoints = Math.min(1500, scores.byte_slider || 0);
  const redstonePoints = Math.min(2500, scores.redstone_lab || 0);
  const voxelPoints = Math.min(3000, scores.voxel_architect || 0);

  return (
    typingPoints +
    mousePoints +
    game2048Points +
    pcBuilderPoints +
    detectivePoints +
    filesPoints +
    binaryFactoryPoints +
    mazePoints +
    firewallPoints +
    rgbPoints +
    byteSliderPoints +
    fileDropPoints +
    virusSweeperPoints +
    cyberDinoPoints +
    redstonePoints +
    voxelPoints +
    robloxPoints
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

  // Capped strictly at max 1000 XP for the winner of any duel (and max 250 XP for loser)
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
    pcRushWins: 0
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
    pcRushWins: (prevStats.pcRushWins || 0) + (isWinner && mode === 'pc_rush' ? 1 : 0)
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

// FULL PROFILE UPDATE (TEACHER ACTION)
export async function updateStudentFullProfileByTeacher(
  studentId: string,
  updates: Partial<StudentProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      ...updates,
      lastActiveAt: new Date().toISOString()
    };

    // If currently logged in on this browser, update local profile too
    const current = getActiveStudent();
    if (current && current.id === studentId) {
      const updatedLocal: StudentProfile = {
        ...current,
        ...payload
      };
      saveActiveStudentLocally(updatedLocal);
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

// UPDATE INDIVIDUAL SCORES (TEACHER ACTION)
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
    // Get existing student first
    let student: StudentProfile | null = null;
    if (isCloudConnected && db) {
      const snap = await getDoc(doc(db, STUDENTS_COLLECTION, studentId));
      if (snap.exists()) {
        student = { id: snap.id, ...snap.data() } as StudentProfile;
      }
    }
    if (!student) {
      const current = getActiveStudent();
      if (current && current.id === studentId) {
        student = current;
      }
    }

    if (!student) {
      return { success: false, newTotalXP: 0, error: 'Elevul nu a fost găsit în baza de date' };
    }

    const newArcade: ArcadeScores = {
      ...DEFAULT_ARCADE_SCORES,
      ...(student.arcadeScores || {})
    };
    if (scoresData.arcadeScores) {
      for (const k of ARCADE_GAME_KEYS) {
        if (k in scoresData.arcadeScores) {
          (newArcade as any)[k] = Math.max(0, Number((scoresData.arcadeScores as any)[k]) || 0);
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

    // Calculate total XP (or allow custom XP override if specified)
    const calculatedXP = scoresData.customXP !== undefined
      ? Math.max(0, scoresData.customXP)
      : newLessons.totalLessonScore + newArcade.totalArcade + (newDuelStats.duelPoints || 0);

    const updates: Partial<StudentProfile> = {
      arcadeScores: newArcade,
      lessonsProgress: newLessons,
      duelStats: newDuelStats,
      totalXP: calculatedXP,
      lastActiveAt: new Date().toISOString()
    };

    const res = await updateStudentFullProfileByTeacher(studentId, updates);
    return { success: res.success, newTotalXP: calculatedXP, error: res.error };
  } catch (err: any) {
    console.error('Error updating scores by teacher:', err);
    return { success: false, newTotalXP: 0, error: err?.message || 'Eroare la salvarea scorurilor' };
  }
}

// RESET SPECIFIC OR ALL ARCADE SCORES
export async function resetStudentArcadeScores(
  studentId: string,
  gameKey?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let student: StudentProfile | null = null;
    if (isCloudConnected && db) {
      const snap = await getDoc(doc(db, STUDENTS_COLLECTION, studentId));
      if (snap.exists()) student = { id: snap.id, ...snap.data() } as StudentProfile;
    }
    if (!student) {
      const current = getActiveStudent();
      if (current && current.id === studentId) student = current;
    }

    if (!student) return { success: false, error: 'Elevul nu a fost găsit' };

    let updatedArcade: ArcadeScores = {
      ...DEFAULT_ARCADE_SCORES,
      ...(student.arcadeScores || {})
    };

    if (gameKey && gameKey in updatedArcade) {
      (updatedArcade as any)[gameKey] = 0;
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

// RESET LESSON PROGRESS
export async function resetStudentLessonProgress(
  studentId: string,
  missionKey?: 'hardware' | 'files' | 'internet1' | 'internet2' | 'all'
): Promise<{ success: boolean; error?: string }> {
  try {
    let student: StudentProfile | null = null;
    if (isCloudConnected && db) {
      const snap = await getDoc(doc(db, STUDENTS_COLLECTION, studentId));
      if (snap.exists()) student = { id: snap.id, ...snap.data() } as StudentProfile;
    }
    if (!student) {
      const current = getActiveStudent();
      if (current && current.id === studentId) student = current;
    }

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

// APPLY CHEATING PENALTY
export async function applyCheatingPenalty(
  studentId: string,
  penaltyXP: number,
  reason: string
): Promise<{ success: boolean; newTotalXP: number; error?: string }> {
  try {
    let student: StudentProfile | null = null;
    if (isCloudConnected && db) {
      const snap = await getDoc(doc(db, STUDENTS_COLLECTION, studentId));
      if (snap.exists()) student = { id: snap.id, ...snap.data() } as StudentProfile;
    }
    if (!student) {
      const current = getActiveStudent();
      if (current && current.id === studentId) student = current;
    }

    if (!student) return { success: false, newTotalXP: 0, error: 'Elevul nu a fost găsit' };

    const currentXP = student.totalXP || 0;
    const newXP = Math.max(0, currentXP - penaltyXP);

    const res = await updateStudentFullProfileByTeacher(studentId, {
      totalXP: newXP
    });

    return { success: res.success, newTotalXP: newXP, error: res.error };
  } catch (err: any) {
    return { success: false, newTotalXP: 0, error: err?.message || 'Eroare la aplicarea penalizării' };
  }
}

// AWARD TEACHER BONUS XP
export async function awardTeacherBonusXP(
  studentId: string,
  bonusXP: number,
  reason: string
): Promise<{ success: boolean; newTotalXP: number; error?: string }> {
  try {
    let student: StudentProfile | null = null;
    if (isCloudConnected && db) {
      const snap = await getDoc(doc(db, STUDENTS_COLLECTION, studentId));
      if (snap.exists()) student = { id: snap.id, ...snap.data() } as StudentProfile;
    }
    if (!student) {
      const current = getActiveStudent();
      if (current && current.id === studentId) student = current;
    }

    if (!student) return { success: false, newTotalXP: 0, error: 'Elevul nu a fost găsit' };

    const currentXP = student.totalXP || 0;
    const newXP = currentXP + bonusXP;

    const res = await updateStudentFullProfileByTeacher(studentId, {
      totalXP: newXP
    });

    return { success: res.success, newTotalXP: newXP, error: res.error };
  } catch (err: any) {
    return { success: false, newTotalXP: 0, error: err?.message || 'Eroare la adăugarea bonusului' };
  }
}

// RECALCULATE STUDENT XP FAIRLY
export async function recalculateStudentXP(
  studentId: string
): Promise<{ success: boolean; newTotalXP: number; error?: string }> {
  try {
    let student: StudentProfile | null = null;
    if (isCloudConnected && db) {
      const snap = await getDoc(doc(db, STUDENTS_COLLECTION, studentId));
      if (snap.exists()) student = { id: snap.id, ...snap.data() } as StudentProfile;
    }
    if (!student) {
      const current = getActiveStudent();
      if (current && current.id === studentId) student = current;
    }

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
