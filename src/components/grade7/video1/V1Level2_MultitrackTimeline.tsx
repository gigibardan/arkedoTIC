import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Volume2, VolumeX, Lock, Unlock, Play, Square, Info, CheckCircle2, AlertTriangle, HelpCircle, Film, Music, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';

interface V1Level2Props {
  onPass: (score: number) => void;
}

export const V1Level2_MultitrackTimeline: React.FC<V1Level2Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Track states
  const [videoTrack2Visible, setVideoTrack2Visible] = useState<boolean>(true); // Overlay / Lower-Third / Logo
  const [videoTrack1Visible, setVideoTrack1Visible] = useState<boolean>(true); // Base Video
  const [videoTrack2Locked, setVideoTrack2Locked] = useState<boolean>(false);
  const [videoTrack1Locked, setVideoTrack1Locked] = useState<boolean>(false);

  const [audioTrack1Muted, setAudioTrack1Muted] = useState<boolean>(false); // Speech / Dialog
  const [audioTrack2Muted, setAudioTrack2Muted] = useState<boolean>(false); // Music Bed
  const [audioTrack1Volume, setAudioTrack1Volume] = useState<number>(100);
  const [audioTrack2Volume, setAudioTrack2Volume] = useState<number>(25); // Ducked

  // Preview playback
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playheadPos, setPlayheadPos] = useState<number>(30); // percentage

  // Animate playhead if playing
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayheadPos((prev) => (prev >= 98 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  // Timers for 5s cooldown
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

  const handleQ1Select = (opt: string) => {
    if (q1Cooldown > 0 || q1Answer === 'B') return;
    if (opt === 'B') {
      sounds.playSuccess();
      setQ1Answer('B');
      setQ1ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! În editarea video, pista superioară (Video Track 2) este desenată peste pista inferioară (Video Track 1), acoperind-o dacă este complet opacă. Gândește-te la foi de hârtie așezate una peste alta!'
          : 'Incorrect! In video editing, upper tracks (V2) layer over lower tracks (V1), like transparent or opaque acetate sheets stacked vertically.'
      );
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
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Tehnica se numește „Audio Ducking” (atenuare): muzica de fundal este coborâtă la 20-30% din volum în momentele în care cineva vorbește, pentru ca vocea să rămână clară și inteligibilă.'
          : 'Incorrect! The technique is Audio Ducking: background music is attenuated to 20-30% during dialogue so voices stay clear and intelligible.'
      );
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
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Butonul cu simbolul unui ochi (Eye) ascunde pista din previzualizare și randare, iar butonul cu lacăt (Lock) o blochează împotriva deplasării, tăierii sau ștergerii accidentale.'
          : 'Incorrect! The eye icon hides tracks from preview, while the lock icon prevents accidental edits, ripples, or cuts.'
      );
    }
  };

  const allQuestionsCorrect = q1Answer === 'B' && q2Answer === 'C' && q3Answer === 'A';
  const isOptimalAudioBalance = !audioTrack1Muted && !audioTrack2Muted && audioTrack1Volume >= 80 && audioTrack2Volume <= 35;

  const handleComplete = () => {
    if (!allQuestionsCorrect) return;
    sounds.playLevelComplete();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto text-slate-100">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/60 via-pink-900/40 to-slate-900 p-6 rounded-2xl border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-rose-500/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 text-rose-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>{lang === 'ro' ? 'Nivelul 2 • Cronologie & Straturi Suprapuse (Manual pag. 38–39)' : 'Level 2 • Timeline & Overlay Layers (Textbook pp. 38–39)'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {lang === 'ro'
            ? 'Piste Paralele în VideoPad: Video Track vs. Audio Track'
            : 'Parallel Tracks in VideoPad: Video Track vs. Audio Track'}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Spre deosebire de un simplu player video, un program de montaj profesional funcționează ca o{' '}
              <strong className="text-white">stivă de straturi</strong>. Înțelegerea ierarhiei pistelor (piste superioare peste piste inferioare) și separarea dialogului de muzica de fundal sunt bazele oricărei producții televizate.
            </>
          ) : (
            <>
              Unlike a simple media player, a professional video editor functions as a{' '}
              <strong className="text-white">multi-layer stack</strong>. Understanding track hierarchy (higher tracks rendering over lower tracks) and separating dialog from music beds are foundational to television and video production.
            </>
          )}
        </p>
      </div>

      {/* Theory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <Film className="w-4 h-4" />
            <span>
              {lang === 'ro'
                ? 'Pistele Video (Video Tracks): Regula Stivei'
                : 'Video Tracks: Layer Stack Rules'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro' ? (
              <>Pistele video sunt etajate vertical. <strong className="text-amber-300">Video Track 2 (superioară)</strong> se află deasupra pistei <strong className="text-amber-300">Video Track 1 (de bază)</strong>.</>
            ) : (
              <>Video tracks are stacked vertically. <strong className="text-amber-300">Video Track 2 (top)</strong> sits directly above <strong className="text-amber-300">Video Track 1 (base layer)</strong>.</>
            )}
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            {lang === 'ro' ? (
              <>
                <li>Un clip complet opac pe Pista 2 acoperă în totalitate ce se află dedesubt pe Pista 1.</li>
                <li>Dacă folosim grafică cu fundal transparent (PNG, titluri, sigle, burtiere), elementul grafic plutește elegant peste clipul din Pista 1!</li>
                <li>Tehnica <em>Picture-in-Picture (PiP)</em> permite redimensionarea unui clip de pe Pista 2 pentru a crea ferestre mici (ex: ecranul profesorului în colț).</li>
              </>
            ) : (
              <>
                <li>A fully opaque clip on Track 2 completely conceals whatever lies beneath on Track 1.</li>
                <li>Transparent graphics (PNG titles, school logos, lower thirds) float cleanly above Track 1 footage!</li>
                <li>The <em>Picture-in-Picture (PiP)</em> technique scales a Track 2 video into an inset box (e.g., webcam corner window).</li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
            <Music className="w-4 h-4" />
            <span>
              {lang === 'ro'
                ? 'Pistele Audio (Audio Tracks) & Audio Ducking'
                : 'Audio Tracks & Audio Ducking'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro' ? (
              <>Sunetele de pe toate pistele audio active se <strong className="text-white">mixează (se aud simultan)</strong>. De aceea este vitală separarea rolurilor:</>
            ) : (
              <>Audio across all unmuted tracks is <strong className="text-white">mixed (heard simultaneously)</strong>. Separating audio roles is vital:</>
            )}
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            {lang === 'ro' ? (
              <>
                <li><strong className="text-pink-300">Audio Track 1 (Dialog / Voce):</strong> Înregistrarea de la microfon. Trebuie ținută la volum 90–100% pentru claritate.</li>
                <li><strong className="text-pink-300">Audio Track 2 (Muzică Bed):</strong> Melodia de atmosferă. În timpul discursului se reduce la 20–30% (ducking) pentru a nu concura cu vocea.</li>
                <li><strong className="text-pink-300">Audio Track 3 (Efecte FX):</strong> Zgomote scurte (sunete de pași, tranziții sonore).</li>
              </>
            ) : (
              <>
                <li><strong className="text-pink-300">Audio Track 1 (Dialogue / Voice):</strong> Microphone recording. Keep at 90–100% for maximum clarity.</li>
                <li><strong className="text-pink-300">Audio Track 2 (Music Bed):</strong> Ambient score. Attenuate to 20–30% (ducking) during speech so words remain clear.</li>
                <li><strong className="text-pink-300">Audio Track 3 (Sound FX):</strong> Short punctuation noises (whooshes, footsteps, chimes).</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Interactive Simulator: Multitrack Console & Monitor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-rose-400 tracking-wider">
              {lang === 'ro' ? 'Laborator Practic Interactiv' : 'Interactive Practical Lab'}
            </span>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ro'
                ? 'Consola Multitrack & Monitorul de Control VideoPad'
                : 'Multitrack Console & VideoPad Control Monitor'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsPlaying(!isPlaying);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? (lang === 'ro' ? 'Pauză' : 'Pause') : (lang === 'ro' ? 'Redă Montajul' : 'Play Timeline')}</span>
            </button>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              {lang === 'ro' ? 'Cursor:' : 'Playhead:'} 00:0{Math.floor(playheadPos / 10)}.{playheadPos % 10}s
            </span>
          </div>
        </div>

        {/* Video Monitor (Combined Preview) */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-inner relative flex items-center justify-center">
            {/* Base Layer: Video Track 1 */}
            {videoTrack1Visible ? (
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-900 via-slate-800 to-indigo-950 flex flex-col justify-end p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-rose-500/30 border border-rose-400/60 flex items-center justify-center text-xl">
                    🎓
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {lang === 'ro' ? 'Reportaj: Curtea Școlii & Laboratorul TIC' : 'Report: School Courtyard & Computer Lab'}
                    </div>
                    <div className="text-xs text-sky-300">
                      {lang === 'ro' ? 'Pista Video 1 (Cadru Principal de Bază)' : 'Video Track 1 (Primary Base Layer)'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black flex items-center justify-center text-slate-600 text-xs font-mono">
                {lang === 'ro' ? '[Pista Video 1 este Ascunsă - Ecran Negru]' : '[Video Track 1 is Hidden - Black Screen]'}
              </div>
            )}

            {/* Overlay Layer: Video Track 2 (Lower Third & Logo) */}
            {videoTrack2Visible && (
              <div className="absolute inset-x-4 bottom-4 bg-slate-950/85 backdrop-blur-md border border-rose-500/40 rounded-xl p-3 flex items-center justify-between shadow-2xl animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-xs">
                    TIC
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-300">
                      {lang === 'ro' ? 'Andrei Ionescu • Clasa a VII-a B' : 'Alex Jones • 7th Grade B'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {lang === 'ro'
                        ? 'Pista Video 2 (Overlay Transparent / Burtieră)'
                        : 'Video Track 2 (Transparent Lower-Third Overlay)'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-rose-950/60 text-rose-400 px-2 py-0.5 rounded border border-rose-800">
                  V2 Top Layer
                </span>
              </div>
            )}

            {/* Audio meters indicator inside monitor */}
            <div className="absolute top-3 right-3 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">A1:</span>
                <span className={audioTrack1Muted ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {audioTrack1Muted ? (lang === 'ro' ? 'MUT' : 'MUTE') : `${audioTrack1Volume}%`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
                <span className="text-slate-400">A2:</span>
                <span className={audioTrack2Muted ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                  {audioTrack2Muted ? (lang === 'ro' ? 'MUT' : 'MUTE') : `${audioTrack2Volume}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback status on optimal mix */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            {isOptimalAudioBalance && videoTrack1Visible && videoTrack2Visible ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'ro'
                  ? 'Echilibru Regizoral Excelent: Vocea este clară (100%), muzica este discretă sub ea (≤35%), iar grafica V2 este vizibilă!'
                  : 'Excellent Directorial Balance: Voice is distinct (100%), music is subtle underneath (≤35%), and V2 overlay is visible!'}
              </span>
            ) : audioTrack2Volume > 50 && !audioTrack2Muted ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {lang === 'ro'
                  ? `Atenție: Muzica de pe A2 (${audioTrack2Volume}%) acoperă vocea elevului. Redu volumul sub 35% pentru ducking optim!`
                  : `Warning: Music bed on A2 (${audioTrack2Volume}%) drowns out voice. Lower volume below 35% for optimal ducking!`}
              </span>
            ) : !videoTrack1Visible ? (
              <span className="text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {lang === 'ro'
                  ? 'Pista Video 1 este oprită! Activează ochiul pe V1 pentru a reda cadrul principal.'
                  : 'Video Track 1 is hidden! Toggle eye icon on V1 to display the main picture.'}
              </span>
            ) : (
              <span className="text-slate-400">
                {lang === 'ro'
                  ? 'Ajustează glisoarele de volum și butoanele de vizibilitate pentru a testa cum reacționează montajul.'
                  : 'Adjust volume sliders and track visibility toggles to see how the sequence responds.'}
              </span>
            )}
          </div>
        </div>

        {/* Timeline Tracks UI */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col gap-3 relative">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{lang === 'ro' ? 'Cronologie Multitrack (VideoPad Timeline)' : 'Multitrack Timeline (VideoPad Timeline)'}</span>
            <span className="text-[11px] text-slate-500 font-normal">
              {lang === 'ro' ? 'Cursorul roșu indică poziția de redare' : 'Red playhead marks playback position'}
            </span>
          </div>

          {/* Timeline Playhead line */}
          <div
            className="absolute top-10 bottom-4 w-0.5 bg-rose-500 pointer-events-none z-20 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
            style={{ left: `calc(180px + (100% - 200px) * ${playheadPos / 100})` }}
          >
            <div className="w-3 h-3 bg-rose-500 rotate-45 -translate-x-[5px] -translate-y-1.5 shadow" />
          </div>

          {/* Video Track 2 (Overlay) */}
          <div className="flex items-center gap-2 bg-slate-900 border border-rose-900/40 rounded-lg p-2">
            <div className="w-44 flex items-center justify-between pr-2 border-r border-slate-800">
              <div className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-xs font-bold text-rose-300">Video Track 2</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setVideoTrack2Visible(!videoTrack2Visible);
                  }}
                  className={`p-1 rounded cursor-pointer ${videoTrack2Visible ? 'text-slate-300 hover:text-white' : 'text-rose-500 bg-rose-950/50'}`}
                  title={videoTrack2Visible ? (lang === 'ro' ? 'Ascunde Pista 2' : 'Hide Track 2') : (lang === 'ro' ? 'Arată Pista 2' : 'Show Track 2')}
                >
                  {videoTrack2Visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setVideoTrack2Locked(!videoTrack2Locked);
                  }}
                  className={`p-1 rounded cursor-pointer ${videoTrack2Locked ? 'text-amber-400 bg-amber-950/40' : 'text-slate-500 hover:text-slate-300'}`}
                  title={videoTrack2Locked ? (lang === 'ro' ? 'Pistă Blocată' : 'Track Locked') : (lang === 'ro' ? 'Blochează Pista' : 'Lock Track')}
                >
                  {videoTrack2Locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Track Content Lane */}
            <div className="flex-1 bg-slate-950 rounded h-10 border border-slate-800/80 relative overflow-hidden flex items-center px-2">
              <div className="w-2/5 h-7 rounded bg-rose-900/70 border border-rose-500/60 flex items-center px-3 gap-2 text-xs text-rose-100 ml-[25%] shadow">
                <span className="font-bold">{lang === 'ro' ? 'Burtieră_Elev_Nume.png' : 'LowerThird_Student_Name.png'}</span>
                <span className="text-[10px] text-rose-300 font-mono">(Overlay Alpha)</span>
              </div>
            </div>
          </div>

          {/* Video Track 1 (Base Video) */}
          <div className="flex items-center gap-2 bg-slate-900 border border-sky-900/40 rounded-lg p-2">
            <div className="w-44 flex items-center justify-between pr-2 border-r border-slate-800">
              <div className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs font-bold text-sky-300">Video Track 1</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setVideoTrack1Visible(!videoTrack1Visible);
                  }}
                  className={`p-1 rounded cursor-pointer ${videoTrack1Visible ? 'text-slate-300 hover:text-white' : 'text-rose-500 bg-rose-950/50'}`}
                  title={videoTrack1Visible ? (lang === 'ro' ? 'Ascunde Pista 1' : 'Hide Track 1') : (lang === 'ro' ? 'Arată Pista 1' : 'Show Track 1')}
                >
                  {videoTrack1Visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setVideoTrack1Locked(!videoTrack1Locked);
                  }}
                  className={`p-1 rounded cursor-pointer ${videoTrack1Locked ? 'text-amber-400 bg-amber-950/40' : 'text-slate-500 hover:text-slate-300'}`}
                  title={videoTrack1Locked ? (lang === 'ro' ? 'Pistă Blocată' : 'Track Locked') : (lang === 'ro' ? 'Blochează Pista' : 'Lock Track')}
                >
                  {videoTrack1Locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Track Content Lane */}
            <div className="flex-1 bg-slate-950 rounded h-10 border border-slate-800/80 relative overflow-hidden flex items-center gap-1 px-1">
              <div className="flex-1 h-7 rounded bg-sky-950/80 border border-sky-600/50 flex items-center px-3 gap-2 text-xs text-sky-200">
                <span className="font-bold">{lang === 'ro' ? 'Cadru1_Curte_Scoala.mp4' : 'Clip1_School_Yard.mp4'}</span>
                <span className="text-[10px] text-sky-400 font-mono">(1080p 30fps)</span>
              </div>
              <div className="flex-1 h-7 rounded bg-indigo-950/80 border border-indigo-600/50 flex items-center px-3 gap-2 text-xs text-indigo-200">
                <span className="font-bold">{lang === 'ro' ? 'Cadru2_Interviu_Laborator.mp4' : 'Clip2_Lab_Interview.mp4'}</span>
              </div>
            </div>
          </div>

          {/* Audio Track 1 (Dialog / Speech) */}
          <div className="flex items-center gap-2 bg-slate-900 border border-pink-900/40 rounded-lg p-2">
            <div className="w-44 flex items-center justify-between pr-2 border-r border-slate-800">
              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs font-bold text-pink-300">Audio Track 1</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setAudioTrack1Muted(!audioTrack1Muted);
                  }}
                  className={`p-1 rounded cursor-pointer ${audioTrack1Muted ? 'text-rose-500 bg-rose-950/50' : 'text-slate-300 hover:text-white'}`}
                  title={audioTrack1Muted ? (lang === 'ro' ? 'Activează Sunetul' : 'Unmute Audio') : (lang === 'ro' ? 'Oprește Sunetul (Mute)' : 'Mute Audio')}
                >
                  {audioTrack1Muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioTrack1Volume}
                    onChange={(e) => setAudioTrack1Volume(Number(e.target.value))}
                    className="w-12 h-1 accent-pink-500 cursor-pointer"
                    title={`${lang === 'ro' ? 'Volum Dialog:' : 'Dialogue Volume:'} ${audioTrack1Volume}%`}
                  />
                  <span className="text-[9px] font-mono text-slate-400 w-6">{audioTrack1Volume}%</span>
                </div>
              </div>
            </div>

            {/* Track Content Lane */}
            <div className="flex-1 bg-slate-950 rounded h-10 border border-slate-800/80 relative overflow-hidden flex items-center px-1">
              <div className="w-3/5 h-7 rounded bg-pink-950/70 border border-pink-500/50 flex items-center px-3 gap-2 text-xs text-pink-200 ml-[30%]">
                <span className="font-bold">{lang === 'ro' ? 'Voce_Interviu_Elev.wav' : 'Voice_Student_Interview.wav'}</span>
                <span className="text-[10px] text-pink-400 font-mono">({lang === 'ro' ? 'Voce Principală' : 'Primary Dialogue'})</span>
              </div>
            </div>
          </div>

          {/* Audio Track 2 (Background Music / Ducking) */}
          <div className="flex items-center gap-2 bg-slate-900 border border-purple-900/40 rounded-lg p-2">
            <div className="w-44 flex items-center justify-between pr-2 border-r border-slate-800">
              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-bold text-purple-300">Audio Track 2</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setAudioTrack2Muted(!audioTrack2Muted);
                  }}
                  className={`p-1 rounded cursor-pointer ${audioTrack2Muted ? 'text-rose-500 bg-rose-950/50' : 'text-slate-300 hover:text-white'}`}
                  title={audioTrack2Muted ? (lang === 'ro' ? 'Activează Muzica' : 'Unmute Music') : (lang === 'ro' ? 'Oprește Muzica' : 'Mute Music')}
                >
                  {audioTrack2Muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioTrack2Volume}
                    onChange={(e) => setAudioTrack2Volume(Number(e.target.value))}
                    className="w-12 h-1 accent-purple-500 cursor-pointer"
                    title={`${lang === 'ro' ? 'Volum Muzică:' : 'Music Volume:'} ${audioTrack2Volume}%`}
                  />
                  <span className="text-[9px] font-mono text-slate-400 w-6">{audioTrack2Volume}%</span>
                </div>
              </div>
            </div>

            {/* Track Content Lane */}
            <div className="flex-1 bg-slate-950 rounded h-10 border border-slate-800/80 relative overflow-hidden flex items-center px-1">
              <div className="w-full h-7 rounded bg-purple-950/70 border border-purple-500/50 flex items-center px-3 gap-2 text-xs text-purple-200">
                <span className="font-bold">{lang === 'ro' ? 'Muzica_Ambientala_CC_BY.mp3' : 'Ambient_Music_CC_BY.mp3'}</span>
                <span className="text-[10px] text-purple-400 font-mono">({lang === 'ro' ? 'Muzică de fundal ducked' : 'Ducked background bed'})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Quiz (3 Questions with 5s cooldown) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>
            {lang === 'ro'
              ? 'Verificare Pedagogică • Testul Pistelor VideoPad (Manual pag. 38–39)'
              : 'Pedagogical Check • VideoPad Tracks Test (Textbook pp. 38–39)'}
          </span>
        </div>

        {/* Q1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '1. Dacă plasezi un titlu text pe Video Track 2 și un cadru video cu școala pe Video Track 1, ce se va vedea pe ecranul final?'
              : '1. If you place title text on Video Track 2 and school footage on Video Track 1, what appears on the final display?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Doar cadrul cu școala, deoarece Video Track 1 are mereu prioritate absolută.',
                textEn: 'Only the school footage, because Video Track 1 always takes absolute priority.',
              },
              {
                id: 'B',
                textRo: 'Titlul text plutind deasupra cadrului cu școala, deoarece pista superioară (V2) se suprapune peste pista inferioară (V1).',
                textEn: 'The title text floating atop the school footage, because upper tracks (V2) layer above lower tracks (V1).',
              },
              {
                id: 'C',
                textRo: 'Un ecran complet negru, deoarece două clipuri video pe piste diferite intră în conflict.',
                textEn: 'A completely black screen, because two video clips on separate tracks conflict.',
              },
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
                <span className="font-bold text-rose-400">
                  {lang === 'ro' ? `Opțiunea ${opt.id}` : `Option ${opt.id}`}
                </span>
                <span>{lang === 'ro' ? opt.textRo : opt.textEn}</span>
              </button>
            ))}
          </div>
          {q1Cooldown > 0 && (
            <div className="text-xs text-rose-400 font-mono flex items-center gap-2 mt-1 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{q1ErrorMsg} ({lang === 'ro' ? `Așteaptă ${q1Cooldown}s pentru a reîncerca` : `Wait ${q1Cooldown}s to retry`})</span>
            </div>
          )}
          {q1Answer === 'B' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! VideoPad respectă regula straturilor (layering): pista 2 se așază peste pista 1.'
                  : 'Correct! VideoPad respects visual layering: track 2 sits directly atop track 1.'}
              </span>
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '2. Cum procedăm profesional când avem un reportaj în care vorbește un elev pe Audio Track 1 și avem muzică pe Audio Track 2?'
              : '2. How do we professionally mix audio when student dialogue is on Audio Track 1 and music is on Audio Track 2?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Lăsăm muzica la 100% și vocea la 100%, pentru ca ambele să aibă putere maximă.',
                textEn: 'Leave music at 100% and speech at 100% so both blast at maximum power.',
              },
              {
                id: 'B',
                textRo: 'Ștergem complet muzica, deoarece un videoclip nu poate conține niciodată două piste audio.',
                textEn: 'Completely delete music, because videos can never contain dual audio tracks.',
              },
              {
                id: 'C',
                textRo: 'Aplicăm tehnica de Ducking: reducem muzica la 20–30% pe durata vorbirii, pentru ca vocea să fie clar inteligibilă.',
                textEn: 'Apply audio ducking: reduce music to 20–30% during speech so dialogue remains pristine and intelligible.',
              },
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
                <span className="font-bold text-rose-400">
                  {lang === 'ro' ? `Opțiunea ${opt.id}` : `Option ${opt.id}`}
                </span>
                <span>{lang === 'ro' ? opt.textRo : opt.textEn}</span>
              </button>
            ))}
          </div>
          {q2Cooldown > 0 && (
            <div className="text-xs text-rose-400 font-mono flex items-center gap-2 mt-1 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{q2ErrorMsg} ({lang === 'ro' ? `Așteaptă ${q2Cooldown}s pentru a reîncerca` : `Wait ${q2Cooldown}s to retry`})</span>
            </div>
          )}
          {q2Answer === 'C' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Ducking-ul audio garantează că ascultătorul înțelege clar mesajul vorbit fără a fi distras.'
                  : 'Correct! Audio ducking guarantees viewers easily comprehend spoken dialogue without distraction.'}
              </span>
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '3. De ce este recomandat să folosim pictograma cu Lacăt (Lock) pe o pistă după ce am terminat aranjarea acesteia?'
              : '3. Why is it recommended to use the Lock icon on a track after completing its arrangement?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Pentru a preveni deplasarea, tăierea sau ștergerea accidentală a clipurilor în timp ce edităm alte piste.',
                textEn: 'To prevent accidental movement, slicing, or deletion of clips while working on other tracks.',
              },
              {
                id: 'B',
                textRo: 'Pentru a cripta fișierul video cu o parolă secretă împotriva piratării.',
                textEn: 'To encrypt the video with a secret password against piracy.',
              },
              {
                id: 'C',
                textRo: 'Pentru a opri automat sunetul de pe toate boxele calculatorului.',
                textEn: 'To automatically mute all PC speakers.',
              },
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
                <span className="font-bold text-rose-400">
                  {lang === 'ro' ? `Opțiunea ${opt.id}` : `Option ${opt.id}`}
                </span>
                <span>{lang === 'ro' ? opt.textRo : opt.textEn}</span>
              </button>
            ))}
          </div>
          {q3Cooldown > 0 && (
            <div className="text-xs text-rose-400 font-mono flex items-center gap-2 mt-1 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{q3ErrorMsg} ({lang === 'ro' ? `Așteaptă ${q3Cooldown}s pentru a reîncerca` : `Wait ${q3Cooldown}s to retry`})</span>
            </div>
          )}
          {q3Answer === 'A' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Blocarea pistelor finalizate este o practică esențială pentru a evita decalarea asincronă a sunetului de imagine.'
                  : 'Correct! Locking completed tracks is standard practice to safeguard against accidental sync slips.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Complete Step Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {lang === 'ro'
              ? 'Completează cele 3 întrebări corect pentru a debloca Nivelul 3.'
              : 'Answer all 3 questions correctly to unlock Level 3.'}
          </span>
        </div>

        <button
          type="button"
          disabled={!allQuestionsCorrect}
          onClick={handleComplete}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
            allQuestionsCorrect
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>
            {lang === 'ro'
              ? 'Finalizează Nivelul 2 & Mergi la Tăieri Split'
              : 'Complete Level 2 & Proceed to Split Edits'}
          </span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
