export type EffectiveTheme = 'light' | 'dark';

interface ResolveDocumentThemeOptions {
  dataTheme: string | null;
  hasDarkClass: boolean;
  systemPrefersDark: boolean;
}

export const resolveDocumentTheme = ({
  dataTheme,
  hasDarkClass,
  systemPrefersDark
}: ResolveDocumentThemeOptions): EffectiveTheme => {
  if (dataTheme === 'dark' || hasDarkClass) {
    return 'dark';
  }

  if (dataTheme === 'light') {
    return 'light';
  }

  return systemPrefersDark ? 'dark' : 'light';
};
