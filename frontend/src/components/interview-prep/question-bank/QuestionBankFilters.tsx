import React from 'react'
import { Filter, RotateCcw } from 'lucide-react'
import type { QuestionBankFilterState } from '@/types/interviewPrep'

export interface QuestionBankFiltersProps {
  filters: QuestionBankFilterState
  onChangeFilter: (updated: Partial<QuestionBankFilterState>) => void
  onResetFilters: () => void
}

export function QuestionBankFilters({
  filters,
  onChangeFilter,
  onResetFilters,
}: QuestionBankFiltersProps) {
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']
  const questionTypes = ['All', 'Technical', 'Behavioral', 'HR', 'Coding', 'System Design']
  const experienceLevels = ['All', 'Fresher', 'Junior', 'Mid', 'Senior']
  const companies = ['All', 'Google', 'Microsoft', 'Amazon', 'Meta', 'OpenAI', 'Netflix']

  return (
    <div className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Filter className="h-4 w-4 text-purple-400" />
          <span>Filter Questions</span>
        </div>

        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Difficulty */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Difficulty
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => onChangeFilter({ difficulty: e.target.value })}
            className="w-full bg-[#141627] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            {difficulties.map((d) => (
              <option key={d} value={d} className="bg-[#141627] text-white">
                {d === 'All' ? 'All Difficulties' : d}
              </option>
            ))}
          </select>
        </div>

        {/* Question Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Type
          </label>
          <select
            value={filters.questionType}
            onChange={(e) => onChangeFilter({ questionType: e.target.value })}
            className="w-full bg-[#141627] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            {questionTypes.map((t) => (
              <option key={t} value={t} className="bg-[#141627] text-white">
                {t === 'All' ? 'All Types' : t}
              </option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Experience
          </label>
          <select
            value={filters.experience}
            onChange={(e) => onChangeFilter({ experience: e.target.value })}
            className="w-full bg-[#141627] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            {experienceLevels.map((exp) => (
              <option key={exp} value={exp} className="bg-[#141627] text-white">
                {exp === 'All' ? 'All Experience Levels' : exp}
              </option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Company
          </label>
          <select
            value={filters.company}
            onChange={(e) => onChangeFilter({ company: e.target.value })}
            className="w-full bg-[#141627] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            {companies.map((c) => (
              <option key={c} value={c} className="bg-[#141627] text-white">
                {c === 'All' ? 'All Companies' : c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
export default QuestionBankFilters
