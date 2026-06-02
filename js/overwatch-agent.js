// ---------------------------------------------
// IMPORTS
// ---------------------------------------------
const fs = require("fs");
const path = require("path");

const diagnostics = require("./system-diagnostics");
const readiness = require("./readiness");
const compliance = require("./overwatch-compliance");
const verifyModules = require("./verify-modules");

// ---------------------------------------------
// LLM SYSTEM PROMPT BUILDER (EXECUTIVE OVERWATCH)
// ---------------------------------------------
function buildOverwatchSystemPrompt() {
    const sopPath = path.join(__dirname, "../sop/overwatch_agent_sop.md");
    const sopText = fs.readFileSync(sopPath, "utf8");

    return {
        systemPrompt: `
You are Overwatch, the unified Executive Agent of the DTH.
Your mission is to supervise system health, agent readiness,
cybersecurity posture, workflow continuity, and user goals.

Follow your SOP strictly.

SOP:
${sopText}
        `
    };
}

// ---------------------------------------------
// MISSION CONTEXT BUILDER (EXECUTIVE OVERWATCH)
// ---------------------------------------------
function buildAgentMissionContext(sopText, userTask) {
    return {
        systemPrompt: `
You are Overwatch. Follow your SOP.

SOP:
${sopText}

User Task:
${userTask}
        `
    };
}

// ---------------------------------------------
// SYSTEM DIAGNOSTICS AGENT (TECHNICAL OVERWATCH)
// ---------------------------------------------
async function runOverwatchAgent(payload) {

    const systemHealth = await diagnostics.checkSystem();
    const agentStatus = await readiness.checkAgents();
    const cyber = await compliance.runSecurityChecks();
    const goals = await compliance.loadGoals();

    const alerts = [];
    const recommended = [];

    if (systemHealth.node_modules_integrity !== "ok") {
        alerts.push("Node modules integrity issue detected.");
        recommended.push("Run npm install or verify package versions.");
    }

    if (cyber.npm_vulnerabilities > 0) {
        alerts.push("Vulnerable npm packages detected.");
        recommended.push("Run npm audit fix.");
    }

    return {
        system_health: systemHealth,
        agent_status: agentStatus,
        cyber_checks: cyber,
        goals: goals,
        alerts: alerts,
        recommended_actions: recommended
    };
}

// ---------------------------------------------
// EXPORTS
// ---------------------------------------------
module.exports = {
    buildOverwatchSystemPrompt,
    buildAgentMissionContext,
    runOverwatchAgent
};
