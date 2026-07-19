import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScoreliaReducedMotion, getPageVariants } from '@/lib/motion'

import {
  LayoutDashboard,
  FileText,
  Scan,
  MessageSquareCode,
  Map,
  Settings,
  X,
  Sparkles,
  MailOpen,
  Database,
  Bot,
  BarChart3,
} from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/common/Logo'
import { SIDEBAR_PINNED_KEY, SIDEBAR_COLLAPSED_KEY } from '@/lib/constants'
import { BackgroundMesh } from '@/components/ui/BackgroundMesh'

export default function DashboardLayout() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [pinned, setPinnedState] = useState(() => {
    // Check if new key exists
    const newSaved = localStorage.getItem(SIDEBAR_PINNED_KEY)
    if (newSaved !== null) {
      return JSON.parse(newSaved) === true
    }

    // Migrate from old collapsed key
    const oldSaved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    if (oldSaved !== null) {
      const oldCollapsed = JSON.parse(oldSaved) === true
      const migratedPinned = !oldCollapsed
      localStorage.setItem(SIDEBAR_PINNED_KEY, JSON.stringify(migratedPinned))
      localStorage.removeItem(SIDEBAR_COLLAPSED_KEY)
      return migratedPinned
    }

    return true
  })

  const setPinned = (val: boolean) => {
    setPinnedState(val)
    localStorage.setItem(SIDEBAR_PINNED_KEY, JSON.stringify(val))
  }
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  // Close mobile navigation drawer automatically on route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const mobileNavItems = [
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
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans relative">
      <BackgroundMesh />
      <CommandPalette />
      {/* Desktop Collapsible Sidebar */}
      <Sidebar pinned={pinned} setPinned={setPinned} />

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-55 w-64 bg-sidebar-bg text-sidebar-fg border-r border-sidebar-border p-5 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between shadow-md',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 focus:outline-none">
              <Logo iconOnly={false} className="h-7 w-auto text-sidebar-active-fg" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-lg text-sidebar-muted-fg hover:text-sidebar-active-fg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus-ring"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 mt-4">
            {mobileNavItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 py-2.5 rounded-r-[var(--radius-button)] text-sm font-semibold transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus-ring/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-sidebar-bg',
                      isActive
                        ? 'bg-brand/10 border-l-[3px] border-brand text-brand pl-[9px] pr-3 shadow-[0_0_12px_rgba(83,112,154,0.15)] dark:shadow-[0_0_12px_rgba(127,167,224,0.25)]'
                        : 'hover:bg-sidebar-hover hover:text-sidebar-active-fg text-sidebar-muted-fg px-3'
                    )
                  }
                >
                  <Icon size={20} className="flex-shrink-0 transition-colors stroke-[2]" />
                  <span className="tracking-wide">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="text-xs text-sidebar-muted-fg font-display border-t border-sidebar-border pt-4 mt-auto">
          Logged in as: <span className="text-sidebar-active-fg font-sans block truncate">{user?.email}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background focus:outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={getPageVariants(shouldReduceMotion)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
