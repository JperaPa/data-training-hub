#!/usr/bin/env node
import inquirer from "inquirer";
import { execSync } from "child_process";

const run = (cmd) => {
  console.log(`\n▶ Running: ${cmd}\n`);
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.error("\n❌ Error running command:", err.message);
  }
};

const menu = async () => {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "🧠 Data Training Hub — Manual Control Center",
      choices: [
        "1. Run Transcript Collector",
        "2. Run Daily Session Summarizer",
        "3. Run Reflection Agent",
        "4. Run SOP Enforcement Agent",
        "5. Run Progress Evaluator",
        "6. Run FULL Pipeline",
        "7. Exit"
      ]
    }
  ]);

  switch (choice) {
    case "1. Run Transcript Collector":
      run("node agents/transcript-collector/index.js");
      break;

    case "2. Run Daily Session Summarizer":
      run("node agents/daily-session-summarizer/index.js");
      break;

    case "3. Run Reflection Agent":
      run("node agents/reflection/index.js");
      break;

    case "4. Run SOP Enforcement Agent":
      run("node agents/sop-enforcement/index.js");
      break;

    case "5. Run Progress Evaluator":
      run("node agents/orchestrator/index.js --progress-only");
      break;

    case "6. Run FULL Pipeline":
      run("node agents/orchestrator/index.js");
      break;

    case "7. Exit":
      console.log("\n👋 Exiting DTH Control Center\n");
      process.exit(0);
  }

  // Loop back to menu
  menu();
};

menu();
