export async function loadLearningData() {
  const response = await window.electronAPI.invoke("load-learning-data");
  return response || [];
}
import { appendOverwatchLog } from "./overwatch-log.js";

export function startOverwatchLogPolling() {
  setInterval(async () => {
    const log = await window.overwatchAPI.getLog();
    if (!log) return;

    // Render only new entries
    const container = document.getElementById("overwatch-log-stream");
    const existing = container.children.length;

    for (let i = existing; i < log.length; i++) {
      appendOverwatchLog(log[i]);
    }
  }, 2000);
}

export function computeLearningStats(entries) {
  const total = entries.length;

  const byAgent = {};
  const issueCounts = {};

  for (const e of entries) {
    // Count by agent
    byAgent[e.agent] = (byAgent[e.agent] || 0) + 1;

    // Count issues
    for (const issue of e.critic_issues || []) {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    }
  }

  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([issue, count]) => ({ issue, count }));

  return {
    total,
    byAgent,
    topIssues
  };
}

export function renderLearningConsole(entries) {
  const stats = computeLearningStats(entries);

  // Summary
  document.getElementById("stat-total").textContent = stats.total;
  document.getElementById("stat-agents").textContent = Object.keys(stats.byAgent).length;

  // Top Issues
  const issuesBody = document.getElementById("top-issues-body");
  issuesBody.innerHTML = "";
  for (const issue of stats.topIssues) {
    issuesBody.innerHTML += `
      <tr>
        <td>${issue.issue}</td>
        <td>${issue.count}</td>
      </tr>
    `;
  }

  // Agent Breakdown
  const agentBody = document.getElementById("agent-breakdown-body");
  agentBody.innerHTML = "";
  for (const [agent, count] of Object.entries(stats.byAgent)) {
    agentBody.innerHTML += `
      <tr>
        <td>${agent}</td>
        <td>${count}</td>
      </tr>
    `;
  }

  // Recent Events
  const eventsBody = document.getElementById("learning-events-body");
  eventsBody.innerHTML = "";
  for (const e of entries.slice().reverse()) {
    eventsBody.innerHTML += `
      <tr>
        <td>${e.timestamp}</td>
        <td>${e.agent}</td>
        <td>${e.decision}</td>
        <td class="sev-${e.severity.toLowerCase()}">${e.severity}</td>
        <td><button class="view-detail" data-id="${e.id}">View</button></td>
      </tr>
    `;
  }

  // Detail modal
  document.querySelectorAll(".view-detail").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const event = entries.find(x => x.id === id);
      document.getElementById("learning-detail-json").textContent =
        JSON.stringify(event, null, 2);
      document.getElementById("learning-detail-modal").classList.remove("hidden");
    });
  });

  document.getElementById("close-learning-detail").addEventListener("click", () => {
    document.getElementById("learning-detail-modal").classList.add("hidden");
  });
}
