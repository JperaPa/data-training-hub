#!/usr/bin/env node
/**
 * Test Harness for MCPP Enforcement Agent Schema
 * Validates sample output against schema.json using AJV.
 */

import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

// Load schema
const schemaPath = path.join(process.cwd(), "agents", "mcpp-enforcement", "schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

// Initialize AJV
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile(schema);

// -----------------------------
// Sample Valid Output
// -----------------------------
const sampleValid = {
  date: "2026-06-04",
  overallStatus: "Partial",
  steps: {
    problemFraming: { status: "Compliant", notes: "Problem clearly defined." },
    coaDevelopment: { status: "Partial", notes: "COA options incomplete." },
    coaWargaming: { status: "Missing", notes: "No wargaming conducted." },
    coaComparisonDecision: { status: "Partial", notes: "Decision criteria unclear." },
    ordersDevelopment: { status: "Missing", notes: "No orders drafted." },
    transition: { status: "Compliant", notes: "Transition considerations documented." }
  },
  findings: [
    "coaWargaming: Missing — No wargaming conducted.",
    "ordersDevelopment: Missing — No orders drafted."
  ],
  recommendations: [
    "Conduct COA wargaming against at least 3 enemy COAs.",
    "Develop a 5-paragraph order for the selected COA."
  ],
  alignment: {
    missionAlignment: "Planning aligns with DTH mission.",
    readinessAssessment: "Planning incomplete; not ready for execution."
  },
  sourceFiles: {
    transcript: "logs/transcripts/2026-06-04.txt",
    sessionSummary: "logs/sessions/2026-06-04.md",
    reflection: "logs/reflections/2026-06-04.md"
  }
};

// -----------------------------
// Sample Invalid Output
// -----------------------------
const sampleInvalid = {
  date: "June 4th, 2026", // ❌ wrong format
  overallStatus: "OK",   // ❌ invalid enum
  steps: {},             // ❌ missing required step objects
  findings: "none",      // ❌ must be array
  recommendations: [],
  alignment: {
    missionAlignment: "ok"
    // ❌ missing readinessAssessment
  },
  sourceFiles: {
    transcript: null,
    sessionSummary: null,
    reflection: null
  }
};

// -----------------------------
// Test Runner
// -----------------------------
function runTest(name, data) {
  const valid = validate(data);

  console.log(`\n=== ${name} ===`);
  if (valid) {
    console.log("✅ PASS — Schema validation succeeded");
  } else {
    console.log("❌ FAIL — Schema validation errors:");
    console.log(validate.errors);
  }
}

runTest("Valid Sample Output", sampleValid);
runTest("Invalid Sample Output", sampleInvalid);
