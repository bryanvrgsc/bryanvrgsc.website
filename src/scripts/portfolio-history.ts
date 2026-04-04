export const getPortfolioBasePath = (lang: 'es' | 'en') => `/${lang}/portfolio`;

export const getPortfolioSlugPath = (lang: 'es' | 'en', slug: string) =>
  `${getPortfolioBasePath(lang)}/${slug}`;
