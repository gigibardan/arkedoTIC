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
import { useLanguage } from '../../../context/LanguageContext';
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
  const { lang } = useLanguage();
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
    ? (lang === 'en'
      ? `<nav>
  <ul>
    <li>Home</li>
    <li>Courses
      <ul>
        <li>Computer Science & ICT</li>
        <li>Robotics</li>
      </ul>
    </li>
    <li>Contact</li>
  </ul>
</nav>`
      : `<nav>
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
</nav>`)
    : listType === 'ul'
    ? (lang === 'en'
      ? `<ul>
  <li>Hardware components (CPU, RAM, SSD)</li>
  <li>Input peripherals (Keyboard, Mouse)</li>
  <li>Output peripherals (Monitor, Printer)</li>
</ul>`
      : `<ul>
  <li>Componente hardware (CPU, RAM, SSD)</li>
  <li>Periferice de intrare (Tastatură, Mouse)</li>
  <li>Periferice de ieșire (Monitor, Imprimantă)</li>
</ul>`)
    : (lang === 'en'
      ? `<ol type="${olTypeAttr}">
  <li>Powering on the PC (POST / BIOS)</li>
  <li>Loading the operating system</li>
  <li>Launching the web browser</li>
  <li>Entering the website URL</li>
</ol>`
      : `<ol type="${olTypeAttr}">
  <li>Pornirea calculatorului (POST / BIOS)</li>
  <li>Încărcarea sistemului de operare</li>
  <li>Lansarea browserului web</li>
  <li>Introducerea adresei URL</li>
</ol>`);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Pages 41–42' : 'Manual Art Klett 2025 • Pag. 41–42'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ListOrdered className="w-8 h-8 text-emerald-400" />
              {lang === 'en'
                ? 'Level 4: Ordered, Unordered Lists & Nested Menus'
                : 'Nivelul 4: Liste Ordonate, Neordonate & Meniuri Imbricate'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Discover why <ul> and <ol> lists form the foundation of every modern web navigation menu, learning numbering attributes and <li> nesting.'
                : 'Descoperă de ce listele <ul> și <ol> stau la baza fiecărui meniu de navigare web modern, învățând atributele de numerotare și imbricarea etichetelor <li>.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Active Type' : 'Tip Activ'}
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {isNestedMenu ? (lang === 'en' ? 'Nav Menu' : 'Meniu Nav') : listType.toUpperCase()}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'List Architecture' : 'Arhitectură Liste'}
            </div>
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
              <h2 className="text-lg font-bold text-white">
                {lang === 'en' ? 'HTML5 Dynamic List Configurator' : 'Configuratorul Dinamic de Liste HTML5'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Toggle settings to generate code and observe live browser rendering'
                  : 'Comută opțiunile pentru a genera codul și a vedea randarea'}
              </p>
            </div>
          </div>

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { sounds.playClick(); setIsNestedMenu(false); setListType('ol'); }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !isNestedMenu && listType === 'ol'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              {lang === 'en' ? 'Ordered (<ol>)' : 'Ordonată (<ol>)'}
            </button>
            <button
              onClick={() => { sounds.playClick(); setIsNestedMenu(false); setListType('ul'); }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !isNestedMenu && listType === 'ul'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
              {lang === 'en' ? 'Unordered (<ul>)' : 'Neordonată (<ul>)'}
            </button>
            <button
              onClick={() => { sounds.playClick(); setIsNestedMenu(true); }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isNestedMenu
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Menu className="w-4 h-4" />
              {lang === 'en' ? 'Nested Menu' : 'Meniu Imbricat'}
            </button>
          </div>
        </div>

        {/* OL Type Selector (if ordered list selected) */}
        {!isNestedMenu && listType === 'ol' && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-300">
              {lang === 'en'
                ? 'Select type attribute for <ol> (Textbook p. 42):'
                : 'Alege atributul type pentru <ol> (Manual pag. 42):'}
            </span>
            <div className="flex items-center gap-2">
              {[
                { val: '1', label: lang === 'en' ? '1, 2, 3 (Arabic numbers)' : '1, 2, 3 (Numere arabe)' },
                { val: 'A', label: lang === 'en' ? 'A, B, C (Uppercase letters)' : 'A, B, C (Litere mari)' },
                { val: 'a', label: lang === 'en' ? 'a, b, c (Lowercase letters)' : 'a, b, c (Litere mici)' },
                { val: 'I', label: lang === 'en' ? 'I, II, III (Uppercase Roman)' : 'I, II, III (Romane mari)' },
                { val: 'i', label: lang === 'en' ? 'i, ii, iii (Lowercase Roman)' : 'i, ii, iii (Romane mici)' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => { sounds.playClick(); setOlTypeAttr(opt.val as any); }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
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
                <Code2 className="w-4 h-4" /> {lang === 'en' ? 'HTML Source Code' : 'Cod Sursă HTML'}
              </span>
              <span className="text-[10px] text-slate-500">{lang === 'en' ? 'Canonical structure' : 'Structură canonică'}</span>
            </div>
            <pre className="text-emerald-200 overflow-x-auto leading-relaxed py-2">
              {generatedCode}
            </pre>
          </div>

          {/* Rendered Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sky-400" />
                {lang === 'en' ? 'Browser Display' : 'Afișare în Browser'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Render Output</span>
            </div>

            <div className="p-6 bg-white text-slate-900 flex-1 min-h-[160px] flex flex-col justify-center">
              {isNestedMenu ? (
                <nav className="bg-slate-100 p-3 rounded-xl border border-slate-300 text-xs">
                  <div className="font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {lang === 'en' ? 'Simulated Navigation Menu:' : 'Simulare Meniu Navigare:'}
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="font-semibold text-blue-600 cursor-pointer hover:underline">
                      {lang === 'en' ? 'Home' : 'Acasă'}
                    </li>
                    <li className="font-semibold text-blue-600">
                      {lang === 'en' ? 'Courses' : 'Cursuri'}
                      <ul className="list-circle pl-5 mt-1 space-y-0.5 text-slate-700">
                        <li className="hover:text-blue-600 cursor-pointer">
                          {lang === 'en' ? 'Computer Science & ICT (8th Grade)' : 'Informatică & TIC (Clasa a VIII-a)'}
                        </li>
                        <li className="hover:text-blue-600 cursor-pointer">
                          {lang === 'en' ? 'Educational Robotics' : 'Robotică Educațională'}
                        </li>
                      </ul>
                    </li>
                    <li className="font-semibold text-blue-600 cursor-pointer hover:underline">
                      {lang === 'en' ? 'Contact' : 'Contact'}
                    </li>
                  </ul>
                </nav>
              ) : listType === 'ul' ? (
                <ul className="list-disc pl-6 space-y-2 text-sm text-slate-800">
                  {lang === 'en' ? (
                    <>
                      <li>Hardware components (CPU, RAM, SSD)</li>
                      <li>Input peripherals (Keyboard, Mouse)</li>
                      <li>Output peripherals (Monitor, Printer)</li>
                    </>
                  ) : (
                    <>
                      <li>Componente hardware (CPU, RAM, SSD)</li>
                      <li>Periferice de intrare (Tastatură, Mouse)</li>
                      <li>Periferice de ieșire (Monitor, Imprimantă)</li>
                    </>
                  )}
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
                  {lang === 'en' ? (
                    <>
                      <li>Powering on the PC (POST / BIOS)</li>
                      <li>Loading the operating system</li>
                      <li>Launching the web browser</li>
                      <li>Entering the website URL</li>
                    </>
                  ) : (
                    <>
                      <li>Pornirea calculatorului (POST / BIOS)</li>
                      <li>Încărcarea sistemului de operare</li>
                      <li>Lansarea browserului web</li>
                      <li>Introducerea adresei URL</li>
                    </>
                  )}
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
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Structural Role of Lists'
                : 'Reflecție Pedagogică: Rolul Structural al Listelor'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Art Klett Manual pages 41–42' : 'Manual Art Klett pag. 41–42'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '1. Which tag is strictly used to define every individual item inside any HTML list (whether ordered or unordered)?'
              : '1. Ce etichetă este utilizată pentru a defini fiecare element individual din interiorul unei liste (fie ea ordonată sau neordonată)?'}
          </div>
          <QuestionHint
            hintRo="Prescurtare de la „List Item”."
            hintEn="Short for 'List Item'."
          />
          <div className="space-y-2">
            {[
              {
                textRo: '<li> (List Item) — etichetă pereche ce marchează fiecare rând dintr-o listă <ul> sau <ol>',
                textEn: '<li> (List Item) — paired element marking each individual line inside a <ul> or <ol> list',
                correct: true
              },
              {
                textRo: '<item> — folosit doar la calculatoare mici',
                textEn: '<item> — used only on small computers',
                correct: false
              },
              {
                textRo: '<line> — folosit pentru linii geometrice',
                textEn: '<line> — used for geometric drawing lines',
                correct: false
              }
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
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l4_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l4_q1'] || 0} />
          )}
          {quizSubmitted['w1_l4_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Textbook page 41: Both <ol> and <ul> tags can directly contain exclusively <li> (List Item) children. Any other text content must be wrapped inside an <li>.'
                : 'Corect! Manual pag. 41: Atât eticheta <ol> cât și <ul> pot conține direct exclusiv etichete <li> (List Item). Orice alt text trebuie plasat în interiorul unui <li>.'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. If you want to create an ordered list numbered with uppercase Roman numerals (I, II, III), which attribute do you append to the list tag?'
              : '2. Dacă dorești să creezi o listă ordonată numerotată cu cifre romane mari (I, II, III), ce atribut adaugi etichetei de listă?'}
          </div>
          <QuestionHint
            hintRo="Observă majuscula literei I în cifrele romane."
            hintEn="Notice the capital letter 'I' in uppercase Roman numerals."
          />
          <div className="space-y-2">
            {[
              {
                textRo: '<ol type="I">',
                textEn: '<ol type="I">',
                correct: true
              },
              {
                textRo: '<ol roman="true">',
                textEn: '<ol roman="true">',
                correct: false
              },
              {
                textRo: '<ul numbers="roman">',
                textEn: '<ul numbers="roman">',
                correct: false
              }
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
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l4_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l4_q2'] || 0} />
          )}
          {quizSubmitted['w1_l4_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exactly! Textbook page 42: The attribute type="I" produces uppercase Roman numbering (I, II, III), while type="i" outputs lowercase Roman numerals (i, ii, iii).'
                : 'Exact! Manual pag. 42: Atributul type="I" generează numerotarea romană cu majuscule (I, II, III), în timp ce type="i" o generează cu minuscule (i, ii, iii).'}
            />
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
        nextLabel={lang === 'en'
          ? 'To Level 5: Hyperlinks & Multimedia Images'
          : 'Spre Nivelul 5: Hiperlegături & Imagini Multimedia'}
      />
    </div>
  );
};
