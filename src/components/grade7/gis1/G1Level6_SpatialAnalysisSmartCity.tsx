import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Siren, Layers, Route, CheckCircle2, Sparkles, Building, Hospital, School, Waves, Compass, Activity } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface G1Level6Props {
  onPass: (score: number) => void;
}

export const G1Level6_SpatialAnalysisSmartCity: React.FC<G1Level6Props> = ({ onPass }) => {
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
      setQ1ErrorMsg('Incorect! Analiza spațială în GIS rezolvă probleme reale prin intersectarea datelor din straturi diferite (ex: identificarea clădirilor din zona de revărsare a râului și calculul celui mai rapid traseu ocolitor neafectat).');
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
      setQ2ErrorMsg('Incorect! Analiza de rețea (Network Analysis / Routing) ține cont de starea drumurilor în timp real (blocaje, inundații, ambuteiaje) și ghidează ambulanțele și echipajele de pompieri pe cele mai rapide și sigure rute ocolitoare.');
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
      setQ3ErrorMsg('Incorect! Un Smart City folosește GIS-ul ca creier central pentru a monitoriza rețelele de apă și canalizare, transportul public, senzorii de poluare a aerului și intervențiile rapide în caz de dezastre.');
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
                  Nivelul 6 • Unitatea 3B (Manual pag. 57–63)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                  Analiză Spațială & Smart City
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                Centrul de Situații de Urgență: Alertă Inundații & Rutare 112
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-rose-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-rose-500/30">
            <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>GIS Operațional Live</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          Cea mai valoroasă super-putere a unui GIS este <strong className="text-teal-300">Analiza Spațială (Spatial Analysis)</strong>: capacitatea de a rezolva probleme de viață și de moarte în câteva secunde. Pompierii, ambulanțele și echipele de protecție civilă folosesc hărți digitale pentru a preveni inundațiile, a localiza clădirile în pericol și a dirija convoaiele de salvare pe drumuri neafectate.
        </p>
      </div>

      {/* Simulator: Emergency Operations Center (Centrul de Comandă ISU) */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Siren className="w-4 h-4 text-rose-400 animate-bounce" />
              Misiune Critică ISU • Managementul Riscului de Inundație pe Râul Siret
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              Consola Decizională a Dispeceratului de Salvare
            </h2>
          </div>

          <div className="text-xs font-mono text-amber-300 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>COD ROȘU DE INUNDAȚIE ACTIV</span>
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
                <span className="text-[10px] font-bold uppercase text-slate-500">Pasul 1</span>
                {floodLayerActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
              <strong className="text-white text-xs block font-sans">Strat Risc Hidrologic</strong>
              <p className="text-[11px] text-slate-300 mt-1 font-sans">
                Activează zona inundabilă a râului (buffer de 500 m).
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
              {floodLayerActive ? '✓ Strat Risc Activ' : 'Activează Stratul'}
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
                <span className="text-[10px] font-bold uppercase text-slate-500">Pasul 2</span>
                {queriedVulnerable && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <strong className="text-white text-xs block font-sans">Interogare Clădiri Risc</strong>
              <p className="text-[11px] text-slate-300 mt-1 font-sans">
                Identifică școlile și spitalele din aria de inundație.
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
              {queriedVulnerable ? '✓ 2 Clădiri Identificate' : 'Interoghează GIS'}
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
                <span className="text-[10px] font-bold uppercase text-slate-500">Pasul 3</span>
                {selectedRoute === 'safe_bypass' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <strong className="text-white text-xs block font-sans">Rutare Urgență Ambulanță</strong>
              <p className="text-[11px] text-slate-300 mt-1 font-sans">
                Alege traseul optim ocolitor ferit de ape.
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
                ⚠️ Drumul Vale (Inundat!)
              </button>
              <button
                onClick={() => handleSelectRoute('safe_bypass')}
                className={`py-1 px-2 rounded text-[10px] border transition cursor-pointer text-left ${
                  selectedRoute === 'safe_bypass'
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ✓ Dealul Ocolitor (Sigur)
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
                <span className="text-[10px] font-bold uppercase text-slate-500">Pasul 4</span>
                {alertBroadcastSent && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
              </div>
              <strong className="text-white text-xs block font-sans">Transmitere Plan Intervenție</strong>
              <p className="text-[11px] text-slate-300 mt-1 font-sans">
                Confirmă dispeceratul și trimite echipajele.
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
              {alertBroadcastSent ? '✓ Plan Transmis (100p)' : 'Emite Alertă ISU'}
            </button>
          </div>
        </div>

        {/* Visual Tactical Operations Map */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950 border-2 border-teal-500/30 relative min-h-[260px] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
            <span className="text-teal-400 flex items-center gap-1.5 font-bold">
              <Compass className="w-3.5 h-3.5" /> Sector Valea Siretului • Monitorizare în Timp Real
            </span>
            <span>Senzori Hidrologici: Activ</span>
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
                  Albie Râu Siret: {floodLayerActive ? 'Cota de pericol depășită (+1,8 m) • Aria de inundație activă' : 'Debit normal'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300">
                {floodLayerActive ? 'Arie: 3,2 km² inundabil' : 'Nivel stabil'}
              </span>
            </div>

            {/* Queried vulnerable structures */}
            {queriedVulnerable && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/60 text-amber-200 flex items-center gap-2">
                  <School className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block text-white">Școala Gimnazială Nr. 2</strong>
                    <span className="text-[10px] text-amber-300">În zona de revărsare: 210 elevi evacuați</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/60 text-amber-200 flex items-center gap-2">
                  <Hospital className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block text-white">Spitalul Municipal de Urgență</strong>
                    <span className="text-[10px] text-amber-300">Generatoare protejate • Risc izolare rutieră</span>
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
                    Traseu Ambulanță:{' '}
                    <strong>
                      {selectedRoute === 'safe_bypass'
                        ? 'Ruta Ocolitoare pe Deal (Calea Pădurii, 12 km) — Sigură 100%'
                        : 'Drumul Național pe Vale (Inundat sub 60 cm de apă!) — RISC BLOCARE VEHICUL'}
                    </strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40">
                  {selectedRoute === 'safe_bypass' ? '✓ RECOMANDAT' : '❌ PERICOL'}
                </span>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-2 flex items-center justify-between relative z-10">
            <span>Sistem GIS de Protecție Civilă integrat cu 112</span>
            <span className={alertBroadcastSent ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {alertBroadcastSent ? '✓ Plan aprobat de Inspectoratul General' : 'În așteptare validare pași...'}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Quiz Questions with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Evaluare Teoretică • Analiză Spațială & Smart City
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            Răspunde corect la cele 3 întrebări pentru a debloca Examenul Final
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              1. Ce înseamnă <strong className="text-teal-300">Analiza Spațială (Spatial Analysis)</strong> într-un sistem GIS?
            </div>
            {q1Answer === 'spatial_analysis_def' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Procesul de extragere de concluzii și soluționare a problemelor prin intersectarea datelor din straturi diferite (ex: care școli sunt inundabile și ce drumuri sunt sigure)
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
              B. Doar colorarea hărții cu creioane digitale de diferite nuanțe
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
              C. Calcularea vitezei de rotație a sateliților în spațiul cosmic
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
              D. O metodă de comprimat fișiere zip pe un stick USB
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
              2. De ce este vitală <strong className="text-rose-300">Analiza de Rețea (Routing / Traseu de Urgență)</strong> pentru serviciile 112?
            </div>
            {q2Answer === 'routing_ambulance' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Pentru a obliga ambulanțele să meargă cu viteză redusă
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
              B. Calculează cel mai rapid traseu ocolind porțiunile blocate, drumurile inundate sau podurile avariate, economisind minute vitale pentru salvarea de vieți
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
              C. Doar ca să trimită facturi automate pentru carburant
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
              D. Ambulanțele nu folosesc sisteme GPS în viața reală
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
              3. Cum contribuie GIS-ul la dezvoltarea unui <strong className="text-cyan-300">Smart City (Oraș Inteligent)</strong>?
            </div>
            {q3Answer === 'smart_city_gis' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Conectează doar televizoarele din casele oamenilor
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
              B. Centralizează monitorizarea utilităților (apă, canal, electricitate), a traficului urban, a calității aerului și a zonelor verzi într-un panou digital integrat
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
              C. Elimină complet necesitatea de a avea școli sau spitale
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
              D. Înlocuiește toți medicii cu roboți de jucărie
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
            {allAnsweredCorrectly && scenarioReady ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Planul tactic este validat și toate răspunsurile sunt corecte! Poți trece la Examenul Final.
              </span>
            ) : !scenarioReady ? (
              <span className="text-amber-400">
                Completează toți cei 4 pași din simulatorul ISU de mai sus pentru validarea misiunii.
              </span>
            ) : (
              <span>Răspunde corect la cele 3 întrebări pentru validare.</span>
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
            <span>Continuă spre Examenul Final</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
