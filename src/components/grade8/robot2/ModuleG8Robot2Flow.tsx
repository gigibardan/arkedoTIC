import React from 'react';
import { R2Level1_SmartStreetlightLab } from './R2Level1_SmartStreetlightLab';
import { R2Level2_SmartParkingBarrier } from './R2Level2_SmartParkingBarrier';
import { R2Level3_GasAndFireSafetySystem } from './R2Level3_GasAndFireSafetySystem';
import { R2Level4_IoTWeatherStation } from './R2Level4_IoTWeatherStation';
import { R2Level5_SmartCityMasterIntegrator } from './R2Level5_SmartCityMasterIntegrator';
import { R2Level6_IoTHardwareDebugger } from './R2Level6_IoTHardwareDebugger';
import { R2Level7_SmartCityFinalExam } from './R2Level7_SmartCityFinalExam';

interface ModuleG8Robot2FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Robot2Flow: React.FC<ModuleG8Robot2FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <R2Level1_SmartStreetlightLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <R2Level2_SmartParkingBarrier onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <R2Level3_GasAndFireSafetySystem onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <R2Level4_IoTWeatherStation onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <R2Level5_SmartCityMasterIntegrator onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <R2Level6_IoTHardwareDebugger onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <R2Level7_SmartCityFinalExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
