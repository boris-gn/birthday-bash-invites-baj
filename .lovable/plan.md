## Overview

A single-page, cinematic birthday invitation for **Սամվել / Samvel**, turning **35** on **29 July 2026**. Visual language mirrors bfwed.life: full-bleed black-and-white hero photo, tall elegant serif display type, quiet gold accent, and a live countdown. Language toggle (Հայ / Eng) at the top-left.

## Sections (single scroll)

1. **Hero** — full-viewport B&W portrait (uploaded photo) with dark gradient overlay
   - Small caps eyebrow: "Սիրով հրավիրում եմ իմ ծննդյան" / "You're warmly invited"
   - Display name: "Սամվել" / "Samvel" — huge serif
   - Subtitle: "35 տարի" / "Turns 35"
   - Date line: "ՀՈՒԼԻՍԻ 29, 2026" / "JULY 29, 2026"
   - Live countdown (Days / Hours / Minutes / Seconds) to 2026-07-29 17:30 Yerevan time
   - Scroll cue chevron
2. **Intro** — short warm invitation paragraph, two small stacked photo cards (portrait + optional accent card)
3. **Event details card** — single event:
   - Խնջույք / Celebration · 17:30
   - Աֆրիկյանս Ռեստորան / Afrikyans Restaurant
   - Ջրվեժ 16
   - "Ինչպես հասնել" / "Get directions" → Google Maps link
4. **RSVP** — "Հաստատել մասնակցությունը" / "Confirm attendance"
   - Two buttons opening WhatsApp (`https://wa.me/37455099058?text=...`) with prefilled message:
     - "Այո, կգամ 🎉" / "Yes, I'll be there 🎉"
     - "Ցավոք, չեմ կարող" / "Sorry, I can't make it"
5. **Footer** — small monogram "S" + year

## Design

- **Palette (Noir & Gold)**: near-black background `#0d0d0d`, off-white text `#f5f3ee`, warm gold accent `#c9a84c`, soft muted `#8a8578`. All wired as semantic tokens in `src/styles.css` (oklch).
- **Typography** (loaded via `<link>` in `__root.tsx`):
  - Display: **Cormorant Garamond** (tall serif, close to reference)
  - Body: **Inter Tight** small-caps for eyebrows, regular for paragraphs
- **Motion**: framer-motion fade+rise on section enter; hero text staggered reveal; subtle Ken Burns zoom on hero image.
- Fully responsive, mobile-first.

## Technical

- New route: keep `src/routes/index.tsx` as the invitation page (replace placeholder).
- Upload the friend's photo via `lovable-assets` (from `/mnt/user-uploads/...`) → `src/assets/samvel.jpg.asset.json`, imported into the hero.
- Add fonts as `<link>` tags in `__root.tsx` head (not `@import` in CSS, per Tailwind v4 rule).
- Update `__root.tsx` head metadata: title "Սամվելի 35-ամյակը · 29.07.2026", matching description, og:title/description, twitter:card.
- Add semantic color tokens + gradient/shadow tokens to `src/styles.css`.
- Countdown: client-side `useEffect` interval; target `2026-07-29T17:30:00+04:00`.
- Language state: local `useState<'hy' | 'en'>` with a small strings dictionary; toggle top-left like reference.
- RSVP: two `<a href="https://wa.me/37455099058?text=...">` buttons — no backend, no Lovable Cloud needed.
- No new packages beyond `framer-motion` (add via `bun add framer-motion`).

## Out of scope

- No database, no auth, no admin.
- No video background (reference uses one; we'll use the still portrait with a subtle zoom instead).
