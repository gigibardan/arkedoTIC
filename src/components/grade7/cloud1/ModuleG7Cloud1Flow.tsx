import React from 'react';
import { C1Level1_CloudFundamentals } from './C1Level1_CloudFundamentals';
import { C1Level2_PermissionMatrix } from './C1Level2_PermissionMatrix';
import { C1Level3_SynchronousEditing } from './C1Level3_SynchronousEditing';
import { C1Level4_CommentsAndMentions } from './C1Level4_CommentsAndMentions';
import { C1Level5_VersionHistoryTimeMachine } from './C1Level5_VersionHistoryTimeMachine';
import { C1Level6_TeamPresentationStudio } from './C1Level6_TeamPresentationStudio';
import { C1Level7_CloudNetiquetteExam } from './C1Level7_CloudNetiquetteExam';
import { ArrowLeft, RotateCcw, Cloud, Users } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface ModuleG7Cloud1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Cloud1Flow: React.FC<ModuleG7Cloud1FlowProps> = ({
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
            <Cloud className="w-3.5 h-3.5 text-emerald-400 inline" />
            <span>Modulul 3A: </span>
            <span className="text-emerald-400 font-bold">Aplicații Colaborative în Cloud (Manual pag. 48–56)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Coordonator:</span> <span className="text-emerald-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Ești sigur că vrei să reiei Misiunea 3A de la nivelul 1? Punctajul va fi resetat.')) {
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
      {currentLevel === 1 && <C1Level1_CloudFundamentals onPass={handlePassCurrentLevel} />}
      {currentLevel === 2 && <C1Level2_PermissionMatrix onPass={handlePassCurrentLevel} />}
      {currentLevel === 3 && <C1Level3_SynchronousEditing onPass={handlePassCurrentLevel} />}
      {currentLevel === 4 && <C1Level4_CommentsAndMentions onPass={handlePassCurrentLevel} />}
      {currentLevel === 5 && <C1Level5_VersionHistoryTimeMachine onPass={handlePassCurrentLevel} />}
      {currentLevel === 6 && <C1Level6_TeamPresentationStudio onPass={handlePassCurrentLevel} />}
      {currentLevel === 7 && <C1Level7_CloudNetiquetteExam onPass={handlePassCurrentLevel} />}
    </div>
  );
};
