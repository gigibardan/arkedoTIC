import React from 'react';
import { GameLevel } from '../types';

interface ProgressBarProps {
  currentLevel: GameLevel;
}

const TREE_STAGES = [
  { level: 1, name: 'Sămânța Cunoașterii', emoji: '🌱', percent: 20 },
  { level: 2, name: 'Micul Lăstar (Selecție)', emoji: '🌿', percent: 40 },
  { level: 3, name: 'Copăcelul Curajos (Mutare)', emoji: '🪴', percent: 60 },
  { level: 4, name: 'Puietul Strălucitor (Copie & F2)', emoji: '🌲', percent: 80 },
  { level: 5, name: 'Gardianul Datelor (Restore)', emoji: '🌳', percent: 95 },
  { level: 6, name: 'Arborele Secret Înflorit!', emoji: '🌳✨', percent: 100 },
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel }) => {
  const currentStage = TREE_STAGES.find((s) => s.level === currentLevel) || TREE_STAGES[0];

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl animate-float p-1 bg-slate-900/60 rounded-xl border border-slate-700/60">
            {currentStage.emoji}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Evoluția Arborelui Secret
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-400 font-heading">
              {currentStage.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Nivel</span>
            <span className="ml-1 text-sm font-extrabold text-white font-mono">
              {currentLevel <= 5 ? `${currentLevel} / 5` : 'Victoria!'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full bg-slate-900/90 rounded-full h-4 p-0.5 overflow-hidden border border-slate-700 shadow-inner">
        <div
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${currentStage.percent}%` }}
        />
      </div>

      {/* Level Milestones below */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-3 pt-2 text-center text-[10px] sm:text-xs font-semibold text-slate-400">
        <span className={currentLevel >= 1 ? 'text-emerald-400 font-bold' : ''}>
          1. Structură 📁
        </span>
        <span className={currentLevel >= 2 ? 'text-teal-400 font-bold' : ''}>
          2. Selecție 🎯
        </span>
        <span className={currentLevel >= 3 ? 'text-cyan-400 font-bold' : ''}>
          3. Mutare ⚡️
        </span>
        <span className={currentLevel >= 4 ? 'text-purple-400 font-bold' : ''}>
          4. Copie & F2 🔍
        </span>
        <span className={currentLevel >= 5 ? 'text-rose-400 font-bold' : ''}>
          5. Restore 🗑️
        </span>
      </div>
    </div>
  );
};

