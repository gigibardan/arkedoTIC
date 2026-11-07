import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  AlertTriangle,
  RotateCcw,
  Printer,
  ShieldCheck,
  Check,
  GraduationCap
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
  studentName?: string;
}

interface Question {
  id: string;
  questionRo: string;
  questionEn: string;
  codeSnippet?: string;
  options: {
    textRo: string;
    textEn: string;
    isCorrect: boolean;
  }[];
  explanationRo: string;
  explanationEn: string;
}

const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    questionRo: 'Cum calculează senzorul ultrasonic distanța până la un obstacol folosind undele sonore?',
    questionEn: 'How does the ultrasonic sensor calculate the distance to an obstacle using sound waves?',
    codeSnippet: 'double distanta = (durataMicrosecunde * 0.0343) / 2.0;',
    options: [
      {
        textRo: 'd = (v · Δt) / 2, deoarece unda parcurge distanța dus-întors (de la emițător la obstacol și înapoi la receptor)',
        textEn: 'd = (v · Δt) / 2, because the sound wave travels a round-trip path (transmitter to obstacle and back to receiver)',
        isCorrect: true
      },
      {
        textRo: 'd = v · Δt · 2, prin dublarea vitezei aerului',
        textEn: 'd = v · Δt · 2, by doubling the air sound velocity',
        isCorrect: false
      },
      {
        textRo: 'Distanța este egală cu frecvența sonoră de 40 kHz',
        textEn: 'Distance is equal to the 40 kHz acoustic frequency',
        isCorrect: false
      },
      {
        textRo: 'Măsurând intensitatea luminoasă a laserului de ghidaj',
        textEn: 'By measuring the light intensity of the guide laser',
        isCorrect: false
      }
    ],
    explanationRo: 'Sunetul călătorește cu aproximativ 340 m/s (0.034 cm/μs). Împărțirea la 2 este indispensabilă deoarece timpul măsurat cuprinde atât drumul de plecare cât și ecoul reflectat.',
    explanationEn: 'Sound travels at approximately 340 m/s (0.034 cm/μs). Dividing by 2 is essential because the measured duration covers both outbound propagation and reflected echo.'
  },
  {
    id: 'q2',
    questionRo: 'Dacă ambii senzori optici de urmărire a liniei (infraroșu) returnează valoarea 0 (alb), cum trebuie comandate motoarele?',
    questionEn: 'If both optical line tracking sensors (infrared) return value 0 (white floor), how must motors be commanded?',
    codeSnippet: 'if (sL == 0 && sR == 0) {\n    robot.inainte(10); // ambele motoare merg cu viteză egală\n}',
    options: [
      {
        textRo: 'Ambele motoare avansează cu viteză egală, linia neagră fiind perfect centrată între senzori',
        textEn: 'Both motors advance at equal speed, the black line being centered precisely between both sensors',
        isCorrect: true
      },
      {
        textRo: 'Robotul oprește motoarele și declanșează claxonul',
        textEn: 'The robot stops both motors and sounds the alarm horn',
        isCorrect: false
      },
      {
        textRo: 'Motorul stâng accelerează la maximum, iar cel drept este oprit',
        textEn: 'The left motor accelerates to maximum while the right motor stops',
        isCorrect: false
      },
      {
        textRo: 'Robotul inversează sensul de mers înapoi',
        textEn: 'The robot reverses direction backwards',
        isCorrect: false
      }
    ],
    explanationRo: 'Când ambii senzori văd alb (lumină reflectată), înseamnă că robotul este centrat optim deasupra benzii negre, deci continuă înainte în linie dreaptă.',
    explanationEn: 'When both sensors see white (reflected IR light), it signifies the robot is centered over the black tape, maintaining a straight forward path.'
  },
  {
    id: 'q3',
    questionRo: 'Pentru a programa robotul să traseze un hexagon regulat cu 6 laturi egale, care este unghiul de viraj la fiecare vârf?',
    questionEn: 'To program the robot to trace a regular hexagon with 6 equal sides, what is the turn angle at each vertex?',
    codeSnippet: 'for (int i = 1; i <= 6; i++) {\n    robot.inainte(latura);\n    robot.vireazaDreapta(360 / 6); // 60 grade\n}',
    options: [
      {
        textRo: '60° (formula unghiului exterior: 360° / n = 360° / 6)',
        textEn: '60° (exterior angle formula: 360° / n = 360° / 6)',
        isCorrect: true
      },
      {
        textRo: '120° (unghiul interior al figurii)',
        textEn: '120° (interior angle of the hexagon)',
        isCorrect: false
      },
      {
        textRo: '90° (unghi drept)',
        textEn: '90° (right angle)',
        isCorrect: false
      },
      {
        textRo: '180° (întoarcere completă)',
        textEn: '180° (complete turnaround)',
        isCorrect: false
      }
    ],
    explanationRo: 'La oricare poligon regulat convex cu n laturi, suma unghiurilor exterioare de viraj este de 360°. Pentru hexagon, fiecare viraj are 360° / 6 = 60°.',
    explanationEn: 'For any convex regular polygon with n sides, the sum of exterior turn angles is 360°. For a hexagon, each turn is 360° / 6 = 60°.'
  },
  {
    id: 'q4',
    questionRo: 'Care este rolul principal al actuatorilor (motoarelor electrice cu reductor) într-un sistem robotic educațional?',
    questionEn: 'What is the primary role of actuators (electric gearmotors) in an educational robotic system?',
    options: [
      {
        textRo: 'Transformă energia electrică a acumulatorului în mișcare mecanică de rotație transmisă roților',
        textEn: 'Transforms battery electrical energy into mechanical rotational movement applied to the wheels',
        isCorrect: true
      },
      {
        textRo: 'Măsoară temperatura ambientală și presiunea aerului',
        textEn: 'Measures ambient temperature and barometric pressure',
        isCorrect: false
      },
      {
        textRo: 'Stochează instrucțiunile programului în memoria Flash',
        textEn: 'Stores program instructions in Flash memory',
        isCorrect: false
      },
      {
        textRo: 'Comută afișajul ecranului LCD',
        textEn: 'Toggles the LCD display backlight',
        isCorrect: false
      }
    ],
    explanationRo: 'Actuatorii sunt elementele de execuție mecanică (motoare de curent continuu, servomotoare sau motoare pas-cu-pas) care pun robotul în mișcare fizică.',
    explanationEn: 'Actuators are mechanical execution elements (DC motors, servomotors, or stepper motors) that drive the physical motion of the robot.'
  },
  {
    id: 'q5',
    questionRo: 'De ce se stabilește un prag de siguranță de 20 cm pentru frânarea ultrasonică în fața unui obstacol?',
    questionEn: 'Why is a 20 cm safety threshold established for ultrasonic obstacle braking?',
    codeSnippet: 'while (robot.citesteDistanta() > 20) {\n    robot.inainte(5);\n}\nrobot.opreste();',
    options: [
      {
        textRo: 'Pentru a compensa inerția mecanică a șasiului și zona moartă (< 4 cm) a senzorului, evitând coliziunea fizică',
        textEn: 'To compensate for mechanical chassis inertia and sensor blind zone (< 4 cm), avoiding physical collision',
        isCorrect: true
      },
      {
        textRo: 'Pentru că dincolo de 20 cm semnalul sonar se stinge complet',
        textEn: 'Because beyond 20 cm the sonar wave completely dissipates',
        isCorrect: false
      },
      {
        textRo: 'Pentru că microcontrolerul funcționează doar cu numere divizibile cu 20',
        textEn: 'Because the microcontroller only processes numbers divisible by 20',
        isCorrect: false
      },
      {
        textRo: 'Regula este valabilă doar dacă robotul are 3 roți',
        textEn: 'The rule only applies if the robot has 3 wheels',
        isCorrect: false
      }
    ],
    explanationRo: 'Șasiul în mișcare are masă și inerție. Un prag de 20 cm permite decelerarea lină a motoarelor fără ca șasiul să lovească zidul din cauza inerției.',
    explanationEn: 'A moving chassis possesses mass and inertia. A 20 cm margin allows smooth motor deceleration preventing inertial collision with the wall.'
  },
  {
    id: 'q6',
    questionRo: 'Cum garantează algoritmul "Regula Mâinii Drepte" (Wall Follower) ieșirea dintr-un labirint simplu conex?',
    questionEn: 'How does the "Right-Hand Rule" (Wall Follower) algorithm guarantee exiting a simply connected maze?',
    options: [
      {
        textRo: 'Menținând permanent contactul cu peretele din dreapta, robotul parcurge conturul continuu al perimetrului până la ieșire',
        textEn: 'By continuously keeping the right wall in contact, the robot traverses the perimeter boundary until finding the exit',
        isCorrect: true
      },
      {
        textRo: 'Robotul sare peste ziduri când detectează fundături',
        textEn: 'The robot hops over walls upon detecting a dead-end',
        isCorrect: false
      },
      {
        textRo: 'Algoritmul funcționează doar noaptea cu senzorii stinși',
        textEn: 'The algorithm only functions at night with sensors deactivated',
        isCorrect: false
      },
      {
        textRo: 'Robotul sapă un tunel pe sub linia de sosire',
        textEn: 'The robot digs a subterranean tunnel beneath the finish line',
        isCorrect: false
      }
    ],
    explanationRo: 'Conform topologiei labirintelor conexe, peretele exterior formează o buclă continuă. Urmărindu-l fără întrerupere, robotul ajunge garantat la ieșire.',
    explanationEn: 'According to simply connected maze topology, the outer wall forms a continuous boundary. Following it consistently guarantees reaching the exit.'
  }
];

export const RobotLevel7_EvaluationAndCertificate: React.FC<Props> = ({
  onPass,
  studentName = 'Elev Clasa a VII-a'
}) => {
  const { lang } = useLanguage();
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    sounds.playClick();
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCalculateScore = () => {
    let correctCount = 0;
    EVALUATION_QUESTIONS.forEach(q => {
      const selectedIndex = userAnswers[q.id];
      if (selectedIndex !== undefined && q.options[selectedIndex]?.isCorrect) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / EVALUATION_QUESTIONS.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);

    if (calculatedScore >= 70) {
      sounds.playLevelUp();
    } else {
      sounds.playError();
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    sounds.playClick();
  };

  const allAnswered = EVALUATION_QUESTIONS.every(q => userAnswers[q.id] !== undefined);
  const isPassed = score >= 70;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GraduationCap className="w-40 h-40 text-indigo-400" />
        </div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>
            {lang === 'ro'
              ? 'Nivelul 7 • Evaluare Sumativă & Certificare Gimnazială TIC (Manual pag. 103–108)'
              : 'Level 7 • Summative Assessment & Middle School ICT Certification (Textbook pp. 103–108)'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {lang === 'ro'
            ? 'Marele Test Sumativ de Robotică & Diplomă de Absolvire'
            : 'Robotics Summative Assessment & Graduation Diploma'}
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          {lang === 'ro' ? (
            <>Felicitări pentru parcurgerea conținuturilor din Modulul 4F! Răspunde corect la cele{' '}
            <strong className="text-indigo-300">6 întrebări sumative</strong> (minim 70% punctaj) pentru a debloca{' '}
            <span className="text-amber-300 font-semibold">
              Diploma Oficială de Absolvire a Programei de Clasa a VII-a (12 Misiuni Complete)
            </span>!</>
          ) : (
            <>Congratulations on working through Module 4F! Answer the{' '}
            <strong className="text-indigo-300">6 summative questions</strong> correctly (minimum 70% passing grade) to unlock the{' '}
            <span className="text-amber-300 font-semibold">
              Official Grade 7 Curriculum Graduation Diploma (All 12 Missions Completed)
            </span>!</>
          )}
        </p>
      </div>

      {/* Lista celor 6 întrebări */}
      <div className="flex flex-col gap-6">
        {EVALUATION_QUESTIONS.map((q, idx) => {
          const selectedIndex = userAnswers[q.id];

          return (
            <div
              key={q.id}
              className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all ${
                isSubmitted
                  ? q.options[selectedIndex]?.isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {lang === 'ro' ? q.questionRo : q.questionEn}
                  </h3>
                </div>
                {isSubmitted && (
                  <div>
                    {q.options[selectedIndex]?.isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                        <Check className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect (+16.6p)' : 'Correct (+16.6p)'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Incorect (0p)' : 'Incorrect (0p)'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {q.codeSnippet && (
                <div className="mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                  <pre className="whitespace-pre">{q.codeSnippet}</pre>
                </div>
              )}

              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedIndex === oIdx;
                  const optText = lang === 'ro' ? opt.textRo : opt.textEn;
                  let optStyle =
                    'border-slate-800 bg-slate-950 hover:bg-slate-850 hover:border-slate-700 text-slate-300';

                  if (isSubmitted) {
                    if (opt.isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200 font-medium';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-950/60 text-rose-200';
                    } else {
                      optStyle = 'border-slate-800/60 bg-slate-950/40 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-indigo-500 bg-indigo-950/80 text-white font-medium shadow-md shadow-indigo-900/30';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, oIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between cursor-pointer disabled:cursor-default ${optStyle}`}
                    >
                      <span>{optText}</span>
                      {isSelected && !isSubmitted && (
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-indigo-300 font-semibold">
                    {lang === 'ro' ? 'Explicație curriculară: ' : 'Curricular explanation: '}
                  </strong>
                  {lang === 'ro' ? q.explanationRo : q.explanationEn}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bară de Acțiune / Transmitere */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          {!isSubmitted ? (
            <div className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Progres evaluare: ' : 'Exam progress: '}
              <span className="text-white font-bold">
                {Object.keys(userAnswers).length} / {EVALUATION_QUESTIONS.length}{' '}
                {lang === 'ro' ? 'întrebări completate' : 'questions answered'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className={`text-2xl font-black font-mono px-3 py-1 rounded-xl border ${
                  isPassed
                    ? 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50'
                    : 'text-rose-400 bg-rose-950/80 border-rose-500/50'
                }`}
              >
                {score} / 100
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {isPassed
                    ? (lang === 'ro' ? '🎉 Evaluare Promovată cu Succes!' : '🎉 Assessment Passed Successfully!')
                    : (lang === 'ro' ? 'Punctaj sub pragul de 70%' : 'Score below 70% passing threshold')}
                </div>
                <div className="text-xs text-slate-400">
                  {isPassed
                    ? (lang === 'ro'
                        ? 'Ai demonstrat competențe avansate în robotică educațională și algoritmi C++.'
                        : 'You demonstrated mastery in educational robotics and C++ control structures.')
                    : (lang === 'ro'
                        ? 'Recitește capitolele și reia testul pentru a obține diploma.'
                        : 'Review the lessons and retake the test to earn your diploma.')}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isSubmitted ? (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Reia Testul' : 'Retake Exam'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleCalculateScore}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'ro' ? 'Trimite Răspunsurile & Evaluează' : 'Submit Answers & Evaluate'}</span>
            </button>
          )}

          {isSubmitted && isPassed && (
            <button
              type="button"
              onClick={() => {
                sounds.playSuccess();
                onPass(score);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition flex items-center gap-2 shadow-xl shadow-emerald-600/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Finalizează Modulul 4F & Înregistrează Absolvirea'
                  : 'Complete Module 4F & Record Graduation'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* DIPLOMĂ OFICIALĂ DE ABSOLVIRE (Apare la promovare cu >= 70%) */}
      {isSubmitted && isPassed && (
        <div className="flex flex-col gap-4 mt-4 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Certificat Oficial de Excelență în Informatică & Robotică'
                  : 'Official Certificate of Excellence in Computer Science & Robotics'}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ro' ? 'Imprimă / Salvează PDF Diplomă' : 'Print / Save PDF Diploma'}</span>
            </button>
          </div>

          {/* Corpul Diplomei Imprimabile */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/70 border-4 border-amber-500/40 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
            {/* Elemente ornamentale de colț */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/70 pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/70 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/70 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/70 pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold tracking-widest uppercase mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {lang === 'ro'
                  ? 'Curriculum Național de Gimnaziu • OMEN 3393/2017 & OM 5420/2024'
                  : 'National Curriculum Standard • OMEN 3393/2017 & OM 5420/2024'}
              </span>
            </div>

            <h2 className="text-xs sm:text-sm font-serif tracking-widest text-slate-400 uppercase mb-1">
              {lang === 'ro'
                ? 'Ministerul Educației • Platforma Educațională Ark3do: Misiunea AR'
                : 'Ministry of Education • Ark3do Educational Platform: AR Mission'}
            </h2>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 font-serif mb-4">
              {lang === 'ro' ? 'DIPLOMĂ DE ABSOLVIRE GIMNAZIALĂ' : 'MIDDLE SCHOOL GRADUATION DIPLOMA'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
              {lang === 'ro'
                ? 'INFORMATICĂ, ALGORITMI C++ & ROBOTICĂ EDUCAȚIONALĂ — CLASA A VII-A'
                : 'COMPUTER SCIENCE, C++ ALGORITHMS & EDUCATIONAL ROBOTICS — GRADE 7'}
            </p>

            <div className="text-xs font-mono text-slate-400 mb-1">
              {lang === 'ro' ? 'Se acordă cu distincție elevului / elevei:' : 'Awarded with distinction to student:'}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white underline decoration-amber-400/60 decoration-2 underline-offset-8 mb-6 font-serif">
              {studentName}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-8">
              {lang === 'ro' ? (
                <>pentru finalizarea integrală a celor <strong className="text-amber-300">12 Misiuni Curriculare din Clasa a VII-a</strong>{' '}
                (Art Klett pag. 10–108), demonstrând măiestrie în: operarea sistemelor de calcul, editare grafică avansată, modelare audio-video,
                rețele și securitate cibernetică, structuri de control C++ (liniară, decizie if, repetiție while/for/do-while),
                laboratoare interdisciplinare STEM (Fizică &amp; Geografie) și programarea roboților autonomi cu senzori ultrasonic și infraroșu.</>
              ) : (
                <>for successfully completing all <strong className="text-amber-300">12 Grade 7 Curricular Missions</strong>{' '}
                (Art Klett pp. 10–108), demonstrating mastery in: computing systems, advanced digital graphics, audio-video editing,
                networking and cyber safety, C++ control structures (sequential, if decision, while/for/do-while repetition),
                interdisciplinary STEM labs (Physics &amp; Geography), and autonomous robotics with ultrasonic and infrared sensors.</>
              )}
            </p>

            {/* Grilă detalii validare diplomă */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl border-t border-b border-amber-500/20 py-4 mb-6 text-xs">
              <div className="flex flex-col items-center">
                <span className="text-slate-500 font-mono">
                  {lang === 'ro' ? 'Punctaj Absolvire' : 'Graduation Score'}
                </span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {score} / 100 {lang === 'ro' ? 'Puncte' : 'Points'}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-500 font-mono">
                  {lang === 'ro' ? 'Data Emiterii' : 'Issue Date'}
                </span>
                <span className="text-base font-bold text-slate-200">{currentDate}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-500 font-mono">
                  {lang === 'ro' ? 'Cod Unic Certificare' : 'Certificate Verification Code'}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">ARK7-ROBOT-OMEN-2026</span>
              </div>
            </div>

            {/* Semnături și Ștampilă */}
            <div className="flex flex-wrap items-center justify-between w-full max-w-xl text-xs text-slate-400 pt-2">
              <div className="text-left">
                <div className="font-mono text-slate-500">
                  {lang === 'ro' ? 'Profesor Coordonator:' : 'Lead Instructor:'}
                </div>
                <div className="font-serif italic text-slate-300 text-sm">Gheorghe Bardan</div>
                <div className="text-[10px] text-slate-500">
                  {lang === 'ro' ? 'Catedra de Informatică & TIC' : 'Dept. of Computer Science & ICT'}
                </div>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center p-1 text-[9px] font-mono text-amber-400 uppercase text-center leading-tight">
                ARK3DO VERIFIED SEAL
              </div>

              <div className="text-right">
                <div className="font-mono text-slate-500">
                  {lang === 'ro' ? 'Nivel Certificat:' : 'Certification Level:'}
                </div>
                <div className="font-serif font-bold text-indigo-300 text-sm">
                  {lang === 'ro' ? 'Absolvent Clasa a VII-a' : 'Grade 7 Graduate'}
                </div>
                <div className="text-[10px] text-slate-500">Standard OMEN 3393 / OM 5420</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
