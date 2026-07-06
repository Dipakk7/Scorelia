import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface EditableFieldProps {
  isEditing: boolean
  label: string
  value: string
  onChange: (val: string) => void
  type?: 'text' | 'textarea' | 'url'
  placeholder?: string
  className?: string
  error?: string
}

export function EditableField({
  isEditing,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
  error,
}: EditableFieldProps) {
  return (
    <div className={cn('space-y-1.5 text-left', className)}>
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans uppercase tracking-wider">
        {label}
      </label>

      {isEditing ? (
        type === 'textarea' ? (
          <div>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className={cn(
                'w-full rounded-lg border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 dark:focus:border-brand-500 focus:outline-none transition-colors duration-150 resize-y',
                error && 'border-rose-500 dark:border-rose-500/80 focus:border-rose-500'
              )}
            />
            {error && <p className="text-[11px] text-rose-600 dark:text-rose-450 mt-1">{error}</p>}
          </div>
        ) : (
          <div>
            <Input
              type={type === 'url' ? 'text' : type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              error={error}
            />
          </div>
        )
      ) : (
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 font-sans break-all">
          {value ? (
            type === 'url' ? (
              <a
                href={value.startsWith('http') ? value : `https://${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline cursor-pointer"
              >
                {value}
              </a>
            ) : (
              <span className="whitespace-pre-wrap">{value}</span>
            )
          ) : (
            <span className="italic text-slate-400 dark:text-slate-500 font-sans">
              Not specified
            </span>
          )}
        </div>
      )}
    </div>
  )
}
