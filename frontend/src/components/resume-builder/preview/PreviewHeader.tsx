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
  accentColor = '#0f172a',
}) => {
  return (
    <div className="space-y-0.5">
      <h1 className="text-xl font-bold tracking-tight font-display uppercase m-0 text-slate-900 leading-tight">
        {fullName || 'Dipak Khandagale'}
      </h1>
      <p
        className="text-[11px] font-bold tracking-widest font-mono uppercase m-0 text-slate-700"
        style={{ color: accentColor !== '#1e40af' ? accentColor : undefined }}
      >
        {professionalTitle || 'Senior Software Engineer'}
      </p>
      {headline && (
        <p className="text-[10.5px] text-slate-600 font-sans italic m-0 pt-0.5 leading-snug">
          {headline}
        </p>
      )}
    </div>
  )
}
