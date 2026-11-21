import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Binary,
  Cpu,
  CircuitBoard,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  Coins,
  Code2,
  BookOpen,
  ChevronDown,
  Zap,
  Palette,
  SlidersHorizontal,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { addByteCoins } from '../../lib/studentAuthService';
import { AllMissionId } from '../../types';
import {
  AlgoId,
  ALGO_DEFINITIONS,
  ALGO_ARRAY_PRESETS,
  ALGO_CHALLENGES,
  BINARY_PUZZLES,
  CPU_PROGRAM_PRESETS,
  RamCell,
  LOGIC_TOPOLOGIES,
  LogicTopologyId,
  LOGIC_CHALLENGES,
  ALGO_CURRICULUM_BRIDGES,
  ALGO_LAB_FAQS,
  generateAlgorithmSteps,
} from '../../data/algoLabData';
import algoLabHeroImg from '../../assets/images/algo_lab_hero_banner_1795300424056.jpg';
import cpuDiagramImg from '../../assets/images/cpu_von_neumann_diagram_1795300422312.jpg';
import logicBoardImg from '../../assets/images/logic_gates_circuit_board_1795300424489.jpg';

interface AlgoCpuLabHubProps {
  studentName: string;
  onBackToCatalog: () => void;
  onSelectMission: (missionId: AllMissionId) => void;
  onOpenCppTrace: (code: string, stdin: string, label: string) => void;
  onOpenGlossary?: (slug?: string | null) => void;
}

type AlgoLabTab = 'algorithms' | 'binary' | 'cpu' | 'logic';

const STORAGE_KEY = 'arkedo_algo_lab_progress_v1';

interface AlgoLabProgress {
  solvedAlgoQuizzes: string[];
  solvedBinaryPuzzles: string[];
  solvedCpuQuizzes: string[];
  solvedLogicMissions: string[];
  earnedCoins: number;
}

function loadAlgoProgress(): AlgoLabProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AlgoLabProgress>;
      return {
        solvedAlgoQuizzes: Array.isArray(parsed.solvedAlgoQuizzes) ? parsed.solvedAlgoQuizzes : [],
        solvedBinaryPuzzles: Array.isArray(parsed.solvedBinaryPuzzles) ? parsed.solvedBinaryPuzzles : [],
        solvedCpuQuizzes: Array.isArray(parsed.solvedCpuQuizzes) ? parsed.solvedCpuQuizzes : [],
        solvedLogicMissions: Array.isArray(parsed.solvedLogicMissions) ? parsed.solvedLogicMissions : [],
        earnedCoins: typeof parsed.earnedCoins === 'number' ? parsed.earnedCoins : 0,
      };
    }
  } catch {
    // Ignore storage parse failure
  }
  return {
    solvedAlgoQuizzes: [],
    solvedBinaryPuzzles: [],
    solvedCpuQuizzes: [],
    solvedLogicMissions: [],
    earnedCoins: 0,
  };
}

function saveAlgoProgress(next: AlgoLabProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage write failure
  }
}

type CpuPhase = 'FETCH' | 'DECODE' | 'EXECUTE' | 'HALTED';

export const AlgoCpuLabHub: React.FC<AlgoCpuLabHubProps> = ({
  studentName,
  onBackToCatalog,
  onSelectMission,
  onOpenCppTrace,
  onOpenGlossary,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { triggerSuccess } = useArky();

  const [activeTab, setActiveTab] = useState<AlgoLabTab>('algorithms');
  const [progress, setProgress] = useState<AlgoLabProgress>(() => loadAlgoProgress());

  const rewardOnce = (
    bucket: 'solvedAlgoQuizzes' | 'solvedBinaryPuzzles' | 'solvedCpuQuizzes' | 'solvedLogicMissions',
    id: string,
    coins: number,
    reason: string
  ) => {
    setProgress((prev) => {
      if (prev[bucket].includes(id)) return prev;
      addByteCoins(coins, reason);
      const next: AlgoLabProgress = {
        ...prev,
        [bucket]: [...prev[bucket], id],
        earnedCoins: prev.earnedCoins + coins,
      };
      saveAlgoProgress(next);
      return next;
    });
  };

  // ============================================================================
  // TAB 1 STATE: ALGORITHMS VISUALIZER
  // ============================================================================
  const [selectedAlgoId, setSelectedAlgoId] = useState<AlgoId>('bubble');
  const currentAlgoDef = useMemo(
    () => ALGO_DEFINITIONS.find((a) => a.id === selectedAlgoId) || ALGO_DEFINITIONS[0],
    [selectedAlgoId]
  );

  const [arrayInputText, setArrayInputText] = useState<string>('42, 17, 65, 23, 88, 12, 54, 31');
  const [searchTarget, setSearchTarget] = useState<number>(71);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlayingAlgo, setIsPlayingAlgo] = useState<boolean>(false);
  const [algoSpeedMs, setAlgoSpeedMs] = useState<number>(550);
  const [algoQuizChoice, setAlgoQuizChoice] = useState<Record<string, number>>({});

  const parsedArray = useMemo(() => {
    const nums = arrayInputText
      .split(/[\s,;]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= 99)
      .slice(0, 14);
    return nums.length >= 3 ? nums : currentAlgoDef.defaultArray;
  }, [arrayInputText, currentAlgoDef]);

  const algoSteps = useMemo(
    () => generateAlgorithmSteps(selectedAlgoId, parsedArray, searchTarget),
    [selectedAlgoId, parsedArray, searchTarget]
  );

  const safeStepIdx = Math.min(stepIdx, Math.max(0, algoSteps.length - 1));
  const activeStep = algoSteps[safeStepIdx] || algoSteps[0];

  useEffect(() => {
    setStepIdx(0);
    setIsPlayingAlgo(false);
  }, [selectedAlgoId, arrayInputText, searchTarget]);

  useEffect(() => {
    if (!isPlayingAlgo) return;
    if (safeStepIdx >= algoSteps.length - 1) {
      setIsPlayingAlgo(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIdx((prev) => Math.min(algoSteps.length - 1, prev + 1));
    }, algoSpeedMs);
    return () => window.clearTimeout(timer);
  }, [isPlayingAlgo, safeStepIdx, algoSteps.length, algoSpeedMs]);

  const handleSelectAlgo = (id: AlgoId) => {
    sounds.playClick();
    setSelectedAlgoId(id);
    const def = ALGO_DEFINITIONS.find((d) => d.id === id);
    if (def) {
      setArrayInputText(def.defaultArray.join(', '));
      if (def.defaultTarget !== undefined) setSearchTarget(def.defaultTarget);
    }
  };

  // ============================================================================
  // TAB 2 STATE: BINARY / HEX / ASCII / RGB / BITWISE
  // ============================================================================
  const [byteValue, setByteValue] = useState<number>(42);
  const [operandB, setOperandB] = useState<number>(15);
  const [bitwiseOp, setBitwiseOp] = useState<'AND' | 'OR' | 'XOR' | 'SHL' | 'SHR'>('AND');
  const [rgbR, setRgbR] = useState<number>(16);
  const [rgbG, setRgbG] = useState<number>(185);
  const [rgbB, setRgbB] = useState<number>(129);
  const [activeBinaryPuzzleIdx, setActiveBinaryPuzzleIdx] = useState<number>(0);

  const currentBinaryPuzzle = BINARY_PUZZLES[activeBinaryPuzzleIdx];
  const toggleBit = (bitPos: number) => {
    sounds.playClick();
    setByteValue((prev) => prev ^ (1 << bitPos));
  };

  useEffect(() => {
    if (activeTab !== 'binary') return;
    if (byteValue === currentBinaryPuzzle.targetDecimal && !progress.solvedBinaryPuzzles.includes(currentBinaryPuzzle.id)) {
      sounds.playSuccess();
      rewardOnce(
        'solvedBinaryPuzzles',
        currentBinaryPuzzle.id,
        currentBinaryPuzzle.rewardCoins,
        `Laborator Binar: ${currentBinaryPuzzle.targetDecimal}`
      );
      triggerSuccess(
        isEn
          ? `Binary register locked on ${currentBinaryPuzzle.targetDecimal}! +${currentBinaryPuzzle.rewardCoins} ByteCoins!`
          : `Registru binar corect pe ${currentBinaryPuzzle.targetDecimal}! +${currentBinaryPuzzle.rewardCoins} ByteCoins!`
      );
    }
  }, [byteValue, activeTab, currentBinaryPuzzle, progress.solvedBinaryPuzzles, isEn, triggerSuccess]);

  const bitwiseResult = useMemo(() => {
    switch (bitwiseOp) {
      case 'AND':
        return byteValue & operandB;
      case 'OR':
        return byteValue | operandB;
      case 'XOR':
        return byteValue ^ operandB;
      case 'SHL':
        return (byteValue << 1) & 0xff;
      case 'SHR':
        return byteValue >> 1;
    }
  }, [byteValue, operandB, bitwiseOp]);

  const rgbHex = useMemo(() => {
    const hex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${hex(rgbR)}${hex(rgbG)}${hex(rgbB)}`;
  }, [rgbR, rgbG, rgbB]);

  // ============================================================================
  // TAB 3 STATE: VON NEUMANN CPU SIMULATOR
  // ============================================================================
  const [cpuPresetIdx, setCpuPresetIdx] = useState<number>(0);
  const activeCpuPreset = CPU_PROGRAM_PRESETS[cpuPresetIdx];
  const [cpuRam, setCpuRam] = useState<RamCell[]>(() => CPU_PROGRAM_PRESETS[0].ram.map((c) => ({ ...c })));
  const [cpuPc, setCpuPc] = useState<number>(0);
  const [cpuIr, setCpuIr] = useState<string>('IDLE');
  const [cpuMar, setCpuMar] = useState<number>(0);
  const [cpuAcc, setCpuAcc] = useState<number>(0);
  const [cpuZeroFlag, setCpuZeroFlag] = useState<boolean>(false);
  const [cpuPhase, setCpuPhase] = useState<CpuPhase>('FETCH');
  const [cpuOutputs, setCpuOutputs] = useState<number[]>([]);
  const [cpuStepCount, setCpuStepCount] = useState<number>(0);
  const [cpuRunning, setCpuRunning] = useState<boolean>(false);
  const [cpuLogMessage, setCpuLogMessage] = useState<string>('');
  const [cpuQuizChoice, setCpuQuizChoice] = useState<Record<string, number>>({});

  const resetCpuToPreset = (idx: number) => {
    const preset = CPU_PROGRAM_PRESETS[idx];
    setCpuPresetIdx(idx);
    setCpuRam(preset.ram.map((c) => ({ ...c })));
    setCpuPc(0);
    setCpuIr('IDLE');
    setCpuMar(0);
    setCpuAcc(0);
    setCpuZeroFlag(false);
    setCpuPhase('FETCH');
    setCpuOutputs([]);
    setCpuStepCount(0);
    setCpuRunning(false);
    setCpuLogMessage(isEn ? 'CPU Reset. Press Clock Step or Run.' : 'CPU resetat. Apasă Pas Ceas sau Rulează.');
  };

  const stepCpuClock = () => {
    if (cpuPhase === 'HALTED' || cpuStepCount > 90) {
      setCpuRunning(false);
      return;
    }

    if (cpuPhase === 'FETCH') {
      const cell = cpuRam[cpuPc];
      if (!cell) {
        setCpuPhase('HALTED');
        setCpuRunning(false);
        return;
      }
      setCpuMar(cpuPc);
      const instrText = `${cell.op} ${cell.arg}`;
      setCpuIr(instrText);
      setCpuPhase('DECODE');
      setCpuLogMessage(
        isEn
          ? `FETCH: PC (${cpuPc}) -> Read [${instrText}] from RAM[${cpuPc}] into IR.`
          : `FETCH: PC (${cpuPc}) -> Citit [${instrText}] din RAM[${cpuPc}] în registrul IR.`
      );
    } else if (cpuPhase === 'DECODE') {
      const cell = cpuRam[cpuPc];
      setCpuMar(cell.arg);
      setCpuPhase('EXECUTE');
      setCpuLogMessage(
        isEn
          ? `DECODE: Control Unit decodes ${cell.op} with operand/address ${cell.arg}.`
          : `DECODE: Unitatea de Control decodifică operația ${cell.op} cu operandul ${cell.arg}.`
      );
    } else if (cpuPhase === 'EXECUTE') {
      const cell = cpuRam[cpuPc];
      let nextPc = (cpuPc + 1) % 16;
      let nextAcc = cpuAcc;
      let nextHalted = false;
      const nextRam = cpuRam.map((c) => ({ ...c }));

      switch (cell.op) {
        case 'LOAD': {
          nextAcc = nextRam[cell.arg]?.arg ?? 0;
          setCpuLogMessage(
            isEn
              ? `EXECUTE LOAD: ACC <- RAM[${cell.arg}] (${nextAcc}).`
              : `EXECUTE LOAD: ACC <- RAM[${cell.arg}] (${nextAcc}).`
          );
          break;
        }
        case 'ADD': {
          const val = nextRam[cell.arg]?.arg ?? 0;
          nextAcc = cpuAcc + val;
          setCpuLogMessage(
            isEn
              ? `EXECUTE ADD (ALU): ACC = ${cpuAcc} + ${val} = ${nextAcc}.`
              : `EXECUTE ADD (ALU): ACC = ${cpuAcc} + ${val} = ${nextAcc}.`
          );
          break;
        }
        case 'SUB': {
          const val = nextRam[cell.arg]?.arg ?? 0;
          nextAcc = cpuAcc - val;
          setCpuLogMessage(
            isEn
              ? `EXECUTE SUB (ALU): ACC = ${cpuAcc} - ${val} = ${nextAcc}.`
              : `EXECUTE SUB (ALU): ACC = ${cpuAcc} - ${val} = ${nextAcc}.`
          );
          break;
        }
        case 'STORE': {
          if (nextRam[cell.arg]) {
            nextRam[cell.arg] = { addr: cell.arg, op: 'DATA', arg: cpuAcc };
          }
          setCpuRam(nextRam);
          setCpuLogMessage(
            isEn
              ? `EXECUTE STORE: RAM[${cell.arg}] <- ACC (${cpuAcc}).`
              : `EXECUTE STORE: RAM[${cell.arg}] <- ACC (${cpuAcc}).`
          );
          break;
        }
        case 'JMP': {
          nextPc = cell.arg;
          setCpuLogMessage(
            isEn ? `EXECUTE JMP: PC jumps to address ${cell.arg}.` : `EXECUTE JMP: Salt necondiționat la adresa ${cell.arg}.`
          );
          break;
        }
        case 'JZ': {
          if (cpuAcc === 0) {
            nextPc = cell.arg;
            setCpuLogMessage(
              isEn ? `EXECUTE JZ: ZERO FLAG is 1 -> Jump to ${cell.arg}!` : `EXECUTE JZ: ZERO FLAG = 1 -> Salt la ${cell.arg}!`
            );
          } else {
            setCpuLogMessage(
              isEn ? `EXECUTE JZ: ACC != 0 -> Continue to ${nextPc}.` : `EXECUTE JZ: ACC != 0 -> Continuă la ${nextPc}.`
            );
          }
          break;
        }
        case 'OUT': {
          setCpuOutputs((prev) => [...prev, cpuAcc]);
          setCpuLogMessage(
            isEn ? `EXECUTE OUT: Sent ${cpuAcc} to Output Console.` : `EXECUTE OUT: Trimis valoarea ${cpuAcc} la Consola Output.`
          );
          break;
        }
        case 'HALT':
        default: {
          nextHalted = true;
          setCpuLogMessage(isEn ? 'EXECUTE HALT: Program finished cleanly.' : 'EXECUTE HALT: Program oprit cu succes.');
          break;
        }
      }

      setCpuAcc(nextAcc);
      setCpuZeroFlag(nextAcc === 0);
      setCpuStepCount((prev) => prev + 1);
      if (nextHalted) {
        setCpuPhase('HALTED');
        setCpuRunning(false);
        sounds.playSuccess();
      } else {
        setCpuPc(nextPc);
        setCpuPhase('FETCH');
      }
    }
  };

  useEffect(() => {
    if (!cpuRunning) return;
    if (cpuPhase === 'HALTED') {
      setCpuRunning(false);
      return;
    }
    const timer = window.setTimeout(() => {
      stepCpuClock();
    }, 360);
    return () => window.clearTimeout(timer);
  });

  // ============================================================================
  // TAB 4 STATE: LOGIC GATES & CURRICULUM BRIDGES
  // ============================================================================
  const [logicTopologyId, setLogicTopologyId] = useState<LogicTopologyId>('HALF_ADDER');
  const [inputA, setInputA] = useState<boolean>(true);
  const [inputB, setInputB] = useState<boolean>(false);
  const [inputC, setInputC] = useState<boolean>(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const activeTopology = useMemo(
    () => LOGIC_TOPOLOGIES.find((t) => t.id === logicTopologyId) || LOGIC_TOPOLOGIES[0],
    [logicTopologyId]
  );

  const logicResult = useMemo(
    () => activeTopology.evaluate(inputA, inputB, inputC),
    [activeTopology, inputA, inputB, inputC]
  );

  useEffect(() => {
    if (activeTab !== 'logic') return;
    for (const ch of LOGIC_CHALLENGES) {
      if (
        ch.topology === logicTopologyId &&
        ch.targetA === inputA &&
        ch.targetB === inputB &&
        (ch.targetC === undefined || ch.targetC === inputC) &&
        !progress.solvedLogicMissions.includes(ch.id)
      ) {
        sounds.playSuccess();
        rewardOnce('solvedLogicMissions', ch.id, ch.rewardCoins, `Logic Gate Mission: ${ch.id}`);
        triggerSuccess(
          isEn
            ? `Circuit mission verified! +${ch.rewardCoins} ByteCoins!`
            : `Circuit logic verificat corect! +${ch.rewardCoins} ByteCoins!`
        );
      }
    }
  }, [activeTab, logicTopologyId, inputA, inputB, inputC, progress.solvedLogicMissions, isEn, triggerSuccess]);

  const totalMasteryCount =
    progress.solvedAlgoQuizzes.length +
    progress.solvedBinaryPuzzles.length +
    progress.solvedCpuQuizzes.length +
    progress.solvedLogicMissions.length;
  const maxMasteryCount =
    ALGO_CHALLENGES.length + BINARY_PUZZLES.length + CPU_PROGRAM_PRESETS.length + LOGIC_CHALLENGES.length;

  return (
    <div className="space-y-6 pb-8">
      {/* TOP BAR NAVIGATION */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBackToCatalog();
          }}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{isEn ? 'Back to Courses' : 'Înapoi la Cursuri'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums text-slate-300">
          <span>
            {studentName ? `${studentName} · ` : ''}
            {isEn ? 'Mastery' : 'Progres'}: <strong className="text-emerald-300">{totalMasteryCount}/{maxMasteryCount}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
            <Coins className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            +{progress.earnedCoins} ByteCoins
          </span>
        </div>
      </div>

      {/* HERO SHOWCASE */}
      <section className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="space-y-2.5">
              <div className="text-xs font-mono text-emerald-400 font-semibold">
                {isEn
                  ? 'Grades 5–8 · Sorting & Binary Search · 8-Bit ALU · Von Neumann CPU · Digital Logic'
                  : 'Clasele V–VIII · Sortări & Căutare Binară · Binar 8-Biți · CPU Von Neumann · Porți Logice'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight font-heading text-balance">
                {isEn
                  ? 'Visual Algorithms, Binary & CPU Architecture Lab'
                  : 'Laboratorul Vizual de Algoritmi, Binar & Arhitectură CPU'}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {isEn
                  ? 'Watch Bubble Sort, Selection Sort, Insertion Sort, and Binary Search animate step-by-step alongside C++ code, flip live 8-bit registers and RGB pixels, execute Von Neumann CPU Fetch–Decode–Execute cycles, and wire digital logic gates.'
                  : 'Urmărește pas cu pas animația algoritmilor de sortare și căutare binară sincronizată cu codul C++, comută biți 8-bit și culori RGB, rulează cicluri Fetch–Decode–Execute pe un CPU Von Neumann și testează porți logice cu tabel de adevăr live.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('algorithms');
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
              >
                <BarChart3 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{isEn ? 'Sorting & Search Arena' : 'Arena Algoritmi'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenCppTrace(currentAlgoDef.fullCppForSandbox, currentAlgoDef.defaultStdinForSandbox, currentAlgoDef.nameRo);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-200 text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
              >
                <Code2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{isEn ? 'Open Code in C++ Trace' : 'Rulează în C++ Trace'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 h-full">
              <img
                src={algoLabHeroImg}
                alt={isEn ? 'Visual Algorithms, Von Neumann CPU and 8-Bit Logic Lab' : 'Ilustrație Laborator Algoritmi Vizuali, CPU Von Neumann și Biți'}
                referrerPolicy="no-referrer"
                className="w-full h-full min-h-[190px] object-cover aspect-video lg:aspect-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LAB SECTION TABS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
        {[
          {
            id: 'algorithms' as AlgoLabTab,
            icon: BarChart3,
            labelRo: '01. Algoritmi Sortare & Căutare',
            labelEn: '01. Sorting & Binary Search',
          },
          {
            id: 'binary' as AlgoLabTab,
            icon: Binary,
            labelRo: '02. Binar, Hex, RGB & Bitwise',
            labelEn: '02. Binary, Hex, RGB & Bitwise',
          },
          {
            id: 'cpu' as AlgoLabTab,
            icon: Cpu,
            labelRo: '03. Simulator CPU Von Neumann',
            labelEn: '03. Von Neumann CPU Cycle',
          },
          {
            id: 'logic' as AlgoLabTab,
            icon: CircuitBoard,
            labelRo: '04. Porți Logice & Sumator',
            labelEn: '04. Logic Gates & Half-Adder',
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[42px] ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{isEn ? tab.labelEn : tab.labelRo}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: ALGORITHMS VISUALIZER & CHALLENGES                             */}
      {/* ===================================================================== */}
      {activeTab === 'algorithms' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT STAGE (60%+) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono text-emerald-400">
                    {isEn ? currentAlgoDef.gradeLabelEn : currentAlgoDef.gradeLabelRo} · {currentAlgoDef.complexityBest} / {currentAlgoDef.complexityWorst}
                  </div>
                  <h2 className="text-lg font-extrabold text-white font-heading">
                    {isEn ? currentAlgoDef.nameEn : currentAlgoDef.nameRo}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenCppTrace(
                      currentAlgoDef.fullCppForSandbox,
                      currentAlgoDef.defaultStdinForSandbox,
                      isEn ? currentAlgoDef.nameEn : currentAlgoDef.nameRo
                    );
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                >
                  <Code2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{isEn ? 'Trace in C++ Debugger' : 'Deschide în Debug C++'}</span>
                </button>
              </div>

              {/* BAR VISUALIZATION STAGE */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="h-56 flex items-end justify-center gap-1.5 sm:gap-2.5 pt-6">
                  {activeStep.array.map((val, idx) => {
                    const isSwapping = activeStep.swapping.includes(idx);
                    const isComparing = activeStep.comparing.includes(idx);
                    const isSorted = activeStep.sorted.includes(idx);
                    const isEliminated = activeStep.eliminated.includes(idx);
                    const isMid = activeStep.mid === idx;

                    let barClass = 'bg-sky-500/80 border-sky-400/50';
                    let stateTag = '';
                    if (isSwapping) {
                      barClass = 'bg-rose-500 border-rose-300';
                      stateTag = 'SWAP';
                    } else if (isMid) {
                      barClass = 'bg-cyan-400 border-cyan-200';
                      stateTag = 'MID';
                    } else if (isComparing) {
                      barClass = 'bg-amber-400 border-amber-200';
                      stateTag = 'CMP';
                    } else if (isSorted) {
                      barClass = 'bg-emerald-500 border-emerald-300';
                      stateTag = 'OK';
                    } else if (isEliminated) {
                      barClass = 'bg-slate-700/40 border-slate-700 opacity-45';
                    }

                    const heightPct = Math.max(14, Math.min(100, val));

                    return (
                      <div key={idx} className="flex-1 max-w-[48px] h-full flex flex-col items-center justify-end gap-1">
                        <span className="text-[10px] font-mono font-bold text-slate-300 tabular-nums h-4">
                          {stateTag}
                        </span>
                        <div
                          className={`w-full rounded-t-lg border transition-all duration-200 flex items-end justify-center pb-1 ${barClass}`}
                          style={{ height: `${heightPct}%` }}
                        >
                          <span className="text-[11px] font-mono font-black text-slate-950 tabular-nums">{val}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                          {activeStep.low === idx ? 'L·' : ''}
                          {activeStep.high === idx ? 'R·' : ''}
                          [{idx}]
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* LEGEND (DUAL CODED) */}
                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono text-slate-300">
                  <span><strong className="text-amber-300">[CMP]</strong> {isEn ? 'Comparing' : 'Comparare'}</span>
                  <span><strong className="text-rose-300">[SWAP]</strong> {isEn ? 'Swapping / Shifting' : 'Interschimbare'}</span>
                  <span><strong className="text-emerald-300">[OK]</strong> {isEn ? 'Sorted / Found' : 'Sortat / Găsit'}</span>
                  <span><strong className="text-cyan-300">[MID]</strong> {isEn ? 'Midpoint' : 'Mijloc'}</span>
                </div>
              </div>

              {/* LIVE STEP EXPLANATION & TELEMETRY */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums text-slate-300">
                  <span>
                    {isEn ? 'Step' : 'Pas'}: <strong className="text-white">{safeStepIdx + 1}/{algoSteps.length}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <span>{isEn ? 'Comparisons' : 'Comparații'}: <strong className="text-amber-300">{activeStep.comparisons}</strong></span>
                    <span>{isEn ? 'Swaps' : 'Schimburi'}: <strong className="text-rose-300">{activeStep.swaps}</strong></span>
                    <span>{isEn ? 'Reads' : 'Citiri'}: <strong className="text-cyan-300">{activeStep.reads}</strong></span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {isEn ? activeStep.explanationEn : activeStep.explanationRo}
                </p>
              </div>

              {/* PLAYBACK CONTROLS */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsPlayingAlgo(false);
                      setStepIdx(0);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                    aria-label={isEn ? 'Reset steps' : 'Resetează'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isEn ? 'Reset' : 'Reset'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsPlayingAlgo(false);
                      setStepIdx((p) => Math.max(0, p - 1));
                    }}
                    disabled={safeStepIdx === 0}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <SkipBack className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      if (safeStepIdx >= algoSteps.length - 1) setStepIdx(0);
                      setIsPlayingAlgo((p) => !p);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    {isPlayingAlgo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAlgo ? (isEn ? 'Pause' : 'Pauză') : isEn ? 'Play' : 'Pornește'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsPlayingAlgo(false);
                      setStepIdx((p) => Math.min(algoSteps.length - 1, p + 1));
                    }}
                    disabled={safeStepIdx >= algoSteps.length - 1}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {[
                    { label: '0.5×', ms: 900 },
                    { label: '1×', ms: 550 },
                    { label: '2×', ms: 260 },
                    { label: '4×', ms: 110 },
                  ].map((spd) => (
                    <button
                      key={spd.label}
                      type="button"
                      onClick={() => setAlgoSpeedMs(spd.ms)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                        algoSpeedMs === spd.ms ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT CONTROL & CODE DECK */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-300">
                  {isEn ? 'Select Algorithm' : 'Alege Algoritmul'}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {ALGO_DEFINITIONS.map((algo) => (
                    <button
                      key={algo.id}
                      type="button"
                      onClick={() => handleSelectAlgo(algo.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 min-h-[38px] ${
                        selectedAlgoId === algo.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {isEn ? algo.nameEn.split(' (')[0] : algo.nameRo.split(' (')[0]}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn ? currentAlgoDef.summaryEn : currentAlgoDef.summaryRo}
                </p>

                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isEn ? 'Array Values (3–14 numbers between 1 and 99)' : 'Elemente Vector (3–14 numere între 1 și 99)'}
                  </label>
                  <input
                    type="text"
                    value={arrayInputText}
                    onChange={(e) => setArrayInputText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {ALGO_ARRAY_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setArrayInputText(preset.values.join(', '));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {isEn ? preset.labelEn : preset.labelRo}
                      </button>
                    ))}
                  </div>
                </div>

                {currentAlgoDef.category === 'search' && (
                  <div className="pt-1 flex items-center justify-between gap-3">
                    <label className="text-xs font-semibold text-cyan-300">
                      {isEn ? 'Target Value:' : 'Valoare Căutată (target):'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={searchTarget}
                      onChange={(e) => setSearchTarget(Number(e.target.value) || 0)}
                      className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white tabular-nums"
                    />
                  </div>
                )}
              </div>

              {/* SYNCHRONIZED C++ CODE */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-slate-300">
                  {isEn ? 'Live C++ Execution Line' : 'Cod C++ Sincronizat cu Animația'}
                </div>
                <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono overflow-x-auto leading-relaxed">
                  {currentAlgoDef.cppLines.map((line, lIdx) => {
                    const active = activeStep.codeLine === lIdx;
                    return (
                      <div
                        key={lIdx}
                        className={`px-2 py-0.5 rounded tabular-nums ${
                          active ? 'bg-emerald-500/20 text-emerald-200 font-bold' : 'text-slate-400'
                        }`}
                      >
                        <span className="inline-block w-5 text-slate-600 select-none">{lIdx + 1}</span>
                        <span>{line}</span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          </div>

          {/* ALGORITHMS KNOWLEDGE CHALLENGES */}
          <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-extrabold text-white font-heading">
              {isEn ? 'Algorithm Complexity Challenges (+30 ByteCoins each)' : 'Provocări de Logică & Complexitate (+30 ByteCoins / întrebare)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALGO_CHALLENGES.map((q) => {
                const chosen = algoQuizChoice[q.id];
                const isSolved = progress.solvedAlgoQuizzes.includes(q.id);
                const opts = isEn ? q.optionsEn : q.optionsRo;
                return (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="text-xs font-mono text-amber-300 font-semibold">
                      {isSolved ? (isEn ? 'Solved (+30 ByteCoins)' : 'Rezolvat (+30 ByteCoins)') : '+30 ByteCoins'}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-white">{isEn ? q.questionEn : q.questionRo}</p>
                    <div className="space-y-1.5">
                      {opts.map((opt, oIdx) => {
                        const picked = chosen === oIdx;
                        const right = oIdx === q.correctIdx;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              setAlgoQuizChoice((prev) => ({ ...prev, [q.id]: oIdx }));
                              if (right) {
                                sounds.playSuccess();
                                rewardOnce('solvedAlgoQuizzes', q.id, q.rewardCoins, `Algo Challenge: ${q.id}`);
                              } else {
                                sounds.playError();
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                              picked
                                ? right
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                                  : 'bg-rose-950/60 border-rose-500 text-rose-200'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {chosen !== undefined && (
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        {isEn ? q.explanationEn : q.explanationRo}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: BINARY, HEX, ASCII, RGB & BITWISE 8-BIT STUDIO                 */}
      {/* ===================================================================== */}
      {activeTab === 'binary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 8-BIT REGISTER SWITCHBOARD */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-white font-heading">
                    {isEn ? 'Interactive 8-Bit Register (1 Byte)' : 'Registru Interactiv pe 8 Biți (1 Byte)'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {isEn ? 'Click any bit switch below to toggle between 0 (LOW) and 1 (HIGH).' : 'Apasă pe fiecare bit de mai jos ca să comuți între 0 (LOW) și 1 (HIGH).'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[0, 42, 65, 105, 255].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setByteValue(preset);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 tabular-nums cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 8 LED SWITCHES */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {[7, 6, 5, 4, 3, 2, 1, 0].map((bitPos) => {
                  const weight = 1 << bitPos;
                  const isOn = ((byteValue >> bitPos) & 1) === 1;
                  return (
                    <button
                      key={bitPos}
                      type="button"
                      onClick={() => toggleBit(bitPos)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isOn
                          ? 'bg-emerald-950/70 border-emerald-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">2^{bitPos} ({weight})</span>
                      <span className={`text-xl font-mono font-black tabular-nums ${isOn ? 'text-emerald-300' : 'text-slate-500'}`}>
                        {isOn ? '1' : '0'}
                      </span>
                      <span className="text-[10px] font-mono font-bold">
                        {isOn ? 'HIGH' : 'LOW'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* LIVE READOUTS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 tabular-nums">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">{isEn ? 'Decimal (Base 10)' : 'Zecimal (Baza 10)'}</div>
                  <div className="text-xl font-mono font-black text-white">{byteValue}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">{isEn ? 'Binary (Base 2)' : 'Binar (Baza 2)'}</div>
                  <div className="text-lg font-mono font-black text-emerald-300">{byteValue.toString(2).padStart(8, '0')}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">{isEn ? 'Hexadecimal (Base 16)' : 'Hexazecimal (Baza 16)'}</div>
                  <div className="text-xl font-mono font-black text-cyan-300">0x{byteValue.toString(16).padStart(2, '0').toUpperCase()}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">ASCII Symbol</div>
                  <div className="text-xl font-mono font-black text-amber-300">
                    {byteValue >= 32 && byteValue <= 126 ? `'${String.fromCharCode(byteValue)}'` : 'CTRL'}
                  </div>
                </div>
              </div>

              {/* BITWISE ALU PLAYGROUND */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                    <span>{isEn ? 'Bitwise C++ Operator Playground' : 'Simulator Operatori pe Biți (Bitwise C++)'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(['AND', 'OR', 'XOR', 'SHL', 'SHR'] as const).map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setBitwiseOp(op);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                          bitwiseOp === op ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {op === 'AND' ? 'A & B' : op === 'OR' ? 'A | B' : op === 'XOR' ? 'A ^ B' : op === 'SHL' ? 'A << 1' : 'A >> 1'}
                      </button>
                    ))}
                  </div>
                </div>

                {(bitwiseOp === 'AND' || bitwiseOp === 'OR' || bitwiseOp === 'XOR') && (
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-mono text-slate-300 whitespace-nowrap">Operand B: {operandB}</label>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={operandB}
                      onChange={(e) => setOperandB(Number(e.target.value))}
                      className="flex-1 accent-cyan-400"
                    />
                  </div>
                )}

                <div className="font-mono text-xs space-y-1 tabular-nums bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">A ({byteValue}):</span>
                    <span className="text-emerald-300 tracking-widest">{byteValue.toString(2).padStart(8, '0')}</span>
                  </div>
                  {(bitwiseOp === 'AND' || bitwiseOp === 'OR' || bitwiseOp === 'XOR') && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">B ({operandB}):</span>
                      <span className="text-sky-300 tracking-widest">{operandB.toString(2).padStart(8, '0')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                    <span className="text-amber-300">{isEn ? 'Result' : 'Rezultat'} ({bitwiseResult}):</span>
                    <span className="text-amber-300 tracking-widest">{bitwiseResult.toString(2).padStart(8, '0')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BINARY MISSIONS + 24-BIT RGB MIXER */}
            <div className="lg:col-span-5 space-y-4">
              {/* BINARY PUZZLE DECK */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-white font-heading">
                    {isEn ? 'Binary Encoding Puzzles' : 'Misiuni de Codificare Binară'}
                  </h3>
                  <span className="text-xs font-mono text-amber-300 tabular-nums">
                    +{currentBinaryPuzzle.rewardCoins} ByteCoins
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {BINARY_PUZZLES.map((puz, idx) => {
                    const done = progress.solvedBinaryPuzzles.includes(puz.id);
                    return (
                      <button
                        key={puz.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setActiveBinaryPuzzleIdx(idx);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1 cursor-pointer ${
                          activeBinaryPuzzleIdx === idx
                            ? 'bg-emerald-600 text-white'
                            : done
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border border-slate-800 text-slate-300'
                        }`}
                      >
                        {done && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                        <span>#{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-100">
                  {isEn ? currentBinaryPuzzle.promptEn : currentBinaryPuzzle.promptRo}
                </p>
                <p className="text-xs text-slate-400">
                  {isEn ? currentBinaryPuzzle.hintEn : currentBinaryPuzzle.hintRo}
                </p>

                <div className="text-xs font-mono tabular-nums">
                  {progress.solvedBinaryPuzzles.includes(currentBinaryPuzzle.id) ? (
                    <span className="text-emerald-300 font-bold inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {isEn ? 'Target matched! Reward credited.' : 'Valoare formată corect! Recompensă acordată.'}
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      {isEn ? 'Current value' : 'Valoare curentă'}: <strong>{byteValue}</strong> / {currentBinaryPuzzle.targetDecimal}
                    </span>
                  )}
                </div>
              </div>

              {/* 24-BIT RGB COLOR MIXER */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 font-heading">
                    <Palette className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    <span>{isEn ? '24-Bit RGB Pixel Lab (3 Bytes)' : 'Mixaj Pixel RGB 24-Biți (3 Bytes)'}</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-cyan-300 tabular-nums">{rgbHex}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-xl border border-slate-700 shrink-0"
                    style={{ backgroundColor: rgbHex }}
                    aria-label={`RGB preview ${rgbHex}`}
                  />
                  <div className="flex-1 space-y-2 text-xs font-mono tabular-nums">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-rose-300">R: {rgbR}</span>
                      <input type="range" min={0} max={255} value={rgbR} onChange={(e) => setRgbR(Number(e.target.value))} className="flex-1 accent-rose-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-emerald-300">G: {rgbG}</span>
                      <input type="range" min={0} max={255} value={rgbG} onChange={(e) => setRgbG(Number(e.target.value))} className="flex-1 accent-emerald-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-sky-300">B: {rgbB}</span>
                      <input type="range" min={0} max={255} value={rgbB} onChange={(e) => setRgbB(Number(e.target.value))} className="flex-1 accent-sky-500" />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                  24-bit: {rgbR.toString(2).padStart(8, '0')} · {rgbG.toString(2).padStart(8, '0')} · {rgbB.toString(2).padStart(8, '0')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: VON NEUMANN CPU SIMULATOR                                      */}
      {/* ===================================================================== */}
      {activeTab === 'cpu' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT: CPU REGISTERS & CONTROL BUS STAGE */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono text-cyan-400 font-semibold">
                    {isEn ? 'Von Neumann Architecture · Fetch -> Decode -> Execute' : 'Arhitectura Von Neumann · Fetch -> Decode -> Execute'}
                  </div>
                  <h2 className="text-lg font-extrabold text-white font-heading">
                    {isEn ? activeCpuPreset.nameEn : activeCpuPreset.nameRo}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      resetCpuToPreset(cpuPresetIdx);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reset' : 'Reset'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCpuRunning(false);
                      stepCpuClock();
                    }}
                    disabled={cpuPhase === 'HALTED'}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Clock Step' : 'Pas Ceas'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      if (cpuPhase === 'HALTED') resetCpuToPreset(cpuPresetIdx);
                      setCpuRunning((r) => !r);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    {cpuRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{cpuRunning ? (isEn ? 'Pause' : 'Pauză') : isEn ? 'Auto Run' : 'Rulează'}</span>
                  </button>
                </div>
              </div>

              {/* CPU REGISTERS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 tabular-nums">
                <div className={`p-3 rounded-xl border ${cpuPhase === 'FETCH' ? 'bg-cyan-950/60 border-cyan-400' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="text-[11px] font-mono text-slate-400">PC (Addr)</div>
                  <div className="text-lg font-mono font-black text-white">0x{cpuPc.toString(16).toUpperCase().padStart(2, '0')} ({cpuPc})</div>
                </div>
                <div className={`p-3 rounded-xl border ${cpuPhase === 'DECODE' ? 'bg-amber-950/60 border-amber-400' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="text-[11px] font-mono text-slate-400">IR (Instr)</div>
                  <div className="text-sm sm:text-base font-mono font-black text-amber-300 truncate">{cpuIr}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">MAR (Bus)</div>
                  <div className="text-lg font-mono font-black text-sky-300">RAM[{cpuMar}]</div>
                </div>
                <div className={`p-3 rounded-xl border ${cpuPhase === 'EXECUTE' ? 'bg-emerald-950/60 border-emerald-400' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="text-[11px] font-mono text-slate-400">ACC (ALU)</div>
                  <div className="text-lg font-mono font-black text-emerald-300">{cpuAcc}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">ZERO FLAG</div>
                  <div className={`text-lg font-mono font-black ${cpuZeroFlag ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {cpuZeroFlag ? '1 (Z)' : '0'}
                  </div>
                </div>
              </div>

              {/* CONTROL UNIT PHASE INDICATOR + LOG */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    {(['FETCH', 'DECODE', 'EXECUTE', 'HALTED'] as CpuPhase[]).map((ph) => (
                      <span
                        key={ph}
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          cpuPhase === ph
                            ? ph === 'HALTED'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-cyan-600 text-white'
                            : 'bg-slate-950 text-slate-500'
                        }`}
                      >
                        {ph}
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-400 tabular-nums">
                    {isEn ? 'Cycles' : 'Cicluri'}: {cpuStepCount}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-mono text-slate-200">{cpuLogMessage || (isEn ? activeCpuPreset.descriptionEn : activeCpuPreset.descriptionRo)}</p>
              </div>

              {/* 16-CELL RAM MEMORY MATRIX */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold">{isEn ? 'Unified RAM Matrix (0x00 .. 0x0F)' : 'Matrice Memorie RAM Unificată (0x00 .. 0x0F)'}</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {isEn ? 'Click DATA values to edit operands' : 'Poți modifica valorile DATA'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 tabular-nums">
                  {cpuRam.map((cell) => {
                    const isPcTarget = cell.addr === cpuPc && cpuPhase !== 'HALTED';
                    const isMarTarget = cell.addr === cpuMar && cpuPhase === 'EXECUTE';
                    return (
                      <div
                        key={cell.addr}
                        className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between gap-1 ${
                          isPcTarget
                            ? 'bg-cyan-950/60 border-cyan-400 text-white'
                            : isMarTarget
                            ? 'bg-amber-950/50 border-amber-400 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-slate-500">[{cell.addr.toString().padStart(2, '0')}]</span>
                        {cell.op === 'DATA' ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">DAT</span>
                            <input
                              type="number"
                              min={0}
                              max={255}
                              value={cell.arg}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                                setCpuRam((prev) =>
                                  prev.map((c) => (c.addr === cell.addr ? { ...c, arg: val } : c))
                                );
                              }}
                              className="w-11 px-1 py-0.5 rounded bg-slate-950 border border-slate-700 text-right text-emerald-300 font-bold"
                            />
                          </div>
                        ) : (
                          <span className="font-bold text-white">
                            {cell.op} {cell.op === 'HALT' || cell.op === 'OUT' ? '' : cell.arg}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OUTPUT CONSOLE */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums">
                <span className="text-slate-400">{isEn ? 'CPU Output Console (OUT):' : 'Consolă Ieșire CPU (OUT):'}</span>
                <span className="font-bold text-emerald-300">
                  {cpuOutputs.length > 0 ? cpuOutputs.join(', ') : (isEn ? 'No OUT executed yet' : 'Niciun OUT executat încă')}
                </span>
              </div>
            </div>

            {/* RIGHT: PROGRAM SELECTOR + DIAGRAM + QUIZ */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-300">
                  {isEn ? 'Assembly Programs' : 'Programe Assembly Preconfigurate'}
                </h3>
                <div className="space-y-1.5">
                  {CPU_PROGRAM_PRESETS.map((pr, idx) => (
                    <button
                      key={pr.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        resetCpuToPreset(idx);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                        cpuPresetIdx === idx
                          ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {isEn ? pr.nameEn : pr.nameRo}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn ? activeCpuPreset.expectedGoalEn : activeCpuPreset.expectedGoalRo}
                </p>
              </div>

              {/* ARCHITECTURE VISUAL */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <img
                  src={cpuDiagramImg}
                  alt="Von Neumann CPU Control Unit, ALU, Registers and RAM Bus Diagram"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              {/* CPU QUESTION */}
              {activeCpuPreset.challengeQuestionRo && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <div className="text-xs font-mono text-amber-300 font-semibold">
                    {progress.solvedCpuQuizzes.includes(activeCpuPreset.id)
                      ? isEn ? 'Verified (+35 ByteCoins)' : 'Verificat (+35 ByteCoins)'
                      : `+${activeCpuPreset.rewardCoins} ByteCoins`}
                  </div>
                  <p className="text-xs font-bold text-white">
                    {isEn ? activeCpuPreset.challengeQuestionEn : activeCpuPreset.challengeQuestionRo}
                  </p>
                  <div className="space-y-1.5">
                    {(isEn ? activeCpuPreset.challengeOptionsEn : activeCpuPreset.challengeOptionsRo)?.map((opt, idx) => {
                      const picked = cpuQuizChoice[activeCpuPreset.id] === idx;
                      const right = idx === activeCpuPreset.challengeCorrectIdx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCpuQuizChoice((prev) => ({ ...prev, [activeCpuPreset.id]: idx }));
                            if (right) {
                              sounds.playSuccess();
                              rewardOnce('solvedCpuQuizzes', activeCpuPreset.id, activeCpuPreset.rewardCoins, `CPU Quiz: ${activeCpuPreset.id}`);
                            } else {
                              sounds.playError();
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs border cursor-pointer ${
                            picked
                              ? right
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                                : 'bg-rose-950/60 border-rose-500 text-rose-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: LOGIC GATES, HALF-ADDER & CURRICULUM BRIDGES                   */}
      {/* ===================================================================== */}
      {activeTab === 'logic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT: DIGITAL GATE CANVAS & TRUTH TABLE */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-white font-heading">
                    {isEn ? activeTopology.nameEn : activeTopology.nameRo}
                  </h2>
                  <p className="text-xs font-mono text-cyan-300 font-semibold">{activeTopology.formula}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LOGIC_TOPOLOGIES.map((top) => (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setLogicTopologyId(top.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                        logicTopologyId === top.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {top.id.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isEn ? activeTopology.descriptionEn : activeTopology.descriptionRo}
              </p>

              {/* INTERACTIVE GATE SVG & INPUT TOGGLES */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* INPUT SWITCHES */}
                <div className="sm:col-span-4 space-y-2.5">
                  {[
                    {
                      label: isEn ? activeTopology.inputALabelEn : activeTopology.inputALabelRo,
                      val: inputA,
                      toggle: () => setInputA((v) => !v),
                    },
                    {
                      label: isEn ? activeTopology.inputBLabelEn : activeTopology.inputBLabelRo,
                      val: inputB,
                      toggle: () => setInputB((v) => !v),
                    },
                    ...(activeTopology.id === 'CLASS_ALARM'
                      ? [
                          {
                            label: isEn ? activeTopology.inputCLabelEn || 'C' : activeTopology.inputCLabelRo || 'C',
                            val: inputC,
                            toggle: () => setInputC((v) => !v),
                          },
                        ]
                      : []),
                  ].map((sw, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        sw.toggle();
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border flex items-center justify-between text-xs font-bold cursor-pointer ${
                        sw.val
                          ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200'
                          : 'bg-slate-950 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{sw.label}</span>
                      <span className="font-mono tabular-nums">{sw.val ? '1 (HIGH)' : '0 (LOW)'}</span>
                    </button>
                  ))}
                </div>

                {/* SVG GATE WIRE SCHEMATIC */}
                <div className="sm:col-span-4 flex justify-center">
                  <svg viewBox="0 0 220 140" className="w-full max-w-[220px]" aria-label="Digital logic gate signal diagram">
                    <line x1="10" y1="40" x2="80" y2="40" stroke={inputA ? '#34d399' : '#475569'} strokeWidth="4" strokeLinecap="round" />
                    <line x1="10" y1="85" x2="80" y2="85" stroke={inputB ? '#34d399' : '#475569'} strokeWidth="4" strokeLinecap="round" />
                    {activeTopology.id === 'CLASS_ALARM' && (
                      <line x1="10" y1="120" x2="80" y2="120" stroke={inputC ? '#38bdf8' : '#475569'} strokeWidth="4" strokeLinecap="round" />
                    )}
                    <rect x="75" y="25" width="75" height="90" rx="12" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                    <text x="112" y="75" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="monospace">
                      {activeTopology.id === 'HALF_ADDER' ? 'ADDER' : activeTopology.id === 'CLASS_ALARM' ? 'ALARM' : activeTopology.id}
                    </text>
                    <line x1="150" y1={logicResult.secondary !== undefined ? '52' : '70'} x2="210" y2={logicResult.secondary !== undefined ? '52' : '70'} stroke={logicResult.primary ? '#34d399' : '#475569'} strokeWidth="5" strokeLinecap="round" />
                    {logicResult.secondary !== undefined && (
                      <line x1="150" y1="92" x2="210" y2="92" stroke={logicResult.secondary ? '#38bdf8' : '#475569'} strokeWidth="5" strokeLinecap="round" />
                    )}
                  </svg>
                </div>

                {/* OUTPUT LEDS */}
                <div className="sm:col-span-4 space-y-2.5">
                  <div
                    className={`p-3 rounded-xl border text-center ${
                      logicResult.primary ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-[11px] font-mono">{isEn ? logicResult.primaryLabelEn : logicResult.primaryLabelRo}</div>
                    <div className="text-xl font-mono font-black tabular-nums">
                      {logicResult.primary ? '1 · HIGH' : '0 · LOW'}
                    </div>
                  </div>
                  {logicResult.secondary !== undefined && (
                    <div
                      className={`p-3 rounded-xl border text-center ${
                        logicResult.secondary ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[11px] font-mono">{isEn ? logicResult.secondaryLabelEn : logicResult.secondaryLabelRo}</div>
                      <div className="text-xl font-mono font-black tabular-nums">
                        {logicResult.secondary ? '1 · CARRY' : '0 · LOW'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* LIVE TRUTH TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono tabular-nums border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-3 text-left">A</th>
                      <th className="py-2 px-3 text-left">B</th>
                      {activeTopology.id === 'CLASS_ALARM' && <th className="py-2 px-3 text-left">C</th>}
                      <th className="py-2 px-3 text-left">{isEn ? logicResult.primaryLabelEn : logicResult.primaryLabelRo}</th>
                      {logicResult.secondary !== undefined && <th className="py-2 px-3 text-left">CARRY</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [false, false],
                      [false, true],
                      [true, false],
                      [true, true],
                    ].map(([aVal, bVal], rIdx) => {
                      const rowEval = activeTopology.evaluate(aVal, bVal, inputC);
                      const isActiveRow = aVal === inputA && bVal === inputB;
                      return (
                        <tr
                          key={rIdx}
                          className={`border-b border-slate-900 ${
                            isActiveRow ? 'bg-emerald-950/60 text-white font-bold' : 'text-slate-400'
                          }`}
                        >
                          <td className="py-2 px-3">{aVal ? '1' : '0'}</td>
                          <td className="py-2 px-3">{bVal ? '1' : '0'}</td>
                          {activeTopology.id === 'CLASS_ALARM' && <td className="py-2 px-3">{inputC ? '1' : '0'}</td>}
                          <td className={`py-2 px-3 ${rowEval.primary ? 'text-emerald-300' : 'text-slate-400'}`}>
                            {rowEval.primary ? '1' : '0'}
                          </td>
                          {rowEval.secondary !== undefined && (
                            <td className={`py-2 px-3 ${rowEval.secondary ? 'text-cyan-300' : 'text-slate-400'}`}>
                              {rowEval.secondary ? '1' : '0'}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT: HARDWARE BOARD VISUAL + CIRCUIT MISSIONS */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <img
                  src={logicBoardImg}
                  alt="Digital 8-bit LED breadboard with IC logic chips and DIP toggle switches"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 font-heading">
                  <Zap className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  <span>{isEn ? 'Circuit Verification Missions (+35 ByteCoins each)' : 'Misiuni de Logică Digitală (+35 ByteCoins)'}</span>
                </h3>
                <div className="space-y-2">
                  {LOGIC_CHALLENGES.map((ch) => {
                    const done = progress.solvedLogicMissions.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setLogicTopologyId(ch.topology);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs space-y-1 cursor-pointer ${
                          done
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-cyan-300">{ch.topology}</span>
                          <span className={done ? 'text-emerald-300 font-bold' : 'text-amber-300'}>
                            {done ? (isEn ? 'Completed' : 'Completat') : `+${ch.rewardCoins} ByteCoins`}
                          </span>
                        </div>
                        <p className="leading-relaxed">{isEn ? ch.promptEn : ch.promptRo}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CURRICULUM BRIDGES & FAQ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-heading">
                <BookOpen className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>{isEn ? 'Connected National Curriculum Lessons' : 'Lecții & Termeni din Programa TIC'}</span>
              </h3>
              <div className="space-y-2.5">
                {ALGO_CURRICULUM_BRIDGES.map((br) => (
                  <div key={br.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="text-[11px] font-mono text-emerald-300">{isEn ? br.gradeEn : br.gradeRo}</div>
                    <div className="text-xs sm:text-sm font-bold text-white">{isEn ? br.titleEn : br.titleRo}</div>
                    <p className="text-xs text-slate-300">{isEn ? br.descriptionEn : br.descriptionRo}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onSelectMission(br.missionId);
                        }}
                        className="text-xs font-bold text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isEn ? 'Open Lesson' : 'Deschide Lecția'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      {onOpenGlossary && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            onOpenGlossary(isEn ? br.glossarySlugEn : br.glossarySlugRo);
                          }}
                          className="text-xs font-bold text-slate-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isEn ? 'Glossary Entry' : 'Termen Glosar'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-base font-extrabold text-white font-heading">
                {isEn ? 'Frequently Asked Questions' : 'Întrebări Frecvente — Algoritmi & CPU'}
              </h3>
              <div className="space-y-2">
                {ALGO_LAB_FAQS.map((faq, idx) => {
                  const open = openFaqIdx === idx;
                  return (
                    <div key={idx} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(open ? null : idx)}
                        className="w-full px-3.5 py-3 text-left flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-white cursor-pointer"
                      >
                        <span>{isEn ? faq.qEn : faq.qRo}</span>
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </button>
                      {open && (
                        <div className="px-3.5 pb-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-2">
                          {isEn ? faq.aEn : faq.aRo}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
