import React from 'react';
import { AnimVRLevel1_FPSAndAnimationSecrets } from './AnimVRLevel1_FPSAndAnimationSecrets';
import { AnimVRLevel2_StoryArcToontastic } from './AnimVRLevel2_StoryArcToontastic';
import { AnimVRLevel3_DigitalPuppeteeringLab } from './AnimVRLevel3_DigitalPuppeteeringLab';
import { AnimVRLevel4_AudioMoodAndVoiceDirector } from './AnimVRLevel4_AudioMoodAndVoiceDirector';
import { AnimVRLevel5_VRvsARvsMRComparison } from './AnimVRLevel5_VRvsARvsMRComparison';
import { AnimVRLevel6_CoSpaces360VirtualWorld } from './AnimVRLevel6_CoSpaces360VirtualWorld';
import { AnimVRLevel7_DiplomaAndExam } from './AnimVRLevel7_DiplomaAndExam';
import type { GameLevel } from '../../../types';

interface ModuleG6AnimVRFlowProps {
  currentLevel: GameLevel;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG6AnimVRFlow: React.FC<ModuleG6AnimVRFlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName = 'Elev Regizor & Arhitect VR',
  onRestartMission,
  onReturnToCatalog
}) => {
  switch (currentLevel) {
    case 1:
      return <AnimVRLevel1_FPSAndAnimationSecrets onCompletePage={onCompletePage} />;
    case 2:
      return <AnimVRLevel2_StoryArcToontastic onCompletePage={onCompletePage} />;
    case 3:
      return <AnimVRLevel3_DigitalPuppeteeringLab onCompletePage={onCompletePage} />;
    case 4:
      return <AnimVRLevel4_AudioMoodAndVoiceDirector onCompletePage={onCompletePage} />;
    case 5:
      return <AnimVRLevel5_VRvsARvsMRComparison onCompletePage={onCompletePage} />;
    case 6:
      return <AnimVRLevel6_CoSpaces360VirtualWorld onCompletePage={onCompletePage} />;
    case 7:
    default:
      return (
        <AnimVRLevel7_DiplomaAndExam
          onCompletePage={onCompletePage}
          studentName={studentName}
          onRestartMission={onRestartMission}
          onReturnToCatalog={onReturnToCatalog}
        />
      );
  }
};
