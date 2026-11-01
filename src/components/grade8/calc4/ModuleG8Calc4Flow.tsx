import React from 'react';
import { D1Level1_ChartTypesSelector } from './D1Level1_ChartTypesSelector';
import { D1Level2_ChartAnatomyStudio } from './D1Level2_ChartAnatomyStudio';
import { D1Level3_ChartCustomizationTools } from './D1Level3_ChartCustomizationTools';
import { D1Level4_GeographyClimateLab } from './D1Level4_GeographyClimateLab';
import { D1Level5_BudgetPieChartLab } from './D1Level5_BudgetPieChartLab';
import { D1Level6_DataSeriesAudit } from './D1Level6_DataSeriesAudit';
import { D1Level7_ChartsMasterExam } from './D1Level7_ChartsMasterExam';

interface ModuleG8Calc4FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Calc4Flow: React.FC<ModuleG8Calc4FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <D1Level1_ChartTypesSelector onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <D1Level2_ChartAnatomyStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <D1Level3_ChartCustomizationTools onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <D1Level4_GeographyClimateLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <D1Level5_BudgetPieChartLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <D1Level6_DataSeriesAudit onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <D1Level7_ChartsMasterExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
