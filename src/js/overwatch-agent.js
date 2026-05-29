/**
 * overwatch-compliance.js
 *
 * Responsible for:
 *  - Loading recommendation ledger and daily progress
 *  - Sending a compliance review payload to external AIs
 *  - Consolidating AI feedback
 *  - Logging reviews to data/processed/overwatch_reviews.json
 *  - Running the trajectory engine and attaching its result to the feedback
 *
 * Notes:
 *  - Requires environment variables for external AIs (GEMINI_API_KEY, ANTHROPIC_API_KEY)
 *  - Does not modify system state or code
 */

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const LEDGER_PATH = path.join(__dirname, "../../data/processed/recommendation_ledger.json");
const PROGRESS_PATH = path.join(__dirname, "../../data/processed/daily_progress.json");
const REVIEW_LOG_PATH = path.join(__dirname, "../../data/processed/overwatch_reviews.json");

// Trajectory engine (called inside the flow)
const runTrajectoryEngine = require("./trajectory-engine");

// Ensure directories exist
fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
fs.mkdirSync(path.dirname(REVIEW_LOG_PATH), { recursive: true });

// ---------------- Safe JSON read with recovery ----------------
function safeReadJson(p) {
  if (!fs.existsSync(p)) return [];
  try {
    const raw = fs.readFileSync(p, "utf8").trim();
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[OVERWATCH] Malformed JSON at ${p}. Resetting to []`);
    try {
      fs.writeFileSync(p, "[]");
    } catch (werr) {
      console.error(`[OVERWATCH] Failed to reset ${p}:`, werr);
    }
    return [];
  }
}

// ---------------- Logging ----------------
function logReview(review) {
  let existing = [];
  if (fs.existsSync(REVIEW_LOG_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(REVIEW_LOG_PATH, "utf8") || "[]");
    } catch (err) {
      console.error("[OVERWATCH] Failed to read existing review log:", err);
      existing = [];
    }
  }
  existing.push(review);
  try {
    fs.writeFileSync(REVIEW_LOG_PATH, JSON.stringify(existing, null, 2));
  } catch (err) {
    console.error("[OVERWATCH] Failed to write review log:", err);
  }
}

// ---------------- External AI calls ----------------
// These functions call external APIs and expect the model to return strict JSON.
// They throw on missing API keys so the caller can handle failures.

async function callGemini(promptPayload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;
  const body = {
    contents: [
      {
        parts: [
          {
            text: promptPayload
          }
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return { model: "Gemini", raw: text, parsed: JSON.parse(text) };
}

async function callClaude(promptPayload) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const url = "https://api.anthropic.com/v1/messages";
  const body = {
    model: "claude-3-sonnet-20240229",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: promptPayload
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  const text = data?.content?.[0]?.text || "{}";
  return { model: "Claude", raw: text, parsed: JSON.parse(text) };
}

// ---------------- Compose prompt ----------------
function buildCompliancePrompt(payload) {
  return `You are an oversight AI. Evaluate the following system state for compliance with doctrine and mission intent.
Return strict JSON with fields:
{
  "complianceScore": 0-1,
  "deviations": [string],
  "correctiveActions": [string],
  "confidence": 0-1
}
Payload: ${JSON.stringify(payload)}
Respond with JSON only.`;
}

// ---------------- Consolidation ----------------
function consolidateComplianceResults(results) {
  // results: array of parsed objects from models
  const valid = results.filter(r => r && r.parsed);
  if (!valid.length) {
    return {
      timestamp: new Date().toISOString(),
      complianceScore: 0,
      deviations: [],
      correctiveActions: [],
      models: [],
      confidence: 0
    };
  }

  const scores = valid.map(r => (r.parsed.complianceScore || 0));
  const confidence = valid.map(r => (r.parsed.confidence || 0));
  const deviations = valid.flatMap(r => r.parsed.deviations || []);
  const correctiveActions = valid.flatMap(r => r.parsed.correctiveActions || []);
  const models = valid.map(r => r.model);

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const avgConfidence = confidence.reduce((a, b) => a + b, 0) / confidence.length;

  return {
    timestamp: new Date().toISOString(),
    complianceScore: Math.max(0, Math.min(1, avgScore)),
    deviations: Array.from(new Set(deviations)),
    correctiveActions: Array.from(new Set(correctiveActions)),
    models,
    confidence: Math.max(0, Math.min(1, avgConfidence))
  };
}

// ---------------- Main exported function ----------------
/**
 * runComplianceEngine
 * - Loads ledger and progress
 * - Sends payload to external AIs
 * - Consolidates results
 * - Runs trajectory engine and attaches it to feedback
 * - Logs the review
 *
 * Returns the consolidated feedback object.
 */
async function runComplianceEngine() {
  console.log("[OVERWATCH] Starting compliance review...");

  // Load inputs (tolerant)
  const ledger = safeReadLedger();
  const progress = safeReadProgress();

  // Build payload for external AIs
  const payload = {
    doctrineVersion: "1.0",
    missionIntent: "Build a fully autonomous AML intelligence hub",
    ledgerSummary: {
      totalRecommendations: ledger.length,
      implemented: ledger.filter(r => r.implemented).length,
      pending: ledger.filter(r => r.approved && !r.implemented).length
    },
    recentProgressWindow: progress.slice(-90),
    sampleLedger: ledger.slice(-20)
  };

  const prompt = buildCompliancePrompt(payload);

  // Call external AIs in parallel but tolerate failures
  const aiCalls = [];
  try {
    aiCalls.push(callGemini(prompt));
  } catch (e) {
    console.warn("[OVERWATCH] Gemini call skipped:", e.message);
  }
  try {
    aiCalls.push(callClaude(prompt));
  } catch (e) {
    console.warn("[OVERWATCH] Claude call skipped:", e.message);
  }

  let aiResults = [];
  if (aiCalls.length) {
    try {
      aiResults = await Promise.allSettled(aiCalls);
      // normalize results: keep fulfilled parsed responses, log rejects
      aiResults = aiResults.map(r => {
        if (r.status === "fulfilled") return r.value;
        console.error("[OVERWATCH] External AI call failed:", r.reason);
        return null;
      }).filter(Boolean);
    } catch (err) {
      console.error("[OVERWATCH] External AI calls failed:", err);
      aiResults = [];
    }
  } else {
    console.warn("[OVERWATCH] No external AI keys configured; skipping external review.");
  }

  // Consolidate compliance
  const consolidated = consolidateComplianceResults(aiResults);

  // Build feedback object
  const feedback = {
    timestamp: new Date().toISOString(),
    payloadSummary: payload,
    consolidated,
    rawAIResponses: aiResults.map(r => ({ model: r.model, raw: r.raw }))
  };

  // Run trajectory engine and attach result (do not let it crash the flow)
  try {
    const trajectory = await runTrajectoryEngine();
    feedback.trajectory = trajectory;
  } catch (err) {
    console.error("[OVERWATCH] Trajectory engine failed:", err);
    feedback.trajectory = {
      error: "Trajectory engine failed",
      timestamp: new Date().toISOString()
    };
  }

  // Persist review
  try {
    logReview(feedback);
  } catch (err) {
    console.error("[OVERWATCH] Failed to log review:", err);
  }

  console.log("[OVERWATCH] Compliance review complete.");
  return feedback;
}

// ---------------- Helper readers ----------------
function safeReadLedger() {
  return safeReadJson(LEDGER_PATH);
}
function safeReadProgress() {
  return safeReadJson(PROGRESS_PATH);
}

// Export
module.exports = runComplianceEngine;