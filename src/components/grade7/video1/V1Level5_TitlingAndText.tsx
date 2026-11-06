import React, { useState } from 'react';
import { Type, Eye, Palette, CheckCircle2, AlertTriangle, HelpCircle, Film, ShieldCheck, Sun, Moon, Sparkles } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface V1Level5Props {
  onPass: (score: number) => void;
}

type TitleMode = 'lower_third' | 'title_card' | 'credits';

export const V1Level5_TitlingAndText: React.FC<V1Level5Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Designer State
  const [titleMode, setTitleMode] = useState<TitleMode>('lower_third');
  const [mainText, setMainText] = useState<string>(
    lang === 'ro' ? 'Andrei Ionescu' : 'Andrew Miller'
  );
  const [subText, setSubText] = useState<string>(
    lang === 'ro'
      ? 'Căpitan Echipa de Robotică • Clasa a VII-a'
      : 'Robotics Team Captain • Grade 7'
  );
  const [barOpacity, setBarOpacity] = useState<number>(85); // 0% to 100%
  const [hasOutline, setHasOutline] = useState<boolean>(true);
  const [backgroundScene, setBackgroundScene] = useState<'sunny' | 'dark'>('sunny');

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

  // Contrast analysis
  const isHighContrast = (): { status: 'good' | 'poor'; adviceRo: string; adviceEn: string } => {
    if (backgroundScene === 'sunny') {
      if (barOpacity < 40 && !hasOutline) {
        return {
          status: 'poor',
          adviceRo: 'Vizibilitate Scăzută: Textul alb fără contur pe fundal însorit este greu de citit! Mărește opacitatea barei de fundal sau activează conturul negru.',
          adviceEn: 'Low Contrast: White text without an outline on a sunny bright shot is unreadable! Increase banner opacity or enable the drop shadow/outline.'
        };
      }
    }
    return {
      status: 'good',
      adviceRo: 'Lizibilitate Excelentă: Contrastul dintre text și fundal respectă standardele de televiziune HD.',
      adviceEn: 'Crisp Readability: Contrast between typography and video backdrop complies with HD broadcast guidelines.'
    };
  };

  const contrastScore = isHighContrast();

  const handleQ1Select = (opt: string) => {
    if (q1Cooldown > 0 || q1Answer === 'C') return;
    if (opt === 'C') {
      sounds.playSuccess();
      setQ1Answer('C');
      setQ1ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! „Lower Third” (Burtiera sau Treimea Inferioară) este o bandă grafică plasată în partea de jos a ecranului care afișează numele interlocutorului și rolul sau funcția sa, fără a-i acoperi fața.'
          : 'Incorrect! A "Lower Third" is a graphic overlay positioned in the lower third of the screen to identify a speaker by name and title without occluding their face.'
      );
    }
  };

  const handleQ2Select = (opt: string) => {
    if (q2Cooldown > 0 || q2Answer === 'B') return;
    if (opt === 'B') {
      sounds.playSuccess();
      setQ2Answer('B');
      setQ2ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Fonturile decorative caligrafice (ondulate, cu floricele subțiri) devin ilizibile pe ecrane mici sau comprimate. Se recomandă fonturi Sans-Serif clare, aldine (bold) și contrast ridicat.'
          : 'Incorrect! Intricate decorative calligraphy fonts become illegible when compressed or viewed on small screens. Clean bold Sans-Serif fonts with strong contrast are strongly advised.'
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
          ? 'Incorect! Scurtătura rapidă din VideoPad pentru adăugarea unui titlu text sau generic este combinația Ctrl + B.'
          : 'Incorrect! The quick shortcut in VideoPad to insert a text title or overlay card is Ctrl + B.'
      );
    }
  };

  const allQuestionsCorrect = q1Answer === 'C' && q2Answer === 'B' && q3Answer === 'A';

  const handleComplete = () => {
    if (!allQuestionsCorrect) return;
    sounds.playLevelComplete();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/60 via-pink-900/40 to-slate-900 p-6 rounded-2xl border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 text-rose-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Type className="w-4 h-4" />
          <span>
            {lang === 'ro'
              ? 'Nivelul 5 • Titrare, Burtiere & Generice (Manual pag. 44–45)'
              : 'Level 5 • Titling, Lower Thirds & End Credits (Textbook pp. 44–45)'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {lang === 'ro'
            ? 'Titrarea în VideoPad: Lower Thirds & Generice de Final'
            : 'Titling in VideoPad: Lower Thirds & End Credits'}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Fiecare producție TV sau reportaj școlar are nevoie de identificare vizuală. Învață cum se configurează o{' '}
              <strong className="text-white">burtieră profesională (Lower Third)</strong>, cum asiguri contrastul fontului pe fundaluri luminoase și cum organizezi genericul de final cu <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-rose-300 font-mono font-bold">Ctrl + B</kbd>.
            </>
          ) : (
            <>
              Every documentary or school video requires visual credibility. Learn how to design a{' '}
              <strong className="text-white">broadcast Lower Third banner</strong>, how to enforce typographic contrast against bright video backgrounds, and how to format rolling credits with <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-rose-300 font-mono font-bold">Ctrl + B</kbd>.
            </>
          )}
        </p>
      </div>

      {/* Theory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <Film className="w-4 h-4" />
            <span>{lang === 'ro' ? '1. Ecranul de Titlu (Title Card)' : '1. Title Card (Intro Card)'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Apare la începutul videoclipului pe fundal opac sau video lent. Conține numele filmului, clasa, școala și anul școlar. Durată optimă: 3–4 secunde.'
              : 'Appears at the head of the video over solid color or slow b-roll. Features title, grade, school, and production year. Optimal duration: 3–4 seconds.'}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
            <Type className="w-4 h-4" />
            <span>{lang === 'ro' ? '2. Burtiera (Lower Third)' : '2. Lower Third Banner'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Banda plasată în treimea inferioară a ecranului. Prezintă interlocutorul (Nume, Rol) fără a-i obstrucționa privirea. Folosește o bară semi-transparentă pentru contrast.'
              : 'A banner resting in the bottom third of the frame. Identifies the speaker (Name, Title) without covering their face. Uses a tinted scrim for legibility.'}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'ro' ? '3. Generic Final Rulant (Credits)' : '3. Rolling End Credits'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Defilează vertical de jos în sus la final. Mulțumește participanților și menționează obligatoriu sursele muzicale și licențele Creative Commons utilizate!'
              : 'Scrolls vertically from bottom to top at the close. Credits crew and cast, and mandatorily lists music titles and Creative Commons licensing!'}
          </p>
        </div>
      </div>

      {/* Interactive Titling Studio */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-rose-400 tracking-wider">
              {lang === 'ro' ? 'Laborator de Grafică TV' : 'Broadcast Graphics Lab'}
            </span>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ro' ? 'Studioul de Creare și Testare Lower Third' : 'Lower Third Creation & Contrast Studio'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setBackgroundScene(backgroundScene === 'sunny' ? 'dark' : 'sunny');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              {backgroundScene === 'sunny' ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>
                {lang === 'ro'
                  ? `Fundal: ${backgroundScene === 'sunny' ? 'Curte Însorită' : 'Sală Festivă Întunecată'}`
                  : `Background: ${backgroundScene === 'sunny' ? 'Sunny Courtyard' : 'Dim Auditorium'}`}
              </span>
            </button>
          </div>
        </div>

        {/* Studio Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          {/* Style Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              {lang === 'ro' ? 'Format Grafic:' : 'Graphic Format:'}
            </span>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'lower_third', labelRo: 'Burtieră (Lower Third)', labelEn: 'Lower Third' },
                { id: 'title_card', labelRo: 'Ecran Titlu (Intro Card)', labelEn: 'Title Intro Card' },
                { id: 'credits', labelRo: 'Generic Final (Credits)', labelEn: 'Rolling Credits' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setTitleMode(m.id as TitleMode);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition text-left cursor-pointer border ${
                    titleMode === m.id
                      ? 'bg-rose-600 border-rose-400 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {lang === 'ro' ? m.labelRo : m.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Text Editor */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              {lang === 'ro' ? 'Conținut Text:' : 'Text Content:'}
            </span>
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  {lang === 'ro' ? 'Titlu Principal / Nume:' : 'Primary Title / Name:'}
                </label>
                <input
                  type="text"
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  {lang === 'ro' ? 'Subtitlu / Funcție:' : 'Subtitle / Designation:'}
                </label>
                <input
                  type="text"
                  value={subText}
                  onChange={(e) => setSubText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Legibility Adjustments */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              {lang === 'ro' ? 'Lizibilitate & Contrast:' : 'Legibility & Contrast:'}
            </span>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>{lang === 'ro' ? 'Opacitate Bandă Fond:' : 'Banner Scrim Opacity:'}</span>
                  <span className="text-rose-400 font-bold">{barOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={barOpacity}
                  onChange={(e) => setBarOpacity(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  {lang === 'ro' ? 'Contur Text (Text Outline):' : 'Text Outline / Shadow:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setHasOutline(!hasOutline);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    hasOutline
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {hasOutline
                    ? (lang === 'ro' ? 'Activat' : 'Enabled')
                    : (lang === 'ro' ? 'Dezactivat' : 'Disabled')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Canvas Output */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl aspect-video rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl relative flex flex-col justify-between">
            {/* Background scene simulation */}
            {backgroundScene === 'sunny' ? (
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 via-sky-100 to-amber-200 flex items-center justify-center p-6 text-slate-700 text-center font-bold">
                <div className="flex flex-col items-center gap-1 opacity-75">
                  <span className="text-5xl">☀️🏫</span>
                  <span className="text-xs font-mono text-slate-600">
                    {lang === 'ro'
                      ? 'Filmări Externe: Curtea Școlii (Lumină Puternică)'
                      : 'Exterior Footage: School Courtyard (High Key Light)'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 text-slate-400 text-center font-bold">
                <div className="flex flex-col items-center gap-1 opacity-75">
                  <span className="text-5xl">🎭💡</span>
                  <span className="text-xs font-mono text-slate-400">
                    {lang === 'ro'
                      ? 'Filmări Interne: Sala de Festivități (Lumină Scăzută)'
                      : 'Interior Footage: Auditorium Stage (Low Key Light)'}
                  </span>
                </div>
              </div>
            )}

            {/* Title / Graphic Render Layer */}
            <div className="relative z-10 w-full h-full flex flex-col justify-end p-5">
              {titleMode === 'lower_third' && (
                <div
                  style={{
                    backgroundColor: `rgba(15, 23, 42, ${barOpacity / 100})`,
                    textShadow: hasOutline ? '0px 2px 4px #000000, 0px 0px 2px #000000' : 'none'
                  }}
                  className="rounded-xl p-3 border-l-4 border-rose-500 shadow-2xl backdrop-blur-sm max-w-md animate-fade-in"
                >
                  <div className="text-base font-black tracking-tight text-white uppercase">
                    {mainText || (lang === 'ro' ? 'Nume Interlocutor' : 'Speaker Name')}
                  </div>
                  <div className="text-xs font-medium text-rose-300">
                    {subText || (lang === 'ro' ? 'Funcție / Rol' : 'Title / Role')}
                  </div>
                </div>
              )}

              {titleMode === 'title_card' && (
                <div
                  style={{
                    backgroundColor: `rgba(15, 23, 42, ${Math.max(barOpacity, 85) / 100})`,
                    textShadow: hasOutline ? '0px 2px 6px #000000' : 'none'
                  }}
                  className="m-auto text-center p-6 rounded-2xl border border-rose-500/50 shadow-2xl backdrop-blur-md max-w-md animate-fade-in"
                >
                  <div className="text-xl font-black text-white uppercase tracking-wider mb-1">
                    {mainText || (lang === 'ro' ? 'Titlu Documentar' : 'Documentary Title')}
                  </div>
                  <div className="text-xs text-rose-400 font-mono">
                    {subText || (lang === 'ro' ? 'Producție Școlară 2026' : 'School Production 2026')}
                  </div>
                </div>
              )}

              {titleMode === 'credits' && (
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    textShadow: hasOutline ? '0px 1px 3px #000' : 'none'
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in"
                >
                  <div className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-3">
                    {lang === 'ro' ? 'Distribuție & Regie' : 'Cast & Crew'}
                  </div>
                  <div className="text-xs text-white font-bold mb-1">{mainText}</div>
                  <div className="text-[11px] text-slate-300 mb-3">{subText}</div>
                  <div className="text-[10px] text-slate-400 font-mono border-t border-slate-700 pt-2">
                    {lang === 'ro'
                      ? 'Muzică sub Licență Creative Commons (CC-BY 4.0)'
                      : 'Music Licensed under Creative Commons (CC-BY 4.0)'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contrast Diagnostic Feedback */}
          <div className="mt-3 text-xs flex items-center gap-2">
            {contrastScore.status === 'good' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'ro' ? contrastScore.adviceRo : contrastScore.adviceEn}
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                {lang === 'ro' ? contrastScore.adviceRo : contrastScore.adviceEn}
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
              ? 'Verificare Pedagogică • Tipografie & Titrare Video (Manual pag. 44–45)'
              : 'Pedagogical Quiz • Video Typography & Titling (Textbook pp. 44–45)'}
          </span>
        </div>

        {/* Q1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '1. Ce este o „burtieră” (denumită internațional „Lower Third”) în montajul video de televiziune?'
              : '1. What is a "Lower Third" overlay in television and video editing?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'O eroare tehnică prin care imaginea este tăiată în trei bucăți egale.',
                textEn: 'A technical glitch splitting the screen into three disjoint pieces.'
              },
              {
                id: 'B',
                textRo: 'O reclamă comercială plasată pe tot centrul ecranului.',
                textEn: 'A commercial advertisement plastered across the center of the screen.'
              },
              {
                id: 'C',
                textRo: 'O bandă grafică în treimea inferioară a ecranului care afișează numele și funcția persoanei care vorbește.',
                textEn: 'A graphic strip placed in the lower third of the screen identifying the speaker and their title.'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q1Cooldown > 0 || q1Answer === 'C'}
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
          {q1Answer === 'C' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Lower Third informează rapid privitorul despre identitatea interlocutorului fără a-i ascunde chipul.'
                  : 'Correct! A Lower Third efficiently conveys speaker credentials without blocking facial expression.'}
              </span>
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '2. De ce se recomandă folosirea fonturilor clare fără serife (Sans-Serif, ex: Arial, Montserrat) și a benzilor de contrast?'
              : '2. Why are clean Sans-Serif fonts (e.g., Arial, Montserrat) and contrast scrims recommended in video?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Pentru că fonturile artistice caligrafice măresc viteza de randare a procesorului.',
                textEn: 'Because calligraphy fonts accelerate video rendering speed.'
              },
              {
                id: 'B',
                textRo: 'Pentru a asigura o lizibilitate perfectă pe orice ecran și pentru a împiedica pierderea textului pe fundaluri luminoase.',
                textEn: 'To guarantee instant legibility across all screen sizes and prevent words washing out on bright backgrounds.'
              },
              {
                id: 'C',
                textRo: 'Pentru că manualul interzice utilizarea oricăror culori în afară de negru.',
                textEn: 'Because guidelines strictly prohibit anything other than black text.'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0 || q2Answer === 'B'}
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
          {q2Answer === 'B' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Lizibilitatea este regula numărul 1 în televiziune: un text pe care spectatorul nu apucă să îl citească este inutil.'
                  : 'Correct! Readability is rule #1 in broadcasting: titles that cannot be quickly digested are ineffective.'}
              </span>
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          <div className="font-semibold text-sm text-white">
            {lang === 'ro'
              ? '3. Care este scurtătura de tastatură utilă în VideoPad pentru a crea rapid un panou de titlu text sau generic?'
              : '3. What is the useful keyboard shortcut in VideoPad to quickly add a text title or credits card?'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Combinația Ctrl + B',
                textEn: 'Ctrl + B shortcut'
              },
              {
                id: 'B',
                textRo: 'Combinația Alt + F4',
                textEn: 'Alt + F4 shortcut'
              },
              {
                id: 'C',
                textRo: 'Tasta Shift ținută apăsată 30 de secunde',
                textEn: 'Holding down Shift for 30 seconds'
              }
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
              <span>
                {q3ErrorMsg}{' '}
                {lang === 'ro'
                  ? `(Așteaptă ${q3Cooldown}s pentru a reîncerca)`
                  : `(Wait ${q3Cooldown}s to retry)`}
              </span>
            </div>
          )}
          {q3Answer === 'A' && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Corect! Ctrl + B deschide dialogul de adăugare și formatare a titlurilor text în VideoPad.'
                  : 'Correct! Ctrl + B summons the text titler dialog in VideoPad.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Completion Step Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {lang === 'ro'
              ? 'Răspunde corect la cele 3 întrebări pentru a debloca Studioul Practic de Regie (Nivelul 6).'
              : 'Answer all 3 questions correctly to unlock the Hands-on Director Studio (Level 6).'}
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
              ? 'Finalizează Nivelul 5 & Deschide Studioul Video'
              : 'Complete Level 5 & Launch Video Studio'}
          </span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
