import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

export type DuelGameMode = 'cyber_sprint' | 'block_coding' | 'speed_crafting' | 'quiz_blitz' | 'cyber_shield' | 'pc_rush' | 'file_battle' | 'roblox_clicker';

export type CodeBlockType =
  | 'start'
  | 'move_forward'
  | 'turn_left'
  | 'turn_right'
  | 'repeat_2'
  | 'repeat_3'
  | 'collect';

export interface GridCoord {
  x: number;
  y: number;
}

export interface BlockCodingChallenge {
  id: number;
  level: number;
  title: string;
  story: string;
  concept: string;
  gridSize: { width: number; height: number };
  startPos: GridCoord;
  startDirection: 'N' | 'E' | 'S' | 'W';
  targetPos: GridCoord;
  targetName: string;
  obstacles: GridCoord[];
  collectibles: GridCoord[];
  parBlocks: number;
  allowedBlocks: CodeBlockType[];
  hint: string;
}

export interface DuelPlayer {
  id: string; // Unique client device/session id
  name: string;
  avatar: string;
  isReady: boolean;
  score: number;
  progress: number; // 0 to 100%
  currentWordIndex?: number;
  currentQuestionIndex?: number;
  currentStageIndex?: number;
  finishedAt?: number;
  lastActive: number;
}

export interface QuizQuestionItem {
  id: number;
  q: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CyberShieldItem {
  id: number;
  sender: string;
  subject: string;
  body: string;
  linkOrAttachment?: string;
  isThreat: boolean; // true = Phishing / Malware / Fake; false = Safe / Official
  threatType?: string; // e.g. 'Phishing Link', 'Malware .exe', 'Parolă Cerută', 'Mesaj Sigur de la Școală'
  explanation: string;
}

export interface PCRushPart {
  id: string;
  name: string;
  slot: string; // 'cpu' | 'cooler' | 'ram1' | 'ram2' | 'gpu' | 'ssd' | 'psu'
  slotLabel: string;
  icon: string;
  specs: string;
  stepOrder: number; // 1 to 6
  hint: string;
}

export interface DuelRoomData {
  id: string; // Document ID (usually room code uppercase)
  roomCode: string; // e.g. "TIC-84", "CYBER7"
  mode: DuelGameMode;
  status: 'waiting' | 'countdown' | 'playing' | 'finished';
  countdownValue?: number;
  host: DuelPlayer;
  guest: DuelPlayer | null;
  textSnippet?: string; // For Cyber Sprint typing
  questions?: QuizQuestionItem[]; // For Quiz Blitz
  shieldItems?: CyberShieldItem[]; // For Cyber Shield
  pcPartsOrder?: PCRushPart[]; // For Hardware PC Rush
  codingChallenges?: BlockCodingChallenge[]; // For Cursa Algoritmilor (Block Coding Duel)
  fileQueue?: Array<{ name: string; ext: string; folder: string }>; // For File Battle
  winnerId?: string | 'tie';
  winnerName?: string;
  createdAt: number;
  updatedAt: number;
}

// Generate client device ID to identify host vs guest
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem('arkedo_duel_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      localStorage.setItem('arkedo_duel_device_id', id);
    }
    return id;
  } catch {
    return 'dev_' + Math.random().toString(36).substring(2, 10);
  }
}

// Generate a friendly 4-6 char room code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Sample Curated Prompts for Cyber Sprint
export const CYBER_SPRINT_TEXTS: string[] = [
  'Parola sigura are litere mari, mici, cifre si caractere speciale ca sa blocheze atacurile hackerilor.',
  'Firewall-ul analizeaza pachetele de date din retea si protejeaza calculatoarele impotriva virusilor.',
  'Un octet are 8 biti, iar un gigabyte contine 1024 de megabytes de memorie digitala.',
  'Nu deschide fisiere atasate suspecte primite pe email de la adrese necunoscute de phishing.',
  'Placa de baza conecteaza procesorul CPU, memoria RAM si unitatea de stocare rapida SSD.',
  'Imaginile digitale sunt formate din pixeli compusi din cele trei culori primare: Rosu, Verde si Albastru.'
];

// Sample Quiz Blitz Questions
export const DUEL_QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: 1,
    q: 'Ce componentă hardware este considerată „creierul” calculatorului?',
    options: ['Procesorul (CPU)', 'Placa Video (GPU)', 'Sursa de Curent', 'Hard Disk-ul'],
    correctIndex: 0,
    explanation: 'CPU (Central Processing Unit) execută toate calculele și instrucțiunile programelor.'
  },
  {
    id: 2,
    q: 'Câți biți (bit) formează exact un Byte (Octet)?',
    options: ['4 biți', '8 biți', '16 biți', '1024 biți'],
    correctIndex: 1,
    explanation: '1 Byte (Octet) = 8 biți (valori de 0 și 1).'
  },
  {
    id: 3,
    q: 'Ce extensie indică un fișier executabil care poate fi periculos?',
    options: ['.docx', '.png', '.exe', '.mp3'],
    correctIndex: 2,
    explanation: '.exe reprezintă un program executabil și poate rula malware dacă este piratat.'
  },
  {
    id: 4,
    q: 'Ce este un atac de tip Phishing?',
    options: ['O metodă de curățare a ecranului', 'Un email fals conceput pentru a fura parole', 'O viteză mare la internet', 'O placă de rețea'],
    correctIndex: 1,
    explanation: 'Phishing-ul păcălește utilizatorii cu mesaje înșelătoare pentru a obține credențiale.'
  },
  {
    id: 5,
    q: 'Care este combinația de taste rapidă pentru copiere (Copy)?',
    options: ['Ctrl + V', 'Ctrl + Z', 'Ctrl + C', 'Ctrl + X'],
    correctIndex: 2,
    explanation: 'Ctrl + C este comanda universală de copiere în clipboard.'
  },
  {
    id: 6,
    q: 'Ce culori formează modelul de lumină RGB la monitoare?',
    options: ['Roșu, Galben, Albastru', 'Roșu, Verde, Albastru', 'Roz, Gri, Negru', 'Cyan, Magenta, Galben'],
    correctIndex: 1,
    explanation: 'RGB vine de la Red (Roșu), Green (Verde) și Blue (Albastru).'
  },
  {
    id: 7,
    q: 'Care dispozitiv este atât de intrare, cât și de ieșire?',
    options: ['Tastatura', 'Monitorul Touchscreen', 'Boxele', 'Mouse-ul optic'],
    correctIndex: 1,
    explanation: 'Ecranul tactil afișează imagini (ieșire) și primește atingeri cu degetul (intrare).'
  },
  {
    id: 8,
    q: 'Ce rol are memoria RAM într-un sistem de calcul?',
    options: ['Stocare permanentă', 'Memorie de lucru ultrarapidă temporară', 'Alimentare cu energie', 'Răcirea carcasei'],
    correctIndex: 1,
    explanation: 'RAM păstrează programele și datele deschise în timp ce calculatorul funcționează.'
  }
];

// Cyber Shield Scenarios (Phishing vs Safe)
export const DUEL_CYBER_SHIELD_ITEMS: CyberShieldItem[] = [
  {
    id: 1,
    sender: 'security@ro-bancaa-alert.xyz',
    subject: '🚨 URGENT: Contul tău a fost blocat!',
    body: 'Contul bancar va fi suspendat în 10 minute dacă nu confirmi parola și CNP-ul făcând click pe butonul de mai jos.',
    linkOrAttachment: 'http://verificare-card-urgent.net/login',
    isThreat: true,
    threatType: 'Phishing Bancar',
    explanation: 'Domeniu fals (.xyz, .net), sentiment de panică falsă și cerere directă de parolă.'
  },
  {
    id: 2,
    sender: 'secretariat@scoala-arkedo.edu.ro',
    subject: '📚 Orarul cursurilor TIC pentru semestrul 2',
    body: 'Bună ziua! Vă trimitem atașat noul tabel cu laboratoarele de informatică pentru clasa a V-a.',
    linkOrAttachment: 'Orar_TIC_Clasa5.pdf',
    isThreat: false,
    threatType: 'Email Școlar Sigur',
    explanation: 'Adresă oficială .edu.ro, conținut legitim și fișier de tip document .pdf sigur.'
  },
  {
    id: 3,
    sender: 'giveaway@free-robux-fortnite.club',
    subject: '🎁 Ai câștigat 10.000 V-Bucks & Robux GRATIS!',
    body: 'Felicitări! Ești al 1.000-lea vizitator. Descarcă generatorul gratuit și instalează-l pentru monede!',
    linkOrAttachment: 'Free_Robux_Generator_2026.exe',
    isThreat: true,
    threatType: 'Troian / Malware Executabil',
    explanation: 'Fișierul .exe de la o sursă necunoscută este malware/virus ascuns!'
  },
  {
    id: 4,
    sender: 'noreply@google.com',
    subject: 'Cod de verificare securitate Google',
    body: 'Codul tău de verificare în 2 pași este 492810. Dacă nu ai solicitat tu acest cod, ignoră mesajul.',
    linkOrAttachment: 'https://myaccount.google.com/security',
    isThreat: false,
    threatType: 'Notificare 2FA Oficială',
    explanation: 'Email legitim de la domeniul oficial google.com pentru autentificare în 2 pași.'
  },
  {
    id: 5,
    sender: 'admin@insta-unfollowers-tracker.top',
    subject: '⚠️ Vezi cine ți-a dat unfollow pe Instagram!',
    body: 'Introdu numele de utilizator și parola contului tău pentru a debloca raportul complet secret.',
    linkOrAttachment: 'http://insta-hack-spy.top/auth',
    isThreat: true,
    threatType: 'Furt de Conturi Social Media',
    explanation: 'Aplicațiile terțe care îți cer parola sunt capcane de phishing pentru a fura conturi.'
  },
  {
    id: 6,
    sender: 'profesor.geografie@scoala.ro',
    subject: 'Harta interactivă pentru test',
    body: 'Dragi elevi, găsiți link-ul către harta oficială pentru recapitularea de mâine.',
    linkOrAttachment: 'https://geografie.edu.ro/harti',
    isThreat: false,
    threatType: 'Material Didactic Sigur',
    explanation: 'Link securizat HTTPS pe domeniul educațional național.'
  },
  {
    id: 7,
    sender: 'lottery-intl@win-billion-cash.biz',
    subject: '💰 Ați moștenit 500.000 EUR din Elveția',
    body: 'Pentru a transfera fondurile în contul dvs., trimiteți o taxă notarială de 50 EUR prin crypto.',
    linkOrAttachment: 'http://transfer-fonduri-securizat.biz',
    isThreat: true,
    threatType: 'Scam Financiar (Înșelătorie)',
    explanation: 'Nicio loterie sau bancă reală nu cere plăți în avans pentru a debloca presupuse premii.'
  },
  {
    id: 8,
    sender: 'support@discord.com',
    subject: 'Confirmare activare cont Discord',
    body: 'Bine ai venit pe serverul educațional al clasei! Apasă pentru a verifica adresa de email.',
    linkOrAttachment: 'https://discord.com/verify',
    isThreat: false,
    threatType: 'Verificare Serviciu Sigur',
    explanation: 'Domeniu oficial discord.com cu certificat SSL valid.'
  }
];

// Hardware PC Rush Parts Definition
export const DUEL_PC_PARTS: PCRushPart[] = [
  {
    id: 'cpu',
    name: 'Procesor Central (CPU)',
    slot: 'cpu',
    slotLabel: 'Socket Procesor (LGA)',
    icon: '🧠',
    specs: 'Octa-Core 4.2 GHz',
    stepOrder: 1,
    hint: 'Pasul 1: Se instalează mai întâi creierul PC-ului direct în socket-ul plăcii de bază.'
  },
  {
    id: 'cooler',
    name: 'Cooler & Pastă Termică',
    slot: 'cooler',
    slotLabel: 'Sistem Răcire CPU',
    icon: '❄️',
    specs: 'Ventilator Silențios 120mm',
    stepOrder: 2,
    hint: 'Pasul 2: Se montează deasupra procesorului pentru a preveni supraîncălzirea.'
  },
  {
    id: 'ram',
    name: 'Memorie RAM Dual-Channel',
    slot: 'ram',
    slotLabel: 'Sloturi DIMM RAM (DDR5)',
    icon: '⚡',
    specs: '16GB DDR5 5600MHz',
    stepOrder: 3,
    hint: 'Pasul 3: Se clipsează în sloturile DIMM pentru memorie de lucru ultrarapidă.'
  },
  {
    id: 'ssd',
    name: 'Unitate Stocare NVMe SSD',
    slot: 'ssd',
    slotLabel: 'Slot M.2 PCIe Gen4',
    icon: '💾',
    specs: '1TB NVMe (7000 MB/s)',
    stepOrder: 4,
    hint: 'Pasul 4: Se fixează în slotul M.2 pentru sistemul de operare și fișiere.'
  },
  {
    id: 'gpu',
    name: 'Placă Video Dedicată (GPU)',
    slot: 'gpu',
    slotLabel: 'Slot PCIe x16 (Grafică)',
    icon: '🎮',
    specs: '8GB GDDR6 Ray-Tracing',
    stepOrder: 5,
    hint: 'Pasul 5: Se introduce ferm în slotul lung PCIe pentru randare grafică 3D.'
  },
  {
    id: 'psu',
    name: 'Sursă de Alimentare (PSU)',
    slot: 'psu',
    slotLabel: 'Conectori Alimentare 24-Pin',
    icon: '🔌',
    specs: '650W 80+ Gold Modular',
    stepOrder: 6,
    hint: 'Pasul 6: Alimentează toate componentele cu energie electrică stabilă!'
  }
];

// Block Coding Challenges for "Cursa Algoritmilor (Block Coding Duel)"
export const DUEL_BLOCK_CODING_CHALLENGES: BlockCodingChallenge[] = [
  {
    id: 1,
    level: 1,
    title: 'Nivelul 1: Primul Script Liniar',
    story: 'Arky a detectat Serverul Central la 4 pași distanță! Scrie algoritmul corect pentru a colecta steaua de date și a ajunge la destinație.',
    concept: 'Secvențialitate & Pași Înainte',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 0, y: 2 },
    startDirection: 'E',
    targetPos: { x: 4, y: 2 },
    targetName: 'Serverul Central',
    obstacles: [
      { x: 2, y: 1 },
      { x: 2, y: 3 }
    ],
    collectibles: [
      { x: 2, y: 2 }
    ],
    parBlocks: 4,
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right', 'collect', 'repeat_2', 'repeat_3'],
    hint: 'Apasă pe „Mergi în față” de 4 ori sau folosește bucla repetă pentru un traseu direct!'
  },
  {
    id: 2,
    level: 2,
    title: 'Nivelul 2: Ocolirea Zidului Firewall',
    story: 'Un firewall de securitate blochează drumul direct! Ghidează-l pe Arky făcând viraje precise la 90° pentru a ocoli obstacolele.',
    concept: 'Viraje la 90° (Stânga / Dreapta)',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 0, y: 4 },
    startDirection: 'N',
    targetPos: { x: 3, y: 1 },
    targetName: 'Terminalul Școlii',
    obstacles: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 }
    ],
    collectibles: [
      { x: 0, y: 2 },
      { x: 3, y: 3 }
    ],
    parBlocks: 7,
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right', 'collect', 'repeat_2', 'repeat_3'],
    hint: 'Mergi 2 pași spre Nord, virează la Dreapta (Est) 3 pași, apoi virează la Stânga (Nord) spre Terminal!'
  },
  {
    id: 3,
    level: 3,
    title: 'Nivelul 3: Bucle & Structuri Repetitive',
    story: 'Traseul are un tipar de scară repetitiv! Folosește blocul de buclă „Repetă de 3 ori” pentru a scurta scriptul și a depăși oponentul.',
    concept: 'Bucle Scratch (Repetă de 3x)',
    gridSize: { width: 6, height: 6 },
    startPos: { x: 0, y: 5 },
    startDirection: 'N',
    targetPos: { x: 5, y: 0 },
    targetName: 'Portalul Cuantic TIC',
    obstacles: [
      { x: 1, y: 4 },
      { x: 2, y: 3 },
      { x: 3, y: 2 },
      { x: 4, y: 1 }
    ],
    collectibles: [
      { x: 1, y: 5 },
      { x: 3, y: 3 },
      { x: 5, y: 1 }
    ],
    parBlocks: 6,
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right', 'repeat_2', 'repeat_3', 'collect'],
    hint: 'Observă modelul de urcare: pas, viraj, pas, viraj! Buclele îți salvează timp prețios în duel.'
  },
  {
    id: 4,
    level: 4,
    title: 'Nivelul 4: Labirintul Bug-urilor Hackerilor',
    story: 'Misiunea finală de campion! Navighează prin rețeaua infectată de bug-uri, evită capcanele laser și activează Baza de Date Securizată.',
    concept: 'Gândire Algoritmică Avansată',
    gridSize: { width: 6, height: 6 },
    startPos: { x: 0, y: 0 },
    startDirection: 'E',
    targetPos: { x: 5, y: 5 },
    targetName: 'Baza de Date Criptată',
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 }
    ],
    collectibles: [
      { x: 0, y: 2 },
      { x: 2, y: 4 },
      { x: 5, y: 3 }
    ],
    parBlocks: 10,
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right', 'repeat_2', 'repeat_3', 'collect'],
    hint: 'Gândește întregul traseu înainte de rulare! O singură greșeală declanșează alarma de firewall.'
  }
];

// Create Room (Host)
export async function createDuelRoom(
  playerName: string,
  playerAvatar: string,
  mode: DuelGameMode
): Promise<DuelRoomData | null> {
  const code = generateRoomCode();
  const deviceId = getDeviceId();

  const hostPlayer: DuelPlayer = {
    id: deviceId,
    name: playerName || 'Jucător 1',
    avatar: playerAvatar || '⚡',
    isReady: true,
    score: 0,
    progress: 0,
    currentWordIndex: 0,
    currentQuestionIndex: 0,
    currentStageIndex: 0,
    lastActive: Date.now()
  };

  const textSnippet = CYBER_SPRINT_TEXTS[Math.floor(Math.random() * CYBER_SPRINT_TEXTS.length)];
  const shuffledQuestions = [...DUEL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
  const shuffledShieldItems = [...DUEL_CYBER_SHIELD_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
  const pcParts = [...DUEL_PC_PARTS];
  const codingChallenges = [...DUEL_BLOCK_CODING_CHALLENGES];

  const roomData: DuelRoomData = {
    id: code,
    roomCode: code,
    mode,
    status: 'waiting',
    countdownValue: 3,
    host: hostPlayer,
    guest: null,
    textSnippet,
    questions: shuffledQuestions,
    shieldItems: shuffledShieldItems,
    pcPartsOrder: pcParts,
    codingChallenges,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  if (db) {
    try {
      const roomRef = doc(db, 'duel_rooms', code);
      await setDoc(roomRef, roomData);
      return roomData;
    } catch (err) {
      console.warn('⚠️ Nu s-a putut crea camera pe cloud, fallback local:', err);
    }
  }

  // Local fallback storage for single PC demo or simulated testing
  try {
    localStorage.setItem('arkedo_local_duel_room_' + code, JSON.stringify(roomData));
  } catch {}
  return roomData;
}

// Join Room (Guest)
export async function joinDuelRoom(
  roomCode: string,
  playerName: string,
  playerAvatar: string
): Promise<{ success: boolean; error?: string; room?: DuelRoomData }> {
  const cleanCode = roomCode.trim().toUpperCase();
  const deviceId = getDeviceId();

  if (!cleanCode) {
    return { success: false, error: 'Introdu codul camerei (ex: 8492).' };
  }

  const guestPlayer: DuelPlayer = {
    id: deviceId,
    name: playerName || 'Jucător 2',
    avatar: playerAvatar || '🚀',
    isReady: true,
    score: 0,
    progress: 0,
    currentWordIndex: 0,
    currentQuestionIndex: 0,
    lastActive: Date.now()
  };

  if (db) {
    try {
      const roomRef = doc(db, 'duel_rooms', cleanCode);
      const snap = await getDoc(roomRef);

      if (!snap.exists()) {
        return { success: false, error: 'Camera cu codul "' + cleanCode + '" nu a fost găsită.' };
      }

      const roomData = snap.data() as DuelRoomData;

      if (roomData.status !== 'waiting') {
        return { success: false, error: 'Meciul din această cameră a început deja sau este finalizat.' };
      }

      if (roomData.host.id === deviceId) {
        return { success: true, room: roomData };
      }

      if (roomData.guest && roomData.guest.id !== deviceId) {
        return { success: false, error: 'Camera este deja plină (2/2 jucători).' };
      }

      // Add guest to room
      await updateDoc(roomRef, {
        guest: guestPlayer,
        updatedAt: Date.now()
      });

      return { success: true, room: { ...roomData, guest: guestPlayer } };
    } catch (err) {
      console.warn('⚠️ Eroare la intrare în cameră Firebase:', err);
      return { success: false, error: 'Eroare de conexiune la camera de joc.' };
    }
  }

  // Local storage fallback
  try {
    const local = localStorage.getItem('arkedo_local_duel_room_' + cleanCode);
    if (local) {
      const parsed = JSON.parse(local) as DuelRoomData;
      parsed.guest = guestPlayer;
      localStorage.setItem('arkedo_local_duel_room_' + cleanCode, JSON.stringify(parsed));
      return { success: true, room: parsed };
    }
  } catch {}

  return { success: false, error: 'Camera nu a fost găsită.' };
}

// Start match (Host triggers start countdown)
export async function startDuelMatch(roomCode: string): Promise<void> {
  const cleanCode = roomCode.trim().toUpperCase();

  if (db) {
    try {
      const roomRef = doc(db, 'duel_rooms', cleanCode);
      await updateDoc(roomRef, {
        status: 'countdown',
        countdownValue: 3,
        updatedAt: Date.now()
      });
    } catch (err) {
      console.warn('Eroare start meci:', err);
    }
  }
}

// Update player live score and progress
export async function updateDuelProgress(
  roomCode: string,
  isHost: boolean,
  data: Partial<DuelPlayer>,
  allFinishedWinnerId?: string,
  winnerName?: string
): Promise<void> {
  const cleanCode = roomCode.trim().toUpperCase();

  if (db) {
    try {
      const roomRef = doc(db, 'duel_rooms', cleanCode);
      const updatePayload: Record<string, any> = {
        updatedAt: Date.now()
      };

      if (isHost) {
        for (const [k, v] of Object.entries(data)) {
          updatePayload[`host.${k}`] = v;
        }
      } else {
        for (const [k, v] of Object.entries(data)) {
          updatePayload[`guest.${k}`] = v;
        }
      }

      if (allFinishedWinnerId) {
        updatePayload.status = 'finished';
        updatePayload.winnerId = allFinishedWinnerId;
        if (winnerName) {
          updatePayload.winnerName = winnerName;
        }
      }

      await updateDoc(roomRef, updatePayload);
    } catch (err) {
      console.warn('Eroare update duel progress:', err);
    }
  }
}

// Set room to playing status (after countdown)
export async function setRoomPlaying(roomCode: string): Promise<void> {
  const cleanCode = roomCode.trim().toUpperCase();
  if (db) {
    try {
      const roomRef = doc(db, 'duel_rooms', cleanCode);
      await updateDoc(roomRef, {
        status: 'playing',
        updatedAt: Date.now()
      });
    } catch (err) {}
  }
}

// Real-time Room Listener
export function subscribeToDuelRoom(
  roomCode: string,
  onUpdate: (room: DuelRoomData | null) => void
): Unsubscribe {
  const cleanCode = roomCode.trim().toUpperCase();

  if (db) {
    const roomRef = doc(db, 'duel_rooms', cleanCode);
    return onSnapshot(
      roomRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data() as DuelRoomData);
        } else {
          onUpdate(null);
        }
      },
      (err) => {
        console.warn('Eroare ascultare camera duel:', err);
        onUpdate(null);
      }
    );
  }

  // Local poller fallback
  const interval = setInterval(() => {
    try {
      const raw = localStorage.getItem('arkedo_local_duel_room_' + cleanCode);
      if (raw) {
        onUpdate(JSON.parse(raw));
      }
    } catch {}
  }, 1000);

  return () => clearInterval(interval);
}

// Leave / Delete Room
export async function leaveDuelRoom(roomCode: string, isHost: boolean): Promise<void> {
  const cleanCode = roomCode.trim().toUpperCase();
  if (db) {
    try {
      const roomRef = doc(db, 'duel_rooms', cleanCode);
      if (isHost) {
        await deleteDoc(roomRef);
      } else {
        await updateDoc(roomRef, {
          guest: null,
          updatedAt: Date.now()
        });
      }
    } catch (err) {}
  }
}
