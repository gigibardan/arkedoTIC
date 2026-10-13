import React from 'react';
import { EmailLevel1_AnatomyAndAddresses } from './EmailLevel1_AnatomyAndAddresses';
import { EmailLevel2_ToCcBccSimulator } from './EmailLevel2_ToCcBccSimulator';
import { EmailLevel3_AttachmentsAndSecurity } from './EmailLevel3_AttachmentsAndSecurity';
import { EmailLevel4_NetiquetteMaster } from './EmailLevel4_NetiquetteMaster';
import { EmailLevel5_CyberbullyingAndSafety } from './EmailLevel5_CyberbullyingAndSafety';
import { EmailLevel6_CloudSharingLab } from './EmailLevel6_CloudSharingLab';
import { EmailLevel7_DiplomeAndExam } from './EmailLevel7_DiplomeAndExam';
import type { GameLevel } from '../../../types';

interface ModuleG6EmailFlowProps {
  currentLevel: GameLevel;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG6EmailFlow: React.FC<ModuleG6EmailFlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName = 'Elev Ambasador Netichetă',
  onRestartMission,
  onReturnToCatalog
}) => {
  switch (currentLevel) {
    case 1:
      return <EmailLevel1_AnatomyAndAddresses onCompletePage={onCompletePage} />;
    case 2:
      return <EmailLevel2_ToCcBccSimulator onCompletePage={onCompletePage} />;
    case 3:
      return <EmailLevel3_AttachmentsAndSecurity onCompletePage={onCompletePage} />;
    case 4:
      return <EmailLevel4_NetiquetteMaster onCompletePage={onCompletePage} />;
    case 5:
      return <EmailLevel5_CyberbullyingAndSafety onCompletePage={onCompletePage} />;
    case 6:
      return <EmailLevel6_CloudSharingLab onCompletePage={onCompletePage} />;
    case 7:
    default:
      return (
        <EmailLevel7_DiplomeAndExam
          onCompletePage={onCompletePage}
          studentName={studentName}
          onRestartMission={onRestartMission}
          onReturnToCatalog={onReturnToCatalog}
        />
      );
  }
};
