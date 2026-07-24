import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AIInsightBannerProps {
  insightText?: string
  buttonText?: string
  onApplySuggestions?: () => void
}

export const AIInsightBanner: React.FC<AIInsightBannerProps> = ({
  insightText = 'Adding 2–3 more quantified achievements and 15–20 relevant keywords can increase your ATS score by up to 15%.',
  buttonText = 'Apply All Suggestions',
  onApplySuggestions,
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900/80 border border-purple-800/40 p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Background Subtle Sparkle Glow */}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Left Icon & Text Content */}
      <div className="flex items-center gap-3 md:gap-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 shrink-0 shadow-inner">
          <Sparkles className="w-5 h-5 text-purple-300 fill-purple-300/20" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-0.5">
            AI Insight
          </span>
          <p className="text-xs md:text-sm text-slate-200 font-medium leading-snug">
            {insightText}
          </p>
        </div>
      </div>

      {/* Right Action Button */}
      <div className="shrink-0 w-full md:w-auto relative z-10">
        <Button
          onClick={onApplySuggestions}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs md:text-sm font-semibold rounded-xl px-5 py-2.5 gap-2 shadow-md shadow-purple-950/40 transition-all cursor-pointer border-0"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default AIInsightBanner
