import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { ParsedResumeData } from '@/types/resume'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Trash2, Save, Undo2, AlertTriangle, ArrowLeft, PlusCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'

// Form schema
const educationSchema = z.object({
  degree: z.string().min(1, 'Degree/Certificate is required').nullable(),
  institution: z.string().min(1, 'Institution is required').nullable(),
  year: z.string().nullable().optional(),
  raw_text: z.string().nullable().optional(),
})

const experienceSchema = z.object({
  title: z.string().min(1, 'Job Title is required').nullable(),
  company: z.string().min(1, 'Company Name is required').nullable(),
  duration: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  raw_text: z.string().nullable().optional(),
})

const projectSchema = z.object({
  name: z.string().min(1, 'Project Name is required').nullable(),
  description: z.string().nullable().optional(),
  technologies: z.array(z.string()),
  raw_text: z.string().nullable().optional(),
})

const resumeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  phone: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  links: z.array(z.string()),
  certifications: z.array(z.string()),
  achievements: z.array(z.string()),
  languages: z.array(z.string()),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
})

type ResumeFormValues = z.infer<typeof resumeFormSchema>

interface ResumeEditorProps {
  parsedData: ParsedResumeData | null
  onSave: (updatedData: ParsedResumeData) => Promise<void>
  onDiscard: () => void
}

export default function ResumeEditor({ parsedData, onSave, onDiscard }: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState<'contact' | 'skills' | 'experience' | 'education' | 'projects' | 'additional'>('contact')
  const [showDiscardWarn, setShowDiscardWarn] = useState(false)

  // Map parsed data into form structure
  const getInitialValues = (): ResumeFormValues => {
    if (!parsedData) {
      return {
        name: '',
        email: '',
        phone: '',
        summary: '',
        skills: [],
        links: [],
        certifications: [],
        achievements: [],
        languages: [],
        education: [],
        experience: [],
        projects: [],
      }
    }

    const { data } = parsedData
    return {
      name: data.name?.value || '',
      email: data.email?.value || '',
      phone: data.phone?.value || '',
      summary: data.summary?.value || '',
      skills: data.skills?.value || [],
      links: data.links?.value || [],
      certifications: data.certifications?.value || [],
      achievements: data.achievements?.value || [],
      languages: data.languages?.value || [],
      education: (data.education?.value || []).map((edu) => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        year: edu.year || '',
        raw_text: edu.raw_text || '',
      })),
      experience: (data.experience?.value || []).map((exp) => ({
        title: exp.title || '',
        company: exp.company || '',
        duration: exp.duration || '',
        description: exp.description || '',
        raw_text: exp.raw_text || '',
      })),
      projects: (data.projects?.value || []).map((proj) => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || [],
        raw_text: proj.raw_text || '',
      })),
    }
  }

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: getInitialValues(),
  })

  // Watch fields for tag-based editing
  const skillsWatch = watch('skills')
  const linksWatch = watch('links')
  const certsWatch = watch('certifications')
  const achvsWatch = watch('achievements')
  const languagesWatch = watch('languages')

  // Dynamic lists field arrays
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: 'education',
  })

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: 'experience',
  })

  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
    control,
    name: 'projects',
  })

  // Dynamic tags handlers (skills, links, certs, achievements, languages)
  const [skillInput, setSkillInput] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [certInput, setCertInput] = useState('')
  const [achInput, setAchInput] = useState('')
  const [langInput, setLangInput] = useState('')

  const addSkill = () => {
    if (skillInput.trim() && !skillsWatch.includes(skillInput.trim())) {
      setValue('skills', [...skillsWatch, skillInput.trim()], { shouldDirty: true })
      setSkillInput('')
    }
  }

  const removeSkill = (index: number) => {
    setValue(
      'skills',
      skillsWatch.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  const addLink = () => {
    if (linkInput.trim() && !linksWatch.includes(linkInput.trim())) {
      setValue('links', [...linksWatch, linkInput.trim()], { shouldDirty: true })
      setLinkInput('')
    }
  }

  const removeLink = (index: number) => {
    setValue(
      'links',
      linksWatch.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  const addCert = () => {
    if (certInput.trim() && !certsWatch.includes(certInput.trim())) {
      setValue('certifications', [...certsWatch, certInput.trim()], { shouldDirty: true })
      setCertInput('')
    }
  }

  const removeCert = (index: number) => {
    setValue(
      'certifications',
      certsWatch.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  const addAch = () => {
    if (achInput.trim() && !achvsWatch.includes(achInput.trim())) {
      setValue('achievements', [...achvsWatch, achInput.trim()], { shouldDirty: true })
      setAchInput('')
    }
  }

  const removeAch = (index: number) => {
    setValue(
      'achievements',
      achvsWatch.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  const addLang = () => {
    if (langInput.trim() && !languagesWatch.includes(langInput.trim())) {
      setValue('languages', [...languagesWatch, langInput.trim()], { shouldDirty: true })
      setLangInput('')
    }
  }

  const removeLang = (index: number) => {
    setValue(
      'languages',
      languagesWatch.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  // Handle submit form
  const onSubmit = async (values: ResumeFormValues) => {
    if (!parsedData) return

    // Convert values back to ParsedResumeData format
    const updatedData: ParsedResumeData = {
      ...parsedData,
      data: {
        name: { value: values.name, confidence: parsedData.data.name?.confidence || 0.98 },
        email: { value: values.email, confidence: parsedData.data.email?.confidence || 0.98 },
        phone: { value: values.phone || null, confidence: parsedData.data.phone?.confidence || 0.95 },
        links: { value: values.links, confidence: parsedData.data.links?.confidence || 0.9 },
        skills: { value: values.skills, confidence: parsedData.data.skills?.confidence || 0.95 },
        education: {
          value: values.education.map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            year: edu.year ?? null,
            raw_text: edu.raw_text ?? null,
          })),
          confidence: parsedData.data.education?.confidence || 0.9,
        },
        experience: {
          value: values.experience.map((exp) => ({
            title: exp.title,
            company: exp.company,
            duration: exp.duration ?? null,
            description: exp.description ?? null,
            raw_text: exp.raw_text ?? null,
          })),
          confidence: parsedData.data.experience?.confidence || 0.9,
        },
        projects: {
          value: values.projects.map((proj) => ({
            name: proj.name,
            description: proj.description ?? null,
            technologies: proj.technologies,
            raw_text: proj.raw_text ?? null,
          })),
          confidence: parsedData.data.projects?.confidence || 0.9,
        },
        certifications: {
          value: values.certifications,
          confidence: parsedData.data.certifications?.confidence || 0.85,
        },
        summary: {
          value: values.summary || null,
          confidence: parsedData.data.summary?.confidence || 0.9,
        },
        languages: {
          value: values.languages,
          confidence: parsedData.data.languages?.confidence || 0.85,
        },
        achievements: {
          value: values.achievements,
          confidence: parsedData.data.achievements?.confidence || 0.85,
        },
      },
      statistics: {
        ...parsedData.statistics,
        skills_found: values.skills.length,
        education_found: values.education.length,
        experience_found: values.experience.length,
        projects_found: values.projects.length,
        certifications_found: values.certifications.length,
        links_found: values.links.length,
        summary_found: values.summary ? 1 : 0,
        languages_found: values.languages.length,
        achievements_found: values.achievements.length,
        // Re-count empty sections
        empty_sections: [
          values.name,
          values.email,
          values.phone,
          values.summary,
          values.skills.length,
          values.education.length,
          values.experience.length,
          values.projects.length,
          values.certifications.length,
          values.languages.length,
          values.achievements.length,
          values.links.length,
        ].filter((item) => !item).length,
      },
    }

    try {
      await onSave(updatedData)
      reset(values) // clear dirty state
      toast.success('Changes saved successfully!')
    } catch {
      toast.error('Failed to save manual edits.')
    }
  }

  const handleDiscardClick = () => {
    if (isDirty) {
      setShowDiscardWarn(true)
    } else {
      onDiscard()
    }
  }

  const tabs = [
    { id: 'contact', label: 'Contact & Info' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'additional', label: 'Additional' },
  ] as const

  return (
    <div className="space-y-6">
      {/* Editor Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDiscardClick}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </Button>
          {isDirty && (
            <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-450 font-sans pl-2 border-l border-slate-200 dark:border-slate-800">
              <AlertTriangle size={13} />
              <span>Unsaved changes</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => reset(getInitialValues())}
            disabled={!isDirty || isSubmitting}
            className="flex items-center gap-1.5 text-xs text-slate-650 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Undo2 size={13} />
            <span>Reset Edits</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty || isSubmitting}
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Save size={13} />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Editor Main Section tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start font-sans">
        {/* Left Side: Navigation Links */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-auto bg-slate-50 dark:bg-slate-900/30 p-1.5 rounded-xl border border-slate-250/20 gap-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-brand-650 dark:text-brand-400 shadow-sm border border-slate-100 dark:border-slate-700'
                  : 'text-slate-550 dark:text-slate-450 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 hover:text-slate-850 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side: Form details */}
        <div className="lg:col-span-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm text-left">
          {/* TAB 1: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Full Name <strong className="text-red-500">*</strong>
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="E.g., John Doe"
                    error={errors.name?.message}
                    className="w-full text-sm font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <Input
                      {...register('email')}
                      placeholder="john.doe@example.com"
                      error={errors.email?.message}
                      className="w-full text-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <Input
                      {...register('phone')}
                      placeholder="+1 (555) 019-2834"
                      className="w-full text-sm font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Professional Summary
                  </label>
                  <textarea
                    {...register('summary')}
                    rows={6}
                    placeholder="Write a professional summary statement..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm font-sans outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:text-slate-150"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
                Skills Inventory
              </h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="E.g., TypeScript, Kubernetes, Financial Planning"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkill()
                      }
                    }}
                    className="flex-1 text-sm font-sans"
                  />
                  <Button variant="primary" onClick={addSkill} className="flex items-center gap-1 py-2 cursor-pointer">
                    <Plus size={16} />
                    <span>Add</span>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsWatch.length === 0 ? (
                    <p className="text-sm text-slate-400 italic font-sans">No skills added yet.</p>
                  ) : (
                    skillsWatch.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-sans text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
                  Work Experience
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => appendExp({ title: '', company: '', duration: '', description: '' })}
                  className="flex items-center gap-1.5 text-xs text-brand-650 hover:bg-brand-50 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>Add Experience</span>
                </Button>
              </div>

              {expFields.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                  <p className="text-sm text-slate-400 italic">No experience records found.</p>
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-850">
                  {expFields.map((field, index) => (
                    <div key={field.id} className={index > 0 ? 'pt-6 space-y-4' : 'space-y-4'}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-455">Record #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeExp(index)}
                          className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Job Title <strong className="text-red-500">*</strong>
                          </label>
                          <Input
                            {...register(`experience.${index}.title` as const)}
                            placeholder="E.g., Senior Systems Developer"
                            error={errors.experience?.[index]?.title?.message}
                            className="text-sm font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Company Name <strong className="text-red-500">*</strong>
                          </label>
                          <Input
                            {...register(`experience.${index}.company` as const)}
                            placeholder="E.g., Google LLC"
                            error={errors.experience?.[index]?.company?.message}
                            className="text-sm font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Duration & Dates
                        </label>
                        <Input
                          {...register(`experience.${index}.duration` as const)}
                          placeholder="E.g., Jan 2021 - Present or 3 Years"
                          className="text-sm font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Job Description / Bullet Points
                        </label>
                        <textarea
                          {...register(`experience.${index}.description` as const)}
                          rows={4}
                          placeholder="List duties, metrics achieved, and responsibilities..."
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm font-sans outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:text-slate-150"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
                  Education History
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => appendEdu({ degree: '', institution: '', year: '' })}
                  className="flex items-center gap-1.5 text-xs text-brand-650 hover:bg-brand-50 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>Add Education</span>
                </Button>
              </div>

              {eduFields.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                  <p className="text-sm text-slate-400 italic">No education records found.</p>
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-850">
                  {eduFields.map((field, index) => (
                    <div key={field.id} className={index > 0 ? 'pt-6 space-y-4' : 'space-y-4'}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-455">Record #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeEdu(index)}
                          className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Degree / Certificate <strong className="text-red-500">*</strong>
                          </label>
                          <Input
                            {...register(`education.${index}.degree` as const)}
                            placeholder="E.g., B.S. in Computer Science"
                            error={errors.education?.[index]?.degree?.message}
                            className="text-sm font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Institution Name <strong className="text-red-500">*</strong>
                          </label>
                          <Input
                            {...register(`education.${index}.institution` as const)}
                            placeholder="E.g., Stanford University"
                            error={errors.education?.[index]?.institution?.message}
                            className="text-sm font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Graduation Year
                        </label>
                        <Input
                          {...register(`education.${index}.year` as const)}
                          placeholder="E.g., 2020"
                          className="text-sm font-sans"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
                  Projects History
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => appendProj({ name: '', description: '', technologies: [] })}
                  className="flex items-center gap-1.5 text-xs text-brand-650 hover:bg-brand-50 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>Add Project</span>
                </Button>
              </div>

              {projFields.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                  <p className="text-sm text-slate-400 italic">No project records found.</p>
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-850">
                  {projFields.map((field, index) => {
                    const techWatch = watch(`projects.${index}.technologies`) || []

                    return (
                      <div key={field.id} className={index > 0 ? 'pt-6 space-y-4' : 'space-y-4'}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-455">Project #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeProj(index)}
                            className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-xs cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Project Name <strong className="text-red-500">*</strong>
                          </label>
                          <Input
                            {...register(`projects.${index}.name` as const)}
                            placeholder="E.g., Automated Agent Pipeline"
                            error={errors.projects?.[index]?.name?.message}
                            className="text-sm font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Project Technologies
                          </label>
                          <Input
                            placeholder="Type a technology (e.g. Python) and press comma"
                            onChange={(e) => {
                              const val = e.target.value
                              if (val.endsWith(',')) {
                                const clean = val.replace(',', '').trim()
                                if (clean && !techWatch.includes(clean)) {
                                  setValue(`projects.${index}.technologies`, [...techWatch, clean], {
                                    shouldDirty: true,
                                  })
                                  e.target.value = ''
                                }
                              }
                            }}
                            className="text-sm font-sans mb-2"
                          />
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {techWatch.map((tech, techIdx) => (
                              <span
                                key={techIdx}
                                className="inline-flex items-center gap-1 bg-slate-55 bg-slate-100 dark:bg-slate-800 text-[10px] py-0.5 px-2 rounded font-sans text-slate-700 dark:text-slate-350 border border-slate-150 dark:border-slate-750"
                              >
                                <span>{tech}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setValue(
                                      `projects.${index}.technologies`,
                                      techWatch.filter((_, ti) => ti !== techIdx),
                                      { shouldDirty: true }
                                    )
                                  }
                                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                >
                                  <X size={10} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Project Description
                          </label>
                          <textarea
                            {...register(`projects.${index}.description` as const)}
                            rows={3}
                            placeholder="Write a brief overview of the implementation details..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm font-sans outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:text-slate-150"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ADDITIONAL */}
          {activeTab === 'additional' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
                Additional Sections
              </h3>

              {/* Links input list */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Social Links & URLs
                </label>
                <div className="flex gap-2">
                  <Input
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="E.g., linkedin.com/in/johndoe"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addLink()
                      }
                    }}
                    className="flex-1 text-sm font-sans"
                  />
                  <Button variant="primary" onClick={addLink} className="flex items-center gap-1 py-2 cursor-pointer">
                    <Plus size={16} />
                    <span>Add</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {linksWatch.map((link, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-sans text-slate-700 dark:text-slate-350"
                    >
                      <span className="truncate max-w-[180px]">{link}</span>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-slate-450 hover:text-slate-650 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications input list */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Certifications
                </label>
                <div className="flex gap-2">
                  <Input
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    placeholder="E.g., AWS Certified Solutions Architect"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCert()
                      }
                    }}
                    className="flex-1 text-sm font-sans"
                  />
                  <Button variant="primary" onClick={addCert} className="flex items-center gap-1 py-2 cursor-pointer">
                    <Plus size={16} />
                    <span>Add</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {certsWatch.map((c, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-sans text-slate-700 dark:text-slate-350"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => removeCert(index)}
                        className="text-slate-450 hover:text-slate-650 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements input list */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Achievements & Honors
                </label>
                <div className="flex gap-2">
                  <Input
                    value={achInput}
                    onChange={(e) => setAchInput(e.target.value)}
                    placeholder="E.g., Winner Hackathon 2024"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addAch()
                      }
                    }}
                    className="flex-1 text-sm font-sans"
                  />
                  <Button variant="primary" onClick={addAch} className="flex items-center gap-1 py-2 cursor-pointer">
                    <Plus size={16} />
                    <span>Add</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {achvsWatch.map((a, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-sans text-slate-700 dark:text-slate-350"
                    >
                      <span>{a}</span>
                      <button
                        type="button"
                        onClick={() => removeAch(index)}
                        className="text-slate-450 hover:text-slate-650 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages input list */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Languages Spoken
                </label>
                <div className="flex gap-2">
                  <Input
                    value={langInput}
                    onChange={(e) => setLangInput(e.target.value)}
                    placeholder="E.g., English, Spanish, German"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addLang()
                      }
                    }}
                    className="flex-1 text-sm font-sans"
                  />
                  <Button variant="primary" onClick={addLang} className="flex items-center gap-1 py-2 cursor-pointer">
                    <Plus size={16} />
                    <span>Add</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {languagesWatch.map((l, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-sans text-slate-700 dark:text-slate-350"
                    >
                      <span>{l}</span>
                      <button
                        type="button"
                        onClick={() => removeLang(index)}
                        className="text-slate-450 hover:text-slate-650 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discard Warning Dialog */}
      {showDiscardWarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl text-center space-y-4 animate-scaleUp">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                Unsaved changes detected!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
                You have modified your resume details. Leaving the editor now will discard all these edits.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowDiscardWarn(false)}
                className="flex-1 text-slate-600 dark:text-slate-400"
              >
                Keep Editing
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setShowDiscardWarn(false)
                  onDiscard()
                }}
                className="flex-1 bg-red-650 hover:bg-red-700 text-white"
              >
                Discard Edits
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
