import React from 'react';
import { SLevel1_VisualLanguageIntro } from './SLevel1_VisualLanguageIntro';
import { SLevel2_InterfaceAndStage } from './SLevel2_InterfaceAndStage';
import { SLevel3_BlockCategories } from './SLevel3_BlockCategories';
import { SLevel4_LinearScriptRoboTIC } from './SLevel4_LinearScriptRoboTIC';
import { SLevel5_VariablesInScratch } from './SLevel5_VariablesInScratch';
import { SLevel6_RoboOperationsMath } from './SLevel6_RoboOperationsMath';
import { SLevel7_PenExtensionDraw } from './SLevel7_PenExtensionDraw';

interface Module6AFlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const Module6AFlow: React.FC<Module6AFlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <SLevel1_VisualLanguageIntro
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <SLevel2_InterfaceAndStage
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <SLevel3_BlockCategories
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <SLevel4_LinearScriptRoboTIC
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <SLevel5_VariablesInScratch
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <SLevel6_RoboOperationsMath
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
      {currentLevel === 7 && (
        <SLevel7_PenExtensionDraw
          onCompletePage={(score) => onCompleteLevel(7, score)}
        />
      )}
    </div>
  );
};
