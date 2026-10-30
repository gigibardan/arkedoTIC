import React, { useState } from 'react';
import {
  Code,
  FileText,
  Volume2,
  Video,
  Users,
  MapPin,
  Bot,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Star,
  Award,
  CheckCircle2,
  Play,
  Layers,
  Cpu,
  Compass,
  Zap,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { GRADE_7_CURRICULA_MODULES } from '../../data/grade7Curricula';

interface Grade7CatalogSectionProps {
  onOpenCurriculaModal: (slugOrId: string) => void;
  onLaunchInteractiveLab?: (missionId: string) => void;
  completedMissions?: Record<string, boolean>;
}

export const Grade7CatalogSection: React.FC<Grade7CatalogSectionProps> = ({
  onOpenCurriculaModal,
  onLaunchInteractiveLab,
  completedMissions = {},
}) => {
  const { lang } = useLanguage();
  const [activeTabUnit, setActiveTabUnit] = useState<'all' | 'u1' | 'u2' | 'u3' | 'u4'>('all');

  const getUnitTag = (missionId: string) => {
    if (missionId.startsWith('g7_word')) return 'u1';
    if (missionId.startsWith('g7_audio') || missionId.startsWith('g7_video')) return 'u2';
    if (missionId.startsWith('g7_cloud') || missionId.startsWith('g7_gis')) return 'u3';
    return 'u4';
  };

  const filteredModules = activeTabUnit === 'all'
    ? GRADE_7_CURRICULA_MODULES
    : GRADE_7_CURRICULA_MODULES.filter(m => getUnitTag(m.missionId) === activeTabUnit);

  return (
    <div id="sectiune-misiuni-clasa-7" className="scroll-mt-6 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
              {lang === 'en' ? 'Practical ICT & C++ Missions • 7th Grade (Art Klett)' : 'Misiuni Practice TIC & C++ • Clasa a VII-a (Manual Art Klett)'}
            </h2>
            <div className="text-xs text-cyan-400 font-mono font-medium">
              {lang === 'en' ? 'Official National Curriculum OMEN 3393/2017 & OM 5420/2024 • 12 Missions' : 'Programa Națională Oficială OMEN 3393/2017 & OM 5420/2024 • 12 Misiuni A & B'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-full border border-cyan-500/40 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{lang === 'en' ? 'C++ & Digital Media Ready' : 'C++ & Media Digitală Activ'}</span>
          </span>
        </div>
      </div>

      {/* 4 Major Units Roadmap Matrix Banner */}
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-950/40 border-2 border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            {lang === 'en' ? '7th Grade Curriculum Roadmap (Manual Art Klett, 116 pages)' : 'Harta Curriculară Clasa a VII-a (Manual Oficial Art Klett, 116 pagini)'}
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
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Toate (12)
            </button>
            <button
              onClick={() => {
                setActiveTabUnit('u1');
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                activeTabUnit === 'u1'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              U1: Word (2)
            </button>
            <button
              onClick={() => {
                setActiveTabUnit('u2');
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                activeTabUnit === 'u2'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              U2: Audio-Video (2)
            </button>
            <button
              onClick={() => {
                setActiveTabUnit('u3');
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                activeTabUnit === 'u3'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              U3: Cloud & GIS (2)
            </button>
            <button
              onClick={() => {
                setActiveTabUnit('u4');
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                activeTabUnit === 'u4'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              U4: C++ & Roboți (6)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex flex-col justify-between">
            <div>
              <span className="text-xl mb-1 block">📝</span>
              <div className="font-bold text-white mb-0.5">Unitatea 1: Editorul de texte</div>
              <div className="text-[11px] text-slate-300 leading-snug">Word, tehnoredactare, diacritice, antet/subsol, tabele și machetare pagină A4 (pag. 10–27)</div>
            </div>
            <span className="mt-2 text-[10px] font-mono font-bold text-blue-400">● 2 MISIUNI ACTIVE (1A & 1B)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col justify-between">
            <div>
              <span className="text-xl mb-1 block">🎬</span>
              <div className="font-bold text-white mb-0.5">Unitatea 2: Audio-Video</div>
              <div className="text-[11px] text-slate-300 leading-snug">WavePad, frecvențe Hz, Paste Mix, VideoPad timeline, tranziții și licențe Creative Commons (pag. 28–47)</div>
            </div>
            <span className="mt-2 text-[10px] font-mono font-bold text-rose-400">● 2 MISIUNI ACTIVE (2A & 2B)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between">
            <div>
              <span className="text-xl mb-1 block">🗺️</span>
              <div className="font-bold text-white mb-0.5">Unitatea 3: Cloud & GIS</div>
              <div className="text-[11px] text-slate-300 leading-snug">Google Docs/Slides în echipă, Version History, Google Earth și straturi tematice GIS (pag. 48–63)</div>
            </div>
            <span className="mt-2 text-[10px] font-mono font-bold text-emerald-400">● 2 MISIUNI ACTIVE (3A & 3B)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/40 flex flex-col justify-between">
            <div>
              <span className="text-xl mb-1 block">⚙️</span>
              <div className="font-bold text-white mb-0.5">Unitatea 4: C++ & Roboți</div>
              <div className="text-[11px] text-slate-300 leading-snug">Code::Blocks, cin/cout, decizii if/else, bucle while/for, algoritmi cifre, fizică & roboți cu senzori (pag. 64–108)</div>
            </div>
            <span className="mt-2 text-[10px] font-mono font-bold text-violet-400">● 6 MISIUNI ACTIVE (4A–4F)</span>
          </div>
        </div>
      </div>

      {/* Grid of 12 Interactive Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModules.map((module, idx) => {
          const isDone = Boolean(completedMissions[module.missionId]);

          return (
            <div
              key={module.id}
              className={`bg-slate-900/90 border-2 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${
                isDone
                  ? 'border-emerald-500/80 shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-cyan-500/60 hover:shadow-cyan-500/10'
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
                        <span>{lang === 'en' ? 'Completed • 100%' : 'Finalizat • Nota 10'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> CLASA A VII-A
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1 font-mono">
                  {module.unit}
                </div>

                <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-cyan-300 transition-colors">
                  {module.title}
                </h3>

                <div className="text-xs font-semibold text-slate-300 mb-3">
                  {module.shortTitle}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {module.metaDescription}
                </p>

                {/* Practical Lab Highlight */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Laborator Practic Ghidat
                  </div>
                  <div className="text-xs text-slate-300 leading-snug">
                    {module.practicalLab}
                  </div>
                </div>

                {/* Highlights Pills */}
                <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> 15–20 min
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> +150 XP
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-cyan-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> CyberCity +50 ByteCoins
                  </span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenCurriculaModal(module.id);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Vezi programa completă, teoria din manual și întrebările frecvente"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Programă & Teorie</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    if (onLaunchInteractiveLab) {
                      onLaunchInteractiveLab(module.missionId);
                    } else {
                      onOpenCurriculaModal(module.id);
                    }
                  }}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isDone
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black shadow-cyan-600/30'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'Replay Mission' : 'Reia Misiunea'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'en' ? 'Start Mission' : 'Lansează Misiunea'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
