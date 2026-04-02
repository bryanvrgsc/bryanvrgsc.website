import React, { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { Icons } from '../Icons';
import type { Language } from '../../types';

/**
 * LanguageToggle Component
 * 
 * Floating button that toggles between English (EN) and Spanish (ES).
 * Displays flag icons for the current language.
 * Located in the top-right corner below the theme toggle.
 */
interface LanguageToggleProps {
    lang?: Language;
}

export const LanguageToggle = ({ lang = 'es' }: LanguageToggleProps) => {
    const [currentLang, setCurrentLang] = useState<Language>(() => {
        if (typeof window === 'undefined') {
            return lang;
        }

        return window.location.pathname.split('/')[1] === 'en' ? 'en' : 'es';
    });

    useEffect(() => {
        const syncLang = () => {
            setCurrentLang(window.location.pathname.split('/')[1] === 'en' ? 'en' : 'es');
        };

        syncLang();
        document.addEventListener('astro:page-load', syncLang);
        return () => document.removeEventListener('astro:page-load', syncLang);
    }, []);

    const handleSwitch = () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        const current = window.location.pathname;
        const nextPath = /^\/(es|en)(\/|$)/.test(current)
            ? current.replace(/^\/(es|en)/, `/${newLang}`)
            : `/${newLang}/`;

        navigate(nextPath);
    };

    return (
        <button onClick={handleSwitch} aria-label={currentLang === 'en' ? 'Language: English. Switch to Spanish' : 'Idioma: Español. Cambiar a inglés'} className="fixed top-16 right-3 md:top-6 md:right-24 z-50 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] shadow-lg hover:scale-110 transition-transform duration-300 group overflow-hidden">
            <div className="w-full h-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                {currentLang === 'en' ? <Icons.FlagUS className="w-5 h-5 md:w-6 md:h-6 rounded-full" /> : <Icons.FlagMX className="w-5 h-5 md:w-6 md:h-6 rounded-full" />}
            </div>
        </button>
    );
};
