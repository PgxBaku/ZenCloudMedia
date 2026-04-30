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
- `src/app/layout.tsx` - root metadata and layout
- `src/app/globals.css` - global theme styles

## Checks

```bash
npm run lint
npm run build
```

## Deploy

For the standard check-in and Vercel production deploy flow, run:

```bash
python scripts/checkin_deploy_vercel.py -m "Describe the change"
```

The helper runs `npm run lint`, `npm run build`, stages changes, commits, pushes the current branch to `origin`, and runs `npx vercel deploy --prod` using the local Git/Vercel CLI sessions. Use `--preview` for a preview deployment, `--no-deploy` to stop after push, or `--dry-run` to print the commands.

Push this repo to GitHub, then import it into Vercel as a Next.js project.

Suggested Vercel settings:

- Framework preset: `Next.js`
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: leave default
