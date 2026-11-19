import {
  AllMissionId,
  ArcadeScores,
  DailyQuestState,
  DailyStreakInfo,
  LessonsProgress,
  StudentDiploma,
  StudentProfile
} from '../types';
import {
  CarnetMissionMeta,
  CARNET_MISSIONS,
  MISSION_META_BY_ID
} from '../data/missionsRegistry';
import { ARCADE_REGISTRY } from '../data/arcadeRegistry';
import { computeGradeDetails } from '../utils/pedagogicalGrading';
import { StudentResult } from './resultsService';
import { saveStudentDiploma, getStudentDiplomas } from './studentAuthService';

export type { CarnetMissionMeta };
export { CARNET_MISSIONS, MISSION_META_BY_ID };

export interface MissionProgressSnapshot {
  meta: CarnetMissionMeta;
  status: 'completed' | 'in_progress' | 'not_started';
  level: number;
  score: number;
  nota: number;
  calificativRo: string;
  calificativEn: string;
  elapsedSeconds: number;
}

export function getMissionProgressSnapshot(
  meta: CarnetMissionMeta,
  profile: StudentProfile | null
): MissionProgressSnapshot {
  const lpEntry = profile?.lessonsProgress?.[meta.lessonsKey];

  let localCompleted = false;
  let localLevel = 1;
  let localScore = 0;
  let localElapsed = 0;

  try {
    localCompleted = localStorage.getItem(`arkedo_completed_${meta.id}`) === 'true';
    const rawLevel = localStorage.getItem(`arkedo_${meta.localPrefix}_level`);
    const rawScore = localStorage.getItem(`arkedo_${meta.localPrefix}_score`);
    const rawElapsed = localStorage.getItem(`arkedo_${meta.localPrefix}_elapsed`);
    if (rawLevel) localLevel = Math.max(1, Number(rawLevel) || 1);
    if (rawScore) localScore = Math.max(0, Number(rawScore) || 0);
    if (rawElapsed) localElapsed = Math.max(0, Number(rawElapsed) || 0);
  } catch {}

  const cloudCompleted = Boolean(lpEntry?.completed);
  const cloudLevel = lpEntry?.level || 1;
  const cloudScore = lpEntry?.score || 0;
  const cloudElapsed = lpEntry?.elapsedSeconds || 0;

  const level = Math.max(localLevel, cloudLevel);
  const completed = localCompleted || cloudCompleted || level > meta.maxLevels;
  const rawScore = Math.max(localScore, cloudScore);
  const score = completed && rawScore === 0 ? 100 : Math.min(100, rawScore);
  const elapsedSeconds = Math.max(localElapsed, cloudElapsed);

  const status: MissionProgressSnapshot['status'] = completed
    ? 'completed'
    : level > 1 || score > 0
    ? 'in_progress'
    : 'not_started';

  const gradeInfo = computeGradeDetails(score, meta.maxScore);

  return {
    meta,
    status,
    level,
    score,
    nota: status === 'not_started' ? 0 : gradeInfo.grade,
    calificativRo: gradeInfo.calificativRo,
    calificativEn: gradeInfo.calificativEn,
    elapsedSeconds,
  };
}

export function getAllMissionSnapshots(profile: StudentProfile | null): MissionProgressSnapshot[] {
  return CARNET_MISSIONS.map((m) => getMissionProgressSnapshot(m, profile));
}

export async function backfillMissingDiplomas(
  profile: StudentProfile | null,
  results: StudentResult[],
  fallbackStudentName: string
): Promise<Record<string, StudentDiploma>> {
  const existingDiplomas = getStudentDiplomas();
  const snapshots = getAllMissionSnapshots(profile);
  const displayName = (profile?.username || fallbackStudentName || 'Elev ArkyEdu').trim();

  let updated = { ...existingDiplomas };

  for (const snap of snapshots) {
    if (snap.status !== 'completed') continue;
    if (updated[snap.meta.id]) continue;

    // Look for a matching official result to enrich timestamp & score
    const matchingResult = results.find((r) => {
      const titleLower = (r.courseTitle || '').toLowerCase();
      return (
        titleLower.includes(snap.meta.id.toLowerCase()) ||
        titleLower.includes(snap.meta.moduleCode.toLowerCase()) ||
        titleLower.includes(snap.meta.titleRo.toLowerCase().slice(0, 14)) ||
        titleLower.includes(snap.meta.titleEn.toLowerCase().slice(0, 14))
      );
    });

    const bestScore = Math.max(snap.score, matchingResult?.score || 0) || 100;
    const gradeDetails = computeGradeDetails(bestScore, snap.meta.maxScore);
    const diploma: StudentDiploma = {
      id: snap.meta.id,
      courseId: snap.meta.id,
      titleRo: snap.meta.diplomaTitleRo,
      titleEn: snap.meta.diplomaTitleEn,
      grade: snap.meta.gradeLabelRo,
      studentName: displayName,
      awardedAt: profile?.lastActiveAt || new Date().toISOString(),
      score: bestScore,
      maxScore: snap.meta.maxScore,
      calificativ: gradeDetails.calificativRo,
      timeSpentSeconds: Math.max(snap.elapsedSeconds, matchingResult?.elapsedSeconds || 0),
      officialRef: `ARKY-${snap.meta.gradeNum}-${snap.meta.moduleCode}-${bestScore}`
    };

    updated[snap.meta.id] = diploma;
    await saveStudentDiploma(diploma);
  }

  return updated;
}

export interface ArcadeGameCatalogEntry {
  key: keyof Omit<ArcadeScores, 'totalArcade'>;
  nameRo: string;
  nameEn: string;
  emoji: string;
  category: 'retro' | 'logic' | 'cyber' | 'agility';
  unitLabel?: string;
}

export const ARCADE_CATALOG_ENTRIES: ArcadeGameCatalogEntry[] = ARCADE_REGISTRY.map((g) => ({
  key: g.scoreKey,
  nameRo: g.nameRo,
  nameEn: g.nameEn,
  emoji: g.icon,
  category: g.category,
  ...(g.unitLabel ? { unitLabel: g.unitLabel } : {}),
}));

export interface CarnetBadgeDef {
  id: string;
  emoji: string;
  titleRo: string;
  titleEn: string;
  descRo: string;
  descEn: string;
  unlocked: boolean;
  current: number;
  target: number;
  accent: 'emerald' | 'amber' | 'cyan' | 'purple' | 'rose' | 'teal';
}

export function getSandboxSolvedCount(): number {
  try {
    const raw = localStorage.getItem('arkedo_sandbox_solved_ids');
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export function computeCarnetBadges(params: {
  snapshots: MissionProgressSnapshot[];
  arcadeScores: Partial<ArcadeScores>;
  duelWins: number;
  cityScore: number;
  sandboxSolvedCount: number;
  streakBest: number;
  diplomasCount: number;
  averageNota: number;
}): CarnetBadgeDef[] {
  const completedAll = params.snapshots.filter((s) => s.status === 'completed');
  const g5Done = completedAll.filter((s) => s.meta.gradeNum === 5).length;
  const g6Done = completedAll.filter((s) => s.meta.gradeNum === 6).length;
  const g7Done = completedAll.filter((s) => s.meta.gradeNum === 7).length;
  const g8Done = completedAll.filter((s) => s.meta.gradeNum === 8).length;

  const arcadeGamesPlayed = ARCADE_CATALOG_ENTRIES.filter(
    (g) => Number(params.arcadeScores?.[g.key] || 0) > 0
  ).length;

  return [
    {
      id: 'first_mission',
      emoji: '🚀',
      titleRo: 'Primul Pas în TIC',
      titleEn: 'First Step in ICT',
      descRo: 'Finalizează prima ta misiune oficială',
      descEn: 'Complete your first official mission',
      unlocked: completedAll.length >= 1,
      current: Math.min(1, completedAll.length),
      target: 1,
      accent: 'emerald',
    },
    {
      id: 'grade5_master',
      emoji: '🏫',
      titleRo: 'Campion Clasa a V-a',
      titleEn: '5th Grade Champion',
      descRo: 'Finalizează toate cele 10 misiuni de Clasa a V-a',
      descEn: 'Complete all 10 Grade 5 missions',
      unlocked: g5Done >= 10,
      current: g5Done,
      target: 10,
      accent: 'teal',
    },
    {
      id: 'grade6_master',
      emoji: '📽️',
      titleRo: 'Explorator Clasa a VI-a',
      titleEn: '6th Grade Explorer',
      descRo: 'Finalizează toate cele 8 misiuni de Clasa a VI-a',
      descEn: 'Complete all 8 Grade 6 missions',
      unlocked: g6Done >= 8,
      current: g6Done,
      target: 8,
      accent: 'cyan',
    },
    {
      id: 'grade7_master',
      emoji: '⚙️',
      titleRo: 'Programator Clasa a VII-a',
      titleEn: '7th Grade Coder',
      descRo: 'Finalizează toate cele 12 misiuni de Clasa a VII-a',
      descEn: 'Complete all 12 Grade 7 missions',
      unlocked: g7Done >= 12,
      current: g7Done,
      target: 12,
      accent: 'purple',
    },
    {
      id: 'grade8_master',
      emoji: '🎓',
      titleRo: 'Absolvent de Onoare VIII',
      titleEn: '8th Grade Honors',
      descRo: 'Finalizează toate cele 14 misiuni de Clasa a VIII-a',
      descEn: 'Complete all 14 Grade 8 missions',
      unlocked: g8Done >= 14,
      current: g8Done,
      target: 14,
      accent: 'amber',
    },
    {
      id: 'honor_roll',
      emoji: '⭐',
      titleRo: 'Elev de Nota 9+',
      titleEn: 'Honor Roll 9+',
      descRo: 'Obține media generală ≥ 9.00 (min. 2 misiuni)',
      descEn: 'Achieve ≥ 9.00 GPA (min. 2 missions)',
      unlocked: completedAll.length >= 2 && params.averageNota >= 9,
      current: completedAll.length >= 2 ? Math.min(10, Math.round(params.averageNota)) : 0,
      target: 9,
      accent: 'amber',
    },
    {
      id: 'diploma_collector',
      emoji: '🏅',
      titleRo: 'Colecționar de Diplome',
      titleEn: 'Diploma Collector',
      descRo: 'Strânge cel puțin 5 diplome oficiale ArkyEdu',
      descEn: 'Collect at least 5 official ArkyEdu diplomas',
      unlocked: params.diplomasCount >= 5,
      current: Math.min(5, params.diplomasCount),
      target: 5,
      accent: 'emerald',
    },
    {
      id: 'arcade_explorer',
      emoji: '🕹️',
      titleRo: 'Maestru Arcade',
      titleEn: 'Arcade Master',
      descRo: 'Înregistrează scoruri în cel puțin 6 jocuri Arcade',
      descEn: 'Record scores in at least 6 Arcade games',
      unlocked: arcadeGamesPlayed >= 6,
      current: Math.min(6, arcadeGamesPlayed),
      target: 6,
      accent: 'purple',
    },
    {
      id: 'duel_gladiator',
      emoji: '⚔️',
      titleRo: 'Gladiator Arena 1v1',
      titleEn: '1v1 Arena Gladiator',
      descRo: 'Câștigă cel puțin 3 dueluri multiplayer 1v1',
      descEn: 'Win at least 3 multiplayer 1v1 duels',
      unlocked: params.duelWins >= 3,
      current: Math.min(3, params.duelWins),
      target: 3,
      accent: 'rose',
    },
    {
      id: 'city_mayor',
      emoji: '🏙️',
      titleRo: 'Primar Smart City',
      titleEn: 'Smart City Mayor',
      descRo: 'Dezvoltă Orașul tău Cyber la peste 500 puncte',
      descEn: 'Grow your Cyber City past 500 points',
      unlocked: params.cityScore >= 500,
      current: Math.min(500, params.cityScore),
      target: 500,
      accent: 'cyan',
    },
    {
      id: 'sandbox_coder',
      emoji: '💻',
      titleRo: 'Creator Code Sandbox',
      titleEn: 'Code Sandbox Creator',
      descRo: 'Rezolvă cel puțin 3 provocări C++/Python/HTML',
      descEn: 'Solve at least 3 C++/Python/HTML challenges',
      unlocked: params.sandboxSolvedCount >= 3,
      current: Math.min(3, params.sandboxSolvedCount),
      target: 3,
      accent: 'teal',
    },
    {
      id: 'streak_hero',
      emoji: '🔥',
      titleRo: 'Constanță Exemplară',
      titleEn: 'Consistency Hero',
      descRo: 'Menține o serie activă de 5 zile consecutive',
      descEn: 'Reach a 5-day consecutive activity streak',
      unlocked: params.streakBest >= 5,
      current: Math.min(5, params.streakBest),
      target: 5,
      accent: 'amber',
    },
  ];
}

export interface DailyQuestDisplayItem {
  id: string;
  emoji: string;
  titleRo: string;
  titleEn: string;
  descRo: string;
  descEn: string;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
}

export function buildDailyQuestsDisplay(
  streak: DailyStreakInfo,
  quests: DailyQuestState
): DailyQuestDisplayItem[] {
  const checkedInToday = streak.lastActiveDate === quests.date || Boolean(quests.visitedCarnetToday);
  return [
    {
      id: 'daily_checkin',
      emoji: '📅',
      titleRo: 'Prezență Zilnică în Carnet',
      titleEn: 'Daily Portfolio Check-in',
      descRo: 'Verifică-ți progresul și menține seria activă',
      descEn: 'Review your progress and keep your streak alive',
      rewardCoins: 25,
      completed: checkedInToday,
      claimed: quests.claimedIds.includes('daily_checkin'),
    },
    {
      id: 'daily_arcade',
      emoji: '🕹️',
      titleRo: 'Antrenament Rapid Arcade',
      titleEn: 'Quick Arcade Warm-up',
      descRo: 'Înregistrează un scor nou în sala Arcade',
      descEn: 'Record a score in the Arcade Hub today',
      rewardCoins: 35,
      completed: Boolean(quests.playedArcadeToday),
      claimed: quests.claimedIds.includes('daily_arcade'),
    },
    {
      id: 'daily_mission',
      emoji: '🎓',
      titleRo: 'Misiune TIC Finalizată',
      titleEn: 'Complete an ICT Mission',
      descRo: 'Finalizează o lecție sau evaluare din catalog',
      descEn: 'Finish a curriculum mission or test today',
      rewardCoins: 60,
      completed: Boolean(quests.completedLessonToday),
      claimed: quests.claimedIds.includes('daily_mission'),
    },
  ];
}
