# AI Best Practices Research — Meta-Audit Agent

You are an audit agent reviewing the health, coverage, and quality of a living research knowledge base. Your job is **not** to add new content — it is to identify what's wrong, missing, or improvable about the research process and data structure itself.

## Repo location
`~/Desktop/workflow-ai/projects/ai-best-practices-research/`

## Editorial lens (apply this as a relevance filter throughout)

**Primary audience:** A solo developer building web apps using **Claude Code subscription** (not the Claude API, not Cursor, not Copilot). Not an advanced dev or designer — needs normalized, practical workflows.

**Relevance tiers:**
1. **Directly relevant:** Claude Code subscription workflows, CLAUDE.md/DESIGN.md/skills/hooks patterns, web app development with AI assistance, design systems for web, browser testing, MCP servers
2. **Adaptable (include with note):** Tools/patterns for the Claude API or other AI tools with transferable structure
3. **Useful context (lower priority):** Enterprise orchestration, non-Claude tools, executive commentary

---

## Audit checklist

### 1. Data quality audit

Read all JSON files in `data/` and check for:

**People (`data/people.json`)**
- Count how many people have 3+ null profile fields → list them
- Check for name/ID mismatches (e.g. topic `related_people` or tool `author_id` referencing IDs that don't exist in people.json)
- Check for people with no `talks` AND no `podcast_episodes` AND no `notable_contributions` — likely stub entries
- Check for people where `added` date is recent but profiles are all null (should have been looked up)
- List any people whose `focus` array doesn't match the editorial lens (e.g. entirely API-focused, non-dev use case)

**Tools (`data/tools.json`)**
- Count how many tools have null `github_stars` when `github_url` is set — list them
- Count how many tools have null `author_id` — list them
- Flag any tools with `status: 'archived'` that are still referenced in topics `related_tools`
- Check for tools where `category` doesn't match the editorial lens (e.g. labeled 'orchestration' but is actually a consumer product)
- Flag tools where `description` mentions GitHub stars — stars now display in the UI, so inline mention is redundant

**Events (`data/events.json`)**
- For each event: count how many speakers in `all_speakers` have a corresponding person in `data/people.json` — report the percentage
- List untracked speakers from events who appear relevant to the editorial lens (Claude Code, web dev, AI tooling)
- Flag events where `notable_talks` reference a `speaker_id` not in `data/people.json`

**Articles (`data/articles.json`)**
- Count articles with `author_id: null` where the author name can be inferred from the title/url — list them
- Count articles with `recency_flag: 'potentially-outdated'` — are any still referenced in topics as primary approaches?
- Check for duplicate URLs

**Podcast episodes (`data/podcast_episodes.json`)**
- Count episodes with `guest_id: null` where the guest might be in people.json — list them
- Check for duplicate URLs

**Topics (`data/topics.json`)**
- For each topic, check that all IDs in `related_people` and `related_tools` exist in their respective data files
- Identify topics with 0 related_people or 0 related_tools — likely under-researched
- Flag approaches in `approaches` arrays that reference tools or people not tracked in the data
- Identify any obvious topics that are missing from the list given the editorial lens

**Gaps (`data/gaps.json`)**
- For each gap, check that `potential_solutions` IDs exist in `data/tools.json`
- Flag gaps with `linked_topic` that doesn't exist in `data/topics.json`
- Identify any user-facing pain points (from the editorial lens) not yet captured as gaps

**Industry norms (`data/industry_norms.json`)**
- Flag any norm with no `source` field — all norms should be sourced
- Flag any norm with `date` older than 6 months — may be stale
- Check if any recently_changed norms have been true for >2 months (probably no longer recently changed)

---

### 2. Coverage audit

Read `data/people.json` to understand who's tracked. Then assess:

**Source coverage — where are we missing signal?**
Report which of these sources the weekly update prompt checks, and estimate whether the coverage is likely adequate:
- Bluesky: #claudecode, #aiengineering
- X/Twitter: #claudecode
- Hacker News: "Claude Code", "AI agent", "LLM workflow"
- Reddit: r/ClaudeAI, r/LocalLLaMA, r/webdev
- GitHub Trending: TypeScript, Python (AI-tagged repos)
- AI Engineer conference (aiengineer.com) speaker lists
- YouTube: AI Engineer channel, Matt Pocock, Theo t3.gg, Fireship, Jack Herrington, Latent Space, How I AI
- Latent Space podcast
- Lenny's Podcast
- Simon Willison's blog
- awesome-claude-code lists

For each source: is it explicitly checked in `update-prompt.md`? Is there any indication it's yielding results in the data?

**Topic coverage gaps**
Given the editorial lens, what topics relevant to a solo web app developer using Claude Code are NOT covered in `data/topics.json`? Consider:
- Prompt engineering patterns (system prompts, user turn strategies)
- Context window management / token budgeting
- Error recovery / retry patterns in agent loops
- Versioning AI-generated code (what to commit, what to gitignore)
- Security considerations when using AI to write code
- Cost management (when to use which model tier)
- Mobile app development with Claude Code (relevant future tier)
- MCP server selection and configuration
- Claude Code extension / IDE integration patterns

**People coverage gaps**
Based on events, articles, and podcast episodes already tracked, are there practitioners who appear frequently but are NOT in `data/people.json`? List any names that appear in article/episode data but have no person record.

---

### 3. Research process audit

Read `.claude/update-prompt.md` and evaluate:

**Strengths** — what the current prompt does well
**Weaknesses** — what it misses, is vague about, or could improve
**Specific suggestions** — concrete wording changes or new steps to add

Focus areas:
- Does the prompt give enough guidance on how to determine if something is "relevant" per the editorial lens?
- Does it handle the case where a new person has a common name (disambiguation)?
- Is the recency weighting rule specific enough?
- Does it give clear guidance on how to update `industry_norms.json` (sources, what counts as evidence)?
- Does the profile lookup procedure cover all likely profile platforms?
- Is there guidance on how to handle content from paywalled sources?
- Does it check Bluesky community starter packs specifically?

---

### 4. Structural suggestions

Given everything you've read, suggest any structural improvements to the data schema or research process:

- Are there fields that should be added to any data type?
- Are there data files that should be split or merged?
- Are there new data types that would help (e.g. a `courses` type for multi-part tutorials)?
- Should any topics be split or merged?
- Is the current gap tracking system sufficient, or does it need more structure?

---

## Output format

Write your findings to `reports/audit/YYYY-MM-DD-audit.md` with these sections:

### Summary
3-5 bullets on the most important findings.

### Data Quality Issues
Organized by file. Include counts and specific IDs where relevant.

### Coverage Gaps
Source coverage, topic gaps, people gaps.

### Research Process Recommendations
Specific, actionable suggestions for `update-prompt.md`.

### Structural Suggestions
Schema or process improvements.

### Quick Fixes (do these now)
A list of specific, small fixes you can make immediately during this audit run:
- Null author_ids you can resolve by cross-referencing data
- Null guest_ids you can resolve
- Missing github_stars you can look up
- Broken topic/tool/person ID references you can fix

**Make the quick fixes directly** — edit the JSON files. For anything requiring new research (fetching URLs, finding new people), note it as a recommendation for the next update run instead.

After writing the report, print the path to the file.
