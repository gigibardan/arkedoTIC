import React, { useState } from 'react';
import {
  Bug,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Code2,
  ShieldAlert,
  Cpu,
  Layers
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface A1Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface BugCase {
  id: string;
  titleRo: string;
  titleEn: string;
  buggyCode: string;
  fixedCode: string;
  compilerErrorMsgRo: string;
  compilerErrorMsgEn: string;
  explanationRo: string;
  explanationEn: string;
  isFixed: boolean;
}

const INITIAL_BUGS: BugCase[] = [
  {
    id: 'assign_in_if',
    titleRo: 'Bug #1: Atribuire (=) în loc de Egalitate (==) în if',
    titleEn: 'Bug #1: Assignment (=) instead of Equality (==) in if',
    buggyCode: 'if (nota = 10) {\n    cout << "Felicitari!";\n}',
    fixedCode: 'if (nota == 10) {\n    cout << "Felicitari!";\n}',
    compilerErrorMsgRo: 'warning: suggest parentheses around assignment used as truth value [-Wparentheses]',
    compilerErrorMsgEn: 'warning: suggest parentheses around assignment used as truth value [-Wparentheses]',
    explanationRo: 'Manual pag. 61: nota = 10 atribuie valoarea 10 variabilei nota, iar expresia devine 10 (nenul = true), executând mereu ramura if chiar dacă elevul avea nota 4! Cu == comparăm egalitatea.',
    explanationEn: 'Textbook p. 61: nota = 10 assigns 10 to nota, evaluating to 10 (non-zero = true), unconditionally executing the if branch even if the grade was 4! Use == to check equality.',
    isFixed: false
  },
  {
    id: 'int_division_truncation',
    titleRo: 'Bug #2: Pierderea Zecimalelor la Media Aritmetică',
    titleEn: 'Bug #2: Decimal Truncation in Arithmetic Average',
    buggyCode: 'int a = 9, b = 10;\ndouble medie = (a + b) / 2; // Da 9.0 in loc de 9.5!',
    fixedCode: 'int a = 9, b = 10;\ndouble medie = (a + b) / 2.0; // Corect: 9.5',
    compilerErrorMsgRo: 'Rezultat logic gresit: impartirea intreaga (a + b) / 2 taie zecimala inainte de atribuire!',
    compilerErrorMsgEn: 'Logical flaw: integer division (a + b) / 2 truncates decimals prior to assignment!',
    explanationRo: 'Manual pag. 60: Deoarece (a + b) este int și 2 este int, C++ calculează 19 / 2 = 9 (întreg), apoi atribuie 9 în medie. Folosind 2.0 (număr real double), împărțirea devine reală: 9.5.',
    explanationEn: 'Textbook p. 60: Because both (a + b) and 2 are integers, C++ computes 19 / 2 = 9 (int), assigning 9.0 to medie. Dividing by 2.0 (double literal) performs floating-point division: 9.5.',
    isFixed: false
  },
  {
    id: 'chained_interval',
    titleRo: 'Bug #3: Scrierea Matematică Înșelătoare a Intervalului',
    titleEn: 'Bug #3: Deceptive Mathematical Interval Chaining',
    buggyCode: 'if (10 <= x <= 50) {\n    cout << "In interval";\n}',
    fixedCode: 'if (x >= 10 && x <= 50) {\n    cout << "In interval";\n}',
    compilerErrorMsgRo: 'warning: comparisons like \'X <= Y <= Z\' do not have their mathematical meaning [-Wparentheses]',
    compilerErrorMsgEn: 'warning: comparisons like \'X <= Y <= Z\' do not have their mathematical meaning [-Wparentheses]',
    explanationRo: 'Manual pag. 61: C++ evaluează de la stânga la dreapta: (10 <= x) produce 0 sau 1. Apoi compară rezultatul cu 50 (0 <= 50 sau 1 <= 50), ceea ce este MEREU ADEVĂRAT pentru orice x!',
    explanationEn: 'Textbook p. 61: C++ evaluates left-to-right: (10 <= x) yields 0 or 1. It then tests (0 <= 50 or 1 <= 50), which evaluates to TRUE for EVERY conceivable value of x!',
    isFixed: false
  },
  {
    id: 'modulo_on_double',
    titleRo: 'Bug #4: Utilizarea Operatorului % pe Numere Reale',
    titleEn: 'Bug #4: Modulo Operator (%) on Floating-Point Reals',
    buggyCode: 'double x = 7.5;\ncout << x % 2;',
    fixedCode: 'int x = 7;\ncout << x % 2;',
    compilerErrorMsgRo: 'error: invalid operands of types \'double\' and \'int\' to binary \'operator%\'',
    compilerErrorMsgEn: 'error: invalid operands of types \'double\' and \'int\' to binary \'operator%\'',
    explanationRo: 'Manual pag. 60: Operatorul modulo (%) are sens matematic doar pentru numere întregi (împărțire cu rest în N sau Z). Compilatorul C++ refuză să compileze modulo pe tipuri float sau double.',
    explanationEn: 'Textbook p. 60: The modulo remainder operator (%) is strictly defined for discrete integers in C++. The compiler terminates with a hard error if operands are float or double.',
    isFixed: false
  }
];

export const A1Level6_ExpressionDebuggerLab: React.FC<A1Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [bugs, setBugs] = useState<BugCase[]>(INITIAL_BUGS);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleFixBug = (id: string) => {
    setBugs(prev => prev.map(b => b.id === id ? { ...b, isFixed: true } : b));
    sounds.playCorrect();
  };

  const handleSelectAnswer = (qId: string, optId: string) => {
    if (submitted[qId] || isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = answers[qId] === correctId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmitted(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allBugsFixed = bugs.every(b => b.isFixed);
  const allQuizzesPassed = submitted['q1'] && submitted['q2'];
  const canProceed = allBugsFixed && allQuizzesPassed;

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  const fixedCount = bugs.filter(b => b.isFixed).length;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-indigo-700 to-purple-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Bug className="w-5 h-5 text-rose-300" />
              <span>
                {lang === 'ro'
                  ? 'Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A'
                  : 'Unit 3: Algorithms & Advanced C++ Programming • Module 3A'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 6: Clinica de Depanare C++ (Debug Clinic) & Expresii Complexe'
                : 'Lesson 6: C++ Debug Clinic & Complex Expressions'}
            </h1>
            <p className="text-rose-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 63–64: Învață să recunoști și să repari cele 4 erori capcană comise de începători: atribuirea în if, trunchierea mediei prin împărțire întreagă, intervalul matematic înlănțuit și modulo pe reale.'
                : 'Art Klett Textbook pp. 63–64: Learn to diagnose and patch 4 classic beginner pitfalls: assignment inside if statements, decimal truncation from integer division, chained interval comparisons, and modulo on floating-point reals.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-rose-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">6 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Prioritatea Operatorilor & Capcane de Compilare (Manual pag. 63)'
              : 'Theoretical Notes: Operator Precedence & Compiler Traps (Textbook p. 63)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              {lang === 'ro' ? 'Erori de Compilare vs Logice' : 'Compile-time vs Logical Errors'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Erorile de compilare opresc programul din fașă (ex: lipsă ; sau x % 2.5). Erorile logice sunt mult mai viclene: programul compilează, dar calculează rezultate greșite!'
                : 'Compiler errors halt build immediately (e.g., missing ; or x % 2.5). Logic bugs are far subtler: the binary compiles, but produces incorrect calculations!'}
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              {lang === 'ro' ? 'Ierarhia de Prioritate' : 'Precedence Hierarchy'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro' ? (
                <>
                  1. Parantezele rotunde <code>( )</code><br />
                  2. Operatori aritmetici multiplicativi <code>*</code>, <code>/</code>, <code>%</code><br />
                  3. Operatori aritmetici aditivi <code>+</code>, <code>-</code><br />
                  4. Relaționali <code>&lt;</code>, <code>&gt;</code>, <code>==</code>, <code>!=</code><br />
                  5. Logici <code>&&</code>, apoi <code>||</code>
                </>
              ) : (
                <>
                  1. Parentheses <code>( )</code><br />
                  2. Multiplicative arithmetic <code>*</code>, <code>/</code>, <code>%</code><br />
                  3. Additive arithmetic <code>+</code>, <code>-</code><br />
                  4. Relational <code>&lt;</code>, <code>&gt;</code>, <code>==</code>, <code>!=</code><br />
                  5. Logical <code>&&</code>, followed by <code>||</code>
                </>
              )}
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-600" />
              {lang === 'ro' ? 'Conversia Explicită (Type Casting)' : 'Explicit Type Casting'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Pentru a forța o împărțire reală între două variabile întregi a și b, scriem (double)a / b sau împărțim la 2.0 în loc de 2.'
                : 'To enforce floating-point division between two integer variables a and b, use (double)a / b or divide by 2.0 instead of integer 2.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Debug Clinic */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              {lang === 'ro'
                ? 'Simulator Interactiv: Clinica de Depanare (Repară cele 4 Erori Capcană)'
                : 'Interactive Lab: Debug Clinic (Patch All 4 Trap Bugs)'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">
              {lang === 'ro' ? 'Stare Depanare:' : 'Debug Status:'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              fixedCount === bugs.length ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {lang === 'ro'
                ? `${fixedCount} / ${bugs.length} Erori Rezolvate`
                : `${fixedCount} / ${bugs.length} Bugs Patched`}
            </span>
          </div>
        </div>

        {/* Bug Cards Grid */}
        <div className="space-y-4">
          {bugs.map(bug => (
            <div
              key={bug.id}
              className={`p-5 rounded-2xl border transition-all ${
                bug.isFixed
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white border-slate-300 shadow-md'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${bug.isFixed ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                  <h4 className={`text-sm font-bold ${bug.isFixed ? 'text-emerald-900' : 'text-slate-900'}`}>
                    {lang === 'ro' ? bug.titleRo : bug.titleEn}
                  </h4>
                </div>
                {!bug.isFixed ? (
                  <button
                    onClick={() => handleFixBug(bug.id)}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{lang === 'ro' ? 'Aplică Corecția Canonică' : 'Apply Canonical Patch'}</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'ro' ? 'Bug Remediat cu Succes!' : 'Bug Successfully Patched!'}
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 text-rose-300 rounded-xl border border-rose-900/40">
                  <div className="text-[10px] uppercase font-bold text-rose-400 mb-1">
                    {lang === 'ro' ? 'Cod Eronat (Înainte):' : 'Buggy Code (Before):'}
                  </div>
                  <pre className="whitespace-pre-wrap">{bug.buggyCode}</pre>
                  <div className="text-[10px] text-rose-400 mt-2 border-t border-rose-900/50 pt-1">
                    ⚠️ {lang === 'ro' ? bug.compilerErrorMsgRo : bug.compilerErrorMsgEn}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  bug.isFixed
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                    {lang === 'ro' ? 'Cod Canonic Corectat (După):' : 'Fixed Canonical Code (After):'}
                  </div>
                  <pre className="whitespace-pre-wrap">
                    {bug.isFixed
                      ? bug.fixedCode
                      : (lang === 'ro' ? '// Apasă pe butonul roșu pentru a aplica patch-ul' : '// Click red button to apply patch')}
                  </pre>
                  {bug.isFixed && (
                    <div className="text-[10px] text-emerald-400 mt-2 border-t border-emerald-900/50 pt-1">
                      ✅ {lang === 'ro' ? bug.explanationRo : bug.explanationEn}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            {lang === 'ro'
              ? 'Verificare Pedagogică: Prioritate și Depanare (Manual pag. 63–64)'
              : 'Pedagogical Check: Precedence & Debugging (Textbook pp. 63–64)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro' ? (
                <>Cerința 1: Care este rezultatul evaluării expresiei C++ <code>2 + 3 * 4</code> și de ce?</>
              ) : (
                <>Question 1: What is the evaluated result of C++ expression <code>2 + 3 * 4</code> and why?</>
              )}
            </span>
            <QuestionHint
              hint={lang === 'ro'
                ? "Manual pag. 63: Operatorul de înmulțire * are prioritate superioară față de operatorul de adunare +."
                : "Textbook p. 63: The multiplication operator * holds higher precedence over the addition operator +."}
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. 20 (deoarece 2 + 3 = 5, apoi 5 * 4 = 20)',
                labelEn: 'A. 20 (because 2 + 3 = 5, then 5 * 4 = 20)'
              },
              {
                id: 'opt_b',
                labelRo: 'B. 14 (deoarece înmulțirea 3 * 4 = 12 se efectuează prima, apoi 2 + 12 = 14)',
                labelEn: 'B. 14 (because multiplication 3 * 4 = 12 evaluates first, then 2 + 12 = 14)'
              },
              {
                id: 'opt_c',
                labelRo: 'C. 24',
                labelEn: 'C. 24'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Se produce o eroare de compilare',
                labelEn: 'D. It causes a compilation error'
              }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={lang === 'ro'
                ? "Corect! Exact ca în algebră, operatorii multiplicativi (*, /, %) au prioritate mai mare decât cei aditivi (+, -). Astfel, mai întâi se calculează 3 * 4 = 12, iar apoi 2 + 12 = 14."
                : "Correct! Just like in algebra, multiplicative operators (*, /, %) take higher precedence over additive operators (+, -). Thus, 3 * 4 = 12 is computed first, followed by 2 + 12 = 14."}
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro' ? (
                <>Cerința 2: Ai două variabile întregi <code>int a = 7, b = 2;</code> și dorești să calculezi media lor reală (3.5) într-o variabilă <code>double m;</code>. Care formulă este corectă?</>
              ) : (
                <>Question 2: Given integer variables <code>int a = 7, b = 2;</code>, you want to store their floating-point average (3.5) in <code>double m;</code>. Which formula is correct?</>
              )}
            </span>
            <QuestionHint
              hint={lang === 'ro'
                ? "Manual pag. 63: Pentru ca rezultatul să conțină zecimale, cel puțin unul dintre termeni trebuie să fie de tip real (double), fie împărțind la 2.0, fie prin conversie explicită (double)a."
                : "Textbook p. 63: For the result to preserve decimals, at least one term must be a floating-point type (double), either by dividing by 2.0 or via explicit casting (double)a."}
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. m = (a + b) / 2; (care ar da 3.0 din cauza împărțirii întregi)',
                labelEn: 'A. m = (a + b) / 2; (which yields 3.0 due to integer truncation)'
              },
              {
                id: 'opt_b',
                labelRo: 'B. m = (a + b) / 2.0; sau m = (double)(a + b) / 2;',
                labelEn: 'B. m = (a + b) / 2.0; or m = (double)(a + b) / 2;'
              },
              {
                id: 'opt_c',
                labelRo: 'C. m = (a + b) % 2;',
                labelEn: 'C. m = (a + b) % 2;'
              },
              {
                id: 'opt_d',
                labelRo: 'D. m = (a + b) / 0;',
                labelEn: 'D. m = (a + b) / 0;'
              }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={lang === 'ro'
                ? "Excelent! Împărțind la `2.0` (constantă reală double) sau aplicând conversia `(double)(a + b)`, forțăm compilatorul C++ să execute o împărțire reală cu zecimale, obținând corect valoarea 3.5."
                : "Excellent! Dividing by `2.0` (double literal) or using `(double)(a + b)` cast forces C++ to compute real floating-point division, yielding the correct value 3.5."}
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={6}
        totalLevels={7}
        isCompleted={canProceed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel={lang === 'ro'
          ? "Continuă cu Lecția 7: Evaluarea Sumativă Oficială Modulul 3A"
          : "Continue to Lesson 7: Module 3A Summative C++ Exam"}
      />
    </div>
  );
};
