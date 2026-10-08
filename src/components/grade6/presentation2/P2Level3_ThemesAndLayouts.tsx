import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Star,
  Check,
  Layout,
  Maximize2,
  Minimize2,
  Eye,
  Sliders,
  Paintbrush
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P2Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

type AspectRatio = '16:9' | '4:3';
type BackgroundType = 'solid' | 'gradient' | 'texture' | 'pattern';

interface ThemePreset {
  id: string;
  name: string;
  category: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

export const P2Level3_ThemesAndLayouts: React.FC<P2Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Theme & Aspect Ratio Simulator State
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [activeTheme, setActiveTheme] = useState<string>('cyber');
  const [bgType, setBgType] = useState<BackgroundType>('gradient');
  const [customColor, setCustomColor] = useState<string>('#0f172a');
  const [testedThemes, setTestedThemes] = useState<Record<string, boolean>>({ cyber: true });
  const [testedAspect, setTestedAspect] = useState<boolean>(false);

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const themes: ThemePreset[] = [
    {
      id: 'cyber',
      name: lang === 'en' ? 'Cyber Nebula' : 'Nebuloasa Cyber',
      category: lang === 'en' ? 'Tech / Modern' : 'Tehnologie / Modern',
      bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
      textColor: 'text-teal-300',
      accentColor: 'border-teal-400 text-teal-400',
      fontFamily: 'font-mono'
    },
    {
      id: 'nature',
      name: lang === 'en' ? 'Emerald Eco' : 'Ecosistem Emerald',
      category: lang === 'en' ? 'Nature / Biology' : 'Natură / Biologie',
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      textColor: 'text-emerald-300',
      accentColor: 'border-emerald-400 text-emerald-400',
      fontFamily: 'font-sans'
    },
    {
      id: 'academic',
      name: lang === 'en' ? 'Royal Scholar' : 'Studiu Academic',
      category: lang === 'en' ? 'History / Classic' : 'Istorie / Clasic',
      bgGradient: 'from-amber-950/90 via-stone-900 to-amber-950/70',
      textColor: 'text-amber-200',
      accentColor: 'border-amber-400 text-amber-400',
      fontFamily: 'font-serif'
    },
    {
      id: 'minimal',
      name: lang === 'en' ? 'Clean Minimalist' : 'Minimalist Curat',
      category: lang === 'en' ? 'Simplicity / Contrast' : 'Simplitate / Contrast',
      bgGradient: 'from-slate-900 to-slate-950',
      textColor: 'text-slate-100',
      accentColor: 'border-cyan-400 text-cyan-400',
      fontFamily: 'font-sans'
    }
  ];

  const currentTheme = themes.find(t => t.id === activeTheme) || themes[0];

  const handleSelectTheme = (id: string) => {
    sounds.playRetro('coin');
    setActiveTheme(id);
    setTestedThemes(prev => ({ ...prev, [id]: true }));
  };

  const handleToggleAspectRatio = (ratio: AspectRatio) => {
    sounds.playClick();
    setAspectRatio(ratio);
    setTestedAspect(true);
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'widescreen') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: Date.now() + 4000 }));
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'theme_uniformity') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: Date.now() + 4000 }));
    }
  };

  const isQ1Correct = q1Answer === 'widescreen';
  const isQ2Correct = q2Answer === 'theme_uniformity';
  const hasExploredThemes = Object.keys(testedThemes).length >= 2;
  const isComplete = hasExploredThemes && testedAspect && isQ1Correct && isQ2Correct;

  const handleFinish = () => {
    if (isComplete) {
      sounds.playVictory();
      onCompletePage(100);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Pedagogical Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-2 border-teal-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-400/40 text-[11px] font-mono font-bold text-teal-300 uppercase">
                  {lang === 'en' ? 'Unit 1 • Lesson 4 (p. 18-19)' : 'Unitatea 1 • Lecția 4 (pag. 18-19)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 3/7' : 'Ecranul 3/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'Themes, Backgrounds & Screen Formats' 
                  : 'Teme de Proiectare, Fundaluri & Rapoarte de Ecran'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-teal-300">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{lang === 'en' ? 'Standard 4:3 vs Widescreen 16:9' : 'Standard 4:3 vs Panoramic 16:9'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Theory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Themes & Variants */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-base">
            <Palette className="w-5 h-5 text-teal-400" />
            <span>{lang === 'en' ? 'Design Themes & Color Variants' : 'Teme de Proiectare (Design) & Variante'}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'A Theme is a coordinated package of colors, title/body fonts, and visual effects that ensures a harmonious and professional look across all slides in one click.'
              : 'O Temă de proiectare este un pachet coordonat de culori, fonturi de titlu/corp și efecte grafice care asigură un aspect unitar și profesionist pe toate diapozitivele cu un singur clic.'}
          </p>
          <div className="p-3 bg-teal-950/40 border border-teal-500/30 rounded-xl text-xs text-teal-200">
            💡 <strong>{lang === 'en' ? 'Pro Tip:' : 'Regulă:'}</strong> {lang === 'en' ? 'Use Variants in the Design tab to change color palettes without breaking the overall layout.' : 'Din fila Proiectare (Design), secțiunea Variante permite schimbarea paletei de culori păstrând structura temei.'}
          </div>
        </div>

        {/* Card 2: Aspect Ratio (Format Diapozitiv) */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
            <Layout className="w-5 h-5 text-indigo-400" />
            <span>{lang === 'en' ? 'Slide Dimensions & Screen Formats' : 'Dimensiunea Diapozitivelor (Aspect Ratio)'}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Modern displays use Widescreen (16:9), the standard for video projectors and monitors. Older CRT monitors used Standard (4:3).'
              : 'Monitoarele și videoproiectoarele moderne folosesc formatul Panoramic (16:9). Monitoarele clasice vechi sau foliile de retroproiector foloseau raportul Standard (4:3).'}
          </p>
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
            📺 <strong>{lang === 'en' ? 'Setting location:' : 'Unde se schimbă:'}</strong> {lang === 'en' ? 'Design Tab → Slide Size → Standard (4:3) / Widescreen (16:9).' : 'Fila Proiectare → Dimensiune diapozitiv → Standard (4:3) sau Ecran lat / Panoramic (16:9).'}
          </div>
        </div>
      </div>

      {/* Live Interactive Slide Theme Studio */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>{lang === 'en' ? 'Interactive Theme & Dimension Simulator' : 'Simulatorul Interactiv de Teme & Format de Ecran'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Experiment with themes, aspect ratios and background fills in real time!' : 'Testează temele, formatele de afișare și stilurile de fundal în timp real!'}
            </p>
          </div>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleToggleAspectRatio('16:9')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                aspectRatio === '16:9'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>16:9 (Panoramic)</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleAspectRatio('4:3')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                aspectRatio === '4:3'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>4:3 (Standard)</span>
            </button>
          </div>
        </div>

        {/* Theme Picker Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Paintbrush className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'en' ? 'Choose a Presentation Theme:' : 'Alege o Temă de Proiectare (Fila Design):'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {themes.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTheme(t.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTheme === t.id
                    ? 'border-teal-400 bg-teal-950/40 ring-2 ring-teal-400/40 shadow-lg'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="text-xs font-bold text-white mb-0.5">{t.name}</div>
                <div className="text-[10px] text-slate-400 mb-2">{t.category}</div>
                <div className={`h-3 rounded-full bg-gradient-to-r ${t.bgGradient} border border-slate-700`}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Slide Preview Canvas */}
        <div className="flex justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80">
          <div 
            className={`transition-all duration-300 rounded-xl border-2 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden bg-gradient-to-br ${currentTheme.bgGradient} ${currentTheme.accentColor.split(' ')[0]}`}
            style={{
              width: aspectRatio === '16:9' ? '100%' : '75%',
              maxWidth: aspectRatio === '16:9' ? '680px' : '510px',
              minHeight: '260px',
              aspectRatio: aspectRatio === '16:9' ? '16/9' : '4/3'
            }}
          >
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  {lang === 'en' ? 'Slide 1: Title & Presentation Header' : 'Diapozitivul 1: Titlu & Copertă'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${currentTheme.accentColor}`}>
                  {aspectRatio} • {currentTheme.name}
                </span>
              </div>

              <h3 className={`text-xl sm:text-2xl font-black ${currentTheme.textColor} ${currentTheme.fontFamily} tracking-tight mb-2`}>
                {lang === 'en' ? 'Exploring the Natural Wonders of Romania' : 'Minunile Naturale ale României'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                {lang === 'en' 
                  ? 'A multimedia study on biodiversity, national parks and eco-tourism in the Carpathians.' 
                  : 'Un studiu multimedia despre biodiversitate, parcuri naționale și ecoturism în Munții Carpați.'}
              </p>
            </div>

            {/* Slide Footer Elements */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/40 text-[11px] text-slate-400">
              <span>👤 {lang === 'en' ? 'Presenter: Student' : 'Prezentator: Elev TIC'}</span>
              <span>📅 {lang === 'en' ? 'Class VI • Art Klett' : 'Clasa a VI-a • Art Klett'}</span>
            </div>
          </div>
        </div>

        {/* Action Status Helper */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            {hasExploredThemes ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Themes explored' : 'Teme testate'}
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> {lang === 'en' ? 'Try at least 2 themes' : 'Testează minimum 2 teme'}
              </span>
            )}
            <span>•</span>
            {testedAspect ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Aspect ratio tested' : 'Format comutat'}
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Layout className="w-4 h-4" /> {lang === 'en' ? 'Toggle 16:9 / 4:3' : 'Comută 16:9 / 4:3'}
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px]">
            {lang === 'en' ? 'Fila Proiectare (Design) • Format Fundal' : 'Fila Proiectare (Design) • Format Fundal'}
          </span>
        </div>
      </div>

      {/* Practical Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quiz 1 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? '16:9 widescreen is standard for modern displays.' : 'Formatul 16:9 panoramic este standardul pentru ecrane late și videoproiectoare.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which slide aspect ratio is the current global standard for modern monitors and projectors?'
              : 'Care este formatul de ecran standard utilizat în prezent pe majoritatea monitoarelor și videoproiectoarelor moderne?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'standard43', label: lang === 'en' ? 'Standard (4:3) - square style' : 'Standard (4:3) - format aproape pătrat' },
              { id: 'widescreen', label: lang === 'en' ? 'Widescreen (16:9) - panoramic format' : 'Ecran lat / Panoramic (16:9)' },
              { id: 'vertical', label: lang === 'en' ? 'Portrait (9:16) - smartphone scroll' : 'Portret (9:16) - vertical' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'widescreen'
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
                      ? 'Correct! 16:9 Widescreen offers optimal horizontal space for multimedia presentations.'
                      : 'Excelent! Formatul 16:9 (Panoramic / Ecran lat) oferă spațiul orizontal optim pentru prezentări multimedia.')
                  : (lang === 'en'
                      ? 'Not quite. 4:3 is the old classic format, whereas 16:9 is the modern standard.'
                      : 'Nu chiar. 4:3 era formatul vechi pentru monitoare cu tub, iar 16:9 este standardul actual.')
              }
            />
          )}
        </div>

        {/* Quiz 2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'Themes ensure visual consistency across the entire slideshow.' : 'O temă aplică aceleași fonturi și culori pe toate diapozitivele.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What is the main benefit of applying a Design Theme to your presentation?'
              : 'Care este principalul avantaj al aplicării unei Teme de Proiectare (Design Theme)?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'theme_uniformity', label: lang === 'en' ? 'Guarantees aesthetic harmony, unified fonts and colors across all slides' : 'Garantează armonie vizuală, fonturi coordonate și culori unitare pe toate slide-urile' },
              { id: 'auto_speak', label: lang === 'en' ? 'PowerPoint will automatically speak for the presenter' : 'PowerPoint va citi cu voce tare textul automat' },
              { id: 'file_compress', label: lang === 'en' ? 'It reduces the presentation file size to 0 bytes' : 'Reduce dimensiunea fișierului la 0 octeți' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'theme_uniformity'
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
                      ? 'Spot on! Themes save time and maintain a cohesive, professional aesthetic.'
                      : 'Exact! O temă aplicată corect economisește timp și oferă prezentării un aspect impecabil și profesionist.')
                  : (lang === 'en'
                      ? 'Incorrect. Themes are purely visual and stylistic design systems.'
                      : 'Incorect. Temele sunt pachete vizuale de design (culori, fonturi, fundaluri).')
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
