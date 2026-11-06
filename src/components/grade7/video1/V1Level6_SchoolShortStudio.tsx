import React, { useState } from 'react';
import { Film, Play, Square, Plus, Trash2, CheckCircle2, AlertTriangle, Sparkles, Music, Type, Download, Layers, ShieldCheck, RefreshCw } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface V1Level6Props {
  onPass: (score: number) => void;
}

export const V1Level6_SchoolShortStudio: React.FC<V1Level6Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Timeline tracks state
  const [hasClip1, setHasClip1] = useState<boolean>(true); // Curtea Școlii (6s)
  const [hasClip2, setHasClip2] = useState<boolean>(false); // Laborator TIC (6s)
  const [hasClip3, setHasClip3] = useState<boolean>(false); // Interviu Elev (8s)
  const [hasCrossFade, setHasCrossFade] = useState<boolean>(false); // 1s CrossFade between clips
  const [hasLowerThird, setHasLowerThird] = useState<boolean>(false); // Overlay on V2
  const [hasMusicTrack, setHasMusicTrack] = useState<boolean>(false); // Music on A2
  const [musicDucked, setMusicDucked] = useState<boolean>(false); // Volume lowered to 25%
  const [hasFadeOut, setHasFadeOut] = useState<boolean>(false); // Fade Out on music
  const [hasCredits, setHasCredits] = useState<boolean>(false); // End credits

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playheadSecond, setPlayheadSecond] = useState<number>(0);
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  // Auto-play timeline simulation
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayheadSecond((prev) => {
        if (prev >= 24) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Scoring rubric (out of 100)
  const scoreRubric = {
    videoClips: hasClip1 && hasClip2 && hasClip3 ? 30 : hasClip1 && (hasClip2 || hasClip3) ? 15 : 5,
    transitions: hasCrossFade ? 20 : 0,
    lowerThird: hasLowerThird ? 15 : 0,
    audioMixing: hasMusicTrack && musicDucked && hasFadeOut ? 20 : hasMusicTrack ? 10 : 0,
    credits: hasCredits ? 15 : 0
  };

  const totalStudioScore =
    scoreRubric.videoClips +
    scoreRubric.transitions +
    scoreRubric.lowerThird +
    scoreRubric.audioMixing +
    scoreRubric.credits;

  const isProductionReady = totalStudioScore >= 95;

  const handleExportMP4 = () => {
    if (!isProductionReady) return;
    sounds.playLevelComplete();
    setExportComplete(true);
    onPass(100);
  };

  const handleResetStudio = () => {
    sounds.playClick();
    setHasClip1(true);
    setHasClip2(false);
    setHasClip3(false);
    setHasCrossFade(false);
    setHasLowerThird(false);
    setHasMusicTrack(false);
    setMusicDucked(false);
    setHasFadeOut(false);
    setHasCredits(false);
    setPlayheadSecond(0);
    setIsPlaying(false);
    setExportComplete(false);
  };

  // Determine current active preview frame
  const getActiveSceneInfo = () => {
    if (playheadSecond < 6) {
      return {
        sceneRo: 'Curtea Școlii (Cadru de Stabilire)',
        sceneEn: 'School Courtyard (Establishing Shot)',
        descRo: 'Elevii sosesc dimineața în curtea liceului. Atmosferă primitoare.',
        descEn: 'Students arriving in the morning. Inviting ambient lighting.',
        icon: '🏫🌤️',
        hasV2: false
      };
    }
    if (playheadSecond < 14) {
      return {
        sceneRo: 'Laboratorul de Informatică & Robotică',
        sceneEn: 'Computer & Robotics Laboratory',
        descRo: 'Echipa testează robotul sumo pe ringul de competiție.',
        descEn: 'Students fine-tuning their autonomous robot on the practice arena.',
        icon: '💻🤖',
        hasV2: false
      };
    }
    if (playheadSecond < 20) {
      return {
        sceneRo: 'Interviu: Căpitanul Echipei de Robotică',
        sceneEn: 'Interview: Robotics Team Captain',
        descRo: '„Am programat senzorii ultrasonici să detecteze obstacolele în 10ms...”',
        descEn: '"We calibrated ultrasonic sensors to detect barriers within 10ms..."',
        icon: '🎙️🧑‍🎓',
        hasV2: hasLowerThird
      };
    }
    return {
      sceneRo: 'Generic de Final & Licențe Creative Commons',
      sceneEn: 'Closing Credits & Creative Commons Attribution',
      descRo: 'Producție Clasa a VII-a • Muzică sub licență CC-BY 4.0 • VideoPad Editor',
      descEn: 'Grade 7 Production • CC-BY 4.0 Licensed Score • VideoPad Project',
      icon: '🎬📜',
      hasV2: false
    };
  };

  const currentScene = getActiveSceneInfo();

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/60 via-pink-900/40 to-slate-900 p-6 rounded-2xl border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 text-rose-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Film className="w-4 h-4" />
          <span>
            {lang === 'ro'
              ? 'Nivelul 6 • Studioul Practic de Regie (Manual pag. 46–47)'
              : 'Level 6 • Director Studio Workshop (Textbook pp. 46–47)'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {lang === 'ro'
            ? 'Studioul de Regie: Scurtmetrajul „Școala Noastră în 30s”'
            : 'Director Studio: "Our School in 30 Seconds" Short Film'}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Ești regizorul școlii! Asamblează cele 3 cadre video brute pe Pista 1, montează tranzițiile CrossFade, plasează burtiera de identificare pe Pista 2, balansează coloana sonoră CC cu Fade Out și exportă fișierul <strong className="text-white">MP4 Full HD (1080p)</strong>.
            </>
          ) : (
            <>
              You are the director! Assemble the 3 raw footage takes on Video Track 1, insert smooth CrossFades, place the Lower Third identifier on Video Track 2, duck the CC music track with a clean Fade Out, and export the master <strong className="text-white">MP4 Full HD (1080p)</strong>.
            </>
          )}
        </p>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Media Bin & Tools */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{lang === 'ro' ? 'Coșul Media (Media Bin)' : 'Media Bin'}</span>
            </span>
            <button
              type="button"
              onClick={handleResetStudio}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              title={lang === 'ro' ? 'Resetează montajul' : 'Reset editing layout'}
            >
              <RefreshCw className="w-3 h-3" />
              <span>{lang === 'ro' ? 'Resetează' : 'Reset'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {lang === 'ro' ? 'Clipurile Brute Disponibile:' : 'Available Raw Clips:'}
            </span>

            {/* Clip 1 */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏫</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {lang === 'ro' ? '1. Curtea_Scoala.mp4' : '1. School_Yard.mp4'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lang === 'ro' ? '6 secunde • 1080p' : '6 seconds • 1080p'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setHasClip1(!hasClip1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                  hasClip1
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {hasClip1
                  ? (lang === 'ro' ? 'Pe Pistă' : 'On Track')
                  : (lang === 'ro' ? '+ Adaugă' : '+ Add')}
              </button>
            </div>

            {/* Clip 2 */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">💻</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {lang === 'ro' ? '2. Laborator_TIC.mp4' : '2. IT_Lab.mp4'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lang === 'ro' ? '8 secunde • 1080p' : '8 seconds • 1080p'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setHasClip2(!hasClip2);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                  hasClip2
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {hasClip2
                  ? (lang === 'ro' ? 'Pe Pistă' : 'On Track')
                  : (lang === 'ro' ? '+ Adaugă' : '+ Add')}
              </button>
            </div>

            {/* Clip 3 */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎙️</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {lang === 'ro' ? '3. Interviu_Elev.mp4' : '3. Student_Interview.mp4'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lang === 'ro' ? '6 secunde • 1080p + Audio' : '6 seconds • 1080p + Audio'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setHasClip3(!hasClip3);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                  hasClip3
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {hasClip3
                  ? (lang === 'ro' ? 'Pe Pistă' : 'On Track')
                  : (lang === 'ro' ? '+ Adaugă' : '+ Add')}
              </button>
            </div>
          </div>

          {/* Post-Production Actions */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {lang === 'ro' ? 'Instrumente de Montaj:' : 'Post-Production Tools:'}
            </span>

            {/* CrossFade Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setHasCrossFade(!hasCrossFade);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer ${
                hasCrossFade
                  ? 'bg-pink-950/80 border-pink-500 text-pink-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{lang === 'ro' ? 'Tranziții CrossFade (1.0s)' : 'CrossFade Transitions (1.0s)'}</span>
              </span>
              <span className="font-mono text-[10px]">
                {hasCrossFade
                  ? (lang === 'ro' ? 'ACTIVE' : 'ACTIVE')
                  : (lang === 'ro' ? 'OPRIT' : 'OFF')}
              </span>
            </button>

            {/* Lower Third Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setHasLowerThird(!hasLowerThird);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer ${
                hasLowerThird
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Type className="w-4 h-4 text-rose-400" />
                <span>{lang === 'ro' ? 'Burtieră Nume Elev (Pe V2)' : 'Student Lower Third (On V2)'}</span>
              </span>
              <span className="font-mono text-[10px]">
                {hasLowerThird
                  ? (lang === 'ro' ? 'ACTIVE' : 'ACTIVE')
                  : (lang === 'ro' ? 'OPRIT' : 'OFF')}
              </span>
            </button>

            {/* Audio Track & Ducking */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setHasMusicTrack(!hasMusicTrack);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer ${
                hasMusicTrack
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span>{lang === 'ro' ? 'Coloană Muzicală CC-BY' : 'CC-BY Background Score'}</span>
              </span>
              <span className="font-mono text-[10px]">
                {hasMusicTrack
                  ? (lang === 'ro' ? 'MONTATĂ' : 'INSERTED')
                  : (lang === 'ro' ? 'LIPSEȘTE' : 'MISSING')}
              </span>
            </button>

            {hasMusicTrack && (
              <div className="pl-4 flex flex-col gap-1.5 animate-fade-in">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setMusicDucked(!musicDucked);
                  }}
                  className={`p-2 rounded-lg text-[11px] font-bold flex items-center justify-between border cursor-pointer ${
                    musicDucked
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-amber-400'
                  }`}
                >
                  <span>{lang === 'ro' ? 'Ducking Volum la 25%' : 'Duck Volume to 25%'}</span>
                  <span>
                    {musicDucked
                      ? '100% OK'
                      : (lang === 'ro' ? 'Atenție (100% prea tare)' : 'Warning (100% too loud)')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setHasFadeOut(!hasFadeOut);
                  }}
                  className={`p-2 rounded-lg text-[11px] font-bold flex items-center justify-between border cursor-pointer ${
                    hasFadeOut
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>{lang === 'ro' ? 'Fade Out la Final (2s)' : 'Fade Out at End (2s)'}</span>
                  <span>
                    {hasFadeOut
                      ? (lang === 'ro' ? 'ACTIVAT' : 'ENABLED')
                      : (lang === 'ro' ? 'OPRIT' : 'OFF')}
                  </span>
                </button>
              </div>
            )}

            {/* Credits Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setHasCredits(!hasCredits);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer ${
                hasCredits
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ro' ? 'Generic Final & Licență CC' : 'End Credits & CC License'}</span>
              </span>
              <span className="font-mono text-[10px]">
                {hasCredits
                  ? (lang === 'ro' ? 'INSERAT' : 'INSERTED')
                  : (lang === 'ro' ? 'LIPSEȘTE' : 'MISSING')}
              </span>
            </button>
          </div>
        </div>

        {/* Center & Right Column: Live Monitor & Interactive Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Live Preview Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-300">
                  {lang === 'ro' ? 'Monitor Control:' : 'Control Monitor:'}
                </span>
                <span className="text-xs font-mono text-rose-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  00:{playheadSecond < 10 ? `0${playheadSecond}` : playheadSecond}:00 / 00:24:00
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                }`}
              >
                {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>
                  {isPlaying
                    ? (lang === 'ro' ? 'Pauză' : 'Pause')
                    : (lang === 'ro' ? 'Redă Filmul' : 'Play Project')}
                </span>
              </button>
            </div>

            {/* Monitor Screen Frame */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl relative flex flex-col justify-between p-4">
              {/* Scene Visual */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-5xl mb-2">{currentScene.icon}</div>
                <div className="text-base font-extrabold text-white">
                  {lang === 'ro' ? currentScene.sceneRo : currentScene.sceneEn}
                </div>
                <div className="text-xs text-slate-400 max-w-sm mt-1">
                  {lang === 'ro' ? currentScene.descRo : currentScene.descEn}
                </div>
              </div>

              {/* Lower Third Overlay on V2 */}
              {currentScene.hasV2 && (
                <div className="relative z-10 bg-slate-950/85 backdrop-blur border-l-4 border-rose-500 rounded-lg p-2.5 max-w-xs shadow-xl animate-fade-in self-start mt-auto">
                  <div className="text-xs font-bold text-white">
                    {lang === 'ro' ? 'Mihai Pop • Clasa a VII-a' : 'Michael Pop • Grade 7'}
                  </div>
                  <div className="text-[10px] text-rose-300">
                    {lang === 'ro' ? 'Echipa de Robotică Arkedo' : 'Arkedo Robotics Team'}
                  </div>
                </div>
              )}

              {/* Transitions Overlay flash indicator */}
              {hasCrossFade && (playheadSecond === 5 || playheadSecond === 13) && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none animate-pulse flex items-center justify-center">
                  <span className="text-xs font-mono font-bold bg-slate-950/90 text-pink-300 px-3 py-1 rounded-full border border-pink-500">
                    {lang === 'ro' ? 'Tranziție CrossFade 1.0s' : 'CrossFade Transition 1.0s'}
                  </span>
                </div>
              )}

              {/* Audio indicators */}
              <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-950/70 p-1.5 rounded border border-slate-800">
                <span>1080p Full HD (30 FPS)</span>
                <span className={musicDucked ? 'text-emerald-400' : 'text-amber-400'}>
                  Audio:{' '}
                  {hasMusicTrack
                    ? musicDucked
                      ? (lang === 'ro' ? 'Muzică Ducked 25%' : 'Music Ducked 25%')
                      : (lang === 'ro' ? 'Muzică 100% (Tare)' : 'Music 100% (Loud)')
                    : (lang === 'ro' ? 'Fără Muzică' : 'No Music')}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Multitrack Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
              <span>{lang === 'ro' ? 'Cronologia Proiectului (VideoPad Timeline)' : 'Project Timeline (VideoPad)'}</span>
              <span className="text-rose-400 font-bold">
                {lang === 'ro' ? 'Scor Montaj:' : 'Edit Score:'} {totalStudioScore} / 100
              </span>
            </div>

            {/* Video Track 2 (Overlay) */}
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="w-20 text-[11px] font-bold text-rose-300 font-mono">Video 2:</span>
              <div className="flex-1 h-7 bg-slate-900 rounded border border-slate-800 relative flex items-center px-2">
                {hasLowerThird ? (
                  <div className="w-1/3 h-5 rounded bg-rose-900/80 border border-rose-500/80 flex items-center px-2 text-[10px] font-bold text-rose-200 ml-[55%]">
                    {lang === 'ro' ? 'Burtieră_Mihai.png' : 'LowerThird_Mike.png'}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600 italic">
                    {lang === 'ro' ? 'Pistă liberă (adaugă burtieră)' : 'Empty track (add lower third)'}
                  </span>
                )}
              </div>
            </div>

            {/* Video Track 1 (Main Base) */}
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="w-20 text-[11px] font-bold text-sky-300 font-mono">Video 1:</span>
              <div className="flex-1 h-7 bg-slate-900 rounded border border-slate-800 flex items-center gap-1 px-1">
                {hasClip1 && (
                  <div className="flex-1 h-5 rounded bg-sky-950 border border-sky-600 flex items-center justify-center text-[10px] font-bold text-sky-200">
                    {lang === 'ro' ? 'Curte (6s)' : 'Yard (6s)'}
                  </div>
                )}
                {hasCrossFade && hasClip1 && hasClip2 && (
                  <span className="text-[10px] text-pink-400 font-mono font-bold">✕</span>
                )}
                {hasClip2 && (
                  <div className="flex-1 h-5 rounded bg-indigo-950 border border-indigo-600 flex items-center justify-center text-[10px] font-bold text-indigo-200">
                    {lang === 'ro' ? 'Laborator (8s)' : 'Lab (8s)'}
                  </div>
                )}
                {hasCrossFade && hasClip2 && hasClip3 && (
                  <span className="text-[10px] text-pink-400 font-mono font-bold">✕</span>
                )}
                {hasClip3 && (
                  <div className="flex-1 h-5 rounded bg-violet-950 border border-violet-600 flex items-center justify-center text-[10px] font-bold text-violet-200">
                    {lang === 'ro' ? 'Interviu (6s)' : 'Interview (6s)'}
                  </div>
                )}
                {hasCredits && (
                  <div className="w-16 h-5 rounded bg-amber-950 border border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-200">
                    {lang === 'ro' ? 'Generic (4s)' : 'Credits (4s)'}
                  </div>
                )}
              </div>
            </div>

            {/* Audio Track 1 (Dialog) */}
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="w-20 text-[11px] font-bold text-pink-300 font-mono">Audio 1:</span>
              <div className="flex-1 h-7 bg-slate-900 rounded border border-slate-800 flex items-center px-2">
                {hasClip3 ? (
                  <div className="w-1/3 h-5 rounded bg-pink-950/80 border border-pink-500/80 flex items-center px-2 text-[10px] font-bold text-pink-200 ml-[55%]">
                    {lang === 'ro' ? 'Voce_Interviu.wav (100%)' : 'Voice_Interview.wav (100%)'}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600 italic">
                    {lang === 'ro' ? 'Disponibil la adăugarea interviului' : 'Available when interview clip is added'}
                  </span>
                )}
              </div>
            </div>

            {/* Audio Track 2 (Music) */}
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850">
              <span className="w-20 text-[11px] font-bold text-purple-300 font-mono">Audio 2:</span>
              <div className="flex-1 h-7 bg-slate-900 rounded border border-slate-800 flex items-center px-1">
                {hasMusicTrack ? (
                  <div className="w-full h-5 rounded bg-purple-950/80 border border-purple-500/80 flex items-center justify-between px-2 text-[10px] font-bold text-purple-200">
                    <span>{lang === 'ro' ? 'Muzică_CC_BY.mp3' : 'Music_CC_BY.mp3'}</span>
                    <span className="font-mono text-[9px] text-purple-300">
                      {musicDucked
                        ? (lang === 'ro' ? 'Volum 25% (Ducked)' : 'Volume 25% (Ducked)')
                        : (lang === 'ro' ? 'Volum 100%' : 'Volume 100%')}{' '}
                      {hasFadeOut ? '+ Fade Out' : ''}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600 italic">
                    {lang === 'ro' ? 'Lipsește coloana sonoră de fundal' : 'Background music track missing'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist & Export Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">
            {lang === 'ro' ? 'Grilă de Evaluare a Producției Video:' : 'Video Production Evaluation Rubric:'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs">
            <span className={hasClip1 && hasClip2 && hasClip3 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              • {lang === 'ro' ? '3 Cadre pe Video 1' : '3 Clips on Video 1'}{' '}
              {hasClip1 && hasClip2 && hasClip3 ? '✓' : '(30p)'}
            </span>
            <span className={hasCrossFade ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              • {lang === 'ro' ? 'Tranziții CrossFade' : 'CrossFade Transitions'}{' '}
              {hasCrossFade ? '✓' : '(20p)'}
            </span>
            <span className={hasLowerThird ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              • {lang === 'ro' ? 'Burtieră pe Video 2' : 'Lower Third on Video 2'}{' '}
              {hasLowerThird ? '✓' : '(15p)'}
            </span>
            <span className={hasMusicTrack && musicDucked && hasFadeOut ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              • {lang === 'ro' ? 'Mix Audio & Fade' : 'Audio Mix & Fade'}{' '}
              {hasMusicTrack && musicDucked && hasFadeOut ? '✓' : '(20p)'}
            </span>
            <span className={hasCredits ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              • {lang === 'ro' ? 'Generic Final & CC' : 'End Credits & CC'}{' '}
              {hasCredits ? '✓' : '(15p)'}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={!isProductionReady || exportComplete}
          onClick={handleExportMP4}
          className={`px-8 py-3.5 rounded-xl font-extrabold text-sm transition flex items-center gap-2 cursor-pointer ${
            isProductionReady && !exportComplete
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/30 ring-2 ring-emerald-400/50'
              : exportComplete
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 cursor-default'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          {exportComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Download className="w-5 h-5" />}
          <span>
            {exportComplete
              ? (lang === 'ro' ? 'Exportat cu Succes în MP4!' : 'Successfully Exported to MP4!')
              : (lang === 'ro' ? 'Validează & Exportă MP4 (Full HD)' : 'Validate & Export MP4 (Full HD)')}
          </span>
        </button>
      </div>
    </div>
  );
};
