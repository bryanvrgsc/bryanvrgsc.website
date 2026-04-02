# Astro Pure Migration Design

**Date:** 2026-04-02  
**Status:** Approved  
**Scope:** Migrate the site from Astro + React islands to Astro-only rendering with small vanilla TypeScript client controllers

---

## Overview

The current site is built on Astro static routing, but most page content and a large part of the shared shell still render through React islands. This keeps `@astrojs/react`, `react`, `react-dom`, React hydration, and nanostore-based client state in the runtime even though much of the UI is static markup with small interaction points.

This migration removes React from the project entirely while preserving the current visual experience as closely as possible. Simplifications are allowed only when they produce a meaningful performance or maintenance gain without creating a noticeable UX regression.

The target outcome is an Astro-only site where:

- All pages and shared UI render from `.astro` components
- Client behavior is implemented with small vanilla TypeScript controllers
- Theme, language, performance mode, navigation state, filters, and modals are managed without React or nanostores
- Existing route structure, styling, animation language, and portfolio URL behavior remain substantially unchanged

---

## Goals

- Remove `@astrojs/react`, `react`, `react-dom`, and React type dependencies from the project
- Remove active `.tsx` / `.jsx` runtime components from `src`
- Preserve the current visual identity, layout, motion, and interaction model as closely as possible
- Reduce client-side hydration and runtime complexity
- Replace broad reactive state with explicit URL state, DOM state, and modular controller state
- Keep `pnpm build` as the canonical verification gate at every phase

## Non-Goals

- Full visual redesign
- Route restructuring or URL changes
- Changes to content or translations beyond what is required to preserve behavior
- Replacing Vercel Analytics or Speed Insights
- Backend/API rewrites beyond the existing client-side contact submission flow

---

## Migration Strategy

The migration will use a phased hybrid approach rather than a single rewrite. This keeps the site working through each checkpoint while progressively removing shared React infrastructure first, then converting route-level UI, and finally deleting React dependencies.

### Why this approach

- A one-shot rewrite would create a large, hard-to-verify diff with elevated risk around the dock, portfolio modal, contact form, and adaptive canvas behavior
- Converting shared primitives first creates Astro-native building blocks that can be reused across page migrations
- Page migrations can then proceed in risk order, from mostly static pages to the more interaction-heavy portfolio flow
- Each phase can be validated independently using the repo’s existing build gate and functional checks

---

## Architecture Target

The Astro-only architecture will separate concerns into three clear layers:

### 1. Astro-rendered markup

Astro components will become the default for:

- Shared shell components
- Reusable UI primitives
- Page views
- Modal markup

These components should render the HTML, classes, assets, and SSR-friendly props with minimal embedded client logic.

### 2. Small local scripts

Lightweight behaviors that do not justify a stateful framework will be handled by small scripts attached to the relevant Astro markup, including:

- Theme toggling
- Language switching
- Scroll-to-top behavior
- Dock visibility and active indicator updates
- Search/filter state for resources
- Lightweight hover and pointer effects

### 3. Focused client controllers

More complex interactive areas will use dedicated vanilla TypeScript modules under `src/scripts/`:

- `theme-controller.ts`
- `performance-controller.ts`
- `dock-controller.ts`
- `portfolio-controller.ts`
- `resources-controller.ts`
- `contact-form.ts`
- `mouse-glow.ts`

These modules enhance the DOM rendered by Astro rather than owning the UI tree themselves.

---

## State Model

The migration replaces React + nanostores with explicit state ownership.

### URL state

The URL becomes the source of truth for:

- Current language (`/es/...` or `/en/...`)
- Current route
- Portfolio slug route when a modal-backed case study is open

### DOM/document state

Document-level state lives on the DOM via attributes, classes, and small controller modules:

- Theme: `<html data-theme="...">` and `dark` class
- Performance mode: `data-performance="lite|full"` or equivalent document-level signal
- Dock visibility: DOM class/attribute managed by the dock controller

### Local controller state

Feature-level ephemeral state stays inside the relevant controller:

- Active search term and selected filters
- Open/closed modal state
- Active screenshot/document in previews
- Contact form validation and submission status

This model is intentionally simpler than the current store-based approach and should make debugging easier because ownership is tied directly to route, document, or feature scope.

---

## Theme Architecture

The existing theme anti-flash behavior in `BaseLayout.astro` remains the foundation.

### Theme handling after migration

- The inline script in `BaseLayout.astro` still applies the theme before body render
- A new `theme-controller.ts` module manages runtime theme changes
- ThemeToggle becomes an Astro component with stable HTML and an attached behavior script

### Responsibilities of `theme-controller.ts`

- Read the saved theme from `localStorage`
- Cycle between `system`, `dark`, and `light`
- Apply `data-theme` and the `dark` class on `<html>`
- Update the toggle icon and `aria-label`
- Listen for `prefers-color-scheme` changes when theme is `system`

### Expected outcome

- No hydration dependency just to display or change the theme
- No store synchronization for theme updates
- Existing anti-flash behavior preserved during SSR and Astro transitions

---

## Language Architecture

Language no longer needs client-side state synchronization.

### New source of truth

- The current language is derived from the pathname prefix
- Astro pages pass `lang` down as SSR props

### Language toggle behavior

- `LanguageToggle` becomes an Astro component
- Its client behavior calculates the equivalent path in the other language
- Navigation uses the existing Astro route structure and preserves View Transition behavior

### Expected outcome

- No language nanostore
- No client-side synchronization effect just to discover the current language
- Cleaner relationship between URL and rendered content

---

## Performance Mode Architecture

The existing adaptive background heuristic is worth keeping, but not as a nanostore-backed reactive model.

### New behavior

- The site still starts from the safe fallback mode
- `performance-controller.ts` computes whether the device stays in `lite` mode or upgrades to `full`
- The result is expressed on the document via a class or data attribute
- Background and other optional effects read from DOM state rather than React state

### Expected outcome

- Preserve the current progressive enhancement strategy
- Reduce client runtime complexity
- Keep canvas upgrades opt-in based on capability signals

---

## File Structure Target

The repo should end up with a clearer division between rendered UI and behavior logic.

### Astro UI structure

- `src/components/layout/*.astro`
- `src/components/ui/*.astro`
- `src/components/views/*.astro`
- `src/components/modals/*.astro`

### Script/controller structure

- `src/scripts/*.ts`

### Guiding rule

Astro components render the UI. `src/scripts` enhances already-rendered DOM nodes and should not recreate a framework-like component tree.

---

## Phase Plan

### Phase 1: Astro-native infrastructure

Convert the shared low-risk building blocks first.

Scope:

- Replace nanostore-backed theme/runtime behavior with controllers and document state
- Migrate `LiquidButton`
- Migrate `ThemeToggle`
- Migrate `LanguageToggle`
- Migrate `Header`
- Migrate `ScrollToTop`
- Migrate `ShowDockButton`
- Migrate `CanvasBackground`
- Reduce `AppInit` to a minimal Astro-native initialization path or remove it if its responsibilities are fully redistributed

Goals:

- Preserve shell visuals
- Remove shared React dependencies from the simplest reusable pieces
- Establish Astro-native patterns before touching route-level views

### Phase 2: Navigation shell

Rebuild the shared dock in Astro with a focused client controller.

Scope:

- Migrate `Dock`
- Reimplement active indicator positioning
- Preserve hide/show-on-scroll behavior
- Preserve navigation timing and route awareness
- Keep compatibility with Astro View Transitions

Goals:

- Keep visual behavior substantially unchanged
- Replace the current high-complexity React implementation with a simpler controller-driven one

### Phase 3: Mostly static pages

Convert the lowest-risk route views first.

Scope:

- Migrate `ServicesView`
- Migrate `HomeView`

Notes:

- `ServicesView` is largely static markup plus hover behavior and is the best initial route conversion candidate
- `HomeView` should keep its current structure and side navigation feel, but can replace portal-based and effect-heavy logic with local Astro scripts

Goals:

- Validate route-level Astro view migration without immediately touching the highest-risk interactions

### Phase 4: Medium-interaction pages

Convert pages with meaningful client behavior but limited routing complexity.

Scope:

- Migrate `ResourcesView`
- Migrate `ContactView`

Resources requirements:

- Preserve filtering and search UX
- Preserve PDF preview behavior
- Keep preload optimizations where valuable

Contact requirements:

- Preserve validation messaging
- Preserve success/error/submit states
- Preserve Formspree POST flow

Goals:

- Replace medium-complexity local state with focused DOM controllers
- Keep UX parity while reducing runtime overhead

### Phase 5: Portfolio and cleanup

Handle the most delicate route last, then remove React completely.

Scope:

- Migrate `PortfolioView`
- Migrate `PortfolioModal`
- Preserve modal + URL synchronization pattern
- Preserve direct deep links to `/{lang}/portfolio/{slug}`
- Preserve `history` behavior on open/close
- Remove React-specific dependencies and obsolete helpers

Cleanup targets:

- Remove `@astrojs/react` integration from `astro.config.mjs`
- Remove React packages and types from `package.json`
- Remove or rewrite helpers still importing React
- Delete obsolete `.tsx` / `.jsx` runtime components

Goals:

- Finish migration without changing the user-facing portfolio flow
- Deliver a fully Astro-native runtime

---

## Component-Specific Guidance

### Components to port almost literally

These can preserve markup and styling closely:

- `ServicesView`
- `ThemeToggle`
- `LanguageToggle`
- `Header`
- `ScrollToTop`
- `ShowDockButton`
- `LiquidButton`

### Components to preserve visually but simplify internally

- `Dock`
- `HomeView`
- `ResourcesView`
- `ContactView`
- `PortfolioView`
- `PortfolioModal`

The rule is to keep the user-facing behavior substantially the same while replacing framework-driven state with direct DOM/controller logic.

---

## Verification Strategy

There is no automated test suite in the repo, so each phase must verify through build and focused functional checks.

### Canonical verification gate

- `pnpm build`

### Phase verification checklist

#### Phase 1

- Theme persists correctly across page loads and route transitions
- Language toggle navigates correctly
- Canvas background still upgrades only on capable devices
- Shared shell renders correctly without React
- `pnpm build` passes cleanly

#### Phase 2

- Dock highlights the active route correctly
- Dock hides and reappears on scroll as expected
- Navigation still works with Astro transitions
- `pnpm build` passes cleanly

#### Phase 3

- `ServicesView` and `HomeView` remain visually aligned with the current implementation
- Side navigation and section scrolling still behave correctly on home
- `pnpm build` passes cleanly

#### Phase 4

- Resource filtering and search behave correctly
- PDF preview opens and closes correctly
- Contact validation messages appear correctly
- Contact submission success/error states behave correctly
- `pnpm build` passes cleanly

#### Phase 5

- Portfolio cards open the correct modal
- URL changes correctly on open and close
- Browser back/forward works correctly
- Direct portfolio slug routes still load the correct case study
- React dependencies are fully removed
- `pnpm build` passes cleanly

---

## Risks

### 1. Theme regressions during Astro navigation

Risk:

- Theme may visually desync during client-side navigation or page shell swaps

Mitigation:

- Keep the anti-flash inline script
- Centralize runtime theme updates in one controller
- Verify transitions explicitly after every shell change

### 2. Layout persistence regressions

Risk:

- Converting the shared shell could break the intended `transition:persist` behavior

Mitigation:

- Migrate shell pieces before high-risk pages
- Keep persistence identifiers stable where needed

### 3. Dock behavior drift

Risk:

- Small changes in timing, indicator position, or scroll behavior may feel “off” even if functionally correct

Mitigation:

- Preserve DOM structure and CSS shape where possible
- Treat dock behavior as a UX parity checkpoint, not just a functional one

### 4. Portfolio history/modal edge cases

Risk:

- Opening, closing, direct entry, and browser navigation may desynchronize modal state and URL state

Mitigation:

- Leave the portfolio flow for the final dedicated phase
- Implement it as a focused controller with explicit history rules

### 5. PDF preview and contact form regressions

Risk:

- React removal may break document preview timing or form state transitions

Mitigation:

- Keep feature logic isolated in dedicated controllers
- Verify the exact interactions in their migration phase before proceeding

---

## Success Criteria

The migration is complete when all of the following are true:

- No `@astrojs/react` integration remains in the Astro config
- No `react`, `react-dom`, `@types/react`, or `@types/react-dom` dependencies remain in active use
- No active `.tsx` / `.jsx` runtime components remain in `src`
- All shared shell pieces and route views render through Astro
- Client behavior is handled by focused vanilla TypeScript modules or local scripts
- The site continues to build cleanly with `pnpm build`
- The visible experience remains substantially the same, with simplifications only where they clearly improve performance or maintainability without meaningful UX loss

---

## Implementation Notes

- Preserve the current route structure and metadata behavior
- Keep Vercel Analytics and Speed Insights working through Astro-compatible integration points
- Prefer simplification only where it materially reduces runtime overhead or maintenance burden
- Treat visual fidelity as the default unless a simplification has a strong justification
