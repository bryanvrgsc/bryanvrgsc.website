import { describe, it, expect } from 'vitest';
import { PORTFOLIO } from '../../src/constants/portfolio';
import { SERVICES } from '../../src/constants/services';
import { DOCUMENTS } from '../../src/constants/resources';

describe('Portfolio data contract', () => {
    for (const lang of ['es', 'en'] as const) {
        describe(`${lang} locale`, () => {
            it('has at least one project', () => {
                expect(PORTFOLIO[lang].length).toBeGreaterThan(0);
            });

            it('every project has required fields', () => {
                for (const p of PORTFOLIO[lang]) {
                    expect(p.slug).toBeTruthy();
                    expect(p.title).toBeTruthy();
                    expect(p.problem).toBeTruthy();
                    expect(p.solution).toBeTruthy();
                    expect(p.tech).toBeTruthy();
                    expect(p.result).toBeTruthy();
                    expect(p.image).toBeTruthy();
                }
            });

            it('every project has a unique slug', () => {
                const slugs = PORTFOLIO[lang].map(p => p.slug);
                expect(new Set(slugs).size).toBe(slugs.length);
            });
        });
    }
});

describe('Services data contract', () => {
    for (const lang of ['es', 'en'] as const) {
        describe(`${lang} locale`, () => {
            it('has at least one service', () => {
                expect(SERVICES[lang].length).toBeGreaterThan(0);
            });

            it('every service has required fields', () => {
                for (const s of SERVICES[lang]) {
                    expect(s.title).toBeTruthy();
                    expect(s.description).toBeTruthy();
                    expect(s.iconName).toBeTruthy();
                    expect(s.items.length).toBeGreaterThan(0);
                    expect(s.valueProp.length).toBeGreaterThan(0);
                }
            });
        });
    }
});

describe('Resources data contract', () => {
    it('has at least one document', () => {
        expect(DOCUMENTS.length).toBeGreaterThan(0);
    });

    it('every document has required fields', () => {
        for (const doc of DOCUMENTS) {
            expect(doc.id).toBeTruthy();
            expect(doc.filename).toBeTruthy();
            expect(doc.path).toBeTruthy();
            expect(doc.type).toMatch(/^(paper|slides)$/);
            expect(doc.title.en).toBeTruthy();
            expect(doc.title.es).toBeTruthy();
        }
    });

    it('every document has a unique id', () => {
        const ids = DOCUMENTS.map(d => d.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
