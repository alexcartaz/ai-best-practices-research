import { useState, useMemo, useContext, createContext, useCallback } from 'react'
import type { SortOrder, InboxItem } from './types'
import peopleRaw from '../../data/people.json'
import toolsRaw from '../../data/tools.json'
import articlesRaw from '../../data/articles.json'
import podcastsRaw from '../../data/podcast_episodes.json'
import youtubeRaw from '../../data/youtube_channels.json'
import industryNormsRaw from '../../data/industry_norms.json'
import topicsRaw from '../../data/topics.json'
import inboxRaw from '../../data/inbox.json'
import eventsRaw from '../../data/events.json'
import gapsRaw from '../../data/gaps.json'
import type { Person, Tool, Article, PodcastEpisode, YouTubeChannel, IndustryNorms, Topic, Event, Gap } from './types'

const people = peopleRaw as Person[]
const tools = toolsRaw as Tool[]
const articles = articlesRaw as Article[]
const podcasts = podcastsRaw as PodcastEpisode[]
const youtubeChannels = youtubeRaw as YouTubeChannel[]
const industryNorms = industryNormsRaw as IndustryNorms
const topics = topicsRaw as Topic[]
const inboxItems = (inboxRaw as InboxItem[]).filter(i => !i._comment)
const allEvents = eventsRaw as Event[]
const seedGaps = gapsRaw as Gap[]

const REPO = 'alexcartaz/ai-best-practices-research'

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${String(d.getUTCFullYear()).slice(2)}`
}

type MainTab = 'report' | 'youtube' | 'articles' | 'podcasts' | 'tools' | 'people' | 'events'
type ReportSection = 'updates' | 'gaps' | 'stack' | 'governance' | 'design' | 'orchestration' | 'harness-engineering' | 'industry-norms' | 'queued'

const MAIN_TABS: { id: MainTab; label: string }[] = [
  { id: 'report', label: 'Report' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'articles', label: 'Articles' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'tools', label: 'Tools' },
  { id: 'people', label: 'People' },
  { id: 'events', label: 'Events' },
]

const REPORT_SECTIONS: { id: ReportSection; label: string }[] = [
  { id: 'updates', label: 'Updates' },
  { id: 'gaps', label: 'Gaps' },
  { id: 'stack', label: 'Stack Builder' },
  { id: 'governance', label: 'Governance & Repo' },
  { id: 'design', label: 'Design' },
  { id: 'orchestration', label: 'Orchestration' },
  { id: 'harness-engineering', label: 'Harness Engineering' },
  { id: 'industry-norms', label: 'Industry Norms' },
  { id: 'queued', label: 'Queue' },
]

const PERSON_CATEGORIES = ['dev', 'design', 'dev-adjacent', 'orchestration', 'education']
const TOOL_CATEGORIES = ['claude-code-tooling', 'orchestration', 'design-tooling', 'testing']
const TOPIC_TAGS = [
  'session-management', 'skills', 'multi-agent-orchestration', 'design-systems',
  'design-tooling', 'testing-tdd', 'repo-template-governance', 'unified-project-layer',
  'harness-engineering', 'mcp',
]

// ---- Stack Builder data ----

interface StackOption {
  id: string
  label: string
  toolId?: string
  description: string
  complexity: 'simple' | 'standard' | 'complex'
}

interface StackLayer {
  id: string
  label: string
  description: string
  options: StackOption[]
}

interface StackConfig {
  id: string
  name: string
  selections: Record<string, string>
  savedAt: string
}

const STACK_LAYERS: StackLayer[] = [
  {
    id: 'context',
    label: 'Context Files',
    description: 'Persistent files Claude reads as background context in every session.',
    options: [
      { id: 'claude-only', label: 'CLAUDE.md only', complexity: 'simple', description: 'Behavioral instructions for Claude Code. The required baseline — start here and expand as pain appears.' },
      { id: 'claude-design', label: 'CLAUDE.md + DESIGN.md', complexity: 'standard', description: 'Adds a design token file (colors, spacing, typography) as persistent visual context. Community standard for web apps using DESIGN.md format (Google Labs).' },
      { id: 'full', label: 'CLAUDE.md + DESIGN.md + SKILL.md', complexity: 'complex', description: 'Full three-layer stack. SKILL.md defines reusable procedures agents can invoke. Good when you have repeated multi-step workflows you want consistent.' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance Template',
    description: 'The overall structure of your repo for AI-assisted development.',
    options: [
      { id: 'custom', label: 'Custom', complexity: 'simple', description: 'Write your own CLAUDE.md from scratch. Most control, most work. Right for most solo web app projects starting out.' },
      { id: 'gstack', label: 'gstack', toolId: 'gstack', complexity: 'complex', description: '23 specialist skills + 8 power tools. CLAUDE.md acts as a router delegating to CEO, Designer, Eng Manager, QA roles. Heavy but production-tested.' },
      { id: 'llm-wiki', label: 'LLM Wiki pattern', toolId: 'llm-wiki-karpathy', complexity: 'standard', description: 'Three-layer: raw/ (immutable source) + wiki/ (agent-maintained markdown) + schema/ (behavior config). Agents maintain their own cross-referenced knowledge base.' },
      { id: 'subagents', label: 'awesome-claude-code-subagents', toolId: 'awesome-claude-code-subagents', complexity: 'standard', description: '100+ pre-built subagent personas. Drop-in specialist roles (designer, reviewer, debugger) without the full gstack structure.' },
    ],
  },
  {
    id: 'orchestration',
    label: 'Orchestration',
    description: 'How you run and coordinate Claude Code sessions.',
    options: [
      { id: 'single', label: 'Single session', complexity: 'simple', description: 'One Claude Code session at a time. Right for most solo web app work — no overhead, human stays in the loop naturally.' },
      { id: 'conductor', label: 'Conductor', toolId: 'conductor', complexity: 'standard', description: 'macOS dashboard: parallel Claude Code instances in separate git worktrees. Real-time progress, diff review, GitHub sync. Good when you want to run tasks in parallel without losing oversight.' },
      { id: 'vibe-kanban', label: 'Vibe Kanban', toolId: 'vibe-kanban', complexity: 'complex', description: 'Multi-agent kanban across 10+ agent types. Parallel execution + diff review + browser preview. Better suited to project-scale parallelism than solo web app iteration.' },
    ],
  },
  {
    id: 'isolation',
    label: 'Isolation',
    description: 'How agent actions are sandboxed to prevent runaway changes.',
    options: [
      { id: 'none', label: 'None', complexity: 'simple', description: 'Agents work directly on your branch. Fine for most sessions — you review before committing. Lowest friction.' },
      { id: 'worktrees', label: 'Git worktrees', complexity: 'standard', description: 'Each task runs in its own worktree. Lightweight: no container overhead, easy to inspect mid-task. Good middle ground for parallel work.' },
      { id: 'dagger', label: 'Dagger container-use', toolId: 'dagger-container-use', complexity: 'complex', description: 'Full container isolation per agent. Prevents filesystem and network escape entirely. By Solomon Hykes (Docker). Overkill for most web app work but ideal if agents touch infra.' },
    ],
  },
  {
    id: 'verification',
    label: 'Verification',
    description: 'How you verify agent output is correct before it lands.',
    options: [
      { id: 'manual', label: 'Manual review', complexity: 'simple', description: 'You review every diff. No automation. Right for short iteration cycles where you\'re watching the agent work.' },
      { id: 'playwright', label: 'Playwright MCP', toolId: 'playwright-mcp', complexity: 'standard', description: 'Agents verify their own UI output via browser automation. Community standard for closing the autonomous coding loop on web apps without human eyes on every render.' },
      { id: 'sandcastle', label: 'Sandcastle pattern', toolId: 'sandcastle', complexity: 'complex', description: 'Docker + git worktrees + automated merge + verification pipeline. The reference implementation for production-grade agent reliability. Patterns are adaptable even if you\'re on subscription (not API).' },
    ],
  },
]

// ---- Curated setup recommendations ----

interface SetupRec {
  toolId?: string
  name: string
  tag: string
  why: string
  url?: string
}

const GOVERNANCE_SETUPS: SetupRec[] = [
  { toolId: 'gstack', name: 'gstack', tag: 'Heavy structure', why: '23 specialist skills + 8 power tools. CLAUDE.md acts as a router, delegating to CEO, Designer, Eng Manager, QA, Security roles. Best for teams wanting a full virtual engineering team out of the box.' },
  { toolId: 'llm-wiki-karpathy', name: 'LLM Wiki (Karpathy pattern)', tag: 'Living memory', why: 'Three-layer architecture: raw/ (immutable source) + wiki/ (agent-maintained markdown with cross-references) + schema/ (behavior config). Agents maintain their own knowledge base across sessions.' },
  { toolId: 'sandcastle', name: 'Sandcastle', tag: 'Safe parallelism', why: 'AFK coding agent orchestration with Docker isolation + git worktrees. Runs sandboxed agents in parallel, merges results. 889 commits, "none hand-coded." Best reference implementation for dev-focused harness.' },
  { toolId: 'awesome-claude-code-subagents', name: 'awesome-claude-code-subagents', tag: 'Subagent profiles', why: '100+ pre-built Claude Code subagent personas by VoltAgent. Drop-in specialist roles for any repo.' },
  { toolId: 'awesome-claude-code', name: 'awesome-claude-code (hesreallyhim)', tag: 'Community picks', why: 'Quality-curated list of validated skills, hooks, slash-commands, and orchestrators. Starting point for discovering what the community has converged on.' },
]

const DESIGN_SETUPS: SetupRec[] = [
  { toolId: 'design-md-format', name: 'DESIGN.md (Google Labs)', tag: 'Design spec standard', why: 'Emerging standard: YAML design tokens + prose rationale in a single markdown file at repo root. CLI lints WCAG AA contrast, exports to Tailwind/DTCG tokens. Agents read it as persistent context.' },
  { toolId: 'designmd-ai', name: 'designmd.ai + awesome-design-md', tag: 'Ready-made templates', why: '100+ pre-built DESIGN.md files for popular brands. MCP server for direct agent integration. Fastest path to a brand-accurate DESIGN.md.' },
  { toolId: 'paper-design', name: 'paper.design', tag: 'Code-native canvas', why: 'Design tool built on real React + Tailwind. Import production design systems, animate with shaders, export production-ready components. Closes the design-to-code gap without Figma dependency.' },
  { toolId: 'tldraw-computer', name: 'tldraw computer', tag: 'Spatial AI canvas', why: 'AI workflows on an infinite canvas — agents work spatially. Successor to Make Real (2023, the original vibe-coding demo). Best for visual/interactive multi-agent workflows.' },
  { toolId: 'intent-augment-code', name: 'Intent (Augment Code)', tag: 'Agent workspace', why: 'Developer workspace for orchestrating AI coding agents. Targets the "last 30%" problem. By Amelia Wattenberger — bridges design intent and code output.' },
]

const ORCHESTRATION_SETUPS: SetupRec[] = [
  { toolId: 'conductor', name: 'Conductor', tag: 'macOS dashboard', why: 'Run multiple Claude Code instances in parallel git worktrees. Real-time progress, diff review, GitHub sync. Built-in reviewer for human-in-the-loop.' },
  { toolId: 'vibe-kanban', name: 'Vibe Kanban', tag: 'Kanban orchestration', why: 'Multi-agent kanban supporting 10+ coding agents (Claude Code, Codex, Gemini CLI, Cursor, etc.). Parallel execution + diff review + browser preview. Open source (Rust + TS).' },
  { toolId: 'dagger-container-use', name: 'Dagger container-use', tag: 'Container isolation', why: 'Isolates agents in containers for safe parallel execution. By Solomon Hykes (Docker creator). Prevents interference between concurrent agents.' },
  { toolId: 'mastra', name: 'Mastra', tag: 'TypeScript framework', why: 'TypeScript-native framework supporting both agents and workflows. "Agents vs Workflows: Why Not Both?" Used in production at WorkOS.' },
  { toolId: 'ruflo', name: 'Ruflo (Claude Flow)', tag: 'Agent swarms', why: 'Multi-agent swarms with federated cross-machine comms, RAG, WASM/Rust policy engine. 314 MCP tools out of the box. v3.6 shipped April 2026.' },
]

const HARNESS_SETUPS: SetupRec[] = [
  { name: "Ryan Lopopolo's harness pattern", tag: 'Core concept', url: 'https://www.youtube.com/watch?v=am_oeAoUhew', why: '"Humans steer, agents execute." OpenAI\'s 2026 dominant pattern. Structured constraints define the harness; agents operate within it; humans review at decision points. Talk: "Harness Engineering" at AI Engineer Europe 2026.' },
  { toolId: 'sandcastle', name: 'Sandcastle', tag: 'Dev harness reference', why: 'Best code-level reference: Docker + git worktrees as the physical harness. Agents can\'t escape their sandbox. The harness pattern in concrete implementation.' },
  { toolId: 'playwright-mcp', name: 'Playwright MCP', tag: 'Verification layer', why: 'Community standard for AI-driven browser testing. Lets agents verify their own UI output — critical for closing the autonomous coding loop without human eyes on every render.' },
  { toolId: 'conductor', name: 'Conductor', tag: 'Human oversight UI', why: 'Real-time visibility into agent progress + diff review + GitHub sync. The UI layer for human oversight at scale.' },
  { toolId: 'dagger-container-use', name: 'Dagger container-use', tag: 'Isolation layer', why: 'The containment that makes harness engineering safe. Prevents runaway agent actions across filesystem and network.' },
]

// ---- Last run date ----

const lastRunDate = (() => {
  const dates = [
    ...people.map(p => p.last_updated),
    ...tools.map(t => t.last_updated),
    ...articles.map(a => a.added),
    ...podcasts.map(p => p.added),
  ].filter(Boolean)
  const iso = dates.sort().reverse()[0]
  if (!iso) return null
  return fmtDate(iso)
})()

// ---- Stars context ----

const StarsCtx = createContext<{ starred: Set<string>; toggle: (id: string) => void }>({
  starred: new Set(), toggle: () => {},
})

function useStars() {
  const [starred, setStarred] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('ai-research-stars') ?? '[]')) }
    catch { return new Set() }
  })
  const toggle = useCallback((id: string) => {
    setStarred(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      localStorage.setItem('ai-research-stars', JSON.stringify([...next]))
      return next
    })
  }, [])
  return { starred, toggle }
}

// ---- Local queue ----

function useLocalQueue() {
  const [queue, setQueue] = useState<InboxItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('ai-research-queue') ?? '[]') }
    catch { return [] }
  })
  const addItem = useCallback((item: InboxItem) => {
    setQueue(prev => {
      const next = [...prev, item]
      localStorage.setItem('ai-research-queue', JSON.stringify(next))
      return next
    })
  }, [])
  return { queue, addItem }
}

// ---- Relevance & sort ----

function personRelevance(p: Person): number {
  return p.talks.length * 3 + p.podcast_episodes.length * 2 + p.notable_contributions.length
}

function articleRelevance(a: Article): number {
  return { current: 3, aging: 1, 'potentially-outdated': 0 }[a.recency_flag] ?? 0
}

function sortItems<T extends { id: string; added: string }>(
  items: T[], sort: SortOrder, starred: Set<string>,
  relevance: (item: T) => number, name: (item: T) => string,
): T[] {
  return [...items].sort((a, b) => {
    const aS = starred.has(a.id) ? 1 : 0
    const bS = starred.has(b.id) ? 1 : 0
    if (aS !== bS) return bS - aS
    if (sort === 'relevance') return relevance(b) - relevance(a)
    if (sort === 'alpha') return name(a).localeCompare(name(b))
    return b.added > a.added ? 1 : -1
  })
}

// ---- Shared helpers ----

function Tag({ label, color = 'gray' }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600', blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700', green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700', pink: 'bg-pink-50 text-pink-700',
    new: 'bg-emerald-50 text-emerald-700 font-medium',
    teal: 'bg-teal-50 text-teal-700',
  }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${colors[color] ?? colors.gray}`}>{label}</span>
}

function ExternalLink({ href, children }: { href?: string | null; children: React.ReactNode }) {
  if (!href) return <span>{children}</span>
  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>
}

function ProfileLinks({ profiles }: { profiles: Person['profiles'] }) {
  const links = [
    { key: 'github', label: 'GH', url: profiles.github }, { key: 'bsky', label: 'BSky', url: profiles.bsky },
    { key: 'x', label: 'X', url: profiles.x }, { key: 'linkedin', label: 'LI', url: profiles.linkedin },
    { key: 'youtube', label: 'YT', url: profiles.youtube }, { key: 'substack', label: 'Sub', url: profiles.substack },
    { key: 'website', label: 'Web', url: profiles.website },
  ]
  return (
    <div className="flex gap-1 flex-wrap">
      {links.filter(l => l.url).map(l => (
        <a key={l.key} href={l.url!} target="_blank" rel="noopener noreferrer"
          className="text-xs px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-colors">
          {l.label}
        </a>
      ))}
    </div>
  )
}

function StarBtn({ id }: { id: string }) {
  const { starred, toggle } = useContext(StarsCtx)
  const on = starred.has(id)
  return (
    <button onClick={e => { e.stopPropagation(); toggle(id) }}
      className={`text-base leading-none transition-colors flex-shrink-0 ${on ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}
      title={on ? 'Unstar' : 'Star'}>
      {on ? '★' : '☆'}
    </button>
  )
}

function Stars({ n }: { n?: number | null }) {
  if (!n) return null
  const label = n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n)
  return <span className="text-xs text-gray-400">★ {label}</span>
}

// ---- Row components ----

const personCatColor: Record<string, string> = { dev: 'blue', design: 'pink', 'dev-adjacent': 'purple', orchestration: 'orange', education: 'green' }

function PersonRow({ person }: { person: Person }) {
  const [expanded, setExpanded] = useState(false)
  const personArticles = useMemo(() => articles.filter(a => a.author_id === person.id), [person.id])
  const personPodcasts = useMemo(() => podcasts.filter(p => p.guest_id === person.id), [person.id])
  const personTools = useMemo(() => tools.filter(t => t.author_id === person.id), [person.id])
  const workCounts = [
    person.talks.length > 0 && `${person.talks.length} talk${person.talks.length > 1 ? 's' : ''}`,
    person.podcast_episodes.length > 0 && `${person.podcast_episodes.length} ep${person.podcast_episodes.length > 1 ? 's' : ''}`,
    personArticles.length > 0 && `${personArticles.length} article${personArticles.length > 1 ? 's' : ''}`,
    personTools.length > 0 && `${personTools.length} tool${personTools.length > 1 ? 's' : ''}`,
  ].filter(Boolean) as string[]
  const hasWorks = workCounts.length > 0

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-2 mb-1.5">
        <StarBtn id={person.id} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{person.name}</span>
            {person.is_new && <Tag label="new" color="new" />}
            <Tag label={person.category} color={personCatColor[person.category] ?? 'gray'} />
          </div>
        </div>
        <ProfileLinks profiles={person.profiles} />
        {hasWorks && (
          <button onClick={() => setExpanded(v => !v)} className="text-gray-300 hover:text-gray-500 transition-colors text-xs flex-shrink-0 ml-1">
            {expanded ? '▼' : '▶'}
          </button>
        )}
      </div>
      <div className="pl-6">
        <div className="flex gap-1 flex-wrap mb-1.5">{person.focus.map(f => <Tag key={f} label={f} />)}</div>
        {person.notable_contributions[0] && <p className="text-xs text-gray-600 mb-1">{person.notable_contributions[0]}</p>}
        {workCounts.length > 0 && <p className="text-xs text-gray-400 mb-1">{workCounts.join(' · ')}</p>}
        {expanded && (
          <div className="mt-2 pl-3 border-l-2 border-gray-100 space-y-1 text-xs text-gray-600">
            {person.talks.map((t, i) => <div key={i}>🎤 <ExternalLink href={t.url}>{t.title}</ExternalLink>{t.event && <span className="text-gray-400"> — {t.event}</span>}</div>)}
            {person.podcast_episodes.map((ep, i) => <div key={i}>🎙 <ExternalLink href={ep.url}>{ep.episode_title}</ExternalLink><span className="text-gray-400"> — {ep.show}</span></div>)}
            {personArticles.map(a => <div key={a.id}>📄 <ExternalLink href={a.url}>{a.title}</ExternalLink></div>)}
            {personPodcasts.map(p => <div key={p.id}>🎙 <ExternalLink href={p.url}>{p.episode_title}</ExternalLink><span className="text-gray-400"> — {p.show}</span></div>)}
            {personTools.map(t => <div key={t.id}>🛠 <ExternalLink href={t.url}>{t.name}</ExternalLink></div>)}
          </div>
        )}
      </div>
    </div>
  )
}

function ToolRow({ tool }: { tool: Tool }) {
  const author = people.find(p => p.id === tool.author_id)
  const catColor: Record<string, string> = { 'claude-code-tooling': 'blue', orchestration: 'purple', 'design-tooling': 'pink', testing: 'green' }
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-2 mb-1.5">
        <StarBtn id={tool.id} />
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm"><ExternalLink href={tool.url}>{tool.name}</ExternalLink></span>
          {tool.is_new && <Tag label="new" color="new" />}
          <Tag label={tool.category} color={catColor[tool.category] ?? 'gray'} />
          <Stars n={tool.github_stars} />
        </div>
      </div>
      <div className="pl-6">
        <p className="text-xs text-gray-600 mb-1.5">{tool.description}</p>
        <div className="flex gap-1 flex-wrap mb-1">{tool.topics.slice(0, 5).map(t => <Tag key={t} label={t} />)}</div>
        {author && <p className="text-xs text-gray-400">by {author.name}</p>}
      </div>
    </div>
  )
}

function ArticleRow({ article }: { article: Article }) {
  const author = people.find(p => p.id === article.author_id)
  const flagColor: Record<string, string> = { current: 'green', aging: 'orange', 'potentially-outdated': 'orange' }
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-2 mb-1.5">
        <StarBtn id={article.id} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm"><ExternalLink href={article.url}>{article.title}</ExternalLink></span>
            {article.is_new && <Tag label="new" color="new" />}
            <Tag label={article.recency_flag} color={flagColor[article.recency_flag] ?? 'gray'} />
          </div>
          <div className="flex gap-2 items-center mt-0.5">
            {author && <span className="text-xs text-gray-500">{author.name}</span>}
            {article.date && <span className="text-xs text-gray-400">{fmtDate(article.date)}</span>}
          </div>
        </div>
      </div>
      <div className="pl-6">
        <p className="text-xs text-gray-600 mb-1.5">{article.summary}</p>
        <div className="flex gap-1 flex-wrap">{article.topics.slice(0, 4).map(t => <Tag key={t} label={t} />)}</div>
      </div>
    </div>
  )
}

function PodcastRow({ episode }: { episode: PodcastEpisode }) {
  const guest = people.find(p => p.id === episode.guest_id)
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-2 mb-1">
        <StarBtn id={episode.id} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm"><ExternalLink href={episode.url}>{episode.episode_title}</ExternalLink></span>
            {episode.is_new && <Tag label="new" color="new" />}
          </div>
          <div className="flex gap-2 items-center mt-0.5">
            <span className="text-xs font-medium text-gray-600">{episode.show}</span>
            {guest && <span className="text-xs text-gray-500">with {guest.name}</span>}
            {episode.date && <span className="text-xs text-gray-400">{fmtDate(episode.date)}</span>}
          </div>
        </div>
      </div>
      <div className="pl-6">
        {episode.summary && <p className="text-xs text-gray-600 mb-1.5">{episode.summary}</p>}
        <div className="flex gap-1 flex-wrap">{episode.topics.slice(0, 4).map(t => <Tag key={t} label={t} />)}</div>
      </div>
    </div>
  )
}

function YouTubeRow({ channel }: { channel: YouTubeChannel }) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-2 mb-1.5">
        <StarBtn id={channel.id} />
        <span className="font-semibold text-gray-900 text-sm"><ExternalLink href={channel.url}>{channel.name}</ExternalLink></span>
      </div>
      <div className="pl-6">
        <p className="text-xs text-gray-600 mb-1.5">{channel.description}</p>
        <div className="flex gap-1 flex-wrap">{channel.topics.slice(0, 4).map(t => <Tag key={t} label={t} />)}</div>
      </div>
    </div>
  )
}

function EventRow({ event }: { event: Event }) {
  const [expanded, setExpanded] = useState(false)
  const ytTalks = event.notable_talks.filter(t => t.url?.includes('youtube'))
  const otherTalks = event.notable_talks.filter(t => !t.url?.includes('youtube'))
  const upcoming = new Date(event.date) > new Date()

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-2 mb-1.5">
        <StarBtn id={event.id} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm"><ExternalLink href={event.url}>{event.name}</ExternalLink></span>
            <span className="text-xs text-gray-400">{fmtDate(event.date)}</span>
            {upcoming && <Tag label="upcoming" color="teal" />}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
        </div>
        {(event.all_speakers?.length ?? 0) > 0 && (
          <button onClick={() => setExpanded(v => !v)} className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0">
            {event.all_speakers!.length} speakers {expanded ? '▼' : '▶'}
          </button>
        )}
      </div>
      <div className="pl-6">
        {event.notable_talks.length > 0 && (
          <div className="space-y-1 mb-2">
            {ytTalks.map((t, i) => {
              const speaker = people.find(p => p.id === t.speaker_id)
              return (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <span className="text-red-400 flex-shrink-0">▶</span>
                  <span><ExternalLink href={t.url}>{t.title}</ExternalLink>{speaker && <span className="text-gray-400"> — {speaker.name}</span>}</span>
                </div>
              )
            })}
            {otherTalks.map((t, i) => {
              const speaker = people.find(p => p.id === t.speaker_id)
              return (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <span className="text-gray-300 flex-shrink-0">🎤</span>
                  <span>{t.title}{speaker && <span className="text-gray-400"> — {speaker.name}</span>}</span>
                </div>
              )
            })}
          </div>
        )}
        {expanded && event.all_speakers && (
          <div className="mt-2 pl-3 border-l-2 border-gray-100">
            <p className="text-xs font-medium text-gray-400 mb-1.5">All speakers</p>
            <div className="space-y-0.5">
              {event.all_speakers.map((s, i) => (
                <div key={i} className="text-xs text-gray-600">
                  <ExternalLink href={s.url}>{s.name}</ExternalLink>
                  {s.talk && <span className="text-gray-400"> — {s.talk.slice(0, 60)}{s.talk.length > 60 ? '…' : ''}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Left index sidebar ----

function IndexSidebar({ children }: { children: React.ReactNode }) {
  return <div className="w-44 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto p-3">{children}</div>
}

function IndexItem({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-2 py-1.5 rounded text-xs mb-0.5 transition-colors flex items-center justify-between gap-1 ${active ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
      <span className="truncate">{label}</span>
      {count !== undefined && <span className="text-gray-400 flex-shrink-0">{count}</span>}
    </button>
  )
}

function SubIndexItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full text-left pl-4 pr-2 py-1 rounded text-xs mb-0.5 transition-colors text-gray-400 hover:text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
      <span className="text-gray-200 flex-shrink-0">·</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

const REPORT_SUBSECTIONS: Record<ReportSection, { label: string; id: string }[]> = {
  updates: [
    { label: 'Recent Events', id: 'updates-events' },
    { label: 'New Tools', id: 'updates-tools' },
    { label: 'New People', id: 'updates-people' },
    { label: 'New Articles', id: 'updates-articles' },
    { label: 'New Podcasts', id: 'updates-podcasts' },
  ],
  gaps: [
    { label: 'Open', id: 'gaps-open' },
    { label: 'Monitoring', id: 'gaps-monitoring' },
    { label: 'Resolved', id: 'gaps-resolved' },
  ],
  stack: [
    { label: 'Saved Configs', id: 'stack-configs' },
    { label: 'Configure', id: 'stack-layers' },
  ],
  governance: [
    { label: 'Top Setups', id: 'gov-top-setups' },
    { label: 'CLAUDE.md Patterns', id: 'gov-claude-md' },
    { label: 'Skills', id: 'gov-skills' },
    { label: 'Hooks', id: 'gov-hooks' },
    { label: 'Subagent Profiles', id: 'gov-subagents' },
    { label: 'Tools', id: 'gov-tools' },
    { label: 'People', id: 'gov-people' },
  ],
  design: [
    { label: 'Top Setups', id: 'design-top-setups' },
    { label: 'Design Systems', id: 'design-systems' },
    { label: 'Tooling Approaches', id: 'design-tooling' },
    { label: 'Tools', id: 'design-tools' },
    { label: 'People', id: 'design-people' },
  ],
  orchestration: [
    { label: 'Top Setups', id: 'orch-top-setups' },
    { label: 'Patterns', id: 'orch-patterns' },
    { label: 'Session Management', id: 'orch-session' },
    { label: 'Tools', id: 'orch-tools' },
    { label: 'People', id: 'orch-people' },
  ],
  'harness-engineering': [
    { label: 'Top Setups', id: 'harness-top-setups' },
    { label: 'Core Patterns', id: 'harness-patterns' },
    { label: 'Testing & Verification', id: 'harness-testing' },
    { label: 'Tools', id: 'harness-tools' },
    { label: 'People', id: 'harness-people' },
  ],
  'industry-norms': [
    { label: 'Model Recommendations', id: 'norms-models' },
    { label: 'Tool Adoption', id: 'norms-tools' },
    { label: 'Workflow Norms', id: 'norms-workflow' },
    { label: 'Non-Dev AI', id: 'norms-non-dev' },
  ],
  queued: [],
}

const MAIN_REPORT_SECTIONS = REPORT_SECTIONS.filter(s => s.id !== 'queued')

function ReportIndex({ section, setSection }: { section: ReportSection; setSection: (s: ReportSection) => void }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <IndexSidebar>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">Sections</p>
      <div className="pl-2">
        {MAIN_REPORT_SECTIONS.map(s => (
          <div key={s.id}>
            <IndexItem label={s.label} active={section === s.id} onClick={() => setSection(s.id)} />
            {section === s.id && REPORT_SUBSECTIONS[s.id].map(sub => (
              <SubIndexItem key={sub.id} label={sub.label} onClick={() => scrollTo(sub.id)} />
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-5 mb-2 px-2">Next Report Run</p>
      <div className="pl-2">
        <IndexItem label="Queue" active={section === 'queued'} onClick={() => setSection('queued')} />
      </div>
    </IndexSidebar>
  )
}

function PeopleIndex({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  return (
    <IndexSidebar>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">Category</p>
      <IndexItem label="All" count={people.length} active={!filter} onClick={() => setFilter('')} />
      {PERSON_CATEGORIES.map(cat => <IndexItem key={cat} label={cat} count={people.filter(p => p.category === cat).length} active={filter === cat} onClick={() => setFilter(cat)} />)}
    </IndexSidebar>
  )
}

function ToolsIndex({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  return (
    <IndexSidebar>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">Category</p>
      <IndexItem label="All" count={tools.length} active={!filter} onClick={() => setFilter('')} />
      {TOOL_CATEGORIES.map(cat => <IndexItem key={cat} label={cat} count={tools.filter(t => t.category === cat).length} active={filter === cat} onClick={() => setFilter(cat)} />)}
    </IndexSidebar>
  )
}

function TopicIndex({ filter, setFilter, heading = 'Topic' }: { filter: string; setFilter: (f: string) => void; heading?: string }) {
  return (
    <IndexSidebar>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">{heading}</p>
      <IndexItem label="All" active={!filter} onClick={() => setFilter('')} />
      {TOPIC_TAGS.map(t => <IndexItem key={t} label={t} active={filter === t} onClick={() => setFilter(t)} />)}
    </IndexSidebar>
  )
}

function ShowIndex({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const shows = [...new Set(podcasts.map(p => p.show))].sort()
  return (
    <IndexSidebar>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">Show</p>
      <IndexItem label="All" count={podcasts.length} active={!filter} onClick={() => setFilter('')} />
      {shows.map(show => <IndexItem key={show} label={show} count={podcasts.filter(p => p.show === show).length} active={filter === show} onClick={() => setFilter(show)} />)}
    </IndexSidebar>
  )
}

function EventsIndex({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const years = [...new Set(allEvents.map(e => e.date.slice(0, 4)))].sort().reverse()
  return (
    <IndexSidebar>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">Year</p>
      <IndexItem label="All" count={allEvents.length} active={!filter} onClick={() => setFilter('')} />
      {years.map(y => <IndexItem key={y} label={y} count={allEvents.filter(e => e.date.startsWith(y)).length} active={filter === y} onClick={() => setFilter(y)} />)}
    </IndexSidebar>
  )
}

// ---- Filter bar ----

function FilterBar({ sort, setSort, search, setSearch }: {
  sort: SortOrder; setSort: (s: SortOrder) => void; search: string; setSearch: (s: string) => void
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white" />
      <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
        {(['relevance', 'recent', 'alpha'] as SortOrder[]).map(s => (
          <button key={s} onClick={() => setSort(s)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${sort === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {s === 'relevance' ? 'Top' : s === 'recent' ? 'Recent' : 'A–Z'}
          </button>
        ))}
      </div>
    </div>
  )
}

function SearchBar({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  return (
    <div className="mb-5">
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white" />
    </div>
  )
}

// ---- Report building blocks ----

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-6 first:mt-0">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</h3>
      <span className="text-xs text-gray-300">{count}</span>
    </div>
  )
}

function ReportSubsection({ id, title, description, children }: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mt-7 first:mt-0">
      <div className="flex items-baseline gap-2 mb-3 pb-1.5 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
      {children}
    </div>
  )
}

function ApproachItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-300 flex-shrink-0 mt-0.5">—</span>
      <p className="text-xs text-gray-700 leading-relaxed">{text}</p>
    </div>
  )
}

function TopSetupCard({ setup }: { setup: SetupRec }) {
  const tool = setup.toolId ? tools.find(t => t.id === setup.toolId) : null
  const url = setup.url ?? tool?.url
  const stars = tool?.github_stars

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white mb-3 last:mb-0">
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-gray-900 hover:text-blue-600">
          {setup.name}
        </a>
        <Tag label={setup.tag} color="blue" />
        {stars != null && <Stars n={stars} />}
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{setup.why}</p>
    </div>
  )
}

function ShowMore<T>({ items, renderItem, limit = 3 }: { items: T[]; renderItem: (item: T, i: number) => React.ReactNode; limit?: number }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? items : items.slice(0, limit)
  const hiddenCount = items.length - limit
  return (
    <div>
      {visible.map((item, i) => renderItem(item, i))}
      {hiddenCount > 0 && (
        <button onClick={() => setExpanded(v => !v)} className="mt-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          {expanded ? 'Show less' : `Show ${hiddenCount} more…`}
        </button>
      )}
    </div>
  )
}

function ContentArea({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="p-6 max-w-2xl w-full">
      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// ---- Report: Updates (digest style) ----

function UpdatesContent({ sort, search }: { sort: SortOrder; search: string }) {
  const { starred } = useContext(StarsCtx)
  const q = search.toLowerCase()

  const recentEvents = useMemo(() => allEvents.filter(e => new Date(e.date) <= new Date()).sort((a, b) => b.date > a.date ? 1 : -1).slice(0, 3), [])
  const newPeople = useMemo(() => {
    let p = people.filter(x => x.is_new)
    if (q) p = p.filter(x => x.name.toLowerCase().includes(q) || x.notable_contributions.some(c => c.toLowerCase().includes(q)))
    return sortItems(p, sort, starred, personRelevance, x => x.name)
  }, [sort, q, starred])
  const newTools = useMemo(() => {
    let t = tools.filter(x => x.is_new)
    if (q) t = t.filter(x => x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q))
    return sortItems(t, sort, starred, x => x.github_stars ?? 0, x => x.name)
  }, [sort, q, starred])
  const newArticles = useMemo(() => {
    let a = articles.filter(x => x.is_new)
    if (q) a = a.filter(x => x.title.toLowerCase().includes(q) || x.summary.toLowerCase().includes(q))
    return sortItems(a, sort, starred, articleRelevance, x => x.title)
  }, [sort, q, starred])
  const newPodcasts = useMemo(() => {
    let p = podcasts.filter(x => x.is_new)
    if (q) p = p.filter(x => x.episode_title.toLowerCase().includes(q) || x.summary.toLowerCase().includes(q))
    return sortItems(p, sort, starred, () => 0, x => x.episode_title)
  }, [sort, q, starred])

  return (
    <>
      {recentEvents.length > 0 && (
        <ReportSubsection id="updates-events" title="Recent Events">
          {recentEvents.map(event => {
            const ytTalks = event.notable_talks.filter(t => t.url?.includes('youtube'))
            const otherTalks = event.notable_talks.filter(t => !t.url?.includes('youtube'))
            return (
              <div key={event.id} className="border border-blue-100 bg-blue-50 rounded-lg p-4 mb-3 last:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <a href={event.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-blue-900 hover:underline">{event.name}</a>
                  <span className="text-xs text-blue-500">{fmtDate(event.date)}</span>
                  <span className="text-xs text-blue-400 ml-auto">{event.all_speakers?.length ?? 0} speakers</span>
                </div>
                <div className="space-y-1">
                  {ytTalks.map((t, i) => {
                    const speaker = people.find(p => p.id === t.speaker_id)
                    return (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-blue-800">
                        <span className="text-red-400 flex-shrink-0">▶</span>
                        <span><ExternalLink href={t.url}>{t.title}</ExternalLink>{speaker && <span className="text-blue-500"> — {speaker.name}</span>}</span>
                      </div>
                    )
                  })}
                  <ShowMore items={otherTalks} limit={0} renderItem={(t, i) => {
                    const speaker = people.find(p => p.id === t.speaker_id)
                    return <div key={i} className="flex items-start gap-1.5 text-xs text-blue-700"><span>🎤</span><span>{t.title}{speaker && <span className="text-blue-500"> — {speaker.name}</span>}</span></div>
                  }} />
                </div>
              </div>
            )
          })}
        </ReportSubsection>
      )}

      {newTools.length > 0 && (
        <ReportSubsection id="updates-tools" title={`New Tools (${newTools.length})`}>
          <ShowMore items={newTools} limit={5} renderItem={(t, i) => <ToolRow key={i} tool={t} />} />
        </ReportSubsection>
      )}

      {newPeople.length > 0 && (
        <ReportSubsection id="updates-people" title={`New People (${newPeople.length})`}>
          <ShowMore items={newPeople} limit={3} renderItem={(p, i) => <PersonRow key={i} person={p} />} />
        </ReportSubsection>
      )}

      {newArticles.length > 0 && (
        <ReportSubsection id="updates-articles" title={`New Articles (${newArticles.length})`}>
          <ShowMore items={newArticles} limit={3} renderItem={(a, i) => <ArticleRow key={i} article={a} />} />
        </ReportSubsection>
      )}

      {newPodcasts.length > 0 && (
        <ReportSubsection id="updates-podcasts" title={`New Podcasts (${newPodcasts.length})`}>
          {newPodcasts.map(p => <PodcastRow key={p.id} episode={p} />)}
        </ReportSubsection>
      )}

      {newTools.length + newPeople.length + newArticles.length + newPodcasts.length === 0 && (
        <p className="text-sm text-gray-400">No new items this run.</p>
      )}
    </>
  )
}

// ---- Report: Gaps ----

function useLocalGaps() {
  const [localGaps, setLocalGaps] = useState<Gap[]>(() => {
    try { return JSON.parse(localStorage.getItem('ai-research-gaps') ?? '[]') }
    catch { return [] }
  })
  const addGap = useCallback((gap: Gap) => {
    setLocalGaps(prev => {
      const next = [...prev, gap]
      localStorage.setItem('ai-research-gaps', JSON.stringify(next))
      return next
    })
  }, [])
  const updateGap = useCallback((id: string, patch: Partial<Gap>) => {
    setLocalGaps(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...patch } : g)
      localStorage.setItem('ai-research-gaps', JSON.stringify(next))
      return next
    })
  }, [])
  return { localGaps, addGap, updateGap }
}

const GAP_AREAS = ['governance', 'design', 'orchestration', 'harness-engineering', 'general']
const gapStatusColor: Record<string, string> = { open: 'orange', monitoring: 'blue', resolved: 'green' }

function GapCard({ gap, onStatusChange }: { gap: Gap; onStatusChange?: (id: string, status: Gap['status']) => void }) {
  const linkedTools = gap.potential_solutions.map(id => tools.find(t => t.id === id)).filter(Boolean) as Tool[]
  const nextStatus: Record<Gap['status'], Gap['status']> = { open: 'monitoring', monitoring: 'resolved', resolved: 'open' }

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 last:mb-0 bg-white">
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-gray-900">{gap.title}</span>
            <Tag label={gap.status} color={gapStatusColor[gap.status]} />
            <Tag label={gap.area} />
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{gap.description}</p>
        </div>
        {onStatusChange && (
          <button onClick={() => onStatusChange(gap.id, nextStatus[gap.status])}
            className="text-xs text-gray-300 hover:text-gray-500 flex-shrink-0 transition-colors" title="Advance status">
            →
          </button>
        )}
      </div>
      {gap.notes && <p className="text-xs text-gray-400 italic mb-2">{gap.notes}</p>}
      {linkedTools.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          <span className="text-xs text-gray-400">Watching:</span>
          {linkedTools.map(t => (
            <ExternalLink key={t.id} href={t.url}>
              <span className="text-xs text-blue-500 hover:underline">{t.name}</span>
            </ExternalLink>
          ))}
        </div>
      )}
    </div>
  )
}

function AddGapModal({ onClose, onAdd }: { onClose: () => void; onAdd: (gap: Gap) => void }) {
  const [title, setTitle] = useState('')
  const [area, setArea] = useState('general')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')

  const submit = () => {
    if (!title.trim() || !description.trim()) return
    const gap: Gap = {
      id: `gap-local-${Date.now()}`,
      area, title: title.trim(), description: description.trim(),
      status: 'open', identified: new Date().toISOString().split('T')[0],
      potential_solutions: [], notes: notes.trim(),
    }
    onAdd(gap)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Add Gap</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What's missing or broken?" autoFocus
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Area</label>
            <select value={area} onChange={e => setArea(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-400">
              {GAP_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="Describe the pain point in enough detail that you'd know if a tool solved it."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything you've already tried or ruled out"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          <button onClick={submit} disabled={!title.trim() || !description.trim()}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors">
            Add Gap
          </button>
        </div>
      </div>
    </div>
  )
}

function GapsContent({ localGaps, onAddGap, onUpdateGap }: {
  localGaps: Gap[]
  onAddGap: (gap: Gap) => void
  onUpdateGap: (id: string, status: Gap['status']) => void
}) {
  const [showModal, setShowModal] = useState(false)
  const allGaps = [...seedGaps, ...localGaps]
  const open = allGaps.filter(g => g.status === 'open')
  const monitoring = allGaps.filter(g => g.status === 'monitoring')
  const resolved = allGaps.filter(g => g.status === 'resolved')

  const handleStatusChange = (id: string, status: Gap['status']) => {
    const isLocal = localGaps.some(g => g.id === id)
    if (isLocal) onUpdateGap(id, status)
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)}
          className="text-xs px-3 py-1.5 border border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors">
          + Add Gap
        </button>
      </div>

      {open.length > 0 && (
        <ReportSubsection id="gaps-open" title={`Open (${open.length})`}
          description="Active pain points with no good solution yet.">
          {open.map(g => <GapCard key={g.id} gap={g} onStatusChange={localGaps.some(x => x.id === g.id) ? handleStatusChange : undefined} />)}
        </ReportSubsection>
      )}

      {monitoring.length > 0 && (
        <ReportSubsection id="gaps-monitoring" title={`Monitoring (${monitoring.length})`}
          description="Potential solutions exist — watching for them to mature.">
          {monitoring.map(g => <GapCard key={g.id} gap={g} onStatusChange={localGaps.some(x => x.id === g.id) ? handleStatusChange : undefined} />)}
        </ReportSubsection>
      )}

      {resolved.length > 0 && (
        <ReportSubsection id="gaps-resolved" title={`Resolved (${resolved.length})`}>
          {resolved.map(g => <GapCard key={g.id} gap={g} />)}
        </ReportSubsection>
      )}

      {allGaps.length === 0 && (
        <p className="text-sm text-gray-400">No gaps tracked yet. Add one when you hit a pain point.</p>
      )}

      {showModal && <AddGapModal onClose={() => setShowModal(false)} onAdd={onAddGap} />}
    </>
  )
}

// ---- Report: Stack Builder ----

function useStackConfigs() {
  const [configs, setConfigs] = useState<StackConfig[]>(() => {
    try { return JSON.parse(localStorage.getItem('ai-research-stack-configs') ?? '[]') }
    catch { return [] }
  })
  const save = useCallback((name: string, selections: Record<string, string>) => {
    const config: StackConfig = { id: Date.now().toString(), name, selections, savedAt: new Date().toISOString().split('T')[0] }
    setConfigs(prev => {
      const next = [...prev, config]
      localStorage.setItem('ai-research-stack-configs', JSON.stringify(next))
      return next
    })
  }, [])
  const remove = useCallback((id: string) => {
    setConfigs(prev => {
      const next = prev.filter(c => c.id !== id)
      localStorage.setItem('ai-research-stack-configs', JSON.stringify(next))
      return next
    })
  }, [])
  return { configs, save, remove }
}

const complexityColor: Record<string, string> = { simple: 'green', standard: 'blue', complex: 'orange' }

function StackBuilderContent() {
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [saveName, setSaveName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)
  const { configs, save, remove } = useStackConfigs()

  const select = (layerId: string, optionId: string) =>
    setSelections(prev => ({ ...prev, [layerId]: optionId }))

  const loadConfig = (config: StackConfig) => setSelections(config.selections)

  const saveConfig = () => {
    if (!saveName.trim()) return
    save(saveName.trim(), selections)
    setSaveName('')
    setShowSaveInput(false)
  }

  const selectedCount = Object.keys(selections).length
  const complexityCounts = STACK_LAYERS.reduce((acc, layer) => {
    const opt = layer.options.find(o => o.id === selections[layer.id])
    if (opt) acc[opt.complexity] = (acc[opt.complexity] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)
  const overallComplexity = complexityCounts.complex ? 'complex' : complexityCounts.standard ? 'standard' : selectedCount > 0 ? 'simple' : null

  return (
    <>
      <ReportSubsection id="stack-configs" title="Saved Configs">
        {configs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {configs.map(c => (
              <div key={c.id} className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg">
                <button onClick={() => loadConfig(c)} className="text-xs text-gray-700 hover:text-blue-600 font-medium">{c.name}</button>
                <span className="text-xs text-gray-300 mx-0.5">·</span>
                <span className="text-xs text-gray-400">{fmtDate(c.savedAt)}</span>
                <button onClick={() => remove(c.id)} className="text-gray-300 hover:text-red-400 ml-1 text-sm leading-none">×</button>
              </div>
            ))}
          </div>
        )}
        {configs.length === 0 && !showSaveInput && (
          <p className="text-xs text-gray-400 mb-3">No saved configs yet. Configure the layers below, then save.</p>
        )}
        <div className="flex items-center gap-2">
          {showSaveInput ? (
            <>
              <input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Config name…" autoFocus
                onKeyDown={e => { if (e.key === 'Enter') saveConfig(); if (e.key === 'Escape') setShowSaveInput(false) }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-gray-400 w-40" />
              <button onClick={saveConfig} disabled={!saveName.trim()}
                className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors">Save</button>
              <button onClick={() => setShowSaveInput(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </>
          ) : (
            <button onClick={() => setShowSaveInput(true)}
              className="text-xs text-gray-400 hover:text-gray-700 border border-dashed border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-gray-400 transition-colors">
              + Save current config
            </button>
          )}
          {overallComplexity && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs text-gray-400">Stack:</span>
              <Tag label={overallComplexity} color={complexityColor[overallComplexity]} />
            </div>
          )}
        </div>
      </ReportSubsection>

      <ReportSubsection id="stack-layers" title="Configure Your Stack">
        <div className="space-y-7">
          {STACK_LAYERS.map(layer => {
            const selectedId = selections[layer.id]
            const selectedOption = layer.options.find(o => o.id === selectedId)
            const tool = selectedOption?.toolId ? tools.find(t => t.id === selectedOption.toolId) : null
            return (
              <div key={layer.id}>
                <p className="text-xs font-semibold text-gray-800 mb-0.5">{layer.label}</p>
                <p className="text-xs text-gray-400 mb-2">{layer.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {layer.options.map(opt => {
                    const isSelected = selectedId === opt.id
                    return (
                      <button key={opt.id} onClick={() => select(layer.id, opt.id)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${isSelected
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'}`}>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
                {selectedOption && (
                  <div className="flex items-start gap-2 pl-1">
                    <Tag label={selectedOption.complexity} color={complexityColor[selectedOption.complexity]} />
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">{selectedOption.description}</p>
                    {tool && (
                      <ExternalLink href={tool.url}>
                        <span className="text-xs text-blue-500 hover:underline whitespace-nowrap flex-shrink-0">View →</span>
                      </ExternalLink>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ReportSubsection>
    </>
  )
}

// ---- Report: Governance & Repo ----

function GovernanceContent() {
  const govTopic = topics.find(t => t.id === 'repo-template-governance')
  const skillsTopic = topics.find(t => t.id === 'skills')
  const subs = govTopic?.sub_sections ?? {}

  const govTools = tools.filter(t =>
    t.topics.some(tag => ['claude-code-governance', 'skills', 'hooks', 'subagent_profiles', 'repo-template-governance', 'CLAUDE.md'].includes(tag))
  )
  const govPeople = people.filter(p =>
    p.focus.some(f => ['repo-template-governance', 'skills', 'hooks', 'harness-engineering'].some(k => f.includes(k)))
  )

  return (
    <>
      <ReportSubsection id="gov-top-setups" title="Top Setups">
        {GOVERNANCE_SETUPS.map((s, i) => <TopSetupCard key={i} setup={s} />)}
      </ReportSubsection>

      {subs.md_governance && (
        <ReportSubsection id="gov-claude-md" title="CLAUDE.md Patterns" description={subs.md_governance.description}>
          {subs.md_governance.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {subs.skills && (
        <ReportSubsection id="gov-skills" title="Skills" description={subs.skills.description}>
          {subs.skills.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
          {skillsTopic?.approaches.map((a, i) => <ApproachItem key={`s${i}`} text={a} />)}
        </ReportSubsection>
      )}

      {subs.hooks && (
        <ReportSubsection id="gov-hooks" title="Hooks" description={subs.hooks.description}>
          {subs.hooks.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {subs.subagent_profiles && (
        <ReportSubsection id="gov-subagents" title="Subagent Profiles" description={subs.subagent_profiles.description}>
          {subs.subagent_profiles.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {govTools.length > 0 && (
        <ReportSubsection id="gov-tools" title="Tools">
          {govTools.map(t => <ToolRow key={t.id} tool={t} />)}
        </ReportSubsection>
      )}

      {govPeople.length > 0 && (
        <ReportSubsection id="gov-people" title="People">
          {govPeople.map(p => <PersonRow key={p.id} person={p} />)}
        </ReportSubsection>
      )}
    </>
  )
}

// ---- Report: Design ----

function DesignContent() {
  const dsTopic = topics.find(t => t.id === 'design-systems')
  const dtTopic = topics.find(t => t.id === 'design-tooling')
  const designTools = tools.filter(t => t.category === 'design-tooling' || t.topics.includes('design-systems') || t.topics.includes('design-tooling'))
  const designPeople = people.filter(p => p.category === 'design' || p.focus.some(f => f.includes('design')))

  return (
    <>
      <ReportSubsection id="design-top-setups" title="Top Setups">
        {DESIGN_SETUPS.map((s, i) => <TopSetupCard key={i} setup={s} />)}
        <p className="text-xs text-gray-400 mt-2">Not yet tracked but worth watching: claude.ai/design (comment-on-element), Figma Make, Figma + Claude Code MCP.</p>
      </ReportSubsection>

      {dsTopic && dsTopic.approaches.length > 0 && (
        <ReportSubsection id="design-systems" title="Design Systems Best Practices" description={dsTopic.description}>
          {dsTopic.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {dtTopic && dtTopic.approaches.length > 0 && (
        <ReportSubsection id="design-tooling" title="Design Tooling Approaches" description={dtTopic.description}>
          {dtTopic.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {designTools.length > 0 && (
        <ReportSubsection id="design-tools" title="Tools">
          {designTools.map(t => <ToolRow key={t.id} tool={t} />)}
        </ReportSubsection>
      )}

      {designPeople.length > 0 && (
        <ReportSubsection id="design-people" title="People">
          {designPeople.map(p => <PersonRow key={p.id} person={p} />)}
        </ReportSubsection>
      )}
    </>
  )
}

// ---- Report: Orchestration ----

function OrchestrationContent() {
  const orchTopic = topics.find(t => t.id === 'multi-agent-orchestration')
  const sessionTopic = topics.find(t => t.id === 'session-management')
  const orchTools = tools.filter(t => t.category === 'orchestration' || t.topics.includes('multi-agent-orchestration'))
  const orchPeople = people.filter(p => p.focus.some(f => f.includes('orchestration') || f.includes('multi-agent')))

  return (
    <>
      <ReportSubsection id="orch-top-setups" title="Top Setups">
        {ORCHESTRATION_SETUPS.map((s, i) => <TopSetupCard key={i} setup={s} />)}
      </ReportSubsection>

      {orchTopic && orchTopic.approaches.length > 0 && (
        <ReportSubsection id="orch-patterns" title="Patterns & Best Practices" description={orchTopic.description}>
          {orchTopic.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {sessionTopic && sessionTopic.approaches.length > 0 && (
        <ReportSubsection id="orch-session" title="Session Management" description={sessionTopic.description}>
          {sessionTopic.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {orchTools.length > 0 && (
        <ReportSubsection id="orch-tools" title="Tools">
          {orchTools.map(t => <ToolRow key={t.id} tool={t} />)}
        </ReportSubsection>
      )}

      {orchPeople.length > 0 && (
        <ReportSubsection id="orch-people" title="People">
          {orchPeople.map(p => <PersonRow key={p.id} person={p} />)}
        </ReportSubsection>
      )}
    </>
  )
}

// ---- Report: Harness Engineering ----

function HarnessContent() {
  const harnessTopic = topics.find(t => t.id === 'harness-engineering')
  const testingTopic = topics.find(t => t.id === 'testing-tdd')
  const harnessTools = tools.filter(t => t.topics.some(tag => ['harness-engineering', 'testing-tdd', 'browser-automation', 'testing'].includes(tag)) || t.category === 'testing')
  const harnessPeople = people.filter(p => p.focus.some(f => f.includes('harness') || f.includes('testing') || f.includes('repo-template-governance')))

  return (
    <>
      <ReportSubsection id="harness-top-setups" title="Top Setups">
        {HARNESS_SETUPS.map((s, i) => <TopSetupCard key={i} setup={s} />)}
      </ReportSubsection>

      {harnessTopic && harnessTopic.approaches.length > 0 && (
        <ReportSubsection id="harness-patterns" title="Core Patterns" description={harnessTopic.description}>
          {harnessTopic.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {testingTopic && testingTopic.approaches.length > 0 && (
        <ReportSubsection id="harness-testing" title="Testing & Verification" description={testingTopic.description}>
          {testingTopic.approaches.map((a, i) => <ApproachItem key={i} text={a} />)}
        </ReportSubsection>
      )}

      {harnessTools.length > 0 && (
        <ReportSubsection id="harness-tools" title="Tools">
          {harnessTools.map(t => <ToolRow key={t.id} tool={t} />)}
        </ReportSubsection>
      )}

      {harnessPeople.length > 0 && (
        <ReportSubsection id="harness-people" title="People">
          {harnessPeople.map(p => <PersonRow key={p.id} person={p} />)}
        </ReportSubsection>
      )}
    </>
  )
}

// ---- Report: Industry Norms ----

function IndustryNormsContent() {
  const cc: Record<string, string> = {
    'official-docs': 'blue', 'community-consensus': 'green', 'practitioner-consensus': 'green',
    survey: 'purple', emerging: 'orange', anecdotal: 'gray', unclear: 'gray',
  }
  return (
    <>
      <ReportSubsection id="norms-models" title="Model Recommendations">
        {industryNorms.model_recommendations.map((m, i) => (
          <div key={i} className="py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{m.model}</code>
              <Tag label={m.confidence} color={cc[m.confidence] ?? 'gray'} />
              {m.recently_changed && <Tag label="changed" color="orange" />}
            </div>
            <p className="text-xs text-gray-600 mb-1.5">{m.rationale}</p>
            <div className="flex gap-1 flex-wrap">{m.recommended_for.map(r => <Tag key={r} label={r} />)}</div>
          </div>
        ))}
      </ReportSubsection>
      <ReportSubsection id="norms-tools" title="Tool Adoption">
        {industryNorms.tool_adoption.map((t, i) => (
          <div key={i} className="py-2.5 border-b border-gray-100 last:border-0 flex items-start gap-2">
            <Tag label={t.confidence} color={cc[t.confidence] ?? 'gray'} />
            <p className="text-xs text-gray-700 flex-1">{t.claim}</p>
          </div>
        ))}
      </ReportSubsection>
      <ReportSubsection id="norms-workflow" title="Workflow Norms">
        {industryNorms.workflow_norms.map((w, i) => (
          <div key={i} className="py-2.5 border-b border-gray-100 last:border-0 flex items-start gap-2">
            <Tag label={w.confidence} color={cc[w.confidence] ?? 'gray'} />
            {w.recently_changed && <Tag label="changed" color="orange" />}
            <p className="text-xs text-gray-700 flex-1">{w.norm}</p>
          </div>
        ))}
      </ReportSubsection>

      <NonDevAISubsection />
    </>
  )
}

function NonDevAISubsection() {
  const nonDevTools = tools.filter(t =>
    t.topics.some(tag => ['personal-assistant', 'consumer-ai', 'general-ai', 'research-ai'].includes(tag)) ||
    t.category === 'consumer-ai'
  )

  return (
    <ReportSubsection id="norms-non-dev" title="Non-Dev AI" description="AI personal assistants, consumer products, and general-purpose AI — worth tracking for awareness, outside the main dev workflow.">
      {nonDevTools.length > 0
        ? nonDevTools.map(t => <ToolRow key={t.id} tool={t} />)
        : <p className="text-xs text-gray-400">Nothing tagged yet. Add <code className="bg-gray-100 px-1 rounded">consumer-ai</code> or <code className="bg-gray-100 px-1 rounded">personal-assistant</code> to a tool's topics in tools.json to surface it here.</p>
      }
    </ReportSubsection>
  )
}

// ---- Report: Queue ----

function QueuedContent({ localQueue }: { localQueue: InboxItem[] }) {
  const allInbox = [...inboxItems, ...localQueue]
  if (allInbox.length === 0) {
    return <p className="text-sm text-gray-400">Nothing queued. Use + Add to queue items for the next research run.</p>
  }
  return (
    <>
      {allInbox.map((item, i) => (
        <div key={i} className="py-3 border-b border-gray-100 last:border-0 flex items-start gap-3">
          <Tag label={item.type} />
          <div className="flex-1 min-w-0">
            <ExternalLink href={item.url}><span className="text-sm text-gray-800 break-all">{item.url}</span></ExternalLink>
            {item.notes && <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>}
            <p className="text-xs text-gray-300 mt-0.5">{fmtDate(item.added)}</p>
          </div>
          {localQueue.includes(item) && <Tag label="local" color="orange" />}
        </div>
      ))}
    </>
  )
}

// ---- Report: router ----

const REPORT_SECTION_META: Record<ReportSection, { title: string; subtitle: string }> = {
  updates: { title: 'Updates', subtitle: 'What\'s new since the last research run, ranked by relevance' },
  gaps: { title: 'Gaps', subtitle: 'Known pain points being monitored for solutions — add your own as you find them' },
  stack: { title: 'Stack Builder', subtitle: 'Configure your Claude Code stack layer by layer — save and switch between setups' },
  governance: { title: 'Governance & Repo Structure', subtitle: 'CLAUDE.md · DESIGN.md · skills · hooks · subagent profiles' },
  design: { title: 'Design', subtitle: 'Design systems, component libraries, and AI-native UI workflows' },
  orchestration: { title: 'Orchestration', subtitle: 'Multi-agent coordination, session management, context compaction' },
  'harness-engineering': { title: 'Harness Engineering', subtitle: 'Humans steer, agents execute — structured constraints for coding agents' },
  'industry-norms': { title: 'Industry Norms', subtitle: `Updated ${fmtDate(industryNorms.last_updated)} · includes non-dev AI at the bottom` },
  queued: { title: 'Queue', subtitle: 'Items queued for the next research run' },
}

function ReportContent({ section, sort, setSort, search, setSearch, localQueue, localGaps, onAddGap, onUpdateGap }: {
  section: ReportSection; sort: SortOrder; setSort: (s: SortOrder) => void
  search: string; setSearch: (s: string) => void; localQueue: InboxItem[]
  localGaps: Gap[]; onAddGap: (g: Gap) => void; onUpdateGap: (id: string, status: Gap['status']) => void
}) {
  const meta = REPORT_SECTION_META[section]
  return (
    <ContentArea title={meta.title} subtitle={meta.subtitle}>
      {section === 'updates' && (
        <>
          <FilterBar sort={sort} setSort={setSort} search={search} setSearch={setSearch} />
          <UpdatesContent sort={sort} search={search} />
        </>
      )}
      {section === 'gaps' && <GapsContent localGaps={localGaps} onAddGap={onAddGap} onUpdateGap={onUpdateGap} />}
      {section === 'stack' && <StackBuilderContent />}
      {section === 'governance' && <GovernanceContent />}
      {section === 'design' && <DesignContent />}
      {section === 'orchestration' && <OrchestrationContent />}
      {section === 'harness-engineering' && <HarnessContent />}
      {section === 'industry-norms' && <IndustryNormsContent />}
      {section === 'queued' && <QueuedContent localQueue={localQueue} />}
    </ContentArea>
  )
}

// ---- Per-tab content ----

function PeopleContent({ filter, sort, setSort, search, setSearch }: {
  filter: string; sort: SortOrder; setSort: (s: SortOrder) => void; search: string; setSearch: (s: string) => void
}) {
  const { starred } = useContext(StarsCtx)
  const q = search.toLowerCase()
  const filtered = useMemo(() => {
    let p = [...people]
    if (filter) p = p.filter(x => x.category === filter)
    if (q) p = p.filter(x => x.name.toLowerCase().includes(q) || x.notable_contributions.some(c => c.toLowerCase().includes(q)) || x.focus.some(f => f.includes(q)))
    return sortItems(p, sort, starred, personRelevance, x => x.name)
  }, [filter, sort, q, starred])
  return (
    <ContentArea title="People" subtitle={`${people.length} tracked practitioners`}>
      <FilterBar sort={sort} setSort={setSort} search={search} setSearch={setSearch} />
      {filtered.map(p => <PersonRow key={p.id} person={p} />)}
      {filtered.length === 0 && <p className="text-sm text-gray-400">No results.</p>}
    </ContentArea>
  )
}

function ToolsContent({ filter, sort, setSort, search, setSearch }: {
  filter: string; sort: SortOrder; setSort: (s: SortOrder) => void; search: string; setSearch: (s: string) => void
}) {
  const { starred } = useContext(StarsCtx)
  const q = search.toLowerCase()
  const filtered = useMemo(() => {
    let t = [...tools]
    if (filter) t = t.filter(x => x.category === filter)
    if (q) t = t.filter(x => x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q))
    return sortItems(t, sort, starred, x => x.github_stars ?? 0, x => x.name)
  }, [filter, sort, q, starred])
  return (
    <ContentArea title="Tools" subtitle={`${tools.length} tracked tools & repos`}>
      <FilterBar sort={sort} setSort={setSort} search={search} setSearch={setSearch} />
      {filtered.map(t => <ToolRow key={t.id} tool={t} />)}
      {filtered.length === 0 && <p className="text-sm text-gray-400">No results.</p>}
    </ContentArea>
  )
}

function ArticlesContent({ filter, sort, setSort, search, setSearch }: {
  filter: string; sort: SortOrder; setSort: (s: SortOrder) => void; search: string; setSearch: (s: string) => void
}) {
  const { starred } = useContext(StarsCtx)
  const q = search.toLowerCase()
  const filtered = useMemo(() => {
    let a = [...articles]
    if (filter) a = a.filter(x => x.topics.includes(filter))
    if (q) a = a.filter(x => x.title.toLowerCase().includes(q) || x.summary.toLowerCase().includes(q))
    return sortItems(a, sort, starred, articleRelevance, x => x.title)
  }, [filter, sort, q, starred])
  return (
    <ContentArea title="Articles" subtitle={`${articles.length} articles`}>
      <FilterBar sort={sort} setSort={setSort} search={search} setSearch={setSearch} />
      {filtered.map(a => <ArticleRow key={a.id} article={a} />)}
      {filtered.length === 0 && <p className="text-sm text-gray-400">No results.</p>}
    </ContentArea>
  )
}

function PodcastsContent({ filter, sort, setSort, search, setSearch }: {
  filter: string; sort: SortOrder; setSort: (s: SortOrder) => void; search: string; setSearch: (s: string) => void
}) {
  const { starred } = useContext(StarsCtx)
  const q = search.toLowerCase()
  const filtered = useMemo(() => {
    let p = [...podcasts]
    if (filter) p = p.filter(x => x.show === filter)
    if (q) p = p.filter(x => x.episode_title.toLowerCase().includes(q) || x.summary.toLowerCase().includes(q) || x.show.toLowerCase().includes(q))
    return sortItems(p, sort, starred, () => 0, x => x.episode_title)
  }, [filter, sort, q, starred])
  return (
    <ContentArea title="Podcasts" subtitle={`${podcasts.length} episodes`}>
      <FilterBar sort={sort} setSort={setSort} search={search} setSearch={setSearch} />
      {filtered.map(p => <PodcastRow key={p.id} episode={p} />)}
      {filtered.length === 0 && <p className="text-sm text-gray-400">No results.</p>}
    </ContentArea>
  )
}

function YouTubeContent({ filter, search, setSearch }: { filter: string; search: string; setSearch: (s: string) => void }) {
  const q = search.toLowerCase()
  const filtered = useMemo(() => {
    let c = [...youtubeChannels]
    if (filter) c = c.filter(x => x.topics.includes(filter))
    if (q) c = c.filter(x => x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q))
    return c
  }, [filter, q])
  return (
    <ContentArea title="YouTube" subtitle={`${youtubeChannels.length} channels`}>
      <SearchBar search={search} setSearch={setSearch} />
      {filtered.map(c => <YouTubeRow key={c.id} channel={c} />)}
      {filtered.length === 0 && <p className="text-sm text-gray-400">No results.</p>}
    </ContentArea>
  )
}

function EventsContent({ filter, search, setSearch }: { filter: string; search: string; setSearch: (s: string) => void }) {
  const q = search.toLowerCase()
  const filtered = useMemo(() => {
    let e = [...allEvents]
    if (filter) e = e.filter(x => x.date.startsWith(filter))
    if (q) e = e.filter(x => x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q) || x.notable_talks.some(t => t.title.toLowerCase().includes(q)))
    return e.sort((a, b) => b.date > a.date ? 1 : -1)
  }, [filter, q])
  return (
    <ContentArea title="Events" subtitle={`${allEvents.length} conferences & events`}>
      <SearchBar search={search} setSearch={setSearch} />
      {filtered.map(e => <EventRow key={e.id} event={e} />)}
      {filtered.length === 0 && <p className="text-sm text-gray-400">No results.</p>}
    </ContentArea>
  )
}

// ---- Run Now button ----

function RunNowBtn({ onNeedToken }: { onNeedToken: () => void }) {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const run = async () => {
    const token = localStorage.getItem('ai-research-github-token')
    if (!token) { onNeedToken(); return }
    setStatus('running')
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/research.yml/dispatches`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' },
        body: JSON.stringify({ ref: 'main' }),
      })
      if (!res.ok) throw new Error(`GitHub ${res.status}`)
      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : 'Error')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <button onClick={run} disabled={status === 'running'}
      title={status === 'error' ? errMsg : 'Trigger research.yml via GitHub Actions'}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
        status === 'done' ? 'border-green-300 text-green-600 bg-green-50' :
        status === 'error' ? 'border-red-300 text-red-500 bg-red-50' :
        'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800'
      }`}>
      {status === 'running' ? 'Starting…' : status === 'done' ? '✓ Queued' : status === 'error' ? 'Failed' : 'Run Now'}
    </button>
  )
}

// ---- Add Item Modal ----

function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: InboxItem) => void }) {
  const [url, setUrl] = useState('')
  const [type, setType] = useState('article')
  const [notes, setNotes] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem('ai-research-github-token') ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async () => {
    if (!url.trim()) return
    const item: InboxItem = { url: url.trim(), type, notes: notes.trim(), added: new Date().toISOString().split('T')[0] }
    setStatus('saving')
    try {
      if (token.trim()) {
        localStorage.setItem('ai-research-github-token', token.trim())
        const metaRes = await fetch(`https://api.github.com/repos/${REPO}/contents/data/inbox.json`, {
          headers: { Authorization: `Bearer ${token.trim()}`, Accept: 'application/vnd.github+json' },
        })
        if (!metaRes.ok) throw new Error(`GitHub API error: ${metaRes.status}`)
        const meta = await metaRes.json()
        const current: InboxItem[] = JSON.parse(atob(meta.content.replace(/\s/g, '')))
        current.push(item)
        const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/data/inbox.json`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token.trim()}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' },
          body: JSON.stringify({ message: 'Add item to research queue via web app', content: btoa(JSON.stringify(current, null, 2)), sha: meta.sha }),
        })
        if (!putRes.ok) throw new Error(`GitHub write error: ${putRes.status}`)
      }
      onAdd(item)
      setStatus('done')
      setTimeout(onClose, 1200)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Add to Research Queue</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">URL</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" autoFocus
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-400">
              {['article', 'podcast', 'video', 'tool', 'person', 'event'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Why is this relevant?"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              GitHub Token <span className="text-gray-400 font-normal">(writes directly to inbox.json — stored in your browser only)</span>
            </label>
            <input value={token} onChange={e => setToken(e.target.value)} type="password" placeholder="ghp_…"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400" />
            <p className="text-xs text-gray-400 mt-1">Without a token, item saves locally and shows in app but won't reach the repo or weekly agent.</p>
          </div>
        </div>
        {status === 'error' && <p className="mt-3 text-xs text-red-500">{errorMsg}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          <button onClick={submit} disabled={status === 'saving' || status === 'done'}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors">
            {status === 'saving' ? 'Saving…' : status === 'done' ? '✓ Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- App root ----

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('report')
  const [reportSection, setReportSection] = useState<ReportSection>('updates')
  const [sort, setSort] = useState<SortOrder>('relevance')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const { starred, toggle } = useStars()
  const { queue, addItem } = useLocalQueue()
  const { localGaps, addGap, updateGap } = useLocalGaps()

  const switchTab = (tab: MainTab) => {
    setActiveTab(tab)
    setSearch('')
    setCategoryFilter('')
    setTopicFilter('')
    setYearFilter('')
    if (tab === 'report') setReportSection('updates')
  }

  const switchReportSection = (s: ReportSection) => { setReportSection(s); setSearch('') }
  const switchCategory = (f: string) => { setCategoryFilter(f); setSearch('') }
  const switchTopic = (f: string) => { setTopicFilter(f); setSearch('') }
  const switchYear = (f: string) => { setYearFilter(f); setSearch('') }

  return (
    <StarsCtx.Provider value={{ starred, toggle }}>
      <div className="flex h-screen flex-col bg-gray-50 overflow-hidden">
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center px-6 py-2.5 border-b border-gray-100 gap-4">
            <div>
              <h1 className="font-bold text-gray-900 text-sm">AI Best Practices</h1>
              {lastRunDate && <p className="text-gray-400 text-xs">Last run: {lastRunDate}</p>}
            </div>
            <div className="flex items-center gap-3 ml-2">
              <button onClick={() => switchTab('people')} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">{people.length} people</button>
              <button onClick={() => switchTab('tools')} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">{tools.length} tools</button>
              <button onClick={() => switchTab('articles')} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">{articles.length} articles</button>
              <button onClick={() => switchTab('podcasts')} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">{podcasts.length} episodes</button>
              <button onClick={() => switchTab('events')} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">{allEvents.length} events</button>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {starred.size > 0 && <span className="text-xs text-yellow-500">★ {starred.size}</span>}
              <RunNowBtn onNeedToken={() => setShowAddModal(true)} />
              <button onClick={() => setShowAddModal(true)}
                className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
                + Add
              </button>
            </div>
          </div>
          <div className="flex px-4">
            {MAIN_TABS.map(t => (
              <button key={t.id} onClick={() => switchTab(t.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {activeTab === 'report' && <ReportIndex section={reportSection} setSection={switchReportSection} />}
          {activeTab === 'people' && <PeopleIndex filter={categoryFilter} setFilter={switchCategory} />}
          {activeTab === 'tools' && <ToolsIndex filter={categoryFilter} setFilter={switchCategory} />}
          {activeTab === 'articles' && <TopicIndex filter={topicFilter} setFilter={switchTopic} heading="Topic" />}
          {activeTab === 'podcasts' && <ShowIndex filter={categoryFilter} setFilter={switchCategory} />}
          {activeTab === 'youtube' && <TopicIndex filter={topicFilter} setFilter={switchTopic} heading="Topic" />}
          {activeTab === 'events' && <EventsIndex filter={yearFilter} setFilter={switchYear} />}

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'report' && <ReportContent section={reportSection} sort={sort} setSort={setSort} search={search} setSearch={setSearch} localQueue={queue} localGaps={localGaps} onAddGap={addGap} onUpdateGap={(id, status) => updateGap(id, { status })} />}
            {activeTab === 'people' && <PeopleContent filter={categoryFilter} sort={sort} setSort={setSort} search={search} setSearch={setSearch} />}
            {activeTab === 'tools' && <ToolsContent filter={categoryFilter} sort={sort} setSort={setSort} search={search} setSearch={setSearch} />}
            {activeTab === 'articles' && <ArticlesContent filter={topicFilter} sort={sort} setSort={setSort} search={search} setSearch={setSearch} />}
            {activeTab === 'podcasts' && <PodcastsContent filter={categoryFilter} sort={sort} setSort={setSort} search={search} setSearch={setSearch} />}
            {activeTab === 'youtube' && <YouTubeContent filter={topicFilter} search={search} setSearch={setSearch} />}
            {activeTab === 'events' && <EventsContent filter={yearFilter} search={search} setSearch={setSearch} />}
          </div>
        </div>

        {showAddModal && (
          <AddItemModal onClose={() => setShowAddModal(false)} onAdd={item => { addItem(item); setShowAddModal(false) }} />
        )}
      </div>
    </StarsCtx.Provider>
  )
}
