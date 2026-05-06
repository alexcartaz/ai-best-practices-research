# Focused Sweep: AI Engineer Events — Speaker Ingestion

You are a research agent doing a **single-source, exhaustive sweep** of all AI Engineer conference events.

## Repo location
`~/Desktop/workflow-ai/projects/ai-best-practices-research/`

## Editorial lens

**Primary audience:** A solo developer building web apps using Claude Code subscription (not API, not Cursor). Needs normalized, practical workflows.

**Relevance tiers:**
1. **Directly relevant:** Claude Code workflows, CLAUDE.md/skills/hooks, web app dev with AI, MCP servers, browser testing, design systems
2. **Adaptable (include with note):** API-based patterns with transferable structure — note the adaptation gap in notable_contributions
3. **Useful context:** Orchestration theory, infra, evals — still include if the speaker is a practitioner shipping real tools
4. **Out of scope:** Pure exec/keynote commentary, AI for non-dev use cases, marketing content

## Your job

Sweep all AI Engineer events. For each event:
1. Populate the full `all_speakers` list if it's empty
2. Cross-reference every speaker against `data/people.json`
3. Ingest untracked speakers who pass the relevance filter

---

## Step 1 — Read current state

Read `data/events.json`. You'll find these events:
- `ai-engineer-europe-2026` — 40 speakers already listed, 9 notable_talks
- `ai-engineer-worlds-fair-2025` — 28 speakers already listed, 8 notable_talks
- `ai-engineer-worlds-fair-2026` — 0 speakers (needs population)
- `ai-engineer-nyc-2026` — 0 speakers (needs population)
- `ai-engineer-code-summit-2026` — 0 speakers (needs population)

Read `data/people.json` to know who is already tracked.

---

## Step 2 — Populate empty events

For events with 0 speakers, fetch the event page from `aiengineer.com` or the event's `url` field in events.json. Get the full speaker/session list.

For each speaker found:
```json
{
  "name": "Full Name",
  "talk": "Talk title",
  "url": "talk URL if available, else null",
  "track": "track name if available",
  "day": "day 1 / day 2 / etc if available"
}
```

Deduplicate by name — one entry per speaker even if they gave multiple talks (keep the most relevant talk title).

Update `data/events.json` with the populated `all_speakers` arrays.

---

## Step 3 — Cross-reference all speakers against people.json

For ALL events (including the two already populated), go through every entry in `all_speakers` and check if the speaker is already in `data/people.json` (fuzzy name match — "Chris Chedeau" = "Christopher Chedeau").

Build two lists:
- **Already tracked**: name appears in people.json
- **Not yet tracked**: not in people.json

---

## Step 4 — Filter untracked speakers

For each untracked speaker, assess relevance using the talk title and any available description:

**Ingest if:**
- Talk title mentions: Claude, Claude Code, MCP, agent, workflow, coding, design, testing, hooks, skills, CLAUDE.md, web, tool, context, memory, LLM, AI engineering, harness, verification, browser
- Speaker is from a company building AI dev tooling (Anthropic, Cursor, GitHub, Vercel, Linear, etc.)
- Speaker's GitHub (if findable) shows repos related to AI dev workflows

**Skip if:**
- Talk is pure enterprise sales / compliance / marketing
- Speaker is C-suite exec with no hands-on tooling content (unless talk title is directly relevant)
- Talk is about non-dev AI use cases

When in doubt, ingest and note the uncertainty in `notable_contributions`.

---

## Step 5 — Person ingestion for each untracked, relevant speaker

Run this procedure for each speaker being added:

### Find profiles
- Check the AI Engineer speaker page bio for links
- Try `github.com/[handle]` — the speaker bio often lists their GitHub
- Try `bsky.app/profile/[handle].bsky.social`
- Try `x.com/[handle]`
- Try `[handle].substack.com`
- Try their personal website from the bio
- Fetch each candidate URL — 200 with their name = confirmed, otherwise null

### Write person record
```json
{
  "id": "firstname-lastname",
  "name": "Full Name",
  "category": "dev | design | dev-adjacent | orchestration | education",
  "focus": ["topic-area"],
  "profiles": {
    "github": null,
    "bsky": null,
    "x": null,
    "linkedin": null,
    "substack": null,
    "medium": null,
    "youtube": null,
    "website": null
  },
  "talks": [
    {
      "title": "Talk title",
      "event": "AI Engineer [Event Name]",
      "url": null,
      "date": "YYYY-MM-DD",
      "topics": ["topic-id"]
    }
  ],
  "podcast_episodes": [],
  "notable_contributions": ["What they built/shared relevant to the lens"],
  "is_new": true,
  "added": "2026-05-05",
  "last_updated": "2026-05-05"
}
```

Category guide:
- `dev` — primarily software engineers who code
- `dev-adjacent` — PMs, researchers, designers working closely with dev workflows  
- `orchestration` — focused on AI orchestration, multi-agent, infra
- `education` — primarily educators, tutorial creators
- `design` — design systems practitioners

Topic IDs (use from `data/topics.json`):
- `repo-template-governance`, `session-management`, `low-level-fe-verification`, `testing-tdd`, `design-systems`, `design-tooling`, `unified-project-layer`, `mcp-servers`, `multi-agent-orchestration`

### Also update their talks array on existing people
For speakers already in people.json who gave a talk at an AI Engineer event that isn't in their `talks` array — add it.

---

## Step 6 — notable_talks for events

For each event, the `notable_talks` array should contain the highest-signal talks (those most relevant to the editorial lens). After ingesting speakers, update `notable_talks` for any event where you found strong Tier 1 content not already listed.

notable_talk structure:
```json
{
  "speaker_id": "person-id",
  "title": "Talk title",
  "url": null,
  "topics": ["topic-id"]
}
```

Only add to notable_talks if the speaker is now tracked in people.json (so speaker_id resolves).

---

## Step 7 — QA

- No duplicate IDs in people.json
- All `speaker_id` references in `notable_talks` exist in people.json
- No speaker listed twice in any `all_speakers` array
- Any `speaker_id` that doesn't resolve → set to null and write an agent-question

---

## Step 8 — Write update report

Write `reports/updates/2026-05-05-ai-engineer-sweep.md`:
```
# AI Engineer Speaker Sweep — 2026-05-05

## Events processed
- [event id]: N speakers enumerated, N already tracked, N newly ingested

## New people added
[list with one-line rationale each]

## Existing people updated (new talk added)
[list]

## Skipped (out of scope)
[brief list with reason]

## Notable finds
[anything high-signal for the editorial lens]
```

---

## Step 9 — Commit

Commit all changes with message: `research: ai engineer speaker sweep 2026-05-05`

---

## Scope guardrails

- DO NOT update LANDSCAPE.md or industry_norms.json — data only
- DO NOT process inbox.json
- DO NOT sweep any other sources
- Prioritize events with 0 speakers first (populate them), then cross-reference existing populated events
- If context is running low, prioritize Tier 1 speakers and skip Tier 3 borderline cases
