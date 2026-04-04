import { describe, expect, it } from 'vitest';
import { cycleTheme, resolveTheme } from '../../src/scripts/theme-state';

describe('theme-state', () => {
  it('cycles system -> dark -> light -> system', () => {
    expect(cycleTheme('system')).toBe('dark');
    expect(cycleTheme('dark')).toBe('light');
    expect(cycleTheme('light')).toBe('system');
  });

  it('resolves dark when system preference is dark', () => {
    expect(resolveTheme('system', true)).toBe('dark');
  });
});
