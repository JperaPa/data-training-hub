# Orchestrator Agent — SOP

## Purpose
Coordinate daily intelligence workflows in the Data Training Hub (DTH), ensuring logs and analyses are produced consistently.

## Inputs
- Date (optional; defaults to today)
- Existing logs in /logs/transcripts and /logs/sessions

## Outputs
- /logs/sessions/YYYY-MM-DD.md
- /logs/reflections/YYYY-MM-DD.md
- /logs/progress/YYYY-MM-DD.json
- /logs/sop-checks/YYYY-MM-DD.md

## Responsibilities
- Ensure required log directories exist.
- Trigger or stub each stage of the daily pipeline.
- Maintain deterministic file naming and structure.
- Never delete or overwrite existing logs without explicit policy.

## Stages
1. Daily Session Summary (DSSA)
2. Reflection
3. Goal Progress Evaluation
4. SOP Enforcement

## Rules
- Fail loudly on structural errors (missing folders, invalid paths).
- Never embed secrets or sensitive data in logs.
- Prefer append-only or versioned changes where possible.
