import React, { useState, useEffect } from 'react';
import { HardDrive, FileAudio, Calculator, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Layers } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';

interface A1Level3Props {
  onPass: (score: number) => void;
}

export const A1Level3_AudioFormatsCalc: React.FC<A1Level3Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Calculator Parameters
  const [durationSec, setDurationSec] = useState<number>(180); // 3 minutes typical song
  const [sampleRate, setSampleRate] = useState<number>(44100);
  const [bitDepth, setBitDepth] = useState<number>(16);
  const [channels, setChannels] = useState<number>(2); // 1 = Mono, 2 = Stereo
  const [mp3Bitrate, setMp3Bitrate] = useState<number>(192); // 128, 192, 320 kbps

  // Calculations:
  // WAV Bytes = SampleRate * (BitDepth / 8) * Channels * DurationSec
  const wavBytes = sampleRate * (bitDepth / 8) * channels * durationSec;
  const wavMb = wavBytes / (1024 * 1024);

  // MP3 Bytes = (Bitrate kbps * 1000 / 8) * DurationSec
  const mp3Bytes = ((mp3Bitrate * 1000) / 8) * durationSec;
  const mp3Mb = mp3Bytes / (1024 * 1024);

  // Compression ratio
  const ratio = (wavMb / mp3Mb).toFixed(1);

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

  const isAllAnswered = q1Answer === 'B' && q2Answer === 'A' && q3Answer === 'C';

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
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! WAV este un format necomprimat (Uncompressed PCM) de fidelitate absolută de studio, în timp ce MP3 folosește compresie cu pierderi psihoacustice (elimină sunetele imperceptibile de ureche) pentru a reduce mărimea de ~10 ori. Așteaptă 5 secunde.'
          : 'Incorrect! WAV is an uncompressed PCM format of studio fidelity, while MP3 applies psychoacoustic lossy compression to reduce file size ~10-fold. Wait 5 seconds.'
      );
    }
  };

  const handleSelectQ2 = (opt: string) => {
    if (q2Cooldown > 0) return;
    if (opt === 'A') {
      sounds.playCorrect();
      setQ2Answer('A');
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(null);
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Formula este: 44.100 Hz × (16/8 octeți) × 2 canale × 60 secunde = 10.584.000 octeți ≈ 10,1 MB per minut de înregistrare stereo CD. Așteaptă 5 secunde.'
          : 'Incorrect! Formula: 44,100 Hz × (16/8 bytes) × 2 channels × 60 sec = 10,584,000 bytes ≈ 10.1 MB per minute of stereo CD audio. Wait 5 seconds.'
      );
    }
  };

  const handleSelectQ3 = (opt: string) => {
    if (q3Cooldown > 0) return;
    if (opt === 'C') {
      sounds.playCorrect();
      setQ3Answer('C');
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(null);
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Când exportăm podcast-uri, interviuri sau jingle-uri pentru web și partajare ușoară, MP3 la 192 kbps oferă cel mai bun compromis: o calitate excelentă la o zecime din spațiul ocupat de WAV. Așteaptă 5 secunde.'
          : 'Incorrect! When exporting podcasts, interviews, or jingles for web distribution, MP3 at 192 kbps provides the optimal balance of quality and small file size. Wait 5 seconds.'
      );
    }
  };

  const handleFinish = () => {
    sounds.playCorrect();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-white rounded-3xl border border-indigo-500/30 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-600 flex items-center justify-center text-2xl shadow-lg">
            💾
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
              <span>{lang === 'ro' ? 'Unitatea 2: Acustică Digitală • Manual Art Klett pag. 31–32' : 'Unit 2: Digital Acoustics • Art Klett Textbook pp. 31–32'}</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
                {lang === 'ro' ? 'Nivelul 3/7' : 'Level 3/7'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              {lang === 'ro'
                ? 'Formate Audio: WAV (Necomprimat) vs MP3 & Calculul Dimensiunii'
                : 'Audio Formats: WAV (Uncompressed) vs MP3 & Size Calculations'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'ro' ? 'Calculator Dimensiune Audio' : 'Audio File Size Calculator'}</span>
          </span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WAV Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-indigo-500/40 flex flex-col gap-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
              <FileAudio className="w-4 h-4 text-indigo-400" />
              {lang === 'ro' ? 'Format Necomprimat (Uncompressed)' : 'Uncompressed PCM Format'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">.WAV (Waveform)</span>
          </div>
          <h2 className="text-base font-bold text-white font-heading mt-1">
            {lang === 'ro' ? 'WAV: Calitate Maximă de Studio (Linear PCM)' : 'WAV: Maximum Studio Quality (Linear PCM)'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Fiecare eșantion este stocat exact așa cum a fost captat de microfon, fără nicio pierdere sau aproximare. Este formatul de lucru recomandat în timpul editării în WavePad.'
              : 'Every sample is stored exactly as captured by the microphone, without loss or perceptual approximation. It is the recommended master format during editing in WavePad.'}
          </p>
          <div className="text-[11px] font-mono text-indigo-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            📌 {lang === 'ro'
              ? '1 minut de audio CD Stereo (44.1 kHz, 16-bit) = ~10,1 MB'
              : '1 minute of Stereo CD audio (44.1 kHz, 16-bit) = ~10.1 MB'}
          </div>
        </div>

        {/* MP3 Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/40 flex flex-col gap-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {lang === 'ro' ? 'Format Comprimat Psihoacustic (Lossy)' : 'Psychoacoustic Compressed Format (Lossy)'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">.MP3 (MPEG Audio)</span>
          </div>
          <h2 className="text-base font-bold text-white font-heading mt-1">
            {lang === 'ro' ? 'MP3: Compact, Portabil & Streaming Eficient' : 'MP3: Compact, Portable & Streaming Efficient'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Folosește un model psihoacustic: elimină frecvențele ultra-înalte și sunetele mascate de sunete mai puternice, reducând mărimea fișierului de aproximativ 10 ori fără ca omul obișnuit să sesizeze diferența.'
              : 'Employs a psychoacoustic model: eliminates imperceptible frequencies and sounds masked by louder tones, shrinking file size approximately 10-fold with negligible perceived loss.'}
          </p>
          <div className="text-[11px] font-mono text-emerald-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            📌 {lang === 'ro'
              ? '1 minut de audio MP3 la 192 kbps = ~1,4 MB (economie de 86%)'
              : '1 minute of MP3 audio at 192 kbps = ~1.4 MB (86% space saved)'}
          </div>
        </div>
      </div>

      {/* Interactive Storage Calculator */}
      <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col gap-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-heading">
              {lang === 'ro'
                ? 'Simulatorul Formulei Matematice de Calcul Audio pe Disc'
                : 'Mathematical Audio Storage Calculation Simulator'}
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {lang === 'ro'
              ? 'Formula: Hz × (Biți/8) × Canale × Secunde'
              : 'Formula: Hz × (Bits/8) × Channels × Seconds'}
          </div>
        </div>

        {/* Sliders and Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Duration */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">{lang === 'ro' ? 'Durată:' : 'Duration:'}</span>
              <span className="text-white font-bold">{Math.floor(durationSec / 60)}m {durationSec % 60}s</span>
            </div>
            <input
              type="range"
              min="30"
              max="600"
              step="30"
              value={durationSec}
              onChange={(e) => setDurationSec(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30 sec</span>
              <span>3 min</span>
              <span>10 min</span>
            </div>
          </div>

          {/* Sample Rate */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">{lang === 'ro' ? 'Rată:' : 'Rate:'}</span>
              <span className="text-teal-300 font-bold">{sampleRate / 1000} kHz</span>
            </div>
            <select
              value={sampleRate}
              onChange={(e) => setSampleRate(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2 font-mono"
            >
              <option value="22050">{lang === 'ro' ? '22.050 Hz (Radio FM)' : '22,050 Hz (FM Radio)'}</option>
              <option value="44100">{lang === 'ro' ? '44.100 Hz (Audio CD)' : '44,100 Hz (Audio CD)'}</option>
              <option value="48000">{lang === 'ro' ? '48.000 Hz (Video DVD / TV)' : '48,000 Hz (DVD Video / TV)'}</option>
              <option value="96000">{lang === 'ro' ? '96.000 Hz (Studio Hi-Res)' : '96,000 Hz (Studio Hi-Res)'}</option>
            </select>
          </div>

          {/* Channels & Bit Depth */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">{lang === 'ro' ? 'Canale & Biți:' : 'Channels & Bits:'}</span>
              <span className="text-cyan-300 font-bold">{channels === 1 ? 'Mono' : 'Stereo'} • {bitDepth}-bit</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setChannels(channels === 1 ? 2 : 1)}
                className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700 text-xs font-mono font-bold text-slate-200"
              >
                {channels === 1 ? 'Mono (1x)' : 'Stereo (2x)'}
              </button>
              <button
                type="button"
                onClick={() => setBitDepth(bitDepth === 16 ? 24 : 16)}
                className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700 text-xs font-mono font-bold text-slate-200"
              >
                {bitDepth}-bit ({bitDepth / 8}B)
              </button>
            </div>
          </div>

          {/* MP3 Bitrate */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">Bitrate MP3:</span>
              <span className="text-emerald-300 font-bold">{mp3Bitrate} kbps</span>
            </div>
            <select
              value={mp3Bitrate}
              onChange={(e) => setMp3Bitrate(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2 font-mono"
            >
              <option value="96">{lang === 'ro' ? '96 kbps (Economie maximă)' : '96 kbps (Maximum savings)'}</option>
              <option value="128">{lang === 'ro' ? '128 kbps (Standard vechi)' : '128 kbps (Legacy standard)'}</option>
              <option value="192">{lang === 'ro' ? '192 kbps (Recomandat Web)' : '192 kbps (Recommended Web)'}</option>
              <option value="320">{lang === 'ro' ? '320 kbps (Calitate Premium)' : '320 kbps (Premium quality)'}</option>
            </select>
          </div>
        </div>

        {/* Live Storage Comparison Display */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* WAV Size Indicator */}
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase">
                {lang === 'ro' ? 'Dimensiune WAV Necomprimat:' : 'Uncompressed WAV Size:'}
              </span>
              <span className="text-2xl font-black font-mono text-white">
                {wavMb >= 1000 ? `${(wavMb / 1024).toFixed(2)} GB` : `${wavMb.toFixed(1)} MB`}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {sampleRate} × {bitDepth / 8} × {channels} × {durationSec}s = {wavBytes.toLocaleString()} {lang === 'ro' ? 'octeți' : 'bytes'}
              </span>
            </div>
          </div>

          <div className="text-center font-mono">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
              {lang === 'ro' ? `MP3 este de ${ratio}× mai mic!` : `MP3 is ${ratio}× smaller!`}
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            {/* MP3 Size Indicator */}
            <div className="flex flex-col text-right">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                {lang === 'ro' ? 'Dimensiune MP3 Comprimat:' : 'Compressed MP3 Size:'}
              </span>
              <span className="text-2xl font-black font-mono text-emerald-300">
                {mp3Mb.toFixed(2)} MB
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {lang === 'ro'
                  ? `Economie de spațiu: ${((1 - mp3Mb / wavMb) * 100).toFixed(0)}%`
                  : `Storage space saved: ${((1 - mp3Mb / wavMb) * 100).toFixed(0)}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Quiz Section */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 font-mono">
            {lang === 'ro'
              ? 'Verificarea Competențelor Tehnice (3 Întrebări Pedagogice)'
              : 'Technical Competency Verification (3 Pedagogical Questions)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            {lang === 'ro'
              ? '1. Care este diferența tehnică fundamentală dintre formatul WAV și formatul MP3?'
              : '1. What is the fundamental technical difference between WAV and MP3 audio formats?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'WAV poate stoca doar imagini statice, în timp ce MP3 stochează doar video.',
                textEn: 'WAV can only store static images, whereas MP3 stores video.',
              },
              {
                id: 'B',
                textRo: 'WAV este necomprimat (fidelitate maximă de studio, dimensiune mare); MP3 folosește compresie cu pierderi psihoacustice (reduce dimensiunea de ~10 ori).',
                textEn: 'WAV is uncompressed (maximum studio fidelity, large size); MP3 uses psychoacoustic lossy compression (~10x smaller size).',
              },
              {
                id: 'C',
                textRo: 'Nu există nicio diferență de compresie sau de mărime între WAV și MP3.',
                textEn: 'There is no difference in compression or file size between WAV and MP3.',
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
                <div className="font-bold font-mono text-indigo-400 mb-1">
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
          {q1Answer === 'B' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ro'
                  ? 'Corect! WAV păstrează semnalul brut PCM, iar MP3 comprimă datele prin model psihoacustic.'
                  : 'Correct! WAV preserves raw PCM audio, while MP3 compresses data via a psychoacoustic model.'}
              </span>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            {lang === 'ro'
              ? '2. Cât spațiu pe hard-disk ocupă 1 minut (60 sec) de sunet WAV necomprimat la standard Audio CD (44.100 Hz, 16 biți, stereo - 2 canale)?'
              : '2. How much storage space does 1 minute (60 sec) of uncompressed Audio CD WAV sound take (44,100 Hz, 16-bit, stereo - 2 channels)?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Aproximativ 10,1 MegaBytes (10.584.000 octeți).',
                textEn: 'Approximately 10.1 MegaBytes (10,584,000 bytes).',
              },
              {
                id: 'B',
                textRo: 'Doar 50 KiloBytes.',
                textEn: 'Only 50 KiloBytes.',
              },
              {
                id: 'C',
                textRo: 'Peste 5 GigaBytes.',
                textEn: 'Over 5 GigaBytes.',
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
          {q2Answer === 'A' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ro'
                  ? 'Excelent! 44.100 Hz × 2 octeți (16 biți / 8) × 2 canale × 60s = 10.584.000 octeți ≈ 10,1 MB.'
                  : 'Excellent! 44,100 Hz × 2 bytes × 2 channels × 60s = 10,584,000 bytes ≈ 10.1 MB.'}
              </span>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            {lang === 'ro'
              ? '3. De ce este recomandat să edităm proiectul în format WAV, dar să exportăm versiunea finală pentru podcast în MP3 la 192 kbps?'
              : '3. Why is it recommended to edit projects in WAV format, but export the final podcast episode in MP3 at 192 kbps?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Pentru că formatul MP3 se va șterge automat de pe internet după 24 de ore.',
                textEn: 'Because MP3 files automatically delete from the internet after 24 hours.',
              },
              {
                id: 'B',
                textRo: 'Pentru că microfonul nu recunoaște fișierele MP3 în timpul redării.',
                textEn: 'Because microphones cannot recognize MP3 files during playback.',
              },
              {
                id: 'C',
                textRo: 'Pentru a evita pierderile repetate de calitate la fiecare salvare în timpul editării (WAV), iar la final să obținem un fișier ușor de trimis și descărcat de elevi (MP3).',
                textEn: 'To avoid compounding generational loss on every save during editing (WAV), while exporting a lightweight file for easy student streaming and download (MP3).',
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
                <div className="font-bold font-mono text-emerald-400 mb-1">
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
          {q3Answer === 'C' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ro'
                  ? 'Corect! În studio edităm mereu în WAV fără pierderi, iar produsul final îl distribuim în MP3 pentru viteză și economie.'
                  : 'Correct! In the studio we edit lossless WAV, and distribute final deliverables as MP3 for speed and storage efficiency.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          {!isAllAnswered ? (
            <span className="text-indigo-400">
              {lang === 'ro'
                ? 'Răspunde corect la cele 3 întrebări pentru a finaliza Nivelul 3.'
                : 'Answer all 3 questions correctly to complete Level 3.'}
            </span>
          ) : (
            <span className="text-emerald-400 font-bold">
              {lang === 'ro'
                ? 'Calculul și deosebirea formatelor WAV și MP3 au fost validate!'
                : 'Calculations and distinction between WAV and MP3 successfully validated!'}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!isAllAnswered}
          onClick={handleFinish}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-400 hover:to-sky-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>
            {lang === 'ro'
              ? 'Treci la Nivelul 4: Interfața WavePad & Forma de Undă'
              : 'Proceed to Level 4: WavePad Interface & Waveform Editing'}
          </span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
