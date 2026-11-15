import { GlossaryTerm } from './types';

export const GLOSSARY_TERMS_PART_1: GlossaryTerm[] = [
  // =========================================================================
  // 1. HARDWARE & SYSTEMS (8)
  // =========================================================================
  {
    id: 'cpu-processor',
    category: 'hardware-systems',
    grades: ['5', '7', '8'],
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    relatedModuleId: 'hardware',
    relatedMissionId: 'hardware',
    relatedBlogIds: ['alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente'],
    relatedTermIds: ['ram-memory', 'ssd-vs-hdd', 'bit-and-byte'],
    ro: {
      slug: 'procesor-cpu',
      term: 'Procesor (CPU — Central Processing Unit)',
      shortAnswer:
        'Procesorul (CPU) este „creierul” calculatorului: circuitul electronic integrat montat pe placa de bază care citește, decodifică și execută miliarde de instrucțiuni pe secundă pentru sistemele de operare, aplicații și jocuri.',
      explanation: [
        'Fiecare acțiune de pe ecran — de la adunarea a două numere în C++ până la deschiderea browserului — trece prin unitatea aritmetico-logică (ALU) și unitatea de control (CU) din interiorul procesorului.',
        'Performanța unui CPU pentru școală depinde de numărul de nuclee (Cores, ex. 4–8 nuclee pentru multitasking), frecvența măsurată în Gigahertzi (GHz) și memoria rapidă Cache integrată.'
      ],
      syntaxOrFormula: {
        title: 'Ciclul de execuție CPU (Fetch – Decode – Execute)',
        code: '1. FETCH:   CPU citește instrucțiunea următoare din memoria RAM\n2. DECODE:  Unitatea de control traduce codul binar (0 și 1)\n3. EXECUTE: Unitatea aritmetico-logică (ALU) efectuează calculul\n4. STORE:   Rezultatul este scris în regiștri sau în RAM'
      },
      example:
        'Un procesor cu frecvența de 3,5 GHz și 6 nuclee execută în paralel lecția din browser, apelul video și compilatorul Code::Blocks fără blocaje.',
      commonMistake:
        'Mulți elevi confundă unitatea centrală (carcasa PC-ului cu toate piesele) cu microprocesorul (CPU), care este doar cipul pătrat montat sub radiatorul de răcire pe placa de bază.',
      vsComparison: {
        title: 'CPU vs. GPU (Placă video)',
        summary:
          'CPU are câteva nuclee foarte inteligente pentru logică secvențială (sistem de operare, algoritmi C++), în timp ce GPU are mii de nuclee mai simple specializate în calcule grafice 3D și AI în paralel.'
      },
      faqs: [
        {
          question: 'În ce unitate de măsură se exprimă viteza procesorului?',
          answer: 'Viteza de tact a procesorului se măsoară în Hertzi (Hz), în prezent în Gigahertzi (GHz), unde 1 GHz înseamnă un miliard de cicluri pe secundă.'
        },
        {
          question: 'Ce componente alcătuiesc un CPU?',
          answer: 'Principalele componente sunt Unitatea de Control (CU), Unitatea Aritmetico-Logică (ALU) și regiștrii + memoria Cache.'
        }
      ],
      keywords: 'ce este procesorul cpu, arhitectura calculatorului clasa 5, cpu alu cu, frecventa ghz'
    },
    en: {
      slug: 'cpu-processor',
      term: 'CPU (Central Processing Unit)',
      shortAnswer:
        'The CPU (Central Processing Unit) is the "brain" of a computer: the microchip mounted on the motherboard that fetches, decodes, and executes instructions every second for the operating system, school apps, and programs.',
      explanation: [
        'Every calculation—whether adding numbers in C++ or rendering a slide—is processed by the CPU’s Control Unit (CU) and Arithmetic Logic Unit (ALU).',
        'Modern school laptops use multi-core CPUs (4 to 8+ cores) measured in Gigahertz (GHz) with fast built-in Cache memory to keep multiple apps responsive.'
      ],
      syntaxOrFormula: {
        title: 'Instruction Cycle (Fetch – Decode – Execute)',
        code: '1. FETCH:   Read next instruction from RAM\n2. DECODE:  Control Unit interprets the binary opcode\n3. EXECUTE: ALU performs arithmetic or logic operation\n4. STORE:   Write result back to CPU register or RAM'
      },
      example:
        'A 6-core 3.5 GHz CPU can run a browser lesson, music, and the Code::Blocks C++ compiler simultaneously without lag.',
      commonMistake:
        'Students often call the entire PC tower case the "CPU." In hardware terminology, the CPU is strictly the silicon processor chip under the cooler on the motherboard.',
      vsComparison: {
        title: 'CPU vs. GPU',
        summary:
          'A CPU excels at sequential problem-solving and OS tasks with a few powerful cores, while a GPU uses thousands of smaller cores for parallel 3D graphics and AI workloads.'
      },
      faqs: [
        {
          question: 'How is CPU clock speed measured?',
          answer: 'CPU clock speed is measured in Gigahertz (GHz), where 1 GHz equals one billion clock cycles per second.'
        },
        {
          question: 'What are the two main parts inside a CPU?',
          answer: 'The Control Unit (CU), which directs instruction flow, and the Arithmetic Logic Unit (ALU), which performs math and logical comparisons.'
        }
      ],
      keywords: 'what is a cpu, central processing unit middle school, fetch decode execute'
    }
  },
  {
    id: 'ram-memory',
    category: 'hardware-systems',
    grades: ['5', '7'],
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    relatedModuleId: 'hardware',
    relatedMissionId: 'hardware',
    relatedBlogIds: ['alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente'],
    relatedTermIds: ['ssd-vs-hdd', 'cpu-processor', 'bit-and-byte'],
    ro: {
      slug: 'memorie-ram',
      term: 'Memorie RAM (Random Access Memory)',
      shortAnswer:
        'Memoria RAM este memoria de lucru temporară și foarte rapidă a calculatorului, în care sunt încărcate programele și fișierele deschise acum. Este o memorie volatilă: conținutul ei se șterge complet când oprești calculatorul.',
      explanation: [
        'Imaginează-ți RAM-ul ca pe banca ta de la școală: acolo îți ții caietele deschise cât lucrezi, în timp ce ghiozdanul sau dulapul este SSD-ul unde păstrezi cărțile pe termen lung.',
        'Dacă ai puțină memorie RAM (ex. 4 GB), calculatorul se blochează când deschizi mai multe file în browser; pentru școală în 2026 sunt recomandați 16 GB RAM.'
      ],
      syntaxOrFormula: {
        title: 'Regulă de aur hardware',
        code: 'RAM = Memorie Volatilă (rapidă, se șterge fără curent)\nROM = Memorie Nevolatilă (doar citire, conține BIOS/UEFI la pornire)\nSSD = Stocare Permanentă (păstrează fișierele salvate)'
      },
      example:
        'Dacă scrii un referat în Word fără să apeși Ctrl+S și se ia curentul, textul aflat doar în RAM se pierde.',
      commonMistake:
        'Confuzia între capacitatea RAM (ex. 16 GB) și capacitatea de stocare a SSD-ului (ex. 512 GB). Ele nu se adună și au roluri complet diferite.',
      vsComparison: {
        title: 'Memorie RAM vs. Memorie ROM',
        summary:
          'RAM permite atât citirea, cât și scrierea rapidă și este volatilă. ROM (Read-Only Memory) păstrează permanent instrucțiunile de pornire (BIOS/UEFI) chiar și fără curent.'
      },
      faqs: [
        {
          question: 'Ce înseamnă că memoria RAM este volatilă?',
          answer: 'Înseamnă că datele stocate în RAM dispar imediat ce calculatorul nu mai primește energie electrică.'
        },
        {
          question: 'De ce este bine să apeși Ctrl+S des când lucrezi?',
          answer: 'Comanda Ctrl+S copiază modificările din memoria temporară RAM pe unitatea permanentă SSD/HDD.'
        }
      ],
      keywords: 'ce este memoria ram, memorie volatila rom vs ram, 16 gb ram laptop scoala'
    },
    en: {
      slug: 'ram-memory',
      term: 'RAM (Random Access Memory)',
      shortAnswer:
        'RAM is a computer’s fast, temporary working memory that holds active apps, browser tabs, and open documents. It is volatile memory, meaning all data in RAM disappears as soon as power is turned off.',
      explanation: [
        'Think of RAM like your school desk: you keep open notebooks there while studying, whereas your SSD is your backpack or locker for long-term storage.',
        'Having at least 16 GB of RAM keeps a student computer smooth when switching between a browser, Word, and Code::Blocks.'
      ],
      syntaxOrFormula: {
        title: 'Quick Memory Comparison',
        code: 'RAM = Volatile working memory (erased on power loss)\nROM = Non-volatile read-only startup firmware (BIOS/UEFI)\nSSD = Non-volatile permanent file storage'
      },
      example:
        'If you type an essay without pressing Ctrl+S and the battery dies, unsaved changes sitting only in RAM are lost.',
      commonMistake:
        'Mixing up RAM capacity (e.g., 16 GB) with SSD storage size (e.g., 512 GB).',
      vsComparison: {
        title: 'RAM vs. ROM',
        summary:
          'RAM is read/write and temporary; ROM (Read-Only Memory) permanently stores the boot instructions needed to start the computer.'
      },
      faqs: [
        {
          question: 'Why is RAM called volatile memory?',
          answer: 'Because it requires continuous electrical power to retain data; once turned off, its contents are wiped.'
        }
      ],
      keywords: 'what is ram memory, volatile vs non volatile, ram vs rom middle school'
    }
  },
  {
    id: 'ssd-vs-hdd',
    category: 'hardware-systems',
    grades: ['5', '7'],
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    relatedModuleId: 'hardware',
    relatedMissionId: 'hardware',
    relatedBlogIds: ['alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente'],
    relatedTermIds: ['ram-memory', 'cpu-processor', 'operating-system'],
    ro: {
      slug: 'ssd-vs-hdd',
      term: 'SSD vs. HDD (Medii de Stocare Nevolatile)',
      shortAnswer:
        'SSD (Solid State Drive) și HDD (Hard Disk Drive) sunt unitățile de stocare permanentă (nevolatilă) ale calculatorului. SSD-ul folosește cipuri flash fără piese mobile și este de 5–10 ori mai rapid decât HDD-ul cu discuri magnetice.',
      explanation: [
        'Pe SSD sau HDD sunt salvate sistemul de operare Windows/Linux, jocurile, fotografiile și proiectele tale de la școală, rămânând acolo și după ce scoți calculatorul din priză.',
        'Un SSD NVMe modern pornește calculatorul în 8–10 secunde, în timp ce un HDD mecanic vechi poate dura 40–60 de secunde și este sensibil la șocuri.'
      ],
      syntaxOrFormula: {
        title: 'Viteză orientativă de citire/scriere',
        code: 'HDD (7200 RPM, mecanic): ~100 – 150 MB/s\nSSD SATA III:            ~500 – 550 MB/s\nSSD NVMe M.2 (PCIe):     ~3.000 – 7.000 MB/s'
      },
      example:
        'Un laptop de școală cu SSD NVMe de 512 GB deschide aplicațiile de birotică și proiectele video instantaneu, spre deosebire de un HDD clasic.',
      commonMistake:
        'A crede că un HDD „are mai multă memorie RAM”. HDD și SSD sunt unități de stocare secundară, nu memorie RAM.',
      vsComparison: {
        title: 'SSD (Flash) vs. HDD (Magnetic)',
        summary:
          'SSD-ul este silențios, rezistent la șocuri și ultra-rapid; HDD-ul oferă cost mai mic pe Terabyte pentru arhive mari, dar este lent și fragil mecanic.'
      },
      faqs: [
        {
          question: 'Ce este recomandat pentru un laptop de școală: SSD sau HDD?',
          answer: 'Obligatoriu SSD (ideal NVMe de cel puțin 256–512 GB) pentru viteză rapidă la pornire și silențiozitate.'
        }
      ],
      keywords: 'diferenta ssd vs hdd, ce este ssd nvme, stocare nevolatila clasa 5'
    },
    en: {
      slug: 'ssd-vs-hdd',
      term: 'SSD vs. HDD (Permanent Storage)',
      shortAnswer:
        'SSDs (Solid State Drives) and HDDs (Hard Disk Drives) provide permanent, non-volatile storage for your operating system and files. An SSD uses fast flash chips with no moving parts, making it 5–10× faster than a spinning magnetic HDD.',
      explanation: [
        'Unlike RAM, both SSDs and HDDs retain your files, photos, and school projects when the computer is switched off.',
        'Modern NVMe SSDs boot an OS in around 10 seconds and handle heavy multitasking silently without fragile spinning platters.'
      ],
      syntaxOrFormula: {
        title: 'Typical Read/Write Speeds',
        code: 'HDD (7200 RPM): ~100–150 MB/s\nSATA SSD:       ~500–550 MB/s\nNVMe M.2 SSD:   ~3,000–7,000 MB/s'
      },
      example:
        'A 512 GB NVMe SSD loads school editing software in 2 seconds instead of 20 seconds on an old HDD.',
      commonMistake:
        'Thinking that freeing space on an SSD increases RAM size. Storage capacity and RAM are separate components.',
      vsComparison: {
        title: 'Solid State vs. Spinning Platter',
        summary:
          'SSDs win on speed, shock resistance, and silence; HDDs are mainly used for cheap high-capacity archival backups.'
      },
      faqs: [
        {
          question: 'Do files stay on an SSD after turning off the PC?',
          answer: 'Yes, SSDs and HDDs are both non-volatile storage media.'
        }
      ],
      keywords: 'ssd vs hdd explained, non-volatile storage, nvme ssd speed'
    }
  },
  {
    id: 'bit-and-byte',
    category: 'hardware-systems',
    grades: ['5', '6', '7'],
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    relatedModuleId: 'hardware',
    relatedMissionId: 'hardware',
    relatedBlogIds: ['alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente'],
    relatedTermIds: ['cpu-processor', 'ram-memory', 'rgb-pixel-resolution'],
    ro: {
      slug: 'bit-si-byte-octet',
      term: 'Bit și Byte (Octet) — Unități de Măsură ale Informației',
      shortAnswer:
        'Bitul (b) este cea mai mică unitate de informație digitală și poate avea doar două valori: 0 sau 1. Un Byte / Octet (B) este format din 8 biți și poate reprezenta un caracter (o literă, o cifră sau un semn de punctuație).',
      explanation: [
        'Calculatoarele lucrează cu curent electric (lipsă tensiune = 0, prezență tensiune = 1), adică în sistemul binar (baza 2).',
        'Multiplii binari clasici din programa de TIC folosesc puterile lui 2 (2¹⁰ = 1024): 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB.'
      ],
      syntaxOrFormula: {
        title: 'Tabel conversii binar (Programa TIC Clasa a V-a)',
        code: '1 Byte (B) = 8 biți (b)\n1 Kilobyte (KB) = 1024 Bytes\n1 Megabyte (MB) = 1024 KB\n1 Gigabyte (GB) = 1024 MB\n1 Terabyte (TB) = 1024 GB'
      },
      example:
        'Cuvântul „ARKY” are 4 litere, deci ocupă 4 Bytes = 32 biți în codificare ASCII simplă. Un film HD are ~2 GB = 2048 MB.',
      commonMistake:
        'Confuzia între „b” mic (bit — folosit la viteza internetului, ex. 1000 Mbps) și „B” mare (Byte — folosit la mărimea fișierelor). 100 MB/s înseamnă 800 Mbps!',
      vsComparison: {
        title: 'Bit (b) vs. Byte (B)',
        summary:
          'Bitul este unitatea elementară binară (0/1), iar Byte-ul este pachetul de 8 biți (2⁸ = 256 combinații posibile). Împarte viteza în Mbps la 8 pentru a afla câți MB/s descarci real.'
      },
      faqs: [
        {
          question: 'Câți biți are un octet (Byte)?',
          answer: 'Exact 8 biți.'
        },
        {
          question: 'Câți MB are 1 GB în sistem binar?',
          answer: '1 GB = 1024 MB (2 la puterea a 10-a).'
        }
      ],
      keywords: 'ce este bitul si byte, cati biti are un octet, conversii kb mb gb tb clasa 5'
    },
    en: {
      slug: 'bit-and-byte',
      term: 'Bit & Byte — Digital Information Units',
      shortAnswer:
        'A bit (b) is the smallest unit of digital data and holds a single binary value: 0 or 1. One Byte (B) equals 8 bits and is enough to store a single text character such as a letter or digit.',
      explanation: [
        'Computers store every photo, song, and program as streams of binary 0s and 1s.',
        'Standard binary storage prefixes grow by factors of 1,024 (2¹⁰): 1 KB = 1,024 B, 1 MB = 1,024 KB, 1 GB = 1,024 MB, 1 TB = 1,024 GB.'
      ],
      syntaxOrFormula: {
        title: 'Binary Storage Scale',
        code: '1 Byte (B) = 8 bits (b)\n1 KB = 1,024 Bytes\n1 MB = 1,024 KB\n1 GB = 1,024 MB\n1 TB = 1,024 GB'
      },
      example:
        'A 1,000 Mbps internet connection downloads at most 1,000 / 8 = 125 MB per second.',
      commonMistake:
        'Mixing up lowercase "b" (bits, used for network speeds like Mbps) with uppercase "B" (Bytes, used for file sizes like MB/GB).',
      vsComparison: {
        title: 'Mbps vs. MB/s',
        summary:
          'Network providers advertise speed in Megabits per second (Mbps); file downloads display Megabytes per second (MB/s). Divide Mbps by 8 to get MB/s.'
      },
      faqs: [
        {
          question: 'How many bits make one byte?',
          answer: 'There are exactly 8 bits in 1 byte.'
        }
      ],
      keywords: 'what is a bit and byte, 8 bits in a byte, kb mb gb tb conversion'
    }
  },
  {
    id: 'peripherals-io',
    category: 'hardware-systems',
    grades: ['5'],
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    relatedModuleId: 'hardware',
    relatedMissionId: 'hardware',
    relatedBlogIds: ['alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente'],
    relatedTermIds: ['cpu-processor', 'operating-system', 'arduino-uno'],
    ro: {
      slug: 'dispozitive-periferice',
      term: 'Dispozitive Periferice (Intrare, Ieșire, Mixte)',
      shortAnswer:
        'Dispozitivele periferice sunt echipamentele externe conectate la unitatea centrală pentru a introduce date în calculator (Intrare), a afișa rezultate către utilizator (Ieșire) sau pentru ambele direcții (Intrare-Ieșire).',
      explanation: [
        'Fără periferice, procesorul ar calcula în gol fără să primească comenzi și fără să ne arate rezultatele.',
        'Clasificarea lor exactă este una dintre cele mai frecvente cerințe la testele de TIC din clasa a V-a.'
      ],
      syntaxOrFormula: {
        title: 'Cele 3 categorii oficiale de periferice',
        code: 'INTRARE (Input):        Tastatură, Mouse, Microfon, Scaner, Cameră Web, Joystick\nIEȘIRE (Output):        Monitor, Imprimantă, Boxe, Căști audio, Videoproiector\nINTRARE-IEȘIRE (I/O):   Ecran tactil (Touchscreen), Multifuncțională, Cască VR'
      },
      example:
        'Când vorbești la microfon (Intrare) în timpul orei online și auzi profesorul în boxe (Ieșire), folosești ambele tipuri de periferice.',
      commonMistake:
        'Încadrarea imprimantei la „Intrare” (în realitate scoate foaia din PC, deci este de Ieșire) sau a scanerului la „Ieșire” (introduce imaginea hârtiei în PC, deci este de Intrare).',
      vsComparison: {
        title: 'Monitor clasic vs. Ecran Tactil (Touchscreen)',
        summary:
          'Monitorul clasic doar afișează pixeli (Ieșire), pe când ecranul tactil al telefonului/tabletei și afișează imaginea, și preia atingerea degetului (Intrare-Ieșire).'
      },
      faqs: [
        {
          question: 'Ce tip de periferic este o imprimantă multifuncțională (cu scaner)?',
          answer: 'Este un periferic mixt de Intrare-Ieșire (scanează documente spre PC și tipărește din PC pe hârtie).'
        }
      ],
      keywords: 'dispozitive periferice intrare iesire clasa 5, exemple periferice mixte'
    },
    en: {
      slug: 'peripherals-io',
      term: 'Peripheral Devices (Input, Output & I/O)',
      shortAnswer:
        'Peripherals are external hardware devices connected to a computer to send data in (Input), receive results out (Output), or perform both functions (Input/Output).',
      explanation: [
        'Input peripherals convert human actions or real-world signals into digital data; output peripherals translate digital signals back into visuals, sound, or paper.',
        'Recognizing which direction data flows avoids trick questions on ICT exams.'
      ],
      syntaxOrFormula: {
        title: 'Three Peripheral Categories',
        code: 'INPUT:        Keyboard, Mouse, Microphone, Scanner, Webcam\nOUTPUT:       Monitor, Printer, Speakers, Headphones, Projector\nINPUT/OUTPUT: Touchscreen, All-in-One Printer/Scanner, VR Headset'
      },
      example:
        'A touchscreen tablet acts as an Output device when displaying slides and as an Input device when you tap buttons.',
      commonMistake:
        'Calling a scanner an output device—a scanner sends paper images into the computer, so it is Input.',
      vsComparison: {
        title: 'Printer vs. Scanner',
        summary:
          'A standard printer outputs digital files onto paper (Output); a scanner digitizes paper into the PC (Input).'
      },
      faqs: [
        {
          question: 'Why is a touchscreen classified as Input/Output?',
          answer: 'Because it simultaneously displays visual output and detects touch input.'
        }
      ],
      keywords: 'input output peripheral devices examples, computer peripherals middle school'
    }
  },
  {
    id: 'operating-system',
    category: 'hardware-systems',
    grades: ['5', '6'],
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    relatedModuleId: 'fisiere-so',
    relatedMissionId: 'files',
    relatedBlogIds: ['alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente', 'word-google-docs-referate-scolare-diacritice-margini-cuprins'],
    relatedTermIds: ['file-tree-path', 'file-extension', 'ram-memory'],
    ro: {
      slug: 'sistem-de-operare',
      term: 'Sistem de Operare (SO / Operating System)',
      shortAnswer:
        'Sistemul de operare (SO) este programul fundamental al calculatorului sau telefonului care coordonează componentele hardware (CPU, RAM, stocare) și oferă interfața grafică prin care utilizatorul poate rula aplicații și organiza fișiere.',
      explanation: [
        'Fără un sistem de operare (precum Microsoft Windows, Linux Ubuntu, Apple macOS, Android sau iOS), calculatorul nu ar ști cum să afișeze ferestre, cum să citească mouse-ul sau unde să salveze un document.',
        'Elementele esențiale ale unei interfețe grafice (GUI) includ Desktop-ul (spațiul de lucru), Bara de activități (Taskbar), Meniul Start, pictogramele și ferestrele aplicațiilor.'
      ],
      syntaxOrFormula: {
        title: 'Scurtături esențiale în Windows / Linux',
        code: 'Alt + Tab      -> Comută rapid între ferestrele deschise\nWin + E        -> Deschide File Explorer (Managerul de fișiere)\nWin + D        -> Afișează / ascunde Desktop-ul\nCtrl + Shift + Esc -> Deschide Task Manager (închide aplicații blocate)'
      },
      example:
        'Când apeși butonul Print în Word, Word nu vorbește direct cu imprimanta — îi cere Sistemului de Operare Windows să trimită paginile prin driverul imprimantei.',
      commonMistake:
        'Confuzia între sistemul de operare (Windows 11) și suita de aplicații de birou (Microsoft Office / Word / Excel). Windows este sistemul de operare; Word este doar o aplicație care rulează pe el.',
      vsComparison: {
        title: 'Sistem de Operare vs. Aplicație',
        summary:
          'Sistemul de operare (Windows, Linux, Android) administrează resursele hardware și toate programele; o aplicație (Chrome, Scratch, Word) rulează deasupra SO pentru o sarcină specifică.'
      },
      faqs: [
        {
          question: 'Care sunt cele mai cunoscute sisteme de operare pentru PC și mobil?',
          answer: 'Pentru PC/laptop: Windows, macOS, Linux (Ubuntu, ChromeOS). Pentru telefoane și tablete: Android și iOS.'
        }
      ],
      keywords: 'ce este sistemul de operare, windows linux macos, interfata grafica gui clasa 5'
    },
    en: {
      slug: 'operating-system',
      term: 'Operating System (OS)',
      shortAnswer:
        'An Operating System (OS) is the core software layer that manages all hardware (CPU, RAM, storage, peripherals) and provides the graphical user interface (GUI) so users can launch apps and organize files.',
      explanation: [
        'Popular desktop operating systems include Microsoft Windows, Linux (Ubuntu), and Apple macOS; mobile devices primarily run Android and iOS.',
        'Core GUI elements include the Desktop, Taskbar, Start/App Launcher menu, icons, and resizable application windows.'
      ],
      syntaxOrFormula: {
        title: 'Essential OS Keyboard Shortcuts',
        code: 'Alt + Tab          -> Switch between open windows\nWin + E            -> Open File Explorer\nWin + D            -> Show / hide Desktop\nCtrl + Shift + Esc -> Open Task Manager'
      },
      example:
        'When you click Save in Scratch, the OS allocates space on your SSD and records the .sb3 file safely inside a folder.',
      commonMistake:
        'Confusing Microsoft Windows (the Operating System) with Microsoft Word or Office (productivity applications running inside the OS).',
      vsComparison: {
        title: 'Operating System vs. Application Software',
        summary:
          'The OS manages hardware and schedules resources for everything; an application performs a dedicated task like browsing, coding, or editing documents.'
      },
      faqs: [
        {
          question: 'Can a computer run regular apps without an operating system?',
          answer: 'No, standard user applications rely on the OS to access hardware, display windows, and store files.'
        }
      ],
      keywords: 'what is an operating system, windows vs macos vs linux, os gui shortcuts'
    }
  },
  {
    id: 'file-tree-path',
    category: 'hardware-systems',
    grades: ['5', '7', '8'],
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    relatedModuleId: 'fisiere-so',
    relatedMissionId: 'files',
    relatedBlogIds: ['word-google-docs-referate-scolare-diacritice-margini-cuprins'],
    relatedTermIds: ['file-extension', 'operating-system', 'html5-semantics'],
    ro: {
      slug: 'arbore-fisiere-cale-acces',
      term: 'Structură Arborescentă & Cale de Acces (File Path)',
      shortAnswer:
        'Structura arborescentă este organizarea ierarhică a folderelor (directoarelor) și fișierelor pe un disc, pornind de la rădăcină (ex. C:\\) spre subfoldere. Calea de acces (Path) descrie exact „adresa” completă până la un fișier.',
      explanation: [
        'Așa cum o școală are etaje, clase și bănci, discul de stocare are partiții (rădăcina C:\\ sau D:\\), foldere principale (ex. Scoala) și subfoldere (ex. Clasa7\\Informatica).',
        'Separarea folderelor se face cu backslash (\\) pe Windows și cu slash (/) pe Linux, macOS și în URL-urile de pe Internet.'
      ],
      syntaxOrFormula: {
        title: 'Exemplu de Cale Absolută vs. Relativă',
        code: 'Windows: D:\\Scoala\\Clasa_5\\Referate\\hardware.docx\nLinux / Web: /elevi/clasa_8/site/imagini/logo.png\n\nStructură:\nD:\\ (Rădăcină) -> Scoala -> Clasa_5 -> Referate -> hardware.docx'
      },
      example:
        'În proiectele web din clasa a VIII-a, dacă imaginea este în același folder cu pagina index.html, calea relativă este simplu "logo.png", nu "C:\\Users\\...".',
      commonMistake:
        'Introducerea caracterelor interzise în numele fișierelor sau folderelor în Windows: \\ / : * ? " < > | și folosirea căilor absolute locale pe un site web (care nu vor funcționa pe internet!).',
      vsComparison: {
        title: 'Fișier vs. Folder (Director)',
        summary:
          'Fișierul conține date propriu-zise (un text, o poză, un cod C++) și are mărime; folderul este „dosarul” recipient care grupează mai multe fișiere și alte subfoldere.'
      },
      faqs: [
        {
          question: 'Ce caractere sunt interzise în numele fișierelor pe Windows?',
          answer: 'Nu poți folosi simbolurile: \\ / : * ? " < > |.'
        }
      ],
      keywords: 'structura arborescenta fisiere foldere, cale de acces path windows clasa 5'
    },
    en: {
      slug: 'file-tree-path',
      term: 'Hierarchical File Tree & File Path',
      shortAnswer:
        'A file tree is the hierarchical folder structure on a storage drive starting from a root directory (e.g., C:\\ or /) down through nested subfolders. A file path specifies the exact address of a file inside that tree.',
      explanation: [
        'Organizing school work into clear folders (such as Grade_7 / Science / Lab1.docx) prevents losing assignments.',
        'Windows paths use backslashes (\\), while macOS, Linux, and web URLs use forward slashes (/).'
      ],
      syntaxOrFormula: {
        title: 'Windows vs. Web/Unix Paths',
        code: 'Windows:  D:\\School\\Grade_5\\Reports\\hardware.docx\nWeb/Unix: /students/grade8/website/images/logo.png'
      },
      example:
        'When building a Grade 8 HTML5 website, linking "images/logo.png" (relative path) works on any server, whereas "C:\\Users\\..." breaks online.',
      commonMistake:
        'Using forbidden characters (\\ / : * ? " < > |) in Windows filenames or hardcoding local C:\\ paths inside web pages.',
      vsComparison: {
        title: 'Absolute Path vs. Relative Path',
        summary:
          'An absolute path starts from the drive root (C:\\... or /...); a relative path navigates from the current working folder.'
      },
      faqs: [
        {
          question: 'What is the difference between a file and a folder?',
          answer: 'A file stores actual data (text, image, code), while a folder (directory) is a container that organizes files and subfolders.'
        }
      ],
      keywords: 'hierarchical file system, absolute vs relative file path, folders and directories'
    }
  },
  {
    id: 'file-extension',
    category: 'hardware-systems',
    grades: ['5', '6', '7'],
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    relatedModuleId: 'fisiere-so',
    relatedMissionId: 'files',
    relatedBlogIds: ['word-google-docs-referate-scolare-diacritice-margini-cuprins', 'siguranta-copii-tiktok-roblox-discord-phishing-2fa'],
    relatedTermIds: ['file-tree-path', 'operating-system', 'malware-cybersecurity'],
    ro: {
      slug: 'extensie-fisier',
      term: 'Extensia de Fișier (.docx, .pdf, .cpp, .png, .exe)',
      shortAnswer:
        'Extensia de fișier reprezintă sufixul format din 2–5 caractere aflat după ultimul punct din numele unui fișier (ex. referat.pdf). Ea îi spune sistemului de operare ce tip de date conține fișierul și cu ce program să îl deschidă.',
      explanation: [
        'Afișarea extensiilor în File Explorer este obligatorie pentru siguranța digitală: un fișier suspect numit „tema_matematica.pdf.exe” are de fapt extensia finală .exe (program executabil), nu .pdf!',
        'Redenumirea manuală a extensiei nu convertește formatul — pentru a transforma un .docx în .pdf trebuie folosită funcția Export / Save As PDF.'
      ],
      syntaxOrFormula: {
        title: 'Cele mai întâlnite extensii la TIC (Clasele V–VIII)',
        code: '.docx / .pdf  -> Documente text / Portabile (Word, PDF)\n.xlsx / .pptx -> Calcul tabelar (Excel) / Prezentări (PowerPoint)\n.png / .jpg   -> Imagini bitmap (PNG suportă transparență)\n.mp3 / .mp4   -> Audio comprimat / Video digital\n.sb3 / .cpp   -> Proiect Scratch 3.0 / Cod sursă C++\n.html / .css  -> Pagină Web / Stiluri vizuale\n.exe / .zip   -> Program executabil Windows / Arhivă comprimată'
      },
      example:
        'Când trimiți un referat profesorului, exportă-l în format .pdf ca să păstreze exact fonturile, diacriticele și marginile pe orice dispozitiv.',
      commonMistake:
        'Schimbarea extensiei prin redenumire (ex. poza.jpg -> poza.png) crezând că s-a convertit imaginea, sau deschiderea fișierelor necunoscute .exe / .bat primite pe Discord sau e-mail.',
      vsComparison: {
        title: 'Format .docx vs. .pdf',
        summary:
          '.docx este format editabil pentru lucru și corecturi în Word; .pdf fixează așezarea în pagină pentru predare finală, tipărire și citire universală.'
      },
      faqs: [
        {
          question: 'Cum fac un fișier .docx să devină .pdf?',
          answer: 'Din Word sau Google Docs alegi File -> Save As / Download -> PDF (.pdf). Nu redenumi manual extensia!'
        }
      ],
      keywords: 'ce este extensia unui fisier, extensii fisiere docx pdf cpp exe sb3 clasa 5'
    },
    en: {
      slug: 'file-extension',
      term: 'File Extension (.docx, .pdf, .cpp, .png, .exe)',
      shortAnswer:
        'A file extension is the short suffix after the last dot in a filename (like report.pdf). It tells the operating system what type of data the file holds and which application should open it.',
      explanation: [
        'Turning on visible file extensions in File Explorer is a key cyber-safety habit—a trick file named "homework.pdf.exe" is actually an executable program (.exe), not a PDF.',
        'Simply renaming ".docx" to ".pdf" does not convert the file; always use Export or Save As.'
      ],
      syntaxOrFormula: {
        title: 'Common School ICT Extensions',
        code: '.docx / .pdf  -> Editable document / Fixed layout PDF\n.xlsx / .pptx -> Spreadsheet / Slide presentation\n.png / .jpg   -> Raster images (PNG supports transparency)\n.sb3 / .cpp   -> Scratch 3.0 project / C++ source code\n.html / .css  -> Webpage / Stylesheet\n.exe / .zip   -> Windows program / Compressed archive'
      },
      example:
        'Submit school essays as .pdf so margins, Romanian/English diacritics, and fonts never shift on the teacher’s computer.',
      commonMistake:
        'Renaming a file extension manually instead of exporting, or opening double-extension executables like "game_cheat.png.exe".',
      vsComparison: {
        title: '.docx vs. .pdf',
        summary:
          'Use .docx while writing and editing; export to .pdf for final submission and printing.'
      },
      faqs: [
        {
          question: 'Why are double extensions like .jpg.exe dangerous?',
          answer: 'Only the final extension after the very last dot determines file type; .exe runs executable code that could contain malware.'
        }
      ],
      keywords: 'what is a file extension, common file extensions docx pdf cpp exe'
    }
  },

  // =========================================================================
  // 2. ALGORITHMS & PROGRAMMING (C++ / SCRATCH) (10)
  // =========================================================================
  {
    id: 'algorithm-definition',
    category: 'algorithms-cpp',
    grades: ['5', '6', '7', '8'],
    gradeTagRo: 'Clasele V–VIII',
    gradeTagEn: 'Grades 5–8',
    relatedModuleId: 'algoritmi',
    relatedMissionId: 'algo1',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre', 'scratch-3-incepatori-coordonate-bucle-variabile-primul-joc'],
    relatedTermIds: ['variable-data-types', 'if-else-switch', 'three-cups-swap'],
    ro: {
      slug: 'algoritm-proprietati',
      term: 'Algoritm și Proprietățile Algoritmilor',
      shortAnswer:
        'Un algoritm este o succesiune finită, clară și ordonată de pași logici care pornește de la date de intrare și produce un rezultat corect (date de ieșire) într-un timp finit, pentru orice set valid de date.',
      explanation: [
        'În informatica de gimnaziu, orice algoritm respectă 3 proprietăți esențiale: claritate (fiecare pas nu lasă loc de interpretări), generalitate (rezolvă întreaga clasă de probleme, ex. orice două numere a și b, nu doar pe 3 și 5) și finitudine (se oprește după un număr finit de pași).',
        'Algoritmii se pot reprezenta în limbaj natural, schemă logică, pseudocod, blocuri vizuale (Scratch 3.0) sau cod C++.'
      ],
      syntaxOrFormula: {
        title: 'Cele 3 structuri fundamentale (Teorema Böhm–Jacopini)',
        code: '1. Structura LINIARĂ (secvențială): pașii se execută unul după altul\n2. Structura ALTERNATIVĂ (decizie):   if (...) ... else ...\n3. Structura REPETITIVĂ (buclă):     while (...), for (...), do ... while (...)'
      },
      example:
        'Rețeta de calcul a mediei a trei note: citești a, b, c -> calculezi S = a + b + c -> afișezi S / 3.0.',
      commonMistake:
        'Scrierea unui algoritm care funcționează doar pe exemplul din enunț (fără generalitate) sau crearea unei bucle infinite care încalcă proprietatea de finitudine.',
      vsComparison: {
        title: 'Algoritm vs. Program (Cod Sursă)',
        summary:
          'Algoritmul este ideea logică independentă de limbaj; programul este scrierea concretă a acelui algoritm într-un limbaj (C++, Scratch, Python) pentru a fi executat de calculator.'
      },
      faqs: [
        {
          question: 'Care sunt cele 3 proprietăți de bază ale unui algoritm?',
          answer: 'Claritatea (lipsa ambiguității), generalitatea (rezolvă orice date valide de intrare) și finitudinea (se termină într-un număr finit de pași).'
        }
      ],
      keywords: 'ce este un algoritm, proprietatile algoritmilor claritate generalitate finitudine'
    },
    en: {
      slug: 'algorithm-definition',
      term: 'Algorithm & Core Algorithm Properties',
      shortAnswer:
        'An algorithm is a finite, unambiguous, step-by-step set of instructions that transforms input data into the desired output within a finite number of steps.',
      explanation: [
        'School computer science teaches three key properties: Precision (no ambiguous steps), Generality (works for any valid inputs, not just one hardcoded example), and Finiteness (always terminates).',
        'Every algorithm can be built using just three control structures: sequence, selection (if/else), and iteration (loops).'
      ],
      syntaxOrFormula: {
        title: 'Three Fundamental Control Structures',
        code: '1. Sequence (Linear):   Step 1 -> Step 2 -> Step 3\n2. Selection (Branch):  if (condition) { ... } else { ... }\n3. Iteration (Loop):    while (...) { ... }  /  for (...) { ... }'
      },
      example:
        'Calculating an average: read 3 test scores -> compute sum -> divide sum by 3.0 -> print result.',
      commonMistake:
        'Writing an infinite while loop that forgets to update its counter or condition, violating finiteness.',
      vsComparison: {
        title: 'Algorithm vs. Source Code',
        summary:
          'An algorithm is the abstract logical method; a program implements that algorithm in a concrete language like C++ or Scratch.'
      },
      faqs: [
        {
          question: 'Can all programs be written using only sequence, selection, and loops?',
          answer: 'Yes, according to the structured program theorem, any computable algorithm can be expressed with those three structures.'
        }
      ],
      keywords: 'what is an algorithm, algorithm properties finiteness precision generality'
    }
  },
  {
    id: 'variable-data-types',
    category: 'algorithms-cpp',
    grades: ['6', '7', '8'],
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    relatedModuleId: 'g7_cpp_a',
    relatedMissionId: 'g7_cpp_a',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre', 'scratch-3-incepatori-coordonate-bucle-variabile-primul-joc'],
    relatedTermIds: ['assignment-vs-equality', 'modulo-integer-division', 'cpp-array-vector'],
    ro: {
      slug: 'variabila-tipuri-date-cpp',
      term: 'Variabilă & Tipuri de Date în C++ (int, float, char, bool)',
      shortAnswer:
        'O variabilă este o „cutie” numită din memoria RAM care păstrează o valoare ce se poate modifica pe parcursul programului. În C++, fiecare variabilă trebuie declarată cu tipul ei de date înainte de utilizare.',
      explanation: [
        'Tipul de date îi spune compilatorului câți octeți să rezerve în memorie și ce operații sunt permise pe acea valoare.',
        'În gimnaziu folosim cel mai des int (numere întregi), long long (numere întregi foarte mari, ex. CNP sau factorial), float/double (numere reale cu zecimale), char (un singur caracter) și bool (adevărat/fals).'
      ],
      syntaxOrFormula: {
        title: 'Declararea și inițializarea variabilelor în C++',
        code: 'int varsta = 13;          // Număr întreg (4 octeți)\nlong long cnp = 5110315...; // Întreg mare (8 octeți)\ndouble medie = 9.75;      // Număr real cu zecimale\nchar litera = \'A\';        // Un caracter între apostrofuri\nbool estePar = (n % 2 == 0); // true (1) sau false (0)'
      },
      example:
        'Dacă declari int medie = 19 / 2;, rezultatul va fi 9 (zecimalele se pierd!). Folosește double medie = 19 / 2.0; pentru a obține 9.5.',
      commonMistake:
        'Folosirea unei variabile neinițializate pentru sume sau produse (ex. int s; în loc de int s = 0;): aceasta va conține o valoare aleatorie reziduală din RAM.',
      vsComparison: {
        title: 'int vs. float / double',
        summary:
          'int stochează doar partea întreagă fără virgulă (rapid, exact pentru numere întregi și cifre); double păstrează zecimale cu precizie dublă pentru medii și calcule matematice.'
      },
      faqs: [
        {
          question: 'Ce valoare are o variabilă int neinițializată în C++?',
          answer: 'Dacă este declarată local în main(), conține o valoare imprevizibilă („gunoi” din memorie). Inițializează mereu sumele cu 0 și produsele cu 1!'
        }
      ],
      keywords: 'ce este o variabila c++, tipuri de date int float double char bool clasa 7'
    },
    en: {
      slug: 'variable-data-types',
      term: 'Variable & C++ Data Types (int, double, char, bool)',
      shortAnswer:
        'A variable is a named container in RAM that holds a value which can change while a program runs. In C++, every variable must be declared with a specific data type before use.',
      explanation: [
        'The data type defines how much memory is allocated and what values are valid.',
        'In middle-school C++, the essential types are int (integers), long long (large integers), double (decimals), char (single character), and bool (true/false).'
      ],
      syntaxOrFormula: {
        title: 'Declaring & Initializing Variables in C++',
        code: 'int age = 13;               // Integer\nlong long id = 51103150001; // Large integer\ndouble avg = 9.75;          // Decimal number\nchar grade = \'A\';           // Single character\nbool isEven = (n % 2 == 0); // true or false'
      },
      example:
        'Writing int sum = 0; ensures your accumulator starts cleanly at zero instead of holding random leftover memory.',
      commonMistake:
        'Storing division results like 7 / 2 in an int variable (gives 3 instead of 3.5), or forgetting to initialize counters and sums.',
      vsComparison: {
        title: 'int vs. double',
        summary:
          'int keeps exact whole numbers and drops any fractional part; double preserves decimals accurately for averages and geometry.'
      },
      faqs: [
        {
          question: 'Why should sums start at 0 and products at 1?',
          answer: '0 is the additive identity (0 + x = x) and 1 is the multiplicative identity (1 * x = x), preventing garbage memory from ruining totals.'
        }
      ],
      keywords: 'what is a variable c++, cpp data types int double char bool'
    }
  },
  {
    id: 'modulo-integer-division',
    category: 'algorithms-cpp',
    grades: ['7', '8'],
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    relatedModuleId: 'g7_loop_b',
    relatedMissionId: 'g7_loop_b',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre'],
    relatedTermIds: ['while-vs-dowhile', 'variable-data-types', 'algorithm-definition'],
    ro: {
      slug: 'operatorul-modulo-si-impartirea-intreaga',
      term: 'Operatorul Modulo (%) și Împărțirea Întreagă (/) în C++',
      shortAnswer:
        'În C++, când împarți două numere întregi, operatorul / calculează câtul întreg (fără zecimale), iar operatorul modulo % calculează restul împărțirii. Împreună cu baza 10 (% 10 și / 10), stau la baza tuturor algoritmilor pe cifre.',
      explanation: [
        'Orice număr natural n își dezvăluie ultima cifră prin n % 10, iar prin n / 10 (sau n /= 10) îi eliminăm ultima cifră pentru a trece la următoarea.',
        'Tot operatorul % verifică paritatea (n % 2 == 0) și divizibilitatea (a % b == 0, adică b îl divide pe a).'
      ],
      syntaxOrFormula: {
        title: 'Formule cheie pe cifre și divizibilitate',
        code: '123 % 10 == 3   // Ultima cifră a lui 123\n123 / 10 == 12  // Numărul fără ultima cifră\nn % 2 == 0      // Număr par\nn % d == 0      // d este divizor al lui n\n7 / 2 == 3,  7.0 / 2 == 3.5'
      },
      example:
        'Pentru a calcula suma cifrelor lui n = 459: extragem 9 (459 % 10), tăiem 9 (459 / 10 = 45), extragem 5, tăiem 5, extragem 4. Suma = 9 + 5 + 4 = 18.',
      commonMistake:
        'Aplicarea lui % pe numere reale (float/double) — în C++, operatorul % funcționează DOAR pe tipuri întregi (int, long long) și împărțirea la 0 (% 0 sau / 0) oprește programul!',
      vsComparison: {
        title: 'n % 10 vs. n / 10',
        summary:
          'n % 10 citește ultima cifră fără să modifice n; n = n / 10 modifică n tăind ultima cifră până când n ajunge la 0.'
      },
      faqs: [
        {
          question: 'Cum verific în C++ dacă un număr n este par sau impar?',
          answer: 'Folosești condiția if (n % 2 == 0) pentru număr par, respectiv else pentru impar.'
        }
      ],
      keywords: 'operator modulo cpp, n modulo 10 si n impartit la 10, algoritmi pe cifre clasa 7'
    },
    en: {
      slug: 'modulo-integer-division',
      term: 'Modulo (%) & Integer Division (/) in C++',
      shortAnswer:
        'When both operands are integers in C++, / computes the integer quotient (discarding decimals), while modulo % returns the remainder. Together with base 10 (% 10 and / 10), they power digit-extraction and divisibility algorithms.',
      explanation: [
        'n % 10 isolates the last digit of n, and n /= 10 strips that last digit away.',
        'Modulo also tests evenness (n % 2 == 0) and divisibility (a % b == 0).'
      ],
      syntaxOrFormula: {
        title: 'Essential Digit & Divisibility Expressions',
        code: '459 % 10  // 9  (last digit)\n459 / 10  // 45 (remaining digits)\nn % 2 == 0 // true if n is even\na % b == 0 // true if a is divisible by b'
      },
      example:
        'Looping while (n > 0) with sum += n % 10; n /= 10; sums all digits of any positive integer.',
      commonMistake:
        'Trying to use % with double/float variables (invalid in C++) or dividing/modulo by 0.',
      vsComparison: {
        title: '7 / 2 vs. 7.0 / 2',
        summary:
          '7 / 2 performs integer division and equals 3; making at least one operand decimal (7.0 / 2) performs floating-point division and equals 3.5.'
      },
      faqs: [
        {
          question: 'Does n % 10 modify the variable n?',
          answer: 'No, % only calculates the remainder; to shorten n you must assign n = n / 10;'
        }
      ],
      keywords: 'c++ modulo operator %, integer division vs float, extract digits n % 10'
    }
  },
  {
    id: 'assignment-vs-equality',
    category: 'algorithms-cpp',
    grades: ['7', '8'],
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    relatedModuleId: 'g7_decision_a',
    relatedMissionId: 'g7_decision_a',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre'],
    relatedTermIds: ['if-else-switch', 'variable-data-types', 'algorithm-definition'],
    ro: {
      slug: 'atribuire-vs-egalitate-cpp',
      term: 'Atribuire (=) vs. Comparare Egalitate (==) în C++',
      shortAnswer:
        'Un singur egal (=) este operatorul de atribuire care pune o valoare într-o variabilă (x = 5). Egalul dublu (==) este operatorul relațional care verifică dacă două valori sunt egale (x == 5), returnând adevărat sau fals.',
      explanation: [
        'Aceasta este greșeala numărul 1 a elevilor care trec de la matematică sau Scratch la C++ în clasa a VII-a.',
        'Dacă scrii din greșeală if (x = 0) în loc de if (x == 0), programul modifică valoarea lui x la 0 și evaluarea condiției va fi mereu falsă, fără ca compilatorul să dea întotdeauna eroare!'
      ],
      syntaxOrFormula: {
        title: 'Cei 6 operatori relaționali + atribuirea',
        code: 'x = 10;       // ATRIBUIRE: x primește valoarea 10\nif (x == 10)  // EGALITATE: verifică dacă x este egal cu 10\nif (x != 10)  // DIFERIT DE (!=)\n<, <=, >, >=  // Mai mic, mai mic sau egal, mai mare, mai mare sau egal'
      },
      example:
        'Corect: if (nota == 10) cout << "Felicitări!"; — Greșit: if (nota = 10) (suprascrie nota cu 10!).',
      commonMistake:
        'Scrierea condițiilor compuse matematice de forma 1 <= x <= 10 în C++. Corect se scrie cu operatorul logic ȘI: (x >= 1 && x <= 10).',
      vsComparison: {
        title: 'x = 5 vs. x == 5',
        summary:
          'x = 5 este o comandă de modificare a memoriei („fă-l pe x egal cu 5”); x == 5 este o întrebare logică („este oare x egal cu 5?”).'
      },
      faqs: [
        {
          question: 'Cum se scrie „diferit de” în C++?',
          answer: 'Cu operatorul != (semnul exclamării urmat de egal), de exemplu if (a != 0).'
        }
      ],
      keywords: 'diferenta = vs == in c++, operatori relationali si logici cpp clasa 7'
    },
    en: {
      slug: 'assignment-vs-equality',
      term: 'Assignment (=) vs. Equality Check (==) in C++',
      shortAnswer:
        'A single equals sign (=) is the assignment operator that stores a value into a variable (x = 5). Double equals (==) is the comparison operator that tests whether two values are equal (x == 5).',
      explanation: [
        'Mistaking = for == inside an if condition is the single most common bug in middle-school C++.',
        'Writing if (x = 0) overwrites x with 0 instead of checking whether x equals 0.'
      ],
      syntaxOrFormula: {
        title: 'Assignment vs. Relational Operators',
        code: 'x = 10;       // ASSIGNMENT: stores 10 into x\nif (x == 10)  // EQUALITY: tests if x equals 10\nif (x != 10)  // NOT EQUAL\n&& (AND), || (OR), ! (NOT)'
      },
      example:
        'Always write if (x >= 1 && x <= 10) in C++ rather than mathematical chaining 1 <= x <= 10.',
      commonMistake:
        'Chaining inequalities like 5 < x < 10 in C++ — (5 < x) evaluates to true (1) or false (0), which is always < 10!',
      vsComparison: {
        title: '= (Command) vs. == (Question)',
        summary:
          '= changes the variable’s stored value; == asks a true/false question without altering the variable.'
      },
      faqs: [
        {
          question: 'Why does 1 <= x <= 10 fail in C++ when x = 50?',
          answer: 'Because 1 <= 50 evaluates to true (1), and then 1 <= 10 is also true, giving a wrong answer!'
        }
      ],
      keywords: 'assignment vs equality c++, difference between = and == cpp'
    }
  },
  {
    id: 'if-else-switch',
    category: 'algorithms-cpp',
    grades: ['6', '7', '8'],
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    relatedModuleId: 'g7_decision_a',
    relatedMissionId: 'g7_decision_a',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre'],
    relatedTermIds: ['assignment-vs-equality', 'while-vs-dowhile', 'excel-if-countif'],
    ro: {
      slug: 'structura-alternativa-if-else-switch',
      term: 'Structura Alternativă (if / else și switch) în C++',
      shortAnswer:
        'Structura alternativă permite programului să ia decizii și să execute ramuri diferite de cod în funcție de o condiție logică (if / else) sau de valoarea exactă a unei variabile întregi/caracter (switch).',
      explanation: [
        'Când o condiție este adevărată, se execută blocul if; opțional, blocul else se execută atunci când condiția este falsă.',
        'Instrucțiunea switch (clasa a VIII-a) este ideală pentru meniuri sau zilele săptămânii (cazuri fixe 1..7), având grijă să punem break; la finalul fiecărui case.'
      ],
      syntaxOrFormula: {
        title: 'Sintaxă corectă if / else și switch',
        code: 'if (nota >= 5) {\n  cout << "Promovat";\n} else {\n  cout << "Corigent";\n}\n\nswitch (optiune) {\n  case 1: cout << "Start"; break;\n  default: cout << "Invalid";\n}'
      },
      example:
        'Calculul maximului a 3 numere sau validarea unei opțiuni dintr-un meniu interactiv folosesc instrucțiunea if / else.',
      commonMistake:
        'Punerea punctului și virgulei imediat după paranteză: if (x > 0); — acel ; încheie if-ul cu o instrucțiune vidă, iar blocul următor se va executa mereu!',
      vsComparison: {
        title: 'if / else vs. switch',
        summary:
          'if / else suportă intervale și condiții complexe (x > 10 && x < 20); switch compară rapid egalitatea cu valori constante discrete (1, 2, \'a\').'
      },
      faqs: [
        {
          question: 'Ce se întâmplă dacă uit break; într-un switch?',
          answer: 'Apare efectul de "fall-through": programul continuă să execute și instrucțiunile din cazurile următoare până întâlnește un break sau finalul switch-ului.'
        }
      ],
      keywords: 'if else c++, structura alternativa clasa 7, switch case break c++ clasa 8'
    },
    en: {
      slug: 'if-else-switch',
      term: 'Conditional Branching (if / else & switch) in C++',
      shortAnswer:
        'Conditional branching lets a program choose between different execution paths depending on whether a logical condition is true or false (if / else), or by matching discrete constant values (switch).',
      explanation: [
        'Wrap multi-line branches inside curly braces { } so every intended statement belongs to the branch.',
        'The switch statement cleanly replaces long else-if chains for menus or exact integer/char matches—remembering to end each case with break;.'
      ],
      syntaxOrFormula: {
        title: 'if / else & switch Syntax',
        code: 'if (score >= 5) {\n  cout << "Passed";\n} else {\n  cout << "Try again";\n}\n\nswitch (choice) {\n  case 1: cout << "Play"; break;\n  default: cout << "Invalid";\n}'
      },
      example:
        'Determining whether an input year is a leap year uses nested if/else with && and ||.',
      commonMistake:
        'Adding a stray semicolon after if (condition); — that terminates the if statement with an empty body!',
      vsComparison: {
        title: 'if/else vs. switch',
        summary:
          'Use if/else for ranges and boolean expressions; use switch for fixed discrete integer or char choices.'
      },
      faqs: [
        {
          question: 'What happens if you omit break inside a switch case?',
          answer: 'Execution falls straight through into the next case below it until a break or closing brace is reached.'
        }
      ],
      keywords: 'cpp if else tutorial, switch break statement c++, stray semicolon after if'
    }
  },
  {
    id: 'while-vs-dowhile',
    category: 'algorithms-cpp',
    grades: ['7', '8'],
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    relatedModuleId: 'g7_loop_b',
    relatedMissionId: 'g7_loop_b',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre'],
    relatedTermIds: ['for-loop-counter', 'modulo-integer-division', 'algorithm-definition'],
    ro: {
      slug: 'bucla-while-vs-do-while-cpp',
      term: 'Bucla while vs. do-while în C++',
      shortAnswer:
        'Atât while, cât și do-while repetă un bloc de instrucțiuni cât timp o condiție rămâne adevărată. Diferența majoră este că while verifică condiția la început (se poate executa de 0 ori), iar do-while o verifică la final (se execută cel puțin 1 dată).',
      explanation: [
        'Folosim while când nu știm dinainte numărul de pași (ex. prelucrarea cifrelor unui număr n > 0 sau citirea până la întâlnirea lui 0).',
        'Folosim do-while când trebuie să executăm corpul măcar o dată — de exemplu la citirea cifrelor lui n = 0 (care are 1 cifră!) sau la validarea unui meniu/PIN.'
      ],
      syntaxOrFormula: {
        title: 'while (test inițial) vs. do-while (test final)',
        code: '// Se execută doar dacă n > 0\nwhile (n > 0) {\n  cifre++;\n  n /= 10;\n}\n\n// Funcționează corect și pentru n == 0!\ndo {\n  cifre++;\n  n /= 10;\n} while (n > 0);'
      },
      example:
        'Dacă n = 0, un while (n > 0) nu intră niciodată în buclă și raportează 0 cifre, pe când do-while numără corect 1 cifră.',
      commonMistake:
        'Uitarea actualizării variabilei din condiție (ex. uitarea lui n /= 10;) duce la buclă infinită (Time Limit Exceeded). De asemenea, la do-while trebuie neapărat ; după while(...);.',
      vsComparison: {
        title: 'Test inițial (while) vs. Test final (do-while)',
        summary:
          'while: verifică mai întâi, apoi execută (0 sau mai multe execuții). do-while: execută mai întâi, apoi verifică (1 sau mai multe execuții).'
      },
      faqs: [
        {
          question: 'Când este obligatoriu do-while în locul lui while?',
          answer: 'Când algoritmul trebuie să execute acțiunea măcar o dată (ex: numărarea cifrelor pentru cazul n = 0 sau reintroducerea unei parole greșite).'
        }
      ],
      keywords: 'diferenta while si do while c++, bucla repetitiva c++ clasa 7'
    },
    en: {
      slug: 'while-vs-dowhile',
      term: 'while vs. do-while Loops in C++',
      shortAnswer:
        'Both while and do-while repeat code as long as a condition holds true. A while loop checks the condition first (may run 0 times), whereas a do-while loop checks at the end (always runs at least once).',
      explanation: [
        'Use while when the number of iterations is unknown beforehand and zero iterations might be valid.',
        'Use do-while for input validation menus or edge cases like counting digits when n = 0.'
      ],
      syntaxOrFormula: {
        title: 'Pre-test vs. Post-test Loop',
        code: 'while (n > 0) {\n  digits++;\n  n /= 10;\n}\n\ndo {\n  digits++;\n  n /= 10;\n} while (n > 0); // Semicolon required!'
      },
      example:
        'Counting digits of n = 0 returns 0 with a plain while loop, but returns the accurate answer 1 with do-while.',
      commonMistake:
        'Forgetting to update the loop variable (causing an infinite loop) or omitting the semicolon at the end of do { ... } while (cond);.',
      vsComparison: {
        title: '0+ Runs vs. 1+ Runs',
        summary:
          'while evaluates before running the body; do-while runs the body once before evaluating the condition.'
      },
      faqs: [
        {
          question: 'Why does do-while need a semicolon at the end while while does not?',
          answer: 'Because the condition sits at the end of the statement block rather than opening a braced body.'
        }
      ],
      keywords: 'while vs do while loop cpp, c++ post test loop'
    }
  },
  {
    id: 'for-loop-counter',
    category: 'algorithms-cpp',
    grades: ['7', '8'],
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    relatedModuleId: 'g7_stem_a',
    relatedMissionId: 'g7_stem_a',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre'],
    relatedTermIds: ['while-vs-dowhile', 'cpp-array-vector', 'arduino-millis'],
    ro: {
      slug: 'bucla-for-cu-contor-cpp',
      term: 'Bucla for (Structura Repetitivă cu Contor)',
      shortAnswer:
        'Bucla for este structura repetitivă folosită atunci când cunoaștem exact numărul de pași sau intervalul de parcurgere (ex. de la 1 la n). Ea reunește inițializarea, condiția de oprire și pasul într-o singură linie.',
      explanation: [
        'Este structura standard pentru parcurgerea numerelor de la 1 la n, calculul sumelor și produselor, căutarea divizorilor și parcurgerea vectorilor din clasa a VIII-a.',
        'Ordinea de execuție este: 1. Inițializare (o singură dată), 2. Verificare condiție, 3. Corpul buclei, 4. Pas (incrementare i++), apoi reluare de la 2.'
      ],
      syntaxOrFormula: {
        title: 'Structura standard for în C++',
        code: 'int suma = 0;\nfor (int i = 1; i <= n; i++) {\n  suma += i;\n}\n// Atenție: între cele 3 părți se pune ; (punct și virgulă), NU virgulă!'
      },
      example:
        'Afișarea tuturor numerelor pare de la 2 la 20: for (int i = 2; i <= 20; i += 2) cout << i << " ";',
      commonMistake:
        'Folosirea virgulei în loc de ; în antetul lui for: for (i=1, i<=n, i++) generează eroare de compilare, sau oprirea cu < n în loc de <= n când trebuie inclus și n.',
      vsComparison: {
        title: 'for vs. while',
        summary:
          'Folosește for când știi câte repetiții faci (1..n, elemente vector); folosește while când repetiția depinde de o condiție dinamică (cât timp n > 0).'
      },
      faqs: [
        {
          question: 'Ce face i++ în bucla for?',
          answer: 'Crește valoarea contorului i cu 1 la finalul fiecărei iterații (echivalent cu i = i + 1).'
        }
      ],
      keywords: 'bucla for cpp, structura repetitiva cu contor, for i=1 i<=n i++'
    },
    en: {
      slug: 'for-loop-counter',
      term: 'for Loop (Counter-Controlled Iteration)',
      shortAnswer:
        'A for loop executes a block of code a known number of times by packing the counter initialization, loop condition, and increment step into one compact header.',
      explanation: [
        'It is the go-to loop for iterating from 1 to n, finding divisors, generating sequences, and scanning arrays.',
        'Its three header parts are always separated by semicolons (;).'
      ],
      syntaxOrFormula: {
        title: 'Standard C++ for Loop',
        code: 'int sum = 0;\nfor (int i = 1; i <= n; i++) {\n  sum += i;\n}'
      },
      example:
        'Looping backwards: for (int i = 10; i >= 1; i--) cout << i << " ";',
      commonMistake:
        'Using commas instead of semicolons in the header, or writing i < n instead of i <= n when n should be included (off-by-one error).',
      vsComparison: {
        title: 'for vs. while',
        summary:
          'Choose for when the number of iterations or index range is known; choose while when stopping depends on dynamic input or digit reduction.'
      },
      faqs: [
        {
          question: 'What is an off-by-one error in a for loop?',
          answer: 'Stopping one iteration too early or too late, such as writing i < n instead of i <= n when counting from 1 through n.'
        }
      ],
      keywords: 'cpp for loop explained, off by one error loop, counter loop'
    }
  },
  {
    id: 'cpp-array-vector',
    category: 'algorithms-cpp',
    grades: ['8'],
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    relatedModuleId: 'g8_algo_d',
    relatedMissionId: 'g8_algo_d',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre'],
    relatedTermIds: ['for-loop-counter', 'variable-data-types', 'algorithm-definition'],
    ro: {
      slug: 'vector-tablou-unidimensional-cpp',
      term: 'Vector (Tablou Unidimensional) în C++',
      shortAnswer:
        'Un vector (tablou unidimensional) este o colecție ordonată de elemente de același tip de date, stocate consecutiv în memoria RAM sub un singur nume și accesate prin indicele (poziția) lor, începând de obicei de la 0 sau 1.',
      explanation: [
        'În loc să declari 100 de variabile separate (n1, n2, ..., n100) pentru notele unei școli, declari un singur vector int v[105]; și îl parcurgi elegant cu o buclă for.',
        'În C++, indexarea nativă începe de la 0 (primul element este v[0], ultimul la n elemente este v[n - 1]), dar la problemele școlare se folosește adesea indexarea de la 1 la n pe un vector declarat puțin mai mare (v[101]).'
      ],
      syntaxOrFormula: {
        title: 'Citire și calcul minim într-un vector',
        code: 'int n, v[101];\ncin >> n;\nfor (int i = 1; i <= n; i++) cin >> v[i];\n\nint minim = v[1];\nfor (int i = 2; i <= n; i++) {\n  if (v[i] < minim) minim = v[i];\n}'
      },
      example:
        'Calcularea mediei notelor unei clase și afișarea elevilor cu nota peste medie necesită păstrarea notelor într-un vector pentru două parcurgeri.',
      commonMistake:
        'Accesarea în afara limitelor vectorului (ex. v[100] într-un vector int v[100]; indexat de la 0 la 99) sau inițializarea minimului cu 0 când toate valorile sunt pozitive!',
      vsComparison: {
        title: 'Variabilă simplă vs. Vector',
        summary:
          'O variabilă simplă reține o singură valoare la un moment dat; un vector păstrează zeci sau mii de valori simultan în memorie pentru sortări, filtrări și comparații.'
      },
      faqs: [
        {
          question: 'De la ce indice pornește un vector nativ în C++?',
          answer: 'Un vector declarat int a[10] are indicii nativi de la 0 la 9.'
        }
      ],
      keywords: 'ce este un vector c++, tablou unidimensional clasa 8, parcurgere vector minim maxim'
    },
    en: {
      slug: 'cpp-array-vector',
      term: 'Array (1D Vector) in C++',
      shortAnswer:
        'A 1D array is an indexed collection of elements sharing the same data type stored contiguously in memory under a single name. In C++, native array indices start at 0.',
      explanation: [
        'Instead of creating 30 separate variables for student grades, an array int grades[30] holds all values and pairs naturally with a for loop.',
        'Always make sure the array index stays strictly between 0 and size - 1 to avoid out-of-bounds memory corruption.'
      ],
      syntaxOrFormula: {
        title: 'Reading & Finding Maximum in a C++ Array',
        code: 'int n, a[100];\ncin >> n;\nfor (int i = 0; i < n; i++) cin >> a[i];\n\nint maxVal = a[0];\nfor (int i = 1; i < n; i++) {\n  if (a[i] > maxVal) maxVal = a[i];\n}'
      },
      example:
        'Storing daily temperatures in an array lets you compute the weekly average first and then count how many days exceeded that average.',
      commonMistake:
        'Initializing minVal = 0 before scanning positive array values (0 stays smaller than every positive score!). Always initialize with a[0].',
      vsComparison: {
        title: '0-based vs. 1-based Indexing',
        summary:
          'C++ arrays natively begin at index 0; if you prefer 1..n indexing in contests, declare one extra slot like a[101].'
      },
      faqs: [
        {
          question: 'What is an array index out-of-bounds bug?',
          answer: 'Reading or writing a[n] when valid indices only go from 0 to n - 1.'
        }
      ],
      keywords: 'c++ array tutorial grade 8, find min max array cpp, zero based indexing'
    }
  },
  {
    id: 'scratch-coordinates-xy',
    category: 'algorithms-cpp',
    grades: ['5', '6'],
    gradeTagRo: 'Clasele V–VI',
    gradeTagEn: 'Grades 5–6',
    relatedModuleId: 'scratch',
    relatedMissionId: 'scratch1',
    relatedBlogIds: ['scratch-3-incepatori-coordonate-bucle-variabile-primul-joc'],
    relatedTermIds: ['algorithm-definition', 'variable-data-types', 'for-loop-counter'],
    ro: {
      slug: 'coordonate-xy-sprite-scratch',
      term: 'Coordonate X/Y (-240..240) și Personaje (Sprite) în Scratch 3.0',
      shortAnswer:
        'Scena din Scratch 3.0 este un plan cartezian cu dimensiunea de 480×360 pixeli și centrul exact la (X: 0, Y: 0). Axa X controlează deplasarea stânga-dreapta (de la -240 la +240), iar axa Y controlează sus-jos (de la -180 la +180).',
      explanation: [
        'Fiecare personaj (Sprite) își știe poziția exactă prin coordonatele (x, y) și orientarea (Direction: 90° spre dreapta, 0° în sus, -90° stânga, 180° jos).',
        'Blocurile „modifică x cu 10” sau „modifică y cu -10” mișcă personajul mult mai previzibil într-un joc decât „mergi 10 pași” atunci când folosești săgețile de pe tastatură.'
      ],
      syntaxOrFormula: {
        title: 'Limitele Scenei Scratch 3.0',
        code: 'Centru scenă: (X = 0, Y = 0)\nStânga maxim: X = -240  |  Dreapta maxim: X = +240  (lățime 480 px)\nJos maxim:    Y = -180  |  Sus maxim:     Y = +180  (înălțime 360 px)'
      },
      example:
        'Ca să resetezi jucătorul mereu la începutul jocului, pune blocul „mergi la x: 0 y: -130” imediat sub „Când se dă click pe steguleț”.',
      commonMistake:
        'A uita să resetezi scorul (setează Scor la 0) și poziția personajului la începutul jocului, sau a folosi blocul greșit „setează x la 10” în loc de „modifică x cu 10”.',
      vsComparison: {
        title: '„Setează x la” vs. „Modifică x cu”',
        summary:
          '„Setează x la 10” teleportează personajul fix la coordonata 10; „Modifică x cu 10” adaugă 10 la poziția actuală pentru mișcare lină.'
      },
      faqs: [
        {
          question: 'Ce dimensiune în pixeli are scena Scratch 3.0?',
          answer: '480 pixeli lățime (X de la -240 la +240) și 360 pixeli înălțime (Y de la -180 la +180).'
        }
      ],
      keywords: 'coordonate x y scratch 3.0, dimensiune scena scratch 480 360, sprite scratch clasa 5'
    },
    en: {
      slug: 'scratch-coordinates-xy',
      term: 'Scratch 3.0 Stage Coordinates (X/Y) & Sprites',
      shortAnswer:
        'The Scratch 3.0 stage is a 480×360 pixel Cartesian grid centered at (X: 0, Y: 0). The X-axis moves sprites left and right (-240 to +240), while the Y-axis moves sprites down and up (-180 to +180).',
      explanation: [
        'Every Sprite has an X position, Y position, and Direction (90° right, 0° up, -90° left, 180° down).',
        'For keyboard controls, changing X or Y directly prevents sprites from flipping upside down or drifting at awkward angles.'
      ],
      syntaxOrFormula: {
        title: 'Scratch Stage Boundaries',
        code: 'Center:     (X = 0, Y = 0)\nHorizontal: X = -240 (left)  to  +240 (right)\nVertical:   Y = -180 (bottom) to +180 (top)'
      },
      example:
        'Under "When green flag clicked", always initialize Score = 0 and "go to x: 0 y: -130" so every replay starts cleanly.',
      commonMistake:
        'Using "set x to 10" (teleports once) instead of "change x by 10" (moves smoothly step by step) inside arrow-key loops.',
      vsComparison: {
        title: 'Set X vs. Change X',
        summary:
          '"Set x" jumps to a fixed spot; "Change x" shifts relative to where the sprite currently stands.'
      },
      faqs: [
        {
          question: 'What are the width and height of the Scratch stage?',
          answer: '480 pixels wide by 360 pixels tall.'
        }
      ],
      keywords: 'scratch 3 stage coordinates xy, set x vs change x scratch'
    }
  },
  {
    id: 'three-cups-swap',
    category: 'algorithms-cpp',
    grades: ['5', '7', '8'],
    gradeTagRo: 'Clasele V–VII',
    gradeTagEn: 'Grades 5–7',
    relatedModuleId: 'g7_cpp_b',
    relatedMissionId: 'g7_cpp_b',
    relatedBlogIds: ['erori-cpp-gimnaziu-if-while-algoritmi-cifre'],
    relatedTermIds: ['variable-data-types', 'algorithm-definition', 'cpp-array-vector'],
    ro: {
      slug: 'regula-celor-3-pahare-interschimbare',
      term: 'Regula celor 3 Pahare (Interschimbarea Valorilor în C++)',
      shortAnswer:
        'Regula celor 3 pahare este algoritmul clasic prin care schimbăm valorile dintre două variabile a și b fără să le pierdem, folosind o a treia variabilă auxiliară (aux): aux = a; a = b; b = aux;.',
      explanation: [
        'Dacă ai un pahar cu apă (a) și unul cu suc (b) și vrei să le schimbi între ele, nu poți turna direct sucul peste apă fără să le amesteci (suprascrii). Ai nevoie de un al treilea pahar gol (aux).',
        'Acest pas de 3 linii stă la baza sortării vectorilor (Bubble Sort / Sortare prin selecție) și a ordonării numerelor.'
      ],
      syntaxOrFormula: {
        title: 'Algoritmul corect în 3 instrucțiuni',
        code: 'int a = 5, b = 9, aux;\naux = a;  // Paharu gol primește 5\na = b;    // a primește 9\nb = aux;  // b primește 5 din aux\n// Rezultat: a = 9, b = 5'
      },
      example:
        'Dacă vrei ca variabila min să fie mereu mai mică decât max: if (a > b) { int aux = a; a = b; b = aux; }.',
      commonMistake:
        'Scrierea directă a = b; b = a; — după prima linie, valoarea veche a lui a este pierdută pentru totdeauna și ambele variabile ajung să aibă aceeași valoare!',
      vsComparison: {
        title: 'Atribuire simplă vs. Interschimbare',
        summary:
          'a = b copiază pe b în a și șterge ce era în a; interschimbarea cu aux păstrează ambele valori schimbându-le locurile.'
      },
      faqs: [
        {
          question: 'De ce este greșit să scrii doar a = b; b = a;?',
          answer: 'Pentru că instrucțiunea a = b suprascrie valoarea inițială a lui a cu valoarea lui b, deci ambele variabile vor deveni egale cu b.'
        }
      ],
      keywords: 'regula celor 3 pahare c++, interschimbare doua variabile aux clasa 7'
    },
    en: {
      slug: 'three-cups-swap',
      term: 'Swap Algorithm (Temporary Variable / 3-Cups Rule)',
      shortAnswer:
        'Swapping the values of two variables a and b without overwriting data requires a third temporary variable (temp): temp = a; a = b; b = temp;.',
      explanation: [
        'Imagine swapping juice in cup A and water in cup B—you need an empty third cup (temp) first so neither liquid spills or mixes.',
        'This 3-line pattern is the building block of all sorting algorithms.'
      ],
      syntaxOrFormula: {
        title: 'Standard 3-Line Swap in C++',
        code: 'int a = 5, b = 9, temp;\ntemp = a; // Save 5\na = b;    // a becomes 9\nb = temp; // b becomes 5'
      },
      example:
        'To ensure a <= b before a loop: if (a > b) { int temp = a; a = b; b = temp; }',
      commonMistake:
        'Writing a = b; b = a; directly—both variables end up holding b’s original value.',
      vsComparison: {
        title: 'Direct Copy vs. Swap',
        summary:
          'a = b overwrites a permanently; using temp preserves both values across the exchange.'
      },
      faqs: [
        {
          question: 'Why do you need a temporary variable to swap values?',
          answer: 'Because assigning a = b destroys a’s old value unless it was backed up in temp beforehand.'
        }
      ],
      keywords: 'swap two variables cpp, three cups rule temporary variable swap'
    }
  }
];
