import React, { useState } from 'react';
import {
  SplitSquareVertical,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  RotateCcw,
  Scissors,
  ArrowRight,
  FileSpreadsheet,
  Columns,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface W2Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const W2Level3_SectionBreaks: React.FC<W2Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Multi-Section Architecture Lab State
  // Page 1: Portrait (Intro)
  // Page 2: Portrait (Text)
  // Page 3: The Wide Data Table (Target for Landscape!)
  // Page 4: Portrait (Conclusions)
  const [hasSectionBreakBeforeP3, setHasSectionBreakBeforeP3] = useState<boolean>(false);
  const [hasSectionBreakAfterP3, setHasSectionBreakAfterP3] = useState<boolean>(false);
  const [p3Orientation, setP3Orientation] = useState<'portrait' | 'landscape'>('portrait');
  const [activeViewPage, setActiveViewPage] = useState<number>(3);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // If user tries to rotate P3 without section breaks, what happens?
  // In Word without section break, changing orientation changes the ENTIRE document!
  const isDocumentBroken = p3Orientation === 'landscape' && (!hasSectionBreakBeforeP3 || !hasSectionBreakAfterP3);
  const isHybridDocumentPerfect = p3Orientation === 'landscape' && hasSectionBreakBeforeP3 && hasSectionBreakAfterP3;

  const handleSelectAnswer = (qKey: 'q1' | 'q2' | 'q3', answer: string, correct: string) => {
    if (isLocked(qKey)) return;

    if (qKey === 'q1') setQ1Answer(answer);
    if (qKey === 'q2') setQ2Answer(answer);
    if (qKey === 'q3') setQ3Answer(answer);

    if (answer === correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qKey);
    }
  };

  const isQ1Correct = q1Answer === 'a';
  const isQ2Correct = q2Answer === 'b';
  const isQ3Correct = q3Answer === 'c';
  const allCorrect = isQ1Correct && isQ2Correct && isQ3Correct;

  const calculateScore = () => {
    let score = 70;
    if (isQ1Correct) score += 10;
    if (isQ2Correct) score += 10;
    if (isQ3Correct) score += 10;
    return score;
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <span>{lang === 'ro' ? 'Misiunea 1B • Nivelul 3 din 7' : 'Mission 1B • Level 3 of 7'}</span>
              <span>•</span>
              <span>{lang === 'ro' ? 'Manual pag. 22-24' : 'Textbook pp. 22-24'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Ruperi de Secțiune vs Ruperi de Pagină'
                : 'Section Breaks vs. Page Breaks'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              {lang === 'ro'
                ? 'Învață secretul documentelor complexe hibride: de ce o simplă rupere de pagină (Ctrl+Enter) nu poate roti o singură pagină în Landscape și cum izolăm tabelele largi folosind Section Break (Next Page).'
                : 'Discover the secret to hybrid documents: why a simple Page Break (Ctrl+Enter) cannot rotate a single sheet to Landscape, and how to isolate wide tables using Section Break (Next Page).'}
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400 self-start sm:self-auto">
            <SplitSquareVertical className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Theory Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Scissors className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Rupere de Pagină (Page Break)' : 'Page Break (Ctrl+Enter)'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Se introduce instant cu Ctrl + Enter. Forțează textul să continue pe o pagină nouă curată, dar păstrează aceleași margini, orientare și antet pentru întregul fișier.'
              : 'Inserted instantly with Ctrl + Enter. Pushes following text to a clean new page, but preserves identical margins, orientation, and headers across the document.'}
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
            <SplitSquareVertical className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Rupere Secțiune: Pagina Următoare' : 'Section Break: Next Page'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Creează o barieră completă de configurare. Doar o secțiune nouă poate avea orientare diferită (Vedere/Landscape), numerotare repornită de la 1 sau margini unice!'
              : 'Creates a complete formatting boundary. Only a new section can have different orientation (Landscape), restarted page numbering, or unique margins!'}
          </p>
        </div>

        <div className="bg-slate-850/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
            <Columns className="w-5 h-5" />
            <span>{lang === 'ro' ? 'Rupere Secțiune Continuă' : 'Continuous Section Break'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ro'
              ? 'Nu trece pe o pagină nouă, ci împarte aceeași foaie! Esențială când vrei ca titlul să fie pe o coloană lată, iar articolul de dedesubt să fie aranjat pe 2 coloane paralele de ziar.'
              : 'Does not jump to a new page, but splits the current sheet! Crucial when you need a single-column banner headline above 2 parallel newspaper-style columns.'}
          </p>
        </div>
      </div>

      {/* Interactive Multi-Section Hybrid Document Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider">
              {lang === 'ro' ? 'Laborator Practic' : 'Hands-on Lab'}
            </span>
            <h2 className="text-xl font-black text-white">
              {lang === 'ro'
                ? 'Misiune: Rotește doar Pagina 3 cu Tabelul în Landscape!'
                : 'Mission: Rotate Only Page 3 with the Table to Landscape!'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'ro' ? 'Examinare:' : 'Inspection:'}
            </span>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => {
                  sounds.playClick();
                  setActiveViewPage(p);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeViewPage === p
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800'
                }`}
              >
                P{p} {p === 3 ? (lang === 'ro' ? '(Tabel)' : '(Table)') : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls & Tools */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col gap-3.5">
              <span className="text-xs font-bold text-slate-300">
                {lang === 'ro' ? 'Instrumente Machetare & Ruperi:' : 'Layout Tools & Breaks:'}
              </span>

              {/* Step 1: Break before P3 */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setHasSectionBreakBeforeP3(!hasSectionBreakBeforeP3);
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  hasSectionBreakBeforeP3
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">
                    {lang === 'ro'
                      ? '1. Inserează Rupere Secțiune ÎNAINTE de Pagina 3'
                      : '1. Insert Section Break BEFORE Page 3'}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {lang === 'ro'
                      ? 'Separă pagina 2 de pagina 3 într-o secțiune autonomă.'
                      : 'Separates Page 2 from Page 3 into an autonomous section.'}
                  </span>
                </div>
                {hasSectionBreakBeforeP3 ? <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /> : <Scissors className="w-5 h-5 text-slate-500 shrink-0" />}
              </button>

              {/* Step 2: Rotate P3 */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  {lang === 'ro' ? '2. Orientare Pagina 3:' : '2. Page 3 Orientation:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setP3Orientation('portrait');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      p3Orientation === 'portrait' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ro' ? 'Portret (210 mm)' : 'Portrait (210 mm)'}
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setP3Orientation('landscape');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      p3Orientation === 'landscape' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ro' ? 'Vedere (297 mm) 📐' : 'Landscape (297 mm) 📐'}
                  </button>
                </div>
              </div>

              {/* Step 3: Break after P3 */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setHasSectionBreakAfterP3(!hasSectionBreakAfterP3);
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  hasSectionBreakAfterP3
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">
                    {lang === 'ro'
                      ? '3. Inserează Rupere Secțiune DUPĂ Pagina 3'
                      : '3. Insert Section Break AFTER Page 3'}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {lang === 'ro'
                      ? 'Permite Paginii 4 (Concluzii) să revină la orientarea verticală Portret.'
                      : 'Allows Page 4 (Conclusions) to revert back to vertical Portrait orientation.'}
                  </span>
                </div>
                {hasSectionBreakAfterP3 ? <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /> : <Scissors className="w-5 h-5 text-slate-500 shrink-0" />}
              </button>
            </div>

            {/* Diagnostic Message */}
            {isDocumentBroken && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <strong className="block font-bold">
                    {lang === 'ro' ? 'Eroare tipică în Word!' : 'Classic Word Formatting Issue!'}
                  </strong>
                  {lang === 'ro'
                    ? 'Ai rotit pagina în Landscape fără ambele Ruperi de Secțiune. Fără secțiuni izolate, Word va roti automat întregul referat sau va lăsa pagina 4 decuplată incorect!'
                    : 'You rotated the page to Landscape without both Section Breaks. Without isolated boundaries, Word rotates the entire file or leaves Page 4 misaligned!'}
                </div>
              </div>
            )}

            {isHybridDocumentPerfect && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <div>
                  <strong className="block font-bold">
                    {lang === 'ro' ? 'Document Hibrid Impecabil! 🎉' : 'Flawless Hybrid Document! 🎉'}
                  </strong>
                  {lang === 'ro'
                    ? 'Pagina 1 și 2 sunt în Portret, Pagina 3 cu tabelul amplu este izolată în Landscape, iar Pagina 4 revine la Portret. O realizare de profesionist!'
                    : 'Pages 1 and 2 are in Portrait, Page 3 with the wide table is isolated in Landscape, and Page 4 returns to Portrait. Outstanding professional publishing!'}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Document Flow Mockup */}
          <div className="lg:col-span-7 flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 min-h-[380px]">
            <span className="text-xs font-mono text-slate-400 mb-4">
              {lang === 'ro'
                ? 'Harta Secțiunilor Documentului (Vizualizare de Ansamblu):'
                : 'Document Section Map (Overview):'}
            </span>

            {/* Thumbnail representation of all 4 pages */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mb-6">
              {[1, 2, 3, 4].map((pNum) => {
                const isP3 = pNum === 3;
                const isLand = isP3 && p3Orientation === 'landscape' && hasSectionBreakBeforeP3;
                const isCorrupted = isDocumentBroken;

                const pageLabel =
                  pNum === 1
                    ? 'Intro'
                    : pNum === 2
                    ? 'Text'
                    : pNum === 3
                    ? (lang === 'ro' ? 'Tabel' : 'Table')
                    : (lang === 'ro' ? 'Concluzii' : 'Summary');

                return (
                  <div
                    key={pNum}
                    onClick={() => {
                      sounds.playClick();
                      setActiveViewPage(pNum);
                    }}
                    className={`flex flex-col items-center p-2 rounded-xl border transition cursor-pointer ${
                      activeViewPage === pNum
                        ? 'border-purple-400 bg-purple-950/30'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`bg-white rounded shadow text-[6px] text-slate-800 p-1 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                        isLand
                          ? 'w-16 h-11'
                          : isCorrupted && p3Orientation === 'landscape'
                          ? 'w-16 h-11 bg-rose-50'
                          : 'w-11 h-16'
                      }`}
                    >
                      <div className="font-bold border-b border-slate-300 pb-0.5 truncate">
                        P{pNum}: {pageLabel}
                      </div>
                      <div className="space-y-0.5 my-auto">
                        <div className="h-0.5 bg-slate-300 rounded w-full"></div>
                        <div className="h-0.5 bg-slate-300 rounded w-4/5"></div>
                      </div>
                      <div className="text-[5px] text-right text-slate-400 font-mono">
                        {pNum}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2">
                      {isLand ? 'Landscape 📐' : 'Portrait 📄'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Zoomed Detailed View of Selected Page */}
            <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  {lang === 'ro' ? 'Pagina ' : 'Page '}
                  {activeViewPage}:{' '}
                  {activeViewPage === 3
                    ? (lang === 'ro' ? 'Tabel Date Olimpiade (Lățime mare)' : 'Olympiad Results Table (Wide)')
                    : (lang === 'ro' ? 'Conținut Standard' : 'Standard Content')}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {activeViewPage === 3 && p3Orientation === 'landscape' && hasSectionBreakBeforeP3 && hasSectionBreakAfterP3
                    ? (lang === 'ro' ? 'Secțiunea 2 • Landscape (297 mm)' : 'Section 2 • Landscape (297 mm)')
                    : (lang === 'ro' ? 'Secțiunea 1 • Portrait (210 mm)' : 'Section 1 • Portrait (210 mm)')}
                </span>
              </div>

              {activeViewPage === 3 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left border-collapse border border-slate-700">
                    <thead>
                      <tr className="bg-slate-800 text-cyan-300">
                        <th className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Elev' : 'Student'}</th>
                        <th className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Clasa' : 'Class'}</th>
                        <th className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Disciplina' : 'Subject'}</th>
                        <th className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Punctaj' : 'Score'}</th>
                        <th className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Premiu' : 'Award'}</th>
                        <th className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Calificare Națională' : 'National Qualification'}</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr>
                        <td className="border border-slate-700 p-1.5">Popescu Andrei</td>
                        <td className="border border-slate-700 p-1.5">7A</td>
                        <td className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Informatică & TIC' : 'Computer Science & ICT'}</td>
                        <td className="border border-slate-700 p-1.5 font-mono text-emerald-400">98.50</td>
                        <td className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Premiul I' : '1st Prize'}</td>
                        <td className="border border-slate-700 p-1.5 text-cyan-400 font-bold">{lang === 'ro' ? 'DA' : 'YES'}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-700 p-1.5">Ionescu Elena</td>
                        <td className="border border-slate-700 p-1.5">7B</td>
                        <td className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Informatică & TIC' : 'Computer Science & ICT'}</td>
                        <td className="border border-slate-700 p-1.5 font-mono text-emerald-400">95.00</td>
                        <td className="border border-slate-700 p-1.5">{lang === 'ro' ? 'Premiul II' : '2nd Prize'}</td>
                        <td className="border border-slate-700 p-1.5 text-cyan-400 font-bold">{lang === 'ro' ? 'DA' : 'YES'}</td>
                      </tr>
                    </tbody>
                  </table>
                  <span className="text-[10px] text-slate-400 block mt-2 italic">
                    {lang === 'ro'
                      ? 'Acest tabel are 6 coloane dense. Pe formatul vertical (Portret) textul s-ar fi înghesuit inestetic!'
                      : 'This table has 6 dense columns. In vertical Portrait mode, text would be cramped and visually cluttered!'}
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-300 text-xs">
                  <p>
                    {lang === 'ro'
                      ? `Textul din pagina ${activeViewPage} curge în format Portret standard, cu marginile clasice de 2.54 cm.`
                      : `Body text on page ${activeViewPage} flows in standard Portrait format with classic 2.54 cm margins.`}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {lang === 'ro'
                      ? 'Datorită ruperilor de secțiune, modificarea paginii 3 nu a afectat alinierea acestor paragrafe.'
                      : 'Thanks to section breaks, modifying page 3 did not alter the formatting of these paragraphs.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Quiz */}
      <div className="bg-slate-850/80 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 text-indigo-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-xl font-black text-white font-heading">
            {lang === 'ro'
              ? 'Verificarea Cunoștințelor • Ruperi de Secțiune & Pagină'
              : 'Knowledge Check • Section Breaks & Page Breaks'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q1'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: amintește-ți scurtătura universală de rupere de pagină curată!'
                : 'Reflection time: remember the universal clean page break shortcut!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '1. Care este combinația rapidă de taste pentru inserarea unei Ruperi de Pagină (Page Break) în Word?'
              : '1. What is the keyboard shortcut to insert a Page Break in Word?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'a', label: 'Ctrl + Enter' },
              { id: 'b', label: 'Shift + Space' },
              { id: 'c', label: 'Alt + F4' },
              { id: 'd', label: 'Ctrl + Alt + Delete' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id, 'a')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'a'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q1') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{opt.label}</span>
                {q1Answer === opt.id && (opt.id === 'a' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Tastează Ctrl concomitent cu tasta Enter pentru a trece instant pe foaia nouă fără să apeși Enter de 20 de ori.'
                : 'Press Ctrl simultaneously with Enter to immediately jump to a new page without hitting Enter repeatedly.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ1Correct}
            explanation={
              lang === 'ro'
                ? 'Corect! Ctrl + Enter este comanda rapidă standard pentru inserarea unei ruperi de pagină curate (Page Break).'
                : 'Correct! Ctrl + Enter is the universal shortcut to insert a clean Page Break.'
            }
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q2'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: gândește-te ce se întâmplă dacă documentul conține o singură secțiune globală!'
                : 'Reflection time: think about what happens when a document has only a single global section!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '2. Ce se întâmplă dacă încerci să schimbi orientarea unei singure pagini în Vedere (Landscape) fără a insera Ruperi de Secțiune?'
              : '2. What happens if you try to change orientation of a single page to Landscape without inserting Section Breaks?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Procesorul Word se va închide forțat cu eroare critică',
                labelEn: 'Word will crash immediately with a critical system error',
              },
              {
                id: 'b',
                labelRo: 'Toate paginile din întregul document se vor roti automat în Landscape',
                labelEn: 'All pages across the entire document will rotate to Landscape',
              },
              {
                id: 'c',
                labelRo: 'Doar imaginile din pagină se vor roti cu 90 de grade',
                labelEn: 'Only inline pictures on the page will rotate 90 degrees',
              },
              {
                id: 'd',
                labelRo: 'Numerele de pagină se vor șterge automat',
                labelEn: 'Page numbers will be deleted automatically',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id, 'b')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'b'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q2') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q2Answer === opt.id && (opt.id === 'b' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'În Word, orientarea și marginile sunt proprietăți definite la nivel de secțiune, nu la nivel de pagină individuală!'
                : 'In word processors, orientation and margins are section-level properties, not individual page properties!'
            }
          />
          <AnswerExplanation
            isCorrect={isQ2Correct}
            explanation={
              lang === 'ro'
                ? 'Exact! Orientarea paginii este o proprietate a secțiunii. Dacă nu creezi o secțiune nouă cu Section Break (Next Page), comanda de orientare se va propaga peste tot documentul!'
                : 'Exactly! Page orientation is a section-level setting. Without a Section Break (Next Page), applying landscape rotates every single page in the entire document!'
            }
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <PedagogicalReflectionBanner
            cooldownSeconds={cooldowns['q3'] || 0}
            message={
              lang === 'ro'
                ? 'Timp de reflecție: gândește-te la o rupere care nu sare pe pagina următoare, ci continuă pe aceeași foaie!'
                : 'Reflection time: think of a break that does not jump pages, but continues on the same sheet!'
            }
          />
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ro'
              ? '3. Ce tip de rupere de secțiune se folosește când vrem ca titlul să ocupe toată lățimea paginii, iar textul de dedesubt să fie împărțit pe 2 coloane pe aceeași foaie?'
              : '3. What type of section break is used when a headline spans the whole page width and body text underneath divides into 2 columns on the same sheet?'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'a',
                labelRo: 'Rupere de pagină simplă (Page Break)',
                labelEn: 'Simple Page Break',
              },
              {
                id: 'b',
                labelRo: 'Rupere de coloană (Column Break)',
                labelEn: 'Column Break',
              },
              {
                id: 'c',
                labelRo: 'Rupere de secțiune Continuă (Continuous Section Break)',
                labelEn: 'Continuous Section Break',
              },
              {
                id: 'd',
                labelRo: 'Rupere de paragraf forțată (Shift + Enter)',
                labelEn: 'Line Break (Shift + Enter)',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={isLocked('q3')}
                onClick={() => handleSelectAnswer('q3', opt.id, 'c')}
                className={`p-3 text-left rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'c'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                } ${isLocked('q3') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                {q3Answer === opt.id && (opt.id === 'c' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />)}
              </button>
            ))}
          </div>

          <QuestionHint
            hint={
              lang === 'ro'
                ? 'Termenul „Continuu” indică faptul că secțiunea nouă începe pe același rând al foii curente, fără a forța o pagină albă nouă.'
                : '“Continuous” indicates that the new section begins right on the current page, without forcing a page leap.'
            }
          />
          <AnswerExplanation
            isCorrect={isQ3Correct}
            explanation={
              lang === 'ro'
                ? 'Corect! Ruperea de secțiune Continuă (Continuous) permite schimbarea numărului de coloane (de la 1 la 2 sau 3) pe exact aceeași pagină, tehnica de bază folosită la machetarea ziarelor și revistelor.'
                : 'Correct! Continuous section breaks allow altering column layouts (from 1 to 2 or 3) on the exact same page, the foundational technique for newspaper and magazine spreads.'
            }
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={allCorrect}
        onNext={() => {
          sounds.playFanfare();
          onCompletePage(calculateScore());
        }}
        promptText={
          allCorrect
            ? (lang === 'ro' ? 'Ai stăpânit ruperile de secțiune! Treci la Tabele Profesionale!' : 'You mastered section breaks! Proceed to Professional Tables!')
            : (lang === 'ro' ? 'Răspunde corect la cele 3 întrebări de verificare pentru a debloca nivelul următor!' : 'Answer all 3 verification questions correctly to unlock the next level!')
        }
      />
    </div>
  );
};
