import React, { useState } from 'react';
import {
  Compass,
  Eye,
  Radio,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Zap,
  Target,
  Shield
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ScratchAlgo1_Level5_SensorsInLoops: React.FC<Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Sensor Simulator State
  const [chosenSensor, setChosenSensor] = useState<'distance' | 'color' | 'key' | null>(null);
  const [robotX, setRobotX] = useState<number>(0);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [simulationStatus, setSimulationStatus] = useState<string>('idle');

  // Mini quiz state
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const startSensorRun = (sensor: 'distance' | 'color' | 'key') => {
    if (isDriving) return;
    setChosenSensor(sensor);
    setIsDriving(true);
    setRobotX(0);
    setSimulationStatus('running');
    sounds.playClick();

    let pos = 0;
    const interval = setInterval(() => {
      pos += 12;
      setRobotX(pos);
      sounds.playPop();

      // Check stop condition based on sensor type
      if (sensor === 'distance' && pos >= 160) {
        // Distance sensor detects obstacle at distance < 40px
        clearInterval(interval);
        setIsDriving(false);
        setSimulationStatus('stopped_safely');
        sounds.playCorrect();
      } else if (sensor === 'color' && pos >= 200) {
        // Color touch sensor touches red barrier
        clearInterval(interval);
        setIsDriving(false);
        setSimulationStatus('stopped_safely');
        sounds.playCorrect();
      } else if (sensor === 'key' && pos >= 240) {
        // Key sensor without pressing crashed
        clearInterval(interval);
        setIsDriving(false);
        setSimulationStatus('stopped_wall');
        sounds.playWrong();
      }
    }, 120);
  };

  const resetSensorLab = () => {
    setRobotX(0);
    setIsDriving(false);
    setSimulationStatus('idle');
    sounds.playClick();
  };

  const handleQuiz = (ans: string) => {
    if (quizAnswer) return;
    setQuizAnswer(ans);
    if (ans === 'touch_color') sounds.playCorrect();
    else sounds.playWrong();
  };

  const canProceed = simulationStatus === 'stopped_safely' && quizAnswer === 'touch_color';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-blue-950/40 to-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                {isEn ? 'Grade 6 • Unit 4A • Level 5 of 7' : 'Clasa a VI-a • Unitatea 4A • Nivelul 5 din 7'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Manual pag. 72–75</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <Radio className="w-8 h-8 text-cyan-400" />
              <span>{isEn ? 'Smart Scratch Sensing in Conditional Loops' : 'Senzorii Inteligenți Scratch în Bucle Condiționate'}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Equip your sprites with digital senses: proximity radar, color detection, and keyboard triggers to make responsive characters!'
                : 'Oferă personajelor tale simțuri digitale: radar de proximitate, detecția culorii și senzori de taste pentru a reacționa la mediul înconjurător!'}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-cyan-400/80">REWARD</span>
            <span className="text-xl font-black text-cyan-300 font-mono">+15 XP</span>
          </div>
        </div>
      </div>

      {/* Sensor Palette Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition">
          <div className="bg-cyan-950/80 text-cyan-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block mb-3 border border-cyan-500/30">
            &lt; atinge [margine] ? &gt;
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isEn ? 'Collision Sensor' : 'Senzorul de Coliziune'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Detectează când personajul atinge marginea ecranului, cursorul mouse-ului sau un alt personaj din joc.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition">
          <div className="bg-cyan-950/80 text-cyan-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block mb-3 border border-cyan-500/30">
            &lt; atinge culoarea [#ff0000] ? &gt;
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isEn ? 'Color Pixel Sensor' : 'Senzorul de Culoare'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Detectează pixelii de pe fundal: util pentru pereții unui labirint, lavă, iarbă sau monede de aur.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition">
          <div className="bg-cyan-950/80 text-cyan-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block mb-3 border border-cyan-500/30">
            ( distanța până la [țintă] )
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isEn ? 'Proximity Radar' : 'Radarul de Distanță'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Măsoară distanța în pixeli: permite personajului să frâneze lin înainte să se lovească de un obstacol!
          </p>
        </div>
      </div>

      {/* Interactive Driving Sensor Lab */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              {isEn ? 'Interactive Obstacle Detection Lab' : 'Simulator: Pilotare Autonomă cu Senzori de Oprire'}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Țintă: Oprește robotul înainte de impact!
          </span>
        </div>

        {/* Sensor Options Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => startSensorRun('distance')}
            disabled={isDriving}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition cursor-pointer flex items-center justify-between ${
              chosenSensor === 'distance'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div>
              <div className="font-bold text-sm text-cyan-400 mb-0.5">
                repetă până când &lt;distanța &lt; 40&gt;
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Radar de proximitate: frânează cu 40px înainte de zid.
              </div>
            </div>
            <Play className="w-4 h-4 text-cyan-400 shrink-0" />
          </button>

          <button
            onClick={() => startSensorRun('color')}
            disabled={isDriving}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition cursor-pointer flex items-center justify-between ${
              chosenSensor === 'color'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div>
              <div className="font-bold text-sm text-cyan-400 mb-0.5">
                repetă până când &lt;atinge culoarea [roșu]&gt;
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Senzor optic de barieră: se oprește la contactul cu linia roșie.
              </div>
            </div>
            <Play className="w-4 h-4 text-cyan-400 shrink-0" />
          </button>
        </div>

        {/* The Track Simulator */}
        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="relative h-24 bg-slate-900 rounded-xl border border-slate-800 flex items-center px-4 overflow-hidden">
            {/* Safe distance marker */}
            <div className="absolute right-28 top-0 bottom-0 w-0.5 border-r border-dashed border-cyan-500/40 flex items-center">
              <span className="text-[9px] font-mono text-cyan-400 -rotate-90 -ml-5">
                ZONĂ SIGURĂ
              </span>
            </div>

            {/* Red Obstacle Wall */}
            <div className="absolute right-6 top-2 bottom-2 w-8 bg-red-600 rounded-lg border-2 border-red-400 flex flex-col items-center justify-center text-[10px] font-bold font-mono text-white shadow-lg shadow-red-600/40">
              <span>Z</span>
              <span>I</span>
              <span>D</span>
            </div>

            {/* Arky Robot */}
            <div
              className="absolute top-4 bottom-4 transition-all duration-100 flex items-center"
              style={{ left: `${20 + robotX}px` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 border-2 border-cyan-300 flex items-center justify-center text-2xl shadow-xl shadow-cyan-500/30">
                🤖
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              Status:
              {simulationStatus === 'idle' && (
                <span className="text-slate-400 ml-1.5">Alege un senzor de mai sus pentru a lansa testul.</span>
              )}
              {simulationStatus === 'running' && (
                <span className="text-cyan-400 font-bold ml-1.5 animate-pulse">Robotul înaintează... senzorul monitorizează!</span>
              )}
              {simulationStatus === 'stopped_safely' && (
                <span className="text-emerald-400 font-bold ml-1.5 flex-inline items-center gap-1">
                  ✅ Buclă oprită cu succes! Senzorul a declanșat oprirea fără accident.
                </span>
              )}
            </div>
            <button
              onClick={resetSensorLab}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sensor Quiz Question */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">
            {isEn
              ? 'Quiz: In a Maze Game, what is the best sensor condition to keep a character walking as long as it has NOT touched a black wall?'
              : 'Verificare: Într-un joc Labirint, care este condiția optimă de oprire pentru a nu trece prin pereții negri?'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'touch_color',
              label: 'repetă până când <atinge culoarea [negru]>',
              desc: 'Oprește deplasarea exact în momentul contactului cu peretele'
            },
            {
              id: 'repeat_100',
              label: 'repetă de (100) ori : mergi',
              desc: 'Merge orbește fără să verifice obstacolele'
            },
            {
              id: 'forever',
              label: 'la infinit : mergi 10 pași',
              desc: 'Trece prin pereți și iese de pe ecran'
            }
          ].map((item) => {
            const isSelected = quizAnswer === item.id;
            let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
            if (quizAnswer) {
              if (item.id === 'touch_color') style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
              else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleQuiz(item.id)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${style}`}
              >
                <div>
                  <div className="font-mono font-bold text-xs text-cyan-300 mb-1">{item.label}</div>
                  <div className="text-[11px] text-slate-400">{item.desc}</div>
                </div>
                {quizAnswer && item.id === 'touch_color' && (
                  <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Corect!
                  </div>
                )}
                {quizAnswer && isSelected && item.id !== 'touch_color' && (
                  <div className="mt-2 text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Incorect
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <QuestionHint
          hint={
            isEn
              ? 'A maze has walls drawn in a specific color (e.g. black). Sensing that exact color stops the loop.'
              : 'Pereții labirintului au o culoare bine definită. Senzorul de atingere a culorii peretelui este ideal pentru oprirea buclei!'
          }
        />
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canProceed}
        onNext={() => onCompletePage(15)}
        nextLabel={isEn ? 'Level 6: Smart Maze Algorithm' : 'Nivelul 6: Proiect Labirint Inteligent'}
      />
    </div>
  );
};
