import React, { useState, useEffect } from 'react';
import { Crosshair, MapPin, Sparkles, CheckCircle2, Target, Globe } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface G1Level4Props {
  onPass: (score: number) => void;
}

interface LandmarkTarget {
  id: string;
  nameRo: string;
  nameEn: string;
  targetLat: number; // Decimal degrees
  targetLng: number;
  dmsDisplay: string;
  categoryRo: string;
  categoryEn: string;
  hintRo: string;
  hintEn: string;
  descriptionRo: string;
  descriptionEn: string;
}

const LANDMARKS: LandmarkTarget[] = [
  {
    id: 'moldoveanu',
    nameRo: 'Vârful Moldoveanu (Munții Făgăraș)',
    nameEn: 'Moldoveanu Peak (Făgăraș Mountains)',
    targetLat: 45.60,
    targetLng: 24.74,
    dmsDisplay: '45°35′58″ N, 24°44′10″ E',
    categoryRo: 'Relief Alpin • 2.544 m',
    categoryEn: 'Alpine Relief • 2,544 m',
    hintRo: 'Latitudine în jur de 45.6°N, Longitudine în jur de 24.7°E',
    hintEn: 'Latitude around 45.6°N, Longitude around 24.7°E',
    descriptionRo: 'Punctul de maximă altitudine al României, situat pe creasta Masivului Făgăraș.',
    descriptionEn: 'The highest elevation point in Romania, situated on the ridge of the Făgăraș Massif.'
  },
  {
    id: 'bucuresti',
    nameRo: 'Palatul Parlamentului (București)',
    nameEn: 'Palace of the Parliament (Bucharest)',
    targetLat: 44.43,
    targetLng: 26.09,
    dmsDisplay: '44°25′39″ N, 26°05′15″ E',
    categoryRo: 'Capitală • Câmpia Română',
    categoryEn: 'Capital • Romanian Plain',
    hintRo: 'Latitudine în jur de 44.4°N, Longitudine în jur de 26.1°E',
    hintEn: 'Latitude around 44.4°N, Longitude around 26.1°E',
    descriptionRo: 'A doua cea mai mare clădire administrativă din lume, situată în inima capitalei României.',
    descriptionEn: 'The second largest administrative building in the world, situated in the heart of Romania’s capital.'
  },
  {
    id: 'cazino',
    nameRo: 'Cazinoul din Constanța (Marea Neagră)',
    nameEn: 'Constanța Casino (Black Sea)',
    targetLat: 44.17,
    targetLng: 28.66,
    dmsDisplay: '44°10′14″ N, 28°39′49″ E',
    categoryRo: 'Litoral Maritim • Dobrogea',
    categoryEn: 'Maritime Coast • Dobrogea',
    hintRo: 'Latitudine în jur de 44.2°N, Longitudine estică de peste 28.6°E',
    hintEn: 'Latitude around 44.2°N, Eastern longitude over 28.6°E',
    descriptionRo: 'Simbol Art Nouveau al țărmului românesc al Mării Negre și punct de reper maritim.',
    descriptionEn: 'Art Nouveau landmark on Romania’s Black Sea coast and iconic maritime beacon.'
  }
];

export const G1Level4_GPSCoordinates: React.FC<G1Level4Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Simulator State: Coordinates Input Sliders
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(0);
  const [currentLat, setCurrentLat] = useState<number>(45.00);
  const [currentLng, setCurrentLng] = useState<number>(25.00);
  const [lockedTargets, setLockedTargets] = useState<Record<string, boolean>>({});

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

  const activeTarget = LANDMARKS[selectedTargetIndex];

  // Calculate approximate distance delta in km (1 degree lat ~= 111 km, 1 degree lng at 45° ~= 78 km)
  const latDelta = Math.abs(currentLat - activeTarget.targetLat) * 111;
  const lngDelta = Math.abs(currentLng - activeTarget.targetLng) * 78;
  const approximateDistanceKm = Math.round(Math.sqrt(latDelta * latDelta + lngDelta * lngDelta));

  const isLockable = approximateDistanceKm <= 15;
  const isTargetLocked = !!lockedTargets[activeTarget.id];

  const handleLockTarget = () => {
    if (isLockable) {
      sounds.playSuccess();
      setLockedTargets((prev) => ({ ...prev, [activeTarget.id]: true }));
    } else {
      sounds.playWrong();
    }
  };

  const handleSelectTarget = (index: number) => {
    sounds.playClick();
    setSelectedTargetIndex(index);
  };

  // Q1 Check: Latitude reference
  const handleAnswerQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    if (val === 'equator_ns') {
      sounds.playCorrect();
      setQ1Answer(val);
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(val);
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Latitudinea măsoară distanța unghiulară spre Nord sau Sud față de Ecuator (paralela de 0°). Valorile variază de la 0° la 90° la poli. România se află în emisfera nordică (între ~43°N și 48°N).'
          : 'Incorrect! Latitude measures angular distance North or South from the Equator (0° parallel) up to 90° at the poles. Romania lies in the Northern hemisphere (between ~43°N and 48°N).'
      );
    }
  };

  // Q2 Check: Longitude reference
  const handleAnswerQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    if (val === 'greenwich_ew') {
      sounds.playCorrect();
      setQ2Answer(val);
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(val);
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Longitudinea măsoară distanța unghiulară spre Est sau Vest față de Meridianul Zero (Greenwich, Anglia). Valorile variază de la 0° la 180°. România se află în emisfera estică (între ~20°E și 29°E).'
          : 'Incorrect! Longitude measures angular distance East or West from the Prime Meridian (Greenwich, UK). Values range from 0° to 180°. Romania lies in the Eastern hemisphere (between ~20°E and 29°E).'
      );
    }
  };

  // Q3 Check: GPS Satellites Trilateration
  const handleAnswerQ3 = (val: string) => {
    if (q3Cooldown > 0) return;
    if (val === 'gps_trilateration') {
      sounds.playCorrect();
      setQ3Answer(val);
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(val);
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Un receptor GPS de pe telefon sau din mașină are nevoie de semnal de la minimum 4 sateliți pentru a determina precis poziția 3D (latitudine, longitudine, altitudine) și ora exactă prin tehnica trilaterației.'
          : 'Incorrect! A GPS receiver on a phone or car requires signals from at least 4 satellites to solve for 3D coordinates (latitude, longitude, altitude) plus clock bias through trilateration.'
      );
    }
  };

  const allAnsweredCorrectly = q1Answer === 'equator_ns' && q2Answer === 'greenwich_ew' && q3Answer === 'gps_trilateration';

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
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-cyan-950/80 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg text-2xl">
              🛰️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold uppercase">
                  {lang === 'ro' ? 'Nivelul 4 • Unitatea 3B (Manual pag. 57–63)' : 'Level 4 • Unit 3B (Textbook pp. 57–63)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                  {lang === 'ro' ? 'Sistemul de Coordonate Geografice (GPS)' : 'Geographic Coordinate System (GPS)'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {lang === 'ro'
                  ? 'Latitudine, Longitudine & Localizare GPS în România'
                  : 'Latitude, Longitude & GPS Positioning in Romania'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>WGS84 / GPS Global</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          {lang === 'ro' ? (
            <>
              Orice punct de pe planeta Pământ are o adresă matematică unică exprimată prin două unghiuri: <strong className="text-teal-300">Latitudinea (Nord/Sud față de Ecuator)</strong> și <strong className="text-cyan-300">Longitudinea (Est/Vest față de Meridianul Greenwich)</strong>. România este situată convenabil în emisfera nord-estică (paralelele 43°–48°N și meridianele 20°–29°E).
            </>
          ) : (
            <>
              Every location on Earth has a unique mathematical address defined by two angles: <strong className="text-teal-300">Latitude (North/South from the Equator)</strong> and <strong className="text-cyan-300">Longitude (East/West from Greenwich Prime Meridian)</strong>. Romania is situated in the north-eastern hemisphere (parallels 43°–48°N and meridians 20°–29°E).
            </>
          )}
        </p>
      </div>

      {/* Simulator: Interactive GPS Radar & Target Pinpoint Finder */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {lang === 'ro' ? 'Radar GPS • Misiunea de Calibrare a Coordonatelor' : 'GPS Radar • Coordinate Calibration Mission'}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              {lang === 'ro'
                ? 'Calibrează Receptorul GPS pentru a Bloca Țintele Geografice'
                : 'Calibrate the GPS Receiver to Lock Onto Geographic Targets'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {LANDMARKS.map((lm, idx) => (
              <button
                key={lm.id}
                onClick={() => handleSelectTarget(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                  selectedTargetIndex === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <span>{lockedTargets[lm.id] ? '🎯' : '📍'}</span>
                <span>{lang === 'ro' ? `Ținta ${idx + 1}` : `Target ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Details Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <strong className="text-white text-sm font-sans">
                {lang === 'ro' ? activeTarget.nameRo : activeTarget.nameEn}
              </strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-850 text-cyan-300 border border-cyan-800">
                {lang === 'ro' ? activeTarget.categoryRo : activeTarget.categoryEn}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              {lang === 'ro' ? activeTarget.descriptionRo : activeTarget.descriptionEn}
            </p>
            <div className="text-[11px] font-mono text-amber-300 mt-1">
              💡 {lang === 'ro' ? 'Coordonate oficiale:' : 'Official coordinates:'}{' '}
              <strong className="text-white">{activeTarget.dmsDisplay}</strong> (
              {lang === 'ro' ? activeTarget.hintRo : activeTarget.hintEn})
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {lang === 'ro' ? 'Eroare Estimată de Poziționare:' : 'Estimated Position Error:'}
            </span>
            <div
              className={`text-xl font-mono font-black ${
                approximateDistanceKm <= 15
                  ? 'text-emerald-400 animate-pulse'
                  : approximateDistanceKm <= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {approximateDistanceKm} km
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {approximateDistanceKm <= 15
                ? (lang === 'ro' ? '✓ Precizie acceptabilă (sub 15 km)' : '✓ Target lock ready (< 15 km)')
                : (lang === 'ro' ? 'Ajustează glisoarele pentru calibrare' : 'Adjust sliders to calibrate')}
            </span>
          </div>
        </div>

        {/* Grid & Crosshair Visual Matrix */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Map Coordinate Canvas with Visual Radar Crosshair */}
          <div className="lg:col-span-7 bg-slate-950 border-2 border-cyan-500/30 rounded-2xl p-4 relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Coordinate Grid Lines */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Header info on map */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
              <span className="text-cyan-400 flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" /> {lang === 'ro' ? 'RADAR SATELITAR GPS' : 'GPS SATELLITE RADAR'}
              </span>
              <span>{lang === 'ro' ? 'Sensibilitate: ±0.01° (~1,1 km)' : 'Resolution: ±0.01° (~1.1 km)'}</span>
            </div>

            {/* Radar Center with Crosshairs */}
            <div className="relative my-8 flex items-center justify-center">
              {/* Concentric radar rings */}
              <div className="w-48 h-48 rounded-full border border-cyan-500/20 flex items-center justify-center relative">
                <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-teal-500/40 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                </div>

                {/* Target Landmark Position relative to center */}
                <div
                  className="absolute p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-mono font-bold flex items-center gap-1 shadow-lg"
                  style={{
                    transform: `translate(${(activeTarget.targetLng - currentLng) * 45}px, ${(currentLat - activeTarget.targetLat) * 45}px)`
                  }}
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>
                    {(lang === 'ro' ? activeTarget.nameRo : activeTarget.nameEn).split('(')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with current GPS fix */}
            <div className="text-[11px] font-mono flex items-center justify-between border-t border-slate-900 pt-2 text-slate-400 relative z-10">
              <span>{lang === 'ro' ? 'Coordonate curente antenă:' : 'Current antenna coordinates:'}</span>
              <strong className="text-teal-300">
                {currentLat.toFixed(2)}° N, {currentLng.toFixed(2)}° E
              </strong>
            </div>
          </div>

          {/* Right: GPS Calibration Sliders & Lock Button */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-white block mb-1">
                {lang === 'ro' ? 'CALIBRARE MANUALĂ COORDONATE' : 'MANUAL COORDINATE CALIBRATION'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {lang === 'ro' ? 'Glisează pentru a alinia antena GPS cu ținta:' : 'Slide to align GPS antenna with target:'}
              </span>

              {/* Latitude Slider (Nord/Sud) */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">
                    {lang === 'ro' ? 'LATITUDINE (Paralele Nord):' : 'LATITUDE (North Parallels):'}
                  </span>
                  <strong className="text-cyan-300 text-sm">{currentLat.toFixed(2)}° N</strong>
                </div>
                <input
                  type="range"
                  min="43.50"
                  max="48.50"
                  step="0.05"
                  value={currentLat}
                  onChange={(e) => setCurrentLat(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{lang === 'ro' ? '43.50° N (Sud România)' : '43.50° N (South Romania)'}</span>
                  <span>{lang === 'ro' ? '48.50° N (Nord România)' : '48.50° N (North Romania)'}</span>
                </div>
              </div>

              {/* Longitude Slider (Est/Vest) */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">
                    {lang === 'ro' ? 'LONGITUDINE (Meridiane Est):' : 'LONGITUDE (East Meridians):'}
                  </span>
                  <strong className="text-teal-300 text-sm">{currentLng.toFixed(2)}° E</strong>
                </div>
                <input
                  type="range"
                  min="20.00"
                  max="30.00"
                  step="0.05"
                  value={currentLng}
                  onChange={(e) => setCurrentLng(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{lang === 'ro' ? '20.00° E (Vest Banat)' : '20.00° E (West Banat)'}</span>
                  <span>{lang === 'ro' ? '30.00° E (Est Marea Neagră)' : '30.00° E (East Black Sea)'}</span>
                </div>
              </div>
            </div>

            {/* Lock GPS Button */}
            <div>
              <button
                onClick={handleLockTarget}
                disabled={!isLockable}
                className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  isTargetLocked
                    ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                    : isLockable
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black animate-bounce shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                }`}
              >
                {isTargetLocked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ro' ? 'ȚINTĂ BLOCATĂ CU SUCCES! ✓' : 'TARGET LOCKED SUCCESSFULLY! ✓'}</span>
                  </>
                ) : isLockable ? (
                  <>
                    <Target className="w-4 h-4" />
                    <span>{lang === 'ro' ? 'BLOCHEEAZĂ COORDONATELE GPS ACUM! 🎯' : 'LOCK GPS COORDINATES NOW! 🎯'}</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4" />
                    <span>
                      {lang === 'ro' ? 'Apropie-te la sub 15 km de țintă...' : 'Approach within 15 km of target...'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quiz Questions with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            {lang === 'ro' ? 'Verificare Noțiuni • Latitudine, Longitudine & Sateliți GPS' : 'Concepts Check • Latitude, Longitude & GPS Satellites'}
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            {lang === 'ro'
              ? 'Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 5'
              : 'Answer all 3 questions correctly to unlock Level 5'}
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>1. Față de ce linie de referință a globului se măsoară <strong className="text-teal-300">Latitudinea</strong>?</>
              ) : (
                <>1. Relative to which global reference line is <strong className="text-teal-300">Latitude</strong> measured?</>
              )}
            </div>
            {q1Answer === 'equator_ns' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ1('equator_ns')}
              disabled={q1Cooldown > 0 || q1Answer === 'equator_ns'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'equator_ns'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Ecuatorul (0°): măsoară unghiul spre Nord (N) sau Sud (S) până la 90° la poli'
                : 'A. Equator (0°): measures angular distance North (N) or South (S) up to 90° at poles'}
            </button>

            <button
              onClick={() => handleAnswerQ1('lat_wrong1')}
              disabled={q1Cooldown > 0 || q1Answer === 'equator_ns'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'lat_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Meridianul Greenwich (0°): măsoară unghiul spre Est sau Vest'
                : 'B. Greenwich Meridian (0°): measures angle East or West'}
            </button>

            <button
              onClick={() => handleAnswerQ1('lat_wrong2')}
              disabled={q1Cooldown > 0 || q1Answer === 'equator_ns'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'lat_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. Cercul Polar de Nord: măsoară doar viteza vântului polar'
                : 'C. Arctic Circle: measures only polar wind velocity'}
            </button>

            <button
              onClick={() => handleAnswerQ1('lat_wrong3')}
              disabled={q1Cooldown > 0 || q1Answer === 'equator_ns'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'lat_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Înălțimea antenei de telefonie mobilă 5G' : 'D. Height of the 5G cellular tower'}
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
                <>2. Față de ce reper se măsoară <strong className="text-cyan-300">Longitudinea</strong> și în ce emisferă se află România?</>
              ) : (
                <>2. Relative to what benchmark is <strong className="text-cyan-300">Longitude</strong> measured, and in which hemisphere is Romania situated?</>
              )}
            </div>
            {q2Answer === 'greenwich_ew' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ2('long_wrong1')}
              disabled={q2Cooldown > 0 || q2Answer === 'greenwich_ew'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'long_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Față de Ecuator, iar România se află în emisfera vestică'
                : 'A. From the Equator, and Romania lies in the Western hemisphere'}
            </button>

            <button
              onClick={() => handleAnswerQ2('greenwich_ew')}
              disabled={q2Cooldown > 0 || q2Answer === 'greenwich_ew'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'greenwich_ew'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Față de Meridianul Zero (Greenwich): România se află în emisfera estică (longitudine între ~20°E și 29°E)'
                : 'B. From Prime Meridian (Greenwich): Romania lies in the Eastern hemisphere (longitude between ~20°E and 29°E)'}
            </button>

            <button
              onClick={() => handleAnswerQ2('long_wrong2')}
              disabled={q2Cooldown > 0 || q2Answer === 'greenwich_ew'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'long_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. Față de Polul Sud, iar România se află în emisfera australă'
                : 'C. From South Pole, and Romania lies in the austral hemisphere'}
            </button>

            <button
              onClick={() => handleAnswerQ2('long_wrong3')}
              disabled={q2Cooldown > 0 || q2Answer === 'greenwich_ew'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'long_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Longitudinea este măsurată doar în litri și kilograme' : 'D. Longitude is measured only in liters and kilograms'}
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
                <>3. De câți sateliți GPS are nevoie un receptor (precum telefonul mobil) pentru a calcula precis <strong className="text-amber-300">poziția 3D (latitudine, longitudine, altitudine)</strong>?</>
              ) : (
                <>3. How many GPS satellites must a receiver (such as a smartphone) track to resolve <strong className="text-amber-300">3D coordinates (latitude, longitude, altitude)</strong>?</>
              )}
            </div>
            {q3Answer === 'gps_trilateration' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ3('sat_wrong1')}
              disabled={q3Cooldown > 0 || q3Answer === 'gps_trilateration'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'sat_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. De un singur satelit oarecare, dacă este senin afară'
                : 'A. Just a single satellite if the sky is clear'}
            </button>

            <button
              onClick={() => handleAnswerQ3('gps_trilateration')}
              disabled={q3Cooldown > 0 || q3Answer === 'gps_trilateration'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'gps_trilateration'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. De minimum 4 sateliți pentru calculul prin trilaterație (X, Y, Z și corecția ceasului atomic)'
                : 'B. At least 4 satellites for trilateration solution (X, Y, Z and atomic clock error offset)'}
            </button>

            <button
              onClick={() => handleAnswerQ3('sat_wrong2')}
              disabled={q3Cooldown > 0 || q3Answer === 'gps_trilateration'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'sat_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. De cel puțin 1.000 de sateliți simultan' : 'C. At least 1,000 satellites simultaneously'}
            </button>

            <button
              onClick={() => handleAnswerQ3('sat_wrong3')}
              disabled={q3Cooldown > 0 || q3Answer === 'gps_trilateration'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'sat_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'D. GPS-ul nu folosește sateliți, ci cabluri subterane de fibră optică'
                : 'D. GPS uses underground fiber-optic cables instead of satellites'}
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
                  ? 'Toate răspunsurile sunt corecte! Poți trece la Nivelul 5.'
                  : 'All answers are correct! You can advance to Level 5.'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 5.'
                  : 'Answer all 3 questions correctly to unlock Level 5.'}
              </span>
            )}
          </div>

          <button
            onClick={handleFinish}
            disabled={!allAnsweredCorrectly}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-lg ${
              allAnsweredCorrectly
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-black shadow-teal-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{lang === 'ro' ? 'Continuă spre Nivelul 5' : 'Continue to Level 5'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
