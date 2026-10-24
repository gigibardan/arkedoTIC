import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, ZoomIn, ZoomOut, Search, Volume2, AlertTriangle, CheckCircle2, Sparkles, HelpCircle, Activity, Scissors } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A1Level4Props {
  onPass: (score: number) => void;
}

export const A1Level4_WavePadInterface: React.FC<A1Level4Props> = ({ onPass }) => {
  // WavePad interface state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(1200); // 1.2s
  const [zoomLevel, setZoomLevel] = useState<number>(2); // 1x to 8x
  const [selectionRange, setSelectionRange] = useState<{ startMs: number; endMs: number } | null>(null);
  const [foundGlitch, setFoundGlitch] = useState<boolean>(false);

  // Total audio duration: 6 seconds = 6000 ms
  const totalDurationMs = 6000;
  // Parasitic microphone click glitch location: 3420 ms
  const glitchLocationMs = 3420;

  // Live Playhead Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTimeMs((prev) => {
          if (prev >= totalDurationMs) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 50;
        });
      }, 50);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Spacebar to toggle Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target instanceof HTMLElement && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
        sounds.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Format time mm:ss.ms
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor(ms % 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  };

  // Peak Meter Level based on simulated sound wave
  const getPeakLevel = () => {
    if (!isPlaying) return -36;
    // Check if near the glitch
    if (Math.abs(currentTimeMs - glitchLocationMs) < 60) return 0; // Clipping on glitch!
    if (currentTimeMs < 500) return -40;
    // Speech syllables modulation
    const speechWave = Math.sin(currentTimeMs / 120) * 8 - 12;
    return speechWave;
  };
  const peakDb = getPeakLevel();

  // Pedagogical questions state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);

  const [q1ErrorMsg, setQ1ErrorMsg] = useState<string>('');
  const [q2ErrorMsg, setQ2ErrorMsg] = useState<string>('');
  const [q3ErrorMsg, setQ3ErrorMsg] = useState<string>('');

  useEffect(() => {
    if (q1Cooldown > 0) {
      const t = setTimeout(() => setQ1Cooldown(q1Cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [q1Cooldown]);

  useEffect(() => {
    if (q2Cooldown > 0) {
      const t = setTimeout(() => setQ2Cooldown(q2Cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [q2Cooldown]);

  useEffect(() => {
    if (q3Cooldown > 0) {
      const t = setTimeout(() => setQ3Cooldown(q3Cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [q3Cooldown]);

  const isAllAnswered = q1Answer === 'B' && q2Answer === 'C' && q3Answer === 'A' && foundGlitch;

  const handleSelectQ1 = (opt: string) => {
    if (q1Cooldown > 0) return;
    if (opt === 'B') {
      sounds.playCorrect();
      setQ1Answer('B');
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(null);
      setQ1Cooldown(5);
      setQ1ErrorMsg('Incorect! Pe ecranul WavePad, axa orizontală reprezintă Timpul (minute, secunde, sutimi), iar axa verticală reprezintă Amplitudinea / Puterea undei sonore (-100% la +100% sau scala în decibeli). Așteaptă 5 secunde.');
    }
  };

  const handleSelectQ2 = (opt: string) => {
    if (q2Cooldown > 0) return;
    if (opt === 'C') {
      sounds.playCorrect();
      setQ2Answer('C');
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(null);
      setQ2Cooldown(5);
      setQ2ErrorMsg('Incorect! Tasta SPAȚIU (Spacebar) este comanda rapidă universală pentru pornirea și oprirea redării (Play / Pause) în orice editor audio-video profesional. Așteaptă 5 secunde.');
    }
  };

  const handleSelectQ3 = (opt: string) => {
    if (q3Cooldown > 0) return;
    if (opt === 'A') {
      sounds.playCorrect();
      setQ3Answer('A');
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(null);
      setQ3Cooldown(5);
      setQ3ErrorMsg('Incorect! Pentru a inspecta detalii microscopice (un pocnet, un clic de limbă, un fâșâit de 50 milisecunde), folosim comanda Zoom In (sau Ctrl + Rotiță mouse) pentru a mări scara temporală. Așteaptă 5 secunde.');
    }
  };

  const handleSelectGlitch = () => {
    sounds.playCorrect();
    setCurrentTimeMs(glitchLocationMs);
    setSelectionRange({ startMs: 3380, endMs: 3460 });
    setFoundGlitch(true);
  };

  const handleFinish = () => {
    sounds.playCorrect();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-white rounded-3xl border border-sky-500/30 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
            🎛️
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
              <span>Unitatea 2: Acustică Digitală • Manual Art Klett pag. 32–33</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px]">Nivelul 4/7</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              Interfața WavePad: Forma de Undă, Axele Timp/dB, Zoom & Redare
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Consola WavePad</span>
          </span>
        </div>
      </div>

      {/* Ribbon Bar Mockup of WavePad */}
      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
            Acasă (Home)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
            Editare (Edit)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
            Niveluri (Levels)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
            Efecte (Effects)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
            Liniște (Silence)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Proiect: <strong>interviu_liceu.wav</strong></span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">44.1 kHz • 16-bit • Stereo</span>
        </div>
      </div>

      {/* WavePad Main Workspace Simulator */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/95 border-2 border-slate-800 flex flex-col gap-4 shadow-xl">
        {/* Workspace Toolbar: Playback & Zoom Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-850">
          {/* Transport Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsPlaying(!isPlaying);
                sounds.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pauză (Space)' : 'Redare (Play)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentTimeMs(0);
                sounds.playClick();
              }}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
              title="Stop și resetare la început"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            {/* Time Indicator */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-sky-300 font-bold tracking-wider">
              {formatTime(currentTimeMs)} / {formatTime(totalDurationMs)}
            </div>
          </div>

          {/* Zoom Buttons & Glitch Hunter Mission */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Scară Zoom:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[1, 2, 4, 8].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => {
                    setZoomLevel(z);
                    sounds.playClick();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    zoomLevel === z
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {z}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSelectGlitch}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                foundGlitch
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 animate-pulse'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{foundGlitch ? 'Defect Identificat la 03.420s!' : 'Caută Clic Parazit'}</span>
            </button>
          </div>
        </div>

        {/* The Waveform Display Window */}
        <div className="relative rounded-2xl bg-[#070b12] border-2 border-slate-800 p-3 overflow-hidden select-none">
          {/* Vertical dB Scale on Left */}
          <div className="absolute top-3 bottom-8 left-2 w-10 flex flex-col justify-between text-[9px] font-mono text-slate-500 border-r border-slate-800 pr-1 pointer-events-none">
            <span>+0 dB</span>
            <span>-6 dB</span>
            <span className="text-slate-400 font-bold">0</span>
            <span>-6 dB</span>
            <span>-∞ dB</span>
          </div>

          {/* Time axis ruler on top */}
          <div className="ml-12 h-5 border-b border-slate-800 flex justify-between text-[10px] font-mono text-slate-500 mb-2">
            <span>00:00.000</span>
            <span>00:01.500</span>
            <span>00:03.000</span>
            <span>00:04.500</span>
            <span>00:06.000</span>
          </div>

          {/* Waveform Canvas Area */}
          <div
            className="ml-12 h-36 relative cursor-crosshair overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratioX = clickX / rect.width;
              setCurrentTimeMs(Math.round(ratioX * totalDurationMs));
              sounds.playClick();
            }}
          >
            {/* Center zero line */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-slate-800/80 -translate-y-1/2 pointer-events-none" />

            {/* Simulated Audio Waveform Bars */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
              {Array.from({ length: 120 }).map((_, idx) => {
                const barTimeMs = (idx / 120) * totalDurationMs;
                // Generate speech envelope heights
                let height = Math.abs(Math.sin(idx / 4) * 60 + Math.cos(idx / 2) * 20);
                if (idx < 10) height = 4; // Silence at start
                if (idx > 105) height = 6; // Fade out at end

                // If at glitch position (~3420 ms, around idx 68)
                const isGlitchBar = Math.abs(barTimeMs - glitchLocationMs) < 60;
                if (isGlitchBar) {
                  height = 100; // Peak spike
                }

                const isSelected = selectionRange && barTimeMs >= selectionRange.startMs && barTimeMs <= selectionRange.endMs;

                return (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all ${
                      isGlitchBar
                        ? 'bg-rose-500 shadow-lg shadow-rose-500/50'
                        : isSelected
                        ? 'bg-amber-400'
                        : barTimeMs < currentTimeMs
                        ? 'bg-sky-400 opacity-90'
                        : 'bg-slate-700 opacity-60'
                    }`}
                    style={{
                      height: `${Math.min(100, height * (zoomLevel > 2 ? 1.2 : 1))}%`,
                    }}
                  />
                );
              })}
            </div>

            {/* Playhead Indicator (Red Needle) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 pointer-events-none shadow-md shadow-rose-500/80"
              style={{
                left: `${(currentTimeMs / totalDurationMs) * 100}%`,
              }}
            >
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full -translate-x-[4px] -translate-y-1 shadow" />
            </div>

            {/* Selection Highlight */}
            {selectionRange && (
              <div
                className="absolute top-0 bottom-0 bg-amber-500/20 border-x-2 border-amber-400 z-10 pointer-events-none"
                style={{
                  left: `${(selectionRange.startMs / totalDurationMs) * 100}%`,
                  width: `${((selectionRange.endMs - selectionRange.startMs) / totalDurationMs) * 100}%`,
                }}
              >
                <div className="absolute top-1 left-1 text-[9px] font-mono text-amber-300 font-bold bg-slate-900/90 px-1 rounded">
                  Selecție: {selectionRange.endMs - selectionRange.startMs} ms (Defect Clic)
                </div>
              </div>
            )}
          </div>

          {/* Bottom Peak Meter / VU Meter Bar */}
          <div className="ml-12 mt-3 pt-2 border-t border-slate-850 flex items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[11px] text-slate-400 font-bold">Peak Meter L/R:</span>
            <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 flex">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  peakDb >= -1 ? 'bg-rose-500' : peakDb >= -6 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{
                  width: `${Math.max(5, Math.min(100, ((peakDb + 48) / 48) * 100))}%`,
                }}
              />
            </div>
            <span className={`text-[11px] font-bold ${peakDb >= -1 ? 'text-rose-400' : 'text-slate-300'}`}>
              {peakDb >= -1 ? '0.0 dB (PEAK!)' : `${peakDb.toFixed(1)} dB`}
            </span>
          </div>
        </div>
      </div>

      {/* Pedagogical Quiz Section */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-300 font-mono">
            Verificarea Competențelor Tehnice (3 Întrebări Pedagogice)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            1. În fereastra de editare a aplicației WavePad, ce reprezintă axa orizontală și respectiv axa verticală ale formei de undă?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Axa orizontală = viteza procesorului; Axa verticală = spațiul liber de pe disc.' },
              { id: 'B', text: 'Axa orizontală = Timpul (minute:secunde.sutimi); Axa verticală = Amplitudinea / Puterea volumului sonor.' },
              { id: 'C', text: 'Axa orizontală = numărul de difuzoare; Axa verticală = adresa IP a calculatorului.' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q1Cooldown > 0}
                onClick={() => handleSelectQ1(opt.id)}
                className={`p-3 rounded-xl text-xs text-left transition font-medium cursor-pointer border ${
                  q1Answer === opt.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } disabled:opacity-50`}
              >
                <div className="font-bold font-mono text-sky-400 mb-1">Opțiunea {opt.id}:</div>
                {opt.text}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q1ErrorMsg} (Deblocare în: {q1Cooldown}s)</span>
            </div>
          )}
          {q1Answer === 'B' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Corect! Orizontal = Timp, Vertical = Amplitudine (dB / procente).</span>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            2. Care este tasta rapidă standard de la tastatură pentru a porni (Play) sau pune pe pauză (Pause) redarea sunetului în WavePad?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Tasta Escape (Esc)' },
              { id: 'B', text: 'Combinația Alt + F4' },
              { id: 'C', text: 'Bara de Spațiu (Spacebar)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0}
                onClick={() => handleSelectQ2(opt.id)}
                className={`p-3 rounded-xl text-xs text-left transition font-medium cursor-pointer border ${
                  q2Answer === opt.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } disabled:opacity-50`}
              >
                <div className="font-bold font-mono text-cyan-400 mb-1">Opțiunea {opt.id}:</div>
                {opt.text}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q2ErrorMsg} (Deblocare în: {q2Cooldown}s)</span>
            </div>
          )}
          {q2Answer === 'C' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Excelent! Tasta Spațiu este scurtătura universală pentru Play/Pause în orice studio audio-video.</span>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            3. Cum procedăm în WavePad pentru a izola cu precizie milimetrică un mic pocnet sau zgomot de microfon care durează câteva sutimi de secundă?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Mărim zoom-ul pe axa timpului (Zoom In sau Ctrl + Rotiță mouse) până când forma de undă afișează fiecare fracțiune de secundă.' },
              { id: 'B', text: 'Reducem volumul difuzoarelor la 0 ca să dispară zgomotul.' },
              { id: 'C', text: 'Închidem programul și reînregistrăm tot interviul de la zero.' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q3Cooldown > 0}
                onClick={() => handleSelectQ3(opt.id)}
                className={`p-3 rounded-xl text-xs text-left transition font-medium cursor-pointer border ${
                  q3Answer === opt.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                } disabled:opacity-50`}
              >
                <div className="font-bold font-mono text-emerald-400 mb-1">Opțiunea {opt.id}:</div>
                {opt.text}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q3ErrorMsg} (Deblocare în: {q3Cooldown}s)</span>
            </div>
          )}
          {q3Answer === 'A' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Corect! Zoom In permite vizualizarea și tăierea precisă a micro-defectelor.</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          {!foundGlitch ? (
            <span className="text-amber-400">Apasă pe butonul „Caută Clic Parazit” pentru a localiza defectul pe forma de undă.</span>
          ) : !isAllAnswered ? (
            <span className="text-sky-400">Răspunde la cele 3 întrebări pentru a finaliza Nivelul 4.</span>
          ) : (
            <span className="text-emerald-400 font-bold">Interfața WavePad și forma de undă au fost stăpânite!</span>
          )}
        </div>

        <button
          type="button"
          disabled={!isAllAnswered}
          onClick={handleFinish}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>Treci la Nivelul 5: Tehnici de Editare (Trim, Cut, Silence)</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
