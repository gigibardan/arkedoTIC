import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Binary,
  Layers,
  Check,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A5Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A5Level4_MathAndUtilityFunctions: React.FC<A5Level4Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();

  const [selectedTool, setSelectedTool] = useState<'prim' | 'cmmdc' | 'oglindit' | 'sumaCif'>('prim');
  const [numN, setNumN] = useState<number>(37);
  const [numA, setNumA] = useState<number>(48);
  const [numB, setNumB] = useState<number>(18);

  const [callResult, setCallResult] = useState<{
    callExpr: string;
    returnedValue: string | number | boolean;
    explanationRo: string[];
    explanationEn: string[];
  } | null>(null);

  // Composition Challenge State
  const [compNum, setCompNum] = useState<number>(13);
  const [compResult, setCompResult] = useState<{
    isEmirp: boolean;
    reversed: number;
    isPrimeN: boolean;
    isPrimeRev: boolean;
  } | null>(null);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const checkPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let d = 3; d * d <= n; d += 2) {
      if (n % d === 0) return false;
    }
    return true;
  };

  const getGcd = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const r = x % y;
      x = y;
      y = r;
    }
    return x;
  };

  const getMirrored = (n: number): number => {
    let temp = Math.abs(n);
    let inv = 0;
    while (temp > 0) {
      inv = inv * 10 + (temp % 10);
      temp = Math.floor(temp / 10);
    }
    return inv;
  };

  const getDigitSum = (n: number): number => {
    let temp = Math.abs(n);
    let s = 0;
    while (temp > 0) {
      s += temp % 10;
      temp = Math.floor(temp / 10);
    }
    return s;
  };

  const handleExecuteTool = () => {
    sounds.playClick();
    if (selectedTool === 'prim') {
      const res = checkPrime(numN);
      setCallResult({
        callExpr: `estePrim(${numN})`,
        returnedValue: res ? 'true (1)' : 'false (0)',
        explanationRo: [
          `1. Verificăm cazul de bază: ${numN} >= 2`,
          `2. Parcurgem divizorii impari d de la 3 până la d*d <= ${numN}`,
          res
            ? `3. Niciun divizor găsit în [2, ${Math.floor(Math.sqrt(numN))}]. Returnează true.`
            : `3. Numărul ${numN} are cel puțin un divizor propriu. Returnează false.`
        ],
        explanationEn: [
          `1. Check base case: ${numN} >= 2`,
          `2. Test odd divisors d from 3 up to d*d <= ${numN}`,
          res
            ? `3. No proper divisor found in [2, ${Math.floor(Math.sqrt(numN))}]. Returns true.`
            : `3. The number ${numN} has at least one proper divisor. Returns false.`
        ]
      });
    } else if (selectedTool === 'cmmdc') {
      const res = getGcd(numA, numB);
      setCallResult({
        callExpr: `cmmdc(${numA}, ${numB})`,
        returnedValue: res,
        explanationRo: [
          `1. Algoritmul lui Euclid cu resturi succesive: a = ${numA}, b = ${numB}`,
          `2. Cât timp b != 0: r = a % b; a = b; b = r;`,
          `3. Împărțitorul final la restul 0 este ${res}. Returnează ${res}.`
        ],
        explanationEn: [
          `1. Euclidean remainder algorithm: a = ${numA}, b = ${numB}`,
          `2. While b != 0: r = a % b; a = b; b = r;`,
          `3. Final divisor at remainder 0 is ${res}. Returns ${res}.`
        ]
      });
    } else if (selectedTool === 'oglindit') {
      const res = getMirrored(numN);
      setCallResult({
        callExpr: `oglindit(${numN})`,
        returnedValue: res,
        explanationRo: [
          `1. Inițializăm inv = 0;`,
          `2. Cât timp n > 0: adăugăm ultima cifră (inv = inv * 10 + n % 10) și împărțim n /= 10`,
          `3. Numărul inversat complet este ${res}. Returnează ${res}.`
        ],
        explanationEn: [
          `1. Initialize inv = 0;`,
          `2. While n > 0: append last digit (inv = inv * 10 + n % 10) and divide n /= 10`,
          `3. Fully mirrored number is ${res}. Returns ${res}.`
        ]
      });
    } else if (selectedTool === 'sumaCif') {
      const res = getDigitSum(numN);
      setCallResult({
        callExpr: `sumaCifrelor(${numN})`,
        returnedValue: res,
        explanationRo: [
          `1. Inițializăm s = 0;`,
          `2. Extragem pe rând cifrele cu n % 10 și le adunăm la s;`,
          `3. Suma totală a cifrelor numărului ${numN} este ${res}. Returnează ${res}.`
        ],
        explanationEn: [
          `1. Initialize s = 0;`,
          `2. Sequentially extract digits with n % 10 and add to s;`,
          `3. Total digit sum of ${numN} is ${res}. Returns ${res}.`
        ]
      });
    }
  };

  const handleTestComposition = () => {
    sounds.playClick();
    const isPrimeN = checkPrime(compNum);
    const reversed = getMirrored(compNum);
    const isPrimeRev = checkPrime(reversed);
    const isEmirp = isPrimeN && isPrimeRev;

    setCompResult({
      isEmirp,
      reversed,
      isPrimeN,
      isPrimeRev
    });
  };

  const isCompleted =
    callResult !== null &&
    compResult !== null &&
    q1Answer === 'reutilizare' &&
    q2Answer === 'bool_func';

  const handleFinish = () => {
    if (!isCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
                {lang === 'ro' ? 'Nivelul 4 • Unitatea 3 (Manual pag. 87)' : 'Level 4 • Unit 3 (Textbook p. 87)'}
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {lang === 'ro' ? 'Trusa de Funcții Utilitare Matematice' : 'Mathematical Utility Function Toolkit'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded-lg text-blue-300 text-sm font-mono">
            <span>{lang === 'ro' ? 'Modularitate & Reutilizare' : 'Modularity & Reusability'}</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          {lang === 'ro' ? (
            <>
              În loc să rescrii bucle de primality, cmmdc sau oglindit de 10 ori în diverse programe,
              în C++ le definim ca <strong>subprograme specializate</strong>. Odată testate și validate,
              le putem apela și compune în câteva secunde!
            </>
          ) : (
            <>
              Instead of rewriting loops for primality, gcd, or digit reversal 10 times across different programs,
              in C++ we define them as <strong>specialized subprograms</strong>. Once tested and verified,
              we can invoke and compose them in seconds!
            </>
          )}
        </p>
      </div>

      {/* Main Grid: Toolbox & Interactive Call Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Tool Selector and Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-sm font-semibold">
                <Code2 className="w-4 h-4" />
                <span>{lang === 'ro' ? 'Selectează Funcția Utilitară' : 'Select Utility Function'}</span>
              </div>
            </div>

            {/* Function Buttons */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={() => {
                  setSelectedTool('prim');
                  sounds.playClick();
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedTool === 'prim'
                    ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-blue-300">bool estePrim(int n)</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lang === 'ro' ? 'Verificare număr prim cu d*d <= n' : 'Primality check with d*d <= n'}
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedTool('cmmdc');
                  sounds.playClick();
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedTool === 'cmmdc'
                    ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-blue-300">int cmmdc(int a, int b)</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lang === 'ro' ? 'Cel mai mare divizor comun (Euclid)' : 'Greatest common divisor (Euclid)'}
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedTool('oglindit');
                  sounds.playClick();
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedTool === 'oglindit'
                    ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-blue-300">int oglindit(int n)</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lang === 'ro' ? 'Numărul inversat cifră cu cifră' : 'Mirrored number digit by digit'}
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedTool('sumaCif');
                  sounds.playClick();
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedTool === 'sumaCif'
                    ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-blue-300">int sumaCifrelor(int n)</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lang === 'ro' ? 'Suma cifrelor numărului n' : 'Sum of digits of number n'}
                </div>
              </button>
            </div>

            {/* Inputs based on selected tool */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
              {selectedTool === 'cmmdc' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-mono block mb-1">
                      {lang === 'ro' ? 'Parametru a:' : 'Parameter a:'}
                    </label>
                    <input
                      type="number"
                      value={numA}
                      onChange={(e) => setNumA(Number(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-mono block mb-1">
                      {lang === 'ro' ? 'Parametru b:' : 'Parameter b:'}
                    </label>
                    <input
                      type="number"
                      value={numB}
                      onChange={(e) => setNumB(Number(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-400 font-mono block mb-1">
                    {lang === 'ro' ? 'Parametru n:' : 'Parameter n:'}
                  </label>
                  <input
                    type="number"
                    value={numN}
                    onChange={(e) => setNumN(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <button
                onClick={handleExecuteTool}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow transition-colors text-sm font-mono"
              >
                <Play className="w-4 h-4 fill-white" />
                {lang === 'ro' ? 'Apelează Subprogramul' : 'Call Subprogram'}
              </button>
            </div>

            {/* Call result display */}
            {callResult && (
              <div className="p-4 bg-blue-950/40 border border-blue-700/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-300 font-semibold">
                    {lang === 'ro' ? 'Valoare Returnată de Subprogram:' : 'Subprogram Return Value:'}
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded border border-emerald-500/40">
                    {callResult.callExpr} = {callResult.returnedValue}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300 space-y-1 pt-2 border-t border-blue-800/40">
                  {(lang === 'ro' ? callResult.explanationRo : callResult.explanationEn).map((line, idx) => (
                    <div key={idx} className="text-slate-300">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Function Composition Challenge & Theory */}
        <div className="lg:col-span-6 space-y-4">
          {/* Challenge Box: Function Composition */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-sm font-semibold pb-2 border-b border-slate-800">
              <Zap className="w-4 h-4" />
              <span>{lang === 'ro' ? 'Mini-Proiect: Compunerea Subprogramelor (Emirps)' : 'Mini-Project: Function Composition (Emirps)'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ro'
                ? 'Un număr este emirp dacă este prim, iar oglinditul său este de asemenea un număr prim diferit (ex: 13 → 31). Putem verifica într-o singură instrucțiune combinând funcțiile noastre:'
                : 'A number is an emirp if it is prime, and its mirrored reverse is also a distinct prime (e.g., 13 → 31). We can test this in a single expression by combining our functions:'}
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-indigo-300">
              <code>if (estePrim(n) &amp;&amp; estePrim(oglindit(n))) ...</code>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                value={compNum}
                onChange={(e) => setCompNum(Number(e.target.value) || 0)}
                className="w-24 bg-slate-950 border border-slate-700 rounded p-2 text-sm font-mono text-white text-center focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleTestComposition}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs font-mono transition-colors"
              >
                {lang === 'ro'
                  ? 'Verifică: estePrim(n) && estePrim(oglindit(n))'
                  : 'Check: isPrime(n) && isPrime(mirrored(n))'}
              </button>
            </div>

            {compResult && (
              <div
                className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${
                  compResult.isEmirp
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                }`}
              >
                <div className="font-bold">
                  {compResult.isEmirp
                    ? lang === 'ro'
                      ? `SUCCES: ${compNum} și oglinditul său ${compResult.reversed} sunt AMBELE numere prime!`
                      : `SUCCESS: ${compNum} and its mirror ${compResult.reversed} are BOTH prime numbers!`
                    : lang === 'ro'
                    ? `Nu este emirp: ${compNum} este ${
                        compResult.isPrimeN ? 'prim' : 'neprim'
                      }, iar ${compResult.reversed} este ${
                        compResult.isPrimeRev ? 'prim' : 'neprim'
                      }.`
                    : `Not an emirp: ${compNum} is ${
                        compResult.isPrimeN ? 'prime' : 'composite'
                      }, and ${compResult.reversed} is ${
                        compResult.isPrimeRev ? 'prime' : 'composite'
                      }.`}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Check Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>{lang === 'ro' ? 'Verificare Înțelegere (Manual pag. 87)' : 'Comprehension Check (Textbook p. 87)'}</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                {lang === 'ro'
                  ? '1. Care este cel mai mare beneficiu al organizării algoritmilor în funcții utilitare distincte?'
                  : '1. What is the greatest benefit of organizing algorithms into separate utility functions?'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'reutilizare',
                    textRo: 'Reutilizarea codului fără rescriere, depanare mai ușoară și modularitate curată.',
                    textEn: 'Code reusability without rewriting, easier debugging, and clean modularity.'
                  },
                  {
                    id: 'viteza',
                    textRo: 'Programul rulează automat de 100 de ori mai repede fără compilare.',
                    textEn: 'The program automatically runs 100 times faster without compilation.'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ1Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q1Answer === opt.id
                        ? opt.id === 'reutilizare'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lang === 'ro' ? opt.textRo : opt.textEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <p className="text-slate-300 font-medium">
                {lang === 'ro'
                  ? '2. Ce tip de date este cel mai potrivit pentru o funcție care verifică o proprietate (de ex. dacă un număr este prim sau par)?'
                  : '2. What data type is most appropriate for a function checking a predicate property (e.g. if a number is prime or even)?'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'bool_func',
                    textRo: 'bool (întoarce true sau false)',
                    textEn: 'bool (returns true or false)'
                  },
                  {
                    id: 'void_func',
                    textRo: 'void (nu întoarce nimic)',
                    textEn: 'void (returns nothing)'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ2Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q2Answer === opt.id
                        ? opt.id === 'bool_func'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lang === 'ro' ? opt.textRo : opt.textEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isCompleted
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isCompleted
                ? lang === 'ro'
                  ? 'Nivelul 4 Finalizat cu Succes!'
                  : 'Level 4 Completed Successfully!'
                : lang === 'ro'
                ? 'Cerințe: Apelează o funcție utilitară, testează compunerea emirps și răspunde la ambele întrebări.'
                : 'Requirements: Invoke a utility function, test emirp composition, and answer both questions.'}
            </div>
            <div className="text-xs text-slate-400">
              {lang === 'ro'
                ? 'Recompensă: +150 puncte XP și deblocarea Proiectului Integrator.'
                : 'Reward: +150 XP points and unlock the Integrator Project.'}
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isCompleted
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white shadow-lg shadow-blue-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>{lang === 'ro' ? 'Continuă spre Nivelul 5' : 'Continue to Level 5'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
