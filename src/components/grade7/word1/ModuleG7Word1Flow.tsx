import React from 'react';
import { W1Level1_TypographyAnatomy } from './W1Level1_TypographyAnatomy';
import { W1Level2_RomanianRules } from './W1Level2_RomanianRules';
import { W1Level3_ParagraphMetrics } from './W1Level3_ParagraphMetrics';
import { W1Level4_HierarchicalStyles } from './W1Level4_HierarchicalStyles';
import { W1Level5_FindReplaceLab } from './W1Level5_FindReplaceLab';
import { W1Level6_EditorialStudio } from './W1Level6_EditorialStudio';
import { W1Level7_TypographyExam } from './W1Level7_TypographyExam';

interface ModuleG7Word1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Word1Flow: React.FC<ModuleG7Word1FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <W1Level1_TypographyAnatomy onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <W1Level2_RomanianRules onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <W1Level3_ParagraphMetrics onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <W1Level4_HierarchicalStyles onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <W1Level5_FindReplaceLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <W1Level6_EditorialStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <W1Level7_TypographyExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
