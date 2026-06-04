import { loadKnowledge } from "./knowledgeLoader.js";

let cachedKnowledge = null;

export async function loadAgentContext(agentName) {
  // build and return the context object
}

export function getAgentContext() {
  if (!cachedKnowledge) {
    cachedKnowledge = loadKnowledge();
  }

  return cachedKnowledge;
}
