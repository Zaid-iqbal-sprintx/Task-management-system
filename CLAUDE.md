@AGENTS.md

# Git rules (MANDATORY)

- **NEVER run `git commit`.** Do not create commits of any kind (including merge
  commits or `git commit --amend`). Make file changes only and leave them in the
  working tree. The user reviews and commits everything themselves.
- **NEVER push to any remote.** Do not run `git push` under any circumstance —
  not a normal push, and never a force push (`git push --force` /
  `--force-with-lease`).
- **NEVER rewrite history** (no `git rebase`, no `git reset` on pushed commits
  unless the user explicitly asks).
- Read-only git commands (`status`, `log`, `diff`, `fetch`) are fine.
