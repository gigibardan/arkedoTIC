import React, { useState } from 'react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';
import { Clock, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AnswerExplanation } from '../common/AnswerExplanation';
import { QuestionHint } from '../common/QuestionHint';
import { PedagogicalQuizCard } from '../common/PedagogicalQuizCard';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface HLevel2Props {
  onComplete: () => void;
}

interface TimelineEvent {
  year: number;
  name: string;
  creator: string;
  description: string;
  icon: string;
  type: 'mechanical' | 'electronic' | 'personal' | 'smartphone';
  factRo: string;
  factEn: string;
}

const EVENTS_RO: TimelineEvent[] = [
  {
    year: 1642,
    name: 'Pascalina',
    creator: 'Blaise Pascal (Franța)',
    description: 'Primul calculator mecanic, folosit pentru adunări și scăderi cu roți dințate.',
    icon: '⚙️',
    type: 'mechanical',
    factRo: 'În 1642, Pascalina a deschis era calculului automatizat folosind roți dințate de la 0 la 9.',
    factEn: 'In 1642, Pascaline launched mechanical calculation with 0-9 geared wheels.',
  },
  {
    year: 1946,
    name: 'ENIAC',
    creator: 'Armata SUA & Inginerii Eckert/Mauchly',
    description: 'Primul calculator electronic de uz general, numeric (digital). Cântărea 30 tone!',
    icon: '⚡',
    type: 'electronic',
    factRo: 'Finalizat în 1946, ENIAC folosea tuburi electronice și efectua 5000 adunări/secundă.',
    factEn: 'Finished in 1946, ENIAC used vacuum tubes and performed 5,000 additions per second.',
  },
  {
    year: 1981,
    name: 'IBM PC',
    creator: 'IBM Entry Systems Division',
    description: 'Primul calculator personal (PC) modern care a ajuns pe birourile din întreaga lume.',
    icon: '🖥️',
    type: 'personal',
    factRo: 'În august 1981, lansarea IBM PC a democratizat informatica pe biroul fiecărui elev și birou.',
    factEn: 'In August 1981, the IBM PC launch brought personal desktop computing into schools and homes.',
  },
  {
    year: 1994,
    name: 'IBM Simon',
    creator: 'IBM',
    description: 'Primul telefon inteligent (smartphone) cu ecran tactil, calendar și e-mail.',
    icon: '📱',
    type: 'smartphone',
    factRo: 'În 1994, IBM Simon a combinat telefonia mobilă cu ecranul tactil monocrom și e-mailul.',
    factEn: 'In 1994, IBM Simon merged cellular communication with touchscreen UI and email.',
  },
];

const EVENTS_EN: TimelineEvent[] = [
  {
    year: 1642,
    name: 'The Pascaline',
    creator: 'Blaise Pascal (France)',
    description: 'The first mechanical calculator, operating geared wheels for addition and subtraction.',
    icon: '⚙️',
    type: 'mechanical',
    factRo: 'În 1642, Pascalina a deschis era calculului automatizat folosind roți dințate de la 0 la 9.',
    factEn: 'In 1642, Pascaline launched mechanical calculation with 0-9 geared wheels.',
  },
  {
    year: 1946,
    name: 'ENIAC',
    creator: 'US Army & Eckert/Mauchly',
    description: 'The first electronic, general-purpose digital computer. Weighed 30 tons!',
    icon: '⚡',
    type: 'electronic',
    factRo: 'Finalizat în 1946, ENIAC folosea tuburi electronice și efectua 5000 adunări/secundă.',
    factEn: 'Finished in 1946, ENIAC used vacuum tubes and performed 5,000 additions per second.',
  },
  {
    year: 1981,
    name: 'IBM PC',
    creator: 'IBM Entry Systems Division',
    description: 'The iconic modern personal computer (PC) that brought computing onto desks worldwide.',
    icon: '🖥️',
    type: 'personal',
    factRo: 'În august 1981, lansarea IBM PC a democratizat informatica pe biroul fiecărui elev și birou.',
    factEn: 'In August 1981, the IBM PC launch brought personal desktop computing into schools and homes.',
  },
  {
    year: 1994,
    name: 'IBM Simon',
    creator: 'IBM',
    description: 'The first smartphone featuring a touchscreen, calendar, notes, and mobile email.',
    icon: '📱',
    type: 'smartphone',
    factRo: 'În 1994, IBM Simon a combinat telefonia mobilă cu ecranul tactil monocrom și e-mailul.',
    factEn: 'In 1994, IBM Simon merged cellular communication with touchscreen UI and email.',
  },
];

export const HLevel2_HistoryTimeline: React.FC<HLevel2Props> = ({ onComplete }) => {
  const { lang, t } = useLanguage();

  // Matched years: event index/id -> selected year
  const [matchedYears, setMatchedYears] = useState<Record<number, number | null>>({});
  const [yearCooldown, setYearCooldown] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(0);
  
  // Textbook quiz questions (pag. 14):
  const [qPascalina, setQPascalina] = useState<string | null>(null);
  const [qCentury, setQCentury] = useState<string | null>(null);
  
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const events = lang === 'en' ? EVENTS_EN : EVENTS_RO;
  const availableYears = [1642, 1946, 1981, 1994];

  const handleSelectYear = (idx: number, year: number) => {
    if (yearCooldown > 0) return;

    sounds.playClick();
    setMatchedYears(prev => ({
      ...prev,
      [idx]: year,
    }));

    if (year !== events[idx].year) {
      sounds.playWrong();
      setYearCooldown(5);
      const timer = setInterval(() => {
        setYearCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      sounds.playCorrect();
    }
  };

  const allEventsMatched = events.every((e, idx) => matchedYears[idx] === e.year);
  const isQ1Correct = qPascalina === 'mecanic';
  const isQ2Correct = qCentury === 'XX'; // 1981 is 20th century

  const canValidate = events.every((_, idx) => matchedYears[idx] !== undefined) && qPascalina !== null && qCentury !== null;

  const handleValidate = () => {
    if (cooldown > 0) return;

    if (!canValidate) {
      sounds.playWrong();
      setShowErrors(true);
      setCooldown(5);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    if (allEventsMatched && isQ1Correct && isQ2Correct) {
      sounds.playCorrect();
      setCompleted(true);
      onComplete();
    } else {
      sounds.playWrong();
      setShowErrors(true);
      setCooldown(5);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-black uppercase tracking-wider font-mono">
              {lang === 'en' ? 'Level 2 of 5 • Hardware Module' : 'Nivelul 2 din 5 • Modulul Hardware'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {t.bookPagePrefix} 13–14</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            {lang === 'en' ? 'Time Travel: History of Computing Systems ⏳' : 'Călătoria în Timp: Istoria Sistemelor de Calcul ⏳'}
          </h2>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            {lang === 'en' ? 'Reward: +20 points' : 'Recompensă: +20 puncte'}
          </span>
        </div>
      </div>

      {/* Teacher Pro Tip */}
      <TeacherTip
        title={lang === 'en' ? 'Teacher Pro Tip: Why do computers only understand 0 and 1?' : 'Sfat de Profesionist: De ce calculatoarele știu doar 0 și 1?'}
        tip={lang === 'en'
          ? '• Every computer in the world, from ENIAC (1946) to modern smartphones, calculates in binary! Microchips contain billions of transistors functioning as microscopic light switches: when electrical current passes it is 1, when it does not it is 0.'
          : '• Toate computerele din lume, de la ENIAC (1946) până la cel mai nou smartphone, calculează în sistem binar! Cipurile au miliarde de tranzistoare microscopice care funcționează ca niște întrerupătoare de lumină: când trece curent este 1, când nu trece curent este 0.'}
        bookPage="13–14"
        extraAdvice={lang === 'en'
          ? 'Blaise Pascal invented the Pascaline in 1642 when he was just 19 years old, to help his father with tedious tax calculations!'
          : 'Blaise Pascal a inventat Pascalina în 1642 când avea doar 19 ani, pentru a-și ajuta tatăl la calculele de birou!'}
      />

      {/* Timeline Matching Activity */}
      <div className="mb-7">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-400" />
            <span>{lang === 'en' ? 'Mission 1: Match each historical machine with its launch year (Textbook p. 13)' : 'Misiunea 1: Asociază fiecare etapă cu anul ei istoric (Manual pag. 13)'}</span>
          </h3>
        </div>

        {yearCooldown > 0 && (
          <PedagogicalReflectionBanner
            cooldown={yearCooldown}
            totalSeconds={5}
            customMessageRo="Ai ales un an greșit! Te rugăm să acorzi 5 secunde pentru a analiza evenimentele din manual (pag. 13) înainte de a alege alt an."
            customMessageEn="Incorrect year chosen! Please wait 5 seconds and check the textbook timeline (p. 13) before selecting another year."
            className="mb-4"
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((item, idx) => {
            const selectedYear = matchedYears[idx];
            const isAssigned = selectedYear !== undefined && selectedYear !== null;
            const isCorrect = selectedYear === item.year;
            const isError = showErrors && !isCorrect;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isError
                    ? 'bg-rose-950/40 border-rose-500'
                    : isAssigned && isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/60'
                    : isAssigned
                    ? 'bg-amber-950/30 border-amber-500/50'
                    : 'bg-slate-900/80 border-slate-700/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <h4 className="text-base font-black text-white font-heading">{item.name}</h4>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.creator}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider font-mono">
                    {lang === 'en' ? 'Select launch year:' : 'Alege anul lansării:'}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {availableYears.map((year) => {
                      const isSelected = selectedYear === year;
                      return (
                        <button
                          key={year}
                          disabled={yearCooldown > 0}
                          onClick={() => handleSelectYear(idx, year)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                                : 'bg-amber-600 text-white border-amber-400'
                              : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>

                  {isAssigned && (
                    <AnswerExplanation
                      isCorrect={isCorrect}
                      explanationRo={
                        isCorrect
                          ? `Exact! ${item.factRo}`
                          : `Anul ${selectedYear} nu corespunde cu ${item.name}. Anul corect din manual (pag. 13) este ${item.year}.`
                      }
                      explanationEn={
                        isCorrect
                          ? `Exactly! ${item.factEn}`
                          : `The year ${selectedYear} is not matching ${item.name}. The official textbook year (p. 13) is ${item.year}.`
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Textbook Exercises (pag. 14) with PedagogicalQuizCard */}
      <div className="space-y-4 mb-6">
        <PedagogicalQuizCard
          questionRo="1. Pascalina (inventată în 1642 de Blaise Pascal) era un calculator:"
          questionEn="1. The 1642 Pascaline was what type of calculator?"
          questionNumber={1}
          totalQuestions={2}
          bookPage="13-14"
          categoryLabelRo="Istorie TIC"
          categoryLabelEn="IT History"
          hintRo="În secolul al XVII-lea nu existau circuite electrice sau ecrane; funcționa exclusiv cu rotițe și manivele mecanice!"
          hintEn="In the 17th century there were no electric circuits; it operated purely with gears and mechanical cranks!"
          cooldownSeconds={5}
          maxXP={20}
          initialSelectedId={qPascalina || undefined}
          onAnswerSelected={(isCorrect, optId) => setQPascalina(optId)}
          options={[
            {
              id: 'electronic',
              labelRo: 'a) Electronic (cu circuite și tranzistoare)',
              labelEn: 'a) Electronic (with circuits & transistors)',
              isCorrect: false,
              explanationRo: 'Incorect! Primul calculator electronic numeric a fost ENIAC, apărut abia în 1946 (după 300 de ani de la Pascalina!).',
              explanationEn: 'Incorrect! The first electronic digital computer was ENIAC, built in 1946 (300 years after Pascaline!).',
            },
            {
              id: 'mecanic',
              labelRo: 'b) Mecanic (cu roți dințate și manivelă)',
              labelEn: 'b) Mechanical (with geared wheels and crank)',
              isCorrect: true,
              explanationRo: 'Corect! Pascalina era un dispozitiv pur mecanic bazat pe roți dințate rotative numerotate de la 0 la 9 (Manual pag. 13).',
              explanationEn: 'Correct! The Pascaline was entirely mechanical, using rotating gears with digits from 0 to 9 (p. 13).',
            },
            {
              id: 'multimedia',
              labelRo: 'c) Multimedia (cu boxe și imagini)',
              labelEn: 'c) Multimedia (with speakers and video)',
              isCorrect: false,
              explanationRo: 'Incorect! Multimedia a apărut spre sfârșitul secolului XX. Pascalina efectua doar calcule matematice elementare.',
              explanationEn: 'Incorrect! Multimedia emerged in the late 20th century. Pascaline only performed basic arithmetic.',
            },
          ]}
        />

        <PedagogicalQuizCard
          questionRo="2. Calculatorul personal modern (IBM PC) a apărut în secolul:"
          questionEn="2. The modern personal computer (IBM PC) emerged in which century?"
          questionNumber={2}
          totalQuestions={2}
          bookPage="14"
          categoryLabelRo="Secol Istoric"
          categoryLabelEn="Century"
          hintRo="Anul 1981 face parte din intervalul 1901–2000, adică secolul al XX-lea!"
          hintEn="The year 1981 belongs to the period 1901–2000, which is the 20th century!"
          cooldownSeconds={5}
          maxXP={20}
          initialSelectedId={qCentury || undefined}
          onAnswerSelected={(isCorrect, optId) => setQCentury(optId)}
          options={[
            {
              id: 'XIX',
              labelRo: 'a) Secolul XIX (anii 1800)',
              labelEn: 'a) 19th Century (1800s)',
              isCorrect: false,
              explanationRo: 'Incorect! În secolul al XIX-lea nu existau microprocesoare sau calculatoare personale.',
              explanationEn: 'Incorrect! There were no microprocessors or personal computers in the 19th century.',
            },
            {
              id: 'XX',
              labelRo: 'b) Secolul XX (anul 1981)',
              labelEn: 'b) 20th Century (the year 1981)',
              isCorrect: true,
              explanationRo: 'Excelent! IBM PC a fost creat în anul 1981, care aparține secolului al XX-lea (1901-2000).',
              explanationEn: 'Excellent! The IBM PC was created in 1981, which falls into the 20th century (1901-2000).',
            },
            {
              id: 'XXI',
              labelRo: 'c) Secolul XXI (după anul 2000)',
              labelEn: 'c) 21st Century (after 2000)',
              isCorrect: false,
              explanationRo: 'Incorect! Secolul XXI a început la 1 ianuarie 2001, când calculatoarele personale existau deja de două decenii.',
              explanationEn: 'Incorrect! The 21st century started in 2001, when personal computers were already in widespread use.',
            },
          ]}
        />
      </div>

      {/* Validation / Next Button */}
      {cooldown > 0 && (
        <div className="mb-3">
          <PedagogicalReflectionBanner
            cooldown={cooldown}
            totalSeconds={5}
            customMessageRo="Răspunsuri incorecte! Te rugăm să acorzi 5 secunde pentru a analiza axa timpului și întrebările înainte de a revalida."
            customMessageEn="Incorrect answers! Please take 5 seconds to review the timeline and questions before validating again."
          />
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          {completed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'You mastered the timeline! +20 points added.' : 'Ai stăpânit axa timpului! +20 puncte adăugate.'}
            </span>
          ) : (
            <span>{lang === 'en' ? 'Connect all 4 historic years and answer both questions.' : 'Conectează toți cei 4 ani istorici și rezolvă cele două exerciții.'}</span>
          )}
        </div>

        <button
          onClick={handleValidate}
          disabled={completed || cooldown > 0}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
            completed || cooldown > 0
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
              : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30 active:scale-95'
          }`}
        >
          <span>{completed ? (lang === 'en' ? 'Level Completed ✓' : 'Nivel Finalizat ✓') : (lang === 'en' ? 'Validate & Go to Level 3 (+20 pts)' : 'Validează & Mergi la Nivelul 3 (+20 pct)')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
