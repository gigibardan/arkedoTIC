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
  sourceLabel: string;
  defaultVal: string;
  description: string;
}

const RESOURCES: ResourceConfig[] = [
  {
    type: 'youtube',
    title: 'Videoclip YouTube',
    sourceLabel: 'Link Video sau Căutare YouTube',
    defaultVal: 'https://youtube.com/watch?v=robotics_competition_2025',
    description: 'Manual pag. 48: Permite redarea directă a unui ghid sau reportaj video în interiorul paginii fără a redirecționa utilizatorul.'
  },
  {
    type: 'maps',
    title: 'Google Maps (Hartă Interactivă)',
    sourceLabel: 'Locație Școală / Punct de Interes',
    defaultVal: 'Colegiul Național „Tudor Vladimirescu”, Târgu Jiu',
    description: 'Manual pag. 49: Încorporează o hartă dinamică cu zoom, comutare pe satelit și ghidaj de navigare pentru vizitatorii site-ului.'
  },
  {
    type: 'forms',
    title: 'Google Forms (Formular / Sondaj)',
    sourceLabel: 'Formular de Înscriere la Club',
    defaultVal: 'Sondaj: „Alegerea temei pentru Târgul de Științe 2025”',
    description: 'Manual pag. 49: Colectează răspunsurile elevilor direct în pagina web, datele fiind salvate automat într-o foaie Google Sheets.'
  },
  {
    type: 'sheets',
    title: 'Google Sheets (Clasamente & Orar)',
    sourceLabel: 'Foaie de Calcul Conectată',
    defaultVal: 'Clasament_Olimpiada_Informatica_Gimnaziu.xlsx',
    description: 'Manual pag. 49: Afișează tabele cu note, orare sau statistici ce se actualizează automat pe site când documentul original este editat.'
  },
  {
    type: 'code',
    title: 'Încorporare Cod (Embed <iframe>)',
    sourceLabel: 'Fragment HTML / Widget Extern',
    defaultVal: '<iframe src="https://meteo.ro/widget/bucuresti" height="180"></iframe>',
    description: 'Manual pag. 49: Posibilitatea de a insera widgeturi externe precum prognoza meteo, numărători inverse sau playere audio.'
  }
];

export const W2Level4_MultimediaEmbeddingLab: React.FC<W2Level4Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
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
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2B</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 4: Încorporare Resurse Multimedia & Integrare Google Workspace
            </h1>
            <p className="text-cyan-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 48–49: Învață să transformi un site static într-o platformă dinamică prin
              integrarea formularelor Google, hărților interactive, videoclipurilor YouTube și foilor de calcul live.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-cyan-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">4 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Conținut Dinamic și Încorporare (Manual pag. 48–49)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-rose-600" />
              YouTube & Multimedia
            </div>
            <p className="text-slate-600 text-xs">
              Inserarea videoclipurilor se face direct prin căutare în fereastra dedicată sau lipind adresa URL.
              Google Sites integrează automat playerul cu subtitrări și adaptabilitate pe dispozitive mobile.
            </p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              Ecosistemul Google Workspace
            </div>
            <p className="text-slate-600 text-xs">
              Marele avantaj al Google Sites este sincronizarea în timp real: dacă actualizezi orarul într-un
              Google Doc sau notele într-un Google Sheets, site-ul afișează automat noile date fără republicare manuală.
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              Încorporare Cod (Embed)
            </div>
            <p className="text-slate-600 text-xs">
              Prin opțiunea <strong>Încorporare (&lt;/&gt;)</strong> poți introduce cod HTML/JavaScript extern
              (iframe) pentru widgeturi meteo, numărători inverse sau hărți speciale de orientare turistică.
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
              Simulator Interactiv: Încorporează și Configurează Resursa
            </h3>
          </div>
          <span className="text-xs bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full font-semibold">
            Laborator Workspace
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
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
              <span>{res.title}</span>
            </button>
          ))}
        </div>

        {/* Configuration Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs text-slate-600">
            <strong>Descriere:</strong> {currentConfig.description}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px]">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                {currentConfig.sourceLabel}
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
                Lățime Pe Pagină
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => setEmbedWidth('normal')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold border ${
                    embedWidth === 'normal'
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  Coloană (50%)
                </button>
                <button
                  onClick={() => setEmbedWidth('wide')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold border ${
                    embedWidth === 'wide'
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  Secțiune Medie (75%)
                </button>
                <button
                  onClick={() => setEmbedWidth('full')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold border ${
                    embedWidth === 'full'
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  Lățime Completă (100%)
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
              Rezultat Live
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
                  <div className="font-bold text-sm text-white">Demonstrație Robot Mobil cu Senzori Ultrasonici</div>
                  <div className="text-xs text-slate-400 mt-1">Canalul Școlii • 1.2k vizionări • YouTube Player Embed</div>
                </div>
              )}

              {activeTab === 'maps' && (
                <div className="h-64 bg-slate-700 relative flex flex-col justify-between p-4 bg-gradient-to-br from-emerald-900/60 to-slate-900">
                  <div className="bg-white/90 backdrop-blur text-slate-900 p-2.5 rounded-lg max-w-xs shadow">
                    <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      Colegiul Național
                    </div>
                    <div className="text-[11px] text-slate-600">Strada Eroilor, Nr. 12 • Târgu Jiu, Gorj</div>
                  </div>
                  <div className="flex justify-between items-end text-xs text-slate-300">
                    <span className="bg-black/60 px-2 py-1 rounded">Date hartă ©2025 Google</span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1 rounded shadow">
                      Deschide în Google Maps &rarr;
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'forms' && (
                <div className="p-5 bg-white text-slate-800 space-y-4">
                  <div className="border-b border-indigo-100 pb-3">
                    <div className="text-xs font-bold text-indigo-700 uppercase">Google Forms integrat</div>
                    <h4 className="text-base font-bold text-slate-900">Formular de Înscriere la Clubul de Informatică</h4>
                    <p className="text-xs text-slate-500 mt-1">Completează datele pentru repartizarea pe ateliere.</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nume și Prenume Elev *</label>
                      <input type="text" placeholder="Ex: Popescu Andrei" className="w-full border rounded p-2 text-xs bg-slate-50" readOnly />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Atelierul Dorit *</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1 text-slate-600">
                          <input type="radio" checked readOnly /> Algoritmi C++
                        </label>
                        <label className="flex items-center gap-1 text-slate-600">
                          <input type="radio" readOnly /> Robotică & Senzori
                        </label>
                      </div>
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg">
                    Trimite Răspunsul
                  </button>
                </div>
              )}

              {activeTab === 'sheets' && (
                <div className="p-4 bg-white text-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold border-b pb-2 text-emerald-800">
                    <span className="flex items-center gap-1">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      Rezultate Concurs Școlar (Sincronizat live din Google Sheets)
                    </span>
                    <span className="text-[10px] text-slate-500">Actualizat acum 2 minute</span>
                  </div>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2 border">Loc</th>
                        <th className="p-2 border">Nume Elev</th>
                        <th className="p-2 border">Clasa</th>
                        <th className="p-2 border">Punctaj</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-bold text-amber-600">Premiul I</td>
                        <td className="p-2 border font-medium">Ionescu Maria</td>
                        <td className="p-2 border">8-A</td>
                        <td className="p-2 border font-bold">100 p</td>
                      </tr>
                      <tr>
                        <td className="p-2 border font-bold text-slate-500">Premiul II</td>
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
                    Widget Extern HTML (Încorporat via &lt;iframe&gt;)
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-emerald-500/30">
                    <div className="text-sm font-bold text-white mb-1">🌤️ Prognoza Meteo Locală</div>
                    <div className="text-xs text-slate-300">Temperatura curentă: <strong>+18°C</strong> • Vânt: 12 km/h • Umiditate: 45%</div>
                    <div className="text-[10px] text-emerald-500 mt-2">Widget alimentat în timp real prin API extern</div>
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
            Verificare Pedagogică: Încorporarea Resurselor (Manual pag. 48–49)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Profesorul dorește să afișeze pe site-ul școlii un formular pentru opțiunile elevilor de clasa a VIII-a. Care este metoda optimă recomandată în Google Sites?
            </span>
            <QuestionHint
              hint="Manual pag. 49: În fila Inserare există secțiunea Google Workspace (Formulare/Forms). Aceasta permite inserarea directă a formularului creat anterior pe Drive, fără a fi nevoie de cod complicat."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Copierea textului întrebărilor într-o casetă simplă și rugarea elevilor să trimită un SMS' },
              { id: 'opt_b', label: 'B. Din fila „Inserare”, selectarea opțiunii „Formulare” (Google Forms) și alegerea formularului dorit din Google Drive' },
              { id: 'opt_c', label: 'C. Descărcarea formularului ca fișier PDF și inserarea lui ca imagine statică neselectabilă' },
              { id: 'opt_d', label: 'D. Doar prin crearea unei teme grafice noi' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Inserarea din fila „Inserare” -> „Formulare” încorporează chestionarul complet în pagină, colectând datele instantaneu și în siguranță pe Google Drive."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Ce se întâmplă când modifici datele dintr-o foaie de calcul Google Sheets care a fost încorporată pe site-ul clasei?
            </span>
            <QuestionHint
              hint="Manual pag. 49: Aplicațiile Google Workspace (Docs, Sheets, Slides) sunt legate direct de documentul sursă de pe Google Drive."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Site-ul se șterge automat și trebuie reconstruit de la zero' },
              { id: 'opt_b', label: 'B. Modificările se actualizează automat și pe site, fără a fi nevoie de re-inserarea fișierului' },
              { id: 'opt_c', label: 'C. Trebuie descărcat fișierul, convertit în HTML și trimis prin poștă' },
              { id: 'opt_d', label: 'D. Modificările devin vizibile numai dacă schimbi tema grafică a site-ului' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Sincronizarea cloud în timp real este forța ecosistemului Google: orice editare a documentului sursă din Google Drive se reflectă automat pentru vizitatorii site-ului web."
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
        nextLabel="Continuă cu Lecția 5: Teme Grafice & Identitate Vizuală"
      />
    </div>
  );
};
