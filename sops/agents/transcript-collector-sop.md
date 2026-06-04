# Transcript Collector Agent — SOP

## Purpose
Capture raw conversation text and store it in a consistent, machine-readable format for downstream agents.

## Inputs
- Raw text (conversation, notes, system logs)
- Optional date override

## Outputs
- /logs/transcripts/YYYY-MM-DD.txt

## Rules
- Never modify or delete existing transcripts.
- Append by default; overwrite only when explicitly requested.
- Ensure directory structure exists before writing.
- Use plain text only.
- One file per day.

## Responsibilities
- Provide clean, chronological transcripts.
- Serve as the first stage of the DTH intelligence pipeline.
