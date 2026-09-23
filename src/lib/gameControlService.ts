import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  getDocs,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isCloudConnected } from './firebase';

export interface GameDefinition {
  id: string;
  titleRo: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  iconName: string;
  descRo: string;
  descEn: string;
  gradeBadge: string;
}

export interface GameSettings {
  allGamesOpen: boolean;
  gameStatus: Record<string, boolean>; // true = deschis, false = inchis de profesor
  customMessage: string;
  updatedAt: number;
}

export interface StudentUnlockRequest {
  id?: string;
  gameId: string;
  gameTitle: string;
  studentName: string;
  studentAvatar: string;
  timestamp: number;
  status: 'pending' | 'resolved';
}

export const ALL_GAMES: GameDefinition[] = [
  {
    id: 'typing',
    titleRo: 'Vitezomanul Tastaturii',
    titleEn: 'Speed Typing TIC',
    category: 'Viteză & Tastatură',
    categoryEn: 'Typing & Speed',
    iconName: 'Keyboard',
    descRo: 'Tastează termeni reali din TIC (procesor, memorie, folder) contra cronometru.',
    descEn: 'Type curriculum computer science words under time pressure.',
    gradeBadge: 'Clasa V-VI',
  },
  {
    id: 'mouse',
    titleRo: 'Țintește & Click',
    titleEn: 'Mouse Precision',
    category: 'Periferice & Reflexe',
    categoryEn: 'Peripherals & Reflexes',
    iconName: 'MousePointer',
    descRo: 'Țintește și elimină fișiere virusate cu reflexe rapide și precizie de mouse.',
    descEn: 'Aim and click corrupted file nodes rapidly.',
    gradeBadge: 'Clasa V-VI',
  },
  {
    id: '2048',
    titleRo: '2048 Binar TIC',
    titleEn: 'Binary 2048',
    category: 'Binar & Matematică',
    categoryEn: 'Binary Math',
    iconName: 'Binary',
    descRo: 'Combină puterile lui 2 (2, 4, 8, 16... 1024, 2048) prin tastele săgeți.',
    descEn: 'Merge binary powers of 2 up to 2048.',
    gradeBadge: 'Clasa V-VI',
  },
  {
    id: 'pcbuilder',
    titleRo: 'Atelierul PC & Arhitectură',
    titleEn: 'Custom PC Builder',
    category: 'Hardware & Arhitectură',
    categoryEn: 'Hardware & Architecture',
    iconName: 'Cpu',
    descRo: 'Asamblează componente compatibile (CPU, RAM, Placă de bază, GPU, SSD) într-o carcasă.',
    descEn: 'Assemble matching PC components in a virtual rig.',
    gradeBadge: 'Unitatea 1',
  },
  {
    id: 'detective',
    titleRo: 'Detectivul Cyber-Safe',
    titleEn: 'Cyber-Safe Detective',
    category: 'Securitate & Internet',
    categoryEn: 'Security & Internet',
    iconName: 'ShieldCheck',
    descRo: 'Investighează capcane de phishing, linkuri false și pop-up-uri înșelătoare.',
    descEn: 'Investigate phishing traps, fake URLs, and suspicious popups.',
    gradeBadge: 'Unitatea 3',
  },
  {
    id: 'files',
    titleRo: 'Managerul de Fișiere',
    titleEn: 'File Tree Master',
    category: 'Sistem de Operare',
    categoryEn: 'Operating System',
    iconName: 'Folder',
    descRo: 'Organizează documente, imagini și muzică în structuri de directoare arborescente corecte.',
    descEn: 'Sort and organize file trees cleanly.',
    gradeBadge: 'Unitatea 2',
  },
  {
    id: 'binary_factory',
    titleRo: 'Fabrica Binară',
    titleEn: 'Binary Converter Factory',
    category: 'Binar & Matematică',
    categoryEn: 'Binary Math',
    iconName: 'Zap',
    descRo: 'Activează comutatoarele de biți (128, 64, 32, 16, 8, 4, 2, 1) pentru a forma numere zecimale.',
    descEn: 'Convert decimal targets into 8-bit binary packets.',
    gradeBadge: 'Unitatea 1',
  },
  {
    id: 'maze',
    titleRo: 'Labirintul Algoritmilor',
    titleEn: 'Algorithm Maze Runner',
    category: 'Algoritmi & Logică',
    categoryEn: 'Algorithms & Logic',
    iconName: 'Bot',
    descRo: 'Programează robotul Arky prin comenzi secvențiale (Înainte, Rotește, Colectează) spre ieșire.',
    descEn: 'Program Arky step-by-step through grid labyrinths.',
    gradeBadge: 'Algoritmi',
  },
  {
    id: 'firewall',
    titleRo: 'Apărătorul Firewall',
    titleEn: 'Firewall Packet Defender',
    category: 'Securitate & Internet',
    categoryEn: 'Security & Internet',
    iconName: 'ShieldAlert',
    descRo: 'Filtrează pachetele de date legitime și respinge atacurile malware și flood DDoS.',
    descEn: 'Filter TCP/IP packets and block DDoS attacks.',
    gradeBadge: 'Unitatea 3',
  },
  {
    id: 'rgb_pixel',
    titleRo: 'Maestrul Culorilor RGB',
    titleEn: 'RGB Pixel Studio',
    category: 'Grafică & Pixeli',
    categoryEn: 'Graphics & Pixels',
    iconName: 'Palette',
    descRo: 'Amestecă cele trei canale primare (Roșu, Verde, Albastru: 0-255) pentru a reproduce culori țintă.',
    descEn: 'Master color mixing with red, green, and blue channels.',
    gradeBadge: 'Grafică Digitală',
  },
  {
    id: 'byte_slider',
    titleRo: 'Convertor Unități Binar',
    titleEn: 'Byte & Bit Converter',
    category: 'Memorie & Unități',
    categoryEn: 'Storage & Units',
    iconName: 'Layers',
    descRo: 'Calculează capacități de stocare convertind rapid între B, KB, MB, GB și TB.',
    descEn: 'Scale and convert storage quantities smoothly.',
    gradeBadge: 'Unitatea 1',
  },
  {
    id: 'file_drop',
    titleRo: 'Căsuța de Sortare Fișiere',
    titleEn: 'File Drop Sorter',
    category: 'Sistem de Operare',
    categoryEn: 'Operating System',
    iconName: 'FileDown',
    descRo: 'Prinde fișierele în cădere și sortează-le după extensie (.docx, .jpg, .mp3, .zip, .exe).',
    descEn: 'Catch falling files and classify by extension.',
    gradeBadge: 'Unitatea 2',
  },
  {
    id: 'virus_sweeper',
    titleRo: 'Mina Cybernetică',
    titleEn: 'Cyber Sweeper',
    category: 'Algoritmi & Logică',
    categoryEn: 'Logic & Scanning',
    iconName: 'Biohazard',
    descRo: 'Găsește sectoarele corupte și izolează virușii fără a declanșa o infectare de sistem.',
    descEn: 'Uncover malware clusters using proximity counts.',
    gradeBadge: 'Securitate',
  },
  {
    id: 'cyber_dino',
    titleRo: 'Cyber Dinozaurul TIC',
    titleEn: 'Cyber Dino Runner',
    category: 'Arcade Clasic',
    categoryEn: 'Classic Arcade',
    iconName: 'Footprints',
    descRo: 'Sari peste bug-uri de sistem, cabluri deconectate și firewall-uri într-o cursă nesfârșită.',
    descEn: 'Leap over bugs and firewalls in endless retro sprint.',
    gradeBadge: 'Arcade',
  },
  {
    id: 'redstone_lab',
    titleRo: 'Laboratorul Redstone',
    titleEn: 'Redstone Logic Lab',
    category: 'Binar & Porți Logice',
    categoryEn: 'Logic Gates',
    iconName: 'Boxes',
    descRo: 'Circuite logice stil Minecraft: porți AND, OR, NOT, XOR, decodificatoare și sumatoare binare.',
    descEn: 'Minecraft-inspired logic circuits and gates.',
    gradeBadge: 'Logic & Porți',
  },
  {
    id: 'voxel_architect',
    titleRo: 'Voxel Architect 3D',
    titleEn: 'Minecraft Voxel Architect',
    category: '3D & Creativ',
    categoryEn: '3D & Creativity',
    iconName: 'Boxes',
    descRo: 'Construcții voxel tridimensionale de hardware, monitoare, procesoare și servere.',
    descEn: 'Build 3D voxel architectures and hardware models.',
    gradeBadge: '3D & Creativ',
  },
  {
    id: 'roblox_clicker',
    titleRo: 'Roblox Clicker Duel',
    titleEn: 'Roblox Blox Clicker',
    category: 'Arcade & Clicker',
    categoryEn: 'Arcade & Clicker',
    iconName: 'Flame',
    descRo: 'Minează Blox-Coins, cumpără servere cloud, deblochează pet-uri și mărește puterea de calcul.',
    descEn: 'Tap Blox-Coins and purchase hardware server upgrades.',
    gradeBadge: 'Clicker',
  },
  {
    id: 'duel',
    titleRo: 'Arena Duel 1v1',
    titleEn: 'Multiplayer 1v1 Duel Arena',
    category: 'Multiplayer 1v1',
    categoryEn: 'Multiplayer 1v1',
    iconName: 'Swords',
    descRo: 'Confruntare 1 la 1 în timp real între colegi cu sincronizare live prin camere de duel.',
    descEn: 'Real-time 1v1 head-to-head student showdown.',
    gradeBadge: 'Multiplayer',
  },
];

const LOCAL_STORAGE_SETTINGS_KEY = 'arkedo_game_settings';
const LOCAL_STORAGE_REQUESTS_KEY = 'arkedo_game_unlock_requests';
const DEFAULT_CUSTOM_MESSAGE = 'Acest joc este închis de profesor. Solicită deschiderea lui în timpul orei!';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  allGamesOpen: true,
  gameStatus: {}, // gol = toate sunt implicit deschise
  customMessage: DEFAULT_CUSTOM_MESSAGE,
  updatedAt: Date.now(),
};

/**
 * Returnează dacă un joc este deschis pentru elevi.
 * Regula: TOATE JOCURILE SUNT IMPLICIT DESCHISE (default true).
 */
export function isGameOpen(settings: GameSettings | null | undefined, gameId: string): boolean {
  if (!settings) return true;
  // Dacă profesorul a oprit comutatorul general:
  if (!settings.allGamesOpen) {
    // Permis doar dacă e explicit true
    return settings.gameStatus[gameId] === true;
  }
  // Altfel, deschis implicit dacă nu e explicit false
  return settings.gameStatus[gameId] !== false;
}

/**
 * Obține setările din LocalStorage (fallback sigur offline)
 */
export function getLocalGameSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        allGamesOpen: parsed.allGamesOpen ?? true,
        gameStatus: parsed.gameStatus ?? {},
        customMessage: parsed.customMessage || DEFAULT_CUSTOM_MESSAGE,
        updatedAt: parsed.updatedAt || Date.now(),
      };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_GAME_SETTINGS };
}

/**
 * Salvează setările în LocalStorage și emite eveniment local
 */
export function saveLocalGameSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('arkedo_game_settings_changed', { detail: settings }));
  } catch {
    // ignore
  }
}

/**
 * Ascultă modificările de setări jocuri în timp real (Firestore + LocalStorage)
 */
export function subscribeGameSettings(callback: (settings: GameSettings) => void): Unsubscribe {
  // Trimite imediat starea curentă din cache local
  callback(getLocalGameSettings());

  let firestoreUnsub: Unsubscribe | null = null;

  if (isCloudConnected && db) {
    try {
      const docRef = doc(db, 'setari_jocuri', 'status');
      firestoreUnsub = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const synced: GameSettings = {
              allGamesOpen: data.allGamesOpen ?? true,
              gameStatus: data.gameStatus ?? {},
              customMessage: data.customMessage || DEFAULT_CUSTOM_MESSAGE,
              updatedAt: data.updatedAt || Date.now(),
            };
            saveLocalGameSettings(synced);
            callback(synced);
          } else {
            // Dacă nu există încă pe Firestore, creăm cu valorile implicite (toate deschise)
            const initial = getLocalGameSettings();
            setDoc(docRef, initial).catch(() => {});
            callback(initial);
          }
        },
        (err) => {
          console.warn('[GameControl] Eroare ascultare setari cloud, fallback local:', err);
          callback(getLocalGameSettings());
        }
      );
    } catch (e) {
      console.warn('[GameControl] Firestore init listener error:', e);
    }
  }

  // Ascultător pentru evenimente locale / schimbări între tab-uri
  const handleLocalChange = (e: Event) => {
    const custom = e as CustomEvent<GameSettings>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getLocalGameSettings());
    }
  };

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_SETTINGS_KEY) {
      callback(getLocalGameSettings());
    }
  };

  window.addEventListener('arkedo_game_settings_changed', handleLocalChange);
  window.addEventListener('storage', handleStorageChange);

  return () => {
    if (firestoreUnsub) firestoreUnsub();
    window.removeEventListener('arkedo_game_settings_changed', handleLocalChange);
    window.removeEventListener('storage', handleStorageChange);
  };
}

/**
 * Comută starea unui joc individual (Deschis / Închis)
 */
export async function toggleGameLock(gameId: string, shouldBeOpen: boolean): Promise<void> {
  const current = getLocalGameSettings();
  const updated: GameSettings = {
    ...current,
    gameStatus: {
      ...current.gameStatus,
      [gameId]: shouldBeOpen,
    },
    updatedAt: Date.now(),
  };

  saveLocalGameSettings(updated);

  if (isCloudConnected && db) {
    try {
      const docRef = doc(db, 'setari_jocuri', 'status');
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.error('[GameControl] Eroare la actualizare Firestore:', err);
    }
  }
}

/**
 * Comutator General: Deschide sau Închide Toate Jocurile
 */
export async function setAllGamesOpen(open: boolean): Promise<void> {
  const current = getLocalGameSettings();
  const newStatus: Record<string, boolean> = {};
  
  // Setăm explicit starea fiecărui joc
  ALL_GAMES.forEach((g) => {
    newStatus[g.id] = open;
  });

  const updated: GameSettings = {
    ...current,
    allGamesOpen: open,
    gameStatus: newStatus,
    updatedAt: Date.now(),
  };

  saveLocalGameSettings(updated);

  if (isCloudConnected && db) {
    try {
      const docRef = doc(db, 'setari_jocuri', 'status');
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.error('[GameControl] Eroare salvare comutator general Firestore:', err);
    }
  }
}

/**
 * Actualizează mesajul personalizat afișat elevilor
 */
export async function updateCustomLockMessage(message: string): Promise<void> {
  const current = getLocalGameSettings();
  const updated: GameSettings = {
    ...current,
    customMessage: message.trim() || DEFAULT_CUSTOM_MESSAGE,
    updatedAt: Date.now(),
  };

  saveLocalGameSettings(updated);

  if (isCloudConnected && db) {
    try {
      const docRef = doc(db, 'setari_jocuri', 'status');
      await setDoc(docRef, { customMessage: updated.customMessage, updatedAt: updated.updatedAt }, { merge: true });
    } catch (err) {
      console.error('[GameControl] Eroare salvare mesaj personalizat:', err);
    }
  }
}

/**
 * Trimite o solicitare de deschidere din partea unui elev către profesor
 */
export async function sendUnlockRequest(
  gameId: string,
  studentName: string,
  studentAvatar: string = '🎓'
): Promise<boolean> {
  const game = ALL_GAMES.find((g) => g.id === gameId);
  const gameTitle = game ? game.titleRo : gameId;
  const safeName = studentName.trim() || 'Elev Anonim';

  const newReq: StudentUnlockRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    gameId,
    gameTitle,
    studentName: safeName,
    studentAvatar,
    timestamp: Date.now(),
    status: 'pending',
  };

  // Salvare locală
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REQUESTS_KEY);
    const existing: StudentUnlockRequest[] = raw ? JSON.parse(raw) : [];
    // Păstrăm ultimele 50
    const updated = [newReq, ...existing.filter((r) => r.gameId !== gameId || r.studentName !== safeName)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('arkedo_unlock_requests_changed', { detail: updated }));
  } catch {
    // ignore
  }

  // Trimitere către Firestore
  if (isCloudConnected && db) {
    try {
      const colRef = collection(db, 'solicitari_jocuri');
      await addDoc(colRef, newReq);
      return true;
    } catch (err) {
      console.warn('[GameControl] Nu s-a putut trimite pe Firestore cererea, salvată doar local:', err);
    }
  }

  return true;
}

/**
 * Obține cererile locale de deschidere
 */
export function getLocalUnlockRequests(): StudentUnlockRequest[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Ascultă cererile de deblocare venite de la elevi (pentru panoul profesorului)
 */
export function subscribeUnlockRequests(callback: (requests: StudentUnlockRequest[]) => void): Unsubscribe {
  callback(getLocalUnlockRequests());

  let firestoreUnsub: Unsubscribe | null = null;

  if (isCloudConnected && db) {
    try {
      const colRef = collection(db, 'solicitari_jocuri');
      const q = query(colRef, orderBy('timestamp', 'desc'), limit(30));
      firestoreUnsub = onSnapshot(
        q,
        (snap) => {
          const cloudRequests: StudentUnlockRequest[] = [];
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            cloudRequests.push({
              id: docSnap.id,
              gameId: data.gameId || '',
              gameTitle: data.gameTitle || '',
              studentName: data.studentName || 'Elev Anonim',
              studentAvatar: data.studentAvatar || '🎓',
              timestamp: data.timestamp || Date.now(),
              status: data.status || 'pending',
            });
          });
          callback(cloudRequests);
        },
        (err) => {
          console.warn('[GameControl] Eroare listener cereri cloud:', err);
          callback(getLocalUnlockRequests());
        }
      );
    } catch (e) {
      console.warn('[GameControl] Listener cereri init error:', e);
    }
  }

  const handleLocalChange = (e: Event) => {
    const custom = e as CustomEvent<StudentUnlockRequest[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getLocalUnlockRequests());
    }
  };

  window.addEventListener('arkedo_unlock_requests_changed', handleLocalChange);

  return () => {
    if (firestoreUnsub) firestoreUnsub();
    window.removeEventListener('arkedo_unlock_requests_changed', handleLocalChange);
  };
}

/**
 * Șterge o cerere de deblocare după ce profesorul a rezolvat-o
 */
export async function deleteUnlockRequest(requestId: string): Promise<void> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REQUESTS_KEY);
    if (raw) {
      const existing: StudentUnlockRequest[] = JSON.parse(raw);
      const filtered = existing.filter((r) => r.id !== requestId);
      localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('arkedo_unlock_requests_changed', { detail: filtered }));
    }
  } catch {
    // ignore
  }

  if (isCloudConnected && db && !requestId.startsWith('req_')) {
    try {
      const docRef = doc(db, 'solicitari_jocuri', requestId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[GameControl] Eroare ștergere cerere cloud:', err);
    }
  }
}

/**
 * Șterge toate cererile de deblocare
 */
export async function clearAllUnlockRequests(): Promise<void> {
  try {
    localStorage.removeItem(LOCAL_STORAGE_REQUESTS_KEY);
    window.dispatchEvent(new CustomEvent('arkedo_unlock_requests_changed', { detail: [] }));
  } catch {
    // ignore
  }

  if (isCloudConnected && db) {
    try {
      const colRef = collection(db, 'solicitari_jocuri');
      const snap = await getDocs(colRef);
      snap.forEach((d) => {
        deleteDoc(d.ref).catch(() => {});
      });
    } catch (err) {
      console.warn('[GameControl] Eroare golire cereri cloud:', err);
    }
  }
}
