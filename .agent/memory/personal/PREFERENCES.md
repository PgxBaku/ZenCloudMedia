# Personal Preferences

## Who I am
Working across Claude Code, Codex, and Gemini on Windows 11. Primary project
is ZenCloudMedia — a Next.js short-form news reels site deployed on Vercel.
Interested in AI/ML tooling, agentic systems, and RL training pipelines.

## Code style
- TypeScript / Next.js App Router (v15+) with Tailwind CSS v4
- Functional patterns preferred; no classes unless the framework requires it
- No inline comments unless the WHY is non-obvious
- No trailing summaries — let the diff speak

## Workflow
- Deploy via `python scripts/checkin_deploy_vercel.py -m "message"` — this handles lint, build, commit, push, and Vercel prod deploy in one shot
- Use `--preview`, `--no-deploy`, `--skip-checks`, or `--dry-run` to narrow the flow
- Git user: PgxBaku / bakuretsu@gmail.com
- Platform: Windows 11, PowerShell + bash (Git Bash available)
- Python is `python` on this machine (not `python3`)

## Constraints
- Primary stack: TypeScript, Next.js, Tailwind CSS v4, Python
- Deployment: Vercel (production), via CLI
- No paid external services unless explicitly approved
- No Docker — local execution only

## Communication
- Be direct and concise — skip pleasantries and trailing summaries
- Surface tradeoffs briefly before acting; don't hide them
- One sentence updates while working; longer only when something surprising
- Prefer action over explanation — implement first, explain if asked
