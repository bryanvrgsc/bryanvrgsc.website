import React from 'react';
import { Icons } from '../Icons';
import { UI_TEXT } from '../../constants/ui-text';
import { SERVICES, ENGAGEMENT_MODELS } from '../../constants';
import { getCategoryTheme, useMousePosition } from '../../utils/helpers';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { LiquidButton } from '../common/LiquidButton';
import type { Language } from '../../types';

/**
 * ServicesView Component
 * 
 * Displays all services offered with detailed descriptions,
 * value propositions, and engagement models.
 */

interface ServicesViewProps {
    lang?: Language;
}

export const ServicesView = ({ lang = 'es' }: ServicesViewProps) => {
    const handleMouseMove = useMousePosition();
    const t = UI_TEXT[lang].services;

    return (
        <div className="max-w-7xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-40 md:pb-52 animate-slide-up">
            <div className="flex flex-col items-center text-center mb-8 md:mb-16 px-2 md:px-0">
                <div><h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">{t.title}</h1><p className="text-[var(--text-secondary)] text-base md:text-lg">{t.subtitle}</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {SERVICES[lang].map((s) => {
                    const Icon = Icons[s.iconName as keyof typeof Icons];
                    const theme = getCategoryTheme(s.title);
                    return (
                        <div
                            onMouseMove={handleMouseMove}
                            key={s.title}
                            className="bento-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col items-start text-left h-full group transition-all duration-700 hover:-translate-y-2 relative overflow-hidden"
                            style={theme.colors as React.CSSProperties}
                        >
                            {/* Animated Pulse Indicator */}
                            <div aria-hidden="true" className={`absolute top-6 right-6 md:top-10 md:right-10 flex items-center justify-center z-20 ${theme.text}`}>
                                <div className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></div>
                                    <div className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-current opacity-80"></div>
                                </div>
                            </div>

                            <div className={`h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-gradient-to-br ${theme.gradientFrom} to-transparent flex items-center justify-center mb-6 md:mb-10 border border-[var(--card-border)] ${theme.text} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg relative z-10`}>
                                <Icon className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm" />
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3 relative z-10 tracking-tight">{s.title}</h3>

                            <p className="text-sm md:text-base text-[var(--text-secondary)] mb-6 md:mb-8 relative z-10 text-justify leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                                {s.description}
                            </p>

                            <div className="flex-grow space-y-3 md:space-y-4 relative z-10 w-full flex flex-col items-start mb-8">
                                {s.items.map((item) => (
                                    <div key={item} className="flex items-start justify-start gap-3 md:gap-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors w-full">
                                        <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${theme.bullet} shadow-sm flex-shrink-0 mt-2.5 opacity-60`}></div>
                                        <span className="text-xs md:text-sm font-medium leading-relaxed text-justify">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-6 md:pt-8 border-t border-[var(--card-border)] relative z-10 w-full flex flex-col items-start">
                                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-4 opacity-70">{t.impact}</p>
                                <div className="grid grid-cols-1 gap-2 w-full">
                                    {s.valueProp.map((vp) => (
                                        <div key={vp} className="flex items-center justify-start gap-3 text-[10px] md:text-xs text-[var(--text-secondary)] bg-[var(--input-bg)] p-2.5 md:p-3 rounded-xl border border-[var(--card-border)] group-hover:bg-[var(--glass-glow)] transition-colors w-full border-opacity-30">
                                            <span className={theme.text}><Icons.CheckCircle className="w-3.5 h-3.5" /></span>
                                            {vp}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Background Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                    );
                })}
            </div>
            <div onMouseMove={handleMouseMove} className="mt-8 md:mt-12 p-5 md:p-10 bento-card rounded-[2rem] md:rounded-[2.5rem]">
                <h3 className="text-2xl font-bold mb-6 md:mb-8 tracking-tight text-[var(--text-primary)] text-center">{t.engagementModels}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">{ENGAGEMENT_MODELS[lang].map((m) => { const Icon = Icons[m.iconName as keyof typeof Icons]; return (<div key={m.label} className="flex flex-col items-center justify-center p-6 md:p-8 bg-[var(--input-bg)] rounded-3xl border border-[var(--card-border)] hover:bg-[var(--glass-glow)] transition-all duration-300 group cursor-default hover:-translate-y-1 text-center"><div className="mb-4 transition-all hover:![color:var(--hover-color)]" style={{ color: 'var(--text-tertiary)', '--hover-color': DYNAMIC_COLORS.raw.light.primary } as React.CSSProperties}><Icon className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:scale-110" /></div><span className="text-sm font-semibold text-[var(--text-primary)] tracking-wide">{m.label}</span></div>); })}</div>
            </div>

            {/* CTA Button to Portfolio */}
            <div className="flex justify-center mt-12 md:mt-20">
                <LiquidButton
                    href={`/${lang}/portfolio`}
                    className="px-8 py-4 md:px-12 md:py-6 text-sm md:text-lg rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 group/btn"
                >
                    <span className="flex items-center gap-3 text-[var(--text-primary)]">
                        {UI_TEXT[lang].nav.work}
                        <Icons.ArrowUp className="w-4 h-4 md:w-5 md:h-5 rotate-90 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                </LiquidButton>
            </div>
        </div>
    );
};
