import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScoreliaReducedMotion, getTooltipVariants } from '@/lib/motion'

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
import { Github } from '@/components/ui/GithubIcon'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/common/Logo'

interface SidebarProps {
  pinned: boolean
  setPinned: (pinned: boolean) => void
  className?: string
}

export function Sidebar({ pinned, setPinned, className }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<{ label: string; top: number; left: number } | null>(null)
  const shouldReduceMotion = useScoreliaReducedMotion()

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
        'hidden md:block h-screen bg-sidebar-bg/80 backdrop-blur-md transition-[width] duration-200 ease-in-out relative z-30',
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
          'flex flex-col h-full bg-sidebar-bg/80 backdrop-blur-md text-sidebar-fg border-r border-white/5 transition-[width] duration-200 ease-in-out absolute top-0 left-0 z-30',
          expanded ? 'w-[260px]' : 'w-[72px]',
          (!pinned && expanded) && 'shadow-md'
        )}
      >
        <div className="h-16 flex items-center px-3 border-b border-white/5">
          <button
            onClick={() => setPinned(!pinned)}
            aria-expanded={expanded}
            className={cn(
              "flex items-center cursor-pointer w-full transition-all duration-200 rounded-[var(--radius-button)] hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus-ring/50 focus:outline-none",
              expanded ? "justify-start p-2 gap-3" : "justify-center p-2"
            )}
            aria-label={pinned ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Logo iconOnly={!expanded} className={cn("text-sidebar-active-fg transition-all duration-200", expanded ? "h-7 w-auto" : "h-8 w-8")} />
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
                    'flex items-center py-2.5 rounded-r-[var(--radius-button)] text-sm font-semibold font-sans transition-all duration-200 ease-in-out cursor-pointer group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus-ring/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-sidebar-bg',
                    expanded ? 'justify-start' : 'justify-center',
                    isActive 
                      ? 'pl-[9px] pr-3 text-white' 
                      : 'text-sidebar-muted-fg hover:bg-white/5 hover:text-white px-3'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute inset-0 bg-white/5 border-l-[3px] border-[hsl(var(--primary))] rounded-r-[var(--radius-button)] shadow-[0_0_12px_rgba(83,112,154,0.15)] dark:shadow-[0_0_12px_rgba(127,167,224,0.25)]"
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
                      />
                    )}
                    <Icon size={20} className={cn("flex-shrink-0 transition-colors duration-200 relative z-10 stroke-[1.75]", isActive ? "text-[hsl(var(--primary))]" : "text-sidebar-muted-fg group-hover:text-white")} />
                    <motion.span
                      initial={false}
                      animate={{
                        width: expanded ? 'auto' : 0,
                        opacity: expanded ? 1 : 0,
                        marginLeft: expanded ? 14 : 0,
                      }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
                      className={cn(
                        "whitespace-nowrap tracking-wide overflow-hidden relative z-10 block",
                        isActive ? "text-white font-bold" : "text-sidebar-muted-fg group-hover:text-white"
                      )}
                    >
                      {item.label}
                    </motion.span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Tooltip */}
        <AnimatePresence>
          {!expanded && hoveredItem && (
            <motion.div
              style={{ top: hoveredItem.top, left: hoveredItem.left }}
              variants={getTooltipVariants(shouldReduceMotion)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="relative bg-sidebar-bg text-sidebar-active-fg text-xs font-semibold px-3 py-1.5 rounded-md border border-sidebar-border shadow-md whitespace-nowrap flex items-center">
                <div className="absolute -left-1 w-2 h-2 rotate-45 bg-sidebar-bg border-l border-b border-sidebar-border" />
                <span className="relative z-10">{hoveredItem.label}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
