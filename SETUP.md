# Setup Notes

## GitHub Secrets (required for research.yml to run)

Add these in repo Settings → Secrets and variables → Actions:

| Secret | Required | Purpose |
|--------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | Powers the weekly Claude Code research agent |
| `RESEND_API_KEY` | No | Email summary after each run (skipped if missing) |

## Web App (local)

```bash
cd web
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## Hosting (TBD)

The web app is local-only for now. When ready to host:

- Recommended: Vercel, connected to this GitHub repo
- Every research run commits new data → Vercel auto-deploys → live site updates automatically
- No extra configuration needed beyond connecting the repo and setting the build directory to `web/`
- Will enable: mobile access, agent-questions queue from any device, inbox from phone

## Running the research agent manually

```bash
cd ~/Desktop/workflow-ai/projects/ai-best-practices-research
claude --dangerously-skip-permissions -p "$(cat .claude/update-prompt.md)"
```

Or use the Run Now button in the web app (requires GitHub token with `workflow` scope).

## Running the audit agent

```bash
claude --dangerously-skip-permissions -p "$(cat .claude/audit-prompt.md)"
```
