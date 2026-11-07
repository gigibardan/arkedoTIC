import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  Radio,
  HelpCircle,
  Gauge
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

export const RobotLevel3_UltrasonicDistanceSensor: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
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
        labelRo: 'PERICOL: ZONĂ OARBĂ (Sub 4 cm)',
        labelEn: 'DANGER: BLIND ZONE (Under 4 cm)',
        descRo: 'Undele sonore se întorc prea rapid pentru a fi măsurate corect de microcontroler.',
        descEn: 'Sound waves return too fast to be accurately timed by the microcontroller.',
        color: 'text-rose-400 bg-rose-950/60 border-rose-500/50'
      };
    }
    if (dist <= 20) {
      return {
        labelRo: 'OPRIRE DE URGENȚĂ & VIRAJ (≤ 20 cm)',
        labelEn: 'EMERGENCY BRAKE & TURN (≤ 20 cm)',
        descRo: 'Robotul oprește motoarele de înaintare și virează la 90° pentru a evita ciocnirea.',
        descEn: 'The robot halts forward motors and turns 90° to avoid collision.',
        color: 'text-amber-300 bg-amber-950/60 border-amber-500/50'
      };
    }
    return {
      labelRo: 'CALE LIBERĂ & AVANSARE (> 20 cm)',
      labelEn: 'PATH CLEAR & ADVANCE (> 20 cm)',
      descRo: 'Niciun obstacol în raza de siguranță. Motoarele rulează înainte cu viteză normală.',
      descEn: 'No obstacles within safety perimeter. Motors advance forward at normal speed.',
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
      questionRo: 'De ce împărțim la 2 timpul măsurat de senzorul ultrasonic pentru a calcula distanța?',
      questionEn: 'Why do we divide the time measured by the ultrasonic sensor by 2 to compute distance?',
      code: '// Formula: distanta = (viteza_sunet * timp) / 2;',
      options: [
        {
          labelRo: 'Pentru că unda sonoră parcurge distanța dus-întors (merge până la perete și se întoarce la receptor)',
          labelEn: 'Because the sound wave travels a round-trip distance (goes to the wall and bounces back to the receiver)',
          correct: true
        },
        {
          labelRo: 'Pentru că senzorul are 2 ochi (emițător și receptor)',
          labelEn: 'Because the sensor has 2 eyes (transmitter and receiver)',
          correct: false
        },
        {
          labelRo: 'Pentru că viteza sunetului se dublează în interiorul clasei',
          labelEn: 'Because the speed of sound doubles inside the classroom',
          correct: false
        },
        {
          labelRo: 'Este o constantă matematică fără legătură cu traseul sunetului',
          labelEn: 'It is a mathematical constant unrelated to the sound path',
          correct: false
        }
      ],
      explanationRo: 'Unda sonoră pleacă de la emițător, atinge obstacolul și se reflectă înapoi la receptor, parcurgând distanța de două ori (dus-întors)!',
      explanationEn: 'The sound wave leaves the emitter, strikes the obstacle, and bounces back to the receiver, traveling the distance twice (round trip)!'
    },
    {
      questionRo: 'Ce este „Zona Oarbă” (Blind Zone) a unui senzor ultrasonic (pag. 105)?',
      questionEn: 'What is the "Blind Zone" of an ultrasonic sensor (p. 105)?',
      code: null,
      options: [
        {
          labelRo: 'Zona extrem de apropiată (sub 3-4 cm) unde unda se întoarce înainte ca senzorul să apuce să asculte ecoul',
          labelEn: 'The extremely close zone (under 3-4 cm) where the wave returns before the receiver is ready to listen',
          correct: true
        },
        {
          labelRo: 'O zonă în care senzorul se oprește când este întuneric în cameră',
          labelEn: 'A zone where the sensor turns off when the room is dark',
          correct: false
        },
        {
          labelRo: 'Distanța mai mare de 10 kilometri',
          labelEn: 'A distance greater than 10 kilometers',
          correct: false
        },
        {
          labelRo: 'Zona din spatele robotului',
          labelEn: 'The area directly behind the robot',
          correct: false
        }
      ],
      explanationRo: 'La distanțe sub 3-4 cm, ecoul se întoarce înainte ca pinul de emisie să termine semnalul, făcând măsurarea imposibilă sau eronată.',
      explanationEn: 'At distances below 3-4 cm, the echo returns before the emission pin finishes pulse transmission, causing invalid readings.'
    },
    {
      questionRo: 'Care este pragul de distanță minim recomandat în manual pentru oprirea în siguranță a robotului?',
      questionEn: 'What is the minimum recommended distance threshold in the textbook for safe robot braking?',
      code: 'if (robot.citesteUltrasonic() <= ???) {\n    robot.stop();\n    robot.vireazaDreapta(90);\n}',
      options: [
        {
          labelRo: '20 cm (pentru a asigura spațiu de frânare și manevră fără coliziune)',
          labelEn: '20 cm (to allow sufficient braking distance and obstacle avoidance without collision)',
          correct: true
        },
        {
          labelRo: '0 cm (să atingă peretele mai întâi)',
          labelEn: '0 cm (touch the wall first)',
          correct: false
        },
        {
          labelRo: '500 cm (5 metri)',
          labelEn: '500 cm (5 meters)',
          correct: false
        },
        {
          labelRo: '1 mm',
          labelEn: '1 mm',
          correct: false
        }
      ],
      explanationRo: 'La 20 cm robotul are spațiu suficient pentru a reduce inerția mecanică a motoarelor și a vira fără riscul de a lovi peretele!',
      explanationEn: 'At 20 cm the robot has enough leeway to cancel mechanical motor inertia and turn without hitting the wall!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const isCorrect = CHALLENGES[qIdx].options[optIdx].correct;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback(
        (lang === 'ro' ? 'Corect! ' : 'Correct! ') +
        (lang === 'ro' ? CHALLENGES[qIdx].explanationRo : CHALLENGES[qIdx].explanationEn)
      );
    } else {
      sounds.playWrong();
      setChallengeFeedback(
        (lang === 'ro' ? 'Incorect. ' : 'Incorrect. ') +
        (lang === 'ro' ? CHALLENGES[qIdx].explanationRo : CHALLENGES[qIdx].explanationEn)
      );
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
              <span>{lang === 'ro' ? 'Nivelul 3 din 7 • Modulul 4F' : 'Level 3 of 7 • Module 4F'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro'
                ? 'Senzorul Ultrasonic de Distanță & Evitarea Obstacolelor (Manual pag. 105)'
                : 'Ultrasonic Distance Sensor & Obstacle Avoidance (Textbook p. 105)'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro'
                ? 'Înțelege principiul ecolocației: emisia undei sonore la 40 kHz, recepția ecoului reflectat, calculul distanței în centimetri și stabilirea pragului critic de frânare la 20 cm.'
                : 'Understand echolocation: 40 kHz sound pulse emission, reflected echo reception, centimeter distance calculation, and setting the 20 cm safety brake threshold.'}
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
          <span>
            {lang === 'ro'
              ? 'Fizica Sonarului: Distanța = (Viteza Sunetului × Timp) / 2'
              : 'Sonar Physics: Distance = (Speed of Sound × Time) / 2'}
          </span>
        </div>

        {/* Interactive Ultrasonic Caliper Simulator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ro' ? 'Bancul de Testare Ultrasonică (0 – 100 cm)' : 'Ultrasonic Test Bench (0 – 100 cm)'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ro'
                  ? 'Deplasează peretele din glisor pentru a observa timpul de zbor al ecoului și reacția de control.'
                  : 'Drag the wall slider to observe echo time-of-flight and robot response.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendPing}
              className="py-1.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Emite Impuls (Ping)' : 'Emit Pulse (Ping)'}</span>
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
              <span className="text-[10px] font-mono text-cyan-300 mt-1">
                {lang === 'ro' ? 'Senzor HC-SR04' : 'HC-SR04 Sensor'}
              </span>
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
                  {lang === 'ro' ? 'PERETE' : 'WALL'}
                </span>
              </div>
            </div>

            {/* Scale Line */}
            <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              <span>0 cm</span>
              <span className="text-rose-400">{lang === 'ro' ? '4 cm (Oarbă)' : '4 cm (Blind)'}</span>
              <span className="text-amber-400">{lang === 'ro' ? '20 cm (Prag Stop)' : '20 cm (Stop Threshold)'}</span>
              <span>50 cm</span>
              <span>100 cm</span>
            </div>
          </div>

          {/* Distance Caliper Slider */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl mb-4">
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="font-bold">
                {lang === 'ro' ? 'Reglează Distanța până la Obstacol:' : 'Adjust Distance to Obstacle:'}
              </span>
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
                  {lang === 'ro' ? status.labelRo : status.labelEn}
                </span>
                <p className="leading-relaxed text-[11px]">
                  {lang === 'ro' ? status.descRo : status.descEn}
                </p>
              </div>
              <div className="mt-2 text-[10px] font-mono opacity-80">
                {lang === 'ro' ? 'Timp dus-întors ecou: ' : 'Round-trip echo time: '}
                <strong>{flightTimeUs} microsecunde (μs)</strong>
              </div>
            </div>

            <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300">
              <span className="text-slate-500 block mb-1">
                {lang === 'ro' ? '// Reacția C++ a robotului:' : '// C++ robot reaction:'}
              </span>
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
              <span>
                {lang === 'ro'
                  ? `Verificare Înțelegere: Senzorul Ultrasonic (${challengeStep + 1} din ${CHALLENGES.length})`
                  : `Comprehension Check: Ultrasonic Sensor (${challengeStep + 1} of ${CHALLENGES.length})`}
              </span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {lang === 'ro' ? CHALLENGES[challengeStep].questionRo : CHALLENGES[challengeStep].questionEn}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-cyan-300 whitespace-pre">
                  {CHALLENGES[challengeStep].code}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {CHALLENGES[challengeStep].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[challengeStep] === oIdx;
                  const label = lang === 'ro' ? opt.labelRo : opt.labelEn;
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
                      <span>{label}</span>
                      {isSelected && (
                        opt.correct ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {challengeFeedback && (
                <div className={`p-3 rounded-xl text-xs border ${challengeFeedback.startsWith('Corect') || challengeFeedback.startsWith('Correct') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                  {challengeFeedback}
                </div>
              )}

              {selectedAnswers[challengeStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="self-end py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {challengeStep < CHALLENGES.length - 1
                      ? lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question'
                      : lang === 'ro' ? 'Finalizează Nivelul 3' : 'Complete Level 3'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">
                {lang === 'ro' ? 'Nivelul 3 Finalizat cu Succes!' : 'Level 3 Completed Successfully!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {lang === 'ro'
                  ? 'Stăpânești funcționarea senzorului ultrasonic de distanță, timpul de propagare a ecoului și stabilirea pragurilor de frânare în C++.'
                  : 'You mastered ultrasonic distance sensor physics, echo round-trip timing, and establishing C++ emergency brake thresholds.'}
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {lang === 'ro' ? 'Treci la Nivelul 4: Senzorul Optic de Urmărire a Liniei' : 'Proceed to Level 4: Optical Line Tracking Sensor'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
