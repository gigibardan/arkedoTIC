import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Lightbulb,
  Check,
  ChevronRight,
  Mountain,
  HelpCircle,
  Thermometer,
  BarChart3
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface MountainPeak {
  name: string;
  altitude: number; // meters
}

const CARPATHIAN_PEAKS: MountainPeak[] = [
  { name: 'Moldoveanu', altitude: 2544 },
  { name: 'Negoiu', altitude: 2535 },
  { name: 'Parângu Mare', altitude: 2519 },
  { name: 'Peleaga (Retezat)', altitude: 2509 },
  { name: 'Vârful Omu (Bucegi)', altitude: 2505 }
];

export const StemLevel6_GeographyStatsLab: React.FC<Props> = ({ onPass }) => {
  // Geography Orographic State
  const [selectedPeaks, setSelectedPeaks] = useState<MountainPeak[]>(CARPATHIAN_PEAKS);
  const [tMin, setTMin] = useState<number>(-12); // °C iarna
  const [tMax, setTMax] = useState<number>(28);  // °C vara

  // Calculations
  const altSum = selectedPeaks.reduce((acc, p) => acc + p.altitude, 0);
  const altAvg = Number((altSum / selectedPeaks.length).toFixed(1));
  const thermalAmplitude = tMax - tMin;

  // Challenges
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  const CHALLENGES = [
    {
      question: 'Cum se calculează corect media aritmetică a n altitudini citite de la tastatură în C++?',
      code: 'double suma = 0;\nfor (int i = 1; i <= n; i++) {\n    cin >> h;\n    suma = suma + h;\n}\ndouble media = ???;',
      options: [
        { label: 'double media = suma / n;', correct: true },
        { label: 'double media = suma * n;', correct: false },
        { label: 'double media = n / suma;', correct: false },
        { label: 'double media = suma - n;', correct: false }
      ],
      explanation: 'Media aritmetică este suma tuturor elementelor împărțită la numărul total de elemente: media = suma / n!'
    },
    {
      question: 'Dacă temperatura minimă înregistrată iarna la Vârful Omu este de -15°C, iar maxima vara este de +22°C, cât este amplitudinea termică?',
      code: '// Formula: Amplitudinea = T_max - T_min;\n// T_max = 22;\n// T_min = -15;',
      options: [
        { label: '37°C (deoarece 22 - (-15) = 22 + 15 = 37)', correct: true },
        { label: '7°C (22 - 15)', correct: false },
        { label: '-37°C', correct: false },
        { label: '15°C', correct: false }
      ],
      explanation: 'Amplitudinea termică reprezintă ecartul de temperatură: Tmax - Tmin = 22 - (-15) = 22 + 15 = 37°C!'
    },
    {
      question: 'De ce inițializăm variabila suma cu 0 înainte de începerea buclei for?',
      code: 'double suma = 0; // Obligatoriu!',
      options: [
        { label: 'Pentru că 0 este element neutru la adunare și garantează pornirea fără resturi din memoria RAM', correct: true },
        { label: 'Pentru că C++ nu permite declararea variabilelor fără 0', correct: false },
        { label: 'Pentru a opri bucla for', correct: false },
        { label: 'Este o simplă convenție vizuală', correct: false }
      ],
      explanation: 'Dacă nu inițializăm suma = 0, variabila va conține o valoare reziduală aleatorie din memoria RAM, iar rezultatul calculat va fi complet eronat!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const isCorrect = CHALLENGES[qIdx].options[optIdx].correct;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback('Corect! ' + CHALLENGES[qIdx].explanation);
    } else {
      sounds.playWrong();
      setChallengeFeedback('Incorect. ' + CHALLENGES[qIdx].explanation);
    }
  };

  const handleNextChallenge = () => {
    sounds.playClick();
    setChallengeFeedback(null);
    if (challengeStep < CHALLENGES.length - 1) {
      setChallengeStep(prev => prev + 1);
    } else {
      setCompletedChallenge(true);
      sounds.playSuccess();
    }
  };

  const handleFinishLevel = () => {
    sounds.playSuccess();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 mb-2">
              <Mountain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nivelul 6 din 7 • Modulul 4E</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Laboratorul STEM de Geografie: Altitudini &amp; Climatologie (Manual pag. 100–102)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Programează algoritmi de analiză statistică teritorială: calculul altitudinii medii a Carpaților Românești și determinarea amplitudinii termice anuale.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>+15 XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Educational Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-emerald-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <span>Statistici Geografice în C++: Profilul Orografic &amp; Amplitudinea Termică</span>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Vârfuri Măsurate</span>
            <span className="text-xl font-black font-mono text-white">{selectedPeaks.length} Vârfuri</span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">Munții Carpați</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Altitudine Medie</span>
            <span className="text-xl font-black font-mono text-emerald-300">{altAvg} m</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Suma = {altSum} m</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Amplitudine Termică</span>
            <span className="text-xl font-black font-mono text-cyan-300">{thermalAmplitude}°C</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              {tMin}°C (iarna) ... +{tMax}°C (vara)
            </span>
          </div>
        </div>

        {/* Interactive Orographic Skyline Chart */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Profilul Orografic al Celor 5 Mari Vârfuri din România</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Valori oficiale din manualul de geografie și informatică (Art Klett pag. 101).
              </p>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="bg-gradient-to-t from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-4">
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 border-b-2 border-emerald-500/40 pb-2">
              {selectedPeaks.map((peak, idx) => {
                const heightPercent = ((peak.altitude - 2400) / (2560 - 2400)) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-300 mb-1 group-hover:text-amber-300 transition-colors">
                      {peak.altitude} m
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl group-hover:from-amber-600 group-hover:to-amber-400 transition-all duration-300 shadow-lg shadow-emerald-600/20"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] sm:text-[11px] font-mono text-slate-400 mt-2 text-center truncate max-w-full">
                      {peak.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mean Line indicator */}
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                <span>Altitudine Medie Calculată: <strong>{altAvg} m</strong></span>
              </span>
              <span className="text-slate-500">Baza Carpaților (&gt; 2400 m)</span>
            </div>
          </div>

          {/* Thermal Slider Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl mb-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Temperatură Minimă Iarna (T_min):</span>
                </span>
                <span className="text-cyan-300 font-bold">{tMin}°C</span>
              </div>
              <input
                type="range"
                min="-25"
                max="0"
                step="1"
                value={tMin}
                onChange={(e) => setTMin(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  <span>Temperatură Maximă Vara (T_max):</span>
                </span>
                <span className="text-rose-300 font-bold">+{tMax}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="40"
                step="1"
                value={tMax}
                onChange={(e) => setTMax(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>

          {/* C++ Source Code Box */}
          <div className="bg-black/90 border border-slate-800 p-3.5 rounded-xl font-mono text-xs text-slate-300">
            <span className="text-slate-500 block mb-1">// Algoritm C++ Climatologie &amp; Geografie:</span>
            <div><span className="text-purple-400 font-bold">double</span> suma_altitudini = {altSum};</div>
            <div><span className="text-purple-400 font-bold">double</span> altitudine_medie = suma_altitudini / {selectedPeaks.length}; <span className="text-slate-500">// {altAvg} m</span></div>
            <div><span className="text-purple-400 font-bold">double</span> amp_termica = {tMax} - ({tMin}); <span className="text-slate-500">// {thermalAmplitude}°C</span></div>
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Verificare Înțelegere: Geografie în C++ ({challengeStep + 1} din {CHALLENGES.length})</span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {CHALLENGES[challengeStep].question}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-emerald-300 whitespace-pre">
                  {CHALLENGES[challengeStep].code}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {CHALLENGES[challengeStep].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[challengeStep] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(challengeStep, oIdx)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? opt.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        opt.correct ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {challengeFeedback && (
                <div className={`p-3 rounded-xl text-xs border ${challengeFeedback.startsWith('Corect') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                  {challengeFeedback}
                </div>
              )}

              {selectedAnswers[challengeStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="self-end py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{challengeStep < CHALLENGES.length - 1 ? 'Următoarea Întrebare' : 'Finalizează Nivelul 6'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">Nivelul 6 Finalizat cu Succes!</h4>
              <p className="text-xs text-slate-300 max-w-md">
                Ai calculat corect mediile altitudinilor și amplitudinea termică în C++, demonstrând puterea gândirii computaționale aplicate în științele naturii.
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>Treci la Nivelul 7: Evaluarea Finală &amp; Diploma Oficială</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
