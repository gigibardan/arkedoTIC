import { registerSW } from 'virtual:pwa-register';

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
    // Force browser HTTP cache revalidation of current route HTML before navigating
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

export function initAppAutoUpdater(): void {
  if (typeof window === 'undefined') return;

  // Recover seamlessly if an open tab tries to load a deleted chunk after a new deploy
  window.addEventListener('vite:preloadError', (event) => {
    try {
      const alreadyReloaded = sessionStorage.getItem('arky_chunk_reload') === '1';
      if (!alreadyReloaded) {
        event.preventDefault();
        sessionStorage.setItem('arky_chunk_reload', '1');
        void clearCachesAndReloadLatest();
      }
    } catch {
      // Ignore storage errors
    }
  });

  // Register Service Worker with immediate activation and frequent checks
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      void updateSW(true);
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

  // Auto-reload once when a new service worker takes control
  let isRefreshing = false;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
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

        const guardKey = 'arky_force_reload_ver';
        if (sessionStorage.getItem(guardKey) === data.version) return;
        sessionStorage.setItem(guardKey, data.version);

        await clearCachesAndReloadLatest();
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
