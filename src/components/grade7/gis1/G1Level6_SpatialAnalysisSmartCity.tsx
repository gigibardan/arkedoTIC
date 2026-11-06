import React, { useState, useEffect } from 'react';
import { AlertTriangle, Siren, Route, CheckCircle2, Hospital, School, Waves, Compass, Activity } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface G1Level6Props {
  onPass: (score: number) => void;
}

export const G1Level6_SpatialAnalysisSmartCity: React.FC<G1Level6Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Scenario Mission Steps (1: Activate Flood Layer, 2: Query Vulnerable Buildings, 3: Route Ambulance, 4: Generate Action Plan)
  const [floodLayerActive, setFloodLayerActive] = useState<boolean>(false);
  const [queriedVulnerable, setQueriedVulnerable] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<'none' | 'flooded_route' | 'safe_bypass'>('none');
  const [alertBroadcastSent, setAlertBroadcastSent] = useState<boolean>(false);

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

  const handleToggleFlood = () => {
    sounds.playClick();
    setFloodLayerActive(!floodLayerActive);
  };

  const handleQueryVulnerable = () => {
    sounds.playClick();
    if (!floodLayerActive) {
      sounds.playWrong();
      return;
    }
    setQueriedVulnerable(true);
  };

  const handleSelectRoute = (route: 'flooded_route' | 'safe_bypass') => {
    sounds.playClick();
    setSelectedRoute(route);
  };

  const handleSendAlert = () => {
    if (floodLayerActive && queriedVulnerable && selectedRoute === 'safe_bypass') {
      sounds.playSuccess();
      setAlertBroadcastSent(true);
    } else {
      sounds.playWrong();
    }
  };

  // Q1 Check: What is spatial analysis in GIS?
  const handleAnswerQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    if (val === 'spatial_analysis_def') {
      sounds.playCorrect();
      setQ1Answer(val);
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(val);
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Analiza spațială în GIS rezolvă probleme reale prin intersectarea datelor din straturi diferite (ex: identificarea clădirilor din zona de revărsare a râului și calculul celui mai rapid traseu ocolitor neafectat).'
          : 'Incorrect! Spatial analysis in GIS solves real-world challenges by intersecting data across distinct layers (e.g. querying buildings within a flood risk polygon and routing emergency vehicles along unaffected bypass roads).'
      );
    }
  };

  // Q2 Check: Why is routing analysis critical for emergency services (112)?
  const handleAnswerQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    if (val === 'routing_ambulance') {
      sounds.playCorrect();
      setQ2Answer(val);
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(val);
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Analiza de rețea (Network Analysis / Routing) ține cont de starea drumurilor în timp real (blocaje, inundații, ambuteiaje) și ghidează ambulanțele și echipajele de pompieri pe cele mai rapide și sigure rute ocolitoare.'
          : 'Incorrect! Network / Routing Analysis factors real-time road conditions (flood closures, blockages, traffic) and guides ambulances and fire engines along the safest, fastest bypass routes.'
      );
    }
  };

  // Q3 Check: What is a Smart City in relation to GIS?
  const handleAnswerQ3 = (val: string) => {
    if (q3Cooldown > 0) return;
    if (val === 'smart_city_gis') {
      sounds.playCorrect();
      setQ3Answer(val);
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(val);
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Un Smart City folosește GIS-ul ca creier central pentru a monitoriza rețelele de apă și canalizare, transportul public, senzorii de poluare a aerului și intervențiile rapide în caz de dezastre.'
          : 'Incorrect! A Smart City utilizes GIS as a central nervous system to monitor water/sewage networks, public transit dispatch, air quality sensor telemetry, and emergency response operations.'
      );
    }
  };

  const allAnsweredCorrectly = q1Answer === 'spatial_analysis_def' && q2Answer === 'routing_ambulance' && q3Answer === 'smart_city_gis';
  const scenarioReady = floodLayerActive && queriedVulnerable && selectedRoute === 'safe_bypass' && alertBroadcastSent;

  const handleFinish = () => {
    if (allAnsweredCorrectly && scenarioReady) {
      sounds.playSuccess();
      setIsPassed(true);
      onPass(100);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-rose-950/80 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-600 flex items-center justify-center text-white shadow-lg text-2xl">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold uppercase">
                  {lang === 'ro' ? 'Nivelul 6 • Unitatea 3B (Manual pag. 57–63)' : 'Level 6 • Unit 3B (Textbook pp. 57–63)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                  {lang === 'ro' ? 'Analiză Spațială & Smart City' : 'Spatial Analysis & Smart City'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {lang === 'ro'
                  ? 'Centrul de Situații de Urgență: Alertă Inundații & Rutare 112'
                  : 'Emergency Operations Center: Flood Alerts & 112 Routing'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-rose-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-rose-500/30">
            <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>{lang === 'ro' ? 'GIS Operațional Live' : 'Live Operational GIS'}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          {lang === 'ro' ? (
            <>
              Cea mai valoroasă super-putere a unui GIS este <strong className="text-teal-300">Analiza Spațială (Spatial Analysis)</strong>: capacitatea de a rezolva probleme de viață și de moarte în câteva secunde. Pompierii, ambulanțele și echipele de protecție civilă folosesc hărți digitale pentru a preveni inundațiile, a localiza clădirile în pericol și a dirija convoaiele de salvare pe drumuri neafectate.
            </>
          ) : (
            <>
              The ultimate capability of a GIS is <strong className="text-teal-300">Spatial Analysis</strong>: resolving critical life-safety problems within seconds. Firefighters, paramedic crews, and civil protection teams employ digital maps to forecast floods, pinpoint vulnerable structures, and route rescue convoys through safe corridors.
            </>
          )}
        </p>
      </div>

      {/* Simulator: Emergency Operations Center (Centrul de Comandă ISU) */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Siren className="w-4 h-4 text-rose-400 animate-bounce" />
              {lang === 'ro'
                ? 'Misiune Critică ISU • Managementul Riscului de Inundație pe Râul Siret'
                : 'Civil Emergency Mission • Flood Risk Management on Siret River'}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              {lang === 'ro' ? 'Consola Decizională a Dispeceratului de Salvare' : 'Emergency Dispatch Decision Console'}
            </h2>
          </div>

          <div className="text-xs font-mono text-amber-300 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ro' ? 'COD ROȘU DE INUNDAȚIE ACTIV' : 'RED FLOOD ALERT ACTIVE'}</span>
          </div>
        </div>

        {/* 4 Interactive Tactical Steps */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          {/* Step 1 */}
          <div
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              floodLayerActive
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  {lang === 'ro' ? 'Pasul 1' : 'Step 1'}
                </span>
                {floodLayerActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
              <strong className="text-white text-xs block font-sans">
                {lang === 'ro' ? 'Strat Risc Hidrologic' : 'Hydrologic Risk Layer'}
              </strong>
              <p className="text-[11px] text-slate-300 mt-1 font-sans">
                {lang === 'ro'
                  ? 'Activează zona inundabilă a râului (buffer de 500 m).'
                  : 'Activate river flood inundation zone (500 m buffer).'}
              </p>
            </div>
            <button
              onClick={handleToggleFlood}
              className={`mt-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-center ${
                floodLayerActive
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-850'
              }`}
            >
              {floodLayerActive
                ? (lang === 'ro' ? '✓ Strat Risc Activ' : '✓ Risk Layer Active')
                : (lang === 'ro' ? 'Activează Stratul' : 'Activate Layer')}
            </button>
          </div>

          {/* Step 2 */}
          <div
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              queriedVulnerable
                ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  {lang === 'ro' ? 'Pasul 2' : 'Step 2'}
                </span>
                {queriedVulnerable && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <strong className="text-white text-xs block font-sans">
                {lang === 'ro' ? 'Interogare Clădiri Risc' : 'Query Risk Buildings'}
              </strong>
              <p className="text-[11px] text-slate-300 mt-1 font-sans">
                {lang === 'ro'
                  ? 'Identifică școlile și spitalele din aria de inundație.'
                  : 'Pinpoint schools and hospitals inside flood zone.'}
              </p>
            </div>
            <button
              onClick={handleQueryVulnerable}
              disabled={!floodLayerActive}
              className={`mt-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-center ${
                queriedVulnerable
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : floodLayerActive
                  ? 'bg-slate-900 border border-slate-700 text-amber-300 hover:bg-slate-850'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              {queriedVulnerable
                ? (lang === 'ro' ? '✓ 2 Clădiri Identificate' : '✓ 2 Structures Queried')
                : (lang === 'ro' ? 'Interoghează GIS' : 'Query GIS')}
            </button>
          </div>

          {/* Step 3 */}
          <div
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              selectedRoute === 'safe_bypass'
                ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                : selectedRoute === 'flooded_route'
                ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  {lang === 'ro' ? 'Pasul 3' : 'Step 3'}
                </span>
                {selectedRoute === 'safe_bypass' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <strong className="text-white text-xs block font-sans">
                {lang === 'ro' ? 'Rutare Urgență Ambulanță' : 'Ambulance Routing'}
              </strong>
              <p className="text-[11px] text-slate-300 mt-1 font-sans">
                {lang === 'ro'
                  ? 'Alege traseul optim ocolitor ferit de ape.'
                  : 'Select safe, flood-free bypass corridor.'}
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <button
                onClick={() => handleSelectRoute('flooded_route')}
                className={`py-1 px-2 rounded text-[10px] border transition cursor-pointer text-left ${
                  selectedRoute === 'flooded_route'
                    ? 'bg-rose-900 text-rose-200 border-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ro' ? '⚠️ Drumul Vale (Inundat!)' : '⚠️ Valley Road (Flooded!)'}
              </button>
              <button
                onClick={() => handleSelectRoute('safe_bypass')}
                className={`py-1 px-2 rounded text-[10px] border transition cursor-pointer text-left ${
                  selectedRoute === 'safe_bypass'
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ro' ? '✓ Dealul Ocolitor (Sigur)' : '✓ Hill Bypass (Safe)'}
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              alertBroadcastSent
                ? 'bg-teal-950/60 border-teal-400 text-teal-200'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  {lang === 'ro' ? 'Pasul 4' : 'Step 4'}
                </span>
                {alertBroadcastSent && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
              </div>
              <strong className="text-white text-xs block font-sans">
                {lang === 'ro' ? 'Transmitere Plan Intervenție' : 'Deploy Action Plan'}
              </strong>
              <p className="text-[11px] text-slate-300 mt-1 font-sans">
                {lang === 'ro'
                  ? 'Confirmă dispeceratul și trimite echipajele.'
                  : 'Dispatch response teams with route telemetry.'}
              </p>
            </div>
            <button
              onClick={handleSendAlert}
              disabled={!floodLayerActive || !queriedVulnerable || selectedRoute !== 'safe_bypass'}
              className={`mt-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-center ${
                alertBroadcastSent
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : floodLayerActive && queriedVulnerable && selectedRoute === 'safe_bypass'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black animate-pulse'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              {alertBroadcastSent
                ? (lang === 'ro' ? '✓ Plan Transmis (100p)' : '✓ Plan Dispatched (100pts)')
                : (lang === 'ro' ? 'Emite Alertă ISU' : 'Broadcast Emergency Plan')}
            </button>
          </div>
        </div>

        {/* Visual Tactical Operations Map */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950 border-2 border-teal-500/30 relative min-h-[260px] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
            <span className="text-teal-400 flex items-center gap-1.5 font-bold">
              <Compass className="w-3.5 h-3.5" />
              {lang === 'ro'
                ? 'Sector Valea Siretului • Monitorizare în Timp Real'
                : 'Siret Valley Sector • Real-time Monitoring'}
            </span>
            <span>{lang === 'ro' ? 'Senzori Hidrologici: Activ' : 'Hydrological Sensors: Active'}</span>
          </div>

          {/* Interactive Tactical Map Elements */}
          <div className="my-6 space-y-3 relative z-10">
            {/* River bed with conditional flood polygon */}
            <div
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                floodLayerActive
                  ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span>
                  {lang === 'ro' ? (
                    <>Albie Râu Siret: {floodLayerActive ? 'Cota de pericol depășită (+1,8 m) • Aria de inundație activă' : 'Debit normal'}</>
                  ) : (
                    <>Siret Riverbed: {floodLayerActive ? 'Danger threshold exceeded (+1.8 m) • Inundation polygon active' : 'Normal water flow'}</>
                  )}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300">
                {floodLayerActive
                  ? (lang === 'ro' ? 'Arie: 3,2 km² inundabil' : 'Area: 3.2 km² flood zone')
                  : (lang === 'ro' ? 'Nivel stabil' : 'Stable stage')}
              </span>
            </div>

            {/* Queried vulnerable structures */}
            {queriedVulnerable && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/60 text-amber-200 flex items-center gap-2">
                  <School className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block text-white">
                      {lang === 'ro' ? 'Școala Gimnazială Nr. 2' : 'Middle School No. 2'}
                    </strong>
                    <span className="text-[10px] text-amber-300">
                      {lang === 'ro' ? 'În zona de revărsare: 210 elevi evacuați' : 'Inside flood footprint: 210 students evacuated'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/60 text-amber-200 flex items-center gap-2">
                  <Hospital className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block text-white">
                      {lang === 'ro' ? 'Spitalul Municipal de Urgență' : 'Municipal Emergency Hospital'}
                    </strong>
                    <span className="text-[10px] text-amber-300">
                      {lang === 'ro' ? 'Generatoare protejate • Risc izolare rutieră' : 'Generators protected • Road isolation risk'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Route Status */}
            {selectedRoute !== 'none' && (
              <div
                className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  selectedRoute === 'safe_bypass'
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500 text-rose-200 animate-pulse'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4" />
                  <span>
                    {lang === 'ro' ? 'Traseu Ambulanță: ' : 'Ambulance Route: '}
                    <strong>
                      {selectedRoute === 'safe_bypass'
                        ? (lang === 'ro'
                            ? 'Ruta Ocolitoare pe Deal (Calea Pădurii, 12 km) — Sigură 100%'
                            : 'Hill Bypass Corridor (Forest Way, 12 km) — 100% Safe')
                        : (lang === 'ro'
                            ? 'Drumul Național pe Vale (Inundat sub 60 cm de apă!) — RISC BLOCARE VEHICUL'
                            : 'Valley National Road (Submerged under 60 cm of water!) — VEHICLE IMMOBILIZATION RISK')}
                    </strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40">
                  {selectedRoute === 'safe_bypass'
                    ? (lang === 'ro' ? '✓ RECOMANDAT' : '✓ RECOMMENDED')
                    : (lang === 'ro' ? '❌ PERICOL' : '❌ HAZARD')}
                </span>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-2 flex items-center justify-between relative z-10">
            <span>
              {lang === 'ro'
                ? 'Sistem GIS de Protecție Civilă integrat cu 112'
                : 'Civil Emergency GIS Integrated with 112 Dispatch'}
            </span>
            <span className={alertBroadcastSent ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {alertBroadcastSent
                ? (lang === 'ro' ? '✓ Plan aprobat de Inspectoratul General' : '✓ Plan approved by General Inspectorate')
                : (lang === 'ro' ? 'În așteptare validare pași...' : 'Awaiting tactical steps validation...')}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Quiz Questions with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            {lang === 'ro' ? 'Evaluare Teoretică • Analiză Spațială & Smart City' : 'Theoretical Evaluation • Spatial Analysis & Smart City'}
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            {lang === 'ro'
              ? 'Răspunde corect la cele 3 întrebări pentru a debloca Examenul Final'
              : 'Answer all 3 questions correctly to unlock the Final Exam'}
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>1. Ce înseamnă <strong className="text-teal-300">Analiza Spațială (Spatial Analysis)</strong> într-un sistem GIS?</>
              ) : (
                <>1. What defines <strong className="text-teal-300">Spatial Analysis</strong> in a GIS platform?</>
              )}
            </div>
            {q1Answer === 'spatial_analysis_def' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ1('spatial_analysis_def')}
              disabled={q1Cooldown > 0 || q1Answer === 'spatial_analysis_def'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'spatial_analysis_def'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Procesul de extragere de concluzii și soluționare a problemelor prin intersectarea datelor din straturi diferite (ex: care școli sunt inundabile și ce drumuri sunt sigure)'
                : 'A. Extracting insights and solving problems by intersecting data across different layers (e.g. which schools are flooded and which corridors are safe)'}
            </button>

            <button
              onClick={() => handleAnswerQ1('spat_wrong1')}
              disabled={q1Cooldown > 0 || q1Answer === 'spatial_analysis_def'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'spat_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'B. Doar colorarea hărții cu creioane digitale de diferite nuanțe' : 'B. Merely coloring a map with different digital highlighter hues'}
            </button>

            <button
              onClick={() => handleAnswerQ1('spat_wrong2')}
              disabled={q1Cooldown > 0 || q1Answer === 'spatial_analysis_def'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'spat_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. Calcularea vitezei de rotație a sateliților în spațiul cosmic' : 'C. Calculating the orbital velocity of space satellites'}
            </button>

            <button
              onClick={() => handleAnswerQ1('spat_wrong3')}
              disabled={q1Cooldown > 0 || q1Answer === 'spatial_analysis_def'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'spat_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. O metodă de comprimat fișiere zip pe un stick USB' : 'D. A technique for compressing zip archives onto a thumb drive'}
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
                <>2. De ce este vitală <strong className="text-rose-300">Analiza de Rețea (Routing / Traseu de Urgență)</strong> pentru serviciile 112?</>
              ) : (
                <>2. Why is <strong className="text-rose-300">Network / Routing Analysis</strong> crucial for emergency services (112)?</>
              )}
            </div>
            {q2Answer === 'routing_ambulance' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ2('rout_wrong1')}
              disabled={q2Cooldown > 0 || q2Answer === 'routing_ambulance'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'rout_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. Pentru a obliga ambulanțele să meargă cu viteză redusă' : 'A. To compel emergency vehicles to drive at lower speeds'}
            </button>

            <button
              onClick={() => handleAnswerQ2('routing_ambulance')}
              disabled={q2Cooldown > 0 || q2Answer === 'routing_ambulance'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'routing_ambulance'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Calculează cel mai rapid traseu ocolind porțiunile blocate, drumurile inundate sau podurile avariate, economisind minute vitale pentru salvarea de vieți'
                : 'B. Computes the fastest route bypassing closures, flooded segments, and damaged bridges, saving vital minutes to protect human lives'}
            </button>

            <button
              onClick={() => handleAnswerQ2('rout_wrong2')}
              disabled={q2Cooldown > 0 || q2Answer === 'routing_ambulance'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'rout_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. Doar ca să trimită facturi automate pentru carburant' : 'C. Purely to invoice automated fuel vouchers'}
            </button>

            <button
              onClick={() => handleAnswerQ2('rout_wrong3')}
              disabled={q2Cooldown > 0 || q2Answer === 'routing_ambulance'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'rout_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Ambulanțele nu folosesc sisteme GPS în viața reală' : 'D. Ambulances do not use GPS navigation in real life'}
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
                <>3. Cum contribuie GIS-ul la dezvoltarea unui <strong className="text-cyan-300">Smart City (Oraș Inteligent)</strong>?</>
              ) : (
                <>3. How does GIS contribute to a <strong className="text-cyan-300">Smart City</strong> ecosystem?</>
              )}
            </div>
            {q3Answer === 'smart_city_gis' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ3('smart_wrong1')}
              disabled={q3Cooldown > 0 || q3Answer === 'smart_city_gis'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'smart_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'A. Conectează doar televizoarele din casele oamenilor' : 'A. Only connects television sets inside homes'}
            </button>

            <button
              onClick={() => handleAnswerQ3('smart_city_gis')}
              disabled={q3Cooldown > 0 || q3Answer === 'smart_city_gis'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'smart_city_gis'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Centralizează monitorizarea utilităților (apă, canal, electricitate), a traficului urban, a calității aerului și a zonelor verzi într-un panou digital integrat'
                : 'B. Centralizes utility grids (water, power, sewage), traffic flow, air quality sensors, and urban green spaces in an integrated geospatial dashboard'}
            </button>

            <button
              onClick={() => handleAnswerQ3('smart_wrong2')}
              disabled={q3Cooldown > 0 || q3Answer === 'smart_city_gis'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'smart_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'C. Elimină complet necesitatea de a avea școli sau spitale' : 'C. Completely eliminates the need for schools and hospitals'}
            </button>

            <button
              onClick={() => handleAnswerQ3('smart_wrong3')}
              disabled={q3Cooldown > 0 || q3Answer === 'smart_city_gis'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'smart_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro' ? 'D. Înlocuiește toți medicii cu roboți de jucărie' : 'D. Replaces medical doctors with toy robots'}
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
            {allAnsweredCorrectly && scenarioReady ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'ro'
                  ? 'Planul tactic este validat și toate răspunsurile sunt corecte! Poți trece la Examenul Final.'
                  : 'Tactical action plan is validated and all answers are correct! You can advance to the Final Exam.'}
              </span>
            ) : !scenarioReady ? (
              <span className="text-amber-400">
                {lang === 'ro'
                  ? 'Completează toți cei 4 pași din simulatorul ISU de mai sus pentru validarea misiunii.'
                  : 'Complete all 4 steps in the emergency operations simulator above to validate mission.'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la cele 3 întrebări pentru validare.'
                  : 'Answer all 3 questions correctly for validation.'}
              </span>
            )}
          </div>

          <button
            onClick={handleFinish}
            disabled={!allAnsweredCorrectly || !scenarioReady}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-lg ${
              allAnsweredCorrectly && scenarioReady
                ? 'bg-gradient-to-r from-teal-500 to-rose-600 hover:from-teal-400 hover:to-rose-500 text-white font-black shadow-teal-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{lang === 'ro' ? 'Continuă spre Examenul Final' : 'Continue to Final Exam'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
