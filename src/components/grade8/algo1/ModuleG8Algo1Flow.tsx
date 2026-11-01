import React from 'react';
import { A1Level1_CppEnvironmentAndStructure } from './A1Level1_CppEnvironmentAndStructure';
import { A1Level2_DataTypesAndMemory } from './A1Level2_DataTypesAndMemory';
import { A1Level3_ArithmeticAndModuloLab } from './A1Level3_ArithmeticAndModuloLab';
import { A1Level4_RelationalAndLogicalOperators } from './A1Level4_RelationalAndLogicalOperators';
import { A1Level5_InteractiveConsoleIO } from './A1Level5_InteractiveConsoleIO';
import { A1Level6_ExpressionDebuggerLab } from './A1Level6_ExpressionDebuggerLab';
import { A1Level7_CppRecapExam } from './A1Level7_CppRecapExam';

interface ModuleG8Algo1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Algo1Flow: React.FC<ModuleG8Algo1FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <A1Level1_CppEnvironmentAndStructure onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <A1Level2_DataTypesAndMemory onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <A1Level3_ArithmeticAndModuloLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <A1Level4_RelationalAndLogicalOperators onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <A1Level5_InteractiveConsoleIO onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <A1Level6_ExpressionDebuggerLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <A1Level7_CppRecapExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
