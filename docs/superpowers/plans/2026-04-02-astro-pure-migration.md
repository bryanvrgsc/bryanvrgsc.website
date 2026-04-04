# Astro Pure Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove React from the site completely while preserving the current UI and route behavior, replacing React islands with Astro components plus small vanilla TypeScript controllers.

**Architecture:** Render all pages, layout pieces, and reusable UI through `.astro` components, then attach focused DOM controllers from `src/scripts/` only where runtime behavior is required. Use pure helper modules for state transitions and filtering logic so the repo gains a minimal test surface, while `pnpm build` remains the integration gate after every completed phase.

**Tech Stack:** Astro 6 static output, Tailwind CSS 4, TypeScript, Vercel Analytics/Speed Insights, Vitest + JSDOM for controller/helper tests

---

## File Map

### Files to Create

- `vitest.config.ts`
- `tests/setup.ts`
- `tests/scripts/theme-state.test.ts`
- `tests/scripts/performance-state.test.ts`
- `tests/scripts/dock-state.test.ts`
- `tests/scripts/resources-state.test.ts`
- `tests/scripts/contact-validation.test.ts`
- `tests/scripts/portfolio-history.test.ts`
- `src/scripts/theme-state.ts`
- `src/scripts/theme-controller.ts`
- `src/scripts/performance-state.ts`
- `src/scripts/performance-controller.ts`
- `src/scripts/dock-state.ts`
- `src/scripts/dock-controller.ts`
- `src/scripts/resources-state.ts`
- `src/scripts/resources-controller.ts`
- `src/scripts/contact-validation.ts`
- `src/scripts/contact-form.ts`
- `src/scripts/portfolio-history.ts`
- `src/scripts/portfolio-controller.ts`
- `src/scripts/mouse-glow.ts`
- `src/components/icons/Icons.astro`
- `src/components/ui/LiquidButton.astro`
- `src/components/ui/ThemeToggle.astro`
- `src/components/ui/LanguageToggle.astro`
- `src/components/ui/TechCard.astro`
- `src/components/layout/Header.astro`
- `src/components/layout/CanvasBackground.astro`
- `src/components/layout/ScrollToTop.astro`
- `src/components/layout/ShowDockButton.astro`
- `src/components/layout/Dock.astro`
- `src/components/common/PDFViewer.astro`
- `src/components/common/PDFPreviewModal.astro`
- `src/components/common/PhoneInput.astro`
- `src/components/common/BudgetInput.astro`
- `src/components/views/ServicesView.astro`
- `src/components/views/HomeView.astro`
- `src/components/views/ResourcesView.astro`
- `src/components/views/ContactView.astro`
- `src/components/views/PortfolioView.astro`
- `src/components/modals/PortfolioModal.astro`

### Files to Modify

- `package.json`
- `pnpm-lock.yaml`
- `astro.config.mjs`
- `src/layouts/BaseLayout.astro`
- `src/components/layout/index.ts`
- `src/components/views/index.ts`
- `src/components/common/index.ts`
- `src/constants/colors.ts`
- `src/utils/performance.ts`
- `src/utils/navigation.ts`
- `src/utils/helpers.ts`
- `src/pages/[lang]/index.astro`
- `src/pages/[lang]/services.astro`
- `src/pages/[lang]/resources.astro`
- `src/pages/[lang]/contact.astro`
- `src/pages/[lang]/portfolio.astro`
- `src/pages/[lang]/portfolio/[slug].astro`
- `README.md`
- `CLAUDE.md`

### Files to Delete Once Migration Completes

- `src/store.ts`
- `src/components/Icons.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/CanvasBackground.tsx`
- `src/components/layout/Dock.tsx`
- `src/components/layout/ScrollToTop.tsx`
- `src/components/layout/ShowDockButton.tsx`
- `src/components/layout/AppInit.tsx`
- `src/components/ui/ThemeToggle.tsx`
- `src/components/ui/LanguageToggle.tsx`
- `src/components/ui/TechCard.tsx`
- `src/components/ui/PDFViewer.tsx`
- `src/components/common/LiquidButton.tsx`
- `src/components/common/PDFPreviewModal.tsx`
- `src/components/common/PhoneInput.tsx`
- `src/components/common/BudgetInput.tsx`
- `src/components/views/HomeView.tsx`
- `src/components/views/ServicesView.tsx`
- `src/components/views/ResourcesView.tsx`
- `src/components/views/ContactView.tsx`
- `src/components/views/PortfolioView.tsx`
- `src/components/modals/PortfolioModal.tsx`

---

### Task 1: Add Minimal Test Harness for Pure Client Logic

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/scripts/theme-state.test.ts`
- Create: `tests/scripts/performance-state.test.ts`
- Create: `tests/scripts/dock-state.test.ts`
- Create: `tests/scripts/resources-state.test.ts`
- Create: `tests/scripts/contact-validation.test.ts`
- Create: `tests/scripts/portfolio-history.test.ts`

- [ ] **Step 1: Write the failing tests for the first pure helpers**

```ts
// tests/scripts/theme-state.test.ts
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
```

```ts
// tests/scripts/resources-state.test.ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm exec vitest run tests/scripts/theme-state.test.ts tests/scripts/resources-state.test.ts`

Expected: FAIL with module resolution errors for `src/scripts/theme-state` and `src/scripts/resources-state`.

- [ ] **Step 3: Add the test harness and placeholder pure modules**

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "jsdom": "^26.0.0",
    "vitest": "^3.2.0"
  }
}
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
});
```

```ts
// tests/setup.ts
import { afterEach } from 'vitest';

afterEach(() => {
  document.documentElement.className = '';
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-performance');
  localStorage.clear();
});
```

- [ ] **Step 4: Add the minimal implementations to make the tests pass**

```ts
// src/scripts/theme-state.ts
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
```

```ts
// src/scripts/resources-state.ts
import type { Document } from '../constants/resources';
import type { Language } from '../types';

export type ResourceFilter = 'all' | 'paper' | 'slides';

export const filterDocuments = (
  docs: Document[],
  filter: ResourceFilter,
  category: string,
  searchTerm: string,
  lang: Language,
) => {
  const query = searchTerm.trim().toLowerCase();

  return docs.filter((doc) => {
    const matchesType = filter === 'all' || doc.type === filter;
    const matchesCategory = category === 'all' || doc.category[lang] === category;
    const matchesSearch =
      query === '' ||
      doc.title[lang].toLowerCase().includes(query) ||
      doc.description[lang].toLowerCase().includes(query) ||
      doc.category[lang].toLowerCase().includes(query);

    return matchesType && matchesCategory && matchesSearch;
  });
};
```

- [ ] **Step 5: Run the tests and commit**

Run: `pnpm exec vitest run tests/scripts/theme-state.test.ts tests/scripts/resources-state.test.ts`

Expected: PASS

```bash
git add package.json pnpm-lock.yaml vitest.config.ts tests/setup.ts tests/scripts src/scripts/theme-state.ts src/scripts/resources-state.ts
git commit -m "test: add controller test harness"
```

---

### Task 2: Extract Pure State Helpers for Theme, Performance, Dock, Contact, and Portfolio

**Files:**
- Create: `src/scripts/performance-state.ts`
- Create: `src/scripts/dock-state.ts`
- Create: `src/scripts/contact-validation.ts`
- Create: `src/scripts/portfolio-history.ts`
- Modify: `tests/scripts/performance-state.test.ts`
- Modify: `tests/scripts/dock-state.test.ts`
- Modify: `tests/scripts/contact-validation.test.ts`
- Modify: `tests/scripts/portfolio-history.test.ts`

- [ ] **Step 1: Write the failing tests for all remaining pure helpers**

```ts
// tests/scripts/dock-state.test.ts
import { describe, expect, it } from 'vitest';
import { getDockActiveId } from '../../src/scripts/dock-state';

describe('dock-state', () => {
  it('maps localized paths to a stable dock id', () => {
    expect(getDockActiveId('/es/')).toBe('home');
    expect(getDockActiveId('/en/services')).toBe('services');
    expect(getDockActiveId('/es/portfolio/gymapp')).toBe('portfolio');
  });
});
```

```ts
// tests/scripts/contact-validation.test.ts
import { describe, expect, it } from 'vitest';
import { validateContactFields } from '../../src/scripts/contact-validation';

describe('contact-validation', () => {
  it('returns field errors for invalid contact data', () => {
    expect(
      validateContactFields({ name: '', email: 'wrong', message: '' }),
    ).toEqual({
      name: 'required',
      email: 'invalid',
      message: 'required',
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm exec vitest run tests/scripts/performance-state.test.ts tests/scripts/dock-state.test.ts tests/scripts/contact-validation.test.ts tests/scripts/portfolio-history.test.ts`

Expected: FAIL with missing module exports.

- [ ] **Step 3: Implement the pure helper modules**

```ts
// src/scripts/dock-state.ts
export const getDockActiveId = (pathname: string) => {
  const pathWithoutLang = pathname.replace(/^\/(es|en)/, '') || '/';
  if (pathWithoutLang === '/' || pathWithoutLang === '') return 'home';
  if (pathWithoutLang.startsWith('/services')) return 'services';
  if (pathWithoutLang.startsWith('/portfolio')) return 'portfolio';
  if (pathWithoutLang.startsWith('/resources')) return 'resources';
  if (pathWithoutLang.startsWith('/contact')) return 'contact';
  return 'home';
};
```

```ts
// src/scripts/contact-validation.ts
export const validateContactFields = (fields: {
  name: string;
  email: string;
  message: string;
}) => {
  return {
    name: fields.name.trim() ? undefined : 'required',
    email: !fields.email.trim()
      ? 'required'
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
        ? undefined
        : 'invalid',
    message: fields.message.trim() ? undefined : 'required',
  };
};
```

```ts
// src/scripts/portfolio-history.ts
export const getPortfolioBasePath = (lang: 'es' | 'en') => `/${lang}/portfolio`;

export const getPortfolioSlugPath = (lang: 'es' | 'en', slug: string) =>
  `${getPortfolioBasePath(lang)}/${slug}`;
```

- [ ] **Step 4: Add the performance helper implementation**

```ts
// src/scripts/performance-state.ts
export interface PerformanceInput {
  prefersReducedMotion: boolean;
  saveData: boolean;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  score: number;
}

export const shouldUseLiteMode = (input: PerformanceInput) => {
  if (input.prefersReducedMotion) return true;
  if (input.saveData) return true;
  if (input.effectiveType === 'slow-2g' || input.effectiveType === '2g') {
    return true;
  }
  return input.score < 2;
};
```

- [ ] **Step 5: Run the tests and commit**

Run: `pnpm exec vitest run tests/scripts/*.test.ts`

Expected: PASS

```bash
git add src/scripts/performance-state.ts src/scripts/dock-state.ts src/scripts/contact-validation.ts src/scripts/portfolio-history.ts tests/scripts
git commit -m "test: cover Astro migration state helpers"
```

---

### Task 3: Migrate Shared Runtime Controllers and Remove Store Dependence

**Files:**
- Create: `src/scripts/theme-controller.ts`
- Create: `src/scripts/performance-controller.ts`
- Create: `src/scripts/mouse-glow.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/utils/performance.ts`
- Modify: `src/utils/helpers.ts`
- Delete: `src/store.ts`
- Delete: `src/components/layout/AppInit.tsx`

- [ ] **Step 1: Write the failing controller tests**

```ts
// tests/scripts/theme-state.test.ts
import { applyThemeToDocument } from '../../src/scripts/theme-controller';

it('writes the resolved theme to documentElement', () => {
  applyThemeToDocument('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
});
```

```ts
// tests/scripts/performance-state.test.ts
import { applyPerformanceMode } from '../../src/scripts/performance-controller';

it('stores lite mode on the document', () => {
  applyPerformanceMode('lite');
  expect(document.documentElement.dataset.performance).toBe('lite');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm exec vitest run tests/scripts/theme-state.test.ts tests/scripts/performance-state.test.ts`

Expected: FAIL with missing controller exports.

- [ ] **Step 3: Implement the controllers and rewrite the helper modules**

```ts
// src/scripts/theme-controller.ts
import { cycleTheme, resolveTheme, type ThemeMode } from './theme-state';

export const applyThemeToDocument = (resolvedTheme: 'dark' | 'light') => {
  const root = document.documentElement;
  root.dataset.theme = resolvedTheme;
  root.classList.toggle('dark', resolvedTheme === 'dark');
};

export const setThemeMode = (theme: ThemeMode) => {
  localStorage.setItem('theme', theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyThemeToDocument(resolveTheme(theme, prefersDark));
};

export const getNextThemeMode = (current: ThemeMode) => cycleTheme(current);
```

```ts
// src/scripts/performance-controller.ts
export const applyPerformanceMode = (mode: 'lite' | 'full') => {
  document.documentElement.dataset.performance = mode;
  document.documentElement.classList.toggle('lite-mode', mode === 'lite');
};
```

```ts
// src/utils/helpers.ts
export const applyMouseGlow = (target: HTMLElement, clientX: number, clientY: number) => {
  const rect = target.getBoundingClientRect();
  target.style.setProperty('--mouse-x', `${clientX - rect.left}px`);
  target.style.setProperty('--mouse-y', `${clientY - rect.top}px`);
};
```

- [ ] **Step 4: Wire the layout to the new controllers**

```astro
---astro
import SpeedInsights from '@vercel/speed-insights/astro';
import { Analytics } from '@vercel/analytics/astro';
---

<body>
  <!-- shell -->
  <Analytics />
  <SpeedInsights />
  <script>
    import { initThemeController } from '../scripts/theme-controller';
    import { initPerformanceController } from '../scripts/performance-controller';

    initThemeController();
    initPerformanceController();
  </script>
</body>
```

- [ ] **Step 5: Run tests, run the build, and commit**

Run: `pnpm exec vitest run tests/scripts/theme-state.test.ts tests/scripts/performance-state.test.ts`

Expected: PASS

Run: `pnpm build`

Expected: PASS with `0 errors`, `0 warnings`, and a completed Astro build.

```bash
git add src/scripts/theme-controller.ts src/scripts/performance-controller.ts src/scripts/mouse-glow.ts src/utils/helpers.ts src/utils/performance.ts src/layouts/BaseLayout.astro
git rm src/store.ts src/components/layout/AppInit.tsx
git commit -m "refactor: replace store runtime with Astro controllers"
```

---

### Task 4: Migrate Icons and Shared Astro UI Primitives

**Files:**
- Create: `src/components/icons/Icons.astro`
- Create: `src/components/ui/LiquidButton.astro`
- Create: `src/components/ui/ThemeToggle.astro`
- Create: `src/components/ui/LanguageToggle.astro`
- Create: `src/components/ui/TechCard.astro`
- Modify: `src/components/ui/index.ts`
- Modify: `src/components/common/index.ts`
- Delete: `src/components/Icons.tsx`
- Delete: `src/components/common/LiquidButton.tsx`
- Delete: `src/components/ui/ThemeToggle.tsx`
- Delete: `src/components/ui/LanguageToggle.tsx`
- Delete: `src/components/ui/TechCard.tsx`

- [ ] **Step 1: Write the failing build-facing change for the new Astro primitives**

```astro
---astro
// src/layouts/BaseLayout.astro
import ThemeToggle from '../components/ui/ThemeToggle.astro';
import LanguageToggle from '../components/ui/LanguageToggle.astro';
---

<body>
  <ThemeToggle />
  <LanguageToggle lang={lang} />
</body>
```

- [ ] **Step 2: Run the build to verify it fails before the Astro primitives exist**

Run: `pnpm build`

Expected: FAIL with missing `ThemeToggle.astro` / `LanguageToggle.astro`.

- [ ] **Step 3: Implement the Astro primitives**

```astro
---astro
// src/components/ui/LiquidButton.astro
interface Props {
  href?: string;
  class?: string;
  primary?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
}

const { href, class: className = '', primary = false, type = 'button', id } = Astro.props;
const Tag = href ? 'a' : 'button';
---

<Tag
  id={id}
  href={href}
  type={href ? undefined : type}
  class:list={['liquid-button', primary && 'liquid-button--primary', className]}
>
  <span class="liquid-button__content">
    <slot />
  </span>
</Tag>
```

```astro
---astro
// src/components/ui/ThemeToggle.astro
---

<button
  id="theme-toggle"
  type="button"
  class="fixed top-3 right-3 md:top-6 md:right-8 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full"
  aria-label="Theme toggle"
  data-theme-toggle
>
  <span data-theme-icon></span>
</button>
```

- [ ] **Step 4: Replace imports in the shared indexes**

```ts
// src/components/ui/index.ts
export { default as LiquidButton } from './LiquidButton.astro';
export { default as ThemeToggle } from './ThemeToggle.astro';
export { default as LanguageToggle } from './LanguageToggle.astro';
export { default as TechCard } from './TechCard.astro';
```

- [ ] **Step 5: Run the build and commit**

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/icons/Icons.astro src/components/ui src/components/common/index.ts
git rm src/components/Icons.tsx src/components/common/LiquidButton.tsx src/components/ui/ThemeToggle.tsx src/components/ui/LanguageToggle.tsx src/components/ui/TechCard.tsx
git commit -m "refactor: migrate shared UI primitives to Astro"
```

---

### Task 5: Migrate the Shared Shell Except the Dock

**Files:**
- Create: `src/components/layout/Header.astro`
- Create: `src/components/layout/CanvasBackground.astro`
- Create: `src/components/layout/ScrollToTop.astro`
- Create: `src/components/layout/ShowDockButton.astro`
- Modify: `src/components/layout/index.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Delete: `src/components/layout/Header.tsx`
- Delete: `src/components/layout/CanvasBackground.tsx`
- Delete: `src/components/layout/ScrollToTop.tsx`
- Delete: `src/components/layout/ShowDockButton.tsx`

- [ ] **Step 1: Write the failing build-facing change for the Astro shell components**

```astro
---astro
// src/layouts/BaseLayout.astro
import Header from '../components/layout/Header.astro';
import CanvasBackground from '../components/layout/CanvasBackground.astro';
import ScrollToTop from '../components/layout/ScrollToTop.astro';
import ShowDockButton from '../components/layout/ShowDockButton.astro';
---

<body>
  <CanvasBackground transition:persist="canvas" />
  <Header transition:persist="header" lang={lang} />
  <ScrollToTop transition:persist="scroll-top" />
  <ShowDockButton transition:persist="show-dock-btn" />
</body>
```

- [ ] **Step 2: Run the build to verify it fails before the Astro shell files exist**

Run: `pnpm build`

Expected: FAIL with missing Astro shell component imports.

- [ ] **Step 3: Port the shell components to Astro**

```astro
---astro
// src/components/layout/Header.astro
import Icons from '../icons/Icons.astro';
import type { Language } from '../../types';

interface Props {
  lang: Language;
}

const { lang } = Astro.props;
---

<header class="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 md:pt-6 pointer-events-none">
  <a href={`/${lang}/`} class="pointer-events-auto header-pill" data-header-link>
    <span class="header-brand">@bryanvrgsc~%</span>
  </a>
</header>
```

```astro
---astro
// src/components/layout/CanvasBackground.astro
---

<div aria-hidden="true" class="adaptive-background fixed inset-0 pointer-events-none">
  <canvas id="adaptive-background-canvas" class="adaptive-background-canvas absolute inset-0 h-full w-full hidden"></canvas>
</div>
```

- [ ] **Step 4: Replace the shell component usage in the base layout**

```astro
---astro
import Header from '../components/layout/Header.astro';
import CanvasBackground from '../components/layout/CanvasBackground.astro';
import ScrollToTop from '../components/layout/ScrollToTop.astro';
import ShowDockButton from '../components/layout/ShowDockButton.astro';
---

<body>
  <CanvasBackground transition:persist="canvas" />
  <Header transition:persist="header" lang={lang} />
  <ScrollToTop transition:persist="scroll-top" />
  <ShowDockButton transition:persist="show-dock-btn" />
</body>
```

- [ ] **Step 5: Run the build and commit**

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/layout src/layouts/BaseLayout.astro
git rm src/components/layout/Header.tsx src/components/layout/CanvasBackground.tsx src/components/layout/ScrollToTop.tsx src/components/layout/ShowDockButton.tsx
git commit -m "refactor: migrate shared shell components to Astro"
```

---

### Task 6: Rebuild the Dock as an Astro Component with a Dedicated Controller

**Files:**
- Create: `src/components/layout/Dock.astro`
- Create: `src/scripts/dock-controller.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Delete: `src/components/layout/Dock.tsx`

- [ ] **Step 1: Write the failing build-facing change for the Astro dock**

```astro
---astro
// src/layouts/BaseLayout.astro
import Dock from '../components/layout/Dock.astro';
---

<body>
  <Dock transition:persist="dock" lang={lang} />
</body>
```

- [ ] **Step 2: Run the build to verify it fails before `Dock.astro` exists**

Run: `pnpm build`

Expected: FAIL with missing `Dock.astro`.

- [ ] **Step 3: Implement the dock controller**

```ts
// src/scripts/dock-controller.ts
import { getDockActiveId } from './dock-state';

export const initDockController = () => {
  const root = document.querySelector('[data-dock-root]');
  if (!root) return;

  const update = () => {
    const activeId = getDockActiveId(window.location.pathname);
    root.querySelectorAll<HTMLElement>('[data-dock-item]').forEach((item) => {
      item.dataset.active = item.dataset.dockItem === activeId ? 'true' : 'false';
    });
  };

  update();
  document.addEventListener('astro:page-load', update);
  window.addEventListener('scroll', update, { passive: true });
};
```

- [ ] **Step 4: Replace the dock markup in Astro**

```astro
---astro
// src/components/layout/Dock.astro
import type { Language } from '../../types';

interface Props {
  lang: Language;
}

const { lang } = Astro.props;
const items = [
  { id: 'home', href: `/${lang}/`, label: 'Home' },
  { id: 'services', href: `/${lang}/services`, label: 'Services' },
  { id: 'portfolio', href: `/${lang}/portfolio`, label: 'Work' },
  { id: 'resources', href: `/${lang}/resources`, label: 'Resources' },
];
---

<nav data-dock-root class="visible-dock-container fixed bottom-6 inset-x-0 z-50 flex justify-center">
  <div class="dock-shell">
    {items.map((item) => (
      <a data-dock-item={item.id} href={item.href} class="dock-item">
        {item.label}
      </a>
    ))}
  </div>
</nav>
```

- [ ] **Step 5: Run tests, run the build, and commit**

Run: `pnpm exec vitest run tests/scripts/dock-state.test.ts`

Expected: PASS

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/layout/Dock.astro src/scripts/dock-controller.ts src/layouts/BaseLayout.astro tests/scripts/dock-state.test.ts
git rm src/components/layout/Dock.tsx
git commit -m "refactor: migrate dock to Astro controller"
```

---

### Task 7: Migrate ServicesView to Astro

**Files:**
- Create: `src/components/views/ServicesView.astro`
- Modify: `src/pages/[lang]/services.astro`
- Modify: `src/components/views/index.ts`
- Modify: `src/utils/helpers.ts`
- Delete: `src/components/views/ServicesView.tsx`

- [ ] **Step 1: Write the failing build-facing expectation**

```astro
---astro
// src/pages/[lang]/services.astro
import ServicesView from '../../components/views/ServicesView.astro';
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
  <ServicesView lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Run the build to verify it fails before the Astro view exists**

Run: `pnpm build`

Expected: FAIL with `Could not import ../../components/views/ServicesView.astro`.

- [ ] **Step 3: Port the markup to Astro and replace mouse glow hooks**

```astro
---astro
// src/components/views/ServicesView.astro
import LiquidButton from '../ui/LiquidButton.astro';
import TechCard from '../ui/TechCard.astro';
import { SERVICES, ENGAGEMENT_MODELS, UI_TEXT } from '../../constants';
import { getCategoryTheme } from '../../utils/helpers';
import type { Language } from '../../types';

interface Props {
  lang: Language;
}

const { lang } = Astro.props;
const t = UI_TEXT[lang].services;
---

<div class="max-w-7xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-40 md:pb-52 animate-slide-up">
  {SERVICES[lang].map((service) => (
    <article class="bento-card" data-mouse-glow>
      <h3>{service.title}</h3>
    </article>
  ))}
</div>
```

- [ ] **Step 4: Update the services page to use the Astro view**

```ts
// src/components/views/index.ts
export { default as ServicesView } from './ServicesView.astro';
```

- [ ] **Step 5: Run the build and commit**

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/views/ServicesView.astro src/pages/[lang]/services.astro src/components/views/index.ts src/utils/helpers.ts
git rm src/components/views/ServicesView.tsx
git commit -m "refactor: migrate services view to Astro"
```

---

### Task 8: Migrate HomeView to Astro

**Files:**
- Create: `src/components/views/HomeView.astro`
- Modify: `src/pages/[lang]/index.astro`
- Modify: `src/components/views/index.ts`
- Delete: `src/components/views/HomeView.tsx`

- [ ] **Step 1: Write the failing route-level change**

```astro
---astro
// src/pages/[lang]/index.astro
import HomeView from '../../components/views/HomeView.astro';
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
  <HomeView lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Run the build to verify it fails before the view exists**

Run: `pnpm build`

Expected: FAIL with missing `HomeView.astro`.

- [ ] **Step 3: Port the home page markup and side navigation into Astro**

```astro
---astro
// src/components/views/HomeView.astro
import LiquidButton from '../ui/LiquidButton.astro';
import TechCard from '../ui/TechCard.astro';
import { UI_TEXT } from '../../constants/ui-text';
import type { Language } from '../../types';

interface Props {
  lang: Language;
}

const { lang } = Astro.props;
const t = UI_TEXT[lang];
const steps = [
  { id: 'overview', label: t.homeLabels.overview },
  { id: 'mission', label: t.mission.title },
  { id: 'vision', label: t.vision.title },
  { id: 'values', label: t.homeLabels.values },
];
---

<div class="relative flex flex-col items-center w-full" data-home-view>
  <nav class="fixed left-3 md:left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 md:gap-6">
    {steps.map((step) => (
      <button type="button" data-home-step={step.id}>{step.label}</button>
    ))}
  </nav>
</div>
```

- [ ] **Step 4: Add the local script hooks for scroll snapping and active step updates**

```ts
// src/scripts/mouse-glow.ts
export const initHomeSectionNav = () => {
  const root = document.querySelector('[data-home-view]');
  if (!root) return;

  const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-home-section]'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-home-step]'));

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById(button.dataset.homeStep ?? '')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      buttons.forEach((button) => {
        button.dataset.active = String(button.dataset.homeStep === entry.target.id);
      });
    });
  }, { threshold: 0.55 });

  sections.forEach((section) => observer.observe(section));
};
```

- [ ] **Step 5: Run the build and commit**

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/views/HomeView.astro src/pages/[lang]/index.astro src/components/views/index.ts src/scripts/mouse-glow.ts
git rm src/components/views/HomeView.tsx
git commit -m "refactor: migrate home view to Astro"
```

---

### Task 9: Migrate PDF Preview Primitives and Resources Controller

**Files:**
- Create: `src/components/common/PDFViewer.astro`
- Create: `src/components/common/PDFPreviewModal.astro`
- Create: `src/scripts/resources-controller.ts`
- Modify: `src/components/common/index.ts`
- Delete: `src/components/ui/PDFViewer.tsx`
- Delete: `src/components/common/PDFPreviewModal.tsx`

- [ ] **Step 1: Write the failing build-facing change for the Astro PDF primitives**

```ts
// src/components/common/index.ts
export { default as PDFViewer } from './PDFViewer.astro';
export { default as PDFPreviewModal } from './PDFPreviewModal.astro';
```

- [ ] **Step 2: Run the build to verify it fails before the Astro PDF primitives exist**

Run: `pnpm build`

Expected: FAIL with missing `PDFViewer.astro` / `PDFPreviewModal.astro`.

- [ ] **Step 3: Port the preview modal and PDF viewer markup to Astro**

```astro
---astro
// src/components/common/PDFPreviewModal.astro
interface Props {
  lang: 'es' | 'en';
}

const { lang } = Astro.props;
---

<div data-pdf-modal hidden class="fixed inset-0 z-[9999]">
  <button type="button" data-pdf-close aria-label="Close preview"></button>
  <div data-pdf-frame></div>
</div>
```

```ts
// src/scripts/resources-controller.ts
export const initResourcesController = () => {
  const root = document.querySelector('[data-resources-root]');
  if (!root) return;

  const search = root.querySelector<HTMLInputElement>('[data-resources-search]');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-resource-card]'));

  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    cards.forEach((card) => {
      card.hidden = !card.dataset.search?.includes(query);
    });
  });
};
```

- [ ] **Step 4: Export the Astro primitives from the common index**

```ts
// src/components/common/index.ts
export { default as PDFViewer } from './PDFViewer.astro';
export { default as PDFPreviewModal } from './PDFPreviewModal.astro';
```

- [ ] **Step 5: Run tests, run the build, and commit**

Run: `pnpm exec vitest run tests/scripts/resources-state.test.ts`

Expected: PASS

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/common/PDFViewer.astro src/components/common/PDFPreviewModal.astro src/scripts/resources-controller.ts src/components/common/index.ts tests/scripts/resources-state.test.ts
git rm src/components/ui/PDFViewer.tsx src/components/common/PDFPreviewModal.tsx
git commit -m "refactor: migrate PDF preview primitives to Astro"
```

---

### Task 10: Migrate ResourcesView to Astro

**Files:**
- Create: `src/components/views/ResourcesView.astro`
- Modify: `src/pages/[lang]/resources.astro`
- Modify: `src/components/views/index.ts`
- Delete: `src/components/views/ResourcesView.tsx`

- [ ] **Step 1: Write the failing route-level change**

```astro
---astro
// src/pages/[lang]/resources.astro
import ResourcesView from '../../components/views/ResourcesView.astro';
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
  <ResourcesView lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Run the build to verify it fails before the Astro view exists**

Run: `pnpm build`

Expected: FAIL with missing `ResourcesView.astro`.

- [ ] **Step 3: Port the resources view markup and data attributes**

```astro
---astro
// src/components/views/ResourcesView.astro
import { DOCUMENTS } from '../../constants/resources';
import { UI_TEXT } from '../../constants/ui-text';
import PDFPreviewModal from '../common/PDFPreviewModal.astro';
import LiquidButton from '../ui/LiquidButton.astro';
import type { Language } from '../../types';

interface Props {
  lang: Language;
}

const { lang } = Astro.props;
const t = UI_TEXT[lang].resources;
const docs = DOCUMENTS;
---

<section data-resources-root class="max-w-7xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-32 md:pb-40">
  <input data-resources-search type="text" placeholder={t.searchPlaceholder} />
  {docs.map((doc) => (
    <article
      data-resource-card
      data-search={`${doc.title[lang]} ${doc.description[lang]} ${doc.category[lang]}`.toLowerCase()}
    >
      <h3>{doc.title[lang]}</h3>
    </article>
  ))}
  <PDFPreviewModal lang={lang} />
</section>
```

- [ ] **Step 4: Replace the page import and index export**

```ts
// src/components/views/index.ts
export { default as ResourcesView } from './ResourcesView.astro';
```

- [ ] **Step 5: Run the build and commit**

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/views/ResourcesView.astro src/pages/[lang]/resources.astro src/components/views/index.ts
git rm src/components/views/ResourcesView.tsx
git commit -m "refactor: migrate resources view to Astro"
```

---

### Task 11: Migrate Contact Form Primitives and Controller

**Files:**
- Create: `src/components/common/PhoneInput.astro`
- Create: `src/components/common/BudgetInput.astro`
- Create: `src/scripts/contact-form.ts`
- Modify: `src/components/common/index.ts`
- Delete: `src/components/common/PhoneInput.tsx`
- Delete: `src/components/common/BudgetInput.tsx`

- [ ] **Step 1: Write the failing build-facing change for the Astro form primitives**

```ts
// src/components/common/index.ts
export { default as PhoneInput } from './PhoneInput.astro';
export { default as BudgetInput } from './BudgetInput.astro';
```

- [ ] **Step 2: Run the build to verify it fails before the Astro form primitives exist**

Run: `pnpm build`

Expected: FAIL with missing `PhoneInput.astro` / `BudgetInput.astro`.

- [ ] **Step 3: Port the input primitives and add the form controller**

```astro
---astro
// src/components/common/PhoneInput.astro
interface Props {
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
}

const { id = 'phone', name = 'phone', value = '', placeholder = '' } = Astro.props;
---

<input id={id} name={name} type="tel" value={value} placeholder={placeholder} data-phone-input />
```

```ts
// src/scripts/contact-form.ts
import { validateContactFields } from './contact-validation';

export const initContactForm = () => {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const errors = validateContactFields({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;
  });
};
```

- [ ] **Step 4: Export the Astro inputs from the common index**

```ts
// src/components/common/index.ts
export { default as PhoneInput } from './PhoneInput.astro';
export { default as BudgetInput } from './BudgetInput.astro';
```

- [ ] **Step 5: Run tests, run the build, and commit**

Run: `pnpm exec vitest run tests/scripts/contact-validation.test.ts`

Expected: PASS

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/common/PhoneInput.astro src/components/common/BudgetInput.astro src/scripts/contact-form.ts src/components/common/index.ts tests/scripts/contact-validation.test.ts
git rm src/components/common/PhoneInput.tsx src/components/common/BudgetInput.tsx
git commit -m "refactor: migrate contact form primitives to Astro"
```

---

### Task 12: Migrate ContactView to Astro

**Files:**
- Create: `src/components/views/ContactView.astro`
- Modify: `src/pages/[lang]/contact.astro`
- Modify: `src/components/views/index.ts`
- Delete: `src/components/views/ContactView.tsx`

- [ ] **Step 1: Write the failing route-level change**

```astro
---astro
// src/pages/[lang]/contact.astro
import ContactView from '../../components/views/ContactView.astro';
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
  <ContactView lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Run the build to verify it fails before the Astro view exists**

Run: `pnpm build`

Expected: FAIL with missing `ContactView.astro`.

- [ ] **Step 3: Port the form markup and status regions into Astro**

```astro
---astro
// src/components/views/ContactView.astro
import { UI_TEXT } from '../../constants/ui-text';
import { PhoneInput, BudgetInput } from '../common';
import LiquidButton from '../ui/LiquidButton.astro';
import type { Language } from '../../types';

interface Props {
  lang: Language;
}

const { lang } = Astro.props;
const t = UI_TEXT[lang].contact;
---

<section class="max-w-5xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-32 md:pb-40">
  <form data-contact-form class="space-y-4 md:space-y-5 text-left mb-8 md:mb-12">
    <input id="name" name="name" type="text" placeholder={t.placeholders.name} />
    <input id="email" name="email" type="email" placeholder={t.placeholders.email} />
    <PhoneInput placeholder={t.placeholders.phone} />
    <BudgetInput />
    <textarea id="message" name="message" placeholder={t.placeholders.message}></textarea>
    <LiquidButton type="submit" primary>{t.submit}</LiquidButton>
  </form>
</section>
```

- [ ] **Step 4: Replace the page import and view export**

```ts
// src/components/views/index.ts
export { default as ContactView } from './ContactView.astro';
```

- [ ] **Step 5: Run the build and commit**

Run: `pnpm build`

Expected: PASS

```bash
git add src/components/views/ContactView.astro src/pages/[lang]/contact.astro src/components/views/index.ts
git rm src/components/views/ContactView.tsx
git commit -m "refactor: migrate contact view to Astro"
```

---

### Task 13: Migrate Portfolio Modal, PortfolioView, and Final React Cleanup

**Files:**
- Create: `src/components/modals/PortfolioModal.astro`
- Create: `src/components/views/PortfolioView.astro`
- Create: `src/scripts/portfolio-controller.ts`
- Modify: `src/pages/[lang]/portfolio.astro`
- Modify: `src/pages/[lang]/portfolio/[slug].astro`
- Modify: `src/components/views/index.ts`
- Modify: `astro.config.mjs`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `README.md`
- Modify: `CLAUDE.md`
- Delete: `src/components/modals/PortfolioModal.tsx`
- Delete: `src/components/views/PortfolioView.tsx`

- [ ] **Step 1: Write the failing route-level change for the Astro portfolio view**

```astro
---astro
// src/pages/[lang]/portfolio.astro
import PortfolioView from '../../components/views/PortfolioView.astro';
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
  <PortfolioView lang={lang} />
</BaseLayout>
```

```astro
---astro
// src/pages/[lang]/portfolio/[slug].astro
import PortfolioView from '../../../components/views/PortfolioView.astro';
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
  <PortfolioView lang={lang} initialSlug={slug} />
</BaseLayout>
```

- [ ] **Step 2: Run the build to verify it fails before the Astro portfolio view exists**

Run: `pnpm build`

Expected: FAIL with missing `PortfolioView.astro`.

- [ ] **Step 3: Port the modal and portfolio grid to Astro with history-aware hooks**

```astro
---astro
// src/components/views/PortfolioView.astro
import { PORTFOLIO, UI_TEXT } from '../../constants';
import PortfolioModal from '../modals/PortfolioModal.astro';
import type { Language } from '../../types';

interface Props {
  lang: Language;
  initialSlug?: string;
}

const { lang, initialSlug } = Astro.props;
const projects = PORTFOLIO[lang];
const t = UI_TEXT[lang].portfolio;
---

<section data-portfolio-root data-lang={lang} data-initial-slug={initialSlug ?? ''}>
  {projects.map((project) => (
    <article data-portfolio-card data-slug={project.slug}>
      <h3>{project.title}</h3>
    </article>
  ))}
  <PortfolioModal lang={lang} />
</section>
```

```ts
// src/scripts/portfolio-controller.ts
import { getPortfolioBasePath, getPortfolioSlugPath } from './portfolio-history';

export const initPortfolioController = () => {
  const root = document.querySelector<HTMLElement>('[data-portfolio-root]');
  if (!root) return;

  const lang = (root.dataset.lang === 'en' ? 'en' : 'es') as 'es' | 'en';
  const basePath = getPortfolioBasePath(lang);

  root.querySelectorAll<HTMLElement>('[data-portfolio-card]').forEach((card) => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug;
      if (!slug) return;
      window.history.pushState({ modalSlug: slug }, '', getPortfolioSlugPath(lang, slug));
    });
  });

  window.addEventListener('popstate', () => {
    if (window.location.pathname === basePath) {
      document.documentElement.dataset.portfolioModal = 'closed';
    }
  });
};
```

- [ ] **Step 4: Remove React from the build and docs**

```js
// astro.config.mjs
export default defineConfig({
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-MX',
          en: 'en-US',
        },
      },
    }),
  ],
});
```

```diff
# package.json (remove these entries)
- "@astrojs/react": "^5.0.2",
- "react": "^19.2.3",
- "react-dom": "^19.2.3",
- "@types/react": "^19.2.7",
- "@types/react-dom": "^19.2.3"
```

- [ ] **Step 5: Run tests, run the build, and commit**

Run: `pnpm exec vitest run tests/scripts/*.test.ts`

Expected: PASS

Run: `pnpm build`

Expected: PASS with no React integration remaining.

```bash
git add src/components/modals/PortfolioModal.astro src/components/views/PortfolioView.astro src/scripts/portfolio-controller.ts src/pages/[lang]/portfolio.astro src/pages/[lang]/portfolio/[slug].astro src/components/views/index.ts astro.config.mjs package.json pnpm-lock.yaml README.md CLAUDE.md
git rm src/components/modals/PortfolioModal.tsx src/components/views/PortfolioView.tsx
git commit -m "refactor: complete Astro-only migration"
```

---

## Self-Review

### Spec coverage

- Shared shell migration: covered by Tasks 3 through 6
- Theme/language/performance architecture: covered by Tasks 2 through 5
- Services and home Astro migration: covered by Tasks 7 and 8
- Resources and contact migration: covered by Tasks 9 through 12
- Portfolio modal/history preservation and React removal: covered by Task 13
- Final dependency cleanup and docs updates: covered by Task 13

### Placeholder scan

- No `TBD`, `TODO`, or “implement later” placeholders remain
- Every task names exact files and includes concrete commands
- Each code-changing step contains concrete code snippets rather than generic descriptions

### Type consistency

- Theme mode types use `ThemeMode = 'system' | 'dark' | 'light'` throughout
- Portfolio helpers consistently use `getPortfolioBasePath` and `getPortfolioSlugPath`
- Resource filter state consistently uses `'all' | 'paper' | 'slides'`

---

Plan complete and saved to `docs/superpowers/plans/2026-04-02-astro-pure-migration.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
