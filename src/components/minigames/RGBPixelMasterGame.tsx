import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  ArrowLeft,
  Palette,
  Eye,
  Sliders,
  Sparkles,
  Trophy,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Maximize2,
  Paintbrush,
  Eraser,
  PaintBucket,
  ZoomIn,
  Grid,
  Info,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';

interface RGBPixelMasterGameProps {
  onBack: () => void;
  studentName?: string;
}

type GameTab = 'rgb_mixer' | 'pixel_art' | 'quiz';

// Color matching targets for Mode 1 (RGB Light Synthesis)
interface TargetColor {
  id: string;
  nameRo: string;
  nameEn: string;
  r: number;
  g: number;
  b: number;
  hintRo: string;
  hintEn: string;
  conceptRo: string;
  conceptEn: string;
}

const TARGET_COLORS: TargetColor[] = [
  {
    id: 'yellow',
    nameRo: 'Galben Solar',
    nameEn: 'Solar Yellow',
    r: 255,
    g: 255,
    b: 0,
    hintRo: 'Sinteza aditivă: Galbenul este format din Roșu maxim (255) și Verde maxim (255), fără Albastru (0).',
    hintEn: 'Additive synthesis: Yellow is made of max Red (255) and max Green (255), with zero Blue (0).',
    conceptRo: 'Roșu + Verde = Galben (lumină aditivă)',
    conceptEn: 'Red + Green = Yellow (additive light)',
  },
  {
    id: 'cyan',
    nameRo: 'Cyan Neon (Turcoaz deschis)',
    nameEn: 'Neon Cyan',
    r: 0,
    g: 255,
    b: 255,
    hintRo: 'Cyanul este combinația dintre Verde (255) și Albastru (255), fără Roșu (0).',
    hintEn: 'Cyan is the blend of Green (255) and Blue (255), with zero Red (0).',
    conceptRo: 'Verde + Albastru = Cyan',
    conceptEn: 'Green + Blue = Cyan',
  },
  {
    id: 'magenta',
    nameRo: 'Magenta Magic (Purpuriu)',
    nameEn: 'Magic Magenta',
    r: 255,
    g: 0,
    b: 255,
    hintRo: 'Magenta se obține combinând extremitățile spectrului: Roșu (255) și Albastru (255), fără Verde.',
    hintEn: 'Magenta is made by mixing Red (255) and Blue (255), with zero Green.',
    conceptRo: 'Roșu + Albastru = Magenta',
    conceptEn: 'Red + Blue = Magenta',
  },
  {
    id: 'orange',
    nameRo: 'Portocaliu Flacără',
    nameEn: 'Flame Orange',
    r: 255,
    g: 130,
    b: 0,
    hintRo: 'Portocaliul are Roșu la maxim (255), Verde la jumătate (~130), și zero Albastru.',
    hintEn: 'Orange has full Red (255), half Green (~130), and no Blue.',
    conceptRo: 'Mult Roșu + Verde moderat = Portocaliu',
    conceptEn: 'Full Red + moderate Green = Orange',
  },
  {
    id: 'purple',
    nameRo: 'Violet Profund',
    nameEn: 'Deep Violet',
    r: 140,
    g: 30,
    b: 240,
    hintRo: 'Violetul este dominat de Albastru puternic (~240) și Roșu mediu (~140), cu foarte puțin Verde.',
    hintEn: 'Violet is dominated by strong Blue (~240) and medium Red (~140), with very little Green.',
    conceptRo: 'Albastru intens + Roșu = Violet',
    conceptEn: 'High Blue + Red = Violet',
  },
  {
    id: 'lime',
    nameRo: 'Verde Lime Electric',
    nameEn: 'Electric Lime',
    r: 50,
    g: 255,
    b: 50,
    hintRo: 'Verde puternic la maxim (255), cu o atingere subtilă și egală de Roșu și Albastru pentru luminozitate.',
    hintEn: 'Full Green (255), with a subtle touch of Red and Blue for bright tint.',
    conceptRo: 'Canalul Verde este dominant în pixel',
    conceptEn: 'Green channel dominates the sub-pixels',
  },
  {
    id: 'gray',
    nameRo: 'Gri Mediu Neutru',
    nameEn: 'Neutral Gray',
    r: 128,
    g: 128,
    b: 128,
    hintRo: 'Orice nuanță de gri are toate cele 3 canale (R, G, B) perfect egale! Pentru gri mediu: 128, 128, 128.',
    hintEn: 'Every shade of gray has all 3 channels (R, G, B) perfectly equal! For medium gray: 128, 128, 128.',
    conceptRo: 'R = G = B creează nuanțe de gri',
    conceptEn: 'R = G = B creates neutral grays',
  },
  {
    id: 'white',
    nameRo: 'Alb Pur (Lumină Totală)',
    nameEn: 'Pure White (Full Light)',
    r: 255,
    g: 255,
    b: 255,
    hintRo: 'Când toți cei 3 sub-pixeli ard la intensitate maximă (255, 255, 255), ochiul percepe Alb Pur!',
    hintEn: 'When all 3 sub-pixels glow at maximum (255, 255, 255), the eye perceives Pure White!',
    conceptRo: '255, 255, 255 = Lumina Albă Maximă',
    conceptEn: '255, 255, 255 = Maximum White Light',
  },
];

// Helper to calculate RGB color distance/match percentage
function getColorMatch(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  // Maximum Euclidean distance in RGB color cube is sqrt(255^2 * 3) ~= 441.67
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);
  const maxDist = 441.67;
  const match = Math.max(0, Math.min(100, Math.round((1 - dist / maxDist) * 100)));
  return match;
}

function toHex(r: number, g: number, b: number): string {
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  return `#${hexR}${hexG}${hexB}`.toUpperCase();
}

// Pixel Art Models (8x8)
interface PixelArtModel {
  id: string;
  nameRo: string;
  nameEn: string;
  size: number;
  palette: string[];
  // grid: index of palette color, 0 is transparent/empty
  grid: number[];
  hintRo: string;
  hintEn: string;
}

const PIXEL_ART_MODELS: PixelArtModel[] = [
  {
    id: 'heart',
    nameRo: 'Inimă Retro 8-bit',
    nameEn: '8-bit Retro Heart',
    size: 8,
    palette: ['#000000', '#EF4444', '#B91C1C', '#FFFFFF'],
    grid: [
      0, 1, 1, 0, 0, 1, 1, 0,
      1, 3, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      0, 1, 1, 1, 1, 1, 1, 0,
      0, 0, 1, 1, 1, 1, 0, 0,
      0, 0, 0, 1, 1, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ],
    hintRo: 'Începe cu cele două vârfuri rotunjite din rândul de sus (roșu) și adaugă sclipirea albă în stânga sus!',
    hintEn: 'Start with the two rounded tops in the top row and add the white reflection in top-left!',
  },
  {
    id: 'star',
    nameRo: 'Steluță Power-Up',
    nameEn: 'Power-Up Star',
    size: 8,
    palette: ['#000000', '#FBBF24', '#D97706', '#000000', '#FFFFFF'],
    grid: [
      0, 0, 0, 1, 1, 0, 0, 0,
      0, 0, 1, 1, 1, 1, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1,
      0, 1, 3, 1, 1, 3, 1, 0,
      0, 0, 1, 1, 1, 1, 0, 0,
      0, 1, 1, 0, 0, 1, 1, 0,
      1, 1, 0, 0, 0, 0, 1, 1,
      0, 0, 0, 0, 0, 0, 0, 0,
    ],
    hintRo: 'Steaua este simetrică pe axa verticală și are doi ochi negri pixelati în mijloc!',
    hintEn: 'The star is symmetrical on the vertical axis and features two pixel eyes in the center!',
  },
  {
    id: 'robot',
    nameRo: 'Roboțelul Arky Pixelat',
    nameEn: 'Pixelated Arky Bot',
    size: 8,
    palette: ['#000000', '#3B82F6', '#1E40AF', '#67E8F9', '#F59E0B'],
    grid: [
      0, 0, 0, 4, 4, 0, 0, 0,
      0, 0, 0, 1, 1, 0, 0, 0,
      0, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 3, 1, 1, 3, 1, 0,
      0, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 3, 3, 3, 3, 1, 0,
      0, 0, 1, 1, 1, 1, 0, 0,
      0, 1, 0, 0, 0, 0, 1, 0,
    ],
    hintRo: 'Capul lui Arky este albastru, cu antena galbenă deasupra și vizorul luminos cyan!',
    hintEn: 'Arky bot head is blue, with a yellow antenna on top and cyan glowing visor!',
  },
  {
    id: 'computer',
    nameRo: 'Monitor CRT Retro',
    nameEn: 'Retro CRT Monitor',
    size: 8,
    palette: ['#000000', '#475569', '#0284C7', '#38BDF8', '#1E293B'],
    grid: [
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 2, 2, 2, 2, 3, 2, 1,
      1, 2, 2, 2, 2, 2, 2, 1,
      1, 2, 2, 2, 2, 2, 2, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      0, 0, 4, 4, 4, 4, 0, 0,
      0, 4, 4, 4, 4, 4, 4, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ],
    hintRo: 'Rândul exterior este carcasa monitorului (gri), ecranul este albastru, iar talpa susține monitorul.',
    hintEn: 'The outer edge is the gray chassis, the screen is cyan-blue, and the base supports it.',
  },
];

// Mode 3: Interactive TIC Graphic Quiz Questions
interface GraphicQuiz {
  id: number;
  questionRo: string;
  questionEn: string;
  optionsRo: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationRo: string;
  explanationEn: string;
  hintRo: string;
  hintEn: string;
}

const GRAPHIC_QUIZ: GraphicQuiz[] = [
  {
    id: 1,
    questionRo: 'Ce este un „Pixel” într-o imagine digitală?',
    questionEn: 'What is a "Pixel" in a digital image?',
    optionsRo: [
      'Un fir de cablu HDMI',
      'Cel mai mic element/punct colorat dintr-o imagine pe ecran',
      'O unitate de măsură pentru viteza internetului',
      'Un program antivirus',
    ],
    optionsEn: [
      'An HDMI cable wire',
      'The smallest picture element/dot of color on a display screen',
      'A measurement unit for internet speed',
      'An antivirus software program',
    ],
    correctIndex: 1,
    explanationRo: 'Cuvântul „Pixel” provine din „Picture Element” (element de imagine). Este cel mai mic punct adresabil pe un monitor.',
    explanationEn: 'The word "Pixel" comes from "Picture Element". It is the smallest addressable unit on a digital display.',
    hintRo: 'Gândește-te la prescurtarea cuvintelor englezești Picture + Element = Pixel!',
    hintEn: 'Think of the contraction Picture + Element = Pixel!',
  },
  {
    id: 2,
    questionRo: 'Ce culori primare folosește ecranul în modelul aditiv de lumină RGB?',
    questionEn: 'Which primary colors does a display use in the additive RGB model?',
    optionsRo: [
      'Roșu, Galben și Albastru',
      'Roșu, Verde și Albastru (Red, Green, Blue)',
      'Cyan, Magenta, Galben și Negru',
      'Portocaliu, Violet și Verde',
    ],
    optionsEn: [
      'Red, Yellow and Blue',
      'Red, Green and Blue (RGB)',
      'Cyan, Magenta, Yellow and Black (CMYK)',
      'Orange, Violet and Green',
    ],
    correctIndex: 1,
    explanationRo: 'Monitoarele și televizoarele emit lumină prin trei canale de bază: Red (Roșu), Green (Verde) și Blue (Albastru).',
    explanationEn: 'Screens emit light through three primary channels: Red, Green, and Blue (RGB).',
    hintRo: 'Abrevierea RGB vine de la Red, Green, Blue!',
    hintEn: 'The abbreviation RGB stands for Red, Green, Blue!',
  },
  {
    id: 3,
    questionRo: 'Dacă aprinzi la maxim canalul Roșu (255) și canalul Verde (255), ce culoare obții pe ecran?',
    questionEn: 'If you turn on Red (255) and Green (255) at maximum, what color do you see?',
    optionsRo: [
      'Maro închis',
      'Galben strălucitor',
      'Negru',
      'Albastru deschis',
    ],
    optionsEn: [
      'Dark brown',
      'Bright Yellow',
      'Black',
      'Light blue',
    ],
    correctIndex: 1,
    explanationRo: 'În sinteza aditivă a luminii: Roșu + Verde = Galben! Spre deosebire de vopselele de pictură, amestecul de raze de lumină adaugă luminozitate.',
    explanationEn: 'In additive light synthesis: Red + Green = Yellow! Unlike painting pigments, adding light beams creates brighter hues.',
    hintRo: 'Nu confunda lumina cu acuarelele. La lumină, roșul adăugat peste verde dă o culoare luminoasă caldă!',
    hintEn: 'Do not confuse light with paint. Mixing red and green light rays creates a bright warm yellow!',
  },
  {
    id: 4,
    questionRo: 'De ce o imagine Raster/Bitmap (cum ar fi JPG sau BMP) devine neclară și „pixelată” când faci Zoom mare pe ea?',
    questionEn: 'Why does a Raster/Bitmap image (like JPG or BMP) become blurry and pixelated when zoomed in?',
    optionsRo: [
      'Fiindcă este formată dintr-o grilă fixă de pixeli pătrați care se măresc',
      'Fiindcă monitorul rămâne fără memorie RAM',
      'Fiindcă s-a descărcat bateria calculatorului',
      'Fiindcă fișierul este virusat',
    ],
    optionsEn: [
      'Because it is made of a fixed grid of square pixels that stretch out',
      'Because the monitor runs out of RAM',
      'Because the laptop battery is low',
      'Because the file is infected by malware',
    ],
    correctIndex: 0,
    explanationRo: 'Imaginile raster stochează o matrice fixă de pixeli. Când mărești imaginea, fiecare pixel pătrat devine vizibil cu ochiul liber.',
    explanationEn: 'Raster images store a fixed grid of pixels. Zooming in makes each square pixel clearly visible.',
    hintRo: 'Amintește-ți că fiecare pătrățel are o culoare fixă și nu se poate „inventa” detaliu nou la mărire!',
    hintEn: 'Remember that each square has a fixed color and cannot create new details when stretched!',
  },
  {
    id: 5,
    questionRo: 'Care format de imagine permite salvarea unui fundal TRANSPARENT (fără pătrat alb în jur)?',
    questionEn: 'Which image format supports a TRANSPARENT background?',
    optionsRo: [
      'JPEG / JPG',
      'PNG',
      'TXT',
      'MP3',
    ],
    optionsEn: [
      'JPEG / JPG',
      'PNG',
      'TXT',
      'MP3',
    ],
    correctIndex: 1,
    explanationRo: 'Formatul PNG (Portable Network Graphics) suportă canalul Alpha (transparență), fiind ideal pentru stickere, logouri și pictograme.',
    explanationEn: 'PNG supports the Alpha channel (transparency), making it ideal for logos, icons, and stickers.',
    hintRo: 'Este formatul folosit pentru logouri și iconițe decupate curate!',
    hintEn: 'It is the format widely used for logos and cleanly clipped icons!',
  },
  {
    id: 6,
    questionRo: 'O fotografie are rezoluția de 2000 × 1500 pixeli. Câți Megapixeli (milioane de pixeli) are în total?',
    questionEn: 'A photo has a resolution of 2000 × 1500 pixels. How many Megapixels (million pixels) does it contain?',
    optionsRo: [
      '3.500 pixeli',
      '3 Megapixeli (3.000.000 pixeli)',
      '500 Megapixeli',
      '30 Megapixeli',
    ],
    optionsEn: [
      '3,500 pixels',
      '3 Megapixels (3,000,000 pixels)',
      '500 Megapixels',
      '30 Megapixels',
    ],
    correctIndex: 1,
    explanationRo: 'Formula de calcul a rezoluției: 2000 × 1500 = 3.000.000 de pixeli. Prefixul „Mega” înseamnă 1 milion, deci sunt exact 3 Megapixeli (3 MP)!',
    explanationEn: 'Resolution formula: 2000 × 1500 = 3,000,000 pixels. "Mega" means 1 million, which equals exactly 3 Megapixels (3 MP)!',
    hintRo: 'Înmulțește lățimea cu înălțimea: 2000 × 1500 = ?',
    hintEn: 'Multiply width by height: 2000 × 1500 = ?',
  },
];

export const RGBPixelMasterGame: React.FC<RGBPixelMasterGameProps> = ({
  onBack,
  studentName,
}) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Active Tab
  const [activeTab, setActiveTab] = useState<GameTab>('rgb_mixer');

  // Overall Score
  const [score, setScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_rgb_pixels') || '0');
    } catch {
      return 0;
    }
  });

  // Global Hint state (explicit hint button requested by user)
  const [showHint, setShowHint] = useState<boolean>(false);

  // -------------------------------------------------------------
  // Mode 1: RGB Mixer State
  // -------------------------------------------------------------
  const [targetIdx, setTargetIdx] = useState<number>(0);
  const currentTarget = TARGET_COLORS[targetIdx];
  const [redVal, setRedVal] = useState<number>(0);
  const [greenVal, setGreenVal] = useState<number>(0);
  const [blueVal, setBlueVal] = useState<number>(0);
  const [mixerCompleted, setMixerCompleted] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);

  // Calculate current match
  const matchPercentage = getColorMatch(
    redVal,
    greenVal,
    blueVal,
    currentTarget.r,
    currentTarget.g,
    currentTarget.b
  );

  const handleNextTargetColor = () => {
    sounds.playClick();
    setShowHint(false);
    setMixerCompleted(false);
    const nextIdx = (targetIdx + 1) % TARGET_COLORS.length;
    setTargetIdx(nextIdx);
    // Reset sliders to 0 or randomized offset
    setRedVal(0);
    setGreenVal(0);
    setBlueVal(0);
  };

  const handleMixerCheck = () => {
    if (matchPercentage >= 90) {
      sounds.playVictory();
      setMixerCompleted(true);
      const points = matchPercentage === 100 ? 150 : 100;
      setScore((prev) => {
        const next = prev + points;
        try {
          localStorage.setItem('arkedo_highscore_rgb_pixels', String(next));
          updateActiveArcadeScore('rgb_pixel', next);
        } catch {}
        return next;
      });
      setStreakCount((prev) => prev + 1);
      arky.triggerSuccess(
        lang === 'en'
          ? `Spectacular! ${matchPercentage}% color match! You mastered the RGB light synthesis!`
          : `Spectaculos! Potrivire de ${matchPercentage}%! Ai stăpânit sinteza luminii RGB!`
      );
    } else {
      sounds.playWrong();
      arky.triggerIdle(
        lang === 'en'
          ? `Current match is ${matchPercentage}%. Adjust the R, G, or B sliders closer to the target!`
          : `Potrivirea este de ${matchPercentage}%. Ajustează glisoarele R, G sau B mai aproape de țintă!`
      );
    }
  };

  // -------------------------------------------------------------
  // Mode 2: Pixel Art Canvas State
  // -------------------------------------------------------------
  const [modelIdx, setModelIdx] = useState<number>(0);
  const currentModel = PIXEL_ART_MODELS[modelIdx];
  const [userGrid, setUserGrid] = useState<number[]>(() =>
    new Array(currentModel.size * currentModel.size).fill(0)
  );
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(1);
  const [activeTool, setActiveTool] = useState<'pencil' | 'eraser' | 'fill'>('pencil');
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [artCompleted, setArtCompleted] = useState<boolean>(false);

  // Initialize/reset user grid when model changes
  useEffect(() => {
    setUserGrid(new Array(currentModel.size * currentModel.size).fill(0));
    setArtCompleted(false);
    setShowHint(false);
  }, [modelIdx]);

  // Calculate pixel art accuracy
  const correctPixelCount = userGrid.reduce((acc, val, idx) => {
    return acc + (val === currentModel.grid[idx] ? 1 : 0);
  }, 0);
  const totalPixels = currentModel.size * currentModel.size;
  const artAccuracy = Math.round((correctPixelCount / totalPixels) * 100);

  const applyPixelPaint = (index: number) => {
    if (artCompleted) return;

    if (activeTool === 'pencil') {
      sounds.playClick();
      setUserGrid((prev) => {
        const next = [...prev];
        next[index] = selectedColorIdx;
        return next;
      });
    } else if (activeTool === 'eraser') {
      sounds.playClick();
      setUserGrid((prev) => {
        const next = [...prev];
        next[index] = 0;
        return next;
      });
    } else if (activeTool === 'fill') {
      sounds.playClick();
      const targetVal = userGrid[index];
      const replacementVal = selectedColorIdx;
      if (targetVal === replacementVal) return;

      // Flood fill implementation on 2D grid
      const size = currentModel.size;
      const nextGrid = [...userGrid];
      const queue: number[] = [index];
      const visited = new Set<number>();

      while (queue.length > 0) {
        const cur = queue.pop()!;
        if (visited.has(cur)) continue;
        visited.add(cur);

        if (nextGrid[cur] === targetVal) {
          nextGrid[cur] = replacementVal;
          const r = Math.floor(cur / size);
          const c = cur % size;

          if (r > 0) queue.push((r - 1) * size + c);
          if (r < size - 1) queue.push((r + 1) * size + c);
          if (c > 0) queue.push(r * size + (c - 1));
          if (c < size - 1) queue.push(r * size + (c + 1));
        }
      }
      setUserGrid(nextGrid);
    }
  };

  const checkPixelArtVictory = () => {
    if (artAccuracy === 100) {
      sounds.playVictory();
      setArtCompleted(true);
      setScore((prev) => {
        const next = prev + 200;
        try {
          localStorage.setItem('arkedo_highscore_rgb_pixels', String(next));
          updateActiveArcadeScore('rgb_pixel', next);
        } catch {}
        return next;
      });
      arky.triggerSuccess(
        lang === 'en'
          ? `Masterpiece complete! 100% pixel-perfect accuracy on ${currentModel.nameEn}!`
          : `Capodoperă finalizată! 100% precizie pe ${currentModel.nameRo}!`
      );
    } else {
      sounds.playClick();
      arky.triggerIdle(
        lang === 'en'
          ? `Current accuracy: ${artAccuracy}%. Use the Hint button if you need help finding missing pixels!`
          : `Precizie curentă: ${artAccuracy}%. Apasă pe Indiciu dacă vrei să vezi pixelii care diferă!`
      );
    }
  };

  // -------------------------------------------------------------
  // Mode 3: Quiz State
  // -------------------------------------------------------------
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const currentQuestion = GRAPHIC_QUIZ[quizIdx];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const handleOptionSelect = (idx: number) => {
    if (isAnswerSubmitted) return;
    sounds.playClick();
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQuestion.correctIndex) {
      sounds.playCorrect();
      setQuizScore((prev) => prev + 1);
      setScore((prev) => {
        const next = prev + 50;
        try {
          localStorage.setItem('arkedo_highscore_rgb_pixels', String(next));
          updateActiveArcadeScore('rgb_pixel', next);
        } catch {}
        return next;
      });
      arky.triggerSuccess(
        lang === 'en' ? 'Correct answer! Fantastic!' : 'Răspuns corect! Excelent!'
      );
    } else {
      sounds.playWrong();
      arky.triggerIdle(
        lang === 'en'
          ? 'Not quite. Check the didactic explanation below!'
          : 'Nu chiar. Citește explicația didactică de mai jos!'
      );
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setShowHint(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (quizIdx < GRAPHIC_QUIZ.length - 1) {
      setQuizIdx((prev) => prev + 1);
    } else {
      setQuizIdx(0);
    }
  };

  // -------------------------------------------------------------
  // Hint Trigger Handler
  // -------------------------------------------------------------
  const handleToggleHint = () => {
    sounds.playClick();
    const nextState = !showHint;
    setShowHint(nextState);

    if (nextState) {
      if (activeTab === 'rgb_mixer') {
        arky.triggerIdle(
          lang === 'en' ? `💡 Hint: ${currentTarget.hintEn}` : `💡 Indiciu: ${currentTarget.hintRo}`
        );
      } else if (activeTab === 'pixel_art') {
        arky.triggerIdle(
          lang === 'en' ? `💡 Hint: ${currentModel.hintEn}` : `💡 Indiciu: ${currentModel.hintRo}`
        );
      } else if (activeTab === 'quiz') {
        arky.triggerIdle(
          lang === 'en' ? `💡 Hint: ${currentQuestion.hintEn}` : `💡 Indiciu: ${currentQuestion.hintRo}`
        );
      }
    }
  };

  return (
    <div
      id="rgb-pixel-master-container"
      className="max-w-6xl mx-auto px-3 sm:px-4 py-6 font-sans text-slate-100 select-none"
    >
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-3xl bg-slate-900/90 border-2 border-slate-700/80 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            id="back-to-arcade-btn"
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono transition border border-slate-600/70 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Arcade'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white font-heading flex items-center gap-2">
                <span>{lang === 'en' ? 'RGB Pixel Master' : 'Maestrul Pixelilor RGB'}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                  {lang === 'en' ? '2D Graphics & Color' : 'Grafică Digitală & Pixeli'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {studentName || (lang === 'en' ? 'Cadet Pilot' : 'Elev Arkedo')}
              </div>
            </div>
          </div>
        </div>

        {/* Global Controls & Score */}
        <div className="flex items-center gap-2.5">
          {/* Dedicated Hint Button */}
          <button
            id="rgb-hint-toggle-btn"
            type="button"
            onClick={handleToggleHint}
            title={lang === 'en' ? 'Show didactic hint' : 'Afișează indiciu didactic'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer border active:scale-95 ${
              showHint
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-amber-500/40 hover:border-amber-400'
            }`}
          >
            <Lightbulb className={`w-4 h-4 ${showHint ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>{showHint ? (lang === 'en' ? 'Hint Active' : 'Indiciu Activ') : (lang === 'en' ? 'Hint' : '💡 Indiciu')}</span>
          </button>

          {/* High Score Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-black text-white">{score}</span>
            <span className="text-[10px] text-slate-400">pts</span>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('rgb_mixer');
            setShowHint(false);
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'rgb_mixer'
              ? 'bg-gradient-to-r from-red-500/20 via-green-500/20 to-blue-500/20 text-white border border-cyan-400/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'en' ? '1. RGB Light Synthesis' : '1. Sinteza Luminii RGB'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('pixel_art');
            setShowHint(false);
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'pixel_art'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Grid className="w-4 h-4 text-purple-400" />
          <span>{lang === 'en' ? '2. Pixel Art Mosaic' : '2. Reconstruiește Pixel Art'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('quiz');
            setShowHint(false);
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border border-emerald-400/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? '3. TIC Graphic Quiz' : '3. Ghicitorul de Formate & Pixeli'}</span>
        </button>
      </div>

      {/* Didactic Hint Callout (Only appears if user clicked Hint) */}
      {showHint && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/60 shadow-lg flex items-start gap-3 text-amber-200 animate-fadeIn">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-amber-300">
              {lang === 'en' ? 'Didactic Hint: ' : 'Indiciu Didactic: '}
            </span>
            {activeTab === 'rgb_mixer' && (lang === 'en' ? currentTarget.hintEn : currentTarget.hintRo)}
            {activeTab === 'pixel_art' && (lang === 'en' ? currentModel.hintEn : currentModel.hintRo)}
            {activeTab === 'quiz' && (lang === 'en' ? currentQuestion.hintEn : currentQuestion.hintRo)}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: RGB LIGHT SYNTHESIS (LABORATORUL DE LUMINĂ & SUB-PIXELI) */}
      {/* ========================================================================= */}
      {activeTab === 'rgb_mixer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Target & Color Matcher */}
          <div className="lg:col-span-5 bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Misiunea {targetIdx + 1} / {TARGET_COLORS.length}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                  {lang === 'en' ? currentTarget.conceptEn : currentTarget.conceptRo}
                </span>
              </div>

              <h3 className="text-xl font-black text-white font-heading">
                {lang === 'en' ? currentTarget.nameEn : currentTarget.nameRo}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'en'
                  ? 'Adjust the Red, Green, and Blue light channels to reproduce the exact target shade.'
                  : 'Ajustează canalele de lumină Roșu, Verde și Albastru pentru a recrea nuanța cerută.'}
              </p>
            </div>

            {/* Visual Color Comparison Sandbox */}
            <div className="grid grid-cols-2 gap-4">
              {/* Target Color Box */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'en' ? 'Target Color' : 'Culoare Țintă'}
                </span>
                <div
                  className="w-full h-32 rounded-2xl border-2 border-white/20 shadow-inner flex flex-col items-center justify-end p-2 transition-colors duration-300 relative overflow-hidden"
                  style={{
                    backgroundColor: `rgb(${currentTarget.r}, ${currentTarget.g}, ${currentTarget.b})`,
                  }}
                >
                  <div className="px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-white">
                    {toHex(currentTarget.r, currentTarget.g, currentTarget.b)}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  RGB({currentTarget.r}, {currentTarget.g}, {currentTarget.b})
                </span>
              </div>

              {/* Your Mixed Color Box */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'en' ? 'Your Pixel' : 'Pixelul Tău'}
                </span>
                <div
                  className="w-full h-32 rounded-2xl border-2 border-white/20 shadow-inner flex flex-col items-center justify-end p-2 transition-colors duration-150 relative overflow-hidden"
                  style={{
                    backgroundColor: `rgb(${redVal}, ${greenVal}, ${blueVal})`,
                  }}
                >
                  <div className="px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-white">
                    {toHex(redVal, greenVal, blueVal)}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  RGB({redVal}, {greenVal}, {blueVal})
                </span>
              </div>
            </div>

            {/* Accuracy Match Meter */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">
                  {lang === 'en' ? 'Chromatic Precision:' : 'Precizie Cromatică:'}
                </span>
                <span
                  className={`font-black text-sm ${
                    matchPercentage >= 90
                      ? 'text-emerald-400'
                      : matchPercentage >= 70
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {matchPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    matchPercentage >= 90
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : matchPercentage >= 70
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-500 to-red-400'
                  }`}
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-500 font-mono mt-2 text-center">
                {lang === 'en'
                  ? 'Target: Reach ≥ 90% accuracy to validate this color mission!'
                  : 'Țintă: Atinge ≥ 90% precizie pentru a valida misiunea!'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMixerCheck}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-purple-600/30 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'en' ? 'Verify Color' : 'Verifică Nuanța'}</span>
              </button>

              <button
                type="button"
                onClick={handleNextTargetColor}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition border border-slate-700 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'en' ? 'Next' : 'Următoarea'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Sub-Pixels Microscope & RGB Sliders */}
          <div className="lg:col-span-7 bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black text-white font-heading flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>
                    {lang === 'en'
                      ? 'Microscope View: The 3 Sub-Pixels (R, G, B)'
                      : 'Privire la Microscop: Cei 3 Sub-Pixeli de pe Ecran'}
                  </span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">0 - 255 (8 biți/canal)</span>
              </div>
              <p className="text-xs text-slate-300">
                {lang === 'en'
                  ? 'Every single pixel on your computer screen consists of 3 microscopic phosphor or LED strips: Red, Green, and Blue.'
                  : 'Fiecare pixel individual de pe ecran este compus din 3 benzi microscopice de lumină: Roșu, Verde și Albastru.'}
              </p>
            </div>

            {/* Visual Sub-Pixel Hardware Representation */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 flex flex-col items-center justify-center gap-4">
              <div className="w-full max-w-sm h-32 rounded-2xl bg-black border-4 border-slate-800 p-2 flex gap-2 shadow-inner">
                {/* Red Sub-Pixel */}
                <div
                  className="flex-1 rounded-xl flex flex-col items-center justify-end p-2 transition-all duration-150 border border-red-500/30"
                  style={{
                    backgroundColor: `rgb(${redVal}, 0, 0)`,
                    boxShadow: redVal > 0 ? `0 0 ${redVal / 10}px rgba(239, 68, 68, 0.7)` : 'none',
                  }}
                >
                  <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-1 rounded">
                    R: {redVal}
                  </span>
                </div>

                {/* Green Sub-Pixel */}
                <div
                  className="flex-1 rounded-xl flex flex-col items-center justify-end p-2 transition-all duration-150 border border-green-500/30"
                  style={{
                    backgroundColor: `rgb(0, ${greenVal}, 0)`,
                    boxShadow: greenVal > 0 ? `0 0 ${greenVal / 10}px rgba(34, 197, 94, 0.7)` : 'none',
                  }}
                >
                  <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-1 rounded">
                    G: {greenVal}
                  </span>
                </div>

                {/* Blue Sub-Pixel */}
                <div
                  className="flex-1 rounded-xl flex flex-col items-center justify-end p-2 transition-all duration-150 border border-blue-500/30"
                  style={{
                    backgroundColor: `rgb(0, 0, ${blueVal})`,
                    boxShadow: blueVal > 0 ? `0 0 ${blueVal / 10}px rgba(59, 130, 246, 0.7)` : 'none',
                  }}
                >
                  <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-1 rounded">
                    B: {blueVal}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>Micro-Pixel Zoom:</span>
                <span className="text-red-400 font-bold">R ({redVal})</span> +{' '}
                <span className="text-green-400 font-bold">G ({greenVal})</span> +{' '}
                <span className="text-blue-400 font-bold">B ({blueVal})</span> ={' '}
                <span className="text-white font-bold">{toHex(redVal, greenVal, blueVal)}</span>
              </div>
            </div>

            {/* Interactive Color Sliders & Quick Step Buttons */}
            <div className="space-y-4">
              {/* RED CHANNEL */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-red-500/20">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-red-400 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    Canalul Roșu (Red)
                  </span>
                  <span className="font-bold text-white bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                    {redVal} / 255
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={redVal}
                  onChange={(e) => setRedVal(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex items-center gap-2 pt-1">
                  {[0, 64, 128, 192, 255].map((val) => (
                    <button
                      key={`r-${val}`}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setRedVal(val);
                      }}
                      className="flex-1 py-1 text-[10px] font-mono rounded-lg bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/50 transition cursor-pointer"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* GREEN CHANNEL */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-green-500/20">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-green-400 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    Canalul Verde (Green)
                  </span>
                  <span className="font-bold text-white bg-green-950/60 px-2 py-0.5 rounded border border-green-500/40">
                    {greenVal} / 255
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={greenVal}
                  onChange={(e) => setGreenVal(Number(e.target.value))}
                  className="w-full accent-green-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex items-center gap-2 pt-1">
                  {[0, 64, 128, 192, 255].map((val) => (
                    <button
                      key={`g-${val}`}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setGreenVal(val);
                      }}
                      className="flex-1 py-1 text-[10px] font-mono rounded-lg bg-slate-800 hover:bg-green-950 text-slate-300 hover:text-green-300 border border-slate-700 hover:border-green-500/50 transition cursor-pointer"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* BLUE CHANNEL */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-blue-500/20">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-blue-400 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    Canalul Albastru (Blue)
                  </span>
                  <span className="font-bold text-white bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/40">
                    {blueVal} / 255
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={blueVal}
                  onChange={(e) => setBlueVal(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex items-center gap-2 pt-1">
                  {[0, 64, 128, 192, 255].map((val) => (
                    <button
                      key={`b-${val}`}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setBlueVal(val);
                      }}
                      className="flex-1 py-1 text-[10px] font-mono rounded-lg bg-slate-800 hover:bg-blue-950 text-slate-300 hover:text-blue-300 border border-slate-700 hover:border-blue-500/50 transition cursor-pointer"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: PIXEL ART RECONSTRUCTION (MOZAIC DE PIXELI & REZOLUȚIE) */}
      {/* ========================================================================= */}
      {activeTab === 'pixel_art' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Target Reference & Model Selector */}
          <div className="lg:col-span-4 bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Modelul {modelIdx + 1} / {PIXEL_ART_MODELS.length}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                  {currentModel.size} × {currentModel.size} Pixeli
                </span>
              </div>

              <h3 className="text-xl font-black text-white font-heading">
                {lang === 'en' ? currentModel.nameEn : currentModel.nameRo}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'en'
                  ? 'Reconstruct the exact target sprite by painting individual pixels on your canvas.'
                  : 'Reconstruiește modelul țintă pictând fiecare pixel pe pânza ta din dreapta.'}
              </p>
            </div>

            {/* Target 8x8 Reference Grid */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                {lang === 'en' ? 'Reference Model' : 'Model de Referință'}
              </span>
              <div
                className="p-2.5 rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-inner grid gap-0.5"
                style={{
                  gridTemplateColumns: `repeat(${currentModel.size}, minmax(0, 1fr))`,
                  width: '240px',
                  height: '240px',
                }}
              >
                {currentModel.grid.map((colorIdx, idx) => (
                  <div
                    key={`target-cell-${idx}`}
                    className="w-full h-full rounded-sm"
                    style={{
                      backgroundColor:
                        colorIdx === 0 ? '#0f172a' : currentModel.palette[colorIdx],
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Model Selector Bar */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400">
                {lang === 'en' ? 'Choose sprite model:' : 'Alege modelul de reprodus:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PIXEL_ART_MODELS.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setModelIdx(idx);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition text-left cursor-pointer border ${
                      modelIdx === idx
                        ? 'bg-purple-600/30 text-purple-200 border-purple-400'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                    }`}
                  >
                    {idx + 1}. {lang === 'en' ? m.nameEn : m.nameRo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Canvas & Painting Tools */}
          <div className="lg:col-span-8 bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-5">
            {/* Toolbar: Tools, Palette, Clear */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              {/* Tool Selection */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveTool('pencil');
                  }}
                  className={`p-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTool === 'pencil'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={lang === 'en' ? 'Pencil Tool' : 'Creion Pixel'}
                >
                  <Paintbrush className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Pencil' : 'Creion'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveTool('eraser');
                  }}
                  className={`p-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTool === 'eraser'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={lang === 'en' ? 'Eraser Tool' : 'Radieră'}
                >
                  <Eraser className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Eraser' : 'Radieră'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveTool('fill');
                  }}
                  className={`p-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTool === 'fill'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={lang === 'en' ? 'Bucket Fill' : 'Găleată de vopsea'}
                >
                  <PaintBucket className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Fill' : 'Umplere'}</span>
                </button>
              </div>

              {/* Grid Toggle & Clear Canvas */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setShowGridLines((prev) => !prev);
                  }}
                  className={`p-2 rounded-xl border text-xs font-mono transition cursor-pointer flex items-center gap-1 ${
                    showGridLines
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Grid' : 'Grilă'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setUserGrid(new Array(currentModel.size * currentModel.size).fill(0));
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700 cursor-pointer active:scale-95 flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Reset' : 'Golește'}</span>
                </button>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-1">
                {lang === 'en' ? 'Palette:' : 'Culori:'}
              </span>
              {currentModel.palette.map((hex, idx) => {
                if (idx === 0) return null; // Skip transparent
                const isSelected = selectedColorIdx === idx && activeTool !== 'eraser';
                return (
                  <button
                    key={`palette-${idx}`}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedColorIdx(idx);
                      if (activeTool === 'eraser') setActiveTool('pencil');
                    }}
                    className={`w-8 h-8 rounded-xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-white scale-110 shadow-lg shadow-purple-500/30 ring-2 ring-purple-400'
                        : 'border-white/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-white drop-shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* The Main Interactive Canvas (Click or Drag to Paint) */}
            <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950 border-2 border-slate-800">
              <div
                className="grid p-3 rounded-2xl bg-slate-900/90 border-2 border-slate-700 shadow-2xl cursor-crosshair select-none"
                style={{
                  gridTemplateColumns: `repeat(${currentModel.size}, minmax(0, 1fr))`,
                  gap: showGridLines ? '2px' : '0px',
                  width: 'min(360px, 85vw)',
                  height: 'min(360px, 85vw)',
                }}
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseLeave={() => setIsMouseDown(false)}
              >
                {userGrid.map((colorIdx, idx) => {
                  const targetExpectedColor = currentModel.grid[idx];
                  const isWrong = showHint && colorIdx !== targetExpectedColor;

                  return (
                    <div
                      key={`canvas-cell-${idx}`}
                      onClick={() => applyPixelPaint(idx)}
                      onTouchStart={() => applyPixelPaint(idx)}
                      onMouseEnter={() => {
                        if (isMouseDown) applyPixelPaint(idx);
                      }}
                      className={`w-full h-full rounded-sm transition-colors duration-75 relative ${
                        isWrong
                          ? 'ring-2 ring-amber-400 bg-amber-500/30 animate-pulse'
                          : showGridLines
                          ? 'border border-slate-800/40 hover:border-cyan-400/80'
                          : ''
                      }`}
                      style={{
                        backgroundColor:
                          colorIdx === 0 ? '#0b1120' : currentModel.palette[colorIdx],
                      }}
                    >
                      {isWrong && (
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] text-amber-300 font-bold">
                          ●
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-400 font-mono mt-3">
                {lang === 'en'
                  ? 'Tip: Hold mouse button and drag across canvas for smooth pixel sketching.'
                  : 'Sfat: Ține apăsat butonul mouse-ului și trage peste celule pentru a desena continuu.'}
              </div>
            </div>

            {/* Bottom Progress & Validation Bar */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono text-slate-400">
                  {lang === 'en' ? 'Accuracy vs Reference:' : 'Acuratețe față de model:'}
                </div>
                <div className="text-lg font-black text-white font-mono flex items-center gap-2">
                  <span
                    className={
                      artAccuracy === 100
                        ? 'text-emerald-400'
                        : artAccuracy >= 80
                        ? 'text-amber-400'
                        : 'text-purple-300'
                    }
                  >
                    {artAccuracy}%
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({correctPixelCount}/{totalPixels} pixeli potriviți)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={checkPixelArtVictory}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>{lang === 'en' ? 'Check & Finish Sprite' : 'Validează Mozaicul'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: TIC GRAPHIC QUIZ & RESOLUTION DECODER */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Întrebarea {quizIdx + 1} / {GRAPHIC_QUIZ.length}
              </span>
              <h3 className="text-lg font-black text-white font-heading mt-1">
                {lang === 'en' ? currentQuestion.questionEn : currentQuestion.questionRo}
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{quizScore} Corecte</span>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {(lang === 'en' ? currentQuestion.optionsEn : currentQuestion.optionsRo).map(
              (option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = currentQuestion.correctIndex === optIdx;

                let btnStyles = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-rose-950/80 border-rose-400 text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyles = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30';
                }

                return (
                  <button
                    key={`opt-${optIdx}`}
                    type="button"
                    onClick={() => handleOptionSelect(optIdx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-sans text-sm font-semibold transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-slate-950 flex items-center justify-center font-mono text-xs font-bold text-slate-300 border border-slate-700 shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* Post-Answer Explanation Box */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 animate-fadeIn space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <Info className="w-4 h-4" />
                <span>{lang === 'en' ? 'Didactic Curriculum Explanation:' : 'Explicație din Manualul de TIC:'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'en' ? currentQuestion.explanationEn : currentQuestion.explanationRo}
              </p>
            </div>
          )}

          {/* Submit / Next Question Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                onClick={handleQuizSubmit}
                disabled={selectedOption === null}
                className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-black text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <span>{lang === 'en' ? 'Submit Answer' : 'Trimite Răspunsul'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="py-3 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <span>
                  {quizIdx < GRAPHIC_QUIZ.length - 1
                    ? lang === 'en'
                      ? 'Next Question'
                      : 'Următoarea Întrebare'
                    : lang === 'en'
                    ? 'Restart Quiz'
                    : 'Reia Chestionarul'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
