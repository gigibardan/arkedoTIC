import React, { useState } from 'react';
import {
  Table2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Maximize2,
  RotateCw,
  AlignJustify,
  AlertTriangle,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C2Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C2Level2_MergeAndWrap: React.FC<C2Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive toggles
  const [isMerged, setIsMerged] = useState<boolean>(true);
  const [isWrapped, setIsWrapped] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'normal' | 'angle' | 'vertical'>('normal');

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'topLeft') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'wrapText') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'altEnter') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'topLeft';
  const isQ2Correct = q2Answer === 'wrapText';
  const isQ3Correct = q3Answer === 'altEnter';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-emerald-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett 2025 Textbook • P. 22–23' : 'Manual Art Klett 2025 • Pag. 22–23'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Table2 className="w-8 h-8 text-teal-400" />
              {lang === 'en' ? 'Level 2: Cell Merging (Merge) & Text Wrapping (Wrap)' : 'Nivelul 2: Îmbinarea Celulelor (Merge) & Încadrarea Textului (Wrap)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'How do you create a unified banner title across multiple columns, and how do you fit long texts on multiple lines without excessively widening columns?'
                : 'Cum creezi un titlu unificat peste mai multe coloane și cum așezi textele lungi pe rânduri multiple fără să lărgești exagerat foaia de calcul?'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Module 1B' : 'Modulul 1B'}</div>
            <div className="text-2xl font-black text-teal-400">2 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Tool Studio: Merge & Center + Wrap Text */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en' ? 'Interactive Studio: Cell Alignment & Merging' : 'Atelier Interactiv: Alinierea & Îmbinarea Celulelor'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Test official controls from the "Alignment" group on the Home Ribbon'
                  : 'Testează butoanele oficiale din grupul „Aliniere” de pe Panglica Pornire'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Merge Toggle */}
            <button
              type="button"
              onClick={() => { sounds.playClick(); setIsMerged(prev => !prev); }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                isMerged
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isMerged
                ? (lang === 'en' ? '✓ Merge & Center (Active)' : '✓ Îmbinare & Centrare (Activat)')
                : (lang === 'en' ? 'Merge & Center (Disabled)' : 'Îmbinare & Centrare (Dezactivat)')}
            </button>

            {/* Wrap Toggle */}
            <button
              type="button"
              onClick={() => { sounds.playClick(); setIsWrapped(prev => !prev); }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                isWrapped
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isWrapped
                ? (lang === 'en' ? '✓ Wrap Text (Active)' : '✓ Înfășurare Text (Activat)')
                : (lang === 'en' ? 'Wrap Text (Disabled)' : 'Înfășurare Text (Wrap Text)')}
            </button>
          </div>
        </div>

        {/* Orientation Selector */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'en' ? 'Column header orientation:' : 'Orientare text antet coloane:'}
          </span>
          {[
            { id: 'normal', label: lang === 'en' ? 'Horizontal Normal (0°)' : 'Orizontal Normal (0°)' },
            { id: 'angle', label: lang === 'en' ? 'Angle Counterclockwise 45°' : 'Înclinație la 45°' },
            { id: 'vertical', label: lang === 'en' ? 'Vertical Text' : 'Text Vertical' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { sounds.playClick(); setOrientation(opt.id as any); }}
              className={`px-2.5 py-1 rounded-lg transition font-mono ${
                orientation === opt.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Live Simulated Table */}
        <div className="border border-slate-700 rounded-2xl overflow-x-auto bg-slate-950 font-mono text-xs shadow-inner">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs">
                <th className="p-2 border-r border-slate-800 w-12 bg-slate-850">◢</th>
                <th className="p-2 border-r border-slate-800 w-1/4">A</th>
                <th className="p-2 border-r border-slate-800 w-1/4">B</th>
                <th className="p-2 border-r border-slate-800 w-1/4">C</th>
                <th className="p-2 w-1/4">D</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Merged Title vs Unmerged */}
              <tr className="border-b border-slate-800 bg-emerald-950/40">
                <td className="p-2.5 border-r border-slate-800 bg-slate-900 text-slate-400 font-bold">1</td>
                {isMerged ? (
                  <td
                    colSpan={4}
                    className="p-3 text-center font-black text-white text-sm bg-gradient-to-r from-emerald-900/40 via-teal-900/50 to-emerald-900/40 tracking-wider text-emerald-200"
                  >
                    {lang === 'en'
                      ? 'GRADE ROSTER — GRADE 8 B (A1:D1 Merged & Centered)'
                      : 'CATALOGUL NOTELOR — CLASA A VIII-A B (A1:D1 Îmbinat & Centrat)'}
                  </td>
                ) : (
                  <>
                    <td className="p-2.5 border-r border-slate-800 text-emerald-300 font-bold">{lang === 'en' ? 'ROSTER' : 'CATALOGUL'}</td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-500">{lang === 'en' ? 'GRADES' : 'NOTELOR'}</td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-500">{lang === 'en' ? 'GRADE 8' : 'CLASA VIII'}</td>
                    <td className="p-2.5 text-slate-500">{lang === 'en' ? 'YEAR 2026' : 'AN 2026'}</td>
                  </>
                )}
              </tr>

              {/* Row 2: Column Headers with Orientation */}
              <tr className="border-b border-slate-800 bg-slate-900/80 font-bold text-slate-200">
                <td className="p-2.5 border-r border-slate-800 bg-slate-900 text-slate-400">2</td>
                <td className="p-3 border-r border-slate-800">
                  <span className={`inline-block transition ${orientation === 'angle' ? '-rotate-45' : orientation === 'vertical' ? 'writing-vertical' : ''}`}>
                    {lang === 'en' ? 'Student Full Name' : 'Nume & Prenume Elev'}
                  </span>
                </td>
                <td className="p-3 border-r border-slate-800">
                  <span className={`inline-block transition ${orientation === 'angle' ? '-rotate-45' : orientation === 'vertical' ? 'writing-vertical' : ''}`}>
                    {lang === 'en' ? 'Computer Science' : 'Informatică'}
                  </span>
                </td>
                <td className="p-3 border-r border-slate-800">
                  <span className={`inline-block transition ${orientation === 'angle' ? '-rotate-45' : orientation === 'vertical' ? 'writing-vertical' : ''}`}>
                    {lang === 'en' ? 'Mathematics' : 'Matematică'}
                  </span>
                </td>
                {/* Column D: Demonstrating Wrap Text */}
                <td className="p-3 max-w-[150px]">
                  <span className={`inline-block transition ${
                    isWrapped ? 'whitespace-normal leading-tight text-teal-300' : 'whitespace-nowrap overflow-hidden text-ellipsis block text-slate-400'
                  }`}>
                    {lang === 'en' ? 'Annual pedagogical observations and notes' : 'Observații și recomandări pedagogice anuale'}
                  </span>
                </td>
              </tr>

              {/* Row 3: Sample Student Data */}
              <tr className="border-b border-slate-850 hover:bg-slate-800/30">
                <td className="p-2.5 border-r border-slate-850 bg-slate-900 text-slate-400 font-bold">3</td>
                <td className="p-2.5 border-r border-slate-850 text-left pl-3 text-slate-200">Popescu Andrei</td>
                <td className="p-2.5 border-r border-slate-850 text-emerald-400 font-bold">10</td>
                <td className="p-2.5 border-r border-slate-850 text-slate-300">9</td>
                <td className="p-2.5 text-left pl-3 text-slate-400 text-[11px]">
                  {lang === 'en' ? 'County ICT Olympiad Contestant' : 'Olimpic la faza județeană de TIC'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Warning Banner from Textbook (Page 22) */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white font-bold">
              {lang === 'en' ? 'Critical Warning from Textbook (p. 22):' : 'Avertisment critic din Manual (pag. 22):'}
            </strong>
            <p className="leading-relaxed">
              {lang === 'en'
                ? <>If you merge two or more cells that already contain data, <strong>only the upper-left cell value is preserved</strong>! Content in other cells is permanently discarded.</>
                : <>Dacă îmbini două sau mai multe celule care conțin deja date (de exemplu A1 conține „Elev” și B1 conține „Notă”), <strong>doar valoarea din celula din stânga-sus (A1) este păstrată</strong>! Conținutul celulelor din dreapta este șters definitiv.</>}
            </p>
          </div>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Pedagogical Check: Merge & Wrap Text' : 'Verificare Pedagogică: Îmbinare & Înfășurare Text'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Answer all 3 textbook questions correctly to advance' : 'Răspunde corect la cele 3 întrebări din manual pentru a avansa'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. What happens to existing data if you merge multiple cells that each contained different text?'
                : '1. Ce se întâmplă cu datele dacă îmbini mai multe celule care conțineau fiecare câte un text diferit?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'topLeft', text: lang === 'en' ? 'Only the value from the upper-left cell is kept; remaining data is discarded' : 'Se păstrează numai valoarea din celula din stânga-sus, restul datelor fiind șterse' },
              { id: 'allConcatenated', text: lang === 'en' ? 'All words are automatically joined into one giant block of text' : 'Toate cuvintele se lipesc automat într-un singur text uriaș' },
              { id: 'backupCloud', text: lang === 'en' ? 'Data is emailed to the homeroom teacher' : 'Datele sunt trimise pe e-mail dirigintelui' },
              { id: 'duplicateSheet', text: lang === 'en' ? 'A new duplicate workbook file opens automatically' : 'Se deschide automat o copie nouă de fișier' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'topLeft'
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
            hintRo="Amintește-ți de caseta de avertizare a programului Excel menționată la pagina 22 din manual."
            hintEn="Recall the Excel alert dialog mentioned on page 22 of the official textbook."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! Comanda 'Merge & Center' păstrează exclusiv conținutul celulei din stânga-sus a domeniului selectat, avertizând utilizatorul că restul datelor vor fi eliminate."
              explanationEn="Correct! The 'Merge & Center' command retains only the upper-left cell's value and warns that other cell values will be discarded."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. Which command allows displaying long text on multiple lines within the same cell without widening the column?'
                : '2. Ce comandă permite afișarea unui text lung pe mai multe rânduri în interiorul aceleiași celule, fără a mări lățimea coloanei?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'wrapText', text: lang === 'en' ? 'Wrap Text' : 'Înfășurare text (Wrap Text)' },
              { id: 'deleteText', text: lang === 'en' ? 'Clear Formats' : 'Ștergere formatare (Clear Formats)' },
              { id: 'zoom50', text: lang === 'en' ? 'Decreasing Zoom to 10%' : 'Micșorarea Zoom-ului la 10%' },
              { id: 'saveAsPdf', text: lang === 'en' ? 'Save as plain .txt file' : 'Salvare ca fișier text .txt' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'wrapText'
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
            hintRo="Comanda se găsește în grupul 'Aliniere' și se traduce literal prin înfășurarea/încadrarea textului."
            hintEn="The command is found in the 'Alignment' ribbon group and wraps words across multiple rows."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Excelent! Wrap Text adaptează înălțimea rândului și distribuie cuvintele pe mai multe linii, asigurând lizibilitatea capetelor de tabel compacte."
              explanationEn="Excellent! Wrap Text adjusts the row height to flow text across multiple lines, preserving compact column widths."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. What keyboard shortcut inserts a manual line break while editing text inside a cell?'
                : '3. Ce combinație de taste introduce manual un rând nou în timp ce editezi textul în interiorul unei celule?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'altEnter', text: 'Alt + Enter' },
              { id: 'enterSimple', text: lang === 'en' ? 'Simple Enter (which moves to the cell below)' : 'Enter simplu (care doar trece la celula de dedesubt)' },
              { id: 'ctrlEsc', text: 'Ctrl + Escape' },
              { id: 'shiftTab', text: 'Shift + Tab' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'altEnter'
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
            hintRo="Apăsarea tastei Enter normale validează celula și sare la rândul următor. Ai nevoie de o tastă modificatoare (Alt)."
            hintEn="Normal Enter confirms the cell and moves down. You need a modifier key (Alt)."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanationRo="Exact! Combinația Alt + Enter forțează o linie nouă (linebreak) în corpul celulei curente, fiind trucul preferat al redactorilor de foi de calcul."
              explanationEn="Exactly! Alt + Enter creates an in-cell line break, a crucial productivity trick for clean spreadsheet tables."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={2}
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
