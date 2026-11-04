import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  CloudRain,
  Sun,
  Thermometer,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface D1Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface MonthData {
  month: string;
  monthEn: string;
  temp: number; // °C
  precip: number; // mm
}

const CLIMATE_DATA: MonthData[] = [
  { month: 'Ian', monthEn: 'Jan', temp: -2.5, precip: 38 },
  { month: 'Feb', monthEn: 'Feb', temp: 0.2, precip: 32 },
  { month: 'Mar', monthEn: 'Mar', temp: 5.8, precip: 40 },
  { month: 'Apr', monthEn: 'Apr', temp: 11.5, precip: 52 },
  { month: 'Mai', monthEn: 'May', temp: 17.2, precip: 68 },
  { month: 'Iun', monthEn: 'Jun', temp: 21.0, precip: 85 },
  { month: 'Iul', monthEn: 'Jul', temp: 23.5, precip: 72 },
  { month: 'Aug', monthEn: 'Aug', temp: 22.8, precip: 55 },
  { month: 'Sep', monthEn: 'Sep', temp: 17.4, precip: 48 },
  { month: 'Oct', monthEn: 'Oct', temp: 11.0, precip: 42 },
  { month: 'Nov', monthEn: 'Nov', temp: 4.8, precip: 45 },
  { month: 'Dec', monthEn: 'Dec', temp: -0.8, precip: 40 },
];

export const D1Level4_GeographyClimateLab: React.FC<D1Level4Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const [viewMode, setViewMode] = useState<'combo' | 'tempOnly' | 'precipOnly'>('combo');
  const [highlightMonth, setHighlightMonth] = useState<string | null>('Iul');

  // Cooldown hook for reflection questions
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const maxTemp = Math.max(...CLIMATE_DATA.map(d => d.temp));
  const minTemp = Math.min(...CLIMATE_DATA.map(d => d.temp));
  const amplitude = Math.round((maxTemp - minTemp) * 10) / 10;
  const totalPrecip = CLIMATE_DATA.reduce((acc, d) => acc + d.precip, 0);

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

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Textbook 2025 • p. 33–34' : 'Manual Art Klett 2025 • Pag. 33–34'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Compass className="w-8 h-8 text-emerald-400" />
              {lang === 'en'
                ? 'Level 4: Interdisciplinary Geography & Climate Lab'
                : 'Nivelul 4: Laborator Interdisciplinar Geografie & Climă'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Build an official Walter & Lieth Climodiagram: combine the monthly temperature curve with precipitation bars and calculate Romania’s thermal amplitude.'
                : 'Construiește o Climodiagramă oficială (Walter & Lieth): îmbină curba temperaturilor lunare cu barele de precipitații și calculează amplitudinea termică a României.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Thermal Amplitude' : 'Amplitudine Termică'}
            </div>
            <div className="text-2xl font-black text-emerald-400">{amplitude}°C</div>
            <div className="text-[11px] text-slate-400">Tmax: {maxTemp}°C • Tmin: {minTemp}°C</div>
          </div>
        </div>
      </div>

      {/* Climodiagram Studio & Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'Climodiagram of Romania (Thermal Regime & Precipitation)'
                  : 'Climodiagrama României (Regim Termic & Precipitații)'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Combo Chart: Line for temperatures, Columns for precipitation'
                  : 'Diagramă combinată (Combo Chart): Linie pentru temperaturi, Coloane pentru precipitații'}
              </p>
            </div>
          </div>

          {/* View Mode Filters */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { sounds.playClick(); setViewMode('combo'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'combo' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Combo' : 'Combinată (Combo)'}
            </button>
            <button
              onClick={() => { sounds.playClick(); setViewMode('tempOnly'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'tempOnly' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Temperatures Only' : 'Doar Temperaturi'}
            </button>
            <button
              onClick={() => { sounds.playClick(); setViewMode('precipOnly'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'precipOnly' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Precipitation Only' : 'Doar Precipitații'}
            </button>
          </div>
        </div>

        {/* Climodiagram SVG Visualizer */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3 h-1 bg-rose-500 rounded"></span>{' '}
                {lang === 'en' ? 'Temperature (°C) - Primary Axis' : 'Temperatură (°C) - Axa Primară'}
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-3 bg-sky-500 rounded-sm"></span>{' '}
                {lang === 'en' ? 'Precipitation (mm) - Secondary Axis' : 'Precipitații (mm) - Axa Secundară'}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'en' ? `Annual total: ${totalPrecip} mm` : `Total anual: ${totalPrecip} mm`}
            </span>
          </div>

          <svg className="w-full h-64" viewBox="0 0 540 220">
            {/* Gridlines */}
            {[40, 80, 120, 160].map((y, idx) => (
              <line key={idx} x1="45" y1={y} x2="495" y2={y} stroke="#1e293b" strokeDasharray="3" />
            ))}

            {/* Primary Left Y Axis (Temperature) */}
            <line x1="45" y1="20" x2="45" y2="180" stroke="#475569" strokeWidth="2" />
            <text x="35" y="45" fill="#f43f5e" fontSize="10" textAnchor="end">30°C</text>
            <text x="35" y="85" fill="#f43f5e" fontSize="10" textAnchor="end">20°C</text>
            <text x="35" y="125" fill="#f43f5e" fontSize="10" textAnchor="end">10°C</text>
            <text x="35" y="165" fill="#f43f5e" fontSize="10" textAnchor="end">0°C</text>

            {/* Secondary Right Y Axis (Precipitation) */}
            <line x1="495" y1="20" x2="495" y2="180" stroke="#475569" strokeWidth="2" />
            <text x="505" y="45" fill="#38bdf8" fontSize="10">100 mm</text>
            <text x="505" y="85" fill="#38bdf8" fontSize="10">75 mm</text>
            <text x="505" y="125" fill="#38bdf8" fontSize="10">50 mm</text>
            <text x="505" y="165" fill="#38bdf8" fontSize="10">25 mm</text>

            {/* X Axis Base Line */}
            <line x1="45" y1="180" x2="495" y2="180" stroke="#475569" strokeWidth="2" />

            {/* Precipitații (Bars) */}
            {(viewMode === 'combo' || viewMode === 'precipOnly') &&
              CLIMATE_DATA.map((d, idx) => {
                const xPos = 65 + idx * 36;
                const barHeight = (d.precip / 100) * 140;
                const isSelected = highlightMonth === d.month;
                return (
                  <rect
                    key={d.month}
                    x={xPos}
                    y={180 - barHeight}
                    width="18"
                    height={barHeight}
                    rx="3"
                    fill={isSelected ? '#38bdf8' : '#0284c7'}
                    fillOpacity={isSelected ? 0.9 : 0.6}
                    onClick={() => { sounds.playClick(); setHighlightMonth(d.month); }}
                    className="cursor-pointer transition-all hover:opacity-100"
                  />
                );
              })}

            {/* Temperature Line */}
            {(viewMode === 'combo' || viewMode === 'tempOnly') && (
              <>
                {/* SVG Path for smooth temperature curve */}
                <path
                  d={CLIMATE_DATA.map((d, idx) => {
                    const x = 74 + idx * 36;
                    // Temp map: -10°C to 30°C mapped to 180 to 40
                    const y = 160 - ((d.temp + 2.5) / 32.5) * 120;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3"
                />

                {/* Data Points */}
                {CLIMATE_DATA.map((d, idx) => {
                  const x = 74 + idx * 36;
                  const y = 160 - ((d.temp + 2.5) / 32.5) * 120;
                  const isSelected = highlightMonth === d.month;
                  return (
                    <g key={d.month} onClick={() => { sounds.playClick(); setHighlightMonth(d.month); }} className="cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 6 : 4}
                        fill={isSelected ? '#fbbf24' : '#f43f5e'}
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                      {isSelected && (
                        <text x={x} y={y - 10} fill="#fde047" fontSize="10" textAnchor="middle" fontWeight="bold">
                          {d.temp}°C
                        </text>
                      )}
                    </g>
                  );
                })}
              </>
            )}

            {/* X Labels (Months) */}
            {CLIMATE_DATA.map((d, idx) => {
              const xPos = 74 + idx * 36;
              const isSelected = highlightMonth === d.month;
              return (
                <text
                  key={d.month}
                  x={xPos}
                  y="198"
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : '#94a3b8'}
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {lang === 'en' ? d.monthEn : d.month}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Selected Month Inspector Card */}
        {highlightMonth && (() => {
          const mData = CLIMATE_DATA.find(d => d.month === highlightMonth) || CLIMATE_DATA[0];
          return (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  {mData.temp >= 15 ? <Sun className="w-5 h-5" /> : <Thermometer className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'en' ? `Month ${mData.monthEn} — Climate Data` : `Luna ${mData.month} — Date Climatice`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en'
                      ? 'Click any other month on the chart to compare'
                      : 'Fă click pe oricare altă lună din diagramă pentru comparare'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 font-mono text-sm">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">
                    {lang === 'en' ? 'Average Temperature' : 'Temperatură Medie'}
                  </span>
                  <span className="font-bold text-rose-400">{mData.temp}°C</span>
                </div>
                <div className="text-right border-l border-slate-800 pl-4">
                  <span className="text-[10px] text-slate-400 uppercase block">
                    {lang === 'en' ? 'Precipitation' : 'Precipitații'}
                  </span>
                  <span className="font-bold text-sky-400">{mData.precip} mm</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Combined Charts (Combo Charts)'
                : 'Reflecție Pedagogică: Diagrame Combinate (Combo Charts)'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Art Klett Textbook p. 33–34: Interdisciplinary Geography-ICT analysis'
                : 'Manual Art Klett pag. 33–34: Analiză interdisciplinară Geografie-TIC'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en' ? (
              <>1. Why is a <span className="text-emerald-400 font-bold">Secondary Axis</span> required in a climodiagram showing both temperatures and precipitation?</>
            ) : (
              <>1. De ce este necesară o <span className="text-emerald-400 font-bold">axă secundară (Secondary Axis)</span> la o climodiagramă care conține atât temperaturi cât și precipitații?</>
            )}
          </div>
          <QuestionHint
            hintRo="Compară unitățile de măsură: grade Celsius (°C de la -5 la 25) vs milimetri (mm de la 30 la 100)."
            hintEn="Compare units of measurement: degrees Celsius (°C from -5 to 25) vs millimeters (mm from 30 to 100)."
          />
          <div className="space-y-2">
            {(lang === 'en' ? [
              { text: 'Because the two series have completely different units (°C vs mm) and different numerical scales; a single axis would flatten the temperature curve into illegibility', correct: true },
              { text: 'To fill both borders of the display purely for decorative flair', correct: false },
              { text: 'Excel strictly prevents line rendering without a secondary axis enabled', correct: false }
            ] : [
              { text: 'Deoarece cele două serii au unități de măsură complet diferite (°C vs mm) și scări numerice diferite; o singură axă ar face curba temperaturilor aproape plată și ilizibilă', correct: true },
              { text: 'Pentru a ocupa ambele margini ale ecranului din motive decorative', correct: false },
              { text: 'Excel nu permite trasarea de linii fără axă secundară', correct: false }
            ]).map((opt, idx) => {
              const qId = 'd1_l4_q1';
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
          {isLocked('d1_l4_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l4_q1'] || 0} />
          )}
          {quizSubmitted['d1_l4_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Curriculum p. 34: When combining heterogeneous metrics (degrees Celsius on the left vs millimeters on the right), enabling a Secondary Axis ensures balanced proportional visualization for both variables.'
                : 'Corect! Manual pag. 34: Când combinăm mărimi eterogene (grade Celsius pe stânga și milimetri de coloană de apă pe dreapta), activarea axei secundare (Secondary Axis) asigură proporționalitatea corectă a ambelor reprezentări.'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. How is the annual thermal amplitude formula constructed using cells in an Excel spreadsheet?'
              : '2. Cum se calculează formula amplitudinii termice anuale folosind celulele dintr-un tabel Excel?'}
          </div>
          <QuestionHint
            hintRo="Amplitudinea termică este diferența dintre temperatura maximă a anului și temperatura minimă a anului."
            hintEn="Thermal amplitude is the difference between maximum annual temperature and minimum annual temperature."
          />
          <div className="space-y-2">
            {[
              { text: '=MAX(B2:B13) - MIN(B2:B13)', correct: true },
              { text: '=AVERAGE(B2:B13) / 2', correct: false },
              { text: '=SUM(B2:B13) * COUNT(B2:B13)', correct: false }
            ].map((opt, idx) => {
              const qId = 'd1_l4_q2';
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
          {isLocked('d1_l4_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l4_q2'] || 0} />
          )}
          {quizSubmitted['d1_l4_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Excellent! Thermal amplitude = maximum temperature minus minimum temperature. In Excel we combine both functions: =MAX(range) - MIN(range).'
                : 'Excelent! Amplitudinea termică = valoarea maximă a temperaturii minus valoarea minimă a temperaturii. În Excel se obține combinând cele două funcții: =MAX(interval) - MIN(interval).'}
            />
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
        nextLabel={lang === 'en' ? 'To Level 5: Family Budget Lab (Pie Chart)' : 'Spre Nivelul 5: Laborator Bugetul Familial (Pie Chart)'}
      />
    </div>
  );
};
