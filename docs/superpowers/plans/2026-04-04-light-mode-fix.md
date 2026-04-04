# Light Mode Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer que el toggle de light mode funcione correctamente cuando el OS está en dark mode, fijando la configuración de `dark:` en Tailwind v4 y `color-scheme`.

**Architecture:** Dos cambios quirúrgicos en `src/styles.css`: agregar `@custom-variant dark` para que Tailwind v4 use `[data-theme=dark]` en vez de media query, y hacer `color-scheme` dinámico por tema. No se tocan componentes.

**Tech Stack:** Tailwind CSS v4, Astro v6, CSS custom properties

---

## File Map

| File | Acción |
|------|--------|
| `src/styles.css` | Modificar — 2 cambios puntuales |

---

### Task 1: Agregar `@custom-variant dark` en `src/styles.css`

**Files:**
- Modify: `src/styles.css` (línea 1 — antes de `:root`)

Este cambio hace que todos los utilities `dark:*` de Tailwind respondan al atributo `[data-theme=dark]` en el `<html>`, en lugar de `@media (prefers-color-scheme: dark)`.

- [ ] **Step 1: Agregar la directiva al inicio de `src/styles.css`**

El archivo actualmente empieza con:
```css
/* Global Config */
:root {
  --apple-ease: cubic-bezier(0.25, 1, 0.3, 1);
  color-scheme: light dark;
  ...
```

Insertar `@custom-variant dark` como primera línea real (antes del comentario `/* Global Config */`):

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

/* Global Config */
:root {
  --apple-ease: cubic-bezier(0.25, 1, 0.3, 1);
  color-scheme: light dark;
  ...
```

- [ ] **Step 2: Verificar que el build pasa**

```bash
pnpm build
```

Esperado: `Build complete` sin errores de TypeScript ni CSS. Si hay error de Tailwind sobre `@custom-variant`, verificar que `tailwindcss ^4.1.18` está instalado con `pnpm list tailwindcss`.

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "fix: configure Tailwind v4 dark variant to use data-theme attribute

In Tailwind v4, dark: utilities default to prefers-color-scheme media query.
Add @custom-variant dark to bind dark: utilities to [data-theme=dark] instead,
so the ThemeToggle correctly overrides OS dark mode preference."
```

---

### Task 2: Arreglar `color-scheme` para que sea dinámico

**Files:**
- Modify: `src/styles.css` (dentro de `:root` y dentro de `[data-theme='dark'], .dark`)

`color-scheme: light dark` en `:root` le dice al browser que aplique estilos nativos según la preferencia del OS — incluso cuando el usuario forzó light mode. Esto afecta inputs, selects, scrollbars y el fondo del `<html>` en algunos browsers.

- [ ] **Step 1: Cambiar `color-scheme` en `:root` de `light dark` a `light`**

Localizar en `src/styles.css` dentro del bloque `:root`:
```css
/* antes */
color-scheme: light dark;
```

Reemplazar con:
```css
/* después */
color-scheme: light;
```

- [ ] **Step 2: Agregar `color-scheme: dark` al bloque dark**

Localizar el bloque `[data-theme='dark'], .dark` en `src/styles.css`. Actualmente empieza así:
```css
[data-theme='dark'],
.dark {
  --primary-color: #38bdf8;
  ...
```

Agregar `color-scheme: dark;` como primera propiedad dentro del bloque:
```css
[data-theme='dark'],
.dark {
  color-scheme: dark;
  --primary-color: #38bdf8;
  ...
```

- [ ] **Step 3: Verificar que el build pasa**

```bash
pnpm build
```

Esperado: `Build complete` sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css
git commit -m "fix: make color-scheme theme-aware to prevent native dark UA styles in light mode

color-scheme: light dark in :root caused browsers to apply dark native styles
(inputs, scrollbars) even when the user forced light mode. Now :root uses
color-scheme: light and [data-theme=dark] uses color-scheme: dark."
```

---

## Verificación Manual Final

Con OS en **dark mode**:

1. Abrir el sitio en `pnpm dev` (o `pnpm preview` tras el build)
2. Por defecto (tema "system"): el sitio debe verse **oscuro** ✓
3. Hacer click en el ThemeToggle hasta llegar a "light" (ícono sol)
4. El fondo debe volverse **blanco/claro** inmediatamente ✓
5. Todos los textos, cards, inputs deben verse en light mode ✓
6. Hacer click de nuevo al toggle → "system" → vuelve a oscuro ✓

Con OS en **light mode** (regresión):

1. Visitar el sitio → se ve en light mode ✓
2. Toggle a dark → se ve oscuro ✓
3. Toggle a light → se ve claro ✓
