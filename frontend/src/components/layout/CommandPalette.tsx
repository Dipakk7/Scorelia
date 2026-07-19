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
} from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/Dialog'
import { cn } from '@/lib/utils'

interface CommandItem {
  to: string
  label: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const MODULES_LIST: CommandItem[] = [
  { to: '/dashboard', label: 'Dashboard', description: 'Overview of your career command center', icon: LayoutDashboard },
  { to: '/resumes', label: 'Resume Builder', description: 'Create, edit, and export your resumes', icon: FileText },
  { to: '/resume-intelligence', label: 'AI Resume Intelligence', description: 'Analyze resume score and format checks', icon: Sparkles },
  { to: '/ats', label: 'ATS Analysis', description: 'Semantic keyword gap analysis and job matching', icon: Scan },
  { to: '/cover-letter', label: 'AI Cover Letter', description: 'Generate custom tailored cover letters', icon: MailOpen },
  { to: '/interview', label: 'AI Interview Prep', description: 'Practice mock interview rounds with real-time feedback', icon: MessageSquareCode },
  { to: '/roadmap', label: 'Career Roadmap', description: 'Map out weekly learning milestones and career path', icon: Map },
  { to: '/rag-workspace', label: 'RAG Workspace', description: 'Semantic search on your knowledge documentations', icon: Database },
  { to: '/agents', label: 'Agent Console', description: 'Coordinate multi-agent background audits', icon: Bot },
  { to: '/analytics', label: 'Analytics Center', description: 'Visualize your progress and career health scores', icon: BarChart3 },
  { to: '/github-intelligence', label: 'GitHub Intelligence', description: 'Fetch repositories data and build scorecards', icon: Github },
  { to: '/settings', label: 'Settings', description: 'Configure preferences, security, and appearance', icon: Settings },
]

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside IME composition session
      if (e.isComposing) return

      // Open with Cmd+K (macOS) or Ctrl+K (Windows/Linux)
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Focus management: save focus and restore focus on open/close
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement
      // Wait for Radix Dialog animation frame to focus the input
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      if (previouslyFocusedElementRef.current) {
        // Restore focus to previously focused element
        previouslyFocusedElementRef.current.focus()
        previouslyFocusedElementRef.current = null
      }
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Filter and sort items based on relevance score (Exact match -> Starts with -> Contains)
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MODULES_LIST

    return MODULES_LIST
      .map((item) => {
        const l = item.label.toLowerCase()
        const d = item.description.toLowerCase()
        let score = -1

        if (l === q) {
          score = 4 // Exact match
        } else if (l.startsWith(q)) {
          score = 3 // Starts with
        } else if (l.includes(q)) {
          score = 2 // Contains label
        } else if (d.includes(q)) {
          score = 1 // Contains description
        }

        return { item, score }
      })
      .filter((el) => el.score > 0)
      .sort((a, b) => b.score - a.score) // Sort by descending relevance score
      .map((el) => el.item)
  }, [query])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Handle keyboard navigation inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
        break
      case 'Enter':
        e.preventDefault()
        handleSelect(filteredItems[selectedIndex])
        break
    }
  }

  // Scroll active item into view when navigating via keyboard
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({
          block: 'nearest',
        })
      }
    }
  }, [selectedIndex])

  const handleSelect = (item: CommandItem) => {
    navigate(item.to)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="p-0 border border-sidebar-border bg-sidebar-bg/95 backdrop-blur-xl shadow-xl max-w-2xl overflow-hidden rounded-[var(--radius-card)] text-left"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-sidebar-border select-none">
          <Search size={20} className="text-sidebar-muted-fg shrink-0 stroke-[2]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules or actions... (Esc to close)"
            className="w-full bg-transparent border-none text-sidebar-active-fg placeholder-sidebar-muted-fg text-sm font-semibold outline-none focus:ring-0 focus:outline-none"
          />
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] bg-sidebar-border text-sidebar-muted-fg px-1.5 py-0.5 rounded border border-sidebar-border/30 font-mono font-bold select-none uppercase">
              Esc
            </span>
          </div>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="max-h-[350px] overflow-y-auto p-2 space-y-0.5"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sidebar-muted-fg text-xs font-semibold select-none">
              No modules match your query. Try typing something else.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon
              const isSelected = index === selectedIndex

              return (
                <div
                  key={item.to}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3 py-2.5 rounded-[var(--radius-button)] cursor-pointer transition-colors duration-150 relative select-none',
                    isSelected 
                      ? 'bg-brand/10 text-brand' 
                      : 'text-sidebar-muted-fg hover:text-sidebar-active-fg hover:bg-sidebar-hover/40'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 z-10">
                    <Icon 
                      size={20} 
                      className={cn(
                        'shrink-0 stroke-[2]',
                        isSelected ? 'text-brand' : 'text-sidebar-muted-fg group-hover:text-sidebar-active-fg'
                      )} 
                    />
                    <div className="text-left min-w-0">
                      <p className={cn(
                        'text-xs font-bold leading-none',
                        isSelected ? 'text-brand font-extrabold' : 'text-sidebar-active-fg'
                      )}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-sidebar-muted-fg truncate mt-1 max-w-[480px]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand shrink-0 z-10 animate-fade-in">
                      <span>Go</span>
                      <CornerDownLeft size={10} className="stroke-[2.5]" />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Shortcut Legend Footer */}
        <div className="px-4 py-2 bg-sidebar-bg/60 border-t border-sidebar-border flex items-center justify-between text-[9px] font-bold text-sidebar-muted-fg uppercase tracking-wider select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="bg-sidebar-border px-1 py-0.5 rounded border border-sidebar-border/30 font-mono">↑↓</span> Navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-sidebar-border px-1 py-0.5 rounded border border-sidebar-border/30 font-mono">Enter</span> Select
            </span>
          </div>
          <div>
            Scorelia Search
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
