import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  LayoutDashboard,
  FileText,
  Scan,
  MessageSquareCode,
  Map,
  Settings,
  Sparkles,
  MailOpen,
  Database,
  Bot,
  BarChart3,
} from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/common/Logo'


// Custom Github SVG Icon to bypass missing brand icons in this version of lucide-react
const Github = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 20, ...rest } = props
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

interface SidebarProps {
  pinned: boolean
  setPinned: (pinned: boolean) => void
  className?: string
}

export function Sidebar({ pinned, setPinned, className }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<{ label: string; top: number; left: number } | null>(null)

  const isHoverExpanded = isHovered || isFocused
  const expanded = pinned || isHoverExpanded

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    if (expanded) return
    const rect = e.currentTarget.getBoundingClientRect()
    const sidebar = e.currentTarget.closest('aside')
    const sidebarRect = sidebar?.getBoundingClientRect()
    if (sidebarRect) {
      setHoveredItem({
        label,
        top: rect.top - sidebarRect.top + rect.height / 2,
        left: sidebarRect.width + 8,
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/resumes', label: 'Resume Builder', icon: FileText },
    { to: '/resume-intelligence', label: 'AI Resume Intelligence', icon: Sparkles },
    { to: '/ats', label: 'ATS Analysis', icon: Scan },
    { to: '/cover-letter', label: 'AI Cover Letter', icon: MailOpen },
    { to: '/interview', label: 'AI Interview Prep', icon: MessageSquareCode },
    { to: '/roadmap', label: 'Career Roadmap', icon: Map },
    { to: '/rag-workspace', label: 'RAG Workspace', icon: Database },
    { to: '/agents', label: 'Agent Console', icon: Bot },
    { to: '/analytics', label: 'Analytics Center', icon: BarChart3 },
    { to: '/github-intelligence', label: 'GitHub Intelligence', icon: Github },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'hidden md:block h-screen bg-[var(--sidebar-background)] transition-[width] duration-200 ease-in-out relative z-30',
        pinned ? 'w-[260px]' : 'w-[72px]',
        className
      )}
    >
      <div
        onMouseEnter={() => { if (!pinned) setIsHovered(true) }}
        onMouseLeave={() => {
          setIsHovered(false)
          setHoveredItem(null)
        }}
        onFocus={() => { if (!pinned) setIsFocused(true) }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsFocused(false)
          }
        }}
        className={cn(
          'flex flex-col h-full bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] transition-[width] duration-200 ease-in-out absolute top-0 left-0 z-30',
          expanded ? 'w-[260px]' : 'w-[72px]',
          (!pinned && expanded) && 'shadow-xl'
        )}
      >
        <div className="h-16 flex items-center px-3 border-b border-[var(--sidebar-border)]">
          <button
            onClick={() => setPinned(!pinned)}
            aria-expanded={expanded}
            className={cn(
              "flex items-center cursor-pointer w-full transition-all duration-200 rounded-[14px] hover:bg-[var(--sidebar-border)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 focus:outline-none",
              expanded ? "justify-start p-2 gap-3" : "justify-center p-2"
            )}
            aria-label={pinned ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Logo iconOnly={!expanded} className={cn("text-[var(--sidebar-active-foreground)] transition-all duration-200", expanded ? "h-7 w-auto" : "h-8 w-8")} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                onMouseLeave={handleMouseLeave}
                className={({ isActive }) =>
                  cn(
                    'flex items-center py-2.5 rounded-[14px] text-sm font-semibold font-sans transition-all duration-200 ease-in-out cursor-pointer group relative px-3',
                    expanded ? 'justify-start' : 'justify-center',
                    !isActive && 'text-[var(--sidebar-muted-foreground)] hover:bg-[var(--sidebar-border)]/45 hover:text-[var(--sidebar-active-foreground)]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarLink"
                        className="absolute inset-0 bg-[var(--primary)]/10 rounded-[14px] border-l-2 border-[var(--primary)] shadow-sm"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <Icon size={20} className={cn("flex-shrink-0 transition-colors duration-200 relative z-10", isActive ? "text-[var(--primary)]" : "text-[var(--sidebar-muted-foreground)] group-hover:text-[var(--sidebar-active-foreground)]")} />
                    <span
                      className={cn(
                        "whitespace-nowrap tracking-wide transition-all duration-200 ease-in-out overflow-hidden relative z-10",
                        expanded ? "max-w-[200px] opacity-100 ml-3.5" : "max-w-0 opacity-0 ml-0",
                        isActive ? "text-[var(--primary)] font-extrabold" : "text-[var(--sidebar-muted-foreground)] group-hover:text-[var(--sidebar-active-foreground)]"
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Tooltip */}
        {!expanded && hoveredItem && (
          <div
            style={{ top: hoveredItem.top, left: hoveredItem.left }}
            className="absolute -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="relative bg-[var(--sidebar-background)] text-[var(--sidebar-active-foreground)] text-xs font-semibold px-3 py-1.5 rounded-md border border-[var(--sidebar-border)] shadow-xl whitespace-nowrap animate-fade-in flex items-center">
              <div className="absolute -left-1 w-2 h-2 rotate-45 bg-[var(--sidebar-background)] border-l border-b border-[var(--sidebar-border)]" />
              <span className="relative z-10">{hoveredItem.label}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
