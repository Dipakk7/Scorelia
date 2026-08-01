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
}) => {
  const items = [
    email && { key: 'email', val: email },
    phone && { key: 'phone', val: phone },
    location && { key: 'location', val: location },
    linkedin && { key: 'linkedin', val: linkedin },
    github && { key: 'github', val: github },
    website && { key: 'website', val: website },
  ].filter(Boolean) as { key: string; val: string }[]

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-600 font-medium pt-1">
      {items.map((item, idx) => (
        <React.Fragment key={item.key}>
          {idx > 0 && <span className="text-slate-300 select-none">•</span>}
          <span>{item.val}</span>
        </React.Fragment>
      ))}
    </div>
  )
}
