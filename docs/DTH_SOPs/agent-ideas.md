
	Wants from agents:
				Pattern Recognition (narrative/propaganda deconstruction), cordinate convos between various AI's with push of a button. Eventually conduct auto quaries for data/information
				Training/education (self-improvement road mapping) maximizing coding/learning to code
				cybersecurity checks
				
=======
Wants from agents:
				Add recruiter roles:
					recruiter/scout agent idea to track jobs (tracks role descriptions and my experience alignment)
					feed trainer/training agent on role (sar writer,AML/BSA Analyst, big bank transaction monitoring) requirements
					feed logic on DTH is
										conducts homework/background work to properly source


		

# DATA TRAINING HUB — AGENT ARCHITECTURE (MASTER BLUEPRINT)

============================================================
TIER 1 — EXECUTIVE LAYER
============================================================

1. OVERWATCH AGENT (EXECUTIVE SUPERVISOR)

Purpose:
    Overwatch is the supervisory intelligence layer responsible for maintaining
    the operational integrity, workflow continuity, and system health of the
    Data Training Hub (DTH). It ensures that all agents, pipelines, and data
    flows operate within expected parameters and alerts the user when
    intervention is required.

Core Functions:
    - Cybersecurity checks
    - Scheduled "npm ls" integrity scans
    - Memory junk purging / system stabilize actions
    - System health monitoring (CPU, RAM, disk, processes)
    - System vs Internet speed monitoring
    - Goal tracking (short, medium, long-term)
    - Human-in-the-loop checkpoints for major actions
    - Integration of home network devices (Alexa, Apple messaging, etc.)
    - Supervises all agents and enforces safety boundaries

============================================================
TIER 2 — SPECIALIST AGENTS
============================================================

2. FINANCE INTELLIGENCE AGENT
Purpose:
    Personal finance education, budgeting support, forecasting, and financial
    literacy development.

Functions:
    - Budget planning and tracking
    - Financial modeling and projections
    - Spending insights and categorization
    - Long-term financial planning education

------------------------------------------------------------

3. OSINT & KNOWLEDGE AGENT
Purpose:
    Open-source intelligence gathering for learning, awareness, and personal
    knowledge expansion (NOT for investigations).

Functions:
    - Summaries of global events, geopolitics, economics
    - Monitoring of relevant news streams
    - Contextual analysis for personal understanding
    - Feeds intelligence into Overwatch for situational awareness

------------------------------------------------------------

4. TRAINING & LEARNING AGENT
Purpose:
    Skill development in coding, analytics, and technical growth.

Functions:
    - Python, SQL, JavaScript learning paths
    - Exercises, quizzes, and practice tasks
    - Progress tracking and adaptive curriculum
    - Integration with your DTH dashboard

------------------------------------------------------------

5. SANCTIONS & POLICY EDUCATION AGENT
Purpose:
    Education on sanctions frameworks, history, implementation, and updates.
    (NOT a screening or investigation agent.)

Functions:
    - Explain sanctions regimes (OFAC, UN, EU, etc.)
    - Provide historical context and case studies
    - Track updates and policy changes
    - Teach implementation mechanics and compliance concepts

------------------------------------------------------------

6. INFRA / SYSTEM SCOUT AGENT
Purpose:
    Local machine diagnostics and environment monitoring.

Functions:
    - CPU, RAM, disk, process monitoring
    - Detect runaway processes
    - Report system anomalies to Overwatch
    - Validate dev environment health (Node, Python, venv, etc.)

------------------------------------------------------------

7. DECISION ENGINE AGENT
Purpose:
    Structured decision-making support.

Functions:
    - Weighted scoring models
    - Pros/cons breakdowns
    - Scenario analysis
    - Human final choice required

============================================================
TIER 3 — SAFETY & COMPLIANCE
============================================================

8. LOCAL SAFETY AGENT
Purpose:
    Guardrails and safe execution validation.

Functions:
    - Validate commands before execution
    - Prevent destructive operations
    - Enforce Overwatch safety rules
    - Provide human override checkpoints

============================================================
TIER 4 — PIPELINES & UTILITIES (NOT AGENTS)
============================================================

These are tools used BY agents, not agents themselves.

Utilities:
    - System stabilize scripts
    - Memory purge utilities
    - npm integrity scan utilities
    - Data pipelines
    - Daily intelligence feeds
    - Dashboard modules
    - Automated workflows

============================================================
HUMAN-IN-THE-LOOP CHECKPOINTS
============================================================

1. Overwatch → Human approval before:
    - System changes
    - File writes
    - Financial recommendations
    - OSINT summaries
    - Sanctions/policy educational outputs
    - Training plans

2. Safety Agent → Human override on risk

3. Decision Engine → Human final choice

============================================================
END OF FILE
============================================================