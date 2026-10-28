import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Lightbulb,
  Check,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Terminal
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

export const StemLevel2_DoWhileValidation: React.FC<Props> = ({ onPass }) => {
  // Input Validation Simulator State
  const [inputVal, setInputVal] = useState<string>('');
  const [attempts, setAttempts] = useState<{ val: number; valid: boolean; prompt: string }[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [validationTarget] = useState<{ min: number; max: number }>({ min: 1, max: 10 });

  // Comparison toggle between while and do-while
  const [compVal, setCompVal] = useState<number>(0);

  // Challenges
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  const handleSimulateInput = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(inputVal);
    if (isNaN(num) || inputVal.trim() === '') {
      sounds.playWrong();
      return;
    }

    const isValid = num >= validationTarget.min && num <= validationTarget.max;
    if (isValid) {
      sounds.playCorrect();
      setIsValidated(true);
      setAttempts(prev => [
        ...prev,
        { val: num, valid: true, prompt: `Intrare ${num}: Validată cu succes! Condiția de oprire a fost îndeplinită.` }
      ]);
    } else {
      sounds.playWrong();
      setAttempts(prev => [
        ...prev,
        { val: num, valid: false, prompt: `Intrare ${num}: Eronată! Valoarea trebuie să fie între 1 și 10. Bucla reia citirea!` }
      ]);
    }
    setInputVal('');
  };

  const handleResetValidator = () => {
    sounds.playClick();
    setAttempts([]);
    setIsValidated(false);
    setInputVal('');
  };

  const CHALLENGES = [
    {
      question: 'Care este diferența esențială dintre bucla „do-while” și bucla „while”?',
      code: '// do-while\ndo {\n    cout << "Test";\n} while (conditie);\n\n// while\nwhile (conditie) {\n    cout << "Test";\n}',
      options: [
        { label: 'do-while se execută garantat cel puțin o dată, pe când while poate să nu se execute deloc dacă de la început condiția este falsă', correct: true },
        { label: 'do-while este mai rapidă decât while în limbajul C++', correct: false },
        { label: 'while acceptă doar variabile întregi, iar do-while acceptă și numere reale', correct: false },
        { label: 'Nu există nicio diferență de funcționare, doar de scriere', correct: false }
      ],
      explanation: 'La do-while condiția se evaluează la sfârșitul blocului (post-testată), asigurând că instrucțiunile se execută cel puțin o singură dată!'
    },
    {
      question: 'Care dintre următoarele sintaxe C++ pentru bucla „do-while” este 100% CORECTĂ?',
      code: null,
      options: [
        { label: 'do { cin >> n; } while (n <= 0)', correct: false },
        { label: 'do { cin >> n; } while (n <= 0);', correct: true },
        { label: 'do (n <= 0) { cin >> n; };', correct: false },
        { label: 'while (n <= 0) do { cin >> n; }', correct: false }
      ],
      explanation: 'do-while este singura structură de control din C++ care are OBLIGATORIU punct și virgulă (;) după paranteza rotundă de condiție: do { ... } while (cond);'
    },
    {
      question: 'Dacă x = 100, ce va afișa secvența: do { cout << x; } while (x < 10); ?',
      code: 'int x = 100;\ndo {\n    cout << x;\n} while (x < 10);',
      options: [
        { label: '100', correct: true },
        { label: 'Nimic, deoarece 100 < 10 este fals din prima clipă', correct: false },
        { label: 'Buclă infinită', correct: false },
        { label: 'Eroare de compilare', correct: false }
      ],
      explanation: 'Instrucțiunea din acolade se execută o dată (afișează 100), apoi se testează condiția (100 < 10) care este falsă, iar bucla se oprește imediat!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const isCorrect = CHALLENGES[qIdx].options[optIdx].correct;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback('Corect! ' + CHALLENGES[qIdx].explanation);
    } else {
      sounds.playWrong();
      setChallengeFeedback('Incorect. ' + CHALLENGES[qIdx].explanation);
    }
  };

  const handleNextChallenge = () => {
    sounds.playClick();
    setChallengeFeedback(null);
    if (challengeStep < CHALLENGES.length - 1) {
      setChallengeStep(prev => prev + 1);
    } else {
      setCompletedChallenge(true);
      sounds.playSuccess();
    }
  };

  const handleFinishLevel = () => {
    sounds.playSuccess();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/80 via-emerald-900/80 to-slate-900 p-6 rounded-3xl border border-teal-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Nivelul 2 din 7 • Modulul 4E</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bucla <span className="text-teal-300 font-mono">do ... while</span> &amp; Validarea Datelor de Intrare (pag. 91–93)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Învață când și de ce folosim structura repetitivă cu test final. Testează cum protejează programele împotriva datelor eronate introduse de utilizator!
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-teal-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>+15 XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Educational Concept Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-teal-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-teal-400" />
          <span>Regula de Aur: Execuție Garantată Cel Puțin O Dată &amp; Punctul și Virgula (;)</span>
        </div>

        {/* Visual Syntax Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-4 sm:p-5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-teal-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Sintaxa do-while (Test Final)</span>
            </div>
            <div className="font-mono text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
              <span className="text-purple-400 font-bold">do</span> &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;cout &lt;&lt; <span className="text-amber-300">"Introdu nota (1-10): "</span>;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;cin &gt;&gt; nota;<br />
              &#125; <span className="text-purple-400 font-bold">while</span> (nota &lt; 1 || nota &gt; 10)<span className="text-rose-400 font-black text-sm">;</span>
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Instrucțiunile din interior se execută <strong className="text-teal-300">cel puțin o dată</strong>, permițând utilizatorului să tasteze nota înainte de verificarea condiției.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Comparație: while (Test Inițial)</span>
            </div>
            <div className="font-mono text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
              <span className="text-slate-500">// Dacă nota nu e inițializată, condiția</span><br />
              <span className="text-slate-500">// poate fi testată pe valori reziduale!</span><br />
              <span className="text-purple-400 font-bold">while</span> (nota &lt; 1 || nota &gt; 10) &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;cout &lt;&lt; <span className="text-amber-300">"Introdu nota: "</span>;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;cin &gt;&gt; nota;<br />
              &#125;
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Dacă condiția este falsă la intrare, bucla <strong className="text-amber-300">while nu se execută deloc</strong> (0 iterații)!
            </p>
          </div>
        </div>

        {/* Interactive Input Validator Simulator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>Simulator Interactiv: Citire cu Validare (Nota unui Elev: 1–10)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Introdu intenționat numere greșite (ex: -5, 12, 0) pentru a vedea cum bucla refuză datele invalide!
              </p>
            </div>

            <button
              onClick={handleResetValidator}
              className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetează</span>
            </button>
          </div>

          <form onSubmit={handleSimulateInput} className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isValidated}
                placeholder="Tastează o notă (ex: -3, 15, 8)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isValidated}
              className={`py-2 px-5 rounded-xl text-xs sm:text-sm font-bold font-mono transition flex items-center gap-2 cursor-pointer ${
                isValidated
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/20 active:scale-95'
              }`}
            >
              <span>Trimite Valoare (Enter)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Terminal Console Output */}
          <div className="bg-black/90 border border-slate-800 rounded-xl p-3 sm:p-4 font-mono text-xs max-h-48 overflow-y-auto flex flex-col gap-1.5">
            <div className="text-slate-500">// Execuție consolă: buclă do-while activă</div>
            {attempts.length === 0 && (
              <div className="text-teal-400">&gt; Introdu nota elevului (1..10): _</div>
            )}
            {attempts.map((att, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="text-slate-300">&gt; cin &gt;&gt; nota; // ai introdus {att.val}</div>
                <div className={att.valid ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {att.prompt}
                </div>
                {!att.valid && (
                  <div className="text-teal-300/80 pl-2">
                    while (nota &lt; 1 || nota &gt; 10) este TRUE -&gt; se reia do!
                  </div>
                )}
              </div>
            ))}
            {isValidated && (
              <div className="text-emerald-300 font-bold mt-2 pt-2 border-t border-slate-800">
                [OK] Bucla s-a încheiat! Programul continuă cu nota validă {attempts[attempts.length - 1]?.val}.
              </div>
            )}
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>Verificare Înțelegere: Provocarea do-while ({challengeStep + 1} din {CHALLENGES.length})</span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {CHALLENGES[challengeStep].question}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-teal-300 whitespace-pre">
                  {CHALLENGES[challengeStep].code}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {CHALLENGES[challengeStep].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[challengeStep] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(challengeStep, oIdx)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? opt.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        opt.correct ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {challengeFeedback && (
                <div className={`p-3 rounded-xl text-xs border ${challengeFeedback.startsWith('Corect') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                  {challengeFeedback}
                </div>
              )}

              {selectedAnswers[challengeStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="self-end py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{challengeStep < CHALLENGES.length - 1 ? 'Următoarea Întrebare' : 'Finalizează Nivelul 2'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">Nivelul 2 Finalizat cu Succes!</h4>
              <p className="text-xs text-slate-300 max-w-md">
                Ai asimilat bucla condiționată posterior, cerința de punct și virgulă final și utilizarea sa esențială în validarea datelor.
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>Treci la Nivelul 3: Algoritmul Divizorilor &amp; Numere Prime</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
