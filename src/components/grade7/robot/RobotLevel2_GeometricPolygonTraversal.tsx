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
  Compass,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

export const RobotLevel2_GeometricPolygonTraversal: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [sides, setSides] = useState<number>(6); // Hexagon default (manual pag. 104)
  const [activeEdge, setActiveEdge] = useState<number>(0);
  const [isTracing, setIsTracing] = useState<boolean>(false);

  // Challenge State
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  const exteriorAngle = Number((360 / sides).toFixed(1));

  // Generate regular polygon vertices for SVG canvas (center 150, 150, radius 90)
  const cx = 150;
  const cy = 150;
  const radius = 90;
  const vertices = Array.from({ length: sides }).map((_, i) => {
    // Start at top (-90 degrees)
    const angle = ((i * 360) / sides - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  });

  const handleStartTrace = () => {
    sounds.playClick();
    setIsTracing(true);
    setActiveEdge(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current <= sides) {
        setActiveEdge(current);
        sounds.playClick();
      } else {
        clearInterval(interval);
        setIsTracing(false);
        sounds.playCorrect();
      }
    }, 500);
  };

  const handleReset = (newSides?: number) => {
    sounds.playClick();
    if (newSides) setSides(newSides);
    setActiveEdge(0);
    setIsTracing(false);
  };

  const CHALLENGES = [
    {
      questionRo: 'Cu ce unghi trebuie să vireze robotul la fiecare vârf pentru a desena un Hexagon regulat (6 laturi egale, pag. 104)?',
      questionEn: 'At what angle must the robot turn at each vertex to draw a regular Hexagon (6 equal sides, p. 104)?',
      code: '// Formula: unghi_viraj = 360 / n;\n// n = 6 laturi',
      options: [
        {
          labelRo: '60° (deoarece 360° / 6 = 60°)',
          labelEn: '60° (because 360° / 6 = 60°)',
          correct: true
        },
        { labelRo: '120°', labelEn: '120°', correct: false },
        { labelRo: '90°', labelEn: '90°', correct: false },
        { labelRo: '180°', labelEn: '180°', correct: false }
      ],
      explanationRo: 'Suma unghiurilor exterioare ale oricărui poligon convex este 360°. Prin urmare, la fiecare vârf robotul virează cu 360° / 6 = 60°!',
      explanationEn: 'The sum of exterior angles of any convex polygon is 360°. Therefore, at each vertex the robot turns by 360° / 6 = 60°!'
    },
    {
      questionRo: 'Dacă vrem să programăm robotul să descrie un Pătrat, care este valoarea unghiului de rotație?',
      questionEn: 'If we want to program the robot to trace a Square, what is the rotation angle value?',
      code: 'for (int i = 1; i <= 4; i++) {\n    robot.inainte(100);\n    robot.roteste(???);\n}',
      options: [
        {
          labelRo: '90° (360° / 4 = 90°)',
          labelEn: '90° (360° / 4 = 90°)',
          correct: true
        },
        { labelRo: '45°', labelEn: '45°', correct: false },
        { labelRo: '60°', labelEn: '60°', correct: false },
        { labelRo: '360°', labelEn: '360°', correct: false }
      ],
      explanationRo: 'Pentru un pătrat cu 4 laturi, unghiul exterior de rotație la fiecare colț este 360° / 4 = 90°.',
      explanationEn: 'For a 4-sided square, the exterior rotation angle at each corner is 360° / 4 = 90°.'
    },
    {
      questionRo: 'Câte linii de cod economisim folosind o buclă for (int i = 1; i <= n; i++) față de scrierea comenzilor una sub alta?',
      questionEn: 'How many lines of code do we save using a for loop (int i = 1; i <= n; i++) compared to writing sequential statements?',
      code: null,
      options: [
        {
          labelRo: 'În loc de 2*n comenzi repetate identic, scriem doar 2 instrucțiuni în interiorul buclei',
          labelEn: 'Instead of 2*n identical repeated commands, we write only 2 instructions inside the loop body',
          correct: true
        },
        {
          labelRo: 'Niciuna, codul este la fel de lung',
          labelEn: 'None, the code is equally long',
          correct: false
        },
        {
          labelRo: 'Doar 1 linie',
          labelEn: 'Only 1 line',
          correct: false
        },
        {
          labelRo: 'Nu putem folosi bucle pentru roboți',
          labelEn: 'We cannot use loops for robots',
          correct: false
        }
      ],
      explanationRo: 'Pentru un octogon (n=8) am fi scris 16 linii repetitive de cod. Cu bucla for scriem doar 3 rânduri elegante!',
      explanationEn: 'For an octagon (n=8) we would have written 16 repetitive lines of code. With the for loop we write only 3 elegant lines!'
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

  const POLYGON_OPTIONS = [
    { n: 3, labelRo: 'Triunghi (120°)', labelEn: 'Triangle (120°)' },
    { n: 4, labelRo: 'Pătrat (90°)', labelEn: 'Square (90°)' },
    { n: 5, labelRo: 'Pentagon (72°)', labelEn: 'Pentagon (72°)' },
    { n: 6, labelRo: 'Hexagon (60°)', labelEn: 'Hexagon (60°)' },
    { n: 8, labelRo: 'Octogon (45°)', labelEn: 'Octagon (45°)' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/80 via-emerald-900/80 to-slate-900 p-6 rounded-3xl border border-teal-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30 mb-2">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>{lang === 'ro' ? 'Nivelul 2 din 7 • Modulul 4F' : 'Level 2 of 7 • Module 4F'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro' ? (
                <>Traiectorii Geometrice &amp; Unghiul de Viraj <span className="text-cyan-300 font-mono">360° / n</span> (Manual pag. 104)</>
              ) : (
                <>Geometric Trajectories &amp; Turn Angle <span className="text-cyan-300 font-mono">360° / n</span> (Textbook p. 104)</>
              )}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro' ? (
                <>Învață cum combină roboții structura repetitivă <span className="text-teal-300 font-mono font-bold">for</span> cu geometria plană pentru a parcurge poligoane regulate: triunghi, pătrat, hexagon și octogon.</>
              ) : (
                <>Learn how robots combine the <span className="text-teal-300 font-mono font-bold">for</span> loop with plane geometry to navigate regular polygons: triangle, square, hexagon, and octagon.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-teal-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>+15 XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Educational Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-teal-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-teal-400" />
          <span>
            {lang === 'ro'
              ? 'Formula Universală de Navigație Poligonală: Rotație = 360° / n'
              : 'Universal Polygon Navigation Formula: Turn = 360° / n'}
          </span>
        </div>

        {/* Polygons Selection Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro' ? 'Alege Poligonul:' : 'Select Polygon:'}
            </span>
            {POLYGON_OPTIONS.map((p) => {
              const label = lang === 'ro' ? p.labelRo : p.labelEn;
              return (
                <button
                  key={p.n}
                  type="button"
                  onClick={() => handleReset(p.n)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    sides === p.n
                      ? 'bg-teal-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartTrace}
              disabled={isTracing}
              className="py-1.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 text-white font-bold text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{lang === 'ro' ? 'Pornește Robotul' : 'Launch Robot'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleReset()}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title={lang === 'ro' ? 'Resetează traseul' : 'Reset path'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live 2D Robot Simulator Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          {/* SVG Canvas Tracing Area */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[320px]">
            <svg width="300" height="300" className="overflow-visible">
              {/* Target outline polygon */}
              <polygon
                points={vertices.map(v => `${v.x},${v.y}`).join(' ')}
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Traced edges */}
              {Array.from({ length: activeEdge }).map((_, idx) => {
                const p1 = vertices[idx];
                const p2 = vertices[(idx + 1) % sides];
                return (
                  <line
                    key={idx}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#14b8a6"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Vertex nodes */}
              {vertices.map((v, idx) => {
                const isReached = idx < activeEdge;
                return (
                  <circle
                    key={idx}
                    cx={v.x}
                    cy={v.y}
                    r={isReached ? 6 : 4}
                    fill={isReached ? '#14b8a6' : '#64748b'}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Virtual Robot Icon at current position */}
              {(() => {
                const currentVertex = vertices[Math.min(activeEdge, sides - 1)];
                return (
                  <g transform={`translate(${currentVertex.x - 14}, ${currentVertex.y - 14})`}>
                    <circle cx="14" cy="14" r="14" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2" />
                    <text x="14" y="19" fontSize="14" textAnchor="middle" fill="white">🤖</text>
                  </g>
                );
              })()}
            </svg>

            <div className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-3">
              <span>
                {lang === 'ro' ? 'Laturi trasate: ' : 'Traced sides: '}
                <strong className="text-teal-300">{activeEdge} / {sides}</strong>
              </span>
              <span>
                {lang === 'ro' ? 'Unghi de rotație la vârf: ' : 'Turn angle at vertex: '}
                <strong className="text-amber-300">{exteriorAngle}°</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic C++ Code & Explanation */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300">
              <span className="text-slate-500 block mb-1.5">
                {lang === 'ro'
                  ? `// Cod C++ pentru traiectorie poligon cu ${sides} laturi:`
                  : `// C++ code for polygon trajectory with ${sides} sides:`}
              </span>
              <div className="text-purple-400 font-bold">#include &lt;robotica.h&gt;</div>
              <div className="mt-2 text-slate-400"><span className="text-purple-400 font-bold">for</span> (int i = 1; i &lt;= {sides}; i++) &#123;</div>
              <div className="pl-4 text-emerald-300">robot.inainte(100); <span className="text-slate-500">// {lang === 'ro' ? 'pas de 100 cm' : '100 cm step'}</span></div>
              <div className="pl-4 text-amber-300">robot.rotesteDreapta({exteriorAngle}); <span className="text-slate-500">// 360 / {sides}</span></div>
              <div className="text-slate-400">&#125;</div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 text-xs text-slate-300">
              <span className="font-bold text-teal-300 block mb-1">
                {lang === 'ro' ? 'De ce funcționează formula 360° / n?' : 'Why does the 360° / n formula work?'}
              </span>
              <p className="leading-relaxed text-[11px]">
                {lang === 'ro' ? (
                  <>Când un rover parcurge o traiectorie închisă și revine la orientarea inițială, acesta face o rotație completă de <strong>360 de grade</strong>. Deoarece poligonul regulat are laturi și unghiuri egale, fiecare dintre cele <code>n</code> viraje trebuie să aibă exact <code>360 / n</code> grade!</>
                ) : (
                  <>When a rover travels along a closed trajectory and returns to its initial orientation, it completes a full <strong>360-degree</strong> turn. Since a regular polygon has equal sides and angles, each of the <code>n</code> turns must be exactly <code>360 / n</code> degrees!</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>
                {lang === 'ro'
                  ? `Verificare Înțelegere: Traiectorii Robotice (${challengeStep + 1} din ${CHALLENGES.length})`
                  : `Comprehension Check: Robot Trajectories (${challengeStep + 1} of ${CHALLENGES.length})`}
              </span>
            </div>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {lang === 'ro' ? CHALLENGES[challengeStep].questionRo : CHALLENGES[challengeStep].questionEn}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-teal-300 whitespace-pre">
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
                  className="self-end py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {challengeStep < CHALLENGES.length - 1
                      ? lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question'
                      : lang === 'ro' ? 'Finalizează Nivelul 2' : 'Complete Level 2'}
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
                {lang === 'ro' ? 'Nivelul 2 Finalizat cu Succes!' : 'Level 2 Completed Successfully!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {lang === 'ro'
                  ? 'Stăpânești formula rotației poligonale 360°/n și coordonarea buclei for cu comenzile de deplasare ale robotului.'
                  : 'You mastered the polygon rotation formula 360°/n and coordinating the for loop with robot motion commands.'}
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {lang === 'ro' ? 'Treci la Nivelul 3: Senzorul Ultrasonic de Distanță' : 'Proceed to Level 3: Ultrasonic Distance Sensor'}
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
