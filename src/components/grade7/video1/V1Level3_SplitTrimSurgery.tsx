import React, { useState } from 'react';
import { Scissors, Play, Square, RotateCcw, Trash2, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle, Film, ShieldCheck, Zap } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface V1Level3Props {
  onPass: (score: number) => void;
}

interface VideoSegment {
  id: string;
  start: number; // in seconds
  end: number;
  label: string;
  isBad: boolean; // 2.4s - 5.2s segment
  selected?: boolean;
}

export const V1Level3_SplitTrimSurgery: React.FC<V1Level3Props> = ({ onPass }) => {
  // Simulator State
  // Raw footage is 10.0 seconds
  const [playheadTime, setPlayheadTime] = useState<number>(2.4); // current cursor in seconds (0.0 - 10.0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [segments, setSegments] = useState<VideoSegment[]>([
    { id: 'seg-1', start: 0, end: 10.0, label: 'Cadru Brut: Prezentare Laborator Robotică', isBad: false }
  ]);
  const [selectedSegId, setSelectedSegId] = useState<string | null>(null);
  const [surgeryCompleted, setSurgeryCompleted] = useState<boolean>(false);

  // Playhead scrubber animation
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayheadTime((prev) => {
        const totalDuration = segments.reduce((acc, s) => acc + (s.end - s.start), 0);
        if (prev >= totalDuration - 0.1) {
          setIsPlaying(false);
          return 0;
        }
        return Number((prev + 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, segments]);

  // Quiz questions state with 5s cooldown
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q1ErrorMsg, setQ1ErrorMsg] = useState<string>('');

  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q2ErrorMsg, setQ2ErrorMsg] = useState<string>('');

  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);
  const [q3ErrorMsg, setQ3ErrorMsg] = useState<string>('');

  // 5s cooldown timers
  React.useEffect(() => {
    if (q1Cooldown > 0) {
      const timer = setTimeout(() => setQ1Cooldown(q1Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q1Cooldown]);

  React.useEffect(() => {
    if (q2Cooldown > 0) {
      const timer = setTimeout(() => setQ2Cooldown(q2Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q2Cooldown]);

  React.useEffect(() => {
    if (q3Cooldown > 0) {
      const timer = setTimeout(() => setQ3Cooldown(q3Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q3Cooldown]);

  // Split at playheadTime
  const handleSplitAtPlayhead = () => {
    sounds.playClick();
    // Find segment containing playheadTime
    let accumulated = 0;
    const newSegments: VideoSegment[] = [];
    let didSplit = false;

    for (const seg of segments) {
      const segDuration = seg.end - seg.start;
      const segStartInTimeline = accumulated;
      const segEndInTimeline = accumulated + segDuration;

      if (!didSplit && playheadTime > segStartInTimeline + 0.2 && playheadTime < segEndInTimeline - 0.2) {
        // Split this segment
        const splitOffset = playheadTime - segStartInTimeline;
        const splitPointInClip = seg.start + splitOffset;

        const part1: VideoSegment = {
          id: `seg-${Date.now()}-1`,
          start: seg.start,
          end: splitPointInClip,
          label: splitPointInClip <= 2.5 ? 'Intro Reușit (00:00 - 02:40)' : 'Clip Segmentat A',
          isBad: seg.start >= 2.3 && splitPointInClip <= 5.3
        };

        const part2: VideoSegment = {
          id: `seg-${Date.now()}-2`,
          start: splitPointInClip,
          end: seg.end,
          label: splitPointInClip >= 5.0 ? 'Demonstrație Robot (05:20 - 10:00)' : 'Defect / Tremurat (02:40 - 05:20)',
          isBad: splitPointInClip >= 2.3 && seg.end <= 5.3
        };

        newSegments.push(part1, part2);
        didSplit = true;
      } else {
        newSegments.push(seg);
      }
      accumulated += segDuration;
    }

    if (didSplit) {
      setSegments(newSegments);
      sounds.playSuccess();
    }
  };

  // Ripple Delete selected segment
  const handleRippleDelete = () => {
    if (!selectedSegId) return;
    sounds.playClick();
    const segToDelete = segments.find((s) => s.id === selectedSegId);
    const updated = segments.filter((s) => s.id !== selectedSegId);
    setSegments(updated);
    setSelectedSegId(null);
    setPlayheadTime(0);

    // If the bad segment was removed and remaining are clean
    if (segToDelete?.isBad || (updated.length === 2 && !updated.some((s) => s.isBad))) {
      setSurgeryCompleted(true);
      sounds.playLevelComplete();
    }
  };

  // Reset Surgery
  const handleResetSurgery = () => {
    sounds.playClick();
    setSegments([
      { id: 'seg-1', start: 0, end: 10.0, label: 'Cadru Brut: Prezentare Laborator Robotică', isBad: false }
    ]);
    setSelectedSegId(null);
    setPlayheadTime(2.4);
    setSurgeryCompleted(false);
  };

  const handleQ1Select = (opt: string) => {
    if (q1Cooldown > 0 || q1Answer === 'B') return;
    if (opt === 'B') {
      sounds.playSuccess();
      setQ1Answer('B');
      setQ1ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ1Cooldown(5);
      setQ1ErrorMsg('Incorect! Tasta rapidă standard în VideoPad pentru tăiere (Split la cursor) este tasta „L”. Ea separă clipul în două bucăți independente fără a șterge vreun cadru.');
    }
  };

  const handleQ2Select = (opt: string) => {
    if (q2Cooldown > 0 || q2Answer === 'C') return;
    if (opt === 'C') {
      sounds.playSuccess();
      setQ2Answer('C');
      setQ2ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ2Cooldown(5);
      setQ2ErrorMsg('Incorect! Ștergerea simplă (Delete) lasă un gol negru (gap) pe cronologie. Ștergerea cu ondulare (Ripple Delete) trage automat toate clipurile următoare spre stânga, închizând spațiul gol!');
    }
  };

  const handleQ3Select = (opt: string) => {
    if (q3Cooldown > 0 || q3Answer === 'A') return;
    if (opt === 'A') {
      sounds.playSuccess();
      setQ3Answer('A');
      setQ3ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ3Cooldown(5);
      setQ3ErrorMsg('Incorect! Operațiile de Split și Trim din VideoPad sunt non-destructive (nedistructive). Fișierul video original de pe hard disk rămâne intact; proiectul salvează doar punctele virtuale de început și sfârșit.');
    }
  };

  const allQuestionsCorrect = q1Answer === 'B' && q2Answer === 'C' && q3Answer === 'A';

  const handleComplete = () => {
    if (!allQuestionsCorrect || !surgeryCompleted) return;
    sounds.playLevelComplete();
    onPass(100);
  };

  // Determine what video frame shows at playheadTime
  const getCurrentFrameStatus = () => {
    // If not split yet, 2.4 - 5.2 is camera shake
    if (segments.length === 1) {
      if (playheadTime >= 2.4 && playheadTime <= 5.2) {
        return {
          type: 'bad',
          title: '⚠️ ZONĂ DEFECTĂ: Cameră Scăpată & Tuse (02:40 - 05:20)',
          desc: 'Operatorul a scăpat camera din mână și se aude o tuse. Acest segment trebuie decupat cu Split și eliminat!'
        };
      }
      return {
        type: 'good',
        title: '✅ Cadru Reușit: Elevul explică robotul inteligent',
        desc: 'Imagine stabilă, sunet clar, iluminare optimă.'
      };
    }

    if (surgeryCompleted) {
      return {
        type: 'clean',
        title: '🎉 Cadru Curățat Profesional (Montaj fără goluri)',
        desc: 'Partea defectă a fost eliminată prin Ripple Delete. Secvențele bune se leagă perfect!'
      };
    }

    return {
      type: 'in-progress',
      title: 'Montaj în Desfășurare',
      desc: 'Selectează segmentul defect dintre 02:40 și 05:20 și apasă Ripple Delete.'
    };
  };

  const frameStatus = getCurrentFrameStatus();

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto text-slate-100">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/60 via-pink-900/40 to-slate-900 p-6 rounded-2xl border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 text-rose-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Scissors className="w-4 h-4" />
          <span>Nivelul 3 • Editare Chirurgicală & Scurtare Clipuri (Manual pag. 40–41)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Operația Split (Tasta L) & Ștergerea cu Ondulare (Ripple Delete)
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          Nimeni nu filmează un cadru perfect dintr-o singură dublă. Secretul montajului este{' '}
          <strong className="text-white">decuparea chirurgicală</strong>: identifici ezitările, bâlbele sau mișcările bruște de cameră, fragmentezi clipul exact la limită și elimini reziduurile fără a lăsa spații negre.
        </p>
      </div>

      {/* Theory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <Scissors className="w-4 h-4" />
            <span>1. Split la Cursor (Tasta L)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Plasezi cursorul roșu pe cronologie și apeși tasta <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-rose-300 font-mono font-bold">L</kbd>. Clipul se desparte în două segmente independente la milisecundă.
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
            <Trash2 className="w-4 h-4" />
            <span>2. Delete vs. Ripple Delete</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Delete simplu:</strong> Șterge segmentul și lasă o gaură neagră pe ecran.<br />
            <strong className="text-pink-300">Ripple Delete (Ondulare):</strong> Șterge segmentul și trage automat clipul următor la stânga pentru a lipi tăietura!
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>3. Editare Nedistructivă</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Fișierele brute de pe hard disk nu se modifică niciodată. VideoPad creează doar repere matematice în fișierul de proiect. Oricând poți trage de margini pentru a reface materialul.
          </p>
        </div>
      </div>

      {/* Interactive Simulator: Raw Footage Surgery */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-rose-400 tracking-wider">Laborator Practic Chirurgical</span>
            <h3 className="text-lg font-bold text-white">Misiune: Curăță Înregistrarea din Laboratorul de Robotică</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetSurgery}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetează Clipul</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsPlaying(!isPlaying);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pauză' : 'Previzualizează'}</span>
            </button>
          </div>
        </div>

        {/* Video Monitor Frame */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-inner relative flex flex-col justify-between p-4">
            {/* Header info */}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-mono bg-slate-950/80 px-2.5 py-1 rounded text-slate-300 border border-slate-800">
                TIMECODE: 00:0{Math.floor(playheadTime)}.{Math.round((playheadTime % 1) * 100)}s
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                frameStatus.type === 'bad'
                  ? 'bg-rose-950/90 text-rose-400 border-rose-700 animate-pulse'
                  : 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
              }`}>
                {frameStatus.type === 'bad' ? 'DEFECT DETECTAT' : 'SEMNAL VIDEO STABIL'}
              </span>
            </div>

            {/* Video Frame Animation / Visualizer */}
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              {frameStatus.type === 'bad' ? (
                <div className="flex flex-col items-center gap-2 animate-bounce text-rose-300">
                  <div className="text-4xl">📳💥</div>
                  <div className="font-extrabold text-sm">{frameStatus.title}</div>
                  <div className="text-xs text-rose-200/80 max-w-md">{frameStatus.desc}</div>
                </div>
              ) : surgeryCompleted ? (
                <div className="flex flex-col items-center gap-2 text-emerald-300">
                  <div className="text-4xl">🎬✨</div>
                  <div className="font-extrabold text-sm">{frameStatus.title}</div>
                  <div className="text-xs text-emerald-200/80 max-w-md">{frameStatus.desc}</div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-sky-200">
                  <div className="text-4xl">🤖🎙️</div>
                  <div className="font-extrabold text-sm">{frameStatus.title}</div>
                  <div className="text-xs text-sky-300/80 max-w-md">{frameStatus.desc}</div>
                </div>
              )}
            </div>

            {/* Status footer inside monitor */}
            <div className="z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800">
              <span>Rezoluție: 1920x1080 (Full HD)</span>
              <span>Cadre: 30 FPS</span>
            </div>
          </div>
        </div>

        {/* Surgical Timeline & Scrubber */}
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Poziționează Cursorul:</span>
              <button
                type="button"
                onClick={() => setPlayheadTime(2.4)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 text-xs font-mono cursor-pointer"
              >
                Sari la 02:40 (Start Tremurat)
              </button>
              <button
                type="button"
                onClick={() => setPlayheadTime(5.2)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 text-xs font-mono cursor-pointer"
              >
                Sari la 05:20 (Sfârșit Tremurat)
              </button>
            </div>

            {/* Surgical Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSplitAtPlayhead}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Scissors className="w-4 h-4" />
                <span>Split la Cursor (Tasta L)</span>
              </button>
              <button
                type="button"
                disabled={!selectedSegId}
                onClick={handleRippleDelete}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  selectedSegId
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Ripple Delete (Ondulare)</span>
              </button>
            </div>
          </div>

          {/* Scrubber slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
              <span>00:00</span>
              <span className="text-rose-400 font-bold">02:40 [Zonă Tremurată]</span>
              <span className="text-rose-400 font-bold">05:20 [Sfârșit Tremurat]</span>
              <span>10:00</span>
            </div>
            <input
              type="range"
              min="0"
              max={segments.reduce((acc, s) => acc + (s.end - s.start), 0)}
              step="0.1"
              value={playheadTime}
              onChange={(e) => setPlayheadTime(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Interactive Clip Segments Row */}
          <div className="flex items-center gap-1.5 h-14 bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
            {segments.map((seg) => {
              const segDuration = seg.end - seg.start;
              const totalDuration = segments.reduce((acc, s) => acc + (s.end - s.start), 0);
              const widthPercent = (segDuration / totalDuration) * 100;
              const isSelected = selectedSegId === seg.id;

              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedSegId(isSelected ? null : seg.id);
                  }}
                  style={{ width: `${widthPercent}%` }}
                  className={`h-full rounded-md border text-left px-2 flex flex-col justify-center transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-950/40 shadow-lg ring-2 ring-yellow-400/50'
                      : seg.isBad
                      ? 'border-rose-600/60 bg-rose-950/50 hover:bg-rose-900/60 text-rose-200'
                      : 'border-sky-700/60 bg-sky-950/50 hover:bg-sky-900/60 text-sky-200'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate flex items-center gap-1">
                    {seg.isBad ? '⚠️ Defect' : '🎥 Cadru'} • {seg.label}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    Durată: {segDuration.toFixed(1)}s (de la {seg.start.toFixed(1)}s la {seg.end.toFixed(1)}s)
                  </div>
                </button>
              );
            })}
          </div>

          {/* Surgery Steps Guidance */}
          <div className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400">Instrucțiuni Chirurgicale:</span>
              <span>1. Pune cursorul la 02:40 & apasă Split. 2. Pune cursorul la 05:20 & apasă Split. 3. Selectează bucata defectă din mijloc și apasă Ripple Delete!</span>
            </div>
            {surgeryCompleted && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Misiune Practică Reușită!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verification Quiz (3 Questions with 5s cooldown) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Verificare Pedagogică • Tehnici de Tăiere Video (Manual pag. 40–41)</span>
        </div>

        {/* Q1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            1. Care este tasta rapidă din VideoPad folosită pentru a tăia (diviza) un clip exact în poziția cursorului de redare?
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Tasta F5 pentru reîmprospătare.' },
              { id: 'B', text: 'Tasta L (sau pictograma foarfecă din bara de instrumente).' },
              { id: 'C', text: 'Tasta Esc pentru anularea proiectului.' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q1Cooldown > 0 || q1Answer === 'B'}
                onClick={() => handleQ1Select(opt.id)}
                className={`p-3 rounded-xl border text-xs text-left transition cursor-pointer flex flex-col gap-1 ${
                  q1Answer === opt.id
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } ${q1Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold text-rose-400">Opțiunea {opt.id}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          {q1Cooldown > 0 && (
            <div className="text-xs text-rose-400 font-mono flex items-center gap-2 mt-1 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{q1ErrorMsg} (Așteaptă {q1Cooldown}s pentru a reîncerca)</span>
            </div>
          )}
          {q1Answer === 'B' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Corect! Tasta L (Split) este comanda fundamentală folosită de orice editor video.</span>
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            2. Care este marea diferență dintre „Delete” (ștergere simplă) și „Ripple Delete” (ștergere cu ondulare)?
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Delete șterge fișierul fizic de pe hard disk, iar Ripple Delete doar îi schimbă numele.' },
              { id: 'B', text: 'Nu există nicio diferență; ambele comenzi lasă un spațiu negru de 10 secunde.' },
              { id: 'C', text: 'Delete lasă un gol negru pe pistă, în timp ce Ripple Delete trage automat clipurile următoare spre stânga pentru a închide spațiul.' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0 || q2Answer === 'C'}
                onClick={() => handleQ2Select(opt.id)}
                className={`p-3 rounded-xl border text-xs text-left transition cursor-pointer flex flex-col gap-1 ${
                  q2Answer === opt.id
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } ${q2Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold text-rose-400">Opțiunea {opt.id}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          {q2Cooldown > 0 && (
            <div className="text-xs text-rose-400 font-mono flex items-center gap-2 mt-1 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{q2ErrorMsg} (Așteaptă {q2Cooldown}s pentru a reîncerca)</span>
            </div>
          )}
          {q2Answer === 'C' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Corect! Ripple Delete previne ecranele negre accidentale cauzate de spații goale nesupravegheate.</span>
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            3. De ce spunem că tăierea unui clip în VideoPad este o operație „nedistructivă”?
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Pentru că fișierul video original salvat pe calculator rămâne neatins; se modifică doar instrucțiunile din proiect.' },
              { id: 'B', text: 'Pentru că nu putem tăia niciodată mai mult de 2 secunde dintr-un film.' },
              { id: 'C', text: 'Pentru că VideoPad consumă foarte puțin curent electric în timpul montajului.' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q3Cooldown > 0 || q3Answer === 'A'}
                onClick={() => handleQ3Select(opt.id)}
                className={`p-3 rounded-xl border text-xs text-left transition cursor-pointer flex flex-col gap-1 ${
                  q3Answer === opt.id
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } ${q3Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold text-rose-400">Opțiunea {opt.id}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          {q3Cooldown > 0 && (
            <div className="text-xs text-rose-400 font-mono flex items-center gap-2 mt-1 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{q3ErrorMsg} (Așteaptă {q3Cooldown}s pentru a reîncerca)</span>
            </div>
          )}
          {q3Answer === 'A' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Corect! Punctele Trim și Split pot fi ajustate sau anulate oricând fără frica de a pierde filmarea originală.</span>
            </div>
          )}
        </div>
      </div>

      {/* Completion Step Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Finalizează decuparea chirurgicală (Ripple Delete pe segmentul defect) și răspunde corect la cele 3 întrebări.</span>
        </div>

        <button
          type="button"
          disabled={!allQuestionsCorrect || !surgeryCompleted}
          onClick={handleComplete}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
            allQuestionsCorrect && surgeryCompleted
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>Finalizează Nivelul 3 & Treci la Tranziții</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
