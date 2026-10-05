import React, { useState, useEffect } from 'react';
import { 
  Shapes, 
  Type, 
  Layers, 
  Group, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Star, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface T2Level5_ShapesAndTextBoxesProps {
  onCompletePage: (earnedScore: number) => void;
}

export const T2Level5_ShapesAndTextBoxes: React.FC<T2Level5_ShapesAndTextBoxesProps> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Badge Constructor State
  const [hasBadgeBase, setHasBadgeBase] = useState<boolean>(true);
  const [badgeColor, setBadgeColor] = useState<'blue' | 'purple' | 'emerald'>('blue');
  const [hasTextBox, setHasTextBox] = useState<boolean>(false);
  const [studentBadgeName, setStudentBadgeName] = useState<string>('Alexandru Popa');
  const [hasDecorativeStar, setHasDecorativeStar] = useState<boolean>(false);
  const [layerOrderCorrect, setLayerOrderCorrect] = useState<boolean>(true); // true = base is at back
  const [isGrouped, setIsGrouped] = useState<boolean>(false);

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
    q1: 0, // Text Box (Casetă de text)
    q2: 1, // Trimitere în spate (Send to Back)
    q3: 2, // Grupare (Group)
    q4: 0  // Tasta Shift sau Ctrl
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

  const handleToggleGroup = () => {
    sounds.playSuccess();
    setIsGrouped(!isGrouped);
  };

  const isBadgeComplete = hasTextBox && hasDecorativeStar && layerOrderCorrect && isGrouped;

  // Scoring
  let correctCount = 0;
  Object.keys(correctAnswers).forEach(k => {
    if (answers[k] === correctAnswers[k]) correctCount++;
  });
  if (isBadgeComplete) correctCount += 1;
  const totalQuestions = 5;

  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-pink-900/60 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-purple-500/20 border border-purple-400/40 rounded-2xl text-purple-300 text-3xl shrink-0 shadow-inner">
            📐
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 4B • Page 5 of 7' : 'Modulul 4B • Pagina 5 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook pp. 78-79' : 'Manual pag. 78-79'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? 'Geometric Shapes, Text Boxes & Grouping' : 'Forme Geometrice, Casete de Text & Grupare'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Create diagrammatic flowcharts and stylish badges! Learn to place free text anywhere with Text Boxes, manage layer orders (Bring to Front / Send to Back), and group shapes into a single unit.'
                : 'Creează scheme logice și ecusoane elegante! Învață să așezi text oriunde pe pagină cu Casete de Text (Text Box), să gestionezi ordinea straturilor de suprapunere și să Grupezi formele!'}
            </p>
          </div>
        </div>
      </div>

      {/* Theory & Concepts Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-purple-400 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5" />
          <span>{lang === 'en' ? 'Shapes & Text Architecture' : 'Arhitectura Formelor & Casetelor de Text'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">🔲</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Text Box (Casetă de text)' : 'Casetă de text (Text Box)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'A movable container that lets you position text freely anywhere on the page, bypassing paragraph margins.'
                : 'O căsuță dreptunghiulară mobilă ce permite amplasarea liberă a textului în orice colț al foii.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">🥞</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Layer Order (Arrange)' : 'Ordinea Straturilor (Arrange)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Objects stack like sheets of paper: Bring to Front puts an element in the foreground, while Send to Back tucks it behind.'
                : 'Obiectele se suprapun ca foile de clătite: Aducere în față (Bring to Front) și Trimitere în spate (Send to Back).'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-2xl">🔗</div>
            <div className="text-sm font-bold text-white">
              {lang === 'en' ? 'Grouping (Grupare)' : 'Gruparea Obiectelor (Group)'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Combines several selected shapes into a single permanent block so they can be moved and resized together.'
                : 'Leagă mai multe forme într-un singur bloc unitar, astfel încât să nu se desprindă când le muți pe pagină.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Badge Constructor Workshop */}
      <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Workshop: Build the ICT Lab ID Badge' : 'Atelier Practic: Asamblează Ecusonul de Laborator TIC'}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/40">
            {lang === 'en' ? 'Step 1: Badge Assembler' : 'Pasul 1: Asamblare Forme & Text'}
          </span>
        </div>

        {/* Toolbar of shapes */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase font-mono">
            {lang === 'en' ? 'Shape Insertion & Arrangement Panel:' : 'Panou Inserare Forme & Aranjare Straturi:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Base Color Picker */}
            <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-700 rounded-xl">
              <span className="text-[11px] font-mono text-slate-400 pl-1">Bază:</span>
              {(['blue', 'purple', 'emerald'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setBadgeColor(color);
                  }}
                  className={`w-6 h-6 rounded-lg border transition cursor-pointer ${
                    color === 'blue'
                      ? 'bg-blue-600 border-blue-400'
                      : color === 'purple'
                      ? 'bg-purple-600 border-purple-400'
                      : 'bg-emerald-600 border-emerald-400'
                  } ${badgeColor === color ? 'ring-2 ring-white scale-110' : ''}`}
                />
              ))}
            </div>

            {/* Toggle Text Box */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setHasTextBox(!hasTextBox);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                hasTextBox
                  ? 'bg-purple-950/80 border-purple-400 text-purple-200'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{lang === 'en' ? 'Insert Text Box' : '1. Caseta cu Nume'}</span>
              <Type className="w-4 h-4" />
            </button>

            {/* Toggle Star Badge */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setHasDecorativeStar(!hasDecorativeStar);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                hasDecorativeStar
                  ? 'bg-amber-950/80 border-amber-400 text-amber-200'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{lang === 'en' ? 'Insert Star Shape' : '2. Formă: Steluță'}</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </button>

            {/* Group Objects Button */}
            <button
              type="button"
              onClick={handleToggleGroup}
              disabled={!hasTextBox || !hasDecorativeStar}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer disabled:opacity-40 ${
                isGrouped
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950/50'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-purple-600/30'
              }`}
            >
              <span>{isGrouped ? (lang === 'en' ? 'Grouped (Bloc Unic) ✓' : 'Grupate (Bloc Unic) ✓') : (lang === 'en' ? '3. Group All (Grupare)' : '3. Grupează Formele')}</span>
              <Group className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Canvas Box */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-950/90 rounded-2xl border-2 border-slate-700 relative min-h-[260px] overflow-hidden">
          {/* Badge Visual Assembly */}
          <div
            className={`relative p-6 rounded-3xl border-4 transition-all duration-300 select-none ${
              badgeColor === 'blue'
                ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 border-blue-400 shadow-blue-500/30'
                : badgeColor === 'purple'
                ? 'bg-gradient-to-br from-purple-900 via-fuchsia-900 to-slate-900 border-purple-400 shadow-purple-500/30'
                : 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border-emerald-400 shadow-emerald-500/30'
            } ${isGrouped ? 'ring-4 ring-emerald-500/50 scale-105 shadow-2xl' : 'shadow-xl'}`}
            style={{ width: '320px', minHeight: '160px' }}
          >
            {/* Lanyard Hole Clip */}
            <div className="w-8 h-2 bg-slate-950 border border-slate-600 rounded-full mx-auto mb-3 shadow-inner" />

            {/* Header Title */}
            <div className="text-center mb-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold">
                ȘCOALA GIMNAZIALĂ „ARKYEDU”
              </div>
              <div className="text-xs font-black text-white uppercase tracking-wider">
                ECUSON LABORATOR INFORMATICĂ
              </div>
            </div>

            {/* Embedded Text Box for Student Name */}
            {hasTextBox ? (
              <div className="bg-white/95 rounded-xl p-2.5 shadow-lg border border-white text-center mb-3">
                <div className="text-[9px] font-mono text-slate-500 uppercase font-bold">
                  [ Casetă de Text: Titular ]
                </div>
                <div className="text-sm font-black text-slate-900 tracking-wide font-heading">
                  {studentBadgeName}
                </div>
                <div className="text-[10px] font-bold text-indigo-700">
                  Clasa a V-a B • Operator TIC
                </div>
              </div>
            ) : (
              <div className="p-3 border-2 border-dashed border-slate-600 rounded-xl text-center text-xs text-slate-400 mb-3">
                [ Casetă de text neintrodusă ]
              </div>
            )}

            {/* Decorative Star Shape */}
            {hasDecorativeStar && (
              <div className="absolute -bottom-3 -right-3 p-2 rounded-2xl bg-amber-400 text-slate-950 font-black shadow-xl border-2 border-white flex items-center gap-1 text-[11px] animate-bounce">
                <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>EXCELENȚĂ TIC</span>
              </div>
            )}

            {/* Group Status Tag */}
            {isGrouped && (
              <div className="absolute -top-3 -left-3 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-mono font-black shadow-lg">
                OBIECT GRUPAT
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="pt-2 flex items-center justify-between text-xs font-mono">
          {isBadgeComplete ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'en' ? 'Badge shapes, text box and star successfully assembled and grouped! (+1 pt)' : 'Ecuson asamblat cu casetă de text, steluță și grupat ca un singur obiect! (+1 pct)'}
            </span>
          ) : (
            <span className="text-amber-400">
              ⚡ {lang === 'en' ? 'Insert Text Box, Star Shape, then click "Group All"!' : 'Inserează Caseta de Text, Steluța decorativă și apoi apasă „Grupează Formele”!'}
            </span>
          )}
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Shapes & Text Boxes' : 'Verifică-ți Cunoștințele: Forme & Casete de Text'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 4' : 'Întrebarea 1 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which tool allows you to type text and position it freely anywhere on the page, independent of regular paragraph margins?'
              : 'Ce instrument îți permite să scrii text și să îl poziționezi liber în orice loc de pe pagină, independent de marginile paragrafului?'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Text Box (Casetă de text)' : 'A) Casetă de text (Text Box)',
              lang === 'en' ? 'B) Footnote (Notă de subsol)' : 'B) Notă de subsol',
              lang === 'en' ? 'C) Page Number' : 'C) Număr de pagină',
              lang === 'en' ? 'D) Recycle Bin' : 'D) Coș de reciclare'
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
            hintId="t2_q1_textbox"
            hintRo="Este o cutie/casetă mobilă dedicată scrierii de text."
            hintEn="It is a movable box specifically designed for writing text."
          />

          {answers.q1 !== null && (
            <AnswerExplanation
              isCorrect={answers.q1 === correctAnswers.q1}
              explanation={
                answers.q1 === correctAnswers.q1
                  ? (lang === 'en' ? 'Correct! Text Box provides full floating layout freedom.' : 'Corect! Caseta de text (Text Box) oferă libertate totală de plasare a textului.')
                  : (lang === 'en' ? 'Incorrect. The floating container is called a Text Box.' : 'Incorect. Instrumentul dedicat este Caseta de text (Text Box).')
              }
              ruleReference="Manual TIC pag. 78"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 4' : 'Întrebarea 2 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'If a geometric rectangle accidentally covers and hides your text box, what command should you apply to the rectangle?'
              : 'Dacă un dreptunghi colorat acoperă și ascunde caseta ta de text, ce comandă aplici pe dreptunghi pentru a face textul vizibil?'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Bring to Front' : 'A) Aducere în prim-plan (Bring to Front)',
              lang === 'en' ? 'B) Send to Back (Trimitere în plan secundar)' : 'B) Trimitere în spate (Send to Back)',
              lang === 'en' ? 'C) Rotate 180°' : 'C) Rotire la 180°',
              lang === 'en' ? 'D) Close Document' : 'D) Închidere document'
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
            hintId="t2_q2_order"
            hintRo="Trebuie să trimiți forma geometrică pe stratul din spate, sub caseta de text."
            hintEn="You need to send the shape to the bottom layer, behind the text box."
          />

          {answers.q2 !== null && (
            <AnswerExplanation
              isCorrect={answers.q2 === correctAnswers.q2}
              explanation={
                answers.q2 === correctAnswers.q2
                  ? (lang === 'en' ? 'Spot on! "Send to Back" pushes the shape underneath the text layer.' : 'Exact! Trimitere în spate (Send to Back) mută dreptunghiul pe fundal, permițând textului să se vadă clar.')
                  : (lang === 'en' ? 'Incorrect. The command is Send to Back.' : 'Incorect. Pentru a plasa forma în spate, folosești Trimitere în spate (Send to Back).')
              }
              ruleReference="Manual TIC pag. 79"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono">
            {lang === 'en' ? 'Question 3 of 4' : 'Întrebarea 3 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Why is the "Group" command so important when designing diagrams or badges composed of multiple shapes?'
              : 'De ce este foarte utilă comanda „Grupare” (Group) când desenezi o schemă sau un ecuson compus din mai multe forme?'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) It deletes duplicate elements' : 'A) Șterge automat elementele duplicate',
              lang === 'en' ? 'B) It translates text to another language' : 'B) Traduce textul în altă limbă',
              lang === 'en' ? 'C) It unites separate shapes into a single object so they stay together when moved' : 'C) Unește formele într-un singur bloc pentru a fi mutate/redimensionate împreună fără a se desprinde',
              lang === 'en' ? 'D) It saves the file to a USB stick' : 'D) Salvează fișierul pe stick'
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
            hintId="t2_q3_group"
            hintRo="Gruparea creează un bloc indivizibil ca o singură imagine compactă."
            hintEn="Grouping creates an indivisible single object that acts like one compact image."
          />

          {answers.q3 !== null && (
            <AnswerExplanation
              isCorrect={answers.q3 === correctAnswers.q3}
              explanation={
                answers.q3 === correctAnswers.q3
                  ? (lang === 'en' ? 'Correct! Grouping locks multiple components together into one entity.' : 'Corect! Gruparea leagă elementele componente, prevenind împrăștierea lor accidentală pe pagină.')
                  : (lang === 'en' ? 'Incorrect. Grouping unites objects into a single movable block.' : 'Incorect. Gruparea asigură manipularea sincronă a formelor ca un singur obiect.')
              }
              ruleReference="Manual TIC pag. 79"
            />
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono">
            {lang === 'en' ? 'Question 4 of 4' : 'Întrebarea 4 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which keyboard key should you hold down while clicking to select multiple shapes at once for grouping?'
              : 'Ce tastă ții apăsată în timp ce dai click pe forme pentru a selecta mai multe obiecte deodată în vederea grupării?'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Shift (or Ctrl)' : 'A) Tasta Shift (sau Ctrl)',
              lang === 'en' ? 'B) Spacebar' : 'B) Bara de spațiu',
              lang === 'en' ? 'C) Escape (Esc)' : 'C) Tasta Escape (Esc)',
              lang === 'en' ? 'D) Backspace' : 'D) Tasta Backspace'
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
            hintId="t2_q4_multiselect"
            hintRo="Este aceeași tastă pe care ai învățat-o în modulul de fișiere pentru selecția multiplă!"
            hintEn="It is the same key you learned in the files module for multi-selection!"
          />

          {answers.q4 !== null && (
            <AnswerExplanation
              isCorrect={answers.q4 === correctAnswers.q4}
              explanation={
                answers.q4 === correctAnswers.q4
                  ? (lang === 'en' ? 'Excellent! Holding Shift or Ctrl enables multi-object selection.' : 'Excelent! Ținând apăsată tasta Shift (sau Ctrl) poți adăuga succesiv forme la selecție.')
                  : (lang === 'en' ? 'Incorrect. Shift or Ctrl is used to multi-select objects.' : 'Incorect. Tasta Shift (sau Ctrl) permite selectarea mai multor obiecte simultan.')
              }
              ruleReference="Manual TIC pag. 79"
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
