# Ingest Spec — Canonical Entity Ingestion Procedure

All three ingestion paths — research agent, inbox processor, and manual additions — must follow this spec. If you are adding any entity to the corpus (people, tools, articles, podcast episodes, events), run the procedure defined here. Do not invent your own field values or skip steps.

---

## Entry point: `ingest(url, type?)`

1. **Detect type** if not provided. Fetch the URL and classify:
   - GitHub repo → `tool`
   - Personal site / GitHub profile / social profile → `person`
   - Blog post, article, newsletter → `article`
   - YouTube video → check: is it a talk at a conference? → `talk` (add to person's `talks[]`). Is it a podcast episode? → `episode`
   - Podcast episode page → `episode`
   - Conference or event page → `event`

2. **Route** to the typed handler below.

3. **Run shared QA** (defined at the bottom) after writing.

---

## Handler: `ingest_tool(url)`

### Step 1 — Fetch repo metadata
If `url` is a GitHub URL, call `api.github.com/repos/{owner}/{repo}`:
- `stargazers_count` → `github_stars`
- `pushed_at` → `github_pushed_at`
- `description` → use as a starting point, but write your own `description` field (see below)

### Step 2 — Classify category
Pick exactly one from this list. When in doubt, use the decision rules below.

| category | use when |
|---|---|
| `governance` | Tool helps you author, version, iterate, or validate CLAUDE.md / DESIGN.md / AGENTS.md / skills / hooks / subagent profiles. The output is a governance file or prompt, not running code. Examples: prompt-learning, skills registries, CLAUDE.md templates, hook configs. |
| `design` | Design systems, component libraries, token pipelines, AI-native design iteration, UI generation. The tool's primary audience is the design layer of a web app. |
| `orchestration` | Multi-agent coordination, task routing, parallel execution, MCP servers, long-running mission management. The tool's primary value is coordinating agents or connecting them to external services. |
| `harness-engineering` | Testing, verification, browser automation, CI harness tooling, eval frameworks. The tool validates that code or agent output is correct. |
| `development` | General Claude Code utilities that don't fit above: session management, context compaction, token budgeting, general productivity. Default catch-all for dev tooling. |

**Decision rules:**
- Primary output is a governance file (CLAUDE.md, skill, hook, subagent profile) → `governance`
- Primary purpose is testing, verification, or evaluation → `harness-engineering`
- Primary purpose is connecting agents to external services or coordinating multiple agents → `orchestration`
- Primary purpose is UI, tokens, or design systems → `design`
- Everything else that extends Claude Code for development → `development`
- When in doubt between `governance` and `development`: does its output live in `.claude/` or a `.md` governance file? Yes → `governance`.

### Step 3 — Assign topics
Pick 1–4 topic IDs from `data/topics.json`. Use the actual `id` field values:
- `repo-template-governance`
- `session-management`
- `low-level-fe-verification`
- `testing-tdd`
- `design-systems`
- `design-tooling`
- `unified-project-layer`
- `mcp-servers`
- `multi-agent-orchestration`

Topics should reflect what the tool is *about*, not what category it's in. A tool can be `governance` category but have `testing-tdd` and `repo-template-governance` as topics.

### Step 4 — Write description
One sentence: what it does + who it's for + what's distinctive. Do NOT include star count in description text.

### Step 5 — Resolve author
If the repo author is a person in `data/people.json`, set `author_id`. If not tracked, run `ingest_person` on their profile URL before writing the tool.

### Step 6 — Resolve logo
The UI auto-derives the logo from the GitHub owner avatar. Only set `logo_url` explicitly if:
- The tool has a dedicated logo/wordmark at a stable CDN URL that is clearly better than the owner avatar
- The tool is not on GitHub (no owner avatar to derive)

Otherwise leave `logo_url` as `null`.

### Step 7 — Write record
```json
{
  "id": "owner-reponame",
  "name": "owner/reponame",
  "category": "<from step 2>",
  "author_id": "<person id or null>",
  "url": "<primary url>",
  "github_url": "<github url or null>",
  "github_stars": <number or null>,
  "github_pushed_at": "<ISO date or null>",
  "description": "<one sentence>",
  "topics": ["<topic-id>"],
  "status": "active | archived | unknown",
  "logo_url": null,
  "primary_files": null,
  "files_checked": null,
  "is_new": true,
  "added": "<today>",
  "last_updated": "<today>"
}
```

---

## Handler: `ingest_person(url)`

See the full person ingestion procedure in `update-prompt.md` (Steps 1–6 under "Person ingestion procedure"). That procedure is the canonical definition — do not abbreviate it.

Key rules specific to this spec:
- `category` must be one of: `dev`, `design`, `dev-adjacent`, `orchestration`, `education`
- All `profiles` fields must be present — use `null` for unverified, never omit
- `notable_contributions` must have at least 1 bullet explaining relevance to the editorial lens
- **`pfp_url`**: Try to set a direct avatar image URL. Resolution order:
  1. **Bluesky** — public API, no auth required. Extract the handle from `profiles.bsky` URL (the last path segment, e.g. `simonwillison.net` from `https://bsky.app/profile/simonwillison.net`). Fetch `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor={handle}` and use the `avatar` field from the JSON response. If that returns a 400, try `{handle}.bsky.social` as the actor.
  2. **LinkedIn** — blocked, requires login. Skip.
  3. **X** — blocked, requires API. Skip.
  4. **Substack** — do NOT use `og:image` (it returns a publication banner, not a profile photo). Instead: fetch `{substack_url}/about`, then find the first `substackcdn.com/image/fetch/` URL containing `w_64,h_64,c_fill` or `w_128,h_128,c_fill` in a srcset attribute. Extract the encoded S3 source URL from it and rebuild as: `https://substackcdn.com/image/fetch/w_128,h_128,c_fill,f_auto,q_auto:good/{encoded_s3_url}`.
  5. **GitHub** — auto-derived by the UI. Set `pfp_url: null` and the UI renders `https://github.com/{username}.png` automatically.

  6. **Wikipedia** — fetch `https://en.wikipedia.org/api/rest_v1/page/summary/{Full_Name}` (spaces → underscores). Use `thumbnail.source` from the response if present. Rate-limit: add a 2–3s delay between requests; if you get a 429, wait and retry.
  7. **Web search (last resort)** — use the WebSearch tool. Try these queries in order:
     - `"{name}" site:aiengineer.com` → speaker bio pages often include a headshot; fetch the page and extract the `og:image` or a visible `<img>` of the speaker
     - `"{name}" "{company}" profile` → company about/team pages often have photos; fetch and extract
     - `"{name}" headshot OR "profile photo"` → scan results for a trustworthy source (personal site, company page, reputable press)
     Once you find a candidate image URL, verify it actually resolves and looks like a person photo (not a logo or banner). Never use a photo you can't confidently attribute to the right person.

  In practice: try Bluesky → Substack → Wikipedia → web search in order. Leave `pfp_url: null` if GitHub is the only source (the UI auto-derives it). Set `pfp_url: null` entirely if no reliable image is found — a placeholder is better than the wrong person's photo.

---

## Handler: `ingest_article(url)`

### Step 1 — Fetch and extract
Fetch the article. Extract: title, author name, publish date, full text (for summarization).

### Step 2 — Resolve author
Find or create the author in `data/people.json`. If not tracked and the article is Tier 1 or 2, run `ingest_person` on their profile URL first.

### Step 3 — Classify recency
- Published within 3 months → `current`
- Published 3–6 months ago → `aging`
- Published 6+ months ago → `potentially-outdated`

### Step 4 — Resolve thumbnail
Check the page for an `og:image` meta tag. Use that URL as `thumbnail_url` if present, otherwise `null`.

### Step 5 — Write record
```json
{
  "id": "<author-slug>-<topic-slug>",
  "title": "<title>",
  "author_id": "<person id or null>",
  "url": "<url>",
  "date": "<YYYY-MM-DD>",
  "topics": ["<topic-id>"],
  "summary": "<one sentence: what's actionable for a Claude Code user>",
  "recency_flag": "current | aging | potentially-outdated",
  "thumbnail_url": "<og:image url or null>",
  "is_new": true,
  "added": "<today>"
}
```

---

## Handler: `ingest_episode(url)`

### Step 1 — Fetch and extract
Fetch the episode page or YouTube page. Extract: show name, episode title, guest name(s), publish date, description.

### Step 2 — Resolve guest
Find or create the guest in `data/people.json`. If not tracked, run `ingest_person` first.

### Step 3 — Also add to person record
After writing the episode to `data/podcast_episodes.json`, add the episode to the guest's `podcast_episodes[]` in `data/people.json` if not already present.

### Step 4 — Resolve thumbnail
Use the show's podcast artwork image URL as `thumbnail_url`. Check the episode page for `og:image` or podcast player embed. Prefer a consistent per-show artwork image over per-episode images (so all episodes from the same show look consistent in the UI). Use `null` if no image can be found.

### Step 5 — Write record
```json
{
  "id": "<show-slug>-<YYYYMMDD>",
  "show": "<show name>",
  "episode_title": "<title>",
  "guest_id": "<person id or null>",
  "url": "<url>",
  "date": "<YYYY-MM-DD or null>",
  "topics": ["<topic-id>"],
  "summary": "<one sentence: what's actionable for a Claude Code user>",
  "thumbnail_url": "<show artwork url or null>",
  "is_new": true,
  "added": "<today>"
}
```

---

## Handler: `ingest_talk(url, person_id, event_name)`

Talks are not stored as standalone records — they live on the person's `talks[]` array.

### Step 1 — Resolve person
Find the person in `data/people.json`. If not tracked, run `ingest_person` first.

### Step 2 — Derive thumbnail
If the URL is a YouTube URL, derive the thumbnail: `https://img.youtube.com/vi/{VIDEO_ID}/mqdefault.jpg`

### Step 3 — Add to person record
```json
{
  "title": "<talk title>",
  "event": "<event name>",
  "url": "<url or null>",
  "date": "<YYYY-MM-DD or null>",
  "topics": ["<topic-id>"]
}
```

Check for duplicates before adding: if a talk with the same title already exists in `talks[]`, do not add it again.

---

## Handler: `ingest_event(url)`

### Step 1 — Fetch event page
Extract: event name, date, description, full speaker/session list.

### Step 2 — Check for existing record
Look up `data/events.json` by name (fuzzy match). If exists, update `all_speakers` and `notable_talks`. If new, create.

### Step 3 — For each speaker
Run cross-reference check. If not tracked: assess relevance against editorial lens, then run `ingest_person` if passing.

### Step 4 — Write record
Follow the existing `Event` schema in `web/src/types.ts`.

---

## Shared QA (run after every ingest)

1. **No duplicate IDs** — check that the new record's `id` doesn't already exist in its file
2. **No duplicate URLs** — check `url` and `github_url` against existing records in the same file
3. **Cross-reference integrity** — any `author_id`, `guest_id`, or `speaker_id` must resolve in `data/people.json`; if not, set to `null` and write an agent-question
4. **Required fields populated** — no required field (non-optional in the schema) may be missing or empty string; `null` is acceptable for optional fields
5. **Category is valid** — `tool.category` must be one of the values in the category table above; if you used a value not in the table, correct it

---

## Notes for manual additions (when the user asks you directly)

When the user pastes a URL or says "add this", follow this spec exactly as if you were the research agent. Do not shortcut steps. Specifically:
- Always resolve `author_id` — do not leave it null if the author is already in `data/people.json`
- Always pick `category` using the decision rules — do not guess based on the tool's self-description
- Always run shared QA before committing
- If uncertain about classification, write an agent-question rather than guessing
