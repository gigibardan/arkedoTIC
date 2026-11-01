import React, { useState } from 'react';
import {
  Terminal,
  CornerDownLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Play,
  RotateCcw,
  ArrowRightLeft,
  Layers
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface A1Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A1Level5_InteractiveConsoleIO: React.FC<A1Level5Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Console Simulator state
  const [inputValA, setInputValA] = useState<string>('12');
  const [inputValB, setInputValB] = useState<string>('8');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleRunProgram = () => {
    const a = parseInt(inputValA) || 0;
    const b = parseInt(inputValB) || 0;
    const suma = a + b;
    const produs = a * b;
    const cat = b !== 0 ? Math.trunc(a / b) : 'Eroare (împărțire la 0)';
    const rest = b !== 0 ? a % b : 'Eroare';

    setConsoleOutput(
      `Introduceti a si b: ${a} ${b}\n` +
      `------------------------------------\n` +
      `Suma = ${suma}\n` +
      `Produsul = ${produs}\n` +
      `Catul intreg (a / b) = ${cat}\n` +
      `Restul (a % b) = ${rest}\n\n` +
      `Process returned 0 (0x0)   execution time : 0.003 s`
    );
    setHasExecuted(true);
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

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];
  const canProceed = hasExecuted && allQuizzesPassed;

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Terminal className="w-5 h-5 text-sky-300" />
              <span>Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 5: Fluxurile Interactive de Intrare & Ieșire (cin & cout)
            </h1>
            <p className="text-sky-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 62–63: Stăpânește dialogul cu utilizatorul prin tastatură și monitor:
              operatorul de extracție <code>cin &gt;&gt;</code>, operatorul de inserție <code>cout &lt;&lt;</code>, manipulatorul <code>endl</code> și citirea multiplă.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-sky-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">5 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Fluxurile cin și cout în C++ (Manual pag. 62–63)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              Direcția Săgeților: &gt;&gt; vs &lt;&lt;
            </div>
            <p className="text-slate-600 text-xs">
              • <code>cin &gt;&gt; x;</code> Săgețile arată spre variabilă (datele intră din consolă în <code>x</code>).<br />
              • <code>cout &lt;&lt; x;</code> Săgețile arată spre ecran (datele ies din variabilă către <code>cout</code>).
            </p>
          </div>

          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 space-y-2">
            <div className="font-bold text-sky-900 flex items-center gap-2">
              <CornerDownLeft className="w-4 h-4 text-sky-600" />
              Manipulatorul endl
            </div>
            <p className="text-slate-600 text-xs">
              <code>endl</code> mută cursorul la începutul rândului următor pe ecran (tasta Enter) și golește
              bufferul de ieșire (flush), asigurând afișarea imediată a mesajului.
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Citirea Cascadată (Multiplă)
            </div>
            <p className="text-slate-600 text-xs">
              Putem citi mai multe variabile dintr-o singură instrucțiune: <code>cin &gt;&gt; a &gt;&gt; b;</code>.
              Utilizatorul poate introduce valorile separate fie prin spațiu, fie prin tasta Enter.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive I/O Console Studio */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Consolă C++ de Intrare / Ieșire
            </h3>
          </div>
          <span className="text-xs bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-semibold">
            Laborator I/O
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Source Code View */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col font-mono text-xs">
            <div className="bg-slate-800 px-4 py-2 text-slate-400 border-b border-slate-700">
              main.cpp (Cod Executat)
            </div>
            <div className="p-4 space-y-1 text-slate-200 flex-1 bg-slate-950">
              <div className="text-slate-500">#include &lt;iostream&gt;</div>
              <div className="text-slate-500">using namespace std;</div>
              <div className="text-indigo-400">int main() {'{'}</div>
              <div className="pl-4 text-indigo-300">int a, b;</div>
              <div className="pl-4 text-emerald-400">cin &gt;&gt; a &gt;&gt; b;</div>
              <div className="pl-4 text-cyan-300">cout &lt;&lt; "Suma = " &lt;&lt; a + b &lt;&lt; endl;</div>
              <div className="pl-4 text-cyan-300">cout &lt;&lt; "Produsul = " &lt;&lt; a * b &lt;&lt; endl;</div>
              <div className="pl-4 text-cyan-300">cout &lt;&lt; "Catul = " &lt;&lt; a / b &lt;&lt; endl;</div>
              <div className="pl-4 text-cyan-300">cout &lt;&lt; "Restul = " &lt;&lt; a % b &lt;&lt; endl;</div>
              <div className="pl-4 text-indigo-400">return 0;</div>
              <div className="text-indigo-400">{'}'}</div>
            </div>

            {/* Input Controls */}
            <div className="p-3.5 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400 font-bold uppercase">
                Date de intrare tastatură (cin):
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValA}
                  onChange={(e) => setInputValA(e.target.value)}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                  placeholder="Valoare a"
                />
                <input
                  type="number"
                  value={inputValB}
                  onChange={(e) => setInputValB(e.target.value)}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                  placeholder="Valoare b"
                />
              </div>
              <button
                onClick={handleRunProgram}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Trimite către cin & Execută</span>
              </button>
            </div>
          </div>

          {/* Virtual Terminal Console */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col font-mono text-xs">
            <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 text-slate-300 border-b border-slate-700">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Consola Windows / Terminal Linux</span>
            </div>
            <div className="p-4 bg-black text-emerald-400 flex-1 whitespace-pre-wrap min-h-[220px]">
              {consoleOutput || '// Așteptare date de intrare... Introdu valorile lui a și b, apoi apasă butonul verde.'}
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Fluxurile cin și cout (Manual pag. 62–63)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Care este sensul corect al operatorilor de flux pentru citirea unei variabile <code>x</code> și afișarea unui mesaj pe ecran?
            </span>
            <QuestionHint
              hint="Manual pag. 62: cin folosește operatorul de extracție >> (datele intră în x), iar cout folosește operatorul de inserție << (datele ies pe ecran)."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. cin << x; și cout >> "Mesaj";' },
              { id: 'opt_b', label: 'B. cin >> x; și cout << "Mesaj";' },
              { id: 'opt_c', label: 'C. cin == x; și cout = "Mesaj";' },
              { id: 'opt_d', label: 'D. Nu contează sensul săgeților' }
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
              explanation="Corect! Regula mnemotehnică: la cin săgețile >> indică spre variabilă (extrag din tastatură și pun în variabilă), iar la cout săgețile << trimit datele spre ecran."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Ce face manipulatorul <code>endl</code> într-o secvență de instrucțiuni precum <code>cout &lt;&lt; "Rezultat" &lt;&lt; endl;</code>?
            </span>
            <QuestionHint
              hint="Manual pag. 63: endl provine de la „end line” și simulează apăsarea tastei Enter pe ecran."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Încheie linia curentă de afișare, mută cursorul la începutul rândului următor și golește bufferul' },
              { id: 'opt_b', label: 'B. Șterge tot ce s-a afișat anterior pe ecran' },
              { id: 'opt_c', label: 'C. Oprește execuția programului pentru totdeauna' },
              { id: 'opt_d', label: 'D. Mărește dimensiunea fontului la 48px' }
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
              explanation="Excelent! Manipulatorul `endl` inserează un caracter de linie nouă (`\n`) și realizează acțiunea de „flush” a bufferului, trimițând instantaneu textul către monitor."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={5}
        totalLevels={7}
        isCompleted={canProceed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 6: Clinica de Depanare & Expresii Complexe"
      />
    </div>
  );
};
