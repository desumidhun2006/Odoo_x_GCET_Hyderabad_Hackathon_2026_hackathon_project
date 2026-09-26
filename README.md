# Odoo x GCET Hyderabad Hackathon 2026 Hackathon Project

## Project Workflow Instructions

These are the standing instructions given for this repo. They must be followed for every task from now on.

### 1. Commit and push after every task
- After completing every task, commit the changes and push them to the GitHub repo.
- Repo: https://github.com/desumidhun2006/Odoo_x_GCET_Hyderabad_Hackathon_2026_hackathon_project
- Branch: `features` tracking `origin/features`
- Standard flow:
  ```bash
  git add -A
  git commit -m "<Type>: <detail>"
  git push
  ```
- Verify with `git status` and `git log --oneline -5` — working tree must be clean and local must be up to date with `origin/features`.

### 2. Track progress in `journey.md` briefly
- After the commit + push, update `journey.md` with one paragraph per task plus its corresponding GitHub commit ID and commit message.

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
