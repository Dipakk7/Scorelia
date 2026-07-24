import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { KeyRound, CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
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
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
            <KeyRound className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
              Categorized Keyword Intelligence
            </h3>
            <p className="text-[11px] text-slate-400">
              ATS keyword density analysis across domain skill buckets
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1 text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-purple-400" />
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
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5 transition-all hover:border-slate-700/80"
            >
              <div
                onClick={() => toggleCategory(cat.category)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">{cat.category}</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {matchPercent}% Match
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[11px] font-mono">
                    {cat.matched.length}/{totalCatKeywords}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Keyword Cloud */}
              {isExpanded && (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                      Matched ({cat.matched.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.matched.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {cat.missing.length > 0 && (
                    <div className="mt-1">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                        Missing Critical ({cat.missing.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.missing.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20"
                          >
                            <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
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
