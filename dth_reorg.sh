#!/usr/bin/env bash
set -euo pipefail

# dth_reorg.sh
# Usage: ./dth_reorg.sh
# Creates DTH layout, moves files with git mv (preserves history), updates common import paths,
# and commits changes to branch dth-reorg. Review changes in VS Code before pushing.

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "Repo root: $REPO_ROOT"

# 0. Safety: ensure git repo and working tree clean
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: Not inside a git repo. Abort."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: Working tree not clean. Commit or stash changes first."
  git status --porcelain
  exit 1
fi

# 1. Snapshot branch + tag
SNAP_BRANCH="pre-dth-reorg-$(date +%Y%m%d%H%M)"
git checkout -b "$SNAP_BRANCH"
git commit --allow-empty -m "snapshot before DTH reorg: $SNAP_BRANCH"
git tag "pre-dth-reorg-$(date +%Y%m%d%H%M)"

# 2. Create target folders
mkdir -p agents/{overwatch,training-learning,finance-intelligence,sanctions-policy-education,osint-knowledge,recruiter-scout,infra-system-scout,decision-engine,local-safety}
mkdir -p pipelines/{multi-ai-coordination,auto-queries,daily-intel}
mkdir -p utilities governance/{compliance,safety,oversight} docs/DTH_SOPs dashboard/frontend

# 3. Safe git mv operations (only if source exists)
mv_if_exists() {
  src="$1"
  dst="$2"
  if [ -e "$src" ]; then
    mkdir -p "$(dirname "$dst")"
    git mv "$src" "$dst"
    echo "Moved: $src -> $dst"
  else
    echo "Skipped (not found): $src"
  fi
}

# Overwatch
mv_if_exists "js/overwatch-agent.js" "agents/overwatch/overwatch-agent.js"
mv_if_exists "js/overwatch-compliance.js" "agents/overwatch/overwatch-compliance.js"
mv_if_exists "js/executive-agent.js" "agents/overwatch/executive-agent.js"

# Training & Learning
mv_if_exists "js/training-agent.js" "agents/training-learning/training-agent.js"
mv_if_exists "js/learning-console.js" "agents/training-learning/learning-console.js"

# Finance
mv_if_exists "js/finance-agent.js" "agents/finance-intelligence/finance-agent.js"
mv_if_exists "js/personal-finance-agent.js" "agents/finance-intelligence/personal-finance-agent.js"
mv_if_exists "design/finance_agent_data_flow.md" "agents/finance-intelligence/design/finance_agent_data_flow.md"
mv_if_exists "design/finance_agent_logic.md" "agents/finance-intelligence/design/finance_agent_logic.md"

# Sanctions (education)
mv_if_exists "js/sanctions-agent.js" "agents/sanctions-policy-education/sanctions-agent.js"
mv_if_exists "sop/sanctions_agent_sop.md" "governance/compliance/sanctions-education.md"

# OSINT / Narrative pattern recognition
mv_if_exists "js/osint-agent.js" "agents/osint-knowledge/osint-agent.js"
mv_if_exists "js/globe.js" "agents/osint-knowledge/globe.js"
# narrative-patterns may not exist; skip if not present
mv_if_exists "js/narrative-patterns.js" "agents/osint-knowledge/narrative-patterns.js"

# Recruiter / Scout
mv_if_exists "js/scout-agent.js" "agents/recruiter-scout/scout-agent.js"

# Infra / System Scout
mv_if_exists "js/system-diagnostics.js" "agents/infra-system-scout/system-diagnostics.js"
mv_if_exists "js/system-stabilize.js" "utilities/system-stabilize.js"

# Decision engine
mv_if_exists "js/decision-engine-agent.js" "agents/decision-engine/decision-engine-agent.js"

# Local safety
mv_if_exists "js/local-safety-panel.js" "agents/local-safety/local-safety-panel.js"
mv_if_exists "sop/local_safety_agent_sop.md" "governance/safety/local-safety-sop.md"

# Dashboard and UI
mv_if_exists "js/dth-dashboard.js" "dashboard/dth-dashboard.js"
mv_if_exists "renderer" "dashboard/frontend/renderer" || true

# Runtime (leave runtime folder but ensure path)
if [ -d "runtime" ]; then
  echo "Runtime folder exists; leaving in place."
fi

# SOPs and docs
mv_if_exists "Agent ideas" "docs/DTH_SOPs/agent-ideas.md"
mv_if_exists "sop/_template.md" "docs/DTH_SOPs/_template.md"
mv_if_exists "sop/overwatch_agent_sop.md" "docs/DTH_SOPs/overwatch_agent_sop.md"
mv_if_exists "sop/decision_engine_agent_sop.md" "docs/DTH_SOPs/decision_engine_agent_sop.md"
mv_if_exists "sop/finance_agent_sop.md" "docs/DTH_SOPs/finance_agent_sop.md"
mv_if_exists "sop/infra_agent_sop.md" "docs/DTH_SOPs/infra_agent_sop.md"
mv_if_exists "sop/local_safety_agent_sop.md" "docs/DTH_SOPs/local_safety_agent_sop.md"
mv_if_exists "sop/orchestrator_agent_sop.md" "docs/DTH_SOPs/orchestrator_agent_sop.md"

# 4. Create agents manifest
cat > agents/manifest.json <<'JSON'
{
  "agents": [
    {"id":"overwatch","path":"agents/overwatch/overwatch-agent.js","sop":"docs/DTH_SOPs/overwatch_agent_sop.md","human_in_loop":true},
    {"id":"training-learning","path":"agents/training-learning/training-agent.js","sop":"docs/DTH_SOPs/training_agent_sop.md","human_in_loop":true},
    {"id":"finance-intelligence","path":"agents/finance-intelligence/finance-agent.js","sop":"docs/DTH_SOPs/finance_agent_sop.md","human_in_loop":true},
    {"id":"sanctions-policy-education","path":"agents/sanctions-policy-education/sanctions-agent.js","sop":"governance/compliance/sanctions-education.md","human_in_loop":true},
    {"id":"osint-knowledge","path":"agents/osint-knowledge/osint-agent.js","sop":"docs/DTH_SOPs/osint_agent_sop.md","human_in_loop":true},
    {"id":"recruiter-scout","path":"agents/recruiter-scout/scout-agent.js","sop":"docs/DTH_SOPs/recruiter_scout_sop.md","human_in_loop":true},
    {"id":"infra-system-scout","path":"agents/infra-system-scout/system-diagnostics.js","sop":"docs/DTH_SOPs/infra_agent_sop.md","human_in_loop":true},
    {"id":"decision-engine","path":"agents/decision-engine/decision-engine-agent.js","sop":"docs/DTH_SOPs/decision_engine_agent_sop.md","human_in_loop":true},
    {"id":"local-safety","path":"agents/local-safety/local-safety-panel.js","sop":"governance/safety/local-safety-sop.md","human_in_loop":true}
  ]
}
JSON

git add agents/manifest.json
echo "Created agents/manifest.json"

# 5. Update common import/require paths (safe replacements)
# This sed script updates common patterns like require('./js/xxx') or import from './js/xxx'
# It writes changes to files but only for obvious patterns. Review diffs after running.
echo "Updating common import paths (preview only). Running replacements..."

# helper: replace pattern in files and show changed files
replace_and_stage() {
  pattern="$1"
  replacement="$2"
  # find files likely to contain imports
  files=$(git ls-files | grep -E '\.(js|py|json|md)$' || true)
  for f in $files; do
    if grep -q "$pattern" "$f"; then
      sed -E -i.bak "s|$pattern|$replacement|g" "$f"
      rm -f "$f.bak"
      git add "$f"
      echo "Patched: $f"
    fi
  done
}

# Examples: adjust these patterns to match your codebase
replace_and_stage "require\\(['\"]\\.\\/js\\/([a-zA-Z0-9_\\-]+)\\.js['\"]\\)" "require('./agents/\\1/\\1.js')"
replace_and_stage "from ['\"]\\.\\/js\\/([a-zA-Z0-9_\\-]+)\\.js['\"]" "from './agents/\\1/\\1.js'"

# 6. Commit changes to new branch
git checkout -b dth-reorg
git add -A
git commit -m "chore(dth): reorganize repo into DTH layout; created agents manifest; updated imports (preview)"

echo "Reorg complete. Branch: dth-reorg"
echo "Open VS Code now and review changes: code ."
echo "Review git diff, run tests, then push when ready."