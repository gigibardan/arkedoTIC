import React from 'react';
import { W2Level1_GoogleSitesWorkspace } from './W2Level1_GoogleSitesWorkspace';
import { W2Level2_SiteHierarchyAndPages } from './W2Level2_SiteHierarchyAndPages';
import { W2Level3_LayoutsAndBlocksStudio } from './W2Level3_LayoutsAndBlocksStudio';
import { W2Level4_MultimediaEmbeddingLab } from './W2Level4_MultimediaEmbeddingLab';
import { W2Level5_ThemesAndVisualIdentity } from './W2Level5_ThemesAndVisualIdentity';
import { W2Level6_ResponsivePreviewStudio } from './W2Level6_ResponsivePreviewStudio';
import { W2Level7_GoogleSitesExam } from './W2Level7_GoogleSitesExam';

interface ModuleG8Web2FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Web2Flow: React.FC<ModuleG8Web2FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <W2Level1_GoogleSitesWorkspace onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <W2Level2_SiteHierarchyAndPages onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <W2Level3_LayoutsAndBlocksStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <W2Level4_MultimediaEmbeddingLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <W2Level5_ThemesAndVisualIdentity onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <W2Level6_ResponsivePreviewStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <W2Level7_GoogleSitesExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
