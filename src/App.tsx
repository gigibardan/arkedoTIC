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
import { MissionStage } from './components/MissionStage';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { Footer } from './components/Footer';
import { LegalModal, LegalTabType } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { UpdateToast } from './components/pwa/UpdateToast';
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
  | 'livequiz';

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

function resolveViewFromLocation(): AppView {
  if (typeof window === 'undefined') return 'catalog';
  const { pathname, hash } = window.location;
  if (pathname.includes('/superadmin') || hash.includes('superadmin')) return 'superadmin';
  if (pathname.includes('/profesor') || hash.includes('profesor')) return 'teacher';
  if (pathname.includes('/arcade') || hash.includes('arcade')) return 'arcade';
  if (pathname.includes('/duel') || hash.includes('duel')) return 'duel';
  if (pathname.includes('/city') || pathname.includes('/oras') || hash.includes('city') || hash.includes('oras')) return 'city';
  if (pathname.startsWith('/blog') || hash.startsWith('#blog')) return 'blog';
  if (pathname.startsWith('/glosar') || hash.startsWith('#glosar')) return 'glossary';
  if (pathname.startsWith('/sandbox') || hash.startsWith('#sandbox')) return 'sandbox';
  if (pathname.startsWith('/carnet') || hash.startsWith('#carnet')) return 'carnet';
  if (pathname.startsWith('/evaluare') || hash.startsWith('#evaluare')) return 'evaluare';
  if (pathname.startsWith('/quiz-live') || hash.startsWith('#quiz-live')) return 'livequiz';
  return 'catalog';
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
  const [sandboxLang, setSandboxLang] = useState<'cpp' | 'python' | 'html'>('cpp');
  const [sandboxChallengeId, setSandboxChallengeId] = useState<string | null>(null);
  const [view, setView] = useState<AppView>(() => resolveViewFromLocation());

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sounds.enabled);
  const [studentName, setStudentName] = useState<string>(() => loadInitialStudentName());
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTabType>('about');

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

  // Browser back/forward & hash URL synchronization
  useEffect(() => {
    const handleUrlChange = () => {
      const next = resolveViewFromLocation();
      if (next === 'blog') setBlogSlug(parseBlogSlugFromUrl());
      else if (next === 'glossary') setGlossarySlug(parseGlossarySlugFromUrl());
      if (next !== 'catalog' || window.location.pathname === '/') {
        setView(next);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Scroll to top when switching views
  useEffect(() => {
    forceScrollToTop();
  }, [view]);

  // Synchronize bilingual SEO titles, descriptions, OpenGraph & canonical tags
  useEffect(() => {
    updateDynamicSeo(view, lang, activeMission, blogSlug, glossarySlug);
  }, [view, lang, activeMission, blogSlug, glossarySlug]);

  // Prevent automatic PWA page reloads mid-session
  useEffect(() => {
    setAppSessionBusy(
      view === 'lesson' || view === 'duel' || view === 'arcade' || view === 'sandbox' || view === 'evaluare' || view === 'livequiz'
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
    forceScrollToTop();

    if (newView === 'superadmin') window.history.pushState({}, '', '/superadmin');
    else if (newView === 'teacher') window.history.pushState({}, '', '/profesor');
    else if (newView === 'arcade') window.history.pushState({}, '', '/arcade');
    else if (newView === 'duel') window.history.pushState({}, '', '/duel');
    else if (newView === 'city') window.history.pushState({}, '', '/oras');
    else if (newView === 'carnet') window.history.pushState({}, '', '/carnet');
    else if (newView === 'evaluare') window.history.pushState({}, '', '/evaluare');
    else if (newView === 'livequiz') window.history.pushState({}, '', '/quiz-live');
    else if (newView === 'blog') {
      const basePath = lang === 'en' ? '/blog/en/' : '/blog/';
      window.history.pushState({}, '', nextSlug ? `${basePath}${nextSlug}/` : basePath);
    } else if (newView === 'glossary') {
      const basePath = lang === 'en' ? '/glosar/en/' : '/glosar/';
      window.history.pushState({}, '', nextSlug ? `${basePath}${nextSlug}/` : basePath);
    } else if (newView === 'sandbox') {
      window.history.pushState({}, '', lang === 'en' ? '/sandbox/en/' : '/sandbox/');
    } else if (newView === 'catalog') {
      window.history.pushState({}, '', '/');
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
        onNavigateToSandbox={() => {
          setSandboxChallengeId(null);
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
            onOpenSandbox={(targetLang, challengeId) => {
              if (targetLang) setSandboxLang(targetLang);
              setSandboxChallengeId(challengeId ?? null);
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
                onBackToCatalog={() => navigateToView('catalog')}
                onOpenDuel={() => navigateToView('duel')}
              />
            ) : view === 'duel' ? (
              <DuelArena
                studentName={studentName}
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
            ) : view === 'sandbox' ? (
              <CodeSandboxHub
                initialLanguage={sandboxLang}
                initialChallengeId={sandboxChallengeId}
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
                onOpenSandbox={(targetLang, challengeId) => {
                  if (targetLang) setSandboxLang(targetLang);
                  setSandboxChallengeId(challengeId ?? null);
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
        onNavigateToSandbox={() => navigateToView('sandbox')}
        onNavigateToCarnet={() => navigateToView('carnet')}
        onNavigateToEvaluare={() => navigateToView('evaluare')}
      />

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
            <GameContent />
            <MascotaArky />
            <OfflineIndicator />
            <UpdateToast />
          </ArkyProvider>
        </HintProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
