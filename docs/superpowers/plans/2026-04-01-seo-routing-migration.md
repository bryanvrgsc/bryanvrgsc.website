# SEO & Routing Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate from a React hash-router SPA (`#/services`) to native Astro i18n pages (`/es/services`) with full SEO metadata, View Transitions, sitemap, and robots.txt.

**Architecture:** Each route becomes a static Astro page under `src/pages/[lang]/`. The React views remain as `client:load` islands. Global layout components (`Header`, `Dock`, `CanvasBackground`) use `transition:persist` so they don't flicker between pages. `App.tsx` (the hash router) is deleted entirely.

**Tech Stack:** Astro 6, `@astrojs/sitemap`, `astro:transitions` (ClientRouter, navigate), nanostores, React 19, Cloudflare Pages (static output)

**Spec:** `docs/superpowers/specs/2026-04-01-seo-routing-migration-design.md`

---

## File Map

| Action | File |
|---|---|
| Modify | `astro.config.mjs` |
| Create | `src/components/SEO.astro` |
| Modify | `src/layouts/BaseLayout.astro` |
| Create | `src/components/layout/AppInit.tsx` |
| Modify | `src/utils/navigation.ts` |
| Modify | `src/components/layout/Dock.tsx` |
| Modify | `src/components/ui/LanguageToggle.tsx` |
| Overwrite | `src/pages/index.astro` |
| Create | `src/pages/[lang]/index.astro` |
| Create | `src/pages/[lang]/services.astro` |
| Create | `src/pages/[lang]/portfolio.astro` |
| Create | `src/pages/[lang]/resources.astro` |
| Create | `src/pages/[lang]/contact.astro` |
| Create | `src/pages/robots.txt.ts` |
| Delete | `src/components/App.tsx` |
| Create | `src/pages/[lang]/portfolio/[slug].astro` |
| Modify | `src/components/modals/PortfolioModal.tsx` |

---

## Phase 1: Config & Infrastructure

### Task 1: Install @astrojs/sitemap and update astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install the sitemap integration**

```bash
pnpm add @astrojs/sitemap
```

Expected: `@astrojs/sitemap` added to `package.json` dependencies.

- [ ] **Step 2: Update astro.config.mjs**

Replace the entire file with:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  output: 'static',
  site: 'https://bryanvrgsc.com',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    react(),
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

  vite: {
    plugins: [imagetools()],
    build: {
      cssMinify: 'lightningcss',
    },
    ssr: {
      noExternal: ['@nanostores/react', 'nanostores'],
    },
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
    },
  },

  server: {
    host: true,
    port: 4321,
  },

  image: {
    domains: ['images.unsplash.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
});
```

- [ ] **Step 3: Verify Astro can parse the new config**

```bash
cd /Users/bryanvargas/Developer/bryanvrgsc-Website && pnpm astro info
```

Expected: No errors. Astro version and config printed.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json pnpm-lock.yaml
git commit -m "feat: add @astrojs/sitemap and configure i18n routing"
```

---

### Task 2: Create SEO.astro component

**Files:**
- Create: `src/components/SEO.astro`

- [ ] **Step 1: Create the file**

```astro
---
interface Props {
  title: string;
  description: string;
  lang: 'es' | 'en';
  canonical?: string;
  image?: string;
  type?: 'website' | 'profile';
}

const {
  title,
  description,
  lang,
  image = '/og-image.avif',
  type = 'website',
} = Astro.props;

const siteURL = Astro.site ?? new URL('https://bryanvrgsc.com');
const canonicalURL = Astro.props.canonical ?? new URL(Astro.url.pathname, siteURL).href;
const imageURL = new URL(image, siteURL).href;
const ogLocale = lang === 'es' ? 'es_MX' : 'en_US';

// Build the alternate URL for the other language
const otherLang = lang === 'es' ? 'en' : 'es';
const otherURL = new URL(
  Astro.url.pathname.replace(/^\/(es|en)/, `/${otherLang}`),
  siteURL
).href;

const jsonLdPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Bryan Vargas',
  jobTitle: 'Full-Stack Developer',
  url: siteURL.href,
  sameAs: [
    'https://github.com/bryanvrgsc',
    'https://linkedin.com/in/bryanvrgsc',
  ],
  knowsAbout: ['Astro', 'React', 'TypeScript', 'Cloudflare', 'Node.js'],
};

const jsonLdWebPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: canonicalURL,
  inLanguage: lang === 'es' ? 'es-MX' : 'en-US',
  author: { '@type': 'Person', name: 'Bryan Vargas' },
};
---

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={imageURL} />
<meta property="og:locale" content={ogLocale} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalURL} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={imageURL} />

<!-- Hreflang alternates -->
<link rel="alternate" hreflang={lang} href={canonicalURL} />
<link rel="alternate" hreflang={otherLang} href={otherURL} />
<link rel="alternate" hreflang="x-default" href={canonicalURL} />

<!-- JSON-LD Structured Data -->
<script type="application/ld+json" set:html={JSON.stringify(jsonLdPerson)} />
<script type="application/ld+json" set:html={JSON.stringify(jsonLdWebPage)} />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SEO.astro
git commit -m "feat: add SEO.astro component with OG, hreflang, and JSON-LD"
```

---

## Phase 2: BaseLayout Update

### Task 3: Update BaseLayout.astro

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

The current BaseLayout has inline meta tags and no ClientRouter. We replace it with the SEO component and add View Transitions + transition:persist for all global islands.

- [ ] **Step 1: Overwrite BaseLayout.astro**

```astro
---
import { ClientRouter } from 'astro:transitions';
import SEO from '../components/SEO.astro';
import { CanvasBackground } from '../components/layout/CanvasBackground';
import { Header } from '../components/layout/Header';
import { Dock } from '../components/layout/Dock';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { ShowDockButton } from '../components/layout/ShowDockButton';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { LanguageToggle } from '../components/ui/LanguageToggle';
import AppInit from '../components/layout/AppInit';

interface Props {
  title: string;
  description: string;
  lang: 'es' | 'en';
  image?: string;
  type?: 'website' | 'profile';
}

const { title, description, lang, image, type } = Astro.props;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Preload critical fonts -->
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
    />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />

    <!-- SEO (title, description, OG, hreflang, JSON-LD) -->
    <SEO {title} {description} {lang} {image} {type} />

    <!-- View Transitions — SPA-feel navigation without white flashes -->
    <ClientRouter />

    <!-- Security -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />

    <!-- Mobile Web App -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- Theme Color -->
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
    <meta name="color-scheme" content="light dark" />

    <!-- Prevent theme flash: apply before body renders -->
    <script is:inline>
      (function () {
        function applyTheme() {
          var savedTheme = null;
          try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
          var theme = savedTheme || 'system';
          var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          var isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
          var root = document.documentElement;
          if (isDark) {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('dark');
          } else {
            root.removeAttribute('data-theme');
            root.classList.remove('dark');
          }
          return mediaQuery;
        }
        var mediaQuery = applyTheme();
        Promise.resolve().then(applyTheme);
        mediaQuery.addEventListener('change', function () {
          var savedTheme = null;
          try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
          if (!savedTheme || savedTheme === 'system') applyTheme();
        });
      })();
    </script>
  </head>
  <body>
    <!-- Global layout islands — transition:persist prevents flicker between pages -->
    <CanvasBackground client:load transition:persist="canvas" />
    <Header client:load transition:persist="header" />
    <ThemeToggle client:load transition:persist="theme-toggle" />
    <LanguageToggle client:load transition:persist="lang-toggle" />

    <main class="relative z-10 w-full">
      <slot />
    </main>

    <Dock client:load transition:persist="dock" />
    <ScrollToTop client:load transition:persist="scroll-top" />
    <ShowDockButton client:load transition:persist="show-dock-btn" />

    <!-- AppInit: runs checkPerformance() and initThemeListener() once on mount -->
    <AppInit client:only="react" transition:persist="app-init" />
  </body>
</html>

<style is:global>
  @import "tailwindcss";
  @import "../styles.css";

  :root {
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --text-primary: #020617;
    --card-bg: rgba(255, 255, 255, 0.65);
    --card-border: rgba(15, 23, 42, 0.12);
  }

  [data-theme="dark"],
  .dark {
    --bg-primary: #000000;
    --bg-secondary: #111115;
    --text-primary: #f5f5f7;
    --card-bg: rgba(10, 10, 12, 0.7);
    --card-border: rgba(255, 255, 255, 0.05);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: update BaseLayout with ClientRouter, SEO component, and transition:persist"
```

---

## Phase 3: Component Updates

### Task 4: Create AppInit.tsx

**Files:**
- Create: `src/components/layout/AppInit.tsx`

This replaces the two `useEffect` calls from `App.tsx` that called `initThemeListener()` and `checkPerformance()`. It's a renderless island that runs once on mount.

- [ ] **Step 1: Create the file**

```tsx
import { useEffect } from 'react';
import { checkPerformance, initThemeListener } from '../../store';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { useState } from 'react';

export default function AppInit() {
    const [showAnalytics, setShowAnalytics] = useState(false);

    useEffect(() => {
        initThemeListener();
        checkPerformance();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(() => setShowAnalytics(true));
            } else {
                setShowAnalytics(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!showAnalytics) return null;

    return (
        <>
            <SpeedInsights />
            <Analytics />
        </>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/AppInit.tsx
git commit -m "feat: add AppInit island (performance check, theme listener, analytics)"
```

---

### Task 5: Replace navigation.ts

**Files:**
- Modify: `src/utils/navigation.ts`

All components call `navigateTo('/contact')` etc. The new version auto-detects the current lang from the URL so callers don't need to change.

- [ ] **Step 1: Replace the file contents**

```ts
/**
 * Navigation utilities for Astro i18n routing.
 * Auto-detects the current language from the URL so callers stay simple.
 */
import { navigate } from 'astro:transitions/client';

function getCurrentLang(): string {
    if (typeof window === 'undefined') return 'es';
    const segment = window.location.pathname.split('/')[1];
    return segment === 'en' ? 'en' : 'es';
}

/**
 * Navigate to a path preserving the current language prefix.
 * @param path - Path without lang prefix, e.g. '/services', '/contact'
 */
export function navigateTo(path: string): void {
    if (typeof window === 'undefined') return;
    const lang = getCurrentLang();
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    navigate(`/${lang}${normalizedPath}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Get current path without the lang prefix.
 * @returns e.g. '/services' for URL '/es/services'
 */
export function getCurrentPath(): string {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname.replace(/^\/(es|en)/, '') || '/';
}

/**
 * Check if a path is currently active.
 */
export function isPathActive(path: string): boolean {
    const current = getCurrentPath();
    return current === path || current.startsWith(`${path}/`);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/navigation.ts
git commit -m "feat: update navigation.ts to use astro:transitions/client navigate with i18n"
```

---

### Task 6: Update Dock.tsx

**Files:**
- Modify: `src/components/layout/Dock.tsx`

The Dock has `transition:persist` so it stays mounted across page changes. It must read active state from `window.location.pathname` (not a prop) and listen to the `astro:page-load` event to update when navigation occurs.

- [ ] **Step 1: Remove `path` prop and add URL-driven active state**

Find the `Dock` component export at line 58 and replace the component signature and the `activeId` / nav items logic:

```tsx
// Replace this line:
export const Dock = React.memo(({ path }: { path: string }) => {

// With:
export const Dock = React.memo(() => {
```

- [ ] **Step 2: Add URL-driven state and astro:page-load listener**

After `const { hidden: isDockHidden } = useStore(dockState);`, add:

```tsx
const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
);

useEffect(() => {
    // Update on Astro page transitions (persisted component won't unmount)
    const onPageLoad = () => setCurrentPath(window.location.pathname);
    document.addEventListener('astro:page-load', onPageLoad);
    return () => document.removeEventListener('astro:page-load', onPageLoad);
}, []);

// Derive lang from URL for building hrefs
const langFromURL = currentPath.split('/')[1];
const currentLang = (langFromURL === 'es' || langFromURL === 'en') ? langFromURL : 'es';
```

- [ ] **Step 3: Update `activeId` to strip lang prefix**

Find the `activeId` useMemo (currently depends on `path`) and replace it:

```tsx
const activeId = useMemo(() => {
    // Strip /es/ or /en/ prefix before matching
    const p = currentPath.replace(/^\/(es|en)/, '') || '/';
    if (p === '/' || p === '') return 'home';
    if (p.startsWith('/services')) return 'services';
    if (p.startsWith('/portfolio')) return 'portfolio';
    if (p.startsWith('/resources')) return 'resources';
    if (p.startsWith('/contact')) return 'contact';
    return 'home';
}, [currentPath]);
```

- [ ] **Step 4: Update navItems hrefs to use lang prefix**

Find the `navItems` useMemo and update the `href` values:

```tsx
const navItems = useMemo<DockItemType[]>(() => [
    { id: 'home', label: t.home, Icon: Icons.Home, href: `/${currentLang}/` },
    { id: 'services', label: t.services, Icon: Icons.Layers, href: `/${currentLang}/services` },
    { id: 'portfolio', label: t.work, Icon: Icons.Briefcase, href: `/${currentLang}/portfolio` },
    { id: 'resources', label: t.resources, Icon: Icons.Book, href: `/${currentLang}/resources` },
], [t, currentLang]);
```

- [ ] **Step 5: Update DockItem href and onClick**

Find the `<a>` inside `DockItem` and update:

```tsx
// Replace:
href={`#${item.href}`}
onClick={(e) => { e.preventDefault(); onNavigate(item.href); }}

// With (use native link, ClientRouter intercepts it):
href={item.href}
onClick={(e) => { e.preventDefault(); onNavigate(item.href); }}
```

- [ ] **Step 6: Update `handleNavigate` to use full href**

```tsx
const handleNavigate = useCallback((href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);
```

Add `import { navigate } from 'astro:transitions/client';` at the top of the file and remove the `import { navigateTo } from '../../utils/navigation';` line.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/Dock.tsx
git commit -m "feat: update Dock to use URL-driven active state with astro:page-load"
```

---

### Task 7: Update LanguageToggle.tsx

**Files:**
- Modify: `src/components/ui/LanguageToggle.tsx`

Instead of calling `setLang()` on the store, navigate to the URL equivalent in the other language.

- [ ] **Step 1: Replace the component**

```tsx
import React from 'react';
import { useStore } from '@nanostores/react';
import { settings } from '../../store';
import { Icons } from '../Icons';

export const LanguageToggle = () => {
    const { lang } = useStore(settings);

    const handleSwitch = () => {
        const newLang = lang === 'en' ? 'es' : 'en';
        const current = window.location.pathname;
        const newPath = current.replace(/^\/(es|en)/, `/${newLang}`);
        window.location.href = newPath;
    };

    return (
        <button
            onClick={handleSwitch}
            className="fixed top-16 right-3 md:top-6 md:right-24 z-50 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] shadow-lg hover:scale-110 transition-transform duration-300 group overflow-hidden"
        >
            <div className="w-full h-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                {lang === 'en'
                    ? <Icons.FlagUS className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
                    : <Icons.FlagMX className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
                }
            </div>
        </button>
    );
};
```

Note: `window.location.href` is intentional here — a full reload syncs the new lang into the Astro page props and the nanostores sync script in BaseLayout picks it up.

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/LanguageToggle.tsx
git commit -m "feat: update LanguageToggle to navigate to URL equivalent in other language"
```

---

## Phase 4: Astro Pages

### Task 8: Create root index.astro (language redirect)

**Files:**
- Overwrite: `src/pages/index.astro`

The root page detects browser language and redirects. With `output: 'static'` this is a client-side redirect.

- [ ] **Step 1: Overwrite src/pages/index.astro**

```astro
---
// Root page: redirect to /es or /en based on browser language
// This runs at build time for static output — we use a client-side script
---
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting...</title>
    <script is:inline>
      (function () {
        var lang = navigator.language || navigator.languages?.[0] || 'es';
        var target = lang.startsWith('en') ? '/en/' : '/es/';
        // Use replace so the redirect doesn't pollute browser history
        window.location.replace(target);
      })();
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add root index.astro with client-side language redirect"
```

---

### Task 9: Create src/pages/[lang]/index.astro

**Files:**
- Create: `src/pages/[lang]/index.astro`

- [ ] **Step 1: Create the file**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { HomeView } from '../../components/views/HomeView';

export function getStaticPaths() {
    return [
        { params: { lang: 'es' } },
        { params: { lang: 'en' } },
    ];
}

const { lang } = Astro.params as { lang: 'es' | 'en' };

const meta = {
    es: {
        title: 'Bryan Vargas — Desarrollador Full-Stack',
        description: 'Portafolio de Bryan Vargas, desarrollador full-stack especializado en Astro, React y Cloudflare.',
    },
    en: {
        title: 'Bryan Vargas — Full-Stack Developer',
        description: 'Portfolio of Bryan Vargas, full-stack developer specialized in Astro, React, and Cloudflare.',
    },
};
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
    <HomeView client:load />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/index.astro
git commit -m "feat: add /[lang]/ home page"
```

---

### Task 10: Create src/pages/[lang]/services.astro

**Files:**
- Create: `src/pages/[lang]/services.astro`

- [ ] **Step 1: Create the file**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { ServicesView } from '../../components/views/ServicesView';

export function getStaticPaths() {
    return [
        { params: { lang: 'es' } },
        { params: { lang: 'en' } },
    ];
}

const { lang } = Astro.params as { lang: 'es' | 'en' };

const meta = {
    es: {
        title: 'Servicios — Bryan Vargas',
        description: 'Desarrollo web, aplicaciones móviles y soluciones cloud. Cotiza tu proyecto con Bryan Vargas.',
    },
    en: {
        title: 'Services — Bryan Vargas',
        description: 'Web development, mobile apps, and cloud solutions. Get a quote for your project with Bryan Vargas.',
    },
};
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
    <ServicesView client:load />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/services.astro
git commit -m "feat: add /[lang]/services page"
```

---

### Task 11: Create src/pages/[lang]/portfolio.astro

**Files:**
- Create: `src/pages/[lang]/portfolio.astro`

- [ ] **Step 1: Create the file**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { PortfolioView } from '../../components/views/PortfolioView';

export function getStaticPaths() {
    return [
        { params: { lang: 'es' } },
        { params: { lang: 'en' } },
    ];
}

const { lang } = Astro.params as { lang: 'es' | 'en' };

const meta = {
    es: {
        title: 'Portafolio — Bryan Vargas',
        description: 'Proyectos destacados de desarrollo web, aplicaciones iOS y soluciones de datos por Bryan Vargas.',
    },
    en: {
        title: 'Portfolio — Bryan Vargas',
        description: 'Featured web development, iOS app, and data solution projects by Bryan Vargas.',
    },
};
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
    <PortfolioView client:load />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/portfolio.astro
git commit -m "feat: add /[lang]/portfolio page"
```

---

### Task 12: Create src/pages/[lang]/resources.astro

**Files:**
- Create: `src/pages/[lang]/resources.astro`

- [ ] **Step 1: Create the file**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { ResourcesView } from '../../components/views/ResourcesView';

export function getStaticPaths() {
    return [
        { params: { lang: 'es' } },
        { params: { lang: 'en' } },
    ];
}

const { lang } = Astro.params as { lang: 'es' | 'en' };

const meta = {
    es: {
        title: 'Recursos — Bryan Vargas',
        description: 'Herramientas, librerías y recursos seleccionados para desarrolladores por Bryan Vargas.',
    },
    en: {
        title: 'Resources — Bryan Vargas',
        description: 'Curated tools, libraries, and resources for developers by Bryan Vargas.',
    },
};
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
    <ResourcesView client:load />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/resources.astro
git commit -m "feat: add /[lang]/resources page"
```

---

### Task 13: Create src/pages/[lang]/contact.astro

**Files:**
- Create: `src/pages/[lang]/contact.astro`

- [ ] **Step 1: Create the file**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { ContactView } from '../../components/views/ContactView';

export function getStaticPaths() {
    return [
        { params: { lang: 'es' } },
        { params: { lang: 'en' } },
    ];
}

const { lang } = Astro.params as { lang: 'es' | 'en' };

const meta = {
    es: {
        title: 'Contacto — Bryan Vargas',
        description: 'Contáctame para discutir tu próximo proyecto web o aplicación móvil.',
    },
    en: {
        title: 'Contact — Bryan Vargas',
        description: 'Get in touch to discuss your next web or mobile application project.',
    },
};
---

<BaseLayout title={meta[lang].title} description={meta[lang].description} {lang}>
    <ContactView client:load />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/contact.astro
git commit -m "feat: add /[lang]/contact page"
```

---

### Task 14: Create robots.txt.ts

**Files:**
- Create: `src/pages/robots.txt.ts`

- [ ] **Step 1: Create the file**

```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
    const sitemapURL = new URL('sitemap-index.xml', site ?? 'https://bryanvrgsc.com');
    const content = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}`;
    return new Response(content, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
};
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/robots.txt.ts
git commit -m "feat: add dynamic robots.txt referencing sitemap-index.xml"
```

---

## Phase 5: Cleanup & Verification

### Task 15: Delete App.tsx and do a build verification

**Files:**
- Delete: `src/components/App.tsx`

- [ ] **Step 1: Delete App.tsx**

```bash
rm /Users/bryanvargas/Developer/bryanvrgsc-Website/src/components/App.tsx
```

- [ ] **Step 2: Run astro check to catch type errors**

```bash
cd /Users/bryanvargas/Developer/bryanvrgsc-Website && pnpm astro check
```

Expected: 0 errors. If errors appear about missing exports or types, fix them before continuing.

Common fixes:
- If `CanvasBackground`, `Header`, etc. are not named exports, check the `src/components/layout/index.ts` barrel file and add missing exports.
- If `astro:transitions/client` type errors appear in `navigation.ts` or `Dock.tsx`, add `/// <reference types="astro/client" />` at the top of those files.

- [ ] **Step 3: Run the build**

```bash
cd /Users/bryanvargas/Developer/bryanvrgsc-Website && pnpm build
```

Expected:
- Build succeeds with 0 errors
- Output includes pages: `/es/`, `/en/`, `/es/services`, `/en/services`, `/es/portfolio`, `/en/portfolio`, `/es/resources`, `/en/resources`, `/es/contact`, `/en/contact`
- `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist
- `dist/robots.txt` exists

- [ ] **Step 4: Verify sitemap contains hreflang**

```bash
grep -i "hreflang\|alternate" /Users/bryanvargas/Developer/bryanvrgsc-Website/dist/sitemap-0.xml | head -10
```

Expected: Lines containing `xhtml:link rel="alternate" hreflang="es"` and `hreflang="en"`.

- [ ] **Step 5: Verify a page has correct meta tags**

```bash
grep -i "<title>\|og:title\|description\|hreflang" /Users/bryanvargas/Developer/bryanvrgsc-Website/dist/es/services/index.html | head -15
```

Expected: Unique `<title>Servicios — Bryan Vargas</title>` and matching OG tags.

- [ ] **Step 6: Preview locally and test navigation**

```bash
cd /Users/bryanvargas/Developer/bryanvrgsc-Website && pnpm preview
```

Open `http://localhost:4321/`. Expected:
- Root `/` redirects to `/es/` or `/en/` based on browser language
- Dock navigation works without page flicker
- `CanvasBackground` persists across page changes
- Theme toggle works and persists
- Language toggle redirects to `/en/` equivalent

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: delete App.tsx — migration to native Astro i18n routing complete"
```

---

## Phase 6: Portfolio URL Pattern

### Task 16: Create src/pages/[lang]/portfolio/[slug].astro

**Files:**
- Create: `src/pages/[lang]/portfolio/[slug].astro`

This page serves as SEO fallback for direct links to portfolio items and auto-opens the modal.

- [ ] **Step 1: Add slug field to portfolio constants**

In `src/constants/portfolio.ts`, the `PORTFOLIO.es` and `PORTFOLIO.en` arrays need a `slug` field. Each item maps to its IMG key in kebab-case.

The slug mapping is:
- gymapp → `gymapp`
- datawarehouse → `datawarehouse`
- c_animation → `c-animation`
- ios_store → `ios-store`
- appointment_app → `appointment-app`
- predictive_analysis → `predictive-analysis`

Add `slug` to each project object in both `PORTFOLIO.es` and `PORTFOLIO.en`:

```ts
// In PORTFOLIO.en array, first item:
{
    slug: 'gymapp',
    title: "GymApp iOS 🏋️‍♂️",
    // ... rest of fields
}
// Second item:
{
    slug: 'datawarehouse',
    // ...
}
// Third:
{
    slug: 'c-animation',
    // ...
}
// Fourth:
{
    slug: 'ios-store',
    // ...
}
// Fifth:
{
    slug: 'appointment-app',
    // ...
}
// Sixth:
{
    slug: 'predictive-analysis',
    // ...
}
```

Apply the same slugs to the `PORTFOLIO.es` array (same order, same slugs).

- [ ] **Step 2: Export a PORTFOLIO_SLUGS constant at the bottom of portfolio.ts**

```ts
export const PORTFOLIO_SLUGS = PORTFOLIO.en.map(p => p.slug);
```

Update the `PORTFOLIO` type annotation to include `slug: string` in the item type (or add it inline — TypeScript will infer it).

- [ ] **Step 3: Create the portfolio slug page**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { PortfolioView } from '../../../components/views/PortfolioView';
import { PORTFOLIO, PORTFOLIO_SLUGS } from '../../../constants/portfolio';

export function getStaticPaths() {
    const paths = [];
    for (const lang of ['es', 'en'] as const) {
        for (const slug of PORTFOLIO_SLUGS) {
            paths.push({ params: { lang, slug } });
        }
    }
    return paths;
}

const { lang, slug } = Astro.params as { lang: 'es' | 'en'; slug: string };

const project = PORTFOLIO[lang].find(p => p.slug === slug);

const title = project
    ? `${project.title} — Bryan Vargas`
    : `Portfolio — Bryan Vargas`;

const description = project
    ? project.problem
    : (lang === 'es' ? 'Proyectos de Bryan Vargas' : 'Bryan Vargas projects');
---

<BaseLayout {title} {description} {lang}>
    <!--
        PortfolioView reads the URL slug on mount and auto-opens the modal.
        Pass the initial slug so the view knows which project to show.
    -->
    <PortfolioView client:load initialSlug={slug} />
</BaseLayout>
```

- [ ] **Step 4: Update PortfolioView to accept and use initialSlug prop**

In `src/components/views/PortfolioView.tsx`, add `initialSlug` prop:

```tsx
interface PortfolioViewProps {
    initialSlug?: string;
}

export function PortfolioView({ initialSlug }: PortfolioViewProps) {
    // ... existing state
    const [openSlug, setOpenSlug] = useState<string | null>(initialSlug ?? null);

    // Open modal on mount if initialSlug is provided (direct URL access)
    useEffect(() => {
        if (initialSlug) {
            setOpenSlug(initialSlug);
        }
    }, [initialSlug]);

    // ... rest of component — wire openSlug to PortfolioModal's open state
}
```

If `PortfolioView` doesn't currently have explicit modal state, add it. The existing click handlers for opening a project modal should use `setOpenSlug(project.slug)`.

- [ ] **Step 5: Commit**

```bash
git add src/constants/portfolio.ts src/pages/[lang]/portfolio/[slug].astro src/components/views/PortfolioView.tsx
git commit -m "feat: add portfolio slug pages with SEO metadata and auto-open modal"
```

---

### Task 17: Update PortfolioModal with history.pushState

**Files:**
- Modify: `src/components/modals/PortfolioModal.tsx`

When a modal opens, push the project URL. When it closes, restore the portfolio URL.

- [ ] **Step 1: Add URL sync to PortfolioModal**

Find where the modal receives its `open` state (likely a boolean prop or similar) and add two effects:

```tsx
// Add these effects inside PortfolioModal, where `slug` is the project slug
// and `isOpen` is the boolean controlling visibility

// Push URL when modal opens
useEffect(() => {
    if (!isOpen || !slug) return;
    const lang = window.location.pathname.split('/')[1] || 'es';
    const portfolioPath = `/${lang}/portfolio/${slug}`;
    if (window.location.pathname !== portfolioPath) {
        history.pushState({ modalSlug: slug }, '', portfolioPath);
    }
}, [isOpen, slug]);

// Restore portfolio URL when modal closes
useEffect(() => {
    if (isOpen) return;
    const lang = window.location.pathname.split('/')[1] || 'es';
    const portfolioPath = `/${lang}/portfolio`;
    if (window.location.pathname.startsWith(`${portfolioPath}/`)) {
        history.pushState({}, '', portfolioPath);
    }
}, [isOpen]);

// Handle browser back button while modal is open
useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
        if (isOpen && !e.state?.modalSlug) {
            // User pressed back — close the modal
            onClose();
        }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
}, [isOpen, onClose]);
```

Adapt the prop names (`isOpen`, `slug`, `onClose`) to match the actual `PortfolioModal` interface — read the existing component to confirm prop names before editing.

- [ ] **Step 2: Verify the full portfolio flow works**

```bash
pnpm preview
```

Test:
1. Navigate to `/es/portfolio`
2. Click a project — URL should update to `/es/portfolio/gymapp` (or similar slug)
3. Close the modal — URL should return to `/es/portfolio`
4. Navigate directly to `/es/portfolio/gymapp` — modal should open automatically
5. Press browser back — modal should close

- [ ] **Step 3: Commit**

```bash
git add src/components/modals/PortfolioModal.tsx
git commit -m "feat: sync portfolio modal open/close state with URL via history.pushState"
```

---

## Self-Review Checklist

- [x] **Task 1** covers `astro.config.mjs` with `site`, `i18n`, and sitemap i18n
- [x] **Task 2** covers `SEO.astro` with OG, hreflang, JSON-LD
- [x] **Task 3** covers `BaseLayout.astro` with ClientRouter and transition:persist
- [x] **Task 4** covers `AppInit.tsx` replacing App.tsx's initThemeListener + checkPerformance + analytics
- [x] **Task 5** covers `navigation.ts` replacing hash with i18n-aware `navigate()`
- [x] **Task 6** covers `Dock.tsx` URL-driven active state + astro:page-load
- [x] **Task 7** covers `LanguageToggle.tsx` navigating to URL equivalent
- [x] **Tasks 8-13** cover all 5 route pages with getStaticPaths + unique metadata
- [x] **Task 14** covers `robots.txt.ts` dynamic generation
- [x] **Task 15** covers App.tsx deletion + build verification with specific commands
- [x] **Tasks 16-17** cover portfolio slug pages and modal URL sync
- [x] Spec requirement "hreflang" — covered in SEO.astro (Task 2) and sitemap config (Task 1)
- [x] Spec requirement "JSON-LD Person + WebPage" — covered in SEO.astro
- [x] Spec requirement "nanostores lang sync" — LanguageToggle uses URL redirect; Dock reads from URL
