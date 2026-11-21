import { WorksheetItem } from './types';

export const GRADE_7_AND_8_WORKSHEETS: WorksheetItem[] = [
  {
    id: 'ws-g7-cpp-operatori-pahare',
    grade: 7,
    kind: 'worksheet',
    estimatedMinutes: 30,
    maxPoints: 100,
    exOfficioPoints: 10,
    publishedAt: '2026-04-10',
    curriculumRef: 'OMEN 3393/2017 · Clasa a VII-a · Introducere C++ & Operatori',
    relatedModuleId: 'g7_cpp_b',
    relatedBlogSlugRo: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    relatedBlogSlugEn: 'middle-school-cpp-common-errors-if-while-digits',
    relatedGlossarySlugRo: 'regula-celor-3-pahare',
    relatedGlossarySlugEn: 'three-cups-swap',
    optionalCppTraceCode: `#include <iostream>
using namespace std;

int main() {
    int a, b, aux;
    cin >> a >> b;
    aux = a;
    a = b;
    b = aux;
    cout << "Dupa swap: " << a << " " << b << endl;
    cout << "Ultima cifra a lui a: " << (a % 10) << endl;
    cout << "Fara ultima cifra: " << (a / 10) << endl;
    return 0;
}`,
    optionalCppTraceStdin: '12 47',
    ro: {
      slug: 'fisa-de-lucru-clasa-7-cpp-operatori-modulo-regula-3-pahare',
      title: 'Fișă de Lucru C++ Clasa a VII-a: Operatori (`/`, `%`) & Regula celor 3 Pahare (cu Trace RAM)',
      breadcrumbLabel: 'Fișă C++ Cls. VII: /, % & 3 Pahare',
      metaTitle: 'Fișă de Lucru C++ Clasa 7 cu Barem: Operatori %10, /10 & Swap | ArkyEdu',
      metaDescription: 'Fișă de lucru C++ clasa a VII-a cu barem 100p și vizualizator RAM: împărțire întreagă /, restul modulo %, interschimbare cu aux (regula celor 3 pahare) și erori cin/cout.',
      keywords: [
        'fisa de lucru c++ clasa 7',
        'regula celor 3 pahare c++ exercitii',
        'operatorul modulo % si impartirea intreaga c++',
        'exercitii c++ structura liniara cu barem',
      ],
      directAnswerSummary:
        'Fișa consolidează structura liniară C++ (100p): împărțirea întreagă la `int` (`17 / 5 == 3`), extragerea ultimei cifre cu `% 10`, tăierea ultimei cifre cu `/ 10`, diferența `=` (atribuire) vs `==` (egalitate) și interschimbarea corectă folosind `aux` (Regula celor 3 pahare).',
      objectives: [
        'Calcularea expresiilor cu împărțire întreagă `/` și restul împărțirii `%` pe tipul `int`.',
        'Aplicarea corectă a regulii celor 3 pahare (`aux = a; a = b; b = aux;`) fără suprascrierea valorii inițiale.',
        'Descompunerea unui număr de 2–3 cifre folosind `% 10` și `/ 10`.',
      ],
      theorySnapshot:
        'La numere întregi (`int`): `n % 10` dă ultima cifră (ex: `247 % 10 = 7`), iar `n / 10` elimină ultima cifră (`247 / 10 = 24`). Pentru `swap(a, b)`, scriem mereu `aux = a; a = b; b = aux;` — dacă scrii direct `a = b; b = a;`, valoarea inițială a lui `a` se pierde!',
      teacherTips:
        'Apasă butonul „Deschide în Trace C++” pentru a urmări pas cu pas cum se modifică `a`, `b` și `aux` în memoria RAM!',
    },
    en: {
      slug: 'grade-7-cpp-operators-modulo-swap-three-cups-worksheet',
      title: 'Grade 7 C++ Worksheet: Integer Division (`/`), Modulo (`%`) & 3-Cup Swap (with RAM Trace)',
      breadcrumbLabel: 'G7 C++ Sheet: /, % & Swap',
      metaTitle: 'Grade 7 C++ Operators & Swap Worksheet with Rubric | ArkyEdu',
      metaDescription: 'Grade 7 C++ worksheet with 100-point rubric and visual RAM trace: integer division /, modulo %10, 3-cup swap with aux, and cin/cout expressions.',
      keywords: [
        'grade 7 c++ operators worksheet',
        'modulo and integer division c++ quiz',
        'swap two variables aux c++ exercises',
      ],
      directAnswerSummary:
        'Covers C++ linear basics (100 pts): integer division (`17 / 5 == 3`), last digit extraction via `% 10`, digit truncation via `/ 10`, assignment `=` vs equality `==`, and safe 3-variable swapping (`aux = a; a = b; b = aux;`).',
      objectives: [
        'Evaluate integer division `/` and modulo `%` expressions accurately.',
        'Swap two variables safely with an auxiliary variable `aux`.',
        'Extract digits from integers using `% 10` and `/ 10`.',
      ],
      theorySnapshot:
        'For `int`: `n % 10` gives the last digit (`247 % 10 == 7`) and `n / 10` removes it (`247 / 10 == 24`). Never swap via `a = b; b = a;`—you lose the original `a` unless you save it in `aux` first.',
      teacherTips:
        'Click "Open in C++ Trace" to watch RAM memory boxes update line by line during the 3-cup swap.',
    },
    questions: [
      {
        id: 'cpp7a-q1',
        partLabelRo: 'Subiectul I · 1',
        partLabelEn: 'Part I · 1',
        points: 18,
        type: 'mcq',
        promptRo: 'Fie variabilele `int a = 19, b = 4;`. Ce valori vor fi afișate de `cout << a / b << " " << a % b;`?',
        promptEn: 'Given `int a = 19, b = 4;`, what will `cout << a / b << " " << a % b;` print?',
        optionsRo: ['4.75 3', '4 3', '3 4', '4 1'],
        optionsEn: ['4.75 3', '4 3', '3 4', '4 1'],
        correctAnswer: 1,
        solutionStepRo: 'Deoarece `a` și `b` sunt `int`, `19 / 4` dă câtul întreg `4`, iar `19 % 4` dă restul `3` (4×4 + 3 = 19).',
        solutionStepEn: 'Because both are `int`, `19 / 4` yields integer quotient `4`, and `19 % 4` yields remainder `3`.',
      },
      {
        id: 'cpp7a-q2',
        partLabelRo: 'Subiectul I · 2',
        partLabelEn: 'Part I · 2',
        points: 18,
        type: 'mcq',
        promptRo: 'Care secvență de cod interschimbă CORECT valorile variabilelor `x` și `y`?',
        promptEn: 'Which code snippet CORRECTLY swaps the values of `x` and `y`?',
        optionsRo: [
          'x = y; y = x;',
          'aux = x; x = y; y = aux;',
          'x = aux; aux = y; y = x;',
          'aux = x; y = x; x = y;',
        ],
        optionsEn: [
          'x = y; y = x;',
          'aux = x; x = y; y = aux;',
          'x = aux; aux = y; y = x;',
          'aux = x; y = x; x = y;',
        ],
        correctAnswer: 1,
        solutionStepRo: 'Salvăm întâi pe `x` în paharul gol `aux`, mutăm `y` în `x`, apoi punem valoarea salvată din `aux` în `y`.',
        solutionStepEn: 'Save `x` in `aux` first, copy `y` into `x`, then restore `aux` into `y`.',
      },
      {
        id: 'cpp7a-q3',
        partLabelRo: 'Subiectul II · 1',
        partLabelEn: 'Part II · 1',
        points: 18,
        type: 'code-output',
        promptRo: 'Scrie exact ce va afișa programul C++ de mai jos:',
        promptEn: 'Enter the exact output printed by the C++ snippet below:',
        codeSnippet: `int n = 385;
int s = (n / 100) + (n / 10 % 10) + (n % 10);
cout << s;`,
        correctAnswer: '16',
        acceptedAliases: ['s=16', 's = 16'],
        placeholderRo: 'Rezultatul afișat...',
        placeholderEn: 'Printed output...',
        solutionStepRo: '385 / 100 = 3 (sute), 385 / 10 % 10 = 38 % 10 = 8 (zeci), 385 % 10 = 5 (unități). Suma = 3 + 8 + 5 = 16.',
        solutionStepEn: '385 / 100 = 3, 385 / 10 % 10 = 8, 385 % 10 = 5. Total sum = 3 + 8 + 5 = 16.',
      },
      {
        id: 'cpp7a-q4',
        partLabelRo: 'Subiectul II · 2',
        partLabelEn: 'Part II · 2',
        points: 18,
        type: 'true-false',
        promptRo: 'Adevărat sau Fals: Dacă scrii `int x = 5;` și apoi `x = x + 3;`, instrucțiunea este invalidă matematic în C++.',
        promptEn: 'True or False: Writing `int x = 5;` followed by `x = x + 3;` is an invalid statement in C++.',
        optionsRo: ['Adevărat', 'Fals'],
        optionsEn: ['True', 'False'],
        correctAnswer: 1,
        solutionStepRo: 'Fals! Semnul `=` este operator de ATRIBUIRE: calculează mai întâi partea dreaptă (5 + 3 = 8) și stochează rezultatul în `x`.',
        solutionStepEn: 'False! `=` is assignment: C++ evaluates the right side first (5 + 3 = 8) and stores 8 back into `x`.',
      },
      {
        id: 'cpp7a-q5',
        partLabelRo: 'Subiectul III',
        partLabelEn: 'Part III',
        points: 18,
        type: 'short-answer',
        promptRo: 'Ce afișează `cout << a << " " << b;` după secvența: `int a = 4, b = 9; a = a + b; b = a - b; a = a - b;`? (scrie cele două numere separate prin spațiu)',
        promptEn: 'What does `cout << a << " " << b;` output after: `int a = 4, b = 9; a = a + b; b = a - b; a = a - b;`? (two integers separated by space)',
        correctAnswer: '9 4',
        acceptedAliases: ['9, 4', '9,4'],
        placeholderRo: 'Ex: 9 4',
        placeholderEn: 'Ex: 9 4',
        solutionStepRo: 'Interschimbare fără `aux`: a devine 13, b devine 13 - 9 = 4, a devine 13 - 4 = 9. Deci se afișează `9 4`.',
        solutionStepEn: 'Arithmetic swap without `aux`: a=13, b=13-9=4, a=13-4=9. Output is `9 4`.',
      },
    ],
    rubricRows: [
      { itemRo: 'Subiectul I (2 × 18p)', itemEn: 'Part I (2 × 18 pts)', competencyRo: 'Împărțire întreagă `/`, rest `%` și swap cu `aux`', competencyEn: 'Integer division `/`, modulo `%`, and `aux` swap', points: 36 },
      { itemRo: 'Subiectul II (2 × 18p)', itemEn: 'Part II (2 × 18 pts)', competencyRo: 'Extragere cifre & semantică operator atribuire `=`', competencyEn: 'Digit extraction & assignment semantics', points: 36 },
      { itemRo: 'Subiectul III (18p)', itemEn: 'Part III (18 pts)', competencyRo: 'Trasare secvență aritmetică de interschimbare', competencyEn: 'Tracing arithmetic swap sequence', points: 18 },
      { itemRo: 'Din oficiu', itemEn: 'Ex officio', competencyRo: 'Punctaj de bază', competencyEn: 'Baseline points', points: 10 },
    ],
    faqs: [
      {
        qRo: 'Cum aflu cifra zecilor unui număr natural `n` în C++?',
        qEn: 'How do I extract the tens digit of an integer `n` in C++?',
        aRo: 'Tai ultima cifră prin `(n / 10)` și apoi iei ultima cifră a rezultatului cu `% 10`: `(n / 10) % 10`.',
        aEn: 'Drop the ones digit using `(n / 10)` then take `% 10`: `(n / 10) % 10`.',
      },
    ],
  },
  {
    id: 'ws-g7-test-cpp-if-else',
    grade: 7,
    kind: 'exam',
    estimatedMinutes: 35,
    maxPoints: 100,
    exOfficioPoints: 10,
    publishedAt: '2026-04-11',
    curriculumRef: 'OMEN 3393/2017 · Clasa a VII-a · Structura Alternativă if / else',
    relatedModuleId: 'g7_decision_a',
    relatedBlogSlugRo: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    relatedBlogSlugEn: 'middle-school-cpp-common-errors-if-while-digits',
    relatedGlossarySlugRo: 'atribuire-vs-egalitate',
    relatedGlossarySlugEn: 'assignment-vs-equality',
    optionalCppTraceCode: `#include <iostream>
using namespace std;

int main() {
    int a, b, c, maxim;
    cin >> a >> b >> c;
    maxim = a;
    if (b > maxim) {
        maxim = b;
    }
    if (c > maxim) {
        maxim = c;
    }
    cout << "Maxim = " << maxim << endl;
    if (maxim % 2 == 0) {
        cout << "PAR" << endl;
    } else {
        cout << "IMPAR" << endl;
    }
    return 0;
}`,
    optionalCppTraceStdin: '14 29 8',
    ro: {
      slug: 'test-cu-barem-clasa-7-cpp-structura-alternativa-if-else-operatori-logici',
      title: 'Test cu Barem C++ Clasa a VII-a: Structura Alternativă `if/else` & Operatori Logici (100p)',
      breadcrumbLabel: 'Test C++ Cls. VII: if/else & Logici',
      metaTitle: 'Test C++ Clasa 7 cu Barem: if/else, ==, &&, || și Maxim 3 Numere | ArkyEdu',
      metaDescription: 'Subiect de test C++ clasa a VII-a cu barem 100p și vizualizator Trace: structura alternativă if/else, operatori logici (&&, ||, !), capcana `if (x = 5);` și condiții de triunghi/paritate.',
      keywords: [
        'test c++ clasa 7 if else cu barem',
        'operatori logici && || c++ exercitii',
        'capcana punct si virgula dupa if c++',
        'maximul a trei numere c++ fisa',
      ],
      directAnswerSummary:
        'Test complet de 100p (90p + 10p oficiu) pe structura alternativă C++: diferența fatală între `x == 5` și `x = 5`, punct și virgulă pus greșit după `if (...)`, intervale cu `&&`, maximul a 3 numere și verificarea divizibilității.',
      objectives: [
        'Scrierea condițiilor compuse corecte pentru intervale matematice (`10 <= x && x <= 99`).',
        'Depistarea celor mai frecvente 3 erori la `if/else` (`=`, `;` după condiție, lipsă acolade `{}`).',
        'Determinarea valorii maxime și a parității cu instrucțiuni decizionale.',
      ],
      theorySnapshot:
        'În C++, intervalul matematic `10 ≤ x ≤ 99` NU se scrie `10 <= x <= 99` (care e mereu adevărat!), ci `(10 <= x && x <= 99)`! De asemenea, pune mereu `==` pentru comparație și nu pune `;` după `if (...)`.',
      teacherTips:
        'Folosește acest test după lecțiile de decizii ramificate; poți rula imediat algoritmul de maxim în Trace C++.',
    },
    en: {
      slug: 'grade-7-cpp-if-else-decisions-logical-operators-test',
      title: 'Grade 7 C++ Exam with Rubric: `if/else` Branching & Logical Operators (`&&`, `||`, `!`) (100 pts)',
      breadcrumbLabel: 'G7 C++ Exam: if/else & Logic',
      metaTitle: 'Grade 7 C++ if/else & Logical Operators Test with Rubric | ArkyEdu',
      metaDescription: '100-point Grade 7 C++ test with worked solutions: `if/else`, `==` vs `=`, chained inequality trap `10 <= x <= 99`, `&&`/`||`, and max-of-3 trace.',
      keywords: [
        'grade 7 c++ if else test rubric',
        'c++ logical operators && || quiz answers',
        'chained comparison bug 10 <= x <= 99 c++',
      ],
      directAnswerSummary:
        'Covers the top Grade 7 C++ decision concepts (100 pts): `==` vs `=`, dangling semicolon after `if (...)`, writing proper range checks `(10 <= x && x <= 99)`, and tracing max-of-3.',
      objectives: [
        'Write valid compound C++ range conditions with `&&` and `||`.',
        'Spot classic `if` syntax traps (`=`, trailing `;`, missing braces).',
        'Trace branching logic accurately to predict program output.',
      ],
      theorySnapshot:
        'Never write `10 <= x <= 99` in C++ (since `(10 <= x)` yields `0` or `1`, both `<= 99`!). Always write `(10 <= x && x <= 99)`.',
      teacherTips:
        'Students can click "Open in C++ Trace" to inspect every `if` condition evaluation live.',
    },
    questions: [
      {
        id: 'if7-q1',
        partLabelRo: 'Subiectul I · 1',
        partLabelEn: 'Part I · 1',
        points: 18,
        type: 'mcq',
        promptRo: 'Cum se scrie CORECT în C++ condiția ca numărul `x` să aibă exact 2 cifre pozitive (între 10 și 99 inclusiv)?',
        promptEn: 'How do you CORRECTLY check in C++ that `x` is a positive 2-digit integer (between 10 and 99 inclusive)?',
        optionsRo: [
          'if (10 <= x <= 99)',
          'if (x >= 10 && x <= 99)',
          'if (x >= 10 || x <= 99)',
          'if (x = 10 && 99)',
        ],
        optionsEn: [
          'if (10 <= x <= 99)',
          'if (x >= 10 && x <= 99)',
          'if (x >= 10 || x <= 99)',
          'if (x = 10 && 99)',
        ],
        correctAnswer: 1,
        solutionStepRo: 'Operatorul `&&` (ȘI logic) verifică simultan ambele capete ale intervalului. `||` ar fi adevărat pentru orice număr, iar `10 <= x <= 99` compară 0/1 cu 99!',
        solutionStepEn: 'Use `&&` (logical AND) to require both bounds. `||` would always be true, and `10 <= x <= 99` evaluates `(10 <= x)` to `0` or `1` first!',
      },
      {
        id: 'if7-q2',
        partLabelRo: 'Subiectul I · 2',
        partLabelEn: 'Part I · 2',
        points: 18,
        type: 'mcq',
        promptRo: 'Ce afișează codul: `int a = 3; if (a = 0) cout << "DA"; else cout << "NU";` (atenție la un singur `=`!) ?',
        promptEn: 'What does `int a = 3; if (a = 0) cout << "YES"; else cout << "NO";` print (notice single `=`)?',
        optionsRo: ['DA / YES', 'NU / NO', '0', 'Nimic'],
        optionsEn: ['DA / YES', 'NU / NO', '0', 'Nothing'],
        correctAnswer: 1,
        solutionStepRo: '`a = 0` îi atribuie lui `a` valoarea `0` (care în C++ înseamnă Fals!). De aceea se intră pe ramura `else` și se afișează NU / NO.',
        solutionStepEn: '`a = 0` assigns `0` to `a`, and `0` evaluates to False in C++, so the `else` branch runs and prints NO.',
      },
      {
        id: 'if7-q3',
        partLabelRo: 'Subiectul II · 1',
        partLabelEn: 'Part II · 1',
        points: 18,
        type: 'code-output',
        promptRo: 'Ce va afișa secvența C++ de mai jos pentru `x = 12` și `y = 5`?',
        promptEn: 'What does the C++ code below print when `x = 12` and `y = 5`?',
        codeSnippet: `int x = 12, y = 5;
if (x % 3 == 0 && y % 2 == 1) {
    cout << x + y;
} else {
    cout << x - y;
}`,
        correctAnswer: '17',
        acceptedAliases: ['17 '],
        placeholderRo: 'Valoarea afișată...',
        placeholderEn: 'Printed output...',
        solutionStepRo: '`12 % 3 == 0` este Adevărat, iar `5 % 2 == 1` (impar) este Adevărat. Ambele sunt adevărate ⇒ afișează `12 + 5 = 17`.',
        solutionStepEn: '`12 % 3 == 0` is True AND `5 % 2 == 1` is True, so it enters `if` and prints `12 + 5 = 17`.',
      },
      {
        id: 'if7-q4',
        partLabelRo: 'Subiectul II · 2',
        partLabelEn: 'Part II · 2',
        points: 18,
        type: 'true-false',
        promptRo: 'Adevărat sau Fals: Trei numere strict pozitive `a, b, c` pot fi laturile unui triunghi dacă și numai dacă `a + b > c && a + c > b && b + c > a`.',
        promptEn: 'True or False: Three positive sides `a, b, c` form a valid triangle if and only if `a + b > c && a + c > b && b + c > a`.',
        optionsRo: ['Adevărat', 'Fals'],
        optionsEn: ['True', 'False'],
        correctAnswer: 0,
        solutionStepRo: 'Adevărat! Aceasta este inegalitatea triunghiului: suma oricăror două laturi trebuie să fie strict mai mare decât a treia.',
        solutionStepEn: 'True! By the Triangle Inequality Theorem, every pair sum must strictly exceed the third side.',
      },
      {
        id: 'if7-q5',
        partLabelRo: 'Subiectul III',
        partLabelEn: 'Part III',
        points: 18,
        type: 'code-output',
        promptRo: 'Atenție la capcana clasică din C++! Ce afișează secvența de mai jos (observă `;` după `if`)?',
        promptEn: 'Watch out for the classic C++ trap! What does the code below print (notice `;` right after `if`)?',
        codeSnippet: `int n = 4;
if (n > 10);
    cout << "Salut";`,
        correctAnswer: 'Salut',
        acceptedAliases: ['salut', '"Salut"'],
        placeholderRo: 'Ce afișează...',
        placeholderEn: 'Printed text...',
        solutionStepRo: 'Punct și virgulă `;` imediat după `if (n > 10)` închide instrucțiunea `if` cu un corp gol, deci `cout << "Salut";` se execută NECONDIȚIONAT!',
        solutionStepEn: 'The trailing `;` terminates `if (n > 10)` with an empty statement, so `cout << "Salut";` executes unconditionally!',
      },
    ],
    rubricRows: [
      { itemRo: 'Subiectul I (2 × 18p)', itemEn: 'Part I (2 × 18 pts)', competencyRo: 'Condiții interval `&&` și capcana `=` în `if`', competencyEn: 'Range conditions `&&` & assignment trap `=` inside `if`', points: 36 },
      { itemRo: 'Subiectul II (2 × 18p)', itemEn: 'Part II (2 × 18 pts)', competencyRo: 'Evaluare expresii logice & condiția triunghiului', competencyEn: 'Logical expression trace & triangle inequality', points: 36 },
      { itemRo: 'Subiectul III (18p)', itemEn: 'Part III (18 pts)', competencyRo: 'Depanare punct-și-virgulă `;` pus greșit după `if`', competencyEn: 'Debugging dangling semicolon `;` after `if`', points: 18 },
      { itemRo: 'Din oficiu', itemEn: 'Ex officio', competencyRo: 'Punctaj de bază', competencyEn: 'Baseline points', points: 10 },
    ],
    faqs: [
      {
        qRo: 'Cum verific dacă un an `an` este bisect în C++?',
        qEn: 'How do you check for a leap year `y` in C++?',
        aRo: '`if ((an % 4 == 0 && an % 100 != 0) || (an % 400 == 0))` — divizibil cu 4 și nu cu 100, sau divizibil cu 400.',
        aEn: '`if ((y % 4 == 0 && y % 100 != 0) || (y % 400 == 0))`.',
      },
    ],
  },
  {
    id: 'ws-g7-oji-while-cifre',
    grade: 7,
    kind: 'olympiad',
    estimatedMinutes: 40,
    maxPoints: 100,
    exOfficioPoints: 10,
    publishedAt: '2026-04-12',
    curriculumRef: 'OMEN 3393/2017 & Pregătire OJI · Clasa a VII-a · Bucle `while` & Cifre',
    relatedModuleId: 'g7_loop_b',
    relatedBlogSlugRo: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    relatedBlogSlugEn: 'middle-school-cpp-common-errors-if-while-digits',
    relatedGlossarySlugRo: 'bucla-while-do-while',
    relatedGlossarySlugEn: 'while-vs-dowhile',
    optionalCppTraceCode: `#include <iostream>
using namespace std;

int main() {
    int n, copie, og = 0;
    cin >> n;
    copie = n;
    while (n > 0) {
        int c = n % 10;
        og = og * 10 + c;
        n = n / 10;
    }
    cout << "Oglindit: " << og << endl;
    if (copie == og) {
        cout << "PALINDROM" << endl;
    } else {
        cout << "NU" << endl;
    }
    return 0;
}`,
    optionalCppTraceStdin: '1221',
    ro: {
      slug: 'fisa-oji-clasa-7-cpp-bucle-while-oglindit-palindrom-numar-prim',
      title: 'Fișă OJI & Evaluare C++ Clasa a VII-a: Bucle `while`, Oglindit, Palindrom & Număr Prim',
      breadcrumbLabel: 'OJI Cls. VII: while, Oglindit & Prim',
      metaTitle: 'Fișă OJI C++ Clasa 7 cu Barem: while, Oglindit, Palindrom & Prim | ArkyEdu',
      metaDescription: 'Subiect pregătire Olimpiada de Informatică (OJI) & Evaluare clasa a VII-a cu barem 100p și Trace RAM: algoritmul oglinditului, palindrom cu copie, suma cifrelor, cmmdc Euclid și test primalitate.',
      keywords: [
        'probleme c++ olimpiada clasa 7 while cifre',
        'algoritm oglindit palindrom c++ fisa barem',
        'numar prim cmmdc euclid c++ clasa 7',
        'pregatire oji gimnaziu fisa de lucru',
      ],
      directAnswerSummary:
        'Fișă de performanță (100p) pentru clasa a VII-a și pregătire OJI: construirea oglinditului (`og = og * 10 + n % 10`), salvarea lui `copie = n` înainte de `while` pentru testul de palindrom, algoritmul lui Euclid prin împărțiri repetate și verificarea numerelor prime până la √n.',
      objectives: [
        'Stăpânirea șablonului standard de prelucrare a cifrelor unui număr cu `while (n > 0)`.',
        'Prevenirea bug-ului distrugerii lui `n` la testul de palindrom prin păstrarea unei copii inițiale.',
        'Înțelegerea diferenței dintre `while` (cu test inițial) și `do...while` pentru cazul particular `n = 0`.',
      ],
      theorySnapshot:
        'Șablon Palindrom în C++: 1) Salvezi `copie = n`; 2) În `while (n > 0)` construiești `og = og * 10 + n % 10; n /= 10;`; 3) Compari `copie == og` (NICIOADATĂ `n == og`, pentru că `n` a devenit `0`!).',
      teacherTips:
        'Elevii pot vedea imediat cum `n` scade până la `0` în timp ce `og` crește la `1221` apăsând „Deschide în Trace C++”.',
    },
    en: {
      slug: 'grade-7-olympiad-cpp-while-loops-palindrome-prime-worksheet',
      title: 'Grade 7 ICT Olympiad & Exam Sheet: `while` Loops, Reversed Digits, Palindromes & Primes',
      breadcrumbLabel: 'G7 OJI Sheet: while & Primes',
      metaTitle: 'Grade 7 C++ Olympiad Sheet with Rubric: Palindrome & Primes | ArkyEdu',
      metaDescription: 'Olympiad-grade Grade 7 C++ worksheet with 100-point rubric & RAM trace: digit loop, reversed integer, palindrome copy bug, Euclid GCD, and prime check.',
      keywords: [
        'grade 7 c++ olympiad while loop problems',
        'palindrome number algorithm c++ worksheet',
        'euclid gcd and prime test middle school c++',
      ],
      directAnswerSummary:
        'Competition-ready Grade 7 worksheet (100 pts) covering `while (n > 0)` digit decomposition, reversed number (`rev = rev * 10 + n % 10`), saving `copy = n` for palindrome checks, and prime divisor counting.',
      objectives: [
        'Trace digit extraction loops (`% 10` and `/ 10`) confidently.',
        'Avoid the zero-destruction bug by saving `copy = n` before `while`.',
        'Handle edge cases like `n = 0` and `n = 1` in prime and digit count checks.',
      ],
      theorySnapshot:
        'Palindrome rule: save `copy = n` BEFORE the `while (n > 0)` loop! After the loop ends, `n` is `0`, so compare `copy == rev` (never `n == rev`).',
      teacherTips:
        'Use "Open in C++ Trace" so students watch `n` shrink to `0` while `og` builds `1221` step by step.',
    },
    questions: [
      {
        id: 'oji7-q1',
        partLabelRo: 'Subiectul I · 1',
        partLabelEn: 'Part I · 1',
        points: 18,
        type: 'mcq',
        promptRo: 'De ce testul `if (n == og)` pus DUPĂ `while (n > 0) { og = og * 10 + n % 10; n /= 10; }` eșuează pentru aproape toate numerele?',
        promptEn: 'Why does `if (n == og)` placed AFTER `while (n > 0) { og = og * 10 + n % 10; n /= 10; }` fail for almost every input?',
        optionsRo: [
          'Pentru că la ieșirea din `while`, variabila `n` a devenit `0`, deci se compară `0 == og` în loc de numărul inițial',
          'Pentru că `n % 10` returnează mereu 1',
          'Pentru că `while` nu acceptă operatorul `/=`',
          'Pentru că `og` nu poate depăși valoarea 100',
        ],
        optionsEn: [
          'Because when `while` ends, `n` has become `0`, so it compares `0 == og` instead of the original value',
          'Because `n % 10` always returns 1',
          'Because `while` rejects `/=`',
          'Because `og` cannot exceed 100',
        ],
        correctAnswer: 0,
        solutionStepRo: 'La finalul buclei `while (n > 0)`, `n` este exact `0`. Trebuie salvat dinainte `int copie = n;` și verificat `copie == og`.',
        solutionStepEn: 'After `while (n > 0)` terminates, `n == 0`. Always save `int copy = n;` before the loop and compare `copy == og`.',
      },
      {
        id: 'oji7-q2',
        partLabelRo: 'Subiectul I · 2',
        partLabelEn: 'Part I · 2',
        points: 18,
        type: 'code-output',
        promptRo: 'Ce va afișa algoritmul următor pentru `n = 4072`?',
        promptEn: 'What does the following algorithm output when `n = 4072`?',
        codeSnippet: `int n = 4072, cnt = 0;
while (n > 0) {
    if ((n % 10) % 2 == 0)
        cnt++;
    n /= 10;
}
cout << cnt;`,
        correctAnswer: '3',
        acceptedAliases: ['3 '],
        placeholderRo: 'Valoarea lui cnt...',
        placeholderEn: 'Final cnt...',
        solutionStepRo: 'Cifrele lui 4072 sunt 2 (pară), 7 (impară), 0 (pară: 0 % 2 == 0!) și 4 (pară). Total = 3 cifre pare!',
        solutionStepEn: 'Digits of 4072: 2 (even), 7 (odd), 0 (even: 0 % 2 == 0!), and 4 (even). Total = 3 even digits!',
      },
      {
        id: 'oji7-q3',
        partLabelRo: 'Subiectul II · 1',
        partLabelEn: 'Part II · 1',
        points: 18,
        type: 'short-answer',
        promptRo: 'Care este cel mai mare divizor comun `cmmdc(48, 18)` calculat prin algoritmul lui Euclid?',
        promptEn: 'What is the greatest common divisor `gcd(48, 18)` computed by Euclid’s algorithm?',
        correctAnswer: '6',
        acceptedAliases: ['6 '],
        placeholderRo: 'Valoarea cmmdc...',
        placeholderEn: 'GCD value...',
        solutionStepRo: '48 % 18 = 12 → 18 % 12 = 6 → 12 % 6 = 0 ⇒ cmmdc = 6.',
        solutionStepEn: '48 % 18 = 12 → 18 % 12 = 6 → 12 % 6 = 0 ⇒ GCD = 6.',
      },
      {
        id: 'oji7-q4',
        partLabelRo: 'Subiectul II · 2',
        partLabelEn: 'Part II · 2',
        points: 18,
        type: 'true-false',
        promptRo: 'Adevărat sau Fals: Numărul 1 este considerat număr prim în matematică și informatică.',
        promptEn: 'True or False: The integer 1 is considered a prime number in math and computer science.',
        optionsRo: ['Adevărat', 'Fals'],
        optionsEn: ['True', 'False'],
        correctAnswer: 1,
        solutionStepRo: 'Fals! Un număr prim are EXACT 2 divizori naturali distincți (1 și el însuși). 1 are un singur divizor, deci NU este prim; cel mai mic număr prim este 2.',
        solutionStepEn: 'False! A prime number has EXACTLY 2 distinct positive divisors (1 and itself). 1 has only one divisor; the smallest prime is 2.',
      },
      {
        id: 'oji7-q5',
        partLabelRo: 'Subiectul III',
        partLabelEn: 'Part III',
        points: 18,
        type: 'mcq',
        promptRo: 'Câte cifre numără un program care folosește `while (n > 0) { cnt++; n /= 10; }` dacă utilizatorul introduce `n = 0`?',
        promptEn: 'How many digits does `while (n > 0) { cnt++; n /= 10; }` count if the input is `n = 0`?',
        optionsRo: ['1 cifră', '0 cifre (pentru că 0 > 0 este Fals de la început; ar trebui do...while)', 'Eroare de compilare', 'Buclă infinită'],
        optionsEn: ['1 digit', '0 digits (because 0 > 0 is False immediately; do...while should be used)', 'Compile error', 'Infinite loop'],
        correctAnswer: 1,
        solutionStepRo: 'Pentru `n = 0`, condiția `while (n > 0)` e falsă din start și `cnt` rămâne `0`. Folosind `do { cnt++; n /= 10; } while (n > 0);`, `0` are corect 1 cifră.',
        solutionStepEn: 'For `n = 0`, `while (n > 0)` fails before the first step so `cnt` stays `0`. Switching to `do...while` fixes the `n = 0` case to 1 digit.',
      },
    ],
    rubricRows: [
      { itemRo: 'Subiectul I (2 × 18p)', itemEn: 'Part I (2 × 18 pts)', competencyRo: 'Bug copie palindrom & numărare cifre pare (inclusiv 0)', competencyEn: 'Palindrome copy bug & counting even digits (incl. 0)', points: 36 },
      { itemRo: 'Subiectul II (2 × 18p)', itemEn: 'Part II (2 × 18 pts)', competencyRo: 'Algoritmul lui Euclid (cmmdc) & definiția primalității', competencyEn: 'Euclid GCD & primality edge case n=1', points: 36 },
      { itemRo: 'Subiectul III (18p)', itemEn: 'Part III (18 pts)', competencyRo: 'Cazul limită n = 0: while vs do...while', competencyEn: 'Edge case n = 0: while vs do...while', points: 18 },
      { itemRo: 'Din oficiu', itemEn: 'Ex officio', competencyRo: 'Punctaj de bază', competencyEn: 'Baseline points', points: 10 },
    ],
    faqs: [
      {
        qRo: 'De ce la testul de primalitate este suficient să verificăm divizorii doar până la radical din n (`d * d <= n`)?',
        qEn: 'Why is checking divisors up to `sqrt(n)` (`d * d <= n`) sufficient for primality?',
        aRo: 'Orice număr compus n = a × b are cel puțin un factor ≤ √n. Astfel verificarea pentru n = 100.000.000 durează ~10.000 pași în loc de 100 milioane!',
        aEn: 'Every composite number `n = a * b` has at least one factor `<= sqrt(n)`, shrinking 100M checks down to ~10,000.',
      },
    ],
  },
  {
    id: 'ws-g7-word-audio-gis',
    grade: 7,
    kind: 'project',
    estimatedMinutes: 25,
    maxPoints: 100,
    exOfficioPoints: 10,
    publishedAt: '2026-04-13',
    curriculumRef: 'OMEN 3393/2017 · Clasa a VII-a · Tehnoredactare, Audio-Video & GIS',
    relatedModuleId: 'g7_word_a',
    relatedGlossarySlugRo: 'audio-video-multitrack',
    relatedGlossarySlugEn: 'audio-video-multitrack-keyframe',
    ro: {
      slug: 'fisa-practica-clasa-7-tehnoredactare-word-audio-wavepad-gis',
      title: 'Fișă Practică Clasa a VII-a: Tehnoredactare Avansată Word, Acustică WavePad & Hărți GIS',
      breadcrumbLabel: 'Fișă Practică Cls. VII: Word, Audio & GIS',
      metaTitle: 'Fișă Practică Clasa 7 cu Barem: Word, Audio WavePad & GIS | ArkyEdu',
      metaDescription: 'Fișă recapitulativă practică clasa a VII-a cu barem 100p: stiluri Heading și cuprins automat în Word, eșantionare audio 44.1 kHz, piste VideoPad și straturi GIS.',
      keywords: [
        'fisa lucru tehnoredactare word clasa 7',
        'audio wavepad videopad clasa 7 fisa',
        'harti gis straturi vector raster tic',
        'cuprins automat antet subsol word clasa 7',
      ],
      directAnswerSummary:
        'Fișă practică interdisciplinară pentru primul semestru de Clasa a VII-a (100p): generarea automată a Cuprinsului cu stiluri Heading 1/2, formatarea Antet/Subsol, frecvența de eșantionare audio 44.1 kHz, piste VideoPad (Green Screen) și straturi vectoriale/raster în GIS.',
      objectives: [
        'Automatizarea cuprinsului și a numerotării paginilor în documente Word / Google Docs lungi.',
        'Înțelegerea parametrilor audio-video digitali (44.1 kHz, 16 biți, MP3 vs WAV, cheie cromatică).',
        'Diferențierea datelor spațiale vectoriale (puncte, linii, poligoane) față de cele raster (ortofotoplan) în GIS.',
      ],
      theorySnapshot:
        'Un Cuprins Automat funcționează doar dacă aplici stiluri ierarhice (Heading 1, Heading 2), nu doar mărind manual fontul! În GIS, straturile (Layers) suprapun hărți satelitare (raster) cu rute și clădiri (vector).',
      teacherTips:
        'Excelentă ca recapitulare înainte de introducerea modulului de C++.',
    },
    en: {
      slug: 'grade-7-practical-sheet-word-typography-wavepad-audio-gis-maps',
      title: 'Grade 7 Practical Sheet: Advanced Word Layout, Digital Audio & GIS Mapping',
      breadcrumbLabel: 'G7 Practical: Word, Audio & GIS',
      metaTitle: 'Grade 7 Word, Digital Audio & GIS Practical Worksheet | ArkyEdu',
      metaDescription: 'Grade 7 practical ICT sheet with 100-point rubric: automatic Word Table of Contents via Heading styles, 44.1 kHz audio sampling, video Chroma Key, and GIS vector vs raster layers.',
      keywords: [
        'grade 7 word heading styles toc worksheet',
        'digital audio sampling 44.1 khz middle school quiz',
        'gis vector vs raster layers worksheet',
      ],
      directAnswerSummary:
        'Covers practical multimedia & office skills (100 pts): automatic Table of Contents using Heading 1/2, headers/footers, 44.1 kHz audio sampling & WAV vs MP3, Green Screen chroma key, and GIS vector/raster map layers.',
      objectives: [
        'Build an automated Table of Contents using Heading styles and page numbers.',
        'Contrast uncompressed WAV vs compressed MP3 and 44.1 kHz sampling.',
        'Separate GIS vector features (points, roads) from raster satellite imagery.',
      ],
      theorySnapshot:
        'Automatic Table of Contents generators rely on Heading 1/2/3 semantic styles, not manual bold text! In GIS, layers combine raster satellite imagery with vector points/routes.',
      teacherTips:
        'Great practical checkpoint wrapping up Office/Multimedia before transitioning to C++.',
    },
    questions: [
      {
        id: 'g7m-q1',
        partLabelRo: 'Subiectul I · 1',
        partLabelEn: 'Part I · 1',
        points: 18,
        type: 'mcq',
        promptRo: 'Ce trebuie aplicat titlurilor de capitole în Word / Google Docs pentru a putea genera automat un Cuprins (Table of Contents)?',
        promptEn: 'What must you apply to chapter titles in Word / Google Docs so an automatic Table of Contents can be generated?',
        optionsRo: ['Doar culoare roșie și subliniere', 'Stiluri de titlu (Heading 1, Heading 2)', 'Aliniere la dreapta', 'Majuscule manuale'],
        optionsEn: ['Red color and underline only', 'Semantic Heading styles (Heading 1, Heading 2)', 'Right alignment', 'Manual ALL CAPS'],
        correctAnswer: 1,
        solutionStepRo: 'Generatorul de cuprins caută exclusiv paragrafele marcate cu stiluri ierarhice Heading 1, Heading 2, Heading 3.',
        solutionStepEn: 'Table of Contents generators index paragraphs tagged with Heading 1, Heading 2, and Heading 3 styles.',
      },
      {
        id: 'g7m-q2',
        partLabelRo: 'Subiectul I · 2',
        partLabelEn: 'Part I · 2',
        points: 18,
        type: 'mcq',
        promptRo: 'Care format audio este NECOMPRIMAT (calitate de studio fără pierderi, dar fișier foarte mare), spre deosebire de MP3?',
        promptEn: 'Which audio format is UNCOMPRESSED lossless studio quality (much larger file size than MP3)?',
        optionsRo: ['.mp3', '.wav', '.aac', '.ogg'],
        optionsEn: ['.mp3', '.wav', '.aac', '.ogg'],
        correctAnswer: 1,
        solutionStepRo: 'WAV păstrează forma de undă audio necomprimată; MP3 aplică compresie cu pierderi pentru a ocupa de ~10 ori mai puțin spațiu.',
        solutionStepEn: 'WAV stores raw uncompressed audio samples, while MP3 applies lossy compression to shrink file size ~10×.',
      },
      {
        id: 'g7m-q3',
        partLabelRo: 'Subiectul II · 1',
        partLabelEn: 'Part II · 1',
        points: 18,
        type: 'short-answer',
        promptRo: 'Ce culoare de fundal este folosită cel mai des la filmare pentru efectul „Chroma Key” (înlocuirea fundalului cu un decor virtual în VideoPad)?',
        promptEn: 'What screen color is most widely used during filming for the "Chroma Key" background-removal effect?',
        correctAnswer: 'Verde',
        acceptedAliases: ['verde', 'green', 'green screen', 'albastru', 'blue'],
        placeholderRo: 'Culoarea...',
        placeholderEn: 'Screen color...',
        solutionStepRo: 'Verde (Green Screen) — deoarece culoarea verde aprins contrastează puternic cu tonurile pielii umane.',
        solutionStepEn: 'Green (Green Screen) — because bright green contrasts sharply with human skin tones.',
      },
      {
        id: 'g7m-q4',
        partLabelRo: 'Subiectul II · 2',
        partLabelEn: 'Part II · 2',
        points: 18,
        type: 'true-false',
        promptRo: 'Adevărat sau Fals: Într-un sistem GIS (ex: Google My Maps), un traseu de autobuz și punctele de stație sunt reprezentate ca date VECTORIALE, iar imaginea din satelit ca strat RASTER.',
        promptEn: 'True or False: In a GIS system (e.g., Google My Maps), bus routes and stops are stored as VECTOR features, while satellite imagery is a RASTER layer.',
        optionsRo: ['Adevărat', 'Fals'],
        optionsEn: ['True', 'False'],
        correctAnswer: 0,
        solutionStepRo: 'Adevărat. GIS combină straturi vectoriale (puncte, linii, poligoane) peste straturi raster (fotografii aeriene/satelitare).',
        solutionStepEn: 'True. GIS overlays vector geometry (points, lines, polygons) atop raster satellite pixel grids.',
      },
      {
        id: 'g7m-q5',
        partLabelRo: 'Subiectul III',
        partLabelEn: 'Part III',
        points: 18,
        type: 'mcq',
        promptRo: 'Unde introduci numărul automat al paginii ca să apară consecvent în josul fiecărei pagini dintr-un proiect de 20 de pagini?',
        promptEn: 'Where do you insert automatic page numbers so they appear consistently at the bottom of every page in a 20-page report?',
        optionsRo: ['Îl scrii manual la finalul fiecărei pagini', 'În zona de Subsol (Footer) → Insert Page Number', 'În caseta de căutare', 'În numele fișierului'],
        optionsEn: ['Type each number manually', 'Inside the Footer area → Insert Page Number', 'In the Find box', 'In the filename'],
        correctAnswer: 1,
        solutionStepRo: 'Inserarea în Footer (Subsol) actualizează automat numerotarea chiar dacă adaugi sau ștergi pagini ulterioare.',
        solutionStepEn: 'Placing a dynamic Page Number inside the Footer updates automatically when pages are added or removed.',
      },
    ],
    rubricRows: [
      { itemRo: 'Subiectul I (2 × 18p)', itemEn: 'Part I (2 × 18 pts)', competencyRo: 'Stiluri Heading & format WAV vs MP3', competencyEn: 'Heading styles & WAV vs MP3 audio formats', points: 36 },
      { itemRo: 'Subiectul II (2 × 18p)', itemEn: 'Part II (2 × 18 pts)', competencyRo: 'Chroma Key video & straturi vector/raster GIS', competencyEn: 'Video Chroma Key & GIS vector/raster layers', points: 36 },
      { itemRo: 'Subiectul III (18p)', itemEn: 'Part III (18 pts)', competencyRo: 'Numerotare automată pagini în Subsol (Footer)', competencyEn: 'Automatic page numbering via Footer', points: 18 },
      { itemRo: 'Din oficiu', itemEn: 'Ex officio', competencyRo: 'Punctaj de bază', competencyEn: 'Baseline points', points: 10 },
    ],
    faqs: [
      {
        qRo: 'Ce înseamnă 44.1 kHz în editarea audio WavePad?',
        qEn: 'What does 44.1 kHz mean in WavePad audio editing?',
        aRo: 'Reprezintă frecvența de eșantionare: sunetul este măsurat de 44.100 de ori pe secundă pentru a reda fidel toate frecvențele auzibile de urechea umană.',
        aEn: 'It is the CD-standard sample rate: 44,100 amplitude snapshots per second capturing the full human hearing spectrum.',
      },
    ],
  },
  {
    id: 'ws-g8-excel-functii-erori',
    grade: 8,
    kind: 'worksheet',
    estimatedMinutes: 30,
    maxPoints: 100,
    exOfficioPoints: 10,
    publishedAt: '2026-04-14',
    curriculumRef: 'OMEN 3393/2017 · Clasa a VIII-a · Calcul Tabelar Excel',
    relatedModuleId: 'g8_calc_c',
    relatedBlogSlugRo: 'formule-excel-gimnaziu-sum-average-if-countif-erori',
    relatedBlogSlugEn: 'excel-formulas-middle-school-sum-if-countif-errors',
    relatedGlossarySlugRo: 'referinte-excel-absolute',
    relatedGlossarySlugEn: 'excel-cell-range-absolute',
    ro: {
      slug: 'fisa-de-lucru-clasa-8-excel-sum-average-if-countif-referinta-absoluta-erori',
      title: 'Fișă de Lucru Excel Clasa a VIII-a: `SUM`, `AVERAGE`, `IF`, `COUNTIF`, `$A$1` & Erori (`#NAME?`, `#DIV/0!`)',
      breadcrumbLabel: 'Fișă Excel Cls. VIII: Funcții & `$A$1`',
      metaTitle: 'Fișă Excel Clasa 8 cu Barem: SUM, IF, COUNTIF, $A$1 & Erori | ArkyEdu',
      metaDescription: 'Fișă de lucru Excel clasa a VIII-a cu rezolvare și barem 100p: formule SUM, AVERAGE, IF, COUNTIF, blocare celulă cu $A$1 la AutoFill și depanare erori #NAME?, #VALUE!, #DIV/0! și ###.',
      keywords: [
        'fisa de lucru excel clasa 8 cu barem',
        'exercitii formule excel sum average if countif',
        'referinta absoluta $a$1 excel clasa 8',
        'erori excel #name? #value! #div/0! explicatie',
      ],
      directAnswerSummary:
        'Fișă practică Excel de 100p pentru Clasa a VIII-a: începerea oricărei formule cu `=`, diferența dintre `A1:A5` (domeniu) și `A1;A5` (celule izolate), funcțiile `SUM`/`AVERAGE`/`IF`/`COUNTIF`, fixarea TVA-ului cu referință absolută `$B$1` și diagnosticul erorilor `#NAME?`, `#VALUE!`, `#DIV/0!`, `###`.',
      objectives: [
        'Scrierea corectă a formulelor cu `SUM`, `AVERAGE`, `COUNTIF` și funcția logică `IF`.',
        'Utilizarea simbolului `$` (`$B$1`) pentru a bloca o celulă fixă la tragerea cu AutoFill.',
        'Diagnosticarea rapidă a erorilor `#NAME?`, `#VALUE!`, `#DIV/0!` și `####`.',
      ],
      theorySnapshot:
        'Orice formulă începe cu `=`! `$B$1` îngheață atât coloana B cât și rândul 1 când tragi formula în jos cu AutoFill. Erori: `#DIV/0!` = împărțire la 0; `#NAME?` = nume funcție scris greșit (ex: `SUMA` în loc de `SUM`); `#VALUE!` = aduni text cu număr; `####` = coloana este prea îngustă.',
      teacherTips:
        'Testați aceste formule împreună cu simulatorul din Misiunea de Excel Clasa a VIII-a!',
    },
    en: {
      slug: 'grade-8-excel-formulas-sum-average-if-countif-absolute-errors-worksheet',
      title: 'Grade 8 Excel Worksheet: `SUM`, `AVERAGE`, `IF`, `COUNTIF`, `$A$1` & Error Debugging',
      breadcrumbLabel: 'G8 Excel: Functions & `$A$1`',
      metaTitle: 'Grade 8 Excel Formulas & $A$1 Reference Worksheet | ArkyEdu',
      metaDescription: 'Grade 8 spreadsheet worksheet with 100-point rubric: SUM, AVERAGE, IF, COUNTIF formulas, absolute $A$1 AutoFill locks, and fixing #NAME?, #VALUE!, #DIV/0!, ### errors.',
      keywords: [
        'grade 8 excel formulas worksheet rubric',
        'sum average if countif middle school quiz',
        'absolute cell reference $a$1 autofill worksheet',
      ],
      directAnswerSummary:
        '100-point Grade 8 spreadsheet practice: starting every formula with `=`, writing `SUM`/`AVERAGE`/`IF`/`COUNTIF`, freezing constants with `$B$1` during AutoFill, and diagnosing `#NAME?`, `#VALUE!`, `#DIV/0!`, and `####`.',
      objectives: [
        'Write accurate `SUM`, `AVERAGE`, `IF`, and `COUNTIF` formulas.',
        'Apply `$` absolute references to anchor tax/exchange rates during AutoFill.',
        'Diagnose `#NAME?`, `#VALUE!`, `#DIV/0!`, and column-width `####` issues.',
      ],
      theorySnapshot:
        'Every formula begins with `=`! `$B$1` locks both column B and row 1 when dragging AutoFill. Errors: `#DIV/0!` = divide by 0; `#NAME?` = misspelled function; `#VALUE!` = adding text to number; `####` = column too narrow.',
      teacherTips:
        'Pairs with Grade 8 Spreadsheet Mission lab for live formula entry practice.',
    },
    questions: [
      {
        id: 'xls8-q1',
        partLabelRo: 'Subiectul I · 1',
        partLabelEn: 'Part I · 1',
        points: 18,
        type: 'mcq',
        promptRo: 'Fie notele elevilor în celulele `B2:B6` = `{8, 10, 4, 9, 7}`. Ce returnează formula `=COUNTIF(B2:B6; ">=8")` (sau `, ">=8"`)?',
        promptEn: 'Suppose student grades in `B2:B6` are `{8, 10, 4, 9, 7}`. What does `=COUNTIF(B2:B6, ">=8")` return?',
        optionsRo: ['27 (suma notelor)', '3 (numărul notelor mai mari sau egale cu 8)', '9 (media notelor)', '8'],
        optionsEn: ['27 (sum)', '3 (count of grades >= 8)', '9 (average)', '8'],
        correctAnswer: 1,
        solutionStepRo: 'COUNTIF numără celulele care respectă condiția `>=8`: acestea sunt 8, 10 și 9 — adică exact 3 celule.',
        solutionStepEn: 'COUNTIF counts cells matching `>=8`: 8, 10, and 9 — so 3 cells match.',
      },
      {
        id: 'xls8-q2',
        partLabelRo: 'Subiectul I · 2',
        partLabelEn: 'Part I · 2',
        points: 18,
        type: 'mcq',
        promptRo: 'Ai scris `=SUM(A1:A5)` în B1, dar Excel afișează eroarea `####` în celulă. Care este cauza?',
        promptEn: 'Your Excel cell shows `####` instead of the number result. What caused this?',
        optionsRo: [
          'Ai împărțit la zero',
          'Coloana este prea îngustă pentru a afișa numărul complet (lărgește coloana)',
          'Funcția SUM nu există',
          'Celula A1 conține text',
        ],
        optionsEn: [
          'Division by zero',
          'The column is too narrow to display the full number (widen the column)',
          'SUM does not exist',
          'Cell A1 contains text',
        ],
        correctAnswer: 1,
        solutionStepRo: '`####` nu este o eroare de calcul — înseamnă doar că lățimea coloanei este prea mică pentru a afișa numărul formatat.',
        solutionStepEn: '`####` simply indicates the column is too narrow to display the formatted number.',
      },
      {
        id: 'xls8-q3',
        partLabelRo: 'Subiectul II · 1',
        partLabelEn: 'Part II · 1',
        points: 18,
        type: 'short-answer',
        promptRo: 'În celula `D1` se află cursul valutar EUR (fix pentru tot tabelul). Cum scrii adresa celulei `D1` cu referință ABSOLUTĂ pentru a o bloca la AutoFill?',
        promptEn: 'Cell `D1` stores a fixed EUR exchange rate for the whole table. Write `D1` as an ABSOLUTE cell reference so AutoFill keeps it locked.',
        correctAnswer: '$D$1',
        acceptedAliases: ['$d$1'],
        placeholderRo: 'Ex: $D$1',
        placeholderEn: 'Ex: $D$1',
        solutionStepRo: 'Semnul `$` pus înaintea coloanei și a rândului (`$D$1`) blochează adresa la copierea formulelor cu AutoFill.',
        solutionStepEn: 'Placing `$` before both column and row (`$D$1`) freezes the reference across AutoFill drags.',
      },
      {
        id: 'xls8-q4',
        partLabelRo: 'Subiectul II · 2',
        partLabelEn: 'Part II · 2',
        points: 18,
        type: 'true-false',
        promptRo: 'Adevărat sau Fals: Eroarea `#NAME?` apare de obicei atunci când ai scris greșit numele unei funcții (de ex. `=SUMA(A1:A5)` în loc de `=SUM(A1:A5)`).',
        promptEn: 'True or False: The `#NAME?` error typically appears when a function name is misspelled (e.g., `=SUMM(A1:A5)` instead of `=SUM(A1:A5)`).',
        optionsRo: ['Adevărat', 'Fals'],
        optionsEn: ['True', 'False'],
        correctAnswer: 0,
        solutionStepRo: 'Adevărat. `#NAME?` semnalează că Excel nu recunoaște numele funcției sau al unui domeniu.',
        solutionStepEn: 'True. `#NAME?` tells you Excel does not recognize the spelled function or named range.',
      },
      {
        id: 'xls8-q5',
        partLabelRo: 'Subiectul III',
        partLabelEn: 'Part III',
        points: 18,
        type: 'mcq',
        promptRo: 'Ce va afișa formula `=IF(AVERAGE(4; 6) >= 5; "PROMOVAT"; "RESPINS")`?',
        promptEn: 'What does `=IF(AVERAGE(4, 6) >= 5, "PASSED", "FAILED")` return?',
        optionsRo: ['RESPINS / FAILED', 'PROMOVAT / PASSED', '5', '#VALUE!'],
        optionsEn: ['FAILED', 'PASSED', '5', '#VALUE!'],
        correctAnswer: 1,
        solutionStepRo: 'AVERAGE(4, 6) = (4 + 6) / 2 = 5. Condiția `5 >= 5` este Adevărată ⇒ returnează ramura „PROMOVAT / PASSED”.',
        solutionStepEn: 'AVERAGE(4, 6) = 5. Since `5 >= 5` is True, `IF` outputs the first branch: "PASSED".',
      },
    ],
    rubricRows: [
      { itemRo: 'Subiectul I (2 × 18p)', itemEn: 'Part I (2 × 18 pts)', competencyRo: 'Funcția COUNTIF cu criteriu & diagnostic `####`', competencyEn: 'COUNTIF criteria & `####` display diagnosis', points: 36 },
      { itemRo: 'Subiectul II (2 × 18p)', itemEn: 'Part II (2 × 18 pts)', competencyRo: 'Referință absolută `$D$1` & eroarea `#NAME?`', competencyEn: 'Absolute reference `$D$1` & `#NAME?` error', points: 36 },
      { itemRo: 'Subiectul III (18p)', itemEn: 'Part III (18 pts)', competencyRo: 'Combinare funcție logică `IF` cu `AVERAGE`', competencyEn: 'Nesting `AVERAGE` inside logical `IF`', points: 18 },
      { itemRo: 'Din oficiu', itemEn: 'Ex officio', competencyRo: 'Punctaj de bază', competencyEn: 'Baseline points', points: 10 },
    ],
    faqs: [
      {
        qRo: 'Care este diferența dintre `=SUM(A1:A5)` și `=SUM(A1;A5)`?',
        qEn: 'What is the difference between `=SUM(A1:A5)` and `=SUM(A1, A5)`?',
        aRo: 'Două puncte `:` selectează tot intervalul continuu (A1, A2, A3, A4, A5), pe când virgula/punct-și-virgula `;` adună doar cele două celule A1 și A5.',
        aEn: 'A colon `:` sums the full continuous range A1 through A5; a comma `,` sums only those two individual cells A1 and A5.',
      },
    ],
  },
  {
    id: 'ws-g8-teza-admitere-vectori',
    grade: 8,
    kind: 'olympiad',
    estimatedMinutes: 45,
    maxPoints: 100,
    exOfficioPoints: 10,
    publishedAt: '2026-04-15',
    curriculumRef: 'OMEN 3393/2017 & Admitere Liceu Mate-Info · Clasa a VIII-a · Vectori & Sortare',
    relatedModuleId: 'g8_algo_e',
    relatedBlogSlugRo: 'erori-cpp-gimnaziu-if-while-algoritmi-cifre',
    relatedBlogSlugEn: 'middle-school-cpp-common-errors-if-while-digits',
    relatedGlossarySlugRo: 'vectori-cpp',
    relatedGlossarySlugEn: 'cpp-array-vector',
    optionalCppTraceCode: `#include <iostream>
using namespace std;

int main() {
    int n, v[10];
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    int ok = 1;
    for (int i = 0; i < n - 1; i++) {
        if (v[i] > v[i + 1]) {
            ok = 0;
        }
    }
    cout << (ok ? "SORTAT" : "NESORTAT") << endl;
    return 0;
}`,
    optionalCppTraceStdin: '5\n3 7 12 19 25',
    ro: {
      slug: 'subiect-teza-admitere-mate-info-cpp-clasa-8-vectori-sortare-cautare-binara',
      title: 'Subiect Teză & Admitere Mate-Info C++ Clasa a VIII-a: Vectori 1D, Sortare & Căutare Binară (100p)',
      breadcrumbLabel: 'Teză / Admitere Cls. VIII: Vectori C++',
      metaTitle: 'Subiect Teză & Admitere Mate-Info C++: Vectori, Sortare & Binară | ArkyEdu',
      metaDescription: 'Subiect rezolvat cu barem 100p pentru teza de clasa a VIII-a și admitere liceu mate-info: indexare 0..n-1 în vectori C++, tehnica semaforului (ok), Bubble Sort, căutare binară O(log n) și trace RAM.',
      keywords: [
        'subiect teza informatica clasa 8 c++ vectori barem',
        'probleme admitere liceu mate info c++ vectori',
        'tehnica semaforului c++ vector sortat',
        'cautare binara vs liniara complexitate c++',
      ],
      directAnswerSummary:
        'Subiect tip Teză & Admitere Mate-Info (100p): indexarea corectă `0..n-1` (evitând Out-Of-Bounds), verificarea sortării cu variabila semafor `ok = 1`, parcurgerea comparativă până la `i < n - 1`, complexitatea căutării binare `O(log₂ n)` și numărul maxim de comparații pe 1.024 elemente.',
      objectives: [
        'Accesarea sigură a elementelor unui tablou `v[0..n-1]` fără depășirea limitei `v[n]`.',
        'Aplicarea tehnicii semaforului (flag boolean) și a buclelor `for` pentru verificarea monotoniei.',
        'Compararea eficienței căutării liniare O(n) cu căutarea binară O(log₂ n).',
      ],
      theorySnapshot:
        'Un vector `int v[5]` are indicii `0, 1, 2, 3, 4` (`v[5]` NU există!). Când compari elemente vecine `v[i]` și `v[i + 1]`, bucla merge până la `i < n - 1`. Căutarea binară funcționează DOAR pe vectori sortați și găsește ținta în cel mult ⌊log₂(n)⌋ + 1 pași!',
      teacherTips:
        'Poți lansa imediat verificarea vectorului sortat cu semafor în „Trace C++” pentru a urmări graficul de bare ale vectorului `v[]`!',
    },
    en: {
      slug: 'grade-8-cpp-high-school-prep-arrays-sorting-binary-search-exam',
      title: 'Grade 8 High-School CS Prep Exam with Rubric: 1D Arrays, Sorting & Binary Search (100 pts)',
      breadcrumbLabel: 'G8 Prep Exam: C++ Arrays & Search',
      metaTitle: 'Grade 8 C++ Arrays, Sorting & Binary Search Exam Rubric | ArkyEdu',
      metaDescription: '100-point Grade 8 C++ exam paper with visual RAM array trace: 0-based array indexing, flag technique, adjacent loop bounds i < n - 1, and O(log n) binary search.',
      keywords: [
        'grade 8 c++ arrays test rubric',
        'binary search time complexity quiz',
        'c++ array out of bounds flag technique',
      ],
      directAnswerSummary:
        'High-school CS prep paper (100 pts): 0-based C++ array bounds (`0..n-1`), flag variable verification (`ok = 1`), adjacent pair loop limits `i < n - 1`, and binary search `O(log₂ n)` step bounds.',
      objectives: [
        'Index 0-based C++ arrays safely without accessing `v[n]`.',
        'Implement the boolean flag technique for sorted array validation.',
        'Compute worst-case step counts for binary search vs linear search.',
      ],
      theorySnapshot:
        '`int v[5]` has valid indices `0, 1, 2, 3, 4` (never touch `v[5]`). Comparing `v[i]` with `v[i+1]` requires `i < n - 1`. Binary search requires a sorted array and runs in O(log₂ n) comparisons.',
      teacherTips:
        'Click "Open in C++ Trace" to view live array bar charts during execution!',
    },
    questions: [
      {
        id: 'vec8-q1',
        partLabelRo: 'Subiectul I · 1',
        partLabelEn: 'Part I · 1',
        points: 18,
        type: 'mcq',
        promptRo: 'Fie declarația `int v[6] = {10, 20, 30, 40, 50, 60};`. Ce valoare are `v[2] + v[5]`?',
        promptEn: 'Given `int v[6] = {10, 20, 30, 40, 50, 60};`, what is `v[2] + v[5]`?',
        optionsRo: ['70', '90', '80', '100'],
        optionsEn: ['70', '90', '80', '100'],
        correctAnswer: 1,
        solutionStepRo: 'Indexarea începe de la 0: `v[0]=10, v[1]=20, v[2]=30, v[3]=40, v[4]=50, v[5]=60`. Deci `30 + 60 = 90`.',
        solutionStepEn: 'C++ indexing starts at 0: `v[2]=30` and `v[5]=60`, so `30 + 60 = 90`.',
      },
      {
        id: 'vec8-q2',
        partLabelRo: 'Subiectul I · 2',
        partLabelEn: 'Part I · 2',
        points: 18,
        type: 'mcq',
        promptRo: 'Într-un vector sortat crescător cu `1.024` elemente, de cel mult câți pași (împărțiri la 2) are nevoie Căutarea Binară (Binary Search)?',
        promptEn: 'In a sorted array of `1,024` elements, roughly how many halving steps does Binary Search take at most?',
        optionsRo: ['1.024 pași', '512 pași', '10–11 pași (pentru că 2¹⁰ = 1024)', '100 pași'],
        optionsEn: ['1,024 steps', '512 steps', '10–11 steps (since 2¹⁰ = 1,024)', '100 steps'],
        correctAnswer: 2,
        solutionStepRo: 'Deoarece `2^10 = 1024`, căutarea binară înjumătățește intervalul de cel mult 10–11 ori (`O(log₂ n)`), față de 1.024 la căutarea liniară.',
        solutionStepEn: 'Since `2^10 = 1,024`, binary search halves the range in only 10–11 steps (`O(log₂ n)`).',
      },
      {
        id: 'vec8-q3',
        partLabelRo: 'Subiectul II · 1',
        partLabelEn: 'Part II · 1',
        points: 18,
        type: 'code-output',
        promptRo: 'Ce va afișa algoritmul următor pe vectorul `a` cu 4 elemente?',
        promptEn: 'What does the code below output for the 4-element array `a`?',
        codeSnippet: `int a[4] = {5, 12, 8, 20};
int m = a[0];
for (int i = 1; i < 4; i++) {
    if (a[i] > m) m = a[i];
}
cout << m;`,
        correctAnswer: '20',
        acceptedAliases: ['20 '],
        placeholderRo: 'Valoarea lui m...',
        placeholderEn: 'Final m...',
        solutionStepRo: 'Inițial `m = 5`; la i=1 devine 12; la i=2 rămâne 12 (8 > 12 e fals); la i=3 devine 20. Afișează maximul `20`.',
        solutionStepEn: '`m` updates 5 → 12 → 12 → 20, printing the array maximum `20`.',
      },
      {
        id: 'vec8-q4',
        partLabelRo: 'Subiectul II · 2',
        partLabelEn: 'Part II · 2',
        points: 18,
        type: 'true-false',
        promptRo: 'Adevărat sau Fals: Căutarea Binară funcționează corect și dacă vectorul NU este sortat în prealabil.',
        promptEn: 'True or False: Binary Search works accurately even on an unsorted array.',
        optionsRo: ['Adevărat', 'Fals'],
        optionsEn: ['True', 'False'],
        correctAnswer: 1,
        solutionStepRo: 'Fals! Căutarea binară presupune obligatoriu ca elementele să fie sortate (crescător sau descrescător) pentru a ști ce jumătate să elimine.',
        solutionStepEn: 'False! Binary Search strictly requires a sorted array so it knows which half to discard.',
      },
      {
        id: 'vec8-q5',
        partLabelRo: 'Subiectul III',
        partLabelEn: 'Part III',
        points: 18,
        type: 'short-answer',
        promptRo: 'Pentru un vector indexat `0..n-1` în care verifici perechi vecine `if (v[i] > v[i+1])`, care este limita superioară corectă în `for (int i = 0; i < ...; i++)`? Scrie expresia fără spații (ex: `n-1`).',
        promptEn: 'When checking adjacent pairs `if (v[i] > v[i+1])` on a `0..n-1` array, what is the safe upper bound in `for (int i = 0; i < ...; i++)`?',
        correctAnswer: 'n-1',
        acceptedAliases: ['n - 1', 'i<n-1', 'i < n - 1'],
        placeholderRo: 'Ex: n-1',
        placeholderEn: 'Ex: n-1',
        solutionStepRo: 'Dacă `i` ar ajunge la `n - 1`, `v[i + 1]` ar accesa `v[n]` în afara vectorului! Limita sigură este `n - 1` (`i < n - 1`).',
        solutionStepEn: 'If `i` reached `n - 1`, `v[i + 1]` would read out-of-bounds `v[n]`. Stop strictly at `i < n - 1`.',
      },
    ],
    rubricRows: [
      { itemRo: 'Subiectul I (2 × 18p)', itemEn: 'Part I (2 × 18 pts)', competencyRo: 'Indexare 0..n-1 și complexitate O(log₂ n)', competencyEn: '0-based indexing & O(log₂ n) binary search', points: 36 },
      { itemRo: 'Subiectul II (2 × 18p)', itemEn: 'Part II (2 × 18 pts)', competencyRo: 'Algoritm maxim în vector & precondiție sortare', competencyEn: 'Array maximum trace & sorted precondition', points: 36 },
      { itemRo: 'Subiectul III (18p)', itemEn: 'Part III (18 pts)', competencyRo: 'Prevenire depășire limită vector (`i < n - 1`)', competencyEn: 'Preventing out-of-bounds `v[i+1]` with `i < n - 1`', points: 18 },
      { itemRo: 'Din oficiu', itemEn: 'Ex officio', competencyRo: 'Punctaj de bază', competencyEn: 'Baseline points', points: 10 },
    ],
    faqs: [
      {
        qRo: 'Cum funcționează „tehnica semaforului” (variabila flag `ok`)?',
        qEn: 'How does the "flag technique" (`bool ok`) work in C++?',
        aRo: 'Presupui inițial că proprietatea e adevărată (`int ok = 1;`). Parcurgi vectorul și, imediat ce găsești un contra-exemplu, stingi semaforul (`ok = 0; break;`). Nu ai voie să îl pui la loc pe `1` în buclă!',
        aEn: 'Assume the property holds (`int ok = 1;`). Inside the loop, flip `ok = 0` on any violation—never reset `ok` back to `1` inside the `else` branch!',
      },
    ],
  },
  {
    id: 'ws-g8-evaluare-html5-https',
    grade: 8,
    kind: 'exam',
    estimatedMinutes: 25,
    maxPoints: 100,
    exOfficioPoints: 10,
    publishedAt: '2026-04-16',
    curriculumRef: 'OMEN 3393/2017 · Clasa a VIII-a · Web Design HTML5, CSS & HTTPS',
    relatedModuleId: 'g8_web_a',
    relatedBlogSlugRo: 'primul-site-web-clasa-8-html5-https-google-sites',
    relatedBlogSlugEn: 'first-school-website-grade-8-html5-https-google-sites',
    relatedGlossarySlugRo: 'anatomia-html5-semantica',
    relatedGlossarySlugEn: 'html5-semantics',
    ro: {
      slug: 'test-cu-barem-clasa-8-web-design-html5-semantic-css-https',
      title: 'Test cu Barem Clasa a VIII-a: Anatomia Paginii Web HTML5 Semantică, CSS Flexbox & HTTPS (100p)',
      breadcrumbLabel: 'Test Web Cls. VIII: HTML5, CSS & HTTPS',
      metaTitle: 'Test Web Clasa 8 cu Barem: HTML5 Semantic, CSS & HTTPS/DNS | ArkyEdu',
      metaDescription: 'Test de evaluare HTML5 și rețelistică clasa a VIII-a cu barem 100p: etichete semantice (<header>, <nav>, <main>, <footer>), atribute alt/href, reguli CSS și DNS/HTTPS.',
      keywords: [
        'test html5 css clasa 8 cu barem',
        'etichete semantice html5 header nav main footer',
        'diferenta http https dns clasa 8',
        'fisa web design google sites html clasa 8',
      ],
      directAnswerSummary:
        'Test complet HTML5 & Web (100p): rolul etichetelor semantice (`<header>`, `<nav>`, `<main>`, `<footer>`), atributul de accesibilitate `alt` pe `<img>`, diferența dintre structura HTML și stilizarea CSS, plus funcția DNS și HTTPS (port 443).',
      objectives: [
        'Structurarea unei pagini HTML5 moderne folosind taguri semantice accesibile.',
        'Scrierea corectă a legăturilor `<a href="...">` și a imaginilor `<img src="..." alt="...">`.',
        'Explicarea rolului DNS (traducerea numelui de domeniu în adresă IP) și a certificatului SSL/HTTPS.',
      ],
      theorySnapshot:
        'HTML5 definește structura și conținutul; CSS definește aspectul (culori, Flexbox, fonturi). DNS funcționează ca „agenda telefonică” a Internetului: traduce `www.arkyedu.com` în adresa IP a serverului.',
      teacherTips:
        'Elevii își pot testa imediat propriul cod HTML5 + CSS în Sandbox-ul HTML5 al platformei!',
    },
    en: {
      slug: 'grade-8-html5-semantics-css-flexbox-https-dns-exam',
      title: 'Grade 8 Web Design Exam with Rubric: Semantic HTML5, CSS & HTTPS/DNS (100 pts)',
      breadcrumbLabel: 'G8 Web Exam: HTML5, CSS & HTTPS',
      metaTitle: 'Grade 8 Semantic HTML5, CSS & HTTPS/DNS Test | ArkyEdu',
      metaDescription: '100-point Grade 8 Web Development exam paper: semantic HTML5 tags (<header>, <nav>, <main>, <footer>), img alt accessibility, CSS selectors, and DNS/HTTPS.',
      keywords: [
        'grade 8 html5 css test rubric',
        'semantic html5 tags quiz answers',
        'dns https port 443 middle school quiz',
      ],
      directAnswerSummary:
        'Covers modern Web Design foundations (100 pts): semantic HTML5 containers (`<header>`, `<nav>`, `<main>`, `<footer>`), `<img alt>` accessibility, CSS layout styling, DNS domain resolution, and HTTPS port 443.',
      objectives: [
        'Organize web pages with semantic HTML5 tags instead of generic divs.',
        'Author valid links (`href`) and accessible images (`alt`).',
        'Explain DNS domain-to-IP translation and HTTPS/SSL encryption.',
      ],
      theorySnapshot:
        'HTML5 provides semantic structure; CSS styles colors, typography, and Flexbox layout. DNS translates human domain names into server IP addresses.',
      teacherTips:
        'Students can immediately prototype and validate HTML5 cards in the live HTML5 Sandbox.',
    },
    questions: [
      {
        id: 'web8-q1',
        partLabelRo: 'Subiectul I · 1',
        partLabelEn: 'Part I · 1',
        points: 18,
        type: 'mcq',
        promptRo: 'Care etichetă HTML5 semantică trebuie folosită pentru a încadra CONȚINUTUL PRINCIPAL unic al paginii web?',
        promptEn: 'Which semantic HTML5 tag wraps the unique MAIN content of a web page?',
        optionsRo: ['<head>', '<main>', '<style>', '<br>'],
        optionsEn: ['<head>', '<main>', '<style>', '<br>'],
        correctAnswer: 1,
        solutionStepRo: '`<main>` marchează conținutul central al paginii (distinct de `<header>`, `<nav>` și `<footer>`). `<head>` conține metadate invizibile!',
        solutionStepEn: '`<main>` holds the primary page body (separate from `<header>`, `<nav>`, and `<footer>`), whereas `<head>` holds page metadata.',
      },
      {
        id: 'web8-q2',
        partLabelRo: 'Subiectul I · 2',
        partLabelEn: 'Part I · 2',
        points: 18,
        type: 'mcq',
        promptRo: 'Ce rol are atributul `alt="..."` în eticheta `<img src="robot.png" alt="Robot Arduino">`?',
        promptEn: 'What is the purpose of the `alt="..."` attribute inside `<img src="robot.png" alt="Arduino Robot">`?',
        optionsRo: [
          'Schimbă înălțimea imaginii în pixeli',
          'Oferă text descriptiv pentru cititoarele de ecran (nevăzători) și apare dacă imaginea nu se încarcă',
          'Transformă imaginea în fișier PDF',
          'Deschide un link nou',
        ],
        optionsEn: [
          'Sets image height in pixels',
          'Provides accessible screen-reader description and fallback text if the image fails to load',
          'Converts the image into a PDF',
          'Opens a new browser tab',
        ],
        correctAnswer: 1,
        solutionStepRo: 'Atributul `alt` este obligatoriu pentru accesibilitate web, cititoare de ecran și SEO pe imagini.',
        solutionStepEn: 'The `alt` attribute powers screen-reader accessibility, fallback rendering, and image SEO.',
      },
      {
        id: 'web8-q3',
        partLabelRo: 'Subiectul II · 1',
        partLabelEn: 'Part II · 1',
        points: 18,
        type: 'short-answer',
        promptRo: 'Cum se numește sistemul Internetului (3 litere) care traduce un nume ușor de reținut precum `www.arkyedu.com` în adresa IP numerică a serverului?',
        promptEn: 'What 3-letter Internet system translates domain names like `www.arkyedu.com` into numeric IP addresses?',
        correctAnswer: 'DNS',
        acceptedAliases: ['dns', 'domain name system'],
        placeholderRo: 'Acronim (3 litere)...',
        placeholderEn: '3-letter acronym...',
        solutionStepRo: 'DNS = Domain Name System (Sistemul Numelor de Domeniu).',
        solutionStepEn: 'DNS = Domain Name System.',
      },
      {
        id: 'web8-q4',
        partLabelRo: 'Subiectul II · 2',
        partLabelEn: 'Part II · 2',
        points: 18,
        type: 'true-false',
        promptRo: 'Adevărat sau Fals: Proprietatea CSS `display: flex;` permite aranjarea ușoară a cardurilor pe rânduri sau coloane responsive.',
        promptEn: 'True or False: The CSS rule `display: flex;` enables responsive row or column card layouts cleanly.',
        optionsRo: ['Adevărat', 'Fals'],
        optionsEn: ['True', 'False'],
        correctAnswer: 0,
        solutionStepRo: 'Adevărat. Flexbox (`display: flex;`) este sistemul standard modern de aliniere pe o axă în CSS3.',
        solutionStepEn: 'True. CSS Flexbox (`display: flex;`) provides clean one-dimensional responsive alignment.',
      },
      {
        id: 'web8-q5',
        partLabelRo: 'Subiectul III',
        partLabelEn: 'Part III',
        points: 18,
        type: 'mcq',
        promptRo: 'Care variantă creează corect un hyperlink HTML care trimite elevul către `https://www.arkyedu.com`?',
        promptEn: 'Which snippet creates a valid HTML hyperlink pointing to `https://www.arkyedu.com`?',
        optionsRo: [
          '<link url="https://www.arkyedu.com">ArkyEdu</link>',
          '<a href="https://www.arkyedu.com">ArkyEdu</a>',
          '<img href="https://www.arkyedu.com">ArkyEdu</img>',
          '<p src="https://www.arkyedu.com">ArkyEdu</p>',
        ],
        optionsEn: [
          '<link url="https://www.arkyedu.com">ArkyEdu</link>',
          '<a href="https://www.arkyedu.com">ArkyEdu</a>',
          '<img href="https://www.arkyedu.com">ArkyEdu</img>',
          '<p src="https://www.arkyedu.com">ArkyEdu</p>',
        ],
        correctAnswer: 1,
        solutionStepRo: 'Hyperlink-urile vizibile se definesc cu eticheta ancoră `<a>` și atributul `href="..."`.',
        solutionStepEn: 'Clickable links always use the anchor element `<a>` with the `href` attribute.',
      },
    ],
    rubricRows: [
      { itemRo: 'Subiectul I (2 × 18p)', itemEn: 'Part I (2 × 18 pts)', competencyRo: 'Taguri semantice HTML5 `<main>` & atribut `alt`', competencyEn: 'Semantic `<main>` tag & `<img alt>` accessibility', points: 36 },
      { itemRo: 'Subiectul II (2 × 18p)', itemEn: 'Part II (2 × 18 pts)', competencyRo: 'Sistemul DNS & aliniere CSS Flexbox', competencyEn: 'DNS resolution & CSS Flexbox layout', points: 36 },
      { itemRo: 'Subiectul III (18p)', itemEn: 'Part III (18 pts)', competencyRo: 'Sintaxa corectă a hyperlink-ului `<a href="...">`', competencyEn: 'Valid HTML `<a href="...">` hyperlink syntax', points: 18 },
      { itemRo: 'Din oficiu', itemEn: 'Ex officio', competencyRo: 'Punctaj de bază', competencyEn: 'Baseline points', points: 10 },
    ],
    faqs: [
      {
        qRo: 'Care este diferența dintre `<head>` și `<header>` în HTML5?',
        qEn: 'What is the difference between `<head>` and `<header>` in HTML5?',
        aRo: '`<head>` conține metadate pentru browser/Google (`<title>`, `<meta>`, CSS) și NU se afișează în pagină; `<header>` este antetul vizibil din `<body>` (logo, titlu, meniu).',
        aEn: '`<head>` stores non-visible browser/SEO metadata; `<header>` is the visible top banner inside `<body>`.',
      },
    ],
  },
  {
    id: 'ws-g8-proiect-arduino-smart-city',
    grade: 8,
    kind: 'project',
    estimatedMinutes: 30,
    maxPoints: 100,
    exOfficioPoints: 10,
    publishedAt: '2026-04-17',
    curriculumRef: 'OM 5420/2024 & Manual Art Klett 2025 · Clasa a VIII-a · Arduino Smart City IoT',
    relatedModuleId: 'g8_robot_b',
    relatedBlogSlugRo: 'proiect-arduino-smart-home-gimnaziu-senzori-millis',
    relatedBlogSlugEn: 'arduino-smart-home-school-project-sensors-millis',
    relatedGlossarySlugRo: 'arduino-millis',
    relatedGlossarySlugEn: 'arduino-millis',
    ro: {
      slug: 'fisa-proiect-clasa-8-arduino-uno-smart-city-senzori-ohm-millis',
      title: 'Fișă Proiect Smart City Clasa a VIII-a: Arduino Uno, Senzori PIR/HC-SR04/MQ-2, Ohm & `millis()`',
      breadcrumbLabel: 'Proiect Cls. VIII: Arduino Smart City IoT',
      metaTitle: 'Fișă Proiect Arduino Smart City Clasa 8: Senzori, Ohm & millis() | ArkyEdu',
      metaDescription: 'Fișă proiect & evaluare Clasa a VIII-a (manual Art Klett 2025): pini PWM (~) pe Arduino Uno, calcul distanță HC-SR04 (* 0.034 / 2), senzori PIR & MQ-2, rezistor 220 Ω și millis() vs delay().',
      keywords: [
        'fisa proiect arduino clasa 8 art klett 2025',
        'proiect smart city arduino uno senzori pir mq2 hc sr04',
        'legea lui ohm rezistor led arduino 220 ohm',
        'diferenta millis() vs delay() arduino clasa 8',
      ],
      directAnswerSummary:
        'Fișă practică integrată conform manualului Art Klett 2025 (100p): identificarea pinilor PWM `~` (`3, 5, 6, 9, 10, 11`) pe Arduino Uno, formula distanței la senzorul ultrasonic `HC-SR04` (`durata * 0.034 / 2`), alegerea senzorilor `PIR` (mișcare) și `MQ-2` (gaz), calculul rezistorului prin Legea lui Ohm (`220 Ω`) și multitasking fără blocare cu `millis()`.',
      objectives: [
        'Selectarea pinilor digitali, analogici (`A0–A5` cu ADC 0–1023) și PWM (`0–255`) pe Arduino Uno.',
        'Calcularea distanței în centimetri din timpul de ecou al senzorului ultrasonic HC-SR04.',
        'Explicarea avantajului funcției neblocante `millis()` față de `delay()` într-un sistem Smart City.',
      ],
      theorySnapshot:
        'Pe Arduino Uno: pini PWM (`~`): `3, 5, 6, 9, 10, 11` (`analogWrite(pin, 0..255)`); pini analogici intrare: `A0–A5` (`analogRead` returnează `0..1023`). Formula HC-SR04: `distanta = durata * 0.034 / 2`. Folosim rezistor ~220 Ω în serie cu LED-ul!',
      teacherTips:
        'Ideala pentru susținerea proiectului final „Orașul Inteligent” din programa Clasa a VIII-a!',
    },
    en: {
      slug: 'grade-8-arduino-uno-smart-city-iot-sensors-ohms-millis-project',
      title: 'Grade 8 Smart City Project Sheet: Arduino Uno, PIR/HC-SR04/MQ-2 Sensors, Ohm’s Law & `millis()`',
      breadcrumbLabel: 'G8 Project: Arduino Smart City',
      metaTitle: 'Grade 8 Arduino Smart City IoT Project & Rubric | ArkyEdu',
      metaDescription: 'Grade 8 Arduino Smart City project sheet with 100-point rubric: PWM (~) pins, HC-SR04 ultrasonic formula (* 0.034 / 2), PIR & MQ-2 sensors, 220 Ω LED resistor, and millis() vs delay().',
      keywords: [
        'grade 8 arduino smart city project worksheet',
        'hc-sr04 ultrasonic distance formula arduino',
        'millis vs delay non blocking arduino quiz',
      ],
      directAnswerSummary:
        'Hands-on Grade 8 IoT rubric (100 pts): Arduino Uno PWM `~` pins (`3,5,6,9,10,11`), 10-bit ADC (`0–1023`), HC-SR04 distance math (`duration * 0.034 / 2`), PIR motion & MQ-2 gas sensing, 220 Ω LED current limiting, and `millis()` multitasking.',
      objectives: [
        'Map Arduino Uno digital, 10-bit analog (`A0–A5`), and PWM (`~`) pins properly.',
        'Calculate centimeter distance from HC-SR04 ultrasonic echo time.',
        'Explain why `millis()` enables responsive multitasking unlike blocking `delay()`.',
      ],
      theorySnapshot:
        'Arduino Uno PWM pins (`~`): `3, 5, 6, 9, 10, 11` (`0..255`). Analog inputs `A0–A5` return `0..1023`. HC-SR04 distance: `duration * 0.034 / 2`. Always wire a ~220 Ω resistor in series with LEDs.',
      teacherTips:
        'Pair with the Arkedo Smart City Simulator view for visual prototyping.',
    },
    questions: [
      {
        id: 'ard8-q1',
        partLabelRo: 'Subiectul I · 1',
        partLabelEn: 'Part I · 1',
        points: 18,
        type: 'mcq',
        promptRo: 'Care senzor din kitul Smart City măsoară distanța până la o mașină în fața barierei folosind unde sonore de înaltă frecvență?',
        promptEn: 'Which Smart City sensor measures distance to an approaching vehicle using high-frequency sound waves?',
        optionsRo: ['Senzorul de gaz MQ-2', 'Senzorul ultrasonic HC-SR04', 'Fotorezistorul LDR', 'Senzorul de umiditate DHT11'],
        optionsEn: ['MQ-2 Gas Sensor', 'HC-SR04 Ultrasonic Sensor', 'LDR Photoresistor', 'DHT11 Humidity Sensor'],
        correctAnswer: 1,
        solutionStepRo: 'HC-SR04 emite un impuls ultrasonic pe pinul TRIG și măsoară pe ECHO timpul până la întoarcerea ecoului (`dist = durata * 0.034 / 2`).',
        solutionStepEn: 'HC-SR04 fires an ultrasonic pulse on TRIG and measures echo return time on ECHO (`dist = duration * 0.034 / 2`).',
      },
      {
        id: 'ard8-q2',
        partLabelRo: 'Subiectul I · 2',
        partLabelEn: 'Part I · 2',
        points: 18,
        type: 'mcq',
        promptRo: 'De ce trebuie conectat un rezistor (de obicei 220 Ω – 330 Ω) în serie cu un LED la pinul de 5V al plăcii Arduino Uno?',
        promptEn: 'Why must a resistor (typically 220 Ω – 330 Ω) be wired in series with an LED on an Arduino Uno 5V pin?',
        optionsRo: [
          'Pentru a limita curentul electric (Legea lui Ohm I = U / R) și a preveni arderea LED-ului și a pinului',
          'Pentru a schimba culoarea LED-ului din roșu în albastru',
          'Pentru a transforma semnalul digital în Wi-Fi',
          'Nu este necesar, LED-ul are rezistor intern',
        ],
        optionsEn: [
          'To limit current via Ohm’s Law (I = V / R) so neither the LED nor the pin burns out',
          'To change the LED color from red to blue',
          'To convert digital signals into Wi-Fi',
          'It is optional because LEDs never draw excess current',
        ],
        correctAnswer: 0,
        solutionStepRo: 'Fără rezistor, LED-ul prezintă rezistență aproape nulă și trage un curent periculos de mare care arde joncțiunea LED-ului și microcontrollerul.',
        solutionStepEn: 'Without a current-limiting resistor, excess current immediately damages the LED and Arduino output driver.',
      },
      {
        id: 'ard8-q3',
        partLabelRo: 'Subiectul II · 1',
        partLabelEn: 'Part II · 1',
        points: 18,
        type: 'short-answer',
        promptRo: 'Pe Arduino Uno, funcția `analogRead(A0)` citește tensiunea de la un senzor foto-rezistor (LDR) pe 10 biți. Care este valoarea MAXIMĂ returnată de `analogRead` (când intrarea e la 5V)?',
        promptEn: 'On Arduino Uno, `analogRead(A0)` uses a 10-bit ADC. What is the MAXIMUM integer returned by `analogRead` (at 5V)?',
        correctAnswer: '1023',
        acceptedAliases: ['1023 ', '1,023'],
        placeholderRo: 'Ex: 1023',
        placeholderEn: 'Ex: 1023',
        solutionStepRo: 'Pe 10 biți există `2^10 = 1024` niveluri, numerotate de la `0` (0V) la `1023` (5V).',
        solutionStepEn: 'A 10-bit ADC provides `2^10 = 1024` steps ranging from `0` (0V) to `1023` (5V).',
      },
      {
        id: 'ard8-q4',
        partLabelRo: 'Subiectul II · 2',
        partLabelEn: 'Part II · 2',
        points: 18,
        type: 'true-false',
        promptRo: 'Adevărat sau Fals: Spre deosebire de `delay(5000)`, care îngheață complet placa Arduino timp de 5 secunde, tehnica bazată pe `millis()` permite citirea continuă a senzorilor de gaz și barieră în paralel.',
        promptEn: 'True or False: Unlike `delay(5000)`, which freezes the Arduino CPU for 5 seconds, non-blocking `millis()` timing lets gas and gate sensors keep updating concurrently.',
        optionsRo: ['Adevărat', 'Fals'],
        optionsEn: ['True', 'False'],
        correctAnswer: 0,
        solutionStepRo: 'Adevărat! `millis()` măsoară timpul scurs fără a bloca bucla `loop()`, fiind esențial pentru alarme Smart Home.',
        solutionStepEn: 'True! `millis()` tracks elapsed milliseconds without stalling `loop()`, critical for real-time IoT alerts.',
      },
      {
        id: 'ard8-q5',
        partLabelRo: 'Subiectul III',
        partLabelEn: 'Part III',
        points: 18,
        type: 'mcq',
        promptRo: 'Un impuls ultrasonic `HC-SR04` are durata `1000` microsecunde. Folosind formula `durata * 0.034 / 2`, ce distanță în centimetri măsoară senzorul?',
        promptEn: 'An `HC-SR04` echo pulse lasts `1000` microseconds. Using `duration * 0.034 / 2`, what distance in centimeters is measured?',
        optionsRo: ['34 cm', '17 cm', '8.5 cm', '68 cm'],
        optionsEn: ['34 cm', '17 cm', '8.5 cm', '68 cm'],
        correctAnswer: 1,
        solutionStepRo: '`1000 * 0.034 = 34 cm` (dus-întors!), împărțit la `2` (doar dus) = `17 cm`.',
        solutionStepEn: '`1000 * 0.034 = 34 cm` round-trip; divided by `2` yields `17 cm` one-way distance.',
      },
    ],
    rubricRows: [
      { itemRo: 'Subiectul I (2 × 18p)', itemEn: 'Part I (2 × 18 pts)', competencyRo: 'Rol senzor HC-SR04 & Legea lui Ohm (220 Ω)', competencyEn: 'HC-SR04 ultrasonic sensing & Ohm’s Law LED protection', points: 36 },
      { itemRo: 'Subiectul II (2 × 18p)', itemEn: 'Part II (2 × 18 pts)', competencyRo: 'Interval ADC 10-biți (0–1023) & `millis()` neblocant', competencyEn: '10-bit ADC range (0–1023) & non-blocking `millis()`', points: 36 },
      { itemRo: 'Subiectul III (18p)', itemEn: 'Part III (18 pts)', competencyRo: 'Calculul matematic al distanței (`durata * 0.034 / 2`)', competencyEn: 'Ultrasonic distance formula (`duration * 0.034 / 2`)', points: 18 },
      { itemRo: 'Din oficiu', itemEn: 'Ex officio', competencyRo: 'Punctaj de bază', competencyEn: 'Baseline points', points: 10 },
    ],
    faqs: [
      {
        qRo: 'De ce împărțim la 2 în formula `durata * 0.034 / 2`?',
        qEn: 'Why do we divide by 2 in `duration * 0.034 / 2`?',
        aRo: 'Pentru că unda sonoră parcurge distanța de DOUĂ ori: de la senzor până la obstacol și înapoi la receptor.',
        aEn: 'Because the sound wave travels twice: from the transmitter to the object and back to the echo receiver.',
      },
    ],
  },
];
