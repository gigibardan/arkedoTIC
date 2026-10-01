import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Sparkles,
  Zap,
  Leaf,
  ShieldCheck,
  Globe,
  Users,
  HardDrive,
  Cpu,
  Trophy,
  ArrowLeft,
  X,
  Plus,
  ArrowUpCircle,
  Trash2,
  Edit2,
  Check,
  HelpCircle,
  Eye,
  Heart,
  RotateCcw,
  BookOpen,
  AlertTriangle,
  Flame,
  Award,
  Sliders,
  Coins,
  Share2
} from 'lucide-react';
import {
  CyberCityData,
  CityBuilding,
  CityIncident,
  BuildingCategory,
} from '../../types';
import {
  BUILDING_CATALOG,
  BuildingTypeDefinition,
  calculateCityMetrics,
} from '../../lib/cyberCityCatalog';
import {
  getCyberCityData,
  saveCyberCityData,
  constructBuilding,
  upgradeBuilding,
  demolishBuilding,
  renameCyberCity,
  resolveCityIncident,
  spawnRandomCityIncident,
  loadClassmateCities,
} from '../../lib/cyberCityService';
import { getByteCoins } from '../../lib/studentAuthService';
import { useLanguage } from '../../context/LanguageContext';
import { CyberCityGuideModal } from './CyberCityGuideModal';

interface CyberCityViewProps {
  studentName?: string;
  studentAvatar?: string;
  onBackToCatalog?: () => void;
}

export const CyberCityView: React.FC<CyberCityViewProps> = ({
  studentName = 'Campion TIC',
  studentAvatar = '⚡',
  onBackToCatalog,
}) => {
  const { lang } = useLanguage();

  // Core City State
  const [cityData, setCityData] = useState<CyberCityData>(() => getCyberCityData());
  const [coins, setCoins] = useState<number>(() => getByteCoins());
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'construct' | 'inspect' | 'classmates' | 'guide'>('none');
  const [selectedCategory, setSelectedCategory] = useState<BuildingCategory | 'all'>('all');

  // Renaming State
  const [isRenamingCity, setIsRenamingCity] = useState(false);
  const [cityNameInput, setCityNameInput] = useState(cityData.cityName);
  const [feedbackToast, setFeedbackToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Classmate Cities Showcase State
  const [classmateCities, setClassmateCities] = useState<CyberCityData[]>([]);
  const [viewingClassmateCity, setViewingClassmateCity] = useState<CyberCityData | null>(null);
  const [likedCities, setLikedCities] = useState<Set<string>>(new Set());

  // Guide Modal
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Refresh coins & metrics
  useEffect(() => {
    setCoins(getByteCoins());
  }, []);

  // Show auto-dismissing toast feedback
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackToast({ text, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Periodic random incident spawner (silent)
  useEffect(() => {
    const incidentInterval = setInterval(() => {
      setCityData((prev) => spawnRandomCityIncident(prev));
    }, 90000); // every 90 seconds
    return () => clearInterval(incidentInterval);
  }, []);

  // Active City Metrics
  const currentCityToDisplay = viewingClassmateCity || cityData;
  const metrics = calculateCityMetrics(currentCityToDisplay.buildings);

  // Handle Tile Click
  const handleTileClick = (tileIndex: number) => {
    if (viewingClassmateCity) return; // Spectator mode

    setSelectedTileIndex(tileIndex);
    const existingBuilding = cityData.buildings[tileIndex];

    // Check if incident on this tile
    const incident = cityData.activeIncidents?.find((inc) => inc.tileIndex === tileIndex);
    if (incident) {
      handleResolveIncident(incident.id);
      return;
    }

    if (existingBuilding) {
      setActiveModal('inspect');
    } else {
      setActiveModal('construct');
    }
  };

  // Handle Construction
  const handleConstruct = async (typeId: string) => {
    if (selectedTileIndex === null) return;
    const res = await constructBuilding(selectedTileIndex, typeId);
    if (res.success && res.updatedCity) {
      setCityData(res.updatedCity);
      if (res.newCoins !== undefined) setCoins(res.newCoins);
      setActiveModal('none');
      showToast(lang === 'en' ? '🎉 Building successfully constructed!' : '🎉 Clădire ridicată cu succes în metropolă!');
    } else {
      showToast(res.error || 'Eroare la construcție', 'error');
    }
  };

  // Handle Upgrade
  const handleUpgrade = async () => {
    if (selectedTileIndex === null) return;
    const res = await upgradeBuilding(selectedTileIndex);
    if (res.success && res.updatedCity) {
      setCityData(res.updatedCity);
      if (res.newCoins !== undefined) setCoins(res.newCoins);
      showToast(
        lang === 'en'
          ? `⭐ Upgraded to Level ${res.newLevel}!`
          : `⭐ Modernizat cu succes la Nivelul ${res.newLevel}!`
      );
    } else {
      showToast(res.error || 'Eroare la modernizare', 'error');
    }
  };

  // Handle Demolish
  const handleDemolish = async () => {
    if (selectedTileIndex === null) return;
    const res = await demolishBuilding(selectedTileIndex);
    if (res.success && res.updatedCity) {
      setCityData(res.updatedCity);
      setCoins(getByteCoins());
      setActiveModal('none');
      showToast(
        lang === 'en'
          ? `♻️ Building recycled (+${res.refundedCoins} ByteCoins)!`
          : `♻️ Clădire demolată și reciclată (+${res.refundedCoins} ByteCoins)!`
      );
    } else {
      showToast(res.error || 'Eroare la demolare', 'error');
    }
  };

  // Handle Rename City
  const handleSaveCityName = async () => {
    const res = await renameCyberCity(cityNameInput);
    if (res.success && res.updatedCity) {
      setCityData(res.updatedCity);
      setIsRenamingCity(false);
      showToast(lang === 'en' ? '✓ City name updated!' : '✓ Numele orașului a fost actualizat!');
    } else {
      showToast(res.error || 'Eroare la redenumire', 'error');
    }
  };

  // Handle Incident Resolution
  const handleResolveIncident = async (incidentId: string) => {
    const res = await resolveCityIncident(incidentId);
    if (res.success && res.updatedCity) {
      setCityData(res.updatedCity);
      setCoins(getByteCoins());
      showToast(
        lang === 'en'
          ? `✨ Incident resolved! Received +${res.rewardCoins} ByteCoins!`
          : `✨ Incident soluționat cu succes! Ai primit +${res.rewardCoins} ByteCoins!`
      );
    }
  };

  // Open Classmates Showcase
  const handleOpenClassmates = async () => {
    const cities = await loadClassmateCities();
    setClassmateCities(cities);
    setActiveModal('classmates');
  };

  // Like Classmate City
  const handleLikeClassmateCity = (targetCityId: string) => {
    if (likedCities.has(targetCityId)) return;
    setLikedCities((prev) => new Set(prev).add(targetCityId));
    setClassmateCities((prev) =>
      prev.map((c) => (c.id === targetCityId ? { ...c, likesCount: c.likesCount + 1 } : c))
    );
    showToast('❤️ Ai oferit o stea de apreciere colegului!');
  };

  const selectedBuildingData =
    selectedTileIndex !== null ? cityData.buildings[selectedTileIndex] : null;
  const selectedBuildingDef = selectedBuildingData
    ? BUILDING_CATALOG.find((d) => d.id === selectedBuildingData.typeId)
    : null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 select-none font-sans pb-16">
      {/* Toast Notification Banner */}
      {feedbackToast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-bounce ${
            feedbackToast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
              : 'bg-rose-950/90 border-rose-400 text-rose-200'
          }`}
        >
          <span>{feedbackToast.type === 'success' ? '🚀' : '⚠️'}</span>
          <span>{feedbackToast.text}</span>
        </div>
      )}

      {/* Top Header HUD Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-slate-900 border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
        {/* Background glow lines */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* City Name & Mayor Title */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {onBackToCatalog && (
                <button
                  onClick={onBackToCatalog}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'en' ? 'Missions' : 'Misiuni'}</span>
                </button>
              )}

              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold border border-cyan-400/40 flex items-center gap-1">
                <span>🏙️</span>
                <span>ARKEDO CYBER CITY BUILDER</span>
              </span>

              {viewingClassmateCity && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-400/40">
                  Mod Vizitator (Spectator)
                </span>
              )}
            </div>

            {/* Editable City Name */}
            <div className="flex items-center gap-2">
              {isRenamingCity ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={cityNameInput}
                    onChange={(e) => setCityNameInput(e.target.value)}
                    className="px-3 py-1 rounded-xl bg-slate-950 border-2 border-cyan-400 text-white font-black text-lg sm:text-xl font-heading outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveCityName}
                    className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsRenamingCity(false)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <h1 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                    {currentCityToDisplay.cityName}
                  </h1>
                  {!viewingClassmateCity && (
                    <button
                      onClick={() => {
                        setCityNameInput(cityData.cityName);
                        setIsRenamingCity(true);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                      title="Redenumește orașul"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mayor Persona & Rank */}
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-bold text-cyan-300 flex items-center gap-1">
                <span>{studentAvatar}</span>
                <span>Primar: {currentCityToDisplay.studentName}</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 font-bold font-mono">{metrics.cityRankTitle}</span>
              <span className="text-slate-500">•</span>
              <span className="text-purple-300 font-mono font-bold">
                ⭐ {metrics.cityScore.toLocaleString()} Pts Metropolă
              </span>
            </div>
          </div>

          {/* Action Buttons & Coin Balance */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* ByteCoins pill */}
            <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-amber-500/40 text-center shadow-inner flex items-center gap-2">
              <span className="text-lg">🪙</span>
              <div className="text-left">
                <div className="text-[9px] text-amber-300 uppercase font-bold">Sold ByteCoins</div>
                <div className="text-sm sm:text-base font-black text-white font-mono leading-none">
                  {coins.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Guide Handbook Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
            >
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <span>Ghid Primar</span>
            </button>

            {/* Classmates Showcase Button */}
            <button
              onClick={handleOpenClassmates}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Orașele Clasei</span>
            </button>

            {/* Exit Spectator Mode */}
            {viewingClassmateCity && (
              <button
                onClick={() => setViewingClassmateCity(null)}
                className="px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer"
              >
                Înapoi la Orașul Meu
              </button>
            )}
          </div>
        </div>

        {/* 6 Core City Metrics HUD Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center">
            <div className="text-[10px] text-cyan-300 font-bold uppercase flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" /> Calcul
            </div>
            <div className="text-sm sm:text-base font-black text-white font-mono mt-0.5">
              {metrics.computingPowerTFlops} TFlops
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-teal-500/30 text-center">
            <div className="text-[10px] text-teal-300 font-bold uppercase flex items-center justify-center gap-1">
              <HardDrive className="w-3 h-3" /> Stocare
            </div>
            <div className="text-sm sm:text-base font-black text-white font-mono mt-0.5">
              {metrics.cloudStoragePB} PB
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-sky-500/30 text-center">
            <div className="text-[10px] text-sky-300 font-bold uppercase flex items-center justify-center gap-1">
              <Globe className="w-3 h-3" /> Viteză Rețea
            </div>
            <div className="text-sm sm:text-base font-black text-white font-mono mt-0.5">
              {metrics.bandwidthTbps} Tbps
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center">
            <div className="text-[10px] text-emerald-300 font-bold uppercase flex items-center justify-center gap-1">
              <Leaf className="w-3 h-3" /> Eco-Energie
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-300 font-mono mt-0.5">
              {metrics.ecoScore}%
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-rose-500/30 text-center">
            <div className="text-[10px] text-rose-300 font-bold uppercase flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Securitate
            </div>
            <div className="text-sm sm:text-base font-black text-rose-300 font-mono mt-0.5">
              {metrics.securityRating}%
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-center">
            <div className="text-[10px] text-indigo-300 font-bold uppercase flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> Populație
            </div>
            <div className="text-sm sm:text-base font-black text-indigo-200 font-mono mt-0.5">
              {metrics.totalPopulation.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main 5x5 Isometric Interactive City Grid */}
      <div className="relative p-4 sm:p-8 rounded-3xl bg-slate-950 border-2 border-indigo-500/30 shadow-2xl overflow-hidden">
        {/* Ambient Grid Glow Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Active Incidents Banner Indicator */}
          {cityData.activeIncidents && cityData.activeIncidents.length > 0 && (
            <div className="mb-5 p-3 rounded-2xl bg-amber-950/70 border-2 border-amber-400 text-amber-200 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-xl animate-pulse">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
                <span>
                  {cityData.activeIncidents.length} incident cibernetic activ în oraș! Apasă pe parcela marcată pentru a-l soluționa!
                </span>
              </div>
            </div>
          )}

          {/* 5x5 Grid Cells */}
          <div className="grid grid-cols-5 gap-3 sm:gap-4 aspect-square max-w-[560px] mx-auto">
            {Array.from({ length: 25 }).map((_, tileIndex) => {
              const building = currentCityToDisplay.buildings[tileIndex];
              const def = building ? BUILDING_CATALOG.find((d) => d.id === building.typeId) : null;
              const incident = currentCityToDisplay.activeIncidents?.find(
                (inc) => inc.tileIndex === tileIndex
              );

              if (building && def) {
                const currentLvlData =
                  def.levels.find((l) => l.level === building.level) || def.levels[0];

                return (
                  <button
                    key={tileIndex}
                    onClick={() => handleTileClick(tileIndex)}
                    className={`group relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 border-2 transition-all duration-300 flex flex-col items-center justify-between shadow-xl cursor-pointer hover:scale-105 active:scale-95 overflow-hidden ${
                      def.accentColor
                    } bg-gradient-to-b ${def.bgGradient} ${
                      incident ? 'ring-4 ring-amber-400 animate-pulse' : ''
                    }`}
                  >
                    {/* Level Stars on Top */}
                    <div className="w-full flex items-center justify-between text-[9px] font-mono font-black text-amber-300 px-1">
                      <span>Lv.{building.level}</span>
                      <div className="flex">
                        {Array.from({ length: building.level }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>

                    {/* 3D Animated Icon */}
                    <div className="text-2xl sm:text-4xl my-auto transform group-hover:scale-115 transition-transform duration-300 drop-shadow-lg">
                      {currentLvlData.icon || def.icon}
                    </div>

                    {/* Building Name Tag */}
                    <div className="w-full text-center">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-200 block truncate leading-tight">
                        {currentLvlData.titleRo || def.nameRo}
                      </span>
                    </div>

                    {/* Incident Alert Icon */}
                    {incident && (
                      <div className="absolute top-1 right-1 p-1 rounded-full bg-amber-500 text-slate-950 animate-ping">
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              }

              // Empty Plot
              return (
                <button
                  key={tileIndex}
                  disabled={!!viewingClassmateCity}
                  onClick={() => handleTileClick(tileIndex)}
                  className="group relative rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-800 hover:border-cyan-400/80 bg-slate-900/40 hover:bg-slate-900/90 transition-all duration-200 flex flex-col items-center justify-center p-2 text-slate-600 hover:text-cyan-300 cursor-pointer disabled:cursor-default active:scale-95 shadow-inner"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-cyan-400 transition transform group-hover:rotate-90 duration-300" />
                  <span className="text-[9px] font-mono mt-1 opacity-60 group-hover:opacity-100">
                    Teren {tileIndex + 1}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs font-mono text-slate-400">
              💡 {lang === 'en'
                ? 'Click on any empty plot (+) to construct, or an existing building to upgrade!'
                : 'Apasă pe un teren liber (+) pentru a construi, sau pe o clădire existentă pentru a o moderniza!'}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: CONSTRUCTION BLUEPRINT STORE ================= */}
      {activeModal === 'construct' && selectedTileIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white font-heading">
                  🏗️ Magazinul de Construcții • Terenul #{selectedTileIndex + 1}
                </h3>
                <p className="text-xs text-slate-300">
                  Alege o clădire tehnologică pentru a o construi pe această parcelă.
                </p>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs font-bold">
              {[
                { id: 'all', label: 'Toate Clădirile' },
                { id: 'computing', label: 'Calcul & AI 🏢' },
                { id: 'networking', label: 'Telecomunicații 📡' },
                { id: 'energy', label: 'Energie Verde ☀️' },
                { id: 'education', label: 'Educație & Parcuri 🎓' },
                { id: 'security', label: 'Securitate 🛡️' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Buildings Catalog Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {BUILDING_CATALOG.filter(
                (b) => selectedCategory === 'all' || b.category === selectedCategory
              ).map((def) => {
                const canAfford = coins >= def.baseCost;

                return (
                  <div
                    key={def.id}
                    className={`p-4 rounded-2xl border-2 bg-gradient-to-b ${def.bgGradient} ${def.accentColor} flex flex-col justify-between shadow-lg space-y-3`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{def.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {def.nameRo}
                            </h4>
                            <span className="text-[10px] text-cyan-300 font-mono">
                              Nivel 1 Starter
                            </span>
                          </div>
                        </div>

                        <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black font-mono border border-amber-500/40 shrink-0">
                          🪙 {def.baseCost}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {def.descriptionRo}
                      </p>
                    </div>

                    {/* Build Button */}
                    <button
                      onClick={() => handleConstruct(def.id)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                        canAfford
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <span>{canAfford ? 'Construiește Acum 🚀' : 'Fonduri Insuficiente 🪙'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: BUILDING INSPECT & UPGRADE ================= */}
      {activeModal === 'inspect' && selectedBuildingData && selectedBuildingDef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedBuildingDef.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-white font-heading">
                    {selectedBuildingDef.nameRo}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-mono font-bold">
                    <span>Nivel {selectedBuildingData.level} / 5</span>
                    <span>•</span>
                    <div className="flex">
                      {Array.from({ length: selectedBuildingData.level }).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                {selectedBuildingDef.descriptionRo}
              </div>

              {/* Levels Timeline */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                  Evoluția Nivelurilor:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {selectedBuildingDef.levels.map((lvl) => {
                    const isUnlocked = selectedBuildingData.level >= lvl.level;
                    const isCurrent = selectedBuildingData.level === lvl.level;

                    return (
                      <div
                        key={lvl.level}
                        className={`p-2 rounded-xl text-center border transition ${
                          isCurrent
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40 font-bold'
                            : isUnlocked
                            ? 'bg-slate-950 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-950/40 border-slate-800 text-slate-600'
                        }`}
                      >
                        <div className="text-base">{lvl.icon}</div>
                        <div className="text-[10px] font-mono mt-1 font-bold">Nv.{lvl.level}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleDemolish}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-400 border border-slate-700 hover:border-rose-500 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Demolează & Reciclează</span>
                </button>

                {selectedBuildingData.level < 5 ? (
                  <button
                    onClick={handleUpgrade}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>
                      Modernizează la Nivelul {selectedBuildingData.level + 1} (🪙{' '}
                      {selectedBuildingDef.levels[selectedBuildingData.level]?.cost || 100})
                    </span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-400/40">
                    👑 Nivel Maxim Quantum Atins!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CLASSMATES CITIES SHOWCASE ================= */}
      {activeModal === 'classmates' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border-2 border-indigo-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white font-heading">
                  🏙️ Galeria Metropolelor Clasei
                </h3>
                <p className="text-xs text-slate-300">
                  Vizitează orașele colegilor tăi, inspiră-te din arhitectura lor și oferă-le steluțe de apreciere!
                </p>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classmateCities.map((clsCity) => {
                const isMe = clsCity.studentId === cityData.studentId;
                const clsMetrics = calculateCityMetrics(clsCity.buildings);
                const hasLiked = likedCities.has(clsCity.id);

                return (
                  <div
                    key={clsCity.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex flex-col justify-between space-y-3 shadow-lg hover:border-cyan-400 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-white truncate">
                          {clsCity.cityName}
                        </h4>
                        <span className="text-xs text-amber-300 font-mono font-black shrink-0">
                          ⭐ {clsMetrics.cityScore}
                        </span>
                      </div>

                      <div className="text-xs text-cyan-300 font-bold mb-2">
                        Primar: {clsCity.studentName} {isMe && '(Tu)'}
                      </div>

                      {/* Mini stats preview */}
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-mono py-2 bg-slate-900/80 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-400 block">Calcul</span>
                          <span className="text-cyan-300 font-bold">{clsMetrics.computingPowerTFlops}T</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Eco</span>
                          <span className="text-emerald-300 font-bold">{clsMetrics.ecoScore}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Populație</span>
                          <span className="text-indigo-300 font-bold">{clsMetrics.totalPopulation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Visit & Like Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setViewingClassmateCity(clsCity);
                          setActiveModal('none');
                        }}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Vizitează Orașul</span>
                      </button>

                      {!isMe && (
                        <button
                          onClick={() => handleLikeClassmateCity(clsCity.id)}
                          className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                            hasLiked
                              ? 'bg-rose-500 text-white border-rose-400'
                              : 'bg-slate-900 border-slate-700 text-rose-400 hover:bg-rose-950/60'
                          }`}
                          title="Oferă o stea"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                          <span>{clsCity.likesCount}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mayor Guide Handbook Modal */}
      <CyberCityGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};
