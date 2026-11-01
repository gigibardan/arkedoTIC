import React from 'react';
import { W3Level1_PublishingAndDomains } from './W3Level1_PublishingAndDomains';
import { W3Level2_AccessPermissionsAndCollaboration } from './W3Level2_AccessPermissionsAndCollaboration';
import { W3Level3_CopyrightAndCreativeCommons } from './W3Level3_CopyrightAndCreativeCommons';
import { W3Level4_WebSecurityAndHttpsProtocol } from './W3Level4_WebSecurityAndHttpsProtocol';
import { W3Level5_SearchEngineOptimizationLab } from './W3Level5_SearchEngineOptimizationLab';
import { W3Level6_SiteAuditAndQualityCheck } from './W3Level6_SiteAuditAndQualityCheck';
import { W3Level7_WebPublishingFinalExam } from './W3Level7_WebPublishingFinalExam';

interface ModuleG8Web3FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Web3Flow: React.FC<ModuleG8Web3FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <W3Level1_PublishingAndDomains onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <W3Level2_AccessPermissionsAndCollaboration onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <W3Level3_CopyrightAndCreativeCommons onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <W3Level4_WebSecurityAndHttpsProtocol onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <W3Level5_SearchEngineOptimizationLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <W3Level6_SiteAuditAndQualityCheck onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <W3Level7_WebPublishingFinalExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
