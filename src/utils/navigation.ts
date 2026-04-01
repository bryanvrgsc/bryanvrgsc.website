import { navigate } from 'astro:transitions/client';

/**
 * Navigation utilities for Astro i18n routing.
 */

function getCurrentLang(): 'es' | 'en' {
    if (typeof window === 'undefined') {
        return 'es';
    }

    return window.location.pathname.split('/')[1] === 'en' ? 'en' : 'es';
}

/**
 * Navigate to a path preserving the current language prefix.
 */
export function navigateTo(path: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    const lang = getCurrentLang();
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    navigate(`/${lang}${normalizedPath}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Get the current path without the language prefix.
 */
export function getCurrentPath(): string {
    if (typeof window === 'undefined') {
        return '/';
    }

    return window.location.pathname.replace(/^\/(es|en)/, '') || '/';
}

/**
 * Check if a path is currently active.
 */
export function isPathActive(path: string): boolean {
    const current = getCurrentPath();
    return current === path || current.startsWith(`${path}/`);
}
