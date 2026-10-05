import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Layers, 
  Check, 
  CreditCard,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface A2Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface DataItem {
  id: string;
  labelRo: string;
  labelEn: string;
  category: 'INPUT' | 'MANEUVER' | 'OUTPUT' | 'CONSTANT';
}

const DATA_ITEMS: DataItem[] = [
  { id: 'pin_card', labelRo: '1. Codul PIN introdus de client', labelEn: '1. PIN entered by client', category: 'INPUT' },
  { id: 'bank_commission', labelRo: '2. Comisionul fix de tranzacție (ex: 2.50 lei)', labelEn: '2. Fixed transaction fee (e.g. 2.50)', category: 'CONSTANT' },
  { id: 'temp_diff', labelRo: '3. Soldul temporar calculat în memorie (Sold - Sumă)', labelEn: '3. Temporary calculated balance in memory', category: 'MANEUVER' },
  { id: 'cash_dispensed', labelRo: '4. Bancnotele eliberate și chitanța finală tipărită', labelEn: '4. Dispensed cash & final printed receipt', category: 'OUTPUT' }
];

export const A2Level2_AlgorithmDataTypes: React.FC<A2Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Classifier State
  const [classifications, setClassifications] = useState<Record<string, string | null>>({
    pin_card: null,
    bank_commission: null,
    temp_diff: null,
    cash_dispensed: null
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

  const handleClassify = (itemId: string, cat: string) => {
    if ((cooldowns[itemId] || 0) > 0) return;
    sounds.playClick();
    setClassifications(prev => ({ ...prev, [itemId]: cat }));

    const target = DATA_ITEMS.find(d => d.id === itemId);
    if (target && target.category === cat) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [itemId]: 5 }));
    }
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'variables_change';
  const handleQ1 = (val: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'variables_change') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const isQ2Correct = q2Answer === 'constant_fixed';
  const handleQ2 = (val: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'constant_fixed') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  // Scoring
  let correctCount = 0;
  DATA_ITEMS.forEach(d => {
    if (classifications[d.id] === d.category) correctCount++;
  });
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 6;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 4;

  const categoryOptions = [
    { key: 'INPUT', labelRo: 'Dată de Intrare', labelEn: 'Input Data' },
    { key: 'CONSTANT', labelRo: 'Constantă', labelEn: 'Constant' },
    { key: 'MANEUVER', labelRo: 'Dată de Manevră', labelEn: 'Maneuver Data' },
    { key: 'OUTPUT', labelRo: 'Dată de Ieșire', labelEn: 'Output Data' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-blue-950/60 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-indigo-500/20 border border-indigo-400/40 rounded-2xl text-indigo-300 text-3xl shrink-0 shadow-inner">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5B • Page 2 of 7' : 'Modulul 5B • Pagina 2 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 64–65' : 'Manual pag. 64–65'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '2. Algorithm Data: Inputs, Variables, Constants & Outputs' : '2. Datele Algoritmilor: Intrare, Manevră, Ieșire, Constante & Variabile'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'An algorithm processes Input Data to generate expected Output Data, using intermediate Maneuver Variables. Constants maintain their fixed values, while Variables evolve with each assignment.'
                : 'Datele sunt informațiile prelucrate de algoritm. Datele de intrare sunt furnizate la început, datele de manevră sunt folosite temporar în calcule, iar datele de ieșire reprezintă rezultatul final!'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Interactive ATM Data Classifier Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-heading">
              {lang === 'en' ? 'Interactive Lab: ATM Data Pipeline Classifier' : 'Laborator Interactiv: Clasificatorul de Date de la Bancomat (ATM)'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Textbook page 64, Example ATM' : 'Manual pagina 64, Exemplul practic Bancomat'}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Classify each element of the ATM transaction algorithm into its proper role:'
            : 'Asociază fiecare element al tranzacției bancare cu rolul său algoritmic:'}
        </p>

        <div className="space-y-4">
          {DATA_ITEMS.map((item) => {
            const currentCat = classifications[item.id];
            const isCorrect = currentCat === item.category;
            const hasCooldown = (cooldowns[item.id] || 0) > 0;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition space-y-3 ${
                  currentCat
                    ? isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60'
                      : 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="text-sm font-semibold text-white">
                  {lang === 'en' ? item.labelEn : item.labelRo}
                </div>

                {hasCooldown && (
                  <PedagogicalReflectionBanner
                    cooldown={cooldowns[item.id]}
                    customMessageRo="Clasificare incorectă! Te rugăm să acorzi 5 secunde pentru a analiza rolul acestei date în cadrul tranzacției."
                    customMessageEn="Incorrect classification! Please take 5 seconds to analyze the role of this data."
                  />
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={hasCooldown}
                      onClick={() => handleClassify(item.id, opt.key)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        hasCooldown ? 'opacity-60 cursor-not-allowed' : ''
                      } ${
                        currentCat === opt.key
                          ? opt.key === item.category
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                            : 'bg-rose-500 text-white border-rose-400 font-extrabold shadow-md'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      {lang === 'en' ? opt.labelEn : opt.labelRo}
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
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Constants & Variables' : 'Verifică-ți Cunoștințele: Constante & Variabile'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-indigo-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What is the main difference between a Variable and a Constant in algorithms?'
              : 'Care este diferența esențială dintre o Variabilă și o Constantă într-un algoritm?'}
          </div>

          {(cooldowns.q1 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza diferența: variabila își poate schimba valoarea, constanta rămâne fixă."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on Variables vs Constants."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'variables_change', text: lang === 'en' ? 'A) Variables can change values during execution, Constants stay fixed' : 'A) Variabilele își pot modifica valoarea în timpul execuției, Constantele au valoare fixă' },
              { id: 'constants_fly', text: lang === 'en' ? 'B) Constants can fly in space' : 'B) Constantele zboară în spațiu' },
              { id: 'no_diff', text: lang === 'en' ? 'C) There is no difference between them' : 'C) Nu există nicio diferență' },
              { id: 'only_letters', text: lang === 'en' ? 'D) Variables can only store letter A' : 'D) Variabilele stochează doar litera A' }
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
                    ? opt.id === 'variables_change'
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
            hintId="algo_data_q1"
            hintRo="Constanta rămâne aceeași pe tot parcursul (ex: pi = 3.14). Variabila își schimbă conținutul (ex: suma = suma + 5)."
            hintEn="A constant remains unchanged (e.g. pi = 3.14). A variable modifies its value (e.g. sum = sum + 5)."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={cooldowns.q1}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! Variables are mutable memory containers, while Constants are immutable.' : 'Exact! Valoarea unei variabile se poate schimba la fiecare atribuire, în timp ce o constantă își păstrează valoarea fixă.')
                  : (lang === 'en' ? 'Incorrect. Variables modify values; Constants remain invariant.' : 'Incorect. Variabilele își modifică valoarea pe parcursul execuției.')
              }
              ruleReference="Manual TIC pag. 64"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-indigo-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which of the following is an example of a constant in a geometry algorithm?'
              : 'Care dintre următoarele reprezintă un exemplu tipic de constantă într-un algoritm geometric?'}
          </div>

          {(cooldowns.q2 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a identifica valoarea matematică fixă Pi = 3.14."
                customMessageEn="Incorrect answer! Please take 5 seconds to identify the mathematical constant Pi = 3.14."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'constant_fixed', text: lang === 'en' ? 'A) Number π (Pi ≈ 3.14159) or the number of sides of a triangle (3)' : 'A) Numărul π (Pi ≈ 3,14) sau numărul de laturi ale triunghiului (3)' },
              { id: 'user_radius', text: lang === 'en' ? 'B) The radius R typed by the user in each test' : 'B) Raza cercului R introdusă de utilizator la fiecare test' },
              { id: 'calculated_area', text: lang === 'en' ? 'C) The calculated area result' : 'C) Rezultatul final al ariei' },
              { id: 'random_number', text: lang === 'en' ? 'D) A randomly generated roll' : 'D) Un zar aruncat la întâmplare' }
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
                    ? opt.id === 'constant_fixed'
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
            hintId="algo_data_q2"
            hintRo="Numărul Pi (3.14) este o valoare universală fixă, ce nu se schimbă niciodată."
            hintEn="Number Pi (3.14) is a universal fixed value that never changes."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={cooldowns.q2}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! Mathematical constants like Pi or fixed coefficients never change during algorithmic calculation.' : 'Corect! Numărul Pi (3,14) sau constantele matematice au valori fixe stabilite din start.')
                  : (lang === 'en' ? 'Incorrect. Pi = 3.14 is the textbook constant example.' : 'Incorect. Raza R introdusă de utilizator este o variabilă, în timp ce Pi este o constantă.')
              }
              ruleReference="Manual TIC pag. 65"
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
