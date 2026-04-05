import { describe, it, expect } from 'vitest';
import { DYNAMIC_COLORS, injectPaletteCSS, getThemeColors, isDarkTheme } from '../../src/constants/colors';

describe('DYNAMIC_COLORS', () => {
    it('has light and dark raw hex values', () => {
        expect(DYNAMIC_COLORS.raw.light.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(DYNAMIC_COLORS.raw.dark.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('has light and dark RGB values', () => {
        expect(DYNAMIC_COLORS.raw.light.rgb).toBeDefined();
        expect(DYNAMIC_COLORS.raw.dark.rgb).toBeDefined();
    });
});

describe('injectPaletteCSS', () => {
    it('sets CSS custom properties on document root', () => {
        injectPaletteCSS();
        const root = document.documentElement;
        expect(root.style.getPropertyValue('--primary-color')).toBeTruthy();
        expect(root.style.getPropertyValue('--secondary-color')).toBeTruthy();
        expect(root.style.getPropertyValue('--accent-color')).toBeTruthy();
    });
});

describe('getThemeColors', () => {
    it('returns light colors for light theme', () => {
        const colors = getThemeColors('light');
        expect(colors.base).toBeDefined();
        expect(colors.network).toBeDefined();
    });

    it('returns dark colors for dark theme', () => {
        const colors = getThemeColors('dark');
        expect(colors.base).toBeDefined();
    });

    it('uses system preference for system theme', () => {
        const lightColors = getThemeColors('system', false);
        const darkColors = getThemeColors('system', true);
        expect(lightColors.base).not.toEqual(darkColors.base);
    });
});

describe('isDarkTheme', () => {
    it('returns true for dark', () => {
        expect(isDarkTheme('dark')).toBe(true);
    });

    it('returns false for light', () => {
        expect(isDarkTheme('light')).toBe(false);
    });
});
