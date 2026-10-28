import React from 'react';
import { StemLevel1_ForLoopCounter } from './StemLevel1_ForLoopCounter';
import { StemLevel2_DoWhileValidation } from './StemLevel2_DoWhileValidation';
import { StemLevel3_DivisorsAndPrimes } from './StemLevel3_DivisorsAndPrimes';
import { StemLevel4_NestedLoopsArt } from './StemLevel4_NestedLoopsArt';
import { StemLevel5_PhysicsLabMechanics } from './StemLevel5_PhysicsLabMechanics';
import { StemLevel6_GeographyStatsLab } from './StemLevel6_GeographyStatsLab';
import { StemLevel7_EvaluationAndCertificate } from './StemLevel7_EvaluationAndCertificate';
import { ArrowLeft, RotateCcw, Activity, Cpu } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface ModuleG7StemFlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7StemFlow: React.FC<ModuleG7StemFlowProps> = ({
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
            <Activity className="w-3.5 h-3.5 text-cyan-400 inline" />
            <span>Modulul 4E: </span>
            <span className="text-cyan-400 font-bold">
              Bucle for, do-while &amp; Aplicații Interdisciplinare STEM (Manual pag. 86–102)
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
                if (window.confirm('Ești sigur că vrei să reiei Misiunea 4E de la nivelul 1? Punctajul va fi resetat.')) {
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
      {currentLevel === 1 && <StemLevel1_ForLoopCounter onPass={handlePassCurrentLevel} />}
      {currentLevel === 2 && <StemLevel2_DoWhileValidation onPass={handlePassCurrentLevel} />}
      {currentLevel === 3 && <StemLevel3_DivisorsAndPrimes onPass={handlePassCurrentLevel} />}
      {currentLevel === 4 && <StemLevel4_NestedLoopsArt onPass={handlePassCurrentLevel} />}
      {currentLevel === 5 && <StemLevel5_PhysicsLabMechanics onPass={handlePassCurrentLevel} />}
      {currentLevel === 6 && <StemLevel6_GeographyStatsLab onPass={handlePassCurrentLevel} />}
      {currentLevel === 7 && <StemLevel7_EvaluationAndCertificate onPass={handlePassCurrentLevel} studentName={studentName} />}
    </div>
  );
};
