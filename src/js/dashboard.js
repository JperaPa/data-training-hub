document.addEventListener('DOMContentLoaded', async () => {
  const systemMetricsEl = document.getElementById('dth-system-metrics');
  const activitySummaryEl = document.getElementById('dth-activity-summary');
  const runBtn = document.getElementById('dth-run-sweep-btn');
  const lastRunStatus = document.getElementById('dth-last-run-status');

  async function refreshSystemStatus() {
    try {
      const status = await window.dth.getSystemStatus();
      systemMetricsEl.textContent =
        `CPU load: ${status.cpuLoad} | Memory: ${status.memUsagePercent}% | Uptime: ${status.uptimeMinutes} min`;
      activitySummaryEl.textContent = status.activitySummary;
    } catch (e) {
      systemMetricsEl.textContent = 'Error fetching system status.';
      activitySummaryEl.textContent = '';
      console.error(e);
    }
  }

  runBtn.addEventListener('click', async () => {
    runBtn.disabled = true;
    runBtn.textContent = 'Running...';
    lastRunStatus.textContent = 'Running sweep...';

    // For now, just refresh system status; later this will trigger all agents.
    await refreshSystemStatus();

    lastRunStatus.textContent = `Last run: ${new Date().toLocaleTimeString()}`;
    runBtn.disabled = false;
    runBtn.textContent = 'Run Intelligence Sweep';
  });

  // Initial load
  refreshSystemStatus();
});
async function runCE() {
  const ce = await window.dthCE.runCE();

  document.getElementById('dth-ce-summary').textContent = ce.summary;
  document.getElementById('dth-ce-priorities').textContent =
    JSON.stringify(ce.priorities, null, 2);
  document.getElementById('dth-ce-actions').textContent =
    ce.recommendedActions.join("\n");
}
async function updateFinancePanel() {
  const finance = await window.dthFinance.runFinance();

  document.getElementById("dth-finance-output").innerHTML = `
    <div>Income: 
```blockmath
{finance.income}</div>
    <div>Expenses:
    {finance.expenses}
Net Cash Flow: $${finance.netCashFlow}
Readiness: ${finance.readinessScore}
Risks:
${finance.riskFlags.map(r => <li>${r}</li>).join(””)}
Recommended Actions:
${finance.recommendedActions.map(a => <li>${a}</li>).join(””)}
`;
}

Then call it inside your auto‑refresh loop:

Find:

```js
await updateOverviewPanel();
await updateFinancePanel();

Explain Mode: ON/OFF

src/data/daily_snapshot_2026-05-21.json

runCEAgent(systemState)
[ New Rule Suggestions ]
- CPU threshold should be 3.5
- Disk full rule triggered 12 times
- ActivityWatch unreachable 8 times
[ Accept ] [ Reject ]
