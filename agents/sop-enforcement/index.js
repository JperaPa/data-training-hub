import fs from "fs";
import path from "path";

export default class SOPEnforcementAgent {
  async run(context) {
    const { date, paths, logger } = context;

    const transcript = this.safeLoad(paths.transcript);
    const summary = this.safeLoad(paths.sessionSummary);

    const sopCheck = `
# SOP Compliance Check — ${date}

## Compliance Status
Partial

## Findings
- SOP evaluation not yet implemented.

## Recommendations
- Add SOP rules and evaluation logic.
`;

    const outPath = path.join("logs", "sop-checks", `${date}.md`);
    fs.writeFileSync(outPath, sopCheck.trim(), "utf-8");

    logger.success(`SOP check written to: ${outPath}`);

    return { sopCheckPath: outPath };
  }

  safeLoad(filePath) {
    try {
      if (!filePath || !fs.existsSync(filePath)) return "";
      return fs.readFileSync(filePath, "utf-8");
    } catch {
      return "";
    }
  }
}
