import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';

/**
 * GlassElement - A glass morphism container component
 * 
 * Features:
 * - Customizable size and border radius
 * - Backdrop blur effect
 * - Shine effect on hover
 * - Flexible styling
 */

export interface GlassElementProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    height?: number;
    width?: number;
    radius?: number;
    blur?: number;
}

export const GlassElement: React.FC<GlassElementProps> = ({
    children,
    className = "",
    style = {},
    height,
    width,
    radius,
    blur = 16,
}) => {
    // Construct dynamic styles based on sizing props
    const dynamicStyle: React.CSSProperties = {
        ...style,
        ...(width ? { width: `${width}px` } : {}),
        ...(height ? { height: `${height}px` } : {}),
        ...(radius ? { borderRadius: `${radius}px` } : {}),
        position: 'relative',
        background: 'var(--dock-bg, rgba(240, 240, 245, 0.65))',
        backdropFilter: `blur(${blur}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
        boxShadow: `
            inset 0 0 0 1px var(--card-border, rgba(255, 255, 255, 0.2)),
            0 20px 50px -12px rgba(0, 0, 0, 0.3)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.3, 1)',
        overflow: 'visible',
    };

    return (
        <div className={className} style={dynamicStyle}>
            {/* Glass shine effect */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 80%, rgba(255, 255, 255, 0.3) 100%)',
                    opacity: 0.6,
                    zIndex: 0,
                }}
            />
            {children}
        </div>
    );
};

/**
 * GlassDock Component
 * 
 * A self-sizing glass morphism dock that wraps its children.
 * Uses ResizeObserver to dynamically calculate size based on content.
 * Provides a pill-shaped container with glass morphism effects.
 */
export const GlassDock = ({ children }: { children?: React.ReactNode }) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const hiddenRef = useRef<HTMLDivElement>(null);
    // Keep track of last valid size to prevent flash when dock reappears
    const lastValidSize = useRef({ width: 0, height: 0 });
    const hasInitialized = useRef(false);

    // Force measure function - can be called anytime
    const measureSize = useCallback(() => {
        if (hiddenRef.current) {
            const newWidth = hiddenRef.current.offsetWidth;
            const newHeight = hiddenRef.current.offsetHeight;
            if (newWidth > 0 && newHeight > 0) {
                lastValidSize.current = { width: newWidth, height: newHeight };
                setSize({ width: newWidth, height: newHeight });
                hasInitialized.current = true;
                return true;
            }
        }
        return false;
    }, []);

    useLayoutEffect(() => {
        if (!hiddenRef.current) return;

        // Initial measurement with retry for timing issues
        const initMeasure = () => {
            if (!measureSize()) {
                // Retry after a short delay if initial measure fails
                setTimeout(measureSize, 50);
            }
        };

        initMeasure();

        // Compatibility check for older browsers (e.g., iOS < 13.4)
        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const obs = new ResizeObserver(() => {
            measureSize();
        });
        obs.observe(hiddenRef.current);

        return () => obs.disconnect();
    }, [children, measureSize]);

    // Additional effect to ensure size is captured when dock becomes visible
    useEffect(() => {
        // Fallback: measure again after component is definitely mounted
        const timer = setTimeout(measureSize, 100);
        return () => clearTimeout(timer);
    }, [measureSize]);

    // Use last valid size if current size is zero (dock hidden/reappearing)
    const displaySize = size.width > 0 ? size : lastValidSize.current;
    const hasValidSize = displaySize.width > 0 || hasInitialized.current;

    return (
        <div className="relative flex justify-center items-end pb-2">
            {/* Hidden Layout for Sizing: Renders children invisibly to calculate natural width */}
            <div
                ref={hiddenRef}
                className="absolute bottom-2 opacity-0 pointer-events-none flex items-center gap-2 md:gap-3 p-1.5 md:p-2 whitespace-nowrap"
                aria-hidden="true"
                style={{ visibility: 'hidden' }}
            >
                {children}
            </div>

            {/* Actual Visible Glass Element */}
            <div
                className="transition-opacity duration-300"
                style={{ opacity: hasValidSize ? 1 : 0 }}
            >
                <GlassElement
                    width={displaySize.width || 300}
                    height={displaySize.height || 60}
                    radius={(displaySize.height || 60) / 2}
                    className="visible-dock-container flex items-center gap-2 md:gap-3 p-1.5 md:p-2"
                >
                    {children}
                </GlassElement>
            </div>
        </div>
    );
};
