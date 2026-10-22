import React from 'react';
import { W2Level1_PageLayoutMargins } from './W2Level1_PageLayoutMargins';
import { W2Level2_HeaderFooterNumbering } from './W2Level2_HeaderFooterNumbering';
import { W2Level3_SectionBreaks } from './W2Level3_SectionBreaks';
import { W2Level4_ProfessionalTables } from './W2Level4_ProfessionalTables';
import { W2Level5_FootnotesEndnotes } from './W2Level5_FootnotesEndnotes';
import { W2Level6_MagazineStudio } from './W2Level6_MagazineStudio';
import { W2Level7_LayoutExam } from './W2Level7_LayoutExam';

interface ModuleG7Word2FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Word2Flow: React.FC<ModuleG7Word2FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <W2Level1_PageLayoutMargins onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <W2Level2_HeaderFooterNumbering onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <W2Level3_SectionBreaks onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <W2Level4_ProfessionalTables onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <W2Level5_FootnotesEndnotes onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <W2Level6_MagazineStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <W2Level7_LayoutExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
