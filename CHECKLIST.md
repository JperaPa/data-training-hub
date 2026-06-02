# DTH Reorg Checklist

## PREPARE
- [ ] Open terminal in repo root
- [ ] Run `git status` and ensure working tree is clean
- [ ] Run `./dth_reorg.sh` (after making it executable)

## AFTER SCRIPT RUNS
- [ ] Open repo in VS Code: `code .`
- [ ] Inspect `git diff` and staged changes in Source Control panel
- [ ] Review `agents/manifest.json` for accuracy
- [ ] Open moved agent files and confirm they run (no syntax errors)
- [ ] Search for broken imports: `grep -R "require('./js" -n || true`
- [ ] Fix any remaining import paths manually in VS Code
- [ ] Run lint and tests:
  - `npm run lint` (if available)
  - `node main.js` or your dev start command
  - `python -m pyflakes .` (optional)
- [ ] Run the DTH runtime locally and verify agents start:
  - `node main.js` or `python runtime/agent_runtime.py` depending on your entrypoint
- [ ] Commit any manual fixes
- [ ] Push branch: `git push -u origin dth-reorg`
- [ ] Create PR and review changes

## ROLLBACK (if needed)
- [ ] To rollback to snapshot: `git checkout master && git reset --hard pre-dth-reorg-YYYYMMDDHHMM` (replace tag)

