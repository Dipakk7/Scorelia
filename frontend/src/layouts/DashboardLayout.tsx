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
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080e] text-slate-100 font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Ambient Glow Accents */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      <CommandPalette />
      {/* Desktop Collapsible Sidebar */}
      <Sidebar pinned={pinned} setPinned={setPinned} />

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#0b0c14] border-r border-white/10 p-5 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between shadow-2xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 focus:outline-none">
              <Logo iconOnly={false} className="h-7 w-auto text-purple-400" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer focus:outline-none"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 mt-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group',
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/40'
                        : 'hover:bg-white/5 text-slate-400 hover:text-white'
                    )
                  }
                >
                  <Icon size={19} className="shrink-0 transition-colors stroke-[1.8]" />
                  <span className="tracking-tight">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/10 pt-4 mt-auto">
          Logged in as: <span className="text-slate-200 font-mono block truncate">{user?.email}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Navbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-[#07080e] focus:outline-none custom-scrollbar">
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

