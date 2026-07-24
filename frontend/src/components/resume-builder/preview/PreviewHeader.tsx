import React from 'react'

interface PreviewHeaderProps {
  fullName: string
  professionalTitle: string
  headline?: string
  accentColor?: string
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  fullName,
  professionalTitle,
  headline,
  accentColor = '#1e40af',
}) => {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-black tracking-wide font-display uppercase m-0 text-slate-900">
        {fullName}
      </h1>
      <p
        className="text-xs font-bold tracking-wider font-mono uppercase m-0"
        style={{ color: accentColor }}
      >
        {professionalTitle}
      </p>
      {headline && (
        <p className="text-[11px] text-slate-600 font-sans italic m-0">
          {headline}
        </p>
      )}
    </div>
  )
}
