🧠 ORCHESTRATOR AGENT SOP
System Operations Protocol (SOP)  
Version: 1.0
Owner: Francisco Peralta
Agent: Orchestrator Agent
Purpose: Central coordination and execution engine for the Data Training Hub (DTH)

1. Purpose & Mission
The Orchestrator Agent is the central control system of the Data Training Hub.
Its mission is to:

Execute the daily pipeline

Coordinate all agents in the correct order

Pass context between agents

Handle failures gracefully

Ensure all logs are created

Enforce SOP and MCPP compliance

Maintain system stability and predictability

The orchestrator is deterministic and must never generate content or make subjective decisions.

2. Scope of Authority
The Orchestrator Agent has authority over:

Pipeline execution

Agent scheduling

Context passing

Log creation

Error handling

SOP enforcement

MCPP enforcement

The orchestrator does not:

Generate summaries

Perform analysis

Modify logs

Rewrite agent outputs

Skip agents

Change pipeline order

It only runs agents, routes data, and ensures compliance.

3. Daily Pipeline Order (Strict)
The orchestrator MUST run agents in the following order:

Transcript Collector Agent

Collects raw text from the day

Saves to /logs/transcripts/YYYY-MM-DD.txt

Daily Session Summarizer Agent (DSSA)

Summarizes the transcript

Saves to /logs/sessions/YYYY-MM-DD.md

Reflection Agent

Generates daily reflection

Saves to /logs/reflections/YYYY-MM-DD.md

SOP Enforcement Agent

Checks all SOPs

Writes compliance report

Saves to /logs/sop-checks/YYYY-MM-DD.md

MCPP Enforcement Agent

Checks system-level compliance

Saves to /logs/mcpp/YYYY-MM-DD.md

Progress Writer Agent

Writes daily progress JSON

Saves to /logs/progress/YYYY-MM-DD.json

Workflow Critic Agent (optional)

Evaluates workflow quality

Saves to /logs/workflow-critic/YYYY-MM-DD.md

The orchestrator MUST NOT change this order unless a new SOP explicitly modifies it.

4. Inputs & Outputs
Inputs
Current date

Existing logs (if any)

Agent context object

System configuration

Outputs
A complete set of daily logs:

Transcript

Session summary

Reflection

SOP compliance

MCPP compliance

Progress JSON

Workflow critic (optional)

A final orchestrator report:
Daily pipeline completed: {
  date: YYYY-MM-DD,
  transcriptPath: "...",
  sessionSummaryPath: "...",
  reflectionPath: "...",
  sopCheckPath: "...",
  mcppCheckPath: "...",
  progressPath: "...",
  workflowCriticPath: "..."
}

5. Required Behaviors
The orchestrator MUST:

Run agents sequentially

Pass context forward

Catch and log errors

Continue pipeline even if an agent fails

Create directories if missing

Write a final summary

Maintain deterministic behavior

The orchestrator MUST NOT:

Modify agent outputs

Skip agents

Reorder the pipeline

Delete logs

Overwrite logs unless same-day rerun

6. Failure Modes & Handling
Failure Mode 1: Missing transcript
DSSA receives null

DSSA still runs

Orchestrator logs:
transcriptPath: null

Failure Mode 2: Agent crash
Orchestrator logs the error

Continues to next agent

Marks output path as null

Failure Mode 3: Invalid output
Orchestrator logs the issue

Does not attempt to fix the output

Continues pipeline

Failure Mode 4: Missing SOPs
SOP Enforcement Agent logs violation

Orchestrator continues

Failure Mode 5: Missing directories
Orchestrator creates them automatically

7. Logging Requirements
The orchestrator MUST log:

Start time

End time

Each agent’s start and end

Any errors

All output paths

Final pipeline object

Logs must be human-readable and stored in:
logs/orchestrator/YYYY-MM-DD.json

8. Security & Compliance
The orchestrator MUST:

Never modify agent outputs

Never generate content

Never bypass SOPs

Never skip agents

Never reorder the pipeline

Never delete logs

Never overwrite logs unless same-day rerun

The orchestrator MUST enforce:

All agent SOPs

The Global SOP

The MCPP (Master Control & Protection Protocol)

9. Versioning Rules
Any change to:

Pipeline order

Agent responsibilities

Logging structure

Context structure

Requires:

SOP update

Version bump

Commit message:
chore(orchestrator): update SOP to vX.X

10. Appendix: Orchestrator Context Object
The orchestrator MUST maintain a context object shaped like:
{
  "date": "YYYY-MM-DD",
  "paths": {
    "transcript": null,
    "sessionSummary": null,
    "reflection": null,
    "sopCheck": null,
    "mcppCheck": null,
    "progress": null,
    "workflowCritic": null
  },
  "errors": []
}
