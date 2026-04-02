let scrollLockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

/**
 * Locks body scrolling while preserving the scrollbar gap to avoid layout shift.
 * Supports nested modal locks by reference counting.
 */
export function lockBodyScroll(): () => void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
        return () => {};
    }

    const body = document.body;
    const root = document.documentElement;

    if (scrollLockCount === 0) {
        previousOverflow = body.style.overflow;
        previousPaddingRight = body.style.paddingRight;

        const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);

        body.style.overflow = 'hidden';

        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }
    }

    scrollLockCount += 1;

    return () => {
        scrollLockCount = Math.max(0, scrollLockCount - 1);

        if (scrollLockCount === 0) {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPaddingRight;
        }
    };
}
