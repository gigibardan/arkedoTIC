import React from 'react';
import { C1Level1_SpreadsheetOrigins } from './C1Level1_SpreadsheetOrigins';
import { C1Level2_RibbonAnatomy } from './C1Level2_RibbonAnatomy';
import { C1Level3_CellCoordinatesRanges } from './C1Level3_CellCoordinatesRanges';
import { C1Level4_DataTypesFormatting } from './C1Level4_DataTypesFormatting';
import { C1Level5_SheetsWorkbookOperations } from './C1Level5_SheetsWorkbookOperations';
import { C1Level6_TableLabMultiplication } from './C1Level6_TableLabMultiplication';
import { C1Level7_ExcelMasterExam } from './C1Level7_ExcelMasterExam';

interface ModuleG8Calc1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Calc1Flow: React.FC<ModuleG8Calc1FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <C1Level1_SpreadsheetOrigins onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <C1Level2_RibbonAnatomy onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <C1Level3_CellCoordinatesRanges onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <C1Level4_DataTypesFormatting onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <C1Level5_SheetsWorkbookOperations onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <C1Level6_TableLabMultiplication onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <C1Level7_ExcelMasterExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
