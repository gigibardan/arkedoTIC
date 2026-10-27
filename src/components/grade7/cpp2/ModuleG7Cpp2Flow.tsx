import React from 'react';
import { CP2Level1_CinCoutStreams } from './CP2Level1_CinCoutStreams';
import { CP2Level2_LinearExecutionOrder } from './CP2Level2_LinearExecutionOrder';
import { CP2Level3_ArithmeticOperatorsModulo } from './CP2Level3_ArithmeticOperatorsModulo';
import { CP2Level4_DirectAssignmentTrap } from './CP2Level4_DirectAssignmentTrap';
import { CP2Level5_ThreeGlassesSwapVisualizer } from './CP2Level5_ThreeGlassesSwapVisualizer';
import { CP2Level6_FullSwapProgramLab } from './CP2Level6_FullSwapProgramLab';
import { CP2Level7_EvaluationAndCertificate } from './CP2Level7_EvaluationAndCertificate';
import { ArrowLeft, RotateCcw, Code, Cpu } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface ModuleG7Cpp2FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Cpp2Flow: React.FC<ModuleG7Cpp2FlowProps> = ({
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
            <Code className="w-3.5 h-3.5 text-teal-400 inline" />
            <span>Modulul 4B: </span>
            <span className="text-teal-400 font-bold">Structura Liniară, cin/cout &amp; Regula celor 3 Pahare (Manual pag. 74–76)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              <span>Programator:</span> <span className="text-teal-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Ești sigur că vrei să reiei Misiunea 4B de la nivelul 1? Punctajul va fi resetat.')) {
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
      {currentLevel === 1 && <CP2Level1_CinCoutStreams onPass={handlePassCurrentLevel} />}
      {currentLevel === 2 && <CP2Level2_LinearExecutionOrder onPass={handlePassCurrentLevel} />}
      {currentLevel === 3 && <CP2Level3_ArithmeticOperatorsModulo onPass={handlePassCurrentLevel} />}
      {currentLevel === 4 && <CP2Level4_DirectAssignmentTrap onPass={handlePassCurrentLevel} />}
      {currentLevel === 5 && <CP2Level5_ThreeGlassesSwapVisualizer onPass={handlePassCurrentLevel} />}
      {currentLevel === 6 && <CP2Level6_FullSwapProgramLab onPass={handlePassCurrentLevel} />}
      {currentLevel === 7 && <CP2Level7_EvaluationAndCertificate onPass={handlePassCurrentLevel} studentName={studentName} />}
    </div>
  );
};
