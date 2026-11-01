import React, { useState } from 'react';
import {
  DollarSign,
  Percent,
  Calendar,
  Clock,
  Hash,
  Sliders,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Binary,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C2Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C2Level3_NumberFormatsCatalog: React.FC<C2Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Active selected format
  const [activeFormat, setActiveFormat] = useState<'general' | 'number' | 'currency' | 'accounting' | 'shortDate' | 'longDate' | 'percent' | 'fraction'>('percent');
  const [decimals, setDecimals] = useState<number>(2);

  // Raw value being formatted
  const rawNumber = 0.19;

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const formatDefinitions = {
    general: {
      name: 'General',
      render: '0.19',
      desc: 'Formatul implicit; afișează numerele și textele exact așa cum sunt tastate, fără simboluri sau zecimale impuse.',
      icon: Hash
    },
    number: {
      name: 'Număr (Number)',
      render: (0.19).toFixed(decimals),
      desc: `Afișează valoarea cu exact ${decimals} zecimale fixe și permite separarea miilor prin punct sau virgulă.`,
      icon: Sliders
    },
    currency: {
      name: 'Monedă (Currency)',
      render: `${(1900.5).toLocaleString('ro-RO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} lei`,
      desc: 'Adaugă simbolul valutar (lei, RON, €) și afișează numerele negative în roșu sau cu semnul minus.',
      icon: DollarSign
    },
    accounting: {
      name: 'Contabilitate (Accounting)',
      render: `lei  ${(1900.5).toFixed(decimals)}`,
      desc: 'Aliniază simbolul monetar la marginea stângă și zecimalele pe o coloană perfect dreaptă. Zero este redat printr-o cratimă (-).',
      icon: Layers
    },
    shortDate: {
      name: 'Dată Scurtă (Short Date)',
      render: '15/09/2026',
      desc: 'Convertește un număr serial (în Excel data 1 este 01/01/1900) în formatul clasic zi/lună/an.',
      icon: Calendar
    },
    longDate: {
      name: 'Dată Lungă (Long Date)',
      render: 'Marți, 15 septembrie 2026',
      desc: 'Numele zilei și al lunii sunt scrise complet cu litere, ideal pentru diplome și rapoarte formale.',
      icon: Calendar
    },
    percent: {
      name: 'Procent (Percentage)',
      render: `${(rawNumber * 100).toFixed(decimals === 0 ? 0 : decimals)}%`,
      desc: 'Înmulțește valoarea celulei cu 100 și atașează simbolul %. De exemplu, 0.19 devine 19% (cota legală de TVA din România).',
      icon: Percent
    },
    fraction: {
      name: 'Fracție (Fraction)',
      render: '1/5 (aprox. 19/100)',
      desc: 'Convertește fracțiile zecimale în fracții ordinare cu numărător și numitor.',
      icon: Binary
    }
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'mult100') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'accountingDash') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'adjustDecimals') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'mult100';
  const isQ2Correct = q2Answer === 'accountingDash';
  const isQ3Correct = q3Answer === 'adjustDecimals';

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
              <span>Manual Art Klett 2025 • Pag. 23</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Percent className="w-8 h-8 text-teal-400" />
              Nivelul 3: Categoriile de Formate Numerice, Valute & Procente
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Cum transformi 0.19 în 19% fără să greșești calculele? Învață diferența dintre formatul Monedă, Contabilitate, Dată calendaristică și controlul zecimalelor.
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Modulul 1B</div>
            <div className="text-2xl font-black text-teal-400">3 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Number Formats Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Laborator: Galeria Categoriilor de Formate</h2>
              <p className="text-xs text-slate-400">
                Alege un format pentru a vedea cum se transformă vizual celula
              </p>
            </div>
          </div>

          {/* Decimals adjuster */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 font-mono">Zecimale: {decimals}</span>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setDecimals(prev => Math.min(prev + 1, 4)); }}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 hover:text-white rounded-lg font-mono font-bold cursor-pointer"
              title="Mărește numărul de zecimale"
            >
              .00 → .000
            </button>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setDecimals(prev => Math.max(prev - 1, 0)); }}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 hover:text-white rounded-lg font-mono font-bold cursor-pointer"
              title="Micșorează numărul de zecimale"
            >
              .000 → .00
            </button>
          </div>
        </div>

        {/* 8 Formats Grid Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(formatDefinitions) as (keyof typeof formatDefinitions)[]).map((key) => {
            const item = formatDefinitions[key];
            const isSelected = activeFormat === key;
            const Icon = item.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { sounds.playClick(); setActiveFormat(key); }}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-teal-500/20 border-teal-400 text-white ring-2 ring-teal-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                  {isSelected && <span className="text-[10px] text-teal-300 font-bold">ACTIV</span>}
                </div>
                <div className="text-xs font-bold">{item.name}</div>
              </button>
            );
          })}
        </div>

        {/* Live Transformation Card */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs text-slate-400 font-sans">Valoare stocată în memoria celulei:</span>
              <div className="text-lg font-bold text-slate-300">0.19 (număr curat)</div>
            </div>

            <ArrowRight className="w-6 h-6 text-teal-400 shrink-0 hidden sm:block" />

            <div className="space-y-1 text-center sm:text-right">
              <span className="text-xs text-emerald-400 font-sans font-bold">
                Afișat pe ecran cu formatul [{formatDefinitions[activeFormat].name}]:
              </span>
              <div className="text-2xl font-black text-emerald-300 bg-emerald-500/10 px-4 py-1.5 rounded-xl border border-emerald-500/30">
                {formatDefinitions[activeFormat].render}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">
            <strong>Descriere tehnică:</strong> {formatDefinitions[activeFormat].desc}
          </p>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificare Pedagogică: Formate Numerice</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări din manual pentru a debloca Nivelul 4</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Conform regulii din manual (pag. 23), ce calcul efectuează Excel când aplici formatul Procent (Percentage) unei celule?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'mult100', text: 'Înmulțește valoarea cu 100 și atașează simbolul % (ex: 0.19 devine 19%)' },
              { id: 'div100', text: 'Împarte valoarea la 100 și șterge toate zecimalele' },
              { id: 'sqrt', text: 'Extrage rădăcina pătrată din număr' },
              { id: 'textOnly', text: 'Nu face niciun calcul, doar schimbă culoarea fontului' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'mult100'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="19% înseamnă 19 sutimi (19/100 = 0.19). Pentru a afișa 19%, numărul 0.19 este înmulțit cu 100." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Formatul Percentage multiplică automat numărul cu 100 și plasează caracterul %, păstrând valoarea matematică reală."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Ce distincție vizuală are formatul Contabilitate (Accounting) față de formatul Monedă (Currency)?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'accountingDash', text: 'Aliniază simbolul valutar în stânga și redă valoarea zero printr-o cratimă (-)' },
              { id: 'noDecimals', text: 'În contabilitate este interzis să folosești bani cu zecimale (bani/cenți)' },
              { id: 'euroOnly', text: 'Formatul de contabilitate funcționează exclusiv în moneda Euro' },
              { id: 'soundBeep', text: 'Emite un sunet de casă de marcat la fiecare apăsare de tastă' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'accountingDash'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Privește cardul demonstrativ din laborator: simbolul valutar stă la stânga, iar zero devine o liniuță discretă." />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! Formatul Accounting este conceput pentru registre contabile: aliniază simbolurile la stânga, zecimalele pe o verticală perfectă și afișează 0 ca o cratimă."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Cum poți ajusta rapid numărul de cifre de după virgulă fără a intra în meniul complet de formatare?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'adjustDecimals', text: 'Folosind butoanele Mărire/Micșorare zecimale (.00 → .0) din grupul Număr' },
              { id: 'backspace', text: 'Ștergând cifrele cu tasta Backspace direct de la tastatură' },
              { id: 'capsLock', text: 'Ținând apăsată tasta Caps Lock' },
              { id: 'paint', text: 'Colorând cifrele nedorite cu vopsea albă în fundal' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'adjustDecimals'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Privește butoanele de zecimale din antetul laboratorului de mai sus." />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! Butoanele 'Increase Decimal' și 'Decrease Decimal' permit adăugarea sau rotunjirea vizuală a zecimalelor printr-un simplu clic."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={3}
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
