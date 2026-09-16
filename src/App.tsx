import React, { useState } from 'react';
import { GameLevel } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { Level1_Structure } from './components/Level1_Structure';
import { Level2_SelectionSearch } from './components/Level2_SelectionSearch';
import { Level3_MoveShortcuts } from './components/Level3_MoveShortcuts';
import { Level4_CopyRenameProps } from './components/Level4_CopyRenameProps';
import { Level5_RecycleBin } from './components/Level5_RecycleBin';
import { VictoryScreen } from './components/VictoryScreen';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { sounds } from './utils/audio';

function GameContent() {
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState<GameLevel>(1);
  const [score, setScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  const maxScore = 100;

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.enabled = newState;
    if (newState) sounds.playClick();
  };

  const handleLevel1Complete = () => {
    setScore(20);
    setCurrentLevel(2);
  };

  const handleLevel2Complete = () => {
    setScore(40);
    setCurrentLevel(3);
  };

  const handleLevel3Complete = () => {
    setScore(60);
    setCurrentLevel(4);
  };

  const handleLevel4Complete = () => {
    setScore(80);
    setCurrentLevel(5);
  };

  const handleLevel5Complete = () => {
    setScore(100);
    setCurrentLevel(6);
  };

  const handleResetGame = () => {
    sounds.playClick();
    setScore(0);
    setCurrentLevel(1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        score={score}
        maxScore={maxScore}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenExportModal={() => setExportModalOpen(true)}
      />

      {/* Main Game Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Tree Evolution Progress */}
        <ProgressBar currentLevel={currentLevel} />

        {/* Level Views */}
        <div className="flex-1">
          {currentLevel === 1 && (
            <Level1_Structure onComplete={handleLevel1Complete} />
          )}

          {currentLevel === 2 && (
            <Level2_SelectionSearch onComplete={handleLevel2Complete} />
          )}

          {currentLevel === 3 && (
            <Level3_MoveShortcuts onComplete={handleLevel3Complete} />
          )}

          {currentLevel === 4 && (
            <Level4_CopyRenameProps onComplete={handleLevel4Complete} />
          )}

          {currentLevel === 5 && (
            <Level5_RecycleBin onComplete={handleLevel5Complete} />
          )}

          {currentLevel === 6 && (
            <VictoryScreen
              score={score}
              maxScore={maxScore}
              onReset={handleResetGame}
              onOpenExportModal={() => setExportModalOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 bg-slate-950/40">
        <p className="max-w-xl mx-auto leading-relaxed">
          {t.footerText}
        </p>
      </footer>

      {/* Standalone Export Modal for Teachers */}
      <StandaloneExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <GameContent />
    </LanguageProvider>
  );
}


