import React, { useState } from 'react';
import {
  Layout,
  Plus,
  Palette,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  Share2,
  Settings,
  UploadCloud,
  Eye,
  PanelRight
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W2Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface WorkspaceZone {
  id: string;
  name: string;
  nameEn: string;
  location: string;
  locationEn: string;
  manualDesc: string;
  manualDescEn: string;
}

const WORKSPACE_ZONES: WorkspaceZone[] = [
  {
    id: 'header_banner',
    name: 'Antetul Paginii (Header / Banner)',
    nameEn: 'Page Header (Header / Banner)',
    location: 'Zona superioară a pânzei',
    locationEn: 'Upper area of the canvas',
    manualDesc: 'Manual pag. 44: Zona vizuală de impact ce conține titlul paginii și o imagine de fundal personalizabilă (disponibil în 4 formate: Doar titlu, Banner, Banner mare, Copertă).',
    manualDescEn: 'Textbook page 44: High-impact visual zone featuring the page title and customizable backdrop image (available in 4 formats: Title only, Banner, Large banner, Cover).'
  },
  {
    id: 'body_canvas',
    name: 'Pânza de Lucru / Corpul Paginii (Body Canvas)',
    nameEn: 'Working Canvas / Page Body',
    location: 'Centrul spațiului de editare',
    locationEn: 'Central editing workspace',
    manualDesc: 'Manual pag. 44: Suprafața principală organizată pe secțiuni orizontale unde se plasează blocurile de conținut, textele, imaginile și widgeturile interactive.',
    manualDescEn: 'Textbook page 44: Primary surface organized into horizontal sections where content layout blocks, text boxes, images, and interactive widgets are dropped.'
  },
  {
    id: 'sidebar_insert',
    name: 'Fila „Inserare” (Insert Tab)',
    nameEn: '"Insert" Tab',
    location: 'Panoul lateral dreapta, prima filă',
    locationEn: 'Right sidebar, first tab',
    manualDesc: 'Manual pag. 45: Biblioteca de elemente: Casete text, Imagini, Încorporare cod (Embed), Google Drive, Blocuri de conținut predefinite, Butoane, YouTube, Hartă, Formulare.',
    manualDescEn: 'Textbook page 45: Element library: Text boxes, Images, Embed code/URL, Google Drive, Content layout blocks, Buttons, YouTube embeds, Maps, Forms.'
  },
  {
    id: 'sidebar_pages',
    name: 'Fila „Pagini” (Pages Tab)',
    nameEn: '"Pages" Tab',
    location: 'Panoul lateral dreapta, a doua filă',
    locationEn: 'Right sidebar, second tab',
    manualDesc: 'Manual pag. 45: Gestionează structura ierarhică a sitului: adăugarea de pagini noi (+), ordonarea lor și crearea de sub-pagini pentru meniul derulant (dropdown).',
    manualDescEn: 'Textbook page 45: Manages hierarchical site taxonomy: adding new pages (+), reordering items, and creating subpages for dropdown navigation bars.'
  },
  {
    id: 'sidebar_themes',
    name: 'Fila „Teme” (Themes Tab)',
    nameEn: '"Themes" Tab',
    location: 'Panoul lateral dreapta, a treia filă',
    locationEn: 'Right sidebar, third tab',
    manualDesc: 'Manual pag. 45: Controlează identitatea vizuală globală: paletele cromatice ale sitului și stilurile de fonturi (Simple, Aristotle, Diplomat, Vision).',
    manualDescEn: 'Textbook page 45: Governs site-wide visual branding: palette colors and coordinated typography pairs (Simple, Aristotle, Diplomat, Vision).'
  },
  {
    id: 'topbar_publish',
    name: 'Bara de Acțiuni & Butonul „Publicare”',
    nameEn: 'Top Action Bar & "Publish" Button',
    location: 'Bara superioară dreapta',
    locationEn: 'Top right toolbar',
    manualDesc: 'Manual pag. 44: Conține butoanele de Undo/Redo, Previzualizare pe Desktop/Tabletă/Telefon, Partajare colaborativă și butonul albastru Publicare (Publish).',
    manualDescEn: 'Textbook page 44: Houses Undo/Redo, Multi-device Preview (Desktop/Tablet/Mobile), Collaborative Sharing, and the primary blue Publish button.'
  }
];

export const W2Level1_GoogleSitesWorkspace: React.FC<W2Level1Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const [activeZoneId, setActiveZoneId] = useState<string>('header_banner');
  const [discoveredZones, setDiscoveredZones] = useState<string[]>(['header_banner']);
  const [activeTab, setActiveTab] = useState<'insert' | 'pages' | 'themes'>('insert');

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const handleSelectZone = (id: string) => {
    sounds.playClick();
    setActiveZoneId(id);
    if (!discoveredZones.includes(id)) {
      setDiscoveredZones(prev => [...prev, id]);
    }
  };

  const handleQuizAnswer = (qId: string, optIdx: number, isCorrect: boolean) => {
    if (quizSubmitted[qId] || isLocked(qId)) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const currentZone = WORKSPACE_ZONES.find(z => z.id === activeZoneId) || WORKSPACE_ZONES[0];
  const allZonesDiscovered = discoveredZones.length === WORKSPACE_ZONES.length;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = allZonesDiscovered && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Pages 44–45' : 'Manual Art Klett 2025 • Pag. 44–45'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Layout className="w-8 h-8 text-blue-400" />
              {lang === 'en'
                ? 'Level 1: Google Sites Workspace & Sidebar Anatomy'
                : 'Nivelul 1: Mediul de Lucru Google Sites & Panoul Lateral'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Explore the intuitive visual interface of Google Sites: the canvas editor, the 3 sidebar tabs (Insert, Pages, Themes), and the publishing toolbar.'
                : 'Descoperă interfața vizuală intuitivă a aplicației Google Sites: pânza de editare, cele 3 file din panoul lateral (Inserare, Pagini, Teme) și bara de publicare.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-blue-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Explored Zones' : 'Zone Explorate'}
            </div>
            <div className="text-2xl font-black text-blue-400">{discoveredZones.length}/{WORKSPACE_ZONES.length}</div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Studio Interface' : 'Interfață Studio'}
            </div>
          </div>
        </div>
      </div>

      {/* Google Sites UI Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <PanelRight className="w-4 h-4" />
            {lang === 'en'
              ? 'Interactive Google Sites UI Simulator'
              : 'Simulator Interactiv al Interfeței Google Sites'}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {lang === 'en' ? 'Click zones to inspect' : 'Fă click pe zone pentru analiză'}
          </span>
        </div>

        {/* Mock Google Sites App Frame */}
        <div className="border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950 shadow-xl flex flex-col">
          {/* Top Bar of Google Sites */}
          <div
            onClick={() => handleSelectZone('topbar_publish')}
            className={`px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-pointer transition-all ${
              activeZoneId === 'topbar_publish' ? 'ring-2 ring-blue-500 bg-blue-950/20' : 'hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                S
              </div>
              <span className="text-xs font-bold text-white">
                {lang === 'en' ? 'My School Website • Google Sites' : 'Situl Meu Școlar • Google Sites'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg text-slate-300 text-xs">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline text-[11px]">
                  {lang === 'en' ? 'Preview' : 'Previzualizare'}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg text-slate-300 text-xs">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer">
                <UploadCloud className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Publish' : 'Publică'}
              </button>
            </div>
          </div>

          {/* Main Studio Body: Canvas + Right Sidebar */}
          <div className="grid md:grid-cols-3 min-h-[320px]">
            {/* Canvas Area (2 cols on md) */}
            <div className="md:col-span-2 p-4 space-y-4 bg-slate-950 flex flex-col justify-start">
              {/* Header / Banner Zone */}
              <div
                onClick={() => handleSelectZone('header_banner')}
                className={`p-6 rounded-xl border text-center cursor-pointer transition-all ${
                  activeZoneId === 'header_banner'
                    ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-blue-400 mb-1 flex items-center justify-center gap-1">
                  <Layout className="w-3 h-3" />
                  {lang === 'en'
                    ? 'Page Header (Header / Banner)'
                    : 'Antetul Paginii (Header / Banner)'}
                </div>
                <h3 className="text-lg font-black text-white">
                  {lang === 'en' ? 'ROBOTICS & ICT SCHOOL PROJECT' : 'PROIECT DE ROBOTICĂ & TIC'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'en' ? 'Middle School • 8th Grade' : 'Școala Gimnazială • Clasa a VIII-a'}
                </p>
              </div>

              {/* Body Canvas Zone */}
              <div
                onClick={() => handleSelectZone('body_canvas')}
                className={`p-6 rounded-xl border flex-1 cursor-pointer transition-all ${
                  activeZoneId === 'body_canvas'
                    ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-emerald-400 mb-2 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {lang === 'en' ? 'Main Canvas (Body Canvas)' : 'Pânza Principală (Body Canvas)'}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="w-full h-12 bg-slate-800 rounded flex items-center justify-center text-slate-500 text-[10px]">
                      {lang === 'en' ? 'Image 1' : 'Imagine 1'}
                    </div>
                    <div className="font-bold text-white text-[11px]">
                      {lang === 'en' ? 'Ultrasonic Sensors' : 'Senzori Ultrasonici'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="w-full h-12 bg-slate-800 rounded flex items-center justify-center text-slate-500 text-[10px]">
                      {lang === 'en' ? 'Image 2' : 'Imagine 2'}
                    </div>
                    <div className="font-bold text-white text-[11px]">
                      {lang === 'en' ? 'DC Motors & Drivers' : 'Motoare DC & Drivere'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar (Tabs: Insert, Pages, Themes) */}
            <div className="border-l border-slate-800 bg-slate-900/80 flex flex-col">
              {/* Sidebar Tabs */}
              <div className="grid grid-cols-3 border-b border-slate-800 text-xs text-center font-bold">
                <button
                  onClick={() => { sounds.playClick(); setActiveTab('insert'); handleSelectZone('sidebar_insert'); }}
                  className={`py-2.5 transition-all cursor-pointer ${
                    activeTab === 'insert' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'Insert' : 'Inserare'}
                </button>
                <button
                  onClick={() => { sounds.playClick(); setActiveTab('pages'); handleSelectZone('sidebar_pages'); }}
                  className={`py-2.5 transition-all cursor-pointer ${
                    activeTab === 'pages' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'Pages' : 'Pagini'}
                </button>
                <button
                  onClick={() => { sounds.playClick(); setActiveTab('themes'); handleSelectZone('sidebar_themes'); }}
                  className={`py-2.5 transition-all cursor-pointer ${
                    activeTab === 'themes' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'Themes' : 'Teme'}
                </button>
              </div>

              {/* Sidebar Content based on Active Tab */}
              <div className="p-4 flex-1 text-xs space-y-3">
                {activeTab === 'insert' && (
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {lang === 'en' ? 'Basic Elements:' : 'Elemente de bază:'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center font-semibold text-slate-300">
                        {lang === 'en' ? 'Text box' : 'Casetă text'}
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center font-semibold text-slate-300">
                        {lang === 'en' ? 'Images' : 'Imagini'}
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center font-semibold text-slate-300">
                        {lang === 'en' ? 'Embed' : 'Încorporare'}
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center font-semibold text-slate-300">
                        Drive
                      </div>
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 pt-2">
                      {lang === 'en' ? 'Content Blocks:' : 'Blocuri de Conținut:'}
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center text-slate-400">
                      {lang === 'en' ? '2/3/4 Column Layouts' : 'Layout 2/3/4 coloane'}
                    </div>
                  </div>
                )}

                {activeTab === 'pages' && (
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {lang === 'en' ? 'Site Page Hierarchy:' : 'Structură Pagini Sit:'}
                    </div>
                    <div className="space-y-1 font-mono text-slate-300">
                      <div className="p-2 bg-slate-950 rounded border border-blue-500/40 text-blue-300 font-bold">
                        📄 {lang === 'en' ? 'Home' : 'Pagina principală (Home)'}
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800 pl-4">
                        ↳ 📄 {lang === 'en' ? 'About the Project' : 'Despre Proiect'}
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800 pl-4">
                        ↳ 📄 {lang === 'en' ? 'Photo Gallery' : 'Galerie Foto'}
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        📄 {lang === 'en' ? 'Contact' : 'Contact'}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'themes' && (
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {lang === 'en' ? 'Preset Visual Themes:' : 'Teme Vizuale Predefinite:'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center font-semibold">
                      <div className="p-2 bg-slate-950 border border-blue-500/40 rounded text-blue-300">
                        {lang === 'en' ? 'Simple' : 'Simplu'}
                      </div>
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded text-slate-400">Aristotle</div>
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded text-slate-400">Diplomat</div>
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded text-slate-400">Vision</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Zone Manual Information Card */}
        <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              {lang === 'en' ? currentZone.nameEn : currentZone.name}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'en' ? currentZone.locationEn : currentZone.location}
            </span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {lang === 'en' ? currentZone.manualDescEn : currentZone.manualDesc}
          </p>
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Google Sites Workspace Structure'
                : 'Reflecție Pedagogică: Structura Spațiului de Lucru Google Sites'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Art Klett Manual pages 44–45' : 'Manual Art Klett pag. 44–45'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '1. What are the three essential tabs in the right sidebar of Google Sites?'
              : '1. Care sunt cele trei file esențiale din panoul lateral din dreapta al aplicației Google Sites?'}
          </div>
          <QuestionHint
            hintRo="Verifică antetul panoului lateral din dreapta pe care l-ai explorat adineauri."
            hintEn="Check the header of the right sidebar you just explored."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Inserare (Insert), Pagini (Pages) și Teme (Themes)',
                textEn: 'Insert, Pages, and Themes',
                correct: true
              },
              {
                textRo: 'Copiere, Tăiere și Lipire',
                textEn: 'Copy, Cut, and Paste',
                correct: false
              },
              {
                textRo: 'Calcul, Formule și Sortare',
                textEn: 'Calculation, Formulas, and Sorting',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w2_l1_q1';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w2_l1_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w2_l1_q1'] || 0} />
          )}
          {quizSubmitted['w2_l1_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Textbook page 45: The right sidebar consolidates all authoring capabilities: Insert (adding components), Pages (site hierarchy), and Themes (global graphic styling).'
                : 'Corect! Manual pag. 45: Panoul din dreapta grupează toate funcțiile de creație: Inserare (adăugare conținut), Pagini (organizarea structurii) și Teme (stilul grafic general).'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. What purpose does the "Preview" button serve in the top bar of Google Sites?'
              : '2. Ce rol are butonul de „Previzualizare” (Preview) din bara superioară a aplicației Google Sites?'}
          </div>
          <QuestionHint
            hintRo="Permite simularea modului în care vizitatorii vor vedea situl pe diferite dispozitive."
            hintEn="Simulates how visitors will experience the site across different screen sizes."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Permite testarea modului în care situl se va afișa pe ecranul unui calculator (Desktop), al unei tablete și al unui smartphone mobil înainte de a fi publicat',
                textEn: 'Allows testing how the website renders on Desktop, Tablet, and Mobile screens prior to public release',
                correct: true
              },
              {
                textRo: 'Trimite situl prin e-mail tuturor colegilor de clasă',
                textEn: 'Sends the website via email to all classmates',
                correct: false
              },
              {
                textRo: 'Șterge toate fișierele din Google Drive',
                textEn: 'Deletes all files from Google Drive',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w2_l1_q2';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w2_l1_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w2_l1_q2'] || 0} />
          )}
          {quizSubmitted['w2_l1_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exactly! Textbook page 44: The Preview feature provides three responsive viewports (Desktop, Tablet, Mobile) to ensure readability on any screen dimension.'
                : 'Exact! Manual pag. 44: Funcția Preview oferă trei vizualizări responsive (Desktop, Tablet, Mobile) pentru a ne asigura că situl este ușor de citit pe orice dimensiune de ecran.'}
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canFinish}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel={lang === 'en'
          ? 'To Level 2: Site Architecture & Page Hierarchy'
          : 'Spre Nivelul 2: Arhitectura Sitului & Ierarhia Paginilor'}
      />
    </div>
  );
};
