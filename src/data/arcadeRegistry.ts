import { ArcadeScores } from '../types';

export type ArcadeCategoryId = 'retro' | 'logic' | 'cyber' | 'agility';

export interface ArcadeGameRegistryEntry {
  /** Key used inside StudentProfile.arcadeScores & DEFAULT_ARCADE_SCORES */
  scoreKey: keyof Omit<ArcadeScores, 'totalArcade'>;
  /** ID used in ALL_GAMES (gameControlService.ts) and ArcadeHub activeGame state */
  controlId: string;
  /** Exact localStorage key used by the game component for highscores */
  localStorageKey: string;
  /** Legacy aliases used in older local records or score lookups */
  legacyAliases?: string[];
  icon: string;
  nameRo: string;
  nameEn: string;
  /** Concise label shown in TeacherScoreModal */
  teacherNameRo: string;
  teacherNameEn: string;
  badgeRo?: string;
  badgeEn?: string;
  category: ArcadeCategoryId;
  unitLabel?: string;
  /** Maximum fair XP this game contributes to totalArcade */
  xpCap: number;
  /** Optional custom score-to-XP normalizer (applied before xpCap) */
  normalizeXP?: (rawScore: number) => number;
  /** Optional score threshold flagged as suspicious in TeacherScoreModal */
  suspiciousThreshold?: number;
}

export const ARCADE_REGISTRY: ArcadeGameRegistryEntry[] = [
  {
    scoreKey: 'vice_leonida_world',
    controlId: 'vice_leonida_world',
    localStorageKey: 'arkedo_highscore_vice_leonida_world',
    icon: '🗺️',
    nameRo: 'Vice Leonida: Open World',
    nameEn: 'Vice Leonida: Open World',
    teacherNameRo: 'Vice Leonida: Open World GTA 6 (6 Regiuni)',
    teacherNameEn: 'Vice Leonida: Open World GTA 6 (6 Regions)',
    badgeRo: 'OPEN WORLD 🔥',
    badgeEn: 'OPEN WORLD 🔥',
    category: 'cyber',
    xpCap: 3500,
  },
  {
    scoreKey: 'vice_leonida',
    controlId: 'vice_leonida',
    localStorageKey: 'arkedo_highscore_vice_leonida',
    icon: '🌴',
    nameRo: 'Vice Leonida VI: Cyber Run',
    nameEn: 'Vice Leonida VI: Cyber Run',
    teacherNameRo: 'Vice Leonida VI: Cyber Runner (GTA 6 Tech)',
    teacherNameEn: 'Vice Leonida VI: Cyber Runner (GTA 6 Tech)',
    badgeRo: 'NOU 🔥',
    badgeEn: 'NEW 🔥',
    category: 'cyber',
    xpCap: 3000,
  },
  {
    scoreKey: 'cyber_asteroids',
    controlId: 'cyber_asteroids',
    localStorageKey: 'arkedo_highscore_cyber_asteroids',
    icon: '☄️',
    nameRo: 'Cyber Asteroids 1979',
    nameEn: 'Cyber Asteroids 1979',
    teacherNameRo: 'Cyber Asteroids: Reactorul Vectorial',
    teacherNameEn: 'Cyber Asteroids: Vector Command',
    badgeRo: 'NOU 🔥',
    badgeEn: 'NEW 🔥',
    category: 'retro',
    xpCap: 2500,
  },
  {
    scoreKey: 'cyber_sokoban',
    controlId: 'cyber_sokoban',
    localStorageKey: 'arkedo_highscore_cyber_sokoban',
    icon: '🤖',
    nameRo: 'Cyber Sokoban Server',
    nameEn: 'Cyber Sokoban Server',
    teacherNameRo: 'Cyber Sokoban: Inginerul de Servere',
    teacherNameEn: 'Cyber Sokoban: Data Center Architect',
    badgeRo: 'HOT 🔥',
    badgeEn: 'HOT 🔥',
    category: 'retro',
    xpCap: 2500,
  },
  {
    scoreKey: 'cyber_frogger',
    controlId: 'cyber_frogger',
    localStorageKey: 'arkedo_highscore_cyber_frogger',
    icon: '🐸',
    nameRo: 'Cyber Frogger Network',
    nameEn: 'Cyber Frogger Network',
    teacherNameRo: 'Cyber Frogger: Traversarea Rețelei',
    teacherNameEn: 'Cyber Frogger: Network Hopper',
    badgeRo: 'HOT 🔥',
    badgeEn: 'HOT 🔥',
    category: 'retro',
    xpCap: 2500,
  },
  {
    scoreKey: 'cyber_arkanoid',
    controlId: 'cyber_arkanoid',
    localStorageKey: 'arkedo_highscore_cyber_arkanoid',
    icon: '🧱',
    nameRo: 'Cyber Arkanoid',
    nameEn: 'Cyber Arkanoid',
    teacherNameRo: 'Cyber Arkanoid: Spărgătorul de Firewall',
    teacherNameEn: 'Cyber Arkanoid: Firewall Breaker',
    badgeRo: 'HOT 🔥',
    badgeEn: 'HOT 🔥',
    category: 'retro',
    xpCap: 2500,
  },
  {
    scoreKey: 'cyber_pacman',
    controlId: 'cyber_pacman',
    localStorageKey: 'arkedo_highscore_cyber_pacman',
    icon: '🟡',
    nameRo: 'Cyber Pac-Man Bit',
    nameEn: 'Cyber Pac-Man Bit',
    teacherNameRo: 'Cyber Pac-Man: Labirintul Biților',
    teacherNameEn: 'Cyber Pac-Man: Motherboard Maze',
    badgeRo: 'NOU 🔥',
    badgeEn: 'LEGEND 🔥',
    category: 'retro',
    xpCap: 2500,
  },
  {
    scoreKey: 'cyber_invaders',
    controlId: 'cyber_invaders',
    localStorageKey: 'arkedo_highscore_cyber_invaders',
    icon: '🚀',
    nameRo: 'Cyber Space Invaders',
    nameEn: 'Cyber Space Invaders',
    teacherNameRo: 'Cyber Invaders: Galaxia Codului',
    teacherNameEn: 'Cyber Invaders: Space Arcade',
    badgeRo: 'HOT 🔥',
    badgeEn: 'HOT 🔥',
    category: 'retro',
    xpCap: 2500,
  },
  {
    scoreKey: 'roblox_clicker',
    controlId: 'roblox_clicker',
    localStorageKey: 'arkedo_highscore_roblox_clicker',
    icon: '🟥',
    nameRo: 'Roblox Clicker Arena',
    nameEn: 'Roblox Clicker Arena',
    teacherNameRo: 'Roblox Blox Clicker Duel (1v1)',
    teacherNameEn: 'Roblox Blox Clicker (1v1)',
    badgeRo: 'Roblox',
    badgeEn: 'Roblox',
    category: 'agility',
    xpCap: 1000,
    normalizeXP: (raw) => (raw > 1000 ? Math.round(raw / 5) : raw),
  },
  {
    scoreKey: 'voxel_architect',
    controlId: 'voxel_architect',
    localStorageKey: 'arkedo_highscore_voxel_architect',
    icon: '⛏️',
    nameRo: 'Minecraft Voxel Architect',
    nameEn: 'Minecraft Voxel Architect',
    teacherNameRo: 'Voxel Architect: Calculatoare Minecraft',
    teacherNameEn: 'Voxel Architect (Minecraft CS)',
    badgeRo: 'Complex',
    badgeEn: 'Ultimate',
    category: 'cyber',
    xpCap: 3000,
  },
  {
    scoreKey: 'redstone_lab',
    controlId: 'redstone_lab',
    localStorageKey: 'arkedo_highscore_redstone_lab',
    icon: '🔴',
    nameRo: 'Redstone Logic Lab',
    nameEn: 'Redstone Logic Lab',
    teacherNameRo: 'Circuite Redstone (Minecraft TIC)',
    teacherNameEn: 'Redstone Logic Lab',
    badgeRo: 'Minecraft',
    badgeEn: 'Minecraft',
    category: 'logic',
    xpCap: 2500,
  },
  {
    scoreKey: 'cyber_dino',
    controlId: 'cyber_dino',
    localStorageKey: 'arkedo_highscore_cyber_dino',
    icon: '🦖',
    nameRo: 'Cyber Dino Matrix',
    nameEn: 'Cyber Dino Matrix',
    teacherNameRo: 'Cyber Dino: Matrix Rush',
    teacherNameEn: 'Cyber Dino Rush',
    badgeRo: 'Nou',
    badgeEn: 'New',
    category: 'retro',
    xpCap: 1800,
    suspiciousThreshold: 50000,
  },
  {
    scoreKey: 'typing',
    controlId: 'typing',
    localStorageKey: 'arkedo_highscore_typing',
    icon: '⌨️',
    nameRo: 'Vitezomanul Tastaturii',
    nameEn: 'Keyboard Speedster',
    teacherNameRo: 'Cursa de Tastare Rapidă (WPM)',
    teacherNameEn: 'Typing Speed (WPM)',
    category: 'agility',
    unitLabel: 'WPM',
    xpCap: 2500,
    normalizeXP: (raw) => (raw <= 250 ? raw * 25 : raw),
    suspiciousThreshold: 250,
  },
  {
    scoreKey: 'mouse',
    controlId: 'mouse',
    localStorageKey: 'arkedo_highscore_mouse',
    icon: '🖱️',
    nameRo: 'Maestrul Mouse-ului',
    nameEn: 'Mouse Agility Master',
    teacherNameRo: 'Maestrul Mouse-ului v1',
    teacherNameEn: 'Mouse Reflex Master v1',
    category: 'agility',
    xpCap: 1000,
  },
  {
    scoreKey: 'mouse_v2',
    controlId: 'mouse_v2',
    localStorageKey: 'arkedo_highscore_mouse_v2',
    icon: '⚡',
    nameRo: 'Mouse Master 2.0 PRO',
    nameEn: 'Mouse Master 2.0 PRO',
    teacherNameRo: 'Maestrul Mouse-ului 2.0 (Clicker)',
    teacherNameEn: 'Mouse Master Pro 2.0 (Clicker)',
    badgeRo: 'PRO',
    badgeEn: 'PRO',
    category: 'agility',
    xpCap: 1200,
  },
  {
    scoreKey: 'game2048',
    controlId: '2048',
    localStorageKey: 'arkedo_highscore_2048',
    legacyAliases: ['2048'],
    icon: '🔢',
    nameRo: '2048 Bitwise',
    nameEn: '2048 Bitwise',
    teacherNameRo: '2048 Bitwise Edition',
    teacherNameEn: '2048 Bitwise Edition',
    category: 'logic',
    xpCap: 2500,
    normalizeXP: (raw) => (raw > 2500 ? Math.round(raw / 10) : raw),
    suspiciousThreshold: 200000,
  },
  {
    scoreKey: 'virus_sweeper',
    controlId: 'virus_sweeper',
    localStorageKey: 'arkedo_highscore_virus_sweeper',
    icon: '💣',
    nameRo: 'Virus Sweeper',
    nameEn: 'Virus Sweeper',
    teacherNameRo: 'Căutătorul de Viruși',
    teacherNameEn: 'Virus Sweeper (Mines)',
    category: 'cyber',
    xpCap: 1800,
  },
  {
    scoreKey: 'file_drop',
    controlId: 'file_drop',
    localStorageKey: 'arkedo_highscore_file_drop',
    icon: '📥',
    nameRo: 'File-Drop Tetris',
    nameEn: 'File-Drop Tetris',
    teacherNameRo: 'File-Drop (Tetris Extensii)',
    teacherNameEn: 'File-Drop (Tetris)',
    category: 'agility',
    xpCap: 1800,
  },
  {
    scoreKey: 'byte_slider',
    controlId: 'byte_slider',
    localStorageKey: 'arkedo_highscore_byte_slider',
    icon: '🧩',
    nameRo: 'Byte Slider Puzzle',
    nameEn: 'Byte Slider Puzzle',
    teacherNameRo: 'Byte Slider (Conversii)',
    teacherNameEn: 'Byte Slider (1024 KB)',
    category: 'logic',
    xpCap: 1500,
  },
  {
    scoreKey: 'rgb_pixel',
    controlId: 'rgb_pixel',
    localStorageKey: 'arkedo_highscore_rgb_pixels',
    legacyAliases: ['rgb_pixels'],
    icon: '🎨',
    nameRo: 'RGB Pixel Master',
    nameEn: 'RGB Pixel Master',
    teacherNameRo: 'Pixeli RGB & Culori Ecran',
    teacherNameEn: 'RGB Pixel Synthesis',
    category: 'agility',
    xpCap: 2000,
  },
  {
    scoreKey: 'pcbuilder',
    controlId: 'pcbuilder',
    localStorageKey: 'arkedo_highscore_pcbuilder',
    icon: '🔧',
    nameRo: 'PC Builder Tycoon',
    nameEn: 'PC Builder Tycoon',
    teacherNameRo: 'Asamblare PC Componente',
    teacherNameEn: 'PC Builder Pro',
    category: 'cyber',
    xpCap: 2500,
  },
  {
    scoreKey: 'detective',
    controlId: 'detective',
    localStorageKey: 'arkedo_highscore_cyber',
    legacyAliases: ['cyber'],
    icon: '🕵️',
    nameRo: 'Detectiv Cyber-Safe',
    nameEn: 'Cyber-Safe Detective',
    teacherNameRo: 'Detectivul de Amenințări',
    teacherNameEn: 'Cyber Detective',
    category: 'cyber',
    xpCap: 1500,
  },
  {
    scoreKey: 'files',
    controlId: 'files',
    localStorageKey: 'arkedo_highscore_files',
    icon: '📁',
    nameRo: 'Sortatorul de Fișiere',
    nameEn: 'File Organizer',
    teacherNameRo: 'Arbore de Foldere & Căi',
    teacherNameEn: 'Folder Tree Architect',
    category: 'agility',
    xpCap: 1200,
  },
  {
    scoreKey: 'binary_factory',
    controlId: 'binary_factory',
    localStorageKey: 'arkedo_highscore_binary_factory',
    icon: '⚡',
    nameRo: 'Fabrica Binară',
    nameEn: 'Binary Factory',
    teacherNameRo: 'Fabrica Binară (0 & 1)',
    teacherNameEn: 'Binary Factory (0/1)',
    category: 'logic',
    xpCap: 1500,
  },
  {
    scoreKey: 'maze',
    controlId: 'maze',
    localStorageKey: 'arkedo_highscore_maze',
    icon: '🧭',
    nameRo: 'Labirintul Algoritmic',
    nameEn: 'Algorithm Maze',
    teacherNameRo: 'Labirint Algoritmic',
    teacherNameEn: 'Cyber Algorithm Maze',
    category: 'logic',
    xpCap: 2500,
  },
  {
    scoreKey: 'firewall',
    controlId: 'firewall',
    localStorageKey: 'arkedo_highscore_firewall',
    icon: '🛡️',
    nameRo: 'Firewall Defender',
    nameEn: 'Firewall Defender',
    teacherNameRo: 'Apărare Firewall',
    teacherNameEn: 'Firewall Defense',
    category: 'cyber',
    xpCap: 1500,
  },
  {
    scoreKey: 'page_craft',
    controlId: 'page_craft',
    localStorageKey: 'arkedo_highscore_page_craft',
    icon: '📰',
    nameRo: 'PageCraft Editor',
    nameEn: 'PageCraft Editor',
    teacherNameRo: 'PageCraft: Tabele & Layout A4',
    teacherNameEn: 'PageCraft: Layout Architect',
    badgeRo: 'U4B',
    badgeEn: 'U4B',
    category: 'agility',
    xpCap: 2000,
  },
  {
    scoreKey: 'hacker_defense',
    controlId: 'hacker_defense',
    localStorageKey: 'arkedo_highscore_hacker_defense',
    icon: '⚔️',
    nameRo: 'Hacker vs Defender',
    nameEn: 'Hacker vs Defender',
    teacherNameRo: 'Hacker vs. Defender 1v1',
    teacherNameEn: 'Hacker vs Defender 1v1',
    badgeRo: '1v1',
    badgeEn: '1v1',
    category: 'cyber',
    xpCap: 2000,
  },
  {
    scoreKey: 'cyber_snake',
    controlId: 'cyber_snake',
    localStorageKey: 'arkedo_highscore_cyber_snake',
    icon: '🐍',
    nameRo: 'Cyber Snake Algoritmic',
    nameEn: 'Cyber Snake',
    teacherNameRo: 'Cyber Snake: Șarpele Algoritmic',
    teacherNameEn: 'Cyber Snake: Algorithmic Serpent',
    badgeRo: 'Scratch',
    badgeEn: 'Scratch',
    category: 'logic',
    xpCap: 2000,
  },
  {
    scoreKey: 'circuit_master',
    controlId: 'circuit_master',
    localStorageKey: 'arkedo_highscore_circuit_master',
    icon: '🔌',
    nameRo: 'Circuit Master 80s',
    nameEn: 'Circuit Master 80s',
    teacherNameRo: 'Circuit Master Retro 80s: Arduino',
    teacherNameEn: 'Circuit Master Retro 80s',
    badgeRo: 'IoT',
    badgeEn: 'IoT',
    category: 'cyber',
    xpCap: 2000,
  },
];

export const ARCADE_REGISTRY_BY_KEY: Record<string, ArcadeGameRegistryEntry> = ARCADE_REGISTRY.reduce(
  (acc, item) => {
    acc[item.scoreKey] = item;
    if (item.controlId !== item.scoreKey) {
      acc[item.controlId] = item;
    }
    item.legacyAliases?.forEach((alias) => {
      acc[alias] = item;
    });
    return acc;
  },
  {} as Record<string, ArcadeGameRegistryEntry>
);

export const ALL_ARCADE_SCORE_KEYS = ARCADE_REGISTRY.map((g) => g.scoreKey);

export function createDefaultArcadeScores(): ArcadeScores {
  const base: Record<string, number> = { totalArcade: 0 };
  for (const game of ARCADE_REGISTRY) {
    base[game.scoreKey] = 0;
  }
  return base as unknown as ArcadeScores;
}

export function computeNormalizedArcadeXP(scores: Partial<ArcadeScores>): number {
  let total = 0;
  for (const game of ARCADE_REGISTRY) {
    const raw = Number((scores as Record<string, unknown>)[game.scoreKey] || 0);
    if (raw <= 0) continue;
    const normalized = game.normalizeXP ? game.normalizeXP(raw) : raw;
    total += Math.min(game.xpCap, Math.max(0, normalized));
  }
  return total;
}
