import React, { useState } from 'react';
import {
  FolderTree,
  FilePlus,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Maximize,
  Sliders,
  Menu
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W2Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface PageItem {
  id: string;
  name: string;
  nameEn: string;
  isHome?: boolean;
  subpages?: string[];
  subpagesEn?: string[];
  isHiddenFromNav?: boolean;
}

export const W2Level2_SiteHierarchyAndPages: React.FC<W2Level2Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

  // Site Hierarchy State
  const [pages, setPages] = useState<PageItem[]>([
    {
      id: 'home',
      name: 'Acasă (Home)',
      nameEn: 'Home',
      isHome: true
    },
    {
      id: 'projects',
      name: 'Proiecte Robotice',
      nameEn: 'Robotics Projects',
      subpages: ['Robot Autonom', 'Senzor Mediu'],
      subpagesEn: ['Autonomous Robot', 'Environmental Sensor']
    },
    {
      id: 'team',
      name: 'Echipa Noastră',
      nameEn: 'Our Team'
    },
    {
      id: 'contact',
      name: 'Contact',
      nameEn: 'Contact'
    }
  ]);

  const [headerType, setHeaderType] = useState<'titleOnly' | 'banner' | 'largeBanner' | 'cover'>('banner');
  const [activePageId, setActivePageId] = useState('projects');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const handleToggleHideNav = (pageId: string) => {
    sounds.playClick();
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return { ...p, isHiddenFromNav: !p.isHiddenFromNav };
      }
      return p;
    }));
  };

  const handleQuizAnswer = (qId: string, optIdx: number, isCorrect: boolean) => {
    if (quizSubmitted[qId] || isLocked(qId)) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const quizDone = Object.keys(quizSubmitted).length >= 2;

  const headerTypesList = [
    { id: 'titleOnly', labelRo: 'Doar titlu', labelEn: 'Title only' },
    { id: 'banner', labelRo: 'Banner', labelEn: 'Banner' },
    { id: 'largeBanner', labelRo: 'Banner mare', labelEn: 'Large banner' },
    { id: 'cover', labelRo: 'Copertă (Cover)', labelEn: 'Cover' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Pages 46–47' : 'Manual Art Klett 2025 • Pag. 46–47'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <FolderTree className="w-8 h-8 text-indigo-400" />
              {lang === 'en'
                ? 'Level 2: Site Architecture, Subpages & Header Types'
                : 'Nivelul 2: Arhitectura Sitului, Sub-pagini & Tipuri de Antet'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Structure a clean multi-page site: create subpages for dropdown menus, configure header layouts (Cover, Banner, Title Only), and toggle menu visibility.'
                : 'Organizează o structură clară multi-pagină: creează sub-pagini pentru meniul derulant (dropdown), configurează tipurile de antet (Cover, Banner, Title Only) și controlează vizibilitatea în navigație.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-indigo-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Header Format' : 'Format Antet'}
            </div>
            <div className="text-xl font-black text-indigo-400 uppercase">{headerType}</div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Header Size' : 'Dimensiune Header'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Site Architecture Studio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'Menu Simulator & Header Type Selector'
                  : 'Simulator de Meniu & Selector Tip Antet'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Explore the auto-generated menu and modify the page header format'
                  : 'Explorează meniul generat automat și schimbă formatul de antet al paginii'}
              </p>
            </div>
          </div>

          {/* Header Type Selector (Manual pag. 46) */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {headerTypesList.map(type => (
              <button
                key={type.id}
                onClick={() => { sounds.playClick(); setHeaderType(type.id as any); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  headerType === type.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? type.labelEn : type.labelRo}
              </button>
            ))}
          </div>
        </div>

        {/* Live Site Preview with Dropdown Navigation */}
        <div className="border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">
          {/* Site Navigation Bar */}
          <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-sm text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              ROBOTICS 2025
            </div>

            {/* Menu Items */}
            <div className="flex items-center gap-4 text-xs font-semibold relative">
              {pages.filter(p => !p.isHiddenFromNav).map(page => {
                const isSelected = activePageId === page.id;
                const hasSubpages = Boolean(page.subpages && page.subpages.length > 0);
                const pageDisplayName = lang === 'en' ? page.nameEn : page.name;
                const subpagesList = lang === 'en' ? (page.subpagesEn || page.subpages) : page.subpages;

                if (hasSubpages) {
                  return (
                    <div key={page.id} className="relative">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setActivePageId(page.id);
                          setDropdownOpen(!dropdownOpen);
                        }}
                        className={`flex items-center gap-1 py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
                          isSelected ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {pageDisplayName}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-20 space-y-1">
                          {subpagesList?.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              onClick={() => { sounds.playClick(); setDropdownOpen(false); }}
                              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-indigo-600 rounded-lg cursor-pointer"
                            >
                              ↳ {sub}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      sounds.playClick();
                      setActivePageId(page.id);
                      setDropdownOpen(false);
                    }}
                    className={`py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
                      isSelected ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {pageDisplayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Header / Banner Visualizer based on HeaderType */}
          <div
            className={`transition-all duration-300 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center text-center p-6 border-b border-slate-800 ${
              headerType === 'titleOnly' ? 'min-h-[90px]' :
              headerType === 'banner' ? 'min-h-[160px]' :
              headerType === 'largeBanner' ? 'min-h-[220px]' :
              'min-h-[300px]'
            }`}
          >
            <div className="max-w-md space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-800/40">
                {lang === 'en' ? `Header Type: ${headerType.toUpperCase()}` : `Tip Antet: ${headerType.toUpperCase()}`}
              </span>
              <h2 className={`font-black text-white ${
                headerType === 'titleOnly' ? 'text-xl' :
                headerType === 'cover' ? 'text-3xl sm:text-4xl' :
                'text-2xl sm:text-3xl'
              }`}>
                {lang === 'en' ? activePage.nameEn : activePage.name}
              </h2>
              {headerType !== 'titleOnly' && (
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {lang === 'en'
                    ? 'Collaborative design project created by 8th-grade students.'
                    : 'Platformă colaborativă de proiectare realizată de elevii clasei a VIII-a.'}
                </p>
              )}
            </div>
          </div>

          {/* Page Body Placeholder */}
          <div className="p-6 bg-slate-950 text-slate-400 text-xs text-center italic">
            {lang === 'en'
              ? `Specific content for page "${activePage.nameEn}" (text & image blocks) renders here.`
              : `Conținutul specific paginii „${activePage.name}” (blocurile de text și imagini) este afișat aici.`}
          </div>
        </div>

        {/* Pages Tab Hierarchy Controller (Manual pag. 47) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>
              {lang === 'en'
                ? 'Pages Tree ("Pages" Tab in Right Sidebar):'
                : 'Arborele Paginilor (Fila „Pagini” din Panoul Lateral):'}
            </span>
            <span className="text-slate-500 text-[11px] font-mono">
              {lang === 'en' ? 'Options: hide from navigation' : 'Opțiuni: ascundere din navigație'}
            </span>
          </div>

          <div className="space-y-2">
            {pages.map(page => (
              <div
                key={page.id}
                className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-indigo-400">📄</span>
                  <span className="font-bold text-white">
                    {lang === 'en' ? page.nameEn : page.name}
                  </span>
                  {page.isHome && (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {lang === 'en' ? 'Home' : 'Acasă'}
                    </span>
                  )}
                  {page.subpages && (
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono border border-indigo-800/40">
                      {lang === 'en'
                        ? `${page.subpages.length} subpages (Dropdown Menu)`
                        : `${page.subpages.length} sub-pagini (Meniu Derulant)`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleHideNav(page.id)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      page.isHiddenFromNav
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {page.isHiddenFromNav ? (
                      <>
                        <EyeOff className="w-3 h-3 text-amber-400" />
                        {lang === 'en' ? 'Hidden from menu' : 'Ascunsă din meniu'}
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 text-emerald-400" />
                        {lang === 'en' ? 'Visible in menu' : 'Vizibilă în meniu'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Navigation & Page Architecture'
                : 'Reflecție Pedagogică: Navigarea & Structurarea Paginilor'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Art Klett Manual pages 46–47' : 'Manual Art Klett pag. 46–47'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '1. How do you create a dropdown navigation menu on a website built with Google Sites?'
              : '1. Cum se creează un meniu derulant (dropdown menu) în bara de navigare a unui sit realizat cu Google Sites?'}
          </div>
          <QuestionHint
            hintRo="Observă legătura dintre o pagină principală și paginile subordonate ei."
            hintEn="Notice the hierarchy between a parent page and its child subpages."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'În fila „Pagini”, adăugăm o subpagină (Add subpage) sub o pagină părinte sau glisăm o pagină peste alta',
                textEn: 'In the "Pages" tab, choose "Add subpage" under a parent page or drag and drop one page over another',
                correct: true
              },
              {
                textRo: 'Scriem manual 100 de linii de cod JavaScript',
                textEn: 'Hand-code 100 lines of custom JavaScript',
                correct: false
              },
              {
                textRo: 'Meniul derulant nu este posibil în Google Sites',
                textEn: 'Dropdown menus are impossible in Google Sites',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w2_l2_q1';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w2_l2_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w2_l2_q1'] || 0} />
          )}
          {quizSubmitted['w2_l2_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Textbook page 46: Any nested subpage automatically becomes a dropdown item shown when hovering over or tapping the parent page link.'
                : 'Corect! Manual pag. 46: Orice sub-pagină adăugată devine automat element într-un meniu derulant compact afișat la trecerea cursorului peste pagina părinte.'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. When is it advantageous to utilize the "Title Only" header type option?'
              : <>2. Când este util să folosești opțiunea <span className="text-indigo-400 font-bold">„Doar titlu” (Title Only)</span> ca tip de antet?</>}
          </div>
          <QuestionHint
            hintRo="Gândește-te la pagini lungi care conțin tabele, baze de date sau formulare unde imaginea de fundal ar consuma prea mult spațiu."
            hintEn="Think of data-dense pages containing tables or forms where a large image banner would push core content below the fold."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Pentru paginile dense de lucru sau formulare unde dorim ca utilizatorul să vadă conținutul util imediat fără a derula pe verticală',
                textEn: 'For data-dense worksheets or forms where visitors need immediate above-the-fold access without vertical scrolling',
                correct: true
              },
              {
                textRo: 'Doar dacă nu avem conexiune la internet',
                textEn: 'Only when offline without Internet connectivity',
                correct: false
              },
              {
                textRo: 'Pentru că Google Sites interzice imaginile pe orice pagină secundară',
                textEn: 'Because Google Sites prohibits images on secondary subpages',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w2_l2_q2';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w2_l2_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w2_l2_q2'] || 0} />
          )}
          {quizSubmitted['w2_l2_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exactly! Textbook page 46: "Title only" strips out the decorative banner photo, maximizing usable viewport real estate for functional content.'
                : 'Exact! Manual pag. 46: Tipul „Doar titlu” elimină imaginea decorativă de fundal și maximizează spațiul vizual util al pânzei pentru date sau tabele.'}
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={quizDone}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel={lang === 'en'
          ? 'To Level 3: Content Blocks & Predefined Layouts'
          : 'Spre Nivelul 3: Blocuri de Conținut & Machete Predefinite'}
      />
    </div>
  );
};
