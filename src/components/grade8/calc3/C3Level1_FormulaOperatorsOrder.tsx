import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Divide,
  Percent,
  Plus,
  Minus,
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

interface C3Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C3Level1_FormulaOperatorsOrder: React.FC<C3Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Live Formula Evaluator
  const [valA, setValA] = useState<number>(10);
  const [valB, setValB] = useState<number>(5);
  const [valC, setValC] = useState<number>(2);
  const [activeFormulaType, setActiveFormulaType] = useState<'withoutParen' | 'withParen' | 'power'>('withoutParen');

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Computations demonstrating Operator Precedence
  // Case 1: =A1 + B1 * C1 (Multiplication first: 5 * 2 = 10, then 10 + 10 = 20)
  const resultWithoutParen = valA + valB * valC;
  // Case 2: =(A1 + B1) * C1 (Parentheses first: 10 + 5 = 15, then 15 * 2 = 30)
  const resultWithParen = (valA + valB) * valC;
  // Case 3: =A1 ^ C1 (10 ^ 2 = 100)
  const resultPower = Math.pow(valA, valC);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'equalSign') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'twenty') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'caretPower') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'equalSign';
  const isQ2Correct = q2Answer === 'twenty';
  const isQ3Correct = q3Answer === 'caretPower';

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
              <span>Manual Art Klett 2025 • Pag. 26</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Calculator className="w-8 h-8 text-emerald-400" />
              Nivelul 1: Sintaxa Formulelor, Operatori & Ordinea Operațiilor
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Cum calculează computerul o expresie matematică? De ce semnul „=” este cheia de pornire și cum influențează parantezele rotunde rezultatul final conform manualului?
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Modulul 1C</div>
            <div className="text-2xl font-black text-emerald-400">1 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Live Formula Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Divide className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Laborator: Ordinea Operațiilor Matematice</h2>
              <p className="text-xs text-slate-400">
                Modifică celulele de intrare și compară rezultatul cu paranteze vs fără paranteze
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'withoutParen', label: '=A1 + B1 * C1' },
              { id: 'withParen', label: '=(A1 + B1) * C1' },
              { id: 'power', label: '=A1 ^ C1 (Putere)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { sounds.playClick(); setActiveFormulaType(tab.id as any); }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs transition cursor-pointer border ${
                  activeFormulaType === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Cells Controller */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-slate-400">Celula A1 (Valoare 1):</span>
            <input
              type="number"
              value={valA}
              onChange={(e) => setValA(Number(e.target.value) || 0)}
              className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 text-white font-bold text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Celula B1 (Valoare 2):</span>
            <input
              type="number"
              value={valB}
              onChange={(e) => setValB(Number(e.target.value) || 0)}
              className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 text-white font-bold text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Celula C1 (Valoare 3):</span>
            <input
              type="number"
              value={valC}
              onChange={(e) => setValC(Number(e.target.value) || 0)}
              className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 text-white font-bold text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Formula Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-5 rounded-2xl border transition ${
            activeFormulaType === 'withoutParen' ? 'bg-emerald-950/30 border-emerald-500/50 ring-2 ring-emerald-500/30' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="text-xs font-mono text-slate-400 mb-1">Cazul 1: Fără Paranteze</div>
            <div className="text-base font-mono font-bold text-white mb-2">=A1 + B1 * C1</div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-slate-400">Pas 1: Înmuțirea B1 * C1 = {valB} * {valC} = <span className="text-amber-300 font-bold">{valB * valC}</span></div>
              <div className="text-slate-400">Pas 2: Adunarea A1 + {valB * valC} = {valA} + {valB * valC}</div>
              <div className="text-emerald-400 font-black text-lg pt-1 border-t border-slate-800 flex justify-between">
                <span>Rezultat Afișat:</span>
                <span>{resultWithoutParen}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Excel respectă prioritatea matematică: înmulțirea (*) are prioritate mai mare decât adunarea (+).
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition ${
            activeFormulaType === 'withParen' ? 'bg-teal-950/30 border-teal-500/50 ring-2 ring-teal-500/30' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="text-xs font-mono text-slate-400 mb-1">Cazul 2: Cu Paranteze Rotunde</div>
            <div className="text-base font-mono font-bold text-white mb-2">=(A1 + B1) * C1</div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-slate-400">Pas 1: Paranteza (A1 + B1) = ({valA} + {valB}) = <span className="text-cyan-300 font-bold">{valA + valB}</span></div>
              <div className="text-slate-400">Pas 2: Înmulțirea {valA + valB} * C1 = {valA + valB} * {valC}</div>
              <div className="text-teal-400 font-black text-lg pt-1 border-t border-slate-800 flex justify-between">
                <span>Rezultat Afișat:</span>
                <span>{resultWithParen}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Parantezele rotunde forțează adunarea să fie executată prima, modificând complet rezultatul!
            </p>
          </div>
        </div>

        {/* Operators Table from Textbook Page 26 */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            Operatorii Aritmetici Suportați (Manual pag. 26):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono pt-1">
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center"><span className="text-emerald-400 font-bold">+</span> Adunare</div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center"><span className="text-emerald-400 font-bold">-</span> Scădere</div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center"><span className="text-emerald-400 font-bold">*</span> Înmulțire</div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center"><span className="text-emerald-400 font-bold">/</span> Împărțire</div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center"><span className="text-emerald-400 font-bold">^</span> Ridicare la putere</div>
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
            <h2 className="text-lg font-bold text-white">Verificare Pedagogică: Operatori & Formule</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări din manual pentru a debloca Nivelul 2</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Cu ce caracter de punctuație trebuie să înceapă obligatoriu orice formulă într-o foaie de calcul tabelar?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'equalSign', text: 'Semnul egal (=)' },
              { id: 'colonSign', text: 'Semnul două puncte (:)' },
              { id: 'atSign', text: 'Semnul arond (@)' },
              { id: 'dollarSign', text: 'Semnul dolar ($)' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'equalSign'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Fără acest semn la început, Excel afișează textul brut fără a calcula niciun rezultat." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Semnul egal (=) instruiește motorul de calcul al programului că urmează o expresie matematică ce trebuie evaluată."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Care este rezultatul evaluării formulei =10 + 5 * 2 într-o celulă Excel?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'twenty', text: '20 (deoarece 5 * 2 = 10, apoi 10 + 10 = 20)' },
              { id: 'thirty', text: '30 (adunând întâi 10 + 5 = 15, apoi 15 * 2 = 30)' },
              { id: 'oneHundred', text: '100' },
              { id: 'zero', text: '0' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'twenty'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Amintește-ți ordinea operațiilor din matematică: înmulțirea se efectuează înaintea adunării." />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! Înmulțirea are prioritate mai mare decât adunarea: 5 * 2 se evaluează la 10, apoi se adaugă 10, rezultând 20. Pentru a obține 30, ar fi trebuit scrise paranteze: =(10+5)*2."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Ce simbol se utilizează în formulele Excel pentru operația de ridicare la putere (de exemplu 2 la puterea 3)?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'caretPower', text: 'Caracterul accent circumflex / căciulă (^) de exemplu =2^3' },
              { id: 'doubleStar', text: 'Doi asteriși (**) ca în limbajul Python' },
              { id: 'arrowUp', text: 'O săgeată grafică (↑)' },
              { id: 'tilde', text: 'Caracterul tildă (~)' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'caretPower'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Simbolul se găsește pe tasta 6 (Shift+6) pe tastaturile standard." />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! Simbolul ^ (caret) este operatorul aritmetic oficial de exponențiere în Excel: =2^3 returnează 8."
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
