import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Target,
  Lightbulb,
  HelpCircle,
  Play,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Command
} from 'lucide-react';
import { CurriculaModule } from '../data/curriculaData';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface CourseCurriculaModalProps {
  module: CurriculaModule | null;
  onClose: () => void;
  onStartMission: (missionId: CurriculaModule['missionId']) => void;
}

export const CourseCurriculaModal: React.FC<CourseCurriculaModalProps> = ({
  module,
  onClose,
  onStartMission,
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'theory' | 'competencies' | 'vocab' | 'faq'>('theory');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!module) return null;

  const handleCopyLink = () => {
    sounds.playClick();
    const url = `https://arkyedu.com/#curricula-${module.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      });
    }
  };

  const handlePrint = () => {
    sounds.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleStartMission = () => {
    sounds.playSuccess();
    onStartMission(module.missionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        {/* Header with gradient badge and badges */}
        <div className="relative p-5 sm:p-6 pb-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Închide"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {module.grade}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700">
              {module.unit}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              {module.manualRef}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-3xl shadow-lg shrink-0`}>
              {module.icon}
            </div>
            <div className="min-w-0 pr-8">
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                {module.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
                {module.metaDescription}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-5 overflow-x-auto no-scrollbar border-b border-slate-800/60 pb-1 -mb-1">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('theory');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'theory'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Sinteză Teoretică</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('competencies');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'competencies'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Competențe MEN</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('vocab');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'vocab'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Vocabular & Comenzi</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('faq');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'faq'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Auto-evaluare & Practică</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: Sinteza Teoretica */}
          {activeTab === 'theory' && (
            <div className="space-y-6 animate-in fade-in">
              {module.theorySections.map((section, idx) => (
                <div key={idx} className="bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-800">
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 mb-3 font-heading">
                    <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
                    {section.content.map((item, pIdx) => (
                      <li key={pIdx} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>

                  {section.tips && (
                    <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{section.tips}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Competente MEN */}
          {activeTab === 'competencies' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200">
                <p className="font-semibold text-white mb-1">
                  📋 Aliniere Curriculară Națională:
                </p>
                <p>
                  Competențele specifice de mai jos sunt prevăzute în Programa Școlară pentru disciplina <strong>Informatică și TIC</strong> (Gimnaziu) aprobată prin OMEN nr. 3393/2017.
                </p>
              </div>

              <div className="grid gap-3">
                {module.competencies.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 text-xs font-black font-mono border border-sky-500/30 shrink-0">
                      C.S. {comp.code}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {comp.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400 font-mono">
                💡 Recomandare didactică: Această fișă poate fi inclusă direct în planificarea calendaristică sau în proiectul de lecție pentru inspecții școlare.
              </div>
            </div>
          )}

          {/* TAB 3: Vocabular & Comenzi */}
          {activeTab === 'vocab' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider font-heading mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Glosar de Termeni TIC Cheie
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {module.keyTerms.map((term, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="font-black text-white text-xs sm:text-sm text-sky-300 font-mono">
                        {term.term}
                      </div>
                      <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {term.definition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {module.keyboardShortcuts && module.keyboardShortcuts.length > 0 && (
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-heading mb-3 flex items-center gap-2">
                    <Command className="w-4 h-4 text-emerald-400" />
                    Scurtături Utile de Tastatură (Laborator)
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {module.keyboardShortcuts.map((sc, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-300">{sc.action}</span>
                        <kbd className="px-2 py-1 rounded bg-slate-800 text-sky-300 font-mono font-bold text-[11px] border border-slate-700 shadow-inner">
                          {sc.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FAQ & Practica */}
          {activeTab === 'faq' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider font-heading mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  Întrebări Frecvente & Auto-Evaluare
                </h4>
                <div className="space-y-3">
                  {module.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="font-bold text-white text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{faq.question}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-300 mt-2 pl-6 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {module.practicalLab && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/40">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
                    <Sparkles className="w-4 h-4" />
                    Exercițiul Practic de Laborator
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {module.practicalLab}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Tipărește fișa didactică pentru clasă"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tipărește Fișa</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Copiază link-ul direct pentru elevi/profesori"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copiat!' : 'Copiază Link'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              Închide
            </button>

            <button
              onClick={handleStartMission}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Lansează Misiunea Interactivă</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
