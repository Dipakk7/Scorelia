import { GraduationCap, Award, Briefcase, Sparkles, Cpu, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TemplateOption {
  id: 'INTERNSHIP' | 'FRESHER' | 'EXPERIENCED' | 'EXECUTIVE' | 'TECHNICAL' | 'CAREER_CHANGE'
  name: string
  description: string
  icon: React.ComponentType<any>
  tagColor: string
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'INTERNSHIP',
    name: 'Internship',
    description: 'Perfect for students or recent graduates seeking internships and initial industry exposure.',
    icon: GraduationCap,
    tagColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  {
    id: 'FRESHER',
    name: 'Fresher',
    description: 'Tailored for entry-level candidates launching their careers, emphasizing skills and potential.',
    icon: Award,
    tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'EXPERIENCED',
    name: 'Professional',
    description: 'Standard mid-level template focusing on solid professional achievements and core skills.',
    icon: Briefcase,
    tagColor: 'bg-brand-500/10 text-brand-700 dark:text-brand-400 border-brand-500/20',
  },
  {
    id: 'EXECUTIVE',
    name: 'Executive',
    description: 'Polished format for senior leaders, managers, and directors emphasizing vision and leadership impact.',
    icon: Sparkles,
    tagColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  },
  {
    id: 'TECHNICAL',
    name: 'Technical',
    description: 'Emphasizes technical stack, engineering processes, coding contributions, and architecture design.',
    icon: Cpu,
    tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-405 border-amber-500/20',
  },
  {
    id: 'CAREER_CHANGE',
    name: 'Career Change',
    description: 'Focuses on transferable skills, adaptable expertise, and your motivation for shifting domains.',
    icon: RefreshCw,
    tagColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  },
]

interface TemplateSelectorProps {
  selectedId: string
  onChange: (id: 'INTERNSHIP' | 'FRESHER' | 'EXPERIENCED' | 'EXECUTIVE' | 'TECHNICAL' | 'CAREER_CHANGE') => void
  disabled?: boolean
}

export default function TemplateSelector({ selectedId, onChange, disabled }: TemplateSelectorProps) {
  return (
    <div className="space-y-3 font-sans">
      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 leading-none">
        Select Letter Style / Template
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATE_OPTIONS.map((template) => {
          const Icon = template.icon
          const isSelected = selectedId === template.id

          return (
            <button
              key={template.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(template.id)}
              className={cn(
                'group relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer focus:outline-none flex flex-col justify-between h-full bg-card/70 backdrop-blur-md hover:scale-[1.01]',
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-500/10 shadow-sm'
                  : 'border-border hover:border-slate-350 dark:hover:border-slate-750 shadow-2xs',
                disabled && 'opacity-65 cursor-not-allowed hover:scale-100'
              )}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={cn(
                    'p-3 rounded-xl border flex-shrink-0 transition-all duration-200',
                    isSelected
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-slate-50/50 dark:bg-slate-955/20 border-border/60 text-muted-foreground group-hover:text-brand-500 dark:group-hover:text-brand-400'
                  )}
                >
                  <Icon size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 font-display text-sm m-0 leading-tight">
                    {template.name}
                  </h4>
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase tracking-wider mt-1 m-0', template.tagColor)}>
                    {template.id.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-sans mt-auto font-medium">
                {template.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
