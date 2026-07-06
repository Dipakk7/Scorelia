import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Briefcase, Building, MapPin, DollarSign, Calendar, Gift, Settings } from 'lucide-react'

interface JobDescriptionData {
  title: string | null
  company: string | null
  required_skills: string[]
  preferred_skills: string[]
  education: string[]
  experience: string[]
  certifications: string[]
  responsibilities: string[]
  keywords: string[]
  raw_text: string
}

interface JobCardProps {
  jobData: JobDescriptionData
  parserVersion?: string
  generatedAt?: string
}

export function JobCard({ jobData, parserVersion = 'v1.0', generatedAt }: JobCardProps) {
  const {
    title,
    company,
    required_skills = [],
    preferred_skills = [],
    education = [],
    experience = [],
    responsibilities = [],
    raw_text = '',
  } = jobData

  // Heuristics to extract metadata from raw_text
  const extractedMeta = useMemo(() => {
    const lines = raw_text.split('\n')
    let location: string | null = null
    let employmentType: string | null = null
    let salary: string | null = null
    let benefits: string | null = null

    const locationRegex = /\blocation\s*:\s*(.+)$/i
    const typeRegex = /\b(?:employment\s+type|job\s+type)\s*:\s*(.+)$/i
    const salaryRegex = /\b(?:salary|compensation|pay|range)\s*:\s*(.+)$/i
    const benefitsRegex = /\b(?:benefits|perks)\s*:\s*(.+)$/i

    for (const line of lines) {
      const trimmed = line.trim()
      
      const locMatch = trimmed.match(locationRegex)
      if (locMatch) location = locMatch[1].trim()

      const typeMatch = trimmed.match(typeRegex)
      if (typeMatch) employmentType = typeMatch[1].trim()

      const salMatch = trimmed.match(salaryRegex)
      if (salMatch) salary = salMatch[1].trim()

      const benMatch = trimmed.match(benefitsRegex)
      if (benMatch) benefits = benMatch[1].trim()
    }

    // Secondary fallback search in full text
    if (!location) {
      if (raw_text.match(/\bremote\b/i)) location = 'Remote'
      else if (raw_text.match(/\bhybrid\b/i)) location = 'Hybrid'
    }

    if (!employmentType) {
      if (raw_text.match(/\bfull-time\b/i) || raw_text.match(/\bft\b/i)) employmentType = 'Full-time'
      else if (raw_text.match(/\bpart-time\b/i)) employmentType = 'Part-time'
      else if (raw_text.match(/\bcontract\b/i)) employmentType = 'Contract'
    }

    if (!salary) {
      const moneyMatch = raw_text.match(/\$\d{2,3}(?:,\d{3})*(?:\s*-\s*\$\d{2,3}(?:,\d{3})*)?/g)
      if (moneyMatch) salary = moneyMatch[0]
    }

    return { location, employmentType, salary, benefits }
  }, [raw_text])

  return (
    <Card className="dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40 text-left">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2 font-display">
              <Briefcase className="text-brand-500 h-5 w-5 shrink-0" />
              <span>{title || 'Untitled Role'}</span>
            </CardTitle>
            <div className="flex items-center gap-1.5 text-sm text-slate-550 dark:text-slate-400 font-sans">
              <Building size={14} className="text-slate-400" />
              <span>{company || 'Unknown Company'}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {extractedMeta.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin size={10} />
                <span>{extractedMeta.location}</span>
              </Badge>
            )}
            {extractedMeta.employmentType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar size={10} />
                <span>{extractedMeta.employmentType}</span>
              </Badge>
            )}
            {extractedMeta.salary && (
              <Badge variant="success" className="flex items-center gap-1 font-mono">
                <DollarSign size={10} />
                <span>{extractedMeta.salary}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Core details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
              Required Experience
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-sans">
              {experience.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1">
                  {experience.map((exp, idx) => <li key={idx}>{exp}</li>)}
                </ul>
              ) : (
                <p>Not specified in description</p>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
              Required Education
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-sans">
              {education.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {education.map((edu, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px] font-sans">
                      {edu}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p>Not specified in description</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills list */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Skills Breakdown</h4>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Required Technical Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {required_skills.length > 0 ? (
                  required_skills.map((skill, idx) => (
                    <Badge key={idx} variant="default" className="text-[10px] font-sans">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None detected</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1.5 mt-2">
                Preferred/Plus Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {preferred_skills.length > 0 ? (
                  preferred_skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] font-sans">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None detected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Responsibilities list */}
        {responsibilities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Responsibilities</h4>
            <ul className="text-xs text-slate-650 dark:text-slate-400 space-y-1.5 list-disc pl-5 font-sans leading-relaxed">
              {responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits heuristic */}
        {extractedMeta.benefits && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Gift size={14} className="text-emerald-500" />
              <span>Benefits & Perks</span>
            </h4>
            <p className="text-xs text-slate-650 dark:text-slate-400 font-sans leading-relaxed">
              {extractedMeta.benefits}
            </p>
          </div>
        )}

        {/* Metadata section */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/40 pt-4">
          <div className="flex items-center gap-1 font-mono">
            <Settings size={12} />
            <span>Parser Version: {parserVersion}</span>
          </div>
          {generatedAt && (
            <span>Parsed at: {new Date(generatedAt).toLocaleString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default JobCard
