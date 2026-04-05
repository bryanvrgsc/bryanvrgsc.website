import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('lockBodyScroll', () => {
    let lockBodyScroll: () => () => void;

    beforeEach(async () => {
        vi.resetModules();
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        // Re-import to get fresh module state
        const mod = await import('../../src/utils/modal');
        lockBodyScroll = mod.lockBodyScroll;
    });

    it('sets overflow hidden on body', () => {
        const unlock = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');
        unlock();
    });

    it('restores original overflow on unlock', () => {
        document.body.style.overflow = 'auto';
        const unlock = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');
        unlock();
        expect(document.body.style.overflow).toBe('auto');
    });

    it('supports nested locks via reference counting', () => {
        const unlock1 = lockBodyScroll();
        const unlock2 = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');

        unlock2();
        expect(document.body.style.overflow).toBe('hidden');

        unlock1();
        expect(document.body.style.overflow).toBe('');
    });
});
