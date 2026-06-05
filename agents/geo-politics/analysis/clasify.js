import OpenAI from "openai";

const client = new OpenAI();

export async function classifyPost(text) {
  const prompt = `
Classify the following post into one category:
- Regulatory Change
- Enforcement Action
- Sanctions Update
- Illicit Finance Trend
- Geopolitical Risk
- Other

Post:
${text}

Return ONLY the category.
  `;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return res.choices[0].message.content.trim();
}
