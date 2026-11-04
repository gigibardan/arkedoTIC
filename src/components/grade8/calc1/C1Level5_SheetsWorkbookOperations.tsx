import React, { useState } from 'react';
import {
  FolderArchive,
  FileSpreadsheet,
  Plus,
  Edit2,
  Trash2,
  Palette,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Keyboard,
  ArrowRight,
  MoveHorizontal,
  Command,
  Save,
  Printer
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C1Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

interface SheetTab {
  id: string;
  name: string;
  color: string;
}

export const C1Level5_SheetsWorkbookOperations: React.FC<C1Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive sheet tabs state
  const [sheets, setSheets] = useState<SheetTab[]>([
    { id: 's1', name: 'Foaie1', color: 'border-emerald-500' },
    { id: 's2', name: 'Situație_Note', color: 'border-blue-500' },
    { id: 's3', name: 'Grafice_Statistice', color: 'border-purple-500' },
  ]);
  const [activeSheetId, setActiveSheetId] = useState<string>('s1');

  // Renaming state
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [renameValue, setRenameValue] = useState<string>('');

  // Shortcuts trainer state
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleAddSheet = () => {
    sounds.playClick();
    const newIdx = sheets.length + 1;
    const newId = `s_${Date.now()}`;
    setSheets(prev => [...prev, { id: newId, name: `Foaie${newIdx}`, color: 'border-teal-500' }]);
    setActiveSheetId(newId);
  };

  const handleStartRename = (id: string, currentName: string) => {
    sounds.playClick();
    setIsRenaming(true);
    setRenameValue(currentName);
  };

  const handleSaveRename = () => {
    sounds.playClick();
    if (renameValue.trim()) {
      setSheets(prev => prev.map(s => s.id === activeSheetId ? { ...s, name: renameValue.trim() } : s));
    }
    setIsRenaming(false);
  };

  const handleChangeTabColor = (colorClass: string) => {
    sounds.playClick();
    setSheets(prev => prev.map(s => s.id === activeSheetId ? { ...s, color: colorClass } : s));
  };

  const handleMoveLeft = (idx: number) => {
    if (idx === 0) return;
    sounds.playClick();
    const copy = [...sheets];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setSheets(copy);
  };

  const handleMoveRight = (idx: number) => {
    if (idx === sheets.length - 1) return;
    sounds.playClick();
    const copy = [...sheets];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setSheets(copy);
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'doubleClick') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'ctrlS') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'xlsx') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'doubleClick';
  const isQ2Correct = q2Answer === 'ctrlS';
  const isQ3Correct = q3Answer === 'xlsx';

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
              <span>{lang === 'en' ? 'Art Klett Textbook 2025 • pp. 16–17' : 'Manual Art Klett 2025 • Pag. 16–17'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <FolderArchive className="w-8 h-8 text-emerald-400" />
              {lang === 'en' ? 'Level 5: Worksheet Management & Workbook Operations' : 'Nivelul 5: Gestionarea Foilor de Lucru & Operații pe Registru'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'A workbook contains multiple worksheets. Learn to add, rename, reorder via drag-and-drop, color-code tabs, and master the official shortcuts: Ctrl+S, Ctrl+N, and Ctrl+P!'
                : 'Un registru de calcul conține mai multe foi (sheets). Învață să adaugi, să redenumești (ex: „Tabla cu 6”), să reordonezi prin glisare și să stăpânești scurtăturile oficiale Ctrl+S, Ctrl+N, Ctrl+P!'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Current Step' : 'Pas Curent'}</div>
            <div className="text-2xl font-black text-emerald-400">5 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Sheet Tab Management Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en' ? 'Lab: Worksheet Tab Operations' : 'Laborator: Operații pe Etichetele Foilor de Lucru'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Add worksheets, rename them, set tab colors, and reorder tabs (Textbook p. 16)'
                  : 'Adaugă foi noi, redenumește-le, schimbă culoarea etichetei și mută-le ordinea (Manual pag. 16)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSheet}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'en' ? 'New Sheet (+)' : 'Foaie Nouă (+)'}</span>
          </button>
        </div>

        {/* Live Sheet Tabs Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
            <span>{lang === 'en' ? 'Workbook Tab Bar:' : 'Bara de etichete a registrului:'}</span>
            <span className="text-emerald-400 font-bold">{sheets.length} {lang === 'en' ? 'sheets in workbook' : 'foi în registru'}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {sheets.map((sheet, idx) => {
              const isActive = sheet.id === activeSheetId;
              return (
                <div
                  key={sheet.id}
                  onClick={() => { sounds.playClick(); setActiveSheetId(sheet.id); }}
                  className={`group px-4 py-2.5 rounded-t-xl border-t-4 ${sheet.color} border-x border-b-0 cursor-pointer flex items-center gap-2.5 transition shrink-0 ${
                    isActive
                      ? 'bg-slate-850 text-white font-bold shadow-lg'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-mono">{sheet.name}</span>
                  {isActive && (
                    <div className="flex items-center gap-1 ml-1 opacity-90">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleStartRename(sheet.id, sheet.name); }}
                        className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-emerald-300"
                        title={lang === 'en' ? 'Rename (Double-click)' : 'Redenumește (Dublu-clic)'}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMoveLeft(idx); }}
                        disabled={idx === 0}
                        className="p-0.5 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-20"
                        title={lang === 'en' ? 'Move Left' : 'Mută la stânga'}
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMoveRight(idx); }}
                        disabled={idx === sheets.length - 1}
                        className="p-0.5 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-20"
                        title={lang === 'en' ? 'Move Right' : 'Mută la dreapta'}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Rename Panel if active */}
          {isRenaming && (
            <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/40 flex flex-wrap items-center gap-3 animate-fadeIn">
              <span className="text-xs text-emerald-300 font-bold">
                {lang === 'en' ? 'Rename Active Sheet:' : 'Redenumește Foaia Activă:'}
              </span>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. Times Table 6' : 'Ex: Tabla cu 6'}
                className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveRename}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
              >
                {lang === 'en' ? 'Save Name' : 'Salvează Numele'}
              </button>
              <button
                type="button"
                onClick={() => setRenameValue(lang === 'en' ? 'Times Table 6' : 'Tabla cu 6')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
              >
                {lang === 'en' ? 'Use "Times Table 6" (Textbook Example)' : 'Folosește „Tabla cu 6” (Exemplu Manual)'}
              </button>
            </div>
          )}

          {/* Colorize Tab Selector */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'en' ? 'Active tab color:' : 'Culoare etichetă filă activă:'}
            </span>
            {[
              { label: lang === 'en' ? 'Emerald Green' : 'Verde Smarald', class: 'border-emerald-500', bg: 'bg-emerald-500' },
              { label: lang === 'en' ? 'Cyan Blue' : 'Albastru Cyan', class: 'border-cyan-500', bg: 'bg-cyan-500' },
              { label: lang === 'en' ? 'Purple' : 'Violet', class: 'border-purple-500', bg: 'bg-purple-500' },
              { label: lang === 'en' ? 'Amber' : 'Chihlimbar', class: 'border-amber-500', bg: 'bg-amber-500' },
              { label: lang === 'en' ? 'Rose' : 'Trandafiriu', class: 'border-rose-500', bg: 'bg-rose-500' },
            ].map(col => (
              <button
                key={col.label}
                type="button"
                onClick={() => handleChangeTabColor(col.class)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 cursor-pointer"
              >
                <span className={`w-3 h-3 rounded-full ${col.bg}`}></span>
                <span>{col.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Keyboard Shortcuts Matrix (Manual pag. 16-17) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Essential Keyboard Shortcuts' : 'Comenzi Rapide Esențiale pe Tastatură'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Standard shortcuts every computer science student should know by heart'
                : 'Scurtăturile oficiale pe care fiecare elev de clasa a VIII-a trebuie să le cunoască pe de rost'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              key: 'Ctrl + S',
              name: lang === 'en' ? 'Save' : 'Salvare (Save)',
              desc: lang === 'en' ? 'Saves changes to disk or syncs with Cloud/OneDrive' : 'Salvează modificările pe disc sau sincronizează cu OneDrive/Cloud',
              icon: Save
            },
            {
              key: 'Ctrl + N',
              name: lang === 'en' ? 'New Workbook' : 'Registru Nou (New)',
              desc: lang === 'en' ? 'Instantly creates a fresh, empty spreadsheet workbook' : 'Deschide imediat un registru de calcul tabelar complet gol',
              icon: Plus
            },
            {
              key: 'Ctrl + O',
              name: lang === 'en' ? 'Open' : 'Deschidere (Open)',
              desc: lang === 'en' ? 'Brings up file navigation dialog to open an existing .xlsx file' : 'Afișează fereastra de navigare pentru deschiderea unui fișier .xlsx',
              icon: FolderArchive
            },
            {
              key: 'Ctrl + P',
              name: lang === 'en' ? 'Print' : 'Imprimare (Print)',
              desc: lang === 'en' ? 'Prepares preview and sends worksheet data to the printer' : 'Previzualizează foaia și trimite tabelul spre imprimantă',
              icon: Printer
            },
            {
              key: 'Ctrl + Z',
              name: lang === 'en' ? 'Undo' : 'Anulare (Undo)',
              desc: lang === 'en' ? 'Reverts last inadvertent mistake or accidental deletion' : 'Anulează ultima modificare greșită sau ștergere accidentală',
              icon: Command
            },
            {
              key: 'Shift + F11',
              name: lang === 'en' ? 'New Sheet' : 'Foaie Nouă',
              desc: lang === 'en' ? 'Fast keyboard shortcut to insert a new worksheet instantly' : 'Comandă rapidă pentru inserarea instantanee a unei foi noi',
              icon: Sparkles
            },
          ].map((item) => {
            const isPressed = activeShortcut === item.key;
            return (
              <div
                key={item.key}
                onClick={() => { sounds.playClick(); setActiveShortcut(item.key); }}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  isPressed
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/30'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 shadow">
                    {item.key}
                  </span>
                  <item.icon className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-bold text-sm text-white">{item.name}</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
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
              {lang === 'en' ? 'Pedagogical Check: Workbook Operations' : 'Verificare Pedagogică: Operații pe Registru'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Answer all 3 textbook questions correctly to unlock the lab' : 'Răspunde corect la cele 3 întrebări din manual pentru a debloca laboratorul practic'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. What is the quickest way to rename a worksheet (e.g., from "Sheet1" to "Times Table 6")?'
                : '1. Cum se poate redenumi cel mai rapid o foaie de calcul (de exemplu din „Foaie1” în „Tabla cu 6”)?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'doubleClick', text: lang === 'en' ? 'Double-click the sheet tab, or right-click and choose Rename' : 'Dublu-clic pe eticheta foii sau clic-dreapta și alegerea comenzii Redenumire (Rename)' },
              { id: 'restartPC', text: lang === 'en' ? 'Restarting the computer in safe mode' : 'Repornirea calculatorului în modul de depanare' },
              { id: 'deleteMonitor', text: lang === 'en' ? 'Sticking a paper label on the physical screen' : 'Lipirea unei etichete de hârtie cu scotch pe ecranul monitorului' },
              { id: 'capsLock', text: lang === 'en' ? 'Pressing Caps Lock 10 consecutive times' : 'Apăsarea tastei Caps Lock de 10 ori consecutiv' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'doubleClick'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint={lang === 'en' ? 'Recall the simulator above: clicking the pencil icon or double-clicking the title allows inline editing.' : 'Amintește-ți de simulatorul de mai sus: făceai clic pe butonul creion sau dublu-clic pe denumire.'} />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={lang === 'en'
                ? 'Correct! Double-clicking the tab in the bottom bar switches the name to an editable text field, allowing direct typing.'
                : 'Corect! Dublu-clic pe eticheta din bara inferioară transformă numele în câmp editabil, permițând tastarea noii denumiri.'}
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. Which keyboard shortcut is universally recommended for periodically saving your workbook?'
                : '2. Ce combinație rapidă de taste este recomandată pentru salvarea periodică a registrului de lucru?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'ctrlS', text: lang === 'en' ? 'Ctrl + S (Save)' : 'Ctrl + S (Salvare / Save)' },
              { id: 'altF4', text: lang === 'en' ? 'Alt + F4 (Force Close Application)' : 'Alt + F4 (Închidere bruscă a programului)' },
              { id: 'esc', text: lang === 'en' ? 'Escape key repeated' : 'Tasta Escape repetată' },
              { id: 'ctrlAltDel', text: 'Ctrl + Alt + Delete' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'ctrlS'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint={lang === 'en' ? 'The letter S represents the verb "to Save".' : 'Litera S vine de la verbul \'to Save\' (a salva).'} />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={lang === 'en'
                ? 'Excellent! Ctrl+S is the fundamental digital habit for any computer user to prevent work loss.'
                : 'Excelent! Comanda rapidă Ctrl+S este reflexul digital fundamental al oricărui utilizator de calculator pentru a evita pierderea muncii efectuate.'}
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. What is the standard file extension associated with modern Microsoft Excel workbooks?'
                : '3. Care este extensia standard de fișier asociată registrelor moderne de calcul Microsoft Excel?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'xlsx', text: lang === 'en' ? '.xlsx (or legacy .xls)' : '.xlsx (sau .xls în versiunile vechi)' },
              { id: 'mp3', text: lang === 'en' ? '.mp3 (audio music file)' : '.mp3 (fișier audio de muzică)' },
              { id: 'docx', text: lang === 'en' ? '.docx (Word document)' : '.docx (document de procesare text Word)' },
              { id: 'pptx', text: lang === 'en' ? '.pptx (PowerPoint presentation)' : '.pptx (prezentare PowerPoint)' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'xlsx'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint={lang === 'en' ? 'The name originates from XML Spreadsheet, with the letters XL ending in X.' : 'Numele vine de la XML Spreadsheet, având literele XL și un X la final.'} />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={lang === 'en'
                ? 'Exact! The .xlsx extension is the modern open XML-based format used by Excel since 2007 and supported across all modern productivity software.'
                : 'Exact! Extensia .xlsx este formatul deschis bazat pe XML utilizat de Excel începând cu versiunea 2007 și recunoscut de toate suitele de birotică moderne.'}
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={5}
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
