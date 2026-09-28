import React from 'react';
import { T2Level1_TablesCreation } from './T2Level1_TablesCreation';
import { T2Level2_TableFormatting } from './T2Level2_TableFormatting';
import { T2Level3_PicturesAndResizing } from './T2Level3_PicturesAndResizing';
import { T2Level4_TextWrapping } from './T2Level4_TextWrapping';
import { T2Level5_ShapesAndTextBoxes } from './T2Level5_ShapesAndTextBoxes';
import { T2Level6_PageSetupAndHeaders } from './T2Level6_PageSetupAndHeaders';
import { T2Level7_MagazineMasterLab } from './T2Level7_MagazineMasterLab';

interface Module4BFlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const Module4BFlow: React.FC<Module4BFlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <T2Level1_TablesCreation
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <T2Level2_TableFormatting
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <T2Level3_PicturesAndResizing
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <T2Level4_TextWrapping
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <T2Level5_ShapesAndTextBoxes
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <T2Level6_PageSetupAndHeaders
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
      {currentLevel === 7 && (
        <T2Level7_MagazineMasterLab
          onCompletePage={(score) => onCompleteLevel(7, score)}
        />
      )}
    </div>
  );
};
