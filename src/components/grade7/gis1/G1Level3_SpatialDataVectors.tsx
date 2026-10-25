import React, { useState, useEffect } from 'react';
import { MousePointer, MapPin, Route, Square, Database, Table, Sparkles, CheckCircle2, AlertTriangle, Plus, Trash2, Eye } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface G1Level3Props {
  onPass: (score: number) => void;
}

interface VectorFeature {
  id: string;
  name: string;
  type: 'point' | 'polyline' | 'polygon';
  coordinates: string;
  measure: string;
  description: string;
  color: string;
}

const PRESET_FEATURES: VectorFeature[] = [
  {
    id: 'f1',
    name: 'Vârful Moldoveanu',
    type: 'point',
    coordinates: '45°35′58″ N, 24°44′10″ E',
    measure: 'Alt: 2.544 m (0 km²)',
    description: 'Punct topografic: cel mai înalt vârf din România (Munții Făgăraș)',
    color: '#f59e0b'
  },
  {
    id: 'f2',
    name: 'Cursul Râului Olt',
    type: 'polyline',
    coordinates: 'Izvor Hășmaș -> Vărsare Dunăre (Turnu Măgurele)',
    measure: 'Lungime: 615 km',
    description: 'Linie hidrografică: străbate Carpații prin Defileul Turnu Roșu',
    color: '#06b6d4'
  },
  {
    id: 'f3',
    name: 'Parcul Național Retezat',
    type: 'polygon',
    coordinates: 'Perimetru închis [45°22′N, 22°52′E ... 80 noduri]',
    measure: 'Suprafață: 381,38 km²',
    description: 'Poligon protejat: peste 50 de lacuri glaciare și faună carpatică',
    color: '#10b981'
  }
];

export const G1Level3_SpatialDataVectors: React.FC<G1Level3Props> = ({ onPass }) => {
  // Simulator State
  const [activeTool, setActiveTool] = useState<'point' | 'polyline' | 'polygon'>('point');
  const [features, setFeatures] = useState<VectorFeature[]>(PRESET_FEATURES);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('f1');
  const [userCreatedCount, setUserCreatedCount] = useState<number>(0);

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

  // Cooldown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ2Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ3Cooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Add custom vector entity based on active tool
  const handleAddFeature = () => {
    sounds.playClick();
    const count = userCreatedCount + 1;
    setUserCreatedCount(count);

    if (activeTool === 'point') {
      const newPt: VectorFeature = {
        id: `user_pt_${count}`,
        name: `Farul Sulina (Punct nou ${count})`,
        type: 'point',
        coordinates: '45°09′36″ N, 29°39′35″ E',
        measure: 'Alt: 3 m (Coordonată unică)',
        description: 'Punct de navigație maritim la vărsarea Dunării în Marea Neagră',
        color: '#f59e0b'
      };
      setFeatures((prev) => [...prev, newPt]);
      setSelectedFeatureId(newPt.id);
    } else if (activeTool === 'polyline') {
      const newLine: VectorFeature = {
        id: `user_line_${count}`,
        name: `Autostrada A2 Soarelui (Linie nouă ${count})`,
        type: 'polyline',
        coordinates: 'București -> Fetești -> Cernavodă -> Constanța',
        measure: 'Lungime: 202,8 km',
        description: 'Linie vectorială ce conectează capitala de țărmul Mării Negre',
        color: '#06b6d4'
      };
      setFeatures((prev) => [...prev, newLine]);
      setSelectedFeatureId(newLine.id);
    } else {
      const newPoly: VectorFeature = {
        id: `user_poly_${count}`,
        name: `Lacul Vidraru (Poligon nou ${count})`,
        type: 'polygon',
        coordinates: 'Contur închis râu Argeș [45°22′N, 24°37′E]',
        measure: 'Suprafață: 8,93 km² • Vol: 465 mil m³',
        description: 'Poligon cu suprafață și perimetru: lac de acumulare antropic',
        color: '#10b981'
      };
      setFeatures((prev) => [...prev, newPoly]);
      setSelectedFeatureId(newPoly.id);
    }
  };

  const handleDeleteFeature = (id: string) => {
    sounds.playClick();
    if (features.length <= 1) return;
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    if (selectedFeatureId === id) {
      setSelectedFeatureId(features[0].id);
    }
  };

  // Q1 Check: What are the 3 vector geometry types in GIS?
  const handleAnswerQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    if (val === 'point_line_poly') {
      sounds.playCorrect();
      setQ1Answer(val);
      setQ1ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ1Answer(val);
      setQ1Cooldown(5);
      setQ1ErrorMsg('Incorect! Cele trei tipuri fundamentale de date vectoriale spațiale sunt: Punct (Point), Linie (Polyline / Line) și Poligon (Polygon / Area).');
    }
  };

  // Q2 Check: Why does a river need a Polyline and not a Point?
  const handleAnswerQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    if (val === 'river_polyline') {
      sounds.playCorrect();
      setQ2Answer(val);
      setQ2ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ2Answer(val);
      setQ2Cooldown(5);
      setQ2ErrorMsg('Incorect! Un râu sau o autostradă are o lungime continuă și un traseu șerpuit compus din sute de coordonate conectate. De aceea se reprezintă printr-o linie (Polyline), în timp ce un punct are o singură pereche de coordonate.');
    }
  };

  // Q3 Check: What characterizes a Polygon?
  const handleAnswerQ3 = (val: string) => {
    if (q3Cooldown > 0) return;
    if (val === 'polygon_area') {
      sounds.playCorrect();
      setQ3Answer(val);
      setQ3ErrorMsg('');
    } else {
      sounds.playWrong();
      setQ3Answer(val);
      setQ3Cooldown(5);
      setQ3ErrorMsg('Incorect! Un poligon este o buclă închisă (unde primul punct coincide cu ultimul) și permite calcularea automată a suprafeței (ex: în hectare sau km²) și a perimetrului.');
    }
  };

  const allAnsweredCorrectly = q1Answer === 'point_line_poly' && q2Answer === 'river_polyline' && q3Answer === 'polygon_area';

  const handleFinish = () => {
    if (allAnsweredCorrectly) {
      sounds.playSuccess();
      setIsPassed(true);
      onPass(100);
    }
  };

  const selectedFeature = features.find((f) => f.id === selectedFeatureId) || features[0];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-emerald-950/80 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg text-2xl">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold uppercase">
                  Nivelul 3 • Unitatea 3B (Manual pag. 57–63)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  Vectori: Punct, Linie, Poligon
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                Date Spațiale Vectoriale vs Date Atribut Descriptive
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>{features.length} Obiecte Cartate</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          În orice sistem GIS, lumea reală este tradusă digital prin 3 forme geometrice vectoriale simple: <strong className="text-amber-300">PUNCT (Point)</strong>, <strong className="text-cyan-300">LINIE (Polyline)</strong> și <strong className="text-emerald-300">POLIGON (Polygon)</strong>. Fiecare geometrie este legată indisolubil de un <strong className="text-white">Tabel de Atribute</strong> care descrie ce reprezintă acel element.
        </p>
      </div>

      {/* Simulator: Vector Geometry Creator & Live Attribute Table */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Editor Vectorial GIS & Bază de Date Relațională
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              Instrumente de Desenare Vectorială & Sincronizare cu Tabelul
            </h2>
          </div>

          {/* Geometry Selector Tools */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTool('point');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTool === 'point'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>1. Punct (Point)</span>
            </button>
            <button
              onClick={() => {
                setActiveTool('polyline');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTool === 'polyline'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>2. Linie (Polyline)</span>
            </button>
            <button
              onClick={() => {
                setActiveTool('polygon');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTool === 'polygon'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>3. Poligon (Area)</span>
            </button>
          </div>
        </div>

        {/* Action button to create entity on canvas */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <span className="text-xl">
              {activeTool === 'point' ? '📍' : activeTool === 'polyline' ? '〰️' : '🟩'}
            </span>
            <span>
              Instrument selectat:{' '}
              <strong className="text-white font-mono uppercase">
                {activeTool === 'point' ? 'Punct (Coordonată unică X, Y)' : activeTool === 'polyline' ? 'Linie (Noduri conectate fără arie)' : 'Poligon (Contur închis cu suprafață)'}
              </strong>
            </span>
          </div>

          <button
            onClick={handleAddFeature}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Adaugă element pe hartă</span>
          </button>
        </div>

        {/* Visual Vector Grid & Map Canvas */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border-2 border-teal-500/30 relative min-h-[220px] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
            <span>CANVAS VECTORIAL GIS</span>
            <span className="text-teal-400">Clic pe orice element pentru detalii</span>
          </div>

          {/* Visual representations of vector features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 relative z-10">
            {features.map((feat) => {
              const isSelected = selectedFeatureId === feat.id;
              return (
                <div
                  key={feat.id}
                  onClick={() => {
                    setSelectedFeatureId(feat.id);
                    sounds.playClick();
                  }}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-teal-400 shadow-lg ring-1 ring-teal-400/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {feat.type === 'point' && <MapPin className="w-4 h-4 text-amber-400" />}
                      {feat.type === 'polyline' && <Route className="w-4 h-4 text-cyan-400" />}
                      {feat.type === 'polygon' && <Square className="w-4 h-4 text-emerald-400" />}
                      <span className="text-xs font-bold text-white truncate font-sans">{feat.name}</span>
                    </div>
                    {features.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFeature(feat.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 transition cursor-pointer p-0.5"
                        title="Șterge element"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-slate-300">
                    <div className="text-slate-400 truncate">{feat.coordinates}</div>
                    <div className="text-teal-300 font-bold mt-0.5">{feat.measure}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-mono text-slate-500 relative z-10 border-t border-slate-900 pt-2 flex items-center justify-between">
            <span>Tipuri active: Puncte, Linii, Poligoane</span>
            <span className="text-amber-400">Total: {features.length} înregistrări în baza de date</span>
          </div>
        </div>

        {/* Real-time Attribute Table View */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-cyan-400" />
              TABELUL DE ATRIBUTE ASOCIAT HĂRȚII (Attribute Table)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Sincronizat bidirecțional</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Denumire Element</th>
                  <th className="p-2.5">Tip Geometrie</th>
                  <th className="p-2.5">Coordonate / Traseu</th>
                  <th className="p-2.5">Măsurătoare</th>
                  <th className="p-2.5">Descriere Atribut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {features.map((feat) => {
                  const isSelected = selectedFeatureId === feat.id;
                  return (
                    <tr
                      key={feat.id}
                      onClick={() => {
                        setSelectedFeatureId(feat.id);
                        sounds.playClick();
                      }}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-teal-950/50 text-white font-bold' : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <td className="p-2.5 text-slate-500">{feat.id}</td>
                      <td className="p-2.5 font-sans font-medium text-white flex items-center gap-1.5">
                        {feat.type === 'point' && '📍'}
                        {feat.type === 'polyline' && '〰️'}
                        {feat.type === 'polygon' && '🟩'}
                        {feat.name}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            feat.type === 'point'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : feat.type === 'polyline'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {feat.type}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 text-[11px] max-w-[180px] truncate">{feat.coordinates}</td>
                      <td className="p-2.5 text-teal-300 font-bold">{feat.measure}</td>
                      <td className="p-2.5 text-slate-400 font-sans text-[11px] max-w-[220px] truncate">
                        {feat.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3 Quiz Questions with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Verificare Noțiuni • Punct, Linie, Poligon
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            Răspunde corect la cele 3 cerințe pentru a debloca Nivelul 4
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              1. Care sunt cele <strong className="text-teal-300">trei forme geometrice vectoriale fundamentale</strong> utilizate în cartografia GIS?
            </div>
            {q1Answer === 'point_line_poly' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ1('point_line_poly')}
              disabled={q1Cooldown > 0 || q1Answer === 'point_line_poly'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'point_line_poly'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              A. Punct (Point), Linie (Polyline) și Poligon (Polygon / Area)
            </button>

            <button
              onClick={() => handleAnswerQ1('geom_wrong1')}
              disabled={q1Cooldown > 0 || q1Answer === 'point_line_poly'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'geom_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              B. Cerc, Triunghi și Cub 3D
            </button>

            <button
              onClick={() => handleAnswerQ1('geom_wrong2')}
              disabled={q1Cooldown > 0 || q1Answer === 'point_line_poly'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'geom_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              C. Text, Muzică și Fișier Video MP4
            </button>

            <button
              onClick={() => handleAnswerQ1('geom_wrong3')}
              disabled={q1Cooldown > 0 || q1Answer === 'point_line_poly'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q1Answer === 'geom_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              D. Doar pixeli colorați individual, fără formule matematice
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
              2. De ce este necesar să reprezentăm un râu (precum Oltul sau Dunărea) printr-o <strong className="text-cyan-300">Linie (Polyline)</strong> și nu printr-un simplu Punct?
            </div>
            {q2Answer === 'river_polyline' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ2('river_wrong1')}
              disabled={q2Cooldown > 0 || q2Answer === 'river_polyline'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'river_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              A. Pentru că punctele nu pot fi vopsite cu culoarea albastră
            </button>

            <button
              onClick={() => handleAnswerQ2('river_polyline')}
              disabled={q2Cooldown > 0 || q2Answer === 'river_polyline'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'river_polyline'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              B. Râul are o lungime continuă și un traseu șerpuit compus dintr-o serie de puncte conectate; un punct are doar o singură coordonată fixă
            </button>

            <button
              onClick={() => handleAnswerQ2('river_wrong2')}
              disabled={q2Cooldown > 0 || q2Answer === 'river_polyline'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'river_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              C. Râurile nu au coordonate geografice în realitate
            </button>

            <button
              onClick={() => handleAnswerQ2('river_wrong3')}
              disabled={q2Cooldown > 0 || q2Answer === 'river_polyline'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q2Answer === 'river_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              D. Doar autostrăzile se pot desena cu puncte, râurile niciodată
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
              3. Ce proprietate geometrică unică deține un <strong className="text-emerald-300">Poligon</strong> comparativ cu un Punct sau o Linie?
            </div>
            {q3Answer === 'polygon_area' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAnswerQ3('poly_wrong1')}
              disabled={q3Cooldown > 0 || q3Answer === 'polygon_area'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'poly_wrong1'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              A. Poligonul nu are margini și se întinde la infinit pe tot ecranul
            </button>

            <button
              onClick={() => handleAnswerQ3('polygon_area')}
              disabled={q3Cooldown > 0 || q3Answer === 'polygon_area'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'polygon_area'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              B. Este un contur închis cu suprafață bidimensională (km², hectare) și perimetru (ex: un parc național sau un lac)
            </button>

            <button
              onClick={() => handleAnswerQ3('poly_wrong2')}
              disabled={q3Cooldown > 0 || q3Answer === 'polygon_area'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'poly_wrong2'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              C. Poligonul poate conține doar numere întregi negative
            </button>

            <button
              onClick={() => handleAnswerQ3('poly_wrong3')}
              disabled={q3Cooldown > 0 || q3Answer === 'polygon_area'}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                q3Answer === 'poly_wrong3'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
              } disabled:cursor-not-allowed`}
            >
              D. Poligoanele nu pot fi salvate niciodată într-un tabel de date
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
                Toate răspunsurile sunt corecte! Poți trece la Nivelul 4.
              </span>
            ) : (
              <span>Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 4.</span>
            )}
          </div>

          <button
            onClick={handleFinish}
            disabled={!allAnsweredCorrectly}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-lg ${
              allAnsweredCorrectly
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black shadow-teal-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Continuă spre Nivelul 4</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
