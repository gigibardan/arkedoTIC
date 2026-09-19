import React, { useState } from 'react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AnswerExplanation } from '../common/AnswerExplanation';
import { QuestionHint } from '../common/QuestionHint';

interface HLevel1Props {
  onComplete: () => void;
}

interface RuleCard {
  id: string;
  text: string;
  isAllowed: boolean;
  bookRuleNumber?: number;
  category: 'food' | 'electric' | 'hardware' | 'software' | 'clean' | 'report';
  explanationRo: string;
  explanationEn: string;
}

const RULES_RO: RuleCard[] = [
  {
    id: 'r1',
    text: 'Accesul în laboratorul de informatică cu alimente, sucuri sau sticle deschise de apă.',
    isAllowed: false,
    bookRuleNumber: 4,
    category: 'food',
    explanationRo: 'Strict interzis! Firimiturile atrag insecte și blochează tastele, iar o singură picătură de lichid vărsată pe carcasă provoacă scurtcircuit și arde componentele electronice (Manual pag. 10).',
    explanationEn: 'Strictly forbidden! Food crumbs jam keyboard keys, and liquid spills cause electrical short circuits that destroy computer electronics (p. 10).',
  },
  {
    id: 'r2',
    text: 'Conectarea sau deconectarea de la priză a calculatoarelor sau atingerea cablurilor sub tensiune.',
    isAllowed: false,
    bookRuleNumber: 5,
    category: 'electric',
    explanationRo: 'Strict interzis! Cablurile electrice transportă tensiune periculoasă (230V). Doar profesorul sau tehnicianul are voie să umble la prize și tabloul de siguranțe.',
    explanationEn: 'Strictly forbidden! Live cables carry hazardous 230V electricity. Only the teacher or authorized technician may handle wall sockets and power cords.',
  },
  {
    id: 'r3',
    text: 'Anunțarea imediată a profesorului la orice neregulă sau defect constatat la echipamente.',
    isAllowed: true,
    bookRuleNumber: 3,
    category: 'report',
    explanationRo: 'Excelent și obligatoriu! Dacă observi un fir dezizolat, fum, un miros suspect sau ecranul nu pornește, anunță profesorul fără să încerci să repari singur.',
    explanationEn: 'Mandatory and responsible! Immediately alert the instructor whenever noticing frayed wires, strange smells, or hardware faults.',
  },
  {
    id: 'r4',
    text: 'Copierea sau instalarea de jocuri și programe software fără acordul profesorului.',
    isAllowed: false,
    bookRuleNumber: 8,
    category: 'software',
    explanationRo: 'Strict interzis! Descărcarea programelor neverificate poate infecta rețeaua școlii cu viruși și malware, încălcând politica de securitate.',
    explanationEn: 'Strictly forbidden! Unauthorized software downloads can compromise the school network with viruses and malware.',
  },
  {
    id: 'r5',
    text: 'Schimbarea între calculatoare a mouse-urilor sau tastaturilor cu ale colegilor.',
    isAllowed: false,
    bookRuleNumber: 7,
    category: 'hardware',
    explanationRo: 'Strict interzis! Deconectarea forțată a perifericelor poate deteriora mufele USB/PS2 de pe placa de bază și dereglează configurarea postului de lucru.',
    explanationEn: 'Strictly forbidden! Swapping peripherals damages connector pins and disrupts assigned workstation configurations.',
  },
  {
    id: 'r6',
    text: 'Păstrarea ordinii desăvârșite și lăsarea laboratorului curat la finalul orei.',
    isAllowed: true,
    bookRuleNumber: 12,
    category: 'clean',
    explanationRo: 'Corect! Așezarea scaunelor la birou și lăsarea suprafețelor curate previne accidentele și respectă munca colegilor din orele următoare.',
    explanationEn: 'Spot on! Pushing chairs in and keeping desks tidy prevents tripping hazards and ensures a safe workspace for all classes.',
  },
];

const RULES_EN: RuleCard[] = [
  {
    id: 'r1',
    text: 'Entering the computer lab with snacks, juices, or unsealed water bottles.',
    isAllowed: false,
    bookRuleNumber: 4,
    category: 'food',
    explanationRo: 'Strict interzis! Firimiturile atrag insecte și blochează tastele, iar o singură picătură de lichid vărsată pe carcasă provoacă scurtcircuit și arde componentele electronice (Manual pag. 10).',
    explanationEn: 'Strictly forbidden! Food crumbs jam keyboard keys, and liquid spills cause electrical short circuits that destroy computer electronics (p. 10).',
  },
  {
    id: 'r2',
    text: 'Plugging/unplugging school computers from electrical wall sockets or touching live wires.',
    isAllowed: false,
    bookRuleNumber: 5,
    category: 'electric',
    explanationRo: 'Strict interzis! Cablurile electrice transportă tensiune periculoasă (230V). Doar profesorul sau tehnicianul are voie să umble la prize și tabloul de siguranțe.',
    explanationEn: 'Strictly forbidden! Live cables carry hazardous 230V electricity. Only the teacher or authorized technician may handle wall sockets and power cords.',
  },
  {
    id: 'r3',
    text: 'Immediately informing the teacher whenever any equipment defect or issue is noticed.',
    isAllowed: true,
    bookRuleNumber: 3,
    category: 'report',
    explanationRo: 'Excelent și obligatoriu! Dacă observi un fir dezizolat, fum, un miros suspect sau ecranul nu pornește, anunță profesorul fără să încerci să repari singur.',
    explanationEn: 'Mandatory and responsible! Immediately alert the instructor whenever noticing frayed wires, strange smells, or hardware faults.',
  },
  {
    id: 'r4',
    text: 'Downloading, copying, or installing games/programs without teacher authorization.',
    isAllowed: false,
    bookRuleNumber: 8,
    category: 'software',
    explanationRo: 'Strict interzis! Descărcarea programelor neverificate poate infecta rețeaua școlii cu viruși și malware, încălcând politica de securitate.',
    explanationEn: 'Strictly forbidden! Unauthorized software downloads can compromise the school network with viruses and malware.',
  },
  {
    id: 'r5',
    text: 'Swapping keyboards or mice between different desks and classmates’ computers.',
    isAllowed: false,
    bookRuleNumber: 7,
    category: 'hardware',
    explanationRo: 'Strict interzis! Deconectarea forțată a perifericelor poate deteriora mufele USB/PS2 de pe placa de bază și dereglează configurarea postului de lucru.',
    explanationEn: 'Strictly forbidden! Swapping peripherals damages connector pins and disrupts assigned workstation configurations.',
  },
  {
    id: 'r6',
    text: 'Maintaining flawless tidiness and leaving the computer lab spotless at the end of class.',
    isAllowed: true,
    bookRuleNumber: 12,
    category: 'clean',
    explanationRo: 'Corect! Așezarea scaunelor la birou și lăsarea suprafețelor curate previne accidentele și respectă munca colegilor din orele următoare.',
    explanationEn: 'Spot on! Pushing chairs in and keeping desks tidy prevents tripping hazards and ensures a safe workspace for all classes.',
  },
];

export const HLevel1_ErgonomyRules: React.FC<HLevel1Props> = ({ onComplete }) => {
  const { lang, t } = useLanguage();

  // State for classified cards: cardId -> 'allowed' | 'forbidden'
  const [classifications, setClassifications] = useState<Record<string, 'allowed' | 'forbidden'>>({});
  
  // Ergonomic quiz answers
  const [monitorDistance, setMonitorDistance] = useState<string | null>(null);
  const [headPosture, setHeadPosture] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const rules = lang === 'en' ? RULES_EN : RULES_RO;

  const handleClassify = (cardId: string, choice: 'allowed' | 'forbidden') => {
    sounds.playClick();
    setClassifications(prev => ({
      ...prev,
      [cardId]: choice,
    }));
  };

  const totalClassified = Object.keys(classifications).length;
  const isRulesComplete = totalClassified === rules.length;
  const allRulesCorrect = rules.every(r => (r.isAllowed ? classifications[r.id] === 'allowed' : classifications[r.id] === 'forbidden'));

  const isDistanceCorrect = monitorDistance === '45-70';
  const isHeadCorrect = headPosture === 'straight';

  const canValidate = isRulesComplete && monitorDistance !== null && headPosture !== null;

  const handleValidate = () => {
    if (!canValidate) {
      sounds.playWrong();
      setShowErrors(true);
      return;
    }

    if (allRulesCorrect && isDistanceCorrect && isHeadCorrect) {
      sounds.playCorrect();
      setCompleted(true);
      onComplete();
    } else {
      sounds.playWrong();
      setShowErrors(true);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider font-mono">
              {lang === 'en' ? 'Level 1 of 5 • Hardware Module' : 'Nivelul 1 din 5 • Modulul Hardware'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {t.bookPagePrefix} 10–12</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            {lang === 'en' ? 'Lab Inspector & Ergonomics 🛡️' : 'Inspectorul Laboratorului & Ergonomia TIC 🛡️'}
          </h2>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            {lang === 'en' ? 'Reward: +20 points' : 'Recompensă: +20 puncte'}
          </span>
        </div>
      </div>

      {/* Teacher Tip Component */}
      <TeacherTip
        title={lang === 'en' ? 'Teacher Pro Tip: The 20-20-20 Rule & Drinks Policy!' : 'Sfat de Profesionist de la Profesor: Regula 20-20-20 & Lichidele!'}
        tip={lang === 'en'
          ? '• In the ICT lab, keep drinks and snacks in your backpack: a single dropped droplet on electronics can cause a short circuit and burn expensive parts! • For your eyesight, apply the 20-20-20 rule: every 20 minutes of screen time, gaze for 20 seconds at something 20 feet (6 meters) away!'
          : '• În laboratorul de informatică, apa și gustările stau în rucsac: o singură picătură căzută pe circuite poate provoca scurtcircuit și arde componente scumpe! • Pentru ochii tăi, aplică regula 20-20-20: la fiecare 20 de minute de ecran, privește 20 de secunde la 6 metri depărtare!'}
        bookPage="10–12"
        extraAdvice={lang === 'en'
          ? 'Elbows and knees should form 90° angles, back supported by your chair, and the top bezel of your monitor at eye level!'
          : 'Coatele și genunchii trebuie să formeze unghiuri de 90°, spatele sprijinit de spătar, iar marginea superioară a ecranului să fie la nivelul ochilor!'}
      />

      {/* Task 1: Rules Sorting */}
      <div className="mb-7">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>{lang === 'en' ? 'Mission 1: Sort lab safety & hygiene rules (Textbook p. 10)' : 'Misiunea 1: Sortează regulile de protecție a muncii (Manual pag. 10)'}</span>
          </h3>
          <span className="text-xs font-mono text-cyan-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700">
            {totalClassified}/{rules.length} {lang === 'en' ? 'classified' : 'clasificate'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {rules.map((rule) => {
            const currentChoice = classifications[rule.id];
            const isAssigned = currentChoice !== undefined;
            const isCorrect = isAssigned && (rule.isAllowed ? currentChoice === 'allowed' : currentChoice === 'forbidden');
            const isWrong = showErrors && !isCorrect;

            return (
              <div
                key={rule.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isWrong
                    ? 'bg-rose-950/40 border-rose-500'
                    : isAssigned
                    ? isCorrect
                      ? 'bg-slate-900/90 border-emerald-500/50'
                      : 'bg-amber-950/30 border-amber-500/50'
                    : 'bg-slate-900/50 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                    {rule.bookRuleNumber ? `R${rule.bookRuleNumber}` : '•'}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    {rule.text}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end">
                  <button
                    onClick={() => handleClassify(rule.id, 'allowed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                      currentChoice === 'allowed'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{lang === 'en' ? 'Allowed ✓' : 'Permis ✓'}</span>
                  </button>

                  <button
                    onClick={() => handleClassify(rule.id, 'forbidden')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                      currentChoice === 'forbidden'
                        ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                    <span>{lang === 'en' ? 'Forbidden ✕' : 'Strict Interzis ✕'}</span>
                  </button>
                </div>

                {/* Educational Pill on Choice */}
                {isAssigned && (
                  <AnswerExplanation
                    isCorrect={isCorrect}
                    explanationRo={rule.explanationRo}
                    explanationEn={rule.explanationEn}
                    customBadgeRo={isCorrect ? 'Regulă confirmată ✓' : 'Atenție la regulă!'}
                    customBadgeEn={isCorrect ? 'Rule confirmed ✓' : 'Rule warning!'}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task 2: Ergonomic Posture Quiz */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-6">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'en' ? 'Mission 2: Ergonomics & Posture Assessment (Textbook p. 11–12)' : 'Misiunea 2: Autoevaluarea Ergonomiei & Sănătății (Manual pag. 11–12)'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1: Monitor distance */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-200 font-semibold mb-2">
                {lang === 'en' ? '1. What is the optimal distance between eyes and monitor?' : '1. La ce distanță optimă trebuie așezat monitorul față de ochi?'}
              </p>

              <QuestionHint
                id="q-monitor-dist"
                hintRo="Conform manualului de TIC (pag. 11), distanța ideală este egală cu lungimea brațului întins: între 45 și 70 cm!"
                hintEn="According to the textbook (p. 11), the ideal distance is approximately an arm's length: 45 to 70 cm!"
              />

              <div className="flex flex-col gap-2 mt-2">
                {[
                  { id: '10-20', label: lang === 'en' ? '10 – 20 cm (very close, pressed against screen)' : '10 – 20 cm (foarte aproape, lipit de ecran)' },
                  { id: '45-70', label: lang === 'en' ? '45 – 70 cm (top edge at eye level) ✓' : '45 – 70 cm (partea de sus la nivelul ochilor) ✓' },
                  { id: '150-200', label: lang === 'en' ? '1.5 – 2 meters (far side of the room)' : '1,5 – 2 metri (la celălalt capăt al camerei)' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setMonitorDistance(opt.id);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition border cursor-pointer ${
                      monitorDistance === opt.id
                        ? opt.id === '45-70'
                          ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold ring-1 ring-emerald-400'
                          : 'bg-rose-950/40 text-rose-300 border-rose-500'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {monitorDistance && (
              <AnswerExplanation
                isCorrect={monitorDistance === '45-70'}
                explanationRo={
                  monitorDistance === '45-70'
                    ? 'Perfect! 45-70 cm permite citirea confortabilă fără forțarea mușchilor oculari, iar marginea de sus a ecranului la nivelul ochilor menține gâtul drept.'
                    : 'Incorect! O distanță sub 45 cm obosește ochii prin focalizare forțată, iar peste 1 m forțează aplecarea corpului înainte. Standardul medical este 45-70 cm (pag. 11).'
                }
                explanationEn={
                  monitorDistance === '45-70'
                    ? 'Spot on! 45-70 cm allows comfortable reading without eye strain, keeping the neck naturally aligned.'
                    : 'Incorrect! Less than 45 cm strains eye lenses; more than 1 m causes neck hunching. Optimal range is 45-70 cm (p. 11).'
                }
              />
            )}
          </div>

          {/* Question 2: Head posture on mobile */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-200 font-semibold mb-2">
                {lang === 'en' ? '2. How should you position your neck when using a phone or tablet?' : '2. Cum trebuie ținut capul când utilizăm telefonul sau tableta?'}
              </p>

              <QuestionHint
                id="q-phone-posture"
                hintRo="Aplecarea gâtului la 60° pune o presiune de 27 kg pe coloana cervicală! Ridică dispozitivul spre ochi."
                hintEn="Tilting your neck by 60° exerts 27 kg of pressure on cervical vertebrae! Raise the device to eye level."
              />

              <div className="flex flex-col gap-2 mt-2">
                {[
                  { id: 'straight', label: lang === 'en' ? 'Straight head, raising device to eye level ✓' : 'Capul drept, ridicând dispozitivul la nivel confortabil ✓' },
                  { id: 'bent', label: lang === 'en' ? 'Hunched forward towards chest' : 'Aplecat mult înainte spre piept' },
                  { id: 'lying', label: lang === 'en' ? 'Lying flat with screen below chin' : 'Culcat pe birou cu ecranul sub bărbie' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setHeadPosture(opt.id);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition border cursor-pointer ${
                      headPosture === opt.id
                        ? opt.id === 'straight'
                          ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold ring-1 ring-emerald-400'
                          : 'bg-rose-950/40 text-rose-300 border-rose-500'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {headPosture && (
              <AnswerExplanation
                isCorrect={headPosture === 'straight'}
                explanationRo={
                  headPosture === 'straight'
                    ? 'Foarte bine! Ținerea capului drept și ridicarea telefonului protejează coloana și previne durerile cronice de gât și umeri.'
                    : 'Incorect! Aplecarea capului multiplică greutatea exercitată asupra coloanei vertebrale (efectul „text neck”). Ridică mereu telefonul spre privire!'
                }
                explanationEn={
                  headPosture === 'straight'
                    ? 'Excellent! Keeping your head upright and raising your phone preserves spinal health and prevents text-neck syndrome.'
                    : 'Incorrect! Hunching forward subjects cervical vertebrae to immense tension. Always lift the device closer to eye level!'
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Validation / Next Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          {completed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'You passed the lab inspection! +20 points awarded.' : 'Ai promovat inspecția laboratorului! +20 puncte adăugate.'}
            </span>
          ) : (
            <span>{lang === 'en' ? 'Classify all 6 rules and answer both questions to validate.' : 'Clasifică toate cele 6 reguli și răspunde la ambele întrebări pentru validare.'}</span>
          )}
        </div>

        <button
          onClick={handleValidate}
          disabled={completed}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
            completed
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-95'
          }`}
        >
          <span>{completed ? (lang === 'en' ? 'Level Completed ✓' : 'Nivel Finalizat ✓') : (lang === 'en' ? 'Validate & Go to Level 2 (+20 pts)' : 'Validează & Mergi la Nivelul 2 (+20 pct)')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
