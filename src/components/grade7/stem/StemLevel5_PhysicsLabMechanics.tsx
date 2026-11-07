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
  Activity,
  HelpCircle,
  Gauge,
  Flame,
  Zap
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

export const StemLevel5_PhysicsLabMechanics: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Sled Simulation Physics Parameters
  const [mass, setMass] = useState<number>(30); // kg
  const [distance, setDistance] = useState<number>(20); // meters
  const [mu, setMu] = useState<number>(0.1); // friction coefficient (zăpadă)
  const [time, setTime] = useState<number>(5); // seconds
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [sledPos, setSledPos] = useState<number>(0); // 0 to 100%

  // Physics calculations (g = 9.8 N/kg)
  const g = 9.8;
  const fFrecare = Number((mu * mass * g).toFixed(2)); // N
  const lucruMecanic = Number((fFrecare * distance).toFixed(2)); // Joules
  const putereMecanica = Number((lucruMecanic / time).toFixed(2)); // Watts
  const vitezaMedie = Number((distance / time).toFixed(2)); // m/s
  const vitezaKmh = Number((vitezaMedie * 3.6).toFixed(1)); // km/h

  // Challenges
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  const handleLaunchSled = () => {
    sounds.playClick();
    setIsSimulating(true);
    setSledPos(0);

    const interval = setInterval(() => {
      setSledPos((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setIsSimulating(false);
          sounds.playCorrect();
          return 95;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleResetSled = () => {
    sounds.playClick();
    setSledPos(0);
    setIsSimulating(false);
  };

  const CHALLENGES = [
    {
      questionRo: 'Care este formula corectă în C++ pentru calculul forței de frecare a unei sănii pe zăpadă (Manual pag. 97)?',
      questionEn: 'What is the correct C++ formula to calculate friction force for a sled on snow (Textbook p. 97)?',
      code: '// m = masa in kg, mu = coeficientul de frecare, g = 9.8 N/kg\ndouble Ff = ???;',
      optionsRo: [
        { label: 'double Ff = mu * m * 9.8;', correct: true },
        { label: 'double Ff = m / mu + 9.8;', correct: false },
        { label: 'double Ff = m * m * 9.8;', correct: false },
        { label: 'double Ff = mu * 9.8 / m;', correct: false }
      ],
      optionsEn: [
        { label: 'double Ff = mu * m * 9.8;', correct: true },
        { label: 'double Ff = m / mu + 9.8;', correct: false },
        { label: 'double Ff = m * m * 9.8;', correct: false },
        { label: 'double Ff = mu * 9.8 / m;', correct: false }
      ],
      explanationRo: 'Forța de frecare la alunecare este proporțională cu apăsarea normală (greutatea G = m * g): Ff = μ * m * g!',
      explanationEn: 'Sliding friction force is proportional to the normal contact force (weight G = m * g): Ff = μ * m * g!'
    },
    {
      questionRo: 'Dacă o forță constantă de 50 N deplasează sania pe o distanță de 10 metri, cât este Lucrul Mecanic L?',
      questionEn: 'If a constant force of 50 N pulls the sled over 10 meters, what is the Mechanical Work L?',
      code: 'double F = 50.0;\ndouble d = 10.0;\ndouble L = F * d; // Formula: L = F * d',
      optionsRo: [
        { label: '500 Jouli (J)', correct: true },
        { label: '60 Jouli', correct: false },
        { label: '5 Jouli', correct: false },
        { label: '5000 Wați', correct: false }
      ],
      optionsEn: [
        { label: '500 Joules (J)', correct: true },
        { label: '60 Joules', correct: false },
        { label: '5 Joules', correct: false },
        { label: '5000 Watts', correct: false }
      ],
      explanationRo: 'Lucrul mecanic este produsul scalar dintre forță și deplasare: L = 50 N × 10 m = 500 Jouli (J).',
      explanationEn: 'Mechanical work is the product of force and displacement: L = 50 N × 10 m = 500 Joules (J).'
    },
    {
      questionRo: 'De ce folosim tipul de date „double” în loc de „int” pentru formulele de fizică?',
      questionEn: 'Why do we use the "double" data type instead of "int" for physics equations?',
      code: 'double viteza = d / t;',
      optionsRo: [
        { label: 'Pentru că mărimile din fizică (accelerație, coeficient de frecare, viteză) au zecimale și nu sunt întregi', correct: true },
        { label: 'Pentru că int nu funcționează cu bucla for', correct: false },
        { label: 'Pentru că fizica acceptă doar numere negative', correct: false },
        { label: 'Este doar o recomandare opțională fără impact', correct: false }
      ],
      optionsEn: [
        { label: 'Because physical quantities (acceleration, friction coefficient, velocity) possess decimal precision', correct: true },
        { label: 'Because int does not work with a for loop', correct: false },
        { label: 'Because physics only accepts negative values', correct: false },
        { label: 'It is merely a cosmetic choice with no calculation impact', correct: false }
      ],
      explanationRo: 'Dacă am folosi int, o împărțire precum 25 / 10 ar da 2 în loc de 2.5! Tipul double păstrează precizia zecimală exactă.',
      explanationEn: 'If int were used, 25 / 10 would truncate to 2 instead of 2.5! double preserves accurate decimal fractions.'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const opts = lang === 'ro' ? CHALLENGES[qIdx].optionsRo : CHALLENGES[qIdx].optionsEn;
    const isCorrect = opts[optIdx].correct;
    const explanation = lang === 'ro' ? CHALLENGES[qIdx].explanationRo : CHALLENGES[qIdx].explanationEn;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback((lang === 'ro' ? 'Corect! ' : 'Correct! ') + explanation);
    } else {
      sounds.playWrong();
      setChallengeFeedback((lang === 'ro' ? 'Incorect. ' : 'Incorrect. ') + explanation);
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
      <div className="bg-gradient-to-r from-blue-900/80 via-cyan-900/80 to-slate-900 p-6 rounded-3xl border border-cyan-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30 mb-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ro' ? 'Nivelul 5 din 7 • Modulul 4E' : 'Level 5 of 7 • Module 4E'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro' ? (
                <>Laboratorul STEM de Fizică în C++: Mișcarea &amp; Forțele (Manual pag. 96–99)</>
              ) : (
                <>Physics STEM Lab in C++: Motion &amp; Forces (Textbook p. 96–99)</>
              )}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro'
                ? 'Simulează alunecarea unei sănii pe zăpadă. Conectează informatica cu fizica prin calculul vitezei medii, forței de frecare, lucrului mecanic și puterii motorii.'
                : 'Simulate a sled sliding over snow. Connect computing with physics by determining average speed, friction force, work, and mechanical power.'}
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
              ? 'Formulele Oficiale de Fizică (Clasa a VII-a, Unitatea 4)'
              : 'Official Physics Formulas (Grade 7, Unit 4)'}
          </span>
        </div>

        {/* Physics Formula Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              {lang === 'ro' ? 'Viteză Medie' : 'Average Speed'}
            </span>
            <span className="text-base font-black font-mono text-cyan-300">v = d / t</span>
            <span className="text-[11px] text-slate-400 font-mono block mt-1">{vitezaMedie} m/s ({vitezaKmh} km/h)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              {lang === 'ro' ? 'Forță de Frecare' : 'Friction Force'}
            </span>
            <span className="text-base font-black font-mono text-amber-300">Ff = μ · m · g</span>
            <span className="text-[11px] text-slate-400 font-mono block mt-1">
              {fFrecare} {lang === 'ro' ? 'Newtoni (N)' : 'Newtons (N)'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              {lang === 'ro' ? 'Lucru Mecanic' : 'Mechanical Work'}
            </span>
            <span className="text-base font-black font-mono text-emerald-300">L = F · d</span>
            <span className="text-[11px] text-slate-400 font-mono block mt-1">
              {lucruMecanic} {lang === 'ro' ? 'Jouli (J)' : 'Joules (J)'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              {lang === 'ro' ? 'Putere Mecanică' : 'Mechanical Power'}
            </span>
            <span className="text-base font-black font-mono text-purple-300">P = L / t</span>
            <span className="text-[11px] text-slate-400 font-mono block mt-1">
              {putereMecanica} {lang === 'ro' ? 'Wați (W)' : 'Watts (W)'}
            </span>
          </div>
        </div>

        {/* Interactive Physics Playground */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>
                  {lang === 'ro'
                    ? 'Simulator Sanie pe Zăpadă (Art Klett pag. 97)'
                    : 'Sled on Snow Simulator (Art Klett p. 97)'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ro'
                  ? 'Reglează masa, distanța și coeficientul de frecare pentru a calcula automat efortul necesar.'
                  : 'Adjust mass, distance, and friction coefficient to compute required work automatically.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLaunchSled}
                disabled={isSimulating}
                className="py-1.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{lang === 'ro' ? 'Lansează Cursa' : 'Launch Race'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetSled}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sled Simulation Visual Track */}
          <div className="relative bg-gradient-to-b from-sky-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 mb-5 overflow-hidden h-36 flex flex-col justify-end">
            <div className="absolute top-2 left-6 text-2xl select-none opacity-40">🏔️</div>
            <div className="absolute top-4 left-32 text-xl select-none opacity-30">🌲</div>
            <div className="absolute top-3 right-20 text-2xl select-none opacity-40">🏔️</div>

            {/* Sled Runner Track */}
            <div className="relative w-full border-b-4 border-cyan-400/60 pb-1">
              <div
                className="absolute -top-7 transition-all duration-100 flex items-center gap-1"
                style={{ left: `${sledPos}%` }}
              >
                <span className="text-2xl transform scale-x-[-1] select-none">🛷</span>
                {isSimulating && (
                  <span className="text-xs font-mono font-bold text-cyan-300 animate-pulse">
                    💨 {vitezaKmh} km/h
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
              <span>START (0 m)</span>
              <span>{lang === 'ro' ? `Distanta parcursă: ${distance} m` : `Traversed distance: ${distance} m`}</span>
              <span>FINISH ({distance} m)</span>
            </div>
          </div>

          {/* Physics Sliders Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl mb-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>{lang === 'ro' ? 'Masa saniei (m):' : 'Sled mass (m):'}</span>
                <span className="text-cyan-300 font-bold">{mass} kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>{lang === 'ro' ? 'Distanța (d):' : 'Distance (d):'}</span>
                <span className="text-cyan-300 font-bold">{distance} m</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>{lang === 'ro' ? 'Frecare (μ):' : 'Friction (μ):'}</span>
                <span className="text-amber-300 font-bold">
                  {mu} ({mu <= 0.08 ? (lang === 'ro' ? 'Gheață' : 'Ice') : (lang === 'ro' ? 'Zăpadă' : 'Snow')})
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.01"
                value={mu}
                onChange={(e) => setMu(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>{lang === 'ro' ? 'Timp parcurs (t):' : 'Elapsed time (t):'}</span>
                <span className="text-purple-300 font-bold">{time} s</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="1"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Generated C++ Code Box */}
          <div className="bg-black/90 border border-slate-800 p-3.5 rounded-xl font-mono text-xs text-slate-300">
            <span className="text-slate-500 block mb-1">
              {lang === 'ro' ? '// Cod C++ generat dinamic pentru valorile curente:' : '// Dynamically generated C++ code for current parameters:'}
            </span>
            <div><span className="text-purple-400 font-bold">double</span> m = {mass}, d = {distance}, mu = {mu}, t = {time}, g = 9.8;</div>
            <div><span className="text-purple-400 font-bold">double</span> Ff = mu * m * g; <span className="text-slate-500">// {fFrecare} N</span></div>
            <div><span className="text-purple-400 font-bold">double</span> L = Ff * d; <span className="text-slate-500">// {lucruMecanic} J</span></div>
            <div><span className="text-purple-400 font-bold">double</span> P = L / t; <span className="text-slate-500">// {putereMecanica} W</span></div>
          </div>
        </div>

        {/* Practice Challenge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>
                {lang === 'ro'
                  ? `Verificare Înțelegere: Fizică Aplicată în C++ (${challengeStep + 1} din ${CHALLENGES.length})`
                  : `Comprehension Check: Applied Physics in C++ (${challengeStep + 1} of ${CHALLENGES.length})`}
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
                {(lang === 'ro' ? CHALLENGES[challengeStep].optionsRo : CHALLENGES[challengeStep].optionsEn).map((opt, oIdx) => {
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
                      ? (lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question')
                      : (lang === 'ro' ? 'Finalizează Nivelul 5' : 'Complete Level 5')}
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
                {lang === 'ro' ? 'Nivelul 5 Finalizat cu Succes!' : 'Level 5 Successfully Completed!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {lang === 'ro'
                  ? 'Ai calculat corect forța de frecare, lucrul mecanic și puterea, folosind variabile reale de tip double și formule de fizică în C++.'
                  : 'You calculated friction force, work, and power correctly using double precision variables and physics equations in C++.'}
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {lang === 'ro'
                    ? 'Treci la Nivelul 6: Laboratorul STEM de Geografie & Statistică'
                    : 'Proceed to Level 6: Geography & Statistics STEM Lab'}
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
