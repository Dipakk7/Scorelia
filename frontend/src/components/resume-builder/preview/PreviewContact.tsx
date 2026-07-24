import React from 'react'

interface PreviewContactProps {
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  accentColor?: string
}

export const PreviewContact: React.FC<PreviewContactProps> = ({
  email,
  phone,
  location,
  website,
  linkedin,
  github,
  accentColor = '#1e40af',
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-medium pt-1">
      {email && <span>📧 {email}</span>}
      {phone && <span>📞 {phone}</span>}
      {location && <span>📍 {location}</span>}
      {linkedin && (
        <span style={{ color: accentColor }} className="font-semibold">
          🌐 {linkedin}
        </span>
      )}
      {github && <span>🐙 {github}</span>}
      {website && <span className="text-purple-700">🔗 {website}</span>}
    </div>
  )
}
