MCPP MASTER SOP
Marine Corps Planning Process — Doctrine + Enforcement Agent SOP  
System Operations Protocol (SOP)  
Version: 1.0
Owner: Francisco Peralta
Applies To: All planning agents, orchestrator, and the MCPP Enforcement Agent
Purpose: Establish doctrinal rules and enforcement mechanisms for the Marine Corps Planning Process (MCPP) within the Data Training Hub (DTH)

1. Purpose & Mission
This SOP defines:

The doctrinal rules of the Marine Corps Planning Process (MCPP)

The operational rules of the MCPP Enforcement Agent

The compliance scoring system

The required artifacts for each step

The logging and reporting requirements

This document governs all planning activity inside the Data Training Hub.

2. The Six Steps of MCPP (Doctrinal Rules)
The Marine Corps Planning Process consists of six sequential steps.
Each step has required inputs, required outputs, and compliance criteria.

STEP 1 — Problem Framing
Purpose
Define the problem, mission, and operational environment.

Required Inputs
Transcript

Commander’s intent (if available)

Previous day’s progress log

Required Outputs
Problem Statement

Mission Statement

Commander’s Intent (draft)

Initial Critical Factors (CFs)

Initial Center of Gravity (COG) analysis

Initial Essential Tasks

Compliance Criteria
Problem statement is clear and actionable

Mission statement includes WHO, WHAT, WHEN, WHERE, WHY

Critical factors identified

Constraints and restraints listed

Assumptions documented

STEP 2 — COA Development
Purpose
Develop one or more Courses of Action (COAs).

Required Inputs
Outputs from Problem Framing

Operational constraints

Available resources

Required Outputs
COA #1 (required)

COA #2 (optional)

COA graphics (if applicable)

COA narrative

Task organization

Compliance Criteria
COA is feasible, acceptable, suitable, distinguishable, complete (FASDC)

Includes scheme of maneuver

Includes main effort and supporting efforts

Includes risk assessment

STEP 3 — COA Wargaming
Purpose
Test each COA against enemy actions, friction, and constraints.

Required Inputs
COAs

Threat model

Friendly capabilities

Required Outputs
Wargame table

Identified friction points

Decision points

Branches and sequels

Updated risk assessment

Compliance Criteria
Wargame includes action → reaction → counteraction

Identifies vulnerabilities

Identifies opportunities

Produces decision points

STEP 4 — COA Comparison & Decision
Purpose
Compare COAs and select the best one.

Required Inputs
Wargame results

COA narratives

Evaluation criteria

Required Outputs
Decision matrix

Selected COA

Rationale for selection

Compliance Criteria
Evaluation criteria are explicit

Scoring is consistent

Selected COA is justified

STEP 5 — Orders Development
Purpose
Translate the selected COA into a clear, executable order.

Required Inputs
Selected COA

Decision matrix

Wargame results

Required Outputs
Draft Order (5‑paragraph format)

Tasks to subordinate units

Coordinating instructions

Control measures

Compliance Criteria
Order includes Situation, Mission, Execution, Admin/Log, Command/Signal

Tasks are clear and measurable

Control measures are defined

STEP 6 — Transition
Purpose
Ensure smooth handoff and execution.

Required Inputs
Final order

Supporting documents

Required Outputs
Transition brief

Updated task list

Execution checklist

Compliance Criteria
Transition brief is complete

Tasks are assigned

Execution timeline exists

3. MCPP Compliance Scoring System
Each step is scored:

Compliant (1.0) — All required artifacts present and correct

Partial (0.5) — Some artifacts missing or incomplete

Non‑Compliant (0.0) — Step missing or invalid

The final score is:
(total points earned) / (total possible points)

4. MCPP Enforcement Agent SOP
This section defines how the agent enforces the doctrine above.

4.1 Purpose
The MCPP Enforcement Agent evaluates all planning artifacts produced within the DTH and determines:

Presence

Completeness

Doctrinal correctness

Compliance score

Recommendations

It does not generate planning content.

4.2 Inputs
The agent receives:

Transcript

Session summary

Reflection

COA drafts

Wargaming notes

Decision matrices

Orders drafts

Transition notes

Any planning artifacts in /logs/planning/

4.3 Outputs
The agent produces:

logs/mcpp/YYYY-MM-DD.md

logs/mcpp/YYYY-MM-DD.json

Containing:

Step-by-step compliance

Missing artifacts

Violations

Recommendations

Final score

4.4 Required Behaviors
The agent MUST:

Evaluate each MCPP step independently

Score each step using the compliance system

Identify missing artifacts

Identify doctrinal violations

Provide recommendations

Never modify artifacts

Never generate planning content

4.5 Failure Modes
Missing artifacts
Score = 0.0

Log violation

Malformed artifacts
Score = 0.0

Log violation

Contradictory artifacts
Score = 0.5

Log warning

Empty logs
Score = 0.0

Log critical error

4.6 Logging Requirements
The agent MUST log:

Step-by-step compliance

Missing artifacts

Violations

Recommendations

Final score

Timestamp

File paths

5. Integration With Orchestrator
The orchestrator MUST:

Run the MCPP Enforcement Agent after SOP Enforcement

Pass the full context object

Store the output path in context.paths.mcppCheck

Never skip this step

Never modify the agent’s output

6. Versioning Rules
Any change to:

MCPP doctrine

Scoring system

Required artifacts

Enforcement logic

Requires:

SOP update

Version bump

Commit message:
chore(mcpp): update MCPP SOP to vX.X

