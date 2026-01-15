import React, { useLayoutEffect, useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { settings, dockState, hideDock, showDock } from '../../store';
import { Icons } from '../Icons';
import { UI_TEXT } from '../../constants';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { GlassDock } from '../common/GlassElement';
import { LiquidButton } from '../common/LiquidButton';
import { navigateTo } from '../../utils/navigation';

/**
 * Dock Component
 * 
 * Main navigation dock displayed at the bottom of the screen.
 * Features a glass morphism design with animated liquid indicator that slides between items.
 * Includes navigation items and a contact button.
 * 
 * @param currentPath - The current route path for active state detection
 */

interface DockItemType {
    id: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    href: string;
}

const DockItem = React.memo(({
    item,
    isActive,
    itemRef,
    onNavigate
}: {
    item: DockItemType;
    isActive: boolean;
    itemRef: (el: HTMLAnchorElement | null) => void;
    onNavigate: (href: string) => void;
}) => (
    <a
        ref={itemRef}
        data-id={item.id}
        href={`#${item.href}`}
        onClick={(e) => { e.preventDefault(); onNavigate(item.href); }}
        className={`dock-item group relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)]
            ${isActive
                ? 'text-[var(--text-primary)]'
                : 'text-[#8E8E93] hover:text-[var(--text-primary)] hover:scale-105'}`}
    >
        <item.Icon className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-500 relative z-10 ${isActive ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
        <span className={`text-[10px] md:text-[11px] font-medium tracking-tight transition-all duration-500 relative z-10 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
            {item.label}
        </span>
    </a>
));

DockItem.displayName = 'DockItem';

export const Dock = React.memo(({ path }: { path: string }) => {
    const { lang } = useStore(settings);
    const { hidden: isDockHidden } = useStore(dockState);
    const t = UI_TEXT[lang].nav;
    const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, height: 0, opacity: 0 });
    const isFirstRender = useRef(true);
    const lastScrollY = useRef(0);

    // Scroll detection - hide dock when scrolling down, show on scroll up
    useEffect(() => {
        let ticking = false;
        let scrollVelocity = 0;
        const velocityDecay = 0.8;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDelta = currentScrollY - lastScrollY.current;

                    // Update velocity with decay for smoother detection
                    scrollVelocity = scrollVelocity * velocityDecay + scrollDelta * (1 - velocityDecay);

                    // Always show dock when near top of page
                    if (currentScrollY < 100) {
                        if (isDockHidden) showDock();
                    }
                    // Hide dock when scrolling down fast and past 150px from top
                    else if (scrollVelocity > 15 && currentScrollY > 150 && !isDockHidden) {
                        hideDock();
                    }
                    // Show dock immediately on ANY upward scroll
                    else if (scrollDelta < -5 && isDockHidden) {
                        showDock();
                    }

                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDockHidden]);

    const activeId = useMemo(() => {
        const p = path || '/';
        if (p === '/') return 'home';
        if (p.includes('/services')) return 'services';
        if (p.includes('/portfolio')) return 'portfolio';
        if (p.includes('/resources')) return 'resources';
        if (p.includes('/contact')) return 'contact';
        return 'home';
    }, [path]);

    const navItems = useMemo<DockItemType[]>(() => [
        { id: 'home', label: t.home, Icon: Icons.Home, href: '/' },
        { id: 'services', label: t.services, Icon: Icons.Layers, href: '/services' },
        { id: 'portfolio', label: t.work, Icon: Icons.Briefcase, href: '/portfolio' },
        { id: 'resources', label: t.resources, Icon: Icons.Book, href: '/resources' },
    ], [t]);

    const handleNavigate = useCallback((href: string) => {
        navigateTo(href);
    }, []);

    // State to track if we should skip transition (e.g. initial render or re-appearing)
    const [skipTransition, setSkipTransition] = useState(false);

    const updateIndicator = useCallback(() => {
        // Hide indicator if activeId is contact (it's a separate button)
        if (activeId === 'contact') {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
            return;
        }

        let container = containerRef.current;

        // Fallback: If ref is not attached yet or null, try to find it by class (especially useful during double-render cycles)
        if (!container) {
            container = document.querySelector('.visible-dock-container > div') as HTMLDivElement;
        }

        if (!container) return;

        // Find the active item specifically INSIDE the visible container to avoid ref collision from double rendering in GlassDock
        const activeElement = container.querySelector(`.dock-item[data-id="${activeId}"]`) as HTMLAnchorElement;

        if (activeElement) {
            const containerRect = container.getBoundingClientRect();
            const activeRect = activeElement.getBoundingClientRect();

            // Only update if we have valid, reasonable dimensions
            if (activeRect.width > 0 && activeRect.height > 0) {
                const left = activeRect.left - containerRect.left;

                setIndicatorStyle({
                    left,
                    width: activeRect.width,
                    height: activeRect.height,
                    opacity: 1,
                });

                // After first successful positioning, disable transitions
                if (isFirstRender.current) {
                    setTimeout(() => {
                        isFirstRender.current = false;
                    }, 100);
                }
            }
        }
    }, [activeId]);

    // Use ResizeObserver for highly robust positioning that handles any layout shifts
    useEffect(() => {
        if (isDockHidden) return;

        const container = containerRef.current || document.querySelector('.visible-dock-container > div');
        if (!container) return;

        // Update immediately on mount/visibility change
        updateIndicator();

        const observer = new ResizeObserver(() => {
            updateIndicator();
        });

        observer.observe(container as Element);
        // Also observe children to catch any internal layout shifts
        const items = (container as Element).querySelectorAll('.dock-item');
        items.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, [isDockHidden, updateIndicator]);

    // Ensure indicator is updated when activeId changes, with fallback re-checks
    useEffect(() => {
        if (!isDockHidden) {
            updateIndicator();

            // Multiple re-checks to handle complex animations or lazy-loaded styles
            const timer1 = setTimeout(updateIndicator, 50);
            const timer2 = setTimeout(updateIndicator, 150);
            const timer3 = setTimeout(updateIndicator, 300);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [activeId, isDockHidden, updateIndicator]);

    // Hide indicator immediately when dock hides
    useEffect(() => {
        if (isDockHidden) {
            // Hide indicator when dock is hidden
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
            // Next time we update, skip transition
            setSkipTransition(true);
        }
    }, [isDockHidden]);

    // Reposition when dock re-appears or layout changes
    useLayoutEffect(() => {
        if (isDockHidden) return;

        if (skipTransition) {
            // Wait for dock slide animation to complete, then position without transition
            const timer = setTimeout(() => {
                updateIndicator();
                // Re-enable transitions after a frame
                requestAnimationFrame(() => {
                    setSkipTransition(false);
                });
            }, 300);
            return () => clearTimeout(timer);
        } else {
            updateIndicator();
        }
    }, [isDockHidden, updateIndicator]);

    // Calculate transition dynamicly based on state to ensure animations work after mount
    const indicatorTransition = (isFirstRender.current || skipTransition)
        ? 'none'
        : 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease';

    return (
        <>
            {/* SVG Filters for Goo Effect */}
            <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
                <defs>
                    <filter id="goo-filter" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            <nav
                className={`fixed z-50 flex flex-col items-center select-none left-1/2 -translate-x-1/2 will-change-transform
                    bottom-[calc(0.25rem+env(safe-area-inset-bottom))] md:bottom-[calc(0.5rem+env(safe-area-inset-bottom))]
                    transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${isDockHidden
                        ? 'translate-y-[120%] opacity-0 pointer-events-none'
                        : 'translate-y-0 opacity-100'}`}
                aria-label="Main Navigation"
            >
                <GlassDock>
                    <div ref={containerRef} className="relative flex items-center gap-2 md:gap-3 overflow-visible">
                        {/* Animated Sliding Liquid Indicator */}
                        <div
                            className="liquid-indicator absolute top-1/2 rounded-full pointer-events-none will-change-transform"
                            style={{
                                left: `${indicatorStyle.left}px`,
                                width: `${indicatorStyle.width}px`,
                                height: `${indicatorStyle.height}px`,
                                opacity: indicatorStyle.opacity,
                                transform: 'translateY(-50%)',
                                transition: indicatorTransition,
                                filter: 'url(#goo-filter)',
                            }}
                        >
                            {/* Glass Background - Soft blue capsule with light gradient */}
                            <div
                                className="absolute inset-0 rounded-[inherit]"
                                style={{
                                    background: `linear-gradient(135deg, ${DYNAMIC_COLORS.raw.light.primary}1A 0%, ${DYNAMIC_COLORS.raw.light.primary}0D 100%)`,
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    boxShadow: `inset 0 0 0 1px ${DYNAMIC_COLORS.raw.light.primary}33, 0 4px 15px -5px ${DYNAMIC_COLORS.raw.light.primary}4D`,
                                }}
                            />
                            {/* Inner soft glow */}
                            <div
                                className="absolute inset-0 rounded-[inherit] pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle at 50% 0%, ${DYNAMIC_COLORS.raw.light.primary}1A 0%, transparent 70%)`,
                                }}
                            />
                        </div>

                        {navItems.map((item) => (
                            <DockItem
                                key={item.id}
                                item={item}
                                isActive={activeId === item.id}
                                itemRef={(el) => { itemRefs.current[item.id] = el; }}
                                onNavigate={handleNavigate}
                            />
                        ))}
                    </div>

                    <LiquidButton
                        type="button"
                        primary={activeId === 'contact'}
                        className={`rounded-full px-6 py-2.5 md:px-8 md:py-3 text-xs md:text-sm font-bold transition-all duration-500 shadow-lg shadow-black/5 active:shadow-sm
                            ${activeId === 'contact'
                                ? 'scale-105'
                                : 'hover:scale-105 opacity-90 hover:opacity-100'}`}
                        style={{
                            backgroundColor: activeId === 'contact' ? DYNAMIC_COLORS.raw.light.primary : 'rgba(255, 255, 255, 0.95)',
                            color: activeId === 'contact' ? '#fff' : 'var(--text-primary)',
                            border: activeId === 'contact' ? 'none' : '1px solid rgba(0,0,0,0.05)',
                        } as React.CSSProperties}
                        onClick={() => navigateTo('/contact')}
                    >
                        {t.contact}
                    </LiquidButton>
                </GlassDock>
            </nav>
        </>
    );
});

Dock.displayName = 'Dock';
