# AI Engineer Speaker Sweep — 2026-05-05

Single-source, exhaustive sweep across all five AI Engineer event records in `data/events.json`.

## Events processed

- **ai-engineer-europe-2026**: 39 speakers enumerated (was 40, deduped Philipp Schmid double-listing). 20 already tracked, 19 newly ingested.
- **ai-engineer-worlds-fair-2025**: 28 speakers enumerated. 14 already tracked, 13 newly ingested (Paige Bailey ingested under her Europe 2026 entry; appears in both events).
- **ai-engineer-worlds-fair-2026**: 0 speakers — schedule not yet announced. CFP open via Sessionize, closes 2026-06-05; speakers announced 2026-06-02.
- **ai-engineer-nyc-2026**: 0 speakers — page reads "Details Coming Soon — Speaker applications open after World's Fair."
- **ai-engineer-code-summit-2026**: 0 speakers — 2026 SF edition is TBA. The /code page currently shows the Nov 2025 NYC edition; no 2026 schedule posted.

Re-run sweep after 2026-06-02 to capture WF 2026 announcements (logged as `q-20260505-005`).

## New people added (28)

**Tier 1 — directly relevant to Claude Code / web-app dev:**
- Vincent Koc — "Dark Factory" autonomy + governance pattern
- Marlene Mhangami — Playwright + functional testing (low-level FE verification)
- Louis Knight-Webb — "Plan and review" SWE workflow framing
- Ben Burtenshaw — coding agents extending into AI system engineering
- Sally-Ann DeLucia — hierarchical memory patterns for long-running agents
- Matan Grinberg + Eno Reyes (Factory.ai) — long-running mission-style multi-agent shipping
- Eric Allam (Trigger.dev) — durable agents (replay vs snapshot)
- Christopher Chedeau (vjeux, Meta) — design engineering / AI whiteboarding
- Robert Brennan (All Hands AI / OpenHands) — open-source SWE-agent practitioner
- Victor Dibia (MS / AutoGen) — multi-agent UX principles
- Theodora Chu (Anthropic) — MCP origins / product
- Kitze — solo dev / personal AI agent journey
- Mario Zechner — solo dev shipping agentic side projects
- Radek Sienkiewicz — solo dev personal-agent experiment
- Paige Bailey (Google DeepMind) — Gemini DevRel + workshops
- Philipp Schmid (DeepMind) — agent engineering pitfalls
- Rustin Banks — early parallel-agent management talk

**Tier 2 — useful context / framing:**
- Malte Ubl (Vercel CTO) — "The New Application Layer"
- Cristina Poncela Cubeiro — co-presenter on agent friction with Armin
- Sarah Chieng — "Fast Models Need Slow Developers" frame
- Mike Spitz — engineering org redesign for agent-heavy teams
- Hugo Santos — CI/CD vs continuous-compute framing
- Harrison Chase (LangChain) — enterprise agent reliability ingredients
- Scott Wu (Cognition / Devin) — Devin 2.0 and SWE-agent design
- Yegor Denisov-Blanch (Stanford) — empirical 100k-dev AI productivity study
- Sam Bhagwat (Mastra.ai) — agents vs workflows complementarity
- Eric Simons (StackBlitz / Bolt.new) — competing AI app builder surface

## Existing people updated (new talk added)

- `brian-scanlan` — added Europe 2026 keynote
- `shawn-wang` — added Europe 2026 AMA
- `david-soria-parra` — added WF 2025 MCP Origins talk
- `john-yang` — added WF 2025 SWE-bench talk
- `amelia-wattenberger` — added WF 2025 "The last 30%" talk

All other already-tracked speakers had their relevant AIE talk already in their `talks` array (verified via audit script).

## notable_talks updates

- **Europe 2026**: added 7 entries (marlene-mhangami, louis-knight-webb, vincent-koc, sally-ann-delucia, ben-burtenshaw, david-gomes). Total now 16.
- **WF 2025**: added 4 entries (amelia-wattenberger, christopher-chedeau, robert-brennan, victor-dibia). Total now 12.

All `speaker_id` references verified to resolve in people.json.

## Skipped (out of scope / Tier 3)

- **Raia Hadsell** (DeepMind) — pure frontier-research keynote; not dev tooling
- **Omar Sanseviero** (DeepMind) — Gemma model release keynote; not dev tooling
- **Greg Brockman** (OpenAI) — exec keynote ("#define AI Engineer")
- **Shafik Quoraishee** (NYT) — game theory case study; non-dev AI use case

## Notable finds

- **Vincent Koc / "Dark Factory"** — direct articulation of the autonomy+governance tension. Pairs with Mario Zechner's "Building pi in a World of Slop" as a solo-dev voice on shipping fast without producing slop.
- **Louis Knight-Webb / "Plan and Review"** — clean two-mode framing (plan, then review the diff) that maps directly onto Claude Code plan-mode + git-diff workflow. Tier 1.
- **Marlene Mhangami / Beyond Code Coverage** — the only AIE Europe 2026 talk explicitly addressing the low-level FE verification gap (Playwright + functional testing).
- **Sally-Ann DeLucia / Hierarchical Memory** — the talk most directly relevant to the session-management gap; covers the layered (short-term / episodic / semantic) memory pattern.
- **Ben Burtenshaw / Coding Agent should do AI System Engineering** — expands the surface of what to delegate to a Claude-Code-class agent (evals, datasets, finetunes), not just code edits.
- **Christopher Chedeau (vjeux) / AI + Whiteboarding** — strongest design-engineering signal from WF 2025; the human-AI collaborative-design loop framing.
- **Victor Dibia / UX for Multi-Agent Systems** — direct match for the unified-project-layer gap.
- **Factory.ai** (Matan Grinberg + Eno Reyes) — both founders ingested; "Missions That Ship for Days" is the canonical long-horizon multi-agent reference point.

## Scope notes

- Did not update `LANDSCAPE.md` or `industry_norms.json` (per instructions).
- Did not process `inbox.json` (per instructions).
- Did not sweep any other sources (per instructions).
- Profile-lookup verification was best-effort only — handles guessed from prior knowledge are noted in `q-20260505-004` for follow-up batch verification.
- Three events (WF 2026, NYC 2026, Code Summit 2026) had no public schedules; logged in `q-20260505-005` for re-sweep after 2026-06-02.
