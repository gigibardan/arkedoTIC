import React, { useState } from 'react';
import {
  PieChart,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  DollarSign,
  TrendingDown,
  RotateCw,
  Scissors,
  Layers,
  ArrowRight,
  CircleDot
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface D1Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  color: string;
  percent: number;
}

const BUDGET_ITEMS: BudgetItem[] = [
  { id: 'housing', category: 'Locuință & Utilități', amount: 1800, color: '#3b82f6', percent: 36 },
  { id: 'food', category: 'Hrană & Cumpărături', amount: 1500, color: '#10b981', percent: 30 },
  { id: 'savings', category: 'Economii & Investiții', amount: 600, color: '#8b5cf6', percent: 12 },
  { id: 'transport', category: 'Transport & Combustibil', amount: 450, color: '#f59e0b', percent: 9 },
  { id: 'education', category: 'Educație & Cursuri', amount: 400, color: '#ec4899', percent: 8 },
  { id: 'health', category: 'Sănătate & Sport', amount: 250, color: '#06b6d4', percent: 5 },
];

export const D1Level5_BudgetPieChartLab: React.FC<D1Level5Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const [chartStyle, setChartStyle] = useState<'pie' | 'doughnut'>('pie');
  const [explodedSector, setExplodedSector] = useState<string | null>('savings');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [showPercentages, setShowPercentages] = useState(true);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const totalBudget = BUDGET_ITEMS.reduce((sum, item) => sum + item.amount, 0);

  const handleToggleExplode = (id: string) => {
    sounds.playClick();
    setExplodedSector(prev => prev === id ? null : id);
  };

  const handleRotate = () => {
    sounds.playClick();
    setRotationAngle(prev => (prev + 45) % 360);
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

  const quizDone = Object.keys(quizSubmitted).length >= 2;

  // Compute SVG slice paths
  let cumulativeAngle = rotationAngle;
  const slices = BUDGET_ITEMS.map(item => {
    const sliceAngle = (item.amount / totalBudget) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const midRad = ((startAngle + sliceAngle / 2) * Math.PI) / 180;

    const isExploded = explodedSector === item.id;
    const explodeOffset = isExploded ? 12 : 0;
    const cx = 150 + explodeOffset * Math.cos(midRad);
    const cy = 150 + explodeOffset * Math.sin(midRad);
    const r = 110;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const labelX = cx + (r * 0.7) * Math.cos(midRad);
    const labelY = cy + (r * 0.7) * Math.sin(midRad);

    return {
      ...item,
      pathData,
      cx,
      cy,
      midRad,
      labelX,
      labelY,
      isExploded
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 34–35</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <PieChart className="w-8 h-8 text-blue-400" />
              Nivelul 5: Laborator Bugetul Familial (Diagrama Circulară)
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Stăpânește secretele diagramelor structurale: calculează ponderi procentuale, explodează sectoare pentru evidențiere și rotește unghiul de vizualizare (Angle of slice).
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-blue-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Buget Total Lunar</div>
            <div className="text-2xl font-black text-blue-400">{totalBudget} lei</div>
            <div className="text-[11px] text-slate-400">100% din venituri alocate</div>
          </div>
        </div>
      </div>

      {/* Interactive Pie Chart Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Distribuția Cheltuielilor Familiale (Pie & Doughnut)</h2>
              <p className="text-xs text-slate-400">Fă click pe un sector pentru a-l exploda (Point Explosion)</p>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { sounds.playClick(); setChartStyle(prev => prev === 'pie' ? 'doughnut' : 'pie'); }}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <CircleDot className="w-4 h-4 text-blue-400" />
              Tip: {chartStyle === 'pie' ? 'Circulară (Pie 2D)' : 'Inel (Doughnut)'}
            </button>
            <button
              onClick={handleRotate}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <RotateCw className="w-4 h-4 text-emerald-400" />
              Rotește: {rotationAngle}°
            </button>
            <button
              onClick={() => { sounds.playClick(); setShowPercentages(!showPercentages); }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                showPercentages ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Etichete %: {showPercentages ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* SVG Pie Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex items-center justify-center relative">
            <svg className="w-72 h-72" viewBox="0 0 300 300">
              {slices.map(s => (
                <path
                  key={s.id}
                  d={s.pathData}
                  fill={s.color}
                  stroke="#090d16"
                  strokeWidth="2.5"
                  onClick={() => handleToggleExplode(s.id)}
                  className="cursor-pointer transition-transform hover:opacity-90"
                />
              ))}

              {/* Central Hole for Doughnut style */}
              {chartStyle === 'doughnut' && (
                <g>
                  <circle cx="150" cy="150" r="50" fill="#020617" stroke="#1e293b" strokeWidth="2" />
                  <text x="150" y="145" textAnchor="middle" fill="#94a3b8" fontSize="10">TOTAL</text>
                  <text x="150" y="162" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">
                    5.000 lei
                  </text>
                </g>
              )}

              {/* Percentage Labels */}
              {showPercentages &&
                slices.map(s => (
                  <text
                    key={s.id}
                    x={s.labelX}
                    y={s.labelY + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    pointerEvents="none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {s.percent}%
                  </text>
                ))}
            </svg>
          </div>

          {/* Table & Sector Exploder Controller */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Sectoarele Diagramei (Click pentru Explodare)</span>
              {explodedSector && (
                <span className="text-blue-400 text-[10px] lowercase font-mono">
                  [sector explodat activ]
                </span>
              )}
            </div>

            <div className="space-y-2">
              {BUDGET_ITEMS.map(item => {
                const isExploded = explodedSector === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleExplode(item.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isExploded
                        ? 'border-blue-500 bg-blue-500/15 ring-2 ring-blue-500/20'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{item.category}</div>
                        <div className="text-[10px] text-slate-400">{item.amount} lei / lună</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-white">{item.percent}%</span>
                      {isExploded && (
                        <span className="block text-[10px] font-bold text-blue-400 flex items-center gap-1 justify-end">
                          <Scissors className="w-3 h-3" /> Explodat
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Reflecție Pedagogică: Tehnici Avansate de Diagrame Circulare</h2>
            <p className="text-xs text-slate-400">Manual Art Klett pag. 34–35: Bune practici în vizualizarea ponderilor</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            1. Ce tehnică este recomandată când un tabel are mai mult de 7 categorii mărunte de cheltuieli pentru a evita aglomerarea diagramei circulare?
          </div>
          <QuestionHint hint="Prea multe felii subțiri devin ilizibile pe un cerc." />
          <div className="space-y-2">
            {[
              { text: 'Gruparea feliilor mici într-o singură categorie numită „Altele” sau folosirea unei diagrame de tip „Bar of Pie” (Diagramă circulară cu bară derivată)', correct: true },
              { text: 'Ștergerea din foaie a acelor cheltuieli fără a le mai raporta', correct: false },
              { text: 'Mărirea dimensiunii fontului pentru a acoperi întregul ecran', correct: false }
            ].map((opt, idx) => {
              const qId = 'd1_l5_q1';
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
          {isLocked('d1_l5_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l5_q1'] || 0} />
          )}
          {quizSubmitted['d1_l5_q1'] && (
            <AnswerExplanation explanation="Corect! Manual pag. 35: Diagramele circulare sunt eficiente pentru maxim 5-7 felii distincte. Pentru date detaliate, se folosește sub-diagrama „Bar of Pie” sau gruparea într-o categorie unică „Alte cheltuieli”." />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            2. Ce rol are funcția de „Explodare a sectorului” (Point Explosion) într-un raport de afaceri sau bugetar?
          </div>
          <QuestionHint hint="Sectorul se detașează de centrul cercului pentru a atrage imediat privirea." />
          <div className="space-y-2">
            {[
              { text: 'Atrage atenția vizuală asupra sectorului critic (de exemplu, cel mai mare consumator de fonduri sau economiile realizate) fără a altera proporțiile matematice', correct: true },
              { text: 'Șterge sectorul din calculul procentual total', correct: false },
              { text: 'Convertește numărul din sector într-o formulă logică IF', correct: false }
            ].map((opt, idx) => {
              const qId = 'd1_l5_q2';
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
          {isLocked('d1_l5_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l5_q2'] || 0} />
          )}
          {quizSubmitted['d1_l5_q2'] && (
            <AnswerExplanation explanation="Exact! Manual pag. 35: Explodarea unui sector reprezintă un procedeu stilistic pedagogic de accentuare vizuală a punctului de interes într-o prezentare." />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={quizDone}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel="Spre Nivelul 6: Diagnostic & Audit Diagrame Greșite"
      />
    </div>
  );
};
