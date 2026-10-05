import React, { useState, useEffect } from 'react';
import { 
  WrapText, 
  Layers, 
  Eye, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Move
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface T2Level4_TextWrappingProps {
  onCompletePage: (earnedScore: number) => void;
}

type WrappingMode = 'inline' | 'square' | 'tight' | 'behind' | 'infront' | 'topbottom';

export const T2Level4_TextWrapping: React.FC<T2Level4_TextWrappingProps> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Wrapping Simulator State
  const [activeWrapMode, setActiveWrapMode] = useState<WrappingMode>('inline');
  const [imagePos, setImagePos] = useState<'left' | 'center' | 'right'>('center');
  const [hasTestedBehind, setHasTestedBehind] = useState<boolean>(false);
  const [hasTestedSquare, setHasTestedSquare] = useState<boolean>(false);

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null
  });
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

  const correctAnswers: Record<string, number> = {
    q1: 1, // În linie cu textul (In line with text)
    q2: 0, // Pătrat (Square)
    q3: 2, // În spatele textului (Behind text - filigran/fundal)
    q4: 3  // În fața textului (In front of text) acoperă textul
  };

  const handleSelectAnswer = (qKey: string, optIdx: number) => {
    if ((cooldowns[qKey] || 0) > 0) return;
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [qKey]: optIdx }));
    if (optIdx === correctAnswers[qKey]) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [qKey]: 5 }));
    }
  };

  const handleSelectWrapMode = (mode: WrappingMode) => {
    sounds.playClick();
    setActiveWrapMode(mode);
    if (mode === 'behind') setHasTestedBehind(true);
    if (mode === 'square') setHasTestedSquare(true);
  };

  // Check if interactive testing objectives met
  const isSimulatorComplete = hasTestedBehind && hasTestedSquare && (activeWrapMode === 'square' || activeWrapMode === 'tight');

  // Scoring
  let correctCount = 0;
  Object.keys(correctAnswers).forEach(k => {
    if (answers[k] === correctAnswers[k]) correctCount++;
  });
  if (isSimulatorComplete) correctCount += 1;
  const totalQuestions = 5;

  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-slate-900 to-blue-900/60 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-cyan-500/20 border border-cyan-400/40 rounded-2xl text-cyan-300 text-3xl shrink-0 shadow-inner">
            📰
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 4B • Page 4 of 7' : 'Modulul 4B • Pagina 4 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook pp. 76-77' : 'Manual pag. 76-77'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? 'Text Wrapping Around Images (Wrap Text)' : 'Încadrarea Textului în Jurul Imaginilor'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Solve the mystery of jumping paragraphs! Master Square, Tight, Behind Text (watermark), In Front of Text, and Top & Bottom wrapping modes like a newspaper editor.'
                : 'De ce „fuge” textul când inserezi o poză? Învață cele 6 moduri de încadrare: Pătrat (Square), Strâns (Tight), În spatele textului (fundal/filigran), În fața textului și Sus/Jos!'}
            </p>
          </div>
        </div>
      </div>

      {/* Theory & Concepts Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-cyan-400 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5" />
          <span>{lang === 'en' ? 'The 6 Fundamental Text Wrapping Modes' : 'Cele 6 Moduri de Încadrare a Textului (Wrap Text)'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="text-xl">🔤</div>
            <div className="text-xs font-bold text-white">
              {lang === 'en' ? '1. In Line with Text' : '1. În linie cu textul (Implicit)'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Acts like a giant letter on the line. Moving it freely across the page is impossible.'
                : 'Poza stă fix pe rând ca o literă uriașă. Nu o poți muta liber cu mouse-ul pe pagină.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-cyan-500/40 space-y-1.5">
            <div className="text-xl">🔲</div>
            <div className="text-xs font-bold text-cyan-300">
              {lang === 'en' ? '2. Square (Pătrat)' : '2. Pătrat (Square)'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Text flows neatly along an invisible rectangular boundary around the picture. Ideal for newspaper columns.'
                : 'Textul curge curat pe conturul unui dreptunghi invizibil în jurul pozei. Cel mai folosit stil!'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="text-xl">🧲</div>
            <div className="text-xs font-bold text-white">
              {lang === 'en' ? '3. Tight (Strâns)' : '3. Strâns (Tight)'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Text wraps closely hugging the irregular silhouettes of transparent PNG graphics or shapes.'
                : 'Textul se mulează strâns pe conturul neregulat al pozei (excelent pentru imagini PNG fără fundal).'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-500/40 space-y-1.5">
            <div className="text-xl">📄</div>
            <div className="text-xs font-bold text-amber-300">
              {lang === 'en' ? '4. Behind Text' : '4. În spatele textului (Behind)'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'The picture sits in the background layer like a watermark; text remains completely legible on top.'
                : 'Imaginea coboară în fundal (filigran/watermark), iar textul se citește deasupra ei.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="text-xl">🛡️</div>
            <div className="text-xs font-bold text-white">
              {lang === 'en' ? '5. In Front of Text' : '5. În fața textului (In Front)'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Floats above the page, hiding text underneath. Great for stickers, ribbons, or stamps.'
                : 'Plutește deasupra documentului și acoperă textul de dedesubt (folosit pentru ecusoane sau ștampile).'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="text-xl">⏸️</div>
            <div className="text-xs font-bold text-white">
              {lang === 'en' ? '6. Top and Bottom' : '6. Sus și Jos (Top & Bottom)'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Text breaks above the image and resumes below it, leaving left and right blank.'
                : 'Textul se oprește deasupra imaginii și continuă dedesubt, lăsând stânga și dreapta goale.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Wrapping Magazine Lab */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <WrapText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Interactive Article Layout Simulator' : 'Simulator Interactiv de Machetare a Articolului'}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
            {lang === 'en' ? 'Step 1: Wrapping Lab' : 'Pasul 1: Laborator Text Wrapping'}
          </span>
        </div>

        {/* Wrapping Mode Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 uppercase font-mono">
            {lang === 'en' ? 'Select Text Wrapping Mode:' : 'Alege Modul de Încadrare (Wrap Text):'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: 'inline', labelRo: 'În linie', labelEn: 'In Line', icon: '🔤' },
              { id: 'square', labelRo: 'Pătrat (Square)', labelEn: 'Square', icon: '🔲' },
              { id: 'tight', labelRo: 'Strâns (Tight)', labelEn: 'Tight', icon: '🧲' },
              { id: 'behind', labelRo: 'În spate (Behind)', labelEn: 'Behind', icon: '📄' },
              { id: 'infront', labelRo: 'În față (Front)', labelEn: 'In Front', icon: '🛡️' },
              { id: 'topbottom', labelRo: 'Sus & Jos', labelEn: 'Top/Bottom', icon: '⏸️' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleSelectWrapMode(mode.id as WrappingMode)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeWrapMode === mode.id
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50 scale-102 ring-2 ring-cyan-400/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <span className="text-base">{mode.icon}</span>
                <span className="text-[11px] text-center leading-tight">
                  {lang === 'en' ? mode.labelEn : mode.labelRo}
                </span>
              </button>
            ))}
          </div>

          {/* Position Selector */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-mono text-slate-400">{lang === 'en' ? 'Image Position:' : 'Poziție Imagine:'}</span>
            {(['left', 'center', 'right'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setImagePos(pos);
                }}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                  imagePos === pos
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {pos === 'left' ? 'Stânga' : pos === 'center' ? 'Centru' : 'Dreapta'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Document Page View */}
        <div className="rounded-2xl border-2 border-slate-700 bg-slate-950 p-6 shadow-inner relative overflow-hidden min-h-[360px]">
          {/* Magazine Article Header */}
          <div className="border-b border-slate-800 pb-3 mb-4">
            <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/40">
              Revista Școlară • Natura Noastră
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              Pădurea Digitală și Protejarea Mediului
            </h3>
          </div>

          {/* Text Flow Rendering based on Wrapping Mode */}
          <div className="relative text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {/* The Floating Image Box */}
            <div
              className={`transition-all duration-300 ${
                activeWrapMode === 'inline'
                  ? 'inline-block align-middle my-2 mx-2'
                  : activeWrapMode === 'square'
                  ? `float-${imagePos === 'left' ? 'left mr-4 mb-2' : imagePos === 'right' ? 'float-right ml-4 mb-2' : 'float-none mx-auto mb-4 block'}`
                  : activeWrapMode === 'tight'
                  ? `float-${imagePos === 'left' ? 'left mr-3 mb-1' : imagePos === 'right' ? 'float-right ml-3 mb-1' : 'float-none mx-auto mb-3 block'}`
                  : activeWrapMode === 'behind'
                  ? 'absolute top-12 left-1/2 -translate-x-1/2 opacity-25 pointer-events-none z-0'
                  : activeWrapMode === 'infront'
                  ? 'absolute top-12 left-1/2 -translate-x-1/2 shadow-2xl z-20 opacity-95 ring-4 ring-cyan-500'
                  : 'block my-4 mx-auto clear-both' // topbottom
              }`}
              style={{ width: activeWrapMode === 'inline' ? '90px' : '150px' }}
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 border-2 border-emerald-400 shadow-xl text-center">
                <div className="text-3xl sm:text-4xl">🌳</div>
                <div className="text-[10px] font-bold text-emerald-200 mt-1 uppercase font-mono">
                  ECO-ROBOT
                </div>
              </div>
            </div>

            {/* Paragraph Text Content */}
            <p className="mb-3">
              Pădurile reprezintă plămânii verzi ai planetei noastre. În fiecare zi, mii de copaci produc oxigenul necesar vieții și adăpostesc nenumărate specii de animale și păsări. În laboratorul de informatică, învățăm cum tehnologia modernă poate fi folosită responsabil pentru a reduce consumul inutil de hârtie prin documente digitale și tehnoredactare profesională.
            </p>

            <p className="mb-3">
              Un procesor de text bine configurat permite elevilor să îmbine fotografiile tematice și graficele ecologice direct în articolele lor. Când folosim modul <strong>Pătrat (Square)</strong>, cuvintele ocolesc armonios ilustrația pe laturile sale, exact ca într-o revistă tipărită de presă.
            </p>

            <p>
              Dacă dorim un efect subtil de watermark sau filigran, modul <strong>În spatele textului (Behind Text)</strong> așază desenul discret pe fundal, asigurând lizibilitatea maximă a literelor. În schimb, modul <strong>În fața textului (In Front of Text)</strong> aduce imaginea în prim-plan, acoperind temporar conținutul scris.
            </p>
          </div>

          {/* Mode Status Pill */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Mod Activ:</span>
              <span className="text-cyan-300 font-bold uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {activeWrapMode}
              </span>
            </div>

            {isSimulatorComplete ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Wrapping modes mastered! (+1 pt)' : 'Modurile Square & Behind testate cu succes! (+1 pct)'}
              </span>
            ) : (
              <span className="text-amber-400">
                ⚡ {lang === 'en' ? 'Test both "Behind" and "Square" modes to finish!' : 'Testează atât modul „În spate” (Behind) cât și „Pătrat” (Square)!'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Text Wrapping' : 'Verifică-ți Cunoștințele: Încadrarea Textului'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 4' : 'Întrebarea 1 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What is the default wrapping mode when an image is first inserted into Microsoft Word?'
              : 'Care este modul implicit de încadrare atunci când inserezi o imagine nouă într-un document Word?'}
          </div>

          {(cooldowns['q1'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q1']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza modul implicit de încadrare din manual pag. 76."
                customMessageEn="Incorrect! Please take 5 seconds to review the default text wrap on page 76."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Square (Pătrat)' : 'A) Pătrat (Square)',
              lang === 'en' ? 'B) In Line with Text (În linie cu textul)' : 'B) În linie cu textul (In Line with Text)',
              lang === 'en' ? 'C) Behind Text (În spatele textului)' : 'C) În spatele textului',
              lang === 'en' ? 'D) Transparent' : 'D) Transparent'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q1'] || 0) > 0}
                onClick={() => handleSelectAnswer('q1', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  answers.q1 === idx
                    ? idx === correctAnswers.q1
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q1_wrap_def"
            hintRo="Implicit, imaginea se comportă ca o literă uriașă în rând, de aceea nu o poți muta liber."
            hintEn="By default, the image acts like a giant character on the line, preventing free dragging."
          />

          {answers.q1 !== null && (
            <AnswerExplanation
              isCorrect={answers.q1 === correctAnswers.q1}
              cooldown={cooldowns['q1'] || 0}
              explanation={
                answers.q1 === correctAnswers.q1
                  ? (lang === 'en' ? 'Correct! "In Line with Text" is the default mode.' : 'Corect! Modul implicit este «În linie cu textul», motiv pentru care imaginea nu poate fi mutată liber până nu îi schimbi încadrarea.')
                  : (lang === 'en' ? 'Incorrect. Default mode is "In Line with Text".' : 'Incorect. Implicit, procesorul de text plasează imaginea «În linie cu textul».')
              }
              ruleReference="Manual TIC pag. 76"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 4' : 'Întrebarea 2 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which wrapping mode arranges text flowing smoothly around a neat rectangular boundary like in a newspaper?'
              : 'Ce mod de încadrare face ca textul să curgă frumos în jurul unui chenar dreptunghiular invizibil, ca într-un ziar?'}
          </div>

          {(cooldowns['q2'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q2']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza modul Pătrat (Square) din manual pag. 76."
                customMessageEn="Incorrect! Please take 5 seconds to review Square text wrap on page 76."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Square (Pătrat)' : 'A) Pătrat (Square)',
              lang === 'en' ? 'B) Behind Text' : 'B) În spatele textului',
              lang === 'en' ? 'C) In Front of Text' : 'C) În fața textului',
              lang === 'en' ? 'D) Hidden' : 'D) Ascuns'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q2'] || 0) > 0}
                onClick={() => handleSelectAnswer('q2', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  answers.q2 === idx
                    ? idx === correctAnswers.q2
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q2_square"
            hintRo="Forma geometrică dreptunghiulară cu laturi egale se numește Pătrat."
            hintEn="The geometric shape with 4 equal sides is Square (Pătrat)."
          />

          {answers.q2 !== null && (
            <AnswerExplanation
              isCorrect={answers.q2 === correctAnswers.q2}
              cooldown={cooldowns['q2'] || 0}
              explanation={
                answers.q2 === correctAnswers.q2
                  ? (lang === 'en' ? 'Spot on! Square creates an invisible rectangular perimeter around the image.' : 'Exact! Modul Pătrat (Square) este cel mai curat și lizibil pentru articolele de revistă.')
                  : (lang === 'en' ? 'Incorrect. The rectangular wrap mode is Square (Pătrat).' : 'Incorect. Modul de încadrare dreptunghiular se numește Pătrat (Square).')
              }
              ruleReference="Manual TIC pag. 76"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 3 of 4' : 'Întrebarea 3 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'If you want to place a faded school emblem as a watermark under the text, which mode should you choose?'
              : 'Dacă vrei să plasezi o siglă estompată a școlii ca filigran/fundal sub textul paginii, ce mod alegi?'}
          </div>

          {(cooldowns['q3'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q3']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza modul În spatele textului din manual pag. 77."
                customMessageEn="Incorrect! Please take 5 seconds to review Behind Text on page 77."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) In Front of Text' : 'A) În fața textului',
              lang === 'en' ? 'B) Top and Bottom' : 'B) Sus și Jos',
              lang === 'en' ? 'C) Behind Text (În spatele textului)' : 'C) În spatele textului (Behind Text)',
              lang === 'en' ? 'D) Strike-through' : 'D) Tăiat'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q3'] || 0) > 0}
                onClick={() => handleSelectAnswer('q3', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  answers.q3 === idx
                    ? idx === correctAnswers.q3
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q3_behind"
            hintRo="Filigranul stă întotdeauna în plan secundar, adică în spatele caracterelor scrise."
            hintEn="A watermark always sits in the background layer, behind all characters."
          />

          {answers.q3 !== null && (
            <AnswerExplanation
              isCorrect={answers.q3 === correctAnswers.q3}
              cooldown={cooldowns['q3'] || 0}
              explanation={
                answers.q3 === correctAnswers.q3
                  ? (lang === 'en' ? 'Correct! Behind Text places graphics into the background layer.' : 'Corect! Modul «În spatele textului» permite transformarea imaginii într-un fundal sau filigran.')
                  : (lang === 'en' ? 'Incorrect. For background/watermark graphics, choose Behind Text.' : 'Incorect. Pentru fundaluri sau filigrane se alege «În spatele textului».')
              }
              ruleReference="Manual TIC pag. 77"
            />
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 4 of 4' : 'Întrebarea 4 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What happens if you accidentally select "In Front of Text" for a large picture?'
              : 'Ce se întâmplă dacă selectezi din greșeală modul „În fața textului” (In Front of Text) pentru o imagine mare?'}
          </div>

          {(cooldowns['q4'] || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns['q4']}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza modul În fața textului din manual pag. 77."
                customMessageEn="Incorrect! Please take 5 seconds to review In Front of Text on page 77."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Text color changes to blue' : 'A) Culoarea textului devine albastră',
              lang === 'en' ? 'B) The image gets converted to a table' : 'B) Imaginea se transformă într-un tabel',
              lang === 'en' ? 'C) The page is printed automatically' : 'C) Pagina se tipărește automat',
              lang === 'en' ? 'D) The picture floats on top and covers/hides the text underneath' : 'D) Imaginea plutește deasupra și acoperă/ascunde textul de dedesubt'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns['q4'] || 0) > 0}
                onClick={() => handleSelectAnswer('q4', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  answers.q4 === idx
                    ? idx === correctAnswers.q4
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="t2_q4_infront"
            hintRo="Fiind «în față», ea maschează tot ce se află pe foaie sub suprafața ei."
            hintEn="Being 'in front', it obscures and masks everything lying beneath its area."
          />

          {answers.q4 !== null && (
            <AnswerExplanation
              isCorrect={answers.q4 === correctAnswers.q4}
              cooldown={cooldowns['q4'] || 0}
              explanation={
                answers.q4 === correctAnswers.q4
                  ? (lang === 'en' ? 'Perfect! In Front of Text obscures words, so use it only for badges or floating stamps.' : 'Perfect! Modul «În fața textului» acoperă paragrafele, fiind util doar pentru mici ecusoane sau stickere decorative.')
                  : (lang === 'en' ? 'Incorrect. It covers and hides the text underneath.' : 'Incorect. Imaginea va acoperi și va ascunde textul aflat dedesubt.')
              }
              ruleReference="Manual TIC pag. 77"
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => {
          sounds.playFanfare();
          onCompletePage(earnedScore);
        }}
        onRetry={() => {
          sounds.playClick();
          setAnswers({ q1: null, q2: null, q3: null, q4: null });
        }}
      />
    </div>
  );
};
