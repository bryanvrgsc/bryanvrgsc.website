import { describe, expect, it } from 'vitest';
import { getDockActiveId } from '../../src/scripts/dock-state';

describe('dock-state', () => {
  it('maps localized paths to a stable dock id', () => {
    expect(getDockActiveId('/es/')).toBe('home');
    expect(getDockActiveId('/en/services')).toBe('services');
    expect(getDockActiveId('/es/portfolio/gymapp')).toBe('portfolio');
  });
});
