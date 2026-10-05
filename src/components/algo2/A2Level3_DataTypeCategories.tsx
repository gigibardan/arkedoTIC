import React, { useState, useEffect } from 'react';
import { 
  Binary, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Type, 
  Hash, 
  ToggleLeft,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface A2Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

interface ValueCard {
  id: string;
  display: string;
  type: 'NUMERIC' | 'TEXT' | 'LOGIC';
  explanationRo: string;
  explanationEn: string;
}

const VALUES_LIST: ValueCard[] = [
  { id: 'v1', display: '-273.15', type: 'NUMERIC', explanationRo: 'Număr real negativ (temperatură)', explanationEn: 'Negative real number (temperature)' },
  { id: 'v2', display: '„Informatică și TIC”', type: 'TEXT', explanationRo: 'Șir de caractere delimitat de ghilimele', explanationEn: 'Character string enclosed in quotes' },
  { id: 'v3', display: 'Adevărat (True)', type: 'LOGIC', explanationRo: 'Valoare de adevăr logică booleană', explanationEn: 'Boolean logical truth value' },
  { id: 'v4', display: '2026', type: 'NUMERIC', explanationRo: 'Număr natural întreg', explanationEn: 'Natural integer number' }
];

export const A2Level3_DataTypeCategories: React.FC<A2Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Type Matcher State
  const [matches, setMatches] = useState<Record<string, string | null>>({
    v1: null,
    v2: null,
    v3: null,
    v4: null
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

  const handleMatch = (cardId: string, typeKey: string) => {
    if ((cooldowns[cardId] || 0) > 0) return;
    sounds.playClick();
    setMatches(prev => ({ ...prev, [cardId]: typeKey }));

    const target = VALUES_LIST.find(v => v.id === cardId);
    if (target && target.type === typeKey) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [cardId]: 5 }));
    }
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'valid_naming';
  const handleQ1 = (val: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'valid_naming') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const isQ2Correct = q2Answer === 'boolean_two_values';
  const handleQ2 = (val: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'boolean_two_values') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  // Scoring
  let correctCount = 0;
  VALUES_LIST.forEach(v => {
    if (matches[v.id] === v.type) correctCount++;
  });
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 6;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 4;

  const typeButtons = [
    { key: 'NUMERIC', icon: <Hash className="w-3.5 h-3.5 text-cyan-400" />, labelRo: 'Numeric', labelEn: 'Numeric' },
    { key: 'TEXT', icon: <Type className="w-3.5 h-3.5 text-amber-400" />, labelRo: 'Text (String)', labelEn: 'Text (String)' },
    { key: 'LOGIC', icon: <ToggleLeft className="w-3.5 h-3.5 text-emerald-400" />, labelRo: 'Logic (Boolean)', labelEn: 'Logic (Boolean)' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-emerald-950/60 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-teal-500/20 border border-teal-400/40 rounded-2xl text-teal-300 text-3xl shrink-0 shadow-inner">
            🏷️
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5B • Page 3 of 7' : 'Modulul 5B • Pagina 3 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 65' : 'Manual pag. 65'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '3. Data Type Categories & Variable Naming Rules' : '3. Tipuri de Date (Numeric, Text, Logic) & Reguli de Denumire'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Computers classify values into exact data types: Numeric (integers & decimals), Text strings, and Logical boolean values (True / False). Learn naming syntax rules for variables!'
                : 'Fiecare dată are un tip precis: Numeric (numere întregi/reale), Text (șiruri de caractere între ghilimele) și Logic (Adevărat/Fals). Numele variabilelor trebuie să fie unice și fără spații!'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Interactive Data Type Matcher */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
          <Binary className="w-6 h-6 text-teal-400" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-heading">
              {lang === 'en' ? 'Data Type Inspector Lab' : 'Laborator: Clasificarea Tipurilor de Date'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Textbook page 65, Exercise 2' : 'Manual pagina 65, Exercițiul 2'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VALUES_LIST.map((val) => {
            const currentMatch = matches[val.id];
            const isCorrect = currentMatch === val.type;
            const hasCooldown = (cooldowns[val.id] || 0) > 0;

            return (
              <div
                key={val.id}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  currentMatch
                    ? isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60'
                      : 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="text-base font-mono font-black text-white text-center py-2 bg-slate-900 rounded-xl border border-slate-800">
                  {val.display}
                </div>

                {hasCooldown && (
                  <PedagogicalReflectionBanner
                    cooldown={cooldowns[val.id]}
                    customMessageRo="Tip incorect! Te rugăm să acorzi 5 secunde pentru a analiza natura valorii (număr, text sau boolean)."
                    customMessageEn="Incorrect type! Please take 5 seconds to analyze the value."
                  />
                )}

                <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                  {typeButtons.map((btn) => (
                    <button
                      key={btn.key}
                      type="button"
                      disabled={hasCooldown}
                      onClick={() => handleMatch(val.id, btn.key)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        hasCooldown ? 'opacity-60 cursor-not-allowed' : ''
                      } ${
                        currentMatch === btn.key
                          ? btn.key === val.type
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                            : 'bg-rose-500 text-white border-rose-400 font-extrabold shadow-md'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      {btn.icon}
                      <span>{lang === 'en' ? btn.labelEn : btn.labelRo}</span>
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
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Naming Rules & Booleans' : 'Verifică-ți Cunoștințele: Reguli de Denumire & Logica Booleană'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-teal-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which of the following represents a VALID variable name in computer algorithms?'
              : 'Care dintre următoarele reprezintă un nume VALID de variabilă conform regulilor din informatică?'}
          </div>

          {(cooldowns.q1 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza regulile: fără spații, fără cifră la început, fără semne matematice."
                customMessageEn="Incorrect answer! Please take 5 seconds to review variable naming rules."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'valid_naming', text: lang === 'en' ? 'A) suma_elevi (Letters, underscore, no spaces)' : 'A) suma_elevi (litere, caracter de subliniere, fără spațiu)' },
              { id: 'invalid_space', text: lang === 'en' ? 'B) suma elevi (Contains space - INVALID)' : 'B) suma elevi (conține spațiu - INVALID)' },
              { id: 'invalid_digit', text: lang === 'en' ? 'C) 1suma (Starts with digit - INVALID)' : 'C) 1suma (începe cu cifră - INVALID)' },
              { id: 'invalid_operator', text: lang === 'en' ? 'D) a+b (Contains operator + - INVALID)' : 'D) a+b (conține semnul plus - INVALID)' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer font-mono ${
                  (cooldowns.q1 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q1Answer === opt.id
                    ? opt.id === 'valid_naming'
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
            hintId="algo_type_q1"
            hintRo="Numele variabilelor nu pot conține spații și nu pot începe cu cifre."
            hintEn="Variable names cannot contain spaces and cannot start with digits."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={cooldowns.q1}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! suma_elevi is a pristine legal variable identifier.' : 'Exact! suma_elevi este un nume corect: începe cu literă, nu conține spații sau operatori matematici.')
                  : (lang === 'en' ? 'Incorrect. Identifiers cannot contain spaces or begin with digits.' : 'Incorect. Denumirile valide nu pot conține spații și nu pot începe cu cifre.')
              }
              ruleReference="Manual TIC pag. 65"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-teal-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'How many possible values can a Logical (Boolean) variable hold?'
              : 'Câte valori distincte posibile poate reține o variabilă de tip Logic (Boolean)?'}
          </div>

          {(cooldowns.q2 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza cele 2 valori logice: Adevărat (True) și Fals (False)."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on the two Boolean states."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'boolean_two_values', text: lang === 'en' ? 'A) Exactly 2 values: TRUE (Adevărat) and FALSE (Fals)' : 'A) Exact 2 valori: ADEVĂRAT (True / 1) și FALS (False / 0)' },
              { id: 'infinite_values', text: lang === 'en' ? 'B) Infinite numerical decimals' : 'B) O infinitate de numere' },
              { id: 'all_alphabet', text: lang === 'en' ? 'C) All 26 letters of the alphabet' : 'C) Toate literele alfabetului' },
              { id: 'only_zero', text: lang === 'en' ? 'D) Only the number zero' : 'D) Doar cifra 0' }
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
                    ? opt.id === 'boolean_two_values'
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
            hintId="algo_type_q2"
            hintRo="La fel ca un întrerupător de lumină: este aprins (Adevărat) sau stins (Fals)."
            hintEn="Just like a light switch: either ON (True) or OFF (False)."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={cooldowns.q2}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Perfect! Boolean logic is binary, holding strictly True or False.' : 'Perfect! Tipul logic (Boolean) are exact două valori: ADEVĂRAT și FALS.')
                  : (lang === 'en' ? 'Incorrect. Boolean values are strictly binary (True or False).' : 'Incorect. O dată logică poate fi exclusiv Adevărată sau Falsă.')
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
