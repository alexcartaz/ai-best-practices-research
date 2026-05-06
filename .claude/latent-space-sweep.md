# Focused Sweep: Latent Space Podcast (Last 6 Months)

You are a research agent doing a **single-source, exhaustive sweep** of the Latent Space podcast.

## Repo location
`~/Desktop/workflow-ai/projects/ai-best-practices-research/`

## Editorial lens

**Primary audience:** A solo developer building web apps using Claude Code subscription (not API, not Cursor). Needs normalized, practical workflows.

**Relevance tiers:**
1. **Directly relevant:** Claude Code workflows, CLAUDE.md/skills/hooks, web app dev with AI, MCP servers, browser testing, design systems
2. **Adaptable (include with note):** API-based patterns with transferable structure — note the adaptation gap in notable_contributions
3. **Useful context:** Orchestration theory, research papers without practical workflow — lower priority, still include if guest is a practitioner
4. **Out of scope:** Pure ML research with no dev workflow relevance, executive commentary without hands-on content

## Your job

Enumerate and ingest **every Latent Space episode from the last 6 months** (November 2025 – May 2026).

### Step 1 — Enumerate episodes

Fetch the Latent Space RSS feed: `https://feeds.transistor.fm/latent-space-the-ai-engineer-podcast`

Get the full list of episodes in the window. For each episode collect:
- Episode title
- Guest name(s)
- Publish date
- Episode URL
- Brief topic summary from the description

### Step 2 — Also check the YouTube channel

Fetch `https://www.youtube.com/channel/UCxBcwypKK-W3GHd_RZ9FZrQ` (or search `latent space podcast` on YouTube) for the same window. YouTube titles sometimes differ from RSS — use the YouTube URL as the canonical `url` if available (so thumbnails can be derived).

### Step 3 — Filter by relevance

Apply relevance keywords: `Claude Code`, `agent`, `MCP`, `skills`, `workflow`, `coding`, `LLM`, `web`, `tool`, `context`, `memory`, `testing`, `design`

Skip keywords: none for Latent Space (highly relevant by default — swyx is a tracked source)

Tier 3 episodes (pure ML research, no practical workflow) — still ingest but mark lower priority in the summary field.

### Step 4 — Cross-reference people

Read `data/people.json`. For each guest: check if they're already tracked (fuzzy name match). 

- Already tracked → add the episode to their `podcast_episodes` array if not already there
- Not tracked → run the full person ingestion procedure below

### Step 5 — Write episodes

For each episode (whether or not the guest is tracked), add an entry to `data/podcast_episodes.json`:

```json
{
  "id": "latent-space-YYYYMMDD",
  "show": "Latent Space",
  "episode_title": "...",
  "guest_id": "guest-person-id-or-null",
  "url": "https://youtu.be/...",
  "date": "YYYY-MM-DD",
  "topics": ["topic-id-1", "topic-id-2"],
  "summary": "One sentence: what the guest shared that is actionable for a Claude Code user.",
  "thumbnail_url": null,
  "is_new": true,
  "added": "2026-05-05"
}
```

Use topic IDs from `data/topics.json`. If no topic matches, use the closest one. Do not create new topic IDs.

### Step 6 — Don't add duplicate episodes

Before writing any episode, check `data/podcast_episodes.json` for an existing entry with the same URL or the same episode_title + show combination. Skip if already present.

---

## Person ingestion procedure

Read `.claude/ingest.md → Handler: ingest_person` for the full canonical procedure. Follow it exactly for every untracked guest.

For Latent Space guests specifically: swyx's show notes page often links the guest's GitHub — use that as the seed URL for Step 1.

---

## After all updates

1. **Update existing people's podcast_episodes arrays**: For any guest who was already in people.json and appeared in a new episode, add the episode to their `podcast_episodes` array if not already present.

2. **QA check**: 
   - No duplicate podcast_episodes IDs
   - All guest_id references exist in people.json (or are null)
   - No duplicate episode URLs

3. **Write a brief summary** to `reports/updates/2026-05-05-latent-space-sweep.md`:
   ```
   # Latent Space Focused Sweep — 2026-05-05
   
   Episodes enumerated: N
   Episodes already tracked: N
   New episodes added: N
   New people added: [list names]
   Existing people updated: [list names]
   
   Notable finds:
   - [anything surprising or high-signal]
   ```

4. **Commit** with message: `research: latent space focused sweep 2026-05-05`

## Scope guardrails

- DO NOT update LANDSCAPE.md or industry_norms.json in this run — this is a data-only sweep
- DO NOT process inbox.json — leave it for the next weekly run
- DO NOT sweep any other sources — stay focused on Latent Space only
- If context is running low, prioritize episodes with the most relevant topics and guests with GitHub repos over lower-signal content
