import { ai } from "../../../libs/ai/aiClient.js";
import { buildAgentPrompt } from "../../../libs/ai/baseAgent.js";

export async function analyzeIllicitFlows(query) {
  const prompt = buildAgentPrompt(query);

  const res = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }]
  });

  return res.choices[0].message.content;
}
