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

export async function runOpenAI(prompt) {
  const result = await openai.post("/responses", {
    model: "gpt-5.4-mini",
    input: prompt
  });

  if (!result.output_text) {
    throw new Error("OpenAI returned no output_text");
  }

  return result.output_text.trim();
}
