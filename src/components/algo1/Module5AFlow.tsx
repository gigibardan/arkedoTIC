import React from 'react';
import { ALevel1_WhatIsAlgorithm } from './ALevel1_WhatIsAlgorithm';
import { ALevel2_AlgorithmProperties } from './ALevel2_AlgorithmProperties';
import { ALevel3_AmbiguityTrap } from './ALevel3_AmbiguityTrap';
import { ALevel4_SequentialAlgorithms } from './ALevel4_SequentialAlgorithms';
import { ALevel5_ThreeGlassesLab } from './ALevel5_ThreeGlassesLab';
import { ALevel6_EncryptionAlgorithm } from './ALevel6_EncryptionAlgorithm';
import { ALevel7_MathAlgorithmsLab } from './ALevel7_MathAlgorithmsLab';

interface Module5AFlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const Module5AFlow: React.FC<Module5AFlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <ALevel1_WhatIsAlgorithm
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <ALevel2_AlgorithmProperties
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <ALevel3_AmbiguityTrap
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <ALevel4_SequentialAlgorithms
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <ALevel5_ThreeGlassesLab
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <ALevel6_EncryptionAlgorithm
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
      {currentLevel === 7 && (
        <ALevel7_MathAlgorithmsLab
          onCompletePage={(score) => onCompleteLevel(7, score)}
        />
      )}
    </div>
  );
};
