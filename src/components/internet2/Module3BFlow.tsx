import React from 'react';
import { I2Level1_SearchEngines } from './I2Level1_SearchEngines';
import { I2Level2_InformationEvaluation } from './I2Level2_InformationEvaluation';
import { I2Level3_EmailAnatomy } from './I2Level3_EmailAnatomy';
import { I2Level4_Netiquette } from './I2Level4_Netiquette';
import { I2Level5_CopyrightAndPlagiarism } from './I2Level5_CopyrightAndPlagiarism';
import { I2Level6_DigitalIdentityAndPasswords } from './I2Level6_DigitalIdentityAndPasswords';

interface Module3BFlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const Module3BFlow: React.FC<Module3BFlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <I2Level1_SearchEngines
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <I2Level2_InformationEvaluation
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <I2Level3_EmailAnatomy
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <I2Level4_Netiquette
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <I2Level5_CopyrightAndPlagiarism
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <I2Level6_DigitalIdentityAndPasswords
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
    </div>
  );
};
