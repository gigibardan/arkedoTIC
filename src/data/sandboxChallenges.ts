import { SandboxLanguage } from '../utils/sandboxRunner';

export interface SandboxTestCase {
  id: string;
  labelRo: string;
  labelEn: string;
  stdin: string;
  expectedOutput: string;
}

export interface HtmlCheckRule {
  id: string;
  labelRo: string;
  labelEn: string;
  check: (doc: Document, rawHtml: string, rawCss: string) => boolean;
}

export interface SandboxChallenge {
  id: string;
  language: SandboxLanguage;
  gradeLabelRo: string;
  gradeLabelEn: string;
  titleRo: string;
  titleEn: string;
  summaryRo: string;
  summaryEn: string;
  hintRo: string;
  hintEn: string;
  starterCode: string;
  starterCss?: string;
  defaultStdin: string;
  rewardCoins: number;
  tests?: SandboxTestCase[];
  htmlChecks?: HtmlCheckRule[];
  relatedModuleId: string;
  relatedBlogSlugRo?: string;
  relatedBlogSlugEn?: string;
}

export const SANDBOX_CHALLENGES: SandboxChallenge[] = [
  // ================= C++ CHALLENGES =================
  {
    id: 'cpp-swap-3-pahare',
    language: 'cpp',
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: 'Grade 7',
    titleRo: 'Interschimbarea a 2 numere (Regula celor 3 pahare)',
    titleEn: 'Swap Two Numbers (Three Glasses Rule)',
    summaryRo: 'Citește două numere întregi a și b, interschimbă valorile lor folosind o variabilă auxiliară aux și afișează-le separate prin spațiu.',
    summaryEn: 'Read two integers a and b, swap their values using a helper variable aux, and print them separated by a space.',
    hintRo: 'Nu scrie a = b; b = a; — altfel pierzi valoarea inițială a lui a! Folosește aux = a; a = b; b = aux;',
    hintEn: 'Do not write a = b; b = a; — you will overwrite a! Use aux = a; a = b; b = aux;',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int a, b, aux;
    cin >> a >> b;

    // TODO: interschimbă a și b folosind aux


    cout << a << " " << b << endl;
    return 0;
}`,
    defaultStdin: '15 42',
    rewardCoins: 25,
    relatedModuleId: 'g7_cpp_b',
    relatedBlogSlugRo: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    relatedBlogSlugEn: 'cpp-middle-school-top-10-errors-if-while-digits',
    tests: [
      { id: 't1', labelRo: 'Intrare: 15 42', labelEn: 'Input: 15 42', stdin: '15 42', expectedOutput: '42 15' },
      { id: 't2', labelRo: 'Intrare: 7 100', labelEn: 'Input: 7 100', stdin: '7 100', expectedOutput: '100 7' },
      { id: 't3', labelRo: 'Intrare: -5 9', labelEn: 'Input: -5 9', stdin: '-5 9', expectedOutput: '9 -5' },
    ],
  },
  {
    id: 'cpp-suma-cifrelor',
    language: 'cpp',
    gradeLabelRo: 'Clasa a VII-a / VIII-a',
    gradeLabelEn: 'Grades 7–8',
    titleRo: 'Suma cifrelor cu while (n % 10 și n / 10)',
    titleEn: 'Sum of Digits with while (n % 10 and n / 10)',
    summaryRo: 'Citește un număr natural n și calculează suma cifrelor sale folosind bucla while, operatorul modulo % 10 și împărțirea întreagă / 10.',
    summaryEn: 'Read a natural number n and compute the sum of its digits using a while loop, modulo % 10, and integer division / 10.',
    hintRo: 'Cât timp n > 0: adună ultima cifră (n % 10) la s, apoi taie ultima cifră prin n = n / 10;',
    hintEn: 'While n > 0: add last digit (n % 10) to s, then drop it via n = n / 10;',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n, s = 0;
    cin >> n;

    while (n > 0) {
        // TODO: adaugă ultima cifră și taie cifra din n

    }

    cout << s << endl;
    return 0;
}`,
    defaultStdin: '2026',
    rewardCoins: 30,
    relatedModuleId: 'g7_loop_b',
    relatedBlogSlugRo: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    relatedBlogSlugEn: 'cpp-middle-school-top-10-errors-if-while-digits',
    tests: [
      { id: 't1', labelRo: 'Intrare: 2026', labelEn: 'Input: 2026', stdin: '2026', expectedOutput: '10' },
      { id: 't2', labelRo: 'Intrare: 951', labelEn: 'Input: 951', stdin: '951', expectedOutput: '15' },
      { id: 't3', labelRo: 'Intrare: 0', labelEn: 'Input: 0', stdin: '0', expectedOutput: '0' },
    ],
  },
  {
    id: 'cpp-numar-prim',
    language: 'cpp',
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: 'Grade 8',
    titleRo: 'Verificare Număr Prim (DA / NU)',
    titleEn: 'Prime Number Check (DA / NU)',
    summaryRo: 'Citește un număr întreg n și afișează DA dacă n este prim, sau NU în caz contrar (atenție la cazurile n < 2!).',
    summaryEn: 'Read an integer n and output DA if n is prime, or NU otherwise (watch out for n < 2!).',
    hintRo: 'Inițializează bool prim = true; Dacă n < 2 atunci prim = false; apoi verifică divizorii d de la 2 până la n / 2.',
    hintEn: 'Start with bool prim = true; If n < 2 set prim = false; then check divisors d from 2 to n / 2.',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    bool prim = true;

    if (n < 2) {
        prim = false;
    } else {
        for (int d = 2; d <= n / 2; d++) {
            // TODO: dacă d îl divide pe n, marchează prim = false

        }
    }

    if (prim) cout << "DA" << endl;
    else cout << "NU" << endl;
    return 0;
}`,
    defaultStdin: '17',
    rewardCoins: 35,
    relatedModuleId: 'g8_algo_e',
    tests: [
      { id: 't1', labelRo: 'Intrare: 17 (prim)', labelEn: 'Input: 17 (prime)', stdin: '17', expectedOutput: 'DA' },
      { id: 't2', labelRo: 'Intrare: 12 (compus)', labelEn: 'Input: 12 (composite)', stdin: '12', expectedOutput: 'NU' },
      { id: 't3', labelRo: 'Intrare: 1 (caz limită)', labelEn: 'Input: 1 (edge case)', stdin: '1', expectedOutput: 'NU' },
    ],
  },
  {
    id: 'cpp-vector-pare',
    language: 'cpp',
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: 'Grade 8',
    titleRo: 'Numără elementele pare dintr-un vector',
    titleEn: 'Count Even Numbers in an Array',
    summaryRo: 'Citește n și cele n numere ale unui vector v, apoi afișează câte dintre ele sunt pare (divizibile cu 2).',
    summaryEn: 'Read n followed by n array elements into v, then print how many of them are even (divisible by 2).',
    hintRo: 'Parcurge elementele cu for (int i = 0; i < n; i++) și verifică condiția if (v[i] % 2 == 0) contor++;',
    hintEn: 'Loop with for (int i = 0; i < n; i++) and increment counter when v[i] % 2 == 0.',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n, v[100], pare = 0;
    cin >> n;

    for (int i = 0; i < n; i++) {
        cin >> v[i];
        // TODO: dacă v[i] este par, crește pare

    }

    cout << pare << endl;
    return 0;
}`,
    defaultStdin: '5\n4 7 10 3 8',
    rewardCoins: 35,
    relatedModuleId: 'g8_algo_d',
    tests: [
      { id: 't1', labelRo: '5 numere: 4 7 10 3 8', labelEn: '5 numbers: 4 7 10 3 8', stdin: '5\n4 7 10 3 8', expectedOutput: '3' },
      { id: 't2', labelRo: '4 numere impare: 1 3 5 9', labelEn: '4 odd numbers: 1 3 5 9', stdin: '4\n1 3 5 9', expectedOutput: '0' },
      { id: 't3', labelRo: '3 numere pare: 0 2 6', labelEn: '3 even numbers: 0 2 6', stdin: '3\n0 2 6', expectedOutput: '3' },
    ],
  },

  // ================= PYTHON CHALLENGES =================
  {
    id: 'py-par-impar',
    language: 'python',
    gradeLabelRo: 'Clasele VI–VII',
    gradeLabelEn: 'Grades 6–7',
    titleRo: 'Python: Par sau Impar (% modulo)',
    titleEn: 'Python: Even or Odd (% modulo)',
    summaryRo: 'Citește un număr întreg n cu int(input()) și afișează PAR dacă este divizibil cu 2, sau IMPAR în caz contrar.',
    summaryEn: 'Read an integer n with int(input()) and print PAR if divisible by 2, or IMPAR otherwise.',
    hintRo: 'Folosește if n % 2 == 0: print("PAR") else: print("IMPAR") — nu uita de cele două puncte ":"!',
    hintEn: 'Use if n % 2 == 0: print("PAR") else: print("IMPAR") — remember the colon ":"!',
    starterCode: `n = int(input())

# TODO: verifică dacă n este par sau impar
if n % 2 == 0:
    print("PAR")
else:
    print("IMPAR")`,
    defaultStdin: '24',
    rewardCoins: 20,
    relatedModuleId: 'g7_decision_a',
    tests: [
      { id: 't1', labelRo: 'Intrare: 24', labelEn: 'Input: 24', stdin: '24', expectedOutput: 'PAR' },
      { id: 't2', labelRo: 'Intrare: 13', labelEn: 'Input: 13', stdin: '13', expectedOutput: 'IMPAR' },
      { id: 't3', labelRo: 'Intrare: 0', labelEn: 'Input: 0', stdin: '0', expectedOutput: 'PAR' },
    ],
  },
  {
    id: 'py-gauss-sum',
    language: 'python',
    gradeLabelRo: 'Clasa a VII-a',
    gradeLabelEn: 'Grade 7',
    titleRo: 'Python: Suma primelor n numere (for + range)',
    titleEn: 'Python: Sum 1..n (for + range)',
    summaryRo: 'Citește n și calculează suma 1 + 2 + ... + n folosind o buclă for i in range(1, n + 1).',
    summaryEn: 'Read n and compute 1 + 2 + ... + n using a for i in range(1, n + 1) loop.',
    hintRo: 'Atenție: range(1, n) se oprește la n - 1! Scrie range(1, n + 1) ca să îl includă și pe n.',
    hintEn: 'Careful: range(1, n) stops at n - 1! Use range(1, n + 1) to include n.',
    starterCode: `n = int(input())
suma = 0

# TODO: adună numerele de la 1 la n


print(suma)`,
    defaultStdin: '10',
    rewardCoins: 25,
    relatedModuleId: 'g7_stem_a',
    tests: [
      { id: 't1', labelRo: 'Intrare: 10 (Gauss = 55)', labelEn: 'Input: 10 (Gauss = 55)', stdin: '10', expectedOutput: '55' },
      { id: 't2', labelRo: 'Intrare: 5', labelEn: 'Input: 5', stdin: '5', expectedOutput: '15' },
      { id: 't3', labelRo: 'Intrare: 100', labelEn: 'Input: 100', stdin: '100', expectedOutput: '5050' },
    ],
  },
  {
    id: 'py-lista-note',
    language: 'python',
    gradeLabelRo: 'Clasele VII–VIII',
    gradeLabelEn: 'Grades 7–8',
    titleRo: 'Python: Media notelor cu liste',
    titleEn: 'Python: Grade Average with Lists',
    summaryRo: 'Primești numărul de note k și apoi cele k note (pe linii separate). Calculează și afișează media rotunjită la întreg cu round() sau suma lor.',
    summaryEn: 'Read the count k followed by k grades on separate lines. Append them to a list and print the integer average using round(sum(note) / len(note)).',
    hintRo: 'Folosește note = [], adaugă cu note.append(int(input())) și afișează round(sum(note) / len(note)).',
    hintEn: 'Create note = [], append each int(input()), and print round(sum(note) / len(note)).',
    starterCode: `k = int(input())
note = []

for i in range(k):
    x = int(input())
    # TODO: adaugă x în lista note

# TODO: afișează media rotunjită cu round(sum(note) / len(note))
`,
    defaultStdin: '3\n8\n10\n9',
    rewardCoins: 30,
    relatedModuleId: 'g8_algo_c',
    tests: [
      { id: 't1', labelRo: 'Note: 8, 10, 9', labelEn: 'Grades: 8, 10, 9', stdin: '3\n8\n10\n9', expectedOutput: '9' },
      { id: 't2', labelRo: 'Note: 7, 9, 10, 10', labelEn: 'Grades: 7, 9, 10, 10', stdin: '4\n7\n9\n10\n10', expectedOutput: '9' },
      { id: 't3', labelRo: 'Note: 10, 10', labelEn: 'Grades: 10, 10', stdin: '2\n10\n10', expectedOutput: '10' },
    ],
  },

  // ================= HTML + CSS CHALLENGES =================
  {
    id: 'html-card-profil',
    language: 'html',
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: 'Grade 8',
    titleRo: 'HTML5 & CSS: Card de Prezentare Elev',
    titleEn: 'HTML5 & CSS: Student Profile Card',
    summaryRo: 'Construiește o pagină HTML5 cu un titlu principal <h1>, o listă cu 3 hobby-uri <ul><li> și un link <a> stilizat cu CSS (border-radius și culoare de fundal).',
    summaryEn: 'Build an HTML5 card with a main <h1> heading, a <ul> list of 3 hobbies, and an <a> link styled with CSS (border-radius and background).',
    hintRo: 'Asigură-te că ai un <h1>, cel puțin 3 elemente <li> în <ul>, un tag <a href="..."> și reguli CSS cu border-radius.',
    hintEn: 'Include an <h1>, at least 3 <li> items inside <ul>, an <a href="..."> link, and border-radius in CSS.',
    starterCode: `<main class="card">
  <h1>Salut, sunt Alex!</h1>
  <p>Elev în clasa a VIII-a · Pasionat de TIC &amp; Robotică</p>

  <h2>Pasiunile mele</h2>
  <ul>
    <li>Programare C++</li>
    <li>Arduino Smart Home</li>
    <li>Design Web HTML5</li>
  </ul>

  <a class="btn" href="https://www.arkyedu.com/">Explorează ArkyEdu</a>
</main>`,
    starterCss: `.card {
  max-width: 420px;
  margin: 16px auto;
  padding: 24px;
  border-radius: 16px;
  background: #0f172a;
  color: #f8fafc;
  border: 1px solid #334155;
}
h1 { margin: 0 0 8px; color: #34d399; font-size: 1.5rem; }
h2 { font-size: 1rem; color: #38bdf8; margin-top: 16px; }
ul { padding-left: 20px; }
.btn {
  display: inline-block;
  margin-top: 14px;
  padding: 10px 18px;
  background: #059669;
  color: #ffffff;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 700;
}`,
    defaultStdin: '',
    rewardCoins: 25,
    relatedModuleId: 'g8_web_a',
    relatedBlogSlugRo: 'primul-site-web-clasa-8-html5-https-google-sites',
    relatedBlogSlugEn: 'first-website-grade-8-html5-https-google-sites',
    htmlChecks: [
      {
        id: 'h1',
        labelRo: 'Conține un titlu principal <h1> ne-gol',
        labelEn: 'Contains a non-empty <h1> heading',
        check: (doc) => (doc.querySelector('h1')?.textContent?.trim().length ?? 0) > 0,
      },
      {
        id: 'list',
        labelRo: 'Conține o listă <ul> cu cel puțin 3 elemente <li>',
        labelEn: 'Contains a <ul> list with at least 3 <li> items',
        check: (doc) => doc.querySelectorAll('ul li').length >= 3,
      },
      {
        id: 'link',
        labelRo: 'Conține un link <a href="..."> valid',
        labelEn: 'Contains a valid <a href="..."> link',
        check: (doc) => Boolean(doc.querySelector('a[href]')?.getAttribute('href')?.trim()),
      },
      {
        id: 'css-radius',
        labelRo: 'Folosește stilizare CSS (border-radius & background)',
        labelEn: 'Applies CSS styling (border-radius & background)',
        check: (_doc, _html, css) => /border-radius\s*:/.test(css) && /background(-color)?\s*:/.test(css),
      },
    ],
  },
  {
    id: 'html-orar-tabel',
    language: 'html',
    gradeLabelRo: 'Clasa a VIII-a',
    gradeLabelEn: 'Grade 8',
    titleRo: 'HTML5 & CSS: Tabel Orar Școlar',
    titleEn: 'HTML5 & CSS: School Timetable Table',
    summaryRo: 'Creează un tabel semantic <table> cu antet <thead> (<tr><th>) și cel puțin 3 rânduri de ore în <tbody> (<tr><td>), stilizat curat cu CSS.',
    summaryEn: 'Create a semantic <table> with <thead> (<tr><th>) and at least 3 class rows in <tbody> (<tr><td>), cleanly styled with CSS.',
    hintRo: 'Folosește <table>, <thead> pentru capul de tabel (<th>) și <tbody> cu 3+ rânduri <tr>.',
    hintEn: 'Use <table>, <thead> for header cells (<th>), and <tbody> with 3+ <tr> rows.',
    starterCode: `<h1>Orar TIC &amp; Informatică</h1>
<table>
  <thead>
    <tr>
      <th>Ziua</th>
      <th>Ora</th>
      <th>Modul</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Luni</td>
      <td>10:00</td>
      <td>Algoritmi C++</td>
    </tr>
    <tr>
      <td>Miercuri</td>
      <td>11:00</td>
      <td>Excel &amp; Diagrame</td>
    </tr>
    <tr>
      <td>Vineri</td>
      <td>09:00</td>
      <td>Web Design HTML5</td>
    </tr>
  </tbody>
</table>`,
    starterCss: `h1 { color: #0f172a; font-size: 1.35rem; margin-bottom: 12px; }
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #cbd5e1;
}
th, td {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  text-align: left;
  font-size: 0.9rem;
}
thead th {
  background: #0f172a;
  color: #f8fafc;
}`,
    defaultStdin: '',
    rewardCoins: 25,
    relatedModuleId: 'g8_web_c',
    relatedBlogSlugRo: 'primul-site-web-clasa-8-html5-https-google-sites',
    relatedBlogSlugEn: 'first-website-grade-8-html5-https-google-sites',
    htmlChecks: [
      {
        id: 'table-head',
        labelRo: 'Tabelul are <thead> cu cel puțin 2 coloane <th>',
        labelEn: 'Table has <thead> with at least 2 <th> columns',
        check: (doc) => doc.querySelectorAll('table thead th').length >= 2,
      },
      {
        id: 'table-rows',
        labelRo: 'Tabelul are cel puțin 3 rânduri în <tbody>',
        labelEn: 'Table has at least 3 rows inside <tbody>',
        check: (doc) => doc.querySelectorAll('table tbody tr').length >= 3,
      },
      {
        id: 'table-css',
        labelRo: 'Aplică border-collapse și padding în CSS',
        labelEn: 'Applies border-collapse and padding in CSS',
        check: (_doc, _html, css) => /border-collapse\s*:\s*collapse/.test(css) && /padding\s*:/.test(css),
      },
    ],
  },
];
