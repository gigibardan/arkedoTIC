import React from 'react';
import { S2Level1_DecisionBlocks } from './S2Level1_DecisionBlocks';
import { S2Level2_MazeGame } from './S2Level2_MazeGame';
import { S2Level3_MultiplicationQuizGame } from './S2Level3_MultiplicationQuizGame';
import { S2Level4_MusicExtension } from './S2Level4_MusicExtension';
import { S2Level5_DoMajorSongs } from './S2Level5_DoMajorSongs';
import { S2Level6_CatchFishContestGame } from './S2Level6_CatchFishContestGame';
import { S2Level7_SavePlanetFinalExam } from './S2Level7_SavePlanetFinalExam';

interface Module6BFlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const Module6BFlow: React.FC<Module6BFlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <S2Level1_DecisionBlocks
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <S2Level2_MazeGame
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <S2Level3_MultiplicationQuizGame
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <S2Level4_MusicExtension
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <S2Level5_DoMajorSongs
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <S2Level6_CatchFishContestGame
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
      {currentLevel === 7 && (
        <S2Level7_SavePlanetFinalExam
          onCompletePage={(score) => onCompleteLevel(7, score)}
        />
      )}
    </div>
  );
};
