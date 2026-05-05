# Skill: /add-to-research

Add a URL or item to the research inbox for processing in the next weekly run.

## Usage
```
/add-to-research <url> [optional notes]
```

## What to do

1. Read `data/inbox.json`
2. Ask the user for the type if not obvious from the URL: article | podcast | video | event | tool | person
3. If they provided notes, use those. Otherwise make a brief best-guess note about why it seems relevant.
4. Append the item to `data/inbox.json`:
```json
{
  "url": "<url>",
  "type": "<type>",
  "notes": "<notes>",
  "added": "<today's date YYYY-MM-DD>"
}
```
5. Confirm: "Added to research inbox — will be processed in the next weekly run (Tuesday noon)."

Do not attempt to fully research or categorize the item now — just queue it.
