export interface Person {
  id: string
  name: string
  category: 'dev' | 'design' | 'dev-adjacent' | 'orchestration' | 'education'
  focus: string[]
  profiles: {
    github?: string | null
    bsky?: string | null
    x?: string | null
    linkedin?: string | null
    substack?: string | null
    medium?: string | null
    youtube?: string | null
    website?: string | null
  }
  talks: Talk[]
  podcast_episodes: PersonEpisode[]
  notable_contributions: string[]
  is_new?: boolean
  added: string
  last_updated: string
}

export interface Talk {
  title: string
  event: string
  url?: string | null
  date?: string | null
  topics: string[]
}

export interface PersonEpisode {
  show: string
  episode_title: string
  url?: string | null
  date?: string | null
  topics: string[]
}

export interface ToolFile {
  path: string
  chars: number
  tokens_approx: number
}

export interface Tool {
  id: string
  name: string
  category: string
  author_id?: string | null
  url: string
  github_url?: string | null
  github_stars?: number | null
  github_pushed_at?: string | null
  description: string
  topics: string[]
  status: 'active' | 'archived' | 'unknown'
  primary_files?: ToolFile[] | null
  files_checked?: string | null
  is_new?: boolean
  added: string
  last_updated: string
}

export interface Event {
  id: string
  name: string
  url: string
  date: string
  description: string
  notable_talks: EventTalk[]
  all_speakers?: Speaker[]
  is_new?: boolean
  added: string
  last_updated: string
}

export interface EventTalk {
  speaker_id: string
  title: string
  url?: string | null
  topics: string[]
}

export interface Speaker {
  name: string
  talk: string
  url?: string | null
  track?: string
  day?: string
}

export interface Article {
  id: string
  title: string
  author_id?: string | null
  url: string
  date: string
  topics: string[]
  summary: string
  recency_flag: 'current' | 'aging' | 'potentially-outdated'
  thumbnail_url?: string | null
  is_new?: boolean
  added: string
}

export interface PodcastEpisode {
  id: string
  show: string
  episode_title: string
  guest_id?: string | null
  url?: string | null
  date?: string | null
  topics: string[]
  summary: string
  thumbnail_url?: string | null
  is_new?: boolean
  added: string
}

export interface YouTubeChannel {
  id: string
  name: string
  url: string
  description: string
  topics: string[]
  added: string
}

export interface IndustryNorms {
  last_updated: string
  tool_adoption: NormItem[]
  model_recommendations: ModelRec[]
  workflow_norms: WorkflowNorm[]
  notes: string
}

export interface NormItem {
  claim: string
  source?: string | null
  date?: string | null
  confidence: string
  recently_changed?: boolean
}

export interface ModelRec {
  model: string
  recommended_for: string[]
  rationale: string
  source?: string | null
  date?: string | null
  confidence: string
  recently_changed?: boolean
}

export interface WorkflowNorm {
  norm: string
  source?: string | null
  date?: string | null
  confidence: string
  recently_changed?: boolean
}

export interface Topic {
  id: string
  name: string
  description: string
  status: string
  approaches: string[]
  sub_sections?: Record<string, { description: string; approaches: string[] }>
  related_people: string[]
  related_tools: string[]
}

export interface Gap {
  id: string
  area: string
  title: string
  description: string
  status: 'open' | 'resolved'
  identified: string
  linked_topic?: string | null
  potential_solutions: string[]
  notes: string
}

export interface InboxItem {
  url: string
  type: string
  notes: string
  added: string
  is_source?: boolean
  _comment?: string
}

export interface AgentQuestion {
  id: string
  asked: string
  run: string
  type: 'person-ingest' | 'url-verify' | 'topic-classify' | 'threshold' | 'other'
  question: string
  context?: string | null
  status: 'open' | 'answered' | 'dismissed'
  answer?: string | null
  answered_at?: string | null
}

export interface ResearchSource {
  id: string
  name: string
  type: 'podcast' | 'event-series' | 'social' | 'code-discovery' | 'article-feed' | 'youtube-channel'
  urls: Record<string, string>
  relevance_keywords?: string[]
  skip_keywords?: string[]
  search_queries?: string[]
  min_engagement_views?: number
  min_engagement_points?: number
  min_engagement_likes?: number
  min_engagement_upvotes?: number
  min_stars_velocity?: number
  notes: string
  added: string
  last_checked?: string | null
}

export type SortOrder = 'relevance' | 'recent' | 'alpha'
