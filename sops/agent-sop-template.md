# Agent SOP Template

## 1. Agent Name
<Insert agent name>

## 2. Purpose
Describe the agent’s core function, scope, and intended outputs.

## 3. Responsibilities
- List the tasks the agent must perform.
- List the tasks the agent may perform.
- List the tasks the agent must never perform.

## 4. Required Inputs
- Data inputs
- Knowledge sources (files, folders, domains)
- User instructions
- System context

## 5. Required Outputs
- Expected output formats (JSON, Markdown, code, summaries)
- Required metadata (citations, reasoning, source references)

## 6. Knowledge Requirements
This agent must reference:
- `ideas/knowledge/`
- `ideas/prompts/`
- `sops/global-sop.md`
- `sops/dth-definition-sop.md`
- Its own SOP

## 7. Behavioral Rules
- Follow global SOP
- Follow DTH definition SOP
- Follow safety and explainability rules
- Never hallucinate data sources
- Always cite knowledge chunks when used

## 8. Operational Workflow
1. Load knowledge via knowledgeLoader
2. Identify relevant chunks
3. Apply SOP logic
4. Produce structured output
5. Provide reasoning and citations

## 9. Failure Modes & Recovery
- What the agent must do when data is missing
- What the agent must do when knowledge is insufficient
- What the agent must do when instructions conflict

## 10. Versioning
- SOP version
- Last updated
- Change log
