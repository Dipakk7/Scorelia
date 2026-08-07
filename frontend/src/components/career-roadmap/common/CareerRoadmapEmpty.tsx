import React from 'react'
import { FolderPlus, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface CareerRoadmapEmptyProps {
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
  className?: string
}

export function CareerRoadmapEmpty({
  title = 'No Career Roadmap Found',
  description = 'You have not set up a career roadmap goal yet. Initialize your target AI role to generate personalized milestones.',
  actionText = 'Create Career Goal',
  onAction,
  className,
}: CareerRoadmapEmptyProps) {
  return (
    <Card className={cn('p-8 sm:p-10 bg-[#121426]/50 border border-dashed border-white/15 rounded-2xl text-center space-y-4 shadow-sm max-w-xl mx-auto my-4', className)}>
      <div className="mx-auto h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-sm">
        <FolderPlus className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto text-center">
        <h3 className="text-lg font-bold text-white tracking-tight m-0">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-medium m-0 leading-relaxed">
          {description}
        </p>
      </div>

      {onAction && (
        <div className="pt-2 flex justify-center">
          <Button
            variant="primary"
            size="sm"
            onClick={onAction}
            className="flex items-center gap-2 text-xs font-bold py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer border-none shadow-sm min-h-[44px]"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>{actionText}</span>
          </Button>
        </div>
      )}
    </Card>
  )
}
export default CareerRoadmapEmpty
