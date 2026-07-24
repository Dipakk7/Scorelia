import React from 'react'
import {
  FileText,
  Briefcase,
  Target,
  Sparkles,
  Code,
  FolderGit2,
  GraduationCap,
  Award,
  Zap,
} from 'lucide-react'
import { AiActionCard } from './AiActionCard'
import type { AiActionItem } from './AiActionCard'

export const AI_ACTIONS_DATA: AiActionItem[] = [
  {
    id: 'act-summary',
    title: 'Improve Summary',
    description: 'Enhance your executive summary with punchy action verbs and target role keywords.',
    icon: FileText,
    estimatedBoost: '+12 ATS',
    category: 'Summary',
  },
  {
    id: 'act-experience',
    title: 'Rewrite Experience',
    description: 'Transform work history descriptions into high-impact accomplishment bullets.',
    icon: Briefcase,
    estimatedBoost: '+15 ATS',
    category: 'Experience',
  },
  {
    id: 'act-ats',
    title: 'Optimize ATS Keywords',
    description: 'Identify and inject missing industry keywords matching your target role.',
    icon: Target,
    estimatedBoost: '+18 ATS',
    category: 'ATS Strategy',
  },
  {
    id: 'act-achievements',
    title: 'Quantify Achievements',
    description: 'Add hard metrics, percentages, and performance results to your accomplishments.',
    icon: Sparkles,
    estimatedBoost: '+10 ATS',
    category: 'Achievements',
  },
  {
    id: 'act-skills',
    title: 'Improve Skills Section',
    description: 'Group skills logically into languages, frameworks, and developer tools.',
    icon: Code,
    estimatedBoost: '+8 ATS',
    category: 'Skills',
  },
  {
    id: 'act-projects',
    title: 'Improve Projects',
    description: 'Highlight technical stack and architectural outcomes for open source projects.',
    icon: FolderGit2,
    estimatedBoost: '+8 ATS',
    category: 'Projects',
  },
  {
    id: 'act-education',
    title: 'Improve Education',
    description: 'Format degree titles, GPA honors, and relevant coursework clearly.',
    icon: GraduationCap,
    estimatedBoost: '+5 ATS',
    category: 'Education',
  },
  {
    id: 'act-certs',
    title: 'Improve Certifications',
    description: 'Standardize accreditation titles and verification credentials.',
    icon: Award,
    estimatedBoost: '+5 ATS',
    category: 'Certifications',
  },
  {
    id: 'act-overall',
    title: 'Improve Overall Resume',
    description: 'Run comprehensive AI pass to balance formatting, tone, and keyword density.',
    icon: Zap,
    estimatedBoost: '+25 ATS',
    category: 'Full Resume',
  },
]

interface AiActionsListProps {
  onExecuteAction?: (actionId: string) => void
}

export const AiActionsList: React.FC<AiActionsListProps> = ({ onExecuteAction }) => {
  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="text-xs font-bold text-white font-display">
          AI One-Click Optimizations
        </span>
        <span className="text-[10px] font-mono text-purple-400 font-semibold">
          9 Smart Actions
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {AI_ACTIONS_DATA.map((action) => (
          <AiActionCard key={action.id} action={action} onExecute={onExecuteAction} />
        ))}
      </div>
    </div>
  )
}
