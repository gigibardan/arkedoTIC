import React, { useState } from 'react';
import {
  Binary,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Hash,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A3Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface StepMemory {
  step: number;
  nBefore: number;
  digit: number;
  nAfter: number;
  mirrored: number;
  sum: number;
  count: number;
}

export const A3Level4_DigitLoopAlgorithmsLab: React.FC<A3Level4Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const [inputN, setInputN] = useState<number>(12321);
  const [memoryTable, setMemoryTable] = useState<StepMemory[]>([]);
  const [finalMirrored, setFinalMirrored] = useState<number | null>(null);
  const [isPalindrome, setIsPalindrome] = useState<boolean | null>(null);
  const [hasDissected, setHasDissected] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const runDissection = () => {
    sounds.playClick();
    const table: StepMemory[] = [];
    let temp = Math.abs(inputN);
    const original = temp;
    let ogl = 0;
    let sum = 0;
    let count = 0;
    let step = 1;

    if (temp === 0) {
      table.push({
        step: 1,
        nBefore: 0,
        digit: 0,
        nAfter: 0,
        mirrored: 0,
        sum: 0,
        count: 1
      });
      ogl = 0;
    } else {
      while (temp > 0) {
        const d = temp % 10;
        const nextTemp = Math.floor(temp / 10);
        ogl = ogl * 10 + d;
        sum += d;
        count++;

        table.push({
          step,
          nBefore: temp,
          digit: d,
          nAfter: nextTemp,
          mirrored: ogl,
          sum,
          count
        });

        temp = nextTemp;
        step++;
      }
    }

    setMemoryTable(table);
    setFinalMirrored(ogl);
    setIsPalindrome(original === ogl);
    setHasDissected(true);
    sounds.playCorrect();
  };

  const isLevelCompleted =
    hasDissected &&
    finalMirrored !== null &&
    q1Answer === 'b' &&
    q2Answer === 'a';

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
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-purple-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-400/30 text-purple-300">
              <Binary className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  {lang === 'ro' ? 'Modulul 3C • Nivelul 4 din 7' : 'Module 3C • Level 4 of 7'}
                </span>
                <span className="text-xs text-purple-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 74–75' : 'Art Klett Textbook pp. 74–75'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Prelucrarea Cifrelor cu Bucle while: Oglindit, Palindrom & Statistici'
                  : 'Digit Algorithms with while Loops: Reversal, Palindromes & Statistics'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-purple-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 4: Cifre cu while' : 'Level 4: Digits with while'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-purple-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'Spre deosebire de numerele cu număr fix de cifre, bucla while (n != 0) poate prelucra un număr cu oricâte cifre (1, 5, 9 sau 18 cifre)! La fiecare pas, extragem ultima cifră cu % 10 și o eliminăm cu / 10.'
            : 'Unlike fixed-size variables, the while (n != 0) paradigm seamlessly handles numbers of arbitrary length (1, 5, 9, or 18 digits)! At each iteration, we harvest the trailing digit via % 10 and truncate it via / 10.'}
        </p>
      </div>

      {/* Dissection Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Presets */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Hash className="w-4 h-4 text-cyan-400" />
            {lang === 'ro' ? 'Configurare Număr Arbitrar' : 'Arbitrary Number Configuration'}
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 flex justify-between">
              <span>{lang === 'ro' ? 'Introdu numărul natural n:' : 'Enter natural number n:'}</span>
              <span className="font-mono text-cyan-300 font-bold">{inputN}</span>
            </label>
            <input
              type="number"
              value={inputN}
              onChange={(e) => {
                setInputN(Number(e.target.value));
                setHasDissected(false);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-cyan-300 text-sm"
            />
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
              {lang === 'ro' ? 'Numere interesante de testat:' : 'Sample test numbers:'}
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => {
                  setInputN(12321);
                  setHasDissected(false);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                {lang === 'ro' ? '12321 (Palindrom)' : '12321 (Palindrome)'}
              </button>
              <button
                onClick={() => {
                  setInputN(48291);
                  setHasDissected(false);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                {lang === 'ro' ? '48291 (5 Cifre)' : '48291 (5 Digits)'}
              </button>
              <button
                onClick={() => {
                  setInputN(50005);
                  setHasDissected(false);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                {lang === 'ro' ? '50005 (Simetric)' : '50005 (Symmetric)'}
              </button>
            </div>
          </div>

          <button
            onClick={runDissection}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            {lang === 'ro' ? 'Execută Bucla while (n != 0)' : 'Execute while (n != 0) Loop'}
          </button>

          {hasDissected && finalMirrored !== null && (
            <div
              className={`p-3 rounded-lg border text-xs space-y-1 ${
                isPalindrome
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isPalindrome
                    ? (lang === 'ro' ? '🎉 Numărul este un PALINDROM veritabil!' : '🎉 The number is a genuine PALINDROME!')
                    : (lang === 'ro' ? 'Numărul NU este palindrom.' : 'The number is NOT a palindrome.')}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                {lang === 'ro'
                  ? `Original = ${inputN} | Oglindit = ${finalMirrored}`
                  : `Original = ${inputN} | Mirrored = ${finalMirrored}`}
              </p>
            </div>
          )}
        </div>

        {/* Right: Step-by-Step Memory Execution Table */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-emerald-400" />
            {lang === 'ro' ? 'Tabelul de Memorie Pas-cu-Pas (Trace Table)' : 'Step-by-Step Memory Execution Table (Trace Table)'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                  <th className="p-2">{lang === 'ro' ? 'Pas' : 'Step'}</th>
                  <th className="p-2">{lang === 'ro' ? 'n înainte' : 'n before'}</th>
                  <th className="p-2 text-amber-300">{lang === 'ro' ? 'cifra (%10)' : 'digit (%10)'}</th>
                  <th className="p-2 text-cyan-300">{lang === 'ro' ? 'oglindit' : 'mirrored'}</th>
                  <th className="p-2 text-emerald-300">{lang === 'ro' ? 'suma' : 'sum'}</th>
                  <th className="p-2">{lang === 'ro' ? 'n după (/10)' : 'n after (/10)'}</th>
                </tr>
              </thead>
              <tbody>
                {memoryTable.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500 italic">
                      {lang === 'ro'
                        ? 'Apasă „Execută Bucla while (n != 0)” pentru a genera tabelul de memorie...'
                        : 'Press "Execute while (n != 0) Loop" to generate memory trace table...'}
                    </td>
                  </tr>
                ) : (
                  memoryTable.map((row) => (
                    <tr key={row.step} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="p-2 font-bold text-slate-400">#{row.step}</td>
                      <td className="p-2">{row.nBefore}</td>
                      <td className="p-2 text-amber-300 font-bold">{row.digit}</td>
                      <td className="p-2 text-cyan-300 font-bold">{row.mirrored}</td>
                      <td className="p-2 text-emerald-300">{row.sum}</td>
                      <td className="p-2 text-slate-400">{row.nAfter}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 74–75)' : 'C++ Conceptual Check (Textbook pp. 74–75)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Cum se construiește corect numărul oglindit (inversat) <code className="text-cyan-300 font-mono">ogl</code> adăugând cifra extrasă <code className="text-amber-300 font-mono">c</code>?</>
              ) : (
                <>How do we correctly append extracted digit <code className="text-amber-300 font-mono">c</code> to build the mirrored number <code className="text-cyan-300 font-mono">ogl</code>?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'ogl = ogl + c;' },
                {
                  id: 'b',
                  labelRo: 'ogl = ogl * 10 + c; (deplasăm cifrele deja formate cu o poziție spre stânga)',
                  labelEn: 'ogl = ogl * 10 + c; (shifts existing digits leftwards by one decimal position)'
                },
                { id: 'c', label: 'ogl = c * 10;' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'b') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label || (lang === 'ro' ? opt.labelRo : opt.labelEn)}</span>
                  {q1Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 2:' : 'Question 2:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>De ce este necesar să păstrăm valoarea inițială a lui <code className="text-amber-300 font-mono">n</code> într-o variabilă copie (ex: <code className="text-indigo-300 font-mono">int copie = n;</code>) înainte de buclă?</>
              ) : (
                <>Why must we preserve the initial value of <code className="text-amber-300 font-mono">n</code> in a backup copy (e.g.: <code className="text-indigo-300 font-mono">int copy = n;</code>) prior to the loop?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Deoarece prin împărțiri succesive (n = n / 10), valoarea lui n devine 0 la finalul buclei și nu ar mai putea fi comparată cu oglinditul',
                  labelEn: 'Because through repeated divisions (n = n / 10), n becomes 0 upon loop exit and could no longer be compared against the mirrored value'
                },
                {
                  id: 'b',
                  labelRo: 'Pentru că compilatorul C++ dă eroare dacă nu avem două variabile',
                  labelEn: 'Because C++ throws a compilation error without two distinct variables'
                },
                {
                  id: 'c',
                  labelRo: 'Copierea este opțională și inutilă',
                  labelEn: 'Copying is completely optional and redundant'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'a') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'a'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q2Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
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
                ? 'Excelent! Ai stăpânit algoritmul general de descompunere a cifrelor și calculul numărului oglindit.'
                : 'Excellent! You mastered the generalized digit decomposition algorithm and reversal logic.')
              : (lang === 'ro'
                ? 'Rulează algoritmul pe un număr și răspunde corect la cele două întrebări.'
                : 'Run algorithm on a number and answer both questions correctly.')}
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
            <span>{lang === 'ro' ? 'Următorul Nivel: Divizori & Numere Prime' : 'Next Level: Divisors & Prime Numbers'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
