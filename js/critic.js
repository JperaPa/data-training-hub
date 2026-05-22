// critic.js
import { RULES } from "./rules.js";

export function criticEvaluate(agentResult, task, context) {
    const feedback = {
        agent: agentResult.agent,
        taskId: agentResult.taskId,
        score: 0,
        notes: []
    };

    // Relevance
    if (agentResult.result) {
        feedback.score += RULES.evaluation.relevanceWeight;
    } else {
        feedback.notes.push("Missing result data");
    }

    // Accuracy placeholder
    feedback.score += RULES.evaluation.accuracyWeight;

    // Format check
    if (typeof agentResult.result === "object") {
        feedback.score += RULES.evaluation.formatWeight;
    } else {
        feedback.notes.push("Result not structured");
    }

    return feedback;
}
