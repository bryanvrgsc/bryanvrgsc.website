import { enableLiteMode } from '../store';

type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';
type DeviceFormFactor = 'phone' | 'tablet' | 'desktop';

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

interface GraphicsCapability {
  supported: boolean;
  maxTextureSize: number;
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

const MIN_SCREEN_AREA = 230_000;
const SLOW_CONNECTIONS = new Set<EffectiveConnectionType>(['slow-2g', '2g']);
let graphicsCapabilityCache: GraphicsCapability | null = null;

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

const getFormFactor = (): DeviceFormFactor => {
  const shortestSide = Math.min(window.innerWidth, window.innerHeight);
  const longestSide = Math.max(window.innerWidth, window.innerHeight);
  const isTouchDevice = navigator.maxTouchPoints > 0;

  if (isTouchDevice && shortestSide < 768) {
    return 'phone';
  }

  if (isTouchDevice && longestSide < 1400) {
    return 'tablet';
  }

  return 'desktop';
};

const getGraphicsCapability = (): GraphicsCapability => {
  if (graphicsCapabilityCache) {
    return graphicsCapabilityCache;
  }

  if (typeof document === 'undefined') {
    return { supported: false, maxTextureSize: 0 };
  }

  const canvas = document.createElement('canvas');
  const gl = (
    canvas.getContext('webgl', {
      antialias: false,
      depth: false,
      stencil: false,
      failIfMajorPerformanceCaveat: true,
      powerPreference: 'low-power'
    }) as WebGLRenderingContext | null
  ) || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

  if (!gl) {
    graphicsCapabilityCache = { supported: false, maxTextureSize: 0 };
    return graphicsCapabilityCache;
  }

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
  const loseContext = gl.getExtension('WEBGL_lose_context');
  loseContext?.loseContext();

  graphicsCapabilityCache = {
    supported: true,
    maxTextureSize
  };

  return graphicsCapabilityCache;
};

const getCapabilityScore = () => {
  const navigatorWithHints = navigator as NavigatorWithPerformanceHints;
  const connection = navigatorWithHints.connection;
  const formFactor = getFormFactor();
  const screenArea = window.innerWidth * window.innerHeight;
  const graphics = getGraphicsCapability();

  let score = 0;
  const reasons: string[] = [formFactor];

  if (screenArea < MIN_SCREEN_AREA) {
    score -= 1;
    reasons.push('compact-screen');
  }

  if (typeof navigatorWithHints.deviceMemory === 'number') {
    if (navigatorWithHints.deviceMemory >= 8) {
      score += 2;
      reasons.push(`memory:${navigatorWithHints.deviceMemory}gb`);
    } else if (navigatorWithHints.deviceMemory >= 4) {
      score += 1;
      reasons.push(`memory:${navigatorWithHints.deviceMemory}gb`);
    } else if (navigatorWithHints.deviceMemory <= 2) {
      score -= 2;
      reasons.push(`low-memory:${navigatorWithHints.deviceMemory}gb`);
    } else {
      score -= 1;
      reasons.push(`tight-memory:${navigatorWithHints.deviceMemory}gb`);
    }
  }

  if (typeof navigator.hardwareConcurrency === 'number') {
    if (navigator.hardwareConcurrency >= 8) {
      score += 2;
      reasons.push(`cpu:${navigator.hardwareConcurrency}`);
    } else if (navigator.hardwareConcurrency >= 6) {
      score += 1;
      reasons.push(`cpu:${navigator.hardwareConcurrency}`);
    } else if (navigator.hardwareConcurrency <= 2) {
      score -= 2;
      reasons.push(`low-cpu:${navigator.hardwareConcurrency}`);
    } else if (navigator.hardwareConcurrency <= 4) {
      score -= 1;
      reasons.push(`mid-cpu:${navigator.hardwareConcurrency}`);
    }
  }

  if (!graphics.supported) {
    score -= 2;
    reasons.push('no-webgl');
  } else if (graphics.maxTextureSize >= 8192) {
    score += 2;
    reasons.push(`gpu:${graphics.maxTextureSize}`);
  } else if (graphics.maxTextureSize >= 4096) {
    score += 1;
    reasons.push(`gpu:${graphics.maxTextureSize}`);
  } else {
    score -= 1;
    reasons.push(`weak-gpu:${graphics.maxTextureSize}`);
  }

  if (connection?.effectiveType === '3g') {
    score -= 1;
    reasons.push('3g');
  }

  return { formFactor, score, reasons };
};

/**
 * Opt-in heuristic for the rich background animation.
 * The site starts in a safe fallback and only upgrades when runtime signals
 * suggest the device can handle the canvas comfortably, regardless of form factor.
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

  const { score, reasons } = getCapabilityScore();
  const shouldUseLiteMode = score < 2;

  return {
    lite: shouldUseLiteMode,
    reason: `${shouldUseLiteMode ? 'lite' : 'full'}:${reasons.join('|')}:score=${score}`
  };
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
