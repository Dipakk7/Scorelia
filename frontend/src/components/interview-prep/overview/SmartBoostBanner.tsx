import React from 'react'
import { Sparkles, MessageSquare, FileCheck, HelpCircle } from 'lucide-react'

export function SmartBoostBanner() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Real-time Suggestions',
      subtitle: 'Smart answers on the go',
    },
    {
      icon: FileCheck,
      title: 'Answer Improvement',
      subtitle: 'Get AI feedback instantly',
    },
    {
      icon: HelpCircle,
      title: 'Follow-up Questions',
      subtitle: 'Be ready for anything',
    },
  ]

  return (
    <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg shadow-purple-950/20">
      {/* Left Title & Description */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400 fill-purple-400/20" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Need a smart boost?
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Use Interview Copilot for real-time guidance during mock interviews.
        </p>
      </div>

      {/* Right 3 Feature Bullets */}
      <div className="flex flex-wrap items-center gap-3">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 hover:bg-white/10 transition-all cursor-default"
            >
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight">
                  {feature.title}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block leading-tight">
                  {feature.subtitle}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default SmartBoostBanner
