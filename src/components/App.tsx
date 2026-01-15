import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { settings, checkPerformance, initThemeListener } from '../store';
import { CanvasBackground, Header, Dock, ScrollToTop, ShowDockButton } from './layout';
import { ThemeToggle, LanguageToggle } from './ui';
import { HomeViewSkeleton, PortfolioViewSkeleton, ContactViewSkeleton, ViewSkeleton } from './common';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

import { HomeView } from './views/HomeView';
// Lazy load views for Code Splitting
const ServicesView = React.lazy(() => import('./views/ServicesView').then(module => ({ default: module.ServicesView })));
const PortfolioView = React.lazy(() => import('./views/PortfolioView').then(module => ({ default: module.PortfolioView })));
const ResourcesView = React.lazy(() => import('./views/ResourcesView').then(module => ({ default: module.ResourcesView })));
const ContactView = React.lazy(() => import('./views/ContactView').then(module => ({ default: module.ContactView })));

// Simple Error Boundary to catch lazy loading errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("View loading error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-center">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Something went wrong</h2>
                    <p className="text-[var(--text-secondary)] mb-6">We couldn't load this section. Please try refreshing the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Get skeleton for specific route
 */
const getSkeletonForPath = (path: string) => {
    if (path === '/' || path === '') return <HomeViewSkeleton />;
    if (path.startsWith('/portfolio')) return <PortfolioViewSkeleton />;
    if (path.startsWith('/contact')) return <ContactViewSkeleton />;
    return <ViewSkeleton />;
};

export default function App() {
    useStore(settings);
    const [currentHash, setCurrentHash] = useState('#/');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [viewKey, setViewKey] = useState(0);
    const previousPath = useRef('/');

    // Effect for Theme - Initialize listener for system theme changes
    useEffect(() => {
        initThemeListener();
    }, []);

    // Effect for Performance - Runs ONCE on mount
    useEffect(() => {
        checkPerformance();
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const newHash = window.location.hash || '#/';
            const newPath = newHash.replace(/^#/, '') || '/';

            // Only animate if path actually changed
            if (newPath !== previousPath.current) {
                setIsTransitioning(true);

                // Short delay for exit animation
                setTimeout(() => {
                    setCurrentHash(newHash);
                    setViewKey(prev => prev + 1);
                    previousPath.current = newPath;

                    // End transition
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, 50);
                }, 200); // Match CSS exit animation duration
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        setCurrentHash(window.location.hash || '#/');
        previousPath.current = (window.location.hash || '#/').replace(/^#/, '') || '/';

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderView = () => {
        const path = currentHash.replace(/^#/, '') || '/';

        if (path === '/' || path === '') return <HomeView />;
        if (path.startsWith('/services')) return <ServicesView />;
        if (path.startsWith('/portfolio')) return <PortfolioView />;
        if (path.startsWith('/resources')) return <ResourcesView />;
        if (path.startsWith('/contact')) return <ContactView />;
        return <HomeView />;
    };

    const path = currentHash.replace(/^#/, '') || '/';

    return (
        <div className="min-h-screen text-[var(--text-primary)] font-sans selection:bg-emerald-500/30">
            <CanvasBackground />
            <Header />
            <ThemeToggle />
            <LanguageToggle />

            <main className="relative z-10 w-full">
                <ErrorBoundary>
                    <div
                        key={viewKey}
                        className={`${isTransitioning ? 'view-transition-exit' : 'view-transition-enter'}`}
                    >
                        <Suspense fallback={getSkeletonForPath(path)}>
                            {renderView()}
                        </Suspense>
                    </div>
                </ErrorBoundary>
            </main>

            <Dock path={path} />
            <ScrollToTop />
            <ShowDockButton />
            <SpeedInsights />
            <Analytics />
        </div>
    );
}
