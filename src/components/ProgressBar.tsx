import React from 'react';
import { GameLevel } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProgressBarProps {
  currentLevel: GameLevel;
  courseId?: 'hardware' | 'files' | 'internet1';
}

const HARDWARE_STAGE_PERCENTS = [20, 40, 60, 80, 95, 100];
const FILES_STAGE_PERCENTS = [14, 28, 42, 57, 71, 85, 95, 100];
const INTERNET1_STAGE_PERCENTS = [16, 33, 50, 66, 83, 95, 100];

const INTERNET1_STAGES_RO = [
  { emoji: '🌐', name: 'Explorator Rețele & Protocol TCP/IP (pag. 32-33)' },
  { emoji: '📡', name: 'Operator Servicii Internet: Email, WWW, FTP (pag. 32)' },
  { emoji: '🧩', name: 'Dezlegător Rebus Digital & Coloana Secretă (pag. 33)' },
  { emoji: '🧭', name: 'Navigator Web & Anatomie URL (pag. 34)' },
  { emoji: '💻', name: 'Pilot Browser Chrome & Butoane de Navigare (pag. 35-36)' },
  { emoji: '🛡️', name: 'Gardian Securitate Cibernetică & Scut Antivirus (pag. 35-36)' },
  { emoji: '🏆', name: 'Explorator Internet & Web Certificat!' },
];

const INTERNET1_STAGES_EN = [
  { emoji: '🌐', name: 'Network Explorer & TCP/IP Protocol (pp. 32-33)' },
  { emoji: '📡', name: 'Internet Services Operator: Email, WWW, FTP (p. 32)' },
  { emoji: '🧩', name: 'Digital Crossword Solver & Secret Column (p. 33)' },
  { emoji: '🧭', name: 'Web Navigator & URL Anatomy (p. 34)' },
  { emoji: '💻', name: 'Browser Pilot & Navigation Controls (pp. 35-36)' },
  { emoji: '🛡️', name: 'Cybersecurity Guardian & Antivirus Shield (pp. 35-36)' },
  { emoji: '🏆', name: 'Certified Internet & Web Explorer!' },
];

const INTERNET1_MILESTONES_RO = [
  'P1: Rețele',
  'P2: Servicii',
  'P3: Rebus',
  'P4: URL Web',
  'P5: Browser',
  'P6: Siguranță',
];

const INTERNET1_MILESTONES_EN = [
  'P1: Networks',
  'P2: Services',
  'P3: Crossword',
  'P4: Web URL',
  'P5: Browser',
  'P6: Safety',
];

const HARDWARE_STAGES_RO = [
  { emoji: '🛡️', name: 'Inspector Protecție & Ergonomie (pag. 10-12)' },
  { emoji: '⏳', name: 'Crononaut: Istoria Calculatoarelor (pag. 13-14)' },
  { emoji: '🖥️', name: 'Tehnician Asamblor Unitate Centrală (pag. 15-17)' },
  { emoji: '🔌', name: 'Expert Periferice: Intrare / Ieșire (pag. 15-16)' },
  { emoji: '💾', name: 'Maestru Biți: Stocare & Autoevaluare (pag. 18-20)' },
  { emoji: '🏆', name: 'Tehnician Hardware Certificat!' },
];

const HARDWARE_STAGES_EN = [
  { emoji: '🛡️', name: 'Safety & Ergonomics Inspector (pp. 10-12)' },
  { emoji: '⏳', name: 'Chrononaut: History of Computing (pp. 13-14)' },
  { emoji: '🖥️', name: 'PC Tower Assembly Technician (pp. 15-17)' },
  { emoji: '🔌', name: 'Peripherals Expert: Input / Output (pp. 15-16)' },
  { emoji: '💾', name: 'Bits Master: Storage & Self-Eval (pp. 18-20)' },
  { emoji: '🏆', name: 'Certified Hardware Technician!' },
];

const HARDWARE_MILESTONES_RO = [
  'N1: Norme',
  'N2: Istorie',
  'N3: Unitate',
  'N4: Periferice',
  'N5: Biți',
];

const HARDWARE_MILESTONES_EN = [
  'L1: Safety',
  'L2: History',
  'L3: PC Tower',
  'L4: Peripherals',
  'L5: Bits',
];

const FILES_STAGES_RO = [
  { emoji: '🖥️', name: 'Inspector SO & Desktop (pag. 22-24)' },
  { emoji: '📑', name: 'Arhitect Date, Extensii & Calea C:\\ (pag. 25-26)' },
  { emoji: '📁', name: 'Constructor Arbore de Foldere (pag. 27-28)' },
  { emoji: '🎯', name: 'Expert Selecție & Căutare (*.docx) (pag. 28)' },
  { emoji: '⚡', name: 'Maestru Mutare & Comenzi Rapide (pag. 29)' },
  { emoji: '🔍', name: 'Tehnician Copiere & Redenumire F2 (pag. 29)' },
  { emoji: '🗑️', name: 'Gardian Recycle Bin & Restaurare (pag. 30)' },
  { emoji: '🏆', name: 'Arhitect Fișiere & SO Certificat!' },
];

const FILES_STAGES_EN = [
  { emoji: '🖥️', name: 'OS & Desktop Inspector (pp. 22-24)' },
  { emoji: '📑', name: 'Data Architect, Extensions & Path C:\\ (pp. 25-26)' },
  { emoji: '📁', name: 'Folder Tree Constructor (pp. 27-28)' },
  { emoji: '🎯', name: 'Multi-Selection & Search Expert (p. 28)' },
  { emoji: '⚡', name: 'Move & Shortcuts Master (p. 29)' },
  { emoji: '🔍', name: 'Copy & F2 Rename Technician (p. 29)' },
  { emoji: '🗑️', name: 'Recycle Bin & Restore Guardian (p. 30)' },
  { emoji: '🏆', name: 'Certified File & OS Architect!' },
];

const FILES_MILESTONES_RO = [
  'N1: Interfață SO',
  'N2: Extensii & Cale',
  'N3: Structură',
  'N4: Căutare',
  'N5: Mutare',
  'N6: Copie & F2',
  'N7: Coș Reciclare',
];

const FILES_MILESTONES_EN = [
  'L1: OS Interface',
  'L2: Extensions & Path',
  'L3: Structure',
  'L4: Search',
  'L5: Move',
  'L6: Copy & F2',
  'L7: Recycle Bin',
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel, courseId = 'files' }) => {
  const { t, lang } = useLanguage();

  const isHardware = courseId === 'hardware';
  const isInternet1 = courseId === 'internet1';

  let stages = lang === 'en' ? FILES_STAGES_EN : FILES_STAGES_RO;
  let milestones = lang === 'en' ? FILES_MILESTONES_EN : FILES_MILESTONES_RO;
  let percents = FILES_STAGE_PERCENTS;
  let maxLevels = 7;

  if (isHardware) {
    stages = lang === 'en' ? HARDWARE_STAGES_EN : HARDWARE_STAGES_RO;
    milestones = lang === 'en' ? HARDWARE_MILESTONES_EN : HARDWARE_MILESTONES_RO;
    percents = HARDWARE_STAGE_PERCENTS;
    maxLevels = 5;
  } else if (isInternet1) {
    stages = lang === 'en' ? INTERNET1_STAGES_EN : INTERNET1_STAGES_RO;
    milestones = lang === 'en' ? INTERNET1_MILESTONES_EN : INTERNET1_MILESTONES_RO;
    percents = INTERNET1_STAGE_PERCENTS;
    maxLevels = 6;
  }

  const stageIndex = Math.min(Math.max(currentLevel - 1, 0), stages.length - 1);
  const currentStage = stages[stageIndex];
  const currentPercent = percents[stageIndex] || (isHardware ? 20 : isInternet1 ? 16 : 14);

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl animate-float p-1 bg-slate-900/60 rounded-xl border border-slate-700/60">
            {currentStage.emoji}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              {isHardware
                ? (lang === 'en' ? 'ICT Hardware Technician Progress' : 'Evoluție Tehnician Hardware TIC')
                : isInternet1
                ? (lang === 'en' ? 'Internet & Web Explorer Progress' : 'Evoluție Explorator Internet & Web TIC')
                : (lang === 'en' ? 'File & OS Architect Progress' : 'Evoluție Arhitect Fișiere & Sistem de Operare')}
            </div>
            <div className={`text-base sm:text-lg font-black font-heading ${isHardware ? 'text-cyan-400' : isInternet1 ? 'text-teal-400' : 'text-emerald-400'}`}>
              {currentStage.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">{t.levelLabel}</span>
            <span className="ml-1 text-sm font-extrabold text-white font-mono">
              {currentLevel <= maxLevels ? `${currentLevel} / ${maxLevels}` : t.victoryLabel}
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
              : isInternet1
              ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400'
              : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
          }`}
          style={{ width: `${currentPercent}%` }}
        />
      </div>

      {/* Level Milestones below */}
      <div className={`grid gap-1 sm:gap-1.5 mt-3 pt-2 text-center text-[10px] sm:text-xs font-semibold text-slate-400 ${
        isHardware ? 'grid-cols-5' : isInternet1 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-4 sm:grid-cols-7'
      }`}>
        {milestones.map((m, idx) => {
          const lvl = idx + 1;
          const isActive = currentLevel >= lvl;
          return (
            <span
              key={m}
              className={`${
                isActive
                  ? isHardware
                    ? 'text-teal-300 font-bold'
                    : isInternet1
                    ? 'text-cyan-300 font-bold'
                    : 'text-emerald-400 font-bold'
                  : 'text-slate-500'
              }`}
            >
              {m}
            </span>
          );
        })}
      </div>
    </div>
  );
};
