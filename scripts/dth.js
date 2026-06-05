#!/usr/bin/env node
import inquirer from "inquirer";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// ---------------------------------------------
// COMMAND MAP — all agents + workflows
// ---------------------------------------------
const commands = {
  coach: "node agents/coach/index.js",
  summarize: "node agents/daily-session-summarizer/index.js",
  reflect: "node agents/reflection/index.js",
  sop: "node agents/sop-enforcement/index.js",
  evaluate: "node agents/evaluator/index.js",
  pipeline: "node agents/orchestrator/index.js",

  // workflows
  daily: "node agents/orchestrator/index.js",
  full: "node agents/orchestrator/index.js",
  weekly: "node agents/orchestrator/index.js"
};

// ---------------------------------------------
// COMMAND INTELLIGENCE HELPERS
// ---------------------------------------------
function loadTodayCommands() {
  const date = new Date().toISOString().split("T")[0];
  const file = path.join(ROOT, "logs", "commands", `${date}.json`);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function countFrequency(list) {
  const freq = {};
  for (const entry of list) {
    freq[entry.command] = (freq[entry.command] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([cmd, count]) => ({ cmd, count }));
}

// ---------------------------------------------
// LOG VIEWER
// ---------------------------------------------
function openTodayLog() {
  const date = new Date().toISOString().split("T")[0];
  const file = path.join(ROOT, "logs", "coach", `${date}.md`);
  execSync(`open ${file}`);
}

// ---------------------------------------------
// EXECUTOR
// ---------------------------------------------
function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

// ---------------------------------------------
// INTERACTIVE MENU
// ---------------------------------------------
async function menu() {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "DTH Operator Console",
      choices: [
        { name: "Run Coach Agent", value: "coach" },
        { name: "Run Full Pipeline", value: "pipeline" },
        { name: "View Today's Coaching Report", value: "openLog" },
        new inquirer.Separator(),
        { name: "Show Today's Commands", value: "commandsToday" },
        { name: "Show Top Commands", value: "commandsTop" },
        new inquirer.Separator(),
        { name: "Exit", value: "exit" }
      ]
    }
  ]);

  if (answer.choice === "exit") return;

  if (answer.choice === "openLog") {
    openTodayLog();
    return;
  }

  if (answer.choice === "commandsToday") {
    const cmds = loadTodayCommands();
    console.log(cmds);
    return;
  }

  if (answer.choice === "commandsTop") {
    const cmds = countFrequency(loadTodayCommands());
    console.log(cmds);
    return;
  }

  run(commands[answer.choice]);
}

// ---------------------------------------------
// ENTRYPOINT
// ---------------------------------------------
const arg = process.argv[2];

if (!arg) {
  menu();
  process.exit(0);
}

if (commands[arg]) {
  run(commands[arg]);
  process.exit(0);
}

if (arg === "logs" && process.argv[3] === "today") {
  openTodayLog();
  process.exit(0);
}

if (arg === "commands" && process.argv[3] === "today") {
  console.log(loadTodayCommands());
  process.exit(0);
}

if (arg === "commands" && process.argv[3] === "top") {
  console.log(countFrequency(loadTodayCommands()));
  process.exit(0);
}

console.log("Unknown command. Run `dth` for menu.");
