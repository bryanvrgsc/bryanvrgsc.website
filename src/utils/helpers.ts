/**
 * Helper utilities for the application
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import { performanceMode } from '../store';

/**
 * Custom hook for mouse position tracking on bento cards
 * Optimized to skip updates in Lite performance mode
 */
export function useMousePosition() {
    const { lite } = useStore(performanceMode);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        // Optimization: Skip heavy DOM updates in Lite Mode
        if (lite) return;

        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        target.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    return handleMouseMove;
}

/**
 * Get category theme colors based on a search term
 * Returns comprehensive theme object with text, background, bullet, gradient, and CSS variable colors
 * @param term - The category or term to get theme for
 * @returns Object with theme properties
 */
export function getCategoryTheme(term: string) {
    const t = term.toLowerCase();

    if (t.includes('auto') || t.includes('app') || t.includes('desarrollo')) {
        return {
            text: "text-emerald-700 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            bullet: "bg-emerald-600",
            gradientFrom: "from-emerald-600/20",
            colors: { '--card-border': 'rgba(5, 150, 105, 0.3)', '--glass-glow': 'rgba(5, 150, 105, 0.5)', '--neon-glow': 'rgba(5, 150, 105, 0.4)' }
        };
    }

    if (t.includes('business') || t.includes('bi') || t.includes('data')) {
        return {
            text: "text-blue-700 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            bullet: "bg-blue-600",
            gradientFrom: "from-blue-600/20",
            colors: { '--card-border': 'rgba(37, 99, 235, 0.3)', '--glass-glow': 'rgba(37, 99, 235, 0.5)', '--neon-glow': 'rgba(37, 99, 235, 0.4)' }
        };
    }

    if (t.includes('tec') || t.includes('consult')) {
        return {
            text: "text-violet-700 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-500/10",
            bullet: "bg-violet-600",
            gradientFrom: "from-violet-600/20",
            colors: { '--card-border': 'rgba(124, 58, 237, 0.3)', '--glass-glow': 'rgba(124, 58, 237, 0.5)', '--neon-glow': 'rgba(124, 58, 237, 0.4)' }
        };
    }

    if (t.includes('cloud') || t.includes('nube') || t.includes('devops')) {
        return {
            text: "text-cyan-700 dark:text-cyan-400",
            bg: "bg-cyan-50 dark:bg-cyan-500/10",
            bullet: "bg-cyan-600",
            gradientFrom: "from-cyan-600/20",
            colors: { '--card-border': 'rgba(6, 182, 212, 0.3)', '--glass-glow': 'rgba(6, 182, 212, 0.5)', '--neon-glow': 'rgba(6, 182, 212, 0.4)' }
        };
    }

    if (t.includes('network') || t.includes('red') || t.includes('connect') || t.includes('wifi')) {
        return {
            text: "text-rose-700 dark:text-rose-400",
            bg: "bg-rose-50 dark:bg-rose-500/10",
            bullet: "bg-rose-600",
            gradientFrom: "from-rose-600/20",
            colors: { '--card-border': 'rgba(225, 29, 72, 0.3)', '--glass-glow': 'rgba(225, 29, 72, 0.5)', '--neon-glow': 'rgba(225, 29, 72, 0.4)' }
        };
    }

    if (t.includes('inteligencia') || t.includes('artificial') || t.includes('ai')) {
        return {
            text: "text-amber-700 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            bullet: "bg-amber-600",
            gradientFrom: "from-amber-600/20",
            colors: { '--card-border': 'rgba(217, 119, 6, 0.3)', '--glass-glow': 'rgba(217, 119, 6, 0.5)', '--neon-glow': 'rgba(217, 119, 6, 0.4)' }
        };
    }

    // Default theme
    return {
        text: "text-slate-700 dark:text-slate-400",
        bg: "bg-slate-50 dark:bg-slate-500/10",
        bullet: "bg-slate-600",
        gradientFrom: "from-slate-600/20",
        colors: { '--card-border': 'rgba(71, 85, 105, 0.25)', '--glass-glow': 'rgba(148, 163, 184, 0.4)', '--neon-glow': 'rgba(148, 163, 184, 0.3)' }
    };
}

/**
 * Convert Google Drive preview URL to embed URL
 * @param url - The Google Drive URL
 * @returns Embed URL or original URL if not a Drive link
 */
export function getEmbedUrl(url: string): string {
    if (url.includes('drive.google.com') && url.includes('/file/d/')) {
        const match = url.match(/\/file\/d\/([^/]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
    }
    return url;
}

/**
 * Format a message with placeholders
 * @param template - The message template with {placeholder} syntax
 * @param values - Object with values to replace placeholders
 * @returns Formatted message
 */
export function formatMessage(template: string, values: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => values[key] || match);
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns true if email is valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounce function to limit function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
