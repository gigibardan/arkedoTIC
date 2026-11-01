import React from 'react';
import { C3Level1_FormulaOperatorsOrder } from './C3Level1_FormulaOperatorsOrder';
import { C3Level2_StatisticalFunctions } from './C3Level2_StatisticalFunctions';
import { C3Level3_LogicalDecisionIf } from './C3Level3_LogicalDecisionIf';
import { C3Level4_IntAndPhysicsLab } from './C3Level4_IntAndPhysicsLab';
import { C3Level5_EconomyVatLab } from './C3Level5_EconomyVatLab';
import { C3Level6_ExcelErrorsStudio } from './C3Level6_ExcelErrorsStudio';
import { C3Level7_FormulasExam } from './C3Level7_FormulasExam';

interface ModuleG8Calc3FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Calc3Flow: React.FC<ModuleG8Calc3FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <C3Level1_FormulaOperatorsOrder onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <C3Level2_StatisticalFunctions onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <C3Level3_LogicalDecisionIf onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <C3Level4_IntAndPhysicsLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <C3Level5_EconomyVatLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <C3Level6_ExcelErrorsStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <C3Level7_FormulasExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
