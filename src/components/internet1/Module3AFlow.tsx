import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ILevel1_NetworkBasics } from './ILevel1_NetworkBasics';
import { ILevel2_InternetServices } from './ILevel2_InternetServices';
import { ILevel3_CrosswordAndRebus } from './ILevel3_CrosswordAndRebus';
import { ILevel4_WebAndURLAnatomy } from './ILevel4_WebAndURLAnatomy';
import { ILevel5_BrowserNavigationLab } from './ILevel5_BrowserNavigationLab';
import { ILevel6_SafetyAndThreatsShield } from './ILevel6_SafetyAndThreatsShield';

interface Module3AFlowProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export const Module3AFlow: React.FC<Module3AFlowProps> = ({
  currentLevel,
  onCompleteLevel,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <ILevel1_NetworkBasics
          onCompletePage={(score) => onCompleteLevel(1, score)}
        />
      )}
      {currentLevel === 2 && (
        <ILevel2_InternetServices
          onCompletePage={(score) => onCompleteLevel(2, score)}
        />
      )}
      {currentLevel === 3 && (
        <ILevel3_CrosswordAndRebus
          onCompletePage={(score) => onCompleteLevel(3, score)}
        />
      )}
      {currentLevel === 4 && (
        <ILevel4_WebAndURLAnatomy
          onCompletePage={(score) => onCompleteLevel(4, score)}
        />
      )}
      {currentLevel === 5 && (
        <ILevel5_BrowserNavigationLab
          onCompletePage={(score) => onCompleteLevel(5, score)}
        />
      )}
      {currentLevel === 6 && (
        <ILevel6_SafetyAndThreatsShield
          onCompletePage={(score) => onCompleteLevel(6, score)}
        />
      )}
    </div>
  );
};
