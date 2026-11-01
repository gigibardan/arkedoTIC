import React, { useState } from 'react';
import {
  Heading,
  Type,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Code,
  Eye,
  Terminal,
  Bold,
  Italic,
  Underline,
  Highlighter
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W1Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const W1Level3_HeadingsAndParagraphsStudio: React.FC<W1Level3Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  // Preset Snippets
  const [activeSnippetKey, setActiveSnippetKey] = useState<string>('headings');
  const [customHtml, setCustomHtml] = useState<string>(
`<h1>Istoria Internetului</h1>
<p>Internetul a transformat modul în care <strong>comunicăm</strong> și învățăm.</p>
<hr>
<h2>1. Rețeaua ARPANET</h2>
<p>Dezvoltată în <em>1969</em>, a reprezentat strămoșul web-ului modern.<br>Primele calculatoare conectate erau universitare.</p>
<h3>1.1 Protocolul TCP/IP</h3>
<p>Creat de Vint Cerf și Bob Kahn, a devenit <mark>standardul universal</mark>.</p>`
  );

  const [testedSnippets, setTestedSnippets] = useState<string[]>(['headings']);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const handleSelectSnippet = (key: string, code: string) => {
    sounds.playClick();
    setActiveSnippetKey(key);
    setCustomHtml(code);
    if (!testedSnippets.includes(key)) {
      setTestedSnippets(prev => [...prev, key]);
    }
  };

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

  const snippetsDone = testedSnippets.length >= 2;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = snippetsDone && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 40–41</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Heading className="w-8 h-8 text-indigo-400" />
              Nivelul 3: Ierarhia Titlurilor & Formatarea Paragrafelor
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Descoperă puterea etichetelor semantice: de la structurarea clară prin &lt;h1&gt;–&lt;h6&gt; până la accentuarea prin &lt;strong&gt;, &lt;em&gt; și &lt;mark&gt;.
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-indigo-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Teme Testate</div>
            <div className="text-2xl font-black text-indigo-400">{testedSnippets.length}/3</div>
            <div className="text-[11px] text-slate-400">Exemple Explorate</div>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            key: 'headings',
            title: 'Ierarhia Titlurilor (h1 - h6)',
            desc: 'Structură logică cu subtitluri',
            code: `<h1>Titlu Principal de Capitol (H1)</h1>
<h2>Subcapitolul 1: Concepte (H2)</h2>
<h3>Detaliu Tehnic (H3)</h3>
<h4>Sub-nivel Aprofundat (H4)</h4>`
          },
          {
            key: 'formatting',
            title: 'Formatare Semantică Text',
            desc: 'strong, em, mark, del, u',
            code: `<p>Acesta este un <strong>text important (strong)</strong>.</p>
<p>Iar acesta conține <em>termeni accentuați (em)</em>.</p>
<p>Preț redus: <del>150 lei</del> la <mark>99 lei</mark>!</p>
<p>Termen <u>subliniat (u)</u> în document.</p>`
          },
          {
            key: 'linebreaks',
            title: 'Paragrafe vs Ruperi de Rând',
            desc: 'Comparație <p> vs <br> vs <hr>',
            code: `<p>Paragraful 1 are spațiere automată sus și jos.</p>
<hr>
<p>Aceasta este o poezie:<br>
Rândul întâi al strofei,<br>
Rândul al doilea fără spațiu vertical mare!</p>`
          }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => handleSelectSnippet(item.key, item.code)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeSnippetKey === item.key
                ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 ring-2 ring-indigo-500/20'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{item.title}</span>
              {testedSnippets.includes(item.key) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <span className="text-[10px] text-slate-400 block truncate mt-0.5">{item.desc}</span>
          </button>
        ))}
      </div>

      {/* Live Split Editor & Render Station */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Code className="w-4 h-4" /> Editor Interactiv de Cod & Previzualizare Live
          </div>
          <span className="text-xs text-slate-400 font-mono">Modifică liber codul HTML din stânga!</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* HTML Source Editor */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-900 mb-2">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Terminal className="w-4 h-4" /> Cod Sursă HTML
              </span>
              <span className="text-[10px] text-slate-500">Editabil</span>
            </div>

            <textarea
              value={customHtml}
              onChange={e => setCustomHtml(e.target.value)}
              rows={12}
              className="w-full bg-transparent text-indigo-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Browser Rendering Simulation */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400" /> Rezultat Randat în Browser
              </span>
              <span className="text-[10px] text-slate-500 font-mono">DOM Rendering</span>
            </div>

            <div
              className="p-6 bg-white text-slate-900 flex-1 overflow-y-auto max-h-[300px] prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: customHtml }}
            />
          </div>
        </div>

        {/* Semantic Tags Guide Pills */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Etichete de Text Esențiale din Manualul de Clasa a VIII-a (pag. 40–41):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <code className="text-sky-400 font-bold">&lt;h1&gt; ... &lt;h6&gt;</code>
              <span className="block text-[10px] text-slate-400 mt-0.5">Ierarhia titlurilor de capitole</span>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <code className="text-emerald-400 font-bold">&lt;strong&gt;</code>
              <span className="block text-[10px] text-slate-400 mt-0.5">Importanță semantică (Bold)</span>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <code className="text-amber-400 font-bold">&lt;em&gt;</code>
              <span className="block text-[10px] text-slate-400 mt-0.5">Accent de vorbire (Italic)</span>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <code className="text-rose-400 font-bold">&lt;br&gt; și &lt;hr&gt;</code>
              <span className="block text-[10px] text-slate-400 mt-0.5">Rupere rând și linie despărțitoare</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Reflecție Pedagogică: Bune Practici în Structurarea Semanțică</h2>
            <p className="text-xs text-slate-400">Manual Art Klett pag. 40–41</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            1. Câte etichete <code className="text-indigo-300 font-mono">&lt;h1&gt;</code> este recomandat să existe pe o singură pagină web conform standardelor moderne și motoarelor de căutare?
          </div>
          <QuestionHint hint="Titlul principal al paginii reprezintă subiectul unic al documentului." />
          <div className="space-y-2">
            {[
              { text: 'Exact o singură etichetă <h1> per pagină, care definește tema centrală a documentului (restul secțiunilor folosind <h2>, <h3> etc.)', correct: true },
              { text: 'Minim 10 etichete <h1> pentru a atrage atenția', correct: false },
              { text: 'Nu contează deloc numărul, se pot folosi oricâte', correct: false }
            ].map((opt, idx) => {
              const qId = 'w1_l3_q1';
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
          {isLocked('w1_l3_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l3_q1'] || 0} />
          )}
          {quizSubmitted['w1_l3_q1'] && (
            <AnswerExplanation explanation="Corect! Manual pag. 40: Regula fundamentală a accesibilității și optimizării pentru motoare de căutare (SEO) este prezența unui singur <h1> pe pagină, urmat de o ierarhie logică descrescătoare." />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            2. Care este diferența dintre eticheta <code className="text-emerald-300 font-mono">&lt;p&gt;</code> și eticheta <code className="text-rose-300 font-mono">&lt;br&gt;</code>?
          </div>
          <QuestionHint hint="Observă spațiul vertical: un paragraf nou lasă spațiu alb dedesubt, pe când break-ul rupe doar rândul curent." />
          <div className="space-y-2">
            {[
              { text: '<p> definește un paragraf complet cu spațiere verticală înainte și după, în timp ce <br> este o etichetă autoînchizătoare ce trece textul pe rândul imediat următor fără spațiu vertical adițional', correct: true },
              { text: '<br> colorează textul în albastru, iar <p> îl șterge', correct: false },
              { text: 'Nu există nicio diferență de afișare', correct: false }
            ].map((opt, idx) => {
              const qId = 'w1_l3_q2';
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
          {isLocked('w1_l3_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l3_q2'] || 0} />
          )}
          {quizSubmitted['w1_l3_q2'] && (
            <AnswerExplanation explanation="Exact! Manual pag. 41: Eticheta <p> marchează unități semantice de idei (paragrafe), în timp ce <br> (break line) forțează o trecere la rând nou (ideală pentru versuri, adrese sau rețete)." />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canFinish}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel="Spre Nivelul 4: Liste Ordonate & Neordonate"
      />
    </div>
  );
};
