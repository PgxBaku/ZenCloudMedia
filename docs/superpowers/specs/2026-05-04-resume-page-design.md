# Resume Page Design Spec
**Date:** 2026-05-04  
**Route:** `/resume` within ZenCloudMedia (zencloudweb.com/resume)  
**Stack:** Next.js 16, React 19, Tailwind v4, TypeScript  

---

## Overview

A cinematic, story-driven resume page for Paul P. Xiong. The experience unfolds in two acts:

1. **Act 1 — The Journey:** An illustrated horizontal terrain landscape with career milestones animating in sequentially, then zooming out to reveal the full path.
2. **Act 2 — The Resume:** The page scrolls down to reveal a clean, paper-style resume document with full CV detail.

The goal is for a visitor to *feel* the arc of the career before reading the details — they understand who Paul is emotionally before they engage intellectually.

---

## Act 1: Terrain Journey

### Layout
- Full-viewport-height (`100vh`) horizontal landscape scene
- Sky gradient: blue-to-green (dawn/horizon feel)
- Three parallax SVG layers: far mountains, mid hills, near terrain
- Decorative trees, clouds, and a sun — static but layered for depth
- A horizontal dashed path line runs across the terrain connecting all milestones

### Animation Sequence (auto-plays on page load)
All timing is orchestrated with Framer Motion. No user interaction required.

All durations are driven by a single config object in `src/app/resume/data/resume.ts` so they can be tuned without touching component code:

```ts
export const ANIMATION_CONFIG = {
  heroFadeIn: 0,          // seconds: hero name appears
  pathStartDelay: 0.4,    // seconds: path line begins drawing
  milestoneInterval: 0.9, // seconds: gap between each flag rising
  zoomOutDelay: 0.9,      // seconds after last flag before zoom-out
  zoomOutDuration: 1.8,   // seconds: zoom transition
  resumeRevealDelay: 1.4, // seconds after zoom-out before scroll+reveal
};
```

| Step | Default timing | Action |
|------|---------------|--------|
| 0s | `heroFadeIn` | Hero name fades in on the left |
| 0.4s | `pathStartDelay` | Path line begins drawing left-to-right |
| 0.5s | `pathStartDelay + 0.1` | Milestone 1 (2017) rises up |
| 1.4s | `+ milestoneInterval` | Milestone 2 (2020) rises up |
| 2.3s | `+ milestoneInterval` | Milestone 3 (2022) rises up |
| 3.2s | `+ milestoneInterval` | Milestone 4 (2025 peak) rises up |
| 4.1s | `+ milestoneInterval` | Zen Cloud marker appears above 2025 flag |
| 5.0s | `+ zoomOutDelay` | Destination star glows in; zoom-out begins |
| 6.8s | `+ zoomOutDuration` | Zoom complete |
| 8.2s | `+ resumeRevealDelay` | Page scrolls; paper resume fades in |

### Milestone Flags (5 total)
Each flag rises from the terrain floor. Hovering reveals a detail card above.

| Flag | Year | Role | Anchor metric |
|------|------|------|--------------|
| 1 | 2017 | Senior Software Engineer | .NET Middle-Tier Framework |
| 2 | 2020 | Solutions Architect | 90 namespaces mapped for CloudHub |
| 3 | 2022 | Lead Architect & Developer | BizTalk sunset · 100+ integrations |
| 4 | 2025 | Software Dev Manager & API Manager | 50%+ Time-to-Production · $2M budget |
| ★ | Side project | Zen Cloud Media | AI-automated video pipeline |

Milestone 4 (peak) has a glowing purple/blue gradient flag — visually the highest point.  
The "Next Summit" destination marker shows the target role direction (not a past role): **Engineering / Dev Manager with deep AI capability** — not an individual-contributor AI role.

### Hover Cards
Each flag has a card that appears on hover (opacity + translateY transition):
- Year range
- Role title
- Company
- 3–5 skill tags
- One hero metric line

### Progress Bar
Fixed header bar shows progress from `2017 → PRESENT` with a fill animation synchronized to the sequence.

### Zoom-out
After all flags are visible, the terrain `div` scales down uniformly (`transform: scale(vw/2600)`, transform-origin: left center) over 1.8s with a cubic-bezier ease. The full journey is visible in one frame.

---

## Act 2: Paper Resume

### Reveal
After the zoom-out completes, the page auto-scrolls to the paper section. The paper fades in with a `translateY(40px) → translateY(0)` Framer Motion transition.

### Paper Layout
White card, max-width 820px, centered, with drop shadow (`box-shadow`). Two-column body.

**Header band** (deep blue gradient):
- Name: Paul P. Xiong (light/bold weight contrast)
- Title: Strategic Software Dev Manager & Solutions Architect
- Contact: Location · Email · Phone · URL

**Metrics band** (4 columns):
- 50%+ Time-to-Prod Gain
- 90 Core Processes
- 10+ Engineers Led
- $2M Annual Budget

**Body — Main column:**
- Professional Summary paragraph
- Experience entries (4 roles, newest first)
  - Role title + date range
  - Company name (colored)
  - Bullet points (3–4 per role)

**Body — Sidebar:**
- Skills (grouped: Integration & Cloud / AI & Engineering / Leadership)
- Projects (Zen Cloud Media, 7pace ADO dashboards)
- Education (University of St. Thomas, international study)
- Target Roles: Engineering / Dev Manager with AI capabilities (no individual-contributor AI roles; no compensation range)

**Footer strip:**
- Left: location + visa status
- Right: `zencloudweb.com/resume`

---

## Component Structure

```
src/app/resume/
├── page.tsx                  # Page shell, imports scene + paper
├── components/
│   ├── TerrainScene.tsx      # Full-viewport animated landscape
│   ├── MilestoneFlag.tsx     # Individual flag + hover card
│   ├── PathLine.tsx          # Animated SVG dashed path
│   ├── PaperResume.tsx       # Paper document component
│   └── ResumeHeader.tsx      # Fixed progress bar + name
└── data/
    └── resume.ts             # Typed resume data (roles, skills, metrics)
```

---

## Dependencies to Add

| Package | Purpose |
|---------|---------|
| `framer-motion` | All animations — path draw, flag rises, zoom, fade-in |

No Remotion needed — all animations are interactive Framer Motion sequences. Remotion is available if a video intro is added later.

---

## Responsive Behavior

- **Desktop (≥1024px):** Full terrain experience as designed
- **Tablet (768–1023px):** Terrain scales down; paper resume remains full-width
- **Mobile (<768px):** Terrain scene replaced with a simple animated timeline (vertical); paper resume stacks to single column

---

## Data Source

Resume data lives in `src/app/resume/data/resume.ts` — a typed TypeScript object mirroring the CV from the ADO wiki (page 9). No API call at runtime; data is static and updated manually when the CV changes.

---

## Constraints

- No force-push to `main`
- Page must pass Next.js build (`next build`) before deploying to Vercel
- No new Supabase tables — this is a static page
- `framer-motion` is the only new dependency
