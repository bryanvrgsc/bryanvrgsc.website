import { map } from 'nanostores';

export type Language = 'en' | 'es';
export type Theme = 'light' | 'dark' | 'system';

export const settings = map<{ lang: Language; theme: Theme; _systemThemeUpdate?: number }>({
  lang: 'es', // Default to Spanish
  theme: 'system'
});

// Performance Store: start in lite mode and progressively enhance when allowed.
export const performanceMode = map<{ lite: boolean }>({
  lite: true
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

export const enableLiteMode = (enable: boolean) => {
  performanceMode.setKey('lite', enable);
  if (enable) {
    document.documentElement.classList.add('lite-mode');
  } else {
    document.documentElement.classList.remove('lite-mode');
  }
};
