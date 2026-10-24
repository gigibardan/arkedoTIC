import React from 'react';
import { V1Level1_VideoFundamentals } from './V1Level1_VideoFundamentals';
import { V1Level2_MultitrackTimeline } from './V1Level2_MultitrackTimeline';
import { V1Level3_SplitTrimSurgery } from './V1Level3_SplitTrimSurgery';
import { V1Level4_VideoTransitions } from './V1Level4_VideoTransitions';
import { V1Level5_TitlingAndText } from './V1Level5_TitlingAndText';
import { V1Level6_SchoolShortStudio } from './V1Level6_SchoolShortStudio';
import { V1Level7_CreativeCommonsExam } from './V1Level7_CreativeCommonsExam';
import { ArrowLeft, RotateCcw, Film } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface ModuleG7Video1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Video1Flow: React.FC<ModuleG7Video1FlowProps> = ({
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
            <Film className="w-3.5 h-3.5 text-rose-400 inline" />
            <span>Modulul 2B: </span>
            <span className="text-rose-400 font-bold">VideoPad & Montaj Video Multitrack (Manual pag. 36–47)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              Regizor: <span className="text-rose-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Ești sigur că vrei să reiei Misiunea 2B de la început?')) {
                  sounds.playClick();
                  onRestartMission();
                }
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
              title="Reia Misiunea 2B de la Nivelul 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reia Misiunea</span>
            </button>
          )}
        </div>
      </div>

      {/* Render Current Level Component */}
      <div className="w-full">
        {currentLevel === 1 && <V1Level1_VideoFundamentals onPass={handlePassCurrentLevel} />}
        {currentLevel === 2 && <V1Level2_MultitrackTimeline onPass={handlePassCurrentLevel} />}
        {currentLevel === 3 && <V1Level3_SplitTrimSurgery onPass={handlePassCurrentLevel} />}
        {currentLevel === 4 && <V1Level4_VideoTransitions onPass={handlePassCurrentLevel} />}
        {currentLevel === 5 && <V1Level5_TitlingAndText onPass={handlePassCurrentLevel} />}
        {currentLevel === 6 && <V1Level6_SchoolShortStudio onPass={handlePassCurrentLevel} />}
        {currentLevel >= 7 && <V1Level7_CreativeCommonsExam onPass={handlePassCurrentLevel} />}
      </div>
    </div>
  );
};
