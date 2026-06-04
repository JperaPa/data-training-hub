import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readIfExists(p) {
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

export function generateSopReport({ dateOverride } = {}) {
  const date = dateOverride || today();

  const logsDir = path.join(ROOT, 'logs');
  const sessionsDir = path.join(logsDir, 'sessions');
  const reflectionsDir = path.join(logsDir, 'reflections');
  const progressDir = path.join(logsDir, 'progress');
  const sopChecksDir = path.join(logsDir, 'sop-checks');

  [sessionsDir, reflectionsDir, progressDir, sopChecksDir].forEach(ensureDir);

  const sessionSummaryPath = path.join(sessionsDir, `${date}.md`);
  const reflectionPath = path.join(reflectionsDir, `${date}.md`);
  const progressPath = path.join(progressDir, `${date}.json`);
  const sopCheckPath = path.join(sopChecksDir, `${date}.md`);

  const sessionSummary = readIfExists(sessionSummaryPath);
  const reflection = readIfExists(reflectionPath);
  const progressRaw = readIfExists(progressPath);

  let progress = null;
  if (progressRaw) {
    try {
      progress = JSON.parse(progressRaw);
    } catch {
      progress = null;
    }
  }

  const report = `# SOP Compliance Report — ${date}

## 1. Summary of Today’s Activities
${sessionSummary ? '_Session summary found and evaluated._' : '_No session summary found for this date._'}

## 2. SOPs Evaluated
- Global SOP
- DTH Definition SOP
- Daily Session Summarizer SOP
- Feature Engineering SOP (if applicable)
- Other active agents

## 3. Compliance Status (High-Level)
| SOP | Status | Notes |
|-----|--------|--------|
| Global SOP | Partial | Automated evaluation not fully implemented yet. |
| DTH Definition SOP | Partial | Structural checks only. |
| Daily Session Summarizer SOP | ${sessionSummary ? 'Compliant' : 'Non-Compliant'} | ${sessionSummary ? 'Summary file present.' : 'Missing summary file.'} |
| Feature Engineering SOP | N/A | Not evaluated in this run. |
| Other Agents | N/A | Not evaluated in this run. |

## 4. Detailed Findings
### 4.1 Global SOP
- Automated enforcement not yet implemented.
- Manual review recommended.

### 4.2 Agent SOPs
- Daily Session Summarizer:
  - Expected: /logs/sessions/${date}.md
  - Observed: ${sessionSummary ? 'Present' : 'Missing'}

## 5. Critical Issues
- Automated SOP rule evaluation is not yet implemented.
- Some logs may be missing or incomplete.

## 6. Root Cause Analysis
- System is in early implementation phase.
- Enforcement logic is currently placeholder-based.

## 7. Lessons Learned
- Structural logging is in place.
- Next step is to encode explicit SOP rules as machine-checkable conditions.

## 8. Recommendations
### Short-Term
- Implement concrete checks for required files and sections.
- Add status flags to progress JSON.

### Long-Term
- Encode SOPs as JSON/YAML rules.
- Build a rule engine to evaluate compliance automatically.

## 9. Alignment Check: Actions vs SOPs vs Results
### Actions Taken
- Generated or checked daily logs for ${date}.

### SOP Requirements
- Daily logs should exist and follow defined formats.

### Results
- Session summary: ${sessionSummary ? 'Present' : 'Missing'}
- Reflection: ${reflection ? 'Present' : 'Missing'}
- Progress: ${progress ? 'Present' : 'Missing or invalid JSON'}

### Evaluation
- Alignment score: Low (placeholder phase)
- Notes: Enforcement agent is scaffolded; logic to be expanded.

## 10. Metadata
- Session ID: ${date}
- Agent: SOP Enforcement Agent
- System: Data Training Hub (DTH)
`;

  fs.writeFileSync(sopCheckPath, report.trim() + '\n');
  return sopCheckPath;
}

// CLI entrypoint
if (import.meta.url === `file://${process.argv[1]}`) {
  const pathOut = generateSopReport();
  console.log('SOP report written to:', pathOut);
}

export default SOPEnforcementAgent;