import React, { useState } from 'react';
import { V1Level1_VideoFundamentals } from './V1Level1_VideoFundamentals';
import { V1Level2_MultitrackTimeline } from './V1Level2_MultitrackTimeline';
import { V1Level3_SplitTrimSurgery } from './V1Level3_SplitTrimSurgery';
import { V1Level4_VideoTransitions } from './V1Level4_VideoTransitions';
import { V1Level5_TitlingAndText } from './V1Level5_TitlingAndText';
import { V1Level6_SchoolShortStudio } from './V1Level6_SchoolShortStudio';
import { V1Level7_CreativeCommonsExam } from './V1Level7_CreativeCommonsExam';
import { ArrowLeft, RotateCcw, Film, AlertTriangle } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface ModuleG7Video1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Video1Flow: React.FC<ModuleG7Video1FlowProps> = ({
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

          <div className="text-xs text-slate-400 font-mono hidden sm:inline flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-rose-400 inline" />
            <span>{lang === 'ro' ? 'Modulul 2B: ' : 'Module 2B: '}</span>
            <span className="text-rose-400 font-bold">
              {lang === 'ro'
                ? 'VideoPad & Montaj Video Multitrack (Manual pag. 36–47)'
                : 'VideoPad & Multitrack Video Editing (Textbook pp. 36–47)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {lang === 'ro' ? 'Regizor: ' : 'Director: '}
              <span className="text-rose-300 font-bold">{studentName}</span>
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
              title={lang === 'ro' ? 'Reia Misiunea 2B de la Nivelul 1' : 'Restart Mission 2B from Level 1'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'ro' ? 'Reia Misiunea' : 'Restart Mission'}
              </span>
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
                ? 'Ești sigur că vrei să reiei Misiunea 2B de la început? Punctajul va fi resetat.'
                : 'Are you sure you want to restart Mission 2B from the beginning? Progress will be reset.'}
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
        {currentLevel === 1 && <V1Level1_VideoFundamentals onPass={handlePassCurrentLevel} />}
        {currentLevel === 2 && <V1Level2_MultitrackTimeline onPass={handlePassCurrentLevel} />}
        {currentLevel === 3 && <V1Level3_SplitTrimSurgery onPass={handlePassCurrentLevel} />}
        {currentLevel === 4 && <V1Level4_VideoTransitions onPass={handlePassCurrentLevel} />}
        {currentLevel === 5 && <V1Level5_TitlingAndText onPass={handlePassCurrentLevel} />}
        {currentLevel === 6 && <V1Level6_SchoolShortStudio onPass={handlePassCurrentLevel} />}
        {currentLevel >= 7 && <V1Level7_CreativeCommonsExam onPass={handlePassCurrentLevel} />}
      </div>
    </div>
  );
};
