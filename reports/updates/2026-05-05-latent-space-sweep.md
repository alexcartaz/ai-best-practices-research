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

---

## Follow-up sweep — Nov 2025 + Dec 2025 backfill (same day)

The first pass covered Apr 2026 → Jan 17 2026 but did not reach the Nov–Dec 2025 portion of the 6-month window. Backfill added **17 more episodes** and **4 new people** (no duplicates with the first pass).

### Episodes added (17)

**Tier 1-2 — directly relevant:**
- `latent-space-jared-palmer-agent-hq` (2025-11-10) — Jared Palmer (ex-Vercel v0, now SVP GitHub / VP CoreAI Microsoft) on Agent HQ
- `latent-space-google-jules-borovik` (2025-11-10) — Jed Borovik on Google's Jules coding agent
- `latent-space-tenex-10x-engineers` (2025-11-19) — Tenex story-point comp pattern
- `latent-space-gpt5-codex-max` (2025-12-26) — Brian Fioca + Bill Chen (OpenAI Codex)
- `latent-space-one-year-of-mcp` (2025-12-27) — David Soria Parra + AAIF leads (MCP joins Linux Foundation)
- `latent-space-state-of-code-evals` (2025-12-31) — John Yang on SWE-bench / CodeClash

**Tier 3-4 — ingested with `guest_id: null`:**
- state-of-post-training (Josh McGrath / OpenAI), state-of-rl (Ashvin Nair / Cursor), state-of-ai-startups (Sarah Catanzaro / Amplify)
- sam3-meta (Nikhila Ravi + Pengchuan Zhang + Joseph Nelson)
- jailbreaking-pliny (Pliny the Liberator + John V)
- ai-to-aes-mirzadegan, superhuman-houssier, world-models-pim-de-witte
- after-llms-feifei-li (Fei-Fei Li + Justin Johnson, World Labs)
- deedy-das-menlo, biohub-czi

### People added (4)
- **jared-palmer** (Tier 1) — GitHub Agent HQ
- **jed-borovik** (Tier 2) — Google Jules
- **brian-fioca** (Tier 2) — OpenAI Codex Max
- **arman-hezarkhani** (Tier 2) — Tenex consultancy

### Existing people updated
- **david-soria-parra** — added One Year of MCP episode (date corrected from "2025-11" to "2025-12-27")
- **john-yang** — already had State of Code Evals episode from first pass (no update needed)

### QA
- 58 total podcast episodes, 0 duplicate IDs/URLs
- 69 total people, all `guest_id` references resolve

### Backfill scope notes
- Bill Chen (Codex Max co-guest), Alex Lieberman (Tenex co-guest), Ashvin Nair, Josh McGrath, Sarah Catanzaro, and other Tier 3 guests deliberately left as `guest_id: null` rather than minted as new people, matching the first pass's editorial-lens discipline.
- "Edison" (Andrew White, Jan 28 2026), "boltz", "goodfire", "cuspai", "neurips-best-paper", "scientist-simulator", "adversarial-reasoning" remain deferred — same Tier 3-4 reasoning as first pass.
