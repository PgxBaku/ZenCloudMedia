# Resume Variants — Design Spec

**Date:** 2026-06-04
**Session:** ba8402
**Status:** Pending implementation

## Purpose

Allow Paul to create tailored resume variants for specific job applications. Each variant has different role bullet points, skill emphasis, targeted headline, and metadata — rendered as the same PDF-style paper resume but without the interactive story/journey link. Variants live at clean, shareable URLs like `/pgx/resume/devManager_v1`.

---

## Routing

### New dynamic route

```
src/app/pgx/resume/[variant]/page.tsx
```

One page file serves all variants via a dynamic `[variant]` slug. The page is a server component that:

1. Looks up the slug against the variant registry
2. Dynamically imports the variant data
3. Renders `PaperResume` with `variantMeta` prop
4. Sets `resume_variant` cookie
5. 404s if the slug is not in the registry

### URL paths (no changes to existing)

| Path | Behavior |
|---|---|
| `/pgx/resume` | Existing main resume (unchanged, adds cookie check) |
| `/pgx/resume/story` | Existing story (unchanged) |
| `/pgx/resume/ats` | Existing ATS page (unchanged) |
| `/pgx/resume/text` | Existing text API route (unchanged) |
| `/pgx/resume/[variant]` | **New** — tailored resume |
| `/pgx/resume/[variant]/text` | **New** — tailored plain-text ATS route |

---

## Data Architecture

```
src/app/resume/data/
  resume.ts                  ← existing base data (unchanged)
  machine-readable.ts        ← existing derived data (unchanged)
  variants/
    index.ts                 ← variant registry
    devManager_v1.ts         ← first tailored variant
```

### Variant data file (`variants/devManager_v1.ts`)

Exports the same shape as `resume.ts` plus variant metadata:

```ts
export const VARIANT_META = {
  slug: "devManager_v1",
  headline: "Software Development Manager | DevEx AI Tools | Platform Automation",
  description: "Tailored resume for Figma DevEx AI Tools engineering manager role...",
  targetRole: "Engineering Manager, DevEx AI Tools",
  targetCompany: "Figma",
}

export const RESUME_ROLES = [
  // ... tailored bullets per role
]

export const SKILL_GROUPS = [
  // ... reordered/emphasized skill groups
]

// Re-exports from base for unchanged data
export { METRICS } from "../resume"
export { PROJECTS } from "../resume"
```

### Registry (`variants/index.ts`)

Maps slug to lazy import:

```ts
export const VARIANTS: Record<string, () => Promise<VariantModule>> = {
  devManager_v1: () => import("./devManager_v1"),
}
```

### Adding a new variant later

1. Create `variants/newJob_v2.ts`
2. Add one line to `variants/index.ts`
3. Done — no route or component changes

---

## Cookie Gate

### Cookie set (variant page)

On visiting `/pgx/resume/[variant]`, the page sets:

```
resume_variant = <slug>
  Path: /
  HttpOnly: false (readable by client if needed)
  Max-Age: 30 days
  SameSite: Lax
```

### Cookie check (existing pages)

`/pgx/resume/page.tsx` and `/resume/page.tsx` check for `resume_variant` cookie before rendering. If present, `redirect()` to that variant:

```ts
const variant = cookies().get("resume_variant")?.value
if (variant) redirect(`/pgx/resume/${variant}`)
```

### Behavior

- Soft gate only — clearing cookies removes the pin
- `/pgx/resume/story` and `/pgx/resume/ats` are NOT gated
- `next.config.ts` 308 redirect from `/resume` → `/pgx/resume` fires first, then the page-level cookie check runs

---

## Component Change

### `PaperResume.tsx` — one optional prop

```ts
interface PaperResumeProps {
  variantMeta?: {
    headline: string
    slug: string
  }
}
```

When `variantMeta` is present:
- "View Your Journey →" link is hidden
- Name/title section uses `variantMeta.headline` instead of the default `PROFILE.headline`

When absent: exact existing behavior (backward compatible). All existing pages pass no prop.

---

## ATS Text Route

```
src/app/pgx/resume/[variant]/text/route.ts
```

Reuses `buildResumeText()` logic but accepts variant data instead of the base `RESUME_ROLES`/`SKILL_GROUPS`. Returns:

- `Content-Type: text/plain; charset=utf-8`
- 1-hour `Cache-Control` with `stale-while-revalidate`

---

## SEO and Metadata

Each variant page:

- **Title:** `Paul Xiong — {variant headline}`
- **Canonical URL:** `https://zencloudmedia.vercel.app/pgx/resume/{slug}`
- **Indexing:** `noindex, nofollow` (shared by direct link, not surfaced in search)
- **OG/Twitter:** Variant headline and description

---

## File Manifest

| File | Action | Description |
|---|---|---|
| `src/app/pgx/resume/[variant]/page.tsx` | Create | Dynamic route, cookie set, renders PaperResume |
| `src/app/pgx/resume/[variant]/text/route.ts` | Create | Plain-text ATS route per variant |
| `src/app/resume/data/variants/index.ts` | Create | Variant registry |
| `src/app/resume/data/variants/devManager_v1.ts` | Create | First tailored variant (Figma DevEx Manager) |
| `src/app/resume/components/PaperResume.tsx` | Edit | Add optional `variantMeta` prop |
| `src/app/pgx/resume/page.tsx` | Edit | Cookie check → redirect to variant |
| `src/app/resume/page.tsx` | Edit | Cookie check → redirect to variant |

---

## Not in Scope

- Variant-specific interactive stories/animations
- Admin UI for creating variants (manual data files only)
- Variant analytics or tracking
