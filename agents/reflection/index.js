import fs from "fs";
import path from "path";

export default class ReflectionAgent {
  async run(context) {
    const { date, paths, logger } = context;

    const transcript = this.safeLoad(paths.transcript);
    const summary = this.safeLoad(paths.sessionSummary);

    const reflection = `
# Daily Reflection — ${date}

## What Went Well
-

## What Could Improve
-

## Key Insights
-

## Alignment with Goals
-
`;

    const outPath = path.join("logs", "reflections", `${date}.md`);
    fs.writeFileSync(outPath, reflection.trim(), "utf-8");

    logger.success(`Reflection written to: ${outPath}`);

    return { reflectionPath: outPath };
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
