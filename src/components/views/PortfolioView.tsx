import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icons } from '../Icons';
import { UI_TEXT } from '../../constants/ui-text';
import { PORTFOLIO } from '../../constants';
import { PortfolioModal } from '../modals';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { useMousePosition } from '../../utils/helpers';
import { LiquidButton } from '../common/LiquidButton';
import type { Language, PortfolioProject } from '../../types';

/**
 * PortfolioView Component
 *
 * Displays portfolio projects in a grid layout.
 * Clicking on a project opens a detailed modal.
 */

interface PortfolioViewProps {
    lang?: Language;
    initialSlug?: string;
}

export const PortfolioView = ({ lang = 'es', initialSlug }: PortfolioViewProps) => {
    const handleMouseMove = useMousePosition();
    const [openSlug, setOpenSlug] = useState<string | null>(initialSlug ?? null);
    const hasInitializedHistory = useRef(false);
    const t = UI_TEXT[lang].portfolio;
    const projects = PORTFOLIO[lang];

    const selectedProject = useMemo<PortfolioProject | null>(
        () => projects.find((project) => project.slug === openSlug) ?? null,
        [openSlug, projects],
    );

    useEffect(() => {
        hasInitializedHistory.current = false;
        setOpenSlug(initialSlug ?? null);
    }, [initialSlug]);

    useEffect(() => {
        if (typeof window === 'undefined' || hasInitializedHistory.current || !initialSlug) {
            return;
        }

        const basePath = `/${lang}/portfolio`;
        const slugPath = `${basePath}/${initialSlug}`;

        if (window.location.pathname !== slugPath) {
            hasInitializedHistory.current = true;
            return;
        }

        if (window.history.state?.modalSlug !== initialSlug) {
            window.history.replaceState({ portfolioBase: true, modalManaged: true }, '', basePath);
            window.history.pushState({ modalSlug: initialSlug, modalManaged: true }, '', slugPath);
        }

        hasInitializedHistory.current = true;
    }, [initialSlug, lang]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const basePath = `/${lang}/portfolio`;
        const slugPrefix = `${basePath}/`;
        const onPopState = () => {
            const currentPath = window.location.pathname;

            if (currentPath.startsWith(slugPrefix)) {
                const nextSlug = currentPath.slice(slugPrefix.length);
                setOpenSlug(nextSlug || null);
                return;
            }

            if (currentPath === basePath || currentPath === `${basePath}/`) {
                setOpenSlug(null);
            }
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [lang]);

    const openProject = useCallback((slug: string) => {
        if (typeof window !== 'undefined') {
            const basePath = `/${lang}/portfolio`;
            const slugPath = `${basePath}/${slug}`;

            if (window.location.pathname !== slugPath || window.history.state?.modalSlug !== slug) {
                window.history.pushState({ modalSlug: slug, modalManaged: true }, '', slugPath);
            }
        }

        setOpenSlug(slug);
    }, [lang]);

    const closeProject = useCallback(() => {
        if (typeof window === 'undefined') {
            setOpenSlug(null);
            return;
        }

        const basePath = `/${lang}/portfolio`;

        if (window.location.pathname.startsWith(`${basePath}/`)) {
            window.history.replaceState({ portfolioBase: true, modalManaged: true }, '', basePath);
        }

        setOpenSlug(null);
    }, [lang]);

    return (
        <>
            <div className="max-w-7xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-32 md:pb-40 animate-slide-up">
                <div className="mb-8 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">{t.title}</h2>
                    <p className="text-[var(--text-secondary)] text-base md:text-lg">{t.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {projects.map((item, i) => {
                        return (
                            <button
                                type="button"
                                onMouseMove={handleMouseMove}
                                onClick={() => openProject(item.slug)}
                                key={i}
                                aria-label={`${item.title} - ${t.viewDetails}`}
                                className="bento-card w-full text-left rounded-[2rem] md:rounded-[3rem] overflow-hidden group p-0 border-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
                            >
                                <div className="h-[250px] md:h-[400px] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-10 opacity-90"></div>
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />

                                    <div className="absolute inset-0 bg-black/30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center animate-[fadeOut_3s_ease-in-out_2s_forwards] md:animate-none">
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                                            <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-2xl">
                                                <svg className="w-12 h-12 text-[var(--primary-color)] animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                    <path d="M22 14a8 8 0 0 1-8 8" />
                                                    <path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                                                    <path d="M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1" />
                                                    <path d="M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10" />
                                                    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 pointer-events-none"><span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] backdrop-blur-xl shadow-xl">{item.tech.split(',')[0]}</span></div>
                                </div>
                                <div className="p-6 md:p-10 relative z-20 -mt-16 md:-mt-24 pointer-events-none">
                                    <h3 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 drop-shadow-lg tracking-tight">{item.title}</h3>
                                    <p className="font-semibold mb-6 md:mb-8 flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider" style={{ color: DYNAMIC_COLORS.raw.light.primary }}><Icons.CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> {item.result}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm text-[var(--text-secondary)]">
                                        <div className="bg-[var(--input-bg)] p-4 md:p-6 rounded-2xl border border-[var(--card-border)]"><span className="block text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] mb-2 md:mb-3 font-bold">{t.challenge}</span><span className="text-sm leading-relaxed block line-clamp-3">{item.problem}</span></div>
                                        <div className="bg-[var(--input-bg)] p-4 md:p-6 rounded-2xl border border-[var(--card-border)]"><span className="block text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] mb-2 md:mb-3 font-bold">{t.solution}</span><span className="text-sm leading-relaxed block line-clamp-3">{item.solution}</span></div>
                                    </div>

                                    <div className="mt-6 pointer-events-auto md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                                            <Icons.ExternalLink className="w-5 h-5" />
                                            {t.viewDetails}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center -mt-20 mb-32 md:-mt-24 md:mb-40">
                <LiquidButton
                    href={`/${lang}/resources`}
                    className="px-8 py-4 md:px-12 md:py-6 text-sm md:text-lg rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 group/btn"
                >
                    <span className="flex items-center gap-3 text-[var(--text-primary)]">
                        {UI_TEXT[lang].nav.resources}
                        <Icons.ArrowUp className="w-4 h-4 md:w-5 md:h-5 rotate-90 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                </LiquidButton>
            </div>

            {selectedProject && <PortfolioModal project={selectedProject} onClose={closeProject} lang={lang} />}
        </>
    );
};
