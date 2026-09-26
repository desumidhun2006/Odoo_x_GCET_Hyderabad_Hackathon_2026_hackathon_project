# Odoo x GCET Hyderabad Hackathon 2026 Hackathon Project

## Project Workflow Instructions

These are the standing instructions given for this repo. They must be followed for every task from now on.

### 1. Commit and push after every task
- After completing every task, commit the changes and push them to the GitHub repo.
- Repo: https://github.com/desumidhun2006/Odoo_x_GCET_Hyderabad_Hackathon_2026_hackathon_project
- Branch: `main` tracking `origin/main`
- Standard flow:
  ```bash
  git add -A
  git commit -m "<Type>: <detail>"
  git push
  ```
- Verify with `git status` and `git log --oneline -5` — working tree must be clean and local must be up to date with `origin/main`.

### 2. Track progress in `journey.md` in extreme detail
- After the commit + push, update `journey.md` to track the progress of the project and the commits done.
- Each `Task N` entry must include:
  - Date, verbatim request, interpretation
  - Step-by-step actions, exact commands executed
  - Verification output, files changed, outcome
  - Associated commit hash(es)
- Each `Commit N` entry must include:
  - Short + full hash, message, author, date (ISO)
  - Parent, branch, push range (e.g. `d5c0e5c..d2d31ba main -> main`)
  - Files changed + stat summary, how it was created, push output
  - Related task + purpose
- Also update `Current State` and `Next Steps` sections.
- To avoid infinite recursion: each `journey.md` sync documents the *previous* commit(s), not itself. The current sync commit details get backfilled at the start of the next task.

### 3. Commit and push the `journey.md` update itself
- The `journey.md` update is part of the task and must also be committed and pushed:
  ```bash
  git add journey.md
  git commit -m "Docs: update journey.md ..."
  git push
  ```
- GitHub must always reflect the latest journey.

### 4. This README documents the workflow
- This README file itself stores these commit / push / `journey.md` instructions, per explicit request.
- If workflow instructions change in future, update this README in the same task, commit + push it, then record it in `journey.md`.

See `journey.md` for full chronological task log and commit history.
