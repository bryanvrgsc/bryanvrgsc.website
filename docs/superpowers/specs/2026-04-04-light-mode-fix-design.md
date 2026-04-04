# Spec: Light Mode Fix

**Date:** 2026-04-04  
**Status:** Approved

## Problem

When the user's OS is in dark mode and they manually toggle the site to "light" via the `ThemeToggle`, the dark background and dark-styled elements persist. The issue does **not** occur when the OS is in light mode.

## Root Cause

Tailwind v4 (`^4.1.18`) is installed. In Tailwind v4, the `dark:` variant defaults to `@media (prefers-color-scheme: dark)` — it responds to the OS preference, **not** to the `.dark` class on `<html>`.

The existing `tailwind.config.cjs` uses Tailwind v3 syntax (`darkMode: 'class'` is implied, but not set). In Tailwind v4, this config file is ignored for the `darkMode` setting. Configuration must be done via CSS using `@custom-variant`.

As a result, even when the inline script in `BaseLayout.astro` removes `data-theme="dark"` and `.dark` from `<html>`, all Tailwind `dark:*` utilities in React components continue to apply because the OS is still in dark mode.

A secondary issue: `color-scheme: light dark` in `:root` tells the browser to apply native dark UA styles (input backgrounds, scrollbar colors, etc.) even when the user has forced light mode.

## Solution

Two surgical changes to `src/styles.css`, no component changes.

### Change 1: Configure Tailwind v4 dark variant

Add at the top of `src/styles.css`, before `:root`:

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

This overrides the default media-query behavior and binds all `dark:*` utilities to the `data-theme="dark"` attribute on `<html>`, which is already set/unset by the existing `applyTheme()` function in `src/store.ts` and the inline script in `BaseLayout.astro`.

Why `[data-theme=dark]` over `.dark`: The existing CSS already uses `[data-theme='dark']` as the primary dark mode selector. Both attributes are set together by the app, so either works — using `data-theme` keeps the CSS strategy consistent.

### Change 2: Fix `color-scheme`

Current state in `:root`:
```css
color-scheme: light dark;
```

This tells the browser the document supports both modes and to pick based on OS preference. This causes native browser elements (inputs, selects, scrollbars) to stay dark even when light mode is forced.

**Fix:** Make `color-scheme` follow the active theme.

In `:root` (light default):
```css
color-scheme: light;
```

In `[data-theme='dark'], .dark`:
```css
color-scheme: dark;
```

## Affected Files

| File | Change |
|------|--------|
| `src/styles.css` | Add `@custom-variant dark` at top; change `color-scheme` to be theme-aware |

No components are modified. No new files created.

## Verification

1. `pnpm build` — no type errors, build succeeds
2. Browser with OS in dark mode → visit site → background is white (light mode default)
3. Toggle to dark → background turns dark ✓
4. Toggle back to light → background turns white ✓
5. Native inputs/scrollbars match the active theme ✓
