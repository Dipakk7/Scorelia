import React, { useState } from 'react'
import { Layers, Search, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { mockAtsCompatibility, type ATSCompatibilityItem } from '@/lib/ats-mock-data'
import { cn } from '@/lib/utils'

export const ATSCompatibilityCard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSystem, setSelectedSystem] = useState<ATSCompatibilityItem | null>(null)

  const filteredSystems = mockAtsCompatibility.filter((sys) =>
    sys.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 sm:p-5 shadow-lg space-y-3.5 h-full flex flex-col justify-between">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            ATS System Compatibility Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Compatibility evaluation against 6 major enterprise Applicant Tracking Systems.
          </p>
        </div>

        {/* Quick Filter Search Input */}
        <div className="relative w-full sm:w-48">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ATS system..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSystems.map((sys) => {
          const isSelected = selectedSystem?.id === sys.id
          return (
            <div
              key={sys.id}
              onClick={() => setSelectedSystem(isSelected ? null : sys)}
              className={cn(
                'p-4 rounded-xl bg-slate-950/60 border transition-all duration-200 cursor-pointer space-y-3',
                isSelected
                  ? 'border-purple-500/60 bg-purple-950/20 shadow-md ring-1 ring-purple-500/30'
                  : 'border-slate-800/80 hover:border-purple-500/30 hover:bg-slate-950/80'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs font-mono',
                      sys.logoBg
                    )}
                  >
                    {sys.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200">{sys.name}</h4>
                    <span className="text-[10px] text-slate-400">Enterprise ATS</span>
                  </div>
                </div>

                <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {sys.score}%
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Compatibility</span>
                  <span className="text-slate-300 font-semibold">{sys.status}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${sys.score}%` }}
                  />
                </div>
              </div>

              {/* Matched Feature Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {sys.matchedFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected System Breakdown Drawer */}
      {selectedSystem && (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-bold text-purple-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {selectedSystem.name} Optimization Insights
            </span>
            <button
              onClick={() => setSelectedSystem(null)}
              className="text-slate-400 hover:text-white text-[11px]"
            >
              Close
            </button>
          </div>
          <p className="text-slate-300 text-xs">
            Your resume score of <strong className="text-emerald-400">{selectedSystem.score}%</strong> for {selectedSystem.name} indicates strong layout compatibility. Headings, font hierarchy, and token indexing meet all parser requirements.
          </p>
        </div>
      )}
    </div>
  )
}
