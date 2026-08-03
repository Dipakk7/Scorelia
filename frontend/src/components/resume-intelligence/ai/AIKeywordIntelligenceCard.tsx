import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { KeyRound, CheckCircle2, XCircle, ChevronDown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KeywordCategoryItem } from '@/components/resume-intelligence/KeywordMatchCard'

interface AIKeywordIntelligenceCardProps {
  categories?: KeywordCategoryItem[]
}

const defaultCategories: KeywordCategoryItem[] = [
  {
    category: 'AI & Machine Learning Core',
    matched: ['PyTorch', 'TensorFlow', 'Transformers', 'LLMs', 'Scikit-learn', 'NLP', 'Vector DBs'],
    missing: ['Triton Inference Server', 'vLLM', 'LangChain'],
  },
  {
    category: 'Backend & Systems Architecture',
    matched: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'REST APIs', 'Redis'],
    missing: ['Kubernetes', 'gRPC', 'Kafka'],
  },
  {
    category: 'Cloud & MLOps Infrastructure',
    matched: ['AWS (S3, EC2)', 'Docker', 'CI/CD Pipelines', 'Model Training'],
    missing: ['Terraform', 'GCP Vertex AI', 'Model Monitoring'],
  },
  {
    category: 'Leadership & Soft Skills',
    matched: ['Agile Development', 'Cross-functional Collaboration', 'Technical Mentorship'],
    missing: ['Executive Stakeholder Reporting', 'Budget Planning'],
  },
]

export const AIKeywordIntelligenceCard: React.FC<AIKeywordIntelligenceCardProps> = ({
  categories = defaultCategories,
}) => {
  const [expandedCat, setExpandedCat] = useState<string | null>(categories[0]?.category || null)

  const toggleCategory = (catName: string) => {
    setExpandedCat(expandedCat === catName ? null : catName)
  }

  return (
    <Card className="bg-[#0b0c14]/95 border border-slate-800/90 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 shadow-xs shrink-0">
            <KeyRound className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Categorized Keyword Intelligence
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              ATS keyword density analysis across domain skill buckets
            </p>
          </div>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full shrink-0 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Market Aligned
        </span>
      </div>

      {/* Expandable Categories List */}
      <div className="flex flex-col gap-3 flex-1">
        {categories.map((cat) => {
          const isExpanded = expandedCat === cat.category
          const totalCatKeywords = cat.matched.length + cat.missing.length
          const matchPercent = Math.round((cat.matched.length / totalCatKeywords) * 100)

          return (
            <div
              key={cat.category}
              className="rounded-2xl bg-[#0e101c] border border-slate-800/90 overflow-hidden transition-all duration-200 hover:border-purple-500/40"
            >
              <button
                type="button"
                onClick={() => toggleCategory(cat.category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleCategory(cat.category)
                  }
                }}
                className="w-full p-4 flex items-center justify-between gap-3 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                  <span className="text-xs sm:text-sm font-extrabold text-white truncate">{cat.category}</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono shrink-0">
                    {matchPercent}% Match
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-slate-400">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {cat.matched.length}/{totalCatKeywords}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-purple-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                </div>
              </button>

              {/* Expanded Keyword Cloud */}
              {isExpanded && (
                <div className="p-4 bg-[#07080e]/90 border-t border-slate-800/80 shadow-inner flex flex-col gap-4">
                  <div>
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block mb-2">
                      Matched Keywords ({cat.matched.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {cat.matched.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs transition-all hover:bg-emerald-500/20 hover:border-emerald-500/40 cursor-default"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {cat.missing.length > 0 && (
                    <div>
                      <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider block mb-2">
                        Missing Critical Keywords ({cat.missing.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {cat.missing.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-xs transition-all hover:bg-rose-500/20 hover:border-rose-500/40 cursor-default"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default AIKeywordIntelligenceCard
