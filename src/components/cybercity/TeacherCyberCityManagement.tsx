import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Zap,
  Leaf,
  ShieldCheck,
  Eye,
  Coins,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  HardDrive,
  Globe,
  Sliders,
  Sparkles,
  Trophy,
  ArrowUpCircle,
  Award,
  Layers,
  Check,
  Cpu
} from 'lucide-react';
import {
  getAllCitiesForTeacher,
  TeacherCitySummary,
  areDemoCitiesHidden,
  setHideDemoCities,
  grantTeacherCityGrant,
} from '../../lib/cyberCityService';
import { BUILDING_CATALOG } from '../../lib/cyberCityCatalog';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';

export const TeacherCyberCityManagement: React.FC = () => {
  const { lang } = useLanguage();
  const [summaries, setSummaries] = useState<TeacherCitySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [demosHidden, setDemosHiddenState] = useState<boolean>(() => areDemoCitiesHidden());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'real' | 'demo'>('all');

  // Inspection Modal
  const [inspectedCity, setInspectedCity] = useState<TeacherCitySummary | null>(null);

  // Grant Coins Modal
  const [grantTarget, setGrantTarget] = useState<TeacherCitySummary | null>(null);
  const [grantAmount, setGrantAmount] = useState<number>(150);
  const [grantReason, setGrantReason] = useState<string>('Excelență Arhitecturală TIC');
  const [grantSuccessToast, setGrantSuccessToast] = useState<string | null>(null);
  const [isSubmittingGrant, setIsSubmittingGrant] = useState<boolean>(false);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const data = await getAllCitiesForTeacher();
      setSummaries(data.summaries);
      setDemosHiddenState(data.demosHidden);
    } catch (err) {
      console.error('Eroare încărcare orașe profesor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleToggleHideDemos = () => {
    sounds.playClick();
    const nextState = !demosHidden;
    setHideDemoCities(nextState);
    setDemosHiddenState(nextState);
    fetchCities();
  };

  const handleOpenGrantModal = (summary: TeacherCitySummary) => {
    sounds.playClick();
    setGrantTarget(summary);
    setGrantReason(lang === 'en' ? 'Urban ICT Architecture Excellence' : 'Excelență Arhitecturală TIC');
    setGrantAmount(150);
  };

  const handleExecuteGrant = async () => {
    if (!grantTarget || grantAmount <= 0) return;
    setIsSubmittingGrant(true);
    const res = await grantTeacherCityGrant(grantTarget.studentId, grantAmount, grantReason);
    setIsSubmittingGrant(false);

    if (res.success) {
      sounds.playCorrect();
      setGrantSuccessToast(
        lang === 'en'
          ? `✓ Granted +${grantAmount} ByteCoins to ${grantTarget.studentName} for city development!`
          : `✓ Subvenție de +${grantAmount} ByteCoins acordată cu succes pentru ${grantTarget.studentName}!`
      );
      setTimeout(() => setGrantSuccessToast(null), 4000);
      setGrantTarget(null);
      fetchCities();
    } else {
      sounds.playWrong();
      alert(res.error || (lang === 'en' ? 'Grant failed' : 'Eroare la acordarea subvenției'));
    }
  };

  // Metrics aggregation
  const realCities = summaries.filter((s) => !s.isDemo);
  const demoCities = summaries.filter((s) => s.isDemo);

  const totalCompute = realCities.reduce((acc, s) => acc + (s.metrics.computingPowerTFlops || 0), 0);
  const totalStorage = realCities.reduce((acc, s) => acc + (s.metrics.cloudStoragePB || 0), 0);
  const totalPop = realCities.reduce((acc, s) => acc + (s.metrics.totalPopulation || 0), 0);
  const avgEco = realCities.length > 0
    ? Math.round(realCities.reduce((acc, s) => acc + (s.metrics.ecoScore || 0), 0) / realCities.length)
    : 0;

  // Filtered list
  const filteredSummaries = summaries.filter((s) => {
    if (filterType === 'real' && s.isDemo) return false;
    if (filterType === 'demo' && !s.isDemo) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(q) ||
      s.city.cityName.toLowerCase().includes(q) ||
      (s.metrics.cityRankTitleRo && s.metrics.cityRankTitleRo.toLowerCase().includes(q)) ||
      (s.metrics.cityRankTitleEn && s.metrics.cityRankTitleEn.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {grantSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-950/95 border-2 border-emerald-400 text-emerald-200 text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <span>🎉</span>
          <span>{grantSuccessToast}</span>
        </div>
      )}

      {/* Top Banner & Analytics Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold border border-cyan-400/40 flex items-center gap-1">
                <span>🏙️</span>
                <span>{lang === 'en' ? 'CYBER CITY FACULTY CONTROL' : 'CENTRU DE COMANDĂ URBANĂ PROFESOR'}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                demosHidden
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
              }`}>
                {demosHidden
                  ? (lang === 'en' ? '🏷️ 4 Demo Cities Hidden' : '🏷️ 4 Orașe Demo Ascunse')
                  : (lang === 'en' ? '🏷️ 4 Demo Models Active' : '🏷️ 4 Modele Demo Active')}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'en' ? 'Metropolis Simulation & Architecture Hub' : 'Catalogul Metropolelor & Monitorizare Orașe Elevi'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {lang === 'en'
                ? 'Inspect student technological cities, award ByteCoin grants, and manage temporary demo model visibility.'
                : 'Inspectează orașele tehnologice create de elevi, acordă subvenții ByteCoins pentru proiecte bune și gestionează vizibilitatea modelelor demo.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Demo Visibility Toggle Button */}
            <button
              onClick={handleToggleHideDemos}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer active:scale-95 border ${
                demosHidden
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
              }`}
              title={lang === 'en' ? 'Toggle demo cities in students gallery' : 'Comută afișarea celor 4 orașe demo în galeria elevilor'}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {demosHidden
                  ? (lang === 'en' ? 'Show 4 Demo Cities' : 'Afișează cele 4 Orașe Demo')
                  : (lang === 'en' ? 'Hide 4 Demo Cities' : 'Ascunde cele 4 Orașe Demo')}
              </span>
            </button>

            {/* Refresh */}
            <button
              onClick={fetchCities}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer active:scale-95 disabled:opacity-50"
              title={lang === 'en' ? 'Refresh cities' : 'Reîmprospătează'}
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Analytics KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
            <div className="text-[11px] text-cyan-300 font-mono font-bold uppercase flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Real Student Cities' : 'Metropole Elevi'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
              {realCities.length} <span className="text-xs text-slate-500 font-normal">+ {demoCities.length} demo</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-teal-500/30">
            <div className="text-[11px] text-teal-300 font-mono font-bold uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Class Computing Power' : 'Putere Totală Calcul'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-teal-300 font-mono mt-1">
              {totalCompute.toLocaleString()} <span className="text-xs text-slate-400">TFlops</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
            <div className="text-[11px] text-emerald-300 font-mono font-bold uppercase flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Class Green Energy' : 'Medie Energie Verde'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-1">
              {avgEco}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-indigo-500/30">
            <div className="text-[11px] text-indigo-300 font-mono font-bold uppercase flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Total Population' : 'Populație Totală'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-300 font-mono mt-1">
              {totalPop.toLocaleString()} <span className="text-xs text-slate-400">cetățeni</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search student, city name, rank...' : 'Caută după elev, oraș, rang primar...'}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              filterType === 'all'
                ? 'bg-cyan-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lang === 'en' ? `All (${summaries.length})` : `Toate (${summaries.length})`}
          </button>

          <button
            onClick={() => setFilterType('real')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              filterType === 'real'
                ? 'bg-teal-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lang === 'en' ? `Real Students (${realCities.length})` : `Elevi Reali (${realCities.length})`}
          </button>

          <button
            onClick={() => setFilterType('demo')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              filterType === 'demo'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lang === 'en' ? `Demo Models (${demoCities.length})` : `Modele Demo (${demoCities.length})`}
          </button>
        </div>
      </div>

      {/* Cities Grid View */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>{lang === 'en' ? 'Loading student cities...' : 'Se încarcă metropolele elevilor...'}</span>
        </div>
      ) : filteredSummaries.length === 0 ? (
        <div className="py-12 text-center bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-400">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="font-bold text-sm text-slate-300">
            {lang === 'en' ? 'No cities found matching query.' : 'Niciun oraș găsit conform criteriilor.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSummaries.map((summary) => {
            const isDemo = summary.isDemo;
            const rankTitle = lang === 'en'
              ? (summary.metrics.cityRankTitleEn || summary.metrics.cityRankTitle)
              : (summary.metrics.cityRankTitleRo || summary.metrics.cityRankTitle);

            return (
              <div
                key={summary.city.id + summary.studentId}
                className={`p-4 rounded-3xl bg-slate-900 border-2 transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                  isDemo
                    ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950'
                    : 'border-slate-800 hover:border-cyan-500/60 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
                }`}
              >
                <div>
                  {/* Top line badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xl">{summary.studentAvatar || '⚡'}</span>
                    {isDemo ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black border border-amber-400/50">
                        🏷️ DEMO MODEL
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/40">
                        🟢 ELEV REAL
                      </span>
                    )}
                  </div>

                  {/* City Name & Student */}
                  <h4 className="text-base font-black text-white font-heading truncate">
                    {summary.city.cityName}
                  </h4>
                  <div className="text-xs text-cyan-300 font-bold mt-0.5">
                    {lang === 'en' ? 'Mayor' : 'Primar'}: {summary.studentName}
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono font-bold mt-1">
                    {rankTitle}
                  </div>

                  {/* 6 Key Stats Grid */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center py-2.5 px-2 bg-slate-950/80 rounded-2xl border border-slate-800/80 mt-3">
                    <div>
                      <span className="text-slate-400 block">{lang === 'en' ? 'Score' : 'Scor'}</span>
                      <span className="text-amber-300 font-bold">⭐ {summary.metrics.cityScore}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{lang === 'en' ? 'Compute' : 'Calcul'}</span>
                      <span className="text-cyan-300 font-bold">{summary.metrics.computingPowerTFlops} T</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{lang === 'en' ? 'Eco' : 'Eco'}</span>
                      <span className="text-emerald-300 font-bold">{summary.metrics.ecoScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{lang === 'en' ? 'Storage' : 'Stocare'}</span>
                      <span className="text-teal-300 font-bold">{summary.metrics.cloudStoragePB} PB</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{lang === 'en' ? 'Security' : 'Securitate'}</span>
                      <span className="text-rose-300 font-bold">{summary.metrics.securityRating}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{lang === 'en' ? 'Pop.' : 'Pop.'}</span>
                      <span className="text-indigo-300 font-bold">{summary.metrics.totalPopulation}</span>
                    </div>
                  </div>

                  {/* Plot count & Upgrades badge */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3 px-1">
                    <span>
                      {lang === 'en' ? 'Plots Built' : 'Parcele Construite'}: <strong className="text-white">{summary.buildingsCount} / 25</strong>
                    </span>
                    <span>
                      {lang === 'en' ? 'Upgrades' : 'Modernizări'}: <strong className="text-white">{summary.city.totalUpgradesDone || 0}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setInspectedCity(summary);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'en' ? 'Inspect Grid' : 'Inspectează Oraș'}</span>
                  </button>

                  {!isDemo && (
                    <button
                      onClick={() => handleOpenGrantModal(summary)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                      title={lang === 'en' ? 'Award ByteCoins grant' : 'Acordă subvenție ByteCoins'}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Grant' : 'Subvenție'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL 1: VISUAL 5X5 CITY INSPECTOR ================= */}
      {inspectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-heading">
                    🔍 {inspectedCity.city.cityName}
                  </h3>
                  {inspectedCity.isDemo ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/40">
                      🏷️ DEMO MODEL
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/40">
                      🟢 ELEV REAL
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {lang === 'en' ? 'Mayor' : 'Primar'}: <strong>{inspectedCity.studentName}</strong> • {lang === 'en' ? (inspectedCity.metrics.cityRankTitleEn || inspectedCity.metrics.cityRankTitle) : (inspectedCity.metrics.cityRankTitleRo || inspectedCity.metrics.cityRankTitle)}
                </p>
              </div>

              <button
                onClick={() => setInspectedCity(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inspector Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Metrics HUD Strip */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                  <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Score' : 'Scor'}</div>
                  <div className="text-sm font-bold text-amber-300">⭐ {inspectedCity.metrics.cityScore}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                  <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Compute' : 'Calcul'}</div>
                  <div className="text-sm font-bold text-cyan-300">{inspectedCity.metrics.computingPowerTFlops} TF</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                  <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Storage' : 'Stocare'}</div>
                  <div className="text-sm font-bold text-teal-300">{inspectedCity.metrics.cloudStoragePB} PB</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                  <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Bandwidth' : 'Rețea'}</div>
                  <div className="text-sm font-bold text-sky-300">{inspectedCity.metrics.bandwidthTbps} Tbps</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                  <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Eco Score' : 'Eco'}</div>
                  <div className="text-sm font-bold text-emerald-300">{inspectedCity.metrics.ecoScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                  <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Security' : 'Securitate'}</div>
                  <div className="text-sm font-bold text-rose-300">{inspectedCity.metrics.securityRating}%</div>
                </div>
              </div>

              {/* 5x5 Map Grid Display */}
              <div className="p-4 sm:p-6 rounded-3xl bg-slate-950 border-2 border-slate-800">
                <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-[480px] mx-auto aspect-square">
                  {Array.from({ length: 25 }).map((_, tileIndex) => {
                    const building = inspectedCity.city.buildings[tileIndex];
                    const def = building ? BUILDING_CATALOG.find((d) => d.id === building.typeId) : null;

                    if (building && def) {
                      const lvlData = def.levels.find((l) => l.level === building.level) || def.levels[0];
                      const title = lang === 'en' ? (lvlData.titleEn || def.nameEn) : (lvlData.titleRo || def.nameRo);

                      return (
                        <div
                          key={tileIndex}
                          className={`rounded-2xl p-1 border flex flex-col items-center justify-between text-center overflow-hidden shadow-md bg-gradient-to-b ${def.bgGradient} ${def.accentColor}`}
                          title={`${title} (Lv.${building.level})`}
                        >
                          <div className="text-[9px] font-mono text-amber-300 font-bold">
                            Lv.{building.level}
                          </div>
                          <div className="text-xl sm:text-2xl my-auto">
                            {lvlData.icon || def.icon}
                          </div>
                          <div className="text-[8px] font-bold text-white truncate w-full px-0.5">
                            {title}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={tileIndex}
                        className="rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/30 flex items-center justify-center text-[9px] font-mono text-slate-600"
                      >
                        #{tileIndex + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {inspectedCity.isDemo
                  ? (lang === 'en' ? 'Model preset for students to explore.' : 'Model demonstrativ pentru explorare elevi.')
                  : (lang === 'en' ? 'Real student city persisted in cloud.' : 'Oraș elev real salvat în cloud.')}
              </div>

              <button
                onClick={() => setInspectedCity(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                {lang === 'en' ? 'Close Inspector' : 'Închide'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: GRANT BYTECOINS TO STUDENT ================= */}
      {grantTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xl">
                  🪙
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-heading">
                    {lang === 'en' ? 'Award ByteCoins Grant' : 'Acordă Subvenție ByteCoins'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Student' : 'Elev'}: <strong>{grantTarget.studentName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGrantTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-300 uppercase font-bold block mb-1.5">
                  {lang === 'en' ? 'Grant Amount (ByteCoins)' : 'Valoare Subvenție (ByteCoins)'}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[50, 100, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setGrantAmount(amt)}
                      className={`py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        grantAmount === amt
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-amber-400'
                      }`}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 uppercase font-bold block mb-1.5">
                  {lang === 'en' ? 'Reason / Commendation' : 'Motiv / Mențiune Didactică'}
                </label>
                <input
                  type="text"
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setGrantTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                {lang === 'en' ? 'Cancel' : 'Anulează'}
              </button>

              <button
                onClick={handleExecuteGrant}
                disabled={isSubmittingGrant}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmittingGrant ? '...' : (lang === 'en' ? 'Transfer Coins 🪙' : 'Transferă Fonduri 🪙')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
