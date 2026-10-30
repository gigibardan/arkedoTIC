import React, { useState } from 'react';
import {
  Grid,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  MousePointer,
  Crosshair,
  Hash,
  Square,
  Maximize,
  Info,
  Check
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C1Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C1Level3_CellCoordinatesRanges: React.FC<C1Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Selected cell coordinates
  const [activeCell, setActiveCell] = useState<{ col: string; row: number }>({ col: 'B', row: 2 });

  // Selected preset range
  const [activeRange, setActiveRange] = useState<{ startCol: string; startRow: number; endCol: string; endRow: number } | null>({
    startCol: 'D',
    startRow: 1,
    endCol: 'E',
    endRow: 2
  });

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  const rows = [1, 2, 3, 4, 5, 6];

  const handleCellClick = (col: string, row: number) => {
    sounds.playClick();
    setActiveCell({ col, row });
    setActiveRange(null); // Clear active range to focus on single cell
  };

  const isCellInRange = (col: string, row: number) => {
    if (!activeRange) return false;
    const colIdx = columns.indexOf(col);
    const startColIdx = columns.indexOf(activeRange.startCol);
    const endColIdx = columns.indexOf(activeRange.endCol);

    const minCol = Math.min(startColIdx, endColIdx);
    const maxCol = Math.max(startColIdx, endColIdx);
    const minRow = Math.min(activeRange.startRow, activeRange.endRow);
    const maxRow = Math.max(activeRange.startRow, activeRange.endRow);

    return colIdx >= minCol && colIdx <= maxCol && row >= minRow && row <= maxRow;
  };

  const getRangeCellCount = () => {
    if (!activeRange) return 1;
    const startColIdx = columns.indexOf(activeRange.startCol);
    const endColIdx = columns.indexOf(activeRange.endCol);
    const colCount = Math.abs(endColIdx - startColIdx) + 1;
    const rowCount = Math.abs(activeRange.endRow - activeRange.startRow) + 1;
    return colCount * rowCount;
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'b2') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'colon') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'fourCells') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'b2';
  const isQ2Correct = q2Answer === 'colon';
  const isQ3Correct = q3Answer === 'fourCells';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-teal-900/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 14–16</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Grid className="w-8 h-8 text-emerald-400" />
              Nivelul 3: Coordonate, Celule Active & Domenii (Ranges)
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Foaia Excel are 1.048.576 de rânduri și 16.384 de coloane. Învață cum se adresează corect fiecare celulă și cum definim grupuri dreptunghiulare de celule (domenii) prin separatorul două puncte (:).
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Pas Curent</div>
            <div className="text-2xl font-black text-emerald-400">3 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Coordinate & Range Navigator Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Navigatorul Cartezian de Celule & Domenii</h2>
              <p className="text-xs text-slate-400">
                Fă clic pe orice celulă din grilă sau alege un domeniu din exemplele manualului
              </p>
            </div>
          </div>

          {/* Current Selection Pill */}
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 font-mono">
            <span className="text-xs text-slate-400">Adresă Activă:</span>
            <span className="text-emerald-300 font-black text-base bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
              {activeRange ? `${activeRange.startCol}${activeRange.startRow}:${activeRange.endCol}${activeRange.endRow}` : `${activeCell.col}${activeCell.row}`}
            </span>
            {activeRange && (
              <span className="text-[11px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
                {getRangeCellCount()} celule
              </span>
            )}
          </div>
        </div>

        {/* Preset Range Selector Buttons (from textbook p. 15) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Domenii din Manual:</span>
          {[
            { label: 'D1:E2 (Exemplu pag. 15)', startCol: 'D', startRow: 1, endCol: 'E', endRow: 2 },
            { label: 'G2:I2 (Orizontal)', startCol: 'C', startRow: 2, endCol: 'E', endRow: 2 },
            { label: 'B2:D5 (Bloc 4x3)', startCol: 'B', startRow: 2, endCol: 'D', endRow: 5 },
            { label: 'A1:C1 (Antet)', startCol: 'A', startRow: 1, endCol: 'C', endRow: 1 },
          ].map(preset => {
            const isSelected = activeRange && activeRange.startCol === preset.startCol && activeRange.startRow === preset.startRow && activeRange.endCol === preset.endCol && activeRange.endRow === preset.endRow;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveRange({ startCol: preset.startCol, startRow: preset.startRow, endCol: preset.endCol, endRow: preset.endRow });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Live Interactive Grid */}
        <div className="border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950 font-mono shadow-inner select-none">
          {/* Column Header Row */}
          <div className="grid grid-cols-7 bg-slate-900 border-b border-slate-800 text-center font-bold text-xs">
            <div className="p-2 border-r border-slate-800 bg-slate-850 text-slate-500 flex items-center justify-center">
              ◢
            </div>
            {columns.map(col => {
              const isColActive = (!activeRange && activeCell.col === col) || (activeRange && (columns.indexOf(col) >= Math.min(columns.indexOf(activeRange.startCol), columns.indexOf(activeRange.endCol)) && columns.indexOf(col) <= Math.max(columns.indexOf(activeRange.startCol), columns.indexOf(activeRange.endCol))));
              return (
                <div
                  key={col}
                  className={`p-2 border-r border-slate-800 transition ${
                    isColActive ? 'bg-emerald-500/30 text-emerald-200 font-black' : 'text-slate-400'
                  }`}
                >
                  {col}
                </div>
              );
            })}
          </div>

          {/* Grid Rows */}
          {rows.map(row => {
            const isRowActive = (!activeRange && activeCell.row === row) || (activeRange && (row >= Math.min(activeRange.startRow, activeRange.endRow) && row <= Math.max(activeRange.startRow, activeRange.endRow)));
            return (
              <div key={row} className="grid grid-cols-7 border-b border-slate-850 last:border-b-0 text-xs">
                {/* Row Header */}
                <div
                  className={`p-3 border-r border-slate-800 text-center font-bold transition ${
                    isRowActive ? 'bg-emerald-500/30 text-emerald-200 font-black' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {row}
                </div>

                {/* Cells A..F */}
                {columns.map(col => {
                  const isCurrentSingleCell = !activeRange && activeCell.col === col && activeCell.row === row;
                  const inRange = isCellInRange(col, row);

                  return (
                    <div
                      key={`${col}${row}`}
                      onClick={() => handleCellClick(col, row)}
                      className={`p-3 border-r border-slate-850 last:border-r-0 text-center cursor-pointer transition relative group ${
                        isCurrentSingleCell
                          ? 'bg-emerald-500/20 ring-2 ring-emerald-400 text-emerald-200 font-bold z-10'
                          : inRange
                          ? 'bg-teal-500/25 border-teal-500/40 text-teal-200 font-medium'
                          : 'hover:bg-slate-800/40 text-slate-500'
                      }`}
                    >
                      <span>{col}{row}</span>
                      {isCurrentSingleCell && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-sm" title="Mâner de umplere (Fill handle)"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Technical Explanations Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Square className="w-4 h-4" />
              Celula Activă & Mânerul de Umplere
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Celula selectată este evidențiată cu un chenar îngroșat. Pătrățelul din colțul dreapta-jos se numește <strong>mâner de umplere (fill handle)</strong> și permite copierea automată a formulelor și crearea de serii de date (1, 2, 3... sau Ianuarie, Februarie...).
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-teal-400 font-bold text-sm flex items-center gap-2">
              <Maximize className="w-4 h-4" />
              Sintaxa Domeniilor: Semnul Două Puncte (:)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un domeniu este definit prin coordonata colțului stânga-sus și colțului dreapta-jos despărțite prin două puncte. Formula <code>=SUM(D1:E2)</code> adună toate cele 4 celule incluse în dreptunghi (D1, E1, D2, E2).
            </p>
          </div>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificare Pedagogică: Coordonate & Domenii</h2>
            <p className="text-xs text-slate-400">Răspunde corect la cele 3 întrebări din manual pentru a avansa</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. Cum se scrie corect adresa celulei aflate la intersecția coloanei B cu rândul 2?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'b2', text: 'B2 (Litera coloanei urmată de numărul rândului)' },
              { id: '2b', text: '2B (Numărul rândului urmat de litera coloanei)' },
              { id: 'b_dash_2', text: 'B-2 cu cratimă la mijloc' },
              { id: 'b_plus_2', text: 'B+2 cu semnul adunării' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'b2'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="În sistemul cartezian Excel se specifică întâi axa verticală (litera coloanei) și apoi numărul rândului." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Adresa celulei se notează întotdeauna cu litera coloanei urmată de numărul rândului: B2. Scrierea '2B' este o eroare comună sancționată de aplicație."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Ce caracter de punctuație este folosit în mod standard pentru a defini un domeniu compact de celule (de la celula de început la cea de sfârșit)?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'colon', text: 'Două puncte (:) de exemplu D1:E2' },
              { id: 'slash', text: 'Bară oblică (/) de exemplu D1/E2' },
              { id: 'percent', text: 'Semnul de procent (%) de exemplu D1%E2' },
              { id: 'dollar', text: 'Semnul dolar ($) de exemplu D1$E2' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'colon'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Privește exemplul din manual: D1:E2 include celulele de la D1 până la E2." />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! Caracterul două puncte (:) reprezintă operatorul de domeniu în Excel, indicând toate celulele cuprinse între colțul stânga-sus și cel dreapta-jos."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Conform exemplului de la pagina 15 din manual, câte celule cuprinde domeniul notat D1:E2?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'fourCells', text: '4 celule (D1, E1, D2 și E2)' },
              { id: 'twoCells', text: 'Doar 2 celule (D1 și E2 pe diagonală)' },
              { id: 'zeroCells', text: 'Nicio celulă, notația este invalidă' },
              { id: 'tenCells', text: '10 celule adunate consecutiv' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'fourCells'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Domeniul formează un dreptunghi: coloanele D și E (2 coloane) x rândurile 1 și 2 (2 rânduri). Cât face 2 x 2?" />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! D1:E2 cuprinde 2 coloane (D, E) și 2 rânduri (1, 2), adică 2 × 2 = 4 celule compacte: D1, E1, D2, E2."
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={3}
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
