import React, { useState, memo } from 'react'
import { Bot, ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertTriangle, Zap, Code, Video, FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface AIInsightsReportProps {
  className?: string
}

export const AIInsightsReport = memo(function AIInsightsReport({ className }: AIInsightsReportProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>('strengths')

  const toggleExpand = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id))
  }

  const insightSections = [
    {
      id: 'strengths',
      title: 'Verified Candidate Strengths',
      category: 'Strengths',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      summary: 'Strong Python OOP fundamentals, Exploratory Data Analysis, and Supervised Machine Learning algorithms.',
      details: [
        'Mastered core Pandas, NumPy, and Scikit-learn pipelines with 85% proficiency.',
        'Demonstrates solid mathematical grounding in Linear Algebra and Probability.',
        'Consistently delivers clean code with modular function structuring.',
      ],
    },
    {
      id: 'weaknesses',
      title: 'Priority Growth & Gap Areas',
      category: 'Skill Gaps',
      icon: <AlertTriangle className="h-4 w-4 text-rose-400" aria-hidden="true" />,
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      summary: 'Requires containerization (Docker, Kubernetes) and hands-on MLOps CI/CD exposure.',
      details: [
        'Current MLOps score is 20%, representing the primary gap for Senior AI Engineering roles.',
        'Cloud infrastructure (AWS/Azure) needs certification validation.',
        'Deep learning PyTorch neural network backpropagation loops need further practice.',
      ],
    },
    {
      id: 'priorities',
      title: 'Recommended Learning Priorities',
      category: 'Next Steps',
      icon: <Zap className="h-4 w-4 text-purple-400" aria-hidden="true" />,
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      summary: 'Focus on Scikit-Learn Pipeline Optimization, RAG Vector Search, and FastAPI Microservices.',
      details: [
        'Complete Phase 2 Model Evaluation & Hyperparameter Tuning module.',
        'Build a multi-agent LangGraph workflow for automated document parsing.',
        'Implement automated unit testing for model serving pipelines.',
      ],
    },
    {
      id: 'projects',
      title: 'Suggested Portfolio Projects',
      category: 'Projects',
      icon: <Code className="h-4 w-4 text-blue-400" aria-hidden="true" />,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      summary: 'End-to-end RAG question answering pipeline using ChromaDB, LangChain, and FastAPI.',
      details: [
        'Project 1: Real-time Customer Churn Prediction API with Docker containerization.',
        'Project 2: LLM Fine-Tuning with LoRA/PEFT on specialized technical datasets.',
        'Project 3: AI Resume & ATS Intelligence Copilot microservice.',
      ],
    },
    {
      id: 'interview-readiness',
      title: 'Technical Interview Readiness',
      category: 'Interviews',
      icon: <Video className="h-4 w-4 text-amber-400" aria-hidden="true" />,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      summary: 'Ready for Entry–Mid Level AI/ML coding rounds. Mock interview score: 84%.',
      details: [
        'Coding Speed: 4/5 - Excellent problem-solving in Python data structures.',
        'System Design: 3.5/5 - Proficient in basic ML architecture, needs distributed training prep.',
        'Behavioral: 4.5/5 - Clear articulation of past project outcomes and trade-offs.',
      ],
    },
    {
      id: 'recruiter-readiness',
      title: 'Recruiter ATS Match Score',
      category: 'ATS Score',
      icon: <FileText className="h-4 w-4 text-cyan-400" aria-hidden="true" />,
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      summary: 'Candidate profile compatibility with target AI/ML Engineer job descriptions is 86/100.',
      details: [
        'Keyword density for Scikit-learn, Pandas, and FastAPI satisfies ATS screening thresholds.',
        'Adding Docker & AWS certifications will boost match score above 92%.',
        'Strong Github repository link presentation enhances technical credibility.',
      ],
    },
  ]

  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Bot className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>AI Career Copilot Intelligence Audit</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Deep-dive automated AI evaluation of candidate resume, skill gaps, and interview readiness
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span>AI Generated</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {insightSections.map((sec) => {
          const isExpanded = expandedCard === sec.id

          return (
            <div
              key={sec.id}
              className="rounded-xl bg-[#0b0c14] border border-white/10 overflow-hidden text-left transition-all"
            >
              <button
                type="button"
                onClick={() => toggleExpand(sec.id)}
                className="w-full p-3.5 flex items-center justify-between gap-3 text-left bg-transparent border-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                    {sec.icon}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate m-0">
                      {sec.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium m-0 truncate">
                      {sec.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border hidden sm:inline-block', sec.badgeColor)}>
                    {sec.category}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-2 text-xs text-slate-300">
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-400 font-medium m-0">
                    {sec.details.map((detail, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
})
export default AIInsightsReport
