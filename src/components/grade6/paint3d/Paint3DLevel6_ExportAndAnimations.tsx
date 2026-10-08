import React, { useState } from 'react';
import { 
  Play, 
  RotateCw, 
  Download, 
  Film, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Share2, 
  Video, 
  FileCode, 
  Activity
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface Paint3DLevel6Props {
  onCompletePage: (earnedScore: number) => void;
}

type AnimationLoopType = 'turntable' | 'swing' | 'jump_turn' | 'pulse';

export const Paint3DLevel6_ExportAndAnimations: React.FC<Paint3DLevel6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Animation Loop & Export State
  const [activeAnimation, setActiveAnimation] = useState<AnimationLoopType>('turntable');
  const [selectedFormat, setSelectedFormat] = useState<string>('glb');
  const [isExportSimulated, setIsExportSimulated] = useState<boolean>(false);
  const [testedAnimations, setTestedAnimations] = useState<Record<string, boolean>>({ turntable: true });

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const animationsList = [
    {
      id: 'turntable' as AnimationLoopType,
      name: 'Placă Turnantă (Turntable)',
      icon: '🔄',
      desc: 'Rotire continuă la 360° în jurul axei verticale, perfectă pentru prezentarea tuturor unghiurilor unui exponat.'
    },
    {
      id: 'swing' as AnimationLoopType,
      name: 'Legănare (Swing)',
      icon: '⚖️',
      desc: 'Mișcare elegantă de pendul stânga-dreapta, oferind o perspectivă dinamică asupra volumului.'
    },
    {
      id: 'jump_turn' as AnimationLoopType,
      name: 'Salt & Rotire (Jump & Turn)',
      icon: '🦘',
      desc: 'Personajul sare energic în aer, face o rotație completă la 360° și aterizează înapoi pe pânză!'
    },
    {
      id: 'pulse' as AnimationLoopType,
      name: 'Pulsare (Pulse)',
      icon: '💓',
      desc: 'Mărire și micșorare ritmică, ca o bătaie de inimă, atrăgând atenția asupra modelului.'
    }
  ];

  const exportFormats = [
    {
      id: 'glb',
      name: '.GLB (Standard 3D Web & Office)',
      badge: 'Recomandat • PowerPoint & Minecraft',
      desc: 'Formatul 3D universal. Se poate insera direct în diapozitive PowerPoint pentru prezentări interactive sau importa în lumi Minecraft.'
    },
    {
      id: '3mf',
      name: '.3MF (3D Manufacturing Format)',
      badge: 'Imprimare 3D Reală',
      desc: 'Formatul dedicat imprimantelor 3D. Salvează geometria precisă, culorile și materialul pentru producția fizică pe imprimantă 3D.'
    },
    {
      id: 'mp4',
      name: 'Video MP4 / GIF Animat',
      badge: 'Video & Social Media',
      desc: 'Înregistrare video la 60 cadre pe secundă cu animația aleasă (Placă turnantă, Salt), gata de trimis pe WhatsApp sau prezentat.'
    }
  ];

  const handleSelectAnimation = (anim: AnimationLoopType) => {
    sounds.playRetro('coin');
    setActiveAnimation(anim);
    setTestedAnimations(prev => ({ ...prev, [anim]: true }));
  };

  const handleSimulateExport = (fmtId: string) => {
    sounds.playRetro('powerup');
    setSelectedFormat(fmtId);
    setIsExportSimulated(true);
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'glb_format') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'turntable_anim') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isQ1Correct = q1Answer === 'glb_format';
  const isQ2Correct = q2Answer === 'turntable_anim';
  const hasTestedAnimations = Object.keys(testedAnimations).length >= 2;
  const isComplete = hasTestedAnimations && isExportSimulated && isQ1Correct && isQ2Correct;

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
              🎬
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {lang === 'en' ? 'Unit 2 • Lesson 2 (p. 32–33)' : 'Unitatea 2 • Lecția 2 (pag. 32–33)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 6/7' : 'Ecranul 6/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'Automatic 3D Video Animations & Export Formats (.GLB, .3MF)' 
                  : 'Animații Video Automate & Formate de Export 3D (.GLB, .3MF)'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Film className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Turntable, Swing, Jump & 3D Print (.3MF)' : 'Placă Turnantă, Salt & Imprimare (.3MF)'}</span>
          </div>
        </div>
      </div>

      {/* Interactive 3D Theater & Animation Cinema */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'en' ? 'Live 3D Animation Video Studio' : 'Studioul de Animație Video Paint 3D'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Test automatic motion presets generated by Paint 3D before video export!'
                : 'Alege o animație automată din Paint 3D pentru a vedea cum se mișcă modelul înainte de salvarea ca video!'}
            </p>
          </div>

          <div className="px-3 py-1 rounded-full text-xs font-mono font-bold border border-cyan-400/40 bg-cyan-950/40 text-cyan-300 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>Animație: {activeAnimation.toUpperCase()}</span>
          </div>
        </div>

        {/* 4 Motion Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {animationsList.map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => handleSelectAnimation(a.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeAnimation === a.id
                  ? 'bg-cyan-950/60 border-cyan-400 text-white ring-2 ring-cyan-400/30 shadow-lg'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-2xl mb-1">{a.icon}</div>
              <div className="text-xs font-bold text-white mb-0.5">{a.name.split(' ')[0]}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{a.desc.slice(0, 45)}...</div>
            </button>
          ))}
        </div>

        {/* Live Cinema Viewport with CSS 3D Keyframe Animations */}
        <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          {/* Spotlight aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Pedestal platform */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Animated Model */}
            <div
              className={`w-36 h-36 rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 border-4 border-white/80 shadow-2xl flex flex-col items-center justify-center text-white p-3 ${
                activeAnimation === 'turntable'
                  ? 'animate-[spin_4s_linear_infinite]'
                  : activeAnimation === 'swing'
                  ? 'animate-[wiggle_1.5s_ease-in-out_infinite]'
                  : activeAnimation === 'jump_turn'
                  ? 'animate-bounce'
                  : 'animate-pulse'
              }`}
            >
              <span className="text-5xl drop-shadow-lg mb-1">🚀</span>
              <span className="text-xs font-mono font-black uppercase text-slate-950 bg-white/90 px-2 py-0.5 rounded">
                Cosmic 3D
              </span>
            </div>

            {/* Pedestal shadow */}
            <div className="w-32 h-6 bg-black/60 rounded-full blur-md mt-4"></div>
            <div className="text-[11px] font-mono text-cyan-300 mt-2">
              🎬 {animationsList.find(a => a.id === activeAnimation)?.desc}
            </div>
          </div>
        </div>

        {/* 3D Export Options Matrix */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Formate Oficiale de Export Paint 3D (Apasă pentru a testa simularea de export):</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {exportFormats.map(fmt => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => handleSimulateExport(fmt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFormat === fmt.id
                    ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{fmt.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-700">
                      {fmt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{fmt.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>Exportă Fișier</span>
                  <span>⬇️ Descarcă</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            {hasTestedAnimations ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Animații video testate ({Object.keys(testedAnimations).length}/4)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Film className="w-4 h-4" /> Testează cel puțin 2 tipuri de animație
              </span>
            )}
            <span>•</span>
            {isExportSimulated ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Format de export simulat (.GLB / .3MF)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Download className="w-4 h-4" /> Apasă pe o opțiune de export de mai sus
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px]">Manual pag. 32–33</span>
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
            <QuestionHint hint={lang === 'en' ? '.GLB is the universal 3D standard for web and PowerPoint.' : 'Formatul .GLB este formatul tridimensional universal recunoscut de PowerPoint și browsere web.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which file format exports a complete 3D model that can be inserted directly into PowerPoint?'
              : 'Ce format de fișier exportat din Paint 3D permite inserarea modelului tridimensional direct într-un diapozitiv PowerPoint?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'glb_format', label: 'Formatul .GLB (sau .3MF pentru imprimante)' },
              { id: 'txt_format', label: 'Formatul text .TXT' },
              { id: 'wav_format', label: 'Formatul audio .WAV' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'glb_format'
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
                      ? 'Correct! .GLB preserves the mesh, textures, and lighting for interactive 3D presentations.'
                      : 'Corect! Formatul .GLB păstrează geometria 3D și texturile, permițând rotirea liberă a modelului în interiorul prezentării PowerPoint.')
                  : (lang === 'en'
                      ? 'Incorrect. .GLB is the primary 3D model format.'
                      : 'Incorect. Formatul oficial este .GLB (Graphics Language Transmission Format).')
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
            <QuestionHint hint={lang === 'en' ? 'Turntable rotates the model continuously on the horizontal plane.' : 'Placa turnantă (Turntable) rotește modelul la 360 de grade ca pe o tavă rotativă de expoziție.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What automatic animation preset rotates the 3D model in a continuous 360° circle?'
              : 'Ce tip de animație video automată rotește corpul 3D continuu la 360° pentru a-i prezenta toate laturile?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'turntable_anim', label: 'Placă turnantă (Turntable)' },
              { id: 'freeze_anim', label: 'Înghețare statică' },
              { id: 'blur_anim', label: 'Estompare neclară' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'turntable_anim'
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
                      ? 'Spot on! Turntable is the industry-standard presentation spin.'
                      : 'Exact! Placa turnantă (Turntable) este animația clasică folosită în muzee și prezentări pentru a roti exponatul în fața privitorului.')
                  : (lang === 'en'
                      ? 'Not quite. The animation preset is called Turntable (Placă turnantă).'
                      : 'Incorect. Animația din manual se numește Placă turnantă (Turntable).')
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
