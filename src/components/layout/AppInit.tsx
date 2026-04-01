import { useEffect, useState } from 'react';
import { checkPerformance, initThemeListener } from '../../store';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

export default function AppInit() {
    const [showAnalytics, setShowAnalytics] = useState(false);

    useEffect(() => {
        initThemeListener();
        checkPerformance();
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
            <SpeedInsights />
            <Analytics />
        </>
    );
}
