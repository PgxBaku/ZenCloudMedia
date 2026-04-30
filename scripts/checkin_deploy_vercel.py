#!/usr/bin/env python3
"""Run the standard ZenCloudMedia check-in and Vercel deploy flow.

This script intentionally uses the local machine's existing Git and Vercel CLI
sessions. It does not read or store GitHub/Vercel tokens.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]


def resolve_command(command: list[str]) -> list[str]:
    executable = command[0]
    if sys.platform == "win32" and executable in {"npm", "npx"}:
        executable = f"{executable}.cmd"
    resolved = shutil.which(executable)
    if resolved is None:
        raise FileNotFoundError(
            f"Could not find `{executable}` on PATH. Install it or run from a shell where it is available."
        )
    return [resolved, *command[1:]]


def run(command: list[str], *, check: bool = True, dry_run: bool = False) -> subprocess.CompletedProcess[str]:
    printable = " ".join(command)
    print(f"\n$ {printable}")
    if dry_run:
        return subprocess.CompletedProcess(command, 0, "", "")
    command = resolve_command(command)
    try:
        return subprocess.run(command, cwd=ROOT, text=True, check=check)
    except subprocess.CalledProcessError as exc:
        if printable == "npm run build":
            print(
                "\nBuild failed. If you see an EPERM/unlink error under `.next`, "
                "stop any running Next dev server or watcher and run the script again.",
                file=sys.stderr,
            )
        raise SystemExit(exc.returncode) from exc


def capture(command: list[str], *, dry_run: bool = False) -> str:
    printable = " ".join(command)
    print(f"\n$ {printable}")
    if dry_run:
        return ""
    command = resolve_command(command)
    result = subprocess.run(
        command,
        cwd=ROOT,
        text=True,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if result.stderr.strip():
        print(result.stderr.strip())
    return result.stdout.strip()


def has_changes(*, staged: bool = False, dry_run: bool = False) -> bool:
    args = ["git", "diff", "--cached", "--quiet"] if staged else ["git", "diff", "--quiet"]
    if dry_run:
        return True
    return subprocess.run(args, cwd=ROOT).returncode != 0


def has_untracked(dry_run: bool = False) -> bool:
    if dry_run:
        return True
    output = subprocess.run(
        resolve_command(["git", "ls-files", "--others", "--exclude-standard"]),
        cwd=ROOT,
        text=True,
        check=True,
        stdout=subprocess.PIPE,
    ).stdout.strip()
    return bool(output)


def parse_args(argv: Iterable[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Lint, build, commit, push, and deploy ZenCloudMedia to Vercel."
    )
    parser.add_argument(
        "-m",
        "--message",
        "--m",
        required=True,
        help="Git commit message to use when there are staged changes.",
    )
    parser.add_argument(
        "--paths",
        nargs="*",
        default=["."],
        help="Paths to stage before committing. Defaults to the whole repo.",
    )
    parser.add_argument("--remote", default="origin", help="Git remote to push. Defaults to origin.")
    parser.add_argument(
        "--branch",
        default=None,
        help="Git branch to push. Defaults to the current branch.",
    )
    parser.add_argument("--skip-checks", action="store_true", help="Skip npm lint/build checks.")
    parser.add_argument("--no-push", action="store_true", help="Commit but do not push.")
    parser.add_argument("--no-deploy", action="store_true", help="Do not run Vercel production deploy.")
    parser.add_argument("--preview", action="store_true", help="Deploy a Vercel preview instead of production.")
    parser.add_argument("--dry-run", action="store_true", help="Print commands without executing them.")
    return parser.parse_args(list(argv))


def main(argv: Iterable[str]) -> int:
    args = parse_args(argv)

    if not (ROOT / "package.json").exists():
        print(f"Expected package.json under {ROOT}; aborting.", file=sys.stderr)
        return 2

    branch = args.branch or ("main" if args.dry_run else capture(["git", "branch", "--show-current"]))
    if not branch and not args.dry_run:
        print("Could not determine current Git branch; pass --branch.", file=sys.stderr)
        return 2

    print(f"Repository: {ROOT}")
    print(f"Target branch: {branch or '<dry-run-branch>'}")

    if not args.skip_checks:
        run(["npm", "run", "lint"], dry_run=args.dry_run)
        run(["npm", "run", "build"], dry_run=args.dry_run)

    dirty_before_stage = has_changes(dry_run=args.dry_run) or has_untracked(dry_run=args.dry_run)
    if dirty_before_stage:
        run(["git", "add", "--", *args.paths], dry_run=args.dry_run)

    if has_changes(staged=True, dry_run=args.dry_run):
        run(["git", "commit", "-m", args.message], dry_run=args.dry_run)
    else:
        print("\nNo staged changes to commit.")

    if not args.no_push:
        run(["git", "push", args.remote, branch], dry_run=args.dry_run)

    if not args.no_deploy:
        deploy_command = ["npx", "vercel", "deploy"]
        if not args.preview:
            deploy_command.append("--prod")
        run(deploy_command, dry_run=args.dry_run)

    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
