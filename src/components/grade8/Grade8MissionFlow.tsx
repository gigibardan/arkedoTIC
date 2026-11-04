import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Globe,
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Star,
  Award,
  Terminal,
  Layers,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Play,
  Bug,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { GRADE_8_CURRICULA_MODULES } from '../../data/grade8Curricula';
import { ExcelLabSim, WebStudioSim, CppSequencesSim, NxtRobotSim } from './Grade8InteractiveSimulators';
import { GRADE_8_EN_MAP } from './Grade8CatalogSection';

interface Grade8MissionFlowProps {
  missionId: string;
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const Grade8MissionFlow: React.FC<Grade8MissionFlowProps> = ({
  missionId,
  currentLevel,
  onCompletePage,
  studentName = 'Elev',
  onReturnToCatalog
}) => {
  const { lang } = useLanguage();

  const moduleData = GRADE_8_CURRICULA_MODULES.find(m => m.missionId === missionId) || GRADE_8_CURRICULA_MODULES[0];
  const enInfo = GRADE_8_EN_MAP[missionId];

  // Level 1 Quiz State
  const [l1SelectedAnswer, setL1SelectedAnswer] = useState<number | null>(null);
  const [l1AnswerSubmitted, setL1AnswerSubmitted] = useState<boolean>(false);
  const [l1ActiveConceptIdx, setL1ActiveConceptIdx] = useState<number>(0);

  // Level 3 Debugging Quiz State
  const [l3SelectedAnswer, setL3SelectedAnswer] = useState<number | null>(null);
  const [l3Submitted, setL3Submitted] = useState<boolean>(false);

  // Level 4 Scenario Multi-step State
  const [l4StepsCompleted, setL4StepsCompleted] = useState<Record<number, boolean>>({});

  // Level 5 Summative Assessment Answers
  const [l5Answers, setL5Answers] = useState<Record<number, number>>({});
  const [l5Submitted, setL5Submitted] = useState<boolean>(false);

  // Debugging Scenarios for Level 3 for each of the 12 curriculum modules
  const getDebugScenario = () => {
    switch (missionId) {
      case 'g8_calc_a':
        return {
          title: lang === 'en' ? 'Excel Debug: Cell Coordinates & Data Types' : 'Depanare Excel: Confuzii de Adresare & Tipuri de Date',
          code: 'Adresă: 2B (Incorect)  vs  B2 (Corect)\nFormat celulă: "150 lei" scris direct (Text) -> nu poate fi calculat cu =SUM()!\nCorect: Valoare introdusă: 150, Format de celulă aplicat: Monedă (Currency lei)',
          question: lang === 'en'
            ? 'What happens if a student types "150 lei" as text in a cell instead of typing 150 and applying the Currency format?'
            : 'Ce se întâmplă dacă scrii direct textul „150 lei” într-o celulă în loc să introduci 150 și să aplici formatul Monedă (Currency)?',
          options: lang === 'en' ? [
            'Excel will automatically add 19% VAT',
            'Excel treats the cell as Text, so mathematical formulas (=SUM, =AVERAGE) ignore it or throw an error',
            'The program automatically converts the sum into Euros at the central bank rate',
            'The cell locks and becomes uneditable'
          ] : [
            'Excel va adăuga automat TVA de 19%',
            'Excel tratează celula ca Text, iar formulele matematice (=SUM, =AVERAGE) o vor ignora sau vor produce eroare',
            'Programul convertește automat suma în euro la cursul BNR',
            'Celula se blochează și devine needitabilă'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'Typing the currency unit directly into the cell converts its data type from Numeric to Text. To compute formulas, numeric values must remain pure, while monetary symbols are added exclusively via Format Cells -> Currency.'
            : 'Introducerea unității de măsură ca text direct în celulă transformă tipul valorii din Numeric în Text. Pentru a putea efectua calcule matematice, numărul trebuie să fie pur, iar unitatea de măsură se adaugă doar prin Format Cells -> Currency.'
        };

      case 'g8_calc_b':
        return {
          title: lang === 'en' ? 'Excel Debug: Relative vs Absolute Cell Addressing ($)' : 'Depanare Formule: Referințe Absolute ($) & Erori de Sintaxă',
          code: 'Formulă în D2: =B2 * C1   (C1 = cota TVA 19%)\nCopiată în D3: =B3 * C2   -> C2 este o celulă goală! Rezultat eronat: 0 lei\nFormulă corectată: =B2 * $C$1 (la copiere rămâne fix $C$1)',
          question: lang === 'en'
            ? 'Why is the dollar sign ($) necessary (e.g. $C$1) when copying formulas with fixed parameters (like VAT or exchange rate)?'
            : 'De ce este obligatoriu simbolul $ ($C$1) când copiem o formulă care folosește o celulă fixă de referință (ex. cota TVA sau cursul valutar)?',
          options: lang === 'en' ? [
            'To round the value to the nearest integer',
            'To lock the column and row (absolute reference) preventing address drift when dragging the formula down',
            'To convert the amount to US Dollars',
            'To hide the formula from other users of the sheet'
          ] : [
            'Pentru a rotunji valoarea la cel mai apropiat întreg',
            'Pentru a transforma adresa relativă în adresă absolută, blocând rândul și coloana la copiere prin glisare',
            'Pentru a converti leii în dolari americani',
            'Pentru a ascunde formula de ceilalți utilizatori ai foii'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'The $ symbol transforms relative references into absolute references ($C$1), locking row and column coordinates to prevent reference shifting during autofill.'
            : 'Simbolul $ transformă referința relativă într-o referință absolută ($C$1), blocând atât coloana cât și rândul, prevenind devierea adresei la glisarea formulei peste alte rânduri.'
        };

      case 'g8_calc_c':
        return {
          title: lang === 'en' ? 'Excel Debug: Conditional Logic with IF & COUNTIF' : 'Depanare Funcții Logice: Sintaxa Funcțiilor IF & COUNTIF',
          code: '=IF(E2 >= 8.5; BURSA; FARA BURSA)   --> Eroare: #NAME? (#NUME?)\n=IF(E2 >= 8.5; "BURSA"; "PROMOVAT")  --> Corect!\n=COUNTIF(B2:B10; ">=5")             --> Numără elevii promovați',
          question: lang === 'en'
            ? 'Why does Excel throw the #NAME? error in the first formula?'
            : 'De ce afișează Excel eroarea #NAME? (#NUME?) în prima formulă de atribuire a bursei?',
          options: lang === 'en' ? [
            'Cell E2 does not contain a valid grade',
            'Return strings (BURSA / FARA BURSA) are missing required double quotation marks "..."',
            'A semicolon ; was used instead of a colon :',
            'The condition >= 8.5 is disallowed in spreadsheets'
          ] : [
            'Celula E2 nu conține o notă validă',
            'Textele returnate (BURSA / FARA BURSA) nu au fost încadrate între ghilimele duble "..."',
            'S-a folosit semnul punct și virgulă ; în loc de două puncte :',
            'Condiția >= 8.5 este interzisă în foile de calcul'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'In Excel, any literal text string returned by a formula must be wrapped in double quotes ("..."). Without quotes, Excel assumes it is an undefined function or named range and throws #NAME?.'
            : 'În Excel, orice text literal returnat de o formulă trebuie închis obligatoriu între ghilimele duble ("..."). Fără ghilimele, Excel presupune că BURSA este numele unei funcții sau al unui domeniu denumit și afișează #NAME?.'
        };

      case 'g8_calc_d':
        return {
          title: lang === 'en' ? 'Excel Debug: Chart Data Ranges & Visual Types' : 'Depanare Diagrame: Selecția Seriilor de Date & Tipul Optim',
          code: 'Tabel: Luna (Ianuarie - Decembrie) și Temperatura Medie (-2°C .. +24°C)\nGreșeală: Crearea unei diagrame circulare (Pie) cu 12 felii greu lizibile\nSoluție optimă: Diagramă cu linii (Line) sau coloane (Column) cu antetul inclus!',
          question: lang === 'en'
            ? 'Why is a Pie chart inappropriate for illustrating temperature trends over 12 months?'
            : 'De ce este neindicată o diagramă circulară (Pie) pentru a ilustra evoluția temperaturii pe parcursul celor 12 luni?',
          options: lang === 'en' ? [
            'Pie charts are reserved exclusively for monetary budgets',
            'A Pie chart illustrates proportions of a whole (100%), not chronological trends; line or column charts should be used for time series',
            'Excel restricts Pie charts to a maximum of 4 slices',
            'Temperature values contain degree symbols'
          ] : [
            'Diagramele Pie sunt rezervate exclusiv sumelor de bani în lei',
            'Diagrama circulară arată proporțiile unui întreg (total 100%), nu evoluția în timp; pentru evoluții temporale se folosesc Linii sau Coloane',
            'Programul Excel nu permite diagrame circulare cu mai mult de 4 felii',
            'Formatul temperaturilor conține grade Celsius'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'Pie charts depict proportional shares of a whole (100%). For chronological trends (temperature, monthly revenue, attendance), line or column charts are standard.'
            : 'Diagramele circulare (Pie) sunt destinate reprezentării ponderilor dintr-un total (100%). Pentru evoluția unei mărimi în timp (temperaturi, vânzări, medii lunare), manualul recomandă diagramele cu linii (Line) sau coloane (Column).'
        };

      case 'g8_web_a':
        return {
          title: lang === 'en' ? 'Web Debug: Site Hierarchy & Mobile Responsiveness' : 'Depanare Web: Structură, Ierarhie & Meniu Responsive',
          code: 'Home -> Activități -> Proiecte -> Robotică -> Senzori -> Cod Sursă\nProblemă: Structură cu 6 nivele adâncime & meniu ilizibil pe ecrane de smartphone',
          question: lang === 'en'
            ? 'What is the recommended best practice for page hierarchy in Google Sites?'
            : 'Care este buna practică recomandată în manual pentru structurarea paginilor unui site Google Sites?',
          options: lang === 'en' ? [
            'Creating at least 10 nested subpage levels for each topic',
            'A clean 2-3 level hierarchy with a simplified responsive menu optimized for mobile screens',
            'Writing all titles strictly in capital letters (CAPS LOCK)',
            'Disabling mobile phone display completely'
          ] : [
            'Crearea a minim 10 nivele de subpagini pentru fiecare temă',
            'O structură aerisită (maxim 2-3 nivele) cu meniu simplu, optimizat pentru navigare comodă pe dispozitive mobile (smartphone/tabletă)',
            'Scrierea tuturor titlurilor exclusiv cu litere mari (CAPS LOCK)',
            'Blocarea afișării pe telefoanele mobile'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'According to modern web design standards (the 3-click rule), effective websites maintain a shallow hierarchy (2-3 levels maximum) with responsive navigation that auto-adapts to small screens.'
            : 'Conform principiilor moderne de web design din manual (regula celor 3 clicuri), un site bine structurat are o adâncime de maximum 2-3 nivele și o navigare responsive adaptabilă automat la ecrane mici.'
        };

      case 'g8_web_b':
        return {
          title: lang === 'en' ? 'Web Debug: Cloud Permissions & External Embeds' : 'Depanare Integrare Media: Permisiuni de Acces la Documentele Cloud',
          code: '<iframe src="https://docs.google.com/forms/d/e/1FAIpQL.../viewform"></iframe>\nEroare vizitatori externi: „Nu aveți permisiunea de a vizualiza acest formular”\nSoluție: Setarea accesului la formular: „Oricine are linkul” (Public)',
          question: lang === 'en'
            ? 'Why do visitors outside the school receive an access denied error when opening an embedded form or slide?'
            : 'De ce primesc vizitatorii externi mesajul „Nu aveți permisiunea” la deschiderea unui formular sau document integrat pe site?',
          options: lang === 'en' ? [
            'The form was deleted from Google servers',
            'The form sharing permission is restricted to internal school domain members instead of Anyone with the link',
            'The visitor browser lacks Microsoft Office installation',
            'Web forms require a paid premium subscription'
          ] : [
            'Formularul a fost șters de pe serverele Google',
            'În setările formularului este bifată restricția „Doar utilizatorii din organizația/școala mea” în loc de acces public',
            'Browserul vizitatorului nu are instalat pachetul Microsoft Office',
            'Pentru formulare web este necesar un abonament cu plată'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'Embedded Google Workspace items retain their Google Drive sharing permissions. For public website accessibility, change access to "Anyone with the link".'
            : 'Documentele Google (Forms, Slides, Sheets) integrate prin iframe păstrează setările de partajare din Google Drive. Pentru a fi vizibile pe un site public, permisiunea trebuie setată pe „Oricine are linkul”.'
        };

      case 'g8_web_c':
        return {
          title: lang === 'en' ? 'Web Debug: Copyright Licenses & GDPR Data Privacy' : 'Depanare Publicare Web: Drepturi de Autor & Protecția Datelor Personale',
          code: 'Conținut încărcat: Imagini copiate direct cu watermark de copyright + fișier Excel descărcabil cu CNP-urile și notele elevilor\nAlertă de conformitate: Încălcare Legea Drepturilor de Autor & Regulamentul GDPR!',
          question: lang === 'en'
            ? 'What mandatory precautions must be taken before publishing a class project website?'
            : 'Ce măsuri de siguranță și etică sunt obligatorii înainte de publicarea pe web a proiectului clasei conform manualului?',
          options: lang === 'en' ? [
            'No precautions needed, everything on the web is public and free to use',
            'Use royalty-free licenses (Creative Commons/Unsplash) and strictly safeguard personal identification data (no national ID numbers, private addresses, or unauthorized photos)',
            'Delete HTML code after each visitor session',
            'Mandatory placement of commercial advertising banners'
          ] : [
            'Nicio măsură, pe internet toate resursele sunt publice și gratuite',
            'Utilizarea imaginilor cu licență liberă (Creative Commons/Unsplash) și protejarea strictă a datelor cu caracter personal (fără CNP, adrese private sau poze fără acord parental)',
            'Ștergerea codului HTML după fiecare vizită',
            'Plasarea obligatorie a bannerelor publicitare comerciale'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'Copyright law prohibits uncredited copyrighted assets, and GDPR legislation strictly forbids publishing personal identifying information (national ID numbers, private addresses, unconsented student photos).'
            : 'Legislația privind drepturile de autor interzice utilizarea neautorizată a creațiilor altor persoane, iar Regulamentul GDPR interzice cu desăvârșire publicarea datelor cu caracter personal (CNP, adrese, date medicale).'
        };

      case 'g8_algo_a':
        return {
          title: lang === 'en' ? 'C++ Debug: Digit Processing & Infinite Loop Prevention' : 'Depanare C++: Prelucrarea Cifrelor & Prevenirea Buclelor Infinite',
          code: 'int n = 7291, s = 0;\nwhile (n > 0) {\n    s = s + n % 10;\n    // LIPSĂ: instructiunea n = n / 10;\n}',
          question: lang === 'en'
            ? 'What severe execution error occurs if the statement n = n / 10 is omitted from the while loop?'
            : 'Ce eroare gravă de execuție se produce dacă lipsește instrucțiunea n = n / 10 din interiorul buclei while?',
          options: lang === 'en' ? [
            'Variable s automatically resets to 0',
            'The loop becomes infinite; execution freezes because n never decrements and n > 0 remains permanently true',
            'The Code::Blocks compiler throws a syntax error on line 1',
            'Number n is automatically converted to binary'
          ] : [
            'Variabila s devine automat 0',
            'Bucla devine infinită, programul se blochează deoarece valoarea lui n nu scade și condiția n > 0 este veșnic adevărată',
            'Compilatorul Code::Blocks raportează eroare de sintaxă la linia 1',
            'Numărul n se convertește automat în binar'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'The statement n = n / 10 truncates the least significant digit. Without this progression, n remains strictly positive (7291 > 0), causing an infinite loop that freezes CPU execution.'
            : 'Instrucțiunea n = n / 10 taie ultima cifră a numărului. Fără această scădere, valoarea lui n rămâne mereu neschimbată (7291 > 0), conducând la o buclă infinită care îngheață execuția.'
        };

      case 'g8_algo_b':
        return {
          title: lang === 'en' ? 'C++ Debug: Fibonacci Sequence & Sliding Variables' : 'Depanare C++: Șirul Fibonacci & Variabile Glisante',
          code: '// Generare termen următor: p = primul, d = al doilea\n// GREȘEALĂ ÎN COD:\np = d;\nd = p + d;  // AICI p A FOST DEJA SUPRASCRISE! d devine 2 * d!\n// CORECT:\nc = p + d;  p = d;  d = c;',
          question: lang === 'en'
            ? 'Why is an auxiliary variable c required when sliding variables without arrays in the Fibonacci sequence?'
            : 'De ce este obligatorie o variabilă auxiliară c la calculul termenilor Fibonacci prin variabile glisante?',
          options: lang === 'en' ? [
            'To increase computer processor clock speed',
            'Because executing p = d overwrites the previous p, causing d = p + d to calculate 2 * d instead of the sum of the two preceding terms',
            'Because C++ forbids adding two variables directly',
            'To change the terminal output text color'
          ] : [
            'Pentru a crește viteza procesorului calculatorului',
            'Pentru că scrierea p = d distruge valoarea inițială a lui p, iar d = p + d ar calcula dublul lui d în loc de suma celor doi termeni anteriori',
            'Pentru că limbajul C++ interzice adunarea a două variabile',
            'Pentru a colora ecranul consolei în albastru'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'The sliding variables pattern requires temporary storage: first sum c = p + d, then slide p = d, and finally assign the new term d = c.'
            : 'Algoritmul variabilelor glisante impune calcularea mai întâi a sumei c = p + d, după care p preia valoarea lui d, iar d preia noua valoare calculată c.'
        };

      case 'g8_algo_c':
        return {
          title: lang === 'en' ? 'C++ Debug: Finding Extremum (Min/Max) with Position' : 'Depanare C++: Găsirea Valorii Extreme (Min/Max) cu Poziție',
          code: 'int n = 5, v[5] = {-8, -3, -15, -2, -9};\nint maxim = 0, pozMax = 0; // GREȘEALĂ: maxim inițializat cu 0!\nfor (int i = 0; i < n; i++)\n    if (v[i] > maxim) { maxim = v[i]; pozMax = i + 1; }\n// Rezultat: maxim = 0 (deși 0 nici nu există în șirul de negative!)',
          question: lang === 'en'
            ? 'How must the maximum variable be safely initialized when an array may contain only negative numbers?'
            : 'Cum trebuie inițializat corect maximul atunci când șirul poate conține exclusiv numere negative?',
          options: lang === 'en' ? [
            'With the value 9999999',
            'With the first array element (maxim = v[0]; pozMax = 1;) prior to starting iteration',
            'With the arithmetic mean of the first two numbers',
            'With the literal value 0'
          ] : [
            'Cu valoarea 9999999',
            'Cu primul element din șir (maxim = v[0]; pozMax = 1;) înainte de a începe parcurgerea',
            'Cu media aritmetică a primelor două numere',
            'Cu valoarea 0'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'If all array elements are negative, initializing max with 0 produces an invalid result (0 is larger than any negative number). Safe universal initialization sets maxim = v[0] and pozMax = 1.'
            : 'Dacă toate numerele sunt negative, inițializarea maximului cu 0 va conduce la un rezultat eronat (va rămâne 0). Soluția universală și sigură este: maxim = v[0] și pozMax = 1.'
        };

      case 'g8_algo_d':
        return {
          title: lang === 'en' ? 'Robotics Debug: Ultrasonic Sensor Threshold & Emergency Brake' : 'Depanare Robotică: Pragul Senzorului Ultrasonic & Oprirea de Urgență',
          code: 'while (distanta_senzor > 5) {\n    motor_stanga.viteza(80);\n    motor_dreapta.viteza(80);\n    distanta_senzor = citeste_ultrasonic_cm();\n}\n// La viteză de 80%, distanța de 5 cm este insuficientă pentru frânare!',
          question: lang === 'en'
            ? 'Why does the robot crash into the wall despite having an ultrasonic distance check of > 5 cm?'
            : 'De ce se ciocnește robotul de perete deși are condiția de verificare distanta_senzor > 5 cm la viteză de 80%?',
          options: lang === 'en' ? [
            'Ultrasonic sensors only work in darkness',
            'Mechanical inertia and processing latency at high speed (80%) demand a larger safety buffer (15-20 cm) or progressive deceleration',
            'The battery is charged above 100%',
            'Ultrasonic sensors cannot detect solid obstacles'
          ] : [
            'Senzorul ultrasonic funcționează doar noaptea',
            'Inerția mecanică și timpul de latență la viteză mare necesită o distanță de siguranță mai generoasă (15-20 cm) sau decelerare progresivă',
            'Bateria robotului este încărcată peste 100%',
            'Senzorii cu ultrasunete nu pot detecta obiecte solide'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'Vehicle momentum and sensor sampling frequency at high motor speed make instant stops in 5 cm impossible. Autonomous robotics algorithms use a 15-20 cm safety margin or proportional deceleration.'
            : 'Masa robotului și inerția la viteză ridicată (80%) fac imposibilă oprirea instantanee în doar 5 cm. În robotică se utilizează un prag de siguranță de 15-20 cm sau un algoritm de frânare proporțională.'
        };

      case 'g8_algo_e':
      default:
        return {
          title: lang === 'en' ? 'Synthesis Debug: Admission Grade Formula & Type Casting' : 'Depanare Proiect Final: Formula Mediei de Admitere la Liceu',
          code: 'float n_ro = 9.50, n_mate = 9.00, med_gimnaziu = 9.80;\n// Calcul medie conform metodologiei oficiale:\nfloat med_eval = (n_ro + n_mate) / 2.0; // 9.25\nfloat med_admitere = 0.8 * med_eval + 0.2 * med_gimnaziu;',
          question: lang === 'en'
            ? 'What is the official weight of the National Evaluation in the high school admission grade formula?'
            : 'Care este ponderea oficială a Evaluării Naționale în formula mediei de admitere la liceu, conform proiectului din manual?',
          options: lang === 'en' ? [
            '50% National Evaluation and 50% middle school cumulative GPA',
            '80% (weight 0.8) National Evaluation average and 20% (weight 0.2) middle school cumulative GPA',
            '100% based exclusively on computing test score',
            'Simple arithmetic average of second semester grades'
          ] : [
            '50% Evaluare Națională și 50% media claselor V-VIII',
            '80% (pondere 0.8) media de la Evaluarea Națională și 20% (pondere 0.2) media generală de absolvire a gimnaziului',
            '100% exclusiv nota la proba de informatică',
            'Media aritmetică simplă a notelor din semestrul al doilea'
          ],
          correct: 1,
          explanation: lang === 'en'
            ? 'The official high school admissions formula is: Admission Grade = 0.8 * National Evaluation Average + 0.2 * Middle School Cumulative GPA (Grades 5-8).'
            : 'Formula oficială de admitere utilizată în proiect este: Medie Admitere = 0.8 * Medie Evaluare Națională + 0.2 * Medie Generală Gimnaziu (V-VIII).'
        };
    }
  };

  const debugData = getDebugScenario();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-12">
      {/* Top Banner Navigation */}
      <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner">
            {moduleData.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                {lang === 'en'
                  ? moduleData.id.toUpperCase().replace('G8_', 'Grade 8 • ')
                  : moduleData.id.toUpperCase().replace('G8_', 'Clasa a VIII-a • ')}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] font-mono text-slate-300">
                {lang === 'en' && enInfo?.unit ? enInfo.unit : moduleData.unit}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'en' && enInfo?.title ? enInfo.title : moduleData.title}
            </h1>
          </div>
        </div>

        {/* Level Stepper Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const isCurrent = lvl === currentLevel;
            const isPast = lvl < currentLevel;
            return (
              <div
                key={lvl}
                className={`flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-md font-black'
                    : isPast
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
                title={lang === 'en' ? `Level ${lvl}` : `Nivelul ${lvl}`}
              >
                {isPast ? '✓' : lvl}
              </div>
            );
          })}
        </div>
      </div>

      {/* LEVEL 1: CONCEPT ANATOMY & FLASHCARDS */}
      {currentLevel === 1 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'en' ? 'Level 1 • Concept Anatomy & Didactic Theory' : 'Nivelul 1 • Anatomia Conceptelor & Teorie Didactică'}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? '15 Points' : '15 Puncte'}</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading mb-2">
              {lang === 'en' && enInfo?.shortTitle ? enInfo.shortTitle : moduleData.shortTitle}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {lang === 'en' && enInfo?.metaDescription ? enInfo.metaDescription : moduleData.metaDescription}
            </p>
          </div>

          {/* Key Competencies Matrix */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'en' ? 'Target Curriculum Competencies (2025–2026)' : 'Competențe Specifice Vizate (Curriculum 2025-2026)'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(lang === 'en' && enInfo?.skills
                ? enInfo.skills.map((s, idx) => ({ code: s.split(':')[0]?.trim() || `${idx + 1}`, description: s.split(':')[1]?.trim() || s }))
                : moduleData.competencies
              ).map((comp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-mono font-bold">✓</span>
                  <span>{comp.code}: {comp.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Terminology Explorer */}
          {moduleData.keyTerms && moduleData.keyTerms.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {lang === 'en' ? 'Interactive Key Terminology Glossary' : 'Dicționar Interactiv de Termeni Cheie'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {moduleData.keyTerms.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setL1ActiveConceptIdx(idx);
                      sounds.playClick();
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      l1ActiveConceptIdx === idx
                        ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-sm font-bold text-emerald-300 mb-1">{item.term}</div>
                    <div className="text-xs text-slate-300 leading-snug line-clamp-3">{item.definition}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shortcuts if present */}
          {moduleData.shortcuts && moduleData.shortcuts.length > 0 && (
            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'en' ? 'Essential Keyboard Shortcuts' : 'Scurtături de Tastatură Esențiale'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {moduleData.shortcuts.map((sc, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <span className="font-mono font-bold text-emerald-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {sc.key}
                    </span>
                    <span className="text-slate-300">{sc.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Check Question */}
          <div className="bg-slate-950/90 rounded-2xl border-2 border-emerald-500/30 p-5 flex flex-col gap-3">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>{lang === 'en' ? 'Quick Check to Advance to Level 2' : 'Verificare Rapidă de Trecere la Nivelul 2'}</span>
            </div>
            <div className="text-sm font-bold text-white">
              {moduleData.testQuestions?.[0]?.question || (lang === 'en' ? 'Have you understood the core concepts of this module?' : 'Ai înțeles conceptele teoretice ale acestui modul?')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {(moduleData.testQuestions?.[0]?.options || (lang === 'en' ? ['Yes, I reviewed the theory', 'Ready for the practical lab'] : ['Da, am parcurs teoria', 'Vreau să trec la laborator'])).map((opt, oIdx) => (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => {
                    setL1SelectedAnswer(oIdx);
                    setL1AnswerSubmitted(true);
                    sounds.playClick();
                  }}
                  className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                    l1SelectedAnswer === oIdx
                      ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400 font-mono">
                {lang === 'en'
                  ? (l1AnswerSubmitted ? '✓ Option selected' : 'Select an option to continue')
                  : (l1AnswerSubmitted ? '✓ Răspuns selectat' : 'Selectează o opțiune pentru a continua')}
              </span>
              <button
                type="button"
                disabled={!l1AnswerSubmitted}
                onClick={() => {
                  sounds.playCorrect();
                  onCompletePage(20);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-lg ${
                  l1AnswerSubmitted
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{lang === 'en' ? 'Continue to Hands-on Lab' : 'Continuă spre Laboratorul Practic'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2: HANDS-ON INTERACTIVE SIMULATOR LAB */}
      {currentLevel === 2 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>{lang === 'en' ? 'Level 2 • Interactive Didactic Hands-on Lab' : 'Nivelul 2 • Laborator Practic Interactiv Didactic'}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? '20 Points' : '20 Puncte'}</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading mb-1">
              {lang === 'en' ? 'Live Didactic Lab • Direct Practice on Simulator' : 'Laborator Didactic Live • Lucru Direct pe Simulator'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              {lang === 'en'
                ? 'Experiment directly in the simulator configured for the 8th grade curriculum. Complete the exercises and click validate when ready!'
                : 'Experimentează direct în simulatorul configurat pentru programa clasei a VIII-a. Efectuează operațiunile și apasă pe butonul de validare când ești gata!'}
            </p>
          </div>

          {/* Render Specialized Simulator depending on module */}
          <div className="w-full">
            {missionId === 'g8_calc_a' ? (
              <ExcelLabSim initialChartType="column" initialSheetName={lang === 'en' ? 'Grade 8 Roster' : 'Catalog Clasa 8'} />
            ) : missionId === 'g8_calc_b' ? (
              <ExcelLabSim initialChartType="column" initialSheetName={lang === 'en' ? 'Formulas & VAT' : 'Formule & TVA'} />
            ) : missionId === 'g8_calc_c' ? (
              <ExcelLabSim initialChartType="column" initialSheetName={lang === 'en' ? 'Filters & IF' : 'Filtrare & IF'} />
            ) : missionId === 'g8_calc_d' ? (
              <ExcelLabSim initialChartType="pie" initialSheetName={lang === 'en' ? 'Chart Statistics' : 'Statistici Diagrame'} />
            ) : missionId === 'g8_web_a' ? (
              <WebStudioSim initialTab="pages" initialDevice="desktop" />
            ) : missionId === 'g8_web_b' ? (
              <WebStudioSim initialTab="insert" initialDevice="tablet" />
            ) : missionId === 'g8_web_c' ? (
              <WebStudioSim initialTab="themes" initialDevice="desktop" />
            ) : missionId === 'g8_algo_a' ? (
              <CppSequencesSim initialPresetId="cnp" />
            ) : missionId === 'g8_algo_b' ? (
              <CppSequencesSim initialPresetId="fibonacci" />
            ) : missionId === 'g8_algo_c' ? (
              <CppSequencesSim initialPresetId="minmax" />
            ) : missionId === 'g8_algo_d' ? (
              <NxtRobotSim />
            ) : missionId === 'g8_algo_e' ? (
              <div className="flex flex-col gap-6">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/40">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Component 1: C++ Survey Algorithm & Admission Prediction' : 'Componenta 1: Algoritm C++ de Sondaj Opțiuni & Predicție Admitere'}</span>
                  </div>
                  <CppSequencesSim initialPresetId="liceu" />
                </div>
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/40">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Component 2: Spreadsheet Calculation & Admission GPA Charts' : 'Componenta 2: Calcul Tabelar & Diagrame Medii Admitere'}</span>
                  </div>
                  <ExcelLabSim initialChartType="column" initialSheetName={lang === 'en' ? 'High School Choice 2025' : 'Liceul Preferat 2025'} />
                </div>
              </div>
            ) : (
              <CppSequencesSim />
            )}
          </div>

          {/* Complete Level 2 footer button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'en' ? 'Simulator runs in real time. All actions synchronize.' : 'Simulatorul rulează în timp real. Toate modificările se sincronizează.'}
            </span>
            <button
              type="button"
              onClick={() => {
                sounds.playCorrect();
                onCompletePage(20);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span>{lang === 'en' ? 'Validate Lab & Advance to Level 3' : 'Validează Laboratorul & Treci la Nivelul 3'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 3: DEBUGGING & ERROR RESOLUTION */}
      {currentLevel === 3 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Bug className="w-4 h-4" />
              <span>{lang === 'en' ? 'Level 3 • Real-World Debugging & Error Diagnosis' : 'Nivelul 3 • Depanare & Diagnosticare Erori Reale'}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? '20 Points' : '20 Puncte'}</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading mb-1">
              {debugData.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              {lang === 'en'
                ? 'Identify the root cause of frequent errors and choose the correct textbook-compliant fix.'
                : 'Identifică cauza erorilor frecvente întâlnite în practică și alege rezolvarea corectă conform manualului.'}
            </p>
          </div>

          {/* Code/Expression Display */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre">
            {debugData.code}
          </div>

          {/* Debug Question */}
          <div className="flex flex-col gap-3">
            <div className="text-sm font-bold text-white">
              {debugData.question}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {debugData.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setL3SelectedAnswer(idx);
                    setL3Submitted(true);
                    if (idx === debugData.correct) {
                      sounds.playCorrect();
                    } else {
                      sounds.playWrong();
                    }
                  }}
                  className={`p-3.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                    l3Submitted && idx === debugData.correct
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400'
                      : l3Submitted && l3SelectedAnswer === idx && idx !== debugData.correct
                      ? 'bg-rose-950/80 border-rose-400 text-rose-200'
                      : l3SelectedAnswer === idx
                      ? 'bg-slate-800 border-amber-400 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-[10px] shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
            </div>

            {l3Submitted && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs leading-relaxed text-slate-300 mt-2">
                <span className="font-bold text-emerald-400">{lang === 'en' ? 'Explanation: ' : 'Explicație: '}</span>
                {debugData.explanation}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'en'
                ? (l3Submitted ? (l3SelectedAnswer === debugData.correct ? '✓ Correct diagnosis!' : 'Try again') : 'Select the correct answer')
                : (l3Submitted ? (l3SelectedAnswer === debugData.correct ? '✓ Diagnostic corect!' : 'Încearcă din nou') : 'Alege răspunsul corect')}
            </span>
            <button
              type="button"
              disabled={!l3Submitted || l3SelectedAnswer !== debugData.correct}
              onClick={() => {
                sounds.playCorrect();
                onCompletePage(20);
              }}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-lg ${
                l3Submitted && l3SelectedAnswer === debugData.correct
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{lang === 'en' ? 'Advance to Applied Challenge (Level 4)' : 'Treci la Provocarea Aplicată (Nivelul 4)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 4: REAL-WORLD SCENARIO / CASE STUDY */}
      {currentLevel === 4 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>{lang === 'en' ? 'Level 4 • Case Study & Applied Challenge' : 'Nivelul 4 • Studiu de Caz & Provocare Aplicativă'}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? '20 Points' : '20 Puncte'}</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading mb-1">
              {lang === 'en' ? 'Applied Project: Integration & Problem Solving' : 'Proiect Aplicativ: Integrare și Rezolvare de Probleme'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              {lang === 'en'
                ? `Apply concepts from ${enInfo?.unit || moduleData.unit} to solve a real-world or classroom challenge.`
                : `Aplică cunoștințele din ${moduleData.unit} pentru a rezolva un scenariu din viața reală sau din activitatea de la clasă.`}
            </p>
          </div>

          {/* Scenario Card with Multi-step Checklist */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{lang === 'en' ? 'Hands-on Lab & Integration Steps' : 'Etape Practice de Laborator & Integrare'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const allDone: Record<number, boolean> = {};
                  (moduleData.practicalLabs || []).forEach((_, idx) => {
                    allDone[idx] = true;
                  });
                  setL4StepsCompleted(allDone);
                  sounds.playCorrect();
                }}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
              >
                {lang === 'en' ? 'Check all steps' : 'Bifează toate etapele'}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {(moduleData.practicalLabs || []).map((lab, idx) => {
                const isChecked = !!l4StepsCompleted[idx];
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-sm'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setL4StepsCompleted(prev => ({ ...prev, [idx]: e.target.checked }));
                        if (e.target.checked) sounds.playClick();
                      }}
                      className="mt-1 w-4 h-4 text-emerald-500 rounded border-slate-700 focus:ring-emerald-400 focus:ring-offset-slate-900 shrink-0"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                          {lang === 'en' ? `Step ${lab.step || idx + 1}` : `Etapa ${lab.step || idx + 1}`}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white">{lab.title}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{lab.task}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Helpful shortcuts box for this module */}
            {moduleData.shortcuts && moduleData.shortcuts.length > 0 && (
              <div className="mt-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div className="text-xs text-slate-300">
                  <strong className="text-amber-300 font-mono">
                    {lang === 'en' ? 'Shortcuts & Recommendations: ' : 'Scurtături & Recomandări: '}
                  </strong>
                  {moduleData.shortcuts.map(s => `${s.key}: ${s.action}`).join(' • ')}
                </div>
              </div>
            )}
          </div>

          {/* Validation & Advance */}
          {(() => {
            const totalSteps = moduleData.practicalLabs?.length || 1;
            const completedCount = Object.values(l4StepsCompleted).filter(Boolean).length;
            const isAllCompleted = completedCount >= totalSteps;

            return (
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className={isAllCompleted ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {lang === 'en'
                      ? `Progress: ${completedCount} of ${totalSteps} steps completed`
                      : `Progres: ${completedCount} din ${totalSteps} etape validate`}
                  </span>
                  {isAllCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
                </div>
                <button
                  type="button"
                  disabled={!isAllCompleted}
                  onClick={() => {
                    sounds.playCorrect();
                    onCompletePage(20);
                  }}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-lg ${
                    isAllCompleted
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 font-black'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>{lang === 'en' ? 'Continue to Summative Assessment (Level 5)' : 'Continuă la Evaluarea Sumativă (Nivelul 5)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* LEVEL 5: SUMMATIVE ASSESSMENT (EVALUARE SUMATIVĂ MANUAL) */}
      {currentLevel === 5 && (
        <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>{lang === 'en' ? 'Level 5 • Self-Assessment Exam & Certificate Claim' : 'Nivelul 5 • Test de Autoevaluare & Obținere Diplomă'}</span>
            </div>
            <span className="text-xs text-emerald-300 font-mono font-bold">{lang === 'en' ? '20 Points • Module Completion' : '20 Puncte • Finalizare Modul'}</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading mb-1">
              {lang === 'en' ? 'Official Summative Assessment (Art Klett Textbook)' : 'Evaluare Sumativă Oficială (Manual Art Klett)'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              {lang === 'en'
                ? 'Answer textbook-derived evaluation questions correctly to earn a Grade 10 / A+ and claim your Graduation Certificate!'
                : 'Răspunde corect la întrebările extrase direct din testele de autoevaluare ale manualului pentru a obține Nota 10 și Diploma de Absolvire!'}
            </p>
          </div>

          {/* Render All Questions */}
          <div className="flex flex-col gap-6">
            {(moduleData.testQuestions || []).map((q, qIdx) => {
              const selectedOpt = l5Answers[qIdx];
              return (
                <div key={qIdx} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      {lang === 'en'
                        ? `Question ${qIdx + 1} of ${moduleData.testQuestions?.length || 3}`
                        : `Întrebarea ${qIdx + 1} din ${moduleData.testQuestions?.length || 3}`}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{q.question}</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = selectedOpt === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => {
                            setL5Answers(prev => ({ ...prev, [qIdx]: oIdx }));
                            sounds.playClick();
                          }}
                          className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                            isChosen
                              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-mono text-[10px] shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit & Finish */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'en'
                ? (Object.keys(l5Answers).length === (moduleData.testQuestions?.length || 3)
                    ? '✓ All questions answered'
                    : `Answered ${Object.keys(l5Answers).length} of ${moduleData.testQuestions?.length || 3} questions`)
                : (Object.keys(l5Answers).length === (moduleData.testQuestions?.length || 3)
                    ? '✓ Toate întrebările au primit răspuns'
                    : `Ai răspuns la ${Object.keys(l5Answers).length} din ${moduleData.testQuestions?.length || 3} întrebări`)}
            </span>
            <button
              type="button"
              disabled={Object.keys(l5Answers).length < (moduleData.testQuestions?.length || 3)}
              onClick={() => {
                sounds.playVictory();
                onCompletePage(20);
              }}
              className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-xl ${
                Object.keys(l5Answers).length >= (moduleData.testQuestions?.length || 3)
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-300'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4 text-amber-950 fill-amber-950" />
              <span>{lang === 'en' ? 'Finish Mission & Claim Certificate of Merit!' : 'Finalizează Misiunea & Obține Diploma de Merit!'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
