import React, { useState, useEffect } from 'react';
import { MapPin, Route, Square, Table, Sparkles, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface G1Level3Props {
  onPass: (score: number) => void;
}

interface VectorFeature {
  id: string;
  nameRo: string;
  nameEn: string;
  type: 'point' | 'polyline' | 'polygon';
  coordinates: string;
  measureRo: string;
  measureEn: string;
  descriptionRo: string;
  descriptionEn: string;
  color: string;
}

const PRESET_FEATURES: VectorFeature[] = [
  {
    id: 'f1',
    nameRo: 'Vârful Moldoveanu',
    nameEn: 'Moldoveanu Peak',
    type: 'point',
    coordinates: '45°35′58″ N, 24°44′10″ E',
    measureRo: 'Alt: 2.544 m (0 km²)',
    measureEn: 'Elev: 2,544 m (0 km²)',
    descriptionRo: 'Punct topografic: cel mai înalt vârf din România (Munții Făgăraș)',
    descriptionEn: 'Topographic point: the highest peak in Romania (Făgăraș Mountains)',
    color: '#f59e0b'
  },
  {
    id: 'f2',
    nameRo: 'Cursul Râului Olt',
    nameEn: 'Olt River Course',
    type: 'polyline',
    coordinates: 'Izvor Hășmaș -> Vărsare Dunăre (Turnu Măgurele)',
    measureRo: 'Lungime: 615 km',
    measureEn: 'Length: 615 km',
    descriptionRo: 'Linie hidrografică: străbate Carpații prin Defileul Turnu Roșu',
    descriptionEn: 'Hydrographic polyline: traverses the Carpathians through Turnu Roșu Gorge',
    color: '#06b6d4'
  },
  {
    id: 'f3',
    nameRo: 'Parcul Național Retezat',
    nameEn: 'Retezat National Park',
    type: 'polygon',
    coordinates: 'Perimetru închis [45°22′N, 22°52′E ... 80 noduri]',
    measureRo: 'Suprafață: 381,38 km²',
    measureEn: 'Area: 381.38 km²',
    descriptionRo: 'Poligon protejat: peste 50 de lacuri glaciare și faună carpatică',
    descriptionEn: 'Protected polygon: over 50 glacial lakes and Carpathian wildlife reserve',
    color: '#10b981'
  }
];

export const G1Level3_SpatialDataVectors: React.FC<G1Level3Props> = ({ onPass }) => {
  const { lang } = useLanguage();

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
        nameRo: `Farul Sulina (Punct nou ${count})`,
        nameEn: `Sulina Lighthouse (New point ${count})`,
        type: 'point',
        coordinates: '45°09′36″ N, 29°39′35″ E',
        measureRo: 'Alt: 3 m (Coordonată unică)',
        measureEn: 'Elev: 3 m (Single coordinate)',
        descriptionRo: 'Punct de navigație maritim la vărsarea Dunării în Marea Neagră',
        descriptionEn: 'Maritime navigation point at the mouth of the Danube into the Black Sea',
        color: '#f59e0b'
      };
      setFeatures((prev) => [...prev, newPt]);
      setSelectedFeatureId(newPt.id);
    } else if (activeTool === 'polyline') {
      const newLine: VectorFeature = {
        id: `user_line_${count}`,
        nameRo: `Autostrada A2 Soarelui (Linie nouă ${count})`,
        nameEn: `A2 Sun Highway (New polyline ${count})`,
        type: 'polyline',
        coordinates: 'București -> Fetești -> Cernavodă -> Constanța',
        measureRo: 'Lungime: 202,8 km',
        measureEn: 'Length: 202.8 km',
        descriptionRo: 'Linie vectorială ce conectează capitala de țărmul Mării Negre',
        descriptionEn: 'Vector polyline connecting the capital to the Black Sea coast',
        color: '#06b6d4'
      };
      setFeatures((prev) => [...prev, newLine]);
      setSelectedFeatureId(newLine.id);
    } else {
      const newPoly: VectorFeature = {
        id: `user_poly_${count}`,
        nameRo: `Lacul Vidraru (Poligon nou ${count})`,
        nameEn: `Lake Vidraru (New polygon ${count})`,
        type: 'polygon',
        coordinates: 'Contur închis râu Argeș [45°22′N, 24°37′E]',
        measureRo: 'Suprafață: 8,93 km² • Vol: 465 mil m³',
        measureEn: 'Area: 8.93 km² • Vol: 465M m³',
        descriptionRo: 'Poligon cu suprafață și perimetru: lac de acumulare antropic',
        descriptionEn: 'Polygon with surface area and perimeter: artificial reservoir lake',
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
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Cele trei tipuri fundamentale de date vectoriale spațiale sunt: Punct (Point), Linie (Polyline / Line) și Poligon (Polygon / Area).'
          : 'Incorrect! The three fundamental vector spatial geometry types are: Point, Line (Polyline), and Polygon (Area).'
      );
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
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Un râu sau o autostradă are o lungime continuă și un traseu șerpuit compus din sute de coordonate conectate. De aceea se reprezintă printr-o linie (Polyline), în timp ce un punct are o singură pereche de coordonate.'
          : 'Incorrect! A river or highway has continuous length and winding turns composed of chained coordinate vertices. Therefore it is represented as a Polyline, whereas a Point holds a single coordinate pair.'
      );
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
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Un poligon este o buclă închisă (unde primul punct coincide cu ultimul) și permite calcularea automată a suprafeței (ex: în hectare sau km²) și a perimetrului.'
          : 'Incorrect! A polygon is a closed loop (start node connects back to end node) that allows automatic computation of surface area (hectares or sq km) and perimeter.'
      );
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
                  {lang === 'ro' ? 'Nivelul 3 • Unitatea 3B (Manual pag. 57–63)' : 'Level 3 • Unit 3B (Textbook pp. 57–63)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {lang === 'ro' ? 'Vectori: Punct, Linie, Poligon' : 'Vectors: Point, Polyline, Polygon'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {lang === 'ro'
                  ? 'Date Spațiale Vectoriale vs Date Atribut Descriptive'
                  : 'Vector Spatial Geometries vs Descriptive Attribute Data'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>
              {lang === 'ro' ? `${features.length} Obiecte Cartate` : `${features.length} Mapped Features`}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          {lang === 'ro' ? (
            <>
              În orice sistem GIS, lumea reală este tradusă digital prin 3 forme geometrice vectoriale simple: <strong className="text-amber-300">PUNCT (Point)</strong>, <strong className="text-cyan-300">LINIE (Polyline)</strong> și <strong className="text-emerald-300">POLIGON (Polygon)</strong>. Fiecare geometrie este legată indisolubil de un <strong className="text-white">Tabel de Atribute</strong> care descrie ce reprezintă acel element.
            </>
          ) : (
            <>
              In any GIS, the real world is digitized through 3 fundamental vector geometries: <strong className="text-amber-300">POINT</strong>, <strong className="text-cyan-300">POLYLINE</strong>, and <strong className="text-emerald-300">POLYGON</strong>. Every spatial geometry is tied directly to an <strong className="text-white">Attribute Table</strong> defining its properties.
            </>
          )}
        </p>
      </div>

      {/* Simulator: Vector Geometry Creator & Live Attribute Table */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              {lang === 'ro' ? 'Editor Vectorial GIS & Bază de Date Relațională' : 'GIS Vector Editor & Relational Attribute DB'}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
              {lang === 'ro' ? 'Instrumente de Desenare Vectorială & Sincronizare cu Tabelul' : 'Vector Drawing Tools & Table Synchronization'}
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
              <span>{lang === 'ro' ? '1. Punct (Point)' : '1. Point'}</span>
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
              <span>{lang === 'ro' ? '2. Linie (Polyline)' : '2. Polyline'}</span>
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
              <span>{lang === 'ro' ? '3. Poligon (Area)' : '3. Polygon'}</span>
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
              {lang === 'ro' ? 'Instrument selectat:' : 'Selected Tool:'}{' '}
              <strong className="text-white font-mono uppercase">
                {activeTool === 'point'
                  ? (lang === 'ro' ? 'Punct (Coordonată unică X, Y)' : 'Point (Single X, Y coordinate)')
                  : activeTool === 'polyline'
                  ? (lang === 'ro' ? 'Linie (Noduri conectate fără arie)' : 'Polyline (Connected vertices without area)')
                  : (lang === 'ro' ? 'Poligon (Contur închis cu suprafață)' : 'Polygon (Closed loop with surface area)')}
              </strong>
            </span>
          </div>

          <button
            onClick={handleAddFeature}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ro' ? 'Adaugă element pe hartă' : 'Add feature to map'}</span>
          </button>
        </div>

        {/* Visual Vector Grid & Map Canvas */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border-2 border-teal-500/30 relative min-h-[220px] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
            <span>{lang === 'ro' ? 'CANVAS VECTORIAL GIS' : 'GIS VECTOR CANVAS'}</span>
            <span className="text-teal-400">
              {lang === 'ro' ? 'Clic pe orice element pentru detalii' : 'Click any feature for details'}
            </span>
          </div>

          {/* Visual representations of vector features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 relative z-10">
            {features.map((feat) => {
              const isSelected = selectedFeatureId === feat.id;
              const name = lang === 'ro' ? feat.nameRo : feat.nameEn;
              const measure = lang === 'ro' ? feat.measureRo : feat.measureEn;
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
                      <span className="text-xs font-bold text-white truncate font-sans">{name}</span>
                    </div>
                    {features.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFeature(feat.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 transition cursor-pointer p-0.5"
                        title={lang === 'ro' ? 'Șterge element' : 'Delete feature'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-slate-300">
                    <div className="text-slate-400 truncate">{feat.coordinates}</div>
                    <div className="text-teal-300 font-bold mt-0.5">{measure}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-mono text-slate-500 relative z-10 border-t border-slate-900 pt-2 flex items-center justify-between">
            <span>{lang === 'ro' ? 'Tipuri active: Puncte, Linii, Poligoane' : 'Active types: Points, Polylines, Polygons'}</span>
            <span className="text-amber-400">
              {lang === 'ro'
                ? `Total: ${features.length} înregistrări în baza de date`
                : `Total: ${features.length} records in database`}
            </span>
          </div>
        </div>

        {/* Real-time Attribute Table View */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-cyan-400" />
              {lang === 'ro'
                ? 'TABELUL DE ATRIBUTE ASOCIAT HĂRȚII (Attribute Table)'
                : 'ASSOCIATED MAP ATTRIBUTE TABLE'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {lang === 'ro' ? 'Sincronizat bidirecțional' : 'Bidirectionally synchronized'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">{lang === 'ro' ? 'Denumire Element' : 'Feature Name'}</th>
                  <th className="p-2.5">{lang === 'ro' ? 'Tip Geometrie' : 'Geometry Type'}</th>
                  <th className="p-2.5">{lang === 'ro' ? 'Coordonate / Traseu' : 'Coordinates / Path'}</th>
                  <th className="p-2.5">{lang === 'ro' ? 'Măsurătoare' : 'Measurement'}</th>
                  <th className="p-2.5">{lang === 'ro' ? 'Descriere Atribut' : 'Attribute Description'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {features.map((feat) => {
                  const isSelected = selectedFeatureId === feat.id;
                  const name = lang === 'ro' ? feat.nameRo : feat.nameEn;
                  const measure = lang === 'ro' ? feat.measureRo : feat.measureEn;
                  const desc = lang === 'ro' ? feat.descriptionRo : feat.descriptionEn;
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
                        {name}
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
                      <td className="p-2.5 text-teal-300 font-bold">{measure}</td>
                      <td className="p-2.5 text-slate-400 font-sans text-[11px] max-w-[220px] truncate">
                        {desc}
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
            {lang === 'ro' ? 'Verificare Noțiuni • Punct, Linie, Poligon' : 'Concepts Check • Point, Polyline, Polygon'}
          </span>
          <h2 className="text-lg font-black text-white font-heading mt-0.5">
            {lang === 'ro'
              ? 'Răspunde corect la cele 3 cerințe pentru a debloca Nivelul 4'
              : 'Answer all 3 questions correctly to unlock Level 4'}
          </h2>
        </div>

        {/* Question 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-white">
              {lang === 'ro' ? (
                <>1. Care sunt cele <strong className="text-teal-300">trei forme geometrice vectoriale fundamentale</strong> utilizate în cartografia GIS?</>
              ) : (
                <>1. What are the <strong className="text-teal-300">three fundamental vector geometry primitives</strong> in GIS mapping?</>
              )}
            </div>
            {q1Answer === 'point_line_poly' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
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
              {lang === 'ro'
                ? 'A. Punct (Point), Linie (Polyline) și Poligon (Polygon / Area)'
                : 'A. Point, Line (Polyline), and Polygon (Area)'}
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
              {lang === 'ro' ? 'B. Cerc, Triunghi și Cub 3D' : 'B. Circle, Triangle, and 3D Cube'}
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
              {lang === 'ro' ? 'C. Text, Muzică și Fișier Video MP4' : 'C. Text, Music, and MP4 Video File'}
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
              {lang === 'ro'
                ? 'D. Doar pixeli colorați individual, fără formule matematice'
                : 'D. Only individual colored raster pixels without mathematical vector definitions'}
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
                <>2. De ce este necesar să reprezentăm un râu (precum Oltul sau Dunărea) printr-o <strong className="text-cyan-300">Linie (Polyline)</strong> și nu printr-un simplu Punct?</>
              ) : (
                <>2. Why must a river (such as the Olt or Danube) be modeled as a <strong className="text-cyan-300">Polyline</strong> rather than a simple Point?</>
              )}
            </div>
            {q2Answer === 'river_polyline' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
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
              {lang === 'ro' ? 'A. Pentru că punctele nu pot fi vopsite cu culoarea albastră' : 'A. Because points cannot be styled with blue color'}
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
              {lang === 'ro'
                ? 'B. Râul are o lungime continuă și un traseu șerpuit compus dintr-o serie de puncte conectate; un punct are doar o singură coordonată fixă'
                : 'B. The river has continuous length and winding geometry made of connected vertices; a point has only a single coordinate pair'}
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
              {lang === 'ro' ? 'C. Râurile nu au coordonate geografice în realitate' : 'C. Rivers do not have geographical coordinates in reality'}
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
              {lang === 'ro' ? 'D. Doar autostrăzile se pot desena cu puncte, râurile niciodată' : 'D. Only motorways can be drawn with points, never rivers'}
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
                <>3. Ce proprietate geometrică unică deține un <strong className="text-emerald-300">Poligon</strong> comparativ cu un Punct sau o Linie?</>
              ) : (
                <>3. What unique geometric property distinguishes a <strong className="text-emerald-300">Polygon</strong> from a Point or Polyline?</>
              )}
            </div>
            {q3Answer === 'polygon_area' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
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
              {lang === 'ro'
                ? 'A. Poligonul nu are margini și se întinde la infinit pe tot ecranul'
                : 'A. A polygon has no boundaries and extends infinitely across the screen'}
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
              {lang === 'ro'
                ? 'B. Este un contur închis cu suprafață bidimensională (km², hectare) și perimetru (ex: un parc național sau un lac)'
                : 'B. It is an enclosed boundary possessing 2D surface area (sq km, hectares) and perimeter (e.g. national park, lake)'}
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
              {lang === 'ro' ? 'C. Poligonul poate conține doar numere întregi negative' : 'C. A polygon can only contain negative integers'}
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
              {lang === 'ro'
                ? 'D. Poligoanele nu pot fi salvate niciodată într-un tabel de date'
                : 'D. Polygons can never be stored inside a database table'}
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
                  ? 'Toate răspunsurile sunt corecte! Poți trece la Nivelul 4.'
                  : 'All answers are correct! You can advance to Level 4.'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde corect la cele 3 întrebări pentru a debloca Nivelul 4.'
                  : 'Answer all 3 questions correctly to unlock Level 4.'}
              </span>
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
            <span>{lang === 'ro' ? 'Continuă spre Nivelul 4' : 'Continue to Level 4'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
