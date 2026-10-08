import React, { useState } from 'react';
import { 
  Menu, 
  Home, 
  PlusSquare, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Type, 
  Image as ImageIcon, 
  Table, 
  Star,
  Copy,
  Scissors,
  Clipboard,
  Square
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P1Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P1Level4_RibbonTabsBasics: React.FC<P1Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Active simulated tab: 'file' | 'home' | 'insert'
  const [activeTab, setActiveTab] = useState<'file' | 'home' | 'insert'>('home');
  const [testedTools, setTestedTools] = useState<Record<string, boolean>>({ home: true });

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleSelectTab = (tab: 'file' | 'home' | 'insert') => {
    sounds.playClick();
    setActiveTab(tab);
    setTestedTools(prev => ({ ...prev, [tab]: true }));
  };

  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'insert_tab') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'home_tab') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'insert_tab';
  const isQ2Correct = q2Answer === 'home_tab';

  const exploredCount = Object.keys(testedTools).length;
  const explorerScore = exploredCount >= 3 ? 50 : exploredCount * 20;
  const quizScore = (isQ1Correct ? 25 : 0) + (isQ2Correct ? 25 : 0);
  const totalScore = Math.min(100, explorerScore + quizScore);

  const isPageComplete = (q1Answer !== null && q2Answer !== null) || exploredCount >= 2;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/40">
              {lang === 'en' ? 'Grade 6 • Unit 1 • Page 13' : 'Clasa a VI-a • Unitatea 1 • Pag. 13'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {lang === 'en' ? 'Screen 4 of 7' : 'Ecranul 4 din 7'}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
              <Menu className="w-6 h-6" />
            </span>
            <span>
              {lang === 'en'
                ? 'Primary Ribbon Tabs: File, Home & Insert'
                : 'Filele Principale din Panglică: Fișier, Pornire & Inserare'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'Every tab is an organized workshop! Learn what belongs to File (Backstage operations), Home (formatting, fonts, new slide), and Insert (adding images, tables, shapes).'
              : 'Fiecare filă este un atelier specializat! Află ce comenzi găsești în Fila Fișier (operații globale), Fila Pornire (editare font, diapozitiv nou) și Fila Inserare (imagini, tabele, forme).'}
          </p>
        </div>
      </div>

      {/* Interactive Ribbon Simulator */}
      <div className="bg-slate-900/95 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              {lang === 'en' ? 'Ribbon Explorer' : 'Simulatorul Panglicii (Panglica de Comenzi)'}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            {lang === 'en' ? 'Click each tab below' : 'Apasă pe fiecare filă'}
          </span>
        </div>

        {/* Tab Header Bar */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none mb-4">
          <button
            onClick={() => handleSelectTab('file')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'file'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Menu className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'File (Backstage)' : 'Fișier (Backstage)'}</span>
          </button>

          <button
            onClick={() => handleSelectTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'home'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Home (Pornire)' : 'Pornire (Home)'}</span>
          </button>

          <button
            onClick={() => handleSelectTab('insert')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'insert'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <PlusSquare className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Insert (Inserare)' : 'Inserare (Insert)'}</span>
          </button>
        </div>

        {/* Ribbon Groups Content */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 min-h-[220px]">
          {activeTab === 'file' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-orange-400">
                  {lang === 'en' ? 'Fila Fișier (Vedere Backstage)' : 'Fila Fișier (Vedere Backstage / În Spatele Scenei)'}
                </h4>
                <span className="text-[11px] font-mono text-slate-400">Manual pag. 13</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Covers whole-presentation management commands: New, Open, Save, Save As, Print, Export to PDF/Video, and Account Options.'
                  : 'Gestionează fișierul ca întreg: Nou (creare prezentare nouă), Deschidere (fișiere de pe disc), Salvare (Ctrl+S), Salvare ca (schimbare format/nume), Imprimare (pe hârtie sau PDF), Partajare și Opțiuni.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {['Nou (Ctrl+N)', 'Deschidere (Ctrl+O)', 'Salvare (Ctrl+S)', 'Imprimare (Ctrl+P)'].map((cmd, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 text-center">
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-orange-400">
                  {lang === 'en' ? 'Fila Pornire (Home) — Cele 5 Grupuri Cheie' : 'Fila Pornire (Home) — Cele 5 Grupuri Cheie de Instrumente'}
                </h4>
                <span className="text-[11px] font-mono text-slate-400">Manual pag. 13</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                    <Clipboard className="w-3.5 h-3.5 text-orange-400" /> Clipboard
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Decupare (Ctrl+X), Copiere (Ctrl+C), Lipire (Ctrl+V) și Descriptor de formate.
                  </p>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                    <PlusSquare className="w-3.5 h-3.5 text-orange-400" /> Diapozitive
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Diapozitiv nou (Ctrl+M), Aspect (Layout), Resetare și Secțiune.
                  </p>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                    <Type className="w-3.5 h-3.5 text-orange-400" /> Font & Paragraf
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Familie font, dimensiune, Bold, Italic, Culoare, Marcatori listă și aliniere.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insert' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-orange-400">
                  {lang === 'en' ? 'Fila Inserare (Insert) — Adăugarea Obiectelor' : 'Fila Inserare (Insert) — Adăugarea Obiectelor în Diapozitiv'}
                </h4>
                <span className="text-[11px] font-mono text-slate-400">Manual pag. 13</span>
              </div>
              <p className="text-xs text-slate-300">
                {lang === 'en'
                  ? 'Allows inserting rich media and objects into slides to create captivating visual presentations.'
                  : 'Fila care transformă prezentarea într-un spectacol vizual prin adăugarea de elemente multimedia și grafice:'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {[
                  { name: 'Tabele', icon: '📊' },
                  { name: 'Imagini (PC & Web)', icon: '🖼️' },
                  { name: 'Forme & Pictograme', icon: '⭐' },
                  { name: 'Modele 3D & SmartArt', icon: '🧊' },
                  { name: 'Casetă Text (Text Box)', icon: '📝' },
                  { name: 'WordArt & Simboluri', icon: '🎨' },
                  { name: 'Videoclipuri', icon: '🎬' },
                  { name: 'Fișiere Audio & Înregistrare', icon: '🎵' }
                ].map((item, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-white">
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
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
            {lang === 'en' ? 'Checkpoint Questions (Art Klett p. 13)' : 'Întrebări de Fixare (Manual Art Klett pag. 13)'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '1. In which tab do you go to add an image or a table into a slide?'
                : '1. În ce filă trebuie să mergi pentru a adăuga o imagine sau un tabel într-un diapozitiv?'}
            </span>
            <QuestionHint
              hintRo="Gândește-te la acțiunea de a adăuga / introduce ceva nou."
              hintEn="Think of the action of introducing or adding something new."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'file_tab', ro: 'Fila Fișier', en: 'File tab' },
              { id: 'insert_tab', ro: 'Fila Inserare (Insert)', en: 'Insert tab' },
              { id: 'status_bar', ro: 'Bara de stare de jos', en: 'Bottom status bar' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'insert_tab'
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
              customMessageRo="Reflecție didactică: Fila Inserare conține imagini, tabele, forme, grafice și videoclipuri!"
              customMessageEn="Pedagogical reflection: The Insert tab contains images, tables, shapes, charts, and videos!"
            />
          ) : null}

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! Fila Inserare (Insert) permite adăugarea oricărui obiect multimedia: imagini, forme, tabele, clipuri video și sunete."
              explanationEn="Correct! The Insert tab allows adding all multimedia objects: pictures, shapes, tables, videos, and sounds."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '2. In which tab do you find the New Slide (Diapozitiv nou) button and Font formatting?'
                : '2. În ce filă găsești butonul pentru un diapozitiv nou (Ctrl+M) și formatarea fontului (Bold, Italic)?'}
            </span>
            <QuestionHint
              hintRo="Este fila principală de pornire a lucrului!"
              hintEn="It is the main starting tab of your work!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'home_tab', ro: 'Fila Pornire (Home)', en: 'Home tab' },
              { id: 'trash_bin', ro: 'Coșul de reciclare', en: 'Recycle bin' },
              { id: 'sound_menu', ro: 'Meniul de volum', en: 'Volume menu' },
              { id: 'browser', ro: 'Browserul de internet', en: 'Web browser' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'home_tab'
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
              customMessageRo="Reflecție didactică: Fila Pornire (Home) este fila de bază pentru adăugarea diapozitivelor și formatarea fontului!"
              customMessageEn="Pedagogical reflection: The Home tab is the basic workspace for adding slides and styling fonts!"
            />
          ) : null}

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Excelent! Fila Pornire (Home) conține grupurile Diapozitive (Diapozitiv nou / Ctrl+M), Font (dimensiune, culori) și Paragraf."
              explanationEn="Excellent! The Home tab contains Slides (New Slide / Ctrl+M), Font (size, color), and Paragraph groups."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={4}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 5: Filele Specializate (Proiectare, Tranziții & Animații)"
        nextButtonLabelEn="Proceed to Page 5: Specialized Tabs (Design, Transitions & Animations)"
      />
    </div>
  );
};
