import React from 'react';
import { R1Level1_MicrocontrollerArchitecture } from './R1Level1_MicrocontrollerArchitecture';
import { R1Level2_DigitalVsAnalogSensors } from './R1Level2_DigitalVsAnalogSensors';
import { R1Level3_UltrasonicDistanceLab } from './R1Level3_UltrasonicDistanceLab';
import { R1Level4_ActuatorsMotorsServos } from './R1Level4_ActuatorsMotorsServos';
import { R1Level5_AutonomousObstacleAvoider } from './R1Level5_AutonomousObstacleAvoider';
import { R1Level6_CircuitsAndHardwareDebugger } from './R1Level6_CircuitsAndHardwareDebugger';
import { R1Level7_RoboticsAndSensorsExam } from './R1Level7_RoboticsAndSensorsExam';

interface ModuleG8Robot1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG8Robot1Flow: React.FC<ModuleG8Robot1FlowProps> = ({
  currentLevel,
  onCompletePage,
}) => {
  return (
    <div className="w-full">
      {currentLevel === 1 && (
        <R1Level1_MicrocontrollerArchitecture onCompletePage={onCompletePage} />
      )}
      {currentLevel === 2 && (
        <R1Level2_DigitalVsAnalogSensors onCompletePage={onCompletePage} />
      )}
      {currentLevel === 3 && (
        <R1Level3_UltrasonicDistanceLab onCompletePage={onCompletePage} />
      )}
      {currentLevel === 4 && (
        <R1Level4_ActuatorsMotorsServos onCompletePage={onCompletePage} />
      )}
      {currentLevel === 5 && (
        <R1Level5_AutonomousObstacleAvoider onCompletePage={onCompletePage} />
      )}
      {currentLevel === 6 && (
        <R1Level6_CircuitsAndHardwareDebugger onCompletePage={onCompletePage} />
      )}
      {currentLevel === 7 && (
        <R1Level7_RoboticsAndSensorsExam onCompletePage={onCompletePage} />
      )}
    </div>
  );
};
