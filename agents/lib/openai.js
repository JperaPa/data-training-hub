import { createAPIClient } from "./api.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is not set. OpenAI client will fail.");
}

export const openai = createAPIClient(
  "https://api.openai.com/v1",
  {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  }
);

// Unified OpenAI wrapper for all agents
export async function runOpenAI(prompt) {
  const response = await openai.post("/responses", {
    model: "gpt-5.4-mini",
    input: prompt
  });

  // Extract output_text from the new Responses API format
  const text =
    response?.output?.[0]?.content?.[0]?.text ||
    response?.output_text ||
    null;

  if (!text) {
    console.error("❌ Full OpenAI response:", JSON.stringify(response, null, 2));
    throw new Error("OpenAI returned no output_text");
  }

  return text.trim();
}
