// NAVIGATION HANDLER
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    loadPanel(action);
  });
});

// PANEL LOADER
function loadPanel(action) {
  const content = document.getElementById("content");

  switch (action) {

    case "shortcuts":
      content.innerHTML = `
        <h2>⚡ Git Shortcuts</h2>
        <button onclick="runShortcut('status')">Git Status</button>
        <button onclick="runShortcut('push')">Add + Commit + Push</button>
        <button onclick="runShortcut('pull')">Git Pull</button>
        <button onclick="runShortcut('reset')">Hard Reset</button>
        <button onclick="runShortcut('log')">Show Git Log</button>
        <pre id="output"></pre>
      `;
      break;

    case "agents":
      content.innerHTML = `
        <h2>🧠 Agent Controls</h2>

        <button onclick="runAgent('transcript')">Run Transcript Collector</button>
        <button onclick="runAgent('summary')">Run Daily Summarizer</button>
        <button onclick="runAgent('reflection')">Run Reflection Agent</button>
        <button onclick="runAgent('sop')">Run SOP Enforcement Agent</button>
        <button onclick="runAgent('progress')">Run Progress Evaluator</button>
        <button onclick="runAgent('pipeline')">Run FULL Pipeline</button>

        <pre id="agent-output"></pre>
      `;
      break;

    case "logs":
      content.innerHTML = `
        <h2>📄 Logs</h2>
        <p>Log viewer will go here.</p>
      `;
      break;

    case "settings":
      content.innerHTML = `
        <h2>⚙️ Settings</h2>
        <p>Settings panel will go here.</p>
      `;
      break;
  }
}

// GIT SHORTCUTS
async function runShortcut(type) {
  const output = document.getElementById("output");

  const commands = {
    status: "git status",
    push: "git add . && git commit -m 'update' && git push origin main",
    pull: "git pull origin main",
    reset: "git fetch --all && git reset --hard origin/main",
    log: "git log --oneline --graph --decorate --all"
  };

  const cmd = commands[type];

  const result = await window.__TAURI__.shell.Command
    .create("sh", ["-c", cmd])
    .execute();

  output.textContent = result.stdout || result.stderr;
}

// AGENT RUNNER
async function runAgent(type) {
  const output = document.getElementById("agent-output");

  const commands = {
    transcript: "node agents/transcript-collector/run.js",
    summary: "node agents/daily-summarizer/run.js",
    reflection: "node agents/reflection-agent/run.js",
    sop: "node agents/mcpp-enforcement/run.js",
    progress: "node agents/progress-evaluator/run.js",
    pipeline: "node agents/pipeline/run.js"
  };

  const cmd = commands[type];

  const result = await window.__TAURI__.shell.Command
    .create("sh", ["-c", cmd])
    .execute();

  output.textContent = result.stdout || result.stderr;
}
