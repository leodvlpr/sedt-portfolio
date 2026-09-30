# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout and git

This Astro project sits one level down from the folder a session usually opens in: the outer `RAM-cl/` directory is a wrapper, and everything real is in `SEDT-porfolio/`. Run all `npm`/`astro` commands from here.

This repository is the one that ships. Its `origin` is `github.com/leodvlpr/sedt-portfolio` on branch `main`, and its root is what GitHub serves: the project was flattened into a single repo rather than turned into a submodule. That decision is settled.

The outer `RAM-cl/` wrapper is still a separate git repository on disk, but it is inert — its `origin` was removed, so it can no longer push over this one. Its last commit records the project under its former name `RAM-cl` as a gitlink (mode 160000, no `.gitmodules` — an accidentally embedded repo, never a configured submodule), which is why it shows `D RAM-cl` alongside an untracked `SEDT-porfolio/`. Ignore it; commits made here do not land in its history and do not need to.

## Commands

```sh
npm run dev      # dev server on localhost:4321
npm run build    # production build to ./dist/
npm run preview  # serve the built output
npm run astro -- check   # type-check .astro files
```

Requires Node >= 22.12.0. Astro 7.3.x, TypeScript on `astro/tsconfigs/strict`.

No test runner, linter, or formatter is configured — `npm run astro -- check` is the only verification step that exists. `@astrojs/check` and `typescript` are installed as devDependencies, so it runs without prompting to install anything. It should report 0 errors, 0 warnings, 0 hints; note that it parses inline event-handler attributes as TypeScript, so an `onerror="this.x=1"` raises a spurious ts(6133) — write those as calls (`this.remove()`) instead.

### Dev server

Start it in background mode so the session isn't blocked:

```sh
npm run astro -- dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs [--follow]`.

## Styling: Tailwind v4, design system in `@theme`

Tailwind v4 is installed, its Vite plugin is registered in [astro.config.mjs](astro.config.mjs), and [src/styles/global.css](src/styles/global.css) is imported once by [src/layouts/Layout.astro](src/layouts/Layout.astro). That single import is what puts Tailwind on the page — Astro does not auto-include files in `src/styles/`, so anything rendering outside that layout needs its own import.

Tailwind v4 is configured in CSS, not JavaScript — there is no `tailwind.config.js`, and adding one will not be read. The design system lives in `global.css`:

- `@theme` holds the tokens in two tiers. The literals are `--color-navy` #1B1A3B, `--color-coral` #E2705C and `--color-paper` #FFFFFF; the semantic pair components actually use is `--color-ink` (text) and `--color-surface` (background). Alongside them: `--radius-xs` 6px / `--radius-sm` 8px, Inter as `--font-sans` and Poppins as `--font-display`.
- Dark mode keys off a `.dark` class on `<html>`, declared with `@custom-variant` — deliberately not `prefers-color-scheme`, so the toggle can override the OS. An inline script in the layout head applies it before first paint to avoid a flash.
- `.dark` swaps the two semantic tokens — `--color-ink` becomes #FFFFFF and `--color-surface` #1B1A3B — so the dark theme is the light one inverted, not a second palette. Because the *tokens* flip rather than the components, every `text-ink` / `bg-surface` / `border-ink/15` utility adapts on its own and no component needs a `dark:` variant for text or background colour. Use the semantic names, never `navy`; that rule is also why the redefinition sits outside `@layer`: it has to win over the `:root` that `@theme` emits.
- Coral is the constant — the same accent in both themes, by design, so it is the one token that never flips. It measures 3.13:1 on the light surface and 5.33:1 on the dark one. That is fine for the 1px rules, borders and icon strokes it mostly carries, and for the large display logo, but it is below WCAG AA wherever it lands on small text: the `Actual` badge in Experience and the `hover:text-coral` nav and footer links. Prefer `text-ink/70` for body copy.
- `--color-paper` is also constant, and is not a background token: it is white-that-stays-white, for content sitting on a coral fill (button and icon-circle hovers) and for the logo backdrop in Experience.

Visual rules: 1px borders, no shadows, generous whitespace, editorial layout.

This phase is deliberately static — no animations, transitions, or scroll effects, and right now `src/` contains not one `transition-*` or `animate-*` utility. Keep it that way unless asked otherwise.

## State of the code

One route, [src/pages/index.astro](src/pages/index.astro), assembling the portfolio in the order Hero → About → Experience → Projects → TechGrid → Recognition → Education → Footer inside [src/layouts/Layout.astro](src/layouts/Layout.astro).

Every section except Hero opens with [src/components/SectionHeading.astro](src/components/SectionHeading.astro) — a bold display title with a coral rule beside it, not under it — and each lives in a `<section id>` wired to `aria-labelledby="{id}-title"`. Those ids are the nav's anchors: the three `navLinks` in the layout point at `#about`, `#projects` and `#contact`, and `#contact` is the Footer. Adding a section means adding the heading and the id together, or the nav and the landmark labels drift apart.

Every piece of copy comes from [src/data/content.json](src/data/content.json) — `profile` (including `profile.about`, the About paragraphs, kept separate from the shorter `profile.summary` that feeds the meta description), `experience`, `technologies`, `recognition`, `education` and `projects`. Components read it directly; don't hard-code content, and don't invent fields that aren't there.

Two things in [src/components/Experience.astro](src/components/Experience.astro) look like bugs but are not:

- Softvision points at `cognizant.com`. Intentional — the acquiring company.
- Logos come from `icons.duckduckgo.com/ip3/{domain}.ico`, not Clearbit. `logo.clearbit.com` stopped resolving at the DNS level after HubSpot discontinued the Logo API, so the original approach rendered five permanently broken images. An `onerror` removes the image and reveals a monogram underneath, so a future outage degrades instead of breaking. Entries whose `domain` is missing or empty render with no logo and no link.

Category labels in [src/components/TechGrid.astro](src/components/TechGrid.astro) are a presentation map over the JSON keys (`testing_automation` → "Testing & Automatización"), with a fallback for unmapped keys.

No content collections and no UI framework integration. The `package.json` `name` field is still `ram-cl` from the original scaffold.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
