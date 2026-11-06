import React, { useState } from 'react';
import {
  Type,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  AlignLeft,
  Terminal,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W1Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W1Level1_TypographyAnatomy: React.FC<W1Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Typography Anatomy Explorer
  const [activeFontFamily, setActiveFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [showAnatomyLines, setShowAnatomyLines] = useState<boolean>(true);
  const [selectedAnatomyPart, setSelectedAnatomyPart] = useState<string | null>('serif');

  // Font classification mini-sorter
  const [classifiedFonts, setClassifiedFonts] = useState<Record<string, 'serif' | 'sans' | 'mono'>>({});

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const fontFamilies = {
    serif: {
      name: 'Times New Roman / Georgia',
      family: lang === 'en' ? 'Serif (With Feet)' : 'Serif (Cu piciorușe)',
      sample: lang === 'en' ? 'Romanian Typography — Tradition & Elegance' : 'Tipografia Românească — Tradiție & Eleganță',
      cssFont: 'font-serif',
      description:
        lang === 'en'
          ? 'Features fine decorative extensions (serifs) at stroke endpoints. Guides the reader eyes across printed book lines.'
          : 'Prezintă terminații fine (serife/piciorușe) la capetele literelor. Călăuzește privirea cititorului de-a lungul rândului tipărit.',
      bestFor:
        lang === 'en'
          ? 'Printed books, novels, newspapers, formal academic research papers.'
          : 'Cărți, romane, ziare tipărite, referate academice formale.',
    },
    sans: {
      name: 'Calibri / Arial / Segoe UI',
      family: lang === 'en' ? 'Sans-Serif (Without Feet)' : 'Sans-Serif (Fără piciorușe)',
      sample: lang === 'en' ? 'Digital Interfaces & Screen Readability' : 'Interfețe Digitale & Lizibilitate pe Ecrane',
      cssFont: 'font-sans',
      description:
        lang === 'en'
          ? 'Clean, geometric strokes without decorative feet. High clarity at screen resolutions, easy to read from distance.'
          : 'Litere curate, geometrice, fără terminații decorative. Nu obosesc ochiul la rezoluții de ecran și sunt ușor de citit de la distanță.',
      bestFor:
        lang === 'en'
          ? 'Websites, slide presentations, chapter headings, emails.'
          : 'Site-uri web, prezentări pe proiector, titluri de capitole, e-mailuri.',
    },
    mono: {
      name: 'Consolas / Courier New / Fira Code',
      family: lang === 'en' ? 'Monospace (Fixed Width)' : 'Monospațiat (Monospace)',
      sample: '#include <iostream> int x = 42;',
      cssFont: 'font-mono',
      description:
        lang === 'en'
          ? 'Each character occupies the exact same horizontal width. Preserves perfect indentation and vertical column alignment.'
          : 'Fiecare caracter ocupă exact aceeași lățime orizontală (litera „i” are aceeași lățime ca „w”). Păstrează indentarea codului aliniată perfect.',
      bestFor:
        lang === 'en'
          ? 'C++ source code, tabular text data, IP addresses, terminal shells.'
          : 'Cod sursă C++, tabele textuale, adrese IP, terminale de comandă.',
    },
  };

  const anatomyParts: Record<string, { title: string; desc: string; color: string }> = {
    serif: {
      title: lang === 'en' ? 'Serif (Terminal Foot)' : 'Serifă (Picioruș terminal)',
      desc:
        lang === 'en'
          ? 'Decorative or guidance stroke at character extremities. Creates an optical rhythm for smooth reading on paper.'
          : 'Extensie decorativă sau de ghidaj la capătul unei trăsături de literă. Oferă ritm optic lecturii cursive pe hârtie.',
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
    baseline: {
      title: lang === 'en' ? 'Baseline' : 'Linia de Bază (Baseline)',
      desc:
        lang === 'en'
          ? 'The invisible horizontal line on which uppercase and lowercase bodies sit (excluding descenders).'
          : 'Linia orizontală invizibilă pe care „se așază” toate caracterele majuscule și corpul literelor mici (cu excepția cozilor descendente).',
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    },
    xheight: {
      title: lang === 'en' ? 'x-Height' : 'Înălțimea x (x-Height)',
      desc:
        lang === 'en'
          ? 'Height of lowercase glyph bodies without ascenders/descenders (e.g. x, a, e, o, m). Larger x-height enhances small text legibility.'
          : 'Înălțimea corpului literelor mici fără tije (cum ar fi x, a, e, o, m). Cu cât x-height este mai mare, cu atât fontul pare mai lizibil la dimensiuni mici.',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
    ascender: {
      title: lang === 'en' ? 'Ascender' : 'Tijă Ascendentă (Ascender)',
      desc:
        lang === 'en'
          ? 'The portion of a lowercase letter extending above the x-height (e.g. b, d, h, k, l, t).'
          : 'Partea unei litere mici care se înalță deasupra înălțimii x (ex: la literele b, d, h, k, l, t).',
      color: 'text-violet-400 border-violet-500/40 bg-violet-500/10',
    },
    descender: {
      title: lang === 'en' ? 'Descender' : 'Coadă Descendentă (Descender)',
      desc:
        lang === 'en'
          ? 'The portion of a lowercase letter extending below the baseline (e.g. p, q, y, g, j).'
          : 'Porțiunea literei care coboară sub linia de bază (baseline), întâlnită la literele p, q, y, g, j.',
      color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    },
  };

  const fontsToClassify = [
    { id: 'f1', name: 'Times New Roman', correct: 'serif' as const },
    { id: 'f2', name: 'Calibri', correct: 'sans' as const },
    { id: 'f3', name: 'Consolas', correct: 'mono' as const },
    { id: 'f4', name: 'Arial', correct: 'sans' as const },
  ];

  const handleClassify = (fontId: string, category: 'serif' | 'sans' | 'mono') => {
    sounds.playClick();
    setClassifiedFonts((prev) => ({ ...prev, [fontId]: category }));
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'serif_print') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'mono_alignment') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'descender') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1Answer === 'serif_print';
  const isQ2Correct = q2Answer === 'mono_alignment';
  const isQ3Correct = q3Answer === 'descender';

  const correctClassificationsCount = fontsToClassify.filter(
    (f) => classifiedFonts[f.id] === f.correct
  ).length;

  let totalScore = 0;
  if (correctClassificationsCount === 4) totalScore += 25;
  else if (correctClassificationsCount >= 2) totalScore += 15;
  if (isQ1Correct) totalScore += 25;
  if (isQ2Correct) totalScore += 25;
  if (isQ3Correct) totalScore += 25;

  const canProceed = totalScore >= 70;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/40">
              <Type className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {lang === 'en'
                  ? 'LEVEL 1 OF 7 • TYPOGRAPHY ANATOMY & FONT FAMILIES'
                  : 'NIVELUL 1 DIN 7 • ANATOMIA TIPOGRAFICĂ & CLASIFICAREA FONTURILOR'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {lang === 'en'
                ? 'Letter Anatomy & Font Families'
                : 'Anatomia Literelor & Familiile de Fonturi'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Before typesetting a professional document, we must understand character visual physics: why printed books use serifs, why screens favor Sans-serif, and why programmers write code exclusively with monospaced fonts.'
                : 'Înainte de a tehnoredacta un document profesional, trebuie să înțelegem fizica vizuală a caracterelor: de ce cărțile tipărite folosesc serife, de ce ecranele preferă fonturile Sans-serif și de ce programatorii scriu cod doar cu fonturi monospațiate.'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-blue-500/40 text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">
                {lang === 'en' ? 'Level 1 Score' : 'Punctaj Nivel 1'}
              </span>
              <span className="text-2xl font-black font-mono text-cyan-400">{totalScore} / 100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Activity 1: Font Family & Anatomy Explorer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'Interactive Lab: Typography Anatomy Explorer'
                  : 'Laboratorul Interactiv: Exploratorul de Anatomie Tipografică'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Switch between font families and click on anatomical parts for definitions.'
                  : 'Comută între familiile de fonturi și apasă pe componentele anatomice pentru detalii.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowAnatomyLines(!showAnatomyLines);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {showAnatomyLines
                ? lang === 'en'
                  ? 'Hide Guide Lines'
                  : 'Ascunde Liniile Ghid'
                : lang === 'en'
                ? 'Show Guide Lines'
                : 'Afișează Liniile Ghid'}
            </span>
          </button>
        </div>

        {/* Font Family Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['serif', 'sans', 'mono'] as const).map((key) => {
            const fontInfo = fontFamilies[key];
            const isActive = activeFontFamily === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveFontFamily(key);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-400 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-mono font-bold uppercase ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>
                    {fontInfo.family}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>}
                </div>
                <div className="text-sm font-bold text-white">{fontInfo.name}</div>
              </button>
            );
          })}
        </div>

        {/* Live Typography Canvas with Guides */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-8 flex flex-col items-center justify-center min-h-[220px]">
          {/* Guide lines overlay */}
          {showAnatomyLines && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-center px-6">
              {/* Ascender line */}
              <div className="w-full border-t border-dashed border-violet-500/40 relative mb-8">
                <span className="absolute -top-3.5 right-2 text-[10px] font-mono text-violet-400 bg-slate-950 px-1">
                  {lang === 'en' ? 'Ascender Line (Upper stems: b, d, h)' : 'Ascender Line (Tije superioare: b, d, h)'}
                </span>
              </div>
              {/* x-Height line */}
              <div className="w-full border-t border-dashed border-emerald-500/50 relative mb-12">
                <span className="absolute -top-3.5 right-2 text-[10px] font-mono text-emerald-400 bg-slate-950 px-1">
                  {lang === 'en' ? 'x-Height (Height of lowercase x)' : 'x-Height (Înălțimea literei mici x)'}
                </span>
              </div>
              {/* Baseline */}
              <div className="w-full border-t-2 border-cyan-500/80 relative mb-8">
                <span className="absolute -top-3.5 right-2 text-[10px] font-mono font-bold text-cyan-300 bg-slate-950 px-1">
                  {lang === 'en' ? 'Baseline (Text baseline grid)' : 'Baseline (Linia de Bază a Textului)'}
                </span>
              </div>
              {/* Descender line */}
              <div className="w-full border-t border-dashed border-rose-500/40 relative">
                <span className="absolute -top-3.5 right-2 text-[10px] font-mono text-rose-400 bg-slate-950 px-1">
                  {lang === 'en' ? 'Descender Line (Lower tails: p, q, y)' : 'Descender Line (Cozi inferioare: p, q, y)'}
                </span>
              </div>
            </div>
          )}

          {/* Rendered Text Sample */}
          <div className="relative z-10 text-center space-y-2 py-4">
            <div
              className={`text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-white transition-all duration-300 ${fontFamilies[activeFontFamily].cssFont}`}
            >
              {lang === 'en' ? 'Typography Glyphs' : 'Tipografie Spil'}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-mono">
              {fontFamilies[activeFontFamily].sample}
            </div>
          </div>
        </div>

        {/* Anatomy Clickable Chips */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            {lang === 'en' ? 'Select an anatomical concept for definition:' : 'Selectează o noțiune anatomică pentru definiție:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(anatomyParts).map(([key, part]) => {
              const isSelected = selectedAnatomyPart === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedAnatomyPart(key);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                    isSelected ? part.color : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {part.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Part Description Box */}
        {selectedAnatomyPart && anatomyParts[selectedAnatomyPart] && (
          <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${anatomyParts[selectedAnatomyPart].color}`}>
            <div className="font-bold mb-1 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>{anatomyParts[selectedAnatomyPart].title}</span>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm">{anatomyParts[selectedAnatomyPart].desc}</p>
          </div>
        )}
      </div>

      {/* Interactive Activity 2: Classify the 4 Classic Fonts */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Practical Exercise: Font Classifier' : 'Exercițiul Practic: Clasificatorul de Fonturi'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Assign each popular font its proper typographical category.'
                : 'Atribuie fiecărui font popular categoria corectă de stil tipografic.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fontsToClassify.map((font) => {
            const currentChoice = classifiedFonts[font.id];
            const isCorrect = currentChoice === font.correct;

            return (
              <div key={font.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">{font.name}</span>
                  {currentChoice && (
                    <span className="text-xs font-mono flex items-center gap-1">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'en' ? 'Correct' : 'Corect'}
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> {lang === 'en' ? 'Wrong' : 'Greșit'}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['serif', 'sans', 'mono'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleClassify(font.id, cat)}
                      className={`px-2 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition cursor-pointer ${
                        currentChoice === cat
                          ? isCorrect
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-rose-500/20 border-rose-400 text-rose-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat === 'serif' ? 'Serif' : cat === 'sans' ? 'Sans-Serif' : 'Monospace'}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center justify-between pt-2">
          <span>
            {lang === 'en' ? 'Correct classifications:' : 'Clasificări corecte:'}{' '}
            <b className="text-cyan-400">{correctClassificationsCount} / 4</b>
          </span>
          {correctClassificationsCount === 4 && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? '+25 Points earned!' : '+25 Puncte acumulate!'}
            </span>
          )}
        </div>
      </div>

      {/* Pedagogical Questions Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Knowledge Check: Pedagogical Questions'
                : 'Verificarea Cunoștințelor: Întrebări Pedagogice'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Answer the 3 theory and applied questions correctly.'
                : 'Răspunde corect la cele 3 întrebări de teorie și aplicabilitate.'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. Why do printed books, magazines, and newspapers traditionally use Serif fonts?'
                : '1. De ce cărțile, revistele tipărite și ziarele folosesc în mod tradițional fonturi Serif (cu piciorușe)?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'serif_print',
                textRo:
                  'Serifele creează o linie optică invizibilă care călăuzește ochii de la stânga la dreapta de-a lungul rândurilor lungi.',
                textEn:
                  'Serifs create an invisible optical guideline that navigates the reader eyes smoothly across long printed lines.',
              },
              {
                id: 'ink_saving',
                textRo: 'Piciorușele literelor consumă cu 50% mai puțin tuș la tipărirea pe imprimante laser.',
                textEn: 'Letter feet consume 50% less toner when printing on laser printers.',
              },
              {
                id: 'computer_rule',
                textRo: 'Monitoarele vechi din anii 1980 nu puteau afișa altceva decât caractere cu serife.',
                textEn: '1980s monitors were unable to render anything other than serif glyphs.',
              },
              {
                id: 'short_only',
                textRo: 'Sunt destinate doar titlurilor de maxim trei cuvinte și reclamelor scurte.',
                textEn: 'They are intended solely for short three-word headings and billboards.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'serif_print'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'en'
                ? 'Think about how your eyes track a long line of printed text. Serif endings visually connect adjacent letters.'
                : 'Gândește-te la modul în care privirea ta urmărește un rând lung dintr-un roman. Terminațiile literelor Serif leagă caracterele vizual.'
            }
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! Serifs serve as an optical horizontal guide, significantly reducing eye strain during extended reading on paper.'
                  : 'Corect! Serifele (piciorușele) funcționează ca o călăuză orizontală pentru privire, micșorând oboseala ochilor la citirea textelor compacte lungi pe suport de hârtie.'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. Why is using a Monospaced font mandatory in programming (C++, Code::Blocks, Scratch)?'
                : '2. De ce în programare (C++, Code::Blocks, Scratch) este obligatorie utilizarea unui font Monospațiat?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'mono_alignment',
                textRo:
                  'Fiecare caracter are exact aceeași lățime, astfel acoladele, variabilele și coloanele de cod rămân aliniate perfect vertical.',
                textEn:
                  'Every character has the exact same width, keeping curly braces, variables, and columns vertically aligned.',
              },
              {
                id: 'fast_compile',
                textRo: 'Compilatorul GNU GCC rulează de 3 ori mai rapid dacă fișierul .cpp e redactat cu Consolas.',
                textEn: 'The GNU GCC compiler runs 3x faster when the .cpp file is typed in Consolas.',
              },
              {
                id: 'no_vowels',
                textRo: 'Fonturile monospațiate nu permit tastarea vocalelor, eliminând greșelile de ortografie.',
                textEn: 'Monospace fonts disallow typing vowels, eliminating spelling mistakes.',
              },
              {
                id: 'lower_res',
                textRo: 'Ocupă mai puțin spațiu pe hard disk decât fonturile proporționale.',
                textEn: 'They take up less hard drive space than proportional fonts.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'mono_alignment'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'en'
                ? 'Compare letter "i" with "w". In proportional fonts "w" is 3x wider than "i". In monospace fonts they share the exact same bounding box!'
                : 'Compară litera \'i\' cu litera \'w\'. Într-un font proporțional obișnuit \'w\' e de 3 ori mai lat decât \'i\'. Într-un font monospațiat au aceeași căsuță!'
            }
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                lang === 'en'
                  ? 'Excellent! In a monospaced font (Consolas, Courier New), every glyph shares the exact same horizontal width, guaranteeing flawless code indentation and syntax clarity.'
                  : 'Excelent! Într-un font monospațiat (Consolas, Courier New), fiecare simbol are o lățime identică, garantând indentarea precisă a blocurilor de cod și lizibilitatea sintaxei.'
              }
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. In the anatomy of lowercase "p" or "q", what is the portion extending below the baseline called?'
                : '3. În anatomia literei mici „p” sau „q”, cum se numește porțiunea care coboară sub linia de bază (baseline)?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'descender',
                textRo: 'Descender (Coadă descendentă)',
                textEn: 'Descender',
              },
              {
                id: 'ascender',
                textRo: 'Ascender (Tijă ascendentă)',
                textEn: 'Ascender',
              },
              {
                id: 'serif',
                textRo: 'Serifă unghiulară',
                textEn: 'Angular Serif',
              },
              {
                id: 'stem',
                textRo: 'Trăsătură dorsală de legătură',
                textEn: 'Dorsal Stem',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'descender'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'en'
                ? 'The term originates from Latin "descendere" (to descend/drop down). Observe how the tail of "p" drops below the baseline.'
                : 'Cuvântul vine din limba latină \'descendere\' (a coborî). Privește linia de bază peste care litera p își lasă coada în jos.'
            }
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! The Descender is the anatomical part extending below the baseline, characteristic of letters g, j, p, q, and y.'
                  : 'Corect! Coada descendentă (Descender) este elementul care coboară sub baseline, fiind specific literelor g, j, p, q, y.'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={1}
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
