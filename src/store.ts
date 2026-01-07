import { map } from 'nanostores';

export type Language = 'en' | 'es';
export type Theme = 'light' | 'dark' | 'system';

export const settings = map<{ lang: Language; theme: Theme; _systemThemeUpdate?: number }>({
  lang: 'es', // Default to Spanish
  theme: 'system'
});

// Performance Store: "Lite Mode" for low-end devices
export const performanceMode = map<{ lite: boolean }>({
  lite: false
});

// DEBUG: Temporary store to show detection data on screen (REMOVE AFTER TESTING)
export const debugPerformance = map<{ stage: string; data: string }>({
  stage: 'init',
  data: 'Waiting for detection...'
});

// Dock Visibility Store
export const dockState = map<{ hidden: boolean }>({
  hidden: false
});

export const hideDock = () => {
  dockState.setKey('hidden', true);
};

export const showDock = () => {
  dockState.setKey('hidden', false);
};

export const setLang = (lang: Language) => {
  settings.setKey('lang', lang);
};

export const setTheme = (theme: Theme) => {
  settings.setKey('theme', theme);
  // Persist theme to localStorage for the inline script to read on next page load
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // localStorage not available
  }
  applyTheme(theme);
};

// Helper to apply theme to document
export const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);

  root.removeAttribute('data-theme');
  root.classList.remove('dark');

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  }
};

// Listen for system theme changes and auto-update when theme is 'system'
let systemThemeListener: MediaQueryList | null = null;

export const initThemeListener = () => {
  if (typeof window === 'undefined') return;

  // Sync theme from localStorage into nanostores (for React components)
  try {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      settings.setKey('theme', savedTheme);
    }
  } catch (e) {
    // localStorage not available
  }

  // Clean up existing listener
  if (systemThemeListener) {
    systemThemeListener.removeEventListener('change', handleSystemThemeChange);
  }

  // Create new listener for system theme changes
  systemThemeListener = window.matchMedia('(prefers-color-scheme: dark)');
  systemThemeListener.addEventListener('change', handleSystemThemeChange);

  // Note: We do NOT call applyTheme here because the inline script in
  // BaseLayout.astro already applied the theme before React hydration.
  // This prevents the flash of wrong theme.
};

const handleSystemThemeChange = () => {
  const currentTheme = settings.get().theme;

  // Only auto-update if theme is set to 'system'
  if (currentTheme === 'system') {
    applyTheme('system');

    // Force React components to re-render by updating a timestamp
    // Nanostores won't trigger updates if the value is the same,
    // so we use a unique timestamp to ensure re-render
    settings.setKey('_systemThemeUpdate', Date.now());
  }
};

// Helper to detect device capabilities and enable Lite Mode
// OPTIMIZED: Faster detection with caching and immediate signals
export const checkPerformance = async () => {
  if (typeof window === 'undefined') return;

  const CACHE_KEY = 'performance-mode-cache';
  const CACHE_VERSION = 'v4'; // Incremented to force re-test with forceMobile

  // 1. Check sessionStorage cache first (instant)
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { version, lite } = JSON.parse(cached);
      if (version === CACHE_VERSION) {
        console.log(`Performance: Using cached mode (lite: ${lite})`);
        debugPerformance.set({ stage: 'cache', data: `v:${version} lite:${lite}` });
        enableLiteMode(lite);
        return;
      } else {
        debugPerformance.set({ stage: 'cache-miss', data: `Old version: ${version}, need: ${CACHE_VERSION}` });
      }
    } else {
      debugPerformance.set({ stage: 'no-cache', data: 'Starting detection...' });
    }
  } catch (e) {
    debugPerformance.set({ stage: 'cache-error', data: String(e) });
  }

  // 2. Accessibility Preference (User explicitly asked for less motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Performance: Lite Mode enabled (Prefers Reduced Motion)');
    debugPerformance.set({ stage: 'reduced-motion', data: 'User prefers reduced motion' });
    cacheAndEnableLiteMode(true, CACHE_KEY, CACHE_VERSION);
    return;
  }

  // 3. Immediate signals for low-end devices (no async needed)
  const immediateSignals = detectImmediateLowEndSignals();
  if (immediateSignals.isDefinitelyLowEnd) {
    console.log(`Performance: Lite Mode enabled (${immediateSignals.reason})`);
    cacheAndEnableLiteMode(true, CACHE_KEY, CACHE_VERSION);
    return;
  }

  // 4. Advanced GPU Detection with timeout
  try {
    const { getGPUTier } = await import('detect-gpu');

    // Detect if this is a touch/mobile device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Race between GPU detection and 2 second timeout
    // Force mobile benchmarks for touch devices (helps with accuracy on tablets)
    const gpuTier = await Promise.race([
      getGPUTier({ forceMobile: isTouchDevice } as any),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('GPU detection timeout')), 2000)
      )
    ]);

    if (!gpuTier) {
      // Timeout - assume capable device
      console.log('Performance: GPU detection timed out, assuming capable device');
      debugPerformance.set({ stage: 'timeout', data: 'GPU detection timed out' });
      cacheAndEnableLiteMode(false, CACHE_KEY, CACHE_VERSION);
      return;
    }

    console.log(`Hardware Detection: Tier ${gpuTier.tier}, FPS: ${gpuTier.fps}, GPU: ${gpuTier.gpu}`);

    // Determine if device is low-end based on GPU tier and FPS
    const isLowTier = gpuTier.tier <= 1;
    const isLowFPS = gpuTier.fps !== undefined && gpuTier.fps < 30;
    const isTrulyLowEnd = gpuTier.tier === 0 || isLowFPS;

    // Apple GPU handling:
    // - Tier 2-3 Apple GPUs (modern devices) are powerful, skip Lite Mode
    // - Tier 0-1 Apple GPUs (older iPads/iPhones) should still use Lite Mode
    const isAppleGPU = gpuTier.gpu && gpuTier.gpu.toLowerCase().includes('apple');
    const isModernAppleDevice = isAppleGPU && gpuTier.tier >= 2;

    // Enable Lite Mode if:
    // 1. Device is truly low-end (tier 0 or fps < 30), OR
    // 2. Device is low tier (0-1), unless it's a modern Apple device
    const shouldEnableLiteMode = isTrulyLowEnd || (isLowTier && !isModernAppleDevice);

    // DEBUG: Store detection data for visual display
    debugPerformance.set({
      stage: 'gpu',
      data: `T:${gpuTier.tier} FPS:${gpuTier.fps} Mobile:${(gpuTier as any).isMobile} Touch:${isTouchDevice} Result:${shouldEnableLiteMode ? 'LITE' : 'FULL'}`
    });

    if (shouldEnableLiteMode) {
      console.log(`Performance: Lite Mode enabled (Tier: ${gpuTier.tier}, Apple: ${isAppleGPU})`);
      cacheAndEnableLiteMode(true, CACHE_KEY, CACHE_VERSION);
    } else {
      console.log('Performance: High Performance Mode enabled');
      cacheAndEnableLiteMode(false, CACHE_KEY, CACHE_VERSION);
    }

  } catch (error) {
    console.warn('GPU Detection failed, keeping default mode.', error);
    debugPerformance.set({ stage: 'error', data: String(error) });
    cacheAndEnableLiteMode(false, CACHE_KEY, CACHE_VERSION);
  }
};

// Detect immediate low-end signals without async operations
const detectImmediateLowEndSignals = (): { isDefinitelyLowEnd: boolean; reason: string } => {
  // Check device memory (Chrome/Edge only)
  const deviceMemory = (navigator as any).deviceMemory;
  if (deviceMemory && deviceMemory <= 2) {
    return { isDefinitelyLowEnd: true, reason: `Low memory: ${deviceMemory}GB` };
  }

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency;
  if (cores && cores <= 2) {
    return { isDefinitelyLowEnd: true, reason: `Low CPU cores: ${cores}` };
  }

  // Check connection type (slow network often = older device)
  const connection = (navigator as any).connection;
  if (connection && connection.effectiveType === '2g') {
    return { isDefinitelyLowEnd: true, reason: '2G connection detected' };
  }

  return { isDefinitelyLowEnd: false, reason: '' };
};

// Cache result and enable/disable lite mode
const cacheAndEnableLiteMode = (enable: boolean, key: string, version: string) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ version, lite: enable }));
  } catch (e) {
    // sessionStorage not available
  }
  enableLiteMode(enable);
};

const enableLiteMode = (enable: boolean) => {
  performanceMode.setKey('lite', enable);
  if (enable) {
    document.documentElement.classList.add('lite-mode');
  } else {
    document.documentElement.classList.remove('lite-mode');
  }
};