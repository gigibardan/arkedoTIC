import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Star,
  FileSpreadsheet
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C1Level7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C1Level7_ExcelMasterExam: React.FC<C1Level7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // 4 Questions from Textbook Autoevaluare (Page 20)
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'autoRecalc') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'd1e2') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'widthAutofit') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const handleQ4 = (id: string) => {
    if (isLocked('q4')) return;
    setQ4Answer(id);
    if (id === 'mathSignal') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q4');
    }
  };

  const isQ1Correct = q1Answer === 'autoRecalc';
  const isQ2Correct = q2Answer === 'd1e2';
  const isQ3Correct = q3Answer === 'widthAutofit';
  const isQ4Correct = q4Answer === 'mathSignal';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct, isQ4Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 4) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct && isQ4Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Exam Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>Test Oficial de Autoevaluare • Manual Art Klett 2025 Pag. 20</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-amber-400" />
              Nivelul 7: Evaluarea Sumativă a Modulului 1A (Excel Master)
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Demonstrează că stăpânești toate cerințele din programa națională de clasa a VIII-a. Răspunde corect la cele 4 întrebări din manual pentru a debloca Diploma Oficială de Merit și Nota 10!
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-amber-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Evaluare Finală</div>
            <div className="text-2xl font-black text-amber-400">7 / 7</div>
          </div>
        </div>
      </div>

      {/* Grade Indicator Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl">
            {correctCount === 4 ? '10' : correctCount === 3 ? '8' : correctCount === 2 ? '6' : correctCount === 1 ? '4' : '1'}
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Notă Estimată</div>
            <div className="text-base font-bold text-white">
              {correctCount === 4
                ? '🌟 Notă Maximă: 10 (Deblochează Diploma Oficială!)'
                : `${correctCount} din 4 răspunsuri corecte validate`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((idx) => {
            const isDone = (idx === 1 && isQ1Correct) || (idx === 2 && isQ2Correct) || (idx === 3 && isQ3Correct) || (idx === 4 && isQ4Correct);
            return (
              <div
                key={idx}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {idx}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Official Questions from Textbook Page 20 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
        {/* Q1 (Manual pag. 20 - Ex. 1) */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Într-o foaie de calcul s-au introdus notele unui elev și media generală. Dacă profesorul modifică nota la Geografie de la 7 la 9, ce se întâmplă cu media?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'autoRecalc', text: 'Media se recalculează automat și crește imediat, fără reintroducerea formulei' },
              { id: 'manualFormula', text: 'Media rămâne neschimbată până când ștergi și tastezi formula din nou' },
              { id: 'resetSheet', text: 'Foaia de calcul se resetează și notele celorlalți elevi se pierd' },
              { id: 'errorMsg', text: 'Apare mesajul de eroare #DIV/0! pe tot ecranul' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'autoRecalc'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Acesta este principiul de bază al calculului tabelar pe care l-ai exersat la Nivelul 1." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Recalcularea automată dinamică este funcția definitorie a programelor de calcul tabelar: orice modificare de intrare propagă noile rezultate în celulele dependente."
            />
          )}
        </div>

        {/* Q2 (Manual pag. 20 - Ex. 2) */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Care dintre următoarele notații reprezintă o adresare corectă a unui domeniu continuu de celule conform manualului?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'd1e2', text: 'D1:E2 (cu separatorul două puncte între colțul stânga-sus și dreapta-jos)' },
              { id: 'd1_dash_e2', text: 'D1-E2 (folosind semnul minus)' },
              { id: '1d2e', text: '1D:2E (cu numărul rândului înaintea literei coloanei)' },
              { id: 'd1_and_e2', text: 'D1 & E2 (folosind caracterul ampersand)' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'd1e2'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Amintește-ți de operatorul de domeniu (două puncte) și regula litera coloanei urmată de numărul rândului." />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! D1:E2 este notația carteziană canonică ce cuprinde celulele D1, E1, D2 și E2."
            />
          )}
        </div>

        {/* Q3 (Manual pag. 20 - Ex. 3) */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Cum rezolvi problema dacă într-o celulă cu numere apare afișat simbolul „####”?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'widthAutofit', text: 'Mărești lățimea coloanei prin tragerea separatorului sau dublu-clic (Autofit)' },
              { id: 'eraseNumber', text: 'Ștergi ultimele trei cifre din număr pentru a încăpea forțat' },
              { id: 'formatText', text: 'Transformi numărul în fișier PDF și îl printezi' },
              { id: 'changeKeyboard', text: 'Schimbi tastatura din limba Română în limba Engleză' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'widthAutofit'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Simbolul #### indică doar lipsa de spațiu pe orizontală." />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Corect! Semnul '####' dispare imediat ce coloana devine suficient de lată pentru a reda numărul complet."
            />
          )}
        </div>

        {/* Q4 (Manual pag. 20 - Ex. 4) */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              4. De ce orice formulă sau funcție dintr-o foaie de calcul trebuie să înceapă obligatoriu cu caracterul egal („=”)?
            </h3>
            {cooldowns.q4 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q4} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'mathSignal', text: 'Pentru a semnala programului că urmează o expresie de calculat, altfel ar fi tratată ca text obișnuit' },
              { id: 'equalRule', text: 'Este o simplă convenție grafică fără niciun rol computațional' },
              { id: 'password', text: 'Reprezintă parola secretă de deschidere a fișierului pe server' },
              { id: 'soundPlay', text: 'Pornește difuzoarele calculatorului pentru a reda o melodie' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q4')}
                onClick={() => handleQ4(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q4Answer === option.id
                    ? option.id === 'mathSignal'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Fără caracterul '=', dacă scrii '2+2', Excel afișează doar textul '2+2' și nu face calculul 4." />
          {q4Answer && (
            <AnswerExplanation
              isCorrect={isQ4Correct}
              explanation="Exact! Semnul '=' instruiește compilatorul intern al foii de calcul să evalueze expresia matematică și să randeze rezultatul final în celulă."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={7}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(100);
        }}
      />
    </div>
  );
};
