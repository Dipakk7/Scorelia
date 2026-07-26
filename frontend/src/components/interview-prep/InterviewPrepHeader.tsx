import React from 'react'
import { Sparkles, Download, Video, ChevronDown, Search, Bell, Sun, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/providers/AuthProvider'

export interface InterviewPrepHeaderProps {
  onDownloadReport?: () => void
  onStartMockInterview?: () => void
}

export function InterviewPrepHeader({
  onDownloadReport,
  onStartMockInterview,
}: InterviewPrepHeaderProps) {
  const { user } = useAuth()
  const displayName = user?.full_name || 'Dipak Khandagale'

  return (
    <header className="space-y-4 text-left">
      {/* Top Bar: Breadcrumb + Utility Controls (Search, Notifications, Theme, Profile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Interview Prep</span>
          <span>&gt;</span>
          <span className="text-white font-semibold">Overview</span>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-48 sm:w-64 bg-[#121320] border border-white/10 rounded-xl pl-9 pr-10 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
              readOnly
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
              ⌘K
            </div>
          </div>

          {/* Notifications Bell */}
          <button className="relative p-2 rounded-xl bg-[#121320] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-[#0b0c14]" />
          </button>

          {/* Theme Toggle */}
          <button className="p-2 rounded-xl bg-[#121320] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer">
            <Sun className="h-4 w-4" />
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-white/10">
            <Avatar
              src={user?.profile_picture}
              fallbackText={displayName}
              className="h-8 w-8 ring-2 ring-purple-500/30 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Title & Action Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Interview Prep
              <Sparkles className="h-6 w-6 text-purple-400 fill-purple-400/20" />
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Prepare smarter, practice better, and ace your next interview.
          </p>
        </div>

        {/* Right Status Badge & Primary/Secondary CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Last practiced: 2 days ago</span>
          </div>

          {/* Download Report Button */}
          <Button
            variant="outline"
            onClick={onDownloadReport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 border-white/15 bg-[#121320] hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-300" />
            <span>Download Report</span>
          </Button>

          {/* Start Mock Interview Dropdown CTA */}
          <div className="relative inline-flex">
            <Button
              onClick={onStartMockInterview}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 rounded-xl transition-all cursor-pointer border-none"
            >
              <Video className="h-4 w-4" />
              <span>Start Mock Interview</span>
              <ChevronDown className="h-3.5 w-3.5 text-white/80 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
export default InterviewPrepHeader
