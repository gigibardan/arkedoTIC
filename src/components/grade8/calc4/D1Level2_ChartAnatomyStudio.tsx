import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  Maximize2,
  Tag,
  Grid,
  Bookmark
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface D1Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface AnatomyPart {
  id: string;
  name: string;
  manualDesc: string;
  location: string;
  icon: any;
}

const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'title',
    name: 'Titlul Diagramei (Chart Title)',
    manualDesc: 'Manual pag. 30: Textul din partea superioară ce sintetizează clar conținutul și tema reprezentării (ex: „Vânzări Lunare 2025”).',
    location: 'Sus, centrat deasupra zonei de trasare',
    icon: Bookmark
  },
  {
    id: 'plotArea',
    name: 'Zona de Trasare (Plot Area)',
    manualDesc: 'Manual pag. 30: Spațiul interior delimitat strict de axele X și Y, unde sunt desenate fizic barele, liniile sau punctele.',
    location: 'Interiorul dreptunghiului axelor',
    icon: Maximize2
  },
  {
    id: 'categoryAxis',
    name: 'Axa Orizontală a Categoriilor (Axa X)',
    manualDesc: 'Manual pag. 31: Axa pe care sunt dispuse grupele sau intervalele de timp independente (ex: Ian, Feb, Mar sau Clasele 5-8).',
    location: 'La baza zonei de trasare, orizontal',
    icon: Sliders
  },
  {
    id: 'valueAxis',
    name: 'Axa Verticală a Valorilor (Axa Y)',
    manualDesc: 'Manual pag. 31: Scara gradată numerică (cu min, max și pas de diviziune) care măsoară magnitudinea cantitativă a datelor.',
    location: 'În stânga zonei de trasare, vertical',
    icon: Sliders
  },
  {
    id: 'legend',
    name: 'Legenda Diagramei (Legend)',
    manualDesc: 'Manual pag. 31: Caseta ce codifică culorile sau stilurile grafice pentru a distinge între serii diferite (ex: Albastru = Băieți, Portocaliu = Fete).',
    location: 'De regulă în dreapta sau în partea de jos',
    icon: Tag
  },
  {
    id: 'gridlines',
    name: 'Linii de Grilă (Gridlines)',
    manualDesc: 'Manual pag. 31: Liniile de fundal orizontale și verticale care ghidează privirea de la un punct al seriei la valoarea sa de pe axă.',
    location: 'Fundalul zonei de trasare',
    icon: Grid
  }
];

export const D1Level2_ChartAnatomyStudio: React.FC<D1Level2Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>('title');
  const [discoveredParts, setDiscoveredParts] = useState<string[]>(['title']);

  // Dynamic Chart Elements Toggles
  const [showTitle, setShowTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showGridlines, setShowGridlines] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(false);

  // Reflection questions with 5-second cooldown
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const handleSelectPart = (id: string) => {
    sounds.playClick();
    setSelectedPartId(id);
    if (!discoveredParts.includes(id)) {
      setDiscoveredParts(prev => [...prev, id]);
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

  const currentPart = ANATOMY_PARTS.find(p => p.id === selectedPartId) || ANATOMY_PARTS[0];
  const allDiscovered = discoveredParts.length === ANATOMY_PARTS.length;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = allDiscovered && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-sky-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 30–31</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Layers className="w-8 h-8 text-teal-400" />
              Nivelul 2: Anatomia Completă a unei Diagrame
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Explorează componentele vitale: de la Zona de Trasare (Plot Area) la Axele de Categorii și Liniile de Grilă. Învață să controlezi fiecare element de proiectare.
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Elemente Identificate</div>
            <div className="text-2xl font-black text-teal-400">{discoveredParts.length}/{ANATOMY_PARTS.length}</div>
            <div className="text-[11px] text-slate-400">Componente Manual</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Simulator de Disecție a Diagramei</h2>
              <p className="text-xs text-slate-400">Fă click pe butoane sau pe elementele grafice pentru a le analiza</p>
            </div>
          </div>

          {/* Quick Visibility Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { sounds.playClick(); setShowTitle(!showTitle); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                showTitle ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              Titlu: {showTitle ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => { sounds.playClick(); setShowLegend(!showLegend); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                showLegend ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              Legendă: {showLegend ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => { sounds.playClick(); setShowGridlines(!showGridlines); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                showGridlines ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              Grilă: {showGridlines ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => { sounds.playClick(); setShowDataLabels(!showDataLabels); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                showDataLabels ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              Etichete: {showDataLabels ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Anatomical SVG Diagram Visualizer */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <svg className="w-full h-72" viewBox="0 0 500 240">
            {/* Chart Area background highlight */}
            <rect
              x="5"
              y="5"
              width="490"
              height="230"
              rx="12"
              fill={selectedPartId === 'plotArea' ? 'rgba(20, 184, 166, 0.05)' : '#090d16'}
              stroke={selectedPartId === 'plotArea' ? '#14b8a6' : '#1e293b'}
              strokeWidth="2"
            />

            {/* Chart Title */}
            {showTitle && (
              <g
                onClick={() => handleSelectPart('title')}
                className="cursor-pointer group"
              >
                <rect
                  x="140"
                  y="12"
                  width="220"
                  height="26"
                  rx="6"
                  fill={selectedPartId === 'title' ? 'rgba(20, 184, 166, 0.25)' : 'rgba(30, 41, 59, 0.4)'}
                  stroke={selectedPartId === 'title' ? '#14b8a6' : 'transparent'}
                  strokeWidth="2"
                />
                <text
                  x="250"
                  y="29"
                  textAnchor="middle"
                  fill={selectedPartId === 'title' ? '#2dd4bf' : '#f8fafc'}
                  fontSize="13"
                  fontWeight="bold"
                >
                  Performanța Școlară la Matematică (2025)
                </text>
              </g>
            )}

            {/* Plot Area rectangle */}
            <g onClick={() => handleSelectPart('plotArea')} className="cursor-pointer">
              <rect
                x="60"
                y="50"
                width="320"
                height="140"
                fill={selectedPartId === 'plotArea' ? 'rgba(20, 184, 166, 0.15)' : 'rgba(15, 23, 42, 0.6)'}
                stroke={selectedPartId === 'plotArea' ? '#14b8a6' : '#334155'}
                strokeWidth={selectedPartId === 'plotArea' ? 2 : 1}
                rx="6"
              />
            </g>

            {/* Gridlines */}
            {showGridlines && (
              <g onClick={() => handleSelectPart('gridlines')} className="cursor-pointer">
                {[80, 115, 150].map((yVal, i) => (
                  <line
                    key={i}
                    x1="60"
                    y1={yVal}
                    x2="380"
                    y2={yVal}
                    stroke={selectedPartId === 'gridlines' ? '#2dd4bf' : '#334155'}
                    strokeDasharray={selectedPartId === 'gridlines' ? '0' : '4'}
                    strokeWidth={selectedPartId === 'gridlines' ? 2 : 1}
                  />
                ))}
              </g>
            )}

            {/* Y Axis Values */}
            <g onClick={() => handleSelectPart('valueAxis')} className="cursor-pointer">
              <line
                x1="60"
                y1="50"
                x2="60"
                y2="190"
                stroke={selectedPartId === 'valueAxis' ? '#2dd4bf' : '#64748b'}
                strokeWidth={selectedPartId === 'valueAxis' ? 3 : 2}
              />
              <text x="50" y="55" fill="#94a3b8" fontSize="10" textAnchor="end">100</text>
              <text x="50" y="85" fill="#94a3b8" fontSize="10" textAnchor="end">75</text>
              <text x="50" y="120" fill="#94a3b8" fontSize="10" textAnchor="end">50</text>
              <text x="50" y="155" fill="#94a3b8" fontSize="10" textAnchor="end">25</text>
              <text x="50" y="190" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
              <text
                x="25"
                y="120"
                fill={selectedPartId === 'valueAxis' ? '#2dd4bf' : '#94a3b8'}
                fontSize="10"
                fontWeight="bold"
                transform="rotate(-90, 25, 120)"
                textAnchor="middle"
              >
                Punctaj Mediu
              </text>
            </g>

            {/* X Axis Categories */}
            <g onClick={() => handleSelectPart('categoryAxis')} className="cursor-pointer">
              <line
                x1="60"
                y1="190"
                x2="380"
                y2="190"
                stroke={selectedPartId === 'categoryAxis' ? '#2dd4bf' : '#64748b'}
                strokeWidth={selectedPartId === 'categoryAxis' ? 3 : 2}
              />
              {['Clasa 8A', 'Clasa 8B', 'Clasa 8C', 'Clasa 8D'].map((cls, idx) => (
                <text
                  key={idx}
                  x={100 + idx * 75}
                  y="206"
                  fill={selectedPartId === 'categoryAxis' ? '#2dd4bf' : '#cbd5e1'}
                  fontSize="11"
                  fontWeight="semibold"
                  textAnchor="middle"
                >
                  {cls}
                </text>
              ))}
            </g>

            {/* Series Columns (Data Series) */}
            {[
              { x: 80, h1: 100, h2: 85 },
              { x: 155, h1: 115, h2: 125 },
              { x: 230, h1: 90, h2: 95 },
              { x: 305, h1: 130, h2: 110 }
            ].map((col, idx) => (
              <g key={idx}>
                {/* Series 1 Bar */}
                <rect
                  x={col.x}
                  y={190 - col.h1}
                  width="18"
                  height={col.h1}
                  rx="3"
                  fill="#0284c7"
                />
                {showDataLabels && (
                  <text x={col.x + 9} y={185 - col.h1} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                    {Math.round(col.h1 * 0.75)}
                  </text>
                )}

                {/* Series 2 Bar */}
                <rect
                  x={col.x + 22}
                  y={190 - col.h2}
                  width="18"
                  height={col.h2}
                  rx="3"
                  fill="#f59e0b"
                />
                {showDataLabels && (
                  <text x={col.x + 31} y={185 - col.h2} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                    {Math.round(col.h2 * 0.75)}
                  </text>
                )}
              </g>
            ))}

            {/* Legend Box */}
            {showLegend && (
              <g
                onClick={() => handleSelectPart('legend')}
                className="cursor-pointer"
              >
                <rect
                  x="395"
                  y="70"
                  width="95"
                  height="75"
                  rx="8"
                  fill={selectedPartId === 'legend' ? 'rgba(20, 184, 166, 0.25)' : 'rgba(30, 41, 59, 0.6)'}
                  stroke={selectedPartId === 'legend' ? '#14b8a6' : '#334155'}
                  strokeWidth="2"
                />
                <text x="442" y="88" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                  Legendă
                </text>
                <rect x="405" y="98" width="12" height="12" rx="2" fill="#0284c7" />
                <text x="424" y="108" fill="#e2e8f0" fontSize="10">Semestrul I</text>
                <rect x="405" y="118" width="12" height="12" rx="2" fill="#f59e0b" />
                <text x="424" y="128" fill="#e2e8f0" fontSize="10">Semestrul II</text>
              </g>
            )}
          </svg>
        </div>

        {/* Anatomical Parts Inspection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ANATOMY_PARTS.map(part => {
            const isSelected = selectedPartId === part.id;
            const isDiscovered = discoveredParts.includes(part.id);
            const Icon = part.icon;
            return (
              <button
                key={part.id}
                onClick={() => handleSelectPart(part.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-500/15 text-teal-200 ring-2 ring-teal-500/20'
                    : isDiscovered
                    ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    : 'border-slate-800/60 bg-slate-950/30 text-slate-500'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  isSelected ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate flex items-center justify-between">
                    <span>{part.name.split('(')[0]}</span>
                    {isDiscovered && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 ml-1" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">{part.location}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Part Detail Card */}
        <div className="bg-teal-950/30 border border-teal-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            {currentPart.name}
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">{currentPart.manualDesc}</p>
          <div className="text-xs text-teal-300 font-mono">Amplasare: {currentPart.location}</div>
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Reflecție Pedagogică: Arhitectura Datelor Vizuale</h2>
            <p className="text-xs text-slate-400">Verifică-ți cunoștințele din manualul oficial (pag. 30–31)</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            1. Care este diferența dintre „Zona diagramei” (Chart Area) și „Zona de trasare” (Plot Area)?
          </div>
          <QuestionHint hint="Gândește-te la un tablou într-o ramă: care este pânza desenată și care este rama cu tot cu etichetă?" />
          <div className="space-y-2">
            {[
              { text: 'Zona diagramei cuprinde tot cadrul (titlu, legendă, margini), iar zona de trasare este doar interiorul delimitat de axele X și Y unde sunt desenate seriile grafice', correct: true },
              { text: 'Sunt două denumiri identice pentru același element grafic', correct: false },
              { text: 'Zona de trasare include doar textul titlului și legenda, fără date', correct: false }
            ].map((opt, idx) => {
              const qId = 'd1_l2_q1';
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
          {isLocked('d1_l2_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l2_q1'] || 0} />
          )}
          {quizSubmitted['d1_l2_q1'] && (
            <AnswerExplanation explanation="Corect! Manual pag. 30: Chart Area este întregul obiect inserat în foaie, în timp ce Plot Area este spațiul geometric delimitat de axe unde sunt reprezentate fizic seriile de date." />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            2. Când este obligatorie prezența Legendei într-o diagramă?
          </div>
          <QuestionHint hint="Dacă ai o singură coloană de date (ex. doar note la informatică), ai nevoie să știi ce culoare are fiecare serie?" />
          <div className="space-y-2">
            {[
              { text: 'Când diagrama conține două sau mai multe serii de date (ex: Băieți vs Fete sau Semestrul 1 vs Semestrul 2), pentru a diferenția semnificația fiecărei culori', correct: true },
              { text: 'Doar când diagrama este tipărită alb-negru', correct: false },
              { text: 'Legenda este obligatorie în orice diagramă, chiar și dacă are o singură coloană', correct: false }
            ].map((opt, idx) => {
              const qId = 'd1_l2_q2';
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
          {isLocked('d1_l2_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l2_q2'] || 0} />
          )}
          {quizSubmitted['d1_l2_q2'] && (
            <AnswerExplanation explanation="Excelent! La o singură serie de date, titlul diagramei este suficient, iar legenda ocupă inutil spațiu. În schimb, la reprezentări multiserie, legenda este indispensabilă pentru înțelegerea graficului." />
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
        nextLabel="Spre Nivelul 3: Instrumente de Proiectare & Formatare"
      />
    </div>
  );
};
