// orchestrator.js
import { criticEvaluate } from "./critic.js";
import { alfReview } from "./alf.js";

export class Orchestrator {
    constructor() {
        this.agents = new Map();
    }

    registerAgent(name, handler) {
        this.agents.set(name, handler);
    }

    async handleTask(task, context = {}) {
        const { type } = task;

        if (!this.agents.has(type)) {
            return { status: "error", reason: `No agent for type: ${type}` };
        }

        const agentHandler = this.agents.get(type);

        // 1) Acting Agent
        const agentResult = await agentHandler(task, context);

        // 2) Critic
        const criticResult = criticEvaluate(agentResult, task, context);

        // 3) ALF (Learning Loop)
        const alfResult = alfReview(criticResult, agentResult, task, context);

        return {
            status: "final",
            agentResult,
            criticResult,
            alfResult
        };
    }
}

export const orchestrator = new Orchestrator();
