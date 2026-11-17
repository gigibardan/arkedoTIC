import React, { useState } from 'react';
import { GameLevel } from '../../../types';
import { A1Level1_PhysicsOfSound } from './A1Level1_PhysicsOfSound';
import { A1Level2_SamplingMonoStereo } from './A1Level2_SamplingMonoStereo';
import { A1Level3_AudioFormatsCalc } from './A1Level3_AudioFormatsCalc';
import { A1Level4_WavePadInterface } from './A1Level4_WavePadInterface';
import { A1Level5_AudioEditingTechniques } from './A1Level5_AudioEditingTechniques';
import { A1Level6_RadioJingleStudio } from './A1Level6_RadioJingleStudio';
import { A1Level7_AcousticWavePadExam } from './A1Level7_AcousticWavePadExam';
import { ArrowLeft, RotateCcw, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';

interface ModuleG7Audio1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Audio1Flow: React.FC<ModuleG7Audio1FlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName,
  onRestartMission,
  onReturnToCatalog,
}) => {
  const { lang } = useLanguage();
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const handlePassCurrentLevel = (score: number) => {
    onCompletePage(score);
  };

  const confirmRestart = () => {
    sounds.playClick();
    setShowRestartConfirm(false);
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
              <span>{lang === 'ro' ? 'Catalog Misiuni' : 'Missions Catalog'}</span>
            </button>
          )}

          <div className="text-xs text-slate-400 font-mono hidden sm:inline">
            {lang === 'ro' ? 'Modulul 2A:' : 'Module 2A:'}{' '}
            <span className="text-amber-400 font-bold">
              {lang === 'ro'
                ? 'Acustică & WavePad (Manual pag. 28–35)'
                : 'Acoustics & WavePad (Textbook pp. 28–35)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {lang === 'ro' ? 'Elev:' : 'Student:'} <span className="text-amber-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowRestartConfirm(true);
              }}
              className="min-h-[36px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
              title={lang === 'ro' ? 'Reia Misiunea 2A de la Nivelul 1' : 'Restart Mission 2A from Level 1'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ro' ? 'Reia Misiunea' : 'Restart Mission'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Banner (In-DOM, no window.confirm) */}
      {showRestartConfirm && (
        <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {lang === 'ro'
                ? 'Ești sigur că vrei să reiei Misiunea 2A de la început? Punctajul va fi resetat.'
                : 'Are you sure you want to restart Mission 2A from the beginning? Progress will be reset.'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={confirmRestart}
              className="min-h-[34px] px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
            >
              {lang === 'ro' ? 'Da, Reia' : 'Yes, Restart'}
            </button>
            <button
              type="button"
              onClick={() => setShowRestartConfirm(false)}
              className="min-h-[34px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            >
              {lang === 'ro' ? 'Anulează' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Render Current Level Component */}
      <div className="w-full">
        {currentLevel === 1 && <A1Level1_PhysicsOfSound onPass={handlePassCurrentLevel} />}
        {currentLevel === 2 && <A1Level2_SamplingMonoStereo onPass={handlePassCurrentLevel} />}
        {currentLevel === 3 && <A1Level3_AudioFormatsCalc onPass={handlePassCurrentLevel} />}
        {currentLevel === 4 && <A1Level4_WavePadInterface onPass={handlePassCurrentLevel} />}
        {currentLevel === 5 && <A1Level5_AudioEditingTechniques onPass={handlePassCurrentLevel} />}
        {currentLevel === 6 && <A1Level6_RadioJingleStudio onPass={handlePassCurrentLevel} />}
        {currentLevel >= 7 && <A1Level7_AcousticWavePadExam onPass={handlePassCurrentLevel} />}
      </div>
    </div>
  );
};
