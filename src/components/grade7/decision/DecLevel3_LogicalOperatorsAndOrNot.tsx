import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lightbulb,
  Check,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Cpu
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface LogicChallenge {
  id: string;
  title: string;
  problemScenario: string;
  conditionFormula: string;
  testValues: { varName: string; val: string | number }[];
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  truthTableSummary: string;
}

const LOGIC_CHALLENGES: LogicChallenge[] = [
  {
    id: 'l1',
    title: 'Operatorul ȘI Logic (&&) — Promovare Examen',
    problemScenario: 'Pentru a promova, un elev trebuie să aibă nota la test de cel puțin 5 ȘI numărul de absențe strict sub 10.',
    conditionFormula: 'if (nota >= 5 && absente < 10)',
    testValues: [
      { varName: 'nota', val: 7 },
      { varName: 'absente', val: 4 }
    ],
    options: [
      {
        label: 'Adevărat (true) — Ambele condiții (7 >= 5 și 4 < 10) sunt simultan adevărate!',
        isCorrect: true,
        explanation: 'Operatorul && (ȘI logic) returnează true numai atunci când AMBELE condiții sunt adevărate (true && true = true).'
      },
      {
        label: 'Fals (false) — Operatorul && are nevoie de 3 condiții adevărate.',
        isCorrect: false,
        explanation: 'Nu, && compară două propoziții logice și returnează true dacă ambele sunt adevărate.'
      },
      {
        label: 'Eroare de compilare — && nu funcționează cu două variabile diferite.',
        isCorrect: false,
        explanation: 'Operatorul && poate combina oricâte variabile și expresii diferite.'
      }
    ],
    truthTableSummary: 'A && B este adevărat NUMAI când ambele sunt ADEVĂRATE (1 && 1 = 1).'
  },
  {
    id: 'l2',
    title: 'Operatorul SAU Logic (||) — Zi de Odihnă sau Vacanță',
    problemScenario: 'Nu mergem la școală dacă este Sâmbătă (ziua 6) SAU Duminică (ziua 7).',
    conditionFormula: 'if (zi == 6 || zi == 7)',
    testValues: [
      { varName: 'zi', val: 6 }
    ],
    options: [
      {
        label: 'Adevărat (true) — Este suficient ca cel puțin UNA dintre condiții să fie adevărată (6 == 6)!',
        isCorrect: true,
        explanation: 'Operatorul || (SAU logic) returnează true dacă oricare dintre cele două ramuri este adevărată (true || false = true).'
      },
      {
        label: 'Fals (false) — Trebuia ca ambele zile să fie simultan adevărate.',
        isCorrect: false,
        explanation: 'O zi nu poate fi simultan și sâmbătă și duminică! Tocmai de aceea folosim SAU (||), nu ȘI (&&).'
      },
      {
        label: 'Fals (false) — Operatorul || inversează rezultatul.',
        isCorrect: false,
        explanation: 'Operatorul || nu inversează, ci adună logic (disjuncție).'
      }
    ],
    truthTableSummary: 'A || B este adevărat dacă CEL PUȚIN UNA dintre condiții este ADEVĂRATĂ.'
  },
  {
    id: 'l3',
    title: 'Operatorul de Negație (!) — Inversarea Adevărului',
    problemScenario: 'Avem condiția inițială n % 2 == 0 (număr par). Ce înseamnă if (!(n % 2 == 0)) ?',
    conditionFormula: 'if (!(n % 2 == 0))',
    testValues: [
      { varName: 'n', val: 9 }
    ],
    options: [
      {
        label: 'Evaluează dacă n este IMPAR: 9 % 2 == 0 este fals, iar !false devine true!',
        isCorrect: true,
        explanation: 'Operatorul ! (negație / NOT) transformă 0 (fals) în 1 (adevărat) și 1 (adevărat) în 0 (fals).'
      },
      {
        label: 'Evaluează dacă n este strict pozitiv.',
        isCorrect: false,
        explanation: 'Negația unei egalități de paritate nu testează semnul numărului, ci imparitatea.'
      },
      {
        label: 'Dă eroare de sintaxă deoarece semnul exclamării se pune după paranteze.',
        isCorrect: false,
        explanation: 'Semnul ! este un operator unar prefixat și se pune întotdeauna ÎNAINTEA expresiei negate.'
      }
    ],
    truthTableSummary: '!A inversează complet valoarea: !true devine false, iar !false devine true.'
  },
  {
    id: 'l4',
    title: 'Condiție Compusă de Interval: Validare Notă 1..10',
    problemScenario: 'Vrem să ne asigurăm că nota introdusă de la tastatură este o notă validă în catalogul românesc (între 1 și 10 inclusiv).',
    conditionFormula: 'if (nota >= 1 && nota <= 10)',
    testValues: [
      { varName: 'nota', val: 12 }
    ],
    options: [
      {
        label: 'Fals (false) — 12 >= 1 este true, dar 12 <= 10 este FALSE! Deoarece e &&, întregul rezultat este fals!',
        isCorrect: true,
        explanation: 'Exact! 12 nu aparține intervalului închis [1, 10]. Ramura if este sărită și se afișează "Notă invalidă!".'
      },
      {
        label: 'Adevărat (true) — Deoarece 12 este mai mare decât 1.',
        isCorrect: false,
        explanation: 'La operatorul && ambele condiții sunt obligatorii! A doua condiție (12 <= 10) e falsă, deci totul devine fals.'
      },
      {
        label: 'Eroare de memorie la procesor.',
        isCorrect: false,
        explanation: 'Condiția este evaluată normal și returnează pur și simplu false.'
      }
    ],
    truthTableSummary: 'Pentru intervale închise [A, B] folosim mereu conjuncția: x >= A && x <= B.'
  }
];

export const DecLevel3_LogicalOperatorsAndOrNot: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Interactive Circuit Simulator
  const [switchA, setSwitchA] = useState<boolean>(true);
  const [switchB, setSwitchB] = useState<boolean>(false);
  const [activeGate, setActiveGate] = useState<'&&' | '||' | '!'>('&&');

  const computeGateResult = (): boolean => {
    if (activeGate === '&&') return switchA && switchB;
    if (activeGate === '||') return switchA || switchB;
    if (activeGate === '!') return !switchA;
    return false;
  };

  const gateResult = computeGateResult();

  const currentChallenge = LOGIC_CHALLENGES[currentIdx];
  const isFinished = currentIdx >= LOGIC_CHALLENGES.length;

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const opt = currentChallenge.options[idx];
    if (opt.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 25);
      setFeedback({
        isCorrect: true,
        text: `Excelent! ${opt.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Mai gândește-te puțin! ${opt.explanation}`
      });
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setSelectedOptIdx(null);
    setFeedback(null);
    setCurrentIdx(i => i + 1);
  };

  const handleFinishLevel = () => {
    sounds.playLevelUp();
    onPass(Math.min(score, 100));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-yellow-950/60 p-5 sm:p-6 rounded-3xl border-2 border-yellow-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 3 din 7 • Modulul 4C
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 78–79</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span>Operatori Logici Compuși: &amp;&amp; (ȘI), || (SAU), ! (NEGAȚIE)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Învață să conectezi deciziile complexe precum circuitele logice! Descoperă tabelele de adevăr și cum se combină condițiile multiple în C++.
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 3:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-yellow-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Boolean Circuit Laboratory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              💡
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Circuit Logic Interactiv: Aprinde Becul Deciziei!
              </h3>
              <p className="text-xs text-slate-400">
                Schimbă starea întrerupătoarelor A și B, selectează poarta logică și privește rezultatul instantaneu!
              </p>
            </div>
          </div>

          {/* Gate Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveGate('&&');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                activeGate === '&&'
                  ? 'bg-yellow-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              &amp;&amp; (ȘI)
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveGate('||');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                activeGate === '||'
                  ? 'bg-yellow-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              || (SAU)
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveGate('!');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                activeGate === '!'
                  ? 'bg-yellow-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ! (NEGAȚIE)
            </button>
          </div>
        </div>

        {/* Circuit Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Inputs A and B */}
          <div className="md:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">Intrare A:</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSwitchA(!switchA);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  switchA
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {switchA ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                <span>{switchA ? 'TRUE (1)' : 'FALSE (0)'}</span>
              </button>
            </div>

            {activeGate !== '!' && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs font-mono font-bold text-slate-300">Intrare B:</span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSwitchB(!switchB);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    switchB
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {switchB ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{switchB ? 'TRUE (1)' : 'FALSE (0)'}</span>
                </button>
              </div>
            )}

            <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              Expresie evaluată:<br />
              <span className="text-white font-bold">
                {activeGate === '!'
                  ? `!(${switchA ? 'true' : 'false'})`
                  : `(${switchA ? 'true' : 'false'} ${activeGate} ${switchB ? 'true' : 'false'})`}
              </span>
            </div>
          </div>

          {/* Logic Gate & Bulb Output */}
          <div className="md:col-span-8 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Operator Box */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">Poartă C++</div>
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-yellow-500/60 flex items-center justify-center text-xl font-mono font-black text-yellow-300 shadow-lg shadow-yellow-500/10">
                {activeGate}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                {activeGate === '&&' ? 'ȘI Logic' : activeGate === '||' ? 'SAU Logic' : 'Negație Logică'}
              </div>
            </div>

            {/* Wire Connector */}
            <div className="hidden sm:flex items-center text-slate-600 font-mono text-sm">
              &mdash;&mdash;&gt;
            </div>

            {/* Output Bulb */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">Rezultat Curent</div>
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl transition-all duration-300 border-2 ${
                gateResult
                  ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300 shadow-2xl shadow-yellow-400/40 scale-110'
                  : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60'
              }`}>
                {gateResult ? '💡' : '🌑'}
              </div>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold border transition ${
                gateResult
                  ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {gateResult ? 'ADEVĂRAT (true / 1)' : 'FALS (false / 0)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-xs">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Provocarea {currentIdx + 1}/{LOGIC_CHALLENGES.length}: {currentChallenge.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Întrebarea {currentIdx + 1}/{LOGIC_CHALLENGES.length}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <div className="text-slate-400 text-xs mb-2 leading-relaxed">
              {currentChallenge.problemScenario}
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-yellow-300 font-bold mb-3">
              {currentChallenge.conditionFormula}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">Valori curente de test:</span>
              {currentChallenge.testValues.map((v, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-cyan-300 font-bold">
                  {v.varName} = {v.val}
                </span>
              ))}
            </div>
          </div>

          <div className="text-sm font-bold text-white">
            Care este valoarea de adevăr a expresiei și de ce?
          </div>

          <div className="flex flex-col gap-3">
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : selectedOptIdx !== null && opt.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-xs sm:text-sm leading-relaxed">
                    {opt.label}
                  </div>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {feedback.text}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <span>Următoarea Provocare</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-yellow-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            ⚡
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Stăpân al Circuitelor Logice!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Ai deprins funcționarea operatorilor <code className="text-yellow-400 font-bold">&amp;&amp;</code>, <code className="text-yellow-400 font-bold">||</code> și <code className="text-yellow-400 font-bold">!</code> și poți formula condiții complexe fără eroare!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-yellow-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 4: Problema Parității &amp; Divizibilității (n % 2 == 0)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
