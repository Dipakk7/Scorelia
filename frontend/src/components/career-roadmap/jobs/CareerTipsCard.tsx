import React, { memo } from 'react'
import { Lightbulb, DollarSign, FileCheck, Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface CareerTipsCardProps {
  className?: string
}

export const CareerTipsCard = memo(function CareerTipsCard({ className }: CareerTipsCardProps) {
  const tips = [
    {
      title: 'Salary Negotiation & Compensation',
      description: 'AI/ML roles in top tech markets command equity components. Benchmark target base salary with verified levels.fyi data.',
      icon: <DollarSign className="h-4 w-4 text-emerald-400" aria-hidden="true" />,
      color: 'text-emerald-400',
    },
    {
      title: 'ATS Resume Keyword Matching',
      description: 'Ensure PyTorch, FastAPI, and Transformers microservice projects are explicitly formatted under relevant work experience.',
      icon: <FileCheck className="h-4 w-4 text-purple-400" aria-hidden="true" />,
      color: 'text-purple-300',
    },
    {
      title: 'Engineering Referral Outreach',
      description: 'Reaching out to engineering managers with a 2-sentence summary of your RAG vector search project boosts response rates by 3x.',
      icon: <Users className="h-4 w-4 text-cyan-400" aria-hidden="true" />,
      color: 'text-cyan-300',
    },
  ]

  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left hover:border-purple-500/30 transition-all', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>Strategic Career &amp; Application Tips</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Expert strategies for technical interviews, ATS scoring, and offer negotiations
          </p>
        </div>
        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
          Career Guide
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-2 text-left flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                  {tip.icon}
                </div>
                <h4 className="text-xs font-bold text-white tracking-tight m-0 leading-tight">
                  {tip.title}
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed m-0">
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
})
export default CareerTipsCard
