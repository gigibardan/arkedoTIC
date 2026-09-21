export type GameLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // 6 is hardware victory, 8 is files victory

export type Language = 'ro' | 'en';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface VirtualItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  extension?: string;
  size?: string;
  modifiedDate?: string;
  isDeleted?: boolean;
}

export interface GameState {
  currentLevel: GameLevel;
  score: number;
  maxScore: number;
  soundEnabled: boolean;
  studentName: string;
  badges: Badge[];
  level1Completed: boolean;
  level2Completed: boolean;
  level3Completed: boolean;
  level4Completed: boolean;
  level5Completed: boolean;
}

export interface ArcadeScores {
  typing: number;
  mouse: number;
  game2048: number;
  pcbuilder: number;
  detective: number;
  files: number;
  binary_factory: number;
  maze: number;
  firewall: number;
  rgb_pixel: number;
  byte_slider?: number;
  file_drop?: number;
  virus_sweeper?: number;
  cyber_dino?: number;
  totalArcade: number;
}

export interface LessonMissionState {
  completed: boolean;
  level: number;
  score: number;
  elapsedSeconds: number;
}

export interface LessonsProgress {
  hardware: LessonMissionState;
  files: LessonMissionState;
  internet1: LessonMissionState;
  internet2: LessonMissionState;
  totalLessonScore: number;
}

export interface DuelStats {
  wins: number;
  losses: number;
  matchesPlayed: number;
  duelPoints: number;
  cyberSprintWins?: number;
  quizBlitzWins?: number;
  cyberShieldWins?: number;
  pcRushWins?: number;
}

export interface StudentProfile {
  id: string;
  username: string;
  usernameLower: string;
  passwordHash: string;
  avatar: string;
  arcadeScores: ArcadeScores;
  lessonsProgress: LessonsProgress;
  duelStats?: DuelStats;
  totalXP: number;
  createdAt: string;
  lastActiveAt: string;
}

