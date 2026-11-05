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
  Bot
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface R1Level7Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface ExamQuestion {
  id: string;
  questionNumber: number;
  titleRo: string;
  titleEn: string;
  questionTextRo: string;
  questionTextEn: string;
  hintRo: string;
  hintEn: string;
  options: { id: string; textRo: string; textEn: string }[];
  correctOptionId: string;
  explanationRo: string;
  explanationEn: string;
  manualRefRo: string;
  manualRefEn: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    titleRo: 'Arhitectura Microcontrollerului & Pinii PWM',
    titleEn: 'Microcontroller Architecture & PWM Pins',
    questionTextRo:
      'Care pini ai plăcii de dezvoltare Arduino Uno permit reglarea continuă a turației unui motor sau a luminozității unui LED prin tehnica PWM (pag. 90–91)?',
    questionTextEn:
      'Which pins of the Arduino Uno development board enable continuous regulation of motor speed or LED brightness via PWM (pp. 90–91)?',
    hintRo: 'Acești pini sunt semnalizați pe placă cu un simbol grafic special (tildă) lângă numărul lor.',
    hintEn: 'These pins are designated on the board with a special graphic tilde (~) symbol next to their number.',
    options: [
      { id: 'a', textRo: 'A. Doar pinii A0 și A1', textEn: 'A. Only pins A0 and A1' },
      {
        id: 'b',
        textRo: 'B. Pinii marcați cu simbolul tildă (~): 3, 5, 6, 9, 10 și 11, folosind funcția analogWrite(pin, valoare 0..255)',
        textEn: 'B. Pins marked with a tilde (~): 3, 5, 6, 9, 10, and 11, using analogWrite(pin, value 0..255)'
      },
      { id: 'c', textRo: 'C. Pinii de alimentare 5V și GND', textEn: 'C. Power pins 5V and GND' },
      { id: 'd', textRo: 'D. Toți pinii digitali fără nicio excepție', textEn: 'D. All digital pins without any exception' }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! Pinii marcați cu simbolul ~ generează semnale PWM (Pulse Width Modulation) la frecvențe de circa 490 Hz (sau 980 Hz pe pinii 5 și 6), permițând simularea unei tensiuni medii variabile între 0V și 5V pe baza unui parametru între 0 și 255.',
    explanationEn:
      'Correct! Pins marked with ~ generate PWM (Pulse Width Modulation) signals at around 490 Hz (or 980 Hz on pins 5 and 6), simulating a variable average voltage between 0V and 5V based on a parameter from 0 to 255.',
    manualRefRo: 'Manual pag. 90–91',
    manualRefEn: 'Textbook pp. 90–91'
  },
  {
    id: 'q2',
    questionNumber: 2,
    titleRo: 'Conversia Analog-Digitală (ADC) pe 10 Biți',
    titleEn: '10-Bit Analog-Digital Conversion (ADC)',
    questionTextRo:
      'Dacă un senzor analogic de lumină sau temperatură transmite o tensiune exactă de 2.5V (jumătate din 5V) către pinul A0, ce valoare întreagă va returna funcția analogRead(A0) (pag. 93)?',
    questionTextEn:
      'If an analog light or temperature sensor outputs exactly 2.5V (half of 5V) to pin A0, what integer value will analogRead(A0) return (p. 93)?',
    hintRo: 'Convertorul pe 10 biți împarte intervalul 0–5V în 1024 de trepte (de la 0 la 1023). Cât reprezintă jumătatea?',
    hintEn: 'The 10-bit converter divides the 0–5V range into 1024 steps (0 to 1023). What is the exact midpoint?',
    options: [
      { id: 'a', textRo: 'A. Valoarea 50', textEn: 'A. The value 50' },
      {
        id: 'b',
        textRo: 'B. Aproximativ 511 sau 512 (jumătatea intervalului 0..1023)',
        textEn: 'B. Approximately 511 or 512 (half of the 0..1023 range)'
      },
      { id: 'c', textRo: 'C. Valoarea 2.5', textEn: 'C. The value 2.5' },
      { id: 'd', textRo: 'D. Întotdeauna valoarea 0', textEn: 'D. Always the value 0' }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! Rezoluția convertorului ADC este de 10 biți (2¹⁰ = 1024 stări posibile, între 0 și 1023). Pentru 2.5V (jumătatea din tensiunea de referință de 5V), valoarea calculată este (2.5 / 5.0) * 1023 ≈ 511.5, adică 511 sau 512.',
    explanationEn:
      'Correct! The ADC resolution is 10 bits (2¹⁰ = 1024 possible states, 0 to 1023). For 2.5V (half of 5V reference), the calculated value is (2.5 / 5.0) * 1023 ≈ 511.5, which is 511 or 512.',
    manualRefRo: 'Manual pag. 93',
    manualRefEn: 'Textbook p. 93'
  },
  {
    id: 'q3',
    questionNumber: 3,
    titleRo: 'Principiul Fizic al Senzorului Ultrasonic HC-SR04',
    titleEn: 'Physical Principle of HC-SR04 Ultrasonic Sensor',
    questionTextRo:
      'De ce durata recepționată prin pulseIn(echoPin, HIGH) este împărțită la 2 în formula distanței: distanta = (durata * 0.0343) / 2 (pag. 95)?',
    questionTextEn:
      'Why is the duration returned by pulseIn(echoPin, HIGH) divided by 2 in the distance formula: distance = (duration * 0.0343) / 2 (p. 95)?',
    hintRo: 'Gândește-te la traiectoria completă a undei sonore între senzor și obstacol.',
    hintEn: 'Consider the complete path of the sound wave between the sensor and obstacle.',
    options: [
      {
        id: 'a',
        textRo: 'A. Deoarece semnalul sonor parcurge distanța de două ori: dus (de la difuzorul T la obstacol) și întors (de la obstacol la microfonul R)',
        textEn: 'A. Because the acoustic wave travels the distance twice: out (from transmitter T to obstacle) and back (from obstacle to receiver R)'
      },
      { id: 'b', textRo: 'B. Pentru a micșora consumul bateriei plăcii', textEn: 'B. To reduce the board battery consumption' },
      { id: 'c', textRo: 'C. Este o greșeală de tipar din manual', textEn: 'C. It is a textbook typo' },
      { id: 'd', textRo: 'D. Pentru că senzorul funcționează cu două baterii', textEn: 'D. Because the sensor operates on two batteries' }
    ],
    correctOptionId: 'a',
    explanationRo:
      'Corect! Unda ultrasonică parcurge drumul dus-întors. Timpul măsurat reprezintă durata totală a călătoriei de la emisie până la recepția ecoului reflectat, motiv pentru care distanța efectivă până la obiect este exact jumătate.',
    explanationEn:
      'Correct! The ultrasonic wave travels out and back. The measured time represents total round-trip journey time, so actual distance to the obstacle is exactly half.',
    manualRefRo: 'Manual pag. 95',
    manualRefEn: 'Textbook p. 95'
  },
  {
    id: 'q4',
    questionNumber: 4,
    titleRo: 'Protecția Microcontrollerului & Puntea H (Driver Motoare)',
    titleEn: 'Microcontroller Protection & H-Bridge (Motor Driver)',
    questionTextRo:
      'De ce este strict interzisă conectarea directă a motoarelor de curent continuu la pinii digitali ai plăcii Arduino fără un driver intermediar punte H (ex. L298N) (pag. 96)?',
    questionTextEn:
      'Why is direct connection of DC motors to Arduino digital pins strictly forbidden without an intermediate H-Bridge driver (e.g. L298N) (p. 96)?',
    hintRo: 'Compară curentul maxim suportat de un pin logic cu cel absorbit de bobina unui motor.',
    hintEn: 'Compare the maximum current capacity of a logic pin to that drawn by a motor coil.',
    options: [
      {
        id: 'a',
        textRo: 'A. Pinii Arduino pot livra doar curenți foarte mici (maxim 20–40 mA), în timp ce un motor consumă câteva sute de mA până la 1-2 Amperi, ceea ce ar distruge ireversibil placa',
        textEn: 'A. Arduino pins deliver very low currents (max 20–40 mA), while a motor draws hundreds of mA up to 1-2 Amps, which would irreversibly destroy the board'
      },
      { id: 'b', textRo: 'B. Motoarele funcționează doar cu semnale radio și nu au nevoie de fire', textEn: 'B. Motors operate solely on radio signals and do not need wiring' },
      { id: 'c', textRo: 'C. Microcontrollerul se oprește dacă detectează magneți', textEn: 'C. The microcontroller stops if it detects magnetic fields' },
      { id: 'd', textRo: 'D. Motoarele nu pot fi controlate prin cod C++', textEn: 'D. Motors cannot be commanded through C++ code' }
    ],
    correctOptionId: 'a',
    explanationRo:
      'Corect! Pinii microcontrollerului sunt pini de semnal logic de mică putere (max 40 mA). Motoarele sunt sarcini inductive de mare putere ce necesită amplificatoare de curent dedicate (drivere punte H L298N/L293D) alimentate din baterii externe.',
    explanationEn:
      'Correct! Microcontroller pins are low-power logic signal pins (max 40 mA). Motors are high-power inductive loads that require dedicated H-bridge current drivers (L298N/L293D) powered by external batteries.',
    manualRefRo: 'Manual pag. 96',
    manualRefEn: 'Textbook p. 96'
  },
  {
    id: 'q5',
    questionNumber: 5,
    titleRo: 'Masa Comună (GND) în Circuite Robotice Complexe',
    titleEn: 'Common Ground (GND) in Complex Robotic Circuits',
    questionTextRo:
      'Când alimentăm motoarele unui robot dintr-un pachet extern de baterii de 7.4V, ce conexiune este absolut obligatorie între baterie și placa Arduino (pag. 97–98)?',
    questionTextEn:
      'When powering a robot\'s motors from an external 7.4V battery pack, which connection is strictly mandatory between the battery and the Arduino board (pp. 97–98)?',
    hintRo: 'Fără această conexiune, semnalele de control nu au un potențial comun de 0V.',
    hintEn: 'Without this link, control signals have no common 0V reference potential.',
    options: [
      { id: 'a', textRo: 'A. Conectarea polului pozitiv (+) al bateriei la mufa USB', textEn: 'A. Connecting the positive (+) terminal of the battery to the USB port' },
      {
        id: 'b',
        textRo: 'B. Unirea masei GND a bateriei externe cu pinul GND al plăcii Arduino pentru a asigura o referință comună de 0V',
        textEn: 'B. Tying external battery GND to Arduino board GND to ensure a common 0V reference'
      },
      { id: 'c', textRo: 'C. Izolarea completă a masei pentru a nu trece curentul', textEn: 'C. Complete isolation of ground so no current flows' },
      { id: 'd', textRo: 'D. Îndepărtarea tuturor firelor negre din circuit', textEn: 'D. Removing all black wires from the circuit' }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! Pentru ca semnalele logice de comandă (HIGH/LOW) transmise de microcontroller către driverul de motoare să aibă sens, ambele componente trebuie să aibă exact același nivel de referință 0V (masă comună / Common Ground).',
    explanationEn:
      'Correct! For logic control signals (HIGH/LOW) from the microcontroller to the motor driver to have meaning, both components must share the exact same 0V reference voltage (Common Ground).',
    manualRefRo: 'Manual pag. 97–98',
    manualRefEn: 'Textbook pp. 97–98'
  }
];

export const R1Level7_RoboticsAndSensorsExam: React.FC<R1Level7Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  // 5 seconds cooldown on wrong answers
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isLocked(questionId) || submitted) return;

    sounds.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));

    const q = EXAM_QUESTIONS.find((item) => item.id === questionId);
    if (q) {
      if (optionId === q.correctOptionId) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
        triggerCooldown(questionId);
      }
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    EXAM_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });
    return Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
  };

  const allAnswered = EXAM_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSubmitExam = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    const score = calculateScore();
    if (score >= 70) {
      sounds.playLevelComplete();
    } else {
      sounds.playWrong();
    }
  };

  const handleFinishLevel = () => {
    const score = calculateScore();
    if (score >= 70) {
      if (onCompletePage) onCompletePage(score);
      if (onComplete) onComplete();
    }
  };

  const score = calculateScore();
  const romanianGrade = (1 + (score / 100) * 9).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-cyan-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-400/30 text-cyan-300">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  {lang === 'ro'
                    ? 'Unitatea 4 • Evaluare Sumativă (Manual pag. 98)'
                    : 'Unit 4 • Summative Assessment (Textbook p. 98)'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  {lang === 'ro' ? 'Standard Național 2025' : 'National Standard 2025'}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1">
                {lang === 'ro'
                  ? 'Examen Sumativ: Microcontrollere, Senzori & Actuatori Robotici'
                  : 'Summative Exam: Microcontrollers, Sensors & Robotic Actuators'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-cyan-300 font-mono">
              {lang === 'ro' ? 'Prag promovare: 70%' : 'Passing threshold: 70%'}
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {lang === 'ro' ? '5 Întrebări Oficiale' : '5 Official Questions'}
            </div>
          </div>
        </div>
        <p className="mt-4 text-cyan-100 text-sm leading-relaxed border-t border-cyan-800/40 pt-3">
          {lang === 'ro'
            ? 'Verifică stăpânirea conceptelor esențiale de mecatronică: arhitectura plăcii Arduino, conversia ADC pe 10 biți, senzorul ultrasonic HC-SR04, comanda motoarelor prin punte H și regulile fundamentale de cablare. Răspunsurile greșite activează o pauză de reflecție pedagogică de 5 secunde.'
            : 'Validate your grasp of essential mechatronics concepts: Arduino board architecture, 10-bit ADC conversion, HC-SR04 ultrasonic sonar, H-Bridge motor drivers, and fundamental circuit wiring. Incorrect answers trigger a 5-second pedagogical reflection timer.'}
        </p>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {EXAM_QUESTIONS.map((q) => {
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correctOptionId;
          const locked = isLocked(q.id);
          const title = lang === 'ro' ? q.titleRo : q.titleEn;
          const questionText = lang === 'ro' ? q.questionTextRo : q.questionTextEn;
          const manualRef = lang === 'ro' ? q.manualRefRo : q.manualRefEn;
          const hint = lang === 'ro' ? q.hintRo : q.hintEn;
          const explanation = lang === 'ro' ? q.explanationRo : q.explanationEn;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                  : selected
                  ? 'bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question title and header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold">
                    {q.questionNumber}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    {title}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-800/50 px-2 py-0.5 rounded">
                  {manualRef}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-slate-100 font-medium text-sm md:text-base leading-relaxed mb-4">
                {questionText}
              </p>

              {/* Pedagogical Reflection Banner */}
              {locked && !submitted && (
                <div className="mb-4">
                  <PedagogicalReflectionBanner
                    remainingSeconds={cooldowns[q.id] || 0}
                    tip={
                      lang === 'ro'
                        ? 'Gândește-te la modul în care microcontrollerele măsoară mărimile electrice (ADC) și protejează circuitele prin drivere dedicate!'
                        : 'Think about how microcontrollers measure electrical levels (ADC) and protect circuitry via dedicated motor drivers!'
                    }
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const isOptSelected = selected === opt.id;
                  const isOptCorrect = opt.id === q.correctOptionId;
                  const optionLabel = lang === 'ro' ? opt.textRo : opt.textEn;

                  let optStyle =
                    'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600';

                  if (locked && !submitted) {
                    optStyle = 'bg-slate-800/30 border-slate-800 text-slate-500 cursor-not-allowed opacity-60';
                  } else if (submitted) {
                    if (isOptCorrect) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold';
                    } else if (isOptSelected && !isOptCorrect) {
                      optStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                    } else {
                      optStyle = 'bg-slate-800/20 border-slate-800/40 text-slate-500';
                    }
                  } else if (isOptSelected) {
                    optStyle = 'bg-cyan-600/20 border-cyan-500 text-cyan-200 font-medium shadow-inner';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      disabled={locked || submitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all duration-200 flex items-start space-x-3 ${optStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono ${
                          isOptSelected
                            ? 'bg-cyan-500 text-white font-bold'
                            : 'bg-slate-700/60 text-slate-400'
                        }`}
                      >
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="flex-1 leading-snug">{optionLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hints & Explanations */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                {!submitted ? (
                  <button
                    onClick={() =>
                      setActiveHintId(activeHintId === q.id ? null : q.id)
                    }
                    className="text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 font-medium transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>
                      {activeHintId === q.id
                        ? lang === 'ro' ? 'Ascunde indiciul' : 'Hide hint'
                        : lang === 'ro' ? 'Arată indiciu' : 'Show hint'}
                    </span>
                  </button>
                ) : (
                  <div className="text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {lang === 'ro' ? 'Explicație didactică:' : 'Pedagogical Explanation:'}
                    </span>{' '}
                    {explanation}
                  </div>
                )}
              </div>

              {activeHintId === q.id && !submitted && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs">
                  <strong>{lang === 'ro' ? 'Indiciu:' : 'Hint:'}</strong> {hint}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Score Card after submission */}
      {submitted && (
        <div
          className={`p-6 rounded-2xl border text-center space-y-4 shadow-xl ${
            score >= 70
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-slate-900 border border-current">
            {score >= 70 ? (
              <GraduationCap className="w-8 h-8 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {score >= 70
                ? lang === 'ro'
                  ? 'Felicitări! Ai promovat Examenul de Robotică!'
                  : 'Congratulations! You passed the Robotics Exam!'
                : lang === 'ro'
                ? 'Punctaj insuficient pentru promovare'
                : 'Score insufficient to pass'}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              {lang === 'ro' ? 'Punctaj obținut: ' : 'Score obtained: '}
              <span className="font-bold text-white">{score}%</span> (
              {lang === 'ro' ? 'Nota echivalentă: ' : 'Equivalent Grade: '}
              <span className="font-bold text-white">{romanianGrade}</span>)
            </p>
          </div>

          {score >= 70 ? (
            <p className="text-xs text-emerald-300 max-w-lg mx-auto">
              {lang === 'ro'
                ? 'Ai demonstrat competențe avansate în arhitectura sistemelor încorporate, senzori și comanda actuatorilor. Felicitări pentru promovarea modulului de robotică!'
                : 'You have demonstrated advanced competencies in embedded systems architecture, sensors, and actuator control. Congratulations on completing the robotics module!'}
            </p>
          ) : (
            <p className="text-xs text-rose-300 max-w-lg mx-auto">
              {lang === 'ro'
                ? 'Ai nevoie de cel puțin 70% pentru a promova. Reia conceptele cheie și încearcă din nou!'
                : 'You need at least 70% to pass. Review key concepts and try again!'}
            </p>
          )}

          <div className="flex justify-center gap-3 pt-2">
            {score < 70 && (
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedAnswers({});
                  sounds.playClick();
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
              >
                {lang === 'ro' ? 'Reîncearcă Examenul' : 'Retry Exam'}
              </button>
            )}
            {score >= 70 && (
              <button
                onClick={handleFinishLevel}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>{lang === 'ro' ? 'Finalizează Modulul de Robotică' : 'Complete Robotics Module'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exam submission button */}
      {!submitted && (
        <div className="sticky bottom-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {allAnswered ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'ro'
                  ? 'Toate întrebările au fost completate!'
                  : 'All questions have been answered!'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde la toate cele 5 întrebări pentru a trimite lucrarea.'
                  : 'Answer all 5 questions to submit the exam paper.'}
              </span>
            )}
          </div>
          <button
            onClick={handleSubmitExam}
            disabled={!allAnswered}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${
              allAnswered
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{lang === 'ro' ? 'Trimite Lucrarea de Examen' : 'Submit Exam Paper'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
