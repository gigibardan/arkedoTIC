import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  ShieldCheck,
  Check,
  QrCode,
  GraduationCap,
  Calendar,
  BookOpen,
  Bot,
  Zap,
  Radio,
  Cpu
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
  studentName?: string;
}

interface Question {
  id: string;
  question: string;
  codeSnippet?: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'Cum calculează senzorul ultrasonic distanța până la un obstacol folosind undele sonore?',
    codeSnippet: 'double distanta = (durataMicrosecunde * 0.0343) / 2.0;',
    options: [
      { text: 'd = (v · Δt) / 2, deoarece unda parcurge distanța dus-întors (de la emițător la obstacol și înapoi la receptor)', isCorrect: true },
      { text: 'd = v · Δt · 2, prin dublarea vitezei aerului', isCorrect: false },
      { text: 'Distanța este egală cu frecvența sonoră de 40 kHz', isCorrect: false },
      { text: 'Măsurând intensitatea luminoasă a laserului de ghidaj', isCorrect: false }
    ],
    explanation: 'Sunetul călătorește cu aproximativ 340 m/s (0.034 cm/μs). Împărțirea la 2 este indispensabilă deoarece timpul măsurat cuprinde atât drumul de plecare cât și ecoul reflectat.'
  },
  {
    id: 'q2',
    question: 'Dacă ambii senzori optici de urmărire a liniei (infraroșu) returnează valoarea 0 (alb), cum trebuie comandate motoarele?',
    codeSnippet: 'if (sL == 0 && sR == 0) {\n    robot.inainte(10); // ambele motoare merg cu viteză egală\n}',
    options: [
      { text: 'Ambele motoare avansează cu viteză egală, linia neagră fiind perfect centrată între senzori', isCorrect: true },
      { text: 'Robotul oprește motoarele și declanșează claxonul', isCorrect: false },
      { text: 'Motorul stâng accelerează la maximum, iar cel drept este oprit', isCorrect: false },
      { text: 'Robotul inversează sensul de mers înapoi', isCorrect: false }
    ],
    explanation: 'Când ambii senzori văd alb (lumină reflectată), înseamnă că robotul este centrat optim deasupra benzii negre, deci continuă înainte în linie dreaptă.'
  },
  {
    id: 'q3',
    question: 'Pentru a programa robotul să traseze un hexagon regulat cu 6 laturi egale, care este unghiul de viraj la fiecare vârf?',
    codeSnippet: 'for (int i = 1; i <= 6; i++) {\n    robot.inainte(latura);\n    robot.vireazaDreapta(360 / 6); // 60 grade\n}',
    options: [
      { text: '60° (formula unghiului exterior: 360° / n = 360° / 6)', isCorrect: true },
      { text: '120° (unghiul interior al figurii)', isCorrect: false },
      { text: '90° (unghi drept)', isCorrect: false },
      { text: '180° (întoarcere completă)', isCorrect: false }
    ],
    explanation: 'La oricare poligon regulat convex cu n laturi, suma unghiurilor exterioare de viraj este de 360°. Pentru hexagon, fiecare viraj are 360° / 6 = 60°.'
  },
  {
    id: 'q4',
    question: 'Care este rolul principal al actuatorilor (motoarelor electrice cu reductor) într-un sistem robotic educațional?',
    options: [
      { text: 'Transformă energia electrică a acumulatorului în mișcare mecanică de rotație transmisă roților', isCorrect: true },
      { text: 'Măsoară temperatura ambientală și presiunea aerului', isCorrect: false },
      { text: 'Stochează instrucțiunile programului în memoria Flash', isCorrect: false },
      { text: 'Comută afișajul ecranului LCD', isCorrect: false }
    ],
    explanation: 'Actuatorii sunt elementele de execuție mecanică (motoare de curent continuu, servomotoare sau motoare pas-cu-pas) care pun robotul în mișcare fizică.'
  },
  {
    id: 'q5',
    question: 'De ce se stabilește un prag de siguranță de 20 cm pentru frânarea ultrasonică în fața unui obstacol?',
    codeSnippet: 'while (robot.citesteDistanta() > 20) {\n    robot.inainte(5);\n}\nrobot.opreste();',
    options: [
      { text: 'Pentru a compensa inerția mecanică a șasiului și zona moartă (< 4 cm) a senzorului, evitând coliziunea fizică', isCorrect: true },
      { text: 'Pentru că dincolo de 20 cm semnalul sonar se stinge complet', isCorrect: false },
      { text: 'Pentru că microcontrolerul funcționează doar cu numere divizibile cu 20', isCorrect: false },
      { text: 'Regula este valabilă doar dacă robotul are 3 roți', isCorrect: false }
    ],
    explanation: 'Șasiul în mișcare are masă și inerție. Un prag de 20 cm permite decelerarea lină a motoarelor fără ca șasiul să lovească zidul din cauza inerției.'
  },
  {
    id: 'q6',
    question: 'Cum garantează algoritmul "Regula Mâinii Drepte" (Wall Follower) ieșirea dintr-un labirint simplu conex?',
    options: [
      { text: 'Menținând permanent contactul cu peretele din dreapta, robotul parcurge conturul continuu al perimetrului până la ieșire', isCorrect: true },
      { text: 'Robotul sare peste ziduri când detectează fundături', isCorrect: false },
      { text: 'Algoritmul funcționează doar noaptea cu senzorii stinși', isCorrect: false },
      { text: 'Robotul sapă un tunel pe sub linia de sosire', isCorrect: false }
    ],
    explanation: 'Conform topologiei labirintelor conexe, peretele exterior formează o buclă continuă. Urmărindu-l fără întrerupere, robotul ajunge garantat la ieșire.'
  }
];

export const RobotLevel7_EvaluationAndCertificate: React.FC<Props> = ({
  onPass,
  studentName = 'Elev Clasa a VII-a'
}) => {
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

  const currentDate = new Date().toLocaleDateString('ro-RO', {
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
          <span>Nivelul 7 • Evaluare Sumativă &amp; Certificare Gimnazială TIC (Manual pag. 103–108)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Marele Test Sumativ de Robotică &amp; Diplomă de Absolvire
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Felicitări pentru parcurgerea conținuturilor din Modulul 4F! Răspunde corect la cele{' '}
          <strong className="text-indigo-300">6 întrebări sumative</strong> (minim 70% punctaj) pentru a debloca{' '}
          <span className="text-amber-300 font-semibold">
            Diploma Oficială de Absolvire a Programei de Clasa a VII-a (12 Misiuni Complete)
          </span>!
        </p>
      </div>

      {/* Lista celor 6 întrebări */}
      <div className="flex flex-col gap-6">
        {EVALUATION_QUESTIONS.map((q, idx) => {
          const selectedIndex = userAnswers[q.id];
          const isAnswered = selectedIndex !== undefined;

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
                    {q.question}
                  </h3>
                </div>
                {isSubmitted && (
                  <div>
                    {q.options[selectedIndex]?.isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                        <Check className="w-3.5 h-3.5" /> Corect (+16.6p)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5" /> Incorect (0p)
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
                      <span>{opt.text}</span>
                      {isSelected && !isSubmitted && (
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-indigo-300 font-semibold">Explicație curriculară: </strong>
                  {q.explanation}
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
              Progres evaluare:{' '}
              <span className="text-white font-bold">
                {Object.keys(userAnswers).length} / {EVALUATION_QUESTIONS.length} întrebări completate
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
                  {isPassed ? '🎉 Evaluare Promovată cu Succes!' : 'Punctaj sub pragul de 70%'}
                </div>
                <div className="text-xs text-slate-400">
                  {isPassed
                    ? 'Ai demonstrat competențe avansate în robotică educațională și algoritmi C++.'
                    : 'Recitește capitolele și reia testul pentru a obține diploma.'}
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
              <span>Reia Testul</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleCalculateScore}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Trimite Răspunsurile &amp; Evaluează</span>
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
              <span>Finalizează Modulul 4F &amp; Înregistrează Absolvirea</span>
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
              <span>Certificat Oficial de Excelență în Informatică &amp; Robotică</span>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimă / Salvează PDF Diplomă</span>
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
              <span>Curriculum Național de Gimnaziu • OMEN 3393/2017 &amp; OM 5420/2024</span>
            </div>

            <h2 className="text-xs sm:text-sm font-serif tracking-widest text-slate-400 uppercase mb-1">
              Ministerul Educației • Platforma Educațională Ark3do: Misiunea AR
            </h2>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 font-serif mb-4">
              DIPLOMĂ DE ABSOLVIRE GIMNAZIALĂ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
              INFORMATICĂ, ALGORITMI C++ &amp; ROBOTICĂ EDUCAȚIONALĂ — CLASA A VII-A
            </p>

            <div className="text-xs font-mono text-slate-400 mb-1">Se acordă cu distincție elevului / elevei:</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white underline decoration-amber-400/60 decoration-2 underline-offset-8 mb-6 font-serif">
              {studentName}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-8">
              pentru finalizarea integrală a celor <strong className="text-amber-300">12 Misiuni Curriculare din Clasa a VII-a</strong>{' '}
              (Art Klett pag. 10–108), demonstrând măiestrie în: operarea sistemelor de calcul, editare grafică avansată, modelare audio-video,
              rețele și securitate cibernetică, structuri de control C++ (liniară, decizie if, repetiție while/for/do-while),
              laboratoare interdisciplinare STEM (Fizică &amp; Geografie) și programarea roboților autonomi cu senzori ultrasonic și infraroșu.
            </p>

            {/* Grilă detalii validare diplomă */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl border-t border-b border-amber-500/20 py-4 mb-6 text-xs">
              <div className="flex flex-col items-center">
                <span className="text-slate-500 font-mono">Punctaj Absolvire</span>
                <span className="text-base font-bold font-mono text-emerald-400">{score} / 100 Puncte</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-500 font-mono">Data Emiterii</span>
                <span className="text-base font-bold text-slate-200">{currentDate}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-500 font-mono">Cod Unic Certificare</span>
                <span className="text-xs font-mono font-bold text-amber-300">ARK7-ROBOT-OMEN-2026</span>
              </div>
            </div>

            {/* Semnături și Ștampilă */}
            <div className="flex flex-wrap items-center justify-between w-full max-w-xl text-xs text-slate-400 pt-2">
              <div className="text-left">
                <div className="font-mono text-slate-500">Profesor Coordonator:</div>
                <div className="font-serif italic text-slate-300 text-sm">Gheorghe Bardan</div>
                <div className="text-[10px] text-slate-500">Catedra de Informatică &amp; TIC</div>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center p-1 text-[9px] font-mono text-amber-400 uppercase text-center leading-tight">
                ARK3DO VERIFIED SEAL
              </div>

              <div className="text-right">
                <div className="font-mono text-slate-500">Nivel Certificat:</div>
                <div className="font-serif font-bold text-indigo-300 text-sm">Absolvent Clasa a VII-a</div>
                <div className="text-[10px] text-slate-500">Standard OMEN 3393 / OM 5420</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
