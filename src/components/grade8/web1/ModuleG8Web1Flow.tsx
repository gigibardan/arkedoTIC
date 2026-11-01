import React from 'react';
import { W1Level1_WebArchitectureAndUrl } from './W1Level1_WebArchitectureAndUrl';
import { W1Level2_HtmlDocumentSkeleton } from './W1Level2_HtmlDocumentSkeleton';
import { W1Level3_HeadingsAndParagraphsStudio } from './W1Level3_HeadingsAndParagraphsStudio';
import { W1Level4_ListsAndNavigationLab } from './W1Level4_ListsAndNavigationLab';
import { W1Level5_HyperlinksAndMediaStudio } from './W1Level5_HyperlinksAndMediaStudio';
import { W1Level6_HtmlCodeInspectorAndFixer } from './W1Level6_HtmlCodeInspectorAndFixer';
import { W1Level7_WebFoundationsExam } from './W1Level7_WebFoundationsExam';

interface ModuleG8Web1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Web1Flow: React.FC<ModuleG8Web1FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <W1Level1_WebArchitectureAndUrl onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <W1Level2_HtmlDocumentSkeleton onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <W1Level3_HeadingsAndParagraphsStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <W1Level4_ListsAndNavigationLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <W1Level5_HyperlinksAndMediaStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <W1Level6_HtmlCodeInspectorAndFixer onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <W1Level7_WebFoundationsExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
