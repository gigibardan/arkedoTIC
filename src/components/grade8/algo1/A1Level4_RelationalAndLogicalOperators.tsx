import React, { useState } from 'react';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Equal,
  Sliders,
  Scale,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface A1Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A1Level4_RelationalAndLogicalOperators: React.FC<A1Level4Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Logical Expression Simulator State
  const [valX, setValX] = useState<number>(25);
  const [intervalA, setIntervalA] = useState<number>(10);
  const [intervalB, setIntervalB] = useState<number>(50);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

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

  // Evaluation
  const inInterval = valX >= intervalA && valX <= intervalB;
  const isTwoDigits = valX >= 10 && valX <= 99;
  const isEvenAndPositive = valX > 0 && valX % 2 === 0;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <GitFork className="w-5 h-5 text-indigo-300" />
              <span>Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 4: Operatori Relaționali & Operatori Logici (&&, ||, !)
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 61–62: Înțelege logica booleană în C++: operatorii de comparare (<code>==</code>, <code>!=</code>, <code>&lt;=</code>),
              conjuncția (<code>&&</code>), disjuncția (<code>||</code>), negația (<code>!</code>) și capcana scrierii intervalelor matematice.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">4 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Operatori Relaționali & Logici în C++ (Manual pag. 61–62)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <Equal className="w-4 h-4 text-rose-600" />
              Egalitate (==) vs Atribuire (=)
            </div>
            <p className="text-slate-600 text-xs">
              Marea capcană a începătorilor: <code>a = b</code> atribuie valoarea lui <code>b</code> în <code>a</code>!
              Pentru a testa dacă două numere sunt egale, se folosește obligatoriu dublu egal: <code>a == b</code>.
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-indigo-600" />
              Operatori Logici: && și ||
            </div>
            <p className="text-slate-600 text-xs">
              • <strong>&& (ȘI)</strong>: Adevărat doar dacă ambele expresii sunt adevărate.<br />
              • <strong>|| (SAU)</strong>: Adevărat dacă cel puțin una dintre expresii este adevărată.<br />
              • <strong>! (NEGAȚIE)</strong>: Inversează adevărul (<code>!0 = 1</code>, <code>!1 = 0</code>).
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              Scrierea Intervalelor [a, b]
            </div>
            <p className="text-slate-600 text-xs">
              În matematică scriem $10 \le x \le 50$. În C++ această scriere produce rezultate eronate!
              Sintaxa corectă C++ necesită legarea prin operatorul &&: <code>x &gt;= 10 && x &lt;= 50</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Boolean Expression Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Evaluatorul de Expresii Logice C++
            </h3>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
            Laborator Logică
          </span>
        </div>

        {/* Sliders for variable inputs */}
        <div className="grid md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Variabila x:</label>
            <input
              type="number"
              value={valX}
              onChange={(e) => {
                setValX(Number(e.target.value));
                sounds.playClick();
              }}
              className="w-full border rounded-lg px-3 py-1.5 text-xs font-mono font-bold bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Limita inferioară (a):</label>
            <input
              type="number"
              value={intervalA}
              onChange={(e) => {
                setIntervalA(Number(e.target.value));
                sounds.playClick();
              }}
              className="w-full border rounded-lg px-3 py-1.5 text-xs font-mono font-bold bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Limita superioară (b):</label>
            <input
              type="number"
              value={intervalB}
              onChange={(e) => {
                setIntervalB(Number(e.target.value));
                sounds.playClick();
              }}
              className="w-full border rounded-lg px-3 py-1.5 text-xs font-mono font-bold bg-white"
            />
          </div>
        </div>

        {/* Live Evaluated Expressions Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Evaluare în timp real a expresiilor logice în C++:
          </div>
          <div className="grid gap-2.5">
            {[
              {
                expr: `x >= ${intervalA} && x <= ${intervalB}`,
                meaning: `x aparține intervalului [${intervalA}, ${intervalB}]`,
                result: inInterval
              },
              {
                expr: `x >= 10 && x <= 99`,
                meaning: `x este un număr de exact 2 cifre`,
                result: isTwoDigits
              },
              {
                expr: `x > 0 && x % 2 == 0`,
                meaning: `x este strict pozitiv ȘI este număr par`,
                result: isEvenAndPositive
              },
              {
                expr: `!(x % 2 == 0)`,
                meaning: `NEGAȚIA parității (este număr impar)`,
                result: !(valX % 2 === 0)
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition ${
                  item.result
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <div>
                  <div className="font-mono font-bold text-xs">{item.expr}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{item.meaning}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black font-mono px-3 py-1 rounded-lg ${
                    item.result ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {item.result ? '1 (true)' : '0 (false)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Operatori Logici & Relaționali (Manual pag. 61–62)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Cum se verifică corect în limbajul C++ dacă variabila întreagă <code>n</code> este cuprinsă în intervalul închis <code>[10, 50]</code> conform manualului?
            </span>
            <QuestionHint
              hint="Manual pag. 61: În C++ nu este permisă notația 10 <= n <= 50. Condițiile trebuie separate și legate prin operatorul logic de conjuncție && (ȘI)."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. 10 <= n <= 50' },
              { id: 'opt_b', label: 'B. n >= 10 && n <= 50' },
              { id: 'opt_c', label: 'C. n == 10 || n == 50' },
              { id: 'opt_d', label: 'D. n in [10, 50]' }
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
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! În C++, apartenența la un interval se exprimă prin conjuncția celor două inegalități separate: `n >= 10 && n <= 50`. Expresia matematică `10 <= n <= 50` evaluează mai întâi `(10 <= n)` la 0 sau 1, comparând apoi rezultatul cu 50, ceea ce este complet eronat."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Ce valoare de adevăr are expresia C++ <code>(5 &gt; 3) || (10 == 20)</code>?
            </span>
            <QuestionHint
              hint="Manual pag. 62: Operatorul || (SAU) este adevărat dacă cel puțin una dintre condiții este adevărată."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. 1 (true), deoarece prima condiție (5 > 3) este adevărată, iar operatorul || necesită doar o condiție adevărată' },
              { id: 'opt_b', label: 'B. 0 (false), deoarece 10 nu este egal cu 20' },
              { id: 'opt_c', label: 'C. Produce eroare de compilare din cauza parantezelor' },
              { id: 'opt_d', label: 'D. Valoarea este nedeterminată' }
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
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_a')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Operatorul || realizează disjuncția logică: deoarece prima expresie `5 > 3` este adevărată (1), întreaga expresie devine instantaneu 1 (true) prin evaluare scurtcircuitată."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={4}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 5: Fluxuri Interactive de Intrare/Ieșire (cin & cout)"
      />
    </div>
  );
};
