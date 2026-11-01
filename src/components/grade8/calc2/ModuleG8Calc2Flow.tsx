import React from 'react';
import { C2Level1_AutofillSeries } from './C2Level1_AutofillSeries';
import { C2Level2_MergeAndWrap } from './C2Level2_MergeAndWrap';
import { C2Level3_NumberFormatsCatalog } from './C2Level3_NumberFormatsCatalog';
import { C2Level4_CellBordersStyling } from './C2Level4_CellBordersStyling';
import { C2Level5_MultiLevelSorting } from './C2Level5_MultiLevelSorting';
import { C2Level6_CatalogFormattingLab } from './C2Level6_CatalogFormattingLab';
import { C2Level7_FormattingExam } from './C2Level7_FormattingExam';

interface ModuleG8Calc2FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Calc2Flow: React.FC<ModuleG8Calc2FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <C2Level1_AutofillSeries onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <C2Level2_MergeAndWrap onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <C2Level3_NumberFormatsCatalog onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <C2Level4_CellBordersStyling onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <C2Level5_MultiLevelSorting onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <C2Level6_CatalogFormattingLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <C2Level7_FormattingExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
