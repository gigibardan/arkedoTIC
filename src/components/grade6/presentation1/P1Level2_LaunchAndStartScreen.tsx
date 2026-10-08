import React, { useState } from 'react';
import { 
  FilePlus, 
  FolderOpen, 
  LayoutTemplate, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Monitor, 
  Clock, 
  Star,
  Check,
  MousePointer
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P1Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P1Level2_LaunchAndStartScreen: React.FC<P1Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Office Start Screen Simulator
  // 3 Launch Modes: 'blank' | 'template' | 'open'
  const [activeStartMode, setActiveStartMode] = useState<'blank' | 'template' | 'open'>('blank');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('atlas');
  const [hasTestedLaunch, setHasTestedLaunch] = useState<Record<string, boolean>>({ blank: true });

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleSelectMode = (mode: 'blank' | 'template' | 'open') => {
    sounds.playClick();
    setActiveStartMode(mode);
    setHasTestedLaunch(prev => ({ ...prev, [mode]: true }));
  };

  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'three_modes') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'template_benefit') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'three_modes';
  const isQ2Correct = q2Answer === 'template_benefit';

  // Scoring
  const exploredCount = Object.keys(hasTestedLaunch).length;
  const explorerScore = exploredCount >= 3 ? 50 : exploredCount * 15;
  const quizScore = (isQ1Correct ? 25 : 0) + (isQ2Correct ? 25 : 0);
  const totalScore = Math.min(100, explorerScore + quizScore);

  const isPageComplete = (q1Answer !== null && q2Answer !== null) || exploredCount >= 2;

  const templatesList = [
    { id: 'atlas', name: 'Atlas Geografic', color: 'from-blue-600 to-cyan-500', icon: '🌍' },
    { id: 'tech', name: 'Inovație Tehnologică', color: 'from-purple-600 to-indigo-600', icon: '💻' },
    { id: 'nature', name: 'Ecologie & Natură', color: 'from-emerald-600 to-teal-500', icon: '🌱' },
    { id: 'retro', name: 'Vintage Modern', color: 'from-amber-600 to-orange-500', icon: '📜' }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/40">
              {lang === 'en' ? 'Grade 6 • Unit 1 • Page 12-13' : 'Clasa a VI-a • Unitatea 1 • Pag. 12-13'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {lang === 'en' ? 'Screen 2 of 7' : 'Ecranul 2 din 7'}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
              <FilePlus className="w-6 h-6" />
            </span>
            <span>
              {lang === 'en'
                ? 'Launching PowerPoint & The 3 Start Modes'
                : 'Pornirea PowerPoint & Cele 3 Moduri de Start'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'When opening PowerPoint, the application welcomes you with the Start Screen. Discover how to create an empty presentation from scratch, choose a designer template, or resume an existing file from disk!'
              : 'La pornirea aplicației PowerPoint, ne întâmpină ecranul de start (Start Screen). Descoperă cum poți crea o prezentare nouă de la zero, alege un șablon grafic predefinit sau deschide un proiect salvat anterior pe disc!'}
          </p>
        </div>
      </div>

      {/* Didactic Theory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center justify-center mb-3">
            <FilePlus className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">
            {lang === 'en' ? '1. Blank Presentation' : '1. Prezentare necompletată'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Starts with an empty white slide. You have 100% creative freedom to choose backgrounds, fonts, and colors.'
              : 'Pornire clasică cu un diapozitiv alb curat. Ai libertate totală de a alege fonturile, culorile și conținutul de la zero.'}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center mb-3">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">
            {lang === 'en' ? '2. Predefined Template' : '2. Șablon predefinit (Template)'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Comes with professionally paired color palettes, modern fonts, and coordinated slide layouts ready to use.'
              : 'Include o schemă cromatică armonioasă, fonturi potrivite și aranjamente prestabilite create de designeri profesioniști.'}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center mb-3">
            <FolderOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">
            {lang === 'en' ? '3. Open Existing File' : '3. Deschidere fișier existent'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Browse recent files or open a .pptx document saved on your PC, USB drive, or cloud OneDrive.'
              : 'Permite reluarea lucrului la un fișier salvat anterior (.pptx) de pe calculator, stick USB sau din stocarea cloud OneDrive.'}
          </p>
        </div>
      </div>

      {/* Interactive Simulator: Office Start Screen */}
      <div className="bg-slate-900/95 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-600/30">
              P
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                {lang === 'en' ? 'Interactive Lab' : 'Laborator Interactiv'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                {lang === 'en' ? 'PowerPoint Start Screen Simulator' : 'Simulator: Ecranul de Pornire PowerPoint'}
              </h3>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => handleSelectMode('blank')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeStartMode === 'blank'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Blank' : 'Necompletată'}</span>
            </button>
            <button
              onClick={() => handleSelectMode('template')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeStartMode === 'template'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Templates' : 'Șabloane'}</span>
            </button>
            <button
              onClick={() => handleSelectMode('open')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeStartMode === 'open'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Open' : 'Deschidere'}</span>
            </button>
          </div>
        </div>

        {/* Start Screen Content View */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[280px]">
          {activeStartMode === 'blank' && (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="w-48 h-32 bg-white rounded-lg shadow-2xl border-4 border-slate-300 flex flex-col items-center justify-center p-3 mb-4 group hover:border-orange-500 transition cursor-pointer">
                <span className="text-slate-400 text-xs font-semibold">
                  {lang === 'en' ? 'Click to add title' : 'Faceți clic pentru a adăuga titlul'}
                </span>
                <span className="text-slate-300 text-[10px] mt-1">
                  {lang === 'en' ? 'Click to add subtitle' : 'Faceți clic pentru subtitlu'}
                </span>
              </div>
              <h4 className="text-white font-bold text-sm mb-1">
                {lang === 'en' ? 'Blank Presentation (Default 16:9 Widescreen)' : 'Prezentare necompletată (Format Panoramic 16:9)'}
              </h4>
              <p className="text-xs text-slate-400 max-w-md">
                {lang === 'en'
                  ? 'Standard white slide ready for custom design. Keyboard shortcut: Ctrl + N opens a new blank presentation instantly!'
                  : 'Diapozitiv alb standard gata de lucru. Scurtătura de la tastatură: Ctrl + N deschide instant o prezentare nouă!'}
              </p>
            </div>
          )}

          {activeStartMode === 'template' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-slate-300 font-semibold">
                {lang === 'en' ? 'Choose an inspired template gallery:' : 'Alege un șablon din galeria de teme predefinite:'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {templatesList.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedTemplate(t.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-28 ${
                      selectedTemplate === t.id
                        ? 'border-orange-400 bg-orange-950/40 ring-2 ring-orange-500/30'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-full h-12 rounded-lg bg-gradient-to-r ${t.color} flex items-center justify-center text-xl shadow-inner`}>
                      {t.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {selectedTemplate === t.id ? '✓ Selectat' : 'Șablon'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeStartMode === 'open' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-300 font-semibold">
                {lang === 'en' ? 'Recent presentations in lab storage:' : 'Prezentări recente găsite în memoria laboratorului:'}
              </p>
              <div className="space-y-2">
                {[
                  { name: 'Proiect_Romania_Turistica.pptx', date: 'Azi, 10:15', size: '3.4 MB' },
                  { name: 'RoboTIC_Prezentare_Echipa.pptx', date: 'Ieri, 14:30', size: '1.8 MB' },
                  { name: 'Planeta_Pamant_Ecologie.pptx', date: '3 Octombrie', size: '5.1 MB' }
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition cursor-pointer"
                    onClick={() => sounds.playClick()}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-600/30 border border-orange-500/40 flex items-center justify-center text-orange-300 text-xs font-black">
                        PPT
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{f.name}</div>
                        <div className="text-[10px] text-slate-400">{f.date}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{f.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Quiz */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg sm:text-xl font-black text-white font-heading">
            {lang === 'en' ? 'Checkpoint Questions (Art Klett p. 12-13)' : 'Întrebări de Fixare (Manual Art Klett pag. 12-13)'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '1. How many main modes are available when starting PowerPoint?'
                : '1. Câte moduri principale de pornire a unei prezentări oferă ecranul de start PowerPoint?'}
            </span>
            <QuestionHint
              hintRo="Reține cele 3 variante: pornire necompletată, alegerea unui șablon sau deschiderea unui fișier existent."
              hintEn="Remember the 3 options: blank start, choosing a template, or opening an existing file."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'one_only', ro: 'Doar unul singur (alb necompletat)', en: 'Only one (blank white)' },
              { id: 'three_modes', ro: '3 moduri: Necompletată, Șablon sau Deschidere fișier', en: '3 modes: Blank, Template, or Open file' },
              { id: 'unlimited', ro: 'Peste 50 de moduri aleatorii', en: 'Over 50 random modes' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'three_modes'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>

          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q1}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: PowerPoint permite alegerea unei foi albe, a unui șablon de design sau reluarea unui fișier salvat!"
              customMessageEn="Pedagogical reflection: PowerPoint allows starting blank, picking a template, or resuming a file!"
            />
          ) : null}

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! Cele 3 moduri sunt: Prezentare necompletată, Șablon predefinit și Deschidere fișier existent."
              explanationEn="Correct! The 3 modes are: Blank presentation, Predefined template, and Open existing file."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '2. What is the major advantage of using a predefined template?'
                : '2. Care este marele avantaj al utilizării unui șablon predefinit (Template)?'}
            </span>
            <QuestionHint
              hintRo="Șabloanele includ deja o paletă de culori profesionistă și aranjamente gata create."
              hintEn="Templates already include a professional color palette and pre-built layouts."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'template_benefit', ro: 'Economisește timp și oferă o armonie cromatică profesională', en: 'Saves time and provides professional color harmony' },
              { id: 'computer_runs_faster', ro: 'Face calculatorul să funcționeze de două ori mai rapid', en: 'Makes the computer run twice as fast' },
              { id: 'cannot_edit', ro: 'Nu mai poți schimba niciodată textul din diapozitiv', en: 'You can never change text on the slide again' },
              { id: 'prints_alone', ro: 'Se imprimă automat fără să apeși nimic', en: 'Prints automatically without clicking' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'template_benefit'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>

          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Șabloanele predefinite sunt create de designeri pentru a asigura un aspect vizual plăcut!"
              customMessageEn="Pedagogical reflection: Predefined templates are designer-crafted to ensure a pleasing visual look!"
            />
          ) : null}

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Excelent! Șabloanele oferă fonturi armonioase, fundaluri atractive și structuri gata concepute de designeri."
              explanationEn="Excellent! Templates provide harmonious fonts, attractive backgrounds, and designer structures."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={2}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 3: Anatomia Interfeței PowerPoint"
        nextButtonLabelEn="Proceed to Page 3: PowerPoint Interface Anatomy"
      />
    </div>
  );
};
