export interface EducationItem {
  degree: string | null
  institution: string | null
  year: string | null
  raw_text: string | null
}

export interface ExperienceItem {
  title: string | null
  company: string | null
  duration: string | null
  description: string | null
  raw_text: string | null
}

export interface ProjectItem {
  name: string | null
  description: string | null
  technologies: string[]
  raw_text: string | null
}

export interface ConfidentStr {
  value: string | null
  confidence: number
}

export interface ConfidentStrList {
  value: string[]
  confidence: number
}

export interface ConfidentEducationList {
  value: EducationItem[]
  confidence: number
}

export interface ConfidentExperienceList {
  value: ExperienceItem[]
  confidence: number
}

export interface ConfidentProjectList {
  value: ProjectItem[]
  confidence: number
}

export interface ParsedResumeDataStatistics {
  text_length: number
  page_count: number
  skills_found: number
  education_found: number
  experience_found: number
  projects_found: number
  certifications_found: number
  links_found: number
  processing_time_ms: number
  empty_sections: number
  summary_found?: number | null
  languages_found?: number | null
  achievements_found?: number | null
}

export interface ParsedResumeDataInner {
  name: ConfidentStr
  email: ConfidentStr
  phone: ConfidentStr
  links: ConfidentStrList
  skills: ConfidentStrList
  education: ConfidentEducationList
  experience: ConfidentExperienceList
  projects: ConfidentProjectList
  certifications: ConfidentStrList
  summary?: ConfidentStr | null
  languages?: ConfidentStrList | null
  achievements?: ConfidentStrList | null
}

export interface ParsedResumeData {
  parser_version: string
  parsed_at: string
  model: string
  statistics: ParsedResumeDataStatistics
  data: ParsedResumeDataInner
}

export interface ResumeResponse {
  id: string
  user_id: string
  original_filename: string
  file_size: number
  file_type: string
  storage_provider: string
  status: string
  ats_score: number | null
  uploaded_at: string
  created_at: string
  updated_at: string
  parsed_data: ParsedResumeData | null
  error_message: string | null
}
