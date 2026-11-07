import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bug,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface BugChallenge {
  id: string;
  titleRo: string;
  titleEn: string;
  badCode: string;
  variableInitial: string;
  questionPromptRo: string;
  questionPromptEn: string;
  options: {
    labelRo: string;
    labelEn: string;
    isCorrect: boolean;
    explanationRo: string;
    explanationEn: string;
  }[];
  correctFixedCode: string;
}

const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'b1',
    titleRo: 'Capcana Clasică: Atribuire în loc de Egalitate',
    titleEn: 'Classic Pitfall: Assignment instead of Equality',
    variableInitial: 'int nota = 7;',
    badCode: 'if (nota = 10) {\n    cout << "Felicitari, nota maxima!";\n} else {\n    cout << "Mai repeta materia!";\n}',
    questionPromptRo: 'Ce se întâmplă la execuția acestui fragment de cod?',
    questionPromptEn: 'What happens when this code snippet runs?',
    options: [
      {
        labelRo: 'Afișează "Felicitari, nota maxima!" chiar dacă nota inițială era 7!',
        labelEn: 'It prints "Felicitari, nota maxima!" even though the initial grade was 7!',
        isCorrect: true,
        explanationRo: 'Operatorul simplu (=) este operator de atribuire! nota devine 10, iar expresia (nota = 10) are valoarea 10 (orice număr diferit de zero este considerat true în C++). Ramura if se execută MEREU!',
        explanationEn: 'The single equals (=) is an assignment operator! nota becomes 10, and expression (nota = 10) evaluates to 10 (any non-zero number is true in C++). The if branch ALWAYS runs!'
      },
      {
        labelRo: 'Afișează "Mai repeta materia!" deoarece 7 nu este egal cu 10.',
        labelEn: 'It prints "Mai repeta materia!" because 7 is not equal to 10.',
        isCorrect: false,
        explanationRo: 'Fals! Codul folosește un singur egal (=), așadar nu compară, ci suprascrie variabila nota cu 10!',
        explanationEn: 'False! The code uses single equals (=), so it does not compare; it overwrites nota with 10!'
      },
      {
        labelRo: 'Compilatorul dă eroare fatală și programul refuză să pornească.',
        labelEn: 'The compiler throws a fatal error and halts.',
        isCorrect: false,
        explanationRo: 'În C++, atribuirea într-o condiție este sintactic permisă (deși periculoasă). Compilatorul poate da doar un avertisment (warning).',
        explanationEn: 'In C++, assignment inside conditions is syntactically allowed (though dangerous). The compiler may issue a warning, but not a fatal syntax error.'
      }
    ],
    correctFixedCode: 'if (nota == 10) {\n    cout << "Felicitari, nota maxima!";\n}'
  },
  {
    id: 'b2',
    titleRo: 'Operatorul Relațional „Diferit de” (!=)',
    titleEn: 'The "Not Equal To" Relational Operator (!=)',
    variableInitial: 'int parola_introdusa = 1234, parola_corecta = 9999;',
    badCode: 'if (parola_introdusa =! parola_corecta) {\n    cout << "Parola gresita!";\n}',
    questionPromptRo: 'Observă atent ordinea caracterelor la semnul de diferit:',
    questionPromptEn: 'Look closely at the character order in the inequality symbol:',
    options: [
      {
        labelRo: 'Operatorul corect este != (semnul exclamării urmat de egal), nu =!',
        labelEn: 'The correct operator is != (exclamation followed by equals), not =!',
        isCorrect: true,
        explanationRo: 'Exact! Semnul de diferit este compus din ! urmat imediat de = (fără spațiu: !=). Scris invers (=!), înseamnă atribuirea negației logice!',
        explanationEn: 'Exactly! The inequality operator is exclamation followed immediately by equals (!=). Reversed (=!), it parses as assigning a logical negation!'
      },
      {
        labelRo: 'Codul este perfect valid și conform standardului C++.',
        labelEn: 'The code is completely standard and valid C++.',
        isCorrect: false,
        explanationRo: 'Incorect. Ordinea caracterelor este strictă: != înseamnă „diferit de”.',
        explanationEn: 'Incorrect. Character sequence is strict: != means "not equal to".'
      },
      {
        labelRo: 'În C++ nu există operator pentru diferit; se folosește doar <>.',
        labelEn: 'In C++ there is no inequality operator; <> is used instead.',
        isCorrect: false,
        explanationRo: 'Operatorul <> există în Pascal sau SQL, dar în limbajul C++ operatorul este exclusiv !=.',
        explanationEn: 'The <> operator belongs to Pascal or SQL; in C++ it is strictly !=.'
      }
    ],
    correctFixedCode: 'if (parola_introdusa != parola_corecta) {\n    cout << "Parola gresita!";\n}'
  },
  {
    id: 'b3',
    titleRo: 'Operatorii „Mai Mic sau Egal” (<=) și „Mai Mare sau Egal” (>=)',
    titleEn: 'Operators "Less Than or Equal" (<=) and "Greater Than or Equal" (>=)',
    variableInitial: 'int varsta = 18;',
    badCode: 'if (varsta => 18) {\n    cout << "Major";\n}',
    questionPromptRo: 'De ce această instrucțiune generează eroare de sintaxă la compilare?',
    questionPromptEn: 'Why does this statement trigger a syntax error on compile?',
    options: [
      {
        labelRo: 'Simbolul egal se pune întotdeauna al doilea: >= și <=, niciodată => sau =<',
        labelEn: 'The equals symbol always comes second: >= and <=, never => or =<',
        isCorrect: true,
        explanationRo: 'Bravo! În C++, operatorii relaționali compuși se citesc și se scriu în ordinea: „mai mare sau egal” (>=) și „mai mic sau egal” (<=).',
        explanationEn: 'Correct! In C++, compound relational operators are written as >= and <=, matching how we say them.'
      },
      {
        labelRo: 'Variabila varsta trebuia pusă între paranteze suplimentare.',
        labelEn: 'The variable varsta required redundant inner parentheses.',
        isCorrect: false,
        explanationRo: 'Parantezele exterioare ale if-ului sunt suficiente: if (varsta >= 18).',
        explanationEn: 'Standard outer parentheses are sufficient: if (varsta >= 18).'
      },
      {
        labelRo: 'Nu avem voie să comparăm numere cu 18.',
        labelEn: 'We are not allowed to compare variables with literal 18.',
        isCorrect: false,
        explanationRo: 'Comparația numerică este complet permisă, doar sintaxa operatorului era greșită.',
        explanationEn: 'Literal comparison is standard, only the operator glyph order was flipped.'
      }
    ],
    correctFixedCode: 'if (varsta >= 18) {\n    cout << "Major";\n}'
  },
  {
    id: 'b4',
    titleRo: 'Comparație Relațională Multiplă (Capcana Matematică 1 <= x <= 10)',
    titleEn: 'Chained Comparison (The Mathematical 1 <= x <= 10 Trap)',
    variableInitial: 'int nota = 7;',
    badCode: 'if (1 <= nota <= 10) {\n    cout << "Nota valida din catalog!";\n}',
    questionPromptRo: 'De ce scrierea matematică în lanț 1 <= nota <= 10 este o capcană ascunsă în C++?',
    questionPromptEn: 'Why is chained mathematical 1 <= nota <= 10 a hidden trap in C++?',
    options: [
      {
        labelRo: 'C++ evaluează de la stânga la dreapta: (1 <= nota) devine 1 (true), iar apoi 1 <= 10 este mereu true!',
        labelEn: 'C++ evaluates left-to-right: (1 <= nota) evaluates to 1 (true), and 1 <= 10 is then always true!',
        isCorrect: true,
        explanationRo: 'Extraordinar! În C++ nu putem scrie inegalități duble înlănțuite. Trebuie separat cu operatorul logic ȘI (&&): if (nota >= 1 && nota <= 10).',
        explanationEn: 'Superb! In C++ we cannot chain relational operators. We must split them with the logical AND operator (&&): if (nota >= 1 && nota <= 10).'
      },
      {
        labelRo: 'Nu se pot compara numere cu constante numerice.',
        labelEn: 'Variables cannot be compared with numeric constants.',
        isCorrect: false,
        explanationRo: 'Comparațiile cu constante sunt la baza oricărui algoritm.',
        explanationEn: 'Constant comparisons are standard across computer science.'
      },
      {
        labelRo: 'Compilatorul inversează automat semnele de comparare.',
        labelEn: 'The compiler silently reverses comparison signs.',
        isCorrect: false,
        explanationRo: 'Compilatorul respectă ordinea de precedență a operatorilor de la stânga la dreapta.',
        explanationEn: 'The compiler evaluates expressions following strict left-to-right precedence.'
      }
    ],
    correctFixedCode: 'if (nota >= 1 && nota <= 10) {\n    cout << "Nota valida din catalog!";\n}'
  }
];

export const DecLevel2_EqualityTrapAndRelational: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Interactive Live Bug Trap Sandbox
  const [testA, setTestA] = useState<number>(7);
  const [operatorChoice, setOperatorChoice] = useState<'=' | '=='>('==');

  const currentChallenge = BUG_CHALLENGES[currentIdx];
  const isFinished = currentIdx >= BUG_CHALLENGES.length;

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const opt = currentChallenge.options[idx];
    if (opt.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 25);
      setFeedback({
        isCorrect: true,
        text: lang === 'ro'
          ? `Excelent observat! ${opt.explanationRo}`
          : `Great catch! ${opt.explanationEn}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: lang === 'ro'
          ? `Atenție! ${opt.explanationRo}`
          : `Careful! ${opt.explanationEn}`
      });
    }
  };

  const handleNextChallenge = () => {
    sounds.playClick();
    setSelectedOptIdx(null);
    setFeedback(null);
    setCurrentIdx(i => i + 1);
  };

  const handleFinishLevel = () => {
    sounds.playLevelUp();
    onPass(Math.min(score, 100));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/60 p-5 sm:p-6 rounded-3xl border-2 border-orange-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              {lang === 'ro' ? 'Nivelul 2 din 7 • Modulul 4C' : 'Level 2 of 7 • Module 4C'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Manual Art Klett pag. 77–78' : 'Art Klett Textbook pp. 77–78'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Bug className="w-6 h-6 text-orange-400" />
            <span>
              {lang === 'ro'
                ? 'Capcana = vs == & Operatori Relaționali'
                : 'The = vs == Trap & Relational Operators'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'ro' ? (
              <>Greșeala numărul 1 a tuturor începătorilor în C++ este confuzia dintre operatorul de atribuire (<code className="text-rose-400 font-bold">=</code>) și operatorul de egalitate matematică (<code className="text-emerald-400 font-bold">==</code>). Învață să detectezi capcanele!</>
            ) : (
              <>The #1 beginner mistake in C++ is confusing assignment (<code className="text-rose-400 font-bold">=</code>) with mathematical equality (<code className="text-emerald-400 font-bold">==</code>). Master the difference and avoid subtle bugs!</>
            )}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">
            {lang === 'ro' ? 'Scor Nivel 2:' : 'Level 2 Score:'}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono text-orange-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Visual Comparison Matrix & Live Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Atribuire = */}
        <div className="p-4 sm:p-5 rounded-3xl bg-rose-950/30 border-2 border-rose-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                {lang === 'ro' ? 'Operatorul = (Un Singur Egal)' : 'Operator = (Single Equals)'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                {lang === 'ro' ? 'ATRIBUIRE (Schimbă Valoarea)' : 'ASSIGNMENT (Overwrites Value)'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {lang === 'ro'
                ? 'Copiază valoarea din dreapta în variabila din stânga. NU testează dacă sunt egale!'
                : 'Copies value on right into variable on left. Does NOT test equality!'}
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-rose-300">
              int x = 5; // x = 5<br />
              <span className="text-rose-400 font-bold">if (x = 10)</span> // x {lang === 'ro' ? 'devine 10! Expresia este 10 != 0 (MEREU TRUE!)' : 'becomes 10! Evaluates to 10 != 0 (ALWAYS TRUE!)'}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-rose-400 font-medium">
            {lang === 'ro'
              ? '⚠️ Capcană: Dacă pui un singur egal în if, condiția va fi mereu adevărată!'
              : '⚠️ Pitfall: Single equals in an if makes condition almost always evaluate to true!'}
          </div>
        </div>

        {/* Card 2: Egalitate == */}
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-950/30 border-2 border-emerald-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {lang === 'ro' ? 'Operatorul == (Dublu Egal)' : 'Operator == (Double Equals)'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {lang === 'ro' ? 'COMPARAȚIE (Nu Modifică Nimic)' : 'COMPARISON (Does Not Mutate)'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {lang === 'ro'
                ? 'Verifică egalitatea matematică între două expresii și returnează true sau false.'
                : 'Tests mathematical equality between two expressions, returning true or false.'}
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
              int x = 5;<br />
              <span className="text-emerald-400 font-bold">if (x == 10)</span> // {lang === 'ro' ? 'Testează: este 5 egal cu 10? Răspuns: FALSE!' : 'Tests: is 5 equal to 10? Answer: FALSE!'}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 font-medium">
            {lang === 'ro'
              ? '✅ Corect: În orice decizie if, verificarea egalității se face MEREU cu ==.'
              : '✅ Correct: In every if condition, equality check is ALWAYS ==.'}
          </div>
        </div>
      </div>

      {/* Interactive Demonstration Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>{lang === 'ro' ? 'Laborator Interactiv de Testare:' : 'Interactive Testing Sandbox:'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {lang === 'ro' ? 'Valoare inițială variabilă:' : 'Initial variable value:'}
              </span>
              <span className="font-mono font-bold text-cyan-400">int a = {testA};</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={testA}
              onChange={(e) => setTestA(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {lang === 'ro' ? 'Operator testat:' : 'Tested operator:'}
              </span>
              <button
                type="button"
                onClick={() => setOperatorChoice('==')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  operatorChoice === '=='
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                == ({lang === 'ro' ? 'Egalitate' : 'Equality'})
              </button>
              <button
                type="button"
                onClick={() => setOperatorChoice('=')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  operatorChoice === '='
                    ? 'bg-rose-500 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                = ({lang === 'ro' ? 'Atribuire - Capcana!' : 'Assignment - Trap!'})
              </button>
            </div>
          </div>

          <div className="md:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
            <div className="text-slate-400 mb-1">
              {lang === 'ro' ? '// Simulare execuție C++:' : '// C++ Execution Simulation:'}
            </div>
            <div className="text-slate-300">
              int a = {testA};<br />
              <span className={operatorChoice === '=' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                if (a {operatorChoice} 10)
              </span>{' '}
              {'{'}<br />
              &nbsp;&nbsp;cout &lt;&lt; &quot;CONDITIE TRUE!&quot;;<br />
              {'}'} else {'{'}<br />
              &nbsp;&nbsp;cout &lt;&lt; &quot;CONDITIE FALSE!&quot;;<br />
              {'}'}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">
                {lang === 'ro' ? 'Rezultat ieșire consolă:' : 'Console output:'}
              </span>
              <span className={`px-3 py-1 rounded-xl font-bold ${
                operatorChoice === '='
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : testA === 10
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}>
                {operatorChoice === '='
                  ? (lang === 'ro' ? 'CONDITIE TRUE! (a a devenit 10!)' : 'CONDITION TRUE! (a mutated to 10!)')
                  : testA === 10
                  ? (lang === 'ro' ? 'CONDITIE TRUE! (10 == 10 este adevarat)' : 'CONDITION TRUE! (10 == 10 is true)')
                  : (lang === 'ro' ? 'CONDITIE FALSE! (a nu este 10)' : 'CONDITION FALSE! (a is not 10)')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                {lang === 'ro'
                  ? `Detectorul de Bug-uri ${currentIdx + 1}/${BUG_CHALLENGES.length}: ${currentChallenge.titleRo}`
                  : `Bug Detector ${currentIdx + 1}/${BUG_CHALLENGES.length}: ${currentChallenge.titleEn}`}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro'
                ? `Întrebarea ${currentIdx + 1}/${BUG_CHALLENGES.length}`
                : `Question ${currentIdx + 1}/${BUG_CHALLENGES.length}`}
            </span>
          </div>

          {/* Bad Code Display */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/40 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between text-[11px] text-rose-400 mb-2">
              <span className="flex items-center gap-1">
                <Bug className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Cod suspect analizat:' : 'Suspicious code analyzed:'}</span>
              </span>
              <span className="text-slate-400">{currentChallenge.variableInitial}</span>
            </div>
            <pre className="text-rose-200 overflow-x-auto">
              {currentChallenge.badCode}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            {lang === 'ro' ? currentChallenge.questionPromptRo : currentChallenge.questionPromptEn}
          </div>

          {/* Options List */}
          <div className="flex flex-col gap-3">
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : selectedOptIdx !== null && opt.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-xs sm:text-sm leading-relaxed">
                    {lang === 'ro' ? opt.labelRo : opt.labelEn}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Fixed Code Preview */}
          {feedback && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <div className={`p-4 rounded-2xl border flex items-center gap-2.5 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
              }`}>
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {feedback.text}
                </span>
              </div>

              {/* Fixed Code Preview */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-emerald-500/40 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ro' ? 'Varianta corectată în C++:' : 'Corrected C++ variant:'}</span>
                  </div>
                  <pre className="text-emerald-300 text-xs">{currentChallenge.correctFixedCode}</pre>
                </div>

                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md self-end sm:self-auto"
                >
                  <span>{lang === 'ro' ? 'Continuă' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-orange-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            🛡️
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro' ? 'Detector de Bug-uri Certificat!' : 'Certified Bug Detector!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              {lang === 'ro' ? (
                <>De acum înainte nu vei mai cădea în capcana operatorului <code className="text-rose-400 font-bold">=</code> în loc de <code className="text-emerald-400 font-bold">==</code> și stăpânești toți cei 6 operatori relaționali!</>
              ) : (
                <>From now on you will never confuse <code className="text-rose-400 font-bold">=</code> with <code className="text-emerald-400 font-bold">==</code> and you have mastered all 6 relational operators!</>
              )}
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-orange-400 font-mono font-bold text-sm">
            {lang === 'ro' ? `Scor obținut: +${score} XP` : `Score Earned: +${score} XP`}
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>
              {lang === 'ro'
                ? 'Treci la Nivelul 3: Operatori Logici Compuși (&&, ||, !)'
                : 'Advance to Level 3: Compound Logical Operators (&&, ||, !)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
