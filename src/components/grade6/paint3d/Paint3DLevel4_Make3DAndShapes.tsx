import React, { useState } from 'react';
import { 
  Sparkles, 
  Box, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  Star, 
  Heart, 
  Circle, 
  Square, 
  Zap, 
  Wand2, 
  RotateCw,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface Paint3DLevel4Props {
  onCompletePage: (earnedScore: number) => void;
}

type Primitive3D = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'capsule';

export const Paint3DLevel4_Make3DAndShapes: React.FC<Paint3DLevel4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // "Make 3D" Interactive Extrusion State
  const [selected2DShape, setSelected2DShape] = useState<'star' | 'heart' | 'cloud'>('star');
  const [isExtruded3D, setIsExtruded3D] = useState<boolean>(false);
  const [selectedPrimitive, setSelectedPrimitive] = useState<Primitive3D>('cube');
  const [rotAngle, setRotAngle] = useState<number>(30);
  const [testedMake3D, setTestedMake3D] = useState<boolean>(false);
  const [testedPrimitives, setTestedPrimitives] = useState<Record<string, boolean>>({ cube: true });

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleSelect2DShape = (shape: 'star' | 'heart' | 'cloud') => {
    sounds.playClick();
    setSelected2DShape(shape);
    setIsExtruded3D(false);
  };

  const handleTriggerMake3D = () => {
    sounds.playRetro('powerup');
    setIsExtruded3D(true);
    setTestedMake3D(true);
  };

  const handleSelectPrimitive = (prim: Primitive3D) => {
    sounds.playRetro('coin');
    setSelectedPrimitive(prim);
    setTestedPrimitives(prev => ({ ...prev, [prim]: true }));
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'make_3d_btn') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'doodle_sharp_soft') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isQ1Correct = q1Answer === 'make_3d_btn';
  const isQ2Correct = q2Answer === 'doodle_sharp_soft';
  const hasExploredPrimitives = Object.keys(testedPrimitives).length >= 3;
  const isComplete = testedMake3D && hasExploredPrimitives && isQ1Correct && isQ2Correct;

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
              🪄
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {lang === 'en' ? 'Unit 2 • Lesson 2 (p. 31–32)' : 'Unitatea 2 • Lecția 2 (pag. 31–32)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 4/7' : 'Ecranul 4/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'Converting 2D Shapes to 3D & Geometric Primitives' 
                  : 'Transformarea 2D în 3D („Creare 3D”) & Corpuri Geometrice'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Wand2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{lang === 'en' ? 'Make 3D Button • Sharp & Soft Doodle' : 'Butonul Creare 3D • Doodle 3D'}</span>
          </div>
        </div>
      </div>

      {/* Two Essential Concepts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Butonul Creare 3D */}
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
            <Wand2 className="w-5 h-5 text-cyan-400" />
            <span>{lang === 'en' ? 'The "Make 3D" Magic Button' : 'Butonul Magic „Creare 3D” (Make 3D)'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'When you draw any 2D shape (star, heart, circle, polygon), clicking "Make 3D" in the right panel instantly inflates it with depth on the Z-axis, turning it into a manipulable 3D solid!'
              : 'După ce desenezi orice formă din Forme 2D (stea, inimă, cerc, poligon), în panoul din dreapta apare butonul „Creare 3D”. La o simplă apăsare, figura capătă instantaneu grosime pe axa Z și devine un corp solid!'}
          </p>
          <div className="p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-xs text-cyan-200">
            💡 <strong>Din manual (pag. 31):</strong> „Desenul plan este detașat de pânză și capătă ancorele de rotație spațială!”
          </div>
        </div>

        {/* Card 2: Doodle 3D */}
        <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-base">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>{lang === 'en' ? '3D Doodle: Sharp vs Soft Edge' : 'Instrumentul Doodle 3D: Două Stiluri'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Sharp Edge: extruded like a cutout wooden block with straight edges. Soft Edge: inflated like an airy pillow, cloud, or balloon with smooth rounded curves.'
              : 'Muchie ascuțită (Sharp edge): corpul este extrudat cu margini drepte ca o piesă decupată din lemn. Muchie moale (Soft edge): corpul este umflat ca o pernă sau un balon, având margini curbate și rotunjite.'}
          </p>
          <div className="p-2.5 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-indigo-200">
            ☁️ <strong>Ideal pentru:</strong> Nori, perne, stânci, personaje organice și animale de pluș.
          </div>
        </div>
      </div>

      {/* Interactive "Make 3D" Extrusion Laboratory */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'en' ? 'Live "Make 3D" Extrusion Simulator' : 'Simulatorul Interactiv „Creare 3D” (Extrudare Live)'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Pick a 2D flat shape and click the "Make 3D" button to see it gain volume and rotate in 3D!'
                : 'Alege o formă plană și apasă pe butonul „Creare 3D” pentru a-i da volum și a o roti în spațiu!'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Stare:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
              isExtruded3D
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
            }`}>
              {isExtruded3D ? '✅ Corp 3D Volumetric' : '📄 Desen 2D Plat'}
            </span>
          </div>
        </div>

        {/* 2D Shape Selectors & "Make 3D" Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Controls Box (5 Cols) */}
          <div className="md:col-span-5 space-y-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                1. Alege o Formă 2D Plană:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'star', label: 'Stea', icon: '⭐' },
                  { id: 'heart', label: 'Inimă', icon: '❤️' },
                  { id: 'cloud', label: 'Nor', icon: '☁️' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect2DShape(item.id as 'star' | 'heart' | 'cloud')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selected2DShape === item.id
                        ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-bold">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Magic Action Button: CREARE 3D */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                2. Apasă Butonul din Panoul Paint 3D:
              </label>
              <button
                type="button"
                onClick={handleTriggerMake3D}
                disabled={isExtruded3D}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                  isExtruded3D
                    ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white active:scale-95 shadow-cyan-500/25 ring-2 ring-cyan-400/40'
                }`}
              >
                <Wand2 className="w-5 h-5 text-amber-300" />
                <span>{isExtruded3D ? 'Volum 3D Generat!' : 'Creare 3D (Make 3D)'}</span>
              </button>
            </div>

            {/* Rotation slider if 3D */}
            {isExtruded3D && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Rotire Spațială (Yaw)</span>
                  <span className="text-cyan-300">{rotAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={rotAngle}
                  onChange={(e) => setRotAngle(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Interactive Visual Canvas (7 Cols) */}
          <div className="md:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div style={{ perspective: '800px' }} className="py-8 relative z-10">
              <div
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isExtruded3D ? `rotateY(${rotAngle}deg) rotateX(15deg)` : 'none',
                  transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                }}
                className={`relative flex items-center justify-center ${
                  isExtruded3D ? 'animate-scaleUp' : ''
                }`}
              >
                {/* 3D Extruded Layers Simulation */}
                {isExtruded3D && (
                  <>
                    {/* Fake Depth Layer behind */}
                    <div
                      style={{ transform: 'translateZ(-30px)' }}
                      className="absolute inset-0 bg-indigo-950 border-4 border-indigo-700/80 rounded-3xl blur-[1px] opacity-90 scale-95"
                    ></div>
                    {/* Mid Depth Layer */}
                    <div
                      style={{ transform: 'translateZ(-15px)' }}
                      className="absolute inset-0 bg-cyan-900 border-4 border-cyan-600 rounded-3xl opacity-80"
                    ></div>
                  </>
                )}

                {/* Front Face of the Object */}
                <div
                  style={{ transform: isExtruded3D ? 'translateZ(15px)' : 'none' }}
                  className={`w-40 h-40 rounded-3xl flex flex-col items-center justify-center text-center p-3 shadow-2xl transition-all ${
                    isExtruded3D
                      ? 'bg-gradient-to-br from-cyan-400 to-indigo-600 border-4 border-white text-slate-950 ring-4 ring-cyan-400/50'
                      : 'bg-slate-900 border-2 border-slate-700 text-cyan-300'
                  }`}
                >
                  <span className="text-5xl mb-1 drop-shadow-md">
                    {selected2DShape === 'star' ? '⭐' : selected2DShape === 'heart' ? '💖' : '☁️'}
                  </span>
                  <span className="text-xs font-mono font-black uppercase">
                    {selected2DShape.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono mt-0.5 opacity-90">
                    {isExtruded3D ? '3D Solid Model' : '2D Flat Stroke'}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-xs font-mono text-slate-400 text-center">
              {isExtruded3D
                ? '✨ Figura are acum volum real pe axa Z și poate fi privită din toate părțile!'
                : 'Forma este încă plană (2D). Apasă „Creare 3D” pentru a-i da adâncime!'}
            </div>
          </div>
        </div>

        {/* 3D Geometric Primitives Gallery */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>Corpuri Geometrice 3D Gata Făcute (Apasă pe fiecare pentru a testa):</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {[
              { id: 'cube', name: 'Cub', icon: '🧊', desc: 'Hexaedru cu 6 fețe pătrate' },
              { id: 'sphere', name: 'Sferă', icon: '⚽', desc: 'Suprafață curbă fără colțuri' },
              { id: 'cylinder', name: 'Cilindru', icon: '🛢️', desc: 'Baze rotunde paralele' },
              { id: 'cone', name: 'Con', icon: '🍦', desc: 'Bază rotundă și vârf ascuțit' },
              { id: 'torus', name: 'Tor (Donut)', icon: '🍩', desc: 'Inel volumetric circular' },
              { id: 'capsule', name: 'Capsulă', icon: '💊', desc: 'Cilindru cu capete rotunjite' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPrimitive(item.id as Primitive3D)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedPrimitive === item.id
                    ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/30 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs font-bold">{item.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            {testedMake3D ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Butonul „Creare 3D” testat!
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Wand2 className="w-4 h-4" /> Apasă pe „Creare 3D (Make 3D)”
              </span>
            )}
            <span>•</span>
            {hasExploredPrimitives ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Corpuri geometrice explorate ({Object.keys(testedPrimitives).length}/6)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Box className="w-4 h-4" /> Testează cel puțin 3 corpuri geometrice ({Object.keys(testedPrimitives).length}/3)
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px]">Manual pag. 31–32</span>
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
            <QuestionHint hint={lang === 'en' ? 'The button is called "Make 3D" (Creare 3D) in the right side panel.' : 'Butonul se numește „Creare 3D” și apare în panoul din dreapta după desenarea unei forme 2D.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What button in the right panel transforms a flat 2D shape into a solid 3D object?'
              : 'Ce buton din panoul din dreapta transformă o formă geometrică plană 2D într-un corp 3D cu volum?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'make_3d_btn', label: 'Creare 3D (Make 3D)' },
              { id: 'print_btn', label: 'Tipărire pe hârtie (Print)' },
              { id: 'crop_btn', label: 'Decupare (Crop)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'make_3d_btn'
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
                      ? 'Correct! "Make 3D" gives thickness and depth to any 2D vector shape.'
                      : 'Corect! Butonul „Creare 3D” adaugă instant grosime pe axa Z, permițând rotirea liberă a formei în spațiu.')
                  : (lang === 'en'
                      ? 'Incorrect. The button is specifically named "Make 3D" (Creare 3D).'
                      : 'Incorect. Butonul dedicat din manual este „Creare 3D”.')
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
            <QuestionHint hint={lang === 'en' ? '3D Doodle comes in 2 variants: sharp edge and soft edge.' : 'Instrumentul Doodle 3D are două moduri: muchie ascuțită și muchie moale (rotunjită ca o pernă).'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What are the two drawing modes available for the 3D Doodle tool?'
              : 'Care sunt cele două moduri de desenare disponibile pentru unealta Doodle 3D?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'doodle_sharp_soft', label: 'Muchie ascuțită (Sharp edge) și Muchie moale (Soft edge)' },
              { id: 'wood_metal', label: 'Lemn și Metal lichid' },
              { id: 'day_night', label: 'Mod Zi și Mod Noapte' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'doodle_sharp_soft'
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
                      ? 'Spot on! Sharp edges create extruded prisms, while soft edges create cushion-like inflated models.'
                      : 'Exact! Muchia ascuțită creează forme tăiate drept, în timp ce muchia moale rotunjește conturul organic ca o pernă sau un norișor.')
                  : (lang === 'en'
                      ? 'Not quite. The two styles are Sharp Edge and Soft Edge.'
                      : 'Incorect. Cele două stiluri din manual sunt Muchie ascuțită și Muchie moale.')
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
