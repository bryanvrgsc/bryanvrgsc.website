import { describe, it, expect, beforeEach } from 'vitest';
import { lockBodyScroll } from '../../src/utils/modal';

describe('lockBodyScroll', () => {
    beforeEach(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
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
