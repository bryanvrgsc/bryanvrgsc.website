# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server at http://localhost:4321
pnpm build        # astro check (TypeScript) + astro build — the canonical verification step
pnpm preview      # Preview production build locally
pnpm astro check  # Type-check only, no build
```

There is no test suite. `pnpm build` is the verification gate before any PR.

## Architecture

### Framework & Rendering

Astro v5 in `output: 'static'` mode. All pages are pre-rendered. React components are hydrated as islands using `client:load` / `client:idle` directives. The single layout is `src/layouts/BaseLayout.astro`.

### Routing & i18n

All routes live under `src/pages/[lang]/`. The `lang` param is either `es` (default) or `en`. All page components accept a `lang` prop and pass it down to React views. Copy lives entirely in `src/constants/ui-text.ts` as a `UI_TEXT['en' | 'es']` record.

### Global State (nanostores)

`src/store.ts` exports three stores consumed with `useStore()` from `@nanostores/react`:

- `settings` — `{ lang, theme }`, theme persisted to `localStorage`
- `performanceMode` — `{ lite: boolean }`, starts `true`, upgraded after idle
- `dockState` — `{ hidden: boolean }`

### Color System

**All colors flow from one source**: `ACTIVE_PALETTE` in `src/constants/colors.ts`. Changing that constant switches the entire app's palette.

- `DYNAMIC_COLORS` — Tailwind arbitrary-value class strings and `raw.*` hex values for `style={}` props. Use `DYNAMIC_COLORS.raw.light.primary` for inline styles.
- CSS variables (`--primary-color`, `--card-bg`, etc.) are injected by `injectPaletteCSS()` and also hardcoded as critical vars in `BaseLayout.astro` to prevent FOUC.
- Never hardcode palette colors like `emerald-500` directly in components; use `DYNAMIC_COLORS` or CSS vars.

### Theme (light/dark/system)

An inline `<script is:inline>` in `BaseLayout.astro` applies the stored theme before body renders to prevent flash. React sync happens in `src/store.ts → initThemeListener()`. The `[data-theme="dark"]` attribute on `<html>` drives CSS var overrides.

### Adaptive Performance

`src/utils/performance.ts` implements an opt-in heuristic for the canvas background. The site starts in `lite` mode (no canvas animation) and upgrades when the device scores high enough across: GPU (WebGL `MAX_TEXTURE_SIZE`), CPU cores, device memory, and network. `prefers-reduced-motion` always forces lite mode.

### Layout Persistence (Astro View Transitions)

`BaseLayout.astro` uses `transition:persist` on shell components so they survive client-side navigation without remounting: `CanvasBackground`, `Header`, `Dock`, `ThemeToggle`, `LanguageToggle`, `AppInit`.

### Content Data

Portfolio projects → `src/constants/portfolio.ts`  
Resources/papers → `src/constants/resources.ts`  
Services → `src/constants/services.ts`  
All types → `src/types/index.ts`

### Contact Form

Submits to Formspree via `PUBLIC_FORMSPREE_ID` env var. reCAPTCHA via `PUBLIC_RECAPTCHA_SITE_KEY`. Both must be set in `.env` for the form to work.

## Environment Variables

```env
PUBLIC_FORMSPREE_ID=your_formspree_id
PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## Deployment

Deployed to **Vercel**. Config in `vercel.json` (build command, headers, cache rules). The `wrangler.toml` and `pnpm pages:deploy` script are legacy Cloudflare Pages artifacts — ignore them.

Security headers are set in two places: `vercel.json` (Vercel edge) and `src/middleware/index.ts` (Astro middleware, runs at SSR/dev). They must stay in sync.
