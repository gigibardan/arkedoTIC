import React, { useState } from 'react';
import {
  Sigma,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Calculator,
  TrendingDown,
  TrendingUp,
  Hash,
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

interface C3Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C3Level2_StatisticalFunctions: React.FC<C3Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Active Function Selector
  const [activeFunc, setActiveFunc] = useState<'sum' | 'average' | 'min' | 'max' | 'count'>('average');

  // Sample data: Gradebook row values in B2:B6
  const [grades, setGrades] = useState<number[]>([10, 8, 9, 7, 10]);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const sumVal = grades.reduce((a, b) => a + b, 0);
  const avgVal = (sumVal / grades.length).toFixed(2);
  const minVal = Math.min(...grades);
  const maxVal = Math.max(...grades);
  const countVal = grades.length;

  const funcDetails = {
    sum: {
      name: lang === 'en' ? 'SUM (Total)' : 'SUM (Sumă)',
      formula: '=SUM(B2:B6)',
      result: sumVal.toString(),
      desc: lang === 'en'
        ? 'Adds all values in the specified range (10 + 8 + 9 + 7 + 10 = 44).'
        : 'Adună toate valorile din domeniul specificat (10 + 8 + 9 + 7 + 10 = 44).',
      icon: Sigma,
      color: 'text-emerald-400'
    },
    average: {
      name: lang === 'en' ? 'AVERAGE (Mean)' : 'AVERAGE (Medie)',
      formula: '=AVERAGE(B2:B6)',
      result: avgVal,
      desc: lang === 'en'
        ? 'Calculates the arithmetic mean of values (44 / 5 = 8.80). Empty cells are ignored.'
        : 'Calculează media aritmetică a valorilor (44 / 5 = 8.80). Celulele goale sunt ignorate.',
      icon: Calculator,
      color: 'text-teal-400'
    },
    min: {
      name: lang === 'en' ? 'MIN (Minimum)' : 'MIN (Minim)',
      formula: '=MIN(B2:B6)',
      result: minVal.toString(),
      desc: lang === 'en'
        ? 'Identifies the lowest numeric value in the range (minimum grade is 7).'
        : 'Identifică cea mai mică valoare numerică din domeniu (nota minimă obținută este 7).',
      icon: TrendingDown,
      color: 'text-amber-400'
    },
    max: {
      name: lang === 'en' ? 'MAX (Maximum)' : 'MAX (Maxim)',
      formula: '=MAX(B2:B6)',
      result: maxVal.toString(),
      desc: lang === 'en'
        ? 'Identifies the highest numeric value in the range (maximum grade is 10).'
        : 'Identifică cea mai mare valoare numerică din domeniu (nota maximă obținută este 10).',
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    count: {
      name: lang === 'en' ? 'COUNT (Tally)' : 'COUNT (Numărare)',
      formula: '=COUNT(B2:B6)',
      result: countVal.toString(),
      desc: lang === 'en'
        ? 'Counts how many cells contain actual numeric values (5 graded subjects).'
        : 'Numără câte celule conțin valori numerice efective (5 discipline notate).',
      icon: Hash,
      color: 'text-blue-400'
    }
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'averageFunc') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'minFunc') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'ignoreEmpty') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'averageFunc';
  const isQ2Correct = q2Answer === 'minFunc';
  const isQ3Correct = q3Answer === 'ignoreEmpty';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Textbook 2025 • Pages 26–27' : 'Manual Art Klett 2025 • Pag. 26–27'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Sigma className="w-8 h-8 text-emerald-400" />
              {lang === 'en'
                ? 'Level 2: Math & Statistical Functions: SUM, AVERAGE, MIN, MAX'
                : 'Nivelul 2: Funcțiile Matematice & Statistice: SUM, AVERAGE, MIN, MAX'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Discover automated functions that process hundreds of rows in a single step: calculating totals, arithmetic averages, min/max extremes, and counting numeric cells.'
                : 'Descoperă funcțiile automate care prelucrează sute de rânduri dintr-o singură mișcare: calculul sumei, mediei aritmetice, al extremelor min/max și numărarea celulelor cu date.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Module 1C' : 'Modulul 1C'}</div>
            <div className="text-2xl font-black text-emerald-400">2 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Functions Laboratory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'Interactive Lab: Evaluating Functions Across a Range'
                  : 'Laborator Interactiv: Evaluarea Funcțiilor pe Domeniu'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Choose a statistical function to apply across the grades in Column B (cells B2:B6)'
                  : 'Alege o funcție statistică pentru a o aplica pe notele din coloana B (celulele B2:B6)'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(funcDetails) as (keyof typeof funcDetails)[]).map((k) => {
              const isSelected = activeFunc === k;
              const f = funcDetails[k];
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => { sounds.playClick(); setActiveFunc(k); }}
                  className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs transition cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Sheet Grid & Active Function Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Table */}
          <div className="md:col-span-6 border border-slate-700 rounded-2xl overflow-hidden bg-slate-950 font-mono text-xs shadow-inner">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-2 border-r border-slate-800 w-12 bg-slate-850">◢</th>
                  <th className="p-2 border-r border-slate-800 text-left pl-3">
                    {lang === 'en' ? 'Column A: Subject' : 'Coloana A: Disciplină'}
                  </th>
                  <th className="p-2 w-32 bg-emerald-950/40 text-emerald-300 font-black">
                    {lang === 'en' ? 'Column B (Grades)' : 'Coloana B (Note)'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {[
                  { row: 2, subRo: 'Informatică & TIC', subEn: 'Computer Science & ICT', val: grades[0] },
                  { row: 3, subRo: 'Matematică', subEn: 'Mathematics', val: grades[1] },
                  { row: 4, subRo: 'Limba Română', subEn: 'Romanian Language', val: grades[2] },
                  { row: 5, subRo: 'Fizică', subEn: 'Physics', val: grades[3] },
                  { row: 6, subRo: 'Limba Engleză', subEn: 'English Language', val: grades[4] },
                ].map((r) => (
                  <tr key={r.row} className="hover:bg-slate-800/30">
                    <td className="p-2 border-r border-slate-850 bg-slate-900 text-slate-400 font-bold">{r.row}</td>
                    <td className="p-2 border-r border-slate-850 text-left pl-3 text-slate-300">
                      {lang === 'en' ? r.subEn : r.subRo}
                    </td>
                    <td className="p-2 font-bold text-white bg-emerald-500/10 border-l border-emerald-500/20">
                      {r.val}
                    </td>
                  </tr>
                ))}
                {/* Result Row */}
                <tr className="bg-teal-950/60 font-black border-t-2 border-teal-500/40 text-white">
                  <td className="p-2.5 border-r border-slate-850 bg-slate-900 font-bold text-teal-400">7</td>
                  <td className="p-2.5 text-right pr-4 text-teal-300">
                    {lang === 'en' ? `Result of ${funcDetails[activeFunc].name}:` : `Rezultat ${funcDetails[activeFunc].name}:`}
                  </td>
                  <td className="p-2.5 font-black text-amber-300 text-base">
                    {funcDetails[activeFunc].result}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Function Inspector Card */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400 font-sans">
                  {lang === 'en' ? 'Formula inserted into cell B7:' : 'Formula inserată în celula B7:'}
                </span>
                <span className="text-xs text-emerald-400 font-bold font-mono">
                  {lang === 'en' ? 'Evaluated value' : 'Valoare evaluată'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-700">
                <div className="text-base font-black text-white">{funcDetails[activeFunc].formula}</div>
                <div className="text-2xl font-black text-amber-300">{funcDetails[activeFunc].result}</div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                {funcDetails[activeFunc].desc}
              </p>
            </div>

            <div className="p-4 bg-teal-950/20 border border-teal-500/30 rounded-2xl text-xs text-teal-200 space-y-1">
              <strong className="text-white font-bold">
                {lang === 'en' ? 'Did you know? (Textbook p. 27):' : 'Știai că? (Manual pag. 27):'}
              </strong>
              <p className="leading-relaxed">
                {lang === 'en'
                  ? 'The AutoSum (Σ) button in the top-right ribbon automatically injects =SUM() for adjacent numeric cells without needing to type any characters!'
                  : 'Butonul AutoSum (Σ) din colțul dreapta-sus al panglicii adaugă automat formula =SUM() pentru celulele numerice din imediata apropiere, fără să fie nevoie să tastezi vreun caracter!'}
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
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Check: Math & Statistical Functions'
                : 'Verificare Pedagogică: Funcții Matematice & Statistice'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Answer the 3 textbook questions correctly to unlock Level 3'
                : 'Răspunde corect la cele 3 întrebări din manual pentru a debloca Nivelul 3'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. Which Excel function is used to calculate the arithmetic mean of grades in a cell range?'
                : '1. Ce funcție Excel este utilizată pentru a calcula media aritmetică a notelor dintr-un domeniu de celule?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'averageFunc',
                textRo: '=AVERAGE(domeniu)',
                textEn: '=AVERAGE(range)'
              },
              {
                id: 'mediaRomana',
                textRo: '=MEDIE(domeniu) în limba română',
                textEn: '=MEDIE(range) in Romanian'
              },
              {
                id: 'sumDivided',
                textRo: '=SUM(domeniu) fără împărțire',
                textEn: '=SUM(range) without division'
              },
              {
                id: 'countOnly',
                textRo: '=COUNT(domeniu)',
                textEn: '=COUNT(range)'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'averageFunc'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="Numele funcției este cel consacrat internațional în limba engleză pentru medie aritmetică."
            hintEn="The function name is the internationally established English word for arithmetic average."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! The =AVERAGE() function adds up all numeric cells in the range and divides by their count, ignoring blank cells.'
                  : 'Corect! Funcția =AVERAGE() adună toate celulele numerice din domeniu și împarte suma la numărul lor, ignorând celulele goale.'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. If you want to find the lowest test score in a list of 30 students, which function will you use?'
                : '2. Dacă vrei să afli cea mai mică notă obținută la o testare dintr-o listă de 30 de elevi, ce funcție vei alege?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'minFunc',
                textRo: '=MIN(domeniu)',
                textEn: '=MIN(range)'
              },
              {
                id: 'maxFunc',
                textRo: '=MAX(domeniu)',
                textEn: '=MAX(range)'
              },
              {
                id: 'smallWord',
                textRo: '=MIC(domeniu)',
                textEn: '=SMALL(range)'
              },
              {
                id: 'lowerFunc',
                textRo: '=LOWER(domeniu)',
                textEn: '=LOWER(range)'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'minFunc'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="Numele vine de la prescurtarea valorii minime (MIN)."
            hintEn="The name comes from the standard abbreviation of minimum (MIN)."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                lang === 'en'
                  ? 'Excellent! The =MIN() function returns the minimum numeric value from the provided range.'
                  : 'Excelent! Funcția =MIN() returnează valoarea numerică minimă din domeniul transmis ca parametru.'
              }
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. How does the =AVERAGE(B2:B10) function treat a blank cell compared to a cell containing the number 0?'
                : '3. Cum tratează funcția =AVERAGE(B2:B10) o celulă complet goală comparativ cu o celulă în care este tastată cifra 0?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'ignoreEmpty',
                textRo: 'Celula goală este ignorată complet din numitor, pe când cifra 0 este inclusă și trage media în jos',
                textEn: 'A blank cell is completely ignored from the divisor, whereas 0 is included and lowers the average'
              },
              {
                id: 'sameZero',
                textRo: 'Ambele sunt tratate identic, ca cifra 0',
                textEn: 'Both are treated identically as 0'
              },
              {
                id: 'crashSheet',
                textRo: 'Programul se oprește cu eroare',
                textEn: 'The program halts with an error'
              },
              {
                id: 'multiplyTen',
                textRo: 'Celula goală este transformată în nota 10',
                textEn: 'The blank cell is converted into a grade 10'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'ignoreEmpty'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="Dacă un elev a fost absent (celulă goală), nu trebuie să fie punctat cu zero la medie."
            hintEn="If a student was absent (empty cell), they should not be penalized with zero in their GPA."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={
                lang === 'en'
                  ? 'Exactly! Excel ignores empty cells when calculating the average, but if you explicitly type 0, it counts as a real score and pulls down the average.'
                  : 'Exact! Excel ignoră celulele goale la calculul mediei, dar dacă introduci explicit valoarea 0, aceasta este numărată ca o notă reală și coboară media.'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={2}
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
