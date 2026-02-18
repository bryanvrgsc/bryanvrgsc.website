import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { settings } from '../../store';
import { Icons } from '../Icons';
import { LiquidButton } from '../common/LiquidButton';
import { TechCard } from '../ui/TechCard';
import { Typewriter } from '../common/Typewriter';
import { UI_TEXT } from '../../constants/ui-text';
import { navigateTo } from '../../utils/navigation';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { useMousePosition } from '../../utils/helpers';
import missionTeam from '../../assets/img/home/mission_team.avif';
import futureVision from '../../assets/img/home/future_vision.avif';
import coreValues from '../../assets/img/home/core_values.avif';

/**
 * HomeView Component
 * 
 * Main landing page with hero section, mission, and vision.
 * Features scroll-snapping sections and animated typewriter effects.
 */

export const HomeView = () => {
    const { lang } = useStore(settings);
    const t = UI_TEXT[lang];
    const [activeStep, setActiveStep] = useState(1);
    const handleMouseMove = useMousePosition();
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        // CRITICAL FIX: Delay enabling scroll snapping to prevent conflict with "scrollTo(0)" animation
        // coming from other pages. If we enable it immediately, the browser fights the scroll 
        // and bounces back.
        const timer = setTimeout(() => {
            document.documentElement.style.scrollSnapType = 'y mandatory';
        }, 400);

        return () => {
            document.documentElement.style.scrollSnapType = '';
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Center-point detection
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = sectionRefs.current.indexOf(entry.target as HTMLElement);
                    if (index !== -1) {
                        setActiveStep(index + 1);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sectionRefs.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (index: number) => {
        sectionRefs.current[index - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="relative flex flex-col items-center w-full">
            <div className="fixed left-3 md:left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 md:gap-6 pointer-events-auto">
                {[{ id: 1, label: t.homeLabels.overview }, { id: 2, label: t.mission.title }, { id: 3, label: t.vision.title }, { id: 4, label: t.homeLabels.values }].map((step) => {
                    const isActive = activeStep === step.id;
                    const activeStyle = isActive ? {
                        backgroundColor: DYNAMIC_COLORS.raw.light.primary,
                        boxShadow: `0 0 15px rgba(${DYNAMIC_COLORS.raw.light.rgb.r}, ${DYNAMIC_COLORS.raw.light.rgb.g}, ${DYNAMIC_COLORS.raw.light.rgb.b}, 0.6)`,
                        borderColor: DYNAMIC_COLORS.raw.light.primary,
                    } : {};

                    return (
                        <div key={step.id} className="group flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection(step.id)}>
                            <div
                                className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full transition-all duration-500 ease-in-out border border-[var(--card-border)] ${isActive ? 'scale-125' : 'bg-[var(--dock-item-bg)] hover:bg-[var(--text-tertiary)] group-hover:scale-110'}`}
                                style={activeStyle}
                            ></div>
                            <span className={`hidden md:inline-block text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500 ${isActive ? 'text-[var(--text-primary)] opacity-100 translate-x-0' : 'text-[var(--text-tertiary)] opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0'}`}>{step.label}</span>
                        </div>
                    );
                })}
                <div className="absolute left-[4px] md:left-[6px] top-2 bottom-2 w-[1px] bg-[var(--card-border)] -z-10 opacity-30"></div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                <section ref={(el) => { sectionRefs.current[0] = el }} className="min-h-screen min-h-[100svh] w-full flex flex-col justify-center items-center py-20 md:py-24 snap-start relative">
                    <div className="flex flex-col items-center text-center animate-slide-up max-w-5xl mx-auto w-full">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem] font-bold tracking-normal mb-4 md:mb-6 leading-[1.2]">
                            <span className="text-[var(--text-primary)] block py-[0.1em]">
                                {t.heroTitle.split(' ')[0]}
                            </span>
                            <span
                                className="block py-[0.1em]"
                                style={{
                                    background: `linear-gradient(to right, ${DYNAMIC_COLORS.raw.light.primary}, ${DYNAMIC_COLORS.raw.light.accent})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    filter: `drop-shadow(0 0 30px rgba(${DYNAMIC_COLORS.raw.light.rgb.r}, ${DYNAMIC_COLORS.raw.light.rgb.g}, ${DYNAMIC_COLORS.raw.light.rgb.b}, 0.3))`,
                                }}
                            >{t.heroTitle.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="max-w-xl md:max-w-2xl mx-auto text-sm sm:text-lg md:text-xl text-[var(--text-secondary)] mb-8 md:mb-8 font-normal leading-relaxed tracking-wide px-2">{t.heroSubtitle}<br /><span className="text-[var(--text-tertiary)] text-xs md:text-lg mt-2 block font-light">{t.heroTags}</span></p>
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center w-full px-4 mb-12 md:mb-16">
                            <LiquidButton
                                primary
                                onClick={() => navigateTo('/contact')}
                                className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-6 text-base md:text-xl min-w-[200px] md:min-w-[240px] rounded-full"
                            >{t.startProject}</LiquidButton>
                            <LiquidButton
                                onClick={() => navigateTo('/portfolio')}
                                className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-6 text-base md:text-xl min-w-[200px] md:min-w-[240px] rounded-full backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500"
                            >{t.exploreWork}</LiquidButton>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full max-w-6xl mx-auto px-1">
                            {[
                                { val: "<50ms", label: t.stats.latency, Icon: Icons.Gauge, color: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
                                { val: "99.9%", label: t.stats.uptime, Icon: Icons.Server, color: 'rgb(6, 182, 212)', bg: 'rgba(6, 182, 212, 0.1)' },
                                { val: "A+", label: t.stats.security, Icon: Icons.ShieldCheck, color: 'rgb(99, 102, 241)', bg: 'rgba(99, 102, 241, 0.1)' },
                                { val: "24/7", label: t.stats.global, Icon: Icons.Globe, color: 'rgb(16, 185, 129)', bg: 'rgba(16, 185, 129, 0.1)' }
                            ].map((stat, i) => (
                                <div
                                    onMouseMove={handleMouseMove}
                                    key={i}
                                    className="bento-card p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-start justify-between min-h-[120px] md:min-h-[200px] group cursor-default backdrop-blur-3xl bg-[var(--card-bg)] border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-700 hover:-translate-y-2"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = `${stat.color}4D`;
                                        e.currentTarget.style.backgroundColor = `${stat.color}0D`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                                    }}
                                >
                                    {/* Grid Pattern Background */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(${stat.color} 1px, transparent 1px)`, backgroundSize: '16px 16px' }}></div>

                                    <div className="flex justify-between items-start w-full relative z-10">
                                        <div className="p-2 md:p-2.5 rounded-xl transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: stat.bg, color: stat.color }}>
                                            <stat.Icon className="w-4 h-4 md:w-6 md:h-6" />
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                                                <div className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: stat.color }}></div>
                                                <div className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5" style={{ backgroundColor: stat.color, opacity: 0.8 }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-4">
                                        <span
                                            className="text-xl md:text-5xl font-mono font-bold text-[var(--text-primary)] tracking-tight mb-1 md:mb-2 block transition-all duration-500 group-hover:translate-x-1"
                                        >{stat.val}</span>
                                        <span className="text-[8px] md:text-[12px] text-[var(--text-secondary)] uppercase font-bold tracking-[0.15em] md:tracking-[0.25em] opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1">{stat.label}</span>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => scrollToSection(2)} className="mt-8 md:mt-10 lg:mt-16 animate-bounce p-2 md:p-3 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors backdrop-blur-md shadow-sm"><Icons.ArrowUp className="w-4 h-4 md:w-5 md:h-5 rotate-180" /></button>
                    </div>
                </section>

                <section ref={(el) => { sectionRefs.current[1] = el }} className="min-h-screen min-h-[100svh] w-full flex flex-col justify-center items-center py-12 md:py-20 snap-start">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center w-full max-w-6xl h-auto md:h-[500px] transition-all duration-500 ${activeStep >= 2 ? 'animate-slide-up-fade opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className="order-2 md:order-1 h-full w-full">
                            <TechCard title={`/// ${t.mission.title.toUpperCase()}`} accentColor="primary" className="h-full flex flex-col justify-center w-full" disableHover={true}>
                                <div className="flex flex-col h-full justify-center"><div className="text-base md:text-lg lg:text-xl leading-relaxed text-justify"><Typewriter text={t.mission.content} startDelay={20} cursorColor={DYNAMIC_COLORS.bg} delay={4} active={activeStep >= 2} /></div></div>
                            </TechCard>
                        </div>
                        <div className="order-1 md:order-2 h-[300px] md:h-full w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-[var(--card-border)] relative group shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent z-10 mix-blend-multiply" style={{ backgroundImage: `linear-gradient(to top, ${DYNAMIC_COLORS.raw.dark.primary}99, transparent, transparent)` }}></div>
                            <img src={missionTeam.src} alt="Mission Team" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.3,1)] group-hover:scale-105" />
                            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20">
                                <div
                                    className="backdrop-blur-xl text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2"
                                    style={{
                                        backgroundColor: `${DYNAMIC_COLORS.raw.light.primary}33`,
                                        borderColor: `${DYNAMIC_COLORS.raw.light.primary}4D`,
                                        border: '1px solid'
                                    }}
                                >
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse" style={{ backgroundColor: DYNAMIC_COLORS.raw.light.accent }}></div>
                                    {t.homeLabels.collaboration}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section ref={(el) => { sectionRefs.current[2] = el }} className="min-h-screen min-h-[100svh] w-full flex flex-col justify-center items-center py-12 md:py-20 snap-start">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center w-full max-w-6xl h-auto md:h-[500px] transition-all duration-500 ${activeStep >= 3 ? 'animate-slide-up-fade opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className="order-1 h-[300px] md:h-full w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-[var(--card-border)] relative group shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent z-10 mix-blend-multiply" style={{ backgroundImage: `linear-gradient(to top, ${DYNAMIC_COLORS.raw.dark.secondary}99, transparent, transparent)` }}></div>
                            <img src={futureVision.src} alt="Future Vision" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.3,1)] group-hover:scale-105" />
                            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
                                <div
                                    className="backdrop-blur-xl text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2"
                                    style={{
                                        backgroundColor: `${DYNAMIC_COLORS.raw.light.secondary}33`,
                                        borderColor: `${DYNAMIC_COLORS.raw.light.secondary}4D`,
                                        border: '1px solid'
                                    }}
                                >
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse" style={{ backgroundColor: DYNAMIC_COLORS.raw.light.accent }}></div>
                                    {t.homeLabels.future}
                                </div>
                            </div>
                        </div>
                        <div className="order-2 h-full w-full flex flex-col">
                            <TechCard title={`/// ${t.vision.title.toUpperCase()}`} accentColor="primary" className="h-full flex flex-col justify-center w-full" disableHover={true}>
                                <div className="flex flex-col h-full justify-center"><div className="text-base md:text-lg lg:text-xl leading-relaxed text-justify"><Typewriter text={t.vision.content} startDelay={20} cursorColor={DYNAMIC_COLORS.bg} delay={4} active={activeStep >= 3} /></div></div>
                            </TechCard>
                        </div>
                    </div>
                </section>
                <section ref={(el) => { sectionRefs.current[3] = el }} className="min-h-screen min-h-[100svh] w-full flex flex-col justify-center items-center py-12 md:py-20 snap-start">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center w-full max-w-6xl h-auto md:h-[500px] transition-all duration-500 ${activeStep >= 4 ? 'animate-slide-up-fade opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className="order-2 md:order-1 h-full w-full">
                            <TechCard title={`/// ${t.values.title.toUpperCase()}`} accentColor="primary" className="h-full flex flex-col justify-center w-full" disableHover={true}>
                                <div className="flex flex-col h-full justify-center"><div className="text-base md:text-lg lg:text-xl leading-relaxed text-justify"><Typewriter text={t.values.content} startDelay={20} cursorColor={DYNAMIC_COLORS.bg} delay={4} active={activeStep >= 4} /></div></div>
                            </TechCard>
                        </div>
                        <div className="order-1 md:order-2 h-[300px] md:h-full w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-[var(--card-border)] relative group shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent z-10 mix-blend-multiply" style={{ backgroundImage: `linear-gradient(to top, ${DYNAMIC_COLORS.raw.dark.primary}99, transparent, transparent)` }}></div>
                            <img src={coreValues.src} alt="Core Values" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.3,1)] group-hover:scale-105" />
                            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20">
                                <div
                                    className="backdrop-blur-xl text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2"
                                    style={{
                                        backgroundColor: `${DYNAMIC_COLORS.raw.light.primary}33`,
                                        borderColor: `${DYNAMIC_COLORS.raw.light.primary}4D`,
                                        border: '1px solid'
                                    }}
                                >
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse" style={{ backgroundColor: DYNAMIC_COLORS.raw.light.accent }}></div>
                                    {t.values.title}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* CTA Button - Outside the main grid to keep dimensions consistent */}
                    <div className={`flex justify-center mt-8 md:mt-16 transition-all duration-700 delay-300 w-full ${activeStep >= 4 ? 'animate-slide-up-fade opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <LiquidButton
                            onClick={() => navigateTo('/services')}
                            className="px-8 py-4 md:px-12 md:py-6 text-sm md:text-lg rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 group/btn"
                        >
                            <span className="flex items-center gap-3">
                                {t.nav.services}
                                <Icons.ArrowUp className="w-4 h-4 md:w-5 md:h-5 rotate-90 transition-transform group-hover/btn:translate-x-1" />
                            </span>
                        </LiquidButton>
                    </div>
                </section>
            </div>
        </div>
    );
};
