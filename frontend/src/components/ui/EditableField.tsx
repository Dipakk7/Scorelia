import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
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
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={4}
              error={error}
            />
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
