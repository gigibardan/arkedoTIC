import React, { useState } from 'react';
import {
  List,
  ListOrdered,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  Code2,
  Eye,
  Sliders,
  Menu
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W1Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const W1Level4_ListsAndNavigationLab: React.FC<W1Level4Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const [listType, setListType] = useState<'ul' | 'ol'>('ol');
  const [olTypeAttr, setOlTypeAttr] = useState<'1' | 'A' | 'a' | 'I' | 'i'>('1');
  const [isNestedMenu, setIsNestedMenu] = useState(false);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const handleQuizAnswer = (qId: string, optIdx: number, isCorrect: boolean) => {
    if (quizSubmitted[qId] || isLocked(qId)) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const quizDone = Object.keys(quizSubmitted).length >= 2;

  // Generate dynamic HTML code string
  const generatedCode = isNestedMenu
    ? `<nav>
  <ul>
    <li>Acasă</li>
    <li>Cursuri
      <ul>
        <li>Informatică & TIC</li>
        <li>Robotică</li>
      </ul>
    </li>
    <li>Contact</li>
  </ul>
</nav>`
    : listType === 'ul'
    ? `<ul>
  <li>Componente hardware (CPU, RAM, SSD)</li>
  <li>Periferice de intrare (Tastatură, Mouse)</li>
  <li>Periferice de ieșire (Monitor, Imprimantă)</li>
</ul>`
    : `<ol type="${olTypeAttr}">
  <li>Pornirea calculatorului (POST / BIOS)</li>
  <li>Încărcarea sistemului de operare</li>
  <li>Lansarea browserului web</li>
  <li>Introducerea adresei URL</li>
</ol>`;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 41–42</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ListOrdered className="w-8 h-8 text-emerald-400" />
              Nivelul 4: Liste Ordonate, Neordonate & Meniuri Imbricate
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Descoperă de ce listele &lt;ul&gt; și &lt;ol&gt; stau la baza fiecărui meniu de navigare web modern, învățând atributele de numerotare și imbricarea etichetelor &lt;li&gt;.
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Tip Activ</div>
            <div className="text-2xl font-black text-emerald-400">
              {isNestedMenu ? 'Meniu Nav' : listType.toUpperCase()}
            </div>
            <div className="text-[11px] text-slate-400">Arhitectură Liste</div>
          </div>
        </div>
      </div>

      {/* Interactive List Configurator Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configuratorul Dinamic de Liste HTML5</h2>
              <p className="text-xs text-slate-400">Comută opțiunile pentru a genera codul și a vedea randarea</p>
            </div>
          </div>

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { sounds.playClick(); setIsNestedMenu(false); setListType('ol'); }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                !isNestedMenu && listType === 'ol'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <ListOrdered className="w-4 h-4" /> Ordonată (&lt;ol&gt;)
            </button>
            <button
              onClick={() => { sounds.playClick(); setIsNestedMenu(false); setListType('ul'); }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                !isNestedMenu && listType === 'ul'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <List className="w-4 h-4" /> Neordonată (&lt;ul&gt;)
            </button>
            <button
              onClick={() => { sounds.playClick(); setIsNestedMenu(true); }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isNestedMenu
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Menu className="w-4 h-4" /> Meniu Imbricat
            </button>
          </div>
        </div>

        {/* OL Type Selector (if ordered list selected) */}
        {!isNestedMenu && listType === 'ol' && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-300">
              Alege atributul <code className="text-emerald-400 font-mono">type</code> pentru &lt;ol&gt; (Manual pag. 42):
            </span>
            <div className="flex items-center gap-2">
              {[
                { val: '1', label: '1, 2, 3 (Numere arabe)' },
                { val: 'A', label: 'A, B, C (Litere mari)' },
                { val: 'a', label: 'a, b, c (Litere mici)' },
                { val: 'I', label: 'I, II, III (Romane mari)' },
                { val: 'i', label: 'i, ii, iii (Romane mici)' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => { sounds.playClick(); setOlTypeAttr(opt.val as any); }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                    olTypeAttr === opt.val
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={opt.label}
                >
                  type="{opt.val}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Split View: HTML Code vs Rendered DOM */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Source Code */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs">
            <div className="text-slate-400 pb-2 border-b border-slate-900 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Code2 className="w-4 h-4" /> Cod Sursă HTML
              </span>
              <span className="text-[10px] text-slate-500">Structură canonică</span>
            </div>
            <pre className="text-emerald-200 overflow-x-auto leading-relaxed py-2">
              {generatedCode}
            </pre>
          </div>

          {/* Rendered Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sky-400" /> Afișare în Browser
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Render Output</span>
            </div>

            <div className="p-6 bg-white text-slate-900 flex-1 min-h-[160px] flex flex-col justify-center">
              {isNestedMenu ? (
                <nav className="bg-slate-100 p-3 rounded-xl border border-slate-300 text-xs">
                  <div className="font-bold text-slate-500 uppercase tracking-wider mb-2">Simulare Meniu Navigare:</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="font-semibold text-blue-600 cursor-pointer hover:underline">Acasă</li>
                    <li className="font-semibold text-blue-600">
                      Cursuri
                      <ul className="list-circle pl-5 mt-1 space-y-0.5 text-slate-700">
                        <li className="hover:text-blue-600 cursor-pointer">Informatică & TIC (Clasa a VIII-a)</li>
                        <li className="hover:text-blue-600 cursor-pointer">Robotică Educațională</li>
                      </ul>
                    </li>
                    <li className="font-semibold text-blue-600 cursor-pointer hover:underline">Contact</li>
                  </ul>
                </nav>
              ) : listType === 'ul' ? (
                <ul className="list-disc pl-6 space-y-2 text-sm text-slate-800">
                  <li>Componente hardware (CPU, RAM, SSD)</li>
                  <li>Periferice de intrare (Tastatură, Mouse)</li>
                  <li>Periferice de ieșire (Monitor, Imprimantă)</li>
                </ul>
              ) : (
                <ol
                  className={`pl-6 space-y-2 text-sm text-slate-800 ${
                    olTypeAttr === 'A' ? 'list-[upper-alpha]' :
                    olTypeAttr === 'a' ? 'list-[lower-alpha]' :
                    olTypeAttr === 'I' ? 'list-[upper-roman]' :
                    olTypeAttr === 'i' ? 'list-[lower-roman]' :
                    'list-decimal'
                  }`}
                >
                  <li>Pornirea calculatorului (POST / BIOS)</li>
                  <li>Încărcarea sistemului de operare</li>
                  <li>Lansarea browserului web</li>
                  <li>Introducerea adresei URL</li>
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Reflecție Pedagogică: Rolul Structural al Listelor</h2>
            <p className="text-xs text-slate-400">Manual Art Klett pag. 41–42</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            1. Ce etichetă este utilizată pentru a defini fiecare element individual din interiorul unei liste (fie ea ordonată sau neordonată)?
          </div>
          <QuestionHint hint="Prescurtare de la „List Item”." />
          <div className="space-y-2">
            {[
              { text: '<li (List Item) — etichetă pereche ce marchează fiecare rând dintr-o listă <ul> sau <ol>', correct: true },
              { text: '<item> — folosit doar la calculatoare mici', correct: false },
              { text: '<line> — folosit pentru linii geometrice', correct: false }
            ].map((opt, idx) => {
              const qId = 'w1_l4_q1';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l4_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l4_q1'] || 0} />
          )}
          {quizSubmitted['w1_l4_q1'] && (
            <AnswerExplanation explanation="Corect! Manual pag. 41: Atât eticheta <ol> cât și <ul> pot conține direct exclusiv etichete <li> (List Item). Orice alt text trebuie plasat în interiorul unui <li>." />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            2. Dacă dorești să creezi o listă ordonată numerotată cu cifre romane mari (I, II, III), ce atribut adaugi etichetei de listă?
          </div>
          <QuestionHint hint="Observă majuscula literei I în cifrele romane." />
          <div className="space-y-2">
            {[
              { text: '<ol type="I">', correct: true },
              { text: '<ol roman="true">', correct: false },
              { text: '<ul numbers="roman">', correct: false }
            ].map((opt, idx) => {
              const qId = 'w1_l4_q2';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l4_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l4_q2'] || 0} />
          )}
          {quizSubmitted['w1_l4_q2'] && (
            <AnswerExplanation explanation="Exact! Manual pag. 42: Atributul type='I' generează numerotarea romană cu majuscule (I, II, III), în timp ce type='i' o generează cu minuscule (i, ii, iii)." />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={quizDone}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel="Spre Nivelul 5: Hiperlegături & Imagini Multimedia"
      />
    </div>
  );
};
