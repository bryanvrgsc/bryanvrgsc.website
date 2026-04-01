# SEO & Routing Migration Design

**Date:** 2026-04-01  
**Status:** Approved  
**Scope:** Migrate from hash router to native Astro i18n routes with full SEO support

---

## Overview

The site currently uses a single Astro page (`src/pages/index.astro`) that mounts a React SPA with a hash-based router (`#/services`, `#/portfolio`, etc.). Google cannot index hash-based URLs, all pages share the same `<title>` and `<meta description>`, and there is no sitemap or robots.txt.

This migration replaces the hash router with native Astro i18n routing, adds per-page SEO metadata, enables View Transitions for SPA-feel navigation, and adds structured data (JSON-LD) and a sitemap.

---

## Architecture

### Routing Strategy

- **Framework:** Astro i18n native routing
- **Locales:** `['es', 'en']`, default locale: `es`
- **URL strategy:** `prefixDefaultLocale: true` — both languages use a prefix
  - Spanish: `/es/`, `/es/services`, `/es/portfolio`, `/es/resources`, `/es/contact`
  - English: `/en/`, `/en/services`, `/en/portfolio`, `/en/resources`, `/en/contact`
- **Root `/`:** `src/pages/index.astro` detects browser language via `navigator.language` and redirects to `/es` or `/en`

### File Structure

```
src/pages/
├── index.astro                    # Language redirect (navigator.language → /es or /en)
├── robots.txt.ts                  # Dynamic robots.txt using Astro.site
└── [lang]/
    ├── index.astro                # HomeView
    ├── services.astro             # ServicesView
    ├── portfolio.astro            # PortfolioView
    ├── resources.astro            # ResourcesView
    ├── contact.astro              # ContactView
    └── portfolio/
        └── [slug].astro           # Static fallback for direct portfolio item links
```

### astro.config.mjs Changes

```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bryanvrgsc.com',  // Required for sitemap + canonical URLs
  output: 'static',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,  // index.astro handles redirect
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
});
```

---

## Components

### SEO.astro (new)

Location: `src/components/SEO.astro`

Props:
```ts
interface Props {
  title: string;
  description: string;
  lang: 'es' | 'en';
  canonical?: string;     // auto-generated if omitted
  image?: string;         // default: /og-image.avif
  type?: 'website' | 'profile';
}
```

Renders:
- `<title>` and `<meta name="description">` unique per page
- `<link rel="canonical">` pointing to the current page URL
- Open Graph: `og:title`, `og:description`, `og:image`, `og:locale` (`es_MX` / `en_US`)
- Twitter Card: `summary_large_image`
- `<link rel="alternate" hreflang="es">` and `<link rel="alternate" hreflang="en">` for the equivalent page in the other language
- JSON-LD `Person` schema (on all pages) and `WebPage` schema (per page)

JSON-LD Person schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Bryan Vargas",
  "jobTitle": "Full-Stack Developer",
  "url": "https://bryanvrgsc.com",
  "sameAs": ["https://github.com/bryanvrgsc", "https://linkedin.com/in/bryanvrgsc"],
  "knowsAbout": ["Astro", "React", "TypeScript", "Cloudflare"]
}
```

### BaseLayout.astro Changes

1. Import and render `<SEO />` component in `<head>`, replacing existing inline meta tags
2. Import and render `<ClientRouter />` from `astro:transitions` in `<head>`
3. Accept `lang` prop and pass to `<html lang={lang}>`
4. Add `transition:persist` directives to global layout components:
   - `<CanvasBackground transition:persist="canvas" />`
   - `<Header transition:persist="header" />`
   - `<ThemeToggle transition:persist="theme-toggle" />`
   - `<LanguageToggle transition:persist="lang-toggle" />`
   - `<Dock transition:persist="dock" />`
   - `<ScrollToTop transition:persist="scroll-top" />`
5. Add inline `<script>` that reads `lang` from URL pathname and syncs to nanostores before first render:
   ```js
   const langFromURL = document.location.pathname.split('/')[1];
   if (langFromURL === 'en' || langFromURL === 'es') {
     // import and call settings.setKey('lang', langFromURL)
   }
   ```

### App.tsx — Deletion

`src/components/App.tsx` is deleted entirely. Its responsibilities are distributed:

| Was in App.tsx | Moves to |
|---|---|
| Hash router + `renderView()` | Astro pages (`[lang]/*.astro`) |
| `initThemeListener()` effect | BaseLayout inline script (already there) |
| `checkPerformance()` effect | New `src/components/layout/PerformanceInit.tsx` island with `client:only="react"` |
| Analytics (`SpeedInsights`, `Analytics`) | BaseLayout as `transition:persist` islands |
| ErrorBoundary + Suspense | Kept in each view component or a shared wrapper |

### navigation.ts — Replacement

`src/utils/navigation.ts` is replaced. The `navigateTo()` hash function is removed. New utility uses `navigate()` from `astro:transitions/client` for programmatic navigation so ClientRouter can animate it:
```ts
import { navigate } from 'astro:transitions/client';

export function navigateTo(path: string, lang: string): void {
  navigate(`/${lang}${path}`);
}
```
`<a>` tag clicks are intercepted automatically by ClientRouter — `navigateTo()` is only needed for programmatic navigation (e.g., after form submission).

### Dock.tsx Changes

- `href` changes from `href={\`#${item.href}\`}` to `href={\`/${lang}${item.href}\`}`
- `lang` prop is added: `interface Props { path: string; lang: string }`
- `navigateTo(href)` call is replaced with the native link — no onClick override needed

### LanguageToggle.tsx Changes

Instead of calling `settings.setKey('lang', newLang)`, it navigates to the URL equivalent:
```ts
const switchLang = () => {
  const current = window.location.pathname;
  const newPath = current.replace(/^\/(es|en)/, `/${newLang}`);
  window.location.href = newPath;
};
```

---

## Portfolio Modal + URL Pattern

For premium UX on portfolio items:

1. User is on `/es/portfolio` and clicks a project card
2. `PortfolioModal` opens — `history.pushState(null, '', `/es/portfolio/${slug}`)` updates the URL without navigation
3. On modal close — `history.back()` or `history.pushState` back to `/es/portfolio`
4. Direct link to `/es/portfolio/mi-proyecto` — `src/pages/[lang]/portfolio/[slug].astro` renders the project with full SEO metadata and auto-opens the modal on load (via `data-open-modal` attribute read by a client-side script)

---

## SEO Metadata Per Page

| Route | Title (es) | Description (es) |
|---|---|---|
| `/es/` | Bryan Vargas — Desarrollador Full-Stack | Portafolio de Bryan Vargas, desarrollador full-stack especializado en Astro, React y Cloudflare. |
| `/es/services` | Servicios — Bryan Vargas | Desarrollo web, aplicaciones móviles y soluciones cloud. Cotiza tu proyecto. |
| `/es/portfolio` | Portafolio — Bryan Vargas | Proyectos destacados de desarrollo web y aplicaciones. |
| `/es/resources` | Recursos — Bryan Vargas | Herramientas, librerías y recursos para desarrolladores. |
| `/es/contact` | Contacto — Bryan Vargas | Contáctame para discutir tu próximo proyecto. |

English equivalents use translated titles and descriptions.

---

## Sitemap & robots.txt

### @astrojs/sitemap

Generates at build time:
- `sitemap-index.xml` — index file (Google's entry point)
- `sitemap-0.xml` — all URLs with `xhtml:link` hreflang annotations for `es-MX` / `en-US`

Requires `site: 'https://bryanvrgsc.com'` in `astro.config.mjs`.

### robots.txt

Dynamic file at `src/pages/robots.txt.ts` that references `Astro.site`:
```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}`);
};
```

---

## What Google Will See After Migration

- 10+ real, indexable URLs (5 es + 5 en + portfolio items)
- Unique `<title>` and `<meta description>` per page and language
- Correct `hreflang` in both `<head>` and sitemap
- JSON-LD Person schema on every page
- Open Graph tags for social sharing
- `robots.txt` pointing to `sitemap-index.xml`
- Static HTML fallback pages for portfolio items

---

## Out of Scope

- Content translation (the actual English copy for each page)
- Image optimization changes beyond existing setup
- Analytics provider changes
- Any backend / API changes
