import { enableLiteMode } from '../store';

type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

type NavigatorWithPerformanceHints = Navigator & {
  connection?: {
    effectiveType?: EffectiveConnectionType;
    saveData?: boolean;
  };
  deviceMemory?: number;
};

interface IdleDeadlineLike {
  didTimeout: boolean;
  timeRemaining: () => number;
}

type IdleCallbackHandle = number;
type IdleCallbackFn = (
  callback: (deadline: IdleDeadlineLike) => void,
  options?: { timeout: number }
) => IdleCallbackHandle;
type CancelIdleCallbackFn = (handle: IdleCallbackHandle) => void;

export interface AdaptivePerformanceDecision {
  lite: boolean;
  reason: string;
}

export const BACKGROUND_ENHANCEMENT_MEDIA_QUERY =
  '(min-width: 960px) and (min-height: 640px) and (hover: hover) and (pointer: fine)';

const MIN_FULL_MODE_MEMORY_GB = 4;
const MIN_FULL_MODE_CORES = 4;
const SLOW_CONNECTIONS = new Set<EffectiveConnectionType>(['slow-2g', '2g']);

const requestIdle = (
  callback: (deadline: IdleDeadlineLike) => void,
  timeout = 1500
): IdleCallbackHandle => {
  const idleScheduler = (
    window as typeof window & {
      requestIdleCallback?: IdleCallbackFn;
    }
  ).requestIdleCallback;

  if (idleScheduler) {
    return idleScheduler(callback, { timeout });
  }

  return window.setTimeout(
    () =>
      callback({
        didTimeout: true,
        timeRemaining: () => 0
      }),
    1
  );
};

const cancelIdle = (handle: IdleCallbackHandle) => {
  const idleCanceller = (
    window as typeof window & {
      cancelIdleCallback?: CancelIdleCallbackFn;
    }
  ).cancelIdleCallback;

  if (idleCanceller) {
    idleCanceller(handle);
    return;
  }

  window.clearTimeout(handle);
};

/**
 * Opt-in heuristic for the rich background animation.
 * The site starts in a safe fallback and only upgrades on desktop-class conditions.
 */
export const getAdaptivePerformanceDecision = (): AdaptivePerformanceDecision => {
  if (typeof window === 'undefined') {
    return { lite: true, reason: 'server-render' };
  }

  const navigatorWithHints = navigator as NavigatorWithPerformanceHints;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reducedMotionQuery.matches) {
    return { lite: true, reason: 'prefers-reduced-motion' };
  }

  const connection = navigatorWithHints.connection;
  if (connection?.saveData) {
    return { lite: true, reason: 'save-data' };
  }

  if (connection?.effectiveType && SLOW_CONNECTIONS.has(connection.effectiveType)) {
    return { lite: true, reason: `slow-connection:${connection.effectiveType}` };
  }

  if (!window.matchMedia(BACKGROUND_ENHANCEMENT_MEDIA_QUERY).matches) {
    return { lite: true, reason: 'non-desktop-viewport' };
  }

  if (
    typeof navigatorWithHints.deviceMemory === 'number' &&
    navigatorWithHints.deviceMemory < MIN_FULL_MODE_MEMORY_GB
  ) {
    return { lite: true, reason: `low-memory:${navigatorWithHints.deviceMemory}gb` };
  }

  if (
    typeof navigatorWithHints.hardwareConcurrency === 'number' &&
    navigatorWithHints.hardwareConcurrency < MIN_FULL_MODE_CORES
  ) {
    return { lite: true, reason: `low-cpu:${navigatorWithHints.hardwareConcurrency}-cores` };
  }

  return { lite: false, reason: 'desktop-class-capable' };
};

/**
 * Keeps the site in fallback mode by default and only enables richer effects after
 * the page has loaded and the main thread has idle time available.
 */
export const initAdaptivePerformance = () => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let disposed = false;
  let idleHandle: IdleCallbackHandle | null = null;
  let resizeTimeout: number | null = null;
  let removeLoadListener = () => {};

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const clearPendingUpgrade = () => {
    removeLoadListener();
    removeLoadListener = () => {};

    if (idleHandle !== null) {
      cancelIdle(idleHandle);
      idleHandle = null;
    }
  };

  const enableFullModeWhenIdle = () => {
    if (disposed) return;

    clearPendingUpgrade();

    const upgrade = () => {
      idleHandle = requestIdle(() => {
        idleHandle = null;

        if (disposed) return;

        const currentDecision = getAdaptivePerformanceDecision();
        enableLiteMode(currentDecision.lite);
      });
    };

    if (document.readyState === 'complete') {
      upgrade();
      return;
    }

    const handleLoad = () => {
      removeLoadListener = () => {};
      upgrade();
    };

    window.addEventListener('load', handleLoad, { once: true });
    removeLoadListener = () => window.removeEventListener('load', handleLoad);
  };

  const syncPerformanceMode = () => {
    const decision = getAdaptivePerformanceDecision();

    if (decision.lite) {
      clearPendingUpgrade();
      enableLiteMode(true);
      return;
    }

    enableFullModeWhenIdle();
  };

  const handleResize = () => {
    if (resizeTimeout !== null) {
      window.clearTimeout(resizeTimeout);
    }

    resizeTimeout = window.setTimeout(() => {
      resizeTimeout = null;
      syncPerformanceMode();
    }, 200);
  };

  syncPerformanceMode();

  reducedMotionQuery.addEventListener('change', syncPerformanceMode);
  window.addEventListener('resize', handleResize, { passive: true });

  return () => {
    disposed = true;
    clearPendingUpgrade();

    if (resizeTimeout !== null) {
      window.clearTimeout(resizeTimeout);
    }

    reducedMotionQuery.removeEventListener('change', syncPerformanceMode);
    window.removeEventListener('resize', handleResize);
  };
};
