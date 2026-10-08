import React, { useState } from 'react';
import { 
  Eye, 
  Grid, 
  BookOpen, 
  MonitorPlay, 
  ZoomIn, 
  ZoomOut, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Star,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P1Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P1Level6_StatusAndViews: React.FC<P1Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // 4 View Modes: 'normal' | 'sorter' | 'reading' | 'slideshow'
  const [activeViewMode, setActiveViewMode] = useState<'normal' | 'sorter' | 'reading' | 'slideshow'>('normal');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [testedViews, setTestedViews] = useState<Record<string, boolean>>({ normal: true });

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleSelectView = (mode: 'normal' | 'sorter' | 'reading' | 'slideshow') => {
    sounds.playClick();
    setActiveViewMode(mode);
    setTestedViews(prev => ({ ...prev, [mode]: true }));
  };

  const handleZoom = (newZoom: number) => {
    sounds.playClick();
    setZoomLevel(newZoom);
  };

  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'sorter_role') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'zoom_purpose') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'sorter_role';
  const isQ2Correct = q2Answer === 'zoom_purpose';

  const testedCount = Object.keys(testedViews).length;
  const explorerScore = testedCount >= 3 ? 50 : testedCount * 15;
  const quizScore = (isQ1Correct ? 25 : 0) + (isQ2Correct ? 25 : 0);
  const totalScore = Math.min(100, explorerScore + quizScore);

  const isPageComplete = (q1Answer !== null && q2Answer !== null) || testedCount >= 3;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/40">
              {lang === 'en' ? 'Grade 6 • Unit 1 • Page 15' : 'Clasa a VI-a • Unitatea 1 • Pag. 15'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {lang === 'en' ? 'Screen 6 of 7' : 'Ecranul 6 din 7'}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
              <Eye className="w-6 h-6" />
            </span>
            <span>
              {lang === 'en'
                ? 'Status Bar, View Modes & Zoom Panoraming'
                : 'Bara de Stare, Moduri de Vizualizare & Zoom'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'Control how you see your slides! Switch between Normal, Slide Sorter, Reading View, and full Slide Show, and calibrate your zoom level.'
              : 'Schimbă perspectiva de lucru! Învață când să folosești vizualizarea Normală, Sortare diapozitive (pentru reordonare rapidă), Modul Citire sau Expunerea pe ecran complet, și ajustează cursorul de panoramare (zoom).'}
          </p>
        </div>
      </div>

      {/* The 4 View Modes Theory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: 'normal',
            icon: '🖥️',
            titleRo: '1. Mod Normal',
            titleEn: '1. Normal View',
            descRo: 'Modul implicit de editare. Ai miniatura în stânga și diapozitivul mare de lucru în centru.',
            descEn: 'Default editing mode. Thumbnail pane on left, big slide workspace in center.'
          },
          {
            id: 'sorter',
            icon: '🗂️',
            titleRo: '2. Sortare Diapozitive',
            titleEn: '2. Slide Sorter',
            descRo: 'Arată toate diapozitivele ca o tablă de șah. Excelent pentru a muta, șterge sau reordona pagini.',
            descEn: 'Shows all slides as a grid matrix. Perfect for dragging, deleting, and reordering slides.'
          },
          {
            id: 'reading',
            icon: '📖',
            titleRo: '3. Vizualizare Citire',
            titleEn: '3. Reading View',
            descRo: 'Simulează prezentarea într-o fereastră comodă fără să ocupe tot ecranul calculatorului.',
            descEn: 'Simulates the presentation inside a compact window without taking over full screen.'
          },
          {
            id: 'slideshow',
            icon: '📽️',
            titleRo: '4. Expunere (F5)',
            titleEn: '4. Slide Show (F5)',
            descRo: 'Proiecția oficială pe ecran complet pentru spectatori, cu animații și tranziții active.',
            descEn: 'Official full-screen projection for the audience, running all live animations.'
          }
        ].map(vm => (
          <div
            key={vm.id}
            onClick={() => handleSelectView(vm.id as any)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeViewMode === vm.id
                ? 'border-orange-400 bg-orange-950/40 ring-2 ring-orange-500/30'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-2xl mb-2">{vm.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1">
                {lang === 'en' ? vm.titleEn : vm.titleRo}
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'en' ? vm.descEn : vm.descRo}
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-orange-400 font-bold">
              {activeViewMode === vm.id ? '✓ Activ în simulator' : 'Apasă pentru activare'}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive View Simulator Stage */}
      <div className="bg-slate-900/95 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              {lang === 'en' ? 'Live View Simulator' : 'Simulatorul Modurilor de Vizualizare & Zoom'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-heading">
              {lang === 'en' ? 'Interactive Workspace Viewport:' : 'Spațiul de Lucru Interactiv:'}
            </h3>
          </div>

          {/* Zoom Slider Control */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => handleZoom(Math.max(50, zoomLevel - 25))}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="50"
              max="150"
              step="25"
              value={zoomLevel}
              onChange={(e) => handleZoom(Number(e.target.value))}
              className="w-24 accent-orange-500 cursor-pointer"
            />
            <button
              onClick={() => handleZoom(Math.min(150, zoomLevel + 25))}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-orange-300 w-10 text-right">
              {zoomLevel}%
            </span>
          </div>
        </div>

        {/* Viewport Simulation Area */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[300px] flex items-center justify-center overflow-auto">
          {/* 1. NORMAL VIEW */}
          {activeViewMode === 'normal' && (
            <div
              className="w-full max-w-xl grid grid-cols-12 gap-3 transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
            >
              <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col gap-2 text-[10px]">
                <div className="p-1 rounded bg-orange-600/30 border border-orange-500 text-orange-200">
                  1 [Slide 1]
                </div>
                <div className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  2 [Slide 2]
                </div>
                <div className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  3 [Slide 3]
                </div>
              </div>

              <div className="col-span-9 bg-slate-900 border-2 border-orange-500/60 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-lg">
                <span className="text-xs font-bold text-white mb-1">
                  DIAPOZITIVUL 1: PROIECTUL TIC
                </span>
                <span className="text-[10px] text-slate-400">
                  Editare text, imagini și grafice la scara {zoomLevel}%
                </span>
              </div>
            </div>
          )}

          {/* 2. SLIDE SORTER VIEW */}
          {activeViewMode === 'sorter' && (
            <div
              className="w-full max-w-xl grid grid-cols-3 gap-3 transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-700 hover:border-orange-400 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-move transition shadow"
                  onClick={() => sounds.playClick()}
                >
                  <span className="text-xs font-bold text-white mb-1">Diapozitiv {i}</span>
                  <span className="text-[9px] font-mono text-slate-400">Glisează pentru reordonare</span>
                </div>
              ))}
            </div>
          )}

          {/* 3. READING VIEW */}
          {activeViewMode === 'reading' && (
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
                <span>PowerPoint — Vizualizare Citire (Fereastră)</span>
                <span>[—] [▢] [✕]</span>
              </div>
              <div className="h-44 bg-gradient-to-br from-indigo-950 to-slate-900 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <h4 className="text-sm font-bold text-white">România Frumoasă: Munții Carpați</h4>
                <p className="text-xs text-slate-300 mt-1">Simulare comodă de lectură fără bară de comenzi completă.</p>
              </div>
            </div>
          )}

          {/* 4. SLIDE SHOW VIEW */}
          {activeViewMode === 'slideshow' && (
            <div className="w-full h-64 bg-black rounded-xl border-4 border-orange-500/80 flex flex-col items-center justify-center text-center p-6 shadow-2xl">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-2 animate-pulse">
                PROIECȚIE EXPUNERE PE TOT ECRANUL (F5)
              </span>
              <h3 className="text-xl font-black text-white">Misiunea TIC: Clasa a VI-a în Acțiune</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md">
                Publicul vede doar diapozitivul la rezoluție maximă. Pentru a ieși din expunere se apasă tasta Esc!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checkpoint Quiz */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg sm:text-xl font-black text-white font-heading">
            {lang === 'en' ? 'Checkpoint Questions (Art Klett p. 15)' : 'Întrebări de Fixare (Manual Art Klett pag. 15)'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '1. When is the "Slide Sorter" (Sortare diapozitive) view best used?'
                : '1. Când este cel mai util să folosim modul „Sortare diapozitive” (Slide Sorter)?'}
            </span>
            <QuestionHint
              hintRo="Când vrei să vezi toate miniaturile simultan și să schimbi ordinea diapozitivelor prin glisare."
              hintEn="When you want to see all thumbnails at once and reorder slides by dragging."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'sorter_role', ro: 'Pentru a reordona, duplica sau șterge rapid diapozitivele în matrice', en: 'To reorder, duplicate, or quickly delete slides in matrix' },
              { id: 'draw_paint', ro: 'Pentru a desena cu pensula peste calculator', en: 'To paint with a brush over the computer' },
              { id: 'send_email', ro: 'Pentru a trimite prezentarea direct prin poștă', en: 'To send presentation by post' },
              { id: 'delete_sound', ro: 'Pentru a tăia cablul de la boxe', en: 'To cut the speaker wire' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'sorter_role'
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
              customMessageRo="Reflecție didactică: Sortarea diapozitivelor oferă o vedere de ansamblu ideală pentru mutarea rapidă a slide-urilor!"
              customMessageEn="Pedagogical reflection: Slide Sorter offers a bird-eye view ideal for rearranging slides rapidly!"
            />
          ) : null}

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! Modul Sortare diapozitive prezintă toate diapozitivele ca o matrice, facilitând reordonarea lor rapidă prin tragere cu mausul."
              explanationEn="Correct! Slide Sorter displays all slides as a grid, making it super easy to reorder them via drag and drop."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '2. What happens when you adjust the Zoom slider in the Status Bar?'
                : '2. Ce efect are modificarea cursorului de Zoom (panoramare) din Bara de stare?'}
            </span>
            <QuestionHint
              hintRo="Mărește sau micșorează doar afișarea pe ecran, fără să schimbe dimensiunea reală a diapozitivului!"
              hintEn="It enlarges or shrinks only the screen preview, without altering actual slide dimensions!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'zoom_purpose', ro: 'Mărește/micșorează doar vizualizarea de lucru, fără a afecta mărimea reală la tipărire sau expunere', en: 'Scales the working view only, without altering real size on print or show' },
              { id: 'deletes_text', ro: 'Șterge 50% din textul din prezentare', en: 'Deletes 50% of the text' },
              { id: 'makes_file_heavy', ro: 'Face fișierul să ocupe 100 de Gigaocteți', en: 'Makes the file take up 100 Gigabytes' },
              { id: 'shuts_pc', ro: 'Oprește calculatorul imediat', en: 'Turns off the PC immediately' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'zoom_purpose'
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
              customMessageRo="Reflecție didactică: Zoom-ul reglează doar confortul vizual al utilizatorului la editare!"
              customMessageEn="Pedagogical reflection: Zoom only adjusts the user's visual comfort while editing!"
            />
          ) : null}

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Excelent! Cursorul de panoramare (Zoom) modifică doar gradul de mărire al ferestrei de editare, pentru detalii fine sau imagine de ansamblu."
              explanationEn="Excellent! The zoom slider only adjusts the magnification of the editing canvas for fine details or broad overview."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={6}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 7: Laborator de Comenzi & Marea Evaluare PowerPoint"
        nextButtonLabelEn="Proceed to Page 7: Command Lab & PowerPoint Grand Exam"
      />
    </div>
  );
};
