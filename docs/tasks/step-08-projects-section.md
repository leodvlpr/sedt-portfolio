# Step 8 — Wire Up the Projects Section

## Context

The portfolio site (Astro + Tailwind) already has a "Projects" nav link pointing to
a "Coming soon" placeholder. src/data/content.json now has a real `projects` array
with one entry (Saucedemo Playwright Framework). This step replaces the placeholder
with a real, styled Projects section.

## Build

1. Create `src/components/Projects.astro` that:
   - Reads `content.json.projects`
   - Renders a section heading "Projects" following the same visual language
     already used for other section headings (bold navy title + coral horizontal
     line beside it — same pattern as the "About" section).
   - Renders each project as a card: name, description, stack shown as small
     chips/tags (reuse the same chip style as the TechGrid component if one
     exists), and the whole card links out to `url` (target="_blank",
     rel="noopener noreferrer").
   - If `content.json.projects` has only one entry, the layout should still look
     intentional (not a lonely card floating in a wide empty grid) — use your
     judgment on a max-width single-column or centered layout for a 1-item state,
     since more projects will be added later.

2. Update `index.astro` (or wherever sections are assembled) to include
   `<Projects />` in the page, positioned after Experience and before TechGrid —
   confirm the current section order first and slot it in a place that reads
   naturally.

3. Update the nav "Projects" link: it currently points to a placeholder route or
   anchor with "Coming soon" — change it to anchor-link directly to the new
   Projects section on the same page (`#projects`), matching how "About me" and
   "Contact" already navigate (check their current implementation and mirror it
   exactly).

4. Remove the "Coming soon" placeholder entirely once the real section is wired in.

## Constraints

- Do not modify content.json beyond what's already provided above.
- Keep the same design tokens already established (navy #1B1A3B, coral #E2705C,
  same heading style, same border/radius conventions as other sections).
- No animations yet — this project is still in the static design phase.
- Run `npm run build` when done and confirm it succeeds.

## On completion

Give a summary: files created/modified, and confirm the nav "Projects" link now
scrolls to a real section instead of a placeholder.
