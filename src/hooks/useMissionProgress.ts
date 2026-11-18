import { useState, useEffect, useMemo, useCallback } from 'react';
import { AllMissionId, GameLevel } from '../types';
import { CARNET_MISSIONS, MISSION_META_BY_ID } from '../lib/carnetService';
import { getActiveStudent, updateActiveLessonProgress } from '../lib/studentAuthService';
import { useArky } from '../context/ArkyContext';
import { sounds } from '../utils/audio';
import { forceScrollToTop } from '../utils/scrollHelper';

export interface MissionRuntimeState {
  level: number;
  score: number;
  elapsedSeconds: number;
}

const HARDWARE_LEVEL_SCORES: Record<number, number> = {
  1: 20,
  2: 40,
  3: 60,
  4: 80,
  5: 100,
};

const FILES_LEVEL_SCORES: Record<number, number> = {
  1: 10,
  2: 25,
  3: 40,
  4: 55,
  5: 70,
  6: 85,
  7: 100,
};

function readInitialMissionStates(): Record<string, MissionRuntimeState> {
  const map: Record<string, MissionRuntimeState> = {};
  for (const m of CARNET_MISSIONS) {
    let level = 1;
    let score = 0;
    let elapsedSeconds = 0;
    try {
      const savedLevel = localStorage.getItem(`arkedo_${m.localPrefix}_level`);
      const savedScore = localStorage.getItem(`arkedo_${m.localPrefix}_score`);
      const savedElapsed = localStorage.getItem(`arkedo_${m.localPrefix}_elapsed`);
      if (savedLevel) level = Number(savedLevel) || 1;
      if (savedScore) score = Number(savedScore) || 0;
      if (savedElapsed) elapsedSeconds = Number(savedElapsed) || 0;
    } catch {
      // Ignore storage errors
    }
    map[m.id] = { level, score, elapsedSeconds };
  }
  return map;
}

function persistMissionRuntimeToStorage(missionId: string, state: MissionRuntimeState) {
  const meta = MISSION_META_BY_ID[missionId];
  if (!meta) return;
  try {
    localStorage.setItem(`arkedo_${meta.localPrefix}_level`, String(state.level));
    localStorage.setItem(`arkedo_${meta.localPrefix}_score`, String(state.score));
    localStorage.setItem(`arkedo_${meta.localPrefix}_elapsed`, String(state.elapsedSeconds));
  } catch {
    // Ignore storage errors
  }
}

export function useMissionProgress(isLessonView: boolean, isCatalogView: boolean) {
  const arky = useArky();

  const [missionStates, setMissionStates] = useState<Record<string, MissionRuntimeState>>(() =>
    readInitialMissionStates()
  );

  const [activeMission, setActiveMission] = useState<AllMissionId | null>(() => {
    try {
      const saved = localStorage.getItem('arkedo_active_mission');
      if (saved) {
        const isDone = localStorage.getItem(`arkedo_completed_${saved}`) === 'true';
        if (!isDone) return saved as AllMissionId;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const isMissionCompleted = useCallback(
    (mId: string): boolean => {
      try {
        if (localStorage.getItem(`arkedo_completed_${mId}`) === 'true') return true;
      } catch {
        // Ignore
      }

      const meta = MISSION_META_BY_ID[mId];
      const st = missionStates[mId];
      if (meta && st) {
        const victoryLevel = meta.maxLevels + 1;
        if (st.level >= victoryLevel || st.score >= 100) return true;
      }

      const activeStudent = getActiveStudent();
      if (activeStudent?.lessonsProgress && meta) {
        const lpRecord = activeStudent.lessonsProgress as unknown as Record<
          string,
          { completed?: boolean; score?: number } | undefined
        >;
        const cloudEntry = lpRecord[meta.lessonsKey];
        if (cloudEntry?.completed || (cloudEntry?.score || 0) >= 100) return true;
      }

      return false;
    },
    [missionStates]
  );

  const completedMissions = useMemo<Record<string, boolean>>(() => {
    const res: Record<string, boolean> = {};
    for (const m of CARNET_MISSIONS) {
      res[m.id] = isMissionCompleted(m.id);
    }
    return res;
  }, [isMissionCompleted]);

  // Persist arkedo_active_mission whenever activeMission or completion state updates
  useEffect(() => {
    try {
      if (activeMission && !isMissionCompleted(activeMission)) {
        localStorage.setItem('arkedo_active_mission', activeMission);
      } else {
        localStorage.removeItem('arkedo_active_mission');
      }
    } catch {
      // Ignore
    }
  }, [activeMission, isMissionCompleted]);

  // When returning to catalog, ensure completed missions do not linger as activeMission
  useEffect(() => {
    if (isCatalogView && activeMission && isMissionCompleted(activeMission)) {
      setActiveMission(null);
      try {
        localStorage.removeItem('arkedo_active_mission');
      } catch {
        // Ignore
      }
    }
  }, [isCatalogView, activeMission, isMissionCompleted]);

  const activeMeta = activeMission ? MISSION_META_BY_ID[activeMission] : undefined;
  const activeState: MissionRuntimeState = activeMission
    ? missionStates[activeMission] || { level: 1, score: 0, elapsedSeconds: 0 }
    : missionStates['files'] || { level: 1, score: 0, elapsedSeconds: 0 };

  const currentLevel = activeState.level as GameLevel;
  const currentScore = activeState.score;
  const currentElapsedSeconds = activeState.elapsedSeconds;
  const isOngoing = Boolean(activeMission && activeMeta && currentLevel <= activeMeta.maxLevels);

  // Automatically scroll to top when active level changes
  useEffect(() => {
    forceScrollToTop();
  }, [currentLevel, activeMission]);

  // 1-second stopwatch tick for active in-progress mission
  useEffect(() => {
    if (!isTimerRunning || !isLessonView || !activeMission || !isOngoing) return;
    const targetId = activeMission;
    const meta = MISSION_META_BY_ID[targetId];
    if (!meta) return;

    const interval = setInterval(() => {
      setMissionStates((prev) => {
        const cur = prev[targetId] || { level: 1, score: 0, elapsedSeconds: 0 };
        const nextElapsed = cur.elapsedSeconds + 1;
        try {
          localStorage.setItem(`arkedo_${meta.localPrefix}_elapsed`, String(nextElapsed));
        } catch {
          // Ignore
        }
        return {
          ...prev,
          [targetId]: {
            ...cur,
            elapsedSeconds: nextElapsed,
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isLessonView, activeMission, isOngoing]);

  const completeMissionLevel = useCallback(
    (missionId: AllMissionId, levelIndex: number, earnedScore?: number) => {
      const meta = MISSION_META_BY_ID[missionId];
      if (!meta) return;

      const maxPlayable = meta.maxLevels;
      const victoryLevel = maxPlayable + 1;
      const curState = missionStates[missionId] || { level: 1, score: 0, elapsedSeconds: 0 };

      let nextLevel = curState.level;
      let nextScore = curState.score;
      let finished = false;

      if (missionId === 'hardware') {
        if (levelIndex < 5) {
          nextScore = HARDWARE_LEVEL_SCORES[levelIndex] ?? Math.min(100, levelIndex * 20);
          nextLevel = levelIndex + 1;
        } else {
          nextScore = 100;
          nextLevel = 6;
          finished = true;
        }
      } else if (missionId === 'files') {
        if (levelIndex < 7) {
          nextScore = FILES_LEVEL_SCORES[levelIndex] ?? Math.min(100, levelIndex * 15);
          nextLevel = levelIndex + 1;
        } else {
          nextScore = 100;
          nextLevel = 8;
          finished = true;
        }
      } else {
        const rawEarned = typeof earnedScore === 'number' ? earnedScore : 100;
        if (levelIndex < maxPlayable) {
          nextScore = Math.min(100, Math.max(curState.score, rawEarned));
          nextLevel = levelIndex + 1;
        } else {
          nextScore =
            meta.gradeNum === 5
              ? Math.min(100, Math.max(curState.score, rawEarned))
              : Math.min(100, Math.max(0, rawEarned));
          nextLevel = victoryLevel;
          finished = true;
        }
      }

      const updated: MissionRuntimeState = {
        ...curState,
        level: nextLevel,
        score: nextScore,
      };

      setMissionStates((prev) => ({
        ...prev,
        [missionId]: updated,
      }));
      persistMissionRuntimeToStorage(missionId, updated);

      if (finished) {
        setIsTimerRunning(false);
        arky.triggerFinished();
        try {
          localStorage.setItem(`arkedo_completed_${missionId}`, 'true');
        } catch {
          // Ignore
        }
        updateActiveLessonProgress(
          meta.lessonsKey as Parameters<typeof updateActiveLessonProgress>[0],
          true,
          victoryLevel,
          nextScore,
          curState.elapsedSeconds
        );
      } else {
        arky.triggerSuccess();
      }
    },
    [missionStates, arky]
  );

  const resetMission = useCallback(
    (missionId: AllMissionId, smoothScroll = true) => {
      const meta = MISSION_META_BY_ID[missionId];
      if (!meta) return;

      sounds.playClick();
      const resetState: MissionRuntimeState = { level: 1, score: 0, elapsedSeconds: 0 };

      setMissionStates((prev) => ({
        ...prev,
        [missionId]: resetState,
      }));

      try {
        localStorage.removeItem(`arkedo_completed_${missionId}`);
        persistMissionRuntimeToStorage(missionId, resetState);
      } catch {
        // Ignore
      }

      setIsTimerRunning(true);
      arky.triggerIdle();
      if (smoothScroll && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [arky]
  );

  const resetActiveMission = useCallback(() => {
    if (!activeMission) {
      arky.triggerIdle();
      return;
    }
    resetMission(activeMission, true);
  }, [activeMission, resetMission, arky]);

  const startMission = useCallback(
    (missionId: AllMissionId) => {
      setActiveMission(missionId);
      setIsTimerRunning(true);
      sounds.playClick();
      arky.triggerIdle();
      forceScrollToTop();
    },
    [arky]
  );

  const clearCompletedActiveMission = useCallback(() => {
    if (activeMission && isMissionCompleted(activeMission)) {
      setActiveMission(null);
      try {
        localStorage.removeItem('arkedo_active_mission');
      } catch {
        // Ignore
      }
    }
  }, [activeMission, isMissionCompleted]);

  return {
    activeMission,
    activeMeta,
    currentLevel,
    currentScore,
    currentElapsedSeconds,
    isOngoing,
    completedMissions,
    isMissionCompleted,
    completeMissionLevel,
    resetMission,
    resetActiveMission,
    startMission,
    clearCompletedActiveMission,
    getMissionState: (id: AllMissionId): MissionRuntimeState =>
      missionStates[id] || { level: 1, score: 0, elapsedSeconds: 0 },
  };
}
