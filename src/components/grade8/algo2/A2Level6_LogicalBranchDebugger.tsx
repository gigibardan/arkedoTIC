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

interface A2Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface BugCase {
  id: string;
  title: string;
  badCode: string;
  description: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

const BUG_CASES: BugCase[] = [
  {
    id: 'bug1',
    title: 'Capcana 1: Problema Dangling Else (Else-ul Orfan)',
    badCode: `if (varsta >= 18)
    if (arePermis == 1)
        cout << "Poate conduce masina!";
else
    cout << "Minor fara drept!";`,
    description:
      'Elevul a vrut ca mesajul „Minor fara drept!” să se afișeze dacă varsta < 18. Însă fără acolade, la care if se leagă clauza else?',
    options: [
      {
        id: 'a',
        text: 'La primul if (varsta >= 18), pentru că este la același nivel de indentare vizuală',
        isCorrect: false
      },
      {
        id: 'b',
        text: 'La cel mai apropiat if (arePermis == 1)! Dacă o persoană are 25 de ani dar nu are permis, programul îi va spune eronat: „Minor fara drept!”',
        isCorrect: true
      },
      {
        id: 'c',
        text: 'La ambele if-uri în mod egal',
        isCorrect: false
      }
    ],
    explanation:
      'Corect! În C++, indentarea este doar vizuală pentru om. Compilatorul asociază întotdeauna un „else” cu cel mai apropiat „if” fără else. Soluția este folosirea obligatorie a acoladelor { } la primul if!'
  },
  {
    id: 'bug2',
    title: 'Capcana 2: Atribuirea în loc de Egalitate ( = vs == )',
    badCode: `int nota = 4;
if (nota = 10) {
    cout << "Felicitari, ai nota maxima!";
}`,
    description:
      'Programatorul a scris din greșeală un singur semn egal în interiorul parantezelor condiției if.',
    options: [
      {
        id: 'a',
        text: 'Codul dă eroare de compilare imediată',
        isCorrect: false
      },
      {
        id: 'b',
        text: 'Condiția devine FALSĂ și mesajul nu se afișează',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'nota = 10 atribuie valoarea 10 variabilei, expresia se evaluează la 10 (nenul = TRUE), iar mesajul se afișează eronat chiar dacă elevul avea nota 4 inițial!',
        isCorrect: true
      }
    ],
    explanation:
      'Exact! În C++, operatorul „=” este de atribuire, nu de comparație. Condiția dacă nota este 10 trebuie scrisă obligatoriu cu dublu egal: „if (nota == 10)”.'
  },
  {
    id: 'bug3',
    title: 'Capcana 3: Punctul și Virgula Pustiu după if',
    badCode: `int punctaj = 20;
if (punctaj >= 100);
{
    cout << "Ai castigat marele premiu!";
}`,
    description:
      'A fost introdus din reflex un punct și virgulă imediat după paranteza închisă a condiției.',
    options: [
      {
        id: 'a',
        text: 'Punctul și virgula (;) reprezintă o instrucțiune vidă. Condiția se oprește acolo, iar blocul dintre acolade se va executa MEREU, chiar și la 20 de puncte!',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'Calculatorul anulează complet programul',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Nu are niciun efect, este o bună practică de stil',
        isCorrect: false
      }
    ],
    explanation:
      'Corect! Punctul și virgula pus imediat după if (cond); separă condiția de bloc. Blocul { cout << ...; } devine un bloc independent care se execută întotdeauna!'
  },
  {
    id: 'bug4',
    title: 'Capcana 4: Interval Matematic Imposibil',
    badCode: `int x;
cin >> x;
if (x > 10 && x < 5) {
    cout << "Numarul este valid!";
}`,
    description:
      'Elevul a vrut să testeze dacă x este fie mai mare ca 10, fie mai mic ca 5.',
    options: [
      {
        id: 'a',
        text: 'Mesajul se va afișa pentru x = 7',
        isCorrect: false
      },
      {
        id: 'b',
        text: 'Condiția este imposibilă (niciun număr nu poate fi simultan > 10 ȘI < 5). Trebuia folosit operatorul SAU logic ( || ) în loc de &&!',
        isCorrect: true
      },
      {
        id: 'c',
        text: 'Condiția este perfect corectă',
        isCorrect: false
      }
    ],
    explanation:
      'Corect! Când un număr trebuie să aparțină uneia dintre două zone disjuncte, se folosește SAU logic (x > 10 || x < 5), altfel && va produce întotdeauna 0 (Fals).'
  }
];

export const A2Level6_LogicalBranchDebugger: React.FC<A2Level6Props> = ({
  onCompletePage,
  onComplete
}) => {
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
                  Modulul 3B • Nivelul 6 din 7
                </span>
                <span className="text-xs text-rose-300">Manual Art Klett pag. 69–70</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Laborator de Depanare Logică & Capcane Subtile de Ramificare
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-rose-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 6: Debugger Logic</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-rose-100/90 leading-relaxed max-w-3xl">
          Erorile de sintaxă sunt ușor de găsit (compilatorul le semnalează cu linie roșie). Însă <strong>erorile logice</strong> la structurile decizionale (dangling else, atribuire accidentală în if, punct și virgulă parazit) compilează fără avertisment dar produc rezultate complet greșite!
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
              <span className="font-semibold truncate">Capcana #{idx + 1}</span>
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
            {currentCase.title}
          </h3>
          <span className="text-xs text-slate-400 font-mono">Cazul {activeBugIdx + 1} / 4</span>
        </div>

        {/* Bad Code Window */}
        <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 font-mono text-xs text-slate-200 relative">
          <div className="text-[10px] text-rose-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5 font-sans">
            <AlertTriangle className="w-3.5 h-3.5" />
            Cod Sursă cu Eroare Logică Subtilă:
          </div>
          <pre className="text-rose-200 whitespace-pre overflow-x-auto leading-relaxed">{currentCase.badCode}</pre>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{currentCase.description}</p>

        {/* Options */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">Identifică anomalia și efectul corect:</span>
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
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-cyan-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Explicație Pedagogică:</strong> {currentCase.explanation}
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
              ? 'Excelent! Ai depistat toate cele 4 capcane majore de logică decizională.'
              : `Progres depanare: ${solvedCount} / 4 capcane rezolvate cu succes.`}
          </span>
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>Următorul Nivel: Examenul Sumativ Modulul 3B</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
