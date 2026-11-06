import React, { useState, useEffect } from 'react';
import { Map, Layers, Database, Search, Info, CheckCircle2, AlertTriangle, Sparkles, Compass, Eye, Mountain, Trees, Waves, Building } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface G1Level1Props {
  onPass: (score: number) => void;
}

interface RegionData {
  id: string;
  nameRo: string;
  nameEn: string;
  categoryRo: string;
  categoryEn: string;
  elevationRo: string;
  elevationEn: string;
  areaRo: string;
  areaEn: string;
  riversRo: string[];
  riversEn: string[];
  climateRo: string;
  climateEn: string;
  protectedSpecies: number;
  highlightRo: string;
  highlightEn: string;
  icon: string;
}

const REGIONS: RegionData[] = [
  {
    id: 'carpati',
    nameRo: 'Munții Carpați (Carpații Meridionali)',
    nameEn: 'Carpathian Mountains (Southern Carpathians)',
    categoryRo: 'Relief Montan & Parcuri Naționale',
    categoryEn: 'Mountain Relief & National Parks',
    elevationRo: 'Vârful Moldoveanu (2.544 m), Vârful Negoiu (2.535 m)',
    elevationEn: 'Moldoveanu Peak (2,544 m), Negoiu Peak (2,535 m)',
    areaRo: 'Peste 30.000 km²',
    areaEn: 'Over 30,000 km²',
    riversRo: ['Olt', 'Argeș', 'Jiu', 'Lotru'],
    riversEn: ['Olt', 'Arges', 'Jiu', 'Lotru'],
    climateRo: 'Alpin / Montan rece (-2°C iarna, +12°C vara)',
    climateEn: 'Alpine / Cold mountain (-2°C winter, +12°C summer)',
    protectedSpecies: 142,
    highlightRo: 'Cea mai mare populație de urși bruni, lupi și râși din Uniunea Europeană.',
    highlightEn: 'Hosts the largest brown bear, wolf, and lynx populations in the European Union.',
    icon: '🏔️'
  },
  {
    id: 'delta',
    nameRo: 'Delta Dunării (Rezervație a Biosferei UNESCO)',
    nameEn: 'Danube Delta (UNESCO Biosphere Reserve)',
    categoryRo: 'Zonă Umedă & Hidrografie',
    categoryEn: 'Wetlands & Hydrography',
    elevationRo: '0,5 m – 12 m (Grindul Letea)',
    elevationEn: '0.5 m – 12 m (Letea Sand Ridge)',
    areaRo: '5.165 km²',
    areaEn: '5,165 km²',
    riversRo: ['Brațul Chilia', 'Brațul Sulina', 'Brațul Sfântu Gheorghe'],
    riversEn: ['Chilia Branch', 'Sulina Branch', 'Sfantu Gheorghe Branch'],
    climateRo: 'Temperat-continental cu influențe pontice (vânturi uscate)',
    climateEn: 'Temperate-continental with Pontic marine influences (arid breezes)',
    protectedSpecies: 360,
    highlightRo: 'Cel mai tânăr pământ al Europei, cu peste 300 de specii de păsări migratoare.',
    highlightEn: 'Europe’s youngest natural terrain, hosting over 300 migratory avian species.',
    icon: '🦆'
  },
  {
    id: 'transilvania',
    nameRo: 'Podișul Transilvaniei',
    nameEn: 'Transylvanian Plateau',
    categoryRo: 'Depresiune Colinară & Resurse Naturale',
    categoryEn: 'Rolling Hills & Natural Resources',
    elevationRo: '300 m – 700 m',
    elevationEn: '300 m – 700 m',
    areaRo: '25.000 km²',
    areaEn: '25,000 km²',
    riversRo: ['Mureș', 'Someșul Mare', 'Someșul Mic', 'Târnava Mare'],
    riversEn: ['Mures', 'Great Somes', 'Little Somes', 'Great Tarnava'],
    climateRo: 'Continental moderat, adăpostit de lanțul carpatic',
    climateEn: 'Moderate continental, sheltered by the Carpathian horseshoe',
    protectedSpecies: 89,
    highlightRo: 'Bogat în zăcăminte de gaz metan, saline istorice (Turda, Praid) și sate săsești fortificate.',
    highlightEn: 'Rich in natural gas dome reservoirs, historic salt mines (Turda, Praid), and fortified Saxon villages.',
    icon: '🏰'
  },
  {
    id: 'campia',
    nameRo: 'Câmpia Română & Lunca Dunării',
    nameEn: 'Romanian Plain & Danube Floodplain',
    categoryRo: 'Zonă Agricolă & Urbanizare Densă',
    categoryEn: 'Agricultural Belt & High Urban Density',
    elevationRo: '15 m – 100 m',
    elevationEn: '15 m – 100 m',
    areaRo: '50.000 km²',
    areaEn: '50,000 km²',
    riversRo: ['Dunărea', 'Ialomița', 'Dâmbovița', 'Teleorman'],
    riversEn: ['Danube', 'Ialomita', 'Dambovita', 'Teleorman'],
    climateRo: 'Continental de stepă (veri toride, ierni cu crivăț)',
    climateEn: 'Continental steppe (torrid summers, harsh eastern winds in winter)',
    protectedSpecies: 54,
    highlightRo: 'Grânarul României și gazda metropolei București (peste 2 milioane de locuitori).',
    highlightEn: 'The breadbasket plain of Romania and home to the capital metropolis Bucharest (2M+ residents).',
    icon: '🌾'
  }
];

export const G1Level1_GISArchitecture: React.FC<G1Level1Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Simulator State
  const [selectedRegionId, setSelectedRegionId] = useState<string>('carpati');
  const [activeViewMode, setActiveViewMode] = useState<'paper' | 'gis'>('gis');
  const [gisSearchTerm, setGisSearchTerm] = useState<string>('');
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);

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

  const activeRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];

  const filteredRegions = REGIONS.filter((r) => {
    const term = gisSearchTerm.toLowerCase();
    const nameMatch = (lang === 'ro' ? r.nameRo : r.nameEn).toLowerCase().includes(term);
    const catMatch = (lang === 'ro' ? r.categoryRo : r.categoryEn).toLowerCase().includes(term);
    const rivers = lang === 'ro' ? r.riversRo : r.riversEn;
    const riverMatch = rivers.some((riv) => riv.toLowerCase().includes(term));
    return nameMatch || catMatch || riverMatch;
  });

  const handleAnswerQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    if (val === 'gis_def') {
      sounds.playCorrect();
      setQ1Answer(val);
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(val);
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! GIS înseamnă Geographic Information System (Sistem Informațional Geografic), adică un sistem complet de captare, stocare, analiză și afișare pe straturi a datelor georeferențiate.'
          : 'Incorrect! GIS stands for Geographic Information System, a complete computerized framework for capturing, storing, checking, and displaying spatial data linked to positions on Earth’s surface.'
      );
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    if (val === 'gis_interactive') {
      sounds.playCorrect();
      setQ2Answer(val);
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(val);
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! O hartă de hârtie este statică și devine rapid învechită. Un GIS este dinamic: permite interogarea prin clic a fiecărui punct, filtrarea straturilor, căutarea instantanee și actualizarea datelor în timp real.'
          : 'Incorrect! A paper map is static and obsolete once printed. A GIS is dynamic: it enables point-and-click queries, layer toggling, instant attribute search, and live sensor updates.'
      );
    }
  };

  const handleAnswerQ3 = (val: string) => {
    if (q3Cooldown > 0) return;
    if (val === 'attributes_table') {
      sounds.playCorrect();
      setQ3Answer(val);
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(val);
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Datele atribut reprezintă informațiile descriptive tabelare asociate fiecărei locații de pe hartă (nume, populație, altitudine, debit, climă), nu doar desenul geometric al conturului.'
          : 'Incorrect! Attribute data represents descriptive tabular values tied to spatial geometry (name, elevation, population, water discharge, climate), not merely geometric outlines.'
      );
    }
  };

  const allAnsweredCorrectly = q1Answer === 'gis_def' && q2Answer === 'gis_interactive' && q3Answer === 'attributes_table';

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-lg text-2xl">
              🗺️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold uppercase">
                  {lang === 'ro'
                    ? 'Nivelul 1 • Unitatea 3B (Manual pag. 57–63)'
                    : 'Level 1 • Unit 3B (Textbook pp. 57–63)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                  {lang === 'ro' ? 'Arhitectură GIS' : 'GIS Architecture'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {lang === 'ro'
                  ? 'Ce este un GIS? Hartă pe Hârtie vs Sistem Informațional Geografic'
                  : 'What is a GIS? Paper Maps vs. Geographic Information Systems'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-teal-300">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{lang === 'ro' ? 'Georeferențiere Digitală' : 'Digital Georeferencing'}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          {lang === 'ro' ? (
            <>
              Timp de mii de ani, oamenii au folosit hărți desenate pe pergament și hârtie. În secolul digital, am inventat <strong className="text-cyan-300">GIS (Geographic Information System)</strong>: o revoluție tehnologică ce combină <strong className="text-teal-300">hărțile vizuale</strong> cu <strong className="text-amber-300">baze de date relaționale gigantice</strong>, permițând interogarea, filtrarea și analiza spațială în timp real.
            </>
          ) : (
            <>
              For millennia, humankind navigated with parchment and paper maps. In the digital era, <strong className="text-cyan-300">GIS (Geographic Information Systems)</strong> revolutionized cartography by marrying <strong className="text-teal-300">spatial layers</strong> with <strong className="text-amber-300">relational databases</strong>, enabling point queries, layer filtering, and live spatial modeling.
            </>
          )}
        </p>
      </div>

      {/* Simulator: Paper Map vs GIS Live Attribute Explorer */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              {lang === 'ro'
                ? 'Laborator Interactiv • Simulator Cartografic Național'
                : 'Interactive Lab • National Cartographic Simulator'}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              {lang === 'ro'
                ? 'Comparație: Hartă Statică de Hârtie vs GIS cu Bază de Date Integrată'
                : 'Comparison: Static Paper Map vs. Database-Driven Digital GIS'}
            </h2>
          </div>

          {/* Toggle between Paper and GIS Mode */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveViewMode('paper');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'paper'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{lang === 'ro' ? '📜 Hartă Hârtie (1980)' : '📜 Paper Map (1980)'}</span>
            </button>
            <button
              onClick={() => {
                setActiveViewMode('gis');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'gis'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{lang === 'ro' ? '🛰️ GIS Digital (2026)' : '🛰️ Digital GIS (2026)'}</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Static Paper Map Warning */}
        {activeViewMode === 'paper' ? (
          <div className="mt-5 p-6 rounded-2xl bg-amber-950/20 border-2 border-dashed border-amber-500/40 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mb-3">
              📜
            </div>
            <h3 className="text-base font-bold text-amber-300">
              {lang === 'ro' ? 'Hartă Tradițională pe Hârtie (Statică)' : 'Traditional Static Paper Map'}
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mt-2 leading-relaxed">
              {lang === 'ro' ? (
                <>
                  Dacă dai clic pe Vârful Moldoveanu sau pe Dunăre pe o foaie de hârtie, <span className="text-rose-400 font-bold">nu se întâmplă nimic</span>! Hârtia nu poate căuta orașe, nu poate măsura automat debite de apă, nu afișează vremea în direct și dacă se construiește o autostradă nouă, trebuie să tipărești și să cumperi o altă hartă.
                </>
              ) : (
                <>
                  If you click Moldoveanu Peak or the Danube River on a paper sheet, <span className="text-rose-400 font-bold">nothing happens</span>! Paper cannot search addresses, cannot query river discharge meters, cannot display live weather, and when a highway opens, you must print and purchase a brand new atlas.
                </>
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
                {lang === 'ro' ? '❌ Fără căutare' : '❌ No Search Bar'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
                {lang === 'ro' ? '❌ Fără straturi decuplate' : '❌ No Layer Toggles'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
                {lang === 'ro' ? '❌ Date statice neactualizate' : '❌ Outdated Static Ink'}
              </span>
            </div>
            <button
              onClick={() => {
                setActiveViewMode('gis');
                sounds.playClick();
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-lg"
            >
              {lang === 'ro' ? 'Activează Sistemul GIS Digital 🛰️' : 'Activate Digital GIS Engine 🛰️'}
            </button>
          </div>
        ) : (
          /* View Mode 2: Interactive GIS Map & Attribute Inspector */
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: GIS Map View with Clickable Feature Polygons */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              {/* GIS Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={
                    lang === 'ro'
                      ? 'Caută în baza de date GIS (ex: Moldoveanu, Olt, Delta, Carpați)...'
                      : 'Search GIS relational database (e.g. Moldoveanu, Olt, Delta, Carpathians)...'
                  }
                  value={gisSearchTerm}
                  onChange={(e) => setGisSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
                />
              </div>

              {/* Map Canvas / Grid Matrix */}
              <div className="relative bg-slate-950 border-2 border-teal-500/30 rounded-2xl p-4 min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Background Grid Lines representing GIS coordinate grid */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
                  <span className="flex items-center gap-1.5 text-teal-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    {lang === 'ro'
                      ? 'Proiecție România (Stereo 70 / WGS84)'
                      : 'Projection: Stereo 70 / WGS84 (Romania)'}
                  </span>
                  <span>{lang === 'ro' ? 'Scară: 1 : 1.500.000' : 'Scale: 1 : 1,500,000'}</span>
                </div>

                {/* 4 Interactive Region Cards inside the Map */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 relative z-10">
                  {filteredRegions.map((region) => {
                    const isSelected = selectedRegionId === region.id;
                    return (
                      <button
                        key={region.id}
                        onClick={() => {
                          setSelectedRegionId(region.id);
                          setInspectorOpen(true);
                          sounds.playClick();
                        }}
                        className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? 'bg-teal-950/60 border-teal-400 shadow-lg shadow-teal-500/20 ring-1 ring-teal-400/50'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-600 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{region.icon}</span>
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold border border-teal-500/40">
                              {lang === 'ro' ? 'ACTIV' : 'ACTIVE'}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-white mt-1 group-hover:text-teal-300 transition-colors">
                          {lang === 'ro' ? region.nameRo : region.nameEn}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {lang === 'ro' ? region.categoryRo : region.categoryEn}
                        </div>
                        <div className="mt-2 text-[10px] text-teal-300/80 flex items-center gap-1 font-mono">
                          <Eye className="w-3 h-3 text-teal-400" />{' '}
                          {lang === 'ro' ? 'Clic pentru interogare date' : 'Click to inspect attribute rows'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-900 pt-2 relative z-10">
                  <span>Lat: 43°37′N – 48°15′N</span>
                  <span>Long: 20°15′E – 29°41′E</span>
                </div>
              </div>
            </div>

            {/* Right: GIS Attribute Inspector */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">
                      {lang === 'ro' ? 'Tabel de Atribute Spațiale' : 'Spatial Attribute Inspector'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    ID: {activeRegion.id.toUpperCase()}
                  </span>
                </div>

                {/* Attribute Fields */}
                <div className="mt-3 space-y-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">
                      {lang === 'ro' ? 'Regiune / Unitate Fizico-Geografică:' : 'Region / Geographic Unit:'}
                    </span>
                    <strong className="text-white text-sm font-sans font-bold">
                      {lang === 'ro' ? activeRegion.nameRo : activeRegion.nameEn}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">
                      {lang === 'ro' ? 'Altitudine & Cote Maxime:' : 'Elevation & Peak Heights:'}
                    </span>
                    <strong className="text-cyan-300 font-bold">
                      {lang === 'ro' ? activeRegion.elevationRo : activeRegion.elevationEn}
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">
                        {lang === 'ro' ? 'Suprafață Cartată:' : 'Mapped Area:'}
                      </span>
                      <strong className="text-emerald-300 font-bold">
                        {lang === 'ro' ? activeRegion.areaRo : activeRegion.areaEn}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">
                        {lang === 'ro' ? 'Specii Protejate:' : 'Protected Species:'}
                      </span>
                      <strong className="text-amber-300 font-bold">
                        {activeRegion.protectedSpecies} {lang === 'ro' ? 'specii' : 'taxa'}
                      </strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">
                      {lang === 'ro' ? 'Rețea Hidrografică (Râuri principale):' : 'Hydrographic Network (Major Rivers):'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(lang === 'ro' ? activeRegion.riversRo : activeRegion.riversEn).map((riv) => (
                        <span key={riv} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                          💧 {riv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">
                      {lang === 'ro' ? 'Tip de Climă:' : 'Climate Regime:'}
                    </span>
                    <span className="text-slate-200">
                      {lang === 'ro' ? activeRegion.climateRo : activeRegion.climateEn}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-slate-300">
                    <span className="text-teal-400 font-bold text-[10px] block mb-1">
                      {lang === 'ro' ? 'Informație Analitică GIS:' : 'GIS Spatial Analysis Insight:'}
                    </span>
                    <p className="text-[11px] leading-relaxed font-sans">
                      {lang === 'ro' ? activeRegion.highlightRo : activeRegion.highlightEn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>
                  {lang === 'ro'
                    ? 'Baza de date relațională este conectată la geometria hărții!'
                    : 'Relational attribute table is bound to geographic polygon coordinates!'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3 Quiz Questions with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            {lang === 'ro'
              ? 'Verificare Cunoștințe Fundamentale • Clasa a VII-a'
              : 'Fundamental Knowledge Check • Grade 7'}
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            {lang === 'ro'
              ? 'Răspunde corect la cele 3 cerințe pentru a debloca Nivelul 2'
              : 'Answer all 3 questions correctly to unlock Level 2'}
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>1. Ce reprezintă acronimul <strong className="text-teal-300">GIS</strong> și care este rolul său în informatică?</>
              ) : (
                <>1. What does the acronym <strong className="text-teal-300">GIS</strong> stand for and what is its role in computing?</>
              )}
            </div>
            {q1Answer === 'gis_def' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ1('gis_wrong1')}
              disabled={q1Cooldown > 0 || q1Answer === 'gis_def'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'gis_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Global Internet Search — un motor de căutare web pentru imagini satelitare'
                : 'A. Global Internet Search — a search engine for satellite photos'}
            </button>

            <button
              onClick={() => handleAnswerQ1('gis_def')}
              disabled={q1Cooldown > 0 || q1Answer === 'gis_def'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'gis_def'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Geographic Information System — sistem computerizat pentru stocarea, analiza și afișarea datelor spațiale'
                : 'B. Geographic Information System — computer system for capturing, managing, analyzing, and displaying spatial data'}
            </button>

            <button
              onClick={() => handleAnswerQ1('gis_wrong2')}
              disabled={q1Cooldown > 0 || q1Answer === 'gis_def'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'gis_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. General Image Storage — un format comprimat de stocare a fișierelor grafice pe hard disk'
                : 'C. General Image Storage — a compression format for image files on disk'}
            </button>

            <button
              onClick={() => handleAnswerQ1('gis_wrong3')}
              disabled={q1Cooldown > 0 || q1Answer === 'gis_def'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'gis_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'D. Google International Satellite — un satelit lansat pe orbită de compania Google'
                : 'D. Google International Satellite — an orbital satellite operated by Google'}
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
                <>2. Care este principalul avantaj al unei hărți <strong className="text-cyan-300">GIS digitale</strong> comparativ cu o hartă clasică tipărită pe hârtie?</>
              ) : (
                <>2. What is the fundamental advantage of a <strong className="text-cyan-300">digital GIS</strong> over a traditional printed paper map?</>
              )}
            </div>
            {q2Answer === 'gis_interactive' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ2('gis_interactive')}
              disabled={q2Cooldown > 0 || q2Answer === 'gis_interactive'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'gis_interactive'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Interactivitatea: permite filtrarea straturilor, interogarea atributelor prin clic, căutarea instantanee și actualizarea datelor'
                : 'A. Interactivity: supports layer toggling, clicking features for attribute inspection, instant queries, and live telemetry'}
            </button>

            <button
              onClick={() => handleAnswerQ2('paper_wrong1')}
              disabled={q2Cooldown > 0 || q2Answer === 'gis_interactive'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'paper_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Harta GIS nu folosește deloc memorie de stocare sau calculatoare electronice'
                : 'B. A GIS map uses zero computer memory or electronic processing'}
            </button>

            <button
              onClick={() => handleAnswerQ2('paper_wrong2')}
              disabled={q2Cooldown > 0 || q2Answer === 'gis_interactive'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'paper_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. O hartă pe hârtie este mult mai precisă deoarece nu depinde de sateliți GPS'
                : 'C. Paper maps are far more accurate because they do not rely on GPS'}
            </button>

            <button
              onClick={() => handleAnswerQ2('paper_wrong3')}
              disabled={q2Cooldown > 0 || q2Answer === 'gis_interactive'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'paper_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'D. Harta digitală nu poate fi vizualizată niciodată pe un ecran de telefon mobil'
                : 'D. Digital maps can never be displayed on mobile smartphone screens'}
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
                <>3. Ce sunt <strong className="text-amber-300">datele atribut</strong> într-un sistem GIS?</>
              ) : (
                <>3. What is <strong className="text-amber-300">attribute data</strong> in a GIS platform?</>
              )}
            </div>
            {q3Answer === 'attributes_table' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ3('attr_wrong1')}
              disabled={q3Cooldown > 0 || q3Answer === 'attributes_table'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'attr_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Culorile cu care este pictată coperta unui atlas geografic școlar'
                : 'A. The cover art colors of a printed school geography atlas'}
            </button>

            <button
              onClick={() => handleAnswerQ3('attr_wrong2')}
              disabled={q3Cooldown > 0 || q3Answer === 'attributes_table'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'attr_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Doar coordonatele de latitudine și longitudine, fără alte informații suplimentare'
                : 'B. Solely latitude and longitude numbers with no auxiliary information'}
            </button>

            <button
              onClick={() => handleAnswerQ3('attributes_table')}
              disabled={q3Cooldown > 0 || q3Answer === 'attributes_table'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'attributes_table'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. Informațiile descriptive asociate fiecărui element geografic (ex: denumire, altitudine, populație, climă, debit)'
                : 'C. Descriptive information tied to each feature (e.g. name, elevation, population, climate, river discharge)'}
            </button>

            <button
              onClick={() => handleAnswerQ3('attr_wrong3')}
              disabled={q3Cooldown > 0 || q3Answer === 'attributes_table'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'attr_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'D. Viteza de rotație a satelitului GPS în jurul Pământului'
                : 'D. The orbital speed of GPS satellites around the globe'}
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
                  ? 'Toate răspunsurile sunt corecte! Poți trece la Nivelul 2.'
                  : 'All answers are correct! You can advance to Level 2.'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la toate cele 3 întrebări pentru validare.'
                  : 'Answer all 3 questions correctly for validation.'}
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
            <span>{lang === 'ro' ? 'Continuă spre Nivelul 2' : 'Advance to Level 2'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
