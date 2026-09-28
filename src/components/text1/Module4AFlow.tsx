import React from 'react';
import { TLevel1_WordInterface } from './TLevel1_WordInterface';
import { TLevel2_TypingRules } from './TLevel2_TypingRules';
import { TLevel3_FontFormatting } from './TLevel3_FontFormatting';
import { TLevel4_ParagraphAlignment } from './TLevel4_ParagraphAlignment';
import { TLevel5_ListsAndHierarchy } from './TLevel5_ListsAndHierarchy';
import { TLevel6_FindReplaceAndSpellcheck } from './TLevel6_FindReplaceAndSpellcheck';
import { TLevel7_DocumentMasterLab } from './TLevel7_DocumentMasterLab';

interface Module4AFlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const Module4AFlow: React.FC<Module4AFlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <TLevel1_WordInterface
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <TLevel2_TypingRules
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <TLevel3_FontFormatting
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <TLevel4_ParagraphAlignment
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <TLevel5_ListsAndHierarchy
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <TLevel6_FindReplaceAndSpellcheck
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
      {currentLevel === 7 && (
        <TLevel7_DocumentMasterLab
          onCompletePage={(score) => onCompleteLevel(7, score)}
        />
      )}
    </div>
  );
};
