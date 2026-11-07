import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  Eye,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

type SensorState = 'center' | 'left_drift' | 'right_drift' | 'stop_line';

export const RobotLevel4_LineTrackingSensor: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [selectedState, setSelectedState] = useState<SensorState>('center');

  // Challenge State
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  const getStateDetails = (st: SensorState) => {
    switch (st) {
      case 'center':
        return {
          leftVal: 0,
          rightVal: 0,
          actionRo: 'AVANSARE ÎNAINTE (Viteză Simetrică)',
          actionEn: 'ADVANCE FORWARD (Symmetric Speed)',
          motorL: '100%',
          motorR: '100%',
          explanationRo: 'Ambii senzori văd ALB (suprafață reflectantă). Traseul negru se află exact între ei.',
          explanationEn: 'Both sensors see WHITE (reflective floor). The black track is centered directly between them.',
          badgeColor: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
        };
      case 'left_drift':
        return {
          leftVal: 1,
          rightVal: 0,
          actionRo: 'CORECȚIE: VIRAJ STÂNGA',
          actionEn: 'CORRECTION: TURN LEFT',
          motorL: lang === 'ro' ? '0% (Frână)' : '0% (Brake)',
          motorR: lang === 'ro' ? '100% (Avans)' : '100% (Forward)',
          explanationRo: 'Senzorul din stânga a atins banda NEAGRĂ. Robotul virează spre stânga pentru a reintra pe traseu.',
          explanationEn: 'The left sensor hit the BLACK tape. The robot pivots left to re-align onto the line.',
          badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-500/40'
        };
      case 'right_drift':
        return {
          leftVal: 0,
          rightVal: 1,
          actionRo: 'CORECȚIE: VIRAJ DREAPTA',
          actionEn: 'CORRECTION: TURN RIGHT',
          motorL: lang === 'ro' ? '100% (Avans)' : '100% (Forward)',
          motorR: lang === 'ro' ? '0% (Frână)' : '0% (Brake)',
          explanationRo: 'Senzorul din dreapta a atins banda NEAGRĂ. Robotul virează spre dreapta pentru a reintra pe traseu.',
          explanationEn: 'The right sensor hit the BLACK tape. The robot pivots right to re-align onto the line.',
          badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-500/40'
        };
      case 'stop_line':
        return {
          leftVal: 1,
          rightVal: 1,
          actionRo: 'STOP TOTAL (Linie Transversală)',
          actionEn: 'FULL STOP (Perpendicular Line)',
          motorL: '0%',
          motorR: '0%',
          explanationRo: 'Ambii senzori văd NEGRU simultan. S-a atins linia de sosire sau o intersecție de trasee!',
          explanationEn: 'Both sensors read BLACK simultaneously. Finish line or course intersection reached!',
          badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/40'
        };
    }
  };

  const currentDetails = getStateDetails(selectedState);

  const handleSelectState = (st: SensorState) => {
    sounds.playClick();
    setSelectedState(st);
  };

  const CHALLENGES = [
    {
      questionRo: 'De ce o bandă neagră pe fundal alb generează semnalul digital 1 (HIGH) la senzorul optic de linie?',
      questionEn: 'Why does black tape on a white floor generate digital signal 1 (HIGH) at the line tracking sensor?',
      code: '// Senzor Infrarosu (IR):\n// Suprafata alba -> reflecta lumina -> Receptor ON (0)\n// Banda neagra  -> absoarbe lumina -> Receptor OFF (1)',
      options: [
        {
          labelRo: 'Culoarea neagră absoarbe razele infraroșii, iar receptorul optic nu mai primește reflexie',
          labelEn: 'Black color absorbs infrared rays, preventing the photodiode receiver from receiving reflected light',
          correct: true
        },
        {
          labelRo: 'Culoarea neagră este mai fierbinte',
          labelEn: 'Black color is hotter in temperature',
          correct: false
        },
        {
          labelRo: 'Senzorul detectează greutatea benzii izolatoare',
          labelEn: 'The sensor measures the physical weight of the electrical tape',
          correct: false
        },
        {
          labelRo: 'Este o setare inversată manual de profesor',
          labelEn: 'It is a custom inverted setting configured by the teacher',
          correct: false
        }
      ],
      explanationRo: 'Fizica optică: albul reflectă lumina infraroșie, iar negrul o absoarbe, determinând căderea semnalului recepționat!',
      explanationEn: 'Optical physics: white reflects infrared rays while black absorbs them, cutting off the reflected receiver signal!'
    },
    {
      questionRo: 'Dacă senzorul din stânga atinge banda neagră (S1 = 1, S2 = 0), ce trebuie să facă motoarele?',
      questionEn: 'If the left sensor touches the black line (S1 = 1, S2 = 0), how should the motors respond?',
      code: 'if (s1 == 1 && s2 == 0) {\n    // Ce comanda executam?\n}',
      options: [
        {
          labelRo: 'Să vireze stânga: oprește motorul stâng și accelerează motorul drept',
          labelEn: 'Steer left: halt the left wheel motor and power the right wheel motor',
          correct: true
        },
        {
          labelRo: 'Să meargă cu viteză maximă înapoi',
          labelEn: 'Reverse backwards at maximum speed',
          correct: false
        },
        {
          labelRo: 'Să accelereze ambele motoare',
          labelEn: 'Accelerate both motors forward',
          correct: false
        },
        {
          labelRo: 'Să claxoneze și să se oprească',
          labelEn: 'Beep the buzzer and stop permanently',
          correct: false
        }
      ],
      explanationRo: 'Dacă senzorul stâng a ieșit pe negru, înseamnă că robotul a fugit spre dreapta! Pentru a reveni, roata stângă încetinește, iar roata dreaptă împinge spre stânga.',
      explanationEn: 'If the left sensor hits black, the robot drifted right! To recover, left wheel brakes while right wheel pushes forward to pivot left.'
    },
    {
      questionRo: 'Ce indică situația în care ambii senzori citesc 1 (S1 == 1 && S2 == 1)?',
      questionEn: 'What does it indicate when both sensors read 1 (S1 == 1 && S2 == 1)?',
      code: 'if (s1 == 1 && s2 == 1) robot.stop();',
      options: [
        {
          labelRo: 'Linie de sosire sau traversare perpendiculară (oprire finală)',
          labelEn: 'Finish line or perpendicular intersection (final stop)',
          correct: true
        },
        {
          labelRo: 'Robotul a căzut de pe masă',
          labelEn: 'The robot fell off the workbench',
          correct: false
        },
        {
          labelRo: 'Bateria este descărcată',
          labelEn: 'The battery is depleted',
          correct: false
        },
        {
          labelRo: 'Eroare de compilare C++',
          labelEn: 'C++ compilation syntax error',
          correct: false
        }
      ],
      explanationRo: 'Dacă ambele fotodiode citesc negru simultan, robotul a traversat o bandă groasă orizontală, folosită ca reper de START/STOP sau intersecție!',
      explanationEn: 'If both sensors read black simultaneously, the robot crossed a thick crosswise band marking START/FINISH or track intersection!'
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

  const STATE_ITEMS = [
    { id: 'center', labelRo: '1. Centrat pe Linie [0, 0]', labelEn: '1. Centered on Line [0, 0]', icon: '⬆️' },
    { id: 'left_drift', labelRo: '2. Deviat Dreapta [1, 0]', labelEn: '2. Drifted Right [1, 0]', icon: '⬅️' },
    { id: 'right_drift', labelRo: '3. Deviat Stânga [0, 1]', labelEn: '3. Drifted Left [0, 1]', icon: '➡️' },
    { id: 'stop_line', labelRo: '4. Linie Sosire [1, 1]', labelEn: '4. Finish Line [1, 1]', icon: '🛑' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 mb-2">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ro' ? 'Nivelul 4 din 7 • Modulul 4F' : 'Level 4 of 7 • Module 4F'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro'
                ? 'Senzorul Optic de Linie (Line Tracking) & Urmărirea Traseului (Manual pag. 105)'
                : 'Optical Line Tracking Sensor & Path Following (Textbook p. 105)'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro'
                ? 'Înțelege reflexia luminii infraroșii (IR), citirea binară a suprafeței (Alb = 0, Negru = 1) și algoritmul decizional de viraj proporțional cu două fotodiode.'
                : 'Understand infrared (IR) light reflection, binary floor reading (White = 0, Black = 1), and differential steering logic with dual optical sensors.'}
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
              ? 'Matricea Celor 4 Stări Logice ale Urmăritorului de Linie'
              : 'The 4 Logic States Matrix of the Line Follower'}
          </span>
        </div>

        {/* State Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {STATE_ITEMS.map((item) => {
            const label = lang === 'ro' ? item.labelRo : item.labelEn;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectState(item.id as SensorState)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedState === item.id
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950/60 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-mono font-bold">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Line Tracking Simulator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Visual Floor & Robot with Dual Sensors */}
            <div className="lg:col-span-6 bg-slate-100 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px] shadow-inner">
              {/* Black Tape Track */}
              <div className="absolute top-0 bottom-0 w-12 bg-slate-900 border-x border-slate-800" />

              {/* Robot Top-Down View */}
              <div
                className={`w-32 h-36 rounded-2xl bg-slate-800 border-2 border-emerald-500 p-3 shadow-2xl relative transition-transform duration-300 z-10 ${
                  selectedState === 'left_drift' ? '-rotate-12 translate-x-4' : selectedState === 'right_drift' ? 'rotate-12 -translate-x-4' : ''
                }`}
              >
                {/* Wheels Left & Right */}
                <div className="absolute -left-2.5 top-6 bottom-6 w-2.5 bg-slate-900 border border-slate-700 rounded-l" />
                <div className="absolute -right-2.5 top-6 bottom-6 w-2.5 bg-slate-900 border border-slate-700 rounded-r" />

                {/* Front Dual IR Sensors */}
                <div className="flex justify-between items-center pt-1 mb-2 px-1">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold ${currentDetails.leftVal === 1 ? 'bg-slate-950 text-white border-rose-400' : 'bg-slate-200 text-slate-800 border-emerald-400'}`}>
                    S1
                  </div>
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold ${currentDetails.rightVal === 1 ? 'bg-slate-950 text-white border-rose-400' : 'bg-slate-200 text-slate-800 border-emerald-400'}`}>
                    S2
                  </div>
                </div>

                {/* Robot Microcontroller Body */}
                <div className="bg-slate-900 rounded-xl p-2 text-center text-[10px] font-mono text-emerald-300 border border-slate-700">
                  <span>ROVER 7</span>
                  <div className="text-[9px] text-slate-400 mt-1">
                    L:{currentDetails.motorL} | R:{currentDetails.motorR}
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic & Truth Table */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-3">
              <div className={`p-4 rounded-2xl border text-xs ${currentDetails.badgeColor}`}>
                <div className="text-[10px] font-mono uppercase tracking-wider opacity-80 mb-1">
                  {lang === 'ro' ? 'Decizie Algoritmică:' : 'Algorithmic Decision:'}
                </div>
                <h4 className="text-base font-black font-mono mb-1.5">
                  {lang === 'ro' ? currentDetails.actionRo : currentDetails.actionEn}
                </h4>
                <p className="text-[11px] leading-relaxed">
                  {lang === 'ro' ? currentDetails.explanationRo : currentDetails.explanationEn}
                </p>
              </div>

              {/* Code Snippet */}
              <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300">
                <span className="text-slate-500 block mb-1">
                  {lang === 'ro' ? '// Cod C++ Line Follower:' : '// C++ Line Follower Code:'}
                </span>
                <div><span className="text-purple-400 font-bold">int</span> s1 = robot.citesteLinieStanga(); <span className="text-slate-500">// {currentDetails.leftVal}</span></div>
                <div><span className="text-purple-400 font-bold">int</span> s2 = robot.citesteLinieDreapta(); <span className="text-slate-500">// {currentDetails.rightVal}</span></div>
                <div className="mt-2"><span className="text-purple-400 font-bold">if</span> (s1 == 0 && s2 == 0) robot.inainte(100);</div>
                <div><span className="text-purple-400 font-bold">else if</span> (s1 == 1 && s2 == 0) robot.vireazaStanga();</div>
                <div><span className="text-purple-400 font-bold">else if</span> (s1 == 0 && s2 == 1) robot.vireazaDreapta();</div>
                <div><span className="text-purple-400 font-bold">else if</span> (s1 == 1 && s2 == 1) robot.stop();</div>
              </div>
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
                  ? `Verificare Înțelegere: Urmărirea Liniei (${challengeStep + 1} din ${CHALLENGES.length})`
                  : `Comprehension Check: Line Tracking (${challengeStep + 1} of ${CHALLENGES.length})`}
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
                      : lang === 'ro' ? 'Finalizează Nivelul 4' : 'Complete Level 4'}
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
                {lang === 'ro' ? 'Nivelul 4 Finalizat cu Succes!' : 'Level 4 Completed Successfully!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {lang === 'ro'
                  ? 'Stăpânești logica binară a senzorilor optici de linie, corecțiile diferențiate ale motoarelor și detectarea punctelor de oprire.'
                  : 'You mastered binary optical line tracking, differential steering corrections, and endpoint detection.'}
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {lang === 'ro' ? 'Treci la Nivelul 5: Navigare Autonomă în Labirint (RoboSim)' : 'Proceed to Level 5: Autonomous Maze Navigation (RoboSim)'}
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
