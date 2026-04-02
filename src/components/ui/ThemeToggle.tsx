import React from 'react';
import { useStore } from '@nanostores/react';
import { settings, setTheme } from '../../store';
import { Icons } from '../Icons';

/**
 * ThemeToggle Component
 * 
 * Floating button that cycles through theme options: system → dark → light → system.
 * Displays different icons based on the current theme.
 * Located in the top-right corner of the screen.
 */
export const ThemeToggle = () => {
    const { theme } = useStore(settings);

    const cycleTheme = () => {
        setTheme(theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system');
    };

    return (
        <button onClick={cycleTheme} aria-label={theme === 'system' ? 'Theme: System. Switch to dark' : theme === 'dark' ? 'Theme: Dark. Switch to light' : 'Theme: Light. Switch to system'} className="fixed top-3 right-3 md:top-6 md:right-8 z-50 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] shadow-lg hover:scale-110 transition-transform duration-300 group">
            <div className="text-[var(--text-primary)] transition-colors">
                {theme === 'system' && <Icons.Monitor className="w-5 h-5 md:w-6 md:h-6 opacity-70 group-hover:opacity-100" />}
                {theme === 'dark' && <Icons.Moon className="w-5 h-5 md:w-6 md:h-6 opacity-70 group-hover:opacity-100" />}
                {theme === 'light' && <Icons.Sun className="w-5 h-5 md:w-6 md:h-6 opacity-70 group-hover:opacity-100" />}
            </div>
        </button>
    );
};
