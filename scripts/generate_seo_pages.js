import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import curricula modules data
const curriculaDataPath = path.resolve(__dirname, '../src/data/curriculaData.ts');
const curriculaFileContent = fs.readFileSync(curriculaDataPath, 'utf-8');

// Parse the modules by running a minimal node evaluation or regex
// For robustness, let's define the modules array in the script so it can run standalone:
const modules = [
  {
    id: 'hardware',
    slug: 'hardware-arhitectura-calculator',
    title: 'Arhitectura Calculatorului, Componente & Periferice — TIC Clasa a V-a',
    shortTitle: 'Hardware & Ergonomie',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 1: Sisteme de calcul și comunicații (pag. 10–21)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    metaDescription: 'Ghid curricular complet TIC Clasa a 5-a: Arhitectura calculatorului, componente hardware, periferice de intrare/ieșire, ergonomie și calcul capacitate memorii.',
    keywords: 'hardware calculator clasa 5, arhitectura calculatorului gimnaziu, dispozitive periferice intrare iesire, placa de baza microprocesor memorie ram, unitati de masura biti octeti',
    competencies: [
      { code: '1.1', desc: 'Identificarea componentelor hardware ale unui sistem de calcul și a rolului acestora în funcționarea calculatorului.' },
      { code: '1.2', desc: 'Aplicarea normelor de securitate și ergonomie a muncii în laboratorul de informatică și la lucrul cu dispozitivele digitale.' },
      { code: '2.1', desc: 'Utilizarea corectă a unităților de măsură a informației (bit, octet/byte, KB, MB, GB, TB).' }
    ],
    theory: [
      {
        heading: 'Norme de Ergonomie & Siguranță în Laboratorul de Informatică',
        points: [
          'Poziția corectă la calculator: spatele drept sprijinit pe spătar, tălpile pe podea, coatele la unghi drept de 90°.',
          'Distanța recomandată față de monitor este de 45 – 70 cm, cu privirea aliniată la marginea superioară a ecranului.',
          'Regula 20-20-20: La fiecare 20 de minute de lucru pe ecran, privește timp de 20 de secunde un obiect la 6 metri distanță.'
        ]
      },
      {
        heading: 'Arhitectura Internă a Calculatorului (Unitatea Centrală)',
        points: [
          'Placa de bază (Motherboard): componenta centrală pe care sunt conectate procesorul, memoriile și plăcile de extensie.',
          'Microprocesorul (CPU): creierul sistemului de calcul ce prelucrează datele și execută instrucțiunile.',
          'Memoria RAM (Random Access Memory): memorie volatilă, de lucru rapid, activă doar când calculatorul este pornit.',
          'Medii de stocare permanente: SSD (Solid State Drive - rapid, fără piese mobile) și HDD (Hard Disk Drive - platane magnetice rotative).'
        ]
      },
      {
        heading: 'Clasificarea Dispozitivelor Periferice',
        points: [
          'Periferice de Intrare: Tastatură, Mouse, Scaner, Cameră Web, Microfon, Tabletă grafică.',
          'Periferice de Ieșire: Monitor, Imprimantă, Boxe audio, Videoproiector, Căști.',
          'Periferice de Intrare-Ieșire: Ecran tactil (Touchscreen), Căști cu microfon, Imprimantă multifuncțională.'
        ]
      },
      {
        heading: 'Măsurarea Informației Digitale (Biți și Octeți)',
        points: [
          'Bitul (b): cea mai mică unitate de măsură a informației (valoarea 0 sau 1).',
          'Octetul sau Byte-ul (B): 1 Byte = 8 biți (poate stoca un caracter sau o literă).',
          'Multipli binari: 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB.'
        ]
      }
    ],
    terms: [
      { t: 'CPU (Procesor)', d: 'Unitatea Centrală de Prelucrare ce execută instrucțiunile din memorie.' },
      { t: 'RAM', d: 'Memorie rapidă cu acces aleatoriu, volatilă la oprirea calculatorului.' },
      { t: 'SSD', d: 'Unitate modernă de stocare nevolatilă pe bază de cipuri de memorie flash.' },
      { t: 'Byte (Octet)', d: 'Unitate de bază de reprezentare compusă din 8 biți.' }
    ],
    faqs: [
      { q: 'Care este diferența dintre memoria RAM și memoria SSD?', a: 'Memoria RAM este temporară de lucru și se șterge la repornire, în timp ce SSD-ul este unitatea de stocare permanentă unde rămân salvate fișierele și sistemul de operare.' },
      { q: 'Câți Megabytes are un Gigabyte?', a: 'În sistemul binar al calculatoarelor, 1 GB este egal cu 1024 MB.' }
    ]
  },
  {
    id: 'fisiere-so',
    slug: 'sisteme-de-operare-fisiere',
    title: 'Sistemul de Operare & Organizarea Fișierelor în Foldere — TIC Clasa a V-a',
    shortTitle: 'Sisteme de Operare & Fișiere',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 2: Sistemul de Operare (pag. 22–31)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    metaDescription: 'Lecție interactivă TIC: Sistemul de operare, desktop, ferestre, structura arborescentă a fișierelor și folderelor, căi de acces, extensii și coșul de reciclare.',
    keywords: 'sistem de operare clasa 5, organizarea fisierelor foldere directoare, structura arborescenta fisiere, extensii fisiere docx png pdf, recycle bin cos de reciclare',
    competencies: [
      { code: '1.3', desc: 'Utilizarea funcțiilor de bază ale sistemului de operare pentru gestionarea aplicațiilor și a dispozitivelor.' },
      { code: '2.2', desc: 'Organizarea fișierelor și a folderelor într-o structură arborescentă logică, utilizând operații de creare, copiere, mutare, redenumire și ștergere.' }
    ],
    theory: [
      {
        heading: 'Rolul și Funcțiile Sistemului de Operare (SO)',
        points: [
          'Sistemul de operare este ansamblul de programe care asigură comunicarea între componentele fizice (hardware) și utilizator sau aplicații software.',
          'Exemple de sisteme de operare moderne: Microsoft Windows, Linux (Ubuntu, Debian), Apple macOS, Android, iOS.',
          'Elementele interfeței grafice (GUI): Desktop (Spațiul de lucru), Bara de activități (Taskbar), Meniul Start, Ferestrele de aplicații.'
        ]
      },
      {
        heading: 'Fișiere, Extensii & Formate',
        points: [
          'Un fișier este o colecție omogenă de date identificată printr-un nume și o extensie separate prin punct (`nume.extensie`).',
          'Extensia comunică sistemului tipul de date: `.docx` (document Word), `.xlsx` (calcul tabelar), `.png`/`.jpg` (imagine), `.mp3` (audio), `.mp4` (video), `.pdf` (document portabil).'
        ]
      },
      {
        heading: 'Structura Arborescentă a Folderelor & Recycle Bin',
        points: [
          'Folderul (directorul) grupează fișierele într-o ierarhie logică (arbore de directoare).',
          'Calea de acces (Path) reprezintă traseul complet de la rădăcină (ex: `C:\\Scoala\\TIC\\Proiect.docx`).',
          'Coșul de reciclare (Recycle Bin) permite restaurarea fișierelor șterse de pe hard disk-ul intern.'
        ]
      }
    ],
    terms: [
      { t: 'GUI', d: 'Interfață grafică prietenoasă bazată pe ferestre, pictograme și meniuri.' },
      { t: 'Extensie fișier', d: 'Sufixul de după punct care indică formatul de fișier.' },
      { t: 'Cale de acces', d: 'Adresa arborescentă completă a fișierului în sistemul de stocare.' }
    ],
    faqs: [
      { q: 'Pot exista două fișiere cu același nume în același folder?', a: 'Nu. Numele complet (inclusiv extensia) trebuie să fie unic în interiorul aceluiași folder.' },
      { q: 'Ce se întâmplă cu fișierele șterse de pe un stick USB?', a: 'Fișierele șterse de pe medii externe USB sunt șterse definitiv și NU ajung în Recycle Bin.' }
    ]
  },
  {
    id: 'internet-siguranta',
    slug: 'internet-retele-securitate',
    title: 'Rețeaua Internet, Navigare Sigură & Siguranță Cibernetică — TIC Clasa a V-a',
    shortTitle: 'Internet & Securitate Web',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 3: Internet & Rețele de calculatoare (pag. 32–48)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    metaDescription: 'Ghid de securitate pe Internet pentru elevi de gimnaziu: Rețele de calculatoare, World Wide Web, motoare de căutare, protecție phishing, parole puternice și netichetă.',
    keywords: 'internet securitate web clasa 5, protectia datelor personale online, parole sigure phishing prevenire, motoare de cautare google adrese url, neticheta reguli comunicare online',
    competencies: [
      { code: '3.1', desc: 'Utilizarea eficientă a browserelor și motoarelor de căutare pentru identificarea informațiilor utile.' },
      { code: '3.2', desc: 'Conștientizarea riscurilor navigării online și aplicarea măsurilor elementare de siguranță cibernetică.' },
      { code: '3.3', desc: 'Respectarea drepturilor de autor și aplicarea regulilor de netichetă în comunicarea digitală.' }
    ],
    theory: [
      {
        heading: 'Rețele de Calculatoare & World Wide Web',
        points: [
          'Internetul este o rețea globală de calculatoare interconectate ce comunică prin protocoale standard.',
          'Adresa URL (Uniform Resource Locator) reprezintă adresa unică a oricărei pagini web pe glob.',
          'Protocolul `https://` cu simbolul lacătului indică o conexiune criptată și securizată.'
        ]
      },
      {
        heading: 'Securitatea Datelor Personale & Prevenirea Atacurilor Phishing',
        points: [
          'O parolă puternică are minim 12 caractere, combinând litere mari, mici, cifre și simboluri speciale.',
          'Atacurile de Phishing sunt tentative de furt de parole mascate sub forma unor mesaje de urgență false.',
          'Nu introduce niciodată parole sau date bancare pe pagini web nesigure sau deschise din linkuri suspecte.'
        ]
      },
      {
        heading: 'Neticheta & Drepturile de Autor (Copyright)',
        points: [
          'Neticheta reprezintă ansamblul regulilor de bun-simț și respect în spațiul digital.',
          'Scrierea mesajelor cu litere MARI este considerată echivalentul țipatului online.',
          'Materialele găsite pe net au drepturi de autor; utilizează licențe Creative Commons și citează sursa.'
        ]
      }
    ],
    terms: [
      { t: 'URL', d: 'Adresă web unică de localizare a unei resurse pe internet.' },
      { t: 'Phishing', d: 'Fraudă electronică pentru furtul identității și al parolelor prin înșelăciune.' },
      { t: 'Netichetă', d: 'Norme de comportament civilizat și comunicare respectuoasă pe internet.' }
    ],
    faqs: [
      { q: 'Cum recunosc un site securizat?', a: 'Adresa începe cu protocolul https:// și browserul afișează pictograma unui lacăt închis.' },
      { q: 'Ce este cyberbullying-ul?', a: 'Hărțuirea, jignirea sau intimidarea unei persoane prin intermediul mediilor digitale.' }
    ]
  },
  {
    id: 'editoare-text',
    slug: 'editoare-text-formatare',
    title: 'Editoare de Text, Formatare & Tehnoredactare Digitală — TIC Clasa a V-a',
    shortTitle: 'Birotică & Tehnoredactare',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 4: Prelucrarea Textului (pag. 50–80)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    metaDescription: 'Manual TIC Gimnaziu: Tehnoredactare corectă în Microsoft Word și Google Docs. Formatare caractere, aliniere paragrafe, tabele, liste numerotate și diacritice românești.',
    keywords: 'editoare de text word google docs clasa 5, tehnoredactare reguli diacritice, formatare caractere font dimensiune, aliniere paragraf justifiat, inserare tabele document',
    competencies: [
      { code: '2.3', desc: 'Editarea și formatarea unui document text respectând regulile de tehnoredactare și ortografie a limbii române.' },
      { code: '2.4', desc: 'Structurarea conținutului text prin inserarea de liste marcate/numerotate, tabele și imagini ilustrative.' }
    ],
    theory: [
      {
        heading: 'Reguli Fundamentale de Tehnoredactare în Limba Română',
        points: [
          'După orice semn de punctuație (. , : ; ! ?) se introduce OBLIGATORIU un singur spațiu, niciodată înainte.',
          'Ghilimelele românești corecte sunt „deschise jos” și ”închise sus”.',
          'Toate textele în limba română se scriu obligatoriu cu diacritice: ă, â, î, ș, ț.',
          'Tasta Enter se apasă exclusiv la încheierea unui paragraf, trecerea la rând nou fiind realizată automat de editor.'
        ]
      },
      {
        heading: 'Formatarea Caracterelor & a Paragrafelor',
        points: [
          'Caractere: Font (familie literă), Corp (dimensiune în puncte), Stil (Aldin/Bold, Cursiv/Italic, Subliniat).',
          'Alinierea paragrafelor: La stânga (Align Left), Centrat (Center), La dreapta (Align Right), Stânga-Dreapta (Justify / Aliniere pe ambele margini).',
          'Indentarea (Alineatul): Retragerea primei linii a paragrafului (standard 1.25 cm sau 1 cm).'
        ]
      }
    ],
    terms: [
      { t: 'Font', d: 'Set de caractere tipografice cu un stil și design unitar.' },
      { t: 'Justify', d: 'Alinierea paragrafului pe ambele margini prin distribuirea armonioasă a spațiilor.' },
      { t: 'Diacritice', d: 'Semne grafice asociate literelor de bază, specifice ortografiei limbii române.' }
    ],
    faqs: [
      { q: 'De ce nu trebuie să apăsăm Enter la capătul fiecărui rând?', a: 'Pentru că editorul va crea paragrafe artificiale de un singur rând, împiedicând redistribuirea automată a textului la redimensionare.' }
    ]
  },
  {
    id: 'algoritmi',
    slug: 'algoritmi-gandire-computationala',
    title: 'Gândire Computațională, Algoritmi & Structuri de Control — TIC Clasa a V-a',
    shortTitle: 'Algoritmi & Logică',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 5: Algoritmi (pag. 54–71)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    metaDescription: 'Ghid de algoritmi pentru gimnaziu: Proprietățile algoritmilor, pași logici, date de intrare/ieșire, structura secvențială, decizională (IF-ELSE) și repetitivă (WHILE).',
    keywords: 'algoritmi clasa 5 informatica, gandire computationala pasi logici, proprietatile algoritmilor claritate finitudine, structura decizionala if else, structura repetitiva bucle',
    competencies: [
      { code: '4.1', desc: 'Descompunerea unei probleme în subprobleme mai simple și descrierea etapelor de rezolvare sub formă de algoritm.' },
      { code: '4.2', desc: 'Identificarea și utilizarea structurilor de bază ale algoritmilor: secvențială, alternativă/decizională și repetitivă.' }
    ],
    theory: [
      {
        heading: 'Definiția și Proprietățile Obligatorii ale Algoritmilor',
        points: [
          'Un algoritm este o mulțime finită de pași bine precizați care prelucrează date de intrare pentru a obține date de ieșire (rezultate).',
          'Claritate (Determinism): Fiecare instrucțiune este neambiguă și executabilă.',
          'Finitudine: Algoritmul se încheie garantat după un număr determinat de pași.',
          'Generalitate: Rezolvă o clasă întreagă de probleme similare pentru orice date de intrare valide.'
        ]
      },
      {
        heading: 'Cele 3 Structuri Fundamentale de Prelucrare',
        points: [
          'Structura Secvențială (Liniară): Instrucțiunile se execută strict succesiv în ordinea scrierii.',
          'Structura Alternativă (Decizională): DACĂ o condiție este adevărată, se execută ramura 1; ALTFEL, se execută ramura 2.',
          'Structura Repetitivă (Buclă): Execută repetat un bloc de pași CÂT TIMP sau PÂNĂ CÂND o condiție este îndeplinită.'
        ]
      }
    ],
    terms: [
      { t: 'Algoritm', d: 'Șir logic, finit și ordonat de operații pentru rezolvarea unei probleme.' },
      { t: 'Variabilă', d: 'Locație denumită în memorie a cărei valoare se poate modifica în timpul execuției.' },
      { t: 'Condiție logică', d: 'Expresie binară ce poate lua doar valorile Adevărat sau Fals.' }
    ],
    faqs: [
      { q: 'Ce este o buclă infinită?', a: 'O eroare de logică în care condiția de oprire nu este atinsă niciodată, determinând rularea la nesfârșit a programului.' }
    ]
  },
  {
    id: 'scratch',
    slug: 'programare-scratch-animatii',
    title: 'Programare Vizuală cu Blocuri în Scratch: Animații & Jocuri — TIC Clasa a V-a',
    shortTitle: 'Scratch & Coding',
    grade: 'Clasa a V-a',
    unit: 'Unitatea 6: Medii de programare vizuală (pag. 72–93)',
    manualRef: 'Manual Art Klett — OMEN 3393/2017 & OM 4065/2022',
    metaDescription: 'Manual Scratch pentru gimnaziu: Blocuri de mișcare, aspect, evenimente, coordonate X/Y, bucle repetă, variabile scor și crearea de jocuri educative.',
    keywords: 'scratch programare vizuala clasa 5, blocuri scratch evenimente steag verde, coordonate ecran x y scratch, animatii personaje costume scratch, creare jocuri scratch',
    competencies: [
      { code: '4.3', desc: 'Construirea de scripturi prin asamblarea blocurilor vizuale pentru animarea personajelor.' },
      { code: '4.4', desc: 'Implementarea de jocuri educative simple cu interacțiune prin tastatură, mouse, variabile de scor și mesaje transmise între personaje.' }
    ],
    theory: [
      {
        heading: 'Interfața și Sistemul de Coordonate Scratch',
        points: [
          'Scena (Stage): Spațiul de afișare cu rezoluția de 480 x 360 pixeli.',
          'Centrul scenei are coordonatele carteziene X = 0, Y = 0.',
          'Axa orizontală X variază de la -240 (stânga) la +240 (dreapta); axa verticală Y variază de la -180 (jos) la +180 (sus).'
        ]
      },
      {
        heading: 'Categoriile de Blocuri de Cod',
        points: [
          'Evenimente (Galben): „Când se dă clic pe steagul verde”, „Când se apasă tasta ...”.',
          'Mișcare (Albastru): „Mergi 10 pași”, „Mergi la x: y:”, „Rotește la dreapta cu 15 grade”.',
          'Aspect (Violet): „Spune ... timp de 2 secunde”, „Treci la costumul următor”.',
          'Control (Portocaliu): „Repetă de 10 ori”, „La nesfârșit”, „Dacă ... atunci ... altfel”.',
          'Variabile (Portocaliu închis): Stocarea valorilor precum „Scor” sau „Timp”.'
        ]
      }
    ],
    terms: [
      { t: 'Script', d: 'Stivă de blocuri conectate care instruiesc un personaj să execute o acțiune.' },
      { t: 'Costum', d: 'O înfățișare grafică a personajului ce permite crearea iluziei de mișcare.' },
      { t: 'Scenă (Stage)', d: 'Zona vizuală pe care se derulează animația sau jocul programat.' }
    ],
    faqs: [
      { q: 'Cum transmitem un mesaj între două personaje diferite în Scratch?', a: 'Folosind blocul de eveniment „difuzează mesajul ...” și blocul corespondent „când primesc mesajul ...”.' }
    ]
  },
  {
    id: 'prezentari-slides',
    slug: 'prezentari-powerpoint-slides',
    title: 'Prezentări Multimedia & Diapozitive Interactive — TIC Clasa a VI-a',
    shortTitle: 'Prezentări Multimedia',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 1: Tehnoredactare & Prezentări (pag. 10–25)',
    manualRef: 'Manual Art Klett Clasa a VI-a — OMEN 3393/2017',
    metaDescription: 'Lecție completă Prezentări PowerPoint & Google Slides clasa a 6-a: Diapozitive, tranziții, animații, reguli de design vizual și susținerea unei expuneri.',
    keywords: 'prezentari powerpoint clasa 6, google slides diapozitive gimnaziu, tranzitii animatii diapozitive, reguli design prezentare contrast lizibilitate',
    competencies: [
      { code: '2.1', desc: 'Crearea unei prezentări multimedia structurate, combinând text, imagini, grafice și forme geometrice.' },
      { code: '2.2', desc: 'Aplicarea principiilor estetice de lizibilitate, contrast și echilibru vizual într-o expunere publică.' }
    ],
    theory: [
      {
        heading: 'Principii de Design Vizual pentru Diapozitive',
        points: [
          'Regula de aur 6 x 6: maximum 6 rânduri pe diapozitiv, maximum 6 cuvinte pe rând.',
          'Diapozitivul este un sprijin grafic pentru orator, nu o foaie de lectură plină de blocuri compacte de text.',
          'Păstrează un contrast cromatic ridicat între font și culoarea fundalului pentru lizibilitate maximă.'
        ]
      }
    ],
    terms: [
      { t: 'Diapozitiv (Slide)', d: 'Pagină individuală dintr-un fișier de prezentare multimedia.' },
      { t: 'Tranziție', d: 'Efect grafic de trecere între două diapozitive consecutive.' },
      { t: 'Animație', d: 'Efect de apariție, accentuare sau dispariție aplicat unui obiect de pe diapozitiv.' }
    ],
    faqs: [
      { q: 'Ce tastă pornește prezentarea pe ecran complet?', a: 'Tasta F5 pornește prezentarea de la început, iar combinația Shift + F5 de la diapozitivul selectat.' }
    ]
  },
  {
    id: 'paint-3d',
    slug: 'grafica-3d-paint3d',
    title: 'Grafică Tridimensională, Modele 3D & Spațiu Digital — TIC Clasa a VI-a',
    shortTitle: 'Grafică 3D',
    grade: 'Clasa a VI-a',
    unit: 'Unitatea 2: Grafică Digitală & Modelare 3D (pag. 26–33)',
    manualRef: 'Manual Art Klett Clasa a VI-a — OMEN 3393/2017',
    metaDescription: 'Lecție TIC Clasa a 6-a de Grafică 3D: Axele X, Y, Z, rotație spațială, iluminare, texturi, biblioteci 3D și exportul modelelor tridimensionale.',
    keywords: 'grafica 3d gimnaziu, paint 3d forme tridimensionale, axe spatiale x y z rotatie 3d, texturi culori modelare digitala',
    competencies: [
      { code: '2.3', desc: 'Explorarea spațiului tridimensional digital și poziționarea obiectelor pe cele 3 axe (X, Y, Z).' }
    ],
    theory: [
      {
        heading: 'Spațiul Tridimensional Digital: Cele 3 Axe',
        points: [
          'În reprezentarea 2D avem Lățime (X) și Înălțime (Y).',
          'În reprezentarea 3D se adaugă Profunzimea pe axa Z, conferind volum și perspectivă obiectelor.',
          'Obiectele 3D pot fi rotite complet, scalate pe axe independente și texturate cu materiale realiste.'
        ]
      }
    ],
    terms: [
      { t: 'Axa Z', d: 'Axa perpendiculară pe ecran ce măsoară adâncimea spațială în 3D.' },
      { t: 'Model 3D', d: 'Obiect digital definit prin coordonate tridimensionale și suprafețe poligonale.' }
    ],
    faqs: [
      { q: 'Ce diferențiază un desen 2D de un model 3D?', a: 'Modelul 3D are adâncime și poate fi examinat din orice perspectivă prin rotire în jurul axelor sale.' }
    ]
  }
];

// Target directory: public/cursuri/
const publicDir = path.resolve(__dirname, '../public');
const cursuriDir = path.join(publicDir, 'cursuri');

if (!fs.existsSync(cursuriDir)) {
  fs.mkdirSync(cursuriDir, { recursive: true });
}

// Generate static HTML for each module
modules.forEach((mod) => {
  const modDir = path.join(cursuriDir, mod.id);
  if (!fs.existsSync(modDir)) {
    fs.mkdirSync(modDir, { recursive: true });
  }

  const canonicalUrl = `https://www.arkyedu.com/cursuri/${mod.id}/`;
  const appDeepLink = `https://www.arkyedu.com/#curricula-${mod.id}`;

  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        '@id': `${canonicalUrl}#course`,
        'name': mod.title,
        'description': mod.metaDescription,
        'provider': {
          '@type': 'Organization',
          'name': 'ArkyEdu TIC',
          'sameAs': 'https://www.arkyedu.com'
        },
        'educationalLevel': `${mod.grade} (Gimnaziu România)`,
        'inLanguage': 'ro',
        'isAccessibleForFree': true,
        'hasCourseInstance': {
          '@type': 'CourseInstance',
          'courseMode': 'online',
          'courseWorkload': 'PT2H'
        }
      },
      {
        '@type': 'LearningResource',
        'name': `Fișă Didactică: ${mod.shortTitle}`,
        'description': mod.metaDescription,
        'learningResourceType': 'Lesson Plan',
        'educationalAlignment': {
          '@type': 'AlignmentObject',
          'alignmentType': 'educationalSubject',
          'educationalFramework': 'Curriculum Național TIC România OMEN 3393/2017',
          'targetName': mod.unit
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': mod.faqs.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.a
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Acasă ArkyEdu',
            'item': 'https://www.arkyedu.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Cursuri TIC',
            'item': 'https://www.arkyedu.com/#catalog'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': mod.shortTitle,
            'item': canonicalUrl
          }
        ]
      }
    ]
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-P9NW97TZHH"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-P9NW97TZHH');
  </script>
  <title>${mod.title} | ArkyEdu TIC</title>
  <meta name="description" content="${mod.metaDescription}">
  <meta name="keywords" content="${mod.keywords}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="theme-color" content="#0f172a">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${mod.title}">
  <meta property="og:description" content="${mod.metaDescription}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="ro_RO">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${mod.title}">
  <meta name="twitter:description" content="${mod.metaDescription}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
  </script>
  <style>
    :root {
      color-scheme: dark;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2.5rem 1.25rem 5rem 1.25rem;
    }
    header {
      border-bottom: 1px solid #334155;
      padding-bottom: 2rem;
      margin-bottom: 2.5rem;
    }
    .badge-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.8rem;
      font-weight: 700;
      background: #1e293b;
      border: 1px solid #475569;
      color: #38bdf8;
    }
    .badge-green {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.3);
      color: #34d399;
    }
    h1 {
      font-size: 2.2rem;
      font-weight: 900;
      line-height: 1.2;
      color: #ffffff;
      margin: 0.5rem 0 1rem 0;
    }
    .cta-box {
      margin: 2rem 0;
      padding: 1.5rem;
      background: linear-gradient(135deg, #1e1b4b, #0f172a);
      border: 1px solid #6366f1;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.2);
    }
    .btn-launch {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(90deg, #10b981, #06b6d4);
      color: #ffffff;
      padding: 0.85rem 1.75rem;
      border-radius: 0.75rem;
      font-weight: 800;
      text-decoration: none;
      font-size: 1rem;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
      transition: transform 0.2s;
    }
    .btn-launch:hover {
      transform: scale(1.03);
    }
    section {
      margin-bottom: 2.5rem;
      background: #1e293b;
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid #334155;
    }
    h2 {
      font-size: 1.4rem;
      font-weight: 800;
      color: #38bdf8;
      margin-top: 0;
      border-bottom: 1px solid #334155;
      padding-bottom: 0.5rem;
    }
    h3 {
      font-size: 1.15rem;
      color: #f8fafc;
      margin: 1.25rem 0 0.5rem 0;
    }
    ul {
      padding-left: 1.25rem;
      margin: 0.5rem 0;
    }
    li {
      margin-bottom: 0.5rem;
      color: #cbd5e1;
    }
    .competencies-grid {
      display: grid;
      gap: 0.75rem;
    }
    .comp-item {
      display: flex;
      gap: 0.75rem;
      background: #0f172a;
      padding: 0.85rem;
      border-radius: 0.5rem;
      border: 1px solid #334155;
    }
    .comp-code {
      font-weight: 800;
      color: #38bdf8;
      font-family: monospace;
      white-space: nowrap;
    }
    .terms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }
    .term-card {
      background: #0f172a;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #334155;
    }
    .term-title {
      font-weight: 800;
      color: #fbbf24;
      font-family: monospace;
    }
    .faq-item {
      background: #0f172a;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #334155;
      margin-bottom: 0.75rem;
    }
    .faq-q {
      font-weight: 700;
      color: #34d399;
      margin-bottom: 0.35rem;
    }
    footer {
      text-align: center;
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid #334155;
      font-size: 0.85rem;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge-bar">
        <span class="badge">${mod.grade}</span>
        <span class="badge">${mod.unit}</span>
        <span class="badge badge-green">Curriculum Oficial MEN România</span>
      </div>
      <h1>${mod.title}</h1>
      <p style="font-size: 1.1rem; color: #94a3b8; margin: 0;">${mod.metaDescription}</p>
    </header>

    <div class="cta-box">
      <div>
        <div style="font-weight: 800; font-size: 1.15rem; color: #ffffff;">Vrei să exersezi noțiunile prin joc?</div>
        <div style="font-size: 0.9rem; color: #cbd5e1;">Lansează laboratorul interactiv ArkyEdu cu simulator, quiz-uri și mini-jocuri arcade!</div>
      </div>
      <a href="${appDeepLink}" class="btn-launch">
        🚀 Deschide Misiunea Interactivă
      </a>
    </div>

    <section>
      <h2>📖 Sinteză Teoretică & Conținut Didactic</h2>
      ${mod.theory.map(t => `
        <h3>${t.heading}</h3>
        <ul>
          ${t.points.map(p => `<li>${p}</li>`).join('')}
        </ul>
      `).join('')}
    </section>

    <section>
      <h2>🎯 Competențe Specifice Oficiale (OMEN 3393/2017)</h2>
      <div class="competencies-grid">
        ${mod.competencies.map(c => `
          <div class="comp-item">
            <span class="comp-code">C.S. ${c.code}</span>
            <span>${c.desc}</span>
          </div>
        `).join('')}
      </div>
    </section>

    <section>
      <h2>💡 Vocabular IT & Glosar Noțiuni Cheie</h2>
      <div class="terms-grid">
        ${mod.terms.map(tm => `
          <div class="term-card">
            <div class="term-title">${tm.t}</div>
            <div style="font-size: 0.88rem; color: #cbd5e1; margin-top: 0.35rem;">${tm.d}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <section>
      <h2>❓ Întrebări Frecvente & Auto-Evaluare Elevi</h2>
      ${mod.faqs.map(f => `
        <div class="faq-item">
          <div class="faq-q">Întrebare: ${f.q}</div>
          <div style="color: #cbd5e1; font-size: 0.9rem;">Răspuns: ${f.a}</div>
        </div>
      `).join('')}
    </section>

    <div class="cta-box" style="margin-top: 3rem;">
      <div>
        <div style="font-weight: 800; font-size: 1.15rem; color: #ffffff;">Gata de provocare?</div>
        <div style="font-size: 0.9rem; color: #cbd5e1;">Intră în simulator și colectează puncte XP și monede ByteCoins!</div>
      </div>
      <a href="${appDeepLink}" class="btn-launch">
        Lansează Acum 🚀
      </a>
    </div>

    <footer>
      <p>ArkyEdu — Platformă Educațională Interactivă de TIC pentru Gimnaziu conform programei naționale.</p>
      <p><a href="https://www.arkyedu.com/" style="color: #38bdf8;">Mergi la pagina principală ArkyEdu</a> | <a href="https://www.arkyedu.com/sitemap.xml" style="color: #38bdf8;">Harta Site-ului (Sitemap)</a></p>
    </footer>
  </div>
</body>
</html>
`;

  fs.writeFileSync(path.join(modDir, 'index.html'), htmlContent, 'utf-8');
  console.log(`Generated SEO Page: /public/cursuri/${mod.id}/index.html`);
});

console.log('All static SEO Course pages generated successfully!');
