import React from 'react';
import { ScratchAlgo1_Level1_SequentialToLoops } from './ScratchAlgo1_Level1_SequentialToLoops';
import { ScratchAlgo1_Level2_WhileVsRepeatUntil } from './ScratchAlgo1_Level2_WhileVsRepeatUntil';
import { ScratchAlgo1_Level3_LogicOperatorsAndConditions } from './ScratchAlgo1_Level3_LogicOperatorsAndConditions';
import { ScratchAlgo1_Level4_InfiniteLoopsTrap } from './ScratchAlgo1_Level4_InfiniteLoopsTrap';
import { ScratchAlgo1_Level5_SensorsInLoops } from './ScratchAlgo1_Level5_SensorsInLoops';
import { ScratchAlgo1_Level6_SmartMazeAlgorithm } from './ScratchAlgo1_Level6_SmartMazeAlgorithm';
import { ScratchAlgo1_Level7_DiplomaAndExam } from './ScratchAlgo1_Level7_DiplomaAndExam';
import type { GameLevel } from '../../../types';

interface ModuleG6ScratchAlgo1FlowProps {
  currentLevel: GameLevel;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG6ScratchAlgo1Flow: React.FC<ModuleG6ScratchAlgo1FlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName = 'Elev Programator Scratch',
  onRestartMission,
  onReturnToCatalog
}) => {
  switch (currentLevel) {
    case 1:
      return <ScratchAlgo1_Level1_SequentialToLoops onCompletePage={onCompletePage} />;
    case 2:
      return <ScratchAlgo1_Level2_WhileVsRepeatUntil onCompletePage={onCompletePage} />;
    case 3:
      return <ScratchAlgo1_Level3_LogicOperatorsAndConditions onCompletePage={onCompletePage} />;
    case 4:
      return <ScratchAlgo1_Level4_InfiniteLoopsTrap onCompletePage={onCompletePage} />;
    case 5:
      return <ScratchAlgo1_Level5_SensorsInLoops onCompletePage={onCompletePage} />;
    case 6:
      return <ScratchAlgo1_Level6_SmartMazeAlgorithm onCompletePage={onCompletePage} />;
    case 7:
    default:
      return (
        <ScratchAlgo1_Level7_DiplomaAndExam
          onCompletePage={onCompletePage}
          studentName={studentName}
          onRestartMission={onRestartMission}
          onReturnToCatalog={onReturnToCatalog}
        />
      );
  }
};
