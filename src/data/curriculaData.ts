import { GRADE_7_CURRICULA_MODULES } from './grade7Curricula';
import { GRADE_8_CURRICULA_MODULES } from './grade8Curricula';

export interface CurriculaModule {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  grade: 'Clasa a V-a' | 'Clasa a VI-a' | 'Clasa a VII-a' | 'Clasa a VIII-a';
  unit: string;
  manualRef: string;
  icon: string;
  color: string;
  metaDescription: string;
  keywords: string[];
  competencies: {
    code: string;
    description: string;
  }[];
  theorySections: {
    title: string;
    content: string[];
    tips?: string;
  }[];
  keyTerms: {
    term: string;
    definition: string;
  }[];
  keyboardShortcuts?: {
    keys: string;
    action: string;
  }[];
  shortcuts?: {
    key: string;
    action: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  practicalLab?: string;
  practicalLabs?: {
    step: number;
    title: string;
    task: string;
  }[];
  testQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  missionId?: string;
}

export const CURRICULA_MODULES: CurriculaModule[] = [
  {
    id: 'hardware',
    slug: 'hardware-arhitectura-calculator',
    title: 'Arhitectura Calculatorului, Componente & Periferice',
    shortTitle: 'Hardware & Ergonomie',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 1: Sisteme de calcul și comunicații (pag. 10–21)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    icon: '🖥️',
    color: 'from-amber-500 to-orange-600',
    metaDescription: 'Ghid curricular complet TIC Clasa a 5-a: Arhitectura calculatorului, componente hardware, periferice de intrare/ieșire, ergonomie și calcul capacitate memorii.',
    keywords: [
      'hardware calculator clasa 5',
      'arhitectura calculatorului gimnaziu',
      'dispozitive periferice intrare iesire',
      'placa de baza microprocesor memorie ram',
      'unitati de masura biti octeti',
      'ergonomie laborator informatica'
    ],
    competencies: [
      {
        code: '1.1',
        description: 'Identificarea componentelor hardware ale unui sistem de calcul și a rolului acestora în funcționarea calculatorului.'
      },
      {
        code: '1.2',
        description: 'Aplicarea normelor de securitate și ergonomie a muncii în laboratorul de informatică și la lucrul cu dispozitivele digitale.'
      },
      {
        code: '2.1',
        description: 'Utilizarea corectă a unităților de măsură a informației (bit, octet/byte, KB, MB, GB, TB).'
      }
    ],
    theorySections: [
      {
        title: 'Norme de Ergonomie & Siguranță în Laborator',
        content: [
          'Poziția corectă la calculator: spatele drept, sprijinit pe spătar, tălpile sprijinite complet pe podea, coatele la unghi de 90°.',
          'Distanța recomandată față de monitor: 45 – 70 cm, cu linia privirii aliniată la marginea superioară a ecranului pentru a preveni oboseala oculară.',
          'Sunt strict interzise lichidele și alimentele în apropierea echipamentelor electronice.'
        ],
        tips: 'Regula 20-20-20: La fiecare 20 de minute de lucru pe ecran, privește timp de 20 de secunde un obiect aflat la 20 de picioare (~6 metri) distanță!'
      },
      {
        title: 'Arhitectura Internă (Unitatea Centrală)',
        content: [
          'Placa de bază (Motherboard): componenta principală pe care sunt conectate toate celelalte componente hardware.',
          'Microprocesorul (CPU): creierul sistemului de calcul; execută instrucțiunile și coordonează toate operațiile.',
          'Memoria RAM (Random Access Memory): memorie volatilă, de lucru rapid, care păstrează datele programelor doar cât timp PC-ul este pornit.',
          'Sursa de alimentare: transformă curentul electric de la priză în tensiuni adecvate pentru componentele interne.',
          'Medii de stocare nevolatile: SSD (Solid State Drive - rapid, fără piese mobile) și HDD (Hard Disk Drive - capacitate mare pe platane magnetice).'
        ]
      },
      {
        title: 'Clasificarea Dispozitivelor Periferice',
        content: [
          'Periferice de Intrare: permit introducerea datelor în calculator (Tastatură, Mouse, Microfon, Scaner, Cameră Web, Tabletă grafică).',
          'Periferice de Ieșire: extrag și redau informațiile către utilizator (Monitor, Imprimantă, Boxe, Căști, Videoproiector).',
          'Periferice de Intrare-Ieșire: realizează ambele funcții (Ecran tactil / Touchscreen, Căști cu microfon, Imprimantă multifuncțională).'
        ]
      },
      {
        title: 'Măsurarea Informației Digitale',
        content: [
          'Bitul (b): cea mai mică unitate de măsură a informației (are valoarea binară 0 sau 1).',
          'Octetul / Byte-ul (B): 1 Byte = 8 biți (poate stoca exact un caracter alfabetic sau cifră).',
          'Multipli binari: 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB.'
        ]
      }
    ],
    keyTerms: [
      { term: 'CPU (Procesor)', definition: 'Unitatea Centrală de Prelucrare ce execută instrucțiunile din memorie.' },
      { term: 'RAM', definition: 'Memorie cu acces aleator, foarte rapidă dar volatilă (se șterge la oprirea curentului).' },
      { term: 'SSD vs HDD', definition: 'SSD folosește cipuri flash silențioase de mare viteză, în timp ce HDD folosește discuri magnetice rotative.' },
      { term: 'Byte (Octet)', definition: 'Grup de 8 biți ce reprezintă un caracter în codificare computerizată.' },
      { term: 'Ergonomie', definition: 'Știința organizării locului de muncă pentru protejarea sănătății utilizatorului.' }
    ],
    keyboardShortcuts: [
      { keys: 'PrintScreen (PrtScn)', action: 'Captură completă de ecran în memoria Clipboard' },
      { keys: 'Ctrl + Alt + Del', action: 'Deschiderea ecranului de securitate / Task Manager' },
      { keys: 'Win + Pause/Break', action: 'Deschiderea panoului de proprietăți sistem (procesor, memorie RAM instalată)' }
    ],
    faqs: [
      {
        question: 'Care este diferența dintre memoria RAM și memoria SSD?',
        answer: 'Memoria RAM este memoria temporară de lucru a procesorului (se șterge la repornire), în timp ce SSD-ul este unitatea de stocare permanentă unde rămân salvate fișierele și sistemul de operare.'
      },
      {
        question: 'Câți Megabytes (MB) are 1 Gigabyte (GB)?',
        answer: 'În sistemul binar al calculatoarelor, 1 GB este egal cu 1024 MB (2^10 MB).'
      },
      {
        question: 'Ce periferic este ecranul tactil (touchscreen)?',
        answer: 'Ecranul tactil este un dispozitiv periferic mixt de Intrare-Ieșire, deoarece afișează imaginea (ieșire) și preia atingerile degetului (intrare).'
      }
    ],
    practicalLab: 'Calculează câți MB ocupă un folder cu 5 videoclipuri de 2 GB fiecare și o arhivă de 512 MB. Rezultat: 5 * 2048 MB + 512 MB = 10.752 MB.',
    missionId: 'hardware'
  },
  {
    id: 'fisiere-so',
    slug: 'sisteme-de-operare-fisiere',
    title: 'Sistemul de Operare & Organizarea Fișierelor în Foldere',
    shortTitle: 'Sisteme de Operare & Fișiere',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 2: Sistemul de Operare (pag. 22–31)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    icon: '🗂️',
    color: 'from-blue-500 to-indigo-600',
    metaDescription: 'Lecție interactivă TIC: Sistemul de operare, desktop, ferestre, structura arborescentă a fișierelor și folderelor, căi de acces, extensii și coșul de reciclare.',
    keywords: [
      'sistem de operare clasa 5',
      'organizarea fisierelor foldere directoare',
      'structura arborescenta fisiere',
      'extensii fisiere docx png pdf',
      'recycle bin cos de reciclare',
      'scurtaturi tastatura windows'
    ],
    competencies: [
      {
        code: '1.3',
        description: 'Utilizarea funcțiilor de bază ale sistemului de operare pentru gestionarea aplicațiilor și a dispozitivelor.'
      },
      {
        code: '2.2',
        description: 'Organizarea fișierelor și a folderelor într-o structură arborescentă logică, utilizând operații de creare, copiere, mutare, redenumire și ștergere.'
      }
    ],
    theorySections: [
      {
        title: 'Rolul Sistemului de Operare (SO)',
        content: [
          'Sistemul de operare este pachetul principal de programe care asigură legătura între componentele hardware ale calculatorului și utilizator sau aplicații.',
          'Exemple de sisteme de operare populare: Microsoft Windows, Linux (Ubuntu, Debian), Apple macOS, Android, iOS.',
          'Elementele de bază ale interfeței grafice (GUI): Desktop (Spațiul de lucru), Bara de activități (Taskbar), Meniul Start, Ferestrele de aplicații.'
        ]
      },
      {
        title: 'Fișiere & Extensii',
        content: [
          'Un fișier este o colecție omogenă de date salvată pe un suport de stocare, identificată printr-un nume și o extensie despărțite prin punct (`nume.extensie`).',
          'Extensia indică formatul fișierului și aplicația asociată: `.docx` (document text Word), `.xlsx` (foaie calcul), `.png`/`.jpg` (imagine), `.mp3` (audio), `.mp4` (video), `.pdf` (document portabil), `.zip` (arhivă comprimată).'
        ]
      },
      {
        title: 'Structura Arborescentă a Folderelor',
        content: [
          'Folderul (directorul) este un container folosit pentru gruparea logică a fișierelor și a altor subfoldere.',
          'Calea de acces (Path) reprezintă traseul de la unitatea de disc rădăcină (ex: `C:\\`) până la fișierul căutat: ex. `C:\\Scoala\\TIC\\Proiect.docx`.'
        ]
      },
      {
        title: 'Coșul de Reciclare (Recycle Bin)',
        content: [
          'Fișierele șterse de pe discul local ajung în Recycle Bin și pot fi restaurate (Restore) dacă au fost șterse din greșeală.',
          'Atenție: Fișierele șterse de pe un stick USB NU ajung în Recycle Bin, ci sunt șterse definitiv!'
        ]
      }
    ],
    keyTerms: [
      { term: 'GUI (Graphical User Interface)', definition: 'Interfață grafică prietenoasă bazată pe ferestre, pictograme și meniuri.' },
      { term: 'Extensie fișier', definition: 'Sufixul de după punct care comunică sistemului tipul de date conținut.' },
      { term: 'Folder părinte', definition: 'Directorul superior ierarhic care conține subfolderul curent.' },
      { term: 'Shortcut (Comandă rapidă)', definition: 'Fișier indicator cu săgeată albastră care deschide rapid o aplicație sau fișier.' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + C / Ctrl + V', action: 'Copiere și Lipire fișier/folder' },
      { keys: 'Ctrl + X / Ctrl + V', action: 'Mutare (Decupare) și Lipire' },
      { keys: 'F2', action: 'Redenumirea rapidă a fișierului selectat' },
      { keys: 'Shift + Delete', action: 'Ștergere definitivă fără trimitere în Recycle Bin' },
      { keys: 'Win + E', action: 'Deschiderea File Explorer' }
    ],
    faqs: [
      {
        question: 'Pot exista două fișiere cu exact același nume în același folder?',
        answer: 'Nu. În același folder, numele complet (inclusiv extensia) trebuie să fie unic.'
      },
      {
        question: 'Cum pot recupera un fișier șters din greșeală?',
        answer: 'Deschizi pictograma Recycle Bin de pe Desktop, localizezi fișierul, dai clic dreapta și alegi opțiunea Restore.'
      }
    ],
    practicalLab: 'Creează o structură arborescentă pentru portofoliul școlar: Folder principal `Portofoliu_TIC` cu subfolderele `Documente`, `Proiecte_Scratch` și `Imagini`.',
    missionId: 'files'
  },
  {
    id: 'internet-siguranta',
    slug: 'internet-retele-securitate',
    title: 'Rețeaua Internet, Navigare Sigură & Protecția Datelor',
    shortTitle: 'Internet & Securitate Web',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 3: Internet & Rețele de calculatoare (pag. 32–48)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    icon: '🌐',
    color: 'from-emerald-500 to-teal-600',
    metaDescription: 'Ghid de securitate pe Internet pentru elevi de gimnaziu: Rețele de calculatoare, World Wide Web, motoare de căutare, protecție phishing, parole puternice și netichetă.',
    keywords: [
      'internet securitate web clasa 5',
      'protectia datelor personale online',
      'parole sigure phishing prevenire',
      'motoare de cautare google adrese url',
      'neticheta reguli comunicare online',
      'drepturi de autor creative commons'
    ],
    competencies: [
      {
        code: '3.1',
        description: 'Utilizarea eficientă a browserelor și motoarelor de căutare pentru identificarea informațiilor utile.'
      },
      {
        code: '3.2',
        description: 'Conștientizarea riscurilor navigării online și aplicarea măsurilor elementare de siguranță cibernetică.'
      },
      {
        code: '3.3',
        description: 'Respectarea drepturilor de autor și aplicarea regulilor de netichetă în comunicarea digitală.'
      }
    ],
    theorySections: [
      {
        title: 'Ce este Internetul & World Wide Web (WWW)',
        content: [
          'Internetul este rețeaua globală uriașă de calculatoare interconectate din întreaga lume.',
          'WWW (World Wide Web) este serviciul grafic de pagini web legate prin hiperlegături (link-uri).',
          'Adresa URL (Uniform Resource Locator) reprezintă adresa unică a unei pagini web (ex: `https://arkedu.ro`).',
          'Protocolul `https://` (HyperText Transfer Protocol Secure) cu lacăt verde arată că datele sunt criptate și protejate.'
        ]
      },
      {
        title: 'Reguli de Siguranță & Prevenire Phishing',
        content: [
          'Protecția parolelor: O parolă sigură are minim 12 caractere, litere mari și mici, cifre și simboluri speciale (`!@#$%`). Nu o partaja cu nimeni!',
          'Atacurile de tip Phishing: Mesaje false care încearcă să te păcălească să dezvălui parole sau date personale, pretinzând că vin de la companii cunoscute.',
          'Nu deschide fișiere atașate nesolicitate de la expeditori necunoscuți (pot conține malware/viruși).'
        ]
      },
      {
        title: 'Neticheta & Dreptul de Autor',
        content: [
          'Neticheta: Codul de bune maniere pe internet. Nu scrie cu majuscule (înseamnă că ȚIPI), nu răspândi zvonuri false (Fake News) și nu jigni alți utilizatori (Cyberbullying).',
          'Dreptul de autor (Copyright): Imaginile, textele și melodiile găsite pe net aparțin creatorilor lor. Folosește resurse cu licență liberă (Creative Commons) și menționează întotdeauna sursa.'
        ]
      }
    ],
    keyTerms: [
      { term: 'URL', definition: 'Adresa web unică de localizare a unei resurse pe internet.' },
      { term: 'Browser Web', definition: 'Aplicația care interpretează și afișează pagini web (Chrome, Firefox, Safari, Edge).' },
      { term: 'Phishing', definition: 'Tentativă de fraudă online prin mesaje false pentru furtul de credențiale.' },
      { term: 'Cyberbullying', definition: 'Hărțuirea sau intimidarea unei persoane prin intermediul mediului online.' }
    ],
    faqs: [
      {
        question: 'Cum recunosc un site securizat?',
        answer: 'Adresa URL începe cu https:// și în bara browserului apare simbolul unui lacăt închis.'
      },
      {
        question: 'Ce fac dacă primesc un mesaj ciudat prin care mi se cer date personale?',
        answer: 'Nu răspunzi, nu apeși pe niciun link suspect și anunți imediat un părinte sau profesorul de informatică.'
      }
    ],
    practicalLab: 'Verifică dacă o adresă web este autentică comparând domeniul oficial cu cel din link și testează puterea unei parole prin calculul complexității.',
    missionId: 'internet1'
  },
  {
    id: 'editoare-text',
    slug: 'editoare-text-formatare',
    title: 'Editoare de Text, Formatare & Tehnoredactare Digitală',
    shortTitle: 'Birotică & Tehnoredactare',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 4: Prelucrarea Textului (pag. 50–80)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    icon: '📝',
    color: 'from-sky-500 to-blue-700',
    metaDescription: 'Manual TIC Gimnaziu: Tehnoredactare corectă în Microsoft Word și Google Docs. Formatare caractere, aliniere paragrafe, tabele, liste numerotate și diacritice românești.',
    keywords: [
      'editoare de text word google docs clasa 5',
      'tehnoredactare reguli diacritice',
      'formatare caractere font dimensiune',
      'aliniere paragraf stanga dreapta justifiat',
      'inserare tabele imagini document'
    ],
    competencies: [
      {
        code: '2.3',
        description: 'Editarea și formatarea unui document text respectând regulile de tehnoredactare și ortografie a limbii române.'
      },
      {
        code: '2.4',
        description: 'Structurarea conținutului text prin inserarea de liste marcate/numerotate, tabele și imagini ilustrative.'
      }
    ],
    theorySections: [
      {
        title: 'Reguli Fundamentale de Tehnoredactare',
        content: [
          'După orice semn de punctuație (. , : ; ! ?) se lasă OBLIGATORIU un spațiu, niciodată înainte.',
          'Ghilimelele românești se deschid jos „ (Alt 0132) și se închid sus ” (Alt 0148).',
          'Textul în limba română se scrie întotdeauna cu diacritice: ă, â, î, ș, ț.',
          'Tasta Enter se apasă DOAR la sfârșitul paragrafului, nu la finalul fiecărui rând (trecerea la rând nou se face automat!).'
        ]
      },
      {
        title: 'Formatarea Caracterelor & Paragrafelor',
        content: [
          'Formatarea caracterelor: Font (tip literă), Dimensiune (puncte), Stil (Aldin/Bold, Cursiv/Italic, Subliniat/Underline), Culoare.',
          'Alinierea paragrafelor: La stânga (Left), Centrat (Center), La dreapta (Right), Stânga-Dreapta (Justify / Aliniat pe ambele margini).',
          'Indentare (Indent): Retragerea primei linii a paragrafului (alineat).'
        ]
      }
    ],
    keyTerms: [
      { term: 'Font', definition: 'Set complet de caractere alfanumerice cu un design grafic unitar.' },
      { term: 'Justify (Aliniere pe ambele margini)', definition: 'Distribuirea uniformă a spațiilor între cuvinte pentru margini drepte atât la stânga cât și la dreapta.' },
      { term: 'Diacritice', definition: 'Semne grafice adăugate literelor de bază (ă, â, î, ș, ț) esențiale în scrierea corectă românească.' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + B', action: 'Aplicare stil Aldin (Bold)' },
      { keys: 'Ctrl + I', action: 'Aplicare stil Cursiv (Italic)' },
      { keys: 'Ctrl + U', action: 'Subliniere text (Underline)' },
      { keys: 'Ctrl + J', action: 'Aliniere Justify (ambele margini)' },
      { keys: 'Ctrl + Z / Ctrl + Y', action: 'Anulare operație (Undo) / Refacere operație (Redo)' }
    ],
    faqs: [
      {
        question: 'De ce este greșit să apeși Enter la fiecare linie?',
        answer: 'Deoarece editorul va considera fiecare linie ca fiind un paragraf separat, stricând spațierea și formatarea automată a textului.'
      }
    ],
    practicalLab: 'Tehnoredactează o scurtă compunere respectând alineatul de 1.25 cm, font Arial 12pt, spațiere la 1.15 rânduri și inserarea unui tabel cu orarul clasei.',
    missionId: 'text1'
  },
  {
    id: 'algoritmi',
    slug: 'algoritmi-gandire-computationala',
    title: 'Gândire Computațională, Algoritmi & Structuri de Control',
    shortTitle: 'Algoritmi & Logică',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 5: Algoritmi (pag. 54–71)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    icon: '⚡',
    color: 'from-violet-500 to-purple-700',
    metaDescription: 'Ghid de algoritmi pentru gimnaziu: Proprietățile algoritmilor, pași logici, date de intrare/ieșire, structura secvențială, decizională (IF-ELSE) și repetitivă (WHILE).',
    keywords: [
      'algoritmi clasa 5 informatica',
      'gandire computationala pasi logici',
      'proprietatile algoritmilor claritate finitudine',
      'structura decizionala if else daca atunci altfel',
      'structura repetitiva bucle'
    ],
    competencies: [
      {
        code: '4.1',
        description: 'Descompunerea unei probleme în subprobleme mai simple și descrierea etapelor de rezolvare sub formă de algoritm.'
      },
      {
        code: '4.2',
        description: 'Identificarea și utilizarea structurilor de bază ale algoritmilor: secvențială, alternativă/decizională și repetitivă.'
      }
    ],
    theorySections: [
      {
        title: 'Ce este un Algoritm?',
        content: [
          'Un algoritm este o succesiune finită de pași bine definiți care, aplicată unor date de intrare, produce după un timp finit datele de ieșire (rezultatul căutat).',
          'Exemple din viața de zi cu zi: o rețetă culinară pas-cu-pas, instrucțiunile de asamblare ale unei jucării, algoritmul de spălare a mâinilor.'
        ]
      },
      {
        title: 'Proprietățile Obligatorii ale unui Algoritm',
        content: [
          '1. Claritate (Determinism): Fiecare pas este precis și nu lasă loc de interpretări.',
          '2. Finitudine: Algoritmul trebuie să se oprească după un număr determinat de pași.',
          '3. Generalitate: Algoritmul rezolvă o clasă întreagă de probleme, nu un singur caz particular.',
          '4. Eficiență: Folosește un număr rezonabil de operații și resurse de memorie.'
        ]
      },
      {
        title: 'Cele 3 Structuri Fundamentale',
        content: [
          'Structura Secvențială (Liniară): Operațiile se execută una după alta, în ordinea scrisă.',
          'Structura Alternativă (Decizională): DACĂ o condiție este adevărată, se execută Acțiunea 1; ALTFEL, se execută Acțiunea 2.',
          'Structura Repetitivă (Buclă): CÂT TIMP o condiție este adevărată, se repetă un set de pași.'
        ]
      }
    ],
    keyTerms: [
      { term: 'Algoritm', definition: 'Set ordonat și finit de pași logici care rezolvă o problemă.' },
      { term: 'Variabilă', definition: 'O zonă de memorie denumită care păstrează o valoare ce se poate modifica în timpul rulării.' },
      { term: 'Condiție (Expresie logică)', definition: 'O întrebare care poate avea doar două răspunsuri posibile: Adevărat sau Fals.' }
    ],
    faqs: [
      {
        question: 'Ce se întâmplă dacă un algoritm nu este finit?',
        answer: 'Intră într-o buclă infinită (se blochează) și calculatorul nu va mai furniza niciun rezultat.'
      }
    ],
    practicalLab: 'Scrie algoritmul în pași pentru trecerea sigură a străzii: Verifică semaforul -> DACĂ e verde, traversează; ALTFEL, așteaptă.',
    missionId: 'algo1'
  },
  {
    id: 'scratch',
    slug: 'programare-scratch-animatii',
    title: 'Programare Vizuală cu Blocuri în Scratch: Animații & Jocuri',
    shortTitle: 'Scratch & Coding',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 6: Medii de programare vizuală (pag. 72–93)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    icon: '🐱',
    color: 'from-amber-400 to-orange-500',
    metaDescription: 'Manual Scratch pentru gimnaziu: Blocuri de mișcare, aspect, evenimente, coordonate X/Y, bucle repetă, variabile scor și crearea de jocuri educative.',
    keywords: [
      'scratch programare vizuala clasa 5',
      'blocuri scratch evenimente cand se da clic pe steag',
      'coordonate ecran x y scratch',
      'animatii personaje costume scratch',
      'creare jocuri scratch gimnaziu'
    ],
    competencies: [
      {
        code: '4.3',
        description: 'Construirea de scripturi prin asamblarea blocurilor vizuale pentru animarea personajelor.'
      },
      {
        code: '4.4',
        description: 'Implementarea de jocuri educative simple cu interacțiune prin tastatură, mouse, variabile de scor și mesaje transmise între personaje.'
      }
    ],
    theorySections: [
      {
        title: 'Interfața Mediului Scratch',
        content: [
          'Scena (Stage): Ecranul de 480 x 360 pixeli unde se desfășoară acțiunea.',
          'Personajele (Sprites): Actorii programabili ce conțin scripturi de cod, costume grafice și sunete.',
          'Sistemul de coordonate: Centrul ecranului este (X: 0, Y: 0). X variază de la -240 (stânga) la +240 (dreapta), iar Y de la -180 (jos) la +180 (sus).'
        ]
      },
      {
        title: 'Categoriile de Blocuri Esențiale',
        content: [
          'Evenimente (Galben): „Când se dă clic pe steagul verde”, „Când se apasă tasta Spațiu”.',
          'Mișcare (Albastru): „Mergi 10 pași”, „Mergi la x: y:”, „Dacă atingi marginea, ricoșează”.',
          'Control (Portocaliu): „Repetă de 10 ori”, „La nesfârșit”, „Dacă ... atunci”.',
          'Senzori (Cyan): „Atinge personajul?”, „Distanța până la mouse”.',
          'Variabile (Portocaliu închis): Creează și modifică variabile pentru „Scor” sau „Vieți”.'
        ]
      }
    ],
    keyTerms: [
      { term: 'Script', definition: 'O stivă de blocuri conectate care execută o secvență de comenzi pentru un personaj.' },
      { term: 'Costum', definition: 'O stare grafică alternativă a personajului folosită pentru a crea iluzia de animație.' },
      { term: 'Difuzare mesaj (Broadcast)', definition: 'Trimiterea unui semnal invizibil de la un personaj către toate celelalte pentru sincronizarea scenelor.' }
    ],
    faqs: [
      {
        question: 'Cum fac un personaj să meargă fără să iasă din ecran?',
        answer: 'Adaugi blocul „Dacă atingi marginea, ricoșează” și setezi stilul de rotație stânga-dreapta.'
      }
    ],
    practicalLab: 'Programează un joc de prindere: Un măr cade de sus, iar un coș controlat cu săgețile tastaturii adună puncte la fiecare captură.',
    missionId: 'scratch1'
  },
  {
    id: 'prezentari-slides',
    slug: 'prezentari-powerpoint-slides',
    title: 'Prezentări Multimedia & Diapozitive Interactive',
    shortTitle: 'Prezentări Multimedia',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 1: Tehnoredactare & Prezentări (pag. 10–25)',
    manualRef: 'Manual Art Klett Clasa a VI-a — OMEN 3393/2017',
    icon: '📊',
    color: 'from-rose-500 to-pink-600',
    metaDescription: 'Lecție completă Prezentări PowerPoint & Google Slides clasa a 6-a: Diapozitive, tranziții, animații, reguli de design vizual și susținerea unei expuneri.',
    keywords: [
      'prezentari powerpoint clasa 6',
      'google slides diapozitive gimnaziu',
      'tranzitii animatii diapozitive',
      'reguli design prezentare contrast lizibilitate'
    ],
    competencies: [
      {
        code: '2.1',
        description: 'Crearea unei prezentări multimedia structurate, combinând text, imagini, grafice și forme geometrice.'
      },
      {
        code: '2.2',
        description: 'Aplicarea principiilor estetice de lizibilitate, contrast și echilibru vizual într-o expunere publică.'
      }
    ],
    theorySections: [
      {
        title: 'Regula de Aur a unei Prezentări: 6 x 6',
        content: [
          'Nu încărca diapozitivul cu mult text: maxim 6 rânduri per diapozitiv, maxim 6 cuvinte per rând.',
          'Prezentarea este un suport vizual pentru vorbitor, nu o carte care trebuie citită cuvânt cu cuvânt de pe ecran.',
          'Păstrează un contrast puternic între text și fundal (text întunecat pe fundal deschis sau invers).'
        ]
      }
    ],
    keyTerms: [
      { term: 'Diapozitiv (Slide)', definition: 'O pagină individuală a unei prezentări electronice.' },
      { term: 'Tranziție', definition: 'Efectul vizual care se produce la trecerea de la un diapozitiv la altul.' },
      { term: 'Animație', definition: 'Efectul vizual aplicat unui element individual din interiorul diapozitivului (titlu, imagine).' }
    ],
    faqs: [
      {
        question: 'Cum lansez prezentarea pe tot ecranul?',
        answer: 'Apasă tasta F5 pentru pornire de la primul diapozitiv sau Shift + F5 pentru pornire de la diapozitivul curent.'
      }
    ],
    practicalLab: 'Realizează o prezentare de 4 diapozitive despre „Siguranța pe Internet” cu imagini sugestive și tranziții armonioase.',
    missionId: 'g6p1'
  },
  {
    id: 'paint-3d',
    slug: 'grafica-3d-paint3d',
    title: 'Grafică Tridimensională, Forme & Modele 3D',
    shortTitle: 'Grafică 3D',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 2: Grafică Digitală & Modelare 3D (pag. 26–33)',
    manualRef: 'Manual Art Klett Clasa a VI-a — OMEN 3393/2017',
    icon: '🧊',
    color: 'from-cyan-500 to-blue-600',
    metaDescription: 'Lecție TIC Clasa a 6-a de Grafică 3D: Axele X, Y, Z, rotație spațială, iluminare, texturi, biblioteci 3D și exportul modelelor tridimensionale.',
    keywords: [
      'grafica 3d gimnaziu',
      'paint 3d forme tridimensionale',
      'axe spatiale x y z rotatie 3d',
      'texturi culori modelare digitala'
    ],
    competencies: [
      {
        code: '2.3',
        description: 'Explorarea spațiului tridimensional digital și poziționarea obiectelor pe cele 3 axe (X, Y, Z).'
      }
    ],
    theorySections: [
      {
        title: 'De la 2D la 3D: A treia dimensiune (Z)',
        content: [
          'În spațiul 2D avem doar Lățime (axa X) și Înălțime (axa Y).',
          'În spațiul 3D se adaugă Profunzimea (axa Z), permițând obiectelor să aibă volum, umbre și perspective multiple.',
          'Obiectele 3D pot fi rotite în jurul fiecăreia dintre cele 3 axe pentru a fi vizualizate din orice unghi.'
        ]
      }
    ],
    keyTerms: [
      { term: 'Axa Z', definition: 'Axa spațială care măsoară adâncimea și depărtarea în raport cu privitorul.' },
      { term: 'Model 3D', definition: 'Reprezentarea matematică tridimensională a unui obiect fizic sau imaginar.' }
    ],
    faqs: [
      {
        question: 'Care este diferența dintre o pictură 2D și un obiect 3D?',
        answer: 'Obiectul 3D are volum și poate fi rotit și privit din spate sau din lateral, în timp ce desenul 2D este plat.'
      }
    ],
    practicalLab: 'Construiește o navă spațială folosind un cilindru, două conuri și aplică o textură metalică strălucitoare.',
    missionId: 'g6paint3d'
  },
  {
    id: 'malware-securitate',
    slug: 'securitate-cibernetica-malware',
    title: 'Amenințări Malware, Viruși & Protecție Digitală',
    shortTitle: 'Securitate Cibernetică',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 3: Internet & Securitate Digitală (pag. 44–45)',
    manualRef: 'Manual Art Klett Clasa a VI-a — OMEN 3393/2017',
    icon: '🛡️',
    color: 'from-rose-500 to-red-600',
    metaDescription: 'Lecție completă TIC Clasa a 6-a de Securitate Cibernetică: Malware, Viruși, Viermi, Troieni, Ransomware, Antivirus, Carantină, Firewall și Parole Blindate.',
    keywords: [
      'securitate cibernetica clasa 6',
      'malware virusi viermi troieni',
      'antivirus carantina firewall',
      'parole sigure 2fa gimnaziu',
      'phishing capcane internet'
    ],
    competencies: [
      {
        code: '1.2',
        description: 'Identificarea riscurilor legate de securitatea datelor și a comportamentelor periculoase în mediul virtual.'
      },
      {
        code: '3.1',
        description: 'Aplicarea normelor de securitate și protecție a datelor personale împotriva programelor de tip malware.'
      }
    ],
    theorySections: [
      {
        title: 'Ce este un program dăunător (Malware)?',
        content: [
          'Malware provine de la Malicious Software și desemnează orice cod conceput intenționat pentru a afecta calculatoarele sau a fura date.',
          'Principalele categorii: Viruși (necesită fișier gazdă), Viermi (se replică singuri prin rețea), Troieni (se deghizează în jocuri/utilitare), Spyware (spionează tastele) și Ransomware (criptează datele și cere bani).',
          'Sistemul de apărare cuprinde trei piloni: Programul Antivirus cu actualizare zilnică a semnăturilor, Zidul de Protecție (Firewall) și vigilența utilizatorului (parole blindate și 2FA).'
        ]
      }
    ],
    keyTerms: [
      { term: 'Malware', definition: 'Programe create malițios pentru a perturba sistemul, a fura date sau a obține acces neautorizat.' },
      { term: 'Carantină', definition: 'Zonă de izolare securizată unde fișierele infectate sunt blocate pentru a nu rula cod dăunător.' },
      { term: 'Firewall', definition: 'Barieră de securitate ce monitorizează și filtrează conexiunile de rețea între PC și Internet.' },
      { term: 'Phishing', definition: 'Tehnică de fraudă prin care atacatorii mimează instituții de încredere pentru a fura parole.' }
    ],
    faqs: [
      {
        question: 'Dacă am Firewall activat, mai am nevoie de Antivirus?',
        answer: 'Da, absolut! Firewall-ul oprește conexiunile periculoase din rețea, dar Antivirusul scanează fișierele deja descărcate sau rulate de pe disc.'
      },
      {
        question: 'Cum îmi dau seama dacă un email este Phishing?',
        answer: 'Verifică adresa reală a expeditorului (după @), fii atent la sentimentul fals de panică („urgent”) și nu deschide atașamente executabile (.exe).'
      }
    ],
    practicalLab: 'Realizează o scanare antivirus de sistem, trimite fișierele infectate în Carantină și configurează o parolă blindată de peste 12 caractere.',
    missionId: 'g6malware'
  },
  {
    id: 'prezentari-slides-2',
    slug: 'prezentari-design-animatii-proiect',
    title: 'Design Diapozitive, Tranziții, Animații & Proiect Turistic',
    shortTitle: 'Design & Animații Slide',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 1: Tehnoredactare & Prezentări (pag. 16–25)',
    manualRef: 'Manual Art Klett Clasa a VI-a — OMEN 3393/2017',
    icon: '🎬',
    color: 'from-pink-500 to-rose-600',
    metaDescription: 'Ghid complet TIC Clasa a 6-a: Inserare imagini, SmartArt, forme geometrice, tranziții fluide, animații de intrare/ieșire, reguli de design și susținerea unei expuneri.',
    keywords: [
      'design prezentari clasa 6',
      'tranzitii slide powerpoint',
      'animatii intrare accent iesire',
      'smartart diagrame proiect',
      'public speaking expunere diapozitive'
    ],
    competencies: [
      {
        code: '2.1',
        description: 'Personalizarea diapozitivelor prin inserarea și formatarea obiectelor multimedia (imagini, sunete, forme, SmartArt).'
      },
      {
        code: '2.2',
        description: 'Aplicarea efectelor de tranziție și animație pentru evidențierea ideilor cheie, respectând principiile de lizibilitate.'
      }
    ],
    theorySections: [
      {
        title: 'Tranziții vs Animații: Diferența Esențială',
        content: [
          'Tranziția este efectul vizual aplicat întregului diapozitiv în momentul trecerii de la un slide la următorul.',
          'Animația este efectul aplicat unui element specific din slide (un titlu, o fotografie, o casetă de text, o formă geometrică).',
          'Tipuri de animații: Intrare (verde - cum apare elementul), Accent (galben - cum pulsează/se evidențiază), Ieșire (roșu - cum dispare din cadru).'
        ],
        tips: 'Moderare: Folosește maxim 1 sau 2 tipuri de tranziții în toată prezentarea pentru a nu distrage atenția publicului!'
      },
      {
        title: 'Elemente Vizuale & SmartArt',
        content: [
          'Diagramele SmartArt transformă listele plictisitoare de text în diagrame vizuale atractive (procese, cicluri, ierarhii, relații).',
          'Imaginile trebuie să fie de rezoluție bună și aliniate armonios, respectând regula treimilor.',
          'Regula contrastului: pe fundal întunecat se folosește text luminos (alb/galben); pe fundal deschis se folosește text închis la culoare (negru/albastru închis).'
        ]
      }
    ],
    keyTerms: [
      { term: 'SmartArt', definition: 'Instrument grafic care organizează informațiile în diagrame schematice profesionale.' },
      { term: 'Tranziție', definition: 'Efect vizual de trecere între două diapozitive consecutive.' },
      { term: 'Animație de Intrare', definition: 'Efect care aduce un obiect pe ecran în timpul expunerii.' },
      { term: 'Cronometrare (Timing)', definition: 'Setarea duratei de afișare și a întârzierii animațiilor.' }
    ],
    keyboardShortcuts: [
      { keys: 'F5', action: 'Lansarea prezentării pe tot ecranul de la primul diapozitiv' },
      { keys: 'Shift + F5', action: 'Pornirea prezentării de la diapozitivul curent selectat' },
      { keys: 'B / W', action: 'Înnegrirea (Black) sau albirea (White) temporară a ecranului în timpul expunerii' }
    ],
    faqs: [
      {
        question: 'Cum adaug o melodie de fundal care să ruleze pe toate slide-urile?',
        answer: 'Inserează fișierul audio pe primul diapozitiv și bifează opțiunea „Play Across Slides” (Redare pe toate diapozitivele).'
      }
    ],
    practicalLab: 'Realizează proiectul turistic „Obiective de Vizitat în România” cu 5 diapozitive, SmartArt pentru traseu și animații de intrare pe imagini.',
    missionId: 'g6p2'
  },
  {
    id: 'email-neticheta',
    slug: 'email-neticheta-colaborare-cloud',
    title: 'Servicii E-mail, Netichetă & Colaborare în Cloud',
    shortTitle: 'E-mail, Netichetă & Cloud',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 3: Internet & Comunicare Digitală (pag. 46–61)',
    manualRef: 'Manual Art Klett Clasa a VI-a — OMEN 3393/2017',
    icon: '✉️',
    color: 'from-blue-600 to-indigo-700',
    metaDescription: 'Lecție completă TIC Clasa a 6-a: Structura e-mailului, Câmpurile To, CC, BCC, atașamente <25MB, Netichetă, Protocol Anti-Cyberbullying și colaborare securizată în Cloud.',
    keywords: [
      'email clasa 6 gimnaziu',
      'campuri to cc bcc diferenta',
      'atasa fisier limita 25mb',
      'neticheta reguli bune maniere online',
      'cyberbullying raportare 119',
      'google drive onedrive permisiuni viewer editor'
    ],
    competencies: [
      {
        code: '1.2',
        description: 'Aplicarea normelor de securitate și a eticii în comunicarea electronică (Neticheta).'
      },
      {
        code: '3.1',
        description: 'Utilizarea serviciilor de poștă electronică pentru schimbul de mesaje și fișiere atașate în condiții de siguranță.'
      },
      {
        code: '3.2',
        description: 'Partajarea resurselor și colaborarea online pe documente în spații de stocare Cloud.'
      }
    ],
    theorySections: [
      {
        title: 'Anatomia Adresei & Câmpurile de Adresare',
        content: [
          'Adresă e-mail: utilizator@server.domeniu (ex: elev@scoala.ro). Simbolul @ separă utilizatorul de gazdă.',
          'Câmpul TO (Către): destinatarii principali cărora li se cere o acțiune sau răspuns direct.',
          'Câmpul CC (Carbon Copy): persoane informate secundar; adresele sunt vizibile pentru toți.',
          'Câmpul BCC (Blind Carbon Copy): destinatarii ascunși; adresele sunt 100% invizibile pentru ceilalți (esențial pentru protejarea intimității la trimiteri colective).'
        ],
        tips: 'Regula de aur GDPR: Când trimiți o invitație către toți colegii de clasă, pune-le adresele în BCC pentru a nu le divulga fără acord!'
      },
      {
        title: 'Atașamente & Limita de 25 MB',
        content: [
          'Fișierele atașate (simbol agrafă 📎) au o limită de maxim 25 MB în majoritatea serviciilor de e-mail.',
          'Fișierele voluminoase (>25 MB) se încarcă în Cloud (Google Drive / OneDrive) și se trimite linkul de acces.',
          'Sunt strict interzise fișierele executabile (.exe, .bat, .vbs) deoarece pot infecta calculatoarele cu viruși.'
        ]
      },
      {
        title: 'Neticheta: Reguli de Bun Simț în Mediul Digital',
        content: [
          'Nu scrie cu MAJUSCULE: în lumea digitală, textul cu majuscule înseamnă că STRIGI sau ȚIPI la destinatar.',
          'Subiectul (Subject) este obligatoriu: rezumă clar conținutul mesajului în câteva cuvinte.',
          'Formula politicoasă: include salutul („Bună ziua, stimate domnule profesor”), paragrafe aerisite și formula de încheiere cu semnătură („Cu respect, Nume Prenume”).',
          'Nu participa la Cyberbullying: raportează, blochează agresorii și apelează numărul gratuit 119 sau 116 111.'
        ]
      },
      {
        title: 'Partajarea în Cloud: Viewer vs Commenter vs Editor',
        content: [
          'Vizualizator (Viewer): poate doar citi și descărca documentul; nu poate modifica nimic.',
          'Comentator (Commenter): poate lăsa sugestii și notițe pe marginea textului.',
          'Editor: are drepturi complete de editare, adăugare și ștergere de conținut în timp real.',
          'Istoricul Versiunilor (Version History): permite recuperarea oricărei modificări șterse din greșeală.'
        ]
      }
    ],
    keyTerms: [
      { term: 'BCC (Cci)', definition: 'Blind Carbon Copy — câmp de e-mail ce ascunde complet identitatea destinatarilor.' },
      { term: 'Netichetă', definition: 'Ansamblul de reguli de politețe și respect reciproc în comunicarea pe Internet.' },
      { term: 'Cyberbullying', definition: 'Hărțuirea sau intimidarea unei persoane prin mijloace digitale.' },
      { term: 'Cloud Storage', definition: 'Stocarea fișierelor pe servere conectate la Internet (Google Drive, OneDrive).' },
      { term: 'Version History', definition: 'Jurnal cronologic al modificărilor unui fișier partajat, permițând restaurarea.' }
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl + Enter', action: 'Trimiterea rapidă a e-mailului compus în majoritatea clienților de mail' },
      { keys: 'Ctrl + K', action: 'Inserarea unui hyperlink către o resursă Cloud pe un cuvânt selectat' }
    ],
    faqs: [
      {
        question: 'Care este diferența dintre Reply și Reply All?',
        answer: 'Reply răspunde doar expeditorului inițial, în timp ce Reply All trimite mesajul tău către toți cei din lista To și CC, ceea ce poate crea spam inutil.'
      },
      {
        question: 'Ce număr pot apela gratuit dacă eu sau un coleg suntem hărțuiți online?',
        answer: '119 (Numărul Național pentru Urgențe Copii) sau 116 111 (Telefonul Copilului).'
      }
    ],
    practicalLab: 'Compune un e-mail politicos către profesor cu o temă atașată, pune adresa părintelui în CC și configurează un document Google Docs cu drept de Editor pentru colegul de bancă.',
    missionId: 'g6email'
  },
  {
    id: 'algoritmi-bucle-scratch-1',
    slug: 'algoritmi-bucle-conditionate-scratch',
    title: 'Algoritmi & Bucle Condiționate în Scratch (Cât timp vs Repetă până când)',
    shortTitle: 'Bucle Scratch 6A',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 4: Algoritmi și programare în Scratch (pag. 62–75)',
    manualRef: 'Manual pag. 62–75 • Unitatea 4',
    icon: 'Repeat',
    color: 'from-amber-500 to-orange-600',
    metaDescription: 'Lecție completă și laborator interactiv Scratch pentru Clasa a VI-a: bucle condiționate, cât timp vs repetă până când, operatori booleeni și prevenirea buclelor infinite.',
    keywords: ['scratch', 'bucle conditionate', 'cat timp', 'while', 'repeat until', 'senzori', 'labirint', 'operatori booleeni'],
    competencies: [
      {
        code: '1.3',
        description: 'Aplicarea regulilor de sintaxă și a structurilor de control în medii vizuale de programare.'
      },
      {
        code: '2.3',
        description: 'Transpunerea algoritmilor exprimați în limbaj natural sau pseudocod în blocuri Scratch.'
      },
      {
        code: '3.2',
        description: 'Depanarea erorilor logice, gestionarea buclelor infinite și utilizarea senzorilor interactivi.'
      }
    ],
    theorySections: [
      {
        title: 'De la Execuție Secvențială la Repetitivă',
        content: [
          'În algoritmii liniari, instrucțiunile se execută una după alta. Când o secvență trebuie repetată de 10 sau 100 de ori, scrierea manuală a fiecărui bloc consumă memorie și duce la erori.',
          'Structura repetitivă (bucla) permite executarea repetată a unui set de instrucțiuni într-un mod compact și eficient.'
        ]
      },
      {
        title: 'Marea Inversare: Pseudocod „Cât timp” vs Scratch „Repetă până când”',
        content: [
          'În pseudocod și limbaje textuale (C++, Python), bucla WHILE („cât timp <condiție> execută”) rulează ATÂT TIMP CÂT condiția este ADEVĂRATĂ și se oprește când devine falsă.',
          'În Scratch, blocul este REPEAT UNTIL („repetă până când <condiție>”), ceea ce înseamnă că rulează ATÂT TIMP CÂT condiția este FALSĂ și se OPREȘTE când condiția din hexagon devine ADEVĂRATĂ.',
          'Pentru a converti „cât timp x > 0” în Scratch, folosim negația logică: „repetă până când x <= 0” sau „repetă până când x = 0”.'
        ],
        tips: 'Regula de aur la test: În Scratch, condiția din buclă este CONDIȚIA DE OPRIRE, nu condiția de continuare!'
      },
      {
        title: 'Operatori Relaționali & Booleeni în Scratch',
        content: [
          'Blocurile verzi hexagonale permit evaluarea adevărului logic: relaționali (>, <, =) și logici.',
          '[ȘI] (AND): ambele condiții trebuie să fie adevărate.',
          '[SAU] (OR): cel puțin o condiție trebuie să fie adevărată.',
          '[NU] (NOT): inversează valoarea logică, transformând Adevărat în Fals.'
        ]
      },
      {
        title: 'Capcana Buclelor Infinite & Comenzi de Oprire',
        content: [
          'O buclă devine infinită atunci când variabila testată nu se modifică niciodată în interiorul corpului buclei sau când pasul de incrementare sare peste valoarea de oprire (ex: x crește cu 2 pornind de la 1 și testează x = 10). Aceasta blochează procesorul sau fila de browser.',
          'Comenzile de oprire dedicate sunt: „oprește [acest script]”, „oprește [alte scripturi ale personajului]” și „oprește [toate]”.'
        ]
      },
      {
        title: 'Senzori Inteligenți Scratch & Navigație Autonomă',
        content: [
          'Categoria Detectare (Senzori) oferă blocuri precum: <atinge [margine/personaj]>, <atinge culoarea [#...]>, (distanța până la [țintă]) și <tasta [spațiu] apăsată?>.',
          'Împreună cu buclele condiționate, senzorii permit personajelor să reacționeze la mediu, să navigheze autonom în labirinturi și să evite coliziunile.'
        ]
      }
    ],
    keyTerms: [
      { term: 'Buclă (Loop)', definition: 'Structură de control algoritmică ce repetă un set de instrucțiuni pe baza unei condiții sau a unui contor.' },
      { term: 'Cât timp (While)', definition: 'Buclă cu test inițial din pseudocod ce rulează cât timp condiția este Adevărată.' },
      { term: 'Repetă până când (Repeat Until)', definition: 'Buclă nativă Scratch ce rulează cât timp condiția este Falsă și se oprește când devine Adevărată.' },
      { term: 'Buclă Infinită', definition: 'Eroare de programare în care condiția de oprire nu este niciodată atinsă, blocând programul.' },
      { term: 'Operatori Logici', definition: 'Blocurile ȘI (AND), SAU (OR), NU (NOT) utilizate pentru a construi condiții compuse.' }
    ],
    keyboardShortcuts: [
      { keys: 'Spațiu', action: 'Tastă standard frecvent verificată prin senzorul <tasta [spațiu] apăsată?>' },
      { keys: 'Steag Verde', action: 'Declanșatorul universal de pornire al proiectelor Scratch' },
      { keys: 'Butonul Roșu (Octogon)', action: 'Oprirea de urgență a tuturor scripturilor și buclelor active' }
    ],
    faqs: [
      {
        question: 'Cum evit o buclă infinită când folosesc o variabilă contor?',
        answer: 'Asigură-te că adaugi instrucțiunea „modifică [contor] cu (1)” în interiorul buclei și folosești operatorul de inegalitate (ex: >= sau >) în loc de egalitate fixă (=).'
      },
      {
        question: 'Care este echivalentul în Scratch pentru condiția compusă „scor > 50 ȘI vieți > 0”?',
        answer: 'Introducem un bloc hexagonal verde < [ ] și [ ] > în care plasăm blocurile <scor > 50> în primul slot și <vieți > 0> în al doilea slot.'
      }
    ],
    practicalLab: 'Construiește un algoritm autonom în Scratch care ghidează robotul printr-un labirint 2D folosind bucla „repetă până când atinge [Steag Verde]” combinată cu senzorul de perete.',
    missionId: 'g6scratch1'
  },
  {
    id: 'animatie-vr-toontastic-cospaces',
    slug: 'animatie-toontastic-realitate-virtuala-vr',
    title: 'Animație Toontastic & Realitate Virtuală VR (Cadre 24 FPS, Regie Audio & CoSpaces)',
    shortTitle: 'Animație & VR 2B',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 2: Animații & Realitate Virtuală (pag. 34–43)',
    manualRef: 'Manual pag. 34–43 • Unitatea 2 (Lecțiile 3–4)',
    icon: 'Clapperboard',
    color: 'from-pink-500 to-purple-600',
    metaDescription: 'Lecție completă și atelier interactiv de TIC pentru Clasa a VI-a: Secretele animației (24 FPS, persistența retiniană), structurarea scenariilor în 3 acte în Toontastic 3D, păpușărie digitală cu voce în direct, coloană sonoră și lumi virtuale 360° în CoSpaces Edu.',
    keywords: ['toontastic', 'animatie', 'fps', '24 fps', 'story arc', 'cospaces', 'vr', 'ar', 'realitate virtuala', 'coblocks'],
    competencies: [
      {
        code: '2.1',
        description: 'Crearea de secvențe animate digitale folosind principii narative și aplicații dedicate (Toontastic 3D).'
      },
      {
        code: '2.2',
        description: 'Sincronizarea dialogului vocal și a efectelor audio cu mișcarea personajelor pe scenă.'
      },
      {
        code: '3.3',
        description: 'Explorarea și configurarea mediilor tridimensionale la 360° și a spațiilor de realitate virtuală (CoSpaces Edu).'
      }
    ],
    theorySections: [
      {
        title: 'Secretele Animației: Persistența Retiniană & Rata de Cadre (FPS)',
        content: [
          'Animația (din latinescul „animare” = a da viață) este iluzia mișcării creată prin succesiunea rapidă de imagini statice (cadre).',
          'Persistența retiniană: Ochiul uman păstrează o imagine timp de aproximativ 1/16 dintr-o secundă. Când imaginile se succed mai rapid de această limită, creierul le contopește într-o mișcare fluidă continuă.',
          'Standardul cinematografic de aur este 24 FPS (Frames Per Second) din anul 1927, în timp ce video pe web folosește 30 FPS, iar jocurile 60 FPS.'
        ],
        tips: 'Regulă de calcul: Durata în secunde × FPS = Numărul total de cadre necesare (ex: 10s × 24 FPS = 240 cadre).'
      },
      {
        title: 'Arcul Narativ în 3 Acte (Story Arc în Toontastic 3D)',
        content: [
          'Actul I - Setup (Începutul): Introducerea personajelor, a decorului și a situației normale inițiale (Cine? și Unde?).',
          'Actul II - Conflict (Punctul Culminant): Apariția obstacolului neașteptat sau a dilemei majore; tensiunea atinge cota maximă.',
          'Actul III - Resolution (Deznodământul): Rezolvarea ingenioasă a problemei, victoria binelui și morala poveștii.'
        ]
      },
      {
        title: 'Păpușărie Digitală & Regie Audio (Digital Puppeteering)',
        content: [
          'În Toontastic 3D, personajele sunt mânuite direct pe ecran precum marionetele cu degetul sau mouse-ul în timp ce microfonul captează vocea sincronizată.',
          'Coloana sonoră (Mood) schimbă 50% din emoția spectatorului: Vesel (Happy), Dramatic (Suspense), Misterios (Spooky), Eroic (Triumphant) sau Sci-Fi.',
          'Netichetă la microfon: Păstrează distanța de 15–20 cm, rostește clar și lucrează într-o încăpere fără zgomot de fond.'
        ]
      },
      {
        title: 'VR vs AR vs MR & Explorare 360° în CoSpaces Edu',
        content: [
          'VR (Virtual Reality): Imersiune 100% într-o lume generată pe calculator prin ochelari opaci 360° (Google Cardboard, Meta Quest).',
          'AR (Augmented Reality): Suprapunerea elementelor 3D peste realitatea fizică vizibilă prin camera telefonului.',
          'CoSpaces Edu: Permite construirea spațiilor 3D panoramice și programarea interactivității cu blocuri vizuale CoBlocks (declanșate la click pe obiecte).'
        ],
        tips: 'Ergonomie VR: Fă pauză la fiecare 15–20 de minute pentru a preveni răul de mișcare cibernetic (simulator sickness).'
      }
    ],
    keyTerms: [
      { term: 'FPS (Frames Per Second)', definition: 'Numărul de imagini statice afișate într-o singură secundă pentru a genera mișcare fluidă.' },
      { term: 'Persistență Retiniană', definition: 'Proprietatea ochiului uman de a păstra o imagine pe retină timp de ~1/16 dintr-o secundă.' },
      { term: 'Digital Puppeteering', definition: 'Mânuirea personajelor pe ecran în timp real concomitent cu înregistrarea vocală.' },
      { term: 'Realitate Virtuală (VR)', definition: 'Mediu 3D artificial în care utilizatorul este complet imersat prin ochelari dedicați.' },
      { term: 'Realitate Augmentată (AR)', definition: 'Tehnologie ce suprapune conținut digital (holograme 3D) peste lumea fizică reală.' },
      { term: 'CoBlocks', definition: 'Limbaj de programare vizual cu blocuri în CoSpaces Edu pentru controlul spațiilor 3D.' }
    ],
    keyboardShortcuts: [
      { keys: 'W, A, S, D', action: 'Navigație și deplasare în spațiul virtual 3D în modul First-Person' },
      { keys: 'Spacebar', action: 'Săritură sau declanșare acțiune în exploratorul virtual' },
      { keys: 'Mouse Drag', action: 'Rotirea privirii la 360° pe axele orizontală și verticală' }
    ],
    faqs: [
      {
        question: 'De ce este standardul de 24 FPS preferat în cinematografie?',
        answer: 'Pentru că oferă fluiditate naturală optimă a mișcării pentru ochiul uman („motion blur” cinematografic) fără costuri excesive de producție.'
      },
      {
        question: 'Care este diferența principală între ochelarii VR și camera AR a telefonului?',
        answer: 'Ochelarii VR blochează complet lumina din cameră și te plasează într-un spațiu 100% digital, în timp ce camera AR afișează camera ta reală și adaugă obiecte 3D peste ea.'
      }
    ],
    practicalLab: 'Realizează un scurtmetraj animat în 3 acte în Toontastic 3D cu personajul Arky salvând laboratorul TIC, adaugă o coloană sonoră potrivită și explorează scena în modul 360° VR.',
    missionId: 'g6_anim3d'
  },
  {
    id: 'algoritmi-contor-minecraft-scratch',
    slug: 'algoritmi-contor-minecraft-scratch',
    title: 'Bucle cu Contor, Minecraft 3D, Fractali & Absolvirea Gimnaziului',
    shortTitle: 'Contor & Minecraft 4B',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 4: Algoritmi & Programare Avansată (pag. 76–93)',
    manualRef: 'Manual pag. 76–93 • Unitatea 4 (Lecțiile 5–7)',
    icon: 'Gamepad2',
    color: 'from-amber-500 via-emerald-600 to-indigo-600',
    metaDescription: 'Lecție completă TIC Clasa a VI-a: Structura repetitivă cu contor (Pentru/Repeat n), suma lui Gauss, geometria poligoanelor (360°/n), proiectul Minecraft 3D cu straturi de adâncime (Layering), Albumul Brâncuși, fractali recursivi și Diploma Oficială de Absolvire Gimnazială.',
    keywords: [
      'scratch contor for',
      'suma lui gauss scratch',
      'minecraft 3d scratch',
      'layering adancime straturi scratch',
      'album brancusi coloana infinitului',
      'fractali proceduri my blocks',
      'tic clasa 6 manual art klett'
    ],
    competencies: [
      {
        code: '1.3',
        description: 'Construirea de algoritmi cu număr cunoscut de iterații folosind bucle cu contor și variabile numerice.'
      },
      {
        code: '2.4',
        description: 'Generarea figurilor geometrice regulate și a fractalilor prin calculul unghiurilor exterioare (360°/n).'
      },
      {
        code: '3.1',
        description: 'Proiectarea jocurilor 2.5D interactive cu straturi de adâncime (Z-index), efecte grafice și proceduri modulare (My Blocks).'
      }
    ],
    theorySections: [
      {
        title: 'Structura cu Contor (Pentru / Repeat n) & Suma lui Gauss',
        content: [
          'Spre deosebire de buclele condiționate, structura „Pentru i ← 1, n execută” cunoaște numărul exact de repetiții înainte de începerea execuției.',
          'În Scratch, blocul galben „repetă (n)” execută instrucțiunile din interior de exact n ori.',
          'Suma lui Gauss: S = 1 + 2 + ... + n = n × (n + 1) / 2. Prin acumularea succesivă a contorului într-o variabilă „suma”, calculăm instantaneu serii numerice mari.'
        ],
        tips: 'Regulă Scratch: Dacă ai nevoie de valoarea curentă a contorului în interiorul buclei, folosește o variabilă proprie „i” și instrucțiunea „modifică [i] cu (1)”.'
      },
      {
        title: 'Geometria Poligoanelor Regulate & Regula celor 360°',
        content: [
          'Pentru a trasa un poligon regulat închis, personajul trebuie să se rotească la fiecare colț cu unghiul exterior: Unghi = 360° / n.',
          'Exemple clasice: Triunghi echilateral = 120° (360°/3), Pătrat = 90° (360°/4), Pentagon = 72° (360°/5), Hexagon = 60° (360°/6), Octogon = 45° (360°/8).',
          'Cercul în Scratch este aproximat ca un poligon regulat cu 360 de laturi infime: repetă (360) [ mergi (1) pași, rotește (1) grade ].'
        ]
      },
      {
        title: 'Proiectul Minecraft 3D: Adâncime (Layering) & Coordonate',
        content: [
          'Ecranul Scratch este o grilă carteziană 480 × 360: X variază de la -240 la +240, iar Y variază de la -180 la +180, cu originea (0,0) în centru.',
          'Iluzia tridimensională (2.5D) se obține combinând: 1) Ordinea straturilor (blocurile „mergi în stratul [din față]” și „mergi în spate cu n straturi”), 2) Scalarea mărimii copacilor odată cu distanța („setează mărimea la ... %”), 3) Efectul fantomă pentru transparență și teleportare.'
        ]
      },
      {
        title: 'Albumul Brâncuși, Proceduri „My Blocks” & Fractali',
        content: [
          'În proiectul Albumul Brâncuși, butonul declanșează „decorul următor” și blochează scripturile paralele prin „oprește [alte scripturi din personaj]”.',
          'Coloana Infinitului se generează vertical printr-o buclă repetitivă de 15 moduli romboidali care translează pe axa Y.',
          'Fractalii (forme auto-similare) și arborii recursivi sunt programați prin categoria „Blocurile mele” (My Blocks), permițând crearea de funcții cu parametri numerici (ex: Arbore(lungime)).'
        ],
        tips: 'Oprirea recursivității: O funcție recursivă trebuie să aibă întotdeauna o condiție de oprire de bază (ex: dacă lungime < 10 oprește-te), altfel se produce blocarea programului!'
      }
    ],
    keyTerms: [
      { term: 'Buclă cu Contor (FOR)', definition: 'Structură algoritmică ce repetă o secvență de instrucțiuni de un număr exact și prestabilit de ori.' },
      { term: 'Suma lui Gauss', definition: 'Formula matematică S = n(n+1)/2 pentru calculul sumei primelor n numere naturale.' },
      { term: 'Unghi Exterior (360°/n)', definition: 'Unghiul cu care trebuie să se rotească creionul pentru a desena un poligon regulat închis cu n laturi.' },
      { term: 'Straturi de Adâncime (Layering / Z-index)', definition: 'Ordinea de suprapunere a personajelor pe ecran, stabilind care obiect este în prim-plan și care în fundal.' },
      { term: 'Efect Fantomă (Ghost)', definition: 'Efect grafic de transparență în Scratch (0 = opac, 100 = complet invizibil).' },
      { term: 'Blocuri Proprii (My Blocks)', definition: 'Proceduri și subprograme personalizate definite de utilizator, ce acceptă parametri de intrare.' },
      { term: 'Fractal', definition: 'Figură geometrică complexă ce prezintă auto-similaritate (părțile componente sunt identice sau similare cu întregul).' }
    ],
    keyboardShortcuts: [
      { keys: 'Săgeată Stânga / Dreapta', action: 'Deplasare orizontală pe axa X în jocul Minecraft 2.5D' },
      { keys: 'Săgeată Sus / Spațiu', action: 'Săritură verticală pe axa Y sau punere de blocuri' },
      { keys: 'Ctrl + P', action: 'Tipărirea oficială a Diplomei de Absolvire Gimnazială TIC' }
    ],
    faqs: [
      {
        question: 'Cum calculează Scratch suma primelor 100 de numere?',
        answer: 'Inițializăm suma cu 0 și i cu 1. În bucla „repetă (100)”, adăugăm i la sumă și mărim i cu 1. La final, suma va fi exact 5050, conform formulei lui Gauss 100×101/2!'
      },
      {
        question: 'Cum facem ca un copac să pară mai departe în spațiu?',
        answer: 'Îi setăm o mărime mai mică (ex: 60% în loc de 100%) și îl trimitem într-un strat inferior cu blocul „mergi în spate cu (1) straturi”.'
      },
      {
        question: 'Ce diplomă se deblochează la finalul Modulului 4B?',
        answer: 'Diploma Oficială de Onoare Gimnazială ce atestă absolvirea completă a programei de Informatică și TIC Clasa a VI-a conform standardelor Ministerului Educației!'
      }
    ],
    practicalLab: 'Construiește în Scratch o scenă de Minecraft 3D cu personajul ghidat din taste, un copac în adâncime și generează Coloana Infinitului cu 15 moduli romboidali procedurali!',
    missionId: 'g6_scratch2'
  },
  ...GRADE_7_CURRICULA_MODULES,
  ...GRADE_8_CURRICULA_MODULES
];

