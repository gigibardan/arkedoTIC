import React, { useState, useEffect } from 'react';
import { Map, Layers, Database, Search, Info, CheckCircle2, AlertTriangle, Sparkles, Compass, Eye, Mountain, Trees, Waves, Building } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface G1Level1Props {
  onPass: (score: number) => void;
}

interface RegionData {
  id: string;
  name: string;
  category: string;
  elevation: string;
  area: string;
  rivers: string[];
  climate: string;
  protectedSpecies: number;
  highlight: string;
  icon: string;
}

const REGIONS: RegionData[] = [
  {
    id: 'carpati',
    name: 'Munții Carpați (Carpații Meridionali)',
    category: 'Relief Montan & Parcuri Naționale',
    elevation: 'Vârful Moldoveanu (2.544 m), Vârful Negoiu (2.535 m)',
    area: 'Peste 30.000 km²',
    rivers: ['Olt', 'Argeș', 'Jiu', 'Lotru'],
    climate: 'Alpin / Montan rece (-2°C iarna, +12°C vara)',
    protectedSpecies: 142,
    highlight: 'Cea mai mare populație de urși bruni, lupi și râși din Uniunea Europeană.',
    icon: '🏔️'
  },
  {
    id: 'delta',
    name: 'Delta Dunării (Rezervație a Biosferei UNESCO)',
    category: 'Zonă Umedă & Hidrografie',
    elevation: '0,5 m – 12 m (Grindul Letea)',
    area: '5.165 km²',
    rivers: ['Brațul Chilia', 'Brațul Sulina', 'Brațul Sfântu Gheorghe'],
    climate: 'Temperat-continental cu influențe pontice (vânturi uscate)',
    protectedSpecies: 360,
    highlight: 'Cel mai tânăr pământ al Europei, cu peste 300 de specii de păsări migratoare.',
    icon: '🦆'
  },
  {
    id: 'transilvania',
    name: 'Podișul Transilvaniei',
    category: 'Depresiune Colinară & Resurse Naturale',
    elevation: '300 m – 700 m',
    area: '25.000 km²',
    rivers: ['Mureș', 'Someșul Mare', 'Someșul Mic', 'Târnava Mare'],
    climate: 'Continental moderat, adăpostit de lanțul carpatic',
    protectedSpecies: 89,
    highlight: 'Bogat în zăcăminte de gaz metan, saline istorice (Turda, Praid) și sate săsești fortificate.',
    icon: '🏰'
  },
  {
    id: 'campia',
    name: 'Câmpia Română & Lunca Dunării',
    category: 'Zonă Agricolă & Urbanizare Densă',
    elevation: '15 m – 100 m',
    area: '50.000 km²',
    rivers: ['Dunărea', 'Ialomița', 'Dâmbovița', 'Teleorman'],
    climate: 'Continental de stepă (veri toride, ierni cu crivăț)',
    protectedSpecies: 54,
    highlight: 'Grânarul României și gazda metropolei București (peste 2 milioane de locuitori).',
    icon: '🌾'
  }
];

export const G1Level1_GISArchitecture: React.FC<G1Level1Props> = ({ onPass }) => {
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

  const filteredRegions = REGIONS.filter((r) =>
    r.name.toLowerCase().includes(gisSearchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(gisSearchTerm.toLowerCase()) ||
    r.rivers.some((riv) => riv.toLowerCase().includes(gisSearchTerm.toLowerCase()))
  );

  // Q1 Check: What does GIS stand for?
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
      setQ1ErrorMsg('Incorect! GIS înseamnă Geographic Information System (Sistem Informațional Geografic), adică un sistem complet de captare, stocare, analiză și afișare pe straturi a datelor georeferențiate.');
    }
  };

  // Q2 Check: Difference between paper map and digital GIS
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
      setQ2ErrorMsg('Incorect! O hartă de hârtie este statică și devine rapid învechită. Un GIS este dinamic: permite interogarea prin clic a fiecărui punct, filtrarea straturilor, căutarea instantanee și actualizarea datelor în timp real.');
    }
  };

  // Q3 Check: What are attribute data?
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
      setQ3ErrorMsg('Incorect! Datele atribut reprezintă informațiile descriptive tabelare asociate fiecărei locații de pe hartă (nume, populație, altitudine, debit, climă), nu doar desenul geometric al conturului.');
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
                  Nivelul 1 • Unitatea 3B (Manual pag. 57–63)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                  Arhitectură GIS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                Ce este un GIS? Hartă pe Hârtie vs Sistem Informațional Geografic
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-teal-300">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Georeferențiere Digitală</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          Timp de mii de ani, oamenii au folosit hărți desenate pe pergament și hârtie. În secolul digital, am inventat <strong className="text-cyan-300">GIS (Geographic Information System)</strong>: o revoluție tehnologică ce combină <strong className="text-teal-300">hărțile vizuale</strong> cu <strong className="text-amber-300">baze de date relaționale gigantice</strong>, permițând interogarea, filtrarea și analiza spațială în timp real.
        </p>
      </div>

      {/* Simulator: Paper Map vs GIS Live Attribute Explorer */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Laborator Interactiv • Simulator Cartografic Național
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              Comparație: Hartă Statică de Hârtie vs GIS cu Bază de Date Integrată
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
              <span>📜 Hartă Hârtie (1980)</span>
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
              <span>🛰️ GIS Digital (2026)</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Static Paper Map Warning */}
        {activeViewMode === 'paper' ? (
          <div className="mt-5 p-6 rounded-2xl bg-amber-950/20 border-2 border-dashed border-amber-500/40 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mb-3">
              📜
            </div>
            <h3 className="text-base font-bold text-amber-300">Hartă Tradițională pe Hârtie (Statică)</h3>
            <p className="text-xs text-slate-300 max-w-lg mt-2 leading-relaxed">
              Dacă dai clic pe Vârful Moldoveanu sau pe Dunăre pe o foaie de hârtie, <span className="text-rose-400 font-bold">nu se întâmplă nimic</span>! Hârtia nu poate căuta orașe, nu poate măsura automat debite de apă, nu afișează vremea în direct și dacă se construiește o autostradă nouă, trebuie să tipărești și să cumperi o altă hartă.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">❌ Fără căutare</span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">❌ Fără straturi decuplate</span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">❌ Date statice neactualizate</span>
            </div>
            <button
              onClick={() => {
                setActiveViewMode('gis');
                sounds.playClick();
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-lg"
            >
              Activează Sistemul GIS Digital 🛰️
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
                  placeholder="Caută în baza de date GIS (ex: Moldoveanu, Olt, Delta, Carpați)..."
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
                    Proiecție România (Stereo 70 / WGS84)
                  </span>
                  <span>Scară: 1 : 1.500.000</span>
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
                              ACTIV
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-white mt-1 group-hover:text-teal-300 transition-colors">
                          {region.name}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{region.category}</div>
                        <div className="mt-2 text-[10px] text-teal-300/80 flex items-center gap-1 font-mono">
                          <Eye className="w-3 h-3 text-teal-400" /> Clic pentru interogare date
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

            {/* Right: GIS Attribute Inspector (Table of attributes for active geometry) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">
                      Tabel de Atribute Spațiale
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    ID: {activeRegion.id.toUpperCase()}
                  </span>
                </div>

                {/* Attribute Fields */}
                <div className="mt-3 space-y-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Regiune / Unitate Fizico-Geografică:</span>
                    <strong className="text-white text-sm font-sans font-bold">{activeRegion.name}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Altitudine & Cote Maxime:</span>
                    <strong className="text-cyan-300 font-bold">{activeRegion.elevation}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Suprafață Cartată:</span>
                      <strong className="text-emerald-300 font-bold">{activeRegion.area}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Specii Protejate:</span>
                      <strong className="text-amber-300 font-bold">{activeRegion.protectedSpecies} specii</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Rețea Hidrografică (Râuri principale):</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeRegion.rivers.map((riv) => (
                        <span key={riv} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                          💧 {riv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Tip de Climă:</span>
                    <span className="text-slate-200">{activeRegion.climate}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-slate-300">
                    <span className="text-teal-400 font-bold text-[10px] block mb-1">Informație Analitică GIS:</span>
                    <p className="text-[11px] leading-relaxed font-sans">{activeRegion.highlight}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Baza de date relațională este conectată la geometria hărții!</span>
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
            Verificare Cunoștințe Fundamentale • Clasa a VII-a
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            Răspunde corect la cele 3 cerințe pentru a debloca Nivelul 2
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              1. Ce reprezintă acronimul <strong className="text-teal-300">GIS</strong> și care este rolul său în informatică?
            </div>
            {q1Answer === 'gis_def' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Global Internet Search — un motor de căutare web pentru imagini satelitare
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
              B. Geographic Information System — sistem computerizat pentru stocarea, analiza și afișarea datelor spațiale
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
              C. General Image Storage — un format comprimat de stocare a fișierelor grafice pe hard disk
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
              D. Google International Satellite — un satelit lansat pe orbită de compania Google
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
              2. Care este principalul avantaj al unei hărți <strong className="text-cyan-300">GIS digitale</strong> comparativ cu o hartă clasică tipărită pe hârtie?
            </div>
            {q2Answer === 'gis_interactive' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Interactivitatea: permite filtrarea straturilor, interogarea atributelor prin clic, căutarea instantanee și actualizarea datelor
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
              B. Harta GIS nu folosește deloc memorie de stocare sau calculatoare electronice
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
              C. O hartă pe hârtie este mult mai precisă deoarece nu depinde de sateliți GPS
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
              D. Harta digitală nu poate fi vizualizată niciodată pe un ecran de telefon mobil
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
              3. Ce sunt <strong className="text-amber-300">datele atribut</strong> într-un sistem GIS?
            </div>
            {q3Answer === 'attributes_table' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Culorile cu care este pictată coperta unui atlas geografic școlar
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
              B. Doar coordonatele de latitudine și longitudine, fără alte informații suplimentare
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
              C. Informațiile descriptive asociate fiecărui element geografic (ex: denumire, altitudine, populație, climă, debit)
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
              D. Viteza de rotație a satelitului GPS în jurul Pământului
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
                Toate răspunsurile sunt corecte! Poți trece la Nivelul 2.
              </span>
            ) : (
              <span>Răspunde corect la toate cele 3 întrebări pentru validare.</span>
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
            <span>Continuă spre Nivelul 2</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
