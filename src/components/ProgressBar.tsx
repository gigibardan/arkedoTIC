import React from 'react';
import { GameLevel } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProgressBarProps {
  currentLevel: GameLevel;
  courseId?: 'hardware' | 'files';
}

const STAGE_PERCENTS = [20, 40, 60, 80, 95, 100];

const HARDWARE_STAGES = [
  { emoji: '🛡️', name: 'Inspector Protecție & Ergonomie (pag. 10-12)' },
  { emoji: '⏳', name: 'Crononaut: Istoria Calculatoarelor (pag. 13-14)' },
  { emoji: '🖥️', name: 'Tehnician Asamblor Unitate Centrală (pag. 15-17)' },
  { emoji: '🔌', name: 'Expert Periferice: Intrare / Ieșire (pag. 15-16)' },
  { emoji: '💾', name: 'Maestru Biți: Stocare & Autoevaluare (pag. 18-20)' },
  { emoji: '🏆', name: 'Tehnician Hardware Certificat!' },
];

const HARDWARE_MILESTONES = [
  'N1: Norme',
  'N2: Istorie',
  'N3: Unitate',
  'N4: Periferice',
  'N5: Biți',
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel, courseId = 'files' }) => {
  const { t } = useLanguage();

  const isHardware = courseId === 'hardware';
  const stages = isHardware ? HARDWARE_STAGES : t.stages;
  const milestones = isHardware ? HARDWARE_MILESTONES : t.milestones;

  const stageIndex = Math.min(Math.max(currentLevel - 1, 0), stages.length - 1);
  const currentStage = stages[stageIndex];
  const currentPercent = STAGE_PERCENTS[stageIndex] || 20;

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl animate-float p-1 bg-slate-900/60 rounded-xl border border-slate-700/60">
            {currentStage.emoji}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              {isHardware ? 'Evoluție Tehnician Hardware TIC' : t.treeProgressTitle}
            </div>
            <div className={`text-base sm:text-lg font-black font-heading ${isHardware ? 'text-cyan-400' : 'text-emerald-400'}`}>
              {currentStage.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">{t.levelLabel}</span>
            <span className="ml-1 text-sm font-extrabold text-white font-mono">
              {currentLevel <= 5 ? `${currentLevel} / 5` : t.victoryLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full bg-slate-900/90 rounded-full h-4 p-0.5 overflow-hidden border border-slate-700 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
            isHardware
              ? 'bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500'
              : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
          }`}
          style={{ width: `${currentPercent}%` }}
        />
      </div>

      {/* Level Milestones below */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-3 pt-2 text-center text-[10px] sm:text-xs font-semibold text-slate-400">
        <span className={currentLevel >= 1 ? (isHardware ? 'text-teal-400 font-bold' : 'text-emerald-400 font-bold') : ''}>
          {milestones[0]}
        </span>
        <span className={currentLevel >= 2 ? (isHardware ? 'text-teal-300 font-bold' : 'text-teal-400 font-bold') : ''}>
          {milestones[1]}
        </span>
        <span className={currentLevel >= 3 ? (isHardware ? 'text-cyan-400 font-bold' : 'text-cyan-400 font-bold') : ''}>
          {milestones[2]}
        </span>
        <span className={currentLevel >= 4 ? (isHardware ? 'text-purple-400 font-bold' : 'text-purple-400 font-bold') : ''}>
          {milestones[3]}
        </span>
        <span className={currentLevel >= 5 ? (isHardware ? 'text-rose-400 font-bold' : 'text-rose-400 font-bold') : ''}>
          {milestones[4]}
        </span>
      </div>
    </div>
  );
};
