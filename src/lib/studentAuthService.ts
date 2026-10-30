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
import { StudentProfile, StudentDiploma, ArcadeScores, LessonsProgress, ShopCategory, ShopItem, StudentInventory, EquippedItems } from '../types';
import { DEFAULT_EQUIPPED, DEFAULT_INVENTORY, SHOP_ITEMS } from './shopCatalog';
export type { StudentProfile, StudentDiploma, ArcadeScores, LessonsProgress, ShopCategory, ShopItem, StudentInventory, EquippedItems };

const STUDENTS_COLLECTION = 'elevi';
const RECORDS_COLLECTION = 'recorduri_jocuri';
const GLOBAL_RECORDS_DOC = 'arcade_records';
const LOCAL_PROFILE_KEY = 'arkedo_active_student_profile';
const LOCAL_RECORDS_CACHE_KEY = 'arkedo_cached_game_records';

// In-memory cache for game records to minimize Firestore reads
let inMemoryRecordsCache: Record<string, GameRecord> | null = null;
let lastRecordsFetchTimestamp = 0;
const RECORDS_CACHE_TTL_MS = 60000; // 60 seconds TTL

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
  'roblox_clicker',
  'mouse_v2',
  'page_craft'
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
  mouse_v2: 0,
  page_craft: 0,
  hacker_defense: 0,
  cyber_snake: 0,
  totalArcade: 0
};

export const DEFAULT_LESSONS_PROGRESS: LessonsProgress = {
  hardware: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  files: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  internet1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  internet2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  text1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  text2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  graphics1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  graphics2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  algo1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  algo2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  scratch1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  scratch2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  presentation1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  presentation2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  model3d1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  model3d2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  cyber6a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  cyber6b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  scratch6a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  scratch6b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_word_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_word_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_audio_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_video_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_cloud_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_gis_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_cpp_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_cpp_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_decision_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_loop_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_stem_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g7_robot_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_calc_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_calc_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_calc_c: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_calc_d: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_web_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_web_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_web_c: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_algo_a: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_algo_b: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_algo_c: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_algo_d: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
  g8_algo_e: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
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

  // Maestrul Mouse-ului 2.0 (Cyber Clicker & Agility Lab): capped at fair 1,200 XP
  const mouseV2Points = Math.min(1200, scores.mouse_v2 || 0);

  // PageCraft Document & Layout Architect: capped at 2,000 XP
  const pageCraftPoints = Math.min(2000, scores.page_craft || 0);

  // Hacker vs Defender Cybersecurity Duel: capped at 2,000 XP
  const hackerDefensePoints = Math.min(2000, scores.hacker_defense || 0);

  return (
    typingPoints +
    mousePoints +
    mouseV2Points +
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
    robloxPoints +
    pageCraftPoints +
    hackerDefensePoints
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
  const t1 = computeLessonXP(lessons.text1 || {});
  const t2 = computeLessonXP(lessons.text2 || {});
  const g1 = computeLessonXP(lessons.graphics1 || {});
  const g2 = computeLessonXP(lessons.graphics2 || {});
  const a1 = computeLessonXP(lessons.algo1 || {});
  const a2 = computeLessonXP(lessons.algo2 || {});
  const s1 = computeLessonXP(lessons.scratch1 || {});
  const s2 = computeLessonXP(lessons.scratch2 || {});
  const p1 = computeLessonXP(lessons.presentation1 || {});
  const p2 = computeLessonXP(lessons.presentation2 || {});
  const m3d1 = computeLessonXP(lessons.model3d1 || {});
  const m3d2 = computeLessonXP(lessons.model3d2 || {});
  const cy6a = computeLessonXP(lessons.cyber6a || {});
  const cy6b = computeLessonXP(lessons.cyber6b || {});
  const sc6a = computeLessonXP(lessons.scratch6a || {});
  const sc6b = computeLessonXP(lessons.scratch6b || {});
  const g7w1 = computeLessonXP(lessons.g7_word_a || {});
  const g7w2 = computeLessonXP(lessons.g7_word_b || {});
  const g7a1 = computeLessonXP(lessons.g7_audio_a || {});
  const g7v2 = computeLessonXP(lessons.g7_video_b || {});
  const g7c1 = computeLessonXP(lessons.g7_cloud_a || {});
  const g7g2 = computeLessonXP(lessons.g7_gis_b || {});
  const g7cp1 = computeLessonXP(lessons.g7_cpp_a || {});
  const g7cp2 = computeLessonXP(lessons.g7_cpp_b || {});
  const g7d1 = computeLessonXP(lessons.g7_decision_a || {});
  const g7l2 = computeLessonXP(lessons.g7_loop_b || {});
  const g7st1 = computeLessonXP(lessons.g7_stem_a || {});
  const g7r2 = computeLessonXP(lessons.g7_robot_b || {});
  const g8ca = computeLessonXP(lessons.g8_calc_a || {});
  const g8cb = computeLessonXP(lessons.g8_calc_b || {});
  const g8cc = computeLessonXP(lessons.g8_calc_c || {});
  const g8cd = computeLessonXP(lessons.g8_calc_d || {});
  const g8wa = computeLessonXP(lessons.g8_web_a || {});
  const g8wb = computeLessonXP(lessons.g8_web_b || {});
  const g8wc = computeLessonXP(lessons.g8_web_c || {});
  const g8aa = computeLessonXP(lessons.g8_algo_a || {});
  const g8ab = computeLessonXP(lessons.g8_algo_b || {});
  const g8ac = computeLessonXP(lessons.g8_algo_c || {});
  const g8ad = computeLessonXP(lessons.g8_algo_d || {});
  const g8ae = computeLessonXP(lessons.g8_algo_e || {});
  return hw + fl + i1 + i2 + t1 + t2 + g1 + g2 + a1 + a2 + s1 + s2 + p1 + p2 + m3d1 + m3d2 + cy6a + cy6b + sc6a + sc6b + g7w1 + g7w2 + g7a1 + g7v2 + g7c1 + g7g2 + g7cp1 + g7cp2 + g7d1 + g7l2 + g7st1 + g7r2 + g8ca + g8cb + g8cc + g8cd + g8wa + g8wb + g8wc + g8aa + g8ab + g8ac + g8ad + g8ae;
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
    cyber_dino: Number(localStorage.getItem('arkedo_highscore_cyber_dino') || '0'),
    mouse_v2: Number(localStorage.getItem('arkedo_highscore_mouse_v2') || '0'),
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
    text1: {
      completed: Number(localStorage.getItem('arkedo_text1_level') || '1') >= 8,
      level: Number(localStorage.getItem('arkedo_text1_level') || '1'),
      score: Number(localStorage.getItem('arkedo_text1_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_text1_elapsed') || '0')
    },
    text2: {
      completed: Number(localStorage.getItem('arkedo_text2_level') || '1') >= 8,
      level: Number(localStorage.getItem('arkedo_text2_level') || '1'),
      score: Number(localStorage.getItem('arkedo_text2_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_text2_elapsed') || '0')
    },
    graphics1: {
      completed: Number(localStorage.getItem('arkedo_graphics1_level') || '1') >= 7,
      level: Number(localStorage.getItem('arkedo_graphics1_level') || '1'),
      score: Number(localStorage.getItem('arkedo_graphics1_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_graphics1_elapsed') || '0')
    },
    graphics2: {
      completed: Number(localStorage.getItem('arkedo_graphics2_level') || '1') >= 7,
      level: Number(localStorage.getItem('arkedo_graphics2_level') || '1'),
      score: Number(localStorage.getItem('arkedo_graphics2_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_graphics2_elapsed') || '0')
    },
    algo1: {
      completed: Number(localStorage.getItem('arkedo_algo1_level') || '1') >= 8,
      level: Number(localStorage.getItem('arkedo_algo1_level') || '1'),
      score: Number(localStorage.getItem('arkedo_algo1_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_algo1_elapsed') || '0')
    },
    algo2: {
      completed: Number(localStorage.getItem('arkedo_algo2_level') || '1') >= 8,
      level: Number(localStorage.getItem('arkedo_algo2_level') || '1'),
      score: Number(localStorage.getItem('arkedo_algo2_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_algo2_elapsed') || '0')
    },
    scratch1: {
      completed: Number(localStorage.getItem('arkedo_scratch1_level') || '1') >= 8,
      level: Number(localStorage.getItem('arkedo_scratch1_level') || '1'),
      score: Number(localStorage.getItem('arkedo_scratch1_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_scratch1_elapsed') || '0')
    },
    scratch2: {
      completed: Number(localStorage.getItem('arkedo_scratch2_level') || '1') >= 8,
      level: Number(localStorage.getItem('arkedo_scratch2_level') || '1'),
      score: Number(localStorage.getItem('arkedo_scratch2_score') || '0'),
      elapsedSeconds: Number(localStorage.getItem('arkedo_scratch2_elapsed') || '0')
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
    schoolId: schoolId || 'scoala_pilot_01',
    arcadeScores: currentArcadeScores,
    lessonsProgress: currentLessons,
    byteCoins: 100, // 100 B-Coins welcome bonus
    inventory: DEFAULT_INVENTORY,
    equipped: DEFAULT_EQUIPPED,
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
        id: studentDoc.id,
        schoolId: data.schoolId || 'scoala_pilot_01',
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
      if (profile.arcadeScores.mouse_v2) localStorage.setItem('arkedo_highscore_mouse_v2', String(profile.arcadeScores.mouse_v2));
      if (profile.arcadeScores.page_craft) localStorage.setItem('arkedo_highscore_page_craft', String(profile.arcadeScores.page_craft));
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
      const t1 = profile.lessonsProgress.text1;
      if (t1) {
        localStorage.setItem('arkedo_text1_level', String(t1.level || 1));
        localStorage.setItem('arkedo_text1_score', String(t1.score || 0));
        localStorage.setItem('arkedo_text1_elapsed', String(t1.elapsedSeconds || 0));
      }
      const t2 = profile.lessonsProgress.text2;
      if (t2) {
        localStorage.setItem('arkedo_text2_level', String(t2.level || 1));
        localStorage.setItem('arkedo_text2_score', String(t2.score || 0));
        localStorage.setItem('arkedo_text2_elapsed', String(t2.elapsedSeconds || 0));
      }
      const g1 = profile.lessonsProgress.graphics1;
      if (g1) {
        localStorage.setItem('arkedo_graphics1_level', String(g1.level || 1));
        localStorage.setItem('arkedo_graphics1_score', String(g1.score || 0));
        localStorage.setItem('arkedo_graphics1_elapsed', String(g1.elapsedSeconds || 0));
      }
      const g2 = profile.lessonsProgress.graphics2;
      if (g2) {
        localStorage.setItem('arkedo_graphics2_level', String(g2.level || 1));
        localStorage.setItem('arkedo_graphics2_score', String(g2.score || 0));
        localStorage.setItem('arkedo_graphics2_elapsed', String(g2.elapsedSeconds || 0));
      }
      const a1 = profile.lessonsProgress.algo1;
      if (a1) {
        localStorage.setItem('arkedo_algo1_level', String(a1.level || 1));
        localStorage.setItem('arkedo_algo1_score', String(a1.score || 0));
        localStorage.setItem('arkedo_algo1_elapsed', String(a1.elapsedSeconds || 0));
      }
      const a2 = profile.lessonsProgress.algo2;
      if (a2) {
        localStorage.setItem('arkedo_algo2_level', String(a2.level || 1));
        localStorage.setItem('arkedo_algo2_score', String(a2.score || 0));
        localStorage.setItem('arkedo_algo2_elapsed', String(a2.elapsedSeconds || 0));
      }
      const s1 = profile.lessonsProgress.scratch1;
      if (s1) {
        localStorage.setItem('arkedo_scratch1_level', String(s1.level || 1));
        localStorage.setItem('arkedo_scratch1_score', String(s1.score || 0));
        localStorage.setItem('arkedo_scratch1_elapsed', String(s1.elapsedSeconds || 0));
      }
      const s2 = profile.lessonsProgress.scratch2;
      if (s2) {
        localStorage.setItem('arkedo_scratch2_level', String(s2.level || 1));
        localStorage.setItem('arkedo_scratch2_score', String(s2.score || 0));
        localStorage.setItem('arkedo_scratch2_elapsed', String(s2.elapsedSeconds || 0));
      }

      // Grade 6 Lessons
      const p1 = profile.lessonsProgress.presentation1;
      if (p1) {
        localStorage.setItem('arkedo_g6p1_level', String(p1.level || 1));
        localStorage.setItem('arkedo_g6p1_score', String(p1.score || 0));
        localStorage.setItem('arkedo_g6p1_elapsed', String(p1.elapsedSeconds || 0));
        if (p1.completed) localStorage.setItem('arkedo_completed_g6_presentation1', 'true');
      }
      const p2 = profile.lessonsProgress.presentation2;
      if (p2) {
        localStorage.setItem('arkedo_g6p2_level', String(p2.level || 1));
        localStorage.setItem('arkedo_g6p2_score', String(p2.score || 0));
        localStorage.setItem('arkedo_g6p2_elapsed', String(p2.elapsedSeconds || 0));
        if (p2.completed) localStorage.setItem('arkedo_completed_g6_presentation2', 'true');
      }
      const m3d1 = profile.lessonsProgress.model3d1;
      if (m3d1) {
        localStorage.setItem('arkedo_g6p3_level', String(m3d1.level || 1));
        localStorage.setItem('arkedo_g6p3_score', String(m3d1.score || 0));
        localStorage.setItem('arkedo_g6p3_elapsed', String(m3d1.elapsedSeconds || 0));
        if (m3d1.completed) localStorage.setItem('arkedo_completed_g6_paint3d', 'true');
      }
      const m3d2 = profile.lessonsProgress.model3d2;
      if (m3d2) {
        localStorage.setItem('arkedo_g6a1_level', String(m3d2.level || 1));
        localStorage.setItem('arkedo_g6a1_score', String(m3d2.score || 0));
        localStorage.setItem('arkedo_g6a1_elapsed', String(m3d2.elapsedSeconds || 0));
        if (m3d2.completed) localStorage.setItem('arkedo_completed_g6_anim3d', 'true');
      }
      const cy6a = profile.lessonsProgress.cyber6a;
      if (cy6a) {
        localStorage.setItem('arkedo_g6m1_level', String(cy6a.level || 1));
        localStorage.setItem('arkedo_g6m1_score', String(cy6a.score || 0));
        localStorage.setItem('arkedo_g6m1_elapsed', String(cy6a.elapsedSeconds || 0));
        if (cy6a.completed) localStorage.setItem('arkedo_completed_g6_malware', 'true');
      }
      const cy6b = profile.lessonsProgress.cyber6b;
      if (cy6b) {
        localStorage.setItem('arkedo_g6e1_level', String(cy6b.level || 1));
        localStorage.setItem('arkedo_g6e1_score', String(cy6b.score || 0));
        localStorage.setItem('arkedo_g6e1_elapsed', String(cy6b.elapsedSeconds || 0));
        if (cy6b.completed) localStorage.setItem('arkedo_completed_g6_email', 'true');
      }
      const sc6a = profile.lessonsProgress.scratch6a;
      if (sc6a) {
        localStorage.setItem('arkedo_g6s1_level', String(sc6a.level || 1));
        localStorage.setItem('arkedo_g6s1_score', String(sc6a.score || 0));
        localStorage.setItem('arkedo_g6s1_elapsed', String(sc6a.elapsedSeconds || 0));
        if (sc6a.completed) localStorage.setItem('arkedo_completed_g6_scratch1', 'true');
      }
      const sc6b = profile.lessonsProgress.scratch6b;
      if (sc6b) {
        localStorage.setItem('arkedo_g6s2_level', String(sc6b.level || 1));
        localStorage.setItem('arkedo_g6s2_score', String(sc6b.score || 0));
        localStorage.setItem('arkedo_g6s2_elapsed', String(sc6b.elapsedSeconds || 0));
        if (sc6b.completed) localStorage.setItem('arkedo_completed_g6_scratch2', 'true');
      }

      // Grade 7 Lessons
      const g7w1 = profile.lessonsProgress.g7_word_a;
      if (g7w1) {
        localStorage.setItem('arkedo_g7w1_level', String(g7w1.level || 1));
        localStorage.setItem('arkedo_g7w1_score', String(g7w1.score || 0));
        localStorage.setItem('arkedo_g7w1_elapsed', String(g7w1.elapsedSeconds || 0));
        if (g7w1.completed) localStorage.setItem('arkedo_completed_g7_word_a', 'true');
      }
      const g7w2 = profile.lessonsProgress.g7_word_b;
      if (g7w2) {
        localStorage.setItem('arkedo_g7w2_level', String(g7w2.level || 1));
        localStorage.setItem('arkedo_g7w2_score', String(g7w2.score || 0));
        localStorage.setItem('arkedo_g7w2_elapsed', String(g7w2.elapsedSeconds || 0));
        if (g7w2.completed) localStorage.setItem('arkedo_completed_g7_word_b', 'true');
      }
      const g7a1 = profile.lessonsProgress.g7_audio_a;
      if (g7a1) {
        localStorage.setItem('arkedo_g7a1_level', String(g7a1.level || 1));
        localStorage.setItem('arkedo_g7a1_score', String(g7a1.score || 0));
        localStorage.setItem('arkedo_g7a1_elapsed', String(g7a1.elapsedSeconds || 0));
        if (g7a1.completed) localStorage.setItem('arkedo_completed_g7_audio_a', 'true');
      }
      const g7v2 = profile.lessonsProgress.g7_video_b;
      if (g7v2) {
        localStorage.setItem('arkedo_g7v2_level', String(g7v2.level || 1));
        localStorage.setItem('arkedo_g7v2_score', String(g7v2.score || 0));
        localStorage.setItem('arkedo_g7v2_elapsed', String(g7v2.elapsedSeconds || 0));
        if (g7v2.completed) localStorage.setItem('arkedo_completed_g7_video_b', 'true');
      }
      const g7c1 = profile.lessonsProgress.g7_cloud_a;
      if (g7c1) {
        localStorage.setItem('arkedo_g7c1_level', String(g7c1.level || 1));
        localStorage.setItem('arkedo_g7c1_score', String(g7c1.score || 0));
        localStorage.setItem('arkedo_g7c1_elapsed', String(g7c1.elapsedSeconds || 0));
        if (g7c1.completed) localStorage.setItem('arkedo_completed_g7_cloud_a', 'true');
      }
      const g7g1 = profile.lessonsProgress.g7_gis_b;
      if (g7g1) {
        localStorage.setItem('arkedo_g7g1_level', String(g7g1.level || 1));
        localStorage.setItem('arkedo_g7g1_score', String(g7g1.score || 0));
        localStorage.setItem('arkedo_g7g1_elapsed', String(g7g1.elapsedSeconds || 0));
        if (g7g1.completed) localStorage.setItem('arkedo_completed_g7_gis_b', 'true');
      }
      const g7cp1 = profile.lessonsProgress.g7_cpp_a;
      if (g7cp1) {
        localStorage.setItem('arkedo_g7cp1_level', String(g7cp1.level || 1));
        localStorage.setItem('arkedo_g7cp1_score', String(g7cp1.score || 0));
        localStorage.setItem('arkedo_g7cp1_elapsed', String(g7cp1.elapsedSeconds || 0));
        if (g7cp1.completed) localStorage.setItem('arkedo_completed_g7_cpp_a', 'true');
      }
      const g7cp2 = profile.lessonsProgress.g7_cpp_b;
      if (g7cp2) {
        localStorage.setItem('arkedo_g7cp2_level', String(g7cp2.level || 1));
        localStorage.setItem('arkedo_g7cp2_score', String(g7cp2.score || 0));
        localStorage.setItem('arkedo_g7cp2_elapsed', String(g7cp2.elapsedSeconds || 0));
        if (g7cp2.completed) localStorage.setItem('arkedo_completed_g7_cpp_b', 'true');
      }
      const g7dec = profile.lessonsProgress.g7_decision_a;
      if (g7dec) {
        localStorage.setItem('arkedo_g7dec_level', String(g7dec.level || 1));
        localStorage.setItem('arkedo_g7dec_score', String(g7dec.score || 0));
        localStorage.setItem('arkedo_g7dec_elapsed', String(g7dec.elapsedSeconds || 0));
        if (g7dec.completed) localStorage.setItem('arkedo_completed_g7_decision_a', 'true');
      }
      const g7loop = profile.lessonsProgress.g7_loop_b;
      if (g7loop) {
        localStorage.setItem('arkedo_g7loop_level', String(g7loop.level || 1));
        localStorage.setItem('arkedo_g7loop_score', String(g7loop.score || 0));
        localStorage.setItem('arkedo_g7loop_elapsed', String(g7loop.elapsedSeconds || 0));
        if (g7loop.completed) localStorage.setItem('arkedo_completed_g7_loop_b', 'true');
      }
      const g7stem = profile.lessonsProgress.g7_stem_a;
      if (g7stem) {
        localStorage.setItem('arkedo_g7stem_level', String(g7stem.level || 1));
        localStorage.setItem('arkedo_g7stem_score', String(g7stem.score || 0));
        localStorage.setItem('arkedo_g7stem_elapsed', String(g7stem.elapsedSeconds || 0));
        if (g7stem.completed) localStorage.setItem('arkedo_completed_g7_stem_a', 'true');
      }
      const g7robot = profile.lessonsProgress.g7_robot_b;
      if (g7robot) {
        localStorage.setItem('arkedo_g7robot_level', String(g7robot.level || 1));
        localStorage.setItem('arkedo_g7robot_score', String(g7robot.score || 0));
        localStorage.setItem('arkedo_g7robot_elapsed', String(g7robot.elapsedSeconds || 0));
        if (g7robot.completed) localStorage.setItem('arkedo_completed_g7_robot_b', 'true');
      }

      // Grade 8 Lessons
      const g8ca = profile.lessonsProgress.g8_calc_a;
      if (g8ca) {
        localStorage.setItem('arkedo_g8ca_level', String(g8ca.level || 1));
        localStorage.setItem('arkedo_g8ca_score', String(g8ca.score || 0));
        localStorage.setItem('arkedo_g8ca_elapsed', String(g8ca.elapsedSeconds || 0));
        if (g8ca.completed) localStorage.setItem('arkedo_completed_g8_calc_a', 'true');
      }
      const g8cb = profile.lessonsProgress.g8_calc_b;
      if (g8cb) {
        localStorage.setItem('arkedo_g8cb_level', String(g8cb.level || 1));
        localStorage.setItem('arkedo_g8cb_score', String(g8cb.score || 0));
        localStorage.setItem('arkedo_g8cb_elapsed', String(g8cb.elapsedSeconds || 0));
        if (g8cb.completed) localStorage.setItem('arkedo_completed_g8_calc_b', 'true');
      }
      const g8cc = profile.lessonsProgress.g8_calc_c;
      if (g8cc) {
        localStorage.setItem('arkedo_g8cc_level', String(g8cc.level || 1));
        localStorage.setItem('arkedo_g8cc_score', String(g8cc.score || 0));
        localStorage.setItem('arkedo_g8cc_elapsed', String(g8cc.elapsedSeconds || 0));
        if (g8cc.completed) localStorage.setItem('arkedo_completed_g8_calc_c', 'true');
      }
      const g8cd = profile.lessonsProgress.g8_calc_d;
      if (g8cd) {
        localStorage.setItem('arkedo_g8cd_level', String(g8cd.level || 1));
        localStorage.setItem('arkedo_g8cd_score', String(g8cd.score || 0));
        localStorage.setItem('arkedo_g8cd_elapsed', String(g8cd.elapsedSeconds || 0));
        if (g8cd.completed) localStorage.setItem('arkedo_completed_g8_calc_d', 'true');
      }
      const g8wa = profile.lessonsProgress.g8_web_a;
      if (g8wa) {
        localStorage.setItem('arkedo_g8wa_level', String(g8wa.level || 1));
        localStorage.setItem('arkedo_g8wa_score', String(g8wa.score || 0));
        localStorage.setItem('arkedo_g8wa_elapsed', String(g8wa.elapsedSeconds || 0));
        if (g8wa.completed) localStorage.setItem('arkedo_completed_g8_web_a', 'true');
      }
      const g8wb = profile.lessonsProgress.g8_web_b;
      if (g8wb) {
        localStorage.setItem('arkedo_g8wb_level', String(g8wb.level || 1));
        localStorage.setItem('arkedo_g8wb_score', String(g8wb.score || 0));
        localStorage.setItem('arkedo_g8wb_elapsed', String(g8wb.elapsedSeconds || 0));
        if (g8wb.completed) localStorage.setItem('arkedo_completed_g8_web_b', 'true');
      }
      const g8wc = profile.lessonsProgress.g8_web_c;
      if (g8wc) {
        localStorage.setItem('arkedo_g8wc_level', String(g8wc.level || 1));
        localStorage.setItem('arkedo_g8wc_score', String(g8wc.score || 0));
        localStorage.setItem('arkedo_g8wc_elapsed', String(g8wc.elapsedSeconds || 0));
        if (g8wc.completed) localStorage.setItem('arkedo_completed_g8_web_c', 'true');
      }
      const g8aa = profile.lessonsProgress.g8_algo_a;
      if (g8aa) {
        localStorage.setItem('arkedo_g8aa_level', String(g8aa.level || 1));
        localStorage.setItem('arkedo_g8aa_score', String(g8aa.score || 0));
        localStorage.setItem('arkedo_g8aa_elapsed', String(g8aa.elapsedSeconds || 0));
        if (g8aa.completed) localStorage.setItem('arkedo_completed_g8_algo_a', 'true');
      }
      const g8ab = profile.lessonsProgress.g8_algo_b;
      if (g8ab) {
        localStorage.setItem('arkedo_g8ab_level', String(g8ab.level || 1));
        localStorage.setItem('arkedo_g8ab_score', String(g8ab.score || 0));
        localStorage.setItem('arkedo_g8ab_elapsed', String(g8ab.elapsedSeconds || 0));
        if (g8ab.completed) localStorage.setItem('arkedo_completed_g8_algo_b', 'true');
      }
      const g8ac = profile.lessonsProgress.g8_algo_c;
      if (g8ac) {
        localStorage.setItem('arkedo_g8ac_level', String(g8ac.level || 1));
        localStorage.setItem('arkedo_g8ac_score', String(g8ac.score || 0));
        localStorage.setItem('arkedo_g8ac_elapsed', String(g8ac.elapsedSeconds || 0));
        if (g8ac.completed) localStorage.setItem('arkedo_completed_g8_algo_c', 'true');
      }
      const g8ad = profile.lessonsProgress.g8_algo_d;
      if (g8ad) {
        localStorage.setItem('arkedo_g8ad_level', String(g8ad.level || 1));
        localStorage.setItem('arkedo_g8ad_score', String(g8ad.score || 0));
        localStorage.setItem('arkedo_g8ad_elapsed', String(g8ad.elapsedSeconds || 0));
        if (g8ad.completed) localStorage.setItem('arkedo_completed_g8_algo_d', 'true');
      }
      const g8ae = profile.lessonsProgress.g8_algo_e;
      if (g8ae) {
        localStorage.setItem('arkedo_g8ae_level', String(g8ae.level || 1));
        localStorage.setItem('arkedo_g8ae_score', String(g8ae.score || 0));
        localStorage.setItem('arkedo_g8ae_elapsed', String(g8ae.elapsedSeconds || 0));
        if (g8ae.completed) localStorage.setItem('arkedo_completed_g8_algo_e', 'true');
      }
    }

    // Byte-Coins & Inventory & Equipped Items
    localStorage.setItem('arkedo_student_coins', String(profile.byteCoins ?? 100));
    if (profile.inventory) {
      localStorage.setItem('arkedo_student_inventory', JSON.stringify(profile.inventory));
    }
    if (profile.equipped) {
      localStorage.setItem('arkedo_equipped_items', JSON.stringify(profile.equipped));
    }
  } catch (err) {
    console.warn('Sync localstorage:', err);
  }
}

// ==================== SHOP & INVENTORY METHODS ====================

export function getByteCoins(): number {
  const current = getActiveStudent();
  if (current && typeof current.byteCoins === 'number') {
    return current.byteCoins;
  }
  try {
    const saved = localStorage.getItem('arkedo_student_coins');
    if (saved) return Number(saved);
  } catch {}
  return 100;
}

export async function addByteCoins(amount: number, reason?: string): Promise<number> {
  const currentCoins = getByteCoins();
  const nextCoins = Math.max(0, currentCoins + amount);
  try {
    localStorage.setItem('arkedo_student_coins', String(nextCoins));
  } catch {}

  const current = getActiveStudent();
  if (current) {
    const updated: StudentProfile = {
      ...current,
      byteCoins: nextCoins,
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updated);
    if (isCloudConnected && db && current.id) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          byteCoins: nextCoins,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Update coins Firestore:', err);
      }
    }
  }
  return nextCoins;
}

export function getStudentInventory(): StudentInventory {
  const current = getActiveStudent();
  if (current?.inventory) {
    return current.inventory;
  }
  try {
    const saved = localStorage.getItem('arkedo_student_inventory');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_INVENTORY;
}

export function getEquippedItems(): EquippedItems {
  const current = getActiveStudent();
  if (current?.equipped) {
    return current.equipped;
  }
  try {
    const saved = localStorage.getItem('arkedo_equipped_items');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_EQUIPPED;
}

export async function buyShopItem(itemId: string): Promise<{ success: boolean; error?: string; updatedCoins?: number; inventory?: StudentInventory }> {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, error: 'Obiectul nu a fost găsit în catalog.' };
  }

  const inventory = getStudentInventory();
  if (inventory.ownedItemIds.includes(itemId)) {
    return { success: false, error: 'Deții deja acest obiect în inventar!' };
  }

  const currentCoins = getByteCoins();
  if (currentCoins < item.price) {
    return { success: false, error: `Nu ai suficiente B-Coins! Îți lipsesc ${item.price - currentCoins} 🪙.` };
  }

  const updatedCoins = currentCoins - item.price;
  const updatedInventory: StudentInventory = {
    ...inventory,
    ownedItemIds: [...inventory.ownedItemIds, itemId]
  };

  try {
    localStorage.setItem('arkedo_student_coins', String(updatedCoins));
    localStorage.setItem('arkedo_student_inventory', JSON.stringify(updatedInventory));
  } catch {}

  const current = getActiveStudent();
  if (current) {
    const updated: StudentProfile = {
      ...current,
      byteCoins: updatedCoins,
      inventory: updatedInventory,
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updated);
    if (isCloudConnected && db && current.id) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          byteCoins: updatedCoins,
          inventory: updatedInventory,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare update inventar Firestore:', err);
      }
    }
  }

  return { success: true, updatedCoins, inventory: updatedInventory };
}

export async function equipShopItem(category: ShopCategory, itemId: string): Promise<{ success: boolean; equipped?: EquippedItems }> {
  const equipped = getEquippedItems();
  let updatedEquipped: EquippedItems = { ...equipped };

  if (category === 'arky_skin') {
    updatedEquipped.arkySkin = itemId.replace('skin_', '');
  } else if (category === 'theme') {
    updatedEquipped.theme = itemId.replace('theme_', '');
  } else if (category === 'title') {
    updatedEquipped.title = itemId === 'title_none' ? '' : itemId.replace('title_', '');
  } else if (category === 'avatar_frame') {
    updatedEquipped.avatarFrame = itemId.replace('frame_', '');
  }

  try {
    localStorage.setItem('arkedo_equipped_items', JSON.stringify(updatedEquipped));
  } catch {}

  const current = getActiveStudent();
  if (current) {
    const updated: StudentProfile = {
      ...current,
      equipped: updatedEquipped,
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updated);
    if (isCloudConnected && db && current.id) {
      try {
        await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
          equipped: updatedEquipped,
          lastActiveAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Eroare update echipare Firestore:', err);
      }
    }
  }

  return { success: true, equipped: updatedEquipped };
}

export async function openMysteryChest(): Promise<{ success: boolean; item?: ShopItem; bonusCoins?: number; error?: string }> {
  const inventory = getStudentInventory();
  const unownedItems = SHOP_ITEMS.filter((i) => !inventory.ownedItemIds.includes(i.id) && i.price > 0);

  if (unownedItems.length > 0) {
    const randomItem = unownedItems[Math.floor(Math.random() * unownedItems.length)];
    const updatedInventory: StudentInventory = {
      ...inventory,
      ownedItemIds: [...inventory.ownedItemIds, randomItem.id],
      openedMysteryBoxes: (inventory.openedMysteryBoxes || 0) + 1
    };

    try {
      localStorage.setItem('arkedo_student_inventory', JSON.stringify(updatedInventory));
    } catch {}

    const current = getActiveStudent();
    if (current) {
      const updated: StudentProfile = {
        ...current,
        inventory: updatedInventory,
        lastActiveAt: new Date().toISOString()
      };
      saveActiveStudentLocally(updated);
      if (isCloudConnected && db && current.id) {
        try {
          await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
            inventory: updatedInventory,
            lastActiveAt: new Date().toISOString()
          });
        } catch (err) {}
      }
    }

    return { success: true, item: randomItem };
  } else {
    const bonus = 100;
    await addByteCoins(bonus, 'Mystery Box Cashout');
    return { success: true, bonusCoins: bonus };
  }
}

export async function awardTeacherCoins(studentDocId: string, amount: number): Promise<boolean> {
  if (isCloudConnected && db && studentDocId) {
    try {
      const ref = doc(db, STUDENTS_COLLECTION, studentDocId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const currentCoins = Number(data.byteCoins || 0);
        const newCoins = Math.max(0, currentCoins + amount);
        await updateDoc(ref, {
          byteCoins: newCoins,
          lastActiveAt: new Date().toISOString()
        });
        return true;
      }
    } catch (err) {
      console.warn('Eroare acordare monede profesor:', err);
    }
  }
  return false;
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
      // 1. Update student document
      await updateDoc(doc(db, STUDENTS_COLLECTION, current.id), {
        [`arcadeScores.${gameKey}`]: newScore,
        'arcadeScores.totalArcade': updatedArcade.totalArcade,
        totalXP,
        lastActiveAt: new Date().toISOString()
      });

      // 2. Check if this is a new all-time high score in the global records document
      const currentGlobalRecord = inMemoryRecordsCache?.[gameKey]?.bestScore || 0;
      if (newScore > currentGlobalRecord) {
        const newRecord: GameRecord = {
          gameKey,
          bestScore: newScore,
          holderName: current.username,
          holderAvatar: current.avatar || '🎓'
        };

        if (inMemoryRecordsCache) {
          inMemoryRecordsCache[gameKey] = newRecord;
          if (gameKey === 'game2048') inMemoryRecordsCache['2048'] = newRecord;
          if (gameKey === 'detective') inMemoryRecordsCache['cyber'] = newRecord;
          if (gameKey === 'rgb_pixel') inMemoryRecordsCache['rgb_pixels'] = newRecord;
        }

        try {
          localStorage.setItem(LOCAL_RECORDS_CACHE_KEY, JSON.stringify(inMemoryRecordsCache || { [gameKey]: newRecord }));
        } catch {}

        await setDoc(doc(db, RECORDS_COLLECTION, GLOBAL_RECORDS_DOC), {
          records: {
            [gameKey]: newRecord
          },
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Eroare update score Firestore:', err);
    }
  }
}

export const updateActiveArcadeScore = updateStudentArcadeScore;

// UPDATE LESSON PROGRESS FOR LOGGED STUDENT
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

// SAVE & RETRIEVE STUDENT DIPLOMAS (PERSISTENCE TO FIRESTORE & LOCAL)
export async function saveStudentDiploma(diploma: StudentDiploma): Promise<boolean> {
  const current = getActiveStudent();
  const studentId = current?.id;

  // Persist locally in current student profile
  if (current) {
    const updatedDiplomas = {
      ...(current.diplomas || {}),
      [diploma.courseId]: diploma
    };
    const updatedProfile: StudentProfile = {
      ...current,
      diplomas: updatedDiplomas,
      lastActiveAt: new Date().toISOString()
    };
    saveActiveStudentLocally(updatedProfile);
  }

  // Also persist in dedicated local storage cache
  try {
    const raw = localStorage.getItem('arkedo_student_diplomas');
    const existing = raw ? JSON.parse(raw) : {};
    existing[diploma.courseId] = diploma;
    localStorage.setItem('arkedo_student_diplomas', JSON.stringify(existing));
  } catch (err) {
    console.warn('Eroare salvare diploma in cache local:', err);
  }

  // Synchronize to Cloud Firestore if connected and student is registered
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
    mouseDuelWins: (prevStats.mouseDuelWins || 0) + (isWinner && mode === 'mouse_duel' ? 1 : 0)
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
        list.push({ ...item, id: d.id, schoolId: item.schoolId || 'scoala_pilot_01' });
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

export interface GameRecord {
  gameKey: string;
  bestScore: number;
  holderName: string;
  holderAvatar: string;
}

// GET ALL-TIME RECORDS FOR EACH GAME (OPTIMIZED: 1 SINGLE DOCUMENT READ & MULTI-TIER CACHE)
export async function getGameAllTimeRecords(): Promise<Record<string, GameRecord>> {
  const now = Date.now();

  // 1. Return in-memory cache if valid (< 60 seconds)
  if (inMemoryRecordsCache && (now - lastRecordsFetchTimestamp < RECORDS_CACHE_TTL_MS)) {
    return inMemoryRecordsCache;
  }

  // 2. Load from localStorage cache initially
  let records: Record<string, GameRecord> = {};
  try {
    const saved = localStorage.getItem(LOCAL_RECORDS_CACHE_KEY);
    if (saved) {
      records = JSON.parse(saved);
    }
  } catch {}

  const current = getActiveStudent();
  const LOCAL_MAP: Record<string, string> = {
    typing: 'arkedo_highscore_typing',
    mouse: 'arkedo_highscore_mouse',
    mouse_v2: 'arkedo_highscore_mouse_v2',
    game2048: 'arkedo_highscore_2048',
    '2048': 'arkedo_highscore_2048',
    pcbuilder: 'arkedo_highscore_pcbuilder',
    detective: 'arkedo_highscore_cyber',
    cyber: 'arkedo_highscore_cyber',
    files: 'arkedo_highscore_files',
    binary_factory: 'arkedo_highscore_binary_factory',
    maze: 'arkedo_highscore_maze',
    firewall: 'arkedo_highscore_firewall',
    rgb_pixel: 'arkedo_highscore_rgb_pixels',
    rgb_pixels: 'arkedo_highscore_rgb_pixels',
    byte_slider: 'arkedo_highscore_byte_slider',
    file_drop: 'arkedo_highscore_file_drop',
    virus_sweeper: 'arkedo_highscore_virus_sweeper',
    cyber_dino: 'arkedo_highscore_cyber_dino',
    redstone_lab: 'arkedo_highscore_redstone_lab',
    voxel_architect: 'arkedo_highscore_voxel_architect',
    roblox_clicker: 'arkedo_highscore_roblox_clicker',
    page_craft: 'arkedo_highscore_page_craft',
  };

  // 3. If connected to Cloud Firestore, fetch ONLY 1 dedicated document
  if (isCloudConnected && db) {
    try {
      const recordsDocRef = doc(db, RECORDS_COLLECTION, GLOBAL_RECORDS_DOC);
      const recordsSnap = await getDoc(recordsDocRef);

      if (recordsSnap.exists()) {
        const cloudData = recordsSnap.data();
        const cloudRecords = (cloudData?.records || {}) as Record<string, GameRecord>;
        records = { ...records, ...cloudRecords };
      } else {
        // One-time bootstrap: scan students and seed the dedicated document
        const all = await getAllStudents();
        for (const k of ARCADE_GAME_KEYS) {
          let topScore = 0;
          let topHolder = '';
          let topAvatar = '🎓';

          for (const s of all) {
            const sScores = s.arcadeScores as unknown as Record<string, number> | undefined;
            const score = sScores?.[k] || (k === 'game2048' ? sScores?.['2048'] : 0) || (k === 'detective' ? sScores?.['cyber'] : 0) || (k === 'rgb_pixel' ? sScores?.['rgb_pixels'] : 0) || 0;
            if (score > topScore) {
              topScore = score;
              topHolder = s.username;
              topAvatar = s.avatar || '🎓';
            }
          }

          if (topScore > 0) {
            records[k] = {
              gameKey: k,
              bestScore: topScore,
              holderName: topHolder,
              holderAvatar: topAvatar
            };
          }
        }

        // Save initialized records into the dedicated Firestore document
        await setDoc(recordsDocRef, {
          records,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('⚠️ Eroare la încărcarea tabelului de recorduri:', err);
    }
  }

  // 4. Check local storage fallback for active player
  for (const k of ARCADE_GAME_KEYS) {
    try {
      const localKey = LOCAL_MAP[k];
      if (localKey) {
        const localScore = Number(localStorage.getItem(localKey) || '0');
        const currentRecord = records[k]?.bestScore || 0;
        if (localScore > currentRecord) {
          records[k] = {
            gameKey: k,
            bestScore: localScore,
            holderName: current?.username || localStorage.getItem('arkedo_student_name') || 'Campion Local',
            holderAvatar: current?.avatar || localStorage.getItem('arkedo_student_avatar') || '🎓'
          };
        }
      }
    } catch {}

    // Key aliases
    if (records[k]) {
      if (k === 'game2048') records['2048'] = records[k];
      if (k === 'detective') records['cyber'] = records[k];
      if (k === 'rgb_pixel') records['rgb_pixels'] = records[k];
    }
  }

  // 5. Update in-memory & localStorage caches
  inMemoryRecordsCache = records;
  lastRecordsFetchTimestamp = now;
  try {
    localStorage.setItem(LOCAL_RECORDS_CACHE_KEY, JSON.stringify(records));
  } catch {}

  return records;
}

// DELETE STUDENT ACCOUNT (TEACHER ACTION)
export async function deleteStudentAccount(studentId: string, username?: string): Promise<boolean> {
  const current = getActiveStudent();
  const cleanUser = (username || current?.username || '').trim().toLowerCase();

  // If currently active student matches deleted ID or username, log out & clear local profile
  if (current && (current.id === studentId || (cleanUser && current.username.trim().toLowerCase() === cleanUser))) {
    logoutStudent();
  }

  // Also clean up any lingering local name
  try {
    const savedLocalName = (localStorage.getItem('arkedo_student_name') || '').trim().toLowerCase();
    if (cleanUser && savedLocalName === cleanUser) {
      localStorage.removeItem('arkedo_student_name');
    }
  } catch {}

  // Also delete corresponding gradebook results in rezultate_tic
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
  missionKey?: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'graphics1' | 'graphics2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'all'
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
