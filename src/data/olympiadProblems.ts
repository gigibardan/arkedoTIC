export type OlympiadTier = 'initiation' | 'school' | 'county' | 'national';

export interface OlympiadTestCase {
  id: string;
  labelRo: string;
  labelEn: string;
  stdin: string;
  expectedOutput: string;
}

export interface OlympiadDryRunQuiz {
  promptRo: string;
  promptEn: string;
  codeSnippet: string;
  stdin: string;
  options: string[];
  correctIndex: number;
  explanationRo: string;
  explanationEn: string;
}

export interface OlympiadProblem {
  id: string;
  number: number;
  tier: OlympiadTier;
  gradeLabelRo: string;
  gradeLabelEn: string;
  titleRo: string;
  titleEn: string;
  statementRo: string;
  statementEn: string;
  inputFormatRo: string;
  inputFormatEn: string;
  outputFormatRo: string;
  outputFormatEn: string;
  constraints: string;
  complexityTarget: string;
  rewardCoins: number;
  hintRo: string;
  hintEn: string;
  defaultStdin: string;
  starterCode: string;
  solutionCode: string;
  tests: OlympiadTestCase[];
  dryRunQuiz: OlympiadDryRunQuiz;
}

export interface OlympiadRank {
  level: number;
  titleRo: string;
  titleEn: string;
  minSolved: number;
  colorClass: string;
}

export const OLYMPIAD_TIERS: { id: OlympiadTier; labelRo: string; labelEn: string }[] = [
  { id: 'initiation', labelRo: 'Inițiere (Cls V–VI)', labelEn: 'Initiation (Grades 5–6)' },
  { id: 'school', labelRo: 'Școlar (Cls VII)', labelEn: 'School Stage (Grade 7)' },
  { id: 'county', labelRo: 'Județean OJI (Cls VIII)', labelEn: 'County OJI (Grade 8)' },
  { id: 'national', labelRo: 'Național & Admitere', labelEn: 'National & CS Track' },
];

export const OLYMPIAD_RANKS: OlympiadRank[] = [
  { level: 1, titleRo: 'Ucenic Algoritm', titleEn: 'Algorithm Apprentice', minSolved: 0, colorClass: 'text-slate-300' },
  { level: 2, titleRo: 'Cercetaș C++', titleEn: 'C++ Scout', minSolved: 2, colorClass: 'text-emerald-300' },
  { level: 3, titleRo: 'Calificat Școlar', titleEn: 'School Qualifier', minSolved: 5, colorClass: 'text-cyan-300' },
  { level: 4, titleRo: 'Olimpic Județean OJI', titleEn: 'County OJI Finalist', minSolved: 8, colorClass: 'text-amber-300' },
  { level: 5, titleRo: 'Maestru AlgoriX', titleEn: 'AlgoriX Grandmaster', minSolved: 11, colorClass: 'text-rose-300' },
];

export function getOlympiadRank(solvedCount: number, isEn: boolean): {
  current: OlympiadRank;
  next: OlympiadRank | null;
  title: string;
} {
  let current = OLYMPIAD_RANKS[0];
  let next: OlympiadRank | null = OLYMPIAD_RANKS[1];
  for (let i = 0; i < OLYMPIAD_RANKS.length; i++) {
    if (solvedCount >= OLYMPIAD_RANKS[i].minSolved) {
      current = OLYMPIAD_RANKS[i];
      next = OLYMPIAD_RANKS[i + 1] || null;
    }
  }
  return {
    current,
    next,
    title: isEn ? current.titleEn : current.titleRo,
  };
}

export const OLYMPIAD_PROBLEMS: OlympiadProblem[] = [
  // ================= TIER 1: INITIATION =================
  {
    id: 'oji-ultima-cifra-paritate',
    number: 1,
    tier: 'initiation',
    gradeLabelRo: 'Inițiere · Cls V–VI',
    gradeLabelEn: 'Initiation · Gr 5–6',
    titleRo: 'Analiza Cifrelor & Paritate',
    titleEn: 'Digit Sum & Parity Analysis',
    statementRo:
      'Se citește un număr natural nenul n. Să se calculeze suma cifrelor pare ale lui n și numărul total de cifre ale lui n, separate printr-un spațiu.',
    statementEn:
      'Given a positive integer n, compute the sum of its even digits and the total number of digits of n, separated by a single space.',
    inputFormatRo: 'Un singur număr întreg pozitiv n.',
    inputFormatEn: 'A single positive integer n.',
    outputFormatRo: 'Două numere separate printr-un spațiu: suma_pare nr_cifre.',
    outputFormatEn: 'Two integers separated by a space: even_sum total_digits.',
    constraints: '1 <= n <= 2 000 000 000',
    complexityTarget: 'O(log₁₀ n)',
    rewardCoins: 45,
    hintRo: 'Extrage ultima cifră cu c = n % 10, verifică dacă c % 2 == 0, apoi taie ultima cifră cu n = n / 10 într-o buclă while (n > 0).',
    hintEn: 'Extract last digit via c = n % 10, check c % 2 == 0, then divide n = n / 10 inside while (n > 0).',
    defaultStdin: '48275',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int sumaPare = 0, nrCifre = 0;
    // Scrie bucla while (n > 0) mai jos:

    cout << sumaPare << " " << nrCifre;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int sumaPare = 0, nrCifre = 0;
    while (n > 0) {
        int c = n % 10;
        if (c % 2 == 0) sumaPare += c;
        nrCifre++;
        n /= 10;
    }
    cout << sumaPare << " " << nrCifre;
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Mix cifre)', labelEn: 'Test 1 (Mixed)', stdin: '48275', expectedOutput: '14 5' },
      { id: 't2', labelRo: 'Test 2 (Doar impare)', labelEn: 'Test 2 (All odd)', stdin: '13579', expectedOutput: '0 5' },
      { id: 't3', labelRo: 'Test 3 (Cu zerouri)', labelEn: 'Test 3 (With zeros)', stdin: '20406', expectedOutput: '12 5' },
      { id: 't4', labelRo: 'Test 4 (O singură cifră)', labelEn: 'Test 4 (Single digit)', stdin: '8', expectedOutput: '8 1' },
      { id: 't5', labelRo: 'Test 5 (Număr mare)', labelEn: 'Test 5 (Large)', stdin: '100200304', expectedOutput: '6 9' },
    ],
    dryRunQuiz: {
      promptRo: 'Ce va afișa secvența următoare pentru intrarea n = 362 ?',
      promptEn: 'What does the snippet below print for input n = 362?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int n, s = 0, k = 0;
    cin >> n;
    while (n > 0) {
        int c = n % 10;
        if (c % 2 == 0) s += c;
        k++;
        n /= 10;
    }
    cout << s << " " << k;
    return 0;
}`,
      stdin: '362',
      options: ['8 3', '11 3', '2 1', '6 2'],
      correctIndex: 0,
      explanationRo: 'Cifrele lui 362 sunt 2 (pară, s=2), 6 (pară, s=8) și 3 (impară). În total sunt k=3 cifre, deci afișează "8 3".',
      explanationEn: 'Digits of 362 are 2 (even, s=2), 6 (even, s=8), and 3 (odd). Total count k=3, outputting "8 3".',
    },
  },
  {
    id: 'oji-max3-triunghi',
    number: 2,
    tier: 'initiation',
    gradeLabelRo: 'Inițiere · Cls V–VI',
    gradeLabelEn: 'Initiation · Gr 5–6',
    titleRo: 'Triunghi Valid & Tipul Lui',
    titleEn: 'Valid Triangle & Classification',
    statementRo:
      'Se citesc trei lungimi întregi pozitive a, b, c. Dacă pot forma un triunghi valid, afișați "ECHILATERAL", "ISOSCEL" sau "SCALEN" (oarecare). Altfel afișați "INVALID".',
    statementEn:
      'Given three positive integer side lengths a, b, c, print "ECHILATERAL" if equilateral, "ISOSCEL" if isosceles, "SCALEN" if scalene, or "INVALID" if they cannot form a triangle.',
    inputFormatRo: 'Trei numere întregi a, b, c.',
    inputFormatEn: 'Three integers a, b, c.',
    outputFormatRo: 'Un singur cuvânt: ECHILATERAL, ISOSCEL, SCALEN sau INVALID.',
    outputFormatEn: 'A single word: ECHILATERAL, ISOSCEL, SCALEN, or INVALID.',
    constraints: '1 <= a, b, c <= 10 000',
    complexityTarget: 'O(1)',
    rewardCoins: 45,
    hintRo: 'Inegalitatea triunghiului: a + b > c && a + c > b && b + c > a. Verifică mai întâi dacă este valid și abia apoi tipul!',
    hintEn: 'Triangle inequality: a + b > c && a + c > b && b + c > a. Check validity before classifying!',
    defaultStdin: '5 5 8',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    // Verifică inegalitatea triunghiului, apoi tipul

    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a + b > c && a + c > b && b + c > a) {
        if (a == b && b == c) cout << "ECHILATERAL";
        else if (a == b || b == c || a == c) cout << "ISOSCEL";
        else cout << "SCALEN";
    } else {
        cout << "INVALID";
    }
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Isoscel)', labelEn: 'Test 1 (Isosceles)', stdin: '5 5 8', expectedOutput: 'ISOSCEL' },
      { id: 't2', labelRo: 'Test 2 (Echilateral)', labelEn: 'Test 2 (Equilateral)', stdin: '7 7 7', expectedOutput: 'ECHILATERAL' },
      { id: 't3', labelRo: 'Test 3 (Scalen)', labelEn: 'Test 3 (Scalene)', stdin: '3 4 5', expectedOutput: 'SCALEN' },
      { id: 't4', labelRo: 'Test 4 (Degenerat = invalid)', labelEn: 'Test 4 (Degenerate)', stdin: '2 3 5', expectedOutput: 'INVALID' },
      { id: 't5', labelRo: 'Test 5 (Invalid evident)', labelEn: 'Test 5 (Invalid)', stdin: '1 10 2', expectedOutput: 'INVALID' },
    ],
    dryRunQuiz: {
      promptRo: 'Ce afișează programul pentru laturile 2, 3, 5 ?',
      promptEn: 'What does the program output for side lengths 2, 3, 5?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a + b > c && a + c > b && b + c > a) {
        if (a == b && b == c) cout << "ECHILATERAL";
        else if (a == b || b == c || a == c) cout << "ISOSCEL";
        else cout << "SCALEN";
    } else {
        cout << "INVALID";
    }
    return 0;
}`,
      stdin: '2 3 5',
      options: ['SCALEN', 'INVALID', 'ISOSCEL', 'ECHILATERAL'],
      correctIndex: 1,
      explanationRo: '2 + 3 = 5, care NU este strict mai mare decât 5 (a + b > c este fals), deci segmentele nu pot forma un triunghi: INVALID.',
      explanationEn: '2 + 3 = 5, which is not strictly greater than 5 (a + b > c is false), so it prints INVALID.',
    },
  },

  // ================= TIER 2: SCHOOL STAGE =================
  {
    id: 'oji-palindrom-oglindit',
    number: 3,
    tier: 'school',
    gradeLabelRo: 'Școlar · Cls VII',
    gradeLabelEn: 'School · Gr 7',
    titleRo: 'Oglindit & Verificare Palindrom',
    titleEn: 'Mirror Number & Palindrome Check',
    statementRo:
      'Se citește un număr natural n. Să se construiască oglinditul (răsturnatul) lui n și să se afișeze pe prima linie oglinditul, iar pe a doua linie "DA" dacă n este palindrom sau "NU" în caz contrar.',
    statementEn:
      'Given a natural number n, build its reversed number. Print the reversed number on the first line, and "DA" if n is a palindrome or "NU" otherwise on the second line.',
    inputFormatRo: 'Un număr natural n.',
    inputFormatEn: 'A natural number n.',
    outputFormatRo: 'Linia 1: oglinditul; Linia 2: DA sau NU.',
    outputFormatEn: 'Line 1: reversed value; Line 2: DA or NU.',
    constraints: '0 <= n <= 1 000 000 000',
    complexityTarget: 'O(log₁₀ n)',
    rewardCoins: 55,
    hintRo: 'Salvează o copie copie = n înainte de buclă! Construiește ogl = ogl * 10 + n % 10 și apoi compară ogl == copie.',
    hintEn: 'Keep a backup copie = n before the loop! Compute ogl = ogl * 10 + n % 10, then compare ogl == copie.',
    defaultStdin: '12321',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long copie = n, ogl = 0;
    // Calculează oglinditul și verifică dacă este palindrom

    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long copie = n, ogl = 0;
    while (n > 0) {
        ogl = ogl * 10 + n % 10;
        n /= 10;
    }
    cout << ogl << endl;
    if (ogl == copie) cout << "DA";
    else cout << "NU";
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Palindrom impar)', labelEn: 'Test 1 (Odd palindrome)', stdin: '12321', expectedOutput: '12321\nDA' },
      { id: 't2', labelRo: 'Test 2 (Nepalin)', labelEn: 'Test 2 (Non-palin)', stdin: '2048', expectedOutput: '8402\nNU' },
      { id: 't3', labelRo: 'Test 3 (Palindrom par)', labelEn: 'Test 3 (Even palin)', stdin: '7447', expectedOutput: '7447\nDA' },
      { id: 't4', labelRo: 'Test 4 (Cu zero final)', labelEn: 'Test 4 (Trailing zero)', stdin: '1200', expectedOutput: '21\nNU' },
      { id: 't5', labelRo: 'Test 5 (Cifră unică)', labelEn: 'Test 5 (Single digit)', stdin: '9', expectedOutput: '9\nDA' },
    ],
    dryRunQuiz: {
      promptRo: 'Ce se afișează pentru intrarea n = 1200 ?',
      promptEn: 'What does the solution print for input n = 1200?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int n, copie, ogl = 0;
    cin >> n;
    copie = n;
    while (n > 0) {
        ogl = ogl * 10 + n % 10;
        n /= 10;
    }
    cout << ogl << endl << (ogl == copie ? "DA" : "NU");
    return 0;
}`,
      stdin: '1200',
      options: ['21\nNU', '0021\nNU', '12\nNU', '21\nDA'],
      correctIndex: 0,
      explanationRo: 'Zerourile de la începutul unui int nu se păstrează: 0*10+0=0, 0*10+0=0, 0*10+2=2, 2*10+1=21. Deci afișează 21 și NU.',
      explanationEn: 'Leading zeros are dropped in integer math, yielding 21 on line 1 and NU on line 2.',
    },
  },
  {
    id: 'oji-cifra-maxima-aparitii',
    number: 4,
    tier: 'school',
    gradeLabelRo: 'Școlar · Cls VII',
    gradeLabelEn: 'School · Gr 7',
    titleRo: 'Cifra Maximă și Numărul de Apariții',
    titleEn: 'Maximum Digit & Frequency',
    statementRo:
      'Pentru un număr natural n dat (n >= 0), găsește cifra maximă din scrierea lui zecimală și de câte ori apare aceasta.',
    statementEn:
      'For a given non-negative integer n, find its largest decimal digit and how many times that digit appears.',
    inputFormatRo: 'Un număr întreg n (n >= 0).',
    inputFormatEn: 'A non-negative integer n.',
    outputFormatRo: 'Două numere separate printr-un spațiu: cifra_maxima numar_aparitii.',
    outputFormatEn: 'Two integers separated by space: max_digit frequency.',
    constraints: '0 <= n <= 2 000 000 000',
    complexityTarget: 'O(log₁₀ n)',
    rewardCoins: 60,
    hintRo: 'Atenție la cazul special n == 0 (cifra maximă e 0 și apare o dată, folosește do { ... } while (n > 0);). Dacă c > mx, resetează ap = 1; dacă c == mx, incrementează ap++.',
    hintEn: 'Watch out for n == 0 using do { ... } while (n > 0);. Reset ap = 1 when c > mx, and ap++ when c == mx.',
    defaultStdin: '94929',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int mx = -1, ap = 0;
    do {
        int c = n % 10;
        // Completează logica pentru mx și ap

        n /= 10;
    } while (n > 0);
    cout << mx << " " << ap;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int mx = -1, ap = 0;
    do {
        int c = n % 10;
        if (c > mx) {
            mx = c;
            ap = 1;
        } else if (c == mx) {
            ap++;
        }
        n /= 10;
    } while (n > 0);
    cout << mx << " " << ap;
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Apariții multiple)', labelEn: 'Test 1 (Multiple)', stdin: '94929', expectedOutput: '9 3' },
      { id: 't2', labelRo: 'Test 2 (Cazul limită 0)', labelEn: 'Test 2 (Zero edge case)', stdin: '0', expectedOutput: '0 1' },
      { id: 't3', labelRo: 'Test 3 (Toate egale)', labelEn: 'Test 3 (All equal)', stdin: '5555', expectedOutput: '5 4' },
      { id: 't4', labelRo: 'Test 4 (Unică maximă)', labelEn: 'Test 4 (Unique max)', stdin: '12834', expectedOutput: '8 1' },
      { id: 't5', labelRo: 'Test 5 (Număr mare)', labelEn: 'Test 5 (Large)', stdin: '707172', expectedOutput: '7 3' },
    ],
    dryRunQuiz: {
      promptRo: 'Ce valoare are variabila ap după terminarea buclei do-while pentru n = 48838 ?',
      promptEn: 'What is the value of ap after the loop finishes for n = 48838?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int n = 48838, mx = -1, ap = 0;
    do {
        int c = n % 10;
        if (c > mx) { mx = c; ap = 1; }
        else if (c == mx) ap++;
        n /= 10;
    } while (n > 0);
    cout << mx << " " << ap;
    return 0;
}`,
      stdin: '',
      options: ['1', '2', '3', '4'],
      correctIndex: 2,
      explanationRo: 'Cifra maximă din 48838 este 8, care apare de 3 ori (unități, sute, mii).',
      explanationEn: 'The largest digit in 48838 is 8, appearing 3 times.',
    },
  },
  {
    id: 'oji-euclid-cmmdc-cmmmc',
    number: 5,
    tier: 'school',
    gradeLabelRo: 'Școlar · Cls VII',
    gradeLabelEn: 'School · Gr 7',
    titleRo: 'CMMDC & CMMMC prin Algoritmul lui Euclid',
    titleEn: 'GCD & LCM via Euclidean Algorithm',
    statementRo:
      'Se dau două numere naturale nenule a și b. Folosind algoritmul eficient al lui Euclid (cu împărțiri repetate), determină Cel Mai Mare Divizor Comun (CMMDC) și Cel Mai Mic Multiplu Comun (CMMMC).',
    statementEn:
      'Given two positive integers a and b, use the Euclidean division algorithm to compute their Greatest Common Divisor (GCD) and Least Common Multiple (LCM).',
    inputFormatRo: 'Două numere întregi pozitive a și b.',
    inputFormatEn: 'Two positive integers a and b.',
    outputFormatRo: 'Două numere separate prin spațiu: CMMDC CMMMC.',
    outputFormatEn: 'Two integers separated by space: GCD LCM.',
    constraints: '1 <= a, b <= 100 000',
    complexityTarget: 'O(log min(a, b))',
    rewardCoins: 65,
    hintRo: 'Nu uita să salvezi produsul inițial (sau copiile ca, cb)! CMMMC = (a / cmmdc) * b pentru a evita depășirea.',
    hintEn: 'Keep copies of a and b before Euclid modifies them! LCM = (ca / gcd) * cb avoids overflow.',
    defaultStdin: '48 18',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    long long ca = a, cb = b;
    // Aplică algoritmul lui Euclid

    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    long long ca = a, cb = b;
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    long long cmmmc = (ca / a) * cb;
    cout << a << " " << cmmmc;
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (48 și 18)', labelEn: 'Test 1 (48 and 18)', stdin: '48 18', expectedOutput: '6 144' },
      { id: 't2', labelRo: 'Test 2 (Prime între ele)', labelEn: 'Test 2 (Coprime)', stdin: '17 13', expectedOutput: '1 221' },
      { id: 't3', labelRo: 'Test 3 (Multiplu exact)', labelEn: 'Test 3 (Multiple)', stdin: '25 100', expectedOutput: '25 100' },
      { id: 't4', labelRo: 'Test 4 (Egale)', labelEn: 'Test 4 (Equal)', stdin: '42 42', expectedOutput: '42 42' },
      { id: 't5', labelRo: 'Test 5 (Valori mari)', labelEn: 'Test 5 (Large)', stdin: '360 225', expectedOutput: '45 1800' },
    ],
    dryRunQuiz: {
      promptRo: 'Câte iterații execută bucla while (b != 0) în algoritmul lui Euclid pentru a = 48, b = 18 ?',
      promptEn: 'How many iterations does while (b != 0) execute for a = 48, b = 18?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int a = 48, b = 18;
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    cout << a;
    return 0;
}`,
      stdin: '',
      options: ['2 iterații', '3 iterații', '4 iterații', '6 iterații'],
      correctIndex: 1,
      explanationRo: '(48,18) -> r=12 -> (18,12) -> r=6 -> (12,6) -> r=0 -> (6,0). Exact 3 iterații!',
      explanationEn: '(48,18) -> r=12 -> (18,12) -> r=6 -> (12,6) -> r=0 -> (6,0). Exactly 3 iterations!',
    },
  },

  // ================= TIER 3: COUNTY OJI =================
  {
    id: 'oji-numar-divizori-prim',
    number: 6,
    tier: 'county',
    gradeLabelRo: 'Județean OJI · Cls VIII',
    gradeLabelEn: 'County OJI · Gr 8',
    titleRo: 'Număr Divizori & Test Prim O(√n)',
    titleEn: 'Divisor Count & Prime Test O(√n)',
    statementRo:
      'Se citește un număr natural n >= 1. Afișează pe o singură linie numărul total de divizori pozitivi ai lui n, urmat de un spațiu și de mesajul "PRIM" dacă n este prim sau "COMPUS" (inclusiv pentru n=1 -> "NEPRIM"). Pentru n=1 afișează "1 NEPRIM".',
    statementEn:
      'Given n >= 1, compute the total number of positive divisors of n in O(√n) time, followed by a space and "PRIM" if prime, "NEPRIM" if n == 1, or "COMPUS" otherwise.',
    inputFormatRo: 'Un număr întreg n >= 1.',
    inputFormatEn: 'An integer n >= 1.',
    outputFormatRo: 'Numărul de divizori urmat de clasificare.',
    outputFormatEn: 'Divisor count followed by classification.',
    constraints: '1 <= n <= 1 000 000 000',
    complexityTarget: 'O(√n)',
    rewardCoins: 75,
    hintRo: 'Parcurge d de la 1 până la d * d <= n. Dacă n % d == 0: adaugă 1 divizor dacă d * d == n, sau 2 divizori (d și n / d) altfel!',
    hintEn: 'Loop d from 1 while d * d <= n. When n % d == 0, add 1 divisor if d * d == n, else add 2 (d and n / d).',
    defaultStdin: '36',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int nrDiv = 0;
    // Calculează nrDiv în O(sqrt(n))

    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int nrDiv = 0;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) {
            if (d * d == n) nrDiv++;
            else nrDiv += 2;
        }
    }
    cout << nrDiv << " ";
    if (n == 1) cout << "NEPRIM";
    else if (nrDiv == 2) cout << "PRIM";
    else cout << "COMPUS";
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Pătrat perfect 36)', labelEn: 'Test 1 (Square 36)', stdin: '36', expectedOutput: '9 COMPUS' },
      { id: 't2', labelRo: 'Test 2 (Număr prim mare)', labelEn: 'Test 2 (Prime 97)', stdin: '97', expectedOutput: '2 PRIM' },
      { id: 't3', labelRo: 'Test 3 (Cazul 1)', labelEn: 'Test 3 (Case 1)', stdin: '1', expectedOutput: '1 NEPRIM' },
      { id: 't4', labelRo: 'Test 4 (Prim par 2)', labelEn: 'Test 4 (Prime 2)', stdin: '2', expectedOutput: '2 PRIM' },
      { id: 't5', labelRo: 'Test 5 (Pătrat de prim 49)', labelEn: 'Test 5 (Square of prime)', stdin: '49', expectedOutput: '3 COMPUS' },
    ],
    dryRunQuiz: {
      promptRo: 'De ce este greșit să adunăm mereu 2 la nrDiv atunci când d * d == n (de exemplu n = 36, d = 6)?',
      promptEn: 'Why must we add 1 instead of 2 to nrDiv when d * d == n (e.g., n = 36, d = 6)?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int n = 36, nrDiv = 0;
    for (int d = 1; d * d <= n; d++) {
        if (n % d == 0) {
            if (d * d == n) nrDiv++;
            else nrDiv += 2;
        }
    }
    cout << nrDiv;
    return 0;
}`,
      stdin: '',
      options: [
        'Pentru că d și n/d sunt același număr (6) și l-am număra de două ori',
        'Pentru că 6 nu divide pe 36',
        'Pentru că bucla for se oprește înainte de 6',
        'Pentru că radicalul este întotdeauna impar',
      ],
      correctIndex: 0,
      explanationRo: 'Când d = 6, n / d = 36 / 6 = 6. Perechea (d, n/d) este (6, 6), deci 6 trebuie numărat o singură dată.',
      explanationEn: 'At d = 6, n / d = 6 as well, so counting both would double-count 6.',
    },
  },
  {
    id: 'oji-secventa-crescatoare',
    number: 7,
    tier: 'county',
    gradeLabelRo: 'Județean OJI · Cls VIII',
    gradeLabelEn: 'County OJI · Gr 8',
    titleRo: 'Cea Mai Lungă Secvență Strict Crescătoare',
    titleEn: 'Longest Strictly Increasing Contiguous Subarray',
    statementRo:
      'Se citește n, urmat de n numere întregi. Determină lungimea maximă a unei secvențe de elemente alăturate strict crescătoare (v[i] > v[i-1]).',
    statementEn:
      'Given n followed by n integers, find the maximum length of a contiguous strictly increasing subarray.',
    inputFormatRo: 'n, urmat de n numere întregi.',
    inputFormatEn: 'n, followed by n integers.',
    outputFormatRo: 'Un singur număr: lungimea maximă.',
    outputFormatEn: 'A single integer: maximum length.',
    constraints: '1 <= n <= 400',
    complexityTarget: 'O(n)',
    rewardCoins: 80,
    hintRo: 'Ține contorul curent lenCur (inițial 1) și maximul lenMax (inițial 1). Dacă x > prev, lenCur++; altfel lenCur = 1. Actualizează mereu lenMax!',
    hintEn: 'Maintain current streak lenCur (starts at 1) and lenMax (starts at 1). If x > prev, increment lenCur; else reset lenCur = 1.',
    defaultStdin: '8 3 5 8 2 4 7 9 1',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int prev, x, lenCur = 1, lenMax = 1;
    cin >> prev;
    // Citește restul de n-1 elemente

    cout << lenMax;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int prev, x, lenCur = 1, lenMax = 1;
    cin >> prev;
    for (int i = 1; i < n; i++) {
        cin >> x;
        if (x > prev) {
            lenCur++;
            if (lenCur > lenMax) lenMax = lenCur;
        } else {
            lenCur = 1;
        }
        prev = x;
    }
    cout << lenMax;
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Exemplu)', labelEn: 'Test 1 (Sample)', stdin: '8 3 5 8 2 4 7 9 1', expectedOutput: '4' },
      { id: 't2', labelRo: 'Test 2 (Strict descrescător)', labelEn: 'Test 2 (Decreasing)', stdin: '5 9 7 5 3 1', expectedOutput: '1' },
      { id: 't3', labelRo: 'Test 3 (Egalități incluse)', labelEn: 'Test 3 (With equals)', stdin: '6 1 2 2 3 4 5', expectedOutput: '4' },
      { id: 't4', labelRo: 'Test 4 (Tot vectorul)', labelEn: 'Test 4 (Entire array)', stdin: '5 10 20 30 40 50', expectedOutput: '5' },
      { id: 't5', labelRo: 'Test 5 (Un element)', labelEn: 'Test 5 (One element)', stdin: '1 42', expectedOutput: '1' },
    ],
    dryRunQuiz: {
      promptRo: 'Ce afișează algoritmul pentru șirul 1 2 2 3 4 5 (6 elemente)?',
      promptEn: 'What does the algorithm output for 1 2 2 3 4 5 (6 elements)?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int v[] = {1, 2, 2, 3, 4, 5};
    int lenCur = 1, lenMax = 1;
    for (int i = 1; i < 6; i++) {
        if (v[i] > v[i - 1]) {
            lenCur++;
            if (lenCur > lenMax) lenMax = lenCur;
        } else lenCur = 1;
    }
    cout << lenMax;
    return 0;
}`,
      stdin: '',
      options: ['2', '4', '5', '6'],
      correctIndex: 1,
      explanationRo: 'Secvența [1, 2] are lungimea 2; la al doilea 2 nu e strict mai mare, se resetează la 1; apoi [2, 3, 4, 5] are lungimea 4.',
      explanationEn: '[1, 2] has length 2, resets at equal 2, then [2, 3, 4, 5] reaches length 4.',
    },
  },
  {
    id: 'oji-bubble-sort-mediana',
    number: 8,
    tier: 'county',
    gradeLabelRo: 'Județean OJI · Cls VIII',
    gradeLabelEn: 'County OJI · Gr 8',
    titleRo: 'Sortare Vector (Bubble Sort) & Element Median',
    titleEn: 'Bubble Sort & Array Median',
    statementRo:
      'Se citesc n (număr impar) și n numere întregi într-un vector v. Sortează vectorul crescător și afișează pe prima linie elementele sortate separate prin spațiu, iar pe a doua linie elementul din mijloc (mediana).',
    statementEn:
      'Given an odd integer n and n integers in an array v, sort the array ascending. Print the sorted array on line 1, and its median element (v[n/2]) on line 2.',
    inputFormatRo: 'n impar, urmat de n numere întregi.',
    inputFormatEn: 'Odd integer n, followed by n integers.',
    outputFormatRo: 'Linia 1: vectorul sortat; Linia 2: elementul median.',
    outputFormatEn: 'Line 1: sorted array; Line 2: median value.',
    constraints: '1 <= n <= 200, n impar',
    complexityTarget: 'O(n²)',
    rewardCoins: 85,
    hintRo: 'Poți folosi swap(v[i], v[i + 1]) într-o buclă do { sortat = true; ... } while (!sortat); și apoi afișezi v[n / 2]!',
    hintEn: 'Use swap(v[i], v[i + 1]) inside do { sortat = true; ... } while (!sortat); then output v[n / 2]!',
    defaultStdin: '5 40 10 50 20 30',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n, v[205];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> v[i];
    // Sortează crescător și afișează rezultatul

    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n, v[205];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> v[i];
    bool sortat;
    do {
        sortat = true;
        for (int i = 0; i < n - 1; i++) {
            if (v[i] > v[i + 1]) {
                swap(v[i], v[i + 1]);
                sortat = false;
            }
        }
    } while (!sortat);

    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << v[i];
    }
    cout << endl << v[n / 2];
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (5 numere)', labelEn: 'Test 1 (5 numbers)', stdin: '5 40 10 50 20 30', expectedOutput: '10 20 30 40 50\n30' },
      { id: 't2', labelRo: 'Test 2 (Ordine inversă)', labelEn: 'Test 2 (Reversed)', stdin: '5 9 7 5 3 1', expectedOutput: '1 3 5 7 9\n5' },
      { id: 't3', labelRo: 'Test 3 (Cu negative)', labelEn: 'Test 3 (Negatives)', stdin: '3 -5 12 0', expectedOutput: '-5 0 12\n0' },
      { id: 't4', labelRo: 'Test 4 (Un element)', labelEn: 'Test 4 (Single)', stdin: '1 99', expectedOutput: '99\n99' },
      { id: 't5', labelRo: 'Test 5 (Duplicate)', labelEn: 'Test 5 (Duplicates)', stdin: '7 4 2 4 1 2 4 3', expectedOutput: '1 2 2 3 4 4 4\n3' },
    ],
    dryRunQuiz: {
      promptRo: 'După O SINGURĂ trecere (for i = 0; i < n - 1) în Bubble Sort pe vectorul {50, 20, 40, 10, 30}, ce element ajunge sigur pe ultima poziție v[4]?',
      promptEn: 'After ONE full pass of Bubble Sort on {50, 20, 40, 10, 30}, which value is guaranteed to land at v[4]?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int v[5] = {50, 20, 40, 10, 30};
    for (int i = 0; i < 4; i++) {
        if (v[i] > v[i + 1]) swap(v[i], v[i + 1]);
    }
    cout << v[4];
    return 0;
}`,
      stdin: '',
      options: ['30', '40', '50', '10'],
      correctIndex: 2,
      explanationRo: 'Elementul maxim (50) „urcă” prin interschimbări succesive până la capătul din dreapta v[4].',
      explanationEn: 'The maximum element (50) bubbles all the way to the rightmost position v[4].',
    },
  },
  {
    id: 'oji-cautare-binara',
    number: 9,
    tier: 'county',
    gradeLabelRo: 'Județean OJI · Cls VIII',
    gradeLabelEn: 'County OJI · Gr 8',
    titleRo: 'Căutare Binară în Vector Sortat',
    titleEn: 'Binary Search in Sorted Array',
    statementRo:
      'Se citesc n, apoi n numere întregi sortate strict crescător (indexate de la 0), urmate de valoarea căutată x. Afișează poziția lui x în vector (0..n-1) folosind căutare binară O(log n), sau -1 dacă nu există.',
    statementEn:
      'Given n, n strictly ascending integers (0-indexed), and target x, print the index of x (0..n-1) using O(log n) binary search, or -1 if absent.',
    inputFormatRo: 'n, n numere sortate crescător, apoi x.',
    inputFormatEn: 'n, n sorted integers, then x.',
    outputFormatRo: 'Indicele 0-based al lui x sau -1.',
    outputFormatEn: '0-based index of x or -1.',
    constraints: '1 <= n <= 400',
    complexityTarget: 'O(log n)',
    rewardCoins: 90,
    hintRo: 'Menține st = 0, dr = n - 1. În while (st <= dr), calculează mij = (st + dr) / 2. Dacă v[mij] < x mută st = mij + 1, altfel dr = mij - 1.',
    hintEn: 'Maintain st = 0, dr = n - 1. While st <= dr, compute mij = (st + dr) / 2 and halve the range.',
    defaultStdin: '7 4 11 19 25 38 52 70 38',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n, x, v[405];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> v[i];
    cin >> x;
    int st = 0, dr = n - 1, poz = -1;
    // Implementează while (st <= dr)

    cout << poz;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n, x, v[405];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> v[i];
    cin >> x;
    int st = 0, dr = n - 1, poz = -1;
    while (st <= dr) {
        int mij = (st + dr) / 2;
        if (v[mij] == x) {
            poz = mij;
            break;
        } else if (v[mij] < x) {
            st = mij + 1;
        } else {
            dr = mij - 1;
        }
    }
    cout << poz;
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Găsit la mijloc-dreapta)', labelEn: 'Test 1 (Found)', stdin: '7 4 11 19 25 38 52 70 38', expectedOutput: '4' },
      { id: 't2', labelRo: 'Test 2 (Primul element)', labelEn: 'Test 2 (First element)', stdin: '6 10 20 30 40 50 60 10', expectedOutput: '0' },
      { id: 't3', labelRo: 'Test 3 (Ultimul element)', labelEn: 'Test 3 (Last element)', stdin: '6 10 20 30 40 50 60 60', expectedOutput: '5' },
      { id: 't4', labelRo: 'Test 4 (Inexistent)', labelEn: 'Test 4 (Not found)', stdin: '5 2 5 8 12 20 9', expectedOutput: '-1' },
      { id: 't5', labelRo: 'Test 5 (Peste maxim)', labelEn: 'Test 5 (Out of range)', stdin: '4 1 3 5 7 99', expectedOutput: '-1' },
    ],
    dryRunQuiz: {
      promptRo: 'În vectorul {4, 11, 19, 25, 38, 52, 70} (n=7), ce indice mij verifică prima dată căutarea binară pentru x = 52 ?',
      promptEn: 'In {4, 11, 19, 25, 38, 52, 70} (n=7), which mid index is checked first when searching for x = 52?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int st = 0, dr = 6;
    int mij = (st + dr) / 2;
    cout << mij;
    return 0;
}`,
      stdin: '',
      options: ['mij = 2 (valoarea 19)', 'mij = 3 (valoarea 25)', 'mij = 4 (valoarea 38)', 'mij = 5 (valoarea 52)'],
      correctIndex: 1,
      explanationRo: 'La primul pas st=0, dr=6, deci mij = (0 + 6) / 2 = 3 (valoarea 25). Deoarece 25 < 52, st devine 4.',
      explanationEn: 'Initially st=0, dr=6 -> mij = (0 + 6) / 2 = 3 (value 25). Since 25 < 52, st becomes 4.',
    },
  },

  // ================= TIER 4: NATIONAL & CS TRACK =================
  {
    id: 'oji-ciur-perechi-prime',
    number: 10,
    tier: 'national',
    gradeLabelRo: 'Național · Admitere Mate-Info',
    gradeLabelEn: 'National · CS Track',
    titleRo: 'Ciurul lui Eratostene & Numărul de Prime <= N',
    titleEn: 'Sieve of Eratosthenes & Prime Count <= N',
    statementRo:
      'Se citește un număr natural n (2 <= n <= 400). Folosind Ciurul lui Eratostene într-un vector caracteristic, numără câte numere prime există în intervalul [2, n] și afișează și cel mai mare număr prim <= n.',
    statementEn:
      'Given n (2 <= n <= 400), build the Sieve of Eratosthenes to count how many prime numbers exist in [2, n] and also print the largest prime <= n.',
    inputFormatRo: 'Un număr întreg n.',
    inputFormatEn: 'An integer n.',
    outputFormatRo: 'Două numere separate printr-un spațiu: nr_prime cel_mai_mare_prim.',
    outputFormatEn: 'Two integers separated by space: prime_count largest_prime.',
    constraints: '2 <= n <= 400',
    complexityTarget: 'O(n log log n)',
    rewardCoins: 100,
    hintRo: 'Inițializează un vector compus[405] cu 0. Pentru i = 2..n, dacă compus[i] == 0, atunci i este prim și marchează toți multiplii j = 2*i, 3*i... <= n cu 1!',
    hintEn: 'Keep a boolean/int array compus[405] = {0}. Whenever compus[i] == 0, i is prime and mark all multiples j = i*i; j <= n; j += i.',
    defaultStdin: '30',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n, compus[405];
    cin >> n;
    for (int i = 0; i <= n; i++) compus[i] = 0;
    // Aplică Ciurul lui Eratostene

    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n, compus[405];
    cin >> n;
    for (int i = 0; i <= n; i++) compus[i] = 0;
    compus[0] = compus[1] = 1;
    for (int i = 2; i * i <= n; i++) {
        if (compus[i] == 0) {
            for (int j = i * i; j <= n; j += i) {
                compus[j] = 1;
            }
        }
    }
    int cnt = 0, lastP = 2;
    for (int i = 2; i <= n; i++) {
        if (compus[i] == 0) {
            cnt++;
            lastP = i;
        }
    }
    cout << cnt << " " << lastP;
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (n = 30)', labelEn: 'Test 1 (n = 30)', stdin: '30', expectedOutput: '10 29' },
      { id: 't2', labelRo: 'Test 2 (n = 2)', labelEn: 'Test 2 (n = 2)', stdin: '2', expectedOutput: '1 2' },
      { id: 't3', labelRo: 'Test 3 (n = 100)', labelEn: 'Test 3 (n = 100)', stdin: '100', expectedOutput: '25 97' },
      { id: 't4', labelRo: 'Test 4 (n = 200)', labelEn: 'Test 4 (n = 200)', stdin: '200', expectedOutput: '46 199' },
      { id: 't5', labelRo: 'Test 5 (n = 350)', labelEn: 'Test 5 (n = 350)', stdin: '350', expectedOutput: '70 349' },
    ],
    dryRunQuiz: {
      promptRo: 'În Ciurul lui Eratostene, de ce bucla interioară de tăiere a multiplilor lui i poate începe direct de la i * i ?',
      promptEn: 'In the Sieve of Eratosthenes, why can the inner loop start directly at i * i?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int n = 25, compus[30];
    for (int i = 0; i <= n; i++) compus[i] = 0;
    for (int i = 2; i * i <= n; i++) {
        if (compus[i] == 0) {
            for (int j = i * i; j <= n; j += i) compus[j] = 1;
        }
    }
    cout << compus[25] << " " << compus[23];
    return 0;
}`,
      stdin: '',
      options: [
        'Toți multiplii k*i cu k < i au fost deja marcați de factorii primi mai mici decât i',
        'Pentru că i*i este întotdeauna prim',
        'Pentru că numerele mai mici decât i*i sunt toate prime',
        'Pentru a evita împărțirea la zero',
      ],
      correctIndex: 0,
      explanationRo: 'Orice multiplu k * i cu k < i are un divizor prim <= k < i, deci a fost tăiat deja într-un pas anterior.',
      explanationEn: 'Every multiple k*i with k < i has a prime factor smaller than i and was already crossed out earlier.',
    },
  },
  {
    id: 'oji-kadane-subsecventa',
    number: 11,
    tier: 'national',
    gradeLabelRo: 'Național · Admitere Mate-Info',
    gradeLabelEn: 'National · CS Track',
    titleRo: 'Subsecvența de Sumă Maximă (Algoritmul Kadane)',
    titleEn: 'Maximum Subarray Sum (Kadane O(n))',
    statementRo:
      'Se citesc n și un șir de n numere întregi (care pot fi și negative). Găsește suma maximă a unei subsecvențe nevide de elemente alăturate, în complexitate O(n).',
    statementEn:
      'Given n and n integers (including negatives), find the maximum possible sum of a non-empty contiguous subarray in O(n) time.',
    inputFormatRo: 'n, urmat de n numere întregi.',
    inputFormatEn: 'n, followed by n integers.',
    outputFormatRo: 'Suma maximă a unei subsecvențe continue.',
    outputFormatEn: 'The maximum contiguous subarray sum.',
    constraints: '1 <= n <= 500, -1000 <= v[i] <= 1000',
    complexityTarget: 'O(n)',
    rewardCoins: 110,
    hintRo: 'Pentru fiecare element x, decizi dacă îl continui la suma curentă (cur + x) sau începi o subsecvență nouă de la x: cur = max(x, cur + x), apoi best = max(best, cur).',
    hintEn: 'At each element x, either extend the running sum or start fresh: cur = max(x, cur + x); best = max(best, cur).',
    defaultStdin: '8 -2 1 -3 4 -1 2 1 -5',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n, x;
    cin >> n >> x;
    int cur = x, best = x;
    // Aplică algoritmul lui Kadane pentru restul de n-1 elemente

    cout << best;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n, x;
    cin >> n >> x;
    int cur = x, best = x;
    for (int i = 1; i < n; i++) {
        cin >> x;
        cur = max(x, cur + x);
        if (cur > best) best = cur;
    }
    cout << best;
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Clasic mixt)', labelEn: 'Test 1 (Mixed)', stdin: '8 -2 1 -3 4 -1 2 1 -5', expectedOutput: '6' },
      { id: 't2', labelRo: 'Test 2 (Toate negative)', labelEn: 'Test 2 (All negative)', stdin: '4 -8 -3 -6 -2', expectedOutput: '-2' },
      { id: 't3', labelRo: 'Test 3 (Toate pozitive)', labelEn: 'Test 3 (All positive)', stdin: '5 1 2 3 4 5', expectedOutput: '15' },
      { id: 't4', labelRo: 'Test 4 (Două vârfuri)', labelEn: 'Test 4 (Two peaks)', stdin: '6 5 -10 4 4 -1 3', expectedOutput: '10' },
      { id: 't5', labelRo: 'Test 5 (Un element negativ)', labelEn: 'Test 5 (Single neg)', stdin: '1 -7', expectedOutput: '-7' },
    ],
    dryRunQuiz: {
      promptRo: 'Ce rezultat trebuie să returneze Kadane pentru șirul {-8, -3, -6, -2} (toate negative)?',
      promptEn: 'What must Kadane output for {-8, -3, -6, -2} (all negative)?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int v[] = {-8, -3, -6, -2};
    int cur = v[0], best = v[0];
    for (int i = 1; i < 4; i++) {
        cur = max(v[i], cur + v[i]);
        best = max(best, cur);
    }
    cout << best;
    return 0;
}`,
      stdin: '',
      options: ['0', '-19', '-2', '-8'],
      correctIndex: 2,
      explanationRo: 'Subsecvența trebuie să fie NEVIDĂ, deci cea mai bună alegere când toate elementele sunt negative este elementul maxim (-2).',
      explanationEn: 'Since the subarray must be non-empty, the best sum among all negatives is the single largest value (-2).',
    },
  },
  {
    id: 'oji-rotire-vector-k',
    number: 12,
    tier: 'national',
    gradeLabelRo: 'Național · Admitere Mate-Info',
    gradeLabelEn: 'National · CS Track',
    titleRo: 'Rotire Circulară Vector cu K Poziții O(n)',
    titleEn: 'Circular Array Rotation by K Steps O(n)',
    statementRo:
      'Se citesc n, k și apoi n numere întregi. Rotește circular vectorul la DREAPTA cu k poziții în timp O(n) (folosind tripla inversare sau indexare modulară, ținând cont că k poate fi mai mare decât n!). Afișează vectorul rotit separat prin spații.',
    statementEn:
      'Given n, k, and n integers, rotate the array RIGHT by k positions in O(n) time (handling k >= n cleanly) and print the rotated elements separated by spaces.',
    inputFormatRo: 'n, k, apoi cele n elemente ale vectorului.',
    inputFormatEn: 'n, k, then n array integers.',
    outputFormatRo: 'Cele n elemente după rotirea la dreapta cu k poziții.',
    outputFormatEn: 'The n integers after rotating right by k steps.',
    constraints: '1 <= n <= 300, 0 <= k <= 100 000',
    complexityTarget: 'O(n)',
    rewardCoins: 120,
    hintRo: 'Mai întâi redu k = k % n! Cu metoda triplei inversări: inversează [0, n-1], apoi [0, k-1], apoi [k, n-1] folosind funcția void inverseaza(int v[], int st, int dr)!',
    hintEn: 'First reduce k = k % n! Use the 3-reversal trick: reverse [0, n-1], reverse [0, k-1], reverse [k, n-1].',
    defaultStdin: '5 2 10 20 30 40 50',
    starterCode: `#include <iostream>
using namespace std;

void inverseaza(int v[], int st, int dr) {
    while (st < dr) {
        swap(v[st], v[dr]);
        st++;
        dr--;
    }
}

int main() {
    int n, k, v[305];
    cin >> n >> k;
    for (int i = 0; i < n; i++) cin >> v[i];
    // Aplică k = k % n și cele 3 inversări

    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

void inverseaza(int v[], int st, int dr) {
    while (st < dr) {
        swap(v[st], v[dr]);
        st++;
        dr--;
    }
}

int main() {
    int n, k, v[305];
    cin >> n >> k;
    for (int i = 0; i < n; i++) cin >> v[i];
    k = k % n;
    if (k > 0) {
        inverseaza(v, 0, n - 1);
        inverseaza(v, 0, k - 1);
        inverseaza(v, k, n - 1);
    }
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << v[i];
    }
    return 0;
}`,
    tests: [
      { id: 't1', labelRo: 'Test 1 (Rotire k=2)', labelEn: 'Test 1 (k=2)', stdin: '5 2 10 20 30 40 50', expectedOutput: '40 50 10 20 30' },
      { id: 't2', labelRo: 'Test 2 (k > n: 7 la 5)', labelEn: 'Test 2 (k > n)', stdin: '5 7 1 2 3 4 5', expectedOutput: '4 5 1 2 3' },
      { id: 't3', labelRo: 'Test 3 (k multiplu de n)', labelEn: 'Test 3 (k multiple of n)', stdin: '4 8 9 8 7 6', expectedOutput: '9 8 7 6' },
      { id: 't4', labelRo: 'Test 4 (k = 0)', labelEn: 'Test 4 (k = 0)', stdin: '3 0 5 6 7', expectedOutput: '5 6 7' },
      { id: 't5', labelRo: 'Test 5 (k = 1)', labelEn: 'Test 5 (k = 1)', stdin: '6 1 11 22 33 44 55 66', expectedOutput: '66 11 22 33 44 55' },
    ],
    dryRunQuiz: {
      promptRo: 'Dacă rotim la dreapta vectorul {1, 2, 3, 4, 5} (n = 5) cu k = 12 poziții, care este primul element al rezultatului?',
      promptEn: 'When rotating {1, 2, 3, 4, 5} (n = 5) right by k = 12 steps, what is the first element?',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int v[] = {1, 2, 3, 4, 5};
    int n = 5, k = 12 % n;
    cout << v[n - k];
    return 0;
}`,
      stdin: '',
      options: ['1', '3', '4', '5'],
      correctIndex: 2,
      explanationRo: 'k % n = 12 % 5 = 2. Rotirea cu 2 poziții la dreapta aduce elementele {4, 5} în față: {4, 5, 1, 2, 3}. Primul este 4.',
      explanationEn: '12 % 5 = 2. Rotating right by 2 yields {4, 5, 1, 2, 3}, so the first element is 4.',
    },
  },
];

export function getDailyOlympiadProblem(): OlympiadProblem {
  const now = new Date();
  const daySeed =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const idx = daySeed % OLYMPIAD_PROBLEMS.length;
  return OLYMPIAD_PROBLEMS[idx];
}

export function getTodayOlympiadBonusKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `arkedo_oji_daily_bonus_${y}-${m}-${d}`;
}
