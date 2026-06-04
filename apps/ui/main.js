document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    loadPanel(action);
  });
});

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
        <h2>🧠 Agents</h2>
        <p>Agent controls will go here.</p>
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

  // Tauri shell command
  const result = await window.__TAURI__.shell.Command
    .create("sh", ["-c", cmd])
    .execute();

  output.textContent = result.stdout || result.stderr;
}
