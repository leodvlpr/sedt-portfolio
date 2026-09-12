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

- `@theme` holds the tokens: `--color-graphite` #1D1D1B (text), `--color-muted` #5F5E5A (secondary), `--color-bone` #F1EFE8 (light background), `--color-ink` #0F0F0E (dark background), `--color-accent` #0F6E56, plus `--radius-xs` 6px / `--radius-sm` 8px and Inter as `--font-sans`.
- Dark mode keys off a `.dark` class on `<html>`, declared with `@custom-variant` — deliberately not `prefers-color-scheme`, so the toggle can override the OS. An inline script in the layout head applies it before first paint to avoid a flash.
- `.dark` also redefines `--color-accent` to #199272. The base accent only reaches 3.09:1 against the dark background, below WCAG AA; the lighter tone measures 4.93:1 at the same hue. Because the *token* is redefined rather than the components, every `*-accent` utility adapts on its own — so never hard-code an accent colour in a component. That rule is also why the redefinition sits outside `@layer`: it has to win over the `:root` that `@theme` emits.

Visual rules: 1px borders, no shadows, generous whitespace, editorial layout.

This phase is deliberately static — no animations, transitions, or scroll effects. The one exception is the theme toggle's colour transition. Keep it that way unless asked otherwise.

## State of the code

One route, [src/pages/index.astro](src/pages/index.astro), assembling the portfolio in the order Hero → Experience → TechGrid → Recognition → Education → Footer inside [src/layouts/Layout.astro](src/layouts/Layout.astro).

Every piece of copy comes from [src/data/content.json](src/data/content.json) — profile, experience, technologies, recognition, education. Components read it directly; don't hard-code content, and don't invent fields that aren't there.

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
