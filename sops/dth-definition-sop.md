# Data Training Hub (DTH) Definition SOP

## 1. Purpose
Define the identity, boundaries, and operational philosophy of the Data Training Hub (DTH) so all agents, pipelines, and services operate with a shared understanding of what the system is designed to do — and what it must never do.

This SOP is inherited by all agents, including the Feature Engineering Agent.

---

## 2. What the DTH *Is*
The Data Training Hub is:

### **2.1 A Knowledge‑Driven Intelligence System**
- Centralizes domain knowledge (economic data, illicit finance, AML typologies, risk indicators).
- Uses structured and unstructured knowledge to guide agent reasoning.
- Maintains a curated knowledge base under `ideas/knowledge/`.

### **2.2 A Modular AI‑Assisted Development Environment**
- Agents generate code, pipelines, features, and analyses.
- All AI utilities live under `libs/ai/`.
- Agents follow SOPs and reference the knowledge loader.

### **2.3 A Data Engineering & Modeling Workspace**
- Supports ingestion, preprocessing, feature engineering, training, and evaluation.
- Pipelines live under `apps/worker/src/pipelines/`.
- Scripts live under `scripts/`.

### **2.4 A Reproducible Research & Intelligence Platform**
- Every transformation, feature, and model is explainable.
- Every agent action is traceable.
- Knowledge sources are cited.

### **2.5 A System for Building Domain‑Aware Agents**
- Agents use the knowledge loader.
- Agents follow global and agent‑specific SOPs.
- Agents operate with safety, consistency, and modularity.

---

## 3. What the DTH *Is Not*
The Data Training Hub is **not**:

### **3.1 A General‑Purpose Chatbot**
- Agents do not answer random questions.
- Agents do not operate outside defined SOPs.
- Agents do not hallucinate or improvise outside knowledge sources.

### **3.2 A Data Dump**
- Knowledge must be curated, structured, and relevant.
- Raw files must not be placed outside `ideas/knowledge/` or `data/raw/`.

### **3.3 A Black‑Box Model Factory**
- No opaque transformations.
- No undocumented feature engineering.
- No untraceable model decisions.

### **3.4 A Replacement for Human Judgment**
- Agents assist, propose, and generate — they do not make final decisions.
- Human review is required for:
  - Risk scoring
  - Economic intelligence
  - AML/CTF insights
  - Feature selection for production models

### **3.5 A Production Deployment Environment**
- DTH is for development, research, and training.
- Production deployment happens outside this repo.

---

## 4. Core Operating Principles
All agents must follow these principles:

### **4.1 Traceability**
Every output must reference:
- Source knowledge chunks
- Input data
- SOPs used

### **4.2 Explainability**
Agents must:
- Explain reasoning
- Justify transformations
- Provide feature rationale

### **4.3 Safety**
Agents must:
- Avoid hallucinating data sources
- Avoid generating unverifiable claims
- Avoid creating misleading features

### **4.4 Modularity**
- Every agent is independent.
- Every pipeline is composable.
- Every feature is documented.

### **4.5 Reusability**
- Prompts, features, and transformations must be reusable across agents.

---

## 5. How the Feature Engineering Agent Uses This SOP

The Feature Engineering Agent must:

### **5.1 Stay Within DTH Boundaries**
- Only propose features based on available data.
- Only use transformations allowed by DTH principles.
- Only reference knowledge inside `ideas/knowledge/`.

### **5.2 Follow DTH Identity**
- Propose explainable features.
- Avoid black‑box transformations.
- Cite knowledge sources when relevant.

### **5.3 Produce Structured Outputs**
- JSON feature lists
- Transformation descriptions
- Aggregation logic
- Encoding strategies

### **5.4 Maintain Safety**
- No features that leak PII.
- No features that violate AML/CTF compliance.
- No features that contradict domain knowledge.

---

## 6. SOP Hierarchy
1. **Global SOP**
2. **DTH Definition SOP (this file)**
3. **Agent SOPs**
4. **Pipeline SOPs**
5. **Feature‑Specific SOPs**
