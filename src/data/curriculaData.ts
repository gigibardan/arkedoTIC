export interface CurriculaModule {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  grade: 'Clasa a V-a' | 'Clasa a VI-a';
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
  faqs: {
    question: string;
    answer: string;
  }[];
  practicalLab: string;
  missionId: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6p1' | 'g6p2' | 'g6paint3d';
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
  }
];
