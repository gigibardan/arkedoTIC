import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Divide
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface ParityQuiz {
  id: string;
  titleRo: string;
  titleEn: string;
  problemStatementRo: string;
  problemStatementEn: string;
  codeSnippet: string;
  options: {
    labelRo: string;
    labelEn: string;
    isCorrect: boolean;
    explanationRo: string;
    explanationEn: string;
  }[];
}

const PARITY_QUIZZES: ParityQuiz[] = [
  {
    id: 'p1',
    titleRo: 'Condiția Standard de Paritate',
    titleEn: 'Standard Evenness Condition',
    problemStatementRo: 'Care este expresia corectă în C++ pentru a testa dacă numărul întreg n este număr par?',
    problemStatementEn: 'What is the correct C++ expression to test if integer n is an even number?',
    codeSnippet: `if (_______) {
    cout << "Numar PAR";
} else {
    cout << "Numar IMPAR";
}`,
    options: [
      {
        labelRo: 'n % 2 == 0 (restul împărțirii lui n la 2 este egal cu zero)',
        labelEn: 'n % 2 == 0 (remainder of dividing n by 2 equals zero)',
        isCorrect: true,
        explanationRo: 'Corect! Un număr este par dacă se divide exact cu 2, adică n % 2 este 0.',
        explanationEn: 'Correct! A number is even if it divides evenly by 2, meaning n % 2 is 0.'
      },
      {
        labelRo: 'n / 2 == 0 (câtul împărțirii lui n la 2 este zero)',
        labelEn: 'n / 2 == 0 (quotient of dividing n by 2 is zero)',
        isCorrect: false,
        explanationRo: 'Incorect! Operatorul / dă câtul întreg. n / 2 == 0 este adevărat doar pentru 0 și 1.',
        explanationEn: 'Incorrect! Operator / computes integer quotient. n / 2 == 0 is only true for 0 and 1.'
      },
      {
        labelRo: 'n % 2 = 0 (cu un singur semn egal)',
        labelEn: 'n % 2 = 0 (single equals sign)',
        isCorrect: false,
        explanationRo: 'Atenție la capcană! Cu un singur egal este atribuire, ceea ce ar fi greșit într-o condiție.',
        explanationEn: 'Watch out! Single equals is an assignment operator, which is invalid inside an if condition.'
      }
    ]
  },
  {
    id: 'p2',
    titleRo: 'Testarea Imparității',
    titleEn: 'Oddness Testing',
    problemStatementRo: 'Cum putem testa direct dacă un număr n este impar, fără a folosi ramura else?',
    problemStatementEn: 'How can we directly test if number n is odd, without relying on an else branch?',
    codeSnippet: `if (_______) {
    cout << "Numar IMPAR detectat!";
}`,
    options: [
      {
        labelRo: 'n % 2 != 0  (sau  n % 2 == 1)',
        labelEn: 'n % 2 != 0  (or  n % 2 == 1)',
        isCorrect: true,
        explanationRo: 'Excelent! Un număr este impar dacă restul împărțirii la 2 este diferit de zero (!= 0) sau egal cu 1.',
        explanationEn: 'Excellent! A number is odd if the remainder modulo 2 is non-zero (!= 0) or equal to 1.'
      },
      {
        labelRo: 'n % 2 == 2',
        labelEn: 'n % 2 == 2',
        isCorrect: false,
        explanationRo: 'Imposibil! Restul împărțirii la 2 poate fi doar 0 sau 1. Restul nu poate fi niciodată 2.',
        explanationEn: 'Impossible! The remainder modulo 2 can strictly only be 0 or 1; it can never be 2.'
      },
      {
        labelRo: 'n / 2 != 0',
        labelEn: 'n / 2 != 0',
        isCorrect: false,
        explanationRo: 'Operatorul / dă câtul, nu restul!',
        explanationEn: 'Operator / produces the quotient, not the remainder!'
      }
    ]
  },
  {
    id: 'p3',
    titleRo: 'Divizibilitate cu 5 și Ultima Cifră',
    titleEn: 'Divisibility by 5 and the Last Digit',
    problemStatementRo: 'Un număr este divizibil cu 5 dacă ultima sa cifră este 0 sau 5. Cum scriem condiția în C++?',
    problemStatementEn: 'A number is divisible by 5 if its last digit is 0 or 5. How is this written in C++?',
    codeSnippet: `if (_______) {
    cout << "Divizibil cu 5";
}`,
    options: [
      {
        labelRo: 'n % 5 == 0  (sau n % 10 == 0 || n % 10 == 5)',
        labelEn: 'n % 5 == 0  (or n % 10 == 0 || n % 10 == 5)',
        isCorrect: true,
        explanationRo: 'Foarte bine! Fie verificăm direct n % 5 == 0, fie verificăm dacă ultima cifră (obținută cu n % 10) este 0 sau 5.',
        explanationEn: 'Very good! Either test n % 5 == 0 directly, or check whether last digit (n % 10) is 0 or 5.'
      },
      {
        labelRo: 'n % 10 == 0 && n % 10 == 5',
        labelEn: 'n % 10 == 0 && n % 10 == 5',
        isCorrect: false,
        explanationRo: 'Ultima cifră nu poate fi simultan și 0 și 5 (&& ar fi mereu fals)!',
        explanationEn: 'The last digit cannot simultaneously be both 0 and 5 (&& is always false)!'
      },
      {
        labelRo: 'n / 5 == 0',
        labelEn: 'n / 5 == 0',
        isCorrect: false,
        explanationRo: 'Divizibilitatea depinde de restul împărțirii (%), nu de cât (/).',
        explanationEn: 'Divisibility relies on division remainder (%), not quotient (/).'
      }
    ]
  },
  {
    id: 'p4',
    titleRo: 'Număr de Exact Două Cifre',
    titleEn: 'Exact Two-Digit Number',
    problemStatementRo: 'Cum verificăm dacă un număr natural n are exact 2 cifre (adică este între 10 și 99 inclusiv)?',
    problemStatementEn: 'How do we check if a natural number n has exactly 2 digits (between 10 and 99 inclusive)?',
    codeSnippet: `if (_______) {
    cout << "Numar de 2 cifre!";
}`,
    options: [
      {
        labelRo: 'n >= 10 && n <= 99',
        labelEn: 'n >= 10 && n <= 99',
        isCorrect: true,
        explanationRo: 'Perfect! Intervalul numerelor naturale de 2 cifre începe la 10 și se termină la 99.',
        explanationEn: 'Perfect! The range of 2-digit natural numbers spans from 10 to 99 inclusive.'
      },
      {
        labelRo: '10 <= n <= 99',
        labelEn: '10 <= n <= 99',
        isCorrect: false,
        explanationRo: 'Capcana de sintaxă C++! Scrierea înlănțuită nu funcționează corect în C++ și este evaluată greșit.',
        explanationEn: 'C++ syntax trap! Chained inequalities are evaluated left-to-right into boolean booleans and fail.'
      },
      {
        labelRo: 'n > 9 || n < 100',
        labelEn: 'n > 9 || n < 100',
        isCorrect: false,
        explanationRo: 'Dacă folosim || (SAU), orice număr din univers (chiar și 5 sau 500) ar satisface condiția!',
        explanationEn: 'If we use || (OR), every number in the universe satisfies at least one condition!'
      }
    ]
  }
];

export const DecLevel4_ParityAndModuloDecision: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Interactive Live Number Inspector
  const [userNumberInput, setUserNumberInput] = useState<number>(42);

  const quotient = Math.floor(userNumberInput / 2);
  const remainder = userNumberInput % 2;
  const isEven = remainder === 0;

  const currentQuiz = PARITY_QUIZZES[currentIdx];
  const isFinished = currentIdx >= PARITY_QUIZZES.length;

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const opt = currentQuiz.options[idx];
    if (opt.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 25);
      setFeedback({
        isCorrect: true,
        text: lang === 'ro' ? `Corect! ${opt.explanationRo}` : `Correct! ${opt.explanationEn}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: lang === 'ro' ? `Mai încearcă! ${opt.explanationRo}` : `Try again! ${opt.explanationEn}`
      });
    }
  };

  const handleNext = () => {
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/60 p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              {lang === 'ro' ? 'Nivelul 4 din 7 • Modulul 4C' : 'Level 4 of 7 • Module 4C'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Manual Art Klett pag. 78' : 'Art Klett Textbook p. 78'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Divide className="w-6 h-6 text-emerald-400" />
            <span>
              {lang === 'ro'
                ? 'Problema Parității & Divizibilității (n % 2 == 0)'
                : 'Parity & Divisibility Algorithms (n % 2 == 0)'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'ro'
              ? 'Algoritmul fundamental din manualul de clasa a 7-a: află cum verificăm paritatea, ultima cifră și divizibilitatea folosind operatorul modulo (%)!'
              : 'The fundamental algorithm from 7th grade curriculum: discover how to verify parity, extract last digits, and check divisibility with modulo (%)!'}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">
            {lang === 'ro' ? 'Scor Nivel 4:' : 'Level 4 Score:'}
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Live Parity Inspector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              🔢
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {lang === 'ro'
                  ? 'Laborator Vizual de Testare: Teorema Împărțirii cu Rest'
                  : 'Visual Testing Lab: Division with Remainder Theorem'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ro'
                  ? 'Tastează orice număr natural sau alege una dintre valorile rapide de mai jos:'
                  : 'Type any natural number or select one of the presets below:'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[42, 17, 100, 35, 7, 88].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setUserNumberInput(num);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* User Input & Calculation Breakdown */}
          <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                {lang === 'ro' ? 'Introdu număr n:' : 'Enter number n:'}
              </span>
              <input
                type="number"
                min="0"
                max="9999"
                value={userNumberInput}
                onChange={(e) => setUserNumberInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 bg-slate-900 border border-emerald-500/50 rounded-xl px-2.5 py-1 text-right text-emerald-300 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-slate-300">
              <div className="text-[11px] text-slate-400">
                {lang === 'ro' ? '// Calcul matematic:' : '// Mathematical breakdown:'}
              </div>
              <div>
                {lang === 'ro' ? 'Câtul împărțirii: ' : 'Quotient: '}
                <span className="text-cyan-400 font-bold">{userNumberInput} / 2 = {quotient}</span>
              </div>
              <div>
                {lang === 'ro' ? 'Restul împărțirii: ' : 'Remainder: '}
                <span className="text-amber-400 font-bold">{userNumberInput} % 2 = {remainder}</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                {lang === 'ro' ? 'Formula Euclid: ' : 'Euclidean Formula: '}
                {userNumberInput} = 2 &times; {quotient} + {remainder}
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400">
                {lang === 'ro' ? '// Codul C++ din manual:' : '// Textbook C++ code:'}
              </span>
              <pre className="text-teal-300 mt-1">
{`if (n % 2 == 0)
    cout << "${lang === 'ro' ? 'Numar par' : 'Even number'}";
else
    cout << "${lang === 'ro' ? 'Numar impar' : 'Odd number'}";`}
              </pre>
            </div>
          </div>

          {/* Decision Buckets Display */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Even Bucket */}
            <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center justify-between ${
              isEven
                ? 'bg-emerald-950/60 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-105 ring-2 ring-emerald-500/40'
                : 'bg-slate-950/40 border-slate-800 opacity-40'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-2">
                🟢
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {lang === 'ro' ? 'COȘUL NUMERELOR PARE' : 'EVEN NUMBERS BUCKET'}
                </h4>
                <div className="text-xs font-mono text-emerald-300 mt-1">
                  conditie: n % 2 == 0
                </div>
              </div>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                isEven ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {isEven
                  ? (lang === 'ro' ? `Numărul ${userNumberInput} este PAR!` : `Number ${userNumberInput} is EVEN!`)
                  : (lang === 'ro' ? 'Inactiv' : 'Inactive')}
              </div>
            </div>

            {/* Odd Bucket */}
            <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center justify-between ${
              !isEven
                ? 'bg-amber-950/60 border-amber-400 shadow-xl shadow-amber-500/20 scale-105 ring-2 ring-amber-500/40'
                : 'bg-slate-950/40 border-slate-800 opacity-40'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-2">
                🟡
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {lang === 'ro' ? 'COȘUL NUMERELOR IMPARE' : 'ODD NUMBERS BUCKET'}
                </h4>
                <div className="text-xs font-mono text-amber-300 mt-1">
                  conditie: n % 2 != 0
                </div>
              </div>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                !isEven ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {!isEven
                  ? (lang === 'ro' ? `Numărul ${userNumberInput} este IMPAR!` : `Number ${userNumberInput} is ODD!`)
                  : (lang === 'ro' ? 'Inactiv' : 'Inactive')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                {lang === 'ro'
                  ? `Provocarea ${currentIdx + 1}/${PARITY_QUIZZES.length}: ${currentQuiz.titleRo}`
                  : `Challenge ${currentIdx + 1}/${PARITY_QUIZZES.length}: ${currentQuiz.titleEn}`}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro'
                ? `Întrebarea ${currentIdx + 1}/${PARITY_QUIZZES.length}`
                : `Question ${currentIdx + 1}/${PARITY_QUIZZES.length}`}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <div className="text-slate-300 text-xs sm:text-sm mb-3 font-sans leading-relaxed">
              {lang === 'ro' ? currentQuiz.problemStatementRo : currentQuiz.problemStatementEn}
            </div>
            <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto text-xs">
              {currentQuiz.codeSnippet}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            {lang === 'ro' ? 'Selectează expresia corectă:' : 'Select the correct condition:'}
          </div>

          <div className="flex flex-col gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left font-mono transition flex items-start gap-3 cursor-pointer ${
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
                  <div className="text-xs sm:text-sm leading-relaxed font-sans">
                    {lang === 'ro' ? opt.labelRo : opt.labelEn}
                  </div>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium leading-relaxed font-sans">
                  {feedback.text}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md font-sans"
              >
                <span>{lang === 'ro' ? 'Următoarea Problemă' : 'Next Problem'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            🏆
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro' ? 'Expert în Paritate & Divizibilitate!' : 'Parity & Divisibility Expert!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              {lang === 'ro' ? (
                <>Stăpânești la perfecție utilizarea operatorului <code className="text-emerald-400 font-bold">%</code> pentru a testa paritatea, ultima cifră și apartenența la intervale numerice!</>
              ) : (
                <>You have mastered operator <code className="text-emerald-400 font-bold">%</code> to test parity, last-digit properties, and bounded numerical ranges!</>
              )}
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-emerald-400 font-mono font-bold text-sm">
            {lang === 'ro' ? `Scor obținut: +${score} XP` : `Score Earned: +${score} XP`}
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>
              {lang === 'ro'
                ? 'Treci la Nivelul 5: Probleme Clasice (Maxim, Minim & Triunghi)'
                : 'Advance to Level 5: Classic Algorithms (Max, Min & Triangle)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
