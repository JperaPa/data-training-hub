import { orchestrator } from "./orchestrator.js";
import { typologyAgent } from "./acting/typology-agent.js";
import { sanctionsAgent } from "./acting/sanctions-agent.js";
// add more agents here

export function initRuntime() {
    orchestrator.registerAgent("typology_detection", typologyAgent);
    orchestrator.registerAgent("sanctions_screening", sanctionsAgent);
}