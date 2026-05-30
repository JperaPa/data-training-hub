module.exports = function computeReadiness(system) {
  const issues = [];
  const criticalIssues = [];

  if (system.memUsagePercent > 90) criticalIssues.push("High memory usage");
  if (system.cpuLoad[0] > 3.5) criticalIssues.push("High CPU load");

  const score = Math.max(0, 100 - criticalIssues.length * 25 - issues.length * 10);

  return { score, issues, criticalIssues };
};

/*
UPGRADE PATH:
- Integrate CE_CONSTITUTION thresholds
- Add disk, AW, file integrity checks
*/