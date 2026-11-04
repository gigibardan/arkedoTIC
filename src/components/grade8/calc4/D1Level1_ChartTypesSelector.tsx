import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  LineChart,
  ScatterChart,
  AreaChart,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Layers,
  Award,
  Eye
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface D1Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface Scenario {
  id: string;
  title: string;
  titleEn: string;
  dataSummary: string;
  dataSummaryEn: string;
  recommendedType: 'column' | 'pie' | 'line' | 'scatter';
  explanation: string;
  explanationEn: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sc1',
    title: '1. Evoluția temperaturii în București pe parcursul celor 12 luni ale anului',
    titleEn: '1. Evolution of Bucharest temperature across the 12 months of the year',
    dataSummary: 'Ian: -1°C, Feb: 1°C, Mar: 6°C, Apr: 12°C, Mai: 18°C, Iun: 22°C, Iul: 25°C, Aug: 24°C, Sep: 19°C, Oct: 13°C, Nov: 6°C, Dec: 1°C',
    dataSummaryEn: 'Jan: -1°C, Feb: 1°C, Mar: 6°C, Apr: 12°C, May: 18°C, Jun: 22°C, Jul: 25°C, Aug: 24°C, Sep: 19°C, Oct: 13°C, Nov: 6°C, Dec: 1°C',
    recommendedType: 'line',
    explanation: 'Manual pag. 29: Diagramele liniare (Line Charts) sunt ideale pentru reprezentarea dinamicii și a evoluției în timp a unor valori continue pe o perioadă cronologică.',
    explanationEn: 'Curriculum p. 29: Line Charts are ideal for representing dynamics and continuous temporal trends over a chronological period.'
  },
  {
    id: 'sc2',
    title: '2. Ponderile cheltuielilor lunare ale unei familii din bugetul total (100%)',
    titleEn: '2. Monthly family budget expense shares out of the total budget (100%)',
    dataSummary: 'Locuință: 35%, Hrană: 30%, Educație: 15%, Transport: 10%, Economii: 10%',
    dataSummaryEn: 'Housing: 35%, Food: 30%, Education: 15%, Transport: 10%, Savings: 10%',
    recommendedType: 'pie',
    explanation: 'Manual pag. 29: Diagramele circulare (Pie Charts / Plăcintă) redau raportul fiecărei părți componente față de întreg (proporții, procente din 100%).',
    explanationEn: 'Curriculum p. 29: Pie Charts show the proportion of each component relative to the whole (proportions, percentages out of 100%).'
  },
  {
    id: 'sc3',
    title: '3. Compararea numărului de locuitori între cele 5 mari municipii ale României',
    titleEn: '3. Comparing population counts across the 5 major municipalities of Romania',
    dataSummary: 'Cluj-Napoca: 324.000, Timișoara: 319.000, Iași: 318.000, Constanța: 283.000, Craiova: 269.000',
    dataSummaryEn: 'Cluj-Napoca: 324,000, Timișoara: 319,000, Iași: 318,000, Constanța: 283,000, Craiova: 269,000',
    recommendedType: 'column',
    explanation: 'Manual pag. 29: Diagramele cu coloane (sau bare orizontale) sunt destinate comparării directe a unor valori cantitative distincte între categorii individuale.',
    explanationEn: 'Curriculum p. 29: Column (or horizontal Bar) charts are designed for direct comparison of distinct quantitative values across individual categories.'
  },
  {
    id: 'sc4',
    title: '4. Corelația experimentală de laborator dintre tensiunea electrică (U) și intensitatea curentului (I)',
    titleEn: '4. Experimental laboratory correlation between electric voltage (U) and electric current (I)',
    dataSummary: 'U (V): [1.5, 3.0, 4.5, 6.0, 7.5, 9.0], I (mA): [15, 29, 46, 61, 74, 89]',
    dataSummaryEn: 'U (V): [1.5, 3.0, 4.5, 6.0, 7.5, 9.0], I (mA): [15, 29, 46, 61, 74, 89]',
    recommendedType: 'scatter',
    explanation: 'Manual pag. 30: Diagramele de dispersie (XY Scatter) trasează perechi de coordonate numerice pentru a evidenția legături funcționale între două mărimi fizice.',
    explanationEn: 'Curriculum p. 30: XY Scatter charts plot pairs of numeric coordinates to highlight functional dependencies between two physical quantities.'
  }
];

export const D1Level1_ChartTypesSelector: React.FC<D1Level1Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<{ [scId: string]: string }>({});
  const [solvedScenarios, setSolvedScenarios] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const currentScenario = SCENARIOS[activeScenarioIdx];

  const handleSelectChartType = (type: 'column' | 'pie' | 'line' | 'scatter') => {
    setSelectedTypes(prev => ({ ...prev, [currentScenario.id]: type }));
    if (type === currentScenario.recommendedType) {
      sounds.playCorrect();
      setFeedback({
        isSuccess: true,
        text: lang === 'en' ? `Excellent! ${currentScenario.explanationEn}` : `Excelent! ${currentScenario.explanation}`
      });
      if (!solvedScenarios.includes(currentScenario.id)) {
        setSolvedScenarios(prev => [...prev, currentScenario.id]);
      }
    } else {
      sounds.playWrong();
      setFeedback({
        isSuccess: false,
        text: lang === 'en'
          ? 'Suboptimal chart type for this data. The textbook recommends a different type to accurately highlight the data. Consider whether this represents time, comparison, or proportions!'
          : 'Tip de diagramă neoptim pentru aceste date. Manualul recomandă un tip diferit pentru a evidenția corect datele. Analizează dacă vorbim despre timp, comparație sau proporții!'
      });
    }
  };

  const handleNextScenario = () => {
    sounds.playClick();
    setFeedback(null);
    if (activeScenarioIdx < SCENARIOS.length - 1) {
      setActiveScenarioIdx(prev => prev + 1);
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

  const allScenariosDone = solvedScenarios.length === SCENARIOS.length;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = allScenariosDone && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/70 via-indigo-950/40 to-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Textbook 2025 • p. 29–30' : 'Manual Art Klett 2025 • Pag. 29–30'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-sky-400" />
              {lang === 'en' ? 'Level 1: Chart Types & Pedagogical Purpose' : 'Nivelul 1: Tipuri de Diagrame & Destinația Pedagogică'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'A picture is worth a thousand cells! Learn when to choose column, line, pie, or scatter charts to communicate data effectively.'
                : 'O imagine valorează cât o mie de celule! Învață când să alegi diagrame cu coloane, linii, circulare sau de dispersie pentru a comunica eficient datele.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-sky-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Module 1D' : 'Modulul 1D'}</div>
            <div className="text-2xl font-black text-sky-400">{solvedScenarios.length}/{SCENARIOS.length}</div>
            <div className="text-[11px] text-slate-400">{lang === 'en' ? 'Solved Scenarios' : 'Scenarii Soluționate'}</div>
          </div>
        </div>
      </div>

      {/* Scenarios Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SCENARIOS.map((sc, idx) => {
          const isCurrent = idx === activeScenarioIdx;
          const isSolved = solvedScenarios.includes(sc.id);
          const scTitle = lang === 'en' ? sc.titleEn : sc.title;
          return (
            <button
              key={sc.id}
              onClick={() => {
                sounds.playClick();
                setActiveScenarioIdx(idx);
                setFeedback(null);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'border-sky-500 bg-sky-500/10 text-sky-300 shadow-md ring-2 ring-sky-500/20'
                  : isSolved
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {lang === 'en' ? `Case ${idx + 1}` : `Cazul ${idx + 1}`}
                </span>
                {isSolved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-300 line-clamp-1">{scTitle.split('.')[1] || scTitle}</p>
            </button>
          );
        })}
      </div>

      {/* Interactive Chart Simulator & Selector Station */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en' ? 'Graphical Diagnostic Station' : 'Stația de Diagnosticare Grafică'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Analyze the nature of the data and choose the optimal representation' : 'Analizează natura datelor și alege reprezentarea optimă'}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {lang === 'en' ? `Scenario ${activeScenarioIdx + 1} of ${SCENARIOS.length}` : `Scenariul ${activeScenarioIdx + 1} din ${SCENARIOS.length}`}
          </span>
        </div>

        {/* Current Scenario Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            {lang === 'en' ? currentScenario.titleEn : currentScenario.title}
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-sky-300 leading-relaxed">
            {lang === 'en' ? currentScenario.dataSummaryEn : currentScenario.dataSummary}
          </div>
        </div>

        {/* Chart Options Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            {lang === 'en' ? 'Choose the optimal chart type according to the curriculum:' : 'Alege tipul optim de diagramă conform programei:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                type: 'column',
                label: lang === 'en' ? 'Columns (Column)' : 'Coloane (Column)',
                icon: BarChart3,
                desc: lang === 'en' ? 'Compare values across categories' : 'Comparare valori între categorii'
              },
              {
                type: 'line',
                label: lang === 'en' ? 'Line' : 'Linie (Line)',
                icon: LineChart,
                desc: lang === 'en' ? 'Evolution & trends over time' : 'Evoluție & tendințe în timp'
              },
              {
                type: 'pie',
                label: lang === 'en' ? 'Pie' : 'Circulară (Pie)',
                icon: PieChart,
                desc: lang === 'en' ? 'Proportions & % of total' : 'Proporții & procente din total'
              },
              {
                type: 'scatter',
                label: lang === 'en' ? 'Scatter (XY)' : 'Dispersie (XY)',
                icon: ScatterChart,
                desc: lang === 'en' ? 'Scientific correlations' : 'Corelații științifice'
              }
            ].map(item => {
              const isSelected = selectedTypes[currentScenario.id] === item.type;
              const isCorrectType = currentScenario.recommendedType === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => handleSelectChartType(item.type as any)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    isSelected
                      ? isCorrectType
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300 shadow-md ring-2 ring-rose-500/20'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <item.icon className="w-7 h-7 text-sky-400" />
                  <span className="font-bold text-xs">{item.label}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Graphic Preview Rendered with SVG */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" /> {lang === 'en' ? 'Dynamic Chart Preview' : 'Previzualizare Dinamică a Diagramei'}
            </span>
            <span className="text-[11px] font-mono text-sky-400">
              {selectedTypes[currentScenario.id]
                ? (lang === 'en' ? `Active type: ${selectedTypes[currentScenario.id].toUpperCase()}` : `Tip activ: ${selectedTypes[currentScenario.id].toUpperCase()}`)
                : (lang === 'en' ? 'Choose a chart type' : 'Alege un tip de diagramă')}
            </span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            {selectedTypes[currentScenario.id] === 'column' && (
              <svg className="w-full h-full max-w-md" viewBox="0 0 300 150">
                <line x1="30" y1="130" x2="280" y2="130" stroke="#334155" strokeWidth="2" />
                <line x1="30" y1="20" x2="30" y2="130" stroke="#334155" strokeWidth="2" />
                <rect x="50" y="30" width="30" height="100" rx="4" fill="#38bdf8" />
                <rect x="95" y="45" width="30" height="85" rx="4" fill="#0284c7" />
                <rect x="140" y="50" width="30" height="80" rx="4" fill="#38bdf8" />
                <rect x="185" y="70" width="30" height="60" rx="4" fill="#0284c7" />
                <rect x="230" y="75" width="30" height="55" rx="4" fill="#38bdf8" />
                <text x="55" y="145" fill="#94a3b8" fontSize="9">CJ</text>
                <text x="100" y="145" fill="#94a3b8" fontSize="9">TM</text>
                <text x="148" y="145" fill="#94a3b8" fontSize="9">IS</text>
                <text x="193" y="145" fill="#94a3b8" fontSize="9">CT</text>
                <text x="238" y="145" fill="#94a3b8" fontSize="9">DJ</text>
              </svg>
            )}

            {selectedTypes[currentScenario.id] === 'line' && (
              <svg className="w-full h-full max-w-md" viewBox="0 0 300 150">
                <line x1="30" y1="130" x2="280" y2="130" stroke="#334155" strokeWidth="2" />
                <line x1="30" y1="20" x2="30" y2="130" stroke="#334155" strokeWidth="2" />
                <path
                  d="M 40 120 Q 80 110 110 90 T 170 30 T 230 70 T 270 120"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                <circle cx="40" cy="120" r="4" fill="#38bdf8" />
                <circle cx="110" cy="90" r="4" fill="#38bdf8" />
                <circle cx="170" cy="30" r="4" fill="#f59e0b" />
                <circle cx="230" cy="70" r="4" fill="#38bdf8" />
                <circle cx="270" cy="120" r="4" fill="#38bdf8" />
                <text x="35" y="145" fill="#94a3b8" fontSize="9">{lang === 'en' ? 'Jan' : 'Ian'}</text>
                <text x="105" y="145" fill="#94a3b8" fontSize="9">{lang === 'en' ? 'Apr' : 'Apr'}</text>
                <text x="165" y="145" fill="#94a3b8" fontSize="9">{lang === 'en' ? 'Jul' : 'Iul'}</text>
                <text x="225" y="145" fill="#94a3b8" fontSize="9">{lang === 'en' ? 'Oct' : 'Oct'}</text>
                <text x="265" y="145" fill="#94a3b8" fontSize="9">{lang === 'en' ? 'Dec' : 'Dec'}</text>
              </svg>
            )}

            {selectedTypes[currentScenario.id] === 'pie' && (
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                <path d="M 50 50 L 50 10 A 40 40 0 0 1 88 62 Z" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />
                <path d="M 50 50 L 88 62 A 40 40 0 0 1 35 88 Z" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                <path d="M 50 50 L 35 88 A 40 40 0 0 1 12 40 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
              </svg>
            )}

            {selectedTypes[currentScenario.id] === 'scatter' && (
              <svg className="w-full h-full max-w-md" viewBox="0 0 300 150">
                <line x1="30" y1="130" x2="280" y2="130" stroke="#334155" strokeWidth="2" />
                <line x1="30" y1="20" x2="30" y2="130" stroke="#334155" strokeWidth="2" />
                <circle cx="60" cy="115" r="5" fill="#38bdf8" />
                <circle cx="100" cy="98" r="5" fill="#38bdf8" />
                <circle cx="140" cy="80" r="5" fill="#38bdf8" />
                <circle cx="180" cy="62" r="5" fill="#38bdf8" />
                <circle cx="220" cy="46" r="5" fill="#38bdf8" />
                <circle cx="260" cy="30" r="5" fill="#38bdf8" />
                <line x1="40" y1="125" x2="270" y2="25" stroke="#38bdf8" strokeDasharray="4" strokeWidth="1.5" />
                <text x="140" y="145" fill="#94a3b8" fontSize="9">{lang === 'en' ? 'Voltage U (V)' : 'Tensiune U (V)'}</text>
              </svg>
            )}

            {!selectedTypes[currentScenario.id] && (
              <div className="text-slate-500 text-xs italic flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> {lang === 'en' ? 'Select a chart type above to view visual rendering' : 'Selectează un tip de diagramă de mai sus pentru a vedea randarea vizuală'}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            feedback.isSuccess
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            {feedback.isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <p className="text-sm leading-relaxed">{feedback.text}</p>
          </div>
        )}

        {/* Next Scenario Button */}
        {selectedTypes[currentScenario.id] === currentScenario.recommendedType && activeScenarioIdx < SCENARIOS.length - 1 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextScenario}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
            >
              {lang === 'en' ? 'Next Scenario' : 'Următorul Scenariu'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Pedagogical Reflection: Graphical Representation Theory' : 'Reflecție Pedagogică: Teoria Reprezentării Grafice'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Art Klett Textbook p. 29–30: Visual decision criteria' : 'Manual Art Klett pag. 29–30: Criterii de decizie vizuală'}
            </p>
          </div>
        </div>

        {/* Quiz Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '1. If we have a dataset totaling 100% and want to show the share of each category from the whole, which chart type is discouraged or counterproductive according to best practices?'
              : '1. Dacă avem o serie de date care însumează 100% și dorim să arătăm ponderea fiecărei categorii dintr-un întreg, ce tip de diagramă este interzis sau contraindicat conform bunelor practici?'}
          </div>
          <QuestionHint
            hintRo="Gândește-te ce diagramă este rezervată exclusiv pentru evoluții cronologice continue, nu pentru fracțiuni statice dintr-un total."
            hintEn="Consider which chart is strictly intended for continuous chronological trends rather than static portions of a whole."
          />
          <div className="space-y-2">
            {(lang === 'en' ? [
              { text: 'Line Chart — because it does not convey partition of a whole, but a continuous temporal progression', correct: true },
              { text: 'Pie Chart — which is forbidden for percentages', correct: false },
              { text: 'Doughnut Chart — which cannot display percentages', correct: false }
            ] : [
              { text: 'Diagrama liniară (Line Chart) — deoarece nu sugerează o împărțire a unui întreg, ci o evoluție temporală continuă', correct: true },
              { text: 'Diagrama circulară (Pie Chart) — care este interzisă la procente', correct: false },
              { text: 'Diagrama cu inele (Doughnut Chart) — care nu suportă procente', correct: false }
            ]).map((opt, idx) => {
              const qId = 'd1_l1_q1';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('d1_l1_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l1_q1'] || 0} />
          )}
          {quizSubmitted['d1_l1_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! For composition of a whole, Pie Charts (or 100% stacked bar charts) are recommended. A line chart would create the false impression of chronological progression between independent categories.'
                : 'Corect! Pentru compoziția unui întreg se recomandă Pie Chart (sau Bar Chart procentual). Diagrama de linii ar crea impresia falsă a unei dinamici temporale între categorii independente.'}
            />
          )}
        </div>

        {/* Quiz Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. What is the fundamental difference between a Column chart and a Bar chart?'
              : '2. Care este diferența esențială dintre o diagramă cu coloane (Column) și una cu bare (Bar)?'}
          </div>
          <QuestionHint
            hintRo="Observă orientarea axelor: verticală vs orizontală."
            hintEn="Observe axis orientation: vertical vs horizontal."
          />
          <div className="space-y-2">
            {(lang === 'en' ? [
              { text: 'In Column, bars are vertical, whereas in Bar, bars are horizontal (very useful when category labels are lengthy)', correct: true },
              { text: 'Column is strictly for even numbers, while Bar is strictly for odd numbers', correct: false },
              { text: 'There is no technical or visual difference', correct: false }
            ] : [
              { text: 'La Column coloanele sunt verticale, iar la Bar barele sunt orizontale (foarte utilă când etichetele categoriilor au denumiri lungi)', correct: true },
              { text: 'Column se folosește doar pentru numere pare, iar Bar doar pentru numere impare', correct: false },
              { text: 'Nu există nicio diferență tehnică sau vizuală', correct: false }
            ]).map((opt, idx) => {
              const qId = 'd1_l1_q2';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('d1_l1_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l1_q2'] || 0} />
          )}
          {quizSubmitted['d1_l1_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exactly! Curriculum p. 29: Horizontal Bar charts offer plenty of vertical room for lengthy text labels without rotating or clipping them.'
                : 'Exact! Manual pag. 29: Diagramele cu bare orizontale (Bar) oferă spațiu generos pe axa verticală pentru etichete de text lungi fără a le înclina sau tăia.'}
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
        nextLabel={lang === 'en' ? 'To Level 2: Chart Anatomy' : 'Spre Nivelul 2: Anatomia Diagramei'}
      />
    </div>
  );
};
