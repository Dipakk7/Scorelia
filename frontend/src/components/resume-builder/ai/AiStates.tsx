import React from 'react'
import { Bot, Sparkles, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react'

export const AiEmptyState: React.FC = () => {
  return (
    <div className="p-6 text-center space-y-3 bg-slate-900/40 border border-dashed border-white/15 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
        <MessageSquare size={18} />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-white m-0">No Messages Yet</h4>
        <p className="text-[11px] text-slate-400 m-0">
          Ask Scorelia AI to optimize your summary, rewrite experience, or find missing ATS keywords.
        </p>
      </div>
    </div>
  )
}

export const AiThinkingState: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl text-xs text-purple-200">
      <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
      <span className="font-semibold font-mono animate-pulse">Scorelia AI is analyzing your resume...</span>
    </div>
  )
}

export const AiStreamingCursor: React.FC = () => {
  return <span className="inline-block w-1.5 h-3.5 bg-purple-400 ml-0.5 animate-pulse shrink-0" />
}

export const AiErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Failed to connect to AI assistant. Please try again.',
  onRetry,
}) => {
  return (
    <div className="p-3 bg-pink-950/30 border border-pink-500/30 rounded-xl flex items-center justify-between text-xs text-pink-200 gap-2">
      <div className="flex items-center gap-2">
        <AlertTriangle size={15} className="text-pink-400 shrink-0" />
        <span className="text-[11px]">{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-[10px] font-bold text-pink-300 hover:underline cursor-pointer shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export const AiSuccessBadge: React.FC<{ label?: string }> = ({ label = 'AI Optimization Applied' }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
      <CheckCircle2 size={12} className="text-emerald-400" />
      <span>{label}</span>
    </div>
  )
}
