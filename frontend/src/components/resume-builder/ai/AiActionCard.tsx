import React, { useState } from 'react'
import { Sparkles, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AiActionItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  estimatedBoost: string
  category: string
}

interface AiActionCardProps {
  action: AiActionItem
  onExecute?: (actionId: string) => void
}

export const AiActionCard: React.FC<AiActionCardProps> = ({ action, onExecute }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const Icon = action.icon

  const handleTrigger = () => {
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      onExecute?.(action.id)
      setTimeout(() => setStatus('idle'), 3000)
    }, 1200)
  }

  return (
    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-purple-500/40 transition-all space-y-2.5 text-left group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 group-hover:scale-105 transition-transform">
            <Icon size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-display m-0">
              {action.title}
            </h4>
            <span className="text-[9px] font-mono text-slate-400 uppercase">
              {action.category}
            </span>
          </div>
        </div>

        {/* Estimated Score Boost Badge */}
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
          {action.estimatedBoost}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-snug m-0 font-sans">
        {action.description}
      </p>

      {/* Action Button & Status Feedback */}
      <div className="pt-1 flex justify-end">
        {status === 'success' ? (
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
            <CheckCircle2 size={13} />
            <span>Optimization Applied</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleTrigger}
            disabled={status === 'loading'}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border',
              status === 'loading'
                ? 'bg-purple-950 text-purple-300 border-purple-500/30'
                : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border-purple-500/40'
            )}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={13} className="animate-spin text-purple-400" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Run Action</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
