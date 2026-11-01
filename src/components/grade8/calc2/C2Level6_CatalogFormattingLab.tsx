import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Calculator,
  Layers,
  Award,
  Play,
  RotateCcw,
  Sliders,
  Check,
  Flame,
  ListFilter
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface C2Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

interface CatalogEntry {
  id: number;
  name: string;
  gradeClass: string;
  thesis: number;
  oral: number;
  gpa: number;
}

export const C2Level6_CatalogFormattingLab: React.FC<C2Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Lab step toggles conforming to Textbook page 24-25
  const [isTitleMerged, setIsTitleMerged] = useState<boolean>(false);
  const [hasAllBorders, setHasAllBorders] = useState<boolean>(false);
  const [hasDoubleBottomTotal, setHasDoubleBottomTotal] = useState<boolean>(false);
  const [hasTwoDecimals, setHasTwoDecimals] = useState<boolean>(false);
  const [isMultiSorted, setIsMultiSorted] = useState<boolean>(false);

  // Table state
  const rawEntries: CatalogEntry[] = [
    { id: 1, name: 'Popescu Andrei', gradeClass: '8B', thesis: 10, oral: 9, gpa: 9.5 },
    { id: 2, name: 'Ionescu Maria', gradeClass: '8A', thesis: 9, oral: 8, gpa: 8.5 },
    { id: 3, name: 'Radu Elena', gradeClass: '8A', thesis: 10, oral: 10, gpa: 10.0 },
    { id: 4, name: 'Dumitru Vlad', gradeClass: '8B', thesis: 10, oral: 10, gpa: 10.0 },
    { id: 5, name: 'Stoica Bogdan', gradeClass: '8A', thesis: 8, oral: 9, gpa: 8.5 },
  ];

  const [catalog, setCatalog] = useState<CatalogEntry[]>(rawEntries);

  // Actions
  const handleToggleMergeTitle = () => {
    sounds.playCorrect();
    setIsTitleMerged(prev => !prev);
  };

  const handleApplyBorders = () => {
    sounds.playCorrect();
    setHasAllBorders(true);
    setHasDoubleBottomTotal(true);
  };

  const handleApplyDecimalsFormat = () => {
    sounds.playCorrect();
    setHasTwoDecimals(true);
  };

  const handleApplyMultiSort = () => {
    sounds.playCorrect();
    const sorted = [...catalog].sort((a, b) => {
      // 1. Class ascending (8A first, then 8B)
      const classComp = a.gradeClass.localeCompare(b.gradeClass);
      if (classComp !== 0) return classComp;
      // 2. GPA descending
      return b.gpa - a.gpa;
    });
    setCatalog(sorted);
    setIsMultiSorted(true);
  };

  const handleResetLab = () => {
    sounds.playClick();
    setIsTitleMerged(false);
    setHasAllBorders(false);
    setHasDoubleBottomTotal(false);
    setHasTwoDecimals(false);
    setIsMultiSorted(false);
    setCatalog(rawEntries);
  };

  // Evaluation criteria
  const criteriaPassed = [
    isTitleMerged,
    hasAllBorders,
    hasDoubleBottomTotal,
    hasTwoDecimals,
    isMultiSorted
  ].filter(Boolean).length;

  const totalScore = Math.min(100, Math.round((criteriaPassed / 5) * 100));
  const canProceed = criteriaPassed >= 4;

  const classAvg = (catalog.reduce((acc, c) => acc + c.gpa, 0) / catalog.length).toFixed(hasTwoDecimals ? 2 : 1);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-emerald-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 24–25 (Fișă de Laborator)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-teal-400" />
              Nivelul 6: Atelier Practic — Formatarea & Sortarea Catalogului
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Transformă un tabel brut de note într-un document școlar complet: unifică titlul (Merge & Center), fixează 2 zecimale, aplică borduri profesionale și ordonează elevii după Clasă și Medie!
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Modulul 1B</div>
            <div className="text-2xl font-black text-teal-400">6 / 7</div>
          </div>
        </div>
      </div>

      {/* Checklist of Objectives */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Obiective de Formatare & Sortare (Fișa Pag. 24)</h2>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
            <span className="text-slate-400">Progres Atelier:</span>
            <span className="text-emerald-400 font-black">{totalScore}%</span>
            <span className="text-slate-500">({criteriaPassed}/5 obiective)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            isTitleMerged ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">1.</span>
            <span>Merge & Center pe Titlu (A1:E1)</span>
            {isTitleMerged && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            hasTwoDecimals ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">2.</span>
            <span>Format Medii cu 2 Zecimale (.00)</span>
            {hasTwoDecimals && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            hasAllBorders ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">3.</span>
            <span>All Borders pe tot tabelul</span>
            {hasAllBorders && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            hasDoubleBottomTotal ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">4.</span>
            <span>Linie Dublă pe rândul Total/Medie</span>
            {hasDoubleBottomTotal && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            isMultiSorted ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">5.</span>
            <span>Sortare Clasă (A-Z) & Medie (Z-A)</span>
            {isMultiSorted && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>
        </div>
      </div>

      {/* Interactive Tool Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-300 font-bold">Unelte de Formatare & Sortare:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMergeTitle}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition border ${
                isTitleMerged
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
              }`}
            >
              1. {isTitleMerged ? '✓ Titlu Îmbinat' : 'Îmbină & Centrează Titlul'}
            </button>
            <button
              type="button"
              onClick={handleApplyDecimalsFormat}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition border ${
                hasTwoDecimals
                  ? 'bg-teal-500 text-slate-950 border-teal-400'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
              }`}
            >
              2. {hasTwoDecimals ? '✓ Format 2 Zecimale' : 'Setează 2 Zecimale'}
            </button>
            <button
              type="button"
              onClick={handleApplyBorders}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition border ${
                hasAllBorders
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
              }`}
            >
              3. {hasAllBorders ? '✓ Borduri Complete' : 'Aplică Borduri & Linie Dublă'}
            </button>
            <button
              type="button"
              onClick={handleApplyMultiSort}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition border ${
                isMultiSorted
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
              }`}
            >
              4. {isMultiSorted ? '✓ Sortat Multicriterial' : 'Sortare: Clasă + Medie'}
            </button>
            <button
              type="button"
              onClick={handleResetLab}
              className="px-2.5 py-1.5 rounded-xl bg-slate-850 text-slate-400 hover:text-white border border-slate-700 cursor-pointer text-xs"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Live Catalog Table */}
        <div className="border border-slate-700 rounded-2xl overflow-x-auto bg-slate-950 font-mono text-xs shadow-inner">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                <th className="p-2 border-r border-slate-800 w-12 bg-slate-850">◢</th>
                <th className="p-2 border-r border-slate-800 w-1/4">A</th>
                <th className="p-2 border-r border-slate-800 w-1/6">B</th>
                <th className="p-2 border-r border-slate-800 w-1/6">C</th>
                <th className="p-2 border-r border-slate-800 w-1/6">D</th>
                <th className="p-2 w-1/6">E</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Title Header */}
              <tr className="border-b border-slate-800 bg-emerald-950/40">
                <td className="p-2.5 border-r border-slate-800 bg-slate-900 text-slate-400 font-bold">1</td>
                {isTitleMerged ? (
                  <td
                    colSpan={5}
                    className="p-3 text-center font-black text-white text-sm bg-gradient-to-r from-emerald-900/40 via-teal-900/50 to-emerald-900/40 text-emerald-200 tracking-wider"
                  >
                    SITUAȚIA ȘCOLARĂ LA TIC — CLASELE A VIII-A (A1:E1 Îmbinat & Centrat)
                  </td>
                ) : (
                  <>
                    <td className="p-2.5 border-r border-slate-800 text-emerald-300 font-bold">SITUAȚIA</td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-500">ȘCOLARĂ</td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-500">TIC</td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-500">CLASA 8</td>
                    <td className="p-2.5 text-slate-500">2026</td>
                  </>
                )}
              </tr>

              {/* Row 2: Column Headers */}
              <tr className={`border-b ${hasAllBorders ? 'border-slate-600' : 'border-slate-800'} bg-slate-900 font-bold text-slate-200`}>
                <td className="p-2 border-r border-slate-800 bg-slate-900 text-slate-400 font-bold">2</td>
                <td className={`p-2.5 border-r ${hasAllBorders ? 'border-slate-600' : 'border-slate-800'} text-left pl-3`}>Nume & Prenume Elev</td>
                <td className={`p-2.5 border-r ${hasAllBorders ? 'border-slate-600' : 'border-slate-800'}`}>Clasa</td>
                <td className={`p-2.5 border-r ${hasAllBorders ? 'border-slate-600' : 'border-slate-800'}`}>Teză</td>
                <td className={`p-2.5 border-r ${hasAllBorders ? 'border-slate-600' : 'border-slate-800'}`}>Oral</td>
                <td className="p-2.5">Medie Finală</td>
              </tr>

              {/* Rows 3..7: Students Data */}
              {catalog.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className={`border-b ${
                    hasAllBorders ? 'border-slate-700/80' : 'border-slate-850'
                  } hover:bg-slate-800/30 transition ${
                    idx % 2 === 1 ? 'bg-slate-900/40' : ''
                  }`}
                >
                  <td className="p-2 border-r border-slate-850 bg-slate-900 text-slate-400 font-bold">{idx + 3}</td>
                  <td className={`p-2 text-left pl-3 text-white font-medium border-r ${hasAllBorders ? 'border-slate-700/80' : 'border-slate-850'}`}>
                    {entry.name}
                  </td>
                  <td className={`p-2 border-r ${hasAllBorders ? 'border-slate-700/80' : 'border-slate-850'}`}>
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      entry.gradeClass === '8A' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {entry.gradeClass}
                    </span>
                  </td>
                  <td className={`p-2 border-r ${hasAllBorders ? 'border-slate-700/80' : 'border-slate-850'} text-slate-300`}>
                    {entry.thesis}
                  </td>
                  <td className={`p-2 border-r ${hasAllBorders ? 'border-slate-700/80' : 'border-slate-850'} text-slate-300`}>
                    {entry.oral}
                  </td>
                  <td className="p-2 font-black text-amber-300 text-right pr-6">
                    {hasTwoDecimals ? entry.gpa.toFixed(2) : entry.gpa}
                  </td>
                </tr>
              ))}

              {/* Row 8: Accounting Total / Average */}
              <tr className={`font-black ${
                hasDoubleBottomTotal
                  ? 'border-t-2 border-slate-700 border-b-4 border-double border-b-slate-600 bg-emerald-950/40 text-emerald-200'
                  : 'border-t border-slate-800 bg-slate-900 text-slate-400'
              }`}>
                <td className="p-2.5 border-r border-slate-850 bg-slate-900 font-bold text-slate-500">8</td>
                <td colSpan={4} className="p-2.5 text-right pr-4 font-bold">
                  MEDIA GENERALĂ A GRUPELOR:
                </td>
                <td className="p-2.5 text-right pr-6 text-sm text-teal-300">
                  {classAvg}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={6}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
