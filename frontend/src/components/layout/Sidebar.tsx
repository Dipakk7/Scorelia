import { NavLink, Link } from 'react-router-dom'
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
  ArrowRight,
  ChevronRight,
  User as UserIcon,
} from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/common/Logo'
import { useAuth } from '@/providers/AuthProvider'
import { Avatar } from '@/components/ui/Avatar'

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
  const { user } = useAuth()

  const isHoverExpanded = isHovered || isFocused
  const expanded = pinned || isHoverExpanded

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User'
  const userRole = (user as any)?.headline || (user as any)?.role || 'AI/ML Engineer'

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
    { to: '/resume-intelligence', label: 'Resume Intelligence', icon: Sparkles },
    { to: '/ats', label: 'ATS Analysis', icon: Scan },
    { to: '/cover-letter', label: 'Cover Letter', icon: MailOpen },
    { to: '/interview', label: 'Interview Prep', icon: MessageSquareCode },
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
        'hidden md:block h-screen bg-[#0b0c14] border-r border-white/10 transition-[width] duration-200 ease-in-out relative z-30 select-none',
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
          'flex flex-col h-full bg-[#0b0c14] text-slate-200 transition-[width] duration-200 ease-in-out absolute top-0 left-0 z-30',
          expanded ? 'w-[260px]' : 'w-[72px]',
          (!pinned && expanded) && 'shadow-2xl shadow-purple-950/50'
        )}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <button
            onClick={() => setPinned(!pinned)}
            aria-expanded={expanded}
            className={cn(
              "flex items-center cursor-pointer w-full transition-all duration-200 rounded-xl hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:outline-none",
              expanded ? "justify-between p-2" : "justify-center p-2"
            )}
            aria-label={pinned ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Logo iconOnly={!expanded} className={cn("text-purple-400 shrink-0 transition-all duration-200", expanded ? "h-7 w-auto" : "h-7 w-7")} />
              {expanded && (
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono leading-none">AI Career Intelligence</span>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
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
                    'flex items-center py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out cursor-pointer group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c14]',
                    expanded ? 'justify-between' : 'justify-center',
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-lg shadow-purple-900/30 font-semibold' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3.5 min-w-0" aria-current={isActive ? 'page' : undefined}>
                      <Icon size={19} className={cn("shrink-0 transition-colors duration-200 stroke-[1.8]", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                      {expanded && (
                        <span className="whitespace-nowrap tracking-tight truncate">
                          {item.label}
                        </span>
                      )}
                    </div>
                    {expanded && isActive && (
                      <ArrowRight size={15} className="shrink-0 text-white/90 stroke-[2.5]" />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* AI Mode Operational Box (Visible when expanded) */}
        {expanded && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                AI Mode
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>All agents operational</span>
              <Sparkles size={13} className="text-purple-400 animate-pulse shrink-0" />
            </p>
          </div>
        )}

        {/* User Profile Footer Box */}
        <div className="p-3 border-t border-white/5 bg-[#08090f]">
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group",
              expanded ? "justify-between" : "justify-center"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                src={user?.profile_picture}
                fallbackText={displayName}
                className="h-9 w-9 shrink-0 ring-2 ring-purple-500/30 group-hover:ring-purple-400 transition-all"
              />
              {expanded && (
                <div className="flex flex-col text-left truncate min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate group-hover:text-white leading-snug">
                    {displayName}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 truncate leading-snug">
                    {userRole}
                  </span>
                </div>
              )}
            </div>
            {expanded && (
              <ChevronRight size={16} className="text-slate-400 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5" />
            )}
          </Link>
        </div>

        {/* Tooltip for collapsed view */}
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
              <div className="relative bg-[#121320] text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 shadow-xl whitespace-nowrap flex items-center">
                <div className="absolute -left-1 w-2 h-2 rotate-45 bg-[#121320] border-l border-b border-white/10" />
                <span className="relative z-10">{hoveredItem.label}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}

