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
  redstone_lab?: number;
  voxel_architect?: number;
  roblox_clicker?: number;
  mouse_v2?: number;
  page_craft?: number;
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
  text1?: LessonMissionState;
  text2?: LessonMissionState;
  graphics1?: LessonMissionState;
  graphics2?: LessonMissionState;
  totalLessonScore: number;
}

export interface DuelStats {
  wins: number;
  losses: number;
  matchesPlayed: number;
  duelPoints: number;
  cyberSprintWins?: number;
  blockCodingWins?: number;
  speedCraftingWins?: number;
  quizBlitzWins?: number;
  cyberShieldWins?: number;
  pcRushWins?: number;
  mouseDuelWins?: number;
}

export type ShopCategory = 'arky_skin' | 'theme' | 'title' | 'avatar_frame';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  category: ShopCategory;
  nameRo: string;
  nameEn: string;
  descRo: string;
  descEn: string;
  icon: string;
  price: number;
  rarity: ItemRarity;
  requiredModule?: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2';
  requiredLevel?: number;
  previewCss?: string;
  previewAsset?: string;
  badgeLabel?: string;
}

export interface StudentInventory {
  ownedItemIds: string[];
  openedMysteryBoxes?: number;
  unlockedMilestones?: string[];
}

export interface EquippedItems {
  arkySkin: string; // 'default' | 'cyber' | 'scholar' | 'astronaut' | 'gamer' | 'eco' | 'wizard'
  theme: string;    // 'default' | 'matrix' | 'synthwave' | 'win98' | 'emerald' | 'nebula' | 'sunset'
  title: string;    // title string or ''
  avatarFrame: string; // 'none' | 'fire' | 'neon' | 'gold' | 'diamond' | 'emerald'
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
  byteCoins?: number;
  inventory?: StudentInventory;
  equipped?: EquippedItems;
  totalXP: number;
  createdAt: string;
  lastActiveAt: string;
}

