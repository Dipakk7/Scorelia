import React from 'react'
import {
  User,
  Mail,
  Link as LinkIcon,
  FileText,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

export interface PersonalInfoData {
  fullName: string
  professionalTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
  summary: string
}

interface PersonalInfoSectionProps {
  data?: Partial<PersonalInfoData>
  onChange?: (updated: Partial<PersonalInfoData>) => void
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data = {
    fullName: 'Dipak Khandagale',
    professionalTitle: 'AI/ML Engineer',
    email: 'dipakkhandagale7@gmail.com',
    phone: '+91 87672 54321',
    location: 'Ahilyanagar, Maharashtra, India',
    linkedin: 'linkedin.com/in/dipak-khandagale',
    github: 'github.com/Dipakkhandagale7',
    website: 'dipakkhandagale.vercel.app',
    summary:
      'AI/ML Engineer with hands-on experience in machine learning, deep learning, NLP, and data analysis. Skilled in Python, TensorFlow, PyTorch, and building end-to-end AI solutions. Passionate about creating intelligent systems that solve real-world problems.',
  },
  onChange,
}) => {
  const handleFieldChange = (field: keyof PersonalInfoData, value: string) => {
    if (onChange) {
      onChange({ ...data, [field]: value })
    }
  }

  const currentSummary =
    data.summary ||
    'AI/ML Engineer with hands-on experience in machine learning, deep learning, NLP, and data analysis. Skilled in Python, TensorFlow, PyTorch, and building end-to-end AI solutions. Passionate about creating intelligent systems that solve real-world problems.'

  return (
    <div className="space-y-5 text-left font-sans transition-colors">
      {/* Main Section Header */}
      <div className="space-y-1 border-b border-slate-200/80 dark:border-white/[0.08] pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-display m-0">
          Personal Information
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 m-0">
          Add your details. We'll help you build a best-in-class resume.
        </p>
      </div>

      {/* 1. Personal Sub-Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <User size={13} />
          </div>
          <span>Personal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.fullName || ''}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              placeholder="Dipak Khandagale"
              className="w-full h-9 bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Professional Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.professionalTitle || ''}
              onChange={(e) => handleFieldChange('professionalTitle', e.target.value)}
              placeholder="AI/ML Engineer"
              className="w-full h-9 bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. Contact Sub-Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <Mail size={13} />
          </div>
          <span>Contact</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="dipakkhandagale7@gmail.com"
              className="w-full h-9 bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Phone <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center h-9 bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-2.5 gap-2 transition-all">
              <div className="flex items-center gap-1 shrink-0 text-xs text-slate-700 dark:text-slate-300">
                <span className="text-sm">🇮🇳</span>
                <span className="font-mono text-xs">+91</span>
                <ChevronDown size={12} className="text-slate-400" />
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-white/10" />
              <input
                type="text"
                value={(data.phone || '').replace(/^\+91\s*/, '')}
                onChange={(e) => handleFieldChange('phone', `+91 ${e.target.value}`)}
                placeholder="87672 54321"
                className="w-full bg-transparent text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="Ahilyanagar, Maharashtra, India"
              className="w-full h-9 bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 3. Professional Links Sub-Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <LinkIcon size={13} />
          </div>
          <span>Professional Links</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              LinkedIn
            </label>
            <input
              type="text"
              value={data.linkedin || ''}
              onChange={(e) => handleFieldChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/dipak-khandagale"
              className="w-full h-9 bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              GitHub
            </label>
            <input
              type="text"
              value={data.github || ''}
              onChange={(e) => handleFieldChange('github', e.target.value)}
              placeholder="github.com/Dipakkhandagale7"
              className="w-full h-9 bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Portfolio / Website
            </label>
            <input
              type="text"
              value={data.website || ''}
              onChange={(e) => handleFieldChange('website', e.target.value)}
              placeholder="dipakkhandagale.vercel.app"
              className="w-full h-9 bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 4. Professional Summary Sub-Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <FileText size={13} />
          </div>
          <span>Professional Summary</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 m-0">
          Write a brief summary about yourself
        </p>

        <div className="space-y-1">
          <textarea
            rows={4}
            value={currentSummary}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            placeholder="Write a brief summary about yourself..."
            className="w-full bg-slate-50 dark:bg-[#171a2b] border border-slate-200 dark:border-white/[0.08] rounded-xl p-3 text-xs font-medium leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/80 resize-none transition-all"
          />
          <div className="text-right text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {currentSummary.length} / 300
          </div>
        </div>
      </div>

      {/* 5. Smart Tip Card */}
      <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900/50 border border-purple-500/30 rounded-2xl p-3.5 space-y-2.5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-purple-600/30 text-purple-300">
              <Sparkles size={14} />
            </div>
            <span className="text-xs font-bold text-white font-display">Smart Tip</span>
          </div>
          <button
            type="button"
            className="text-[11px] font-medium text-purple-400 hover:underline cursor-pointer"
          >
            Why this tip?
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed m-0">
          Adding 2–3 measurable achievements to your summary can increase your ATS score by up to 30%.
        </p>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-200 bg-purple-600/30 border border-purple-400/30 hover:bg-purple-600/50 transition-all cursor-pointer shadow-xs"
          >
            <span>+ Apply Suggestion</span>
          </button>
        </div>
      </div>
    </div>
  )
}
