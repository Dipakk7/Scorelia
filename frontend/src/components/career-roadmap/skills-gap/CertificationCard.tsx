import React from 'react'
import { Award, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { certificationRecommendationsMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { CertificationItem } from '@/types/careerRoadmap'

export interface CertificationCardProps {
  certifications?: CertificationItem[]
  onEnroll?: (certId: string) => void
  className?: string
}

export function CertificationCard({
  certifications = certificationRecommendationsMockData,
  onEnroll,
  className,
}: CertificationCardProps) {
  const getPriorityBadgeStyle = (priority: CertificationItem['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30'
      case 'Recommended':
      default:
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
    }
  }

  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Award className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Recommended Industry Certifications</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Boost your resume ATS score and validate engineering depth
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          4 Recommended
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="p-4 rounded-xl bg-[#0b0c14] border border-white/10 space-y-3 flex flex-col justify-between text-left hover:border-purple-500/30 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border', getPriorityBadgeStyle(cert.priority))}>
                  {cert.priority}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase font-mono">
                  {cert.provider}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white tracking-tight leading-snug m-0">
                {cert.title}
              </h4>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
                  <span>Est: {cert.estimatedDuration}</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                  <span>{cert.difficulty}</span>
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onEnroll?.(cert.id)}
                className="w-full justify-center text-xs font-semibold py-1.5 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500/50"
                aria-label={`Action for ${cert.title}`}
              >
                <span>{cert.actionText}</span>
                <ArrowRight className="h-3 w-3 ml-1 text-slate-400" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
export default CertificationCard
