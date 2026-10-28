import React from 'react';
import { LoopLevel1_WhileAnatomy } from './LoopLevel1_WhileAnatomy';
import { LoopLevel2_InfiniteLoopTrap } from './LoopLevel2_InfiniteLoopTrap';
import { LoopLevel3_DigitExtractionChop } from './LoopLevel3_DigitExtractionChop';
import { LoopLevel4_DigitSumAndCounter } from './LoopLevel4_DigitSumAndCounter';
import { LoopLevel5_PalindromeAndMirror } from './LoopLevel5_PalindromeAndMirror';
import { LoopLevel6_CodeBlocksWhileLab } from './LoopLevel6_CodeBlocksWhileLab';
import { LoopLevel7_EvaluationAndCertificate } from './LoopLevel7_EvaluationAndCertificate';
import { ArrowLeft, RotateCcw, Repeat, Cpu } from 'lucide-react';
import { sounds } from '../../../utils/audio';

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
              <span>Catalog Misiuni</span>
            </button>
          )}

          <div className="text-xs text-slate-400 font-mono hidden sm:inline flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-cyan-400 inline" />
            <span>Modulul 4D: </span>
            <span className="text-cyan-400 font-bold">
              Structura Repetitivă while &amp; Algoritmi pe Cifrele unui Număr (Manual pag. 81–85)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Programator:</span> <span className="text-cyan-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Ești sigur că vrei să reiei Misiunea 4D de la nivelul 1? Punctajul va fi resetat.')) {
                  sounds.playClick();
                  onRestartMission();
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
              title="Resetează misiunea de la Nivelul 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reia Misiunea</span>
            </button>
          )}
        </div>
      </div>

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
