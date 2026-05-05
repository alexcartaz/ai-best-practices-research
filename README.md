# AI Best Practices Research

A living knowledge base tracking the AI coding landscape — people, tools, events, approaches — with a focus on practical Claude Code usage in production workflows.

Updated weekly (Tuesday noon) by a scheduled Claude agent.

---

## Structure

```
data/
  people.json           — tracked individuals (profiles, talks, episodes)
  tools.json            — tools and repos
  events.json           — conferences and notable talks
  articles.json         — articles and blog posts
  podcast_episodes.json — podcast episodes
  topics.json           — active pain points / research topics + known approaches
  industry_norms.json   — community consensus on models, tools, workflows
  inbox.json            — queue items here; processed on next weekly run

reports/
  LANDSCAPE.md          — auto-generated human-readable synthesis (overwritten each run)
  updates/
    YYYY-MM-DD.md       — per-run change log

.claude/
  update-prompt.md      — instructions for the weekly research agent
  add-to-research.md    — /add-to-research skill: queue a URL for next run
```

---

## Active Research Topics

| ID | Topic | Status |
|----|-------|--------|
| repo-template-governance | Default repo template + .md governance | active-pain |
| skills | Claude Code skills | active-pain |
| session-management | Session management / context compaction | active-pain |
| low-level-fe-verification | Low-level frontend verification | active-pain |
| testing-tdd | Robust testing / TDD workflow | active-pain |
| design-systems | Design systems | active-pain |
| design-tooling | Design toolbar / fast UI iteration | active-pain |
| unified-project-layer | Unified UX layer across projects | active-pain |

---

## Queuing items for research

Drop a URL into `data/inbox.json` directly:

```json
{ "url": "https://...", "type": "article", "notes": "optional context", "added": "YYYY-MM-DD" }
```

Or use the skill from inside any Claude Code session in this repo:

```
/add-to-research https://... optional notes here
```

Items are processed and cleared on the next Tuesday run.

---

## Email updates

After each weekly run, a summary email is sent to alex with:
- New people / tools / articles / episodes added
- Any diffs in `industry_norms.json` (model recommendations, adoption stats)
- Topic-by-topic new approaches discovered

Requires `RESEND_API_KEY` env var to be set.

---

## Recency policy

- Weekly runs research the **last 2 months**
- Content older than 3 months is flagged as potentially outdated
- Content older than 6 months is only included if it remains the canonical reference for its topic
- First run: 12-month backfill + keystone items of any age

---

## Scope

**In scope**: Practitioners who use Claude / AI coding tools daily. People with repos, demos, tutorials. Bluesky and conference talks over X hot takes.

**Out of scope**: Executive/hype accounts (Sam Altman, Zuckerberg, etc.) unless they published something directly hands-on.
