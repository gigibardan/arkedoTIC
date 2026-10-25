import React, { useState, useEffect } from 'react';
import { Layers, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles, CheckCircle2, AlertTriangle, Mountain, Waves, Car, Building2, Trees, Sliders } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface G1Level2Props {
  onPass: (score: number) => void;
}

interface GisLayer {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  visible: boolean;
  opacity: number; // 0 to 100
  isOpaqueBackground?: boolean;
}

const INITIAL_LAYERS: GisLayer[] = [
  {
    id: 'settlements',
    name: 'Așezări Urbane & Orașe',
    description: 'Puncte și etichete: București, Cluj-Napoca, Timișoara, Iași, Constanța, Brașov',
    icon: '🏙️',
    color: 'from-amber-500 to-yellow-600',
    visible: true,
    opacity: 100
  },
  {
    id: 'roads',
    name: 'Infrastructură Rutieră & Autostrăzi',
    description: 'Linii vectoriale: A1, A2 Soarelui, A3 Transilvania, Căi Ferate CFR',
    icon: '🛣️',
    color: 'from-rose-500 to-red-600',
    visible: true,
    opacity: 100
  },
  {
    id: 'protected',
    name: 'Arii Protejate & Păduri',
    description: 'Poligoane: Parcul Național Retezat, Parcul Național Călimani, Delta Dunării',
    icon: '🌲',
    color: 'from-emerald-500 to-green-600',
    visible: true,
    opacity: 80
  },
  {
    id: 'hydro',
    name: 'Rețea Hidrografică (Râuri & Lacuri)',
    description: 'Fluviul Dunărea, Olt, Mureș, Siret, Prut, Lacul Vidraru, Lacul Bicaz',
    icon: '🌊',
    color: 'from-cyan-500 to-blue-600',
    visible: true,
    opacity: 90
  },
  {
    id: 'relief',
    name: 'Relief & Model Digital de Altitudine (DEM)',
    description: 'Strat de bază topografic: Munții Carpați, Podișuri, Dealuri și Câmpii',
    icon: '🏔️',
    color: 'from-stone-600 to-slate-800',
    visible: true,
    opacity: 100,
    isOpaqueBackground: true
  }
];

export const G1Level2_LayersAndStacking: React.FC<G1Level2Props> = ({ onPass }) => {
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
      setQ1ErrorMsg('Incorect! Straturile GIS (Layers) funcționează precum niște foi transparente suprapuse: fiecare strat conține un singur tip omogen de date (ex: doar râurile sau doar drumurile), iar utilizatorul le poate activa, dezactiva și rearanja liber.');
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
      setQ2ErrorMsg('Incorect! Ordinea de suprapunere este esențială: stratul opac de fundal (relieful) trebuie să fie așezat la baza stivei. Dacă îl muți în vârf cu opacitate 100%, el va acoperi și ascunde toate drumurile, râurile și orașele aflate dedesubt!');
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
      setQ3ErrorMsg('Incorect! Reglarea opacității (transparenței) permite combinarea vizuală a două straturi diferite (ex: o zonă de pădure semi-transparentă afișată peste curbele de nivel ale muntelui).');
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
                  Nivelul 2 • Unitatea 3B (Manual pag. 57–63)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                  Straturi Tematice (Layers)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                Modelul Straturilor Tematice: Suprapunere, Vizibilitate & Opacitate
              </h1>
            </div>
          </div>
          <button
            onClick={handleResetStack}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-300 text-xs font-mono border border-teal-500/30 transition cursor-pointer"
          >
            ↺ Reinițializează Stiva
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          Spre deosebire de o hartă desenată pe o singură foaie, un sistem GIS organizează informația pe <strong className="text-teal-300">straturi tematice independente (Layers)</strong>. Gândește-te la ele ca la niște folii de plastic transparente: poți ascunde stratul drumurilor dacă vrei să studiezi doar râurile sau poți ajusta transparența pentru a vedea relieful de sub pădure.
        </p>
      </div>

      {/* Simulator: Layer Stack Manager & Interactive Map Compositor */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Simulator de Stivă Cartografică • Compoziție Multi-Strat
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              Panoul de Administrare a Straturilor (Layer Manager)
            </h2>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>{layers.filter((l) => l.visible).length} din {layers.length} straturi vizibile</span>
          </div>
        </div>

        {/* Warning if Relief is blocking layers below */}
        {isReliefBlocking && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/60 border-2 border-amber-500 text-amber-200 text-xs flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="block font-bold">Atenție: Stratul opac de Relief blochează straturile de sub el!</strong>
              <span>
                Relieful este poziționat mai sus în stivă decât drumurile sau râurile. Deoarece are opacitate de 100%, el ascunde elementele dedesubt. Mută Relieful la baza stivei (jos) sau scade-i opacitatea!
              </span>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Layer Manager Stack (5 layers with Up/Down & Visibility Controls) */}
          <div className="lg:col-span-6 space-y-2.5">
            <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between px-1">
              <span>ORDINEA DE DESENARE (SUS = VÂRFUL HĂRȚII)</span>
              <span className="text-[10px] text-slate-500">Mută ordinea cu săgețile</span>
            </div>

            {layers.map((layer, index) => {
              const isSelected = selectedLayerId === layer.id;
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
                          {layer.name}
                        </span>
                        {layer.isOpaqueBackground && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px] font-mono shrink-0">
                            Strat Bază
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        Opacitate: {layer.opacity}% • {layer.visible ? 'Vizibil' : 'Ascuns'}
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
                      title={layer.visible ? 'Ascunde stratul' : 'Afișează stratul'}
                    >
                      {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Move Up */}
                    <button
                      onClick={() => moveLayerUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      title="Mută mai sus în stivă"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveLayerDown(index)}
                      disabled={index === layers.length - 1}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      title="Mută mai jos în stivă"
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
                  Reglaj Transparență pentru: <strong className="text-white">{selectedLayer.name}</strong>
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
                <span>10% (Foarte transparent)</span>
                <span>100% (Complet opac)</span>
              </div>
            </div>
          </div>

          {/* Right: Real-time Composed Map Canvas Preview */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950 border-2 border-teal-500/30 rounded-2xl p-4 shadow-inner">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
                <span className="text-teal-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Previzualizare Rezultat GIS Compus
                </span>
                <span className="text-slate-400">Scară Națională</span>
              </div>

              {/* Graphic Representation of the Composed Layers */}
              <div className="relative mt-3 rounded-xl min-h-[300px] border border-slate-800 overflow-hidden flex flex-col justify-center items-center p-4 bg-slate-900">
                {/* Visual rendering of layers according to their order in array */}
                {/* Background grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Layer Visuals stacked */}
                {layers.slice().reverse().map((layer) => {
                  if (!layer.visible) return null;
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
                          <strong className="text-white block font-sans">{layer.name}</strong>
                          <span className="text-[10px] text-slate-300 font-mono">{layer.description}</span>
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
                    ⚠️ Toate straturile sunt ascunse! Activează cel puțin un strat din panoul din stânga.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span className="text-teal-400">💡 Principiu GIS:</span>
              <span className="text-right">Straturile superioare se desenează peste cele inferioare.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quiz Questions with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Evaluare Formatibilă • Straturi & Suprapunere
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 3
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              1. Cum funcționează modelul <strong className="text-teal-300">straturilor tematice (Layers)</strong> într-un sistem GIS?
            </div>
            {q1Answer === 'transparent_sheets' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Toate datele geografice sunt lipite într-o singură imagine indivizibilă
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
              B. Precum foi transparente suprapuse: fiecare strat conține un tip omogen de date și poate fi activat, ascuns sau reordonat independent
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
              C. Straturile sunt fișiere audio care rulează muzică de fundal în timp ce privim harta
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
              D. Fiecare strat poate fi deschis doar într-o altă zi a săptămânii
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
              2. De ce este importantă <strong className="text-cyan-300">ordinea straturilor în stivă</strong> (de sus în jos)?
            </div>
            {q2Answer === 'stack_order' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Ordinea nu contează deloc; toate elementele sunt transparente 100% automat
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
              B. Straturile superioare le acoperă pe cele inferioare: dacă pui stratul opac de relief în vârf, el va ascunde drumurile și râurile de dedesubt
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
              C. Ordinea influențează doar greutatea fișierului în kiloocteți
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
              D. Straturile de sus se șterg automat dacă dai clic pe ecran
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
              3. În ce situație practică este util să reducem <strong className="text-amber-300">opacitatea (la 50-70%)</strong> a unui strat GIS?
            </div>
            {q3Answer === 'transparency_blend' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
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
              A. Pentru a suprapune două fenomene (ex: o hartă semi-transparentă a inundațiilor sau a pădurilor peste curbele de nivel ale reliefului)
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
              B. Doar atunci când calculatorul rămâne fără conexiune la internet
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
              C. Pentru a face textul complet ilizibil pentru elevi
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
              D. Ca să economisim bateria ecranului prin afișarea culorii negre
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
                Toate răspunsurile sunt corecte! Poți trece la Nivelul 3.
              </span>
            ) : (
              <span>Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 3.</span>
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
            <span>Continuă spre Nivelul 3</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
