# ZenCloudMedia

Standalone Next.js website prepared for GitHub and Vercel deployment.

Contact: `zen1cloud1@gmail.com`

## Getting Started

Install dependencies, then run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Main files:

- `src/app/page.tsx` - homepage
- `src/app/pgx/resume/page.tsx` - direct PGX resume route
- `src/app/pgx/resume/ats/page.tsx` - plain ATS-friendly resume route
- `src/app/pgx/resume/text/route.ts` - text-only resume endpoint for LLM and crawler ingestion
- `src/app/pgx/resume/story/page.tsx` - animated resume story route
- `src/app/resume/components/MobileResumeStory.tsx` - mobile milestone slideshow for the resume story, reusing the shared resume bird art
- `src/app/resume/page.tsx` - compatibility redirect to `/pgx/resume`
- `public/llms.txt` - AI crawler map pointing to the preferred resume surfaces
- `scripts/validate-resume-machine-readable.mjs` - machine-readable resume route validator
- `src/app/layout.tsx` - root metadata and layout
- `src/app/globals.css` - global theme styles

## Checks

```bash
npm run lint
npm run build
npm run validate:resume
```

## Deploy

For the standard check-in and Vercel production deploy flow, run:

```bash
python scripts/checkin_deploy_vercel.py -m "Describe the change"
```

The helper runs `npm run lint`, `npm run build`, stages changes, commits, pushes the current branch to `origin`, and runs `npx vercel deploy --prod` using the local Git/Vercel CLI sessions. Use `--preview` for a preview deployment, `--no-deploy` to stop after push, or `--dry-run` to print the commands.

When the repo has unrelated local changes, pass explicit `--paths` so the helper only stages the files for the current task. For example:

```bash
python scripts/checkin_deploy_vercel.py -m "Describe the change" --paths src/app/page.tsx src/app/sitemap.ts public/ads.txt
```

Push this repo to GitHub, then import it into Vercel as a Next.js project.

Suggested Vercel settings:

- Framework preset: `Next.js`
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: leave default
