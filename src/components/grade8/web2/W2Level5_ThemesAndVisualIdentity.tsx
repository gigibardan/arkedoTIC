import React, { useState } from 'react';
import {
  Palette,
  Type,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Eye,
  Sliders,
  Paintbrush
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface W2Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface SiteTheme {
  id: string;
  nameRo: string;
  nameEn: string;
  fontFamily: string;
  fontCategoryRo: string;
  fontCategoryEn: string;
  primaryColor: string;
  accentColor: string;
  descriptionRo: string;
  descriptionEn: string;
  recommendedTopicRo: string;
  recommendedTopicEn: string;
  buttonClass: string;
  headerBorder: string;
}

const OFFICIAL_THEMES: SiteTheme[] = [
  {
    id: 'simple',
    nameRo: 'Simplu (Simple)',
    nameEn: 'Simple',
    fontFamily: 'font-sans',
    fontCategoryRo: 'Sans-serif curat',
    fontCategoryEn: 'Clean Sans-serif',
    primaryColor: '#2563eb',
    accentColor: '#dbeafe',
    descriptionRo: 'Manual pag. 45: Tema implicită, axată pe simplitate, lizibilitate maximă și design minimalist.',
    descriptionEn: 'Curriculum p. 45: Default theme focused on simplicity, maximum readability, and minimalist design.',
    recommendedTopicRo: 'Orice proiect general, referat școlar sau prezentare academică simplă.',
    recommendedTopicEn: 'Any general project, school report, or clear academic presentation.',
    buttonClass: 'rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700',
    headerBorder: 'border-b-2 border-blue-600'
  },
  {
    id: 'aristotle',
    nameRo: 'Aristotel (Aristotle)',
    nameEn: 'Aristotle',
    fontFamily: 'font-serif',
    fontCategoryRo: 'Serif elegant & clasic',
    fontCategoryEn: 'Elegant & classic Serif',
    primaryColor: '#4f46e5',
    accentColor: '#e0e7ff',
    descriptionRo: 'Manual pag. 45: Temă distinsă, cu titluri elegante și font serif potrivit disciplinelor umaniste.',
    descriptionEn: 'Curriculum p. 45: Distinguished theme featuring refined headings and serif fonts ideal for humanities.',
    recommendedTopicRo: 'Reviste literare, eseuri de istorie, proiecte de limba română și filosofie.',
    recommendedTopicEn: 'Literary magazines, history essays, language arts, and philosophy projects.',
    buttonClass: 'rounded-none border-b-2 border-indigo-700 text-indigo-900 font-serif font-bold uppercase tracking-wider hover:bg-indigo-50',
    headerBorder: 'border-b-4 border-indigo-900'
  },
  {
    id: 'diplomat',
    nameRo: 'Diplomat (Diplomat)',
    nameEn: 'Diplomat',
    fontFamily: 'font-mono',
    fontCategoryRo: 'Monospace structurat & formal',
    fontCategoryEn: 'Structured & formal Monospace',
    primaryColor: '#0f766e',
    accentColor: '#ccfbf1',
    descriptionRo: 'Manual pag. 45: Aspect formal, sobru, potrivit pentru regulamente, procese verbale și rapoarte.',
    descriptionEn: 'Curriculum p. 45: Formal, structured look tailored for regulations, minutes, and institutional reports.',
    recommendedTopicRo: 'Consiliul elevilor, statutul școlii, ghiduri de securitate cibernetică.',
    recommendedTopicEn: 'Student council, school constitution, and cybersecurity guidelines.',
    buttonClass: 'rounded-sm bg-teal-800 text-white font-mono uppercase text-xs tracking-widest hover:bg-teal-900',
    headerBorder: 'border-b-2 border-teal-800'
  },
  {
    id: 'vision',
    nameRo: 'Viziune (Vision)',
    nameEn: 'Vision',
    fontFamily: 'font-sans',
    fontCategoryRo: 'Modern bold & vibrant',
    fontCategoryEn: 'Modern bold & vibrant',
    primaryColor: '#7c3aed',
    accentColor: '#f3e8ff',
    descriptionRo: 'Manual pag. 45: Design contemporan cu contrast ridicat, margini rotunjite și accente puternice.',
    descriptionEn: 'Curriculum p. 45: Contemporary high-contrast design with rounded corners and bold accent stripes.',
    recommendedTopicRo: 'Clubul de robotică, olimpiada de informatică, proiecte STEAM și inovație.',
    recommendedTopicEn: 'Robotics club, informatics olympiad, STEAM innovations, and hackathons.',
    buttonClass: 'rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md hover:scale-105 transition',
    headerBorder: 'border-b-4 border-purple-500'
  },
  {
    id: 'impression',
    nameRo: 'Impresie (Impression)',
    nameEn: 'Impression',
    fontFamily: 'font-sans',
    fontCategoryRo: 'Titluri masive all-caps',
    fontCategoryEn: 'Bold all-caps headings',
    primaryColor: '#dc2626',
    accentColor: '#fee2e2',
    descriptionRo: 'Manual pag. 45: Accente roșii / vișinii puternice, carcasă de titlu cu majuscule pentru impact vizual.',
    descriptionEn: 'Curriculum p. 45: Bold crimson accents with uppercase display headings designed for maximum visual punch.',
    recommendedTopicRo: 'Evenimente sportive, maratoane de voluntariat, campanii de ecologie.',
    recommendedTopicEn: 'Sports championships, volunteer marathons, and environmental campaigns.',
    buttonClass: 'rounded-none bg-rose-600 text-white font-black uppercase tracking-wider hover:bg-rose-700',
    headerBorder: 'border-b-4 border-rose-600'
  }
];

export const W2Level5_ThemesAndVisualIdentity: React.FC<W2Level5Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [activeThemeId, setActiveThemeId] = useState<string>('vision');

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (qId: string, optId: string) => {
    if (submitted[qId] || isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = answers[qId] === correctId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmitted(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  const currentTheme = OFFICIAL_THEMES.find(t => t.id === activeThemeId)!;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Palette className="w-5 h-5 text-purple-300" />
              <span>
                {lang === 'ro'
                  ? 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2B'
                  : 'Unit 2: Web Pages & Online Projects • Module 2B'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 5: Teme Grafice & Identitate Vizuală în Google Sites'
                : 'Lesson 5: Graphic Themes & Visual Identity in Google Sites'}
            </h1>
            <p className="text-purple-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 45: Înțelege cum funcționează stilizarea globală prin teme (Simplu, Aristotel, Diplomat, Viziune, Impresie) și asigură unitatea cromatică și tipografică a site-ului clasei.'
                : 'Curriculum p. 45: Understand global styling via built-in themes (Simple, Aristotle, Diplomat, Vision, Impression) and ensure harmonic typography and color identity across your class website.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-purple-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">5 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Fila „Teme” și Coerența Vizuală (Manual pag. 45)'
              : 'Theoretical Reference: "Themes" Tab and Visual Coherence (Curriculum p. 45)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-100 space-y-2">
            <div className="font-bold text-purple-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              {lang === 'ro' ? 'Unitate Globală' : 'Global Consistency'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Spre deosebire de un procesor de text unde schimbi fontul manual pe fiecare rând, o temă Google Sites se aplică automat pe toate paginile și subpaginile site-ului, garantând un aspect profesional unitar.'
                : 'Unlike word processors where you manually reformat every line, a Google Sites theme applies automatically across all pages and subpages, ensuring unified visual design.'}
            </p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-blue-600" />
              {lang === 'ro' ? 'Paleta de Culori' : 'Color Palette'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Fiecare temă conține 5 cercuri cromatice prestabilite, plus o pictogramă de găleată/pipetă pentru a introduce o culoare personalizată specifică identității școlii (cod Hexazecimal).'
                : 'Each theme provides 5 pre-set color swatches plus a paint bucket / dropper tool to enter a custom hex code matching your school brand.'}
            </p>
          </div>

          <div className="bg-pink-50/70 p-4 rounded-xl border border-pink-100 space-y-2">
            <div className="font-bold text-pink-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-pink-600" />
              {lang === 'ro' ? 'Stilul Fontului (Font Style)' : 'Font Style Variations'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Permite variația greutății tipografice: Ușor (Light), Clasic (Classic), Modern sau Îngroșat (Heavy), ajustând automat armonia dintre titlurile H1-H3 și paragrafele corp.'
                : 'Allows variations in typographical weight: Light, Classic, Modern, or Heavy, automatically harmonizing headings H1–H3 with body paragraphs.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Theme Switcher Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              {lang === 'ro'
                ? 'Simulator Interactiv: Comutator de Teme Google Sites (Fila „Teme”)'
                : 'Interactive Simulator: Google Sites Theme Switcher ("Themes" Tab)'}
            </h3>
          </div>
          <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
            {lang === 'ro' ? 'Laborator Vizual' : 'Visual Lab'}
          </span>
        </div>

        {/* Theme Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            {lang === 'ro'
              ? 'Alege Tema Oficială din Fila Dreaptă a Editorului:'
              : 'Select Official Theme from Right Sidebar Tab:'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {OFFICIAL_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveThemeId(t.id);
                  sounds.playClick();
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeThemeId === t.id
                    ? 'border-purple-600 bg-purple-50 shadow-md ring-2 ring-purple-300'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">
                    {lang === 'ro' ? t.nameRo.split(' ')[0] : t.nameEn}
                  </span>
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: t.primaryColor }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  {lang === 'ro' ? t.fontCategoryRo : t.fontCategoryEn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Mock Site Styled by Theme */}
        <div className="border border-slate-300 rounded-xl overflow-hidden shadow-lg bg-slate-50">
          {/* Mock Browser Header Bar */}
          <div className="bg-slate-200 px-4 py-2 border-b border-slate-300 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[11px] text-slate-500 ml-2">https://sites.google.com/view/infoteen-8</span>
            </div>
            <span className="font-semibold text-purple-700">
              {lang === 'ro' ? 'Tema Activă:' : 'Active Theme:'}{' '}
              <strong>{lang === 'ro' ? currentTheme.nameRo : currentTheme.nameEn}</strong>
            </span>
          </div>

          {/* Theme Dynamic Page Surface */}
          <div className={`p-6 bg-white space-y-6 ${currentTheme.fontFamily}`}>
            {/* Site Navigation Bar */}
            <div className={`flex items-center justify-between pb-3 ${currentTheme.headerBorder}`}>
              <div className="text-lg font-black tracking-tight" style={{ color: currentTheme.primaryColor }}>
                {lang === 'ro' ? 'REVISTA INFOTEEN' : 'INFOTEEN MAGAZINE'}
              </div>
              <div className="flex gap-4 text-xs font-semibold text-slate-600">
                <span className="cursor-pointer hover:text-slate-900 border-b-2" style={{ borderColor: currentTheme.primaryColor }}>
                  {lang === 'ro' ? 'Acasă' : 'Home'}
                </span>
                <span className="cursor-pointer hover:text-slate-900">
                  {lang === 'ro' ? 'Proiecte STEAM' : 'STEAM Projects'}
                </span>
                <span className="cursor-pointer hover:text-slate-900">
                  {lang === 'ro' ? 'Echipa Noastră' : 'Our Team'}
                </span>
                <span className="cursor-pointer hover:text-slate-900">
                  {lang === 'ro' ? 'Contact' : 'Contact'}
                </span>
              </div>
            </div>

            {/* Banner Section */}
            <div
              className="p-6 rounded-xl text-white shadow-md flex flex-col justify-center min-h-[140px]"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primaryColor}, #1e1b4b)`
              }}
            >
              <div className="text-xs uppercase tracking-widest text-white/80 font-bold mb-1">
                {lang === 'ro'
                  ? 'Portalul de Știință & Tehnologie al Elevilor'
                  : 'Student Science & Technology Web Portal'}
              </div>
              <h2 className="text-2xl font-black mb-2">
                {lang === 'ro'
                  ? 'Inovație, Algoritmi și Creativitate Digitală'
                  : 'Innovation, Algorithms & Digital Creativity'}
              </h2>
              <p className="text-xs text-white/90 max-w-xl">
                {lang === 'ro'
                  ? 'Descoperă cum clasa a VIII-a construiește viitorul digital prin robotică aplicată și pagini web interactive.'
                  : 'Discover how 8th grade students build the digital future through applied robotics and interactive web pages.'}
              </p>
            </div>

            {/* Content Section with Button */}
            <div className="grid md:grid-cols-2 gap-6 items-center pt-2">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'ro'
                    ? `De ce am ales tema ${currentTheme.nameRo}?`
                    : `Why choose the ${currentTheme.nameEn} theme?`}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ro' ? currentTheme.descriptionRo : currentTheme.descriptionEn}{' '}
                  {lang === 'ro' ? 'Este recomandată pentru: ' : 'Recommended for: '}
                  <strong>{lang === 'ro' ? currentTheme.recommendedTopicRo : currentTheme.recommendedTopicEn}</strong>
                </p>
                <div className="pt-2">
                  <button className={`px-5 py-2.5 text-xs transition ${currentTheme.buttonClass}`}>
                    {lang === 'ro' ? 'Explorează Articolele →' : 'Explore Articles →'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-600" />
                  {lang === 'ro' ? 'Proprietăți Vizuale Active:' : 'Active Visual Properties:'}
                </div>
                <div className="flex justify-between border-b pb-1 text-slate-600">
                  <span>{lang === 'ro' ? 'Font principal:' : 'Primary font:'}</span>
                  <span className="font-mono font-bold text-slate-900">
                    {lang === 'ro' ? currentTheme.fontCategoryRo : currentTheme.fontCategoryEn}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1 text-slate-600">
                  <span>{lang === 'ro' ? 'Culoare accent primar:' : 'Primary accent color:'}</span>
                  <span className="font-mono font-bold" style={{ color: currentTheme.primaryColor }}>
                    {currentTheme.primaryColor}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'ro' ? 'Armonizare automată:' : 'Auto synchronization:'}</span>
                  <span className="text-emerald-700 font-bold">
                    {lang === 'ro' ? '100% Pagini Sincronizate' : '100% Synchronized Pages'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            {lang === 'ro'
              ? 'Verificare Pedagogică: Teme & Identitate Vizuală (Manual pag. 45)'
              : 'Pedagogical Check: Themes & Visual Identity (Curriculum p. 45)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 1: Dacă decizi să schimbi tema site-ului din „Simplu” în „Viziune” sau „Aristotel”, cum sunt afectate celelalte pagini deja create în site?'
                : 'Requirement 1: If you switch the website theme from "Simple" to "Vision" or "Aristotle", how are existing pages across the site affected?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 45: O temă definește regulile stilistice globale ale întregului site (paleta de culori, fonturile de titlu, stilul butoanelor)."
              hintEn="Curriculum p. 45: A theme defines global styling rules for the entire site (color palette, title fonts, button corners)."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Doar prima pagină se schimbă, celelalte își păstrează vechea temă',
                labelEn: 'A. Only the first page changes; all others retain the old theme'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Toate paginile și subpaginile site-ului adoptă automat noua temă, păstrând unitatea grafică',
                labelEn: 'B. All pages and subpages automatically adopt the new theme, maintaining visual harmony'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Toate textele și imaginile de pe celelalte pagini sunt șterse ireversibil',
                labelEn: 'C. All texts and images on other pages are irreversibly erased'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Google Sites refuză schimbarea temei dacă există mai mult de 2 pagini',
                labelEn: 'D. Google Sites rejects theme switching if more than two pages exist'
              }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-purple-600 bg-purple-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Corect! Temele în Google Sites garantează coerența identității vizuale globale. La modificarea temei, toate paginile existente preiau automat noile fonturi, palete de culori și stiluri de butoane.'
                  : 'Correct! Google Sites themes guarantee global brand coherence. When changing a theme, all existing pages instantly inherit updated fonts, color schemes, and button aesthetics.'
              }
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 2: În fila „Teme”, pe lângă alegerea unei culori din cercurile prestabilite, cum poți folosi culoarea oficială a siglei școlii tale?'
                : 'Requirement 2: In the "Themes" tab, beyond default circle swatches, how can you set the exact official color of your school logo?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 45: Lângă cele 5 cercuri de culori implicite există o pictogramă specială (găleată/pipetă) ce permite specificarea unui cod hexazecimal custom."
              hintEn="Curriculum p. 45: Next to the 5 default color swatches, there is a special bucket/dropper icon allowing entry of a custom Hex color code."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Nu se poate, poți alege strict doar dintre cele 3 culori de bază alb, negru și gri',
                labelEn: 'A. Not possible, you are strictly limited to black, white, and gray'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Folosind opțiunea de culoare personalizată unde poți introduce codul de culoare hexazecimal (#Hex)',
                labelEn: 'B. Using the custom color option where you enter the precise hexadecimal color code (#Hex)'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Trimițând o cerere scrisă echipei Google prin fax',
                labelEn: 'C. Sending a physical fax letter to Google headquarters'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Doar dacă descarci site-ul pe calculator și rescrii fișierele cu Notepad',
                labelEn: 'D. Only by downloading raw files and editing them in Notepad'
              }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-purple-600 bg-purple-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Excelent! Opțiunea de culoare personalizată (Custom Color) permite introducerea codului HEX exact al brandului școlii (ex: #1E40AF pentru albastru marin regal), asigurând integrarea perfectă a siglei.'
                  : 'Excellent! The Custom Color option allows entering the exact Hex code of your school brand (e.g., #1E40AF for royal navy blue), ensuring seamless logo harmony.'
              }
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={5}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel={
          lang === 'ro'
            ? 'Continuă cu Lecția 6: Previzualizare Responsive & Testare Multi-Dispozitiv'
            : 'Continue to Lesson 6: Responsive Preview & Multi-Device Testing'
        }
      />
    </div>
  );
};
