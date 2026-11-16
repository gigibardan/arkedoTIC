import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  Gamepad2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AllMissionId } from '../../types';

export type MissionAccentColor =
  | 'teal'
  | 'emerald'
  | 'indigo'
  | 'blue'
  | 'amber'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'rose'
  | 'cyan';

export interface MissionCardProps {
  missionId: AllMissionId;
  emoji: string;
  moduleLabel: string;
  textbookRef: string;
  title: string;
  topics: string;
  description: string;
  duration: string;
  pointsLabel: string;
  diplomaLabel: string;
  levelsCount: number;
  defaultFooterLabel: string;
  curriculaId: string;
  accentColor: MissionAccentColor;
  isCompleted: boolean;
  isActive: boolean;
  activeLevel: number;
  activeScore: number;
  startLabel: string;
  resumeLabel: string;
  lang: 'ro' | 'en';
  onStart: (id: AllMissionId) => void;
  onOpenCurricula: (curriculaId: string) => void;
  extraAction?: {
    label: string;
    title: string;
    onClick: () => void;
  };
}

const ACCENT_MAP: Record<
  MissionAccentColor,
  {
    iconBg: string;
    eyebrow: string;
    hoverBorder: string;
    hoverTitle: string;
    primaryBtn: string;
    activeRing: string;
    progressText: string;
  }
> = {
  teal: {
    iconBg: 'bg-teal-500/15 border-teal-500/35',
    eyebrow: 'text-teal-400',
    hoverBorder: 'hover:border-teal-400/60',
    hoverTitle: 'group-hover:text-teal-300',
    primaryBtn: 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/30',
    activeRing: 'border-teal-400/80 ring-1 ring-teal-400/40',
    progressText: 'text-teal-300',
  },
  emerald: {
    iconBg: 'bg-emerald-500/15 border-emerald-500/35',
    eyebrow: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-400/60',
    hoverTitle: 'group-hover:text-emerald-300',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30',
    activeRing: 'border-emerald-400/80 ring-1 ring-emerald-400/40',
    progressText: 'text-emerald-300',
  },
  indigo: {
    iconBg: 'bg-indigo-500/15 border-indigo-500/35',
    eyebrow: 'text-indigo-400',
    hoverBorder: 'hover:border-indigo-400/60',
    hoverTitle: 'group-hover:text-indigo-300',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30',
    activeRing: 'border-indigo-400/80 ring-1 ring-indigo-400/40',
    progressText: 'text-indigo-300',
  },
  blue: {
    iconBg: 'bg-blue-500/15 border-blue-500/35',
    eyebrow: 'text-blue-400',
    hoverBorder: 'hover:border-blue-400/60',
    hoverTitle: 'group-hover:text-blue-300',
    primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30',
    activeRing: 'border-blue-400/80 ring-1 ring-blue-400/40',
    progressText: 'text-blue-300',
  },
  amber: {
    iconBg: 'bg-amber-500/15 border-amber-500/35',
    eyebrow: 'text-amber-400',
    hoverBorder: 'hover:border-amber-400/60',
    hoverTitle: 'group-hover:text-amber-300',
    primaryBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-900/30',
    activeRing: 'border-amber-400/80 ring-1 ring-amber-400/40',
    progressText: 'text-amber-300',
  },
  purple: {
    iconBg: 'bg-purple-500/15 border-purple-500/35',
    eyebrow: 'text-purple-400',
    hoverBorder: 'hover:border-purple-400/60',
    hoverTitle: 'group-hover:text-purple-300',
    primaryBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30',
    activeRing: 'border-purple-400/80 ring-1 ring-purple-400/40',
    progressText: 'text-purple-300',
  },
  orange: {
    iconBg: 'bg-orange-500/15 border-orange-500/35',
    eyebrow: 'text-orange-400',
    hoverBorder: 'hover:border-orange-400/60',
    hoverTitle: 'group-hover:text-orange-300',
    primaryBtn: 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/30',
    activeRing: 'border-orange-400/80 ring-1 ring-orange-400/40',
    progressText: 'text-orange-300',
  },
  pink: {
    iconBg: 'bg-pink-500/15 border-pink-500/35',
    eyebrow: 'text-pink-400',
    hoverBorder: 'hover:border-pink-400/60',
    hoverTitle: 'group-hover:text-pink-300',
    primaryBtn: 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-900/30',
    activeRing: 'border-pink-400/80 ring-1 ring-pink-400/40',
    progressText: 'text-pink-300',
  },
  rose: {
    iconBg: 'bg-rose-500/15 border-rose-500/35',
    eyebrow: 'text-rose-400',
    hoverBorder: 'hover:border-rose-400/60',
    hoverTitle: 'group-hover:text-rose-300',
    primaryBtn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30',
    activeRing: 'border-rose-400/80 ring-1 ring-rose-400/40',
    progressText: 'text-rose-300',
  },
  cyan: {
    iconBg: 'bg-cyan-500/15 border-cyan-500/35',
    eyebrow: 'text-cyan-400',
    hoverBorder: 'hover:border-cyan-400/60',
    hoverTitle: 'group-hover:text-cyan-300',
    primaryBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30',
    activeRing: 'border-cyan-400/80 ring-1 ring-cyan-400/40',
    progressText: 'text-cyan-300',
  },
};

export const MissionCard: React.FC<MissionCardProps> = ({
  missionId,
  emoji,
  moduleLabel,
  textbookRef,
  title,
  topics,
  description,
  duration,
  pointsLabel,
  diplomaLabel,
  levelsCount,
  defaultFooterLabel,
  curriculaId,
  accentColor,
  isCompleted,
  isActive,
  activeLevel,
  activeScore,
  startLabel,
  resumeLabel,
  lang,
  onStart,
  onOpenCurricula,
  extraAction,
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = ACCENT_MAP[accentColor];
  const hasProgress = isActive && activeLevel > 1;
  const isLongDescription = description.length > 155;

  return (
    <article
      className={`group rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between bg-slate-950/75 border shadow-lg ${
        isCompleted
          ? 'border-emerald-500/60 bg-gradient-to-b from-emerald-950/20 to-slate-950/90'
          : isActive
          ? theme.activeRing
          : `border-slate-800 ${theme.hoverBorder} hover:bg-slate-950/95`
      }`}
    >
      <div>
        {/* Card Header: Icon + Unboxed Meta Eyebrow + Status */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform ${theme.iconBg}`}
              aria-hidden="true"
            >
              {emoji}
            </div>
            <div className="min-w-0">
              <div className={`text-[11px] font-bold uppercase tracking-wider font-mono truncate ${theme.eyebrow}`}>
                {moduleLabel}
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                {textbookRef}
              </div>
            </div>
          </div>

          {isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-mono shrink-0 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'en' ? 'Done · 10/10' : 'Nota 10'}</span>
            </span>
          ) : hasProgress ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[11px] font-bold font-mono shrink-0 whitespace-nowrap tabular-nums">
              {lang === 'en' ? `${activeLevel}/${levelsCount}` : `Pas ${activeLevel}/${levelsCount}`}
            </span>
          ) : (
            <span className="text-[11px] font-mono text-slate-400 shrink-0 whitespace-nowrap pt-0.5 tabular-nums">
              {levelsCount} {lang === 'en' ? 'steps' : 'niveluri'}
            </span>
          )}
        </div>

        {/* Title & Key Topics */}
        <h3 className={`text-lg font-extrabold text-white font-heading leading-snug mb-1 transition-colors ${theme.hoverTitle}`}>
          {title}
        </h3>
        <div className="text-xs font-semibold text-slate-300 mb-2.5 leading-snug">
          {topics}
        </div>

        {/* Description with optional expand toggle to eliminate text-wall fatigue while keeping 100% of information */}
        <div className="mb-3.5">
          <p
            className={`text-xs sm:text-[13px] text-slate-400 leading-relaxed ${
              !expanded && isLongDescription ? 'line-clamp-3' : ''
            }`}
          >
            {description}
          </p>
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 hover:text-teal-300 transition cursor-pointer"
            >
              <span>
                {expanded
                  ? lang === 'en'
                    ? 'Show less'
                    : 'Restrânge'
                  : lang === 'en'
                  ? 'Full overview'
                  : 'Citește tot'}
              </span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Unboxed Single-Line Fact Metadata (replaces noisy stacked pills) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-300 pb-3.5 border-b border-slate-800/80 tabular-nums">
          <span className="inline-flex items-center gap-1 text-slate-300">
            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>{duration}</span>
          </span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-amber-300">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span>{pointsLabel}</span>
          </span>
          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-slate-300">
            <Award className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[230px]">{diplomaLabel}</span>
          </span>
        </div>
      </div>

      {/* Footer Status + Action Controls */}
      <div className="pt-3.5 flex flex-col gap-2.5">
        <div className="text-xs font-mono flex items-center justify-between gap-2 tabular-nums">
          {isCompleted ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
            </span>
          ) : hasProgress ? (
            <span className={`font-bold ${theme.progressText}`}>
              {lang === 'en'
                ? `Progress: Level ${activeLevel}/${levelsCount} (${activeScore} pts)`
                : `Progres: Pas ${activeLevel}/${levelsCount} (${activeScore} pct)`}
            </span>
          ) : (
            <span className="text-slate-400">{defaultFooterLabel}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {extraAction && (
            <button
              type="button"
              onClick={extraAction.onClick}
              title={extraAction.title}
              className="px-3 py-2 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 min-h-[42px] whitespace-nowrap"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{extraAction.label}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenCurricula(curriculaId)}
            title={lang === 'en' ? 'View syllabus, theory and guide' : 'Vezi programa școlară, teoria și fișa didactică'}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-white border border-slate-700 hover:border-sky-400/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[42px] whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{lang === 'en' ? 'Theory' : 'Teorie'}</span>
          </button>

          <button
            type="button"
            onClick={() => onStart(missionId)}
            className={`flex-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] shadow-md min-h-[42px] whitespace-nowrap ${
              isCompleted
                ? 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400'
                : theme.primaryBtn
            }`}
          >
            {isCompleted ? (
              <>
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'en' ? 'Diploma / Replay' : 'Diplomă / Reia'}</span>
              </>
            ) : hasProgress ? (
              <>
                <span>{resumeLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </>
            ) : (
              <>
                <span>{startLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
