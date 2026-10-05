import React, { useState, useEffect } from 'react';
import { 
  Split, 
  PaintBucket, 
  AlignJustify, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  RotateCcw,
  Palette,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface T2Level2_TableFormattingProps {
  onCompletePage: (earnedScore: number) => void;
}

export const T2Level2_TableFormatting: React.FC<T2Level2_TableFormattingProps> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Table Designer State
  const [isTitleMerged, setIsTitleMerged] = useState<boolean>(false);
  const [isBreakMerged, setIsBreakMerged] = useState<boolean>(false);
  const [headerBgColor, setHeaderBgColor] = useState<'transparent' | 'blue' | 'emerald' | 'amber'>('transparent');
  const [cellAlignment, setCellAlignment] = useState<'top-left' | 'center-center' | 'bottom-right'>('top-left');
  const [borderStyle, setBorderStyle] = useState<'thin' | 'double' | 'dashed'>('thin');

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
    q1: 0, // Merge Cells (Îmbinare celule)
    q2: 1, // 9 alinieri posibile (orizontal + vertical)
    q3: 2, // Shading (Umbrire / Culoare de fundal)
    q4: 1  // Split Cells (Divizare celule)
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

  // Check if interactive schedule meets design criteria
  const isScheduleStyled = 
    isTitleMerged && 
    isBreakMerged && 
    (headerBgColor === 'blue' || headerBgColor === 'emerald') && 
    cellAlignment === 'center-center';

  // Scoring
  let correctCount = 0;
  Object.keys(correctAnswers).forEach(k => {
    if (answers[k] === correctAnswers[k]) correctCount++;
  });
  if (isScheduleStyled) correctCount += 1;
  const totalQuestions = 5; // 4 quiz questions + 1 design task

  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/60 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-indigo-500/20 border border-indigo-400/40 rounded-2xl text-indigo-300 text-3xl shrink-0 shadow-inner">
            📐
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 4B • Page 2 of 7' : 'Modulul 4B • Pagina 2 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook pp. 71-72' : 'Manual pag. 71-72'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? 'Table Formatting, Merge & Shading' : 'Formatarea Tabelelor, Îmbinare Celule & Umbrire'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Transform raw grids into polished documents! Learn to merge cells for titles, apply shading colors, set 9-position cell alignments, and configure border styles.'
                : 'Transformă tabelele brute în documente elegante! Învață să îmbini celule pentru titluri, să aplici culori de fundal, să centrezi textul pe verticală și orizontală și să schimbi chenarele.'}
            </p>
          </div>
        </div>
      </div>

      {/* Theory & Concepts Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-indigo-400 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5" />
          <span>{lang === 'en' ? 'Core Table Styling Tools' : 'Instrumente Cheie de Formatare a Tabelului'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">🔗</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Merge Cells (Îmbinare)' : 'Îmbinare Celule (Merge)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Combines two or more selected adjacent cells into one large single cell. Crucial for table banners and merged time slots.'
                : 'Unește două sau mai multe celule alăturate într-o singură celulă mare. Esențial pentru titlul orarului sau pauze.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">✂️</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Split Cells (Divizare)' : 'Divizare Celule (Split)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Splits an existing cell into several smaller sub-rows or sub-columns, e.g. dividing a lab slot into Team A and Team B.'
                : 'Împarte o celulă existentă în mai multe rânduri sau coloane mici, util pentru împărțirea pe grupe (Grupa 1 / Grupa 2).'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">🎨</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Shading & Borders' : 'Umbrire & Chenare'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Shading paints cell background color (especially the header row). Borders define line thickness, style (solid, double), and color.'
                : 'Umbrirea colorează fundalul celulelor (antetul). Chenarele definesc grosimea, stilul (dublu, punctat) și culoarea liniilor.'}
            </p>
          </div>
        </div>

        {/* 9-Positions Info */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/30 flex items-start gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 text-xl shrink-0">
            🎯
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-300">
              {lang === 'en' ? 'The 9 Cell Alignment Positions' : 'Cele 9 Poziții de Aliniere în Celulă'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Unlike regular text which only aligns left, center, right, and justify, table text aligns both vertically (Top, Center, Bottom) and horizontally (Left, Center, Right), offering 9 distinct coordinate combinations!'
                : 'Spre deosebire de textul normal care are 4 alinieri, într-o celulă de tabel textul se aliniază atât pe orizontală (stânga, centru, dreapta) cât și pe verticală (sus, mijloc, jos), existând în total 9 poziții de aliniere!'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Schedule Styling Workshop */}
      <div className="bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Workshop: Style the School Timetable' : 'Atelier Practic: Stilizează Orarul Școlar'}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/40">
            {lang === 'en' ? 'Step 1: Design Workshop' : 'Pasul 1: Machetare Interactivă'}
          </span>
        </div>

        {/* Styling Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase font-mono">
            {lang === 'en' ? 'Table Formatting Toolbar:' : 'Bara de Instrumente pentru Tabel:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Merge Title Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsTitleMerged(!isTitleMerged);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                isTitleMerged
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{lang === 'en' ? '1. Merge Title Cells' : '1. Îmbină Celule Titlu'}</span>
              <span>{isTitleMerged ? '✓' : '🔗'}</span>
            </button>

            {/* Merge Break Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsBreakMerged(!isBreakMerged);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                isBreakMerged
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{lang === 'en' ? '2. Merge Recess Row' : '2. Îmbină Rândul Pauzei'}</span>
              <span>{isBreakMerged ? '✓' : '🔗'}</span>
            </button>

            {/* Shading Color Selector */}
            <div className="flex items-center gap-1.5 p-2 bg-slate-900 border border-slate-700 rounded-xl">
              <span className="text-[11px] font-mono text-slate-400 pl-1">{lang === 'en' ? 'Header:' : 'Antet:'}</span>
              {(['transparent', 'blue', 'emerald'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setHeaderBgColor(color);
                  }}
                  className={`w-6 h-6 rounded-lg transition border cursor-pointer ${
                    color === 'transparent'
                      ? 'bg-slate-800 border-slate-600'
                      : color === 'blue'
                      ? 'bg-blue-600 border-blue-400'
                      : 'bg-emerald-600 border-emerald-400'
                  } ${headerBgColor === color ? 'ring-2 ring-white scale-110' : ''}`}
                  title={color}
                />
              ))}
            </div>

            {/* Cell Alignment Selector */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setCellAlignment(prev => prev === 'top-left' ? 'center-center' : prev === 'center-center' ? 'bottom-right' : 'top-left');
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:border-slate-500 flex items-center justify-between transition cursor-pointer"
            >
              <span>{lang === 'en' ? 'Align:' : 'Aliniere:'}</span>
              <span className="font-mono text-cyan-400">
                {cellAlignment === 'center-center' 
                  ? (lang === 'en' ? 'Middle-Center 🎯' : 'Mijloc-Centrat 🎯')
                  : cellAlignment === 'bottom-right'
                  ? (lang === 'en' ? 'Bottom-Right' : 'Jos-Dreapta')
                  : (lang === 'en' ? 'Top-Left' : 'Sus-Stânga')}
              </span>
            </button>
          </div>
        </div>

        {/* Rendered Live Styled Timetable */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{lang === 'en' ? 'Document Preview:' : 'Previzualizare Document:'}</span>
            {isScheduleStyled ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Professional Layout Achieved!' : 'Tabel Tehnoredactat Impecabil! (+1 pct)'}
              </span>
            ) : (
              <span className="text-amber-400">
                ⚡ {lang === 'en' ? 'Merge title & break, set blue/emerald header, and center text!' : 'Îmbină titlul & pauza, alege fundal antet și centrează!'}
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-slate-700 bg-slate-950 p-4 shadow-2xl">
            <table className={`w-full border-collapse text-xs sm:text-sm font-sans ${
              borderStyle === 'double' ? 'border-4 border-double border-indigo-400' : 'border-2 border-slate-600'
            }`}>
              <tbody>
                {/* Row 1: Document Title (Can be merged across 4 cols) */}
                {isTitleMerged ? (
                  <tr className="bg-slate-900 text-white font-extrabold text-center border-b-2 border-slate-700">
                    <td colSpan={4} className="p-3 text-sm sm:text-base tracking-wide text-indigo-300 uppercase">
                      📋 ORARUL CLASEI A V-A — AN ȘCOLAR 2026-2027
                    </td>
                  </tr>
                ) : (
                  <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                    <td className="p-2 border border-slate-700">ORAR CLASĂ</td>
                    <td className="p-2 border border-slate-700">[Celulă goală]</td>
                    <td className="p-2 border border-slate-700">[Celulă goală]</td>
                    <td className="p-2 border border-slate-700">AN 2026-2027</td>
                  </tr>
                )}

                {/* Row 2: Headers */}
                <tr className={`border-b-2 border-slate-700 font-bold transition-colors ${
                  headerBgColor === 'blue'
                    ? 'bg-blue-900/90 text-white'
                    : headerBgColor === 'emerald'
                    ? 'bg-emerald-900/90 text-white'
                    : 'bg-slate-900/40 text-slate-300'
                }`}>
                  <th className={`p-2.5 sm:p-3 border border-slate-700 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Interval Orar
                  </th>
                  <th className={`p-2.5 sm:p-3 border border-slate-700 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Luni
                  </th>
                  <th className={`p-2.5 sm:p-3 border border-slate-700 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Miercuri
                  </th>
                  <th className={`p-2.5 sm:p-3 border border-slate-700 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Vineri
                  </th>
                </tr>

                {/* Row 3: Class 1 */}
                <tr className="border-b border-slate-800 hover:bg-slate-900/40">
                  <td className={`p-2.5 border border-slate-700 font-mono text-slate-400 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    08:00 - 08:50
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-cyan-300 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Informatică & TIC
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-slate-200 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Matematică
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-slate-200 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Limba Română
                  </td>
                </tr>

                {/* Row 4: Class 2 */}
                <tr className="border-b border-slate-800 hover:bg-slate-900/40">
                  <td className={`p-2.5 border border-slate-700 font-mono text-slate-400 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    09:00 - 09:50
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-slate-200 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Limba Engleză
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-slate-200 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Istorie
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-slate-200 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Geografie
                  </td>
                </tr>

                {/* Row 5: Recess (Can be merged) */}
                {isBreakMerged ? (
                  <tr className="bg-amber-950/40 text-amber-300 font-bold border-b border-slate-700 text-center">
                    <td colSpan={4} className="p-2 tracking-wider text-xs sm:text-sm">
                      ☕ PAUZA MARE (09:50 - 10:10) — RECREAȚIE & GUSTARE
                    </td>
                  </tr>
                ) : (
                  <tr className="bg-slate-900/30 text-slate-500 border-b border-slate-800 text-xs">
                    <td className="p-2 border border-slate-700">09:50 - 10:10</td>
                    <td className="p-2 border border-slate-700">Pauză</td>
                    <td className="p-2 border border-slate-700">Pauză</td>
                    <td className="p-2 border border-slate-700">Pauză</td>
                  </tr>
                )}

                {/* Row 6: Class 3 */}
                <tr className="border-b border-slate-800 hover:bg-slate-900/40">
                  <td className={`p-2.5 border border-slate-700 font-mono text-slate-400 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    10:10 - 11:00
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-slate-200 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Educație Fizică
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-slate-200 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Educație Plastică
                  </td>
                  <td className={`p-2.5 border border-slate-700 font-medium text-slate-200 ${cellAlignment === 'center-center' ? 'text-center' : cellAlignment === 'bottom-right' ? 'text-right' : 'text-left'}`}>
                    Muzică & Mișcare
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Styling & Merge' : 'Verifică-ți Cunoștințele: Îmbinare & Stiluri'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-indigo-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 4' : 'Întrebarea 1 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What command allows you to unite two or more selected cells into a single larger cell?'
              : 'Ce comandă permite unirea a două sau mai multe celule selectate într-o singură celulă mai mare?'}
          </div>

          {(cooldowns['q1'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q1']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza comanda Îmbinare celule din manual pag. 71."
                customMessageEn="Incorrect! Please take 5 seconds to review Merge Cells on textbook page 71."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Merge Cells (Îmbinare celule)' : 'A) Îmbinare celule (Merge Cells)',
              lang === 'en' ? 'B) Delete Row' : 'B) Ștergere rând',
              lang === 'en' ? 'C) Word Wrap' : 'C) Încadrare text',
              lang === 'en' ? 'D) AutoFit' : 'D) Potrivire automată'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q1'] || 0) > 0}
                onClick={() => handleSelectAnswer('q1', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
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
            hintId="t2_q1_merge"
            hintRo="Operația de unire a celulelor vecine se numește «Îmbinare» sau «Merge»."
            hintEn="The operation of joining neighboring cells is named 'Merge Cells'."
          />

          {answers.q1 !== null && (
            <AnswerExplanation
              isCorrect={answers.q1 === correctAnswers.q1}
              cooldown={cooldowns['q1'] || 0}
              explanation={
                answers.q1 === correctAnswers.q1
                  ? (lang === 'en' ? 'Correct! Merge Cells unifies adjacent cells into one.' : 'Corect! Îmbinare celule (Merge Cells) combină celulele alese într-o singură casetă mare.')
                  : (lang === 'en' ? 'Incorrect. The command is Merge Cells (Îmbinare celule).' : 'Incorect. Comanda corectă este Îmbinare celule (Merge Cells).')
              }
              ruleReference="Manual TIC pag. 71"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-indigo-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 4' : 'Întrebarea 2 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'How many alignment positions are available inside a table cell (combining vertical and horizontal)?'
              : 'Câte opțiuni diferite de aliniere a textului există într-o celulă de tabel (combinând verticala cu orizontala)?'}
          </div>

          {(cooldowns['q2'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q2']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza cele 9 poziții de aliniere din manual pag. 72."
                customMessageEn="Incorrect! Please take 5 seconds to review the 9 alignment positions on page 72."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) 4 options (Left, Center, Right, Justify)' : 'A) 4 opțiuni (doar orizontal)',
              lang === 'en' ? 'B) 9 options (3 vertical × 3 horizontal)' : 'B) 9 opțiuni (3 pe verticală × 3 pe orizontală)',
              lang === 'en' ? 'C) Only 2 options' : 'C) Doar 2 opțiuni',
              lang === 'en' ? 'D) 12 options' : 'D) 12 opțiuni'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q2'] || 0) > 0}
                onClick={() => handleSelectAnswer('q2', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
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
            hintId="t2_q2_align"
            hintRo="Pe verticală ai Sus, Mijloc, Jos, iar pe orizontală ai Stânga, Centrat, Dreapta. Calculează 3 × 3!"
            hintEn="Vertically: Top, Middle, Bottom. Horizontally: Left, Center, Right. Multiply 3 × 3!"
          />

          {answers.q2 !== null && (
            <AnswerExplanation
              isCorrect={answers.q2 === correctAnswers.q2}
              cooldown={cooldowns['q2'] || 0}
              explanation={
                answers.q2 === correctAnswers.q2
                  ? (lang === 'en' ? 'Spot on! 3 vertical levels × 3 horizontal positions = 9 total positions.' : 'Exact! 3 niveluri verticale × 3 poziții orizontale = 9 alinieri posibile în celulă.')
                  : (lang === 'en' ? 'Not quite. There are 9 distinct alignment combinations.' : 'Incorect. Există 9 combinații distincte de aliniere în celulele de tabel.')
              }
              ruleReference="Manual TIC pag. 72"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-indigo-400 uppercase font-mono">
            {lang === 'en' ? 'Question 3 of 4' : 'Întrebarea 3 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What is the feature called that paints the background color of a cell or row?'
              : 'Cum se numește instrumentul care colorează fundalul unei celule sau al unui rând întreg?'}
          </div>

          {(cooldowns['q3'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q3']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza instrumentul Umbrire (Shading) din manual pag. 72."
                customMessageEn="Incorrect! Please take 5 seconds to review Shading on textbook page 72."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Font Color (Culoare text)' : 'A) Culoare text (Font Color)',
              lang === 'en' ? 'B) Watermark (Filigran)' : 'B) Filigran',
              lang === 'en' ? 'C) Shading / Cell Fill (Umbrire / Fundal celulă)' : 'C) Umbrire / Fundal celulă (Shading)',
              lang === 'en' ? 'D) Page Border' : 'D) Bordură de pagină'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q3'] || 0) > 0}
                onClick={() => handleSelectAnswer('q3', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
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
            hintId="t2_q3_shading"
            hintRo="Pictograma este adesea o găletușă de vopsea răsturnată."
            hintEn="The icon is commonly a tipped paint bucket pouring color."
          />

          {answers.q3 !== null && (
            <AnswerExplanation
              isCorrect={answers.q3 === correctAnswers.q3}
              cooldown={cooldowns['q3'] || 0}
              explanation={
                answers.q3 === correctAnswers.q3
                  ? (lang === 'en' ? 'Correct! Shading applies background fill color to selected cells.' : 'Corect! Umbrirea (Shading) umple fundalul celulelor pentru a crea contraste clare.')
                  : (lang === 'en' ? 'Incorrect. Changing cell background is called Shading (Umbrire).' : 'Incorect. Colorarea fundalului celulei se numește Umbrire (Shading).')
              }
              ruleReference="Manual TIC pag. 72"
            />
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-indigo-400 uppercase font-mono">
            {lang === 'en' ? 'Question 4 of 4' : 'Întrebarea 4 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'If you want to divide a single cell into 2 columns and 2 rows, which operation should you use?'
              : 'Dacă dorești să împarți o singură celulă existentă în 2 coloane și 2 rânduri mai mici, ce comandă folosești?'}
          </div>

          {(cooldowns['q4'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q4']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza comanda Divizare celule din manual pag. 71."
                customMessageEn="Incorrect! Please take 5 seconds to review Split Cells on textbook page 71."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Merge Cells' : 'A) Îmbinare celule',
              lang === 'en' ? 'B) Split Cells (Divizare celule)' : 'B) Divizare celule (Split Cells)',
              lang === 'en' ? 'C) Delete Columns' : 'C) Ștergere coloane',
              lang === 'en' ? 'D) Cut (Tăiere)' : 'D) Tăiere'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q4'] || 0) > 0}
                onClick={() => handleSelectAnswer('q4', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
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
            hintId="t2_q4_split"
            hintRo="Operația inversă a îmbinării este împărțirea sau divizarea."
            hintEn="The opposite of merging is splitting or dividing."
          />

          {answers.q4 !== null && (
            <AnswerExplanation
              isCorrect={answers.q4 === correctAnswers.q4}
              cooldown={cooldowns['q4'] || 0}
              explanation={
                answers.q4 === correctAnswers.q4
                  ? (lang === 'en' ? 'Excellent! Split Cells divides a cell into smaller segments.' : 'Excelent! Divizare celule (Split Cells) împarte celula în mai multe rânduri/coloane.')
                  : (lang === 'en' ? 'Incorrect. The dividing operation is Split Cells (Divizare celule).' : 'Incorect. Operația de împărțire este Divizare celule (Split Cells).')
              }
              ruleReference="Manual TIC pag. 71"
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
