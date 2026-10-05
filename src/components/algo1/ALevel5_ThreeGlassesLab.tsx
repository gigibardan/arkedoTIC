import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  RotateCcw,
  ArrowRight,
  Check,
  FlaskConical,
  Beaker
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface ALevel5Props {
  onCompletePage: (earnedScore: number) => void;
}

type Liquid = 'RED_RASPBERRY' | 'YELLOW_LEMON' | 'EMPTY' | 'MIXED_RUINED';

export const ALevel5_ThreeGlassesLab: React.FC<ALevel5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Glass contents state
  // Initial: Glass A = Red, Glass B = Yellow, Glass AUX = Empty
  const [glassA, setGlassA] = useState<Liquid>('RED_RASPBERRY');
  const [glassB, setGlassB] = useState<Liquid>('YELLOW_LEMON');
  const [glassAux, setGlassAux] = useState<Liquid>('EMPTY');

  const [selectedGlass, setSelectedGlass] = useState<'A' | 'B' | 'AUX' | null>(null);
  const [swapHistory, setSwapHistory] = useState<string[]>([]);
  const [labSuccess, setLabSuccess] = useState<boolean>(false);
  const [labRuined, setLabRuined] = useState<boolean>(false);
  const [labCooldown, setLabCooldown] = useState<number>(0);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);

  // Timer cooldown decrement
  useEffect(() => {
    if (labCooldown <= 0 && q1Cooldown <= 0 && q2Cooldown <= 0) return;
    const timer = setInterval(() => {
      if (labCooldown > 0) setLabCooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q1Cooldown > 0) setQ1Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q2Cooldown > 0) setQ2Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [labCooldown, q1Cooldown, q2Cooldown]);

  const handleSelectGlass = (target: 'A' | 'B' | 'AUX') => {
    if (labSuccess || labRuined || labCooldown > 0) return;

    if (!selectedGlass) {
      // Pick source glass
      const sourceContent = target === 'A' ? glassA : target === 'B' ? glassB : glassAux;
      if (sourceContent === 'EMPTY') return;
      sounds.playClick();
      setSelectedGlass(target);
    } else {
      // Attempt pour from selectedGlass to target
      if (selectedGlass === target) {
        setSelectedGlass(null);
        return;
      }

      const sourceContent = selectedGlass === 'A' ? glassA : selectedGlass === 'B' ? glassB : glassAux;
      const targetContent = target === 'A' ? glassA : target === 'B' ? glassB : glassAux;

      if (targetContent !== 'EMPTY') {
        // Ruined! Liquids mixed!
        sounds.playWrong();
        setLabRuined(true);
        setLabCooldown(5);
        if (target === 'A') setGlassA('MIXED_RUINED');
        else if (target === 'B') setGlassB('MIXED_RUINED');
        else setGlassAux('MIXED_RUINED');
        if (selectedGlass === 'A') setGlassA('EMPTY');
        else if (selectedGlass === 'B') setGlassB('EMPTY');
        else setGlassAux('EMPTY');
        setSelectedGlass(null);
        return;
      }

      // Valid Pour
      sounds.playSuccess();
      const stepText = `Turnat din Paharul ${selectedGlass} în Paharul ${target} (${target} = ${selectedGlass})`;
      setSwapHistory(prev => [...prev, stepText]);

      let newA = glassA;
      let newB = glassB;
      let newAux = glassAux;

      if (selectedGlass === 'A') newA = 'EMPTY';
      else if (selectedGlass === 'B') newB = 'EMPTY';
      else newAux = 'EMPTY';

      if (target === 'A') newA = sourceContent;
      else if (target === 'B') newB = sourceContent;
      else newAux = sourceContent;

      setGlassA(newA);
      setGlassB(newB);
      setGlassAux(newAux);
      setSelectedGlass(null);

      // Check success: Glass A has YELLOW_LEMON, Glass B has RED_RASPBERRY, Glass AUX is EMPTY
      if (newA === 'YELLOW_LEMON' && newB === 'RED_RASPBERRY' && newAux === 'EMPTY') {
        sounds.playVictory();
        setLabSuccess(true);
      }
    }
  };

  const handleResetLab = () => {
    sounds.playClick();
    setGlassA('RED_RASPBERRY');
    setGlassB('YELLOW_LEMON');
    setGlassAux('EMPTY');
    setSelectedGlass(null);
    setSwapHistory([]);
    setLabSuccess(false);
    setLabRuined(false);
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'aux_temp';
  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'aux_temp') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const isQ2Correct = q2Answer === 'three_assignments';
  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'three_assignments') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  // Scoring
  let correctCount = 0;
  if (labSuccess) correctCount += 2;
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 4;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  const renderGlassContent = (liquid: Liquid) => {
    if (liquid === 'RED_RASPBERRY') {
      return (
        <div className="w-full h-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-b-xl flex flex-col items-center justify-end p-2 text-white font-bold text-[10px] text-center shadow-inner">
          <span>Sirop de Zmeură (A)</span>
        </div>
      );
    }
    if (liquid === 'YELLOW_LEMON') {
      return (
        <div className="w-full h-full bg-gradient-to-t from-amber-500 to-yellow-300 rounded-b-xl flex flex-col items-center justify-end p-2 text-slate-950 font-black text-[10px] text-center shadow-inner">
          <span>Suc de Lămâie (B)</span>
        </div>
      );
    }
    if (liquid === 'MIXED_RUINED') {
      return (
        <div className="w-full h-full bg-gradient-to-t from-orange-950 to-orange-700 rounded-b-xl flex flex-col items-center justify-end p-2 text-white font-black text-[10px] text-center animate-pulse">
          <span>⚠️ Amestecat! (Eroare)</span>
        </div>
      );
    }
    return (
      <div className="w-full h-full border border-dashed border-slate-700 rounded-b-xl flex items-center justify-center text-[10px] text-slate-500 font-mono">
        Gol (Empty)
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-rose-950/60 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-purple-500/20 border border-purple-400/40 rounded-2xl text-purple-300 text-3xl shrink-0 shadow-inner">
            🧪
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5A • Page 5 of 7' : 'Modulul 5A • Pagina 5 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 60' : 'Manual pag. 60'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '5. The Three Glasses Rule: Swapping Two Values' : '5. Regula celor 3 Pahare: Interschimbarea a Două Valori'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'How can you swap the contents of Glass A (Red Syrup) and Glass B (Lemon Juice) without mixing them? Use an auxiliary empty glass (AUX) as a temporary memory holder!'
                : 'Cum poți muta siropul de zmeură din Paharul A în Paharul B și sucul de lămâie din B în A fără să le amesteci? Folosești un al treilea pahar gol auxiliar (AUX) drept memorie temporară!'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Interactive Three Glasses Pour Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Interactive Lab: The Liquid Swap Experiment' : 'Laborator Interactiv: Experimentul Interschimbării Lichidelor'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Click a glass to select it, then click an empty glass to pour' : 'Apasă pe un pahar pentru a-l selecta, apoi pe un pahar gol pentru a turna'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetLab}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset Glasses' : 'Resetează'}</span>
          </button>
        </div>

        {labCooldown > 0 && (
          <PedagogicalReflectionBanner
            cooldown={labCooldown}
            customMessageRo="Ai amestecat lichidele! Nu poți turna într-un pahar care nu este complet gol. Te rugăm să acorzi 5 secunde pentru a revedea algoritmul celor 3 pași."
            customMessageEn="Liquids mixed together! You cannot pour into a glass that is not empty. Please take 5 seconds to review the 3-step swap algorithm."
          />
        )}

        {/* 3 Glasses Visualizer */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 py-4">
          {/* Glass A */}
          <div
            onClick={() => handleSelectGlass('A')}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-3 transition cursor-pointer ${
              selectedGlass === 'A'
                ? 'bg-purple-950/60 border-purple-400 ring-4 ring-purple-500/30 scale-105 shadow-xl'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-mono font-bold text-slate-300">
              {lang === 'en' ? 'Glass A (Paharul A)' : 'Paharul A (Inițial: Roșu)'}
            </div>
            <div className="w-20 sm:w-24 h-32 rounded-b-2xl border-2 border-slate-600 border-t-0 p-1 bg-slate-900/50 relative overflow-hidden">
              {renderGlassContent(glassA)}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {glassA === 'RED_RASPBERRY' ? '🔴 Valoare A' : glassA === 'YELLOW_LEMON' ? '🟡 Valoare B' : '⚪ Gol'}
            </div>
          </div>

          {/* Glass AUX */}
          <div
            onClick={() => handleSelectGlass('AUX')}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-3 transition cursor-pointer ${
              selectedGlass === 'AUX'
                ? 'bg-purple-950/60 border-purple-400 ring-4 ring-purple-500/30 scale-105 shadow-xl'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-mono font-bold text-amber-400">
              {lang === 'en' ? 'Auxiliary Glass (AUX)' : 'Paharul Auxiliar (AUX)'}
            </div>
            <div className="w-20 sm:w-24 h-32 rounded-b-2xl border-2 border-amber-500/60 border-t-0 p-1 bg-slate-900/50 relative overflow-hidden">
              {renderGlassContent(glassAux)}
            </div>
            <div className="text-[11px] font-mono text-amber-400 font-bold">
              {glassAux === 'RED_RASPBERRY' ? '🔴 Stocare AUX' : glassAux === 'YELLOW_LEMON' ? '🟡 Stocare AUX' : '⚪ Pahar Gol'}
            </div>
          </div>

          {/* Glass B */}
          <div
            onClick={() => handleSelectGlass('B')}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-3 transition cursor-pointer ${
              selectedGlass === 'B'
                ? 'bg-purple-950/60 border-purple-400 ring-4 ring-purple-500/30 scale-105 shadow-xl'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-mono font-bold text-slate-300">
              {lang === 'en' ? 'Glass B (Paharul B)' : 'Paharul B (Inițial: Galben)'}
            </div>
            <div className="w-20 sm:w-24 h-32 rounded-b-2xl border-2 border-slate-600 border-t-0 p-1 bg-slate-900/50 relative overflow-hidden">
              {renderGlassContent(glassB)}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {glassB === 'RED_RASPBERRY' ? '🔴 Valoare A' : glassB === 'YELLOW_LEMON' ? '🟡 Valoare B' : '⚪ Gol'}
            </div>
          </div>
        </div>

        {/* Algorithm Pseudocode Step-by-Step Tracker */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-purple-400 font-bold uppercase">
            {lang === 'en' ? 'Computer Science Swap Algorithm (Pseudocod Interschimbare):' : 'Algoritmul de Interschimbare în Informatică:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
            <div className={`p-2.5 rounded-xl border ${swapHistory.length >= 1 ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              Pasul 1: AUX ← A
            </div>
            <div className={`p-2.5 rounded-xl border ${swapHistory.length >= 2 ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              Pasul 2: A ← B
            </div>
            <div className={`p-2.5 rounded-xl border ${swapHistory.length >= 3 && labSuccess ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              Pasul 3: B ← AUX
            </div>
          </div>

          {labSuccess && (
            <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'Victory! The values have been successfully swapped.' : 'Felicitări! Valorile au fost interschimbate cu succes conform manualului pag. 60!'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Variable Swapping' : 'Verifică-ți Cunoștințele: Interschimbarea Variabilelor'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Why is an auxiliary variable (AUX) strictly necessary to swap the values of two variables A and B?'
              : 'De ce este strict necesară o a treia variabilă auxiliară (AUX) pentru a schimba valorile dintre A și B?'}
          </div>

          {(q1Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza ce se întâmplă dacă scrii direct A = B (se pierde valoarea veche din A)."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on why writing A = B overwrites old value A."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'aux_temp', text: lang === 'en' ? 'A) Writing directly A = B overwrites and permanently destroys the old value of A' : 'A) Scrierea directă A = B suprascrie și distruge definitiv valoarea inițială a lui A' },
              { id: 'just_to_be_slow', text: lang === 'en' ? 'B) Only to make the code slower' : 'B) Doar pentru a face programul mai lent' },
              { id: 'hardware_requires_three', text: lang === 'en' ? 'C) Motherboards only have 3 memory slots' : 'C) Placa de bază are doar 3 sloturi' },
              { id: 'no_reason', text: lang === 'en' ? 'D) AUX is never actually used in real computers' : 'D) Nu este nevoie de AUX' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q1Cooldown > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  q1Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q1Answer === opt.id
                    ? opt.id === 'aux_temp'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_swap_q1"
            hintRo="Dacă torni direct din B în A, lichidul inițial din A este pierdut pentru totdeauna!"
            hintEn="If you pour directly from B into A, the initial liquid in A is permanently lost!"
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! AUX acts as a temporary safe holder so the original value of A is not erased.' : 'Exact! Variabila auxiliară AUX salvează temporar valoarea din A înainte ca aceasta să fie suprascrisă cu valoarea din B.')
                  : (lang === 'en' ? 'Incorrect. AUX prevents permanent data loss.' : 'Incorect. Fără AUX, valoarea inițială a lui A se pierde ireversibil.')
              }
              ruleReference="Manual TIC pag. 60"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which of the following represents the correct 3-step sequence to swap variables A and B?'
              : 'Care este secvența corectă a celor 3 atribuiri pentru interschimbarea valorilor variabilelor A și B?'}
          </div>

          {(q2Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza ordinea corectă: AUX=A, A=B, B=AUX."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the sequence: AUX=A, A=B, B=AUX."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'three_assignments', text: lang === 'en' ? 'A) 1. AUX = A   2. A = B   3. B = AUX' : 'A) 1. AUX = A    2. A = B    3. B = AUX' },
              { id: 'wrong_order_1', text: lang === 'en' ? 'B) 1. A = B   2. B = AUX   3. AUX = A' : 'B) 1. A = B    2. B = AUX    3. AUX = A' },
              { id: 'wrong_order_2', text: lang === 'en' ? 'C) 1. B = A   2. A = B   3. AUX = 0' : 'C) 1. B = A    2. A = B    3. AUX = 0' },
              { id: 'wrong_order_3', text: lang === 'en' ? 'D) 1. AUX = B   2. B = AUX   3. A = A' : 'D) 1. AUX = B    2. B = AUX    3. A = A' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer font-mono ${
                  q2Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q2Answer === opt.id
                    ? opt.id === 'three_assignments'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_swap_q2"
            hintRo="Mai întâi salvez A în AUX, apoi copiez B în A, apoi mut AUX în B."
            hintEn="First save A into AUX, then copy B into A, then move AUX into B."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Perfect! AUX = A, followed by A = B, followed by B = AUX is the universal swap pattern in programming.' : 'Perfect! Traseul clasic este: 1. AUX = A, 2. A = B, 3. B = AUX. Acest algoritm se folosește în toate limbajele de programare.')
                  : (lang === 'en' ? 'Incorrect. The correct sequence is AUX = A, A = B, B = AUX.' : 'Incorect. Ordinea corectă este AUX = A, A = B, B = AUX.')
              }
              ruleReference="Manual TIC pag. 60"
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
          sounds.playCorrect();
          onCompletePage(earnedScore);
        }}
      />
    </div>
  );
};
