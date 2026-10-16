import React, { useState } from 'react';
import {
  Layers,
  Gamepad2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ScratchAlgo2_Level3_Minecraft3DLayering: React.FC<Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive 2.5D Scene state
  const [playerX, setPlayerX] = useState<number>(120);
  const [playerY, setPlayerY] = useState<number>(0);
  const [playerLayerOrder, setPlayerLayerOrder] = useState<'front' | 'back'>('front');
  const [placedBlocks, setPlacedBlocks] = useState<{ id: number; x: number; y: number }[]>([]);

  // Quizzes
  const [qLayerBlock, setQLayerBlock] = useState<string | null>(null);
  const [qDepthRule, setQDepthRule] = useState<string | null>(null);

  const movePlayer = (dx: number) => {
    setPlayerX((prev) => Math.min(240, Math.max(30, prev + dx)));
    sounds.playPop();
  };

  const jumpPlayer = () => {
    if (playerY !== 0) return;
    sounds.playJump();
    setPlayerY(-35);
    setTimeout(() => {
      setPlayerY(0);
    }, 350);
  };

  const placeVoxelBlock = () => {
    if (placedBlocks.length >= 6) return;
    const newBlock = {
      id: Date.now(),
      x: playerX + 25,
      y: 0
    };
    setPlacedBlocks((prev) => [...prev, newBlock]);
    sounds.playCraft();
  };

  const togglePlayerLayer = (layer: 'front' | 'back') => {
    setPlayerLayerOrder(layer);
    sounds.playClick();
  };

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleLayerQuiz = (val: string) => {
    if (isLocked('qLayer') || qLayerBlock === 'go_to_front') return;
    setQLayerBlock(val);
    if (val === 'go_to_front') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qLayer', 5);
    }
  };

  const handleDepthQuiz = (val: string) => {
    if (isLocked('qDepth') || qDepthRule === 'closer_covers_farther') return;
    setQDepthRule(val);
    if (val === 'closer_covers_farther') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qDepth', 5);
    }
  };

  const isFormValid = qLayerBlock === 'go_to_front' && qDepthRule === 'closer_covers_farther';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {isEn ? 'Unit 4 • Lessons 6–7 (Textbook pp. 81–83)' : 'Unitatea 4 • Lecțiile 6–7 (Manual pag. 81–83)'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                {isEn ? 'Page 3 of 7' : 'Pagina 3 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {isEn ? 'Project: Minecraft 3D & Depth Layers (Layering)' : 'Proiectul: Minecraft 3D & Straturi de Adâncime (Layering)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isEn
                ? 'Create 3D depth in a 2D Scratch environment! Master the "go to front layer" and "go backward 1 layers" blocks so characters pass naturally in front of and behind trees and voxels.'
                : 'Creează iluzia de adâncime 3D pe ecranul 2D din Scratch! Învață cum funcționează ordinea straturilor (Layering) și controalele din taste pentru a construi propriul simulator Minecraft!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            ⛏️
          </div>
        </div>
      </div>

      {/* Interactive 2.5D Minecraft Simulator */}
      <div className="bg-slate-900/90 border-2 border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isEn ? 'Interactive Minecraft Stage: Depth & Layer Simulator' : 'Scenă Interactivă Minecraft: Simulator de Adâncime & Straturi'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">{isEn ? 'Layer Order:' : 'Stratul Jucătorului:'}</span>
            <button
              type="button"
              onClick={() => togglePlayerLayer('front')}
              className={`px-3 py-1 rounded-lg font-bold border transition cursor-pointer ${
                playerLayerOrder === 'front'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isEn ? 'Front Layer (In Front)' : 'În Față (mergi în stratul de sus)'}
            </button>
            <button
              type="button"
              onClick={() => togglePlayerLayer('back')}
              className={`px-3 py-1 rounded-lg font-bold border transition cursor-pointer ${
                playerLayerOrder === 'back'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isEn ? 'Back Layer (Behind Tree)' : 'În Spate (du în spate)'}
            </button>
          </div>
        </div>

        {/* 2.5D Stage Viewport */}
        <div className="relative w-full h-72 rounded-2xl bg-gradient-to-b from-sky-900 via-sky-950 to-emerald-950 border-2 border-slate-800 overflow-hidden select-none">
          {/* Sky clouds / Sun */}
          <div className="absolute top-4 right-6 w-12 h-12 rounded-lg bg-amber-300 shadow-lg shadow-amber-400/40" />
          <div className="absolute top-8 left-12 text-3xl opacity-60">☁️</div>
          <div className="absolute top-12 left-48 text-2xl opacity-40">☁️</div>

          {/* Mountains in Far Background (Layer 0) */}
          <div className="absolute bottom-16 left-0 right-0 flex justify-around opacity-30 text-7xl pointer-events-none">
            <span>⛰️</span>
            <span>🏔️</span>
            <span>⛰️</span>
          </div>

          {/* Ground Grass Line (Layer 1) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-900 to-emerald-700 border-t-4 border-emerald-500 flex items-center justify-around text-xs font-mono text-emerald-300">
            <span>🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩</span>
          </div>

          {/* Placed Voxel Blocks (Layer 2) */}
          {placedBlocks.map((blk) => (
            <div
              key={blk.id}
              className="absolute bottom-16 w-8 h-8 rounded bg-amber-700 border-2 border-amber-500 text-center flex items-center justify-center text-xs shadow-md"
              style={{ left: `${blk.x}px` }}
            >
              🧱
            </div>
          ))}

          {/* Tree Object (Fixed at X = 150) */}
          <div
            className="absolute bottom-16 left-[140px] flex flex-col items-center pointer-events-none transition-all"
            style={{ zIndex: 10 }}
          >
            <div className="text-7xl -mb-3 filter drop-shadow-lg">🌳</div>
            <div className="w-5 h-8 bg-amber-900 border border-amber-800" />
            <div className="text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/40 mt-1">
              Copac (Z = 10)
            </div>
          </div>

          {/* Player Steve / Arky (Movable) */}
          <div
            className="absolute transition-all duration-100 flex flex-col items-center"
            style={{
              bottom: `${16 - playerY}px`,
              left: `${playerX}px`,
              zIndex: playerLayerOrder === 'front' ? 20 : 5
            }}
          >
            <div className="text-4xl filter drop-shadow-md">
              🤖
            </div>
            <div className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow ${
              playerLayerOrder === 'front'
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
            }`}>
              Z = {playerLayerOrder === 'front' ? '20 (Față)' : '5 (Spate)'}
            </div>
          </div>

          {/* Notice overlay when player goes behind tree */}
          {playerX >= 110 && playerX <= 170 && (
            <div className="absolute top-3 left-3 bg-slate-950/90 border border-amber-500/60 rounded-xl px-3 py-1.5 text-xs text-amber-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>
                {playerLayerOrder === 'front'
                  ? (isEn ? 'Player covers tree (Z=20 > Z=10)' : 'Jucătorul acoperă copacul (este în fața lui)')
                  : (isEn ? 'Player is covered by tree (Z=5 < Z=10)' : 'Jucătorul este ascuns parțial în spatele copacului!')}
              </span>
            </div>
          )}
        </div>

        {/* Keyboard & Controls Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => movePlayer(-25)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 cursor-pointer flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Stânga (-X)</span>
            </button>
            <button
              type="button"
              onClick={() => movePlayer(25)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 cursor-pointer flex items-center gap-1 text-xs"
            >
              <span>Dreapta (+X)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={jumpPlayer}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold border border-indigo-500 cursor-pointer flex items-center gap-1 text-xs shadow-md"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Săritură (Y)</span>
            </button>
            <button
              type="button"
              onClick={placeVoxelBlock}
              className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold border border-amber-500 cursor-pointer flex items-center gap-1 text-xs shadow-md"
            >
              <span>🧱 Pune Bloc</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Taste Scratch: <span className="text-emerald-400">[tasta stânga/dreapta apăsată?]</span>
          </div>
        </div>
      </div>

      {/* Theory & Code Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">
            {isEn ? 'Scratch Layering Blocks (Looks Category)' : 'Blocuri Scratch pentru Gestionarea Straturilor (Aspect)'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-bold text-purple-300 font-mono">
              mergi în stratul [din față v] / [din spate v]
            </div>
            <p className="text-slate-400 text-xs">
              {isEn
                ? 'Instantly sets the sprite to the absolute foreground or absolute background of the entire stage.'
                : 'Trimite personajul instantaneu în prim-planul absolut (peste toate celelalte) sau în fundalul cel mai îndepărtat.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="font-bold text-purple-300 font-mono">
              mergi în [spate v] cu (1) straturi
            </div>
            <p className="text-slate-400 text-xs">
              {isEn
                ? 'Adjusts depth incrementally relative to other sprites without sending it all the way back.'
                : 'Ajustează pas cu pas ordinea de afișare față de un anumit obiect intermediar (ex: coboară doar sub coroana copacului).'}
            </p>
          </div>
        </div>
      </div>

      {/* Formative Quizzes */}
      <div className="space-y-4">
        {/* Q1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '1. Which block ensures your Minecraft player is always visible in front of background scenery?'
                  : '1. Ce bloc folosești pentru ca personajul principal să fie întotdeauna vizibil în prim-plan, în fața blocurilor din decor?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Look for the Looks category block about layers!' : 'Caută blocul violet din categoria Aspect despre straturi!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'go_to_front', label: 'mergi în stratul [din față v]', isCorrect: true },
              { id: 'go_to_back', label: 'mergi în stratul [din spate v]', isCorrect: false },
              { id: 'change_x', label: 'modifică x cu (10)', isCorrect: false }
            ].map((opt) => {
              const isSelected = qLayerBlock === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qLayerBlock) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qLayer') || qLayerBlock === 'go_to_front'}
                  onClick={() => handleLayerQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {qLayerBlock && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qLayerBlock && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qLayer && cooldowns.qLayer > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qLayer}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Blocul „mergi în stratul [din față]” aduce personajul în prim-plan!"
              customMessageEn="Reflection buffer: The 'go to front layer' block brings the sprite to the foreground!"
            />
          ) : null}

          {qLayerBlock && (
            <AnswerExplanation
              isCorrect={qLayerBlock === 'go_to_front'}
              explanation={
                isEn
                  ? 'Correct! The block "mergi în stratul [din față]" raises the player’s Z-index to the maximum, ensuring it is never covered by scenery.'
                  : 'Corect! Blocul „mergi în stratul [din față]” garantează că personajul jucătorului are cel mai mare Z-index și nu va fi mascat de alte obiecte din decor!'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '2. What is the fundamental optical rule of 2.5D perspective?'
                  : '2. Care este regula optică fundamentală a perspectivei 2.5D când două obiecte se suprapun?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Objects closer to the player’s eyes mask the objects behind them!' : 'Obiectele mai apropiate de privitor le acoperă pe cele din depărtare!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'closer_covers_farther', label: 'Obiectul mai apropiat îl acoperă pe cel din fundal', isCorrect: true },
              { id: 'smaller_covers_larger', label: 'Obiectul mai mic acoperă întotdeauna obiectul mai mare', isCorrect: false },
              { id: 'random_display', label: 'Calculatorul alege aleatoriu ce obiect afișează', isCorrect: false }
            ].map((opt) => {
              const isSelected = qDepthRule === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qDepthRule) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qDepth') || qDepthRule === 'closer_covers_farther'}
                  onClick={() => handleDepthQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span>{opt.label}</span>
                  {qDepthRule && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qDepthRule && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qDepth && cooldowns.qDepth > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qDepth}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: În perspectiva 2.5D, obiectele din prim-plan le acoperă pe cele din fundal!"
              customMessageEn="Reflection buffer: In 2.5D perspective, foreground objects occlude background ones!"
            />
          ) : null}

          {qDepthRule && (
            <AnswerExplanation
              isCorrect={qDepthRule === 'closer_covers_farther'}
              explanation={
                isEn
                  ? 'Correct! In real life and in 3D gaming, nearer objects occlude farther ones. Setting layers replicates this visual depth.'
                  : 'Corect! În lumea reală și în jocurile 3D, corpurile din prim-plan obturează corpurile din depărtare. Gestionarea straturilor în Scratch recreează această iluzie optică!'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={isFormValid}
        onNext={() => {
          sounds.playNext();
          onCompletePage(15);
        }}
        nextLabel={isEn ? 'Next: Coordinate Limits & Ghost Effect (p. 84–86) →' : 'Următorul: Limite de Coordonate & Efect Fantomă (pag. 84–86) →'}
      />
    </div>
  );
};
