#!/usr/bin/env node
import { execSync } from "child_process";
import inquirer from "inquirer";

const run = (cmd) => {
  console.log(`\n▶ Running: ${cmd}\n`);
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.error("\n❌ Error:", err.message);
  }
};

const menu = async () => {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "⚡ Git Shortcuts",
      choices: [
        "1. Git Status",
        "2. Git Add + Commit + Push",
        "3. Git Pull",
        "4. Hard Reset to Origin/Main",
        "5. Show Git Log",
        "6. Exit"
      ]
    }
  ]);

  switch (choice) {
    case "1. Git Status":
      run("git status");
      break;

    case "2. Git Add + Commit + Push":
      run('git add . && git commit -m "update" && git push origin main');
      break;

    case "3. Git Pull":
      run("git pull origin main");
      break;

    case "4. Hard Reset to Origin/Main":
      run("git fetch --all && git reset --hard origin/main");
      break;

    case "5. Show Git Log":
      run("git log --oneline --graph --decorate --all");
      break;

    case "6. Exit":
      console.log("\n👋 Exiting Git Shortcuts\n");
      process.exit(0);
  }

  menu();
};

menu();
