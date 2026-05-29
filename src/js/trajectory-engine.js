/**
 * Trajectory Engine
 * - Computes short/medium/long term alignment scores
 * - Builds trend series from daily_progress and recommendation_ledger
 * - Calls external AIs for forecasting and corrective actions
 * - Writes consolidated trajectory to data/processed/trajectory.json
 *
 * Environment variables required:
 *  - GEMINI_API_KEY
 *  - ANTHROPIC_API_KEY
 *  - OPENAI_API_KEY (optional)
 */

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const LEDGER_PATH = path.join(__dirname, "../../data/processed/recommendation_ledger.json");
const PROGRESS_PATH = path.join(__dirname, "../../data/processed/daily_progress.json");
const TRAJECTORY_PATH = path.join(__dirname, "../../data/processed/trajectory.json");

fs.mkdirSync(path.dirname(TRAJECTORY_PATH), { recursive: true });

function safeReadJson(p) {
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    console.error("[TRAJECTORY] Failed to parse", p, e);
    return [];
  }
}

// ---------- Utility metrics ----------
function lastNDays(series, n) {
  if (!Array.isArray(series)) return [];
  return series.slice(-n);
}

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function normalizeScore(x) {
  if (!isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

// ---------- Build indicators ----------
function buildIndicators(progressSeries, ledger) {
  // progressSeries: array of daily snapshots with fields like ce.readinessScore, finance.netCashFlow, etc.
  const readinessSeries = progressSeries.map(p => (p.ce && p.ce.readinessScore) || null).filter(v => v !== null);
  const detectionSeries = progressSeries.map(p => (p.typology && p.typology.detections) || null).filter(v => v !== null);

  const shortWindow = 14;
  const medWindow = 60;
  const longWindow = 180;

  const shortReadiness = mean(lastNDays(readinessSeries, shortWindow));
  const medReadiness = mean(lastNDays(readinessSeries, medWindow));
  const longReadiness = mean(lastNDays(readinessSeries, longWindow));

  // Implementation velocity: fraction of approved recommendations implemented in last 30 days
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const recentRecs = ledger.filter(r => r.approved && r.implementationDate && (new Date(r.implementationDate).getTime() > now - THIRTY_DAYS));
  const approvedRecent = ledger.filter(r => r.approved && (new Date(r.approvalDate || r.implementationDate || 0).getTime() > now - THIRTY_DAYS));
  const implementationVelocity = approvedRecent.length ? (recentRecs.length / approvedRecent.length) : 0;

  // Expected vs actual impact: simple proxy using ledger.actualImpact presence
  const impactFulfillment = ledger.length ? (ledger.filter(r => r.implemented && r.actualImpact).length / ledger.filter(r => r.implemented).length || 0) : 0;

  return {
    short: {
      readiness: normalizeScore(shortReadiness / 100),
      detectionTrend: normalizeScore(mean(lastNDays(detectionSeries, shortWindow)) || 0),
      implementationVelocity: normalizeScore(implementationVelocity),
      impactFulfillment: normalizeScore(impactFulfillment)
    },
    medium: {
      readiness: normalizeScore(medReadiness / 100),
      detectionTrend: normalizeScore(mean(lastNDays(detectionSeries, medWindow)) || 0),
      implementationVelocity: normalizeScore(implementationVelocity),
      impactFulfillment: normalizeScore(impactFulfillment)
    },
    long: {
      readiness: normalizeScore(longReadiness / 100),
      detectionTrend: normalizeScore(mean(lastNDays(detectionSeries, longWindow)) || 0),
      implementationVelocity: normalizeScore(implementationVelocity),
      impactFulfillment: normalizeScore(impactFulfillment)
    }
  };
}

// ---------- External AI forecasting ----------
async function callExternalForecast(payload) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const prompt = `You are an oversight AI. Given the payload below, return strict JSON with:
{
  "forecast": {
    "probabilityMissionOnTrack": 0-1,
    "monthsToTargetProbability": number,
    "shortTermAdvice": [],
    "mediumTermAdvice": [],
    "longTermAdvice": []
  },
  "confidence": 0-1
}
Payload: ${JSON.stringify(payload)}
Respond with JSON only.`;

  const results = [];

  // Gemini
  if (geminiKey) {
    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      results.push({ model: "Gemini", raw: text, parsed: JSON.parse(text) });
    } catch (e) {
      console.error("[TRAJECTORY] Gemini error", e);
    }
  }

  // Claude
  if (claudeKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": claudeKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text || "{}";
      results.push({ model: "Claude", raw: text, parsed: JSON.parse(text) });
    } catch (e) {
      console.error("[TRAJECTORY] Claude error", e);
    }
  }

  // OpenAI optional
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800
        })
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || "{}";
      results.push({ model: "OpenAI", raw: text, parsed: JSON.parse(text) });
    } catch (e) {
      console.error("[TRAJECTORY] OpenAI error", e);
    }
  }

  return results;
}

// ---------- Consolidate forecasts ----------
function consolidateForecasts(results) {
  const parsed = results.map(r => r.parsed).filter(Boolean);
  if (!parsed.length) {
    return {
      forecast: {
        probabilityMissionOnTrack: 0,
        monthsToTargetProbability: null,
        shortTermAdvice: [],
        mediumTermAdvice: [],
        longTermAdvice: []
      },
      confidence: 0
    };
  }

  const prob = mean(parsed.map(p => (p.forecast && p.forecast.probabilityMissionOnTrack) || 0));
  const months = mean(parsed.map(p => (p.forecast && p.forecast.monthsToTargetProbability) || 0));
  const shortAdvice = parsed.flatMap(p => (p.forecast && p.forecast.shortTermAdvice) || []);
  const medAdvice = parsed.flatMap(p => (p.forecast && p.forecast.mediumTermAdvice) || []);
  const longAdvice = parsed.flatMap(p => (p.forecast && p.forecast.longTermAdvice) || []);
  const confidence = mean(parsed.map(p => p.confidence || 0));

  return {
    forecast: {
      probabilityMissionOnTrack: normalizeScore(prob),
      monthsToTargetProbability: months || null,
      shortTermAdvice: Array.from(new Set(shortAdvice)),
      mediumTermAdvice: Array.from(new Set(medAdvice)),
      longTermAdvice: Array.from(new Set(longAdvice))
    },
    confidence: normalizeScore(confidence)
  };
}

// ---------- Main entry ----------
async function runTrajectoryEngine() {
  console.log("[TRAJECTORY] Running trajectory engine...");

  const ledger = safeReadJson(LEDGER_PATH);
  const progress = safeReadJson(PROGRESS_PATH);

  const indicators = buildIndicators(progress, ledger);

  const payload = {
    missionIntent: "Build a fully autonomous AML intelligence hub",
    doctrineVersion: "1.0",
    indicators,
    ledgerSummary: {
      totalRecommendations: ledger.length,
      implemented: ledger.filter(r => r.implemented).length,
      pending: ledger.filter(r => r.approved && !r.implemented).length
    },
    recentProgressWindow: progress.slice(-90)
  };

  const aiResults = await callExternalForecast(payload);
  const consolidated = consolidateForecasts(aiResults);

  const trajectory = {
    timestamp: new Date().toISOString(),
    indicators,
    forecast: consolidated.forecast,
    confidence: consolidated.confidence,
    modelsUsed: aiResults.map(r => r.model),
    rawAIResponses: aiResults.map(r => ({ model: r.model, raw: r.raw })),
    note: "Trajectory engine does not change system state. All recommendations require explicit user approval."
  };

  try {
    fs.writeFileSync(TRAJECTORY_PATH, JSON.stringify(trajectory, null, 2));
  } catch (e) {
    console.error("[TRAJECTORY] Failed to write trajectory file", e);
  }

  return trajectory;
}

module.exports = runTrajectoryEngine;
