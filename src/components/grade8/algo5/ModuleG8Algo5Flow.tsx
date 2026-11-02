import React from 'react';
import { A5Level1_FunctionStructureAndPrototypes } from './A5Level1_FunctionStructureAndPrototypes';
import { A5Level2_ParameterPassingLab } from './A5Level2_ParameterPassingLab';
import { A5Level3_ArrayFunctionsStudio } from './A5Level3_ArrayFunctionsStudio';
import { A5Level4_MathAndUtilityFunctions } from './A5Level4_MathAndUtilityFunctions';
import { A5Level5_ModularProjectIntegrator } from './A5Level5_ModularProjectIntegrator';
import { A5Level6_CodeRefactoringDebugger } from './A5Level6_CodeRefactoringDebugger';
import { A5Level7_FunctionsAndModularExam } from './A5Level7_FunctionsAndModularExam';

interface ModuleG8Algo5FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Algo5Flow: React.FC<ModuleG8Algo5FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <A5Level1_FunctionStructureAndPrototypes onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <A5Level2_ParameterPassingLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <A5Level3_ArrayFunctionsStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <A5Level4_MathAndUtilityFunctions onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <A5Level5_ModularProjectIntegrator onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <A5Level6_CodeRefactoringDebugger onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <A5Level7_FunctionsAndModularExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
