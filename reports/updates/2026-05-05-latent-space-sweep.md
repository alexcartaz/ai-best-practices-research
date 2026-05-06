# Latent Space Focused Sweep — 2026-05-05

Episodes enumerated: ~39 interview episodes (Nov 2025 – May 2026 window). The full sitemap also lists ~70 "ainews-*" newsletter posts from this window — those are AI news roundups, not interview podcast content, so they were excluded.

Episodes already tracked: 1 (`harness-eng` — Ryan Lopopolo)
New episodes added: 28
Tier 3 / out-of-editorial-lens episodes ingested with `guest_id: null` and noted in summary: 7 (lupsasca, applied-intuition, aie-europe-debrief, noetik, moonlake, voxtral, materials)
Older Tier 3 episodes (boltz, edison, science, scientist-simulator, adversarial-reasoning, goodfire, cuspai, neurips-best-paper) deferred — pure-research episodes outside the editorial lens; can be ingested in a follow-up sweep if needed.

## New people added (27)

**Tier 1 — directly relevant to Claude Code / web-app dev:**
- Mikhail Parakhin (Shopify CTO) — critique-loop pattern
- Simon Last + Sarah Sachs (Notion) — agent-as-native-primitive architecture
- David Singleton (Dreamer / ex-Stripe CTO) — agent OS pattern
- Felix Rieseberg (Anthropic, Claude Cowork PM) — skills + sandbox + browser-integration thesis
- Simon Hørup Eskildsen (Turbopuffer) — agentic retrieval at scale
- Jonas Gebhardt (Cursor) — cloud-agent video-first review pattern
- Aaron Levie (Box) — "every agent needs a box" framing
- Ankit Jain (Aviator) — spec-driven verification replacing code review
- Doug O'Laughlin (SemiAnalysis) — Claude Code as junior-analyst for knowledge work
- James Reggio (Brex CTO) — multi-tool, multi-agent orchestration in production

**Tier 2 — context / industry framing:**
- Marc Andreessen, Dylan Patel, Joel Becker (METR), Nathan Lambert, Sebastian Raschka, Mia Glaese, Olivia Watkins, Martin Casado, Sarah Wang, Jeff Dean, Yi Tay, George Cameron, Micah Hill-Smith, Anastasios Angelopoulos, Kyle Kranen, Nader Khalil

## Existing people updated
None — no previously-tracked people guested on Latent Space in this window other than Ryan Lopopolo (already had `harness-eng` tracked).

## Notable finds
- **Felix Rieseberg / Claude Cowork (felix-anthropic, 2026-03-17)** — direct Anthropic guidance on skills-as-portable-automation, sandboxed delegation, and native browser integration over MCP-only flows. Highest-signal episode for the editorial lens this window.
- **Aaron Levie / "Every Agent Needs a Box" (2026-03-05)** — clean pattern frame for Claude Code subagent isolation: bounded filesystem, distinct identity, persistent workspace, continuous oversight (vs human-employee privacy). Maps cleanly to git-worktree + sandbox-tool pattern.
- **Mikhail Parakhin / Shopify (2026-04-22)** — practical counter to "more parallel agents = better": critique loops where one agent generates and another critiques. Lower latency cost than expected for the quality lift.
- **Notion's Token Town (2026-04-15)** — "give models what they want" simplification arc (XML → Markdown → SQL-like). Notion rebuilt agents 4-5×. Formalized "Model Behavior Engineer" role.
- **Cursor's Third Era (2026-03-06)** — video-first review of agent runs. Watch demos before reading diffs. Slash commands `/repro` and `/no_test`. Adapt the pattern, not the product.
- **Brex's AI Hail Mary (2026-01-17)** — re-interviewed all engineers (incl. managers) on agentic coding. Strong signal that fluency, not tooling choice, is the lever.
- **SWE-Bench Verified retired (2026-02-23)** — 60%+ of remaining problems unsolvable. Industry shifting to SWE-Bench Pro. Affects how we read coding-agent benchmarks going forward.
- **Doug O'Laughlin / valuemule (2026-02-24)** — Claude Code 1-year-anniversary special. Knowledge-work adaptation pattern (agent as "junior analyst") is the closest direct analog to a solo-dev workflow.

## Scope notes
- Did not update `LANDSCAPE.md` or `industry_norms.json` (per instructions).
- Did not process `inbox.json` (per instructions).
- Did not sweep other sources (per instructions).
- Tier 3 person records were not created to keep the sweep focused on the editorial lens; the episodes are in the file with `guest_id: null` and clear Tier 3 notes in the summary so they can be picked up later.
