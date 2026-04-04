export const getDockActiveId = (pathname: string) => {
  const pathWithoutLang = pathname.replace(/^\/(es|en)/, '') || '/';
  if (pathWithoutLang === '/' || pathWithoutLang === '') return 'home';
  if (pathWithoutLang.startsWith('/services')) return 'services';
  if (pathWithoutLang.startsWith('/portfolio')) return 'portfolio';
  if (pathWithoutLang.startsWith('/resources')) return 'resources';
  if (pathWithoutLang.startsWith('/contact')) return 'contact';
  return 'home';
};
