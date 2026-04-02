import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { settings } from '../../store';
import { DYNAMIC_COLORS, getDynamicButtonStyles } from '../../constants/colors';

/**
 * LiquidButton - A premium button component with liquid glass morphism effect
 * 
 * Features:
 * - Smooth hover animations
 * - Glass morphism design
 * - Theme-aware styling (dark/light mode)
 * - Customizable styling
 * - Accessible
 */

export interface LiquidButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    target?: React.HTMLAttributeAnchorTarget;
    rel?: string;
    className?: string;
    type?: "button" | "submit" | "reset";
    style?: React.CSSProperties;
    disabled?: boolean;
    /** If true, use "primary" styled button with accent colors */
    primary?: boolean;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
    children,
    onClick,
    href,
    target,
    rel,
    className = "",
    type = "button",
    style,
    disabled = false,
    primary = false
}) => {
    const { theme } = useStore(settings);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Default to dark theme during SSR
    const isDark = mounted
        ? (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
        : true;

    // Get dynamic styles based on current theme
    const dynamicStyles = getDynamicButtonStyles();
    const themeStyles = isDark ? dynamicStyles.dark : dynamicStyles.light;

    // Colors for the current theme
    const colors = isDark ? DYNAMIC_COLORS.raw.dark : DYNAMIC_COLORS.raw.light;

    // Merge passed style with theme-aware defaults
    const mergedStyle: React.CSSProperties = {
        ...themeStyles as React.CSSProperties,
        ...style
    };

    const content = (
        <>
            {/* Outer Glow (Spills out) */}
            <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${colors.primary}40 0%, transparent 70%)`
                }}
            />

            {/* Clipped Internal Layer */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
                {/* Background Layer with blur */}
                <div
                    className="absolute inset-0 backdrop-blur-xl transition-all duration-500"
                    style={{
                        backgroundColor: primary
                            ? `${colors.primary}20`
                            : isDark
                                ? 'rgba(30, 30, 35, 0.8)'
                                : 'rgba(255, 255, 255, 0.75)',
                    }}
                />

                {/* Hover background */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        backgroundColor: primary
                            ? `${colors.primary}35`
                            : isDark
                                ? 'rgba(45, 45, 50, 0.9)'
                                : 'rgba(255, 255, 255, 0.95)',
                    }}
                />

                {/* Subtle internal gradient for depth */}
                <div
                    className="absolute inset-0 opacity-60 pointer-events-none"
                    style={{
                        background: isDark
                            ? 'linear-gradient(to top right, rgba(255,255,255,0.1) 0%, transparent 40%)'
                            : 'linear-gradient(to top right, rgba(255,255,255,0.5) 0%, transparent 40%)'
                    }}
                />

                {/* Internal Gradient Glow - Dynamic */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-md pointer-events-none"
                    style={{
                        background: `linear-gradient(to right, ${colors.primary}33, ${colors.accent}33, ${colors.primary}33)`
                    }}
                />

                {/* Border Layer */}
                <div
                    className="absolute inset-0 rounded-full transition-colors duration-500 pointer-events-none"
                    style={{
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15, 23, 42, 0.15)'}`,
                    }}
                />

                {/* Hover border glow */}
                <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        boxShadow: `inset 0 0 0 1px ${colors.primary}60`
                    }}
                />

                {/* Sheen effect on hover */}
                <div
                    className="absolute inset-0 translate-x-[-100%] skew-x-[-15deg] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none"
                    style={{
                        background: isDark
                            ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
                            : 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                        width: '50%'
                    }}
                />
            </div>

            {/* Content */}
            <span
                className="relative z-20 flex items-center justify-center gap-2 tracking-wide font-medium"
                style={{
                    color: isDark ? '#f5f5f7' : '#020617'
                }}
            >
                {children}
            </span>
        </>
    );

    const sharedClassName = `
        relative group inline-flex items-center justify-center font-medium 
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)] 
        active:scale-95 border-none outline-none focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
    `;

    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={rel}
                onClick={onClick}
                style={mergedStyle}
                className={sharedClassName}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={mergedStyle}
            className={sharedClassName}
        >
            {content}
        </button>
    );
};
