import React, { useState, useEffect } from 'react';
import { Compass, Crosshair, Navigation, MapPin, Sparkles, CheckCircle2, AlertTriangle, Target, Globe, ShieldCheck } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface G1Level4Props {
  onPass: (score: number) => void;
}

interface LandmarkTarget {
  id: string;
  name: string;
  targetLat: number; // Decimal degrees
  targetLng: number;
  dmsDisplay: string;
  category: string;
  hint: string;
  description: string;
}

const LANDMARKS: LandmarkTarget[] = [
  {
    id: 'moldoveanu',
    name: 'Vârful Moldoveanu (Munții Făgăraș)',
    targetLat: 45.60,
    targetLng: 24.74,
    dmsDisplay: '45°35′58″ N, 24°44′10″ E',
    category: 'Relief Alpin • 2.544 m',
    hint: 'Latitudine în jur de 45.6°N, Longitudine în jur de 24.7°E',
    description: 'Punctul de maximă altitudine al României, situat pe creasta Masivului Făgăraș.'
  },
  {
    id: 'bucuresti',
    name: 'Palatul Parlamentului (București)',
    targetLat: 44.43,
    targetLng: 26.09,
    dmsDisplay: '44°25′39″ N, 26°05′15″ E',
    category: 'Capitală • Câmpia Română',
    hint: 'Latitudine în jur de 44.4°N, Longitudine în jur de 26.1°E',
    description: 'A doua cea mai mare clădire administrativă din lume, situată în inima capitalei României.'
  },
  {
    id: 'cazino',
    name: 'Cazinoul din Constanța (Marea Neagră)',
    targetLat: 44.17,
    targetLng: 28.66,
    dmsDisplay: '44°10′14″ N, 28°39′49″ E',
    category: 'Litoral Maritim • Dobrogea',
    hint: 'Latitudine în jur de 44.2°N, Longitudine estică de peste 28.6°E',
    description: 'Simbol Art Nouveau al țărmului românesc al Mării Negre și punct de reper maritim.'
  }
];

export const G1Level4_GPSCoordinates: React.FC<G1Level4Props> = ({ onPass }) => {
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
      setQ1ErrorMsg('Incorect! Latitudinea măsoară distanța unghiulară spre Nord sau Sud față de Ecuator (paralela de 0°). Valorile variază de la 0° la 90° la poli. România se află în emisfera nordică (între ~43°N și 48°N).');
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
      setQ2ErrorMsg('Incorect! Longitudinea măsoară distanța unghiulară spre Est sau Vest față de Meridianul Zero (Greenwich, Anglia). Valorile variază de la 0° la 180°. România se află în emisfera estică (între ~20°E și 29°E).');
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
      setQ3ErrorMsg('Incorect! Un receptor GPS de pe telefon sau din mașină are nevoie de semnal de la minimum 4 sateliți pentru a determina precis poziția 3D (latitudine, longitudine, altitudine) și ora exactă prin tehnica trilaterației.');
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
                  Nivelul 4 • Unitatea 3B (Manual pag. 57–63)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                  Sistemul de Coordonate Geografice (GPS)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                Latitudine, Longitudine & Localizare GPS în România
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>WGS84 / GPS Global</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          Orice punct de pe planeta Pământ are o adresă matematică unică exprimată prin două unghiuri: <strong className="text-teal-300">Latitudinea (Nord/Sud față de Ecuator)</strong> și <strong className="text-cyan-300">Longitudinea (Est/Vest față de Meridianul Greenwich)</strong>. România este situată convenabil în emisfera nord-estică (paralelele 43°–48°N și meridianele 20°–29°E).
        </p>
      </div>

      {/* Simulator: Interactive GPS Radar & Target Pinpoint Finder */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Radar GPS • Misiunea de Calibrare a Coordonatelor
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              Calibrează Receptorul GPS pentru a Bloca Țintele Geografice
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
                <span>Ținta {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Details Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <strong className="text-white text-sm font-sans">{activeTarget.name}</strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-850 text-cyan-300 border border-cyan-800">
                {activeTarget.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-sans">{activeTarget.description}</p>
            <div className="text-[11px] font-mono text-amber-300 mt-1">
              💡 Coordonate oficiale: <strong className="text-white">{activeTarget.dmsDisplay}</strong> ({activeTarget.hint})
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Eroare Estimată de Poziționare:</span>
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
              {approximateDistanceKm <= 15 ? '✓ Precizie acceptabilă (sub 15 km)' : 'Ajustează glisoarele pentru calibrare'}
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
                <Crosshair className="w-3.5 h-3.5" /> RADAR SATELITAR GPS
              </span>
              <span>Sensibilitate: ±0.01° (~1,1 km)</span>
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
                  <span>{activeTarget.name.split('(')[0]}</span>
                </div>
              </div>
            </div>

            {/* Footer with current GPS fix */}
            <div className="text-[11px] font-mono flex items-center justify-between border-t border-slate-900 pt-2 text-slate-400 relative z-10">
              <span>Coordonate curente antenă:</span>
              <strong className="text-teal-300">
                {currentLat.toFixed(2)}° N, {currentLng.toFixed(2)}° E
              </strong>
            </div>
          </div>

          {/* Right: GPS Calibration Sliders & Lock Button */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-white block mb-1">
                CALIBRARE MANUALĂ COORDONATE
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                Glisează pentru a alinia antena GPS cu ținta:
              </span>

              {/* Latitude Slider (Nord/Sud) */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">LATITUDINE (Paralele Nord):</span>
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
                  <span>43.50° N (Sud România)</span>
                  <span>48.50° N (Nord România)</span>
                </div>
              </div>

              {/* Longitude Slider (Est/Vest) */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">LONGITUDINE (Meridiane Est):</span>
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
                  <span>20.00° E (Vest Banat)</span>
                  <span>30.00° E (Est Marea Neagră)</span>
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
                    <span>ȚINTĂ BLOCATĂ CU SUCCES! ✓</span>
                  </>
                ) : isLockable ? (
                  <>
                    <Target className="w-4 h-4" />
                    <span>BLOCHEEAZĂ COORDONATELE GPS ACUM! 🎯</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4" />
                    <span>Apropie-te la sub 15 km de țintă...</span>
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
            Verificare Noțiuni • Latitudine, Longitudine & Sateliți GPS
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 5
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              1. Față de ce linie de referință a globului se măsoară <strong className="text-teal-300">Latitudinea</strong>?
            </div>
            {q1Answer === 'equator_ns' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Ecuatorul (0°): măsoară unghiul spre Nord (N) sau Sud (S) până la 90° la poli
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
              B. Meridianul Greenwich (0°): măsoară unghiul spre Est sau Vest
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
              C. Cercul Polar de Nord: măsoară doar viteza vântului polar
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
              D. Înălțimea antenei de telefonie mobilă 5G
            </button>
          </div>

          {q1ErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q1ErrorMsg}</span>
              {q1Cooldown > 0 && (
                <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">
                  Așteaptă {q1Cooldown}s...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              2. Față de ce reper se măsoară <strong className="text-cyan-300">Longitudinea</strong> și în ce emisferă se află România?
            </div>
            {q2Answer === 'greenwich_ew' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Față de Ecuator, iar România se află în emisfera vestică
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
              B. Față de Meridianul Zero (Greenwich): România se află în emisfera estică (longitudine între ~20°E și 29°E)
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
              C. Față de Polul Sud, iar România se află în emisfera australă
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
              D. Longitudinea este măsurată doar în litri și kilograme
            </button>
          </div>

          {q2ErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q2ErrorMsg}</span>
              {q2Cooldown > 0 && (
                <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">
                  Așteaptă {q2Cooldown}s...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              3. De câți sateliți GPS are nevoie un receptor (precum telefonul mobil) pentru a calcula precis <strong className="text-amber-300">poziția 3D (latitudine, longitudine, altitudine)</strong>?
            </div>
            {q3Answer === 'gps_trilateration' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. De un singur satelit oarecare, dacă este senin afară
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
              B. De minimum 4 sateliți pentru calculul prin trilaterație (X, Y, Z și corecția ceasului atomic)
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
              C. De cel puțin 1.000 de sateliți simultan
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
              D. GPS-ul nu folosește sateliți, ci cabluri subterane de fibră optică
            </button>
          </div>

          {q3ErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{q3ErrorMsg}</span>
              {q3Cooldown > 0 && (
                <span className="font-mono font-bold text-rose-400 shrink-0 ml-2">
                  Așteaptă {q3Cooldown}s...
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
                Toate răspunsurile sunt corecte! Poți trece la Nivelul 5.
              </span>
            ) : (
              <span>Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 5.</span>
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
            <span>Continuă spre Nivelul 5</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
