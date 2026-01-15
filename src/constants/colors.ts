/**
 * Centralized Color Management System
 * 
 * This file contains all color definitions for the application.
 * Colors are organized by theme (light/dark) and purpose.
 * 
 * Usage:
 * - Import specific color constants or helper functions
 * - Use getThemeColor() to get colors based on current theme
 * - Refer to CSS variables in styles.css for corresponding values
 */

/* ============================================
   COLOR PALETTES - LIGHT THEME
   ============================================ */

/**
 * Palette 1: Emerald (Primary - Default)
 * Clean, professional green theme
 */
export const LIGHT_PALETTE_EMERALD = {
    primary: '#10b981',        // Emerald-500
    secondary: '#059669',      // Emerald-600
    accent: '#34d399',         // Emerald-400
    background: '#f8fafc',     // Slate-50
    surface: '#ffffff',        // White
} as const;

/**
 * Palette 2: Ocean Blue
 * Calm, trustworthy blue theme
 */
export const LIGHT_PALETTE_OCEAN = {
    primary: '#0284c7',        // Sky-600
    secondary: '#0369a1',      // Sky-700
    accent: '#38bdf8',         // Sky-400
    background: '#f0f9ff',     // Sky-50
    surface: '#ffffff',        // White
} as const;

/**
 * Palette 3: Sunset Purple
 * Creative, modern purple theme
 */
export const LIGHT_PALETTE_SUNSET = {
    primary: '#8b5cf6',        // Purple-500
    secondary: '#7c3aed',      // Purple-600
    accent: '#a78bfa',         // Purple-400
    background: '#faf5ff',     // Purple-50
    surface: '#ffffff',        // White
} as const;

/**
 * Palette 4: Rose Pink
 * Vibrant, energetic pink theme
 */
export const LIGHT_PALETTE_ROSE = {
    primary: '#f43f5e',        // Rose-500
    secondary: '#e11d48',      // Rose-600
    accent: '#fb7185',         // Rose-400
    background: '#fff1f2',     // Rose-50
    surface: '#ffffff',        // White
} as const;

/**
 * Palette 5: Amber Gold
 * Warm, optimistic amber theme
 */
export const LIGHT_PALETTE_AMBER = {
    primary: '#f59e0b',        // Amber-500
    secondary: '#d97706',      // Amber-600
    accent: '#fbbf24',         // Amber-400
    background: '#fffbeb',     // Amber-50
    surface: '#ffffff',        // White
} as const;

/* ============================================
   COLOR PALETTES - DARK THEME
   ============================================ */

/**
 * Palette 1: Neon Emerald (Primary - Default)
 * Vibrant green on dark background
 */
export const DARK_PALETTE_EMERALD = {
    primary: '#34d399',        // Emerald-400
    secondary: '#10b981',      // Emerald-500
    accent: '#6ee7b7',         // Emerald-300
    background: '#000000',     // Black
    surface: '#111115',        // Near Black
} as const;

/**
 * Palette 2: Electric Blue
 * Bright, high-tech blue theme
 */
export const DARK_PALETTE_ELECTRIC = {
    primary: '#38bdf8',        // Sky-400
    secondary: '#0ea5e9',      // Sky-500
    accent: '#7dd3fc',         // Sky-300
    background: '#000000',     // Black
    surface: '#0a0a0f',        // Near Black
} as const;

/**
 * Palette 3: Cyber Purple
 * Futuristic purple neon theme
 */
export const DARK_PALETTE_CYBER = {
    primary: '#a78bfa',        // Purple-400
    secondary: '#8b5cf6',      // Purple-500
    accent: '#c4b5fd',         // Purple-300
    background: '#000000',     // Black
    surface: '#0f0a15',        // Near Black with purple tint
} as const;

/**
 * Palette 4: Hot Pink
 * Bold, striking pink theme
 */
export const DARK_PALETTE_HOT = {
    primary: '#fb7185',        // Rose-400
    secondary: '#f43f5e',      // Rose-500
    accent: '#fda4af',         // Rose-300
    background: '#000000',     // Black
    surface: '#150a0f',        // Near Black with rose tint
} as const;

/**
 * Palette 5: Golden Hour
 * Warm, glowing amber theme
 */
export const DARK_PALETTE_GOLDEN = {
    primary: '#fbbf24',        // Amber-400
    secondary: '#f59e0b',      // Amber-500
    accent: '#fcd34d',         // Amber-300
    background: '#000000',     // Black
    surface: '#0f0a00',        // Near Black with amber tint
} as const;

/**
 * Theme type definition
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Available color palette names
 */
export type PaletteName = 'emerald' | 'ocean' | 'sunset' | 'rose' | 'amber';

/**
 * All color palettes grouped by name
 * Used by PaletteSelector component for dynamic palette switching
 */
export const COLOR_PALETTES = {
    emerald: {
        light: LIGHT_PALETTE_EMERALD,
        dark: DARK_PALETTE_EMERALD
    },
    ocean: {
        light: LIGHT_PALETTE_OCEAN,
        dark: DARK_PALETTE_ELECTRIC
    },
    sunset: {
        light: LIGHT_PALETTE_SUNSET,
        dark: DARK_PALETTE_CYBER
    },
    rose: {
        light: LIGHT_PALETTE_ROSE,
        dark: DARK_PALETTE_HOT
    },
    amber: {
        light: LIGHT_PALETTE_AMBER,
        dark: DARK_PALETTE_GOLDEN
    }
} as const;

/**
 * Current active palette (can be changed to switch entire app theme)
 * Change this value to switch the entire application's color scheme
 */
export const ACTIVE_PALETTE: PaletteName = 'ocean';

/* ============================================
   PALETTE-BASED COLOR GENERATION
   ============================================ */

/**
 * Helper function to convert hex to rgba
 * EXPORTED for use in components
 */
export function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get the active palette for light theme
 */
function getActiveLightPalette() {
    const palettes = {
        emerald: LIGHT_PALETTE_EMERALD,
        ocean: LIGHT_PALETTE_OCEAN,
        sunset: LIGHT_PALETTE_SUNSET,
        rose: LIGHT_PALETTE_ROSE,
        amber: LIGHT_PALETTE_AMBER,
    };
    return palettes[ACTIVE_PALETTE];
}

/**
 * Get the active palette for dark theme
 */
function getActiveDarkPalette() {
    const palettes = {
        emerald: DARK_PALETTE_EMERALD,
        ocean: DARK_PALETTE_ELECTRIC,
        sunset: DARK_PALETTE_CYBER,
        rose: DARK_PALETTE_HOT,
        amber: DARK_PALETTE_GOLDEN,
    };
    return palettes[ACTIVE_PALETTE];
}

/**
 * Base Color Palette - Dynamically generated from active palette
 * 
 * Core colors used throughout the application.
 * These are automatically derived from the selected palette above.
 */
export const BASE_COLORS = (() => {
    const lightPalette = getActiveLightPalette();
    const darkPalette = getActiveDarkPalette();

    return {
        light: {
            // Backgrounds
            bgPrimary: lightPalette.background,
            bgSecondary: lightPalette.surface,

            // Text
            textPrimary: '#020617',
            textSecondary: '#334155',
            textTertiary: '#64748b',

            // Cards & Glass
            cardBg: 'rgba(255, 255, 255, 0.75)',
            cardBorder: hexToRgba(lightPalette.primary, 0.2),
            cardHoverBg: 'rgba(255, 255, 255, 0.95)',

            // Effects
            glassGlow: hexToRgba(lightPalette.primary, 0.35),
            neonGlow: hexToRgba(lightPalette.primary, 0.3),

            // Inputs
            inputBg: 'rgba(255, 255, 255, 0.8)',
            inputBorder: 'rgba(15, 23, 42, 0.2)',

            // Dock
            dockBg: 'rgba(240, 240, 245, 0.65)',
            dockItemBg: 'rgba(15, 23, 42, 0.05)',
            dockItemBgActive: lightPalette.surface,
            dockText: '#64748b',
        },

        dark: {
            // Backgrounds
            bgPrimary: darkPalette.background,
            bgSecondary: darkPalette.surface,

            // Text
            textPrimary: '#f5f5f7',
            textSecondary: '#94a3b8',
            textTertiary: '#4b5563',

            // Cards & Glass
            cardBg: 'rgba(22, 22, 22, 0.6)',
            cardBorder: hexToRgba(darkPalette.primary, 0.08),
            cardHoverBg: 'rgba(30, 30, 30, 0.7)',

            // Effects
            glassGlow: 'rgba(255, 255, 255, 0.08)',
            neonGlow: hexToRgba(darkPalette.primary, 0.4),

            // Inputs
            inputBg: 'rgba(255, 255, 255, 0.08)',
            inputBorder: 'rgba(255, 255, 255, 0.1)',

            // Dock
            dockBg: 'rgba(15, 15, 20, 0.6)',
            dockItemBg: 'rgba(255, 255, 255, 0.05)',
            dockItemBgActive: '#ffffff',
            dockText: '#94a3b8',
        }
    } as const;
})();

/**
 * Network Animation Colors - Dynamically generated from active palette
 * 
 * Colors used in the canvas background network visualization.
 * Light mode uses darker colors for contrast, dark mode uses lighter/neon colors.
 */
export const NETWORK_COLORS = (() => {
    const lightPalette = getActiveLightPalette();
    const darkPalette = getActiveDarkPalette();

    return {
        light: {
            // Canvas background
            canvasBg: lightPalette.surface,

            // Nodes (darker for visibility on light background)
            nodeColor: 'rgba(0, 0, 0, 1)',

            // Lines connecting nodes
            lineColor: 'rgba(71, 85, 105, 0.25)',

            // Data packets traveling between nodes
            packetColor: lightPalette.secondary,
            packetGlow: hexToRgba(lightPalette.primary, 0.3)
        },

        dark: {
            // Canvas background
            canvasBg: darkPalette.background,

            // Nodes (lighter for visibility on dark background)
            nodeColor: hexToRgba(darkPalette.primary, 1),

            // Lines connecting nodes
            lineColor: hexToRgba(darkPalette.primary, 0.32),

            // Data packets traveling between nodes
            packetColor: darkPalette.accent,
            packetGlow: hexToRgba(darkPalette.primary, 0.4),
        }
    } as const;
})();

/**
 * Social Media Brand Colors
 * 
 * Official brand colors for social media platforms.
 * These should remain consistent across themes.
 */
export const SOCIAL_COLORS = {
    linkedin: {
        primary: '#0077b5',
        hover: 'hover:text-[#0077b5] hover:bg-[#0077b5]/10 hover:border-[#0077b5]/30',
    },
    github: {
        light: '#333',
        dark: '#ffffff',
        hover: 'hover:text-[#333] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20',
    },
    whatsapp: {
        primary: '#25D366',
        hover: 'hover:text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/30',
    },
    instagram: {
        primary: '#E4405F',
        hover: 'hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30',
    },
} as const;

/**
 * Semantic Colors - Dynamically generated from active palette
 * 
 * Colors with semantic meaning (success, error, warning, etc.)
 * Success colors use the active palette, others remain consistent
 */
export const SEMANTIC_COLORS = (() => {
    const lightPalette = getActiveLightPalette();
    const darkPalette = getActiveDarkPalette();

    return {
        light: {
            success: lightPalette.secondary,
            successBg: lightPalette.background,
            successText: lightPalette.primary,

            error: '#dc2626',        // Red-600
            errorBg: '#fef2f2',      // Red-50
            errorText: '#7f1d1d',    // Red-900

            warning: '#d97706',      // Amber-600
            warningBg: '#fffbeb',    // Amber-50
            warningText: '#78350f',  // Amber-900

            info: '#0284c7',         // Sky-600
            infoBg: '#f0f9ff',       // Sky-50
            infoText: '#0c4a6e',     // Sky-900
        },

        dark: {
            success: darkPalette.primary,
            successBg: hexToRgba(darkPalette.primary, 0.1),
            successText: darkPalette.accent,

            error: '#f87171',        // Red-400
            errorBg: 'rgba(239, 68, 68, 0.1)',
            errorText: '#fca5a5',    // Red-300

            warning: '#fbbf24',      // Amber-400
            warningBg: 'rgba(245, 158, 11, 0.1)',
            warningText: '#fcd34d',  // Amber-300

            info: '#38bdf8',         // Sky-400
            infoBg: 'rgba(14, 165, 233, 0.1)',
            infoText: '#7dd3fc',     // Sky-300
        }
    } as const;
})();

/**
 * Component-Specific Colors
 * 
 * Colors used by specific components that don't fit other categories
 */
export const COMPONENT_COLORS = {
    light: {
        // Liquid Button
        buttonText: '#0f172a',
        buttonBg: '#ffffff',
        buttonShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 4px 10px -3px rgba(16, 185, 129, 0.2), inset 0 0 0 1px rgba(255,255,255, 1)',
        highlightColor: 'rgba(255, 255, 255, 0.8)',

        // Circuit Animation
        circuitColor1: 'rgba(6, 78, 59, 0.9)',    // Deep Emerald
        circuitColor2: 'rgba(2, 44, 34, 0.9)',    // Black Green
    },

    dark: {
        // Liquid Button
        buttonText: '#000000',
        buttonBg: '#ffffff',
        buttonShadow: '0 0 30px -5px rgba(52, 211, 153, 0.4)',
        highlightColor: 'rgba(255, 255, 255, 0.2)',

        // Circuit Animation
        circuitColor1: 'rgba(52, 211, 153, 0.4)', // Emerald-400
        circuitColor2: 'rgba(34, 211, 238, 0.4)', // Cyan-400
    }
} as const;

/**
 * Accent Colors - Dynamically generated from active palette
 * 
 * Primary accent uses the active palette, others remain for compatibility.
 */
export const ACCENT_COLORS = (() => {
    const lightPalette = getActiveLightPalette();

    return {
        primary: {
            // CSS variable values based on active palette
            border: hexToRgba(lightPalette.primary, 0.3),
            glow: hexToRgba(lightPalette.primary, 0.5),
            neon: hexToRgba(lightPalette.primary, 0.4),

            // Variants for different opacities
            light: hexToRgba(lightPalette.primary, 0.15),
            medium: hexToRgba(lightPalette.primary, 0.25),

            // Solid colors
            solid: lightPalette.primary,
            dark: lightPalette.secondary,
            darker: lightPalette.secondary,
        },
        emerald: {
            // CSS variable values
            border: 'rgba(16, 185, 129, 0.3)',
            glow: 'rgba(16, 185, 129, 0.5)',
            neon: 'rgba(16, 185, 129, 0.4)',

            // Variants for different opacities
            light: 'rgba(16, 185, 129, 0.15)',
            medium: 'rgba(16, 185, 129, 0.25)',

            // Solid colors
            solid: '#10b981',      // Emerald-500
            dark: '#059669',       // Emerald-600
            darker: '#047857',     // Emerald-700
        },
        cyan: {
            border: 'rgba(6, 182, 212, 0.3)',
            glow: 'rgba(6, 182, 212, 0.5)',
            neon: 'rgba(6, 182, 212, 0.4)',
            light: 'rgba(6, 182, 212, 0.15)',
            solid: '#06b6d4',      // Cyan-500
        },
        blue: {
            border: 'rgba(37, 99, 235, 0.3)',
            glow: 'rgba(37, 99, 235, 0.5)',
            neon: 'rgba(37, 99, 235, 0.4)',
            light: 'rgba(37, 99, 235, 0.15)',
            solid: '#3b82f6',      // Blue-500
            bright: '#60a5fa',     // Blue-400
        },
        purple: {
            border: 'rgba(124, 58, 237, 0.3)',
            glow: 'rgba(124, 58, 237, 0.5)',
            neon: 'rgba(124, 58, 237, 0.4)',
            light: 'rgba(124, 58, 237, 0.15)',
            solid: '#8b5cf6',      // Purple-500
        },
        rose: {
            border: 'rgba(225, 29, 72, 0.3)',
            glow: 'rgba(225, 29, 72, 0.5)',
            neon: 'rgba(225, 29, 72, 0.4)',
            light: 'rgba(225, 29, 72, 0.15)',
            solid: '#f43f5e',      // Rose-500
        },
        slate: {
            border: 'rgba(71, 85, 105, 0.25)',
            glow: 'rgba(148, 163, 184, 0.4)',
            neon: 'rgba(148, 163, 184, 0.3)',
            light: 'rgba(71, 85, 105, 0.15)',
            solid: '#64748b',      // Slate-500
        },
    } as const;
})();

/**
 * Glow Effects - Dynamically generated from active palette
 * 
 * Shadow effects for glowing elements.
 * Organized by color and intensity.
 */
export const GLOW_EFFECTS = (() => {
    const lightPalette = getActiveLightPalette();

    // Extract RGB values from hex for shadow strings
    const r = parseInt(lightPalette.primary.slice(1, 3), 16);
    const g = parseInt(lightPalette.primary.slice(3, 5), 16);
    const b = parseInt(lightPalette.primary.slice(5, 7), 16);

    return {
        primary: {
            small: `shadow-[0_0_12px_rgba(${r},${g},${b},1)]`,
            medium: `shadow-[0_0_20px_rgba(${r},${g},${b},0.3)]`,
            large: `shadow-[0_0_40px_rgba(${r},${g},${b},0.5)]`,
            subtle: `shadow-[0_0_30px_rgba(${r},${g},${b},0.1)]`,
            hover: `shadow-[0_0_30px_rgba(${r},${g},${b},0.15)]`,
            intense: `shadow-[0_0_30px_rgba(${r},${g},${b},0.3)]`,
            gradient: `shadow-[0_20px_50px_-10px_rgba(${r},${g},${b},0.5)]`,
        },
        emerald: {
            small: 'shadow-[0_0_12px_rgba(16,185,129,1)]',
            medium: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
            large: 'shadow-[0_0_40px_rgba(52,211,153,0.5)]',
            subtle: 'shadow-[0_0_30px_rgba(52,211,153,0.1)]',
            hover: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
            intense: 'shadow-[0_0_30px_rgba(52,211,153,0.3)]',
            gradient: 'shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)]',
        },
        cyan: {
            hover: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
        },
        white: {
            small: 'shadow-[0_0_10px_rgba(255,255,255,0.5)]',
            medium: 'shadow-[0_0_8px_rgba(255,255,255,0.8)]',
        },
        black: {
            medium: 'shadow-[0_0_6px_rgba(0,0,0,0.5)]',
        },
    } as const;
})();

/**
 * Logo Colors
 * 
 * Colors for platform logos and icons.
 */
export const LOGO_COLORS = {
    windows: {
        color: 'text-emerald-500',
        glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    },
    apple: {
        light: 'text-black',
        dark: 'text-white',
        glowLight: 'drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]',
        glowDark: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]',
    },
    linux: {
        color: 'text-blue-500',
        glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]',
    },
    android: {
        glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    },
} as const;

/**
     * Dock Colors
     * 
     * Colors specific to the dock component.
     */
export const DOCK_COLORS = {
    activeBg: 'var(--dock-item-bg-active)',
    inactiveBg: 'rgba(125,125,125,0.05)',
    activeBorder: 'rgba(16, 185, 129, 0.3)',
    inactiveBorder: 'transparent',
    activeGlow: 'rgba(16, 185, 129, 0.4)',
    indicator: {
        bg: 'bg-emerald-500',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,1)]',
    },
    hoverScale: 'scale-105',
    hoverGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
} as const;

/**
 * Helper function to get colors based on theme
 * 
 * @param theme - Current theme ('light', 'dark', or 'system')
 * @param isDarkSystem - Whether system prefers dark mode (for 'system' theme)
 * @returns Color palette for the current theme
 */
export function getThemeColors(theme: 'light' | 'dark' | 'system', isDarkSystem: boolean = false) {
    const isDark = theme === 'dark' || (theme === 'system' && isDarkSystem);

    return {
        base: isDark ? BASE_COLORS.dark : BASE_COLORS.light,
        network: isDark ? NETWORK_COLORS.dark : NETWORK_COLORS.light,
        semantic: isDark ? SEMANTIC_COLORS.dark : SEMANTIC_COLORS.light,
        component: isDark ? COMPONENT_COLORS.dark : COMPONENT_COLORS.light,
        social: SOCIAL_COLORS, // Same for both themes
        accent: ACCENT_COLORS, // Same for both themes
        glow: GLOW_EFFECTS, // Same for both themes
        logo: LOGO_COLORS, // Same for both themes
        dock: DOCK_COLORS, // Same for both themes
    };
}

/**
 * Get dynamic Tailwind color classes based on active palette
 * Use these instead of hardcoded 'emerald-500' classes
 */
export const DYNAMIC_COLORS = (() => {
    const lightPalette = getActiveLightPalette();
    const darkPalette = getActiveDarkPalette();

    // Extract RGB values for Tailwind arbitrary values
    const lightRgb = {
        r: parseInt(lightPalette.primary.slice(1, 3), 16),
        g: parseInt(lightPalette.primary.slice(3, 5), 16),
        b: parseInt(lightPalette.primary.slice(5, 7), 16),
    };

    const darkRgb = {
        r: parseInt(darkPalette.primary.slice(1, 3), 16),
        g: parseInt(darkPalette.primary.slice(3, 5), 16),
        b: parseInt(darkPalette.primary.slice(5, 7), 16),
    };

    return {
        // Text colors
        text: `text-[${lightPalette.primary}] dark:text-[${darkPalette.primary}]`,
        textSecondary: `text-[${lightPalette.secondary}] dark:text-[${darkPalette.secondary}]`,
        textAccent: `text-[${lightPalette.accent}] dark:text-[${darkPalette.accent}]`,

        // Background colors
        bg: `bg-[${lightPalette.primary}] dark:bg-[${darkPalette.primary}]`,
        bgSecondary: `bg-[${lightPalette.secondary}] dark:bg-[${darkPalette.secondary}]`,
        bgAccent: `bg-[${lightPalette.accent}] dark:bg-[${darkPalette.accent}]`,

        // Border colors
        border: `border-[${lightPalette.primary}] dark:border-[${darkPalette.primary}]`,
        borderOpacity: `border-[${lightPalette.primary}]/30 dark:border-[${darkPalette.primary}]/30`,

        // Gradient classes
        gradientFrom: `from-[${lightPalette.primary}] dark:from-[${darkPalette.primary}]`,
        gradientTo: `to-[${lightPalette.accent}] dark:to-[${darkPalette.accent}]`,

        // Shadow/glow effects
        shadow: `shadow-[0_0_30px_rgba(${lightRgb.r},${lightRgb.g},${lightRgb.b},0.15)] dark:shadow-[0_0_30px_rgba(${darkRgb.r},${darkRgb.g},${darkRgb.b},0.3)]`,
        glow: `shadow-[0_0_12px_rgba(${lightRgb.r},${lightRgb.g},${lightRgb.b},1)] dark:shadow-[0_0_12px_rgba(${darkRgb.r},${darkRgb.g},${darkRgb.b},1)]`,

        // Ring colors (for focus states)
        ring: `ring-[${lightPalette.primary}]/50 dark:ring-[${darkPalette.primary}]/50`,

        // Hover states
        hoverText: `hover:text-[${lightPalette.primary}] dark:hover:text-[${darkPalette.primary}]`,
        hoverBg: `hover:bg-[${lightPalette.primary}]/10 dark:hover:bg-[${darkPalette.primary}]/10`,
        hoverBorder: `hover:border-[${lightPalette.primary}]/50 dark:hover:border-[${darkPalette.primary}]/50`,

        // Focus states
        focusBorder: `focus:border-[${lightPalette.primary}]/50 dark:focus:border-[${darkPalette.primary}]/50`,
        focusRing: `focus:ring-[${lightPalette.primary}]/50 dark:focus:ring-[${darkPalette.primary}]/50`,

        // Raw color values (for inline styles)
        raw: {
            light: {
                primary: lightPalette.primary,
                secondary: lightPalette.secondary,
                accent: lightPalette.accent,
                rgb: lightRgb,
            },
            dark: {
                primary: darkPalette.primary,
                secondary: darkPalette.secondary,
                accent: darkPalette.accent,
                rgb: darkRgb,
            },
        },
    };
})();

/**
 * Inject CSS variables into the document based on active palette
 * Call this function on app initialization to update CSS custom properties
 */
export function injectPaletteCSS() {
    const lightPalette = getActiveLightPalette();
    const darkPalette = getActiveDarkPalette();

    // Update CSS variables for light theme
    const lightVars = {
        '--primary-color': lightPalette.primary,
        '--secondary-color': lightPalette.secondary,
        '--accent-color': lightPalette.accent,
        '--primary-rgb': `${parseInt(lightPalette.primary.slice(1, 3), 16)}, ${parseInt(lightPalette.primary.slice(3, 5), 16)}, ${parseInt(lightPalette.primary.slice(5, 7), 16)}`,

        // Glow and shadow effects
        '--primary-glow': hexToRgba(lightPalette.primary, 0.35),
        '--primary-shadow': hexToRgba(lightPalette.primary, 0.2),

        // Gradient colors
        '--primary-gradient': hexToRgba(lightPalette.primary, 0.1),
        '--accent-gradient-1': hexToRgba(lightPalette.accent, 0.1),

        // Animation/circuit colors (darker versions for light mode)
        '--primary-dark': hexToRgba(lightPalette.primary, 0.9),
        '--primary-darker': hexToRgba(lightPalette.secondary, 0.9),
    };

    // Update CSS variables for dark theme
    const darkVars = {
        '--primary-color-dark': darkPalette.primary,
        '--secondary-color-dark': darkPalette.secondary,
        '--accent-color-dark': darkPalette.accent,
        '--primary-rgb-dark': `${parseInt(darkPalette.primary.slice(1, 3), 16)}, ${parseInt(darkPalette.primary.slice(3, 5), 16)}, ${parseInt(darkPalette.primary.slice(5, 7), 16)}`,

        // Dark mode specific (lighter versions for dark mode)
        '--primary-light': hexToRgba(darkPalette.primary, 0.4),
        '--accent-light': hexToRgba(darkPalette.accent, 0.4),
        '--accent-gradient-2': hexToRgba(darkPalette.accent, 0.08),
    };

    // Apply to :root
    const root = document.documentElement;
    Object.entries(lightVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
    Object.entries(darkVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

/**
 * Get dynamic button/component styles based on active palette
 * Use this for LiquidButton and other components that need dynamic CSS variables
 */
export function getDynamicButtonStyles() {
    const lightPalette = getActiveLightPalette();
    const darkPalette = getActiveDarkPalette();

    return {
        light: {
            '--card-bg': hexToRgba(lightPalette.primary, 0.15),
            '--card-hover-bg': hexToRgba(lightPalette.primary, 0.25),
            '--card-border': hexToRgba(lightPalette.primary, 0.5),
            '--glass-glow': hexToRgba(lightPalette.primary, 0.6),
            '--highlight-color': hexToRgba(lightPalette.primary, 0.2),
        },
        dark: {
            '--card-bg': hexToRgba(darkPalette.primary, 0.15),
            '--card-hover-bg': hexToRgba(darkPalette.primary, 0.25),
            '--card-border': hexToRgba(darkPalette.primary, 0.5),
            '--glass-glow': hexToRgba(darkPalette.primary, 0.6),
            '--highlight-color': hexToRgba(darkPalette.primary, 0.2),
        },
    };
}

/**
 * Helper to determine if current theme is dark
 * 
 * @param theme - Current theme setting
 * @returns true if dark mode is active
 */
export function isDarkTheme(theme: 'light' | 'dark' | 'system'): boolean {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // For 'system', check browser preference
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Color Usage Guide
 * 
 * ## Base Colors
 * - bgPrimary: Main background color
 * - bgSecondary: Secondary background (cards, modals)
 * - textPrimary: Main text color
 * - textSecondary: Secondary text (descriptions, labels)
 * - textTertiary: Tertiary text (hints, placeholders)
 * 
 * ## Network Animation
 * - canvasBg: Canvas background
 * - nodeColor: Network node color (append opacity)
 * - lineColor: Connection lines between nodes
 * - packetColor: Data packets traveling on network
 * 
 * ## Social Media
 * - Use SOCIAL_COLORS for consistent brand colors
 * - Hover states include background and border colors
 * 
 * ## Semantic Colors
 * - success: Positive actions, confirmations
 * - error: Errors, destructive actions
 * - warning: Warnings, caution
 * - info: Information, neutral notifications
 * 
 * ## CSS Variable Mapping
 * All colors in this file correspond to CSS variables in styles.css:
 * - BASE_COLORS → --bg-*, --text-*, --card-*, etc.
 * - NETWORK_COLORS → Used in CanvasBackground component
 * - SEMANTIC_COLORS → --success-*, --error-*, etc.
 * - COMPONENT_COLORS → --button-*, --circuit-*, etc.
 */
