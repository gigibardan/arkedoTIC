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

export type DuelGameMode = 'cyber_sprint' | 'block_coding' | 'speed_crafting' | 'quiz_blitz' | 'cyber_shield' | 'pc_rush' | 'file_battle' | 'roblox_clicker' | 'mouse_duel';

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
  qEn?: string;
  options: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanation: string;
  explanationEn?: string;
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

// Curated Quiz Blitz Questions with Complete Explanations & Bilingual Support
export const DUEL_QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: 1,
    q: 'Ce componentă hardware este considerată „creierul” calculatorului?',
    qEn: 'Which hardware component is considered the "brain" of the computer?',
    options: ['Procesorul (CPU)', 'Placa Video (GPU)', 'Sursa de Curent', 'Hard Disk-ul'],
    optionsEn: ['Central Processor (CPU)', 'Graphics Card (GPU)', 'Power Supply', 'Hard Disk Drive'],
    correctIndex: 0,
    explanation: 'CPU (Central Processing Unit) execută toate calculele logice și instrucțiunile programelor software.',
    explanationEn: 'The CPU (Central Processing Unit) executes all logical calculations and software instructions.'
  },
  {
    id: 2,
    q: 'Câți biți (bit) formează exact un Byte (Octet)?',
    qEn: 'How many bits form exactly one Byte (Octet)?',
    options: ['4 biți', '8 biți', '16 biți', '1024 biți'],
    optionsEn: ['4 bits', '8 bits', '16 bits', '1024 bits'],
    correctIndex: 1,
    explanation: '1 Byte (Octet) = 8 biți individuali (valori binare de 0 și 1).',
    explanationEn: '1 Byte (Octet) equals exactly 8 individual bits (binary values of 0 and 1).'
  },
  {
    id: 3,
    q: 'Ce extensie indică un fișier executabil care poate fi periculos?',
    qEn: 'Which file extension indicates an executable file that can carry viruses?',
    options: ['.docx', '.png', '.exe', '.mp3'],
    optionsEn: ['.docx', '.png', '.exe', '.mp3'],
    correctIndex: 2,
    explanation: '.exe reprezintă un program executabil de sistem și poate rula malware dacă este piratat.',
    explanationEn: '.exe stands for an executable program file and may execute malicious malware if untrusted.'
  },
  {
    id: 4,
    q: 'Ce este un atac de tip Phishing?',
    qEn: 'What is a Phishing attack?',
    options: ['O metodă de curățare a ecranului', 'Un email sau mesaj fals conceput pentru a fura parole', 'O viteză mare la conexiunea internet', 'O placă de rețea Wi-Fi'],
    optionsEn: ['A method to clean the screen', 'A fraudulent email/message designed to steal passwords', 'A high-speed internet link', 'A Wi-Fi network card'],
    correctIndex: 1,
    explanation: 'Phishing-ul păcălește utilizatorii cu mesaje înșelătoare pentru a obține parole și date confidențiale.',
    explanationEn: 'Phishing tricks users with deceptive messages to steal sensitive credentials and passwords.'
  },
  {
    id: 5,
    q: 'Care este combinația de taste rapidă pentru copiere (Copy)?',
    qEn: 'What is the universal keyboard shortcut for Copy?',
    options: ['Ctrl + V', 'Ctrl + Z', 'Ctrl + C', 'Ctrl + X'],
    optionsEn: ['Ctrl + V', 'Ctrl + Z', 'Ctrl + C', 'Ctrl + X'],
    correctIndex: 2,
    explanation: 'Ctrl + C este comanda universală de copiere în memoria temporară (clipboard). Ctrl + V este lipirea (Paste).',
    explanationEn: 'Ctrl + C is the universal command to copy into clipboard memory. Ctrl + V is Paste.'
  },
  {
    id: 6,
    q: 'Ce culori formează modelul de lumină RGB la monitoare?',
    qEn: 'Which primary light colors compose the monitor RGB color model?',
    options: ['Roșu, Galben, Albastru', 'Roșu, Verde, Albastru', 'Roz, Gri, Negru', 'Cyan, Magenta, Galben'],
    optionsEn: ['Red, Yellow, Blue', 'Red, Green, Blue', 'Pink, Gray, Black', 'Cyan, Magenta, Yellow'],
    correctIndex: 1,
    explanation: 'RGB vine de la Red (Roșu), Green (Verde) și Blue (Albastru) – culorile primare de emisie a luminii pe ecran.',
    explanationEn: 'RGB stands for Red, Green, and Blue – the additive primary colors emitted by electronic display pixels.'
  },
  {
    id: 7,
    q: 'Care dispozitiv este atât de intrare, cât și de ieșire?',
    qEn: 'Which device functions as both an input and an output peripheral?',
    options: ['Tastatura mecanică', 'Monitorul Touchscreen (tactil)', 'Boxele audio stereo', 'Mouse-ul optic cu fir'],
    optionsEn: ['Mechanical keyboard', 'Touchscreen display monitor', 'Stereo audio speakers', 'Optical wired mouse'],
    correctIndex: 1,
    explanation: 'Ecranul tactil afișează imagini vizuale (ieșire) și citește atingerile tactile ale degetelor (intrare).',
    explanationEn: 'The touchscreen displays visual graphics (output) and detects finger touch interactions (input).'
  },
  {
    id: 8,
    q: 'Ce rol are memoria RAM într-un sistem de calcul?',
    qEn: 'What is the role of RAM memory in a computer system?',
    options: ['Stocare permanentă când PC-ul este oprit', 'Memorie de lucru ultrarapidă temporară pentru aplicații active', 'Alimentare cu energie electrică stabilă', 'Răcirea componentelor carcasei'],
    optionsEn: ['Permanent storage when PC is powered off', 'Ultra-fast volatile working memory for active programs', 'Stable electric power supply', 'Cooling case chassis parts'],
    correctIndex: 1,
    explanation: 'RAM (Random Access Memory) este o memorie volatilă rapidă în care se încarcă datele programelor care rulează în prezent.',
    explanationEn: 'RAM (Random Access Memory) is fast volatile memory holding active program code and working data.'
  },
  {
    id: 9,
    q: 'Ce protocol de rețea securizat criptează transferul de date pe site-uri web?',
    qEn: 'Which secure web protocol encrypts data transmission over websites?',
    options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    optionsEn: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    correctIndex: 2,
    explanation: 'HTTPS (HyperText Transfer Protocol Secure) utilizează criptare SSL/TLS și un certificat digital pentru siguranță.',
    explanationEn: 'HTTPS (HyperText Transfer Protocol Secure) utilizes SSL/TLS encryption to secure web browsing sessions.'
  },
  {
    id: 10,
    q: 'Ce valoare zecimală corespunde numărului binar 101₂?',
    qEn: 'What is the decimal equivalent of the binary number 101₂?',
    options: ['3', '5', '6', '7'],
    optionsEn: ['3', '5', '6', '7'],
    correctIndex: 1,
    explanation: 'În baza 2: 1×2² + 0×2¹ + 1×2⁰ = 4 + 0 + 1 = 5.',
    explanationEn: 'In base 2: 1×2² + 0×2¹ + 1×2⁰ = 4 + 0 + 1 = 5.'
  },
  {
    id: 11,
    q: 'Câți Megabytes (MB) conține un Gigabyte (GB)?',
    qEn: 'How many Megabytes (MB) are in one Gigabyte (GB)?',
    options: ['100 MB', '1000 MB', '1024 MB', '2048 MB'],
    optionsEn: ['100 MB', '1000 MB', '1024 MB', '2048 MB'],
    correctIndex: 2,
    explanation: 'În informatică, multiplii binari cresc cu puteri ale lui 2: 1 GB = 2¹⁰ MB = 1024 MB.',
    explanationEn: 'In computer science, binary storage units scale by powers of 2: 1 GB = 2¹⁰ MB = 1024 MB.'
  },
  {
    id: 12,
    q: 'Ce rol are comanda rapidă Ctrl + Z?',
    qEn: 'What is the function of the keyboard shortcut Ctrl + Z?',
    options: ['Închide calculatorul', 'Anulează ultima acțiune (Undo)', 'Salvează documentul pe disc', 'Șterge un fișier definitiv'],
    optionsEn: ['Shuts down the PC', 'Undoes the last action (Undo)', 'Saves document to disk', 'Permanently deletes a file'],
    correctIndex: 1,
    explanation: 'Ctrl + Z (Undo) este comanda salvatoare care anulează ultima greșeală comisă în orice program.',
    explanationEn: 'Ctrl + Z (Undo) is the standard shortcut to reverse the most recent user action or mistake.'
  },
  {
    id: 13,
    q: 'Ce este un Firewall (Zid de Protecție)?',
    qEn: 'What is a Firewall in computer security?',
    options: ['Un cooler fizic cu ventilatoare mari', 'Un program sau echipament ce filtrează și blochează traficul periculos din rețea', 'O parolă compusă din 8 cifre', 'Un tip de cablu optic de mare viteză'],
    optionsEn: ['A physical cooler with large fans', 'A software or hardware barrier filtering and blocking malicious network traffic', 'An 8-digit numeric PIN password', 'A high-speed optical fiber cable'],
    correctIndex: 1,
    explanation: 'Firewall-ul verifică pachetele de date de intrare/ieșire din rețea și respinge conexiunile neautorizate sau suspecte.',
    explanationEn: 'A Firewall monitors incoming and outgoing network packets to block unauthorized access and cyber threats.'
  },
  {
    id: 14,
    q: 'Ce caracteristică definește o parolă puternică și sigură?',
    qEn: 'What characterizes a strong, resilient password?',
    options: ['Numele cățelului sau data nașterii tale', 'Un șir scurt de cifre ușor de ținut minte (123456)', 'Minim 12 caractere ce combină litere mari, mici, cifre și simboluri speciale', 'Cuvântul „password” urmat de o cifră'],
    optionsEn: ['Your pet name or your birthday', 'A short sequence of numbers (123456)', 'At least 12 characters combining uppercase, lowercase, numbers and symbols', 'The word "password" followed by a digit'],
    correctIndex: 2,
    explanation: 'Parolele complexe cu peste 12 caractere mixte și caractere speciale (@, #, $) rezistă atacurilor de tip dicționar.',
    explanationEn: 'Complex passwords with 12+ mixed characters and symbols resist dictionary and brute-force cracking attacks.'
  },
  {
    id: 15,
    q: 'Ce se întâmplă cu un fișier șters cu tasta Delete din Windows?',
    qEn: 'What happens to a file deleted using the standard Delete key in Windows?',
    options: ['Se evaporă instantaneu de pe calculator', 'Ajunge în Coșul de Reciclare (Recycle Bin) de unde poate fi restaurat', 'Se transformă într-un virus', 'Se trimite automat pe email la profesor'],
    optionsEn: ['It is vaporized forever instantly', 'It moves to the Recycle Bin from where it can be restored', 'It turns into a computer virus', 'It is emailed to the teacher'],
    correctIndex: 1,
    explanation: 'Fișierele șterse normal ajung în Coșul de Reciclare (Recycle Bin), oferind o plasă de siguranță pentru restaurare.',
    explanationEn: 'Files deleted regularly are stored in the Recycle Bin, allowing accidental deletions to be safely restored.'
  },
  {
    id: 16,
    q: 'Ce reprezintă un algoritm în informatică?',
    qEn: 'What is an algorithm in computer science?',
    options: ['O piesă de metal din sursa de curent', 'O succesiune finită și ordonată de pași logici pentru rezolvarea unei probleme', 'O adresă de site web', 'Un joc video instalat pe PC'],
    optionsEn: ['A metal piece inside the power supply', 'A finite, ordered sequence of unambiguous steps to solve a problem', 'A website internet address', 'A video game installed on disk'],
    correctIndex: 1,
    explanation: 'Un algoritm este o rețetă logică de instrucțiuni clare, finite și executabile pentru a obține un rezultat dorit.',
    explanationEn: 'An algorithm is an unambiguous, finite set of ordered steps designed to accomplish a specific task.'
  },
  {
    id: 17,
    q: 'Care este principalul avantaj al unui SSD față de un Hard Disk clasic (HDD)?',
    qEn: 'What is the main advantage of an SSD compared to a classic mechanical HDD?',
    options: ['Este mult mai greu și mai mare', 'Are viteze de citire/scriere mult superioare și nu are piese mecanice în mișcare', 'Nu folosește deloc curent electric', 'Produce un zgomot foarte puternic'],
    optionsEn: ['It is much heavier and bulkier', 'Much faster read/write speeds and zero moving mechanical parts', 'Consumes absolutely no electricity', 'Makes very loud whirring noise'],
    correctIndex: 1,
    explanation: 'SSD-ul folosește cipuri flash de memorie silențioase, oferind viteze de 10-50 de ori mai mari decât un HDD mecanic.',
    explanationEn: 'SSDs use solid-state flash memory chips with zero moving parts, providing vastly faster access times than spinning HDDs.'
  },
  {
    id: 18,
    q: 'Ce componentă leagă fizic și asigură comunicarea între toate piesele din carcasă?',
    qEn: 'Which motherboard component connects and synchronizes all internal PC hardware?',
    options: ['Placa de bază (Motherboard)', 'Unitatea optică DVD', 'Cablu HDMI la monitor', 'Tastatura wireless'],
    optionsEn: ['Motherboard (System Board)', 'Optical DVD drive', 'HDMI monitor cable', 'Wireless keyboard'],
    correctIndex: 0,
    explanation: 'Placa de bază este coloana vertebrală pe care sunt montate CPU, RAM, SSD, plăcile de extensie și porturile I/O.',
    explanationEn: 'The motherboard is the core circuit board that interconnects CPU, RAM, storage, expansion buses and ports.'
  },
  {
    id: 19,
    q: 'Ce este autentificarea în 2 Pași (2FA / Two-Factor Authentication)?',
    qEn: 'What is Two-Factor Authentication (2FA)?',
    options: ['Tastarea parolei de 2 ori la rând', 'O metodă de securitate ce cere o confirmare suplimentară (ex: cod SMS sau aplicație de securitate) pe lângă parolă', 'Folosirea a două tastaturi simultan', 'Dublarea vitezei conexiunii la internet'],
    optionsEn: ['Typing your password twice in a row', 'A security layer requiring a secondary verification (e.g. SMS code or auth app) alongside the password', 'Using two keyboards at the same time', 'Doubling internet connection bandwidth'],
    correctIndex: 1,
    explanation: '2FA protejează contul chiar dacă hackerii îți află parola, deoarece nu dețin dispozitivul tău pentru al doilea pas.',
    explanationEn: '2FA safeguards accounts even if a password leaks, requiring proof of possession of a secondary device/code.'
  },
  {
    id: 20,
    q: 'Ce program este folosit pentru a accesa și naviga pe paginile World Wide Web?',
    qEn: 'Which software application is used to browse and access World Wide Web pages?',
    options: ['Un player video (ex: VLC)', 'Un navigator web / Browser (ex: Chrome, Edge, Firefox)', 'Un program de calcul tabelar', 'Un antivirus'],
    optionsEn: ['A media video player (e.g. VLC)', 'A web browser (e.g. Chrome, Edge, Firefox)', 'A spreadsheet math program', 'An antivirus engine'],
    correctIndex: 1,
    explanation: 'Browserul web (navigatorul) traduce codul HTML, CSS și JavaScript al paginilor web în interfețe grafice interactive.',
    explanationEn: 'A web browser interprets HTML, CSS, and JavaScript from web servers into rendered visual interactive pages.'
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

// In-memory throttling cache to protect Firebase Spark plan quota (max 20,000 writes/day)
interface PendingThrottledWrite {
  timer: any;
  data: Partial<DuelPlayer>;
  roomCode: string;
  isHost: boolean;
}
const pendingWrites = new Map<string, PendingThrottledWrite>();
const lastWrittenTimes = new Map<string, number>();
const lastWrittenPayloads = new Map<string, string>();
const lastWrittenProgress = new Map<string, number>();
const MIN_WRITE_INTERVAL_MS = 5000; // 5000ms minimum interval between intermediate progress writes

// Direct write helper to Firestore
async function executeFirestoreUpdate(
  roomCode: string,
  isHost: boolean,
  data: Partial<DuelPlayer>,
  allFinishedWinnerId?: string,
  winnerName?: string
): Promise<void> {
  if (!db) return;
  const cleanCode = roomCode.trim().toUpperCase();
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
  } catch (err: any) {
    if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
      console.warn('⚠️ Cota zilnică Firebase Spark a fost atinsă. Meciul continuă local fără întrerupere.');
    } else {
      console.warn('Eroare update duel progress:', err);
    }
  }
}

// Update player live score and progress with strict milestone throttling to save Firestore quota
export async function updateDuelProgress(
  roomCode: string,
  isHost: boolean,
  data: Partial<DuelPlayer>,
  allFinishedWinnerId?: string,
  winnerName?: string
): Promise<void> {
  const cleanCode = roomCode.trim().toUpperCase();
  const cacheKey = `${cleanCode}_${isHost ? 'host' : 'guest'}`;

  // Priority 1: Match Finish / Winner declared -> Write IMMEDIATELY, clear pending
  if (allFinishedWinnerId || data.progress === 100) {
    const pending = pendingWrites.get(cacheKey);
    if (pending?.timer) {
      clearTimeout(pending.timer);
    }
    pendingWrites.delete(cacheKey);
    lastWrittenTimes.set(cacheKey, Date.now());
    lastWrittenPayloads.set(cacheKey, JSON.stringify(data));
    if (data.progress !== undefined) {
      lastWrittenProgress.set(cacheKey, data.progress);
    }
    await executeFirestoreUpdate(cleanCode, isHost, data, allFinishedWinnerId, winnerName);
    return;
  }

  // Priority 2: Intermediate progress updates -> deduplicate & milestone check
  const serialized = JSON.stringify(data);
  if (serialized === lastWrittenPayloads.get(cacheKey)) {
    // Data has not changed at all; skip Firestore write completely!
    return;
  }

  const now = Date.now();
  const lastTime = lastWrittenTimes.get(cacheKey) || 0;
  const elapsed = now - lastTime;
  const currentProg = typeof data.progress === 'number' ? data.progress : -1;
  const prevProg = lastWrittenProgress.get(cacheKey) ?? -1;
  const hasMilestoneStep = currentProg >= 0 && (prevProg < 0 || Math.abs(currentProg - prevProg) >= 20);

  // If milestone jumped (at least 20% difference) and minimum window elapsed (5s):
  if ((hasMilestoneStep || elapsed >= 8000) && elapsed >= MIN_WRITE_INTERVAL_MS && !pendingWrites.has(cacheKey)) {
    lastWrittenTimes.set(cacheKey, now);
    lastWrittenPayloads.set(cacheKey, serialized);
    if (currentProg >= 0) {
      lastWrittenProgress.set(cacheKey, currentProg);
    }
    await executeFirestoreUpdate(cleanCode, isHost, data);
  } else {
    // Buffer into pendingWrites and flush on timer
    const existing = pendingWrites.get(cacheKey);
    const mergedData = { ...(existing?.data || {}), ...data };

    if (existing?.timer) {
      existing.data = mergedData;
    } else {
      const delay = Math.max(1500, Math.min(4500, MIN_WRITE_INTERVAL_MS - elapsed));
      const timer = setTimeout(async () => {
        const item = pendingWrites.get(cacheKey);
        pendingWrites.delete(cacheKey);
        if (item) {
          const itemProg = typeof item.data.progress === 'number' ? item.data.progress : -1;
          const oldProg = lastWrittenProgress.get(cacheKey) ?? -1;
          const movedEnough = itemProg >= 0 && (oldProg < 0 || Math.abs(itemProg - oldProg) >= 20);
          const timeWaited = Date.now() - (lastWrittenTimes.get(cacheKey) || 0);

          if (movedEnough || timeWaited >= 8000) {
            lastWrittenTimes.set(cacheKey, Date.now());
            lastWrittenPayloads.set(cacheKey, JSON.stringify(item.data));
            if (itemProg >= 0) {
              lastWrittenProgress.set(cacheKey, itemProg);
            }
            await executeFirestoreUpdate(item.roomCode, item.isHost, item.data);
          }
        }
      }, delay);

      pendingWrites.set(cacheKey, {
        timer,
        data: mergedData,
        roomCode: cleanCode,
        isHost
      });
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
