import React, { useState, useEffect } from 'react';
import { Icons } from '../Icons';
import { DYNAMIC_COLORS } from '../../constants/colors';

/**
 * ScrollToTop Component
 * 
 * Floating button that appears when user scrolls down.
 * Clicking it navigates to the current page's top (triggering scroll to top).
 * Automatically hides when near the top of the page.
 */
export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggle = () => setIsVisible(window.scrollY > 300);
        window.addEventListener('scroll', toggle);
        return () => window.removeEventListener('scroll', toggle);
    }, []);

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed right-3 md:right-8 z-40 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[var(--card-bg)] backdrop-blur-2xl border border-[var(--card-border)] shadow-[var(--button-shadow)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)] group hover:bg-[var(--card-hover-bg)] hover:scale-110 hover:border-[var(--glass-glow)] focus:outline-none focus:ring-2 ${DYNAMIC_COLORS.focusRing} bottom-[calc(6rem+env(safe-area-inset-bottom))] md:bottom-[calc(5.5rem+env(safe-area-inset-bottom))]
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}
        >
            <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(to top right, ${DYNAMIC_COLORS.raw.light.primary}1A, transparent)`
                }}
            ></div>
            <Icons.ArrowUp className="w-5 h-5 md:w-6 md:h-6 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:-translate-y-0.5 transition-all duration-300" />
        </button>
    );
};
