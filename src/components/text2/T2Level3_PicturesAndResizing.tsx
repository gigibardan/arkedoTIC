import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Crop, 
  RotateCw, 
  Maximize, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';

interface T2Level3_PicturesAndResizingProps {
  onCompletePage: (earnedScore: number) => void;
}

export const T2Level3_PicturesAndResizing: React.FC<T2Level3_PicturesAndResizingProps> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Image Inspector State
  const [scaleX, setScaleX] = useState<number>(1.8); // Initially distorted (stretched horizontally)
  const [scaleY, setScaleY] = useState<number>(1.0);
  const [isCropped, setIsCropped] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [pictureStyle, setPictureStyle] = useState<'plain' | 'rounded-frame' | 'shadow'>('plain');

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null
  });

  const correctAnswers: Record<string, number> = {
    q1: 0, // Mânerele din colțuri păstrează proporțiile
    q2: 2, // Decupare (Crop)
    q3: 1, // Distorsionează / deformează imaginea
    q4: 3  // Mânerul rotund de rotație din partea superioară
  };

  const handleSelectAnswer = (qKey: string, optIdx: number) => {
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [qKey]: optIdx }));
  };

  // Lock aspect ratio helper
  const handleFixProportions = () => {
    sounds.playSuccess();
    setScaleX(1.0);
    setScaleY(1.0);
  };

  const handleToggleCrop = () => {
    sounds.playClick();
    setIsCropped(!isCropped);
  };

  const handleRotate = () => {
    sounds.playClick();
    setRotationAngle(prev => (prev + 90) % 360);
  };

  // Proportions are considered perfect if scaleX === scaleY (ratio 1:1)
  const isAspectRatioCorrect = Math.abs(scaleX - scaleY) < 0.05;
  const isSimulatorComplete = isAspectRatioCorrect && isCropped && pictureStyle === 'rounded-frame';

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
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-900/60 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 text-3xl shrink-0 shadow-inner">
            🖼️
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 4B • Page 3 of 7' : 'Modulul 4B • Pagina 3 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook pp. 73-75' : 'Manual pag. 73-75'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? 'Inserting & Sizing Images (Aspect Ratio)' : 'Inserarea și Redimensionarea Imaginilor'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Never distort a picture! Learn why corner sizing handles are sacred, how to crop unwanted backgrounds with the Crop tool, and how to rotate graphics cleanly.'
                : 'Nu deforma niciodată o fotografie! Învață de ce mânerele de colț sunt sfinte pentru păstrarea proporțiilor, cum elimini marginile inutile cu Decupare (Crop) și cum rotești imaginile.'}
            </p>
          </div>
        </div>
      </div>

      {/* Theory & Visual Concepts */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-emerald-400 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5" />
          <span>{lang === 'en' ? 'Golden Rules of Image Manipulation' : 'Regulile de Aur în Prelucrarea Imaginilor'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30 space-y-2">
            <div className="text-2xl">📐</div>
            <div className="text-sm font-bold text-emerald-300">
              {lang === 'en' ? 'Corner Handles = Proportions' : 'Mânerele de Colț = Proporții'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Always drag from the 4 corner handles! This scales width and height simultaneously, keeping the exact aspect ratio.'
                : 'Trage întotdeauna doar de cele 4 cerculețe din colțuri! Ele măresc sau micșorează simultan lățimea și înălțimea, păstrând proporțiile.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/30 space-y-2">
            <div className="text-2xl">⚠️</div>
            <div className="text-sm font-bold text-rose-300">
              {lang === 'en' ? 'Side Handles = Distortion' : 'Mânerele Laterale = Deformare'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Dragging the middle handles squashes or stretches people and objects unnaturally. This is considered a grave design error.'
                : 'Dacă tragi de mânerele de pe mijlocul laturilor, imaginea devine turtită sau alungită artificial. Este o greșeală gravă de redactare!'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 space-y-2">
            <div className="text-2xl">✂️</div>
            <div className="text-sm font-bold text-cyan-300">
              {lang === 'en' ? 'Crop Tool (Decupare)' : 'Instrumentul Decupare (Crop)'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Cuts away redundant edges, empty borders, or photobombers without shrinking or distorting the actual subject.'
                : 'Elimină marginile inutile, spațiile albe sau fundalul nedorit dintr-o poză, fără a micșora sau deforma personajul principal.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Aspect Ratio & Crop Simulator */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Interactive Inspector: Fix Distorted Mascot' : 'Inspector Interactiv: Repară Mascota Deformată'}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
            {lang === 'en' ? 'Step 1: Calibration Lab' : 'Pasul 1: Laborator Calibrare'}
          </span>
        </div>

        {/* Live Picture Canvas Box */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-950/80 rounded-2xl border-2 border-slate-700 relative overflow-hidden min-h-[300px]">
          {/* Diagnostic Banner */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              {isAspectRatioCorrect ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'en' ? 'Aspect Ratio: 1:1 (PERFECT)' : 'Raport de Aspect: 1:1 (CORECT)'}
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1 bg-rose-950/70 px-2.5 py-1 rounded-lg border border-rose-500/40 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" /> {lang === 'en' ? 'DISTORTED! (Stretched)' : 'IMAGINE DISTORSIONATĂ! (Turtită/Alungită)'}
                </span>
              )}
            </div>

            <div className="text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Rotire: {rotationAngle}°
            </div>
          </div>

          {/* Interactive Image Frame */}
          <div 
            className={`transition-all duration-300 relative select-none ${
              pictureStyle === 'rounded-frame'
                ? 'rounded-3xl p-3 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30'
                : pictureStyle === 'shadow'
                ? 'rounded-xl shadow-2xl shadow-cyan-500/50 border-2 border-cyan-400'
                : 'rounded-none border border-slate-700'
            }`}
            style={{
              transform: `scale(${scaleX}, ${scaleY}) rotate(${rotationAngle}deg)`,
              maxWidth: isCropped ? '220px' : '300px',
              maxHeight: isCropped ? '220px' : '300px'
            }}
          >
            {/* Corner Sizing Handles (Visual Demonstration) */}
            <div className="absolute -top-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md" title="Corner Handle (Safe)" />
            <div className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md" title="Corner Handle (Safe)" />
            <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md" title="Corner Handle (Safe)" />
            <div className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md" title="Corner Handle (Safe)" />

            {/* Rotation Top Circle Handle */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-400 border border-white rounded-full shadow-md flex items-center justify-center text-[10px]">
              ↻
            </div>

            {/* Mascot Image Card */}
            <div className="bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-2 drop-shadow-md">
                🤖
              </div>
              <div className="font-heading font-black text-sm text-cyan-300">
                ARKY ROBOT
              </div>
              {!isCropped && (
                <div className="mt-2 text-[10px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                  [Margine nedorită ce trebuie decupată]
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase font-mono">
            {lang === 'en' ? 'Adjustment Controls:' : 'Panou de Control & Calibrare:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Fix Aspect Ratio */}
            <button
              type="button"
              onClick={handleFixProportions}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                isAspectRatioCorrect
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-600/30'
              }`}
            >
              <span>{lang === 'en' ? '1. Reset Aspect Ratio' : '1. Păstrează Proporțiile 1:1'}</span>
              <span>{isAspectRatioCorrect ? '✓' : '📐'}</span>
            </button>

            {/* Toggle Crop */}
            <button
              type="button"
              onClick={handleToggleCrop}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                isCropped
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{lang === 'en' ? '2. Crop Margin (Decupare)' : '2. Decupează Marginile'}</span>
              <Crop className="w-4 h-4" />
            </button>

            {/* Rotate */}
            <button
              type="button"
              onClick={handleRotate}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:border-slate-500 flex items-center justify-between transition cursor-pointer"
            >
              <span>{lang === 'en' ? 'Rotate 90°' : 'Rotește cu 90°'}</span>
              <RotateCw className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Picture Style */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setPictureStyle(prev => prev === 'plain' ? 'rounded-frame' : prev === 'rounded-frame' ? 'shadow' : 'plain');
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                pictureStyle === 'rounded-frame'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{lang === 'en' ? '3. Picture Style:' : '3. Stil de Imagine:'}</span>
              <span className="font-mono text-cyan-400">
                {pictureStyle === 'rounded-frame' ? 'Rond Elegant ✓' : pictureStyle === 'shadow' ? 'Umbră 3D' : 'Standard'}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs font-mono">
            {isSimulatorComplete ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'en' ? 'Mascot impeccably calibrated and framed! (+1 pt)' : 'Mascotă calibrată fără deformare și decupată impecabil! (+1 pct)'}
              </span>
            ) : (
              <span className="text-amber-400">
                ⚡ {lang === 'en' ? 'Goal: Reset proportions to 1:1, activate Crop, and apply Rounded Frame!' : 'Obiectiv: Readu proporțiile la 1:1, activează Decuparea și alege Rama Elegantă!'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Image Manipulation' : 'Verifică-ți Cunoștințele: Prelucrarea Imaginilor'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 4' : 'Întrebarea 1 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which sizing handles MUST be used to resize an image without distorting its proportions?'
              : 'De care mânere de redimensionare TREBUIE să tragi pentru a mări sau micșora o imagine fără a-i distorsiona proporțiile?'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Only the 4 corner handles' : 'A) Doar de cele 4 mânere de la colțuri',
              lang === 'en' ? 'B) The middle horizontal handles' : 'B) De mânerele de pe mijlocul laturilor orizontale',
              lang === 'en' ? 'C) The vertical middle handles' : 'C) De mânerele din mijlocul laturilor verticale',
              lang === 'en' ? 'D) Any handle produces identical results' : 'D) Oricare mâner produce exact aceleași rezultate'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer('q1', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
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
            hintId="t2_q1_handles"
            hintRo="Colțurile modifică simultan lățimea și înălțimea în mod proporțional."
            hintEn="The corners adjust both width and height simultaneously in exact proportion."
          />

          {answers.q1 !== null && (
            <AnswerExplanation
              isCorrect={answers.q1 === correctAnswers.q1}
              explanation={
                answers.q1 === correctAnswers.q1
                  ? (lang === 'en' ? 'Perfect! Dragging corner handles preserves the exact aspect ratio.' : 'Corect! Doar mânerele de la colțuri păstrează neschimbat raportul lățime/înălțime.')
                  : (lang === 'en' ? 'Incorrect. Corner handles must be used to preserve proportions.' : 'Incorect. Pentru a nu deforma imaginea, se folosesc exclusiv mânerele de colț.')
              }
              ruleReference="Manual TIC pag. 74"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 4' : 'Întrebarea 2 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What is the tool called that cuts away unwanted border areas from a picture?'
              : 'Cum se numește instrumentul care permite tăierea sau eliminarea zonelor de margine nedorite dintr-o poză?'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Resize' : 'A) Redimensionare',
              lang === 'en' ? 'B) Rotate (Rotire)' : 'B) Rotire',
              lang === 'en' ? 'C) Crop (Decupare)' : 'C) Decupare (Crop)',
              lang === 'en' ? 'D) Zoom' : 'D) Zoom'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer('q2', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
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
            hintId="t2_q2_crop"
            hintRo="În limba engleză operațiunea se numește Crop, iar în română Decupare."
            hintEn="In English the tool is named Crop, and in Romanian Decupare."
          />

          {answers.q2 !== null && (
            <AnswerExplanation
              isCorrect={answers.q2 === correctAnswers.q2}
              explanation={
                answers.q2 === correctAnswers.q2
                  ? (lang === 'en' ? 'Great! Crop (Decupare) trims outer margins without resizing the subject.' : 'Excelent! Instrumentul Decupare (Crop) taie marginile exterioare nedorite ale imaginii.')
                  : (lang === 'en' ? 'Incorrect. The tool for cutting borders is Crop (Decupare).' : 'Incorect. Tăierea marginilor inutile se realizează prin comanda Decupare (Crop).')
              }
              ruleReference="Manual TIC pag. 75"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase font-mono">
            {lang === 'en' ? 'Question 3 of 4' : 'Întrebarea 3 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What harmful effect occurs if you pull an image by its left or right side handle?'
              : 'Ce efect dăunător apare dacă tragi de mânerul din stânga sau din dreapta al unei imagini?'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) The picture gets deleted' : 'A) Poza se șterge automat',
              lang === 'en' ? 'B) Distorts/stretches the image unnaturally' : 'B) Imaginea se deformează/lățește nefiresc (se distorsionează)',
              lang === 'en' ? 'C) Colors change to black & white' : 'C) Imaginea devine alb-negru',
              lang === 'en' ? 'D) File size becomes zero' : 'D) Imaginea se rotește la 180°'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer('q3', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
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
            hintId="t2_q3_distortion"
            hintRo="Lățimea crește, însă înălțimea rămâne aceeași, făcând elementele să pară turtite."
            hintEn="Width expands while height stays frozen, making subjects look squashed or bloated."
          />

          {answers.q3 !== null && (
            <AnswerExplanation
              isCorrect={answers.q3 === correctAnswers.q3}
              explanation={
                answers.q3 === correctAnswers.q3
                  ? (lang === 'en' ? 'Spot on! Pulling side handles distorts the image, compromising design quality.' : 'Exact! Tragerea de mânerele laterale deformează nefiresc fotografia (distorsiune vizuală).')
                  : (lang === 'en' ? 'Incorrect. Pulling side handles stretches and ruins image proportions.' : 'Incorect. Mânerele laterale modifică doar o singură axă, ducând la deformare inestetică.')
              }
              ruleReference="Manual TIC pag. 74"
            />
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase font-mono">
            {lang === 'en' ? 'Question 4 of 4' : 'Întrebarea 4 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Where is the rotation handle located when an image is selected in a word processor?'
              : 'Unde se află mânerul dedicat pentru rotirea unei imagini selectate în procesorul de text?'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) In the bottom right corner' : 'A) În colțul din dreapta-jos',
              lang === 'en' ? 'B) Exactly in the center of the image' : 'B) Exact în mijlocul imaginii',
              lang === 'en' ? 'C) Only on the keyboard' : 'C) Pe tasta F5',
              lang === 'en' ? 'D) Above the image, as a round handle with a circular arrow' : 'D) Deasupra imaginii, sub forma unui cerculeț cu o săgeată circulară'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer('q4', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
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
            hintId="t2_q4_rotation"
            hintRo="Privește deasupra imaginii selectate: un mâner rotund permite rotirea liberă."
            hintEn="Look right above the selected picture: a circular handle allows free rotation."
          />

          {answers.q4 !== null && (
            <AnswerExplanation
              isCorrect={answers.q4 === correctAnswers.q4}
              explanation={
                answers.q4 === correctAnswers.q4
                  ? (lang === 'en' ? 'Correct! The circular rotation handle sits atop the selected picture.' : 'Corect! Mânerul rotund de rotație se află deasupra centrului imaginii selectate.')
                  : (lang === 'en' ? 'Incorrect. The rotation handle is situated above the image.' : 'Incorect. Mânerul de rotație este situat deasupra cadrului de selecție.')
              }
              ruleReference="Manual TIC pag. 75"
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
