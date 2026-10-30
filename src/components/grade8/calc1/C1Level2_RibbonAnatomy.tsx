import React, { useState } from 'react';
import {
  Layers,
  LayoutTemplate,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Maximize2,
  Minimize2,
  Sliders,
  Terminal,
  MousePointer,
  ChevronDown,
  Search,
  ZoomIn,
  Command,
  Save,
  RotateCcw,
  RotateCw
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C1Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C1Level2_RibbonAnatomy: React.FC<C1Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Active inspected element of the Excel window
  const [activeZone, setActiveZone] = useState<string>('formulaBar');

  // Ribbon display mode state (Manual pag. 13)
  const [ribbonMode, setRibbonMode] = useState<'full' | 'tabs' | 'autohide'>('full');

  // Active Ribbon Tab in simulator
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'formulas' | 'data' | 'view'>('home');

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const windowZones: Record<string, {
    title: string;
    subtitle: string;
    description: string;
    manualRef: string;
    proTip: string;
    color: string;
  }> = {
    quickAccess: {
      title: 'Bara de Instrumente pentru Acces Rapid (Quick Access)',
      subtitle: 'Comenzi frecvente la un singur clic distanță',
      description: 'Situată în colțul din stânga-sus (deasupra sau sub panglică). Conține butoane esențiale configurabile: Salvare (Ctrl+S), Anulare (Undo - Ctrl+Z), Repetare (Redo - Ctrl+Y).',
      manualRef: 'Manual Art Klett pag. 13 - Fig. 2',
      proTip: 'Poți adăuga prin săgeata dropdown comanda „Imprimare rapidă” sau „Previzualizare înaintea imprimării”.',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
    },
    titleBar: {
      title: 'Bara de Titlu (Title Bar) & Butoanele de Control',
      subtitle: 'Identificarea fișierului și controlul ferestrei',
      description: 'Afișează numele registrului curent (ex: Registru1.xlsx - Excel), bara de căutare inteligentă, starea contului și butoanele standard ale sistemului de operare: Minimizare, Maximizare/Restaurare și Închidere (X).',
      manualRef: 'Manual Art Klett pag. 13',
      proTip: 'Dacă apeși dublu-clic pe bara de titlu, fereastra comută instant între starea maximizată și fereastră redimensionabilă.',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300'
    },
    ribbonOptions: {
      title: 'Opțiuni de Afișare a Panglicii (Ribbon Display Options)',
      subtitle: 'Controlul suprafeței vizibile de lucru',
      description: 'Oferă 3 moduri esențiale: 1) Ascundere automată (ecran complet pentru tabele uriașe), 2) Afișare doar file (arată doar denumirile Pornire, Inserare...), 3) Afișare file și comenzi (modul clasic complet).',
      manualRef: 'Manual Art Klett pag. 13 - Caseta utilă',
      proTip: 'Dacă panglica a dispărut brusc, ai apăsat accidental comanda rapidă Ctrl+F1!',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300'
    },
    nameBox: {
      title: 'Caseta de Nume (Name Box)',
      subtitle: 'Busola celulei active curente',
      description: 'Afișează coordonata celulei selectate (ex: B2, G14) sau numele domeniului definit. Dacă tastezi direct o adresă aici și apeși Enter (ex: Z500), cursorul sare instant la acea celulă!',
      manualRef: 'Manual Art Klett pag. 14',
      proTip: 'Caseta de nume arată întotdeauna litera coloanei urmată de numărul rândului (niciodată invers!).',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300'
    },
    formulaBar: {
      title: 'Bara de Formule (Formula Bar)',
      subtitle: 'Creierul matematic al foii de calcul',
      description: 'Afișează conținutul real sau expresia matematică din celula activă. În timp ce în celulă vezi rezultatul calculului (ex: 42), în bara de formule vezi formula originară (ex: =A1*B1). Include butonul „fx” pentru inserarea de funcții.',
      manualRef: 'Manual Art Klett pag. 14',
      proTip: 'Dacă formula este foarte lungă, poți mări înălțimea barei de formule apăsând Ctrl+Shift+U.',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
    },
    gridHeaders: {
      title: 'Antetele de Coloană & Rând (Grid Headers)',
      subtitle: 'Sistemul cartezian de reper al grilei',
      description: 'Coloanele sunt etichetate vertical cu litere (A, B, C... Z, AA... XFD = 16.384 coloane). Rândurile sunt etichetate orizontal cu numere (de la 1 la 1.048.576 rânduri).',
      manualRef: 'Manual Art Klett pag. 14',
      proTip: 'Clic pe antetul unei coloane (ex: pe litera B) selectează instant întreaga coloană de 1 milion de celule.',
      color: 'border-teal-500/40 bg-teal-950/20 text-teal-300'
    },
    sheetTabs: {
      title: 'Bara de Etichete Foi & Butonul Foaie Nouă (+)',
      subtitle: 'Navigare între filele registrului de lucru',
      description: 'Permite comutarea între foile de calcul (Sheet1, Facturi, Situație_Note). Permite redenumirea prin dublu-clic, adăugarea cu butonul [+] și colorarea etichetelor pentru clasificare vizuală.',
      manualRef: 'Manual Art Klett pag. 16',
      proTip: 'Pentru a duplica rapid o foaie, ține apăsat tasta Ctrl și trage eticheta ei cu mouse-ul spre dreapta!',
      color: 'border-pink-500/40 bg-pink-950/20 text-pink-300'
    },
    statusBar: {
      title: 'Bara de Stare & Glisorul Zoom (Status Bar)',
      subtitle: 'Statistici rapide automate și scalare',
      description: 'Situată la baza ferestrei. Când selectezi celule cu numere, bara de stare calculează automat și discret: Suma, Media și Numărul de valori, fără să fie nevoie să scrii nicio formulă! În dreapta are glisorul de Zoom (10% - 400%).',
      manualRef: 'Manual Art Klett pag. 13-14',
      proTip: 'Statistica instantanee din bara de stare este secretul celor mai productivi analiști de date.',
      color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300'
    }
  };

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'nameBox') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'formulaBar') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'autohide') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'nameBox';
  const isQ2Correct = q2Answer === 'formulaBar';
  const isQ3Correct = q3Answer === 'autohide';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-emerald-950/40 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual Art Klett 2025 • Pag. 13–14</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <LayoutTemplate className="w-8 h-8 text-teal-400" />
              Nivelul 2: Anatomia Ferestrei MS Excel & Panglica Ribbon
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Explorează zonele cheie ale interfeței de calcul tabelar: Caseta de Nume, Bara de Formule, modurile panglicii și bara de stare cu statistici instantanee!
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Pas Curent</div>
            <div className="text-2xl font-black text-teal-400">2 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive Mockup: MS Excel Window Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Ribbon Mode Control Bar */}
        <div className="bg-slate-950 p-3 sm:px-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Command className="w-4 h-4 text-teal-400" />
            <span>Simulator Interactiv Interfață Excel</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-slate-400 px-2 font-medium">Mod Panglică:</span>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setRibbonMode('autohide'); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                ribbonMode === 'autohide' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Auto-ascundere
            </button>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setRibbonMode('tabs'); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                ribbonMode === 'tabs' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Doar File
            </button>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setRibbonMode('full'); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                ribbonMode === 'full' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. File & Comenzi (Complet)
            </button>
          </div>
        </div>

        {/* Windows Title Bar */}
        <div
          onClick={() => { sounds.playClick(); setActiveZone('titleBar'); }}
          className={`p-2.5 px-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 cursor-pointer transition ${
            activeZone === 'titleBar' ? 'ring-2 ring-blue-500 bg-blue-950/20' : 'hover:bg-slate-800/40'
          }`}
        >
          {/* Quick Access Toolbar */}
          <div
            onClick={(e) => { e.stopPropagation(); sounds.playClick(); setActiveZone('quickAccess'); }}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg border cursor-pointer transition ${
              activeZone === 'quickAccess' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">| Quick Access</span>
          </div>

          <div className="font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-2">
            <span className="text-emerald-400">📗</span>
            <span>Registru1.xlsx - Excel</span>
          </div>

          {/* Ribbon Options & Window Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); sounds.playClick(); setActiveZone('ribbonOptions'); }}
              className={`p-1 px-2 rounded text-[11px] font-mono border transition ${
                activeZone === 'ribbonOptions' ? 'border-amber-400 bg-amber-950/40 text-amber-300' : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ⤢ Panglică
            </button>
            <div className="flex items-center gap-1 text-slate-500 ml-1">
              <span className="w-3 h-3 rounded-full bg-slate-700 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-slate-700 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-rose-500/70 inline-block"></span>
            </div>
          </div>
        </div>

        {/* Ribbon Tabs Header */}
        {ribbonMode !== 'autohide' && (
          <div className="bg-slate-900 border-b border-slate-800 px-4 flex items-center gap-1 sm:gap-2 text-xs overflow-x-auto">
            <span className="px-3 py-2 bg-emerald-600 text-slate-950 font-bold rounded-t-lg">Fișier</span>
            {[
              { id: 'home', name: 'Pornire (Home)' },
              { id: 'insert', name: 'Inserare (Insert)' },
              { id: 'formulas', name: 'Formule (Formulas)' },
              { id: 'data', name: 'Date (Data)' },
              { id: 'view', name: 'Vizualizare (View)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { sounds.playClick(); setActiveTab(tab.id as any); }}
                className={`px-3 py-2 font-medium border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-white bg-slate-800/60 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}

        {/* Ribbon Commands Strip (only visible in 'full' mode) */}
        {ribbonMode === 'full' && (
          <div className="bg-slate-850 p-2 sm:p-3 border-b border-slate-800 flex items-center gap-4 text-xs overflow-x-auto">
            <div className="flex items-center gap-2 border-r border-slate-700/60 pr-3">
              <div className="text-[10px] text-slate-400 font-mono">Clipboard:</div>
              <span className="px-2 py-1 bg-slate-800 rounded font-bold text-slate-200 text-[11px]">Lipire (Paste)</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-300 text-[11px]">Copiere</span>
            </div>
            <div className="flex items-center gap-2 border-r border-slate-700/60 pr-3">
              <div className="text-[10px] text-slate-400 font-mono">Font:</div>
              <span className="px-2 py-1 bg-slate-900 rounded font-mono text-emerald-300 text-[11px]">Calibri</span>
              <span className="px-2 py-1 bg-slate-900 rounded font-mono text-emerald-300 text-[11px]">11 pt</span>
              <span className="font-bold px-1.5 py-0.5 bg-slate-800 rounded text-white">B</span>
              <span className="italic px-1.5 py-0.5 bg-slate-800 rounded text-white">I</span>
              <span className="underline px-1.5 py-0.5 bg-slate-800 rounded text-white">U</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] text-slate-400 font-mono">Număr:</div>
              <span className="px-2 py-1 bg-slate-800 rounded text-amber-300 font-mono text-[11px] font-bold">Monedă (RON)</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-teal-300 font-mono text-[11px] font-bold">% Procent</span>
            </div>
          </div>
        )}

        {/* Formula Bar & Name Box Row */}
        <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center gap-2">
          {/* Name Box (Caseta de nume) */}
          <div
            onClick={() => { sounds.playClick(); setActiveZone('nameBox'); }}
            className={`w-28 sm:w-36 px-3 py-1.5 rounded-lg border flex items-center justify-between font-mono font-bold text-xs cursor-pointer transition ${
              activeZone === 'nameBox'
                ? 'border-purple-400 bg-purple-950/40 text-purple-200 ring-2 ring-purple-500/30'
                : 'border-slate-700 bg-slate-950 text-emerald-400 hover:border-slate-500'
            }`}
          >
            <span>B2</span>
            <span className="text-[9px] text-slate-500 uppercase">Caseta Nume</span>
          </div>

          {/* Formula Function button (fx) */}
          <div className="flex items-center gap-1 text-slate-400 font-serif font-bold text-xs px-2 border-r border-slate-800">
            <span className="hover:text-emerald-400 cursor-pointer">fx</span>
          </div>

          {/* Formula Bar (Bara de formule) */}
          <div
            onClick={() => { sounds.playClick(); setActiveZone('formulaBar'); }}
            className={`flex-1 px-3 py-1.5 rounded-lg border flex items-center gap-2 font-mono text-xs cursor-pointer transition ${
              activeZone === 'formulaBar'
                ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/30'
                : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
            }`}
          >
            <span className="text-amber-400 font-bold">=</span>
            <span className="text-emerald-300 font-semibold">SUM(A2:A10) * 1.19</span>
            <span className="ml-auto text-[9px] text-slate-500 uppercase hidden sm:inline">Bara de Formule</span>
          </div>
        </div>

        {/* Grid Area with Row/Column Headers */}
        <div
          onClick={() => { sounds.playClick(); setActiveZone('gridHeaders'); }}
          className={`p-3 bg-slate-950/80 cursor-pointer transition ${
            activeZone === 'gridHeaders' ? 'ring-2 ring-teal-500 bg-teal-950/20' : 'hover:bg-slate-950'
          }`}
        >
          <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
            {/* Column Headers */}
            <div className="grid grid-cols-6 bg-slate-900 border-b border-slate-800 text-center font-bold text-slate-400">
              <div className="p-1.5 border-r border-slate-800 bg-slate-850">◢</div>
              <div className="p-1.5 border-r border-slate-800 hover:bg-slate-800 text-slate-300">A</div>
              <div className="p-1.5 border-r border-slate-800 bg-emerald-500/20 text-emerald-300 font-black">B (Activă)</div>
              <div className="p-1.5 border-r border-slate-800 hover:bg-slate-800 text-slate-300">C</div>
              <div className="p-1.5 border-r border-slate-800 hover:bg-slate-800 text-slate-300">D</div>
              <div className="p-1.5 hover:bg-slate-800 text-slate-300">E</div>
            </div>
            {/* Row 1 */}
            <div className="grid grid-cols-6 border-b border-slate-850 bg-slate-950/50">
              <div className="p-2 border-r border-slate-850 text-center bg-slate-900 font-bold text-slate-400">1</div>
              <div className="p-2 border-r border-slate-850 text-slate-300">Produs</div>
              <div className="p-2 border-r border-slate-850 text-slate-300">Preț Unitar</div>
              <div className="p-2 border-r border-slate-850 text-slate-300">Cantitate</div>
              <div className="p-2 border-r border-slate-850 text-slate-300">Total</div>
              <div className="p-2 text-slate-400">TVA</div>
            </div>
            {/* Row 2 (Active cell B2 highlighted) */}
            <div className="grid grid-cols-6 border-b border-slate-850 bg-slate-950/50">
              <div className="p-2 border-r border-slate-850 text-center bg-emerald-500/20 font-bold text-emerald-300">2</div>
              <div className="p-2 border-r border-slate-850 text-slate-200">Caiet A4 Dictando</div>
              <div className="p-2 border-r border-slate-850 bg-emerald-500/10 border-2 border-emerald-400 font-bold text-emerald-300 shadow-sm">
                8.50 lei 📍
              </div>
              <div className="p-2 border-r border-slate-850 text-right text-slate-300">12</div>
              <div className="p-2 border-r border-slate-850 text-right text-emerald-300">102.00 lei</div>
              <div className="p-2 text-slate-400">19.38 lei</div>
            </div>
            {/* Row 3 */}
            <div className="grid grid-cols-6 bg-slate-950/50">
              <div className="p-2 border-r border-slate-850 text-center bg-slate-900 font-bold text-slate-400">3</div>
              <div className="p-2 border-r border-slate-850 text-slate-300">Stilou cu Peniță</div>
              <div className="p-2 border-r border-slate-850 text-right text-slate-300">25.00 lei</div>
              <div className="p-2 border-r border-slate-850 text-right text-slate-300">4</div>
              <div className="p-2 border-r border-slate-850 text-right text-emerald-300">100.00 lei</div>
              <div className="p-2 text-slate-400">19.00 lei</div>
            </div>
          </div>
        </div>

        {/* Sheet Tabs Row */}
        <div
          onClick={() => { sounds.playClick(); setActiveZone('sheetTabs'); }}
          className={`p-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between cursor-pointer transition ${
            activeZone === 'sheetTabs' ? 'ring-2 ring-pink-500 bg-pink-950/20' : 'hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center gap-1 text-xs">
            <span className="px-3 py-1 rounded bg-slate-950 font-bold text-emerald-400 border border-slate-800">
              Foaie1 (Tabla cu 6)
            </span>
            <span className="px-3 py-1 rounded text-slate-400 hover:text-white">Foaie2</span>
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold font-mono">
              +
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Bara de Etichete Foi</span>
        </div>

        {/* Status Bar */}
        <div
          onClick={() => { sounds.playClick(); setActiveZone('statusBar'); }}
          className={`p-2 px-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono cursor-pointer transition ${
            activeZone === 'statusBar' ? 'ring-2 ring-indigo-500 bg-indigo-950/20' : 'hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-emerald-400 font-bold">GATA (Ready)</span>
            <span>|</span>
            <span>Medie: 16.75</span>
            <span>Numărătoare: 2</span>
            <span className="text-teal-300 font-bold">Sumă: 33.50</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>100%</span>
            <span className="w-16 h-1 bg-slate-800 rounded-full inline-block"></span>
          </div>
        </div>
      </div>

      {/* Inspector Details Panel for Active Zone */}
      {windowZones[activeZone] && (
        <div className={`p-6 rounded-3xl border ${windowZones[activeZone].color} space-y-3 transition-all`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider opacity-80">
                Element Selectat pentru Inspecție
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {windowZones[activeZone].title}
              </h3>
              <p className="text-xs text-slate-300">{windowZones[activeZone].subtitle}</p>
            </div>
            <div className="text-xs bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800 shrink-0 font-mono">
              {windowZones[activeZone].manualRef}
            </div>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {windowZones[activeZone].description}
          </p>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Sfat de la Profesor:</strong> {windowZones[activeZone].proTip}</span>
          </div>
        </div>
      )}

      {/* Knowledge Verification Quiz with 5s Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verificare Pedagogică a Interfeței</h2>
            <p className="text-xs text-slate-400">Fixează terminologia exactă din programa națională</p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              1. În ce element al ferestrei Excel este afișată adresa celulei active (de exemplu, „B2”)?
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'nameBox', text: 'În Caseta de Nume (Name Box)' },
              { id: 'statusBar', text: 'În Bara de Stare la Zoom 100%' },
              { id: 'trash', text: 'În Coșul de Reciclare Windows' },
              { id: 'quick', text: 'În butonul de Undo din Quick Access' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'nameBox'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Privește în stânga barei de formule: arată litera coloanei și numărul rândului celulei selectate." />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation="Corect! Caseta de Nume (Name Box) afișează permanent coordonata celulei selectate (ex: B2) și permite saltul rapid tastând o altă adresă."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              2. Care este deosebirea dintre ceea ce vezi în celula din tabel și ceea ce vezi în Bara de Formule?
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'formulaBar', text: 'În celulă vezi rezultatul calculat, iar în Bara de Formule vezi formula originară (ex: =SUM(A1:A5))' },
              { id: 'same', text: 'Nu există nicio diferență; ambele afișează exact aceeași imagine grafică' },
              { id: 'invert', text: 'În celulă vezi formula în limba engleză, iar în Bara de Formule se traduce în română' },
              { id: 'color', text: 'Bara de Formule servește exclusiv la schimbarea culorii de fundal a paginii' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'formulaBar'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Dacă într-o celulă este scris '=2+2', pe ecran apare cifra 4, dar formula reală rămâne în bara de formule." />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation="Excelent! În celulă este randat rezultatul numeric evaluat, pe când Bara de Formule dezvăluie expresia matematică sau conținutul brut care a generat valoarea respectivă."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              3. Conform casetei din manual (pag. 13), ce mod de afișare al Panglicii (Ribbon) oferă cel mai mare spațiu vizual pe ecran?
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'autohide', text: 'Ascundere automată panglică (Auto-hide Ribbon)' },
              { id: 'full', text: 'Afișare file și comenzi (Show Tabs and Commands)' },
              { id: 'zoom500', text: 'Mărire Zoom la 400%' },
              { id: 'closeApp', text: 'Închiderea completă a calculatorului' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'autohide'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <QuestionHint hint="Modul 'Auto-hide' ascunde atât comenzile cât și filele, lăsând întregul monitor disponibil doar pentru celulele grilei." />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation="Exact! Modul 'Auto-hide Ribbon' ascunde complet panglica până când utilizatorul face clic pe marginea superioară a ferestrei, maximizând aria vizibilă a tabelelor mari."
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
