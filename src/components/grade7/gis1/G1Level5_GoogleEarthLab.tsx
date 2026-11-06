import React, { useState, useEffect } from 'react';
import { Globe, Compass, Ruler, Mountain, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface G1Level5Props {
  onPass: (score: number) => void;
}

interface EarthLocation {
  id: string;
  titleRo: string;
  titleEn: string;
  regionRo: string;
  regionEn: string;
  coords: string;
  altRo: string;
  altEn: string;
  tiltAngle: number;
  highlightRo: string;
  highlightEn: string;
  icon: string;
}

const LOCATIONS: EarthLocation[] = [
  {
    id: 'bicaz',
    titleRo: 'Cheile Bicazului & Lacul Roșu',
    titleEn: 'Bicaz Gorge & Red Lake',
    regionRo: 'Carpații Orientali (Munții Hășmaș)',
    regionEn: 'Eastern Carpathians (Hășmaș Mountains)',
    coords: '46°48′43″ N, 25°49′08″ E',
    altRo: 'Altitudine pereți: 980 m – 1.150 m',
    altEn: 'Cliff elevation: 980 m – 1,150 m',
    tiltAngle: 60,
    highlightRo: 'Defileu stâncos spectaculos sculptat în calcare mezozoice, cu pereți verticali de peste 300 m.',
    highlightEn: 'Spectacular rock canyon carved through Mesozoic limestone, featuring sheer vertical cliffs exceeding 300 m.',
    icon: '⛰️'
  },
  {
    id: 'bran',
    titleRo: 'Castelul Bran & Pasul Rucăr-Bran',
    titleEn: 'Bran Castle & Rucăr-Bran Pass',
    regionRo: 'Județul Brașov / Argeș',
    regionEn: 'Brașov / Argeș Counties',
    coords: '45°30′54″ N, 25°22′02″ E',
    altRo: 'Altitudine cetate: 760 m',
    altEn: 'Fortress elevation: 760 m',
    tiltAngle: 45,
    highlightRo: 'Cetate medievală strategică ridicată pe o stâncă abruptă pentru apărarea văii comerciale.',
    highlightEn: 'Strategic medieval fortress erected upon a cliff face guarding the historic commercial mountain pass.',
    icon: '🏰'
  },
  {
    id: 'cazane',
    titleRo: 'Cazanele Dunării (Defileul Dunării)',
    titleEn: 'Danube Gorges (Iron Gates)',
    regionRo: 'Parcul Natural Porțile de Fier (Mehedinți)',
    regionEn: 'Iron Gates Natural Park (Mehedinți)',
    coords: '44°36′12″ N, 22°15′35″ E',
    altRo: 'Lățime minimă fluviu: 150 m • Adâncime: până la 75 m',
    altEn: 'Narrowest width: 150 m • Depth: up to 75 m',
    tiltAngle: 55,
    highlightRo: 'Sectorul unde fluviul Dunărea străpunge Carpații între România și Serbia, străjuit de chipul lui Decebal.',
    highlightEn: 'The dramatic gorge where the Danube pierces through the Carpathians between Romania and Serbia, flanked by Decebalus’ rock sculpture.',
    icon: '🚢'
  },
  {
    id: 'delta',
    titleRo: 'Pădurea Letea & Dunele de Nisip',
    titleEn: 'Letea Forest & Sand Dunes',
    regionRo: 'Delta Dunării (Grindul Letea)',
    regionEn: 'Danube Delta (Letea Ridge)',
    coords: '45°19′20″ N, 29°31′24″ E',
    altRo: 'Altitudine medie: 2 m – 12 m',
    altEn: 'Average elevation: 2 m – 12 m',
    tiltAngle: 20,
    highlightRo: 'Cea mai nordică pădure subtropicală a Europei, cu liane grecești și cai sălbăticiți pe dune marine.',
    highlightEn: 'Europe’s northernmost subtropical forest, hosting Greek lianas and feral horses roaming over maritime dunes.',
    icon: '🌴'
  }
];

export const G1Level5_GoogleEarthLab: React.FC<G1Level5Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Simulator State
  const [selectedLocIndex, setSelectedLocIndex] = useState<number>(0);
  const [tiltDegrees, setTiltDegrees] = useState<number>(45); // 0 (2D nadir) to 70 (3D oblique)
  const [compassHeading, setCompassHeading] = useState<number>(35); // rotation in degrees
  const [rulerActive, setRulerActive] = useState<boolean>(false);
  const [measuredDistanceKm, setMeasuredDistanceKm] = useState<number>(140); // default line

  // Quiz state with 5s cooldown
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q1ErrorMsg, setQ1ErrorMsg] = useState<string>('');

  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q2ErrorMsg, setQ2ErrorMsg] = useState<string>('');

  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);
  const [q3ErrorMsg, setQ3ErrorMsg] = useState<string>('');

  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ2Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ3Cooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeLoc = LOCATIONS[selectedLocIndex];

  // Reset compass to true north (key R in Google Earth)
  const handleResetNorth = () => {
    sounds.playClick();
    setCompassHeading(0);
  };

  const handleToggleRuler = () => {
    sounds.playClick();
    setRulerActive(!rulerActive);
  };

  // Q1 Check: What shortcut resets camera north in Google Earth?
  const handleAnswerQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    if (val === 'key_r') {
      sounds.playCorrect();
      setQ1Answer(val);
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(val);
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Tasta R (Reset) în Google Earth resetează instantaneu unghiul de vizualizare: orientarea busolei este aliniată direct spre Nord (0°) și camera este adusă la o privire zenitală perpendiculară.'
          : 'Incorrect! The R key (Reset) in Google Earth instantly resets camera orientation: compass heading snaps directly to North (0°) and camera aligns to an overhead perpendicular nadir view.'
      );
    }
  };

  // Q2 Check: How does 3D Tilt work?
  const handleAnswerQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    if (val === 'tilt_perspective') {
      sounds.playCorrect();
      setQ2Answer(val);
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(val);
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Înclinarea camerei (Tilt) schimbă perspectiva de la o vedere de sus (2D plană) la o perspectivă oblică tridimensională 3D, evidențiind altitudinea versanților montani, adâncimea defileelor și clădirile 3D.'
          : 'Incorrect! Camera Tilt switches the perspective from a flat 2D top-down view to a 3D oblique angle, revealing mountain ridges, canyon depths, and 3D architectural volumes.'
      );
    }
  };

  // Q3 Check: Digital Ruler capabilities
  const handleAnswerQ3 = (val: string) => {
    if (q3Cooldown > 0) return;
    if (val === 'ruler_line_area') {
      sounds.playCorrect();
      setQ3Answer(val);
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(val);
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Instrumentul Riglă digitală (Measure Tool) permite măsurarea distanțelor în linie dreaptă (metri/km), a traseelor poligonale și calcularea suprafețelor (hectare sau km²) direct pe glob.'
          : 'Incorrect! The Measure Ruler Tool measures straight-line distances (m/km), polygonal paths, and computes enclosed surface areas (hectares or sq km) directly across the globe.'
      );
    }
  };

  const allAnsweredCorrectly = q1Answer === 'key_r' && q2Answer === 'tilt_perspective' && q3Answer === 'ruler_line_area';

  const handleFinish = () => {
    if (allAnsweredCorrectly) {
      sounds.playSuccess();
      setIsPassed(true);
      onPass(100);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-sky-950/80 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg text-2xl">
              🌍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold uppercase">
                  {lang === 'ro' ? 'Nivelul 5 • Unitatea 3B (Manual pag. 57–63)' : 'Level 5 • Unit 3B (Textbook pp. 57–63)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono">
                  {lang === 'ro' ? 'Google Earth & Imagini Satelitare 3D' : 'Google Earth & 3D Satellite Imagery'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {lang === 'ro'
                  ? 'Explorarea Satelitară 3D: Înclinare Tilt, Busolă & Riglă Digitală'
                  : '3D Satellite Exploration: Camera Tilt, Compass & Digital Ruler'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-sky-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>{lang === 'ro' ? 'Glob Virtual 3D' : 'Virtual 3D Globe'}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          {lang === 'ro' ? (
            <>
              <strong className="text-sky-300">Google Earth</strong> reprezintă vârful de lance al explorării cartografice pentru publicul larg: un glob terestru 3D complet interactiv, compus din petabytes de <strong className="text-teal-300">imagini satelitare de înaltă rezoluție</strong> și modele digitale de teren. Aici putem măsura distanțe precise, înclina camera pentru a zbura printre munți și naviga cu busola.
            </>
          ) : (
            <>
              <strong className="text-sky-300">Google Earth</strong> represents cutting-edge geographic visualization for global users: a fully interactive 3D terrestrial globe composed of petabytes of <strong className="text-teal-300">high-resolution satellite imagery</strong> and elevation models. We can measure distances, tilt into mountain valleys, and align with true north.
            </>
          )}
        </p>
      </div>

      {/* Simulator: Google Earth Virtual Studio */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              {lang === 'ro' ? 'Simulator de Navigație Satelitară • România din Spațiu' : 'Satellite Navigation Simulator • Romania from Orbit'}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              {lang === 'ro'
                ? 'Consola de Comandă a Globului Virtual (Google Earth Studio)'
                : 'Virtual Globe Command Console (Google Earth Studio)'}
            </h2>
          </div>

          {/* Quick Location Bookmarks */}
          <div className="flex flex-wrap items-center gap-1.5">
            {LOCATIONS.map((loc, idx) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelectedLocIndex(idx);
                  setTiltDegrees(loc.tiltAngle);
                  sounds.playClick();
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1 ${
                  selectedLocIndex === idx
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <span>{loc.icon}</span>
                <span className="hidden sm:inline">
                  {(lang === 'ro' ? loc.titleRo : loc.titleEn).split('&')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Satellite Viewport & Simulation Controls */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main 3D Satellite Viewport */}
          <div className="lg:col-span-8 bg-slate-950 border-2 border-sky-500/30 rounded-2xl p-4 relative min-h-[340px] flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Viewport Header Controls (Compass, Ruler toggle, Reset North) */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                {/* Compass Widget */}
                <div
                  className="w-9 h-9 rounded-full bg-slate-900 border border-sky-500/40 flex items-center justify-center text-xs font-mono font-bold shadow-md cursor-pointer group"
                  onClick={handleResetNorth}
                  title={lang === 'ro' ? 'Clic pentru Resetare Nord (Tasta R)' : 'Click to reset North (Key R)'}
                >
                  <Compass
                    className="w-5 h-5 text-rose-400 transition-transform"
                    style={{ transform: `rotate(${-compassHeading}deg)` }}
                  />
                </div>

                <button
                  onClick={handleResetNorth}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-400 text-[11px] font-mono text-sky-300 transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'ro' ? 'Reset Nord (Tasta R)' : 'Reset North (Key R)'}</span>
                </button>
              </div>

              {/* Digital Ruler Toggle */}
              <button
                onClick={handleToggleRuler}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                  rulerActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>
                  {rulerActive
                    ? (lang === 'ro' ? 'Rigla Activată (140 km)' : 'Ruler Active (140 km)')
                    : (lang === 'ro' ? 'Activează Rigla' : 'Activate Ruler')}
                </span>
              </button>
            </div>

            {/* Simulated 3D Satellite Canvas Visual */}
            <div
              className="my-4 p-6 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-slate-900/90 via-slate-900 to-sky-950/60 relative overflow-hidden transition-all duration-500 flex flex-col justify-center items-center text-center"
              style={{
                transform: `perspective(600px) rotateX(${tiltDegrees * 0.4}deg) rotateZ(${compassHeading * 0.2}deg)`,
                boxShadow: tiltDegrees > 30 ? '0 20px 40px -15px rgba(6, 182, 212, 0.25)' : 'none'
              }}
            >
              <div className="text-4xl mb-2">{activeLoc.icon}</div>
              <h3 className="text-lg font-black text-white font-heading">
                {lang === 'ro' ? activeLoc.titleRo : activeLoc.titleEn}
              </h3>
              <div className="text-xs text-sky-300 font-mono mt-0.5">
                {lang === 'ro' ? activeLoc.regionRo : activeLoc.regionEn}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">{activeLoc.coords}</div>
              <div className="text-xs text-emerald-300 font-bold font-mono mt-2">
                {lang === 'ro' ? activeLoc.altRo : activeLoc.altEn}
              </div>

              {/* Digital Ruler Line Overlay if active */}
              {rulerActive && (
                <div className="mt-4 p-2.5 rounded-xl bg-amber-950/80 border border-amber-500 text-amber-200 text-xs font-mono flex items-center gap-2 animate-pulse">
                  <Ruler className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {lang === 'ro'
                      ? `Segment măsurat în linie dreaptă: ${measuredDistanceKm} km (~78 min cu autoturismul)`
                      : `Measured straight-line distance: ${measuredDistanceKm} km (~78 min by car)`}
                  </span>
                </div>
              )}
            </div>

            {/* Viewport Footer Telemetry */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-900 pt-2 text-[10px] font-mono text-slate-400 relative z-10">
              <span>{lang === 'ro' ? `Orientare busolă: ${compassHeading}° (N = 0°)` : `Heading: ${compassHeading}° (N = 0°)`}</span>
              <span>
                {lang === 'ro'
                  ? `Unghi înclinare Tilt: ${tiltDegrees}° (${tiltDegrees === 0 ? '2D Nadir' : '3D Oblic'})`
                  : `Tilt Angle: ${tiltDegrees}° (${tiltDegrees === 0 ? '2D Nadir' : '3D Oblique'})`}
              </span>
              <span className="text-sky-300">{lang === 'ro' ? 'Sursă satelit: Sentinel-2 / Landsat' : 'Satellite source: Sentinel-2 / Landsat'}</span>
            </div>
          </div>

          {/* Right: Camera Tilt & Compass Adjusters */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-white block mb-1">
                {lang === 'ro' ? 'CONTROALE CAMERĂ 3D & PERSPECTIVĂ' : '3D CAMERA & PERSPECTIVE CONTROLS'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {lang === 'ro' ? 'Simulează gesturile cu mouse-ul din Google Earth:' : 'Simulate mouse navigation in Google Earth:'}
              </span>

              {/* Tilt Slider */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-sky-400" />
                    {lang === 'ro' ? 'ÎNCLINARE 3D (TILT):' : '3D TILT ANGLE:'}
                  </span>
                  <strong className="text-sky-300 text-sm">{tiltDegrees}°</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="65"
                  step="5"
                  value={tiltDegrees}
                  onChange={(e) => setTiltDegrees(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{lang === 'ro' ? '0° (2D Vedere de sus)' : '0° (2D Nadir Top-down)'}</span>
                  <span>{lang === 'ro' ? '65° (Perspectivă 3D relieflată)' : '65° (3D Relief Perspective)'}</span>
                </div>
              </div>

              {/* Compass Heading Slider */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-rose-400" />
                    {lang === 'ro' ? 'ROTIRE CAMERĂ (HEADING):' : 'CAMERA HEADING ROTATION:'}
                  </span>
                  <strong className="text-rose-300 text-sm">{compassHeading}°</strong>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="5"
                  value={compassHeading}
                  onChange={(e) => setCompassHeading(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>-90° ({lang === 'ro' ? 'Vest' : 'West'})</span>
                  <span>0° ({lang === 'ro' ? 'Nord' : 'North'})</span>
                  <span>+90° ({lang === 'ro' ? 'Est' : 'East'})</span>
                </div>
              </div>
            </div>

            {/* Geographical Fact Card */}
            <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-slate-300 text-xs">
              <strong className="text-sky-300 block text-[11px] font-mono mb-1">
                {lang === 'ro' ? 'Fascinația Geografică a Locului:' : 'Geographical Highlight:'}
              </strong>
              <p className="text-[11px] leading-relaxed font-sans">
                {lang === 'ro' ? activeLoc.highlightRo : activeLoc.highlightEn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quiz Questions with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            {lang === 'ro' ? 'Verificare Cunoștințe • Google Earth & Explorare 3D' : 'Knowledge Check • Google Earth & 3D Exploration'}
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            {lang === 'ro'
              ? 'Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 6'
              : 'Answer all 3 questions correctly to unlock Level 6'}
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>1. Ce comandă rapidă de la tastatură resetează instantaneu camera către <strong className="text-sky-300">Nordul geografic (0°)</strong> în Google Earth?</>
              ) : (
                <>1. What keyboard shortcut instantly resets the camera toward <strong className="text-sky-300">true North (0°)</strong> in Google Earth?</>
              )}
            </div>
            {q1Answer === 'key_r' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ1('key_wrong1')}
              disabled={q1Cooldown > 0 || q1Answer === 'key_r'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'key_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. Combinația Ctrl + Alt + Delete' : 'A. The Ctrl + Alt + Delete shortcut'}
            </button>

            <button
              onClick={() => handleAnswerQ1('key_r')}
              disabled={q1Cooldown > 0 || q1Answer === 'key_r'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'key_r'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Tasta R (Reset): orientează busola exact spre Nord și aduce camera la o vedere zenitală de sus'
                : 'B. The R key (Reset): aligns compass to true North and sets camera to top-down nadir view'}
            </button>

            <button
              onClick={() => handleAnswerQ1('key_wrong2')}
              disabled={q1Cooldown > 0 || q1Answer === 'key_r'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'key_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. Tasta Spațiu, care oprește satelitul pe orbită' : 'C. Spacebar, which stops the satellite in orbit'}
            </button>

            <button
              onClick={() => handleAnswerQ1('key_wrong3')}
              disabled={q1Cooldown > 0 || q1Answer === 'key_r'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'key_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'D. În Google Earth nu există nicio metodă de orientare către Nord'
                : 'D. There is no compass reset function in Google Earth'}
            </button>
          </div>

          {q1ErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q1ErrorMsg}</span>
              {q1Cooldown > 0 && (
                <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">
                  {lang === 'ro' ? `Așteaptă ${q1Cooldown}s...` : `Wait ${q1Cooldown}s...`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>2. Ce efect vizual produce funcția de <strong className="text-teal-300">Înclinare (Tilt / perspectivă 3D)</strong> a camerei în Google Earth?</>
              ) : (
                <>2. What visual effect is produced by the <strong className="text-teal-300">Tilt (3D perspective)</strong> camera action in Google Earth?</>
              )}
            </div>
            {q2Answer === 'tilt_perspective' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ2('tilt_wrong1')}
              disabled={q2Cooldown > 0 || q2Answer === 'tilt_perspective'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'tilt_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. Șterge automat toate râurile și drumurile de pe hartă' : 'A. Automatically deletes all rivers and roads from view'}
            </button>

            <button
              onClick={() => handleAnswerQ2('tilt_perspective')}
              disabled={q2Cooldown > 0 || q2Answer === 'tilt_perspective'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'tilt_perspective'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Comută de la o vedere plană 2D la o perspectivă oblică tridimensională 3D ce scoate în relief munții, cheile și clădirile'
                : 'B. Transitions from flat 2D top-down view to an oblique 3D relief perspective highlighting mountains, valleys, and buildings'}
            </button>

            <button
              onClick={() => handleAnswerQ2('tilt_wrong2')}
              disabled={q2Cooldown > 0 || q2Answer === 'tilt_perspective'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'tilt_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. Inversează culorile satelitului în alb-negru' : 'C. Inverts satellite palette into monochrome'}
            </button>

            <button
              onClick={() => handleAnswerQ2('tilt_wrong3')}
              disabled={q2Cooldown > 0 || q2Answer === 'tilt_perspective'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'tilt_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Înclinarea funcționează doar dacă deschizi fișiere Word' : 'D. Tilt only works when Word documents are loaded'}
            </button>
          </div>

          {q2ErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q2ErrorMsg}</span>
              {q2Cooldown > 0 && (
                <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">
                  {lang === 'ro' ? `Așteaptă ${q2Cooldown}s...` : `Wait ${q2Cooldown}s...`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>3. Ce măsurători concrete putem realiza cu ajutorul <strong className="text-amber-300">Riglăi Digitale (Measure Tool)</strong> din Google Earth?</>
              ) : (
                <>3. What measurements can be performed using the <strong className="text-amber-300">Digital Ruler (Measure Tool)</strong> in Google Earth?</>
              )}
            </div>
            {q3Answer === 'ruler_line_area' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ3('ruler_wrong1')}
              disabled={q3Cooldown > 0 || q3Answer === 'ruler_line_area'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'ruler_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. Doar numărul de litere dintr-un paragraf de text' : 'A. Only character count in a text paragraph'}
            </button>

            <button
              onClick={() => handleAnswerQ3('ruler_wrong2')}
              disabled={q3Cooldown > 0 || q3Answer === 'ruler_line_area'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'ruler_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'B. Temperatura apei din oceane în timp real' : 'B. Real-time sea surface temperature'}
            </button>

            <button
              onClick={() => handleAnswerQ3('ruler_line_area')}
              disabled={q3Cooldown > 0 || q3Answer === 'ruler_line_area'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'ruler_line_area'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. Distanțe în linie dreaptă (metri/km), lungimea unor trasee curbe și calculul suprafețelor unor perimetre închise (hectare/km²)'
                : 'C. Straight-line distances (m/km), polyline path lengths, and perimeter/surface area calculation of closed shapes (hectares/sq km)'}
            </button>

            <button
              onClick={() => handleAnswerQ3('ruler_wrong3')}
              disabled={q3Cooldown > 0 || q3Answer === 'ruler_line_area'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'ruler_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Greutatea fizică a sateliților meteorologici' : 'D. Physical weight of meteorological satellites'}
            </button>
          </div>

          {q3ErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q3ErrorMsg}</span>
              {q3Cooldown > 0 && (
                <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">
                  {lang === 'ro' ? `Așteaptă ${q3Cooldown}s...` : `Wait ${q3Cooldown}s...`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pass Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            {allAnsweredCorrectly ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'ro'
                  ? 'Toate răspunsurile sunt corecte! Poți trece la Nivelul 6.'
                  : 'All answers are correct! You can advance to Level 6.'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 6.'
                  : 'Answer all 3 questions correctly to unlock Level 6.'}
              </span>
            )}
          </div>

          <button
            onClick={handleFinish}
            disabled={!allAnsweredCorrectly}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-lg ${
              allAnsweredCorrectly
                ? 'bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-black shadow-teal-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{lang === 'ro' ? 'Continuă spre Nivelul 6' : 'Continue to Level 6'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
