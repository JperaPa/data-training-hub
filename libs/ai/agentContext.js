import { loadKnowledge } from "./knowledgeLoader.js";

let cachedKnowledge = null;

export function getAgentContext() {
  if (!cachedKnowledge) {
    cachedKnowledge = loadKnowledge();
  }

  return cachedKnowledge;
}
