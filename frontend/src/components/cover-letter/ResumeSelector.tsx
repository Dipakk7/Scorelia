import React from 'react'
import { FileText, ChevronDown } from 'lucide-react'

export interface ResumeOption {
  id: string
  title: string
  score?: number
  updatedAt?: string
}

export interface ResumeSelectorProps {
  selectedId?: string
  options?: ResumeOption[]
  onChange?: (id: string) => void
  disabled?: boolean
}

const defaultResumes: ResumeOption[] = [
  { id: 'res-1', title: 'Dipak_Khandagale_AI_Enginee.pdf', score: 86, updatedAt: 'Updated 2 days ago' },
  { id: 'res-2', title: 'Software_Developer_Resume_V2.pdf', score: 82, updatedAt: 'Updated 1 week ago' },
  { id: 'res-3', title: 'Data_Scientist_Master_Resume.pdf', score: 88, updatedAt: 'Updated 3 weeks ago' },
]

export const ResumeSelector: React.FC<ResumeSelectorProps> = ({
  selectedId = 'res-1',
  options = defaultResumes,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="relative min-w-[200px] text-left">
      <label htmlFor="resume-selector-select" className="sr-only">
        Select Source Resume
      </label>
      <div className="relative">
        <select
          id="resume-selector-select"
          aria-label="Select Source Resume"
          value={selectedId}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-8 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50 cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title} {option.score ? `(ATS: ${option.score})` : ''}
            </option>
          ))}
        </select>
        <FileText className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
        <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
      </div>
    </div>
  )
}

export default ResumeSelector
