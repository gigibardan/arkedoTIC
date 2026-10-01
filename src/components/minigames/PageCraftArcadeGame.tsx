import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  ArrowLeft,
  LayoutTemplate,
  Table,
  Image as ImageIcon,
  WrapText,
  Shapes,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Star,
  Zap,
  Split,
  PaintBucket,
  Layers,
  FileText,
  HelpCircle,
  Info,
  Sliders,
  Play,
  Pause,
  AlertTriangle,
  Move,
  Hash,
  Compass,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface PageCraftArcadeGameProps {
  onBack: () => void;
  studentName?: string;
}

type GameMode = 'blitz' | 'studio' | 'tabelomatic' | 'inspector';

interface BlitzTicket {
  id: string;
  category: 'table' | 'wrap' | 'ratio' | 'layer' | 'page';
  questionRo: string;
  questionEn: string;
  scenarioRo: string;
  scenarioEn: string;
  options: {
    id: string;
    textRo: string;
    textEn: string;
    correct: boolean;
    explanationRo: string;
    explanationEn: string;
  }[];
  visualHint?: string;
}

// Helper to randomly shuffle arrays (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const BLITZ_TICKETS: BlitzTicket[] = [
  {
    id: 't1_wrap_jump',
    category: 'wrap',
    questionRo: 'Imaginea inserată lasă un gol alb imens în pagină și textul a sărit dedesubt! Ce opțiune rezolvă problema?',
    questionEn: 'The inserted image leaves a massive blank gap and the text jumped below! Which option fixes this?',
    scenarioRo: 'Articol Revista Școlii • Text jumping bug',
    scenarioEn: 'School Gazette Article • Text jumping bug',
    options: [
      {
        id: 'opt_inline',
        textRo: 'În linie cu textul (In Line with Text)',
        textEn: 'In Line with Text',
        correct: false,
        explanationRo: 'In Line tratează poza ca o literă uriașă, cauzând exact acest gol inestetic!',
        explanationEn: 'In Line treats picture like a giant letter, causing the empty gap!',
      },
      {
        id: 'opt_square',
        textRo: 'Pătrat (Square / În jur)',
        textEn: 'Square (Text flows around bounding box)',
        correct: true,
        explanationRo: 'Corect! Modul Square face textul să curgă fluid pe laturile dreptunghiului imaginii.',
        explanationEn: 'Correct! Square wrapping allows text to flow smoothly along all sides.',
      },
      {
        id: 'opt_delete',
        textRo: 'Apasă Enter de 10 ori',
        textEn: 'Press Enter 10 times',
        correct: false,
        explanationRo: 'Enter repetat doar strică și mai tare macheta documentului!',
        explanationEn: 'Repeated Enters just ruin document layout further!',
      },
    ],
  },
  {
    id: 't2_ratio_distort',
    category: 'ratio',
    questionRo: 'Un coleg a tras de mânerul din mijloc-dreapta și poza cu Arky a devenit turtită! Cum redimensionăm CORECT?',
    questionEn: 'A classmate dragged the middle-right handle and Arky looks squished! How do we resize PROPERLY?',
    scenarioRo: 'Foto Club Robotică • Aspect Ratio Alert',
    scenarioEn: 'Robotics Club Photo • Aspect Ratio Alert',
    options: [
      {
        id: 'opt_corner',
        textRo: 'Tragem EXCLUSIV de mânerele de colț (Corner Handles)',
        textEn: 'Drag ONLY from the Corner Handles',
        correct: true,
        explanationRo: 'Excelent! Mânerele de colț păstrează raportul de aspect (proporțiile lățime:înălțime 1:1).',
        explanationEn: 'Excellent! Corner handles lock the aspect ratio perfectly.',
      },
      {
        id: 'opt_top_bottom',
        textRo: 'Tragem de marginea de sus și de jos',
        textEn: 'Drag from the top and bottom handles',
        correct: false,
        explanationRo: 'Mânerele laterale deformează poza și o fac să arate neprofesionist.',
        explanationEn: 'Side handles squash or stretch photos unnaturally.',
      },
      {
        id: 'opt_rotate',
        textRo: 'Rotim imaginea la 90 de grade',
        textEn: 'Rotate the picture 90 degrees',
        correct: false,
        explanationRo: 'Rotirea nu rezolvă deformarea proporțiilor.',
        explanationEn: 'Rotation does not restore aspect ratio.',
      },
    ],
  },
  {
    id: 't3_table_merge',
    category: 'table',
    questionRo: 'Avem 4 coloane în orar și vrem ca titlul „ORARUL CLASEI A V-A” să ocupe tot primul rând fără linii despărțitoare. Ce comandă dăm?',
    questionEn: 'We have 4 columns and want the title to span across the entire top row without dividers. What command do we use?',
    scenarioRo: 'Tabel Orar • Celule de Titlu',
    scenarioEn: 'Timetable • Title Banner Cells',
    options: [
      {
        id: 'opt_split',
        textRo: 'Scindare Celule (Split Cells)',
        textEn: 'Split Cells',
        correct: false,
        explanationRo: 'Split Cells împarte o celulă în bucăți mai mici, invers decât dorim!',
        explanationEn: 'Split divides a cell into smaller fragments, the opposite of what is needed!',
      },
      {
        id: 'opt_delete_row',
        textRo: 'Ștergere Rând',
        textEn: 'Delete Row',
        correct: false,
        explanationRo: 'Dacă ștergi rândul pierzi titlul complet!',
        explanationEn: 'Deleting row loses the entire header!',
      },
      {
        id: 'opt_merge',
        textRo: 'Îmbinare Celule (Merge Cells)',
        textEn: 'Merge Cells',
        correct: true,
        explanationRo: 'Bravo! Merge Cells combină mai multe celule selectate într-o singură celulă continuă.',
        explanationEn: 'Bravo! Merge Cells unites multiple selected cells into a unified banner.',
      },
    ],
  },
  {
    id: 't4_watermark_behind',
    category: 'wrap',
    questionRo: 'Vrem să punem sigla școlii ca filigran transparent peste care să se poată citi textul scrisorii oficiale. Ce mod alegem?',
    questionEn: 'We want the school logo as a transparent background watermark behind the letter text. Which wrap mode is best?',
    scenarioRo: 'Antet Oficial • Filigran Fundal',
    scenarioEn: 'Official Letterhead • Watermark Background',
    options: [
      {
        id: 'opt_front',
        textRo: 'În fața textului (In Front of Text)',
        textEn: 'In Front of Text',
        correct: false,
        explanationRo: 'In Front of Text va acoperi literele și le va face imposibil de citit!',
        explanationEn: 'In Front covers and blocks the underlying reading text!',
      },
      {
        id: 'opt_behind',
        textRo: 'În spatele textului (Behind Text)',
        textEn: 'Behind Text',
        correct: true,
        explanationRo: 'Super! Behind Text așază grafica pe fundal, lăsând literele vizibile deasupra.',
        explanationEn: 'Super! Behind Text sends visual elements to the background canvas.',
      },
      {
        id: 'opt_tight',
        textRo: 'Strâns (Tight)',
        textEn: 'Tight',
        correct: false,
        explanationRo: 'Tight respinge textul în jurul conturului, nu îl lasă să treacă peste imagine.',
        explanationEn: 'Tight pushes text away along the silhouette.',
      },
    ],
  },
  {
    id: 't5_page_numbering',
    category: 'page',
    questionRo: 'Dacă scrii manual cifra „1” în subsolul paginii 1, ce se va întâmpla pe pagina 2 și pagina 3?',
    questionEn: 'If you manually type the number "1" in page 1 footer, what will happen on page 2 and page 3?',
    scenarioRo: 'Numerotare Document • Capcană Frecventă',
    scenarioEn: 'Document Pagination • Common Pitfall',
    options: [
      {
        id: 'opt_auto_increment',
        textRo: 'Word va ști singur să le schimbe în 2 și 3',
        textEn: 'Word automatically increments static numbers',
        correct: false,
        explanationRo: 'Fals! Calculatorul nu ghicește, textul scris simplu rămâne identic peste tot.',
        explanationEn: 'False! Static text repeats identically on all sheets.',
      },
      {
        id: 'opt_static_fail',
        textRo: 'Toate paginile vor arăta greșit cifra „1”!',
        textEn: 'Every page will incorrectly show the digit "1"!',
        correct: true,
        explanationRo: 'Exact! Antetul și subsolul se repetă pe toate foile. Trebuie inserat câmpul dinamic {PAGE}!',
        explanationEn: 'Exactly! Headers/footers repeat. You must insert dynamic {PAGE} field code!',
      },
      {
        id: 'opt_crash',
        textRo: 'Documentul se va bloca și va cere restart',
        textEn: 'The document will crash and reboot',
        correct: false,
        explanationRo: 'Nu se blochează, doar afișează numerotarea greșită!',
        explanationEn: 'It will simply display duplicated page numbers.',
      },
    ],
  },
  {
    id: 't6_bring_to_front',
    category: 'layer',
    questionRo: 'Ai desenat o formă galbenă și o casetă de text cu „OFERTĂ SPECIALĂ”, dar forma galbenă a acoperit textul. Ce comandă rezolvă stiva?',
    questionEn: 'You drew a yellow star and a text box with "SPECIAL OFFER", but the star covers the text. How to fix the stack?',
    scenarioRo: 'Afiș Târg Școlar • Ordinea Straturilor',
    scenarioEn: 'School Fair Poster • Layer Z-Order',
    options: [
      {
        id: 'opt_delete_all',
        textRo: 'Ștergem totul și desenăm invers',
        textEn: 'Delete all and redraw in reverse',
        correct: false,
        explanationRo: 'Nu este nevoie să ștergi! Comenzile Bring Forward și Send Backward controlează ordinea.',
        explanationEn: 'No need to redraw! Z-order buttons adjust layer hierarchy instantly.',
      },
      {
        id: 'opt_zoom',
        textRo: 'Mărim zoom-ul la 200%',
        textEn: 'Increase zoom to 200%',
        correct: false,
        explanationRo: 'Zoom-ul doar mărește vederea, nu schimbă ordinea straturilor.',
        explanationEn: 'Zooming in does not modify layer arrangement.',
      },
      {
        id: 'opt_bring_front',
        textRo: 'Selectăm textul și dăm „Adu în față” (Bring Forward / Bring to Front)',
        textEn: 'Select text box and click "Bring to Front"',
        correct: true,
        explanationRo: 'Corect! Aducerea în față plasează caseta de text pe stratul cel mai de sus.',
        explanationEn: 'Correct! Bring to front moves the element to the top layer.',
      },
    ],
  },
  {
    id: 't7_orientation_landscape',
    category: 'page',
    questionRo: 'Pentru o Diplomă școlară lată sau un tabel cu 8 coloane de note, ce orientare a paginii este recomandată?',
    questionEn: 'For a wide school diploma or an 8-column grade spreadsheet, which page orientation is best?',
    scenarioRo: 'Format Pagină • Alegere Orientare',
    scenarioEn: 'Page Format • Orientation Choice',
    options: [
      {
        id: 'opt_portrait',
        textRo: 'Portret / Vertical (Portrait)',
        textEn: 'Portrait (Vertical)',
        correct: false,
        explanationRo: 'Portrait este îngust (21 cm), un tabel cu 8 coloane ar fi foarte înghesuit.',
        explanationEn: 'Portrait is narrower, squeezing columns tightly.',
      },
      {
        id: 'opt_landscape',
        textRo: 'Vedere / Orizontal (Landscape)',
        textEn: 'Landscape (Horizontal)',
        correct: true,
        explanationRo: 'Exact! Landscape oferă lățime maximă pentru diplome și tabele complexe.',
        explanationEn: 'Exactly! Landscape gives extra width for diplomas and wide tables.',
      },
      {
        id: 'opt_square_page',
        textRo: 'Pătrat 1:1 (Square Page)',
        textEn: 'Square Page 1:1',
        correct: false,
        explanationRo: 'Hârtia standard de imprimantă este A4 dreptunghiulară, nu pătrată.',
        explanationEn: 'Standard office paper is A4 rectangular.',
      },
    ],
  },
  {
    id: 't8_tab_key',
    category: 'table',
    questionRo: 'Ești în ultima celulă din dreapta-jos a unui tabel și vrei să adaugi rapid un nou rând pentru un elev nou. Ce tastă apeși?',
    questionEn: 'You are in the bottom-right cell of a table and want to instantly append a new row for a new student. Which key do you press?',
    scenarioRo: 'Productivitate Tastatură • Navigare Tabel',
    scenarioEn: 'Keyboard Productivity • Table Navigation',
    options: [
      {
        id: 'opt_tab',
        textRo: 'Tasta TAB ↹',
        textEn: 'The TAB key ↹',
        correct: true,
        explanationRo: 'Formidabil! Apăsarea tastei TAB în ultima celulă creează instant un rând nou gol dedesubt.',
        explanationEn: 'Formidable! Pressing TAB in the final cell automatically appends a new row below.',
      },
      {
        id: 'opt_space',
        textRo: 'Bara de Spațiu',
        textEn: 'Spacebar',
        correct: false,
        explanationRo: 'Spațiul doar introduce un caracter gol în celulă.',
        explanationEn: 'Spacebar just adds a blank text space.',
      },
      {
        id: 'opt_escape',
        textRo: 'Tasta ESC',
        textEn: 'Escape key',
        correct: false,
        explanationRo: 'Esc anulează selecții, nu creează rânduri.',
        explanationEn: 'ESC cancels selections, does not append rows.',
      },
    ],
  },
  {
    id: 't9_crop_vs_resize',
    category: 'ratio',
    questionRo: 'Care este diferența dintre decupare (Crop) și redimensionare (Resize)?',
    questionEn: 'What is the distinction between Cropping and Resizing an image?',
    scenarioRo: 'Procesare Imagini • Decupare vs Scalare',
    scenarioEn: 'Image Processing • Crop vs Resize',
    options: [
      {
        id: 'opt_same',
        textRo: 'Sunt două denumiri identice pentru aceeași comandă',
        textEn: 'They are identical terms for the exact same tool',
        correct: false,
        explanationRo: 'Complet fals! Au roluri grafice total diferite.',
        explanationEn: 'Completely false! They serve completely different layout roles.',
      },
      {
        id: 'opt_crop_color',
        textRo: 'Decuparea schimbă culorile în alb-negru',
        textEn: 'Crop turns colors black and white',
        correct: false,
        explanationRo: 'Crop nu alterează culorile, doar taie din cadru.',
        explanationEn: 'Crop does not alter palette colors.',
      },
      {
        id: 'opt_crop_diff',
        textRo: 'Decuparea taie marginile nedorite; Redimensionarea modifică mărimea totală',
        textEn: 'Crop cuts off unwanted edges; Resize scales the total dimensions',
        correct: true,
        explanationRo: 'Absolut corect! Crop înlătură fundalul inutil, în timp ce Resize micșorează sau mărește poza.',
        explanationEn: 'Spot on! Crop eliminates unwanted margins, while Resize scales the picture.',
      },
    ],
  },
  {
    id: 't10_cell_shading',
    category: 'table',
    questionRo: 'Cum se numește aplicarea unei culori de fundal pe celulele de antet ale unui tabel?',
    questionEn: 'What is the formatting tool used to apply a background fill color to table header cells?',
    scenarioRo: 'Stil Tabel • Culoare Fundal',
    scenarioEn: 'Table Style • Background Color',
    options: [
      {
        id: 'opt_underline',
        textRo: 'Subliniere Text (Underline)',
        textEn: 'Underline',
        correct: false,
        explanationRo: 'Sublinierea trage o linie sub litere, nu colorează celula.',
        explanationEn: 'Underline places a line under text, does not fill cells.',
      },
      {
        id: 'opt_shading',
        textRo: 'Umplere / Umbră (Shading - Găleata de Vopsea)',
        textEn: 'Shading (Paint Bucket Fill)',
        correct: true,
        explanationRo: 'Excelent! Shading (Umplere) colorează fundalul celulelor selectate.',
        explanationEn: 'Excellent! Shading fills the background of the selected cells.',
      },
      {
        id: 'opt_font_size',
        textRo: 'Mărimea Fontului (Font Size)',
        textEn: 'Font Size',
        correct: false,
        explanationRo: 'Mărimea fontului schimbă doar dimensiunea literelor.',
        explanationEn: 'Font size only adjusts character dimensions.',
      },
    ],
  },
  {
    id: 't11_group_shapes',
    category: 'layer',
    questionRo: 'Ai creat un ecuson dintr-o stea și o casetă de text. Cum le unești ca să le poți muta împreună ca pe un singur obiect?',
    questionEn: 'You created a badge with a star and a text box. How do you bind them so they move together as a single unit?',
    scenarioRo: 'Desene & Forme • Unire Obiecte',
    scenarioEn: 'Shapes & Drawings • Object Binding',
    options: [
      {
        id: 'opt_compress',
        textRo: 'Comprimare Fișier ZIP',
        textEn: 'ZIP Compression',
        correct: false,
        explanationRo: 'Arhivarea ZIP este pentru fișiere pe disc, nu pentru forme în pagină!',
        explanationEn: 'ZIP is for storage files, not graphical page shapes!',
      },
      {
        id: 'opt_group',
        textRo: 'Grupare (Group - Click Dreapta > Group)',
        textEn: 'Group (Right Click > Group)',
        correct: true,
        explanationRo: 'Genial! Comanda Group le leagă într-un singur bloc grafic ușor de repoziționat.',
        explanationEn: 'Genius! The Group command binds them into a unified draggable asset.',
      },
      {
        id: 'opt_delete_text',
        textRo: 'Ștergerea textului din casetă',
        textEn: 'Erase text box contents',
        correct: false,
        explanationRo: 'Dacă ștergi textul, pierzi mesajul ecusonului.',
        explanationEn: 'Erasing text eliminates the badge label.',
      },
    ],
  },
  {
    id: 't12_page_break',
    category: 'page',
    questionRo: 'Cum treci elegant pe o pagină nouă la începutul unui capitol nou, fără să apeși tasta Enter de 20 de ori?',
    questionEn: 'How do you cleanly transition to a fresh new page at chapter start without pressing Enter 20 times?',
    scenarioRo: 'Structură Pagină • Salt Curat',
    scenarioEn: 'Page Structure • Clean Break',
    options: [
      {
        id: 'opt_page_break',
        textRo: 'Inserare Sfârșit de Pagină (Page Break / Ctrl + Enter)',
        textEn: 'Insert Page Break (Ctrl + Enter)',
        correct: true,
        explanationRo: 'Perfect! Page Break trimite textul direct pe foaia următoare fără spații goale instabile.',
        explanationEn: 'Perfect! Page Break cleanly advances text to next page without unstable spaces.',
      },
      {
        id: 'opt_font_huge',
        textRo: 'Mărești fontul la 72 pt până cade textul',
        textEn: 'Increase font to 72pt until text overflows',
        correct: false,
        explanationRo: 'Mărirea forțată a fontului distruge aspectul documentului.',
        explanationEn: 'Enlarging font ruins document styling.',
      },
      {
        id: 'opt_restart_pc',
        textRo: 'Repornești calculatorul',
        textEn: 'Restart computer',
        correct: false,
        explanationRo: 'Repornirea nu adaugă pagini noi.',
        explanationEn: 'Restarting PC does not add pages.',
      },
    ],
  },
  {
    id: 't13_normal_margins',
    category: 'page',
    questionRo: 'Ce valoare au marginile standard „Normale” (Normal Margins) într-un document de text?',
    questionEn: 'What is the standard measurement for "Normal Margins" in a typical text document?',
    scenarioRo: 'Configurare Pagină • Margini Standard',
    scenarioEn: 'Page Setup • Standard Margins',
    options: [
      {
        id: 'opt_zero',
        textRo: '0 cm (imprimanta tipărește până în buza foii)',
        textEn: '0 cm (print reaches the physical sheet edge)',
        correct: false,
        explanationRo: 'Imprimantele fizice au nevoie de o margine minimă, nu pot tipări la 0 cm.',
        explanationEn: 'Physical printers need border clearance, 0cm will clip content.',
      },
      {
        id: 'opt_normal_margins',
        textRo: '2.54 cm (1 inch) pe toate cele 4 laturi',
        textEn: '2.54 cm (1 inch) on all 4 borders',
        correct: true,
        explanationRo: 'Exact! 2.54 cm pe Sus, Jos, Stânga și Dreapta este standardul internațional de tipar.',
        explanationEn: 'Exactly! 2.54 cm on Top, Bottom, Left and Right is standard.',
      },
      {
        id: 'opt_ten_cm',
        textRo: '10 cm pe fiecare parte',
        textEn: '10 cm on every side',
        correct: false,
        explanationRo: '10 cm ar lăsa doar o dungă minusculă de text pe mijloc!',
        explanationEn: '10 cm would leave only a tiny text sliver in the center!',
      },
    ],
  },
  {
    id: 't14_tight_wrap',
    category: 'wrap',
    questionRo: 'Pentru o imagine cu o mascotă decupată (fundal transparent PNG), ce mod face textul să îmbrățișeze silueta conturului?',
    questionEn: 'For a cutout mascot with a transparent PNG background, which wrap mode contours text along the silhouette?',
    scenarioRo: 'Machetare Grafică • Siluetă Transparentă',
    scenarioEn: 'Graphic Layout • Transparent Silhouette',
    options: [
      {
        id: 'opt_tight_correct',
        textRo: 'Strâns (Tight) sau Prin (Through)',
        textEn: 'Tight or Through',
        correct: true,
        explanationRo: 'Bravo! Modul Tight calculează conturul exact al formei și lasă textul să o îmbrățișeze.',
        explanationEn: 'Bravo! Tight wrapping contours text around the irregular silhouette.',
      },
      {
        id: 'opt_inline_fail',
        textRo: 'În linie cu textul (In Line)',
        textEn: 'In Line',
        correct: false,
        explanationRo: 'In Line nu poate urmări conturul, tratează poza ca o cutie rigidă.',
        explanationEn: 'In Line cannot follow contours; it treats the picture as a rigid box.',
      },
      {
        id: 'opt_top_bottom_fail',
        textRo: 'Sus și jos (Top and Bottom)',
        textEn: 'Top and Bottom',
        correct: false,
        explanationRo: 'Sus și jos interzice complet textul pe laturile stânga-dreapta.',
        explanationEn: 'Top and Bottom prohibits any text on the sides.',
      },
    ],
  },
];

// Helper to prepare freshly randomized tickets and options
export const prepareShuffledBlitzTickets = (): BlitzTicket[] => {
  return shuffleArray(BLITZ_TICKETS).map((ticket) => ({
    ...ticket,
    options: shuffleArray(ticket.options),
  }));
};

export const PageCraftArcadeGame: React.FC<PageCraftArcadeGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Mode Selection
  const [mode, setMode] = useState<GameMode>('blitz');

  // Sound toggle
  const [soundMuted, setSoundMuted] = useState(false);

  // Common Highscore
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_page_craft') || '0');
    } catch {
      return 0;
    }
  });

  // ========== BLITZ MODE STATE ==========
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(60);
  const [blitzActive, setBlitzActive] = useState(false);
  const [blitzGameOver, setBlitzGameOver] = useState(false);
  const [blitzTicketIdx, setBlitzTicketIdx] = useState(0);
  const [blitzStreak, setBlitzStreak] = useState(0);
  const [blitzMultiplier, setBlitzMultiplier] = useState(1);
  const [blitzFeedback, setBlitzFeedback] = useState<{
    correct: boolean;
    textRo: string;
    textEn: string;
    points: number;
  } | null>(null);

  // Shuffled blitz tickets with dynamically randomized option positions
  const [ticketsList, setTicketsList] = useState<BlitzTicket[]>(() => prepareShuffledBlitzTickets());

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Flash border feedback
  const [screenFlash, setScreenFlash] = useState<'green' | 'red' | null>(null);

  // ========== STUDIO MODE STATE (Interactive Newspaper Canvas) ==========
  const [studioStep, setStudioStep] = useState<number>(1);
  const [studioWrapMode, setStudioWrapMode] = useState<'inline' | 'square' | 'tight' | 'behind' | 'front'>('inline');
  const [studioImageAspect, setStudioImageAspect] = useState<'distorted' | 'clean'>('distorted');
  const [studioTableRows, setStudioTableRows] = useState(3);
  const [studioTableCols, setStudioTableCols] = useState(3);
  const [studioTableMerged, setStudioTableMerged] = useState(false);
  const [studioHeaderColor, setStudioHeaderColor] = useState<string>('#334155');
  const [studioStarLayer, setStudioStarLayer] = useState<'behind' | 'front'>('behind');
  const [studioPageOrientation, setStudioPageOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [studioFooterDynamic, setStudioFooterDynamic] = useState<boolean>(false);
  const [studioScore, setStudioScore] = useState<number>(0);
  const [studioStepSuccess, setStudioStepSuccess] = useState<boolean>(false);

  // ========== TABEL-O-MATIC STATE (Grid Matrix Puzzle) ==========
  const [gridTarget, setGridTarget] = useState<{ rows: number; cols: number; mergeHeader: boolean; headerColor: string }>({
    rows: 4,
    cols: 3,
    mergeHeader: true,
    headerColor: '#059669', // Emerald
  });
  const [userGridRows, setUserGridRows] = useState(2);
  const [userGridCols, setUserGridCols] = useState(2);
  const [userGridMerged, setUserGridMerged] = useState(false);
  const [userGridColor, setUserGridColor] = useState('#334155');
  const [tabelScore, setTabelScore] = useState(0);
  const [tabelRound, setTabelRound] = useState(1);
  const [tabelFeedback, setTabelFeedback] = useState<string | null>(null);

  // ========== INSPECTOR MODE STATE (Spot the Layout Blunder) ==========
  const [inspectorIdx, setInspectorIdx] = useState(0);
  const [inspectorScore, setInspectorScore] = useState(0);
  const [inspectorSolved, setInspectorSolved] = useState<Record<number, boolean>>({});

  const INSPECTOR_CASES = [
    {
      id: 'case_squished',
      titleRo: 'Cazul 1: Pisica Robotică Aplatizată!',
      titleEn: 'Case 1: The Flattened Robot Cat!',
      flawRo: 'Imaginea are raportul de aspect distrus (lățimea a fost trasă fără înălțime).',
      flawEn: 'The image aspect ratio is destroyed (width stretched without height).',
      imageSrc: '🐱🤖',
      isDistorted: true,
      options: [
        { id: 'opt1', textRo: 'Fix: Mai trage puțin și de sus ca să fie pătrată', textEn: 'Fix: Drag top handle too', correct: false },
        { id: 'opt2', textRo: 'Fix: Resetare raport de aspect 1:1 și tragere de colț', textEn: 'Fix: Reset 1:1 aspect ratio and drag corner handle', correct: true },
        { id: 'opt3', textRo: 'Fix: Schimbă fontul textului în Comic Sans', textEn: 'Fix: Change font to Comic Sans', correct: false },
      ],
    },
    {
      id: 'case_giant_gap',
      titleRo: 'Cazul 2: Golul Misterios din Pagină!',
      titleEn: 'Case 2: The Mysterious Blank Abyss!',
      flawRo: 'Un paragraf întreg are 10 centimetri de spațiu gol alb lângă o poză mică.',
      flawEn: 'An entire paragraph has a 10cm white void beside a small picture.',
      imageSrc: '🏞️📄',
      isDistorted: false,
      options: [
        { id: 'opt1', textRo: 'Fix: Comută Text Wrapping din "In Line" în "Square"', textEn: 'Fix: Switch Text Wrapping from "In Line" to "Square"', correct: true },
        { id: 'opt2', textRo: 'Fix: Umple spațiul apăsând bara de spațiu de 200 de ori', textEn: 'Fix: Press spacebar 200 times', correct: false },
        { id: 'opt3', textRo: 'Fix: Șterge tot textul articolului', textEn: 'Fix: Delete article text', correct: false },
      ],
    },
    {
      id: 'case_repeat_pages',
      titleRo: 'Cazul 3: Fantoamele Paginii 1!',
      titleEn: 'Case 3: The Ghosts of Page 1!',
      flawRo: 'Toate cele 15 foi imprimate au scris jos „Pagina 1 / 15”. Nimeni nu găsește pagina 2!',
      flawEn: 'All 15 printed pages display "Page 1 / 15" at the bottom!',
      imageSrc: '📑1️⃣',
      isDistorted: false,
      options: [
        { id: 'opt1', textRo: 'Fix: Printează fiecare pagină într-un fișier separat', textEn: 'Fix: Print each page in separate files', correct: false },
        { id: 'opt2', textRo: 'Fix: Numerotează cu pixul pe foaia de hârtie', textEn: 'Fix: Handwrite numbers with a ballpoint pen', correct: false },
        { id: 'opt3', textRo: 'Fix: Șterge cifra „1” manuală și inserează câmpul dinamic {PAGE}', textEn: 'Fix: Erase static "1" and insert dynamic {PAGE} field code', correct: true },
      ],
    },
    {
      id: 'case_hidden_title',
      titleRo: 'Cazul 4: Titlul Îngropat Sub Dreptunghi!',
      titleEn: 'Case 4: The Title Buried Under a Shape!',
      flawRo: 'Elevul a desenat un chenar albastru frumos, dar textul a dispărut complet din vedere.',
      flawEn: 'The student drew a blue shape, but the text box vanished completely.',
      imageSrc: '🟦❓',
      isDistorted: false,
      options: [
        { id: 'opt1', textRo: 'Fix: Schimbă luminozitatea monitorului', textEn: 'Fix: Adjust monitor brightness', correct: false },
        { id: 'opt2', textRo: 'Fix: Chenarul trebuie trimis în spate (Send to Back) sau textul adus în față', textEn: 'Fix: Send shape to Back or Bring text box to Front', correct: true },
        { id: 'opt3', textRo: 'Fix: Trage cablul de alimentare al calculatorului', textEn: 'Fix: Unplug computer power cable', correct: false },
      ],
    },
  ];

  // Sounds wrapper
  const playSound = (type: 'correct' | 'wrong' | 'success' | 'click') => {
    if (soundMuted) return;
    if (type === 'correct') sounds.playCorrect();
    else if (type === 'wrong') sounds.playWrong();
    else if (type === 'success') sounds.playSuccess();
    else if (type === 'click') sounds.playClick();
  };

  // Blitz Timer Effect
  useEffect(() => {
    if (blitzActive && blitzTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setBlitzTimeLeft((prev) => {
          if (prev <= 1) {
            handleBlitzEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [blitzActive, blitzTimeLeft]);

  const handleStartBlitz = () => {
    playSound('click');
    setBlitzScore(0);
    setBlitzTimeLeft(60);
    setBlitzActive(true);
    setBlitzGameOver(false);
    setBlitzTicketIdx(0);
    setBlitzStreak(0);
    setBlitzMultiplier(1);
    setBlitzFeedback(null);
    setTicketsList(prepareShuffledBlitzTickets());
    arky.triggerSuccess(
      lang === 'en'
        ? '⚡ Blitz Sprint Started! Solve layout orders before time runs out!'
        : '⚡ Start Blitz Sprint! Rezolvă comenzile de machetare contra cronometru!'
    );
  };

  const handleBlitzEnd = () => {
    setBlitzActive(false);
    setBlitzGameOver(true);
    playSound('success');

    // Update high scores
    if (blitzScore > highScore) {
      setHighScore(blitzScore);
      try {
        localStorage.setItem('arkedo_highscore_page_craft', String(blitzScore));
      } catch {
        // Ignore
      }
    }
    updateActiveArcadeScore('page_craft', blitzScore);
    arky.triggerSuccess(
      lang === 'en'
        ? `🏁 Blitz Finished! You scored ${blitzScore} pts in PageCraft!`
        : `🏁 Blitz Încheiat! Ai obținut ${blitzScore} puncte de arhitect în PageCraft!`
    );
  };

  const handleSelectBlitzOption = (correct: boolean, expRo: string, expEn: string) => {
    if (!blitzActive || blitzGameOver || blitzFeedback !== null) return;

    if (correct) {
      const basePoints = 50;
      const streakBonus = blitzStreak * 15;
      const earned = (basePoints + streakBonus) * blitzMultiplier;
      const newScore = blitzScore + earned;
      const newStreak = blitzStreak + 1;
      const newMult = newStreak >= 6 ? 4 : newStreak >= 4 ? 3 : newStreak >= 2 ? 2 : 1;

      // Bonus time on streaks
      if (newStreak % 3 === 0) {
        setBlitzTimeLeft((t) => Math.min(90, t + 5));
      }

      setBlitzScore(newScore);
      setBlitzStreak(newStreak);
      setBlitzMultiplier(newMult);
      setScreenFlash('green');
      playSound('correct');

      setBlitzFeedback({
        correct: true,
        textRo: expRo,
        textEn: expEn,
        points: earned,
      });
    } else {
      playSound('wrong');
      setScreenFlash('red');
      setBlitzStreak(0);
      setBlitzMultiplier(1);
      setBlitzFeedback({
        correct: false,
        textRo: expRo,
        textEn: expEn,
        points: 0,
      });
    }

    setTimeout(() => {
      setScreenFlash(null);
      setBlitzFeedback(null);
      setBlitzTicketIdx((prev) => (prev + 1) % ticketsList.length);
    }, 1200);
  };

  // ========== TABEL-O-MATIC GENERATOR & CHECKER ==========
  const generateNewTabelTarget = () => {
    const rows = 2 + Math.floor(Math.random() * 3); // 2 to 4
    const cols = 2 + Math.floor(Math.random() * 3); // 2 to 4
    const merge = Math.random() > 0.4;
    const colors = ['#059669', '#2563eb', '#7c3aed', '#d97706'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    setGridTarget({ rows, cols, mergeHeader: merge, headerColor: chosenColor });
    setUserGridRows(2);
    setUserGridCols(2);
    setUserGridMerged(false);
    setUserGridColor('#334155');
    setTabelFeedback(null);
  };

  const handleValidateTabel = () => {
    playSound('click');
    const isRowMatch = userGridRows === gridTarget.rows;
    const isColMatch = userGridCols === gridTarget.cols;
    const isMergeMatch = userGridMerged === gridTarget.mergeHeader;
    const isColorMatch = userGridColor === gridTarget.headerColor;

    if (isRowMatch && isColMatch && isMergeMatch && isColorMatch) {
      playSound('correct');
      const roundEarned = 100;
      const nextScore = tabelScore + roundEarned;
      setTabelScore(nextScore);
      setTabelRound((r) => r + 1);
      setTabelFeedback(
        lang === 'en'
          ? `🎉 Perfect Table Match! +${roundEarned} pts`
          : `🎉 Potrivire Perfectă a Tabelului! +${roundEarned} puncte`
      );
      if (nextScore > highScore) {
        setHighScore(nextScore);
        try {
          localStorage.setItem('arkedo_highscore_page_craft', String(nextScore));
        } catch {
          // Ignore
        }
      }
      updateActiveArcadeScore('page_craft', nextScore);
      setTimeout(() => {
        generateNewTabelTarget();
      }, 1400);
    } else {
      playSound('wrong');
      const hints: string[] = [];
      if (!isRowMatch) hints.push(`Rânduri: ai ${userGridRows}, țintă ${gridTarget.rows}`);
      if (!isColMatch) hints.push(`Coloane: ai ${userGridCols}, țintă ${gridTarget.cols}`);
      if (!isMergeMatch) hints.push(gridTarget.mergeHeader ? 'Trebuie bifată Îmbinare Titlu!' : 'Nu îmbina titlul!');
      if (!isColorMatch) hints.push('Culoarea antetului nu corespunde!');
      setTabelFeedback(`⚠️ ${hints.join(' • ')}`);
    }
  };

  // Inspector check
  const handleSolveInspectorCase = (optionCorrect: boolean) => {
    if (optionCorrect) {
      playSound('correct');
      const newScore = inspectorScore + 100;
      setInspectorScore(newScore);
      setInspectorSolved((prev) => ({ ...prev, [inspectorIdx]: true }));
      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          localStorage.setItem('arkedo_highscore_page_craft', String(newScore));
        } catch {
          // Ignore
        }
      }
      updateActiveArcadeScore('page_craft', newScore);
    } else {
      playSound('wrong');
    }
  };

  const currentBlitzTicket = ticketsList[blitzTicketIdx] || BLITZ_TICKETS[0];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border-2 border-indigo-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSound('click');
              onBack();
            }}
            className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'en' ? 'Back to Arcade Hub' : 'Înapoi la Mini-Jocuri'}</span>
          </button>

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-lg ring-2 ring-indigo-400/30">
            📑
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/40">
                ARCADE 4B • MODUL NOU
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {lang === 'en' ? 'Document & Layout Master' : 'Arhitect de Machetare & Tabele'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
              PageCraft: Table & Layout Studio
            </h1>
          </div>
        </div>

        {/* High Score & Audio Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/90 px-3.5 py-2 rounded-2xl border border-amber-500/30 font-mono text-xs shadow-inner">
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">High Score</div>
              <div className="font-black text-amber-300 text-sm">{highScore} XP</div>
            </div>
          </div>

          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title={soundMuted ? 'Activează Sunet' : 'Dezactivează Sunet'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => {
            playSound('click');
            setMode('blitz');
          }}
          className={`px-3 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'blitz'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>⚡ Blitz 60s Sprint</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setMode('studio');
          }}
          className={`px-3 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'studio'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>📰 Atelierul Live</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setMode('tabelomatic');
          }}
          className={`px-3 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'tabelomatic'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>🧩 Tabel-O-Matic</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setMode('inspector');
          }}
          className={`px-3 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'inspector'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>🔍 Inspectorul TIC</span>
        </button>
      </div>

      {/* ================= MODE 1: BLITZ 60S SPRINT ================= */}
      {mode === 'blitz' && (
        <div className="flex flex-col gap-5">
          {/* Status HUD Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Clock className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">TIMP RĂMAS</div>
                <div className={`text-xl font-black font-mono ${blitzTimeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                  {blitzTimeLeft}s
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">PUNCTAJ BLITZ</div>
                <div className="text-xl font-black font-mono text-amber-300">
                  {blitzScore} XP
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Flame className={`w-5 h-5 ${blitzStreak > 0 ? 'animate-bounce' : ''}`} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">COMBO STREAK</div>
                <div className="text-xl font-black font-mono text-orange-300">
                  {blitzStreak} 🔥 ({blitzMultiplier}x)
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-center">
              {!blitzActive ? (
                <button
                  onClick={handleStartBlitz}
                  className="w-full h-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
                >
                  <Play className="w-4 h-4" />
                  <span>{blitzGameOver ? 'Reîncepe Blitz' : 'Start Blitz 60s'}</span>
                </button>
              ) : (
                <button
                  onClick={handleBlitzEnd}
                  className="w-full h-full py-2 px-4 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>Încheie Runda</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Question Arena */}
          {!blitzActive && !blitzGameOver && (
            <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-indigo-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-4xl shadow-xl shadow-orange-500/30 animate-float">
                ⚡
              </div>
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                  {lang === 'en' ? '60-Second Layout Sprint Challenge' : 'Provocarea de 60 de Secunde: Sprint de Machetare'}
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {lang === 'en'
                    ? 'Orders from school magazine editors, teachers, and book designers are pouring in! Pick the correct word processing tools: Text Wrapping, Aspect Ratio, Merge Cells, and Page Orientation!'
                    : 'Comenzile de machetare sosesc în viteză maximă! Rezolvă cerințele redacției: Încadrarea textului (Square, Behind), Raport de aspect la poze, Îmbinare celule și Paginare A4!'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-400">
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">🎯 +50 XP per răspuns corect</span>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">🔥 Multiplicator până la 4x pe streak</span>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">⏱️ +5 secunde bonus la 3 streak</span>
              </div>

              <button
                onClick={handleStartBlitz}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-base transition flex items-center gap-3 shadow-xl shadow-orange-500/30 cursor-pointer active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{lang === 'en' ? 'START BLITZ NOW' : 'START SPRINT BLITZ ACUM'}</span>
              </button>
            </div>
          )}

          {blitzActive && (
            <div
              className={`relative bg-slate-900/95 border-2 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 ${
                screenFlash === 'green'
                  ? 'border-emerald-400 shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                  : screenFlash === 'red'
                  ? 'border-rose-500 shadow-rose-500/30 ring-4 ring-rose-500/20'
                  : 'border-indigo-500/40'
              }`}
            >
              {/* Question Category & Badge */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/40 flex items-center gap-1.5">
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  {currentBlitzTicket.scenarioRo}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  Comanda #{blitzTicketIdx + 1}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-black text-white font-heading leading-snug mb-6">
                {lang === 'en' ? currentBlitzTicket.questionEn : currentBlitzTicket.questionRo}
              </h2>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {currentBlitzTicket.options.map((opt, i) => (
                  <button
                    key={opt.id}
                    disabled={blitzFeedback !== null}
                    onClick={() => handleSelectBlitzOption(opt.correct, opt.explanationRo, opt.explanationEn)}
                    className="p-4 rounded-2xl bg-slate-800/80 hover:bg-indigo-950/60 border-2 border-slate-700 hover:border-indigo-500 text-left transition flex items-start gap-3.5 group cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:border-indigo-400 group-hover:text-indigo-300 shrink-0 mt-0.5">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white group-hover:text-indigo-200">
                        {lang === 'en' ? opt.textEn : opt.textRo}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Immediate Feedback Banner */}
              {blitzFeedback && (
                <div
                  className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-3 transition-all ${
                    blitzFeedback.correct
                      ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/90 border-rose-500/60 text-rose-200'
                  }`}
                >
                  {blitzFeedback.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold">
                      {blitzFeedback.correct ? `+${blitzFeedback.points} XP! ` : 'Greșit! '}
                    </span>
                    <span>{lang === 'en' ? blitzFeedback.textEn : blitzFeedback.textRo}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {blitzGameOver && (
            <div className="bg-slate-900/95 border-2 border-amber-500/50 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-3xl text-amber-400">
                🏆
              </div>
              <div>
                <h3 className="text-2xl font-black text-white font-heading">
                  {lang === 'en' ? 'Round Complete!' : 'Rundă Încheiată cu Succes!'}
                </h3>
                <p className="text-slate-300 text-sm mt-1">
                  {lang === 'en'
                    ? `You generated ${blitzScore} XP in layout tickets!`
                    : `Ai acumulat ${blitzScore} XP prin decizii corecte de machetare!`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm w-full font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Punctaj Obținut</div>
                  <div className="text-lg font-black text-amber-300">{blitzScore} XP</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Record Personal</div>
                  <div className="text-lg font-black text-emerald-300">{highScore} XP</div>
                </div>
              </div>

              <button
                onClick={handleStartBlitz}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'en' ? 'Play Again' : 'Joacă din Nou'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= MODE 2: ATELIERUL LIVE (Interactive Newspaper Canvas) ================= */}
      {mode === 'studio' && (
        <div className="flex flex-col gap-6">
          {/* Mission Steps Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
            {[
              { step: 1, titleRo: '1. Tabel Orar', titleEn: '1. Timetable', icon: '📊' },
              { step: 2, titleRo: '2. Text Wrap', titleEn: '2. Text Wrap', icon: '🖼️' },
              { step: 3, titleRo: '3. Raport Aspect', titleEn: '3. Aspect Ratio', icon: '📐' },
              { step: 4, titleRo: '4. Forme & Straturi', titleEn: '4. Layers', icon: '⭐' },
              { step: 5, titleRo: '5. Paginare A4', titleEn: '5. A4 Margins', icon: '📄' },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  playSound('click');
                  setStudioStep(s.step);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  studioStep === s.step
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{s.icon}</span>
                <span className="truncate">{lang === 'en' ? s.titleEn : s.titleRo}</span>
              </button>
            ))}
          </div>

          {/* Interactive Workspace Split: Controls (Left) & Live Document (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Control Panel (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  {lang === 'en' ? `Studio Step ${studioStep}/5` : `Pasul ${studioStep}/5`}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  Live Canvas Reflow
                </span>
              </div>

              {/* Step 1: Table Creation & Merge */}
              {studioStep === 1 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-black text-white font-heading">
                    {lang === 'en' ? 'Design Timetable Matrix' : 'Construiește & Formatează Tabelul'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'en'
                      ? 'Adjust rows and columns, merge the header banner, and pick a custom shading color.'
                      : 'Ajustează numărul de linii și coloane, îmbină celulele pentru titlu și alege culoarea de umplere a antetului.'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400">Rânduri ({studioTableRows})</label>
                      <input
                        type="range"
                        min="2"
                        max="5"
                        value={studioTableRows}
                        onChange={(e) => setStudioTableRows(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400">Coloane ({studioTableCols})</label>
                      <input
                        type="range"
                        min="2"
                        max="5"
                        value={studioTableCols}
                        onChange={(e) => setStudioTableCols(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        playSound('click');
                        setStudioTableMerged(!studioTableMerged);
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        studioTableMerged
                          ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Split className="w-3.5 h-3.5" />
                      <span>{studioTableMerged ? '✓ Celule Îmbinate' : 'Îmbină Celule Titlu'}</span>
                    </button>
                  </div>

                  <div className="mt-1">
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Culoare Umplere Antet (Shading)</label>
                    <div className="flex gap-2">
                      {['#334155', '#059669', '#2563eb', '#7c3aed', '#e11d48'].map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            playSound('click');
                            setStudioHeaderColor(c);
                          }}
                          style={{ backgroundColor: c }}
                          className={`w-7 h-7 rounded-lg border-2 transition cursor-pointer ${
                            studioHeaderColor === c ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Text Wrapping */}
              {studioStep === 2 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-black text-white font-heading">
                    {lang === 'en' ? 'Text Wrapping Engine' : 'Motorul de Încadrare Text (Wrap)'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'en'
                      ? 'Test how article text reflows around the school nature illustration in real-time!'
                      : 'Observă cum textul articolului se rearanjează automat în jurul imaginii când schimbi modul!'}
                  </p>

                  <div className="grid grid-cols-1 gap-2 mt-1">
                    {[
                      { id: 'inline', name: 'În linie cu textul (In Line)', desc: 'Literele sar, creează gol masiv' },
                      { id: 'square', name: 'Pătrat (Square)', desc: 'Textul curge elegant pe laturi' },
                      { id: 'tight', name: 'Strâns (Tight)', desc: 'Urmează fidel conturul' },
                      { id: 'behind', name: 'În spatele textului (Behind)', desc: 'Efect de fundal / filigran' },
                      { id: 'front', name: 'În fața textului (In Front)', desc: 'Acoperă și blochează citirea' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          playSound('click');
                          setStudioWrapMode(w.id as any);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                          studioWrapMode === w.id
                            ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-inner'
                            : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{w.name}</div>
                          <div className="text-[10px] text-slate-400">{w.desc}</div>
                        </div>
                        {studioWrapMode === w.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Aspect Ratio Clinic */}
              {studioStep === 3 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-black text-white font-heading">
                    {lang === 'en' ? 'Aspect Ratio Clinic' : 'Clinica de Proporții (Aspect Ratio)'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'en'
                      ? 'Distorting photos by dragging side handles ruins layout quality. Restore the 1:1 proportion with corner handles!'
                      : 'Tragerea de laturi deformează poza. Restaurează proporția nativă folosind colțurile!'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => {
                        playSound('wrong');
                        setStudioImageAspect('distorted');
                      }}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        studioImageAspect === 'distorted'
                          ? 'bg-rose-950/80 border-rose-500/80 text-rose-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">↔️ 🔲</div>
                      <div className="text-xs font-bold">Poza Deformată</div>
                      <div className="text-[10px] text-rose-400 mt-0.5">Tras de mâner lateral</div>
                    </button>

                    <button
                      onClick={() => {
                        playSound('correct');
                        setStudioImageAspect('clean');
                      }}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        studioImageAspect === 'clean'
                          ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">📐 ✨</div>
                      <div className="text-xs font-bold">Proporții Corecte</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Tras de mâner de colț</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Shapes & Layer Stacking */}
              {studioStep === 4 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-black text-white font-heading">
                    {lang === 'en' ? 'Shape & Layer Hierarchy' : 'Ierarhia Formelor & Ordinea Straturilor'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'en'
                      ? 'Adjust the badge layer order: Bring Forward or Send Backward.'
                      : 'Controlează ordinea straturilor (Z-Order): Adu în Față sau Trimite în Spate!'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => {
                        playSound('click');
                        setStudioStarLayer('behind');
                      }}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        studioStarLayer === 'behind'
                          ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold">Trimite în Spate</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Send to Back</div>
                    </button>

                    <button
                      onClick={() => {
                        playSound('correct');
                        setStudioStarLayer('front');
                      }}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        studioStarLayer === 'front'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold">Adu în Față</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Bring to Front</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Page Setup & Pagination */}
              {studioStep === 5 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-black text-white font-heading">
                    {lang === 'en' ? 'A4 Format & Dynamic Pagination' : 'Format A4 & Numerotare Dinamică'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'en'
                      ? 'Switch page orientation and inject automatic page numbering fields.'
                      : 'Comută orientarea paginii și activează câmpul dinamic de numerotare automată.'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button
                      onClick={() => {
                        playSound('click');
                        setStudioPageOrientation('portrait');
                      }}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                        studioPageOrientation === 'portrait'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      📄 Portret (Vertical)
                    </button>
                    <button
                      onClick={() => {
                        playSound('click');
                        setStudioPageOrientation('landscape');
                      }}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                        studioPageOrientation === 'landscape'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      📜 Vedere (Orizontal)
                    </button>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={() => {
                        playSound('correct');
                        setStudioFooterDynamic(!studioFooterDynamic);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        studioFooterDynamic
                          ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Hash className="w-4 h-4" />
                      <span>{studioFooterDynamic ? '✓ Câmp Dinamic {PAGE} Activ' : 'Inserează Câmp Dinamic {PAGE}'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Document Preview Sheet (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950/90 border-2 border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
              {/* Document Sheet Header */}
              <div className="border-b border-slate-700 pb-2.5 mb-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  <FileText className="w-3.5 h-3.5" />
                  REVISTA_SCOLARA_PAGINA_1.DOCX
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                  {studioPageOrientation === 'portrait' ? 'Format A4 Portret (21 × 29.7 cm)' : 'Format A4 Vedere (29.7 × 21 cm)'}
                </span>
              </div>

              {/* Document Sheet Paper Canvas */}
              <div
                className={`bg-white text-slate-900 rounded-xl p-5 shadow-2xl transition-all duration-500 relative flex-1 flex flex-col justify-between ${
                  studioPageOrientation === 'landscape' ? 'w-full aspect-[4/3]' : 'w-full aspect-[3/4]'
                }`}
              >
                {/* Antet Pagină (Header) */}
                <div className="border-b border-slate-300 pb-1.5 mb-3 flex items-center justify-between text-[9px] font-sans font-bold text-slate-500 uppercase tracking-widest">
                  <span>Eco-Revista Școlii • Gimnaziu</span>
                  <span>Numărul 4 / Octombrie</span>
                </div>

                {/* Article Content Area */}
                <div className="flex-1 text-[11px] leading-relaxed text-slate-800 relative">
                  <h4 className="text-sm font-black font-heading text-slate-950 mb-2">
                    Proiectul „Școala Verde”: Tehnologie și Natură în Armonie
                  </h4>

                  {/* Dynamic Graphic Asset with Wrap Mode Reaction */}
                  <div
                    className={`relative transition-all duration-300 p-1.5 rounded-lg border ${
                      studioWrapMode === 'behind'
                        ? 'absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center'
                        : studioWrapMode === 'front'
                        ? 'absolute top-10 left-10 z-20 shadow-2xl bg-white/95 border-indigo-400'
                        : studioWrapMode === 'inline'
                        ? 'block my-3 bg-slate-50 border-slate-300'
                        : 'float-right ml-3 mb-2 bg-slate-50 border-slate-300 shadow-md'
                    }`}
                  >
                    <div
                      className={`text-center transition-all ${
                        studioImageAspect === 'distorted' ? 'scale-x-150 scale-y-75 border-2 border-dashed border-rose-500' : 'scale-100'
                      }`}
                    >
                      <div className="text-3xl">🌳🤖</div>
                      <div className="text-[8px] font-bold text-slate-600">Arky & Copacul Verde</div>
                    </div>
                  </div>

                  <p className="mb-2">
                    În cadrul orelor de TIC, elevii au învățat să transforme documentele obișnuite în lucrări de revistă profesioniste. Tabelele sintetizează datele activităților ecologice, în timp ce imaginile bine încadrate oferă claritate vizuală.
                  </p>

                  {/* Render Table */}
                  <div className="my-3 overflow-hidden rounded border border-slate-400 text-[10px]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr style={{ backgroundColor: studioHeaderColor }} className="text-white">
                          {studioTableMerged ? (
                            <th colSpan={studioTableCols} className="p-1.5 text-center font-bold">
                              CALENDARUL ACTIVITĂȚILOR ECOLOGICE (ÎMBINAT)
                            </th>
                          ) : (
                            Array.from({ length: studioTableCols }).map((_, c) => (
                              <th key={c} className="p-1 border border-slate-300 text-center font-semibold">
                                Col {c + 1}
                              </th>
                            ))
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: studioTableRows - 1 }).map((_, r) => (
                          <tr key={r} className={r % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                            {Array.from({ length: studioTableCols }).map((_, c) => (
                              <td key={c} className="p-1 border border-slate-300 text-center text-slate-700">
                                Celulă R{r + 1}:C{c + 1}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Floating Star Badge (Layer Test) */}
                  <div
                    className={`absolute bottom-6 right-4 px-2 py-1 rounded bg-amber-400 border border-amber-500 text-[9px] font-black text-amber-950 flex items-center gap-1 shadow transition-all ${
                      studioStarLayer === 'front' ? 'z-30 ring-2 ring-indigo-500 scale-105' : 'z-0 opacity-60'
                    }`}
                  >
                    <span>⭐</span>
                    <span>APROBAT DE ELEVI</span>
                  </div>
                </div>

                {/* Subsol Pagină (Footer) */}
                <div className="border-t border-slate-300 pt-1.5 mt-3 flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <span>Document redactat de clasa a V-a</span>
                  <span className={`font-bold ${studioFooterDynamic ? 'text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded' : 'text-slate-600'}`}>
                    {studioFooterDynamic ? 'Pagina {PAGE} din {NUMPAGES}' : 'Pagina 1 (Static)'}
                  </span>
                </div>
              </div>

              {/* Bottom Evaluation Banner */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-300 font-mono">
                  {studioStep === 1 && studioTableMerged && <span className="text-emerald-400">✓ Titlu tabel îmbinat cu succes!</span>}
                  {studioStep === 2 && studioWrapMode === 'square' && <span className="text-emerald-400">✓ Modul Square asigură curgerea optimă!</span>}
                  {studioStep === 3 && studioImageAspect === 'clean' && <span className="text-emerald-400">✓ Raportul de aspect este salvat!</span>}
                  {studioStep === 4 && studioStarLayer === 'front' && <span className="text-emerald-400">✓ Eticheta este vizibilă deasupra!</span>}
                  {studioStep === 5 && studioFooterDynamic && <span className="text-emerald-400">✓ Câmp dinamic activat corect!</span>}
                </div>

                <button
                  onClick={() => {
                    playSound('success');
                    const nextStep = (studioStep % 5) + 1;
                    setStudioStep(nextStep);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer active:scale-95"
                >
                  Următorul Pas →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODE 3: TABEL-O-MATIC (Matrix Puzzle) ================= */}
      {mode === 'tabelomatic' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Matrix Card */}
            <div className="bg-slate-900/95 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                    COMANDA #{tabelRound} • MATRICEA ȚINTĂ
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    Scor: {tabelScore} XP
                  </span>
                </div>

                <h3 className="text-base font-black text-white font-heading mb-2">
                  Clientul are nevoie de acest tabel exact:
                </h3>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300 mb-4">
                  <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    Linii: <strong>{gridTarget.rows}</strong>
                  </span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    Coloane: <strong>{gridTarget.cols}</strong>
                  </span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    Îmbinare: <strong>{gridTarget.mergeHeader ? 'DA (Merge)' : 'NU'}</strong>
                  </span>
                </div>

                {/* Target Visual Render */}
                <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-inner">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr style={{ backgroundColor: gridTarget.headerColor }} className="text-white">
                        {gridTarget.mergeHeader ? (
                          <th colSpan={gridTarget.cols} className="p-2 border border-slate-300 text-center font-bold">
                            TITLU UNIFICAT ({gridTarget.cols} COLOANE)
                          </th>
                        ) : (
                          Array.from({ length: gridTarget.cols }).map((_, c) => (
                            <th key={c} className="p-2 border border-slate-300 text-center font-semibold">
                              C{c + 1}
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: gridTarget.rows - 1 }).map((_, r) => (
                        <tr key={r}>
                          {Array.from({ length: gridTarget.cols }).map((_, c) => (
                            <td key={c} className="p-2 border border-slate-300 text-center text-slate-600">
                              {r + 1}:{c + 1}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-800">
                Ajustează comenzile din dreapta până când tabelul tău este identic cu cel țintă!
              </div>
            </div>

            {/* Student Workshop Builder Card */}
            <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                    MASA TA DE LUCRU
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Rânduri ({userGridRows})</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUserGridRows((r) => Math.max(2, r - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-white text-sm">{userGridRows}</span>
                      <button
                        onClick={() => setUserGridRows((r) => Math.min(5, r + 1))}
                        className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Coloane ({userGridCols})</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUserGridCols((c) => Math.max(2, c - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-white text-sm">{userGridCols}</span>
                      <button
                        onClick={() => setUserGridCols((c) => Math.min(5, c + 1))}
                        className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => {
                      playSound('click');
                      setUserGridMerged(!userGridMerged);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      userGridMerged
                        ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Split className="w-3.5 h-3.5" />
                    <span>{userGridMerged ? '✓ Celule Îmbinate' : 'Îmbină Primul Rând'}</span>
                  </button>

                  <div className="flex gap-1.5">
                    {['#059669', '#2563eb', '#7c3aed', '#d97706'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          playSound('click');
                          setUserGridColor(c);
                        }}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-lg border-2 transition cursor-pointer ${
                          userGridColor === c ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* User Current Render */}
                <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-inner">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr style={{ backgroundColor: userGridColor }} className="text-white">
                        {userGridMerged ? (
                          <th colSpan={userGridCols} className="p-2 border border-slate-300 text-center font-bold">
                            TITLU UNIFICAT ({userGridCols} COLOANE)
                          </th>
                        ) : (
                          Array.from({ length: userGridCols }).map((_, c) => (
                            <th key={c} className="p-2 border border-slate-300 text-center font-semibold">
                              C{c + 1}
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: userGridRows - 1 }).map((_, r) => (
                        <tr key={r}>
                          {Array.from({ length: userGridCols }).map((_, c) => (
                            <td key={c} className="p-2 border border-slate-300 text-center text-slate-600">
                              {r + 1}:{c + 1}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Feedback & Submit */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-3">
                {tabelFeedback && (
                  <div className="text-xs font-bold text-center font-mono py-1 px-3 rounded-lg bg-slate-950 text-amber-300 border border-slate-800">
                    {tabelFeedback}
                  </div>
                )}
                <button
                  onClick={handleValidateTabel}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publică & Validează Tabelul!</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODE 4: INSPECTORUL TIC ================= */}
      {mode === 'inspector' && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/90 border-2 border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-mono font-bold border border-pink-500/30">
                DETECTIVUL DE GREȘELI TIC • CAZUL {inspectorIdx + 1} DIN {INSPECTOR_CASES.length}
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Scor Detectiv: {inspectorScore} XP
              </span>
            </div>

            {/* Case Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6">
              <div className="text-5xl shrink-0 p-4 rounded-2xl bg-slate-900 border border-slate-700">
                {INSPECTOR_CASES[inspectorIdx].imageSrc}
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-heading">
                  {lang === 'en' ? INSPECTOR_CASES[inspectorIdx].titleEn : INSPECTOR_CASES[inspectorIdx].titleRo}
                </h3>
                <p className="text-xs sm:text-sm text-rose-300 mt-1 font-mono">
                  🚨 {lang === 'en' ? INSPECTOR_CASES[inspectorIdx].flawEn : INSPECTOR_CASES[inspectorIdx].flawRo}
                </p>
              </div>
            </div>

            {/* Solution Options */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
              Cum rezolvi această eroare în mod profesionist?
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {INSPECTOR_CASES[inspectorIdx].options.map((opt, i) => (
                <button
                  key={opt.id}
                  onClick={() => handleSolveInspectorCase(opt.correct)}
                  className="p-4 rounded-2xl bg-slate-800/80 hover:bg-pink-950/40 border-2 border-slate-700 hover:border-pink-500 text-left transition flex items-center justify-between gap-3 group cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:border-pink-400 group-hover:text-pink-300 shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-pink-200">
                      {lang === 'en' ? opt.textEn : opt.textRo}
                    </span>
                  </div>
                  {inspectorSolved[inspectorIdx] && opt.correct && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Case Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  playSound('click');
                  setInspectorIdx((prev) => Math.max(0, prev - 1));
                }}
                disabled={inspectorIdx === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
              >
                ← Cazul Anterior
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setInspectorIdx((prev) => (prev + 1) % INSPECTOR_CASES.length);
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition cursor-pointer active:scale-95"
              >
                Următorul Caz →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
