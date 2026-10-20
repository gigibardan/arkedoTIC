import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Terminal,
  Server,
  Lock,
  KeyRound,
  FileWarning,
  Flame,
  Clock,
  Trophy,
  RotateCcw,
  Swords,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Wifi,
  Radio,
  Eye,
  CheckCircle2,
  XCircle,
  Bug,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';

export type AttackType = 'phishing' | 'trojan' | 'ddos' | 'bruteforce';
export type DefenseTool = 'filter' | 'antivirus' | 'firewall' | 'two_factor';

export interface ThreatPacket {
  id: string;
  type: AttackType;
  titleRo: string;
  titleEn: string;
  descRo: string;
  descEn: string;
  counterTool: DefenseTool;
  createdAt: number;
  durationMs: number;
  isResolved?: boolean;
  wasBlocked?: boolean;
}

interface AttackVectorConfig {
  type: AttackType;
  nameRo: string;
  nameEn: string;
  icon: string;
  energyCost: number;
  cooldownSeconds: number;
  counterTool: DefenseTool;
  counterNameRo: string;
  descRo: string;
  descEn: string;
  color: string;
}

const ATTACK_VECTORS: AttackVectorConfig[] = [
  {
    type: 'phishing',
    nameRo: 'Phishing E-mail',
    nameEn: 'Phishing Email',
    icon: '🎣',
    energyCost: 20,
    cooldownSeconds: 2.5,
    counterTool: 'filter',
    counterNameRo: 'Filtru Anti-Phishing',
    descRo: 'E-mail mascat de bancă solicitând date urgente.',
    descEn: 'Disguised banking email requesting sensitive credentials.',
    color: 'from-amber-600 to-orange-600 border-amber-500/50'
  },
  {
    type: 'trojan',
    nameRo: 'Troian .pdf.exe',
    nameEn: 'Trojan .pdf.exe',
    icon: '🦠',
    energyCost: 25,
    cooldownSeconds: 3.0,
    counterTool: 'antivirus',
    counterNameRo: 'Antivirus & Carantină',
    descRo: 'Executabil deghizat în temă școlară sau joc.',
    descEn: 'Executable disguised as homework document or game.',
    color: 'from-rose-600 to-red-600 border-rose-500/50'
  },
  {
    type: 'ddos',
    nameRo: 'Scanare & Inundație SYN',
    nameEn: 'Port Scan & DDoS',
    icon: '💥',
    energyCost: 30,
    cooldownSeconds: 3.5,
    counterTool: 'firewall',
    counterNameRo: 'Firewall de Rețea',
    descRo: 'Saturație de pachete pe porturile 8080 și 22.',
    descEn: 'High-frequency packet flood targeting vulnerable ports.',
    color: 'from-purple-600 to-indigo-600 border-purple-500/50'
  },
  {
    type: 'bruteforce',
    nameRo: 'Forță Brută Parolă',
    nameEn: 'Brute-Force Login',
    icon: '🔑',
    energyCost: 35,
    cooldownSeconds: 4.0,
    counterTool: 'two_factor',
    counterNameRo: 'Autentificare 2FA',
    descRo: 'Testare automată de 10.000 parole din dicționar.',
    descEn: 'Automated dictionary spray testing 10,000 common passwords.',
    color: 'from-cyan-600 to-blue-600 border-cyan-500/50'
  }
];

const DEFENSE_TOOLS: Array<{
  id: DefenseTool;
  nameRo: string;
  nameEn: string;
  countersType: AttackType;
  icon: string;
  color: string;
  shortcut: string;
}> = [
  {
    id: 'filter',
    nameRo: 'Filtru Anti-Phishing',
    nameEn: 'Anti-Phishing Filter',
    countersType: 'phishing',
    icon: '🔍',
    color: 'bg-amber-600 hover:bg-amber-500 border-amber-400/60 text-white',
    shortcut: '[ 1 ]'
  },
  {
    id: 'antivirus',
    nameRo: 'Antivirus & Carantină',
    nameEn: 'Antivirus Quarantine',
    countersType: 'trojan',
    icon: '🧪',
    color: 'bg-rose-600 hover:bg-rose-500 border-rose-400/60 text-white',
    shortcut: '[ 2 ]'
  },
  {
    id: 'firewall',
    nameRo: 'Firewall de Rețea',
    nameEn: 'Network Firewall',
    countersType: 'ddos',
    icon: '🧱',
    color: 'bg-purple-600 hover:bg-purple-500 border-purple-400/60 text-white',
    shortcut: '[ 3 ]'
  },
  {
    id: 'two_factor',
    nameRo: 'Autentificare 2FA',
    nameEn: '2FA Verification',
    countersType: 'bruteforce',
    icon: '📲',
    color: 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400/60 text-white',
    shortcut: '[ 4 ]'
  }
];

interface HackerDefenderDuelGameProps {
  room?: DuelRoomData | null;
  currentPlayer?: DuelPlayer;
  opponent?: DuelPlayer | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinishMatch?: (myFinalScore: number, won: boolean) => void;
  onFinish?: (score: number) => void;
  onBackToLobby?: () => void;
  onBack?: () => void;
}

export const HackerDefenderDuelGame: React.FC<HackerDefenderDuelGameProps> = ({
  room,
  currentPlayer,
  opponent,
  isHost = true,
  studentName,
  studentAvatar,
  onFinishMatch,
  onFinish,
  onBackToLobby,
  onBack
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const effectivePlayer: DuelPlayer = currentPlayer || {
    id: 'local_player',
    name: studentName || (isEn ? 'Cyber Defender' : 'Campion Securitate'),
    avatar: studentAvatar || '🛡️',
    isReady: true,
    score: 0,
    progress: 0,
    lastActive: Date.now()
  };

  const effectiveOpponent: DuelPlayer = opponent || {
    id: 'bot_player',
    name: isEn ? 'Cyber-Bot AI' : 'Cyber-Bot AI',
    avatar: '🤖',
    isReady: true,
    score: 0,
    progress: 0,
    lastActive: Date.now()
  };

  // Game Structure: Round 1 (45s) -> Halftime Swap (5s) -> Round 2 (45s) -> Victory Summary
  const ROUND_DURATION_SEC = 45;
  const HALFTIME_DURATION_SEC = 5;

  const [gameStage, setGameStage] = useState<'round1' | 'halftime' | 'round2' | 'finished'>('round1');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(ROUND_DURATION_SEC);
  const [halftimeRemaining, setHalftimeRemaining] = useState<number>(HALFTIME_DURATION_SEC);

  // Determine current active role for local player
  // Round 1: Host is Hacker (Attacker), Guest is SysAdmin (Defender)
  // Round 2: Roles reverse!
  const isCurrentlyHacker = gameStage === 'round1' ? isHost : !isHost;

  // Player Scores: Split between Attack points and Defense points
  const [myHackerScore, setMyHackerScore] = useState<number>(0);
  const [myDefenderScore, setMyDefenderScore] = useState<number>(0);
  const [oppHackerScore, setOppHackerScore] = useState<number>(0);
  const [oppDefenderScore, setOppDefenderScore] = useState<number>(0);

  // Hacker State (when attacking)
  const [energy, setEnergy] = useState<number>(80);
  const [cooldowns, setCooldowns] = useState<Record<AttackType, number>>({
    phishing: 0,
    trojan: 0,
    ddos: 0,
    bruteforce: 0
  });

  // Defender State (when defending)
  const [serverHealth, setServerHealth] = useState<number>(100);
  const [threatPackets, setThreatPackets] = useState<ThreatPacket[]>([]);
  const [defenseFeedback, setDefenseFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // Match statistics tracking
  const [successfulAttacksCount, setSuccessfulAttacksCount] = useState<number>(0);
  const [successfulPatchesCount, setSuccessfulPatchesCount] = useState<number>(0);

  // Firestore throttling timestamp ref
  const lastWriteTimeRef = useRef<number>(0);

  const myTotalScore = myHackerScore + myDefenderScore;
  const oppTotalScore = oppHackerScore + oppDefenderScore;

  // 1. Master Timer Effect
  useEffect(() => {
    if (gameStage === 'finished') return;

    const timer = setInterval(() => {
      if (gameStage === 'round1') {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Trigger Halftime Role Swap
            sounds.playLevelUp();
            setGameStage('halftime');
            setHalftimeRemaining(HALFTIME_DURATION_SEC);
            setThreatPackets([]);
            // Sync halfway score milestone to Firestore safely
            syncMilestoneToFirestore(false);
            return 0;
          }
          return prev - 1;
        });
      } else if (gameStage === 'halftime') {
        setHalftimeRemaining((prev) => {
          if (prev <= 1) {
            // Start Round 2! Roles Reversed
            sounds.playFanfare();
            setGameStage('round2');
            setSecondsRemaining(ROUND_DURATION_SEC);
            setServerHealth(100);
            setEnergy(80);
            setThreatPackets([]);
            return 0;
          }
          return prev - 1;
        });
      } else if (gameStage === 'round2') {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Finalize Match!
            sounds.playVictory();
            setGameStage('finished');
            setThreatPackets([]);
            // Sync final score to Firestore
            syncMilestoneToFirestore(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStage, myTotalScore]);

  // 2. Safe Milestone Firestore Syncer (Only fires at round swap and end of match, never spams Firestore!)
  const syncMilestoneToFirestore = (isMatchFinished: boolean) => {
    const now = Date.now();
    // Safety guard: at most one write every 4 seconds
    if (now - lastWriteTimeRef.current < 4000 && !isMatchFinished) return;
    lastWriteTimeRef.current = now;

    if (room?.roomCode) {
      updateDuelProgress(room.roomCode, isHost, {
        score: myTotalScore,
        progress: isMatchFinished ? 100 : gameStage === 'round1' ? 50 : 80,
        finishedAt: isMatchFinished ? now : undefined
      });
    }

    if (isMatchFinished) {
      try {
        const prevBest = Number(localStorage.getItem('arkedo_highscore_duel_hacker_defense') || '0');
        if (myTotalScore > prevBest) {
          localStorage.setItem('arkedo_highscore_duel_hacker_defense', String(myTotalScore));
        }
      } catch {}
      const won = myTotalScore >= oppTotalScore;
      if (won) {
        updateStudentArcadeScore('hacker_defense', myTotalScore);
      }
      onFinishMatch?.(myTotalScore, won);
      onFinish?.(myTotalScore);
    }
  };

  // 3. Hacker Energy Regeneration & Cooldowns Loop
  useEffect(() => {
    if (gameStage !== 'round1' && gameStage !== 'round2') return;

    const interval = setInterval(() => {
      // Regenerate hacker bandwidth
      if (isCurrentlyHacker) {
        setEnergy((prev) => Math.min(100, prev + 6));
      }

      // Decrement attack cooldowns
      setCooldowns((prev) => ({
        phishing: Math.max(0, prev.phishing - 0.5),
        trojan: Math.max(0, prev.trojan - 0.5),
        ddos: Math.max(0, prev.ddos - 0.5),
        bruteforce: Math.max(0, prev.bruteforce - 0.5)
      }));
    }, 500);

    return () => clearInterval(interval);
  }, [isCurrentlyHacker, gameStage]);

  // 4. Opponent / Bot Attack Simulator (Generates realistic threats when player is defending)
  useEffect(() => {
    if (isCurrentlyHacker || (gameStage !== 'round1' && gameStage !== 'round2')) return;

    // The opponent (or Cyber Bot) sends attacks rhythmically every 3.5 to 5.5 seconds
    const botInterval = setInterval(() => {
      const randAttack = ATTACK_VECTORS[Math.floor(Math.random() * ATTACK_VECTORS.length)];
      const newPacket: ThreatPacket = {
        id: 'threat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        type: randAttack.type,
        titleRo: randAttack.nameRo,
        titleEn: randAttack.nameEn,
        descRo: randAttack.descRo,
        descEn: randAttack.descEn,
        counterTool: randAttack.counterTool,
        createdAt: Date.now(),
        durationMs: 4200 // 4.2 seconds to reach the server
      };

      setThreatPackets((prev) => [...prev.slice(-3), newPacket]);
      sounds.playPop();
    }, 3800);

    return () => clearInterval(botInterval);
  }, [isCurrentlyHacker, gameStage]);

  // 5. Threat Life Cycle Loop (checks for packets reaching the server undefended)
  useEffect(() => {
    if (isCurrentlyHacker || (gameStage !== 'round1' && gameStage !== 'round2')) return;

    const threatCheck = setInterval(() => {
      const now = Date.now();
      setThreatPackets((prev) => {
        const remaining: ThreatPacket[] = [];
        prev.forEach((packet) => {
          if (packet.isResolved) return;

          // Has the threat arrived and breached?
          if (now - packet.createdAt >= packet.durationMs) {
            // Breached! Server damaged
            sounds.playExplosion();
            setServerHealth((h) => Math.max(0, h - 12));
            setOppHackerScore((s) => s + 25);
            setDefenseFeedback({
              text: isEn ? `BREACH! ${packet.titleEn} hit server!` : `BREȘĂ! ${packet.titleRo} a lovit serverul!`,
              success: false
            });
          } else {
            remaining.push(packet);
          }
        });
        return remaining;
      });
    }, 250);

    return () => clearInterval(threatCheck);
  }, [isCurrentlyHacker, gameStage, isEn]);

  // ACTION: Hacker launches an attack
  const handleLaunchAttack = (attack: AttackVectorConfig) => {
    if (!isCurrentlyHacker) return;
    if (energy < attack.energyCost || cooldowns[attack.type] > 0) {
      sounds.playWrong();
      return;
    }

    sounds.playLaser();
    setEnergy((prev) => Math.max(0, prev - attack.energyCost));
    setCooldowns((prev) => ({ ...prev, [attack.type]: attack.cooldownSeconds }));

    // Simulate attack delivery: In 3.8s it resolves (either opponent SysAdmin patches it or it breaches!)
    setTimeout(() => {
      // 35% chance opponent blocks it, 65% chance of successful breach
      const isBlocked = Math.random() < 0.35;
      if (!isBlocked) {
        sounds.playZap();
        setMyHackerScore((prev) => prev + 30);
        setSuccessfulAttacksCount((c) => c + 1);
        setDefenseFeedback({
          text: isEn ? `Exploit hit! +30 Points` : `Breșă reușită! +30 Puncte`,
          success: true
        });
      } else {
        sounds.playShield();
        setOppDefenderScore((prev) => prev + 20);
        setDefenseFeedback({
          text: isEn ? `SysAdmin patched your ${attack.nameEn}` : `SysAdmin-ul a blocat ${attack.nameRo}`,
          success: false
        });
      }
    }, 3800);
  };

  // ACTION: Defender activates a security counter-measure tool
  const handleActivateDefense = (toolId: DefenseTool) => {
    if (isCurrentlyHacker) return;

    // Find the oldest unresolved threat currently in flight
    const targetThreat = threatPackets.find((t) => !t.isResolved);
    if (!targetThreat) {
      sounds.playClick();
      return;
    }

    if (targetThreat.counterTool === toolId) {
      // Correct Counter-Measure Activated!
      sounds.playShield();
      setThreatPackets((prev) =>
        prev.map((p) => (p.id === targetThreat.id ? { ...p, isResolved: true, wasBlocked: true } : p))
      );
      setMyDefenderScore((prev) => prev + 25);
      setSuccessfulPatchesCount((c) => c + 1);
      setDefenseFeedback({
        text: isEn
          ? `✓ Threat neutralized with ${toolId.toUpperCase()}! (+25 pts)`
          : `✓ Amenințare anihilată cu succes! (+25 puncte)`,
        success: true
      });
    } else {
      // Wrong tool selected
      sounds.playWrong();
      setDefenseFeedback({
        text: isEn
          ? `❌ Wrong security tool! Check the threat type.`
          : `❌ Instrument de securitate greșit! Verifică tipul amenințării.`,
        success: false
      });
    }
  };

  // Keyboard shortcut listener for defenders: [1], [2], [3], [4]
  useEffect(() => {
    if (isCurrentlyHacker) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '1') handleActivateDefense('filter');
      if (e.key === '2') handleActivateDefense('antivirus');
      if (e.key === '3') handleActivateDefense('firewall');
      if (e.key === '4') handleActivateDefense('two_factor');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isCurrentlyHacker, threatPackets]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fadeIn">
      {/* Top Match HUD: Round Timer, Scores, and Role Indicator */}
      <div className="bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Player 1 (Me) Info & Score */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                if (onBackToLobby) onBackToLobby();
                else if (onBack) onBack();
              }}
              title={isEn ? 'Exit match' : 'Părăsește meciul'}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-700/60"
            >
              ←
            </button>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-2xl shadow-inner">
              {effectivePlayer.avatar || '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{effectivePlayer.name}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {isEn ? 'YOU' : 'TU'}
                </span>
              </div>
              <div className="text-lg font-black font-mono text-cyan-300">
                {myTotalScore} <span className="text-xs font-normal text-slate-400">XP</span>
              </div>
            </div>
          </div>

          {/* Central Timer & Phase Badge */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-700 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="font-bold text-white">
                {gameStage === 'halftime'
                  ? `SCHIMB DE ROLURI: ${halftimeRemaining}s`
                  : `RUNDA ${gameStage === 'round1' ? '1' : '2'} / 2: ${secondsRemaining}s`}
              </span>
            </div>

            {/* Current Active Role Badge */}
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
              {isCurrentlyHacker ? (
                <span className="text-rose-400 flex items-center gap-1 bg-rose-950/70 px-2.5 py-0.5 rounded-lg border border-rose-500/40 animate-pulse">
                  <Terminal className="w-3.5 h-3.5" />
                  {isEn ? 'ROLE: HACKER (ATTACK)' : 'ROL CURENT: ATACATOR 🦹‍♂️'}
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 animate-pulse">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isEn ? 'ROLE: SYSADMIN (DEFEND)' : 'ROL CURENT: APĂRĂTOR 🛡️'}
                </span>
              )}
            </div>
          </div>

          {/* Player 2 (Opponent / Bot) Info & Score */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-black text-white">{effectiveOpponent.name}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {opponent ? 'RIVAL' : 'AI'}
                </span>
              </div>
              <div className="text-lg font-black font-mono text-purple-300">
                {oppTotalScore} <span className="text-xs font-normal text-slate-400">XP</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-2xl shadow-inner">
              {effectiveOpponent.avatar || '🤖'}
            </div>
          </div>
        </div>
      </div>

      {/* HALFTIME ROLE SWAP MODAL OVERLAY */}
      {gameStage === 'halftime' && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-amber-400 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-4xl shadow-lg animate-bounce">
            ⚡
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {isEn ? 'HALFTIME: ROLES ARE REVERSING!' : 'PAUZĂ TACTICĂ: SE INVERSEAZĂ ROLURILE!'}
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            {isCurrentlyHacker
              ? (isEn ? 'You attacked in Round 1. Now prepare to defend your server with Firewall and Antivirus!' : 'Ai atacat în Runda 1. Acum pregătește-te să aperi serverul cu Firewall și Antivirus!')
              : (isEn ? 'You defended in Round 1. Now prepare to launch tactical cyber exploits!' : 'Ai apărat serverul în Runda 1. Acum preiei consola de atac!')}
          </p>
          <div className="inline-block px-4 py-2 rounded-2xl bg-slate-950 border border-amber-400 font-mono text-xl font-black text-amber-300">
            {isEn ? `Round 2 starts in ${halftimeRemaining}s` : `Runda 2 începe în ${halftimeRemaining} secunde`}
          </div>
        </div>
      )}

      {/* MATCH FINISHED SUMMARY OVERLAY */}
      {gameStage === 'finished' && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-2 border-emerald-400 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-4xl shadow-lg">
            🏆
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {myTotalScore >= oppTotalScore
              ? (isEn ? 'VICTORY! Cybersecurity Champion' : 'VICTORIE! Marele Maestru al Securității')
              : (isEn ? 'DEFEAT! Good Match' : 'MECI ÎNCHEIAT! Felicitări pentru efort')}
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase block">Scorul Tău Final</span>
              <span className="text-3xl font-black text-cyan-300 font-mono">{myTotalScore}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Atac: {myHackerScore} • Apărare: {myDefenderScore}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase block">Scor Oponent</span>
              <span className="text-3xl font-black text-purple-300 font-mono">{oppTotalScore}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Atac: {oppHackerScore} • Apărare: {oppDefenderScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                if (onBackToLobby) onBackToLobby();
                else if (onBack) onBack();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl cursor-pointer transition transform active:scale-95 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isEn ? 'Back to Duel / Arcade' : 'Înapoi la Duel / Mini-Jocuri'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE STAGE VIEW: HACKER VIEW OR SYSADMIN VIEW */}
      {(gameStage === 'round1' || gameStage === 'round2') && (
        <div className="space-y-5">
          {/* VIEW A: IF LOCAL PLAYER IS THE HACKER */}
          {isCurrentlyHacker ? (
            <div className="bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    🦹‍♂️
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {isEn ? 'Hacker Cyber Terminal (Tactical Exploits)' : 'Consola de Atac Cibernetic (Exploits Tactice)'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isEn ? 'Spend Bandwidth to send disguised attacks. Time your vectors!' : 'Consumă Bandwidth pentru a lansa atacuri. Alege momentul oportun!'}
                    </p>
                  </div>
                </div>

                {/* Hacker Bandwidth Energy Bar */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div className="flex-1 sm:w-36 bg-slate-950 rounded-full h-3.5 border border-slate-700 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                      style={{ width: `${energy}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">{energy}%</span>
                </div>
              </div>

              {/* 4 Tactical Attack Vector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ATTACK_VECTORS.map((attack) => {
                  const isReady = energy >= attack.energyCost && cooldowns[attack.type] <= 0;
                  return (
                    <button
                      key={attack.type}
                      type="button"
                      disabled={!isReady}
                      onClick={() => handleLaunchAttack(attack)}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[105px] ${
                        isReady
                          ? `bg-gradient-to-br ${attack.color} text-white shadow-lg cursor-pointer hover:scale-[1.02] active:scale-95`
                          : 'bg-slate-950/70 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{attack.icon}</span>
                          <span className="text-sm font-black uppercase tracking-wide">
                            {isEn ? attack.nameEn : attack.nameRo}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-amber-300 border border-amber-400/30">
                          ⚡ {attack.energyCost}%
                        </span>
                      </div>

                      <p className="text-xs opacity-90 leading-snug line-clamp-2">
                        {isEn ? attack.descEn : attack.descRo}
                      </p>

                      {cooldowns[attack.type] > 0 && (
                        <div className="absolute inset-0 bg-black/75 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
                          Cooldown: {cooldowns[attack.type].toFixed(1)}s
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* VIEW B: IF LOCAL PLAYER IS THE SYSADMIN DEFENDER */
            <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {isEn ? 'SysAdmin Security Operations Center (SOC)' : 'Centrul de Apărare & Peticire SysAdmin'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isEn ? 'Select the matching security tool before threats breach the server!' : 'Activează contramăsura corectă înainte ca atacul să atingă serverul!'}
                    </p>
                  </div>
                </div>

                {/* Server Health Integrity Bar */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <div className="flex-1 sm:w-36 bg-slate-950 rounded-full h-3.5 border border-slate-700 overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-300 ${
                        serverHealth > 50
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : serverHealth > 25
                          ? 'bg-amber-500'
                          : 'bg-rose-600 animate-pulse'
                      }`}
                      style={{ width: `${serverHealth}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-300">{serverHealth}% HP</span>
                </div>
              </div>

              {/* Cyber Radar: Incoming Packets moving towards Server */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    Radar Pachete de Rețea (În Tranzit)
                  </span>
                  <span>Timp de Reacție: ~4 secunde</span>
                </div>

                {threatPackets.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-slate-500 flex flex-col items-center gap-2">
                    <Wifi className="w-6 h-6 text-emerald-500/40 animate-pulse" />
                    <span>Rețea curată în acest moment. Nicio amenințare activă...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {threatPackets.map((threat) => {
                      const ageMs = Date.now() - threat.createdAt;
                      const progressPct = Math.min(100, Math.floor((ageMs / threat.durationMs) * 100));

                      return (
                        <div
                          key={threat.id}
                          className="p-3 rounded-xl bg-slate-900 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 relative overflow-hidden"
                        >
                          {/* Progress bar background showing distance to server */}
                          <div
                            className="absolute inset-y-0 left-0 bg-rose-950/40 pointer-events-none transition-all duration-200"
                            style={{ width: `${progressPct}%` }}
                          />

                          <div className="relative z-10 flex items-center gap-2.5">
                            <span className="text-xl">
                              {threat.type === 'phishing' ? '🎣' : threat.type === 'trojan' ? '🦠' : threat.type === 'ddos' ? '💥' : '🔑'}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-white">
                                {isEn ? threat.titleEn : threat.titleRo}
                              </div>
                              <div className="text-[11px] text-slate-300">
                                {isEn ? threat.descEn : threat.descRo}
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 shrink-0 self-end sm:self-auto text-[10px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                            {100 - progressPct}% distanță
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4 Defensive Tool Action Buttons */}
              <div>
                <p className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Apasă instrumentul corespunzător (sau tastele 1, 2, 3, 4):</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DEFENSE_TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleActivateDefense(tool.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-md active:scale-95 ${tool.color}`}
                    >
                      <span className="text-2xl">{tool.icon}</span>
                      <span className="text-xs font-black uppercase tracking-tight leading-tight">
                        {isEn ? tool.nameEn : tool.nameRo}
                      </span>
                      <span className="text-[10px] font-mono opacity-80">{tool.shortcut}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback Bar */}
          {defenseFeedback && (
            <div
              className={`p-3 rounded-2xl border text-xs font-bold text-center animate-in fade-in ${
                defenseFeedback.success
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500 text-rose-200'
              }`}
            >
              {defenseFeedback.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
