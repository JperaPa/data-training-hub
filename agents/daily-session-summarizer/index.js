import fs from "fs";
import path from "path";

export default class DailySessionSummarizer {
  async run(context) {
    const { date, paths, logger } = context;

    // Load transcript and goals (if present)
    const transcript = this.safeLoad(paths.transcript);
    const goals = this.extractGoals(transcript);

    const summary = `
# Daily Session Summary — ${date}

## High-Level Summary
${goals.highLevel || '-'}

## Key Decisions
${goals.decisions || '-'}

## Technical Actions
${goals.actions || '-'}

## Blockers
${goals.blockers || '-'}

## Next Steps
${goals.nextSteps || '-'}

## Alignment with Goals/SOPs
${goals.alignment || '-'}
`;

    const filePath = path.join("logs", "sessions", `${date}.md`);
    fs.writeFileSync(filePath, summary.trim(), "utf-8");

    logger.success(`Session summary written to: ${filePath}`);

    return { sessionSummaryPath: filePath };
  }

  safeLoad(filePath) {
    try {
      if (!filePath || !fs.existsSync(filePath)) return "";
      return fs.readFileSync(filePath, "utf-8");
    } catch {
      return "";
    }
  }

  extractGoals(transcript) {
    // Placeholder — you can expand this later
    return {
      highLevel: "-",
      decisions: "-",
      actions: "-",
      blockers: "-",
      nextSteps: "-",
      alignment: "-"
    };
  }
}
