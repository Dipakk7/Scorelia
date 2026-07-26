import React from 'react'
import { Briefcase, ChevronDown } from 'lucide-react'

export interface JobDescriptionOption {
  id: string
  jobTitle: string
  company: string
}

export interface JobDescriptionSelectorProps {
  selectedId?: string
  options?: JobDescriptionOption[]
  onChange?: (id: string) => void
  disabled?: boolean
}

const defaultJobs: JobDescriptionOption[] = [
  { id: 'jd-1', jobTitle: 'AI/ML Engineer', company: 'Google' },
  { id: 'jd-2', jobTitle: 'Senior Frontend Engineer', company: 'Microsoft' },
  { id: 'jd-3', jobTitle: 'Full Stack Engineer', company: 'OpenAI' },
]

export const JobDescriptionSelector: React.FC<JobDescriptionSelectorProps> = ({
  selectedId = 'jd-1',
  options = defaultJobs,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="relative min-w-[200px] text-left">
      <label htmlFor="job-description-select" className="sr-only">
        Select Target Job Description
      </label>
      <div className="relative">
        <select
          id="job-description-select"
          aria-label="Select Target Job Description"
          value={selectedId}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-8 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50 cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.jobTitle} - {option.company}
            </option>
          ))}
        </select>
        <Briefcase className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
        <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
      </div>
    </div>
  )
}

export default JobDescriptionSelector
