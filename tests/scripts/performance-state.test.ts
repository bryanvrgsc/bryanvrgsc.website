import { describe, expect, it } from 'vitest';
import { shouldUseLiteMode } from '../../src/scripts/performance-state';

describe('performance-state', () => {
  it('uses lite mode for reduced motion, save-data, slow connections, or low scores', () => {
    expect(
      shouldUseLiteMode({
        prefersReducedMotion: true,
        saveData: false,
        score: 10,
      }),
    ).toBe(true);

    expect(
      shouldUseLiteMode({
        prefersReducedMotion: false,
        saveData: true,
        score: 10,
      }),
    ).toBe(true);

    expect(
      shouldUseLiteMode({
        prefersReducedMotion: false,
        saveData: false,
        effectiveType: '2g',
        score: 10,
      }),
    ).toBe(true);

    expect(
      shouldUseLiteMode({
        prefersReducedMotion: false,
        saveData: false,
        score: 1,
      }),
    ).toBe(true);

    expect(
      shouldUseLiteMode({
        prefersReducedMotion: false,
        saveData: false,
        score: 3,
      }),
    ).toBe(false);
  });
});
