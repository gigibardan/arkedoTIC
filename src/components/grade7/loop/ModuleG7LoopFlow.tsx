import React, { useState } from 'react';
import { LoopLevel1_WhileAnatomy } from './LoopLevel1_WhileAnatomy';
import { LoopLevel2_InfiniteLoopTrap } from './LoopLevel2_InfiniteLoopTrap';
import { LoopLevel3_DigitExtractionChop } from './LoopLevel3_DigitExtractionChop';
import { LoopLevel4_DigitSumAndCounter } from './LoopLevel4_DigitSumAndCounter';
import { LoopLevel5_PalindromeAndMirror } from './LoopLevel5_PalindromeAndMirror';
import { LoopLevel6_CodeBlocksWhileLab } from './LoopLevel6_CodeBlocksWhileLab';
import { LoopLevel7_EvaluationAndCertificate } from './LoopLevel7_EvaluationAndCertificate';
import { ArrowLeft, RotateCcw, Repeat, Cpu, AlertTriangle, X, Check } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface ModuleG7LoopFlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7LoopFlow: React.FC<ModuleG7LoopFlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName,
  onRestartMission,
  onReturnToCatalog,
}) => {
  const { lang } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePassCurrentLevel = (score: number) => {
    onCompletePage(score);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top Navigation & Student Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-md backdrop-blur">
        <div className="flex items-center gap-2">
          {onReturnToCatalog && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onReturnToCatalog();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Catalog Misiuni' : 'Missions Catalog'}</span>
            </button>
          )}

          <div className="text-xs text-slate-400 font-mono hidden sm:inline flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-cyan-400 inline" />
            <span>{lang === 'ro' ? 'Modulul 4D: ' : 'Module 4D: '}</span>
            <span className="text-cyan-400 font-bold">
              {lang === 'ro'
                ? 'Structura Repetitivă while & Algoritmi pe Cifrele unui Număr (Manual pag. 81–85)'
                : 'while Loop Structure & Digit Algorithms (Textbook p. 81–85)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ro' ? 'Programator:' : 'Coder:'}</span> <span className="text-cyan-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowResetConfirm(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
              title={lang === 'ro' ? 'Resetează misiunea de la Nivelul 1' : 'Reset mission from Level 1'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ro' ? 'Reia Misiunea' : 'Restart Mission'}</span>
            </button>
          )}
        </div>
      </div>

      {/* In-DOM Reset Confirmation Banner */}
      {showResetConfirm && (
        <div className="bg-rose-950/90 border-2 border-rose-500/60 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs sm:text-sm text-rose-200">
              {lang === 'ro'
                ? 'Ești sigur că vrei să reiei Misiunea 4D de la nivelul 1? Punctajul va fi resetat.'
                : 'Are you sure you want to restart Mission 4D from Level 1? Score will be reset.'}
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowResetConfirm(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Anulează' : 'Cancel'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowResetConfirm(false);
                if (onRestartMission) onRestartMission();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-md shadow-rose-600/30"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Da, Reia' : 'Yes, Restart'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Level Component Loading */}
      {currentLevel === 1 && <LoopLevel1_WhileAnatomy onPass={handlePassCurrentLevel} />}
      {currentLevel === 2 && <LoopLevel2_InfiniteLoopTrap onPass={handlePassCurrentLevel} />}
      {currentLevel === 3 && <LoopLevel3_DigitExtractionChop onPass={handlePassCurrentLevel} />}
      {currentLevel === 4 && <LoopLevel4_DigitSumAndCounter onPass={handlePassCurrentLevel} />}
      {currentLevel === 5 && <LoopLevel5_PalindromeAndMirror onPass={handlePassCurrentLevel} />}
      {currentLevel === 6 && <LoopLevel6_CodeBlocksWhileLab onPass={handlePassCurrentLevel} />}
      {currentLevel === 7 && <LoopLevel7_EvaluationAndCertificate onPass={handlePassCurrentLevel} studentName={studentName} />}
    </div>
  );
};
