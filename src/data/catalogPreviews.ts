// Lightweight homepage catalog summaries & counts (auto-synced during SEO build).
// Keeps ~850 KB of full blog articles, glossary entries, and worksheet items out of the initial JS bundle.

export interface CatalogBlogPreview {
  id: string;
  gradeTagRo: string;
  gradeTagEn: string;
  ro: {
    slug: string;
    categoryLabel: string;
    breadcrumbLabel: string;
    metaDescription: string;
  };
  en: {
    slug: string;
    categoryLabel: string;
    breadcrumbLabel: string;
    metaDescription: string;
  };
}

export interface CatalogGlossaryPreview {
  id: string;
  gradeTagRo: string;
  gradeTagEn: string;
  ro: {
    slug: string;
    term: string;
    shortAnswer: string;
  };
  en: {
    slug: string;
    term: string;
    shortAnswer: string;
  };
}

export interface CatalogWorksheetPreview {
  id: string;
  maxPoints: number;
  gradeRo: string;
  gradeEn: string;
  kindRo: string;
  kindEn: string;
  ro: {
    slug: string;
    breadcrumbLabel: string;
    directAnswerSummary: string;
  };
  en: {
    slug: string;
    breadcrumbLabel: string;
    directAnswerSummary: string;
  };
}

export const CATALOG_COUNTS = {
  blog: 24,
  glossary: 44,
  worksheets: 16,
};

export const SANDBOX_LANG_BY_ID: Record<string, 'cpp' | 'python' | 'html'> = {
  'cpp-swap-3-pahare': 'cpp',
  'cpp-suma-cifrelor': 'cpp',
  'cpp-numar-prim': 'cpp',
  'cpp-vector-pare': 'cpp',
  'py-par-impar': 'python',
  'py-gauss-sum': 'python',
  'py-lista-note': 'python',
  'html-card-profil': 'html',
  'html-orar-tabel': 'html',
};

export const FEATURED_BLOG_PREVIEWS: CatalogBlogPreview[] = [
  {
    id: 'competente-digitale-agenti-ai-rag-cariere-viitor-elevi-2026',
    gradeTagRo: 'Clasele VII–VIII · Viitor',
    gradeTagEn: 'Grades 7–8 · Future',
    ro: {
      slug: 'competente-digitale-agenti-ai-rag-cariere-viitor-elevi-2026',
      categoryLabel: 'Inteligență Artificială',
      breadcrumbLabel: 'Agenți AI, RAG & Cariere 2026–2030',
      metaDescription: 'Ghid strategic pentru elevi, părinți și profesori: diferența Chatbot vs RAG vs Agent AI, cadrul european DigComp, ce abilități NU poate automatiza AI-ul și portofoliul de gimnaziu.',
    },
    en: {
      slug: 'digital-skills-ai-agents-rag-future-tech-careers-students-2026',
      categoryLabel: 'AI & Literacy',
      breadcrumbLabel: 'AI Agents, RAG & Future Careers',
      metaDescription: 'Strategic roadmap for students, parents, and teachers: Chatbot vs RAG vs AI Agents, DigComp framework, human skills AI cannot replace, and a Grade 8 digital portfolio.',
    },
  },
  {
    id: 'passkeys-fido2-manager-parole-scam-discord-steam-backup-321',
    gradeTagRo: 'Clasele VI–VIII · Părinți',
    gradeTagEn: 'Grades 6–8 · Parents',
    ro: {
      slug: 'passkeys-fido2-manager-parole-scam-discord-steam-backup-321',
      categoryLabel: 'Securitate Online',
      breadcrumbLabel: 'Passkeys, Scam Discord/Steam & 3-2-1',
      metaDescription: 'Cum îți securizezi conturile în 2026: cum funcționează Passkeys anti-phishing, manageri de parole (Bitwarden), anatomia capcanelor Discord/Steam QR și regula de backup 3-2-1.',
    },
    en: {
      slug: 'passkeys-fido2-password-managers-discord-steam-scams-backup-321',
      categoryLabel: 'Cyber Safety',
      breadcrumbLabel: 'Passkeys, Scams & 3-2-1 Backups',
      metaDescription: 'How to lock down student and family accounts in 2026: phishing-proof Passkeys (FIDO2), free password managers, Discord/Steam QR scams, and the 3-2-1 backup rule.',
    },
  },
  {
    id: 'robotica-iot-arduino-uno-vs-esp32-microbit-pwm-i2c-proiecte',
    gradeTagRo: 'Clasele VII–VIII · IoT',
    gradeTagEn: 'Grades 7–8 · IoT',
    ro: {
      slug: 'robotica-iot-arduino-uno-vs-esp32-microbit-pwm-i2c-proiecte',
      categoryLabel: 'Robotică & IoT',
      breadcrumbLabel: 'Robotică IoT: Arduino vs ESP32 & PWM',
      metaDescription: 'Ghid complet de robotică școlară și IoT: comparație Arduino Uno R3/R4 vs ESP32 vs BBC Micro:bit, tensiuni 5V vs 3.3V, control PWM și protocol I2C cu cod C++ non-blocant.',
    },
    en: {
      slug: 'robotics-iot-arduino-uno-vs-esp32-microbit-pwm-i2c-projects',
      categoryLabel: 'Robotics & IoT',
      breadcrumbLabel: 'IoT Robotics: Arduino vs ESP32 & PWM',
      metaDescription: 'Complete student robotics guide: Arduino Uno vs ESP32 vs BBC Micro:bit comparison, 5V vs 3.3V safety, PWM duty cycle, I2C wiring, and 7 breadboard mistakes to avoid.',
    },
  },
  {
    id: 'excel-avansat-vlookup-xlookup-sumifs-pivot-grafice-proiecte',
    gradeTagRo: 'Clasa a VIII-a · Proiecte',
    gradeTagEn: 'Grade 8 · Projects',
    ro: {
      slug: 'excel-avansat-vlookup-xlookup-sumifs-pivot-grafice-proiecte',
      categoryLabel: 'Excel & Birotică',
      breadcrumbLabel: 'Excel Avansat: XLOOKUP, SUMIFS & Pivot',
      metaDescription: 'Ghid practic de calcul tabelar avansat: diferența VLOOKUP vs XLOOKUP, sume multicriteriu SUMIFS/COUNTIFS, Tabele Pivot în 4 pași, alegerea graficului corect și formatare condiționată.',
    },
    en: {
      slug: 'advanced-excel-vlookup-xlookup-sumifs-pivot-tables-charts-guide',
      categoryLabel: 'Excel & Office',
      breadcrumbLabel: 'Advanced Excel: XLOOKUP, SUMIFS, Pivot',
      metaDescription: 'Practical spreadsheet guide: VLOOKUP vs XLOOKUP, multi-criteria SUMIFS/COUNTIFS, 4-step Pivot Tables, choosing the right chart type, and fixing #N/A errors.',
    },
  },
  {
    id: 'cum-functioneaza-internetul-ip-dns-tcp-udp-ping-wifi-router',
    gradeTagRo: 'Clasele V–VIII · Rețele',
    gradeTagEn: 'Grades 5–8 · Networking',
    ro: {
      slug: 'cum-functioneaza-internetul-ip-dns-tcp-udp-ping-wifi-router',
      categoryLabel: 'Rețele & Securitate',
      breadcrumbLabel: 'Internet: IP, DNS, TCP/UDP & Wi-Fi',
      metaDescription: 'Ghid complet de rețelistică pentru elevi și părinți: călătoria unui pachet web, IPv4 vs IPv6, DNS, diferența TCP vs UDP la gaming, benzi Wi-Fi 2.4/5/6 GHz și comenzi ping/tracert.',
    },
    en: {
      slug: 'how-the-internet-works-ip-dns-tcp-udp-gaming-ping-wifi-guide',
      categoryLabel: 'Networks & Safety',
      breadcrumbLabel: 'Internet: IP, DNS, TCP/UDP & Wi-Fi',
      metaDescription: 'Complete networking guide for students & parents: packet journey, IPv4 vs IPv6, DNS lookup, TCP vs UDP for gaming, 2.4/5/6 GHz Wi-Fi bands & ping/traceroute tools.',
    },
  },
  {
    id: 'algoritmi-de-sortare-cpp-bubble-selection-insertion-std-sort',
    gradeTagRo: 'Clasele VII–VIII · OJI',
    gradeTagEn: 'Grades 7–8 · Olympiad',
    ro: {
      slug: 'algoritmi-de-sortare-cpp-bubble-selection-insertion-std-sort',
      categoryLabel: 'C++ & Algoritmi',
      breadcrumbLabel: 'Sortări C++: Bubble, Selection, std::sort',
      metaDescription: 'Ghid complet de sortări în C++ pentru clasele VII–VIII și OJI: tabel complexitate Big-O, trasare pas cu pas pe vectorul [7,2,9,1,5], cod optimizat și comparatori std::sort().',
    },
    en: {
      slug: 'cpp-sorting-algorithms-bubble-selection-insertion-std-sort',
      categoryLabel: 'C++ & Algorithms',
      breadcrumbLabel: 'C++ Sorting: Bubble, Selection, std::sort',
      metaDescription: 'Complete C++ sorting guide for grades 7–8 & competitive coding: Big-O table, step-by-step trace of [7,2,9,1,5], clean templates, and custom std::sort() comparators.',
    },
  },
];

export const FEATURED_GLOSSARY_PREVIEWS: CatalogGlossaryPreview[] = [
  {
    id: 'cpu-processor',
    gradeTagRo: 'Clasa a V-a',
    gradeTagEn: 'Grade 5',
    ro: {
      slug: 'procesor-cpu',
      term: 'Procesor (CPU — Central Processing Unit)',
      shortAnswer: 'Procesorul (CPU) este „creierul” calculatorului: cipul de pe placa de bază care citește, decodifică și execută instrucțiunile sistemului de operare și ale aplicațiilor în fiecare secundă.',
    },
    en: {
      slug: 'cpu-processor',
      term: 'CPU (Central Processing Unit)',
      shortAnswer: 'The CPU (Central Processing Unit) is the "brain" of a computer: the microchip mounted on the motherboard that fetches, decodes, and executes instructions every second for the operating system, school apps, and programs.',
    },
  },
  {
    id: 'modulo-integer-division',
    gradeTagRo: 'Clasele VII–VIII',
    gradeTagEn: 'Grades 7–8',
    ro: {
      slug: 'operatorul-modulo-si-impartirea-intreaga',
      term: 'Operatorul Modulo (%) și Împărțirea Întreagă (/) în C++',
      shortAnswer: 'În C++, când împarți două numere întregi, operatorul / calculează câtul întreg (fără zecimale), iar operatorul modulo % calculează restul împărțirii. Împreună cu baza 10 (% 10 și / 10), stau la baza tuturor algoritmilor pe cifre.',
    },
    en: {
      slug: 'modulo-integer-division',
      term: 'Modulo (%) & Integer Division (/) in C++',
      shortAnswer: 'When both operands are integers in C++, / computes the integer quotient (discarding decimals), while modulo % returns the remainder. Together with base 10 (% 10 and / 10), they power digit-extraction and divisibility algorithms.',
    },
  },
  {
    id: 'excel-if-countif',
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    ro: {
      slug: 'functiile-if-si-countif-excel',
      term: 'Funcțiile Logice IF și COUNTIF în Excel',
      shortAnswer: 'Funcția IF verifică o condiție logică și returnează o valoare dacă este adevărată sau altă valoare dacă este falsă. Funcția COUNTIF numără câte celule dintr-un domeniu respectă un anumit criteriu (ex. note peste 5).',
    },
    en: {
      slug: 'excel-if-countif',
      term: 'Logical Spreadsheet Functions: IF & COUNTIF',
      shortAnswer: 'The IF function tests a condition and returns one result when true and another when false. COUNTIF counts how many cells in a range match a given criterion (such as scores >= 8).',
    },
  },
  {
    id: 'phishing-social-engineering',
    gradeTagRo: 'Clasele V–VIII',
    gradeTagEn: 'Grades 5–8',
    ro: {
      slug: 'phishing-inginerie-sociala',
      term: 'Phishing și Inginerie Socială',
      shortAnswer: 'Phishing-ul („pescuitul digital”) este o metodă de fraudă online prin care atacatorii se dau drept companii, jocuri sau prieteni (prin SMS, Discord, TikTok sau e-mail) pentru a păcăli victima să își introducă parola, codul 2FA sau datele cardului pe un site clonat.',
    },
    en: {
      slug: 'phishing-social-engineering',
      term: 'Phishing & Social Engineering',
      shortAnswer: 'Phishing is a cyberattack where scammers impersonate trusted brands, games, or friends via email, SMS, or Discord/TikTok DMs to trick victims into entering passwords, 2FA codes, or payment details on fake login pages.',
    },
  },
  {
    id: 'arduino-millis',
    gradeTagRo: 'Clasa a VIII-a',
    gradeTagEn: 'Grade 8',
    ro: {
      slug: 'functia-millis-vs-delay-arduino',
      term: 'Multitasking în Arduino: Funcția millis() vs. delay()',
      shortAnswer: 'Funcția delay(ms) îngheață complet procesorul Arduino pe durata așteptării, ratând apăsările de butoane și senzorii. Funcția millis() returnează milisecundele trecute de la pornirea plăcii, permițând execuția simultană (non-blocking) a mai multor sarcini.',
    },
    en: {
      slug: 'arduino-millis',
      term: 'Non-Blocking Arduino Timing: millis() vs. delay()',
      shortAnswer: 'The delay(ms) function freezes the entire Arduino processor during the pause, missing button presses and urgent sensors. The millis() function returns milliseconds since boot, letting multiple LEDs, buzzers, and sensors run simultaneously without blocking.',
    },
  },
  {
    id: 'prompt-engineering-rccl',
    gradeTagRo: 'Clasele VI–VIII',
    gradeTagEn: 'Grades 6–8',
    ro: {
      slug: 'inginerie-prompturi-metoda-rccl',
      term: 'Prompt Engineering & Formula R.C.C.L. pentru Învățare',
      shortAnswer: 'Un prompt este instrucțiunea pe care o scrii unui sistem AI. Metoda educațională R.C.C.L. (Rol, Context, Cerință clară, Limitări) transformă întrebările vagi în cereri precise care generează explicații pe înțelesul vârstei tale.',
    },
    en: {
      slug: 'prompt-engineering-rccl',
      term: 'Prompt Engineering & R.C.C.F. Study Framework',
      shortAnswer: 'A prompt is the instruction you give an AI system. Using a structured framework—Role, Context, Clear Task, and Format/Constraints (R.C.C.F.)—turns vague questions into tailored, age-appropriate study guides.',
    },
  },
];

export const FEATURED_WORKSHEET_PREVIEWS: CatalogWorksheetPreview[] = [
  {
    id: 'ws-g5-test-algoritmi-scratch',
    maxPoints: 100,
    gradeRo: 'Clasa a V-a',
    gradeEn: 'Grade 5',
    kindRo: 'Test',
    kindEn: 'Exam',
    ro: {
      slug: 'test-evaluare-barem-clasa-5-algoritmi-scheme-logice-scratch',
      breadcrumbLabel: 'Test Cls. V: Algoritmi & Scratch',
      directAnswerSummary: 'Test complet de 100 puncte (90p + 10p oficiu) pentru semestrul II la Clasa a V-a: proprietățile fundamentale ale algoritmului, simbolurile schemelor logice, urmărirea unei variabile prin pași liniari și sistemul de coordonate Scratch (-240..240 pe X, -180..180 pe Y).',
    },
    en: {
      slug: 'grade-5-assessment-algorithms-flowcharts-scratch-rubric',
      breadcrumbLabel: 'G5 Exam: Algorithms & Scratch',
      directAnswerSummary: 'Complete 100-point exam (90 + 10 pts) covering algorithm properties, standard flowchart shapes, linear variable tracing, and Scratch 3.0 coordinates (X: -240..240, Y: -180..180).',
    },
  },
  {
    id: 'ws-g6-test-securitate-email',
    maxPoints: 100,
    gradeRo: 'Clasa a VI-a',
    gradeEn: 'Grade 6',
    kindRo: 'Test',
    kindEn: 'Exam',
    ro: {
      slug: 'test-cu-barem-clasa-6-securitate-cibernetica-phishing-2fa-email-bcc',
      breadcrumbLabel: 'Test Cls. VI: Malware, Phishing & E-mail',
      directAnswerSummary: 'Test complet cu barem 100p: deosebirea între Ransomware, Trojan și Phishing; protecția conturilor cu 2FA; diferența de confidențialitate dintre CC (Carbon Copy vizibil) și BCC (Blind Carbon Copy ascuns); regula backup 3-2-1 și apelul 119 pentru cyberbullying.',
    },
    en: {
      slug: 'grade-6-cybersecurity-phishing-2fa-email-bcc-exam',
      breadcrumbLabel: 'G6 Exam: Cyber Safety & Email',
      directAnswerSummary: 'Graded 100-point test covering Ransomware vs Trojan vs Phishing, 2FA account protection, 3-2-1 backups, and why BCC hides recipient email addresses for privacy.',
    },
  },
  {
    id: 'ws-g7-oji-while-cifre',
    maxPoints: 100,
    gradeRo: 'Clasa a VII-a',
    gradeEn: 'Grade 7',
    kindRo: 'OJI / Teză',
    kindEn: 'Olympiad',
    ro: {
      slug: 'fisa-oji-clasa-7-cpp-bucle-while-oglindit-palindrom-numar-prim',
      breadcrumbLabel: 'OJI Cls. VII: while, Oglindit & Prim',
      directAnswerSummary: 'Fișă de performanță (100p) pentru clasa a VII-a și pregătire OJI: construirea oglinditului (`og = og * 10 + n % 10`), salvarea lui `copie = n` înainte de `while` pentru testul de palindrom, algoritmul lui Euclid prin împărțiri repetate și verificarea numerelor prime până la √n.',
    },
    en: {
      slug: 'grade-7-olympiad-cpp-while-loops-palindrome-prime-worksheet',
      breadcrumbLabel: 'G7 OJI Sheet: while & Primes',
      directAnswerSummary: 'Competition-ready Grade 7 worksheet (100 pts) covering `while (n > 0)` digit decomposition, reversed number (`rev = rev * 10 + n % 10`), saving `copy = n` for palindrome checks, and prime divisor counting.',
    },
  },
  {
    id: 'ws-g8-teza-admitere-vectori',
    maxPoints: 100,
    gradeRo: 'Clasa a VIII-a',
    gradeEn: 'Grade 8',
    kindRo: 'OJI / Teză',
    kindEn: 'Olympiad',
    ro: {
      slug: 'subiect-teza-admitere-mate-info-cpp-clasa-8-vectori-sortare-cautare-binara',
      breadcrumbLabel: 'Teză / Admitere Cls. VIII: Vectori C++',
      directAnswerSummary: 'Subiect tip Teză & Admitere Mate-Info (100p): indexarea corectă `0..n-1` (evitând Out-Of-Bounds), verificarea sortării cu variabila semafor `ok = 1`, parcurgerea comparativă până la `i < n - 1`, complexitatea căutării binare `O(log₂ n)` și numărul maxim de comparații pe 1.024 elemente.',
    },
    en: {
      slug: 'grade-8-cpp-high-school-prep-arrays-sorting-binary-search-exam',
      breadcrumbLabel: 'G8 Prep Exam: C++ Arrays & Search',
      directAnswerSummary: 'High-school CS prep paper (100 pts): 0-based C++ array bounds (`0..n-1`), flag variable verification (`ok = 1`), adjacent pair loop limits `i < n - 1`, and binary search `O(log₂ n)` step bounds.',
    },
  },
];
