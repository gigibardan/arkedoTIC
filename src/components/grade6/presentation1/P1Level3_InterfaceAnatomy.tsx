import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Monitor, 
  Layout, 
  Star,
  Info,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P1Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P1Level3_InterfaceAnatomy: React.FC<P1Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Active highlighted zone in the interface map
  const [activeZone, setActiveZone] = useState<string>('ribbon');
  const [visitedZones, setVisitedZones] = useState<Record<string, boolean>>({ ribbon: true });

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const zones = [
    {
      id: 'title_bar',
      nameRo: '1. Bara de Titlu',
      nameEn: '1. Title Bar',
      badgeRo: 'Superior',
      badgeEn: 'Top',
      descRo: 'Afișează numele prezentării curente (ex: Prezentare1 - PowerPoint), caseta de căutare și butoanele de control al ferestrei (Minimizare, Maximizare, Închidere).',
      descEn: 'Displays the current presentation name, search bar, and window control buttons (Minimize, Maximize, Close).'
    },
    {
      id: 'quick_access',
      nameRo: '2. Bara de Acces Rapid',
      nameEn: '2. Quick Access Toolbar',
      badgeRo: 'Stânga Sus',
      badgeEn: 'Top-Left',
      descRo: 'Conține comenzi frecvente accesibile printr-un singur clic: Salvare (pictogramă dischetă), Anulare acțiune (Undo) și Refacere (Redo).',
      descEn: 'Holds frequent one-click tools: Save diskette, Undo last action, and Redo.'
    },
    {
      id: 'ribbon',
      nameRo: '3. Panglica cu File (Ribbon)',
      nameEn: '3. Ribbon Tabs & Groups',
      badgeRo: 'Zona de Comenzi',
      badgeEn: 'Command Hub',
      descRo: 'Inima PowerPoint: organizată în File (Pornire, Inserare, Desenare, Proiectare etc.), iar fiecare filă conține grupuri de comenzi logice (Font, Paragraf etc.).',
      descEn: 'The core command band: organized into Tabs (Home, Insert, Design etc.), each divided into logical groups of tools.'
    },
    {
      id: 'slides_pane',
      nameRo: '4. Panoul de Diapozitive (Miniaturi)',
      nameEn: '4. Slides Thumbnail Pane',
      badgeRo: 'Panou Stânga',
      badgeEn: 'Left Pane',
      descRo: 'Arată toate diapozitivele în ordine numerică, ca miniaturi. Permite reordonarea prin glisare (drag & drop), duplicarea sau ștergerea rapidă.',
      descEn: 'Displays thumbnail previews of all slides in numeric order. Drag to reorder, duplicate or delete.'
    },
    {
      id: 'slide_workarea',
      nameRo: '5. Panoul Diapozitiv (Zona de Lucru)',
      nameEn: '5. Main Slide Workspace',
      badgeRo: 'Centru',
      badgeEn: 'Center Stage',
      descRo: 'Spațiul central de editare unde scrii texte, inserezi imagini, grafice, videoclipuri și configurezi aranjamentul grafic al diapozitivului activ.',
      descEn: 'Central editing stage where you type, place graphics, photos, video, and design the active slide.'
    },
    {
      id: 'notes_pane',
      nameRo: '6. Panoul de Note (Speaker Notes)',
      nameEn: '6. Notes Pane',
      badgeRo: 'Sub Diapozitiv',
      badgeEn: 'Bottom Pane',
      descRo: 'Locul unde prezentatorul își notează ideile principale sau discursul. Aceste note NU sunt văzute de public în timpul proiecției pe ecran!',
      descEn: 'Place where speakers type speech cues and talking points. These notes remain hidden from the audience.'
    },
    {
      id: 'status_bar',
      nameRo: '7. Bara de Stare (Status Bar)',
      nameEn: '7. Status Bar',
      badgeRo: 'Margine Jos',
      badgeEn: 'Bottom Bar',
      descRo: 'Afișează numărul diapozitivului curent (ex: Diapozitivul 3 din 12), limba de redactare, butoanele de comutare a vizualizării și cursorul de zoom.',
      descEn: 'Shows slide count (e.g. Slide 3 of 12), proofing language, view mode shortcuts, and zoom level slider.'
    }
  ];

  const handleSelectZone = (id: string) => {
    sounds.playClick();
    setActiveZone(id);
    setVisitedZones(prev => ({ ...prev, [id]: true }));
  };

  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'ribbon') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'notes') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'ribbon';
  const isQ2Correct = q2Answer === 'notes';

  const visitedCount = Object.keys(visitedZones).length;
  const explorerScore = visitedCount >= 5 ? 50 : visitedCount * 10;
  const quizScore = (isQ1Correct ? 25 : 0) + (isQ2Correct ? 25 : 0);
  const totalScore = Math.min(100, explorerScore + quizScore);

  const isPageComplete = (q1Answer !== null && q2Answer !== null) || visitedCount >= 4;

  const currentZoneObj = zones.find(z => z.id === activeZone) || zones[2];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/40">
              {lang === 'en' ? 'Grade 6 • Unit 1 • Page 12-13' : 'Clasa a VI-a • Unitatea 1 • Pag. 12-13'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {lang === 'en' ? 'Screen 3 of 7' : 'Ecranul 3 din 7'}
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
                ? 'Anatomy of the PowerPoint 365 Interface'
                : 'Anatomia Interfeței PowerPoint (Cele 7 Zone)'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'To be fast and precise, a presenter must know their cockpit! Explore each of the 7 official interface regions defined in the Art Klett textbook.'
              : 'Pentru a lucra eficient, trebuie să cunoști perfect fiecare zonă din cabina de comandă PowerPoint. Explorează cele 7 componente cheie explicate în manualul de clasa a VI-a!'}
          </p>
        </div>
      </div>

      {/* Interactive Interface Blueprint Inspector */}
      <div className="bg-slate-900/95 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              {lang === 'en' ? 'Interactive Mockup' : 'Machetă Interactivă Ghidată'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-heading">
              {lang === 'en' ? 'Click any zone to inspect its didactic role:' : 'Apasă pe oricare dintre cele 7 zone pentru a o inspecta:'}
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            {lang === 'en' ? `Explored: ${visitedCount}/7 zones` : `Explorate: ${visitedCount}/7 zone`}
          </div>
        </div>

        {/* Visual Mockup Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Zone Selector Buttons List */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {zones.map(z => {
              const isSelected = activeZone === z.id;
              const hasSeen = visitedZones[z.id];
              return (
                <button
                  key={z.id}
                  onClick={() => handleSelectZone(z.id)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-orange-950/60 border-orange-400 ring-2 ring-orange-500/30 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${isSelected ? 'bg-orange-400 animate-pulse' : hasSeen ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className="text-xs font-bold text-white truncate">
                      {lang === 'en' ? z.nameEn : z.nameRo}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 shrink-0">
                    {lang === 'en' ? z.badgeEn : z.badgeRo}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Visual Blueprint Display */}
          <div className="lg:col-span-7 bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-orange-300 font-mono">
                  {lang === 'en' ? currentZoneObj.nameEn : currentZoneObj.nameRo}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-mono font-bold">
                {lang === 'en' ? currentZoneObj.badgeEn : currentZoneObj.badgeRo}
              </span>
            </div>

            {/* Simulated mini mockup showing the layout */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-mono text-[10px]">
              {/* Top bar simulation */}
              <div className={`p-1.5 rounded border transition-all ${activeZone === 'title_bar' || activeZone === 'quick_access' ? 'border-orange-400 bg-orange-950/60 text-orange-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                💾 AutoSave • Prezentare1 - PowerPoint • 🔍 Căutare • [—] [▢] [✕]
              </div>

              {/* Ribbon simulation */}
              <div className={`p-2 rounded border transition-all ${activeZone === 'ribbon' ? 'border-orange-400 bg-orange-950/60 text-orange-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                [Fișier] [Pornire] [Inserare] [Desenare] [Proiectare] [Tranziții] [Animații] [Expunere]
              </div>

              {/* Middle section: Thumbnails + Main stage */}
              <div className="grid grid-cols-12 gap-2 h-36">
                <div className={`col-span-4 p-2 rounded border flex flex-col gap-1.5 transition-all ${activeZone === 'slides_pane' ? 'border-orange-400 bg-orange-950/60 text-orange-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <div className="text-[9px] font-bold">MINIATURI:</div>
                  <div className="bg-slate-800 p-1 rounded text-center">1 [Titlu]</div>
                  <div className="bg-slate-800 p-1 rounded text-center">2 [Grafic]</div>
                </div>

                <div className={`col-span-8 p-3 rounded border flex flex-col items-center justify-center text-center transition-all ${activeZone === 'slide_workarea' ? 'border-orange-400 bg-orange-950/60 text-orange-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <span className="text-xs font-bold">DIAPOZITIVUL ACTIV (16:9)</span>
                  <span className="text-[9px] text-slate-400 mt-1">Faceți clic pentru a adăuga text & imagini</span>
                </div>
              </div>

              {/* Notes Pane */}
              <div className={`p-1.5 rounded border transition-all ${activeZone === 'notes_pane' ? 'border-orange-400 bg-orange-950/60 text-orange-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                📝 Panoul de Note pentru Prezentator (invizibil pentru public)
              </div>

              {/* Status bar */}
              <div className={`p-1 rounded border flex items-center justify-between transition-all ${activeZone === 'status_bar' ? 'border-orange-400 bg-orange-950/60 text-orange-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                <span>Diapozitivul 1 din 2 • Română</span>
                <span>[Normal] [Sortare] [Citire] [Expunere] • 68% ──○──</span>
              </div>
            </div>

            {/* Explanation card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-1">
                {lang === 'en' ? 'Function & Didactic Role:' : 'Rol Didactic & Utilizare:'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en' ? currentZoneObj.descEn : currentZoneObj.descRo}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoint Quiz */}
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
                ? '1. Where are the main tool tabs located (Home, Insert, Design, Animations)?'
                : '1. În ce componentă a interfeței se află grupate filele cu comenzi (Pornire, Inserare, Proiectare, Animații)?'}
            </span>
            <QuestionHint
              hintRo="Este banda orizontală lată cu file din partea superioară a ecranului."
              hintEn="It is the wide horizontal band of tabs at the top of the screen."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'status_bar', ro: 'În Bara de stare (jos de tot)', en: 'In the Status bar (at bottom)' },
              { id: 'ribbon', ro: 'În Panglică (Bara Ribbon)', en: 'In the Ribbon band' },
              { id: 'notes_pane', ro: 'În Panoul de note pentru prezentator', en: 'In the Speaker Notes pane' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'ribbon'
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
              customMessageRo="Reflecție didactică: Panglica (Ribbon) este centrul tuturor instrumentelor și filelor din PowerPoint!"
              customMessageEn="Pedagogical reflection: The Ribbon is the command center of all tools and tabs in PowerPoint!"
            />
          ) : null}

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! Panglica (Ribbon) conține toate filele tematice și butoanele de acțiune organizate pe categorii."
              explanationEn="Correct! The Ribbon contains all thematic tabs and action buttons grouped by categories."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '2. What is special about the Speaker Notes pane?'
                : '2. Ce proprietate importantă au notițele scrise în Panoul de Note?'}
            </span>
            <QuestionHint
              hintRo="Sunt secrete pentru public în timpul proiecției pe ecranul mare!"
              hintEn="They are hidden from the audience during the big screen projection!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'notes', ro: 'Sunt vizibile doar pentru prezentator, nu și pentru public pe videoproiector', en: 'Visible only to the speaker, not to the audience on the projector' },
              { id: 'delete_slides', ro: 'Dacă scrii o notă, se șterge diapozitivul curent', en: 'Writing a note deletes the current slide' },
              { id: 'audio_only', ro: 'Pot conține doar înregistrări audio, niciodată text', en: 'Can only hold audio recordings, never text' },
              { id: 'lock_app', ro: 'Blochează calculatorul cu parolă', en: 'Locks the computer with a password' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'notes'
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
              customMessageRo="Reflecție didactică: Panoul de note este conceput special pentru ca vorbitorul să aibă ghidaj fără ca publicul să vadă textul!"
              customMessageEn="Pedagogical reflection: The Notes pane gives the speaker cues without showing them on the presentation screen!"
            />
          ) : null}

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Excelent! În modul Prezentator (Presenter View), doar tu vezi notele pe ecranul laptopului, în timp ce pe videoproiector se vede doar diapozitivul curat."
              explanationEn="Excellent! In Presenter View, only you see speech notes on your screen, while the projector shows only the clean slide."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={3}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 4: Filele din Panglică (Fișier, Pornire, Inserare)"
        nextButtonLabelEn="Proceed to Page 4: Ribbon Tabs (File, Home, Insert)"
      />
    </div>
  );
};
