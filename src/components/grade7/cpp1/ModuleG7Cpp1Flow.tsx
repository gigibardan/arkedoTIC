import React, { useState } from 'react';
import { CPLevel1_TransitionFromScratch } from './CPLevel1_TransitionFromScratch';
import { CPLevel2_CodeBlocksIDEAnatomy } from './CPLevel2_CodeBlocksIDEAnatomy';
import { CPLevel3_ProgramSkeletonSyntax } from './CPLevel3_ProgramSkeletonSyntax';
import { CPLevel4_DataTypesPrimitiveMemory } from './CPLevel4_DataTypesPrimitiveMemory';
import { CPLevel5_VariablesAndIdentifiers } from './CPLevel5_VariablesAndIdentifiers';
import { CPLevel6_VirtualCodeBlocksStudio } from './CPLevel6_VirtualCodeBlocksStudio';
import { CPLevel7_FinalExamCertificate } from './CPLevel7_FinalExamCertificate';
import { ArrowLeft, RotateCcw, Code, Cpu, AlertTriangle } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface ModuleG7Cpp1FlowProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ModuleG7Cpp1Flow: React.FC<ModuleG7Cpp1FlowProps> = ({
  currentLevel,
  onCompletePage,
  studentName,
  onRestartMission,
  onReturnToCatalog,
}) => {
  const { lang } = useLanguage();
  const [showRestartConfirm, setShowRestartConfirm] = useState<boolean>(false);

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
            <Code className="w-3.5 h-3.5 text-violet-400 inline" />
            <span>{lang === 'ro' ? 'Modulul 4A: ' : 'Module 4A: '}</span>
            <span className="text-violet-400 font-bold">
              {lang === 'ro'
                ? 'Tranziția la C++: Mediul Code::Blocks, Compilare & Tipuri de Date (Manual pag. 64–73)'
                : 'Transition to C++: Code::Blocks IDE, Compilation & Data Types (Textbook pp. 64–73)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              <span>{lang === 'ro' ? 'Programator:' : 'Programmer:'}</span>{' '}
              <span className="text-violet-300 font-bold">{studentName}</span>
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
                ? 'Ești sigur că vrei să reiei Misiunea 4A de la nivelul 1? Punctajul va fi resetat.'
                : 'Are you sure you want to restart Mission 4A from Level 1? Progress will be reset.'}
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
      {currentLevel === 1 && <CPLevel1_TransitionFromScratch onPass={handlePassCurrentLevel} />}
      {currentLevel === 2 && <CPLevel2_CodeBlocksIDEAnatomy onPass={handlePassCurrentLevel} />}
      {currentLevel === 3 && <CPLevel3_ProgramSkeletonSyntax onPass={handlePassCurrentLevel} />}
      {currentLevel === 4 && <CPLevel4_DataTypesPrimitiveMemory onPass={handlePassCurrentLevel} />}
      {currentLevel === 5 && <CPLevel5_VariablesAndIdentifiers onPass={handlePassCurrentLevel} />}
      {currentLevel === 6 && <CPLevel6_VirtualCodeBlocksStudio onPass={handlePassCurrentLevel} />}
      {currentLevel === 7 && <CPLevel7_FinalExamCertificate onPass={handlePassCurrentLevel} studentName={studentName} />}
    </div>
  );
};
