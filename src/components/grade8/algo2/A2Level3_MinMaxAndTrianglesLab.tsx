import React, { useState } from 'react';
import {
  Triangle,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Scale,
  HelpCircle,
  Compass,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A2Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A2Level3_MinMaxAndTrianglesLab: React.FC<A2Level3Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

  // Min/Max State
  const [numA, setNumA] = useState<number>(27);
  const [numB, setNumB] = useState<number>(45);
  const [numC, setNumC] = useState<number>(18);
  const [minMaxStep, setMinMaxStep] = useState<number>(0);

  // Triangle State
  const [sideA, setSideA] = useState<number>(3);
  const [sideB, setSideB] = useState<number>(4);
  const [sideC, setSideC] = useState<number>(5);
  const [testedTriangleTypes, setTestedTriangleTypes] = useState<Set<string>>(new Set());

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Calculate Triangle properties
  const isValidTriangle =
    sideA > 0 &&
    sideB > 0 &&
    sideC > 0 &&
    sideA + sideB > sideC &&
    sideA + sideC > sideB &&
    sideB + sideC > sideA;

  let triangleClassification = lang === 'ro' ? 'Nu formează triunghi!' : 'Does not form a valid triangle!';
  let isRightAngled = false;

  if (isValidTriangle) {
    const a2 = sideA * sideA;
    const b2 = sideB * sideB;
    const c2 = sideC * sideC;
    isRightAngled = a2 + b2 === c2 || a2 + c2 === b2 || b2 + c2 === a2;

    if (sideA === sideB && sideB === sideC) {
      triangleClassification = lang === 'ro'
        ? 'Echilateral (toate cele 3 laturi sunt egale)'
        : 'Equilateral (all 3 sides equal)';
    } else if (sideA === sideB || sideA === sideC || sideB === sideC) {
      if (isRightAngled) {
        triangleClassification = lang === 'ro'
          ? 'Dreptunghic Isoscel (două catete egale + unghi 90°)'
          : 'Right-Angled Isosceles (two equal legs + 90° angle)';
      } else {
        triangleClassification = lang === 'ro'
          ? 'Isoscel (două laturi egale)'
          : 'Isosceles (two equal sides)';
      }
    } else if (isRightAngled) {
      triangleClassification = lang === 'ro'
        ? 'Dreptunghic (respectă Teorema lui Pitagora)'
        : 'Right-Angled (satisfies Pythagorean theorem)';
    } else {
      triangleClassification = lang === 'ro'
        ? 'Oarecare / Scalen (trei laturi de lungimi distincte)'
        : 'Scalene (three distinct side lengths)';
    }
  }

  const checkTriangle = () => {
    sounds.playClick();
    const newSet = new Set(testedTriangleTypes);
    if (isValidTriangle) {
      if (sideA === sideB && sideB === sideC) newSet.add('echilateral');
      else if (isRightAngled) newSet.add('dreptunghic');
      else if (sideA === sideB || sideA === sideC || sideB === sideC) newSet.add('isoscel');
      else newSet.add('oarecare');
      sounds.playCorrect();
    } else {
      newSet.add('invalid');
      sounds.playWrong();
    }
    setTestedTriangleTypes(newSet);
  };

  const isLevelCompleted =
    testedTriangleTypes.size >= 2 &&
    minMaxStep >= 3 &&
    q1Answer === 'a' &&
    q2Answer === 'b';

  const handleFinish = () => {
    if (isLevelCompleted) {
      sounds.playCorrect();
      if (onCompletePage) onCompletePage(100);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-emerald-900 to-cyan-950 rounded-2xl p-6 text-white shadow-xl border border-teal-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-400/30 text-teal-300">
              <Triangle className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  {lang === 'ro' ? 'Modulul 3B • Nivelul 3 din 7' : 'Module 3B • Level 3 of 7'}
                </span>
                <span className="text-xs text-teal-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 67–68' : 'Art Klett Textbook pp. 67–68'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Algoritmi Fundamentali: Minim, Maxim & Inegalitatea Triunghiului'
                  : 'Fundamental Algorithms: Min, Max & Triangle Inequality'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-teal-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 3: Algoritmi Decizionali' : 'Level 3: Decision Algorithms'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-teal-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'Determinarea maximului dintre mai multe valori și verificarea proprietăților geometrice (cum ar fi existența și tipul unui triunghi) sunt algoritmi decizionali clasici din programa de clasa a VIII-a.'
            : 'Finding the maximum among multiple numbers and testing geometric properties (such as triangle existence and classification) are foundational decision algorithms in the Grade 8 curriculum.'}
        </p>
      </div>

      {/* Grid: Part 1 - Min/Max Step-by-Step Tracer */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            {lang === 'ro'
              ? 'Partea 1: Algoritmul Canonic de Maxim între 3 Numere'
              : 'Part 1: Canonical Maximum of 3 Numbers Algorithm'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">max = a; if(b &gt; max) max = b; if(c &gt; max) max = c;</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-400">{lang === 'ro' ? 'Număr a:' : 'Number a:'}</label>
            <input
              type="number"
              value={numA}
              onChange={(e) => {
                setNumA(Number(e.target.value));
                setMinMaxStep(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">{lang === 'ro' ? 'Număr b:' : 'Number b:'}</label>
            <input
              type="number"
              value={numB}
              onChange={(e) => {
                setNumB(Number(e.target.value));
                setMinMaxStep(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">{lang === 'ro' ? 'Număr c:' : 'Number c:'}</label>
            <input
              type="number"
              value={numC}
              onChange={(e) => {
                setNumC(Number(e.target.value));
                setMinMaxStep(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm"
            />
          </div>
        </div>

        {/* Step by step interactive bar */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-sans font-semibold">
              {lang === 'ro' ? 'Traseu de execuție Pas-cu-Pas:' : 'Step-by-Step Execution Trace:'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMinMaxStep((prev) => Math.min(prev + 1, 3));
                  sounds.playClick();
                }}
                disabled={minMaxStep >= 3}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded text-xs font-sans font-medium flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                {lang === 'ro' ? `Pasul Următor (${minMaxStep}/3)` : `Next Step (${minMaxStep}/3)`}
              </button>
              <button
                onClick={() => {
                  setMinMaxStep(0);
                  sounds.playClick();
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-sans flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div
              className={`p-2 rounded ${
                minMaxStep >= 1 ? 'bg-cyan-950/70 border-l-4 border-cyan-400 text-cyan-200' : 'text-slate-600'
              }`}
            >
              <strong>{lang === 'ro' ? 'Pasul 1:' : 'Step 1:'}</strong> <span className="text-pink-400">int</span> max = a; &rarr; max {lang === 'ro' ? 'devine' : 'becomes'}{' '}
              <span className="text-amber-300 font-bold">{numA}</span>
            </div>
            <div
              className={`p-2 rounded ${
                minMaxStep >= 2 ? 'bg-cyan-950/70 border-l-4 border-cyan-400 text-cyan-200' : 'text-slate-600'
              }`}
            >
              <strong>{lang === 'ro' ? 'Pasul 2:' : 'Step 2:'}</strong> <span className="text-pink-400">if</span> (b &gt; max) max = b; &rarr; {lang === 'ro' ? `Este ${numB} > ${numA} ? ` : `Is ${numB} > ${numA} ? `}
              <span className={numB > numA ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
                {numB > numA
                  ? (lang === 'ro' ? `DA \u2192 max se actualizează la ${numB}` : `YES \u2192 max updates to ${numB}`)
                  : (lang === 'ro' ? `NU \u2192 max rămâne ${numA}` : `NO \u2192 max remains ${numA}`)}
              </span>
            </div>
            <div
              className={`p-2 rounded ${
                minMaxStep >= 3 ? 'bg-cyan-950/70 border-l-4 border-cyan-400 text-cyan-200' : 'text-slate-600'
              }`}
            >
              <strong>{lang === 'ro' ? 'Pasul 3:' : 'Step 3:'}</strong> <span className="text-pink-400">if</span> (c &gt; max) max = c; &rarr; {lang === 'ro' ? `Este ${numC} > ${Math.max(numA, numB)} ? ` : `Is ${numC} > ${Math.max(numA, numB)} ? `}
              <span className={numC > Math.max(numA, numB) ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
                {numC > Math.max(numA, numB)
                  ? (lang === 'ro' ? `DA \u2192 max final devine ${numC}` : `YES \u2192 final max becomes ${numC}`)
                  : (lang === 'ro' ? `NU \u2192 max final este ${Math.max(numA, numB)}` : `NO \u2192 final max is ${Math.max(numA, numB)}`)}
              </span>
            </div>
          </div>

          {minMaxStep === 3 && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 font-sans font-medium text-xs flex items-center justify-between">
              <span>{lang === 'ro' ? 'Rezultat Final Algoritm:' : 'Final Algorithm Result:'}</span>
              <span className="font-mono font-bold text-sm text-emerald-400">
                max({numA}, {numB}, {numC}) = {Math.max(numA, numB, numC)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Part 2: Triangle Validator & Classifier Studio */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            {lang === 'ro'
              ? 'Partea 2: Laborator Interactiv de Validare & Clasificare a Triunghiului (Manual pag. 68)'
              : 'Part 2: Interactive Triangle Validation & Classification Lab (Textbook p. 68)'}
          </h3>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
            {lang === 'ro' ? 'Inegalitatea Triunghiului & Pitagora' : 'Triangle Inequality & Pythagoras'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-slate-300 flex justify-between">
                <span>{lang === 'ro' ? 'Latura a:' : 'Side a:'}</span>
                <span className="font-mono text-cyan-300 font-bold">{sideA}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={sideA}
                onChange={(e) => setSideA(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-300 flex justify-between">
                <span>{lang === 'ro' ? 'Latura b:' : 'Side b:'}</span>
                <span className="font-mono text-cyan-300 font-bold">{sideB}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={sideB}
                onChange={(e) => setSideB(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-300 flex justify-between">
                <span>{lang === 'ro' ? 'Latura c:' : 'Side c:'}</span>
                <span className="font-mono text-cyan-300 font-bold">{sideC}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={sideC}
                onChange={(e) => setSideC(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Presets */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                {lang === 'ro' ? 'Exemple Predefinite:' : 'Preset Configurations:'}
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                <button
                  onClick={() => {
                    setSideA(5);
                    setSideB(5);
                    setSideC(5);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
                >
                  {lang === 'ro' ? 'Echilateral (5,5,5)' : 'Equilateral (5,5,5)'}
                </button>
                <button
                  onClick={() => {
                    setSideA(3);
                    setSideB(4);
                    setSideC(5);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
                >
                  {lang === 'ro' ? 'Pitagoric (3,4,5)' : 'Pythagorean (3,4,5)'}
                </button>
                <button
                  onClick={() => {
                    setSideA(6);
                    setSideB(6);
                    setSideC(8);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
                >
                  {lang === 'ro' ? 'Isoscel (6,6,8)' : 'Isosceles (6,6,8)'}
                </button>
                <button
                  onClick={() => {
                    setSideA(2);
                    setSideB(3);
                    setSideC(10);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
                >
                  {lang === 'ro' ? 'Degenerat (2,3,10)' : 'Invalid (2,3,10)'}
                </button>
              </div>
            </div>

            <button
              onClick={checkTriangle}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'ro' ? 'Testează Condițiile de Triunghi' : 'Test Triangle Invariant Conditions'}
            </button>
          </div>

          {/* Right: Logic inspection */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-slate-400 font-sans font-semibold">
              {lang === 'ro' ? 'Evaluare Expresii Logice C++:' : 'C++ Boolean Logic Evaluation:'}
            </div>

            {/* Inequity test */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400">
                {lang === 'ro' ? '// 1. Condiția de existență a triunghiului:' : '// 1. Triangle existence condition:'}
              </div>
              <div className="text-slate-200">
                <span className="text-pink-400">if</span> (a+b &gt; c &amp;&amp; a+c &gt; b &amp;&amp; b+c &gt; a)
              </div>
              <div className="text-[11px] text-slate-400 pl-2">
                &bull; {`${sideA} + ${sideB} > ${sideC} (${sideA + sideB > sideC ? 'TRUE' : 'FALSE'})`}<br />
                &bull; {`${sideA} + ${sideC} > ${sideB} (${sideA + sideC > sideB ? 'TRUE' : 'FALSE'})`}<br />
                &bull; {`${sideB} + ${sideC} > ${sideA} (${sideB + sideC > sideA ? 'TRUE' : 'FALSE'})`}
              </div>
              <div className="mt-2 text-xs font-bold font-sans">
                {isValidTriangle ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />{' '}
                    {lang === 'ro'
                      ? 'Triunghi VALID! Laturile respectă inegalitatea.'
                      : 'VALID Triangle! All sides strictly fulfill inequality.'}
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />{' '}
                    {lang === 'ro'
                      ? 'Triunghi INVALID! Cel puțin o latură e >= suma celorlalte.'
                      : 'INVALID Triangle! At least one side is >= sum of the other two.'}
                  </span>
                )}
              </div>
            </div>

            {/* Classification */}
            {isValidTriangle && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400">
                  {lang === 'ro' ? '// 2. Clasificare geometrică:' : '// 2. Geometric classification:'}
                </div>
                <div className="text-cyan-300 font-sans font-bold text-sm">{triangleClassification}</div>
                {isRightAngled && (
                  <div className="text-amber-300 text-[11px]">
                    {lang === 'ro' ? 'Verificare Pitagora:' : 'Pythagorean Check:'}{' '}
                    {sideA}&sup2; + {sideB}&sup2; = {sideA * sideA + sideB * sideB} &harr; {sideC}&sup2; = {sideC * sideC}{' '}
                    {lang === 'ro' ? '(sau permutări)' : '(or permutations)'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Test de Înțelegere Algoritmică (Manual pag. 67–68)' : 'Algorithmic Comprehension Check (Textbook pp. 67–68)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>De ce este necesar ca toate cele trei condiții (<code className="text-pink-400 font-mono">a+b&gt;c && a+c&gt;b && b+c&gt;a</code>) să fie legate cu operatorul <code className="text-amber-300 font-mono">&amp;&amp;</code> (ȘI logic)?</>
              ) : (
                <>Why is it required that all three conditions (<code className="text-pink-400 font-mono">a+b&gt;c && a+c&gt;b && b+c&gt;a</code>) be joined with logical AND (<code className="text-amber-300 font-mono">&amp;&amp;</code>)?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Pentru că oricare latură trebuie să fie strict mai mică decât suma celorlalte două simultan',
                  labelEn: 'Because every side must be strictly less than the sum of the other two simultaneously'
                },
                {
                  id: 'b',
                  labelRo: 'Pentru că operatorul && este mai rapid la tastat decât ||',
                  labelEn: 'Because operator && is faster to type than ||'
                },
                {
                  id: 'c',
                  labelRo: 'Este suficient doar a + b > c pentru orice fel de laturi',
                  labelEn: 'Checking only a + b > c is sufficient for any side lengths'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'a') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'a'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q1Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 2:' : 'Question 2:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Cum verificăm în C++ dacă un triunghi cu laturile <code className="text-cyan-300 font-mono">a, b, c</code> este echilateral?</>
              ) : (
                <>How do we verify in C++ if a triangle with sides <code className="text-cyan-300 font-mono">a, b, c</code> is equilateral?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'if (a == b == c)',
                  labelEn: 'if (a == b == c)'
                },
                {
                  id: 'b',
                  labelRo: 'if (a == b && b == c)',
                  labelEn: 'if (a == b && b == c)'
                },
                {
                  id: 'c',
                  labelRo: 'if (a == b || b == c)',
                  labelEn: 'if (a == b || b == c)'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'b') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q2Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion & Navigation Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isLevelCompleted ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' : 'bg-slate-600'
            }`}
          />
          <span className="text-xs text-slate-300">
            {isLevelCompleted
              ? (lang === 'ro'
                ? 'Excelent! Ai stăpânit algoritmul de maxim și clasificarea triunghiurilor.'
                : 'Excellent! You mastered the maximum algorithm and geometric triangle classification.')
              : (lang === 'ro'
                ? 'Rulează pașii algoritmului de maxim, testează cel puțin două tipuri de triunghiuri și răspunde la întrebări.'
                : 'Step through max algorithm, test at least two triangle configurations, and answer both questions.')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="py-2 px-4 rounded-lg font-medium text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
            >
              {lang === 'ro' ? 'Înapoi' : 'Back'}
            </button>
          )}
          <button
            onClick={handleFinish}
            disabled={!isLevelCompleted}
            className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
              isLevelCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>{lang === 'ro' ? 'Următorul Nivel: Prelucrarea Cifrelor' : 'Next Level: Digit Decomposition'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
