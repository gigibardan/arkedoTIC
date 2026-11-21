import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Search,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  SlidersHorizontal,
  Volume2,
  Video,
  Newspaper,
  Image as ImageIcon,
  Wand2,
  BookOpen,
  ChevronDown,
  AlertTriangle,
  Gamepad2,
  Coins,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { addByteCoins } from '../../lib/studentAuthService';
import { AllMissionId } from '../../types';
import {
  TOKENIZER_PRESETS,
  tokenizeText,
  NEXT_TOKEN_SCENARIOS,
  computeSoftmaxProbabilities,
  HALLUCINATION_STRESS_TESTS,
  DEEPFAKE_FORENSIC_CASES,
  PROMPT_ARCHITECT_CHALLENGES,
  AI_CURRICULUM_BRIDGES,
  AI_LAB_FAQS,
} from '../../data/aiLabData';
import aiLabHeroImg from '../../assets/images/ai_lab_hero_banner_1795298318261.jpg';
import aiEvidenceFakeImg from '../../assets/images/ai_evidence_fake_campus_1795298317936.jpg';
import aiEvidenceRealImg from '../../assets/images/ai_evidence_real_lab_1795298318261.jpg';

interface AiDeepfakeLabHubProps {
  studentName: string;
  onBackToCatalog: () => void;
  onSelectMission: (missionId: AllMissionId) => void;
  onOpenCyberSafeDetective?: () => void;
  onOpenGlossary?: (slug?: string | null) => void;
}

type LabTabId = 'llm' | 'deepfake' | 'prompt' | 'guide';

const STORAGE_KEY = 'arkedo_ai_lab_progress_v1';

interface AiLabProgressState {
  solvedDeepfakes: string[];
  solvedHallucinations: string[];
  solvedPrompts: string[];
  earnedCoins: number;
}

function loadLabProgress(): AiLabProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AiLabProgressState>;
      return {
        solvedDeepfakes: Array.isArray(parsed.solvedDeepfakes) ? parsed.solvedDeepfakes : [],
        solvedHallucinations: Array.isArray(parsed.solvedHallucinations) ? parsed.solvedHallucinations : [],
        solvedPrompts: Array.isArray(parsed.solvedPrompts) ? parsed.solvedPrompts : [],
        earnedCoins: typeof parsed.earnedCoins === 'number' ? parsed.earnedCoins : 0,
      };
    }
  } catch {}
  return { solvedDeepfakes: [], solvedHallucinations: [], solvedPrompts: [], earnedCoins: 0 };
}

export const AiDeepfakeLabHub: React.FC<AiDeepfakeLabHubProps> = ({
  studentName,
  onBackToCatalog,
  onSelectMission,
  onOpenCyberSafeDetective,
  onOpenGlossary,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const arky = useArky();

  const [activeTab, setActiveTab] = useState<LabTabId>('llm');
  const [progress, setProgress] = useState<AiLabProgressState>(() => loadLabProgress());
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // --- TAB 1 STATE: TOKENIZER + TEMPERATURE + HALLUCINATION DETECTOR ---
  const [tokenInput, setTokenInput] = useState<string>(TOKENIZER_PRESETS[0].textRo);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(TOKENIZER_PRESETS[0].id);
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0.25);
  const [sampledOutcome, setSampledOutcome] = useState<{ token: string; isFactual: boolean } | null>(null);
  const [halIdx, setHalIdx] = useState<number>(0);
  const [halSelectedChoice, setHalSelectedChoice] = useState<number | null>(null);

  // Reset default tokenizer text nicely when switching language if still untouched
  useEffect(() => {
    const preset = TOKENIZER_PRESETS.find((p) => p.id === selectedPresetId);
    if (preset) {
      setTokenInput(isEn ? preset.textEn : preset.textRo);
    }
    setSampledOutcome(null);
  }, [isEn, selectedPresetId]);

  const tokens = useMemo(() => tokenizeText(tokenInput), [tokenInput]);
  const currentScenario = NEXT_TOKEN_SCENARIOS[scenarioIdx] || NEXT_TOKEN_SCENARIOS[0];
  const currentCandidates = isEn ? currentScenario.candidatesEn : currentScenario.candidatesRo;
  const softmaxRows = useMemo(
    () => computeSoftmaxProbabilities(currentCandidates, temperature),
    [currentCandidates, temperature]
  );

  const activeHallucination = HALLUCINATION_STRESS_TESTS[halIdx] || HALLUCINATION_STRESS_TESTS[0];
  const activeHalStatements = isEn ? activeHallucination.statementsEn : activeHallucination.statementsRo;

  // --- TAB 2 STATE: DEEPFAKE FORENSICS ---
  const [caseIdx, setCaseIdx] = useState<number>(0);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [loupeZoom, setLoupeZoom] = useState<boolean>(false);
  const [caseVerdictPick, setCaseVerdictPick] = useState<'real' | 'deepfake' | null>(null);
  const [evidenceImgFailed, setEvidenceImgFailed] = useState<boolean>(false);

  const activeCase = DEEPFAKE_FORENSIC_CASES[caseIdx] || DEEPFAKE_FORENSIC_CASES[0];

  useEffect(() => {
    setSelectedHotspotId(activeCase.hotspots?.[0]?.id ?? null);
    setLoupeZoom(false);
    setCaseVerdictPick(null);
    setEvidenceImgFailed(false);
  }, [caseIdx, activeCase.id]);

  // --- TAB 3 STATE: PROMPT ARCHITECT ---
  const [promptIdx, setPromptIdx] = useState<number>(0);
  const [selectedSlots, setSelectedSlots] = useState<{
    role: number;
    context: number;
    instruction: number;
    guardrail: number;
  }>({ role: 0, context: 0, instruction: 0, guardrail: 0 });
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const activePromptMission = PROMPT_ARCHITECT_CHALLENGES[promptIdx] || PROMPT_ARCHITECT_CHALLENGES[0];

  useEffect(() => {
    setSelectedSlots({ role: 0, context: 0, instruction: 0, guardrail: 0 });
    setCopiedPrompt(false);
  }, [promptIdx]);

  const promptBlocks = useMemo(() => {
    const r = activePromptMission.slots.role[selectedSlots.role];
    const c = activePromptMission.slots.context[selectedSlots.context];
    const i = activePromptMission.slots.instruction[selectedSlots.instruction];
    const g = activePromptMission.slots.guardrail[selectedSlots.guardrail];
    const clarity = r.clarityPts + c.clarityPts + i.clarityPts + g.clarityPts;
    const contextScore = Math.min(100, Math.round(((r.contextPts + c.contextPts + i.contextPts + g.contextPts) / 90) * 100));
    const ethics = Math.min(100, Math.round(((r.ethicsPts + c.ethicsPts + i.ethicsPts + g.ethicsPts) / 95) * 100));
    const guardrailScore = Math.min(100, Math.round(((r.guardrailPts + c.guardrailPts + i.guardrailPts + g.guardrailPts) / 75) * 100));
    const total = Math.round((clarity + contextScore + ethics + guardrailScore) / 4);
    const fullText = [
      isEn ? r.textEn : r.textRo,
      isEn ? c.textEn : c.textRo,
      isEn ? i.textEn : i.textRo,
      isEn ? g.textEn : g.textRo,
    ].join(' ');
    return { r, c, i, g, clarity, contextScore, ethics, guardrailScore, total, fullText };
  }, [activePromptMission, selectedSlots, isEn]);

  // --- TAB 4 STATE: FAQ ---
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const awardOnce = (bucket: 'solvedDeepfakes' | 'solvedHallucinations' | 'solvedPrompts', id: string, coins: number, reason: string) => {
    setProgress((prev) => {
      if (prev[bucket].includes(id)) return prev;
      void addByteCoins(coins, reason);
      return {
        ...prev,
        [bucket]: [...prev[bucket], id],
        earnedCoins: prev.earnedCoins + coins,
      };
    });
  };

  const handleSampleNextToken = () => {
    sounds.playClick();
    const roll = Math.random() * 100;
    let cumulative = 0;
    let chosen = softmaxRows[0];
    for (const row of softmaxRows) {
      cumulative += row.probPct;
      if (roll <= cumulative) {
        chosen = row;
        break;
      }
    }
    setSampledOutcome({ token: chosen.token, isFactual: chosen.isFactual });
    if (!chosen.isFactual) {
      arky.triggerError(
        isEn
          ? 'Notice how high Temperature triggered an AI hallucination! Lower Temperature keeps facts anchored.'
          : 'Ai observat cum Temperatura mare a declanșat o halucinație AI! Scade Temperatura pentru fapte exacte.'
      );
    } else {
      arky.triggerSuccess(
        isEn ? 'Clean prediction anchored in high-probability tokens!' : 'Predicție corectă ancorată pe probabilitate mare!'
      );
    }
  };

  const handleCheckHallucination = (choiceIdx: number) => {
    setHalSelectedChoice(choiceIdx);
    if (choiceIdx === activeHallucination.hallucinatedIdx) {
      sounds.playSuccess();
      const firstTime = !progress.solvedHallucinations.includes(activeHallucination.id);
      awardOnce('solvedHallucinations', activeHallucination.id, 25, `AI Lab Hallucination: ${activeHallucination.id}`);
      arky.triggerSuccess(
        firstTime
          ? isEn
            ? 'Hallucination caught! +25 ByteCoins credited!'
            : 'Ai prins halucinația AI! +25 ByteCoins acordați!'
          : isEn
          ? 'Exact catch! Never trust unverified libraries or facts.'
          : 'Detectare exactă! Verifică întotdeauna codul și sursele.'
      );
    } else {
      sounds.playError();
      arky.triggerError(
        isEn ? 'That statement is actually accurate! Look for the fabricated detail.' : 'Acea afirmație este adevărată! Caută detaliul inventat de AI.'
      );
    }
  };

  const handlePickDeepfakeVerdict = (verdict: 'real' | 'deepfake') => {
    setCaseVerdictPick(verdict);
    const correct = (verdict === 'deepfake' && activeCase.isDeepfake) || (verdict === 'real' && !activeCase.isDeepfake);
    if (correct) {
      sounds.playSuccess();
      const firstTime = !progress.solvedDeepfakes.includes(activeCase.id);
      awardOnce('solvedDeepfakes', activeCase.id, activeCase.rewardCoins, `AI Lab Deepfake: ${activeCase.id}`);
      arky.triggerSuccess(
        firstTime
          ? isEn
            ? `Case cracked! +${activeCase.rewardCoins} ByteCoins earned!`
            : `Caz rezolvat! Ai primit +${activeCase.rewardCoins} ByteCoins!`
          : isEn
          ? 'Forensic verdict verified!'
          : 'Verdict criminalistic confirmat!'
      );
    } else {
      sounds.playError();
      arky.triggerError(
        isEn
          ? 'Not quite! Inspect the metadata panel and clues closely.'
          : 'Atenție! Verifică mai atent indiciile și metadatele EXIF/C2PA.'
      );
    }
  };

  const handleClaimPromptReward = () => {
    if (promptBlocks.total < 85) {
      sounds.playError();
      arky.triggerError(
        isEn
          ? 'Raise your prompt score to at least 85/100 by swapping weak blocks for structured C.R.I.F. blocks!'
          : 'Ridică scorul promptului la minim 85/100 înlocuind blocurile vagi cu blocuri C.R.I.F.!'
      );
      return;
    }
    sounds.playSuccess();
    const firstTime = !progress.solvedPrompts.includes(activePromptMission.id);
    awardOnce('solvedPrompts', activePromptMission.id, 40, `AI Lab Prompt: ${activePromptMission.id}`);
    arky.triggerSuccess(
      firstTime
        ? isEn
          ? 'Master Prompt Engineer! +40 ByteCoins unlocked!'
          : 'Prompt de campion! Ai deblocat +40 ByteCoins!'
        : isEn
        ? 'Solid 100% structured prompt verified!'
        : 'Prompt etic și structurat confirmat!'
    );
  };

  const totalSolvedCases =
    progress.solvedDeepfakes.length + progress.solvedHallucinations.length + progress.solvedPrompts.length;
  const maxCases =
    DEEPFAKE_FORENSIC_CASES.length + HALLUCINATION_STRESS_TESTS.length + PROMPT_ARCHITECT_CHALLENGES.length;

  const tempRiskLabel =
    temperature <= 0.45
      ? {
          text: isEn ? 'LOW RISK · Factual Anchor' : 'RISC MIC · Ancorare Factuală',
          tone: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />,
        }
      : temperature <= 0.9
      ? {
          text: isEn ? 'MEDIUM · Balanced Variation' : 'RISC MEDIU · Variație Echilibrată',
          tone: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
        }
      : {
          text: isEn ? 'HIGH RISK · Hallucination Zone' : 'RISC MARE · Zonă Halucinații',
          tone: 'text-rose-300 border-rose-500/40 bg-rose-500/10',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />,
        };

  const renderCaseEvidenceVisual = () => {
    if (activeCase.mediaKind === 'image') {
      const imgSrc =
        activeCase.evidenceImageKey === 'fake_campus' ? aiEvidenceFakeImg : aiEvidenceRealImg;
      const activeHotspot = activeCase.hotspots?.find((h) => h.id === selectedHotspotId) || activeCase.hotspots?.[0];
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-300">
              {isEn ? 'Click numbered hotspots to inspect pixels' : 'Apasă pe punctele numerotate pentru inspecție'}
            </span>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setLoupeZoom((z) => !z);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              {loupeZoom ? <ZoomOut className="w-3.5 h-3.5 text-amber-400" /> : <ZoomIn className="w-3.5 h-3.5 text-teal-400" />}
              <span>{loupeZoom ? (isEn ? 'Reset Zoom' : 'Resetează Zoom') : isEn ? 'Inspect 1.35×' : 'Mărește 1.35×'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 aspect-[4/3]">
            {!evidenceImgFailed ? (
              <img
                src={imgSrc}
                alt={isEn ? activeCase.titleEn : activeCase.titleRo}
                referrerPolicy="no-referrer"
                onError={() => setEvidenceImgFailed(true)}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  loupeZoom ? 'scale-[1.35]' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-300 gap-2">
                <ImageIcon className="w-10 h-10 text-teal-400" />
                <div className="text-sm font-bold">{isEn ? activeCase.titleEn : activeCase.titleRo}</div>
              </div>
            )}

            {activeCase.hotspots?.map((spot, sIdx) => {
              const isSelected = spot.id === (activeHotspot?.id ?? '');
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedHotspotId(spot.id);
                  }}
                  style={{ top: `${spot.yPct}%`, left: `${spot.xPct}%`, transform: 'translate(-50%, -50%)' }}
                  aria-label={isEn ? spot.labelEn : spot.labelRo}
                  className={`absolute w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center cursor-pointer transition-transform shadow-lg ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 scale-110 ring-2 ring-white z-20'
                      : 'bg-slate-950/90 text-white border border-teal-400 hover:scale-105 z-10'
                  }`}
                >
                  {sIdx + 1}
                </button>
              );
            })}
          </div>

          {activeHotspot && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-amber-300">
                {isEn ? activeHotspot.labelEn : activeHotspot.labelRo}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn ? activeHotspot.detailEn : activeHotspot.detailRo}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Audio / Video / News forensic simulator panel
    const waveformHeights = activeCase.mediaKind === 'audio'
      ? [28, 62, 48, 70, 12, 10, 68, 74, 52, 10, 11, 72, 66, 40, 14, 12, 65, 58, 36]
      : [42, 55, 48, 64, 58, 44, 62, 70, 50, 46, 60, 52, 48, 66, 54, 42, 58, 52, 44];

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                {activeCase.mediaKind === 'audio' && <Volume2 className="w-4 h-4 text-amber-400" />}
                {activeCase.mediaKind === 'video' && <Video className="w-4 h-4 text-rose-400" />}
                {activeCase.mediaKind === 'news' && <Newspaper className="w-4 h-4 text-cyan-400" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {isEn ? activeCase.sourceLabelEn : activeCase.sourceLabelRo}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {activeCase.mediaKind === 'audio'
                    ? isEn
                      ? 'Audio Waveform Intercept'
                      : 'Interceptare Spectru Audio'
                    : activeCase.mediaKind === 'video'
                    ? isEn
                      ? 'Video Frame & Lip-Sync Log'
                      : 'Analiză Cadre & Sincronizare Buze'
                    : isEn
                    ? 'Headline & Domain Verification'
                    : 'Audit Titlu, Sursă & Domeniu'}
                </div>
              </div>
            </div>
          </div>

          {(activeCase.mediaKind === 'audio' || activeCase.mediaKind === 'video') && (
            <div className="space-y-1.5">
              <div className="flex items-end justify-between gap-1 h-16 px-2 py-2 rounded-xl bg-slate-900 border border-slate-800">
                {waveformHeights.map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-sm ${
                      h <= 15 ? 'bg-rose-400/70' : activeCase.isDeepfake ? 'bg-amber-400/80' : 'bg-emerald-400/80'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {activeCase.mediaKind === 'audio'
                  ? isEn
                    ? 'Notice flat 0 dB artificial silences (rose bars) between spliced AI phrases.'
                    : 'Observă pauzele plate de 0 dB (bare roz) între segmentele vocale sintetizate.'
                  : isEn
                  ? 'Frame delta shows mouth blur mismatch between frame 14 and frame 42.'
                  : 'Analiza cadrelor detectează discrepanță de rezoluție în jurul gurii.'}
              </div>
            </div>
          )}

          {(activeCase.audioTranscriptRo || activeCase.audioTranscriptEn) && (
            <blockquote className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 leading-relaxed font-medium">
              {isEn ? activeCase.audioTranscriptEn : activeCase.audioTranscriptRo}
            </blockquote>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. HEADER & HERO WORKBENCH */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onBackToCatalog();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'Back to Courses' : 'Înapoi la Cursuri'}</span>
                </button>
                <div className="text-xs text-slate-400 font-mono">
                  {isEn
                    ? 'AI Literacy · Grades 5–8 · Zero Open Chat'
                    : 'Educație AI · Clasele V–VIII · 100% Sigur'}
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white font-heading leading-tight max-w-2xl">
                {isEn
                  ? 'AI Literacy & Deepfake Forensics Lab for Students'
                  : 'Laboratorul AI & Detectorul de Deepfake pentru Elevi'}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {isEn
                  ? 'Discover how Large Language Models split words into tokens, why high Temperature triggers hallucinations, inspect real vs AI-generated photos and voice clones, and master C.R.I.F. Prompt Engineering.'
                  : 'Descoperă concret cum sparge un LLM propozițiile în tokeni, de ce apar halucinațiile AI la Temperatură mare, cum recunoști poze Deepfake și voci clonate și cum construiești prompturi etice C.R.I.F.'}
              </p>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800 tabular-nums text-xs">
              <div>
                <div className="text-slate-400 font-mono">{isEn ? 'Active Student' : 'Elev Activ'}</div>
                <div className="text-white font-bold mt-0.5 truncate">{studentName || (isEn ? 'Guest Explorer' : 'Explorator')}</div>
              </div>
              <div>
                <div className="text-slate-400 font-mono">{isEn ? 'Cases Cracked' : 'Cazuri Rezolvate'}</div>
                <div className="text-teal-300 font-bold mt-0.5">
                  {totalSolvedCases} / {maxCases}
                </div>
              </div>
              <div>
                <div className="text-slate-400 font-mono">{isEn ? 'Lab ByteCoins' : 'ByteCoins Câștigați'}</div>
                <div className="text-amber-300 font-bold mt-0.5 inline-flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>+{progress.earnedCoins}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-slate-900">
            {!heroImgFailed ? (
              <img
                src={aiLabHeroImg}
                alt={
                  isEn
                    ? 'Student AI forensics workbench illustrating tokens and audio waveforms'
                    : 'Laborator educațional AI și analiză criminalistică digitală pentru elevi'
                }
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900 text-teal-300 gap-2">
                <BrainCircuit className="w-12 h-12" />
                <span className="text-sm font-bold text-white">AI & Deepfake Lab</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-slate-950/20 via-transparent to-slate-950/85 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SEGMENTED WORKSPACE NAVIGATION */}
      <div
        role="tablist"
        aria-label={isEn ? 'AI Lab Modules' : 'Module Laborator AI'}
        className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl"
      >
        {(
          [
            {
              id: 'llm' as const,
              icon: <BrainCircuit className="w-4 h-4 shrink-0" />,
              ro: '01. Motor LLM, Tokeni & Halucinații',
              en: '01. LLM Tokens & Hallucinations',
            },
            {
              id: 'deepfake' as const,
              icon: <Search className="w-4 h-4 shrink-0" />,
              ro: `02. Detector Deepfake (${progress.solvedDeepfakes.length}/${DEEPFAKE_FORENSIC_CASES.length})`,
              en: `02. Deepfake Forensics (${progress.solvedDeepfakes.length}/${DEEPFAKE_FORENSIC_CASES.length})`,
            },
            {
              id: 'prompt' as const,
              icon: <Wand2 className="w-4 h-4 shrink-0" />,
              ro: `03. Prompt Architect (${progress.solvedPrompts.length}/${PROMPT_ARCHITECT_CHALLENGES.length})`,
              en: `03. Prompt Architect (${progress.solvedPrompts.length}/${PROMPT_ARCHITECT_CHALLENGES.length})`,
            },
            {
              id: 'guide' as const,
              icon: <BookOpen className="w-4 h-4 shrink-0" />,
              ro: '04. Programa TIC & Întrebări Frecvente',
              en: '04. Curriculum Links & FAQ',
            },
          ]
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 min-h-[42px] ${
                isActive
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{isEn ? tab.en : tab.ro}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: LLM TOKENS, TEMPERATURE & HALLUCINATIONS ================= */}
      {activeTab === 'llm' && (
        <div className="space-y-6">
          {/* 1A. Interactive Tokenizer */}
          <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                  {isEn ? '01. Live Subword Tokenizer Inspector' : '01. Cum Citește un AI Textul? (Inspector de Tokeni)'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isEn
                    ? 'AI does not read sentences like humans—it converts characters and subwords into numeric token IDs.'
                    : 'Un model AI nu citește cuvinte cu sens, ci sparge textul în bucăți numerice numite tokeni.'}
                </p>
              </div>
              <div className="text-xs font-mono text-teal-300 tabular-nums shrink-0">
                {tokens.length} {isEn ? 'tokens' : 'tokeni'} · {tokenInput.length} {isEn ? 'chars' : 'caractere'}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {TOKENIZER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedPresetId(preset.id);
                    setTokenInput(isEn ? preset.textEn : preset.textRo);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedPresetId === preset.id
                      ? 'bg-teal-500/20 text-teal-200 border-teal-500/50'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {isEn ? preset.labelEn : preset.labelRo}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-5 space-y-2.5">
                <label htmlFor="tokenizer-input" className="block text-xs font-semibold text-slate-300">
                  {isEn ? 'Type or edit any text or C++ / Excel snippet:' : 'Scrie sau modifică orice text ori formulă C++ / Excel:'}
                </label>
                <textarea
                  id="tokenizer-input"
                  rows={4}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  maxLength={280}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 focus:border-teal-400 focus:outline-none p-3 text-sm text-white font-mono"
                />
                <div className="flex items-center justify-between text-xs text-slate-400 tabular-nums">
                  <span>
                    {isEn ? 'Context Window Load' : 'Ocupare Fereastră Context'}: {((tokens.length / 4096) * 100).toFixed(2)}%
                  </span>
                  <span>{tokenInput.length}/280</span>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>{isEn ? 'Tokenized Sequence & Numeric IDs' : 'Secvența de Tokeni & ID-uri Numerice'}</span>
                  <span className="font-mono">Word · ##Subword · Symbol · Number</span>
                </div>

                {tokens.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">
                    {isEn ? 'Type a sentence on the left to inspect its tokens.' : 'Scrie o propoziție în stânga pentru a vedea tokenii.'}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {tokens.map((tok, i) => {
                      const cls =
                        tok.kind === 'subword'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                          : tok.kind === 'number'
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                          : tok.kind === 'symbol'
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                          : 'bg-teal-500/15 border-teal-500/40 text-teal-200';
                      return (
                        <div
                          key={`${tok.id}-${i}`}
                          className={`px-2 py-1 rounded-lg border font-mono text-xs flex flex-col leading-tight tabular-nums ${cls}`}
                        >
                          <span className="font-bold">{tok.text}</span>
                          <span className="text-[10px] opacity-80">#{tok.id}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-slate-300 pt-1">
                  {isEn
                    ? TOKENIZER_PRESETS.find((p) => p.id === selectedPresetId)?.noteEn
                    : TOKENIZER_PRESETS.find((p) => p.id === selectedPresetId)?.noteRo}
                </p>
              </div>
            </div>
          </section>

          {/* 1B. Next-Token Softmax Probability & Temperature Lab */}
          <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                  {isEn
                    ? '02. Temperature & Next-Token Probability Simulator'
                    : '02. Simulatorul de Temperatură: De ce Halucinează AI-ul?'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isEn
                    ? 'Move the Temperature slider and test how probability shifts between factual precision and creative guessing.'
                    : 'Mișcă sliderul de Temperatură ca să vezi cum se schimbă probabilitatea între răspuns corect și halucinație.'}
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 shrink-0 ${tempRiskLabel.tone}`}>
                {tempRiskLabel.icon}
                <span>{tempRiskLabel.text}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {NEXT_TOKEN_SCENARIOS.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setScenarioIdx(idx);
                    setSampledOutcome(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer whitespace-nowrap shrink-0 ${
                    scenarioIdx === idx
                      ? 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {isEn ? sc.topicEn : sc.topicRo}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Stage: Live Probability Bars */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="text-sm font-bold text-white">
                  {isEn ? currentScenario.promptEn : currentScenario.promptRo}
                </div>

                <div className="space-y-3 tabular-nums">
                  {softmaxRows.map((cand) => (
                    <div key={cand.token} className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-white">
                          „{cand.token}”
                        </span>
                        <span className="font-mono text-slate-300 shrink-0">
                          {isEn ? cand.tagEn : cand.tagRo} · <strong className="text-white">{cand.probPct.toFixed(1)}%</strong>
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${Math.max(2, cand.probPct)}%` }}
                          className={`h-full transition-all duration-200 ${
                            cand.isFactual ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {sampledOutcome && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                      sampledOutcome.isFactual
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    {sampledOutcome.isFactual ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">
                        {isEn ? 'Sampled Next Token:' : 'Token extras de model:'} „{sampledOutcome.token}”
                      </div>
                      <div className="mt-0.5 opacity-90">
                        {sampledOutcome.isFactual
                          ? isEn
                            ? 'Accurate prediction chosen!'
                            : 'Modelul a ales continuarea corectă!'
                          : isEn
                          ? 'Hallucination triggered! Because Temperature flattened the odds, the AI picked an ungrounded guess.'
                          : 'Halucinație declanșată! La Temperatură mare, modelul a extras o variantă greșită care doar suna asemănător.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Control Deck */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <label htmlFor="ai-temp-slider" className="text-slate-200 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
                      <span>{isEn ? 'Model Temperature' : 'Temperatură Model (Creativitate)'}</span>
                    </label>
                    <span className="font-mono text-teal-300 font-bold tabular-nums">{temperature.toFixed(2)}</span>
                  </div>
                  <input
                    id="ai-temp-slider"
                    type="range"
                    min={0.1}
                    max={1.5}
                    step={0.05}
                    value={temperature}
                    onChange={(e) => {
                      setTemperature(Number(e.target.value));
                      setSampledOutcome(null);
                    }}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>0.10 ({isEn ? 'Strict Code' : 'Cod Exact'})</span>
                    <span>0.70 ({isEn ? 'Balanced' : 'Echilibrat'})</span>
                    <span>1.50 ({isEn ? 'Wild Guess' : 'Risc Halucinație'})</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSampleNextToken}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[42px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEn ? 'Predict Next Token Now' : 'Generează Token Următor'}</span>
                </button>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {isEn ? currentScenario.explanationEn : currentScenario.explanationRo}
                </p>
              </div>
            </div>
          </section>

          {/* 1C. Interactive Hallucination Spotter */}
          <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                  {isEn
                    ? '03. Spot the AI Hallucination Challenge'
                    : '03. Găsește Halucinația din Răspunsul AI (+25 ByteCoins/caz)'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isEn
                    ? '2 sentences are factually true, 1 is an AI hallucination. Click the fake claim!'
                    : 'Două afirmații sunt corecte științific, una este complet inventată de AI. Selectează propoziția falsă!'}
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-300 tabular-nums shrink-0">
                {progress.solvedHallucinations.length} / {HALLUCINATION_STRESS_TESTS.length} {isEn ? 'Verified' : 'Rezolvate'}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {HALLUCINATION_STRESS_TESTS.map((item, idx) => {
                const done = progress.solvedHallucinations.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setHalIdx(idx);
                      setHalSelectedChoice(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                      halIdx === idx
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    <span>{isEn ? item.subjectEn : item.subjectRo}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-bold text-amber-200">
                {isEn ? 'Student Prompt:' : 'Întrebarea Elevului:'} {isEn ? activeHallucination.promptEn : activeHallucination.promptRo}
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {activeHalStatements.map((stmt, idx) => {
                  const picked = halSelectedChoice === idx;
                  const isTarget = idx === activeHallucination.hallucinatedIdx;
                  const showFeedback = halSelectedChoice !== null;
                  let styleCls = 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-200';
                  if (showFeedback && isTarget) {
                    styleCls = 'bg-emerald-500/15 border-emerald-500 text-emerald-100';
                  } else if (showFeedback && picked && !isTarget) {
                    styleCls = 'bg-rose-500/15 border-rose-500 text-rose-100';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCheckHallucination(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition cursor-pointer flex items-start justify-between gap-3 ${styleCls}`}
                    >
                      <span className="leading-relaxed">
                        <strong className="font-mono mr-2">{String.fromCharCode(65 + idx)})</strong>
                        {stmt}
                      </span>
                      {showFeedback && isTarget && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                      {showFeedback && picked && !isTarget && <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {halSelectedChoice !== null && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {isEn ? activeHallucination.correctionEn : activeHallucination.correctionRo}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onSelectMission(activeHallucination.relatedMissionId);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-teal-500/40 text-teal-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Verify in Lesson' : 'Verifică în Lecție'}</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ================= TAB 2: DEEPFAKE FORENSICS (PHOTO, AUDIO, VIDEO, NEWS) ================= */}
      {activeTab === 'deepfake' && (
        <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                {isEn
                  ? 'Deepfake, Cloned Voice & Fake News Forensics'
                  : 'Detectivul de Deepfake Foto, Voci Clonate & Știri False AI'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn
                  ? 'Examine clues, camera C2PA/EXIF metadata, and audio transcripts across 6 real-world scenarios.'
                  : 'Analizează dovezile, metadatele EXIF/C2PA și spectrul audio în 6 cazuri inspirate din viața reală a elevilor.'}
              </p>
            </div>
            <div className="text-xs font-mono text-amber-300 tabular-nums shrink-0">
              {progress.solvedDeepfakes.length} / {DEEPFAKE_FORENSIC_CASES.length} {isEn ? 'Cracked' : 'Rezolvate'}
            </div>
          </div>

          {/* Case Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DEEPFAKE_FORENSIC_CASES.map((c, idx) => {
              const isSolved = progress.solvedDeepfakes.includes(c.id);
              const isCurrent = caseIdx === idx;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setCaseIdx(idx);
                  }}
                  className={`px-3 py-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer flex items-center justify-between gap-1.5 min-h-[44px] ${
                    isCurrent
                      ? 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className="truncate font-mono">
                    {isEn ? `Case 0${idx + 1}` : `Cazul 0${idx + 1}`}
                  </span>
                  {isSolved && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-slate-950' : 'text-emerald-400'}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Two-Zone Forensics Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              {renderCaseEvidenceVisual()}
            </div>

            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  {isEn ? activeCase.titleEn : activeCase.titleRo}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn ? activeCase.scenarioEn : activeCase.scenarioRo}
                </p>
              </div>

              {/* Technical EXIF / Provenance Inspection Table */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 divide-y divide-slate-800/80 text-xs">
                {activeCase.metadataRows.map((row) => (
                  <div key={row.keyEn} className="p-2.5 flex items-center justify-between gap-2">
                    <span className="text-slate-400 shrink-0">{isEn ? row.keyEn : row.keyRo}</span>
                    <span
                      className={`font-mono text-right font-semibold ${
                        row.suspicious ? 'text-amber-300' : 'text-emerald-300'
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Verdict Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-slate-200">
                  {isEn ? 'Submit Your Forensic Verdict:' : 'Decizia Ta de Detectiv Digital:'}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handlePickDeepfakeVerdict('real')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black inline-flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                      caseVerdictPick === 'real'
                        ? !activeCase.isDeepfake
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-rose-600 text-white border-rose-400'
                        : 'bg-slate-950 hover:bg-slate-800 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{isEn ? 'Authentic / Real' : 'Autentic / Real'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePickDeepfakeVerdict('deepfake')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black inline-flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                      caseVerdictPick === 'deepfake'
                        ? activeCase.isDeepfake
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-rose-600 text-white border-rose-400'
                        : 'bg-slate-950 hover:bg-slate-800 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{isEn ? 'Deepfake / AI Trap' : 'Deepfake / Fals AI'}</span>
                  </button>
                </div>
              </div>

              {caseVerdictPick && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    (caseVerdictPick === 'deepfake') === activeCase.isDeepfake
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100'
                      : 'bg-rose-500/10 border-rose-500/40 text-rose-100'
                  }`}
                >
                  <p className="font-semibold leading-relaxed">
                    {isEn ? activeCase.verdictExplanationEn : activeCase.verdictExplanationRo}
                  </p>
                  <ul className="space-y-1 text-[11px] opacity-95 list-disc pl-4">
                    {(isEn ? activeCase.checklistCluesEn : activeCase.checklistCluesRo).map((clue) => (
                      <li key={clue}>{clue}</li>
                    ))}
                  </ul>
                  {caseIdx < DEEPFAKE_FORENSIC_CASES.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setCaseIdx((prev) => prev + 1);
                      }}
                      className="mt-1 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-teal-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isEn ? 'Next Forensic Case' : 'Următorul Caz'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 3: PROMPT ARCHITECT (C.R.I.F. BLOCK BUILDER) ================= */}
      {activeTab === 'prompt' && (
        <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                {isEn
                  ? 'C.R.I.F. Prompt Engineering Builder (Context · Role · Instruction · Guardrail)'
                  : 'Prompt Architect pe Blocuri (C.R.I.F. – Context, Rol, Instrucțiune, Format)'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn
                  ? 'Swap vague blocks for structured tutoring blocks to reach 85+/100 and unlock +40 ByteCoins.'
                  : 'Alege blocurile potrivite pentru a obține un prompt responsabil de minim 85/100 și +40 ByteCoins.'}
              </p>
            </div>
            <div className="text-xs font-mono text-teal-300 tabular-nums shrink-0">
              {progress.solvedPrompts.length} / {PROMPT_ARCHITECT_CHALLENGES.length} {isEn ? 'Completed' : 'Finalizate'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PROMPT_ARCHITECT_CHALLENGES.map((m, idx) => {
              const done = progress.solvedPrompts.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setPromptIdx(idx);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                    promptIdx === idx
                      ? 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  <span>{isEn ? m.titleEn : m.titleRo}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm text-amber-200 font-medium">
            {isEn ? activePromptMission.goalEn : activePromptMission.goalRo}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Zone: 4 Block Slot Selectors */}
            <div className="lg:col-span-7 space-y-4">
              {(
                [
                  { key: 'role' as const, labelRo: '1. Rolul AI-ului', labelEn: '1. AI Role' },
                  { key: 'context' as const, labelRo: '2. Contextul Școlar & Codul', labelEn: '2. Context & Code' },
                  { key: 'instruction' as const, labelRo: '3. Instrucțiunea Exactă', labelEn: '3. Clear Instruction' },
                  { key: 'guardrail' as const, labelRo: '4. Guardrail Anti-Halucinații', labelEn: '4. Anti-Hallucination Guardrail' },
                ]
              ).map((slotMeta) => {
                const options = activePromptMission.slots[slotMeta.key];
                const chosenIdx = selectedSlots[slotMeta.key];
                return (
                  <div key={slotMeta.key} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>{isEn ? slotMeta.labelEn : slotMeta.labelRo}</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {isEn ? options[chosenIdx].feedbackEn : options[chosenIdx].feedbackRo}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {options.map((opt, oIdx) => {
                        const isPicked = chosenIdx === oIdx;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setSelectedSlots((prev) => ({ ...prev, [slotMeta.key]: oIdx }));
                            }}
                            className={`text-left p-3 rounded-xl border text-xs leading-relaxed transition cursor-pointer ${
                              isPicked
                                ? 'bg-teal-500/15 border-teal-400 text-white font-semibold'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            {isEn ? opt.textEn : opt.textRo}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Zone: Live Rubric Meter + Output Simulator */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 tabular-nums">
                <div>
                  <div className="text-xs text-slate-400 font-mono">
                    {isEn ? 'Prompt Quality Rubric' : 'Evaluare Prompt C.R.I.F.'}
                  </div>
                  <div className="text-2xl font-black text-white font-heading">
                    {promptBlocks.total} / 100
                  </div>
                </div>
                <span
                  className={`text-xs font-bold inline-flex items-center gap-1 ${
                    promptBlocks.total >= 85 ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  {promptBlocks.total >= 85 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{promptBlocks.total >= 85 ? (isEn ? 'Ready' : 'Excelent') : isEn ? 'Needs Polish' : 'De îmbunătățit'}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs tabular-nums">
                {[
                  { label: isEn ? 'Clarity' : 'Claritate', val: promptBlocks.clarity },
                  { label: isEn ? 'Context' : 'Context', val: promptBlocks.contextScore },
                  { label: isEn ? 'Ethics' : 'Etică', val: promptBlocks.ethics },
                  { label: isEn ? 'Guardrail' : 'Anti-Eroare', val: promptBlocks.guardrailScore },
                ].map((m) => (
                  <div key={m.label} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">{m.label}</div>
                    <div className="text-white font-mono font-bold mt-0.5">{m.val}%</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{isEn ? 'Assembled Prompt:' : 'Promptul Asamblat:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      navigator.clipboard?.writeText(promptBlocks.fullText).then(() => {
                        setCopiedPrompt(true);
                        setTimeout(() => setCopiedPrompt(false), 2000);
                      });
                    }}
                    className="text-teal-300 hover:text-teal-200 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? (isEn ? 'Copied' : 'Copiat') : isEn ? 'Copy' : 'Copiază'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed">
                  {promptBlocks.fullText}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-200">
                  {isEn ? 'Simulated Model Output:' : 'Rezultat Simulat de Model:'}
                </div>
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    promptBlocks.total >= 85
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100'
                      : 'bg-amber-500/10 border-amber-500/40 text-amber-100'
                  }`}
                >
                  {promptBlocks.total >= 85
                    ? isEn
                      ? activePromptMission.goodPreviewEn
                      : activePromptMission.goodPreviewRo
                    : isEn
                    ? activePromptMission.weakPreviewEn
                    : activePromptMission.weakPreviewRo}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleClaimPromptReward}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[42px]"
                >
                  <Coins className="w-4 h-4" />
                  <span>{isEn ? 'Validate & Claim +40 Coins' : 'Validează (+40 ByteCoins)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedSlots({ role: 0, context: 0, instruction: 0, guardrail: 0 });
                  }}
                  aria-label={isEn ? 'Reset blocks' : 'Resetează blocurile'}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer min-h-[42px]"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 4: CURRICULUM BRIDGES & FAQ ================= */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                  {isEn ? 'Connect AI Literacy to Grades 5–8 ICT Modules' : 'Legătura AI cu Lecțiile Oficiale TIC (V–VIII)'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isEn
                    ? 'Jump straight into ArkyEdu hardware, cyber safety, C++, and Arcade detective modules.'
                    : 'Continuă practica direct în lecțiile interactive de Hardware, Securitate, C++ și în Detectivul CyberSafe.'}
                </p>
              </div>
              {onOpenCyberSafeDetective && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenCyberSafeDetective();
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>{isEn ? 'Play CyberSafe Phishing Arcade' : 'Joacă Detectivul Phishing Arcade'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {AI_CURRICULUM_BRIDGES.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-teal-300 font-semibold">
                      {isEn ? b.gradeEn : b.gradeRo}
                    </div>
                    <h3 className="text-sm font-black text-white">{isEn ? b.titleEn : b.titleRo}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isEn ? b.descriptionEn : b.descriptionRo}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onSelectMission(b.missionId);
                      }}
                      className="text-xs font-bold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isEn ? 'Open Lesson' : 'Deschide Lecția'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {onOpenGlossary && (b.glossarySlugEn || b.glossarySlugRo) && (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onOpenGlossary(isEn ? b.glossarySlugEn : b.glossarySlugRo);
                        }}
                        className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 cursor-pointer"
                      >
                        {isEn ? 'Glossary Term →' : 'Termen Glosar →'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
              <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                {isEn ? 'Frequently Asked Questions — AI & Deepfake Lab' : 'Întrebări Frecvente — Laboratorul AI & Deepfake'}
              </h2>
              <a
                href="/laborator-ai-llm.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-teal-300 hover:text-teal-200 underline underline-offset-2"
              >
                laborator-ai-llm.txt (RAG Index)
              </a>
            </div>

            <div className="space-y-2.5">
              {AI_LAB_FAQS.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={faq.qEn} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setOpenFaqIdx(isOpen ? null : idx);
                      }}
                      aria-expanded={isOpen}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/60 transition-colors"
                    >
                      <span className="text-sm font-bold text-white">{isEn ? faq.qEn : faq.qRo}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-teal-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                        {isEn ? faq.aEn : faq.aRo}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
