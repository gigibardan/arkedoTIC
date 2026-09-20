import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Trophy,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Play,
  Clock,
  Zap,
  Activity,
  AlertTriangle,
  Bug,
  Server,
  Terminal,
} from 'lucide-react';

interface FirewallDefenderGameProps {
  onBack: () => void;
  studentName?: string;
}

type PacketType = 'CLEAN' | 'VIRUS' | 'SPAM' | 'DDOS' | 'TROJAN';

interface NetworkPacket {
  id: string;
  type: PacketType;
  name: string;
  sourceIp: string;
  protocol: 'HTTP' | 'HTTPS' | 'FTP' | 'SSH' | 'UNKNOWN';
  port: number;
  payloadSize: string;
  isDangerous: boolean;
  threatDetailsRo: string;
  threatDetailsEn: string;
  cleanDetailsRo: string;
  cleanDetailsEn: string;
}

const PACKET_POOL: Omit<NetworkPacket, 'id'>[] = [
  // Clean Packets
  {
    type: 'CLEAN',
    name: 'Trafic Web Școală (EDU.RO)',
    sourceIp: '193.226.14.82',
    protocol: 'HTTPS',
    port: 443,
    payloadSize: '1.2 KB',
    isDangerous: false,
    threatDetailsRo: '',
    threatDetailsEn: '',
    cleanDetailsRo: 'Pachet web securizat cu certificat SSL valid pe domeniul Ministerului Educației.',
    cleanDetailsEn: 'Encrypted HTTPS traffic from verified educational network.',
  },
  {
    type: 'CLEAN',
    name: 'Conexiune Google Classroom',
    sourceIp: '142.250.180.206',
    protocol: 'HTTPS',
    port: 443,
    payloadSize: '4.8 KB',
    isDangerous: false,
    threatDetailsRo: '',
    threatDetailsEn: '',
    cleanDetailsRo: 'Sincronizare teme și documente prin protocolul securizat Google.',
    cleanDetailsEn: 'Authentic school assignment synchronization packets.',
  },
  {
    type: 'CLEAN',
    name: 'Descărcare Fișier Manual PDF',
    sourceIp: '86.120.45.10',
    protocol: 'HTTP',
    port: 80,
    payloadSize: '240 KB',
    isDangerous: false,
    threatDetailsRo: '',
    threatDetailsEn: '',
    cleanDetailsRo: 'Descărcare manual digital aprobat din arhiva bibliotecii.',
    cleanDetailsEn: 'Safe PDF textbook download from standard school mirror.',
  },
  {
    type: 'CLEAN',
    name: 'Sincronizare Timp NTP Server',
    sourceIp: '193.226.10.1',
    protocol: 'HTTPS',
    port: 123,
    payloadSize: '0.4 KB',
    isDangerous: false,
    threatDetailsRo: '',
    threatDetailsEn: '',
    cleanDetailsRo: 'Pachet de ceas și dată pentru sincronizarea serverelor.',
    cleanDetailsEn: 'Legitimate network time protocol packet.',
  },

  // Dangerous Packets
  {
    type: 'VIRUS',
    name: 'Vierme Retea (Worm.Win32)',
    sourceIp: '185.220.101.4',
    protocol: 'UNKNOWN',
    port: 445,
    payloadSize: '68 KB',
    isDangerous: true,
    threatDetailsRo: 'Port vulnerabil SMB atacat direct! Încearcă să infecteze alte computere din rețea.',
    threatDetailsEn: 'Dangerous port attack aiming to propagate across school subnet.',
    cleanDetailsRo: '',
    cleanDetailsEn: '',
  },
  {
    type: 'TROJAN',
    name: 'Troian Furt Parole (Stealer.Keylog)',
    sourceIp: '91.240.118.15',
    protocol: 'HTTP',
    port: 8080,
    payloadSize: '3.1 MB',
    isDangerous: true,
    threatDetailsRo: 'Pachet executabil ascuns care încearcă să trimită parolele salvate în exterior!',
    threatDetailsEn: 'Keylogger payload masquerading as software utility.',
    cleanDetailsRo: '',
    cleanDetailsEn: '',
  },
  {
    type: 'DDOS',
    name: 'Val Inundație Inutilă (SYN Flood)',
    sourceIp: '45.154.255.99',
    protocol: 'UNKNOWN',
    port: 80,
    payloadSize: '0.1 KB',
    isDangerous: true,
    threatDetailsRo: 'Mii de pachete false trimise simultan pentru a bloca serverul școlii!',
    threatDetailsEn: 'High frequency malicious packet flood designed to exhaust bandwidth.',
    cleanDetailsRo: '',
    cleanDetailsEn: '',
  },
  {
    type: 'SPAM',
    name: 'Botnet Reclame Agresive',
    sourceIp: '103.110.150.32',
    protocol: 'HTTP',
    port: 25,
    payloadSize: '15.4 KB',
    isDangerous: true,
    threatDetailsRo: 'Pachet trimis prin port de e-mail neautorizat pentru transmiterea de reclame toxice.',
    threatDetailsEn: 'Unauthorized mail server connection transmitting spam payloads.',
    cleanDetailsRo: '',
    cleanDetailsEn: '',
  },
];

export const FirewallDefenderGame: React.FC<FirewallDefenderGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [serverHealth, setServerHealth] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [currentPacket, setCurrentPacket] = useState<NetworkPacket | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_firewall') || '0');
    } catch {
      return 0;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomPacket = useCallback((): NetworkPacket => {
    const template = PACKET_POOL[Math.floor(Math.random() * PACKET_POOL.length)];
    return {
      ...template,
      id: Math.random().toString(36).substring(7),
    };
  }, []);

  const startGame = () => {
    sounds.playClick();
    setIsPlaying(true);
    setIsGameOver(false);
    setTimeLeft(45);
    setServerHealth(100);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setProcessedCount(0);
    setActionFeedback(null);
    setCurrentPacket(getRandomPacket());
    arky.triggerIdle();
  };

  // Timer & Game Over monitoring
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && serverHealth > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && (timeLeft === 0 || serverHealth <= 0)) {
      setIsPlaying(false);
      setIsGameOver(true);
      if (serverHealth > 0) {
        sounds.playVictory();
        if (score > highScore) {
          setHighScore(score);
          try {
            localStorage.setItem('arkedo_highscore_firewall', String(score));
            updateActiveArcadeScore('firewall', score);
          } catch {
            // ignore
          }
        }
        arky.triggerFinished(
          lang === 'en'
            ? `School Server Protected! Packets Inspected: ${processedCount}! Score: ${score} pts! 🛡️💻`
            : `Serverul Școlii a fost Protejat! Pachete inspectate: ${processedCount}! Scor: ${score} puncte! 🛡️💻`
        );
      } else {
        sounds.playWrong();
        arky.triggerIdle();
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft, serverHealth, score, highScore, processedCount, arky, lang]);

  // Player action: Allow or Block
  const handleDecision = (allow: boolean) => {
    if (!isPlaying || !currentPacket) return;

    // Allowed clean packet OR blocked dangerous packet -> Correct
    const isCorrect = (allow && !currentPacket.isDangerous) || (!allow && currentPacket.isDangerous);

    if (isCorrect) {
      sounds.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const points = 120 + Math.min(newCombo * 20, 80);
      setScore((prev) => prev + points);
      setProcessedCount((prev) => prev + 1);

      setActionFeedback({
        isCorrect: true,
        message: allow
          ? (lang === 'en' ? `+${points} pts! Safe packet allowed through firewall.` : `+${points} pct! Pachet curat lăsat să treacă.`)
          : (lang === 'en' ? `+${points} pts! Malicious threat blocked and neutralized!` : `+${points} pct! Amenințare blocată cu succes de Firewall!`),
      });

      if (newCombo % 5 === 0) {
        arky.triggerSuccess(
          lang === 'en'
            ? `${newCombo}x Defense Combo! The school network is secure!`
            : `Combo de apărare ${newCombo}x! Rețeaua școlii este impenetrabilă!`
        );
      }
    } else {
      sounds.playWrong();
      setCombo(0);

      // Penalize server health if dangerous packet allowed
      if (allow && currentPacket.isDangerous) {
        setServerHealth((prev) => Math.max(0, prev - 25));
        setActionFeedback({
          isCorrect: false,
          message: lang === 'en'
            ? `Security Breach! You allowed malware (${currentPacket.name}) into the server! (-25% HP)`
            : `Breșă de Securitate! Ai lăsat virusul (${currentPacket.name}) să intre în server! (-25% Integritate)`,
        });
      } else {
        // Blocked legitimate packet
        setServerHealth((prev) => Math.max(0, prev - 10));
        setActionFeedback({
          isCorrect: false,
          message: lang === 'en'
            ? `False Positive! You blocked legitimate school homework traffic! (-10% HP)`
            : `Fals Pozitiv! Ai blocat accesul legitim la temele școlare! (-10% Integritate)`,
        });
      }
    }

    // Next packet
    setTimeout(() => {
      setActionFeedback(null);
      setCurrentPacket(getRandomPacket());
    }, 450);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
        </button>

        <div className="flex items-center gap-2 text-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'Firewall Defender (Cyber Shield)' : 'Scutul Antivirus & Firewall Defender'}
            </h1>
            <p className="text-[11px] text-rose-400 font-mono">
              {lang === 'en' ? 'Inspect Traffic Packets & Block Inbound Cyber Threats' : 'Inspectează Pachetele de Rețea și Blochează Virușii'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Record: {highScore} pts</span>
        </div>
      </div>

      {/* Main Container */}
      {!isPlaying && !isGameOver ? (
        /* Welcome / Tutorial Screen */
        <div className="bg-slate-900/95 border-2 border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 ring-4 ring-rose-500/20">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 uppercase tracking-wider">
              {lang === 'en' ? 'Network Security Simulator' : 'Simulator de Securitate a Rețelelor'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-2">
              {lang === 'en' ? 'Protect the School Server from Inbound Viruses!' : 'Apără Serverul Școlii de Pachetele Răuvoitoare!'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Incoming traffic packets are reaching the server gateway. Analyze their protocol, port, IP, and payload. Allow clean educational traffic and BLOCK trojans, DDoS floods, and worm viruses!'
                : 'Pachetele de date sosesc în gateway-ul școlii. Analizează protocolul, portul și descrierea. Apasă pe "PERMITE" pentru traficul școlar curat și pe "BLOCHEAZĂ" pentru viruși și atacuri!'}
            </p>
          </div>

          {/* Rules Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full text-left">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-heading">Pachete Curate (Permite)</strong>
                <span>Domenii educaționale (.edu.ro, Google Classroom), protocol HTTPS securizat, port 443.</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-heading">Amenințări (Blochează)</strong>
                <span>Viermi de rețea (port 445 SMB), atacuri DDoS de inundație, keyloggere și troieni executabili.</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm sm:text-base transition shadow-xl shadow-rose-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{lang === 'en' ? 'Start 45s Firewall Defense!' : 'Activează Scutul Firewall (45s)!'}</span>
          </button>
        </div>
      ) : isPlaying && currentPacket ? (
        /* Active Defense Interface */
        <div className="bg-slate-900/95 border-2 border-rose-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-6 relative">
          {/* Top Bar: Timer, Server Health & Score */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-blue-400'}`} />
              <span className={`text-sm font-black font-mono ${timeLeft <= 10 ? 'text-rose-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>

            {/* Server Integrity Health Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <Server className={`w-5 h-5 ${serverHealth <= 30 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span className="text-slate-400">{lang === 'en' ? 'Server Integrity:' : 'Integritate Server:'}</span>
                  <span className={serverHealth <= 30 ? 'text-rose-400' : 'text-emerald-400'}>
                    {serverHealth}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      serverHealth <= 30 ? 'bg-rose-500' : serverHealth <= 60 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${serverHealth}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Score & Combo */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 font-mono">{combo}x</span>
              </div>
              <div className="bg-slate-950 px-3.5 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-black text-white font-mono">{score} pts</span>
              </div>
            </div>
          </div>

          {/* Incoming Packet Card under Inspection */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 sm:p-6 shadow-inner flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {lang === 'en' ? 'Incoming Network Packet' : 'Pachet Sosit în Inspecție'}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-500">ID: #{currentPacket.id}</span>
            </div>

            {/* Packet Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Protocol</span>
                <span className="text-xs font-black text-white font-mono mt-0.5">
                  {currentPacket.protocol}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Port Rețea</span>
                <span className="text-xs font-black text-amber-300 font-mono mt-0.5">
                  Port :{currentPacket.port}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono uppercase">IP Sursă</span>
                <span className="text-xs font-black text-slate-200 font-mono mt-0.5 truncate">
                  {currentPacket.sourceIp}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Mărime Payload</span>
                <span className="text-xs font-black text-cyan-300 font-mono mt-0.5">
                  {currentPacket.payloadSize}
                </span>
              </div>
            </div>

            {/* Packet Header & Description */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white font-heading">
                  {currentPacket.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentPacket.isDangerous
                    ? (lang === 'en' ? currentPacket.threatDetailsEn : currentPacket.threatDetailsRo)
                    : (lang === 'en' ? currentPacket.cleanDetailsEn : currentPacket.cleanDetailsRo)}
                </p>
              </div>
            </div>

            {/* Feedback Badge */}
            {actionFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold font-mono animate-fadeIn flex items-center gap-2 ${
                  actionFeedback.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {actionFeedback.isCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span>{actionFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Big Firewall Decision Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleDecision(true)}
              className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base transition shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{lang === 'en' ? 'ALLOW (Safe Traffic)' : 'PERMITE (Trafic Curat)'}</span>
            </button>

            <button
              onClick={() => handleDecision(false)}
              className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base transition shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>{lang === 'en' ? 'BLOCK (Malware / Attack)' : 'BLOCHEAZĂ (Virus / Atac)'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-slate-900/95 border-2 border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center gap-6">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl ring-4 ${
              serverHealth > 0
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/20 ring-emerald-500/20 animate-bounce'
                : 'bg-gradient-to-tr from-rose-600 to-red-700 text-white shadow-rose-500/20 ring-rose-500/20'
            }`}
          >
            {serverHealth > 0 ? '🛡️' : '💥'}
          </div>

          <div>
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                serverHealth > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              {serverHealth > 0
                ? (lang === 'en' ? 'Server Protected!' : 'Server Protejat cu Succes!')
                : (lang === 'en' ? 'Server Overwhelmed!' : 'Serverul a fost Compromis!')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-2">
              {studentName ? `${studentName}, ` : ''}
              {serverHealth >= 70
                ? (lang === 'en' ? 'Chief Network Defense Officer! 🛡️⭐' : 'Comandant al Securității de Rețea! 🛡️⭐')
                : serverHealth > 0
                ? (lang === 'en' ? 'Firewall Guardian! 💻' : 'Paznic Vigilent al Rețelei! 💻')
                : (lang === 'en' ? 'System Overloaded! Retry! ⚠️' : 'Breșă de Securitate! Reîncearcă! ⚠️')}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl w-full">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Scor Total</span>
              <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono mt-1">
                {score}
              </span>
              <span className="text-[11px] text-slate-500">puncte</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Integritate Server</span>
              <span className={`text-3xl sm:text-4xl font-black font-mono mt-1 ${serverHealth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {serverHealth}%
              </span>
              <span className="text-[11px] text-slate-500">HP rămas</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Pachete Procesate</span>
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mt-1">
                {processedCount}
              </span>
              <span className="text-[11px] text-slate-500">corecte</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Max Combo</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1">
                {maxCombo}x
              </span>
              <span className="text-[11px] text-slate-500">consecutive</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'en' ? 'Play Again' : 'Joacă din Nou'}</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm transition border border-slate-700 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
