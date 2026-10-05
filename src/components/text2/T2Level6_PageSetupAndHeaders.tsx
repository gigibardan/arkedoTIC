import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Columns, 
  Hash, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Printer, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface T2Level6_PageSetupAndHeadersProps {
  onCompletePage: (earnedScore: number) => void;
}

export const T2Level6_PageSetupAndHeaders: React.FC<T2Level6_PageSetupAndHeadersProps> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Page Setup Simulator State
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [marginType, setMarginType] = useState<'normal' | 'narrow'>('normal');
  const [hasHeader, setHasHeader] = useState<boolean>(false);
  const [hasDynamicPageNumber, setHasDynamicPageNumber] = useState<boolean>(false);
  const [manualNumberAttempted, setManualNumberAttempted] = useState<boolean>(false);

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null
  });
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0);
    if (!hasActive) return;
    const t = setInterval(() => {
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const [k, v] of Object.entries(prev)) {
          const val = v as number;
          if (val > 1) next[k] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldowns]);

  const correctAnswers: Record<string, number> = {
    q1: 1, // Peisaj (Landscape) pentru tabele late
    q2: 0, // Câmp automat (Insert -> Page Number)
    q3: 2, // Antet (Header) și Subsol (Footer)
    q4: 1  // A4 (210 x 297 mm)
  };

  const handleSelectAnswer = (qKey: string, optIdx: number) => {
    if ((cooldowns[qKey] || 0) > 0) return;
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [qKey]: optIdx }));
    if (optIdx === correctAnswers[qKey]) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [qKey]: 5 }));
    }
  };

  const handleInsertDynamicPageNum = () => {
    sounds.playSuccess();
    setHasDynamicPageNumber(true);
    setManualNumberAttempted(false);
  };

  const handleAttemptManualNumber = () => {
    sounds.playWrong();
    setManualNumberAttempted(true);
  };

  // Check if setup complete
  const isPageSetupComplete = hasHeader && hasDynamicPageNumber && (marginType === 'normal' || marginType === 'narrow');

  // Scoring
  let correctCount = 0;
  Object.keys(correctAnswers).forEach(k => {
    if (answers[k] === correctAnswers[k]) correctCount++;
  });
  if (isPageSetupComplete) correctCount += 1;
  const totalQuestions = 5;

  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/60 via-slate-900 to-emerald-900/60 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-teal-500/20 border border-teal-400/40 rounded-2xl text-teal-300 text-3xl shrink-0 shadow-inner">
            📄
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 4B • Page 6 of 7' : 'Modulul 4B • Pagina 6 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 80' : 'Manual pag. 80'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? 'Page Setup: Margins, Orientation, Header & Footer' : 'Paginarea Documentului: Margini, Orientare, Antet & Subsol'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Master the final architecture of a document! Set margins, toggle between Portrait and Landscape for wide tables, repeat headers automatically, and insert dynamic page numbers.'
                : 'Stăpânește arhitectura finală a paginii! Configurează marginile foii, alege între Portret și Peisaj (Landscape), repetă antetul automat pe toate paginile și inserează numere de pagină dinamice!'}
            </p>
          </div>
        </div>
      </div>

      {/* Theory & Concepts Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-teal-400 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5" />
          <span>{lang === 'en' ? 'Page Architecture Foundations' : 'Elementele de Bază ale Paginării'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">📐</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Margins (Margini)' : 'Marginile Paginii (Margins)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'The empty buffer space between the physical paper edge and the typed text. Normal is 2.54 cm; Narrow is 1.27 cm.'
                : 'Spațiul liber lăsat între marginea fizică a foii și textul scris. Margini Normale: 2.54 cm; Înguste: 1.27 cm.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">🧭</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Orientation (Orientare)' : 'Orientarea (Portret vs. Peisaj)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Portrait (Vertical) is ideal for standard essays. Landscape (Horizontal) is chosen for wide multi-column tables and diplomas.'
                : 'Portret (Vertical) pentru referate obișnuite. Peisaj / Landscape (Orizontal) pentru tabele late cu multe coloane și diplome.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">📑</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Header & Footer (Antet & Subsol)' : 'Antet & Subsol (Header & Footer)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Special top and bottom zones that repeat consistently on every page, holding the book title, author, and automatic page numbers.'
                : 'Zone speciale în partea de sus (Antet) și de jos (Subsol) a fiecărei pagini ce repetă automat titlul, autorul și numărul de pagină.'}
            </p>
          </div>
        </div>

        {/* Trap Warning Box: Automatic Page Numbers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-950/60 border border-rose-500/40 flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 text-xl shrink-0">
            ⚠️
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-rose-300">
              {lang === 'en' ? 'Crucial Mistake to Avoid: Never Type Page Numbers Manually!' : 'Atenție la Capcana Clasică: Nu tasta niciodată numărul de pagină manual!'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en' ? (
                <>
                  If you manually type the digit <strong>"1"</strong> in the footer, every single page in your entire document will say <strong>"Page 1"</strong>! Always insert the dynamic field via <strong>Insert &gt; Page Number</strong> so Word increments it automatically!
                </>
              ) : (
                <>
                  Dacă scrii de la tastatură cifra <strong>„1”</strong> în subsol, absolut toate paginile documentului tău vor avea scris <strong>„Pagina 1”</strong>! Numărul de pagină trebuie inserat obligatoriu prin comanda automată <strong>Inserare &gt; Număr de pagină</strong>!
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Page Setup Console */}
      <div className="bg-slate-900/90 border border-teal-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Interactive Page Setup & Printing Console' : 'Consola Interactivă de Paginare & Tipar'}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/40">
            {lang === 'en' ? 'Step 1: Setup Console' : 'Pasul 1: Simulator Configurare'}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase font-mono">
            {lang === 'en' ? 'Page Layout Toolbar:' : 'Bara de Instrumente Paginare (Page Layout):'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Orientation */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:border-slate-500 flex items-center justify-between transition cursor-pointer"
            >
              <span>{lang === 'en' ? 'Orientation:' : 'Orientare:'}</span>
              <span className="font-mono text-cyan-400">
                {orientation === 'portrait' ? 'Portret (Vertical) 📄' : 'Peisaj (Orizontal) 🖼️'}
              </span>
            </button>

            {/* Margins */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setMarginType(prev => prev === 'normal' ? 'narrow' : 'normal');
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:border-slate-500 flex items-center justify-between transition cursor-pointer"
            >
              <span>{lang === 'en' ? 'Margins:' : 'Margini:'}</span>
              <span className="font-mono text-cyan-400">
                {marginType === 'normal' ? 'Normale (2.54 cm)' : 'Înguste (1.27 cm)'}
              </span>
            </button>

            {/* Header Toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setHasHeader(!hasHeader);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                hasHeader
                  ? 'bg-teal-950/80 border-teal-400 text-teal-200'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{lang === 'en' ? 'Header (Antet)' : 'Antet Document'}</span>
              <span>{hasHeader ? '✓ Activ' : '+ Adaugă'}</span>
            </button>

            {/* Page Number Mode */}
            <button
              type="button"
              onClick={handleInsertDynamicPageNum}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                hasDynamicPageNumber
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-md'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:brightness-110 shadow-lg'
              }`}
            >
              <span>{hasDynamicPageNumber ? 'Câmp Dinamic ✓' : 'Inserează Nr. Pagină'}</span>
              <Hash className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Sheet of Paper Rendering */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950/90 rounded-2xl border-2 border-slate-700 relative overflow-hidden min-h-[360px]">
          {/* Virtual Paper Sheet */}
          <div
            className={`bg-white text-slate-900 shadow-2xl transition-all duration-300 flex flex-col justify-between font-sans border-2 border-slate-300 relative ${
              orientation === 'portrait'
                ? 'w-[280px] sm:w-[340px] h-[400px] sm:h-[460px] rounded-lg'
                : 'w-[360px] sm:w-[480px] h-[260px] sm:h-[320px] rounded-lg'
            } ${marginType === 'narrow' ? 'p-3 sm:p-4' : 'p-6 sm:p-7'}`}
          >
            {/* Header Region */}
            <div className={`border-b pb-1 flex items-center justify-between text-[10px] font-mono text-slate-500 ${hasHeader ? 'opacity-100 border-slate-300' : 'opacity-25 border-dashed border-slate-300'}`}>
              <span>{hasHeader ? 'ȘCOALA GIMNAZIALĂ ARKYEDU • PROIECT TIC' : '[ Antet necompletat ]'}</span>
              <span>{hasHeader ? 'CLASA A V-A' : ''}</span>
            </div>

            {/* Document Body Simulation */}
            <div className="my-auto space-y-2 text-[10px] sm:text-xs text-slate-700">
              <div className="h-3 bg-slate-200 rounded w-3/4 mb-3" />
              <p className="leading-snug">
                Documentele oficiale și referatele școlare necesită o paginare riguroasă. O foaie în format <strong>A4</strong> asigură compatibilitatea internațională la imprimare.
              </p>
              <div className="p-2 bg-slate-100 rounded border border-slate-200 text-[9px] font-mono">
                {orientation === 'landscape'
                  ? '📊 Mod Peisaj (Landscape): Ideal pentru tabele late cu multe coloane sau orare!'
                  : '📄 Mod Portret (Portrait): Standard pentru compuneri și texte uzuale.'}
              </div>
            </div>

            {/* Footer Region */}
            <div className="border-t border-slate-300 pt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Raport Ecologie & Tehnologie</span>
              <span className={hasDynamicPageNumber ? 'font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded' : 'text-slate-400'}>
                {hasDynamicPageNumber ? 'Pagina 1 din 1 (Auto)' : '[ Fără număr ]'}
              </span>
            </div>
          </div>

          {/* Test Manual Mistake Trap */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Vrei să testezi capcana?</span>
            <button
              type="button"
              onClick={handleAttemptManualNumber}
              className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Tastează manual cifra „1” în subsol
            </button>
          </div>

          {manualNumberAttempted && (
            <div className="mt-2 p-2.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
              <span>⚠️ Capcană detectată! Dacă tastezi „1”, pe toate paginile va apărea cifra 1! Folosește butonul „Câmp Dinamic”.</span>
            </div>
          )}
        </div>

        {/* Status Check */}
        <div className="pt-2 flex items-center justify-between text-xs font-mono">
          {isPageSetupComplete ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'en' ? 'Page layout, header and dynamic page number configured! (+1 pt)' : 'Paginare completă: antet activat și numerotare automată inserată! (+1 pct)'}
            </span>
          ) : (
            <span className="text-amber-400">
              ⚡ {lang === 'en' ? 'Activate Header and insert Dynamic Page Number to complete!' : 'Activează Antetul și inserează Numărul de pagină automat!'}
            </span>
          )}
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Page Architecture' : 'Verifică-ți Cunoștințele: Arhitectura Paginii'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-teal-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 4' : 'Întrebarea 1 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'When designing a wide timetable with 7 columns or a diploma, which page orientation is recommended?'
              : 'Dacă trebuie să creezi un orar mare cu 7 coloane sau o diplomă lată, ce orientare a paginii este recomandată?'}
          </div>

          {cooldowns.q1 > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza orientarea paginii înainte de a alege o altă variantă."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on page orientation before choosing another option."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Portrait (Vertical)' : 'A) Portret (Vertical)',
              lang === 'en' ? 'B) Landscape / Peisaj (Orizontal)' : 'B) Vedere / Peisaj (Landscape - Orizontal)',
              lang === 'en' ? 'C) Inverted Portrait' : 'C) Portret răsturnat',
              lang === 'en' ? 'D) Square orientation' : 'D) Pătrat'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleSelectAnswer('q1', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q1 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  answers.q1 === idx
                    ? idx === correctAnswers.q1
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q1_orientation"
            hintRo="Foaia așezată pe orizontală oferă mai multă lățime pentru coloane numeroase."
            hintEn="A horizontally oriented sheet provides significantly more width for multiple columns."
          />

          {answers.q1 !== null && (
            <AnswerExplanation
              isCorrect={answers.q1 === correctAnswers.q1}
              cooldown={cooldowns.q1}
              explanation={
                answers.q1 === correctAnswers.q1
                  ? (lang === 'en' ? 'Correct! Landscape (Orizontal) accommodates wide tables with ease.' : 'Corect! Orientarea Peisaj/Vedere (Landscape) este ideală pentru tabele late sau diplome.')
                  : (lang === 'en' ? 'Incorrect. For wide tables, choose Landscape.' : 'Incorect. Pentru documente late cu multe coloane se alege orientarea Peisaj (Landscape).')
              }
              ruleReference="Manual TIC pag. 80"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-teal-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 4' : 'Întrebarea 2 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'How should page numbers be inserted so they increment automatically (1, 2, 3...) across a multi-page book?'
              : 'Cum trebuie adăugate numerele de pagină pentru a se incrementa automat (1, 2, 3...) pe toate paginile unei cărți?'}
          </div>

          {cooldowns.q2 > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza inserarea automată a numerelor de pagină."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on automatic page number fields."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Via Insert > Page Number (dynamic field)' : 'A) Prin comanda automată Inserare > Număr de pagină (câmp dinamic)',
              lang === 'en' ? 'B) By typing "1" manually on each page' : 'B) Tastând manual cifra „1” în subsol',
              lang === 'en' ? 'C) By using the Spacebar' : 'C) Apăsând tasta Space de 100 de ori',
              lang === 'en' ? 'D) Page numbers are drawn by hand with a pen after printing' : 'D) Doar scriind cu pixul pe foaie după tipărire'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleSelectAnswer('q2', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q2 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  answers.q2 === idx
                    ? idx === correctAnswers.q2
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q2_pagenum"
            hintRo="Numărul trebuie să fie un câmp automat care se calculează singur la fiecare filă."
            hintEn="The number must be an automatic dynamic field calculated by the software on each leaf."
          />

          {answers.q2 !== null && (
            <AnswerExplanation
              isCorrect={answers.q2 === correctAnswers.q2}
              cooldown={cooldowns.q2}
              explanation={
                answers.q2 === correctAnswers.q2
                  ? (lang === 'en' ? 'Spot on! Dynamic page number fields calculate page counts automatically.' : 'Exact! Inserare > Număr de pagină introduce un cod inteligent ce actualizează automat numărul pe fiecare filă.')
                  : (lang === 'en' ? 'Incorrect. Always use the automated Insert > Page Number command.' : 'Incorect. Tastarea manuală duplică aceeași cifră pe toate paginile. Se folosește comanda automată.')
              }
              ruleReference="Manual TIC pag. 80"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-teal-400 uppercase font-mono">
            {lang === 'en' ? 'Question 3 of 4' : 'Întrebarea 3 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What are the top and bottom repetitive document regions called?'
              : 'Cum se numesc zonele speciale din partea de sus și de jos a foii care se repetă identic pe toate paginile?'}
          </div>

          {cooldowns.q3 > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q3}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza rolul antetului și subsolului."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on headers and footers."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Ribbon and Ruler' : 'A) Ribbon și Riglă',
              lang === 'en' ? 'B) Paragraph and Sentence' : 'B) Paragraf și Propoziție',
              lang === 'en' ? 'C) Header (Antet) and Footer (Subsol)' : 'C) Antet (Header) și Subsol (Footer)',
              lang === 'en' ? 'D) Recycle Bin' : 'D) Coș de reciclare'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns.q3 || 0) > 0}
                onClick={() => handleSelectAnswer('q3', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q3 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  answers.q3 === idx
                    ? idx === correctAnswers.q3
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q3_headerfooter"
            hintRo="Sus este Antetul (Header), iar jos este Subsolul (Footer)."
            hintEn="At the top sits the Header, and at the bottom rests the Footer."
          />

          {answers.q3 !== null && (
            <AnswerExplanation
              isCorrect={answers.q3 === correctAnswers.q3}
              cooldown={cooldowns.q3}
              explanation={
                answers.q3 === correctAnswers.q3
                  ? (lang === 'en' ? 'Correct! Header sits at the top margin, Footer at the bottom margin.' : 'Corect! Antetul și subsolul oferă consistență profesională întregii cărți sau referat.')
                  : (lang === 'en' ? 'Incorrect. The regions are Header (Antet) and Footer (Subsol).' : 'Incorect. Cele două zone se numesc Antet (Header) și Subsol (Footer).')
              }
              ruleReference="Manual TIC pag. 80"
            />
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-teal-400 uppercase font-mono">
            {lang === 'en' ? 'Question 4 of 4' : 'Întrebarea 4 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What is the standard European paper format used in schools, offices, and printers, measuring 210 x 297 mm?'
              : 'Care este formatul standard european de hârtie folosit în școli și imprimante, având dimensiunile de 210 × 297 mm?'}
          </div>

          {cooldowns.q4 > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q4}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza dimensiunile standard de pagină."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on standard paper formats."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Letter' : 'A) Letter (format american)',
              lang === 'en' ? 'B) A4 format (210 × 297 mm)' : 'B) Formatul A4 (210 × 297 mm)',
              lang === 'en' ? 'C) B5' : 'C) Formatul B5',
              lang === 'en' ? 'D) Poster A0' : 'D) Poster A0'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns.q4 || 0) > 0}
                onClick={() => handleSelectAnswer('q4', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q4 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  answers.q4 === idx
                    ? idx === correctAnswers.q4
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q4_a4"
            hintRo="Litera A urmată de cifra 4 este topul de hârtie cumpărat cel mai des."
            hintEn="The letter A followed by number 4 is the universal paper ream."
          />

          {answers.q4 !== null && (
            <AnswerExplanation
              isCorrect={answers.q4 === correctAnswers.q4}
              cooldown={cooldowns.q4}
              explanation={
                answers.q4 === correctAnswers.q4
                  ? (lang === 'en' ? 'Perfect! A4 (210 × 297 mm) is the ISO international standard.' : 'Perfect! Formatul A4 (210 × 297 mm) este standardul internațional utilizat în România și Europa.')
                  : (lang === 'en' ? 'Incorrect. The standard format is A4.' : 'Incorect. Standardul utilizat în școli este A4.')
              }
              ruleReference="Manual TIC pag. 80"
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => {
          sounds.playFanfare();
          onCompletePage(earnedScore);
        }}
        onRetry={() => {
          sounds.playClick();
          setAnswers({ q1: null, q2: null, q3: null, q4: null });
        }}
      />
    </div>
  );
};
