import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Edit3,
  Layers,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  SkipBack,
  SkipForward,
  Table2,
  Terminal,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import {
  CPP_TRACE_PRESETS,
  CppTraceResult,
  TraceStep,
  TraceStepKind,
  traceCppCode,
} from '../../utils/cppTraceEngine';

interface CppTraceVisualizerProps {
  externalCode?: string | null;
  externalStdin?: string | null;
  externalLabel?: string | null;
  onSendToEditor?: (code: string, stdin: string) => void;
}

const SPEED_OPTIONS = [
  { label: '0.5×', ms: 1100 },
  { label: '1×', ms: 620 },
  { label: '2×', ms: 300 },
  { label: '4×', ms: 140 },
] as const;

function getKindBadgeStyle(kind: TraceStepKind): string {
  switch (kind) {
    case 'cond':
      return 'bg-sky-950/90 border-sky-500/50 text-sky-200';
    case 'loop':
      return 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200';
    case 'input':
      return 'bg-cyan-950/90 border-cyan-500/50 text-cyan-200';
    case 'output':
      return 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200';
    case 'array':
      return 'bg-amber-950/90 border-amber-500/50 text-amber-200';
    case 'call':
    case 'return':
      return 'bg-violet-950/90 border-violet-500/50 text-violet-200';
    case 'init':
      return 'bg-slate-800 border-slate-600 text-slate-200';
    default:
      return 'bg-teal-950/90 border-teal-500/50 text-teal-200';
  }
}

export const CppTraceVisualizer: React.FC<CppTraceVisualizerProps> = ({
  externalCode = null,
  externalStdin = null,
  externalLabel = null,
  onSendToEditor,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const defaultPreset = CPP_TRACE_PRESETS[0];
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    externalCode ? 'custom' : defaultPreset.id
  );
  const [sourceCode, setSourceCode] = useState<string>(() => externalCode || defaultPreset.code);
  const [stdinInput, setStdinInput] = useState<string>(() =>
    externalCode ? externalStdin || '' : defaultPreset.defaultStdin
  );
  const [showEditorPanel, setShowEditorPanel] = useState<boolean>(false);

  const [traceResult, setTraceResult] = useState<CppTraceResult>(() =>
    traceCppCode(externalCode || defaultPreset.code, externalCode ? externalStdin || '' : defaultPreset.defaultStdin)
  );

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedIdx, setSpeedIdx] = useState<number>(1);
  const [breakpoints, setBreakpoints] = useState<Set<number>>(() => new Set());
  const [breakpointNotice, setBreakpointNotice] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<'memory' | 'table'>('memory');

  // Sync external code pushes from Editor or Olympiad Arena
  useEffect(() => {
    if (externalCode) {
      setSelectedPresetId('custom');
      setSourceCode(externalCode);
      const nextStdin = externalStdin ?? '';
      setStdinInput(nextStdin);
      setIsPlaying(false);
      setBreakpoints(new Set());
      setBreakpointNotice(null);
      setTraceResult(traceCppCode(externalCode, nextStdin));
      setStepIndex(0);
    }
  }, [externalCode, externalStdin]);

  const totalTraceSteps = traceResult.steps.length;
  const activeStep: TraceStep | null =
    totalTraceSteps > 0 ? traceResult.steps[Math.min(stepIndex, totalTraceSteps - 1)] : null;

  const codeLines = useMemo(() => sourceCode.replace(/\r\n/g, '\n').split('\n'), [sourceCode]);

  // Playback timer with breakpoint auto-pause
  useEffect(() => {
    if (!isPlaying || totalTraceSteps === 0) return;
    if (stepIndex >= totalTraceSteps - 1) {
      setIsPlaying(false);
      return;
    }

    const delay = SPEED_OPTIONS[speedIdx]?.ms ?? 620;
    const timer = setTimeout(() => {
      const nextIdx = stepIndex + 1;
      const nextStep = traceResult.steps[nextIdx];
      setStepIndex(nextIdx);
      if (nextStep && breakpoints.has(nextStep.line)) {
        setIsPlaying(false);
        setBreakpointNotice(
          isEn
            ? `Paused at breakpoint on line ${nextStep.line}`
            : `Oprit automat la breakpoint pe linia ${nextStep.line}`
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, totalTraceSteps, speedIdx, traceResult.steps, breakpoints, isEn]);

  const handleRunTrace = (nextCode = sourceCode, nextStdin = stdinInput) => {
    sounds.playClick();
    setIsPlaying(false);
    setBreakpointNotice(null);
    const res = traceCppCode(nextCode, nextStdin);
    setTraceResult(res);
    setStepIndex(0);
  };

  const handleSelectPreset = (presetId: string) => {
    sounds.playClick();
    const found = CPP_TRACE_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(found.id);
    setSourceCode(found.code);
    setStdinInput(found.defaultStdin);
    setBreakpoints(new Set());
    setBreakpointNotice(null);
    setIsPlaying(false);
    setTraceResult(traceCppCode(found.code, found.defaultStdin));
    setStepIndex(0);
  };

  const toggleBreakpoint = (lineNum: number) => {
    sounds.playClick();
    setBreakpointNotice(null);
    setBreakpoints((prev) => {
      const next = new Set(prev);
      if (next.has(lineNum)) next.delete(lineNum);
      else next.add(lineNum);
      return next;
    });
  };

  const jumpToStep = (idx: number) => {
    if (totalTraceSteps === 0) return;
    setIsPlaying(false);
    setBreakpointNotice(null);
    setStepIndex(Math.max(0, Math.min(totalTraceSteps - 1, idx)));
  };

  const currentPreset = CPP_TRACE_PRESETS.find((p) => p.id === selectedPresetId);

  return (
    <div className="space-y-4">
      {/* Top Algorithm Selector & Toolbar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>
                {isEn
                  ? 'C++ Step-by-Step Execution & RAM Visualizer'
                  : 'Depanator Vizual C++ Pas-cu-Pas & Inspector Memorie RAM'}
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {externalLabel && selectedPresetId === 'custom'
                ? externalLabel
                : currentPreset
                ? isEn
                  ? currentPreset.descEn
                  : currentPreset.descRo
                : isEn
                ? 'Inspect every variable change, array swap, call stack frame, and condition live.'
                : 'Urmărește fiecare variabilă în RAM, modificările de vectori, stiva de apeluri și condițiile if/while.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <label htmlFor="cpp-trace-preset" className="sr-only">
              {isEn ? 'Algorithm Preset' : 'Algoritm model'}
            </label>
            <select
              id="cpp-trace-preset"
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="min-h-[38px] rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-400 max-w-full"
            >
              {selectedPresetId === 'custom' && (
                <option value="custom">
                  {isEn ? 'Custom Code Loaded' : 'Cod Personalizat Încărcat'}
                </option>
              )}
              {CPP_TRACE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {isEn ? p.titleEn : p.titleRo}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowEditorPanel((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>
                {showEditorPanel
                  ? isEn
                    ? 'Hide Code Editor'
                    : 'Ascunde Editorul'
                  : isEn
                  ? 'Edit Code & Input'
                  : 'Editează Cod & Intrare'}
              </span>
            </button>

            {onSendToEditor && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onSendToEditor(sourceCode, stdinInput);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isEn ? 'Open in Sandbox Editor' : 'Trimite în Editor'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Live Code & Stdin Edit Panel */}
        {showEditorPanel && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-8 space-y-1">
                <label htmlFor="trace-code-input" className="text-xs font-semibold text-slate-300">
                  {isEn ? 'C++ Source Code' : 'Cod Sursă C++'}
                </label>
                <textarea
                  id="trace-code-input"
                  rows={10}
                  value={sourceCode}
                  onChange={(e) => {
                    setSelectedPresetId('custom');
                    setSourceCode(e.target.value);
                  }}
                  spellCheck={false}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 font-mono text-xs text-slate-100 leading-5 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="lg:col-span-4 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <label htmlFor="trace-stdin-input" className="text-xs font-semibold text-slate-300">
                    {isEn ? 'Standard Input (cin)' : 'Date de intrare (cin)'}
                  </label>
                  <textarea
                    id="trace-stdin-input"
                    rows={5}
                    value={stdinInput}
                    onChange={(e) => setStdinInput(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 font-mono text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRunTrace()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Re-Build Execution Trace' : 'Recalculează Execuția Pas-cu-Pas'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Debugger Playback Transport Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => jumpToStep(0)}
              disabled={totalTraceSteps === 0 || stepIndex === 0}
              title={isEn ? 'Reset to Step 1' : 'Început (Pasul 1)'}
              className="inline-flex items-center gap-1 px-2.5 py-2 min-h-[38px] rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <SkipBack className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{isEn ? 'Start' : 'Început'}</span>
            </button>

            <button
              type="button"
              onClick={() => jumpToStep(stepIndex - 1)}
              disabled={totalTraceSteps === 0 || stepIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-2 min-h-[38px] rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'Step Back' : 'Înapoi'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setBreakpointNotice(null);
                if (stepIndex >= totalTraceSteps - 1) setStepIndex(0);
                setIsPlaying((prev) => !prev);
              }}
              disabled={totalTraceSteps === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg text-xs font-bold text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Pause' : 'Pauză'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Auto-Play' : 'Rulează Automat'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => jumpToStep(stepIndex + 1)}
              disabled={totalTraceSteps === 0 || stepIndex >= totalTraceSteps - 1}
              className="inline-flex items-center gap-1 px-3 py-2 min-h-[38px] rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isEn ? 'Step Next' : 'Pas Înainte'}</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => jumpToStep(totalTraceSteps - 1)}
              disabled={totalTraceSteps === 0 || stepIndex >= totalTraceSteps - 1}
              title={isEn ? 'Jump to Final Step' : 'Sari la Final'}
              className="inline-flex items-center gap-1 px-2.5 py-2 min-h-[38px] rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{isEn ? 'End' : 'Final'}</span>
            </button>

            {breakpoints.size > 0 && (
              <button
                type="button"
                onClick={() => {
                  setBreakpoints(new Set());
                  setBreakpointNotice(null);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-2 min-h-[38px] rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-xs font-semibold text-rose-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>
                  {isEn ? `Clear BP (${breakpoints.size})` : `Șterge BP (${breakpoints.size})`}
                </span>
              </button>
            )}
          </div>

          {/* Scrubber + Speed Control */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-1 xl:max-w-md">
            <input
              aria-label={isEn ? 'Step scrubber slider' : 'Glisor parcurgere pași'}
              type="range"
              min={0}
              max={Math.max(0, totalTraceSteps - 1)}
              value={stepIndex}
              onChange={(e) => jumpToStep(Number(e.target.value))}
              disabled={totalTraceSteps === 0}
              className="flex-1 min-w-[120px] accent-cyan-400 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-cyan-300 tabular-nums whitespace-nowrap">
              {totalTraceSteps > 0 ? `${isEn ? 'Step' : 'Pas'} ${stepIndex + 1} / ${totalTraceSteps}` : '0 / 0'}
            </span>
            <div className="inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-950 border border-slate-800">
              {SPEED_OPTIONS.map((sp, idx) => (
                <button
                  key={sp.label}
                  type="button"
                  onClick={() => setSpeedIdx(idx)}
                  className={`px-2 py-1 min-h-[30px] rounded-md text-[11px] font-mono font-bold cursor-pointer whitespace-nowrap ${
                    speedIdx === idx ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Errors / Diagnostics / Notices */}
      {traceResult.error && (
        <div
          role="alert"
          className="rounded-xl bg-rose-950/60 border border-rose-500/50 p-3.5 flex items-start gap-2.5 text-xs text-rose-200"
        >
          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="font-bold text-rose-300">{isEn ? 'Trace Execution Error' : 'Eroare la execuția Trace'}</div>
            <div className="font-mono mt-0.5">{traceResult.error}</div>
          </div>
        </div>
      )}

      {traceResult.diagnostic && (
        <div className="rounded-xl bg-amber-950/50 border border-amber-500/40 p-3 flex items-start gap-2.5 text-xs text-amber-100">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="text-amber-300">{isEn ? 'Tip: ' : 'Atenționare: '}</strong>
            {traceResult.diagnostic}
          </div>
        </div>
      )}

      {traceResult.truncated && (
        <div className="rounded-xl bg-amber-950/40 border border-amber-500/35 p-3 text-xs text-amber-100 tabular-nums">
          {isEn
            ? `Trace captured the first ${totalTraceSteps} frames out of ${traceResult.totalSteps} total steps.`
            : `Vizualizarea a capturat primele ${totalTraceSteps} cadre din totalul de ${traceResult.totalSteps} pași executați.`}
        </div>
      )}

      {breakpointNotice && (
        <div className="rounded-xl bg-rose-950/50 border border-rose-500/40 p-3 text-xs font-semibold text-rose-200">
          ● {breakpointNotice}
        </div>
      )}

      {/* Two-Zone Debugger Lab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT ZONE: Line-Highlighted Code + Step Narrative + Stdin Tape */}
        <section
          aria-label={isEn ? 'Traced C++ Source Code' : 'Cod Sursă C++ Urmărit'}
          className="lg:col-span-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col overflow-hidden"
        >
          {/* Code Header & Call Stack */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Code2 className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span className="font-mono font-bold text-slate-200">main.cpp</span>
              <span className="text-slate-400">
                · {isEn ? 'Click line number for breakpoint' : 'Click pe linie pentru breakpoint'}
              </span>
            </div>

            {activeStep && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-violet-300">
                <Layers className="w-3.5 h-3.5 text-violet-400 shrink-0" aria-hidden="true" />
                <span>{activeStep.callStack.join(' → ')}</span>
              </div>
            )}
          </div>

          {/* Interactive Code Lines */}
          <div className="flex-1 overflow-auto max-h-[380px] font-mono text-xs sm:text-[13px] py-2 bg-slate-950">
            {codeLines.map((lineText, i) => {
              const lineNum = i + 1;
              const isActive = activeStep?.line === lineNum;
              const hasBp = breakpoints.has(lineNum);
              return (
                <div
                  key={lineNum}
                  className={`flex items-stretch px-2 transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-white'
                      : hasBp
                      ? 'bg-rose-500/10 text-slate-200'
                      : 'text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleBreakpoint(lineNum)}
                    aria-label={
                      isEn
                        ? `Toggle breakpoint on line ${lineNum}`
                        : `Comută breakpoint pe linia ${lineNum}`
                    }
                    className={`w-12 pr-2.5 py-1 text-right select-none tabular-nums flex items-center justify-end gap-1.5 shrink-0 border-r border-slate-800/80 cursor-pointer ${
                      hasBp ? 'text-rose-300 font-bold' : isActive ? 'text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {hasBp && (
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full bg-rose-500 shrink-0"
                      />
                    )}
                    <span>{lineNum}</span>
                  </button>
                  <div className="w-5 flex items-center justify-center shrink-0 text-cyan-300 font-bold">
                    {isActive ? '▶' : ''}
                  </div>
                  <pre className="py-1 pr-3 whitespace-pre overflow-x-auto">{lineText || ' '}</pre>
                </div>
              );
            })}
          </div>

          {/* Step Narrative Callout */}
          {activeStep && (
            <div className="border-t border-slate-800 bg-slate-900/90 p-3.5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[11px] font-bold ${getKindBadgeStyle(
                    activeStep.kind
                  )}`}
                >
                  <span>{activeStep.tag}</span>
                  <span>·</span>
                  <span className="tabular-nums">
                    {isEn ? `Line ${activeStep.line}` : `Linia ${activeStep.line}`}
                  </span>
                </span>
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {isEn ? `Total ops: ${traceResult.totalSteps}` : `Operații totale: ${traceResult.totalSteps}`}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
                {isEn ? activeStep.explanationEn : activeStep.explanationRo}
              </p>

              {/* Stdin Input Stream Tape */}
              {traceResult.stdinTokens.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                    <span>{isEn ? 'Input Stream (cin)' : 'Bandă Intrare (cin)'}</span>
                    <span className="font-mono tabular-nums">
                      {activeStep.stdinCursor} / {traceResult.stdinTokens.length}{' '}
                      {isEn ? 'consumed' : 'citite'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs tabular-nums">
                    {traceResult.stdinTokens.map((tok, idx) => {
                      const consumed = idx < activeStep.stdinCursor;
                      const isNext = idx === activeStep.stdinCursor;
                      return (
                        <span
                          key={`${tok}-${idx}`}
                          className={`px-2 py-0.5 rounded border ${
                            consumed
                              ? 'bg-slate-900 border-slate-800 text-slate-500 line-through'
                              : isNext
                              ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                              : 'bg-slate-950 border-slate-700 text-slate-200'
                          }`}
                        >
                          {tok}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* RIGHT ZONE: RAM Variable Inspector + Live Array Bars + Trace Table */}
        <section
          aria-label={isEn ? 'Memory & Trace Inspector' : 'Inspector Memorie RAM și Tabel Urmărire'}
          className="lg:col-span-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col gap-4"
        >
          {/* Mode Tabs: Memory vs Trace Table */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div
              role="tablist"
              aria-label={isEn ? 'Inspector views' : 'Mod vizualizare inspector'}
              className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800"
            >
              <button
                type="button"
                role="tab"
                aria-selected={rightTab === 'memory'}
                onClick={() => setRightTab('memory')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-md text-xs font-bold cursor-pointer whitespace-nowrap ${
                  rightTab === 'memory' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isEn ? 'RAM & Arrays' : 'Memorie RAM & Vectori'}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={rightTab === 'table'}
                onClick={() => setRightTab('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-md text-xs font-bold cursor-pointer whitespace-nowrap ${
                  rightTab === 'table' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Table2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isEn ? 'Trace Table' : 'Tabel de Urmărire'}</span>
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400 tabular-nums whitespace-nowrap">
              {traceResult.durationMs} ms
            </span>
          </div>

          {rightTab === 'memory' ? (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Scalar Variables in RAM */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isEn ? 'Variables in Memory (RAM)' : 'Variabile în Memorie (RAM)'}
                </h3>
                {!activeStep || activeStep.vars.length === 0 ? (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-400">
                    {isEn ? 'No scalar variables allocated yet.' : 'Nicio variabilă scalară alocată la acest pas.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {activeStep.vars.map((v) => (
                      <div
                        key={`${v.scopeLabel}-${v.name}`}
                        className={`rounded-xl border p-2.5 transition-colors ${
                          v.changed
                            ? 'bg-amber-950/35 border-amber-400/60'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-[11px]">
                          <span className="font-mono font-bold text-white truncate">{v.name}</span>
                          <span className="font-mono text-slate-400">{v.type}</span>
                        </div>
                        <div className="mt-1 font-mono text-base font-extrabold text-cyan-300 tabular-nums truncate">
                          {v.value}
                        </div>
                        {v.changed && (
                          <div className="mt-1 text-[10px] font-mono font-bold text-amber-300 tabular-nums truncate">
                            {v.prevValue === null
                              ? isEn
                                ? 'NEW ALLOC'
                                : 'ALOCAT NOU'
                              : `${v.prevValue} → ${v.value}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Arrays Live Bar & Cell Visualizer */}
              {activeStep && activeStep.arrays.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isEn ? 'Arrays (1D Vectors)' : 'Vectori (Tablouri Unidimensionale)'}
                  </h3>
                  {activeStep.arrays.map((arr) => {
                    const numericValues = arr.values.map((val) =>
                      typeof val === 'number' ? Math.abs(val) : 0
                    );
                    const maxVal = Math.max(1, ...numericValues);
                    return (
                      <div
                        key={arr.name}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-white">
                            {arr.name}[{arr.activeLength}]
                          </span>
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className="text-sky-300 font-semibold">● READ</span>
                            <span className="text-amber-300 font-semibold">▲ WRITE</span>
                          </div>
                        </div>

                        <div className="flex items-end gap-1.5 overflow-x-auto pb-1 pt-2 min-h-[110px]">
                          {arr.values.map((val, idx) => {
                            const isWrite = arr.writeIndices.includes(idx);
                            const isRead = arr.readIndices.includes(idx);
                            const num = typeof val === 'number' ? Math.abs(val) : 10;
                            const barHeight = Math.max(18, Math.round((num / maxVal) * 68));
                            return (
                              <div
                                key={idx}
                                className="flex flex-col items-center gap-1 min-w-[38px] shrink-0"
                              >
                                <div className="text-[10px] font-mono font-bold h-3.5 text-center">
                                  {isWrite ? (
                                    <span className="text-amber-300">▲ W</span>
                                  ) : isRead ? (
                                    <span className="text-sky-300">● R</span>
                                  ) : null}
                                </div>
                                {arr.type === 'int' || arr.type === 'double' ? (
                                  <div
                                    style={{ height: `${barHeight}px` }}
                                    className={`w-7 rounded-t-md border transition-all ${
                                      isWrite
                                        ? 'bg-amber-500/75 border-amber-300'
                                        : isRead
                                        ? 'bg-sky-500/75 border-sky-300'
                                        : 'bg-slate-700 border-slate-600'
                                    }`}
                                  />
                                ) : null}
                                <div
                                  className={`w-full text-center px-1.5 py-1 rounded border font-mono text-xs font-bold tabular-nums ${
                                    isWrite
                                      ? 'bg-amber-950/70 border-amber-400 text-amber-200'
                                      : isRead
                                      ? 'bg-sky-950/70 border-sky-400 text-sky-200'
                                      : 'bg-slate-900 border-slate-700 text-slate-100'
                                  }`}
                                >
                                  {String(val)}
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                                  [{idx}]
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cumulative Stdout Console */}
              <div className="space-y-1.5 mt-auto">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>{isEn ? 'Console Output at Current Step' : 'Consolă Output până la Pasul Curent'}</span>
                </h3>
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 min-h-[76px] font-mono text-xs text-emerald-300 whitespace-pre-wrap">
                  {activeStep?.stdout
                    ? activeStep.stdout
                    : isEn
                    ? '(nothing printed yet at this step)'
                    : '(nu s-a afișat nimic încă până la acest pas)'}
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Clickable Trace Table */
            <div className="flex-1 overflow-auto max-h-[460px] rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left border-collapse font-mono text-[11px] tabular-nums">
                <thead className="bg-slate-900 text-slate-300 sticky top-0 z-10 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-2.5">{isEn ? 'Step' : 'Pas'}</th>
                    <th className="py-2 px-2">{isEn ? 'Line' : 'Linie'}</th>
                    <th className="py-2 px-2">{isEn ? 'Action' : 'Acțiune'}</th>
                    <th className="py-2 px-2.5">{isEn ? 'Variables Snapshot' : 'Stare Variabile'}</th>
                  </tr>
                </thead>
                <tbody>
                  {traceResult.steps.map((st, idx) => {
                    const isCur = idx === stepIndex;
                    return (
                      <tr
                        key={st.step}
                        onClick={() => jumpToStep(idx)}
                        className={`border-b border-slate-900 cursor-pointer transition-colors ${
                          isCur
                            ? 'bg-cyan-500/20 text-white'
                            : 'text-slate-300 hover:bg-slate-900/70'
                        }`}
                      >
                        <td className="py-1.5 px-2.5 font-bold text-cyan-300">{st.step}</td>
                        <td className="py-1.5 px-2">L{st.line}</td>
                        <td className="py-1.5 px-2 whitespace-nowrap">{st.tag}</td>
                        <td className="py-1.5 px-2.5 text-slate-200 max-w-[260px] truncate">
                          {st.vars
                            .map((v) => `${v.name}=${v.value}${v.changed ? '*' : ''}`)
                            .join(', ') || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
