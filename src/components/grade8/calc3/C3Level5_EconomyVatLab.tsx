import React, { useState } from 'react';
import {
  Coins,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Percent,
  Receipt,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C3Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C3Level5_EconomyVatLab: React.FC<C3Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // VAT rate (standard in Romania: 19%)
  const vatRate = 0.19;

  // Products table state
  const [products, setProducts] = useState<{ id: number; name: string; netPrice: number }[]>([
    { id: 1, name: 'Ghiozdan Ergonomic', netPrice: 200 },
    { id: 2, name: 'Calculator Științific', netPrice: 150 },
    { id: 3, name: 'Set Instrumente Geometrie', netPrice: 40 },
    { id: 4, name: 'Caiet Studențesc A4', netPrice: 10 },
  ]);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const totalNet = products.reduce((acc, p) => acc + p.netPrice, 0);
  const totalVat = totalNet * vatRate;
  const totalGross = totalNet + totalVat;

  const handleUpdatePrice = (id: number, val: number) => {
    sounds.playClick();
    setProducts(prev => prev.map(p => p.id === id ? { ...p, netPrice: Math.max(1, val) } : p));
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'mult019') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'netPlusVat') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'mult119') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'mult019';
  const isQ2Correct = q2Answer === 'netPlusVat';
  const isQ3Correct = q3Answer === 'mult119';

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
              <span>
                {lang === 'en'
                  ? 'Art Klett Textbook 2025 • Page 28 (Economics Application)'
                  : 'Manual Art Klett 2025 • Pag. 28 (Aplicație Economică)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Receipt className="w-8 h-8 text-teal-400" />
              {lang === 'en'
                ? 'Level 5: Economics Workshop — VAT Calculations & Commercial Invoices'
                : 'Nivelul 5: Atelier Economic — Calculul TVA-ului & Facturi Comerciale'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'How does a store compute gross retail prices for school supplies by applying the standard 19% VAT? Master fundamental accounting formulas.'
                : 'Cum calculează un magazin prețul brut al rechizitelor școlare adăugând TVA-ul legal de 19%? Învață formulele de bază din contabilitatea modernă.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Module 1C' : 'Modulul 1C'}</div>
            <div className="text-2xl font-black text-teal-400">5 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Commercial Invoice Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'Invoice Simulator: Net Price → VAT (19%) → Gross Price'
                  : 'Simulator Factură: Preț Net → TVA (19%) → Preț Brut'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Column C formula: =B2*0.19 | Column D formula: =B2+C2'
                  : 'Formula din coloana C: =B2*0.19 | Formula din coloana D: =B2+C2'}
              </p>
            </div>
          </div>

          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs flex items-center gap-2">
            <span className="text-slate-400">{lang === 'en' ? 'Standard VAT rate:' : 'Cotă legală TVA:'}</span>
            <span className="text-amber-400 font-black">19%</span>
          </div>
        </div>

        {/* Live Invoice Sheet Grid */}
        <div className="border border-slate-700 rounded-2xl overflow-x-auto bg-slate-950 font-mono text-xs shadow-inner">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                <th className="p-2.5 border-r border-slate-800 w-12 bg-slate-850">◢</th>
                <th className="p-2.5 border-r border-slate-800 text-left pl-3">
                  {lang === 'en' ? 'A: Product Description' : 'A: Denumire Produs'}
                </th>
                <th className="p-2.5 border-r border-slate-800 text-right pr-4">
                  {lang === 'en' ? 'B: Price Excl. VAT (Net)' : 'B: Preț Fără TVA (Net)'}
                </th>
                <th className="p-2.5 border-r border-slate-800 text-right pr-4 text-amber-300">
                  {lang === 'en' ? 'C: VAT 19% (=B2*0.19)' : 'C: TVA 19% (=B2*0.19)'}
                </th>
                <th className="p-2.5 text-right pr-4 text-emerald-300 font-black">
                  {lang === 'en' ? 'D: Gross Price (=B2+C2)' : 'D: Preț Brut (=B2+C2)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {products.map((p, idx) => {
                const vat = p.netPrice * vatRate;
                const gross = p.netPrice + vat;
                const productNamesEn: Record<number, string> = {
                  1: 'Ergonomic Backpack',
                  2: 'Scientific Calculator',
                  3: 'Geometry Tool Set',
                  4: 'A4 Student Notebook'
                };
                return (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="p-2.5 border-r border-slate-850 bg-slate-900 text-slate-400 font-bold">{idx + 2}</td>
                    <td className="p-2.5 border-r border-slate-850 text-left pl-3 text-white font-medium">
                      {lang === 'en' ? (productNamesEn[p.id] || p.name) : p.name}
                    </td>
                    <td className="p-2.5 border-r border-slate-850 text-right pr-4 text-slate-300">
                      {p.netPrice.toFixed(2)} {lang === 'en' ? 'RON' : 'lei'}
                    </td>
                    <td className="p-2.5 border-r border-slate-850 text-right pr-4 text-amber-300 font-bold">
                      {vat.toFixed(2)} {lang === 'en' ? 'RON' : 'lei'}
                    </td>
                    <td className="p-2.5 text-right pr-4 text-emerald-400 font-bold">
                      {gross.toFixed(2)} {lang === 'en' ? 'RON' : 'lei'}
                    </td>
                  </tr>
                );
              })}

              {/* Total Invoice Row */}
              <tr className="font-black bg-emerald-950/40 border-t-2 border-emerald-500/50 text-white">
                <td className="p-3 border-r border-slate-850 bg-slate-900 font-bold text-slate-500">6</td>
                <td className="p-3 text-right pr-4 text-emerald-300 font-bold">
                  {lang === 'en' ? 'INVOICE GRAND TOTAL:' : 'TOTAL GENERAL FACTURĂ:'}
                </td>
                <td className="p-3 border-r border-slate-850 text-right pr-4 text-slate-300">
                  {totalNet.toFixed(2)} {lang === 'en' ? 'RON' : 'lei'}
                </td>
                <td className="p-3 border-r border-slate-850 text-right pr-4 text-amber-300">
                  {totalVat.toFixed(2)} {lang === 'en' ? 'RON' : 'lei'}
                </td>
                <td className="p-3 text-right pr-4 text-base text-emerald-300">
                  {totalGross.toFixed(2)} {lang === 'en' ? 'RON' : 'lei'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Price Modifiers */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-semibold">
            {lang === 'en'
              ? 'Test recalculation by adjusting the backpack price:'
              : 'Testează recalcularea modificând prețul ghiozdanului:'}
          </span>
          <div className="flex items-center gap-2">
            {[180, 200, 250, 300].map((pr) => (
              <button
                key={pr}
                type="button"
                onClick={() => handleUpdatePrice(1, pr)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs cursor-pointer border ${
                  products[0].netPrice === pr
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {pr} {lang === 'en' ? 'RON' : 'lei'}
              </button>
            ))}
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
              {lang === 'en' ? 'Pedagogical Check: Economic Calculations' : 'Verificare Pedagogică: Calcule Economice'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Answer the 3 textbook questions correctly to unlock Level 6'
                : 'Răspunde corect la cele 3 întrebări din manual pentru a debloca Nivelul 6'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. If the net price without VAT is in cell B2, how is the 19% VAT amount computed according to the textbook?'
                : '1. Dacă prețul fără TVA se află în celula B2, cum se calculează valoarea TVA-ului de 19% conform manualului?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'mult019',
                textRo: '=B2 * 0.19 (sau =B2 * 19%)',
                textEn: '=B2 * 0.19 (or =B2 * 19%)'
              },
              {
                id: 'add19',
                textRo: '=B2 + 19',
                textEn: '=B2 + 19'
              },
              {
                id: 'div19',
                textRo: '=B2 / 19',
                textEn: '=B2 / 19'
              },
              {
                id: 'power19',
                textRo: '=B2 ^ 19',
                textEn: '=B2 ^ 19'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'mult019'
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
            hintRo="19% înseamnă fracția 19/100, adică numărul zecimal 0.19."
            hintEn="19% equals the fraction 19/100, which is the decimal number 0.19."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! Multiplying the net price by 0.19 yields the exact value of the value-added tax (VAT).'
                  : 'Corect! Înmulțind prețul net cu 0.19 obținem exact valoarea taxei pe valoarea adăugată (TVA).'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. If the net value is in B2 and the VAT amount is in C2, how do you obtain the gross price (including VAT)?'
                : '2. Dacă valoarea netă este în B2 și valoarea TVA-ului în C2, cum obții prețul brut (cu TVA inclus)?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'netPlusVat',
                textRo: '=B2 + C2 (Prețul net adunat cu valoarea TVA-ului)',
                textEn: '=B2 + C2 (Net price added to VAT amount)'
              },
              {
                id: 'netMinusVat',
                textRo: '=B2 - C2',
                textEn: '=B2 - C2'
              },
              {
                id: 'netTimesVat',
                textRo: '=B2 * C2',
                textEn: '=B2 * C2'
              },
              {
                id: 'sumAverage',
                textRo: '=AVERAGE(B2:C2)',
                textEn: '=AVERAGE(B2:C2)'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'netPlusVat'
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
            hintRo="Prețul final include ambele sume: prețul produsului și taxa statului."
            hintEn="The final price incorporates both amounts: product price and government sales tax."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                lang === 'en'
                  ? 'Excellent! The gross price paid by the final customer is the sum of the merchant\'s net price and VAT: =B2+C2.'
                  : 'Excelent! Prețul brut plătit de clientul final este suma dintre prețul net al comerciantului și taxa TVA: =B2+C2.'
              }
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. Which direct formula computes the gross price in a single operation starting from net price in cell B2?'
                : '3. Ce formulă directă calculează prețul brut dintr-o singură mișcare pornind de la prețul net din celula B2?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'mult119',
                textRo: '=B2 * 1.19 (100% preț + 19% TVA = 119% = 1.19)',
                textEn: '=B2 * 1.19 (100% price + 19% VAT = 119% = 1.19)'
              },
              {
                id: 'mult019wrong',
                textRo: '=B2 * 0.19',
                textEn: '=B2 * 0.19'
              },
              {
                id: 'mult200',
                textRo: '=B2 * 2',
                textEn: '=B2 * 2'
              },
              {
                id: 'plusOne',
                textRo: '=B2 + 1',
                textEn: '=B2 + 1'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'mult119'
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
            hintRo="Prețul întreg (1) plus cota TVA (0.19) dă factorul de multiplicare 1.19."
            hintEn="The full base price (1) plus VAT rate (0.19) produces the 1.19 multiplier factor."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={
                lang === 'en'
                  ? 'Exactly! The 1.19 multiplier factor adds the 19% rate to any net price in a single multiplication: =B2*1.19.'
                  : 'Exact! Factorul 1.19 adaugă instantaneu cota de 19% la orice preț net dintr-o singură înmulțire: =B2*1.19.'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={5}
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
