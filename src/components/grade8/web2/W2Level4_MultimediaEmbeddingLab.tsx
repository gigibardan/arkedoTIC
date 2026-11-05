import React, { useState } from 'react';
import {
  Video,
  MapPin,
  ClipboardList,
  FileSpreadsheet,
  Code2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  Settings2,
  Play
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W2Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

type EmbedResourceType = 'youtube' | 'maps' | 'forms' | 'sheets' | 'code';

interface ResourceConfig {
  type: EmbedResourceType;
  title: string;
  titleEn: string;
  sourceLabel: string;
  sourceLabelEn: string;
  defaultVal: string;
  description: string;
  descriptionEn: string;
}

const RESOURCES: ResourceConfig[] = [
  {
    type: 'youtube',
    title: 'Videoclip YouTube',
    titleEn: 'YouTube Video',
    sourceLabel: 'Link Video sau Căutare YouTube',
    sourceLabelEn: 'Video Link or YouTube Search',
    defaultVal: 'https://youtube.com/watch?v=robotics_competition_2025',
    description: 'Manual pag. 48: Permite redarea directă a unui ghid sau reportaj video în interiorul paginii fără a redirecționa utilizatorul.',
    descriptionEn: 'Textbook page 48: Allows direct inline playback of instructional guides or video documentaries without external user redirects.'
  },
  {
    type: 'maps',
    title: 'Google Maps (Hartă Interactivă)',
    titleEn: 'Google Maps (Interactive Map)',
    sourceLabel: 'Locație Școală / Punct de Interes',
    sourceLabelEn: 'School Location / Point of Interest',
    defaultVal: 'Colegiul Național „Tudor Vladimirescu”, Târgu Jiu',
    description: 'Manual pag. 49: Încorporează o hartă dinamică cu zoom, comutare pe satelit și ghidaj de navigare pentru vizitatorii site-ului.',
    descriptionEn: 'Textbook page 49: Embeds a dynamic interactive map with zoom, satellite view, and turn-by-turn routing for website visitors.'
  },
  {
    type: 'forms',
    title: 'Google Forms (Formular / Sondaj)',
    titleEn: 'Google Forms (Form / Survey)',
    sourceLabel: 'Formular de Înscriere la Club',
    sourceLabelEn: 'Club Registration Form',
    defaultVal: 'Sondaj: „Alegerea temei pentru Târgul de Științe 2025”',
    description: 'Manual pag. 49: Colectează răspunsurile elevilor direct în pagina web, datele fiind salvate automat într-o foaie Google Sheets.',
    descriptionEn: 'Textbook page 49: Gathers visitor feedback and signups directly inside the page, auto-saving responses into Google Sheets.'
  },
  {
    type: 'sheets',
    title: 'Google Sheets (Clasamente & Orar)',
    titleEn: 'Google Sheets (Rankings & Schedule)',
    sourceLabel: 'Foaie de Calcul Conectată',
    sourceLabelEn: 'Connected Cloud Spreadsheet',
    defaultVal: 'Clasament_Olimpiada_Informatica_Gimnaziu.xlsx',
    description: 'Manual pag. 49: Afișează tabele cu note, orare sau statistici ce se actualizează automat pe site când documentul original este editat.',
    descriptionEn: 'Textbook page 49: Displays live tables, schedules, or scoreboards that auto-update dynamically whenever the original Drive sheet is edited.'
  },
  {
    type: 'code',
    title: 'Încorporare Cod (Embed <iframe>)',
    titleEn: 'Code Embedding (Embed <iframe>)',
    sourceLabel: 'Fragment HTML / Widget Extern',
    sourceLabelEn: 'HTML Snippet / External Widget',
    defaultVal: '<iframe src="https://meteo.ro/widget/bucuresti" height="180"></iframe>',
    description: 'Manual pag. 49: Posibilitatea de a insera widgeturi externe precum prognoza meteo, numărători inverse sau playere audio.',
    descriptionEn: 'Textbook page 49: Enables arbitrary 3rd-party widgets such as weather forecasts, countdown clocks, or audio players via iframe.'
  }
];

export const W2Level4_MultimediaEmbeddingLab: React.FC<W2Level4Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [activeTab, setActiveTab] = useState<EmbedResourceType>('youtube');
  const [embedWidth, setEmbedWidth] = useState<'normal' | 'wide' | 'full'>('wide');

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (qId: string, optId: string) => {
    if (submitted[qId] || isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = answers[qId] === correctId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmitted(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  const currentConfig = RESOURCES.find(r => r.type === activeTab)!;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Video className="w-5 h-5 text-cyan-300" />
              <span>
                {lang === 'en'
                  ? 'Unit 2: Web Pages & Online Projects • Module 2B'
                  : 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2B'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'en'
                ? 'Level 4: Multimedia Resource Embedding & Google Workspace Integration'
                : 'Lecția 4: Încorporare Resurse Multimedia & Integrare Google Workspace'}
            </h1>
            <p className="text-cyan-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'en'
                ? 'Art Klett Manual pages 48–49: Learn to turn a static website into a dynamic platform by embedding Google Forms, interactive Maps, YouTube videos, and live spreadsheets.'
                : 'Manual Art Klett pag. 48–49: Învață să transformi un site static într-o platformă dinamică prin integrarea formularelor Google, hărților interactive, videoclipurilor YouTube și foilor de calcul live.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-cyan-200 font-bold block">
              {lang === 'en' ? 'Level' : 'Nivel'}
            </span>
            <span className="text-2xl font-black text-white">4 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'en'
              ? 'Theoretical Highlights: Dynamic Content & Embeds (Textbook pages 48–49)'
              : 'Repere Teoretice: Conținut Dinamic și Încorporare (Manual pag. 48–49)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-rose-600" />
              YouTube &amp; Multimedia
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'en'
                ? 'Insert video tutorials or school reports directly by search keyword or URL. Google Sites embeds the player with closed captions and automatic mobile resizing.'
                : 'Inserarea videoclipurilor se face direct prin căutare în fereastra dedicată sau lipind adresa URL. Google Sites integrează automat playerul cu subtitrări și adaptabilitate pe dispozitive mobile.'}
            </p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              {lang === 'en' ? 'Google Workspace Ecosystem' : 'Ecosistemul Google Workspace'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'en'
                ? 'Google Sites provides real-time cloud synchronization: update a schedule in Google Docs or grades in Sheets, and the public site reflects fresh data instantly without republishing.'
                : 'Marele avantaj al Google Sites este sincronizarea în timp real: dacă actualizezi orarul într-un Google Doc sau notele într-un Google Sheets, site-ul afișează automat noile date fără republicare manuală.'}
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              {lang === 'en' ? 'Code Embedding (Embed)' : 'Încorporare Cod (Embed)'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'en'
                ? 'Through the Embed option (</>), introduce external HTML/JavaScript widgets (iframe) for live weather reports, countdown clocks, or tourist maps.'
                : 'Prin opțiunea Încorporare (</>) poți introduce cod HTML/JavaScript extern (iframe) pentru widgeturi meteo, numărători inverse sau hărți speciale de orientare turistică.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Embedding Studio */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              {lang === 'en'
                ? 'Interactive Simulator: Embed & Configure the Resource'
                : 'Simulator Interactiv: Încorporează și Configurează Resursa'}
            </h3>
          </div>
          <span className="text-xs bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full font-semibold">
            {lang === 'en' ? 'Workspace Lab' : 'Laborator Workspace'}
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2">
          {RESOURCES.map(res => (
            <button
              key={res.type}
              onClick={() => {
                setActiveTab(res.type);
                sounds.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === res.type
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {res.type === 'youtube' && <Video className="w-3.5 h-3.5" />}
              {res.type === 'maps' && <MapPin className="w-3.5 h-3.5" />}
              {res.type === 'forms' && <ClipboardList className="w-3.5 h-3.5" />}
              {res.type === 'sheets' && <FileSpreadsheet className="w-3.5 h-3.5" />}
              {res.type === 'code' && <Code2 className="w-3.5 h-3.5" />}
              <span>{lang === 'en' ? res.titleEn : res.title}</span>
            </button>
          ))}
        </div>

        {/* Configuration Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs text-slate-600">
            <strong>{lang === 'en' ? 'Description:' : 'Descriere:'}</strong>{' '}
            {lang === 'en' ? currentConfig.descriptionEn : currentConfig.description}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px]">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'en' ? currentConfig.sourceLabelEn : currentConfig.sourceLabel}
              </label>
              <input
                type="text"
                readOnly
                value={currentConfig.defaultVal}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'en' ? 'Layout Width' : 'Lățime Pe Pagină'}
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => setEmbedWidth('normal')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold border cursor-pointer ${
                    embedWidth === 'normal'
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'Column (50%)' : 'Coloană (50%)'}
                </button>
                <button
                  onClick={() => setEmbedWidth('wide')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold border cursor-pointer ${
                    embedWidth === 'wide'
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'Wide Section (75%)' : 'Secțiune Medie (75%)'}
                </button>
                <button
                  onClick={() => setEmbedWidth('full')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold border cursor-pointer ${
                    embedWidth === 'full'
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'Full Width (100%)' : 'Lățime Completă (100%)'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Widget Preview */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-900 text-white space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="ml-2 font-mono text-slate-300">Google Sites Preview Canvas</span>
            </div>
            <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded text-indigo-300 font-mono">
              {lang === 'en' ? 'Live Output' : 'Rezultat Live'}
            </span>
          </div>

          <div className="py-4 flex justify-center">
            <div
              className={`transition-all duration-300 rounded-xl overflow-hidden shadow-2xl bg-slate-800 border border-slate-700 ${
                embedWidth === 'normal'
                  ? 'w-full md:w-1/2'
                  : embedWidth === 'wide'
                  ? 'w-full md:w-3/4'
                  : 'w-full'
              }`}
            >
              {activeTab === 'youtube' && (
                <div className="aspect-video bg-black flex flex-col items-center justify-center relative p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center mb-3 shadow-lg hover:scale-105 transition cursor-pointer">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                  <div className="font-bold text-sm text-white">
                    {lang === 'en'
                      ? 'Mobile Robot Demonstration with Ultrasonic Sensors'
                      : 'Demonstrație Robot Mobil cu Senzori Ultrasonici'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {lang === 'en'
                      ? 'School Channel • 1.2k views • YouTube Player Embed'
                      : 'Canalul Școlii • 1.2k vizionări • YouTube Player Embed'}
                  </div>
                </div>
              )}

              {activeTab === 'maps' && (
                <div className="h-64 bg-slate-700 relative flex flex-col justify-between p-4 bg-gradient-to-br from-emerald-900/60 to-slate-900">
                  <div className="bg-white/90 backdrop-blur text-slate-900 p-2.5 rounded-lg max-w-xs shadow">
                    <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      {lang === 'en' ? 'National College Campus' : 'Colegiul Național'}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {lang === 'en' ? 'Eroilor Boulevard, No. 12 • Târgu Jiu, Romania' : 'Strada Eroilor, Nr. 12 • Târgu Jiu, Gorj'}
                    </div>
                  </div>
                  <div className="flex justify-between items-end text-xs text-slate-300">
                    <span className="bg-black/60 px-2 py-1 rounded">
                      {lang === 'en' ? 'Map data ©2025 Google' : 'Date hartă ©2025 Google'}
                    </span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1 rounded shadow cursor-pointer">
                      {lang === 'en' ? 'Open in Google Maps →' : 'Deschide în Google Maps →'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'forms' && (
                <div className="p-5 bg-white text-slate-800 space-y-4">
                  <div className="border-b border-indigo-100 pb-3">
                    <div className="text-xs font-bold text-indigo-700 uppercase">
                      {lang === 'en' ? 'Integrated Google Forms' : 'Google Forms integrat'}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {lang === 'en'
                        ? 'Computer Science & Robotics Club Sign-up'
                        : 'Formular de Înscriere la Clubul de Informatică'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'en'
                        ? 'Submit your information for workshop group assignments.'
                        : 'Completează datele pentru repartizarea pe ateliere.'}
                    </p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        {lang === 'en' ? 'Student Full Name *' : 'Nume și Prenume Elev *'}
                      </label>
                      <input
                        type="text"
                        placeholder={lang === 'en' ? 'E.g. Andrew Miller' : 'Ex: Popescu Andrei'}
                        className="w-full border rounded p-2 text-xs bg-slate-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        {lang === 'en' ? 'Preferred Workshop *' : 'Atelierul Dorit *'}
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1 text-slate-600">
                          <input type="radio" checked readOnly />
                          {lang === 'en' ? 'C++ Algorithms' : 'Algoritmi C++'}
                        </label>
                        <label className="flex items-center gap-1 text-slate-600">
                          <input type="radio" readOnly />
                          {lang === 'en' ? 'Robotics & Sensors' : 'Robotică & Senzori'}
                        </label>
                      </div>
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">
                    {lang === 'en' ? 'Submit Response' : 'Trimite Răspunsul'}
                  </button>
                </div>
              )}

              {activeTab === 'sheets' && (
                <div className="p-4 bg-white text-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold border-b pb-2 text-emerald-800">
                    <span className="flex items-center gap-1">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      {lang === 'en'
                        ? 'Competition Scoreboard (Live synced from Google Sheets)'
                        : 'Rezultate Concurs Școlar (Sincronizat live din Google Sheets)'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {lang === 'en' ? 'Updated 2 mins ago' : 'Actualizat acum 2 minute'}
                    </span>
                  </div>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2 border">{lang === 'en' ? 'Rank' : 'Loc'}</th>
                        <th className="p-2 border">{lang === 'en' ? 'Student' : 'Nume Elev'}</th>
                        <th className="p-2 border">{lang === 'en' ? 'Grade' : 'Clasa'}</th>
                        <th className="p-2 border">{lang === 'en' ? 'Score' : 'Punctaj'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-bold text-amber-600">
                          {lang === 'en' ? '1st Place' : 'Premiul I'}
                        </td>
                        <td className="p-2 border font-medium">Ionescu Maria</td>
                        <td className="p-2 border">8-A</td>
                        <td className="p-2 border font-bold">100 p</td>
                      </tr>
                      <tr>
                        <td className="p-2 border font-bold text-slate-500">
                          {lang === 'en' ? '2nd Place' : 'Premiul II'}
                        </td>
                        <td className="p-2 border font-medium">Popa Radu</td>
                        <td className="p-2 border">8-B</td>
                        <td className="p-2 border font-bold">95 p</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs space-y-2">
                  <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-1">
                    {lang === 'en'
                      ? 'External HTML Widget (Embedded via <iframe>)'
                      : 'Widget Extern HTML (Încorporat via <iframe>)'}
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-emerald-500/30">
                    <div className="text-sm font-bold text-white mb-1">
                      {lang === 'en' ? '🌤️ Local Weather Forecast' : '🌤️ Prognoza Meteo Locală'}
                    </div>
                    <div className="text-xs text-slate-300">
                      {lang === 'en'
                        ? 'Current temperature: +18°C • Wind: 12 km/h • Humidity: 45%'
                        : 'Temperatura curentă: +18°C • Vânt: 12 km/h • Umiditate: 45%'}
                    </div>
                    <div className="text-[10px] text-emerald-500 mt-2">
                      {lang === 'en'
                        ? 'Real-time widget powered via external API feed'
                        : 'Widget alimentat în timp real prin API extern'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            {lang === 'en'
              ? 'Pedagogical Check: Resource Embedding (Textbook pages 48–49)'
              : 'Verificare Pedagogică: Încorporarea Resurselor (Manual pag. 48–49)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'en'
                ? 'Task 1: The teacher wants to embed an elective course selection survey on the school website. What is the recommended method in Google Sites?'
                : 'Cerința 1: Profesorul dorește să afișeze pe site-ul școlii un formular pentru opțiunile elevilor de clasa a VIII-a. Care este metoda optimă recomandată în Google Sites?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 49: În fila Inserare există secțiunea Google Workspace (Formulare/Forms). Aceasta permite inserarea directă a formularului creat anterior pe Drive, fără a fi nevoie de cod complicat."
              hintEn="Textbook page 49: In the Insert tab look under Google Workspace for Forms. It allows direct one-click integration of forms created on Drive without manual coding."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Copierea textului întrebărilor într-o casetă simplă și rugarea elevilor să trimită un SMS',
                labelEn: 'A. Copying question text into a plain text box and asking students to send SMS texts'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Din fila „Inserare”, selectarea opțiunii „Formulare” (Google Forms) și alegerea formularului dorit din Google Drive',
                labelEn: 'B. From the "Insert" tab, choosing "Forms" (Google Forms) and picking the survey from Google Drive'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Descărcarea formularului ca fișier PDF și inserarea lui ca imagine statică neselectabilă',
                labelEn: 'C. Downloading the form as a PDF and placing it as an unclickable static picture'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Doar prin crearea unei teme grafice noi',
                labelEn: 'D. Solely by defining a new visual color theme'
              }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  answers['q1'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'en' ? opt.labelEn : opt.labelRo}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Check Answer' : 'Verifică Răspunsul'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Choosing "Insert" -> "Forms" integrates the active questionnaire directly into the page canvas, streaming submissions safely into Google Drive in real time.'
                : 'Corect! Inserarea din fila „Inserare” -> „Formulare” încorporează chestionarul complet în pagină, colectând datele instantaneu și în siguranță pe Google Drive.'}
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'en'
                ? 'Task 2: What occurs when you edit numerical records inside a Google Sheets document embedded on the class website?'
                : 'Cerința 2: Ce se întâmplă când modifici datele dintr-o foaie de calcul Google Sheets care a fost încorporată pe site-ul clasei?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 49: Aplicațiile Google Workspace (Docs, Sheets, Slides) sunt legate direct de documentul sursă de pe Google Drive."
              hintEn="Textbook page 49: Google Workspace files (Docs, Sheets, Slides) maintain an active live link to the cloud source on Google Drive."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Site-ul se șterge automat și trebuie reconstruit de la zero',
                labelEn: 'A. The website deletes itself and has to be rebuilt from scratch'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Modificările se actualizează automat și pe site, fără a fi nevoie de re-inserarea fișierului',
                labelEn: 'B. Changes sync automatically to the live site without needing to re-embed the file'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Trebuie descărcat fișierul, convertit în HTML și trimis prin poștă',
                labelEn: 'C. The file must be exported to HTML and mailed on disk'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Modificările devin vizibile numai dacă schimbi tema grafică a site-ului',
                labelEn: 'D. Changes only appear if you swap the graphic theme'
              }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  answers['q2'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'en' ? opt.labelEn : opt.labelRo}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Check Answer' : 'Verifică Răspunsul'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Excellent! Cloud real-time synchronization is the hallmark of the Google ecosystem: any updates made to the source document on Google Drive dynamically propagate to all website visitors.'
                : 'Excelent! Sincronizarea cloud în timp real este forța ecosistemului Google: orice editare a documentului sursă din Google Drive se reflectă automat pentru vizitatorii site-ului web.'}
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={4}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel={lang === 'en'
          ? 'Continue with Level 5: Graphic Themes & Visual Identity'
          : 'Continuă cu Lecția 5: Teme Grafice & Identitate Vizuală'}
      />
    </div>
  );
};
