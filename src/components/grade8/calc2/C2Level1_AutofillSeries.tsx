import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Repeat,
  Plus,
  MousePointer,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C2Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C2Level1_AutofillSeries: React.FC<C2Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Autofill Simulator
  const [selectedSeriesType, setSelectedSeriesType] = useState<'days' | 'months' | 'numbersCtrl' | 'pattern2'>('days');
  const [fillLength, setFillLength] = useState<number>(3); // 1..7 items revealed

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const seriesData = {
    days: {
      title: 'Zilele Săptămânii (Română)',
      base: ['Luni', 'Marți'],
      full: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
      description: 'Excel recunoaște lista predefinită a zilelor săptămânii. Trăgând de „Luni”, generează automat zilele următoare.',
    },
    months: {
      title: 'Lunile Anului',
      base: ['Ianuarie', 'Februarie'],
      full: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie'],
      description: 'Listă cronologică standard. După „Decembrie”, ciclul se reia automat cu „Ianuarie”.',
    },
    numbersCtrl: {
      title: 'Numere cu tasta Ctrl (sau selecție 1, 2)',
      base: ['1', '2'],
      full: ['1', '2', '3', '4', '5', '6', '7'],
      description: 'Dacă tragi o singură cifră (1) fără Ctrl, Excel o duplică (1, 1, 1). Dacă ții apăsat Ctrl sau selectezi 1 și 2, generează seria incrementată cu pasul 1.',
    },
    pattern2: {
      title: 'Progresie Aritmetică cu pasul 5',
      base: ['5', '10'],
      full: ['5', '10', '15', '20', '25', '30', '35'],
      description: 'Selectând celulele cu valorile 5 și 10, Excel calculează diferența (10 - 5 = 5) și continuă pasul aritmetic: 15, 20, 25...',
    }
  };

  const currentSeries = seriesData[selectedSeriesType];

  const handleDragMore = () => {
    if (fillLength < currentSeries.full.length) {
      sounds.playClick();
      setFillLength(prev => prev + 1);
    }
  };

  const handleResetFill = () => {
    sounds.playClick();
    setFillLength(2);
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'ctrlKey') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'bottomRight') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'detectStep') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'ctrlKey';
  const isQ2Correct = q2Answer === 'bottomRight';
  const isQ3Correct = q3Answer === 'detectStep';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-emerald-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 21–22</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Repeat className="w-8 h-8 text-teal-400" />
              Nivelul 1: Generarea Seriilor de Date & Mânerul de Umplere (Autofill)
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Cum poți scrie numerele de la 1 la 100 sau lunile anului în doar 2 secunde fără să le tastezi pe fiecare? Descoperă magia funcției Autofill și rolul tastei Ctrl!
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Modulul 1B</div>
            <div className="text-2xl font-black text-teal-400">1 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator: Autofill Series Generator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <MousePointer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Simulator Interactiv: Mânerul de Umplere (Fill Handle)</h2>
              <p className="text-xs text-slate-400">
                Alege tipul de serie și trage mânerul din colțul celulei pentru a extinde datele
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDragMore}
              disabled={fillLength >= currentSeries.full.length}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Trage Mânerul în Jos (↓)</span>
            </button>
            <button
              type="button"
              onClick={handleResetFill}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:text-white transition cursor-pointer border border-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Series Type Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'days', label: 'Zilele Săptămânii' },
            { id: 'months', label: 'Lunile Anului' },
            { id: 'numbersCtrl', label: 'Numere cu Ctrl (1, 2..)' },
            { id: 'pattern2', label: 'Pas Aritmetic (+5)' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedSeriesType(tab.id as any);
                setFillLength(2);
              }}
              className={`p-3 rounded-2xl text-xs font-bold transition text-left border cursor-pointer ${
                selectedSeriesType === tab.id
                  ? 'bg-teal-500/20 border-teal-400 text-teal-200 ring-2 ring-teal-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Simulated Sheet Column with Fill Handle */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-slate-400">
              <span>Coloana A (Foaia de calcul)</span>
              <span className="text-teal-400 font-bold">{fillLength} celule completate</span>
            </div>

            <div className="space-y-1">
              {currentSeries.full.slice(0, fillLength).map((val, idx) => {
                const isLast = idx === fillLength - 1;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between relative transition ${
                      isLast
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 font-bold ring-2 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[10px] w-6">A{idx + 1}</span>
                      <span>{val}</span>
                    </div>

                    {isLast && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                          Celula Activă
                        </span>
                        {/* Little Fill Handle box */}
                        <div
                          className="w-3.5 h-3.5 bg-emerald-400 border border-slate-950 shadow cursor-crosshair rounded-xs"
                          title="Mânerul de umplere (Fill handle)"
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-6 space-y-4">
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
              <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {currentSeries.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentSeries.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <strong className="text-white">Regula Fundamentală din Manual (pag. 21):</strong>
              <p className="leading-relaxed">
                Mânerul de umplere este micul pătrat negru/verde situat în colțul din <strong>dreapta-jos</strong> al celulei active. Când plasezi cursorul mouse-ului peste el, cursorul se transformă dintr-o cruce albă groasă într-o <strong>cruce subțire neagră (+)</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificare Pedagogică: Seriile Autofill</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări din manual pentru a debloca Nivelul 2</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Conform manualului (pag. 21), ce tastă trebuie să ții apăsată în timp ce tragi mânerul celulei cu valoarea „1” pentru a obține seria 1, 2, 3, 4, 5?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'ctrlKey', text: 'Tasta Ctrl (Control)' },
              { id: 'spaceBar', text: 'Bara de spațiu apăsată continuu' },
              { id: 'capsLock', text: 'Tasta Caps Lock' },
              { id: 'f1Key', text: 'Tasta de ajutor F1' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'ctrlKey'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Tasta Ctrl îi indică programului Excel să incrementeze seria cu +1 în loc să copieze aceeași cifră." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Dacă tragi cifra 1 simplu, se obține 1, 1, 1... Dacă ții apăsată tasta Ctrl, apare un mic plus (+) deasupra cursorului și se generează seria crescătoare 1, 2, 3, 4, 5."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Unde este poziționat mânerul de umplere (fill handle) al celulei active?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'bottomRight', text: 'În colțul din dreapta-jos al chenarului celulei active' },
              { id: 'topLeft', text: 'În colțul din stânga-sus' },
              { id: 'taskbar', text: 'În bara de activități Windows de pe desktop' },
              { id: 'center', text: 'În centrul exact al foii de calcul' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'bottomRight'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Privește conturul verde al celulei selectate: unde se află micul pătrățel plin?" />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! Mânerul de umplere este situat întotdeauna în colțul dreapta-jos al celulei sau selecției curente."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Dacă selectezi simultan două celule consecutive care conțin valorile 10 și 20, ce valori va genera tragerea mânerului de umplere?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'detectStep', text: '30, 40, 50... calculând automat rația de +10' },
              { id: 'repeat1020', text: '10, 20, 10, 20... fără nicio creștere aritmetică' },
              { id: 'randomNum', text: 'Numere prime aleatorii' },
              { id: 'crash', text: 'Programul se blochează și cere parola de administrator' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'detectStep'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Excel analizează diferența dintre cele două celule: 20 - 10 = 10, continuând seria cu același pas." />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! Când selectezi cel puțin două valori inițiale, Excel deduce pasul progresiei aritmetice și continuă seria adăugând acea diferență (+10) la fiecare pas."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={1}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
