import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  ShieldAlert,
  Server,
  Zap,
  Flame,
  Globe,
  Mail,
  Lock,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { DuelRoomData, updateDuelProgress } from '../../lib/duelService';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

interface NetworkPacketRacerDuelGameProps {
  roomData: DuelRoomData | null;
  isHost: boolean;
  studentName: string;
  studentAvatar: string;
  onFinish: (score: number, won: boolean) => void;
  onBack: () => void;
}

export type RoutingTarget = 'port_443' | 'port_53' | 'port_25' | 'firewall_drop';

interface NetworkPacket {
  id: number;
  sourceIp: string;
  destIp: string;
  protocol: string;
  summary: string;
  summaryEn?: string;
  target: RoutingTarget;
  isThreat: boolean;
  conceptRo: string;
  conceptEn?: string;
}

const PACKET_STREAM: NetworkPacket[] = [
  {
    id: 1,
    sourceIp: '192.168.1.15',
    destIp: '142.250.180.195:443',
    protocol: 'HTTPS (SSL/TLS)',
    summary: 'Cerere pagină web securizată [Google Classroom]',
    summaryEn: 'Secure webpage request [Google Classroom]',
    target: 'port_443',
    isThreat: false,
    conceptRo: 'Portul 443 este standardul internațional pentru navigare web criptată securizată (HTTPS).',
    conceptEn: 'Port 443 is the global standard for secure encrypted web browsing (HTTPS).'
  },
  {
    id: 2,
    sourceIp: '10.0.0.4',
    destIp: '8.8.8.8:53',
    protocol: 'DNS Query (UDP)',
    summary: 'Interogare nume domeniu: "edu.ro" -> Ce adresă IP are?',
    summaryEn: 'Domain name query: "edu.ro" -> What is the IP address?',
    target: 'port_53',
    isThreat: false,
    conceptRo: 'Portul 53 (DNS) rezolvă denumirile textuale ale site-urilor în adrese IP numerice.',
    conceptEn: 'Port 53 (DNS) translates textual domain names into numeric IP addresses.'
  },
  {
    id: 3,
    sourceIp: '185.220.101.5',
    destIp: '192.168.1.1:0',
    protocol: 'SYN Flood DDOS',
    summary: 'ATAC MALȚIOS! 50.000 pachete false pentru blocarea routerului!',
    summaryEn: 'MALICIOUS ATTACK! 50,000 bogus packets flooding to crash the router!',
    target: 'firewall_drop',
    isThreat: true,
    conceptRo: 'Atacurile de tip Denial of Service (DDoS) trebuie blocate imediat în Firewall (Drop Packet).',
    conceptEn: 'Denial of Service (DDoS) attacks must be dropped immediately by the Firewall (Drop Packet).'
  },
  {
    id: 4,
    sourceIp: '192.168.1.22',
    destIp: 'mail.scoala.ro:587',
    protocol: 'SMTP / Mail Transfer',
    summary: 'Trimitere mesaj email cu tema la TIC către profesor',
    summaryEn: 'Sending email message with ICT homework to the teacher',
    target: 'port_25',
    isThreat: false,
    conceptRo: 'Protocoalele SMTP (port 25 / 587) se ocupă de transmiterea mesajelor de poștă electronică (email).',
    conceptEn: 'SMTP protocols (port 25 / 587) handle transferring outgoing electronic mail (email).'
  },
  {
    id: 5,
    sourceIp: '192.168.1.50',
    destIp: '151.101.65.140:443',
    protocol: 'HTTPS Stream',
    summary: 'Descărcare librărie JavaScript securizată pentru proiect',
    summaryEn: 'Downloading secure JavaScript library for project',
    target: 'port_443',
    isThreat: false,
    conceptRo: 'Traficul securizat web utilizează certificate digitale TLS pe portul 443.',
    conceptEn: 'Secure web traffic relies on TLS digital certificates over port 443.'
  },
  {
    id: 6,
    sourceIp: '45.143.203.2',
    destIp: '192.168.1.100:445',
    protocol: 'WannaCry Ransomware Probe',
    summary: 'Scanare SMB vulnerabilă pentru criptare forțată de fișiere!',
    summaryEn: 'Vulnerable SMB probe attempting forced file ransomware encryption!',
    target: 'firewall_drop',
    isThreat: true,
    conceptRo: 'Pachetele de scanare neautorizate sunt detectate de sistemul IDS/IPS și carantinate.',
    conceptEn: 'Unauthorized network scanning probes are caught by IDS/IPS and quarantined.'
  },
  {
    id: 7,
    sourceIp: '10.0.0.12',
    destIp: '1.1.1.1:53',
    protocol: 'DNS Lookup',
    summary: 'Află serverul pentru "wikipedia.org"',
    summaryEn: 'Lookup host server for "wikipedia.org"',
    target: 'port_53',
    isThreat: false,
    conceptRo: 'DNS-ul funcționează ca o carte de telefon a întregului internet mondial.',
    conceptEn: 'DNS operates like the universal phonebook of the entire World Wide Web.'
  },
  {
    id: 8,
    sourceIp: '192.168.1.33',
    destIp: 'smtp.gmail.com:25',
    protocol: 'SMTP Relay',
    summary: 'Notificare automată notă test laborator TIC',
    summaryEn: 'Automated ICT lab exam grade notification dispatch',
    target: 'port_25',
    isThreat: false,
    conceptRo: 'Releele SMTP transmit corespondența între serverele de mail instituționale.',
    conceptEn: 'SMTP relays transfer mail correspondence between institutional mail servers.'
  },
  {
    id: 9,
    sourceIp: '192.168.1.8',
    destIp: 'netflix.com:443',
    protocol: 'HTTPS Video Stream',
    summary: 'Stream video documentar științific 1080p',
    summaryEn: '1080p scientific documentary video stream',
    target: 'port_443',
    isThreat: false,
    conceptRo: 'Datele criptate pe 443 previn interceptarea conținutului de către intruși (Man-in-the-Middle).',
    conceptEn: 'Encrypted traffic on 443 prevents eavesdropping or Man-in-the-Middle tampering.'
  },
  {
    id: 10,
    sourceIp: '91.240.118.9',
    destIp: '192.168.1.254:22',
    protocol: 'Brute Force SSH Script',
    summary: 'Încercare de ghicire parolă root terminal server!',
    summaryEn: 'Brute force root password guessing attempt on terminal server!',
    target: 'firewall_drop',
    isThreat: true,
    conceptRo: 'Conexiunile de forțare brute-force din surse necunoscute sunt blocate automat de Firewall.',
    conceptEn: 'Brute-force connection attacks from untrusted IPs are automatically blocked by the Firewall.'
  }
];

export const NetworkPacketRacerDuelGame: React.FC<NetworkPacketRacerDuelGameProps> = ({
  roomData,
  isHost,
  studentName,
  studentAvatar,
  onFinish,
  onBack
}) => {
  const { lang } = useLanguage();
  const [packetIndex, setPacketIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [latencyMs, setLatencyMs] = useState(12);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [botProgress, setBotProgress] = useState(0);

  const currentPacket = PACKET_STREAM[packetIndex] || PACKET_STREAM[0];

  // Sync with Firestore Duel Room - Milestone throttled to protect Spark quotas
  const syncProgress = (newScore: number, index: number, done: boolean = false) => {
    if (!roomData) return;
    const progressPercent = Math.min(100, Math.round(((index + (done ? 1 : 0)) / PACKET_STREAM.length) * 100));

    // Only sync to Firestore at 30%, 70%, or 100% finish
    const isMilestone = index === 3 || index === 7 || done;
    if (!isMilestone) return;

    const myId = isHost ? roomData.host.id : roomData.guest?.id;

    updateDuelProgress(
      roomData.roomCode,
      isHost,
      {
        progress: done ? 100 : progressPercent,
        score: newScore,
        currentStageIndex: index,
        finishedAt: done ? Date.now() : undefined
      },
      myId,
      studentName
    );
  };

  // Bot simulation for practice mode
  useEffect(() => {
    if (roomData && roomData.guest && roomData.guest.id !== 'practice_bot') return;
    if (isFinished) return;

    const interval = setInterval(() => {
      setBotProgress((prev) => {
        const next = Math.min(100, prev + Math.floor(Math.random() * 8) + 6);
        if (next >= 100 && !isFinished) {
          setIsFinished(true);
          sounds.playFailure();
          onFinish(score, false);
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [roomData, isFinished, score, onFinish]);

  // Route decision action
  const handleRoute = (chosenTarget: RoutingTarget) => {
    if (isLocked || isFinished) return;
    setIsLocked(true);

    const isCorrect = chosenTarget === currentPacket.target;

    if (isCorrect) {
      sounds.playCorrect();
      const newStreak = streak + 1;
      const pts = 150 + newStreak * 25;
      const newScore = score + pts;

      setScore(newScore);
      setStreak(newStreak);
      setLatencyMs((prev) => Math.max(4, prev - 2));

      setFeedback({
        isCorrect: true,
        text: lang === 'en'
          ? `⚡ Excellent! ${currentPacket.conceptEn || currentPacket.conceptRo}`
          : `⚡ Excelent! ${currentPacket.conceptRo}`
      });

      setTimeout(() => {
        setFeedback(null);
        setIsLocked(false);
        const nextIndex = packetIndex + 1;

        if (nextIndex < PACKET_STREAM.length) {
          setPacketIndex(nextIndex);
          syncProgress(newScore, nextIndex, false);
        } else {
          // Finished all packets!
          setIsFinished(true);
          sounds.playVictory();
          syncProgress(newScore, nextIndex, true);
          onFinish(newScore, true);
        }
      }, 1200);
    } else {
      sounds.playWrong();
      setStreak(0);
      setLatencyMs(280); // Latency lag spike penalty
      const penalizedScore = Math.max(0, score - 30);
      setScore(penalizedScore);

      setFeedback({
        isCorrect: false,
        text: lang === 'en'
          ? `⚠️ Packet collision! Routing error: ${currentPacket.conceptEn || currentPacket.conceptRo}`
          : `Coliziune de pachet! Eroare de rutare: ${currentPacket.conceptRo}`
      });

      setTimeout(() => {
        setFeedback(null);
        setIsLocked(false);
      }, 1800);
    }
  };

  // Keyboard shortcut listener: [1, 2, 3, 4]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked || isFinished) return;
      if (e.key === '1') handleRoute('port_443');
      if (e.key === '2') handleRoute('port_53');
      if (e.key === '3') handleRoute('port_25');
      if (e.key === '4' || e.key === ' ') handleRoute('firewall_drop');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, isFinished, packetIndex, currentPacket]);

  const opponent = isHost ? roomData?.guest : roomData?.host;
  const oppProgress = roomData?.guest ? (opponent?.progress || 0) : botProgress;
  const oppName = opponent?.name || 'Router Bot 🤖';
  const myProgress = Math.round((packetIndex / PACKET_STREAM.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 select-none">
      {/* Top Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xl shadow-md border border-indigo-500/30">
            🌐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white font-heading tracking-tight">
                Network Packet Racer 1v1
              </h3>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase">
                {lang === 'en' ? 'Packet' : 'Pachet'} {packetIndex + 1}/{PACKET_STREAM.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Route data packets to the correct port or drop attacks at the Firewall!'
                : 'Rutează pachetele de date către portul corect sau blochează atacurile în Firewall!'}
            </p>
          </div>
        </div>

        {/* Latency & Score Meter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <Activity className={`w-3.5 h-3.5 ${latencyMs < 50 ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
            <span className="text-[11px] font-mono font-bold text-slate-300">
              Ping: <span className={latencyMs < 50 ? 'text-emerald-400' : 'text-rose-400'}>{latencyMs}ms</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              {lang === 'en' ? 'Routing Score' : 'Scor Rutare'}
            </span>
            <span className="text-base font-black text-amber-300 font-mono">+{score} XP</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>x{streak} Overclock</span>
            </div>
          )}
        </div>
      </div>

      {/* Duel Competitors Progress Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>{studentAvatar}</span>
              <span>{studentName} {lang === 'en' ? '(You)' : '(Tu)'}</span>
            </span>
            <span className="font-mono font-bold text-cyan-400">{myProgress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-200"
              style={{ width: `${myProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <span>{opponent?.avatar || '🤖'}</span>
              <span>{oppName}</span>
            </span>
            <span className="font-mono font-bold text-rose-400">{oppProgress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300"
              style={{ width: `${oppProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Central Packet Conveyor Belt / Terminal */}
      <div className="p-6 rounded-3xl bg-slate-900 border-2 border-indigo-500/30 shadow-2xl space-y-5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
          <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
            <Server className="w-4 h-4" />
            GATEWAY SWITCH ROUTER [RX BUFFER]
          </span>
          <span className="text-[11px] text-amber-300">
            {lang === 'en' ? 'Keyboard: Keys [1], [2], [3] or [4 / Space]' : 'Tastatură: Tastele [1], [2], [3] sau [4 / Space]'}
          </span>
        </div>

        {/* Incoming Packet Card */}
        <div className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
          currentPacket.isThreat
            ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/30 animate-pulse'
            : 'bg-slate-950 border-indigo-500/50 shadow-inner'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-black ${
                currentPacket.isThreat ? 'bg-rose-500 text-white' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {currentPacket.protocol}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {lang === 'en' ? 'Source IP:' : 'IP Sursă:'} <strong className="text-slate-200">{currentPacket.sourceIp}</strong>
              </span>
            </div>

            <div className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Destination:' : 'Destinație:'} <strong className="text-amber-300">{currentPacket.destIp}</strong>
            </div>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-white mb-1">
            {(lang === 'en' ? currentPacket.summaryEn : currentPacket.summary) || currentPacket.summary}
          </h4>
          <p className="text-xs text-slate-400">
            {lang === 'en'
              ? 'Identify the correct packet destination and direct it by pressing the corresponding button.'
              : 'Identifică destinația corectă a pachetului și direcționează-l prin apăsarea butonului corespunzător.'}
          </p>

          {/* Feedback Overlay */}
          {feedback && (
            <div className={`mt-3 p-3 rounded-xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500 text-rose-200 animate-shake'
            }`}>
              {feedback.isCorrect ? '✅' : '⚠️'}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>

        {/* 4 Routing Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Option 1: Port 443 HTTPS */}
          <button
            type="button"
            disabled={isLocked || isFinished}
            onClick={() => handleRoute('port_443')}
            className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950 to-slate-900 hover:from-cyan-900 hover:to-slate-800 border-2 border-cyan-500/40 hover:border-cyan-400 text-left transition-all active:scale-98 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-lg"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-black text-cyan-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                PORT 443 (HTTPS)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                {lang === 'en' ? '[Key 1]' : '[Tasta 1]'}
              </span>
            </div>
            <span className="text-sm font-bold text-white block">
              {lang === 'en' ? 'SSL Encrypted Web Traffic' : 'Trafic Web Criptat SSL'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {lang === 'en' ? 'Google Classroom, Wikipedia, Secure streaming' : 'Google Classroom, Wikipedia, Streaming securizat'}
            </span>
          </button>

          {/* Option 2: Port 53 DNS */}
          <button
            type="button"
            disabled={isLocked || isFinished}
            onClick={() => handleRoute('port_53')}
            className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 to-slate-900 hover:from-purple-900 hover:to-slate-800 border-2 border-purple-500/40 hover:border-purple-400 text-left transition-all active:scale-98 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-lg"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-black text-purple-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                PORT 53 (DNS Resolver)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                {lang === 'en' ? '[Key 2]' : '[Tasta 2]'}
              </span>
            </div>
            <span className="text-sm font-bold text-white block">
              {lang === 'en' ? 'Domain Name Resolution' : 'Rezolvare Nume Domeniu'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {lang === 'en' ? 'Translating textual domain names into numeric IP addresses' : 'Translatare adrese text (edu.ro) în adrese IP numerice'}
            </span>
          </button>

          {/* Option 3: Port 25 / 587 SMTP Mail */}
          <button
            type="button"
            disabled={isLocked || isFinished}
            onClick={() => handleRoute('port_25')}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-950 to-slate-900 hover:from-amber-900 hover:to-slate-800 border-2 border-amber-500/40 hover:border-amber-400 text-left transition-all active:scale-98 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-lg"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-black text-amber-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                PORT 25 / 587 (SMTP Mail)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {lang === 'en' ? '[Key 3]' : '[Tasta 3]'}
              </span>
            </div>
            <span className="text-sm font-bold text-white block">
              {lang === 'en' ? 'Email Messaging Server' : 'Server Mesagerie Email'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {lang === 'en' ? 'Sending homework and school email correspondence' : 'Trimitere teme și corespondență electronică școlară'}
            </span>
          </button>

          {/* Option 4: FIREWALL DROP (Malware / DDOS) */}
          <button
            type="button"
            disabled={isLocked || isFinished}
            onClick={() => handleRoute('firewall_drop')}
            className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 to-slate-900 hover:from-rose-900 hover:to-slate-800 border-2 border-rose-500/60 hover:border-rose-400 text-left transition-all active:scale-98 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-lg ring-1 ring-rose-500/30"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-black text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                🚨 FIREWALL DROP (BLOCK)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 font-bold">
                {lang === 'en' ? '[Key 4 / Space]' : '[Tasta 4 / Space]'}
              </span>
            </div>
            <span className="text-sm font-bold text-white block">
              {lang === 'en' ? 'Block Malicious Attack' : 'Blochează Atacul Malțios'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {lang === 'en' ? 'Quarantine DDoS, ransomware worms, and brute-force probes' : 'Carantinează DDOS, viermi ransomware și atacuri brute-force'}
            </span>
          </button>
        </div>
      </div>

      {/* Footer Exit */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
        >
          ← {lang === 'en' ? 'Leave Duel' : 'Părăsește Duelul'}
        </button>

        <span className="text-xs text-slate-500 font-mono">
          {lang === 'en' ? 'Progress:' : 'Progres:'} {packetIndex}/{PACKET_STREAM.length} {lang === 'en' ? 'Packets Routed' : 'Pachete Direcționate'}
        </span>
      </div>
    </div>
  );
};
