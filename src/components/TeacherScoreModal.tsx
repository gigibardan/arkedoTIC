import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Trophy, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  Gamepad2, 
  BookOpen, 
  Swords, 
  ShieldAlert, 
  Check, 
  Clock, 
  Cpu, 
  FolderTree, 
  Globe, 
  ShieldCheck, 
  Calculator,
  Sliders,
  Award
} from 'lucide-react';
import { StudentProfile, ArcadeScores, LessonsProgress, DuelStats } from '../types';
import { 
  updateStudentScoresByTeacher, 
  recalculateStudentXP, 
  applyCheatingPenalty, 
  awardTeacherBonusXP,
  resetStudentArcadeScores,
  resetStudentLessonProgress,
  computeTotalArcade
} from '../lib/studentAuthService';
import { sounds } from '../utils/audio';

interface TeacherScoreModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'ro' | 'en';
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
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states for Arcade
  const [arcadeScores, setArcadeScores] = useState<ArcadeScores>({
    typing: student.arcadeScores?.typing || 0,
    mouse: student.arcadeScores?.mouse || 0,
    game2048: student.arcadeScores?.game2048 || 0,
    pcbuilder: student.arcadeScores?.pcbuilder || 0,
    detective: student.arcadeScores?.detective || 0,
    files: student.arcadeScores?.files || 0,
    binary_factory: student.arcadeScores?.binary_factory || 0,
    maze: student.arcadeScores?.maze || 0,
    firewall: student.arcadeScores?.firewall || 0,
    rgb_pixel: student.arcadeScores?.rgb_pixel || 0,
    byte_slider: student.arcadeScores?.byte_slider || 0,
    file_drop: student.arcadeScores?.file_drop || 0,
    virus_sweeper: student.arcadeScores?.virus_sweeper || 0,
    cyber_dino: student.arcadeScores?.cyber_dino || 0,
    redstone_lab: student.arcadeScores?.redstone_lab || 0,
    voxel_architect: student.arcadeScores?.voxel_architect || 0,
    roblox_clicker: student.arcadeScores?.roblox_clicker || 0,
    totalArcade: student.arcadeScores?.totalArcade || 0
  });

  // Form states for Lessons
  const [lessonsProgress, setLessonsProgress] = useState<LessonsProgress>({
    hardware: {
      completed: student.lessonsProgress?.hardware?.completed || false,
      level: student.lessonsProgress?.hardware?.level || 1,
      score: student.lessonsProgress?.hardware?.score || 0,
      elapsedSeconds: student.lessonsProgress?.hardware?.elapsedSeconds || 0
    },
    files: {
      completed: student.lessonsProgress?.files?.completed || false,
      level: student.lessonsProgress?.files?.level || 1,
      score: student.lessonsProgress?.files?.score || 0,
      elapsedSeconds: student.lessonsProgress?.files?.elapsedSeconds || 0
    },
    internet1: {
      completed: student.lessonsProgress?.internet1?.completed || false,
      level: student.lessonsProgress?.internet1?.level || 1,
      score: student.lessonsProgress?.internet1?.score || 0,
      elapsedSeconds: student.lessonsProgress?.internet1?.elapsedSeconds || 0
    },
    internet2: {
      completed: student.lessonsProgress?.internet2?.completed || false,
      level: student.lessonsProgress?.internet2?.level || 1,
      score: student.lessonsProgress?.internet2?.score || 0,
      elapsedSeconds: student.lessonsProgress?.internet2?.elapsedSeconds || 0
    },
    totalLessonScore: student.lessonsProgress?.totalLessonScore || 0
  });

  // Form states for Duels
  const [duelStats, setDuelStats] = useState<DuelStats>({
    wins: student.duelStats?.wins || 0,
    losses: student.duelStats?.losses || 0,
    matchesPlayed: student.duelStats?.matchesPlayed || 0,
    duelPoints: student.duelStats?.duelPoints || 0,
    cyberSprintWins: student.duelStats?.cyberSprintWins || 0,
    speedCraftingWins: student.duelStats?.speedCraftingWins || 0,
    blockCodingWins: student.duelStats?.blockCodingWins || 0,
    quizBlitzWins: student.duelStats?.quizBlitzWins || 0,
    cyberShieldWins: student.duelStats?.cyberShieldWins || 0,
    pcRushWins: student.duelStats?.pcRushWins || 0
  });

  // Custom Total XP
  const [customXP, setCustomXP] = useState<number>(student.totalXP || 0);

  if (!isOpen) return null;

  const calculateArcadeTotal = (scores: Partial<ArcadeScores>) => {
    return computeTotalArcade(scores);
  };

  const handleArcadeChange = (key: keyof ArcadeScores, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setArcadeScores((prev) => {
      const updated = {
        ...prev,
        [key]: num
      };
      updated.totalArcade = calculateArcadeTotal(updated);
      return updated;
    });
  };

  const handleLessonChange = (
    mission: 'hardware' | 'files' | 'internet1' | 'internet2',
    field: 'completed' | 'score' | 'elapsedSeconds' | 'level',
    val: any
  ) => {
    setLessonsProgress((prev) => ({
      ...prev,
      [mission]: {
        ...prev[mission],
        [field]: val
      }
    }));
  };

  const handleSaveAll = async () => {
    if (!student.id) return;
    setSaving(true);
    setFeedbackMsg(null);

    const safeArcade: ArcadeScores = {
      ...arcadeScores,
      totalArcade: calculateArcadeTotal(arcadeScores)
    };

    const res = await updateStudentScoresByTeacher(student.id, {
      arcadeScores: safeArcade,
      lessonsProgress,
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

  const handleApplyPenalty = async (amount: number, reason: string) => {
    if (!student.id) return;
    if (!window.confirm(isEn ? `Apply penalty of -${amount} XP for "${reason}"?` : `Aplicați penalizarea de -${amount} XP pentru "${reason}"?`)) return;
    
    setSaving(true);
    const res = await applyCheatingPenalty(student.id, amount, reason);
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

  const ARCADE_GAMES_METADATA = [
    { key: 'roblox_clicker', name: isEn ? 'Roblox Blox Clicker (1v1)' : 'Roblox Blox Clicker Duel (1v1)', icon: '🟥', badge: isEn ? 'Roblox' : 'Roblox' },
    { key: 'voxel_architect', name: isEn ? 'Voxel Architect (Minecraft CS)' : 'Voxel Architect: Calculatoare Minecraft', icon: '🧱', badge: isEn ? 'Ultimate' : 'Complex' },
    { key: 'redstone_lab', name: isEn ? 'Redstone Logic Lab' : 'Circuite Redstone (Minecraft TIC)', icon: '⛏️', badge: isEn ? 'Minecraft' : 'Minecraft' },
    { key: 'cyber_dino', name: isEn ? 'Cyber Dino Rush' : 'Cyber Dino: Matrix Rush', icon: '🦖', badge: isEn ? 'New' : 'Nou' },
    { key: 'typing', name: isEn ? 'Typing Speed (WPM)' : 'Cursa de Tastare Rapidă (WPM)', icon: '⌨️' },
    { key: 'mouse', name: isEn ? 'Mouse Reflex Master v1' : 'Maestrul Mouse-ului v1', icon: '🖱️' },
    { key: 'mouse_v2', name: isEn ? 'Mouse Master Pro 2.0 (Clicker)' : 'Maestrul Mouse-ului 2.0 (Clicker)', icon: '⚡', badge: isEn ? 'PRO' : 'PRO' },
    { key: 'game2048', name: isEn ? '2048 Bitwise Edition' : '2048 Bitwise Edition', icon: '🔢' },
    { key: 'virus_sweeper', name: isEn ? 'Virus Sweeper (Mines)' : 'Căutătorul de Viruși', icon: '💣' },
    { key: 'file_drop', name: isEn ? 'File-Drop (Tetris)' : 'File-Drop (Tetris Extensii)', icon: '🧱' },
    { key: 'byte_slider', name: isEn ? 'Byte Slider (1024 KB)' : 'Byte Slider (Conversii)', icon: '📊' },
    { key: 'rgb_pixel', name: isEn ? 'RGB Pixel Synthesis' : 'Pixeli RGB & Culori Ecran', icon: '🎨' },
    { key: 'pcbuilder', name: isEn ? 'PC Builder Pro' : 'Asamblare PC Componente', icon: '🔧' },
    { key: 'detective', name: isEn ? 'Cyber Detective' : 'Detectivul de Amenințări', icon: '🕵️' },
    { key: 'files', name: isEn ? 'Folder Tree Architect' : 'Arbore de Foldere & Căi', icon: '📁' },
    { key: 'binary_factory', name: isEn ? 'Binary Factory (0/1)' : 'Fabrica Binară (0 & 1)', icon: '⚙️' },
    { key: 'maze', name: isEn ? 'Cyber Algorithm Maze' : 'Labirint Algoritmic', icon: '🌀' },
    { key: 'firewall', name: isEn ? 'Firewall Defense' : 'Apărare Firewall', icon: '🛡️' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg shadow-teal-500/20 shrink-0">
              {student.avatar || '🎓'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                  {isEn ? 'Student Score Inspector & Admin Control' : 'Panou Modificare & Verificare Scoruri Elev'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold border border-teal-500/30">
                  ID: {student.id?.slice(0, 8)}
                </span>
              </div>
              <h3 className="text-xl font-black text-white font-heading mt-0.5">
                {student.username}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300 font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{customXP} XP</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/30 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveSubTab('arcade');
              sounds.playClick();
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === 'arcade'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <span>{isEn ? '16 Arcade Games' : 'Mini-Jocuri Arcade (16)'}</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('lessons');
              sounds.playClick();
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === 'lessons'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{isEn ? 'Core Lessons (4)' : 'Lecții & Misiuni TIC'}</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('duels');
              sounds.playClick();
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === 'duels'
                ? 'border-rose-400 text-rose-300 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-400" />
            <span>{isEn ? '1v1 Duels' : 'Dueluri 1v1'}</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('anticheat');
              sounds.playClick();
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-mono transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === 'anticheat'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{isEn ? 'Anti-Cheat & Quick Actions' : 'Acțiuni Anti-Cheat & Penalizări'}</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {feedbackMsg && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
            }`}>
              {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* SUB-TAB 1: ARCADE GAMES SCORES */}
          {activeSubTab === 'arcade' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-indigo-400" />
                    <span>{isEn ? 'Individual Arcade Highscores' : 'Scoruri Individuale Mini-Jocuri Arcade'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn ? 'Modify any game score or reset suspicious/cheated results to 0.' : 'Modificați scorul oricărui joc sau resetați la 0 dacă a trișat.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(isEn 
                        ? `Reset ALL points (Arcade: 0, Lessons: 0, Duels: 0, XP: 0) for "${student.username}"?` 
                        : `Resetează COMPLET toate punctele (Arcade: 0, Lecții: 0, Duel: 0, XP: 0) pentru "${student.username}"?`)) {
                        setArcadeScores({
                          typing: 0,
                          mouse: 0,
                          game2048: 0,
                          pcbuilder: 0,
                          detective: 0,
                          files: 0,
                          binary_factory: 0,
                          maze: 0,
                          firewall: 0,
                          rgb_pixel: 0,
                          byte_slider: 0,
                          file_drop: 0,
                          virus_sweeper: 0,
                          cyber_dino: 0,
                          redstone_lab: 0,
                          voxel_architect: 0,
                          roblox_clicker: 0,
                          totalArcade: 0
                        });
                        setLessonsProgress({
                          hardware: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
                          files: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
                          internet1: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
                          internet2: { completed: false, level: 1, score: 0, elapsedSeconds: 0 },
                          totalLessonScore: 0
                        });
                        setDuelStats({
                          wins: 0,
                          losses: 0,
                          matchesPlayed: 0,
                          duelPoints: 0,
                          cyberSprintWins: 0,
                          speedCraftingWins: 0,
                          blockCodingWins: 0,
                          quizBlitzWins: 0,
                          cyberShieldWins: 0,
                          pcRushWins: 0
                        });
                        setCustomXP(0);
                        sounds.playClick();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-600 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    title={isEn ? 'Reset EVERYTHING to 0' : 'Setează absolut totul la 0'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reset ALL (0 XP)' : 'Resetează Tot la 0'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(isEn ? 'Reset all 17 arcade games for this student to 0?' : 'Resetați toate cele 17 mini-jocuri ale acestui elev la 0?')) {
                        setArcadeScores({
                          typing: 0,
                          mouse: 0,
                          game2048: 0,
                          pcbuilder: 0,
                          detective: 0,
                          files: 0,
                          binary_factory: 0,
                          maze: 0,
                          firewall: 0,
                          rgb_pixel: 0,
                          byte_slider: 0,
                          file_drop: 0,
                          virus_sweeper: 0,
                          cyber_dino: 0,
                          redstone_lab: 0,
                          voxel_architect: 0,
                          roblox_clicker: 0,
                          totalArcade: 0
                        });
                        const lessonPts = lessonsProgress.totalLessonScore || 0;
                        const duelPts = duelStats.duelPoints || 0;
                        setCustomXP(lessonPts + duelPts);
                        sounds.playClick();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reset Games Only' : 'Doar Jocurile (0)'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARCADE_GAMES_METADATA.map((game) => {
                  const key = game.key as keyof ArcadeScores;
                  const currentVal = arcadeScores[key] || 0;
                  const isSuspicious = (key === 'typing' && currentVal > 250) || (key === 'cyber_dino' && currentVal > 50000) || (key === 'game2048' && currentVal > 200000);

                  return (
                    <div 
                      key={game.key}
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
                            <span>{game.name}</span>
                            {game.badge && (
                              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-mono">
                                {game.badge}
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
                          className="w-24 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold text-right focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setArcadeScores((prev) => ({ ...prev, [key]: 0 }));
                            sounds.playClick();
                          }}
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

          {/* SUB-TAB 2: CORE LESSONS MISSIONS */}
          {activeSubTab === 'lessons' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Core Curriculum Lessons (Modules 1 - 3)' : 'Misiuni Teorie & Manual TIC (Modulele 1 - 3)'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn ? 'Adjust completion status, score points, and recorded reading duration.' : 'Modificați starea de finalizare, punctajul și timpul petrecut pe lecție.'}
                </p>
              </div>

              <div className="space-y-3">
                {/* Hardware */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isEn ? 'Unit 1: Hardware & System Architecture' : 'Unitatea 1: Arhitectura Sistemelor de Calcul'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isEn ? 'Manual pages 10-20 (Ergonomics, History, CPU, Peripherals, Bits)' : 'Manual pag. 10-20 (Ergonomie, Istorie, UC, Periferice, Biți)'}
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lessonsProgress.hardware.completed}
                        onChange={(e) => handleLessonChange('hardware', 'completed', e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-300">
                        {lessonsProgress.hardware.completed ? (isEn ? 'Completed ✅' : 'Finalizat ✅') : (isEn ? 'In progress ⏳' : 'În lucru ⏳')}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Score Points' : 'Puncte Scor'}</label>
                      <input
                        type="number"
                        value={lessonsProgress.hardware.score}
                        onChange={(e) => handleLessonChange('hardware', 'score', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Time (sec)' : 'Timp (secunde)'}</label>
                      <input
                        type="number"
                        value={lessonsProgress.hardware.elapsedSeconds}
                        onChange={(e) => handleLessonChange('hardware', 'elapsedSeconds', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Max Level (1-6)' : 'Nivel Max (1-6)'}</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={lessonsProgress.hardware.level}
                        onChange={(e) => handleLessonChange('hardware', 'level', parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Files */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FolderTree className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isEn ? 'Unit 2: Operating Systems & Files Tree' : 'Unitatea 2: Sistemul de Operare & Fișiere'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isEn ? 'Manual pages 22-30 (OS Interface, Memory, File Tree, Search, Trash)' : 'Manual pag. 22-30 (Interfață SO, RAM/ROM, Arbore foldere, Căutare, Coș)'}
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lessonsProgress.files.completed}
                        onChange={(e) => handleLessonChange('files', 'completed', e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-300">
                        {lessonsProgress.files.completed ? (isEn ? 'Completed ✅' : 'Finalizat ✅') : (isEn ? 'In progress ⏳' : 'În lucru ⏳')}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Score Points' : 'Puncte Scor'}</label>
                      <input
                        type="number"
                        value={lessonsProgress.files.score}
                        onChange={(e) => handleLessonChange('files', 'score', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Time (sec)' : 'Timp (secunde)'}</label>
                      <input
                        type="number"
                        value={lessonsProgress.files.elapsedSeconds}
                        onChange={(e) => handleLessonChange('files', 'elapsedSeconds', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Max Level (1-8)' : 'Nivel Max (1-8)'}</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={lessonsProgress.files.level}
                        onChange={(e) => handleLessonChange('files', 'level', parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Internet 3A */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isEn ? 'Unit 3A: Internet, World Wide Web & Browsers' : 'Unitatea 3A: Rețeaua Internet & Navigarea Web'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isEn ? 'Manual pages 32-36 (LAN/WAN, URL, DNS, HTTP/HTTPS, Router)' : 'Manual pag. 32-36 (LAN/WAN, Structură URL, DNS, HTTPS, Router)'}
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lessonsProgress.internet1.completed}
                        onChange={(e) => handleLessonChange('internet1', 'completed', e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-300">
                        {lessonsProgress.internet1.completed ? (isEn ? 'Completed ✅' : 'Finalizat ✅') : (isEn ? 'In progress ⏳' : 'În lucru ⏳')}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Score Points' : 'Puncte Scor'}</label>
                      <input
                        type="number"
                        value={lessonsProgress.internet1.score}
                        onChange={(e) => handleLessonChange('internet1', 'score', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Time (sec)' : 'Timp (secunde)'}</label>
                      <input
                        type="number"
                        value={lessonsProgress.internet1.elapsedSeconds}
                        onChange={(e) => handleLessonChange('internet1', 'elapsedSeconds', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Max Level (1-6)' : 'Nivel Max (1-6)'}</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={lessonsProgress.internet1.level}
                        onChange={(e) => handleLessonChange('internet1', 'level', parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Internet 3B */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-indigo-400" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isEn ? 'Unit 3B: Search, Netiquette, Email & Safety' : 'Unitatea 3B: Căutare, E-mail, Netichetă & Securitate'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isEn ? 'Manual pages 38-48 (Boolean search, CRAAP, Cc/Bcc, Passwords)' : 'Manual pag. 38-48 (Operatori booleeni, CRAAP, E-mail Cc/Bcc, Parole)'}
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lessonsProgress.internet2.completed}
                        onChange={(e) => handleLessonChange('internet2', 'completed', e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-300">
                        {lessonsProgress.internet2.completed ? (isEn ? 'Completed ✅' : 'Finalizat ✅') : (isEn ? 'In progress ⏳' : 'În lucru ⏳')}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Score Points' : 'Puncte Scor'}</label>
                      <input
                        type="number"
                        value={lessonsProgress.internet2.score}
                        onChange={(e) => handleLessonChange('internet2', 'score', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Time (sec)' : 'Timp (secunde)'}</label>
                      <input
                        type="number"
                        value={lessonsProgress.internet2.elapsedSeconds}
                        onChange={(e) => handleLessonChange('internet2', 'elapsedSeconds', parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">{isEn ? 'Max Level (1-6)' : 'Nivel Max (1-6)'}</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={lessonsProgress.internet2.level}
                        onChange={(e) => handleLessonChange('internet2', 'level', parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
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
                  {isEn ? 'Inspect and modify matches, victories, losses and duel ladder points.' : 'Verificați și editați meciurile, victoriile, înfrângerile și punctele de clasament duel.'}
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
                    className="w-full bg-slate-900 border border-emerald-500/40 px-3 py-2 rounded-xl text-emerald-300 font-mono font-bold text-base"
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
                    className="w-full bg-slate-900 border border-rose-500/40 px-3 py-2 rounded-xl text-rose-300 font-mono font-bold text-base"
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
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-slate-200 font-mono font-bold text-base"
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
                    className="w-full bg-slate-900 border border-amber-500/40 px-3 py-2 rounded-xl text-amber-300 font-mono font-bold text-base"
                  />
                </div>
              </div>

              {/* Per mode breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase font-mono">
                  {isEn ? 'Victories per Game Arena' : 'Victorii pe Tipuri de Duel'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">⚡ Cyber Sprint</span>
                    <input
                      type="number"
                      value={duelStats.cyberSprintWins || 0}
                      onChange={(e) => setDuelStats((p) => ({ ...p, cyberSprintWins: parseInt(e.target.value, 10) || 0 }))}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">⛏️ Speed Crafting</span>
                    <input
                      type="number"
                      value={duelStats.speedCraftingWins || 0}
                      onChange={(e) => setDuelStats((p) => ({ ...p, speedCraftingWins: parseInt(e.target.value, 10) || 0 }))}
                      className="w-full bg-slate-900 border border-amber-500/40 px-2 py-1 rounded-lg text-amber-300 font-mono text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">🧩 Cursa Algoritmilor</span>
                    <input
                      type="number"
                      value={duelStats.blockCodingWins || 0}
                      onChange={(e) => setDuelStats((p) => ({ ...p, blockCodingWins: parseInt(e.target.value, 10) || 0 }))}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">🧠 Quiz Blitz</span>
                    <input
                      type="number"
                      value={duelStats.quizBlitzWins || 0}
                      onChange={(e) => setDuelStats((p) => ({ ...p, quizBlitzWins: parseInt(e.target.value, 10) || 0 }))}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">🛡️ Cyber Shield</span>
                    <input
                      type="number"
                      value={duelStats.cyberShieldWins || 0}
                      onChange={(e) => setDuelStats((p) => ({ ...p, cyberShieldWins: parseInt(e.target.value, 10) || 0 }))}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">🔧 PC Rush</span>
                    <input
                      type="number"
                      value={duelStats.pcRushWins || 0}
                      onChange={(e) => setDuelStats((p) => ({ ...p, pcRushWins: parseInt(e.target.value, 10) || 0 }))}
                      className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-mono text-center"
                    />
                  </div>
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
                  <span>{isEn ? 'Anti-Cheating Tools & Teacher Actions' : 'Instrumente Corectare Trișare & Bonusuri Profesor'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn 
                    ? 'Penalize unfair play, award contest bonuses, or perform automated mathematical XP sync.' 
                    : 'Aplicați penalizări pentru trișat, acordați bonusuri pentru activitate sau recalculați XP-ul matematic.'}
                </p>
              </div>

              {/* Cheating Penalties */}
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

              {/* Teacher Awards */}
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

              {/* Recalculate and Direct Custom XP */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Direct XP Control & Auto-Recalculate' : 'Control Direct XP & Sincronizare Matematică'}</span>
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
                      className="bg-slate-900 border border-amber-500/50 px-3.5 py-2 rounded-xl text-amber-300 font-mono font-black text-lg w-40"
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
            {isEn ? 'Changes will immediately update Firestore and classroom leaderboards.' : 'Modificările se sincronizează instant în baza Firestore.'}
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
              <span>{saving ? (isEn ? 'Saving...' : 'Se salvează...') : (isEn ? 'Save All Changes' : 'Salvează Toate Modificările')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
