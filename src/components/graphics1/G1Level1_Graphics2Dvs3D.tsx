import React, { useState, useEffect } from 'react';
import { Palette, Box, Layers, CheckCircle2, XCircle, Sparkles, BookOpen, FileImage, Image as ImageIcon, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuestionHint } from '../internet1/QuestionHint';
import { AnswerExplanation } from '../internet1/AnswerExplanation';
import { PageNavigationFooter } from '../internet1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';
import { sounds } from '../../utils/audio';

interface G1Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const G1Level1_Graphics2Dvs3D: React.FC<G1Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // 3D Depth simulator state
  const [depthValue, setDepthValue] = useState<number>(35);
  const [rotationAngle, setRotationAngle] = useState<number>(20);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Exercise 1: 2D vs 3D Dimension (Manual pag. 42)
  // Correct: 'adancime' (depth is the 3rd dimension)
  const [q1Answer, setQ1Answer] = useState<string | null>(null);

  // Exercise 2: Image Extensions (Manual pag. 42)
  // Which one is NOT a graphic image file? Correct: '.pptx' or '.mp4'
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);

  // Exercise 3: Graphic Editors Identification (Manual pag. 42)
  // Which software are graphic editors? (Paint, GIMP, Photoshop, Inkscape, Tux Paint)
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  // Exercise 4: Transparency & Compression Knowledge
  const [q4Answer, setQ4Answer] = useState<string | null>(null);

  // Cooldown State
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

  // Evaluator logic
  const isQ1Correct = q1Answer === 'adancime';

  const handleSelectQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    sounds.playClick();
    setQ1Answer(id);
    if (id === 'adancime') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleSelectQ3 = (id: string) => {
    if ((cooldowns.q3 || 0) > 0) return;
    sounds.playClick();
    setQ3Answer(id);
    if (id === 'editors_suite') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q3: 5 }));
    }
  };

  const handleSelectQ4 = (id: string) => {
    if ((cooldowns.q4 || 0) > 0) return;
    sounds.playClick();
    setQ4Answer(id);
    if (id === 'png_transparency') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q4: 5 }));
    }
  };
  
  // For Q2, player selects image formats from mixed list: .png, .jpg, .bmp, .gif, .mp4, .txt
  const correctImageExtensions = ['.png', '.jpg', '.bmp', '.gif'];
  const isQ2Correct = 
    correctImageExtensions.every(ext => selectedExtensions.includes(ext)) &&
    !selectedExtensions.includes('.mp4') &&
    !selectedExtensions.includes('.txt');

  const isQ3Correct = q3Answer === 'editors_suite';
  const isQ4Correct = q4Answer === 'png_transparency';

  const totalQuestions = 4;
  const correctCount =
    (isQ1Correct ? 1 : 0) +
    (isQ2Correct ? 1 : 0) +
    (isQ3Correct ? 1 : 0) +
    (isQ4Correct ? 1 : 0);

  const pointsPerQuestion = 4; // 16 pts max for page 1
  const pageScore = Math.min(16, correctCount * pointsPerQuestion);

  const toggleExtension = (ext: string) => {
    sounds.playClick();
    setSelectedExtensions((prev) =>
      prev.includes(ext) ? prev.filter((item) => item !== ext) : [...prev, ext]
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-white pb-12 select-none">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {lang === 'en' ? 'Unit 4 • Graphics Editing' : 'Unitatea 4 • Editare Grafică'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Lesson 1 • Page 1 of 6 (Textbook p. 42)' : 'Lecția 1 • Pagina 1 din 6 (Manual pag. 42)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'en' ? '2D & 3D Concepts' : 'Noțiuni Grafică 2D & 3D'}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide flex items-center gap-3">
          <Palette className="w-8 h-8 text-purple-400 shrink-0" />
          <span>{lang === 'en' ? '1. Graphic Editor & 2D vs 3D Graphics' : '1. Editor Grafic & Grafica 2D vs 3D'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          {lang === 'en'
            ? 'Discover what defines a 2D image versus a 3D model, explore essential graphic software (Paint, GIMP, Photoshop, Inkscape), and learn graphic file extensions (.png, .jpg, .bmp, .gif).'
            : 'Descoperă ce definește o imagine în două dimensiuni (2D) față de un model tridimensional (3D), explorează programele grafice esențiale (Paint, GIMP, Photoshop, Inkscape) și recunoaște extensiile fișierelor de imagine.'}
        </p>
      </div>

      {/* Interactive Theory Block 1: 2D vs 3D Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Box className="w-5 h-5 text-purple-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {lang === 'en' ? 'Interactive Lab: 2D (Flat) vs 3D (Spatial) Representation' : 'Laborator Interactiv: Reprezentare 2D (Plană) vs 3D (Spațială)'}
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
            {lang === 'en' ? 'Fig. 1 & Fig. 2 Textbook p. 42' : 'Fig. 1 & Fig. 2 Manual pag. 42'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20">
              <span className="font-bold text-purple-300 block mb-1">
                📐 {lang === 'en' ? '2D Image (Two Dimensions):' : 'Imaginea 2D (Două dimensiuni):'}
              </span>
              {lang === 'en'
                ? 'Defined by Width (Lățime) and Height (Înălțime). Drawings created on paper or regular computer screens are two-dimensional (flat).'
                : 'Este definită de Lățime și Înălțime. Desenele create pe hârtie sau pe ecranul unui calculator clasic sunt desene în două dimensiuni, numite pe scurt 2D (Fig. 1).'}
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
              <span className="font-bold text-cyan-300 block mb-1">
                🧊 {lang === 'en' ? '3D Image (Three Dimensions):' : 'Imaginea 3D (Trei dimensiuni):'}
              </span>
              {lang === 'en'
                ? 'If a representation possesses a third dimension—Depth (Adâncime)—it is called a three-dimensional or 3D image (Fig. 2).'
                : 'Dacă o reprezentare posedă și o a treia dimensiune, și anume Adâncimea, ea se numește imagine în trei dimensiuni sau 3D (Fig. 2).'}
            </div>

            {/* Controls */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{lang === 'en' ? 'Depth Slider (Adâncime Z):' : 'Potențiometru Adâncime (A 3-a dimensiune):'}</span>
                <span className="text-purple-300 font-bold">{depthValue} px</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={depthValue}
                onChange={(e) => setDepthValue(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-2">
                <span>{lang === 'en' ? 'Perspective Angle:' : 'Unghi de Rotație Perspectivă:'}</span>
                <span className="text-cyan-300 font-bold">{rotationAngle}°</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Live Visual Canvas */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden shadow-inner">
            <div className="absolute top-3 left-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>{depthValue === 0 ? 'Mod 2D (Doar Lățime × Înălțime)' : 'Mod 3D (Lățime × Înălțime × Adâncime)'}</span>
            </div>

            {/* SVG Interactive Cube / Square */}
            <div className="relative mt-4 flex items-center justify-center">
              <svg width="240" height="200" viewBox="0 0 240 200" className="drop-shadow-2xl">
                {/* 3D Depth faces if depth > 0 */}
                {depthValue > 0 && (
                  <>
                    {/* Top Face */}
                    <polygon
                      points={`60,70 ${60 + depthValue},${70 - depthValue * 0.4} ${160 + depthValue},${70 - depthValue * 0.4} 160,70`}
                      fill="#8b5cf6"
                      fillOpacity="0.45"
                      stroke="#a78bfa"
                      strokeWidth="2"
                    />
                    {/* Side Face */}
                    <polygon
                      points={`160,70 ${160 + depthValue},${70 - depthValue * 0.4} ${160 + depthValue},${170 - depthValue * 0.4} 160,170`}
                      fill="#6d28d9"
                      fillOpacity="0.65"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />
                  </>
                )}

                {/* Front Face (2D Square) */}
                <rect
                  x="60"
                  y="70"
                  width="100"
                  height="100"
                  fill="#c084fc"
                  fillOpacity="0.3"
                  stroke="#c084fc"
                  strokeWidth="3"
                  rx="4"
                />

                {/* Dimension Arrows */}
                <line x1="60" y1="185" x2="160" y2="185" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="110" y="196" fill="#38bdf8" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  {lang === 'en' ? 'Width (Lățime)' : 'Lățime'}
                </text>

                <line x1="45" y1="170" x2="45" y2="70" stroke="#34d399" strokeWidth="2" />
                <text x="35" y="125" fill="#34d399" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold" transform="rotate(-90 35 125)">
                  {lang === 'en' ? 'Height (Înălțime)' : 'Înălțime'}
                </text>

                {depthValue > 0 && (
                  <text
                    x={165 + depthValue * 0.6}
                    y={65 - depthValue * 0.2}
                    fill="#f59e0b"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {lang === 'en' ? 'Depth (Adâncime)' : 'Adâncime'}
                  </text>
                )}
              </svg>
            </div>

            <div className="mt-2 text-xs font-mono text-center">
              {depthValue === 0 ? (
                <span className="text-emerald-400 font-bold">Fig. 1: Pătrat 2D (Desen clasic pe hârtie)</span>
              ) : (
                <span className="text-amber-300 font-bold">Fig. 2: Cub 3D (Corp geometric în spațiu)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Theory Block 2: Software Suite & File Extensions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <FileImage className="w-5 h-5 text-purple-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            {lang === 'en' ? 'Graphic Editors & File Format Extensions' : 'Editoare Grafice & Extensii de Fișiere'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Paint', desc: 'Editor simplu integrat în Windows', icon: '🎨', badge: 'Windows' },
            { name: 'Paint.net', desc: 'Editare straturi & filtre', icon: '🖌️', badge: 'Free' },
            { name: 'Inkscape', desc: 'Grafică vectorială (.svg)', icon: '📐', badge: 'Vectorial' },
            { name: 'GIMP', desc: 'Editor puternic open-source', icon: '🦊', badge: 'Open-Source' },
            { name: 'Photoshop', desc: 'Standard profesional foto', icon: '💎', badge: 'Pro' },
            { name: 'Tux Paint', desc: 'Editor prietenos pentru elevi', icon: '🐧', badge: 'Educațional' },
          ].map((app) => (
            <div key={app.name} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center hover:border-purple-500/50 transition">
              <span className="text-2xl mb-1">{app.icon}</span>
              <span className="text-xs font-bold text-white">{app.name}</span>
              <span className="text-[10px] font-mono text-purple-300 mt-0.5 px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/50">
                {app.badge}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 leading-tight">{app.desc}</span>
            </div>
          ))}
        </div>

        {/* Extensions Info */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl shrink-0">
              🖼️
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block">Extensiile uzuale din Paint (Manual pag. 42):</span>
              <span className="font-mono text-emerald-400">.png</span> (calitate înaltă, transparență),{' '}
              <span className="font-mono text-cyan-400">.jpg / .jpeg</span> (fotografii comprimate),{' '}
              <span className="font-mono text-amber-400">.bmp</span> (hartă de biți necomprimată),{' '}
              <span className="font-mono text-purple-400">.gif</span> (animații scurte, 256 culori),{' '}
              <span className="font-mono text-indigo-400">.tiff</span> (tipografie profesională).
            </div>
          </div>
        </div>
      </div>

      {/* Practical Tasks & Exercises */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {lang === 'en' ? 'Knowledge Check & Interactive Quiz' : 'Exerciții Practice de Fixare a Cunoștințelor'}
            </h2>
          </div>
          <span className="text-xs font-mono text-amber-300">
            {correctCount} / {totalQuestions} {lang === 'en' ? 'Solved' : 'Rezolvate corect'}
          </span>
        </div>

        {/* Exercise 1 */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
              {lang === 'en' ? 'Exercise 1 • Dimensions' : 'Exercițiul 1 • Dimensiunile reprezentării (Manual pag. 42)'}
            </span>
            <QuestionHint
              title="Indiciu Dimensiuni 2D vs 3D"
              content="O coală de desen are două dimensiuni: lățime și înălțime. Pentru a deveni un obiect 3D în spațiu (cum este un cub sau un scaun), acesta trebuie să aibă și adâncime (grosime în spațiu)."
            />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is the third dimension that turns a 2D flat drawing into a 3D spatial object?'
              : 'Care este a treia dimensiune care transformă un desen plat 2D într-un obiect spațial 3D?'}
          </p>

          {cooldowns.q1 > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza diferența dintre 2D (suprafață) și 3D (spațiu)."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on the difference between 2D and 3D."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {[
              { id: 'greutate', label: 'Greutatea obiectului (kg)' },
              { id: 'adancime', label: 'Adâncimea (spațială)' },
              { id: 'culoare', label: 'Culoarea de umplere' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleSelectQ1(opt.id)}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${
                  (cooldowns.q1 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q1Answer === opt.id
                    ? opt.id === 'adancime'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {q1Answer === opt.id && (
                  opt.id === 'adancime' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />
                )}
              </button>
            ))}
          </div>

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              correctExplanation="Exact! O imagine 2D are lățime și înălțime (ca pe o foaie de hârtie). Dacă reprezentarea posedă și o a treia dimensiune, adâncimea, ea se numește imagine în trei dimensiuni (3D)!"
              incorrectExplanation="Răspuns incorect. Conform manualului (pag. 42), cele două dimensiuni ale desenului 2D sunt lățimea și înălțimea, iar a treia dimensiune specifică 3D este adâncimea."
            />
          )}
        </div>

        {/* Exercise 2: Extensions Picker */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
              {lang === 'en' ? 'Exercise 2 • Image Extensions' : 'Exercițiul 2 • Extensii de fișiere grafice (Manual pag. 42)'}
            </span>
            <QuestionHint
              title="Indiciu Extensii Grafice"
              content="Aplicația Paint poate salva fișiere grafice cu extensiile: .png, .jpg, .bmp, .gif, .tiff. Atenție: fișierele .mp4 sunt video, iar .txt sunt documente text simple!"
            />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Select ALL the valid graphic image extensions supported by Paint (click to toggle):'
              : 'Selectează TOATE extensiile valide pentru fișiere grafice utilizate de Paint (apasă pe fiecare pentru selectare):'}
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {['.png', '.mp4', '.jpg', '.txt', '.bmp', '.gif'].map((ext) => {
              const isSelected = selectedExtensions.includes(ext);
              const isImage = correctImageExtensions.includes(ext);

              return (
                <button
                  key={ext}
                  onClick={() => toggleExtension(ext)}
                  className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? isImage
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{ext}</span>
                  {isSelected && (isImage ? '✓' : '✗')}
                </button>
              );
            })}
          </div>

          {selectedExtensions.length >= 4 && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              correctExplanation="Excelent! Extensiile .png, .jpg, .bmp și .gif sunt destinate imaginilor grafice. .mp4 este video, iar .txt este text simplu."
              incorrectExplanation="Atenție la extensii! Asigură-te că ai selectat .png, .jpg, .bmp și .gif, și nu ai inclus .mp4 (video) sau .txt (text)."
            />
          )}
        </div>

        {/* Exercise 3: Graphic Software Identification */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
              {lang === 'en' ? 'Exercise 3 • Graphic Editors' : 'Exercițiul 3 • Exemple de editoare grafice (Manual pag. 42)'}
            </span>
            <QuestionHint
              title="Indiciu Programe Grafice"
              content="Reține exemplele din caseta „Descoperiți” de la pagina 42: Paint, Paint.net, Inkscape, GIMP, Adobe Photoshop, Tux Paint."
            />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which of the following suites contains ONLY genuine graphic editors?'
              : 'Care dintre următoarele grupuri conține EXCLUSIV editoare grafice autentice?'}
          </p>

          {cooldowns.q3 > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q3}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza exemplele de editoare grafice din manual (pag. 42)."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on graphic editors."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'wrong_wordpad', label: 'Paint, WordPad, Skype, Calculator' },
              { id: 'editors_suite', label: 'Paint, Paint.net, Inkscape, GIMP, Adobe Photoshop, Tux Paint' },
              { id: 'wrong_browser', label: 'Google Chrome, Paint, File Explorer' },
              { id: 'wrong_media', label: 'VLC Media Player, Windows, Photoshop' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={(cooldowns.q3 || 0) > 0}
                onClick={() => handleSelectQ3(opt.id)}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${
                  (cooldowns.q3 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q3Answer === opt.id
                    ? opt.id === 'editors_suite'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {q3Answer === opt.id && (
                  opt.id === 'editors_suite' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              correctExplanation="Foarte bine! Paint, Paint.net, Inkscape, GIMP, Photoshop și Tux Paint sunt editoare grafice dedicate pentru crearea și prelucrarea imaginilor."
              incorrectExplanation="Grup incorect. WordPad este procesor de text, Skype este comunicare, iar Chrome este browser web. Editoarele grafice sunt cele din caseta manualului pag. 42."
            />
          )}
        </div>

        {/* Exercise 4: Format Features */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
              {lang === 'en' ? 'Exercise 4 • Format Utility' : 'Exercițiul 4 • Particularități de format'}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Why is the .PNG format especially preferred for web graphics and logos?'
              : 'De ce este formatul .PNG preferat adesea pentru sigle, pictograme și desene pe fundaluri colorate?'}
          </p>

          {cooldowns.q4 > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q4}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza caracteristicile formatului .PNG (transparență)."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on .PNG transparency."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'png_transparency', label: 'Suportă fundal transparent și păstrează calitatea liniilor fără estompare' },
              { id: 'wrong_sound', label: 'Permite redarea automată de muzică și sunete în fundal' },
              { id: 'wrong_3d', label: 'Transformă automat orice desen în obiect tridimensional 3D' },
              { id: 'wrong_size', label: 'Șterge automat culorile din prim-plan' },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={(cooldowns.q4 || 0) > 0}
                onClick={() => handleSelectQ4(opt.id)}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${
                  (cooldowns.q4 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q4Answer === opt.id
                    ? opt.id === 'png_transparency'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {q4Answer === opt.id && (
                  opt.id === 'png_transparency' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page Navigation Footer */}
      <PageNavigationFooter
        score={pageScore}
        totalPoints={16}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={correctCount >= 2}
        onProceed={() => {
          sounds.playCorrect();
          onCompletePage(pageScore);
        }}
      />
    </div>
  );
};
