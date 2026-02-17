# AGENTS.md - Coding Agent Guidelines for VanPOP Website

## Project Overview

Static website for VanPOP (Vancouver) built with **Astro v5**, **TypeScript (strict)**, and **Tailwind CSS v4**. Deployed to Cloudflare Pages. Uses **pnpm** as the package manager.

No client-side framework (React/Vue/Svelte) -- all components are `.astro` single-file components. Blog content is driven by Astro Content Collections using Markdown files with Zod-validated frontmatter.

## Build / Lint / Test Commands

| Command        | Description                                           |
| -------------- | ----------------------------------------------------- |
| `pnpm dev`     | Start dev server (accessible on network via `--host`) |
| `pnpm start`   | Start dev server (localhost only)                     |
| `pnpm build`   | Type-check (`astro check`) then build static site     |
| `pnpm preview` | Preview the production build locally                  |

### Type Checking

```sh
pnpm astro check
```

This is the primary code validation tool. It runs TypeScript checking for both `.ts` and `.astro` files. It is automatically run as part of `pnpm build`.

### Linting

-   **No ESLint** is configured. Do not add ESLint rules or dependencies.
-   **Markdown linting** is handled in CI via `markdownlint-cli2`. Config in `.markdownlint.json` disables line length limits (MD013), inline HTML (MD033), and duplicate headings (MD024).

### Testing

There is **no test framework** configured (no vitest, jest, playwright, etc.). There are no test files in the repository. Do not create test infrastructure unless explicitly asked. Validation is done via `astro check` and CI build verification.

## Code Style

### Formatting (Prettier)

Configured in `.prettierrc.mjs`:

-   **Indentation**: 4 spaces (also in `.editorconfig`)
-   **Semicolons**: Always (`semi: true`)
-   **Quotes**: Single quotes (`singleQuote: true`)
-   **Trailing commas**: ES5 style (`trailingComma: 'es5'`)

### TypeScript

-   Extends `astro/tsconfigs/strict` with `strictNullChecks: true`
-   No path aliases -- use relative imports (`../components/Foo.astro`)
-   Use `import type` for type-only imports:
    ```ts
    import type { CollectionEntry } from 'astro:content';
    ```
-   **Avoid `as` type assertions.** They bypass the type checker and can hide bugs. Instead:
    -   Use type guards (`if ('key' in obj)`, `typeof x === 'string'`, etc.)
    -   Use `satisfies` when you want to validate a value matches a type without widening
    -   Narrow types with conditional checks rather than casting
    -   If a cast is truly unavoidable (e.g. working around a third-party library's incomplete types), add a comment explaining why

### Imports

Order imports as follows (no enforced linter rule, but follow existing convention):

1. Astro built-ins (`astro:content`, `astro:transitions`)
2. Third-party packages (`@astrojs/rss`, etc.)
3. Local components (relative paths)
4. Types (using `import type`)

Example:

```ts
import { getCollection } from 'astro:content';
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import type { CollectionEntry } from 'astro:content';
```

### Naming Conventions

| Element            | Convention            | Example                                     |
| ------------------ | --------------------- | ------------------------------------------- |
| Components         | PascalCase `.astro`   | `BlogPostsPreviewList.astro`                |
| Layouts            | PascalCase `.astro`   | `BlogPost.astro`                            |
| Pages              | kebab-case `.astro`   | `get-involved.astro`                        |
| Blog posts         | `YYYYMMDD-slug.md`    | `20260213-finding-your-farm.md`             |
| Exported constants | UPPER_SNAKE_CASE      | `SITE_TITLE`, `INDEX_PAGE_BLOG_POSTS_LIMIT` |
| Variables          | camelCase             | `postsLimit`, `maxTitleLength`              |
| CSS custom props   | `--color-vp-*` prefix | `--color-vp-purple`                         |

### Astro Component Structure

Follow the standard Astro single-file component pattern:

```astro
---
// 1. Imports
import Footer from '../components/Footer.astro';
import type { HTMLAttributes } from 'astro/types';

// 2. Props interface
interface Props {
    title: string;
    description?: string;
}

// 3. Destructure props and component logic
const { title, description } = Astro.props;
---

<!-- 4. HTML template with Tailwind classes -->
<div class="flex items-center">
    <h1>{title}</h1>
    <slot />
</div>

<!-- 5. Scoped styles (only when Tailwind classes are insufficient) -->
<style>
    /* scoped CSS */
</style>

<!-- 6. Client-side script (only when absolutely needed) -->
<script>
    // minimal client JS
</script>
```

### Component Size & Refactoring

Keep `.astro` components under **~300 lines**. When a component grows beyond that, refactor by extracting:

-   **Server-side logic** (data fetching, heavy computation) into `src/lib/*.ts` utility modules
-   **Client-side helper functions** (pure functions, constants) into `src/scripts/*.ts` modules, imported by the component's `<script>` tag
-   **Template sections** (navigation bars, card templates, repeated markup) into child `.astro` components

Signs a component needs refactoring:

-   Frontmatter contains substantial fetch/transform logic that could be a standalone function
-   The `<script>` block has many pure utility functions unrelated to DOM orchestration
-   Large HTML blocks (e.g. `<template>` elements, navigation headers) that are self-contained

When extracting, preserve the same DOM IDs and `data-*` attributes so client-side scripts continue to work across component boundaries. Astro components render at build time, so IDs in child components end up in the final HTML identically.

### Types

-   Define component props using `interface Props` in the frontmatter
-   Use Zod schemas for content collection validation (see `src/content/config.ts`)
-   Use literal union types for constrained props:
    ```ts
    interface Props {
        target?: '_blank' | '_parent' | '_top' | '_self';
    }
    ```

### Styling

-   **Primary method**: Tailwind CSS utility classes directly in templates
-   **Theme colors**: Defined in `src/styles/global.css` using Tailwind v4 `@theme` directive (prefixed `vp-*`)
-   **Custom utilities**: Defined via `@layer utilities` in `global.css`
-   **Scoped styles**: Use sparingly in components, only when Tailwind is insufficient
-   **Blog layout**: Uses `<style is:global>` with `@reference` for blog content typography
-   Do NOT use inline `style` attributes except for dynamic values

### Error Handling

This is a static site with no server-side runtime. Minimal error handling is expected:

-   No try/catch blocks needed for static generation
-   Form validation uses HTML `required` attributes and external Brevo form handling
-   No custom error pages exist

## Content Conventions

### Blog Posts

Blog posts live in `src/content/blog/` as Markdown files.

**Frontmatter schema** (validated by Zod in `src/content/config.ts`):

```yaml
---
title: Post Title Here
description: Optional description
pubDate: 2026-02-14T00:00:00.000Z
updatedDate: 2026-02-15T00:00:00.000Z # optional
heroImage: /blog-assets/YYYYMMDD-slug/image.jpg
author: Author Name
---
```

**Blog images**: Store in `/public/blog-assets/YYYYMMDD-slug/` directories. Reference in markdown using:

```html
<center>
    <img
        class="blog-image"
        src="/blog-assets/YYYYMMDD-slug/image.jpg"
        alt="Description"
    />
</center>
```

## Project Architecture

```
src/
├── components/    # Reusable Astro components (PascalCase)
├── content/
│   ├── blog/      # Markdown blog posts (YYYYMMDD-slug.md)
│   └── config.ts  # Content collection schemas
├── layouts/       # Page layout templates
├── lib/           # Server-side utilities (data fetching, helpers)
├── pages/         # File-based routing
│   ├── blog/      # Blog listing + dynamic [slug] pages
│   └── rss.xml.js # RSS feed
├── scripts/       # Client-side helper modules (imported by <script> tags)
├── styles/
│   └── global.css # Tailwind theme + custom utilities
├── consts.ts      # Site-wide constants
└── env.d.ts       # Astro environment types
public/            # Static assets (images, fonts, favicon)
```

## CI/CD

-   **PR checks**: Build verification (`pnpm astro build`) and markdown linting run on PRs to `main`
-   **Deployment**: Automatic from `main` branch via Cloudflare Pages
-   **Node version in CI**: 20
-   **pnpm version in CI**: 8

## Key External Services

-   **Brevo**: Email newsletter subscription (forms + scripts)
-   **Google reCAPTCHA v3**: Form spam protection
-   **Adobe Fonts (Typekit)**: synthese, freight-text-pro fonts
-   **Google Calendar API**: Events data fetched at build time via `EventCalendar.astro`. Calendar ID is in `src/consts.ts`. API key is read from the `CALENDAR_API_KEY` environment variable (set in Cloudflare Pages; locally via `.env`). Events are static after build -- redeploy to refresh.
-   **Cloudflare Pages**: Hosting and deployment
