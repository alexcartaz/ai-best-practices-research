# AI Coding Landscape — Solo Claude Code Subscription Web App Builder

_Last updated: 2026-05-05_

This document is a synthesis of the data files in `data/`. It is regenerated on every weekly run. Editorial lens: a solo developer building web apps using the **Claude Code subscription** (not the API), needing normalized, practical workflows.

---

## 1. What's New This Run (2026-05-05)

### People (4 added)
- **Julius Brussee** — Author of `caveman` (54.6k+) and the broader cave* token-economy stack
- **David Gomes** — Cursor; AIE Europe 2026 talk "Replacing 12K LoC with a 200 LoC Skill"
- **Marc Klingen** — Langfuse co-founder; AIE Europe 2026 talk "Skill issue: skilling up coding agents"
- **Pedro Rodrigues** — Supabase; AIE Europe 2026 talk "Combine Skills and MCP to Close the Context Gap"

### Tools (11 added)
- **Caveman** (54.6k★) — terse-prompting Claude Code skill for ~65% output token cut
- **Open Design / nexu-io** (27.9k★) — local-first OSS Claude Design alternative; ships MCP server
- **agent-skills (Addy Osmani)** (28.8k★) — full SDLC skills bundle for Claude Code
- **skills (Matt Pocock)** (61.2k★) — his .claude/ directory published
- **claude-context (Zilliz)** (10.8k★) — BM25+vector code-search MCP, ~40% token reduction
- **design-extract** (2.2k★) — Playwright-based "extract design system from any live URL" MCP
- **agents (wshobson)** (34.8k★) — pre-built subagent team for full-stack web
- **Archon (coleam00)** (20.8k★) — open-source harness builder for deterministic AI coding
- **claude-code-hooks-mastery** (3.6k★) — canonical hooks reference, all 12 lifecycle events
- **lean-ctx** (1.1k★) — Context-OS (Rust + MCP + shell hooks) for 60-95% token cuts
- **harness (revfactory)** (3.1k★) — meta-skill that designs project-specific agent teams

### Articles (7 added — all from Simon Willison)
- Clinejection (Mar 6) — prompt-injection attack on `claude-code-action@v1` workflow → cache-poisoning → NPM secret theft
- Anti-patterns (Mar 4) — agentic engineering rule #1: never PR unreviewed agent code
- Starlette + Claude skills (Mar 22) — using SKILL.md to inject post-cutoff library knowledge
- Vibe coding SwiftUI (Mar 27)
- README-driven dev (Apr 5) — Lalit Maganti's syntaqlite case study
- "Is Claude Code going to cost $100/month?" (Apr 22) — Cowork rebrand, Max-only experiment
- Codex CLI /goal (Apr 30) — competitor pattern to Claude Code subagents

### Events (3 new announcements)
- AI Engineer World's Fair 2026 (Jun 29 – Jul 2, SF Moscone)
- AI Engineer NYC 2026 (Oct 12-14)
- AI Engineer Code Summit 2026 (Nov, SF — code-focused dedicated track)

### Norms shifted (`recently_changed: true`)
- **Pricing/branding flux**: Claude Code briefly went Max-only ($100-$200) in April; reverted; "Claude Cowork" rebrand surfaced on some signup paths
- **Skills > imperative code**: David Gomes' 60x reduction (12K → 200 LoC) is the new headline data point
- **Hooks for safety = table stakes**: Clinejection attack made this concrete
- **Token-efficiency primitives** are now their own category (caveman, claude-context, lean-ctx)

---

## 2. Top 10 Lists

### Top 10 Design Tools (recency + adoption + practitioner signal)

1. **Open Design (nexu-io)** — local-first Claude Design clone, MCP server, 129 design systems, 27.9k★. Released this window — fills a gap for solo builders who want artifact-first workflow without Anthropic lock-in.
2. **DESIGN.md (Google Labs format)** — 11.7k★. The standard for the design layer in the three-layer governance pattern.
3. **awesome-design-md (VoltAgent)** — 71.6k★. 100+ pre-built DESIGN.md files — drop one in to scaffold a coherent UI.
4. **paper.design (Stephen Haney)** — code-native React+Tailwind canvas; designers ship production components.
5. **design-extract** — 2.2k★. Extract any site's design system as DTCG tokens / Tailwind v4 / shadcn — via MCP.
6. **claude.ai/design** — Anthropic's own design surface; comment-on-element UX is the reference.
7. **Figma Make** — generates editable Figma designs from prompts; bridges prompt → component.
8. **tldraw computer (Steve Ruiz)** — agents on canvas; useful for thinking-in-spatial workflows.
9. **designmd.ai** — VoltAgent's hub + MCP for direct DESIGN.md integration in Claude Code.
10. **Caveman + Open Design YouTube walkthroughs** — practitioner-grade walkthrough content for design tooling.

### Top 10 Repo / Governance Structures (CLAUDE.md, hooks, skills, subagents)

1. **gstack (Garry Tan)** — 89.9k★. The canonical "viral" 23-skill setup; CLAUDE.md as router to specialist roles.
2. **mattpocock/skills** — 61.2k★. Most-starred personal Claude Code skills directory; production-ready.
3. **awesome-claude-skills (Composio)** — 58.2k★. Largest curated Claude skills aggregator.
4. **caveman** — 54.6k★. Most-starred Claude Code skill on GitHub; token-economy default.
5. **awesome-claude-code (hesreallyhim)** — 42.6k★. Curated quality > quantity; skills + hooks + slash commands.
6. **agents (wshobson)** — 34.8k★. Pre-built subagent team for full-stack web.
7. **agent-skills (Addy Osmani)** — 28.8k★. Full SDLC bundle (Define → Ship) with reusable personas.
8. **awesome-claude-code-subagents (VoltAgent)** — 19.2k★. 100+ subagent personas.
9. **karpathy LLM wiki gist** — 27.9k★ (gist). Three-layer raw/wiki/schema cross-session memory pattern.
10. **claude-code-hooks-mastery (disler)** — 3.6k★. Canonical reference for all 12 hook events; the hooks textbook.

### Top 10 Tools for Claude Code Workflows

1. **Sandcastle (Matt Pocock)** — 3.6k★. AFK Docker+worktree orchestration; the practitioner default for parallel runs.
2. **Conductor** — macOS native multi-agent visibility + diff review.
3. **Vibe Kanban** — 14.7k★. Cross-agent kanban orchestration with browser preview built-in.
4. **Playwright MCP** — 5.5k★. The category-defining browser-automation MCP for visual verification.
5. **claude-context (Zilliz)** — 10.8k★. The default code-search MCP for monorepos.
6. **Caveman** — 54.6k★. Token-output compression skill; pairs with cavemem for cross-session memory.
7. **Ruflo (Claude Flow)** — 43.8k★. Heavyweight multi-agent platform; 314 native MCPs.
8. **gbrain (Garry Tan)** — 13.3k★. Persistent agent knowledge base (used in OpenClaw/Hermes).
9. **container-use (Dagger)** — 3.8k★. Container isolation for parallel coding agents.
10. **claude-code-transcripts (Simon Willison)** — 1.5k★. Export sessions to HTML/Gist; the share-your-session tool.

### Top 10 People to Follow

1. **Simon Willison** — highest individual signal-to-noise; Agentic Engineering Patterns guide, security coverage, year-in-LLMs.
2. **Matt Pocock** — solo-practitioner template-setter; Sandcastle, /grill-me, biggest skills repo (61k★).
3. **Addy Osmani** — multi-agent orchestration thinking; agent-skills (28k★), Ralph loop popularizer.
4. **Garry Tan** — gstack made the skills-stack viral; productivity benchmarks.
5. **Brian Scanlan (Intercom)** — only published case study of org-wide Claude Code adoption with hooks/plugins detail.
6. **Andrej Karpathy** — LLM wiki pattern is the cross-session-memory reference; sets norms.
7. **Boris Cherny** — Head of Claude Code at Anthropic; canonical workflow source.
8. **Necati Özmen (VoltAgent)** — runs the dominant awesome-* repos (design-md, subagents, skills).
9. **Julius Brussee** — Caveman + cavekit + cavemem; defining the token-economy school.
10. **Steve Yegge** — NASCAR pit-crew framing; influential mental model for trusting agents.

### Top 5 Podcast Episodes (last 2 months)

1. **Lenny's Podcast — Simon Willison** (Apr 2): "AI state of the union: dark factories are coming" — the inflection-point thesis.
2. **How I AI — Brian Scanlan** (Apr 20): "How Intercom 2x'd engineering velocity in 9 months" — the only org-scale Claude Code case study.
3. **Latent Space — Ryan Lopopolo** (Apr 7): "Extreme Harness Engineering: 1M LOC, 0% human review."
4. **How I AI — John Lindquist**: "Advanced Claude Code techniques: context loading, mermaid diagrams, stop hooks."
5. **Latent Space — Boris Cherny** (Feb 19, slightly outside window but still load-bearing): "Head of Claude Code: What happens after coding is solved."

---

## 3. Topic Deep-Dives

### Repo Template + .md Governance

#### .md governance
Three-layer pattern is the emerging community standard:
- **CLAUDE.md** (behavioral rules)
- **DESIGN.md** (visual rules, Google Labs format — 11.7k★)
- **SKILL.md** (procedures)

CLAUDE.md should be concise, checked into git, and reference DESIGN.md ("Always refer to DESIGN.md when generating UI"). Karpathy's LLM wiki adds a `wiki/` directory as cross-session memory. Brian Scanlan / Intercom and Garry Tan / gstack are the two most-cited reference setups.

#### Hooks
- **Canonical reference**: `disler/claude-code-hooks-mastery` (3.6k★) — covers all 12 lifecycle events.
- **Practitioner default**: Brian Scanlan's Intercom hooks pattern (read-replica only, blocked critical tables, Okta auth, DynamoDB audit).
- **Safety**: After Adnan Khan's "Clinejection" attack (March 2026), hooks on tool/git/PR boundaries are now table-stakes for any team running Claude Code in CI.
- Matt Pocock's `git-guardrails-claude-code` skill ships hook-style protection on dangerous git commands.

#### Skills
**Skills > imperative code** is the new headline thesis (David Gomes, Cursor at AIE Europe 2026: 12K LoC → 200 LoC). Top sources:
- `mattpocock/skills` (61k★) — solo-practitioner reference
- `addyosmani/agent-skills` (28k★) — full SDLC
- `wshobson/agents` (34k★) — pre-built full-stack subagent team
- `gstack` (89k★) — Garry Tan's 23-skill viral set
- Marc Klingen (Langfuse) and Pedro Rodrigues (Supabase) gave practitioner-pitfall talks at AIE Europe 2026.

#### Subagent profiles
- `wshobson/agents` is the new dominant pre-built team.
- `awesome-claude-code-subagents` (VoltAgent, 19k★) is the curated registry.
- `gstack` model: named specialist roles with persona-per-skill-file.
- `revfactory/harness`: meta-skill that *generates* domain-specific subagent teams.

#### Other
- `revfactory/harness` and `coleam00/Archon` (20k★) operationalize Lopopolo's "harness engineering" framing as actual tools.
- README-driven development pattern (Lalit Maganti / syntaqlite) — write README first as the spec.

### Session Management / Context Compaction
Best approaches in 2026, ordered by recency:
1. **Token-efficiency primitives** (May 2026) — Caveman, claude-context, lean-ctx. Three orthogonal strategies (prompting style / retrieval / read-pipeline). Pick at least one for any session that runs long.
2. **Karpathy LLM wiki pattern** (April 2026) — `wiki/` updated by agent for cross-session memory.
3. **Cavemem (Julius Brussee)** — cross-agent compressed-grammar memory layer.
4. **Backup-clear-reload at ~100k tokens** (Matt Pocock / Sandcastle).
5. **/compact with specific instructions**; intervene at ~60% utilization (auto-compact triggers at 80-90%).

### Low-Level Frontend Verification
- `executeautomation/mcp-playwright` (5.5k★) remains the standard.
- Microsoft Playwright CLI ~4x fewer tokens than full accessibility tree streaming.
- New: `design-extract` MCP turns "compare what I built to the design" into a tool call.
- Marlene Mhangami's "Beyond Code Coverage: Functionality Testing with Playwright" (AIE Europe 2026) — emerging functional-test thinking.

### Testing / TDD
- Simon Willison's red/green TDD as the load-bearing forcing function.
- Be explicit with Claude that you're doing TDD to prevent premature mock implementations.
- `wshobson/agents` includes a `test-automator` subagent.
- Laurie Voss workshop "Ship Real Agents: Hands-On Evals" at AIE Europe 2026.

### Design Systems
- **DESIGN.md three-layer pattern** + VoltAgent's awesome-design-md (71.6k★) + paper.design.
- Open Design (nexu-io, 27.9k★, May 2026) — open-source Claude Design clone with MCP.
- design-extract — extracts any site's design system to DTCG tokens via Playwright.

### Design Tooling (under-researched topic)
- **Open Design (nexu-io)** is the breakout this run — local-first, MCP-exposed, multi-CLI, 129 design systems.
- **design-extract** — fastest path from "I like that site" to a working tokens config.
- **paper.design** — code-native canvas at the component layer.
- **claude.ai/design** — comment-on-element UX is still the gold standard for fast iteration.
- **tldraw computer** — spatial canvas for design + agent workflows.

### Unified Project Layer
- **Conductor** (macOS) and **Vibe Kanban** (14.7k★) are the leaders for cross-project visibility.
- **Intent (Augment Code)** — Amelia Wattenberger's "last 30%" workspace concept.
- Maggie Appleton's AIE Europe 2026 talk "One Developer, Two Dozen Agents, Zero Alignment" — the canonical articulation of the gap.
- README-driven development pattern for unified spec → multiple sessions.

### MCP Servers for Claude Code
1. **Playwright MCP** — highest-value for web app dev.
2. **claude-context (Zilliz)** — default for monorepo code search.
3. **design-extract** — design system extraction.
4. **Open Design MCP** — live design tokens / CSS / components.
5. **designmd.ai MCP** — DESIGN.md integration.
6. Pedro Rodrigues' "skills + MCP together" framing is the design pattern to adopt.

### Multi-Agent Orchestration
- **Built-in Claude Agent Teams** (team lead + teammates with own contexts).
- **Subagents** for isolated parallel work.
- **Conductor** + **Vibe Kanban** for cross-agent dashboards.
- **Sandcastle** for AFK Docker+worktree runs.
- **Archon** (coleam00, 20k★) — harness builder for deterministic runs.
- **Ralph Loops** (Chris Parsons, AIE Europe 2026) — autonomous re-feed loop pattern.
- Decision rule: only multi-agent when phases are genuinely async or need different specialists.

---

## 4. Industry Norms Snapshot

**Adoption (May 2026):**
- Copilot ~41.8% / Cursor ~27.3% / Claude Code ~12.5% / Windsurf ~9.4% raw share — but Claude Code leads in CSAT (91%) and most-loved (46%).
- 95% of engineers use AI tools weekly+; 75% for 50%+ of work; 55% regularly use agents (63.5% for staff+ engineers).
- 70% stack 2-4 tools; canonical pattern is Cursor + Claude Code.
- 🆕 **Pricing flux**: Claude Code briefly Max-only ($100-200) in April; reverted; "Claude Cowork" rebrand surfaced.

**Models:**
- **Sonnet 4.6** — main coding workhorse ($3/$15)
- **Opus 4.6 / 4.7** — architecture, deep reasoning ($25 output)
- **Haiku 4.5** — high-volume / classification / file reads (5x cheaper than Opus)

**Workflow:**
- 🆕 **Skills > imperative code** (David Gomes 60x reduction at AIE Europe 2026)
- 🆕 **Three-layer .md governance**: CLAUDE.md + DESIGN.md + SKILL.md
- 🆕 **Token-efficiency primitives** are now a category
- 🆕 **Hooks for safety = table stakes** post-Clinejection
- TDD as forcing function; Playwright MCP for visual verification
- LLM wiki / cross-session memory; backup-clear-reload at ~100k

---

## 5. People Registry

(38 people tracked — selected highlights below; full list in `data/people.json`.)

| Person | Focus | Why follow |
|---|---|---|
| Simon Willison | LLM tooling / agentic eng patterns | Highest signal individual blogger; Agentic Engineering Patterns guide |
| Matt Pocock | Claude Code subscription / TS | Sandcastle author; 61k★ skills repo; cohort courses |
| Addy Osmani | Multi-agent / FE | agent-skills (28k★); Ralph loop; orchestra essays |
| Garry Tan | Skills / startup tooling | gstack (89k★); productivity benchmarks |
| Brian Scanlan | Enterprise Claude Code | Only org-scale case study (Intercom) |
| Andrej Karpathy | LLM fundamentals | LLM wiki pattern; cross-session memory reference |
| Boris Cherny | Anthropic / Claude Code | Head of the product |
| Necati Özmen | Awesome-* repos | VoltAgent design-md, subagents, skills |
| Julius Brussee | Token economy | Caveman, cavekit, cavemem stack |
| Stephen Haney | Design tooling | paper.design — code-native canvas |
| Maggie Appleton | Multi-agent + design | "Two Dozen Agents, Zero Alignment" canonical |
| Amelia Wattenberger | Design + orchestration | Intent (Augment); "last 30%" framing |
| Steve Ruiz | Canvas tooling | tldraw computer; agents on canvas |
| Steve Yegge | Vibe coding manifesto | NASCAR pit-crew mental model |
| David Gomes | Skills (Cursor) | 12K → 200 LoC SKILL.md case study |
| Marc Klingen | Skills (Langfuse) | "Skill issue" — practical SKILL.md pitfalls |
| Pedro Rodrigues | Skills + MCP (Supabase) | Skills+MCP-as-pair pattern |
| John Lindquist | Education (Vercel) | Claude Code Power User workshops |
| Ryan Lopopolo | Harness engineering (OpenAI) | Coined the term; 1M LOC experiment |
| Armin Ronacher | Agent-legible codebases | Flask creator; "Friction is your judgment" |
| Solomon Hykes | Containerization | container-use; Dagger CEO |
| Sam Colvin | MCP / Pydantic | "MCP is all you need" |
| David Soria Parra | MCP at Anthropic | MCP co-creator |
| swyx | AI engineering community | Latent Space; AI Engineer events |
| Gergely Orosz | Industry analysis | Pragmatic Engineer survey data |
| Claire Vo | Practitioner workflows | How I AI host (70+ episodes) |
| Patrick Debois | Context engineering | Coined DevOps; "Context is the new Code" |
| Jason Gorman | TDD + AI | Codemanship — TDD with AI agents analysis |
