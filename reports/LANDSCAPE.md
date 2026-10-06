# AI Coding Landscape — Solo Claude Code Subscription Web App Builder

_Last updated: 2026-10-06_

This document is a synthesis of the data files in `data/`. It is regenerated on every weekly run. Editorial lens: a solo developer building web apps using the **Claude Code subscription** (not the API), needing normalized, practical workflows.

---

## 1. What's New This Run (2026-10-06)

### People (2 added)
- **Zack Proser** (WorkOS, Applied AI Engineer) — Voice-first Claude Code workflow at 179 WPM (WisprFlow); built Handwave watchOS app to control Claude Code from wrist; AIEWF 2026 "Lifestyles of the AI-Native" workshop
- **Mahesh Murag** (Anthropic, Applied AI Engineer) — MCP co-creator alongside David Soria Parra; delivered free 2-hour MCP workshop at AIEWF 2026 — now the canonical free reference for MCP foundations

### Tools (2 updated / 1 added)
- **Claude Code Mods** (new, Oct 1 2026, v2.1.287) — TypeScript/JS functions with programmatic access to Claude Code internals; distinct from shell hooks; enables custom tool wrappers, output transformers, conditional logic
- **mattpocock/skills** (updated) — v1.1 (July 8 2026) adds "alignment surfaces": structured checkpoints where agent surfaces its interpretation before starting work

### Articles (1 added)
- **Simon Willison "2026 in LLMs (so far)"** (Sep 27) — WeAreDevelopers World Congress keynote; argues November 2025 as the real inflection point; 12% of all public GitHub commits now from Claude Code

### Events
- **AI Engineer World's Fair 2026** — marked complete; 29 tracks, 300 speakers, 6000+ attendees, Moscone West. 3 high-signal talks populated.
- **AI Engineer NYC 2026** — coming Oct 12-14 (6 days away)

### Norms shifted (`recently_changed: true`)
- **Claude Sonnet 5 is now the default model** in Claude Code subscription (1M token context window, Aug 2026)
- **Background Agents** (Aug 2026) — agents continue running when session idle or terminal closed
- **Agent View** (Aug 2026) — single-pane visibility across all running subagents
- **Claude Code Mods** (Oct 2026) — TypeScript/JS hooks into Claude Code internals, distinct from shell hooks
- **Scale milestones**: 12% of public GitHub commits, 4.2M WAU (Simon Willison Sep 27 keynote)

---

## 2. Top 10 Lists

### Top 10 Design Tools (recency + adoption + practitioner signal)

1. **Open Design (nexu-io)** — local-first Claude Design clone, MCP server, 129 design systems, 27.9k★. Fills the gap for solo builders who want artifact-first workflow without Anthropic lock-in.
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
2. **mattpocock/skills** — 61.2k★. Most-starred personal Claude Code skills directory; v1.1 adds alignment surfaces.
3. **awesome-claude-skills (Composio)** — 58.2k★. Largest curated Claude skills aggregator.
4. **caveman** — 54.6k★. Most-starred Claude Code skill on GitHub; token-economy default.
5. **awesome-claude-code (hesreallyhim)** — 42.6k★. Curated quality > quantity; skills + hooks + slash commands; home of early Claude Code Mods examples.
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

1. **Simon Willison** — highest individual signal-to-noise; Agentic Engineering Patterns guide, security coverage, year-in-LLMs. Sep 27 keynote is the most current state-of-field.
2. **Matt Pocock** — solo-practitioner template-setter; Sandcastle, /grill-me, biggest skills repo (61k★); v1.1 alignment surfaces.
3. **Addy Osmani** — multi-agent orchestration thinking; agent-skills (28k★), Ralph loop popularizer.
4. **Garry Tan** — gstack made the skills-stack viral; productivity benchmarks.
5. **Brian Scanlan (Intercom)** — only published case study of org-wide Claude Code adoption with hooks/plugins detail.
6. **Andrej Karpathy** — LLM wiki pattern is the cross-session-memory reference; sets norms.
7. **Boris Cherny** — Head of Claude Code at Anthropic; canonical workflow source; AIEWF 2026 internals talk.
8. **Zack Proser** _(new)_ — voice-first Claude Code workflow; AIEWF 2026 "Lifestyles of the AI-Native"; watchOS Handwave app.
9. **Mahesh Murag** _(new)_ — MCP co-creator; free 2-hour AIEWF 2026 workshop is the canonical MCP foundations reference.
10. **Julius Brussee** — Caveman + cavekit + cavemem; defining the token-economy school.

### Top 5 Podcast Episodes (last 2 months — Aug–Oct 2026)

_No new episodes ingested this run from the Aug–Oct window. Below are the standing top entries from the prior window for reference; will refresh next run after sweeping podcast feeds._

1. **Lenny's Podcast — Simon Willison** (Apr 2026): "AI state of the union: dark factories are coming" — the inflection-point thesis.
2. **How I AI — Brian Scanlan** (Apr 2026): "How Intercom 2x'd engineering velocity in 9 months."
3. **Latent Space — Ryan Lopopolo** (Apr 2026): "Extreme Harness Engineering: 1M LOC, 0% human review."
4. **How I AI — John Lindquist**: "Advanced Claude Code techniques: context loading, mermaid diagrams, stop hooks."
5. **Latent Space — Boris Cherny** (Feb 2026): "Head of Claude Code: What happens after coding is solved."

---

## 3. Topic Deep-Dives

### Repo Template + .md Governance

#### .md governance
Three-layer pattern is the community standard:
- **CLAUDE.md** (behavioral rules)
- **DESIGN.md** (visual rules, Google Labs format — 11.7k★)
- **SKILL.md** (procedures)

CLAUDE.md should be concise, checked into git, and reference DESIGN.md ("Always refer to DESIGN.md when generating UI"). Karpathy's LLM wiki adds a `wiki/` directory as cross-session memory. Brian Scanlan / Intercom and Garry Tan / gstack are the two most-cited reference setups.

#### Hooks (and now Mods)
- **Canonical reference**: `disler/claude-code-hooks-mastery` (3.6k★) — covers all 12 lifecycle events.
- **Practitioner default**: Brian Scanlan's Intercom hooks pattern (read-replica only, blocked critical tables, Okta auth, DynamoDB audit).
- **Safety**: After Adnan Khan's "Clinejection" attack (March 2026), hooks on tool/git/PR boundaries are now table-stakes for any team running Claude Code in CI.
- Matt Pocock's `git-guardrails-claude-code` skill ships hook-style protection on dangerous git commands.
- **NEW (Oct 2026): Claude Code Mods** — TypeScript/JS functions with programmatic access to agent internals. Hooks are still the default; Mods are for cases that need agent-state awareness (e.g. output transformers, conditional tool routing). Community examples accumulating in awesome-claude-code.

#### Skills
**Skills > imperative code** is the headline thesis (David Gomes, Cursor at AIE Europe 2026: 12K LoC → 200 LoC). Top sources:
- `mattpocock/skills` (61k★) — solo-practitioner reference; v1.1 alignment surfaces
- `addyosmani/agent-skills` (28k★) — full SDLC
- `wshobson/agents` (34k★) — pre-built full-stack subagent team
- `gstack` (89k★) — Garry Tan's 23-skill viral set
- Marc Klingen (Langfuse) and Pedro Rodrigues (Supabase) gave practitioner-pitfall talks at AIE Europe 2026.

#### Subagent profiles
- `wshobson/agents` is the dominant pre-built team.
- `awesome-claude-code-subagents` (VoltAgent, 19k★) is the curated registry.
- `gstack` model: named specialist roles with persona-per-skill-file.
- `revfactory/harness`: meta-skill that generates domain-specific subagent teams.

### Session Management / Context Compaction
Best approaches in 2026, ordered by recency:
1. **Background Agents** (Aug 2026) — agents continue running after terminal closes; restart fresh rather than compact. Changes default from "agent runs while I watch" to "agent runs overnight, I review in the morning."
2. **Agent View** (Aug 2026) — single pane to monitor all running background agents; review each agent's context separately.
3. **Token-efficiency primitives** (May 2026) — Caveman, claude-context, lean-ctx. Three orthogonal strategies. Pick at least one for any session that runs long.
4. **Karpathy LLM wiki pattern** (April 2026) — `wiki/` updated by agent for cross-session memory.
5. **Cavemem (Julius Brussee)** — cross-agent compressed-grammar memory layer.
6. **Backup-clear-reload at ~100k tokens** (Matt Pocock / Sandcastle).
7. **/compact with specific instructions**; intervene at ~60% utilization (auto-compact triggers at 80-90%).

### Low-Level Frontend Verification
- `executeautomation/mcp-playwright` (5.5k★) remains the standard.
- Microsoft Playwright CLI ~4x fewer tokens than full accessibility tree streaming.
- `design-extract` MCP turns "compare what I built to the design" into a tool call.
- Marlene Mhangami's "Beyond Code Coverage: Functionality Testing with Playwright" (AIE Europe 2026).

### Testing / TDD
- Simon Willison's red/green TDD as the load-bearing forcing function.
- Be explicit with Claude that you're doing TDD to prevent premature mock implementations.
- `wshobson/agents` includes a `test-automator` subagent.
- Matt Pocock's /grill-me before implementation to prevent premature coding.

### Design Systems
- **DESIGN.md three-layer pattern** + VoltAgent's awesome-design-md (71.6k★) + paper.design.
- Open Design (nexu-io, 27.9k★) — open-source Claude Design clone with MCP.
- design-extract — extracts any site's design system to DTCG tokens via Playwright.

### Design Tooling
- **Open Design (nexu-io)** — local-first, MCP-exposed, multi-CLI, 129 design systems.
- **design-extract** — fastest path from "I like that site" to a working tokens config.
- **paper.design** — code-native canvas at the component layer.
- **claude.ai/design** — comment-on-element UX is still the gold standard for fast iteration.

### Unified Project Layer
- **Conductor** (macOS) and **Vibe Kanban** (14.7k★) are the leaders for cross-project visibility.
- **Agent View** (Aug 2026, built-in) — reduces need for external orchestration UI for Background Agent monitoring.
- Maggie Appleton's AIE Europe 2026 talk "One Developer, Two Dozen Agents, Zero Alignment" — the canonical articulation of the gap.

### MCP Servers for Claude Code
1. **Playwright MCP** — highest-value for web app dev.
2. **claude-context (Zilliz)** — default for monorepo code search.
3. **design-extract** — design system extraction.
4. **Open Design MCP** — live design tokens / CSS / components.
5. **designmd.ai MCP** — DESIGN.md integration.
6. Pedro Rodrigues' "skills + MCP together" framing (AIE Europe 2026) is the design pattern to adopt.
7. Mahesh Murag's AIEWF 2026 workshop is the canonical free "how MCP works" reference.

### Multi-Agent Orchestration
- **Built-in Claude Agent Teams** (team lead + teammates with own contexts).
- **Background Agents** (Aug 2026, built-in) — AFK runs without external tooling.
- **Subagents** for isolated parallel work.
- **Conductor** + **Vibe Kanban** for cross-agent dashboards.
- **Sandcastle** for AFK Docker+worktree runs.
- **Archon** (coleam00, 20k★) — harness builder for deterministic runs.
- **Ralph Loops** (Chris Parsons, AIE Europe 2026) — autonomous re-feed loop pattern.
- Decision rule: only multi-agent when phases are genuinely async or need different specialists.

### Background Agents / Agent View (new topic — Aug 2026)
Claude Code can now run agents in the background while the terminal is closed. Agent View provides a single pane to monitor all running agents. Key workflow shift: decompose a task backlog into independent units, dispatch as Background Agents, review diffs in the morning rather than babysitting in real-time. Complements Sandcastle and Conductor rather than replacing them (those provide Git worktree + Docker isolation that Background Agents don't).

---

## 4. Industry Norms Snapshot

**Adoption (Oct 2026):**
- Copilot ~41.8% / Cursor ~27.3% / Claude Code ~12.5% raw share — but Claude Code leads CSAT (91%) and most-loved (46%).
- **12% of all public GitHub commits** now originate from Claude Code (Simon Willison Sep 27 keynote).
- **4.2M weekly active users** as of September 2026.
- 95% of engineers use AI tools weekly+; 75% for 50%+ of work; 55% regularly use agents.
- 70% stack 2-4 tools; canonical pattern is Cursor + Claude Code.

**Models (updated Oct 2026):**
- **Sonnet 5** 🆕 — default model in Claude Code subscription since August 2026; 1M token context window
- **Sonnet 4.6** — still viable for cost-sensitive subagent work ($3/$15)
- **Opus 4.6 / 4.7** — architecture, deep reasoning ($25 output)
- **Haiku 4.5** — high-volume / classification / file reads (5x cheaper than Opus)

**Workflow:**
- 🆕 **Background Agents** (Aug 2026) — agents run while terminal is closed; overnight task drains are now native
- 🆕 **Agent View** (Aug 2026) — single pane across all running subagents
- 🆕 **Claude Code Mods** (Oct 2026) — TypeScript/JS hooks into Claude Code internals; complements shell hooks
- **Skills > imperative code** (David Gomes 60x reduction at AIE Europe 2026)
- **Three-layer .md governance**: CLAUDE.md + DESIGN.md + SKILL.md
- **Token-efficiency primitives**: caveman, claude-context, lean-ctx
- **Hooks for safety = table stakes** post-Clinejection (March 2026)
- TDD as forcing function; Playwright MCP for visual verification
- LLM wiki / cross-session memory; backup-clear-reload at ~100k

---

## 5. People Registry

(101 people tracked — selected highlights below; full list in `data/people.json`.)

| Person | Focus | Why follow |
|---|---|---|
| Simon Willison | LLM tooling / agentic eng patterns | Highest signal individual blogger; Sep 27 WeAreDevelopers keynote is current state-of-field |
| Matt Pocock | Claude Code subscription / TS | Sandcastle author; 61k★ skills repo; v1.1 alignment surfaces |
| Addy Osmani | Multi-agent / FE | agent-skills (28k★); Ralph loop; orchestra essays |
| Garry Tan | Skills / startup tooling | gstack (89k★); productivity benchmarks |
| Brian Scanlan | Enterprise Claude Code | Only org-scale case study (Intercom) |
| Andrej Karpathy | LLM fundamentals | LLM wiki pattern; cross-session memory reference |
| Boris Cherny | Anthropic / Claude Code | Head of the product; AIEWF 2026 internals talk |
| Zack Proser | Voice-first dev / MCP | WorkOS; AIEWF 2026 workshop; Handwave watchOS app; 179 WPM via WisprFlow |
| Mahesh Murag | MCP / agent frameworks | Anthropic MCP co-creator; free 2-hr AIEWF 2026 workshop = canonical MCP reference |
| Julius Brussee | Token economy | Caveman, cavekit, cavemem stack |
| Necati Özmen | Awesome-* repos | VoltAgent design-md, subagents, skills |
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
