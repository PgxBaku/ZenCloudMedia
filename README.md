# ZenCloudMedia

Standalone Next.js website prepared for GitHub and Vercel deployment.

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

Push this repo to GitHub, then import it into Vercel as a Next.js project.

Suggested Vercel settings:

- Framework preset: `Next.js`
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: leave default
