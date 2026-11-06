import React, { useState } from 'react';
import { Sparkles, Play, Square, Sliders, CheckCircle2, AlertTriangle, HelpCircle, Film, ShieldCheck, Clock, ArrowRightLeft } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface V1Level4Props {
  onPass: (score: number) => void;
}

type TransitionType = 'cut' | 'crossfade' | 'wipe' | 'zoom' | 'slide';

export const V1Level4_VideoTransitions: React.FC<V1Level4Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Simulator State
  const [selectedTransition, setSelectedTransition] = useState<TransitionType>('crossfade');
  const [duration, setDuration] = useState<number>(1.0); // 0.2s - 3.0s
  const [progress, setProgress] = useState<number>(50); // 0% (Clip A) to 100% (Clip B)
  const [isAutomated, setIsAutomated] = useState<boolean>(false);

  // Auto-play preview
  React.useEffect(() => {
    if (!isAutomated) return;
    const stepTime = (duration * 1000) / 50;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsAutomated(false);
          return 100;
        }
        return prev + 2;
      });
    }, stepTime);
    return () => clearInterval(interval);
  }, [isAutomated, duration]);

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

  const handlePlayTransition = () => {
    sounds.playClick();
    setProgress(0);
    setIsAutomated(true);
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
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Tranziția CrossFade (Dizolvare încrucișată) estompează treptat primul cadru (devine transparent) în timp ce al doilea cadru apare lin peste el.'
          : 'Incorrect! CrossFade (dissolve) gradually fades out the first clip (opacity to zero) while smoothly bringing the second clip in on top.'
      );
    }
  };

  const handleQ2Select = (opt: string) => {
    if (q2Cooldown > 0 || q2Answer === 'A') return;
    if (opt === 'A') {
      sounds.playSuccess();
      setQ2Answer('A');
      setQ2ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! În cinematografia profesională, peste 90% dintre îmbinări sunt Tăieturi Directe (Hard Cut). Tranzițiile se folosesc rar și justificat (schimbare de loc, trecere de timp). Folosirea a 10 tranziții diferite distruge atenția spectatorului.'
          : 'Incorrect! In professional cinema, over 90% of edits are straight Hard Cuts. Transitions should be used sparsely and meaningfully (scene change, passage of time). Throwing 10 gimmicky transitions ruins audience immersion.'
      );
    }
  };

  const handleQ3Select = (opt: string) => {
    if (q3Cooldown > 0 || q3Answer === 'C') return;
    if (opt === 'C') {
      sounds.playSuccess();
      setQ3Answer('C');
      setQ3ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Durata standard recomandată pentru o tranziție CrossFade discretă și plăcută ochiului uman este de aproximativ 1.0 secundă (între 0.8s și 1.2s). O tranziție de 4 secunde devine obositoare și lentă.'
          : 'Incorrect! The recommended duration for a subtle, natural CrossFade is approximately 1.0 second (0.8s to 1.2s). A 4-second transition drags down the editing pace.'
      );
    }
  };

  const allQuestionsCorrect = q1Answer === 'B' && q2Answer === 'A' && q3Answer === 'C';

  const handleComplete = () => {
    if (!allQuestionsCorrect) return;
    sounds.playLevelComplete();
    onPass(100);
  };

  // Rendering styles for simulator based on transition type and progress
  const getClipAStyle = (): React.CSSProperties => {
    if (selectedTransition === 'cut') {
      return { opacity: progress < 50 ? 1 : 0 };
    }
    if (selectedTransition === 'crossfade') {
      return { opacity: 1 - progress / 100 };
    }
    if (selectedTransition === 'wipe') {
      return { clipPath: `polygon(0 0, ${100 - progress}% 0, ${100 - progress}% 100%, 0 100%)` };
    }
    if (selectedTransition === 'zoom') {
      const scale = 1 - (progress / 100) * 0.3;
      return { opacity: 1 - progress / 100, transform: `scale(${scale})` };
    }
    if (selectedTransition === 'slide') {
      return { transform: `translateX(-${progress}%)` };
    }
    return {};
  };

  const getClipBStyle = (): React.CSSProperties => {
    if (selectedTransition === 'cut') {
      return { opacity: progress >= 50 ? 1 : 0 };
    }
    if (selectedTransition === 'crossfade') {
      return { opacity: progress / 100 };
    }
    if (selectedTransition === 'wipe') {
      return { clipPath: `polygon(${100 - progress}% 0, 100% 0, 100% 100%, ${100 - progress}% 100%)` };
    }
    if (selectedTransition === 'zoom') {
      const scale = 0.7 + (progress / 100) * 0.3;
      return { opacity: progress / 100, transform: `scale(${scale})` };
    }
    if (selectedTransition === 'slide') {
      return { transform: `translateX(${100 - progress}%)` };
    }
    return {};
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/60 via-pink-900/40 to-slate-900 p-6 rounded-2xl border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 text-rose-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>
            {lang === 'ro'
              ? 'Nivelul 4 • Arta Tranzițiilor & Ritm Cinematografic (Manual pag. 42–43)'
              : 'Level 4 • The Art of Transitions & Cinematic Rhythm (Textbook pp. 42–43)'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {lang === 'ro'
            ? 'Tranziții Video: Cut Direct, CrossFade & Ștergeri Vizuale'
            : 'Video Transitions: Hard Cut, CrossFade & Visual Wipes'}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Cum treci de la o scenă la alta fără să zăpăcești privitorul? Învață diferența dintre{' '}
              <strong className="text-white">tăietura directă</strong> și{' '}
              <strong className="text-white">dizolvarea încrucișată (CrossFade)</strong>, și de ce regizorii profesioniști evită „ghiveciul” de efecte sclipitoare.
            </>
          ) : (
            <>
              How do you move between scenes without jarring the audience? Discover the craft of the{' '}
              <strong className="text-white">Hard Cut</strong> versus the{' '}
              <strong className="text-white">CrossFade (Dissolve)</strong>, and why professional editors avoid a cluttered collage of flashy gimmicks.
            </>
          )}
        </p>
      </div>

      {/* Theory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <ArrowRightLeft className="w-4 h-4" />
            <span>{lang === 'ro' ? '1. Tăietura Directă (Hard Cut)' : '1. Hard Cut (Direct Cut)'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Peste 90% din cinema. Trecerea este instantanee (0 secunde). Menține ritmul alert și este invizibilă pentru creier atunci când unghiul camerei are o logică spațială.'
              : 'Over 90% of all cinema edits. Instantaneous switch (0s). Sustains pace and feels natural when camera angles follow visual continuity rules.'}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'ro' ? '2. CrossFade (Dizolvare 1s)' : '2. CrossFade (1s Dissolve)'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Cea mai elegantă tranziție. Primul cadru dispare lin, în timp ce al doilea se conturează. Sugerează scurgerea timpului (ex: din dimineață în seară) sau o schimbare de atmosferă.'
              : 'The most elegant visual bridge. Clip A dissolves softly as Clip B blooms in. Conveys time passing (e.g., day into night) or a thematic shift in mood.'}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>{lang === 'ro' ? '3. Capcana „Ghiveciului Vizual”' : '3. The Visual Clutter Trap'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Greșeala începătorilor este să pună câte o tranziție diferită la fiecare tăietură (Wipe, Spirală, Zoom, Răsucire). Rezultatul devine obositor și arată neprofesionist!'
              : 'A classic beginner mistake is stacking different gimmicky transitions on every cut (Wipe, Swirl, Zoom, Flip). It exhausts the viewer and looks amateurish.'}
          </p>
        </div>
      </div>

      {/* Interactive Transition Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-rose-400 tracking-wider">
              {lang === 'ro' ? 'Laborator de Efecte Video' : 'Video Effects Workshop'}
            </span>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ro' ? 'Simulatorul de Tranziții în Timp Real' : 'Real-Time Transition Simulator'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayTransition}
              disabled={isAutomated}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{lang === 'ro' ? 'Redă Tranziția' : 'Play Transition'}</span>
            </button>
          </div>
        </div>

        {/* Transition Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          {/* Transition Type Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              {lang === 'ro' ? 'Tipul Tranziției:' : 'Transition Type:'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cut', labelRo: 'Tăietură (Cut)', labelEn: 'Hard Cut' },
                { id: 'crossfade', labelRo: 'CrossFade', labelEn: 'CrossFade' },
                { id: 'wipe', labelRo: 'Wipe (Ștergere)', labelEn: 'Wipe' },
                { id: 'slide', labelRo: 'Slide (Glisare)', labelEn: 'Slide' },
                { id: 'zoom', labelRo: 'Zoom (Scalare)', labelEn: 'Zoom' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTransition(t.id as TransitionType);
                  }}
                  className={`px-2.5 py-2 rounded-lg text-xs font-bold transition text-center cursor-pointer border ${
                    selectedTransition === t.id
                      ? 'bg-rose-600 border-rose-400 text-white shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {lang === 'ro' ? t.labelRo : t.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Slider */}
          <div className="flex flex-col justify-between gap-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400 font-bold uppercase">
                  {lang === 'ro' ? 'Durată Tranziție:' : 'Transition Duration:'}
                </span>
                <span className={`font-bold ${duration === 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {duration.toFixed(1)}s{' '}
                  {duration === 1.0
                    ? (lang === 'ro' ? '(Standard Ideal)' : '(Ideal Standard)')
                    : duration > 2.0
                    ? (lang === 'ro' ? '(Prea Lungă!)' : '(Too Long!)')
                    : ''}
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Manual Scrubber */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">
                  {lang === 'ro' ? 'Scrubber Manual:' : 'Manual Scrubber:'}
                </span>
                <span className="text-rose-400 font-bold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Video Canvas Preview */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl relative">
            {/* Clip A (Scene 1: School Hallway) */}
            <div
              style={getClipAStyle()}
              className="absolute inset-0 bg-gradient-to-br from-amber-900 via-stone-800 to-amber-950 flex flex-col items-center justify-center p-6 text-center transition-all duration-75 select-none"
            >
              <div className="text-4xl mb-2">🏫🔔</div>
              <div className="text-base font-extrabold text-white">
                {lang === 'ro' ? 'Cadru A: Holul Școlii în Pauză' : 'Shot A: School Hallway during Recess'}
              </div>
              <div className="text-xs text-amber-300 font-mono">
                {lang === 'ro' ? '1080p • Mișcare dinamică de cameră' : '1080p • Dynamic camera pan'}
              </div>
            </div>

            {/* Clip B (Scene 2: Computer Lab) */}
            <div
              style={getClipBStyle()}
              className="absolute inset-0 bg-gradient-to-tr from-sky-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6 text-center transition-all duration-75 select-none"
            >
              <div className="text-4xl mb-2">💻✨</div>
              <div className="text-base font-extrabold text-white">
                {lang === 'ro' ? 'Cadru B: Laboratorul de Informatică' : 'Shot B: Computer & Robotics Lab'}
              </div>
              <div className="text-xs text-sky-300 font-mono">
                {lang === 'ro' ? '1080p • Cadru fix cu elevii la monitoare' : '1080p • Static shot of students at desks'}
              </div>
            </div>

            {/* Overlay Timecode & Transition Name */}
            <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-800">
              {lang === 'ro' ? 'Tranziție:' : 'Transition:'}{' '}
              <span className="text-rose-400 font-bold uppercase">{selectedTransition}</span> ({duration}s)
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
            {duration === 1.0 && selectedTransition === 'crossfade' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'ro'
                  ? 'Alegere Recomandată: CrossFade de 1.0s asigură o trecere fină și profesională între hol și laborator.'
                  : 'Recommended Choice: A 1.0s CrossFade provides smooth, broadcast-level transition between hallway and lab.'}
              </span>
            ) : duration > 2.0 ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {lang === 'ro'
                  ? `Atenție: O durată de ${duration}s este mult prea lentă! Spectatorii vor simți că videoclipul se blochează.`
                  : `Caution: A duration of ${duration}s is too slow! The cut drags and feels sluggish.`}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Testează cele 5 moduri pentru a observa diferențele vizuale de fluiditate.'
                  : 'Test all 5 transition types to observe how each alters visual rhythm and pacing.'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verification Quiz */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>
            {lang === 'ro'
              ? 'Verificare Pedagogică • Estetica Tranzițiilor (Manual pag. 42–43)'
              : 'Pedagogical Quiz • Aesthetics of Transitions (Textbook pp. 42–43)'}
          </span>
        </div>

        {/* Q1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '1. Cum se realizează vizual efectul de tranziție „CrossFade” (Dizolvare încrucișată)?'
              : '1. How does a CrossFade (dissolve) transition work visually?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Al doilea cadru cade brusc de sus peste primul, răsturnându-l.',
                textEn: 'The second shot drops abruptly from above onto the first, knocking it down.'
              },
              {
                id: 'B',
                textRo: 'Primul cadru devine treptat transparent, în timp ce al doilea cadru devine simultan opac.',
                textEn: 'The first shot gradually becomes transparent as the second shot simultaneously fades in to full opacity.'
              },
              {
                id: 'C',
                textRo: 'Ecranul se colorează în roșu aprins timp de 10 secunde.',
                textEn: 'The screen turns bright red for 10 seconds.'
              }
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
              <span>
                {q1ErrorMsg}{' '}
                {lang === 'ro'
                  ? `(Așteaptă ${q1Cooldown}s pentru a reîncerca)`
                  : `(Wait ${q1Cooldown}s to retry)`}
              </span>
            </div>
          )}
          {q1Answer === 'B' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Dizolvarea creează un amestec fluid de lumină și formă între cele două cadre.'
                  : 'Correct! The dissolve crafts a harmonious blend of light and subject across adjacent scenes.'}
              </span>
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '2. De ce este considerată o greșeală majoră folosirea a 10 tipuri diferite de tranziții spectaculoase într-un montaj școlar?'
              : '2. Why is combining 10 different flashy transitions in a single school project considered bad practice?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Creează un „ghiveci vizual” obositor, care distrage atenția spectatorului de la mesajul și conținutul videoclipului.',
                textEn: 'It generates visual clutter that distracts the viewer from the narrative content and subject matter.'
              },
              {
                id: 'B',
                textRo: 'VideoPad se blochează dacă detectează mai mult de 2 tranziții diferite.',
                textEn: 'VideoPad crashes if it discovers more than two distinct transitions.'
              },
              {
                id: 'C',
                textRo: 'Tranzițiile diferite fac ca fișierul audio să se audă invers.',
                textEn: 'Multiple transitions cause the background audio track to play backwards.'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0 || q2Answer === 'A'}
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
              <span>
                {q2ErrorMsg}{' '}
                {lang === 'ro'
                  ? `(Așteaptă ${q2Cooldown}s pentru a reîncerca)`
                  : `(Wait ${q2Cooldown}s to retry)`}
              </span>
            </div>
          )}
          {q2Answer === 'A' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Simplitatea și coerența stilistică sunt principiile de aur ale regiei video.'
                  : 'Correct! Simplicity and stylistic restraint are core tenets of professional filmmaking.'}
              </span>
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '3. Care este durata optimă recomandată pentru o tranziție CrossFade discretă într-un reportaj sau prezentare?'
              : '3. What is the recommended duration for an unobtrusive CrossFade in a documentary or school video?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: '10 secunde, pentru ca spectatorul să aibă timp să citească pixelii.',
                textEn: '10 seconds, so the audience can study individual pixels.'
              },
              {
                id: 'B',
                textRo: '0.01 secunde, imperceptibilă pentru orice ochi.',
                textEn: '0.01 seconds, imperceptible to human eyes.'
              },
              {
                id: 'C',
                textRo: 'Aproximativ 1.0 secundă (0.8s – 1.2s), suficient pentru finețe fără a încetini ritmul.',
                textEn: 'Around 1.0 second (0.8s to 1.2s), providing subtle elegance without stalling momentum.'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q3Cooldown > 0 || q3Answer === 'C'}
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
              <span>
                {q3ErrorMsg}{' '}
                {lang === 'ro'
                  ? `(Așteaptă ${q3Cooldown}s pentru a reîncerca)`
                  : `(Wait ${q3Cooldown}s to retry)`}
              </span>
            </div>
          )}
          {q3Answer === 'C' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! 1.0 secundă oferă echilibrul perfect între naturalețe și fluiditate.'
                  : 'Correct! 1.0 second strikes the ideal sweet spot between smoothness and narrative speed.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Level Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {lang === 'ro'
              ? 'Răspunde corect la cele 3 întrebări despre tranziții pentru a trece la Nivelul 5.'
              : 'Answer all 3 questions on transitions correctly to advance to Level 5.'}
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
              ? 'Finalizează Nivelul 4 & Mergi la Titrare & Text'
              : 'Complete Level 4 & Advance to Titles & Graphics'}
          </span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
