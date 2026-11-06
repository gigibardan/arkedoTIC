import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface Hotspot {
  id: string;
  nameRo: string;
  nameEn: string;
  roleRo: string;
  roleEn: string;
  hotkeyRo?: string;
  hotkeyEn?: string;
  tipRo: string;
  tipEn: string;
}

const IDE_ZONES: Hotspot[] = [
  {
    id: 'editor',
    nameRo: '1. Editorul Central de Cod',
    nameEn: '1. Central Code Editor',
    roleRo: 'Zona unde scrii și editezi codul sursă (.cpp). Oferă numerotare a liniilor și colorare a cuvintelor cheie (syntax highlighting).',
    roleEn: 'The area where you write and edit source files (.cpp). Provides line numbering and syntax keyword highlighting.',
    tipRo: 'Liniile numerotate te ajută să localizezi imediat erorile semnalate de compilator!',
    tipEn: 'Numbered lines help you immediately pinpoint compiler error locations!'
  },
  {
    id: 'management',
    nameRo: '2. Panoul Management (Proiecte)',
    nameEn: '2. Management Pane (Projects Tree)',
    roleRo: 'Afișează arborele proiectului (Workspace), fișierele sursă (.cpp) și fișierele antet (.h) incluse.',
    roleEn: 'Displays project workspace tree, included C++ source files (.cpp), and header files (.h).',
    tipRo: 'Îți permite să navighezi rapid între mai multe fișiere dintr-un proiect mare.',
    tipEn: 'Allows instantaneous navigation between multiple files in a multi-source project.'
  },
  {
    id: 'toolbar',
    nameRo: '3. Bara de Compilare & Rulare (Toolbars)',
    nameEn: '3. Build & Run Toolbars',
    roleRo: 'Butoanele de acțiune: Roata dințată galbenă (Build), Triunghiul verde (Run) și Roata cu triunghi (Build and Run).',
    roleEn: 'Action buttons: Yellow gear (Build), Green play arrow (Run), and Gear with play (Build and Run).',
    hotkeyRo: 'Tasta F9',
    hotkeyEn: 'F9 Key',
    tipRo: 'F9 este comanda rapidă esențială pe care o vei folosi de mii de ori în laboratorul de informatică!',
    tipEn: 'F9 is the indispensable shortcut you will press thousands of times in computer lab!'
  },
  {
    id: 'logs',
    nameRo: '4. Panoul Inferior (Logs & Others / Build Log)',
    nameEn: '4. Bottom Panel (Logs & Others / Build Log)',
    roleRo: 'Aici apar mesajele compilatorului: 0 errors, 0 warnings sau linia exactă unde ai uitat un punct și virgulă (;).',
    roleEn: 'Compiler diagnostics appear here: 0 errors, 0 warnings or exact line missing a semicolon (;).',
    tipRo: 'Dacă ai o linie roșie de eroare, dă dublu-clic pe ea în Build Log și cursorul va sări direct la linia greșită!',
    tipEn: 'Double-clicking a red error line in Build Log jumps cursor straight to the offending code line!'
  }
];

const COMPILATION_STEPS = [
  {
    id: 'step_src',
    titleRo: '1. Cod Sursă (.cpp)',
    titleEn: '1. Source Code (.cpp)',
    descRo: 'Textul scris de elev în C++ (înțeles de oameni, dar neînțeles de procesor).',
    descEn: 'Human-readable C++ text instructions typed by the student in editor.'
  },
  {
    id: 'step_comp',
    titleRo: '2. Compilatorul (GCC/MinGW)',
    titleEn: '2. Compiler (GCC/MinGW)',
    descRo: 'Traduce codul C++ în instrucțiuni binare de bază specifice mașinii.',
    descEn: 'Translates high-level C++ syntax into low-level machine instructions.'
  },
  {
    id: 'step_obj',
    titleRo: '3. Cod Obiect (.o / .obj)',
    titleEn: '3. Object Code (.o / .obj)',
    descRo: 'Fișierul intermediar tradus în limbaj binar (0 și 1).',
    descEn: 'Intermediate compiled binary object files storing raw machine bytecode.'
  },
  {
    id: 'step_link',
    titleRo: '4. Editorul de Legături (Linker)',
    titleEn: '4. Linker',
    descRo: 'Lipește codul tău cu biblioteca iostream și generează fișierul final .exe.',
    descEn: 'Binds your object code with runtime standard libraries (iostream) to produce .exe.'
  }
];

export const CPLevel2_CodeBlocksIDEAnatomy: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<string>('editor');
  const [exploredZones, setExploredZones] = useState<Set<string>>(new Set(['editor']));

  // Step 2: Quiz on shortcuts and compilation
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const handleSelectZone = (id: string) => {
    sounds.playClick();
    setSelectedZone(id);
    setExploredZones(prev => new Set(prev).add(id));
  };

  const currentZoneData = IDE_ZONES.find(z => z.id === selectedZone)!;

  const handleVerifyQuiz = () => {
    if (q1Answer === 'f9' && q2Answer === 'exe') {
      sounds.playCorrect();
      setIsSubmitted(true);
      setQuizError(null);
    } else {
      sounds.playWrong();
      setQuizError(
        lang === 'ro'
          ? 'Unele răspunsuri sunt incorecte. Reamintește-ți: tasta F9 face Build & Run, iar fișierul final gata de lansare are extensia .exe!'
          : 'Some answers are incorrect. Remember: F9 executes Build & Run, and the final runnable executable has the .exe extension!'
      );
    }
  };

  const handleFinish = () => {
    sounds.playVictory();
    onPass(100);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg text-2xl font-black">
            2
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>
                {lang === 'ro'
                  ? 'Unitatea 4 • Limbajul C++ (Manual Art Klett pag. 66–69)'
                  : 'Unit 4 • C++ Programming (Art Klett Textbook pp. 66–69)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Anatomia Mediului Code::Blocks & Compilarea'
                : 'Code::Blocks IDE Anatomy & Compilation'}
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {lang === 'ro'
            ? `${exploredZones.size} / ${IDE_ZONES.length} zone IDE inspectate`
            : `${exploredZones.size} / ${IDE_ZONES.length} IDE zones inspected`}
        </span>
      </div>

      {/* Code::Blocks Interactive Mockup Visualizer */}
      <div className="flex flex-col gap-3">
        <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span>
            {lang === 'ro'
              ? 'Fereastra Interactivă Code::Blocks IDE (Apasă pe fiecare zonă pentru a o explora):'
              : 'Interactive Code::Blocks IDE Window (Click each zone to inspect):'}
          </span>
        </div>

        <div className="bg-slate-950 border-2 border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col gap-2 font-mono text-xs">
          {/* Top Title Bar of Code::Blocks */}
          <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="font-bold text-slate-200">Code::Blocks 20.03 — [main.cpp]</span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">GNU GCC Compiler (MinGW 64-bit)</span>
          </div>

          {/* Toolbar Zone (Hotspot) */}
          <button
            onClick={() => handleSelectZone('toolbar')}
            className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-wrap items-center justify-between gap-2 ${
              selectedZone === 'toolbar'
                ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold text-[10px]">
                {lang === 'ro' ? 'ZONA 3' : 'ZONE 3'}
              </span>
              <span className="text-slate-300 font-bold text-xs sm:text-sm">
                {lang === 'ro' ? 'Bara de Compilare & Rulare:' : 'Build & Run Toolbar:'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-700 text-[10px] flex items-center gap-1 font-bold">
                  ⚙️ Build (Ctrl+F9)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] flex items-center gap-1 font-bold">
                  ▶ Run (Ctrl+F10)
                </span>
                <span className="px-2.5 py-0.5 rounded bg-violet-900 text-violet-200 border border-violet-500 text-[10px] font-black flex items-center gap-1 animate-pulse">
                  ⚙️▶ Build & Run [F9]
                </span>
              </div>
            </div>
            {exploredZones.has('toolbar') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Middle Body: Management Panel (Left) & Editor (Center) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {/* Left Management Hotspot */}
            <button
              onClick={() => handleSelectZone('management')}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedZone === 'management'
                  ? 'bg-sky-500/10 border-sky-400 ring-2 ring-sky-400/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-bold text-[10px]">
                    {lang === 'ro' ? 'ZONA 2' : 'ZONE 2'}
                  </span>
                  {exploredZones.has('management') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-bold text-slate-200 text-xs mb-1">
                  {lang === 'ro' ? 'Management' : 'Management'}
                </div>
                <div className="text-[10px] text-slate-400 space-y-1">
                  <div>📁 Workspace</div>
                  <div className="pl-3 text-sky-400">└ 📁 {lang === 'ro' ? 'Proiect1' : 'Project1'}</div>
                  <div className="pl-6 text-emerald-400">└ 📄 main.cpp</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 italic">
                {lang === 'ro' ? 'Arborele Proiectului' : 'Project Tree'}
              </div>
            </button>

            {/* Central Editor Hotspot (Spans 3 cols) */}
            <button
              onClick={() => handleSelectZone('editor')}
              className={`md:col-span-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedZone === 'editor'
                  ? 'bg-violet-500/10 border-violet-400 ring-2 ring-violet-400/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-violet-300 font-bold text-[10px]">
                      {lang === 'ro' ? 'ZONA 1' : 'ZONE 1'}
                    </span>
                    <span className="font-bold text-slate-200 text-xs">
                      {lang === 'ro' ? 'Editorul de Cod (main.cpp)' : 'Code Editor (main.cpp)'}
                    </span>
                  </div>
                  {exploredZones.has('editor') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono leading-relaxed">
                  <div><span className="text-slate-600 select-none mr-3">1</span><span className="text-cyan-400">#include</span> <span className="text-emerald-300">&lt;iostream&gt;</span></div>
                  <div><span className="text-slate-600 select-none mr-3">2</span><span className="text-cyan-400">using namespace</span> <span className="text-amber-300">std</span>;</div>
                  <div><span className="text-slate-600 select-none mr-3">3</span></div>
                  <div><span className="text-slate-600 select-none mr-3">4</span><span className="text-violet-400">int</span> <span className="text-yellow-300 font-bold">main</span>() &#123;</div>
                  <div><span className="text-slate-600 select-none mr-3">5</span>    <span className="text-sky-300">cout</span> &lt;&lt; <span className="text-emerald-300">"{lang === 'ro' ? 'Bine ai venit in C++!' : 'Welcome to C++!'}"</span>;</div>
                  <div><span className="text-slate-600 select-none mr-3">6</span>    <span className="text-cyan-400">return</span> <span className="text-amber-400">0</span>;</div>
                  <div><span className="text-slate-600 select-none mr-3">7</span>&#125;</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                <span>{lang === 'ro' ? 'Numerotare linii + Colorare sintaxă' : 'Line numbers + Syntax highlighting'}</span>
                <span className="text-violet-400 font-bold">{lang === 'ro' ? 'UTF-8 • Linii: 7' : 'UTF-8 • Lines: 7'}</span>
              </div>
            </button>
          </div>

          {/* Bottom Logs Hotspot */}
          <button
            onClick={() => handleSelectZone('logs')}
            className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
              selectedZone === 'logs'
                ? 'bg-emerald-500/10 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold text-[10px]">
                {lang === 'ro' ? 'ZONA 4' : 'ZONE 4'}
              </span>
              <span className="text-slate-300 font-bold text-xs">
                {lang === 'ro' ? 'Build Log & Mesaje Erori:' : 'Build Log & Diagnostics:'}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                === Build finished: 0 errors, 0 warnings (0 minutes, 0 seconds) ===
              </span>
            </div>
            {exploredZones.has('logs') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Selected Zone Details Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-violet-950/30 border border-violet-500/30">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h4 className="font-bold text-sm text-white font-heading">
              {lang === 'ro' ? currentZoneData.nameRo : currentZoneData.nameEn}
            </h4>
            {(currentZoneData.hotkeyRo || currentZoneData.hotkeyEn) && (
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                {lang === 'ro'
                  ? `Scurtătură: ${currentZoneData.hotkeyRo}`
                  : `Shortcut: ${currentZoneData.hotkeyEn}`}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
            {lang === 'ro' ? currentZoneData.roleRo : currentZoneData.roleEn}
          </p>
          <div className="text-xs text-violet-300 bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{lang === 'ro' ? 'Sfat de laborator: ' : 'Lab Tip: '}</strong>
              {lang === 'ro' ? currentZoneData.tipRo : currentZoneData.tipEn}
            </span>
          </div>
        </div>
      </div>

      {/* The 4 Phases of Compilation Pipeline Diagram */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
        <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>
            {lang === 'ro'
              ? 'Cum se transformă codul tău în program (.exe): Ciclul de Compilare'
              : 'How your source turns into an executable (.exe): The Compilation Pipeline'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMPILATION_STEPS.map((step, idx) => (
            <div key={step.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between relative group hover:border-violet-500/50 transition">
              <div>
                <div className="text-xs font-bold font-mono text-cyan-400 mb-1">
                  {lang === 'ro' ? step.titleRo : step.titleEn}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ro' ? step.descRo : step.descEn}
                </p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-3 text-right">
                {lang === 'ro' ? `Etapa ${idx + 1} din 4` : `Stage ${idx + 1} of 4`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Verification Quiz */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'ro' ? 'Verificare Rapidă de Laborator:' : 'Quick Lab Check:'}</span>
        </div>

        {quizError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{quizError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Q1 */}
          <div className="space-y-2">
            <p className="text-xs text-slate-200 font-medium">
              {lang === 'ro'
                ? '1. Ce tastă rapidă construiește și rulează programul într-un singur pas în Code::Blocks (Build and Run)?'
                : '1. What shortcut builds and runs the program in a single step in Code::Blocks (Build and Run)?'}
            </p>
            <div className="flex flex-wrap gap-2">
              {['F1', 'F5', 'F9', 'Ctrl + S'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    sounds.playClick();
                    setQ1Answer(opt.toLowerCase());
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                    q1Answer === opt.toLowerCase()
                      ? 'bg-violet-600 text-white border-violet-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-2">
            <p className="text-xs text-slate-200 font-medium">
              {lang === 'ro'
                ? '2. Ce extensie are fișierul executabil final gata de lansare generat de Linker?'
                : '2. What file extension does the final ready-to-run executable generated by Linker carry?'}
            </p>
            <div className="flex flex-wrap gap-2">
              {['.cpp', '.docx', '.exe', '.pdf'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    sounds.playClick();
                    setQ2Answer(opt.replace('.', '').toLowerCase());
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                    q2Answer === opt.replace('.', '').toLowerCase()
                      ? 'bg-violet-600 text-white border-violet-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!isSubmitted ? (
          <button
            disabled={!q1Answer || !q2Answer}
            onClick={handleVerifyQuiz}
            className="w-full sm:w-auto self-end px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer"
          >
            {lang === 'ro' ? 'Verifică Răspunsurile' : 'Check Answers'}
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'ro'
                ? 'Răspunsuri 100% corecte! Tasta F9 și fișierul .exe sunt fundamentele execuției.'
                : '100% correct! F9 key and .exe executables are core foundations of compilation.'}
            </span>
            <button
              onClick={handleFinish}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              <span>
                {lang === 'ro'
                  ? 'Mergi la Nivelul 3: Scheletul unui Program'
                  : 'Proceed to Level 3: Program Skeleton'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
