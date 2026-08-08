import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { cn } from '@/lib/utils'

export interface EmptyGitHubStateProps {
  onConnect?: () => void
  onSync?: () => void
  className?: string
}

export const EmptyGitHubState: React.FC<EmptyGitHubStateProps> = ({ onConnect, onSync, className }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[440px] p-8 text-center rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 space-y-6 select-none font-sans',
        className
      )}
    >
      <div className="relative">
        <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Github size={44} />
        </div>
        <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-purple-600 text-white shadow-md shadow-purple-950/40">
          <Sparkles size={14} />
        </div>
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight m-0">
          Connect Your GitHub Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed m-0 font-sans">
          Unlock AI-powered developer insights, contribution analytics, code quality metrics, and career recommendations by connecting your GitHub profile.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-sans">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" /> Read-only access
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" /> No code storage
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" /> Instant sync
        </span>
      </div>

      <button
        type="button"
        onClick={onConnect}
        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/30 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Github size={18} />
        <span>Connect GitHub Account</span>
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

export default EmptyGitHubState
