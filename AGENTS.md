# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout and git

This Astro project sits one level down from the folder a session usually opens in: the outer `RAM-cl/` directory is a wrapper, and everything real is in `SEDT-porfolio/`. Run all `npm`/`astro` commands from here.

The wrapper is its own git repository, separate from this one. Its last commit still records the project under its former name `RAM-cl` as a gitlink (mode 160000, no `.gitmodules` — an accidentally embedded repo, never a configured submodule), so after the rename the wrapper shows `D RAM-cl` alongside an untracked `SEDT-porfolio/`. Commits made here do not land in the wrapper's history. Resolving that — flatten to one repo, or make it a real submodule — is still an open decision; don't assume either has happened.

## Commands

```sh
npm run dev      # dev server on localhost:4321
npm run build    # production build to ./dist/
npm run preview  # serve the built output
npm run astro -- check   # type-check .astro files
```

Requires Node >= 22.12.0. Astro 7.3.x, TypeScript on `astro/tsconfigs/strict`.

No test runner, linter, or formatter is configured — `npm run astro -- check` is the only verification step that exists.

### Dev server

Start it in background mode so the session isn't blocked:

```sh
npm run astro -- dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs [--follow]`.

## Styling: Tailwind is wired but not yet reaching any page

Tailwind v4 is installed and its Vite plugin is registered in [astro.config.mjs](astro.config.mjs), and [src/styles/global.css](src/styles/global.css) contains `@import "tailwindcss"`. But nothing imports `global.css` — Astro does not auto-include files in `src/styles/`, so no Tailwind class currently has any effect.

The first page or layout that needs styling must import it:

```astro
---
import '../styles/global.css';
---
```

Put that in a shared layout once one exists, rather than repeating it per page.

Tailwind v4 is configured in CSS, not JavaScript — there is no `tailwind.config.js`, and adding one will not be read. Theme customization goes in `global.css` via `@theme`.

## State of the code

Still essentially the Astro "minimal" starter: a single route at [src/pages/index.astro](src/pages/index.astro) rendering a bare HTML shell with no styling hooks, plus the Tailwind setup above. No layouts, no components directory, no content collections, no UI framework integration. Structural decisions are open — the `package.json` `name` field is also still `ram-cl` from the original scaffold.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
