import type { ParsedResumeData } from '@/types/resume'
import type { SampleResumeData } from '../templates/types'

/**
 * Converts backend ParsedResumeData into SampleResumeData for the V3 Resume Builder
 */
export function parsedDataToSampleResume(
  parsed: ParsedResumeData | null | undefined,
  fallbackFilename: string = 'Resume Profile'
): SampleResumeData {
  if (!parsed || !parsed.data) {
    return {
      fullName: fallbackFilename.replace(/\.[^/.]+$/, ''),
      professionalTitle: 'AI/ML Engineer',
      headline: 'Software & AI Systems Developer',
      email: 'user@scorelia.ai',
      phone: '+91 98765 43210',
      countryCode: '+91',
      location: 'India',
      website: '',
      linkedin: '',
      github: '',
      summary:
        'Driven software professional with experience in machine learning, full-stack web development, and data pipelines.',
      experience: [
        {
          id: 'exp-1',
          title: 'Software Developer',
          company: 'Scorelia Systems',
          location: 'Remote',
          startDate: '2024',
          endDate: 'Present',
          current: true,
          bullets: [
            'Built scalable RESTful APIs and modern frontend user interfaces.',
            'Collaborated with cross-functional teams to deliver high-quality software.',
          ],
        },
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'Bachelor of Technology in Computer Science',
          institution: 'University',
          location: 'India',
          startDate: '2020',
          endDate: '2024',
          gpa: '8.5 / 10',
        },
      ],
      skills: [
        {
          id: 's-1',
          name: 'Core Skills',
          skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Git', 'React'],
        },
      ],
      projects: [],
      certifications: [],
      languages: [
        { id: 'l-1', name: 'English', proficiency: 'Fluent' },
      ],
      achievements: [],
      references: [],
      availableUponRequest: true,
    }
  }

  const { data } = parsed
  const linksList = Array.isArray(data.links?.value) ? data.links.value : []

  const linkedinLink = linksList.find((l) => typeof l === 'string' && l.toLowerCase().includes('linkedin')) || ''
  const githubLink = linksList.find((l) => typeof l === 'string' && l.toLowerCase().includes('github')) || ''
  const websiteLink = linksList.find((l) => typeof l === 'string' && !l.toLowerCase().includes('linkedin') && !l.toLowerCase().includes('github')) || ''

  const expList = Array.isArray(data.experience?.value) ? data.experience.value : []
  const eduList = Array.isArray(data.education?.value) ? data.education.value : []
  const skillsList = Array.isArray(data.skills?.value) ? data.skills.value : []
  const projList = Array.isArray(data.projects?.value) ? data.projects.value : []
  const certList = Array.isArray(data.certifications?.value) ? data.certifications.value : []
  const langList = Array.isArray(data.languages?.value) ? data.languages.value : []
  const achList = Array.isArray(data.achievements?.value) ? data.achievements.value : []

  return {
    fullName: data.name?.value || fallbackFilename.replace(/\.[^/.]+$/, ''),
    professionalTitle: 'Professional Profile',
    headline: 'Software Engineer & AI Solutions Architect',
    email: data.email?.value || '',
    phone: data.phone?.value || '',
    countryCode: '+91',
    location: 'India',
    website: websiteLink,
    linkedin: linkedinLink,
    github: githubLink,
    summary: data.summary?.value || '',
    experience: expList.map((exp, idx) => {
      const durationStr = typeof exp.duration === 'string' ? exp.duration : ''
      return {
        id: `exp-${idx}`,
        title: exp.title || 'Position',
        company: exp.company || 'Company',
        location: 'Remote',
        startDate: durationStr.split('-')[0]?.trim() || '2024',
        endDate: durationStr.split('-')[1]?.trim() || 'Present',
        current: durationStr.toLowerCase().includes('present') || false,
        bullets: exp.description
          ? exp.description.split('. ').map((s) => s.trim()).filter(Boolean)
          : exp.raw_text
          ? [exp.raw_text]
          : [],
      }
    }),
    education: eduList.map((edu, idx) => {
      const yearStr = typeof edu.year === 'string' ? edu.year : ''
      return {
        id: `edu-${idx}`,
        degree: edu.degree || 'Degree',
        institution: edu.institution || 'Institution',
        location: 'India',
        startDate: yearStr.split('-')[0]?.trim() || '2020',
        endDate: yearStr.split('-')[1]?.trim() || '2024',
        gpa: '8.5 / 10',
      }
    }),
    skills: [
      {
        id: 's-1',
        name: 'Technical Skills',
        skills: skillsList,
      },
    ],
    projects: projList.map((p, idx) => ({
      id: `proj-${idx}`,
      name: p.name || 'Project',
      subtitle: Array.isArray(p.technologies)
        ? p.technologies.join(', ')
        : typeof p.technologies === 'string'
        ? p.technologies
        : '',
      bullets: p.description ? [p.description] : p.raw_text ? [p.raw_text] : [],
    })),
    certifications: certList.map((cert, idx) => ({
      id: `cert-${idx}`,
      name: typeof cert === 'string' ? cert : (cert as any)?.name || 'Certification',
      issuer: 'Verified Issuer',
      date: '2024',
    })),
    languages: langList.map((lang, idx) => ({
      id: `lang-${idx}`,
      name: typeof lang === 'string' ? lang : (lang as any)?.name || 'Language',
      proficiency: 'Fluent',
    })),
    achievements: achList.map((ach, idx) => ({
      id: `ach-${idx}`,
      title: typeof ach === 'string' ? ach : (ach as any)?.title || 'Achievement',
      description: typeof ach === 'string' ? ach : (ach as any)?.description || '',
    })),
    references: [],
    availableUponRequest: true,
  }
}

/**
 * Converts frontend SampleResumeData back into ParsedResumeData structure for backend save PUT /resumes/{id}
 */
export function sampleResumeToParsedData(
  sample: SampleResumeData,
  existingParsed: ParsedResumeData | null
): ParsedResumeData {
  return {
    parser_version: existingParsed?.parser_version || 'v3.0.0-scorelia',
    parsed_at: new Date().toISOString(),
    model: existingParsed?.model || 'gpt-4o-mini',
    statistics: {
      text_length: 1200,
      page_count: 1,
      skills_found: (sample.skills || []).reduce((acc, cat) => acc + (cat.skills?.length || 0), 0),
      education_found: (sample.education || []).length,
      experience_found: (sample.experience || []).length,
      projects_found: (sample.projects || []).length,
      certifications_found: (sample.certifications || []).length,
      links_found: [sample.linkedin, sample.github, sample.website].filter(Boolean).length,
      processing_time_ms: 250,
      empty_sections: 0,
    },
    data: {
      name: { value: sample.fullName || '', confidence: 0.99 },
      email: { value: sample.email || '', confidence: 0.99 },
      phone: { value: sample.phone || '', confidence: 0.99 },
      links: {
        value: [sample.linkedin, sample.github, sample.website].filter(Boolean),
        confidence: 0.95,
      },
      skills: {
        value: (sample.skills || []).flatMap((cat) => cat.skills || []),
        confidence: 0.98,
      },
      summary: { value: sample.summary || '', confidence: 0.95 },
      education: {
        value: (sample.education || []).map((edu) => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          year: `${edu.startDate || ''} - ${edu.endDate || ''}`,
          raw_text: `${edu.degree || ''} at ${edu.institution || ''}`,
        })),
        confidence: 0.95,
      },
      experience: {
        value: (sample.experience || []).map((exp) => ({
          title: exp.title || '',
          company: exp.company || '',
          duration: `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`,
          description: (exp.bullets || []).join('. '),
          raw_text: `${exp.title || ''} at ${exp.company || ''}`,
        })),
        confidence: 0.95,
      },
      projects: {
        value: (sample.projects || []).map((p) => ({
          name: p.name || '',
          description: (p.bullets || []).join('. '),
          technologies: p.subtitle ? p.subtitle.split(',').map((s) => s.trim()) : [],
          raw_text: p.name || '',
        })),
        confidence: 0.95,
      },
      certifications: {
        value: (sample.certifications || []).map((c) => c.name || ''),
        confidence: 0.95,
      },
      languages: {
        value: (sample.languages || []).map((l) => `${l.name || ''} (${l.proficiency || ''})`),
        confidence: 0.95,
      },
      achievements: {
        value: (sample.achievements || []).map((a) => a.title || ''),
        confidence: 0.95,
      },
    },
  }
}
