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
  hacker_defense?: number;
  cyber_snake?: number;
  totalArcade: number;
}

export type AllMissionId =
  | 'hardware'
  | 'files'
  | 'internet1'
  | 'internet2'
  | 'text1'
  | 'text2'
  | 'algo1'
  | 'algo2'
  | 'scratch1'
  | 'scratch2'
  | 'g6_presentation1'
  | 'g6_presentation2'
  | 'g6_paint3d'
  | 'g6_anim3d'
  | 'g6_malware'
  | 'g6_email'
  | 'g6_scratch1'
  | 'g6_scratch2'
  | 'g7_word_a'
  | 'g7_word_b'
  | 'g7_audio_a'
  | 'g7_video_b'
  | 'g7_cloud_a'
  | 'g7_gis_b'
  | 'g7_cpp_a'
  | 'g7_cpp_b'
  | 'g7_decision_a'
  | 'g7_loop_b'
  | 'g7_stem_a'
  | 'g7_robot_b'
  | 'g8_calc_a'
  | 'g8_calc_b'
  | 'g8_calc_c'
  | 'g8_calc_d'
  | 'g8_web_a'
  | 'g8_web_b'
  | 'g8_web_c'
  | 'g8_algo_a'
  | 'g8_algo_b'
  | 'g8_algo_c'
  | 'g8_algo_d'
  | 'g8_algo_e';

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
  algo1?: LessonMissionState;
  algo2?: LessonMissionState;
  scratch1?: LessonMissionState;
  scratch2?: LessonMissionState;
  presentation1?: LessonMissionState;
  presentation2?: LessonMissionState;
  model3d1?: LessonMissionState;
  model3d2?: LessonMissionState;
  cyber6a?: LessonMissionState;
  cyber6b?: LessonMissionState;
  scratch6a?: LessonMissionState;
  scratch6b?: LessonMissionState;
  g7_word_a?: LessonMissionState;
  g7_word_b?: LessonMissionState;
  g7_audio_a?: LessonMissionState;
  g7_video_b?: LessonMissionState;
  g7_cloud_a?: LessonMissionState;
  g7_gis_b?: LessonMissionState;
  g7_cpp_a?: LessonMissionState;
  g7_cpp_b?: LessonMissionState;
  g7_decision_a?: LessonMissionState;
  g7_loop_b?: LessonMissionState;
  g7_stem_a?: LessonMissionState;
  g7_robot_b?: LessonMissionState;
  g8_calc_a?: LessonMissionState;
  g8_calc_b?: LessonMissionState;
  g8_calc_c?: LessonMissionState;
  g8_calc_d?: LessonMissionState;
  g8_web_a?: LessonMissionState;
  g8_web_b?: LessonMissionState;
  g8_web_c?: LessonMissionState;
  g8_algo_a?: LessonMissionState;
  g8_algo_b?: LessonMissionState;
  g8_algo_c?: LessonMissionState;
  g8_algo_d?: LessonMissionState;
  g8_algo_e?: LessonMissionState;
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
  hackerDefenseWins?: number;
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
  requiredModule?: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'presentation1' | 'presentation2';
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

export type BuildingCategory =
  | 'computing'
  | 'networking'
  | 'energy'
  | 'education'
  | 'security'
  | 'media'
  | 'infrastructure';

export interface CityBuilding {
  tileIndex: number; // 0 to gridSize*gridSize - 1
  typeId: string; // e.g. 'datacenter', 'solar_matrix', '5g_tower', etc.
  level: number; // 1 to 5
  customName?: string;
  builtAt: number;
  lastUpgradedAt: number;
}

export interface CityMetrics {
  computingPowerTFlops: number;
  cloudStoragePB: number;
  bandwidthTbps: number;
  ecoScore: number;
  securityRating: number;
  totalPopulation: number;
  cityScore: number;
  cityRankTitle: string;
  cityRankTitleRo?: string;
  cityRankTitleEn?: string;
}

export interface CityIncident {
  id: string;
  type: 'traffic_spike' | 'phishing_threat' | 'data_recovery' | 'eco_audit' | 'quantum_surge';
  titleRo: string;
  titleEn: string;
  descRo: string;
  descEn: string;
  tileIndex: number;
  rewardCoins: number;
  rewardXP: number;
  expiresAt: number;
}

export interface CyberCityData {
  id: string;
  studentId: string;
  studentName: string;
  cityName: string;
  gridSize: number; // default 5 (5x5 = 25 tiles)
  buildings: Record<number, CityBuilding>;
  likesCount: number;
  totalUpgradesDone: number;
  activeIncidents?: CityIncident[];
  resolvedIncidentsCount: number;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  demoLabelRo?: string;
  demoLabelEn?: string;
}

export interface StudentDiploma {
  id: string; // e.g. 'g6_presentation1', 'g6_scratch2'
  courseId: string;
  titleRo: string;
  titleEn: string;
  grade: 'Clasa a V-a' | 'Clasa a VI-a' | 'Clasa a VII-a';
  studentName: string;
  userEmail?: string;
  awardedAt: string; // ISO format
  score: number;
  maxScore: number;
  calificativ: string;
  timeSpentSeconds: number;
  officialRef?: string;
}

export interface StudentProfile {
  id: string;
  username: string;
  usernameLower: string;
  passwordHash: string;
  avatar: string;
  schoolId?: string;
  classGrade?: string; // e.g. '5', '6', '7' or '7A'
  isSuspended?: boolean;
  arcadeScores: ArcadeScores;
  lessonsProgress: LessonsProgress;
  duelStats?: DuelStats;
  byteCoins?: number;
  inventory?: StudentInventory;
  equipped?: EquippedItems;
  cyberCity?: CyberCityData;
  diplomas?: Record<string, StudentDiploma>;
  totalXP: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  active: boolean;
  createdAt: number;
  notes?: string;
}

export interface Teacher {
  id: string;
  email: string;
  name: string;
  schoolId: string;
  schoolName?: string;
  role: 'teacher';
  approved: boolean;
  createdAt: number;
  lastLogin?: number;
}

export interface SuperAdminUser {
  uid: string;
  email: string;
  name: string;
  role: 'superadmin';
  createdAt: number;
  lastLogin: number;
}


