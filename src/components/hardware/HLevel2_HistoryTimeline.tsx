import React, { useState } from 'react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';
import { Clock, CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

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
}

const EVENTS: TimelineEvent[] = [
  {
    year: 1642,
    name: 'Pascalina',
    creator: 'Blaise Pascal (Franța)',
    description: 'Primul calculator mecanic, folosit pentru adunări și scăderi cu roți dințate.',
    icon: '⚙️',
    type: 'mechanical',
  },
  {
    year: 1946,
    name: 'ENIAC',
    creator: 'Armata SUA & Inginerii Eckert/Mauchly',
    description: 'Primul calculator electronic de uz general, numeric (digital). Cântărea 30 tone!',
    icon: '⚡',
    type: 'electronic',
  },
  {
    year: 1981,
    name: 'IBM PC',
    creator: 'IBM Entry Systems Division',
    description: 'Primul calculator personal (PC) modern care a ajuns pe birourile din întreaga lume.',
    icon: '🖥️',
    type: 'personal',
  },
  {
    year: 1994,
    name: 'IBM Simon',
    creator: 'IBM',
    description: 'Primul telefon inteligent (smartphone) cu ecran tactil, calendar și e-mail.',
    icon: '📱',
    type: 'smartphone',
  },
];

export const HLevel2_HistoryTimeline: React.FC<HLevel2Props> = ({ onComplete }) => {
  // Matched years: event name -> selected year
  const [matchedYears, setMatchedYears] = useState<Record<string, number | null>>({});
  
  // Textbook quiz questions (pag. 14):
  // Q1: Pascalina era un calculator... (mecanic / electronic / multimedia)
  // Q2: Calculatorul personal a aparut in secolul... (XX / XIX / XXI)
  const [qPascalina, setQPascalina] = useState<string | null>(null);
  const [qCentury, setQCentury] = useState<string | null>(null);
  
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const availableYears = [1642, 1946, 1981, 1994];

  const handleSelectYear = (eventName: string, year: number) => {
    sounds.playClick();
    setMatchedYears(prev => ({
      ...prev,
      [eventName]: year,
    }));
  };

  const allEventsMatched = EVENTS.every(e => matchedYears[e.name] === e.year);
  const isQ1Correct = qPascalina === 'mecanic';
  const isQ2Correct = qCentury === 'XX'; // 1981 is 20th century

  const canValidate = EVENTS.every(e => matchedYears[e.name] !== undefined) && qPascalina !== null && qCentury !== null;

  const handleValidate = () => {
    if (!canValidate) {
      sounds.playWrong();
      setShowErrors(true);
      return;
    }

    if (allEventsMatched && isQ1Correct && isQ2Correct) {
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
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-black uppercase tracking-wider font-mono">
              Nivelul 2 din 5 • Modulul Hardware
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Manual pag. 13–14</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            Călătoria în Timp: Istoria Sistemelor de Calcul ⏳
          </h2>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            Recompensă: +20 puncte
          </span>
        </div>
      </div>

      {/* Teacher Pro Tip */}
      <TeacherTip
        title="Sfat de Profesionist: De ce calculatoarele știu doar 0 și 1?"
        tip="• Toate computerele din lume, de la ENIAC (1946) până la cel mai nou smartphone, calculează în sistem binar! Cipurile au miliarde de tranzistoare microscopice care funcționează ca niște întrerupătoare de lumină: când trece curent este 1, când nu trece curent este 0."
        bookPage="13–14"
        extraAdvice="Blaise Pascal a inventat Pascalina în 1642 când avea doar 19 ani, pentru a-și ajuta tatăl la calculele de birou!"
      />

      {/* Timeline Matching Activity */}
      <div className="mb-7">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-400" />
            <span>Misiunea 1: Asociază fiecare etapă cu anul ei istoric (Manual pag. 13)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EVENTS.map((item) => {
            const selectedYear = matchedYears[item.name];
            const isCorrect = selectedYear === item.year;
            const isError = showErrors && !isCorrect;

            return (
              <div
                key={item.name}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isError
                    ? 'bg-rose-950/40 border-rose-500'
                    : isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/60'
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
                    Alege anul lansării:
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {availableYears.map((year) => {
                      const isSelected = selectedYear === year;
                      return (
                        <button
                          key={year}
                          onClick={() => handleSelectYear(item.name, year)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
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
                  {isError && (
                    <p className="text-[11px] text-rose-400 font-semibold mt-2">
                      Verifică figura 1 din manual pag. 13!
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Textbook Exercises (pag. 14) */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-6">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <span>Misiunea 2: Întrebări Fulger din Manual (pag. 14, Ex. 1)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1: Pascalina type */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs sm:text-sm text-slate-200 font-semibold mb-3">
              1. Pascalina din 1642 era un calculator:
            </p>
            <div className="flex flex-col gap-2">
              {[
                { id: 'electronic', label: 'Electronic (cu ecran și circuite)' },
                { id: 'mecanic', label: 'Mecanic (cu roți dințate și manivele) ✓' },
                { id: 'multimedia', label: 'Multimedia (cu difuzoare și video)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    sounds.playClick();
                    setQPascalina(opt.id);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition border cursor-pointer ${
                    qPascalina === opt.id
                      ? opt.id === 'mecanic'
                        ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold'
                        : 'bg-rose-950/40 text-rose-300 border-rose-500'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Century */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs sm:text-sm text-slate-200 font-semibold mb-3">
              2. Calculatorul personal (IBM PC în 1981) a apărut în secolul:
            </p>
            <div className="flex flex-col gap-2">
              {[
                { id: 'XIX', label: 'Secolul XIX (anii 1800)' },
                { id: 'XX', label: 'Secolul XX (anul 1981) ✓' },
                { id: 'XXI', label: 'Secolul XXI (după anul 2000)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    sounds.playClick();
                    setQCentury(opt.id);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition border cursor-pointer ${
                    qCentury === opt.id
                      ? opt.id === 'XX'
                        ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold'
                        : 'bg-rose-950/40 text-rose-300 border-rose-500'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validation / Next Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          {completed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Ai stăpânit axa timpului! +20 puncte adăugate.
            </span>
          ) : (
            <span>Conectează toți cei 4 ani istorici și rezolvă cele două exerciții.</span>
          )}
        </div>

        <button
          onClick={handleValidate}
          disabled={completed}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
            completed
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30 active:scale-95'
          }`}
        >
          <span>{completed ? 'Nivel Finalizat ✓' : 'Validează & Mergi la Nivelul 3 (+20 pct)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
