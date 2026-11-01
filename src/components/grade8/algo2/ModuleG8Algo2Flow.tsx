import React from 'react';
import { A2Level1_IfElseBranchingStudio } from './A2Level1_IfElseBranchingStudio';
import { A2Level2_SwitchCaseMultiwayLab } from './A2Level2_SwitchCaseMultiwayLab';
import { A2Level3_MinMaxAndTrianglesLab } from './A2Level3_MinMaxAndTrianglesLab';
import { A2Level4_DigitDecompositionLab } from './A2Level4_DigitDecompositionLab';
import { A2Level5_NestedDecisionsClinic } from './A2Level5_NestedDecisionsClinic';
import { A2Level6_LogicalBranchDebugger } from './A2Level6_LogicalBranchDebugger';
import { A2Level7_DecisionStructuresExam } from './A2Level7_DecisionStructuresExam';

interface ModuleG8Algo2FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Algo2Flow: React.FC<ModuleG8Algo2FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <A2Level1_IfElseBranchingStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <A2Level2_SwitchCaseMultiwayLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <A2Level3_MinMaxAndTrianglesLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <A2Level4_DigitDecompositionLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <A2Level5_NestedDecisionsClinic onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <A2Level6_LogicalBranchDebugger onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <A2Level7_DecisionStructuresExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
