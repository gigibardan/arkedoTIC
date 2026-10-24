import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Volume2, Mic, CheckCircle2, AlertTriangle, Sparkles, Layers, Sliders, Info, HelpCircle } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A1Level2Props {
  onPass: (score: number) => void;
}

export const A1Level2_SamplingMonoStereo: React.FC<A1Level2Props> = ({ onPass }) => {
  // Sampling Rate setting (8000, 22050, 44100 Hz)
  const [sampleRate, setSampleRate] = useState<number>(44100);
  // Bit Depth setting (4, 8, 16 bits)
  const [bitDepth, setBitDepth] = useState<number>(16);
  // Audio Channels: 'mono' | 'stereo'
  const [channelMode, setChannelMode] = useState<'mono' | 'stereo'>('stereo');
  // Panning for stereo (-100 Left to +100 Right)
  const [panPosition, setPanPosition] = useState<number>(0);

  // Canvas visualizer for analog vs digital quantizing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Render analog continuous wave vs discrete sampled digital staircases
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    // Center zero axis
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    const midY = canvas.height / 2;
    const amplitude = 55;

    // 1. Draw smooth analog original curve (dashed teal line)
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const angle = (x / canvas.width) * 4 * Math.PI;
      const y = midY + Math.sin(angle) * amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // 2. Draw digital discrete samples & quantized steps
    // Determine sample step in pixels
    const sampleCount = sampleRate === 8000 ? 14 : sampleRate === 22050 ? 36 : 90;
    const stepX = canvas.width / sampleCount;

    // Quantization levels: 4 bits = 16 levels, 8 bits = 32 visual steps, 16 bits = 200+ visual steps (nearly continuous)
    const levels = bitDepth === 4 ? 12 : bitDepth === 8 ? 28 : 120;
    const quantizeStep = (amplitude * 2) / levels;

    ctx.strokeStyle = bitDepth === 4 ? '#f43f5e' : bitDepth === 8 ? '#f59e0b' : '#38bdf8';
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 2;

    ctx.beginPath();
    let prevY = midY;

    for (let i = 0; i < sampleCount; i++) {
      const x = i * stepX;
      const angle = (x / canvas.width) * 4 * Math.PI;
      const rawY = Math.sin(angle) * amplitude;

      // Quantize to nearest step
      const stepIndex = Math.round(rawY / quantizeStep);
      const quantizedY = midY + stepIndex * quantizeStep;

      // Draw staircase hold
      if (i === 0) {
        ctx.moveTo(x, quantizedY);
      } else {
        ctx.lineTo(x, prevY);
        ctx.lineTo(x, quantizedY);
      }
      prevY = quantizedY;

      // Draw sample dot
      ctx.fillRect(x - 2, quantizedY - 2, 4, 4);
    }
    ctx.stroke();
  }, [sampleRate, bitDepth]);

  const isAllAnswered = q1Answer === 'B' && q2Answer === 'C' && q3Answer === 'A';

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
      setQ1ErrorMsg('Incorect! Teorema Nyquist-Shannon cere o rată de eșantionare de cel puțin 2 ori frecvența maximă (2 × 20.000 Hz = 40.000 Hz). Cu marja de filtrare acustică, standardul CD a fost stabilit la 44.100 Hz (44.1 kHz). Așteaptă 5 secunde.');
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
      setQ2ErrorMsg('Incorect! Rezoluția pe 16 biți permite 65.536 trepte de dinamică (2^16), oferind un raport semnal-zgomot excelent de 96 dB, specific calității audio CD. Așteaptă 5 secunde.');
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
      setQ3ErrorMsg('Incorect! Mono utilizează o singură pistă audio redată identic în ambele urechi, în timp ce Stereo folosește două canale distincte (Stânga / Dreapta) pentru a reda spațialitatea și direcția instrumentelor. Așteaptă 5 secunde.');
    }
  };

  const handleFinish = () => {
    sounds.playCorrect();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-white rounded-3xl border border-teal-500/30 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-2xl shadow-lg">
            🎧
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1.5">
              <span>Unitatea 2: Acustică Digitală • Manual Art Klett pag. 30–31</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px]">Nivelul 2/7</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              Eșantionare Digitală (44.1 kHz, 16 biți) & Canale Mono vs Stereo
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            <span>Convertor ADC Interactiv</span>
          </span>
        </div>
      </div>

      {/* 3 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <span className="text-2xl">⏱️</span>
          <div>
            <div className="text-xs font-bold text-teal-400 font-mono uppercase">Rata de Eșantionare (44.1 kHz)</div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Măsurători discrete pe secundă. Conform <strong>Nyquist-Shannon</strong>, pentru a auzi 20.000 Hz trebuie să eșantionăm la peste 40.000 Hz (standardul Audio CD = <strong>44.100 Hz</strong>).
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <span className="text-2xl">🔢</span>
          <div>
            <div className="text-xs font-bold text-cyan-400 font-mono uppercase">Rezoluția pe Biți (16 biți)</div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Definește finețea treptelor de volum (cuantizarea). <strong>16 biți = 65.536 trepte</strong> (dinamică curată de 96 dB), față de 8 biți (doar 256 trepte cu fâșâit de fond).
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <span className="text-2xl">🎚️</span>
          <div>
            <div className="text-xs font-bold text-amber-400 font-mono uppercase">Mono vs Stereo</div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              <strong>Mono</strong> (1 canal) redă identic peste tot. <strong>Stereo</strong> (2 canale: L și R) creează senzația de scenă 3D și localizare spațială a instrumentelor.
            </div>
          </div>
        </div>
      </div>

      {/* ADC Converter & Sampling Visualizer */}
      <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col gap-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <span>Laborator Convertor Analog-Digital (ADC) & Cuantizare Digitală</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Observă cum semnalul analog continuu (linia punctată turcoaz) este transformat în trepte numerice discrete (linia colorată).
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
              {sampleRate.toLocaleString()} Hz
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {bitDepth} biți
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
              {channelMode}
            </span>
          </div>
        </div>

        {/* Visualizer Canvas */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-inner">
          <canvas
            ref={canvasRef}
            width={800}
            height={150}
            className="w-full h-36 object-cover block"
          />
          <div className="absolute top-2 left-3 flex items-center gap-3 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-teal-300">
              <span className="w-2 h-0.5 bg-teal-400 inline-block border-b border-dashed" />
              Unda Analogică
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              Eșantioane Digitale
            </span>
          </div>

          {bitDepth === 4 && (
            <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] text-rose-300 font-mono">
              ⚠️ Eroare masivă de cuantizare (Bitcrush/zgomot vizibil)
            </div>
          )}
          {sampleRate === 44100 && bitDepth === 16 && (
            <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Fidelitate Audio CD Standard
            </div>
          )}
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* 1. Sampling Rate */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="text-xs font-bold text-teal-300 font-mono">
              1. Rata de Eșantionare:
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { val: 8000, label: '8.000 Hz (8 kHz)', desc: 'Telefonie fixă veche (slabă)' },
                { val: 22050, label: '22.050 Hz (22 kHz)', desc: 'Calitate Radio FM' },
                { val: 44100, label: '44.100 Hz (44.1 kHz)', desc: 'Audio CD Standard (Hi-Fi)' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => {
                    setSampleRate(item.val);
                    sounds.playClick();
                  }}
                  className={`p-2 rounded-xl text-xs text-left transition font-mono cursor-pointer border ${
                    sampleRate === item.val
                      ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <div className="font-bold">{item.label}</div>
                  <div className="text-[10px] opacity-80">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Bit Depth */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="text-xs font-bold text-cyan-300 font-mono">
              2. Rezoluția pe Biți (Bit Depth):
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { val: 4, label: '4 biți (16 trepte)', desc: 'Zgomot aspru de cuantizare' },
                { val: 8, label: '8 biți (256 trepte)', desc: 'Jocuri retro anii 90 (fâșâit)' },
                { val: 16, label: '16 biți (65.536 trepte)', desc: 'Calitate Studio CD (96 dB dinamică)' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => {
                    setBitDepth(item.val);
                    sounds.playClick();
                  }}
                  className={`p-2 rounded-xl text-xs text-left transition font-mono cursor-pointer border ${
                    bitDepth === item.val
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <div className="font-bold">{item.label}</div>
                  <div className="text-[10px] opacity-80">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Channels & Panning */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
            <div className="text-xs font-bold text-amber-300 font-mono">
              3. Canale Audio & Panoramă:
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setChannelMode('mono');
                  setPanPosition(0);
                  sounds.playClick();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer border text-center ${
                  channelMode === 'mono'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Mono (1 Canal)
              </button>

              <button
                type="button"
                onClick={() => {
                  setChannelMode('stereo');
                  sounds.playClick();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer border text-center ${
                  channelMode === 'stereo'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Stereo (L + R)
              </button>
            </div>

            {/* Stereo Pan Slider */}
            <div className="mt-1 flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Panoramare Căști:</span>
                <span className="text-amber-300 font-bold">
                  {channelMode === 'mono' ? 'Centrat Fix (Mono)' : panPosition === 0 ? 'Centrat (L 50% / R 50%)' : panPosition < 0 ? `Stânga (${Math.abs(panPosition)}% L)` : `Dreapta (${panPosition}% R)`}
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                disabled={channelMode === 'mono'}
                value={panPosition}
                onChange={(e) => setPanPosition(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Stânga (L)</span>
                <span>Centru (C)</span>
                <span>Dreapta (R)</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 italic">
              {channelMode === 'stereo'
                ? 'ℹ️ Stereo folosește 2 piste independente (Stânga și Dreapta), dublând spațiul de stocare față de Mono.'
                : 'ℹ️ Mono stochează o singură pistă audio. Ocupă jumătate din dimensiunea unui fișier Stereo.'}
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Quiz Section */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-300 font-mono">
            Verificarea Competențelor Tehnice (3 Întrebări Pedagogice)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            1. De ce este rata de eșantionare standard a formatului Audio CD stabilită la 44.100 Hz (44.1 kHz)?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Pentru că microfonul poate înregistra doar 44 de cuvinte pe minut.' },
              { id: 'B', text: 'Conform teoremei Nyquist-Shannon, trebuie să măsurăm de cel puțin 2 ori frecvența maximă auzită de om (2 × 20.000 Hz = 40.000 Hz + marjă tehnică).' },
              { id: 'C', text: 'Pentru că 44.100 este numărul maxim de octeți pe care îi poate stoca un CD.' },
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
                <div className="font-bold font-mono text-teal-400 mb-1">Opțiunea {opt.id}:</div>
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
              <span>Corect! Nyquist-Shannon impune cel puțin 40 kHz pentru frecvențe umane de 20 kHz. 44.1 kHz asigură fidelitate absolută.</span>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            2. Ce semnifică rezoluția pe 16 biți (Bit Depth) a unui fișier audio digital?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Melodia poate fi salvată doar în 16 foldere diferite pe calculator.' },
              { id: 'B', text: 'Fișierul poate conține maxim 16 secunde de sunet.' },
              { id: 'C', text: 'Amplitudinea fiecărui eșantion este cuantizată pe 65.536 trepte de volum (2^16), eliminând zgomotul de fond.' },
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
              <span>Excelent! 16 biți oferă 65.536 trepte de dinamică și un interval semnal-zgomot curat de 96 dB.</span>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            3. Care este diferența dintre o înregistrare Mono și una Stereo în privința canalelor și dimensiunii fișierului?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Mono folosește 1 canal (ocupă jumătate de spațiu); Stereo folosește 2 canale distincte (L și R, spațialitate 3D, mărime dublă).' },
              { id: 'B', text: 'Mono este exclusiv pentru muzică clasică, iar Stereo este doar pentru apeluri telefonice.' },
              { id: 'C', text: 'Nu există nicio diferență tehnică, este doar o denumire comercială.' },
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
                <div className="font-bold font-mono text-amber-400 mb-1">Opțiunea {opt.id}:</div>
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
              <span>Corect! Mono = 1 canal (economie de date); Stereo = 2 canale (lărgime acustică realistă).</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          {!isAllAnswered ? (
            <span className="text-teal-400">Răspunde corect la cele 3 întrebări pentru a finaliza Nivelul 2.</span>
          ) : (
            <span className="text-emerald-400 font-bold">Conceptul de eșantionare și canale audio a fost validat!</span>
          )}
        </div>

        <button
          type="button"
          disabled={!isAllAnswered}
          onClick={handleFinish}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-teal-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>Treci la Nivelul 3: Formate WAV vs MP3 & Calcul Fișiere</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
