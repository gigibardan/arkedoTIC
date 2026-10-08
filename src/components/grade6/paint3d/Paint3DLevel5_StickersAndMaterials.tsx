import React, { useState } from 'react';
import { 
  Smile, 
  Sparkles, 
  Palette, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  Stamp, 
  Eye, 
  Star, 
  Circle,
  Gem
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface Paint3DLevel5Props {
  onCompletePage: (earnedScore: number) => void;
}

type MaterialType = 'matte' | 'gloss' | 'dull_metal' | 'glossy_metal';

interface StickerItem {
  id: string;
  name: string;
  emoji: string;
}

export const Paint3DLevel5_StickersAndMaterials: React.FC<Paint3DLevel5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Material & Sticker Studio State
  const [activeMaterial, setActiveMaterial] = useState<MaterialType>('matte');
  const [appliedStickers, setAppliedStickers] = useState<StickerItem[]>([]);
  const [testedMaterials, setTestedMaterials] = useState<Record<string, boolean>>({ matte: true });

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const materialsInfo = [
    {
      id: 'matte' as MaterialType,
      name: 'Mat (Matte)',
      desc: 'Fără luciu sau reflexie. Lumina este absorbită uniform (lemn nefinisat, carton, lut, cauciuc).',
      highlightStyle: 'bg-gradient-to-br from-slate-400 to-slate-600 shadow-inner',
      sphereFilter: 'brightness-90 contrast-100'
    },
    {
      id: 'gloss' as MaterialType,
      name: 'Lucios (Gloss)',
      desc: 'Suprafață netedă cu o strălucire speculară intensă (plastic lustruit, porțelan, lac auto).',
      highlightStyle: 'bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-600 shadow-lg ring-2 ring-white/50',
      sphereFilter: 'brightness-110 contrast-125'
    },
    {
      id: 'dull_metal' as MaterialType,
      name: 'Metal Plictisitor (Dull Metal)',
      desc: 'Metal mat sablat, cu reflexie metalică difuză și margini umbrite (aluminiu, titan mat, fier forjat).',
      highlightStyle: 'bg-gradient-to-br from-zinc-300 via-stone-400 to-zinc-700 shadow-md',
      sphereFilter: 'brightness-95 contrast-140 sepia-20'
    },
    {
      id: 'glossy_metal' as MaterialType,
      name: 'Metal Lucios (Glossy Metal)',
      desc: 'Efect de oglindă cromată cu reflexii spectaculoase și contrast extrem (crom, argint, aur șlefuit).',
      highlightStyle: 'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-700 ring-2 ring-amber-300 shadow-2xl',
      sphereFilter: 'brightness-125 contrast-150 saturate-150'
    }
  ];

  const stickersCatalog: StickerItem[] = [
    { id: 'eyes', name: 'Ochi Amuzanti', emoji: '👀' },
    { id: 'glasses', name: 'Ochelari Cool', emoji: '🕶️' },
    { id: 'smile', name: 'Zâmbet', emoji: '👄' },
    { id: 'star_badge', name: 'Insignă Stea', emoji: '⭐' },
    { id: 'texture_wood', name: 'Textură Lemn', emoji: '🪵' },
    { id: 'texture_marble', name: 'Textură Marmură', emoji: '🏛️' }
  ];

  const handleSelectMaterial = (mat: MaterialType) => {
    sounds.playRetro('coin');
    setActiveMaterial(mat);
    setTestedMaterials(prev => ({ ...prev, [mat]: true }));
  };

  const handleApplySticker = (st: StickerItem) => {
    sounds.playRetro('powerup');
    if (!appliedStickers.find(s => s.id === st.id)) {
      setAppliedStickers(prev => [...prev, st]);
    }
  };

  const handleClearStickers = () => {
    sounds.playClick();
    setAppliedStickers([]);
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'texture_wrap') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'four_materials') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isQ1Correct = q1Answer === 'texture_wrap';
  const isQ2Correct = q2Answer === 'four_materials';
  const hasTestedMaterials = Object.keys(testedMaterials).length >= 2;
  const hasAppliedAtLeastOneSticker = appliedStickers.length >= 1;
  const isComplete = hasTestedMaterials && hasAppliedAtLeastOneSticker && isQ1Correct && isQ2Correct;

  const handleFinish = () => {
    if (isComplete) {
      sounds.playVictory();
      onCompletePage(100);
    }
  };

  const activeMatInfo = materialsInfo.find(m => m.id === activeMaterial) || materialsInfo[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {lang === 'en' ? 'Unit 2 • Lesson 2 (p. 32–33)' : 'Unitatea 2 • Lecția 2 (pag. 32–33)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 5/7' : 'Ecranul 5/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'Stickers, Surface Wrapping & The 4 Material Finishes' 
                  : 'Stickere, Mularea pe Suprafețe 3D & Cele 4 Tipuri de Materiale'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Gem className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Matte • Gloss • Dull Metal • Glossy Metal' : 'Mat • Lucios • Metal Mat • Metal Lucios'}</span>
          </div>
        </div>
      </div>

      {/* Theory Guide: Material Finishes in Paint 3D */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {materialsInfo.map(m => (
          <div 
            key={m.id}
            className={`p-4 rounded-2xl border transition-all ${
              activeMaterial === m.id
                ? 'bg-slate-900 border-cyan-400 shadow-xl ring-2 ring-cyan-400/30'
                : 'bg-slate-900/80 border-slate-700/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">{m.name}</span>
              <div className={`w-5 h-5 rounded-full border border-white/40 ${m.highlightStyle}`}></div>
            </div>
            <p className="text-xs text-slate-300 leading-snug">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive Material & Sticker Wrap Studio */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'en' ? 'Interactive 3D Sticker & Material Wrapping Studio' : 'Atelierul Interactiv de Stickere & Finisaje 3D'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Select a material finish and click stickers to wrap them onto the 3D sphere!'
                : 'Alege un finisaj de material și apasă pe stickere pentru a le mula pe sfera 3D!'}
            </p>
          </div>

          {appliedStickers.length > 0 && (
            <button
              type="button"
              onClick={handleClearStickers}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700 text-xs font-mono text-slate-400 hover:text-white transition cursor-pointer"
            >
              Curăță Stickerele ({appliedStickers.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls: Material & Stickers Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            {/* 1. Pick Material */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Selectează Finisajul de Material:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {materialsInfo.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMaterial(m.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      activeMaterial === m.id
                        ? 'bg-cyan-950/60 border-cyan-400 text-white ring-2 ring-cyan-400/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${m.highlightStyle} shrink-0`}></div>
                    <span className="truncate">{m.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pick Stickers */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Aplică Stickere pe Corpul 3D:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {stickersCatalog.map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleApplySticker(st)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-400 text-center transition-all cursor-pointer group"
                  >
                    <div className="text-2xl group-hover:scale-125 transition-transform">{st.emoji}</div>
                    <div className="text-[10px] font-mono text-slate-300 mt-1 truncate">{st.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-cyan-950/30 rounded-xl border border-cyan-500/20 text-[11px] text-cyan-300">
              💡 <strong>Mulare 3D:</strong> În Paint 3D, stickerele se mulează automat pe curbura sferei, nefiind doar un desen drept!
            </div>
          </div>

          {/* Canvas Display: 3D Sphere with Material & Stickers (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
            {/* Background 3D Grid Guide */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

            {/* Simulated 3D Sphere */}
            <div className="relative py-6 flex flex-col items-center justify-center">
              <div
                className={`w-48 h-48 rounded-full relative flex items-center justify-center transition-all duration-300 shadow-2xl ${activeMatInfo.sphereFilter}`}
                style={{
                  background: activeMaterial === 'matte'
                    ? 'radial-gradient(circle at 35% 30%, #38bdf8 0%, #0369a1 50%, #082f49 90%)'
                    : activeMaterial === 'gloss'
                    ? 'radial-gradient(circle at 30% 25%, #ffffff 0%, #38bdf8 25%, #0284c7 60%, #0c4a6e 100%)'
                    : activeMaterial === 'dull_metal'
                    ? 'radial-gradient(circle at 35% 30%, #e2e8f0 0%, #64748b 50%, #1e293b 95%)'
                    : 'radial-gradient(circle at 30% 25%, #fffbeb 0%, #fbbf24 35%, #b45309 70%, #451a03 100%)',
                  boxShadow: activeMaterial === 'gloss' || activeMaterial === 'glossy_metal'
                    ? '0 25px 50px -12px rgba(56, 189, 248, 0.4), inset -10px -10px 20px rgba(0,0,0,0.6)'
                    : '0 20px 40px -10px rgba(0,0,0,0.5), inset -15px -15px 30px rgba(0,0,0,0.5)'
                }}
              >
                {/* Specular Glint Highlight */}
                {(activeMaterial === 'gloss' || activeMaterial === 'glossy_metal') && (
                  <div className="absolute top-5 left-8 w-12 h-6 bg-white/70 rounded-full blur-[2px] rotate-[-25deg] pointer-events-none"></div>
                )}

                {/* Wrapped Stickers on the 3D surface */}
                <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 p-4 text-center max-w-[150px]">
                  {appliedStickers.length > 0 ? (
                    appliedStickers.map(st => (
                      <span 
                        key={st.id} 
                        className="text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] animate-scaleUp select-none"
                        title={st.name}
                      >
                        {st.emoji}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] font-mono text-white/80 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm select-none">
                      Apasă pe un sticker!
                    </span>
                  )}
                </div>
              </div>

              {/* Sphere Shadow on Canvas */}
              <div className="w-40 h-6 bg-black/60 rounded-full blur-md mt-2"></div>
            </div>

            <div className="text-xs font-mono text-slate-400 mt-2 text-center">
              Finisaj activ: <strong className="text-cyan-300">{activeMatInfo.name}</strong> • Stickere aplicate: <strong className="text-amber-300">{appliedStickers.length}</strong>
            </div>
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            {hasTestedMaterials ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Materiale testate ({Object.keys(testedMaterials).length}/4)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Palette className="w-4 h-4" /> Schimbă finisajul materialului
              </span>
            )}
            <span>•</span>
            {hasAppliedAtLeastOneSticker ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Stickere mulate ({appliedStickers.length})
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Smile className="w-4 h-4" /> Aplică cel puțin un sticker pe corpul 3D
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
            <QuestionHint hint={lang === 'en' ? 'Stickers curve around 3D surfaces automatically.' : 'Stickerele se mulează automat pe curbura corpului 3D.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What happens when you drag a 2D sticker over a 3D curved sphere in Paint 3D?'
              : 'Ce se întâmplă atunci când aplici un sticker 2D pe suprafața unei sfere 3D în Paint 3D?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'texture_wrap', label: 'Stickerul se mulează automat pe curbura sferei, devenind o textură 3D pe suprafață' },
              { id: 'cut_sphere', label: 'Sfera se sparge în două jumătăți' },
              { id: 'turns_black', label: 'Întreaga pânză devine neagră' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'texture_wrap'
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
                      ? 'Correct! Paint 3D calculates texture coordinates (UV mapping) so stickers adhere to 3D curves perfectly.'
                      : 'Corect! Paint 3D realizează automat mularea texturii pe geometria 3D, astfel încât stickerul pare pictat pe suprafața curbată a sferei.')
                  : (lang === 'en'
                      ? 'Incorrect. Stickers wrap to the 3D surface geometry.'
                      : 'Incorect. Stickerele se mulează pe suprafața tridimensională.')
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
            <QuestionHint hint={lang === 'en' ? 'The 4 materials are Matte, Gloss, Dull Metal, and Glossy Metal.' : 'Cele 4 finisaje din manual sunt Mat, Lucios, Metal plictisitor și Metal lucios.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which of the following is the complete list of material finishes available in Paint 3D?'
              : 'Care este lista completă a celor 4 finisaje de materiale disponibile în Paint 3D (pag. 32)?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'four_materials', label: 'Mat (Matte), Lucios (Gloss), Metal mat/plictisitor (Dull Metal) și Metal lucios (Glossy Metal)' },
              { id: 'only_wood', label: 'Doar Lemn și Piatră naturală' },
              { id: 'gas_liquid', label: 'Gazoasă, Lichidă și Solidă' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'four_materials'
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
                      ? 'Spot on! These 4 finishes allow recreating realistic materials from soft rubber to polished chrome.'
                      : 'Exact! Aceste 4 finisaje din manual permit recrearea oricărei texturi din viața reală, de la cauciuc mat până la armuri metalice strălucitoare.')
                  : (lang === 'en'
                      ? 'Not quite. The 4 official finishes are Matte, Gloss, Dull Metal, and Glossy Metal.'
                      : 'Incorect. Cele 4 finisaje oficiale sunt: Mat, Lucios, Metal mat și Metal lucios.')
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
