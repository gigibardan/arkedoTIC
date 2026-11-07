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
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

export const StemLevel2_DoWhileValidation: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Input Validation Simulator State
  const [inputVal, setInputVal] = useState<string>('');
  const [attempts, setAttempts] = useState<{ val: number; valid: boolean; promptRo: string; promptEn: string }[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [validationTarget] = useState<{ min: number; max: number }>({ min: 1, max: 10 });

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
        {
          val: num,
          valid: true,
          promptRo: `Intrare ${num}: Validată cu succes! Condiția de oprire a fost îndeplinită.`,
          promptEn: `Input ${num}: Validated successfully! Exit condition was fulfilled.`
        }
      ]);
    } else {
      sounds.playWrong();
      setAttempts(prev => [
        ...prev,
        {
          val: num,
          valid: false,
          promptRo: `Intrare ${num}: Eronată! Valoarea trebuie să fie între 1 și 10. Bucla reia citirea!`,
          promptEn: `Input ${num}: Invalid! Value must be between 1 and 10. Loop repeats reading!`
        }
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
      questionRo: 'Care este diferența esențială dintre bucla „do-while” și bucla „while”?',
      questionEn: 'What is the essential difference between a "do-while" loop and a "while" loop?',
      code: '// do-while\ndo {\n    cout << "Test";\n} while (conditie);\n\n// while\nwhile (conditie) {\n    cout << "Test";\n}',
      optionsRo: [
        { label: 'do-while se execută garantat cel puțin o dată, pe când while poate să nu se execute deloc dacă de la început condiția este falsă', correct: true },
        { label: 'do-while este mai rapidă decât while în limbajul C++', correct: false },
        { label: 'while acceptă doar variabile întregi, iar do-while acceptă și numere reale', correct: false },
        { label: 'Nu există nicio diferență de funcționare, doar de scriere', correct: false }
      ],
      optionsEn: [
        { label: 'do-while is guaranteed to execute at least once, while a while loop might execute 0 times if condition is initially false', correct: true },
        { label: 'do-while is faster than while in C++', correct: false },
        { label: 'while only accepts integers, whereas do-while accepts real numbers', correct: false },
        { label: 'There is no functional difference, just syntax', correct: false }
      ],
      explanationRo: 'La do-while condiția se evaluează la sfârșitul blocului (post-testată), asigurând că instrucțiunile se execută cel puțin o singură dată!',
      explanationEn: 'In do-while, the condition is evaluated at the end of the block (post-tested), ensuring statements run at least once!'
    },
    {
      questionRo: 'Care dintre următoarele sintaxe C++ pentru bucla „do-while” este 100% CORECTĂ?',
      questionEn: 'Which of the following C++ syntaxes for a "do-while" loop is 100% CORRECT?',
      code: null,
      optionsRo: [
        { label: 'do { cin >> n; } while (n <= 0)', correct: false },
        { label: 'do { cin >> n; } while (n <= 0);', correct: true },
        { label: 'do (n <= 0) { cin >> n; };', correct: false },
        { label: 'while (n <= 0) do { cin >> n; }', correct: false }
      ],
      optionsEn: [
        { label: 'do { cin >> n; } while (n <= 0)', correct: false },
        { label: 'do { cin >> n; } while (n <= 0);', correct: true },
        { label: 'do (n <= 0) { cin >> n; };', correct: false },
        { label: 'while (n <= 0) do { cin >> n; }', correct: false }
      ],
      explanationRo: 'do-while este singura structură de control din C++ care are OBLIGATORIU punct și virgulă (;) după paranteza rotundă de condiție: do { ... } while (cond);',
      explanationEn: 'do-while is the only C++ control structure that MANDATES a semicolon (;) right after the condition parenthesis: do { ... } while (cond);'
    },
    {
      questionRo: 'Dacă x = 100, ce va afișa secvența: do { cout << x; } while (x < 10); ?',
      questionEn: 'If x = 100, what will the snippet output: do { cout << x; } while (x < 10); ?',
      code: 'int x = 100;\ndo {\n    cout << x;\n} while (x < 10);',
      optionsRo: [
        { label: '100', correct: true },
        { label: 'Nimic, deoarece 100 < 10 este fals din prima clipă', correct: false },
        { label: 'Buclă infinită', correct: false },
        { label: 'Eroare de compilare', correct: false }
      ],
      optionsEn: [
        { label: '100', correct: true },
        { label: 'Nothing, because 100 < 10 is false initially', correct: false },
        { label: 'Infinite loop', correct: false },
        { label: 'Compilation error', correct: false }
      ],
      explanationRo: 'Instrucțiunea din acolade se execută o dată (afișează 100), apoi se testează condiția (100 < 10) care este falsă, iar bucla se oprește imediat!',
      explanationEn: 'The body executes once (outputs 100), then checks condition (100 < 10) which is false, halting the loop immediately!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const opts = lang === 'ro' ? CHALLENGES[qIdx].optionsRo : CHALLENGES[qIdx].optionsEn;
    const isCorrect = opts[optIdx].correct;
    const explanation = lang === 'ro' ? CHALLENGES[qIdx].explanationRo : CHALLENGES[qIdx].explanationEn;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback((lang === 'ro' ? 'Corect! ' : 'Correct! ') + explanation);
    } else {
      sounds.playWrong();
      setChallengeFeedback((lang === 'ro' ? 'Incorect. ' : 'Incorrect. ') + explanation);
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
              <span>{lang === 'ro' ? 'Nivelul 2 din 7 • Modulul 4E' : 'Level 2 of 7 • Module 4E'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro' ? (
                <>Bucla <span className="text-teal-300 font-mono">do ... while</span> &amp; Validarea Datelor de Intrare (pag. 91–93)</>
              ) : (
                <>The <span className="text-teal-300 font-mono">do ... while</span> Loop &amp; Input Data Validation (p. 91–93)</>
              )}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro'
                ? 'Învață când și de ce folosim structura repetitivă cu test final. Testează cum protejează programele împotriva datelor eronate introduse de utilizator!'
                : 'Learn when and why to use post-tested loops. Test how programs protect themselves against invalid input entered by users!'}
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
          <span>
            {lang === 'ro'
              ? 'Regula de Aur: Execuție Garantată Cel Puțin O Dată & Punctul și Virgula (;)'
              : 'Golden Rule: Guaranteed At Least Once Execution & Semicolon (;)'}
          </span>
        </div>

        {/* Visual Syntax Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-4 sm:p-5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-teal-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>{lang === 'ro' ? 'Sintaxa do-while (Test Final)' : 'do-while Syntax (Post-Test)'}</span>
            </div>
            <div className="font-mono text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
              <span className="text-purple-400 font-bold">do</span> &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;cout &lt;&lt; <span className="text-amber-300">{lang === 'ro' ? '"Introdu nota (1-10): "' : '"Enter grade (1-10): "'}</span>;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;cin &gt;&gt; nota;<br />
              &#125; <span className="text-purple-400 font-bold">while</span> (nota &lt; 1 || nota &gt; 10)<span className="text-rose-400 font-black text-sm">;</span>
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {lang === 'ro'
                ? 'Instrucțiunile din interior se execută cel puțin o dată, permițând utilizatorului să tasteze nota înainte de verificarea condiției.'
                : 'Statements inside execute at least once, allowing user input before verifying validity conditions.'}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ro' ? 'Comparație: while (Test Inițial)' : 'Comparison: while (Pre-Test)'}</span>
            </div>
            <div className="font-mono text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
              <span className="text-slate-500">{lang === 'ro' ? '// Dacă nota nu e inițializată, condiția' : '// If grade is uninitialized, condition'}</span><br />
              <span className="text-slate-500">{lang === 'ro' ? '// poate fi testată pe valori reziduale!' : '// may evaluate undefined memory junk!'}</span><br />
              <span className="text-purple-400 font-bold">while</span> (nota &lt; 1 || nota &gt; 10) &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;cout &lt;&lt; <span className="text-amber-300">{lang === 'ro' ? '"Introdu nota: "' : '"Enter grade: "'}</span>;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;cin &gt;&gt; nota;<br />
              &#125;
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {lang === 'ro'
                ? 'Dacă condiția este falsă la intrare, bucla while nu se execută deloc (0 iterații)!'
                : 'If the condition is initially false, while does not execute at all (0 iterations)!'}
            </p>
          </div>
        </div>

        {/* Interactive Input Validator Simulator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>
                  {lang === 'ro'
                    ? 'Simulator Interactiv: Citire cu Validare (Nota unui Elev: 1–10)'
                    : 'Interactive Simulator: Validated Input (Student Grade: 1–10)'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ro'
                  ? 'Introdu intenționat numere greșite (ex: -5, 12, 0) pentru a vedea cum bucla refuză datele invalide!'
                  : 'Deliberately enter invalid numbers (e.g., -5, 12, 0) to observe how the loop rejects invalid data!'}
              </p>
            </div>

            <button
              onClick={handleResetValidator}
              className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Resetează' : 'Reset'}</span>
            </button>
          </div>

          <form onSubmit={handleSimulateInput} className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isValidated}
                placeholder={lang === 'ro' ? 'Tastează o notă (ex: -3, 15, 8)...' : 'Type a grade (e.g. -3, 15, 8)...'}
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
              <span>{lang === 'ro' ? 'Trimite Valoare (Enter)' : 'Submit Value (Enter)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Terminal Console Output */}
          <div className="bg-black/90 border border-slate-800 rounded-xl p-3 sm:p-4 font-mono text-xs max-h-48 overflow-y-auto flex flex-col gap-1.5">
            <div className="text-slate-500">
              {lang === 'ro' ? '// Execuție consolă: buclă do-while activă' : '// Console run: active do-while loop'}
            </div>
            {attempts.length === 0 && (
              <div className="text-teal-400">
                &gt; {lang === 'ro' ? 'Introdu nota elevului (1..10): _' : 'Enter student grade (1..10): _'}
              </div>
            )}
            {attempts.map((att, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="text-slate-300">
                  &gt; cin &gt;&gt; nota; // {lang === 'ro' ? `ai introdus ${att.val}` : `you entered ${att.val}`}
                </div>
                <div className={att.valid ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {lang === 'ro' ? att.promptRo : att.promptEn}
                </div>
                {!att.valid && (
                  <div className="text-teal-300/80 pl-2">
                    {lang === 'ro'
                      ? 'while (nota < 1 || nota > 10) este TRUE -> se reia do!'
                      : 'while (nota < 1 || nota > 10) is TRUE -> do repeats!'}
                  </div>
                )}
              </div>
            ))}
            {isValidated && (
              <div className="text-emerald-300 font-bold mt-2 pt-2 border-t border-slate-800">
                {lang === 'ro'
                  ? `[OK] Bucla s-a încheiat! Programul continuă cu nota validă ${attempts[attempts.length - 1]?.val}.`
                  : `[OK] Loop ended! Program proceeds with valid grade ${attempts[attempts.length - 1]?.val}.`}
              </div>
            )}
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>
                {lang === 'ro'
                  ? `Verificare Înțelegere: Provocarea do-while (${challengeStep + 1} din ${CHALLENGES.length})`
                  : `Comprehension Check: do-while Challenge (${challengeStep + 1} of ${CHALLENGES.length})`}
              </span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {lang === 'ro' ? CHALLENGES[challengeStep].questionRo : CHALLENGES[challengeStep].questionEn}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-teal-300 whitespace-pre">
                  {CHALLENGES[challengeStep].code}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {(lang === 'ro' ? CHALLENGES[challengeStep].optionsRo : CHALLENGES[challengeStep].optionsEn).map((opt, oIdx) => {
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
                <div className={`p-3 rounded-xl text-xs border ${challengeFeedback.startsWith('Corect') || challengeFeedback.startsWith('Correct') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                  {challengeFeedback}
                </div>
              )}

              {selectedAnswers[challengeStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="self-end py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {challengeStep < CHALLENGES.length - 1
                      ? (lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question')
                      : (lang === 'ro' ? 'Finalizează Nivelul 2' : 'Complete Level 2')}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">
                {lang === 'ro' ? 'Nivelul 2 Finalizat cu Succes!' : 'Level 2 Successfully Completed!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {lang === 'ro'
                  ? 'Ai asimilat bucla condiționată posterior, cerința de punct și virgulă final și utilizarea sa esențială în validarea datelor.'
                  : 'You mastered post-tested loops, the mandatory semicolon, and its key role in user data validation.'}
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {lang === 'ro'
                    ? 'Treci la Nivelul 3: Algoritmul Divizorilor & Numere Prime'
                    : 'Proceed to Level 3: Divisors Algorithm & Prime Numbers'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
