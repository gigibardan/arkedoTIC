import React, { useState } from 'react';
import {
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  Binary,
  Hash,
  AlertOctagon
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface A1Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface DataTypeInfo {
  type: string;
  bytes: number;
  bits: number;
  rangeMin: string;
  rangeMax: string;
  syntaxExample: string;
  description: string;
  typicalUsage: string;
}

const DATA_TYPES: DataTypeInfo[] = [
  {
    type: 'int',
    bytes: 4,
    bits: 32,
    rangeMin: '-2.147.483.648',
    rangeMax: '+2.147.483.647 (~2 · 10⁹)',
    syntaxExample: 'int numarElevi = 28;',
    description: 'Manual pag. 60: Tipul întreg standard cu semn pe 32 de biți. Reprezintă numere întregi fără zecimale.',
    typicalUsage: 'Contoare de bucle, număr de elemente, vârste, note, indici de vector.'
  },
  {
    type: 'long long',
    bytes: 8,
    bits: 64,
    rangeMin: '-9.223.372.036.854.775.808',
    rangeMax: '+9.223.372.036.854.775.807 (~9 · 10¹⁸)',
    syntaxExample: 'long long distantaLumina = 9460730472580LL;',
    description: 'Manual pag. 60: Tipul întreg extins pe 64 de biți. Necesar atunci când calculele depășesc 2 miliarde.',
    typicalUsage: 'Sume de numere mari, produse, factoriale, probleme de olimpiadă cu numere gigantice.'
  },
  {
    type: 'double',
    bytes: 8,
    bits: 64,
    rangeMin: '~ ±1.7 · 10⁻³⁰⁸',
    rangeMax: '~ ±1.7 · 10³⁰⁸ (15-16 cifre zecimale)',
    syntaxExample: 'double medieGenerala = 9.85;',
    description: 'Manual pag. 60: Număr real în virgulă mobilă cu dublă precizie. Oferă o acuratețe superioară tipului float.',
    typicalUsage: 'Medii aritmetice, calcule științifice de fizică, radicali (sqrt), constante precum Pi (3.14159).'
  },
  {
    type: 'char',
    bytes: 1,
    bits: 8,
    rangeMin: '-128 sau 0',
    rangeMax: '127 sau 255 (Cod ASCII)',
    syntaxExample: "char initiala = 'A'; // Cod ASCII 65",
    description: 'Manual pag. 60: Memorează un singur caracter alfanumeric sau simbol, delimitat de apostrofuri simple.',
    typicalUsage: 'Inițiale de nume, litere, operatori aritmetici citiți ca simboluri, cifre izolate ca caractere.'
  },
  {
    type: 'bool',
    bytes: 1,
    bits: 8,
    rangeMin: 'false (0)',
    rangeMax: 'true (1)',
    syntaxExample: 'bool estePrim = true;',
    description: 'Manual pag. 60: Valoare de adevăr logică. Poate fi doar true (1) sau false (0).',
    typicalUsage: 'Fanioane logice (flags), verificarea condițiilor de oprire, primalitate sau sortare.'
  }
];

export const A1Level2_DataTypesAndMemory: React.FC<A1Level2Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [selectedType, setSelectedType] = useState<string>('int');
  const [overflowValue, setOverflowValue] = useState<number>(2147483647); // INT_MAX

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (qId: string, optId: string) => {
    if (submitted[qId] || isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = answers[qId] === correctId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmitted(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  const currentTypeInfo = DATA_TYPES.find(d => d.type === selectedType)!;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Database className="w-5 h-5 text-indigo-300" />
              <span>Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 2: Tipuri Fundamentale de Date & Reprezentarea în Memoria RAM
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 60: Explorează cum se alocă variabilele în memorie (octeți și biți),
              intervalele de valori pentru <code>int</code>, <code>long long</code>, <code>double</code>, <code>char</code> și pericolul depășirii de limită (overflow).
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">2 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Spațiul Ocupat în Memorie & Operatorul sizeof (Manual pag. 60)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              Octetul (Byte) & Bitul
            </div>
            <p className="text-slate-600 text-xs">
              1 Octet (Byte) = 8 Biți binari (0 sau 1). Operatorul <code>sizeof(tip)</code> returnează
              numărul exact de octeți rezervați în memoria RAM la declararea variabilei.
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-600" />
              int vs long long
            </div>
            <p className="text-slate-600 text-xs">
              Un <code>int</code> (4 octeți) poate stoca maximum ~2.14 miliarde. Dacă calculezi produsul a
              două numere mari (ex: <code>100.000 * 100.000 = 10 miliarde</code>), rezultatul depășește <code>int</code> și necesită obligatoriu <code>long long</code> (8 octeți).
            </p>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              Depășirea de Tip (Overflow)
            </div>
            <p className="text-slate-600 text-xs">
              Când o valoare depășește limita superioară a tipului, biții se resetează conform complementului față de 2,
              iar valoarea devine brusc negativă (ex: <code>2.147.483.647 + 1 = -2.147.483.648</code>)!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive RAM & Type Inspector Studio */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Inspectorul de Tipuri de Date & Memorie RAM
            </h3>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
            Laborator Memorie
          </span>
        </div>

        {/* Type Selector Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Alege tipul de date pentru disecție:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DATA_TYPES.map(t => (
              <button
                key={t.type}
                onClick={() => {
                  setSelectedType(t.type);
                  sounds.playClick();
                }}
                className={`p-3 rounded-xl border text-center transition ${
                  selectedType === t.type
                    ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 shadow ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-mono text-xs">{t.type}</div>
                <div className="text-[10px] text-slate-500">{t.bytes} {t.bytes === 1 ? 'octet' : 'octeți'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Type Detail Card & RAM Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-mono font-bold text-sm text-indigo-700">sizeof({currentTypeInfo.type})</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold font-mono">
                {currentTypeInfo.bytes} octeți = {currentTypeInfo.bits} biți
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <strong className="text-slate-800">Interval valori:</strong>
                <div className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 mt-0.5">
                  Min: {currentTypeInfo.rangeMin}<br />
                  Max: {currentTypeInfo.rangeMax}
                </div>
              </div>

              <div>
                <strong className="text-slate-800">Exemplu declarare C++:</strong>
                <div className="font-mono text-xs text-indigo-900 bg-indigo-50/50 p-2 rounded border border-indigo-200 mt-0.5">
                  <code>{currentTypeInfo.syntaxExample}</code>
                </div>
              </div>

              <div>
                <strong className="text-slate-800">Utilizare tipică:</strong>
                <p className="text-slate-600 mt-0.5">{currentTypeInfo.typicalUsage}</p>
              </div>
            </div>
          </div>

          {/* RAM Bytes Visualizer */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Reprezentare Fizică în RAM:
                </span>
                <span className="font-mono text-[10px] text-slate-400">Adresă hex: 0x7ffd98</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 py-3">
                {Array.from({ length: currentTypeInfo.bytes }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-indigo-950 border border-indigo-500/40 rounded-lg p-2 text-center"
                  >
                    <div className="text-[10px] font-mono text-indigo-300">Byte {idx + 1}</div>
                    <div className="text-xs font-mono font-bold text-white mt-1">8 bits</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overflow Mini Simulator */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Testare Depășire Limită (Integer Overflow):
                </span>
                <button
                  onClick={() => {
                    setOverflowValue(prev => prev === 2147483647 ? -2147483648 : 2147483647);
                    sounds.playClick();
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded text-[10px] font-bold"
                >
                  {overflowValue === 2147483647 ? '+1 (Declanșează Overflow)' : 'Resetează la INT_MAX'}
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-300">
                int a = {overflowValue === 2147483647 ? '2147483647 (INT_MAX)' : '2147483647 + 1;'}<br />
                Rezultat: <strong className={overflowValue < 0 ? 'text-rose-400' : 'text-emerald-400'}>{overflowValue}</strong>{' '}
                {overflowValue < 0 && '(A devenit brusc negativ!)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Tipuri de Date & Memorie (Manual pag. 60)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: La o problemă de algoritmi, trebuie să calculezi produsul a două numere naturale mari (de exemplu <code>100.000 * 100.000 = 10.000.000.000</code>). Ce tip de date trebuie să aibă variabila în care stochezi produsul?
            </span>
            <QuestionHint
              hint="Manual pag. 60: Valoarea maximă a unui int pe 32 de biți este aproximativ 2.14 miliarde (2 · 10⁹). Zece miliarde (10¹⁰) depășește această limită."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. int, deoarece este cel mai rapid și suportă până la 100 de miliarde' },
              { id: 'opt_b', label: 'B. long long, deoarece ocupă 8 octeți și poate stoca numere întregi de până la ~9 · 10¹⁸, prevenind depășirea de limită' },
              { id: 'opt_c', label: 'C. char, deoarece literele ocupă mai puțin spațiu' },
              { id: 'opt_d', label: 'D. bool, deoarece are doar două stări' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Zece miliarde depășește limita superioară a tipului int (~2.14 miliarde). Folosirea tipului long long (64 biți) este obligatorie pentru a preveni erorile de depășire (overflow)."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Ce va afișa pe ecran instrucțiunea <code>cout &lt;&lt; sizeof(char);</code> executată într-un program C++?
            </span>
            <QuestionHint
              hint="Manual pag. 60: Tipul char reprezintă un singur caracter alfanumeric și este unitatea de bază de adresare în memoria C++."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. 1 (deoarece un caracter ocupă exact 1 octet în memorie)' },
              { id: 'opt_b', label: 'B. 4 octeți' },
              { id: 'opt_c', label: 'C. 8 octeți' },
              { id: 'opt_d', label: 'D. Va afișa litera C' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_a')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! În C++, tipul char ocupă prin definiție exact 1 octet (8 biți), suficient pentru codificarea caracterelor conform tabelei ASCII standard (coduri 0-255)."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={2}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 3: Operatori Aritmetici & Magia Modulo (%)"
      />
    </div>
  );
};
