import React, { useState } from 'react';
import { Keyboard, CheckCircle2, AlertTriangle, Sparkles, BookOpen, Bug, Check, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { PageNavigationFooter } from './PageNavigationFooter';
import { AnswerExplanation } from './AnswerExplanation';
import { QuestionHint } from './QuestionHint';

interface TLevel2Props {
  onCompletePage: (score: number) => void;
}

interface TypoError {
  id: string;
  incorrectSnippet: string;
  correctSnippet: string;
  explanationRo: string;
  explanationEn: string;
  ruleTitleRo: string;
  ruleTitleEn: string;
}

const TYPO_ERRORS: TypoError[] = [
  {
    id: 'space_before_comma',
    incorrectSnippet: 'calculatoarele , laptopurile',
    correctSnippet: 'calculatoarele, laptopurile',
    ruleTitleRo: 'Semnul de punctuație se lipește de cuvânt',
    ruleTitleEn: 'No space before punctuation',
    explanationRo: 'Virgula se lipește direct de cuvântul dinainte! Spațiul se pune DOAR după virgulă.',
    explanationEn: 'The comma attaches directly to the preceding word! Space comes strictly after punctuation.',
  },
  {
    id: 'no_space_after_period',
    incorrectSnippet: 'sunt rapide.Ele ne ajută',
    correctSnippet: 'sunt rapide. Ele ne ajută',
    ruleTitleRo: 'Spațiu obligatoriu după punct',
    ruleTitleEn: 'Space mandatory after period',
    explanationRo: 'După punct (.) este obligatoriu să pui un spațiu înainte de noul cuvânt început cu majusculă!',
    explanationEn: 'After a period, you must always press the spacebar before starting the next capitalized word.',
  },
  {
    id: 'unnecessary_enter',
    incorrectSnippet: 'la teme [ENTER]\nîn fiecare zi',
    correctSnippet: 'la teme în fiecare zi',
    ruleTitleRo: 'Nu apăsa ENTER la sfârșitul fiecărui rând!',
    ruleTitleEn: 'Word Wrap handles line breaks automatically',
    explanationRo: 'Tasta ENTER se apasă doar când începi un paragraf nou! Calculatorul trece automat la rândul următor (Word Wrap).',
    explanationEn: 'Press ENTER only to start a new paragraph! The word processor wraps lines automatically.',
  },
  {
    id: 'spaces_around_hyphen',
    incorrectSnippet: 'într - un laborator',
    correctSnippet: 'într-un laborator',
    ruleTitleRo: 'Cratima fără spații',
    ruleTitleEn: 'Hyphen without spaces',
    explanationRo: 'Cratima (liniuța de legătură) se tastează fără spații în cuvinte compuse (într-un, s-au).',
    explanationEn: 'Hyphens join compound word elements without any spaces around them.',
  },
  {
    id: 'english_quotes',
    incorrectSnippet: '"TIC"',
    correctSnippet: '„TIC”',
    ruleTitleRo: 'Ghilimele românești („jos” și ”sus”)',
    ruleTitleEn: 'Romanian typography quotes',
    explanationRo: 'În limba română deschidem ghilimelele jos („) și le închidem sus (”).',
    explanationEn: 'Standard Romanian typography opens quotes at the base („) and closes at the top (”).',
  },
];

export const TLevel2_TypingRules: React.FC<TLevel2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Solved errors in interactive lab
  const [fixedErrors, setFixedErrors] = useState<{ [id: string]: boolean }>({});

  // Quiz questions
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleFixError = (err: TypoError) => {
    sounds.playCorrect();
    setFixedErrors((prev) => ({ ...prev, [err.id]: true }));
    arky.triggerSuccess(
      lang === 'en'
        ? `Fixed! ${err.ruleTitleEn}`
        : `Excelent! Ai aplicat regula: ${err.ruleTitleRo}!`
    );
  };

  const handleQ1 = (val: string) => {
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'backspace') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleQ2 = (val: string) => {
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'wrap') sounds.playCorrect();
    else sounds.playWrong();
  };

  const fixedCount = Object.keys(fixedErrors).length;
  const isQ1Correct = q1Answer === 'backspace';
  const isQ2Correct = q2Answer === 'wrap';

  let correctTotal = 0;
  if (fixedCount === TYPO_ERRORS.length) correctTotal += 1;
  if (isQ1Correct) correctTotal += 1;
  if (isQ2Correct) correctTotal += 1;

  const totalQuestions = 3;
  const earnedScore = Math.round((correctTotal / totalQuestions) * 15);
  const canProceed = fixedCount >= 3;

  const handleReset = () => {
    sounds.playClick();
    setFixedErrors({});
    setQ1Answer(null);
    setQ2Answer(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-blue-950/60 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Module 4 • Page 2 of 7' : 'Modulul 4 • Pagina 2 din 7'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'en' ? 'Golden Rules of Typing & Special Keys' : 'Regulile de Aur ale Tehnoredactării & Taste Speciale'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Master professional typing hygiene (Textbook pp. 53–55): punctuation spacing, Word Wrap, Backspace vs Delete, and Romanian typography.'
                : 'Stăpânește tehnoredactarea corectă (Manual pag. 53–55): spațierea semnelor de punctuație, trecerea automată la rând nou, Backspace vs. Delete și diacritice.'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            ⌨️
          </div>
        </div>
      </div>

      {/* Theory Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'en' ? 'Essential Rules (Textbook p. 53)' : 'Regulile de Aur ale Tastării (Manual pag. 53)'}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {lang === 'en' ? 'How to Type Clean, Professional Documents' : 'Cum scriem corect pe calculator ca un profesionist'}
        </h2>

        {/* 4 Golden Rules Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase mb-1">
              <CheckCircle2 className="w-4 h-4" /> Regula 1: Punctuația și Spațiul
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Punctuation marks (. , ! ? : ;) attach directly to the preceding word, followed by EXACTLY one space. Never put a space before a comma or period!'
                : 'Semnele de punctuație (. , ! ? : ;) se lipesc DIRECT de cuvântul dinainte și sunt urmate ÎNTOTDEAUNA de un spațiu. Niciodată nu pune spațiu înainte de virgulă sau punct!'}
            </p>
            <div className="mt-2 text-[11px] font-mono bg-slate-900 p-2 rounded-lg text-emerald-300">
              ✓ Corect: calculator, laptop, tabletă.<br />
              <span className="text-rose-400">✗ Greșit: calculator ,laptop , tabletă .</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-blue-500/30">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono uppercase mb-1">
              <CheckCircle2 className="w-4 h-4" /> Regula 2: Tasta ENTER și Word Wrap
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Word processors wrap lines automatically (Word Wrap). Press ENTER only when you finish an entire paragraph, NEVER at the end of every line!'
                : 'Procesorul de text trece automat la rândul următor când textul ajunge la marginea din dreapta. Apasă ENTER DOAR la sfârșitul unui paragraf, NICIODATĂ la final de rând!'}
            </p>
            <div className="mt-2 text-[11px] font-mono bg-slate-900 p-2 rounded-lg text-blue-300">
              ✓ Enter = Paragraf nou (idee nouă)<br />
              <span className="text-amber-400">Shift + Enter = Rând nou în același paragraf</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs font-mono uppercase mb-1">
              <CheckCircle2 className="w-4 h-4" /> Regula 3: Backspace vs. Delete
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Backspace (⌫) erases the character to the LEFT of the cursor. Delete (⌦) erases the character to the RIGHT of the cursor.'
                : 'Tasta Backspace (⌫) șterge caracterul aflat în STÂNGA cursorului. Tasta Delete (Del / ⌦) șterge caracterul aflat în DREAPTA cursorului.'}
            </p>
            <div className="mt-2 text-[11px] font-mono bg-slate-900 p-2 rounded-lg text-purple-300">
              [Litera Stânga] ◄--- |Cursor| ---► [Litera Dreapta]<br />
              <span className="text-slate-400">Backspace (Stânga) • Delete (Dreapta)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono uppercase mb-1">
              <CheckCircle2 className="w-4 h-4" /> Regula 4: Cratima și Ghilimelele
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Hyphens (cratima) are typed with no spaces in compound words (e.g. într-o, s-au). Quotes in Romanian open low („) and close high (”).'
                : 'Cratima (liniuța de unire) se tastează fără niciun spațiu (ex: într-un, de-a lungul). Ghilimelele românești se deschid jos („) și se închid sus (”).'}
            </p>
            <div className="mt-2 text-[11px] font-mono bg-slate-900 p-2 rounded-lg text-amber-300">
              ✓ Corect: cartea „Micul Prinț” s-a vândut.<br />
              <span className="text-rose-400">✗ Greșit: cartea " Micul Prinț " s - a vândut.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Activity: Typo Detective Laboratory */}
      <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
              <Bug className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Interactive Lab • Typo Error Detective' : 'Laborator Interactiv • Detectorul de Greșeli'}
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {lang === 'en' ? 'Fix the 5 Typing Mistakes in this Student Article' : 'Depistează și corectează cele 5 greșeli tipografice!'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">{lang === 'en' ? 'Errors Corrected:' : 'Corectate:'}</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {fixedCount} / {TYPO_ERRORS.length}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Below is a paragraph typed by an unguided student. Click on each highlighted mistake to inspect the rule and correct it instantly!'
            : 'Mai jos este un paragraf tastat neglijent de un începător. Dă click pe fiecare fragment greșit (marcat) pentru a aplica regula și a-l corecta!'}
        </p>

        {/* Paper Document Preview */}
        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl font-sans text-sm sm:text-base leading-relaxed border-4 border-slate-300 select-none">
          <div className="text-center font-bold text-lg mb-4 text-blue-900 border-b pb-2">
            Referat: Tehnologia în Școala Noastră
          </div>

          <p className="indent-6 text-slate-800">
            În laboratorul de informatică,{' '}
            {/* Error 1: Space before comma */}
            {fixedErrors.space_before_comma ? (
              <span className="bg-emerald-100 text-emerald-900 font-semibold px-1 rounded transition-all">
                calculatoarele, laptopurile
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleFixError(TYPO_ERRORS[0])}
                className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded border border-rose-300 underline decoration-wavy decoration-rose-500 cursor-pointer animate-pulse"
                title="Apasă pentru corectare!"
              >
                calculatoarele , laptopurile
              </button>
            )}{' '}
            și tabletele{' '}
            {/* Error 2: No space after period */}
            {fixedErrors.no_space_after_period ? (
              <span className="bg-emerald-100 text-emerald-900 font-semibold px-1 rounded transition-all">
                sunt rapide. Ele ne ajută
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleFixError(TYPO_ERRORS[1])}
                className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded border border-rose-300 underline decoration-wavy decoration-rose-500 cursor-pointer animate-pulse"
                title="Apasă pentru corectare!"
              >
                sunt rapide.Ele ne ajută
              </button>
            )}{' '}
            mult{' '}
            {/* Error 3: Enter pressed mid-sentence */}
            {fixedErrors.unnecessary_enter ? (
              <span className="bg-emerald-100 text-emerald-900 font-semibold px-1 rounded transition-all">
                la teme în fiecare zi
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleFixError(TYPO_ERRORS[2])}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-300 underline decoration-wavy decoration-amber-500 cursor-pointer"
                title="Apasă pentru corectare!"
              >
                la teme [ENTER ↵] în fiecare zi
              </button>
            )}
            , atunci când lucrăm{' '}
            {/* Error 4: Space around hyphen */}
            {fixedErrors.spaces_around_hyphen ? (
              <span className="bg-emerald-100 text-emerald-900 font-semibold px-1 rounded transition-all">
                într-un laborator
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleFixError(TYPO_ERRORS[3])}
                className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded border border-rose-300 underline decoration-wavy decoration-rose-500 cursor-pointer animate-pulse"
                title="Apasă pentru corectare!"
              >
                într - un laborator
              </button>
            )}{' '}
            modern la ora de{' '}
            {/* Error 5: Quotes */}
            {fixedErrors.english_quotes ? (
              <span className="bg-emerald-100 text-emerald-900 font-semibold px-1 rounded transition-all">
                „TIC”
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleFixError(TYPO_ERRORS[4])}
                className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded border border-rose-300 underline decoration-wavy decoration-rose-500 cursor-pointer animate-pulse"
                title="Apasă pentru corectare!"
              >
                "TIC"
              </button>
            )}
            .
          </p>
        </div>

        {/* Live Correction Details Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {TYPO_ERRORS.map((err) => {
            const isFixed = Boolean(fixedErrors[err.id]);
            return (
              <div
                key={err.id}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                  isFixed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                {isFixed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-slate-200">
                    {lang === 'en' ? err.ruleTitleEn : err.ruleTitleRo}
                  </div>
                  <div className="mt-0.5 leading-snug">
                    {lang === 'en' ? err.explanationEn : err.explanationRo}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Textbook Assessment Questions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Keyboard className="w-4 h-4" />
          <span>{lang === 'en' ? 'Textbook Assessment (p. 54, Ex. 3 & 4)' : 'Verificare din Manual (pag. 54, Ex. 3 & 4)'}</span>
        </div>

        {/* Question 1: Backspace vs Delete */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '1. What is the fundamental difference between the Backspace key and the Delete key?'
                : '1. Care este diferența fundamentală dintre tasta Backspace și tasta Delete?'}
            </h4>
            <span className="text-xs font-mono text-indigo-400 font-semibold shrink-0">1 punct</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQ1('backspace')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'backspace'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'Backspace erases LEFT of cursor, Delete erases RIGHT of cursor' : 'Backspace șterge la STÂNGA cursorului, iar Delete șterge la DREAPTA cursorului'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('same')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'same'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'They do exactly the same thing, no difference' : 'Fac exact același lucru, nu există nicio diferență'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('line')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'line'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'Backspace deletes whole files, Delete deletes letters' : 'Backspace șterge fișiere întregi, iar Delete șterge doar litere'}
            </button>
            <button
              type="button"
              onClick={() => handleQ1('capital')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q1Answer === 'capital'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'Delete only works with capital letters' : 'Delete funcționează numai cu litere mari (Caps)'}
            </button>
          </div>

          <QuestionHint
            hintRo="Gândește-te la poziția săgeții de pe tasta Backspace (îndreptată spre stânga ⌫)."
            hintEn="Think of the arrow on Backspace pointing left ⌫."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Perfect! Backspace deletes to the left of the cursor, while Delete pulls in and removes characters to the right.' : 'Exact! Backspace șterge caracterul aflat înaintea cursorului (la stânga), iar Delete îl șterge pe cel de după cursor (la dreapta).')
                  : (lang === 'en' ? 'Incorrect. Remember: Backspace = Left (⌫), Delete = Right (⌦).' : 'Incorect. Reține: Backspace șterge spre stânga (⌫), Delete șterge spre dreapta (Del).')
              }
              ruleReference={lang === 'en' ? 'Textbook page 54 • Editing Keys' : 'Manual pag. 54 • Taste de editare'}
            />
          )}
        </div>

        {/* Question 2: Word Wrap */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '2. What happens when your typed sentence reaches the right margin of the page?'
                : '2. Ce se întâmplă când textul tastat ajunge la marginea din dreapta a paginii?'}
            </h4>
            <span className="text-xs font-mono text-indigo-400 font-semibold shrink-0">1 punct</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQ2('wrap')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'wrap'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'Word Wrap automatically breaks to the next line without pressing ENTER' : 'Procesorul trece automat cuvântul pe rândul următor (Word Wrap), fără să apeși ENTER'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('block')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'block'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'The keyboard locks and beeps loudly' : 'Tastatura se blochează și sună o alarmă'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('cut')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'cut'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'The words are chopped in half and disappear' : 'Cuvintele sunt tăiate în jumătate și dispar'}
            </button>
            <button
              type="button"
              onClick={() => handleQ2('restart')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                q2Answer === 'restart'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'The computer restarts automatically' : 'Calculatorul se repornește automat'}
            </button>
          </div>

          <QuestionHint
            hintRo="Funcția se numește Word Wrap și reprezintă una din cele mai mari invenții ale procesoarelor de text față de vechile mașini de scris."
            hintEn="Called Word Wrap, it automatically transfers whole words to the next line."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! Modern word processors automatically wrap whole words to the next line. You only press Enter when starting a new paragraph.' : 'Corect! Funcția Word Wrap trece automat cuvintele pe noul rând. Tasta Enter se apasă exclusiv pentru un paragraf nou!')
                  : (lang === 'en' ? 'Incorrect. Word processors wrap lines automatically without manual Enter presses.' : 'Incorect. Trecerea la rând nou se face automat prin funcția Word Wrap.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 53 • Word Wrap Principle' : 'Manual pag. 53 • Principiul Word Wrap'}
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctTotal}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => onCompletePage(earnedScore)}
        onRetry={handleReset}
      />
    </div>
  );
};
