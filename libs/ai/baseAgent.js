import { getAgentContext } from "./agentContext.js";

export function buildAgentPrompt(userMessage) {
  const knowledge = getAgentContext();

  const contextBlock = knowledge
    .map(chunk => `Source: ${chunk.source}\n${chunk.text}`)
    .join("\n\n");

  return `
You are a domain-aware agent.

Use the following knowledge base when relevant:
${contextBlock}

User message:
${userMessage}
  `;
}
