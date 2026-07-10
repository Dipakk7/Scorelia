import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertCircle, Sparkles, BookOpen, Briefcase, Key, CheckCircle, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export interface RecommendationItem {
  category: string
  priority: string
  message: string
}

interface RecommendationCardProps {
  recommendation: RecommendationItem
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { category, priority, message } = recommendation

  const getPriorityBadge = (p: string) => {
    const cleanP = p.toLowerCase()
    if (cleanP === 'high') return <Badge variant="error">High Priority</Badge>
    if (cleanP === 'medium') return <Badge variant="warning">Medium Priority</Badge>
    return <Badge variant="info">Low Priority</Badge>
  }

  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase()
    switch (c) {
      case 'skills':
        return <Sparkles className="text-brand-500 h-5 w-5 shrink-0" />
      case 'experience':
        return <Briefcase className="text-blue-500 h-5 w-5 shrink-0" />
      case 'education':
        return <BookOpen className="text-purple-500 h-5 w-5 shrink-0" />
      case 'keywords':
        return <Key className="text-amber-500 h-5 w-5 shrink-0" />
      default:
        return <AlertCircle className="text-slate-500 h-5 w-5 shrink-0" />
    }
  }

  // Generate a detailed description/action plan based on the recommendation message
  const getActionPlan = (cat: string) => {
    const c = cat.toLowerCase()
    if (c === 'skills') {
      return `To resolve this, add projects or experience bullet points mentioning this technical skill. If you do not possess the skill, consider taking a crash course and adding it to your technical skills section once you have basic competency.`
    }
    if (c === 'experience') {
      return `Your work history doesn't fully align with the duration or responsibilities specified. Try to elaborate on past roles, focus on transferable duties, or list related projects to close the experience gap.`
    }
    if (c === 'education') {
      return `Make sure your degree, major, and graduation year are cleanly formatted. If you have an equivalent degree or are in the process of getting one, clarify this in the education section.`
    }
    if (c === 'keywords') {
      return `ATS scanners search for exact matches. Ensure this specific keyword is naturally integrated in your work experience summaries or project descriptions rather than just listed in a skills block.`
    }
    return `Review your resume layout, ensure there are no parsing issues (like text in images or tables that scanners can't read), and update this section to meet modern recruitment standards.`
  }

  return (
    <div className="border border-border/60 bg-card/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xs hover:border-slate-350 dark:hover:border-slate-750 transition-colors duration-200 text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 focus:outline-none cursor-pointer bg-transparent border-none"
      >
        <div className="flex items-center gap-3.5 min-w-0 pr-4">
          <div className="p-2 bg-slate-50/50 dark:bg-slate-850 border border-border rounded-xl shrink-0">
            {getCategoryIcon(category)}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate pr-2 m-0 leading-tight">
              {message}
            </p>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1 m-0">Category: {category}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {getPriorityBadge(priority)}
          {isOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-border/40 bg-background/20 text-xs text-muted-foreground leading-relaxed space-y-2.5 animate-fadeIn">
          <div className="flex items-start gap-2.5 mt-3">
            <CheckCircle size={14} className="text-success shrink-0 mt-0.5" />
            <div className="font-medium">
              <span className="font-bold text-foreground">Action Plan: </span>
              {getActionPlan(category)}
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <HelpCircle size={14} className="text-brand-500 shrink-0 mt-0.5" />
            <div className="font-medium">
              <span className="font-bold text-foreground">Why this matters: </span>
              ATS filters parse specific categories to grade suitability. Missing terms or structures reduce overall scanner scoring by up to 25%.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecommendationCard
