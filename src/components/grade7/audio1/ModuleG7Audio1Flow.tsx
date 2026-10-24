import React from 'react';
import { GameLevel } from '../../../types';
import { A1Level1_PhysicsOfSound } from './A1Level1_PhysicsOfSound';
import { A1Level2_SamplingMonoStereo } from './A1Level2_SamplingMonoStereo';
import { A1Level3_AudioFormatsCalc } from './A1Level3_AudioFormatsCalc';
import { A1Level4_WavePadInterface } from './A1Level4_WavePadInterface';
import { A1Level5_AudioEditingTechniques } from './A1Level5_AudioEditingTechniques';
import { A1Level6_RadioJingleStudio } from './A1Level6_RadioJingleStudio';
import { A1Level7_AcousticWavePadExam } from './A1Level7_AcousticWavePadExam';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface ModuleG7Audio1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Audio1Flow: React.FC<ModuleG7Audio1FlowProps> = ({
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

          <div className="text-xs text-slate-400 font-mono hidden sm:inline">
            Modulul 2A: <span className="text-amber-400 font-bold">Acustică & WavePad (Manual pag. 28–35)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              Elev: <span className="text-amber-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Ești sigur că vrei să reiei Misiunea 2A de la început?')) {
                  sounds.playClick();
                  onRestartMission();
                }
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
              title="Reia Misiunea 2A de la Nivelul 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reia Misiunea</span>
            </button>
          )}
        </div>
      </div>

      {/* Render Current Level Component */}
      <div className="w-full">
        {currentLevel === 1 && <A1Level1_PhysicsOfSound onPass={handlePassCurrentLevel} />}
        {currentLevel === 2 && <A1Level2_SamplingMonoStereo onPass={handlePassCurrentLevel} />}
        {currentLevel === 3 && <A1Level3_AudioFormatsCalc onPass={handlePassCurrentLevel} />}
        {currentLevel === 4 && <A1Level4_WavePadInterface onPass={handlePassCurrentLevel} />}
        {currentLevel === 5 && <A1Level5_AudioEditingTechniques onPass={handlePassCurrentLevel} />}
        {currentLevel === 6 && <A1Level6_RadioJingleStudio onPass={handlePassCurrentLevel} />}
        {currentLevel >= 7 && <A1Level7_AcousticWavePadExam onPass={handlePassCurrentLevel} />}
      </div>
    </div>
  );
};
