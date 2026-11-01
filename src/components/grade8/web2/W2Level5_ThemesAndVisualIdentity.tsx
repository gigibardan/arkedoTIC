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

interface W2Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface SiteTheme {
  id: string;
  name: string;
  fontFamily: string;
  fontCategory: string;
  primaryColor: string;
  accentColor: string;
  description: string;
  recommendedTopic: string;
  buttonClass: string;
  headerBorder: string;
}

const OFFICIAL_THEMES: SiteTheme[] = [
  {
    id: 'simple',
    name: 'Simplu (Simple)',
    fontFamily: 'font-sans',
    fontCategory: 'Sans-serif curat',
    primaryColor: '#2563eb',
    accentColor: '#dbeafe',
    description: 'Manual pag. 45: Tema implicită, axată pe simplitate, lizibilitate maximă și design minimalist.',
    recommendedTopic: 'Orice proiect general, referat școlar sau prezentare academică simplă.',
    buttonClass: 'rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700',
    headerBorder: 'border-b-2 border-blue-600'
  },
  {
    id: 'aristotle',
    name: 'Aristotel (Aristotle)',
    fontFamily: 'font-serif',
    fontCategory: 'Serif elegant & clasic',
    primaryColor: '#4f46e5',
    accentColor: '#e0e7ff',
    description: 'Manual pag. 45: Temă distinsă, cu titluri elegante și font serif potrivit disciplinelor umaniste.',
    recommendedTopic: 'Reviste literare, eseuri de istorie, proiecte de limba română și filosofie.',
    buttonClass: 'rounded-none border-b-2 border-indigo-700 text-indigo-900 font-serif font-bold uppercase tracking-wider hover:bg-indigo-50',
    headerBorder: 'border-b-4 border-indigo-900'
  },
  {
    id: 'diplomat',
    name: 'Diplomat (Diplomat)',
    fontFamily: 'font-mono',
    fontCategory: 'Monospace structurat & formal',
    primaryColor: '#0f766e',
    accentColor: '#ccfbf1',
    description: 'Manual pag. 45: Aspect formal, sobru, potrivit pentru regulamente, procese verbale și rapoarte.',
    recommendedTopic: 'Consiliul elevilor, statutul școlii, ghiduri de securitate cibernetică.',
    buttonClass: 'rounded-sm bg-teal-800 text-white font-mono uppercase text-xs tracking-widest hover:bg-teal-900',
    headerBorder: 'border-b-2 border-teal-800'
  },
  {
    id: 'vision',
    name: 'Viziune (Vision)',
    fontFamily: 'font-sans',
    fontCategory: 'Modern bold & vibrant',
    primaryColor: '#7c3aed',
    accentColor: '#f3e8ff',
    description: 'Manual pag. 45: Design contemporan cu contrast ridicat, margini rotunjite și accente puternice.',
    recommendedTopic: 'Clubul de robotică, olimpiada de informatică, proiecte STEAM și inovație.',
    buttonClass: 'rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md hover:scale-105 transition',
    headerBorder: 'border-b-4 border-purple-500'
  },
  {
    id: 'impression',
    name: 'Impresie (Impression)',
    fontFamily: 'font-sans',
    fontCategory: 'Titluri masive all-caps',
    primaryColor: '#dc2626',
    accentColor: '#fee2e2',
    description: 'Manual pag. 45: Accente roșii / vișinii puternice, carcasă de titlu cu majuscule pentru impact vizual.',
    recommendedTopic: 'Evenimente sportive, maratoane de voluntariat, campanii de ecologie.',
    buttonClass: 'rounded-none bg-rose-600 text-white font-black uppercase tracking-wider hover:bg-rose-700',
    headerBorder: 'border-b-4 border-rose-600'
  }
];

export const W2Level5_ThemesAndVisualIdentity: React.FC<W2Level5Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [activeThemeId, setActiveThemeId] = useState<string>('vision');
  const [fontStyleOption, setFontStyleOption] = useState<'default' | 'classic' | 'heavy'>('default');

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
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2B</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 5: Teme Grafice & Identitate Vizuală în Google Sites
            </h1>
            <p className="text-purple-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 45: Înțelege cum funcționează stilizarea globală prin teme (Simplu, Aristotel, Diplomat, Viziune, Impresie) și asigură unitatea cromatică și tipografică a site-ului clasei.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-purple-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">5 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Fila „Teme” și Coerența Vizuală (Manual pag. 45)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-100 space-y-2">
            <div className="font-bold text-purple-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Unitate Globală
            </div>
            <p className="text-slate-600 text-xs">
              Spre deosebire de un procesor de text unde schimbi fontul manual pe fiecare rând, o temă Google Sites
              se aplică <strong>automat pe toate paginile și subpaginile</strong> site-ului, garantând un aspect profesional unitar.
            </p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-blue-600" />
              Paleta de Culori
            </div>
            <p className="text-slate-600 text-xs">
              Fiecare temă conține 5 cercuri cromatice prestabilite, plus o pictogramă de pipetă/găleată pentru a
              introduce o culoare personalizată specifică identității școlii (cod Hexazecimal).
            </p>
          </div>

          <div className="bg-pink-50/70 p-4 rounded-xl border border-pink-100 space-y-2">
            <div className="font-bold text-pink-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-pink-600" />
              Stilul Fontului (Font Style)
            </div>
            <p className="text-slate-600 text-xs">
              Permite variația greutății tipografice: <em>Ușor (Light)</em>, <em>Clasic (Classic)</em>, <em>Modern</em> sau <em>Îngroșat (Heavy)</em>, ajustând automat armonia dintre titlurile H1-H3 și paragrafele corp.
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
              Simulator Interactiv: Comutator de Teme Google Sites (Fila „Teme”)
            </h3>
          </div>
          <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
            Laborator Vizual
          </span>
        </div>

        {/* Theme Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Alege Tema Oficială din Fila Dreaptă a Editorului:
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
                  <span className="font-bold text-xs text-slate-900">{t.name.split(' ')[0]}</span>
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: t.primaryColor }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">{t.fontCategory}</div>
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
              Tema Activă: <strong>{currentTheme.name}</strong>
            </span>
          </div>

          {/* Theme Dynamic Page Surface */}
          <div className={`p-6 bg-white space-y-6 ${currentTheme.fontFamily}`}>
            {/* Site Navigation Bar */}
            <div className={`flex items-center justify-between pb-3 ${currentTheme.headerBorder}`}>
              <div className="text-lg font-black tracking-tight" style={{ color: currentTheme.primaryColor }}>
                REVISTA INFOTEEN
              </div>
              <div className="flex gap-4 text-xs font-semibold text-slate-600">
                <span className="cursor-pointer hover:text-slate-900 border-b-2" style={{ borderColor: currentTheme.primaryColor }}>Acasă</span>
                <span className="cursor-pointer hover:text-slate-900">Proiecte STEAM</span>
                <span className="cursor-pointer hover:text-slate-900">Echipa Noastră</span>
                <span className="cursor-pointer hover:text-slate-900">Contact</span>
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
                Portalul de Știință & Tehnologie al Elevilor
              </div>
              <h2 className="text-2xl font-black mb-2">
                Inovație, Algoritmi și Creativitate Digitală
              </h2>
              <p className="text-xs text-white/90 max-w-xl">
                Descoperă cum clasa a VIII-a construiește viitorul digital prin robotică aplicată și pagini web interactive.
              </p>
            </div>

            {/* Content Section with Button */}
            <div className="grid md:grid-cols-2 gap-6 items-center pt-2">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  De ce am ales tema {currentTheme.name}?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentTheme.description} Este recomandată pentru: <strong>{currentTheme.recommendedTopic}</strong>
                </p>
                <div className="pt-2">
                  <button className={`px-5 py-2.5 text-xs transition ${currentTheme.buttonClass}`}>
                    Explorează Articolele &rarr;
                  </button>
                </div>
              </div>

              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-600" />
                  Proprietăți Vizuale Active:
                </div>
                <div className="flex justify-between border-b pb-1 text-slate-600">
                  <span>Font principal:</span>
                  <span className="font-mono font-bold text-slate-900">{currentTheme.fontCategory}</span>
                </div>
                <div className="flex justify-between border-b pb-1 text-slate-600">
                  <span>Culoare accent primar:</span>
                  <span className="font-mono font-bold" style={{ color: currentTheme.primaryColor }}>
                    {currentTheme.primaryColor}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Armonizare automată:</span>
                  <span className="text-emerald-700 font-bold">100% Pagini Sincronizate</span>
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
            Verificare Pedagogică: Teme & Identitate Vizuală (Manual pag. 45)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Dacă decizi să schimbi tema site-ului din „Simplu” în „Viziune” sau „Aristotel”, cum sunt afectate celelalte pagini deja create în site?
            </span>
            <QuestionHint
              hint="Manual pag. 45: O temă definește regulile stilistice globale ale întregului site (paleta de culori, fonturile de titlu, stilul butoanelor)."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Doar prima pagină se schimbă, celelalte își păstrează vechea temă' },
              { id: 'opt_b', label: 'B. Toate paginile și subpaginile site-ului adoptă automat noua temă, păstrând unitatea grafică' },
              { id: 'opt_c', label: 'C. Toate textele și imaginile de pe celelalte pagini sunt șterse ireversibil' },
              { id: 'opt_d', label: 'D. Google Sites refuză schimbarea temei dacă există mai mult de 2 pagini' }
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
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Temele în Google Sites garantează coerența identității vizuale globale. La modificarea temei, toate paginile existente preiau automat noile fonturi, palete de culori și stiluri de butoane."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: În fila „Teme”, pe lângă alegerea unei culori din cercurile prestabilite, cum poți folosi culoarea oficială a siglei școlii tale?
            </span>
            <QuestionHint
              hint="Manual pag. 45: Lângă cele 5 cercuri de culori implicite există o pictogramă specială (găleată/pipetă) ce permite specificarea unui cod hexazecimal custom."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Nu se poate, poți alege strict doar dintre cele 3 culori de bază alb, negru și gri' },
              { id: 'opt_b', label: 'B. Folosind opțiunea de culoare personalizată unde poți introduce codul de culoare hexazecimal (#Hex)' },
              { id: 'opt_c', label: 'C. Trimițând o cerere scrisă echipei Google prin fax' },
              { id: 'opt_d', label: 'D. Doar dacă descarci site-ul pe calculator și rescrii fișierele cu Notepad' }
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
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Opțiunea de culoare personalizată (Custom Color) permite introducerea codului HEX exact al brandului școlii (ex: #1E40AF pentru albastru marin regal), asigurând integrarea perfectă a siglei."
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
        nextLabel="Continuă cu Lecția 6: Previzualizare Responsive & Testare Multi-Dispozitiv"
      />
    </div>
  );
};
