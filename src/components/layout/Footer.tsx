import React from 'react';
import { Icons } from '../Icons';
import { UI_TEXT } from '../../constants/ui-text';
import type { Language } from '../../types';

interface FooterProps {
    lang?: Language;
}

const NAV_LINKS = (lang: Language) => [
    { label: UI_TEXT[lang].nav.home, href: `/${lang}/` },
    { label: UI_TEXT[lang].nav.services, href: `/${lang}/services` },
    { label: UI_TEXT[lang].nav.work, href: `/${lang}/portfolio` },
    { label: UI_TEXT[lang].nav.resources, href: `/${lang}/resources` },
    { label: UI_TEXT[lang].nav.contact, href: `/${lang}/contact` },
];

const SOCIAL_LINKS = [
    {
        label: 'GitHub',
        href: 'https://github.com/bryanvrgsc',
        icon: 'GitHub' as const,
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/bryanvrgsc',
        icon: 'LinkedIn' as const,
    },
];

export const Footer = ({ lang = 'es' }: FooterProps) => {
    const t = UI_TEXT[lang].footer;
    const year = new Date().getFullYear();

    return (
        <footer className="relative z-10 w-full border-t border-[var(--card-border)] bg-[var(--bg-secondary)]/40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className="text-sm font-semibold text-[var(--text-primary)] tracking-wide">
                            @bryanvrgsc
                        </span>
                        <span className="text-xs text-[var(--text-tertiary)]">
                            © {year} Bryan Vargas · {t.allRights}
                        </span>
                    </div>

                    {/* Nav links */}
                    <nav aria-label="Footer navigation">
                        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                            {NAV_LINKS(lang).map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Social + built-with */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="flex items-center gap-3">
                            {SOCIAL_LINKS.map((s) => {
                                const Icon = Icons[s.icon];
                                return (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="text-[var(--text-tertiary)] hover:text-[var(--primary-color)] transition-colors duration-200"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                        <span className="text-[10px] text-[var(--text-tertiary)] opacity-60">
                            {t.builtWith} Astro &amp; React
                        </span>
                    </div>

                </div>
            </div>
        </footer>
    );
};
