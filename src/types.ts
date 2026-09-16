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

