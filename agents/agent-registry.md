# Agent Registry — Data Training Hub (DTH)

This registry tracks all active and planned agents in the DTH system.  
Each agent includes: purpose, inputs, outputs, dependencies, and SOP reference.

---

## 1. Knowledge Ingestion Agent
- **Purpose:** Load, chunk, tag, and index knowledge files.
- **Folder:** /agents/knowledge-ingestion/
- **SOP:** /sops/agents/knowledge-ingestion-sop.md

## 2. Knowledge Summarization Agent
- **Purpose:** Convert raw knowledge into structured summaries.
- **Folder:** /agents/knowledge-summarization/
- **SOP:** /sops/agents/knowledge-summarization-sop.md

## 3. SOP Enforcement Agent
- **Purpose:** Ensure all agents and pipelines follow SOPs.
- **Folder:** /agents/sop-enforcement/
- **SOP:** /sops/agents/sop-enforcement-sop.md

## 4. Data Pipeline Builder Agent
- **Purpose:** Generate ingestion, preprocessing, and training pipelines.
- **Folder:** /agents/data-pipeline-builder/
- **SOP:** /sops/agents/data-pipeline-builder-sop.md

## 5. Economic Data Fetcher Agent
- **Purpose:** Pull external economic datasets (BEA, IMF, UNODC, etc.).
- **Folder:** /agents/economic-data-fetcher/
- **SOP:** /sops/agents/economic-data-fetcher-sop.md

## 6. Risk Typology Mapping Agent
- **Purpose:** Map criminal typologies and produce structured JSON.
- **Folder:** /agents/risk-typology-mapping/
- **SOP:** /sops/agents/risk-typology-mapping-sop.md

## 7. Dashboard Content Agent
- **Purpose:** Generate dashboard text, insights, and alerts.
- **Folder:** /agents/dashboard-content/
- **SOP:** /sops/agents/dashboard-content-sop.md

## 8. Data Quality Agent
- **Purpose:** Detect missing values, schema drift, anomalies.
- **Folder:** /agents/data-quality/
- **SOP:** /sops/agents/data-quality-sop.md

## 9. Feature Engineering Agent
- **Purpose:** Propose features and transformations for modeling.
- **Folder:** /agents/feature-engineering/
- **SOP:** /sops/agents/feature-engineering-sop.md

---

# ⭐ NEW AGENT ADDED

## 10. Daily Session Summarizer Agent (DSSA)
- **Purpose:** Capture, summarize, and store daily conversations between user and AI.
- **Inputs:** Raw transcript, date, user goals, global SOP.
- **Outputs:** Markdown file saved to `/logs/sessions/YYYY-MM-DD.md`
- **Folder:** `/agents/daily-session-summarizer/`
- **SOP:** `/sops/agents/daily-session-summarizer-sop.md`
- **Dependencies:**  
  - Global SOP  
  - User Goals  
  - Transcript Collector (future agent)  
- **Summary Schema:**  
  - High-Level Summary  
  - Key Decisions  
  - Technical Actions  
  - Blockers  
  - Next Steps  
  - Alignment with Goals/SOPs  

---

# ⭐ Folder Structure to Add

Add this to your repo:

data-training-hub/
agents/
daily-session-summarizer/
index.js
summarizer-sop.md
schema.json
logs/
sessions/
(auto-generated daily logs)

---

# ⭐ Want me to generate the **full agent folder** next?
I can generate:

- `index.js` (working agent code)
- `summarizer-sop.md` (full SOP)
- `schema.json` (machine-readable summary schema)
- `README.md` for the agent

Just tell me **“generate the full DSSA agent folder”** and I’ll produce everything in one clean block.