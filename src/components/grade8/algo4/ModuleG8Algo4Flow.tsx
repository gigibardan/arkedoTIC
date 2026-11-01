import React from 'react';
import { A4Level1_VectorDeclarationAndMemory } from './A4Level1_VectorDeclarationAndMemory';
import { A4Level2_VectorTraversalAndStats } from './A4Level2_VectorTraversalAndStats';
import { A4Level3_LinearSearchLab } from './A4Level3_LinearSearchLab';
import { A4Level4_VectorManipulationLab } from './A4Level4_VectorManipulationLab';
import { A4Level5_BubbleSortStudio } from './A4Level5_BubbleSortStudio';
import { A4Level6_SelectionSortAndBinarySearch } from './A4Level6_SelectionSortAndBinarySearch';
import { A4Level7_VectorsAndSortingExam } from './A4Level7_VectorsAndSortingExam';

interface ModuleG8Algo4FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Algo4Flow: React.FC<ModuleG8Algo4FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <A4Level1_VectorDeclarationAndMemory onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <A4Level2_VectorTraversalAndStats onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <A4Level3_LinearSearchLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <A4Level4_VectorManipulationLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <A4Level5_BubbleSortStudio onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <A4Level6_SelectionSortAndBinarySearch onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <A4Level7_VectorsAndSortingExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
