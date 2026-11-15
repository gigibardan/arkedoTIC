import { registerSW } from 'virtual:pwa-register';

export const APP_UPDATE_AVAILABLE_EVENT = 'arky_update_available';

type UpdateListener = (version: string | null) => void;

let isSessionBusy = false;
let pendingUpdateVersion: string | null = null;
let swUpdateRunner: ((reloadPage?: boolean) => Promise<void>) | null = null;
const listeners = new Set<UpdateListener>();

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
      sessionStorage.setItem('arky_dismissed_ver', pendingUpdateVersion);
    }
  } catch {
    // Ignore storage errors
  }
  pendingUpdateVersion = null;
  notifyListeners();
}

export async function applyPendingAppUpdate(): Promise<void> {
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
    const url = new URL(window.location.href);
    url.searchParams.set('_upd', String(Date.now()));
    window.location.replace(url.toString());
  } catch {
    window.location.reload();
  }
}

function handleDetectedNewVersion(versionLabel: string): void {
  try {
    if (sessionStorage.getItem('arky_dismissed_ver') === versionLabel) {
      return;
    }
  } catch {
    // Ignore storage errors
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
  if (typeof window === 'undefined') return;

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

  // Register Service Worker with immediate activation and frequent checks
  swUpdateRunner = registerSW({
    immediate: true,
    onNeedRefresh() {
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

  // Reload once when a new service worker takes control, unless user is in an active session
  let isRefreshing = false;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
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
