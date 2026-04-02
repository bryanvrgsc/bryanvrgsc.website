import { describe, expect, it } from 'vitest';
import { getPortfolioBasePath, getPortfolioSlugPath } from '../../src/scripts/portfolio-history';

describe('portfolio-history', () => {
  it('builds localized portfolio paths', () => {
    expect(getPortfolioBasePath('es')).toBe('/es/portfolio');
    expect(getPortfolioBasePath('en')).toBe('/en/portfolio');
    expect(getPortfolioSlugPath('es', 'gymapp')).toBe('/es/portfolio/gymapp');
  });
});
