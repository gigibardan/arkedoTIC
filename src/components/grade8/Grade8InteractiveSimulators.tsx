import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  BarChart2,
  PieChart,
  TrendingUp,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Layers,
  Palette,
  Eye,
  Sliders,
  Code,
  Terminal,
  Bot,
  Compass,
  ArrowRight,
  Sparkles,
  Search,
  Lock,
  Share2,
  FileSpreadsheet,
  Code2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';

// =========================================================================
// 1. EXCELLAB SIMULATOR (FOI DE CALCUL, FORMULE & DIAGRAME DINAMICE)
// =========================================================================

interface CellData {
  raw: string;
  computed?: string | number;
  format?: 'general' | 'number' | 'currency' | 'percent';
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  color?: string;
  bgColor?: string;
}

export interface ExcelLabSimProps {
  initialChartType?: 'column' | 'line' | 'pie';
  initialSheetName?: string;
}

export const ExcelLabSim: React.FC<ExcelLabSimProps> = ({
  initialChartType = 'column',
  initialSheetName = 'Catalog Clasa 8'
}) => {
  const defaultGrid: Record<string, CellData> = {
    A1: { raw: 'MATERIA', bold: true, align: 'center', bgColor: 'bg-emerald-950/70', color: 'text-emerald-300' },
    B1: { raw: 'NOTA 1', bold: true, align: 'center', bgColor: 'bg-emerald-950/70', color: 'text-emerald-300' },
    C1: { raw: 'NOTA 2', bold: true, align: 'center', bgColor: 'bg-emerald-950/70', color: 'text-emerald-300' },
    D1: { raw: 'NOTA 3', bold: true, align: 'center', bgColor: 'bg-emerald-950/70', color: 'text-emerald-300' },
    E1: { raw: 'MEDIA', bold: true, align: 'center', bgColor: 'bg-teal-950/80', color: 'text-teal-200' },
    F1: { raw: 'STATUS', bold: true, align: 'center', bgColor: 'bg-teal-950/80', color: 'text-teal-200' },

    A2: { raw: 'Informatica', bold: false, align: 'left' },
    B2: { raw: '10', format: 'number', align: 'center' },
    C2: { raw: '10', format: 'number', align: 'center' },
    D2: { raw: '9', format: 'number', align: 'center' },
    E2: { raw: '=AVERAGE(B2:D2)', format: 'number', align: 'center', bold: true },
    F2: { raw: '=IF(E2>=8.5, "BURSA", "PROMOVAT")', align: 'center', bold: true },

    A3: { raw: 'Matematica', bold: false, align: 'left' },
    B3: { raw: '9', format: 'number', align: 'center' },
    C3: { raw: '8', format: 'number', align: 'center' },
    D3: { raw: '10', format: 'number', align: 'center' },
    E3: { raw: '=AVERAGE(B3:D3)', format: 'number', align: 'center', bold: true },
    F3: { raw: '=IF(E3>=8.5, "BURSA", "PROMOVAT")', align: 'center', bold: true },

    A4: { raw: 'Fizica', bold: false, align: 'left' },
    B4: { raw: '8', format: 'number', align: 'center' },
    C4: { raw: '9', format: 'number', align: 'center' },
    D4: { raw: '8', format: 'number', align: 'center' },
    E4: { raw: '=AVERAGE(B4:D4)', format: 'number', align: 'center', bold: true },
    F4: { raw: '=IF(E4>=8.5, "BURSA", "PROMOVAT")', align: 'center', bold: true },

    A5: { raw: 'Limba Romana', bold: false, align: 'left' },
    B5: { raw: '10', format: 'number', align: 'center' },
    C5: { raw: '9', format: 'number', align: 'center' },
    D5: { raw: '10', format: 'number', align: 'center' },
    E5: { raw: '=AVERAGE(B5:D5)', format: 'number', align: 'center', bold: true },
    F5: { raw: '=IF(E5>=8.5, "BURSA", "PROMOVAT")', align: 'center', bold: true },

    A6: { raw: 'Limba Engleza', bold: false, align: 'left' },
    B6: { raw: '10', format: 'number', align: 'center' },
    C6: { raw: '10', format: 'number', align: 'center' },
    D6: { raw: '10', format: 'number', align: 'center' },
    E6: { raw: '=AVERAGE(B6:D6)', format: 'number', align: 'center', bold: true },
    F6: { raw: '=IF(E6>=8.5, "BURSA", "PROMOVAT")', align: 'center', bold: true },

    A7: { raw: 'MEDIA GENERALA', bold: true, align: 'left', bgColor: 'bg-emerald-900/40', color: 'text-amber-300' },
    B7: { raw: '', bgColor: 'bg-slate-900' },
    C7: { raw: '', bgColor: 'bg-slate-900' },
    D7: { raw: '', bgColor: 'bg-slate-900' },
    E7: { raw: '=AVERAGE(E2:E6)', bold: true, align: 'center', bgColor: 'bg-amber-950/60', color: 'text-amber-300' },
    F7: { raw: '=IF(E7>=9.5, "EXCELENT", "FOARTE BINE")', bold: true, align: 'center', bgColor: 'bg-amber-950/60', color: 'text-amber-300' }
  };

  const [grid, setGrid] = useState<Record<string, CellData>>(defaultGrid);
  const [selectedCell, setSelectedCell] = useState<string>('B2');
  const [formulaInput, setFormulaInput] = useState<string>('10');
  const [chartType, setChartType] = useState<'column' | 'line' | 'pie'>(initialChartType);
  const [activeSheet, setActiveSheet] = useState<string>(initialSheetName);

  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const rows = [1, 2, 3, 4, 5, 6, 7];

  // Helper evaluator for standard Excel formulas
  const evaluateCell = (rawVal: string, currentGrid: Record<string, CellData>): string | number => {
    if (!rawVal) return '';
    if (!rawVal.startsWith('=')) {
      const num = Number(rawVal);
      return isNaN(num) ? rawVal : num;
    }

    const clean = rawVal.substring(1).trim().toUpperCase();

    // 1. AVERAGE(range)
    if (clean.startsWith('AVERAGE(') && clean.endsWith(')')) {
      const range = clean.substring(8, clean.length - 1);
      const [start, end] = range.split(':');
      if (start && end) {
        const colStart = start.charAt(0);
        const colEnd = end.charAt(0);
        const rowStart = parseInt(start.substring(1), 10);
        const rowEnd = parseInt(end.substring(1), 10);
        let sum = 0;
        let count = 0;
        for (let r = rowStart; r <= rowEnd; r++) {
          for (let c = colStart.charCodeAt(0); c <= colEnd.charCodeAt(0); c++) {
            const cellKey = `${String.fromCharCode(c)}${r}`;
            const val = currentGrid[cellKey]?.computed ?? currentGrid[cellKey]?.raw;
            const n = Number(val);
            if (!isNaN(n) && val !== '') {
              sum += n;
              count++;
            }
          }
        }
        return count > 0 ? Number((sum / count).toFixed(2)) : 0;
      }
    }

    // 2. SUM(range)
    if (clean.startsWith('SUM(') && clean.endsWith(')')) {
      const range = clean.substring(4, clean.length - 1);
      const [start, end] = range.split(':');
      if (start && end) {
        const colStart = start.charAt(0);
        const colEnd = end.charAt(0);
        const rowStart = parseInt(start.substring(1), 10);
        const rowEnd = parseInt(end.substring(1), 10);
        let sum = 0;
        for (let r = rowStart; r <= rowEnd; r++) {
          for (let c = colStart.charCodeAt(0); c <= colEnd.charCodeAt(0); c++) {
            const cellKey = `${String.fromCharCode(c)}${r}`;
            const val = currentGrid[cellKey]?.computed ?? currentGrid[cellKey]?.raw;
            const n = Number(val);
            if (!isNaN(n)) sum += n;
          }
        }
        return Number(sum.toFixed(2));
      }
    }

    // 3. MAX / MIN
    if (clean.startsWith('MAX(') && clean.endsWith(')')) {
      const range = clean.substring(4, clean.length - 1);
      const parts = range.split(':');
      if (parts.length === 2) {
        let maxVal = -Infinity;
        const [start, end] = parts;
        const rowStart = parseInt(start.substring(1), 10);
        const rowEnd = parseInt(end.substring(1), 10);
        for (let r = rowStart; r <= rowEnd; r++) {
          const k = `${start.charAt(0)}${r}`;
          const n = Number(currentGrid[k]?.computed ?? currentGrid[k]?.raw);
          if (!isNaN(n) && n > maxVal) maxVal = n;
        }
        return maxVal === -Infinity ? 0 : maxVal;
      }
    }

    if (clean.startsWith('MIN(') && clean.endsWith(')')) {
      const range = clean.substring(4, clean.length - 1);
      const parts = range.split(':');
      if (parts.length === 2) {
        let minVal = Infinity;
        const [start, end] = parts;
        const rowStart = parseInt(start.substring(1), 10);
        const rowEnd = parseInt(end.substring(1), 10);
        for (let r = rowStart; r <= rowEnd; r++) {
          const k = `${start.charAt(0)}${r}`;
          const n = Number(currentGrid[k]?.computed ?? currentGrid[k]?.raw);
          if (!isNaN(n) && n < minVal) minVal = n;
        }
        return minVal === Infinity ? 0 : minVal;
      }
    }

    // 4. IF(cond, val_true, val_false)
    if (clean.startsWith('IF(') && clean.endsWith(')')) {
      const inner = clean.substring(3, clean.length - 1);
      const parts = inner.split(',').map((s) => s.trim());
      if (parts.length >= 3) {
        const cond = parts[0];
        const valTrue = parts[1].replace(/["']/g, '');
        const valFalse = parts[2].replace(/["']/g, '');

        // Simple comparison evaluator: E2>=8.5
        const m = cond.match(/([A-Z][0-9]+)\s*(>=|<=|>|<|==|=)\s*([0-9.]+)/);
        if (m) {
          const refKey = m[1];
          const op = m[2];
          const target = Number(m[3]);
          const actual = Number(currentGrid[refKey]?.computed ?? currentGrid[refKey]?.raw ?? 0);
          let pass = false;
          if (op === '>=' || op === '=>') pass = actual >= target;
          else if (op === '<=' || op === '=<') pass = actual <= target;
          else if (op === '>') pass = actual > target;
          else if (op === '<') pass = actual < target;
          else if (op === '==' || op === '=') pass = actual === target;

          return pass ? valTrue : valFalse;
        }
      }
    }

    // 5. INT(num)
    if (clean.startsWith('INT(') && clean.endsWith(')')) {
      const ref = clean.substring(4, clean.length - 1).trim();
      const n = Number(currentGrid[ref]?.computed ?? currentGrid[ref]?.raw ?? ref);
      return Math.floor(n);
    }

    return rawVal;
  };

  // Compute all cells dynamically
  const computedGrid = useMemo(() => {
    const next: Record<string, CellData> = {};
    // First pass copy raw
    for (const [k, v] of Object.entries(grid)) {
      next[k] = { ...(v as CellData) };
    }
    // Second pass compute values in row order
    for (let r = 1; r <= 7; r++) {
      for (const col of cols) {
        const k = `${col}${r}`;
        if (next[k]?.raw) {
          next[k].computed = evaluateCell(next[k].raw, next);
        }
      }
    }
    return next;
  }, [grid]);

  const handleCellClick = (k: string) => {
    setSelectedCell(k);
    setFormulaInput(grid[k]?.raw || '');
    sounds.playClick();
  };

  const handleFormulaChange = (newVal: string) => {
    setFormulaInput(newVal);
    setGrid((prev) => ({
      ...prev,
      [selectedCell]: {
        ...(prev[selectedCell] || {}),
        raw: newVal
      }
    }));
  };

  // Chart data extraction (subjects A2:A6 and grades E2:E6)
  const chartData = [
    { label: String(computedGrid.A2?.raw || 'Info'), value: Number(computedGrid.E2?.computed || 9.67), color: '#10b981' },
    { label: String(computedGrid.A3?.raw || 'Mate'), value: Number(computedGrid.E3?.computed || 9.0), color: '#06b6d4' },
    { label: String(computedGrid.A4?.raw || 'Fizica'), value: Number(computedGrid.E4?.computed || 8.33), color: '#3b82f6' },
    { label: String(computedGrid.A5?.raw || 'Romana'), value: Number(computedGrid.E5?.computed || 9.67), color: '#8b5cf6' },
    { label: String(computedGrid.A6?.raw || 'Engleza'), value: Number(computedGrid.E6?.computed || 10.0), color: '#ec4899' }
  ];

  const totalPoints = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>ExcelLab Studio 365</span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                Modul Interactiv Clasa VIII
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Formule live (=AVERAGE, =SUM, =IF, =INT), recalculare dinamică și diagrame sincronizate.
            </p>
          </div>
        </div>

        {/* Chart type switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setChartType('column'); sounds.playClick(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              chartType === 'column' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Coloană</span>
          </button>
          <button
            onClick={() => { setChartType('line'); sounds.playClick(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              chartType === 'line' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Linii</span>
          </button>
          <button
            onClick={() => { setChartType('pie'); sounds.playClick(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              chartType === 'pie' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Plăcintă (Pie)</span>
          </button>
        </div>
      </div>

      {/* Formula bar & Name box */}
      <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs font-black text-emerald-400 w-16 text-center shadow-inner">
          {selectedCell}
        </div>
        <div className="text-slate-500 font-serif italic text-sm font-bold select-none">
          fx
        </div>
        <input
          type="text"
          value={formulaInput}
          onChange={(e) => handleFormulaChange(e.target.value)}
          placeholder="Introdu o valoare sau o formulă (ex: =AVERAGE(B2:D2) sau =IF(E2>=8.5, 'BURSA', 'PROMOVAT'))"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => {
            setGrid(defaultGrid);
            setSelectedCell('B2');
            setFormulaInput('10');
            sounds.playClick();
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1"
          title="Resetează datele tabelului"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-mono text-[11px]">
              <th className="p-2 w-10 text-center border-r border-b border-slate-800">#</th>
              {cols.map((c) => (
                <th key={c} className="p-2 text-center border-r border-b border-slate-800 font-black">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r} className="border-b border-slate-800/80">
                <td className="p-2 text-center bg-slate-950 text-slate-500 font-mono font-bold border-r border-slate-800 select-none">
                  {r}
                </td>
                {cols.map((c) => {
                  const key = `${c}${r}`;
                  const cell = computedGrid[key] || { raw: '' };
                  const isSelected = selectedCell === key;
                  const displayValue = cell.computed !== undefined ? cell.computed : cell.raw;

                  return (
                    <td
                      key={key}
                      onClick={() => handleCellClick(key)}
                      className={`p-2.5 border-r border-slate-800 cursor-pointer font-sans transition relative ${
                        cell.bgColor || 'bg-slate-900/50'
                      } ${isSelected ? 'ring-2 ring-emerald-400 z-10 bg-emerald-950/40' : 'hover:bg-slate-800/60'} ${
                        cell.bold ? 'font-black' : 'font-normal'
                      } ${cell.color || 'text-slate-200'} text-${cell.align || 'left'}`}
                    >
                      <div className="truncate min-w-[70px] max-w-[150px]">
                        {displayValue === '' ? '\u00A0' : String(displayValue)}
                      </div>
                      {isSelected && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 cursor-crosshair" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Synchronized Charts Area */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white">
              {chartType === 'column' && 'Diagramă Coloană 2D — Compararea Mediilor pe Materii'}
              {chartType === 'line' && 'Diagramă cu Linii — Curba Fluctuației Notelor'}
              {chartType === 'pie' && 'Diagramă Radială Plăcintă (Pie Chart) — Ponderi Procentuale'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
              Auto-Sync Live
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Modifică orice notă în tabel pentru a vedea graficul adaptându-se instantaneu!
          </span>
        </div>

        {/* 1. Column Chart */}
        {chartType === 'column' && (
          <div className="h-48 flex items-end justify-around gap-4 pt-6 px-4 pb-2 border-b border-slate-800">
            {chartData.map((d, i) => {
              const heightPercent = Math.max(10, Math.min(100, (d.value / 10) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono font-black text-emerald-300 opacity-90 group-hover:scale-110 transition">
                    {d.value}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%`, backgroundColor: d.color }}
                    className="w-full max-w-[42px] rounded-t-xl transition-all duration-500 shadow-lg group-hover:brightness-125"
                  />
                  <span className="text-[11px] font-bold text-slate-300 truncate max-w-[70px]">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. Line Chart */}
        {chartType === 'line' && (
          <div className="h-48 relative flex items-center justify-center p-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Guides */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="3 3" />

              {/* Path line */}
              {(() => {
                const points = chartData.map((d, i) => {
                  const x = 50 + i * 100;
                  const y = 110 - (d.value / 10) * 90;
                  return `${x},${y}`;
                });
                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3.5"
                      points={points.join(' ')}
                      className="transition-all duration-500"
                    />
                    {chartData.map((d, i) => {
                      const x = 50 + i * 100;
                      const y = 110 - (d.value / 10) * 90;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="6" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                          <text x={x} y={y - 10} fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                            {d.value}
                          </text>
                          <text x={x} y="130" fill="#94a3b8" fontSize="10" textAnchor="middle">
                            {d.label}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        )}

        {/* 3. Pie Chart */}
        {chartType === 'pie' && (
          <div className="h-52 flex items-center justify-around gap-6">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let accumulatedPercent = 0;
                  return chartData.map((d, i) => {
                    const percent = totalPoints > 0 ? (d.value / totalPoints) * 100 : 20;
                    const strokeDasharray = `${percent} ${100 - percent}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += percent;

                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="transparent"
                        stroke={d.color}
                        strokeWidth="20"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Total</span>
                <span className="text-sm font-black text-white">{totalPoints.toFixed(1)}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {chartData.map((d, i) => {
                const percent = totalPoints > 0 ? Math.round((d.value / totalPoints) * 100) : 20;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-300 font-bold truncate max-w-[80px]">{d.label}</span>
                    <span className="font-mono text-slate-400 text-[11px] font-bold">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sheets footer bar */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{activeSheet}</span>
          </div>
          <button
            onClick={() => sounds.playClick()}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Adaugă foaie nouă (+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>Gata</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. WEBSTUDIO SIMULATOR (GOOGLE SITES WYSIWYG & PREVIZUALIZARE RESPONSIVE)
// =========================================================================

export interface WebStudioSimProps {
  initialTab?: 'insert' | 'pages' | 'themes';
  initialDevice?: 'desktop' | 'tablet' | 'mobile';
}

export const WebStudioSim: React.FC<WebStudioSimProps> = ({
  initialTab = 'insert',
  initialDevice = 'desktop'
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>(initialDevice);
  const [activeTab, setActiveTab] = useState<'insert' | 'pages' | 'themes'>(initialTab);
  const [siteTitle, setSiteTitle] = useState<string>('Oracolul Clasei a VIII-a');
  const [siteTheme, setSiteTheme] = useState<'aristotel' | 'simplu' | 'viziune'>('aristotel');
  const [themeColor, setThemeColor] = useState<string>('#3b82f6');
  const [bannerType, setBannerType] = useState<'banner' | 'cover' | 'title_only'>('banner');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [showSourceCode, setShowSourceCode] = useState<boolean>(false);

  // Pages structure
  const [pages, setPages] = useState<Array<{ id: string; title: string; isHome?: boolean; subpages?: string[] }>>([
    { id: 'home', title: 'Pagina Principală (Acasă)', isHome: true },
    { id: 'students', title: 'Oracolul Elevilor', subpages: ['Maria P.', 'Vlad C.', 'Andrei D.'] },
    { id: 'projects', title: 'Proiecte & Concursuri' },
    { id: 'contact', title: 'Contact & Școală' }
  ]);

  const carouselImages = [
    { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80', caption: 'Echipa Noastră de Proiect' },
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80', caption: 'Laboratorul de Informatică' },
    { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80', caption: 'Concursul Național de TIC' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>WebStudio Google Sites</span>
              <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase">
                Editor Vizual Clasa VIII
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Antet dinamic, carusel de imagini, navigare multipage și previzualizare responsive.
            </p>
          </div>
        </div>

        {/* Actions & Device switch */}
        <div className="flex items-center gap-2">
          {/* Responsive switchers */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setDeviceMode('desktop'); sounds.playClick(); }}
              className={`p-1.5 rounded-lg transition ${deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Previzualizare Ecran Mare (Desktop)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setDeviceMode('tablet'); sounds.playClick(); }}
              className={`p-1.5 rounded-lg transition ${deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Previzualizare Tabletă"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setDeviceMode('mobile'); sounds.playClick(); }}
              className={`p-1.5 rounded-lg transition ${deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Previzualizare Telefon Mobil"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => { setShowSourceCode(!showSourceCode); sounds.playClick(); }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showSourceCode ? 'Editor' : 'Cod HTML'}</span>
          </button>

          <button
            onClick={() => {
              setIsPublished(true);
              sounds.playCorrect();
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black transition shadow-lg flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Publicare</span>
          </button>
        </div>
      </div>

      {/* Published banner notification */}
      {isPublished && (
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Site publicat cu succes la adresa:{' '}
              <strong className="font-mono text-white">sites.google.com/view/oracolul-clasei-8</strong>
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard?.writeText('https://sites.google.com/view/oracolul-clasei-8');
              sounds.playClick();
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copiază</span>
          </button>
        </div>
      )}

      {/* Main split: Workspace & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left/Center: Visual Preview Screen */}
        <div className="lg:col-span-3 flex justify-center bg-slate-950/80 p-4 rounded-2xl border border-slate-800 min-h-[460px]">
          {showSourceCode ? (
            <div className="w-full bg-slate-900 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-y-auto max-h-[440px] space-y-2 border border-slate-800">
              <span className="text-slate-500">&lt;!-- Codul Sursă HTML5 Generat Automat --&gt;</span>
              <pre className="text-emerald-400 whitespace-pre-wrap">
{`<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>${siteTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body class="theme-${siteTheme}">
  <header class="header-${bannerType}" style="background-color: ${themeColor}">
    <nav class="navbar">
      <div class="logo">🏫 ${siteTitle}</div>
      <ul class="nav-links">
        <li><a href="#home">Acasă</a></li>
        <li><a href="#oracol">Oracol</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    <div class="hero-banner">
      <h1>${siteTitle}</h1>
      <p>Proiect educațional clasa a VIII-a realizat colaborativ.</p>
    </div>
  </header>

  <main class="container">
    <section class="slider-carousel">
      <!-- Carusel cu 3 imagini reprezentative -->
      <img src="${carouselImages[carouselIndex].url}" alt="Proiect">
    </section>

    <section class="content-block">
      <h2>Despre Noi</h2>
      <p>Pagina oficială a clasei dedicată amintirilor și pregătirii pentru liceu.</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Clasa a VIII-a • Toate drepturile rezervate.</p>
  </footer>
</body>
</html>`}
              </pre>
            </div>
          ) : (
            <div
              className={`bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col ${
                deviceMode === 'desktop' ? 'w-full' : deviceMode === 'tablet' ? 'w-[480px]' : 'w-[320px]'
              }`}
            >
              {/* Simulated Browser Chrome */}
              <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-3 py-0.5 rounded-md bg-slate-900 text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                  https://sites.google.com/view/oracolul-clasei-8
                </div>
                <Lock className="w-3 h-3 text-emerald-400" />
              </div>

              {/* Site Header / Banner */}
              <div
                style={{
                  backgroundColor: themeColor,
                  backgroundImage: bannerType !== 'title_only' ? 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85))' : 'none'
                }}
                className={`p-6 text-white flex flex-col justify-between transition-all ${
                  bannerType === 'cover' ? 'h-56' : bannerType === 'banner' ? 'h-36' : 'h-24'
                }`}
              >
                {/* Navbar */}
                <div className="flex items-center justify-between text-xs font-bold border-b border-white/20 pb-2">
                  <span className="flex items-center gap-1.5 text-white font-black">
                    <span>🏫</span> {siteTitle}
                  </span>
                  <div className="hidden sm:flex items-center gap-3 text-white/90 text-[11px]">
                    <span className="hover:text-white cursor-pointer underline">Acasă</span>
                    <span className="hover:text-white cursor-pointer">Oracol</span>
                    <span className="hover:text-white cursor-pointer">Proiecte</span>
                    <span className="hover:text-white cursor-pointer">Contact</span>
                  </div>
                </div>

                {/* Banner Hero */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-heading drop-shadow">
                    {siteTitle}
                  </h1>
                  <p className="text-xs text-white/80 mt-1">
                    Portofoliu digital & oracol realizat în echipă
                  </p>
                </div>
              </div>

              {/* Site Body */}
              <div className="p-4 space-y-4 flex-1 bg-slate-900 text-slate-200 text-xs">
                {/* Carousel */}
                <div className="rounded-xl overflow-hidden border border-slate-700/60 relative bg-slate-950">
                  <img
                    src={carouselImages[carouselIndex].url}
                    alt={carouselImages[carouselIndex].caption}
                    className="w-full h-36 sm:h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-bold text-white drop-shadow">
                      {carouselImages[carouselIndex].caption}
                    </span>
                  </div>
                  {/* Prev/Next buttons */}
                  <div className="absolute inset-0 flex items-center justify-between p-2">
                    <button
                      onClick={() => setCarouselIndex((p) => (p > 0 ? p - 1 : carouselImages.length - 1))}
                      className="w-6 h-6 rounded-full bg-slate-950/70 text-white flex items-center justify-center hover:bg-slate-900 text-xs"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCarouselIndex((p) => (p < carouselImages.length - 1 ? p + 1 : 0))}
                      className="w-6 h-6 rounded-full bg-slate-950/70 text-white flex items-center justify-center hover:bg-slate-900 text-xs"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs">Descrierea Proiectului</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    În cadrul orelor de Informatică și TIC am creat acest site colaborativ pentru a păstra amintirile
                    gimnaziului și a pregăti opțiunile de admitere la liceu.
                  </p>
                </div>

                {/* Embedded Sheet Mockup */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white text-[11px]">Tabel Note & Medii (Încorporat)</div>
                      <div className="text-[10px] text-slate-400">Foi de calcul sincronizate automat</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    Foi de calcul
                  </span>
                </div>
              </div>

              {/* Site Footer */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
                &copy; 2026 Clasa a VIII-a • Creat cu Google Sites • Proiect Gimnazial
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: The 3 Google Sites Tabs */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-4">
          {/* Tab selector */}
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold text-center">
            <button
              onClick={() => { setActiveTab('insert'); sounds.playClick(); }}
              className={`py-1.5 rounded-lg transition ${activeTab === 'insert' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Inserează
            </button>
            <button
              onClick={() => { setActiveTab('pages'); sounds.playClick(); }}
              className={`py-1.5 rounded-lg transition ${activeTab === 'pages' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Pagini
            </button>
            <button
              onClick={() => { setActiveTab('themes'); sounds.playClick(); }}
              className={`py-1.5 rounded-lg transition ${activeTab === 'themes' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Teme
            </button>
          </div>

          {/* TAB 1: INSEREAZĂ */}
          {activeTab === 'insert' && (
            <div className="space-y-3 text-xs">
              <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">Elemente Media</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => sounds.playClick()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold flex items-center gap-2"
                >
                  <span className="text-base">📝</span>
                  <span>Casetă text</span>
                </button>
                <button
                  onClick={() => sounds.playClick()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold flex items-center gap-2"
                >
                  <span className="text-base">🖼️</span>
                  <span>Imagini</span>
                </button>
                <button
                  onClick={() => sounds.playClick()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold flex items-center gap-2"
                >
                  <span className="text-base">🎠</span>
                  <span>Carusel</span>
                </button>
                <button
                  onClick={() => sounds.playClick()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold flex items-center gap-2"
                >
                  <span className="text-base">📍</span>
                  <span>Hartă Maps</span>
                </button>
              </div>

              <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold pt-2">Tip Antet (Header)</span>
              <div className="flex flex-col gap-1.5">
                {(['cover', 'banner', 'title_only'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setBannerType(t); sounds.playClick(); }}
                    className={`px-3 py-1.5 rounded-xl text-left font-bold transition flex items-center justify-between ${
                      bannerType === t ? 'bg-indigo-950/80 border border-indigo-500/50 text-indigo-300' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{t === 'cover' ? 'Copertă Mare' : t === 'banner' ? 'Banner Standard' : 'Numai Titlu'}</span>
                    {bannerType === t && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PAGINI */}
          {activeTab === 'pages' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Arbore Pagini</span>
                <button
                  onClick={() => {
                    const name = prompt('Introdu numele noii pagini:');
                    if (name) {
                      setPages((prev) => [...prev, { id: `p_${Date.now()}`, title: name }]);
                      sounds.playCorrect();
                    }
                  }}
                  className="p-1 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                  title="Pagină nouă"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {pages.map((p) => (
                  <div key={p.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span className="truncate">{p.title}</span>
                      {p.isHome && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                          Principală
                        </span>
                      )}
                    </div>
                    {p.subpages && (
                      <div className="pl-3 border-l border-indigo-500/40 space-y-1 pt-1 text-[11px] text-slate-400">
                        {p.subpages.map((sub, idx) => (
                          <div key={idx} className="truncate">↳ {sub}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEME */}
          {activeTab === 'themes' && (
            <div className="space-y-3 text-xs">
              <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">Teme Predefinite</span>
              <div className="space-y-1.5">
                {[
                  { id: 'aristotel', name: 'Aristotel', color: '#3b82f6' },
                  { id: 'simplu', name: 'Simplu & Elegant', color: '#10b981' },
                  { id: 'viziune', name: 'Viziune', color: '#8b5cf6' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setSiteTheme(th.id as any);
                      setThemeColor(th.color);
                      sounds.playClick();
                    }}
                    className={`w-full p-2.5 rounded-xl text-left font-bold transition flex items-center justify-between ${
                      siteTheme === th.id ? 'bg-indigo-950/80 border border-indigo-500/50 text-indigo-300' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: th.color }} />
                      <span>{th.name}</span>
                    </div>
                    {siteTheme === th.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>

              <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold pt-2">Culoare Personalizată</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs font-bold"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export interface CppSequencesSimProps {
  initialPresetId?: 'cnp' | 'fibonacci' | 'triunghiulare' | 'minmax' | 'liceu';
}

export const CppSequencesSim: React.FC<CppSequencesSimProps> = ({
  initialPresetId = 'cnp'
}) => {
  const presets = [
    {
      id: 'cnp',
      name: 'Analiză CNP & switch',
      code: `// Decodificare CNP de 13 cifre in C++
#include <iostream>
using namespace std;

int main() {
    long long int cnp = 2780712410055;
    int s, a, l, z;
    
    s = cnp / 1000000000000;
    if (s % 2 == 0) cout << "Sex: Feminin\\n";
    else cout << "Sex: Masculin\\n";
    
    a = cnp / 10000000000 % 100;
    l = cnp / 100000000 % 100;
    z = cnp / 1000000 % 100;
    
    cout << "Data nasterii: ";
    if (a < 10) cout << "0" << a << " "; else cout << a << " ";
    if (l < 10) cout << "0" << l << " "; else cout << l << " ";
    if (z < 10) cout << "0" << z; else cout << z;
    
    return 0;
}`,
      output: `Sex: Feminin\nData nasterii: 78 07 12`
    },
    {
      id: 'fibonacci',
      name: 'Șirul Fibonacci (p, d, c)',
      code: `// Generarea primilor n termeni Fibonacci
#include <iostream>
using namespace std;

int main() {
    int n = 8, i, p = 0, d = 1, c;
    cout << p << " " << d << " ";
    
    for (i = 3; i <= n; i++) {
        c = p + d;
        cout << c << " ";
        p = d;
        d = c;
    }
    return 0;
}`,
      output: `0 1 1 2 3 5 8 13`
    },
    {
      id: 'triunghiulare',
      name: 'Numere Triunghiulare',
      code: `// Generare numere triunghiulare T_n = n(n+1)/2
#include <iostream>
using namespace std;

int main() {
    int n = 10;
    for (int i = 1; i <= n; i++) {
        cout << (i * (i + 1)) / 2 << " ";
    }
    return 0;
}`,
      output: `1 3 6 10 15 21 28 36 45 55`
    },
    {
      id: 'minmax',
      name: 'Minim & Maxim cu Poziție',
      code: `// Aflare minim, maxim si pozitiile lor
#include <iostream>
using namespace std;

int main() {
    int v[] = {21, 54, 3, 23, 5};
    int n = 5;
    int maxVal = v[0], pozMax = 1;
    int minVal = v[0], pozMin = 1;
    
    for (int i = 1; i < n; i++) {
        if (v[i] > maxVal) { maxVal = v[i]; pozMax = i + 1; }
        if (v[i] < minVal) { minVal = v[i]; pozMin = i + 1; }
    }
    
    cout << "Maximul=" << maxVal << " (pe pozitia " << pozMax << ")\\n";
    cout << "Minimul=" << minVal << " (pe pozitia " << pozMin << ")";
    return 0;
}`,
      output: `Maximul=54 (pe pozitia 2)\nMinimul=3 (pe pozitia 3)`
    },
    {
      id: 'liceu',
      name: 'Proiect: Liceul Preferat',
      code: `// Prelucrare procentuala sondaj optiuni liceu (pag. 90)
#include <iostream>
using namespace std;

int main() {
    int voturi[] = {1, 2, 5, 1, 2, 3, 2, 4, 5, 5};
    int n = 10;
    int nr1=0, nr2=0, nr3=0, nr4=0, nr5=0;
    
    for (int i = 0; i < n; i++) {
        if (voturi[i] == 1) nr1++;
        if (voturi[i] == 2) nr2++;
        if (voturi[i] == 3) nr3++;
        if (voturi[i] == 4) nr4++;
        if (voturi[i] == 5) nr5++;
    }
    
    cout << "% optiunea 1: " << (float)nr1 / n * 100 << "%\\n";
    cout << "% optiunea 2: " << (float)nr2 / n * 100 << "%\\n";
    cout << "% optiunea 3: " << (float)nr3 / n * 100 << "%\\n";
    cout << "% optiunea 4: " << (float)nr4 / n * 100 << "%\\n";
    cout << "% optiunea 5 (Favorite): " << (float)nr5 / n * 100 << "%\\n";
    return 0;
}`,
      output: `% optiunea 1: 20%\n% optiunea 2: 30%\n% optiunea 3: 10%\n% optiunea 4: 10%\n% optiunea 5 (Favorite): 30%`
    }
  ];

  const [activePreset, setActivePreset] = useState(() => presets.find(p => p.id === initialPresetId) || presets[0]);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runCode = () => {
    setIsRunning(true);
    setConsoleOutput('Compilare Code::Blocks C++17 cu succes...\nRulare proces...\n--------------------------------\n');
    sounds.playClick();

    setTimeout(() => {
      setConsoleOutput((prev) => prev + activePreset.output + '\n--------------------------------\nProcess returned 0 (0x0)  execution time: 0.042 s\nPress any key to continue.');
      setIsRunning(false);
      sounds.playCorrect();
    }, 600);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>CppSequences In-Browser Runner</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                Compilator C++ Clasa VIII
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Execuție algoritmi din manual: CNP, Fibonacci, triunghiulare, min/max și proiectul liceului.
            </p>
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={runCode}
          disabled={isRunning}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs transition shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Se compilează...' : 'Rulează Codul (F9)'}</span>
        </button>
      </div>

      {/* Preset pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-bold mr-1">Exemple Manual:</span>
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePreset(p);
              setConsoleOutput('');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activePreset.id === p.id
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Code Editor & Console Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 mb-2 font-mono">
            <span>main.cpp</span>
            <span className="text-[10px] text-emerald-400 font-bold">C++17</span>
          </div>
          <pre className="text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed flex-1">
            {activePreset.code}
          </pre>
        </div>

        {/* Terminal output */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col font-mono text-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Consolă Ieșire
            </span>
            <button
              onClick={() => setConsoleOutput('')}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              Curăță
            </button>
          </div>
          <div className="flex-1 min-h-[220px] text-slate-300 whitespace-pre-wrap leading-relaxed overflow-y-auto">
            {consoleOutput || (
              <span className="text-slate-600 italic">
                Apasă pe butonul verde „Rulează Codul (F9)” pentru a compila și executa algoritmul...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. NXT ROBOLAB 2D (SIMULATOR ROBOTICĂ LEGO NXT, SENZORI & LABIRINT)
// =========================================================================

export const NxtRobotSim: React.FC = () => {
  const [robotPos, setRobotPos] = useState<{ x: number; y: number; angle: number }>({ x: 40, y: 150, angle: 0 });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sensorDistance, setSensorDistance] = useState<number>(45);
  const [touchTriggered, setTouchTriggered] = useState<boolean>(false);
  const [colorDetected, setColorDetected] = useState<string>('albastru');
  const [statusMsg, setStatusMsg] = useState<string>('Robot pregătit. Drum liber.');

  const intervalRef = useRef<any>(null);

  // Simple autonomous loop simulation
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRobotPos((prev) => {
        // Obstacle at x: 260
        const distToObstacle = 260 - prev.x;
        setSensorDistance(Math.max(5, Math.round(distToObstacle)));

        if (distToObstacle <= 20 && prev.y <= 160) {
          // Ultrasonic obstacle avoidance logic (turn left / change angle)
          setStatusMsg('Obstacol detectat (≤ 20 cm)! Viraj autonom stânga.');
          sounds.playWrong();
          return {
            x: prev.x + 2,
            y: prev.y + 15,
            angle: -30
          };
        } else if (prev.x >= 420) {
          // Reached red finish zone
          setColorDetected('roșu');
          setStatusMsg('Senzor de culoare: ROȘU! Misiune finalizată (ieșire labirint).');
          setIsRunning(false);
          sounds.playCorrect();
          return { ...prev, x: 440, angle: 0 };
        } else {
          // Normal advance forward
          setStatusMsg('Distanță > 20 cm. Deplasare înainte 30%.');
          setColorDetected('albastru');
          return {
            x: prev.x + 4,
            y: prev.y > 150 ? prev.y - 1 : prev.y,
            angle: prev.angle !== 0 ? prev.angle * 0.8 : 0
          };
        }
      });
    }, 120);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const resetRobot = () => {
    setIsRunning(false);
    setRobotPos({ x: 40, y: 150, angle: 0 });
    setSensorDistance(45);
    setTouchTriggered(false);
    setColorDetected('albastru');
    setStatusMsg('Robot resetat la punctul de start.');
    sounds.playClick();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>NXT RoboLab 2D Simulator</span>
              <span className="px-2 py-0.5 rounded-lg bg-green-500/20 text-green-300 text-[10px] font-mono font-bold uppercase">
                Open Roberta NEPO
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Senzor ultrasonic (port 4), tactil (port 1) și senzor de culoare (port 3) pentru navigație autonomă.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsRunning(!isRunning);
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition shadow-lg flex items-center gap-2 ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? 'Pauză' : 'Pornește Simularea'}
          </button>
          <button
            onClick={resetRobot}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Resetare"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2D Canvas Scene */}
      <div className="relative w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden select-none">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Obstacle 1 (Blue block) */}
        <div className="absolute left-[260px] top-[100px] w-12 h-24 bg-blue-600/90 border border-blue-400 rounded-xl shadow-lg flex items-center justify-center text-[10px] text-white font-bold text-center">
          Obstacol
        </div>

        {/* Finish Zone (Red line) */}
        <div className="absolute right-6 top-8 bottom-8 w-10 bg-red-600/80 border border-red-400 rounded-xl flex items-center justify-center text-[10px] text-white font-black [writing-mode:vertical-lr] tracking-widest">
          STOP ROȘU
        </div>

        {/* Autonomous Robot LEGO NXT */}
        <div
          style={{
            transform: `translate(${robotPos.x}px, ${robotPos.y}px) rotate(${robotPos.angle}deg)`,
            transition: 'transform 0.1s linear'
          }}
          className="absolute w-14 h-12 bg-slate-800 border-2 border-emerald-400 rounded-xl flex flex-col items-center justify-center shadow-xl"
        >
          {/* Ultrasonic Eyes */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span className="text-[9px] font-mono font-black text-white">NXT</span>
          {/* Wheels */}
          <span className="absolute -top-1 -left-1 w-3 h-2 bg-slate-950 rounded" />
          <span className="absolute -bottom-1 -left-1 w-3 h-2 bg-slate-950 rounded" />
          <span className="absolute -top-1 -right-1 w-3 h-2 bg-slate-950 rounded" />
          <span className="absolute -bottom-1 -right-1 w-3 h-2 bg-slate-950 rounded" />

          {/* Simulated Ultrasound Beam */}
          {isRunning && (
            <div
              style={{ width: `${sensorDistance * 3}px` }}
              className="absolute left-14 h-6 border-y border-r border-cyan-400/40 bg-cyan-400/10 pointer-events-none rounded-r-full"
            />
          )}
        </div>
      </div>

      {/* Sensor Dashboard telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Port 4: Senzor Ultrasonic</span>
          <span className="text-base font-mono font-black text-cyan-300">{sensorDistance} cm</span>
          <span className="text-[10px] text-slate-500 block">Prag evitare: 20 cm</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Port 1: Senzor Tactil</span>
          <span className={`text-base font-mono font-black ${touchTriggered ? 'text-rose-400' : 'text-emerald-400'}`}>
            {touchTriggered ? 'COLIZIUNE' : 'LIBER'}
          </span>
          <span className="text-[10px] text-slate-500 block">Buton revenire 5 cm</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Port 3: Senzor Culoare</span>
          <span className={`text-base font-mono font-black uppercase ${colorDetected === 'roșu' ? 'text-red-400' : 'text-blue-400'}`}>
            {colorDetected}
          </span>
          <span className="text-[10px] text-slate-500 block">Oprire buclă la roșu</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Stare Algoritm</span>
          <span className="text-xs font-bold text-white leading-tight">{statusMsg}</span>
        </div>
      </div>
    </div>
  );
};

interface Grade8InteractiveSimulatorsProps {
  initialTab?: 'excel' | 'web' | 'cpp' | 'robot';
  onClose?: () => void;
}

export const Grade8InteractiveSimulators: React.FC<Grade8InteractiveSimulatorsProps> = ({
  initialTab = 'excel',
  onClose
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'excel' | 'web' | 'cpp' | 'robot'>(initialTab);

  return (
    <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-heading">
              {lang === 'en' ? 'Interactive Labs & Simulators • 8th Grade' : 'Laboratoare Interactive & Simulatoare • Clasa a VIII-a'}
            </h3>
            <p className="text-xs text-emerald-400 font-mono">
              {lang === 'en'
                ? 'Spreadsheet Lab, Google Sites Builder, C++ Sequence Engine & 2D Robotics Arena'
                : 'Simulator Excel/Calc, Studio Web Google Sites, Consola Algoritmi C++ & Arena Roboți 2D'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('excel');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'excel'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel / Calc</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('web');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'web'
                ? 'bg-sky-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Sites</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cpp');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cpp'
                ? 'bg-indigo-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>C++ Engine</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('robot');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'robot'
                ? 'bg-teal-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>RoboSim 2D</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'excel' && <ExcelLabSim />}
        {activeTab === 'web' && <WebStudioSim />}
        {activeTab === 'cpp' && <CppSequencesSim />}
        {activeTab === 'robot' && <NxtRobotSim />}
      </div>
    </div>
  );
};

