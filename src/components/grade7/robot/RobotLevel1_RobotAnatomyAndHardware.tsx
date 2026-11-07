import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  Bot,
  HelpCircle,
  Cpu,
  Radio,
  Zap,
  Eye
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface RobotPart {
  id: string;
  nameRo: string;
  nameEn: string;
  category: 'chassis' | 'actuator' | 'brain' | 'sensor';
  icon: string;
  roleRo: string;
  roleEn: string;
  specsRo: string;
  specsEn: string;
}

const ROBOT_COMPONENTS: RobotPart[] = [
  {
    id: 'chassis',
    nameRo: 'Șasiu & Structură Mecanică',
    nameEn: 'Chassis & Mechanical Structure',
    category: 'chassis',
    icon: '🚙',
    roleRo: 'Susține toate componentele electronice, roțile și bateria robotului.',
    roleEn: 'Supports all electronic components, wheels, and the battery of the robot.',
    specsRo: 'Polimer ABS rezistent la șocuri, roată pivotantă omnidirecțională.',
    specsEn: 'Shock-resistant ABS polymer, omnidirectional caster wheel.'
  },
  {
    id: 'motors',
    nameRo: 'Motoare Electrice (Actuatori)',
    nameEn: 'Electric Motors (Actuators)',
    category: 'actuator',
    icon: '⚙️',
    roleRo: 'Transformă impulsurile electrice din program în rotație mecanică precisă.',
    roleEn: 'Converts electrical signals from software into precise mechanical rotation.',
    specsRo: '2 motoare DC cu reductor de turație (viteză reglabilă prin semnal PWM).',
    specsEn: '2 DC gearmotors with speed reduction (speed adjustable via PWM signal).'
  },
  {
    id: 'controller',
    nameRo: 'Microcontroler (Creierul Robotului)',
    nameEn: 'Microcontroller (Robot Brain)',
    category: 'brain',
    icon: '🧠',
    roleRo: 'Rulează programul C++, procesează datele de la senzori și comandă motoarele.',
    roleEn: 'Runs the C++ program, processes sensor inputs, and controls the motors.',
    specsRo: 'Procesor 32-bit compatibil Arduino/ESP32 cu memorie Flash și port USB.',
    specsEn: '32-bit Arduino/ESP32-compatible processor with Flash memory and USB port.'
  },
  {
    id: 'ultrasonic',
    nameRo: 'Senzor Ultrasonic de Distanță',
    nameEn: 'Ultrasonic Distance Sensor',
    category: 'sensor',
    icon: '📡',
    roleRo: 'Măsoară distanța până la obstacole emițând unde sonore de 40 kHz.',
    roleEn: 'Measures distance to obstacles by emitting 40 kHz sound waves.',
    specsRo: 'Interval măsurare: 2 cm – 400 cm, precizie 3 mm, unghi con 15°.',
    specsEn: 'Measurement range: 2 cm – 400 cm, 3 mm precision, 15° cone angle.'
  },
  {
    id: 'linetracker',
    nameRo: 'Senzor Optic de Linie (Infraroșu)',
    nameEn: 'Optical Line Sensor (Infrared)',
    category: 'sensor',
    icon: '👀',
    roleRo: 'Detectează banda neagră de pe podea pe baza reflexiei luminii IR.',
    roleEn: 'Detects black tape on the floor based on IR light reflection.',
    specsRo: 'LED emițător IR + fototranzistor receptor (alb reflectă, negru absoarbe).',
    specsEn: 'IR emitter LED + phototransistor receiver (white reflects, black absorbs).'
  }
];

export const RobotLevel1_RobotAnatomyAndHardware: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [selectedPart, setSelectedPart] = useState<RobotPart>(ROBOT_COMPONENTS[0]);
  const [inspectedParts, setInspectedParts] = useState<Record<string, boolean>>({ chassis: true });

  // Challenge State
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  const handleSelectPart = (part: RobotPart) => {
    sounds.playClick();
    setSelectedPart(part);
    setInspectedParts(prev => ({ ...prev, [part.id]: true }));
  };

  const CHALLENGES = [
    {
      questionRo: 'Care sunt cele 3 mari subsisteme componente ale oricărui robot autonom (Manual pag. 103)?',
      questionEn: 'What are the 3 major component subsystems of any autonomous robot (Textbook p. 103)?',
      code: null,
      options: [
        {
          labelRo: 'Partea mecanică (corp/șasiu), Actuatorii (motoarele) și Sistemul senzorial/creierul (procesorul și senzorii)',
          labelEn: 'Mechanical structure (body/chassis), Actuators (motors), and Sensory/brain system (processor & sensors)',
          correct: true
        },
        {
          labelRo: 'Tastatura, Monitorul și Mouse-ul',
          labelEn: 'Keyboard, Monitor, and Mouse',
          correct: false
        },
        {
          labelRo: 'Cablul de alimentare, Becul și Priza',
          labelEn: 'Power cable, Light bulb, and Wall outlet',
          correct: false
        },
        {
          labelRo: 'Doar roțile și bateria',
          labelEn: 'Only the wheels and battery',
          correct: false
        }
      ],
      explanationRo: 'Orice robot autonom funcționează pe triada: Corp fizic (structură) + Mușchi (actuatori/motoare) + Simțuri & Creier (senzori și microcontroler)!',
      explanationEn: 'Every autonomous robot relies on the triad: Physical Body (structure) + Muscles (actuators/motors) + Senses & Brain (sensors and microcontroller)!'
    },
    {
      questionRo: 'Ce rol are un „Actuator” într-un sistem robotic?',
      questionEn: 'What is the role of an "Actuator" in a robotic system?',
      code: '// robot.setSpeed(100); -> command to actuator',
      options: [
        {
          labelRo: 'Convertește comenzile software în forță mecanică și deplasare fizică',
          labelEn: 'Converts software commands into mechanical torque and physical motion',
          correct: true
        },
        {
          labelRo: 'Afișează text pe ecranul calculatorului',
          labelEn: 'Displays text on the computer screen',
          correct: false
        },
        {
          labelRo: 'Măsoară temperatura ambientală',
          labelEn: 'Measures ambient temperature',
          correct: false
        },
        {
          labelRo: 'Salvează fișierele în format PDF',
          labelEn: 'Saves files as PDF documents',
          correct: false
        }
      ],
      explanationRo: 'Actuatorii sunt elementele de execuție mecanică (motoare, pistoane, servomotoare) prin care robotul acționează asupra mediului înconjurător!',
      explanationEn: 'Actuators are mechanical execution elements (motors, pistons, servomotors) through which the robot exerts action upon its surroundings!'
    },
    {
      questionRo: 'Cum „vede” senzorul ultrasonic distanța până la un perete?',
      questionEn: 'How does an ultrasonic sensor "see" distance to a wall?',
      code: '// Emitter: Emits 40 kHz ultrasonic pulse\n// Receiver: Waits for reflected echo\n// Distance = (Speed of sound * Time) / 2',
      options: [
        {
          labelRo: 'Emite o undă sonoră de înaltă frecvență și măsoară timpul de întoarcere a ecoului reflectat',
          labelEn: 'Emits a high-frequency sound wave and measures the return travel time of the reflected echo',
          correct: true
        },
        {
          labelRo: 'Face o fotografie digitală color',
          labelEn: 'Takes a color digital photograph',
          correct: false
        },
        {
          labelRo: 'Folosește un termometru cu mercur',
          labelEn: 'Uses a mercury thermometer',
          correct: false
        },
        {
          labelRo: 'Trimite un mesaj pe internet prin rețeaua Wi-Fi',
          labelEn: 'Sends an internet packet over the Wi-Fi network',
          correct: false
        }
      ],
      explanationRo: 'Senzorul ultrasonic funcționează exact ca ecolocația liliecilor sau sonarul submarinelor: măsoară durata ecoului reflectat de obstacol!',
      explanationEn: 'The ultrasonic sensor works exactly like bat echolocation or submarine sonar: it measures the round-trip echo time from an obstacle!'
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

  const inspectedCount = Object.keys(inspectedParts).length;

  const getCategoryLabel = (category: RobotPart['category']) => {
    if (lang === 'ro') {
      return category === 'sensor'
        ? 'Senzor (Simț)'
        : category === 'actuator'
        ? 'Actuator (Motor)'
        : category === 'brain'
        ? 'Creier (Microcontroler)'
        : 'Structură Mecanică';
    }
    return category === 'sensor'
      ? 'Sensor (Perception)'
      : category === 'actuator'
      ? 'Actuator (Motor)'
      : category === 'brain'
      ? 'Brain (Microcontroller)'
      : 'Mechanical Chassis';
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-green-900/80 to-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 mb-2">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ro' ? 'Nivelul 1 din 7 • Modulul 4F' : 'Level 1 of 7 • Module 4F'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro'
                ? 'Anatomia Robotului Virtual: Corp, Motoare & Senzori (Manual pag. 103)'
                : 'Virtual Robot Anatomy: Chassis, Motors & Sensors (Textbook p. 103)'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro'
                ? 'Descoperă componentele hardware ale unui robot educațional: șasiul mecanic, motoarele (actuatori), creierul de procesare și senzorii care îi conferă „simțuri” în lumea reală.'
                : 'Discover the hardware components of an educational robot: mechanical chassis, motors (actuators), processing brain, and sensors that give it real-world senses.'}
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
          <span>
            {lang === 'ro'
              ? 'Laborator Interactiv de Inspecție Hardware (Explorează toate cele 5 componente)'
              : 'Interactive Hardware Inspection Lab (Explore all 5 components)'}
          </span>
        </div>

        {/* Component Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
          {ROBOT_COMPONENTS.map((part) => {
            const isSelected = selectedPart.id === part.id;
            const hasInspected = inspectedParts[part.id];
            const name = lang === 'ro' ? part.nameRo : part.nameEn;
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => handleSelectPart(part)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 relative overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950/60 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {hasInspected && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                )}
                <span className="text-2xl">{part.icon}</span>
                <span className="text-[11px] font-bold font-mono line-clamp-1">{name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Part Detail Inspection Window */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
                {selectedPart.icon}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {lang === 'ro' ? selectedPart.nameRo : selectedPart.nameEn}
                </h3>
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold">
                  {lang === 'ro' ? 'Categorie: ' : 'Category: '}
                  {getCategoryLabel(selectedPart.category)}
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
              {lang === 'ro' ? 'Componente explorate: ' : 'Explored components: '}
              <strong className="text-emerald-300">{inspectedCount} / 5</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="font-bold text-white uppercase text-[10px] font-mono tracking-wider block mb-1 text-slate-400">
                {lang === 'ro' ? 'Rolul în Funcționarea Robotului:' : 'Role in Robot Operation:'}
              </span>
              <p className="text-slate-200 leading-relaxed text-sm">
                {lang === 'ro' ? selectedPart.roleRo : selectedPart.roleEn}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="font-bold text-white uppercase text-[10px] font-mono tracking-wider block mb-1 text-slate-400">
                {lang === 'ro' ? 'Specificații Tehnice Educaționale:' : 'Educational Technical Specifications:'}
              </span>
              <p className="text-emerald-300 font-mono leading-relaxed">
                {lang === 'ro' ? selectedPart.specsRo : selectedPart.specsEn}
              </p>
            </div>
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ro'
                  ? `Verificare Înțelegere: Anatomia Robotului (${challengeStep + 1} din ${CHALLENGES.length})`
                  : `Comprehension Check: Robot Anatomy (${challengeStep + 1} of ${CHALLENGES.length})`}
              </span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {lang === 'ro' ? CHALLENGES[challengeStep].questionRo : CHALLENGES[challengeStep].questionEn}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-emerald-300 whitespace-pre">
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
                  className="self-end py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {challengeStep < CHALLENGES.length - 1
                      ? lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question'
                      : lang === 'ro' ? 'Finalizează Nivelul 1' : 'Complete Level 1'}
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
                {lang === 'ro' ? 'Nivelul 1 Finalizat cu Succes!' : 'Level 1 Completed Successfully!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {lang === 'ro'
                  ? 'Ai asimilat structura hardware a robotului autonom: șasiul mecanic, actuatorii de mișcare și senzorii de percepție a mediului.'
                  : 'You mastered the autonomous robot hardware architecture: mechanical chassis, motion actuators, and environmental perception sensors.'}
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {lang === 'ro'
                    ? 'Treci la Nivelul 2: Traiectorii Geometrice & Unghiul de Rotație 360°/n'
                    : 'Proceed to Level 2: Geometric Trajectories & 360°/n Rotation Angle'}
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
