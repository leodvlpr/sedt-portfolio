# Option B — design plan: "Run report"

Written before implementation, per the `frontend-design` two-pass process.
Pass 1 is the plan; pass 2 is the review against the generic-default list,
with the revisions recorded at the bottom.

## Subject matter

Leonel is a QA Lead / SDET, not a generic "developer". The artefacts he looks
at all day are **test reports and runners**: a narrow left tree of specs with
status marks, a wide right pane with the detail, counts in the margin, and a
run that resolves left-to-right from pending to passed. That is the vernacular
this design borrows — as *information structure*, not as skeuomorphic
decoration. No fake terminal windows, no `$` prompts, no green checkmark
emoji.

Audience: hiring managers and engineering leads scanning for signal in under a
minute. Primary job: make 10 years of QA work legible fast, and make the page
itself feel like something built by someone who cares about precision.

## Color — 6 named values

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-ink` | `#1B1A3B` navy | `#F1EFE8` bone | all text, hairlines |
| `--color-surface` | `#F1EFE8` bone | `#1B1A3B` navy | page ground |
| `--color-shade` | `#E8E5DC` | `#232246` | the one tonal variant, for layering |
| `--color-coral` | `#E2705C` | `#E2705C` | constant accent — never flips |
| `--color-navy` | `#1B1A3B` | `#1B1A3B` | constant — text *on* coral |
| `--color-paper` | `#FFFFFF` | `#FFFFFF` | constant — white that stays white |

The two themes are exact inversions: `ink` and `surface` swap, so no component
needs a `dark:` variant. `shade` is the single tonal variant the brief allows,
used for exactly one full-bleed band (Technologies) so the scroll has a ground
change without a harsh inverted slab.

**Contrast, measured:**
- navy on bone — **14.5:1**
- coral on bone — **2.7:1**. Below 3:1, so coral is never the sole carrier of
  meaning and never used for body or link text. It carries hairlines, the
  section tick marks and fills.
- paper on coral — 3.1:1 → **rejected**. navy on coral is **5.3:1**, so the
  primary button is coral fill with *navy* text, in both themes. Coral+navy is
  a constant pair that survives the theme flip.
- Focus ring is `ink`, not coral, for the same reason.

## Type

Inter (body) and Poppins (display) are pinned: the `leodvlpr` mark must be
preserved exactly and it is set in the display face. Weights stay 400/500/600
and 700/800 — no new families, and deliberately **no monospace** (see review).

Scale, from a 16px base, ~1.333 ratio with a deliberate break at the top:

| Role | Size | Treatment |
|---|---|---|
| Hero name | `clamp(3.25rem, 13vw, 8.5rem)` | Poppins 800, `lh .86`, `ls -.04em`, sentence case |
| Section title | `1.5rem` | Poppins 800, right-aligned in the rail |
| Role / lede | `1.25rem` | Inter 400 |
| Body | `1rem`, `lh 1.7`, max `66ch` | Inter 400 at 70% ink |
| Rail meta, chips | `.8125rem` | Inter 500, tabular numerals |

The hero name is the type-as-structure moment: "Leonel" and "Mujica" are both
six characters, so stacked at that size they form a near-perfect rectangle of
type. That rectangle is a layout block, not a headline sitting on one.

## Layout

A two-zone grid that is the same shape as a test report: narrow rail, hairline
seam, wide pane. The rail heading is **right-aligned against the seam** and
**sticks** while its section scrolls — so the label stays with the content it
labels, and the scroll rhythm comes from headings pinning and releasing rather
than from uniform gaps.

```
desktop >= 900px                                  the hero breaks the grid

+--------------------------------------------------------------+
|  leodvlpr.              About me   Projects   Contact    (o)  |
+--------------------------------------------------------------+
|                                            ################   |
|   I'm                                      ################   |
|                                            ################   |
|   Leonel                                   ####  photo  ###   |
|   Mujica                                   ################   |
|  ========================================= ################   |   coral rule
|                                            ################   |   runs *under*
|   QA Lead & Software Engineer in Test      ################   |   the photo
|   Madrid, Espana                           ################   |
|                                            ################   |
|   ( Email Leonel )   LinkedIn              ################   |
+--------------------------------------------------------------+
         rail  |  seam          pane
              .|.
       About  |  Hi! My name is Leonel Mujica and I am a
              |  Software engineer with experience in...
              |
              |  As a software engineer, I take great...
              .|.
  Experience  |  [L]  Holafly     QA Lead              Actual
     5 roles  |  [L]  Holafly     Software Engineer...
              |  [P]  Platzi      Senior QA Specialist
  (sticky)    |  [S]  Softvision  Senior QA Engineer
              |  [R]  Rappi       QA Engineer
              .|.
    Projects  |  +------------------------------------+
              |  | Playwright Framework               |
              |  | ...                                |
              |  +------------------------------------+
==============.|.============================================== shade band
Technologies  |  Testing & Automatizacion
    14 tools  |  (Cypress)(Playwright)(Selenium)(Appium)...
==============.|.==============================================
```

- The small square on the seam at each section start is the tick mark — a
  section boundary made visible, the one piece of report iconography kept.
- Below 900px the rail collapses above the pane, left-aligned, not sticky, and
  the seam disappears. One breakpoint, no intermediate states to maintain.
- Alignment: everything is left-aligned except the rail headings, which are
  right-aligned so they sit tight against the seam. The page is never centered.
- Corner system: **squares for structure** (photo, logo slots, project card,
  rules), **pills for actions and tokens** (the CTA, the stack chips). Radius
  encodes what you can click, not decoration.

## Motion

**One orchestrated load moment — a single wipe front crossing the hero.**
A coral rule draws left-to-right across the hero over 760ms, and everything it
passes is revealed in its wake by a hard-edged `clip-path` wipe in the same
direction. Each element's delay is set from its x-position, so it reads as one
continuous curtain opening rather than N elements each animating. It is the
progress bar of a run completing. It happens once, in the first viewport, and
nothing below the fold animates on load.

**One hover idiom — a coral rule draws in.** Nav links, the GitHub link and the
contact links draw a 2px coral rule left-to-right under the label. Experience
rows draw it along their bottom edge. The project card draws it along its top
edge. Same gesture on different edges makes a system instead of variety.

**One hover special case — the logo swap.** Experience rows rest as a clean
typographic table showing a monogram; on hover or keyboard focus the real
company favicon fades in over it. Something real changes. Under
`@media (hover: none)` the logos are simply always visible, so touch loses
nothing.

Non-interactive elements (the stack chips, the recognition list) get **no**
hover state at all. `prefers-reduced-motion: reduce` disables every animation
and transition; because the resolved state is the CSS default and the
animations only clip *backwards* from it, no-JS and no-animation both land on
the finished page.

## Principles

1. The rail is the spine. Every section hangs off one hairline seam.
2. Coral is structural, never semantic — it cannot pass contrast as text.
3. One bold element (the hero type block + bleeding photo); everything below it
   is quiet, tabular and disciplined.
4. Nothing is centered. Nothing has a shadow. Nothing animates on scroll.
5. Every number on the page is counted from `content.json`.

---

## Pass 2 — review against the generic-default list

Worked through the skill's tells. What matched, and what changed:

| Tell | Verdict |
|---|---|
| Cream bg + terracotta accent (≈#D97757) | **Matches, but pinned by the brief.** bone #F1EFE8 and coral #E2705C are the client's existing brand, named in the brief. Not a free axis. Mitigated by refusing the serif display that usually completes that cluster. |
| Monospace for small data labels | **Changed.** The first draft used a mono face for the rail counts and stack chips — and it was easy to justify, since the subject *is* code. But the skill lists it as chrome that appears whatever the subject, and the step-09 brief had already spent it. Dropped the third family entirely; the counts use Inter with `tabular-nums` and tighter tracking instead. |
| Stats strip under the hero | **Cut.** The draft had a 4-cell strip ("10+ years / 14 tools / 5 roles / Cypress Ambassador"). It is the default hero-adjacent move, and the counts are more useful next to the thing they count. They moved into the rail margin, and only where a count actually orients the reader — Experience and Technologies. The other five sections have no meta line rather than a filler one. |
| ALL-CAPS labels / eyebrows | **Changed.** `CONTACT ME` with `tracking-[0.12em]` became "Email Leonel"; the uppercase tracked `ACTUAL` badge became sentence case. No eyebrows anywhere. |
| Single word accented in a headline | Avoided in the hero (the old `I'm` light + name bold split is gone; "I'm" is now its own small line). The `leodvlpr` mark does this, but it is mandated unchanged. |
| Numbered markers (01/02/03) | **Not used,** although work history is genuinely chronological so it would have been defensible. Step-09 already took that route; the logo/monogram slot carries the left marker here instead. |
| SaaS card kit — identical rounded cards, soft shadows, gradients | Avoided. No shadows, no gradients, one card in the whole page, and radius means "actionable" rather than being applied uniformly. |
| Broadsheet: hairlines + zero radius + dense columns | **Partial match, watched.** 1px rules and low radius are a standing house rule. Kept clear of newspaper by using one wide pane rather than dense columns, very large display type, and generous vertical rhythm. |
| `→` on link text, `A · B · C` meta strings, tinted near-black | None used. |
| Fade-and-slide-up on every section | Avoided — no scroll-triggered motion at all, one load moment only. |

Two further changes that came out of the review rather than the tells list:

- **paper-on-coral was failing at 3.1:1.** Every coral-filled hover in the old
  code put white text on coral. Switched to navy on coral (5.3:1), which also
  makes coral+navy a pair that survives the theme flip untouched.
- **The fixed right-hand contact rail is removed.** The new design's whole
  structural idea is a single left spine; a second floating rail on the right
  brackets the page symmetrically and kills the asymmetry. Email and LinkedIn
  are in the hero and again in Contact, so no channel is lost.

---

# Addendum — step-09d: merging Option A's two elements into this base

Three changes, all inside Option B's layout, grid and motion system. Option A's
floating-card hero, its deeper navy `--color-well` and its JetBrains Mono were
all deliberately left behind.

## 1. Hero photo — navy→coral duotone, diagonal corners

**What Option A did:** a grayscale portrait filling its column inside a
`rounded-[1.75rem]` dark-navy card, bleeding to the card's right and bottom
edges. Its "colour handling" was really the dark card the photo sat in.

**What this does instead.** There is no card to sit in here, so the colour had
to move into the photograph. The portrait is now a two-tone image built from
the brand palette with blend modes rather than a processed asset: a coral
ground, the grayscale image over it in `multiply` (whites become coral), and a
navy layer over that in `lighten` (shadows rise to navy). The result ramps navy
→ coral across the tonal range, so his shirt reads navy and the wall behind him
reads coral.

Three reasons it is not a copy:

- **It is a duotone, not a dark card.** A takes a grey photo and darkens the
  surroundings; this tints the photograph itself, which is what makes it the
  largest coral mass on the page and does the work of change 3 at the same time.
- **The corners are diagonal, not uniform.** `--radius-figure 2rem 0 2rem 0` —
  rounded top-left and bottom-right, square on the other two. A's card rounds
  all four equally. The diagonal points along the same axis the load wipe
  travels, so the shape belongs to Option B's motion system rather than reading
  as an imported card. It also keeps the corner grammar honest: squares are
  structure, pills are actions, and the portrait is the page's one *figure*,
  so it gets its own radius rather than borrowing either.
- **The grid interlock is untouched.** The photo still spans every hero row,
  still bleeds above the hero's top padding, and the coral rule still runs
  underneath it and is cut by it.

Motion: unchanged. The photo is revealed by the same wipe front at `--d:420ms`.
It gets no hover state, because it is not interactive and that is the rule
everywhere else on this page.

## 2. Stats band

Placed immediately after the hero, as the second and last element that breaks
the rail/pane grid — the two of them form the hinge before the seam starts at
About. Ported as a concept, kept as thin rules between four cells rather than
four bordered boxes, which would have been the SaaS-card kit.

All four figures are read out of `content.json` at build time, none typed in:

| Shown | Source |
|---|---|
| **10+** years in QA | `profile.summary` — "10+ años de experiencia corporativa en QA" |
| **14** tools & frameworks | count of every entry across `technologies` |
| **5** roles across 4 companies | `experience.length`, and the distinct `company` values in it |
| **2024–2026** Cypress Ambassador | parsed out of the `recognition` entry that mentions Ambassador |

Both regex-derived cells drop out entirely rather than render blank if the
pattern stops matching. Nothing was carried over from Option A that is not
derivable, and nothing invented was carried forward.

Because these counts now live here, the rail `meta` lines that had been showing
"5 roles" and "14 tools" were removed along with the `meta` prop — the same
number in two places is worse than in one.

Motion: the cells take the same `wipe` with delays of 620/680/740/800ms, which
picks up where the hero's last element leaves off, so the front simply carries
on across the band. It is the existing gesture continuing, not a second reveal.
Semantics improved on the way across: A had `<dt>` holding the value and `<dd>`
the label, which is backwards; here `<dt>` is the label and `<dd>` the value,
with `column-reverse` putting the number on top visually.

## 3. Light-mode colour — three moments, and only three

Light mode was carrying coral only in hairlines and small chips. Three places
now take real colour, chosen to be spread across the page's arc rather than
sprinkled per section:

1. **The hero portrait** (top of page) — the duotone above. The single largest
   area of coral on the site, and it arrives in the first viewport.
2. **The stats band** (the fold) — a full-bleed navy slab, which is the
   "considered secondary use of navy". It also solves a contrast problem:
   coral on bone is 2.7:1 and cannot legally carry text, but coral on navy is
   5.3:1 — so putting the band on navy is what lets the numbers be coral at
   all. New token `--color-band`.
3. **Contact** (bottom of page) — the icon circles are now coral *fills* with
   navy glyphs at 3rem rather than 2.5rem outlines, and the labels step up to
   1.25rem. The page closes on colour the way it opens on it. Since the rest
   state is now coral, the hover had to move: it goes to `ink`, the only
   colour that still contrasts in both themes.

Everything between them is unchanged and stays calm: About, Experience,
Projects, Technologies, Recognition and Education still run on ink hairlines
with coral reserved for rules and tick marks.

**Dark mode was left alone.** The only token that forks is `--color-band`,
which is navy in light (a dramatic slab against bone) and `#232246` in dark —
the same subtle step `--color-shade` already uses, because the page there is
already navy and a second navy slab would vanish. The duotone and the contact
circles apply to both themes; they intensify dark rather than rebalancing it.
The two modes are deliberately different moods, not two renderings of one.

**Verified after the changes:** `prefers-reduced-motion: reduce` still lands
the page fully resolved in both themes — 12 animated elements, none left
clipped, no animation running. No horizontal overflow from 320 to 1920px
(the band's widest figure, "2024–2026", is `nowrap` and needed a single-column
fallback below 360px).

---

# Addendum — `design.md`: hero photography, shapes, merged stats

Driven by a visual reference (a dark portfolio hero: a portrait with no frame
dissolving into the ground, thin geometric lines layered through it, orange
accent). Taken as direction, not as a thing to reproduce — the palette, the
light default and the whole rail/pane layout are unchanged.

## Photography — the portrait stops being an image in a box

Four changes, all compositional; the navy→coral duotone from step-09d stays.

- **It leaves the container.** On desktop the figure bleeds from its grid
  column out to the right edge of the viewport:
  `margin-right: calc(-1 * (max(0px, 100vw - var(--shell)) / 2 + var(--gutter)))`.
  Because `100vw` counts the scrollbar this deliberately overshoots by a few
  pixels, and `.hero { overflow: hidden }` clips it — that overflow rule is
  load-bearing, not tidying.
- **The bottom edge dissolves.** A `mask-image` linear-gradient fades the last
  quarter of the figure into the page instead of ending it on an arista. This
  is what removes the "photo in a rectangle" read; he stands in the page.
- **One corner survives.** Only the top-left keeps `--radius-figure`. The
  right edge bleeds, the bottom dissolves, so the shape is defined by what it
  does at each edge rather than by a uniform frame.
- **It adapts rather than shrinks.** ≥900px: tall panel bleeding right.
  600–899px: a landscape 16/9 band, full-bleed both sides, reframed to
  `center 20%` — at 768px a 4/3 crop was 576px tall and pushed the role and
  the buttons off screen. <600px: full-bleed 4/3, and the dissolve is pulled
  back to 88% because the tighter crop meant a 74% fade ate his arms.

## Background shapes — Option A's idea, given a job

Option A had six 1px rounded rectangles scattered down the whole page: real
background decoration that knew nothing about the composition. Dropping them
back in would have been exactly what the brief ruled out.

Reinterpreted to **two**, hero-only, and they are not new shapes at all —
each is the **outline of the portrait itself**, same width, height, radius and
mask, stepped down and to the left (`-2.75rem / 1.75rem` and
`-5.5rem / 3.5rem`, at ink 14% and coral 28%). They share the photo's grid
placement and margins in the same CSS declaration, so they cannot drift out of
register if the hero geometry changes.

What they buy: depth, because the portrait covers the part that overlaps and
only the stepped corners and left edges emerge; and direction, because the
stagger points back toward the headline and ties the two halves together
across the gap that used to be dead space. The coral rule crosses all three.
A first attempt used free-floating rotated rectangles instead — they read as
blobs parked in the whitespace, which is the failure mode the brief named, so
they were cut. Hidden below 900px, where a single column leaves no gap for
them to bridge.

## Stats — Option A's structure, Option B's accent

Option A's layout taken as-is: on the page ground, no slab, hairline rules
top and bottom, four cells divided by 1px verticals, two columns on mobile.
From Option B, one thing only: **the numbers are coral.** The dark navy band
is gone, and with it the `--color-band` / `--color-band-ink` tokens.

**Contrast, stated plainly:** coral on bone measures **2.7:1**. Large bold
text needs 3:1, so the coral numerals are marginally under in light mode (in
dark, on navy, they are 5.3:1 and pass comfortably). This is a deliberate
instruction, so it ships as asked, mitigated by never letting coral carry the
meaning alone — every figure sits directly above its label in ink at 65%. If
it should pass outright, the one-line fix is a `--color-coral-deep` used only
for text on bone; it would not change any other coral on the page.

Light mode keeps three colour moments: the portrait, the coral numerals, and
the Contact fills.

## Follow-up — three corrections after review

Client feedback on the hero, all three applied:

1. **The bottom fade is gone.** The `mask-image` dissolve read as the image
   failing rather than as a treatment. The figure now has a clean edge, and
   the diagonal `--radius-figure` corners come back on all breakpoints.
2. **The tint is much lighter.** The two-layer `multiply` + `lighten` duotone
   flattened the photograph's tonal range into a flat coral field. Replaced
   with a single coral layer in `mix-blend-mode: color` at `opacity: .3`,
   which takes the hue but keeps the original luminosity — the highlights
   stay highlights. Intensity is now one number to turn.
3. **The portrait is back inside the layout.** The bleed to the right
   viewport edge broke the page's vertical alignment. Its right edge now
   lands on the same line as the stats, every section pane and the footer;
   mobile sits inside the gutter too, for the same reason. The echoes were
   tightened to match the smaller gap.

Language pass: all user-facing copy is English — `location`, `summary`, the
"Current" badge, both Technologies category labels, the image `alt`, both
`aria-label`s, `<html lang>` and `og:locale`. Source comments stay Spanish per
repo convention; `Escuela Da Vinci` and `Centro Gráfico de Tecnología` stay as
written because they are the institutions' real names.
