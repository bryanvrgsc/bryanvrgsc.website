export type ThemeMode = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

export const cycleTheme = (theme: ThemeMode): ThemeMode => {
  if (theme === 'system') return 'dark';
  if (theme === 'dark') return 'light';
  return 'system';
};

export const resolveTheme = (
  theme: ThemeMode,
  prefersDark: boolean,
): ResolvedTheme => {
  if (theme === 'dark') return 'dark';
  if (theme === 'light') return 'light';
  return prefersDark ? 'dark' : 'light';
};
