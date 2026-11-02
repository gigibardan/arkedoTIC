import React, { useState, useEffect } from 'react';
import {
  Bot,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Flag,
  Compass,
  Zap,
  Pause
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R1Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface RobotPos {
  x: number;
  y: number;
  angle: number; // in degrees
}

export const R1Level5_AutonomousObstacleAvoider: React.FC<R1Level5Props> = ({
  onCompletePage,
  onComplete
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [robot, setRobot] = useState<RobotPos>({ x: 30, y: 150, angle: 0 });
  const [decisionLogs, setDecisionLogs] = useState<string[]>([
    'Sistem autonom inițializat. Senzor HC-SR04 calibrat pe servomotor SG90.',
    'Apasă "Pornește Navigarea Autonomă" pentru a rula mașina de stări C++.'
  ]);

  // Goal point
  const goal = { x: 340, y: 150 };

  // Fixed Obstacles
  const obstacles = [
    { id: 1, x: 120, y: 130, w: 25, h: 40 },
    { id: 2, x: 220, y: 70, w: 30, h: 50 },
    { id: 3, x: 220, y: 190, w: 30, h: 50 }
  ];

  // Reached goal flag
  const [hasReachedGoal, setHasReachedGoal] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Autonomous Robot Navigation Loop
  useEffect(() => {
    if (!isRunning || hasReachedGoal) return;

    const timer = setInterval(() => {
      setRobot((prev) => {
        // Check if close to goal
        const distToGoal = Math.hypot(goal.x - prev.x, goal.y - prev.y);
        if (distToGoal < 25) {
          setIsRunning(false);
          setHasReachedGoal(true);
          sounds.playLevelComplete();
          setDecisionLogs((logs) => [
            ...logs.slice(-4),
            '🏆 SUCCES! Robotul a navigat autonom și a atins Ținta fără coliziuni!'
          ]);
          return prev;
        }

        // Look-ahead distance check against obstacles
        const lookAheadDist = 35;
        const rad = (prev.angle * Math.PI) / 180;
        const frontX = prev.x + Math.cos(rad) * lookAheadDist;
        const frontY = prev.y + Math.sin(rad) * lookAheadDist;

        // Check collision with obstacles or canvas bounds
        const willCollide =
          frontX < 15 ||
          frontX > 375 ||
          frontY < 15 ||
          frontY > 285 ||
          obstacles.some(
            (obs) =>
              frontX >= obs.x - 12 &&
              frontX <= obs.x + obs.w + 12 &&
              frontY >= obs.y - 12 &&
              frontY <= obs.y + obs.h + 12
          );

        if (willCollide) {
          // Obstacle detected! Decision: Turn away (rotate by 45 degrees)
          const newAngle = (prev.angle + 45) % 360;
          setDecisionLogs((logs) => [
            ...logs.slice(-4),
            `[DECISION C++]: Obstacol la ${Math.round(lookAheadDist)}cm! Stop motoare -> Rotire la ${newAngle}°`
          ]);
          return { ...prev, angle: newAngle };
        } else {
          // Path clear! Move forward slightly towards goal
          const targetAngle = (Math.atan2(goal.y - prev.y, goal.x - prev.x) * 180) / Math.PI;
          let angleDiff = targetAngle - prev.angle;
          while (angleDiff < -180) angleDiff += 360;
          while (angleDiff > 180) angleDiff -= 360;

          const turnAdjustment = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 15);
          const adjustedAngle = (prev.angle + turnAdjustment + 360) % 360;
          const speed = 4;
          const moveRad = (adjustedAngle * Math.PI) / 180;

          return {
            x: prev.x + Math.cos(moveRad) * speed,
            y: prev.y + Math.sin(moveRad) * speed,
            angle: adjustedAngle
          };
        }
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isRunning, hasReachedGoal]);

  const handleReset = () => {
    sounds.playClick();
    setIsRunning(false);
    setHasReachedGoal(false);
    setRobot({ x: 30, y: 150, angle: 0 });
    setDecisionLogs(['Robot repoziționat la start. Algoritm pregătit.']);
  };

  const isLevelCompleted =
    hasReachedGoal && q1Answer === 'state_machine' && q2Answer === 'radar_servo';

  const handleFinish = () => {
    if (!isLevelCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border border-emerald-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                Nivelul 5 • Unitatea 4: Robotică (Manual pag. 95–97)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Robotul Autonom Evitator de Obstacole
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/50 rounded-lg text-emerald-300 text-sm font-mono">
            <span>Mașină de Stări C++</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Culmea roboticii practice: integrarea senzorului ultrasonic HC-SR04, a servomotorului SG90 și
          a punții H L298N într-un <strong>algoritm de navigare autonomă</strong>. Robotul sondează spațiul,
          ia decizii în timp real și ocolește obstacolele fără intervenție umană.
        </p>
      </div>

      {/* Main Grid: Arena & Diagnostic State Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Simulation Arena */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Arenă Virtuală de Testare (Top-Down View)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsRunning(!isRunning);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  {isRunning ? 'Pauză Navigare' : 'Pornește Navigarea'}
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  title="Resetează la Start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SVG Interactive Arena Canvas */}
            <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner flex justify-center">
              <svg width="390" height="300" className="w-full max-w-[390px] h-[300px]">
                {/* Grid Background lines */}
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Obstacles */}
                {obstacles.map((obs) => (
                  <g key={obs.id}>
                    <rect
                      x={obs.x}
                      y={obs.y}
                      width={obs.w}
                      height={obs.h}
                      rx="4"
                      className="fill-rose-900/60 stroke-rose-500 stroke-2"
                    />
                    <text
                      x={obs.x + obs.w / 2}
                      y={obs.y + obs.h / 2 + 4}
                      fill="#fda4af"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      ZID
                    </text>
                  </g>
                ))}

                {/* Goal Point */}
                <g>
                  <circle
                    cx={goal.x}
                    cy={goal.y}
                    r="18"
                    className="fill-emerald-500/20 stroke-emerald-400 stroke-2"
                  />
                  <text
                    x={goal.x}
                    y={goal.y + 4}
                    fill="#34d399"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    🚩 ȚINTĂ
                  </text>
                </g>

                {/* Robot Body */}
                <g transform={`translate(${robot.x}, ${robot.y}) rotate(${robot.angle})`}>
                  {/* Ultrasonic Sonar Ray Cone */}
                  <path
                    d="M 12 0 L 45 -18 L 45 18 Z"
                    className={
                      isRunning
                        ? 'fill-cyan-400/20 stroke-cyan-400/60 stroke-1 stroke-dasharray-2'
                        : 'fill-transparent'
                    }
                  />
                  {/* Chassis */}
                  <rect
                    x="-12"
                    y="-10"
                    width="24"
                    height="20"
                    rx="3"
                    className="fill-slate-800 stroke-teal-400 stroke-2 shadow"
                  />
                  {/* Wheels */}
                  <rect x="-8" y="-13" width="16" height="3" rx="1" fill="#475569" />
                  <rect x="-8" y="10" width="16" height="3" rx="1" fill="#475569" />
                  {/* HC-SR04 Sensors on front */}
                  <circle cx="12" cy="-4" r="2.5" fill="#38bdf8" />
                  <circle cx="12" cy="4" r="2.5" fill="#38bdf8" />
                  {/* Heading indicator dot */}
                  <circle cx="5" cy="0" r="2" fill="#f59e0b" />
                </g>
              </svg>
            </div>

            {/* Decision Logs */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Log-uri Algoritmice Decizionale în Timp Real</span>
              </div>
              <div className="space-y-1 pt-1 min-h-[70px]">
                {decisionLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`text-[11px] ${
                      log.startsWith('🏆')
                        ? 'text-emerald-400 font-bold'
                        : log.startsWith('[DECISION')
                        ? 'text-amber-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: State Machine Architecture & Knowledge Checks */}
        <div className="lg:col-span-5 space-y-4">
          {/* C++ State Machine Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 block pb-1 border-b border-slate-800">
              Structura Buclă C++ loop() (Manual pag. 97):
            </span>
            <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
{`void loop() {
  int dist = masoaraDistanta();
  if (dist > 25) {
    mergiInainte();
  } else {
    opreste();
    int distS = scanStanga();
    int distD = scanDreapta();
    if (distS > distD) viraStanga();
    else viraDreapta();
  }
}`}
            </pre>
          </div>

          {/* Interactive Check Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>Verificare Înțelegere (Manual pag. 97)</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                1. Cum se numește modelul algoritmic în care robotul comută între stări distincte (Mers Înainte, Oprire, Scanare, Viraj)?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'state_machine', text: 'Mașină cu stări finite (Finite State Machine)' },
                  { id: 'random_walk', text: 'Mișcare aleatorie fără memorie sau logică' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ1Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q1Answer === opt.id
                        ? opt.id === 'state_machine'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <p className="text-slate-300 font-medium">
                2. De ce se montează senzorul ultrasonic pe un servomotor rotativ?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'radar_servo', text: 'Permite rotirea senzorului la stânga și la dreapta pentru a căuta traiectoria liberă fără a roti întreg șasiul' },
                  { id: 'racire', text: 'Pentru a crea vânt și a răci senzorul' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ2Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q2Answer === opt.id
                        ? opt.id === 'radar_servo'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isLevelCompleted
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isLevelCompleted
                ? 'Nivelul 5 Finalizat cu Succes! Ținta Atinsă!'
                : 'Cerințe: Pornește navigarea și lasă robotul să atingă Ținta 🚩, apoi răspunde la ambele întrebări.'}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și deblocarea Clinicii de Depanare Hardware (Nivelul 6).
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continuă spre Nivelul 6</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
