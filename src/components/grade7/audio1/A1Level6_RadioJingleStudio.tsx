import React, { useState, useEffect, useRef } from 'react';
import { Radio, Volume2, Sparkles, AlertTriangle, CheckCircle2, Play, Square, Sliders, Award, Layers } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A1Level6Props {
  onPass: (score: number) => void;
}

export const A1Level6_RadioJingleStudio: React.FC<A1Level6Props> = ({ onPass }) => {
  // Mixer Sliders
  const [voiceVolume, setVoiceVolume] = useState<number>(85); // Ideal: 80-90%
  const [musicVolume, setMusicVolume] = useState<number>(20); // Ideal: 15-25%
  const [hasFadeIn, setHasFadeIn] = useState<boolean>(true);
  const [hasFadeOut, setHasFadeOut] = useState<boolean>(true);
  const [isNormalized, setIsNormalized] = useState<boolean>(true);

  // Playback Simulation
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Rubric Evaluation
  const totalVolume = voiceVolume + musicVolume;
  const isClipping = totalVolume > 100;
  const isVoiceClear = voiceVolume >= 75 && voiceVolume <= 90;
  const isMusicSubtle = musicVolume >= 15 && musicVolume <= 25;

  let grade = 4; // Base score
  if (isVoiceClear) grade += 1.5;
  if (isMusicSubtle) grade += 1.5;
  if (!isClipping) grade += 1.5;
  if (hasFadeIn) grade += 0.5;
  if (hasFadeOut) grade += 0.5;
  if (isNormalized) grade += 0.5;

  const finalGrade = Math.min(10, Number(grade.toFixed(1)));
  const isPassable = finalGrade >= 9.0 && !isClipping;

  // Real Web Audio preview of the mixed jingle
  const playJinglePreview = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      setIsPlaying(true);
      sounds.playCorrect();

      // Play synthesized chord + beat pattern for 3.5 seconds
      const now = audioCtxRef.current.currentTime;
      const gainNode = audioCtxRef.current.createGain();
      gainNode.connect(audioCtxRef.current.destination);

      // Volume scaling
      const masterScale = Math.min(1.0, totalVolume / 100);
      gainNode.gain.setValueAtTime(hasFadeIn ? 0.05 : masterScale, now);
      if (hasFadeIn) {
        gainNode.gain.linearRampToValueAtTime(masterScale, now + 0.6);
      }
      if (hasFadeOut) {
        gainNode.gain.setValueAtTime(masterScale, now + 2.4);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 3.2);
      }

      // Generate melodic tones
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtxRef.current!.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        osc.connect(gainNode);
        osc.start(now + idx * 0.15);
        osc.stop(now + 3.2);
      });

      setTimeout(() => {
        setIsPlaying(false);
      }, 3300);
    } catch {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const handleFinish = () => {
    sounds.playCorrect();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-white rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg">
            📻
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <span>Unitatea 2: Acustică Digitală • Manual Art Klett pag. 34–35</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">Nivelul 6/7</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              Studio Jingle Radio Școlar: Tehnica Paste Mix & Reglaj de Volum
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Radio Arky FM</span>
          </span>
        </div>
      </div>

      {/* Production Rubric Criteria Card */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Criteriile Tehnice ale Comisiei Radio (Grilă de Notare)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mixează vocea naratorului peste melodia electronică folosind Paste Mix. Vocea trebuie să fie clară, muzica discretă, fără clipping și cu Fade Out la final!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Nota de Producție:</div>
            <div className={`text-2xl font-black font-mono ${finalGrade >= 9 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {finalGrade.toFixed(1)} / 10
            </div>
          </div>

          <button
            type="button"
            onClick={playJinglePreview}
            disabled={isPlaying}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer disabled:opacity-50"
          >
            {isPlaying ? <Square className="w-4 h-4 fill-current animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Redare Jingle...' : 'Ascultă Mixajul'}</span>
          </button>
        </div>
      </div>

      {/* Mixer Console Simulator */}
      <div className="p-5 rounded-3xl bg-slate-950/95 border-2 border-slate-800 flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Consola de Mixaj Paste Mix (Voce + Muzică de Fundal)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Scurtătură WavePad: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">Ctrl + Shift + V</kbd>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Channel 1: Voice Track */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
                <span>🎙️ Canal 1: Voce Narator</span>
              </span>
              <span className="text-sm font-black font-mono text-white bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                {voiceVolume}%
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              „Bună dimineața, elevi și profesori! Aici Radio Școala Noastră cu știrile zilei!”
            </p>

            <input
              type="range"
              min="20"
              max="100"
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20% (Prea slab)</span>
              <span className="text-sky-300 font-bold">80-90% (Optim)</span>
              <span>100%</span>
            </div>

            {isVoiceClear ? (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Voce clară și perfect inteligibilă
              </span>
            ) : (
              <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                ⚠️ Ajustează volumul vocii între 75% și 90%
              </span>
            )}
          </div>

          {/* Channel 2: Background Music */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <span>🎵 Canal 2: Melodie Instrumentală</span>
              </span>
              <span className="text-sm font-black font-mono text-white bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                {musicVolume}%
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Ritm modern sintetizat (Paste Mix în fundal sub vorbire)
            </p>

            <input
              type="range"
              min="5"
              max="60"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5% (Abia auzit)</span>
              <span className="text-amber-300 font-bold">15-25% (Optim)</span>
              <span>60% (Acoperă vocea!)</span>
            </div>

            {isMusicSubtle ? (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fundal sonor echilibrat (nu acoperă vorbirea)
              </span>
            ) : (
              <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                ⚠️ Ajustează muzica între 15% și 25% pentru a nu masca vocea
              </span>
            )}
          </div>
        </div>

        {/* Master Output & Clipping Warning */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">Suma Nivelurilor (Voce + Muzică):</span>
            <span className={`text-sm font-black ${isClipping ? 'text-rose-400' : 'text-emerald-400'}`}>
              {totalVolume}% {isClipping ? '(CLIPPING DIGITAL DETECTAT!)' : '(Nivel Sigur < 100%)'}
            </span>
          </div>

          {/* Master VU Bar */}
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                isClipping
                  ? 'bg-rose-500 shadow-md shadow-rose-500/50'
                  : totalVolume >= 90
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, totalVolume)}%` }}
            />
          </div>

          {isClipping && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Pericol de distorsiune! Suma depășește 100% (0 dB). În WavePad, scădeți volumul muzicii sau al vocii pentru a preveni tăierea vârfurilor undei.
              </span>
            </div>
          )}
        </div>

        {/* Studio Effects Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Fade In */}
          <button
            type="button"
            onClick={() => {
              setHasFadeIn(!hasFadeIn);
              sounds.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
              hasFadeIn
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="text-xs font-bold font-mono">Fade In (Intrare lină)</div>
              <div className="text-[10px] text-slate-400">Creștere volum 0.6s</div>
            </div>
            <span className="text-base">{hasFadeIn ? '✅' : '⬜'}</span>
          </button>

          {/* Fade Out */}
          <button
            type="button"
            onClick={() => {
              setHasFadeOut(!hasFadeOut);
              sounds.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
              hasFadeOut
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="text-xs font-bold font-mono">Fade Out (Ieșire lină)</div>
              <div className="text-[10px] text-slate-400">Scădere la 0 în final</div>
            </div>
            <span className="text-base">{hasFadeOut ? '✅' : '⬜'}</span>
          </button>

          {/* Normalization */}
          <button
            type="button"
            onClick={() => {
              setIsNormalized(!isNormalized);
              sounds.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
              isNormalized
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="text-xs font-bold font-mono">Normalize (-0.5 dB)</div>
              <div className="text-[10px] text-slate-400">Volum maxim fără clipping</div>
            </div>
            <span className="text-base">{isNormalized ? '✅' : '⬜'}</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          {!isPassable ? (
            <span className="text-amber-400">Reglează volumele și efectele pentru a atinge cel puțin Nota 9.0 (fără clipping).</span>
          ) : (
            <span className="text-emerald-400 font-bold">Jingle-ul Radio îndeplinește toate standardele profesionale! (Nota {finalGrade.toFixed(1)})</span>
          )}
        </div>

        <button
          type="button"
          disabled={!isPassable}
          onClick={handleFinish}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>Treci la Nivelul 7: Marele Examen de Acustică & WavePad</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
