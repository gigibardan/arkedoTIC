import React from 'react';
import { P1Level1_PresentationIntro } from './P1Level1_PresentationIntro';
import { P1Level2_LaunchAndStartScreen } from './P1Level2_LaunchAndStartScreen';
import { P1Level3_InterfaceAnatomy } from './P1Level3_InterfaceAnatomy';
import { P1Level4_RibbonTabsBasics } from './P1Level4_RibbonTabsBasics';
import { P1Level5_SpecializedTabs } from './P1Level5_SpecializedTabs';
import { P1Level6_StatusAndViews } from './P1Level6_StatusAndViews';
import { P1Level7_CommandsLabAndExam } from './P1Level7_CommandsLabAndExam';

interface ModuleG6P1FlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const ModuleG6P1Flow: React.FC<ModuleG6P1FlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <P1Level1_PresentationIntro
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <P1Level2_LaunchAndStartScreen
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <P1Level3_InterfaceAnatomy
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <P1Level4_RibbonTabsBasics
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <P1Level5_SpecializedTabs
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <P1Level6_StatusAndViews
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
      {currentLevel === 7 && (
        <P1Level7_CommandsLabAndExam
          onCompletePage={(score) => onCompleteLevel(7, score)}
        />
      )}
    </div>
  );
};
