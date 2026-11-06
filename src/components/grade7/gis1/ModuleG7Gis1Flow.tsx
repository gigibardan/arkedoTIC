import React, { useState } from 'react';
import { G1Level1_GISArchitecture } from './G1Level1_GISArchitecture';
import { G1Level2_LayersAndStacking } from './G1Level2_LayersAndStacking';
import { G1Level3_SpatialDataVectors } from './G1Level3_SpatialDataVectors';
import { G1Level4_GPSCoordinates } from './G1Level4_GPSCoordinates';
import { G1Level5_GoogleEarthLab } from './G1Level5_GoogleEarthLab';
import { G1Level6_SpatialAnalysisSmartCity } from './G1Level6_SpatialAnalysisSmartCity';
import { G1Level7_GISNetiquetteExam } from './G1Level7_GISNetiquetteExam';
import { ArrowLeft, RotateCcw, Map, Globe, AlertTriangle } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface ModuleG7Gis1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Gis1Flow: React.FC<ModuleG7Gis1FlowProps> = ({
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
              <span>{lang === 'ro' ? 'Catalog Misiuni' : 'Mission Catalog'}</span>
            </button>
          )}

          <div className="text-xs text-slate-400 font-mono hidden sm:inline flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-teal-400 inline" />
            <span>{lang === 'ro' ? 'Modulul 3B: ' : 'Module 3B: '}</span>
            <span className="text-teal-400 font-bold">
              {lang === 'ro'
                ? 'Sisteme Informaționale Geografice (GIS) & Cartografie Digitală (Manual pag. 57–63)'
                : 'Geographic Information Systems (GIS) & Digital Cartography (Textbook pp. 57–63)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>{lang === 'ro' ? 'Cartograf:' : 'Cartographer:'}</span>{' '}
              <span className="text-teal-300 font-bold">{studentName}</span>
            </div>
          )}

          {onRestartMission && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowRestartConfirm(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
              title={lang === 'ro' ? 'Resetează misiunea de la Nivelul 1' : 'Reset mission from Level 1'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ro' ? 'Reia Misiunea' : 'Restart Mission'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal (In-DOM, no window.confirm) */}
      {showRestartConfirm && (
        <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {lang === 'ro'
                ? 'Ești sigur că vrei să reiei Misiunea 3B de la nivelul 1? Punctajul va fi resetat.'
                : 'Are you sure you want to restart Mission 3B from Level 1? Progress will be reset.'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={confirmRestart}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
            >
              {lang === 'ro' ? 'Da, Reia' : 'Yes, Restart'}
            </button>
            <button
              type="button"
              onClick={() => setShowRestartConfirm(false)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            >
              {lang === 'ro' ? 'Anulează' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Level Component Loading */}
      {currentLevel === 1 && <G1Level1_GISArchitecture onPass={handlePassCurrentLevel} />}
      {currentLevel === 2 && <G1Level2_LayersAndStacking onPass={handlePassCurrentLevel} />}
      {currentLevel === 3 && <G1Level3_SpatialDataVectors onPass={handlePassCurrentLevel} />}
      {currentLevel === 4 && <G1Level4_GPSCoordinates onPass={handlePassCurrentLevel} />}
      {currentLevel === 5 && <G1Level5_GoogleEarthLab onPass={handlePassCurrentLevel} />}
      {currentLevel === 6 && <G1Level6_SpatialAnalysisSmartCity onPass={handlePassCurrentLevel} />}
      {currentLevel === 7 && <G1Level7_GISNetiquetteExam onPass={handlePassCurrentLevel} studentName={studentName} />}
    </div>
  );
};
