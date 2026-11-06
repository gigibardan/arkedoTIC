import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Bold,
  Italic,
  Type,
  Printer,
  Download,
  Award,
  Layers,
  Sliders,
  Check,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W1Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W1Level6_EditorialStudio: React.FC<W1Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Active Ribbon Tab
  const [activeRibbonTab, setActiveRibbonTab] = useState<'home' | 'insert' | 'layout'>('home');

  // Document Editorial Formatting States
  const [titleStyle, setTitleStyle] = useState<'raw' | 'heading1'>('raw');
  const [subtitleStyle, setSubtitleStyle] = useState<'raw' | 'heading2'>('raw');
  const [bodyAlignment, setBodyAlignment] = useState<'left' | 'center' | 'justify'>('left');
  const [firstLineIndent, setFirstLineIndent] = useState<number>(0); // 0 or 1.25
  const [hasDropCap, setHasDropCap] = useState<boolean>(false);
  const [diacriticsCleaned, setDiacriticsCleaned] = useState<boolean>(false);
  const [hasHeaderFooter, setHasHeaderFooter] = useState<boolean>(false);
  const [lineSpacing, setLineSpacing] = useState<number>(1.0); // 1.0, 1.15, 1.5

  // Rubric Checklist
  const isTitleCorrect = titleStyle === 'heading1';
  const isSubtitleCorrect = subtitleStyle === 'heading2';
  const isBodyFormatted = bodyAlignment === 'justify' && firstLineIndent === 1.25 && lineSpacing >= 1.15;
  const isDiacriticsFixed = diacriticsCleaned;
  const isDropCapEnabled = hasDropCap;
  const isHeaderFooterConfigured = hasHeaderFooter;

  const completedCriteriaCount =
    (isTitleCorrect ? 1 : 0) +
    (isSubtitleCorrect ? 1 : 0) +
    (isBodyFormatted ? 1 : 0) +
    (isDiacriticsFixed ? 1 : 0) +
    (isDropCapEnabled ? 1 : 0) +
    (isHeaderFooterConfigured ? 1 : 0);

  const totalScore = Math.min(100, Math.round((completedCriteriaCount / 6) * 100));
  const canProceed = completedCriteriaCount >= 5;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/40">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {lang === 'ro'
                  ? 'NIVELUL 6 DIN 7 • ATELIERUL EDITORIAL DE NOTA 10'
                  : 'LEVEL 6 OF 7 • TOP EDITORIAL STUDIO'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {lang === 'ro'
                ? 'Machetarea Articolului de Revistă Școlară'
                : 'School Magazine Article Layout & Typesetting'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'ro'
                ? 'Ești redactorul-șef al revistei școlii! Machetează articolul brut folosind panglica Ribbon: aplică Titlu 1 și Titlu 2, alinierea Justified cu alineat 1.25 cm, activează Letrina (Drop Cap) și configurează antetul și subsolul pentru tipar.'
                : 'You are the editor-in-chief of the school magazine! Format raw copy using the Ribbon bar: apply Heading 1 and Heading 2, Justified alignment with 1.25 cm indent, enable Drop Cap, and configure headers and footers for print.'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-blue-500/40 text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">
                {lang === 'ro' ? 'Punctaj Rubrică' : 'Rubric Score'}
              </span>
              <span className="text-2xl font-black font-mono text-cyan-400">{totalScore} / 100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Word Interface Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
        {/* Window Title Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="text-xs font-mono text-slate-400 pl-3">
              {lang === 'ro'
                ? 'Revista_Eco_Gimnaziu_2026.docx — Microsoft Word'
                : 'Eco_Magazine_MiddleSchool_2026.docx — Microsoft Word'}
            </span>
          </div>

          <span className="text-xs font-mono text-blue-400 font-bold bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/30">
            {lang === 'ro' ? 'Salvat pe Cloud • OneDrive' : 'Saved to Cloud • OneDrive'}
          </span>
        </div>

        {/* Ribbon Tabs Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-5 flex items-center gap-2">
          {[
            { id: 'home', label: lang === 'ro' ? 'Pornire (Home)' : 'Home' },
            { id: 'insert', label: lang === 'ro' ? 'Inserare (Insert)' : 'Insert' },
            { id: 'layout', label: lang === 'ro' ? 'Machetare (Layout)' : 'Layout' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveRibbonTab(tab.id as any);
              }}
              className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 cursor-pointer ${
                activeRibbonTab === tab.id
                  ? 'border-blue-400 text-white bg-slate-800/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ribbon Tools Panel */}
        <div className="bg-slate-850 p-4 border-b border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
          {activeRibbonTab === 'home' && (
            <>
              {/* Styles Group */}
              <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">
                  {lang === 'ro' ? 'Stiluri:' : 'Styles:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setTitleStyle(titleStyle === 'heading1' ? 'raw' : 'heading1');
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    titleStyle === 'heading1'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'ro' ? 'Titlu 1' : 'Heading 1'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSubtitleStyle(subtitleStyle === 'heading2' ? 'raw' : 'heading2');
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    subtitleStyle === 'heading2'
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'ro' ? 'Titlu 2' : 'Heading 2'}
                </button>
              </div>

              {/* Alignment Group */}
              <div className="flex items-center gap-1.5 pr-4 border-r border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">
                  {lang === 'ro' ? 'Aliniere:' : 'Alignment:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setBodyAlignment('left');
                  }}
                  className={`p-1.5 rounded-lg border cursor-pointer ${
                    bodyAlignment === 'left' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title={lang === 'ro' ? 'Aliniere la stânga (Ctrl+L)' : 'Align Left (Ctrl+L)'}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setBodyAlignment('center');
                  }}
                  className={`p-1.5 rounded-lg border cursor-pointer ${
                    bodyAlignment === 'center' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title={lang === 'ro' ? 'Centrat (Ctrl+E)' : 'Center (Ctrl+E)'}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setBodyAlignment('justify');
                  }}
                  className={`p-1.5 rounded-lg border cursor-pointer ${
                    bodyAlignment === 'justify' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title={lang === 'ro' ? 'Aliniere stânga-dreapta Justified (Ctrl+J)' : 'Justify (Ctrl+J)'}
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              {/* Spacing & Indent Group */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase block">
                  {lang === 'ro' ? 'Paragraf:' : 'Paragraph:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setFirstLineIndent(firstLineIndent === 1.25 ? 0 : 1.25);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                    firstLineIndent === 1.25
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'ro' ? 'Alineat 1.25 cm' : 'Indent 1.25 cm'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setLineSpacing(lineSpacing === 1.5 ? 1.0 : 1.5);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                    lineSpacing === 1.5
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {lang === 'ro' ? 'Interlinie 1.5x' : 'Line Spacing 1.5x'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playCorrect();
                    setDiacriticsCleaned(true);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                    diacriticsCleaned
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                      : 'bg-amber-600 text-white border-amber-400 animate-pulse'
                  }`}
                >
                  {diacriticsCleaned
                    ? (lang === 'ro' ? '✓ Tipografie & Ghilimele Curățate' : '✓ Typography & Quotes Cleaned')
                    : (lang === 'ro' ? 'Curăță Diacritice & Ghilimele' : 'Clean Typography & Quotes')}
                </button>
              </div>
            </>
          )}

          {activeRibbonTab === 'insert' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase block">
                  {lang === 'ro' ? 'Text Artistic & Tipar:' : 'Artistic Text & Print:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setHasDropCap(!hasDropCap);
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    hasDropCap
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {hasDropCap
                    ? (lang === 'ro' ? '✓ Letrină (Drop Cap) Activată' : '✓ Drop Cap Enabled')
                    : (lang === 'ro' ? 'Inserează Letrină (Drop Cap)' : 'Insert Drop Cap')}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setHasHeaderFooter(!hasHeaderFooter);
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    hasHeaderFooter
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {hasHeaderFooter
                    ? (lang === 'ro' ? '✓ Antet & Subsol Activate' : '✓ Header & Footer Enabled')
                    : (lang === 'ro' ? 'Inserează Antet & Numerotare Pagină' : 'Insert Header & Page Numbering')}
                </button>
              </div>
            </div>
          )}

          {activeRibbonTab === 'layout' && (
            <div className="flex items-center gap-4 text-slate-300 text-xs">
              <span>{lang === 'ro' ? 'Format Pagină: ' : 'Page Size: '}<b className="text-white">A4 (210 x 297 mm)</b></span>
              <span>{lang === 'ro' ? 'Margini: ' : 'Margins: '}<b className="text-white">2.54 cm ({lang === 'ro' ? 'Normal' : 'Normal'})</b></span>
              <span>{lang === 'ro' ? 'Orientare: ' : 'Orientation: '}<b className="text-white">{lang === 'ro' ? 'Portret' : 'Portrait'}</b></span>
            </div>
          )}
        </div>

        {/* Editor Main Canvas with A4 Paper Preview */}
        <div className="p-6 sm:p-10 bg-slate-950 flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Simulated A4 Sheet */}
          <div className="w-full lg:max-w-2xl bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-12 min-h-[580px] font-serif border border-slate-200 space-y-6 relative">
            {/* Header (Antet) */}
            {hasHeaderFooter && (
              <div className="border-b border-slate-300 pb-2 flex items-center justify-between text-[11px] font-sans text-slate-500 uppercase tracking-wider">
                <span>
                  {lang === 'ro'
                    ? 'Revista „Eco-Generația” • Nr. 4 / Octombrie 2026'
                    : '“Eco-Generation” Magazine • Issue 4 / October 2026'}
                </span>
                <span>{lang === 'ro' ? 'Proiect TIC Clasa a VII-a' : 'Grade 7 ICT Project'}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1 text-center">
              <h1
                className={`transition-all ${
                  titleStyle === 'heading1'
                    ? 'text-2xl sm:text-3xl font-black text-blue-900 font-heading tracking-tight'
                    : 'text-base font-normal text-slate-800'
                }`}
              >
                {lang === 'ro'
                  ? 'Pădurile Urbane — Plămânii Verzi ai Orașului Nostru'
                  : 'Urban Forests — The Green Lungs of Our Community'}
              </h1>

              {/* Subtitle */}
              <h2
                className={`transition-all ${
                  subtitleStyle === 'heading2'
                    ? 'text-sm sm:text-base font-semibold text-slate-600 italic font-sans'
                    : 'text-xs font-normal text-slate-700'
                }`}
              >
                {lang === 'ro'
                  ? 'Investigație editorială realizată de redacția elevilor de gimnaziu'
                  : 'Editorial investigation conducted by middle school student reporters'}
              </h2>
            </div>

            {/* Body Paragraph 1 with Optional Drop Cap */}
            <div
              style={{
                textIndent: `${firstLineIndent}cm`,
                textAlign: bodyAlignment,
                lineHeight: lineSpacing,
              }}
              className="text-sm sm:text-base text-slate-800 relative"
            >
              {hasDropCap && (
                <span className="float-left text-5xl font-black text-blue-900 leading-none mr-2 font-heading">
                  {lang === 'ro' ? 'P' : 'U'}
                </span>
              )}
              {lang === 'ro' ? (
                diacriticsCleaned ? (
                  <>
                    {hasDropCap ? 'ădurile' : 'Pădurile'} și parcurile din proximitatea școlilor românești nu reprezintă simple oaze de relaxare, ci adevărate bariere ecologice care purifică aerul și absorb dioxidul de carbon. Conform studiilor recente menționate în revista „Natura Vie”, fiecare arbore matur produce zilnic oxigenul necesar pentru trei persoane și reduce poluarea fonică din marile bulevarde.
                  </>
                ) : (
                  <>
                    {hasDropCap ? 'ădurile' : 'Pădurile'} şi parcurile din proximitatea şcolilor româneşti nu reprezintă simple oaze de relaxare ,ci adevărate bariere ecologice .Conform studiilor menţionate în "Natura Vie" ,fiecare arbore produce oxigen .
                  </>
                )
              ) : (
                diacriticsCleaned ? (
                  <>
                    {hasDropCap ? 'rban' : 'Urban'} forests and parks near community schools are not mere leisure zones, but essential ecological shields that purify air and absorb carbon dioxide. According to recent research published in “Living Nature”, every mature tree generates daily oxygen for three people while dampening avenue traffic noise.
                  </>
                ) : (
                  <>
                    {hasDropCap ? 'rban' : 'Urban'} forests and parks near community schools are not mere leisure zones ,but essential ecological shields .According to research in "Living Nature" ,each tree makes oxygen .
                  </>
                )
              )}
            </div>

            {/* Body Paragraph 2 */}
            <p
              style={{
                textIndent: `${firstLineIndent}cm`,
                textAlign: bodyAlignment,
                lineHeight: lineSpacing,
              }}
              className="text-sm sm:text-base text-slate-800"
            >
              {lang === 'ro' ? (
                diacriticsCleaned ? (
                  <>
                    Implicarea comunității elevilor a demonstrat că tehnologia și grija pentru mediu pot merge mână în mână. Prin realizarea unei hărți digitale cu arborii seculari și tehnoredactarea unor ghiduri de reciclare distribuite în format PDF, tinerii au demonstrat o responsabilitate civică demnă de toată lauda.
                  </>
                ) : (
                  <>
                    Implicarea comunităţii a demonstrat că tehnologia şi grija pentru mediu pot merge mână în mână .Elevii au realizat o revistă distribuită în şcoală .
                  </>
                )
              ) : (
                diacriticsCleaned ? (
                  <>
                    Active student engagement proved that technology and environmental stewardship go hand in hand. By building digital maps of historic trees and desktop-publishing recycling manuals in PDF format, youth demonstrated exemplary civic responsibility.
                  </>
                ) : (
                  <>
                    Student involvement showed that technology and eco care go hand in hand .Students made a magazine distributed in school .
                  </>
                )
              )}
            </p>

            {/* Footer (Subsol) */}
            {hasHeaderFooter && (
              <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-[11px] font-sans text-slate-500">
                <span>{lang === 'ro' ? 'Colegiul Național • Ediție Tipografică' : 'National Academy • Print Edition'}</span>
                <span className="font-bold text-slate-800">{lang === 'ro' ? 'Pagina 1' : 'Page 1'}</span>
              </div>
            )}
          </div>

          {/* Real-Time Rubric Validator Panel */}
          <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shrink-0">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {lang === 'ro' ? 'Barem de Evaluare Tipografică' : 'Typography Evaluation Rubric'}
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">
                  {lang === 'ro'
                    ? `${completedCriteriaCount} din 6 cerințe îndeplinite`
                    : `${completedCriteriaCount} of 6 criteria completed`}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div
                className={`flex items-start gap-2 p-2 rounded-xl transition ${
                  isTitleCorrect ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-400'
                }`}
              >
                {isTitleCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                )}
                <span>
                  {lang === 'ro' ? '1. Titlu principal stilizat Titlu 1' : '1. Main title styled with Heading 1'}
                </span>
              </div>

              <div
                className={`flex items-start gap-2 p-2 rounded-xl transition ${
                  isSubtitleCorrect ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-400'
                }`}
              >
                {isSubtitleCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                )}
                <span>
                  {lang === 'ro' ? '2. Subtitlu stilizat Titlu 2' : '2. Subtitle styled with Heading 2'}
                </span>
              </div>

              <div
                className={`flex items-start gap-2 p-2 rounded-xl transition ${
                  isBodyFormatted ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-400'
                }`}
              >
                {isBodyFormatted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                )}
                <span>
                  {lang === 'ro'
                    ? '3. Aliniere Justified + Alineat 1.25 cm + Interlinie 1.5'
                    : '3. Justified alignment + 1.25 cm indent + 1.5 line spacing'}
                </span>
              </div>

              <div
                className={`flex items-start gap-2 p-2 rounded-xl transition ${
                  isDiacriticsFixed ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-400'
                }`}
              >
                {isDiacriticsFixed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                )}
                <span>
                  {lang === 'ro'
                    ? '4. Diacritice cu virgulă & ghilimele conforme'
                    : '4. Clean punctuation spacing & standard quotes'}
                </span>
              </div>

              <div
                className={`flex items-start gap-2 p-2 rounded-xl transition ${
                  isDropCapEnabled ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-400'
                }`}
              >
                {isDropCapEnabled ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                )}
                <span>
                  {lang === 'ro'
                    ? '5. Inserare Letrină (Drop Cap) la debut'
                    : '5. Insert Drop Cap at first paragraph start'}
                </span>
              </div>

              <div
                className={`flex items-start gap-2 p-2 rounded-xl transition ${
                  isHeaderFooterConfigured ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-400'
                }`}
              >
                {isHeaderFooterConfigured ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                )}
                <span>
                  {lang === 'ro'
                    ? '6. Antet & Numerotare Pagină în subsol'
                    : '6. Header & Page Numbering in footer'}
                </span>
              </div>
            </div>

            {completedCriteriaCount >= 5 && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'ro'
                    ? 'Document pregătit pentru tipar și publicare PDF!'
                    : 'Document ready for press and PDF publication!'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={6}
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
