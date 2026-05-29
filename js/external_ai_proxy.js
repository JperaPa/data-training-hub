import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Load API keys from environment variables
const CLAUDE_KEY = process.env.CLAUDE_KEY;
const GEMINI_KEY = process.env.GEMINI_KEY;
const DEEPSEEK_KEY = process.env.DEEPSEEK_KEY;

// CLAUDE
app.post("/claude/review", async (req, res) => {
  const packet = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": CLAUDE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Review this system audit and provide recommendations:\n\n${JSON.stringify(
            packet,
            null,
            2
          )}`
        }
      ]
    })
  });

  const data = await response.json();
  res.json({ model: "claude", review: data });
});

// GEMINI
app.post("/gemini/review", async (req, res) => {
  const packet = req.body;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Review this system audit and provide recommendations:\n\n${JSON.stringify(
                  packet,
                  null,
                  2
                )}`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  res.json({ model: "gemini", review: data });
});

// DEEPSEEK
app.post("/deepseek/review", async (req, res) => {
  const packet = req.body;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DEEPSEEK_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: `Review this system audit and provide recommendations:\n\n${JSON.stringify(
            packet,
            null,
            2
          )}`
        }
      ]
    })
  });

  const data = await response.json();
  res.json({ model: "deepseek", review: data });
});

app.listen(5001, () => {
  console.log("External AI Proxy running on port 5001");
});