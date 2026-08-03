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
    phone: '+91 87672 54321',
    countryCode: '+91',
    location: 'Ahilyanagar, Maharashtra, India',
    website: 'dipakkhandagale.vercel.app',
    linkedin: 'linkedin.com/in/dipak-khandagale',
    github: 'github.com/Dipakkhandagale7',
  },
  onChange,
}) => {
  const currentCountryCode = data.countryCode || '+91'
  
  // Extract pure mobile number without leading country code for input display
  const mobileNumber = (data.phone || '').replace(/^(\+\d{1,4}\s*)/, '')

  const handleFieldChange = (field: keyof ContactInfoData, value: string) => {
    if (onChange) {
      onChange({ ...data, [field]: value })
    }
  }

  const handlePhoneChange = (newMobileNumber: string) => {
    const fullPhone = newMobileNumber ? `${currentCountryCode} ${newMobileNumber}` : ''
    if (onChange) {
      onChange({
        ...data,
        countryCode: currentCountryCode,
        phone: fullPhone,
      })
    }
  }

  const handleCountryCodeChange = (newCode: string) => {
    const fullPhone = mobileNumber ? `${newCode} ${mobileNumber}` : ''
    if (onChange) {
      onChange({
        ...data,
        countryCode: newCode,
        phone: fullPhone,
      })
    }
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase tracking-wider font-mono">
          <Mail size={14} />
          <span>Contact Details</span>
        </div>
        <h3 className="text-base md:text-lg font-extrabold text-white font-display mt-0.5 m-0">
          Contact Information &amp; Social Links
        </h3>
        <p className="text-xs text-slate-300 mt-1 font-sans font-medium">
          How recruiters can contact you and inspect your portfolio or codebase repositories.
        </p>
      </div>

      {/* Main Form Fields Container */}
      <div className="bg-[#121424]/95 border border-slate-800/90 rounded-2xl p-4 md:p-5 space-y-4 shadow-sm min-w-0 w-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 w-full">
          {/* Email Address */}
          <div className="space-y-1.5 min-w-0 w-full overflow-hidden">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <Mail size={12} className="text-purple-400" />
              <span>Email Address <span className="text-pink-400">*</span></span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="e.g. alex@example.com"
              aria-label="Email Address"
              className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all box-border overflow-hidden"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5 min-w-0 w-full overflow-hidden">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <MapPin size={12} className="text-purple-400" />
              <span>Location / City, Country <span className="text-pink-400">*</span></span>
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="e.g. Mumbai, India or Remote"
              aria-label="Location"
              className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all box-border overflow-hidden"
            />
          </div>

          {/* Phone Number Group (Full Width Row) */}
          <div className="sm:col-span-2 space-y-1.5 min-w-0 w-full">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <Phone size={12} className="text-purple-400" />
              <span>Phone Number <span className="text-pink-400">*</span></span>
            </label>
            <div className="flex items-center gap-3 w-full">
              <select
                value={currentCountryCode}
                onChange={(e) => handleCountryCodeChange(e.target.value)}
                aria-label="Country Code"
                className="w-[110px] shrink-0 flex-none h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-2.5 text-xs font-mono font-semibold text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer box-border"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+86">🇨🇳 +86</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+65">🇸🇬 +65</option>
              </select>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="9876543210"
                aria-label="Mobile Number"
                className="flex-1 min-w-0 w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all box-border"
              />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-1.5 min-w-0 w-full overflow-hidden">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <Globe size={12} className="text-purple-400" />
              <span>LinkedIn Profile URL</span>
            </label>
            <input
              type="text"
              value={data.linkedin || ''}
              onChange={(e) => handleFieldChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/username"
              aria-label="LinkedIn"
              className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all box-border overflow-hidden"
            />
          </div>

          {/* GitHub Profile */}
          <div className="space-y-1.5 min-w-0 w-full overflow-hidden">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <Github size={12} className="text-purple-400" />
              <span>GitHub Profile URL</span>
            </label>
            <input
              type="text"
              value={data.github || ''}
              onChange={(e) => handleFieldChange('github', e.target.value)}
              placeholder="github.com/username"
              aria-label="GitHub Profile"
              className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all box-border overflow-hidden"
            />
          </div>

          {/* Portfolio / Website */}
          <div className="sm:col-span-2 space-y-1.5 min-w-0 w-full overflow-hidden">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <LinkIcon size={12} className="text-purple-400" />
              <span>Portfolio / Website URL</span>
            </label>
            <input
              type="text"
              value={data.website || ''}
              onChange={(e) => handleFieldChange('website', e.target.value)}
              placeholder="https://yourportfolio.com"
              aria-label="Portfolio URL"
              className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all box-border overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
