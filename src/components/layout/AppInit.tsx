import { useEffect, useState } from 'react';
import { initThemeListener } from '../../store';
import { Analytics } from '@vercel/analytics/react';
import { initAdaptivePerformance } from '../../utils/performance';

export default function AppInit() {
    const [showAnalytics, setShowAnalytics] = useState(false);

    useEffect(() => {
        initThemeListener();
        const cleanupPerformance = initAdaptivePerformance();

        return cleanupPerformance;
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const requestIdleCallback = (window as typeof window & {
                requestIdleCallback?: (callback: () => void) => number;
            }).requestIdleCallback;

            if (requestIdleCallback) {
                requestIdleCallback(() => setShowAnalytics(true));
                return;
            }

            setShowAnalytics(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!showAnalytics) {
        return null;
    }

    return (
        <>
            <Analytics />
        </>
    );
}
