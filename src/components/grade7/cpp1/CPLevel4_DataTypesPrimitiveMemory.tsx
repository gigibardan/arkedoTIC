import React, { useState } from 'react';
import {
  Binary,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Database
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

type TypeCategory = 'int' | 'double' | 'char' | 'bool';

interface ValueCard {
  id: string;
  display: string;
  category: TypeCategory;
  explanation: string;
}

const TEST_VALUES: ValueCard[] = [
  { id: 'v1', display: '2026', category: 'int', explanation: 'Număr întreg fără zecimale -> int (ocupă 4 octeți).' },
  { id: 'v2', display: '3.1415', category: 'double', explanation: 'Număr real cu parte fracționară zecimală -> double (ocupă 8 octeți).' },
  { id: 'v3', display: "'A'", category: 'char', explanation: 'Un singur caracter scris între apostrofuri -> char (ocupă 1 octet).' },
  { id: 'v4', display: 'true', category: 'bool', explanation: 'Valoare de adevăr logică -> bool (ocupă 1 octet, echivalent cu 1).' },
  { id: 'v5', display: '-75', category: 'int', explanation: 'Număr întreg negativ -> int (reține numere întregi pozitive și negative).' },
  { id: 'v6', display: "'9'", category: 'char', explanation: 'Capcană! Cifra 9 scrisă între apostrofuri este privită ca simbol grafic char, nu ca număr de calcul!' },
  { id: 'v7', display: '-0.25', category: 'double', explanation: 'Număr real cu virgulă mobilă -> double.' },
  { id: 'v8', display: 'false', category: 'bool', explanation: 'Valoare de fals logic -> bool (echivalent binar cu 0).' }
];

const MEMORY_TYPES: { id: TypeCategory; name: string; ramSize: string; desc: string; color: string }[] = [
  { id: 'int', name: 'int', ramSize: '4 octeți (32 biți)', desc: 'Numere întregi (-2 miliarde ... +2 miliarde)', color: 'border-blue-500/50 bg-blue-950/20 text-blue-300' },
  { id: 'double', name: 'double', ramSize: '8 octeți (64 biți)', desc: 'Numere reale cu zecimale de mare precizie', color: 'border-amber-500/50 bg-amber-950/20 text-amber-300' },
  { id: 'char', name: 'char', ramSize: '1 octet (8 biți)', desc: 'Un caracter alfanumeric individual între apostrofuri \'x\'', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' },
  { id: 'bool', name: 'bool', ramSize: '1 octet (1 bit util)', desc: 'Valori logice de adevăr: true (1) sau false (0)', color: 'border-purple-500/50 bg-purple-950/20 text-purple-300' }
];

export const CPLevel4_DataTypesPrimitiveMemory: React.FC<Props> = ({ onPass }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sortedResults, setSortedResults] = useState<Record<string, { assigned: TypeCategory; isCorrect: boolean }>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentValue = TEST_VALUES[currentIndex];
  const isFinished = currentIndex >= TEST_VALUES.length;

  const handleAssignCategory = (chosen: TypeCategory) => {
    if (!currentValue) return;

    const isCorrect = chosen === currentValue.category;
    if (isCorrect) {
      sounds.playCorrect();
      setFeedback(`CORECT! ${currentValue.explanation}`);
    } else {
      sounds.playWrong();
      setFeedback(`GREȘIT! Valoarea ${currentValue.display} aparține tipului ${currentValue.category.toUpperCase()}. ${currentValue.explanation}`);
    }

    setSortedResults(prev => ({
      ...prev,
      [currentValue.id]: { assigned: chosen, isCorrect }
    }));

    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex(prev => prev + 1);
    }, 1400);
  };

  const correctCount = Object.values(sortedResults).filter((r: { assigned: TypeCategory; isCorrect: boolean }) => r.isCorrect).length;

  const handleFinish = () => {
    sounds.playVictory();
    onPass(100);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg text-2xl font-black">
            4
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Unitatea 4 • Limbajul C++ (Manual Art Klett pag. 70–73)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Tipuri Primitive de Date & Harta Memoriei RAM
            </h2>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          Progres: {Math.min(currentIndex, TEST_VALUES.length)} / {TEST_VALUES.length} valori clasificate
        </div>
      </div>

      {/* 4 Memory Architecture Slots Visualizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MEMORY_TYPES.map(m => (
          <div key={m.id} className={`p-4 rounded-2xl border-2 flex flex-col justify-between ${m.color}`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-base uppercase">{m.name}</span>
                <span className="text-[10px] font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  {m.ramSize}
                </span>
              </div>
              <p className="text-xs opacity-90 leading-snug">
                {m.desc}
              </p>
            </div>
            <div className="text-[10px] font-mono opacity-70 mt-3 pt-2 border-t border-slate-700/40">
              Alocare în RAM: {m.id === 'double' ? '64 biți' : m.id === 'int' ? '32 biți' : '8 biți'}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Sorting Box */}
      {!isFinished ? (
        <div className="bg-slate-950 border-2 border-violet-500/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>Valoarea Curente de Stocat în Memorie:</span>
          </div>

          {/* The Big Value Card */}
          <div className="w-full max-w-md py-6 px-8 rounded-2xl bg-gradient-to-br from-slate-900 to-violet-950/50 border-2 border-violet-400/60 shadow-2xl flex flex-col items-center justify-center animate-pulse">
            <span className="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-wider">
              {currentValue.display}
            </span>
            <span className="text-xs text-slate-400 mt-2 font-mono">
              În care slot de memorie o aloci?
            </span>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className="w-full max-w-md p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-center font-medium leading-relaxed animate-fadeIn">
              {feedback}
            </div>
          )}

          {/* Action Choice Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
            {MEMORY_TYPES.map(m => (
              <button
                key={m.id}
                onClick={() => handleAssignCategory(m.id)}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-violet-900/60 text-white font-mono font-bold text-sm border border-slate-700 hover:border-violet-400 transition-all active:scale-95 cursor-pointer shadow-md text-center"
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Summary after all 8 are sorted */
        <div className="p-6 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="font-bold text-base text-white font-heading">
                  Clasificare Finalizată cu Succes!
                </h4>
                <p className="text-xs text-slate-300">
                  Ai obținut <strong>{correctCount} / {TEST_VALUES.length}</strong> răspunsuri corecte la tipurile primitive.
                </p>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-800">
              Nota 10 • {Math.round((correctCount / TEST_VALUES.length) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {TEST_VALUES.map(v => {
              const res = sortedResults[v.id];
              return (
                <div key={v.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="font-mono font-bold text-amber-300">{v.display}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Tip: <strong className="text-violet-300 font-mono">{v.category}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleFinish}
            className="w-full sm:w-auto self-end px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer mt-2"
          >
            <span>Treci la Nivelul 5: Identificatori & Variabile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
