import React, { lazy } from 'react';
import { AllMissionId } from '../types';
import { MISSION_META_BY_ID } from '../lib/carnetService';
import { ProgressBar } from './ProgressBar';
import { VictoryScreen } from './VictoryScreen';
import { useLanguage } from '../context/LanguageContext';
import { ReportIssueButton } from './ReportIssueButton';

export interface FlowLevelComponentProps {
  currentLevel: number;
  onCompleteLevel: (levelIndex: number, earnedScore: number) => void;
}

export interface FlowPageComponentProps {
  currentLevel: number;
  onCompletePage: (earnedScore: number) => void;
  studentName: string;
  onRestartMission: () => void;
  onReturnToCatalog: () => void;
}

// Grade 5 — Bespoke Level Components (Hardware & Files)
const FLevel1_OSInterface = lazy(() => import('./files/FLevel1_OSInterface').then((m) => ({ default: m.FLevel1_OSInterface })));
const FLevel2_DataMemory = lazy(() => import('./files/FLevel2_DataMemory').then((m) => ({ default: m.FLevel2_DataMemory })));
const Level1_Structure = lazy(() => import('./Level1_Structure').then((m) => ({ default: m.Level1_Structure })));
const Level2_SelectionSearch = lazy(() => import('./Level2_SelectionSearch').then((m) => ({ default: m.Level2_SelectionSearch })));
const Level3_MoveShortcuts = lazy(() => import('./Level3_MoveShortcuts').then((m) => ({ default: m.Level3_MoveShortcuts })));
const Level4_CopyRenameProps = lazy(() => import('./Level4_CopyRenameProps').then((m) => ({ default: m.Level4_CopyRenameProps })));
const Level5_RecycleBin = lazy(() => import('./Level5_RecycleBin').then((m) => ({ default: m.Level5_RecycleBin })));

const HLevel1_ErgonomyRules = lazy(() => import('./hardware/HLevel1_ErgonomyRules').then((m) => ({ default: m.HLevel1_ErgonomyRules })));
const HLevel2_HistoryTimeline = lazy(() => import('./hardware/HLevel2_HistoryTimeline').then((m) => ({ default: m.HLevel2_HistoryTimeline })));
const HLevel3_CentralUnitAssembly = lazy(() => import('./hardware/HLevel3_CentralUnitAssembly').then((m) => ({ default: m.HLevel3_CentralUnitAssembly })));
const HLevel4_PeripheralsSort = lazy(() => import('./hardware/HLevel4_PeripheralsSort').then((m) => ({ default: m.HLevel4_PeripheralsSort })));
const HLevel5_BitsQuiz = lazy(() => import('./hardware/HLevel5_BitsQuiz').then((m) => ({ default: m.HLevel5_BitsQuiz })));

// Grade 5 & Grade 6 P1 — Flow Components (onCompleteLevel)
const Module3AFlow = lazy(() => import('./internet1/Module3AFlow').then((m) => ({ default: m.Module3AFlow })));
const Module3BFlow = lazy(() => import('./internet2/Module3BFlow').then((m) => ({ default: m.Module3BFlow })));
const Module4AFlow = lazy(() => import('./text1/Module4AFlow').then((m) => ({ default: m.Module4AFlow })));
const Module4BFlow = lazy(() => import('./text2/Module4BFlow').then((m) => ({ default: m.Module4BFlow })));
const Module5AFlow = lazy(() => import('./algo1/Module5AFlow').then((m) => ({ default: m.Module5AFlow })));
const Module5BFlow = lazy(() => import('./algo2/Module5BFlow').then((m) => ({ default: m.Module5BFlow })));
const Module6AFlow = lazy(() => import('./scratch1/Module6AFlow').then((m) => ({ default: m.Module6AFlow })));
const Module6BFlow = lazy(() => import('./scratch2/Module6BFlow').then((m) => ({ default: m.Module6BFlow })));
const ModuleG6P1Flow = lazy(() => import('./grade6/presentation1/ModuleG6P1Flow').then((m) => ({ default: m.ModuleG6P1Flow })));

// Grade 6 — Flow Components (onCompletePage)
const ModuleG6P2Flow = lazy(() => import('./grade6/presentation2/ModuleG6P2Flow').then((m) => ({ default: m.ModuleG6P2Flow })));
const ModuleG6Paint3DFlow = lazy(() => import('./grade6/paint3d/ModuleG6Paint3DFlow').then((m) => ({ default: m.ModuleG6Paint3DFlow })));
const ModuleG6AnimVRFlow = lazy(() => import('./grade6/animation_vr/ModuleG6AnimVRFlow').then((m) => ({ default: m.ModuleG6AnimVRFlow })));
const ModuleG6M1Flow = lazy(() => import('./grade6/malware/ModuleG6M1Flow').then((m) => ({ default: m.ModuleG6M1Flow })));
const ModuleG6EmailFlow = lazy(() => import('./grade6/email/ModuleG6EmailFlow').then((m) => ({ default: m.ModuleG6EmailFlow })));
const ModuleG6ScratchAlgo1Flow = lazy(() => import('./grade6/scratch_algo1/ModuleG6ScratchAlgo1Flow').then((m) => ({ default: m.ModuleG6ScratchAlgo1Flow })));
const ModuleG6ScratchAlgo2Flow = lazy(() => import('./grade6/scratch_algo2/ModuleG6ScratchAlgo2Flow').then((m) => ({ default: m.ModuleG6ScratchAlgo2Flow })));

// Grade 7 — Flow Components (onCompletePage)
const ModuleG7Word1Flow = lazy(() => import('./grade7/word1/ModuleG7Word1Flow').then((m) => ({ default: m.ModuleG7Word1Flow })));
const ModuleG7Word2Flow = lazy(() => import('./grade7/word2/ModuleG7Word2Flow').then((m) => ({ default: m.ModuleG7Word2Flow })));
const ModuleG7Audio1Flow = lazy(() => import('./grade7/audio1/ModuleG7Audio1Flow').then((m) => ({ default: m.ModuleG7Audio1Flow })));
const ModuleG7Video1Flow = lazy(() => import('./grade7/video1/ModuleG7Video1Flow').then((m) => ({ default: m.ModuleG7Video1Flow })));
const ModuleG7Cloud1Flow = lazy(() => import('./grade7/cloud1/ModuleG7Cloud1Flow').then((m) => ({ default: m.ModuleG7Cloud1Flow })));
const ModuleG7Gis1Flow = lazy(() => import('./grade7/gis1/ModuleG7Gis1Flow').then((m) => ({ default: m.ModuleG7Gis1Flow })));
const ModuleG7Cpp1Flow = lazy(() => import('./grade7/cpp1/ModuleG7Cpp1Flow').then((m) => ({ default: m.ModuleG7Cpp1Flow })));
const ModuleG7Cpp2Flow = lazy(() => import('./grade7/cpp2/ModuleG7Cpp2Flow').then((m) => ({ default: m.ModuleG7Cpp2Flow })));
const ModuleG7DecisionFlow = lazy(() => import('./grade7/decision/ModuleG7DecisionFlow').then((m) => ({ default: m.ModuleG7DecisionFlow })));
const ModuleG7LoopFlow = lazy(() => import('./grade7/loop/ModuleG7LoopFlow').then((m) => ({ default: m.ModuleG7LoopFlow })));
const ModuleG7StemFlow = lazy(() => import('./grade7/stem/ModuleG7StemFlow').then((m) => ({ default: m.ModuleG7StemFlow })));
const ModuleG7RobotFlow = lazy(() => import('./grade7/robot/ModuleG7RobotFlow').then((m) => ({ default: m.ModuleG7RobotFlow })));

// Grade 8 — Flow Components (onCompletePage)
const Grade8MissionFlow = lazy(() => import('./grade8/Grade8MissionFlow').then((m) => ({ default: m.Grade8MissionFlow })));
const ModuleG8Calc1Flow = lazy(() => import('./grade8/calc1/ModuleG8Calc1Flow').then((m) => ({ default: m.ModuleG8Calc1Flow })));
const ModuleG8Calc2Flow = lazy(() => import('./grade8/calc2/ModuleG8Calc2Flow').then((m) => ({ default: m.ModuleG8Calc2Flow })));
const ModuleG8Calc3Flow = lazy(() => import('./grade8/calc3/ModuleG8Calc3Flow').then((m) => ({ default: m.ModuleG8Calc3Flow })));
const ModuleG8Calc4Flow = lazy(() => import('./grade8/calc4/ModuleG8Calc4Flow').then((m) => ({ default: m.ModuleG8Calc4Flow })));
const ModuleG8Web1Flow = lazy(() => import('./grade8/web1/ModuleG8Web1Flow').then((m) => ({ default: m.ModuleG8Web1Flow })));
const ModuleG8Web2Flow = lazy(() => import('./grade8/web2/ModuleG8Web2Flow').then((m) => ({ default: m.ModuleG8Web2Flow })));
const ModuleG8Web3Flow = lazy(() => import('./grade8/web3/ModuleG8Web3Flow').then((m) => ({ default: m.ModuleG8Web3Flow })));
const ModuleG8Algo1Flow = lazy(() => import('./grade8/algo1/ModuleG8Algo1Flow').then((m) => ({ default: m.ModuleG8Algo1Flow })));
const ModuleG8Algo2Flow = lazy(() => import('./grade8/algo2/ModuleG8Algo2Flow').then((m) => ({ default: m.ModuleG8Algo2Flow })));
const ModuleG8Algo3Flow = lazy(() => import('./grade8/algo3/ModuleG8Algo3Flow').then((m) => ({ default: m.ModuleG8Algo3Flow })));
const ModuleG8Algo4Flow = lazy(() => import('./grade8/algo4/ModuleG8Algo4Flow').then((m) => ({ default: m.ModuleG8Algo4Flow })));
const ModuleG8Algo5Flow = lazy(() => import('./grade8/algo5/ModuleG8Algo5Flow').then((m) => ({ default: m.ModuleG8Algo5Flow })));
const ModuleG8Robot1Flow = lazy(() => import('./grade8/robot1/ModuleG8Robot1Flow').then((m) => ({ default: m.ModuleG8Robot1Flow })));
const ModuleG8Robot2Flow = lazy(() => import('./grade8/robot2/ModuleG8Robot2Flow').then((m) => ({ default: m.ModuleG8Robot2Flow })));

const FLOW_LEVEL_COMPONENTS: Partial<
  Record<AllMissionId, React.LazyExoticComponent<React.FC<FlowLevelComponentProps>>>
> = {
  internet1: Module3AFlow,
  internet2: Module3BFlow,
  text1: Module4AFlow,
  text2: Module4BFlow,
  algo1: Module5AFlow,
  algo2: Module5BFlow,
  scratch1: Module6AFlow,
  scratch2: Module6BFlow,
  g6_presentation1: ModuleG6P1Flow,
};

const FLOW_PAGE_COMPONENTS: Partial<
  Record<AllMissionId, React.LazyExoticComponent<React.FC<FlowPageComponentProps>>>
> = {
  // Grade 6
  g6_presentation2: ModuleG6P2Flow,
  g6_paint3d: ModuleG6Paint3DFlow,
  g6_anim3d: ModuleG6AnimVRFlow,
  g6_malware: ModuleG6M1Flow,
  g6_email: ModuleG6EmailFlow,
  g6_scratch1: ModuleG6ScratchAlgo1Flow,
  g6_scratch2: ModuleG6ScratchAlgo2Flow,
  // Grade 7
  g7_word_a: ModuleG7Word1Flow,
  g7_word_b: ModuleG7Word2Flow,
  g7_audio_a: ModuleG7Audio1Flow,
  g7_video_b: ModuleG7Video1Flow,
  g7_cloud_a: ModuleG7Cloud1Flow,
  g7_gis_b: ModuleG7Gis1Flow,
  g7_cpp_a: ModuleG7Cpp1Flow,
  g7_cpp_b: ModuleG7Cpp2Flow,
  g7_decision_a: ModuleG7DecisionFlow,
  g7_loop_b: ModuleG7LoopFlow,
  g7_stem_a: ModuleG7StemFlow,
  g7_robot_b: ModuleG7RobotFlow,
  // Grade 8
  g8_calc_a: ModuleG8Calc1Flow,
  g8_calc_b: ModuleG8Calc2Flow,
  g8_calc_c: ModuleG8Calc3Flow,
  g8_calc_d: ModuleG8Calc4Flow,
  g8_web_a: ModuleG8Web1Flow,
  g8_web_b: ModuleG8Web2Flow,
  g8_web_c: ModuleG8Web3Flow,
  g8_algo_a: ModuleG8Algo1Flow,
  g8_algo_b: ModuleG8Algo2Flow,
  g8_algo_c: ModuleG8Algo3Flow,
  g8_algo_d: ModuleG8Algo4Flow,
  g8_algo_e: ModuleG8Algo5Flow,
  g8_robot_a: ModuleG8Robot1Flow,
  g8_robot_b: ModuleG8Robot2Flow,
};

interface MissionStageProps {
  missionId: AllMissionId;
  currentLevel: number;
  currentScore: number;
  maxScore: number;
  elapsedSeconds: number;
  studentName: string;
  onCompleteLevel: (missionId: AllMissionId, levelIndex: number, earnedScore?: number) => void;
  onResetMission: (missionId: AllMissionId) => void;
  onBackToCatalog: () => void;
}

export const MissionStage: React.FC<MissionStageProps> = ({
  missionId,
  currentLevel,
  currentScore,
  maxScore,
  elapsedSeconds,
  studentName,
  onCompleteLevel,
  onResetMission,
  onBackToCatalog,
}) => {
  const { lang } = useLanguage();
  const meta = MISSION_META_BY_ID[missionId];
  const maxPlayable = meta?.maxLevels ?? 7;
  const missionTitle = meta ? (lang === 'en' ? meta.titleEn : meta.titleRo) : missionId;
  const missionContextLabel = meta
    ? `${meta.emoji} ${lang === 'en' ? meta.gradeLabelEn : meta.gradeLabelRo} · ${missionTitle} (${lang === 'en' ? 'Level' : 'Nivel'} ${currentLevel})`
    : undefined;

  const renderVictory = () => (
    <VictoryScreen
      score={currentScore}
      maxScore={maxScore}
      studentName={studentName}
      elapsedSeconds={elapsedSeconds}
      courseId={missionId}
      onReset={() => onResetMission(missionId)}
      onBackToCatalog={onBackToCatalog}
    />
  );

  const renderMissionBody = () => {
    if (missionId === 'hardware') {
      return (
        <div className="flex-1">
          {currentLevel === 1 && <HLevel1_ErgonomyRules onComplete={() => onCompleteLevel('hardware', 1)} />}
          {currentLevel === 2 && <HLevel2_HistoryTimeline onComplete={() => onCompleteLevel('hardware', 2)} />}
          {currentLevel === 3 && <HLevel3_CentralUnitAssembly onComplete={() => onCompleteLevel('hardware', 3)} />}
          {currentLevel === 4 && <HLevel4_PeripheralsSort onComplete={() => onCompleteLevel('hardware', 4)} />}
          {currentLevel === 5 && <HLevel5_BitsQuiz onComplete={() => onCompleteLevel('hardware', 5)} />}
          {currentLevel >= 6 && renderVictory()}
        </div>
      );
    }

    if (missionId === 'files') {
      return (
        <div className="flex-1">
          {currentLevel === 1 && <FLevel1_OSInterface onComplete={() => onCompleteLevel('files', 1)} />}
          {currentLevel === 2 && <FLevel2_DataMemory onComplete={() => onCompleteLevel('files', 2)} />}
          {currentLevel === 3 && <Level1_Structure onComplete={() => onCompleteLevel('files', 3)} />}
          {currentLevel === 4 && <Level2_SelectionSearch onComplete={() => onCompleteLevel('files', 4)} />}
          {currentLevel === 5 && <Level3_MoveShortcuts onComplete={() => onCompleteLevel('files', 5)} />}
          {currentLevel === 6 && <Level4_CopyRenameProps onComplete={() => onCompleteLevel('files', 6)} />}
          {currentLevel === 7 && <Level5_RecycleBin onComplete={() => onCompleteLevel('files', 7)} />}
          {currentLevel >= 8 && renderVictory()}
        </div>
      );
    }

    const FlowLevelComp = FLOW_LEVEL_COMPONENTS[missionId];
    if (FlowLevelComp) {
      return (
        <div className="flex-1">
          {currentLevel <= maxPlayable ? (
            <FlowLevelComp
              currentLevel={currentLevel}
              onCompleteLevel={(lvlIdx, earned) => onCompleteLevel(missionId, lvlIdx, earned)}
            />
          ) : (
            renderVictory()
          )}
        </div>
      );
    }

    const FlowPageComp = FLOW_PAGE_COMPONENTS[missionId];
    if (FlowPageComp) {
      return (
        <div className="flex-1">
          {currentLevel <= maxPlayable ? (
            <FlowPageComp
              currentLevel={currentLevel}
              onCompletePage={(earned) => onCompleteLevel(missionId, currentLevel, earned)}
              studentName={studentName}
              onRestartMission={() => onResetMission(missionId)}
              onReturnToCatalog={onBackToCatalog}
            />
          ) : (
            renderVictory()
          )}
        </div>
      );
    }

    if (missionId.startsWith('g8_')) {
      return (
        <div className="flex-1">
          {currentLevel <= maxPlayable ? (
            <Grade8MissionFlow
              missionId={missionId}
              currentLevel={currentLevel}
              onCompletePage={(earned) => onCompleteLevel(missionId, currentLevel, earned)}
              studentName={studentName}
              onRestartMission={() => onResetMission(missionId)}
              onReturnToCatalog={onBackToCatalog}
            />
          ) : (
            renderVictory()
          )}
        </div>
      );
    }

    return renderVictory();
  };

  return (
    <>
      <ProgressBar currentLevel={currentLevel} courseId={missionId || 'files'} />
      <div className="print:hidden flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/75 border border-slate-800/90 text-xs">
        <div className="flex items-center gap-2 min-w-0 text-slate-300">
          {meta && (
            <span className="font-mono font-bold text-emerald-300 shrink-0">
              {meta.emoji} {meta.moduleCode}
            </span>
          )}
          <span className="truncate font-semibold text-slate-200">{missionTitle}</span>
        </div>
        <ReportIssueButton
          variant="mission"
          missionId={missionId}
          level={currentLevel}
          score={currentScore}
          contextLabel={missionContextLabel}
        />
      </div>
      {renderMissionBody()}
    </>
  );
};
