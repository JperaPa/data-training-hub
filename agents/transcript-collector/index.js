import fs from "fs";
import path from "path";

export default class TranscriptCollector {
  async run(context) {
    const { date, logger } = context;

    const transcriptPath = path.join("logs", "transcripts", `${date}.txt`);

    fs.mkdirSync(path.dirname(transcriptPath), { recursive: true });

    if (!fs.existsSync(transcriptPath)) {
      fs.writeFileSync(transcriptPath, "", "utf-8");
    }

    logger.success(`Transcript collected at: ${transcriptPath}`);

    return { transcriptPath };
  }
}
