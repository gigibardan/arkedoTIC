import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Clock, Star, User } from 'lucide-react';
import { AllMissionId } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ArkyProvider } from './context/ArkyContext';
import { HintProvider } from './context/HintContext';
import { ThemeProvider } from './context/ThemeContext';
import { MascotaArky } from './components/MascotaArky';
import { Header } from './components/Header';
import { CoursesCatalog } from './components/CoursesCatalog';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { Footer } from './components/Footer';
import type { LegalTabType } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { UpdateToast } from './components/pwa/UpdateToast';
import { ReportIssueProvider, useReportIssue } from './context/ReportIssueContext';
import { ReportIssueButton } from './components/ReportIssueButton';

const MissionStage = lazy(() => import('./components/MissionStage').then((m) => ({ default: m.MissionStage })));
const LegalModal = lazy(() => import('./components/LegalModal').then((m) => ({ default: m.LegalModal })));
const ReportIssueModal = lazy(() => import('./components/ReportIssueModal').then((m) => ({ default: m.ReportIssueModal })));
import { useMissionProgress } from './hooks/useMissionProgress';
import { recordDailyActivityAndStreak } from './lib/studentAuthService';
import { sounds } from './utils/audio';
import { forceScrollToTop } from './utils/scrollHelper';
import { updateDynamicSeo } from './utils/seoManager';
import { setAppSessionBusy } from './utils/appUpdater';

// Lazy-loaded Hubs & Admin Consoles
const TeacherPortal = lazy(() => import('./components/TeacherPortal').then((m) => ({ default: m.TeacherPortal })));
const SuperAdminDashboard = lazy(() => import('./components/superadmin/SuperAdminDashboard').then((m) => ({ default: m.SuperAdminDashboard })));
const ArcadeHub = lazy(() => import('./components/minigames/ArcadeHub').then((m) => ({ default: m.ArcadeHub })));
const DuelArena = lazy(() => import('./components/DuelArena').then((m) => ({ default: m.DuelArena })));
const CyberCityView = lazy(() => import('./components/cybercity/CyberCityView').then((m) => ({ default: m.CyberCityView })));
const BlogHub = lazy(() => import('./components/blog/BlogHub').then((m) => ({ default: m.BlogHub })));
const GlossaryHub = lazy(() => import('./components/glossary/GlossaryHub').then((m) => ({ default: m.GlossaryHub })));
const CodeSandboxHub = lazy(() => import('./components/sandbox/CodeSandboxHub').then((m) => ({ default: m.CodeSandboxHub })));
const DigitalCarnetHub = lazy(() => import('./components/carnet/DigitalCarnetHub').then((m) => ({ default: m.DigitalCarnetHub })));
const QuickEvalSimulator = lazy(() => import('./components/evaluation/QuickEvalSimulator').then((m) => ({ default: m.QuickEvalSimulator })));
const StudentLiveQuizPlayer = lazy(() => import('./components/evaluation/StudentLiveQuizPlayer').then((m) => ({ default: m.StudentLiveQuizPlayer })));
const WorksheetsHub = lazy(() => import('./components/worksheets/WorksheetsHub').then((m) => ({ default: m.WorksheetsHub })));
const LeonidaUniverseHub = lazy(() => import('./components/leonida/LeonidaUniverseHub').then((m) => ({ default: m.LeonidaUniverseHub })));
const AiDeepfakeLabHub = lazy(() => import('./components/ailab/AiDeepfakeLabHub').then((m) => ({ default: m.AiDeepfakeLabHub })));
const AlgoCpuLabHub = lazy(() => import('./components/algolab/AlgoCpuLabHub').then((m) => ({ default: m.AlgoCpuLabHub })));

export type AppView =
  | 'catalog'
  | 'lesson'
  | 'teacher'
  | 'arcade'
  | 'duel'
  | 'city'
  | 'superadmin'
  | 'blog'
  | 'glossary'
  | 'sandbox'
  | 'carnet'
  | 'evaluare'
  | 'livequiz'
  | 'fise'
  | 'leonida'
  | 'ailab'
  | 'algolab';

function parseBlogSlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/^\/blog(?:\/en)?\/([^/]+)\/?$/i);
  if (match?.[1]) return decodeURIComponent(match[1]);
  const hashMatch = window.location.hash.match(/^#blog\/(.+)$/i);
  if (hashMatch?.[1]) return decodeURIComponent(hashMatch[1]);
  return null;
}

function parseGlossarySlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/^\/glosar(?:\/en)?\/([^/]+)\/?$/i);
  if (match?.[1]) return decodeURIComponent(match[1]);
  const hashMatch = window.location.hash.match(/^#glosar\/(.+)$/i);
  if (hashMatch?.[1]) return decodeURIComponent(hashMatch[1]);
  return null;
}

function parseWorksheetSlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/^\/fise(?:\/en)?\/([^/]+)\/?$/i);
  if (match?.[1]) return decodeURIComponent(match[1]);
  const hashMatch = window.location.hash.match(/^#fise\/(.+)$/i);
  if (hashMatch?.[1]) return decodeURIComponent(hashMatch[1]);
  return null;
}

function resolveViewFromLocation(): AppView {
  if (typeof window === 'undefined') return 'catalog';
  const { pathname, hash, search } = window.location;
  const params = new URLSearchParams(search);
  if (params.get('game') || params.get('arcade')) return 'arcade';
  if (params.get('mode') || params.get('duel')) return 'duel';
  if (pathname.includes('/superadmin') || hash.includes('superadmin')) return 'superadmin';
  if (pathname.includes('/profesor') || hash.includes('profesor')) return 'teacher';
  if (pathname.includes('/arcade') || hash.includes('arcade')) return 'arcade';
  if (pathname.includes('/duel') || hash.includes('duel')) return 'duel';
  if (pathname.includes('/city') || pathname.includes('/oras') || hash.includes('city') || hash.includes('oras')) return 'city';
  if (pathname.startsWith('/blog') || hash.startsWith('#blog')) return 'blog';
  if (pathname.startsWith('/glosar') || hash.startsWith('#glosar')) return 'glossary';
  if (pathname.startsWith('/leonida') || hash.startsWith('#leonida') || params.get('view') === 'leonida') return 'leonida';
  if (pathname.startsWith('/laborator-ai') || hash.startsWith('#laborator-ai') || params.get('view') === 'ailab') return 'ailab';
  if (pathname.startsWith('/laborator-algoritmi') || hash.startsWith('#laborator-algoritmi') || params.get('view') === 'algolab') return 'algolab';
  if (pathname.startsWith('/fise') || hash.startsWith('#fise')) return 'fise';
  if (pathname.startsWith('/sandbox') || pathname.startsWith('/olimpiada') || hash.startsWith('#sandbox') || hash.startsWith('#olimpiada')) return 'sandbox';
  if (pathname.startsWith('/carnet') || hash.startsWith('#carnet')) return 'carnet';
  if (pathname.startsWith('/evaluare') || hash.startsWith('#evaluare')) return 'evaluare';
  if (pathname.startsWith('/quiz-live') || hash.startsWith('#quiz-live')) return 'livequiz';
  return 'catalog';
}

function parseSandboxTabFromUrl(): 'editor' | 'trace' | 'olympiad' {
  if (typeof window === 'undefined') return 'editor';
  const { pathname, hash, search } = window.location;
  const params = new URLSearchParams(search);
  const tab = params.get('tab');
  if (tab === 'trace' || tab === 'olympiad') return tab;
  if (pathname.includes('/olimpiada') || hash.includes('olimpiada')) return 'olympiad';
  if (pathname.includes('/trace') || hash.includes('trace')) return 'trace';
  return 'editor';
}

function parseArcadeGameFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const qGame = params.get('game') || params.get('arcade');
  if (qGame) return qGame;
  if (window.location.pathname.includes('vice-leonida')) return 'vice_leonida';
  return null;
}

function parseDuelModeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const qMode = params.get('mode') || params.get('duel');
  if (qMode) return qMode;
  if (window.location.pathname.includes('vice-leonida')) return 'vice_leonida_duel';
  return null;
}

function loadInitialStudentName(): string {
  try {
    const saved = localStorage.getItem('arkedo_student_name') || '';
    if (saved.trim().toUpperCase() === 'PRO') {
      localStorage.removeItem('arkedo_student_name');
      const prof = localStorage.getItem('arkedo_active_student_profile');
      if (prof && prof.toLowerCase().includes('"pro"')) {
        localStorage.removeItem('arkedo_active_student_profile');
      }
      return '';
    }
    return saved;
  } catch {
    return '';
  }
}

function GameContent() {
  const { lang, t } = useLanguage();
  const [blogSlug, setBlogSlug] = useState<string | null>(() => parseBlogSlugFromUrl());
  const [glossarySlug, setGlossarySlug] = useState<string | null>(() => parseGlossarySlugFromUrl());
  const [worksheetSlug, setWorksheetSlug] = useState<string | null>(() => parseWorksheetSlugFromUrl());
  const [initialArcadeGame, setInitialArcadeGame] = useState<string | null>(() => parseArcadeGameFromUrl());
  const [initialDuelMode] = useState<string | null>(() => parseDuelModeFromUrl());
  const [sandboxLang, setSandboxLang] = useState<'cpp' | 'python' | 'html'>('cpp');
  const [sandboxChallengeId, setSandboxChallengeId] = useState<string | null>(null);
  const [sandboxTab, setSandboxTab] = useState<'editor' | 'trace' | 'olympiad'>(() => parseSandboxTabFromUrl());
  const [sandboxTracePayload, setSandboxTracePayload] = useState<{ code: string; stdin: string; label: string } | null>(null);
  const [leonidaAutoLaunch, setLeonidaAutoLaunch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('play') === '1';
  });
  const [view, setView] = useState<AppView>(() => resolveViewFromLocation());

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sounds.enabled);
  const [studentName, setStudentName] = useState<string>(() => loadInitialStudentName());
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTabType>('about');
  const { syncPageState } = useReportIssue();

  const maxScore = 100;

  const {
    activeMission,
    currentLevel,
    currentScore,
    currentElapsedSeconds,
    isOngoing,
    completedMissions,
    isMissionCompleted,
    completeMissionLevel,
    resetMission,
    resetActiveMission,
    startMission,
    clearCompletedActiveMission,
  } = useMissionProgress(view === 'lesson', view === 'catalog');

  // Sync audio state across external toggles
  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === 'boolean') {
        setSoundEnabled(customEvent.detail);
      }
    };
    window.addEventListener('arkedo_sound_change', handleSoundChange);
    return () => window.removeEventListener('arkedo_sound_change', handleSoundChange);
  }, []);

  // Quietly record daily streak activity once on mount
  useEffect(() => {
    recordDailyActivityAndStreak().catch(() => {});
  }, []);

  // Hash-based Legal/Contact modal shortcuts
  const openLegalModal = (tab: LegalTabType) => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#despre' || hash === '#about') openLegalModal('about');
      else if (hash === '#gdpr' || hash === '#privacy' || hash === '#confidentialitate') openLegalModal('privacy');
      else if (hash === '#cookies' || hash === '#cookie') openLegalModal('cookies');
      else if (hash === '#termeni' || hash === '#terms') openLegalModal('terms');
      else if (hash === '#contact' || hash === '#feedback') openLegalModal('contact');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Browser back/forward & language-route URL synchronization
  useEffect(() => {
    const handleUrlChange = () => {
      const next = resolveViewFromLocation();
      if (next === 'blog') setBlogSlug(parseBlogSlugFromUrl());
      else if (next === 'glossary') setGlossarySlug(parseGlossarySlugFromUrl());
      else if (next === 'fise') setWorksheetSlug(parseWorksheetSlugFromUrl());
      else if (next === 'sandbox') setSandboxTab(parseSandboxTabFromUrl());
      const path = window.location.pathname;
      if (next !== 'catalog' || path === '/' || path === '/en' || path === '/en/') {
        setView(next);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('arky_url_change', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('arky_url_change', handleUrlChange);
    };
  }, []);

  // Clean up redundant ?lang=en / ?lang=ro query parameters (e.g. after Netlify 301 passthrough)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const qLang = url.searchParams.get('lang')?.toLowerCase();
      if (!qLang) return;

      const isExplicitEnPath =
        /^\/en(\/|$)/i.test(url.pathname) ||
        /\/en(\/|$)/i.test(url.pathname);
      const isRootPath = url.pathname === '/' || url.pathname === '/index.html';
      const hasDeepLinkParam = ['view', 'game', 'arcade', 'mode', 'duel', 'lesson', 'post'].some((k) =>
        url.searchParams.has(k)
      );

      if (isExplicitEnPath && qLang === 'en') {
        url.searchParams.delete('lang');
        const nextSearch = url.searchParams.toString();
        window.history.replaceState(null, '', `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`);
      } else if (isRootPath && qLang === 'ro') {
        url.searchParams.delete('lang');
        const nextSearch = url.searchParams.toString();
        window.history.replaceState(null, '', `/${nextSearch ? `?${nextSearch}` : ''}${url.hash}`);
      } else if (isRootPath && qLang === 'en' && !hasDeepLinkParam) {
        url.searchParams.delete('lang');
        const nextSearch = url.searchParams.toString();
        window.history.replaceState(null, '', `/en/${nextSearch ? `?${nextSearch}` : ''}${url.hash}`);
      }
    } catch {
      // Ignore malformed URL edge cases
    }
  }, []);

  // Scroll to top when switching views
  useEffect(() => {
    forceScrollToTop();
  }, [view]);

  // Synchronize bilingual SEO titles, descriptions, OpenGraph & canonical tags
  useEffect(() => {
    void updateDynamicSeo(view, lang, activeMission, blogSlug, glossarySlug, initialArcadeGame, initialDuelMode, worksheetSlug);
  }, [view, lang, activeMission, blogSlug, glossarySlug, initialArcadeGame, initialDuelMode, worksheetSlug]);

  // Keep global ReportIssueContext synchronized with current view/mission/level
  useEffect(() => {
    syncPageState({
      view,
      activeMission: view === 'lesson' ? activeMission : null,
      currentLevel,
      currentScore,
      studentName,
      lang,
    });
  }, [syncPageState, view, activeMission, currentLevel, currentScore, studentName, lang]);

  // Prevent automatic PWA page reloads mid-session
  useEffect(() => {
    setAppSessionBusy(
      view === 'lesson' || view === 'duel' || view === 'arcade' || view === 'sandbox' || view === 'evaluare' || view === 'livequiz' || view === 'leonida' || view === 'ailab' || view === 'algolab'
    );
  }, [view]);

  const handleSetStudentName = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem('arkedo_student_name', name);
    } catch {
      // Ignore
    }
  };

  const navigateToView = (newView: AppView, nextSlug: string | null = null) => {
    setView(newView);
    if (newView === 'blog') setBlogSlug(nextSlug);
    else if (newView === 'glossary') setGlossarySlug(nextSlug);
    else if (newView === 'fise') setWorksheetSlug(nextSlug);
    forceScrollToTop();

    if (newView === 'superadmin') window.history.pushState({}, '', '/superadmin');
    else if (newView === 'teacher') window.history.pushState({}, '', '/profesor');
    else if (newView === 'arcade') {
      setInitialArcadeGame(null);
      window.history.pushState({}, '', '/arcade');
    } else if (newView === 'duel') window.history.pushState({}, '', '/duel');
    else if (newView === 'city') window.history.pushState({}, '', '/oras');
    else if (newView === 'carnet') window.history.pushState({}, '', '/carnet');
    else if (newView === 'evaluare') window.history.pushState({}, '', '/evaluare');
    else if (newView === 'livequiz') window.history.pushState({}, '', '/quiz-live');
    else if (newView === 'fise') {
      const basePath = lang === 'en' ? '/fise/en/' : '/fise/';
      window.history.pushState({}, '', nextSlug ? `${basePath}${nextSlug}/` : basePath);
    } else if (newView === 'blog') {
      const basePath = lang === 'en' ? '/blog/en/' : '/blog/';
      window.history.pushState({}, '', nextSlug ? `${basePath}${nextSlug}/` : basePath);
    } else if (newView === 'glossary') {
      const basePath = lang === 'en' ? '/glosar/en/' : '/glosar/';
      window.history.pushState({}, '', nextSlug ? `${basePath}${nextSlug}/` : basePath);
    } else if (newView === 'sandbox') {
      window.history.pushState({}, '', lang === 'en' ? '/sandbox/en/' : '/sandbox/');
    } else if (newView === 'leonida') {
      window.history.pushState({}, '', lang === 'en' ? '/leonida/en/' : '/leonida/');
    } else if (newView === 'ailab') {
      window.history.pushState({}, '', lang === 'en' ? '/laborator-ai/en/' : '/laborator-ai/');
    } else if (newView === 'algolab') {
      window.history.pushState({}, '', lang === 'en' ? '/laborator-algoritmi/en/' : '/laborator-algoritmi/');
    } else if (newView === 'catalog') {
      window.history.pushState({}, '', lang === 'en' ? '/en/' : '/');
      clearCompletedActiveMission();
    }
  };

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.setEnabled(newState);
    if (newState) sounds.playClick();
  };

  const handleSelectMission = (missionId: AllMissionId) => {
    setView('lesson');
    startMission(missionId);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white relative">
      <Header
        score={currentScore}
        maxScore={maxScore}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentView={view}
        missionId={activeMission}
        onNavigateToCatalog={() => navigateToView('catalog')}
        studentName={studentName}
        elapsedSeconds={currentElapsedSeconds}
        onEditStudentName={() => navigateToView('catalog')}
        onNavigateToCarnet={() => navigateToView('carnet')}
        onNavigateToEvaluare={() => navigateToView('evaluare')}
        onNavigateToLiveQuiz={() => navigateToView('livequiz')}
        onNavigateToTeacher={() => navigateToView('teacher')}
        onNavigateToSuperAdmin={() => navigateToView('superadmin')}
        onNavigateToArcade={() => navigateToView('arcade')}
        onNavigateToDuel={() => navigateToView('duel')}
        onNavigateToCity={() => navigateToView('city')}
        onNavigateToBlog={() => navigateToView('blog', null)}
        onNavigateToGlossary={() => navigateToView('glossary', null)}
        onNavigateToWorksheets={() => navigateToView('fise', null)}
        onNavigateToLeonida={() => {
          setLeonidaAutoLaunch(false);
          navigateToView('leonida');
        }}
        onNavigateToAiLab={() => navigateToView('ailab')}
        onNavigateToAlgoLab={() => navigateToView('algolab')}
        onNavigateToSandbox={() => {
          setSandboxChallengeId(null);
          setSandboxTracePayload(null);
          setSandboxTab('editor');
          navigateToView('sandbox');
        }}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8 flex flex-col gap-5 sm:gap-6 print:p-0 print:max-w-none">
        {view === 'catalog' ? (
          <CoursesCatalog
            studentName={studentName}
            onSetStudentName={handleSetStudentName}
            onSelectMission={handleSelectMission}
            activeMissionId={activeMission && !isMissionCompleted(activeMission) ? activeMission : null}
            activeMissionLevel={currentLevel}
            activeMissionScore={currentScore}
            completedMissions={completedMissions}
            elapsedSeconds={currentElapsedSeconds}
            onResetActiveMission={resetActiveMission}
            onOpenCarnet={() => navigateToView('carnet')}
            onOpenEvaluare={() => navigateToView('evaluare')}
            onOpenLiveQuiz={() => navigateToView('livequiz')}
            onOpenTeacherPortal={() => navigateToView('teacher')}
            onOpenSuperAdmin={() => navigateToView('superadmin')}
            onOpenArcade={() => navigateToView('arcade')}
            onOpenDuel={() => navigateToView('duel')}
            onOpenCity={() => navigateToView('city')}
            onOpenBlog={(slug) => navigateToView('blog', slug ?? null)}
            onOpenGlossary={(slug) => navigateToView('glossary', slug ?? null)}
            onOpenWorksheets={(slug) => navigateToView('fise', slug ?? null)}
            onOpenLeonida={(launchWorld) => {
              setLeonidaAutoLaunch(Boolean(launchWorld));
              navigateToView('leonida');
            }}
            onOpenAiLab={() => navigateToView('ailab')}
            onOpenAlgoLab={() => navigateToView('algolab')}
            onOpenSandbox={(targetLang, challengeId, tab) => {
              if (targetLang) setSandboxLang(targetLang);
              setSandboxChallengeId(challengeId ?? null);
              setSandboxTracePayload(null);
              setSandboxTab(tab ?? 'editor');
              navigateToView('sandbox');
            }}
          />
        ) : (
          <Suspense
            fallback={
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-xl animate-pulse">
                  ⚡
                </div>
                <p className="text-xs font-mono text-teal-300">
                  {lang === 'en' ? 'Loading interactive lab...' : 'Se încarcă laboratorul interactiv...'}
                </p>
              </div>
            }
          >
            {view === 'superadmin' ? (
              <SuperAdminDashboard
                onBackToHome={() => navigateToView('catalog')}
                onOpenTeacherPortal={() => navigateToView('teacher')}
              />
            ) : view === 'teacher' ? (
              <TeacherPortal
                onBackToHome={() => navigateToView('catalog')}
                onOpenSuperAdmin={() => navigateToView('superadmin')}
              />
            ) : view === 'arcade' ? (
              <ArcadeHub
                studentName={studentName}
                initialGame={
                  initialArcadeGame === 'vice_leonida_world'
                    ? 'vice_leonida_world'
                    : initialArcadeGame === 'vice_leonida'
                    ? 'vice_leonida'
                    : initialArcadeGame === 'detective'
                    ? 'detective'
                    : undefined
                }
                onBackToCatalog={() => navigateToView('catalog')}
                onOpenDuel={() => navigateToView('duel')}
              />
            ) : view === 'duel' ? (
              <DuelArena
                studentName={studentName}
                initialMode={initialDuelMode === 'vice_leonida_duel' ? 'vice_leonida_duel' : undefined}
                onBack={() => navigateToView('catalog')}
              />
            ) : view === 'city' ? (
              <CyberCityView
                studentName={studentName}
                onBackToCatalog={() => navigateToView('catalog')}
              />
            ) : view === 'blog' ? (
              <BlogHub
                activeSlug={blogSlug}
                onSelectArticle={(slug) => navigateToView('blog', slug)}
                onBackToHome={() => navigateToView('catalog')}
                onSelectMission={handleSelectMission}
                onNavigateToView={(target) => navigateToView(target)}
              />
            ) : view === 'glossary' ? (
              <GlossaryHub
                activeSlug={glossarySlug}
                onSelectTerm={(slug) => navigateToView('glossary', slug)}
                onBackToHome={() => navigateToView('catalog')}
                onSelectMission={handleSelectMission}
                onOpenBlog={(slug) => navigateToView('blog', slug ?? null)}
                onNavigateToView={(target) => navigateToView(target)}
              />
            ) : view === 'fise' ? (
              <WorksheetsHub
                activeSlug={worksheetSlug}
                onSelectWorksheet={(slug) => navigateToView('fise', slug)}
                onBackToHome={() => navigateToView('catalog')}
                onSelectMission={handleSelectMission}
                onOpenBlog={(slug) => navigateToView('blog', slug ?? null)}
                onOpenGlossary={(slug) => navigateToView('glossary', slug ?? null)}
                onOpenTraceWithCode={(code, stdin, label) => {
                  setSandboxLang('cpp');
                  setSandboxChallengeId(null);
                  setSandboxTracePayload({ code, stdin, label });
                  setSandboxTab('trace');
                  navigateToView('sandbox');
                }}
              />
            ) : view === 'sandbox' ? (
              <CodeSandboxHub
                initialLanguage={sandboxLang}
                initialChallengeId={sandboxChallengeId}
                initialTab={sandboxTab}
                initialTraceCode={sandboxTracePayload?.code ?? null}
                initialTraceStdin={sandboxTracePayload?.stdin ?? null}
                initialTraceLabel={sandboxTracePayload?.label ?? null}
                onBackToHome={() => navigateToView('catalog')}
                onSelectMission={handleSelectMission}
                onOpenBlog={(slug) => navigateToView('blog', slug ?? null)}
              />
            ) : view === 'carnet' ? (
              <DigitalCarnetHub
                studentName={studentName}
                onStudentNameChange={handleSetStudentName}
                onBackToCatalog={() => navigateToView('catalog')}
                onSelectMission={handleSelectMission}
                onOpenArcade={() => navigateToView('arcade')}
                onOpenDuel={() => navigateToView('duel')}
                onOpenCity={() => navigateToView('city')}
                onOpenEvaluare={() => navigateToView('evaluare')}
                onOpenLiveQuiz={() => navigateToView('livequiz')}
                onOpenWorksheets={() => navigateToView('fise', null)}
                onOpenSandbox={(targetLang, challengeId, tab) => {
                  if (targetLang) setSandboxLang(targetLang);
                  setSandboxChallengeId(challengeId ?? null);
                  setSandboxTracePayload(null);
                  setSandboxTab(tab ?? 'editor');
                  navigateToView('sandbox');
                }}
              />
            ) : view === 'evaluare' ? (
              <QuickEvalSimulator
                studentName={studentName}
                onBackToCatalog={() => navigateToView('catalog')}
                onOpenCarnet={() => navigateToView('carnet')}
                onOpenLiveQuiz={() => navigateToView('livequiz')}
              />
            ) : view === 'livequiz' ? (
              <StudentLiveQuizPlayer
                studentName={studentName}
                onBack={() => navigateToView('catalog')}
              />
            ) : view === 'leonida' ? (
              <LeonidaUniverseHub
                studentName={studentName}
                initialLaunchWorld={leonidaAutoLaunch}
                onBackToCatalog={() => navigateToView('catalog')}
                onOpenCyberRunner={() => {
                  setInitialArcadeGame('vice_leonida');
                  window.history.pushState({}, '', '/arcade?game=vice_leonida');
                  setView('arcade');
                }}
                onOpenLeonidaDuel={() => {
                  window.history.pushState({}, '', '/duel?mode=vice_leonida_duel');
                  setView('duel');
                }}
                onSelectMission={handleSelectMission}
              />
            ) : view === 'ailab' ? (
              <AiDeepfakeLabHub
                studentName={studentName}
                onBackToCatalog={() => navigateToView('catalog')}
                onSelectMission={handleSelectMission}
                onOpenCyberSafeDetective={() => {
                  setInitialArcadeGame('detective');
                  window.history.pushState({}, '', '/arcade?game=detective');
                  setView('arcade');
                }}
                onOpenGlossary={(slug) => navigateToView('glossary', slug ?? null)}
              />
            ) : view === 'algolab' ? (
              <AlgoCpuLabHub
                studentName={studentName}
                onBackToCatalog={() => navigateToView('catalog')}
                onSelectMission={handleSelectMission}
                onOpenCppTrace={(code, stdin, label) => {
                  setSandboxLang('cpp');
                  setSandboxChallengeId(null);
                  setSandboxTracePayload({ code, stdin, label });
                  setSandboxTab('trace');
                  navigateToView('sandbox');
                }}
                onOpenGlossary={(slug) => navigateToView('glossary', slug ?? null)}
              />
            ) : (
              <MissionStage
                missionId={activeMission || 'files'}
                currentLevel={currentLevel}
                currentScore={currentScore}
                maxScore={maxScore}
                elapsedSeconds={currentElapsedSeconds}
                studentName={studentName}
                onCompleteLevel={completeMissionLevel}
                onResetMission={resetMission}
                onBackToCatalog={() => navigateToView('catalog')}
              />
            )}
          </Suspense>
        )}
      </main>

      {/* Floating Bottom Stopwatch Bar (shown during active lesson) */}
      {view === 'lesson' && isOngoing && (
        <div className="sticky bottom-20 md:bottom-3 z-30 flex justify-center px-4 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-4 text-xs font-mono pointer-events-auto ring-1 ring-teal-500/20">
            {studentName && (
              <div className="flex items-center gap-1.5 text-slate-300 border-r border-slate-700 pr-3 font-sans">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold text-teal-300 max-w-[110px] truncate">{studentName}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-cyan-300 tabular-nums">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 hidden sm:inline">{t.timerLabel}:</span>
              <strong className="text-sm font-black text-cyan-200">{formatTimer(currentElapsedSeconds)}</strong>
            </div>

            <div className="flex items-center gap-1.5 text-amber-300 border-l border-slate-700 pl-3 tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">
                {currentScore}/{maxScore} {t.pts}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global Visible Issue Report Strip (present on every view above Footer) */}
      <section
        aria-label={lang === 'en' ? 'Report an issue on this page' : 'Raportează o problemă de pe această pagină'}
        className="print:hidden max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 pb-4"
      >
        <ReportIssueButton variant="card" />
      </section>

      <Footer
        onOpenLegal={openLegalModal}
        onNavigateToCatalog={() => navigateToView('catalog')}
        onNavigateToArcade={() => navigateToView('arcade')}
        onNavigateToDuel={() => navigateToView('duel')}
        onNavigateToCity={() => navigateToView('city')}
        onNavigateToTeacher={() => navigateToView('teacher')}
        onNavigateToSuperAdmin={() => navigateToView('superadmin')}
        onNavigateToBlog={() => navigateToView('blog', null)}
        onNavigateToGlossary={() => navigateToView('glossary', null)}
        onNavigateToWorksheets={() => navigateToView('fise', null)}
        onNavigateToSandbox={() => navigateToView('sandbox')}
        onNavigateToCarnet={() => navigateToView('carnet')}
        onNavigateToEvaluare={() => navigateToView('evaluare')}
        onNavigateToLeonida={() => {
          setLeonidaAutoLaunch(false);
          navigateToView('leonida');
        }}
        onNavigateToAiLab={() => navigateToView('ailab')}
        onNavigateToAlgoLab={() => navigateToView('algolab')}
      />

      {legalModalOpen && (
        <Suspense fallback={null}>
          <LegalModal
            isOpen={legalModalOpen}
            initialTab={legalTab}
            onClose={() => {
              setLegalModalOpen(false);
              try {
                if (
                  window.location.hash.startsWith('#despre') ||
                  window.location.hash.startsWith('#about') ||
                  window.location.hash.startsWith('#privacy') ||
                  window.location.hash.startsWith('#gdpr') ||
                  window.location.hash.startsWith('#cookies') ||
                  window.location.hash.startsWith('#termeni') ||
                  window.location.hash.startsWith('#contact')
                ) {
                  window.history.replaceState(null, '', ' ');
                }
              } catch {}
            }}
          />
        </Suspense>
      )}

      <CookieBanner onOpenCookiePolicy={() => openLegalModal('cookies')} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HintProvider>
          <ArkyProvider>
            <ReportIssueProvider>
              <GameContent />
              <Suspense fallback={null}>
                <ReportIssueModal />
              </Suspense>
              <MascotaArky />
              <OfflineIndicator />
              <UpdateToast />
            </ReportIssueProvider>
          </ArkyProvider>
        </HintProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
