import React, { useState } from 'react';
import {
  Percent,
  Divide,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Scissors,
  Check,
  X
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface A1Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A1Level3_ArithmeticAndModuloLab: React.FC<A1Level3Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Number Dissector Simulator state
  const [currentNum, setCurrentNum] = useState<number>(8452);
  const [history, setHistory] = useState<string[]>([
    lang === 'ro' ? 'Număr inițial: n = 8452' : 'Initial number: n = 8452'
  ]);
  const [testDivisor, setTestDivisor] = useState<number>(3);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleExtractLastDigit = () => {
    const lastDigit = Math.abs(currentNum % 10);
    const msg = lang === 'ro'
      ? `n % 10 = ${lastDigit} (Ultima cifră extrasă)`
      : `n % 10 = ${lastDigit} (Extracted last digit)`;
    setHistory(prev => [msg, ...prev.slice(0, 5)]);
    sounds.playClick();
  };

  const handleCutLastDigit = () => {
    const newN = Math.trunc(currentNum / 10);
    setCurrentNum(newN);
    const msg = lang === 'ro'
      ? `n = n / 10 -> n devine ${newN} (Tăiată ultima cifră)`
      : `n = n / 10 -> n becomes ${newN} (Truncated last digit)`;
    setHistory(prev => [msg, ...prev.slice(0, 5)]);
    sounds.playClick();
  };

  const handleCheckParity = () => {
    const isEven = currentNum % 2 === 0;
    const msg = lang === 'ro'
      ? `n % 2 == ${currentNum % 2} -> ${isEven ? 'Număr PAR' : 'Număr IMPAR'}`
      : `n % 2 == ${currentNum % 2} -> ${isEven ? 'EVEN Number' : 'ODD Number'}`;
    setHistory(prev => [msg, ...prev.slice(0, 5)]);
    sounds.playClick();
  };

  const handleCheckDivisibility = () => {
    const rem = currentNum % testDivisor;
    const isDiv = rem === 0;
    const msg = lang === 'ro'
      ? `${currentNum} % ${testDivisor} = ${rem} -> ${isDiv ? 'DIVIZIBIL' : 'NEDIVIZIBIL'}`
      : `${currentNum} % ${testDivisor} = ${rem} -> ${isDiv ? 'DIVISIBLE' : 'NOT DIVISIBLE'}`;
    setHistory(prev => [msg, ...prev.slice(0, 5)]);
    sounds.playClick();
  };

  const handleResetNum = () => {
    setCurrentNum(8452);
    setHistory([lang === 'ro' ? 'Număr resetat la n = 8452' : 'Number reset to n = 8452']);
    sounds.playClick();
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

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Percent className="w-5 h-5 text-indigo-300" />
              <span>
                {lang === 'ro'
                  ? 'Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A'
                  : 'Unit 3: Algorithms & Advanced C++ Programming • Module 3A'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 3: Operatori Aritmetici, Împărțirea Întreagă & Magia Modulo (%)'
                : 'Lesson 3: Arithmetic Operators, Integer Division & Modulo Magic (%)'}
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 60–61: Însușește-ți tehnicile fundamentale pe cifrele unui număr: extragerea ultimei cifre cu % 10, eliminarea ei cu / 10, testul de paritate și diferența dintre împărțirea întreagă și cea reală.'
                : 'Curriculum p. 60–61: Master digit dissection arithmetic: extracting units via % 10, truncating units via / 10, parity testing (% 2), and integer vs floating-point division.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">3 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Împărțirea C++ (Câtul / și Restul %) (Manual pag. 60–61)'
              : 'Theoretical Reference: C++ Division (Quotient / and Remainder %) (Curriculum p. 60–61)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <Divide className="w-4 h-4 text-blue-600" />
              {lang === 'ro' ? 'Câtul Întreg (Operatorul /)' : 'Integer Quotient (Operator /)'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Dacă ambii operanzi sunt întregi (int), rezultatul este doar câtul fără zecimale: 7 / 2 = 3 (nu 3.5!). Dacă vrei zecimale, cel puțin unul trebuie scris real: 7.0 / 2 = 3.5.'
                : 'If both operands are integers (int), division discards decimals: 7 / 2 = 3 (not 3.5!). For floating-point precision, write at least one float: 7.0 / 2 = 3.5.'}
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-indigo-600" />
              {lang === 'ro' ? 'Restul Împărțirii (Modulo %)' : 'Remainder (Modulo %)'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Se aplică doar pe numere întregi! 14 % 4 = 2 (deoarece 14 = 4 * 3 + 2). Este piatra de temelie pentru toți algoritmii pe cifre și divizibilitate.'
                : 'Applies strictly to integer types! 14 % 4 = 2 (since 14 = 4 * 3 + 2). Modulo is the foundational cornerstone for digit dissection and divisibility.'}
            </p>
          </div>

          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-100 space-y-2">
            <div className="font-bold text-purple-900 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-purple-600" />
              {lang === 'ro' ? 'Algoritmul „Dezmembrării”' : 'Digit Extraction Algorithm'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Pentru orice număr natural n: • Ultima cifră: c = n % 10; • Eliminarea ultimei cifre: n = n / 10; • Paritate: n % 2 == 0;'
                : 'For any natural number n: • Last digit: c = n % 10; • Truncate unit: n = n / 10; • Parity check: n % 2 == 0;'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Number Dissector Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              {lang === 'ro'
                ? 'Simulator Interactiv: „Dezmembrătorul de Numere” în C++'
                : 'Interactive Simulator: C++ Number Dissector Studio'}
            </h3>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
            {lang === 'ro' ? 'Laborator Cifre' : 'Digits Lab'}
          </span>
        </div>

        {/* Number Input & Dissection Tools */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'ro' ? 'Valoarea Curentă a lui n:' : 'Current Value of n:'}
                </label>
                <button
                  onClick={handleResetNum}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ro' ? 'Resetează' : 'Reset'}</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={currentNum}
                  onChange={(e) => setCurrentNum(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 font-mono text-xl font-black text-indigo-700 outline-none"
                />
              </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExtractLastDigit}
                className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-left transition"
              >
                <div className="font-mono font-bold text-xs text-indigo-900">n % 10</div>
                <div className="text-[11px] text-indigo-700">
                  {lang === 'ro'
                    ? `Extrage ultima cifră (${currentNum % 10})`
                    : `Extract last digit (${currentNum % 10})`}
                </div>
              </button>

              <button
                onClick={handleCutLastDigit}
                className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition"
              >
                <div className="font-mono font-bold text-xs text-purple-900">n = n / 10</div>
                <div className="text-[11px] text-purple-700">
                  {lang === 'ro'
                    ? `Taie ultima cifră (devine ${Math.trunc(currentNum / 10)})`
                    : `Truncate unit (becomes ${Math.trunc(currentNum / 10)})`}
                </div>
              </button>

              <button
                onClick={handleCheckParity}
                className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-left transition"
              >
                <div className="font-mono font-bold text-xs text-sky-900">n % 2 == 0</div>
                <div className="text-[11px] text-sky-700">
                  {lang === 'ro'
                    ? `Test paritate: ${currentNum % 2 === 0 ? 'Par' : 'Impar'}`
                    : `Parity test: ${currentNum % 2 === 0 ? 'Even' : 'Odd'}`}
                </div>
              </button>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={testDivisor}
                  onChange={(e) => setTestDivisor(Number(e.target.value) || 1)}
                  className="w-14 border rounded p-1 text-xs font-mono text-center font-bold bg-white"
                />
                <button
                  onClick={handleCheckDivisibility}
                  className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold"
                >
                  Test % d
                </button>
              </div>
            </div>
          </div>

          {/* Execution History Terminal */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3 font-mono text-xs shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-slate-400">
                <span>{lang === 'ro' ? 'Registru Operații Executate:' : 'Execution History Log:'}</span>
                <span className="text-[11px] text-emerald-400">Status: OK</span>
              </div>
              <div className="space-y-2">
                {history.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border ${
                      index === 0
                        ? 'bg-indigo-950/80 border-indigo-500/50 text-cyan-300 font-bold'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300'
                    }`}
                  >
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              💡 {lang === 'ro'
                ? 'Observă cum n % 10 nu modifică valoarea lui n, în timp ce n = n / 10 actualizează variabila.'
                : 'Notice how n % 10 evaluates without mutating n, whereas n = n / 10 updates the variable state.'}
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            {lang === 'ro'
              ? 'Verificare Pedagogică: Operatori Aritmetici (Manual pag. 60–61)'
              : 'Pedagogical Check: Arithmetic Operators (Curriculum p. 60–61)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 1: Dacă ai variabilele întregi int a = 17, b = 5;, care vor fi valorile expresiilor a / b și respectiv a % b în C++?'
                : 'Requirement 1: Given integers int a = 17, b = 5;, what are the evaluated values of a / b and a % b in C++?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 60: La împărțirea a două numere întregi (int), operatorul / dă câtul întreg, iar operatorul % dă restul împărțirii (17 = 5 * 3 + 2)."
              hintEn="Curriculum p. 60: For integers, / computes integer quotient while % produces the remainder (17 = 5 * 3 + 2)."
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
                labelRo: 'A. a / b = 3.4 și a % b = 0',
                labelEn: 'A. a / b = 3.4 and a % b = 0'
              },
              {
                id: 'opt_b',
                labelRo: 'B. a / b = 3 și a % b = 2',
                labelEn: 'B. a / b = 3 and a % b = 2'
              },
              {
                id: 'opt_c',
                labelRo: 'C. a / b = 2 și a % b = 3',
                labelEn: 'C. a / b = 2 and a % b = 3'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Se produce o eroare de compilare deoarece 17 nu se împarte exact la 5',
                labelEn: 'D. A compile error occurs because 17 is not evenly divisible by 5'
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
              explanation={
                lang === 'ro'
                  ? 'Corect! Deoarece atât a cât și b sunt de tip int, a / b dă câtul întreg 3 (17 împărțit la 5 dă 3 rest 2), iar a % b returnează restul 2.'
                  : 'Correct! Both operands being integers, a / b performs truncated integer division (3), while a % b calculates the mathematical remainder (2).'
              }
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 2: Cum poți extrage penultima cifră (cifra zecilor) a unui număr natural n = 729 folosind operatorii învățați?'
                : 'Requirement 2: How do you isolate the tens digit of a natural number n = 729 using the operators taught?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 61: Mai întâi elimini ultima cifră cu / 10 (obținând 72), apoi iei ultima cifră a rezultatului cu % 10 (obținând 2)."
              hintEn="Curriculum p. 61: First truncate the units digit with / 10 (yielding 72), then extract the new units digit with % 10 (yielding 2)."
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
                labelRo: 'A. n % 100 (care ar returna 29)',
                labelEn: 'A. n % 100 (which returns 29)'
              },
              {
                id: 'opt_b',
                labelRo: 'B. (n / 10) % 10 (taie unitățile prin / 10 și extrage noua ultimă cifră prin % 10)',
                labelEn: 'B. (n / 10) % 10 (truncates units via / 10 and extracts tens via % 10)'
              },
              {
                id: 'opt_c',
                labelRo: 'C. n - 10',
                labelEn: 'C. n - 10'
              },
              {
                id: 'opt_d',
                labelRo: 'D. (n % 10) / 10',
                labelEn: 'D. (n % 10) / 10'
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
              explanation={
                lang === 'ro'
                  ? 'Excelent! Expresia `(n / 10) % 10` taie unitățile (`729 / 10 = 72`), apoi aplică `% 10` pentru a extrage exact cifra zecilor (`72 % 10 = 2`).'
                  : 'Excellent! The compound expression `(n / 10) % 10` first drops the units digit (729 / 10 = 72) and then extracts the new units digit (72 % 10 = 2).'
              }
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={3}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel={
          lang === 'ro'
            ? 'Continuă cu Lecția 4: Operatori Relaționali & Logici (&&, ||, !)'
            : 'Continue to Lesson 4: Relational & Logical Operators (&&, ||, !)'
        }
      />
    </div>
  );
};
