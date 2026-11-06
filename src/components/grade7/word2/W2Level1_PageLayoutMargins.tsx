import React, { useState } from 'react';
import {
  Maximize2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  AlertTriangle,
  FileText,
  Printer,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level1_PageLayoutMargins: React.FC<W2Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Page Geometry Simulator State
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [paperFormat, setPaperFormat] = useState<'A4' | 'A3' | 'Letter'>('A4');
  const [marginTop, setMarginTop] = useState<number>(2.5);
  const [marginBottom, setMarginBottom] = useState<number>(2.5);
  const [marginLeft, setMarginLeft] = useState<number>(2.5);
  const [marginRight, setMarginRight] = useState<number>(2.5);
  const [gutter, setGutter] = useState<number>(0.0);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Paper Dimensions in mm
  const paperSizes = {
    A4: { width: 210, height: 297, name: 'A4 (Standard European)' },
    A3: { width: 297, height: 420, name: 'A3 (Planșe Mari / Tabele)' },
    Letter: { width: 216, height: 279, name: 'US Letter (Format American)' },
  };

  const currentSize = paperSizes[paperFormat];
  const pageW = orientation === 'portrait' ? currentSize.width : currentSize.height;
  const pageH = orientation === 'portrait' ? currentSize.height : currentSize.width;

  // Usable print area in cm
  const usableWidthCm = Math.max(0, (pageW / 10) - (marginLeft + marginRight + gutter));
  const usableHeightCm = Math.max(0, (pageH / 10) - (marginTop + marginBottom));

  // Minimum margin alert (most office printers cannot print closer than 0.5 cm from edge)
  const isTooTight = marginTop < 0.8 || marginBottom < 0.8 || marginLeft < 0.8 || marginRight < 0.8;

  const handleApplyPreset = (preset: 'normal' | 'narrow' | 'wide' | 'book') => {
    sounds.playClick();
    if (preset === 'normal') {
      setMarginTop(2.54);
      setMarginBottom(2.54);
      setMarginLeft(2.54);
      setMarginRight(2.54);
      setGutter(0.0);
    } else if (preset === 'narrow') {
      setMarginTop(1.27);
      setMarginBottom(1.27);
      setMarginLeft(1.27);
      setMarginRight(1.27);
      setGutter(0.0);
    } else if (preset === 'wide') {
      setMarginTop(2.54);
      setMarginBottom(2.54);
      setMarginLeft(5.08);
      setMarginRight(5.08);
      setGutter(0.0);
    } else if (preset === 'book') {
      setMarginTop(2.0);
      setMarginBottom(2.0);
      setMarginLeft(2.5);
      setMarginRight(2.0);
      setGutter(1.5);
    }
  };

  const handleSelectAnswer = (qKey: 'q1' | 'q2' | 'q3', answer: string, correct: string) => {
    if (isLocked(qKey)) return;

    if (qKey === 'q1') setQ1Answer(answer);
    if (qKey === 'q2') setQ2Answer(answer);
    if (qKey === 'q3') setQ3Answer(answer);

    if (answer === correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qKey);
    }
  };

  const isQ1Correct = q1Answer === 'b';
  const isQ2Correct = q2Answer === 'c';
  const isQ3Correct = q3Answer === 'b';
  const allCorrect = isQ1Correct && isQ2Correct && isQ3Correct;

  const calculateScore = () => {
    let score = 70;
    if (isQ1Correct) score += 10;
    if (isQ2Correct) score += 10;
    if (isQ3Correct) score += 10;
    return score;
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-sky-900/40 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>{lang === 'ro' ? 'Misiunea 1B • Nivelul 1 din 7' : 'Mission 1B • Level 1 of 7'}</span>
              <span>•</span>
              <span>{lang === 'ro' ? 'Manual pag. 18-20' : 'Textbook pp. 18-20'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Machetare de Pagină A4, Margini & Orientare'
                : 'A4 Page Layout, Margins & Orientation'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              {lang === 'ro'
                ? 'Descoperă arhitectura paginii tipărite: diferența dintre orientarea Portret și Vedere, dimensiunile standard A4, rolul marginilor de siguranță și de ce marginea de îndosariere este vitală pentru orice referat legat în biblioraft.'
                : 'Explore the architecture of the printed page: portrait vs. landscape orientation, standard A4 dimensions, safety margins, and why the gutter margin is vital for binders and spiral notebooks.'}
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400 self-start sm:self-auto">
            <Maximize2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Theory Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <FileText className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Formatul A4 (210 × 297 mm)' : 'A4 Paper Format (210 × 297 mm)'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Formatul internațional standard (ISO 216). Raportul dintre laturi este 1 : √2. Dacă tai o foaie A4 la jumătate, obții două coli A5 cu exact aceleași proporții armonioase.'
              : 'Standard international format (ISO 216). Aspect ratio is 1 : √2. Cutting an A4 sheet in half produces two A5 sheets with the exact same harmonious proportions.'}
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
            <Compass className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Portret vs Vedere' : 'Portrait vs Landscape'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro' ? (
              <>
                <strong>Portret (Portrait):</strong> text clasic pe verticală, cărți, referate.<br />
                <strong>Vedere (Landscape):</strong> orientare orizontală, ideală pentru tabele cu multe coloane sau diagrame panoramice.
              </>
            ) : (
              <>
                <strong>Portrait:</strong> classic vertical layout for books and essays.<br />
                <strong>Landscape:</strong> horizontal orientation, ideal for wide data tables and panoramic charts.
              </>
            )}
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
            <Printer className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Marginea de Îndosariere (Gutter)' : 'Gutter Margin (Binding)'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Spațiu suplimentar de 1 - 1.5 cm adăugat pe marginea stângă (sau interioară). Garantează că găurile perforatorului sau spirala de legare nu vor tăia textul redactat!'
              : 'Extra 1 - 1.5 cm added to the left (or inner) edge. Guarantees hole punches or spiral comb binding will never clip your body text!'}
          </p>
        </div>
      </div>

      {/* Interactive Page Geometry Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider">
              {lang === 'ro' ? 'Laborator Practic' : 'Hands-on Lab'}
            </span>
            <h2 className="text-xl font-black text-white">
              {lang === 'ro'
                ? 'Simulator Machetare Pagină & Calcul Arie Utilă'
                : 'Page Layout Simulator & Printable Area Calculator'}
            </h2>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'ro' ? 'Preseturi Word:' : 'Word Presets:'}
            </span>
            <button
              onClick={() => handleApplyPreset('normal')}
              className="px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700 cursor-pointer"
            >
              Normal (2.54 cm)
            </button>
            <button
              onClick={() => handleApplyPreset('narrow')}
              className="px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700 cursor-pointer"
            >
              {lang === 'ro' ? 'Îngust (1.27 cm)' : 'Narrow (1.27 cm)'}
            </button>
            <button
              onClick={() => handleApplyPreset('book')}
              className="px-3 py-1 text-xs font-semibold bg-indigo-900/50 hover:bg-indigo-800/60 text-indigo-300 rounded-lg transition border border-indigo-700/60 cursor-pointer"
            >
              {lang === 'ro' ? 'Broșură + Gutter (1.5 cm)' : 'Booklet + Gutter (1.5 cm)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Format & Orientation Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {lang === 'ro' ? 'Format Hârtie:' : 'Paper Format:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                  {(['A4', 'A3', 'Letter'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        sounds.playClick();
                        setPaperFormat(fmt);
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        paperFormat === fmt
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {lang === 'ro' ? 'Orientare Foaie:' : 'Page Orientation:'}
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setOrientation('portrait');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      orientation === 'portrait'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ro' ? 'Portret 📄' : 'Portrait 📄'}
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setOrientation('landscape');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      orientation === 'landscape'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ro' ? 'Vedere 📑' : 'Landscape 📑'}
                  </button>
                </div>
              </div>
            </div>

            {/* Margins Sliders */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col gap-3.5">
              <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>{lang === 'ro' ? 'Margini Pagină (cm)' : 'Page Margins (cm)'}</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {lang === 'ro' ? 'Normal: 2.54 cm' : 'Normal: 2.54 cm'}
                </span>
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{lang === 'ro' ? 'Sus (Top):' : 'Top:'}</span>
                    <span className="font-mono text-cyan-300">{marginTop.toFixed(1)} cm</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="5.0"
                    step="0.1"
                    value={marginTop}
                    onChange={(e) => setMarginTop(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{lang === 'ro' ? 'Jos (Bottom):' : 'Bottom:'}</span>
                    <span className="font-mono text-cyan-300">{marginBottom.toFixed(1)} cm</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="5.0"
                    step="0.1"
                    value={marginBottom}
                    onChange={(e) => setMarginBottom(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{lang === 'ro' ? 'Stânga (Left):' : 'Left:'}</span>
                    <span className="font-mono text-cyan-300">{marginLeft.toFixed(1)} cm</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="5.0"
                    step="0.1"
                    value={marginLeft}
                    onChange={(e) => setMarginLeft(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{lang === 'ro' ? 'Dreapta (Right):' : 'Right:'}</span>
                    <span className="font-mono text-cyan-300">{marginRight.toFixed(1)} cm</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="5.0"
                    step="0.1"
                    value={marginRight}
                    onChange={(e) => setMarginRight(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Gutter Margin */}
              <div className="pt-2 border-t border-slate-700/60">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-amber-300">
                    <span>{lang === 'ro' ? 'Margine Îndosariere (Gutter):' : 'Gutter Margin (Binding):'}</span>
                  </span>
                  <span className="font-mono text-amber-300">{gutter.toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={gutter}
                  onChange={(e) => setGutter(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  {lang === 'ro'
                    ? 'Adăugată în stânga pentru biblioraft sau spirală fără a împinge textul în gaură.'
                    : 'Added on the binding edge so hole punches or spiral combs do not encroach on text.'}
                </span>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">
                  {lang === 'ro' ? 'Dimensiune foaie:' : 'Sheet Dimensions:'}
                </span>
                <span className="text-white font-bold">{pageW} × {pageH} mm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  {lang === 'ro' ? 'Arie utilă text:' : 'Usable Text Area:'}
                </span>
                <span className="text-emerald-400 font-bold">{usableWidthCm.toFixed(1)} × {usableHeightCm.toFixed(1)} cm</span>
              </div>
            </div>

            {isTooTight && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'ro'
                    ? 'Atenție: Margini sub 0.8 cm! Unele imprimante de birou pot tăia marginea exterioară la printare.'
                    : 'Warning: Margins under 0.8 cm! Some desktop printers may clip outer text on physical printouts.'}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Live Sheet Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 min-h-[380px] relative">
            <span className="text-[11px] font-mono text-slate-400 mb-2">
              {lang === 'ro' ? 'Previzualizare la scară proporțională:' : 'Proportional scale preview:'}
            </span>

            {/* Physical Paper Sheet Mockup */}
            <div
              className={`bg-white rounded-md shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                orientation === 'portrait' ? 'w-56 h-80' : 'w-80 h-56'
              }`}
              style={{
                paddingTop: `${marginTop * 7}px`,
                paddingBottom: `${marginBottom * 7}px`,
                paddingLeft: `${(marginLeft + gutter) * 7}px`,
                paddingRight: `${marginRight * 7}px`,
              }}
            >
              {/* Gutter Visual Strip */}
              {gutter > 0 && (
                <div
                  className="absolute left-0 top-0 bottom-0 bg-amber-400/25 border-r border-dashed border-amber-600 flex flex-col justify-around items-center text-[8px] text-amber-800 font-bold select-none"
                  style={{ width: `${gutter * 7}px` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700/60"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700/60"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700/60"></div>
                </div>
              )}

              {/* Printable Body Box */}
              <div className="w-full h-full border border-dashed border-blue-400/80 bg-blue-50/40 rounded p-1.5 flex flex-col justify-between select-none">
                <div className="text-[9px] font-bold text-slate-800 border-b border-slate-300 pb-0.5">
                  {lang === 'ro' ? 'Revista Gimnazială • Clasa a VII-a' : 'Middle School Journal • Grade 7'}
                </div>
                <div className="space-y-1 text-[7px] text-slate-600 leading-tight">
                  <p className="indent-2">
                    {lang === 'ro'
                      ? 'Tehnoredactarea îngrijită respectă marginile prestabilite ale colii A4.'
                      : 'Careful desktop publishing honors standard A4 page margins.'}
                  </p>
                  <p className="indent-2">
                    {lang === 'ro'
                      ? 'Textul curge uniform în interiorul zonei utile, protejat de perforarea biblioraftului.'
                      : 'Text flows cleanly within the printable area, guarded against binder punches.'}
                  </p>
                </div>
                <div className="text-[8px] text-slate-400 text-right font-mono border-t border-slate-200 pt-0.5">
                  — 1 —
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-amber-400/30 border border-amber-500 rounded inline-block"></span>
                {lang === 'ro' ? 'Gutter (Îndosariere)' : 'Gutter (Binding)'}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-100 border border-blue-400 rounded inline-block"></span>
                {lang === 'ro' ? 'Arie utilă text' : 'Usable Text Area'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification Quiz */}
      <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-indigo-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-xl font-black text-white font-heading">
            {lang === 'ro'
              ? 'Verificarea Cunoștințelor • Standarde de Paginare'
              : 'Knowledge Check • Page Layout Standards'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: analizează standardul european de dimensiuni al foii A4 înainte de a reîncerca!'
                : 'Reflection time: analyze European A4 standard sheet dimensions before retrying!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '1. Care sunt dimensiunile standard internaționale ale unei foi de hârtie în format A4?'
              : '1. What are the standard international dimensions of an A4 sheet of paper?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', labelRo: '100 × 200 mm', labelEn: '100 × 200 mm' },
              { id: 'b', labelRo: '210 × 297 mm', labelEn: '210 × 297 mm' },
              { id: 'c', labelRo: '216 × 279 mm (US Letter)', labelEn: '216 × 279 mm (US Letter)' },
              { id: 'd', labelRo: '297 × 420 mm (Format A3)', labelEn: '297 × 420 mm (A3 Format)' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q1') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q1Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Reține regula manualului: lățimea este de 21 cm (210 mm), iar lungimea este de 29.7 cm (297 mm).'
                : 'Textbook rule: width is 21 cm (210 mm) and height is 29.7 cm (297 mm).'
            }
          />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation={
              lang === 'ro'
                ? 'Corect! Formatul internațional standard A4 are exact 210 × 297 mm (cu raportul de aspect 1:√2 conform standardului ISO 216).'
                : 'Correct! International standard A4 format measures exactly 210 × 297 mm (with a 1:√2 aspect ratio per ISO 216).'
            }
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: gândește-te ce se întâmplă când pui o lucrare într-un dosar cu șină!'
                : 'Reflection time: think about what happens when punching holes for ring binders!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '2. Pentru ce se configurează „Marginea de îndosariere” (Gutter Margin) într-un document Word?'
              : '2. Why do you configure a "Gutter Margin" in a document processor?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Pentru a mări spațiul dintre cuvintele fiecărui rând',
                labelEn: 'To expand spaces between words on each line',
              },
              {
                id: 'b',
                labelRo: 'Pentru a schimba automat culoarea fundalului la printare',
                labelEn: 'To automatically recolor the page background upon printing',
              },
              {
                id: 'c',
                labelRo: 'Pentru a lăsa spațiu suplimentar de perforare/spirală fără a tăia din text',
                labelEn: 'To allocate extra binding margin for hole punches or spirals without cutting text',
              },
              {
                id: 'd',
                labelRo: 'Pentru a ascunde numărul de pagină de la subsol',
                labelEn: 'To conceal the footer page number',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q2') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q2Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Gândește-te la perforatorul de hârtie: găurile iau circa 1–1.5 cm din marginea stângă a foii.'
                : 'Consider paper hole punches: punches consume 1–1.5 cm from the left edge of the sheet.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation={
              lang === 'ro'
                ? 'Excelent! Gutter margin (marginea de îndosariere) adaugă un spațiu de protecție în stânga sau în interiorul cărții, astfel încât perforarea sau legarea cărții să nu acopere cuvintele.'
                : 'Excellent! The gutter margin adds protective clearance on the binding side so punch holes or spirals never obscure your content.'
            }
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: gândește-te ce orientare oferă mai multă lățime orizontală!'
                : 'Reflection time: think about which orientation provides greater horizontal width!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '3. În ce situație este recomandată comutarea orientării paginii din Portret în Vedere (Landscape)?'
              : '3. When is it recommended to switch page orientation from Portrait to Landscape?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Când redactăm o poezie cu versuri scurte',
                labelEn: 'When composing a short poem with concise stanzas',
              },
              {
                id: 'b',
                labelRo: 'Când inserăm un tabel larg cu multe coloane sau o schemă orizontală amplă',
                labelEn: 'When inserting a wide multi-column table or a broad horizontal schematic',
              },
              {
                id: 'c',
                labelRo: 'Pentru a micșora automat dimensiunea fișierului pe disc',
                labelEn: 'To automatically shrink disk file size',
              },
              {
                id: 'd',
                labelRo: 'Când vrem să tipărim textul cu font alb pe foaie neagră',
                labelEn: 'When attempting to print white typography onto black paper',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q3')}
                onClick={() => handleSelectAnswer('q3', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q3') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q3Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Orientarea Landscape oferă 29.7 cm lățime în loc de 21 cm, acordând spațiu generos pe orizontală.'
                : 'Landscape mode provides 29.7 cm width instead of 21 cm, providing generous horizontal breathing room.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation={
              lang === 'ro'
                ? 'Corect! Orientarea Vedere (Landscape) se utilizează pentru tabele ample, orare, foi de calcul sau diagrame care nu încap lizibil pe lățimea standard de 210 mm.'
                : 'Correct! Landscape is preferred for extensive tables, schedules, spreadsheets, or diagrams that cannot fit comfortably across standard 210 mm width.'
            }
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={allCorrect}
        onNext={() => {
          sounds.playFanfare();
          onCompletePage(calculateScore());
        }}
        promptText={
          allCorrect
            ? (lang === 'ro' ? 'Ai stăpânit machetarea paginii A4! Continuă spre Antet & Subsol!' : 'You mastered A4 page layout! Proceed to Headers & Footers!')
            : (lang === 'ro' ? 'Răspunde corect la cele 3 întrebări de verificare pentru a debloca nivelul următor!' : 'Answer all 3 verification questions correctly to unlock the next level!')
        }
      />
    </div>
  );
};
