import { NavLink, Link } from 'react-router-dom'

import {
  LayoutDashboard,
  FileText,
  Scan,
  MessageSquareCode,
  Map,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MailOpen,
  Database,
  Bot,
  BarChart3,
} from 'lucide-react'
import React from 'react'
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
        'hidden md:flex flex-col h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 relative z-30',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      <div className="h-16 flex items-center px-5 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-3 w-full focus:outline-none">
          <Logo iconOnly={collapsed} className={cn("text-slate-100 transition-all duration-150", collapsed ? "h-8 w-8 mx-auto" : "h-7 w-auto")} />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 py-2.5 rounded-lg text-sm font-semibold font-sans transition-all duration-150 cursor-pointer group',
                  isActive
                    ? 'bg-brand-500/12 text-brand-400 border-l-2 border-brand-500 pl-2.5 pr-3 shadow-inner'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 px-3'
                )
              }
            >
              <Icon size={18} className="flex-shrink-0 transition-colors" />
              {!collapsed && <span className="whitespace-nowrap tracking-wide">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse Toggle Button */}
      <div className="p-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-850 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer focus:outline-none"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  )
}
