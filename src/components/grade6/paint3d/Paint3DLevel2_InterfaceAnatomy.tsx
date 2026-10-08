import React, { useState } from 'react';
import { 
  Palette, 
  Box, 
  Smile, 
  Type, 
  Sun, 
  Layout, 
  FolderPlus, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Eye, 
  Maximize2,
  Paintbrush,
  Shapes
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface Paint3DLevel2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface ToolDefinition {
  id: string;
  name: string;
  icon: string;
  category: string;
  manualRef: string;
  desc: string;
  rightPanelContent: string[];
}

export const Paint3DLevel2_InterfaceAnatomy: React.FC<Paint3DLevel2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  const tools: ToolDefinition[] = [
    {
      id: 'brushes',
      name: 'Pensule (Brushes)',
      icon: '🖌️',
      category: 'Desen & Texturare',
      manualRef: 'pag. 28',
      desc: 'Conține unelte artistice: marker, stilou caligrafic, pensulă ulei, acuarelă, creion, spray și găleată de umplere cu toleranță reglabilă.',
      rightPanelContent: ['Grosime pensulă (px)', 'Opacitate (%)', 'Finisaj material (Mat / Lucios / Metal)', 'Paletă de culori RGB']
    },
    {
      id: 'shapes2d',
      name: 'Forme 2D (2D Shapes)',
      icon: '📐',
      category: 'Geometrie Plană',
      manualRef: 'pag. 28',
      desc: 'Linii, curbe Bézier cu 3-4 puncte de control, cercuri, capsule, stele și poligoane. Include butonul magic „Creare 3D”!',
      rightPanelContent: ['Linii & Curbe', 'Poligoane 2D', 'Grosime contur', 'Buton: Creare 3D (Make 3D)']
    },
    {
      id: 'shapes3d',
      name: 'Forme 3D (3D Shapes)',
      icon: '🧊',
      category: 'Corpuri & Modele',
      manualRef: 'pag. 28-29',
      desc: 'Corpuri geometrice (cub, sferă, cilindru, con, piramidă, tor), modele umane/animale (băiat, fată, câine, pisică) și instrumentul Doodle 3D.',
      rightPanelContent: ['Doodle 3D muchie ascuțită', 'Doodle 3D muchie moale', 'Corpuri geometrice 3D', 'Modele 3D gata făcute']
    },
    {
      id: 'stickers',
      name: 'Stickere (Stickers)',
      icon: '⭐',
      category: 'Texturi & Detalii',
      manualRef: 'pag. 29',
      desc: 'Abțibilduri decorative (ochi, ochelari, mustață) și texturi realiste (lemn, marmură, piatră, scoarță de copac) care se mulează perfect pe corpurile 3D.',
      rightPanelContent: ['Stickere amuzante', 'Texturi naturale (lemn, marmură)', 'Opacitate sticker', 'Adăugare sticker propriu din fișier']
    },
    {
      id: 'text3d',
      name: 'Text & Text 3D',
      icon: '🔤',
      category: 'Tipografie Spațială',
      manualRef: 'pag. 29',
      desc: 'Permite scrierea textului plan 2D sau generarea de litere 3D cu volum gros, care pot fi rotite pe axele X, Y, Z ca un obiect solid.',
      rightPanelContent: ['Text 2D vs Text 3D', 'Font & Dimensiune puncte (pt)', 'Aliniere & Stil (Bold, Italic)', 'Culoare text 3D']
    },
    {
      id: 'effects',
      name: 'Efecte & Iluminare (Effects)',
      icon: '🌅',
      category: 'Atmosferă & Lumini',
      manualRef: 'pag. 29',
      desc: 'Filtre cromatice și rotația sursei de lumină a scenei (Soare, Amurg, Noapte, Neon, Cărbune, Acadea/Taffy) pentru a schimba direcția umbrelor.',
      rightPanelContent: ['Filtre de culoare scenă', 'Roată de direcție a luminii (360°)', 'Intensitate umbre', 'Lumină caldă vs rece']
    },
    {
      id: 'canvas',
      name: 'Pânză (Canvas)',
      icon: '🖼️',
      category: 'Spațiu de Lucru',
      manualRef: 'pag. 28',
      desc: 'Controlează fundalul: afișarea/ascunderea pânzei, redimensionarea lățimii/înălțimii în pixeli sau procente și Pânza Transparentă (Transparent Canvas).',
      rightPanelContent: ['Afișare pânză: Da/Nu', 'Pânză transparentă: On/Off', 'Redimensionare pânză', 'Blocare raport de aspect']
    },
    {
      id: 'library3d',
      name: 'Biblioteca 3D (3D Library)',
      icon: '🦖',
      category: 'Comunitate & Resurse',
      manualRef: 'pag. 29',
      desc: 'Catalog uriaș de modele 3D gata realizate (animale, dinozauri, vehicule, astronauți, flori) ce pot fi aduse în scenă printr-un singur clic.',
      rightPanelContent: ['Căutare modele online', 'Categorii: Animale, Spațiu, Oraș', 'Modele animate', 'Colecție educațională']
    }
  ];

  // Active Tool state
  const [activeToolId, setActiveToolId] = useState<string>('shapes3d');
  const [transparentCanvas, setTransparentCanvas] = useState<boolean>(false);
  const [testedTools, setTestedTools] = useState<Record<string, boolean>>({ shapes3d: true });
  const [view3DMode, setView3DMode] = useState<boolean>(false);

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const activeTool = tools.find(t => t.id === activeToolId) || tools[0];

  const handleSelectTool = (id: string) => {
    sounds.playClick();
    setActiveToolId(id);
    setTestedTools(prev => ({ ...prev, [id]: true }));
  };

  const handleToggleTransparent = () => {
    sounds.playRetro('coin');
    setTransparentCanvas(prev => !prev);
  };

  const handleToggle3DView = () => {
    sounds.playRetro('powerup');
    setView3DMode(prev => !prev);
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'canvas_transparent') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'doodle_3d') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isQ1Correct = q1Answer === 'canvas_transparent';
  const isQ2Correct = q2Answer === 'doodle_3d';
  const hasTestedToolsCount = Object.keys(testedTools).length >= 3;
  const isComplete = hasTestedToolsCount && isQ1Correct && isQ2Correct;

  const handleFinish = () => {
    if (isComplete) {
      sounds.playVictory();
      onCompletePage(100);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🛠️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {lang === 'en' ? 'Unit 2 • Lesson 1 (p. 28–29)' : 'Unitatea 2 • Lecția 1 (pag. 28–29)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 2/7' : 'Ecranul 2/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'Paint 3D Interface Anatomy & The 8 Core Tools' 
                  : 'Anatomia Interfeței Paint 3D & Cele 8 Instrumente de Bază'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Layout className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Top Toolbar & Right Side Panel' : 'Bara Superioară & Panoul Lateral Dreapta'}</span>
          </div>
        </div>
      </div>

      {/* Paint 3D Workstation Simulator Shell */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'en' ? 'Interactive Paint 3D Studio Simulator' : 'Simulatorul Interfeței Reale Paint 3D'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Click each tool in the top toolbar to view its functions and side control options!'
                : 'Apasă pe fiecare instrument din bara de sus pentru a-i descoperi opțiunile din panoul lateral dreapta!'}
            </p>
          </div>

          {/* Top Canvas Controls (Vizualizare 3D & Pânză Transparentă) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggle3DView}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                view3DMode
                  ? 'bg-cyan-400 text-slate-950 shadow-md ring-2 ring-cyan-300'
                  : 'bg-slate-950 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vizualizare 3D {view3DMode ? '(Activă)' : ''}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleTransparent}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                transparentCanvas
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-950 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pânză Transparentă {transparentCanvas ? '(ON)' : '(OFF)'}</span>
            </button>
          </div>
        </div>

        {/* Top Ribbon of the 8 Tools */}
        <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {tools.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTool(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeToolId === t.id
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-200 shadow-lg'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-base">{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Studio Canvas + Right Control Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main Workspace Canvas Area (7 Cols) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
            {/* Grid or checkerboard background for transparent canvas */}
            {transparentCanvas ? (
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
            ) : (
              <div className="absolute inset-6 bg-slate-900 border border-slate-700 rounded-xl shadow-inner pointer-events-none"></div>
            )}

            {/* Canvas Header Tag */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-mono text-slate-400">
                Pânză Paint 3D • Dimensiune: 1920 × 1080 px
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                {transparentCanvas ? 'Fără fundal alb (Export .PNG transparent)' : 'Fundal Pânză Clasic'}
              </span>
            </div>

            {/* Center Visual Mockup of the Active Tool in Action */}
            <div className="relative z-10 py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border-2 border-cyan-400 flex items-center justify-center text-5xl shadow-xl animate-float">
                {activeTool.icon}
              </div>

              <div>
                <h3 className="text-base font-black text-white font-heading">
                  {activeTool.name}
                </h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed mt-1">
                  {activeTool.desc}
                </p>
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              <span>Zoom: 100%</span>
              <span>Mod: {view3DMode ? 'Orbitare 3D Activă' : 'Editare Standard'}</span>
            </div>
          </div>

          {/* Right Side Control Panel (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                  Panou Lateral Dreapta
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeTool.manualRef}
                </span>
              </div>

              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{activeTool.icon}</span>
                <span>Opțiuni pentru {activeTool.name}:</span>
              </div>

              <ul className="space-y-2">
                {activeTool.rightPanelContent.map((item, idx) => (
                  <li 
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200 space-y-1">
              <strong>💡 Reține din manual:</strong>
              <p>În Paint 3D, bara din dreapta se adaptează instantaneu la instrumentul activ selectat de sus.</p>
            </div>
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            {hasTestedToolsCount ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Instrumente explorate ({Object.keys(testedTools).length}/8)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Testează cel puțin 3 instrumente ({Object.keys(testedTools).length}/3)
              </span>
            )}
            <span>•</span>
            <span className="text-slate-400">
              Pânză Transparentă: <strong className={transparentCanvas ? 'text-amber-300' : 'text-slate-500'}>{transparentCanvas ? 'Activată' : 'Dezactivată'}</strong>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">Manual pag. 28–29</span>
        </div>
      </div>

      {/* Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quiz 1 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'A transparent canvas removes the white box background, leaving only the 3D model.' : 'Pânza transparentă permite salvarea corpului fără un dreptunghi alb în spate.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Why would an artist activate the "Transparent Canvas" option in Paint 3D?'
              : 'De ce este util să activăm opțiunea „Pânză Transparentă” (Transparent Canvas) din fila Pânză?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'canvas_transparent', label: lang === 'en' ? 'To export models or sticker graphics without any white square background' : 'Pentru a exporta corpul 3D fără fundal alb, ideal pentru jocuri și stickere' },
              { id: 'turn_off_pc', label: lang === 'en' ? 'To turn off the computer screen' : 'Pentru a opri monitorul calculatorului' },
              { id: 'delete_model', label: lang === 'en' ? 'It permanently deletes all 3D objects' : 'Șterge automat toate obiectele din scenă' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'canvas_transparent'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                isQ1Correct
                  ? (lang === 'en'
                      ? 'Correct! Transparent canvas allows seamless integration into PowerPoint slides, Scratch, or 3D games.'
                      : 'Excelent! Pânza transparentă elimină marginile albe, permițând importul impecabil al personajelor în Scratch sau PowerPoint.')
                  : (lang === 'en'
                      ? 'Incorrect. Transparent canvas simply hides the white background sheet.'
                      : 'Incorect. Pânza transparentă face fundalul invizibil fără a afecta obiectele 3D create.')
              }
            />
          )}
        </div>

        {/* Quiz 2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? '3D Doodle allows freehand volumetric drawing with soft or sharp edges.' : 'Instrumentul Doodle 3D permite desenarea cu mâna liberă a unui corp tridimensional.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which Paint 3D tool allows drawing freehand 3D shapes like clouds, cushions, or tubes?'
              : 'Ce unealtă din categoria Forme 3D permite desenarea cu mâna liberă a unor corpuri cu volum (de exemplu un nor pufos sau o pernă)?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'doodle_3d', label: 'Doodle 3D (cu muchie moale sau ascuțită)' },
              { id: 'eraser', label: 'Radiera (Eraser)' },
              { id: 'ruler', label: 'Rigla simplă de birou' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'doodle_3d'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                isQ2Correct
                  ? (lang === 'en'
                      ? 'Spot on! 3D Doodle inflates any 2D freehand stroke into a plump 3D sculpture.'
                      : 'Exact! Doodle-ul 3D cu muchie moale umflă conturul desenat de mână într-un corp 3D volumetric.')
                  : (lang === 'en'
                      ? 'Not quite. The tool is named 3D Doodle (Schiță 3D).'
                      : 'Incorect. Instrumentul din manual se numește Doodle 3D (cu muchie ascuțită sau rotunjită/moale).')
              }
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isComplete}
        onAdvance={handleFinish}
        cooldownRemaining={0}
      />
    </div>
  );
};
