import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Globe,
  Code2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Star,
  Award,
  CheckCircle2,
  GraduationCap,
  Layers,
  Database,
  BarChart3,
  Bot,
  Binary
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { GRADE_8_CURRICULA_MODULES } from '../../data/grade8Curricula';

interface Grade8CatalogSectionProps {
  onOpenCurriculaModal: (slugOrId: string) => void;
  onLaunchInteractiveLab?: (missionId: string) => void;
  completedMissions?: Record<string, boolean>;
}

export const Grade8CatalogSection: React.FC<Grade8CatalogSectionProps> = ({
  onOpenCurriculaModal,
  onLaunchInteractiveLab,
  completedMissions = {},
}) => {
  const { lang } = useLanguage();
  const [activeTabUnit, setActiveTabUnit] = useState<'all' | 'u1' | 'u2' | 'u3'>('all');

  const getUnitTag = (missionId: string) => {
    if (missionId.startsWith('g8_calc')) return 'u1';
    if (missionId.startsWith('g8_web')) return 'u2';
    return 'u3';
  };

  const filteredModules = activeTabUnit === 'all'
    ? GRADE_8_CURRICULA_MODULES
    : GRADE_8_CURRICULA_MODULES.filter(m => getUnitTag(m.missionId) === activeTabUnit);

  return (
    <div id="sectiune-misiuni-clasa-8" className="scroll-mt-6 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
              {lang === 'en' ? 'Practical ICT & C++ Missions • 8th Grade (Art Klett)' : 'Misiuni Practice TIC & C++ • Clasa a VIII-a (Manual Art Klett)'}
            </h2>
            <div className="text-xs text-emerald-400 font-mono font-medium">
              {lang === 'en' ? 'Official National Curriculum OMEN 3393/2017 & OM 5420/2024 • 12 Culminating Missions' : 'Programa Națională Oficială OMEN 3393/2017 & OM 5420/2024 • 12 Misiuni Finale Gimnaziu'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === 'en' ? 'Gymnasium Graduation Level' : 'Nivel Absolvire Gimnaziu'}</span>
          </span>
        </div>
      </div>

      {/* 3 Major Units Roadmap Matrix Banner */}
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-emerald-950/40 border-2 border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {lang === 'en' ? '8th Grade Curriculum Roadmap (Manual Art Klett 2025, 100 pages)' : 'Harta Curriculară Clasa a VIII-a (Manual Oficial Art Klett 2025, 100 pagini)'}
          </div>

          {/* Unit Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTabUnit('all');
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                activeTabUnit === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'All (12)' : 'Toate (12)'}
            </button>
            <button
              onClick={() => {
                setActiveTabUnit('u1');
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                activeTabUnit === 'u1'
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              U1: Excel (4)
            </button>
            <button
              onClick={() => {
                setActiveTabUnit('u2');
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                activeTabUnit === 'u2'
                  ? 'bg-sky-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              U2: Web Sites (3)
            </button>
            <button
              onClick={() => {
                setActiveTabUnit('u3');
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                activeTabUnit === 'u3'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              U3: C++ & Roboți (5)
            </button>
          </div>
        </div>

        {/* Units Description Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white">Unitatea 1: Calcul Tabelar</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                Excel/Calc, adrese celule relative/absolute ($A$1), formule SUM, AVERAGE, IF, diagrame 2D/3D, sortare multi-cheie & autofiltrare (pag. 12–35)
              </div>
            </div>
            <span className="mt-2 text-[10px] font-mono font-bold text-emerald-400">● 4 MISIUNI ACTIVE (1A–1D)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-white">Unitatea 2: Pagini Web</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                HTML5 semantic, Google Sites WYSIWYG, carusel imagini, hărți, machetare responsive (Desktop/Tabletă/Telefon), securitate HTTPS & SEO (pag. 36–57)
              </div>
            </div>
            <span className="mt-2 text-[10px] font-mono font-bold text-sky-400">● 3 MISIUNI ACTIVE (2A–2C)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-white">Unitatea 3: Algoritmi, C++ & Robotică</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                if/else, switch, bucle while/do-while/for, cifre, divizori, CMMDC, Fibonacci, simulator senzori roboți & Proiectul final „Liceul Preferat” (pag. 58–96)
              </div>
            </div>
            <span className="mt-2 text-[10px] font-mono font-bold text-indigo-400">● 5 MISIUNI ACTIVE (3A–3E)</span>
          </div>
        </div>
      </div>

      {/* Grid of 12 Interactive Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModules.map((module) => {
          const isDone = Boolean(completedMissions[module.missionId]);

          return (
            <div
              key={module.id}
              className={`bg-slate-900/90 border-2 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${
                isDone
                  ? 'border-emerald-500/80 shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-emerald-500/60 hover:shadow-emerald-500/10'
              }`}
            >
              <div>
                {/* Top Badge & Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                    {module.icon}
                  </div>

                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                      </span>
                    ) : null}

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider font-mono">
                      {module.id.toUpperCase().replace('G8_', 'G8 • ')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 font-mono">
                  {module.unit}
                </div>

                <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-emerald-300 transition-colors">
                  {module.title}
                </h3>
                <div className="text-xs font-semibold text-slate-300 mb-3">
                  {module.shortTitle}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {module.metaDescription}
                </p>

                {/* Key Skills Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {module.competencies.slice(0, 3).map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 font-mono"
                    >
                      {comp.code}: {comp.description.slice(0, 50)}...
                    </span>
                  ))}
                </div>

                {/* Badges / Highlights */}
                <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> 20-25 min
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 100 pts
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-teal-300 flex items-center gap-1">
                    <Award className="w-3 h-3 text-teal-400" /> {module.shortTitle}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  {isDone ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'Diploma Earned' : 'Diplomă Obținută (100 pct)'}</span>
                    </span>
                  ) : (
                    <span>{lang === 'en' ? '5 Pedagogical Levels' : '5 Niveluri Pedagogice'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenCurriculaModal(module.id)}
                    className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Vezi programa școlară, teoria și fișa didactică"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onLaunchInteractiveLab?.(module.missionId);
                    }}
                    className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                      isDone
                        ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'en' ? 'Replay' : 'Reia'}</span>
                      </>
                    ) : (
                      <>
                        <span>{lang === 'en' ? 'Start' : 'Începe'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
