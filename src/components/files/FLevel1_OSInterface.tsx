import React, { useState } from 'react';
import {
  Monitor,
  Power,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Volume2,
  Wifi,
  Keyboard,
  Maximize2,
  Minimize2,
  X,
  Copy,
  Folder,
  Trash2,
  FileText,
  MousePointer,
  HelpCircle,
  Terminal,
  Laptop
} from 'lucide-react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';

interface FLevel1Props {
  onComplete: () => void;
}

export const FLevel1_OSInterface: React.FC<FLevel1Props> = ({ onComplete }) => {
  // Step completion trackers
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [powerSubmenuOpen, setPowerSubmenuOpen] = useState(false);
  
  // Power Scenarios Quiz
  const [powerScenario1, setPowerScenario1] = useState<'sleep' | 'shutdown' | 'restart' | null>(null);
  const [powerScenario2, setPowerScenario2] = useState<'sleep' | 'shutdown' | 'restart' | null>(null);
  const [taskbarInspected, setTaskbarInspected] = useState(false);
  const [recycleBinFound, setRecycleBinFound] = useState(false);

  // Text vs GUI Sorting & App vs OS Classification
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [osClassifiedCorrect, setOsClassifiedCorrect] = useState(false);

  // Window Controls Interactive State
  const [windowState, setWindowState] = useState<'normal' | 'maximized' | 'minimized'>('normal');
  const [testedMinimize, setTestedMinimize] = useState(false);
  const [testedMaximize, setTestedMaximize] = useState(false);
  const [testedClose, setTestedClose] = useState(false);
  const [altF4Answer, setAltF4Answer] = useState<string | null>(null);
  const [triviaSolitaireAnswer, setTriviaSolitaireAnswer] = useState<boolean | null>(null);

  // Checks
  const isStep1Done = powerScenario1 === 'sleep' && powerScenario2 === 'shutdown' && recycleBinFound && taskbarInspected;
  
  // Ex 4 pag. 24: Identify OS from [Paint, Media Player, Notepad, Windows, WordPad, MS-DOS]
  // Correct OS items: "Windows" and "MS-DOS"
  const handleToggleItem = (item: string) => {
    sounds.playClick();
    let updated: string[];
    if (selectedOS.includes(item)) {
      updated = selectedOS.filter(x => x !== item);
    } else {
      updated = [...selectedOS, item];
    }
    setSelectedOS(updated);

    const isCorrect =
      updated.includes('Windows') &&
      updated.includes('MS-DOS') &&
      !updated.includes('Paint') &&
      !updated.includes('Media Player') &&
      !updated.includes('Notepad') &&
      !updated.includes('WordPad');

    if (isCorrect) {
      sounds.playCorrect();
      setOsClassifiedCorrect(true);
    } else {
      setOsClassifiedCorrect(false);
    }
  };

  const isStep2Done = osClassifiedCorrect;
  const isStep3Done = testedMinimize && testedMaximize && altF4Answer === 'alt_f4' && triviaSolitaireAnswer === true;

  const allCompleted = isStep1Done && isStep2Done && isStep3Done;

  const handleFinish = () => {
    sounds.playLevelUp();
    onComplete();
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Title & Mission Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-5">
        <div>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
            Nivelul 1 din 7 • Sistemul de Operare & Desktop
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-heading">
            Sistemul de Operare & Interfața Windows 10 🖥️
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            Conform manualului (pag. 22–24), sistemul de operare este ansamblul de programe fără de care calculatorul nu poate funcționa. Explorează Desktop-ul, Meniul de Start (Power), diferența dintre Mod Text și Interfață Grafică, precum și butoanele unei ferestre!
          </p>
        </div>
        <div className="hidden sm:flex text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-700 text-teal-400">
          💻
        </div>
      </div>

      {/* Teacher Tip from Textbook (p. 22-24) */}
      <TeacherTip
        title="Ce face Sistemul de Operare și cum îl controlăm?"
        tip="Cele 4 funcții esențiale ale SO (pag. 22): 1. Controlează componentele hardware; 2. Oferă interfața grafică; 3. Administrează datele; 4. Gestionează aplicațiile. Pe desktop găsim bara de activități (taskbar), pictogramele și Meniul de Start cu opțiunile de alimentare (Shut down, Restart, Sleep)."
        bookPage="22–24"
        extraAdvice="Scurtătura de la tastatură pentru a închide instant o fereastră activă este combinația Alt + F4!"
      />

      {/* 3 Step Interactive Sections */}
      <div className="flex flex-col gap-8 mb-6">
        
        {/* ======================================================== */}
        {/* ETAPA 1: Simulator Desktop Windows 10 & Meniu Start/Power */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center border border-emerald-500/40">
                1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                Simulatorul Desktop Windows 10 & Butoanele de Alimentare (pag. 22–23)
              </h3>
            </div>
            {isStep1Done ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Etapă Finalizată!
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-mono">În lucru</span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-4">
            Interacționează direct cu desktop-ul virtual de mai jos: deschide <strong>Meniul de Start</strong>, explorează <strong>Bara de activități</strong> și găsește <strong>Recycle Bin</strong>!
          </p>

          {/* Virtual Desktop Canvas */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-slate-700 bg-gradient-to-br from-blue-900 via-sky-900 to-indigo-950 flex flex-col justify-between shadow-2xl select-none">
            
            {/* Desktop Icons Area */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-min z-10">
              {/* This PC */}
              <div className="flex flex-col items-center gap-1 w-20 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition">
                <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xl shadow">
                  🖥️
                </div>
                <span className="text-[11px] text-white text-center font-medium drop-shadow leading-tight">
                  Acest PC
                </span>
              </div>

              {/* Recycle Bin (Coșul de reciclare) */}
              <div
                onClick={() => {
                  sounds.playCorrect();
                  setRecycleBinFound(true);
                }}
                className={`flex flex-col items-center gap-1 w-20 p-2 rounded-xl cursor-pointer transition border ${
                  recycleBinFound
                    ? 'bg-emerald-500/30 border-emerald-400 ring-2 ring-emerald-400/50'
                    : 'hover:bg-white/10 border-transparent'
                }`}
                title="Coșul de reciclare (Recycle Bin) - pag. 22"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-xl shadow">
                  🗑️
                </div>
                <span className="text-[11px] text-white text-center font-medium drop-shadow leading-tight">
                  Recycle Bin
                </span>
                {recycleBinFound && (
                  <span className="text-[9px] bg-emerald-500 text-white font-bold px-1 rounded">Găsit ✓</span>
                )}
              </div>

              {/* Foldere Teme */}
              <div className="flex flex-col items-center gap-1 w-20 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition">
                <div className="w-10 h-10 rounded-lg bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-xl shadow">
                  📁
                </div>
                <span className="text-[11px] text-white text-center font-medium drop-shadow leading-tight">
                  Teme TIC
                </span>
              </div>

              {/* Browser */}
              <div className="flex flex-col items-center gap-1 w-20 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition">
                <div className="w-10 h-10 rounded-lg bg-sky-500/30 border border-sky-400/40 flex items-center justify-center text-xl shadow">
                  🌐
                </div>
                <span className="text-[11px] text-white text-center font-medium drop-shadow leading-tight">
                  Browser Web
                </span>
              </div>
            </div>

            {/* Start Menu Popup */}
            {startMenuOpen && (
              <div className="absolute bottom-12 left-2 w-64 sm:w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-3 text-xs z-30 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="font-bold text-slate-200">Meniul de Start (Windows 10)</span>
                  <button
                    onClick={() => {
                      setStartMenuOpen(false);
                      setPowerSubmenuOpen(false);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="p-1.5 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-2">
                    <span>🎨</span> <span>Paint (Windows Accessories)</span>
                  </div>
                  <div className="p-1.5 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-2">
                    <span>📝</span> <span>Notepad (Editor Text)</span>
                  </div>
                  <div className="p-1.5 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-2">
                    <span>⚙️</span> <span>Setări (Settings)</span>
                  </div>
                </div>

                {/* Power button trigger */}
                <div className="border-t border-slate-800 pt-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setPowerSubmenuOpen(!powerSubmenuOpen);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold transition"
                  >
                    <div className="flex items-center gap-2">
                      <Power className="w-4 h-4" />
                      <span>Alimentare (Power)</span>
                    </div>
                    <span>{powerSubmenuOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Power Submenu with definitions from textbook */}
                  {powerSubmenuOpen && (
                    <div className="mt-2 space-y-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-semibold mb-1">
                        Opțiuni din manual (pag. 23 Fig. 2):
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">• Sleep (Repaus):</span> Consum redus
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <span className="text-rose-400 font-bold">• Shut down:</span> Oprire definitivă
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <span className="text-cyan-400 font-bold">• Restart:</span> Repornire SO
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Taskbar (Bara de activități) */}
            <div className="h-11 bg-slate-950/95 backdrop-blur border-t border-slate-700 px-3 flex items-center justify-between text-xs z-20">
              <div className="flex items-center gap-2">
                {/* Start Button */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    setStartMenuOpen(!startMenuOpen);
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition cursor-pointer ${
                    startMenuOpen
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                  }`}
                >
                  <span className="text-sm">🪟</span>
                  <span className="font-heading">Start</span>
                </button>

                {/* Pinned taskbar icons */}
                <div className="flex items-center gap-1 ml-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sm cursor-pointer" title="File Explorer">
                    📁
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sm cursor-pointer" title="Notepad">
                    📝
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sm cursor-pointer" title="Paint">
                    🎨
                  </div>
                </div>
              </div>

              {/* System Tray (Right side: time, sound, network, lang) */}
              <div
                onClick={() => {
                  sounds.playCorrect();
                  setTaskbarInspected(true);
                }}
                className={`flex items-center gap-2.5 px-3 py-1 rounded-lg cursor-pointer transition border ${
                  taskbarInspected
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'hover:bg-slate-800/80 border-transparent text-slate-300'
                }`}
                title="Bara de instrumente utile din dreapta (pag. 23)"
              >
                <div className="flex items-center gap-1" title="Tastatură Română cu diacritice">
                  <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold font-mono text-[11px]">RO</span>
                </div>
                <Wifi className="w-3.5 h-3.5 text-slate-400" />
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <div className="text-[11px] font-mono text-right leading-tight hidden xs:block">
                  <div>10:30</div>
                  <div className="text-[9px] text-slate-400">16.09.2026</div>
                </div>
                {taskbarInspected && <span className="text-[9px] bg-emerald-500 text-white font-bold px-1 rounded">✓</span>}
              </div>
            </div>
          </div>

          {/* Scenarios Check from Textbook (pag. 23 Fig. 2) */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Scenario 1 */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-300 font-semibold mb-2">
                ❓ <strong>Situația 1:</strong> Pleci de la calculator pentru 10 minute în pauză. Ce opțiune din butonul Power alegi pentru consum redus (pag. 23)?
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['sleep', 'shutdown', 'restart'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (opt === 'sleep') sounds.playCorrect();
                      else sounds.playWrong();
                      setPowerScenario1(opt);
                    }}
                    className={`py-2 px-2 rounded-lg font-bold border transition cursor-pointer ${
                      powerScenario1 === opt
                        ? opt === 'sleep'
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'bg-rose-600 border-rose-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {opt === 'sleep' && '🌙 Sleep (Repaus)'}
                    {opt === 'shutdown' && '🛑 Shut down'}
                    {opt === 'restart' && '🔄 Restart'}
                  </button>
                ))}
              </div>
              {powerScenario1 === 'sleep' && (
                <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                  ✓ Corect! Sleep pune PC-ul în mod de consum redus de energie când plecăm pentru puțin timp.
                </p>
              )}
            </div>

            {/* Scenario 2 */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-300 font-semibold mb-2">
                ❓ <strong>Situația 2:</strong> La terminarea orelor în laboratorul de informatică, ce opțiune alegi pentru oprirea definitivă (pag. 23)?
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['sleep', 'shutdown', 'restart'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (opt === 'shutdown') sounds.playCorrect();
                      else sounds.playWrong();
                      setPowerScenario2(opt);
                    }}
                    className={`py-2 px-2 rounded-lg font-bold border transition cursor-pointer ${
                      powerScenario2 === opt
                        ? opt === 'shutdown'
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'bg-rose-600 border-rose-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {opt === 'sleep' && '🌙 Sleep (Repaus)'}
                    {opt === 'shutdown' && '🛑 Shut down'}
                    {opt === 'restart' && '🔄 Restart'}
                  </button>
                ))}
              </div>
              {powerScenario2 === 'shutdown' && (
                <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                  ✓ Corect! Shut down (Închidere) oprește definitiv calculatorul și sistemul de operare.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ETAPA 2: Sistem de Operare vs Aplicații (pag. 22 & 24 Ex. 4) */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-black flex items-center justify-center border border-cyan-500/40">
                2
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                Clasificare: Sisteme de Operare vs Aplicații (Exercițiul 4 din manual pag. 24)
              </h3>
            </div>
            {isStep2Done ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corect!
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-mono">Selectează exact cele 2 SO</span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-3">
            Manualul (pag. 22 și 24 ex. 4) explică: Programele utilizator (aplicațiile) se instalează <em>după</em> sistemul de operare. Din lista de mai jos, <strong>selectează doar cele care sunt SISTEME DE OPERARE</strong> (nu aplicații de desen, text sau redare video):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {[
              { id: 'Paint', label: 'Paint', icon: '🎨', type: 'app', note: 'Program de desenat (Aplicație)' },
              { id: 'Media Player', label: 'Media Player', icon: '🎵', type: 'app', note: 'Redare muzică/video (Aplicație)' },
              { id: 'Notepad', label: 'Notepad', icon: '📝', type: 'app', note: 'Editor de text simplu (Aplicație)' },
              { id: 'Windows', label: 'Windows', icon: '🪟', type: 'os', note: 'Sistem de operare cu interfață grafică!' },
              { id: 'WordPad', label: 'WordPad', icon: '📄', type: 'app', note: 'Editor de text formatat (Aplicație)' },
              { id: 'MS-DOS', label: 'MS-DOS', icon: '⬛', type: 'os', note: 'Sistem de operare cu interfață în mod text!' },
            ].map((item) => {
              const isSelected = selectedOS.includes(item.id);
              const isTargetOS = item.type === 'os';
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                    isSelected
                      ? isTargetOS
                        ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 text-white'
                        : 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/40 text-white'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{item.icon}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                      isSelected
                        ? isTargetOS
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isSelected ? (isTargetOS ? 'Sistem de Operare ✓' : 'Aplicație (Greșit) ✗') : 'Selectează'}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white font-heading">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{item.note}</div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-300 font-mono">Mod Text vs Grafic (pag. 22):</strong>{' '}
              Sistemele precum <strong>MS-DOS</strong> sau <strong>FreeDOS</strong> funcționează în mod text (comenzi scrise), pe când <strong>Windows</strong>, <strong>Mac OS</strong> și <strong>Android</strong> folosesc interfață grafică (ferestre, pictograme, culori, mouse).
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ETAPA 3: Fereastra Windows & Butoanele de Control (pag. 23–24) */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-black flex items-center justify-center border border-purple-500/40">
                3
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                Elementele unei Ferestre & Taste Rapide (pag. 23–24)
              </h3>
            </div>
            {isStep3Done ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Validat!
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-mono">În lucru</span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-4">
            În Windows, programele rulează în <strong>ferestre</strong> (dreptunghiuri pe ecran). Testează butoanele de control din colțul din dreapta-sus al ferestrei de mai jos:
          </p>

          {/* Interactive Window Sandbox */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 min-h-[220px] flex flex-col justify-center items-center relative overflow-hidden mb-4">
            
            {windowState === 'minimized' ? (
              <div className="text-center p-4">
                <div className="text-sm text-slate-400 mb-3">
                  ⬇️ Fereastra a fost minimizată pe Bara de Activități (taskbar)!
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setWindowState('normal');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <span>📝 Click pe pictograma Notepad de pe taskbar pentru restaurare</span>
                </button>
              </div>
            ) : (
              <div
                className={`transition-all duration-300 bg-slate-900 border-2 rounded-xl shadow-2xl flex flex-col ${
                  windowState === 'maximized'
                    ? 'w-full h-56 border-cyan-500/60'
                    : 'w-11/12 max-w-md h-48 border-slate-700'
                }`}
              >
                {/* Titlebar with window buttons */}
                <div className="bg-slate-800/90 px-3 py-2 border-b border-slate-700 flex items-center justify-between text-xs select-none">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-slate-200">Notepad - ZiuaPamantului.txt</span>
                  </div>

                  {/* Window Control Buttons (pag. 24 Fig. 3) */}
                  <div className="flex items-center">
                    {/* Minimize */}
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setTestedMinimize(true);
                        setWindowState('minimized');
                      }}
                      className="w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/80 rounded transition cursor-pointer"
                      title="1. Butonul de minimizare (-) aduce fereastra la nivel de pictogramă pe taskbar"
                    >
                      <span className="font-bold text-sm">─</span>
                    </button>

                    {/* Maximize / Restore */}
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setTestedMaximize(true);
                        setWindowState(windowState === 'maximized' ? 'normal' : 'maximized');
                      }}
                      className="w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/80 rounded transition cursor-pointer"
                      title="2. Butonul de maximizare / restaurare"
                    >
                      {windowState === 'maximized' ? (
                        <Copy className="w-3 h-3" />
                      ) : (
                        <Maximize2 className="w-3 h-3" />
                      )}
                    </button>

                    {/* Close */}
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setTestedClose(true);
                      }}
                      className="w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600 rounded transition cursor-pointer"
                      title="3. Butonul de închidere (X) - Închide fereastra"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-3.5 flex-1 bg-slate-950/90 text-xs font-mono text-emerald-400 leading-relaxed overflow-hidden">
                  <div>1  22 Aprilie</div>
                  <div>2  La mulți ani Pământ!</div>
                  <div className="text-slate-500 mt-2">
                    {windowState === 'maximized'
                      ? '✓ Fereastra este acum MAXIMIZATĂ pe tot ecranul!'
                      : 'ℹ️ Trage de colțuri sau apasă pe pătratul de sus pentru maximizare.'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Questions from Textbook (pag. 24) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Alt+F4 Question */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-300 font-semibold mb-2">
                ❓ <strong>Manual pag. 24:</strong> Ce combinație de taste de la tastatură închide instant fereastra curentă?
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { id: 'ctrl_s', label: 'Ctrl + S' },
                  { id: 'alt_f4', label: 'Alt + F4' },
                  { id: 'win_d', label: 'Win + D' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'alt_f4') sounds.playCorrect();
                      else sounds.playWrong();
                      setAltF4Answer(item.id);
                    }}
                    className={`py-2 px-2 rounded-lg font-bold border transition cursor-pointer ${
                      altF4Answer === item.id
                        ? item.id === 'alt_f4'
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'bg-rose-600 border-rose-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {altF4Answer === 'alt_f4' && (
                <p className="text-[11px] text-emerald-400 mt-2 font-medium font-sans">
                  ✓ Corect! Alt + F4 închide aplicația activă.
                </p>
              )}
            </div>

            {/* Știați că - Solitaire & Mouse Question */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-300 font-semibold mb-2">
                💡 <strong>Știați că? (Manual pag. 23):</strong> De ce erau incluse jocuri precum Solitaire și Minesweeper în primele versiuni de Windows?
              </div>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    sounds.playCorrect();
                    setTriviaSolitaireAnswer(true);
                  }}
                  className={`w-full py-2 px-3 rounded-lg font-medium text-left border transition cursor-pointer ${
                    triviaSolitaireAnswer === true
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  ✓ Pentru a-i învăța pe oameni să folosească mouse-ul și operația de drag & drop
                </button>
                <button
                  onClick={() => {
                    sounds.playWrong();
                    setTriviaSolitaireAnswer(false);
                  }}
                  className={`w-full py-2 px-3 rounded-lg font-medium text-left border transition cursor-pointer ${
                    triviaSolitaireAnswer === false
                      ? 'bg-rose-600/30 border-rose-400 text-rose-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  ✗ Pentru a testa placa video 3D
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion & Next Level Button */}
      <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          {allCompleted ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Toate cele 3 etape ale Nivelului 1 sunt complete! (+10 pct)
            </span>
          ) : (
            <span>Rezolvă cerințele din cele 3 etape de mai sus pentru a debloca Nivelul 2.</span>
          )}
        </div>

        <button
          onClick={handleFinish}
          disabled={!allCompleted}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
            allCompleted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20 active:scale-95'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Treci la Nivelul 2: Extensii & Calea C:\ ▶</span>
        </button>
      </div>
    </div>
  );
};
