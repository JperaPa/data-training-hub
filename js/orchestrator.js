function validateTaskSchema(task) {
    const required = ["taskId", "type", "payload"];

    for (const field of required) {
        if (!task[field]) {
            return { valid: false, reason: `Missing required field: ${field}` };
        }
    }

    return { valid: true };
}

function validateAgentResponseSchema(res) {
    const required = ["agent", "taskId", "status", "result", "confidence"];

    for (const field of required) {
        if (res[field] === undefined) {
            return { valid: false, reason: `Agent response missing: ${field}` };
        }
    }

    return { valid: true };
}
// src/runtime/orchestrator.js

import { criticEvaluate } from "../runtime/critic/critic-agent.js";
import { alfReview } from "../runtime/alf/alf-agent.js";
import PersonalFinance from "./personal-finance-agent.js";

orchestrator.registerAgent("personal_finance", PersonalFinance.run.bind(PersonalFinance));

export class Orchestrator {
    constructor() {
        this.agents = new Map();
    }

    /**
     * Register an agent with a name and handler function
     * handler: (task, context) => Promise<AgentResult>
     */
    registerAgent(name, handler) {
        this.agents.set(name, handler);
    }

    /**
     * Main entry point
     * task: { type, payload, meta }
     */
    async handleTask(task, context = {}) {
    // 0) Validate task schema
    const taskCheck = validateTaskSchema(task);
    if (!taskCheck.valid) {
        return { status: "invalid_task", reason: taskCheck.reason };
    }

    // Ensure agent exists
    if (!this.agents.has(task.type)) {
        return {
            status: "error",
            reason: `No agent registered for task type: ${task.type}`
        };
    }

    const agentHandler = this.agents.get(task.type);

    // 1) Acting Agent
    const agentResult = await agentHandler(task, context);

    // Validate agent response schema
    const agentCheck = validateAgentResponseSchema(agentResult);
    if (!agentCheck.valid) {
        return { status: "invalid_agent_response", reason: agentCheck.reason };
    }

    // 2) Critic Agent
    const criticResult = await criticEvaluate(agentResult, task, context);

    // 3) ALF Layer
    const alfResult = await alfReview(criticResult, agentResult, task, context);

    return {
        status: "final",
        agentResult,
        criticResult,
        alfResult
    };
}

        const agentHandler = this.agents.get(type);

        // 1) Acting Agent
        const agentResult = await agentHandler(task, context);

        // 2) Critic Agent
        const criticResult = await criticEvaluate(agentResult, task, context);

        if (criticResult.decision === "reject") {
            return {
                status: "rejected_by_critic",
                agentResult,
                criticResult,
            };
        }

        // 3) ALF (Human Simulator)
        const alfResult = await alfReview(criticResult, agentResult, task, context);

        return {
            status: "final",
            agentResult,
            criticResult,
            alfResult,
        };
    }
}

// Singleton instance if you want a global orchestrator
export const orchestrator = new Orchestrator();