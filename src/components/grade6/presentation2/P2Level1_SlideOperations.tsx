import React, { useState } from 'react';
import { 
  Copy, 
  Trash2, 
  PlusSquare, 
  Move, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Layers, 
  Star,
  Check,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P2Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

interface SlideItem {
  id: number;
  title: string;
  badge: string;
  color: string;
}

export const P2Level1_SlideOperations: React.FC<P2Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Slide Operations Sandbox
  const initialSlides: SlideItem[] = [
    { id: 1, title: '1. Copertă: Planeta Noastră', badge: 'Titlu', color: 'from-blue-600 to-indigo-700' },
    { id: 2, title: '2. Oceanele & Biosfera', badge: 'Conținut', color: 'from-teal-600 to-cyan-700' },
    { id: 3, title: '3. Soluții Ecologice', badge: 'Concluzie', color: 'from-emerald-600 to-green-700' }
  ];

  const [slides, setSlides] = useState<SlideItem[]>(initialSlides);
  const [selectedSlideId, setSelectedSlideId] = useState<number>(1);
  const [testedOperations, setTestedOperations] = useState<Record<string, boolean>>({ select: true });

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleSelectSlide = (id: number) => {
    sounds.playClick();
    setSelectedSlideId(id);
    setTestedOperations(prev => ({ ...prev, select: true }));
  };

  const handleAddSlide = () => {
    sounds.playRetro('coin');
    const newId = Date.now();
    const newSlide: SlideItem = {
      id: newId,
      title: `${slides.length + 1}. Diapozitiv Nou (Ctrl+M)`,
      badge: 'Aspect Nou',
      color: 'from-purple-600 to-pink-700'
    };
    setSlides(prev => [...prev, newSlide]);
    setSelectedSlideId(newId);
    setTestedOperations(prev => ({ ...prev, add: true }));
  };

  const handleDuplicateSlide = () => {
    const target = slides.find(s => s.id === selectedSlideId);
    if (!target) return;
    sounds.playCorrect();
    const newId = Date.now();
    const duplicate: SlideItem = {
      id: newId,
      title: `Copie: ${target.title.split('. ')[1] || target.title}`,
      badge: 'Duplicat (Ctrl+D)',
      color: target.color
    };
    const index = slides.findIndex(s => s.id === selectedSlideId);
    const updated = [...slides];
    updated.splice(index + 1, 0, duplicate);
    setSlides(updated);
    setSelectedSlideId(newId);
    setTestedOperations(prev => ({ ...prev, duplicate: true }));
  };

  const handleDeleteSlide = () => {
    if (slides.length <= 1) return;
    sounds.playWrong();
    const updated = slides.filter(s => s.id !== selectedSlideId);
    setSlides(updated);
    setSelectedSlideId(updated[0]?.id || 1);
    setTestedOperations(prev => ({ ...prev, delete: true }));
  };

  const handleMoveUp = () => {
    const index = slides.findIndex(s => s.id === selectedSlideId);
    if (index <= 0) return;
    sounds.playClick();
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSlides(updated);
    setTestedOperations(prev => ({ ...prev, move: true }));
  };

  const handleResetSandbox = () => {
    sounds.playClick();
    setSlides(initialSlides);
    setSelectedSlideId(1);
  };

  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'ctrl_d') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'drag_reorder') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'ctrl_d';
  const isQ2Correct = q2Answer === 'drag_reorder';

  const opCount = Object.keys(testedOperations).length;
  const explorerScore = opCount >= 3 ? 50 : opCount * 15;
  const quizScore = (isQ1Correct ? 25 : 0) + (isQ2Correct ? 25 : 0);
  const totalScore = Math.min(100, explorerScore + quizScore);

  const isPageComplete = (q1Answer !== null && q2Answer !== null) || opCount >= 3;

  const currentSelectedObj = slides.find(s => s.id === selectedSlideId) || slides[0];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/40">
              {lang === 'en' ? 'Grade 6 • Unit 1 • Page 16-17' : 'Clasa a VI-a • Unitatea 1 • Pag. 16-17'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {lang === 'en' ? 'Screen 1 of 7 • Mission 1B' : 'Ecranul 1 din 7 • Misiunea 1B'}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
              <Layers className="w-6 h-6" />
            </span>
            <span>
              {lang === 'en'
                ? 'Slide Operations: Insert, Duplicate, Move & Delete'
                : 'Operații cu Diapozitive: Inserare, Duplicare, Mutare & Ștergere'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'Organize your narrative structure like a movie director! Learn the essential shortcuts: Ctrl+M (New slide), Ctrl+D (Duplicate), drag & drop reordering, and Delete.'
              : 'Construiește structura poveștii tale ca un regizor! Învață scurtăturile esențiale: Ctrl+M (Diapozitiv nou), Ctrl+D (Duplicare instantă), mutarea prin glisare și ștergerea cu tasta Delete.'}
          </p>
        </div>
      </div>

      {/* Didactic Cheat Sheet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <PlusSquare className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">1. Inserare</h3>
          </div>
          <div className="text-sm font-black text-white mb-1">Ctrl + M</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Adaugă un diapozitiv nou imediat după cel selectat în panoul din stânga.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Copy className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">2. Duplicare</h3>
          </div>
          <div className="text-sm font-black text-white mb-1">Ctrl + D</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Creează o copie identică a diapozitivului curent (inclusiv fundal, texte și aranjament).
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Move className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">3. Reordonare</h3>
          </div>
          <div className="text-sm font-black text-white mb-1">Drag & Drop</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tragi miniatura cu mouse-ul sus sau jos pentru a schimba ordinea în scenariu.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <Trash2 className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">4. Ștergere</h3>
          </div>
          <div className="text-sm font-black text-white mb-1">Delete / Backspace</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Elimină diapozitivul selectat din prezentare fără a afecta celelalte pagini.
          </p>
        </div>
      </div>

      {/* Interactive Simulator Sandbox */}
      <div className="bg-slate-900/95 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              {lang === 'en' ? 'Interactive Slide Lab' : 'Simulator: Gestionarea Diapozitivelor'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-heading">
              {lang === 'en' ? 'Test all slide management actions:' : 'Testează comenzile practice pe diapozitive:'}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddSlide}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-600/30 cursor-pointer"
            >
              <PlusSquare className="w-3.5 h-3.5" />
              <span>Inserare (Ctrl+M)</span>
            </button>
            <button
              onClick={handleDuplicateSlide}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicare (Ctrl+D)</span>
            </button>
            <button
              onClick={handleMoveUp}
              disabled={slides.findIndex(s => s.id === selectedSlideId) <= 0}
              className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-cyan-600/30 cursor-pointer disabled:opacity-40"
              title="Mută mai sus"
            >
              <Move className="w-3.5 h-3.5" />
              <span>Mută Sus</span>
            </button>
            <button
              onClick={handleDeleteSlide}
              disabled={slides.length <= 1}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-40"
              title="Șterge diapozitivul selectat"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Ștergere</span>
            </button>
            <button
              onClick={handleResetSandbox}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Resetează laboratorul"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sandbox Stage: Left thumbnails + Right large slide */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Thumbnails list */}
          <div className="md:col-span-4 flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
              Miniaturi ({slides.length} diapozitive):
            </span>
            {slides.map((s, idx) => {
              const isSelected = s.id === selectedSlideId;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSlide(s.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-orange-400 bg-orange-950/40 ring-2 ring-orange-500/30 shadow-md'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {s.title}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 shrink-0">
                    {s.badge}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Large active slide workspace */}
          <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] relative shadow-inner">
            <div className={`w-full h-56 rounded-2xl bg-gradient-to-br ${currentSelectedObj.color} border-2 border-white/20 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300`}>
              <div className="flex items-center justify-between text-white/80 text-xs font-mono">
                <span>Diapozitiv Selectat: #{slides.findIndex(s => s.id === selectedSlideId) + 1}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur border border-white/20 text-[10px]">
                  Format Widescreen 16:9
                </span>
              </div>

              <div className="text-center my-auto">
                <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                  {currentSelectedObj.title}
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  Faceți clic pe butoanele de sus pentru a duplica, muta sau adăuga slide-uri noi!
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/60 font-mono">
                <span>PowerPoint 365</span>
                <span>ArkyEdu Ediția Clasa a VI-a</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoint Quiz */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg sm:text-xl font-black text-white font-heading">
            {lang === 'en' ? 'Checkpoint Questions (Art Klett p. 16-17)' : 'Întrebări de Fixare (Manual Art Klett pag. 16-17)'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '1. Which keyboard shortcut creates an identical Duplicate of the selected slide?'
                : '1. Ce scurtătură rapidă de la tastatură creează o clonă identică (Duplicat) a diapozitivului selectat?'}
            </span>
            <QuestionHint
              hintRo="Litera D vine de la Duplicate!"
              hintEn="Letter D comes from Duplicate!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'ctrl_m', ro: 'Ctrl + M (Diapozitiv nou)', en: 'Ctrl + M (New slide)' },
              { id: 'ctrl_d', ro: 'Ctrl + D (Duplicare)', en: 'Ctrl + D (Duplicate)' },
              { id: 'alt_f4', ro: 'Alt + F4 (Închidere)', en: 'Alt + F4 (Close)' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'ctrl_d'
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
              customMessageRo="Reflecție didactică: Reține — Ctrl+M adaugă diapozitiv nou, iar Ctrl+D duplică diapozitivul curent!"
              customMessageEn="Pedagogical reflection: Remember — Ctrl+M inserts a new slide, Ctrl+D duplicates current slide!"
            />
          ) : null}

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! Ctrl + D este combinația magică pentru duplicarea instantanee a oricărui diapozitiv sau obiect selectat."
              explanationEn="Correct! Ctrl + D is the key combo for instantly duplicating any selected slide or object."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '2. How can you change the chronological order of slides in a presentation?'
                : '2. Cum poți schimba ordinea cronologică a diapozitivelor din prezentare?'}
            </span>
            <QuestionHint
              hintRo="Tragi miniatura cu mouse-ul în poziția dorită (Drag & Drop)."
              hintEn="Drag the thumbnail with the mouse to the desired spot (Drag & Drop)."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'drag_reorder', ro: 'Glisând (trăgând) miniatura cu mouse-ul sus sau jos în panoul din stânga', en: 'Dragging the thumbnail up or down with the mouse in the left pane' },
              { id: 'reinstall_os', ro: 'Reinstalând sistemul de operare', en: 'Reinstalling the operating system' },
              { id: 'delete_all', ro: 'Ștergând toate diapozitivele și luând-o de la capăt', en: 'Deleting all slides and starting over' },
              { id: 'cannot_change', ro: 'Ordinea este blocată pentru totdeauna', en: 'The order is permanently locked' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'drag_reorder'
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
              customMessageRo="Reflecție didactică: Reordonarea prin glisare (drag & drop) în panoul de miniaturi sau în modul Sortare Diapozitive este cea mai rapidă!"
              customMessageEn="Pedagogical reflection: Drag & drop reordering in the thumbnail pane or Slide Sorter is the fastest way!"
            />
          ) : null}

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Excelent! Prin glisare (Drag & Drop) în Panoul de Miniaturi sau în modul Sortare Diapozitive, poți schimba instant succesiunea scenelor din prezentare."
              explanationEn="Excellent! Using Drag & Drop in the Thumbnails pane or Slide Sorter view lets you reorder scenes instantly."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={1}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 2: Inserarea Obiectelor în Diapozitiv (Texte, Imagini & Tabele)"
        nextButtonLabelEn="Proceed to Page 2: Inserting Objects in Slides (Text, Images & Tables)"
      />
    </div>
  );
};
