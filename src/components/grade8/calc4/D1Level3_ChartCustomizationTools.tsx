import React, { useState } from 'react';
import {
  Palette,
  Shuffle,
  BarChart2,
  Table,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Sliders,
  Layers,
  Layout,
  RefreshCw
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface D1Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const D1Level3_ChartCustomizationTools: React.FC<D1Level3Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  // Chart Design State
  const [swappedAxes, setSwappedAxes] = useState(false); // Switch Row/Column
  const [chartSubtype, setChartSubtype] = useState<'grouped' | 'stacked'>('grouped');
  const [colorPalette, setColorPalette] = useState<'blue-amber' | 'emerald-teal' | 'purple-rose'>('blue-amber');
  const [showDataTable, setShowDataTable] = useState(false);
  const [testedTools, setTestedTools] = useState<string[]>([]);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const trackTool = (toolName: string) => {
    if (!testedTools.includes(toolName)) {
      setTestedTools(prev => [...prev, toolName]);
    }
  };

  const handleToggleSwap = () => {
    sounds.playClick();
    setSwappedAxes(!swappedAxes);
    trackTool('switch_row_col');
  };

  const handleToggleSubtype = () => {
    sounds.playClick();
    setChartSubtype(prev => prev === 'grouped' ? 'stacked' : 'grouped');
    trackTool('change_subtype');
  };

  const handleChangePalette = (pal: 'blue-amber' | 'emerald-teal' | 'purple-rose') => {
    sounds.playClick();
    setColorPalette(pal);
    trackTool('change_color');
  };

  const handleToggleDataTable = () => {
    sounds.playClick();
    setShowDataTable(!showDataTable);
    trackTool('data_table');
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

  const paletteColors = {
    'blue-amber': { s1: '#0284c7', s2: '#f59e0b', text1: '#38bdf8', text2: '#fbbf24' },
    'emerald-teal': { s1: '#059669', s2: '#0d9488', text1: '#34d399', text2: '#2dd4bf' },
    'purple-rose': { s1: '#7c3aed', s2: '#e11d48', text1: '#a78bfa', text2: '#fb7185' }
  }[colorPalette];

  const toolsDone = testedTools.length >= 3;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = toolsDone && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950/70 via-indigo-950/40 to-slate-900 border border-violet-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Textbook 2025 • p. 32–33' : 'Manual Art Klett 2025 • Pag. 32–33'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Sliders className="w-8 h-8 text-violet-400" />
              {lang === 'en'
                ? 'Level 3: Design & Formatting Tools (Chart Design)'
                : 'Nivelul 3: Instrumente de Proiectare & Formatare (Chart Design)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Discover the contextual Chart Design tab: switch rows and columns, select clustered or stacked layouts, and apply harmonious palettes.'
                : 'Descoperă magia tab-ului contextual Proiectare diagramă: comută rândurile cu coloanele, alege coloane grupate sau stivuite și aplică palete cromatice armonioase.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-violet-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Tested Tools' : 'Instrumente Testate'}
            </div>
            <div className="text-2xl font-black text-violet-400">{testedTools.length}/4</div>
            <div className="text-[11px] text-slate-400">{lang === 'en' ? 'Ribbon Features' : 'Funcții Ribbon'}</div>
          </div>
        </div>
      </div>

      {/* Ribbon Toolbar Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-wider">
              <Layout className="w-4 h-4" /> {lang === 'en' ? 'Chart Tools • Chart Design Tab' : 'Instrumente Diagramă • Tab-ul Proiectare (Chart Design)'}
            </div>
            <span className="text-[11px] text-slate-400">{lang === 'en' ? 'Curriculum p. 32' : 'Manual pag. 32'}</span>
          </div>
        </div>

        {/* Ribbon Control Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Tool 1: Switch Row/Column */}
          <button
            onClick={handleToggleSwap}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
              swappedAxes
                ? 'border-violet-500 bg-violet-500/15 text-violet-200 ring-2 ring-violet-500/20'
                : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Shuffle className="w-5 h-5 text-violet-400" />
              {testedTools.includes('switch_row_col') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div>
              <div className="text-xs font-bold">
                {lang === 'en' ? 'Switch Row/Column' : 'Comutare Rând/Coloană'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {swappedAxes
                  ? (lang === 'en' ? 'Mode: Products on X-axis' : 'Mod: Produse pe axa X')
                  : (lang === 'en' ? 'Mode: Quarters on X-axis' : 'Mod: Trimestre pe axa X')}
              </div>
            </div>
          </button>

          {/* Tool 2: Grouped vs Stacked */}
          <button
            onClick={handleToggleSubtype}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
              chartSubtype === 'stacked'
                ? 'border-violet-500 bg-violet-500/15 text-violet-200 ring-2 ring-violet-500/20'
                : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <BarChart2 className="w-5 h-5 text-sky-400" />
              {testedTools.includes('change_subtype') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div>
              <div className="text-xs font-bold">
                {lang === 'en'
                  ? `Type: ${chartSubtype === 'grouped' ? 'Clustered' : 'Stacked'}`
                  : `Tip: ${chartSubtype === 'grouped' ? 'Grupate (Clustered)' : 'Stivuite (Stacked)'}`}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'en' ? 'Click to switch layout' : 'Click pentru a schimba'}
              </div>
            </div>
          </button>

          {/* Tool 3: Color Palette */}
          <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/70 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <Palette className="w-5 h-5 text-amber-400" />
              {testedTools.includes('change_color') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300 mb-1">
                {lang === 'en' ? 'Color Palette' : 'Paletă Cromatică'}
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'blue-amber', c1: '#0284c7', c2: '#f59e0b' },
                  { id: 'emerald-teal', c1: '#059669', c2: '#0d9488' },
                  { id: 'purple-rose', c1: '#7c3aed', c2: '#e11d48' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleChangePalette(p.id as any)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-transform ${
                      colorPalette === p.id ? 'scale-110 border-white ring-2 ring-violet-400' : 'border-transparent'
                    }`}
                  >
                    <span className="w-2.5 h-5 rounded-l-full" style={{ backgroundColor: p.c1 }}></span>
                    <span className="w-2.5 h-5 rounded-r-full" style={{ backgroundColor: p.c2 }}></span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tool 4: Data Table Toggle */}
          <button
            onClick={handleToggleDataTable}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
              showDataTable
                ? 'border-violet-500 bg-violet-500/15 text-violet-200 ring-2 ring-violet-500/20'
                : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Table className="w-5 h-5 text-emerald-400" />
              {testedTools.includes('data_table') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div>
              <div className="text-xs font-bold">
                {lang === 'en' ? 'Data Table Below Chart' : 'Tabel de Date Sub Diagramă'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {showDataTable
                  ? (lang === 'en' ? 'Enabled (Shown)' : 'Activat (Afișat)')
                  : (lang === 'en' ? 'Disabled' : 'Dezactivat')}
              </div>
            </div>
          </button>
        </div>

        {/* Live Customized Diagram Visualizer */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="text-center mb-3">
            <h3 className="text-sm font-bold text-white">
              {lang === 'en'
                ? 'Tech Products Sales (Quarter 1 vs Quarter 2)'
                : 'Vânzări Produse Tehnologice (Trimestrul 1 vs Trimestrul 2)'}
            </h3>
            <span className="text-[11px] text-slate-400">
              {swappedAxes
                ? (lang === 'en' ? 'Perspective: Grouped by Products' : 'Perspectivă: Grupate pe Produse')
                : (lang === 'en' ? 'Perspective: Grouped by Quarters' : 'Perspectivă: Grupate pe Trimestre')}
            </span>
          </div>

          <svg className="w-full h-56" viewBox="0 0 500 200">
            {/* Gridlines */}
            <line x1="50" y1="30" x2="460" y2="30" stroke="#1e293b" strokeDasharray="3" />
            <line x1="50" y1="75" x2="460" y2="75" stroke="#1e293b" strokeDasharray="3" />
            <line x1="50" y1="120" x2="460" y2="120" stroke="#1e293b" strokeDasharray="3" />
            <line x1="50" y1="165" x2="460" y2="165" stroke="#334155" strokeWidth="2" />
            <line x1="50" y1="30" x2="50" y2="165" stroke="#334155" strokeWidth="2" />

            {/* Y Scale */}
            <text x="40" y="35" fill="#64748b" fontSize="10" textAnchor="end">150</text>
            <text x="40" y="80" fill="#64748b" fontSize="10" textAnchor="end">100</text>
            <text x="40" y="125" fill="#64748b" fontSize="10" textAnchor="end">50</text>
            <text x="40" y="168" fill="#64748b" fontSize="10" textAnchor="end">0</text>

            {/* Render Bars based on Switch Row/Col state */}
            {!swappedAxes ? (
              // Perspective A: Categories = Trimestru 1, Trimestru 2, Trimestru 3
              [
                { cat: lang === 'en' ? 'Quarter 1' : 'Trimestrul 1', v1: 70, v2: 45, x: 90 },
                { cat: lang === 'en' ? 'Quarter 2' : 'Trimestrul 2', v1: 95, v2: 60, x: 220 },
                { cat: lang === 'en' ? 'Quarter 3' : 'Trimestrul 3', v1: 120, v2: 85, x: 350 },
              ].map((item, idx) => {
                if (chartSubtype === 'grouped') {
                  return (
                    <g key={idx}>
                      <rect x={item.x} y={165 - item.v1} width="28" height={item.v1} rx="3" fill={paletteColors.s1} />
                      <rect x={item.x + 32} y={165 - item.v2} width="28" height={item.v2} rx="3" fill={paletteColors.s2} />
                      <text x={item.x + 30} y="182" fill="#cbd5e1" fontSize="11" textAnchor="middle" fontWeight="semibold">
                        {item.cat}
                      </text>
                    </g>
                  );
                } else {
                  // Stacked
                  return (
                    <g key={idx}>
                      <rect x={item.x + 10} y={165 - item.v1} width="40" height={item.v1} rx="3" fill={paletteColors.s1} />
                      <rect x={item.x + 10} y={165 - item.v1 - item.v2} width="40" height={item.v2} rx="3" fill={paletteColors.s2} />
                      <text x={item.x + 30} y="182" fill="#cbd5e1" fontSize="11" textAnchor="middle" fontWeight="semibold">
                        {item.cat}
                      </text>
                    </g>
                  );
                }
              })
            ) : (
              // Perspective B: Categories = Laptopuri, Tablete
              [
                { cat: lang === 'en' ? 'Laptops' : 'Laptopuri', v1: 70, v2: 95, v3: 120, x: 120 },
                { cat: lang === 'en' ? 'Tablets' : 'Tablete', v1: 45, v2: 60, v3: 85, x: 290 },
              ].map((item, idx) => (
                <g key={idx}>
                  <rect x={item.x} y={165 - item.v1} width="24" height={item.v1} rx="3" fill={paletteColors.s1} />
                  <rect x={item.x + 28} y={165 - item.v2} width="24" height={item.v2} rx="3" fill={paletteColors.s2} />
                  <text x={item.x + 26} y="182" fill="#cbd5e1" fontSize="11" textAnchor="middle" fontWeight="semibold">
                    {item.cat}
                  </text>
                </g>
              ))
            )}

            {/* Legend */}
            <g>
              <rect x="340" y="5" width="12" height="12" rx="2" fill={paletteColors.s1} />
              <text x="358" y="15" fill="#cbd5e1" fontSize="10">
                {swappedAxes
                  ? (lang === 'en' ? 'Quarter 1' : 'Trimestru 1')
                  : (lang === 'en' ? 'Laptops' : 'Laptopuri')}
              </text>
              <rect x="420" y="5" width="12" height="12" rx="2" fill={paletteColors.s2} />
              <text x="438" y="15" fill="#cbd5e1" fontSize="10">
                {swappedAxes
                  ? (lang === 'en' ? 'Quarter 2' : 'Trimestru 2')
                  : (lang === 'en' ? 'Tablets' : 'Tablete')}
              </text>
            </g>
          </svg>

          {/* Embedded Data Table */}
          {showDataTable && (
            <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
              <table className="w-full text-center">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="p-2 border-r border-slate-800 text-left">
                      {lang === 'en' ? 'Series / Category' : 'Serie / Categorie'}
                    </th>
                    <th className="p-2 border-r border-slate-800">{lang === 'en' ? 'Quarter 1' : 'Trimestrul 1'}</th>
                    <th className="p-2 border-r border-slate-800">{lang === 'en' ? 'Quarter 2' : 'Trimestrul 2'}</th>
                    <th className="p-2">{lang === 'en' ? 'Quarter 3' : 'Trimestrul 3'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950 text-slate-200">
                  <tr>
                    <td className="p-2 border-r border-slate-800 text-left font-bold" style={{ color: paletteColors.text1 }}>
                      {lang === 'en' ? 'Laptops' : 'Laptopuri'}
                    </td>
                    <td className="p-2 border-r border-slate-800">{lang === 'en' ? '70 pcs' : '70 buc'}</td>
                    <td className="p-2 border-r border-slate-800">{lang === 'en' ? '95 pcs' : '95 buc'}</td>
                    <td className="p-2">{lang === 'en' ? '120 pcs' : '120 buc'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-800 text-left font-bold" style={{ color: paletteColors.text2 }}>
                      {lang === 'en' ? 'Tablets' : 'Tablete'}
                    </td>
                    <td className="p-2 border-r border-slate-800">{lang === 'en' ? '45 pcs' : '45 buc'}</td>
                    <td className="p-2 border-r border-slate-800">{lang === 'en' ? '60 pcs' : '60 buc'}</td>
                    <td className="p-2">{lang === 'en' ? '85 pcs' : '85 buc'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Axis Manipulation & Formatting Options'
                : 'Reflecție Pedagogică: Manipularea Axelor & Opțiuni de Formatare'}
            </h2>
            <p className="text-xs text-slate-400">{lang === 'en' ? 'Art Klett Textbook p. 32–33' : 'Manual Art Klett pag. 32–33'}</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en' ? (
              <>1. What is the effect of the <span className="text-violet-300 font-bold">"Switch Row/Column"</span> command in the Chart Design tab?</>
            ) : (
              <>1. Ce efect produce comanda <span className="text-violet-300 font-bold">„Comutare rând/coloană” (Switch Row/Column)</span> din tab-ul Proiectare diagramă?</>
            )}
          </div>
          <QuestionHint
            hintRo="Observă ce se întâmplă cu elementele de pe axa orizontală X și cu seriile din legendă."
            hintEn="Notice what happens to the items on horizontal X-axis and the series listed in the legend."
          />
          <div className="space-y-2">
            {(lang === 'en' ? [
              { text: 'Inverts the data between category X-axis and legend series, providing a fresh analytical perspective without modifying the original cell grid', correct: true },
              { text: 'Deletes all numbers in the sheet and replaces them with zeros', correct: false },
              { text: 'Instantly turns vertical columns into a pie chart', correct: false }
            ] : [
              { text: 'Inversează datele de pe axa categoriilor X cu seriile din legendă, oferind o nouă perspectivă de analiză fără a modifica tabelul original de celule', correct: true },
              { text: 'Șterge toate numerele din foaie și le înlocuiește cu zero', correct: false },
              { text: 'Transformă instant coloanele verticale într-o diagramă circulară', correct: false }
            ]).map((opt, idx) => {
              const qId = 'd1_l3_q1';
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
          {isLocked('d1_l3_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l3_q1'] || 0} />
          )}
          {quizSubmitted['d1_l3_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Curriculum p. 32: Switch Row/Column toggles row series into column series on the graphic axes. This allows rapid inspection of trends by quarters or product comparisons.'
                : 'Corect! Manual pag. 32: Switch Row/Column transferă datele din linii în coloane pe axa reprezentării grafice. Acest lucru permite observarea rapidă fie a evoluției pe trimestre, fie a comparației între produse.'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en' ? (
              <>2. When is a <span className="text-violet-300 font-bold">Stacked Column</span> chart beneficial compared to Clustered Columns?</>
            ) : (
              <>2. Când este utilă o diagramă cu <span className="text-violet-300 font-bold">Coloane Stivuite (Stacked Column)</span> față de Coloane Grupate (Clustered Column)?</>
            )}
          </div>
          <QuestionHint
            hintRo="La coloanele stivuite, valorile se adună una peste alta formând o singură coloană înaltă."
            hintEn="In stacked columns, values are added on top of each other forming a combined column height."
          />
          <div className="space-y-2">
            {(lang === 'en' ? [
              { text: 'When we wish to emphasize both the cumulative total of a category and the relative contribution of each component part', correct: true },
              { text: 'Only when all values are negative numbers', correct: false },
              { text: 'Never recommended because bars overlap and mask each other', correct: false }
            ] : [
              { text: 'Când dorim să evidențiem simultan atât totalul cumulat al categoriei, cât și contribuția relativă a fiecărui element component', correct: true },
              { text: 'Doar când valorile sunt toate negative', correct: false },
              { text: 'Nu se recomandă niciodată deoarece barele se suprapun și maschează datele', correct: false }
            ]).map((opt, idx) => {
              const qId = 'd1_l3_q2';
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
          {isLocked('d1_l3_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l3_q2'] || 0} />
          )}
          {quizSubmitted['d1_l3_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exactly! Curriculum p. 33: Stacked Column charts convey the overall sum via total column height while colored segments display individual contribution shares.'
                : 'Exact! Manual pag. 33: Diagramele stivuite (Stacked) arată totalul general prin înălțimea completă a barei, iar segmentele colorate arată ponderea fiecărei componente.'}
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
        nextLabel={lang === 'en' ? 'To Level 4: Interdisciplinary Geography & Climate Lab' : 'Spre Nivelul 4: Laborator Interdisciplinar Geografie & Climă'}
      />
    </div>
  );
};
