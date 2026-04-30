<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes â€” APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
## Project Workflow
- Use `python scripts/checkin_deploy_vercel.py -m "Describe the change"` for the standard lint, build, commit, push, and Vercel production deploy flow.
- The helper uses existing local Git and Vercel CLI authentication; do not add tokens or secrets to the script.
- Use `--preview`, `--no-deploy`, `--skip-checks`, or `--dry-run` when intentionally narrowing the flow.
