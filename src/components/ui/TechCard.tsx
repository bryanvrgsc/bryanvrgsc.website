import React from 'react';
import { DYNAMIC_COLORS, hexToRgba } from '../../constants/colors';

/**
 * TechCard Component
 * 
 * Reusable card component with dynamic accent color theming.
 * Features corner decorations, gradient effects, and hover animations.
 * Colors automatically adapt to the active palette.
 * 
 * @param title - Card title displayed at the top
 * @param children - Card content
 * @param accentColor - Theme color: 'primary' (uses active palette) or 'blue'
 * @param className - Additional CSS classes
 */
export const TechCard = ({ title, children, accentColor = "primary", className = "", disableHover = false }: { title: string, children?: React.ReactNode, accentColor?: "primary" | "blue", className?: string, disableHover?: boolean }) => {
    // Dynamic styles based on active palette
    const styles = accentColor === 'primary' ? {
        border: DYNAMIC_COLORS.borderOpacity,
        bgColor: hexToRgba(DYNAMIC_COLORS.raw.light.primary, 0.05),
        text: DYNAMIC_COLORS.text,
        indicator: DYNAMIC_COLORS.bg,
        glow: DYNAMIC_COLORS.shadow,
    } : {
        border: "border-cyan-500/20",
        bgColor: "rgba(6, 182, 212, 0.05)",
        text: "text-cyan-600 dark:text-cyan-400",
        indicator: "bg-cyan-500",
        glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
    };

    // Gradient classes using active palette
    const gradientDivider = accentColor === 'primary'
        ? DYNAMIC_COLORS.gradientFrom
        : "from-cyan-500/30";

    const gradientBlob = accentColor === 'primary'
        ? DYNAMIC_COLORS.gradientFrom
        : "from-cyan-500/10";

    const hoverClasses = disableHover ? "" : `hover:border-opacity-60 ${styles.glow}`;
    const groupHoverOpacity = disableHover ? "opacity-40" : "opacity-40 group-hover:opacity-100";
    const indicatorHoverOpacity = disableHover ? "opacity-20" : "opacity-20 group-hover:opacity-50";
    const blobHoverOpacity = disableHover ? "opacity-10" : "opacity-10 group-hover:opacity-100";

    return (
        <div
            className={`relative overflow-hidden rounded-[20px] border ${styles.border} p-6 md:p-8 flex flex-col h-full group transition-all duration-700 ${hoverClasses} ${className}`}
            style={{
                backgroundColor: 'var(--card-bg, rgba(22, 22, 22, 0.8))',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)', // Safari/Chrome prefix
            }}
        >
            <div className={`absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 ${styles.border} rounded-tl-[18px] ${groupHoverOpacity} transition-opacity duration-500`}></div>
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 ${styles.border} rounded-br-[18px] ${groupHoverOpacity} transition-opacity duration-500`}></div>
            <div className={`absolute top-4 right-4 flex gap-1 ${indicatorHoverOpacity} transition-opacity`}>
                <div className={`w-1 h-1 rounded-full ${styles.indicator}`}></div><div className={`w-1 h-1 rounded-full ${styles.indicator}`}></div><div className={`w-1 h-1 rounded-full ${styles.indicator}`}></div>
            </div>
            <div className="flex items-center gap-3 mb-5 opacity-90 relative z-10">
                <div className="relative"><div className={`w-2 h-2 rounded-sm ${styles.indicator} shadow-[0_0_10px_rgba(255,255,255,0.5)]`}></div><div className={`absolute inset-0 w-2 h-2 rounded-sm ${styles.indicator} animate-ping opacity-30`}></div></div>
                <span className={`text-sm md:text-base font-bold tracking-[0.25em] uppercase font-mono ${styles.text}`}>{title}</span>
                <div className={`h-[1px] flex-grow bg-gradient-to-r ${gradientDivider} to-transparent opacity-30`}></div>
            </div>
            <div className={`font-mono text-sm md:text-[15px] leading-relaxed ${styles.text} opacity-90 relative z-10 h-full flex flex-col justify-start`}>{children}</div>
            <div className={`absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-tl ${gradientBlob} to-transparent rounded-full blur-3xl pointer-events-none ${blobHoverOpacity} transition-opacity duration-700`}></div>
        </div>
    );
};
