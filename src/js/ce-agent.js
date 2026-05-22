// ------------------------------------------------------------
// Load CE Constitution (rules)
// ------------------------------------------------------------
const CE_RULES = require("../data/ce_rules.json");
// ------------------------------------------------------------
// Load CE Constitution (rules)
// ------------------------------------------------------------

// ------------------------------------------------------------
// ZONE 1 — CONSTITUTION (Rules + Transparency Layer)
// ------------------------------------------------------------
const CE_CONSTITUTION = {
  version: CE_RULES.version || "1.0",
  rules: {
    memory: {
      critical: CE_RULES.memory?.critical ?? 95,
      warning: CE_RULES.memory?.warning ?? 85,
      reason: CE_RULES.memory?.reason || "High memory usage can cause system instability."
    },
    cpu: {
      critical: CE_RULES.cpu?.critical ?? 4.0,
      warning: CE_RULES.cpu?.warning ?? 3.0,
      reason: CE_RULES.cpu?.reason || "Sustained high CPU load reduces responsiveness."
    },
    disk: {
      fullString: CE_RULES.disk?.fullString || "100%",
      reason: CE_RULES.disk?.reason || "Full disk prevents logging and system operations."
    },
    activitywatch: {
      unreachable: CE_RULES.activitywatch?.unreachable || "AW unreachable",
      reason: CE_RULES.activitywatch?.reason || "ActivityWatch is required for behavioral telemetry."
    }
  }
};

// ------------------------------------------------------------
// ZONE 2 — RUNTIME INFERENCE PIPELINE
// ------------------------------------------------------------

// 1. CLASSIFY
function classifySystem(system) {
  if (system.memUsagePercent > CE_CONSTITUTION.rules.memory.critical) return "CRITICAL";
  if (system.cpuLoad[0] > CE_CONSTITUTION.rules.cpu.critical) return "CRITICAL";
  if (system.disk.includes(CE_CONSTITUTION.rules.disk.fullString)) return "CRITICAL";
  return "NORMAL";
}

// 2. EXTRACT
function extractMetrics(system) {
  return {
    mem: parseFloat(system.memUsagePercent),
    cpu: parseFloat(system.cpuLoad[0]),
    diskFull: system.disk.includes("100%"),
    activitywatch: system.activitywatch,
    fileIntegrity: system.fileIntegrity
  };
}

// 3. VALIDATE
function validateMetrics(metrics) {
  const errors = [];
  if (isNaN(metrics.mem)) errors.push("Invalid memory metric");
  if (isNaN(metrics.cpu)) errors.push("Invalid CPU metric");
  return errors;
}

// 4. REASON (Apply Constitution Rules)
function reasonAboutSystem(metrics) {
  const issues = [];
  const criticalIssues = [];

  // Memory
  if (metrics.mem > CE_CONSTITUTION.rules.memory.critical) {
    criticalIssues.push("Memory usage above 95%");
  } else if (metrics.mem > CE_CONSTITUTION.rules.memory.warning) {
    issues.push("High memory pressure");
  }

  // CPU
  if (metrics.cpu > CE_CONSTITUTION.rules.cpu.critical) {
    criticalIssues.push("CPU load critically high");
  } else if (metrics.cpu > CE_CONSTITUTION.rules.cpu.warning) {
    issues.push("Elevated CPU load");
  }

  // Disk
  if (metrics.diskFull) {
    criticalIssues.push("Disk is full");
  }

  // ActivityWatch
  if (metrics.activitywatch === CE_CONSTITUTION.rules.activitywatch.unreachable) {
    issues.push("ActivityWatch unreachable");
  }

  // File integrity
  for (const [file, info] of Object.entries(metrics.fileIntegrity)) {
    if (!info.exists || info.error) {
      criticalIssues.push(`File integrity failure: ${file}`);
    }
  }

  // Score
  let score = 100 - issues.length * 10 - criticalIssues.length * 25;
  if (score < 0) score = 0;

  return { score, issues, criticalIssues };
}

// ------------------------------------------------------------
// CRITIC AGENT — Detect contradictions + propose new rules
// ------------------------------------------------------------
function criticAgent(system, reasoning) {
  const exceptions = [];

  if (reasoning.score > 80 && reasoning.criticalIssues.length > 0) {
    exceptions.push("High score but critical issues present");
  }

  if (system.cpuLoad[0] < 1.0 && system.memUsagePercent < 50 && reasoning.score < 50) {
    exceptions.push("Low resource usage but low readiness score");
  }

  return exceptions;
}

// ------------------------------------------------------------
// ALF — Human Simulator (Summaries + Actions)
// ------------------------------------------------------------
function generateSummary(osint, sanctions, typology) {
  return `
OSINT: ${osint?.items?.length || 0} items.
Sanctions: ${sanctions?.alerts?.length || 0} alerts.
Typology: ${typology?.redFlags?.length || 0} red flags.
  `;
}

function generateActions(readiness, osint, sanctions, typology, training) {
  const actions = [];

  if (readiness.criticalIssues.length > 0)
    actions.push("Resolve critical system issues before running intelligence sweeps.");

  if (readiness.issues.includes("High memory pressure"))
    actions.push("Close heavy applications to reduce memory pressure.");

  if (readiness.issues.includes("ActivityWatch unreachable"))
    actions.push("Start ActivityWatch or check port 5600.");

  if (sanctions?.alerts?.length > 0)
    actions.push("Review sanctions alerts immediately.");

  if (osint?.highRiskItems?.length > 0)
    actions.push("Expand OSINT collection on high-risk items.");

  if (typology?.redFlags?.length > 0)
    actions.push("Update SAR templates with new red flags.");

  if (training?.gaps?.length > 0)
    actions.push("Schedule training to address identified skill gaps.");

  return actions;
}

// ------------------------------------------------------------
// ORCHESTRATOR — CE Agent (Final Output)
// ------------------------------------------------------------
function runCEAgent(data) {
  const { system, osint, sanctions, typology, training } = data;

  const classification = classifySystem(system);
  const metrics = extractMetrics(system);
  const validationErrors = validateMetrics(metrics);
  const readiness = reasonAboutSystem(metrics);
  const exceptions = criticAgent(system, readiness);
  const patterns = learnFromExceptions();

  // Log exceptions if any
  if (exceptions.length > 0) {
    logException({
      timestamp: new Date().toISOString(),
      system,
      readiness,
      exceptions
    });
  }

  return {
    status: "CE_SYNTHESIS_COMPLETE",
    classification,
    readinessScore: readiness.score,
    issues: readiness.issues,
    criticalIssues: readiness.criticalIssues,
    exceptions,
    summary: generateSummary(osint, sanctions, typology),
    recommendedActions: generateActions(readiness, osint, sanctions, typology, training),
    constitutionVersion: CE_CONSTITUTION.version,
    timestamp: new Date().toISOString()
  };
}

// ------------------------------------------------------------
// EXCEPTION LOGGING
// ------------------------------------------------------------
function logException(entry) {
  const fs = require("fs");
  fs.appendFileSync("src/data/ce_exceptions.json", JSON.stringify(entry) + "\n");
}

// ------------------------------------------------------------
// LEARNING LOOP — Detect repeated patterns
// ------------------------------------------------------------
function learnFromExceptions() {
  const fs = require("fs");

  if (!fs.existsSync("src/data/ce_exceptions.json")) return {};

  const lines = fs.readFileSync("src/data/ce_exceptions.json", "utf8")
    .trim()
    .split("\n");

  const entries = lines.map(l => JSON.parse(l));

  const patterns = {};

  for (const e of entries) {
    for (const issue of e.exceptions) {
      patterns[issue] = (patterns[issue] || 0) + 1;
    }
  }

  fs.writeFileSync("src/data/ce_learning.json", JSON.stringify(patterns, null, 2));

  return patterns;
}

// ------------------------------------------------------------
// EXPORTS (CommonJS)
// ------------------------------------------------------------
module.exports = {
  runCEAgent,
  learnFromExceptions
};

