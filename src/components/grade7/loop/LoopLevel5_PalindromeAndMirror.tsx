import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Split,
  Eye,
  RotateCcw,
  Check,
  ShieldCheck,
  Code
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

const PALINDROME_QUIZZES = [
  {
    id: 'pq1',
    titleRo: 'Formula de Construire a Oglinditului',
    titleEn: 'Formula for Building the Reversed Number',
    codeSnippet: 'int ogl = 0;\nwhile (n > 0) {\n    ogl = _______;\n    n = n / 10;\n}',
    questionRo: 'Care este formula matematică pentru a adăuga ultima cifră la sfârșitul numărului oglindit?',
    questionEn: 'What is the mathematical formula to append the last digit to the end of the reversed number?',
    optionsRo: [
      'ogl = ogl * 10 + n % 10;',
      'ogl = ogl + n % 10;',
      'ogl = n % 10;',
      'ogl = ogl * 10;'
    ],
    optionsEn: [
      'ogl = ogl * 10 + n % 10;',
      'ogl = ogl + n % 10;',
      'ogl = n % 10;',
      'ogl = ogl * 10;'
    ],
    correctIdx: 0,
    explanationRo: 'Înmulțirea cu 10 (ogl * 10) mută cifrele existente spre stânga (le crește rangul cu un ordin), făcând loc noii cifre (n % 10) la unități.',
    explanationEn: 'Multiplying by 10 (ogl * 10) shifts existing digits one rank to the left, making room for the new units digit (n % 10).'
  },
  {
    id: 'pq2',
    titleRo: 'De ce Salvăm o Copie a lui n?',
    titleEn: 'Why Do We Save a Copy of n?',
    codeSnippet: 'int clona = n;\nwhile (n > 0) {\n    ogl = ogl * 10 + n % 10;\n    n = n / 10;\n}\nif (clona == ogl) cout << "Palindrom";',
    questionRo: 'De ce este obligatoriu să salvăm clona = n înainte de buclă?',
    questionEn: 'Why is it mandatory to save clona = n before entering the loop?',
    optionsRo: [
      'Deoarece bucla while taie cifrele succesiv și la final n devine MEREU 0!',
      'Pentru a ocupa mai multă memorie RAM.',
      'C++ nu permite compararea lui ogl cu n direct.',
      'Pentru că numerele palindrom au nevoie de două variabile identice.'
    ],
    optionsEn: [
      'Because the while loop chops digits sequentially and at the end n ALWAYS becomes 0!',
      'To occupy more RAM memory.',
      'C++ does not permit comparing ogl directly with n.',
      'Because palindrome numbers require two identical variables.'
    ],
    correctIdx: 0,
    explanationRo: 'Execuția buclei distruge valoarea lui n prin împărțiri la 10 până ajunge la 0. Fără variabila clona, am compara mereu 0 == ogl!',
    explanationEn: 'Executing the loop degrades the value of n via divisions by 10 until it hits 0. Without the clone variable, we would always compare 0 == ogl!'
  },
  {
    id: 'pq3',
    titleRo: 'Verificare Numere Palindrom',
    titleEn: 'Palindrome Number Verification',
    codeSnippet: '12321, 5005, 1234, 7',
    questionRo: 'Care dintre următoarele numere NU este un număr palindrom?',
    questionEn: 'Which of the following numbers is NOT a palindrome?',
    optionsRo: [
      '1234 (oglinditul său este 4321, deci 1234 != 4321)',
      '12321 (oglinditul este 12321)',
      '5005 (oglinditul este 5005)',
      '7 (orice număr de o singură cifră este palindrom)'
    ],
    optionsEn: [
      '1234 (its reversed number is 4321, so 1234 != 4321)',
      '12321 (its reversed number is 12321)',
      '5005 (its reversed number is 5005)',
      '7 (any single-digit number is a palindrome)'
    ],
    correctIdx: 0,
    explanationRo: '1234 citit invers este 4321. Deoarece cele două numere diferă, 1234 nu este palindrom.',
    explanationEn: '1234 read backwards is 4321. Since the two numbers differ, 1234 is not a palindrome.'
  }
];

export const LoopLevel5_PalindromeAndMirror: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Interactive Live Mirror Chamber
  const [inputNum, setInputNum] = useState<number>(12321);

  const calculateMirror = (num: number) => {
    let original = Math.abs(num);
    let n = original;
    let ogl = 0;
    const steps: { nBefore: number; digit: number; oglAfter: number }[] = [];

    while (n > 0) {
      const d = n % 10;
      ogl = ogl * 10 + d;
      n = Math.floor(n / 10);
      steps.push({ nBefore: n, digit: d, oglAfter: ogl });
    }

    const isPal = original === ogl;
    return { original, ogl, isPal, steps };
  };

  const mirrorResult = calculateMirror(inputNum);
  const currentQuiz = PALINDROME_QUIZZES[currentIdx];
  const isFinished = currentIdx >= PALINDROME_QUIZZES.length;

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const isCorrect = idx === currentQuiz.correctIdx;
    const explanation = lang === 'ro' ? currentQuiz.explanationRo : currentQuiz.explanationEn;
    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 35);
      setFeedback({
        isCorrect: true,
        text: `${lang === 'ro' ? 'Corect!' : 'Correct!'} ${explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `${lang === 'ro' ? 'Incorect.' : 'Incorrect.'} ${explanation}`
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
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/60 p-5 sm:p-6 rounded-3xl border-2 border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              {lang === 'ro' ? 'Nivelul 5 din 7 • Modulul 4D' : 'Level 5 of 7 • Module 4D'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Manual Art Klett pag. 84–85' : 'Art Klett Textbook p. 84–85'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span>
              {lang === 'ro'
                ? 'Oglinditul Numărului & Numărul Palindrom'
                : 'Reversed Number & Palindrome Numbers'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'ro'
              ? 'Descoperă magia algoritmului de oglindire (ogl = ogl * 10 + n % 10) și verificarea dacă un număr se citește identic în ambele sensuri!'
              : 'Discover the magic of reversing digits (ogl = ogl * 10 + n % 10) and checking whether a number reads identically forwards and backwards!'}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">{lang === 'ro' ? 'Scor Nivel 5:' : 'Level 5 Score:'}</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-purple-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Palindrome Chamber */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              🪞
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {lang === 'ro'
                  ? 'Camera Oglinzilor: Simulatorul Vizual de Palindrom'
                  : 'Hall of Mirrors: Visual Palindrome Simulator'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ro'
                  ? 'Tastează orice număr sau alege una dintre valorile clasice din manual:'
                  : 'Type any number or pick one of the classic textbook examples:'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[12321, 5005, 1234, 404, 98789, 720].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setInputNum(num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                  inputNum === num
                    ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Mirror Reflection Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left: Original Number clona */}
          <div className="md:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
              {lang === 'ro' ? 'Număr Original (clona)' : 'Original Number (clona)'}
            </span>
            <input
              type="number"
              min="1"
              max="99999999"
              value={inputNum}
              onChange={(e) => setInputNum(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-36 bg-slate-900 border border-purple-500/50 rounded-xl px-3 py-1.5 text-center text-white font-black font-mono text-xl focus:outline-none"
            />
            <span className="text-[11px] font-mono text-slate-500 mt-2">
              {lang === 'ro' ? 'Citit de la stânga la dreapta' : 'Read from left to right'}
            </span>
          </div>

          {/* Center: The Glowing Magic Mirror & Formula */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-500/60 flex items-center justify-center text-2xl mb-1 shadow-lg shadow-purple-500/20">
              🪞
            </div>
            <div className="font-mono text-xs text-purple-300 font-bold">
              ogl = ogl * 10 + n % 10;
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              {lang === 'ro' ? 'Reflexie matematică' : 'Mathematical reflection'}
            </div>
          </div>

          {/* Right: Mirror Number ogl */}
          <div className="md:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
              {lang === 'ro' ? 'Număr Oglindit (ogl)' : 'Reversed Number (ogl)'}
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300 bg-slate-900 px-4 py-1.5 rounded-xl border border-cyan-500/30">
              {mirrorResult.ogl}
            </div>
            <span className="text-[11px] font-mono text-slate-500 mt-2">
              {lang === 'ro' ? 'Citit de la dreapta la stânga' : 'Read from right to left'}
            </span>
          </div>
        </div>

        {/* Palindrome Verdict Box */}
        <div className={`mt-5 p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
          mirrorResult.isPal
            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20'
            : 'bg-amber-950/60 border-amber-500 text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{mirrorResult.isPal ? '✨' : '⚠️'}</span>
            <div>
              <div className="text-sm font-bold font-mono">
                {mirrorResult.isPal
                  ? (lang === 'ro' ? 'NUMĂR PALINDROM VALID!' : 'VALID PALINDROME NUMBER!')
                  : (lang === 'ro' ? 'NU ESTE PALINDROM' : 'NOT A PALINDROME')}
              </div>
              <div className="text-xs text-slate-300">
                {lang === 'ro' ? 'Condiție C++:' : 'C++ Condition:'}{' '}
                <code className="font-mono">{`if (${mirrorResult.original} == ${mirrorResult.ogl})`}</code> &rarr;{' '}
                <strong>
                  {mirrorResult.isPal
                    ? (lang === 'ro' ? 'ADEVĂRAT (true)' : 'TRUE (true)')
                    : (lang === 'ro' ? 'FALS (false)' : 'FALSE (false)')}
                </strong>
              </div>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            mirrorResult.isPal
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-amber-500 text-slate-950 border-amber-400'
          }`}>
            {mirrorResult.isPal
              ? (lang === 'ro' ? 'Egalitate 100%' : '100% Match')
              : (lang === 'ro' ? 'Diferit' : 'Different')}
          </span>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                {lang === 'ro'
                  ? `Provocarea ${currentIdx + 1}/${PALINDROME_QUIZZES.length}: ${currentQuiz.titleRo}`
                  : `Challenge ${currentIdx + 1}/${PALINDROME_QUIZZES.length}: ${currentQuiz.titleEn}`}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro' ? `Întrebarea ${currentIdx + 1}/${PALINDROME_QUIZZES.length}` : `Question ${currentIdx + 1}/${PALINDROME_QUIZZES.length}`}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <pre className="text-purple-300 overflow-x-auto">
              {currentQuiz.codeSnippet}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            {lang === 'ro' ? currentQuiz.questionRo : currentQuiz.questionEn}
          </div>

          <div className="flex flex-col gap-3">
            {(lang === 'ro' ? currentQuiz.optionsRo : currentQuiz.optionsEn).map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? idx === currentQuiz.correctIdx
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : selectedOptIdx !== null && idx === currentQuiz.correctIdx
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? idx === currentQuiz.correctIdx
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-xs sm:text-sm leading-relaxed font-sans">
                    {opt}
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
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md font-sans"
              >
                <span>{lang === 'ro' ? 'Următoarea Provocare' : 'Next Challenge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-purple-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            🪞
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro' ? 'Maestru al Algoritmului Palindrom!' : 'Master of the Palindrome Algorithm!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              {lang === 'ro' ? (
                <>Ai înțeles perfect de ce salvăm <code className="text-purple-300 font-bold">clona = n</code> și cum se calculează inversul cifrelor în C++!</>
              ) : (
                <>You have fully mastered why we preserve <code className="text-purple-300 font-bold">clona = n</code> and how to compute mirrored digits in C++!</>
              )}
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-purple-400 font-mono font-bold text-sm">
            {lang === 'ro' ? `Scor obținut: +${score} XP` : `Earned Score: +${score} XP`}
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>
              {lang === 'ro'
                ? 'Treci la Nivelul 6: Laborator Live Code::Blocks (Cifre Pare)'
                : 'Proceed to Level 6: Live Code::Blocks Lab (Even Digits)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
