import React, { useState } from 'react';
import { Lightbulb, X, Sparkles, BookOpen, ChevronRight, Filter, Search } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

export interface PillFact {
  id: string;
  emoji: string;
  shortTitle: string;
  title: string;
  category: 'all' | 'hardware' | 'files' | 'internet' | 'algorithms' | 'scratch' | 'presentation' | 'model3d' | 'malware';
  grade?: 'g5' | 'g6';
  tag: string;
  bookPage: string;
  content: string;
  proTip: string;
  didYouKnow: string;
}

const PILLS_RO: PillFact[] = [
  // MODULUL 1 - HARDWARE & CALCULATOARE
  {
    id: 'pascalina',
    emoji: '⚙️',
    shortTitle: 'Pascalina 1642',
    title: 'Pascalina – Primul Calculator Mecanic',
    category: 'hardware',
    tag: 'Istoria TIC',
    bookPage: '13',
    content: 'Inventată în anul 1642 de matematicianul și fizicianul francez Blaise Pascal, Pascalina folosea roți dințate numerotate de la 0 la 9 pentru a efectua adunări și scăderi mecanice.',
    proTip: 'Calculatoarele de astăzi, de la laptopuri la smartphone-uri, sunt considerate urmașele directe ale Pascalinei!',
    didYouKnow: 'Blaise Pascal a conceput acest aparat la doar 19 ani pentru a-și ajuta tatăl, care era perceptor de taxe în Rouen, scutindu-l de calcule interminabile cu pana pe hârtie.',
  },
  {
    id: 'eniac',
    emoji: '⚡',
    shortTitle: 'ENIAC 1946',
    title: 'ENIAC – Primul Calculator Electronic Numeric',
    category: 'hardware',
    tag: 'Evoluție Digitală',
    bookPage: '13',
    content: 'ENIAC (Electronic Numerical Integrator And Computer) a fost finalizat în 1946 pentru armata SUA. Spre deosebire de mașinile mecanice, folosea tuburi electronice și putea fi reprogramat.',
    proTip: 'ENIAC efectua 5.000 de adunări pe secundă — o viteză uluitoare pentru acea vreme, deși un smartphone modest de azi este de milioane de ori mai rapid!',
    didYouKnow: 'Cântărea peste 30 de tone, ocupa o cameră uriașă de 167 metri pătrați și consuma atâta curent electric încât se spunea că luminile din orașul Philadelphia scădeau în intensitate când era pornit!',
  },
  {
    id: 'ergonomie',
    emoji: '📐',
    shortTitle: 'Regula 45-70 cm',
    title: 'Ergonomia la Calculator & Telefon',
    category: 'hardware',
    tag: 'Sănătate & Postură',
    bookPage: '11-12',
    content: 'Ergonomia studiază interacțiunea dintre om și echipamente. Monitorul trebuie așezat la 45–70 cm distanță, cu marginea de sus la nivelul ochilor. Spatele trebuie ținut drept pe spătar, iar coatele la 90° la nivelul biroului.',
    proTip: 'Când folosești telefonul sau tableta, ridică aparatul spre ochi! Nu apleca gâtul înainte: fiecare înclinare de 15 grade adaugă o forță suplimentară de câteva kilograme asupra coloanei cervicale!',
    didYouKnow: 'Regula 20-20-20: la fiecare 20 de minute de privit ecranul, privește timp de 20 de secunde un punct aflat la 6 metri (20 feet) depărtare pentru a-ți odihni ochii.',
  },
  {
    id: 'cpu-ram',
    emoji: '🧠',
    shortTitle: 'CPU vs RAM',
    title: 'Microprocesorul & Memoria RAM',
    category: 'hardware',
    tag: 'Hardware Unitate Centrală',
    bookPage: '15-17',
    content: 'Microprocesorul (CPU) este creierul calculatorului, specializat în calcul, comandă și control. Memoria RAM este memoria de lucru unde sunt ținute doar datele active cât timp rulează un program.',
    proTip: 'Memoria RAM este VOLATILĂ: dacă iei curentul, tot ce se află în ea dispare! De aceea este vital să salvezi frecvent fișierele pe discul permanent (SSD/HDD) folosind comanda Ctrl+S!',
    didYouKnow: 'Un procesor modern din școală poate executa peste 3 miliarde de instrucțiuni pe secundă pe fiecare nucleu.',
  },
  {
    id: 'hdd-ssd',
    emoji: '🧲',
    shortTitle: 'HDD vs SSD',
    title: 'Discul Dur (HDD) vs Unitatea Solid-State (SSD)',
    category: 'hardware',
    tag: 'Stocare Permanentă',
    bookPage: '18',
    content: 'HDD-ul folosește platane magnetice care se rotesc la viteze mari (ex: 7200 rotații/minut) și capete de citire. SSD-ul stochează datele în memorii Flash (semiconductori), fără nicio piesă în mișcare.',
    proTip: 'SSD-urile pornesc Windows-ul în 5-10 secunde și nu se strică dacă laptopul este mișcat ușor, deoarece nu au brațe mecanice fragile precum hard disk-urile vechi.',
    didYouKnow: 'La discurile optice (CD, DVD, Blu-Ray), datele sunt arse cu rază laser în succesiuni microscopice de „gropițe” și „terenuri plate” ce reprezintă 0 și 1.',
  },
  {
    id: 'biti-bytes',
    emoji: '🔢',
    shortTitle: '1 Byte = 8 Biți',
    title: 'Unitățile de Măsură ale Informației',
    category: 'hardware',
    tag: 'Matematică Digitală',
    bookPage: '19',
    content: 'Bitul (b) este cea mai mică unitate și poate conține doar 0 sau 1. Un grup de 8 biți formează un Byte (octet, B). Multiplii sunt puteri ale lui 2: 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB.',
    proTip: 'Pentru a scrie litera „e” pe ecran, calculatorul combină 8 biți: 01100101. Pentru două litere („eu”), are nevoie de 2 octeți (16 biți)!',
    didYouKnow: '1 Terabyte (1 TB) poate stoca peste 250.000 de fotografii sau aproximativ 500 de ore de film video de înaltă rezoluție!',
  },
  {
    id: 'ports-connectors',
    emoji: '🔌',
    shortTitle: 'Porturi & Conectori',
    title: 'Porturile Unității Centrale (USB, HDMI, Audio)',
    category: 'hardware',
    tag: 'Conectică & Periferice',
    bookPage: '16-17',
    content: 'Porturile sunt interfețele fizice prin care perifericele comunică cu placa de bază: USB (Universal Serial Bus) pentru tastatură, mouse și stick-uri; HDMI/DisplayPort pentru semnal video digital de înaltă definiție; Jack 3.5mm pentru sunet.',
    proTip: 'USB-C este noul standard reversibil: îl poți introduce oricum, fără să verifici orientarea, și transferă simultan date de mare viteză, video și alimentare cu energie!',
    didYouKnow: 'Standardul USB permite conectarea „la cald” (Hot-Plugging) a echipamentelor fără a fi nevoie să repornești calculatorul, spre deosebire de vechile porturi PS/2 sau seriale.',
  },
  {
    id: 'von-neumann',
    emoji: '🏗️',
    shortTitle: 'Arhitectura Von Neumann',
    title: 'Structura Funcțională a Calculatorului',
    category: 'hardware',
    tag: 'Principii Teoretice',
    bookPage: '15',
    content: 'Concepută de matematicianul John von Neumann în 1945, arhitectura descrie cele 4 blocuri fundamentale: Unitatea Centrală de Prelucrare (UCP/CPU formată din UCC și UAL), Memoria Internă (RAM/ROM), Dispozitivele de Intrare/Ieșire și Magistralele de Date.',
    proTip: 'Magistralele (Buses) funcționează ca niște autostrăzi cu multe benzi de fire de cupru prin care biții călătoresc la viteza luminii între procesor și memorie.',
    didYouKnow: 'Aproape toate calculatoarele, consolele de jocuri (PlayStation, Xbox) și telefoanele moderne folosesc și astăzi principiul arhitecturii Von Neumann!',
  },
  {
    id: 'green-computing',
    emoji: '♻️',
    shortTitle: 'Reciclarea DEEE',
    title: 'Green Computing & Protecția Mediului',
    category: 'hardware',
    tag: 'Ecologie TIC',
    bookPage: '12',
    content: 'Calculatoarele, telefoanele și bateriile vechi conțin substanțe toxice (plumb, mercur, cadmiu) dar și metale prețioase (aur, argint, cupru). Nu se aruncă niciodată la coșul de gunoi menajer, ci se predau la centrele speciale de colectare a Deșeurilor de Echipamente Electrice și Electronice (DEEE).',
    proTip: 'Activează modul „Power Saver” / „Economisire Energie” pe laptop și setează monitorul să intre în stand-by după 5 minute de inactivitate pentru a economisi curent electric!',
    didYouKnow: 'Dintr-o tonă de plăci de bază vechi de calculator se poate extrage mai mult aur pur decât dintr-o tonă de minereu extras dintr-o mină clasică de aur!',
  },
  {
    id: 'periferice-io',
    emoji: '🖱️',
    shortTitle: 'Dispozitive I/O',
    title: 'Periferice de Intrare, Ieșire și Intrare/Ieșire',
    category: 'hardware',
    tag: 'Dispozitive Periferice',
    bookPage: '16-17',
    content: 'Perifericele de intrare introduc date în calculator (Tastatură, Mouse, Microfon, Scanner). Perifericele de ieșire redau rezultatele (Monitor, Imprimantă, Boxe, Căști). Perifericele de intrare/ieșire (Mixte) fac ambele acțiuni (Touchscreen, Placă de rețea, Căști cu microfon).',
    proTip: 'Dacă un dispozitiv permite atât citirea cât și transmiterea de date (cum e un ecran tactil sau modemul Wi-Fi), este întotdeauna un dispozitiv mixt de Intrare/Ieșire!',
    didYouKnow: 'Primul mouse de calculator a fost inventat în 1964 de Douglas Engelbart și era fabricat dintr-o carcasă de lemn cu două roți metalice perpendiculare.',
  },
  {
    id: 'rom-bios',
    emoji: '💾',
    shortTitle: 'Memoria ROM & BIOS',
    title: 'Memoria ROM și Pornirea Calculatorului (Boot)',
    category: 'hardware',
    tag: 'Hardware Unitate Centrală',
    bookPage: '15-16',
    content: 'Memoria ROM (Read-Only Memory) este nevolatilă și conține microprogramul BIOS/UEFI scris de fabricant. Când apeși butonul Power, BIOS-ul verifică componentele hardware (POST - Power-On Self Test) și transferă controlul către sistemul de operare de pe disc.',
    proTip: 'Spre deosebire de RAM care se șterge la oprirea curentului, conținutul din ROM rămâne salvat permanent pe placa de bază!',
    didYouKnow: 'Bateria rotundă plată de tip pastilă (CR2032) de pe placa de bază menține ceasul intern și setările BIOS-ului chiar și când scoți calculatorul complet din priză.',
  },

  // MODULUL 2 - FIȘIERE, FOLDERE & SISTEME DE OPERARE
  {
    id: 'os-role',
    emoji: '🪟',
    shortTitle: 'Rolul Sistemului de Operare',
    title: 'Sistemul de Operare: Interfața Om-Calculator',
    category: 'files',
    tag: 'Sisteme de Operare',
    bookPage: '22-23',
    content: 'Sistemul de Operare (Windows, macOS, Linux, Android) este programul principal fără de care calculatorul nu poate funcționa. El coordonează componentele hardware, gestionează fișierele și oferă utilizatorului o interfață grafică prietenoasă (GUI).',
    proTip: 'Sistemele de operare moderne sunt multitasking: pot rula simultan browserul de internet, muzica în căști și un document deschis în Word!',
    didYouKnow: 'Înainte de apariția ferestrelor grafice colorate, utilizatorii trebuiau să tasteze comenzi text pe un ecran negru (sistemul MS-DOS).',
  },
  {
    id: 'desktop-taskbar',
    emoji: '🖥️',
    shortTitle: 'Desktop & Taskbar',
    title: 'Spațiul de Lucru (Desktop) & Bara de Activități',
    category: 'files',
    tag: 'Interfață Grafică',
    bookPage: '23-24',
    content: 'Desktop-ul este ecranul principal afișat după pornire, conținând pictograme și imagini de fundal. În partea de jos se află Bara de Activități (Taskbar), ce include Butonul Start, pictogramele aplicațiilor deschise și Zona de Notificări (ceas, volum, rețea).',
    proTip: 'Dacă apeși combinația de taste Windows + D, toate ferestrele se minimizează instantaneu, arătându-ți curat spațiul Desktop!',
    didYouKnow: 'Zona de notificări din dreapta-jos mai este numită și „System Tray” și găzduiește programele care rulează discret în fundal, cum ar fi antivirusul.',
  },
  {
    id: 'ferestre-os',
    emoji: '🔲',
    shortTitle: 'Controlul Ferestrelor',
    title: 'Anatomia Ferestrelor & Butoanele de Control',
    category: 'files',
    tag: 'Interfață Grafică',
    bookPage: '24',
    content: 'Fiecare aplicație se deschide într-o fereastră proprie. În colțul din dreapta-sus se găsesc cele trei butoane clasice: Minimizare (_) pentru ascunderea în Taskbar, Maximizare/Restaurare (□) pentru umplerea ecranului și Închidere (X / Alt+F4).',
    proTip: 'Combinația `Alt + Tab` îți permite să treci fulgerător dintr-o fereastră activă în alta fără să atingi mouse-ul!',
    didYouKnow: 'Poți apropia o fereastră de marginea ecranului pentru a o fixa automat pe jumătate de ecran (funcția Windows Snap), utilă când compari două teme în paralel.',
  },
  {
    id: 'cautare-masca',
    emoji: '🔎',
    shortTitle: 'Măști de Căutare (* și ?)',
    title: 'Căutarea Fișierelor folosind Caractere Generice',
    category: 'files',
    tag: 'Navigare & Găsire',
    bookPage: '29',
    content: 'Când nu știi numele exact al unui fișier, folosești masca de căutare: caracterul `*` (asterisc) înlocuiește un grup de litere (ex: `*.docx` găsește toate documentele Word), iar `?` înlocuiește exact un singur caracter (ex: `test?.txt`).',
    proTip: 'Scrierea `proiect*.*` în căsuța de căutare din File Explorer va găsi orice fișier al cărui nume începe cu „proiect”, indiferent de extensie!',
    didYouKnow: 'Căutarea din Windows indexează în prealabil conținutul fișierelor, permițându-ți să găsești un referat chiar și căutând o frază din interiorul său.',
  },
  {
    id: 'folder-tree',
    emoji: '🌳',
    shortTitle: 'Arborele de Foldere',
    title: 'Structura Ierarhică a Folderelor (Directoarelor)',
    category: 'files',
    tag: 'Sisteme de Operare',
    bookPage: '27-28',
    content: 'Fișierele din calculator sunt organizate într-o ierarhie arborescentă asemănătoare unui copac răsturnat. Rădăcina (Root) este discul `C:\\`, din care pornesc folderele părinte și subfolderele (crengile), iar fișierele reprezintă frunzele.',
    proTip: 'Calea absolută (Path) descrie adresa completă a unui document: de exemplu `C:\\Scoala\\Informatica\\Referat.docx`. Știind calea, calculatorul găsește fișierul instantaneu!',
    didYouKnow: 'Un folder este de fapt un fișier special din sistemul de fișiere (NTFS/FAT) care conține o listă de adrese către alte fișiere stocate fizic pe disc.',
  },
  {
    id: 'forbidden-chars',
    emoji: '🚫',
    shortTitle: 'Caractere Interzise',
    title: 'Cele 9 Caractere Interzise în Numele Fișierelor',
    category: 'files',
    tag: 'Reguli de Salvare',
    bookPage: '28',
    content: 'În sistemele Windows, numele unui fișier sau folder NU poate conține niciunul din următoarele 9 caractere: \\ / : * ? " < > |. Încercarea de a le introduce va fi blocată automat de sistem.',
    proTip: 'De ce sunt interzise? Pentru că sistemul de operare le folosește ca separatori de căi (`\\`, `/`), comenzi de căutare (`*`, `?`) sau redirecționare de date (`<`, `>`).',
    didYouKnow: 'Un nume de fișier poate avea până la 255 de caractere (inclusiv spații și litere românești), dar este recomandat să fie scurt, clar și fără caractere ciudate.',
  },
  {
    id: 'file-extensions',
    emoji: '🏷️',
    shortTitle: 'Extensii (.docx, .png)',
    title: 'Extensiile de Fișiere & Asocierile cu Programe',
    category: 'files',
    tag: 'Gestiunea Datelor',
    bookPage: '28-29',
    content: 'Extensia este un sufix de 3-4 caractere situat după punct la finalul numelui (ex: `.docx`, `.xlsx`, `.pptx`, `.png`, `.mp3`, `.mp4`, `.exe`). Ea îi spune sistemului de operare ce tip de conținut este și cu ce aplicație să îl deschidă la dublu-click.',
    proTip: 'Fii precaut cu fișierele cu extensia `.exe`, `.bat` sau `.vbs` primite de la persoane necunoscute: acestea sunt programe executabile care pot rula comenzi periculoase pe PC!',
    didYouKnow: 'Dacă redenumești din greșeală extensia din `Foto.png` în `Foto.txt`, conținutul imaginii nu se distruge, dar calculatorul va încerca să o deschidă cu Notepad și va afișa simboluri de neînțeles!',
  },
  {
    id: 'shortcuts-keys',
    emoji: '⌨️',
    shortTitle: 'Comenzile Rapide',
    title: 'Comenzile Rapide Esențiale de Tastatură',
    category: 'files',
    tag: 'Productivitate',
    bookPage: '29-30',
    content: 'Tastatura îți permite să lucrezi de 5 ori mai rapid decât cu mouse-ul: `Ctrl+C` (Copiază în Clipboard), `Ctrl+X` (Decupează/Mută), `Ctrl+V` (Lipește), `Ctrl+Z` (Anulează ultima acțiune), `Ctrl+A` (Selectează tot), `F2` (Redenumire rapidă) și `Del` (Ștergere).',
    proTip: 'Comanda `Shift + Delete` șterge definitiv un fișier de pe disc, ocolind Coșul de Reciclare (Recycle Bin). Folosește-o cu mare atenție, doar când ești sigur!',
    didYouKnow: 'Combinația `Ctrl+C` și `Ctrl+V` a fost concepută de cercetătorul Larry Tesler de la centrul Xerox PARC în anii 1970 și a devenit limbaj universal pe orice calculator.',
  },
  {
    id: 'recycle-bin',
    emoji: '🗑️',
    shortTitle: 'Coșul de Reciclare',
    title: 'Recycle Bin: Salvarea & Restaurarea Fișierelor',
    category: 'files',
    tag: 'Siguranța Datelor',
    bookPage: '30',
    content: 'Când apeși tasta Delete pe un fișier de pe hard disk, acesta nu este șters iremediabil, ci este mutat în Recycle Bin (Coșul de Reciclare). Dacă te răzgândești, poți da click-dreapta și `Restore` (Restaurare), iar fișierul revine exact în folderul de unde a plecat.',
    proTip: 'Fișierele șterse de pe un stick USB NU ajung în Recycle Bin, ci se șterg direct! Fă mereu o copie de siguranță (backup) a proiectelor importante.',
    didYouKnow: 'Până nu dai comanda „Empty Recycle Bin” (Golește Coșul), fișierele continuă să ocupe spațiu real pe discul calculatorului tău.',
  },

  // MODULUL 3 - INTERNET & COMUNICARE DIGITALĂ
  {
    id: 'search-operators',
    emoji: '🔍',
    shortTitle: 'Operatori de Căutare',
    title: 'Căutare Avansată cu Ghilimele & site:',
    category: 'internet',
    grade: 'g5',
    tag: 'Navigare Inteligentă',
    bookPage: '38-40',
    content: 'Folosește ghilimelele `""` pentru a căuta exact o expresie în ordinea cuvintelor. Operatorul `site:edu.ro` caută doar pe site-urile școlare, iar `filetype:pdf` găsește doar documente gata de descărcat.',
    proTip: 'Dacă vrei să cauți informații despre jaguar animalul și nu despre mașina de lux, scrie: `jaguar -masina` sau `jaguar -auto`!',
    didYouKnow: 'Google indexează peste 50 de miliarde de pagini web și răspunde la interogarea ta în mai puțin de 0.2 secunde folosind mii de servere paralele.',
  },
  {
    id: 'email-bcc',
    emoji: '✉️',
    shortTitle: 'E-mail: To vs Cc vs Bcc',
    title: 'Anatomia E-mailului & Protecția Adreselor',
    category: 'internet',
    grade: 'g5',
    tag: 'Comunicare Sigură',
    bookPage: '42-44',
    content: 'La trimiterea unui mesaj: `To` este destinatarul principal; `Cc` (Carbon Copy) este pentru informare; `Bcc` (Blind Carbon Copy) ascunde adresele celorlalți destinatari, protejându-le intimitatea.',
    proTip: 'Când trimiți un e-mail către toți colegii de clasă sau profesori, pune adresele în `Bcc:` pentru a nu divulga public adresele lor private de e-mail!',
    didYouKnow: 'Simbolul `@` (arond / at) a fost ales de Ray Tomlinson în 1971 pentru a separa numele utilizatorului de numele calculatorului gazdă (server).',
  },

  // MODULUL 4 - ALGORITMI & SCRATCH (CLASA A V-A)
  {
    id: 'algo-proprieties',
    emoji: '🧩',
    shortTitle: 'Proprietățile Algoritmilor',
    title: 'Cele 4 Proprietăți Fundamentale ale Algoritmului',
    category: 'algorithms',
    grade: 'g5',
    tag: 'Gândire Algoritmică',
    bookPage: '56-58',
    content: 'Un algoritm este o succesiune ordonată de pași logici pentru rezolvarea unei probleme. Are 4 proprietăți obligatorii: Claritate (fără ambiguitate), Finitudine (se termină într-un număr finit de pași), Generalitate (rezolvă o clasă întreagă de probleme) și Eficiență.',
    proTip: 'Rețeta unei prăjituri sau instrucțiunile de asamblare Lego sunt exemple perfecte de algoritmi din viața de zi cu zi!',
    didYouKnow: 'Cuvântul „Algoritm” provine de la numele matematicianului persan Al-Khwarizmi, care a trăit în secolul al IX-lea la Bagdad.',
  },
  {
    id: 'scratch-xy-coords',
    emoji: '🐱',
    shortTitle: 'Coordonatele X & Y în Scratch',
    title: 'Scena Scratch: Grila Cartesiană (480 x 360)',
    category: 'scratch',
    grade: 'g5',
    tag: 'Programare Vizuală',
    bookPage: '68-70',
    content: 'În Scratch, scena măsoară 480 pixeli pe lățime și 360 pixeli pe înălțime. Centrul scenei este (X: 0, Y: 0). Axa X merge de la -240 (stânga) la +240 (dreapta), iar Y merge de la -180 (jos) la +180 (sus).',
    proTip: 'Pentru a readuce instant un personaj în centrul scenei, folosește blocul `Mergi la x: 0 y: 0` la începutul fiecărui script cu steag verde!',
    didYouKnow: 'Scratch a fost dezvoltat de echipa Lifelong Kindergarten de la prestigiosul laborator MIT Media Lab din SUA și este folosit de peste 100 de milioane de elevi din întreaga lume.',
  },

  // CLASA A VI-A - PREZENTĂRI MULTIMEDIA
  {
    id: 'regula-6x6',
    emoji: '📊',
    shortTitle: 'Regula de Aur 6 x 6',
    title: 'Designul Diapozitivelor: Regula 6 x 6 & Contrastul',
    category: 'presentation',
    grade: 'g6',
    tag: 'Prezentări Diapozitive',
    bookPage: '14-16',
    content: 'O prezentare de nota 10 respectă Regula 6x6: maxim 6 rânduri de text pe diapozitiv și maxim 6 cuvinte pe fiecare rând. Slide-ul este suport vizual pentru vorbitor, nu o pagină de carte ce trebuie citită cuvânt cu cuvânt.',
    proTip: 'Asigură un contrast puternic: text deschis pe fundal întunecat sau text închis pe fundal alb. Nu folosi mai mult de 2-3 culori tematice și 2 fonturi într-o prezentare!',
    didYouKnow: 'Tasta F5 pornește prezentarea de la primul diapozitiv, iar combinația Shift + F5 o lansează exact de la diapozitivul selectat pe care lucrezi.',
  },
  {
    id: 'slide-animations',
    emoji: '🎬',
    shortTitle: 'Tranziții vs Animații',
    title: 'Diferența dintre Tranziții și Animații',
    category: 'presentation',
    grade: 'g6',
    tag: 'Prezentări Diapozitive',
    bookPage: '18-20',
    content: 'Tranziția este efectul vizual la trecerea de la un diapozitiv la altul (schimbarea paginii). Animația este efectul aplicat unui element individual din interiorul diapozitivului (titlu, casetă de text, pictogramă, imagine).',
    proTip: 'Folosește tranziții discrete (Fade, Wipe) cu durată de 0.5-1 secundă. Efectele exagerate sau prea zgomotoase distrag atenția publicului de la mesajul tău!',
    didYouKnow: 'Publicul își formează o impresie despre prezentarea ta în primele 7 secunde ale expunerii: contactul vizual și postura dreaptă contează enorm.',
  },

  // CLASA A VI-A - GRAFICĂ TRIDIMENSIONALĂ & MODELARE 3D
  {
    id: 'paint3d-axes',
    emoji: '🧊',
    shortTitle: 'Axa Z & Spațiul 3D',
    title: 'Grafică 3D: Axele X, Y și A Treia Dimensiune (Z)',
    category: 'model3d',
    grade: 'g6',
    tag: 'Modelare & Paint 3D',
    bookPage: '28-30',
    content: 'În grafica 2D avem doar Lățime (X) și Înălțime (Y). În Paint 3D apare Axa Z (Profunzime/Adâncime), care plasează obiectele mai aproape sau mai departe de privitor în spațiu.',
    proTip: 'Un model 3D poate fi rotit pe 3 cercuri de rotație distincte (Roll, Pitch, Yaw) pentru a fi examinat din față, profil, spate sau de sus!',
    didYouKnow: 'Ochelarii de Realitate Virtuală (VR) afișează două imagini ușor decalate pentru fiecare ochi, păcălind creierul să perceapă profunzimea reală a axei Z.',
  },

  // CLASA A VI-A - AMENINȚĂRI MALWARE & SECURITATE CIBERNETICĂ
  {
    id: 'malware-types',
    emoji: '🦠',
    shortTitle: 'Viruși, Viermi & Troieni',
    title: 'Clasificarea Malware: Virus vs Vierme vs Cal Troian',
    category: 'malware',
    grade: 'g6',
    tag: 'Securitate Cibernetică',
    bookPage: '44-46',
    content: 'Malware provine de la „Malicious Software”. Un Virus are nevoie de un fișier-gazdă (.exe, .docx) pentru a infecta. Un Vierme (Worm) se replică singur prin rețea fără ajutorul utilizatorului. Un Cal Troian (Trojan) se deghizează într-un joc sau program util pentru a păcăli victima.',
    proTip: 'Ransomware-ul este cea mai periculoasă formă de malware: criptează fișierele cu o cheie secretă și cere bani de răscumpărare. Singura armă sigură este backup-ul periodic offline pe disc extern!',
    didYouKnow: 'Primul virus cibernetic atestat din istorie s-a numit „Creeper” (1971) și afișa mesajul inofensiv: „I\'m the creeper, catch me if you can!”.',
  },
  {
    id: 'antivirus-firewall',
    emoji: '🛡️',
    shortTitle: 'Antivirus vs Firewall',
    title: 'Cei 3 Piloni ai Apărării: Antivirus, Carantină & Firewall',
    category: 'malware',
    grade: 'g6',
    tag: 'Protecție Digitală',
    bookPage: '46-48',
    content: 'Firewall-ul (Zidul de Protecție) este portarul rețelei ce blochează conexiunile suspecte din Internet. Antivirusul scanează fișierele salvate pe disc. Dacă detectează cod periculos, îl mută în Carantină (zonă izolată) pentru a preveni rularea.',
    proTip: 'Nu folosi niciodată două programe antivirus instalate simultan pe același PC: vor intra în conflict și vor bloca calculatorul! Păstrează doar unul, actualizat zilnic.',
    didYouKnow: 'O parolă puternică de 12 caractere ce combină litere mari, mici, cifre și simboluri (ex: `#ArkyTIC!2026`) ar necesita sute de mii de ani pentru a fi spartă de un computer obișnuit prin forță brută!',
  },
];

const PILLS_EN: PillFact[] = [
  // MODULE 1 - HARDWARE & COMPUTING
  {
    id: 'pascalina',
    emoji: '⚙️',
    shortTitle: 'Pascaline 1642',
    title: 'The Pascaline – The First Mechanical Calculator',
    category: 'hardware',
    grade: 'g5',
    tag: 'History of Computing',
    bookPage: '13',
    content: 'Invented in 1642 by French mathematician and philosopher Blaise Pascal, the Pascaline used rotating geared wheels numbered 0 to 9 to perform mechanical additions and subtractions.',
    proTip: 'Today’s computers, from laptops to smartphones, are considered direct conceptual descendants of the Pascaline!',
    didYouKnow: 'Blaise Pascal designed this machine at just 19 years old to assist his father, a tax commissioner in Rouen, eliminating tedious hand calculations with quill and ink.',
  },
  {
    id: 'eniac',
    emoji: '⚡',
    shortTitle: 'ENIAC 1946',
    title: 'ENIAC – The First General-Purpose Electronic Digital Computer',
    category: 'hardware',
    grade: 'g5',
    tag: 'Digital Evolution',
    bookPage: '13',
    content: 'ENIAC (Electronic Numerical Integrator And Computer) was completed in 1946 for the US military. Unlike mechanical devices, it used vacuum tubes and was fully programmable.',
    proTip: 'ENIAC performed 5,000 additions per second — astonishing speed back then, though an ordinary smartphone today is millions of times faster!',
    didYouKnow: 'It weighed over 30 tons, occupied a massive 167-square-meter room, and consumed so much electricity that streetlights in Philadelphia allegedly dimmed when it was switched on!',
  },
  {
    id: 'ergonomie',
    emoji: '📐',
    shortTitle: '45-70 cm Rule',
    title: 'Computer & Smartphone Ergonomics',
    category: 'hardware',
    grade: 'g5',
    tag: 'Health & Posture',
    bookPage: '11-12',
    content: 'Ergonomics studies human interaction with equipment. Place the monitor 45–70 cm away with the top bezel at eye level. Keep your back supported and elbows at a 90° desk angle.',
    proTip: 'When using a phone or tablet, raise the device to your eyes! Do not hunch your neck forward: every 15-degree tilt adds several kilograms of extra stress to your cervical spine!',
    didYouKnow: 'The 20-20-20 Rule: every 20 minutes of screen time, look at an object 20 feet (6 meters) away for 20 seconds to relax your eye muscles.',
  },
  {
    id: 'cpu-ram',
    emoji: '🧠',
    shortTitle: 'CPU vs RAM',
    title: 'Microprocessor (CPU) & RAM Memory',
    category: 'hardware',
    grade: 'g5',
    tag: 'Motherboard Hardware',
    bookPage: '15-17',
    content: 'The CPU is the brain of the computer, handling calculations, logic, and control. RAM is the temporary workspace where active application data is kept while running.',
    proTip: 'RAM is VOLATILE: if power cuts out, everything inside evaporates! That’s why saving your work frequently to permanent disk (SSD/HDD) with Ctrl+S is essential!',
    didYouKnow: 'A modern school computer processor can execute more than 3 billion instructions per second on every individual core.',
  },
  {
    id: 'hdd-ssd',
    emoji: '🧲',
    shortTitle: 'HDD vs SSD',
    title: 'Hard Disk Drive (HDD) vs Solid-State Drive (SSD)',
    category: 'hardware',
    grade: 'g5',
    tag: 'Permanent Storage',
    bookPage: '18',
    content: 'HDDs store data on spinning magnetic platters (e.g. 7200 RPM) read by moving heads. SSDs store data electronically in solid-state flash chips with zero moving parts.',
    proTip: 'SSDs boot Windows in 5-10 seconds and won’t get damaged if a laptop is gently moved, unlike fragile mechanical hard drives with spinning platters.',
    didYouKnow: 'Optical discs (CD, DVD, Blu-Ray) store data using microscopic pits and lands etched by laser beams representing 0s and 1s.',
  },
  {
    id: 'biti-bytes',
    emoji: '🔢',
    shortTitle: '1 Byte = 8 Bits',
    title: 'Units of Digital Information',
    category: 'hardware',
    grade: 'g5',
    tag: 'Binary Mathematics',
    bookPage: '19',
    content: 'A bit (b) is the smallest unit (0 or 1). A group of 8 bits forms a Byte (B). Multipliers are powers of 2: 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB.',
    proTip: 'To render the letter "e", a computer combines 8 bits: 01100101. Two characters ("me") require 2 Bytes (16 bits)!',
    didYouKnow: '1 Terabyte (1 TB) can store over 250,000 photos or approximately 500 hours of high-definition video!',
  },
  {
    id: 'ports-connectors',
    emoji: '🔌',
    shortTitle: 'Ports & Connectors',
    title: 'System Unit Ports (USB, HDMI, Audio Jacks)',
    category: 'hardware',
    grade: 'g5',
    tag: 'Connectors & I/O',
    bookPage: '16-17',
    content: 'Ports are physical connection points linking peripherals to the motherboard: USB for keyboard, mouse, and flash storage; HDMI for digital video/audio; 3.5mm jack for headsets.',
    proTip: 'USB-C is fully reversible: you never have to flip it over, and it carries high-speed data, 4K video, and charging power simultaneously!',
    didYouKnow: 'USB supports Hot-Plugging: you can connect or disconnect devices while the computer is running without needing to restart.',
  },
  {
    id: 'von-neumann',
    emoji: '🏗️',
    shortTitle: 'Von Neumann Architecture',
    title: 'Functional Computer Architecture',
    category: 'hardware',
    grade: 'g5',
    tag: 'Core Computing Theory',
    bookPage: '15',
    content: 'Formulated by John von Neumann in 1945, this model defines 4 core subsystems: the CPU (Control Unit + Arithmetic Logic Unit), Internal Memory (RAM/ROM), Input/Output devices, and System Buses.',
    proTip: 'System buses act like multi-lane digital highways carrying bits at light speed between processor, memory, and devices.',
    didYouKnow: 'Nearly all smartphones, laptops, servers, and gaming consoles today operate on Von Neumann architecture principles.',
  },
  {
    id: 'green-computing',
    emoji: '♻️',
    shortTitle: 'E-Waste & Recycling',
    title: 'Green Computing & WEEE Recycling',
    category: 'hardware',
    grade: 'g5',
    tag: 'ICT Sustainability',
    bookPage: '12',
    content: 'Obsolete electronics contain hazardous elements (lead, mercury) alongside precious metals (gold, copper). Never discard old electronics in municipal trash; bring them to dedicated WEEE collection centers.',
    proTip: 'Enable Power Saver mode and set monitors to sleep after 5 minutes of inactivity to reduce energy consumption and extend hardware lifespan.',
    didYouKnow: 'One ton of discarded circuit boards yields significantly more pure gold than one ton of mined gold ore!',
  },
  {
    id: 'periferice-io',
    emoji: '🖱️',
    shortTitle: 'I/O Peripherals',
    title: 'Input, Output, and Combined I/O Devices',
    category: 'hardware',
    grade: 'g5',
    tag: 'Peripherals & Hardware',
    bookPage: '16-17',
    content: 'Input peripherals send data into the system (Keyboard, Mouse, Microphone, Scanner). Output devices render results (Monitor, Printer, Speakers). Combined I/O units perform both (Touchscreens, Network cards, Headsets with mic).',
    proTip: 'If a device can both send and receive data (such as a touchscreen or Wi-Fi modem), it is always categorized as a mixed Input/Output unit!',
    didYouKnow: 'The first computer mouse was invented in 1964 by Douglas Engelbart and was carved from wood with two perpendicular metal wheels.',
  },
  {
    id: 'rom-bios',
    emoji: '💾',
    shortTitle: 'ROM & BIOS Boot',
    title: 'ROM Memory & PC Boot Sequence',
    category: 'hardware',
    grade: 'g5',
    tag: 'System Firmware',
    bookPage: '15-16',
    content: 'ROM (Read-Only Memory) is non-volatile and contains firmware (BIOS/UEFI). When powering on, BIOS runs the POST (Power-On Self Test) hardware diagnostic and loads the operating system.',
    proTip: 'Unlike RAM which loses contents on shutdown, ROM code remains permanently written on the motherboard!',
    didYouKnow: 'The flat CR2032 coin-cell battery on motherboards keeps the real-time clock ticking even when completely disconnected from electrical outlets.',
  },

  // MODULE 2 - FILES, FOLDERS & OPERATING SYSTEMS
  {
    id: 'os-role',
    emoji: '🪟',
    shortTitle: 'Operating System Role',
    title: 'The Operating System: Human-Computer Bridge',
    category: 'files',
    grade: 'g5',
    tag: 'Operating Systems',
    bookPage: '22-23',
    content: 'The OS (Windows, macOS, Linux, Android) is the fundamental software orchestrating hardware components, filesystem hierarchies, and offering a user-friendly graphical interface (GUI).',
    proTip: 'Modern operating systems are multitasking: they can play music, stream tutorials, and keep open text editors simultaneously without stuttering!',
    didYouKnow: 'Before graphical user interfaces, users typed command lines on a monochrome terminal screen (such as MS-DOS).',
  },
  {
    id: 'desktop-taskbar',
    emoji: '🖥️',
    shortTitle: 'Desktop & Taskbar',
    title: 'Workspace Desktop & Taskbar Anatomy',
    category: 'files',
    grade: 'g5',
    tag: 'Graphical User Interface',
    bookPage: '23-24',
    content: 'The Desktop displays shortcuts and wallpaper. At the bottom lies the Taskbar with the Start button, pinned app icons, and Notification Area (clock, volume, network).',
    proTip: 'Pressing `Windows + D` instantly minimizes all windows, revealing your clean desktop in a split second!',
    didYouKnow: 'The notification tray is often called the "System Tray" and hosts silent background services like antivirus monitoring.',
  },
  {
    id: 'ferestre-os',
    emoji: '🔲',
    shortTitle: 'Window Controls',
    title: 'Window Layout & Management Controls',
    category: 'files',
    grade: 'g5',
    tag: 'GUI Navigation',
    bookPage: '24',
    content: 'Every program runs inside a window. In the top-right corner, three standard buttons control state: Minimize (_), Maximize/Restore (□), and Close (X / Alt+F4).',
    proTip: 'Press `Alt + Tab` to cycle instantly through all open windows without ever touching your mouse!',
    didYouKnow: 'Dragging a window to the screen edge triggers Windows Snap, organizing two tasks side-by-side on split screen.',
  },
  {
    id: 'cautare-masca',
    emoji: '🔎',
    shortTitle: 'Search Wildcards (* and ?)',
    title: 'Searching Files with Wildcard Masks',
    category: 'files',
    grade: 'g5',
    tag: 'Search & Organization',
    bookPage: '29',
    content: 'Wildcards help locate items with partial names: `*` substitutes any sequence of characters (e.g. `*.docx`), while `?` replaces exactly one character (e.g. `test?.txt`).',
    proTip: 'Typing `project*.*` in the File Explorer search box finds all files whose names begin with "project", across all file types!',
    didYouKnow: 'Windows search indexes file text beforehand, enabling you to locate an essay simply by searching a unique sentence within it.',
  },
  {
    id: 'folder-tree',
    emoji: '🌳',
    shortTitle: 'Folder Tree Hierarchy',
    title: 'Hierarchical Folder Directory Architecture',
    category: 'files',
    grade: 'g5',
    tag: 'Operating Systems',
    bookPage: '27-28',
    content: 'Files are structured in a hierarchical tree. The Root is the drive `C:\\`, which branches into parent folders and subfolders, with files as leaves.',
    proTip: 'An absolute path gives the full address: `C:\\School\\ICT\\Project.docx`. With this address, the OS accesses the file immediately.',
    didYouKnow: 'A folder is actually a specialized directory file on disk that contains pointers to other files and subdirectories.',
  },
  {
    id: 'forbidden-chars',
    emoji: '🚫',
    shortTitle: 'Forbidden Filename Chars',
    title: 'The 9 Forbidden Characters in File Names',
    category: 'files',
    grade: 'g5',
    tag: 'File Management Rules',
    bookPage: '28',
    content: 'In Windows, filenames cannot contain any of these 9 characters: \\ / : * ? " < > |. The system automatically blocks them if typed.',
    proTip: 'Why are they forbidden? Because the OS reserves them internally for paths (`\\`, `/`), wildcards (`*`, `?`), and data redirection (`<`, `>`).',
    didYouKnow: 'Filenames can have up to 255 characters, but keeping them concise, descriptive, and clean avoids compatibility issues.',
  },
  {
    id: 'file-extensions',
    emoji: '🏷️',
    shortTitle: 'File Extensions',
    title: 'File Extensions & Program Associations',
    category: 'files',
    grade: 'g5',
    tag: 'File Types & Formats',
    bookPage: '28-29',
    content: 'The file extension is a 3-4 letter suffix after the period (e.g., `.docx`, `.xlsx`, `.pptx`, `.png`, `.mp3`, `.mp4`, `.exe`). It identifies the file format and tells Windows which app to launch.',
    proTip: 'Be cautious with `.exe`, `.bat`, or `.vbs` files received from unknown senders: these are executable scripts that can run commands on your machine.',
    didYouKnow: 'Renaming `Photo.png` to `Photo.txt` won’t destroy the image data, but Notepad will open it as unreadable binary text gibberish!',
  },
  {
    id: 'shortcuts-keys',
    emoji: '⌨️',
    shortTitle: 'Keyboard Shortcuts',
    title: 'Essential Productivity Keyboard Shortcuts',
    category: 'files',
    grade: 'g5',
    tag: 'Workflow Efficiency',
    bookPage: '29-30',
    content: 'Mastering keyboard shortcuts boosts speed significantly: `Ctrl+C` (Copy), `Ctrl+X` (Cut/Move), `Ctrl+V` (Paste), `Ctrl+Z` (Undo), `Ctrl+A` (Select All), `F2` (Rename), and `Del` (Delete).',
    proTip: 'Pressing `Shift + Delete` permanently removes a file immediately, bypassing the Recycle Bin. Use it carefully!',
    didYouKnow: 'The `Ctrl+C` and `Ctrl+V` commands were invented by Larry Tesler at Xerox PARC in the 1970s and became the universal computer standard.',
  },
  {
    id: 'recycle-bin',
    emoji: '🗑️',
    shortTitle: 'Recycle Bin',
    title: 'Recycle Bin: File Safety & Instant Restoration',
    category: 'files',
    grade: 'g5',
    tag: 'Data Safety',
    bookPage: '30',
    content: 'When pressing Delete on hard drive files, they are safely relocated to the Recycle Bin. Right-clicking and selecting `Restore` puts the file back in its exact original folder.',
    proTip: 'Files deleted from USB flash drives do NOT go into the Recycle Bin; they are erased immediately. Always keep backups!',
    didYouKnow: 'Until you execute "Empty Recycle Bin", deleted items continue to occupy real disk storage on your drive.',
  },

  // MODULE 3 - INTERNET & DIGITAL CITIZENSHIP
  {
    id: 'search-operators',
    emoji: '🔍',
    shortTitle: 'Search Operators',
    title: 'Smart Search with Quotes & site: Filters',
    category: 'internet',
    grade: 'g5',
    tag: 'Web Exploration',
    bookPage: '38-40',
    content: 'Use quotation marks `""` to search for exact phrases. Use `site:edu.ro` to restrict results to educational sites, and `filetype:pdf` to download official PDF documents.',
    proTip: 'To search for jaguar the animal and exclude the luxury car brand, enter: `jaguar -car` or `jaguar -auto`!',
    didYouKnow: 'Google indexes over 50 billion web pages and returns search results in less than 0.2 seconds using massive server clusters.',
  },
  {
    id: 'email-bcc',
    emoji: '✉️',
    shortTitle: 'Email: To vs Cc vs Bcc',
    title: 'Email Addressing & Privacy Etiquette',
    category: 'internet',
    grade: 'g5',
    tag: 'Secure Communication',
    bookPage: '42-44',
    content: '`To` is for primary recipients; `Cc` (Carbon Copy) is for informational copies; `Bcc` (Blind Carbon Copy) hides all recipient email addresses from each other.',
    proTip: 'When emailing large groups or classmates, place addresses in `Bcc:` to preserve everyone’s personal privacy!',
    didYouKnow: 'The `@` symbol was chosen by Ray Tomlinson in 1971 to separate the user mailbox name from the destination host computer.',
  },

  // MODULE 4 - ALGORITHMS & SCRATCH
  {
    id: 'algo-proprieties',
    emoji: '🧩',
    shortTitle: 'Algorithm Properties',
    title: 'The 4 Fundamental Properties of an Algorithm',
    category: 'algorithms',
    grade: 'g5',
    tag: 'Algorithmic Thinking',
    bookPage: '56-58',
    content: 'An algorithm is an ordered sequence of unambiguous instructions. It must have 4 core properties: Precision/Clarity, Finiteness (terminates in finite steps), Generality (solves a class of inputs), and Efficiency.',
    proTip: 'A baking recipe or Lego instruction guide are everyday physical world examples of algorithms!',
    didYouKnow: 'The word "Algorithm" derives from the 9th-century Persian mathematician Muhammad ibn Musa al-Khwarizmi.',
  },
  {
    id: 'scratch-xy-coords',
    emoji: '🐱',
    shortTitle: 'Scratch X & Y Coordinates',
    title: 'The Scratch Stage: 480 x 360 Cartesian Grid',
    category: 'scratch',
    grade: 'g5',
    tag: 'Visual Coding',
    bookPage: '68-70',
    content: 'The Scratch stage spans 480 pixels wide by 360 pixels high. Center is (0, 0). X extends from -240 (left) to +240 (right), and Y from -180 (bottom) to +180 (top).',
    proTip: 'Always reset your sprite to `go to x: 0 y: 0` inside the green-flag event block so it starts predictably every run!',
    didYouKnow: 'Scratch was created by the Lifelong Kindergarten Group at the MIT Media Lab and is enjoyed by over 100 million students worldwide.',
  },

  // GRADE 6 - PRESENTATIONS & DESIGN
  {
    id: 'regula-6x6',
    emoji: '📊',
    shortTitle: 'The 6 x 6 Golden Rule',
    title: 'Slide Design: The 6x6 Rule & Visual Contrast',
    category: 'presentation',
    grade: 'g6',
    tag: 'Slide Decks',
    bookPage: '14-16',
    content: 'Top presentation designers use the 6x6 rule: no more than 6 bullet lines per slide, and at most 6 words per line. Slides are visual aids for the speaker, not a transcript to be read verbatim.',
    proTip: 'Keep high contrast between text and background. Limit your color palette to 2-3 theme colors and no more than 2 distinct fonts per presentation!',
    didYouKnow: 'Pressing F5 starts slideshow playback from slide 1, while Shift + F5 launches from whichever slide is currently active in your editor.',
  },
  {
    id: 'slide-animations',
    emoji: '🎬',
    shortTitle: 'Transitions vs Animations',
    title: 'Transitions vs Object Animations',
    category: 'presentation',
    grade: 'g6',
    tag: 'Slide Decks',
    bookPage: '18-20',
    content: 'A transition is the visual effect that occurs between two whole slides as you turn pages. An animation applies to an individual element inside a slide (such as a headline, picture, or icon).',
    proTip: 'Opt for subtle transitions (Fade, Push) lasting 0.5-1.0s. Overly flashy or noisy animations distract listeners from your core message!',
    didYouKnow: 'Audiences form their initial impression of a speaker in the first 7 seconds: upright posture, a smile, and eye contact set a confident tone.',
  },

  // GRADE 6 - 3D GRAPHICS & MODELING
  {
    id: 'paint3d-axes',
    emoji: '🧊',
    shortTitle: 'Z-Axis & 3D Space',
    title: '3D Graphics: X, Y Axes and the Third Dimension (Z)',
    category: 'model3d',
    grade: 'g6',
    tag: '3D Modeling & Paint 3D',
    bookPage: '28-30',
    content: '2D graphics only use Width (X) and Height (Y). Paint 3D introduces the Z-axis (Depth), placing geometric volumes closer or farther from the camera viewpoint in space.',
    proTip: 'A 3D model can be rotated across 3 distinct circular gizmos (Roll, Pitch, Yaw) to inspect it from front, profile, rear, or overhead views!',
    didYouKnow: 'Virtual Reality (VR) headsets display two slightly offset images—one per eye—fooling our brains into perceiving authentic spatial 3D depth.',
  },

  // GRADE 6 - MALWARE & CYBERSECURITY
  {
    id: 'malware-types',
    emoji: '🦠',
    shortTitle: 'Viruses, Worms & Trojans',
    title: 'Malware Taxonomy: Virus vs Worm vs Trojan Horse',
    category: 'malware',
    grade: 'g6',
    tag: 'Cybersecurity',
    bookPage: '44-46',
    content: 'Malware stands for "Malicious Software". A Virus requires a host program to infect. A Worm self-replicates through networks automatically. A Trojan masquerades as legitimate software or games to deceive users.',
    proTip: 'Ransomware is dangerous: it encrypts personal documents and demands ransom money. Your best defense is a regular offline backup on an external hard drive!',
    didYouKnow: 'The earliest recognized computer virus was named "Creeper" (1971) which harmlessly displayed: "I\'m the creeper, catch me if you can!".',
  },
  {
    id: 'antivirus-firewall',
    emoji: '🛡️',
    shortTitle: 'Antivirus vs Firewall',
    title: 'The 3 Pillars of Defense: Antivirus, Quarantine & Firewall',
    category: 'malware',
    grade: 'g6',
    tag: 'Digital Protection',
    bookPage: '46-48',
    content: 'The Firewall acts as a network bouncer checking incoming and outgoing traffic. The Antivirus scans disk files against signature databases. Suspicious files are safely isolated in Quarantine.',
    proTip: 'Never install two active antiviruses on the same computer: they will conflict and freeze your system! Stick to one reputable suite updated daily.',
    didYouKnow: 'A 12-character password mixing uppercase, lowercase, numbers, and symbols (e.g. `#ArkyTIC!2026`) would take centuries for a typical cracker rig to brute-force!',
  },
];

export const KnowledgePills: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedPillId, setSelectedPillId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeGradeFilter, setActiveGradeFilter] = useState<'all' | 'g5' | 'g6'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pills = lang === 'en' ? PILLS_EN : PILLS_RO;

  const filteredPills = pills.filter((pill) => {
    const matchesCategory = activeCategory === 'all' || pill.category === activeCategory;
    const matchesGrade = activeGradeFilter === 'all' || (pill.grade || 'g5') === activeGradeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      pill.title.toLowerCase().includes(query) ||
      pill.shortTitle.toLowerCase().includes(query) ||
      pill.tag.toLowerCase().includes(query) ||
      pill.content.toLowerCase().includes(query);
    return matchesCategory && matchesGrade && matchesQuery;
  });

  const selectedPill = pills.find((p) => p.id === selectedPillId) || null;

  const handleOpenPill = (pillId: string) => {
    sounds.playClick();
    setSelectedPillId(pillId);
  };

  const handleClose = () => {
    sounds.playClick();
    setSelectedPillId(null);
  };

  const categories = [
    { id: 'all', labelRo: `Toate (${pills.length})`, labelEn: `All (${pills.length})` },
    { id: 'hardware', labelRo: 'Hardware (V) 💻', labelEn: 'Hardware (G5) 💻' },
    { id: 'files', labelRo: 'Fișiere & SO (V) 📁', labelEn: 'Files & OS (G5) 📁' },
    { id: 'internet', labelRo: 'Internet (V) 🌐', labelEn: 'Internet (G5) 🌐' },
    { id: 'algorithms', labelRo: 'Algoritmi (V) 🧩', labelEn: 'Algorithms (G5) 🧩' },
    { id: 'scratch', labelRo: 'Scratch (V) 🐱', labelEn: 'Scratch (G5) 🐱' },
    { id: 'presentation', labelRo: 'Prezentări (VI) 📊', labelEn: 'Presentations (G6) 📊' },
    { id: 'model3d', labelRo: 'Paint 3D (VI) 🧊', labelEn: 'Paint 3D (G6) 🧊' },
    { id: 'malware', labelRo: 'Malware & Securitate (VI) 🛡️', labelEn: 'Malware & Security (G6) 🛡️' },
  ];

  return (
    <div className="bg-slate-900/90 border-2 border-teal-500/40 rounded-3xl p-3.5 sm:p-5 mb-6 shadow-2xl backdrop-blur">
      {/* Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/80">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-md shrink-0 mt-0.5 sm:mt-0">
            <Lightbulb className="w-4 h-4 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-black uppercase tracking-wider text-cyan-300 font-heading">
                {lang === 'en' ? 'Interactive Knowledge Pills & Didactic Notes' : 'Pilule Interactive de Cunoștințe & Sinteze Didactice'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40 font-mono">
                {pills.length} {lang === 'en' ? 'Pills' : 'Pilule'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {lang === 'en'
                ? 'Official curriculum summaries, pro tips & textbook insights for Grade 5 & Grade 6'
                : 'Sinteze din manualul de TIC, sfaturi de la profesori și curiozități practice pentru Clasa a V-a și a VI-a'}
            </p>
          </div>
        </div>

        {/* Grade switch pills */}
        <div className="flex items-center gap-1.5 self-start lg:self-auto bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveGradeFilter('all');
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              activeGradeFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'en' ? 'All Classes' : 'Toate Clasele'}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveGradeFilter('g5');
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              activeGradeFilter === 'g5'
                ? 'bg-emerald-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'en' ? 'Grade 5 (V)' : 'Clasa a V-a'}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveGradeFilter('g6');
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              activeGradeFilter === 'g6'
                ? 'bg-purple-500 text-white font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'en' ? 'Grade 6 (VI)' : 'Clasa a VI-a'}
          </button>
        </div>
      </div>

      {/* Category Horizontal Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sounds.playClick();
              setActiveCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 border cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 border-cyan-400 shadow-md font-black'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
            }`}
          >
            {lang === 'en' ? cat.labelEn : cat.labelRo}
          </button>
        ))}
      </div>

      {/* Pill Buttons Responsive Scrolling Flow */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-thin">
        {filteredPills.map((pill) => {
          const isActive = selectedPill?.id === pill.id;
          const isG6 = pill.grade === 'g6';
          return (
            <button
              key={pill.id}
              onClick={() => handleOpenPill(pill.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 shrink-0 border cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/30 to-teal-500/30 text-cyan-200 border-cyan-400 shadow-lg ring-1 ring-cyan-400'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <span className="text-xl shrink-0">{pill.emoji}</span>
              <div className="text-left">
                <div className="font-bold leading-tight flex items-center gap-1.5">
                  <span className="whitespace-nowrap">{pill.shortTitle}</span>
                  {isG6 && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-mono font-black shrink-0">
                      VI
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                  <span className="truncate max-w-[130px]">{pill.tag}</span>
                  <span className="shrink-0">•</span>
                  <span className="shrink-0">p. {pill.bookPage}</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-0.5" />
            </button>
          );
        })}
      </div>

      {/* Pop-out Expanded Fact Card */}
      {selectedPill && (
        <div className="mt-4 pt-4 border-t border-slate-700/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-950/95 border-2 border-cyan-500/50 rounded-2xl p-4 sm:p-6 relative shadow-2xl">
            <button
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title={t.pillClose}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start sm:items-center gap-3 mb-2.5 pr-8">
              <span className="text-3xl sm:text-4xl shrink-0">{selectedPill.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/40 font-mono">
                    {selectedPill.tag}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border font-mono ${
                    selectedPill.grade === 'g6'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {selectedPill.grade === 'g6' ? (lang === 'en' ? 'Grade 6 (VI)' : 'Clasa a VI-a') : (lang === 'en' ? 'Grade 5 (V)' : 'Clasa a V-a')}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 font-mono">
                    {t.bookPagePrefix} {selectedPill.bookPage}
                  </span>
                </div>
                <h4 className="text-base sm:text-xl font-black text-white font-heading break-words">
                  {selectedPill.title}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed my-3 bg-slate-900/70 p-3.5 sm:p-4 rounded-xl border border-slate-800">
              {selectedPill.content}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl flex items-start gap-2.5 text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block mb-0.5">
                    {lang === 'en' ? 'Teacher Pro Tip:' : 'Sfatul Profesorului:'}
                  </strong>
                  <span className="leading-relaxed">{selectedPill.proTip}</span>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl flex items-start gap-2.5 text-emerald-200">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 font-bold block mb-0.5">
                    {lang === 'en' ? 'Did you know? (Textbook):' : 'Știați că? (Manual TIC):'}
                  </strong>
                  <span className="leading-relaxed">{selectedPill.didYouKnow}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
