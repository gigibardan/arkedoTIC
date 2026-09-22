import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Users,
  Copy,
  Check,
  Play,
  RotateCcw,
  Trophy,
  Zap,
  Flame,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Award,
  Crown,
  Wifi,
  Keyboard,
  HelpCircle,
  Clock,
  LogOut,
  ArrowLeft,
  Volume2,
  ShieldCheck,
  ShieldX,
  Cpu,
  Mail,
  AlertTriangle,
  FileCode,
  HardDrive,
  CheckCircle2,
  XCircle,
  Wrench,
  CheckCheck,
  Puzzle,
  Boxes
} from 'lucide-react';
import {
  DuelGameMode,
  DuelRoomData,
  DuelPlayer,
  getDeviceId,
  createDuelRoom,
  joinDuelRoom,
  startDuelMatch,
  updateDuelProgress,
  setRoomPlaying,
  subscribeToDuelRoom,
  leaveDuelRoom,
  CyberShieldItem,
  PCRushPart,
  BlockCodingChallenge
} from '../lib/duelService';
import { BlockCodingDuelGame } from './minigames/BlockCodingDuelGame';
import { SpeedCraftingDuelGame } from './minigames/SpeedCraftingDuelGame';
import { RobloxClickerDuelGame } from './minigames/RobloxClickerDuelGame';
import { recordStudentDuelResult } from '../lib/studentAuthService';
import { isCloudConnected } from '../lib/firebase';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface DuelArenaProps {
  lang?: 'ro' | 'en';
  studentName?: string;
  studentAvatar?: string;
  currentStudentName?: string;
  currentStudentAvatar?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const DuelArena: React.FC<DuelArenaProps> = ({
  lang: propLang,
  studentName: propStudentName,
  studentAvatar: propStudentAvatar,
  currentStudentName,
  currentStudentAvatar,
  onAwardXP,
  onBack,
  onClose
}) => {
  const { lang: contextLang } = useLanguage();
  const lang = propLang || contextLang;

  const resolvedStudentName = (() => {
    if (propStudentName) return propStudentName;
    if (currentStudentName) return currentStudentName;
    try {
      return localStorage.getItem('arkedo_student_name') || '';
    } catch {
      return '';
    }
  })() || (lang === 'en' ? 'Cadet Player' : 'Campion TIC');

  const resolvedAvatar = (() => {
    if (propStudentAvatar) return propStudentAvatar;
    if (currentStudentAvatar) return currentStudentAvatar;
    try {
      return localStorage.getItem('arkedo_student_avatar') || '⚡';
    } catch {
      return '⚡';
    }
  })();

  const handleBack = onBack || onClose;
  // Navigation / Lobby States
  const [viewState, setViewState] = useState<'lobby' | 'room' | 'playing' | 'results'>('lobby');
  const [selectedMode, setSelectedMode] = useState<DuelGameMode>('cyber_sprint');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Active Room State
  const [currentRoom, setCurrentRoom] = useState<DuelRoomData | null>(null);
  const myDeviceId = getDeviceId();
  const isHost = currentRoom ? currentRoom.host.id === myDeviceId : false;
  const isGuest = currentRoom ? currentRoom.guest?.id === myDeviceId : false;

  // Local Gameplay States - Cyber Sprint
  const [typedInput, setTypedInput] = useState('');
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasFinishedLocal, setHasFinishedLocal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local Gameplay States - Quiz Blitz
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Local Gameplay States - Cyber Shield
  const [shieldIndex, setShieldIndex] = useState(0);
  const [shieldScore, setShieldScore] = useState(0);
  const [shieldStreak, setShieldStreak] = useState(0);
  const [shieldFeedback, setShieldFeedback] = useState<{ isCorrect: boolean; explanation: string; action: 'block' | 'allow' } | null>(null);

  // Local Gameplay States - Hardware PC Rush
  const [assembledParts, setAssembledParts] = useState<string[]>([]);
  const [pcScore, setPcScore] = useState(0);
  const [pcMistake, setPcMistake] = useState<string | null>(null);

  // Local Gameplay States - Block Coding Duel (Cursa Algoritmilor)
  const [codingLevelIndex, setCodingLevelIndex] = useState(0);
  const [codingScore, setCodingScore] = useState(0);

  // Countdown timer before match start
  const [countdown, setCountdown] = useState<number | null>(null);

  // Subscribe to Room updates
  useEffect(() => {
    if (!currentRoom?.roomCode) return;

    const unsubscribe = subscribeToDuelRoom(currentRoom.roomCode, (updated) => {
      if (!updated) {
        // Room was closed or deleted
        if (viewState !== 'lobby') {
          setErrorMessage(lang === 'en' ? 'The duel room has been closed.' : 'Camera de duel a fost închisă.');
          setViewState('lobby');
          setCurrentRoom(null);
        }
        return;
      }

      setCurrentRoom(updated);

      // Handle status transitions
      if (updated.status === 'countdown' && viewState === 'room') {
        setCountdown(3);
      } else if (updated.status === 'playing' && viewState !== 'playing' && viewState !== 'results') {
        setViewState('playing');
        setStartTime(Date.now());
        setTimeout(() => inputRef.current?.focus(), 150);
      } else if (updated.status === 'finished' && viewState === 'playing') {
        setViewState('results');
      }
    });

    return () => unsubscribe();
  }, [currentRoom?.roomCode, viewState, lang]);

  // Countdown tick logic
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      if (isHost && currentRoom?.roomCode) {
        setRoomPlaying(currentRoom.roomCode);
      }
    }
  }, [countdown, isHost, currentRoom?.roomCode]);

  // Handle Create Room
  const handleCreateRoom = async () => {
    sounds.playClick();
    setIsCreating(true);
    setErrorMessage(null);
    try {
      const room = await createDuelRoom(resolvedStudentName, resolvedAvatar, selectedMode);
      if (room) {
        setCurrentRoom(room);
        setViewState('room');
      } else {
        setErrorMessage(lang === 'en' ? 'Could not create room.' : 'Nu s-a putut crea camera.');
      }
    } catch (err) {
      setErrorMessage(lang === 'en' ? 'Connection error.' : 'Eroare de conexiune.');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Join Room
  const handleJoinRoom = async () => {
    sounds.playClick();
    if (!inputRoomCode.trim()) {
      setErrorMessage(lang === 'en' ? 'Please enter a 4-letter room code!' : 'Introdu codul camerei (ex: AB12)!');
      return;
    }
    setIsJoining(true);
    setErrorMessage(null);
    try {
      const res = await joinDuelRoom(inputRoomCode, resolvedStudentName, resolvedAvatar);
      if (res.success && res.room) {
        setCurrentRoom(res.room);
        setViewState('room');
      } else {
        setErrorMessage(res.error || (lang === 'en' ? 'Room not found.' : 'Camera nu a fost găsită.'));
      }
    } catch (err) {
      setErrorMessage(lang === 'en' ? 'Connection error.' : 'Eroare de conexiune.');
    } finally {
      setIsJoining(false);
    }
  };

  // Handle Copy Room Code
  const handleCopyCode = () => {
    if (currentRoom?.roomCode) {
      navigator.clipboard.writeText(currentRoom.roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Cyber Sprint Typing Logic
  const words = (currentRoom?.textSnippet || 'Securitate cibernetica si programare interactiva').split(' ');

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (viewState !== 'playing' || hasFinishedLocal || !currentRoom) return;

    const val = e.target.value;
    const targetWord = words[currentWordIdx] || '';

    // If user hit space or finished last word
    if (val.endsWith(' ') || (currentWordIdx === words.length - 1 && val === targetWord)) {
      const trimmed = val.trim();
      if (trimmed === targetWord) {
        sounds.playCorrect();
        const nextIdx = currentWordIdx + 1;
        setCurrentWordIdx(nextIdx);
        setTypedInput('');

        const progressPercent = Math.min(100, Math.round((nextIdx / words.length) * 100));
        const currentScore = nextIdx * 25;

        // Calculate real-time WPM
        if (startTime) {
          const minutes = (Date.now() - startTime) / 60000;
          if (minutes > 0) {
            setWpm(Math.round(nextIdx / minutes));
          }
        }

        if (nextIdx >= words.length) {
          // Finished the race!
          sounds.playVictory();
          setHasFinishedLocal(true);
          const finalScore = currentScore + 100;
          const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
          const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

          updateDuelProgress(
            currentRoom.roomCode,
            isHost,
            { progress: 100, score: finalScore, finishedAt: Date.now() },
            myId,
            myName
          );

          recordStudentDuelResult(true, 'cyber_sprint', finalScore);

          if (onAwardXP) {
            onAwardXP(200, 'Victorie în Duelul Cyber Sprint 1v1!');
          }
        } else {
          // Update live progress
          updateDuelProgress(currentRoom.roomCode, isHost, {
            progress: progressPercent,
            score: currentScore,
            currentWordIndex: nextIdx
          });
        }
        return;
      }
    }

    setTypedInput(val);
  };

  // Quiz Blitz Logic
  const currentQuestions = currentRoom?.questions || [];
  const currentQ = currentQuestions[currentQIndex];

  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedAnswer !== null || !currentQ || !currentRoom || hasFinishedLocal) return;

    setSelectedAnswer(optionIdx);
    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);

    const pointsEarned = isCorrect ? 100 + newStreak * 25 : 0;
    const newScore = quizScore + pointsEarned;
    setQuizScore(newScore);

    setTimeout(() => {
      setSelectedAnswer(null);
      const nextQIdx = currentQIndex + 1;
      const progressPercent = Math.min(100, Math.round((nextQIdx / currentQuestions.length) * 100));

      if (nextQIdx >= currentQuestions.length) {
        // Finished all questions
        sounds.playVictory();
        setHasFinishedLocal(true);
        const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
        const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

        updateDuelProgress(
          currentRoom.roomCode,
          isHost,
          { progress: 100, score: newScore, finishedAt: Date.now() },
          myId,
          myName
        );

        recordStudentDuelResult(true, 'quiz_blitz', newScore);

        if (onAwardXP) {
          onAwardXP(250, 'Campioni în Quiz Blitz 1v1 TIC!');
        }
      } else {
        setCurrentQIndex(nextQIdx);
        updateDuelProgress(currentRoom.roomCode, isHost, {
          progress: progressPercent,
          score: newScore,
          currentQuestionIndex: nextQIdx
        });
      }
    }, 900);
  };

  // Cyber Shield Logic (Phishing/Threats defense)
  const shieldItems: CyberShieldItem[] = currentRoom?.shieldItems || [];
  const currentShieldItem = shieldItems[shieldIndex];

  const handleShieldDecision = (action: 'block' | 'allow') => {
    if (!currentShieldItem || shieldFeedback !== null || hasFinishedLocal || !currentRoom) return;

    const isCorrect = (currentShieldItem.isThreat && action === 'block') || (!currentShieldItem.isThreat && action === 'allow');

    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    const newStreak = isCorrect ? shieldStreak + 1 : 0;
    setShieldStreak(newStreak);

    const pointsGained = isCorrect ? 150 + newStreak * 30 : 0;
    const newScore = shieldScore + pointsGained;
    setShieldScore(newScore);

    setShieldFeedback({
      isCorrect,
      explanation: currentShieldItem.explanation,
      action
    });

    setTimeout(() => {
      setShieldFeedback(null);
      const nextShieldIdx = shieldIndex + 1;
      const progressPercent = Math.min(100, Math.round((nextShieldIdx / shieldItems.length) * 100));

      if (nextShieldIdx >= shieldItems.length) {
        sounds.playVictory();
        setHasFinishedLocal(true);
        const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
        const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

        updateDuelProgress(
          currentRoom.roomCode,
          isHost,
          { progress: 100, score: newScore, finishedAt: Date.now() },
          myId,
          myName
        );

        recordStudentDuelResult(true, 'cyber_shield', newScore);

        if (onAwardXP) {
          onAwardXP(300, 'Scut Impenetrabil în Cyber Shield 1v1!');
        }
      } else {
        setShieldIndex(nextShieldIdx);
        updateDuelProgress(currentRoom.roomCode, isHost, {
          progress: progressPercent,
          score: newScore,
          currentStageIndex: nextShieldIdx
        });
      }
    }, 1100);
  };

  // Hardware PC Rush Logic (Sequential PC Building conveyor)
  const pcParts: PCRushPart[] = currentRoom?.pcPartsOrder || [];
  const expectedStep = assembledParts.length + 1;
  const currentExpectedPart = pcParts.find((p) => p.stepOrder === expectedStep);

  const handleAssemblePart = (part: PCRushPart) => {
    if (assembledParts.includes(part.id) || hasFinishedLocal || !currentRoom) return;

    if (part.stepOrder === expectedStep) {
      // Correct sequence
      sounds.playCorrect();
      setPcMistake(null);
      const updatedAssembled = [...assembledParts, part.id];
      setAssembledParts(updatedAssembled);

      const newScore = pcScore + 150;
      setPcScore(newScore);

      const progressPercent = Math.min(100, Math.round((updatedAssembled.length / pcParts.length) * 100));

      if (updatedAssembled.length >= pcParts.length) {
        // Assembled full computer!
        sounds.playVictory();
        setHasFinishedLocal(true);
        const finalScore = newScore + 100;
        const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
        const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

        updateDuelProgress(
          currentRoom.roomCode,
          isHost,
          { progress: 100, score: finalScore, finishedAt: Date.now() },
          myId,
          myName
        );

        recordStudentDuelResult(true, 'pc_rush', finalScore);

        if (onAwardXP) {
          onAwardXP(350, 'Asamblare PC Fulger în Hardware PC Rush 1v1!');
        }
      } else {
        updateDuelProgress(currentRoom.roomCode, isHost, {
          progress: progressPercent,
          score: newScore,
          currentStageIndex: updatedAssembled.length
        });
      }
    } else {
      // Mistake: Wrong assembly order!
      sounds.playWrong();
      setPcMistake(`Greșit! Înainte de "${part.name}", trebuie să montezi "${currentExpectedPart?.name}"!`);
      setTimeout(() => setPcMistake(null), 2000);
    }
  };

  // Block Coding Duel Handlers
  const codingChallenges: BlockCodingChallenge[] = currentRoom?.codingChallenges || [];

  const handleBlockCodingLevelComplete = (pointsEarned: number, nextLevelIndex: number) => {
    if (!currentRoom || hasFinishedLocal) return;
    const newScore = codingScore + pointsEarned;
    setCodingScore(newScore);
    setCodingLevelIndex(nextLevelIndex);
    const totalCount = codingChallenges.length || 4;
    const progressPercent = Math.min(100, Math.round((nextLevelIndex / totalCount) * 100));
    updateDuelProgress(currentRoom.roomCode, isHost, {
      progress: progressPercent,
      score: newScore,
      currentStageIndex: nextLevelIndex
    });
  };

  const handleBlockCodingFinish = (finalScore: number) => {
    if (!currentRoom || hasFinishedLocal) return;
    setHasFinishedLocal(true);
    setCodingScore(finalScore);
    const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
    const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

    updateDuelProgress(
      currentRoom.roomCode,
      isHost,
      { progress: 100, score: finalScore, finishedAt: Date.now() },
      myId,
      myName
    );

    recordStudentDuelResult(true, 'block_coding', finalScore);

    if (onAwardXP) {
      onAwardXP(350, 'Maestru în Cursa Algoritmilor 1v1 (Scratch)!');
    }
  };

  const handleSpeedCraftingFinish = () => {
    if (!currentRoom || hasFinishedLocal) return;
    setHasFinishedLocal(true);
    const finalScore = 500;
    const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
    const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

    updateDuelProgress(
      currentRoom.roomCode,
      isHost,
      { progress: 100, score: finalScore, finishedAt: Date.now() },
      myId,
      myName
    );

    recordStudentDuelResult(true, 'speed_crafting', finalScore);

    if (onAwardXP) {
      onAwardXP(400, 'Campion în Speed Crafting Duel 1v1 (Minecraft TIC)!');
    }
  };

  const handleRobloxClickerFinish = (finalScore: number) => {
    if (!currentRoom || hasFinishedLocal) return;
    setHasFinishedLocal(true);
    const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
    const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

    updateDuelProgress(
      currentRoom.roomCode,
      isHost,
      { progress: 100, score: finalScore, finishedAt: Date.now() },
      myId,
      myName
    );

    recordStudentDuelResult(true, 'roblox_clicker', finalScore);

    if (onAwardXP) {
      onAwardXP(500, 'Maestru în Roblox Cyber Blox Duel 1v1 (50k Blox)!');
    }
  };

  // Determine opponent and me
  const me: DuelPlayer | null = isHost ? currentRoom?.host || null : (currentRoom?.guest || null);
  const opponent: DuelPlayer | null = isHost ? currentRoom?.guest || null : (currentRoom?.host || null);

  const isMeWinner = currentRoom?.winnerId === me?.id;
  const isOpponentWinner = currentRoom?.winnerId === opponent?.id;

  const getModeTitle = (mode?: DuelGameMode) => {
    switch (mode) {
      case 'roblox_clicker':
        return '🟥 Roblox Blox Clicker (Simulator 1v1)';
      case 'cyber_sprint':
        return '⚡ Cyber Sprint (Cursă Tastare)';
      case 'block_coding':
        return '🧩 Cursa Algoritmilor (Block Coding Duel)';
      case 'speed_crafting':
        return '⛏️ Speed Crafting Duel (Minecraft TIC 1v1)';
      case 'quiz_blitz':
        return '🧠 Quiz Blitz (Bătălia Creierelor)';
      case 'cyber_shield':
        return '🛡️ Cyber Shield (Apărare Phishing)';
      case 'pc_rush':
        return '🔧 Hardware PC Rush (Asamblare)';
      default:
        return '⚔️ Duel 1v1 TIC';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 select-none font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 ring-2 ring-amber-400/30">
            <Swords className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight font-heading">
                {lang === 'en' ? 'ARKEDO DUEL ARENA 1v1' : 'ARENA DUELURILOR TIC 1v1'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-500/40 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'en'
                ? 'Challenge your classmate in real-time from different computers!'
                : 'Provoacă-ți colegul de bancă sau din laborator la duel de pe calculatoare diferite!'}
            </p>
          </div>
        </div>

        {handleBack && (
          <button
            onClick={() => {
              sounds.playClick();
              if (currentRoom?.roomCode) {
                leaveDuelRoom(currentRoom.roomCode, isHost);
              }
              handleBack();
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Back to Courses' : 'Înapoi la Cursuri'}</span>
          </button>
        )}
      </div>

      {/* VIEW 1: LOBBY (Create / Join) */}
      {viewState === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Game Mode Selection */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                {lang === 'en' ? '1. Select Duel Battle Mode:' : '1. Alege Tipul de Duel:'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mode 0: Roblox Blox Clicker Duel (Simulator 1v1) */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('roblox_clicker')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    selectedMode === 'roblox_clicker'
                      ? 'bg-gradient-to-br from-rose-950/90 via-purple-950/80 to-amber-950/60 border-amber-400 ring-2 ring-amber-500/40 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 text-slate-950 font-black flex items-center justify-center text-base shadow-md shadow-rose-500/30">
                      🧱
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>Roblox Blox Clicker 🟥</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono uppercase">HOT 🔥</span>
                      </h4>
                      <span className="text-[10px] text-amber-300 font-medium">Simulator Roblox 1v1 (Pets & Rebirths)</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dă click pe nucleul Blox, eclozează animăluțe legendare din ouă Gacha, cumpără hardware și atinge primul 50.000 Blox înaintea rivalului!
                  </p>
                </button>

                {/* Mode 1: Cyber Sprint */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('cyber_sprint')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    selectedMode === 'cyber_sprint'
                      ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/30 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Cyber Sprint ⚡</h4>
                      <span className="text-[10px] text-indigo-300 font-medium">Cursa de Tastare Rapidă</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cine tastează cel mai repede și corect termenii informatici fără greșeli! Rachetele înaintează live pe ecran.
                  </p>
                </button>

                {/* Mode 2: Speed Crafting Duel (Minecraft TIC 1v1) */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('speed_crafting')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    selectedMode === 'speed_crafting'
                      ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/30 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Speed Crafting ⛏️</h4>
                      <span className="text-[10px] text-amber-300 font-medium">Duel Rețete TIC & Binar (Minecraft 3x3)</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aranjează componentele pe masa de lucru 3x3 (CPU, RAM, SSD, cod binar, porți logice)! Primul la 5 diamante asamblate câștigă duelul!
                  </p>
                </button>

                {/* Mode 3: Cursa Algoritmilor (Block Coding Duel - Tip Scratch) */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('block_coding')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    selectedMode === 'block_coding'
                      ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/30 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                      <Puzzle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Cursa Algoritmilor 🧩</h4>
                      <span className="text-[10px] text-emerald-300 font-medium">Block Coding Duel (Tip Scratch)</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Asamblează logic scriptul (Start, Mergi în față, Viraje 90°, Repetă de 3 ori) pentru a-l ghida pe Arky prin matrice! Primul care ajunge la destinație fără să lovească un obstacol câștigă runda!
                  </p>
                </button>

                {/* Mode 3: Quiz Blitz */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('quiz_blitz')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    selectedMode === 'quiz_blitz'
                      ? 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-500/30 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Quiz Blitz 🧠</h4>
                      <span className="text-[10px] text-purple-300 font-medium">Bătălia Creierelor TIC</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    5 întrebări fulger de hardware, securitate și algoritmi. Punctaj bonus pentru răspunsuri ultrarapide!
                  </p>
                </button>

                {/* Mode 3: Cyber Shield (Phishing defense) */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('cyber_shield')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    selectedMode === 'cyber_shield'
                      ? 'bg-rose-950/80 border-rose-400 ring-2 ring-rose-500/30 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Cyber Shield 🛡️</h4>
                      <span className="text-[10px] text-rose-300 font-medium">Apărare Anti-Phishing 1v1</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Analizează email-urile și link-urile primite în timp real! Blochează atacurile hackerilor și permite mesajele sigure.
                  </p>
                </button>

                {/* Mode 4: Hardware PC Rush */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('pc_rush')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    selectedMode === 'pc_rush'
                      ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/30 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Hardware PC Rush 🔧</h4>
                      <span className="text-[10px] text-cyan-300 font-medium">Asamblare PC în Viteză</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Asamblează calculatorul în ordinea corectă pas cu pas (CPU, Cooler, RAM, SSD, GPU, Sursă)! Cine montează primul?
                  </p>
                </button>
              </div>

              {/* Host / Create Button */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl ring-2 ring-purple-500/50">
                    {currentStudentAvatar || '⚡'}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Joci ca:</span>
                    <span className="text-sm font-bold text-white">{currentStudentName || 'Campion TIC'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateRoom}
                  disabled={isCreating}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isCreating
                    ? (lang === 'en' ? 'Creating Room...' : 'Se creează camera...')
                    : (lang === 'en' ? 'Create Duel Room (Host)' : 'Creează Cameră de Meci')}
                </button>
              </div>
            </div>

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Join Room Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  {lang === 'en' ? '2. Or Join an Existing Duel:' : '2. Sau Conectează-te la un Coleg:'}
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  Cere-i colegului de bancă codul camerei create de el (4 caractere) și intră direct în arenă!
                </p>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-400">Cod Cameră (Ex: 8X4B):</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={inputRoomCode}
                      onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                      placeholder="ABCD"
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border-2 border-indigo-500/40 focus:border-indigo-400 text-center font-mono text-2xl font-black text-amber-300 tracking-widest placeholder-slate-600 outline-none uppercase transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleJoinRoom}
                  disabled={isJoining || !inputRoomCode.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {isJoining
                    ? (lang === 'en' ? 'Connecting...' : 'Se conectează...')
                    : (lang === 'en' ? 'Join Duel Match' : 'Intră în Meci')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ROOM LOBBY (Waiting for 2nd Player / Countdown) */}
      {viewState === 'room' && currentRoom && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-purple-500/40 shadow-2xl relative overflow-hidden">
          {/* Animated Background Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Countdown Overlay if triggered */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-slate-950/90 z-30 flex flex-col items-center justify-center backdrop-blur-md animate-fadeIn">
              <span className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">
                {lang === 'en' ? 'Duel starts in:' : 'Meciul începe în:'}
              </span>
              <div className="text-7xl font-black text-amber-400 font-mono animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                {countdown === 0 ? 'START! 🚀' : countdown}
              </div>
              <p className="text-xs text-slate-400 mt-4">Pregătește-te pentru victorie!</p>
            </div>
          )}

          {/* Header with Room Code */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {getModeTitle(currentRoom.mode)}
              </span>
              <h3 className="text-2xl font-black text-white">Lobby Pregătire Meci 1v1</h3>
            </div>

            {/* Room Code Display Badge */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border-2 border-indigo-500/60 shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block text-right">Cod Cameră:</span>
                <span className="font-mono text-2xl font-black text-amber-300 tracking-widest">{currentRoom.roomCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-500/50 text-indigo-200 transition-all cursor-pointer"
                title="Copiază codul"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 1v1 Versus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center my-8">
            {/* Host Card */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border-2 border-indigo-500/40 flex items-center gap-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-3xl shadow-md">
                {currentRoom.host.avatar || '⚡'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">Gazdă</span>
                  {currentRoom.host.id === myDeviceId && (
                    <span className="text-[10px] text-amber-400 font-bold">(Tu)</span>
                  )}
                </div>
                <h4 className="text-lg font-black text-white truncate">{currentRoom.host.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Pregătit de Luptă
                </div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="md:col-span-1 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-xl ring-4 ring-slate-900">
                VS
              </div>
            </div>

            {/* Guest Card */}
            <div className={`md:col-span-5 p-5 rounded-2xl border-2 flex items-center gap-4 shadow-xl transition-all ${
              currentRoom.guest
                ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-500/40'
                : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-500'
            }`}>
              {currentRoom.guest ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-3xl shadow-md">
                    {currentRoom.guest.avatar || '🚀'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">Oaspete</span>
                      {currentRoom.guest.id === myDeviceId && (
                        <span className="text-[10px] text-amber-400 font-bold">(Tu)</span>
                      )}
                    </div>
                    <h4 className="text-lg font-black text-white truncate">{currentRoom.guest.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Conectat
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center w-full">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center mb-2 animate-bounce">
                    <Wifi className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">Se așteaptă conectarea colegului...</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Spune-i colegului să introducă codul: <span className="font-mono text-amber-400 font-bold">{currentRoom.roomCode}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                leaveDuelRoom(currentRoom.roomCode, isHost);
                setCurrentRoom(null);
                setViewState('lobby');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Anulează / Ieși din Cameră
            </button>

            {isHost ? (
              <button
                onClick={() => startDuelMatch(currentRoom.roomCode)}
                disabled={!currentRoom.guest}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm tracking-wider shadow-xl shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <Play className="w-4 h-4 fill-white" />
                {currentRoom.guest ? 'START DUEL ACUM 🚀' : 'Se așteaptă oponentul...'}
              </button>
            ) : (
              <div className="text-xs text-indigo-300 font-semibold bg-indigo-950/60 px-4 py-2.5 rounded-xl border border-indigo-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Gazda camerei va porni meciul în câteva momente...
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: ACTIVE PLAYING DUEL */}
      {viewState === 'playing' && currentRoom && (
        <div className="space-y-6">
          {/* Live Progress Bar (Race Track) */}
          <div className="p-5 rounded-2xl bg-slate-900/95 border border-purple-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-4 h-4" /> Pistă Live de Concurs (Sincronizare în Timp Real)
              </span>
              <span>{currentRoom.mode === 'cyber_sprint' ? `${wpm} WPM (Viteză)` : `Scor: ${me?.score || 0} pts`}</span>
            </div>

            {/* Track 1: Me */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-indigo-300 flex items-center gap-1">
                  <span>{me?.avatar}</span> {me?.name} (Tu)
                </span>
                <span className="font-mono text-indigo-200">{me?.progress || 0}%</span>
              </div>
              <div className="h-6 w-full rounded-full bg-slate-950 p-1 border border-indigo-500/40 relative overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-400 transition-all duration-300 flex items-center justify-end pr-1"
                  style={{ width: `${Math.max(5, me?.progress || 0)}%` }}
                >
                  <span className="text-xs">🚀</span>
                </div>
              </div>
            </div>

            {/* Track 2: Opponent */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-300 flex items-center gap-1">
                  <span>{opponent?.avatar || '👤'}</span> {opponent?.name || 'Oponent'}
                </span>
                <span className="font-mono text-rose-200">{opponent?.progress || 0}%</span>
              </div>
              <div className="h-6 w-full rounded-full bg-slate-950 p-1 border border-rose-500/40 relative overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 transition-all duration-300 flex items-center justify-end pr-1"
                  style={{ width: `${Math.max(5, opponent?.progress || 0)}%` }}
                >
                  <span className="text-xs">🏎️</span>
                </div>
              </div>
            </div>
          </div>

          {/* MODE 1: CYBER SPRINT GAMEPLAY */}
          {currentRoom.mode === 'cyber_sprint' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              {/* Words Text Container */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-lg sm:text-xl leading-relaxed flex flex-wrap gap-2.5">
                {words.map((word, idx) => {
                  let statusClass = 'text-slate-500';
                  if (idx < currentWordIdx) {
                    statusClass = 'text-emerald-400 font-bold line-through opacity-60';
                  } else if (idx === currentWordIdx) {
                    statusClass = 'text-amber-300 font-black bg-amber-500/20 px-2 py-0.5 rounded-lg ring-2 ring-amber-400/50';
                  }

                  return (
                    <span key={idx} className={`transition-all ${statusClass}`}>
                      {word}
                    </span>
                  );
                })}
              </div>

              {/* Typing Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Tastează cuvântul curent urmat de [SPACE]:
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={typedInput}
                  onChange={handleTypingChange}
                  disabled={hasFinishedLocal}
                  placeholder={hasFinishedLocal ? 'Ai terminat! Se așteaptă adversarul...' : 'Tastează aici...'}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-950 border-2 border-indigo-500 focus:border-cyan-400 text-white font-mono text-xl font-bold outline-none shadow-lg transition-all"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* MODE 0: ROBLOX BLOX CLICKER DUEL */}
          {currentRoom.mode === 'roblox_clicker' && (
            <RobloxClickerDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={handleRobloxClickerFinish}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE 2: SPEED CRAFTING DUEL (MINECRAFT TIC 1v1) */}
          {currentRoom.mode === 'speed_crafting' && (
            <SpeedCraftingDuelGame
              room={currentRoom}
              currentPlayer={me || currentRoom.host}
              opponent={opponent}
              onVictory={handleSpeedCraftingFinish}
            />
          )}

          {/* MODE 3: CURSA ALGORITMILOR (BLOCK CODING DUEL) */}
          {currentRoom.mode === 'block_coding' && (
            <BlockCodingDuelGame
              challenges={currentRoom.codingChallenges}
              currentLevelIndex={codingLevelIndex}
              myScore={codingScore}
              opponentProgress={opponent?.progress || 0}
              opponentName={opponent?.name}
              opponentAvatar={opponent?.avatar}
              isHost={isHost}
              lang={lang}
              onLevelComplete={handleBlockCodingLevelComplete}
              onFinishMatch={handleBlockCodingFinish}
              onUpdateProgress={(progress, score, level) => {
                updateDuelProgress(currentRoom.roomCode, isHost, {
                  progress,
                  score,
                  currentStageIndex: level
                });
              }}
            />
          )}

          {/* MODE 3: QUIZ BLITZ GAMEPLAY */}
          {currentRoom.mode === 'quiz_blitz' && currentQ && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Întrebarea {currentQIndex + 1} din {currentQuestions.length}</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Flame className="w-4 h-4" /> Combo Streak: x{streak}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                {currentQ.q}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQ.options.map((option, oIdx) => {
                  let btnStyle = 'bg-slate-950 border-slate-800 hover:border-indigo-500 text-white';

                  if (selectedAnswer !== null) {
                    if (oIdx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40';
                    } else if (selectedAnswer === oIdx) {
                      btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={selectedAnswer !== null}
                      onClick={() => handleQuizAnswer(oIdx)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer active:scale-98 flex items-center gap-3 ${btnStyle}`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-xs font-black shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 3: CYBER SHIELD GAMEPLAY (Phishing / Threats) */}
          {currentRoom.mode === 'cyber_shield' && currentShieldItem && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-rose-500/40 shadow-2xl space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span className="text-rose-300 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  Scenariul de Securitate {shieldIndex + 1} din {shieldItems.length}
                </span>
                <span className="text-amber-400 flex items-center gap-1 font-mono">
                  <Flame className="w-4 h-4" /> Streak: x{shieldStreak} (+{shieldScore} XP)
                </span>
              </div>

              {/* Simulated Email / Message Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border-2 border-slate-800 relative overflow-hidden shadow-inner">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800 text-xs">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-400">De la:</span>
                  <span className="font-mono font-bold text-white truncate">{currentShieldItem.sender}</span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-amber-200 font-heading mb-2">
                  {currentShieldItem.subject}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {currentShieldItem.body}
                </p>

                {currentShieldItem.linkOrAttachment && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-2 text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-slate-400">Link / Atașament:</span>
                    <span className="text-rose-300 font-bold truncate underline">{currentShieldItem.linkOrAttachment}</span>
                  </div>
                )}
              </div>

              {/* Feedback Alert if choice made */}
              {shieldFeedback && (
                <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 animate-fadeIn text-sm ${
                  shieldFeedback.isCorrect 
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200' 
                    : 'bg-rose-950/80 border-rose-400 text-rose-200'
                }`}>
                  {shieldFeedback.isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-rose-400 shrink-0" />}
                  <div>
                    <span className="font-black block">{shieldFeedback.isCorrect ? 'DECIZIE CORECTĂ! +150 XP' : 'DECIZIE GREȘITĂ!'}</span>
                    <p className="text-xs mt-0.5 opacity-90">{shieldFeedback.explanation}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons: BLOCK THREAT vs ALLOW SAFE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  disabled={shieldFeedback !== null}
                  onClick={() => handleShieldDecision('block')}
                  className="p-4 rounded-2xl bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-black text-base shadow-lg shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldX className="w-5 h-5" />
                  🚨 BLOCHEAZĂ ATACUL (Phishing/Virus)
                </button>

                <button
                  type="button"
                  disabled={shieldFeedback !== null}
                  onClick={() => handleShieldDecision('allow')}
                  className="p-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-black text-base shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5" />
                  ✅ PERMITE (Mesaj Sigur / Oficial)
                </button>
              </div>
            </div>
          )}

          {/* MODE 4: HARDWARE PC RUSH GAMEPLAY */}
          {currentRoom.mode === 'pc_rush' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-cyan-500/40 shadow-2xl space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span className="text-cyan-300 font-mono flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Asamblare PC în Viteză (Pasul {expectedStep} din {pcParts.length})
                </span>
                <span className="text-emerald-400 font-mono">
                  Componente Montate: {assembledParts.length}/{pcParts.length} (+{pcScore} XP)
                </span>
              </div>

              {/* Motherboard / Case Target Diagram */}
              <div className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/30 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                    🖥️ Placă de Bază & Carcasă (Socketuri Active)
                  </h4>
                  <span className="text-[11px] text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    Următorul pas necesar: {currentExpectedPart?.slotLabel}
                  </span>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {pcParts.map((p) => {
                    const isMounted = assembledParts.includes(p.id);
                    const isNextTarget = p.stepOrder === expectedStep;

                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          isMounted
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                            : isNextTarget
                            ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/40 animate-pulse'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                        }`}
                      >
                        <span className="text-2xl">{isMounted ? '✅' : p.icon}</span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-slate-400 block truncate">
                            {p.slotLabel}
                          </span>
                          <span className="text-xs font-bold truncate block">
                            {isMounted ? p.name : `[Slot ${p.stepOrder} Liber]`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error Notice if wrong step */}
              {pcMistake && (
                <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs flex items-center gap-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-bold">{pcMistake}</span>
                </div>
              )}

              {/* Available Parts Shelf to click and install */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                  📦 Raftul cu Piese Disponibile (Apasă pe piesa corectă pentru instalare):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {pcParts.map((part) => {
                    const isInstalled = assembledParts.includes(part.id);

                    return (
                      <button
                        key={part.id}
                        type="button"
                        disabled={isInstalled}
                        onClick={() => handleAssemblePart(part)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-3 ${
                          isInstalled
                            ? 'bg-slate-950/40 border-slate-900 opacity-40 cursor-not-allowed'
                            : 'bg-slate-950 hover:bg-slate-800 border-cyan-500/50 hover:border-cyan-300 text-white shadow-md'
                        }`}
                      >
                        <span className="text-3xl shrink-0">{part.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs sm:text-sm font-bold truncate">{part.name}</h5>
                          <span className="text-[10px] font-mono text-cyan-300 block truncate">{part.specs}</span>
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">{part.hint}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: RESULTS PODIUM */}
      {viewState === 'results' && currentRoom && (
        <div className="p-8 rounded-3xl bg-slate-900/95 border-2 border-amber-500/40 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-600 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 ring-4 ring-amber-300/30 animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <div>
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
              Meci Încheiat!
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white font-heading mt-1">
              {isMeWinner ? '🎉 FELICITĂRI! AI CÂȘTIGAT DUELUL! 🎉' : `🏆 Câștigător: ${currentRoom.winnerName || 'Oponentul'}`}
            </h3>
            <p className="text-sm text-slate-300 mt-2">
              {isMeWinner
                ? 'Ai demonstrat o viteză și precizie excepțională în laboratorul TIC! Ai primit +200 XP!'
                : 'O luptă strânsă și spectaculoasă! Răzbună-te într-o revanșă fulger!'}
            </p>
          </div>

          {/* Scores Comparison */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className={`p-4 rounded-xl border ${isMeWinner ? 'bg-indigo-950/60 border-indigo-500' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-2xl block mb-1">{me?.avatar}</span>
              <span className="text-xs font-bold text-slate-400">{me?.name} (Tu)</span>
              <div className="font-mono text-xl font-black text-indigo-300 mt-1">{me?.score || 0} pts</div>
            </div>

            <div className={`p-4 rounded-xl border ${isOpponentWinner ? 'bg-rose-950/60 border-rose-500' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-2xl block mb-1">{opponent?.avatar || '👤'}</span>
              <span className="text-xs font-bold text-slate-400">{opponent?.name || 'Oponent'}</span>
              <div className="font-mono text-xl font-black text-rose-300 mt-1">{opponent?.score || 0} pts</div>
            </div>
          </div>

          {/* Play Again / Exit */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                sounds.playClick();
                setViewState('lobby');
                setCurrentRoom(null);
                setHasFinishedLocal(false);
                setCurrentWordIdx(0);
                setCurrentQIndex(0);
                setQuizScore(0);
                setShieldIndex(0);
                setShieldScore(0);
                setAssembledParts([]);
                setPcScore(0);
                setCodingLevelIndex(0);
                setCodingScore(0);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'en' ? 'New Match / Change Mode' : 'Meci Nou / Schimbă Modul'}
            </button>

            {handleBack && (
              <button
                onClick={() => {
                  sounds.playClick();
                  handleBack();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                {lang === 'en' ? 'Back to Courses' : 'Înapoi la Misiuni'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
