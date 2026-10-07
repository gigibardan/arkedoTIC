import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Star, 
  Check, 
  AlertTriangle, 
  Eye, 
  Type, 
  Palette, 
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P2Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P2Level5_DesignGoldenRules: React.FC<P2Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Diagnostic Slide Repair Simulator State
  const [fixWords, setFixWords] = useState<boolean>(false);
  const [fixContrast, setFixContrast] = useState<boolean>(false);
  const [fixFonts, setFixFonts] = useState<boolean>(false);
  const [fixImages, setFixImages] = useState<boolean>(false);

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleToggleFix = (fix: 'words' | 'contrast' | 'fonts' | 'images') => {
    sounds.playRetro('coin');
    if (fix === 'words') setFixWords(prev => !prev);
    if (fix === 'contrast') setFixContrast(prev => !prev);
    if (fix === 'fonts') setFixFonts(prev => !prev);
    if (fix === 'images') setFixImages(prev => !prev);
  };

  const allFixesApplied = fixWords && fixContrast && fixFonts && fixImages;

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'rule_40_words') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: Date.now() + 4000 }));
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'high_contrast') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: Date.now() + 4000 }));
    }
  };

  const isQ1Correct = q1Answer === 'rule_40_words';
  const isQ2Correct = q2Answer === 'high_contrast';
  const isComplete = allFixesApplied && isQ1Correct && isQ2Correct;

  const handleFinish = () => {
    if (isComplete) {
      sounds.playVictory();
      onCompletePage(100);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Pedagogical Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-2 border-teal-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[11px] font-mono font-bold text-amber-300 uppercase">
                  {lang === 'en' ? 'Unit 1 • Lesson 5 (p. 20-21)' : 'Unitatea 1 • Lecția 5 (pag. 20-21)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 5/7' : 'Ecranul 5/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'Golden Rules of Presentation Design' 
                  : 'Regulile de Aur ale Designului unei Prezentări'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'en' ? 'Simplicity & High Contrast' : 'Simplitate, Contrast & Regula 6x6'}</span>
          </div>
        </div>
      </div>

      {/* The 4 Golden Rules Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-2xl">📝</div>
            <h3 className="text-sm font-bold text-teal-300">
              {lang === 'en' ? '1. The 40 Words / 6x6 Rule' : '1. Regula celor 40 de Cuvinte'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'A slide is visual support, not an essay. Max 6 bullet points with 6 words each.'
                : 'Diapozitivul este un sprijin vizual, nu un roman! Maximum 6 rânduri cu câte 6 cuvinte (sub 40 cuvinte pe slide).'}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-mono text-teal-400 bg-teal-950/40 p-1.5 rounded border border-teal-500/20">
            Fără blocuri uriașe de text
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-2xl">🌓</div>
            <h3 className="text-sm font-bold text-amber-300">
              {lang === 'en' ? '2. Strong Contrast' : '2. Contrastul Puternic'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Light text on dark background OR dark text on light background. Never yellow on white.'
                : 'Scris deschis pe fundal întunecat SAU scris închis pe fundal alb. Niciodată text galben pe alb sau albastru pe negru.'}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-mono text-amber-400 bg-amber-950/40 p-1.5 rounded border border-amber-500/20">
            Lizibilitate din ultima bancă
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-2xl">🎨</div>
            <h3 className="text-sm font-bold text-indigo-300">
              {lang === 'en' ? '3. Max 3 Colors & 2 Fonts' : '3. Regula Celor 3 Culori'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Limit each presentation to maximum 2-3 harmonious colors and 2 clean font styles.'
                : 'Folosește maximum 3 culori complementare și 2 fonturi curate (unul pentru titlu, altul pentru textul explicativ).'}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-mono text-indigo-400 bg-indigo-950/40 p-1.5 rounded border border-indigo-500/20">
            Unitate stilistică profesională
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-2xl">🖼️</div>
            <h3 className="text-sm font-bold text-emerald-300">
              {lang === 'en' ? '4. High-Quality Media' : '4. Imagini Clare & Raportate'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Use clear, unpixelated images. Redimension from corners using Shift to preserve aspect ratio.'
                : 'Folosește fotografii la rezoluție bună. Redimensionează întotdeauna de la colțuri (cu Shift) pentru a nu deforma imaginea.'}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-500/20">
            Fără deformări sau watermark-uri
          </div>
        </div>
      </div>

      {/* Interactive Slide Diagnostic & Repair Clinic */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{lang === 'en' ? 'Interactive Slide Diagnostic & Repair Clinic' : 'Clinica de Reparare a Diapozitivelor (Fix the Slide!)'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' 
                ? 'This slide has 4 severe design flaws. Apply the golden rules to turn it into a championship presentation!' 
                : 'Acest diapozitiv conține 4 greșeli majore de design. Bifează corecturile pentru a-l transforma într-un slide perfect!'}
            </p>
          </div>

          <div className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
            allFixesApplied
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
          }`}>
            {allFixesApplied ? '🏆 Slide-ul este acum PRO!' : '⚠️ 4 Greșeli Detectate'}
          </div>
        </div>

        {/* Diagnostic Checkbox Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => handleToggleFix('words')}
            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
              fixWords
                ? 'bg-teal-950/60 border-teal-400 text-teal-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
              fixWords ? 'bg-teal-400 text-slate-950 border-teal-300' : 'border-slate-600'
            }`}>
              {fixWords && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span>1. Sintetizează textul (Regula 40 cuvinte)</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleFix('contrast')}
            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
              fixContrast
                ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
              fixContrast ? 'bg-amber-400 text-slate-950 border-amber-300' : 'border-slate-600'
            }`}>
              {fixContrast && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span>2. Corectează Contrastul (Fundal vs Text)</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleFix('fonts')}
            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
              fixFonts
                ? 'bg-indigo-950/60 border-indigo-400 text-indigo-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
              fixFonts ? 'bg-indigo-400 text-slate-950 border-indigo-300' : 'border-slate-600'
            }`}>
              {fixFonts && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span>3. Limitează la 2 Fonturi Curate</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleFix('images')}
            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
              fixImages
                ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
              fixImages ? 'bg-emerald-400 text-slate-950 border-emerald-300' : 'border-slate-600'
            }`}>
              {fixImages && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span>4. Înlocuiește cu Imagine HD Proporțională</span>
          </button>
        </div>

        {/* Live Dynamic Slide Canvas */}
        <div className="flex justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div 
            className={`w-full max-w-2xl rounded-2xl p-6 transition-all duration-300 border-2 shadow-2xl ${
              fixContrast
                ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-teal-400/60 text-slate-100'
                : 'bg-slate-300 border-rose-500 text-yellow-300'
            }`}
            style={{ minHeight: '260px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-2 mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-widest ${fixContrast ? 'text-teal-400' : 'text-slate-700'}`}>
                {allFixesApplied ? '✅ PREZENTARE PROFESIONALĂ' : '❌ DIAPOZITIV CU ERORI GRAVE'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                allFixesApplied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {allFixesApplied ? 'Design Rating: 10/10' : 'Design Rating: 2/10'}
              </span>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <h3 className={`text-xl font-black mb-2 ${
                  fixFonts 
                    ? 'font-sans tracking-tight text-teal-300' 
                    : 'font-serif italic text-pink-500 underline'
                } ${!fixContrast ? 'text-yellow-400 drop-shadow' : ''}`}>
                  {lang === 'en' ? 'Energy of the Future' : 'Energia Viitorului: Panouri Solare'}
                </h3>

                {fixWords ? (
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <span>Sursă inepuizabilă și 100% curată</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <span>Eficiență crescută cu 40% în 2026</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <span>Independență energetică pentru școli</span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-[10px] text-slate-500 italic leading-tight">
                    Energia solară este energia produsă prin transformarea luminii solare în curent electric cu ajutorul celulelor fotovoltaice inventate în secolul trecut și perfecționate continuu de ingineri din toată lumea care au calculat că soarele oferă zilnic mai multă energie decât consumă toată omenirea într-un an întreg... (prea mult text plictisitor!)
                  </p>
                )}
              </div>

              {/* Graphic Asset */}
              <div className="flex justify-center">
                {fixImages ? (
                  <div className="w-40 h-32 rounded-xl bg-gradient-to-br from-amber-500/20 to-teal-500/30 border border-teal-400/50 flex flex-col items-center justify-center p-2 text-center shadow-lg">
                    <span className="text-4xl mb-1">☀️🔋</span>
                    <span className="text-[10px] font-mono font-bold text-teal-300">Panou Fotovoltaic HD</span>
                  </div>
                ) : (
                  <div className="w-52 h-16 bg-rose-900/60 border-2 border-rose-500 rounded flex flex-col items-center justify-center text-center p-1">
                    <span className="text-xs text-rose-300 font-bold">⚠️ Imagine Deformată & Pixelată</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Helper Footer */}
        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <span className={allFixesApplied ? 'text-emerald-400' : 'text-amber-400'}>
            {allFixesApplied 
              ? '✨ Felicitări! Ai aplicat toate cele 4 reguli de aur!' 
              : '👉 Bifează toate cele 4 opțiuni de mai sus pentru a finaliza repararea diapozitivului.'}
          </span>
          <span className="text-slate-400 text-[11px]">Manual pag. 20-21</span>
        </div>
      </div>

      {/* Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quiz 1 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'Slides are visual summaries, not essays.' : 'Prezentarea este doar un suport grafic, restul îl explică vorbitorul.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Why is it a mistake to copy long paragraphs of text onto a PowerPoint slide?'
              : 'De ce este o greșeală majoră să copiem paragrafe lungi de text pe un diapozitiv PowerPoint?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'rule_40_words', label: lang === 'en' ? 'The audience will read the text instead of listening to the presenter, causing fatigue' : 'Publicul va citi textul în loc să asculte prezentatorul, devenind plictisit și obosit' },
              { id: 'powerpoint_slow', label: lang === 'en' ? 'PowerPoint refuses to save slides with more than 10 words' : 'PowerPoint se blochează dacă are mai mult de 10 cuvinte' },
              { id: 'no_problem', label: lang === 'en' ? 'It is not a mistake; slides should contain the whole textbook' : 'Nu este o greșeală, slide-ul trebuie să conțină tot manualul' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'rule_40_words'
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
                      ? 'Spot on! Presenters use bullet points so the focus remains on spoken communication.'
                      : 'Exact! Folosim idei principale și cuvinte-cheie pentru ca publicul să fie atent la ceea ce rostim.')
                  : (lang === 'en'
                      ? 'Incorrect. Text overload is known as "Death by PowerPoint".'
                      : 'Incorect. Supraîncărcarea cu text distruge atenția publicului.')
              }
            />
          )}
        </div>

        {/* Quiz 2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'Contrast makes words legible from the very back row of the classroom.' : 'Contrastul mare asigură lizibilitatea textului chiar și din ultima bancă.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which of the following color combinations violates the High Contrast design rule?'
              : 'Care dintre următoarele combinații de culori ÎNCALCĂ grav regula contrastului?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'high_contrast', label: lang === 'en' ? 'Yellow text written on a pure white background' : 'Text Galben deschis scris pe un fundal Alb pur' },
              { id: 'white_on_dark', label: lang === 'en' ? 'White text written on a dark navy blue background' : 'Text Alb scris pe un fundal Bleumarin închis' },
              { id: 'black_on_white', label: lang === 'en' ? 'Dark grey/black text on a clean white background' : 'Text Negru / Gri închis pe fundal Alb' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'high_contrast'
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
                      ? 'Correct! Yellow on white is virtually invisible under a projector.'
                      : 'Corect! Galbenul pe alb este aproape invizibil pe videoproiector și obosește ochii.')
                  : (lang === 'en'
                      ? 'Not quite. Dark on light or light on dark are both great examples of high contrast.'
                      : 'Nu chiar. Scrisul alb pe bleumarin sau negru pe alb oferă un contrast optim.')
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
