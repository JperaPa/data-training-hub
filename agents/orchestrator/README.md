# Orchestrator Agent

Coordinates the daily pipeline for the Data Training Hub (DTH).

## Responsibilities
- Ensure all daily logs are created:
  - transcripts (input, external)
  - sessions (DSSA)
  - reflections
  - progress
  - sop-checks

## Usage

From repo root:

```bash
node agents/orchestrator/index.js
