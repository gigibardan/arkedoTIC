import React, { useState, useEffect } from 'react';
import { Type, Bold, Italic, Underline, Strikethrough, Sparkles, BookOpen, CheckCircle2, Sliders, Palette, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { PageNavigationFooter } from './PageNavigationFooter';
import { AnswerExplanation } from './AnswerExplanation';
import { QuestionHint } from './QuestionHint';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface TLevel3Props {
  onCompletePage: (score: number) => void;
}

export const TLevel3_FontFormatting: React.FC<TLevel3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Interactive Typography Studio State
  const [activeFontFamily, setActiveFontFamily] = useState<'Arial' | 'Times' | 'Courier'>('Arial');
  const [activeFontSize, setActiveFontSize] = useState<number>(14);
  const [isWaterSubscript, setIsWaterSubscript] = useState<boolean>(false);
  const [isAreaSuperscript, setIsAreaSuperscript] = useState<boolean>(false);
  const [isEniacBold, setIsEniacBold] = useState<boolean>(false);
  const [isEniacBlue, setIsEniacBlue] = useState<boolean>(false);
  const [isYearUnderline, setIsYearUnderline] = useState<boolean>(false);

  // Quiz questions
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);

  useEffect(() => {
    if (q1Cooldown <= 0) return;
    const t = setInterval(() => setQ1Cooldown((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [q1Cooldown]);

  useEffect(() => {
    if (q2Cooldown <= 0) return;
    const t = setInterval(() => setQ2Cooldown((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [q2Cooldown]);

  const handleWaterToggle = () => {
    sounds.playClick();
    const next = !isWaterSubscript;
    setIsWaterSubscript(next);
    if (next) sounds.playCorrect();
  };

  const handleAreaToggle = () => {
    sounds.playClick();
    const next = !isAreaSuperscript;
    setIsAreaSuperscript(next);
    if (next) sounds.playCorrect();
  };

  const handleEniacBoldToggle = () => {
    sounds.playClick();
    const next = !isEniacBold;
    setIsEniacBold(next);
    if (next) sounds.playCorrect();
  };

  const handleEniacColorToggle = () => {
    sounds.playClick();
    const next = !isEniacBlue;
    setIsEniacBlue(next);
    if (next) sounds.playCorrect();
  };

  const handleYearUnderlineToggle = () => {
    sounds.playClick();
    const next = !isYearUnderline;
    setIsYearUnderline(next);
    if (next) sounds.playCorrect();
  };

  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'ctrl_b') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'subscript') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  // Evaluation
  let studioObjectivesMet = 0;
  if (isWaterSubscript) studioObjectivesMet += 1;
  if (isAreaSuperscript) studioObjectivesMet += 1;
  if (isEniacBold && isEniacBlue) studioObjectivesMet += 1;
  if (isYearUnderline) studioObjectivesMet += 1;

  const isQ1Correct = q1Answer === 'ctrl_b';
  const isQ2Correct = q2Answer === 'subscript';

  let correctTotal = 0;
  if (studioObjectivesMet >= 4) correctTotal += 1;
  if (isQ1Correct) correctTotal += 1;
  if (isQ2Correct) correctTotal += 1;

  const totalQuestions = 3;
  const earnedScore = Math.round((correctTotal / totalQuestions) * 15);
  const canProceed = studioObjectivesMet >= 3;

  const handleReset = () => {
    sounds.playClick();
    setIsWaterSubscript(false);
    setIsAreaSuperscript(false);
    setIsEniacBold(false);
    setIsEniacBlue(false);
    setIsYearUnderline(false);
    setQ1Answer(null);
    setQ2Answer(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Module 4 • Page 3 of 7' : 'Modulul 4 • Pagina 3 din 7'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'en' ? 'Character & Font Formatting' : 'Formatarea Caracterelor & Stiluri Tipografice'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Control font families (Serif vs Sans-Serif), sizes (pt), Bold/Italic/Underline styles, Subscript (H₂O) & Superscript (x²), and vibrant text colors (Textbook pp. 56–58).'
                : 'Stăpânește fonturile (Serif vs. Sans-Serif), mărimea (pt), stilurile Bold/Italic/Underline, Indicele (H₂O), Exponentul (m²) și paleta de culori (Manual pag. 56–58).'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            🔤
          </div>
        </div>
      </div>

      {/* Theory Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'en' ? 'Typography Secrets (Textbook p. 56)' : 'Secretele Tipografiei (Manual pag. 56)'}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {lang === 'en' ? 'Characters, Fonts, and Scientific Notations' : 'Fonturi, Stiluri și Notații Științifice'}
        </h2>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/30">
            <div className="text-xs font-bold text-purple-400 font-mono uppercase mb-1">01. Familia de Fonturi</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Serif</strong> (Times New Roman) are mici piciorușe decorative, ideale pentru cărți tipărite.<br />
              <strong>Sans-Serif</strong> (Arial, Calibri) este simplu și modern, perfect pentru citit pe ecrane digitale.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-blue-500/30">
            <div className="text-xs font-bold text-blue-400 font-mono uppercase mb-1">02. Stiluri de Evidențiere</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Bold (Ctrl+B)</strong> îngroașă literele pentru noțiuni cheie.<br />
              <strong>Italic (Ctrl+I)</strong> înclină textul pentru titluri de cărți sau termeni străini.<br />
              <strong>Underline (Ctrl+U)</strong> subliniază o frază importantă.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-400 font-mono uppercase mb-1">03. Indice vs. Exponent</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Indice (Subscript)</strong>: coboară caracterul sub linia textului (formule chimice: H<sub>2</sub>O, CO<sub>2</sub>).<br />
              <strong>Exponent (Superscript)</strong>: ridică caracterul (puteri și unități: 5<sup>2</sup> = 25, 100 m<sup>2</sup>).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Typography Studio */}
      <div className="bg-slate-900/90 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
              <Sliders className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Interactive Lab • Typography Workbench' : 'Laborator Interactiv • Atelierul Tipografic'}
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {lang === 'en' ? 'Apply Scientific Formatting to the Science Report' : 'Formatează fragmentul științific conform instrucțiunilor!'}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">{lang === 'en' ? 'Objectives Met:' : 'Obiective atinse:'}</span>
            <span className="text-sm font-bold font-mono text-purple-400">
              {studioObjectivesMet} / 4
            </span>
          </div>
        </div>

        {/* Live Toolbar */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center gap-3">
          {/* Font Family selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 ml-1">Font:</span>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setActiveFontFamily('Arial'); }}
              className={`px-2 py-1 rounded-lg text-xs font-sans transition cursor-pointer ${
                activeFontFamily === 'Arial' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Arial (Sans)
            </button>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setActiveFontFamily('Times'); }}
              className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer ${
                activeFontFamily === 'Times' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Times New Roman (Serif)
            </button>
          </div>

          {/* Size slider */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 ml-1">Mărime:</span>
            <span className="text-xs font-mono font-bold text-amber-300 w-8">{activeFontSize}pt</span>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setActiveFontSize((prev) => Math.max(11, prev - 1)); }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setActiveFontSize((prev) => Math.min(22, prev + 1)); }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWaterToggle}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                isWaterSubscript
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span>X₂ Indice (Apă)</span>
              {isWaterSubscript && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={handleAreaToggle}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                isAreaSuperscript
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span>X² Exponent (Arie)</span>
              {isAreaSuperscript && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={handleEniacBoldToggle}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                isEniacBold
                  ? 'bg-blue-500 text-slate-950 border-blue-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
              title="Bold ENIAC"
            >
              B
            </button>

            <button
              type="button"
              onClick={handleEniacColorToggle}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                isEniacBlue
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
              title="Albastru ENIAC"
            >
              <Palette className="w-3 h-3" />
              <span>Albastru</span>
            </button>

            <button
              type="button"
              onClick={handleYearUnderlineToggle}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold underline border transition cursor-pointer ${
                isYearUnderline
                  ? 'bg-purple-500 text-slate-950 border-purple-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
              title="Subliniază Anul 1946"
            >
              U
            </button>
          </div>
        </div>

        {/* Live Document Canvas */}
        <div
          className={`p-6 sm:p-8 rounded-2xl bg-white text-slate-900 shadow-2xl border-4 border-slate-200 leading-relaxed transition-all select-none ${
            activeFontFamily === 'Times' ? 'font-serif' : 'font-sans'
          }`}
          style={{ fontSize: `${activeFontSize}px` }}
        >
          <div className="text-center font-bold text-lg mb-4 text-purple-950 border-b pb-2">
            RAPORT ȘTIINȚIFIC & TEHNOLOGIC
          </div>

          <p className="indent-6 text-slate-800 mb-3">
            Molecula de apă este compusă din doi atomi de hidrogen și unul de oxigen, având formula chimică{' '}
            <span className="font-bold px-1 rounded bg-slate-100 border border-slate-300">
              H{isWaterSubscript ? <sub className="text-blue-600 font-black">2</sub> : <span>2</span>}O
            </span>
            . În geometrie, aria unei suprafețe pătrate cu latura L se calculează prin formula A ={' '}
            <span className="font-bold px-1 rounded bg-slate-100 border border-slate-300">
              L{isAreaSuperscript ? <sup className="text-purple-600 font-black">2</sup> : <span>2</span>}
            </span>
            .
          </p>

          <p className="indent-6 text-slate-800">
            În istoria tehnologiei, în anul{' '}
            <span className={`px-0.5 ${isYearUnderline ? 'underline decoration-2 decoration-purple-600 font-bold' : ''}`}>
              1946
            </span>
            , inginerii de la Universitatea din Pennsylvania au finalizat primul calculator electronic de uz general, numit{' '}
            <span
              className={`px-1 rounded ${
                isEniacBold ? 'font-black' : 'font-normal'
              } ${isEniacBlue ? 'text-blue-600 bg-blue-50' : 'text-slate-900'}`}
            >
              ENIAC
            </span>
            .
          </p>
        </div>

        {/* Objectives Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            isWaterSubscript ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>1. Transformă cifra 2 din H2O în Indice (H₂O)</span>
            {isWaterSubscript && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            isAreaSuperscript ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>2. Transformă cifra 2 din L2 în Exponent (L²)</span>
            {isAreaSuperscript && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            isEniacBold && isEniacBlue ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>3. Formatează ENIAC cu Bold și Culoare Albastră</span>
            {isEniacBold && isEniacBlue && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            isYearUnderline ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>4. Subliniază anul istoric 1946 (Underline)</span>
            {isYearUnderline && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
        </div>
      </div>

      {/* Two Textbook Assessment Questions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Type className="w-4 h-4" />
          <span>{lang === 'en' ? 'Textbook Assessment (p. 58, Ex. 1 & 3)' : 'Verificare din Manual (pag. 58, Ex. 1 & 3)'}</span>
        </div>

        {/* Question 1: Keyboard shortcuts */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '1. Which keyboard shortcut is universally used to apply Bold (Aldin / Îngroșat) formatting?'
                : '1. Ce combinație rapidă de taste (shortcut) se folosește pentru a îngroșa un text selectat (Bold)?'}
            </h4>
            <span className="text-xs font-mono text-purple-400 font-semibold shrink-0">1 punct</span>
          </div>

          {q1Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza scurtăturile de formatare din manual pag. 57."
                customMessageEn="Incorrect! Please take 5 seconds to review formatting shortcuts on textbook page 57."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('ctrl_b')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'ctrl_b'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) Ctrl + B (Bold)
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('ctrl_i')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'ctrl_i'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) Ctrl + I (Italic)
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('ctrl_u')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'ctrl_u'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) Ctrl + U (Underline)
            </button>
            <button
              type="button"
              disabled={q1Cooldown > 0}
              onClick={() => handleQ1('ctrl_s')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q1Answer === 'ctrl_s'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) Ctrl + S (Save)
            </button>
          </div>

          <QuestionHint
            hintRo="Vine de la cuvântul englezesc 'Bold' (îngroșat)!"
            hintEn="Comes from the English word 'Bold'."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! Ctrl+B is the universal shortcut for Bold. Ctrl+I is for Italic, and Ctrl+U is for Underline.' : 'Corect! Ctrl+B este scurtătura universală pentru Bold (îngroșat). Ctrl+I este pentru Italic (cursiv), iar Ctrl+U pentru Subliniere.')
                  : (lang === 'en' ? 'Incorrect. Ctrl+B toggles Bold text.' : 'Incorect. Combinația Ctrl + B aplică stilul Bold.')
              }
              ruleReference={lang === 'en' ? 'Textbook page 57 • Formatting Shortcuts' : 'Manual pag. 57 • Scurtături de formatare'}
            />
          )}
        </div>

        {/* Question 2: Subscript vs Superscript */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              {lang === 'en'
                ? '2. When writing chemical formulas such as CO₂ (Carbon Dioxide), which character style should be applied to the number 2?'
                : '2. Când scriem formule chimice precum CO₂ (dioxid de carbon), ce efect de formatare aplicăm cifrei 2?'}
            </h4>
            <span className="text-xs font-mono text-purple-400 font-semibold shrink-0">1 punct</span>
          </div>

          {q2Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza diferența dintre Indice și Exponent din manual pag. 58."
                customMessageEn="Incorrect! Please take 5 seconds to review Subscript vs Superscript on textbook page 58."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('subscript')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'subscript'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              A) {lang === 'en' ? 'Subscript (Indice - characters lowered)' : 'Indice (Subscript - caracterul este coborât sub linia de bază)'}
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('superscript')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'superscript'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              B) {lang === 'en' ? 'Superscript (Exponent - characters raised)' : 'Exponent (Superscript - caracterul este ridicat deasupra liniei)'}
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('strike')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'strike'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              C) {lang === 'en' ? 'Strikethrough (Tăiat)' : 'Tăiere (Strikethrough)'}
            </button>
            <button
              type="button"
              disabled={q2Cooldown > 0}
              onClick={() => handleQ2('highlight')}
              className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                q2Answer === 'highlight'
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              D) {lang === 'en' ? 'Highlight marker' : 'Evidențiere cu marker'}
            </button>
          </div>

          <QuestionHint
            hintRo="Indicele coboară caracterul la baza cuvântului (ca în H₂O sau CO₂), pe când exponentul îl ridică (ca la puteri x²)."
            hintEn="Subscript lowers the character, whereas superscript raises it."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Perfect! Subscript lowers the character for chemistry formulas, while Superscript raises it for mathematical powers.' : 'Excelent! Indicele (Subscript) coboară caracterul pentru formule chimice, iar Exponentul (Superscript) îl ridică pentru puteri matematice.')
                  : (lang === 'en' ? 'Incorrect. Subscript is used for chemical formulas (lowered).' : 'Incorect. Pentru formule chimice se folosește stilul Indice (Subscript).')
              }
              ruleReference={lang === 'en' ? 'Textbook page 58 • Subscript & Superscript' : 'Manual pag. 58 • Indice și Exponent'}
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
