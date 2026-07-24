import React from 'react'
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'

export interface ContactInfoData {
  email: string
  phone: string
  countryCode: string
  location: string
  address?: string
  website?: string
  linkedin?: string
  github?: string
}

interface ContactInfoSectionProps {
  data?: ContactInfoData
  onChange?: (updated: ContactInfoData) => void
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  data = {
    email: 'dipakkhandagale7@gmail.com',
    phone: '87672 54321',
    countryCode: '+91',
    location: 'Ahilyanagar, Maharashtra, India',
    website: 'dipakkhandagale.vercel.app',
    linkedin: 'linkedin.com/in/dipak-khandagale',
    github: 'github.com/Dipakkhandagale7',
  },
  onChange,
}) => {
  const handleFieldChange = (field: keyof ContactInfoData, value: string) => {
    if (onChange) {
      onChange({ ...data, [field]: value })
    }
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
          <Mail size={14} />
          <span>Contact Details</span>
        </div>
        <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
          Contact Information &amp; Social Links
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          How recruiters can contact you and inspect your portfolio or codebase repositories.
        </p>
      </div>

      {/* Main Form Fields Container */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 md:p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Mail size={12} className="text-purple-400" />
              <span>Email Address <span className="text-pink-400">*</span></span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="e.g. alex@example.com"
              aria-label="Email Address"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 transition-colors"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Phone size={12} className="text-purple-400" />
              <span>Phone Number <span className="text-pink-400">*</span></span>
            </label>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-950/80 border border-white/10 rounded-xl px-2 py-2 text-xs font-mono font-medium text-slate-300 flex items-center justify-center shrink-0">
                <span>🇮🇳 +91</span>
              </div>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="e.g. 9876543210"
                aria-label="Phone Number"
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin size={12} className="text-purple-400" />
              <span>Location / City, Country <span className="text-pink-400">*</span></span>
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="e.g. Mumbai, India or Remote"
              aria-label="Location"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 transition-colors"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Globe size={12} className="text-purple-400" />
              <span>LinkedIn URL</span>
            </label>
            <input
              type="text"
              value={data.linkedin || ''}
              onChange={(e) => handleFieldChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/username"
              aria-label="LinkedIn"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 transition-colors"
            />
          </div>

          {/* GitHub */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Github size={12} className="text-purple-400" />
              <span>GitHub Profile</span>
            </label>
            <input
              type="text"
              value={data.github || ''}
              onChange={(e) => handleFieldChange('github', e.target.value)}
              placeholder="github.com/username"
              aria-label="GitHub Profile"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 transition-colors"
            />
          </div>

          {/* Website */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <LinkIcon size={12} className="text-purple-400" />
              <span>Portfolio / Website URL</span>
            </label>
            <input
              type="text"
              value={data.website || ''}
              onChange={(e) => handleFieldChange('website', e.target.value)}
              placeholder="https://yourportfolio.com"
              aria-label="Portfolio URL"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
