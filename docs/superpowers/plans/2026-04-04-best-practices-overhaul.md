# Best Practices Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the bryanvrgsc portfolio site to best-practice standards across security, performance, React quality, accessibility, testing, and cleanup.

**Architecture:** 7 independent slices, each producing one PR. Slices can be parallelized via git worktrees since they touch non-overlapping files. Each slice must pass `pnpm build` before merging.

**Tech Stack:** Astro 6.1.1, React 19, Tailwind v4, nanostores, vitest, Vercel

---

## Task 1: Config & Docs (Slice 1)

**Files:**
- Modify: `CLAUDE.md`
- Modify: `astro.config.mjs`
- Modify: `src/env.d.ts`
- Modify: `package.json`
- Delete: `wrangler.toml`

- [ ] **Step 1: Update CLAUDE.md — fix Astro version**

Replace all "Astro v5" references with the actual version:

```markdown
# In CLAUDE.md line 22, change:
Astro v5 in `output: 'static'` mode.
# To:
Astro 6 in `output: 'static'` mode.
```

Also update the Deployment section (line 80) to remove Cloudflare references:

```markdown
# Change:
Deployed to **Vercel**. Config in `vercel.json` (build command, headers, cache rules). The `wrangler.toml` and `pnpm pages:deploy` script are legacy Cloudflare Pages artifacts — ignore them.

# To:
Deployed to **Vercel**. Config in `vercel.json` (build command, headers, cache rules).
```

- [ ] **Step 2: Add `astro:env` schema to `astro.config.mjs`**

Add the `envField` import and `env` config block:

```js
// astro.config.mjs — add envField to import
import { defineConfig, envField } from 'astro/config';

// Add after the `image` block (after line 50):
  env: {
    schema: {
      PUBLIC_FORMSPREE_ID: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_RECAPTCHA_SITE_KEY: envField.string({ context: "client", access: "public", optional: true }),
    },
  },
```

- [ ] **Step 3: Update `src/env.d.ts`**

Astro's `astro:env` auto-generates types. Remove the manual `ImportMetaEnv` interface:

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

Remove the `interface ImportMetaEnv` and `interface ImportMeta` blocks entirely (lines 4-11).

- [ ] **Step 4: Delete `wrangler.toml`**

```bash
rm wrangler.toml
```

- [ ] **Step 5: Remove legacy Cloudflare from `package.json`**

Remove from `scripts`:
```json
"pages:deploy": "pnpm build && wrangler pages deploy ./dist"
```

Remove from `dependencies`:
```json
"@astrojs/cloudflare": "^13.1.4",
```

Remove from `devDependencies`:
```json
"wrangler": "^4.54.0"
```

- [ ] **Step 6: Install dependencies and verify**

```bash
pnpm install
pnpm build
```

Expected: Clean build, no errors. `pnpm install` should be significantly faster and `node_modules` smaller without wrangler.

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md astro.config.mjs src/env.d.ts package.json pnpm-lock.yaml
git rm wrangler.toml
git commit -m "chore: update config, adopt astro:env, remove Cloudflare artifacts"
```

---

## Task 2: Security (Slice 2)

**Files:**
- Modify: `src/middleware/index.ts`
- Modify: `vercel.json`
- Modify: `src/components/common/BudgetInput.tsx`

- [ ] **Step 1: Document CSP `'unsafe-inline'` decisions in middleware**

In `src/middleware/index.ts`, add comments explaining the CSP choices. The `'unsafe-inline'` is required because:
- `script-src`: Astro's View Transitions and the inline FOUC-prevention script in BaseLayout need it. Astro doesn't support CSP nonces for `<script is:inline>` in static mode.
- `style-src`: Tailwind dynamic classes, inline styles for theme system, and Google Fonts require it.

```ts
// src/middleware/index.ts — replace the CSP line (line 9-10) with:
        // Content Security Policy
        // NOTE: 'unsafe-inline' is required for:
        //   script-src: Astro View Transitions + inline FOUC-prevention script (no nonce support in static mode)
        //   style-src: Tailwind dynamic classes, theme system inline styles, Google Fonts
        'Content-Security-Policy': [
```

- [ ] **Step 2: Sync `X-Frame-Options` — change vercel.json from SAMEORIGIN to DENY**

In `vercel.json` line 14-15:

```json
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
```

- [ ] **Step 3: Add `interest-cohort=()` to vercel.json Permissions-Policy**

The middleware has `interest-cohort=()` but `vercel.json` does not. Update `vercel.json` line 27:

```json
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
        },
```

- [ ] **Step 4: Add `X-XSS-Protection` header to vercel.json**

Present in middleware but missing from `vercel.json`. Add after the CSP header block:

```json
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
```

- [ ] **Step 5: Defer geolocation API call in BudgetInput.tsx**

Move the `ipapi.co/json/` fetch from `useEffect` (runs on mount) to a function triggered when the user opens the currency dropdown. In `src/components/common/BudgetInput.tsx`:

Replace the `useEffect` block (lines 84-102):

```tsx
    // Autofill currency based on detected country — deferred until user opens dropdown
    const [hasDetected, setHasDetected] = useState(false);

    const detectCurrency = () => {
        if (hasDetected || (currency && currency !== 'USD')) return;

        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country_code) {
                    const detectedCurrency = CURRENCIES.find(
                        c => c.countries.includes(data.country_code)
                    );
                    if (detectedCurrency) {
                        onChange(value, detectedCurrency.code);
                    }
                }
            })
            .catch(() => {
                // Silently fail, keep default
            })
            .finally(() => setHasDetected(true));
    };
```

Remove the existing `useEffect` (lines 84-102). Then update the dropdown toggle to call `detectCurrency`:

Find the button/element that opens the currency dropdown (the `onClick` that sets `setIsOpen(true)`). Add `detectCurrency()` before `setIsOpen(true)`:

```tsx
    // Where the dropdown opens, add:
    detectCurrency();
    setIsOpen(true);
```

Also remove the `useEffect` import if no other useEffect remains. Keep `useState`.

- [ ] **Step 6: Verify build**

```bash
pnpm build
```

Expected: Clean build.

- [ ] **Step 7: Commit**

```bash
git add src/middleware/index.ts vercel.json src/components/common/BudgetInput.tsx
git commit -m "security: sync headers, document CSP decisions, defer geolocation API"
```

---

## Task 3: Performance (Slice 3)

**Files:**
- Modify: `src/pages/[lang]/contact.astro`
- Modify: `src/pages/[lang]/portfolio.astro`
- Modify: `src/pages/[lang]/services.astro`
- Modify: `src/pages/[lang]/resources.astro`
- Modify: `src/pages/[lang]/portfolio/[slug].astro`
- Modify: `src/components/common/PDFThumbnail.tsx`

- [ ] **Step 1: Change `client:load` to `client:idle` in all 5 page files**

In each file, replace `client:load` with `client:idle`:

`src/pages/[lang]/contact.astro` line 29:
```astro
  <ContactView client:idle {lang} />
```

`src/pages/[lang]/portfolio.astro` line 29:
```astro
  <PortfolioView client:idle {lang} />
```

`src/pages/[lang]/services.astro` line 29:
```astro
  <ServicesView client:idle {lang} />
```

`src/pages/[lang]/resources.astro` line 29:
```astro
  <ResourcesView client:idle {lang} />
```

`src/pages/[lang]/portfolio/[slug].astro` line 31:
```astro
  <PortfolioView client:idle {lang} initialSlug={slug} />
```

- [ ] **Step 2: Standardize PDF.js worker in PDFThumbnail.tsx**

Replace the static import pattern with the dynamic import pattern used by PDFViewer.

Replace `src/components/common/PDFThumbnail.tsx` lines 1-10:

```tsx
import React, { useEffect, useRef, useState } from 'react';

interface PDFThumbnailProps {
    url: string;
    className?: string;
    style?: React.CSSProperties;
}

export const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ url, className, style }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const renderThumbnail = async () => {
            try {
                const pdfjsLib = await import('pdfjs-dist');
                const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
                pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;
```

This removes:
- The `import * as pdfjsLib` static import (line 2)
- The `// @ts-ignore` comment (line 4)
- The `import pdfjsWorker` static import (line 5)
- The global worker config block (lines 8-10)

Keep the rest of the component unchanged from line 30 onward (the canvas rendering logic and return JSX).

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: Clean build, no TypeScript errors. The `@ts-ignore` is gone.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ src/components/common/PDFThumbnail.tsx
git commit -m "perf: use client:idle for views, standardize PDF.js dynamic imports"
```

---

## Task 4: React Quality (Slice 4)

**Files:**
- Modify: `src/components/modals/PortfolioModal.tsx`
- Modify: `src/components/views/ServicesView.tsx`

- [ ] **Step 1: Fix list keys in PortfolioModal.tsx**

In `src/components/modals/PortfolioModal.tsx`:

**Line 94** — screenshot thumbnails, change `key={idx}` to `key={img}`:
```tsx
{images.map((img: string, idx: number) => (<button key={img} onClick={() => setActiveScreenshot(idx)}
```

**Line 97** — tech tags, change `key={i}` to `key={t.trim()}`:
```tsx
{project.tech.split(',').map((t: string, i: number) => (<span key={t.trim()} className=
```

**Line 127** — documents list, change `key={i}` to `key={doc.url || doc.label}`:
```tsx
return (<li key={doc.url || doc.label}><button onClick={() => setCurrentPdf(normalizedDocUrl)}
```
Also type `doc` — change `(doc: any, i: number)` to `(doc: { label: string; url: string }, i: number)`:
```tsx
{project.details.documents.map((doc: { label: string; url: string }, i: number) => {
```

**Line 131** — currentFeatures, change `key={i}` to `key={f}`:
```tsx
{project.details.currentFeatures.map((f: string, i: number) => (<li key={f}
```

**Line 132** — techStack, change `key={i}` to `key={f}`:
```tsx
{project.details.techStack.map((f: string, i: number) => (<li key={f}
```

**Line 133** — upcomingFeatures, change `key={i}` to `key={f}`:
```tsx
{project.details.upcomingFeatures.map((f: string, i: number) => (<li key={f}
```

- [ ] **Step 2: Fix alt text for screenshot thumbnails**

In `src/components/modals/PortfolioModal.tsx` line 94, find `alt="thumb"` and change to:
```tsx
alt={`${project.title} screenshot ${idx + 1}`}
```

Also on line 93, change `alt="Project Screenshot"` to:
```tsx
alt={`${project.title} - ${t.overview}`}
```

- [ ] **Step 3: Replace inline style mouse handlers in PortfolioModal.tsx**

Line 134 — the GitHub repo link. Replace:
```tsx
style={{ color: 'var(--text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = DYNAMIC_COLORS.raw.light.primary} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
```
With a CSS-only hover approach:
```tsx
style={{ color: 'var(--text-primary)', '--hover-color': DYNAMIC_COLORS.raw.light.primary } as React.CSSProperties} className="inline-flex items-center gap-2 text-sm font-bold transition-colors group hover:![color:var(--hover-color)]"
```

Remove the old `className` from that same element (it had `inline-flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] transition-colors group`). The new className merges both.

- [ ] **Step 4: Fix list keys and mouse handlers in ServicesView.tsx**

**Line 37** — services grid, change `key={i}` to `key={s.title}`:
```tsx
                            key={s.title}
```

**Line 60** — service items, change `key={idx}` to `key={item}`:
```tsx
                                    <div key={item} className=
```

**Line 72** — value propositions, change `key={vidx}` to `key={vp}`:
```tsx
                                        <div key={vp} className=
```

**Line 88** — engagement models, change `key={i}` to `key={m.label}`:
```tsx
return (<div key={m.label} className=
```

**Line 88** — Replace the inline mouse handlers on the engagement model icon. Change:
```tsx
style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => e.currentTarget.style.color = DYNAMIC_COLORS.raw.light.primary} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
```
To:
```tsx
style={{ color: 'var(--text-tertiary)', '--hover-color': DYNAMIC_COLORS.raw.light.primary } as React.CSSProperties} className="mb-4 transition-all hover:![color:var(--hover-color)]"
```

Remove the old `className="mb-4 text-[var(--text-tertiary)] transition-all"` from that element.

- [ ] **Step 5: Verify build**

```bash
pnpm build
```

Expected: Clean build, no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/modals/PortfolioModal.tsx src/components/views/ServicesView.tsx
git commit -m "fix: stable list keys, typed doc param, CSS-only hover states"
```

---

## Task 5: Accessibility (Slice 5)

**Files:**
- Modify: `src/components/modals/PortfolioModal.tsx`

- [ ] **Step 1: Add focus trap to PortfolioModal**

In `src/components/modals/PortfolioModal.tsx`, add a focus trap effect after the existing Escape key effect (after line 75):

```tsx
    // Focus trap: cycle focus within modal
    useEffect(() => {
        const modal = document.querySelector('[role="dialog"]') as HTMLElement | null;
        if (!modal) return;

        const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusable = modal.querySelectorAll(focusableSelector);
            if (focusable.length === 0) return;

            const first = focusable[0] as HTMLElement;
            const last = focusable[focusable.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleTab);

        // Focus the close button on mount
        const closeBtn = modal.querySelector('button[aria-label="Close"]') as HTMLElement | null;
        closeBtn?.focus();

        return () => window.removeEventListener('keydown', handleTab);
    }, []);
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/components/modals/PortfolioModal.tsx
git commit -m "a11y: add focus trap and auto-focus to portfolio modal"
```

---

## Task 6: Tests (Slice 6)

**Files:**
- Create: `tests/utils/helpers.test.ts`
- Create: `tests/utils/navigation.test.ts`
- Create: `tests/utils/modal.test.ts`
- Create: `tests/constants/colors.test.ts`
- Create: `tests/constants/content.test.ts`
- Move: `src/utils/theme.test.ts` → `tests/utils/theme.test.ts`

- [ ] **Step 1: Move misplaced theme test**

```bash
mkdir -p tests/utils tests/constants
mv src/utils/theme.test.ts tests/utils/theme.test.ts
```

Update the import path inside `tests/utils/theme.test.ts`. Change line 3:
```ts
import { resolveDocumentTheme } from '../../src/utils/theme.ts';
```

Note: This test uses `node:test` and `node:assert` instead of vitest. It can stay as-is since it runs independently, but for consistency consider if it should be migrated. For now, just move it.

- [ ] **Step 2: Create `tests/utils/helpers.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest';
import { getEmbedUrl, formatMessage, isValidEmail, debounce } from '../../src/utils/helpers';

describe('getEmbedUrl', () => {
    it('converts Google Drive file URL to embed URL', () => {
        const input = 'https://drive.google.com/file/d/abc123/view?usp=sharing';
        expect(getEmbedUrl(input)).toBe('https://drive.google.com/file/d/abc123/preview');
    });

    it('returns non-Drive URLs unchanged', () => {
        const input = 'https://example.com/doc.pdf';
        expect(getEmbedUrl(input)).toBe(input);
    });

    it('returns Drive URLs without file/d/ pattern unchanged', () => {
        const input = 'https://drive.google.com/open?id=abc123';
        expect(getEmbedUrl(input)).toBe(input);
    });
});

describe('formatMessage', () => {
    it('replaces placeholders with values', () => {
        expect(formatMessage('Hello {name}!', { name: 'Bryan' })).toBe('Hello Bryan!');
    });

    it('handles multiple placeholders', () => {
        expect(formatMessage('{a} and {b}', { a: '1', b: '2' })).toBe('1 and 2');
    });

    it('leaves unmatched placeholders as-is', () => {
        expect(formatMessage('{found} {missing}', { found: 'yes' })).toBe('yes {missing}');
    });
});

describe('isValidEmail', () => {
    it('accepts valid email', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('rejects email without @', () => {
        expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('rejects email without domain', () => {
        expect(isValidEmail('test@')).toBe(false);
    });

    it('rejects empty string', () => {
        expect(isValidEmail('')).toBe(false);
    });
});

describe('debounce', () => {
    it('delays execution', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced();
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledOnce();

        vi.useRealTimers();
    });

    it('resets timer on subsequent calls', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced();
        vi.advanceTimersByTime(50);
        debounced();
        vi.advanceTimersByTime(50);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(50);
        expect(fn).toHaveBeenCalledOnce();

        vi.useRealTimers();
    });
});
```

- [ ] **Step 3: Run helpers test to verify it passes**

```bash
pnpm vitest run tests/utils/helpers.test.ts
```

Expected: All tests PASS.

- [ ] **Step 4: Create `tests/utils/modal.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { lockBodyScroll } from '../../src/utils/modal';

describe('lockBodyScroll', () => {
    beforeEach(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    });

    it('sets overflow hidden on body', () => {
        const unlock = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');
        unlock();
    });

    it('restores original overflow on unlock', () => {
        document.body.style.overflow = 'auto';
        const unlock = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');
        unlock();
        expect(document.body.style.overflow).toBe('auto');
    });

    it('supports nested locks via reference counting', () => {
        const unlock1 = lockBodyScroll();
        const unlock2 = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');

        unlock2();
        expect(document.body.style.overflow).toBe('hidden');

        unlock1();
        expect(document.body.style.overflow).toBe('');
    });
});
```

- [ ] **Step 5: Run modal test**

```bash
pnpm vitest run tests/utils/modal.test.ts
```

Expected: All tests PASS.

- [ ] **Step 6: Create `tests/constants/colors.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { DYNAMIC_COLORS, injectPaletteCSS, getThemeColors, isDarkTheme } from '../../src/constants/colors';

describe('DYNAMIC_COLORS', () => {
    it('has light and dark raw hex values', () => {
        expect(DYNAMIC_COLORS.raw.light.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(DYNAMIC_COLORS.raw.dark.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('has light and dark RGB values', () => {
        expect(DYNAMIC_COLORS.raw.light.rgb).toBeDefined();
        expect(DYNAMIC_COLORS.raw.dark.rgb).toBeDefined();
    });
});

describe('injectPaletteCSS', () => {
    it('sets CSS custom properties on document root', () => {
        injectPaletteCSS();
        const root = document.documentElement;
        expect(root.style.getPropertyValue('--primary-color')).toBeTruthy();
        expect(root.style.getPropertyValue('--secondary-color')).toBeTruthy();
        expect(root.style.getPropertyValue('--accent-color')).toBeTruthy();
    });
});

describe('getThemeColors', () => {
    it('returns light colors for light theme', () => {
        const colors = getThemeColors('light');
        expect(colors.base).toBeDefined();
        expect(colors.network).toBeDefined();
    });

    it('returns dark colors for dark theme', () => {
        const colors = getThemeColors('dark');
        expect(colors.base).toBeDefined();
    });

    it('uses system preference for system theme', () => {
        const lightColors = getThemeColors('system', false);
        const darkColors = getThemeColors('system', true);
        expect(lightColors.base).not.toEqual(darkColors.base);
    });
});

describe('isDarkTheme', () => {
    it('returns true for dark', () => {
        expect(isDarkTheme('dark')).toBe(true);
    });

    it('returns false for light', () => {
        expect(isDarkTheme('light')).toBe(false);
    });
});
```

- [ ] **Step 7: Run colors test**

```bash
pnpm vitest run tests/constants/colors.test.ts
```

Expected: All tests PASS.

- [ ] **Step 8: Create `tests/constants/content.test.ts`**

```ts
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
```

Note: The `DOCUMENTS` export name may differ — verify the actual export name from `src/constants/resources.ts` before running. Adjust the import if the export is named differently.

- [ ] **Step 9: Run all tests**

```bash
pnpm test
```

Expected: All tests PASS (existing + new).

- [ ] **Step 10: Commit**

```bash
git add tests/ && git rm src/utils/theme.test.ts 2>/dev/null; git add tests/
git commit -m "test: add utility, color system, and content contract tests"
```

---

## Task 7: Cleanup (Slice 7)

**Files:**
- Modify: `src/components/Icons.tsx`

- [ ] **Step 1: Remove unused `ArrowBack` icon from Icons.tsx**

In `src/components/Icons.tsx`, find and remove the `ArrowBack` icon definition. It's the only icon not referenced anywhere in the codebase (the other "unused" icons like Smartphone, Cloud, ChartBar, Cpu, Wifi are used dynamically via `iconName` in `src/constants/services.ts`).

Find and delete the `ArrowBack` entry (around line 46):
```tsx
  ArrowBack: (props: React.ComponentProps<'svg'>) => (
    <svg ...>...</svg>
  ),
```

- [ ] **Step 2: Verify no references to ArrowBack**

```bash
grep -r 'ArrowBack' src/
```

Expected: Only the Icons.tsx definition (which we just removed), nothing else.

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add src/components/Icons.tsx
git commit -m "cleanup: remove unused ArrowBack icon"
```

---

## Execution Notes

### Parallelization Strategy

These tasks can be executed in parallel using git worktrees:

- **Batch 1 (parallel):** Task 1 (Config), Task 7 (Cleanup) — no file overlap
- **Batch 2 (parallel):** Task 2 (Security), Task 5 (Accessibility) — Task 5 touches PortfolioModal but different lines than Task 2
- **Batch 3 (parallel):** Task 3 (Performance), Task 4 (React Quality) — Task 4 touches PortfolioModal/ServicesView, Task 3 touches pages + PDFThumbnail
- **Sequential last:** Task 6 (Tests) — benefits from all other changes being merged first

### File Overlap Matrix

| | T1 | T2 | T3 | T4 | T5 | T6 | T7 |
|---|---|---|---|---|---|---|---|
| **T1** | - | | | | | | |
| **T2** | | - | | | | | |
| **T3** | | | - | | | | |
| **T4** | | | | - | PortfolioModal | | |
| **T5** | | | | PortfolioModal | - | | |
| **T6** | | | | | | - | |
| **T7** | | | | | | | - |

Tasks 4 and 5 both modify `PortfolioModal.tsx` but at different locations (keys/handlers vs focus trap). They can run in parallel if careful, or sequentially to avoid conflicts.

### Verification Gate

Every task ends with `pnpm build`. Task 6 also requires `pnpm test` to pass.
