import React from 'react';
import { ScratchAlgo2_Level1_CounterLoopAndGauss } from './ScratchAlgo2_Level1_CounterLoopAndGauss';
import { ScratchAlgo2_Level2_PolygonsAndCycles } from './ScratchAlgo2_Level2_PolygonsAndCycles';
import { ScratchAlgo2_Level3_Minecraft3DLayering } from './ScratchAlgo2_Level3_Minecraft3DLayering';
import { ScratchAlgo2_Level4_CoordinateBoundsAndGhost } from './ScratchAlgo2_Level4_CoordinateBoundsAndGhost';
import { ScratchAlgo2_Level5_BrancusiInfiniteColumn } from './ScratchAlgo2_Level5_BrancusiInfiniteColumn';
import { ScratchAlgo2_Level6_FractalsAndTreeOfLife } from './ScratchAlgo2_Level6_FractalsAndTreeOfLife';
import { ScratchAlgo2_Level7_FinalExamAndDiploma } from './ScratchAlgo2_Level7_FinalExamAndDiploma';
import type { GameLevel } from '../../../types';

interface ModuleG6ScratchAlgo2FlowProps {
  currentLevel: GameLevel;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG6ScratchAlgo2Flow: React.FC<ModuleG6ScratchAlgo2FlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName = 'Elev Programator Scratch',
  onRestartMission,
  onReturnToCatalog
}) => {
  switch (currentLevel) {
    case 1:
      return <ScratchAlgo2_Level1_CounterLoopAndGauss onCompletePage={onCompletePage} />;
    case 2:
      return <ScratchAlgo2_Level2_PolygonsAndCycles onCompletePage={onCompletePage} />;
    case 3:
      return <ScratchAlgo2_Level3_Minecraft3DLayering onCompletePage={onCompletePage} />;
    case 4:
      return <ScratchAlgo2_Level4_CoordinateBoundsAndGhost onCompletePage={onCompletePage} />;
    case 5:
      return <ScratchAlgo2_Level5_BrancusiInfiniteColumn onCompletePage={onCompletePage} />;
    case 6:
      return <ScratchAlgo2_Level6_FractalsAndTreeOfLife onCompletePage={onCompletePage} />;
    case 7:
    default:
      return (
        <ScratchAlgo2_Level7_FinalExamAndDiploma
          onCompletePage={onCompletePage}
          studentName={studentName}
          onRestartMission={onRestartMission}
          onReturnToCatalog={onReturnToCatalog}
        />
      );
  }
};
