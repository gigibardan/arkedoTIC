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
  Radio,
  HelpCircle,
  ShieldAlert,
  Gauge
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

export const RobotLevel3_UltrasonicDistanceSensor: React.FC<Props> = ({ onPass }) => {
  const [obstacleDistance, setObstacleDistance] = useState<number>(35); // cm
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  // Challenge State
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  // Time in microseconds for round trip (sound speed ~340 m/s = 0.034 cm/us)
  // t = 2 * d / 0.034 = d * 58.82 us
  const flightTimeUs = Math.round(obstacleDistance * 58.82);

  const getStatus = (dist: number) => {
    if (dist <= 4) {
      return {
        label: 'PERICOL: ZONĂ OARBĂ (Sub 4 cm)',
        desc: 'Undele sonore se întorc prea rapid pentru a fi măsurate corect de microcontroler.',
        color: 'text-rose-400 bg-rose-950/60 border-rose-500/50'
      };
    }
    if (dist <= 20) {
      return {
        label: 'OPRIRE DE URGENȚĂ & VIRAJ (≤ 20 cm)',
        desc: 'Robotul oprește motoarele de înaintare și virează la 90° pentru a evita ciocnirea.',
        color: 'text-amber-300 bg-amber-950/60 border-amber-500/50'
      };
    }
    return {
      label: 'CALE LIBERĂ & AVANSARE (> 20 cm)',
      desc: 'Niciun obstacol în raza de siguranță. Motoarele rulează înainte cu viteză normală.',
      color: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/50'
    };
  };

  const status = getStatus(obstacleDistance);

  const handleSendPing = () => {
    sounds.playClick();
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
      sounds.playCorrect();
    }, 600);
  };

  const CHALLENGES = [
    {
      question: 'De ce împărțim la 2 timpul măsurat de senzorul ultrasonic pentru a calcula distanța?',
      code: '// Formula: distanta = (viteza_sunet * timp) / 2;',
      options: [
        { label: 'Pentru că unda sonoră parcurge distanța dus-întors (merge până la perete și se întoarce la receptor)', correct: true },
        { label: 'Pentru că senzorul are 2 ochi (emițător și receptor)', correct: false },
        { label: 'Pentru că viteza sunetului se dublează în interiorul clasei', correct: false },
        { label: 'Este o constantă matematică fără legătură cu traseul sunetului', correct: false }
      ],
      explanation: 'Unda sonoră pleacă de la emițător, atinge obstacolul și se reflectă înapoi la receptor, parcurgând distanța de două ori (dus-întors)!'
    },
    {
      question: 'Ce este „Zona Oarbă” (Blind Zone) a unui senzor ultrasonic (pag. 105)?',
      code: null,
      options: [
        { label: 'Zona extrem de apropiată (sub 3-4 cm) unde unda se întoarce înainte ca senzorul să apuce să asculte ecoul', correct: true },
        { label: 'O zonă în care senzorul se oprește când este întuneric în cameră', correct: false },
        { label: 'Distanța mai mare de 10 kilometri', correct: false },
        { label: 'Zona din spatele robotului', correct: false }
      ],
      explanation: 'La distanțe sub 3-4 cm, ecoul se întoarce înainte ca pinul de emisie să termine semnalul, făcând măsurarea imposibilă sau eronată.'
    },
    {
      question: 'Care este pragul de distanță minim recomandat în manual pentru oprirea în siguranță a robotului?',
      code: 'if (robot.citesteUltrasonic() <= ???) {\n    robot.stop();\n    robot.vireazaDreapta(90);\n}',
      options: [
        { label: '20 cm (pentru a asigura spațiu de frânare și manevră fără coliziune)', correct: true },
        { label: '0 cm (să atingă peretele mai întâi)', correct: false },
        { label: '500 cm (5 metri)', correct: false },
        { label: '1 mm', correct: false }
      ],
      explanation: 'La 20 cm robotul are spațiu suficient pentru a reduce inerția mecanică a motoarelor și a vira fără riscul de a lovi peretele!'
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
      <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-slate-900 p-6 rounded-3xl border border-blue-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/30 mb-2">
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <span>Nivelul 3 din 7 • Modulul 4F</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Senzorul Ultrasonic de Distanță &amp; Evitarea Obstacolelor (Manual pag. 105)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Înțelege principiul ecolocației: emisia undei sonore la 40 kHz, recepția ecoului reflectat, calculul distanței în centimetri și stabilirea pragului critic de frânare la 20 cm.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>+15 XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Educational Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-cyan-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          <span>Fizica Sonarului: Distanța = (Viteza Sunetului × Timp) / 2</span>
        </div>

        {/* Interactive Ultrasonic Caliper Simulator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Bancul de Testare Ultrasonică (0 – 100 cm)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Deplasează peretele din glisor pentru a observa timpul de zbor al ecoului și reacția de control.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendPing}
              className="py-1.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Emite Impuls (Ping)</span>
            </button>
          </div>

          {/* Graphical Acoustic Chamber */}
          <div className="relative bg-black/90 border border-slate-800 rounded-2xl p-6 mb-5 h-44 flex flex-col justify-between overflow-hidden">
            {/* Robot with ultrasonic sensor on left */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 flex flex-col items-center">
              <div className="w-16 h-14 rounded-2xl bg-slate-800 border-2 border-cyan-400 flex items-center justify-center gap-1.5 text-2xl shadow-xl relative">
                <div className="w-4 h-4 rounded-full bg-slate-950 border border-cyan-400 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </div>
                <div className="w-4 h-4 rounded-full bg-slate-950 border border-cyan-400 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 mt-1">Senzor HC-SR04</span>
            </div>

            {/* Ultrasonic Waves Animation (concentric arcs) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 left-24 transition-all duration-300 pointer-events-none flex items-center"
              style={{ width: `${obstacleDistance * 2.8}px` }}
            >
              <div className={`w-full border-b border-dashed border-cyan-400/50 relative flex items-center justify-center ${isPulsing ? 'animate-pulse' : ''}`}>
                <span className="absolute text-cyan-300 text-xs font-mono -top-5 bg-slate-950/90 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  🔊 {obstacleDistance} cm ({flightTimeUs} μs)
                </span>
                {isPulsing && (
                  <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full animate-ping" />
                )}
              </div>
            </div>

            {/* Obstacle Wall on slider distance */}
            <div
              className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-150 flex flex-col items-center"
              style={{ left: `calc(100px + ${obstacleDistance * 2.8}px)` }}
            >
              <div className="w-6 h-28 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 border-2 border-amber-400 rounded-lg shadow-2xl flex items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-amber-200 rotate-90 select-none">
                  PERETE
                </span>
              </div>
            </div>

            {/* Scale Line */}
            <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              <span>0 cm</span>
              <span className="text-rose-400">4 cm (Oarbă)</span>
              <span className="text-amber-400">20 cm (Prag Stop)</span>
              <span>50 cm</span>
              <span>100 cm</span>
            </div>
          </div>

          {/* Distance Caliper Slider */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl mb-4">
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="font-bold">Reglează Distanța până la Obstacol:</span>
              <strong className="text-cyan-300 text-sm">{obstacleDistance} cm</strong>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              step="1"
              value={obstacleDistance}
              onChange={(e) => setObstacleDistance(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2"
            />
          </div>

          {/* Dynamic Diagnostic & Code Alert */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border text-xs flex flex-col justify-between ${status.color}`}>
              <div>
                <span className="font-bold text-xs uppercase font-mono block mb-1">
                  {status.label}
                </span>
                <p className="leading-relaxed text-[11px]">
                  {status.desc}
                </p>
              </div>
              <div className="mt-2 text-[10px] font-mono opacity-80">
                Timp dus-întors ecou: <strong>{flightTimeUs} microsecunde (μs)</strong>
              </div>
            </div>

            <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300">
              <span className="text-slate-500 block mb-1">// Reacția C++ a robotului:</span>
              <div><span className="text-purple-400 font-bold">int</span> dist = robot.citesteUltrasonic(); <span className="text-slate-500">// {obstacleDistance} cm</span></div>
              <div className="mt-1"><span className="text-purple-400 font-bold">if</span> (dist &lt;= 20) &#123;</div>
              <div className="pl-4 text-rose-300">robot.opresteMotoare();</div>
              <div className="pl-4 text-amber-300">robot.vireazaDreapta(90);</div>
              <div>&#125; <span className="text-purple-400 font-bold">else</span> &#123;</div>
              <div className="pl-4 text-emerald-300">robot.inainte(100);</div>
              <div>&#125;</div>
            </div>
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Verificare Înțelegere: Senzorul Ultrasonic ({challengeStep + 1} din {CHALLENGES.length})</span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {CHALLENGES[challengeStep].question}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-cyan-300 whitespace-pre">
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
                  className="self-end py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{challengeStep < CHALLENGES.length - 1 ? 'Următoarea Întrebare' : 'Finalizează Nivelul 3'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">Nivelul 3 Finalizat cu Succes!</h4>
              <p className="text-xs text-slate-300 max-w-md">
                Stăpânești funcționarea senzorului ultrasonic de distanță, timpul de propagare a ecoului și stabilirea pragurilor de frânare în C++.
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>Treci la Nivelul 4: Senzorul Optic de Urmărire a Liniei</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
