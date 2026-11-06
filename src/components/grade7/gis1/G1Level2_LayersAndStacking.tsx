import React, { useState, useEffect } from 'react';
import { Layers, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles, CheckCircle2, AlertTriangle, Sliders } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface G1Level2Props {
  onPass: (score: number) => void;
}

interface GisLayer {
  id: string;
  nameRo: string;
  nameEn: string;
  descriptionRo: string;
  descriptionEn: string;
  icon: string;
  color: string;
  visible: boolean;
  opacity: number; // 0 to 100
  isOpaqueBackground?: boolean;
}

const INITIAL_LAYERS: GisLayer[] = [
  {
    id: 'settlements',
    nameRo: 'Așezări Urbane & Orașe',
    nameEn: 'Urban Settlements & Cities',
    descriptionRo: 'Puncte și etichete: București, Cluj-Napoca, Timișoara, Iași, Constanța, Brașov',
    descriptionEn: 'Points & labels: Bucharest, Cluj-Napoca, Timișoara, Iași, Constanța, Brașov',
    icon: '🏙️',
    color: 'from-amber-500 to-yellow-600',
    visible: true,
    opacity: 100
  },
  {
    id: 'roads',
    nameRo: 'Infrastructură Rutieră & Autostrăzi',
    nameEn: 'Road Infrastructure & Highways',
    descriptionRo: 'Linii vectoriale: A1, A2 Soarelui, A3 Transilvania, Căi Ferate CFR',
    descriptionEn: 'Vector lines: A1, A2 Sun Highway, A3 Transylvania, CFR Railways',
    icon: '🛣️',
    color: 'from-rose-500 to-red-600',
    visible: true,
    opacity: 100
  },
  {
    id: 'protected',
    nameRo: 'Arii Protejate & Păduri',
    nameEn: 'Protected Areas & Forests',
    descriptionRo: 'Poligoane: Parcul Național Retezat, Parcul Național Călimani, Delta Dunării',
    descriptionEn: 'Polygons: Retezat National Park, Călimani National Park, Danube Delta',
    icon: '🌲',
    color: 'from-emerald-500 to-green-600',
    visible: true,
    opacity: 80
  },
  {
    id: 'hydro',
    nameRo: 'Rețea Hidrografică (Râuri & Lacuri)',
    nameEn: 'Hydrographic Network (Rivers & Lakes)',
    descriptionRo: 'Fluviul Dunărea, Olt, Mureș, Siret, Prut, Lacul Vidraru, Lacul Bicaz',
    descriptionEn: 'Danube River, Olt, Mureș, Siret, Prut, Lake Vidraru, Lake Bicaz',
    icon: '🌊',
    color: 'from-cyan-500 to-blue-600',
    visible: true,
    opacity: 90
  },
  {
    id: 'relief',
    nameRo: 'Relief & Model Digital de Altitudine (DEM)',
    nameEn: 'Relief & Digital Elevation Model (DEM)',
    descriptionRo: 'Strat de bază topografic: Munții Carpați, Podișuri, Dealuri și Câmpii',
    descriptionEn: 'Topographic base layer: Carpathian Mountains, Plateaus, Hills and Plains',
    icon: '🏔️',
    color: 'from-stone-600 to-slate-800',
    visible: true,
    opacity: 100,
    isOpaqueBackground: true
  }
];

export const G1Level2_LayersAndStacking: React.FC<G1Level2Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Simulator State
  const [layers, setLayers] = useState<GisLayer[]>(INITIAL_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('settlements');

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

  // Countdown timer for error cooldown
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ2Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ3Cooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toggle layer visibility
  const toggleVisibility = (id: string) => {
    sounds.playClick();
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, visible: !layer.visible } : layer))
    );
  };

  // Change layer opacity
  const handleOpacityChange = (id: string, value: number) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, opacity: value } : layer))
    );
  };

  // Move layer up in stack (draws earlier, on top)
  const moveLayerUp = (index: number) => {
    if (index === 0) return;
    sounds.playClick();
    setLayers((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Move layer down in stack (draws later, beneath)
  const moveLayerDown = (index: number) => {
    if (index === layers.length - 1) return;
    sounds.playClick();
    setLayers((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Reset to default stack
  const handleResetStack = () => {
    sounds.playClick();
    setLayers(INITIAL_LAYERS);
  };

  // Check if opaque relief is wrongly placed above other transparent features
  const reliefIndex = layers.findIndex((l) => l.id === 'relief');
  const isReliefBlocking = reliefIndex < layers.length - 1 && layers[reliefIndex].visible && layers[reliefIndex].opacity > 80;

  // Q1 Check: What is the layer model in GIS?
  const handleAnswerQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    if (val === 'transparent_sheets') {
      sounds.playCorrect();
      setQ1Answer(val);
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(val);
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Straturile GIS (Layers) funcționează precum niște foi transparente suprapuse: fiecare strat conține un singur tip omogen de date (ex: doar râurile sau doar drumurile), iar utilizatorul le poate activa, dezactiva și rearanja liber.'
          : 'Incorrect! GIS Layers work like overlaid transparent acetate sheets: each layer holds a single homogeneous data type (e.g. only rivers or only roads), and users can toggle visibility, opacity, and order freely.'
      );
    }
  };

  // Q2 Check: Why does layer order matter?
  const handleAnswerQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    if (val === 'stack_order') {
      sounds.playCorrect();
      setQ2Answer(val);
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(val);
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Ordinea de suprapunere este esențială: stratul opac de fundal (relieful) trebuie să fie așezat la baza stivei. Dacă îl muți în vârf cu opacitate 100%, el va acoperi și ascunde toate drumurile, râurile și orașele aflate dedesubt!'
          : 'Incorrect! Stacking order is vital: opaque background layers (relief / elevation) must sit at the bottom of the stack. Placing an opaque layer on top hides all roads, rivers, and cities below it!'
      );
    }
  };

  // Q3 Check: What is opacity in GIS layers?
  const handleAnswerQ3 = (val: string) => {
    if (q3Cooldown > 0) return;
    if (val === 'transparency_blend') {
      sounds.playCorrect();
      setQ3Answer(val);
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(val);
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Reglarea opacității (transparenței) permite combinarea vizuală a două straturi diferite (ex: o zonă de pădure semi-transparentă afișată peste curbele de nivel ale muntelui).'
          : 'Incorrect! Adjusting opacity (transparency) enables blending two layers visually (e.g., semi-transparent forest polygons shown over elevation contour lines).'
      );
    }
  };

  const allAnsweredCorrectly = q1Answer === 'transparent_sheets' && q2Answer === 'stack_order' && q3Answer === 'transparency_blend';

  const handleFinish = () => {
    if (allAnsweredCorrectly) {
      sounds.playSuccess();
      setIsPassed(true);
      onPass(100);
    }
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || layers[0];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg text-2xl">
              🥞
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold uppercase">
                  {lang === 'ro' ? 'Nivelul 2 • Unitatea 3B (Manual pag. 57–63)' : 'Level 2 • Unit 3B (Textbook pp. 57–63)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                  {lang === 'ro' ? 'Straturi Tematice (Layers)' : 'Thematic Layers'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {lang === 'ro'
                  ? 'Modelul Straturilor Tematice: Suprapunere, Vizibilitate & Opacitate'
                  : 'Thematic Layer Model: Stacking, Visibility & Opacity'}
              </h1>
            </div>
          </div>
          <button
            onClick={handleResetStack}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-300 text-xs font-mono border border-teal-500/30 transition cursor-pointer"
          >
            {lang === 'ro' ? '↺ Reinițializează Stiva' : '↺ Reset Stack'}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          {lang === 'ro' ? (
            <>
              Spre deosebire de o hartă desenată pe o singură foaie, un sistem GIS organizează informația pe <strong className="text-teal-300">straturi tematice independente (Layers)</strong>. Gândește-te la ele ca la niște folii de plastic transparente: poți ascunde stratul drumurilor dacă vrei să studiezi doar râurile sau poți ajusta transparența pentru a vedea relieful de sub pădure.
            </>
          ) : (
            <>
              Unlike a paper map printed on a single sheet, a GIS organizes geographical data into <strong className="text-teal-300">independent thematic layers</strong>. Think of them as stacked transparent plastic overlays: toggle off roads to focus on hydrology, or adjust forest opacity to inspect elevation contours beneath.
            </>
          )}
        </p>
      </div>

      {/* Simulator: Layer Stack Manager & Interactive Map Compositor */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              {lang === 'ro' ? 'Simulator de Stivă Cartografică • Compoziție Multi-Strat' : 'Cartographic Stack Simulator • Multi-Layer Composition'}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              {lang === 'ro' ? 'Panoul de Administrare a Straturilor (Layer Manager)' : 'GIS Layer Manager Panel'}
            </h2>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>
              {lang === 'ro'
                ? `${layers.filter((l) => l.visible).length} din ${layers.length} straturi vizibile`
                : `${layers.filter((l) => l.visible).length} of ${layers.length} layers visible`}
            </span>
          </div>
        </div>

        {/* Warning if Relief is blocking layers below */}
        {isReliefBlocking && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/60 border-2 border-amber-500 text-amber-200 text-xs flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="block font-bold">
                {lang === 'ro' ? 'Atenție: Stratul opac de Relief blochează straturile de sub el!' : 'Warning: Opaque Relief layer blocks layers beneath it!'}
              </strong>
              <span>
                {lang === 'ro'
                  ? 'Relieful este poziționat mai sus în stivă decât drumurile sau râurile. Deoarece are opacitate de 100%, el ascunde elementele dedesubt. Mută Relieful la baza stivei (jos) sau scade-i opacitatea!'
                  : 'Relief is stacked above roads and hydrology. With 100% opacity, it completely obscures features beneath it. Move Relief to the bottom of the stack or lower its opacity!'}
              </span>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Layer Manager Stack (5 layers with Up/Down & Visibility Controls) */}
          <div className="lg:col-span-6 space-y-2.5">
            <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between px-1">
              <span>{lang === 'ro' ? 'ORDINEA DE DESENARE (SUS = VÂRFUL HĂRȚII)' : 'RENDER ORDER (TOP = FOREGROUND)'}</span>
              <span className="text-[10px] text-slate-500">{lang === 'ro' ? 'Mută ordinea cu săgețile' : 'Reorder using arrows'}</span>
            </div>

            {layers.map((layer, index) => {
              const isSelected = selectedLayerId === layer.id;
              const name = lang === 'ro' ? layer.nameRo : layer.nameEn;
              const desc = lang === 'ro' ? layer.descriptionRo : layer.descriptionEn;
              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-400 shadow-md ring-1 ring-teal-400/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  } ${!layer.visible ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{layer.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                          {name}
                        </span>
                        {layer.isOpaqueBackground && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px] font-mono shrink-0">
                            {lang === 'ro' ? 'Strat Bază' : 'Base Layer'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {lang === 'ro'
                          ? `Opacitate: ${layer.opacity}% • ${layer.visible ? 'Vizibil' : 'Ascuns'}`
                          : `Opacity: ${layer.opacity}% • ${layer.visible ? 'Visible' : 'Hidden'}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Opacity mini slider toggle */}
                    <button
                      onClick={() => toggleVisibility(layer.id)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        layer.visible
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'
                      }`}
                      title={layer.visible ? (lang === 'ro' ? 'Ascunde stratul' : 'Hide layer') : (lang === 'ro' ? 'Afișează stratul' : 'Show layer')}
                    >
                      {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Move Up */}
                    <button
                      onClick={() => moveLayerUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      title={lang === 'ro' ? 'Mută mai sus în stivă' : 'Move up in stack'}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveLayerDown(index)}
                      disabled={index === layers.length - 1}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      title={lang === 'ro' ? 'Mută mai jos în stivă' : 'Move down in stack'}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Selected Layer Fine Opacity Tuning */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-teal-400" />
                  {lang === 'ro' ? 'Reglaj Transparență pentru:' : 'Opacity Control for:'}{' '}
                  <strong className="text-white">
                    {lang === 'ro' ? selectedLayer.nameRo : selectedLayer.nameEn}
                  </strong>
                </span>
                <span className="text-teal-400 font-bold">{selectedLayer.opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={selectedLayer.opacity}
                onChange={(e) => handleOpacityChange(selectedLayer.id, Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>{lang === 'ro' ? '10% (Foarte transparent)' : '10% (Very transparent)'}</span>
                <span>{lang === 'ro' ? '100% (Complet opac)' : '100% (Completely opaque)'}</span>
              </div>
            </div>
          </div>

          {/* Right: Real-time Composed Map Canvas Preview */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950 border-2 border-teal-500/30 rounded-2xl p-4 shadow-inner">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
                <span className="text-teal-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  {lang === 'ro' ? 'Previzualizare Rezultat GIS Compus' : 'Composed GIS Map Preview'}
                </span>
                <span className="text-slate-400">{lang === 'ro' ? 'Scară Națională' : 'National Scale'}</span>
              </div>

              {/* Graphic Representation of the Composed Layers */}
              <div className="relative mt-3 rounded-xl min-h-[300px] border border-slate-800 overflow-hidden flex flex-col justify-center items-center p-4 bg-slate-900">
                {/* Background grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Layer Visuals stacked */}
                {layers.slice().reverse().map((layer) => {
                  if (!layer.visible) return null;
                  const name = lang === 'ro' ? layer.nameRo : layer.nameEn;
                  const desc = lang === 'ro' ? layer.descriptionRo : layer.descriptionEn;
                  return (
                    <div
                      key={layer.id}
                      className="w-full my-1 p-3 rounded-xl border transition-all text-xs flex items-center justify-between"
                      style={{
                        opacity: layer.opacity / 100,
                        backgroundColor: layer.id === 'relief' ? '#292524' : layer.id === 'hydro' ? '#083344' : layer.id === 'protected' ? '#064e3b' : layer.id === 'roads' ? '#450a0a' : '#451a03',
                        borderColor: layer.id === 'relief' ? '#78716c' : layer.id === 'hydro' ? '#06b6d4' : layer.id === 'protected' ? '#10b981' : layer.id === 'roads' ? '#f43f5e' : '#f59e0b'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{layer.icon}</span>
                        <div>
                          <strong className="text-white block font-sans">{name}</strong>
                          <span className="text-[10px] text-slate-300 font-mono">{desc}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-200">
                        {layer.opacity}%
                      </span>
                    </div>
                  );
                })}

                {layers.every((l) => !l.visible) && (
                  <div className="text-center text-slate-500 font-mono text-xs p-6">
                    {lang === 'ro'
                      ? '⚠️ Toate straturile sunt ascunse! Activează cel puțin un strat din panoul din stânga.'
                      : '⚠️ All layers are hidden! Enable at least one layer from the left panel.'}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span className="text-teal-400">{lang === 'ro' ? '💡 Principiu GIS:' : '💡 GIS Principle:'}</span>
              <span className="text-right">
                {lang === 'ro' ? 'Straturile superioare se desenează peste cele inferioare.' : 'Higher stack layers render on top of lower ones.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quiz Questions with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            {lang === 'ro' ? 'Evaluare Formativă • Straturi & Suprapunere' : 'Formative Evaluation • Layers & Stacking'}
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            {lang === 'ro'
              ? 'Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 3'
              : 'Answer all 3 questions correctly to unlock Level 3'}
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>1. Cum funcționează modelul <strong className="text-teal-300">straturilor tematice (Layers)</strong> într-un sistem GIS?</>
              ) : (
                <>1. How does the <strong className="text-teal-300">thematic layer model</strong> operate within a GIS?</>
              )}
            </div>
            {q1Answer === 'transparent_sheets' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ1('single_layer')}
              disabled={q1Cooldown > 0 || q1Answer === 'transparent_sheets'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'single_layer'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Toate datele geografice sunt lipite într-o singură imagine indivizibilă'
                : 'A. All geographic features are glued into a single flat indivisible image'}
            </button>

            <button
              onClick={() => handleAnswerQ1('transparent_sheets')}
              disabled={q1Cooldown > 0 || q1Answer === 'transparent_sheets'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'transparent_sheets'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Precum foi transparente suprapuse: fiecare strat conține un tip omogen de date și poate fi activat, ascuns sau reordonat independent'
                : 'B. Like overlaid transparent sheets: each layer holds a homogeneous data theme and can be toggled, reordered, or faded independently'}
            </button>

            <button
              onClick={() => handleAnswerQ1('layers_wrong3')}
              disabled={q1Cooldown > 0 || q1Answer === 'transparent_sheets'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'layers_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. Straturile sunt fișiere audio care rulează muzică de fundal în timp ce privim harta'
                : 'C. Layers are audio tracks playing ambient background music while looking at maps'}
            </button>

            <button
              onClick={() => handleAnswerQ1('layers_wrong4')}
              disabled={q1Cooldown > 0 || q1Answer === 'transparent_sheets'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'layers_wrong4'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'D. Fiecare strat poate fi deschis doar într-o altă zi a săptămânii'
                : 'D. Each layer can only be opened on a different day of the week'}
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
                <>2. De ce este importantă <strong className="text-cyan-300">ordinea straturilor în stivă</strong> (de sus în jos)?</>
              ) : (
                <>2. Why is <strong className="text-cyan-300">layer stacking order</strong> (top to bottom) critical?</>
              )}
            </div>
            {q2Answer === 'stack_order' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ2('order_random')}
              disabled={q2Cooldown > 0 || q2Answer === 'stack_order'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'order_random'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Ordinea nu contează deloc; toate elementele sunt transparente 100% automat'
                : 'A. Order never matters; all elements are rendered 100% transparent by default'}
            </button>

            <button
              onClick={() => handleAnswerQ2('stack_order')}
              disabled={q2Cooldown > 0 || q2Answer === 'stack_order'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'stack_order'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Straturile superioare le acoperă pe cele inferioare: dacă pui stratul opac de relief în vârf, el va ascunde drumurile și râurile de dedesubt'
                : 'B. Top layers draw over bottom ones: placing an opaque relief layer on top hides roads, rivers, and cities below it'}
            </button>

            <button
              onClick={() => handleAnswerQ2('order_reverse')}
              disabled={q2Cooldown > 0 || q2Answer === 'stack_order'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'order_reverse'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. Ordinea influențează doar greutatea fișierului în kiloocteți'
                : 'C. Order only affects disk file size in kilobytes'}
            </button>

            <button
              onClick={() => handleAnswerQ2('order_wrong4')}
              disabled={q2Cooldown > 0 || q2Answer === 'stack_order'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'order_wrong4'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'D. Straturile de sus se șterg automat dacă dai clic pe ecran'
                : 'D. Upper layers automatically delete themselves when clicked on screen'}
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
                <>3. În ce situație practică este util să reducem <strong className="text-amber-300">opacitatea (la 50-70%)</strong> a unui strat GIS?</>
              ) : (
                <>3. When is it practically useful to lower <strong className="text-amber-300">opacity (to 50-70%)</strong> on a GIS layer?</>
              )}
            </div>
            {q3Answer === 'transparency_blend' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ3('transparency_blend')}
              disabled={q3Cooldown > 0 || q3Answer === 'transparency_blend'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'transparency_blend'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'A. Pentru a suprapune două fenomene (ex: o hartă semi-transparentă a inundațiilor sau a pădurilor peste curbele de nivel ale reliefului)'
                : 'A. To visually blend two phenomena (e.g., semi-transparent flood risk or forest zones over relief contour lines)'}
            </button>

            <button
              onClick={() => handleAnswerQ3('transp_wrong1')}
              disabled={q3Cooldown > 0 || q3Answer === 'transparency_blend'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'transp_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'B. Doar atunci când calculatorul rămâne fără conexiune la internet'
                : 'B. Only when the computer loses its internet connection'}
            </button>

            <button
              onClick={() => handleAnswerQ3('transp_wrong2')}
              disabled={q3Cooldown > 0 || q3Answer === 'transparency_blend'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'transp_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'C. Pentru a face textul complet ilizibil pentru elevi'
                : 'C. To intentionally make text illegible for students'}
            </button>

            <button
              onClick={() => handleAnswerQ3('transp_wrong3')}
              disabled={q3Cooldown > 0 || q3Answer === 'transparency_blend'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'transp_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              {lang === 'ro'
                ? 'D. Ca să economisim bateria ecranului prin afișarea culorii negre'
                : 'D. To conserve battery power by darkening the screen pixels'}
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
                  ? 'Toate răspunsurile sunt corecte! Poți trece la Nivelul 3.'
                  : 'All answers are correct! You can advance to Level 3.'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 3.'
                  : 'Answer all 3 questions correctly to unlock Level 3.'}
              </span>
            )}
          </div>

          <button
            onClick={handleFinish}
            disabled={!allAnsweredCorrectly}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-lg ${
              allAnsweredCorrectly
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-black shadow-teal-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{lang === 'ro' ? 'Continuă spre Nivelul 3' : 'Continue to Level 3'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
