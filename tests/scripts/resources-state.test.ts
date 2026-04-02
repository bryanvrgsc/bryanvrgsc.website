import { describe, expect, it } from 'vitest';
import { filterDocuments } from '../../src/scripts/resources-state';

describe('resources-state', () => {
  it('filters by type, category, and search term', () => {
    const docs = [
      { type: 'paper', category: { es: 'IA', en: 'AI' }, title: { es: 'Mapa', en: 'Map' }, description: { es: 'red', en: 'network' } },
      { type: 'slides', category: { es: 'Cloud', en: 'Cloud' }, title: { es: 'ROI', en: 'ROI' }, description: { es: 'finanzas', en: 'finance' } },
    ];

    const result = filterDocuments(docs as never[], 'paper', 'IA', 'mapa', 'es');
    expect(result).toHaveLength(1);
    expect(result[0]?.type).toBe('paper');
  });
});
