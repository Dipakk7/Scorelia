import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Scan,
  MailOpen,
  MessageSquareCode,
  Map,
  Database,
  Bot,
  BarChart3,
  Settings,
  Search,
  CornerDownLeft,
  History,
  Zap,
  Compass,
  X,
} from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { cn } from '@/lib/utils'

export interface SearchModuleItem {
  id: string
  to: string
  label: string
  description: string
  category: 'Core' | 'AI Intelligence' | 'Practice' | 'Analytics' | 'Settings'
  badgeText?: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  keywords?: string[]
}

const ALL_MODULES: SearchModuleItem[] = [
  {
    id: 'dashboard',
    to: '/dashboard',
    label: 'Dashboard',
    description: 'Overview of your career command center & key metrics',
    category: 'Core',
    badgeText: 'Overview',
    icon: LayoutDashboard,
    keywords: ['home', 'overview', 'metrics', 'stats', 'dashboard'],
  },
  {
    id: 'resumes',
    to: '/resumes',
    label: 'Resume Builder',
    description: 'Create, edit, ATS-optimize, and export professional resumes',
    category: 'Core',
    badgeText: 'Editor',
    icon: FileText,
    keywords: ['cv', 'resume', 'pdf', 'export', 'templates', 'build'],
  },
  {
    id: 'resume-intelligence',
    to: '/resume-intelligence',
    label: 'AI Resume Intelligence',
    description: 'Deep AI audit on formatting, impact density & readability',
    category: 'AI Intelligence',
    badgeText: 'AI Audit',
    icon: Sparkles,
    keywords: ['score', 'analysis', 'intelligence', 'audit', 'formatting', 'achievements'],
  },
  {
    id: 'ats',
    to: '/ats',
    label: 'ATS Analysis',
    description: 'Semantic keyword gap analysis and applicant tracking match',
    category: 'AI Intelligence',
    badgeText: 'ATS Match',
    icon: Scan,
    keywords: ['ats', 'keywords', 'match', 'parser', 'gap', 'job description'],
  },
  {
    id: 'cover-letter',
    to: '/cover-letter',
    label: 'AI Cover Letter',
    description: 'Generate hyper-tailored cover letters for specific job postings',
    category: 'AI Intelligence',
    badgeText: 'Generator',
    icon: MailOpen,
    keywords: ['letter', 'application', 'tailor', 'cover', 'writing'],
  },
  {
    id: 'interview',
    to: '/interview',
    label: 'AI Interview Prep',
    description: 'Practice mock interview rounds with real-time AI feedback',
    category: 'Practice',
    badgeText: 'Mock AI',
    icon: MessageSquareCode,
    keywords: ['interview', 'mock', 'questions', 'star method', 'practice', 'feedback'],
  },
  {
    id: 'roadmap',
    to: '/roadmap',
    label: 'Career Roadmap',
    description: 'Map out weekly learning milestones and strategic career path',
    category: 'Core',
    badgeText: 'Milestones',
    icon: Map,
    keywords: ['roadmap', 'goals', 'milestones', 'learning', 'career', 'path'],
  },
  {
    id: 'rag-workspace',
    to: '/rag-workspace',
    label: 'RAG Workspace',
    description: 'Semantic search on candidate documentation & knowledge base',
    category: 'AI Intelligence',
    badgeText: 'Docs Search',
    icon: Database,
    keywords: ['rag', 'knowledge', 'documents', 'embeddings', 'docs', 'search'],
  },
  {
    id: 'agents',
    to: '/agents',
    label: 'Agent Console',
    description: 'Coordinate multi-agent background audits & automated workflows',
    category: 'AI Intelligence',
    badgeText: 'Multi-Agent',
    icon: Bot,
    keywords: ['agents', 'automation', 'tasks', 'console', 'pipeline'],
  },
  {
    id: 'analytics',
    to: '/analytics',
    label: 'Analytics Center',
    description: 'Visualize application performance & career growth health scores',
    category: 'Analytics',
    badgeText: 'Metrics',
    icon: BarChart3,
    keywords: ['analytics', 'charts', 'trends', 'performance', 'reports'],
  },
  {
    id: 'github-intelligence',
    to: '/github-intelligence',
    label: 'GitHub Intelligence',
    description: 'Fetch repository commit data and generate developer scorecards',
    category: 'Analytics',
    badgeText: 'Repos',
    icon: Github,
    keywords: ['github', 'git', 'repos', 'developer', 'commits', 'code'],
  },
  {
    id: 'settings',
    to: '/settings',
    label: 'Settings',
    description: 'Configure account preferences, security, API keys & appearance',
    category: 'Settings',
    badgeText: 'Config',
    icon: Settings,
    keywords: ['settings', 'account', 'theme', 'profile', 'security', 'preferences'],
  },
]

const RECENT_MODULES: SearchModuleItem[] = [
  ALL_MODULES[2], // AI Resume Intelligence
  ALL_MODULES[3], // ATS Analysis
  ALL_MODULES[5], // AI Interview Prep
]

const FREQUENT_MODULES: SearchModuleItem[] = [
  ALL_MODULES[1], // Resume Builder
  ALL_MODULES[6], // Career Roadmap
  ALL_MODULES[7], // RAG Workspace
]

const SUGGESTED_ACTIONS: SearchModuleItem[] = [
  {
    id: 'suggest-audit',
    to: '/resume-intelligence',
    label: 'Audit Resume Score',
    description: 'Evaluate ATS impact, readability & formatting risks',
    category: 'AI Intelligence',
    badgeText: 'Action',
    icon: Sparkles,
  },
  {
    id: 'suggest-mock',
    to: '/interview',
    label: 'Start Mock Interview Round',
    description: 'Practice behavioral & technical STAR questions',
    category: 'Practice',
    badgeText: 'Action',
    icon: MessageSquareCode,
  },
  {
    id: 'suggest-builder',
    to: '/resumes',
    label: 'Create New Resume Draft',
    description: 'Build an ATS-optimized single page resume',
    category: 'Core',
    badgeText: 'Action',
    icon: FileText,
  },
  {
    id: 'suggest-github',
    to: '/github-intelligence',
    label: 'Build GitHub Developer Scorecard',
    description: 'Analyze commit density, code quality & language mix',
    category: 'Analytics',
    badgeText: 'Action',
    icon: Github,
  },
]

// Text Highlighter helper component
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className="bg-purple-500/25 text-purple-700 dark:text-purple-300 font-bold rounded-[2px] px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

interface AnchoredGlobalSearchProps {
  className?: string
}

export function AnchoredGlobalSearch({ className }: AnchoredGlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Global keydown for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return

      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
        inputRef.current?.focus()
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isOpen])

  // Filter items when query is present
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    return ALL_MODULES.map((item) => {
      const labelMatch = item.label.toLowerCase().includes(q)
      const descMatch = item.description.toLowerCase().includes(q)
      const keywordMatch = item.keywords?.some((k) => k.toLowerCase().includes(q))
      
      let score = 0
      if (item.label.toLowerCase() === q) score = 4
      else if (item.label.toLowerCase().startsWith(q)) score = 3
      else if (labelMatch) score = 2
      else if (descMatch || keywordMatch) score = 1

      return { item, score }
    })
      .filter((el) => el.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((el) => el.item)
  }, [query])

  // Flat list for empty query state navigation
  const emptyStateFlatItems = useMemo(() => {
    return [
      ...RECENT_MODULES.map((item) => ({ ...item, sectionGroup: 'Recent Modules' })),
      ...FREQUENT_MODULES.map((item) => ({ ...item, sectionGroup: 'Frequently Used' })),
      ...SUGGESTED_ACTIONS.map((item) => ({ ...item, sectionGroup: 'Suggested Actions' })),
    ]
  }, [])

  // Currently active items list based on query state
  const activeItems = useMemo(() => {
    return query.trim() ? filteredItems : emptyStateFlatItems
  }, [query, filteredItems, emptyStateFlatItems])

  // Reset selected index when query or active items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Handle Arrow navigation and Enter selection
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
      }
      return
    }

    if (activeItems.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % activeItems.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length)
        break
      case 'Enter':
        e.preventDefault()
        if (activeItems[selectedIndex]) {
          handleSelect(activeItems[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  // Scroll active item into view when navigating via keyboard
  useEffect(() => {
    if (listRef.current && isOpen) {
      const activeElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex, isOpen])

  const handleSelect = (item: { to: string }) => {
    navigate(item.to)
    setIsOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-md', className)} role="search">
      {/* Anchored Search Bar Input */}
      <div className="relative w-full flex items-center">
        <Search
          size={16}
          className="absolute left-3.5 text-[var(--muted-color)] group-hover:text-purple-500 transition-colors pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search modules, actions or pages..."
          aria-label="Global search input"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="anchored-search-dropdown"
          className="w-full pl-9 pr-14 py-2 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/30 text-xs font-medium text-[var(--heading)] placeholder:text-[var(--muted-color)] focus:outline-none focus:border-purple-500/50 focus-visible:ring-2 focus-visible:ring-purple-500/30 transition-all shadow-inner"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Clear search query"
            className="absolute right-3.5 p-0.5 rounded-full hover:bg-[var(--border)] text-[var(--muted-color)] hover:text-[var(--heading)] transition-colors cursor-pointer"
          >
            <X size={13} />
          </button>
        ) : (
          <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[var(--muted-color)] bg-[var(--surface)] rounded border border-[var(--border)] flex items-center gap-0.5 pointer-events-none select-none">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        )}
      </div>

      {/* Floating Anchored Search Dropdown Panel */}
      {isOpen && (
        <div
          id="anchored-search-dropdown"
          role="listbox"
          aria-label="Global search results"
          className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-1.5 w-full sm:w-[540px] max-w-[calc(100vw-2rem)] max-h-[480px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1.5 duration-150 ease-out origin-top select-none text-left"
        >
          {/* Internal Scrollable Content */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
            {query.trim() ? (
              /* Search Query Results State */
              <div>
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase font-mono tracking-widest text-purple-700 dark:text-purple-300 flex items-center justify-between border-b border-[var(--border)]/60 mb-1.5">
                  <span>Search Results</span>
                  <span className="font-sans font-semibold text-[10px] text-[var(--muted-color)]">
                    {filteredItems.length} match{filteredItems.length !== 1 ? 'es' : ''}
                  </span>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="py-10 text-center text-xs text-[var(--muted-color)] font-medium">
                    No modules or actions match <span className="font-bold text-[var(--heading)]">"{query}"</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredItems.map((item, index) => {
                      const Icon = item.icon
                      const isSelected = index === selectedIndex

                      return (
                        <div
                          key={item.id}
                          data-index={index}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group',
                            isSelected
                              ? 'bg-purple-600/15 border border-purple-500/30 text-[var(--heading)] shadow-sm'
                              : 'hover:bg-[var(--surface-hover)] text-[var(--body)] border border-transparent'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={cn(
                                'p-2 rounded-lg shrink-0 transition-colors',
                                isSelected
                                  ? 'bg-purple-600/20 text-purple-700 dark:text-purple-300'
                                  : 'bg-[var(--surface-hover)] text-[var(--muted-color)] group-hover:text-[var(--heading)]'
                              )}
                            >
                              <Icon size={18} />
                            </div>
                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[var(--heading)] tracking-tight">
                                  <HighlightText text={item.label} query={query} />
                                </span>
                                {item.badgeText && (
                                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                                    {item.badgeText}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[var(--muted-color)] truncate leading-tight mt-0.5">
                                <HighlightText text={item.description} query={query} />
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 shrink-0 font-mono">
                              <span>Open</span>
                              <CornerDownLeft size={12} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Empty Query State (Recent, Frequently Used, Suggested Actions) */
              <div className="space-y-3.5 py-1">
                {/* 1. Recent Modules */}
                <div>
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase font-mono tracking-widest text-[var(--muted-color)] flex items-center gap-1.5 mb-1">
                    <History size={12} className="text-purple-700 dark:text-purple-400" />
                    <span>Recent Modules</span>
                  </div>
                  <div className="space-y-0.5">
                    {RECENT_MODULES.map((item, idx) => {
                      const itemIndex = idx
                      const isSelected = itemIndex === selectedIndex
                      const Icon = item.icon

                      return (
                        <div
                          key={item.id}
                          data-index={itemIndex}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={cn(
                            'flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 group',
                            isSelected
                              ? 'bg-purple-600/15 border border-purple-500/30 text-[var(--heading)] shadow-sm'
                              : 'hover:bg-[var(--surface-hover)] text-[var(--body)] border border-transparent'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon
                              size={16}
                              className={cn(
                                'shrink-0',
                                isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-[var(--muted-color)]'
                              )}
                            />
                            <span className="text-xs font-semibold text-[var(--heading)] truncate">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--muted-color)]">
                            {item.category}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Frequently Used */}
                <div>
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase font-mono tracking-widest text-[var(--muted-color)] flex items-center gap-1.5 mb-1">
                    <Zap size={12} className="text-amber-500" />
                    <span>Frequently Used</span>
                  </div>
                  <div className="space-y-0.5">
                    {FREQUENT_MODULES.map((item, idx) => {
                      const itemIndex = RECENT_MODULES.length + idx
                      const isSelected = itemIndex === selectedIndex
                      const Icon = item.icon

                      return (
                        <div
                          key={item.id}
                          data-index={itemIndex}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={cn(
                            'flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 group',
                            isSelected
                              ? 'bg-purple-600/15 border border-purple-500/30 text-[var(--heading)] shadow-sm'
                              : 'hover:bg-[var(--surface-hover)] text-[var(--body)] border border-transparent'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon
                              size={16}
                              className={cn(
                                'shrink-0',
                                isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-[var(--muted-color)]'
                              )}
                            />
                            <span className="text-xs font-semibold text-[var(--heading)] truncate">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--muted-color)]">
                            {item.badgeText}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Suggested Actions */}
                <div>
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase font-mono tracking-widest text-[var(--muted-color)] flex items-center gap-1.5 mb-1">
                    <Compass size={12} className="text-purple-700 dark:text-purple-400" />
                    <span>Suggested Actions</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-1">
                    {SUGGESTED_ACTIONS.map((item, idx) => {
                      const itemIndex = RECENT_MODULES.length + FREQUENT_MODULES.length + idx
                      const isSelected = itemIndex === selectedIndex
                      const Icon = item.icon

                      return (
                        <div
                          key={item.id}
                          data-index={itemIndex}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={cn(
                            'p-2.5 rounded-xl cursor-pointer border transition-all duration-150 flex flex-col gap-0.5 text-left',
                            isSelected
                              ? 'bg-purple-600/15 border-purple-500/40 text-[var(--heading)] shadow-sm'
                              : 'bg-[var(--surface-hover)]/40 border-[var(--border)] hover:border-purple-500/30 text-[var(--body)]'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              size={14}
                              className={cn(
                                isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-[var(--muted-color)]'
                              )}
                            />
                            <span className="text-xs font-bold text-[var(--heading)] truncate">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--muted-color)] truncate pl-5">
                            {item.description}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts & Legend */}
          <div className="px-4 py-2.5 bg-[var(--surface-hover)]/50 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-bold text-[var(--muted-color)] uppercase tracking-wider select-none font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">Esc</kbd> Close
              </span>
            </div>
            <span>Scorelia Search</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnchoredGlobalSearch
