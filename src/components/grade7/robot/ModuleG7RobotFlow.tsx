import React, { useState } from 'react';
import { RobotLevel1_RobotAnatomyAndHardware } from './RobotLevel1_RobotAnatomyAndHardware';
import { RobotLevel2_GeometricPolygonTraversal } from './RobotLevel2_GeometricPolygonTraversal';
import { RobotLevel3_UltrasonicDistanceSensor } from './RobotLevel3_UltrasonicDistanceSensor';
import { RobotLevel4_LineTrackingSensor } from './RobotLevel4_LineTrackingSensor';
import { RobotLevel5_AutonomousMazeRunner } from './RobotLevel5_AutonomousMazeRunner';
import { RobotLevel6_CodeBlocksRobotLab } from './RobotLevel6_CodeBlocksRobotLab';
import { RobotLevel7_EvaluationAndCertificate } from './RobotLevel7_EvaluationAndCertificate';
import { ArrowLeft, RotateCcw, Bot, Cpu, AlertTriangle, Check, X } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface ModuleG7RobotFlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7RobotFlow: React.FC<ModuleG7RobotFlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName,
  onRestartMission,
  onReturnToCatalog,
}) => {
  const { lang } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePassCurrentLevel = (score: number) => {
    onCompletePage(score);
  };

  const handleConfirmReset = () => {
    sounds.playClick();
    setShowResetConfirm(false);
    if (onRestartMission) {
      onRestartMission();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top Navigation & Student Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-md backdrop-blur">
        <div className="flex items-center gap-2">
          {onReturnToCatalog && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onReturnToCatalog();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Catalog Misiuni' : 'Mission Catalog'}</span>
            </button>
          )}

          <div className="text-xs text-slate-400 font-mono hidden sm:inline flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-indigo-400 inline" />
            <span>{lang === 'ro' ? 'Modulul 4F: ' : 'Module 4F: '}</span>
            <span className="text-indigo-400 font-bold">
              {lang === 'ro'
                ? 'Robotică Educațională & Roboți Virtuali cu Senzori (Manual pag. 103–108)'
                : 'Educational Robotics & Virtual Sensor Robots (Textbook pp. 103–108)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'ro' ? 'Inginer Robotician:' : 'Robotics Engineer:'}</span>{' '}
              <span className="text-indigo-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowResetConfirm(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
              title={lang === 'ro' ? 'Resetează misiunea de la Nivelul 1' : 'Restart mission from Level 1'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ro' ? 'Reia Misiunea' : 'Restart Mission'}</span>
            </button>
          )}
        </div>
      </div>

      {/* In-DOM Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-rose-200 font-medium">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>
              {lang === 'ro'
                ? 'Ești sigur că vrei să reiei Misiunea 4F de la nivelul 1? Punctajul va fi resetat.'
                : 'Are you sure you want to restart Mission 4F from Level 1? Your score will be reset.'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Da, Reia' : 'Yes, Restart'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowResetConfirm(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Anulează' : 'Cancel'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Level Component Loading */}
      {currentLevel === 1 && <RobotLevel1_RobotAnatomyAndHardware onPass={handlePassCurrentLevel} />}
      {currentLevel === 2 && <RobotLevel2_GeometricPolygonTraversal onPass={handlePassCurrentLevel} />}
      {currentLevel === 3 && <RobotLevel3_UltrasonicDistanceSensor onPass={handlePassCurrentLevel} />}
      {currentLevel === 4 && <RobotLevel4_LineTrackingSensor onPass={handlePassCurrentLevel} />}
      {currentLevel === 5 && <RobotLevel5_AutonomousMazeRunner onPass={handlePassCurrentLevel} />}
      {currentLevel === 6 && <RobotLevel6_CodeBlocksRobotLab onPass={handlePassCurrentLevel} />}
      {currentLevel === 7 && <RobotLevel7_EvaluationAndCertificate onPass={handlePassCurrentLevel} studentName={studentName} />}
    </div>
  );
};
