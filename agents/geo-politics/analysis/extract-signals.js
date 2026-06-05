import OpenAI from "openai";

const client = new OpenAI();

export async function extractSignals(text) {
  const prompt = `
Extract key intelligence signals from this post.
Return JSON with:
{
  "summary": "...",
  "why_it_matters": "...",
  "entities": ["..."],
  "topics": ["..."]
}

Post:
${text}
  `;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(res.choices[0].message.content);
}
