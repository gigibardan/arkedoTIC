import React, { useState, useEffect } from 'react';
import { HardDrive, FileAudio, Calculator, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Layers } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A1Level3Props {
  onPass: (score: number) => void;
}

export const A1Level3_AudioFormatsCalc: React.FC<A1Level3Props> = ({ onPass }) => {
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
      setQ1ErrorMsg('Incorect! WAV este un format necomprimat (Uncompressed PCM) de fidelitate absolută de studio, în timp ce MP3 folosește compresie cu pierderi psihoacustice (elimină sunetele imperceptibile de ureche) pentru a reduce mărimea de ~10 ori. Așteaptă 5 secunde.');
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
      setQ2ErrorMsg('Incorect! Formula este: 44.100 Hz × (16/8 octeți) × 2 canale × 60 secunde = 10.584.000 octeți ≈ 10,1 MB per minut de înregistrare stereo CD. Așteaptă 5 secunde.');
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
      setQ3ErrorMsg('Incorect! Când exportăm podcast-uri, interviuri sau jingle-uri pentru web și partajare ușoară, MP3 la 192 kbps oferă cel mai bun compromis: o calitate excelentă la o zecime din spațiul ocupat de WAV. Așteaptă 5 secunde.');
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
              <span>Unitatea 2: Acustică Digitală • Manual Art Klett pag. 31–32</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">Nivelul 3/7</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              Formate Audio: WAV (Necomprimat) vs MP3 & Calculul Dimensiunii
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span>Calculator Dimensiune Audio</span>
          </span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WAV Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-indigo-500/40 flex flex-col gap-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
              <FileAudio className="w-4 h-4 text-indigo-400" /> Format Necomprimat (Uncompressed)
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">.WAV (Waveform)</span>
          </div>
          <h2 className="text-base font-bold text-white font-heading mt-1">
            WAV: Calitate Maximă de Studio (Linear PCM)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Fiecare eșantion este stocat exact așa cum a fost captat de microfon, fără nicio pierdere sau aproximare. Este formatul de lucru recomandat în timpul editării în WavePad.
          </p>
          <div className="text-[11px] font-mono text-indigo-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            📌 1 minut de audio CD Stereo (44.1 kHz, 16-bit) = <strong>~10,1 MB</strong>
          </div>
        </div>

        {/* MP3 Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/40 flex flex-col gap-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Format Comprimat Psihoacustic (Lossy)
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">.MP3 (MPEG Audio)</span>
          </div>
          <h2 className="text-base font-bold text-white font-heading mt-1">
            MP3: Compact, Portabil & Streaming Eficient
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Folosește un model psihoacustic: elimină frecvențele ultra-înalte și sunetele mascate de sunete mai puternice, reducând mărimea fișierului de aproximativ <strong>10 ori</strong> fără ca omul obișnuit să sesizeze diferența.
          </p>
          <div className="text-[11px] font-mono text-emerald-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            📌 1 minut de audio MP3 la 192 kbps = <strong>~1,4 MB</strong> (economie de 86%)
          </div>
        </div>
      </div>

      {/* Interactive Storage Calculator */}
      <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col gap-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Simulatorul Formulei Matematice de Calcul Audio pe Disc
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Formula: Hz × (Biți/8) × Canale × Secunde
          </div>
        </div>

        {/* Sliders and Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Duration */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">Durată:</span>
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
              <span className="text-slate-400 font-bold">Rată:</span>
              <span className="text-teal-300 font-bold">{sampleRate / 1000} kHz</span>
            </div>
            <select
              value={sampleRate}
              onChange={(e) => setSampleRate(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2 font-mono"
            >
              <option value="22050">22.050 Hz (Radio FM)</option>
              <option value="44100">44.100 Hz (Audio CD)</option>
              <option value="48000">48.000 Hz (Video DVD / TV)</option>
              <option value="96000">96.000 Hz (Studio Hi-Res)</option>
            </select>
          </div>

          {/* Channels & Bit Depth */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">Canale & Biți:</span>
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
              <option value="96">96 kbps (Economie maximă)</option>
              <option value="128">128 kbps (Standard vechi)</option>
              <option value="192">192 kbps (Recomandat Web)</option>
              <option value="320">320 kbps (Calitate Premium)</option>
            </select>
          </div>
        </div>

        {/* Live Storage Comparison Display */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* WAV Size Indicator */}
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase">Dimensiune WAV Necomprimat:</span>
              <span className="text-2xl font-black font-mono text-white">
                {wavMb >= 1000 ? `${(wavMb / 1024).toFixed(2)} GB` : `${wavMb.toFixed(1)} MB`}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {sampleRate} × {bitDepth / 8} × {channels} × {durationSec}s = {wavBytes.toLocaleString()} octeți
              </span>
            </div>
          </div>

          <div className="text-center font-mono">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
              MP3 este de {ratio}× mai mic!
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            {/* MP3 Size Indicator */}
            <div className="flex flex-col text-right">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Dimensiune MP3 Comprimat:</span>
              <span className="text-2xl font-black font-mono text-emerald-300">
                {mp3Mb.toFixed(2)} MB
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Economie de spațiu: {((1 - mp3Mb / wavMb) * 100).toFixed(0)}%
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
            Verificarea Competențelor Tehnice (3 Întrebări Pedagogice)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            1. Care este diferența tehnică fundamentală dintre formatul WAV și formatul MP3?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'WAV poate stoca doar imagini statice, în timp ce MP3 stochează doar video.' },
              { id: 'B', text: 'WAV este necomprimat (fidelitate maximă de studio, dimensiune mare); MP3 folosește compresie cu pierderi psihoacustice (reduce dimensiunea de ~10 ori).' },
              { id: 'C', text: 'Nu există nicio diferență de compresie sau de mărime între WAV și MP3.' },
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
                <div className="font-bold font-mono text-indigo-400 mb-1">Opțiunea {opt.id}:</div>
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
              <span>Corect! WAV păstrează semnalul brut PCM, iar MP3 comprimă datele prin model psihoacustic.</span>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            2. Cât spațiu pe hard-disk ocupă 1 minut (60 sec) de sunet WAV necomprimat la standard Audio CD (44.100 Hz, 16 biți, stereo - 2 canale)?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Aproximativ 10,1 MegaBytes (10.584.000 octeți).' },
              { id: 'B', text: 'Doar 50 KiloBytes.' },
              { id: 'C', text: 'Peste 5 GigaBytes.' },
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
          {q2Answer === 'A' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Excelent! 44.100 Hz × 2 octeți (16 biți / 8) × 2 canale × 60s = 10.584.000 octeți ≈ 10,1 MB.</span>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-2.5">
            3. De ce este recomandat să edităm proiectul în format WAV, dar să exportăm versiunea finală pentru podcast în MP3 la 192 kbps?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Pentru că formatul MP3 se va șterge automat de pe internet după 24 de ore.' },
              { id: 'B', text: 'Pentru că microfonul nu recunoaște fișierele MP3 în timpul redării.' },
              { id: 'C', text: 'Pentru a evita pierderile repetate de calitate la fiecare salvare în timpul editării (WAV), iar la final să obținem un fișier ușor de trimis și descărcat de elevi (MP3).' },
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
          {q3Answer === 'C' && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Corect! În studio edităm mereu în WAV fără pierderi, iar produsul final îl distribuim în MP3 pentru viteză și economie.</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          {!isAllAnswered ? (
            <span className="text-indigo-400">Răspunde corect la cele 3 întrebări pentru a finaliza Nivelul 3.</span>
          ) : (
            <span className="text-emerald-400 font-bold">Calculul și deosebirea formatelor WAV și MP3 au fost validate!</span>
          )}
        </div>

        <button
          type="button"
          disabled={!isAllAnswered}
          onClick={handleFinish}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-400 hover:to-sky-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>Treci la Nivelul 4: Interfața WavePad & Forma de Undă</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
