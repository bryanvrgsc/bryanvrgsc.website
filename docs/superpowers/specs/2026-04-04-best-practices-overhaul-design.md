# Best Practices Overhaul — Design Spec

**Date:** 2026-04-04
**Scope:** Full audit and overhaul of the bryanvrgsc portfolio site
**Approach:** Feature slices (7 independent PRs)
**Framework:** Astro 6.1.1 + React 19 + Tailwind v4 + nanostores

---

## Slice 1: Config & Docs

### 1.1 Update CLAUDE.md
- Change "Astro v5" references to "Astro 6.1.1"
- Verify all commands and descriptions match current project state

### 1.2 Adopt `astro:env`
- Add `env.schema` to `astro.config.mjs` with typed definitions for:
  - `PUBLIC_FORMSPREE_ID` — `envField.string({ context: "client", access: "public", optional: true })`
  - `PUBLIC_RECAPTCHA_SITE_KEY` — `envField.string({ context: "client", access: "public", optional: true })`
- Update components consuming these vars to import from `astro:env/client`

### 1.3 Remove legacy Cloudflare artifacts
- Delete `wrangler.toml`
- Remove `wrangler` from devDependencies
- Remove `pages:deploy` script from `package.json`

---

## Slice 2: Security

### 2.1 CSP `'unsafe-inline'` audit
- `script-src`: Investigate removing `'unsafe-inline'` by using CSP hashes for Astro's inline FOUC-prevention script. If View Transitions break, document the justification for keeping it.
- `style-src`: Keep `'unsafe-inline'` (required by Tailwind dynamic styles + Google Fonts). Document as conscious decision in middleware comments.

### 2.2 Sync security headers
- Audit `vercel.json` headers vs `src/middleware/index.ts`
- Unify to a single source of truth. Options: (a) shared constant imported by middleware, (b) generate vercel.json headers from the same constant
- Unify `X-Frame-Options` to `DENY` in both places

### 2.3 Geolocation API consent
- `BudgetInput.tsx`: Move `ipapi.co/json/` fetch from component mount to user interaction with the currency field (lazy trigger)
- No external consent dialog needed — just defer the call until relevant

---

## Slice 3: Performance

### 3.1 Client directives — pages
Change `client:load` to `client:idle` in:
- `src/pages/[lang]/contact.astro`
- `src/pages/[lang]/portfolio.astro`
- `src/pages/[lang]/services.astro`
- `src/pages/[lang]/resources.astro`
- `src/pages/[lang]/portfolio/[slug].astro`

### 3.2 Client directives — layout
Keep current directives in `BaseLayout.astro`:
- `CanvasBackground client:load` — must render immediately
- `AppInit client:load` — critical initialization
- `Header client:idle` — correct
- `ThemeToggle`, `LanguageToggle` `client:idle` — correct

### 3.3 Icons.tsx cleanup
- Grep all `Icons.XYZ` references across src/
- Remove unreferenced icon definitions (~12 of 47)
- Target: reduce file from 587 to ~450 lines

### 3.4 Standardize PDF.js worker
- Unify `PDFThumbnail.tsx` to use the dynamic import pattern from `PDFViewer.tsx`
- Removes the `@ts-ignore` on line 4 of PDFThumbnail

### 3.5 Image optimization strategy
- For images passed from Astro pages to React views: optimize at the Astro layer using `<Image>` or `getImage()`, pass optimized URLs as props
- For images referenced only inside React components (e.g., portfolio thumbnails from constants): evaluate using `getImage()` in the Astro page and passing results down
- Do NOT use `<Image>` inside React components (it's an Astro-only component)

---

## Slice 4: React Quality

### 4.1 Fix list keys
Replace index keys with stable identifiers:

| File | Line(s) | Current | Fix |
|------|---------|---------|-----|
| PortfolioModal.tsx | 94 | `key={idx}` (images) | `key={img}` (URL is unique) |
| PortfolioModal.tsx | 97 | `key={i}` (tech) | `key={t.trim()}` |
| PortfolioModal.tsx | 127 | `key={i}` (documents) | `key={doc.url \|\| doc.title}` |
| PortfolioModal.tsx | 131 | `key={i}` (currentFeatures) | `key={f}` |
| PortfolioModal.tsx | 132 | `key={i}` (techStack) | `key={f}` |
| PortfolioModal.tsx | 133 | `key={i}` (upcomingFeatures) | `key={f}` |
| ServicesView.tsx | 88 | `key={i}` (engagement models) | `key={m.title}` |

### 4.2 Replace inline style mouse handlers
- `PortfolioModal.tsx` line 134: Replace `onMouseEnter/onMouseLeave` with CSS hover using `hover:text-[var(--primary-color)]`
- Eliminates direct DOM manipulation that bypasses React reconciliation

### 4.3 Replace `any` types
- `PDFViewer.tsx`: Create `PDFDocumentProxy` and `PDFRenderTask` interfaces based on actual usage from pdfjs-dist
- `PortfolioModal.tsx` line 127: Type `doc` parameter using existing types from `src/types/index.ts`

### 4.4 Remove `@ts-ignore`
- `PDFThumbnail.tsx` line 4: Resolved by Slice 3.4 (dynamic import standardization)

---

## Slice 5: Accessibility

### 5.1 Fix alt text in PortfolioModal
- Line 94: `alt="thumb"` → `` alt={`${project.title} screenshot ${idx + 1}`} ``

### 5.2 Enrich portfolio image alt text
- `PortfolioView.tsx`: Evaluate if `alt={item.title}` can be enriched with short description if data is available

### 5.3 Verify focus trap in modal
- Confirm that focus cycles within the modal when open (tab key)
- If no focus trap exists, implement a lightweight one (first/last focusable element cycling)

---

## Slice 6: Tests

### 6.1 Utility function tests
Add test files for:
- `tests/utils/helpers.test.ts` — `debounce` and other utility functions
- `tests/utils/navigation.test.ts` — URL/routing utilities
- `tests/utils/modal.test.ts` — modal state logic

### 6.2 Constants/color system tests
- `tests/constants/colors.test.ts` — verify `DYNAMIC_COLORS` generates valid Tailwind classes, `injectPaletteCSS()` produces correct CSS output

### 6.3 Content contract tests
- `tests/constants/content.test.ts` — verify `portfolio.ts`, `services.ts`, `resources.ts` have required fields, valid URLs, and referenced images exist

### 6.4 No component tests
- React component tests with Astro islands require complex setup
- ROI not justified for a portfolio site
- Components validated by `astro check` + build

---

## Slice 7: Cleanup

### 7.1 Remove Cloudflare artifacts
- Delete `wrangler.toml`
- Remove `wrangler` from devDependencies (~54MB savings)
- Remove `pages:deploy` script

### 7.2 Remove unused icons
- Grep-verified removal of ~12 unreferenced icons from `Icons.tsx`

### 7.3 Move misplaced test file
- Move `src/utils/theme.test.ts` to `tests/utils/theme.test.ts`
- Update vitest config if needed to include `tests/utils/`

### 7.4 Post-cleanup verification
- Confirm no remaining Cloudflare references
- Run `pnpm build` to verify nothing breaks

---

## Execution Order

Slices are independent and can be executed in parallel. Suggested grouping for efficiency:

- **Parallel batch 1:** Slice 1 (Config), Slice 7 (Cleanup) — low risk, fast
- **Parallel batch 2:** Slice 2 (Security), Slice 5 (Accessibility) — focused changes
- **Parallel batch 3:** Slice 3 (Performance), Slice 4 (React Quality) — largest changes
- **Sequential last:** Slice 6 (Tests) — benefits from all other slices being done first

## Verification Gate

Each slice must pass `pnpm build` before its PR is created. Slice 6 must also pass `pnpm test`.
