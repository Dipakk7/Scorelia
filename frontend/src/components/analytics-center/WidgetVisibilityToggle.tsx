import React from 'react'

interface WidgetVisibilityToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  id?: string
  className?: string
}

export function WidgetVisibilityToggle({
  checked,
  onChange,
  label,
  id,
  className = '',
}: WidgetVisibilityToggleProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label || 'Toggle widget visibility'}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
        checked ? 'bg-purple-600' : 'bg-slate-700'
      } ${className}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default WidgetVisibilityToggle
