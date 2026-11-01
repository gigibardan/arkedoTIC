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

interface A1Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface BugCase {
  id: string;
  title: string;
  buggyCode: string;
  fixedCode: string;
  compilerErrorMsg: string;
  explanation: string;
  isFixed: boolean;
}

const INITIAL_BUGS: BugCase[] = [
  {
    id: 'assign_in_if',
    title: 'Bug #1: Atribuire (=) în loc de Egalitate (==) în if',
    buggyCode: 'if (nota = 10) {\n    cout << "Felicitari!";\n}',
    fixedCode: 'if (nota == 10) {\n    cout << "Felicitari!";\n}',
    compilerErrorMsg: 'warning: suggest parentheses around assignment used as truth value [-Wparentheses]',
    explanation: 'Manual pag. 61: nota = 10 atribuie valoarea 10 variabilei nota, iar expresia devine 10 (nenul = true), executând mereu ramura if chiar dacă elevul avea nota 4! Cu == comparăm egalitatea.',
    isFixed: false
  },
  {
    id: 'int_division_truncation',
    title: 'Bug #2: Pierderea Zecimalelor la Media Aritmetică',
    buggyCode: 'int a = 9, b = 10;\ndouble medie = (a + b) / 2; // Da 9.0 in loc de 9.5!',
    fixedCode: 'int a = 9, b = 10;\ndouble medie = (a + b) / 2.0; // Corect: 9.5',
    compilerErrorMsg: 'Rezultat logic gresit: impartirea intreaga (a + b) / 2 taie zecimala inainte de atribuire!',
    explanation: 'Manual pag. 60: Deoarece (a + b) este int și 2 este int, C++ calculează 19 / 2 = 9 (întreg), apoi atribuie 9 în medie. Folosind 2.0 (număr real double), împărțirea devine reală: 9.5.',
    isFixed: false
  },
  {
    id: 'chained_interval',
    title: 'Bug #3: Scrierea Matematică Înșelătoare a Intervalului',
    buggyCode: 'if (10 <= x <= 50) {\n    cout << "In interval";\n}',
    fixedCode: 'if (x >= 10 && x <= 50) {\n    cout << "In interval";\n}',
    compilerErrorMsg: 'warning: comparisons like \'X <= Y <= Z\' do not have their mathematical meaning [-Wparentheses]',
    explanation: 'Manual pag. 61: C++ evaluează de la stânga la dreapta: (10 <= x) produce 0 sau 1. Apoi compară rezultatul cu 50 (0 <= 50 sau 1 <= 50), ceea ce este MEREU ADEVĂRAT pentru orice x!',
    isFixed: false
  },
  {
    id: 'modulo_on_double',
    title: 'Bug #4: Utilizarea Operatorului % pe Numere Reale',
    buggyCode: 'double x = 7.5;\ncout << x % 2;',
    fixedCode: 'int x = 7;\ncout << x % 2;',
    compilerErrorMsg: 'error: invalid operands of types \'double\' and \'int\' to binary \'operator%\'',
    explanation: 'Manual pag. 60: Operatorul modulo (%) are sens matematic doar pentru numere întregi (împărțire cu rest în N sau Z). Compilatorul C++ refuză să compileze modulo pe tipuri float sau double.',
    isFixed: false
  }
];

export const A1Level6_ExpressionDebuggerLab: React.FC<A1Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
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
              <span>Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 6: Clinica de Depanare C++ (Debug Clinic) & Expresii Complexe
            </h1>
            <p className="text-rose-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 63–64: Învață să recunoști și să repari cele 4 erori capcană comise de începători:
              atribuirea în <code>if</code>, trunchierea mediei prin împărțire întreagă, intervalul matematic înlănțuit și modulo pe reale.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-rose-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">6 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Prioritatea Operatorilor & Capcane de Compilare (Manual pag. 63)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Erori de Compilare vs Logice
            </div>
            <p className="text-slate-600 text-xs">
              Erorile de compilare opresc programul din fașă (ex: lipsă <code>;</code> sau <code>x % 2.5</code>).
              Erorile logice sunt mult mai viclene: programul compilează, dar calculează rezultate greșite!
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Ierarhia de Prioritate
            </div>
            <p className="text-slate-600 text-xs">
              1. Parantezele rotunde <code>( )</code><br />
              2. Operatori aritmetici multiplicativi <code>*</code>, <code>/</code>, <code>%</code><br />
              3. Operatori aritmetici aditivi <code>+</code>, <code>-</code><br />
              4. Relaționali <code>&lt;</code>, <code>&gt;</code>, <code>==</code>, <code>!=</code><br />
              5. Logici <code>&&</code>, apoi <code>||</code>
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-600" />
              Conversia Explicită (Type Casting)
            </div>
            <p className="text-slate-600 text-xs">
              Pentru a forța o împărțire reală între două variabile întregi <code>a</code> și <code>b</code>,
              scriem <code>(double)a / b</code> sau împărțim la <code>2.0</code> în loc de <code>2</code>.
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
              Simulator Interactiv: Clinica de Depanare (Repară cele 4 Erori Capcană)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Stare Depanare:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              fixedCount === bugs.length ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {fixedCount} / {bugs.length} Erori Rezolvate
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
                    {bug.title}
                  </h4>
                </div>
                {!bug.isFixed ? (
                  <button
                    onClick={() => handleFixBug(bug.id)}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Aplică Corecția Canonică</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Bug Remediat cu Succes!
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 text-rose-300 rounded-xl border border-rose-900/40">
                  <div className="text-[10px] uppercase font-bold text-rose-400 mb-1">
                    Cod Eronat (Înainte):
                  </div>
                  <pre className="whitespace-pre-wrap">{bug.buggyCode}</pre>
                  <div className="text-[10px] text-rose-400 mt-2 border-t border-rose-900/50 pt-1">
                    ⚠️ {bug.compilerErrorMsg}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  bug.isFixed
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                    Cod Canonic Corectat (După):
                  </div>
                  <pre className="whitespace-pre-wrap">
                    {bug.isFixed ? bug.fixedCode : '// Apasă pe butonul roșu pentru a aplica patch-ul'}
                  </pre>
                  {bug.isFixed && (
                    <div className="text-[10px] text-emerald-400 mt-2 border-t border-emerald-900/50 pt-1">
                      ✅ {bug.explanation}
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
            Verificare Pedagogică: Prioritate și Depanare (Manual pag. 63–64)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Care este rezultatul evaluării expresiei C++ <code>2 + 3 * 4</code> și de ce?
            </span>
            <QuestionHint
              hint="Manual pag. 63: Operatorul de înmulțire * are prioritate superioară față de operatorul de adunare +."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. 20 (deoarece 2 + 3 = 5, apoi 5 * 4 = 20)' },
              { id: 'opt_b', label: 'B. 14 (deoarece înmulțirea 3 * 4 = 12 se efectuează prima, apoi 2 + 12 = 14)' },
              { id: 'opt_c', label: 'C. 24' },
              { id: 'opt_d', label: 'D. Se produce o eroare de compilare' }
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
              explanation="Corect! Exact ca în algebră, operatorii multiplicativi (*, /, %) au prioritate mai mare decât cei aditivi (+, -). Astfel, mai întâi se calculează 3 * 4 = 12, iar apoi 2 + 12 = 14."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Ai două variabile întregi <code>int a = 7, b = 2;</code> și dorești să calculezi media lor reală (3.5) într-o variabilă <code>double m;</code>. Care formulă este corectă?
            </span>
            <QuestionHint
              hint="Manual pag. 63: Pentru ca rezultatul să conțină zecimale, cel puțin unul dintre termeni trebuie să fie de tip real (double), fie împărțind la 2.0, fie prin conversie explicită (double)a."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. m = (a + b) / 2; (care ar da 3.0 din cauza împărțirii întregi)' },
              { id: 'opt_b', label: 'B. m = (a + b) / 2.0; sau m = (double)(a + b) / 2;' },
              { id: 'opt_c', label: 'C. m = (a + b) % 2;' },
              { id: 'opt_d', label: 'D. m = (a + b) / 0;' }
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
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Împărțind la `2.0` (constantă reală double) sau aplicând conversia `(double)(a + b)`, forțăm compilatorul C++ să execute o împărțire reală cu zecimale, obținând corect valoarea 3.5."
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
        nextLabel="Continuă cu Lecția 7: Evaluarea Sumativă Oficială Modulul 3A"
      />
    </div>
  );
};
