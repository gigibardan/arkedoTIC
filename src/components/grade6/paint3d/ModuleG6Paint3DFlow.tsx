import React from 'react';
import { Paint3DLevel1_WhatIs3D } from './Paint3DLevel1_WhatIs3D';
import { Paint3DLevel2_InterfaceAnatomy } from './Paint3DLevel2_InterfaceAnatomy';
import { Paint3DLevel3_FourAxesManipulation } from './Paint3DLevel3_FourAxesManipulation';
import { Paint3DLevel4_Make3DAndShapes } from './Paint3DLevel4_Make3DAndShapes';
import { Paint3DLevel5_StickersAndMaterials } from './Paint3DLevel5_StickersAndMaterials';
import { Paint3DLevel6_ExportAndAnimations } from './Paint3DLevel6_ExportAndAnimations';
import { Paint3DLevel7_AvatarLabAndDiploma } from './Paint3DLevel7_AvatarLabAndDiploma';
import type { GameLevel } from '../../../types';

interface ModuleG6Paint3DFlowProps {
  currentLevel: GameLevel;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG6Paint3DFlow: React.FC<ModuleG6Paint3DFlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName = 'Elev Creator 3D',
  onRestartMission,
  onReturnToCatalog
}) => {
  switch (currentLevel) {
    case 1:
      return <Paint3DLevel1_WhatIs3D onCompletePage={onCompletePage} />;
    case 2:
      return <Paint3DLevel2_InterfaceAnatomy onCompletePage={onCompletePage} />;
    case 3:
      return <Paint3DLevel3_FourAxesManipulation onCompletePage={onCompletePage} />;
    case 4:
      return <Paint3DLevel4_Make3DAndShapes onCompletePage={onCompletePage} />;
    case 5:
      return <Paint3DLevel5_StickersAndMaterials onCompletePage={onCompletePage} />;
    case 6:
      return <Paint3DLevel6_ExportAndAnimations onCompletePage={onCompletePage} />;
    case 7:
    default:
      return (
        <Paint3DLevel7_AvatarLabAndDiploma
          onCompletePage={onCompletePage}
          studentName={studentName}
          onRestartMission={onRestartMission}
          onReturnToCatalog={onReturnToCatalog}
        />
      );
  }
};
