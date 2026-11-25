import { registerSW } from 'virtual:pwa-register';

export const APP_UPDATE_AVAILABLE_EVENT = 'arky_update_available';

type UpdateListener = (version: string | null) => void;

let isSessionBusy = false;
let pendingUpdateVersion: string | null = null;
let swUpdateRunner: ((reloadPage?: boolean) => Promise<void>) | null = null;
let isUpdaterInitialized = false;
const listeners = new Set<UpdateListener>();

const DISMISSED_VER_KEY = 'arky_dismissed_ver';
const JUST_UPDATED_AT_KEY = 'arky_just_updated_at';
const JUST_UPDATED_COOLDOWN_MS = 20_000;

function wasRecentlyUpdated(): boolean {
  try {
    const raw = sessionStorage.getItem(JUST_UPDATED_AT_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < JUST_UPDATED_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function isVersionDismissed(versionLabel: string): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_VER_KEY) === versionLabel;
  } catch {
    return false;
  }
}

function buildSpaSafeReloadUrl(rawHref: string): string {
  const url = new URL(rawHref);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // Paths like /arcade, /duel, /leonida have static SEO index.html snapshots in /public;
  // reloading onto / or /en/ with query/hash guarantees the live React SPA boots instead of a static HTML page.
  if (path === '/arcade' && !url.searchParams.has('game') && !url.searchParams.has('arcade')) {
    url.pathname = '/';
    url.searchParams.set('arcade', '1');
  } else if (path === '/arcade/en' && !url.searchParams.has('game') && !url.searchParams.has('arcade')) {
    url.pathname = '/en/';
    url.searchParams.set('arcade', '1');
  } else if (path === '/duel' && !url.searchParams.has('mode') && !url.searchParams.has('duel')) {
    url.pathname = '/';
    url.searchParams.set('duel', '1');
  } else if (path === '/duel/en' && !url.searchParams.has('mode') && !url.searchParams.has('duel')) {
    url.pathname = '/en/';
    url.searchParams.set('duel', '1');
  } else if (path === '/oras') {
    url.pathname = '/';
    url.hash = '#oras';
  } else if (path === '/oras/en') {
    url.pathname = '/en/';
    url.hash = '#oras';
  } else if (path === '/profesor') {
    url.pathname = '/';
    url.hash = '#profesor';
  } else if (path === '/profesor/en') {
    url.pathname = '/en/';
    url.hash = '#profesor';
  } else if (path === '/leonida') {
    url.pathname = '/';
    url.searchParams.set('view', 'leonida');
  } else if (path === '/leonida/en') {
    url.pathname = '/en/';
    url.searchParams.set('view', 'leonida');
  }

  url.searchParams.set('_upd', String(Date.now()));
  return url.toString();
}

function notifyListeners(): void {
  for (const listener of listeners) {
    try {
      listener(pendingUpdateVersion);
    } catch {
      // Ignore subscriber errors
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(APP_UPDATE_AVAILABLE_EVENT, {
        detail: { version: pendingUpdateVersion },
      })
    );
  }
}

export function subscribeAppUpdate(listener: UpdateListener): () => void {
  listeners.add(listener);
  listener(pendingUpdateVersion);
  return () => {
    listeners.delete(listener);
  };
}

export function setAppSessionBusy(busy: boolean): void {
  isSessionBusy = busy;
}

export function dismissPendingAppUpdateForNow(): void {
  try {
    if (pendingUpdateVersion) {
      sessionStorage.setItem(DISMISSED_VER_KEY, pendingUpdateVersion);
    }
  } catch {
    // Ignore storage errors
  }
  pendingUpdateVersion = null;
  notifyListeners();
}

export async function applyPendingAppUpdate(): Promise<void> {
  try {
    sessionStorage.setItem(JUST_UPDATED_AT_KEY, String(Date.now()));
  } catch {
    // Ignore storage errors
  }
  pendingUpdateVersion = null;
  notifyListeners();

  if (swUpdateRunner) {
    try {
      await swUpdateRunner(false);
    } catch {
      // Fallback to hard cache clear below
    }
  }
  await clearCachesAndReloadLatest();
}

export async function clearCachesAndReloadLatest(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(JUST_UPDATED_AT_KEY, String(Date.now()));
  } catch {
    // Ignore storage errors
  }

  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }
  } catch {
    // Ignore cache API errors
  }

  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
  } catch {
    // Ignore SW unregister errors
  }

  try {
    await fetch(window.location.pathname + window.location.search, {
      cache: 'reload',
      credentials: 'same-origin',
    });
  } catch {
    // Ignore fetch failure (e.g. offline)
  }

  try {
    window.location.replace(buildSpaSafeReloadUrl(window.location.href));
  } catch {
    window.location.reload();
  }
}

function handleDetectedNewVersion(versionLabel: string): void {
  if (wasRecentlyUpdated() || isVersionDismissed(versionLabel)) {
    return;
  }

  if (isSessionBusy) {
    // Never interrupt an active lesson, duel, arcade run, or coding sandbox
    pendingUpdateVersion = versionLabel;
    notifyListeners();
    return;
  }

  try {
    const guardKey = 'arky_force_reload_ver';
    if (sessionStorage.getItem(guardKey) === versionLabel) {
      pendingUpdateVersion = versionLabel;
      notifyListeners();
      return;
    }
    sessionStorage.setItem(guardKey, versionLabel);
  } catch {
    // Ignore storage errors
  }

  void clearCachesAndReloadLatest();
}

export function initAppAutoUpdater(): void {
  if (typeof window === 'undefined' || isUpdaterInitialized) return;
  isUpdaterInitialized = true;

  // Capture whether a SW was ALREADY controlling this page before registering.
  // In Incognito or brand-new sessions, controller starts as null; the initial clients.claim()
  // activates the current build and must NOT be mistaken for a new update.
  let hadController =
    'serviceWorker' in navigator && Boolean(navigator.serviceWorker.controller);

  // Recover seamlessly if an open tab tries to load a deleted chunk after a new deploy
  window.addEventListener('vite:preloadError', (event) => {
    try {
      const alreadyReloaded = sessionStorage.getItem('arky_chunk_reload') === '1';
      if (!alreadyReloaded) {
        event.preventDefault();
        sessionStorage.setItem('arky_chunk_reload', '1');
        if (isSessionBusy) {
          pendingUpdateVersion = 'new-chunk';
          notifyListeners();
        } else {
          void clearCachesAndReloadLatest();
        }
      }
    } catch {
      // Ignore storage errors
    }
  });

  // Register Service Worker with immediate activation and periodic checks
  swUpdateRunner = registerSW({
    immediate: true,
    onNeedRefresh() {
      if (wasRecentlyUpdated() || isVersionDismissed('sw-refresh')) {
        return;
      }
      if (isSessionBusy) {
        pendingUpdateVersion = 'sw-refresh';
        notifyListeners();
      } else if (swUpdateRunner) {
        void swUpdateRunner(true);
      }
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      const safeUpdate = () => {
        registration.update().catch(() => {});
      };
      window.addEventListener('focus', safeUpdate);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          safeUpdate();
        }
      });
      setInterval(safeUpdate, 2 * 60 * 1000);
    },
  });

  // Reload once only when replacing an EXISTING controlling service worker during an open session
  let isRefreshing = false;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) {
        hadController = true;
        return;
      }
      if (wasRecentlyUpdated() || isVersionDismissed('sw-controller')) {
        return;
      }
      if (isSessionBusy) {
        pendingUpdateVersion = 'sw-controller';
        notifyListeners();
        return;
      }
      if (!isRefreshing) {
        isRefreshing = true;
        window.location.reload();
      }
    });
  }

  // Live /version.json check so returning users never stay stuck on stale cached bundles
  if (typeof __APP_VERSION__ !== 'undefined' && __APP_VERSION__ !== 'dev') {
    let lastCheckedAt = 0;
    const checkLiveVersion = async () => {
      const now = Date.now();
      if (now - lastCheckedAt < 20_000) return;
      lastCheckedAt = now;

      try {
        const res = await fetch(`/version.json?t=${now}`, {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        if (!res.ok) return;
        const data = (await res.json()) as { version?: string };
        if (!data?.version || data.version === __APP_VERSION__) return;

        handleDetectedNewVersion(data.version);
      } catch {
        // Ignore offline/network errors
      }
    };

    void checkLiveVersion();
    window.addEventListener('focus', () => {
      void checkLiveVersion();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void checkLiveVersion();
      }
    });
    setInterval(() => {
      void checkLiveVersion();
    }, 3 * 60 * 1000);
  }
}
