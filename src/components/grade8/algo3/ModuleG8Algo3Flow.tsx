import React from 'react';
import { A3Level1_WhileLoopStudio } from './A3Level1_WhileLoopStudio';
import { A3Level2_DoWhilePostTestLab } from './A3Level2_DoWhilePostTestLab';
import { A3Level3_ForLoopCounterLab } from './A3Level3_ForLoopCounterLab';
import { A3Level4_DigitLoopAlgorithmsLab } from './A3Level4_DigitLoopAlgorithmsLab';
import { A3Level5_DivisorsAndPrimesClinic } from './A3Level5_DivisorsAndPrimesClinic';
import { A3Level6_EuclidGcdAndLcmStudio } from './A3Level6_EuclidGcdAndLcmStudio';
import { A3Level7_LoopsAndNumberTheoryExam } from './A3Level7_LoopsAndNumberTheoryExam';

interface ModuleG8Algo3FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Algo3Flow: React.FC<ModuleG8Algo3FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <A3Level1_WhileLoopStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <A3Level2_DoWhilePostTestLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <A3Level3_ForLoopCounterLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <A3Level4_DigitLoopAlgorithmsLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <A3Level5_DivisorsAndPrimesClinic onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <A3Level6_EuclidGcdAndLcmStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <A3Level7_LoopsAndNumberTheoryExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
