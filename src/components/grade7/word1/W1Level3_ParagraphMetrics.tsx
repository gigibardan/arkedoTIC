import React, { useState } from 'react';
import {
  Ruler,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Sliders,
  Target,
  ArrowRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W1Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W1Level3_ParagraphMetrics: React.FC<W1Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Digital Ruler & Paragraph Metrics Simulator State
  const [firstLineIndent, setFirstLineIndent] = useState<number>(0); // cm: 0, 0.5, 1.0, 1.25, 2.0
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [lineSpacing, setLineSpacing] = useState<number>(1.0); // 1.0, 1.15, 1.5, 2.0
  const [spaceAfter, setSpaceAfter] = useState<number>(0); // pt: 0, 6, 12, 18

  // Target goals to meet for the practical assignment:
  // firstLineIndent === 1.25, alignment === 'justify', lineSpacing === 1.5, spaceAfter === 6
  const isTargetIndentMet = Math.abs(firstLineIndent - 1.25) < 0.05;
  const isTargetAlignMet = alignment === 'justify';
  const isTargetSpacingMet = lineSpacing === 1.5;
  const isTargetSpaceAfterMet = spaceAfter === 6;

  const targetGoalsMetCount =
    (isTargetIndentMet ? 1 : 0) +
    (isTargetAlignMet ? 1 : 0) +
    (isTargetSpacingMet ? 1 : 0) +
    (isTargetSpaceAfterMet ? 1 : 0);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'top_triangle') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'spacing_after_rule') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'ctrl_j') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1Answer === 'top_triangle';
  const isQ2Correct = q2Answer === 'spacing_after_rule';
  const isQ3Correct = q3Answer === 'ctrl_j';

  let totalScore = 0;
  if (targetGoalsMetCount === 4) totalScore += 25;
  else if (targetGoalsMetCount >= 2) totalScore += 15;
  if (isQ1Correct) totalScore += 25;
  if (isQ2Correct) totalScore += 25;
  if (isQ3Correct) totalScore += 25;

  const canProceed = totalScore >= 70;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
              <Ruler className="w-3.5 h-3.5 text-cyan-400" />
              <span>NIVELUL 3 DIN 7 • METRICA PARAGRAFELOR & RIGLA WORD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Rigla Orizontală, Indentare & Aliniere Justified
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              La nivel de paragraf, tehnoredactorul digital stăpânește marcajele riglei: alineatul standard de 1.25 cm, alinierea armonioasă Justify (Ctrl+J) și spațierea între paragrafe fără tastarea haotică de rânduri goale cu Enter.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-cyan-500/40 text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Punctaj Nivel 3</span>
              <span className="text-2xl font-black font-mono text-cyan-400">{totalScore} / 100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Paragraph & Digital Ruler Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Simulatorul Interactiv: Rigla Digitală & Panoul de Paragraf</h2>
              <p className="text-xs text-slate-400">
                Atinge specificațiile academice cerute pentru referate: Alineat 1.25 cm, Justify, Interlinie 1.5, Spațiu 6 pt.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-full border border-cyan-500/40">
              Obiective atinse: <b className="text-white">{targetGoalsMetCount} / 4</b>
            </span>
          </div>
        </div>

        {/* Goals Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className={`p-3 rounded-2xl border text-xs font-mono transition ${
              isTargetIndentMet
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold mb-0.5">1. Alineat (Indent)</div>
            <div>{isTargetIndentMet ? '✓ 1.25 cm corect' : 'Țintă: 1.25 cm'}</div>
          </div>

          <div
            className={`p-3 rounded-2xl border text-xs font-mono transition ${
              isTargetAlignMet
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold mb-0.5">2. Aliniere Text</div>
            <div>{isTargetAlignMet ? '✓ Justify activ' : 'Țintă: Justify (Ctrl+J)'}</div>
          </div>

          <div
            className={`p-3 rounded-2xl border text-xs font-mono transition ${
              isTargetSpacingMet
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold mb-0.5">3. Interlinie (Rânduri)</div>
            <div>{isTargetSpacingMet ? '✓ 1.5 Linii' : 'Țintă: 1.5 Linii'}</div>
          </div>

          <div
            className={`p-3 rounded-2xl border text-xs font-mono transition ${
              isTargetSpaceAfterMet
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold mb-0.5">4. Spațiu După Paragraf</div>
            <div>{isTargetSpaceAfterMet ? '✓ 6 pt activ' : 'Țintă: 6 pt'}</div>
          </div>
        </div>

        {/* Word-like Ruler Component */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Rigla Orizontală Word (cm)</span>
            <span className="text-cyan-400 font-bold">First Line Indent: {firstLineIndent.toFixed(2)} cm</span>
          </div>

          {/* Visual Ruler with Graduation Marks and Slider */}
          <div className="relative h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center px-4 overflow-hidden select-none">
            {/* Ruler centimeter marks */}
            <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 pointer-events-none">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
              <span>11</span>
              <span>12</span>
              <span>13</span>
              <span>14</span>
              <span>15</span>
              <span>16</span>
            </div>

            {/* Target 1.25 cm visual marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400/60 pointer-events-none"
              style={{ left: 'calc(16px + (1.25 / 16) * (100% - 32px))' }}
              title="Obiectiv: 1.25 cm"
            >
              <div className="absolute -top-1 -left-1 text-[9px] font-mono bg-amber-500 text-slate-950 px-1 rounded-sm">
                1.25
              </div>
            </div>

            {/* Current Indent Slider Triangle Marker */}
            <div
              className="absolute top-1 -translate-x-1/2 transition-all cursor-pointer pointer-events-none"
              style={{ left: `calc(16px + (${firstLineIndent} / 16) * (100% - 32px))` }}
            >
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-cyan-400 filter drop-shadow"></div>
            </div>
          </div>

          {/* Quick Buttons for First Line Indent */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-mono text-slate-400">Selectează alineat:</span>
            {[0, 0.5, 1.0, 1.25, 2.0].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setFirstLineIndent(val);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                  Math.abs(firstLineIndent - val) < 0.05
                    ? val === 1.25
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {val === 0 ? 'Fără (0 cm)' : `${val} cm${val === 1.25 ? ' ★' : ''}`}
              </button>
            ))}
          </div>
        </div>

        {/* Alignment & Spacing Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Alignment */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block">Aliniere Paragraf</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'left', icon: AlignLeft, label: 'Stânga' },
                { id: 'center', icon: AlignCenter, label: 'Centru' },
                { id: 'right', icon: AlignRight, label: 'Dreapta' },
                { id: 'justify', icon: AlignJustify, label: 'Justify' },
              ].map((btn) => {
                const Icon = btn.icon;
                const isSelected = alignment === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setAlignment(btn.id as any);
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? btn.id === 'justify'
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={btn.label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-mono">{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line Spacing */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block">
              Interlinie (Line Spacing): <b className="text-cyan-400">{lineSpacing}x</b>
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[1.0, 1.15, 1.5, 2.0].map((spacing) => (
                <button
                  key={spacing}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setLineSpacing(spacing);
                  }}
                  className={`py-2 px-1 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                    lineSpacing === spacing
                      ? spacing === 1.5
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {spacing}x
                </button>
              ))}
            </div>
          </div>

          {/* Space After */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block">
              Spațiu După Paragraf: <b className="text-cyan-400">{spaceAfter} pt</b>
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 6, 12, 18].map((pt) => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSpaceAfter(pt);
                  }}
                  className={`py-2 px-1 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                    spaceAfter === pt
                      ? pt === 6
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pt} pt
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Document Canvas */}
        <div className="p-8 rounded-2xl bg-white text-slate-900 shadow-2xl space-y-4 min-h-[220px] font-serif border border-slate-300">
          <div className="text-xs font-sans font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-200">
            Previzualizare Pagină A4 (Microsoft Word)
          </div>

          {/* Paragraph 1 */}
          <p
            style={{
              textIndent: `${firstLineIndent}cm`,
              textAlign: alignment,
              lineHeight: lineSpacing,
              marginBottom: `${spaceAfter}pt`,
            }}
            className="text-sm sm:text-base text-slate-800"
          >
            Tehnoredactarea modernă reprezintă arta de a echilibra frumusețea tipografică cu lizibilitatea matematică a textului. În documentele academice și oficiale din România, fiecare paragraf nou debutează cu un alineat ferm de 1.25 cm, iar corpul textului este aliniat la ambele capete pentru a crea blocuri regulate de lectură.
          </p>

          {/* Paragraph 2 */}
          <p
            style={{
              textIndent: `${firstLineIndent}cm`,
              textAlign: alignment,
              lineHeight: lineSpacing,
              marginBottom: `${spaceAfter}pt`,
            }}
            className="text-sm sm:text-base text-slate-800"
          >
            Distanța verticală de 6 sau 12 puncte configurată la opțiunea „Spațiu după paragraf” separă vizual ideile fără a forța introducerea unor linii albe suplimentare cu tasta Enter. Astfel, structura documentului rămâne curată, fluidă și gata de tipar.
          </p>
        </div>
      </div>

      {/* Pedagogical Questions Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificarea Cunoștințelor: Metrica Paragrafelor</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări despre riglă și spațiere.</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Ce marcaj de pe rigla orizontală Word reglează exclusiv primul rând al fiecărui paragraf (alineatul)?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'top_triangle',
                text: 'Triunghiul superior orientat în jos (First Line Indent), poziționat standard la 1.25 cm.',
              },
              {
                id: 'bottom_square',
                text: 'Pătrățelul de la bază (Left Indent), care deplasează tot paragraful ca un bloc.',
              },
              {
                id: 'right_triangle',
                text: 'Triunghiul din marginea dreaptă (Right Indent).',
              },
              {
                id: 'hanging_triangle',
                text: 'Triunghiul din mijloc (Hanging Indent) care mută doar rândul al doilea.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'top_triangle'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Privește cele trei piese din stânga riglei: sus e un triunghi orientat în jos, la mijloc un triunghi orientat în sus, iar jos un dreptunghi."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Triunghiul superior (First Line Indent) controlează exclusiv deplasarea primului rând din paragraf, fără a afecta restul rândurilor."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. De ce este o greșeală gravă să apeși tasta Enter de mai multe ori pentru a crea distanță între paragrafe?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'spacing_after_rule',
                text: 'Creează paragrafe goale parazite (simbolul ¶) care decalază titlurile și paginile la orice modificare ulterioară; soluția corectă este setarea opțiunii „Spațiu după” (Spacing After).',
              },
              {
                id: 'pc_crash',
                text: 'Aplicația Microsoft Word se blochează dacă documentul are mai mult de trei simboluri Enter.',
              },
              {
                id: 'font_change',
                text: 'Tasta Enter schimbă automat fontul textului din Times New Roman în Comic Sans.',
              },
              {
                id: 'printer_jam',
                text: 'Imprimanta refuză fizic să tragă foaia de hârtie dacă detectează un Enter gol.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'spacing_after_rule'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Dacă apeși Enter, inserezi un paragraf complet gol. Dacă adaugi două rânduri mai sus, un titlu poate aluneca greșit pe fundul unei pagini!"
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Foarte adevărat! Tehnoredactorii profesioniști setează spațierea din proprietățile de paragraf (Spacing After: 6pt sau 12pt). Enter se folosește strict pentru trecerea la o idee nouă."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Care este scurtătura de tastatură universală pentru alinierea textului Justified (stânga-dreapta)?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'ctrl_j', text: 'Ctrl + J (de la Justify)' },
              { id: 'ctrl_l', text: 'Ctrl + L (Left)' },
              { id: 'ctrl_e', text: 'Ctrl + E (Center)' },
              { id: 'ctrl_r', text: 'Ctrl + R (Right)' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'ctrl_j'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Ține minte: L vine de la Left, R de la Right, E de la cEnter, iar J de la Justify."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Corect! Ctrl + J aplică alinierea Justified instantaneu, distribuind spațiile dintre cuvinte pentru a alinia ambele laturi ale coloanei de text."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={3}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
