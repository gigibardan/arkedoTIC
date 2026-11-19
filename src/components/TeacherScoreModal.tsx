import React, { useMemo, useState } from 'react';
import {
  X,
  Save,
  Trophy,
  RotateCcw,
  AlertTriangle,
  Gamepad2,
  BookOpen,
  Swords,
  ShieldAlert,
  Check,
  Calculator,
  Award,
  GraduationCap
} from 'lucide-react';
import { StudentProfile, ArcadeScores, LessonsProgress, DuelStats } from '../types';
import {
  updateStudentScoresByTeacher,
  recalculateStudentXP,
  applyCheatingPenalty,
  awardTeacherBonusXP,
  computeTotalArcade,
  computeTotalLessons,
  DEFAULT_ARCADE_SCORES,
  DEFAULT_LESSONS_PROGRESS
} from '../lib/studentAuthService';
import { ARCADE_REGISTRY } from '../data/arcadeRegistry';
import { CARNET_MISSIONS, CarnetMissionMeta } from '../data/missionsRegistry';
import { sounds } from '../utils/audio';

interface TeacherScoreModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'ro' | 'en';
}

const DUEL_ARENA_FIELDS: Array<{
  key: keyof Omit<DuelStats, 'wins' | 'losses' | 'matchesPlayed' | 'duelPoints'>;
  label: string;
  highlight?: boolean;
}> = [
  { key: 'cyberSprintWins', label: '⚡ Cyber Sprint' },
  { key: 'speedCraftingWins', label: '⛏️ Speed Crafting', highlight: true },
  { key: 'blockCodingWins', label: '🧩 Cursa Algoritmilor' },
  { key: 'quizBlitzWins', label: '🧠 Quiz Blitz' },
  { key: 'cyberShieldWins', label: '🛡️ Cyber Shield' },
  { key: 'pcRushWins', label: '🔧 PC Rush' },
  { key: 'mouseDuelWins', label: '🖱️ Mouse Duel' },
  { key: 'hackerDefenseWins', label: '⚔️ Hacker vs Defender' },
  { key: 'cyberClashWins', label: '💥 Cyber Clash' },
  { key: 'systemSabotageWins', label: '🛠️ System Sabotage' },
  { key: 'fileDropAttackWins', label: '📥 File-Drop Attack' },
  { key: 'cyberBattleshipWins', label: '🚢 Cyber Battleship' },
];

function createEmptyDuelStats(): DuelStats {
  return {
    wins: 0,
    losses: 0,
    matchesPlayed: 0,
    duelPoints: 0,
    cyberSprintWins: 0,
    speedCraftingWins: 0,
    blockCodingWins: 0,
    quizBlitzWins: 0,
    cyberShieldWins: 0,
    pcRushWins: 0,
    mouseDuelWins: 0,
    hackerDefenseWins: 0,
    cyberClashWins: 0,
    systemSabotageWins: 0,
    fileDropAttackWins: 0,
    cyberBattleshipWins: 0,
  };
}

export const TeacherScoreModal: React.FC<TeacherScoreModalProps> = ({
  student,
  isOpen,
  onClose,
  onSuccess,
  lang
}) => {
  const isEn = lang === 'en';

  const [activeSubTab, setActiveSubTab] = useState<'arcade' | 'lessons' | 'duels' | 'anticheat'>('arcade');
  const [gradeFilter, setGradeFilter] = useState<'all' | 5 | 6 | 7 | 8>('all');
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  const [arcadeScores, setArcadeScores] = useState<ArcadeScores>(() => ({
    ...DEFAULT_ARCADE_SCORES,
    ...(student.arcadeScores || {}),
  }));

  const [lessonsProgress, setLessonsProgress] = useState<LessonsProgress>(() => ({
    ...DEFAULT_LESSONS_PROGRESS,
    ...(student.lessonsProgress || {}),
  }));

  const [duelStats, setDuelStats] = useState<DuelStats>(() => ({
    ...createEmptyDuelStats(),
    ...(student.duelStats || {}),
  }));

  const [customXP, setCustomXP] = useState<number>(student.totalXP || 0);

  const groupedMissions = useMemo(() => {
    const grades: Array<5 | 6 | 7 | 8> = gradeFilter === 'all' ? [5, 6, 7, 8] : [gradeFilter];
    return grades.map((g) => ({
      grade: g,
      items: CARNET_MISSIONS.filter((m) => m.gradeNum === g),
    }));
  }, [gradeFilter]);

  if (!isOpen) return null;

  const handleArcadeChange = (key: keyof ArcadeScores, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setArcadeScores((prev) => {
      const updated: ArcadeScores = { ...prev, [key]: num };
      updated.totalArcade = computeTotalArcade(updated);
      return updated;
    });
  };

  const handleResetSingleGame = (key: keyof Omit<ArcadeScores, 'totalArcade'>) => {
    setArcadeScores((prev) => {
      const updated: ArcadeScores = { ...prev, [key]: 0 };
      updated.totalArcade = computeTotalArcade(updated);
      return updated;
    });
    sounds.playClick();
  };

  const handleLessonChange = (
    mission: keyof Omit<LessonsProgress, 'totalLessonScore'>,
    field: 'completed' | 'score' | 'elapsedSeconds' | 'level',
    val: boolean | number
  ) => {
    setLessonsProgress((prev) => {
      const currentEntry = prev[mission] || { completed: false, level: 1, score: 0, elapsedSeconds: 0 };
      const updated = {
        ...prev,
        [mission]: {
          ...currentEntry,
          [field]: val
        }
      };
      updated.totalLessonScore = computeTotalLessons(updated);
      return updated;
    });
  };

  const handleSaveAll = async () => {
    if (!student.id) return;
    setSaving(true);
    setFeedbackMsg(null);

    const safeArcade: ArcadeScores = {
      ...arcadeScores,
      totalArcade: computeTotalArcade(arcadeScores)
    };

    const safeLessons: LessonsProgress = {
      ...lessonsProgress,
      totalLessonScore: computeTotalLessons(lessonsProgress)
    };

    const res = await updateStudentScoresByTeacher(student.id, {
      arcadeScores: safeArcade,
      lessonsProgress: safeLessons,
      duelStats,
      customXP: Math.max(0, customXP)
    });

    setSaving(false);
    if (res.success) {
      sounds.playCorrect();
      setFeedbackMsg({
        text: isEn ? 'Scores and XP updated successfully!' : 'Toate scorurile și punctajul XP au fost salvate!',
        type: 'success'
      });
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } else {
      sounds.playWrong();
      setFeedbackMsg({
        text: res.error || (isEn ? 'Failed to save scores' : 'Eroare la salvarea scorurilor'),
        type: 'error'
      });
    }
  };

  const handleRecalculateXP = async () => {
    if (!student.id) return;
    setSaving(true);
    const res = await recalculateStudentXP(student.id);
    setSaving(false);
    if (res.success) {
      setCustomXP(res.newTotalXP);
      sounds.playCorrect();
      setFeedbackMsg({
        text: isEn
          ? `XP recalculated from verified tasks: ${res.newTotalXP} XP`
          : `XP recalculat automat pe baza probelor reale: ${res.newTotalXP} XP`,
        type: 'success'
      });
      setTimeout(() => onSuccess(), 1000);
    }
  };

  const handleApplyPenalty = (amount: number, reason: string) => {
    if (!student.id) return;
    setConfirmDialog({
      title: isEn ? 'Confirm XP Penalty' : 'Confirmare Penalizare XP',
      message: isEn
        ? `Apply penalty of -${amount} XP for "${reason}"?`
        : `Aplicați penalizarea de -${amount} XP pentru "${reason}"?`,
      onConfirm: async () => {
        setConfirmDialog(null);
        setSaving(true);
        const res = await applyCheatingPenalty(student.id!, amount, reason);
        setSaving(false);
        if (res.success) {
          setCustomXP(res.newTotalXP);
          sounds.playClick();
          setFeedbackMsg({
            text: isEn ? `Penalty of -${amount} XP applied!` : `Penalizarea de -${amount} XP a fost aplicată cu succes!`,
            type: 'success'
          });
          setTimeout(() => onSuccess(), 1000);
        }
      }
    });
  };

  const handleAwardBonus = async (amount: number, reason: string) => {
    if (!student.id) return;
    setSaving(true);
    const res = await awardTeacherBonusXP(student.id, amount, reason);
    setSaving(false);
    if (res.success) {
      setCustomXP(res.newTotalXP);
      sounds.playCorrect();
      setFeedbackMsg({
        text: isEn ? `Bonus of +${amount} XP awarded!` : `Bonusul de +${amount} XP a fost acordat cu succes!`,
        type: 'success'
      });
      setTimeout(() => onSuccess(), 1000);
    }
  };

  const gradeSectionMeta: Record<5 | 6 | 7 | 8, { ro: string; en: string; border: string; accent: string }> = {
    5: {
      ro: 'Curriculum Clasa a V-a (10 Misiuni)',
      en: '5th Grade Curriculum (10 Missions)',
      border: 'border-slate-800',
      accent: 'text-emerald-400',
    },
    6: {
      ro: 'Curriculum Clasa a VI-a (8 Misiuni)',
      en: '6th Grade Curriculum (8 Missions)',
      border: 'border-cyan-500/30',
      accent: 'text-cyan-400',
    },
    7: {
      ro: 'Curriculum Clasa a VII-a (12 Misiuni)',
      en: '7th Grade Curriculum (12 Missions)',
      border: 'border-indigo-500/30',
      accent: 'text-indigo-400',
    },
    8: {
      ro: 'Curriculum Clasa a VIII-a • Manual Oficial (14 Misiuni)',
      en: '8th Grade Curriculum • Official Textbook (14 Missions)',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-400',
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg shadow-teal-500/20 shrink-0">
              {student.avatar || '🎓'}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                  {isEn ? 'Student Score Inspector & Admin Control' : 'Panou Modificare & Verificare Scoruri Elev'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold border border-teal-500/30">
                  ID: {student.id?.slice(0, 8)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  🏫 {student.schoolId || 'scoala_pilot_01'}
                </span>
              </div>
              <h3 className="text-xl font-black text-white font-heading mt-0.5 truncate">
                {student.username}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300 font-bold tabular-nums">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{customXP} XP</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? 'Close modal' : 'Închide fereastra'}
              className="min-w-[38px] min-h-[38px] p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="px-4 sm:px-5 pt-3 border-b border-slate-800 bg-slate-950/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('arcade');
              sounds.playClick();
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
              activeSubTab === 'arcade'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <span>{isEn ? `Arcade Games (${ARCADE_REGISTRY.length})` : `Mini-Jocuri Arcade (${ARCADE_REGISTRY.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('lessons');
              sounds.playClick();
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
              activeSubTab === 'lessons'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{isEn ? `Lessons & Missions (${CARNET_MISSIONS.length})` : `Lecții & Misiuni TIC (${CARNET_MISSIONS.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('duels');
              sounds.playClick();
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
              activeSubTab === 'duels'
                ? 'border-rose-400 text-rose-300 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-400" />
            <span>{isEn ? '1v1 Duels' : 'Dueluri 1v1'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('anticheat');
              sounds.playClick();
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
              activeSubTab === 'anticheat'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{isEn ? 'Anti-Cheat & Quick Actions' : 'Acțiuni Anti-Cheat & Penalizări'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {feedbackMsg && (
            <div
              className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
              }`}
            >
              {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* SUB-TAB 1: ARCADE GAMES SCORES */}
          {activeSubTab === 'arcade' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-indigo-400" />
                    <span>{isEn ? 'Individual Arcade Highscores' : 'Scoruri Individuale Mini-Jocuri Arcade'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn
                      ? 'Modify any game score or reset suspicious/cheated results to 0.'
                      : 'Modificați scorul oricărui joc sau resetați la 0 dacă a trișat.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDialog({
                        title: isEn ? 'Reset ALL Student Points' : 'Resetează Tot la 0',
                        message: isEn
                          ? `Reset ALL points (Arcade: 0, Lessons: 0, Duels: 0, XP: 0) for "${student.username}"?`
                          : `Resetează COMPLET toate punctele (Arcade: 0, Lecții: 0, Duel: 0, XP: 0) pentru "${student.username}"?`,
                        onConfirm: () => {
                          setConfirmDialog(null);
                          setArcadeScores({ ...DEFAULT_ARCADE_SCORES });
                          setLessonsProgress({ ...DEFAULT_LESSONS_PROGRESS });
                          setDuelStats(createEmptyDuelStats());
                          setCustomXP(0);
                          sounds.playClick();
                        }
                      });
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-600 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap"
                    title={isEn ? 'Reset EVERYTHING to 0' : 'Setează absolut totul la 0'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reset ALL (0 XP)' : 'Resetează Tot la 0'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDialog({
                        title: isEn ? 'Reset Arcade Games' : 'Resetează Jocurile la 0',
                        message: isEn
                          ? `Reset all ${ARCADE_REGISTRY.length} arcade games for this student to 0?`
                          : `Resetați toate cele ${ARCADE_REGISTRY.length} mini-jocuri ale acestui elev la 0?`,
                        onConfirm: () => {
                          setConfirmDialog(null);
                          setArcadeScores({ ...DEFAULT_ARCADE_SCORES });
                          const lessonPts = lessonsProgress.totalLessonScore || 0;
                          const duelPts = duelStats.duelPoints || 0;
                          setCustomXP(lessonPts + duelPts);
                          sounds.playClick();
                        }
                      });
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reset Games Only' : 'Doar Jocurile (0)'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARCADE_REGISTRY.map((game) => {
                  const key = game.scoreKey;
                  const currentVal = arcadeScores[key] || 0;
                  const isSuspicious =
                    game.suspiciousThreshold !== undefined && currentVal > game.suspiciousThreshold;
                  const badge = isEn ? game.badgeEn : game.badgeRo;

                  return (
                    <div
                      key={game.scoreKey}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isSuspicious
                          ? 'bg-rose-950/30 border-rose-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{game.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                            <span>{isEn ? game.teacherNameEn : game.teacherNameRo}</span>
                            {badge && (
                              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-mono">
                                {badge}
                              </span>
                            )}
                          </div>
                          {isSuspicious && (
                            <span className="text-[10px] text-rose-400 font-mono font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {isEn ? 'Suspicious score!' : 'Scor suspect!'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          value={currentVal}
                          onChange={(e) => handleArcadeChange(key, e.target.value)}
                          className="w-24 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold text-right tabular-nums focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleResetSingleGame(key)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                          title={isEn ? 'Reset to 0' : 'Setează la 0'}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: CORE LESSONS MISSIONS (ALL 44 DRIVEN BY CARNET_MISSIONS) */}
          {activeSubTab === 'lessons' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>{isEn ? 'Official Curriculum Missions Progress (Grades 5–8)' : 'Progres Lecții & Misiuni Curriculum (Clasele V–VIII)'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn
                      ? 'Adjust completion status, scores, and recorded reading time for any mission.'
                      : 'Ajustați starea de finalizare, punctajele și timpul înregistrat la orice misiune.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(['all', 5, 6, 7, 8] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGradeFilter(g);
                        sounds.playClick();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        gradeFilter === g
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {g === 'all' ? (isEn ? 'All (44)' : 'Toate (44)') : `Cls. ${g === 5 ? 'V' : g === 6 ? 'VI' : g === 7 ? 'VII' : 'VIII'}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {groupedMissions.map(({ grade, items }) => {
                  const cfg = gradeSectionMeta[grade];
                  return (
                    <div key={grade} className="space-y-3">
                      <div className="pt-3 border-t border-slate-700/80 flex items-center gap-2 text-xs font-black uppercase tracking-wider font-mono">
                        <GraduationCap className={`w-4 h-4 ${cfg.accent}`} />
                        <span className={cfg.accent}>{isEn ? cfg.en : cfg.ro}</span>
                      </div>

                      {items.map((mission: CarnetMissionMeta) => {
                        const entry = lessonsProgress[mission.lessonsKey] || {
                          completed: false,
                          level: 1,
                          score: 0,
                          elapsedSeconds: 0,
                        };
                        return (
                          <div
                            key={mission.id}
                            className={`p-4 rounded-2xl bg-slate-950/60 border ${cfg.border} space-y-3`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-xl shrink-0">{mission.emoji}</span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white">
                                    {mission.gradeLabelRo} • {mission.moduleCode}: {isEn ? mission.titleEn : mission.titleRo}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {isEn ? mission.unitEn : mission.unitRo}
                                  </div>
                                </div>
                              </div>

                              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                <input
                                  type="checkbox"
                                  checked={Boolean(entry.completed)}
                                  onChange={(e) => handleLessonChange(mission.lessonsKey, 'completed', e.target.checked)}
                                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-300">
                                  {entry.completed
                                    ? isEn ? 'Completed ✅' : 'Finalizat ✅'
                                    : isEn ? 'In progress ⏳' : 'În lucru ⏳'}
                                </span>
                              </label>
                            </div>

                            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                              <div>
                                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                                  {isEn ? 'Score (0-100)' : 'Punctaj (0-100)'}
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={entry.score || 0}
                                  onChange={(e) =>
                                    handleLessonChange(mission.lessonsKey, 'score', parseInt(e.target.value, 10) || 0)
                                  }
                                  className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold tabular-nums"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                                  {isEn ? 'Time (sec)' : 'Timp (secunde)'}
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={entry.elapsedSeconds || 0}
                                  onChange={(e) =>
                                    handleLessonChange(
                                      mission.lessonsKey,
                                      'elapsedSeconds',
                                      parseInt(e.target.value, 10) || 0
                                    )
                                  }
                                  className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold tabular-nums"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                                  {isEn ? `Level (1-${mission.maxLevels})` : `Nivel (1-${mission.maxLevels})`}
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max={mission.maxLevels + 1}
                                  value={entry.level || 1}
                                  onChange={(e) =>
                                    handleLessonChange(mission.lessonsKey, 'level', parseInt(e.target.value, 10) || 1)
                                  }
                                  className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold tabular-nums"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: 1V1 DUELS STATS */}
          {activeSubTab === 'duels' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Swords className="w-4 h-4 text-rose-400" />
                  <span>{isEn ? '1v1 Multiplayer Duel Statistics' : 'Statistici și Punctaje Duel 1v1'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn
                    ? 'Inspect and modify matches, victories, losses and duel ladder points.'
                    : 'Verificați și editați meciurile, victoriile, înfrângerile și punctele de clasament duel.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1 font-bold">
                    {isEn ? 'Victories (Wins)' : 'Victorii'}
                  </label>
                  <input
                    type="number"
                    value={duelStats.wins}
                    onChange={(e) => setDuelStats((p) => ({ ...p, wins: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-slate-900 border border-emerald-500/40 px-3 py-2 rounded-xl text-emerald-300 font-mono font-bold text-base tabular-nums"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1 font-bold">
                    {isEn ? 'Defeats (Losses)' : 'Înfrângeri'}
                  </label>
                  <input
                    type="number"
                    value={duelStats.losses}
                    onChange={(e) => setDuelStats((p) => ({ ...p, losses: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-slate-900 border border-rose-500/40 px-3 py-2 rounded-xl text-rose-300 font-mono font-bold text-base tabular-nums"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1 font-bold">
                    {isEn ? 'Total Matches' : 'Meciuri Jucate'}
                  </label>
                  <input
                    type="number"
                    value={duelStats.matchesPlayed}
                    onChange={(e) => setDuelStats((p) => ({ ...p, matchesPlayed: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-slate-200 font-mono font-bold text-base tabular-nums"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1 font-bold">
                    {isEn ? 'Duel Points' : 'Puncte Duel'}
                  </label>
                  <input
                    type="number"
                    value={duelStats.duelPoints}
                    onChange={(e) => setDuelStats((p) => ({ ...p, duelPoints: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-slate-900 border border-amber-500/40 px-3 py-2 rounded-xl text-amber-300 font-mono font-bold text-base tabular-nums"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase font-mono">
                  {isEn ? 'Victories per Game Arena' : 'Victorii pe Tipuri de Duel'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                  {DUEL_ARENA_FIELDS.map((arena) => (
                    <div key={arena.key}>
                      <span className="text-[10px] text-slate-400 block mb-1 truncate">{arena.label}</span>
                      <input
                        type="number"
                        value={duelStats[arena.key] || 0}
                        onChange={(e) =>
                          setDuelStats((p) => ({ ...p, [arena.key]: parseInt(e.target.value, 10) || 0 }))
                        }
                        className={`w-full bg-slate-900 border px-2 py-1 rounded-lg font-mono text-center tabular-nums ${
                          arena.highlight
                            ? 'border-amber-500/40 text-amber-300 font-bold'
                            : 'border-slate-700 text-white'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: ANTI-CHEAT & QUICK ACTIONS */}
          {activeSubTab === 'anticheat' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>
                    {isEn ? 'Anti-Cheating Tools & Teacher Actions' : 'Instrumente Corectare Trișare & Bonusuri Profesor'}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn
                    ? 'Penalize unfair play, award contest bonuses, or perform automated mathematical XP sync.'
                    : 'Aplicați penalizări pentru trișat, acordați bonusuri pentru activitate sau recalculați XP-ul matematic.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase font-mono">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>{isEn ? 'Penalize Cheating (Deduct XP)' : 'Penalizare Trișare (Scădere Punctaj XP)'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPenalty(100, 'Scoruri neverosimile / viteză anormală')}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800 text-xs font-bold transition cursor-pointer"
                  >
                    -100 XP (Avertisment)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPenalty(250, 'Utilizare script / trișare la tastare')}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800 text-xs font-bold transition cursor-pointer"
                  >
                    -250 XP (Trișare Moderată)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPenalty(500, 'Scor fraudulos repetat')}
                    className="px-3.5 py-2 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-700 text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    -500 XP (Penalizare Severă)
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase font-mono">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Teacher Merit Bonus (Add XP)' : 'Bonus de Merit Acordat de Profesor (+XP)'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAwardBonus(50, 'Răspuns excelent la oră')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-800 text-xs font-bold transition cursor-pointer"
                  >
                    +50 XP (Activitate la clasă)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAwardBonus(100, 'Câștigător concurs TIC')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-800 text-xs font-bold transition cursor-pointer"
                  >
                    +100 XP (Câștigător Concurs)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAwardBonus(250, 'Proiect special remarcabil')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-700 text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    +250 XP (Proiect de Notă 10)
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>
                    {isEn ? 'Direct XP Control & Auto-Recalculate' : 'Control Direct XP & Sincronizare Matematică'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1 font-bold">
                      {isEn ? 'Total XP Override:' : 'Scor XP Total Forțat:'}
                    </label>
                    <input
                      type="number"
                      value={customXP}
                      onChange={(e) => setCustomXP(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="bg-slate-900 border border-amber-500/50 px-3.5 py-2 rounded-xl text-amber-300 font-mono font-black text-lg w-40 tabular-nums"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRecalculateXP}
                    disabled={saving}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>{isEn ? 'Auto-Recalculate Verified XP' : 'Recalculează Automat XP Real'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            {isEn
              ? 'Changes will immediately update Firestore and classroom leaderboards.'
              : 'Modificările se sincronizează instant în baza Firestore.'}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Anulează'}
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving
                  ? isEn ? 'Saving...' : 'Se salvează...'
                  : isEn ? 'Save All Changes' : 'Salvează Toate Modificările'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* In-DOM Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black text-white font-heading">{confirmDialog.title}</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="min-h-[38px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Anulează'}
              </button>
              <button
                type="button"
                onClick={() => confirmDialog.onConfirm()}
                className="min-h-[38px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                {isEn ? 'Confirm' : 'Confirmă'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
