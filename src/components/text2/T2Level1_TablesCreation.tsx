import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Grid, 
  CornerDownLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen,
  Keyboard,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface T2Level1_TablesCreationProps {
  onCompletePage: (earnedScore: number) => void;
}

export const T2Level1_TablesCreation: React.FC<T2Level1_TablesCreationProps> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Table Grid Simulator State
  const [selectedCols, setSelectedCols] = useState<number>(4);
  const [selectedRows, setSelectedRows] = useState<number>(3);
  const [hoverCols, setHoverCols] = useState<number | null>(null);
  const [hoverRows, setHoverRows] = useState<number | null>(null);

  // Table Data Matrix for the live simulation
  const [tableData, setTableData] = useState<string[][]>([
    ['Ora / Ziua', 'Luni', 'Miercuri', 'Vineri'],
    ['08:00 - 08:50', 'Informatică & TIC', 'Matematică', 'Limba Română'],
    ['09:00 - 09:50', 'Științe Naturale', 'Istorie', 'Educație Plastică']
  ]);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [tabKeySuccess, setTabKeySuccess] = useState<boolean>(false);
  const [newRowAddedNotification, setNewRowAddedNotification] = useState<boolean>(false);

  // Questions Quiz State
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null
  });
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0);
    if (!hasActive) return;
    const t = setInterval(() => {
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const [k, v] of Object.entries(prev)) {
          const val = v as number;
          if (val > 1) next[k] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldowns]);

  const correctAnswers: Record<string, number> = {
    q1: 1, // Celulă
    q2: 2, // Tasta Tab
    q3: 0, // Adaugă automat un rând nou la sfârșitul tabelului
    q4: 2  // Tasta Enter mărește înălțimea celulei / creează un rând nou în aceeași celulă
  };

  const handleSelectAnswer = (qKey: string, optIdx: number) => {
    if ((cooldowns[qKey] || 0) > 0) return;
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [qKey]: optIdx }));
    if (optIdx === correctAnswers[qKey]) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [qKey]: 5 }));
    }
  };

  // Grid sizing interaction
  const handleGridHover = (r: number, c: number) => {
    setHoverRows(r);
    setHoverCols(c);
  };

  const handleGridLeave = () => {
    setHoverRows(null);
    setHoverCols(null);
  };

  const handleApplyGridSize = (r: number, c: number) => {
    sounds.playSuccess();
    setSelectedRows(r);
    setSelectedCols(c);
    
    // Generate new table structure
    const newMatrix: string[][] = [];
    for (let i = 0; i < r; i++) {
      const rowArr: string[] = [];
      for (let j = 0; j < c; j++) {
        if (i === 0) {
          rowArr.push(j === 0 ? 'Zi / Oră' : `Coloana ${j + 1}`);
        } else {
          rowArr.push(`Celulă [R${i + 1}, C${j + 1}]`);
        }
      }
      newMatrix.push(rowArr);
    }
    setTableData(newMatrix);
    setFocusedCell({ row: 0, col: 0 });
  };

  // Keyboard Tab Simulator
  const handleSimulateTab = () => {
    sounds.playClick();
    const currentR = focusedCell.row;
    const currentC = focusedCell.col;
    const totalCols = tableData[0]?.length || 4;
    const totalRows = tableData.length;

    if (currentC < totalCols - 1) {
      // Move to next cell in current row
      setFocusedCell({ row: currentR, col: currentC + 1 });
    } else {
      // We are at the end of the row
      if (currentR < totalRows - 1) {
        // Move to first cell of next row
        setFocusedCell({ row: currentR + 1, col: 0 });
      } else {
        // WE ARE IN THE VERY LAST CELL OF THE TABLE!
        // In MS Word / LibreOffice, TAB in last cell appends a new row!
        const newRow: string[] = Array(totalCols).fill('').map((_, idx) => `Rând Nou Cel ${idx + 1}`);
        setTableData(prev => [...prev, newRow]);
        setFocusedCell({ row: totalRows, col: 0 });
        setTabKeySuccess(true);
        setNewRowAddedNotification(true);
        sounds.playFanfare();
        setTimeout(() => setNewRowAddedNotification(false), 3500);
      }
    }
  };

  const handleAddManualRow = () => {
    sounds.playClick();
    const totalCols = tableData[0]?.length || 4;
    const newRow = Array(totalCols).fill('').map((_, idx) => `Înregistrare ${tableData.length + 1}.${idx + 1}`);
    setTableData(prev => [...prev, newRow]);
  };

  const handleDeleteLastRow = () => {
    if (tableData.length <= 2) return;
    sounds.playClick();
    setTableData(prev => prev.slice(0, prev.length - 1));
    if (focusedCell.row >= tableData.length - 1) {
      setFocusedCell({ row: tableData.length - 2, col: 0 });
    }
  };

  // Calculate score
  let correctCount = 0;
  Object.keys(correctAnswers).forEach(k => {
    if (answers[k] === correctAnswers[k]) correctCount++;
  });
  if (tabKeySuccess) correctCount += 1;
  const totalQuestions = 5; // 4 quiz questions + 1 interactive tab test

  const earnedScore = Math.round((correctCount / totalQuestions) * 15); // Page 1 contributes 15 pts
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/60 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-blue-500/20 border border-blue-400/40 rounded-2xl text-blue-300 text-3xl shrink-0 shadow-inner">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 4B • Page 1 of 7' : 'Modulul 4B • Pagina 1 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook pp. 68-70' : 'Manual pag. 68-70'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? 'Inserting & Structuring Tables' : 'Inserarea și Structurarea Tabelelor'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Discover how data is structured into rows, columns, and cells. Learn quick insertion grids, navigating with the TAB key, and adding automatic rows without touching the mouse!'
                : 'Descoperă cum se organizează datele în linii (rânduri), coloane și celule. Învață grila de inserare rapidă, navigarea profesională cu tasta TAB și adăugarea automată de rânduri noi!'}
            </p>
          </div>
        </div>
      </div>

      {/* Theory & Concepts Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-blue-400 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5" />
          <span>{lang === 'en' ? 'Fundamental Table Concepts' : 'Noțiuni Fundamentale despre Tabele'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">↔️</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Rows (Orizontal lines)' : 'Linii (Rânduri orizontale)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Horizontal groups of cells representing a complete record or entry (e.g., all subjects on Monday).'
                : 'Grupuri orizontale de celule ce reprezintă o înregistrare sau un moment orar (ex: toate orele de luni).'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">↕️</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Columns (Vertical bands)' : 'Coloane (Benzi verticale)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Vertical series of cells holding the same type of information (e.g., student names or grades).'
                : 'Șiruri verticale de celule ce conțin același tip de informație (ex: coloana cu Nume, coloana cu Zile).'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">🧊</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Cell (Intersection)' : 'Celula (Intersecția)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'The basic container at the junction of a row and a column. It can contain text, numbers, or images.'
                : 'Căsuța de bază formată la intersecția dintre un rând și o coloană. Poate conține text, numere sau poze.'}
            </p>
          </div>
        </div>

        {/* Golden Rule of the TAB Key */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-950/60 border border-amber-500/40 flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400 text-xl shrink-0">
            ⌨️
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-amber-300">
              {lang === 'en' ? 'Golden Rule of the TAB Key in Tables' : 'Regula de Aur a Tastei TAB în Tabele'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en' ? (
                <>
                  Pressing <strong>TAB</strong> moves focus to the next cell to the right. When you are positioned in the <strong>very last cell</strong> of the table, pressing <strong>TAB</strong> automatically creates a <strong>brand new empty row</strong>!
                </>
              ) : (
                <>
                  Tasta <strong>TAB</strong> te mută la celula următoare din dreapta. Când ești poziționat în <strong>ultima celulă din tabel</strong>, apăsarea tastei <strong>TAB</strong> inserează automat un <strong>rând nou-nouț</strong> la sfârșitul tabelului!
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Hands-on Simulator */}
      <div className="bg-slate-900/90 border border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Grid className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Interactive Table Grid & Navigation Lab' : 'Laborator Interactiv: Grila de Inserare & Navigare TAB'}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/40">
            {lang === 'en' ? 'Step 1: Simulator' : 'Pasul 1: Simulator Practic'}
          </span>
        </div>

        {/* 1. Visual Grid Picker Simulation */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-300 uppercase font-mono">
              {lang === 'en' ? 'Select Table Dimensions (Rows × Cols):' : 'Alege Dimensiunile Tabelului (Rânduri × Coloane):'}
            </div>
            <div className="text-xs font-mono font-bold text-cyan-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
              {hoverRows && hoverCols ? `${hoverCols} × ${hoverRows}` : `${selectedCols} × ${selectedRows}`}
            </div>
          </div>

          <div 
            className="inline-grid grid-cols-6 gap-1 p-2 bg-slate-900/90 rounded-xl border border-slate-700"
            onMouseLeave={handleGridLeave}
          >
            {Array.from({ length: 5 }).map((_, rIdx) => {
              const r = rIdx + 1;
              return Array.from({ length: 6 }).map((_, cIdx) => {
                const c = cIdx + 1;
                const isHovered = hoverRows !== null && hoverCols !== null && r <= hoverRows && c <= hoverCols;
                const isSelected = r <= selectedRows && c <= selectedCols;
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onMouseEnter={() => handleGridHover(r, c)}
                    onClick={() => handleApplyGridSize(r, c)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded transition-all cursor-pointer border ${
                      isHovered
                        ? 'bg-amber-400 border-amber-300 scale-95 shadow-md shadow-amber-400/50'
                        : isSelected
                        ? 'bg-blue-600 border-blue-400'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                    }`}
                    title={`${c} coloane x ${r} rânduri`}
                  />
                );
              });
            })}
          </div>
          <div className="text-[11px] text-slate-400">
            {lang === 'en'
              ? 'Hover and click any square above to generate a custom grid instantly.'
              : 'Trece cu cursorul peste pătrățele și dă click pentru a genera un tabel cu dimensiunea dorită.'}
          </div>
        </div>

        {/* 2. Rendered Live Table with Cell Navigation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{lang === 'en' ? 'Live Document Table View:' : 'Previzualizare Tabel în Document:'}</span>
            <span className="text-blue-400 font-bold">
              {tableData.length} {lang === 'en' ? 'rows' : 'rânduri'} × {tableData[0]?.length || 4} {lang === 'en' ? 'cols' : 'coloane'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-slate-700 bg-slate-950 p-2 shadow-inner">
            <table className="w-full border-collapse text-xs sm:text-sm font-sans">
              <tbody>
                {tableData.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx === 0 ? 'bg-blue-950/80 text-blue-200 font-bold border-b-2 border-blue-500/50' : 'border-b border-slate-800 hover:bg-slate-900/60'}>
                    {row.map((cellText, cIdx) => {
                      const isFocused = focusedCell.row === rIdx && focusedCell.col === cIdx;
                      const isLastCell = rIdx === tableData.length - 1 && cIdx === row.length - 1;
                      return (
                        <td
                          key={cIdx}
                          onClick={() => {
                            sounds.playClick();
                            setFocusedCell({ row: rIdx, col: cIdx });
                          }}
                          className={`p-2.5 sm:p-3 border border-slate-700 transition cursor-pointer select-none relative ${
                            isFocused
                              ? 'bg-amber-500/30 text-amber-200 ring-2 ring-amber-400 font-semibold'
                              : 'text-slate-300'
                          } ${isLastCell ? 'border-r-4 border-r-amber-500/80' : ''}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span>{cellText}</span>
                            {isFocused && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                            )}
                          </div>
                          {isLastCell && (
                            <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-amber-400 font-bold">
                              ULTIMA
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* New row notification */}
          {newRowAddedNotification && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'en'
                  ? '🎯 Success! Pressing TAB in the last cell automatically appended a new row!'
                  : '🎯 Bravo! Apăsarea tastei TAB în ultima celulă a adăugat automat un nou rând în tabel!'}
              </span>
            </div>
          )}

          {/* Interactive Keyboard Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSimulateTab}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95"
            >
              <Keyboard className="w-4 h-4" />
              <span>{lang === 'en' ? 'Simulate Pressing [ TAB ]' : 'Apasă Tasta [ TAB ]'}</span>
            </button>

            <button
              type="button"
              onClick={handleAddManualRow}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'en' ? 'Add Row (+)' : 'Adaugă Rând (+)'}</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteLastRow}
              disabled={tableData.length <= 2}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Delete Row (-)' : 'Șterge Rând (-)'}</span>
            </button>

            <div className="text-[11px] text-slate-400 font-mono ml-auto">
              {tabKeySuccess ? (
                <span className="text-emerald-400 font-bold">
                  ✓ {lang === 'en' ? 'TAB Secret Mastered (+1 pt)' : 'Secretul TAB Devalidat (+1 pct)'}
                </span>
              ) : (
                <span className="text-amber-400">
                  ⚡ {lang === 'en' ? 'Reach the last cell and press TAB!' : 'Navighează până în ultima celulă și apasă TAB!'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Theoretical Verification Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Tables Mastery' : 'Verifică-ți Cunoștințele: Stăpânirea Tabelelor'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-blue-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 4' : 'Întrebarea 1 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What is the name of the rectangular unit formed at the intersection of a row and a column?'
              : 'Cum se numește căsuța dreptunghiulară formată la intersecția dintre o linie (rând) și o coloană?'}
          </div>

          {(cooldowns['q1'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q1']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza structura unui tabel din manual pag. 68."
                customMessageEn="Incorrect! Please take 5 seconds to review table elements on page 68."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Paragraf' : 'A) Paragraf',
              lang === 'en' ? 'B) Cell (Celulă)' : 'B) Celulă',
              lang === 'en' ? 'C) Text box (Casetă)' : 'C) Casetă de text',
              lang === 'en' ? 'D) Border (Chenar)' : 'D) Chenar'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q1'] || 0) > 0}
                onClick={() => handleSelectAnswer('q1', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  answers.q1 === idx
                    ? idx === correctAnswers.q1
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q1"
            hintRo="Este căsuța de bază a oricărui tabel în care poți introduce text, numere sau imagini."
            hintEn="It is the fundamental box in any table where text, numbers, or pictures are stored."
          />

          {answers.q1 !== null && (
            <AnswerExplanation
              isCorrect={answers.q1 === correctAnswers.q1}
              cooldown={cooldowns['q1'] || 0}
              explanation={
                answers.q1 === correctAnswers.q1
                  ? (lang === 'en' ? 'Exact! A cell is the intersection of a row and column.' : 'Corect! Celula este elementul de bază format la intersecția unui rând cu o coloană.')
                  : (lang === 'en' ? 'Incorrect. The rectangular intersection is called a Cell.' : 'Incorect. Zona de intersecție se numește Celulă (Cell).')
              }
              ruleReference="Manual TIC pag. 68"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-blue-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 4' : 'Întrebarea 2 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which keyboard key is used to jump directly to the next cell to the right inside a table?'
              : 'Care tastă este folosită pentru a trece rapid la celula următoare din dreapta în interiorul unui tabel?'}
          </div>

          {(cooldowns['q2'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q2']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza deplasarea între celule din manual pag. 69."
                customMessageEn="Incorrect! Please take 5 seconds to review cell navigation on page 69."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Spacebar (Bara de spațiu)' : 'A) Bara de spațiu',
              lang === 'en' ? 'B) Enter' : 'B) Tasta Enter',
              lang === 'en' ? 'C) TAB key' : 'C) Tasta TAB (⇥)',
              lang === 'en' ? 'D) Caps Lock' : 'D) Tasta Caps Lock'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q2'] || 0) > 0}
                onClick={() => handleSelectAnswer('q2', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  answers.q2 === idx
                    ? idx === correctAnswers.q2
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q2"
            hintRo="Tasta are două săgeți opuse sau inscripția TAB și se află în stânga tastei Q."
            hintEn="The key features two opposing arrows or the label TAB, located to the left of the Q key."
          />

          {answers.q2 !== null && (
            <AnswerExplanation
              isCorrect={answers.q2 === correctAnswers.q2}
              cooldown={cooldowns['q2'] || 0}
              explanation={
                answers.q2 === correctAnswers.q2
                  ? (lang === 'en' ? 'Great! TAB jumps to the next cell to the right.' : 'Excelent! Tasta TAB avansează cursorul la celula din dreapta.')
                  : (lang === 'en' ? 'Not quite. Tasta TAB is the standard shortcut to jump between cells.' : 'Nu. Tasta TAB este comanda rapidă standard pentru deplasarea între celule.')
              }
              ruleReference="Manual TIC pag. 69"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-blue-400 uppercase font-mono">
            {lang === 'en' ? 'Question 3 of 4' : 'Întrebarea 3 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What happens if you are in the very last cell (bottom-right) of a table and press TAB?'
              : 'Ce se întâmplă dacă te afli în ultima celulă (colțul dreapta-jos) a tabelului și apeși tasta TAB?'}
          </div>

          {(cooldowns['q3'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q3']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza efectul tastei TAB în ultima celulă (manual pag. 70)."
                customMessageEn="Incorrect! Please take 5 seconds to review the TAB key effect in the last cell (page 70)."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) It automatically inserts a brand new row at the bottom' : 'A) Se inserează automat un rând nou la sfârșitul tabelului',
              lang === 'en' ? 'B) The table gets deleted' : 'B) Tabelul se șterge complet',
              lang === 'en' ? 'C) The computer crashes' : 'C) Cursorul sare în afara documentului',
              lang === 'en' ? 'D) The cell text gets erased' : 'D) Se șterge textul din celulă'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q3'] || 0) > 0}
                onClick={() => handleSelectAnswer('q3', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  answers.q3 === idx
                    ? idx === correctAnswers.q3
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q3"
            hintRo="Gândește-te la ce ai observat mai sus în simulatorul interactiv!"
            hintEn="Think about what you just tested in the interactive simulator above!"
          />

          {answers.q3 !== null && (
            <AnswerExplanation
              isCorrect={answers.q3 === correctAnswers.q3}
              cooldown={cooldowns['q3'] || 0}
              explanation={
                answers.q3 === correctAnswers.q3
                  ? (lang === 'en' ? 'Correct! TAB in the final cell automatically appends a new row.' : 'Exact! În ultima celulă, TAB creează automat un rând nou cu aceleași caracteristici.')
                  : (lang === 'en' ? 'Incorrect. Word processors append a new row automatically.' : 'Incorect. În editoarele de text, TAB în ultima celulă adaugă un nou rând.')
              }
              ruleReference="Manual TIC pag. 70"
            />
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-blue-400 uppercase font-mono">
            {lang === 'en' ? 'Question 4 of 4' : 'Întrebarea 4 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What happens when you press the Enter key inside a table cell?'
              : 'Ce efect are apăsarea tastei Enter în timp ce scrii în interiorul unei celule?'}
          </div>

          {(cooldowns['q4'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q4']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza efectul tastei Enter în celule (manual pag. 70)."
                customMessageEn="Incorrect! Please take 5 seconds to review the Enter key inside cells (page 70)."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Moves the cursor to the cell below' : 'A) Mută automat cursorul în celula de dedesubt',
              lang === 'en' ? 'B) Closes the document' : 'B) Închide documentul',
              lang === 'en' ? 'C) Increases cell height (creates a new paragraph inside the cell)' : 'C) Mărește înălțimea celulei (creează un nou paragraf în aceeași celulă)',
              lang === 'en' ? 'D) Divides the table in two' : 'D) Împarte tabelul în două'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q4'] || 0) > 0}
                onClick={() => handleSelectAnswer('q4', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  answers.q4 === idx
                    ? idx === correctAnswers.q4
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q4"
            hintRo="Tasta Enter este pentru paragraf nou, ceea ce face ca rândul să devină mai înalt."
            hintEn="The Enter key creates a new paragraph, causing the cell height to expand vertically."
          />

          {answers.q4 !== null && (
            <AnswerExplanation
              isCorrect={answers.q4 === correctAnswers.q4}
              cooldown={cooldowns['q4'] || 0}
              explanation={
                answers.q4 === correctAnswers.q4
                  ? (lang === 'en' ? 'Perfect! Enter creates a new line/paragraph inside the cell, expanding its height.' : 'Perfect! Enter creează un rând nou în interiorul aceleiași celule, mărindu-i înălțimea.')
                  : (lang === 'en' ? 'Incorrect. Unlike spreadsheets, Enter inside a word processor table creates a new paragraph.' : 'Incorect. În procesoarele de text, Enter nu sare în celula de jos, ci face un nou rând în celulă.')
              }
              ruleReference="Manual TIC pag. 70"
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => {
          sounds.playFanfare();
          onCompletePage(earnedScore);
        }}
        onRetry={() => {
          sounds.playClick();
          setAnswers({ q1: null, q2: null, q3: null, q4: null });
        }}
      />
    </div>
  );
};
