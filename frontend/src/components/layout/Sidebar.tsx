import { NavLink } from 'react-router-dom'

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
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  className?: string
}

export function Sidebar({ collapsed, setCollapsed, className }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<{ label: string; top: number; left: number } | null>(null)

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    if (!collapsed) return
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
        'hidden md:flex flex-col h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-[width] duration-300 ease-in-out relative z-30',
        collapsed ? 'w-[72px]' : 'w-[260px]',
        className
      )}
    >
      <div className="h-16 flex items-center px-3 border-b border-slate-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          className={cn(
            "flex items-center cursor-pointer w-full transition-all duration-300 rounded-lg hover:bg-slate-800/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 focus:outline-none",
            collapsed ? "justify-center p-2" : "justify-start p-2 gap-3"
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Logo iconOnly={collapsed} className={cn("text-slate-100 transition-all duration-300", collapsed ? "h-8 w-8" : "h-7 w-auto")} />
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
                  'flex items-center py-2.5 rounded-lg text-sm font-semibold font-sans transition-all duration-300 cursor-pointer group relative px-3',
                  collapsed ? 'justify-center' : 'justify-start',
                  isActive
                    ? 'bg-brand-500/12 text-brand-400 shadow-inner'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-500 rounded-l-lg" />
                  )}
                  <Icon size={18} className="flex-shrink-0 transition-colors" />
                  <span
                    className={cn(
                      "whitespace-nowrap tracking-wide transition-all duration-300 ease-in-out overflow-hidden",
                      collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3.5"
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
      {collapsed && hoveredItem && (
        <div
          style={{ top: hoveredItem.top, left: hoveredItem.left }}
          className="absolute -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="relative bg-slate-950 text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-800 shadow-xl whitespace-nowrap animate-fade-in flex items-center">
            <div className="absolute -left-1 w-2 h-2 rotate-45 bg-slate-950 border-l border-b border-slate-800" />
            <span className="relative z-10">{hoveredItem.label}</span>
          </div>
        </div>
      )}
    </aside>
  )
}
