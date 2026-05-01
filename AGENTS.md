# AGENTS.md — Codex adapter for agentic-stack

Codex reads `AGENTS.md` before doing any work. This file points it at
the portable brain in `.agent/`.

> **Python invocation**: examples below use `python3`. On stock Windows
> only `python` is on PATH; use whichever resolves on your system.

## Startup (read in order)
1. `.agent/AGENTS.md` — the map
2. `.agent/memory/personal/PREFERENCES.md` — user conventions
3. `.agent/memory/semantic/LESSONS.md` — distilled lessons
4. `.agent/protocols/permissions.md` — hard rules

## Skills
Codex scans `.agents/skills/` for repository-scoped skills. The install
script syncs `.agents/skills` from `.agent/skills` so the portable brain
remains the one source of truth. Load a full `SKILL.md` only when its
triggers match the task. Edit skills in `.agent/skills/` — `.agents/skills/`
is a mirror.

## Recall before non-trivial tasks
For deploy / ship / migration / schema / timestamp / date / failing test /
debug / refactor, FIRST run:

```bash
python .agent/tools/recall.py "<description>"
```

Surface results in a `Consulted lessons before acting:` block and follow them.

## Memory discipline
- Update `.agent/memory/working/WORKSPACE.md` as you work.
- After significant actions, run `python .agent/tools/memory_reflect.py <skill> <action> <outcome>`.
- Never delete memory entries; archive only.
- Quick state: `python .agent/tools/show.py`.
- Teach a rule: `python .agent/tools/learn.py "<rule>" --rationale "<why>"`.

## Hard rules
- No force push to `main`, `production`, `staging`.
- No modification of `.agent/protocols/permissions.md`.

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes â€” APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
## Project Workflow
- Use `python scripts/checkin_deploy_vercel.py -m "Describe the change"` for the standard lint, build, commit, push, and Vercel production deploy flow.
- The helper uses existing local Git and Vercel CLI authentication; do not add tokens or secrets to the script.
- Use `--preview`, `--no-deploy`, `--skip-checks`, or `--dry-run` when intentionally narrowing the flow.
