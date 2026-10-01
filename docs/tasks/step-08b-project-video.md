# Step 8b — Embed Project Video in the Projects Section

## Context

The Projects section (src/components/Projects.astro) already shows one project
card for the Saucedemo Playwright Framework, linking out to the GitHub repo. A
compressed video demo is now at public/videos/test-run.mp4 and should be viewable
directly on the portfolio, without leaving the site.

## Build

1. Add a `video` field to the matching project entry in src/data/content.json:
   "video": "videos/test-run.mp4"

2. Update the project card in Projects.astro:
   - Add a poster/thumbnail state by default (do NOT autoplay or eagerly load the
     video on page load — that hurts initial page performance).
   - Add a small "Watch demo" button/label on the card. On click, reveal an inline
     HTML5 <video> element with `controls`, sourced via
     `${import.meta.env.BASE_URL}${project.video}` (same BASE_URL pattern already
     used for images/favicon elsewhere in this project — check Hero.astro for the
     exact pattern and mirror it).
   - Use `preload="none"` on the <video> tag so the browser doesn't fetch it until
     the user actually plays it.
   - Only render this video trigger for project entries that actually have a
     `video` field — don't break the card layout for future projects without one.

3. Keep the existing "View on GitHub" link untouched — the video is an addition to
   the card, not a replacement for the repo link.

## Constraints

- No video autoplay under any circumstance.
- Don't add any external video library/player — plain HTML5 <video> is enough for
  one file.
- Run npm run build and confirm the video path resolves correctly under the
  configured base path.

## On completion

Confirm: video plays correctly when triggered, initial page load doesn't fetch the
video file (verify via Network tab — 0 bytes for the video until clicked), and
build succeeds.
