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

- `@theme` holds the tokens in two tiers. The literals are `--color-navy` #1B1A3B, `--color-coral` #E2705C, `--color-bone` #F1EFE8, `--color-paper` #FFFFFF and `--color-stone` #E8E5DC; the semantic tokens components actually use are `--color-ink` (text), `--color-surface` (page ground) and `--color-shade` (the one tonal variant, for layering — its light value *is* `stone`). Alongside them: `--radius-xs` 6px / `--radius-sm` 8px, `--radius-figure` 2rem, Inter as `--font-sans` and Poppins as `--font-display`.
- Dark mode keys off a `.dark` class on `<html>`, declared with `@custom-variant` — deliberately not `prefers-color-scheme`, so the toggle can override the OS. An inline script in the layout head applies it before first paint to avoid a flash.
- `.dark` swaps the semantic tokens — `--color-ink` becomes #F1EFE8, `--color-surface` #1B1A3B and `--color-shade` #232246 — so the dark theme is the light one inverted, not a second palette. Because the *tokens* flip rather than the components, every `text-ink` / `bg-surface` / `border-ink/15` utility adapts on its own and no component needs a `dark:` variant for text or background colour. Use the semantic names, never `navy`; that rule is also why the redefinition sits outside `@layer`: it has to win over the `:root` that `@theme` emits.
- Coral is the constant accent — the same in both themes, by design, so it never flips. On bone it measures only **2.7:1**, below even the 3:1 that non-text UI needs, so coral is treated as *structural, never semantic*: it carries 1px rules, the section tick marks, fills and icon strokes, and it is never the sole carrier of meaning or used for text. Nav and footer links stay `ink` and signal hover with the rule that draws in, not a colour change.
- Text sitting **on** a coral fill is `navy`, not `paper`: white-on-coral is 3.1:1, navy-on-coral is 5.3:1. Coral+navy is a pair that survives the theme flip untouched, which is why both are literals.
- Focus rings are `ink` (14.5:1), for the same contrast reason — see `:focus-visible` in `global.css`.
- The one place coral carries text is the **stats numerals**, which the client asked for explicitly. On bone that is **2.7:1**, marginally under the 3:1 large-text floor (on navy, in dark mode, it is 5.3:1 and fine). It ships that way deliberately; the mitigation is that every figure sits directly above its label in ink, so coral is never the sole carrier. If it ever needs to pass outright, add a `--color-coral-deep` used only for text on bone rather than restyling the stats.
- Light mode spends real colour in exactly **three** places, chosen to span the page's arc: the coral shapes in the hero portrait panel, the stats slab, and the Contact icon fills. Everything between them stays on ink hairlines. Adding a fourth scatters it — the brief for this phase was explicit about picking 2-3 moments and keeping the rest calm.
- Light and dark are deliberately **different moods, not matched intensities**. `--color-band` is the only token that forks for that reason: a dramatic navy slab against bone in light, the same quiet step as `shade` in dark, where the page is already navy.
- `--color-stone` is the hero portrait panel's ground, constant in both themes (see the portrait notes below). Use `shade` everywhere else.
- `--color-paper` is constant and is **not** a background token: it is white-that-stays-white, used only for the company-logo backdrop in Experience (favicons are drawn for white).

Visual rules: 1px borders, no shadows, generous whitespace, editorial layout.

Motion was added in step-09b and is deliberately rationed to three gestures. Do not scatter more:

- **One load moment.** A single wipe front crosses the hero left-to-right (`wipe-in` + `rule-in` keyframes in `global.css`); each element's `--d`/`--t` is set from its x-position so it reads as one curtain, not a stagger. The stats band continues the same front at 620–800ms rather than running a reveal of its own. Nothing below that animates, and there is no scroll-triggered motion anywhere.
- **One hover idiom.** A coral rule draws in — the `.ul` helper under links, and the same gesture on the bottom edge of an Experience row and the top edge of the project card.
- **One hover special case.** Experience rows swap the monogram for the real company logo.

Every animation starts from the element's *final* state and only clips backwards (`animation-fill-mode: backwards`), and all of it sits inside `@media (prefers-reduced-motion: no-preference)`. So reduced-motion, no JS and no animation support all land on the finished page — verify that still holds before touching the motion layer. It is hand-written CSS on purpose: there are no `transition-*` or `animate-*` Tailwind utilities in `src/`, and adding them would scatter the system.

Non-interactive elements (the stack chips, the Technologies tags) get no hover state at all.

## State of the code

One route, [src/pages/index.astro](src/pages/index.astro), assembling the portfolio in the order Hero → Stats → About → Experience → Projects → TechGrid → Education → Footer inside [src/layouts/Layout.astro](src/layouts/Layout.astro).

[src/components/Stats.astro](src/components/Stats.astro) is Option A's layout (hairline rules on the page ground, 1px verticals between cells — no slab, no bordered boxes) carrying Option B's coral numerals. It counts all four figures out of `content.json` at build time — years from `profile.summary`, the tool total across `technologies`, `experience.length` plus its distinct companies, and the Ambassador years parsed from `recognition`. **The Recognition section was removed but `content.json.recognition` must stay** — this stat is its only remaining consumer, so deleting the array silently drops a cell. Nothing there is typed by hand, and the two regex-derived cells drop out rather than render blank if their pattern stops matching. Don't add a stat that isn't derivable.

The hero is two columns on desktop: everything textual on the left, the portrait alone on the right. The coral rule under the name sits inside `.hero__title`, a `fit-content` wrapper around the `<h1>`, so it is exactly as wide as the longer name line at every breakpoint — don't move it back out to span the grid.

The portrait is a background-removed cutout, `public/images/profile_lm.png` (made with macOS Vision subject lifting from the original `profile_lm.jpeg`, which is kept). The PNG is **trimmed to the subject** (351×598, cropped, never resampled), and the `<img>` is absolutely positioned at 92% of the panel's height with `object-fit: contain`, anchored bottom. That trim is what lets the subject be large without upscaling: on desktop and phone it is drawn below its native size. The source resolution is the ceiling — to go bigger and stay sharp, re-cut from a higher-resolution original rather than scaling up. It is rendered `grayscale(1) contrast(1.04)`, with no tint layer.

More about the portrait:

- **It is a square panel at every breakpoint.** On desktop the photo column is `clamp(20rem, 44%, 32rem)`, so the square roughly matches the text block's height while leaving the name ~410px at a 900px viewport; it is vertically centred across the rows. Below 900px it runs the full shell width under the rule (on tablet that pushes the role and CTA below the fold — an accepted trade-off).
- **It does not change with the theme.** `.hero__shot` pins `--color-ink` to `navy` and `--color-shade` to `stone` for its subtree, so the panel ground and the shapes keep their light-mode colours in dark mode. This also hides the cutout's faint light edge fringe, which only showed against navy.
- **It stays inside the shell.** Its right edge lands on the same vertical as the stats, every section pane and the footer. A version that bled to the viewport edge was rejected for breaking that alignment — don't reintroduce it. There is likewise no `mask-image` fade on the bottom edge; that was rejected too.
- **The `.orb` shapes live inside the panel, behind the cutout**: a grey halo ring behind the head, a solid coral disc, a tilted coral-stroke ellipse and a tonal floor ellipse, all sized in panel percentages. They are deliberately hero-local; free-floating decorative shapes elsewhere on the page were tried and cut, so don't scatter more. The earlier `.echo` outlines beside the photo were removed at the client's request.

Every section except Hero and Stats is wrapped in [src/components/Section.astro](src/components/Section.astro), which owns the whole layout language: a narrow left rail holding a right-aligned, sticky display title (plus an optional `meta` count), a 1px seam, and a wide content pane. The seam is the pane's `border-left` rather than its own element, and the vertical padding lives *inside* the pane — that is what makes the rule run unbroken from About to Contact, so don't move the padding out to the section. One breakpoint at 900px collapses the rail above the pane. `tone="shade"` gives a section a full-bleed `--color-shade` ground (only Technologies uses it, for scroll rhythm); `as="footer"` is how Contact stays a `<footer>`.

Hero and Stats are the two things that break this grid — no rail, no seam — and together they are the hinge before the seam starts at About.

Each section lives in a `<section id>` wired to `aria-labelledby="{id}-title"`, which `Section.astro` generates. Those ids are the nav's anchors: `navLinks` in the layout has **one entry per section** — `#about`, `#experience`, `#projects`, `#technologies`, `#education` and `#contact` (the Footer) — in page order, labelled with the same words as each `<h2>`.

`navLinks` is also the input to the active-section script at the bottom of the layout, so a new section has to be added in both places or it is missing from the nav *and* from the scroll indicator. Three things about that script:

- The current section is marked with `aria-current="true"`, and `.ul[aria-current]` in `global.css` draws the coral rule. Labels deliberately do **not** dim or change weight when inactive: dimming would put them under 4.5:1 on bone, and a weight change would shift the links sideways as you scroll.
- An `IntersectionObserver` band (`rootMargin: -25% 0px -65%`) picks the section, with the last one forced at the page bottom — Contact is too short to ever cross the band on its own.
- Clicking a link **pins** it until a real gesture (`wheel` / `touchstart` / `keydown`). Education and Contact together are shorter than one viewport, so scrolling to Education *is* scrolling to the page bottom and no position-based rule can tell "clicked Education" from "scrolled to the end". The pin cannot be released on `scroll`, because smooth scrolling fires that itself.

Smooth scrolling is `scroll-behavior: smooth` on `html`, inside the `prefers-reduced-motion: no-preference` query in `global.css`. Note that any `scroll-auto` utility on `<html>` silently beats it — that class used to be there and had to be removed.

All user-facing copy is in **English** — page text, `content.json`, `alt` text, `aria-label`s, `<html lang>` and `og:locale`. Source comments stay in Spanish, which is this repo's convention. The only Spanish left on the page is two institution names in `education`, which are proper nouns and must not be translated. Note that `Stats.astro` pulls the years figure out of `profile.summary` with a regex, so that string has to keep a leading number.

Every piece of copy comes from [src/data/content.json](src/data/content.json) — `profile` (including `profile.about`, the About paragraphs, kept separate from the shorter `profile.summary` that feeds the meta description), `experience`, `technologies`, `recognition` (no longer rendered as a section — read only by `Stats.astro`), `education` and `projects`. Components read it directly; don't hard-code content, and don't invent fields that aren't there.

Two things in [src/components/Experience.astro](src/components/Experience.astro) look like bugs but are not:

- Softvision points at `cognizant.com`. Intentional — the acquiring company.
- Logos come from `icons.duckduckgo.com/ip3/{domain}.ico`, not Clearbit. `logo.clearbit.com` stopped resolving at the DNS level after HubSpot discontinued the Logo API, so the original approach rendered five permanently broken images. An `onerror` removes the image and reveals a monogram underneath, so a future outage degrades instead of breaking. The logo is also hidden until hover/focus — but only under `@media (hover: hover)`, so pointerless devices show it from the start and lose nothing. Entries whose `domain` is missing or empty render with no logo and no link.

Category labels in [src/components/TechGrid.astro](src/components/TechGrid.astro) are a presentation map over the JSON keys (`testing_automation` → "Testing & Automatización"), with a fallback for unmapped keys.

The design plan behind all of the above, including the pass that reviewed it against generic-AI-design tells, is [docs/design/option-b-plan.md](docs/design/option-b-plan.md).

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
