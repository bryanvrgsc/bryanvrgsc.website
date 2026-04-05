import { describe, it, expect, vi } from 'vitest';

vi.mock('@nanostores/react', () => ({ useStore: vi.fn(() => ({ lite: false })) }));

import { getEmbedUrl, formatMessage, isValidEmail, debounce } from '../../src/utils/helpers';

describe('getEmbedUrl', () => {
    it('converts Google Drive file URL to embed URL', () => {
        const input = 'https://drive.google.com/file/d/abc123/view?usp=sharing';
        expect(getEmbedUrl(input)).toBe('https://drive.google.com/file/d/abc123/preview');
    });

    it('returns non-Drive URLs unchanged', () => {
        const input = 'https://example.com/doc.pdf';
        expect(getEmbedUrl(input)).toBe(input);
    });

    it('returns Drive URLs without file/d/ pattern unchanged', () => {
        const input = 'https://drive.google.com/open?id=abc123';
        expect(getEmbedUrl(input)).toBe(input);
    });
});

describe('formatMessage', () => {
    it('replaces placeholders with values', () => {
        expect(formatMessage('Hello {name}!', { name: 'Bryan' })).toBe('Hello Bryan!');
    });

    it('handles multiple placeholders', () => {
        expect(formatMessage('{a} and {b}', { a: '1', b: '2' })).toBe('1 and 2');
    });

    it('leaves unmatched placeholders as-is', () => {
        expect(formatMessage('{found} {missing}', { found: 'yes' })).toBe('yes {missing}');
    });
});

describe('isValidEmail', () => {
    it('accepts valid email', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('rejects email without @', () => {
        expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('rejects email without domain', () => {
        expect(isValidEmail('test@')).toBe(false);
    });

    it('rejects empty string', () => {
        expect(isValidEmail('')).toBe(false);
    });
});

describe('debounce', () => {
    it('delays execution', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced();
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledOnce();

        vi.useRealTimers();
    });

    it('resets timer on subsequent calls', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced();
        vi.advanceTimersByTime(50);
        debounced();
        vi.advanceTimersByTime(50);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(50);
        expect(fn).toHaveBeenCalledOnce();

        vi.useRealTimers();
    });
});
