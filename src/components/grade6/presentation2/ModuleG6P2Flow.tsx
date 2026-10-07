import React from 'react';
import { P2Level1_SlideOperations } from './P2Level1_SlideOperations';
import { P2Level2_InsertObjects } from './P2Level2_InsertObjects';
import { P2Level3_ThemesAndLayouts } from './P2Level3_ThemesAndLayouts';
import { P2Level4_TransitionsAndAnimations } from './P2Level4_TransitionsAndAnimations';
import { P2Level5_DesignGoldenRules } from './P2Level5_DesignGoldenRules';
import { P2Level6_PublicSpeakingArt } from './P2Level6_PublicSpeakingArt';
import { P2Level7_TouristicProjectAndDiploma } from './P2Level7_TouristicProjectAndDiploma';
import type { GameLevel } from '../../../types';

interface ModuleG6P2FlowProps {
  currentLevel: GameLevel;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG6P2Flow: React.FC<ModuleG6P2FlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName = 'Elev Explorator',
  onRestartMission,
  onReturnToCatalog
}) => {
  switch (currentLevel) {
    case 1:
      return <P2Level1_SlideOperations onCompletePage={onCompletePage} />;
    case 2:
      return <P2Level2_InsertObjects onCompletePage={onCompletePage} />;
    case 3:
      return <P2Level3_ThemesAndLayouts onCompletePage={onCompletePage} />;
    case 4:
      return <P2Level4_TransitionsAndAnimations onCompletePage={onCompletePage} />;
    case 5:
      return <P2Level5_DesignGoldenRules onCompletePage={onCompletePage} />;
    case 6:
      return <P2Level6_PublicSpeakingArt onCompletePage={onCompletePage} />;
    case 7:
    default:
      return (
        <P2Level7_TouristicProjectAndDiploma
          onCompletePage={onCompletePage}
          studentName={studentName}
          onRestartMission={onRestartMission}
          onReturnToCatalog={onReturnToCatalog}
        />
      );
  }
};
