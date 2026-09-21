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

export type DuelGameMode = 'cyber_sprint' | 'quiz_blitz' | 'file_battle';

export interface DuelPlayer {
  id: string; // Unique client device/session id
  name: string;
  avatar: string;
  isReady: boolean;
  score: number;
  progress: number; // 0 to 100%
  currentWordIndex?: number;
  currentQuestionIndex?: number;
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
    lastActive: Date.now()
  };

  const textSnippet = CYBER_SPRINT_TEXTS[Math.floor(Math.random() * CYBER_SPRINT_TEXTS.length)];
  const shuffledQuestions = [...DUEL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);

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
