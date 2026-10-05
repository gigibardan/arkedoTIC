import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Layers, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface A2Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

interface FlowchartSlot {
  slotId: string;
  expectedShape: 'OVAL' | 'PARALLELOGRAM' | 'DIAMOND' | 'RECTANGLE';
  slotDescriptionRo: string;
  slotDescriptionEn: string;
}

const FLOWCHART_SLOTS: FlowchartSlot[] = [
  { slotId: 'slot1', expectedShape: 'OVAL', slotDescriptionRo: '1. Începutul Algoritmului (START)', slotDescriptionEn: '1. Algorithm Start (START)' },
  { slotId: 'slot2', expectedShape: 'PARALLELOGRAM', slotDescriptionRo: '2. Citirea numerelor de la tastatură (Citește a, b)', slotDescriptionEn: '2. Read numbers from keyboard (Read a, b)' },
  { slotId: 'slot3', expectedShape: 'DIAMOND', slotDescriptionRo: '3. Verificarea condiției de decizie (a > b ?)', slotDescriptionEn: '3. Condition evaluation test (a > b ?)' },
  { slotId: 'slot4', expectedShape: 'RECTANGLE', slotDescriptionRo: '4. Atribuirea valorii maxime (Max = a)', slotDescriptionEn: '4. Assignment of max value (Max = a)' },
  { slotId: 'slot5', expectedShape: 'PARALLELOGRAM', slotDescriptionRo: '5. Tipărirea rezultatului final (Scrie Max)', slotDescriptionEn: '5. Output result display (Write Max)' },
  { slotId: 'slot6', expectedShape: 'OVAL', slotDescriptionRo: '6. Terminarea algoritmului (STOP)', slotDescriptionEn: '6. Algorithm Termination (STOP)' }
];

export const A2Level6_FlowchartBlocksLab: React.FC<A2Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Flowchart builder slots: slotId -> assignedShape
  const [slotAssignments, setSlotAssignments] = useState<Record<string, string | null>>({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null,
    slot6: null
  });
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Timer cooldown decrement
  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0);
    if (!hasActive) return;
    const timer = setInterval(() => {
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const [k, v] of Object.entries(prev)) {
          const val = v as number;
          if (val > 1) next[k] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldowns]);

  const handleAssignShape = (slotId: string, shapeKey: string) => {
    if ((cooldowns[slotId] || 0) > 0) return;
    sounds.playClick();
    setSlotAssignments(prev => ({ ...prev, [slotId]: shapeKey }));

    const slot = FLOWCHART_SLOTS.find(s => s.slotId === slotId);
    if (slot && slot.expectedShape === shapeKey) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [slotId]: 5 }));
    }
  };

  const handleResetFlowchart = () => {
    sounds.playClick();
    setSlotAssignments({ slot1: null, slot2: null, slot3: null, slot4: null, slot5: null, slot6: null });
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'diamond_decision';
  const handleQ1 = (val: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'diamond_decision') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const isQ2Correct = q2Answer === 'parallelogram_io';
  const handleQ2 = (val: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'parallelogram_io') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  // Scoring
  let correctCount = 0;
  FLOWCHART_SLOTS.forEach(s => {
    if (slotAssignments[s.slotId] === s.expectedShape) correctCount++;
  });
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 8;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 5;

  const shapeChoices = [
    { key: 'OVAL', labelRo: 'Oval / Rotunjit (Start/Stop)', labelEn: 'Oval (Start/Stop)' },
    { key: 'PARALLELOGRAM', labelRo: 'Paralelogram (Citire/Scriere)', labelEn: 'Parallelogram (I/O)' },
    { key: 'RECTANGLE', labelRo: 'Dreptunghi (Calcul/Atribuire)', labelEn: 'Rectangle (Calculation)' },
    { key: 'DIAMOND', labelRo: 'Romb (Decizie/Condiție)', labelEn: 'Diamond (Decision)' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-amber-950/60 border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-orange-500/20 border border-orange-400/40 rounded-2xl text-orange-300 text-3xl shrink-0 shadow-inner">
            📐
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5B • Page 6 of 7' : 'Modulul 5B • Pagina 6 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 70' : 'Manual pag. 70'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '6. Flowchart Standard Blocks & Graphical Architecture' : '6. Blocurile Schemelor Logice & Arhitectura Grafică'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'A flowchart represents an algorithm visually using standard geometric blocks: Ovals (Start/Stop), Parallelograms (Input/Output), Rectangles (Calculations), and Diamonds (Decisions).'
                : 'Schema logică este reprezentarea grafică a unui algoritm prin blocuri geometrice standardizate legate prin linii de flux: Oval (Start/Stop), Paralelogram (Citire/Scriere), Dreptunghi (Calcul) și Romb (Decizie).'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Flowchart Assembly Lab */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <GitPullRequest className="w-6 h-6 text-orange-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Interactive Lab: Assemble the Max-of-Two Flowchart' : 'Laborator Interactiv: Asamblarea Schemei Logice (Maximul a 2 Numere)'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Textbook page 70, Practical Flowchart Diagram' : 'Manual pagina 70, Schema logică completă'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetFlowchart}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset' : 'Resetează'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Assign the correct geometric block shape to each step of the algorithm:'
            : 'Alege forma geometrică corectă pentru fiecare pas al schemei logice:'}
        </p>

        <div className="space-y-4">
          {FLOWCHART_SLOTS.map((slot) => {
            const currentShape = slotAssignments[slot.slotId];
            const isCorrect = currentShape === slot.expectedShape;
            const hasCooldown = (cooldowns[slot.slotId] || 0) > 0;

            return (
              <div
                key={slot.slotId}
                className={`p-4 sm:p-5 rounded-2xl border transition space-y-3 ${
                  currentShape
                    ? isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60'
                      : 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="text-sm font-semibold text-white">
                  {lang === 'en' ? slot.slotDescriptionEn : slot.slotDescriptionRo}
                </div>

                {hasCooldown && (
                  <PedagogicalReflectionBanner
                    cooldown={cooldowns[slot.slotId]}
                    customMessageRo="Bloc geometric incorect! Te rugăm să acorzi 5 secunde pentru a asocia rolul (Start=Oval, Citire=Paralelogram, Calcul=Dreptunghi, Decizie=Romb)."
                    customMessageEn="Incorrect geometric shape! Please take 5 seconds to review flowchart block standards."
                  />
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {shapeChoices.map((choice) => (
                    <button
                      key={choice.key}
                      type="button"
                      disabled={hasCooldown}
                      onClick={() => handleAssignShape(slot.slotId, choice.key)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        hasCooldown ? 'opacity-60 cursor-not-allowed' : ''
                      } ${
                        currentShape === choice.key
                          ? choice.key === slot.expectedShape
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                            : 'bg-rose-500 text-white border-rose-400 font-extrabold shadow-md'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      {lang === 'en' ? choice.labelEn : choice.labelRo}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-orange-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Flowchart Symbolics' : 'Verifică-ți Cunoștințele: Simbolurile Schemelor Logice'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-orange-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which geometric shape is exclusively used for decision conditions with two output branches (YES / NO)?'
              : 'Ce formă geometrică este utilizată exclusiv pentru testarea condițiilor decizionale, având două căi de ieșire (DA / NU)?'}
          </div>

          {(cooldowns.q1 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza blocul Romb (decizie)."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the Diamond decision block."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'diamond_decision', text: lang === 'en' ? 'A) Diamond / Romb (Decizie)' : 'A) Rombul (Blocul de Decizie / Condiție)' },
              { id: 'triangle', text: lang === 'en' ? 'B) Triangle (Triunghi)' : 'B) Triunghiul' },
              { id: 'circle_only', text: lang === 'en' ? 'C) Perfect Circle (Cerc)' : 'C) Cercul' },
              { id: 'star_shape', text: lang === 'en' ? 'D) Star (Stea)' : 'D) Steaua' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q1 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q1Answer === opt.id
                    ? opt.id === 'diamond_decision'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_flow_q1"
            hintRo="Rombul are o intrare sus și două ieșiri (DA la dreapta/jos și NU la stânga)."
            hintEn="The diamond has one entry on top and two exits (YES and NO)."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={cooldowns.q1}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! The Diamond symbol represents decision branching in all ISO flowchart standards.' : 'Exact! Rombul este blocul universal de decizie, având întotdeauna două ramuri de ieșire: DA (True) și NU (False).')
                  : (lang === 'en' ? 'Incorrect. The decision block is the Diamond (Romb).' : 'Incorect. Blocul de decizie este Rombul.')
              }
              ruleReference="Manual TIC pag. 70"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-orange-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which block is used for reading user input data or printing final results?'
              : 'Ce bloc geometric este utilizat pentru operațiile de citire date de intrare sau scriere rezultate pe ecran?'}
          </div>

          {(cooldowns.q2 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza blocul Paralelogram (Intrare/Ieșire)."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the Parallelogram I/O block."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'parallelogram_io', text: lang === 'en' ? 'A) Parallelogram / Paralelogram (Intrare/Ieșire)' : 'A) Paralelogramul (Bloc de Intrare / Ieșire - Citire și Scriere)' },
              { id: 'oval_only', text: lang === 'en' ? 'B) Oval (used for Start/Stop)' : 'B) Ovalul (care este pentru Start/Stop)' },
              { id: 'rectangle_only', text: lang === 'en' ? 'C) Rectangle (used for calculations)' : 'C) Dreptunghiul (care este pentru calcul)' },
              { id: 'cloud', text: lang === 'en' ? 'D) Cloud shape' : 'D) Forma de nor' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q2 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q2Answer === opt.id
                    ? opt.id === 'parallelogram_io'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_flow_q2"
            hintRo="Paralelogramul reprezintă dialogul cu utilizatorul: Citește date și Scrie rezultate."
            hintEn="The parallelogram represents user dialogue: Read data and Write results."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={cooldowns.q2}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! Parallelograms handle Input/Output operations (Read and Write).' : 'Corect! Paralelogramul este blocul dedicat pentru operațiile de intrare/ieșire (Citește și Scrie).')
                  : (lang === 'en' ? 'Incorrect. Input and Output operations use the Parallelogram.' : 'Incorect. Citirea și scrierea se reprezintă prin Paralelogram.')
              }
              ruleReference="Manual TIC pag. 70"
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => {
          sounds.playCorrect();
          onCompletePage(earnedScore);
        }}
      />
    </div>
  );
};
