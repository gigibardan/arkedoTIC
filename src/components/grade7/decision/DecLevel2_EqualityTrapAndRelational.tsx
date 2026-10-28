import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bug,
  ShieldCheck,
  Check,
  Code,
  Lightbulb,
  Search
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface BugChallenge {
  id: string;
  title: string;
  badCode: string;
  variableInitial: string;
  questionPrompt: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  correctFixedCode: string;
}

const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'b1',
    title: 'Capcana Clasică: Atribuire în loc de Egalitate',
    variableInitial: 'int nota = 7;',
    badCode: 'if (nota = 10) {\n    cout << "Felicitari, nota maxima!";\n} else {\n    cout << "Mai repeta materia!";\n}',
    questionPrompt: 'Ce se întâmplă la execuția acestui fragment de cod?',
    options: [
      {
        label: 'Afișează "Felicitari, nota maxima!" chiar dacă nota inițială era 7!',
        isCorrect: true,
        explanation: 'Operatorul simplu (=) este operator de atribuire! nota devine 10, iar expresia (nota = 10) are valoarea 10 (orice număr diferit de zero este considerat true în C++). Ramura if se execută MEREU!'
      },
      {
        label: 'Afișează "Mai repeta materia!" deoarece 7 nu este egal cu 10.',
        isCorrect: false,
        explanation: 'Fals! Codul folosește un singur egal (=), așadar nu compară, ci suprascrie variabila nota cu 10!'
      },
      {
        label: 'Compilatorul dă eroare fatală și programul refuză să pornească.',
        isCorrect: false,
        explanation: 'În C++, atribuirea într-o condiție este sintactic permisă (deși periculoasă). Compilatorul poate da doar un avertisment (warning).'
      }
    ],
    correctFixedCode: 'if (nota == 10) {\n    cout << "Felicitari, nota maxima!";\n}'
  },
  {
    id: 'b2',
    title: 'Operatorul Relațional „Diferit de” (!=)',
    variableInitial: 'int parola_introdusa = 1234, parola_corecta = 9999;',
    badCode: 'if (parola_introdusa =! parola_corecta) {\n    cout << "Parola gresita!";\n}',
    questionPrompt: 'Observă atent ordinea caracterelor la semnul de diferit:',
    options: [
      {
        label: 'Operatorul corect este != (semnul exclamării urmat de egal), nu =!',
        isCorrect: true,
        explanation: 'Exact! Semnul de diferit este compus din ! urmat imediat de = (fără spațiu: !=). Scris invers (=!), înseamnă atribuirea negației logice!'
      },
      {
        label: 'Codul este perfect valid și conform standardului C++.',
        isCorrect: false,
        explanation: 'Incorect. Ordinea caracterelor este strictă: != înseamnă „diferit de”.'
      },
      {
        label: 'În C++ nu există operator pentru diferit; se folosește doar <>.',
        isCorrect: false,
        explanation: 'Operatorul <> există în Pascal sau SQL, dar în limbajul C++ operatorul este exclusiv !=.'
      }
    ],
    correctFixedCode: 'if (parola_introdusa != parola_corecta) {\n    cout << "Parola gresita!";\n}'
  },
  {
    id: 'b3',
    title: 'Operatorii „Mai Mic sau Egal” (<=) și „Mai Mare sau Egal” (>=)',
    variableInitial: 'int varsta = 18;',
    badCode: 'if (varsta => 18) {\n    cout << "Major";\n}',
    questionPrompt: 'De ce această instrucțiune generează eroare de sintaxă la compilare?',
    options: [
      {
        label: 'Simbolul egal se pune întotdeauna al doilea: >= și <=, niciodată => sau =<',
        isCorrect: true,
        explanation: 'Bravo! În C++, operatorii relaționali compuși se citesc și se scriu în ordinea: „mai mare sau egal” (>=) și „mai mic sau egal” (<=).'
      },
      {
        label: 'Variabila varsta trebuia pusă între paranteze suplimentare.',
        isCorrect: false,
        explanation: 'Parantezele exterioare ale if-ului sunt suficiente: if (varsta >= 18).'
      },
      {
        label: 'Nu avem voie să comparăm numere cu 18.',
        isCorrect: false,
        explanation: 'Comparația numerică este complet permisă, doar sintaxa operatorului era greșită.'
      }
    ],
    correctFixedCode: 'if (varsta >= 18) {\n    cout << "Major";\n}'
  },
  {
    id: 'b4',
    title: 'Comparație Relațională Multiplă (Capcana Matematică 1 <= x <= 10)',
    variableInitial: 'int nota = 7;',
    badCode: 'if (1 <= nota <= 10) {\n    cout << "Nota valida din catalog!";\n}',
    questionPrompt: 'De ce scrierea matematică în lanț 1 <= nota <= 10 este o capcană ascunsă în C++?',
    options: [
      {
        label: 'C++ evaluează de la stânga la dreapta: (1 <= nota) devine 1 (true), iar apoi 1 <= 10 este mereu true!',
        isCorrect: true,
        explanation: 'Extraordinar! În C++ nu putem scrie inegalități duble înlănțuite. Trebuie separat cu operatorul logic ȘI (&&): if (nota >= 1 && nota <= 10).'
      },
      {
        label: 'Nu se pot compara numere cu constante numerice.',
        isCorrect: false,
        explanation: 'Comparațiile cu constante sunt la baza oricărui algoritm.'
      },
      {
        label: 'Compilatorul inversează automat semnele de comparare.',
        isCorrect: false,
        explanation: 'Compilatorul respectă ordinea de precedență a operatorilor de la stânga la dreapta.'
      }
    ],
    correctFixedCode: 'if (nota >= 1 && nota <= 10) {\n    cout << "Nota valida din catalog!";\n}'
  }
];

export const DecLevel2_EqualityTrapAndRelational: React.FC<Props> = ({ onPass }) => {
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
        text: `Excelent observat! ${opt.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Atenție! ${opt.explanation}`
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
              Nivelul 2 din 7 • Modulul 4C
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 77–78</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Bug className="w-6 h-6 text-orange-400" />
            <span>Capcana = vs == &amp; Operatori Relaționali</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Greșeala numărul 1 a tuturor începătorilor în C++ este confuzia dintre operatorul de atribuire (<code className="text-rose-400 font-bold">=</code>) și operatorul de egalitate matematică (<code className="text-emerald-400 font-bold">==</code>). Învață să detectezi capcanele!
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 2:</span>
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
                Operatorul = (Un Singur Egal)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                ATRIBUIRE (Schimbă Valoarea)
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Copiază valoarea din dreapta în variabila din stânga. <strong>NU testează dacă sunt egale!</strong>
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-rose-300">
              int x = 5; // x primeste 5<br />
              <span className="text-rose-400 font-bold">if (x = 10)</span> // x devine 10! Expresia este 10 != 0 (MEREU TRUE!)
            </div>
          </div>
          <div className="mt-3 text-[11px] text-rose-400 font-medium">
            ⚠️ Capcană: Dacă pui un singur egal în if, condiția va fi mereu adevărată!
          </div>
        </div>

        {/* Card 2: Egalitate == */}
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-950/30 border-2 border-emerald-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Operatorul == (Dublu Egal)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                COMPARAȚIE (Nu Modifică Nimic)
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Verifică egalitatea matematică între două expresii și returnează <code className="text-emerald-400">true</code> sau <code className="text-rose-400">false</code>.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
              int x = 5;<br />
              <span className="text-emerald-400 font-bold">if (x == 10)</span> // Testează: este 5 egal cu 10? Răspuns: FALSE!
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 font-medium">
            ✅ Corect: În orice decizie if, verificarea egalității se face MEREU cu ==.
          </div>
        </div>
      </div>

      {/* Interactive Demonstration Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-400" /> Laborator Interactiv de Testare:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Valoare inițială variabilă:</span>
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
              <span className="text-xs text-slate-400 font-mono">Operator testat:</span>
              <button
                type="button"
                onClick={() => setOperatorChoice('==')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  operatorChoice === '=='
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                == (Egalitate)
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
                = (Atribuire - Capcana!)
              </button>
            </div>
          </div>

          <div className="md:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
            <div className="text-slate-400 mb-1">// Simulare execuție C++:</div>
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
              <span className="text-slate-400">Rezultat ieșire consolă:</span>
              <span className={`px-3 py-1 rounded-xl font-bold ${
                operatorChoice === '='
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : testA === 10
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}>
                {operatorChoice === '='
                  ? 'CONDITIE TRUE! (a a devenit 10!)'
                  : testA === 10
                  ? 'CONDITIE TRUE! (7 == 10 este adevarat cand a e 10)'
                  : 'CONDITIE FALSE! (a nu este 10)'}
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
                Detectorul de Bug-uri {currentIdx + 1}/{BUG_CHALLENGES.length}: {currentChallenge.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Întrebarea {currentIdx + 1}/{BUG_CHALLENGES.length}
            </span>
          </div>

          {/* Bad Code Display */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/40 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between text-[11px] text-rose-400 mb-2">
              <span className="flex items-center gap-1">
                <Bug className="w-3.5 h-3.5" /> Cod suspect analizat:
              </span>
              <span className="text-slate-400">{currentChallenge.variableInitial}</span>
            </div>
            <pre className="text-rose-200 overflow-x-auto">
              {currentChallenge.badCode}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            {currentChallenge.questionPrompt}
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
                    {opt.label}
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
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Varianta corectată în C++:
                  </div>
                  <pre className="text-emerald-300 text-xs">{currentChallenge.correctFixedCode}</pre>
                </div>

                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md self-end sm:self-auto"
                >
                  <span>Continuă</span>
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
              Detector de Bug-uri Certificat!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              De acum înainte nu vei mai cădea în capcana operatorului <code className="text-rose-400 font-bold">=</code> în loc de <code className="text-emerald-400 font-bold">==</code> și stăpânești toți cei 6 operatori relaționali!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-orange-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 3: Operatori Logici Compuși (&amp;&amp;, ||, !)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
