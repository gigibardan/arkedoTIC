/**
 * Bulletproof Scroll-to-Top utility for Mobile & Desktop.
 * 
 * Fixes mobile viewport issues where users remain scrolled down when:
 * 1. Starting an interactive lesson or advancing levels.
 * 2. Launching an arcade mini-game from deep in the hub.
 * 3. Entering Duel Arena matches.
 * 4. Switching main navigation views.
 * 
 * Uses instant viewport reset + RequestAnimationFrame + multi-tick timeout
 * to counteract mobile momentum scrolling and delayed React DOM layout recalcs.
 */

export function forceScrollToTop(smooth = false) {
  if (typeof window === 'undefined') return;

  const performScroll = (behavior: ScrollBehavior) => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  };

  // 1. Immediate instant reset
  performScroll(smooth ? 'smooth' : 'instant');

  // 2. Microtask / RequestAnimationFrame (after React commits DOM mutations)
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      performScroll('instant');
    });
  }

  // 3. Post-render layout stabilization ticks (counteracting mobile momentum scroll & async assets)
  setTimeout(() => {
    performScroll('instant');
  }, 40);

  setTimeout(() => {
    performScroll('instant');
  }, 120);

  setTimeout(() => {
    performScroll('instant');
  }, 250);
}

/**
 * Scroll smoothly to a specific element by ID with a safe top offset.
 */
export function scrollToElement(elementId: string, offset = 80) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const target = document.getElementById(elementId);
  if (!target) {
    forceScrollToTop();
    return;
  }

  const rect = target.getBoundingClientRect();
  const targetTop = rect.top + window.scrollY - offset;

  try {
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  } catch {
    window.scrollTo(0, Math.max(0, targetTop));
  }
}
