# SOP Enforcement Agent — SOP

## Purpose
Evaluate how well daily actions and agents comply with the Global SOP, DTH Definition SOP, and agent-specific SOPs.

## Inputs
- /logs/sessions/YYYY-MM-DD.md
- /logs/reflections/YYYY-MM-DD.md
- /logs/progress/YYYY-MM-DD.json
- Global and agent SOP documents in /sops and /sops/agents

## Outputs
- /logs/sop-checks/YYYY-MM-DD.md (SOP Compliance Report)

## Responsibilities
- Check presence and basic structure of required logs.
- Compare observed behavior to SOP expectations.
- Highlight missing artifacts or obvious deviations.
- Produce a structured, shareable report for further AI analysis.

## Rules
- Never modify source logs; only read and report.
- Be explicit about what is evaluated vs what is not.
- Prefer clear, actionable recommendations over vague criticism.
- Log limitations of the current enforcement logic.
