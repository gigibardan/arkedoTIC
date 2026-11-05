import React, { useState } from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  MoveRight,
  MoveLeft,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A4Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A4Level4_VectorManipulationLab: React.FC<A4Level4Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();

  const [arrayElements, setArrayElements] = useState<number[]>([10, 20, 30, 40, 50]);
  const [insertVal, setInsertVal] = useState<number>(99);
  const [insertPos, setInsertPos] = useState<number>(2);
  const [deletePos, setDeletePos] = useState<number>(1);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const [hasInserted, setHasInserted] = useState<boolean>(false);
  const [hasDeleted, setHasDeleted] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleInsert = () => {
    if (arrayElements.length >= 8) {
      sounds.playWrong();
      return;
    }
    sounds.playClick();
    const updated = [...arrayElements];
    updated.splice(insertPos, 0, insertVal);
    setArrayElements(updated);
    setLastAction(
      lang === 'ro'
        ? `Inserat ${insertVal} la indexul [${insertPos}]. Elementele de la [${insertPos}] au fost deplasate spre dreapta! (n crește de la ${arrayElements.length} la ${updated.length})`
        : `Inserted ${insertVal} at index [${insertPos}]. Elements from [${insertPos}] shifted to the right! (n increases from ${arrayElements.length} to ${updated.length})`
    );
    setHasInserted(true);
    sounds.playCorrect();
  };

  const handleDelete = () => {
    if (arrayElements.length <= 2) {
      sounds.playWrong();
      return;
    }
    sounds.playClick();
    const removedVal = arrayElements[deletePos];
    const updated = arrayElements.filter((_, idx) => idx !== deletePos);
    setArrayElements(updated);
    setLastAction(
      lang === 'ro'
        ? `Șters elementul ${removedVal} de la indexul [${deletePos}]. Elementele din dreapta s-au deplasat spre stânga! (n scade de la ${arrayElements.length} la ${updated.length})`
        : `Deleted element ${removedVal} from index [${deletePos}]. Elements to the right shifted to the left! (n decreases from ${arrayElements.length} to ${updated.length})`
    );
    setHasDeleted(true);
    sounds.playCorrect();
  };

  const handleReset = () => {
    setArrayElements([10, 20, 30, 40, 50]);
    setLastAction(lang === 'ro' ? 'Vector reinițializat la starea inițială.' : 'Array reset to initial state.');
    sounds.playClick();
  };

  const isLevelCompleted =
    hasInserted &&
    hasDeleted &&
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
      <div className="bg-gradient-to-r from-cyan-950 via-teal-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-cyan-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-400/30 text-cyan-300">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/30 text-cyan-200 border border-cyan-400/30">
                  {lang === 'ro' ? 'Modulul 3D • Nivelul 4 din 7' : 'Module 3D • Level 4 of 7'}
                </span>
                <span className="text-xs text-cyan-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 80–81' : 'Art Klett Textbook pp. 80–81'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Modificarea Tablourilor: Inserarea & Ștergerea de Elemente'
                  : 'Array Mutation: Insertion & Deletion of Elements'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-cyan-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 4: Inserare & Ștergere' : 'Level 4: Insertion & Deletion'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-cyan-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Spre deosebire de listele dinamice, într-un tablou static elementele sunt stocate în poziții adiacente. Pentru a insera un element, trebuie să <strong>deplasăm valorile spre dreapta</strong> (de la coadă la cap). Pentru a șterge, <strong>deplasăm valorile spre stânga</strong> pentru a umple golul creat!
            </>
          ) : (
            <>
              Unlike dynamic lists, in a static array elements are stored in adjacent memory positions. To insert an element, we must <strong>shift values to the right</strong> (from end to front). To delete, we <strong>shift values to the left</strong> to fill the created gap!
            </>
          )}
        </p>
      </div>

      {/* Simulator: Interactive Array Editor */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            {lang === 'ro'
              ? 'Simulator Vizual de Deplasare a Celulelor de Memorie'
              : 'Visual Memory Cell Shifting Simulator'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Dimensiune curentă: n = ' : 'Current size: n = '}
              {arrayElements.length}
            </span>
            <button
              onClick={handleReset}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === 'ro' ? 'Reset' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Array Visualization */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {arrayElements.map((val, idx) => (
              <div
                key={idx}
                className="w-16 h-18 rounded-xl bg-slate-950 border border-slate-700 flex flex-col items-center justify-center transition-all shadow-md shrink-0"
              >
                <span className="text-[10px] text-slate-500 font-mono">v[{idx}]</span>
                <span className="text-base font-bold text-cyan-300 font-mono">{val}</span>
              </div>
            ))}
            {Array.from({ length: 8 - arrayElements.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="w-16 h-18 rounded-xl bg-slate-950/30 border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 text-xs shrink-0"
              >
                <span className="text-[10px]">{lang === 'ro' ? 'Liber' : 'Empty'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Insert control */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              {lang === 'ro'
                ? 'Operația 1: Inserare Element (Deplasare spre Dreapta →)'
                : 'Operation 1: Element Insertion (Shift Right →)'}
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">{lang === 'ro' ? 'Valoare:' : 'Value:'}</span>
              <input
                type="number"
                value={insertVal}
                onChange={(e) => setInsertVal(Number(e.target.value))}
                className="w-16 bg-slate-900 border border-slate-700 rounded p-1 font-mono text-cyan-300 text-center"
              />
              <span className="text-slate-400">{lang === 'ro' ? 'La indexul:' : 'At index:'}</span>
              <select
                value={insertPos}
                onChange={(e) => setInsertPos(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded p-1 font-mono text-cyan-300 text-xs"
              >
                {arrayElements.map((_, idx) => (
                  <option key={idx} value={idx}>
                    v[{idx}]
                  </option>
                ))}
                <option value={arrayElements.length}>
                  v[{arrayElements.length}] ({lang === 'ro' ? 'Final' : 'End'})
                </option>
              </select>
              <button
                onClick={handleInsert}
                disabled={arrayElements.length >= 8}
                className="ml-auto px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded text-xs font-semibold"
              >
                {lang === 'ro' ? 'Inserează' : 'Insert'}
              </button>
            </div>
          </div>

          {/* Delete control */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" />
              {lang === 'ro'
                ? 'Operația 2: Ștergere Element (Deplasare spre Stânga ←)'
                : 'Operation 2: Element Deletion (Shift Left ←)'}
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">{lang === 'ro' ? 'Șterge de la indexul:' : 'Delete from index:'}</span>
              <select
                value={deletePos}
                onChange={(e) => setDeletePos(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded p-1 font-mono text-cyan-300 text-xs"
              >
                {arrayElements.map((val, idx) => (
                  <option key={idx} value={idx}>
                    v[{idx}] (val: {val})
                  </option>
                ))}
              </select>
              <button
                onClick={handleDelete}
                disabled={arrayElements.length <= 2}
                className="ml-auto px-3 py-1 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white rounded text-xs font-semibold"
              >
                {lang === 'ro' ? 'Șterge' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Action log message */}
        {lastAction && (
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            {lastAction}
          </div>
        )}
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 80–81)' : 'Official C++ Checkpoint (Textbook pp. 80–81)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro'
                ? 'De ce la inserarea unui element pe poziția k deplasarea elementelor trebuie efectuată obligatoriu de la dreapta spre stânga (for (int i = n; i > k; i--) v[i] = v[i-1];)?'
                : 'Why must element shifting during insertion at index k be done strictly from right to left (for (int i = n; i > k; i--) v[i] = v[i-1];)?'}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Pentru că dacă am parcurge de la stânga la dreapta, prima valoare copiată ar suprascrie elementul vecin și s-ar multiplica pe tot restul vectorului',
                  labelEn: 'Because traversing left-to-right would cause the first copied value to overwrite its neighbor and duplicate across the rest of the array'
                },
                {
                  id: 'b',
                  labelRo: 'Pentru că de la stânga la dreapta este interzis de compilator',
                  labelEn: 'Because left-to-right traversal is forbidden by compiler'
                },
                {
                  id: 'c',
                  labelRo: 'Nu contează sensul de parcurgere',
                  labelEn: 'The direction of traversal does not matter'
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
              {lang === 'ro'
                ? 'Ce se întâmplă cu numărul de elemente n al vectorului după ce ștergem un element de pe o poziție dată?'
                : 'What happens to the array element count n after deleting an element from a given position?'}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'n rămâne neschimbat',
                  labelEn: 'n remains unchanged'
                },
                {
                  id: 'b',
                  labelRo: 'n trebuie decrementat obligatoriu (n--) deoarece vectorul conține acum cu un element mai puțin',
                  labelEn: 'n must be decremented (n--) because the array now contains one less element'
                },
                {
                  id: 'c',
                  labelRo: 'n devine 0',
                  labelEn: 'n becomes 0'
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
              ? lang === 'ro'
                ? 'Excelent! Ai testat cu succes inserarea și ștergerea elementelor dintr-un tablou.'
                : 'Excellent! You successfully tested element insertion and deletion in an array.'
              : lang === 'ro'
              ? 'Efectuează cel puțin o inserare și o ștergere în simulator și rezolvă întrebările.'
              : 'Perform at least one insertion and one deletion in the simulator and solve the questions.'}
          </span>
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>{lang === 'ro' ? 'Următorul Nivel: Sortarea prin Metoda Bulelor' : 'Next Level: Bubble Sort Method'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
