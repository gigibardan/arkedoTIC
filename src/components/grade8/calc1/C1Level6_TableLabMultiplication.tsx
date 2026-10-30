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
  Check,
  Flame,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface C1Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C1Level6_TableLabMultiplication: React.FC<C1Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Lab step states conforming to Textbook page 18
  const [sheetName, setSheetName] = useState<string>('Foaie1');
  const [headers, setHeaders] = useState<{ a1: string; b1: string; c1: string }>({
    a1: '',
    b1: '',
    c1: '',
  });

  // Multiplication Table rows 1..10 (cells A2..A11, B2..B11, C2..C11)
  const [rowsData, setRowsData] = useState<{ factor1: number | ''; factor2: number | ''; formula: string; evaluated: number | null }[]>([
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
    { factor1: '', factor2: '', formula: '', evaluated: null },
  ]);

  // Table styling toggles
  const [isHeaderBold, setIsHeaderBold] = useState<boolean>(false);
  const [isHeaderFilled, setIsHeaderFilled] = useState<boolean>(false);
  const [hasBorders, setHasBorders] = useState<boolean>(false);

  // Active cell in the worksheet for user typing
  const [activeCellCoord, setActiveCellCoord] = useState<string>('A1');

  // Step 1: Sheet renamed to 'Tabla cu 6'
  const isSheetRenamed = sheetName.trim().toLowerCase() === 'tabla cu 6';

  // Step 2: Headers match 'Factor 1', 'Factor 2', 'Produs'
  const isHeadersSet = (
    headers.a1.trim().toLowerCase().includes('factor') &&
    headers.b1.trim().toLowerCase().includes('factor') &&
    headers.c1.trim().toLowerCase().includes('produs')
  );

  // Step 3: Factors 1..10 in A and 6 in B
  const isFactorsFilled = rowsData.every((r, idx) => r.factor1 === (idx + 1) && r.factor2 === 6);

  // Step 4: Formulas evaluated to 6, 12, 18, 24, 30, 36, 42, 48, 54, 60
  const isFormulasComplete = rowsData.every((r, idx) => r.evaluated === (idx + 1) * 6);

  // Step 5: Formatting applied
  const isFormatted = isHeaderBold && isHeaderFilled && hasBorders;

  // Calculate score based on completed criteria
  const criteriaPassed = [
    isSheetRenamed,
    isHeadersSet,
    isFactorsFilled,
    isFormulasComplete,
    isFormatted
  ].filter(Boolean).length;

  const totalScore = Math.min(100, Math.round((criteriaPassed / 5) * 100));
  const canProceed = criteriaPassed >= 4; // At least 4 of 5 objectives

  // Quick Action: Auto-fill factors 1..10 and 6 using Fill Handle simulation
  const handleAutoFillFactors = () => {
    sounds.playCorrect();
    setRowsData(prev => prev.map((_, idx) => ({
      factor1: idx + 1,
      factor2: 6,
      formula: prev[idx].formula,
      evaluated: prev[idx].evaluated
    })));
  };

  // Quick Action: Auto-fill header titles
  const handleAutoFillHeaders = () => {
    sounds.playCorrect();
    setHeaders({
      a1: 'Factor 1',
      b1: 'Factor 2',
      c1: 'Produs'
    });
  };

  // Quick Action: Apply formula copy down
  const handleApplyFormulas = () => {
    sounds.playCorrect();
    setRowsData(prev => prev.map((row, idx) => {
      const f1 = typeof row.factor1 === 'number' ? row.factor1 : (idx + 1);
      const f2 = typeof row.factor2 === 'number' ? row.factor2 : 6;
      return {
        factor1: f1,
        factor2: f2,
        formula: `=A${idx + 2}*B${idx + 2}`,
        evaluated: f1 * f2
      };
    }));
  };

  const handleApplyFormatting = () => {
    sounds.playCorrect();
    setIsHeaderBold(true);
    setIsHeaderFilled(true);
    setHasBorders(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-teal-900/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 18 (Fișă de Laborator)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Calculator className="w-8 h-8 text-emerald-400" />
              Nivelul 6: Atelier Practic Aplicativ — „Tabla Înmulțirii cu 6”
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Creează și formatează cap-coadă foaia de calcul cerută la pagina 18 din manual: redenumire foaie, antete de coloane, multiplicare cu formule și stilizare tabelară profesională!
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Pas Curent</div>
            <div className="text-2xl font-black text-emerald-400">6 / 7</div>
          </div>
        </div>
      </div>

      {/* Objectives Checklist & Live Scoring */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Cerințe de Realizat din Fișa de Laborator</h2>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
            <span className="text-slate-400">Progres Atelier:</span>
            <span className="text-emerald-400 font-black">{totalScore}%</span>
            <span className="text-slate-500">({criteriaPassed}/5 obiective)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            isSheetRenamed ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">1.</span>
            <span>Redenumește în „Tabla cu 6”</span>
            {isSheetRenamed && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            isHeadersSet ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">2.</span>
            <span>Antet: Factor 1, Factor 2, Produs</span>
            {isHeadersSet && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            isFactorsFilled ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">3.</span>
            <span>Completare 1..10 și factorul 6</span>
            {isFactorsFilled && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            isFormulasComplete ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">4.</span>
            <span>Formule înmulțire (=A2*B2..)</span>
            {isFormulasComplete && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 transition ${
            isFormatted ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span className="font-bold">5.</span>
            <span>Stilizare: Bold, Fill & All Borders</span>
            {isFormatted && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
          </div>
        </div>
      </div>

      {/* Interactive Sheet Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6">
        {/* Studio Ribbon Quick Helper Tools */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <span>Asistent de Laborator:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillHeaders}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium cursor-pointer"
            >
              ✍️ Completează Antetul
            </button>
            <button
              type="button"
              onClick={handleAutoFillFactors}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium cursor-pointer"
            >
              🔢 Trage Seria 1..10 (Fill Handle)
            </button>
            <button
              type="button"
              onClick={handleApplyFormulas}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold cursor-pointer"
            >
              ⚡ Calculează Formulele (=A2*B2)
            </button>
            <button
              type="button"
              onClick={handleApplyFormatting}
              className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold cursor-pointer"
            >
              🎨 Formatează Tabelul (Bold & Fill)
            </button>
          </div>
        </div>

        {/* Name Box & Formula Bar Status */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono text-xs">
          <div className="w-24 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-bold text-center">
            {activeCellCoord}
          </div>
          <div className="text-slate-500 font-bold">fx</div>
          <div className="flex-1 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
            {activeCellCoord === 'C2' ? '=A2*B2' : activeCellCoord === 'A1' ? headers.a1 : activeCellCoord === 'B1' ? headers.b1 : activeCellCoord === 'C1' ? headers.c1 : 'Selectează o celulă'}
          </div>
        </div>

        {/* Live Worksheet Grid */}
        <div className="border border-slate-700 rounded-2xl overflow-x-auto bg-slate-950 font-mono text-xs shadow-inner">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <th className="p-2 border-r border-slate-800 w-12 bg-slate-850">◢</th>
                <th className="p-2 border-r border-slate-800 w-1/3">Coloana A</th>
                <th className="p-2 border-r border-slate-800 w-1/3">Coloana B</th>
                <th className="p-2 w-1/3">Coloana C</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Headers */}
              <tr className={`border-b border-slate-800 ${
                isHeaderFilled ? 'bg-emerald-950/60' : 'bg-slate-900/50'
              } ${isHeaderBold ? 'font-black text-white text-sm' : 'font-medium text-slate-300'}`}>
                <td className="p-2.5 border-r border-slate-800 bg-slate-900 text-slate-400 font-bold">1</td>
                <td
                  onClick={() => setActiveCellCoord('A1')}
                  className={`p-2 border-r ${hasBorders ? 'border-slate-600' : 'border-slate-800'}`}
                >
                  <input
                    type="text"
                    value={headers.a1}
                    onChange={(e) => setHeaders(prev => ({ ...prev, a1: e.target.value }))}
                    placeholder="Tastați: Factor 1"
                    className="w-full text-center bg-transparent border-none focus:outline-none placeholder:text-slate-600"
                  />
                </td>
                <td
                  onClick={() => setActiveCellCoord('B1')}
                  className={`p-2 border-r ${hasBorders ? 'border-slate-600' : 'border-slate-800'}`}
                >
                  <input
                    type="text"
                    value={headers.b1}
                    onChange={(e) => setHeaders(prev => ({ ...prev, b1: e.target.value }))}
                    placeholder="Tastați: Factor 2"
                    className="w-full text-center bg-transparent border-none focus:outline-none placeholder:text-slate-600"
                  />
                </td>
                <td
                  onClick={() => setActiveCellCoord('C1')}
                  className="p-2"
                >
                  <input
                    type="text"
                    value={headers.c1}
                    onChange={(e) => setHeaders(prev => ({ ...prev, c1: e.target.value }))}
                    placeholder="Tastați: Produs"
                    className="w-full text-center bg-transparent border-none focus:outline-none placeholder:text-slate-600 text-emerald-300 font-bold"
                  />
                </td>
              </tr>

              {/* Rows 2..11: Multiplication 1..10 x 6 */}
              {rowsData.map((row, idx) => {
                const rowNum = idx + 2;
                return (
                  <tr
                    key={rowNum}
                    className={`border-b border-slate-850 hover:bg-slate-800/30 transition ${
                      hasBorders ? 'divide-x divide-slate-700/60' : 'divide-x divide-slate-850'
                    }`}
                  >
                    <td className="p-2 border-r border-slate-850 bg-slate-900 text-slate-400 font-bold text-center">
                      {rowNum}
                    </td>
                    <td
                      onClick={() => setActiveCellCoord(`A${rowNum}`)}
                      className="p-2 text-slate-200"
                    >
                      {row.factor1 !== '' ? row.factor1 : (
                        <span className="text-slate-600 italic">{idx + 1}</span>
                      )}
                    </td>
                    <td
                      onClick={() => setActiveCellCoord(`B${rowNum}`)}
                      className="p-2 text-slate-200"
                    >
                      {row.factor2 !== '' ? row.factor2 : (
                        <span className="text-slate-600 italic">6</span>
                      )}
                    </td>
                    <td
                      onClick={() => setActiveCellCoord(`C${rowNum}`)}
                      className="p-2 font-bold text-emerald-400"
                    >
                      {row.evaluated !== null ? (
                        <span>{row.evaluated}</span>
                      ) : (
                        <span className="text-slate-600 italic">=A{rowNum}*B{rowNum}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sheet Tabs Bar with Editable Tab Name */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Nume Etichetă Foaie:</span>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="Foaie1"
              className={`px-3 py-1 rounded-lg border font-bold text-xs focus:outline-none ${
                isSheetRenamed
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            />
            {!isSheetRenamed && (
              <button
                type="button"
                onClick={() => setSheetName('Tabla cu 6')}
                className="text-[11px] text-amber-300 underline hover:text-amber-200"
              >
                Setează „Tabla cu 6”
              </button>
            )}
          </div>
          <div className="text-slate-500 text-[11px] hidden sm:inline">
            Fișa Pag. 18 • Registru1.xlsx
          </div>
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
