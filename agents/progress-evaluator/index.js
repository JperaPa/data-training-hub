import fs from "fs";
import path from "path";

export async function runProgressEvaluator() {
  console.log("📈 Progress Evaluator started...");

  const date = new Date().toISOString().split("T")[0];
  const sopPath = path.join("logs", "sop", `${date}.md`);
  const progressDir = path.join("logs", "progress");
  const progressPath = path.join(progressDir, `${date}.json`);

  // Ensure output directory exists
  fs.mkdirSync(progressDir, { recursive: true });

  // Check if SOP report exists
  if (!fs.existsSync(sopPath)) {
    console.log(`⚠️ No SOP report found for ${date}`);
    fs.writeFileSync(
      progressPath,
      JSON.stringify(
        {
          date,
          status: "no_sop_report",
          message: "No SOP report found for this date."
        },
        null,
        2
      )
    );
    console.log(`📄 Empty progress report saved to: ${progressPath}`);
    return;
  }

  // Read SOP report
  const sop = fs.readFileSync(sopPath, "utf8");

  // Dummy progress evaluation
  const progress = {
    date,
    status: "ok",
    message: "This is a placeholder progress evaluation.",
    sop_length: sop.length
  };

  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

  console.log(`✅ Progress report saved to: ${progressPath}`);
}

// Run directly if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runProgressEvaluator();
}
