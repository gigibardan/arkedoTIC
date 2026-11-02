import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Code2,
  FileCheck,
  Terminal,
  Cpu,
  Layers,
  GraduationCap,
  Building2
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface R2Level7Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface ExamQuestion {
  id: string;
  questionNumber: number;
  title: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'g8_r2_q1',
    questionNumber: 1,
    title: 'Arhitectura Software Arduino: setup() și loop()',
    questionText: 'Care este rolul și frecvența de execuție a funcțiilor setup() și loop() într-un program pentru microcontrollerul Arduino?',
    options: [
      'setup() rulează la fiecare apăsare de tastă, iar loop() rulează doar când apar erori',
      'setup() rulează o singură dată la inițializarea plăcii (configurare pini), iar loop() se repetă ciclic la infinit (monitorizare și decizie continuă)',
      'setup() conține toate calculele matematice, iar loop() este opțional și poate fi omis',
      'Ambele funcții se execută simultan în paralel pe două procesoare separate'
    ],
    correctIndex: 1,
    hint: 'Gândește-te la analogia cu pornirea unui calculator: mai întâi se încarcă BIOS-ul/setările inițiale, apoi sistemul de operare intră în bucla permanentă de lucru.',
    explanation: 'În Arduino, void setup() este executat o singură dată la pornirea plăcii pentru configurarea inițială (pinMode, inițializare comunicație Serial, atașare servo), după care void loop() rulează continuu la infinit, asigurând ciclul permanent de achiziție de date și comandă.'
  },
  {
    id: 'g8_r2_q2',
    questionNumber: 2,
    title: 'Multitasking Non-Blocant: millis() vs delay()',
    questionText: 'De ce este recomandată utilizarea funcției millis() în locul funcției delay() într-un sistem inteligent integrat Smart City?',
    options: [
      'Funcția millis() reduce consumul de curent al senzorilor la 0 mA',
      'Funcția delay() funcționează exclusiv în Python, nu și în C++',
      'millis() permite temporizarea acțiunilor în mod non-blocant, păstrând procesorul activ pentru a detecta alarme critice (scurgeri de gaz, butoane de oprire) în timp real',
      'millis() mărește rezoluția senzorilor analogici de la 10 biți la 16 biți'
    ],
    correctIndex: 2,
    hint: 'Gândește-te ce se întâmplă dacă un pieton apasă butonul de trecere în timp ce microcontrollerul este înghețat într-un delay de 5 secunde.',
    explanation: 'delay(ms) îngheață complet nucleul procesorului, oprind execuția oricărui alt cod timp de câteva secunde. Utilizarea millis() permite calcularea diferenței de timp scurse (timpCurent - timpAnterior >= interval), astfel încât bucla loop() continuă să ruleze la viteza maximă de mii de iterații pe secundă.'
  },
  {
    id: 'g8_r2_q3',
    questionNumber: 3,
    title: 'Control Unghiular Servomotor Barieră',
    questionText: 'Ce comandă C++ este transmisă unui servomotor SG90 pentru a comuta o barieră de parcare de la poziția orizontală de blocare (0°) la poziția verticală de liberă trecere?',
    options: [
      'bariera.write(180);',
      'bariera.write(90);',
      'analogWrite(barieraPin, 255);',
      'digitalWrite(barieraPin, HIGH);'
    ],
    correctIndex: 1,
    hint: 'O rotație perpendiculară de la planul orizontal la cel vertical măsoară un unghi drept.',
    explanation: 'Servomotoarele de tip SG90 acceptă unghiuri între 0° și 180° prin biblioteca Servo.h. O barieră fixată pe ax la 0° (orizontală) se ridică la verticală rotindu-se la 90° (bariera.write(90)).'
  },
  {
    id: 'g8_r2_q4',
    questionNumber: 4,
    title: 'Stabilitatea Automatizărilor: Tehnica Histerezisului',
    questionText: 'Ce problemă critică rezolvă histerezisul în algoritmul de comandă al unui sistem inteligent de iluminat stradal?',
    options: [
      'Mărește viteza de încărcare a bateriilor solare pe timp de ploaie',
      'Inversează polaritatea diodelor emițătoare de lumină pentru a schimba culoarea',
      'Previne pâlpâirea repetată a lămpilor la apus sau răsărit prin utilizarea a două praguri de luminanță distincte (unul inferior pentru aprindere și unul superior pentru stingere)',
      'Formatează memoria EEPROM a plăcii pentru a șterge jurnalele vechi'
    ],
    correctIndex: 2,
    hint: 'Ce s-ar întâmpla când lumina ambientală oscilează în jurul pragului de 400 (ex: 399, 401, 399, 401)?',
    explanation: 'Fără histerezis, fluctuațiile naturale de lumină dintr-un singur punct de comutare ar determina lampa să se aprindă și să se stingă rapid de câteva ori pe secundă (flickering). Histerezisul stabilește un prag de aprindere (ex: < 350) și un prag mai ridicat de stingere (ex: > 450).'
  },
  {
    id: 'g8_r2_q5',
    questionNumber: 5,
    title: 'Comunicația Serială I2C: Pinii Hardware pe Arduino Uno',
    questionText: 'Ce pini ai plăcii de dezvoltare Arduino Uno realizează conexiunea fizică a magistralei I2C cu afișajul LCD 1602?',
    options: [
      'Pinii digitali D0 (RX) și D1 (TX)',
      'Pinii analogici A4 (SDA - linie de date) și A5 (SCL - linie de tact / ceas)',
      'Pinii PWM D9 și D10',
      'Pinii de alimentare 3.3V și Vin'
    ],
    correctIndex: 1,
    hint: 'I2C este un protocol pe două fire (date și ceas), mapat hardware pe ultimii doi pini analogici ai plăcii Uno.',
    explanation: 'Pe microcontrollerul ATmega328P din Arduino Uno, magistrala TWI / I2C este conectată intern la pinii analogici A4 (SDA - Serial Data) și A5 (SCL - Serial Clock).'
  }
];

export const R2Level7_SmartCityFinalExam: React.FC<R2Level7Props> = ({
  onCompletePage,
  onComplete,
}) => {
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [earnedScore, setEarnedScore] = useState<number>(0);

  // 5-second reflection cooldown
  const { cooldowns, triggerCooldown } = useQuestionCooldowns(5);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    if (cooldowns[questionId] > 0) return;

    sounds.playClick();
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));

    const question = EXAM_QUESTIONS.find((q) => q.id === questionId);
    if (question && optionIndex !== question.correctIndex) {
      sounds.playWrong();
      triggerCooldown(questionId);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const allAnswered = answeredCount === EXAM_QUESTIONS.length;

  const handleSubmit = () => {
    if (!allAnswered || isSubmitted) return;

    let correctCount = 0;
    EXAM_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
    setEarnedScore(finalScore);
    setIsSubmitted(true);

    if (finalScore >= 70) {
      sounds.playSuccess();
    } else {
      sounds.playWrong();
    }
  };

  const handleFinishToDiploma = () => {
    sounds.playSuccess();
    if (onCompletePage) {
      onCompletePage(earnedScore);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleRetake = () => {
    sounds.playClick();
    setUserAnswers({});
    setIsSubmitted(false);
    setEarnedScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300">
              <Award className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Modulul 4B • Pasul 7 din 7
                </span>
                <span className="text-xs text-slate-400 font-mono">Examen Sumativ & Final Gimnaziu</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Evaluare Sumativă: Smart City & Sisteme Inteligente IoT
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Validează competențele din Unitatea 4 (Manual Art Klett pag. 99–108). Obține minim 70 de puncte pentru a debloca Diploma Oficială de Mare Maestru în Robotică și Automatizări!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
            <div className="text-right">
              <div className="text-xs text-slate-400">Răspunsuri</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {answeredCount} / {EXAM_QUESTIONS.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Result Card (when submitted) */}
      {isSubmitted && (
        <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-2xl transition-all ${
          earnedScore >= 70
            ? 'bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border-emerald-500/50'
            : 'bg-gradient-to-r from-red-950/60 to-amber-950/60 border-red-500/50'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl border ${
                earnedScore >= 70 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-red-500/20 border-red-400 text-red-300'
              }`}>
                {earnedScore >= 70 ? <GraduationCap className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {earnedScore >= 70 ? 'Felicitări! Ai Promovat Examenul de Robotică!' : 'Ai obținut sub 70 de puncte.'}
                </h2>
                <p className="text-sm text-slate-300 mt-0.5">
                  Scor final: <span className="font-bold text-white font-mono">{earnedScore} / 100 puncte</span> ({Math.round(earnedScore / 20)} din 5 corecte).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {earnedScore >= 70 ? (
                <button
                  onClick={handleFinishToDiploma}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Award className="w-5 h-5" />
                  <span>Vezi Diploma Oficială (Nivelul 8)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleRetake}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Reîncearcă Testul</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {EXAM_QUESTIONS.map((q) => {
          const selectedAnswer = userAnswers[q.id];
          const isAnswered = selectedAnswer !== undefined;
          const isCorrect = isAnswered && selectedAnswer === q.correctIndex;
          const cooldownRemaining = cooldowns[q.id] || 0;

          return (
            <div
              key={q.id}
              className={`bg-slate-900/70 border rounded-2xl p-6 shadow-lg transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-red-500/50 bg-red-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Întrebarea {q.questionNumber} din {EXAM_QUESTIONS.length}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{q.title}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{q.questionText}</h3>
                </div>

                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +20 pct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/20 px-2.5 py-1 rounded-full border border-red-500/40">
                        <AlertTriangle className="w-3.5 h-3.5" /> 0 pct
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Reflection Cooldown Banner */}
              {cooldownRemaining > 0 && !isSubmitted && (
                <div className="mt-4">
                  <PedagogicalReflectionBanner
                    secondsRemaining={cooldownRemaining}
                    message="Reflectează 5 secunde asupra arhitecturii hardware înainte de o nouă alegere..."
                  />
                </div>
              )}

              {/* Options */}
              <div className="mt-4 space-y-2.5">
                {q.options.map((optText, optIdx) => {
                  const isThisSelected = selectedAnswer === optIdx;
                  let optionStyles = 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white';

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optionStyles = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isThisSelected && !isCorrect) {
                      optionStyles = 'bg-red-950/50 border-red-500 text-red-200';
                    } else {
                      optionStyles = 'bg-slate-900/40 border-slate-800 text-slate-500';
                    }
                  } else if (isThisSelected) {
                    optionStyles = 'bg-emerald-950/50 border-emerald-500 text-emerald-100 font-semibold shadow-md';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted || cooldownRemaining > 0}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full p-3.5 rounded-xl text-left border text-xs md:text-sm transition-all flex items-start gap-3 ${optionStyles} ${
                        cooldownRemaining > 0 ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hint and Explanation */}
              <div className="mt-4 flex flex-col gap-2">
                {!isSubmitted && <QuestionHint hint={q.hint} />}
                {isSubmitted && <AnswerExplanation explanation={q.explanation} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {allAnswered
              ? 'Toate întrebările au primit răspuns. Apasă Trimite pentru calcularea notei!'
              : `Mai ai de răspuns la ${EXAM_QUESTIONS.length - answeredCount} întrebări.`}
          </div>

          <button
            disabled={!allAnswered}
            onClick={handleSubmit}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              allAnswered
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white cursor-pointer hover:shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Trimite Răspunsurile & Calculează Nota</span>
          </button>
        </div>
      )}
    </div>
  );
};
