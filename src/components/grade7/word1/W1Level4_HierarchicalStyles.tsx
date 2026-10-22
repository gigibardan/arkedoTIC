import React, { useState } from 'react';
import {
  Heading1,
  Heading2,
  ListTree,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Navigation,
  FileText,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W1Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

interface DocumentSection {
  id: string;
  title: string;
  body: string;
  correctStyle: 'h1' | 'h2';
  pageNumber: number;
}

export const W1Level4_HierarchicalStyles: React.FC<W1Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const sections: DocumentSection[] = [
    {
      id: 's1',
      title: 'Introducere în Tehnoredactarea Digitală',
      body: 'Documentele moderne nu sunt simple foi tipărite, ci structuri logice compuse din capitole și subcapitole.',
      correctStyle: 'h1',
      pageNumber: 1,
    },
    {
      id: 's2',
      title: 'Evoluția de la Mașina Mecanică de Scris',
      body: 'La mașina de scris nu existau fonturi variabile și stiluri ierarhice; spațierea se făcea mecanic cu carul.',
      correctStyle: 'h2',
      pageNumber: 2,
    },
    {
      id: 's3',
      title: 'Standardele de Formatare Academică',
      body: 'Ghidurile universitare impun corp de text de 12pt, interlinie de 1.5 și titluri ierarhizate strict.',
      correctStyle: 'h2',
      pageNumber: 3,
    },
    {
      id: 's4',
      title: 'Concluzii și Bune Practici Editoriale',
      body: 'Un tehnoredactor eficient economisește zeci de ore aplicând stiluri rapide în loc de formatare manuală.',
      correctStyle: 'h1',
      pageNumber: 5,
    },
  ];

  const [sectionStyles, setSectionStyles] = useState<Record<string, 'normal' | 'h1' | 'h2'>>({
    s1: 'normal',
    s2: 'normal',
    s3: 'normal',
    s4: 'normal',
  });

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleApplyStyle = (sectionId: string, style: 'normal' | 'h1' | 'h2') => {
    sounds.playClick();
    setSectionStyles((prev) => ({ ...prev, [sectionId]: style }));
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'auto_toc') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'global_update') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'nav_pane') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1Answer === 'auto_toc';
  const isQ2Correct = q2Answer === 'global_update';
  const isQ3Correct = q3Answer === 'nav_pane';

  const correctStylesCount = sections.filter(
    (sec) => sectionStyles[sec.id] === sec.correctStyle
  ).length;

  let totalScore = 0;
  if (correctStylesCount === 4) totalScore += 25;
  else if (correctStylesCount >= 2) totalScore += 15;
  if (isQ1Correct) totalScore += 25;
  if (isQ2Correct) totalScore += 25;
  if (isQ3Correct) totalScore += 25;

  const canProceed = totalScore >= 70;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono font-bold border border-violet-500/40">
              <ListTree className="w-3.5 h-3.5 text-violet-400" />
              <span>NIVELUL 4 DIN 7 • STILURI STRUCTURATE & CUPRINS AUTOMAT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Stiluri Ierarhice (Heading 1 & 2) vs Formatare Manuală
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Formatarea manuală (mărire font + Bold) este marea capcană a începătorilor. Doar aplicând stilurile semantice „Titlu 1” și „Titlu 2” permiți editorului să genereze Cuprinsul automat în câteva secunde și să ofere navigare instantanee prin capitole.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-violet-500/40 text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Punctaj Nivel 4</span>
              <span className="text-2xl font-black font-mono text-cyan-400">{totalScore} / 100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Styles & Table of Contents Lab */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
              <ListTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Laboratorul Interactiv: Galeria de Stiluri & Cuprinsul Dinamic</h2>
              <p className="text-xs text-slate-400">
                Atribuie fiecărei secțiuni stilul corect (Titlu 1 pentru capitole mari, Titlu 2 pentru subcapitole) și privește cum se construiește Cuprinsul automat!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-violet-300 bg-violet-950/80 px-3 py-1.5 rounded-full border border-violet-500/40">
              Stiluri corecte: <b className="text-white">{correctStylesCount} / 4</b>
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Document Sections + Dynamic TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sections to style */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Document de Lucru — Aplică Stilurile din Panglică:
            </span>

            {sections.map((sec, idx) => {
              const currentStyle = sectionStyles[sec.id];
              const isCorrect = currentStyle === sec.correctStyle;

              return (
                <div
                  key={sec.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-slate-950/80 border-emerald-500/40'
                      : currentStyle !== 'normal'
                      ? 'bg-slate-950/80 border-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-slate-500">Secțiunea {idx + 1}</span>
                    <div className="flex items-center gap-1">
                      {(['normal', 'h1', 'h2'] as const).map((styleOpt) => (
                        <button
                          key={styleOpt}
                          type="button"
                          onClick={() => handleApplyStyle(sec.id, styleOpt)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                            currentStyle === styleOpt
                              ? styleOpt === 'h1'
                                ? 'bg-blue-600 text-white border-blue-400'
                                : styleOpt === 'h2'
                                ? 'bg-indigo-600 text-white border-indigo-400'
                                : 'bg-slate-700 text-slate-200 border-slate-600'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {styleOpt === 'normal' ? 'Normal' : styleOpt === 'h1' ? 'Titlu 1' : 'Titlu 2'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rendered Heading based on chosen style */}
                  <div className="space-y-1">
                    <h3
                      className={`transition-all ${
                        currentStyle === 'h1'
                          ? 'text-lg font-black text-blue-400 font-heading border-b border-blue-500/30 pb-1'
                          : currentStyle === 'h2'
                          ? 'text-sm font-bold text-indigo-300 font-heading pl-2 border-l-2 border-indigo-400'
                          : 'text-sm text-slate-400 font-normal'
                      }`}
                    >
                      {currentStyle === 'h1' && '1. '}
                      {currentStyle === 'h2' && '1.1. '}
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{sec.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Table of Contents (Cuprins Automat) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Cuprins Automat Generat (Table of Contents)
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {sections.map((sec) => {
                  const currentStyle = sectionStyles[sec.id];
                  if (currentStyle === 'normal') {
                    return null;
                  }

                  const isH1 = currentStyle === 'h1';

                  return (
                    <div
                      key={sec.id}
                      className={`flex items-baseline justify-between transition-all py-1 ${
                        isH1 ? 'text-white font-bold' : 'text-slate-300 pl-4 font-normal'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {isH1 ? 'Cap. ' : '– '}
                        {sec.title}
                      </span>
                      <span className="shrink-0 text-slate-500 flex items-center gap-1">
                        <span className="hidden sm:inline">...............</span>
                        <span className="text-cyan-400 font-bold">pag. {sec.pageNumber}</span>
                      </span>
                    </div>
                  );
                })}

                {Object.values(sectionStyles).every((s) => s === 'normal') && (
                  <div className="text-center py-8 text-slate-500 space-y-1">
                    <p className="italic">Niciun titlu detectat în document.</p>
                    <p className="text-[11px] text-slate-600">
                      Word are nevoie de stiluri Titlu 1 sau Titlu 2 pentru a genera cuprinsul!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {correctStylesCount === 4 && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Structură ierarhică validată! Cuprinsul este sincronizat.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pedagogical Questions Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificarea Cunoștințelor: Stiluri Ierarhice & Cuprins</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări de arhitectură a documentelor.</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. De ce este recomandată folosirea stilurilor „Titlu 1” și „Titlu 2” în locul măririi manuale a fontului la 18pt și îngroșat (Bold)?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'auto_toc',
                text: 'Permite generarea automată a Cuprinsului (Table of Contents), numerotarea automată a capitolelor și navigarea rapidă prin document.',
              },
              {
                id: 'smaller_file',
                text: 'Face fișierul Word de 10 ori mai mic pe disc la salvare.',
              },
              {
                id: 'color_only',
                text: 'Este singura metodă prin care un text poate fi colorat în albastru.',
              },
              {
                id: 'anti_virus',
                text: 'Protejează documentul împotriva virușilor de tip troian.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'auto_toc'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Gândește-te la un referat de 50 de pagini: dacă ai 20 de capitole, cum construiești cuprinsul manual fără să verifici fiecare număr de pagină?"
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Stilurile semantice oferă textului un rol ierarhic. Cuprinsul automat citește exact aceste stiluri și actualizează numerele de pagină fără erori umane."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Dacă ai o carte de 200 de pagini și modifici culoarea sau fontul stilului „Titlu 1”, ce se întâmplă în tot documentul?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'global_update',
                text: 'Toate titlurile de nivel 1 din întreaga carte se actualizează automat și instantaneu la noul aspect.',
              },
              {
                id: 'first_only',
                text: 'Se modifică doar primul titlu de pe prima pagină, restul rămân neschimbate.',
              },
              {
                id: 'error_prompt',
                text: 'Apare o eroare și trebuie să rescrii toate capitolele de la capăt.',
              },
              {
                id: 'delete_toc',
                text: 'Se șterge automat tot cuprinsul fără posibilitate de recuperare.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'global_update'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Aceasta este magia stilurilor centralizate: schimbi definiția într-un singur loc și efectul se propagă pe toate sutele de pagini!"
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! Aceasta este consistența designului digital: modificând proprietățile stilului, toate instanțele din document preiau modificarea în timp real."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Ce panou din Microsoft Word (deschis rapid cu Ctrl+F) afișează arborele de capitole și permite reordonarea lor prin drag-and-drop?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'nav_pane', text: 'Panoul de Navigare (Navigation Pane — fila Titluri)' },
              { id: 'font_dialog', text: 'Caseta de dialog Font (Ctrl+D)' },
              { id: 'spell_check', text: 'Panoul de verificare ortografică F7' },
              { id: 'clip_board', text: 'Panoul Clipboard Office' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'nav_pane'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hint="Apasă tasta F5 sau combinația Ctrl+F și privește în stânga ecranului: ai 'Titluri', 'Pagini' și 'Rezultate'."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Corect! Panoul de Navigare (Navigation Pane) listează toate stilurile Heading într-o hartă interactivă a documentului, permițând sărirea directă la orice capitol."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={4}
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
