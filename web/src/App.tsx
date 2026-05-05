import { useState, useMemo } from 'react'
import type { NavSection, ContentTab, SortOrder } from './types'
import peopleRaw from '../../data/people.json'
import toolsRaw from '../../data/tools.json'
import articlesRaw from '../../data/articles.json'
import podcastsRaw from '../../data/podcast_episodes.json'
import youtubeRaw from '../../data/youtube_channels.json'
import industryNormsRaw from '../../data/industry_norms.json'
import topicsRaw from '../../data/topics.json'
import type { Person, Tool, Article, PodcastEpisode, YouTubeChannel, IndustryNorms, Topic } from './types'

const people = peopleRaw as Person[]
const tools = toolsRaw as Tool[]
const articles = articlesRaw as Article[]
const podcasts = podcastsRaw as PodcastEpisode[]
const youtubeChannels = youtubeRaw as YouTubeChannel[]
const industryNorms = industryNormsRaw as IndustryNorms
const topics = topicsRaw as Topic[]

const NAV_ITEMS: { id: NavSection; label: string; icon: string }[] = [
  { id: 'new-updates', label: 'New Updates', icon: '⚡' },
  { id: 'people', label: 'People', icon: '👤' },
  { id: 'tools', label: 'Tools', icon: '🛠' },
  { id: 'governance', label: 'Governance & Repo', icon: '📋' },
  { id: 'orchestration', label: 'Orchestration', icon: '🕸' },
  { id: 'harness-engineering', label: 'Harness Engineering', icon: '⚙️' },
  { id: 'design-systems', label: 'Design Systems', icon: '🎨' },
  { id: 'industry-norms', label: 'Industry Norms', icon: '📊' },
]

const CONTENT_TABS: { id: ContentTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'people', label: 'People' },
  { id: 'tools', label: 'Tools' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'videos', label: 'YouTube' },
  { id: 'articles', label: 'Articles' },
]

const DOMAIN_TAGS = ['dev', 'design', 'dev-adjacent', 'orchestration', 'education']
const TOPIC_TAGS = ['session-management', 'skills', 'multi-agent-orchestration', 'design-systems', 'design-tooling', 'testing-tdd', 'repo-template-governance', 'unified-project-layer', 'harness-engineering', 'mcp']

function Tag({ label, color = 'gray' }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    pink: 'bg-pink-50 text-pink-700',
    new: 'bg-emerald-50 text-emerald-700 font-medium',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${colors[color] ?? colors.gray}`}>
      {label}
    </span>
  )
}

function ExternalLink({ href, children }: { href?: string | null; children: React.ReactNode }) {
  if (!href) return <span className="text-gray-400">{children}</span>
  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>
}

function ProfileLinks({ profiles }: { profiles: Person['profiles'] }) {
  const links = [
    { key: 'github', label: 'GH', url: profiles.github },
    { key: 'bsky', label: 'BSky', url: profiles.bsky },
    { key: 'x', label: 'X', url: profiles.x },
    { key: 'linkedin', label: 'LI', url: profiles.linkedin },
    { key: 'website', label: 'Web', url: profiles.website },
    { key: 'substack', label: 'Sub', url: profiles.substack },
  ]
  return (
    <div className="flex gap-1.5 flex-wrap">
      {links.filter(l => l.url).map(l => (
        <a key={l.key} href={l.url!} target="_blank" rel="noopener noreferrer"
          className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors">
          {l.label}
        </a>
      ))}
    </div>
  )
}

function PersonCard({ person }: { person: Person }) {
  const categoryColor: Record<string, string> = { dev: 'blue', design: 'pink', 'dev-adjacent': 'purple', orchestration: 'orange', education: 'green' }
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-gray-900 text-sm">{person.name}</h3>
        {person.is_new && <Tag label="new" color="new" />}
        <Tag label={person.category} color={categoryColor[person.category] ?? 'gray'} />
      </div>
      <div className="flex gap-1 flex-wrap">
        {person.focus.slice(0, 4).map(f => <Tag key={f} label={f} />)}
        {person.focus.length > 4 && <Tag label={`+${person.focus.length - 4}`} />}
      </div>
      {person.notable_contributions[0] && <p className="text-xs text-gray-600 leading-relaxed">{person.notable_contributions[0]}</p>}
      <ProfileLinks profiles={person.profiles} />
      {person.talks.length > 0 && (
        <p className="text-xs text-gray-500">
          <span className="font-medium">Talks: </span>
          {person.talks.slice(0, 2).map((t, i) => <span key={i}>{i > 0 && ' · '}<ExternalLink href={t.url}>{t.title}</ExternalLink></span>)}
        </p>
      )}
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  const author = people.find(p => p.id === tool.author_id)
  const categoryColor: Record<string, string> = { 'claude-code-tooling': 'blue', orchestration: 'purple', 'design-tooling': 'pink', testing: 'green' }
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-gray-900 text-sm"><ExternalLink href={tool.url}>{tool.name}</ExternalLink></h3>
        {tool.is_new && <Tag label="new" color="new" />}
      </div>
      <Tag label={tool.category} color={categoryColor[tool.category] ?? 'gray'} />
      <p className="text-xs text-gray-600 leading-relaxed">{tool.description}</p>
      <div className="flex gap-1 flex-wrap">{tool.topics.slice(0, 4).map(t => <Tag key={t} label={t} />)}</div>
      {author && <p className="text-xs text-gray-400">by {author.name}</p>}
    </div>
  )
}

function ArticleCard({ article }: { article: Article }) {
  const author = people.find(p => p.id === article.author_id)
  const flagColor: Record<string, string> = { current: 'green', aging: 'orange', 'potentially-outdated': 'orange' }
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="font-semibold text-gray-900 text-sm"><ExternalLink href={article.url}>{article.title}</ExternalLink></h3>
        {article.is_new && <Tag label="new" color="new" />}
        <Tag label={article.recency_flag} color={flagColor[article.recency_flag] ?? 'gray'} />
      </div>
      <div className="flex gap-2 items-center">
        {author && <span className="text-xs text-gray-500">{author.name}</span>}
        {article.date && <span className="text-xs text-gray-400">{article.date}</span>}
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{article.summary}</p>
      <div className="flex gap-1 flex-wrap">{article.topics.slice(0, 4).map(t => <Tag key={t} label={t} />)}</div>
    </div>
  )
}

function PodcastCard({ episode }: { episode: PodcastEpisode }) {
  const guest = people.find(p => p.id === episode.guest_id)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-2">
        <span className="text-lg">🎙</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm"><ExternalLink href={episode.url}>{episode.episode_title}</ExternalLink></h3>
            {episode.is_new && <Tag label="new" color="new" />}
          </div>
          <div className="flex gap-2 mt-0.5 items-center flex-wrap">
            <span className="text-xs font-medium text-gray-600">{episode.show}</span>
            {guest && <span className="text-xs text-gray-500">with {guest.name}</span>}
            {episode.date && <span className="text-xs text-gray-400">{episode.date}</span>}
          </div>
        </div>
      </div>
      {episode.summary && <p className="text-xs text-gray-600 leading-relaxed">{episode.summary}</p>}
      <div className="flex gap-1 flex-wrap">{episode.topics.slice(0, 4).map(t => <Tag key={t} label={t} />)}</div>
    </div>
  )
}

function YouTubeCard({ channel }: { channel: YouTubeChannel }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-2">
        <span className="text-lg">▶️</span>
        <h3 className="font-semibold text-gray-900 text-sm"><ExternalLink href={channel.url}>{channel.name}</ExternalLink></h3>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{channel.description}</p>
      <div className="flex gap-1 flex-wrap">{channel.topics.slice(0, 4).map(t => <Tag key={t} label={t} />)}</div>
    </div>
  )
}

function FilterBar({ sort, setSort, domainFilter, setDomainFilter, topicFilter, setTopicFilter, showDomain = false, showTopic = false }:
  { sort: SortOrder; setSort: (s: SortOrder) => void; domainFilter: string; setDomainFilter: (d: string) => void; topicFilter: string; setTopicFilter: (t: string) => void; showDomain?: boolean; showTopic?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(['recent', 'all-time', 'alpha'] as SortOrder[]).map(s => (
          <button key={s} onClick={() => setSort(s)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${sort === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {s === 'recent' ? 'Recent' : s === 'all-time' ? 'All Time' : 'A–Z'}
          </button>
        ))}
      </div>
      {showDomain && (
        <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white">
          <option value="">All domains</option>
          {DOMAIN_TAGS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      )}
      {showTopic && (
        <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white">
          <option value="">All topics</option>
          {TOPIC_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      )}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{label} ({count})</h3>
}

function NewUpdatesSection({ tab, sort, setSort, domainFilter, setDomainFilter, topicFilter, setTopicFilter }:
  { tab: ContentTab; sort: SortOrder; setSort: (s: SortOrder) => void; domainFilter: string; setDomainFilter: (d: string) => void; topicFilter: string; setTopicFilter: (t: string) => void }) {
  const newPeople = useMemo(() => {
    let p = people.filter(x => x.is_new)
    if (domainFilter) p = p.filter(x => x.category === domainFilter)
    return p
  }, [domainFilter])
  const newTools = useMemo(() => {
    let t = tools.filter(x => x.is_new)
    if (topicFilter) t = t.filter(x => x.topics.includes(topicFilter))
    return t
  }, [topicFilter])
  const newArticles = useMemo(() => {
    let a = articles.filter(x => x.is_new)
    if (topicFilter) a = a.filter(x => x.topics.includes(topicFilter))
    return a
  }, [topicFilter])
  const newPodcasts = useMemo(() => {
    let p = podcasts.filter(x => x.is_new)
    if (topicFilter) p = p.filter(x => x.topics.includes(topicFilter))
    return p
  }, [topicFilter])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">New Updates</h2>
        <p className="text-sm text-gray-500">Items added in the most recent research run</p>
      </div>
      <FilterBar sort={sort} setSort={setSort} domainFilter={domainFilter} setDomainFilter={setDomainFilter} topicFilter={topicFilter} setTopicFilter={setTopicFilter} showDomain showTopic />
      {(tab === 'all' || tab === 'people') && newPeople.length > 0 && <div className="mb-6"><SectionHeader label="People" count={newPeople.length} /><Grid>{newPeople.map(p => <PersonCard key={p.id} person={p} />)}</Grid></div>}
      {(tab === 'all' || tab === 'tools') && newTools.length > 0 && <div className="mb-6"><SectionHeader label="Tools" count={newTools.length} /><Grid>{newTools.map(t => <ToolCard key={t.id} tool={t} />)}</Grid></div>}
      {(tab === 'all' || tab === 'podcasts') && newPodcasts.length > 0 && <div className="mb-6"><SectionHeader label="Podcasts" count={newPodcasts.length} /><Grid>{newPodcasts.map(p => <PodcastCard key={p.id} episode={p} />)}</Grid></div>}
      {(tab === 'all' || tab === 'articles') && newArticles.length > 0 && <div className="mb-6"><SectionHeader label="Articles" count={newArticles.length} /><Grid>{newArticles.map(a => <ArticleCard key={a.id} article={a} />)}</Grid></div>}
    </div>
  )
}

function PeopleSection({ sort, setSort, domainFilter, setDomainFilter, topicFilter, setTopicFilter }:
  { sort: SortOrder; setSort: (s: SortOrder) => void; domainFilter: string; setDomainFilter: (d: string) => void; topicFilter: string; setTopicFilter: (t: string) => void }) {
  const filtered = useMemo(() => {
    let p = [...people]
    if (domainFilter) p = p.filter(x => x.category === domainFilter)
    if (topicFilter) p = p.filter(x => x.focus.some(f => f.includes(topicFilter)))
    if (sort === 'alpha') p.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'recent') p.sort((a, b) => b.added > a.added ? 1 : -1)
    return p
  }, [sort, domainFilter, topicFilter])
  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-900 mb-1">People</h2><p className="text-sm text-gray-500">{people.length} tracked practitioners</p></div>
      <FilterBar sort={sort} setSort={setSort} domainFilter={domainFilter} setDomainFilter={setDomainFilter} topicFilter={topicFilter} setTopicFilter={setTopicFilter} showDomain showTopic />
      <Grid>{filtered.map(p => <PersonCard key={p.id} person={p} />)}</Grid>
    </div>
  )
}

function ToolsSection({ tab, sort, setSort, topicFilter, setTopicFilter, domainFilter, setDomainFilter }:
  { tab: ContentTab; sort: SortOrder; setSort: (s: SortOrder) => void; topicFilter: string; setTopicFilter: (t: string) => void; domainFilter: string; setDomainFilter: (d: string) => void }) {
  const filtered = useMemo(() => {
    let t = [...tools]
    if (topicFilter) t = t.filter(x => x.topics.includes(topicFilter))
    if (sort === 'alpha') t.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'recent') t.sort((a, b) => b.added > a.added ? 1 : -1)
    return t
  }, [sort, topicFilter])
  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-900 mb-1">Tools</h2><p className="text-sm text-gray-500">{tools.length} tracked tools & repos</p></div>
      <FilterBar sort={sort} setSort={setSort} domainFilter={domainFilter} setDomainFilter={setDomainFilter} topicFilter={topicFilter} setTopicFilter={setTopicFilter} showTopic />
      {(tab === 'all' || tab === 'tools') && <div className="mb-6"><Grid>{filtered.map(t => <ToolCard key={t.id} tool={t} />)}</Grid></div>}
      {(tab === 'all' || tab === 'podcasts') && <div className="mb-6"><SectionHeader label="Related Podcasts" count={podcasts.length} /><Grid>{podcasts.map(p => <PodcastCard key={p.id} episode={p} />)}</Grid></div>}
      {(tab === 'all' || tab === 'articles') && <div className="mb-6"><SectionHeader label="Related Articles" count={articles.length} /><Grid>{articles.map(a => <ArticleCard key={a.id} article={a} />)}</Grid></div>}
      {(tab === 'all' || tab === 'videos') && <div className="mb-6"><SectionHeader label="YouTube Channels" count={youtubeChannels.length} /><Grid>{youtubeChannels.map(c => <YouTubeCard key={c.id} channel={c} />)}</Grid></div>}
    </div>
  )
}

function TopicSection({ topicIds, title, description, tab, sort, setSort, topicFilter, setTopicFilter, domainFilter, setDomainFilter }:
  { topicIds: string[]; title: string; description: string; tab: ContentTab; sort: SortOrder; setSort: (s: SortOrder) => void; topicFilter: string; setTopicFilter: (t: string) => void; domainFilter: string; setDomainFilter: (d: string) => void }) {
  const relevantTopics = topics.filter(t => topicIds.includes(t.id))
  const kw = topicIds.flatMap(id => [id, ...id.split('-')])
  const match = (tags: string[]) => tags.some(tag => kw.some(k => tag.includes(k)))

  const filteredTools = useMemo(() => tools.filter(t => match(t.topics)), [topicIds])
  const filteredPeople = useMemo(() => {
    let p = people.filter(x => x.focus.some(f => kw.some(k => f.includes(k))))
    if (domainFilter) p = p.filter(x => x.category === domainFilter)
    return p
  }, [topicIds, domainFilter])
  const filteredPodcasts = useMemo(() => podcasts.filter(p => match(p.topics)), [topicIds])
  const filteredArticles = useMemo(() => articles.filter(a => match(a.topics)), [topicIds])

  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2><p className="text-sm text-gray-500">{description}</p></div>
      {relevantTopics.map(topic => (
        <div key={topic.id} className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 text-sm mb-1">{topic.name}</h3>
          <p className="text-xs text-blue-700 mb-2">{topic.description}</p>
          {topic.approaches.length > 0 && (
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              {topic.approaches.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          )}
        </div>
      ))}
      <FilterBar sort={sort} setSort={setSort} domainFilter={domainFilter} setDomainFilter={setDomainFilter} topicFilter={topicFilter} setTopicFilter={setTopicFilter} showDomain />
      {(tab === 'all' || tab === 'tools') && filteredTools.length > 0 && <div className="mb-6"><SectionHeader label="Tools" count={filteredTools.length} /><Grid>{filteredTools.map(t => <ToolCard key={t.id} tool={t} />)}</Grid></div>}
      {(tab === 'all' || tab === 'people') && filteredPeople.length > 0 && <div className="mb-6"><SectionHeader label="People" count={filteredPeople.length} /><Grid>{filteredPeople.map(p => <PersonCard key={p.id} person={p} />)}</Grid></div>}
      {(tab === 'all' || tab === 'podcasts') && filteredPodcasts.length > 0 && <div className="mb-6"><SectionHeader label="Podcasts" count={filteredPodcasts.length} /><Grid>{filteredPodcasts.map(p => <PodcastCard key={p.id} episode={p} />)}</Grid></div>}
      {(tab === 'all' || tab === 'articles') && filteredArticles.length > 0 && <div className="mb-6"><SectionHeader label="Articles" count={filteredArticles.length} /><Grid>{filteredArticles.map(a => <ArticleCard key={a.id} article={a} />)}</Grid></div>}
      {(tab === 'all' || tab === 'videos') && <div className="mb-6"><SectionHeader label="YouTube Channels" count={youtubeChannels.length} /><Grid>{youtubeChannels.map(c => <YouTubeCard key={c.id} channel={c} />)}</Grid></div>}
    </div>
  )
}

function IndustryNormsSection() {
  const cc: Record<string, string> = { 'official-docs': 'blue', 'community-consensus': 'green', 'practitioner-consensus': 'green', survey: 'purple', emerging: 'orange', anecdotal: 'gray', unclear: 'gray' }
  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-900 mb-1">Industry Norms</h2><p className="text-sm text-gray-500">Updated {industryNorms.last_updated}</p></div>
      <div className="mb-6">
        <SectionHeader label="Model Recommendations" count={industryNorms.model_recommendations.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {industryNorms.model_recommendations.map((m, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{m.model}</code>
                <Tag label={m.confidence} color={cc[m.confidence] ?? 'gray'} />
                {m.recently_changed && <Tag label="changed" color="orange" />}
              </div>
              <p className="text-xs text-gray-600">{m.rationale}</p>
              <div className="flex gap-1 flex-wrap">{m.recommended_for.map(r => <Tag key={r} label={r} />)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <SectionHeader label="Tool Adoption" count={industryNorms.tool_adoption.length} />
        <div className="flex flex-col gap-2">
          {industryNorms.tool_adoption.map((t, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-2">
              <Tag label={t.confidence} color={cc[t.confidence] ?? 'gray'} />
              <p className="text-xs text-gray-700 flex-1">{t.claim}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <SectionHeader label="Workflow Norms" count={industryNorms.workflow_norms.length} />
        <div className="flex flex-col gap-2">
          {industryNorms.workflow_norms.map((w, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-2">
              <Tag label={w.confidence} color={cc[w.confidence] ?? 'gray'} />
              {w.recently_changed && <Tag label="changed" color="orange" />}
              <p className="text-xs text-gray-700 flex-1">{w.norm}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [nav, setNav] = useState<NavSection>('new-updates')
  const [tab, setTab] = useState<ContentTab>('all')
  const [sort, setSort] = useState<SortOrder>('recent')
  const [domainFilter, setDomainFilter] = useState('')
  const [topicFilter, setTopicFilter] = useState('')

  const resetFilters = (newNav: NavSection) => { setNav(newNav); setTab('all'); setDomainFilter(''); setTopicFilter('') }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-white font-bold text-sm leading-tight">AI Best Practices</h1>
          <p className="text-gray-400 text-xs mt-0.5">Living Research</p>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => resetFilters(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 mb-0.5 transition-colors ${nav === item.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="text-gray-500 text-xs">{people.length} people · {tools.length} tools</p>
          <p className="text-gray-500 text-xs">{articles.length} articles · {podcasts.length} episodes</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {nav !== 'industry-norms' && (
          <div className="bg-white border-b border-gray-200 px-6 flex items-center gap-1 flex-shrink-0">
            {CONTENT_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">
          {nav === 'new-updates' && <NewUpdatesSection tab={tab} sort={sort} setSort={setSort} domainFilter={domainFilter} setDomainFilter={setDomainFilter} topicFilter={topicFilter} setTopicFilter={setTopicFilter} />}
          {nav === 'people' && <PeopleSection sort={sort} setSort={setSort} domainFilter={domainFilter} setDomainFilter={setDomainFilter} topicFilter={topicFilter} setTopicFilter={setTopicFilter} />}
          {nav === 'tools' && <ToolsSection tab={tab} sort={sort} setSort={setSort} topicFilter={topicFilter} setTopicFilter={setTopicFilter} domainFilter={domainFilter} setDomainFilter={setDomainFilter} />}
          {nav === 'governance' && <TopicSection topicIds={['repo-template-governance', 'skills']} title="Governance & Repo Structure" description="CLAUDE.md, DESIGN.md, SKILL.md patterns, hooks, skills, subagent profiles" tab={tab} sort={sort} setSort={setSort} topicFilter={topicFilter} setTopicFilter={setTopicFilter} domainFilter={domainFilter} setDomainFilter={setDomainFilter} />}
          {nav === 'orchestration' && <TopicSection topicIds={['multi-agent-orchestration', 'session-management', 'unified-project-layer']} title="Orchestration" description="Multi-agent patterns, session management, context compaction, unified project interfaces" tab={tab} sort={sort} setSort={setSort} topicFilter={topicFilter} setTopicFilter={setTopicFilter} domainFilter={domainFilter} setDomainFilter={setDomainFilter} />}
          {nav === 'harness-engineering' && <TopicSection topicIds={['harness-engineering', 'repo-template-governance', 'testing-tdd']} title="Harness Engineering" description="Structured constraints for coding agents — humans steer, agents execute." tab={tab} sort={sort} setSort={setSort} topicFilter={topicFilter} setTopicFilter={setTopicFilter} domainFilter={domainFilter} setDomainFilter={setDomainFilter} />}
          {nav === 'design-systems' && <TopicSection topicIds={['design-systems', 'design-tooling']} title="Design Systems & Tooling" description="DESIGN.md, design tokens, paper.design, fast UI iteration approaches" tab={tab} sort={sort} setSort={setSort} topicFilter={topicFilter} setTopicFilter={setTopicFilter} domainFilter={domainFilter} setDomainFilter={setDomainFilter} />}
          {nav === 'industry-norms' && <IndustryNormsSection />}
        </div>
      </div>
    </div>
  )
}
