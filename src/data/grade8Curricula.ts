import { CurriculaModule } from './curriculaData';

export const GRADE_8_CURRICULA_MODULES: CurriculaModule[] = [
  // ==================== UNITATEA 1: CALCUL TABELAR ====================
  {
    id: 'g8_calc_a',
    slug: 'excel-introducere-interfata-registru',
    title: 'Utilizarea Foilor de Calcul Tabelar & Interfața MS Excel',
    shortTitle: 'Interfață Excel & Registru de Calcul',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 1: Calcul tabelar (pag. 12–20)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '📊',
    color: 'from-emerald-600 to-teal-700',
    metaDescription: 'Ghid complet TIC Clasa a 8-a: Foi de calcul electronice, registrul de lucru Excel, anatomia panglicii Ribbon, adrese de celule și operații fundamentale.',
    keywords: [
      'calcul tabelar clasa 8',
      'ms excel interfata ribbon',
      'registru de calcul foi de lucru',
      'adresa de celula nume box',
      'operatii de baza excel'
    ],
    competencies: [
      {
        code: '1.1',
        description: 'Utilizarea foilor de calcul tabelar în vederea rezolvării unor situații problemă simple din activitatea școlară și cotidiană.'
      },
      {
        code: '3.1',
        description: 'Elaborarea de produse informatice utilizând aplicații de calcul tabelar, respectând normele de structurare a datelor.'
      }
    ],
    theorySections: [
      {
        title: 'Ce sunt Foile de Calcul Electronice și de ce sunt Esențiale?',
        content: [
          'Noțiunea de foaie de calcul (spreadsheet) își are originea în contabilitate, unde se utilizau foi de hârtie de mari dimensiuni, liniate orizontal și vertical sub formă de tabel.',
          'Apariția calculatorului a adus o revoluție majoră: posibilitatea introducerii de formule de calcul automate care se recalculează instantaneu la modificarea oricărei valori de intrare.',
          'Exemplu practic din manual: Un tabel cu 15 materii școlare și mediile aferente. Dacă nota la geografie se schimbă de la 7 la 9, media materiei și media generală se actualizează automat fără niciun calcul manual!',
          'Aplicații celebre de calcul tabelar: Microsoft Excel (Microsoft 365, Desktop și Excel Online), LibreOffice Calc (gratuit, open-source), OpenOffice Calc, WPS Spreadsheets, Ashampoo PlanMaker și Google Sheets (colaborare în cloud direct din browser).'
        ],
        tips: 'Avantajul cloud (Google Sheets sau Excel Online): documentul se salvează automat la fiecare tastă apăsată și poate fi editat simultan de toți colegii de echipă!'
      },
      {
        title: 'Structura Registrului și Interfața MS Excel',
        content: [
          'Un fișier creat în Excel se numește Registru de calcul (Workbook) și poate avea extensiile: .xlsx (standard modern), .xls (format legacy) sau .xlsm (cu macrouri).',
          'Un registru este alcătuit din una sau mai multe Foi de calcul (Worksheets). O foaie conține dinamic până la 1.048.576 rânduri (numerotate 1, 2, 3...) și 16.384 coloane (etichetate A, B, ... Z, AA..XFD).',
          'Unitatea de bază este Celula, aflată la intersecția dintre o coloană și un rând (ex: B2, A14).',
          'O Zonă de celule (domeniu) reprezintă un grup compact de celule adiacente, adresat prin colțul stânga-sus și dreapta-jos despărțite prin două puncte (ex: D1:E2, G2:I2).',
          'Elementele cheie ale ferestrei: Bara de Titlu (Quick Access, Search, Cont), Panglica Ribbon cu moduri de afișare (Auto-hide, Show Tabs, Show Tabs & Commands), Caseta de Nume (Name Box — afișează celula activă), Bara de Formule (Formula Bar), Zona de Lucru (grila), Etichetele foilor (Foaie1, Foaie2), butoane de vizualizare (Normal, Page Layout, Page Break Preview) și Zoom slider.'
        ],
        tips: 'Dublu-click pe linia dintre două etichete de coloană (de ex. între A și B) ajustează automat lățimea coloanei la cel mai lung text conținut!'
      },
      {
        title: 'Operații Principale cu Registrul și Foile de Calcul',
        content: [
          'Operații registru: Creare registru nou (Ctrl+N), Deschidere (Ctrl+O), Salvare (Ctrl+S), Salvare Ca (Save As — schimbare nume/locație sau salvare pe OneDrive), Imprimare (Ctrl+P / export PDF).',
          'Operații pe celule: selectare domeniu, copiere (Ctrl+C), lipire (Ctrl+V), decupare/mutare (Ctrl+X) și ștergere (tasta Delete).',
          'Operații cu foi: dublu-click pe etichetă pentru redenumire (ex: „Tabla cu 6”), adăugare foaie nouă prin butonul „+”, reordonare foi prin drag & drop și ștergere foaie prin click dreapta -> Ștergere.'
        ],
        tips: 'Folosește Ctrl+S frecvent când lucrezi pe calculator local pentru a preveni pierderea datelor în caz de pană de curent!'
      }
    ],
    keyTerms: [
      { term: 'Registru de calcul (Workbook)', definition: 'Fișierul principal de lucru în Excel (.xlsx) care conține una sau mai multe foi de calcul interconectate.' },
      { term: 'Foaie de calcul (Worksheet)', definition: 'O grilă uriașă de rânduri numerotate și coloane etichetate cu litere în care se introduc date și formule.' },
      { term: 'Celulă & Adresă', definition: 'Unitatea elementară de stocare identificată prin litera coloanei și numărul rândului (ex: B2).' },
      { term: 'Zonă de celule (Range)', definition: 'Un bloc dreptunghiular de celule adiacente adresat prin două puncte, de exemplu A1:C10.' },
      { term: 'Bara de formule (Formula Bar)', definition: 'Bara superioară în care se vizualizează și se editează conținutul exact sau formula celulei selectate.' }
    ],
    shortcuts: [
      { key: 'Ctrl + N', action: 'Creează un registru nou de calcul necompletat' },
      { key: 'Ctrl + O', action: 'Deschide un registru de calcul existent' },
      { key: 'Ctrl + S', action: 'Salvează modificările aduse registrului curent' },
      { key: 'Ctrl + P', action: 'Deschide meniul de imprimare sau export PDF' },
      { key: 'Ctrl + F1', action: 'Ascunde sau afișează panglica Ribbon cu butoane' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Explorarea interfeței și identificarea celulelor',
        task: 'Deschide un registru nou, poziționează-te pe celula B2, observă Name Box-ul și introdu textul „Catalog Clasa a VIII-a”.'
      },
      {
        step: 2,
        title: 'Crearea Tabelei cu Tabla Înmulțirii cu 6',
        task: 'Pe coloana A scrie numerele de la 1 la 10, pe coloana B cifra 6 repetată, iar pe coloana C calculează produsele. Redenumește foaia în „Tabla cu 6”.'
      },
      {
        step: 3,
        title: 'Gestionarea foilor multiple',
        task: 'Apasă butonul „+” pentru a adăuga o nouă foaie, redenumește-o în „Statistici Sport”, apoi mut-o prin drag & drop înaintea primei foi.'
      }
    ],
    faq: [
      {
        question: 'Care este diferența dintre Salvare și Salvare Ca (Save As)?',
        answer: 'Salvare (Ctrl+S) actualizează fișierul curent pe disc fără a cere un nume nou. Salvare Ca (Save As) permite alegerea unei noi locații, a unui nou nume de fișier sau a unui format diferit (cum ar fi PDF sau CSV).'
      },
      {
        question: 'Câte rânduri și coloane poate avea o foaie Excel modernă?',
        answer: 'O foaie Excel (.xlsx) suportă până la 1.048.576 rânduri și 16.384 coloane (de la A până la XFD).'
      }
    ],
    testQuestions: [
      {
        question: 'Ce este o celulă într-o foaie de calcul Excel?',
        options: [
          'Un desen geometric inserat pe fundal',
          'Intersecția dintre o coloană și un rând din tabel',
          'Numele fișierului salvat pe hard disk',
          'Bara de derulare verticală'
        ],
        correctIndex: 1,
        explanation: 'Celula reprezintă unitatea de bază adresabilă, formată la intersecția unei coloane (literă) cu un rând (număr).'
      },
      {
        question: 'Cum se adresează o zonă compactă de celule care începe în D1 și se termină în E2?',
        options: [
          'D1-E2',
          'D1..E2',
          'D1:E2',
          'D1 & E2'
        ],
        correctIndex: 2,
        explanation: 'În calculul tabelar, coordonatele colțurilor unei zone se separă întotdeauna prin caracterul două puncte (:).'
      },
      {
        question: 'Ce extensie are în mod standard un registru creat în Microsoft Excel?',
        options: [
          '.docx',
          '.xlsx',
          '.mp4',
          '.pptx'
        ],
        correctIndex: 1,
        explanation: 'Extensia specifică foilor de calcul Excel este .xlsx (sau .xls pentru versiunile mai vechi).'
      }
    ]
  },

  {
    id: 'g8_calc_b',
    slug: 'excel-formatare-tipuri-date-sortare',
    title: 'Formatarea Registrului, Tipuri de Date & Sortare Multicriterială',
    shortTitle: 'Formatare Celule, Autofill & Sortare',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 1: Calcul tabelar (pag. 21–25)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '🎨',
    color: 'from-teal-600 to-cyan-700',
    metaDescription: 'Lecție completă formatare Excel: stiluri de celule, borduri, aliniere text, Wrap Text, Merge Cells, formate numerice/monedă/dată, Autofill și sortare pe niveluri multiple.',
    keywords: [
      'formatare celule excel',
      'tipuri de date numeric moneda data',
      'autofill serii crescatoare',
      'sortare multicriteriala excel',
      'merge cells wrap text'
    ],
    competencies: [
      {
        code: '1.1',
        description: 'Formatarea conținutului celulelor și organizarea datelor tabelare pe criterii multiple.'
      },
      {
        code: '3.1',
        description: 'Realizarea de tabele estetice, cu borduri conforme, îmbinări de celule și serii de date automatizate.'
      }
    ],
    theorySections: [
      {
        title: 'Formatarea Rândurilor, Coloanelor și a Celulelor',
        content: [
          'Ajustarea dimensiunilor: lățimea unei coloane se modifică trăgând de linia despărțitoare din antet (cursorul devine o linie verticală cu două săgeți orizontale). Înălțimea rândului se reglează analog pe numerele de rând.',
          'Formatarea caracterelor: font, dimensiune, stil aldin (Bold), cursiv (Italic), subliniat (Underline), culori de text și culoare de umplere (Fill Color).',
          'Borduri profesionale: din fila Home > Font > Borduri, se pot aplica contururi exterioare duble (Thick/Double Border) și linii punctate sau subțiri pentru interiorul tabelului.',
          'Fereastra Format Cells (click dreapta > Formatare celule):',
          '• Aliniere (Alignment): orizontală (stânga, centru, dreapta), verticală (sus, centru, jos).',
          '• Încadrare text (Wrap Text): împarte textul lung pe mai multe rânduri în aceeași celulă.',
          '• Potrivire prin reducere (Shrink to Fit): micșorează automat mărimea caracterelor pentru a încăpea perfect.',
          '• Îmbinare celule (Merge Cells / Merge & Center): combină mai multe celule alăturate într-o singură celulă mare, ideală pentru titluri de secțiune.',
          '• Orientare text: rotirea textului la un unghi specificat în grade (vertical sau oblic).'
        ],
        tips: 'Folosește butonul „Merge & Center” din fila Home pentru a centra impecabil titlul unui tabel deasupra tuturor coloanelor!'
      },
      {
        title: 'Tipuri de Date în Celulele Excel',
        content: [
          'Configurarea tipului corect de date este vitală pentru calcule corecte:',
          '1. General: formatul implicit, afișează numere sau text exact cum sunt introduse.',
          '2. Număr (Number): permite setarea separatorului de mii (ex: 1.000.000) și a numărului fix de zecimale (ex: 2 zecimale -> 14.50).',
          '3. Monedă (Currency / Accounting): asociază automat simbolul monetar dorit (RON, EUR, USD, GBP).',
          '4. Dată calendaristică & Oră (Date & Time): permite efectuarea de operații de scădere între date sau ore (ex: 14:55 – 13:30 = 1:25).',
          '5. Procent (Percentage): transformă valoarea 0.19 în 19%.',
          '6. Fracție (Fraction): introduce valoarea 5.5 și afișează automat „5 1/2”.',
          '7. Text: tratează orice secvență ca șir de caractere (inclusiv numere care încep cu 0, cum ar fi codurile poștale sau CNP-ul).'
        ],
        tips: 'Dacă introduci un CNP sau număr de telefon în Excel, formatează celula ca Text înainte de tastare pentru a nu pierde prima cifră zero!'
      },
      {
        title: 'Autofill (Completare Automată) & Sortare pe Criterii Multiple',
        content: [
          'Autofill (mânerul de umplere): poziționarea cursorului pe pătrățica din colțul dreapta-jos al celulei active.',
          '• Tragerea simplă pe coloană copiază conținutul sau adaptează formulele.',
          '• Tragerea ținând apăsată tasta Ctrl generează o serie de numere crescătoare (1, 2, 3, 4...).',
          'Sortarea pe criterii multiple (fila Date > Sortare):',
          '• Când două sau mai multe rânduri au valori identice la primul criteriu (de exemplu, mai mulți elevi au aceeași medie sau același timp la TV), este necesar un al doilea criteriu de departajare.',
          '• În caseta Sort se adaugă un nivel nou (*Add Level* -> *Then by*), de exemplu: Sortare după Coloana B (timp descrescător), Apoi după Coloana A (nume alfabetic de la A la Z).'
        ],
        tips: 'La sortare, asigură-te că selectezi tot tabelul sau ești poziționat în interiorul lui, altfel riști să sortezi doar o coloană și să amesteci datele elevilor!'
      }
    ],
    keyTerms: [
      { term: 'Autofill', definition: 'Funcția Excel de replicare inteligentă a valorilor sau seriilor de date prin tragerea colțului dreapta-jos al celulei.' },
      { term: 'Wrap Text (Încadrare text)', definition: 'Afișarea textului pe mai multe rânduri în cadrul aceleiași celule atunci când depășește lățimea coloanei.' },
      { term: 'Merge Cells (Îmbinare celule)', definition: 'Combinarea a două sau mai multe celule adiacente selectate într-o singură celulă mare comună.' },
      { term: 'Sortare multicriterială', definition: 'Ordonarea înregistrărilor din tabel după două sau mai multe coloane succesive (criteriu principal și criteriu de departajare).' }
    ],
    shortcuts: [
      { key: 'Ctrl + 1', action: 'Deschide caseta avansată Format Cells (Formatare celule)' },
      { key: 'Ctrl + B', action: 'Aplică sau elimină stilul Aldin (Bold) pe celulele selectate' },
      { key: 'Ctrl + I', action: 'Aplică sau elimină stilul Cursiv (Italic) pe text' },
      { key: 'Ctrl + Tragere', action: 'Generează serie automată crescătoare prin Autofill' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Formatarea tabelului „Timp la televizor”',
        task: 'Construiește un tabel cu 7 zile ale săptămânii și 10 colegi. Îmbină celulele pentru titlu, colorează antetul în portocaliu și aplică borduri duble exterioare.'
      },
      {
        step: 2,
        title: 'Formatare numerică și monetară',
        task: 'Formatează o coloană cu prețuri în moneda „RON” cu două zecimale și o coloană de procente cu simbolul „%”.'
      },
      {
        step: 3,
        title: 'Sortare după două criterii',
        task: 'Sortează tabelul descrescător după minutele de luni, iar în caz de egalitate ordonează alfabetic după numele elevului.'
      }
    ],
    faq: [
      {
        question: 'Cum introduc o fracție în Excel fără să fie interpretată ca dată calendaristică?',
        answer: 'Fie formatezi celula ca Fracție (Fraction), fie introduci întâi un zero urmat de spațiu și fracție (ex: „0 1/2”).'
      },
      {
        question: 'Ce se întâmplă dacă într-o celulă apar semnele „######”?',
        answer: 'Semnul „###” înseamnă că numărul este prea mare sau are prea multe zecimale pentru lățimea actuală a coloanei. Mărește lățimea coloanei prin dublu-click pe antet.'
      }
    ],
    testQuestions: [
      {
        question: 'Ce opțiune de formatare permite afișarea unui text lung pe mai multe rânduri în aceeași celulă?',
        options: [
          'Merge Cells',
          'Wrap Text (Încadrare text)',
          'Shrink to Fit',
          'Orientation 90°'
        ],
        correctIndex: 1,
        explanation: 'Wrap Text (Încadrare text) ajustează automat înălțimea rândului și rupe textul pe mai multe rânduri vizibile.'
      },
      {
        question: 'Cum putem genera rapid seria 1, 2, 3, 4, 5... dintr-o celulă care conține cifra 1?',
        options: [
          'Scriem manual fiecare număr pe rând',
          'Tragem de colțul celulei ținând apăsată tasta Ctrl',
          'Apăsăm combinația Alt+F4',
          'Folosim comanda Clear Contents'
        ],
        correctIndex: 1,
        explanation: 'Tragerea mânerului de Autofill cu tasta Ctrl apăsată generează automat o serie crescătoare de valori întregi.'
      },
      {
        question: 'Unde se găsește butonul de sortare avansată în Excel?',
        options: [
          'În fila Desenare (Draw)',
          'În fila Date (Data), grupul Sortare și Filtrare',
          'În fila Vizualizare (View)',
          'În fila Ajutor (Help)'
        ],
        correctIndex: 1,
        explanation: 'Comenzile de sortare și filtrare se găsesc pe panglică în fila Date (Data).'
      }
    ]
  },

  {
    id: 'g8_calc_c',
    slug: 'excel-formule-functii-matematice-decizie',
    title: 'Calcule Tabelare: Formule Aritmetice & Funcții (SUM, AVERAGE, MIN, MAX, IF, INT)',
    shortTitle: 'Formule & Funcții Specializate',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 1: Calcul tabelar (pag. 26–28)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '🧮',
    color: 'from-blue-600 to-cyan-600',
    metaDescription: 'Stăpânește formulele și funcțiile esențiale din Excel: operatori aritmetici, funcțiile SUM, AVERAGE, MIN, MAX, funcția decizională IF și funcția INT pentru rotunjire.',
    keywords: [
      'formule excel functia sum',
      'functia average medie aritmetica',
      'functia decizionala if excel',
      'functia int rotunjire',
      'calcule matematice fizica excel'
    ],
    competencies: [
      {
        code: '1.1',
        description: 'Utilizarea formulelor și a funcțiilor matematice/statistice în vederea rezolvării unor probleme concrete.'
      },
      {
        code: '3.1',
        description: 'Elaborarea de foi de calcul automatizate pentru bugete, calcule de prețuri cu TVA și probleme de fizică/matematică.'
      }
    ],
    theorySections: [
      {
        title: 'Sintaxa Formulelor și Operatorii Aritmetici',
        content: [
          'Regula absolută: În Excel, orice formulă de calcul începe obligatoriu cu semnul egal „=”. Dacă nu scrii semnul egal, programul tratează conținutul ca pe un text obișnuit!',
          'Operatori permiși: + (adunare), – (scădere), * (înmulțire), / (împărțire), ^ (ridicare la putere) și paranteze rotunde pentru stabilirea priorităților matematice.',
          'Referințe de celule: Este recomandat să folosim referințe (ex: =A1*B1) în loc de valori fixe (=1*6), deoarece dacă valoarea din A1 sau B1 se schimbă, rezultatul se recalculează instantaneu.',
          'Copierea adaptivă: Dacă formula din C1 este =A1*B1 și o tragem în jos prin Autofill în C2, formula devine automat =A2*B2 (referințe relative adaptate la noul rând).'
        ],
        tips: 'Verifică bara de formule (Formula Bar) pentru a vedea formula din spatele valorii numerice afișate pe ecran!'
      },
      {
        title: 'Funcțiile Statistice: SUM, AVERAGE, MIN, MAX',
        content: [
          '1. Funcția SUM: adună valori individuale, referințe sau domenii întregi.',
          '   Sintaxă: =SUM(număr1, [număr2], ...). Exemple: =SUM(A2:A10), =SUM(A2:A10, C2:C10), =SUM(A2, B3).',
          '2. Funcția AVERAGE: calculează media aritmetică a numerelor din domeniul specificat.',
          '   Sintaxă: =AVERAGE(domeniu). Exemplu: =AVERAGE(A2:A10).',
          '3. Funcția MAX: determină valoarea cea mai mare dintr-un set de date.',
          '   Sintaxă: =MAX(domeniu). Exemplu: =MAX(4, 99, 43) întoarce 99; =MAX(A2:A10).',
          '4. Funcția MIN: determină valoarea cea mai mică dintr-un set de date.',
          '   Sintaxă: =MIN(domeniu). Exemplu: =MIN(A2:A10).'
        ],
        tips: 'Poți selecta rapid un domeniu de numere și privi bara de stare (Status Bar) din josul ferestrei pentru a vedea instantaneu Media, Numărătoarea și Suma lor!'
      },
      {
        title: 'Funcția Decizională IF și Funcția INT',
        content: [
          'Funcția IF (DACĂ): permite evaluarea unei condiții logice și returnează un rezultat dacă e Adevărată și alt rezultat dacă e Falsă.',
          'Sintaxă: =IF(test_logic, valoare_dacă_adevărat, valoare_dacă_fals)',
          'Exemple practice din manual:',
          '• Verificare promovare: =IF(D4>=80, "PROMOVAT", "RESPINS")',
          '• Verificare buget: =IF(G2<=10000, "V-AȚI ÎNCADRAT ÎN BUGET", "BUGET DEPĂȘIT")',
          'Funcția INT: rotunjește prin lipsă un număr zecimal la cel mai apropiat întreg. Sintaxă: =INT(număr). Exemplu: =INT(3.44) dă 3.',
          'Verificarea divizibilității cu 3 folosind INT și IF: Dacă numărul împărțit la 3 este egal cu partea sa întreagă, atunci este divizibil: =IF(INT(A2/3) == A2/3, "DIVIZIBIL", "NEDIVIZIBIL").'
        ],
        tips: 'Textele din interiorul formulelor Excel (cum ar fi „PROMOVAT”) trebuie încadrate obligatoriu între ghilimele duble!'
      }
    ],
    keyTerms: [
      { term: 'Funcția SUM', definition: 'Funcție care însumează toate celulele dintr-un domeniu specificat.' },
      { term: 'Funcția AVERAGE', definition: 'Funcție care calculează media aritmetică a valorilor numerice selectate.' },
      { term: 'Funcția IF', definition: 'Funcție decizională logică ce returnează valori diferite în funcție de validitatea unei condiții testate.' },
      { term: 'Funcția INT', definition: 'Funcție matematică ce rotunjește prin lipsă un număr real la valoarea sa întreagă.' }
    ],
    shortcuts: [
      { key: 'Alt + =', action: 'Inserează automat funcția AutoSum pe coloana sau linia curentă' },
      { key: 'F4', action: 'Comută tipul referinței de celulă între relativă (A1) și absolută ($A$1)' },
      { key: 'Shift + F3', action: 'Deschide caseta de dialog pentru Inserare Funcție (Insert Function)' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Calculul mediei generale la școală',
        task: 'Creează un tabel cu notele la 5 materii. Calculează media fiecărei materii cu =AVERAGE() și media generală la finalul tabelului.'
      },
      {
        step: 2,
        title: 'Problemă practică de fizică: Viteza de scufundare a balenei',
        task: 'O balenă coboară la h = 3 km în t = 137 min. Convertește distanța în metri (=B1*1000) și timpul în secunde (=B4*60), apoi calculează viteza medie v = d/t (=B2/B5).'
      },
      {
        step: 3,
        title: 'Automatizarea deciziei cu funcția IF',
        task: 'Adaugă o coloană „Rezultat” în care aplici formula =IF(D2>=5, "Admis", "Respins") și colorează automat celulele în funcție de statut.'
      }
    ],
    faq: [
      {
        question: 'Ce eroare apare în Excel dacă împarți un număr la zero?',
        answer: 'Apare eroarea #DIV/0!, semnalând o operație matematică imposibilă (împărțire la zero sau la o celulă goală).'
      },
      {
        question: 'Putem combina funcții precum SUM și IF în aceeași formulă?',
        answer: 'Da, formulele pot fi compuse liber, de exemplu: =IF(SUM(B2:B10)>1000, "Depășit", "OK").'
      }
    ],
    testQuestions: [
      {
        question: 'Cu ce caracter trebuie să înceapă obligatoriu orice formulă în Excel?',
        options: [
          'Cu caracterul #',
          'Cu semnul =',
          'Cu caracterul @',
          'Cu semnul $'
        ],
        correctIndex: 1,
        explanation: 'Semnul egal (=) este indicatorul care anunță programul că urmează o expresie de calcul și nu un text simplu.'
      },
      {
        question: 'Care dintre următoarele formule calculează corect media celulelor C1, C2 și C3?',
        options: [
          '=MEDIA(C1:C3)',
          '=AVERAGE(C1:C3)',
          '=SUM(C1:C3)/2',
          '=AVG(C1..C3)'
        ],
        correctIndex: 1,
        explanation: 'Funcția oficială din Excel pentru media aritmetică este AVERAGE().'
      },
      {
        question: 'Ce rezultat returnează formula =IF(75>=80, "PROMOVAT", "RESPINS")?',
        options: [
          'PROMOVAT',
          'RESPINS',
          'TRUE',
          'Eroare #VALUE!'
        ],
        correctIndex: 1,
        explanation: 'Condiția 75 >= 80 este Falsă, prin urmare funcția returnează cel de-al doilea parametru, adică „RESPINS”.'
      }
    ]
  },

  {
    id: 'g8_calc_d',
    slug: 'excel-modalitati-grafice-diagrame-concurs',
    title: 'Reprezentări Grafice & Diagrame Interactive în MS Excel',
    shortTitle: 'Diagrame & Reprezentări Grafice',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 1: Calcul tabelar (pag. 29–35)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '📈',
    color: 'from-cyan-600 to-blue-700',
    metaDescription: 'Lecție completă despre diagrame în Excel: diagrame coloană, linii, radială (Pie chart), dispersie XY, corelații interdisciplinare și proiectul de concurs Planificarea unui eveniment.',
    keywords: [
      'diagrame excel clasa 8',
      'diagrama coloana bara pie chart',
      'reprezentari grafice foi calcul',
      'interpretare grafice fizica geografie',
      'proiect planificarea unui eveniment'
    ],
    competencies: [
      {
        code: '1.1',
        description: 'Construirea și interpretarea reprezentărilor grafice potrivite pentru diferite tipuri de date numerice.'
      },
      {
        code: '3.1',
        description: 'Integrarea tabelelor și a graficelor în proiecte tematice de planificare și gestiune a resurselor.'
      }
    ],
    theorySections: [
      {
        title: 'Rolul Diagramelor și Tipurile Principale de Grafice',
        content: [
          'O diagramă oferă o imagine vizuală instantanee și clară asupra datelor dintr-un tabel, permițând identificarea rapidă a extremelor, a tendințelor și a proporțiilor.',
          'Caracteristică esențială: Diagramele din Excel sunt dinamice — dacă o valoare din tabel se modifică, graficul se actualizează automat!',
          'Tipurile de bază din manual:',
          '1. Diagramă Coloană sau Bară (Column/Bar Chart 2D/3D): utilizată pentru a compara mărimi între câteva categorii distincte (ex: repartizarea mediilor de la 1 la 10 într-o școală de 1.300 de elevi).',
          '2. Diagramă cu Linii sau Arie (Line/Area Chart): ideală pentru a arăta tendințe și evoluții în timp (ex: variația temperaturilor zilnice sau graficul mișcării unui automobil x(t) la fizică).',
          '3. Diagramă Radială / Plăcintă (Pie Chart): ilustrează proporțiile și ponderile procentuale ale părților dintr-un întreg (istoric: inventată în 1801 de William Playfair).',
          '4. Diagramă prin Puncte / Dispersie (Scatter XY): arată corelația matematică dintre două variabile numerice (ex: evoluția populației Terrei între anii 1900 și 2000).'
        ],
        tips: 'Alege întotdeauna tipul de diagramă potrivit mesajului: Pie Chart pentru procente dintr-un total, Linii pentru evoluție în timp și Coloane pentru comparație între elevi/materii!'
      },
      {
        title: 'Cei 4 Pași Simpli pentru Crearea unui Grafic',
        content: [
          'Pasul 1: Construirea tabelului cu date complete (inclusiv antet de coloană și etichete).',
          'Pasul 2: Selectarea întregului tabel (sau a coloanelor care se doresc reprezentate).',
          'Pasul 3: Accesarea filei Inserare (Insert) > grupul Diagrame (Charts).',
          'Pasul 4: Alegerea opțiunii Diagrame Recomandate (Recommended Charts) sau selectarea directă a tipului dorit (Coloană, Linii, Plăcintă).',
          'Personalizarea graficului: adăugare Titlu sugestiv, afișare Legendă, etichete de date numerice direct pe bare (Data Labels) și aplicarea unei teme vizuale elegante.'
        ],
        tips: 'Fila contextuală „Proiectare diagramă” (Chart Design) apare doar atunci când graficul este selectat și oferă palete profesionale de culori!'
      },
      {
        title: 'Proiect de Concurs: Planificarea unui Eveniment',
        content: [
          'Concursul din manual (pag. 34): Planificarea unei excursii sau petreceri pentru o echipă de 10 elevi.',
          'Cerințe structură: listă cu 6 tipuri de cheltuieli (transport, cazare, mese, bilete obiective), tabel nominal cu 10 participanți, cost per elev, sumă achitată și status plată (achitat integral / parțial / neachitat folosind formula IF).',
          'Elementul grafic final: generarea unei diagrame cu bare sau plăcintă care arată raportul dintre elevii care au achitat integral și cei restanțieri.'
        ],
        tips: 'Integrează graficul alături de tabelul de calcul pe aceeași foaie pentru o prezentare de impact!'
      }
    ],
    keyTerms: [
      { term: 'Diagramă Coloană (Column Chart)', definition: 'Grafic cu bare verticale folosit pentru compararea vizuală a valorilor între mai multe categorii.' },
      { term: 'Diagramă Plăcintă (Pie Chart)', definition: 'Grafic circular divizat în sectoare proporționale cu ponderea fiecărei valori din total (100%).' },
      { term: 'Diagramă cu Linii (Line Chart)', definition: 'Grafic ce conectează punctele de date prin linii continue, optim pentru tendințe temporale.' },
      { term: 'Legendă grafic', definition: 'Caseta explicativă care asociază fiecare culoare din diagramă cu categoria corespunzătoare.' }
    ],
    shortcuts: [
      { key: 'F11', action: 'Creează instantaneu o diagramă pe o foaie nouă pe baza datelor selectate' },
      { key: 'Alt + F1', action: 'Inserează o diagramă coloană direct în foaia curentă de lucru' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Crearea unei diagrame cu coloane pentru mediile clasei',
        task: 'Introdu numărul de elevi pentru fiecare medie de la 1 la 10. Selectează datele și inserează o diagramă coloană 2D cu titlul „Repartizarea Mediilor”.'
      },
      {
        step: 2,
        title: 'Graficul mișcării uniforme la fizică',
        task: 'Introdu tabelul cu timpul t (0..8 s) și poziția x (10..22 m). Inserează o diagramă cu linii x(t) și calculează viteza v = d/t.'
      },
      {
        step: 3,
        title: 'Diagramă plăcintă pentru bugetul evenimentului',
        task: 'Generează o diagramă Pie 3D care evidențiază procentual cheltuielile pentru transport, cazare și masă din cadrul proiectului de excursie.'
      }
    ],
    faq: [
      {
        question: 'Dacă schimb o notă în tabel, trebuie să refac diagrama?',
        answer: 'Nu! Diagramele din Excel sunt dinamice și conectate direct la celule. Orice modificare în tabel se reflectă imediat în grafic.'
      },
      {
        question: 'Când este recomandat să folosesc diagrama radială (plăcintă)?',
        answer: 'Diagrama radială este recomandată când ai puține categorii (maxim 5-7) și dorești să ilustrezi proporția fiecăreia dintr-un întreg de 100%.'
      }
    ],
    testQuestions: [
      {
        question: 'Ce tip de diagramă este cel mai potrivit pentru a arăta evoluția temperaturii pe parcursul a 30 de zile?',
        options: [
          'Diagramă radială (plăcintă)',
          'Diagramă cu linii (Line chart)',
          'Diagramă radar',
          'Diagramă cu inele'
        ],
        correctIndex: 1,
        explanation: 'Diagrama cu linii este proiectată special pentru a evidenția fluctuațiile și tendințele datelor de-a lungul timpului.'
      },
      {
        question: 'În ce filă din panglica Excel se află comenzile de inserare a diagramelor?',
        options: [
          'Fila Pornire (Home)',
          'Fila Aspect Pagină (Page Layout)',
          'Fila Inserare (Insert)',
          'Fila Revizuire (Review)'
        ],
        correctIndex: 2,
        explanation: 'Toate elementele vizuale (inclusiv tabele, imagini și diagrame) se inserează din fila Inserare (Insert).'
      },
      {
        question: 'Cine a inventat primele diagrame de tip plăcintă (Pie Chart) în anul 1801?',
        options: [
          'Bill Gates',
          'Tim Berners-Lee',
          'William Playfair',
          'Charles Babbage'
        ],
        correctIndex: 2,
        explanation: 'Inginerul și economistul scoțian William Playfair a publicat prima diagramă plăcintă în anul 1801 în lucrarea Statistical Breviary.'
      }
    ]
  },

  // ==================== UNITATEA 2: PAGINI WEB ====================
  {
    id: 'g8_web_a',
    slug: 'web-structura-antet-slider-securitate',
    title: 'Anatomia Paginii Web: Structură, Antet, Slider & Securitate Cibernetică',
    shortTitle: 'Structură Web & Securitate',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 2: Pagini web (pag. 36–39)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '🌐',
    color: 'from-purple-600 to-indigo-700',
    metaDescription: 'Ghid esențial web Clasa a 8-a: Istoria WWW, cele 4 elemente de structură (Titlu, Antet cu carusel/slider, Corp, Subsol), bune practici pentru tag-uri și protecția împotriva ingineriei sociale.',
    keywords: [
      'structura pagina web clasa 8',
      'antet corp subsol html',
      'carusel imagini slider web',
      'tag titlu browser bune practici',
      'securitate cibernetica inginerie sociala'
    ],
    competencies: [
      {
        code: '1.2',
        description: 'Identificarea elementelor de structură ale unei pagini web și a regulilor de navigare în siguranță pe Internet.'
      },
      {
        code: '3.2',
        description: 'Proiectarea structurii vizuale a unei pagini web respectând normele de securitate a datelor personale.'
      }
    ],
    theorySections: [
      {
        title: 'Internet, World Wide Web și Istoria Primului Site',
        content: [
          'Internetul este sistemul global de rețele de calculatoare interconectate prin protocolul TCP/IP („o rețea de rețele”).',
          'World Wide Web (WWW) reprezintă spațiul resurselor hypertext accesibile prin Internet, inventat de Tim Berners-Lee la centrul CERN din Elveția.',
          'Propunerea a fost înaintată în martie 1989 („Managementul informației: Propunere”), șeful său notând pe prima pagină: „Vag, dar interesant!”.',
          'Primul site web din lume a fost lansat oficial la 6 august 1991 pe un calculator NeXT și poate fi vizitat și astăzi la adresa: http://info.cern.ch/hypertext/WWW/TheProject.html.',
          'O pagină web este un document (de obicei HTML) cu hiperlinkuri către alte resurse, iar un Site Web reprezintă o colecție tematică de pagini interconectate.'
        ],
        tips: 'Reține: Internetul este infrastructura fizică de rețea, în timp ce Web-ul (WWW) este serviciul de pagini și informații care rulează peste această rețea!'
      },
      {
        title: 'Cele 4 Elemente de Structură ale unei Pagini Web',
        content: [
          'O pagină web modernă este împărțită în 4 zone fundamentale:',
          '1. Titlul paginii (Tag-ul afișat în tabul browserului): anunță conținutul și este esențial pentru utilizatori și motoarele de căutare. Bune practici: scurt (sub 55 caractere), fără repetiții de cuvinte, relevant, fără all-caps.',
          '2. Antetul paginii (Header): zona superioară care oferă identitate vizuală. Conține: Logo, Meniu de navigare, Titlu principal, bară de căutare și frecvent un Slider / Carusel de imagini.',
          '   • Ce este un Slider / Carusel? Un set de imagini sugestive care se succed automat sau prin click, atrăgând atenția vizitatorului.',
          '3. Corpul paginii (Body): partea centrală și cea mai consistentă, conținând textele principale, articole, tabele, galerii, videoclipuri și hărți.',
          '4. Subsolul paginii (Footer): zona inferioară cu informații sumare de contact, copyright, meniu secundar și linkuri către platforme sociale.'
        ],
        tips: 'O pagină web fără antet, corp sau subsol funcționează tehnic, dar seamănă cu o compunere căreia îi lipsește introducerea sau încheierea!'
      },
      {
        title: 'Securitatea Cibernetică: Combaterea Ingineriei Sociale',
        content: [
          'Ingineria socială reprezintă manipularea psihologică a utilizatorilor pentru a-i determina să divulge informații confidențiale (parole, CNP, adrese, conturi bancare).',
          'Reguli de aur pentru o navigare sigură:',
          '• Verifică prezența protocolului securizat https:// și a lăcățelului de securitate înainte de a introduce orice dată.',
          '• Verifică destinația reală a oricărui link prin trecerea mouse-ului peste el (hover) și citirea adresei reale afișate în colțul stânga-jos al browserului.',
          '• Nu da click pe reclame pop-up și nu instala aplicații la propunerea paginilor web (alerte false de viruși).',
          '• Descarcă software exclusiv de pe site-urile oficiale ale producătorilor.'
        ],
        tips: 'Nu introduce niciodată date personale sau parole pe pagini care nu încep cu https:// sau care par suspecte la prima vedere!'
      }
    ],
    keyTerms: [
      { term: 'World Wide Web (WWW)', definition: 'Sistemul global de documente hypertext interconectate prin hiperlinkuri, accesibil prin rețeaua Internet.' },
      { term: 'Slider / Carusel', definition: 'Element grafic de prezentare din antet format dintr-o succesiune dinamică de imagini cu efecte de tranziție.' },
      { term: 'Tag de titlu (Title tag)', definition: 'Numele paginii afișat în eticheta filei de browser, cu rol major în identificare și SEO.' },
      { term: 'Inginerie socială', definition: 'Tehnică de manipulare prin care atacatorii cibernetici păcălesc utilizatorii să divulge informații secrete sau parole.' }
    ],
    shortcuts: [
      { key: 'Ctrl + H', action: 'Deschide istoricul de navigare în browser' },
      { key: 'Ctrl + Shift + N', action: 'Deschide o fereastră nouă în mod incognito / navigare privată' },
      { key: 'Ctrl + U', action: 'Afișează codul sursă HTML al paginii web curente' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Analiza structurii pe site-uri reale',
        task: 'Deschide site-urile manuale.edu.ro și scratch.mit.edu. Identifică pentru fiecare antetul, corpul, subsolul și tagul din fila de browser.'
      },
      {
        step: 2,
        title: 'Inspectarea codului sursă HTML',
        task: 'Fă click dreapta pe o pagină web și alege „Vizualizare sursă pagină” (View Page Source). Identifică etichetele <title>, <header>, <body> și <footer>.'
      },
      {
        step: 3,
        title: 'Verificarea securității unui link',
        task: 'Trece cursorul peste un link fără a da click și observă adresa URL reală afișată în bara de stare stânga-jos a browserului.'
      }
    ],
    faq: [
      {
        question: 'Cine a creat primul site web din lume și în ce an?',
        answer: 'Tim Berners-Lee a lansat primul site web la 6 august 1991 în cadrul laboratorului CERN din Geneva.'
      },
      {
        question: 'Câte caractere este recomandat să aibă titlul unei pagini web?',
        answer: 'Se recomandă un titlu concis și relevant de maximum 55 de caractere pentru a fi afișat complet în motoarele de căutare.'
      }
    ],
    testQuestions: [
      {
        question: 'Care dintre următoarele reprezintă cele 4 zone de bază ale unei pagini web?',
        options: [
          'Mouse, Tastatură, Monitor, Unitate Centrală',
          'Titlul paginii, Antetul, Corpul paginii, Subsolul',
          'Formatare, Copiere, Lipire, Ștergere',
          'Coloană, Rând, Celulă, Foaie'
        ],
        correctIndex: 1,
        explanation: 'Structura standard a unei pagini web este formată din titlu (tag browser), antet (header), corp (body) și subsol (footer).'
      },
      {
        question: 'Ce indică protocolul „https://” în bara de adrese a unui browser?',
        options: [
          'Că pagina este scrisă în C++',
          'O conexiune securizată și criptată între browser și server',
          'Că site-ul conține un slider video',
          'Că pagina este disponibilă doar offline'
        ],
        correctIndex: 1,
        explanation: 'Protocolul HTTPS (Hypertext Transfer Protocol Secure) criptează traficul de date pentru protejarea confidențialității utilizatorilor.'
      },
      {
        question: 'Ce este un slider (carusel) într-o pagină web?',
        options: [
          'O bară de derulare pe verticală',
          'O prezentare dinamică de imagini sugestive cu efecte de tranziție',
          'Un program antivirus',
          'O căsuță pentru introducerea parolei'
        ],
        correctIndex: 1,
        explanation: 'Sliderul sau caruselul este o galerie animată de imagini plasată adesea în antet pentru a atrage vizual atenția vizitatorilor.'
      }
    ]
  },

  {
    id: 'g8_web_b',
    slug: 'web-google-sites-sectiuni-blocuri-continut',
    title: 'Aplicații de Editare Web: Interfața Google Sites & Construcția Primei Pagini',
    shortTitle: 'Editorul Google Sites & Blocuri Media',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 2: Pagini web (pag. 40–50)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '💻',
    color: 'from-violet-600 to-purple-700',
    metaDescription: 'Construiește prima ta pagină web în Google Sites: cele 3 tab-uri (Inserează, Pagini, Teme), blocuri de conținut, editare text/imagini, încorporare tabele Excel, hărți, YouTube și publicare online.',
    keywords: [
      'google sites clasa 8',
      'creare pagina web wysiwyg',
      'taburi insereaza pagini teme',
      'incorporare tabele excel youtube',
      'publicare site web domeniu google'
    ],
    competencies: [
      {
        code: '1.2',
        description: 'Utilizarea unui editor dedicat (Google Sites) pentru realizarea unei pagini web cu diverse teme.'
      },
      {
        code: '3.2',
        description: 'Elaborarea unei pagini web conform unor specificații date, integrând texte, imagini și conținut extern.'
      }
    ],
    theorySections: [
      {
        title: 'Metode de Creare Web & Interfața Google Sites',
        content: [
          'Două căi mari de creare a site-urilor web:',
          '1. Prin programare directă: scrierea liniilor de cod HTML, CSS și JavaScript.',
          '2. Prin aplicații specializate WYSIWYG / CMS: Google Sites, WordPress, Wix, Webflow, Blogger.',
          'Google Sites (sites.google.com) permite crearea gratuită de site-uri web fără a ști programare, fiind găzduit direct pe serverele Google.',
          'Elementele ecranului de editare:',
          '• Bara de sus: Undo/Redo, Previzualizare (Preview), Copiază linkul site-ului publicat, Trimite altor persoane (colaborare), Setări și butonul Publicare (Publish).',
          '• Panoul lateral din dreapta cu cele 3 Tab-uri esențiale: Inserează (Insert), Pagini (Pages), Teme (Themes).'
        ],
        tips: 'Google Sites salvează automat fiecare modificare în contul tău Google Drive, la fel ca în Google Docs sau Sheets!'
      },
      {
        title: 'Tabul Inserează: Blocuri de Conținut & Obiecte Media',
        content: [
          'Unelte de bază: Casetă text, Imagini, Încorporează (Embed cod HTML sau link URL), Drive.',
          'Blocuri de conținut (Content Blocks): șabloane gata concepute pentru așezarea estetică a imaginilor alături de titluri și paragrafe.',
          'Elemente interactive disponibile în Google Sites:',
          '• Carusel de imagini: permite adăugarea a cel puțin două imagini care rulează automat sau manual.',
          '• Buton (Button): creează un buton cu link direct către o secțiune, o altă pagină sau un site extern.',
          '• Separator (Divider): linie orizontală care delimitează secțiunile din corp.',
          '• Încorporare de servicii Google: videoclipuri YouTube, Hărți Google Maps cu locație fixată, Foi de calcul Excel/Sheets, Prezentări Slides, Formulare și Diagrame.'
        ],
        tips: 'Ține apăsată tasta Shift atunci când redimensionezi o imagine pentru a păstra proporția corectă a laturilor fără deformare!'
      },
      {
        title: 'Etapele Construirii și Publicării Primei Pagini Web',
        content: [
          'Studiu de caz din manual: „Oracolul clasei / Oracol personal”.',
          '1. Configurare antet: Tip de antet (Copertă, Banner mare, Banner, Numai titlu), încărcare imagine reprezentativă de fundal.',
          '2. Editare secțiuni: schimbare fundal (Normal, Subliniere 1, Subliniere 2, Imagine), duplicare secțiune, mutare sus/jos cu mouse-ul, ștergere.',
          '3. Editare text: stiluri (Titlu, Heading, Subheading, Text normal), liste, hiperlinkuri pe cuvinte cheie.',
          '4. Subsol (Footer): adăugare secțiune de footer vizibilă pe toate paginile (sau ascunderea ei pe pagina principală).',
          '5. Previzualizare responsive: butonul Preview oferă comutare instantanee între modurile Ecran Mare (Desktop), Tabletă și Telefon.',
          '6. Publicare pe Internet: click pe butonul Publicare, alegerea adresei web (ex: sites.google.com/view/oracolul-meu) și confirmare.'
        ],
        tips: 'După publicare, copiază linkul publicat cu butonul dedicat și deschide-l într-o fereastră incognito pentru a verifica exact cum îl văd vizitatorii!'
      }
    ],
    keyTerms: [
      { term: 'Google Sites', definition: 'Aplicație online gratuită de la Google pentru crearea intuitivă și colaborativă de pagini și site-uri web responsive.' },
      { term: 'Bloc de conținut (Content Block)', definition: 'Șablon predefinit de așezare a imaginilor și a textelor în corpul paginii.' },
      { term: 'Previzualizare responsive', definition: 'Modul de verificare a aspectului paginii web pe trei formate de ecran: desktop, tabletă și smartphone.' },
      { term: 'Publicare web', definition: 'Acțiunea prin care proiectul devine vizibil și accesibil oricărui utilizator pe Internet la o adresă URL dedicată.' }
    ],
    shortcuts: [
      { key: 'Ctrl + Z', action: 'Anulează ultima acțiune de editare în Google Sites (Undo)' },
      { key: 'Ctrl + Y', action: 'Reface acțiunea anulată (Redo)' },
      { key: 'Shift + Tragere colț', action: 'Redimensionează o imagine păstrând raportul de aspect' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Configurarea antetului paginii „Oracol Personal”',
        task: 'Creează un site nou în Google Sites. Pune titlul paginii „Oracol Maria P.”, alege tipul de antet Banner și încarcă o imagine de fundal.'
      },
      {
        step: 2,
        title: 'Inserarea unui carusel și a unui tabel Excel',
        task: 'Inserează un carusel cu 3 fotografii reprezentative, un separator vizual și o foaie de calcul cu clasamentul sportiv al clasei.'
      },
      {
        step: 3,
        title: 'Adăugarea unei hărți și publicarea site-ului',
        task: 'Adaugă o hartă Google Maps cu locația școlii, testează modul de previzualizare pe mobil și publică site-ul cu un nume unic.'
      }
    ],
    faq: [
      {
        question: 'Trebuie să plătesc pentru găzduirea unui site realizat în Google Sites?',
        answer: 'Nu! Google oferă găzduire gratuită pe serverele proprii la adrese de forma sites.google.com/view/numele-site-ului.'
      },
      {
        question: 'Cum pot schimba paleta de culori a întregului site dintr-o dată?',
        answer: 'Din panoul lateral dreapta, accesezi tabul Teme (Themes), alegi o altă temă (de ex. Aristotel sau Viziune) sau setezi o culoare personalizată prin cod HEX.'
      }
    ],
    testQuestions: [
      {
        question: 'Care sunt cele trei tab-uri principale din bara laterală Google Sites?',
        options: [
          'Fișier, Editare, Vizualizare',
          'Inserează, Pagini, Teme',
          'Font, Aliniere, Paragraf',
          'Coloane, Rânduri, Celule'
        ],
        correctIndex: 1,
        explanation: 'Cele trei tab-uri oficiale din Google Sites sunt: Inserează (obiecte/blocuri), Pagini (ierarhia site-ului) și Teme (stil grafic și culori).'
      },
      {
        question: 'Ce tastă trebuie ținută apăsată la redimensionarea unei imagini pentru a preveni deformarea?',
        options: [
          'Tasta Ctrl',
          'Tasta Shift',
          'Tasta Alt',
          'Tasta Tab'
        ],
        correctIndex: 1,
        explanation: 'Tasta Shift menține proporția inițială lățime/înălțime (aspect ratio) a imaginii în timpul tragerii colțurilor.'
      },
      {
        question: 'Ce dispozitive pot fi simulate în modul de Previzualizare din Google Sites?',
        options: [
          'Doar ecranul mare de calculator',
          'Telefon, Dispozitiv tip tabletă și Ecran mare',
          'Doar ceasul inteligent',
          'Doar imprimanta de birou'
        ],
        correctIndex: 1,
        explanation: 'Previzualizatorul responsive oferă trei butoane de testare: Telefon mobil, Tabletă și Ecran mare de calculator.'
      }
    ]
  },

  {
    id: 'g8_web_c',
    slug: 'web-site-multipage-navigare-colaborare',
    title: 'Construirea unui Site Multipage, Navigare & Lucru Colaborativ',
    shortTitle: 'Site Multipage & Colaborare',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 2: Pagini web (pag. 51–57)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '🤝',
    color: 'from-pink-600 to-rose-700',
    metaDescription: 'Construiește un site web complex cu pagini multiple: ierarhie de subpagini, navigare sus/lateral, căutare internă, lucrul în echipă colaborativă și Proiectul Site-ul Clasei.',
    keywords: [
      'site multipage google sites',
      'subpagini ierarhice web',
      'meniu navigare sus lateral',
      'lucru colaborativ echipa google sites',
      'proiectul clasei carpatii muntii nostri'
    ],
    competencies: [
      {
        code: '1.2',
        description: 'Construirea unui site cu pagini multiple și configurarea meniului de navigare adecvat.'
      },
      {
        code: '3.2',
        description: 'Participarea colaborativă la dezvoltarea unui site al clasei, gestionând permisiuni de acces și roluri de echipă.'
      }
    ],
    theorySections: [
      {
        title: 'Arhitectura unui Site Multipage & Ierarhia de Subpagini',
        content: [
          'Un site web informativ cuprinde de regulă mai multe pagini organizate ierarhic în jurul unei pagini principale (Acasă / Home).',
          'Gestionarea paginilor în tabul Pagini:',
          '• Adăugare pagină nouă: click pe butonul „+” din josul tabului Pagini și introducerea numelui.',
          '• Subordonarea unei pagini (crearea unei subpagini): tragi o pagină peste o altă pagină din listă. Pagina trasă devine „pagină copil” (subpagină).',
          '• Google Sites permite până la 5 niveluri de subordonare în arborele de navigare!',
          'Opțiuni disponibile pentru orice pagină (meniul cu trei puncte): Setează ca pagină principală, Duplică pagina, Adaugă o subpagină, Ascunde din bara de navigare (pagină secretă sau accesibilă doar prin link direct), Șterge.'
        ],
        tips: 'Pagina setată ca Pagină Principală nu poate fi ștearsă și nici ascunsă din meniul de navigare!'
      },
      {
        title: 'Configurarea Navigării & Căutarea în Site',
        content: [
          'Meniul de navigare permite vizitatorilor să sară facil de la o pagină la alta.',
          'Poziționarea meniului de navigare (din Setări > Navigare):',
          '• Sus (Top Navigation): meniul este orizontal în antetul fiecărei pagini (implicit).',
          '• Lateral (Side Navigation): meniul este ascuns în colțul stânga-sus sub forma unui buton „hamburger” și se deschide vertical la click.',
          '• Culoare meniu: Transparent, Alb sau Negru.',
          'Căutarea internă: La site-urile multipage publicate, Google Sites activează automat o lupă de căutare în antet, permițând căutarea de termeni în tot textul site-ului.'
        ],
        tips: 'Meniul lateral este recomandat atunci când ai mai mult de 6-7 pagini principale, pentru a nu aglomera antetul!'
      },
      {
        title: 'Lucrul Colaborativ în Echipă & Proiectul Clasei',
        content: [
          'Colaborarea în timp real este forța principală a Google Sites:',
          '• Liderul de grup dă click pe butonul „Trimite altor persoane” (iconița persoană cu „+”).',
          '• Se introduc adresele de e-mail ale colegilor și se trimite invitația.',
          '• Niveluri de acces: Editor (poate adăuga conținut și edita pagini) sau Vizualizator.',
          '• Oricând se poate revoca accesul unui membru selectând „Elimină accesul” din dreptul numelui său.',
          'Proiectul din manual (pag. 56): „Site-ul clasei” (Carpații – munții noștri sau prezentarea realizărilor elevilor). O echipă coordonatoare creează scheletul, iar fiecare elev își editează propria subpagină cu portofoliul și pasiunile sale.'
        ],
        tips: 'Stabiliți din start reguli clare în echipă: fiecare membru lucrează doar pe subpagina sa pentru a nu suprascrie munca colegilor!'
      }
    ],
    keyTerms: [
      { term: 'Subpagină (Child page)', definition: 'Pagină web subordonată ierarhic unei pagini părinte în structura arborelui de navigare a site-ului.' },
      { term: 'Meniu de navigare (Navigation Bar)', definition: 'Bara de linkuri ce permite deplasarea instantanee între paginile și secțiunile site-ului.' },
      { term: 'Lucru colaborativ', definition: 'Posibilitatea ca mai mulți utilizatori autorizați să editeze simultan același proiect web din locații diferite.' },
      { term: 'Navigare laterală (Side navigation)', definition: 'Meniu vertical afișat în partea stângă a ecranului, optim pentru site-uri cu structură ramificată.' }
    ],
    shortcuts: [
      { key: 'Ctrl + K', action: 'Deschide caseta de inserare hiperlink pe textul selectat' },
      { key: 'Esc', action: 'Ieșire din ecranul de previzualizare responsive' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Crearea structurii de pagini a clasei',
        task: 'Adaugă paginile principale: „Acasă”, „Elevi”, „Evenimente”, „Proiecte” și „Contact”.'
      },
      {
        step: 2,
        title: 'Crearea subpaginilor individuale',
        task: 'Creează subpagini sub pagina „Elevi” pentru fiecare membru al echipei (ex: Oracol Ana, Oracol Vlad).'
      },
      {
        step: 3,
        title: 'Comutarea meniului și partajarea accesului',
        task: 'Schimbă meniul de navigare în mod Lateral, partajează proiectul cu un coleg prin e-mail cu rol de Editor și publică versiunea finală.'
      }
    ],
    faq: [
      {
        question: 'Câte niveluri de subpagini pot fi adăugate într-un site Google Sites?',
        answer: 'Google Sites permite subordonarea paginilor pe o adâncime de până la 5 niveluri ierarhice.'
      },
      {
        question: 'Cum pot ascunde o pagină din meniu fără să o șterg?',
        answer: 'Faci click pe cele trei puncte din dreptul paginii în tabul Pagini și selectezi opțiunea „Ascunde din bara de navigare”.'
      }
    ],
    testQuestions: [
      {
        question: 'Ce număr maxim de pagini poate conține un site creat în Google Sites?',
        options: [
          'Exact 10 pagini',
          'Maxim 50 de pagini',
          'Maxim 100 de pagini',
          'Un număr nelimitat de pagini'
        ],
        correctIndex: 3,
        explanation: 'Conform documentației Google și manualului școlar, un site construit cu Google Sites poate conține un număr nelimitat de pagini.'
      },
      {
        question: 'Cum se transformă o pagină existentă în subpagină a altei pagini?',
        options: [
          'Se redenumește pagina cu două puncte',
          'Se trage cu mouse-ul (drag & drop) pagina peste pagina căreia i se subordonează',
          'Se șterge și se rescrie',
          'Se apasă tasta F5'
        ],
        correctIndex: 1,
        explanation: 'În tabul Pagini, tragerea unei pagini peste o altă pagină o convertește instantaneu într-o subpagină a acelei pagini.'
      },
      {
        question: 'Ce se întâmplă dacă alegem opțiunea „Ascunde din bara de navigare” pentru o pagină?',
        options: [
          'Pagina se șterge definitiv de pe Internet',
          'Pagina rămâne funcțională, dar nu mai apare în meniul principal de navigare',
          'Pagina devine pagină principală',
          'Site-ul nu mai poate fi publicat'
        ],
        correctIndex: 1,
        explanation: 'Pagina ascunsă nu mai este afișată în meniu, dar poate fi accesată în continuare prin linkuri directe din text sau butoane.'
      }
    ]
  },

  // ==================== UNITATEA 3: ALGORITMI & PROGRAMARE C++ ====================
  {
    id: 'g8_algo_a',
    slug: 'cpp-decizie-switch-cnp-bucle-complexe',
    title: 'Structura Decizională Multiplă (switch), Analiza CNP & Bucle Complexe',
    shortTitle: 'Decizie switch, CNP & Bucle',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 3: Algoritmi (pag. 58–65)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '⚡',
    color: 'from-amber-600 to-orange-700',
    metaDescription: 'Lecție avansată C++ Clasa a 8-a: Structura decizională multiplă switch, instrucțiunea break, decodificarea CNP-ului de 13 cifre, oracolul digital, piramida în trepte și primalitatea.',
    keywords: [
      'instructiunea switch c++',
      'analiza cnp programare c++',
      'oracolul din calculator switch',
      'problema piramidei egiptene',
      'numere prime algoritm optimizat'
    ],
    competencies: [
      {
        code: '2.1',
        description: 'Identificarea structurilor de control potrivite pentru prelucrarea informațiilor complexe.'
      },
      {
        code: '3.3',
        description: 'Implementarea algoritmilor decizionali și repetitivi într-un mediu integrat de programare (Code::Blocks / C++).'
      }
    ],
    theorySections: [
      {
        title: 'Structura Decizională Multiplă: Instrucțiunea switch în C++',
        content: [
          'Instrucțiunea switch este ideală atunci când o singură variabilă expresie-selector poate avea mai multe valori constante întregi sau caractere distincte.',
          'Sintaxă C++:',
          'switch (expresie_selector) {',
          '    case val_const_1: secvență_1; break;',
          '    case val_const_2: secvență_2; break;',
          '    ...',
          '    default: secvență_implicită;',
          '}',
          'Rolul esențial al lui break;: provoacă ieșirea imediată din blocul switch. Dacă break lipsește, execuția „cade” automat în instrucțiunile cazului următor (fall-through)!',
          'Ramura default este opțională și se execută dacă nicio valoare constantă nu s-a potrivit cu selectorul.'
        ],
        tips: 'Constantele de caz (case) trebuie să fie neapărat valori întregi (numere întregi sau caractere precum \'A\'), nu numere reale sau intervale!'
      },
      {
        title: 'Aplicație din Manual: Decodificarea CNP-ului în C++',
        content: [
          'Codul Numeric Personal (CNP) conține 13 cifre și se reține într-o variabilă de tip long long int.',
          'Structura CNP: S AA LL ZZ XXXXXX',
          '• S: sexul (cifră pară -> feminin, cifră impară -> masculin). Extragere: s = cnp / 1000000000000; if (s % 2 == 0) cout << "Sex feminin";',
          '• AA: ultimele 2 cifre ale anului nașterii. Extragere: a = cnp / 10000000000 % 100;',
          '• LL: luna nașterii. Extragere: l = cnp / 100000000 % 100;',
          '• ZZ: ziua nașterii. Extragere: z = cnp / 1000000 % 100;',
          'Afișarea formatată cu zero nesemnificativ: dacă luna sau ziua este < 10, afișăm explicit caracterul \'0\' (ex: if (l < 10) cout << "0" << l; else cout << l;).'
        ],
        tips: 'Nu uita să folosești long long int pentru CNP, deoarece un număr de 13 cifre depășește limita superioară a tipului int standard (aproximativ 2 miliarde)!'
      },
      {
        title: 'Bucle Complexe: Piramida Egipteană & Numere Prime',
        content: [
          'Problema Piramidei în trepte (pag. 62):',
          '• Nivelul de jos are n × n blocuri de 1 m. Nivelul următor are (n–2) × (n–2) blocuri de 2 m ș.a.m.d., cât timp n – 2 * nrNiv > 0.',
          '• Algoritmul calculează numărul de niveluri, numărul total de blocuri de piatră și înălțimea totală a piramidei.',
          'Problema numerelor prime (pag. 64):',
          '• Un număr n > 1 este prim dacă nu are divizori proprii.',
          '• Optimizare: este suficient să testăm divizorii de la 2 până la n/2. Dacă contorul nrDiv rămâne 0, numărul este prim.'
        ],
        tips: 'În loc să testezi până la n-1, testarea până la n/2 înjumătățește timpul de calcul al calculatorului!'
      }
    ],
    keyTerms: [
      { term: 'switch', definition: 'Instrucțiune de ramificare multiplă în C++ bazată pe evaluarea unei expresii selector întregi.' },
      { term: 'break', definition: 'Instrucțiune ce întrerupe imediat execuția blocului switch sau a unei bucle repetitive.' },
      { term: 'CNP (Cod Numeric Personal)', definition: 'Identificator numeric unic de 13 cifre ce codifică sexul, secolul și data nașterii cetățeanului.' },
      { term: 'Număr prim', definition: 'Număr natural strict mai mare decât 1 care admite doar divizorii improprii 1 și el însuși.' }
    ],
    shortcuts: [
      { key: 'F9', action: 'Compilează și rulează programul în Code::Blocks' },
      { key: 'F8', action: 'Pornește depanarea pas cu pas (Debug) în Code::Blocks' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Implementarea programului „Oracolul din calculator”',
        task: 'Scrie un program C++ care citește anul nașterii, calculează ultima cifră uc = an % 10 și afișează o profeție amuzantă folosind switch(uc).'
      },
      {
        step: 2,
        title: 'Parser de CNP cu formatare exactă',
        task: 'Citește un număr de 13 cifre în long long int și afișează sexul și data nașterii sub forma AA.LL.ZZ cu zerouri de umplere.'
      },
      {
        step: 3,
        title: 'Testarea primalității',
        task: 'Scrie algoritmul care citește un număr natural n și afișează dacă este prim sau compus, numărând divizorii din intervalul [2, n/2].'
      }
    ],
    faq: [
      {
        question: 'Ce se întâmplă dacă uităm să punem break după un caz într-un switch?',
        answer: 'Programul va executa instrucțiunile cazului respectiv și va continua automat cu instrucțiunile cazurilor următoare până când întâlnește un break sau sfârșitul blocului switch.'
      },
      {
        question: 'De ce folosim tipul long long int pentru CNP?',
        answer: 'Tipul int pe 32 de biți suportă numere până la ~2.147.483.647 (10 cifre), în timp ce CNP-ul are 13 cifre și necesită un întreg pe 64 de biți (long long int).'
      }
    ],
    testQuestions: [
      {
        question: 'Care este rolul instrucțiunii break într-o structură decizională switch?',
        options: [
          'Repornește programul de la început',
          'Determină ieșirea imediată din blocul switch',
          'Șterge valorile variabilelor din memorie',
          'Afișează un mesaj de eroare pe consolă'
        ],
        correctIndex: 1,
        explanation: 'Instrucțiunea break oprește execuția blocului switch și transferă controlul la prima instrucțiune de după acolada închisă a switch-ului.'
      },
      {
        question: 'Cum se extrage sexul persoanei din prima cifră a unui CNP de 13 cifre?',
        options: [
          's = cnp % 10;',
          's = cnp / 1000000000000;',
          's = cnp * 10;',
          's = cnp / 100;'
        ],
        correctIndex: 1,
        explanation: 'Împărțirea întreagă la 10^12 (1000000000000) izolează exact prima cifră a CNP-ului (care este 1/3/5 pentru masculin sau 2/4/6 pentru feminin).'
      },
      {
        question: 'Până la ce valoare este suficient să căutăm divizori pentru a verifica dacă n este prim?',
        options: [
          'Până la n * 2',
          'Până la n / 2',
          'Până la 1000',
          'Până la n + 1'
        ],
        correctIndex: 1,
        explanation: 'Cel mai mic divizor propriu posibil este 2, deci cel mai mare divizor propriu posibil nu poate depăși n/2.'
      }
    ]
  },

  {
    id: 'g8_algo_b',
    slug: 'robotica-open-roberta-senzori-labirint',
    title: 'Algoritmi în Robotică: Senzori Virtuali NXT & Navigare în Labirint',
    shortTitle: 'Roboți Virtuali & Senzori NXT',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 3: Algoritmi (pag. 66–67)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '🤖',
    color: 'from-green-600 to-emerald-700',
    metaDescription: 'Programarea roboților educaționali LEGO NXT în mediul Open Roberta Lab: utilizarea senzorilor de distanță cu ultrasunete, a senzorilor tactili și de culoare pentru evitarea obstacolelor.',
    keywords: [
      'robotica gimnaziu open roberta',
      'robot nxt lego senzori',
      'senzor distanta ultrasonic',
      'algoritm ocolire obstacole roboti',
      'navigare labirint senzor culoare'
    ],
    competencies: [
      {
        code: '2.2',
        description: 'Construirea unor algoritmi simpli pentru controlul roboților didactici virtuali echipați cu senzori.'
      },
      {
        code: '3.3',
        description: 'Implementarea algoritmilor de navigare autonomă în mediul de programare grafică Open Roberta Lab (NEPO).'
      }
    ],
    theorySections: [
      {
        title: 'Mediul Open Roberta Lab și Robotul Educațional NXT',
        content: [
          'Open Roberta Lab (lab.open-roberta.org) este o platformă cloud gratuită creată de Fraunhofer IAIS pentru simularea roboților educaționali.',
          'Limbajul utilizat este NEPO, un limbaj grafic bazat pe blocuri vizuale, foarte apropiat ca filosofie de Scratch.',
          'Robotul studiat este LEGO NXT, echipat cu microcontroler, 2 motoare independente de tracțiune (stânga/dreapta) și porturi pentru senzori periferici:',
          '• Port 4: Senzor ultrasonic de distanță.',
          '• Port 1: Senzor tactil (buton de coliziune).',
          '• Port 3: Senzor optic de culoare și luminozitate.'
        ],
        tips: 'În simulatorul Open Roberta poți adăuga obstacole geometrice proprii și poți activa desenarea traiectoriei robotului pentru a vedea exact drumul parcurs!'
      },
      {
        title: 'Algoritmul de Ocolire Autonomă a Obstacolelor',
        content: [
          'Măsurarea distanței: Senzorul ultrasonic emite pulsuri de sunet de înaltă frecvență și calculează distanța până la primul obstacol în centimetri.',
          'Logica decizională a programului A (pag. 66):',
          'Repetă la infinit:',
          '1. Măsoară distanța cu senzorul de la portul 4.',
          '2. Dacă distanța > 20 cm: drumul este liber -> acționează ambele motoare înainte la viteza de 30%.',
          '3. Altfel (distanța $\le$ 20 cm): detectare obstacol -> oprește mersul înainte și întoarce robotul spre stânga cu viteza de 30% pentru a-l ocoli.',
          'După viraj, robotul măsoară din nou și, dacă drumul s-a eliberat, reia deplasarea înainte.'
        ],
        tips: 'Dacă mărești pragul de distanță de la 20 cm la 40 cm, robotul va începe manevra de evitare din timp, evitând coliziunile la viteze mari!'
      },
      {
        title: 'Algoritmul de Rezolvare a Labirintului cu Senzori Multipli',
        content: [
          'Pentru ieșirea dintr-un labirint complex, robotul folosește simultan 3 senzori (Programul B, pag. 67):',
          '• Variabila Orientare (inițializată cu 0): reține unghiul curent de rotație al robotului.',
          '• Senzorul ultrasonic (port 4): verifică dacă este spațiu în față (> 20 cm); dacă da, merge 20 cm înainte, virează stânga 90° și scade 90 din Orientare.',
          '• Senzorul tactil (port 1): dacă se ciocnește de un perete, merge înapoi 5 cm, virează dreapta 90° și adaugă 90 la Orientare.',
          '• Senzorul de culoare (port 3): verifică permanent culoarea suprafeței pe care se deplasează. Când întâlnește culoarea ROȘIE (marcajul de ieșire), iese din buclă și oprește motoarele!'
        ],
        tips: 'Senzorul de culoare acționează ca o santinelă care semnalizează atingerea țintei finale a misiunii!'
      }
    ],
    keyTerms: [
      { term: 'Open Roberta Lab', definition: 'Platformă online pentru învățarea roboticii și simularea roboților în limbajul grafic NEPO.' },
      { term: 'Senzor ultrasonic', definition: 'Dispozitiv care măsoară distanța în centimetri până la un obstacol prin unde sonore reflectate.' },
      { term: 'Senzor tactil', definition: 'Comutator fizic care detectează coliziunea sau contactul direct cu un obstacol.' },
      { term: 'Senzor de culoare', definition: 'Dispozitiv optic care identifică culorile suprafețelor (roșu, verde, albastru, negru).' }
    ],
    shortcuts: [
      { key: 'Space', action: 'Pornește sau pune pe pauză simularea scenei robotice' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Configurarea scenei robotice',
        task: 'Deschide simulatorul, plasează un obstacol dreptunghiular în fața robotului și testează distanța ultrasonică raportată.'
      },
      {
        step: 2,
        title: 'Programarea ocolirii automate',
        task: 'Implementează bucla infinită cu decizia: distanță > 20 cm -> mers înainte; altfel -> viraj stânga de 90°.'
      },
      {
        step: 3,
        title: 'Misiunea „Evadarea din Labirint”',
        task: 'Configurează senzorul tactil pentru redresare la impact și senzorul de culoare pentru oprire automată pe linia roșie de finish.'
      }
    ],
    faq: [
      {
        question: 'Cum funcționează senzorul ultrasonic de pe portul 4 al robotului NXT?',
        answer: 'Emite o undă acustică de înaltă frecvență care ricoșează din obstacol și măsoară timpul necesar ecoului să revină la receptor.'
      },
      {
        question: 'De ce folosim variabila Orientare în algoritmul labirintului?',
        answer: 'Pentru a ține evidența direcției relative a robotului (adunând 90° la dreapta și scăzând 90° la stânga) pentru mișcări ordonate.'
      }
    ],
    testQuestions: [
      {
        question: 'Ce senzor este utilizat pentru a măsura distanța până la un obstacol fără a-l atinge?',
        options: [
          'Senzorul tactil (touch sensor)',
          'Senzorul ultrasonic (distanță)',
          'Senzorul de temperatură',
          'Senzorul de sunet'
        ],
        correctIndex: 1,
        explanation: 'Senzorul ultrasonic măsoară distanța prin unde de sunet reflectate, fără a necesita contact fizic cu obiectul.'
      },
      {
        question: 'Ce acțiune execută robotul în Programul B când senzorul de culoare detectează roșu?',
        options: [
          'Accelerează la viteza maximă',
          'Virează 180 de grade',
          'Iese din buclă și oprește programul',
          'Schimbă culoarea fundalului'
        ],
        correctIndex: 2,
        explanation: 'Detecția culorii roșii marchează ieșirea din labirint și declanșează instrucțiunea de ieșire din buclă (oprirea robotului).'
      },
      {
        question: 'Cum se numește limbajul grafic integrat în platforma Open Roberta Lab?',
        options: [
          'Scratch',
          'NEPO',
          'Python',
          'JavaScript'
        ],
        correctIndex: 1,
        explanation: 'Limbajul vizual de programare bazat pe blocuri din Open Roberta se numește NEPO.'
      }
    ]
  },

  {
    id: 'g8_algo_c',
    slug: 'cpp-siruri-reguli-fibonacci-triunghiulare',
    title: 'Șiruri de Valori: Reguli de Generare, Fibonacci & Numere Triunghiulare',
    shortTitle: 'Șiruri, Fibonacci & Reguli',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 3: Algoritmi (pag. 68–71)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '🌀',
    color: 'from-amber-500 to-rose-600',
    metaDescription: 'Algoritmi esențiali pe șiruri de numere în C++: distincția n termeni vs valori <= n, șirul lui Fibonacci și spirala de aur, numere triunghiulare, pătratice și piramidale.',
    keywords: [
      'siruri de valori c++',
      'sirul lui fibonacci spirala de aur',
      'numere triunghiulare formula',
      'generare siruri reguli matematice',
      'numere patratice piramidale'
    ],
    competencies: [
      {
        code: '2.1',
        description: 'Identificarea șirurilor de valori în diferite contexte de prelucrare în vederea construirii algoritmilor.'
      },
      {
        code: '2.2',
        description: 'Rezolvarea unor probleme simple prin construirea unor algoritmi de generare a șirurilor de valori pe baza unor reguli.'
      }
    ],
    theorySections: [
      {
        title: 'Ce este un Șir de Valori? Diferența dintre Două Tipuri de Cerințe',
        content: [
          'Un șir de valori este o succesiune ordonată de elemente omogene (de același tip, cum ar fi șirul numerelor naturale, pare sau impare).',
          'Diferență critică de algoritm evidențiată în manual (pag. 68–69):',
          '1. „Afișarea primelor n valori” (Problemă A):',
          '   • Știm exact câți termeni vrem să afișăm ($n$). Folosim o buclă for sau while cu un contor $i$ de la 1 la $n$, afișând $2 \cdot i$.',
          '2. „Afișarea valorilor din șir mai mici sau egale cu n” (Problemă B):',
          '   • Valoarea termenului nu trebuie să depășească $n$. Condiția buclei este $i \le n$, cu pasul $i = i + 2$.',
          'Exemplu pentru $n = 11$:',
          '• Primele 11 numere pare: 2 4 6 8 10 12 14 16 18 20 22 (11 numere afișate).',
          '• Numerele pare $\le 11$: 2 4 6 8 10 (doar 5 numere afișate!).'
        ],
        tips: 'Citește cu atenție enunțul problemei: dacă cere „primii n termeni” folosești contor de numărare, dacă cere „termeni $\le n$” testezi valoarea elementului!'
      },
      {
        title: 'Șirul lui Fibonacci și Spirala de Aur în Natură',
        content: [
          'Popularizat de matematicianul italian Leonardo din Pisa (Fibonacci): 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...',
          'Regula de formare: primele două valori sunt 0 și 1, iar fiecare nou termen este suma ultimilor doi termeni precedenți: $F_i = F_{i-1} + F_{i-2}$.',
          'Spirala de aur: desenând pătrate cu laturile egale cu numerele Fibonacci și unind colțurile prin arce de cerc, se obține spirala de aur, regăsită în cochiliile melcilor, floarea-soarelui și galaxii.',
          'Algoritmul optim C++ cu variabile glisante (fără vectori):',
          'p = 0; d = 1; // primii doi termeni',
          'cout << p << " " << d << " ";',
          'for (i = 3; i <= n; i++) {',
          '    c = p + d; // noul termen calculat',
          '    cout << c << " ";',
          '    p = d;     // glisăm valorile pentru pasul următor',
          '    d = c;',
          '}'
        ],
        tips: 'Tehnica variabilelor glisante (p, d, c) economisește memorie deoarece nu stochează tot șirul în vectori, ci doar ultimele două numere necesare!'
      },
      {
        title: 'Șiruri cu Formule Geometrice: Triunghiulare, Pătratice & Piramidale',
        content: [
          'Numere Triunghiulare (pag. 71): reprezintă numărul de bile necesare pentru a forma un triunghi echilateral (1, 3, 6, 10, 15, 21, 28, 36, 45, 55...).',
          '• Formula matematică: $T_n = \frac{n(n+1)}{2}$.',
          '• În C++ se generează cu bucla: while (i <= n) { cout << (i * (i + 1)) / 2 << " "; i++; }',
          'Numere Pătratice: numărul de puncte care formează un pătrat ($n^2$: 1, 4, 9, 16, 25...).',
          'Numere Piramidale: suma pătratelor primelor $n$ numere naturale ($1^2 + 2^2 + 3^2 + ... + n^2$).'
        ],
        tips: 'Formula lui Gauss pentru suma primelor n numere este exact formula numerelor triunghiulare: $1 + 2 + ... + n = \frac{n(n+1)}{2}$!'
      }
    ],
    keyTerms: [
      { term: 'Șirul lui Fibonacci', definition: 'Șirul matematic în care fiecare termen (începând cu al treilea) este egal cu suma celor doi termeni anteriori.' },
      { term: 'Variabile glisante', definition: 'Tehnică algoritmică de actualizare a două variabile succesive pentru a genera recurent termenul următor.' },
      { term: 'Număr triunghiular', definition: 'Număr figurativ dat de formula n(n+1)/2 reprezentând numărul de puncte dispuse într-un triunghi.' },
      { term: 'Număr pătratic', definition: 'Pătratul unui număr natural (n * n) reprezentând numărul de puncte dispuse într-o grilă pătrată.' }
    ],
    shortcuts: [
      { key: 'Ctrl + C / V', action: 'Copiere și lipire cod sursă în editor' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Generarea primelor n numere pare vs. numere pare <= n',
        task: 'Scrie cele două programe C++ pentru n = 15 și compară numărul de valori afișate la ieșire.'
      },
      {
        step: 2,
        title: 'Implementarea șirului Fibonacci',
        task: 'Scrie programul C++ care citește n (2 < n <= 30) și afișează primii n termeni Fibonacci folosind variabilele glisante p, d, c.'
      },
      {
        step: 3,
        title: 'Generarea numerelor triunghiulare',
        task: 'Calculează și afișează primele 10 numere triunghiulare folosind formula (i*(i+1))/2.'
      }
    ],
    faq: [
      {
        question: 'De ce bucla Fibonacci din manual pornește de la i = 3?',
        answer: 'Deoarece primii doi termeni (0 și 1) sunt deja cunoscuți și afișați înainte de buclă, generarea începând de la al 3-lea termen.'
      },
      {
        question: 'Care este al 44-lea element din șirul 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, ...?',
        answer: 'Fiecare număr k apare de k ori. Suma aparițiilor primelor 8 numere este 1+2+...+8 = 36, iar pentru 9 numere este 45. Al 44-lea element este așadar 9 (pag. 71 din manual).'
      }
    ],
    testQuestions: [
      {
        question: 'Care sunt primii 6 termeni ai șirului lui Fibonacci pornind de la 0 și 1?',
        options: [
          '0, 1, 2, 3, 4, 5',
          '0, 1, 1, 2, 3, 5',
          '1, 2, 4, 8, 16, 32',
          '1, 3, 6, 10, 15, 21'
        ],
        correctIndex: 1,
        explanation: 'Fiecare termen este suma celor doi anteriori: 0+1=1, 1+1=2, 1+2=3, 2+3=5. Primii 6 sunt 0, 1, 1, 2, 3, 5.'
      },
      {
        question: 'Care este formula de calcul pentru al n-lea număr triunghiular?',
        options: [
          'n * n',
          '(n * (n + 1)) / 2',
          '2 * n - 1',
          'n * (n - 1)'
        ],
        correctIndex: 1,
        explanation: 'Numărul de puncte dintr-un triunghi de latură n este dat de formula sumei numerelor de la 1 la n: (n*(n+1))/2.'
      },
      {
        question: 'Ce afișează un program care generează numerele pare mai mici sau egale cu n, pentru n = 7?',
        options: [
          '2 4 6 8 10 12 14',
          '2 4 6',
          '0 2 4 6 8',
          '1 3 5 7'
        ],
        correctIndex: 1,
        explanation: 'Numerele naturale pare nenule mai mici sau egale cu 7 sunt doar 2, 4 și 6.'
      }
    ]
  },

  {
    id: 'g8_algo_d',
    slug: 'cpp-operatii-siruri-citire-filtrare-numarare',
    title: 'Prelucrarea Șirurilor în C++: Citire, Parcurgere, Filtrare & Numărare',
    shortTitle: 'Citire, Filtrare & Contor în C++',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 3: Algoritmi (pag. 72–77)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '🔢',
    color: 'from-orange-600 to-amber-700',
    metaDescription: 'Operații pe șiruri de numere în C++: citire cu număr cunoscut n sau cu santinelă 0, afișare interval [a, b], filtrare după proprietăți și tehnica contorului de numărare cnt.',
    keywords: [
      'citire sir numere c++',
      'citire cu santinela while val diferit de 0',
      'filtrare proprietati sir numere',
      'numarare elemente contor c++',
      'problema temperaturi caniculare preturi rotunde'
    ],
    competencies: [
      {
        code: '2.1',
        description: 'Identificarea modalităților de introducere și parcurgere a unei secvențe de valori numerice.'
      },
      {
        code: '2.2',
        description: 'Construirea unor algoritmi de numărare a elementelor dintr-un șir care îndeplinesc o condiție dată.'
      }
    ],
    theorySections: [
      {
        title: 'Modalități de Citire și Parcurgere a Șirurilor de Valori',
        content: [
          'Citirea unui șir reprezintă introducerea succesivă a elementelor și procesarea lor:',
          '1. Citirea cu număr cunoscut de termeni:',
          '   • Se citește numărul de elemente $n$, apoi se utilizează o buclă for:',
          '   cin >> n;',
          '   for (i = 1; i <= n; i++) { cin >> val; /* prelucrare val */ }',
          '2. Citirea cu condiție de oprire / valoare santinelă:',
          '   • Când nu se știe dinainte lungimea șirului, se citește până la întâlnirea unei valori speciale (de obicei 0):',
          '   cin >> val;',
          '   while (val != 0) { /* prelucrare val */ cin >> val; }',
          '3. Parcurgerea unui interval [a, b] și afișarea în ordine descrescătoare:',
          '   cin >> a >> b; for (i = b; i >= a; i--) cout << i << " ";'
        ],
        tips: 'La citirea cu santinelă 0, valoarea 0 marchează doar sfârșitul datelor și nu trebuie inclusă în calcule sau numărători!'
      },
      {
        title: 'Verificarea Proprietăților & Filtrarea Termenilor',
        content: [
          'Filtrarea presupune parcurgerea șirului și afișarea exclusivă a elementelor care respectă o condiție cerută.',
          'Exemple din manual:',
          '• Afișarea doar a numerelor pare dintr-un interval: if (val % 2 == 0) cout << val << " ";',
          '• Afișarea numerelor mai mari decât un prag dat a (pag. 75): se citesc n și a, apoi la fiecare număr citit: if (val > a) cout << val << " ";',
          '• Afișarea numerelor divizibile cu 3: if (val % 3 == 0) cout << val << " ";',
          '• Filtrare după ultima cifră: dacă ultima cifră este 2: if (val % 10 == 2) cout << val << " ";'
        ],
        tips: 'Operatorul modulo (%) returnează restul împărțirii întregi: val % 2 este 0 pentru numere pare și 1 pentru impare!'
      },
      {
        title: 'Algoritmul de Numărare a Elementelor (Tehnica Contorului)',
        content: [
          'Când trebuie să aflăm CÂTE elemente respectă o proprietate, folosim o variabilă contor (denumită uzual cnt):',
          'Pașii algoritmului universal de numărare:',
          '1. Inițializăm contorul cu 0 înainte de citire: cnt = 0;',
          '2. Citim pe rând fiecare element val;',
          '3. Testăm condiția: dacă este respectată, incrementăm contorul: if (condiție) cnt++;',
          '4. După finalizarea buclei, afișăm valoarea acumulată: cout << cnt;',
          'Aplicații din manual:',
          '• Meteorologie (pag. 76): numărarea zilelor caniculare dintr-o lună (temperaturi > 30.0°C).',
          '• Supermarket (pag. 77): numărarea produselor cu preț rotund (divizibil cu 10: pret % 10 == 0).',
          '• Performanță școlară: numărarea notelor la test care sunt $\ge 8$.'
        ],
        tips: 'Nu uita niciodată să inițializezi contorul cu 0 (cnt = 0), altfel va conține o valoare reziduală aleatorie din memorie!'
      }
    ],
    keyTerms: [
      { term: 'Valoare santinelă', definition: 'O valoare prestabilită (de exemplu 0) care semnalizează sfârșitul secvenței de intrare a datelor.' },
      { term: 'Filtrare', definition: 'Operația de selectare și afișare doar a acelor elemente dintr-un flux de date care satisfac o condiție logică.' },
      { term: 'Variabilă contor (cnt)', definition: 'O variabilă întreagă inițializată cu zero care se incrementează cu 1 la fiecare apariție a unui eveniment/element valid.' },
      { term: 'Operatorul Modulo (%)', definition: 'Operatorul care returnează restul împărțirii întregi a două numere.' }
    ],
    shortcuts: [
      { key: 'cnt++', action: 'Prescurtarea C++ pentru cnt = cnt + 1 (incrementare)' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Citirea unui șir cu număr cunoscut n de termeni',
        task: 'Scrie un program care citește n numere întregi și le afișează doar pe cele care sunt pozitive.'
      },
      {
        step: 2,
        title: 'Numărarea zilelor caniculare',
        task: 'Citește z zile și temperaturile reale corespunzătoare. Numără câte temperaturi depășesc 30.0 grade Celsius.'
      },
      {
        step: 3,
        title: 'Citire cu santinela 0 și numărarea numerelor cu ultima cifră 6',
        task: 'Citește numere naturale până la apariția lui 0 și afișează câte dintre ele se termină cu cifra 6 (nr % 10 == 6).'
      }
    ],
    faq: [
      {
        question: 'Ce se întâmplă dacă utilizatorul introduce direct 0 la o citire cu santinelă?',
        answer: 'Bucla while (val != 0) nu se va executa nici măcar o dată, iar contorul va rămâne corect 0.'
      },
      {
        question: 'De ce este important să citim n înainte de bucla for?',
        answer: 'Pentru că n reprezintă condiția de oprire a buclei (i <= n) și trebuie să fie cunoscut de calculator înainte de începerea iterațiilor.'
      }
    ],
    testQuestions: [
      {
        question: 'Ce valoare trebuie să aibă inițial variabila contor cnt înainte de parcurgerea șirului?',
        options: [
          '1',
          '0',
          '-1',
          'Valoarea primului număr citit'
        ],
        correctIndex: 1,
        explanation: 'Contorul trebuie inițializat cu 0, deoarece înainte de a citi șirul am găsit zero elemente conforme.'
      },
      {
        question: 'Cum verificăm în C++ dacă un preț întreg este rotund (terminat cu cifra 0)?',
        options: [
          'if (pret / 10 == 0)',
          'if (pret % 10 == 0)',
          'if (pret == 10)',
          'if (pret % 2 == 0)'
        ],
        correctIndex: 1,
        explanation: 'Restul împărțirii la 10 (pret % 10) oferă ultima cifră a numărului. Dacă restul este 0, numărul se termină cu 0.'
      },
      {
        question: 'Ce structură repetitivă este recomandată când nu știm numărul de termeni, ci doar o condiție de oprire?',
        options: [
          'Bucla for cu contor fix',
          'Bucla while sau do-while',
          'Instrucțiunea switch',
          'Instrucțiunea break simplă'
        ],
        correctIndex: 1,
        explanation: 'Buclele condiționate anterior (while) sau posterior (do-while) sunt concepute special pentru număr necunoscut de pași.'
      }
    ]
  },

  {
    id: 'g8_algo_e',
    slug: 'cpp-semafoare-cautare-min-max-proiect-liceu',
    title: 'Semafoare, Căutare Secvențială, Min/Max & Proiectul Integrator Liceu',
    shortTitle: 'Semafoare, Căutare & Min/Max',
    grade: 'Clasa a VIII-a',
    unit: 'Unitatea 3: Algoritmi (pag. 78–96)',
    manualRef: 'Manual Art Klett 2025 — OMEN 3393/2017 & OM 5420/2024',
    icon: '🏆',
    color: 'from-red-600 to-rose-700',
    metaDescription: 'Algoritmi avansați pe șiruri în C++: verificarea cu variabilă semafor/flag, căutare secvențială cu oprire timpurie, calcul minim/maxim cu reținere poziție, sumă/produs și Proiectul de final de ciclu gimnazial Liceul Preferat.',
    keywords: [
      'variabila semafor flag c++',
      'cautare secventiala oprire timpurie',
      'minim si maxim sir valori pozitie',
      'suma si produsul elementelor',
      'proiect admitere liceul preferat'
    ],
    competencies: [
      {
        code: '2.1',
        description: 'Construirea de algoritmi pentru căutarea elementelor și calculul extremelor (min/max) într-un șir.'
      },
      {
        code: '2.2',
        description: 'Utilizarea variabilelor logice de tip semafor pentru validarea proprietăților globale ale unui set de date.'
      },
      {
        code: '3.3',
        description: 'Realizarea proiectului integrator „Liceul Preferat” prin prelucrare statistică procentuală a datelor în C++.'
      }
    ],
    theorySections: [
      {
        title: 'Verificarea Proprietăților Globale: Variabila Tip Semafor (Flag)',
        content: [
          'Când trebuie să verificăm dacă TOATE elementele unui șir îndeplinesc o condiție, avem două metode (pag. 78):',
          '• Metoda 1 (cu contor): numărăm elementele valide și verificăm la final dacă cnt == n.',
          '• Metoda 2 (cu variabilă semafor ok):',
          '  1. Presupunem că toate sunt valide: ok = 1;',
          '  2. Citim fiecare valoare; dacă găsim un singur element care NU respectă proprietatea, trecem semaforul pe roșu: ok = 0;',
          '  3. La final: if (ok == 1) cout << "DA"; else cout << "NU";',
          'Negația logică (Legile lui De Morgan): Pentru a verifica dacă o piesă auto NU respectă toleranța de diametru [2.5, 3.0] cm:',
          'Proprietatea corectă este (d >= 2.5 && d <= 3.0). Negația sa este !(d >= 2.5 && d <= 3.0) echivalent cu (d < 2.5 || d > 3.0).'
        ],
        tips: 'Variabila semafor este mult mai rapidă deoarece își schimbă valoarea pe 0 la prima abatere depistată!'
      },
      {
        title: 'Căutarea Secvențială a unui Element X în Șir',
        content: [
          'Căutarea verifică dacă o anumită valoare căutată $X$ există în șirul de $n$ numere (pag. 81–84):',
          '• Folosim un flag de căutare: int gasit = 0, poz = 0;',
          '• La fiecare pas: if (val == X) { gasit = 1; poz = i; }',
          '• Optimizare cu oprire timpurie: bucla se poate opri imediat ce elementul a fost găsit, folosind condiția: for (i = 1; i <= n && gasit == 0; i++).',
          '• La final: if (gasit == 1) cout << "DA, pe pozitia " << poz; else cout << "NU EXISTA";'
        ],
        tips: 'Oprirea timpurie cu && gasit == 0 economisește timp de procesare atunci când căutăm într-o listă de mii de înregistrări!'
      },
      {
        title: 'Aflarea Minimului, Maximului, Sumei și Produsului',
        content: [
          'Algoritmul de Maxim (pag. 83):',
          '• Inițializare: citim primul număr și îl considerăm maximul provizoriu: cin >> nr; max = nr; pozM = 1;',
          '• Parcurgere: for (i = 2; i <= n; i++) { cin >> nr; if (nr > max) { max = nr; pozM = i; } }',
          'Algoritmul de Minim (pag. 85): similar, dar cu condiția if (nr < min) { min = nr; pozMin = i; }.',
          'Suma și Produsul (pag. 86–89):',
          '• Suma se inițializează obligatoriu cu 0: s = 0; s += val;',
          '• Produsul se inițializează obligatoriu cu 1: p = 1; p *= val; (dacă l-ai inițializa cu 0, rezultatul ar fi mereu 0!).'
        ],
        tips: 'Inițializează întotdeauna max cu primul element al șirului, nu cu 0, pentru ca algoritmul să funcționeze corect și dacă toate numerele sunt negative (ex: -10, -5, -20)!'
      },
      {
        title: 'Proiectul Integrator de Final de Gimnaziu: „Liceul Preferat”',
        content: [
          'Proiectul de sinteză la finalul clasei a VIII-a (pag. 90):',
          '• Elevii clasei răspund la un sondaj acordând note de la 1 la 5 pentru opțiunile lor de liceu.',
          '• Programul C++ citește numărul de elevi $n$ și notele acordate 1..5, numără frecvențele fiecărei opțiuni (nr1, nr2, nr3, nr4, nr5) și calculează ponderile procentuale reale:',
          '  cout << "% valoare 5: " << (float)nr5 / n * 100 << "%";',
          '• Rezultatele sunt exportate în Excel pentru generarea diagramei plăcintă cu opțiunile clasei pentru admiterea la liceu!'
        ],
        tips: 'Conversia explicită (float)nr5 / n este obligatorie pentru a evita împărțirea întreagă care ar da 0!'
      }
    ],
    keyTerms: [
      { term: 'Semafor (Flag)', definition: 'Variabilă indicator (0 sau 1) folosită pentru a reține dacă o condiție a fost încălcată sau un element a fost găsit.' },
      { term: 'Căutare secvențială', definition: 'Algoritm ce verifică succesiv fiecare element al unui șir până la găsirea valorii căutate sau epuizarea datelor.' },
      { term: 'Maxim / Minim cu poziție', definition: 'Determinarea celei mai mari sau mai mici valori dintr-un șir, reținând și indexul (poziția) la care se află.' },
      { term: 'Proiectul Liceul Preferat', definition: 'Proiectul interdisciplinar de final de gimnaziu ce combină sondajul statistic, programarea C++ și diagramele Excel.' }
    ],
    shortcuts: [
      { key: 'F4 / Ctrl+F4', action: 'Rulare până la cursor în modul Debug' }
    ],
    practicalLabs: [
      {
        step: 1,
        title: 'Validare toleranță piese auto cu semafor',
        task: 'Scrie programul C++ care citește diametrele a n piese auto și afișează „DA” dacă toate au diametrul între 2.5 și 3.0 cm, sau „NU” altfel.'
      },
      {
        step: 2,
        title: 'Căutarea secvențială a unui număr X',
        task: 'Citește n și X, apoi un șir de n numere. Afișează „DA” și poziția primului număr găsit egal cu X, sau „NU” dacă nu există.'
      },
      {
        step: 3,
        title: 'Programul de statistică „Liceul Preferat”',
        task: 'Implementează programul complet din manual (pag. 90) care calculează procentele elevilor pentru cele 5 opțiuni de vot și afișează rezultatele formatate.'
      }
    ],
    faq: [
      {
        question: 'De ce este greșit să inițializăm variabila max cu 0?',
        answer: 'Dacă toate numerele din șir sunt negative (de exemplu -8, -15, -3), un max inițializat cu 0 ar rămâne 0, deși 0 nu face parte din șir! Inițializarea corectă este cu primul element citit.'
      },
      {
        question: 'De ce produsul se inițializează cu 1 și nu cu 0?',
        answer: 'Elementul neutru la înmulțire este 1. Dacă inițializăm p = 0, orice înmulțire ulterioară p = p * val va da 0.'
      }
    ],
    testQuestions: [
      {
        question: 'Cum se inițializează corect o variabilă semafor ok atunci când verificăm dacă toate elementele respectă o regulă?',
        options: [
          'ok = 0 (presupunem că niciunul nu respectă)',
          'ok = 1 (presupunem că toate respectă până la proba contrarie)',
          'ok = -1',
          'ok = 100'
        ],
        correctIndex: 1,
        explanation: 'Se pleacă de la presupunerea optimistă ok = 1, iar la prima abatere întâlnită semaforul devine 0.'
      },
      {
        question: 'Ce condiție este echivalentă prin legile lui De Morgan cu negația intervalului !(d >= 2.5 && d <= 3.0)?',
        options: [
          'd < 2.5 && d > 3.0',
          'd < 2.5 || d > 3.0',
          'd == 2.5 || d == 3.0',
          'd <= 2.5 && d >= 3.0'
        ],
        correctIndex: 1,
        explanation: 'Negația unei conjuncții (ȘI) devine o disjuncție (SAU) a negațiilor: !(A && B) = !A || !B, adică (d < 2.5 || d > 3.0).'
      },
      {
        question: 'Cu ce valoare trebuie inițializată variabila produs p înainte de a calcula produsul unui șir?',
        options: [
          'p = 0;',
          'p = 1;',
          'p = 10;',
          'p = -1;'
        ],
        correctIndex: 1,
        explanation: '1 este elementul neutru la înmulțire ($1 \cdot x = x$), în timp ce 0 ar anula complet orice produs.'
      }
    ]
  }
];
