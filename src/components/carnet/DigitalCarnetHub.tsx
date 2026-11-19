import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Code2,
  Coins,
  Flame,
  Gamepad2,
  GraduationCap,
  HardDrive,
  History,
  LogIn,
  Printer,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Swords,
  Trophy,
  UserCheck,
  Clock,
  Play,
  RotateCcw,
  CalendarClock,
  KeyRound,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  AllMissionId,
  ArcadeScores,
  AssignmentTaskItem,
  ClassAssignment,
  DailyQuestState,
  DailyStreakInfo,
  School,
  StudentDiploma,
  StudentProfile,
} from '../../types';
import {
  claimDailyQuestReward,
  DEFAULT_ARCADE_SCORES,
  GameRecord,
  getActiveStudent,
  getByteCoins,
  getGameAllTimeRecords,
  getLocalClassGrade,
  getStoredDailyQuests,
  getStoredDailyStreak,
  getStudentDiplomas,
  recordDailyActivityAndStreak,
  refreshActiveStudentFromCloud,
  syncStudentBadges,
  updateStudentClassGrade,
} from '../../lib/studentAuthService';
import { getResultsByStudentName, StudentResult } from '../../lib/resultsService';
import { getSchoolById } from '../../lib/schoolService';
import { getCyberCityData } from '../../lib/cyberCityService';
import { calculateCityMetrics } from '../../lib/cyberCityCatalog';
import { SHOP_ITEMS } from '../../lib/shopCatalog';
import {
  ARCADE_CATALOG_ENTRIES,
  backfillMissingDiplomas,
  buildDailyQuestsDisplay,
  computeCarnetBadges,
  getAllMissionSnapshots,
  getSandboxSolvedCount,
  MissionProgressSnapshot,
} from '../../lib/carnetService';
import { computeGradeDetails } from '../../utils/pedagogicalGrading';
import {
  evaluateAssignmentForStudent,
  EvaluatedAssignmentStatus,
  getAssignmentsForStudent,
  getStoredStudentClassMeta,
  joinClassroomByCode,
} from '../../lib/classroomService';
import { SANDBOX_CHALLENGES } from '../../data/sandboxChallenges';
import { DiplomaPreviewModal } from './DiplomaPreviewModal';
import { CyberShopModal } from '../shop/CyberShopModal';
import { AuthModal } from '../AuthModal';
import { sounds } from '../../utils/audio';

interface DigitalCarnetHubProps {
  studentName: string;
  onStudentNameChange?: (name: string) => void;
  onBackToCatalog: () => void;
  onSelectMission: (missionId: AllMissionId) => void;
  onOpenArcade?: () => void;
  onOpenDuel?: () => void;
  onOpenCity?: () => void;
  onOpenSandbox?: (lang?: 'cpp' | 'python' | 'html', challengeId?: string) => void;
  onOpenEvaluare?: () => void;
  onOpenLiveQuiz?: () => void;
}

type CarnetTab = 'overview' | 'grades' | 'diplomas' | 'achievements';
type GradeFilter = 'all' | 5 | 6 | 7 | 8;
type StatusFilter = 'all' | 'completed' | 'in_progress' | 'not_started';

const CLASS_GRADE_OPTIONS = ['Clasa a V-a', 'Clasa a VI-a', 'Clasa a VII-a', 'Clasa a VIII-a'] as const;

export const DigitalCarnetHub: React.FC<DigitalCarnetHubProps> = ({
  studentName,
  onStudentNameChange,
  onBackToCatalog,
  onSelectMission,
  onOpenArcade,
  onOpenDuel,
  onOpenCity,
  onOpenSandbox,
  onOpenEvaluare,
  onOpenLiveQuiz,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [activeTab, setActiveTab] = useState<CarnetTab>('overview');
  const [profile, setProfile] = useState<StudentProfile | null>(() => getActiveStudent());
  const [classGrade, setClassGrade] = useState<string>(
    () => getActiveStudent()?.classGrade || getLocalClassGrade() || ''
  );
  const [school, setSchool] = useState<School | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [diplomasMap, setDiplomasMap] = useState<Record<string, StudentDiploma>>(() =>
    getStudentDiplomas()
  );
  const [arcadeRecords, setArcadeRecords] = useState<Record<string, GameRecord>>({});
  const [streak, setStreak] = useState<DailyStreakInfo>(() => getStoredDailyStreak());
  const [quests, setQuests] = useState<DailyQuestState>(() => getStoredDailyQuests());
  const [byteCoins, setByteCoins] = useState<number>(() => getByteCoins());
  const [sandboxSolvedCount, setSandboxSolvedCount] = useState<number>(() => getSandboxSolvedCount());
  const [classAssignments, setClassAssignments] = useState<ClassAssignment[]>([]);
  const [classCodeInput, setClassCodeInput] = useState<string>('');
  const [classJoinLoading, setClassJoinLoading] = useState<boolean>(false);
  const [classJoinFeedback, setClassJoinFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [editingClassCode, setEditingClassCode] = useState<boolean>(false);

  const [syncSource, setSyncSource] = useState<'cloud' | 'local'>(() =>
    getActiveStudent() ? 'cloud' : 'local'
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string>('');
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('');

  // Filters
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [diplomaGradeFilter, setDiplomaGradeFilter] = useState<string>('all');
  const [arcadeFilterMode, setArcadeFilterMode] = useState<'played' | 'all'>('played');

  // Modals
  const [previewDiploma, setPreviewDiploma] = useState<StudentDiploma | null>(null);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  const displayName = useMemo(() => {
    return (profile?.username || studentName || (isEn ? 'Digital Cadet' : 'Elev ArkyEdu')).trim();
  }, [profile?.username, studentName, isEn]);

  const currentAvatar = useMemo(() => {
    if (profile?.avatar) return profile.avatar;
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  }, [profile?.avatar]);

  const equippedTitleLabel = useMemo(() => {
    const titleId = profile?.equipped?.title;
    if (!titleId) return isEn ? 'Digital Cadet' : 'Cadet TIC';
    const item = SHOP_ITEMS.find((i) => i.id === titleId || i.previewAsset === titleId);
    if (!item) return isEn ? 'Digital Cadet' : 'Cadet TIC';
    return isEn ? item.nameEn : item.nameRo;
  }, [profile?.equipped?.title, isEn]);

  const loadCarnetData = useCallback(
    async (withCloudSync: boolean) => {
      setIsSyncing(true);
      try {
        const streakResult = await recordDailyActivityAndStreak({ markCarnetVisited: true });
        setStreak(streakResult.streak);
        setQuests(streakResult.quests);

        let activeProf = getActiveStudent();
        if (withCloudSync && activeProf) {
          const synced = await refreshActiveStudentFromCloud();
          activeProf = synced.profile;
          setSyncSource(synced.source);
          if (synced.error) {
            setSyncNotice(synced.error);
          } else {
            setSyncNotice('');
          }
        } else {
          setSyncSource(activeProf ? 'cloud' : 'local');
        }

        setProfile(activeProf);
        setClassGrade(activeProf?.classGrade || getLocalClassGrade() || '');
        setByteCoins(activeProf?.byteCoins ?? getByteCoins());
        setSandboxSolvedCount(getSandboxSolvedCount());

        const effectiveName = (activeProf?.username || studentName || '').trim();

        const [schoolInfo, fetchedResults, recordsMap, fetchedAssignments] = await Promise.all([
          activeProf?.schoolId ? getSchoolById(activeProf.schoolId) : Promise.resolve(null),
          effectiveName ? getResultsByStudentName(effectiveName) : Promise.resolve([]),
          getGameAllTimeRecords(),
          getAssignmentsForStudent(activeProf),
        ]);

        setSchool(schoolInfo);
        setResults(fetchedResults);
        setArcadeRecords(recordsMap);
        setClassAssignments(fetchedAssignments);

        const updatedDiplomas = await backfillMissingDiplomas(
          activeProf,
          fetchedResults,
          effectiveName
        );
        setDiplomasMap(updatedDiplomas);

        const snaps = getAllMissionSnapshots(activeProf);
        const completedSnaps = snaps.filter((s) => s.status === 'completed');
        const avgNota =
          completedSnaps.length > 0
            ? completedSnaps.reduce((acc, s) => acc + s.nota, 0) / completedSnaps.length
            : 0;
        const activeCity = activeProf?.cyberCity || getCyberCityData();
        const cityScore = calculateCityMetrics(activeCity.buildings || {}).cityScore;

        const computedBadges = computeCarnetBadges({
          snapshots: snaps,
          arcadeScores: activeProf?.arcadeScores || {},
          duelWins: activeProf?.duelStats?.wins || 0,
          cityScore,
          sandboxSolvedCount: getSandboxSolvedCount(),
          streakBest: streakResult.streak.best,
          diplomasCount: Object.keys(updatedDiplomas).length,
          averageNota: avgNota,
        });
        const unlockedIds = computedBadges.filter((b) => b.unlocked).map((b) => b.id);
        await syncStudentBadges(unlockedIds);
        setProfile(getActiveStudent());

        setLastSyncedAt(
          new Date().toLocaleTimeString(isEn ? 'en-GB' : 'ro-RO', {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      } finally {
        setIsSyncing(false);
      }
    },
    [studentName, isEn]
  );

  useEffect(() => {
    loadCarnetData(true);
  }, [loadCarnetData]);

  // Derived real data
  const snapshots = useMemo(() => getAllMissionSnapshots(profile), [profile]);

  const completedSnapshots = useMemo(
    () => snapshots.filter((s) => s.status === 'completed'),
    [snapshots]
  );

  const inProgressSnapshots = useMemo(
    () => snapshots.filter((s) => s.status === 'in_progress'),
    [snapshots]
  );

  const averageCatalogNota = useMemo(() => {
    if (completedSnapshots.length === 0) return 0;
    const sum = completedSnapshots.reduce((acc, s) => acc + s.nota, 0);
    return Number((sum / completedSnapshots.length).toFixed(2));
  }, [completedSnapshots]);

  const totalXP = useMemo(() => {
    if (profile?.totalXP) return profile.totalXP;
    const lessonXP = snapshots.reduce((acc, s) => acc + s.score, 0);
    const arcadeXP = profile?.arcadeScores?.totalArcade || 0;
    const duelXP = profile?.duelStats?.duelPoints || 0;
    return lessonXP + arcadeXP + duelXP;
  }, [profile, snapshots]);

  const activeCityData = useMemo(
    () => profile?.cyberCity || getCyberCityData(),
    [profile?.cyberCity]
  );

  const cityMetrics = useMemo(() => {
    return calculateCityMetrics(activeCityData.buildings || {});
  }, [activeCityData]);

  const cityBuildingsCount = useMemo(
    () => Object.keys(activeCityData.buildings || {}).length,
    [activeCityData]
  );

  const mergedArcadeScores = useMemo<ArcadeScores>(() => {
    const base: Record<string, number> = { ...DEFAULT_ARCADE_SCORES };
    if (profile?.arcadeScores) {
      for (const [k, v] of Object.entries(profile.arcadeScores)) {
        base[k] = Math.max(base[k] || 0, Number(v || 0));
      }
    }
    const localKeyMap: Partial<Record<keyof Omit<ArcadeScores, 'totalArcade'>, string>> = {
      typing: 'arkedo_highscore_typing',
      mouse: 'arkedo_highscore_mouse',
      mouse_v2: 'arkedo_highscore_mouse_v2',
      game2048: 'arkedo_highscore_2048',
      pcbuilder: 'arkedo_highscore_pcbuilder',
      detective: 'arkedo_highscore_cyber',
      files: 'arkedo_highscore_files',
      binary_factory: 'arkedo_highscore_binary_factory',
      maze: 'arkedo_highscore_maze',
      firewall: 'arkedo_highscore_firewall',
      rgb_pixel: 'arkedo_highscore_rgb_pixels',
      byte_slider: 'arkedo_highscore_byte_slider',
      file_drop: 'arkedo_highscore_file_drop',
      virus_sweeper: 'arkedo_highscore_virus_sweeper',
      cyber_dino: 'arkedo_highscore_cyber_dino',
      redstone_lab: 'arkedo_highscore_redstone_lab',
      voxel_architect: 'arkedo_highscore_voxel_architect',
      roblox_clicker: 'arkedo_highscore_roblox_clicker',
      page_craft: 'arkedo_highscore_page_craft',
      hacker_defense: 'arkedo_highscore_hacker_defense',
      cyber_snake: 'arkedo_highscore_cyber_snake',
      circuit_master: 'arkedo_highscore_circuit_master',
      cyber_invaders: 'arkedo_highscore_cyber_invaders',
      cyber_pacman: 'arkedo_highscore_cyber_pacman',
      cyber_arkanoid: 'arkedo_highscore_cyber_arkanoid',
      cyber_frogger: 'arkedo_highscore_cyber_frogger',
      cyber_sokoban: 'arkedo_highscore_cyber_sokoban',
      cyber_asteroids: 'arkedo_highscore_cyber_asteroids',
    };
    for (const [k, lsKey] of Object.entries(localKeyMap)) {
      if (!lsKey) continue;
      try {
        const val = Number(localStorage.getItem(lsKey) || 0);
        if (val > (base[k] || 0)) base[k] = val;
      } catch {}
    }
    return base as unknown as ArcadeScores;
  }, [profile?.arcadeScores]);

  const diplomasList = useMemo(() => {
    return (Object.values(diplomasMap) as StudentDiploma[]).sort((a, b) =>
      (b.awardedAt || '').localeCompare(a.awardedAt || '')
    );
  }, [diplomasMap]);

  const badgesList = useMemo(
    () =>
      computeCarnetBadges({
        snapshots,
        arcadeScores: mergedArcadeScores,
        duelWins: profile?.duelStats?.wins || 0,
        cityScore: cityMetrics.cityScore,
        sandboxSolvedCount,
        streakBest: streak.best,
        diplomasCount: diplomasList.length,
        averageNota: averageCatalogNota,
      }),
    [
      snapshots,
      mergedArcadeScores,
      profile?.duelStats?.wins,
      cityMetrics.cityScore,
      sandboxSolvedCount,
      streak.best,
      diplomasList.length,
      averageCatalogNota,
    ]
  );

  const unlockedBadgesCount = badgesList.filter((b) => b.unlocked).length;

  const dailyQuestsList = useMemo(
    () => buildDailyQuestsDisplay(streak, quests),
    [streak, quests]
  );

  // Per-grade breakdown for Overview tab
  const gradeSummaries = useMemo(() => {
    const grades: Array<{
      gradeNum: 5 | 6 | 7 | 8;
      labelRo: string;
      labelEn: string;
      accent: string;
    }> = [
      { gradeNum: 5, labelRo: 'Clasa a V-a', labelEn: '5th Grade', accent: 'emerald' },
      { gradeNum: 6, labelRo: 'Clasa a VI-a', labelEn: '6th Grade', accent: 'cyan' },
      { gradeNum: 7, labelRo: 'Clasa a VII-a', labelEn: '7th Grade', accent: 'purple' },
      { gradeNum: 8, labelRo: 'Clasa a VIII-a', labelEn: '8th Grade', accent: 'amber' },
    ];
    return grades.map((g) => {
      const list = snapshots.filter((s) => s.meta.gradeNum === g.gradeNum);
      const done = list.filter((s) => s.status === 'completed');
      const avg =
        done.length > 0
          ? Number((done.reduce((acc, s) => acc + s.nota, 0) / done.length).toFixed(2))
          : 0;
      const pct = list.length > 0 ? Math.round((done.length / list.length) * 100) : 0;
      return {
        ...g,
        total: list.length,
        doneCount: done.length,
        inProgressCount: list.filter((s) => s.status === 'in_progress').length,
        avgNota: avg,
        pct,
      };
    });
  }, [snapshots]);

  // Last 7 days strip for Daily Streak calendar
  const last7DaysStrip = useMemo(() => {
    const activeSet = new Set(streak.activeDays || []);
    const days: Array<{ iso: string; shortLabel: string; isActive: boolean; isToday: boolean }> = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;
      const shortLabel = d.toLocaleDateString(isEn ? 'en-US' : 'ro-RO', { weekday: 'short' });
      days.push({
        iso,
        shortLabel: shortLabel.slice(0, 3),
        isActive: activeSet.has(iso) || (i === 0 && streak.lastActiveDate === iso),
        isToday: i === 0,
      });
    }
    return days;
  }, [streak, isEn]);

  // Filtered missions for Grades & Progress tab
  const filteredSnapshots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return snapshots.filter((snap) => {
      if (gradeFilter !== 'all' && snap.meta.gradeNum !== gradeFilter) return false;
      if (statusFilter !== 'all' && snap.status !== statusFilter) return false;
      if (q) {
        const hay = `${snap.meta.titleRo} ${snap.meta.titleEn} ${snap.meta.unitRo} ${snap.meta.unitEn} ${snap.meta.moduleCode}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [snapshots, gradeFilter, statusFilter, searchQuery]);

  // Filtered diplomas
  const filteredDiplomas = useMemo(() => {
    if (diplomaGradeFilter === 'all') return diplomasList;
    return diplomasList.filter((d) => d.grade === diplomaGradeFilter);
  }, [diplomasList, diplomaGradeFilter]);

  // Arcade stats
  const arcadeEntriesDisplay = useMemo(() => {
    const withScores = ARCADE_CATALOG_ENTRIES.map((entry) => {
      const myScore = Number((mergedArcadeScores as unknown as Record<string, number>)[entry.key] || 0);
      const recordKey =
        entry.key === 'game2048'
          ? arcadeRecords.game2048 || arcadeRecords['2048']
          : entry.key === 'detective'
          ? arcadeRecords.detective || arcadeRecords.cyber
          : entry.key === 'rgb_pixel'
          ? arcadeRecords.rgb_pixel || arcadeRecords.rgb_pixels
          : arcadeRecords[entry.key];
      return {
        ...entry,
        myScore,
        globalRecord: recordKey,
      };
    });
    if (arcadeFilterMode === 'played') {
      const played = withScores.filter((e) => e.myScore > 0);
      return played;
    }
    return withScores;
  }, [mergedArcadeScores, arcadeRecords, arcadeFilterMode]);

  const handleClassGradeChange = async (newGrade: string) => {
    sounds.playClick();
    setClassGrade(newGrade);
    await updateStudentClassGrade(newGrade);
    setProfile(getActiveStudent());
  };

  const handleClaimQuest = async (questId: string, rewardCoins: number) => {
    sounds.playCorrect();
    const res = await claimDailyQuestReward(questId, rewardCoins);
    setQuests(res.quests);
    setByteCoins(res.newCoins);
    setProfile(getActiveStudent());
  };

  const handleAuthSuccess = (loggedProfile: StudentProfile) => {
    setProfile(loggedProfile);
    if (onStudentNameChange && loggedProfile.username) {
      onStudentNameChange(loggedProfile.username);
    }
    loadCarnetData(true);
  };

  const studentClassMeta = useMemo(() => {
    if (profile?.classId && profile.classCode && profile.className) {
      return {
        classId: profile.classId,
        classCode: profile.classCode,
        className: profile.className,
      };
    }
    return getStoredStudentClassMeta();
  }, [profile]);

  const evaluatedAssignments = useMemo<EvaluatedAssignmentStatus[]>(() => {
    return classAssignments
      .filter((a) => a.status === 'active')
      .map((a) => evaluateAssignmentForStudent(a, profile, true));
  }, [classAssignments, profile]);

  const handleJoinClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClassJoinLoading(true);
    setClassJoinFeedback(null);
    try {
      const res = await joinClassroomByCode(classCodeInput, profile);
      if (!res.success || !res.classroom) {
        setClassJoinFeedback({
          type: 'err',
          msg: res.error || (isEn ? 'Invalid class code.' : 'Cod clasă invalid.'),
        });
        sounds.playWrong();
        return;
      }
      setClassJoinFeedback({
        type: 'ok',
        msg: isEn
          ? `Joined ${res.classroom.name} (${res.classroom.code})!`
          : `Te-ai alăturat clasei ${res.classroom.name} (${res.classroom.code})!`,
      });
      setClassCodeInput('');
      setEditingClassCode(false);
      sounds.playCorrect();
      await loadCarnetData(true);
    } finally {
      setClassJoinLoading(false);
    }
  };

  const handleSolveAssignmentTask = (task: AssignmentTaskItem) => {
    sounds.playClick();
    if (task.type === 'mission' && task.missionId) {
      onSelectMission(task.missionId);
      return;
    }
    if (task.type === 'sandbox' && task.challengeId && onOpenSandbox) {
      const ch = SANDBOX_CHALLENGES.find((c) => c.id === task.challengeId);
      onOpenSandbox(ch?.language || 'cpp', task.challengeId);
      return;
    }
    if (task.type === 'eval' && onOpenEvaluare) {
      onOpenEvaluare();
      return;
    }
    if (task.type === 'arcade' && onOpenArcade) {
      onOpenArcade();
    }
  };

  const formatDuration = (sec: number) => {
    if (!sec || sec <= 0) return '—';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleOpenGradeFilter = (g: 5 | 6 | 7 | 8) => {
    sounds.playClick();
    setGradeFilter(g);
    setStatusFilter('all');
    setActiveTab('grades');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb + Sync Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBackToCatalog();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs sm:text-sm font-bold transition cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{isEn ? 'Back to Curriculum' : 'Înapoi la Cursuri'}</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            {syncSource === 'cloud' ? (
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>
              {syncSource === 'cloud'
                ? isEn
                  ? 'Firestore Cloud Synced'
                  : 'Sincronizat Cloud'
                : isEn
                ? 'Local Browser Profile'
                : 'Profil Local Browser'}
            </span>
            {lastSyncedAt && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 tabular-nums">{lastSyncedAt}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              loadCarnetData(true);
            }}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-200 border border-teal-500/40 text-xs font-bold transition cursor-pointer disabled:opacity-60 min-h-[40px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? (isEn ? 'Syncing...' : 'Se sincronizează...') : isEn ? 'Sync Cloud' : 'Sincronizează'}</span>
          </button>
        </div>
      </div>

      {/* Guest / Local-only Warning Banner */}
      {!profile && (
        <div className="rounded-2xl bg-amber-950/30 border border-amber-500/35 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-amber-200 font-heading">
                {isEn
                  ? 'Viewing Local Portfolio (Not Signed In)'
                  : 'Vizualizezi Carnetul Local (Fără Cont Cloud)'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {isEn
                  ? 'Create a free student account or sign in so your grades, diplomas, ByteCoins, and streaks synchronize safely across phone, tablet, and school PC.'
                  : 'Autentifică-te sau creează un cont gratuit pentru a sincroniza notele, diplomele, ByteCoins și seria zilnică între telefon, tabletă și calculatorul de la școală.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setAuthInitialMode('login');
                setIsAuthOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer inline-flex items-center gap-1.5 min-h-[40px]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isEn ? 'Sign In / Sync' : 'Autentificare'}</span>
            </button>
          </div>
        </div>
      )}

      {syncNotice && (
        <div className="rounded-xl bg-rose-950/30 border border-rose-500/30 px-4 py-2.5 text-xs text-rose-200">
          {syncNotice}
        </div>
      )}

      {/* Hero Student Identity & KPI Header */}
      <section className="rounded-3xl bg-slate-950/90 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Student Identity */}
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shrink-0">
              {currentAvatar}
            </div>
            <div className="min-w-0 space-y-1.5">
              <div className="text-xs font-mono text-teal-300 font-bold uppercase tracking-wider flex items-center gap-2 flex-wrap">
                <span>{isEn ? 'Official Digital Portfolio' : 'Carnetul meu Digital ArkyEdu'}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-300">{equippedTitleLabel}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-heading truncate text-balance">
                {displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>
                    {school
                      ? `${school.name}${school.city ? ` · ${school.city}` : ''}`
                      : isEn
                      ? 'ArkyEdu Partner School'
                      : 'Școala Pilot ArkyEdu'}
                  </span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <label className="inline-flex items-center gap-1.5">
                  <span className="text-slate-400 font-semibold">
                    {isEn ? 'Class:' : 'Clasa:'}
                  </span>
                  <select
                    value={classGrade}
                    onChange={(e) => handleClassGradeChange(e.target.value)}
                    aria-label={isEn ? 'Select student class grade' : 'Selectează clasa elevului'}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-teal-400 cursor-pointer"
                  >
                    <option value="">{isEn ? 'Choose grade...' : 'Alege clasa...'}</option>
                    {CLASS_GRADE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsShopOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 text-xs font-bold transition cursor-pointer inline-flex items-center gap-2 min-h-[42px]"
            >
              <ShoppingBag className="w-4 h-4 text-purple-300" />
              <span>{isEn ? 'Cyber Shop' : 'Magazin Cyber'}</span>
            </button>

            {onOpenCity && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenCity();
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 text-xs font-bold transition cursor-pointer inline-flex items-center gap-2 min-h-[42px]"
              >
                <Building2 className="w-4 h-4 text-cyan-300" />
                <span>{isEn ? 'Cyber City' : 'Orașul Cyber'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800/90 tabular-nums">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold truncate">
                {isEn ? 'Catalog GPA' : 'Media Generală'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 font-heading">
                {averageCatalogNota > 0 ? averageCatalogNota.toFixed(2) : '—'}
                <span className="text-xs font-mono text-slate-400 ml-1">/10</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold truncate">
                {isEn ? 'Missions Done' : 'Misiuni Finalizate'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-heading">
                {completedSnapshots.length}
                <span className="text-xs font-mono text-slate-400 ml-1">/ {snapshots.length}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Star className="w-5 h-5 fill-amber-400/30" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold truncate">
                XP & ByteCoins
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-300 font-heading truncate">
                {totalXP.toLocaleString()} XP
              </div>
              <div className="text-[11px] font-mono text-purple-300 font-bold flex items-center gap-1">
                <Coins className="w-3 h-3" />
                <span>{byteCoins.toLocaleString()} Coins</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold truncate">
                {isEn ? 'Active Streak' : 'Serie Activă'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-orange-300 font-heading">
                {streak.current || 1} {streak.current === 1 ? (isEn ? 'day' : 'zi') : isEn ? 'days' : 'zile'}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {isEn ? 'Best:' : 'Record:'} {Math.max(streak.best, streak.current, 1)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div
        role="tablist"
        aria-label={isEn ? 'Portfolio Sections' : 'Secțiuni Carnet Digital'}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800"
      >
        {(
          [
            {
              id: 'overview',
              labelRo: 'Prezentare & Misiuni Zilnice',
              labelEn: 'Overview & Daily Quests',
              shortRo: 'Prezentare',
              shortEn: 'Overview',
              icon: CalendarCheck2,
            },
            {
              id: 'grades',
              labelRo: `Note & Progres (${completedSnapshots.length}/${snapshots.length})`,
              labelEn: `Grades & Progress (${completedSnapshots.length}/${snapshots.length})`,
              shortRo: `Note (${completedSnapshots.length})`,
              shortEn: `Grades (${completedSnapshots.length})`,
              icon: GraduationCap,
            },
            {
              id: 'diplomas',
              labelRo: `Diplome Oficiale (${diplomasList.length})`,
              labelEn: `Diplomas (${diplomasList.length})`,
              shortRo: `Diplome (${diplomasList.length})`,
              shortEn: `Diplomas (${diplomasList.length})`,
              icon: Award,
            },
            {
              id: 'achievements',
              labelRo: `Trofee & Arcade (${unlockedBadgesCount}/${badgesList.length})`,
              labelEn: `Badges & Arcade (${unlockedBadgesCount}/${badgesList.length})`,
              shortRo: `Trofee (${unlockedBadgesCount})`,
              shortEn: `Badges (${unlockedBadgesCount})`,
              icon: Trophy,
            },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline truncate">{isEn ? tab.labelEn : tab.labelRo}</span>
              <span className="lg:hidden truncate">{isEn ? tab.shortEn : tab.shortRo}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW & DAILY QUESTS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Classroom & Active Assignments Engine */}
          <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-teal-300 font-bold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isEn ? 'My Classroom & Active Homework' : 'Clasa Mea & Teme Active'}</span>
                </div>
                {studentClassMeta ? (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white font-bold">
                    <span>{studentClassMeta.className}</span>
                    <span className="text-xs font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                      {studentClassMeta.classCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingClassCode((prev) => !prev)}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer font-normal"
                    >
                      {editingClassCode ? (isEn ? 'Cancel' : 'Anulează') : isEn ? 'Change class' : 'Schimbă clasa'}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">
                    {isEn
                      ? 'Enter the classroom code from your ICT teacher to unlock assigned homework.'
                      : 'Introdu codul clasei primit de la profesor pentru a primi temele și fișele de lucru.'}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {onOpenLiveQuiz && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenLiveQuiz();
                    }}
                    className="px-3.5 py-2 min-h-[40px] rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/40 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Radio className="w-4 h-4 text-rose-400" />
                    <span>{isEn ? 'Join Live Quiz (PIN)' : 'Intră la Quiz Live (PIN)'}</span>
                  </button>
                )}
              </div>
            </div>

            {(!studentClassMeta || editingClassCode) && (
              <form onSubmit={handleJoinClassSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
                  placeholder={isEn ? 'Class code (e.g. TIC-7B-482)' : 'Cod clasă (ex: TIC-7B-482)'}
                  className="flex-1 min-h-[42px] bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono uppercase text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={classJoinLoading || classCodeInput.trim().length < 3}
                  className="px-4 py-2 min-h-[42px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer disabled:opacity-40 shrink-0"
                >
                  {classJoinLoading
                    ? isEn
                      ? 'Joining...'
                      : 'Se verifică...'
                    : isEn
                    ? 'Join Classroom'
                    : 'Alătură-te Clasei'}
                </button>
              </form>
            )}

            {classJoinFeedback && (
              <div
                className={`text-xs font-bold px-3 py-2 rounded-xl border ${
                  classJoinFeedback.type === 'ok'
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}
              >
                {classJoinFeedback.msg}
              </div>
            )}

            {evaluatedAssignments.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                {evaluatedAssignments.map((ev) => {
                  const dueLabel = (() => {
                    try {
                      return new Date(ev.assignment.dueDate).toLocaleDateString(isEn ? 'en-GB' : 'ro-RO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    } catch {
                      return ev.assignment.dueDate;
                    }
                  })();
                  return (
                    <div
                      key={ev.assignment.id}
                      className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-black text-white">{ev.assignment.title}</span>
                            {ev.isAllCompleted ? (
                              <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                                Finalizată ✓
                              </span>
                            ) : ev.isOverdue ? (
                              <span className="text-[11px] font-mono font-bold text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-lg">
                                Termen depășit
                              </span>
                            ) : (
                              <span className="text-[11px] font-mono text-cyan-300 inline-flex items-center gap-1">
                                <CalendarClock className="w-3.5 h-3.5" />
                                <span>Termen: {dueLabel}</span>
                              </span>
                            )}
                          </div>
                          {ev.assignment.description && (
                            <p className="text-xs text-slate-400 mt-0.5">{ev.assignment.description}</p>
                          )}
                        </div>
                        <div className="text-xs font-mono font-bold text-emerald-300 tabular-nums shrink-0">
                          {ev.completedCount}/{ev.totalCount} ({ev.percentage}%)
                        </div>
                      </div>

                      <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${Math.max(ev.percentage, ev.completedCount > 0 ? 6 : 0)}%` }}
                        />
                      </div>

                      <div className="space-y-2">
                        {ev.taskStatuses.map((ts) => (
                          <div
                            key={ts.task.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  ts.completed ? 'bg-emerald-400' : ts.inProgress ? 'bg-amber-400' : 'bg-slate-600'
                                }`}
                              />
                              <span className="font-bold text-slate-100 truncate">{ts.task.label}</span>
                              <span className="text-[11px] font-mono text-slate-400 shrink-0 tabular-nums">
                                ({ts.currentValueLabel})
                              </span>
                            </div>

                            {!ts.completed && (
                              <button
                                type="button"
                                onClick={() => handleSolveAssignmentTask(ts.task)}
                                className="px-3 py-1.5 min-h-[34px] rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black inline-flex items-center justify-center gap-1 cursor-pointer shrink-0"
                              >
                                <span>{isEn ? 'Solve Now' : 'Rezolvă acum'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Progress per Grade (V - VIII) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-black text-white font-heading">
                {isEn ? 'Curriculum Progress by Grade (V–VIII)' : 'Situația pe Clase (V–VIII)'}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {isEn ? 'Click a grade to inspect modules' : 'Apasă pe o clasă pentru note'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 tabular-nums">
              {gradeSummaries.map((g) => (
                <button
                  key={g.gradeNum}
                  type="button"
                  onClick={() => handleOpenGradeFilter(g.gradeNum)}
                  className="text-left p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/40 transition cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-black text-white font-heading group-hover:text-teal-300 transition">
                      {isEn ? g.labelEn : g.labelRo}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {g.doneCount}/{g.total}
                    </span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.max(g.pct, g.doneCount > 0 ? 6 : 0)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>
                      {isEn ? 'Avg:' : 'Medie:'}{' '}
                      <strong className="text-emerald-300">
                        {g.avgNota > 0 ? g.avgNota.toFixed(2) : '—'}
                      </strong>
                    </span>
                    <span>
                      {g.inProgressCount > 0
                        ? `${g.inProgressCount} ${isEn ? 'in progress' : 'în curs'}`
                        : `${g.pct}%`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Daily Streak + Daily Quests Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Streak 7-day strip */}
            <section className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white font-heading flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{isEn ? '7-Day Activity Calendar' : 'Calendar Activitate (7 Zile)'}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn
                      ? 'Learn a lesson or play Arcade daily to grow your streak.'
                      : 'Intră zilnic la o lecție sau în Arcade pentru a-ți crește seria.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {last7DaysStrip.map((day) => (
                  <div
                    key={day.iso}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-center ${
                      day.isActive
                        ? 'bg-orange-500/15 border-orange-500/40 text-orange-200'
                        : 'bg-slate-950/80 border-slate-800 text-slate-500'
                    } ${day.isToday ? 'ring-1 ring-emerald-400/50' : ''}`}
                  >
                    <span className="text-[10px] font-mono uppercase font-bold">
                      {day.shortLabel}
                    </span>
                    <span className="text-base mt-1" aria-hidden="true">
                      {day.isActive ? '🔥' : '·'}
                    </span>
                  </div>
                ))}
              </div>

              {inProgressSnapshots.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-cyan-300 font-bold uppercase">
                    {isEn ? 'Resume Next Mission' : 'Continuă de unde ai rămas'}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate">
                        {inProgressSnapshots[0].meta.emoji}{' '}
                        {isEn
                          ? inProgressSnapshots[0].meta.titleEn
                          : inProgressSnapshots[0].meta.titleRo}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5 tabular-nums">
                        {isEn ? 'Level' : 'Nivel'} {inProgressSnapshots[0].level}/
                        {inProgressSnapshots[0].meta.maxLevels} · {inProgressSnapshots[0].score} pts
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onSelectMission(inProgressSnapshots[0].meta.id);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer shrink-0 inline-flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Resume' : 'Continuă'}</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Daily Quests */}
            <section className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-black text-white font-heading flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isEn ? "Today's ByteCoins Quests" : 'Misiunile Zilei (+ByteCoins)'}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn
                      ? 'Complete daily tasks to earn ByteCoins for Cyber Shop & Cyber City.'
                      : 'Completează obiectivele zilnice și revendică ByteCoins pentru Magazin și Oraș.'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {dailyQuestsList.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl shrink-0" aria-hidden="true">
                        {q.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white">
                          {isEn ? q.titleEn : q.titleRo}
                        </div>
                        <div className="text-xs text-slate-400">
                          {isEn ? q.descEn : q.descRo}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                      <span className="text-xs font-mono font-bold text-purple-300 tabular-nums">
                        +{q.rewardCoins} Coins
                      </span>
                      {q.claimed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Claimed' : 'Revendicat'}</span>
                        </span>
                      ) : q.completed ? (
                        <button
                          type="button"
                          onClick={() => handleClaimQuest(q.id, q.rewardCoins)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer min-h-[36px]"
                        >
                          {isEn ? 'Claim Reward' : 'Revendică'}
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs font-semibold">
                          {isEn ? 'In progress' : 'În așteptare'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Quick Platform Shortcuts */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {onOpenEvaluare ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenEvaluare();
                }}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition cursor-pointer space-y-1"
              >
                <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                <div className="text-sm font-black text-white font-heading">
                  {isEn ? 'Quick Eval Simulator' : 'Simulare Test 1–10'}
                </div>
                <div className="text-xs text-slate-400">
                  {isEn ? 'Timed Grades 5–8 Quiz' : 'Test cronometrat V–VIII'}
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBackToCatalog();
                }}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition cursor-pointer space-y-1"
              >
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <div className="text-sm font-black text-white font-heading">
                  {isEn ? '44 Interactive Lessons' : '44 Lecții TIC'}
                </div>
                <div className="text-xs text-slate-400">
                  {isEn ? 'Grades 5–8 curriculum' : 'Catalog clasele V–VIII'}
                </div>
              </button>
            )}

            {onOpenSandbox && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenSandbox('cpp');
                }}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-left transition cursor-pointer space-y-1"
              >
                <Code2 className="w-5 h-5 text-teal-400" />
                <div className="text-sm font-black text-white font-heading">Code Sandbox</div>
                <div className="text-xs text-slate-400 tabular-nums">
                  {sandboxSolvedCount} {isEn ? 'challenges solved' : 'exerciții rezolvate'}
                </div>
              </button>
            )}

            {onOpenArcade && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenArcade();
                }}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-left transition cursor-pointer space-y-1"
              >
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
                <div className="text-sm font-black text-white font-heading">Arcade Lab</div>
                <div className="text-xs text-slate-400">
                  {isEn ? '28 educational games' : '28 mini-jocuri educative'}
                </div>
              </button>
            )}

            {onOpenDuel && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenDuel();
                }}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-left transition cursor-pointer space-y-1"
              >
                <Swords className="w-5 h-5 text-rose-400" />
                <div className="text-sm font-black text-white font-heading">Arena Duel 1v1</div>
                <div className="text-xs text-slate-400 tabular-nums">
                  {profile?.duelStats?.wins || 0} {isEn ? 'victories' : 'victorii'}
                </div>
              </button>
            )}
          </section>
        </div>
      )}

      {/* ================= TAB 2: GRADES & CURRICULUM PROGRESS ================= */}
      {activeTab === 'grades' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Grade filter buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { val: 'all', labelRo: 'Toate (44)', labelEn: 'All (44)' },
                    { val: 5, labelRo: 'Clasa V', labelEn: 'Grade 5' },
                    { val: 6, labelRo: 'Clasa VI', labelEn: 'Grade 6' },
                    { val: 7, labelRo: 'Clasa VII', labelEn: 'Grade 7' },
                    { val: 8, labelRo: 'Clasa VIII', labelEn: 'Grade 8' },
                  ] as const
                ).map((g) => (
                  <button
                    key={String(g.val)}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setGradeFilter(g.val);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[36px] ${
                      gradeFilter === g.val
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {isEn ? g.labelEn : g.labelRo}
                  </button>
                ))}
              </div>

              {/* Search & Status filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isEn ? 'Search module...' : 'Caută modul sau temă...'}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 min-h-[38px]"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  aria-label={isEn ? 'Filter by completion status' : 'Filtrează după stare'}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-teal-400 cursor-pointer min-h-[38px]"
                >
                  <option value="all">{isEn ? 'All statuses' : 'Toate stările'}</option>
                  <option value="completed">{isEn ? 'Completed' : 'Finalizate'}</option>
                  <option value="in_progress">{isEn ? 'In Progress' : 'În curs'}</option>
                  <option value="not_started">{isEn ? 'Not Started' : 'Neîncepute'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 44 Curriculum Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 tabular-nums">
            {filteredSnapshots.map((snap: MissionProgressSnapshot) => {
              const isDone = snap.status === 'completed';
              const isStarted = snap.status === 'in_progress';
              return (
                <div
                  key={snap.meta.id}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-900/95 border-emerald-500/35'
                      : isStarted
                      ? 'bg-slate-900/95 border-amber-500/35'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl shrink-0" aria-hidden="true">
                        {snap.meta.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                          <span className="text-teal-300 font-bold">
                            {isEn ? snap.meta.gradeLabelEn : snap.meta.gradeLabelRo}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{snap.meta.moduleCode}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">
                            {isEn ? snap.meta.unitEn : snap.meta.unitRo}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-white font-heading mt-0.5 leading-snug">
                          {isEn ? snap.meta.titleEn : snap.meta.titleRo}
                        </h3>
                      </div>
                    </div>

                    {/* Grade / Status Metric */}
                    <div className="text-right shrink-0">
                      {isDone ? (
                        <div>
                          <div className="text-lg font-black text-emerald-300 font-heading leading-none">
                            {isEn ? 'Grade' : 'Nota'} {snap.nota}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-1">
                            {snap.score}/{snap.meta.maxScore} pts
                          </div>
                        </div>
                      ) : isStarted ? (
                        <div>
                          <div className="text-xs font-black text-amber-300 font-mono">
                            {isEn ? 'In progress' : 'În curs'}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            Niv. {snap.level}/{snap.meta.maxLevels}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">
                          {isEn ? 'Not started' : 'Neînceput'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3 text-slate-400 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {formatDuration(snap.elapsedSeconds)}
                      </span>
                      {isDone && (
                        <span className="text-emerald-300 font-semibold">
                          {isEn ? snap.calificativEn : snap.calificativRo}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onSelectMission(snap.meta.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 min-h-[34px] ${
                        isDone
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : isStarted
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                          : 'bg-teal-600/20 hover:bg-teal-600/35 text-teal-200 border border-teal-500/40'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          <span>{isEn ? 'Practice Again' : 'Reia'}</span>
                        </>
                      ) : isStarted ? (
                        <>
                          <Play className="w-3 h-3" />
                          <span>{isEn ? 'Continue' : 'Continuă'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>{isEn ? 'Start' : 'Începe'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSnapshots.length === 0 && (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-sm text-slate-400">
              {isEn
                ? 'No curriculum modules match your current filters.'
                : 'Nicio misiune nu corespunde filtrelor selectate.'}
            </div>
          )}

          {/* Official Submitted Test History (rezultate_tic) */}
          <section className="rounded-2xl bg-slate-950/90 border border-slate-800 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-black text-white font-heading">
                  {isEn
                    ? 'Official Recorded Evaluations (Catalog Log)'
                    : 'Istoric Evaluări Trimise la Catalog'}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {results.length} {isEn ? 'entries' : 'înregistrări'}
              </span>
            </div>

            {results.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                {isEn
                  ? 'Completed mission scorecards submitted to your teacher appear here.'
                  : 'Evaluările oficiale trimise la finalul misiunilor în catalogul profesorului apar automat aici.'}
              </p>
            ) : (
              <>
                {/* Mobile Card List */}
                <div className="space-y-2.5 md:hidden tabular-nums">
                  {results.map((r, idx) => {
                    const gInfo = computeGradeDetails(r.score, r.maxScore || 100);
                    return (
                      <div
                        key={r.id || `${r.courseTitle}-${idx}`}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-black text-white leading-snug">
                            {r.courseTitle}
                          </div>
                          <span className="text-xs font-black text-emerald-300 shrink-0">
                            {isEn ? 'Grade' : 'Nota'} {gInfo.grade}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>
                            {r.score}/{r.maxScore || 100} pts · {formatDuration(r.elapsedSeconds)}
                          </span>
                          <span>{r.dateFormatted || '—'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto tabular-nums">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                        <th className="py-2.5 pr-4">{isEn ? 'Evaluation / Module' : 'Modul / Evaluare'}</th>
                        <th className="py-2.5 px-3">{isEn ? 'Score' : 'Scor'}</th>
                        <th className="py-2.5 px-3">{isEn ? 'Grade' : 'Notă'}</th>
                        <th className="py-2.5 px-3">{isEn ? 'Descriptor' : 'Calificativ'}</th>
                        <th className="py-2.5 px-3">{isEn ? 'Time' : 'Timp'}</th>
                        <th className="py-2.5 pl-3 text-right">{isEn ? 'Date' : 'Dată'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {results.map((r, idx) => {
                        const gInfo = computeGradeDetails(r.score, r.maxScore || 100);
                        return (
                          <tr key={r.id || `${r.courseTitle}-${idx}`} className="hover:bg-slate-900/60">
                            <td className="py-2.5 pr-4 font-bold text-slate-200">{r.courseTitle}</td>
                            <td className="py-2.5 px-3 font-mono text-amber-300 font-bold">
                              {r.score}/{r.maxScore || 100}
                            </td>
                            <td className="py-2.5 px-3 font-black text-emerald-300">
                              {gInfo.grade}/10
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {isEn ? gInfo.calificativEn : gInfo.calificativRo}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-400">
                              {formatDuration(r.elapsedSeconds)}
                            </td>
                            <td className="py-2.5 pl-3 text-right font-mono text-slate-400">
                              {r.dateFormatted || '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* ================= TAB 3: DIPLOMAS GALLERY ================= */}
      {activeTab === 'diplomas' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div>
              <h2 className="text-base font-black text-white font-heading">
                {isEn ? 'Earned Official Diplomas & Certificates' : 'Galerie Diplome Oficiale ArkyEdu'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn
                  ? 'Preview, update student name on diploma, and print or save as PDF.'
                  : 'Previzualizează diplomele obținute, editează numele afișat și printează sau salvează PDF.'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', ...CLASS_GRADE_OPTIONS] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDiplomaGradeFilter(g);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[36px] ${
                    diplomaGradeFilter === g
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {g === 'all' ? (isEn ? 'All' : 'Toate') : g.replace('Clasa a ', '')}
                </button>
              ))}
            </div>
          </div>

          {filteredDiplomas.length === 0 ? (
            <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-8 sm:p-12 text-center space-y-4">
              <div className="text-5xl" aria-hidden="true">
                🏅
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-black text-white font-heading">
                  {isEn ? 'No diplomas earned in this filter yet' : 'Încă nu ai obținut diplome aici'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {isEn
                    ? 'Complete any interactive mission from Grades 5–8 to automatically unlock your printable certificate.'
                    : 'Finalizează orice misiune interactivă din clasele V–VIII pentru a debloca automat diploma oficială imprimabilă.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBackToCatalog();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black transition cursor-pointer"
              >
                {isEn ? 'Explore Missions' : 'Vezi Misiunile din Catalog'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 tabular-nums">
              {filteredDiplomas.map((dip) => {
                const dateLabel = (() => {
                  try {
                    return new Date(dip.awardedAt).toLocaleDateString(
                      isEn ? 'en-GB' : 'ro-RO',
                      { day: '2-digit', month: 'short', year: 'numeric' }
                    );
                  } catch {
                    return dip.awardedAt;
                  }
                })();
                return (
                  <article
                    key={dip.id}
                    className="rounded-2xl bg-slate-900/95 border border-amber-500/30 p-5 flex flex-col justify-between gap-4 shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 font-bold">
                        <span>{dip.grade}</span>
                        <span className="text-slate-400">{dateLabel}</span>
                      </div>
                      <h3 className="text-base font-black text-white font-heading leading-snug">
                        {isEn ? dip.titleEn : dip.titleRo}
                      </h3>
                      <div className="text-xs text-slate-300">
                        {isEn ? 'Awarded to:' : 'Acordată elevului:'}{' '}
                        <strong className="text-emerald-300">{dip.studentName}</strong>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-300 font-bold">
                          {dip.score}/{dip.maxScore} pts
                        </span>
                        <span className="text-slate-400">{dip.officialRef || dip.calificativ}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setPreviewDiploma(dip);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer inline-flex items-center justify-center gap-2 min-h-[40px]"
                      >
                        <Printer className="w-4 h-4" />
                        <span>{isEn ? 'Preview & Print PDF' : 'Previzualizează & Printează'}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: BADGES, ARENA & ARCADE HIGHSCORES ================= */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* 12 Milestone Badges */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>
                  {isEn
                    ? `Milestone Badges (${unlockedBadgesCount}/${badgesList.length})`
                    : `Insigne & Realizări (${unlockedBadgesCount}/${badgesList.length})`}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 tabular-nums">
              {badgesList.map((badge) => {
                const pct = Math.min(100, Math.round((badge.current / badge.target) * 100));
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                      badge.unlocked
                        ? 'bg-slate-900/95 border-emerald-500/40 shadow-md'
                        : 'bg-slate-950/75 border-slate-800/90 opacity-85'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                          badge.unlocked
                            ? 'bg-emerald-500/15 border-emerald-500/40'
                            : 'bg-slate-900 border-slate-800 grayscale'
                        }`}
                      >
                        {badge.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-white font-heading truncate">
                            {isEn ? badge.titleEn : badge.titleRo}
                          </h3>
                          {badge.unlocked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                          {isEn ? badge.descEn : badge.descRo}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{badge.unlocked ? (isEn ? 'Unlocked' : 'Deblocată') : isEn ? 'Progress' : 'Progres'}</span>
                        <span className={badge.unlocked ? 'text-emerald-300 font-bold' : ''}>
                          {badge.current}/{badge.target}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            badge.unlocked ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Duel 1v1 + Cyber City + Code Sandbox Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 tabular-nums">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white font-heading flex items-center gap-2">
                  <Swords className="w-4 h-4 text-rose-400" />
                  <span>Arena Duel 1v1</span>
                </h3>
                {onOpenDuel && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenDuel();
                    }}
                    className="text-xs font-bold text-rose-300 hover:text-rose-200 cursor-pointer"
                  >
                    {isEn ? 'Play →' : 'Intră →'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-lg font-black text-emerald-300">
                    {profile?.duelStats?.wins || 0}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {isEn ? 'Wins' : 'Victorii'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-lg font-black text-slate-200">
                    {profile?.duelStats?.matchesPlayed || 0}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {isEn ? 'Matches' : 'Meciuri'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-lg font-black text-amber-300">
                    {profile?.duelStats?.duelPoints || 0}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">XP</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white font-heading flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>{isEn ? 'My Cyber City' : 'Orașul meu Cyber'}</span>
                </h3>
                {onOpenCity && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenCity();
                    }}
                    className="text-xs font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer"
                  >
                    {isEn ? 'Visit →' : 'Deschide →'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-lg font-black text-cyan-300">
                    {cityMetrics.cityScore.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {isEn ? 'Score' : 'Scor'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-lg font-black text-emerald-300">
                    {cityBuildingsCount}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {isEn ? 'Buildings' : 'Clădiri'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-lg font-black text-amber-300">
                    {cityMetrics.securityRating}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {isEn ? 'Security' : 'Securitate'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white font-heading flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-teal-400" />
                  <span>Code Sandbox</span>
                </h3>
                {onOpenSandbox && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenSandbox('cpp');
                    }}
                    className="text-xs font-bold text-teal-300 hover:text-teal-200 cursor-pointer"
                  >
                    {isEn ? 'Code →' : 'Deschide →'}
                  </button>
                )}
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  {isEn ? 'Solved coding challenges' : 'Provocări rezolvate (C++ / Python / HTML)'}
                </span>
                <strong className="text-lg font-black text-teal-300 font-heading">
                  {sandboxSolvedCount}
                </strong>
              </div>
            </div>
          </section>

          {/* Arcade Personal Highscores vs Global Records */}
          <section className="rounded-2xl bg-slate-950/90 border border-slate-800 p-5 space-y-4 tabular-nums">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white font-heading flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-indigo-400" />
                  <span>
                    {isEn ? 'Personal Arcade Highscores' : 'Recordurile Tale în Sala Arcade'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn
                    ? 'Compare your best score in each game with the ArkyEdu platform record.'
                    : 'Compară cel mai bun scor personal cu recordul absolut al platformei ArkyEdu.'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setArcadeFilterMode('played');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    arcadeFilterMode === 'played'
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isEn ? 'Played Games' : 'Jucate'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setArcadeFilterMode('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    arcadeFilterMode === 'all'
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isEn ? 'All 28 Games' : 'Toate 28'}
                </button>
              </div>
            </div>

            {arcadeEntriesDisplay.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 text-center space-y-3">
                <p className="text-xs sm:text-sm text-slate-300">
                  {isEn
                    ? 'You have not recorded any Arcade highscores yet. Play a quick educational game to set your first record!'
                    : 'Nu ai încă niciun scor înregistrat în Arcade. Încearcă un joc scurt pentru a-ți stabili primul record!'}
                </p>
                {onOpenArcade && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenArcade();
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-black transition cursor-pointer"
                  >
                    {isEn ? 'Open Arcade Lab' : 'Deschide Sala Arcade'}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {arcadeEntriesDisplay.map((game) => {
                  const rec = game.globalRecord;
                  const isRecordHolder =
                    game.myScore > 0 && rec && game.myScore >= rec.bestScore;
                  return (
                    <div
                      key={game.key}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0" aria-hidden="true">
                          {game.emoji}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-black text-white truncate">
                            {isEn ? game.nameEn : game.nameRo}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 truncate">
                            {rec && rec.bestScore > 0
                              ? `${isEn ? 'Platform record:' : 'Record:'} ${rec.bestScore.toLocaleString()} (${rec.holderName})`
                              : isEn
                              ? 'No global record yet'
                              : 'Fără record global încă'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-sm font-black font-heading ${
                            isRecordHolder
                              ? 'text-amber-300'
                              : game.myScore > 0
                              ? 'text-indigo-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {game.myScore > 0 ? game.myScore.toLocaleString() : '—'}
                        </div>
                        {game.unitLabel && game.myScore > 0 && (
                          <div className="text-[10px] font-mono text-slate-400">
                            {game.unitLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modals */}
      <DiplomaPreviewModal
        diploma={previewDiploma}
        schoolLabel={school?.name}
        onClose={() => setPreviewDiploma(null)}
        onDiplomaUpdated={(updated) => {
          setDiplomasMap((prev) => ({ ...prev, [updated.id]: updated }));
          setPreviewDiploma(updated);
        }}
      />

      <CyberShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        studentName={displayName}
        studentAvatar={currentAvatar}
        onCoinsUpdated={(newCoins) => {
          setByteCoins(newCoins);
          setProfile(getActiveStudent());
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />
    </div>
  );
};
