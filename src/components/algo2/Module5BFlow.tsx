import React from 'react';
import { A2Level1_AlternativeStructure } from './A2Level1_AlternativeStructure';
import { A2Level2_AlgorithmDataTypes } from './A2Level2_AlgorithmDataTypes';
import { A2Level3_DataTypeCategories } from './A2Level3_DataTypeCategories';
import { A2Level4_OperatorsAndExpressions } from './A2Level4_OperatorsAndExpressions';
import { A2Level5_LogicOperatorsTruthTable } from './A2Level5_LogicOperatorsTruthTable';
import { A2Level6_FlowchartBlocksLab } from './A2Level6_FlowchartBlocksLab';
import { A2Level7_TraceTableAndFinalQuiz } from './A2Level7_TraceTableAndFinalQuiz';

interface Module5BFlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const Module5BFlow: React.FC<Module5BFlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <A2Level1_AlternativeStructure
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <A2Level2_AlgorithmDataTypes
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <A2Level3_DataTypeCategories
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <A2Level4_OperatorsAndExpressions
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <A2Level5_LogicOperatorsTruthTable
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <A2Level6_FlowchartBlocksLab
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
      {currentLevel === 7 && (
        <A2Level7_TraceTableAndFinalQuiz
          onCompletePage={(score) => onCompleteLevel(7, score)}
        />
      )}
    </div>
  );
};
