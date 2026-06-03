# Global SOP for Data Training Hub

## 1. Purpose
Define how agents, pipelines, and services operate within the system.

## 2. Core Principles
- Consistency
- Traceability
- Explainability
- Safety
- Modularity
- Reusability

## 3. Agent Behavior Standards
- Always reference knowledgeLoader chunks when relevant
- Follow agent-specific SOPs
- Log reasoning steps internally
- Never hallucinate data sources
- Always cite source files when using knowledge

## 4. Data Handling Standards
- Raw data → data/raw/
- Processed data → data/processed/
- Training data → data/training/
- Models → data/models/

## 5. Code Standards
- All AI utilities → libs/ai/
- All services → apps/api/src/services/
- All pipelines → apps/worker/src/pipelines/

## 6. SOP Hierarchy
1. Global SOP (this file)
2. Agent SOPs
3. Pipeline SOPs
4. Feature-specific SOPs
