import React, { useState } from 'react';
import {
  Bug,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Wrench,
  ShieldAlert,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A2Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface BugOption {
  id: string;
  textRo: string;
  textEn: string;
  isCorrect: boolean;
}

interface BugCase {
  id: string;
  titleRo: string;
  titleEn: string;
  badCode: string;
  descriptionRo: string;
  descriptionEn: string;
  options: BugOption[];
  explanationRo: string;
  explanationEn: string;
}

const BUG_CASES: BugCase[] = [
  {
    id: 'bug1',
    titleRo: 'Capcana 1: Problema Dangling Else (Else-ul Orfan)',
    titleEn: 'Trap 1: The Dangling Else Problem (Orphan Else)',
    badCode: `if (varsta >= 18)
    if (arePermis == 1)
        cout << "Poate conduce masina!";
else
    cout << "Minor fara drept!";`,
    descriptionRo:
      'Elevul a vrut ca mesajul „Minor fara drept!” să se afișeze dacă varsta < 18. Însă fără acolade, la care if se leagă clauza else?',
    descriptionEn:
      'The programmer intended "Minor fara drept!" to display if varsta < 18. Without explicit braces, which if does this else bind to?',
    options: [
      {
        id: 'a',
        textRo: 'La primul if (varsta >= 18), pentru că este la același nivel de indentare vizuală',
        textEn: 'To the first if (varsta >= 18), because of matching visual indentation',
        isCorrect: false
      },
      {
        id: 'b',
        textRo: 'La cel mai apropiat if (arePermis == 1)! Dacă o persoană are 25 de ani dar nu are permis, programul îi va spune eronat: „Minor fara drept!”',
        textEn: 'To the nearest if (arePermis == 1)! If a 25-year-old lacks a license, it prints erroneously: "Minor fara drept!"',
        isCorrect: true
      },
      {
        id: 'c',
        textRo: 'La ambele if-uri în mod egal',
        textEn: 'To both if statements simultaneously',
        isCorrect: false
      }
    ],
    explanationRo:
      'Corect! În C++, indentarea este doar vizuală pentru om. Compilatorul asociază întotdeauna un „else” cu cel mai apropiat „if” fără else. Soluția este folosirea obligatorie a acoladelor { } la primul if!',
    explanationEn:
      'Correct! In C++, indentation is ignored by the parser. An else binds to the closest open if statement. Explicit braces { } are essential to enforce outer scope!'
  },
  {
    id: 'bug2',
    titleRo: 'Capcana 2: Atribuirea în loc de Egalitate ( = vs == )',
    titleEn: 'Trap 2: Assignment vs Equality Comparison ( = vs == )',
    badCode: `int nota = 4;
if (nota = 10) {
    cout << "Felicitari, ai nota maxima!";
}`,
    descriptionRo:
      'Programatorul a scris din greșeală un singur semn egal în interiorul parantezelor condiției if.',
    descriptionEn:
      'A single equals sign was inadvertently written inside the parentheses of the if test.',
    options: [
      {
        id: 'a',
        textRo: 'Codul dă eroare de compilare imediată',
        textEn: 'The code causes an immediate syntax error and refuses to compile',
        isCorrect: false
      },
      {
        id: 'b',
        textRo: 'Condiția devine FALSĂ și mesajul nu se afișează',
        textEn: 'The condition evaluates to FALSE and nothing prints',
        isCorrect: false
      },
      {
        id: 'c',
        textRo: 'nota = 10 atribuie valoarea 10 variabilei, expresia se evaluează la 10 (nenul = TRUE), iar mesajul se afișează eronat chiar dacă elevul avea nota 4 inițial!',
        textEn: 'nota = 10 assigns 10 to nota, evaluates to 10 (non-zero = TRUE), and prints the congratulations message even if the grade was initially 4!',
        isCorrect: true
      }
    ],
    explanationRo:
      'Exact! În C++, operatorul „=” este de atribuire, nu de comparație. Condiția dacă nota este 10 trebuie scrisă obligatoriu cu dublu egal: „if (nota == 10)”.',
    explanationEn:
      'Exact! In C++, = is assignment while == tests relational equality. Testing if nota equals 10 strictly requires "if (nota == 10)".'
  },
  {
    id: 'bug3',
    titleRo: 'Capcana 3: Punctul și Virgula Pustiu după if',
    titleEn: 'Trap 3: Stray Semicolon Terminating if',
    badCode: `int punctaj = 20;
if (punctaj >= 100);
{
    cout << "Ai castigat marele premiu!";
}`,
    descriptionRo:
      'A fost introdus din reflex un punct și virgulă imediat după paranteza închisă a condiției.',
    descriptionEn:
      'A stray semicolon was typed directly following the closing parenthesis of the condition.',
    options: [
      {
        id: 'a',
        textRo: 'Punctul și virgula (;) reprezintă o instrucțiune vidă. Condiția se oprește acolo, iar blocul dintre acolade se va executa MEREU, chiar și la 20 de puncte!',
        textEn: 'The semicolon (;) represents an empty null statement. The test ends immediately, and the brace block executes UNCONDITIONALLY, even with 20 points!',
        isCorrect: true
      },
      {
        id: 'b',
        textRo: 'Calculatorul anulează complet programul',
        textEn: 'The runtime terminates program execution immediately',
        isCorrect: false
      },
      {
        id: 'c',
        textRo: 'Nu are niciun efect, este o bună practică de stil',
        textEn: 'It has no effect and is merely good stylistic practice',
        isCorrect: false
      }
    ],
    explanationRo:
      'Corect! Punctul și virgula pus imediat după if (cond); separă condiția de bloc. Blocul { cout << ...; } devine un bloc independent care se execută întotdeauna!',
    explanationEn:
      'Correct! The semicolon following if (cond); closes the conditional branch as a no-op. The following block { ... } becomes unconditional code that always executes!'
  },
  {
    id: 'bug4',
    titleRo: 'Capcana 4: Interval Matematic Imposibil',
    titleEn: 'Trap 4: Contradictory Impossible Boolean Interval',
    badCode: `int x;
cin >> x;
if (x > 10 && x < 5) {
    cout << "Numarul este valid!";
}`,
    descriptionRo:
      'Elevul a vrut să testeze dacă x este fie mai mare ca 10, fie mai mic ca 5.',
    descriptionEn:
      'The programmer intended to verify if x is either greater than 10 or less than 5.',
    options: [
      {
        id: 'a',
        textRo: 'Mesajul se va afișa pentru x = 7',
        textEn: 'The message will print for x = 7',
        isCorrect: false
      },
      {
        id: 'b',
        textRo: 'Condiția este imposibilă (niciun număr nu poate fi simultan > 10 ȘI < 5). Trebuia folosit operatorul SAU logic ( || ) în loc de &&!',
        textEn: 'The condition is mathematically impossible (no real integer is simultaneously > 10 AND < 5). Logical OR ( || ) was required instead of &&!',
        isCorrect: true
      },
      {
        id: 'c',
        textRo: 'Condiția este perfect corectă',
        textEn: 'The condition is completely sound and functional',
        isCorrect: false
      }
    ],
    explanationRo:
      'Corect! Când un număr trebuie să aparțină uneia dintre două zone disjuncte, se folosește SAU logic (x > 10 || x < 5), altfel && va produce întotdeauna 0 (Fals).',
    explanationEn:
      'Correct! Disjoint range criteria necessitate logical OR (x > 10 || x < 5). Using && on disjoint sets evaluates to false across all inputs.'
  }
];

export const A2Level6_LogicalBranchDebugger: React.FC<A2Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const [activeBugIdx, setActiveBugIdx] = useState<number>(0);
  const [solvedBugs, setSolvedBugs] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const currentCase = BUG_CASES[activeBugIdx];

  const handleSelectAnswer = (optionId: string, isCorrect: boolean) => {
    setSolvedBugs((prev) => ({ ...prev, [currentCase.id]: optionId }));
    setShowExplanation(true);
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const solvedCount = Object.entries(solvedBugs).filter(([bugId, optionId]) => {
    const c = BUG_CASES.find((b) => b.id === bugId);
    return c?.options.find((o) => o.id === optionId)?.isCorrect;
  }).length;

  const isLevelCompleted = solvedCount === 4;

  const handleFinish = () => {
    if (isLevelCompleted) {
      sounds.playCorrect();
      if (onCompletePage) onCompletePage(100);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950 via-red-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-rose-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-400/30 text-rose-300">
              <Bug className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/30 text-rose-200 border border-rose-400/30">
                  {lang === 'ro' ? 'Modulul 3B • Nivelul 6 din 7' : 'Module 3B • Level 6 of 7'}
                </span>
                <span className="text-xs text-rose-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 69–70' : 'Art Klett Textbook pp. 69–70'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Laborator de Depanare Logică & Capcane Subtile de Ramificare'
                  : 'Logic Branch Debugging Clinic & Subtle Pitfalls'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-rose-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 6: Debugger Logic' : 'Level 6: Logic Debugger'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-rose-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'Erorile de sintaxă sunt ușor de găsit (compilatorul le semnalează cu linie roșie). Însă erorile logice la structurile decizionale (dangling else, atribuire accidentală în if, punct și virgulă parazit) compilează fără avertisment dar produc rezultate complet greșite!'
            : 'Syntax errors are straightforward (compilers catch them with red underlines). However, logical branching traps (dangling else, accidental assignment in if, stray semicolons) compile cleanly yet silently generate erroneous computations!'}
        </p>
      </div>

      {/* Tabs for 4 bugs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {BUG_CASES.map((bCase, idx) => {
          const isDone = solvedBugs[bCase.id] && bCase.options.find((o) => o.id === solvedBugs[bCase.id])?.isCorrect;
          return (
            <button
              key={bCase.id}
              onClick={() => {
                setActiveBugIdx(idx);
                setShowExplanation(Boolean(solvedBugs[bCase.id]));
                sounds.playClick();
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                activeBugIdx === idx
                  ? 'bg-rose-900/60 border-rose-400 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-semibold truncate">
                {lang === 'ro' ? `Capcana #${idx + 1}` : `Trap #${idx + 1}`}
              </span>
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400/60 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Bug Case Card */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-rose-400" />
            {lang === 'ro' ? currentCase.titleRo : currentCase.titleEn}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {lang === 'ro' ? `Cazul ${activeBugIdx + 1} / 4` : `Case ${activeBugIdx + 1} / 4`}
          </span>
        </div>

        {/* Bad Code Window */}
        <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 font-mono text-xs text-slate-200 relative">
          <div className="text-[10px] text-rose-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5 font-sans">
            <AlertTriangle className="w-3.5 h-3.5" />
            {lang === 'ro' ? 'Cod Sursă cu Eroare Logică Subtilă:' : 'Source Code with Subtle Logic Flaw:'}
          </div>
          <pre className="text-rose-200 whitespace-pre overflow-x-auto leading-relaxed">{currentCase.badCode}</pre>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'ro' ? currentCase.descriptionRo : currentCase.descriptionEn}
        </p>

        {/* Options */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">
            {lang === 'ro' ? 'Identifică anomalia și efectul corect:' : 'Identify the defect and resulting runtime consequence:'}
          </span>
          {currentCase.options.map((opt) => {
            const isSelected = solvedBugs[currentCase.id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectAnswer(opt.id, opt.isCorrect)}
                className={`w-full p-3 rounded-lg border text-left text-xs transition-colors flex items-start gap-2.5 ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isSelected && opt.isCorrect ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                      {opt.id.toUpperCase()}
                    </div>
                  )}
                </div>
                <span>{lang === 'ro' ? opt.textRo : opt.textEn}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-cyan-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>{lang === 'ro' ? 'Explicație Pedagogică:' : 'Pedagogical Explanation:'}</strong>{' '}
              {lang === 'ro' ? currentCase.explanationRo : currentCase.explanationEn}
            </div>
          </div>
        )}
      </div>

      {/* Completion & Navigation Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isLevelCompleted ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' : 'bg-slate-600'
            }`}
          />
          <span className="text-xs text-slate-300">
            {isLevelCompleted
              ? (lang === 'ro'
                ? 'Excelent! Ai depistat toate cele 4 capcane majore de logică decizională.'
                : 'Excellent! You diagnosed all 4 critical decision branching traps.')
              : (lang === 'ro'
                ? `Progres depanare: ${solvedCount} / 4 capcane rezolvate cu succes.`
                : `Debugging progress: ${solvedCount} / 4 traps successfully resolved.`)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="py-2 px-4 rounded-lg font-medium text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
            >
              {lang === 'ro' ? 'Înapoi' : 'Back'}
            </button>
          )}
          <button
            onClick={handleFinish}
            disabled={!isLevelCompleted}
            className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
              isLevelCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>{lang === 'ro' ? 'Următorul Nivel: Examenul Sumativ Modulul 3B' : 'Next Level: Module 3B Summative Exam'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
