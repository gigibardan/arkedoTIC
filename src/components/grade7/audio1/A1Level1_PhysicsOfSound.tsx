import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Info, HelpCircle, CheckCircle2, AlertTriangle, Sparkles, Activity, Waves } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';

interface A1Level1Props {
  onPass: (score: number) => void;
}

export const A1Level1_PhysicsOfSound: React.FC<A1Level1Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Simulator State: Frequency in Hz and Amplitude in dB
  const [frequency, setFrequency] = useState<number>(440); // 440 Hz is concert pitch A4
  const [amplitudeDb, setAmplitudeDb] = useState<number>(-12); // -12 dB normal safe volume
  const [isPlayingTone, setIsPlayingTone] = useState<boolean>(false);

  // Web Audio synth ref for real acoustic demonstration
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Canvas visualizer ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  // Update oscillator & gain when sliders change
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    }
    if (gainRef.current && audioCtxRef.current) {
      // Convert dB to linear gain: gain = 10^(dB/20)
      const linearGain = Math.max(0.0001, Math.pow(10, amplitudeDb / 20));
      gainRef.current.gain.setValueAtTime(linearGain, audioCtxRef.current.currentTime);
    }
  }, [frequency, amplitudeDb]);

  const startTone = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Stop previous if any
      stopTone();

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

      const linearGain = Math.pow(10, amplitudeDb / 20);
      gain.gain.setValueAtTime(linearGain, audioCtxRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingTone(true);
      sounds.playClick();
    } catch {
      // AudioContext fallback
      setIsPlayingTone(true);
    }
  };

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch {}
      gainRef.current = null;
    }
    setIsPlayingTone(false);
  };

  // Oscilloscope Canvas Live Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw oscilloscope grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Center reference zero line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw sine wave based on Frequency & Amplitude
      // Normalize values for visualization
      const waveHeight = ((amplitudeDb + 60) / 60) * (canvas.height / 2 - 12);
      const cycles = (frequency / 100) * 1.5;

      ctx.strokeStyle = isPlayingTone ? '#38bdf8' : '#64748b';
      ctx.lineWidth = 3;
      ctx.shadowColor = isPlayingTone ? '#0ea5e9' : 'transparent';
      ctx.shadowBlur = isPlayingTone ? 10 : 0;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        const angle = (x / canvas.width) * cycles * 2 * Math.PI + phase;
        const y = canvas.height / 2 + Math.sin(angle) * Math.max(2, waveHeight);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (isPlayingTone) {
        phase += (frequency / 1000) * 0.4 + 0.05;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [frequency, amplitudeDb, isPlayingTone]);

  // Pedagogical Questions State (Strict 5s Cooldown on repeated errors)
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);

  const [q1ErrorMsg, setQ1ErrorMsg] = useState<string>('');
  const [q2ErrorMsg, setQ2ErrorMsg] = useState<string>('');
  const [q3ErrorMsg, setQ3ErrorMsg] = useState<string>('');

  const [exploredHz, setExploredHz] = useState<boolean>(false);
  const [exploredDb, setExploredDb] = useState<boolean>(false);

  useEffect(() => {
    if (q1Cooldown > 0) {
      const timer = setTimeout(() => setQ1Cooldown(q1Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q1Cooldown]);

  useEffect(() => {
    if (q2Cooldown > 0) {
      const timer = setTimeout(() => setQ2Cooldown(q2Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q2Cooldown]);

  useEffect(() => {
    if (q3Cooldown > 0) {
      const timer = setTimeout(() => setQ3Cooldown(q3Cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [q3Cooldown]);

  // Audio tone presets
  const presets = [
    {
      labelRo: 'Bass profund (60 Hz)',
      labelEn: 'Deep Bass (60 Hz)',
      hz: 60,
      descRo: 'Toba mare / Subwoofer',
      descEn: 'Bass drum / Subwoofer',
    },
    {
      labelRo: 'La de concert (440 Hz)',
      labelEn: 'Concert Pitch A4 (440 Hz)',
      hz: 440,
      descRo: 'Acordaj instrumente',
      descEn: 'Instrument tuning standard',
    },
    {
      labelRo: 'Voce feminină (1.000 Hz)',
      labelEn: 'Human Voice (1,000 Hz)',
      hz: 1000,
      descRo: 'Claritate dicție',
      descEn: 'Speech intelligibility',
    },
    {
      labelRo: 'Sunet înalt (5.000 Hz)',
      labelEn: 'High Treble (5,000 Hz)',
      hz: 5000,
      descRo: 'Cinel / Țipăt de pasăre',
      descEn: 'Cymbal / High chirp',
    },
    {
      labelRo: 'Limită auz (14.000 Hz)',
      labelEn: 'Hearing Ceiling (14,000 Hz)',
      hz: 14000,
      descRo: 'Frecvență ultra-acută',
      descEn: 'Ultra-high frequency',
    },
  ];

  // Acoustic Category Label
  const getPitchCategory = (hz: number) => {
    if (hz < 20) {
      return {
        label: lang === 'ro' ? 'Infrasunet (< 20 Hz)' : 'Infrasound (< 20 Hz)',
        color: 'text-purple-400',
        desc: lang === 'ro'
          ? 'Inaudibil pentru urechea umană (cutremure, balene)'
          : 'Inaudible to human ear (earthquakes, whales)',
      };
    }
    if (hz <= 250) {
      return {
        label: lang === 'ro' ? 'Tonalitate Joasă / Gravă (Bass)' : 'Low Pitch / Deep Tone (Bass)',
        color: 'text-amber-400',
        desc: lang === 'ro'
          ? 'Vibrații profunde, tobe, motoare'
          : 'Deep vibrations, drums, engine hum',
      };
    }
    if (hz <= 2000) {
      return {
        label: lang === 'ro' ? 'Tonalitate Medie (Medii)' : 'Mid Frequencies (Mids)',
        color: 'text-emerald-400',
        desc: lang === 'ro'
          ? 'Vocea umană vorbită, pian, chitară'
          : 'Spoken human voice, piano, acoustic guitar',
      };
    }
    if (hz <= 20000) {
      return {
        label: lang === 'ro' ? 'Tonalitate Înaltă / Acută (Treble)' : 'High Pitch / Sharp (Treble)',
        color: 'text-cyan-400',
        desc: lang === 'ro'
          ? 'Cinele, fluiere, șuierături'
          : 'Cymbals, flutes, whistles, hiss',
      };
    }
    return {
      label: lang === 'ro' ? 'Ultrasunet (> 20.000 Hz)' : 'Ultrasound (> 20,000 Hz)',
      color: 'text-rose-400',
      desc: lang === 'ro'
        ? 'Inaudibil pentru om (lilieci, delfini, sonare)'
        : 'Inaudible to humans (bats, dolphins, sonar equipment)',
    };
  };

  const getDbCategory = (db: number) => {
    if (db <= -36) {
      return {
        label: lang === 'ro' ? 'Foarte silențios (~20 dB)' : 'Very quiet (~20 dB)',
        color: 'text-slate-400',
        desc: lang === 'ro' ? 'Șoaptă sau foșnet de frunze' : 'Whisper or rustling leaves',
      };
    }
    if (db <= -18) {
      return {
        label: lang === 'ro' ? 'Confortabil (~50 dB)' : 'Comfortable (~50 dB)',
        color: 'text-emerald-400',
        desc: lang === 'ro' ? 'Liniște de bibliotecă / fundal' : 'Quiet library / subtle ambient background',
      };
    }
    if (db <= -6) {
      return {
        label: lang === 'ro' ? 'Normal / Voce (~65 dB)' : 'Normal / Speech (~65 dB)',
        color: 'text-cyan-400',
        desc: lang === 'ro' ? 'Conversație la 1 metru' : 'Normal conversation at 1 meter',
      };
    }
    if (db < 0) {
      return {
        label: lang === 'ro' ? 'Puternic (~85 dB)' : 'Loud (~85 dB)',
        color: 'text-amber-400',
        desc: lang === 'ro' ? 'Trafic urban intens, limită de siguranță' : 'Heavy city traffic, auditory safety threshold',
      };
    }
    return {
      label: lang === 'ro' ? '0 dB (PRAG DIGITAL MAXIM)' : '0 dB (MAXIMUM DIGITAL CEILING)',
      color: 'text-rose-400',
      desc: lang === 'ro'
        ? 'Peste 0 dB apare clipping (distorsiune)'
        : 'Above 0 dB harsh digital clipping distortion occurs',
    };
  };

  const pitchInfo = getPitchCategory(frequency);
  const dbInfo = getDbCategory(amplitudeDb);

  const isAllAnswered = q1Answer === 'A' && q2Answer === 'C' && q3Answer === 'B';

  const handleSelectQ1 = (opt: string) => {
    if (q1Cooldown > 0) return;
    if (opt === 'A') {
      sounds.playCorrect();
      setQ1Answer('A');
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(null);
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Frecvența reprezintă numărul de oscilații pe secundă măsurat în Hertz (Hz), iar spectrul auzului uman este de la 20 Hz până la 20.000 Hz (20 kHz). Așteaptă 5 secunde.'
          : 'Incorrect! Frequency represents oscillations per second in Hertz (Hz), and the human hearing range spans 20 Hz to 20,000 Hz (20 kHz). Wait 5 seconds.'
      );
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
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Amplitudinea undei măsoară energia și puterea volumului sonor în decibeli (dB). În mediul digital, pragul de 0 dB este maximul absolut înainte de distorsiune (clipping). Așteaptă 5 secunde.'
          : 'Incorrect! Wave amplitude measures volume power in decibels (dB). In digital audio, 0 dB is the absolute maximum ceiling before clipping occurs. Wait 5 seconds.'
      );
    }
  };

  const handleSelectQ3 = (opt: string) => {
    if (q3Cooldown > 0) return;
    if (opt === 'B') {
      sounds.playCorrect();
      setQ3Answer('B');
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(null);
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Vibrațiile sonore sub 20 Hz se numesc Infrasunete, iar cele peste 20.000 Hz se numesc Ultrasunete (folosite de lilieci și aparate medicale). Așteaptă 5 secunde.'
          : 'Incorrect! Sound vibrations below 20 Hz are termed Infrasound, and those above 20,000 Hz are Ultrasound (used by bats, dolphins, and medical sonars). Wait 5 seconds.'
      );
    }
  };

  const handleFinish = () => {
    stopTone();
    sounds.playCorrect();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-white rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg">
            🎙️
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <span>{lang === 'ro' ? 'Unitatea 2: Acustică Digitală • Manual Art Klett pag. 28–30' : 'Unit 2: Digital Acoustics • Art Klett Textbook pp. 28–30'}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                {lang === 'ro' ? 'Nivelul 1/7' : 'Level 1/7'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              {lang === 'ro'
                ? 'Fizica Sunetului: Frecvență (Hz), Volum (dB) & Praguri Auditive'
                : 'Physics of Sound: Frequency (Hz), Amplitude (dB) & Auditory Thresholds'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ro' ? 'Osciloscop Live' : 'Live Oscilloscope'}</span>
          </span>
        </div>
      </div>

      {/* Theory Summary Pill Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <span className="text-2xl">〰️</span>
          <div>
            <div className="text-xs font-bold text-amber-400 font-mono uppercase">
              {lang === 'ro' ? 'Frecvența (Hertz - Hz)' : 'Frequency (Hertz - Hz)'}
            </div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {lang === 'ro' ? (
                <>Numărul de vibrații complete pe secundă. Determină dacă sunetul este <strong>grav/bas</strong> (zeci de Hz) sau <strong>ascuțit/înalt</strong> (mii de Hz).</>
              ) : (
                <>Number of complete cycles per second. Determines whether sound is <strong>deep/bass</strong> (tens of Hz) or <strong>high-pitched/treble</strong> (thousands of Hz).</>
              )}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <span className="text-2xl">📢</span>
          <div>
            <div className="text-xs font-bold text-cyan-400 font-mono uppercase">
              {lang === 'ro' ? 'Amplitudinea (Decibeli - dB)' : 'Amplitude (Decibels - dB)'}
            </div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {lang === 'ro' ? (
                <>Înălțimea undei sonore reflectă puterea volumului. În audio digital, <strong>0 dB</strong> este pragul de vârf maxim; depășirea lui generează <em>clipping</em>.</>
              ) : (
                <>The waveform height reflects acoustic power and loudness. In digital audio, <strong>0 dB</strong> is the absolute maximum peak; exceeding it causes <em>clipping</em>.</>
              )}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <span className="text-2xl">👂</span>
          <div>
            <div className="text-xs font-bold text-rose-400 font-mono uppercase">
              {lang === 'ro' ? 'Spectrul Urechii Umane' : 'Human Hearing Range'}
            </div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {lang === 'ro' ? (
                <>Omul aude între <strong>20 Hz</strong> și <strong>20.000 Hz (20 kHz)</strong>. Sub 20 Hz avem <em>Infrasunete</em>, iar peste 20 kHz avem <em>Ultrasunete</em>.</>
              ) : (
                <>Humans hear between <strong>20 Hz</strong> and <strong>20,000 Hz (20 kHz)</strong>. Below 20 Hz are <em>Infrasounds</em>, and above 20 kHz are <em>Ultrasounds</em>.</>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Oscilloscope & Tone Generator Lab */}
      <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col gap-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-sky-400 animate-pulse" />
            <h2 className="text-base font-bold text-white font-heading">
              {lang === 'ro'
                ? 'Simulator Acustic Interactiv: Generator de Unde & Monitor Osciloscop'
                : 'Interactive Acoustic Simulator: Wave Generator & Oscilloscope Monitor'}
            </h2>
          </div>

          {/* Play/Stop Tone Button */}
          <button
            type="button"
            onClick={isPlayingTone ? stopTone : startTone}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
              isPlayingTone
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-amber-500/30'
            }`}
          >
            {isPlayingTone ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>{lang === 'ro' ? 'Oprește Tonul Acustic' : 'Stop Acoustic Tone'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{lang === 'ro' ? 'Ascultă Frecvența Live' : 'Listen to Live Tone'}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Canvas Oscilloscope */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-inner">
          <canvas
            ref={canvasRef}
            width={800}
            height={160}
            className="w-full h-40 object-cover block"
          />
          <div className="absolute top-2 left-3 flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isPlayingTone ? 'bg-sky-400 animate-ping' : 'bg-slate-500'}`} />
            <span className="text-slate-300">
              {lang === 'ro'
                ? `Osciloscop: ${isPlayingTone ? 'Semnal Activ' : 'Standby'}`
                : `Oscilloscope: ${isPlayingTone ? 'Signal Active' : 'Standby'}`}
            </span>
          </div>

          <div className="absolute top-2 right-3 flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono text-[11px]">
            <span className="text-amber-300 font-bold">{frequency} Hz</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-300 font-bold">{amplitudeDb} dB</span>
          </div>
        </div>

        {/* Sliders Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Frequency Slider */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="freq-slider" className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <span>{lang === 'ro' ? 'Frecvență Tonală:' : 'Pitch Frequency:'}</span>
                <span className="text-white text-sm font-black">{frequency.toLocaleString()} Hz</span>
              </label>
              <span className={`text-[11px] font-bold font-mono ${pitchInfo.color}`}>
                {pitchInfo.label}
              </span>
            </div>

            <input
              id="freq-slider"
              type="range"
              min="20"
              max="16000"
              step="10"
              value={frequency}
              onChange={(e) => {
                setFrequency(Number(e.target.value));
                setExploredHz(true);
              }}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{lang === 'ro' ? '20 Hz (Bas Infrasonic)' : '20 Hz (Sub-bass)'}</span>
              <span>440 Hz (A4)</span>
              <span>1.000 Hz</span>
              <span>{lang === 'ro' ? '16.000 Hz (Acut)' : '16,000 Hz (Treble)'}</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 italic">
              ℹ️ {pitchInfo.desc}
            </p>

            {/* Quick frequency presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {presets.map((p) => (
                <button
                  key={p.hz}
                  type="button"
                  onClick={() => {
                    setFrequency(p.hz);
                    setExploredHz(true);
                    sounds.playClick();
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono transition cursor-pointer border ${
                    frequency === p.hz
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title={lang === 'ro' ? p.descRo : p.descEn}
                >
                  {lang === 'ro' ? p.labelRo : p.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Amplitude Slider */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="amp-slider" className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                <span>{lang === 'ro' ? 'Amplitudine / Putere:' : 'Amplitude / Power:'}</span>
                <span className="text-white text-sm font-black">{amplitudeDb} dB</span>
              </label>
              <span className={`text-[11px] font-bold font-mono ${dbInfo.color}`}>
                {dbInfo.label}
              </span>
            </div>

            <input
              id="amp-slider"
              type="range"
              min="-48"
              max="0"
              step="1"
              value={amplitudeDb}
              onChange={(e) => {
                setAmplitudeDb(Number(e.target.value));
                setExploredDb(true);
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{lang === 'ro' ? '-48 dB (Foșnet)' : '-48 dB (Whisper)'}</span>
              <span>-24 dB</span>
              <span>{lang === 'ro' ? '-12 dB (Sigur)' : '-12 dB (Safe)'}</span>
              <span className="text-rose-400 font-bold">0 dB ({lang === 'ro' ? 'Max Digital' : 'Digital Ceiling'})</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 italic">
              ℹ️ {dbInfo.desc}
            </p>

            {/* Clipping warning pill if near 0dB */}
            {amplitudeDb >= -1 && (
              <div className="mt-2 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  {lang === 'ro'
                    ? 'Atenție: Volumul atinge 0 dB! În WavePad, orice depășire taie vârfurile undei și provoacă distorsiuni (clipping).'
                    : 'Warning: Volume reaches 0 dB! In WavePad, exceeding 0 dB clips waveform peaks and creates harsh distortion (clipping).'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pedagogical Quiz Section */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 font-mono">
            {lang === 'ro'
              ? 'Verificarea Competențelor Acustice (3 Întrebări Pedagogice)'
              : 'Acoustic Skills Assessment (3 Pedagogical Questions)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            {lang === 'ro'
              ? '1. Ce proprietate a sunetului este măsurată în Hertz (Hz) și care este intervalul de frecvențe perceput de auzul uman sănătos?'
              : '1. What property of sound is measured in Hertz (Hz) and what is the frequency range perceived by healthy human hearing?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Frecvența (tonalitatea gravă/acută) • Interval: 20 Hz – 20.000 Hz',
                textEn: 'Frequency (pitch / low to high tones) • Range: 20 Hz – 20,000 Hz',
              },
              {
                id: 'B',
                textRo: 'Amplitudinea (tăria volumului) • Interval: 0 dB – 100 dB',
                textEn: 'Amplitude (volume loudness) • Range: 0 dB – 100 dB',
              },
              {
                id: 'C',
                textRo: 'Rata de compresie MP3 • Interval: 128 kbps – 320 kbps',
                textEn: 'MP3 compression bitrate • Range: 128 kbps – 320 kbps',
              },
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
                <div className="font-bold font-mono text-amber-400 mb-1">
                  {lang === 'ro' ? `Opțiunea ${opt.id}:` : `Option ${opt.id}:`}
                </div>
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q1ErrorMsg} ({lang === 'ro' ? 'Deblocare în:' : 'Unlocks in:'} {q1Cooldown}s)</span>
            </div>
          )}
          {q1Answer === 'A' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Frecvența (Hz) definește tonalitatea (joasă/înaltă), iar spectrul uman este 20 Hz – 20 kHz.'
                  : 'Correct! Frequency (Hz) defines pitch (low/high), and the human hearing range spans 20 Hz to 20 kHz.'}
              </span>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            {lang === 'ro'
              ? '2. În aplicațiile profesionale de editare audio precum WavePad, ce se întâmplă dacă semnalul sonor depășește nivelul de 0 dB?'
              : '2. In professional audio editors like WavePad, what happens if the audio signal exceeds 0 dB?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Sunetul devine automat surround 5.1 fără nicio pierdere de calitate.',
                textEn: 'Sound automatically converts to 5.1 surround with no loss of quality.',
              },
              {
                id: 'B',
                textRo: 'Programul salvează fișierul instantaneu pe disc pentru protecție.',
                textEn: 'The program immediately saves the file to disk for safety.',
              },
              {
                id: 'C',
                textRo: 'Apare fenomenul de clipping (distorsiune dură prin tăierea vârfurilor undei sonore).',
                textEn: 'Clipping occurs (harsh digital distortion from shaving off waveform peaks).',
              },
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
                <div className="font-bold font-mono text-cyan-400 mb-1">
                  {lang === 'ro' ? `Opțiunea ${opt.id}:` : `Option ${opt.id}:`}
                </div>
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q2ErrorMsg} ({lang === 'ro' ? 'Deblocare în:' : 'Unlocks in:'} {q2Cooldown}s)</span>
            </div>
          )}
          {q2Answer === 'C' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ro'
                  ? 'Excelent! 0 dB este limita maximă a scalei dBFS (Full Scale). Peste 0 dB se produce clipping digital.'
                  : 'Excellent! 0 dB is the ceiling on the dBFS (Full Scale) meter. Exceeding 0 dB causes harsh digital clipping.'}
              </span>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            {lang === 'ro'
              ? '3. Cum se numesc undele sonore situate sub limita de 20 Hz și respectiv cele de peste 20.000 Hz?'
              : '3. What are acoustic waves below 20 Hz and above 20,000 Hz called?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Microunde (sub 20 Hz) și Unde Radio (peste 20 kHz).',
                textEn: 'Microwaves (under 20 Hz) and Radio Waves (over 20 kHz).',
              },
              {
                id: 'B',
                textRo: 'Infrasunete (sub 20 Hz) și Ultrasunete (peste 20 kHz).',
                textEn: 'Infrasound (under 20 Hz) and Ultrasound (over 20 kHz).',
              },
              {
                id: 'C',
                textRo: 'Unde Gamma (sub 20 Hz) și Raze X (peste 20 kHz).',
                textEn: 'Gamma Rays (under 20 Hz) and X-Rays (over 20 kHz).',
              },
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
                <div className="font-bold font-mono text-rose-400 mb-1">
                  {lang === 'ro' ? `Opțiunea ${opt.id}:` : `Option ${opt.id}:`}
                </div>
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{q3ErrorMsg} ({lang === 'ro' ? 'Deblocare în:' : 'Unlocks in:'} {q3Cooldown}s)</span>
            </div>
          )}
          {q3Answer === 'B' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Sub 20 Hz sunt Infrasunetele (animale mari, fenomene seismice), iar peste 20 kHz sunt Ultrasunetele (lilieci, sonare).'
                  : 'Correct! Under 20 Hz are Infrasounds (large mammals, seismic activity), and over 20 kHz are Ultrasounds (bats, sonars).'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          {!isAllAnswered ? (
            <span className="text-amber-400">
              {lang === 'ro'
                ? 'Răspunde corect la cele 3 întrebări pentru a finaliza Nivelul 1.'
                : 'Answer all 3 questions correctly to complete Level 1.'}
            </span>
          ) : (
            <span className="text-emerald-400 font-bold">
              {lang === 'ro'
                ? 'Toate cerințele acustice au fost validate cu succes!'
                : 'All acoustic criteria have been successfully validated!'}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!isAllAnswered}
          onClick={handleFinish}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>
            {lang === 'ro'
              ? 'Treci la Nivelul 2: Eșantionare & Canale Audio'
              : 'Proceed to Level 2: Sampling & Audio Channels'}
          </span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
