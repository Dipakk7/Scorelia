import React from 'react'
import { User, Camera } from 'lucide-react'

export interface PersonalInfoData {
  fullName: string
  professionalTitle: string
  headline: string
  photoUrl?: string
}

interface PersonalInfoSectionProps {
  data?: PersonalInfoData
  onChange?: (updated: PersonalInfoData) => void
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data = {
    fullName: 'Dipak Khandagale',
    professionalTitle: 'AI/ML Engineer',
    headline: 'Building intelligent AI systems, NLP models & scalable web platforms',
  },
  onChange,
}) => {
  const handleFieldChange = (field: keyof PersonalInfoData, value: string) => {
    if (onChange) {
      onChange({ ...data, [field]: value })
    }
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-border-subtle pb-3 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
          <User size={14} />
          <span>Personal Details</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5 m-0">
          Personal Information
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-sans">
          Provide your legal name, headline, and professional title as they should appear at the top of your resume.
        </p>
      </div>

      {/* Main Form Fields Container */}
      <div className="bg-slate-50 dark:bg-surface-l3 border border-slate-200 dark:border-border-subtle rounded-[10px] p-4 md:p-5 space-y-4 shadow-none transition-colors">
        {/* Profile Photo Upload Row */}
        <div className="flex items-center gap-4 pb-3 border-b border-slate-200/80 dark:border-border-subtle">
          <div className="relative w-12 h-12 rounded-full bg-slate-200 dark:bg-surface-l4 border border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0 overflow-hidden group">
            <span className="text-base font-black font-display">
              {data.fullName ? data.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'DK'}
            </span>
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={16} className="text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white m-0">Profile Picture (Optional)</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 m-0">JPG or PNG under 2MB. Preferred for EU &amp; creative templates.</p>
            <button
              type="button"
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80 rounded"
            >
              Upload Photo
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Full Name <span className="text-pink-500 dark:text-pink-400">*</span></span>
            </label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              placeholder="e.g. Dipak Khandagale"
              aria-label="Full Name"
              className="w-full h-9 bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-[10px] px-3.5 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Professional Title <span className="text-pink-500 dark:text-pink-400">*</span></span>
            </label>
            <input
              type="text"
              value={data.professionalTitle}
              onChange={(e) => handleFieldChange('professionalTitle', e.target.value)}
              placeholder="e.g. Senior AI/ML Engineer"
              aria-label="Professional Title"
              className="w-full h-9 bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-[10px] px-3.5 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Headline / Subtitle</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Optional</span>
            </label>
            <input
              type="text"
              value={data.headline || ''}
              onChange={(e) => handleFieldChange('headline', e.target.value)}
              placeholder="e.g. Specializing in NLP, PyTorch &amp; High-Performance Distributed Systems"
              aria-label="Headline"
              className="w-full h-9 bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-[10px] px-3.5 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
