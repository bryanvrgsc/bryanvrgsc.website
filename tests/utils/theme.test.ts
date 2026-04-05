import { describe, it, expect } from 'vitest';
import { resolveDocumentTheme } from '../../src/utils/theme.ts';

describe('resolveDocumentTheme', () => {
    it('uses explicit light theme over dark system preference', () => {
        expect(
            resolveDocumentTheme({
                dataTheme: 'light',
                hasDarkClass: false,
                systemPrefersDark: true
            })
        ).toBe('light');
    });

    it('uses explicit dark theme over light system preference', () => {
        expect(
            resolveDocumentTheme({
                dataTheme: 'dark',
                hasDarkClass: false,
                systemPrefersDark: false
            })
        ).toBe('dark');
    });

    it('treats the dark class as dark theme', () => {
        expect(
            resolveDocumentTheme({
                dataTheme: null,
                hasDarkClass: true,
                systemPrefersDark: false
            })
        ).toBe('dark');
    });

    it('falls back to the system preference when no explicit theme exists', () => {
        expect(
            resolveDocumentTheme({
                dataTheme: null,
                hasDarkClass: false,
                systemPrefersDark: true
            })
        ).toBe('dark');
    });
});
